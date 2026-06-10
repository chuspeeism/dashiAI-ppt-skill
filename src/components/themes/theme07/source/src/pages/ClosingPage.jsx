/**
 * ClosingPage — P80 最终判断 (Closing · Quote)
 *
 * The deck's finale: one low-density statement at the optical center, sized to
 * land. Unlike the mid-deck QuotePage it offers a `backgroundVariant` (paper /
 * dark) so the closing can breathe on an inverted panel. Alignment, the kicker
 * label, quote mark, a single closing tagline, the brand sign-off and accent
 * are all prop-driven. No images, no charts — by design.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-clo`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip, LensCluster, BrandMark).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, LensCluster, BrandMark } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Closing',
  kicker: '最终判断',
  // the hero statement — split so one clause carries the accent
  quoteLead: '融资盛宴之后，',
  quoteEm: '真正的竞争',
  quoteTail: '才刚开始。',
  tagline: '从资本流向，看 AI 产业下一阶段的真实重心。',
  brandLabel: 'AI CAPITAL LAB',
  brandSub: 'FUNDING INTELLIGENCE',
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  align: 'center',            // 'center' | 'left'
  backgroundVariant: 'paper', // 'paper' | 'dark'
  showKicker: true,           // “最终判断” label row
  showQuoteMark: true,        // oversized quotation mark
  showTagline: true,          // single closing tagline under the rule
  showBrand: true,            // brand sign-off bottom-left
  showDecorations: true,      // glow / lens / heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'align', label: '对齐方式', type: 'radio', default: 'center',
    options: [{ value: 'center', label: '居中' }, { value: 'left', label: '左对齐' }],
    description: '金句与辅助信息的整体对齐方式。' },
  { key: 'backgroundVariant', label: '背景风格', type: 'radio', default: 'paper',
    options: [{ value: 'paper', label: '浅色' }, { value: 'dark', label: '深色' }],
    description: '收尾背景：浅色统一 / 深色换气强调。' },
  { key: 'showKicker', label: '标题标签', type: 'toggle', default: true,
    description: '顶部“最终判断”标签行的显隐。' },
  { key: 'showQuoteMark', label: '引号装饰', type: 'toggle', default: true,
    description: '超大引号装饰符号的显隐。' },
  { key: 'showTagline', label: '辅助信息', type: 'toggle', default: true,
    description: '金句下方单行收束语的显隐。' },
  { key: 'showBrand', label: '品牌签名', type: 'toggle', default: true,
    description: '左下角品牌标识的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、镜头光斑与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于金句重点词与装饰。' },
];

const CSS = `
.aic-clo { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 120px;
  transition: background .35s, color .35s; }
.aic-clo, .aic-clo * { box-sizing: border-box; }
.aic-clo[data-bg="dark"] { background: var(--aic-ink); color: var(--aic-paper); }

.aic-clo .clo-glow { position: absolute; left: 50%; top: 42%; width: 72%; height: 84%; transform: translate(-50%,-50%);
  pointer-events: none; background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 18%, transparent), transparent 70%); }
.aic-clo[data-bg="dark"] .clo-glow { background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 26%, transparent), transparent 72%); }
.aic-clo .clo-lens { position: absolute; right: 104px; bottom: 150px; width: 250px; height: 250px; opacity: .9; }

.aic-clo .clo-eyebrow { position: absolute; top: 100px; left: var(--pad); right: var(--pad);
  display: flex; align-items: center; gap: 22px; font-family: var(--aic-font-display); font-weight: 600;
  font-size: 22px; letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); }
.aic-clo[data-bg="dark"] .clo-eyebrow { color: var(--aic-faint); }
.aic-clo .clo-eyebrow i { flex: none; width: 11px; height: 11px; border-radius: 50%; background: var(--aic-accent); }
.aic-clo .clo-eyebrow s { flex: 1; height: 1.5px; background: var(--aic-hair); text-decoration: none; }
.aic-clo[data-bg="dark"] .clo-eyebrow s { background: rgba(255,255,255,0.16); }
.aic-clo .clo-eyebrow b { font-family: var(--aic-font-text); font-weight: 700; letter-spacing: .04em;
  text-transform: none; font-size: 22px; color: var(--aic-ink-dim); }
.aic-clo[data-bg="dark"] .clo-eyebrow b { color: var(--aic-paper); }

.aic-clo .clo-body { position: absolute; left: var(--pad); right: var(--pad); top: 50%; transform: translateY(-54%);
  display: flex; flex-direction: column; }
.aic-clo.is-center .clo-body { align-items: center; text-align: center; }
.aic-clo.is-left .clo-body { align-items: flex-start; text-align: left; }

.aic-clo .clo-mark { font-family: var(--aic-font-display); font-weight: 700; font-size: 210px; line-height: .6;
  color: var(--aic-accent); height: 116px; }
.aic-clo .clo-text { font-family: var(--aic-font-text); font-weight: 900; font-size: 114px; line-height: 1.14;
  letter-spacing: -.015em; margin: 0; max-width: 1560px; }
.aic-clo .clo-line { display: block; }
.aic-clo .clo-text em { font-style: normal; color: var(--aic-accent);
  background: linear-gradient(180deg, transparent 62%, color-mix(in srgb, var(--aic-accent) 30%, transparent) 62%); }
.aic-clo[data-bg="dark"] .clo-text em { background: linear-gradient(180deg, transparent 64%, color-mix(in srgb, var(--aic-accent) 40%, transparent) 64%); }

.aic-clo .clo-rule { width: 128px; height: 5px; border-radius: 999px; background: var(--aic-ink); margin: 50px 0 0; }
.aic-clo[data-bg="dark"] .clo-rule { background: var(--aic-accent); }
.aic-clo.is-center .clo-rule { align-self: center; }
.aic-clo .clo-tag { font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.4;
  color: var(--aic-ink-dim); margin: 38px 0 0; max-width: 1200px; text-wrap: pretty; }
.aic-clo[data-bg="dark"] .clo-tag { color: color-mix(in srgb, var(--aic-paper) 78%, transparent); }

/* dark-panel sign-off: BrandMark hardcodes ink tones — invert them here */
.aic-clo[data-bg="dark"] .aic-viz-brand-mark { background: rgba(255,255,255,0.10); }
.aic-clo[data-bg="dark"] .aic-viz-brand-name b { color: var(--aic-paper) !important; }
.aic-clo[data-bg="dark"] .aic-viz-brand-name span { color: color-mix(in srgb, var(--aic-paper) 58%, transparent); }

