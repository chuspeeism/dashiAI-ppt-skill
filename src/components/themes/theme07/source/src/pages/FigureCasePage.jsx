/**
 * FigureCasePage — P70 人形机器人 (Figure AI Case · Big Number)
 *
 * A big-number anchor slide for a single company: one oversized figure
 * ("6.8 亿美元") dominates the canvas as the visual anchor, flanked by a short
 * explanation, a few supporting metrics, an outlined ghost-number watermark and
 * the brand lens motif. The headline number is the hero — Figure AI's largest
 * single round.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-fig`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Figure AI Case',
  title: '人形机器人',
  sub: 'Figure AI 案例页',
  kicker: '最大单笔融资',
  // hero number — 6.8 亿美元 (lead in ink, decimal tail in gray, unit trailing)
  numLead: '6',
  numTail: '.8',
  numUnit: '亿美元',
  // ghost watermark drawn behind the hero (decorative)
  ghost: '6.8',
  numCaption: 'Figure AI 最大单笔融资',
  note: '关键不只是 demo，而是供应链、可靠性和量产成本。',
  closing: '硬件 AI 要用量产证明自己。',
  // supporting metrics (order fixed; count is prop-driven)
  aux: [
    { label: '投后估值', value: '26', unit: '亿美元' },
    { label: '融资轮次', value: 'B 轮', unit: '' },
    { label: '赛道方向', value: '人形机器人', unit: '' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  numberSlant: true,     // brand italic-slant on the hero digits
  auxCount: 3,           // supporting metric chips (0–3)
  showCaption: true,     // explanatory caption under the number
  showNote: true,        // supporting note line
  showGhost: true,       // oversized outlined number watermark behind hero
  showLens: true,        // brand lens-cluster motif
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'numberSlant', label: '数字倾斜', type: 'toggle', default: true,
    description: '主数字是否应用品牌斜切（italic-slant）效果。' },
  { key: 'auxCount', label: '卡片数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '辅助指标数量（0–3）；为 0 时只保留主数字。' },
  { key: 'showCaption', label: '说明文案', type: 'toggle', default: true,
    description: '主数字下方解释性说明的显隐。' },
  { key: 'showNote', label: '辅助注释', type: 'toggle', default: true,
    description: '底部补充注释的显隐。' },
  { key: 'showGhost', label: '背景大字', type: 'toggle', default: true,
    description: '主数字背后的超大描边数字水印的显隐。' },
  { key: 'showLens', label: '品牌图形', type: 'toggle', default: true,
    description: '品牌透镜图形（焦点圆盘）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于主数字点缀、品牌图形与高亮。' },
];

const CSS = `
.aic-fig { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-fig, .aic-fig * { box-sizing: border-box; }
.aic-fig .fg-glow { position: absolute; left: 30%; top: 22%; width: 60%; height: 70%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 26%, transparent), transparent 72%); }
.aic-fig .fg-lens { position: absolute; right: -70px; top: 168px; width: 720px; height: 720px; opacity: .9; pointer-events: none; }
.aic-fig .fg-ghost { position: absolute; right: 40px; bottom: -190px; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 660px; line-height: .7; color: transparent;
  -webkit-text-stroke: 3px var(--aic-hair-strong); letter-spacing: -.04em; pointer-events: none; user-select: none;
  font-variant-numeric: lining-nums; transform: skewX(-9deg); }

.aic-fig .fg-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-fig .fg-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-fig .fg-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 64px; line-height: .96; margin: 0; }
.aic-fig .fg-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* hero number block */
.aic-fig .fg-hero { position: absolute; left: var(--pad); top: 322px; right: var(--pad); }
.aic-fig .fg-kicker { display: flex; align-items: center; gap: 16px; margin: 0 0 12px; }
.aic-fig .fg-kicker b { width: 64px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-fig .fg-kicker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-fig .fg-bignum { line-height: .8; }
.aic-fig .fg-caption { font-family: var(--aic-font-text); font-weight: 600; font-size: 38px; color: var(--aic-ink-dim);
  margin: 30px 0 0; max-width: 1000px; }

/* supporting metrics */
.aic-fig .fg-aux { position: absolute; left: var(--pad); right: var(--pad); bottom: 234px;
  display: flex; gap: 56px; }
.aic-fig .fg-aux-item { display: flex; flex-direction: column; gap: 10px; padding-left: 24px;
  border-left: 3px solid var(--aic-hair-strong); }
.aic-fig .fg-aux-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); }
.aic-fig .fg-aux-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 52px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-fig .fg-aux-val u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

.aic-fig .fg-note { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 26px; color: var(--aic-muted);
  display: flex; align-items: center; gap: 14px; }
.aic-fig .fg-note::before { content: ''; width: 26px; height: 2px; background: var(--aic-hair-strong); flex: none; }

.aic-fig .fg-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-fig .fg-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-fig .fg-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-fig .fg-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','pos','pos','warn','accent','pos','accent','pos','warn','pos','accent','pos',
  'pos','accent','warn','pos','accent','pos','pos','warn','accent','pos','accent','pos','warn','pos',
  'accent','pos','pos','accent','warn','pos','accent','pos','pos','accent'].map((tone) => ({ tone }));

const LENS_DISCS = [
  { x: 40, y: 34, d: 54 },
  { x: 66, y: 30, d: 36 },
  { x: 56, y: 64, d: 46 },
  { x: 80, y: 58, d: 28 },
];

export default function FigureCasePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-fig', CSS);
  const vars = themeVars(p.accentColor);

  const auxN = Math.max(0, Math.min(copy.aux.length, p.auxCount));
  const aux = copy.aux.slice(0, auxN);

  return (
    <div className="aic-fig" style={vars}>
      {p.showDecorations && <div className="fg-glow" />}
      {p.showGhost && <div className="fg-ghost">{copy.ghost}</div>}
      {p.showLens && <div className="fg-lens"><LensCluster discs={LENS_DISCS} /></div>}

      <div className="fg-head">
        <div>
          <p className="fg-eyebrow">{copy.eyebrow}</p>
          <h2 className="fg-title">{copy.title}</h2>
        </div>
        <div className="fg-sub">{copy.sub}</div>
      </div>

      <div className="fg-hero">
        <div className="fg-kicker"><b /><span>{copy.kicker}</span></div>
        <div className="fg-bignum">
          <BigNumber lead={copy.numLead} tail={copy.numTail} unit={copy.numUnit}
            slant={p.numberSlant} size={360} />
        </div>
        {p.showCaption && <p className="fg-caption">{copy.numCaption}</p>}
      </div>

      {auxN > 0 && (
        <div className="fg-aux">
          {aux.map((a) => (
            <div className="fg-aux-item" key={a.label}>
              <div className="fg-aux-lbl">{a.label}</div>
              <div className="fg-aux-val">{a.value}{a.unit ? <u>{a.unit}</u> : null}</div>
            </div>
          ))}
        </div>
      )}

      {p.showNote && <div className="fg-note">{copy.note}</div>}

      <div className="fg-foot">
        <div className="fg-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="fg-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
