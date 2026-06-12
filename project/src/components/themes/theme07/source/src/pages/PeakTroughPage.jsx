/**
 * PeakTroughPage — P21 峰值与低位 (Peak & Trough · Chart-led)
 *
 * A monthly funding-amount bar chart where the year's high and low months are
 * called out against the rest. The chart is the hero; an average reference
 * line and a pair of extreme callouts (peak / trough) carry the read.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-pt`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Peak and Trough',
  title: '峰值与低位',
  sub: '月度峰谷对比',
  lead: '8 月为全年峰值，1 月为低位，峰谷差体现交易集中度。',
  closing: '月度波动背后是头部交易节奏。',
  chartLabel: '月度融资额 / 亿美元',
  avgLabel: '全年均值',
  // 12-month series; kind: 'peak' | 'trough' | 'normal'
  months: [
    { m: '1', amount: 45, kind: 'trough' },
    { m: '2', amount: 58, kind: 'normal' },
    { m: '3', amount: 59, kind: 'normal' },
    { m: '4', amount: 86, kind: 'normal' },
    { m: '5', amount: 105, kind: 'peak' },
    { m: '6', amount: 93, kind: 'normal' },
    { m: '7', amount: 92, kind: 'normal' },
    { m: '8', amount: 118, kind: 'peak' },
    { m: '9', amount: 108, kind: 'peak' },
    { m: '10', amount: 73, kind: 'normal' },
    { m: '11', amount: 81, kind: 'normal' },
    { m: '12', amount: 52, kind: 'trough' },
  ],
  // extreme callouts (order fixed; count is prop-driven)
  extremes: [
    { tag: '峰值', m: '8 月', value: '118', unit: '亿美元', dir: 'peak' },
    { tag: '次高', m: '9 月', value: '108', unit: '亿美元', dir: 'peak' },
    { tag: '低位', m: '1 月', value: '45', unit: '亿美元', dir: 'trough' },
    { tag: '年末', m: '12 月', value: '52', unit: '亿美元', dir: 'trough' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'bars',     // 'bars' | 'lollipop' — monthly hero chart style
  barCount: 12,          // months shown (6–12)
  highlightExtremes: true, // color peak (accent) / trough (red) vs neutral
  showAverage: true,     // full-year average reference line
  calloutCount: 3,       // extreme callout cards (0–4)
  focusEnabled: true,    // emphasise one callout
  focusIndex: 0,         // which callout is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Peak and Trough' },
  { key: 'title', label: '标题', type: 'text', default: '峰值与低位' },
  { key: 'sub', label: '次标题', type: 'text', default: '月度峰谷对比' },
  { key: 'lead', label: '导言', type: 'text', default: '8 月为全年峰值，1 月为低位，峰谷差体现交易集中度。' },
  { key: 'closing', label: '结语', type: 'text', default: '月度波动背后是头部交易节奏。' },
  { key: 'chartLabel', label: 'chartLabel', type: 'text', default: '月度融资额 / 亿美元' },
  { key: 'avgLabel', label: 'avgLabel', type: 'text', default: '全年均值' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bars',
    options: [{ value: 'bars', label: '柱状' }, { value: 'lollipop', label: '棒点' }],
    description: '主图表样式：实心柱状 / 棒棒糖（细杆 + 圆点）。' },
  { key: 'barCount', label: '柱子数量', type: 'slider', default: 12, min: 6, max: 12, step: 1,
    description: '展示的月份数量（6–12），自右向左裁剪。' },
  { key: 'highlightExtremes', label: '峰谷高亮', type: 'toggle', default: true,
    description: '是否用强调色 / 警示色区分峰值与低位月份。' },
  { key: 'showAverage', label: '均值参考线', type: 'toggle', default: true,
    description: '全年平均水平虚线参考线的显隐。' },
  { key: 'calloutCount', label: '卡片数量', type: 'slider', default: 3, min: 0, max: 4, step: 1,
    description: '峰谷信息卡数量（0–4）；为 0 时仅保留图表。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张峰谷信息卡。', showWhen: (p) => p.calloutCount > 0 },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的信息卡。', showWhen: (p) => p.calloutCount > 0 && p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于峰值柱、均值线与高亮卡。' },
];

const CSS = `
.aic-pt { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-pt, .aic-pt * { box-sizing: border-box; }
.aic-pt .pt-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 54%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-pt .pt-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-pt .pt-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-pt .pt-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-pt .pt-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-pt .pt-lead { position: absolute; left: var(--pad); right: var(--pad); top: 300px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.45; color: var(--aic-ink);
  max-width: 1300px; margin: 0; }
.aic-pt .pt-lead b { color: var(--aic-accent-deep); font-weight: 700; }

/* chart */
.aic-pt .pt-chart { position: absolute; left: var(--pad); right: var(--pad); top: 408px; bottom: 326px; }
.aic-pt .pt-chart-t { display: flex; align-items: center; justify-content: space-between; margin: 0 0 4px; }
.aic-pt .pt-chart-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-pt .pt-legend { display: flex; align-items: center; gap: 26px; }
.aic-pt .pt-leg { display: flex; align-items: center; gap: 9px; font-family: var(--aic-font-text); font-weight: 600;
  font-size: 18px; color: var(--aic-muted); }
