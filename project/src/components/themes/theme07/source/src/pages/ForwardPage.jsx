/**
 * ForwardPage — P82 2025 前瞻 (Forward View · Chart-led)
 *
 * Chart-led forward slide: a "fan" projection chart that takes 2024 as a shared
 * baseline (index = 100) and fans each metric out to its 2025 scenario index,
 * or a diverging bar view around the same baseline. A left rail carries the
 * editorial lead + a dominant projected figure. Chart type, metric count, the
 * focus metric, value labels and the scenario band are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-fwd`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (ChangeBadge, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { ChangeBadge, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Forward View · 2025',
  title: '2025 前瞻',
  titleTail: '关键指标与观察信号',
  lead: '将 2024 的结构外推到 2025：资本可能从规模扩张转向效率验证，少数确定性方向继续获得资本，叙事型估值面临重定价。',
  anchorValue: '+38%',
  anchorLabel: '垂直应用收入兑现 · 2025E 情景增速',
  scenarioTag: '情景推演 · 2024 = 100',
  closing: '增量来自兑现，而非叙事。',
  panelTitle: '2024 → 2025E 指标推演（指数，2024 = 100）',
  baselineLabel: '2024 基线 · 100',
  axisFrom: '2024',
  axisTo: '2025E',
  // metrics (order fixed; count is prop-driven; value is the 2025E index, 2024=100)
  metrics: [
    { label: '垂直应用收入兑现', value: 138, note: '付费留存与席位扩张' },
    { label: '基础设施资本确定性', value: 124, note: 'GPU 云与数据平台' },
    { label: '平均单笔规模', value: 105, note: '头部集中度提升' },
    { label: '全年大额事件数', value: 88, note: '事件数量理性回落' },
    { label: '叙事型估值', value: 82, note: '面临公开市场重定价' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'slope',     // 'slope' | 'bars'
  metricCount: 5,         // metrics shown (3–5)
  focusEnabled: true,     // highlight one metric
  focusIndex: 0,          // which metric is the focus (0-based)
  showValues: true,       // value index + change badge labels
  showBand: true,         // scenario envelope band (slope mode)
  showDecorations: true,  // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Forward View · 2025' },
  { key: 'title', label: '标题', type: 'text', default: '2025 前瞻' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '关键指标与观察信号' },
  { key: 'lead', label: '导言', type: 'text', default: '将 2024 的结构外推到 2025：资本可能从规模扩张转向效率验证，少数确定性方向继续获得资本，叙事型估值面临重定价。' },
  { key: 'anchorValue', label: 'anchorValue', type: 'text', default: '+38%' },
  { key: 'anchorLabel', label: 'anchorLabel', type: 'text', default: '垂直应用收入兑现 · 2025E 情景增速' },
  { key: 'scenarioTag', label: 'scenarioTag', type: 'text', default: '情景推演 · 2024 = 100' },
  { key: 'closing', label: '结语', type: 'text', default: '增量来自兑现，而非叙事。' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '2024 → 2025E 指标推演（指数，2024 = 100）' },
  { key: 'baselineLabel', label: 'baselineLabel', type: 'text', default: '2024 基线 · 100' },
  { key: 'axisFrom', label: 'axisFrom', type: 'text', default: '2024' },
  { key: 'axisTo', label: 'axisTo', type: 'text', default: '2025E' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'slope',
    options: [{ value: 'slope', label: '推演线' }, { value: 'bars', label: '偏离条' }],
    description: '前瞻图表样式：2024→2025E 推演线（扇形）/ 围绕基线的偏离条。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '展示的前瞻指标数量（3–5）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个指标作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }, { value: 4, label: '第 5 个' }],
    description: '选择被高亮的指标。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '指标 2025E 指数与变化徽标的显隐。' },
  { key: 'showBand', label: '情景区间', type: 'toggle', default: true,
    description: '推演线的情景区间扇形带的显隐。', showWhen: (p) => p.chartType === 'slope' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于上行指标、推演线与高亮元素。' },
];

const CSS = `
.aic-fwd { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-fwd, .aic-fwd * { box-sizing: border-box; }
.aic-fwd .fwd-glow { position: absolute; right: -4%; top: -6%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-fwd .fwd-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-fwd .fwd-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-fwd .fwd-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-fwd .fwd-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* body: editorial rail (left) + chart panel (right) */
.aic-fwd .fwd-body { position: absolute; left: var(--pad); right: var(--pad); top: 300px; bottom: 150px;
  display: grid; grid-template-columns: 540px 1fr; gap: 72px; }
.aic-fwd .fwd-rail { display: flex; flex-direction: column; }
.aic-fwd .fwd-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 0; text-wrap: pretty; }
.aic-fwd .fwd-anchor { margin-top: auto; }
.aic-fwd .fwd-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 132px; line-height: .82;
  color: var(--aic-accent-deep); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom;
  display: inline-block; }
.aic-fwd .fwd-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 23px; color: var(--aic-ink-dim); margin-top: 18px; }
.aic-fwd .fwd-tag { display: inline-flex; align-items: center; gap: 12px; align-self: flex-start; margin-top: 26px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--aic-muted); padding: 10px 20px; border: 1.5px solid var(--aic-hair-strong); border-radius: 999px; }
.aic-fwd .fwd-tag::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--aic-accent); }

