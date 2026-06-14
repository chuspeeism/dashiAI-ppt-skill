import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import { SLIDES as sourcePages } from './source/src/registry.js';
import { setRDAccent, setRDDark } from './source/src/theme.js';

const THEME03_BASE_CSS = "/* ============================================================================\n   theme.css — scoped design tokens + base classes for the report deck.\n   Aesthetic: editorial / brutalist grotesque, light warm-gray field,\n   electric-blue + lime accents, monospace micro-labels.\n\n   SCOPING CONTRACT\n   - All custom properties live on `.rd-slide` (the root of every slide\n     component), NOT on :root — nothing leaks to a host app's globals.\n   - Every class is prefixed `.rd-` so it can't collide after migration.\n   - Slides are pure: they only use these classes + inline styles. The deck\n     navigation chrome (deck-stage) and the Tweaks panel are separate.\n   ========================================================================== */\n\n@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');\n\n/* ---- token scope ---------------------------------------------------------- */\n.rd-slide {\n  /* palette */\n  --rd-bg:      #d6d6d3;\n  --rd-ink:     #161513;\n  --rd-ink-2:   #5c5b57;\n  --rd-ink-3:   #908f8a;\n  --rd-line:    rgba(22,21,19,0.20);\n  --rd-line-2:  rgba(22,21,19,0.10);\n  --rd-blue:    #2742ec;\n  --rd-blue-ink:#f3f5ff;\n  --rd-lime:    #c2f53d;\n  --rd-panel:   #1a1916;     /* dark surface */\n\n  /* type families */\n  --rd-sans: \"Archivo\",\"Noto Sans SC\",system-ui,sans-serif;\n  --rd-mono: \"Space Mono\",ui-monospace,\"SFMono-Regular\",monospace;\n\n  /* type scale (1920×1080 canvas) */\n  --rd-display: 104px;\n  --rd-title:   62px;\n  --rd-headline:46px;\n  --rd-sub:     34px;\n  --rd-body:    27px;\n  --rd-cap:     24px;\n  --rd-label:   24px;\n\n  /* rhythm */\n  --rd-pad-x: 120px;\n  --rd-pad-y: 92px;\n  --rd-gap:   40px;\n\n  position: relative;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  background: var(--rd-bg);\n  color: var(--rd-ink);\n  font-family: var(--rd-sans);\n  font-weight: 400;\n  -webkit-font-smoothing: antialiased;\n  overflow: hidden;\n}\n.rd-slide *,\n.rd-slide *::before,\n.rd-slide *::after { box-sizing: border-box; }\n\n/* ---- dark theme modifier (scoped — only flips tokens on this slide) -------- */\n.rd-slide.rd-dark {\n  --rd-bg:     #161513;\n  --rd-ink:    #f3f2ee;\n  --rd-ink-2:  #b8b6b0;\n  --rd-ink-3:  #84827c;\n  --rd-line:   rgba(243,242,238,0.22);\n  --rd-line-2: rgba(243,242,238,0.10);\n  --rd-panel:  #f3f2ee;\n}\n\n/* ---- frame / layout helpers ---------------------------------------------- */\n.rd-frame {\n  position: absolute;\n  inset: 0;\n  padding: var(--rd-pad-y) var(--rd-pad-x);\n  display: flex;\n  flex-direction: column;\n}\n.rd-topbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-bottom: 22px;\n  border-bottom: 1px solid var(--rd-line);\n}\n.rd-hairline { height: 1px; background: var(--rd-line); width: 100%; }\n\n/* ---- micro-label (blue box) ---------------------------------------------- */\n.rd-tag {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-family: var(--rd-mono);\n  font-weight: 700;\n  font-size: var(--rd-label);\n  letter-spacing: 0.10em;\n  text-transform: uppercase;\n  line-height: 1;\n  padding: 9px 12px 8px;\n  background: var(--rd-blue);\n  color: var(--rd-blue-ink);\n  white-space: nowrap;\n}\n.rd-tag--lime { background: var(--rd-lime); color: var(--rd-ink); }\n.rd-tag--ghost { background: transparent; color: var(--rd-ink-2); padding-left: 0; padding-right: 0; }\n\n/* free-standing mono caption (no box) */\n.rd-mono {\n  font-family: var(--rd-mono);\n  font-size: var(--rd-cap);\n  letter-spacing: 0.06em;\n  color: var(--rd-ink-2);\n  text-transform: uppercase;\n}\n\n/* ---- headings ------------------------------------------------------------- */\n.rd-display {\n  font-family: var(--rd-sans);\n  font-weight: 900;\n  font-size: var(--rd-display);\n  line-height: 1.07;\n  letter-spacing: -0.02em;\n  margin: 0;\n  text-wrap: balance;\n}\n.rd-title {\n  font-weight: 800;\n  font-size: var(--rd-title);\n  line-height: 1.08;\n  letter-spacing: -0.015em;\n  margin: 0;\n}\n.rd-headline {\n  font-weight: 800;\n  font-size: var(--rd-headline);\n  line-height: 1.05;\n  letter-spacing: -0.01em;\n  margin: 0;\n}\n.rd-sub {\n  font-weight: 700;\n  font-size: var(--rd-sub);\n  line-height: 1.2;\n  letter-spacing: -0.005em;\n  margin: 0;\n}\n.rd-blue { color: var(--rd-blue); }\n.rd-lime-ink { color: var(--rd-ink); }\n\n/* ---- body ----------------------------------------------------------------- */\n.rd-body {\n  font-size: var(--rd-body);\n  line-height: 1.5;\n  color: var(--rd-ink-2);\n  margin: 0;\n  text-wrap: pretty;\n}\n.rd-cap {\n  font-size: var(--rd-cap);\n  line-height: 1.45;\n  color: var(--rd-ink-2);\n  margin: 0;\n}\n\n/* ---- big figure ----------------------------------------------------------- */\n.rd-figure {\n  font-weight: 800;\n  font-size: 168px;\n  line-height: 0.86;\n  letter-spacing: -0.03em;\n  font-feature-settings: \"tnum\" 1;\n}\n\n/* ---- entrance animation --------------------------------------------------\n   Base state is the *visible* end-state so content always renders (print,\n   reduced-motion, and non-painting capture contexts included). The motion is\n   added only as a transform-based enhancement that never hides content. */\n@media (prefers-reduced-motion: no-preference) {\n  [data-deck-active] .rd-anim   { animation: rd-rise 0.55s cubic-bezier(.2,.7,.2,1) both; }\n  [data-deck-active] .rd-anim-2 { animation-delay: 0.07s; }\n  [data-deck-active] .rd-anim-3 { animation-delay: 0.14s; }\n  [data-deck-active] .rd-anim-4 { animation-delay: 0.21s; }\n}\n@keyframes rd-rise {\n  from { transform: translateY(16px); }\n  to   { transform: translateY(0); }\n}\n";
const THEME03_FORCE_DARK_CSS = "\nbody.rd-force-dark .rd-slide,\n.theme03-force-dark .rd-slide { --rd-bg:#161513; --rd-ink:#f3f2ee; --rd-ink-2:#b8b6b0; --rd-ink-3:#84827c; --rd-line:rgba(243,242,238,0.22); --rd-line-2:rgba(243,242,238,0.10); --rd-panel:#f3f2ee; }\nbody.rd-force-dark .rd-slide .rd-tag--lime,\n.theme03-force-dark .rd-slide .rd-tag--lime { color:#161513; }\n.theme03-theme-shell { position:absolute; inset:0; width:100%; height:100%; }\n.theme03-theme-toggle { position:fixed; top:calc(var(--deck-top, 0px) + 22px); left:calc(var(--deck-left, 0px) + var(--deck-w, 100vw) - 78px); right:auto; z-index:23; width:56px; height:56px; padding:0; display:inline-flex; align-items:center; justify-content:center; background:#2742ec; color:#f3f5ff; border:2px solid #161513; border-radius:0; cursor:pointer; box-shadow:4px 4px 0 rgba(22,21,19,.85); transition:transform .12s ease, box-shadow .12s ease, background .15s ease; }\nbody.overview-on .theme03-theme-toggle,\nbody.exporting-deck .theme03-theme-toggle { display:none!important; pointer-events:none!important; }\n.theme03-theme-toggle:hover { transform:translate(-1px,-1px); box-shadow:5px 5px 0 rgba(22,21,19,.85); }\n.theme03-theme-toggle:active { transform:translate(2px,2px); box-shadow:1px 1px 0 rgba(22,21,19,.85); }\nbody.rd-force-dark .theme03-theme-toggle { background:#c2f53d; color:#161513; border-color:#f3f2ee; box-shadow:4px 4px 0 rgba(243,242,238,.35); }\nbody.rd-force-dark .theme03-theme-toggle:hover { box-shadow:5px 5px 0 rgba(243,242,238,.35); }\n.theme03-theme-toggle svg { width:24px; height:24px; display:block; }\n.theme03-theme-toggle .ic-sun { display:none; }\nbody.rd-force-dark .theme03-theme-toggle .ic-moon { display:none; }\nbody.rd-force-dark .theme03-theme-toggle .ic-sun { display:block; }\n::view-transition-old(root),\n::view-transition-new(root) { animation:none; mix-blend-mode:normal; }\nhtml[data-theme-vt=\"active\"]::view-transition-group(root) { animation-duration:var(--theme-vt-dur, 550ms); }\n";
const THEME03_GLOBAL_ACCENT_CSS = "\n.theme03-accent-lime .rd-slide { --rd-blue:#c2f53d; --rd-blue-ink:#161513; }\n.theme03-accent-lime .rd-slide .rd-tag:not(.rd-tag--lime) { background:#c2f53d; color:#161513; }\n";
const THEME03_FORCE_DARK_CONTROL = {
  key: 'forceDark',
  type: 'toggle',
  label: '全局深色',
  default: true,
  description: '复刻 Claude Design 右上角深浅配色切换。',
};
const THEME03_GLOBAL_ACCENT_CONTROL = {
  key: 'accent',
  type: 'select',
  label: '强调色',
  default: 'blue',
  options: [
    { value: 'blue', label: '电光蓝' },
    { value: 'lime', label: '荧光绿' },
  ],
  description: 'theme03 全局强调色，作用于该主题所有页面。',
};
let theme03GlobalDark = null;
let theme03GlobalAccent = null;
const theme03GlobalListeners = new Set();
const theme03AccentListeners = new Set();

