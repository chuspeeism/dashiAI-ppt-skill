/**
 * TrendPage — P05 市场全景 · 纵向趋势 (Market Panorama · Quarterly Trend)
 *
 * A chart-led slide: the quarterly funding-amount trend is the hero visual,
 * with a short lead, an anchor number and a one-line takeaway alongside it.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-trend`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY; only the
 * exported `defaultProps` / `controls` drive structural + style variation.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Market Panorama',
  title: '市场全景',
  titleTail: '纵向趋势',
  sub: '逐季度融资额走势',
  lead: '2024 年融资热度在 Q2 与 Q3 达峰，Q4 理性回落但仍保持高位。',
  anchorLead: '970',
  anchorUnit: '亿美元',
  anchorNote: '全年合计 · Q3 单季 318 亿美元为最高点',
  closing: '高峰过后不是崩塌，而是市场开始筛选。',
  axisLabel: '季度融资额 / 亿美元',
  // primary series = 融资额 (亿美元), secondary = 事件数 (笔)
  quarters: [
    { q: 'Q1', amount: 162, deals: 18 },
    { q: 'Q2', amount: 284, deals: 26 },
    { q: 'Q3', amount: 318, deals: 31 },
    { q: 'Q4', amount: 206, deals: 22 },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'area',     // 'area' | 'line' | 'bar'
  focusEnabled: true,    // highlight one data point
  focusIndex: 2,         // which quarter is the focus (0-based)
  showSecondary: true,   // overlay the secondary series (事件数)
  showDecorations: true, // gridlines, axis, glow, heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Market Panorama' },
  { key: 'title', label: '标题', type: 'text', default: '市场全景' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '纵向趋势' },
  { key: 'sub', label: '次标题', type: 'text', default: '逐季度融资额走势' },
  { key: 'lead', label: '导言', type: 'text', default: '2024 年融资热度在 Q2 与 Q3 达峰，Q4 理性回落但仍保持高位。' },
  { key: 'anchorLead', label: '锚点数字', type: 'text', default: '970' },
  { key: 'anchorUnit', label: '锚点单位', type: 'text', default: '亿美元' },
  { key: 'anchorNote', label: '锚点注释', type: 'text', default: '全年合计 · Q3 单季 318 亿美元为最高点' },
  { key: 'closing', label: '结语', type: 'text', default: '高峰过后不是崩塌，而是市场开始筛选。' },
  { key: 'axisLabel', label: '坐标标签', type: 'text', default: '季度融资额 / 亿美元' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'area',
    options: [
      { value: 'area', label: '面积' },
      { value: 'line', label: '折线' },
      { value: 'bar', label: '柱状' },
    ],
    description: '主趋势序列的呈现方式：面积图 / 折线图 / 柱状图。' },
  { key: 'showSecondary', label: '辅助序列', type: 'toggle', default: true,
    description: '叠加第二条数据序列（此处为事件笔数）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一数据点作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 2,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的数据点。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '网格线、坐标轴标签与背景光晕等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于趋势线、面积与高亮点。' },
];

const CSS = `
.aic-trend { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-trend, .aic-trend * { box-sizing: border-box; }
.aic-trend .tr-glow { position: absolute; right: -4%; top: -8%; width: 56%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-trend .tr-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-trend .tr-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-trend .tr-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-trend .tr-title em { font-style: normal; font-family: var(--aic-font-text); font-weight: 500; font-size: 34px;
  color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-trend .tr-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-trend .tr-rail { position: absolute; left: var(--pad); top: 300px; width: 520px;
  display: flex; flex-direction: column; }
.aic-trend .tr-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5;
  color: var(--aic-ink); margin: 0; }
.aic-trend .tr-anchor { margin-top: 56px; }
.aic-trend .tr-anchor-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 22px;
  color: var(--aic-muted); margin: 16px 0 0; max-width: 460px; line-height: 1.45; }
.aic-trend .tr-closing { display: flex; align-items: center; gap: 16px; margin-top: 60px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-trend .tr-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-trend .tr-chart { position: absolute; right: var(--pad); top: 286px; width: 1108px; }
.aic-trend .tr-chart-t { display: flex; align-items: center; justify-content: space-between; margin: 0 0 18px; }
.aic-trend .tr-chart-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); }
.aic-trend .tr-legend { display: flex; gap: 24px; }
.aic-trend .tr-leg { display: flex; align-items: center; gap: 10px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 20px; color: var(--aic-ink-dim); text-transform: none; letter-spacing: 0; }
.aic-trend .tr-leg i { width: 22px; height: 5px; border-radius: 999px; flex: none; }
.aic-trend .tr-leg i.dash { background: repeating-linear-gradient(90deg, var(--aic-ink) 0 6px, transparent 6px 11px); height: 3px; }
.aic-trend .tr-svg { display: block; width: 100%; height: auto; }
.aic-trend .tr-cells { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 26px; }
.aic-trend .tr-cell { border-radius: 18px; padding: 22px 24px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); transition: background .3s, border-color .3s, transform .3s; }
.aic-trend .tr-cell[data-focus="1"] { background: var(--aic-accent); border-color: var(--aic-accent); transform: translateY(-6px); }
.aic-trend .tr-cell-q { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px;
  letter-spacing: .08em; color: var(--aic-muted); transform: skewX(-9deg); transform-origin: left bottom; }
.aic-trend .tr-cell[data-focus="1"] .tr-cell-q { color: rgba(14,17,11,.6); }
.aic-trend .tr-cell-amt { font-family: var(--aic-font-display); font-weight: 700; font-size: 38px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; margin-top: 8px; }
.aic-trend .tr-cell-amt u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }
.aic-trend .tr-cell[data-focus="1"] .tr-cell-amt u { color: rgba(14,17,11,.6); }
.aic-trend .tr-cell-deals { font-family: var(--aic-font-text); font-weight: 600; font-size: 18px;
  color: var(--aic-muted); margin-top: 6px; }
.aic-trend .tr-cell[data-focus="1"] .tr-cell-deals { color: rgba(14,17,11,.7); }
`;

// chart geometry (SVG user units)
const VW = 1108, VH = 470;
const M = { l: 64, r: 28, t: 30, b: 56 };
const AMAX = 360; // y-axis headroom (亿美元)
const DMAX = 36;  // secondary scale (笔)

const HEAT = ['pos','accent','pos','warn','pos','accent','neg','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

export default function TrendPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-trend', CSS);
  const vars = themeVars(p.accentColor);

  const qs = copy.quarters;
  const n = qs.length;
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const plotW = VW - M.l - M.r;
  const plotH = VH - M.t - M.b;
  const x = (i) => M.l + (plotW * (i + 0.5)) / n;
  const yA = (v) => M.t + plotH * (1 - v / AMAX);
  const yD = (v) => M.t + plotH * (1 - (v / DMAX) * 0.78); // keep secondary in lower band

  const linePts = qs.map((d, i) => [x(i), yA(d.amount)]);
  const linePath = linePts.map(([px, py], i) => (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)).join(' ');
  const areaPath = `M ${x(0).toFixed(1)} ${(VH - M.b).toFixed(1)} `
    + linePts.map(([px, py]) => `L ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
    + ` L ${x(n - 1).toFixed(1)} ${(VH - M.b).toFixed(1)} Z`;
  const dealsPath = qs.map((d, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + yD(d.deals).toFixed(1)).join(' ');
  const gridVals = [90, 180, 270, 360];

  return (
    <div className="aic-trend" style={vars}>
      {p.showDecorations && <div className="tr-glow" />}

      <div className="tr-head">
        <div>
          <p className="tr-eyebrow">{copy.eyebrow}</p>
          <h2 className="tr-title">{copy.title}<em>· {copy.titleTail}</em></h2>
        </div>
        <div className="tr-sub">{copy.sub}</div>
      </div>

      <div className="tr-rail">
        <p className="tr-lead">{copy.lead}</p>
        <div className="tr-anchor">
          <BigNumber lead={copy.anchorLead} unit={copy.anchorUnit} size={132} />
          <p className="tr-anchor-note">{copy.anchorNote}</p>
        </div>
        <div className="tr-closing"><b />{copy.closing}</div>
      </div>

      <div className="tr-chart">
        <div className="tr-chart-t">
          <span>{copy.axisLabel}</span>
          <div className="tr-legend">
            <div className="tr-leg"><i style={{ background: 'var(--aic-accent)' }} />融资额</div>
            {p.showSecondary && <div className="tr-leg"><i className="dash" />事件数</div>}
          </div>
        </div>

        <svg className="tr-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">
          {/* gridlines + y labels */}
          {p.showDecorations && gridVals.map((v) => (
            <g key={v}>
              <line x1={M.l} y1={yA(v)} x2={VW - M.r} y2={yA(v)}
                stroke="var(--aic-hair)" strokeWidth="1.5" />
              <text x={M.l - 14} y={yA(v) + 6} textAnchor="end"
                style={{ fontFamily: 'var(--aic-font-display)', fontSize: 18, fontWeight: 600, fill: 'var(--aic-faint)' }}>{v}</text>
            </g>
          ))}
          {/* baseline */}
          <line x1={M.l} y1={VH - M.b} x2={VW - M.r} y2={VH - M.b} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />

          {/* focus vertical band */}
          {p.focusEnabled && (
            <line x1={x(focus)} y1={M.t - 6} x2={x(focus)} y2={VH - M.b}
              stroke="var(--aic-accent)" strokeWidth="2" strokeDasharray="3 7" opacity="0.55" />
          )}

          {/* primary series */}
          {p.chartType === 'bar' ? (
            qs.map((d, i) => {
              const bw = (plotW / n) * 0.42;
              const isF = p.focusEnabled && i === focus;
              return (
                <rect key={i} x={x(i) - bw / 2} y={yA(d.amount)} width={bw} height={(VH - M.b) - yA(d.amount)}
                  rx="6" fill={isF ? 'var(--aic-accent)' : 'var(--aic-ink)'}
                  opacity={p.focusEnabled && !isF ? 0.32 : 1} />
              );
            })
          ) : (
            <>
              {p.chartType === 'area' && (
                <path d={areaPath} fill="var(--aic-accent)" opacity="0.18" />
              )}
              <path d={linePath} fill="none" stroke="var(--aic-accent)" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {/* secondary series (事件数) */}
          {p.showSecondary && (
            <>
              <path d={dealsPath} fill="none" stroke="var(--aic-ink)" strokeWidth="2.5"
                strokeDasharray="3 7" strokeLinecap="round" opacity="0.62" />
              {qs.map((d, i) => (
                <circle key={i} cx={x(i)} cy={yD(d.deals)} r="4" fill="var(--aic-ink)" opacity="0.62" />
              ))}
            </>
          )}

          {/* primary dots + value labels (non-bar) */}
          {p.chartType !== 'bar' && qs.map((d, i) => {
            const isF = p.focusEnabled && i === focus;
            return (
              <g key={i}>
                <circle cx={x(i)} cy={yA(d.amount)} r={isF ? 11 : 7}
                  fill="var(--aic-paper)" stroke="var(--aic-accent)" strokeWidth={isF ? 5 : 4} />
                <text x={x(i)} y={yA(d.amount) - (isF ? 26 : 20)} textAnchor="middle"
                  style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700,
                    fontSize: isF ? 30 : 22, fill: 'var(--aic-ink)' }}>{d.amount}</text>
              </g>
            );
          })}

          {/* x labels */}
          {qs.map((d, i) => (
            <text key={i} x={x(i)} y={VH - M.b + 34} textAnchor="middle"
              style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 22,
                fill: p.focusEnabled && i === focus ? 'var(--aic-ink)' : 'var(--aic-muted)' }}>{d.q}</text>
          ))}
        </svg>

        <div className="tr-cells">
          {qs.map((d, i) => (
            <div className="tr-cell" key={d.q} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="tr-cell-q">{d.q}</div>
              <div className="tr-cell-amt">{d.amount}<u>亿美元</u></div>
              <div className="tr-cell-deals">{d.deals} 笔事件</div>
            </div>
          ))}
        </div>
      </div>

      {p.showDecorations && (
        <div style={{ position: 'absolute', left: 'var(--pad)', bottom: 70, width: 360, height: 30 }}>
          <HeatStrip data={HEAT} gap={4} />
        </div>
      )}
    </div>
  );
}
