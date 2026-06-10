#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';

const ROOT = path.resolve(import.meta.dirname, '..');
const DEFAULT_GOAL = path.join(ROOT, 'theme-import-goal.json');
const THEMES_DIR = path.join(ROOT, 'src/components/themes');
const OUTPUT_DIR = path.join(ROOT, 'output');
const MIGRATION_ONLY_DIRS = new Set(['uploads', 'screens', 'screenshots', 'shots', 'scratch']);

const STRUCTURAL_BLOCKS = {
  theme05: {
    type: 'browser_global_iife',
    reason: '页面组件大量使用 IIFE 和 window.Pulse* 全局注册,不是可直接迁移的 ES Module。',
    request: '请改成每页独立 React JSX ES Module,导出 default component、default props 和 controls。',
  },
};

setupDomStubs();

const goalPath = path.resolve(process.argv[2] || DEFAULT_GOAL);
const goal = JSON.parse(fs.readFileSync(goalPath, 'utf8'));
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
cleanGeneratedThemeDirs();

const report = {
  generatedAt: new Date().toISOString(),
  sourceRoot: goal.sourceRoot,
  themes: [],
};
const integratedThemes = [];
const integratedPages = [];
const blocked = [];
const warnings = [];

for (const theme of goal.themes) {
  const audit = inspectTheme(goal.sourceRoot, theme);
  const structuralBlock = STRUCTURAL_BLOCKS[theme.key];
  if (!audit.entryExists) {
    audit.status = 'blocked_for_claude';
    audit.blockReason = 'entry_missing';
    audit.conclusion = `入口文件不存在: ${theme.entry}`;
    blocked.push(blockedItem(theme, audit, '入口文件不存在', audit.conclusion, '按 theme-import-goal.json 中的 entry 文件名补齐或修正源目录文件名。'));
    report.themes.push(audit);
    continue;
  }
  if (structuralBlock) {
    audit.status = 'blocked_for_claude';
    audit.blockReason = structuralBlock.type;
    audit.conclusion = structuralBlock.reason;
    blocked.push(blockedItem(theme, audit, '组件结构不符合迁移标准', structuralBlock.reason, structuralBlock.request));
    report.themes.push(audit);
    continue;
  }

  try {
    const themeDir = path.join(THEMES_DIR, theme.key);
    const copiedSourceDir = path.join(themeDir, 'source');
    copyThemeSource(audit.sourceDir, copiedSourceDir);
    if (theme.key === 'theme01') patchTheme01Source(copiedSourceDir);
    if (theme.key === 'theme12') patchTheme12Source(copiedSourceDir);
    generateRuntime(theme, audit.sourceDir, themeDir);
    const runtimeModule = await import(`${pathToFileURL(path.join(themeDir, 'runtime.jsx')).href}?t=${Date.now()}`);
    const pages = serializePages(runtimeModule.runtimePages || [], theme);
    if (!pages.length) throw new Error('没有识别到任何页面');
    const contractReview = evaluatePropsContract(pages);
    if (contractReview.blocking) {
      fs.rmSync(themeDir, { recursive: true, force: true });
      audit.status = 'blocked_for_claude';
      audit.blockReason = 'controls_contract_incomplete';
      audit.pageCount = pages.length;
      audit.componentCount = audit.jsxCount;
      audit.conclusion = contractReview.blocking;
      blocked.push(blockedItem(theme, audit, '页面控制契约不完整', contractReview.blocking, '请确保每页组件都通过 controls 暴露可调页面属性。'));
      report.themes.push(audit);
      continue;
    }
    if (contractReview.warning) {
      audit.warning = contractReview.warning;
      warnings.push({ themeKey: theme.key, themeName: theme.name, warning: contractReview.warning });
    }
    writeMetadata(themeDir, pages, theme);
    audit.status = theme.mode === 'replace' ? 'replaced' : 'ready';
    audit.pageCount = pages.length;
    audit.componentCount = audit.jsxCount;
    audit.conclusion = `已接入 ${pages.length} 页`;
    integratedThemes.push({
      key: theme.key,
      label: theme.name,
      name: theme.name,
      mode: theme.mode,
      pageCount: pages.length,
    });
    integratedPages.push(...pages);
  } catch (error) {
    fs.rmSync(path.join(THEMES_DIR, theme.key), { recursive: true, force: true });
    audit.status = 'blocked_for_claude';
    audit.blockReason = 'project_import_failed';
    audit.conclusion = error?.message || String(error);
    blocked.push(blockedItem(theme, audit, '项目侧导入失败', audit.conclusion, '保持页面为标准 ES Module,移除无法在项目打包/runtime 中导入的浏览器全局副作用。'));
  }
  report.themes.push(audit);
}

writeGeneratedMetadata(integratedThemes, integratedPages);
writeClientRuntime(integratedThemes);
writeAuditReport(report);
writeBlockedReport(blocked);
writeWarningReport(warnings);
writeSummary(goal, integratedThemes, blocked, warnings);

console.log(`Imported ${integratedThemes.length} theme(s), blocked ${blocked.length}.`);