.aic-fwd .fwd-chart { display: flex; flex-direction: column; min-width: 0; }
.aic-fwd .fwd-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 14px; }
.aic-fwd .fwd-plot { flex: 1; min-height: 0; }
.aic-fwd .fwd-svg { width: 100%; height: 100%; display: block; }
.aic-fwd .fwd-svg .lbl { font-family: var(--aic-font-display); font-weight: 600; }
.aic-fwd .fwd-svg .metric { font-family: var(--aic-font-text); font-weight: 700; }
.aic-fwd .fwd-svg .note { font-family: var(--aic-font-text); font-weight: 500; }
.aic-fwd .fwd-svg .val { font-family: var(--aic-font-display); font-weight: 700; font-variant-numeric: tabular-nums; }

/* diverging bars mode */
.aic-fwd .fwd-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 26px; min-height: 0; }
.aic-fwd .fwd-bar { display: grid; grid-template-columns: 300px 1fr; align-items: center; gap: 28px; transition: opacity .3s; }
.aic-fwd .fwd-bar-lbl { display: flex; flex-direction: column; gap: 4px; }
.aic-fwd .fwd-bar-lbl b { font-family: var(--aic-font-text); font-weight: 700; font-size: 27px; color: var(--aic-ink); }
.aic-fwd .fwd-bar-lbl span { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted); }
.aic-fwd .fwd-bar-track { position: relative; height: 46px; border-radius: 12px; background: var(--aic-hair);
  overflow: hidden; }
.aic-fwd .fwd-bar-base { position: absolute; top: -6px; bottom: -6px; width: 2px; background: var(--aic-ink-dim); opacity: .55; }
.aic-fwd .fwd-bar-fill { position: absolute; top: 0; bottom: 0; border-radius: 8px;
  transition: width .5s cubic-bezier(.3,.7,.4,1), left .5s cubic-bezier(.3,.7,.4,1); }
.aic-fwd .fwd-bar-fill.up   { background: var(--aic-accent); }
.aic-fwd .fwd-bar-fill.down { background: color-mix(in srgb, var(--aic-neg) 78%, white); }
.aic-fwd .fwd-bar[data-focus="1"] .fwd-bar-fill.up { background: var(--aic-accent-deep); }
.aic-fwd .fwd-bar-end { position: absolute; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 12px; }
.aic-fwd .fwd-bar-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-fwd .fwd-baserow { display: grid; grid-template-columns: 300px 1fr; gap: 28px; margin-top: 4px; }
.aic-fwd .fwd-baserow span { grid-column: 2; font-family: var(--aic-font-display); font-weight: 600; font-size: 17px;
  letter-spacing: .08em; text-transform: uppercase; color: var(--aic-muted); }

.aic-fwd .fwd-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-fwd .fwd-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-fwd .fwd-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-fwd .fwd-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos',
  'accent','pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos',
  'pos','accent','warn','pos','accent','pos','pos','warn','accent','pos'].map((tone) => ({ tone }));

