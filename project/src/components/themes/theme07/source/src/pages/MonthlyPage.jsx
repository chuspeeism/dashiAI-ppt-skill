/**
 * MonthlyPage — P09 市场月度热力 (Monthly Funding Heatmap)
 *
 * Chart-led slide: a 12-month funding heat visualization is the hero, with a
 * left rail carrying the lead, a peak anchor number and the takeaway.
 *
 * Self-contained & prop-driven. Scoped under `.aic-month`.
 * Shared deps: ./theme.js, ./viz.jsx (BigNumber, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Monthly Heatmap',
  title: '市场月度热力',
  sub: '12 个月融资节奏',
  lead: '月度数据展示全年热度并非均匀释放，而是由 5 月、8 月、9 月等峰值月份拉高。',
  anchorLead: '118',
  anchorUnit: '亿美元',
  anchorNote: '全年峰值 · 8 月单月最高，9 月、5 月紧随其后',
  closing: '融资节奏的核心不是平均值，而是峰值背后的超级交易。',
  axisLabel: '月度融资额 / 亿美元',
  // amount 亿美元 per month; peak flags drive the highlight rings
  months: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  peaks: [4, 7, 8], // 5月 / 8月 / 9月
  avg: 80.8,
};

export const defaultProps = {
  ...COPY,
  chartType: 'bars',     // 'bars' | 'grid'
  focusEnabled: true,
  focusIndex: 7,         // 8月
  showSecondary: true,   // average reference line
  showDecorations: true, // peak rings, glow, heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Monthly Heatmap' },
  { key: 'title', label: '标题', type: 'text', default: '市场月度热力' },
  { key: 'sub', label: '次标题', type: 'text', default: '12 个月融资节奏' },
  { key: 'lead', label: '导言', type: 'text', default: '月度数据展示全年热度并非均匀释放，而是由 5 月、8 月、9 月等峰值月份拉高。' },
  { key: 'anchorLead', label: '锚点数字', type: 'text', default: '118' },
  { key: 'anchorUnit', label: '锚点单位', type: 'text', default: '亿美元' },
  { key: 'anchorNote', label: '锚点注释', type: 'text', default: '全年峰值 · 8 月单月最高，9 月、5 月紧随其后' },
  { key: 'closing', label: '结语', type: 'text', default: '融资节奏的核心不是平均值，而是峰值背后的超级交易。' },
  { key: 'axisLabel', label: '坐标标签', type: 'text', default: '月度融资额 / 亿美元' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bars',
    options: [{ value: 'bars', label: '热力柱' }, { value: 'grid', label: '热力格' }],
    description: '月度热度的呈现方式：竖向热力柱 / 方格热力图。' },
  { key: 'showSecondary', label: '辅助序列', type: 'toggle', default: true,
    description: '叠加月度均值参考线。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个月作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 7,
    options: Array.from({ length: 12 }, (_, i) => ({ value: i, label: (i + 1) + ' 月' })),
    description: '选择被高亮的月份。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '峰值标记、背景光晕与底部条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于热度配色与高亮。' },
];

const CSS = `
.aic-month { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-month, .aic-month * { box-sizing: border-box; }
.aic-month .mo-glow { position: absolute; right: -4%; top: -8%; width: 54%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-month .mo-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-month .mo-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-month .mo-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-month .mo-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-month .mo-rail { position: absolute; left: var(--pad); top: 300px; width: 520px; display: flex; flex-direction: column; }
.aic-month .mo-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5; color: var(--aic-ink); margin: 0; }
.aic-month .mo-anchor { margin-top: 56px; }
.aic-month .mo-anchor-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 22px;
  color: var(--aic-muted); margin: 16px 0 0; max-width: 470px; line-height: 1.45; }
.aic-month .mo-closing { display: flex; align-items: center; gap: 16px; margin-top: 60px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-month .mo-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-month .mo-chart { position: absolute; right: var(--pad); top: 300px; width: 1108px; }
.aic-month .mo-chart-t { display: flex; align-items: center; justify-content: space-between; margin: 0 0 20px; }
.aic-month .mo-chart-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); }
.aic-month .mo-leg { display: flex; gap: 22px; }
.aic-month .mo-leg .it { display: flex; align-items: center; gap: 9px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 19px; color: var(--aic-ink-dim); text-transform: none; letter-spacing: 0; }
.aic-month .mo-leg .it i { width: 16px; height: 16px; border-radius: 4px; flex: none; }
.aic-month .mo-leg .it i.dash { height: 0; width: 22px; border-top: 2.5px dashed var(--aic-ink-dim); border-radius: 0; }
.aic-month .mo-svg { display: block; width: 100%; height: auto; }

.aic-month .mo-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 10px; }
.aic-month .mo-cell { position: relative; border-radius: 14px; aspect-ratio: 0.72; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px; border: 2px solid transparent; transition: transform .3s, border-color .3s; }
.aic-month .mo-cell[data-peak="1"] { border-color: var(--aic-ink); }
.aic-month .mo-cell[data-focus="1"] { transform: translateY(-8px); border-color: var(--aic-ink); }
.aic-month .mo-cell .v { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px;
  font-variant-numeric: tabular-nums; }
.aic-month .mo-cell .m { font-family: var(--aic-font-text); font-weight: 600; font-size: 18px; }
.aic-month .mo-cells-x { display: none; }
`;

const HEAT = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

// chart geometry
const VW = 1108, VH = 470;
const M = { l: 56, r: 24, t: 44, b: 52 };
const VMAX = 132;

export default function MonthlyPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, sub: p.sub !== undefined ? p.sub : COPY.sub, lead: p.lead !== undefined ? p.lead : COPY.lead, anchorLead: p.anchorLead !== undefined ? p.anchorLead : COPY.anchorLead, anchorUnit: p.anchorUnit !== undefined ? p.anchorUnit : COPY.anchorUnit, anchorNote: p.anchorNote !== undefined ? p.anchorNote : COPY.anchorNote, closing: p.closing !== undefined ? p.closing : COPY.closing, axisLabel: p.axisLabel !== undefined ? p.axisLabel : COPY.axisLabel, months: p.months !== undefined ? p.months : COPY.months, peaks: p.peaks !== undefined ? p.peaks : COPY.peaks };
  ensureFonts();
  injectScopedStyle('aic-month', CSS);
  const vars = themeVars(p.accentColor);

  const data = copy.months;
  const n = data.length;
  const vmin = Math.min(...data), vmax = Math.max(...data);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const peakSet = new Set(copy.peaks);
  const intensity = (v) => 30 + ((v - vmin) / (vmax - vmin || 1)) * 64; // 30..94 %
  const fillFor = (v, isHot) => isHot
    ? 'var(--aic-accent)'
    : `color-mix(in srgb, var(--aic-accent) ${intensity(v)}%, var(--aic-accent-soft))`;

  const plotW = VW - M.l - M.r, plotH = VH - M.t - M.b;
  const x = (i) => M.l + (plotW * (i + 0.5)) / n;
  const yA = (v) => M.t + plotH * (1 - v / VMAX);
  const bw = (plotW / n) * 0.62;

  return (
    <div className="aic-month" style={vars}>
      {p.showDecorations && <div className="mo-glow" />}

      <div className="mo-head">
        <div>
          <p className="mo-eyebrow">{copy.eyebrow}</p>
          <h2 className="mo-title">{copy.title}</h2>
        </div>
        <div className="mo-sub">{copy.sub}</div>
      </div>

      <div className="mo-rail">
        <p className="mo-lead">{copy.lead}</p>
        <div className="mo-anchor">
          <BigNumber lead={copy.anchorLead} unit={copy.anchorUnit} size={132} />
          <p className="mo-anchor-note">{copy.anchorNote}</p>
        </div>
        <div className="mo-closing"><b />{copy.closing}</div>
      </div>

      <div className="mo-chart">
        <div className="mo-chart-t">
          <span>{copy.axisLabel}</span>
          <div className="mo-leg">
            <div className="it"><i style={{ background: 'var(--aic-accent)' }} />峰值月</div>
            {p.showSecondary && <div className="it"><i className="dash" />月度均值 {copy.avg}</div>}
          </div>
        </div>

        {p.chartType === 'grid' ? (
          <div className="mo-grid">
            {data.map((v, i) => {
              const isHot = peakSet.has(i);
              const isF = p.focusEnabled && i === focus;
              return (
                <div className="mo-cell" key={i} data-peak={isHot ? '1' : '0'} data-focus={isF ? '1' : '0'}
                  style={{ background: fillFor(v, isHot) }}>
                  <span className="v" style={{ color: isHot ? 'var(--aic-ink)' : 'var(--aic-ink)' }}>{v}</span>
                  <span className="m">{i + 1} 月</span>
                </div>
              );
            })}
          </div>
        ) : (
          <svg className="mo-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">
            <line x1={M.l} y1={VH - M.b} x2={VW - M.r} y2={VH - M.b} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />
            {p.showSecondary && (
              <g>
                <line x1={M.l} y1={yA(copy.avg)} x2={VW - M.r} y2={yA(copy.avg)}
                  stroke="var(--aic-ink-dim)" strokeWidth="2" strokeDasharray="4 8" opacity="0.6" />
                <text x={VW - M.r} y={yA(copy.avg) - 10} textAnchor="end"
                  style={{ fontFamily: 'var(--aic-font-display)', fontSize: 17, fontWeight: 600, fill: 'var(--aic-muted)' }}>均值 {copy.avg}</text>
              </g>
            )}
            {data.map((v, i) => {
              const isHot = peakSet.has(i);
              const isF = p.focusEnabled && i === focus;
              const top = yA(v);
              return (
                <g key={i}>
                  <rect x={x(i) - bw / 2} y={top} width={bw} height={(VH - M.b) - top} rx="7"
                    fill={fillFor(v, isHot)}
                    stroke={(p.showDecorations && isHot) || isF ? 'var(--aic-ink)' : 'none'}
                    strokeWidth={isF ? 3 : 2} />
                  <text x={x(i)} y={top - 14} textAnchor="middle"
                    style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700,
                      fontSize: isHot || isF ? 27 : 21, fill: 'var(--aic-ink)' }}>{v}</text>
                  <text x={x(i)} y={VH - M.b + 32} textAnchor="middle"
                    style={{ fontFamily: 'var(--aic-font-text)', fontWeight: 600, fontSize: 20,
                      fill: isHot || isF ? 'var(--aic-ink)' : 'var(--aic-muted)' }}>{i + 1} 月</text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {p.showDecorations && (
        <div style={{ position: 'absolute', left: 'var(--pad)', bottom: 70, width: 360, height: 30 }}>
          <HeatStrip data={HEAT} gap={4} />
        </div>
      )}
    </div>
  );
}
