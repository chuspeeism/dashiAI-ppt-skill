/**
 * ColdStartPage — P17 冷启动季度 (Quarter Breakdown · Q1 · Chart-led)
 *
 * A single-quarter deep-dive chart slide: the monthly funding bars are the
 * hero visual, with a large season marker, a lead, a grid of metric cards and
 * an optional full-year context strip showing where this quarter sits.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-cold`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY; only the
 * exported `defaultProps` / `controls` drive structural + style variation.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Quarter Breakdown',
  marker: 'Q1',
  season: '2024 第一季度 · 起步',
  title: '冷启动季度',
  titleTail: 'Q1 融资拆解',
  lead: 'Q1 交易数量稳定，但整体金额尚未进入全年高峰，更像上一年度项目延续，市场仍在等待新一轮验证。',
  closing: '全年热度从保守启动开始。',
  chartLabel: '月度融资额 / 亿美元',
  // monthly series for this quarter
  months: [
    { m: '1月', amount: 45 },
    { m: '2月', amount: 58 },
    { m: '3月', amount: 59 },
  ],
  // full-year context (which quarter is "this" one)
  context: [
    { q: 'Q1', amount: 162 },
    { q: 'Q2', amount: 284 },
    { q: 'Q3', amount: 318 },
    { q: 'Q4', amount: 206 },
  ],
  contextActive: 0,
  contextLabel: '全年季度对比',
  // metric cards (order fixed; count is prop-driven)
  metrics: [
    { label: '融资额', value: '162', unit: '亿美元' },
    { label: '事件数', value: '18', unit: '笔' },
    { label: '平均单笔', value: '9.0', unit: '亿美元' },
    { label: '最大单笔', value: '32', unit: '亿美元' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'bars',     // 'bars' | 'line' | 'area' — monthly hero chart style
  metricCount: 4,        // metric cards shown (2–4)
  focusEnabled: true,    // highlight one metric card
  focusIndex: 0,         // which metric card is the focus (0-based)
  showContext: true,     // full-year context strip
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Quarter Breakdown' },
  { key: 'marker', label: 'marker', type: 'text', default: 'Q1' },
  { key: 'season', label: 'season', type: 'text', default: '2024 第一季度 · 起步' },
  { key: 'title', label: '标题', type: 'text', default: '冷启动季度' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'Q1 融资拆解' },
  { key: 'lead', label: '导言', type: 'text', default: 'Q1 交易数量稳定，但整体金额尚未进入全年高峰，更像上一年度项目延续，市场仍在等待新一轮验证。' },
  { key: 'closing', label: '结语', type: 'text', default: '全年热度从保守启动开始。' },
  { key: 'chartLabel', label: 'chartLabel', type: 'text', default: '月度融资额 / 亿美元' },
  { key: 'contextLabel', label: 'contextLabel', type: 'text', default: '全年季度对比' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bars',
    options: [
      { value: 'bars', label: '柱状' },
      { value: 'line', label: '折线' },
      { value: 'area', label: '面积' },
    ],
    description: '主图表（月度序列）的呈现方式：柱状 / 折线 / 面积。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '指标卡数量（2–4）；自动重排为完整网格。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showContext', label: '背景对比', type: 'toggle', default: true,
    description: '全年季度对比条的显隐，用于交代当前季度在全年中的位置。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于图表、季度标记与高亮卡。' },
];

const CSS = `
.aic-cold { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cold, .aic-cold * { box-sizing: border-box; }
.aic-cold .cd-glow { position: absolute; right: -4%; top: -8%; width: 54%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-cold .cd-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cold .cd-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cold .cd-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-cold .cd-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-cold .cd-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left rail */
.aic-cold .cd-rail { position: absolute; left: var(--pad); top: 300px; bottom: 70px; width: 620px;
  display: flex; flex-direction: column; }
.aic-cold .cd-marker { display: flex; align-items: baseline; gap: 22px; }
.aic-cold .cd-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 150px; line-height: .8;
  color: var(--aic-accent); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-cold .cd-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--aic-muted); max-width: 200px; line-height: 1.4; }
.aic-cold .cd-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.55;
  color: var(--aic-ink); margin: 34px 0 0; }