const rawPages = sourcePages.map(entry => ({
  ...entry,
  Component: withTheme03Base(entry.Component),
  controls: [
    THEME03_FORCE_DARK_CONTROL,
    THEME03_GLOBAL_ACCENT_CONTROL,
    ...(entry.controls || []).filter(control => control.key !== 'forceDark' && control.key !== 'accent'),
  ],
  defaultProps: { ...(entry.defaultProps || entry.defaults || {}), forceDark: true, accent: 'blue' },
}));

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme03', layoutPrefix: 'THEME03' });

function withTheme03Base(Component) {
  return function Theme03Page(props = {}) {
    const { forceDark = true, accent: accentProp = 'blue', ...componentProps } = props;
    const [dark, setDark] = React.useState(() => theme03ReadInitialDark(forceDark !== false));
    const [accent, setAccent] = React.useState(() => theme03ReadInitialAccent(accentProp));
    const mountedRef = React.useRef(false);
    const accentMountedRef = React.useRef(false);

    React.useEffect(() => {
      const listener = next => setDark(next);
      theme03GlobalListeners.add(listener);
      return () => theme03GlobalListeners.delete(listener);
    }, []);

    React.useEffect(() => {
      const listener = next => setAccent(next);
      theme03AccentListeners.add(listener);
      return () => theme03AccentListeners.delete(listener);
    }, []);

    React.useEffect(() => {
      if (!mountedRef.current) {
        mountedRef.current = true;
        return;
      }
      theme03SetGlobalDark(forceDark !== false);
    }, [forceDark]);

    React.useEffect(() => {
      if (!accentMountedRef.current) {
        accentMountedRef.current = true;
        return;
      }
      theme03SetGlobalAccent(accentProp);
    }, [accentProp]);

    setRDDark(dark);
    setRDAccent(accent);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('style', null, THEME03_BASE_CSS),
      React.createElement('style', null, THEME03_FORCE_DARK_CSS),
      React.createElement('style', null, THEME03_GLOBAL_ACCENT_CSS),
      React.createElement(
        'div',
        { className: 'theme03-theme-shell theme03-accent-' + accent + (dark ? ' theme03-force-dark' : '') },
        React.createElement(Component, { ...componentProps, accent }),
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
  if (document.body?.classList.contains('overview-on') || document.body?.classList.contains('exporting-deck')) return false;
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

function theme03NormalizeAccent(value) {
  return value === 'lime' ? 'lime' : 'blue';
}

function theme03ReadInitialAccent(fallback) {
  if (theme03GlobalAccent !== null) return theme03GlobalAccent;
  theme03GlobalAccent = theme03NormalizeAccent(fallback);
  try {
    const stored = window.localStorage.getItem('rd-accent');
    if (stored === 'blue' || stored === 'lime') theme03GlobalAccent = stored;
  } catch {}
  setRDAccent(theme03GlobalAccent);
  return theme03GlobalAccent;
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

function theme03SetGlobalAccent(next) {
  theme03GlobalAccent = theme03NormalizeAccent(next);
  setRDAccent(theme03GlobalAccent);
  try {
    window.localStorage.setItem('rd-accent', theme03GlobalAccent);
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rd-accentchange', { detail: { accent: theme03GlobalAccent } }));
  }
  theme03AccentListeners.forEach(listener => listener(theme03GlobalAccent));
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
