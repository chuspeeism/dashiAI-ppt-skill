/**
 * PeakPage — P19 全年峰值季度 (Quarter Breakdown · Q3 · Chart-led)
 *
 * Chart-led single-quarter slide. Per the source brief the main visual is a
 * "峰值标记 + 高亮面积图" — a full-year monthly funding chart with the August peak
 * called out — so the hero (left) is that information chart, paired on the right
 * with a quarter marker, a lead and peak metric cards. This is an INFORMATION
 * chart (data viz), not a logic diagram; chart type, the peak marker, the average
 * baseline, metric-card count and the focus card are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-peak`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Quarter Breakdown',
  marker: 'Q3',
  season: '2024 第三季度 · 峰值',
  title: '全年峰值季度',
  titleTail: 'Q3 融资拆解',
  lead: 'Q3 融资额和事件数均达到全年最高，是市场情绪高点，强度来自头部公司融资和多赛道同时活跃。',
  closing: '高峰之后，市场开始从热度转向筛选。',
  chartLabel: '全年月度融资额 / 亿美元',
  peakTag: '全年峰值',
  avgLabel: '月度均值 80.8',
  // metric cards (order fixed; count is prop-driven)
  metrics: [
    { label: '融资额', value: '318', unit: '亿美元' },
    { label: '事件数', value: '31', unit: '笔' },
    { label: '平均单笔', value: '10.3', unit: '亿美元' },
    { label: '峰值月份', value: '8', unit: '月' },
  ],
  // full-year monthly series; peakIndex marks the highlighted month
  months: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  monthLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  peakIndex: 7,
  avg: 80.8,
  // Q3 months (Jul–Sep) get a highlighted band on the chart
  q3Range: [6, 8],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'area',      // 'area' | 'bars' — information-chart style
  metricCount: 4,         // peak metric cards (2–4)
  focusEnabled: true,     // highlight one metric card
  focusIndex: 0,          // which metric card is the focus (0-based)
  showPeakMarker: true,   // peak month callout on the chart
  showAverage: true,      // yearly average baseline
  showQuarterBand: true,  // shaded Q3 (Jul–Sep) band
  showDecorations: true,  // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Quarter Breakdown' },
  { key: 'marker', label: 'marker', type: 'text', default: 'Q3' },
  { key: 'season', label: 'season', type: 'text', default: '2024 第三季度 · 峰值' },
  { key: 'title', label: '标题', type: 'text', default: '全年峰值季度' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'Q3 融资拆解' },
  { key: 'lead', label: '导言', type: 'text', default: 'Q3 融资额和事件数均达到全年最高，是市场情绪高点，强度来自头部公司融资和多赛道同时活跃。' },
  { key: 'closing', label: '结语', type: 'text', default: '高峰之后，市场开始从热度转向筛选。' },
  { key: 'chartLabel', label: 'chartLabel', type: 'text', default: '全年月度融资额 / 亿美元' },
  { key: 'peakTag', label: 'peakTag', type: 'text', default: '全年峰值' },
  { key: 'avgLabel', label: 'avgLabel', type: 'text', default: '月度均值 80.8' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'area',
    options: [{ value: 'area', label: '面积图' }, { value: 'bars', label: '柱状图' }],
    description: '主视觉信息图表样式：高亮面积图 / 月度柱状图。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '峰值指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showPeakMarker', label: '峰值标记', type: 'toggle', default: true,
    description: '图表上峰值月份的标记与数值气泡的显隐。' },
  { key: 'showAverage', label: '均值线', type: 'toggle', default: true,
    description: '全年月度均值参考线的显隐。' },
  { key: 'showQuarterBand', label: '区间高亮', type: 'toggle', default: true,
    description: '当前季度（Q3 · 7—9 月）高亮背景带的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于季度标记、图表与高亮卡。' },
];

const CSS = `
.aic-peak { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-peak, .aic-peak * { box-sizing: border-box; }
.aic-peak .pk-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-peak .pk-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-peak .pk-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-peak .pk-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-peak .pk-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* hero chart (left) */
.aic-peak .pk-chart { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 1000px;
  display: flex; flex-direction: column; }