.aic-pt .pt-leg i { width: 16px; height: 16px; border-radius: 4px; }
.aic-pt .pt-svg { display: block; width: 100%; height: 100%; }

/* callouts */
.aic-pt .pt-cards { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px;
  display: grid; gap: 18px; }
.aic-pt .pt-card { border-radius: 18px; padding: 22px 26px; background: var(--aic-card); border: 1.5px solid var(--aic-hair);
  display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden;
  transition: background .3s, border-color .3s, transform .3s; }
.aic-pt .pt-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
  background: var(--aic-hair-strong); }
.aic-pt .pt-card[data-dir="peak"]::before { background: var(--aic-accent); }
.aic-pt .pt-card[data-dir="trough"]::before { background: var(--aic-neg); }
.aic-pt .pt-card[data-focus="1"] { transform: translateY(-5px); border-color: var(--aic-ink); }
.aic-pt .pt-card-tag { display: flex; align-items: baseline; gap: 10px; }
.aic-pt .pt-card-tag b { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-ink); }
.aic-pt .pt-card-tag span { font-family: var(--aic-font-text); font-weight: 600; font-size: 18px; color: var(--aic-muted); }
.aic-pt .pt-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 46px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; margin-top: 4px; }
.aic-pt .pt-card-val u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

.aic-pt .pt-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-pt .pt-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-pt .pt-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-pt .pt-deco { width: 300px; height: 30px; }
`;

const HEAT = ['trough','normal','normal','normal','peak','normal','normal','peak','peak','normal','normal','trough']
  .map((k) => ({ tone: k === 'peak' ? 'accent' : k === 'trough' ? 'neg' : 'faint' }));

// chart geometry (SVG user units)
const VW = 1728, VH = 360;
const M = { l: 8, r: 8, t: 46, b: 38 };

function barColor(kind, highlight) {
  if (!highlight) return 'var(--aic-ink)';
  if (kind === 'peak') return 'var(--aic-accent)';
  if (kind === 'trough') return 'var(--aic-neg)';
  return 'var(--aic-hair-strong)';
}

export default function PeakTroughPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, sub: p.sub !== undefined ? p.sub : COPY.sub, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, chartLabel: p.chartLabel !== undefined ? p.chartLabel : COPY.chartLabel, avgLabel: p.avgLabel !== undefined ? p.avgLabel : COPY.avgLabel, months: p.months !== undefined ? p.months : COPY.months, extremes: p.extremes !== undefined ? p.extremes : COPY.extremes };
  ensureFonts();
  injectScopedStyle('aic-pt', CSS);
  const vars = themeVars(p.accentColor);

  const bc = Math.max(6, Math.min(copy.months.length, p.barCount));
  const ms = copy.months.slice(copy.months.length - bc); // keep most-recent months
  const n = ms.length;

  const calloutN = Math.max(0, Math.min(copy.extremes.length, p.calloutCount));
  const cards = copy.extremes.slice(0, calloutN);
  const focus = Math.max(0, Math.min(calloutN - 1, p.focusIndex));

  const amax = Math.max(...ms.map((d) => d.amount)) * 1.16;
  const avg = ms.reduce((s, d) => s + d.amount, 0) / n;
  const plotW = VW - M.l - M.r;
  const plotH = VH - M.t - M.b;
  const slot = plotW / n;
  const x = (i) => M.l + slot * (i + 0.5);
  const y = (v) => M.t + plotH * (1 - v / amax);
  const baseY = VH - M.b;

  return (
    <div className="aic-pt" style={vars}>
      {p.showDecorations && <div className="pt-glow" />}

      <div className="pt-head">
        <div>
          <p className="pt-eyebrow">{copy.eyebrow}</p>
          <h2 className="pt-title">{copy.title}</h2>
        </div>
        <div className="pt-sub">{copy.sub}</div>
      </div>

      <p className="pt-lead">{copy.lead}</p>

      <div className="pt-chart">
        <div className="pt-chart-t">
          <span>{copy.chartLabel}</span>
          {p.highlightExtremes && (
            <div className="pt-legend">
              <span className="pt-leg"><i style={{ background: 'var(--aic-accent)' }} />峰值</span>
              <span className="pt-leg"><i style={{ background: 'var(--aic-neg)' }} />低位</span>
              <span className="pt-leg"><i style={{ background: 'var(--aic-hair-strong)' }} />常规</span>
            </div>
          )}
        </div>
        <svg className="pt-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
          {/* average line */}
          {p.showAverage && (
            <g>
              <line x1={M.l} y1={y(avg)} x2={VW - M.r} y2={y(avg)} stroke="var(--aic-ink)"
                strokeWidth="1.6" strokeDasharray="4 8" opacity="0.45" />
              <text x={VW - M.r} y={y(avg) - 10} textAnchor="end"
                style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 600, fontSize: 18, fill: 'var(--aic-muted)' }}>
                {copy.avgLabel} · {avg.toFixed(0)}</text>
            </g>
          )}
          <line x1={M.l} y1={baseY} x2={VW - M.r} y2={baseY} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />

          {ms.map((d, i) => {
            const col = barColor(d.kind, p.highlightExtremes);
            const isExt = d.kind !== 'normal';
            if (p.chartType === 'lollipop') {
              return (
                <g key={i}>
                  <line x1={x(i)} y1={baseY} x2={x(i)} y2={y(d.amount)} stroke={col} strokeWidth="4" />
                  <circle cx={x(i)} cy={y(d.amount)} r={isExt && p.highlightExtremes ? 13 : 9} fill={col} />
                </g>
              );
            }
            const bw = Math.min(slot * 0.56, 86);
            return (
              <rect key={i} x={x(i) - bw / 2} y={y(d.amount)} width={bw} height={baseY - y(d.amount)}
                rx="8" fill={col} />
            );
          })}

          {/* value labels for extremes only */}
          {ms.map((d, i) => (d.kind !== 'normal' && p.highlightExtremes) ? (
            <text key={i} x={x(i)} y={y(d.amount) - 16} textAnchor="middle"
              style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 26, fill: 'var(--aic-ink)' }}>{d.amount}</text>
          ) : null)}
          {/* month labels */}
          {ms.map((d, i) => (
            <text key={i} x={x(i)} y={baseY + 26} textAnchor="middle"
              style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 600, fontSize: 18,
                fill: d.kind !== 'normal' && p.highlightExtremes ? 'var(--aic-ink)' : 'var(--aic-faint)' }}>{d.m}月</text>
          ))}
        </svg>
      </div>

      {calloutN > 0 && (
        <div className="pt-cards" style={{ gridTemplateColumns: `repeat(${calloutN}, 1fr)` }}>
          {cards.map((c, i) => (
            <div className="pt-card" key={c.tag} data-dir={c.dir}
              data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="pt-card-tag"><b>{c.tag}</b><span>{c.m}</span></div>
              <div className="pt-card-val">{c.value}<u>{c.unit}</u></div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-foot">
        <div className="pt-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="pt-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