// SVG slope/fan projection chart
function SlopeChart({ copy, metrics, focus, focusEnabled, showValues, showBand }) {
  const W = 1040, H = 540;
  const xFrom = 150, xTo = 690;          // baseline node → 2025E nodes
  const top = 48, bottom = 452;
  const MIN = 78, MAX = 146;
  const yFor = (v) => bottom - (v - MIN) / (MAX - MIN) * (bottom - top);
  const y100 = yFor(100);
  const vals = metrics.map((m) => m.value);
  const envHi = yFor(Math.min(MAX, Math.max(...vals) + 5));
  const envLo = yFor(Math.max(MIN, Math.min(...vals) - 5));

  return (
    <svg className="fwd-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {/* scenario envelope band */}
      {showBand && (
        <polygon points={`${xFrom},${y100} ${xTo},${envHi} ${xTo},${envLo}`}
          fill="color-mix(in srgb, var(--aic-accent) 10%, transparent)" stroke="none" />
      )}
      {/* baseline 100 */}
      <line x1={xFrom} y1={y100} x2={xTo} y2={y100} stroke="var(--aic-ink-dim)" strokeWidth="1.6"
        strokeDasharray="4 8" opacity="0.55" />
      <text className="lbl" x={xFrom} y={y100 - 14} fill="var(--aic-muted)" fontSize="18">{copy.baselineLabel}</text>
      {/* axis ticks */}
      <line x1={xFrom} y1={top - 8} x2={xFrom} y2={bottom + 8} stroke="var(--aic-hair)" strokeWidth="1.5" />
      <text className="lbl" x={xFrom} y={bottom + 34} textAnchor="middle" fill="var(--aic-ink-dim)" fontSize="20">{copy.axisFrom}</text>
      <text className="lbl" x={xTo} y={bottom + 34} textAnchor="middle" fill="var(--aic-ink-dim)" fontSize="20">{copy.axisTo}</text>
      {/* baseline node */}
      <circle cx={xFrom} cy={y100} r="7" fill="var(--aic-ink)" />
      {/* slopes */}
      {metrics.map((m, i) => {
        const up = m.value >= 100;
        const dim = focusEnabled && i !== focus;
        const isF = focusEnabled && i === focus;
        const y = yFor(m.value);
        const col = up ? (isF ? 'var(--aic-accent-deep)' : 'var(--aic-accent)')
                       : 'color-mix(in srgb, var(--aic-neg) 75%, white)';
        return (
          <g key={m.label} opacity={dim ? 0.32 : 1} style={{ transition: 'opacity .3s' }}>
            <line x1={xFrom} y1={y100} x2={xTo} y2={y} stroke={col} strokeWidth={isF ? 6 : 3}
              strokeLinecap="round" />
            <circle cx={xTo} cy={y} r={isF ? 9 : 6.5} fill={col} />
            <text className="metric" x={xTo + 22} y={y - 4} fill="var(--aic-ink)"
              fontSize={isF ? 26 : 23}>{m.label}</text>
            <text className="note" x={xTo + 22} y={y + 24} fill="var(--aic-muted)" fontSize="18">{m.note}</text>
            {showValues && (
              <text className="val" x={xTo - 14} y={up ? y - 14 : y + 28} textAnchor="end"
                fill={up ? 'var(--aic-ink)' : 'var(--aic-neg)'} fontSize={isF ? 27 : 23}>{m.value}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function ForwardPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, anchorValue: p.anchorValue !== undefined ? p.anchorValue : COPY.anchorValue, anchorLabel: p.anchorLabel !== undefined ? p.anchorLabel : COPY.anchorLabel, scenarioTag: p.scenarioTag !== undefined ? p.scenarioTag : COPY.scenarioTag, closing: p.closing !== undefined ? p.closing : COPY.closing, panelTitle: p.panelTitle !== undefined ? p.panelTitle : COPY.panelTitle, baselineLabel: p.baselineLabel !== undefined ? p.baselineLabel : COPY.baselineLabel, axisFrom: p.axisFrom !== undefined ? p.axisFrom : COPY.axisFrom, axisTo: p.axisTo !== undefined ? p.axisTo : COPY.axisTo, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-fwd', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.metrics.length, p.metricCount));
  const metrics = copy.metrics.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  // diverging bars domain
  const BMIN = 60, BMAX = 150, BR = BMAX - BMIN;
  const posOf = (v) => (Math.max(BMIN, Math.min(BMAX, v)) - BMIN) / BR * 100;
  const base = posOf(100);

  return (
    <div className="aic-fwd" style={vars}>
      {p.showDecorations && <div className="fwd-glow" />}

      <div className="fwd-head">
        <div>
          <p className="fwd-eyebrow">{copy.eyebrow}</p>
          <h2 className="fwd-title">{copy.title}</h2>
        </div>
        <div className="fwd-sub">{copy.titleTail}</div>
      </div>

      <div className="fwd-body">
        <div className="fwd-rail">
          <p className="fwd-lead">{copy.lead}</p>
          <div className="fwd-anchor">
            <div className="fwd-anchor-v">{copy.anchorValue}</div>
            <div className="fwd-anchor-l">{copy.anchorLabel}</div>
          </div>
          <span className="fwd-tag">{copy.scenarioTag}</span>
        </div>

        <div className="fwd-chart">
          <p className="fwd-panel-t">{copy.panelTitle}</p>
          {p.chartType === 'slope' ? (
            <div className="fwd-plot">
              <SlopeChart copy={copy} metrics={metrics} focus={focus} focusEnabled={p.focusEnabled}
                showValues={p.showValues} showBand={p.showBand} />
            </div>
          ) : (
            <>
              <div className="fwd-bars">
                {metrics.map((m, i) => {
                  const up = m.value >= 100;
                  const v = posOf(m.value);
                  const left = up ? base : v;
                  const width = Math.abs(v - base);
                  const isF = p.focusEnabled && i === focus;
                  return (
                    <div className="fwd-bar" key={m.label} data-focus={isF ? '1' : '0'}
                      style={{ opacity: p.focusEnabled && i !== focus ? 0.5 : 1 }}>
                      <div className="fwd-bar-lbl"><b>{m.label}</b><span>{m.note}</span></div>
                      <div className="fwd-bar-track">
                        <div className="fwd-bar-base" style={{ left: base + '%' }} />
                        <div className={'fwd-bar-fill ' + (up ? 'up' : 'down')}
                          style={{ left: left + '%', width: width + '%' }} />
                        {p.showValues && (
                          <div className="fwd-bar-end" style={up ? { left: v + '%', marginLeft: 14 }
                            : { right: (100 - v) + '%', marginRight: 14, flexDirection: 'row-reverse' }}>
                            <span className="fwd-bar-v">{m.value}</span>
                            <ChangeBadge value={(up ? '+' : '') + (m.value - 100) + '%'} dir={up ? 'up' : 'down'} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="fwd-baserow"><span>{copy.baselineLabel}</span></div>
            </>
          )}
        </div>
      </div>

      <div className="fwd-foot">
        <div className="fwd-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="fwd-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