.aic-peak .pk-chart-t { display: flex; align-items: center; justify-content: space-between; margin: 0 0 14px; }
.aic-peak .pk-chart-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-peak .pk-leg { display: flex; align-items: center; gap: 20px; }
.aic-peak .pk-leg i { display: inline-flex; align-items: center; gap: 8px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 18px; color: var(--aic-muted); font-style: normal; }
.aic-peak .pk-leg i::before { content: ''; width: 22px; height: 4px; border-radius: 2px; background: var(--aic-accent); }
.aic-peak .pk-leg i.avg::before { background: none; border-top: 2px dashed var(--aic-ink-dim); height: 0; }
.aic-peak .pk-svg { display: block; width: 100%; flex: 1; min-height: 0; }

/* content column (right) */
.aic-peak .pk-side { position: absolute; left: 1156px; right: var(--pad); top: 300px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-peak .pk-marker { display: flex; align-items: baseline; gap: 18px; }
.aic-peak .pk-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 104px; line-height: .8;
  color: var(--aic-accent); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-peak .pk-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--aic-muted); max-width: 180px; line-height: 1.4; }
.aic-peak .pk-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--aic-ink); margin: 26px 0 0; text-wrap: pretty; }
.aic-peak .pk-cards { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.aic-peak .pk-card { position: relative; border-radius: 18px; padding: 22px 26px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); overflow: hidden; transition: background .3s, border-color .3s, transform .3s; }
.aic-peak .pk-card[data-focus="1"] { background: var(--aic-accent); border-color: var(--aic-accent); transform: translateY(-4px); }
.aic-peak .pk-card-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted); }
.aic-peak .pk-card[data-focus="1"] .pk-card-lbl { color: rgba(14,17,11,.62); }
.aic-peak .pk-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 48px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; margin-top: 6px; line-height: 1; }
.aic-peak .pk-card-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-peak .pk-card[data-focus="1"] .pk-card-val u { color: rgba(14,17,11,.62); }

.aic-peak .pk-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-peak .pk-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-peak .pk-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-peak .pk-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','neg','accent','pos','warn','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// chart geometry
const VW = 1000, VH = 520;
const CM = { l: 58, r: 28, t: 64, b: 46 };

