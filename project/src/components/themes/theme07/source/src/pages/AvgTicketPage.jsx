/**
 * AvgTicketPage — P24 赛道平均融资额 (Average Ticket · Big Number)
 *
 * A big-number anchor slide: one oversized figure ("10 亿美元") dominates the
 * canvas, flanked by a short explanation, a few supporting metrics and the
 * brand lens motif. The number is the hero.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-at`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Average Ticket',
  title: '赛道平均融资额',
  sub: '平均单笔规模',
  // hero number
  numLead: '10',
  numTail: '',
  numUnit: '亿美元',
  numCaption: '全年平均单笔融资规模',
  note: '垂直应用不应只用融资规模评价，更要看收入效率。',
  closing: '融资规模越大，后续兑现压力越高。',
  // supporting metrics (order fixed; count is prop-driven)
  aux: [
    { label: '总事件数', value: '97', unit: '笔' },
    { label: '全年融资额', value: '970', unit: '亿美元' },
    { label: '最高单笔', value: '64', unit: '亿美元' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  numberSlant: true,     // brand italic-slant on the hero digits
  auxCount: 3,           // supporting metric chips (0–3)
  showCaption: true,     // explanatory caption under the number
  showNote: true,        // supporting note line
  showLens: true,        // brand lens-cluster motif
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Average Ticket' },
  { key: 'title', label: '标题', type: 'text', default: '赛道平均融资额' },
  { key: 'sub', label: '次标题', type: 'text', default: '平均单笔规模' },
  { key: 'numLead', label: 'numLead', type: 'text', default: '10' },
  { key: 'numUnit', label: 'numUnit', type: 'text', default: '亿美元' },
  { key: 'numCaption', label: 'numCaption', type: 'text', default: '全年平均单笔融资规模' },
  { key: 'note', label: 'note', type: 'text', default: '垂直应用不应只用融资规模评价，更要看收入效率。' },
  { key: 'closing', label: '结语', type: 'text', default: '融资规模越大，后续兑现压力越高。' },
  { key: 'numberSlant', label: '数字倾斜', type: 'toggle', default: true,
    description: '主数字是否应用品牌斜切（italic-slant）效果。' },
  { key: 'auxCount', label: '卡片数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '辅助指标数量（0–3）；为 0 时只保留主数字。' },
  { key: 'showCaption', label: '说明文案', type: 'toggle', default: true,
    description: '主数字下方解释性说明的显隐。' },
  { key: 'showNote', label: '辅助注释', type: 'toggle', default: true,
    description: '底部补充注释的显隐。' },
  { key: 'showLens', label: '品牌图形', type: 'toggle', default: true,
    description: '品牌透镜图形（焦点圆盘）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于主数字下划线、品牌图形与点缀。' },
];

const CSS = `
.aic-at { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-at, .aic-at * { box-sizing: border-box; }
.aic-at .at-glow { position: absolute; left: 38%; top: 26%; width: 56%; height: 64%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 26%, transparent), transparent 72%); }
.aic-at .at-lens { position: absolute; right: -90px; top: 200px; width: 760px; height: 760px; opacity: .9; pointer-events: none; }

.aic-at .at-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-at .at-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-at .at-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 60px; line-height: .96; margin: 0; }
.aic-at .at-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* hero number block */
.aic-at .at-hero { position: absolute; left: var(--pad); top: 330px; right: var(--pad); }
.aic-at .at-kicker { display: flex; align-items: center; gap: 16px; margin: 0 0 8px; }
.aic-at .at-kicker b { width: 64px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-at .at-kicker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-at .at-bignum { line-height: .8; }
.aic-at .at-caption { font-family: var(--aic-font-text); font-weight: 600; font-size: 38px; color: var(--aic-ink-dim);
  margin: 28px 0 0; max-width: 1000px; }

/* supporting metrics */
.aic-at .at-aux { position: absolute; left: var(--pad); right: var(--pad); bottom: 232px;
  display: flex; gap: 56px; }
.aic-at .at-aux-item { display: flex; flex-direction: column; gap: 8px; padding-left: 24px;
  border-left: 3px solid var(--aic-hair-strong); }
.aic-at .at-aux-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); }
.aic-at .at-aux-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 52px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-at .at-aux-val u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

.aic-at .at-note { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 26px; color: var(--aic-muted);
  display: flex; align-items: center; gap: 14px; }
.aic-at .at-note::before { content: ''; width: 26px; height: 2px; background: var(--aic-hair-strong); flex: none; }

.aic-at .at-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-at .at-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-at .at-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-at .at-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','warn','accent','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

const LENS_DISCS = [
  { x: 42, y: 36, d: 56 },
  { x: 66, y: 30, d: 38 },
  { x: 58, y: 64, d: 48 },
  { x: 80, y: 58, d: 28 },
];

export default function AvgTicketPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, sub: p.sub !== undefined ? p.sub : COPY.sub, numLead: p.numLead !== undefined ? p.numLead : COPY.numLead, numUnit: p.numUnit !== undefined ? p.numUnit : COPY.numUnit, numCaption: p.numCaption !== undefined ? p.numCaption : COPY.numCaption, note: p.note !== undefined ? p.note : COPY.note, closing: p.closing !== undefined ? p.closing : COPY.closing, aux: p.aux !== undefined ? p.aux : COPY.aux };
  ensureFonts();
  injectScopedStyle('aic-at', CSS);
  const vars = themeVars(p.accentColor);

  const auxN = Math.max(0, Math.min(copy.aux.length, p.auxCount));
  const aux = copy.aux.slice(0, auxN);

  return (
    <div className="aic-at" style={vars}>
      {p.showDecorations && <div className="at-glow" />}
      {p.showLens && <div className="at-lens"><LensCluster discs={LENS_DISCS} /></div>}

      <div className="at-head">
        <div>
          <p className="at-eyebrow">{copy.eyebrow}</p>
          <h2 className="at-title">{copy.title}</h2>
        </div>
        <div className="at-sub">{copy.sub}</div>
      </div>

      <div className="at-hero">
        <div className="at-kicker"><b />{copy.sub}</div>
        <div className="at-bignum">
          <BigNumber lead={copy.numLead} tail={copy.numTail} unit={copy.numUnit}
            slant={p.numberSlant} size={380} />
        </div>
        {p.showCaption && <p className="at-caption">{copy.numCaption}</p>}
      </div>

      {auxN > 0 && (
        <div className="at-aux">
          {aux.map((a) => (
            <div className="at-aux-item" key={a.label}>
              <div className="at-aux-lbl">{a.label}</div>
              <div className="at-aux-val">{a.value}<u>{a.unit}</u></div>
            </div>
          ))}
        </div>
      )}

      {p.showNote && <div className="at-note">{copy.note}</div>}

      <div className="at-foot">
        <div className="at-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="at-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
