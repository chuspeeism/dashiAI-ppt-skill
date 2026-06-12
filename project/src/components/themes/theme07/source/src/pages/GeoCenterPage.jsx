/**
 * GeoCenterPage — P56 最大地理中心 (Bay Area Cluster · Big Number)
 *
 * A big-number anchor slide: one oversized figure ("63.9%") dominates the
 * canvas, flanked by a short explanation, a few supporting metrics and the
 * brand lens motif. The percentage is the hero — the Bay Area's share of
 * AI funding.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-geo`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Bay Area Cluster',
  title: '最大地理中心',
  sub: '旧金山湾区集群',
  // hero number — 63.9% (lead in ink, decimal tail in gray, unit trailing)
  numLead: '63',
  numTail: '.9',
  numUnit: '%',
  numCaption: '旧金山湾区融资额占比',
  note: '优势来自人才密度、资本网络、云厂商和模型实验室邻近。',
  closing: '湾区仍是 AI 资本重力中心。',
  // supporting metrics (order fixed; count is prop-driven)
  aux: [
    { label: '区域融资额', value: '620', unit: '亿美元' },
    { label: '区域事件数', value: '62', unit: '笔' },
    { label: '平均单笔', value: '10.0', unit: '亿美元' },
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
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Bay Area Cluster' },
  { key: 'title', label: '标题', type: 'text', default: '最大地理中心' },
  { key: 'sub', label: '次标题', type: 'text', default: '旧金山湾区集群' },
  { key: 'numLead', label: 'numLead', type: 'text', default: '63' },
  { key: 'numTail', label: 'numTail', type: 'text', default: '.9' },
  { key: 'numUnit', label: 'numUnit', type: 'text', default: '%' },
  { key: 'numCaption', label: 'numCaption', type: 'text', default: '旧金山湾区融资额占比' },
  { key: 'note', label: 'note', type: 'text', default: '优势来自人才密度、资本网络、云厂商和模型实验室邻近。' },
  { key: 'closing', label: '结语', type: 'text', default: '湾区仍是 AI 资本重力中心。' },
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
    description: '品牌强调色，作用于主数字点缀、品牌图形与高亮。' },
];

const CSS = `
.aic-geo { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-geo, .aic-geo * { box-sizing: border-box; }
.aic-geo .ge-glow { position: absolute; left: 38%; top: 26%; width: 56%; height: 64%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 26%, transparent), transparent 72%); }
.aic-geo .ge-lens { position: absolute; right: -90px; top: 200px; width: 760px; height: 760px; opacity: .9; pointer-events: none; }

.aic-geo .ge-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-geo .ge-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-geo .ge-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 60px; line-height: .96; margin: 0; }
.aic-geo .ge-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* hero number block */
.aic-geo .ge-hero { position: absolute; left: var(--pad); top: 330px; right: var(--pad); }
.aic-geo .ge-kicker { display: flex; align-items: center; gap: 16px; margin: 0 0 8px; }
.aic-geo .ge-kicker b { width: 64px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-geo .ge-kicker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-geo .ge-bignum { line-height: .8; }
.aic-geo .ge-caption { font-family: var(--aic-font-text); font-weight: 600; font-size: 38px; color: var(--aic-ink-dim);
  margin: 28px 0 0; max-width: 1000px; }

/* supporting metrics */
.aic-geo .ge-aux { position: absolute; left: var(--pad); right: var(--pad); bottom: 232px;
  display: flex; gap: 56px; }
.aic-geo .ge-aux-item { display: flex; flex-direction: column; gap: 8px; padding-left: 24px;
  border-left: 3px solid var(--aic-hair-strong); }
.aic-geo .ge-aux-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); }
.aic-geo .ge-aux-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 52px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-geo .ge-aux-val u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

.aic-geo .ge-note { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 26px; color: var(--aic-muted);
  display: flex; align-items: center; gap: 14px; }
.aic-geo .ge-note::before { content: ''; width: 26px; height: 2px; background: var(--aic-hair-strong); flex: none; }

.aic-geo .ge-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-geo .ge-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-geo .ge-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-geo .ge-deco { width: 300px; height: 30px; }
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

export default function GeoCenterPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, sub: p.sub !== undefined ? p.sub : COPY.sub, numLead: p.numLead !== undefined ? p.numLead : COPY.numLead, numTail: p.numTail !== undefined ? p.numTail : COPY.numTail, numUnit: p.numUnit !== undefined ? p.numUnit : COPY.numUnit, numCaption: p.numCaption !== undefined ? p.numCaption : COPY.numCaption, note: p.note !== undefined ? p.note : COPY.note, closing: p.closing !== undefined ? p.closing : COPY.closing, aux: p.aux !== undefined ? p.aux : COPY.aux };
  ensureFonts();
  injectScopedStyle('aic-geo', CSS);
  const vars = themeVars(p.accentColor);

  const auxN = Math.max(0, Math.min(copy.aux.length, p.auxCount));
  const aux = copy.aux.slice(0, auxN);

  return (
    <div className="aic-geo" style={vars}>
      {p.showDecorations && <div className="ge-glow" />}
      {p.showLens && <div className="ge-lens"><LensCluster discs={LENS_DISCS} /></div>}

      <div className="ge-head">
        <div>
          <p className="ge-eyebrow">{copy.eyebrow}</p>
          <h2 className="ge-title">{copy.title}</h2>
        </div>
        <div className="ge-sub">{copy.sub}</div>
      </div>

      <div className="ge-hero">
        <div className="ge-kicker"><b />{copy.sub}</div>
        <div className="ge-bignum">
          <BigNumber lead={copy.numLead} tail={copy.numTail} unit={copy.numUnit}
            slant={p.numberSlant} size={380} />
        </div>
        {p.showCaption && <p className="ge-caption">{copy.numCaption}</p>}
      </div>

      {auxN > 0 && (
        <div className="ge-aux">
          {aux.map((a) => (
            <div className="ge-aux-item" key={a.label}>
              <div className="ge-aux-lbl">{a.label}</div>
              <div className="ge-aux-val">{a.value}<u>{a.unit}</u></div>
            </div>
          ))}
        </div>
      )}

      {p.showNote && <div className="ge-note">{copy.note}</div>}

      <div className="ge-foot">
        <div className="ge-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ge-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
