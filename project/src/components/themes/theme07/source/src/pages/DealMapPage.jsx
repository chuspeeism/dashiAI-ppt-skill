/**
 * DealMapPage — P16 融资事件规模分层 (Deal Map · Bubble Chart)
 *
 * Chart-led slide: 97 funding events grouped into amount-range bands and drawn
 * as a bubble map. Point size encodes deal amount; color encodes track. View
 * mode (scatter / cluster), band count, bubble scale, the focus band and the
 * legend are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-deal`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Deal Map',
  title: '融资事件规模分层',
  sub: '大额融资事件地图',
  lead: '97 笔大额融资可以按金额区间拆成四组，少数超级交易贡献主要融资额。',
  anchorLead: '97',
  anchorUnit: '笔',
  anchorNote: '全年大额事件 · 单笔 ≥1 亿美元',
  closing: '数量最多的不一定最重要，影响最大的往往是巨额交易。',
  legendLabel: '气泡大小 = 单笔金额 · 颜色 = 赛道',
  // amount-range bands: count = number of deals, mid = representative amount,
  // total = aggregate funding (亿美元).
  bands: [
    { range: '1–2 亿', count: 41, mid: 1.5, total: 58 },
    { range: '2–5 亿', count: 29, mid: 3.5, total: 91 },
    { range: '5–10 亿', count: 15, mid: 7.5, total: 103 },
    { range: '≥10 亿', count: 12, mid: 18, total: 718 },
  ],
  tracks: [
    { name: '通用大模型', tone: 'accent' },
    { name: '垂直应用', tone: 'ink' },
    { name: '基础设施', tone: 'pos' },
    { name: 'AI 芯片', tone: 'warn' },
  ],
};

const TONE = { accent: 'var(--aic-accent)', ink: 'var(--aic-ink)', pos: 'var(--aic-pos)', warn: 'var(--aic-warn)' };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  viewMode: 'scatter',   // 'scatter' (individual deals) | 'cluster' (one bubble per band)
  bandCount: 4,          // amount-range bands shown (2–4)
  bubbleScale: 1,        // global bubble-size multiplier (0.6–1.4)
  focusEnabled: true,    // highlight one band
  focusIndex: 3,         // which band is the focus (0-based) — default ≥10亿
  showLegend: true,      // track color legend
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Deal Map' },
  { key: 'title', label: '标题', type: 'text', default: '融资事件规模分层' },
  { key: 'sub', label: '次标题', type: 'text', default: '大额融资事件地图' },
  { key: 'lead', label: '导言', type: 'text', default: '97 笔大额融资可以按金额区间拆成四组，少数超级交易贡献主要融资额。' },
  { key: 'anchorLead', label: '锚点数字', type: 'text', default: '97' },
  { key: 'anchorUnit', label: '锚点单位', type: 'text', default: '笔' },
  { key: 'anchorNote', label: '锚点注释', type: 'text', default: '全年大额事件 · 单笔 ≥1 亿美元' },
  { key: 'closing', label: '结语', type: 'text', default: '数量最多的不一定最重要，影响最大的往往是巨额交易。' },
  { key: 'legendLabel', label: 'legendLabel', type: 'text', default: '气泡大小 = 单笔金额 · 颜色 = 赛道' },
  { key: 'viewMode', label: '图表类型', type: 'radio', default: 'scatter',
    options: [{ value: 'scatter', label: '散点' }, { value: 'cluster', label: '聚合气泡' }],
    description: '散点：逐笔交易点阵；聚合气泡：每个区间汇总为一个气泡。' },
  { key: 'bandCount', label: '分组数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '金额区间分组数量（2–4）。' },
  { key: 'bubbleScale', label: '气泡大小', type: 'slider', default: 1, min: 0.6, max: 1.4, step: 0.1,
    description: '气泡整体大小比例。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一金额区间作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 3,
    options: [{ value: 0, label: '第 1 组' }, { value: 1, label: '第 2 组' },
      { value: 2, label: '第 3 组' }, { value: 3, label: '第 4 组' }],
    description: '选择被高亮的金额区间。', showWhen: (p) => p.focusEnabled },
  { key: 'showLegend', label: '图例', type: 'toggle', default: true,
    description: '赛道颜色图例的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-deal { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-deal, .aic-deal * { box-sizing: border-box; }
.aic-deal .dl-glow { position: absolute; right: -4%; top: -8%; width: 54%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-deal .dl-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-deal .dl-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-deal .dl-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 78px; line-height: .96; margin: 0; white-space: nowrap; }
.aic-deal .dl-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-deal .dl-rail { position: absolute; left: var(--pad); top: 300px; width: 520px; display: flex; flex-direction: column; }
.aic-deal .dl-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5; color: var(--aic-ink); margin: 0; }
.aic-deal .dl-anchor { margin-top: 40px; }
.aic-deal .dl-anchor-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 22px; color: var(--aic-muted);
  margin: 16px 0 0; max-width: 460px; line-height: 1.45; }
.aic-deal .dl-legend { margin-top: 36px; display: flex; flex-direction: column; gap: 13px; }
.aic-deal .dl-legend-cap { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 4px; }
.aic-deal .dl-leg { display: flex; align-items: center; gap: 12px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 22px; color: var(--aic-ink-dim); }
.aic-deal .dl-leg i { width: 16px; height: 16px; border-radius: 50%; flex: none; }
.aic-deal .dl-closing { display: flex; align-items: center; gap: 16px; margin-top: 36px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 26px; color: var(--aic-ink); }
.aic-deal .dl-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-deal .dl-chart { position: absolute; right: var(--pad); top: 286px; width: 1108px; }
.aic-deal .dl-svg { display: block; width: 100%; height: auto; }
.aic-deal .dl-cells { display: grid; gap: 18px; margin-top: 24px; }
.aic-deal .dl-cell { border-radius: 18px; padding: 20px 22px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); transition: background .3s, border-color .3s, transform .3s; }
.aic-deal .dl-cell[data-focus="1"] { background: var(--aic-accent); border-color: var(--aic-accent); transform: translateY(-6px); }
.aic-deal .dl-cell-rng { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-muted);
  transform: skewX(-9deg); transform-origin: left bottom; }
.aic-deal .dl-cell[data-focus="1"] .dl-cell-rng { color: rgba(14,17,11,.6); }
.aic-deal .dl-cell-cnt { font-family: var(--aic-font-display); font-weight: 700; font-size: 38px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; margin-top: 8px; }
.aic-deal .dl-cell-cnt u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }
.aic-deal .dl-cell[data-focus="1"] .dl-cell-cnt u { color: rgba(14,17,11,.6); }
.aic-deal .dl-cell-tot { font-family: var(--aic-font-text); font-weight: 600; font-size: 18px; color: var(--aic-muted); margin-top: 6px; }
.aic-deal .dl-cell[data-focus="1"] .dl-cell-tot { color: rgba(14,17,11,.7); }

.aic-deal .dl-deco { position: absolute; right: var(--pad); bottom: 26px; width: 280px; height: 26px; }
`;

const HEAT = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

// chart geometry (SVG user units)
const VW = 1108, VH = 540;
const M = { l: 10, r: 10, t: 16, b: 44 };

// deterministic PRNG so the scatter is stable across renders
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RAW = ['#86D62B', '#0E110B', '#34B24A', '#EFA63A'];

export default function DealMapPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-deal', CSS);
  const vars = themeVars(p.accentColor);

  const nBands = Math.max(2, Math.min(copy.bands.length, p.bandCount));
  const bands = copy.bands.slice(0, nBands);
  const focus = Math.max(0, Math.min(nBands - 1, p.focusIndex));
  const scale = p.bubbleScale;
  const tracks = copy.tracks;
  const trackColor = (i) => (RAW[i] === '#86D62B' ? 'var(--aic-accent)' : RAW[i % RAW.length]);

  const plotW = VW - M.l - M.r;
  const plotH = VH - M.t - M.b;
  const colW = plotW / nBands;
  const baseline = VH - M.b;

  // bubble radius for an individual deal of a given band-mid amount
  const dotR = (mid) => (3.4 + Math.sqrt(mid) * 2.6) * scale;

  // build scatter points per band (grid + jitter, bottom-aligned)
  const scatter = bands.map((b, bi) => {
    const rnd = mulberry32(bi * 9973 + 17);
    const innerW = colW - 40, innerH = plotH - 18;
    const r = dotR(b.mid);
    const gridCols = Math.max(1, Math.ceil(Math.sqrt(b.count * innerW / innerH)));
    const gridRows = Math.ceil(b.count / gridCols);
    const cellW = innerW / gridCols, cellH = innerH / gridRows;
    const x0 = M.l + bi * colW + 20;
    const pts = [];
    for (let k = 0; k < b.count; k++) {
      const c = k % gridCols, rowFromBottom = Math.floor(k / gridCols);
      const jx = (rnd() - 0.5) * cellW * 0.5, jy = (rnd() - 0.5) * cellH * 0.5;
      const cx = x0 + cellW * (c + 0.5) + jx;
      const cy = baseline - 6 - cellH * (rowFromBottom + 0.5) + jy;
      pts.push({ cx, cy, r, track: Math.floor(rnd() * tracks.length) });
    }
    return { band: b, bi, pts, cx: x0 + innerW / 2 };
  });

  return (
    <div className="aic-deal" style={vars}>
      {p.showDecorations && <div className="dl-glow" />}

      <div className="dl-head">
        <div>
          <p className="dl-eyebrow">{copy.eyebrow}</p>
          <h2 className="dl-title">{copy.title}</h2>
        </div>
        <div className="dl-sub">{copy.sub}</div>
      </div>

      <div className="dl-rail">
        <p className="dl-lead">{copy.lead}</p>
        <div className="dl-anchor">
          <BigNumber lead={copy.anchorLead} unit={copy.anchorUnit} size={132} />
          <p className="dl-anchor-note">{copy.anchorNote}</p>
        </div>
        {p.showLegend && (
          <div className="dl-legend">
            <p className="dl-legend-cap">{copy.legendLabel}</p>
            {tracks.map((t, i) => (
              <div className="dl-leg" key={t.name}>
                <i style={{ background: trackColor(i) }} />{t.name}
              </div>
            ))}
          </div>
        )}
        <div className="dl-closing"><b />{copy.closing}</div>
      </div>

      <div className="dl-chart">
        <svg className="dl-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">
          {/* baseline */}
          <line x1={M.l} y1={baseline} x2={VW - M.r} y2={baseline} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />

          {/* focus band backdrop */}
          {p.focusEnabled && (
            <rect x={M.l + focus * colW + 6} y={M.t} width={colW - 12} height={plotH + 8} rx="18"
              fill="color-mix(in srgb, var(--aic-accent) 12%, transparent)" />
          )}

          {/* band separators + range labels */}
          {bands.map((b, bi) => (
            <g key={b.range}>
              {bi > 0 && <line x1={M.l + bi * colW} y1={M.t} x2={M.l + bi * colW} y2={baseline}
                stroke="var(--aic-hair)" strokeWidth="1.5" strokeDasharray="3 8" />}
              <text x={M.l + bi * colW + colW / 2} y={VH - 14} textAnchor="middle"
                style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 22,
                  fill: p.focusEnabled && bi === focus ? 'var(--aic-ink)' : 'var(--aic-muted)' }}>{b.range}</text>
            </g>
          ))}

          {/* bubbles */}
          {p.viewMode === 'cluster'
            ? scatter.map(({ band, bi, cx }) => {
                const isF = p.focusEnabled && bi === focus;
                const r = Math.min(colW * 0.42, (10 + Math.sqrt(band.total) * 2.0) * scale);
                const cy = baseline - r - 8;
                return (
                  <g key={band.range} opacity={p.focusEnabled && !isF ? 0.42 : 1}>
                    <circle cx={cx} cy={cy} r={r} fill="var(--aic-accent)"
                      opacity={isF ? 0.92 : 0.7} />
                    <text x={cx} y={cy + 4} textAnchor="middle" dominantBaseline="middle"
                      style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700,
                        fontSize: Math.min(r * 0.62, 46), fill: 'var(--aic-ink)' }}>{band.count}</text>
                  </g>
                );
              })
            : scatter.map(({ band, bi, pts }) => {
                const dim = p.focusEnabled && bi !== focus;
                return (
                  <g key={band.range} opacity={dim ? 0.4 : 1}>
                    {pts.map((pt, k) => (
                      <circle key={k} cx={pt.cx} cy={pt.cy} r={pt.r}
                        fill={trackColor(pt.track)} opacity={0.82}
                        stroke="var(--aic-paper)" strokeWidth="1.5" />
                    ))}
                  </g>
                );
              })}
        </svg>

        <div className="dl-cells" style={{ gridTemplateColumns: `repeat(${nBands}, 1fr)` }}>
          {bands.map((b, bi) => (
            <div className="dl-cell" key={b.range} data-focus={p.focusEnabled && bi === focus ? '1' : '0'}>
              <div className="dl-cell-rng">{b.range}</div>
              <div className="dl-cell-cnt">{b.count}<u>笔</u></div>
              <div className="dl-cell-tot">{b.total} 亿美元</div>
            </div>
          ))}
        </div>
      </div>

      {p.showDecorations && <div className="dl-deco"><HeatStrip data={HEAT} gap={4} /></div>}
    </div>
  );
}