export default function PeakPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-peak', CSS);
  const vars = themeVars(p.accentColor);

  const metricN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, metricN);
  const focus = Math.max(0, Math.min(metricN - 1, p.focusIndex));

  const ms = copy.months;
  const n = ms.length;
  const amax = Math.max(...ms) * 1.16;
  const plotW = VW - CM.l - CM.r;
  const plotH = VH - CM.t - CM.b;
  const x = (i) => CM.l + (plotW * i) / (n - 1);
  const y = (v) => CM.t + plotH * (1 - v / amax);
  const bw = plotW / n * 0.56;
  const pts = ms.map((v, i) => [x(i), y(v)]);
  const linePath = pts.map(([px, py], i) => (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)).join(' ');
  const areaPath = `M ${x(0).toFixed(1)} ${(VH - CM.b).toFixed(1)} `
    + pts.map(([px, py]) => `L ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
    + ` L ${x(n - 1).toFixed(1)} ${(VH - CM.b).toFixed(1)} Z`;
  const pk = copy.peakIndex;
  const yTicks = [0, 30, 60, 90, 120].filter((t) => t <= amax);

  return (
    <div className="aic-peak" style={vars}>
      {p.showDecorations && <div className="pk-glow" />}

      <div className="pk-head">
        <div>
          <p className="pk-eyebrow">{copy.eyebrow}</p>
          <h2 className="pk-title">{copy.title}</h2>
        </div>
        <div className="pk-sub">{copy.titleTail}</div>
      </div>

      <div className="pk-chart">
        <div className="pk-chart-t">
          <span>{copy.chartLabel}</span>
          <div className="pk-leg">
            <i>{copy.chartType === 'bars' ? '月度融资额' : '融资额'}</i>
            {p.showAverage && <i className="avg">{copy.avgLabel}</i>}
          </div>
        </div>
        <svg className="pk-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
          {/* Q3 highlight band */}
          {p.showQuarterBand && (
            <rect x={x(copy.q3Range[0]) - bw} y={CM.t - 8}
              width={x(copy.q3Range[1]) - x(copy.q3Range[0]) + bw * 2} height={plotH + 8}
              fill="color-mix(in srgb, var(--aic-accent) 12%, transparent)" rx="10" />
          )}
          {/* gridlines + y labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={CM.l} y1={y(t)} x2={VW - CM.r} y2={y(t)} stroke="var(--aic-hair)" strokeWidth="1.5" />
              <text x={CM.l - 12} y={y(t) + 6} textAnchor="end"
                style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 600, fontSize: 17, fill: 'var(--aic-faint)' }}>{t}</text>
            </g>
          ))}
          {/* average baseline */}
          {p.showAverage && (
            <line x1={CM.l} y1={y(copy.avg)} x2={VW - CM.r} y2={y(copy.avg)}
              stroke="var(--aic-ink-dim)" strokeWidth="2" strokeDasharray="4 8" opacity="0.7" />
          )}

          {p.chartType === 'bars' ? (
            ms.map((v, i) => (
              <rect key={i} x={x(i) - bw / 2} y={y(v)} width={bw} height={(VH - CM.b) - y(v)} rx="6"
                fill={i === pk ? 'var(--aic-accent)' : 'color-mix(in srgb, var(--aic-accent) 34%, white)'} />
            ))
          ) : (
            <g>
              <path d={areaPath} fill="var(--aic-accent)" opacity="0.16" />
              <path d={linePath} fill="none" stroke="var(--aic-accent)" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round" />
              {ms.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={i === pk ? 0 : 4.5}
                  fill="var(--aic-paper)" stroke="var(--aic-accent)" strokeWidth="3" />
              ))}
            </g>
          )}

          {/* peak marker */}
          {p.showPeakMarker && (
            <g>
              <line x1={x(pk)} y1={CM.t - 8} x2={x(pk)} y2={VH - CM.b} stroke="var(--aic-accent)"
                strokeWidth="2.5" strokeDasharray="3 7" opacity="0.8" />
              <circle cx={x(pk)} cy={y(ms[pk])} r="10" fill="var(--aic-accent)" stroke="var(--aic-paper)" strokeWidth="4" />
              <g transform={`translate(${x(pk)}, ${y(ms[pk]) - 52})`}>
                <rect x="-66" y="-2" width="132" height="46" rx="12" fill="var(--aic-ink)" />
                <text x="0" y="20" textAnchor="middle"
                  style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 24, fill: 'var(--aic-paper)' }}>{ms[pk]}
                  <tspan style={{ fontSize: 15, fill: 'var(--aic-faint)' }}> 亿</tspan>
                </text>
                <text x="0" y="37" textAnchor="middle"
                  style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 600, fontSize: 12, letterSpacing: '.12em', fill: 'var(--aic-accent-bright)' }}>{copy.peakTag}</text>
                <path d="M -8 44 L 0 54 L 8 44 Z" fill="var(--aic-ink)" />
              </g>
            </g>
          )}

          {/* month labels */}
          {copy.monthLabels.map((lab, i) => (
            <text key={i} x={x(i)} y={VH - CM.b + 26} textAnchor="middle"
              style={{ fontFamily: 'var(--aic-font-display)', fontWeight: i === pk ? 700 : 600, fontSize: 16,
                fill: i === pk ? 'var(--aic-ink)' : 'var(--aic-faint)' }}>{lab}</text>
          ))}
        </svg>
      </div>

      <div className="pk-side">
        <div className="pk-marker">
          <b>{copy.marker}</b>
          <span className="pk-season">{copy.season}</span>
        </div>
        <p className="pk-lead">{copy.lead}</p>
        <div className="pk-cards">
          {metrics.map((mt, i) => (
            <div className="pk-card" key={mt.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="pk-card-lbl">{mt.label}</div>
              <div className="pk-card-val">{mt.value}<u>{mt.unit}</u></div>
            </div>
          ))}
        </div>
      </div>

      <div className="pk-foot">
        <div className="pk-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="pk-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