.aic-clo .clo-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 92px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-clo .clo-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['accent','pos','accent','pos','warn','accent','pos','pos','accent','pos','warn','accent',
  'pos','accent','pos','pos','accent','warn','pos','accent','pos','pos','accent','pos','warn','accent',
  'pos','accent','pos','pos','accent','warn','pos','accent','pos','pos'].map((tone) => ({ tone }));

export default function ClosingPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-clo', CSS);
  const vars = themeVars(p.accentColor);

  const align = p.align === 'left' ? 'left' : 'center';
  const dark = p.backgroundVariant === 'dark';

  return (
    <div className={'aic-clo is-' + align} data-bg={dark ? 'dark' : 'paper'} style={vars}>
      {p.showDecorations && <div className="clo-glow" />}
      {p.showDecorations && <div className="clo-lens"><LensCluster /></div>}

      <div className="clo-eyebrow">
        <i />{copy.eyebrow}<s />
        {p.showKicker && <b>{copy.kicker}</b>}
      </div>

      <div className="clo-body">
        {p.showQuoteMark && <div className="clo-mark">“</div>}
        <h2 className="clo-text">
          <span className="clo-line">{copy.quoteLead}</span>
          <span className="clo-line"><em>{copy.quoteEm}</em>{copy.quoteTail}</span>
        </h2>
        <div className="clo-rule" />
        {p.showTagline && <p className="clo-tag">{copy.tagline}</p>}
      </div>

      <div className="clo-foot">
        {p.showBrand
          ? <BrandMark size={44} label={copy.brandLabel} sub={copy.brandSub} />
          : <span />}
        {p.showDecorations && <div className="clo-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