.aic-cold .cd-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 38px; }
.aic-cold .cd-card { border-radius: 18px; padding: 22px 26px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); transition: background .3s, border-color .3s, transform .3s; }
.aic-cold .cd-card[data-focus="1"] { background: var(--aic-accent); border-color: var(--aic-accent); transform: translateY(-5px); }
.aic-cold .cd-card-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 20px; color: var(--aic-muted); }
.aic-cold .cd-card[data-focus="1"] .cd-card-lbl { color: rgba(14,17,11,.62); }
.aic-cold .cd-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 46px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; margin-top: 6px; line-height: 1; }
.aic-cold .cd-card-val u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }
.aic-cold .cd-card[data-focus="1"] .cd-card-val u { color: rgba(14,17,11,.62); }
.aic-cold .cd-closing { display: flex; align-items: center; gap: 16px; margin-top: auto; padding-top: 34px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cold .cd-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

/* right chart */
.aic-cold .cd-chart { position: absolute; left: 780px; right: var(--pad); top: 300px; }
.aic-cold .cd-chart-t { display: flex; align-items: center; justify-content: space-between; margin: 0 0 18px; }
.aic-cold .cd-chart-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-cold .cd-chart-t em { font-style: normal; font-family: var(--aic-font-text); font-weight: 600; font-size: 20px; color: var(--aic-ink-dim); }
.aic-cold .cd-svg { display: block; width: 100%; height: auto; }

/* full-year context strip */
.aic-cold .cd-ctx { position: absolute; left: 780px; right: var(--pad); bottom: 70px; }
.aic-cold .cd-ctx-cap { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-faint); margin: 0 0 18px; }
.aic-cold .cd-ctx-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: end; }
.aic-cold .cd-ctx-bar { display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
.aic-cold .cd-ctx-track { height: 64px; display: flex; align-items: flex-end; }
.aic-cold .cd-ctx-fill { width: 100%; border-radius: 8px 8px 0 0; background: var(--aic-hair-strong); transition: height .5s; }
.aic-cold .cd-ctx-bar[data-active="1"] .cd-ctx-fill { background: var(--aic-accent); }
.aic-cold .cd-ctx-meta { display: flex; align-items: baseline; justify-content: space-between; }
.aic-cold .cd-ctx-q { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-muted);
  transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-cold .cd-ctx-bar[data-active="1"] .cd-ctx-q { color: var(--aic-ink); }
.aic-cold .cd-ctx-v { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; color: var(--aic-faint);
  font-variant-numeric: tabular-nums; }
.aic-cold .cd-ctx-bar[data-active="1"] .cd-ctx-v { color: var(--aic-ink-dim); }
`;

// chart geometry (SVG user units)
const VW = 1000, VH = 470;
const M = { l: 56, r: 24, t: 48, b: 56 };
const AMAX = 72; // y-axis headroom for Q1 monthly figures (亿美元)

export default function ColdStartPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, marker: p.marker !== undefined ? p.marker : COPY.marker, season: p.season !== undefined ? p.season : COPY.season, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, chartLabel: p.chartLabel !== undefined ? p.chartLabel : COPY.chartLabel, contextLabel: p.contextLabel !== undefined ? p.contextLabel : COPY.contextLabel, months: p.months !== undefined ? p.months : COPY.months, context: p.context !== undefined ? p.context : COPY.context, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-cold', CSS);
  const vars = themeVars(p.accentColor);

  const metricN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, metricN);
  const focus = Math.max(0, Math.min(metricN - 1, p.focusIndex));

  const ms = copy.months;
  const n = ms.length;
  const plotW = VW - M.l - M.r;
  const plotH = VH - M.t - M.b;
  const x = (i) => M.l + (plotW * (i + 0.5)) / n;
  const y = (v) => M.t + plotH * (1 - v / AMAX);
  const gridVals = [20, 40, 60];

  const linePts = ms.map((d, i) => [x(i), y(d.amount)]);
  const linePath = linePts.map(([px, py], i) => (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)).join(' ');
  const areaPath = `M ${x(0).toFixed(1)} ${(VH - M.b).toFixed(1)} `
    + linePts.map(([px, py]) => `L ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
    + ` L ${x(n - 1).toFixed(1)} ${(VH - M.b).toFixed(1)} Z`;

  const ctxMax = Math.max(...copy.context.map((c) => c.amount));

  return (
    <div className="aic-cold" style={vars}>
      {p.showDecorations && <div className="cd-glow" />}

      <div className="cd-head">
        <div>
          <p className="cd-eyebrow">{copy.eyebrow}</p>
          <h2 className="cd-title">{copy.title}</h2>
        </div>
        <div className="cd-sub">{copy.titleTail}</div>
      </div>

      <div className="cd-rail">
        <div className="cd-marker">
          <b>{copy.marker}</b>
          <span className="cd-season">{copy.season}</span>
        </div>
        <p className="cd-lead">{copy.lead}</p>
        <div className="cd-cards" style={{ gridTemplateColumns: metricN <= 2 ? '1fr 1fr' : '1fr 1fr' }}>
          {metrics.map((mt, i) => (
            <div className="cd-card" key={mt.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="cd-card-lbl">{mt.label}</div>
              <div className="cd-card-val">{mt.value}<u>{mt.unit}</u></div>
            </div>
          ))}
        </div>
        <div className="cd-closing"><b />{copy.closing}</div>
      </div>

      <div className="cd-chart">
        <div className="cd-chart-t">
          <span>{copy.chartLabel}</span>
          <em>Q1 · 1 — 3 月</em>
        </div>
        <svg className="cd-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">
          {p.showDecorations && gridVals.map((v) => (
            <g key={v}>
              <line x1={M.l} y1={y(v)} x2={VW - M.r} y2={y(v)} stroke="var(--aic-hair)" strokeWidth="1.5" />
              <text x={M.l - 14} y={y(v) + 6} textAnchor="end"
                style={{ fontFamily: 'var(--aic-font-display)', fontSize: 18, fontWeight: 600, fill: 'var(--aic-faint)' }}>{v}</text>
            </g>
          ))}
          <line x1={M.l} y1={VH - M.b} x2={VW - M.r} y2={VH - M.b} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />

          {p.chartType === 'bars' ? (
            ms.map((d, i) => {
              const bw = (plotW / n) * 0.46;
              return (
                <rect key={i} x={x(i) - bw / 2} y={y(d.amount)} width={bw} height={(VH - M.b) - y(d.amount)}
                  rx="8" fill="var(--aic-accent)" />
              );
            })
          ) : (
            <>
              {p.chartType === 'area' && <path d={areaPath} fill="var(--aic-accent)" opacity="0.18" />}
              <path d={linePath} fill="none" stroke="var(--aic-accent)" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round" />
              {ms.map((d, i) => (
                <circle key={i} cx={x(i)} cy={y(d.amount)} r="8" fill="var(--aic-paper)"
                  stroke="var(--aic-accent)" strokeWidth="4" />
              ))}
            </>
          )}

          {/* value labels */}
          {ms.map((d, i) => (
            <text key={i} x={x(i)} y={y(d.amount) - 20} textAnchor="middle"
              style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 28, fill: 'var(--aic-ink)' }}>{d.amount}</text>
          ))}
          {/* month labels */}
          {ms.map((d, i) => (
            <text key={i} x={x(i)} y={VH - M.b + 34} textAnchor="middle"
              style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 24, fill: 'var(--aic-muted)' }}>{d.m}</text>
          ))}
        </svg>
      </div>

      {p.showContext && (
        <div className="cd-ctx">
          <p className="cd-ctx-cap">{copy.contextLabel}</p>
          <div className="cd-ctx-row">
            {copy.context.map((c, i) => (
              <div className="cd-ctx-bar" key={c.q} data-active={i === copy.contextActive ? '1' : '0'}>
                <div className="cd-ctx-track">
                  <div className="cd-ctx-fill" style={{ height: (c.amount / ctxMax) * 100 + '%' }} />
                </div>
                <div className="cd-ctx-meta">
                  <span className="cd-ctx-q">{c.q}</span>
                  <span className="cd-ctx-v">{c.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