function inspectTheme(sourceRoot, theme) {
  const sourceDir = path.join(sourceRoot, theme.source);
  const entryPath = path.join(sourceDir, theme.entry);
  const files = fs.existsSync(sourceDir) ? walk(sourceDir) : [];
  const textFiles = files.filter(file => /\.(jsx?|tsx?|html|css)$/i.test(file));
  const joined = textFiles.map(readTextSafe).join('\n');
  const entryText = fs.existsSync(entryPath) ? fs.readFileSync(entryPath, 'utf8') : '';
  return {
    key: theme.key,
    name: theme.name,
    source: theme.source,
    sourceDir,
    entry: theme.entry,
    entryExists: fs.existsSync(entryPath),
    alternateEntries: files
      .filter(file => /\.html$/i.test(file))
      .map(file => path.relative(sourceDir, file)),
    mode: theme.mode,
    totalFiles: files.length,
    jsxCount: files.filter(file => /\.jsx$/i.test(file)).length,
    jsCount: files.filter(file => /\.js$/i.test(file)).length,
    assetCount: files.filter(file => /\.(png|jpe?g|webp|svg|gif|mp4|mov)$/i.test(file)).length,
    hasAbsolutePaths: /\/Volumes\/|\/Users\/|\/Downloads\/|file:\/\//.test(joined),
    hasIndependentJsx: files.some(file => /\.jsx$/i.test(file)),
    hasControls: /\bcontrols\b|slideSpec|Tweaks|tweaks|\.META\s*=/.test(joined),
    hasMediaSlots: /slot|Slot|imageSlots|videoSlots|mediaCount|imageCount|uploads|upload/i.test(joined),
    entrySlideHints: {
      sections: count(/<section\b/gi, entryText),
      dataSlide: count(/data-slide/gi, entryText),
      deckSlide: count(/deck-slide/gi, entryText),
      slideClass: count(/class=["'][^"']*slide/gi, entryText),
    },
    pageCount: 0,
    componentCount: 0,
    status: 'needs_adapter',
    conclusion: '',
  };
}

function copyThemeSource(fromDir, toDir) {
  fs.rmSync(toDir, { recursive: true, force: true });
  for (const file of walk(fromDir)) {
    const rel = path.relative(fromDir, file);
    if (shouldSkipSourceFile(rel)) continue;
    const target = path.join(toDir, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target);
  }
}

function shouldSkipSourceFile(rel) {
  const parts = rel.split(path.sep);
  if (parts.some(part => MIGRATION_ONLY_DIRS.has(part.toLowerCase()))) return true;
  const base = path.basename(rel);
  if (base === '.DS_Store' || base === 'audit-offenders.txt') return true;
  if (base.toLowerCase().endsWith('.identifier')) return true;
  if (/\.(md|html)$/i.test(base)) return true;
  if (['deck-stage.js', 'tweaks-panel.jsx', 'preview-loader.js', 'preview.jsx', 'DeckApp.jsx', 'Tweaks.jsx', 'ignDemo.jsx'].includes(base)) return true;
  if (base === 'app.jsx' || base === '_preview.jsx') return true;
  return false;
}

function patchTheme01Source(sourceDir) {
  const slidesDir = path.join(sourceDir, 'slides');
  replaceInFile(path.join(slidesDir, 'index.jsx'), text => {
    const removeLines = new Set([
      "import Slide03bTrendGlass, { defaultProps as p3b, controls as c3b } from './Slide03bTrendGlass.jsx';",
      "import SlideStaggerCards, { defaultProps as pScd, controls as cScd } from './SlideStaggerCards.jsx';",
      "import SlideFlowCascade, { defaultProps as pFlc, controls as cFlc } from './SlideFlowCascade.jsx';",
      "import SlideTriadOrbit, { defaultProps as pTri, controls as cTri } from './SlideTriadOrbit.jsx';",
      "import SlideIsoBars, { defaultProps as pIso, controls as cIso } from './SlideIsoBars.jsx';",
      "  SlideStaggerCards, SlideFlowCascade, SlideTriadOrbit,",
      "  { id: 'trend-glass', label: '纵向趋势 · 立体', component: Slide03bTrendGlass, defaultProps: p3b, controls: c3b },",
      "  { id: 'flow-chain', label: '价值传导链路', component: SlideFlowCascade, defaultProps: pFlc, controls: cFlc },",
      "  { id: 'four-types', label: '四类机会 · 错落卡片', component: SlideStaggerCards, defaultProps: pScd, controls: cScd },",
      "  { id: 'triad', label: '集中度三维度 · 三元环', component: SlideTriadOrbit, defaultProps: pTri, controls: cTri },",
      "  { id: 'iso-bars', label: '等距柱状图 · 赛道合计', component: SlideIsoBars, defaultProps: pIso, controls: cIso },",
    ]);
    return text
      .split('\n')
      .filter(line => !removeLines.has(line))
      .join('\n')
      .replace('  Slide03bTrendGlass, Slide13Monthly, Slide14CaseBrief, Slide15Conclusion,', '  Slide13Monthly, Slide14CaseBrief, Slide15Conclusion,')
      .replace('  SlideHeatmap, SlideGrowthBars, SlideHeroOverlay, SlideKpiDial, SlideEvilBars, SlideIsoBars,', '  SlideHeatmap, SlideGrowthBars, SlideHeroOverlay, SlideKpiDial, SlideEvilBars,');
  });
  [
    'Slide03bTrendGlass.jsx',
    'SlideFlowCascade.jsx',
    'SlideStaggerCards.jsx',
    'SlideTriadOrbit.jsx',
    'SlideIsoBars.jsx',
  ].forEach(file => fs.rmSync(path.join(slidesDir, file), { force: true }));
  replaceInFile(path.join(slidesDir, 'SlideStickerWall.jsx'), text => text.replace(
    /\/\/ SlideStickerWall[^\n]*\n\/\/ design language from uploads\/[^\n]*\n\/\/ black\/white\/fluorescent tones[^\n]*\n/,
    '',
  ));
  replaceInFile(path.join(slidesDir, 'SlideQuote.jsx'), text => text.replace(
    /\/\/ Visual language \(drawn from uploads\/[^\n]*\n\/\/ system [^\n]*\n\/\/ sticker[^\n]*\n/,
    '',
  ));
}

function patchTheme12Source(sourceDir) {
  const baseFile = path.join(sourceDir, 'src/swBase.jsx');
  replaceInFile(baseFile, text => {
    if (text.includes('export function swDeckSection')) return text;
    return text
      .replace(
        'function swRevealTargets(root) {',
        "export function swDeckSection(root) {\n  return root?.closest?.('[data-deck-slide], .slide');\n}\n\nfunction swRevealTargets(root) {",
      )
      .replace(
        "    const section = root.closest('[data-deck-slide]') || root.parentElement;\n    if (!section || !section.hasAttribute || !section.hasAttribute('data-deck-slide')) {",
        '    const section = swDeckSection(root);\n    if (!section) {',
      );
  });

  replaceInFile(path.join(sourceDir, 'src/SwSlideCoverWave.jsx'), text => {
    if (text.includes('swDeckSection')) return text;
    return text
      .replace(
        "import { SlideRoot, Bar, Footer, Hl, renderSwText } from './swBase.jsx';",
        "import { SlideRoot, Bar, Footer, Hl, renderSwText, swDeckSection } from './swBase.jsx';",
      )
      .replace("    const section = root.closest('[data-deck-slide]');", '    const section = swDeckSection(root);');
  });

  replaceInFile(path.join(sourceDir, 'src/SwSlideManifesto.jsx'), text => {
    if (text.includes('swDeckSection')) return text;
    return text
      .replace(
        "import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';",
        "import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText, swDeckSection } from './swBase.jsx';",
      )
      .replace(
        "  const [entered, setEntered] = React.useState(false);\n  React.useEffect(() => { injectCoverAnim(); const t = setTimeout(() => setEntered(true), 40); return () => clearTimeout(t); }, []);",
        "  const rootRef = React.useRef(null);\n  const [entered, setEntered] = React.useState(false);\n  React.useEffect(() => { injectCoverAnim(); }, []);\n  React.useEffect(() => {\n    const root = rootRef.current;\n    if (!root) return;\n    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;\n    if (reduce) { setEntered(true); return; }\n    const section = swDeckSection(root);\n    if (!section) { const t = setTimeout(() => setEntered(true), 40); return () => clearTimeout(t); }\n    const sync = () => setEntered(section.hasAttribute('data-deck-active'));\n    sync();\n    const mo = new MutationObserver(sync);\n    mo.observe(section, { attributes: true, attributeFilter: ['data-deck-active'] });\n    return () => mo.disconnect();\n  }, []);",
      )
      .replace(
        "    <SlideRoot bg={C.blush} color={C.ink} className={'sw-cover-root' + (entered ? ' is-in' : '')}>",
        "    <SlideRoot bg={C.blush} color={C.ink} className={'sw-cover-root' + (entered ? ' is-in' : '')}>\n      <div ref={rootRef} data-sw-no-reveal=\"\" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />",
      );
  });
}

function replaceInFile(file, replacer) {
  if (!fs.existsSync(file)) return;
  const before = fs.readFileSync(file, 'utf8');
  const after = replacer(before);
  if (after !== before) fs.writeFileSync(file, after);
}

function generateRuntime(theme, sourceDir, themeDir) {
  fs.mkdirSync(themeDir, { recursive: true });
  const layoutPrefix = theme.key.toUpperCase();
  let code;
  if (theme.key === 'theme01') {
    code = registryRuntime(theme, layoutPrefix, './source/slides/index.jsx', 'slides');
  } else if (theme.key === 'theme03') {
    code = theme03Runtime(theme, layoutPrefix, sourceDir);
  } else if (theme.key === 'theme12') {
    code = registryRuntime(theme, layoutPrefix, './source/src/index.js', 'swSlides');
  } else if (theme.key === 'theme02') {
    code = theme02Runtime(theme, layoutPrefix, sourceDir);
  } else if (theme.key === 'theme06') {
    code = previewArrayRuntime(theme, layoutPrefix, sourceDir, 'slides/_preview.jsx', 'SLIDES');
  } else if (theme.key === 'theme11') {
    code = previewArrayRuntime(theme, layoutPrefix, sourceDir, 'ignDemo.jsx', 'PAGES');
  } else if (theme.key === 'theme04') {
    code = metaArrayRuntime(theme, layoutPrefix, sourceDir, 'app.jsx', 'SLIDES');
  } else if (theme.key === 'theme10') {
    code = theme10Runtime(theme, layoutPrefix, sourceDir);
  } else if (theme.key === 'theme07') {
    code = dataPageRuntime(theme, layoutPrefix, sourceDir);
  } else if (theme.key === 'theme08') {
    code = pageFilesRuntime(theme, layoutPrefix, sourceDir);
  } else if (theme.key === 'theme09') {
    code = slideSpecRuntime(theme, layoutPrefix, sourceDir);
  } else {
    throw new Error(`No runtime generator for ${theme.key}`);
  }
  fs.writeFileSync(path.join(themeDir, 'runtime.jsx'), code);
}

function registryRuntime(theme, layoutPrefix, importPath, exportName) {
  return `import { normalizeRuntimePages } from '../runtime-helpers.jsx';\nimport { ${exportName} as rawPages } from '${importPath}';\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n`;
}

function theme03Runtime(theme, layoutPrefix, sourceDir) {
  const css = fs.readFileSync(path.join(sourceDir, 'src/theme.css'), 'utf8');
  const forceDarkCss = `
body.rd-force-dark .rd-slide,
.theme03-force-dark .rd-slide { --rd-bg:#161513; --rd-ink:#f3f2ee; --rd-ink-2:#b8b6b0; --rd-ink-3:#84827c; --rd-line:rgba(243,242,238,0.22); --rd-line-2:rgba(243,242,238,0.10); --rd-panel:#f3f2ee; }
body.rd-force-dark .rd-slide .rd-tag--lime,
.theme03-force-dark .rd-slide .rd-tag--lime { color:#161513; }
.theme03-theme-shell { position:absolute; inset:0; width:100%; height:100%; }
.theme03-theme-toggle { position:fixed; top:calc(var(--deck-top, 0px) + 22px); left:calc(var(--deck-left, 0px) + var(--deck-w, 100vw) - 78px); right:auto; z-index:9999; width:56px; height:56px; padding:0; display:inline-flex; align-items:center; justify-content:center; background:#2742ec; color:#f3f5ff; border:2px solid #161513; border-radius:0; cursor:pointer; box-shadow:4px 4px 0 rgba(22,21,19,.85); transition:transform .12s ease, box-shadow .12s ease, background .15s ease; }
.theme03-theme-toggle:hover { transform:translate(-1px,-1px); box-shadow:5px 5px 0 rgba(22,21,19,.85); }
.theme03-theme-toggle:active { transform:translate(2px,2px); box-shadow:1px 1px 0 rgba(22,21,19,.85); }
body.rd-force-dark .theme03-theme-toggle { background:#c2f53d; color:#161513; border-color:#f3f2ee; box-shadow:4px 4px 0 rgba(243,242,238,.35); }
body.rd-force-dark .theme03-theme-toggle:hover { box-shadow:5px 5px 0 rgba(243,242,238,.35); }
.theme03-theme-toggle svg { width:24px; height:24px; display:block; }
.theme03-theme-toggle .ic-sun { display:none; }
body.rd-force-dark .theme03-theme-toggle .ic-moon { display:none; }
body.rd-force-dark .theme03-theme-toggle .ic-sun { display:block; }
::view-transition-old(root),
::view-transition-new(root) { animation:none; mix-blend-mode:normal; }
html[data-theme-vt="active"]::view-transition-group(root) { animation-duration:var(--theme-vt-dur, 550ms); }
`;
  return `import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import { SLIDES as sourcePages } from './source/src/registry.js';
import ICONS from './source/src/icons.js';
import { setRDDark } from './source/src/theme.js';

const THEME03_BASE_CSS = ${JSON.stringify(css)};
const THEME03_FORCE_DARK_CSS = ${JSON.stringify(forceDarkCss)};
const THEME03_ICON_OPTIONS = ICONS.map(icon => ({
  value: icon.src,
  label: icon.label || icon.id,
  image: icon.src,
}));
const THEME03_FORCE_DARK_CONTROL = {
  key: 'forceDark',
  type: 'toggle',
  label: '全局深色',
  default: true,
  description: '复刻 Claude Design 右上角深浅配色切换。',
};
let theme03GlobalDark = null;
const theme03GlobalListeners = new Set();

const rawPages = sourcePages.map(entry => ({
  ...entry,
  Component: withTheme03Base(entry.Component),
  controls: [THEME03_FORCE_DARK_CONTROL, ...theme03Controls(entry.controls || [])],
  defaultProps: { ...(entry.defaultProps || entry.defaults || {}), forceDark: true },
}));

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });

function theme03Controls(controls) {
  return controls.map(control => control.type === 'icons'
    ? { ...control, options: THEME03_ICON_OPTIONS }
    : control);
}

function withTheme03Base(Component) {
  return function Theme03Page(props = {}) {
    const { forceDark = true, ...componentProps } = props;
    const [dark, setDark] = React.useState(() => theme03ReadInitialDark(forceDark !== false));
    const mountedRef = React.useRef(false);

    React.useEffect(() => {
      const listener = next => setDark(next);
      theme03GlobalListeners.add(listener);
      return () => theme03GlobalListeners.delete(listener);
    }, []);

    React.useEffect(() => {
      if (!mountedRef.current) {
        mountedRef.current = true;
        return;
      }
      theme03SetGlobalDark(forceDark !== false);
    }, [forceDark]);

    setRDDark(dark);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('style', null, THEME03_BASE_CSS),
      React.createElement('style', null, THEME03_FORCE_DARK_CSS),
      React.createElement(
        'div',
        { className: 'theme03-theme-shell' + (dark ? ' theme03-force-dark' : '') },
        React.createElement(Component, componentProps),
        React.createElement(Theme03GlobalToggle),
      ),
    );
  };
}

function Theme03GlobalToggle() {
  React.useEffect(() => {
    theme03ToggleMounts += 1;
    theme03EnsureToggleButton();
    theme03SyncToggleButton();
    return () => {
      theme03ToggleMounts -= 1;
      if (theme03ToggleMounts <= 0) theme03RemoveToggleButton();
    };
  }, []);
  return null;
}

let theme03ToggleButton = null;
let theme03ToggleMounts = 0;
let theme03ToggleObserver = null;
let theme03ToggleEventsBound = false;

function theme03ShouldShowToggle() {
  if (typeof document === 'undefined') return false;
  try {
    const options = JSON.parse(document.getElementById('preview-options')?.textContent || '{}');
    const activeThemePack = document.documentElement.dataset.themePack;
    const activeSlide = document.querySelector('[data-theme-pack="theme03"][data-deck-active]');
    return Boolean(options.themePacks?.theme03 && (activeThemePack === 'theme03' || activeSlide));
  } catch {
    return false;
  }
}

function theme03ReadInitialDark(fallback) {
  if (theme03GlobalDark !== null) return theme03GlobalDark;
  theme03GlobalDark = fallback;
  try {
    const stored = window.localStorage.getItem('rd-theme');
    if (stored === 'light') theme03GlobalDark = false;
    if (stored === 'dark') theme03GlobalDark = true;
  } catch {}
  setRDDark(theme03GlobalDark);
  theme03ApplyBodyDarkClass(theme03GlobalDark);
  return theme03GlobalDark;
}

function theme03ToggleDark(next, button) {
  const run = () => theme03SetGlobalDark(next);
  if (!button || typeof document === 'undefined' || document.hidden || typeof document.startViewTransition !== 'function') { run(); return; }
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const maxR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const clip = ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + maxR + 'px at ' + x + 'px ' + y + 'px)'];
  const root = document.documentElement;
  root.dataset.themeVt = 'active';
  root.style.setProperty('--theme-vt-dur', '550ms');
  const cleanup = () => {
    delete root.dataset.themeVt;
    root.style.removeProperty('--theme-vt-dur');
  };
  let transition;
  try { transition = document.startViewTransition(run); }
  catch { run(); cleanup(); return; }
  if (transition.finished && transition.finished.then) {
    transition.finished.then(cleanup, () => { run(); cleanup(); });
  } else {
    cleanup();
  }
  if (transition.ready && transition.ready.then) {
    transition.ready.then(() => {
      document.documentElement.animate({ clipPath: clip }, {
        duration: 550,
        easing: 'ease-in-out',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      });
    }, () => {});
  }
}

function theme03SetGlobalDark(next) {
  theme03GlobalDark = Boolean(next);
  setRDDark(theme03GlobalDark);
  theme03ApplyBodyDarkClass(theme03GlobalDark);
  try {
    window.localStorage.setItem('rd-theme', theme03GlobalDark ? 'dark' : 'light');
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rd-themechange', { detail: { dark: theme03GlobalDark } }));
  }
  theme03GlobalListeners.forEach(listener => listener(theme03GlobalDark));
  theme03SyncToggleButton();
}

function theme03ApplyBodyDarkClass(dark) {
  if (typeof document === 'undefined') return;
  document.body?.classList.toggle('rd-force-dark', Boolean(dark));
}

function theme03EnsureToggleButton() {
  if (typeof document === 'undefined' || theme03ToggleButton) return theme03ToggleButton;
  const button = document.createElement('button');
  button.id = 'theme-toggle';
  button.type = 'button';
  button.className = 'theme03-theme-toggle';
  button.setAttribute('aria-label', '切换深浅主题');
  button.title = '切换深浅主题';
  button.innerHTML = '<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path></svg><svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"></path></svg>';
  button.addEventListener('click', theme03ToggleButtonClick);
  document.body.appendChild(button);
  theme03ToggleButton = button;
  theme03BindToggleVisibilityEvents();
  return button;
}

function theme03ToggleButtonClick(event) {
  event.stopPropagation();
  theme03ToggleDark(!theme03GlobalDark, theme03ToggleButton);
}

function theme03SyncToggleButton() {
  if (!theme03ToggleButton) return;
  const visible = theme03ShouldShowToggle();
  theme03ToggleButton.hidden = !visible;
  theme03ToggleButton.style.display = visible ? 'inline-flex' : 'none';
  theme03ToggleButton.setAttribute('aria-pressed', String(Boolean(theme03GlobalDark)));
  theme03ApplyBodyDarkClass(theme03GlobalDark);
}

function theme03BindToggleVisibilityEvents() {
  if (theme03ToggleEventsBound || typeof window === 'undefined') return;
  theme03ToggleEventsBound = true;
  window.addEventListener('swiss-slide-change', theme03SyncToggleButton);
  window.addEventListener('storage', theme03SyncToggleButton);
  if (typeof MutationObserver !== 'undefined') {
    theme03ToggleObserver = new MutationObserver(theme03SyncToggleButton);
    theme03ToggleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme-pack'] });
  }
}

function theme03RemoveToggleButton() {
  if (!theme03ToggleButton) return;
  theme03ToggleButton.removeEventListener('click', theme03ToggleButtonClick);
  theme03ToggleButton.remove();
  theme03ToggleButton = null;
  if (theme03ToggleObserver) {
    theme03ToggleObserver.disconnect();
    theme03ToggleObserver = null;
  }
  if (theme03ToggleEventsBound && typeof window !== 'undefined') {
    window.removeEventListener('swiss-slide-change', theme03SyncToggleButton);
    window.removeEventListener('storage', theme03SyncToggleButton);
    theme03ToggleEventsBound = false;
  }
}
`;
}

function previewArrayRuntime(theme, layoutPrefix, sourceDir, sourceFile, arrayName) {
  const abs = path.join(sourceDir, sourceFile);
  const text = fs.readFileSync(abs, 'utf8');
  const arrayLiteral = extractArrayLiteral(text, arrayName);
  const importLines = extractAdjustedImports(text, path.dirname(sourceFile));
  return `import { normalizeRuntimePages } from '../runtime-helpers.jsx';\n${importLines.join('\n')}\n\nconst rawPages = ${arrayLiteral};\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n`;
}

function theme02Runtime(theme, layoutPrefix, sourceDir) {
  const sourceFile = 'src/preview/app.jsx';
  const abs = path.join(sourceDir, sourceFile);
  const text = fs.readFileSync(abs, 'utf8');
  const arrayLiteral = extractArrayLiteral(text, 'SLIDES');
  const importLines = extractAdjustedImports(text, path.dirname(sourceFile));
  return `import React from 'react';\nimport { normalizeRuntimePages } from '../runtime-helpers.jsx';\n${importLines.join('\n')}\n\nconst THEME02_DECK_DEFAULTS = {\n  scheme: 'green',\n  emphasis: 'default',\n  breath: 55,\n  magnet: true,\n  aurora: true,\n  auroraSpeed: 1,\n};\n\nconst THEME02_DECK_CONTROLS = [\n  { key: 'scheme', type: 'enum', label: '配色方案', default: 'green', options: [['green', '霓虹绿'], ['violet', '炫光紫']], desc: '切换整页炫光配色。' },\n  { key: 'emphasis', type: 'enum', label: '强调卡片', default: 'default', options: [['default', '默认发光'], ['ticket', '炫光票卡']], desc: '切换焦点卡片的发光质感。' },\n  { key: 'breath', type: 'slider', label: '内光呼吸感', default: 55, min: 0, max: 100, step: 1, desc: '炫光票卡模式下的内光呼吸强度。' },\n  { key: 'magnet', type: 'toggle', label: '磁吸悬停', default: true, desc: '焦点卡片跟随指针产生轻微位移和倾斜。' },\n  { key: 'aurora', type: 'toggle', label: '渐变流光', default: true, desc: '开启标题、数字和图表重点元素的流光渐变。' },\n  { key: 'auroraSpeed', type: 'slider', label: '流光速度', default: 1, min: 0.4, max: 3, step: 0.1, desc: '流光动画速度。' },\n];\n\nconst sourcePages = ${arrayLiteral};\nconst rawPages = sourcePages.map((entry, index) => ({\n  ...entry,\n  Comp: withTheme02Deck(entry.Comp),\n  controls: [...THEME02_DECK_CONTROLS, ...(entry.controls || [])],\n  defaults: {\n    ...(entry.defaults || {}),\n    ...THEME02_DECK_DEFAULTS,\n    index: index === 0 ? null : String(index).padStart(2, '0') + ' / ' + (sourcePages.length - 1),\n  },\n}));\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n\nfunction theme02SchemeProps(deck) {\n  const selected = GXN_SCHEMES[deck.scheme] || GXN_SCHEMES.green;\n  return {\n    ...(selected.chart || {}),\n    palette: selected.palette,\n    aurora: deck.aurora ? selected.aurora : null,\n    auroraSpeed: deck.auroraSpeed,\n  };\n}\n\nfunction scopedDeckCss(css, scopeClass) {\n  return css.replaceAll('.gxn-theme', '.' + scopeClass + ' .gxn-theme');\n}\n\nfunction withTheme02Deck(Component) {\n  return function Theme02Page(props = {}) {\n    const {\n      scheme = THEME02_DECK_DEFAULTS.scheme,\n      emphasis = THEME02_DECK_DEFAULTS.emphasis,\n      breath = THEME02_DECK_DEFAULTS.breath,\n      magnet = THEME02_DECK_DEFAULTS.magnet,\n      aurora = THEME02_DECK_DEFAULTS.aurora,\n      auroraSpeed = THEME02_DECK_DEFAULTS.auroraSpeed,\n      gxnScheme,\n      ...componentProps\n    } = props;\n    const deck = {\n      scheme: scheme === 'violet' ? 'violet' : 'green',\n      emphasis: emphasis === 'ticket' ? 'ticket' : 'default',\n      breath,\n      magnet: magnet !== false,\n      aurora: aurora !== false,\n      auroraSpeed,\n    };\n    const scopeClass = 'theme02-deck-scope-' + deck.scheme;\n    const rootRef = React.useRef(null);\n    React.useEffect(() => {\n      if (deck.magnet === false) return undefined;\n      const root = rootRef.current;\n      if (!root) return undefined;\n      const reach = 210;\n      const pull = 0.22;\n      const maxShift = 30;\n      const maxTilt = 6.5;\n      const clamp = (value, max) => Math.max(-max, Math.min(max, value));\n      let mx = 0;\n      let my = 0;\n      let hasPointer = false;\n      let pending = false;\n      const apply = () => {\n        pending = false;\n        root.querySelectorAll('.gxn-panel.is-focus').forEach(card => {\n          const active = card.closest('[data-deck-active]');\n          const slide = card.closest('.gxn-slide');\n          const rect = card.getBoundingClientRect();\n          let tx = 0;\n          let ty = 0;\n          let rx = 0;\n          let ry = 0;\n          if (hasPointer && active && slide && rect.width) {\n            const scale = slide.getBoundingClientRect().width / slide.offsetWidth || 1;\n            const cx = rect.left + rect.width / 2;\n            const cy = rect.top + rect.height / 2;\n            const dx = mx - cx;\n            const dy = my - cy;\n            const dist = Math.hypot(dx, dy);\n            const influence = Math.max(rect.width, rect.height) / 2 + reach;\n            if (dist < influence) {\n              const factor = 1 - dist / influence;\n              tx = clamp((dx * pull * factor) / scale, maxShift);\n              ty = clamp((dy * pull * factor) / scale, maxShift);\n              ry = clamp((dx / (rect.width / 2)) * maxTilt * factor, maxTilt);\n              rx = clamp((-dy / (rect.height / 2)) * maxTilt * factor, maxTilt);\n            }\n          }\n          card.style.setProperty('--gxn-mx', tx.toFixed(2) + 'px');\n          card.style.setProperty('--gxn-my', ty.toFixed(2) + 'px');\n          card.style.setProperty('--gxn-rx', rx.toFixed(2) + 'deg');\n          card.style.setProperty('--gxn-ry', ry.toFixed(2) + 'deg');\n        });\n      };\n      const schedule = () => {\n        if (!pending) {\n          pending = true;\n          requestAnimationFrame(apply);\n        }\n      };\n      const onMove = event => {\n        mx = event.clientX;\n        my = event.clientY;\n        hasPointer = true;\n        schedule();\n      };\n      const onLeave = () => {\n        hasPointer = false;\n        schedule();\n      };\n      window.addEventListener('pointermove', onMove, { passive: true });\n      window.addEventListener('blur', onLeave);\n      document.addEventListener('mouseleave', onLeave);\n      return () => {\n        window.removeEventListener('pointermove', onMove);\n        window.removeEventListener('blur', onLeave);\n        document.removeEventListener('mouseleave', onLeave);\n        root.querySelectorAll('.gxn-panel.is-focus').forEach(card => {\n          ['--gxn-mx', '--gxn-my', '--gxn-rx', '--gxn-ry'].forEach(prop => card.style.removeProperty(prop));\n        });\n      };\n    }, [deck.magnet]);\n    const css = scopedDeckCss(deckOverrideCSS(deck), scopeClass);\n    return React.createElement(\n      React.Fragment,\n      null,\n      React.createElement('style', null, css),\n      React.createElement(\n        'div',\n        { ref: rootRef, className: scopeClass, style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } },\n        React.createElement(Component, { ...componentProps, gxnScheme: gxnScheme || theme02SchemeProps(deck) }),\n      ),\n    );\n  };\n}\n`;
}

function metaArrayRuntime(theme, layoutPrefix, sourceDir, sourceFile, arrayName) {
  const abs = path.join(sourceDir, sourceFile);
  const text = fs.readFileSync(abs, 'utf8');
  const arrayLiteral = extractArrayLiteral(text, arrayName);
  const importLines = text
    .split('\n')
    .filter(line => /^import\s+\{\s*meta\s+as\s+/.test(line))
    .map(line => line.replace(/from ['"]\.\/([^'"]+)['"];/, "from './source/$1';"));
  return `import React from 'react';\nimport { normalizeRuntimePages } from '../runtime-helpers.jsx';\nimport './source/image-slot.js';\n${importLines.join('\n')}\n\nconst THEME04_BASE_CSS = ${JSON.stringify(theme04BaseCss())};\nconst rawPages = ${arrayLiteral}.map(entry => ({\n  ...entry,\n  Component: withTheme04Base(entry.Component),\n}));\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n\nfunction withTheme04Base(Component) {\n  return function Theme04Page(props) {\n    return React.createElement(\n      React.Fragment,\n      null,\n      React.createElement('style', null, THEME04_BASE_CSS),\n      React.createElement(Component, props),\n    );\n  };\n}\n`;
}

function theme04BaseCss() {
  return `.xhs-base{width:1920px;height:1080px;position:relative;overflow:hidden;box-sizing:border-box;font-family:"Noto Sans SC",-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:#000;color:#fff;-webkit-font-smoothing:antialiased}.xhs-base *{box-sizing:border-box}`;
}

function theme10Runtime(theme, layoutPrefix, sourceDir) {
  const appText = fs.readFileSync(path.join(sourceDir, 'app.jsx'), 'utf8');
  const html = fs.readFileSync(path.join(sourceDir, theme.entry), 'utf8');
  const arrayLiteral = extractArrayLiteral(appText, 'SLIDES');
  const importLines = appText
    .split('\n')
    .filter(line => /^import\s+\{\s*Slide/.test(line))
    .map(line => line.replace(/from ['"]\.\/([^'"]+)['"];/, "from './source/$1';"));
  const labels = [...html.matchAll(/<section\b[^>]*data-label=["']([^"']*)["']/g)].map(match => match[1]);
  return `import React from 'react';\nimport { normalizeRuntimePages } from '../runtime-helpers.jsx';\n${importLines.join('\n')}\n\nconst THEME10_BASE_CSS = ${JSON.stringify(theme10BaseCss(sourceDir, theme.entry))};\nconst THEMED = new Set(['coverdusk', 'coverfield', 'coveratmostype', 'coverhorizon', 'coverdawn', 'cover', 'chapter', 'sectionstatement', 'quote', 'imagequote', 'fullimg', 'statement', 'bigstat', 'closing', 'showcase', 'poster', 'megafigure', 'divider']);\nconst TONE_DEFAULTS = { ledger: 'light', plans: 'light', principles: 'light', spark: 'light', journey: 'light', capmatrix: 'light', funnel: 'light', checklist: 'light', grouped: 'light', swimlane: 'light', schedule: 'light', pyramid: 'light', glossary: 'light', spectrum: 'light', allocation: 'light', bullet: 'light', team: 'light', steps: 'light', editorial: 'light', magazine: 'light', feature: 'light', faq: 'light', heatmap: 'light', exhibit: 'light', dumbbell: 'light', slope: 'light', curve: 'light', waterfall: 'light', gantt: 'light', ranking: 'light', calendar: 'light', radar: 'light', meter: 'light', mosaic: 'light', cartogram: 'light', board: 'light' };\nconst TONE_CONTROL = { key: 'tone', type: 'radio', label: '页面底色', default: 'dark', options: [['dark', '深色'], ['light', '浅色']], description: '整页深色或浅色底。' };\nconst SECTION_LABELS = ${JSON.stringify(labels, null, 2)};\nconst SLIDES = ${arrayLiteral};\n\nconst rawPages = SLIDES.map((entry, index) => {\n  const meta = entry.C?.META || {};\n  const themed = THEMED.has(entry.id);\n  const tone = TONE_DEFAULTS[entry.id] || 'dark';\n  return {\n    id: entry.id || meta.id,\n    label: SECTION_LABELS[index] || meta.title || entry.id || meta.id,\n    Component: withTheme10Base(entry.C),\n    controls: themed ? (meta.controls || []) : [{ ...TONE_CONTROL, default: tone }, ...(meta.controls || [])],\n    defaultProps: {\n      ...(meta.defaults || {}),\n      ...(entry.content || {}),\n      idPrefix: entry.id,\n      ...(themed ? {} : { tone }),\n    },\n  };\n});\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n\nfunction withTheme10Base(Component) {\n  return function Theme10Page(props = {}) {\n    const { tone, ...componentProps } = props;\n    return React.createElement(\n      React.Fragment,\n      null,\n      React.createElement('style', null, THEME10_BASE_CSS),\n      React.createElement(\n        'div',\n        { className: 'ds-slidewrap deck-theme' + (tone === 'light' ? ' tone-light' : '') },\n        React.createElement(Component, componentProps),\n      ),\n    );\n  };\n}\n`;
}

function theme10BaseCss(sourceDir, entry) {
  const html = fs.readFileSync(path.join(sourceDir, entry), 'utf8');
  const style = /<style>([\s\S]*?)<\/style>/.exec(html)?.[1] || '';
  const motionStart = style.indexOf('@keyframes ds-rise');
  const start = style.indexOf('.deck-theme{');
  const end = style.indexOf('  html,body');
  const motion = motionStart >= 0
    ? style.slice(motionStart).replaceAll('section[data-deck-active]', '[data-deck-active]')
    : '';
  const scoped = start >= 0 && end > start ? style.slice(start, end) : '';
  return `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&family=Noto+Sans+SC:wght@300;400;500&display=swap');\n.deck-theme,.deck-theme *{box-sizing:border-box;}\n${motion}\n${scoped.replace('  *{box-sizing:border-box;}', '')}`;
}

function dataPageRuntime(theme, layoutPrefix, sourceDir) {
  const html = fs.readFileSync(path.join(sourceDir, theme.entry), 'utf8');
  const matches = [...html.matchAll(/<section\b[^>]*data-screen-label=["']([^"']*)["'][\s\S]*?<div\b[^>]*data-page=["']([^"']+)["']/g)];
  const seen = new Map();
  matches.forEach((match, index) => {
    const dataPage = match[2];
    if (!seen.has(dataPage)) {
      seen.set(dataPage, { dataPage, label: match[1] || dataPage, index });
    }
  });
  const pages = [...seen.values()].filter(page => fs.existsSync(path.join(sourceDir, 'src/pages', `${page.dataPage}.jsx`)));
  const imports = pages.map((page, index) => `import * as M${index} from './source/src/pages/${page.dataPage}.jsx';`);
  const items = pages.map((page, index) => `  { id: '${slug(page.dataPage)}', label: ${JSON.stringify(page.label)}, module: M${index} }`);
  return `import { normalizeRuntimePages } from '../runtime-helpers.jsx';\n${imports.join('\n')}\n\nconst modules = [\n${items.join(',\n')}\n];\n\nconst rawPages = modules.map(entry => ({\n  id: entry.id,\n  label: entry.label,\n  Component: entry.module.default,\n  controls: entry.module.controls || entry.module.default?.controls || [],\n  defaultProps: entry.module.defaultProps || entry.module.defaults || entry.module.default?.defaultProps || entry.module.default?.defaults || {},\n}));\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n`;
}

function pageFilesRuntime(theme, layoutPrefix, sourceDir) {
  const html = fs.readFileSync(path.join(sourceDir, theme.entry), 'utf8');
  const files = extractStringArrayAfter(html, 'PAGE_FILES');
  const labels = [...html.matchAll(/\{\s*key:\s*['"]([^'"]+)['"],\s*label:\s*['"]([^'"]+)['"]/g)]
    .map(match => ({ key: match[1], label: match[2] }));
  const imports = [
    "import React from 'react';",
    "import { AclTheme } from './source/components/AclPrimitives.jsx';",
    ...files.map((file, index) => `import * as M${index} from './source/${file}';`),
  ];
  const items = files.map((file, index) => {
    const meta = labels[index] || { key: `p${index + 1}`, label: path.basename(file, '.jsx') };
    return `  { id: '${meta.key}', label: ${JSON.stringify(meta.label)}, module: M${index} }`;
  });
  return `import { normalizeRuntimePages } from '../runtime-helpers.jsx';\n${imports.join('\n')}\n\nconst modules = [\n${items.join(',\n')}\n];\n\nconst rawPages = modules.map(entry => ({\n  id: entry.id,\n  label: entry.label,\n  Component: withAclTheme(entry.module.default),\n  controls: entry.module.controls || entry.module.default?.controls || [],\n  defaultProps: entry.module.defaults || entry.module.defaultProps || entry.module.default?.defaults || {},\n}));\n\nexport const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });\n\nfunction withAclTheme(Component) {\n  return function Theme08Page(props) {\n    return React.createElement(\n      React.Fragment,\n      null,\n      React.createElement(AclTheme),\n      React.createElement(Component, props),\n    );\n  };\n}\n`;
}

function slideSpecRuntime(theme, layoutPrefix, sourceDir) {
  const appText = fs.readFileSync(path.join(sourceDir, 'slides/app.jsx'), 'utf8');
  const html = fs.readFileSync(path.join(sourceDir, theme.entry), 'utf8');
  const importLines = appText
    .split('\n')
    .filter(line => /^import \* as M_/.test(line))
    .map(line => line.replace(/from ['"]\.\/([^'"]+)['"];/, "from './source/slides/$1';"));
  const modulesLiteral = extractArrayLiteral(appText, 'MODULES');
  const sections = [...html.matchAll(/<section\b[^>]*data-label=["']([^"']*)["'][^>]*id=["']slot-([^"']+)["'][^>]*class=["']([^"']*)["']/g)]
    .map(match => ({ label: match[1], slot: match[2], bgClass: match[3] || '' }));
  return `import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
${importLines.join('\n')}

const MODULES = ${modulesLiteral};
const REGISTRY = {};
MODULES.forEach(module => {
  if (module?.slideSpec) REGISTRY[module.slideSpec.slot] = { Component: module.default, spec: module.slideSpec };
});
const ORDERED = ${JSON.stringify(sections, null, 2)};
const rawPages = ORDERED.map(section => {
  const entry = REGISTRY[section.slot];
  if (!entry) return null;
  return {
    id: section.slot,
    label: section.label,
    bgClass: section.bgClass,
    Component: withDkScope(entry.Component),
    spec: entry.spec,
    controls: entry.spec.controls || [],
    defaultProps: defaultsFromSpec(entry.spec),
  };
}).filter(Boolean);

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: '${theme.key}', layoutPrefix: '${layoutPrefix}' });

function defaultsFromSpec(spec) {
  const defaults = { ...(spec.defaults || {}) };
  (spec.controls || []).forEach(control => {
    const key = control.prop || control.key;
    if (!key || control.type === 'labelType' || control.type === 'focus') return;
    if (defaults[key] !== undefined) return;
    defaults[key] = typeof control.default === 'function' ? undefined : control.default;
  });
  return defaults;
}

function withDkScope(Component) {
  return function Theme09Page(props = {}) {
    const activeRef = React.useRef(null);
    React.useEffect(() => {
      const activeRoot = activeRef.current;
      if (!activeRoot) return;
      const section = activeRoot.closest('[data-deck-slide], .slide');
      if (!section) {
        activeRoot.setAttribute('data-deck-active', '');
        return;
      }
      const sync = () => {
        if (section.hasAttribute('data-deck-active')) activeRoot.setAttribute('data-deck-active', '');
        else activeRoot.removeAttribute('data-deck-active');
      };
      sync();
      const observer = new MutationObserver(sync);
      observer.observe(section, { attributes: true, attributeFilter: ['data-deck-active'] });
      return () => observer.disconnect();
    }, []);
    return React.createElement(
      'div',
      { className: 'dk-scope', style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } },
      React.createElement(
        'div',
        { ref: activeRef, style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } },
        React.createElement(Component, props),
      ),
    );
  };
}
`;
}

function extractAdjustedImports(text, sourceFileDir) {
  return text
    .split('\n')
    .filter(line => /^import\s/.test(line) && !line.includes('react') && !line.includes('react-dom') && !line.includes('tweaks') && !line.includes('controls.jsx'))
    .map(line => line.replace(/from ['"]([^'"]+)['"];/, (_, importPath) => {
      if (!importPath.startsWith('.')) return `from '${importPath}';`;
      const resolved = path.posix.normalize(path.posix.join(sourceFileDir.replaceAll(path.sep, '/'), importPath));
      return `from './source/${resolved}';`;
    }));
}

function extractArrayLiteral(text, name) {
  const marker = `${name} = [`;
  let start = text.indexOf(`const ${marker}`);
  if (start < 0) start = text.indexOf(`export const ${marker}`);
  if (start < 0) throw new Error(`Cannot find array ${name}`);
  const bracketStart = text.indexOf('[', start);
  let depth = 0;
  let inString = null;
  let escaped = false;
  for (let i = bracketStart; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    if (ch === ']') {
      depth -= 1;
      if (depth === 0) return text.slice(bracketStart, i + 1);
    }
  }
  throw new Error(`Unclosed array ${name}`);
}

function extractStringArrayAfter(text, name) {
  const arrayLiteral = extractArrayLiteral(text, name);
  return [...arrayLiteral.matchAll(/['"]([^'"]+\.jsx)['"]/g)].map(match => match[1]);
}

function serializePages(runtimePages, theme) {
  return runtimePages.map(page => ({
    key: page.key,
    themeKey: page.themeKey,
    pageNumber: page.pageNumber,
    layout: page.layout,
    slot: page.slot,
    label: page.label,
    bgClass: page.bgClass || '',
    controls: serializeControls(page.controls || []),
    defaultProps: serializeValue(page.defaultProps || {}) || {},
  }));
}

function serializeControls(controls) {
  return (controls || []).map(control => {
    const key = control.key || control.prop;
    if (!key) return null;
    return {
      key,
      prop: control.prop,
      label: control.label || key,
      type: control.type,
      default: serializeValue(control.default ?? control.def),
      def: serializeValue(control.def),
      min: serializeValue(control.min),
      max: serializeValue(control.max),
      step: serializeValue(control.step),
      options: serializeValue(controlOptions(control)),
      countKey: control.countKey,
      maxFromKey: control.maxFromKey,
      desc: control.desc || control.describe || control.description,
    };
  }).filter(Boolean);
}

function controlOptions(control) {
  if (Array.isArray(control.options) && Array.isArray(control.optionLabels)) {
    return control.options.map((option, index) => [option, control.optionLabels[index] ?? option]);
  }
  if (Array.isArray(control.options)) {
    return control.options.map(option => {
      if (Array.isArray(option)) return option;
      if (option && typeof option === 'object' && 'value' in option) {
        const normalized = { value: option.value, label: option.label ?? option.value };
        if (option.image || option.src) normalized.image = option.image || option.src;
        return normalized;
      }
      return option;
    });
  }
  return control.options;
}

function evaluatePropsContract(pages) {
  const missingTextProps = pages.filter(page => textWeight(page.defaultProps) < 20);
  const missingControls = pages.filter(page => !(page.controls || []).length);
  const blocking = [];
  const warnings = [];
  if (missingTextProps.length) {
    warnings.push(`${missingTextProps.length}/${pages.length} 页没有足够的 props 文案/数据默认值,例如 ${samplePages(missingTextProps)}`);
  }
  if (missingControls.length) {
    blocking.push(`${missingControls.length}/${pages.length} 页没有 controls,例如 ${samplePages(missingControls)}`);
  }
  return {
    blocking: blocking.join('; '),
    warning: warnings.join('; '),
  };
}

function textWeight(value) {
  const text = JSON.stringify(value || '');
  return (text.match(/[\u4e00-\u9fa5]/g) || []).length + (text.match(/[A-Za-z]{3,}/g) || []).length;
}

function samplePages(pages) {
  return pages.slice(0, 3).map(page => `${page.key} ${page.label}`).join('、');
}

function writeMetadata(themeDir, pages, theme) {
  fs.writeFileSync(
    path.join(themeDir, 'metadata.js'),
    `export const theme = ${JSON.stringify({ key: theme.key, name: theme.name, mode: theme.mode }, null, 2)};\nexport const pages = ${JSON.stringify(pages, null, 2)};\n`,
  );
}

function writeGeneratedMetadata(themes, pages) {
  fs.writeFileSync(
    path.join(THEMES_DIR, 'generated-metadata.js'),
    `export const GENERATED_THEME_PACKS = ${JSON.stringify(themes, null, 2)};\n\nexport const GENERATED_THEME_PAGES = ${JSON.stringify(pages, null, 2)};\n`,
  );
}

function writeClientRuntime(themes) {
  const imports = themes
    .map(theme => `import { runtimePages as ${theme.key}Pages } from './${theme.key}/runtime.jsx';`)
    .join('\n');
  const spreads = themes.map(theme => `  ...${theme.key}Pages,`).join('\n');
  fs.writeFileSync(path.join(THEMES_DIR, 'client-runtime.jsx'), `import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
${imports}

const mountedRoots = new WeakMap();
const runtimePages = [
${spreads}
];
const entriesByKey = new Map(runtimePages.map(page => [page.key, page]));

function readJson(value, fallback) {
  try {
    return JSON.parse(value || '') || fallback;
  } catch {
    return fallback;
  }
}

function getRootApi(root) {
  let api = mountedRoots.get(root);
  if (!api) {
    api = createRoot(root);
    mountedRoots.set(root, api);
  }
  return api;
}

function renderImportedThemeSlide(slide, values = {}) {
  const root = slide?.querySelector?.('.imported-theme-root');
  if (!root) return false;
  const entry = entriesByKey.get(root.dataset.pageKey);
  if (!entry?.Component) return false;
  const defaults = readJson(root.dataset.propDefaults, {});
  const componentProps = {
    ...(entry.defaultProps || {}),
    ...defaults,
    ...(values || {}),
  };
  flushSync(() => {
    getRootApi(root).render(React.createElement(entry.Component, componentProps));
  });
  root.dataset.importedThemeRuntime = 'true';
  return true;
}

function renderImportedThemeSlides(scope = document) {
  scope.querySelectorAll?.('.slide.imported-theme-slide').forEach(slide => {
    renderImportedThemeSlide(slide);
  });
}

function renderRuntimeSlide(slide, values = {}) {
  return renderImportedThemeSlide(slide, values);
}

function renderRuntimeSlides(scope = document) {
  renderImportedThemeSlides(scope);
}

window.__renderImportedThemeSlide = renderImportedThemeSlide;
window.__renderImportedThemeSlides = renderImportedThemeSlides;
window.__renderRuntimeSlide = renderRuntimeSlide;
window.__renderRuntimeSlides = renderRuntimeSlides;
`);
}

function writeAuditReport(report) {
  fs.writeFileSync(path.join(OUTPUT_DIR, 'theme-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

function writeBlockedReport(items) {
  const body = items.length
    ? items.map(item => `## ${item.themeKey} / ${item.themeName}\n\n问题类型: ${item.type}\n\n当前问题:\n${item.problem}\n\n为什么不能项目侧硬适配:\n${item.cannotAdapt}\n\nClaude Design 返修要求:\n${item.request}\n\n返修验收:\n返修后重新运行 \`npm run themes:import -- theme-import-goal.json\`,该主题进入已接入主题列表且页面数大于 0。\n`).join('\n')
    : '本轮没有需要 Claude Design 返修的主题。\n';
  fs.writeFileSync(path.join(OUTPUT_DIR, 'blocked-for-claude.md'), body);
}

function writeWarningReport(items) {
  const body = items.length
    ? items.map(item => `## ${item.themeKey} / ${item.themeName}\n\n${item.warning}\n\n说明:\n该主题已接入项目和预览。后续如需 Skill 更稳定地自动替换整页文案,建议继续让 Claude Design 把所有可见正文/数据默认值补进 defaultProps。\n`).join('\n')
    : '本轮没有主题质量警告。\n';
  fs.writeFileSync(path.join(OUTPUT_DIR, 'theme-quality-warnings.md'), body);
}

function writeSummary(goal, themes, blockedItems, warningItems) {
  const lines = [
    '# Theme Import Summary',
    '',
    `原始主题数: ${goal.themes.length}`,
    `已接入主题数: ${themes.length}`,
    `替换现有主题数: ${themes.filter(theme => theme.mode === 'replace').length}`,
    `待 Claude Design 返修主题数: ${blockedItems.length}`,
    `已接入但有质量警告主题数: ${warningItems.length}`,
    '',
    '## 已接入主题',
    '',
    ...themes.map(theme => `- ${theme.key} ${theme.name}: ${theme.pageCount} 页`),
    '',
    '## 待返修主题',
    '',
    ...(blockedItems.length ? blockedItems.map(item => `- ${item.themeKey} ${item.themeName}: ${item.problem}`) : ['- 无']),
    '',
    '## 已接入但有质量警告',
    '',
    ...(warningItems.length ? warningItems.map(item => `- ${item.themeKey} ${item.themeName}: ${item.warning}`) : ['- 无']),
    '',
    '## 校验命令',
    '',
    '- npm run manifest:update',
    '- npm test',
    '- npm run showcase:update',
    '- npm run render:themes',
    '- npm run skill:sync',
  ];
  fs.writeFileSync(path.join(OUTPUT_DIR, 'theme-import-summary.md'), `${lines.join('\n')}\n`);
}

function blockedItem(theme, audit, type, problem, request) {
  return {
    themeKey: theme.key,
    themeName: theme.name,
    type,
    problem,
    cannotAdapt: '硬拆 DOM、字符串替换或浏览器全局模拟会破坏页面组件黑盒原则,后续 Skill 无法稳定控制页面属性。',
    request,
    audit,
  };
}

function cleanGeneratedThemeDirs() {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
  for (const name of fs.readdirSync(THEMES_DIR)) {
    if (/^theme\d\d$/.test(name)) fs.rmSync(path.join(THEMES_DIR, name), { recursive: true, force: true });
  }
  fs.rmSync(path.join(THEMES_DIR, 'generated-metadata.js'), { force: true });
}

function setupDomStubs() {
  globalThis.React = React;
  globalThis.window = globalThis.window || {};
  globalThis.window.React = React;
  globalThis.window.ReactDOM = globalThis.window.ReactDOM || {};
  globalThis.document = globalThis.document || {
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() {
      return {
        style: {},
        dataset: {},
        setAttribute() {},
        appendChild() {},
        remove() {},
        set textContent(value) { this._textContent = value; },
        get textContent() { return this._textContent || ''; },
      };
    },
    head: { appendChild() {} },
    body: { appendChild() {} },
    addEventListener() {},
  };
  if (!globalThis.navigator) {
    Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node' }, configurable: true });
  }
  globalThis.customElements = globalThis.customElements || { define() {}, get() { return null; } };
  globalThis.HTMLElement = globalThis.HTMLElement || class {};
}

function serializeValue(value) {
  if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value !== 'object') return undefined;
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, serializeValue(item)])
      .filter(([, item]) => item !== undefined),
  );
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) walk(file, out);
    else out.push(file);
  }
  return out;
}

function readTextSafe(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function count(pattern, text) {
  return (text.match(pattern) || []).length;
}

function slug(value) {
  return String(value).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}
