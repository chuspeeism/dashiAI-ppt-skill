/**
 * ResourceTriadPage — P61 三类关键资源 (Talent · Capital · Compute · Quote)
 *
 * A quote-led "breather" slide: one large statement at the optical center,
 * carried by a triad of key-resource pillars (Talent / Capital / Compute).
 * The pillar count, the highlighted pillar, alignment, the quote mark and the
 * source line are all prop-driven; the page is information-light by design.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-tri`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (LensCluster, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Talent · Capital · Compute',
  kicker: '人才 · 资本 · 算力三角',
  // the hero statement — split so one clause can carry the accent
  quoteLead: 'AI 竞争，首先是',
  quoteEm: '资源组织能力',
  quoteTail: '的竞争。',
  // resource pillars (order fixed; count is prop-driven)
  pillars: [
    { glyph: 'circle', zh: '人才', en: 'Talent', note: '顶尖研究员与工程团队的密度' },
    { glyph: 'diamond', zh: '资本', en: 'Capital', note: '持续的大额融资与战略资金' },
    { glyph: 'square', zh: '算力', en: 'Compute', note: 'GPU 集群与云资源的稳定供给' },
  ],
  source: '数据来源 · AI Capital Lab 自建数据库 / 公开融资披露 · 2024 全年口径 ≥1 亿美元',
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  align: 'center',         // 'center' | 'left'
  showPillars: true,       // resource pillar row
  pillarCount: 3,          // how many pillars (2–3)
  focusEnabled: true,      // highlight one pillar
  focusIndex: 0,           // which pillar is the focus (0-based)
  showQuoteMark: true,     // oversized quotation mark
  showSource: true,        // data-source line
  showDecorations: true,   // glow / lens / heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Talent · Capital · Compute' },
  { key: 'kicker', label: 'kicker', type: 'text', default: '人才 · 资本 · 算力三角' },
  { key: 'quoteLead', label: 'quoteLead', type: 'text', default: 'AI 竞争，首先是' },
  { key: 'quoteEm', label: 'quoteEm', type: 'text', default: '资源组织能力' },
  { key: 'quoteTail', label: 'quoteTail', type: 'text', default: '的竞争。' },
  { key: 'source', label: '来源', type: 'text', default: '数据来源 · AI Capital Lab 自建数据库 / 公开融资披露 · 2024 全年口径 ≥1 亿美元' },
  { key: 'align', label: '对齐方式', type: 'radio', default: 'center',
    options: [{ value: 'center', label: '居中' }, { value: 'left', label: '左对齐' }],
    description: '金句与三角资源的整体对齐方式。' },
  { key: 'showPillars', label: '辅助信息', type: 'toggle', default: true,
    description: '底部三类关键资源支柱行的显隐。' },
  { key: 'pillarCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '展示的资源支柱数量（2–3）。', showWhen: (p) => p.showPillars },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一类资源支柱作为视觉重点。', showWhen: (p) => p.showPillars },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的资源支柱。', showWhen: (p) => p.showPillars && p.focusEnabled },
  { key: 'showQuoteMark', label: '引号装饰', type: 'toggle', default: true,
    description: '超大引号装饰符号的显隐。' },
  { key: 'showSource', label: '数据来源', type: 'toggle', default: true,
    description: '底部数据来源说明行的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、镜头光斑与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于金句重点词与支柱高亮。' },
];

const CSS = `
.aic-tri { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 120px; }
.aic-tri, .aic-tri * { box-sizing: border-box; }
.aic-tri .tri-glow { position: absolute; left: 50%; top: 36%; width: 72%; height: 76%; transform: translate(-50%,-50%);
  pointer-events: none; background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 18%, transparent), transparent 70%); }
.aic-tri .tri-lens { position: absolute; right: 92px; top: 120px; width: 230px; height: 230px; opacity: .9; }

.aic-tri .tri-eyebrow { position: absolute; top: 96px; left: var(--pad); right: var(--pad);
  display: flex; align-items: center; gap: 22px; font-family: var(--aic-font-display); font-weight: 600;
  font-size: 22px; letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); }
.aic-tri .tri-eyebrow i { flex: none; width: 11px; height: 11px; border-radius: 50%; background: var(--aic-accent); }
.aic-tri .tri-eyebrow s { flex: 1; height: 1.5px; background: var(--aic-hair); text-decoration: none; }
.aic-tri .tri-eyebrow b { font-family: var(--aic-font-text); font-weight: 700; letter-spacing: .04em;
  text-transform: none; font-size: 22px; color: var(--aic-ink-dim); }

.aic-tri .tri-body { position: absolute; left: var(--pad); right: var(--pad); top: 290px;
  display: flex; flex-direction: column; }
.aic-tri.is-center .tri-body { align-items: center; text-align: center; }
.aic-tri.is-left .tri-body { align-items: flex-start; text-align: left; }

.aic-tri .tri-kicker { display: inline-flex; align-items: center; gap: 12px; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 21px; letter-spacing: .12em; color: var(--aic-accent-deep);
  padding: 9px 18px; border-radius: 999px; background: var(--aic-accent-soft); margin-bottom: 26px; }
.aic-tri .tri-mark { font-family: var(--aic-font-display); font-weight: 700; font-size: 170px; line-height: .6;
  color: var(--aic-accent); height: 92px; }
.aic-tri .tri-text { font-family: var(--aic-font-text); font-weight: 900; font-size: 96px; line-height: 1.12;
  letter-spacing: -.01em; margin: 0; max-width: 1560px; text-wrap: balance; }
.aic-tri .tri-text em { font-style: normal; color: var(--aic-accent);
  background: linear-gradient(180deg, transparent 64%, color-mix(in srgb, var(--aic-accent) 30%, transparent) 64%); }
.aic-tri .tri-rule { width: 120px; height: 5px; border-radius: 999px; background: var(--aic-ink); margin: 48px 0 0; }
.aic-tri.is-center .tri-rule { align-self: center; }

.aic-tri .tri-pillars { position: absolute; left: var(--pad); right: var(--pad); bottom: 172px;
  display: grid; gap: 40px; }
.aic-tri .tri-p { display: flex; flex-direction: column; gap: 14px; padding-top: 26px;
  border-top: 2.5px solid var(--aic-hair-strong); transition: border-color .3s; }
.aic-tri .tri-p[data-focus="1"] { border-top-color: var(--aic-accent); }
.aic-tri .tri-glyph { width: 50px; height: 50px; color: var(--aic-ink); }
.aic-tri .tri-p[data-focus="1"] .tri-glyph { color: var(--aic-accent-deep); }
.aic-tri .tri-row { display: flex; align-items: baseline; gap: 16px; }
.aic-tri .tri-zh { font-family: var(--aic-font-text); font-weight: 900; font-size: 46px; line-height: 1; color: var(--aic-ink); }
.aic-tri .tri-p[data-focus="1"] .tri-zh { color: var(--aic-accent-deep); }
.aic-tri .tri-en { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .2em;
  text-transform: uppercase; color: var(--aic-muted); transform: skewX(-8deg); transform-origin: left bottom; }
.aic-tri .tri-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; line-height: 1.45; color: var(--aic-ink-dim); }

.aic-tri .tri-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 90px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-tri .tri-src { font-family: var(--aic-font-display); font-weight: 500; font-size: 20px;
  letter-spacing: .04em; color: var(--aic-faint); }
.aic-tri .tri-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

// simple geometric glyph — square / circle / diamond only (no illustration)
function Glyph({ type }) {
  if (type === 'circle')
    return (
      <svg className="tri-glyph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="18" cy="24" r="13" stroke="currentColor" strokeWidth="3" />
        <circle cx="30" cy="24" r="13" stroke="var(--aic-accent)" strokeWidth="3" />
      </svg>
    );
  if (type === 'diamond')
    return (
      <svg className="tri-glyph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="24" y="6" width="25.5" height="25.5" rx="3" transform="rotate(45 24 6)"
          stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  return (
    <svg className="tri-glyph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="3" />
      <rect x="25" y="7" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="3" />
      <rect x="7" y="25" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="3" />
      <rect x="25" y="25" width="16" height="16" rx="2" fill="var(--aic-accent)" />
    </svg>
  );
}

export default function ResourceTriadPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, kicker: p.kicker !== undefined ? p.kicker : COPY.kicker, quoteLead: p.quoteLead !== undefined ? p.quoteLead : COPY.quoteLead, quoteEm: p.quoteEm !== undefined ? p.quoteEm : COPY.quoteEm, quoteTail: p.quoteTail !== undefined ? p.quoteTail : COPY.quoteTail, source: p.source !== undefined ? p.source : COPY.source, pillars: p.pillars !== undefined ? p.pillars : COPY.pillars };
  ensureFonts();
  injectScopedStyle('aic-tri', CSS);
  const vars = themeVars(p.accentColor);

  const align = p.align === 'left' ? 'left' : 'center';
  const pN = Math.max(2, Math.min(3, p.pillarCount));
  const pillars = copy.pillars.slice(0, pN);
  const showPillars = p.showPillars;
  const focus = Math.max(0, Math.min(pN - 1, p.focusIndex));

  return (
    <div className={'aic-tri is-' + align} style={vars}>
      {p.showDecorations && <div className="tri-glow" />}
      {p.showDecorations && <div className="tri-lens"><LensCluster /></div>}

      <div className="tri-eyebrow">
        <i />{copy.eyebrow}<s />
        <b>{copy.kicker}</b>
      </div>

      <div className="tri-body" style={{ top: showPillars ? '274px' : '330px' }}>
        <span className="tri-kicker">{copy.kicker}</span>
        {p.showQuoteMark && <div className="tri-mark">“</div>}
        <h2 className="tri-text">
          {copy.quoteLead}<em>{copy.quoteEm}</em>{copy.quoteTail}
        </h2>
        <div className="tri-rule" />
      </div>

      {showPillars && (
        <div className="tri-pillars" style={{ gridTemplateColumns: `repeat(${pN}, 1fr)` }}>
          {pillars.map((pl, i) => (
            <div className="tri-p" key={pl.en} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <Glyph type={pl.glyph} />
              <div className="tri-row">
                <span className="tri-zh">{pl.zh}</span>
                <span className="tri-en">{pl.en}</span>
              </div>
              <span className="tri-note">{pl.note}</span>
            </div>
          ))}
        </div>
      )}

      <div className="tri-foot">
        {p.showSource ? <div className="tri-src">{copy.source}</div> : <span />}
        {p.showDecorations && <div className="tri-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
