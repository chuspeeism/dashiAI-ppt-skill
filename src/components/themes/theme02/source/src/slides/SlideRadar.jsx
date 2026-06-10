/**
 * SlideRadar.jsx — 能力雷达（图表页 · 雷达）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 多维能力雷达，可叠加多条系列（如两家公司）多维对比；每条系列填充半透明面 + 辉光
 * 描边。图表内联 SVG，仅依赖 props（含可选 gxnScheme 调色）。
 *
 * ── Props (see slideRadarDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   axes         string[]   维度标签（3–8）
 *   series       Array<{name, values:number[]}>   各系列在每个维度上的分值(0–100)
 *   axisCount    number   展示的维度数量（3–n）
 *   seriesCount  number   展示的系列数量（1–n）
 *   focusEnabled boolean  强调某一系列（其余淡出）
 *   focusIndex   number   0-based 被强调系列
 *   showRings    boolean  背景环网显隐
 *   showDots     boolean  顶点圆点显隐
 *   showLegend   boolean  系列图例显隐
 *   showAxisLabels boolean  维度标签显隐
 *   gxnScheme    object?  { palette } 调色（缺省走主题调色板）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRadarDefaults = {
  kicker: 'RADAR · 能力雷达',
  title: '头部之争 ',
  titleEm: '六维能力画像',
  lead: '把抽象的“谁更强”拆成六个可比维度——头部玩家的优势与短板，一眼可辨。',
  axes: ['模型能力', '商业化', '算力储备', '数据壁垒', '安全对齐', '资本厚度'],
  series: [
    { name: 'OpenAI', values: [95, 88, 90, 82, 78, 96] },
    { name: 'Anthropic', values: [90, 70, 76, 74, 95, 84] },
    { name: 'xAI', values: [86, 58, 94, 68, 60, 92] },
    { name: 'Google DeepMind', values: [93, 78, 90, 88, 82, 89] },
    { name: 'Mistral', values: [80, 62, 56, 60, 72, 64] },
  ],
  axisCount: 6,
  seriesCount: 5,
  focusEnabled: false,
  focusIndex: 0,
  showRings: true,
  showDots: true,
  showLegend: true,
  showAxisLabels: true,
};

export const slideRadarControls = [
  { key: 'axisCount', type: 'number', label: '维度数量', default: 6, min: 3, step: 1,
    maxFrom: (p) => (p.axes ? p.axes.length : 6), describe: '雷达展示的维度数量' },
  { key: 'seriesCount', type: 'number', label: '系列数量', default: 5, min: 1, step: 1,
    maxFrom: (p) => (p.series ? p.series.length : 5), describe: '叠加对比的系列数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否强调某一系列（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.seriesCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调系列的序号' },
  { key: 'showRings', type: 'toggle', label: '背景环网', default: true,
    describe: '同心环 + 辐射轴显隐' },
  { key: 'showDots', type: 'toggle', label: '顶点圆点', default: true,
    describe: '各维度顶点圆点显隐' },
  { key: 'showLegend', type: 'toggle', label: '系列图例', default: true,
    describe: '右侧系列图例显隐' },
  { key: 'showAxisLabels', type: 'toggle', label: '维度标签', default: true,
    describe: '外圈维度文字标签显隐' },
];

function Radar({ axes, series, fIdx, showRings, showDots, showAxisLabels, palette }) {
  const uid = React.useId().replace(/:/g, '');
  const S = 620, cx = S / 2, cy = S / 2, R = 232;
  const n = axes.length;
  const rings = [0.25, 0.5, 0.75, 1];
  const ang = (i) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const ringPoly = (f) => axes.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const focused = fIdx >= 0;

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showRings && (
        <g>
          {rings.map((f, i) => (
            <polygon key={i} points={ringPoly(f)} fill={i === rings.length - 1 ? 'rgba(255,255,255,0.018)' : 'none'}
                     stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          ))}
          {axes.map((_, i) => {
            const [x, y] = pt(i, R);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.10)" strokeWidth="1" />;
          })}
        </g>
      )}

      {series.map((s, si) => {
        const c = palette[si % palette.length];
        const isF = si === fIdx;
        const dim = focused && !isF;
        const pts = s.values.slice(0, n).map((v, i) => pt(i, R * Math.max(0, Math.min(100, v)) / 100));
        const poly = pts.map((q) => q.join(',')).join(' ');
        return (
          <g key={si} opacity={dim ? 0.22 : 1}>
            <polygon points={poly} fill={c} fillOpacity={isF ? 0.26 : 0.16}
                     stroke={c} strokeWidth={isF ? 4 : 3} strokeLinejoin="round"
                     filter={!dim ? `url(#${uid}-g)` : undefined} />
            {showDots && pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={isF ? 7 : 5.5} fill={c} stroke="#07090b" strokeWidth="2.5" />
            ))}
          </g>
        );
      })}

      {showAxisLabels && axes.map((a, i) => {
        const [x, y] = pt(i, R + 36);
        const co = Math.cos(ang(i));
        const anchor = Math.abs(co) < 0.25 ? 'middle' : co > 0 ? 'start' : 'end';
        return (
          <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
                fontFamily="'Noto Sans SC',sans-serif" fontWeight="500" fontSize="25"
                fill="rgba(238,243,241,0.78)">{a}</text>
        );
      })}
    </svg>
  );
}

export function SlideRadar(props) {
  const p = { ...slideRadarDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#4ea2ff', '#ff6fae', '#b9f24a', '#9b7dff'];

  const aCount = Math.max(3, Math.min(p.axes.length, p.axisCount));
  const axes = p.axes.slice(0, aCount);
  const sCount = Math.max(1, Math.min(p.series.length, p.seriesCount));
  const series = p.series.slice(0, sCount);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(sCount - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "10 / 27"} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 18, maxWidth: 1200 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, minHeight: 0, display: 'grid',
          gridTemplateColumns: p.showLegend ? '1.15fr 0.85fr' : '1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radar axes={axes} series={series} fIdx={fIdx} showRings={p.showRings}
                   showDots={p.showDots} showAxisLabels={p.showAxisLabels} palette={palette} />
          </div>

          {p.showLegend && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              {series.map((s, si) => {
                const c = palette[si % palette.length];
                const isF = si === fIdx; const dim = fIdx >= 0 && !isF;
                const vals = s.values.slice(0, aCount);
                const avg = Math.round(vals.reduce((a, b) => a + b, 0) / aCount);
                const top = axes[vals.indexOf(Math.max(...vals))];
                return (
                  <article key={si} className={cx('gxn-panel', isF && 'is-focus')}
                           style={{ padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 20,
                                    opacity: dim ? 0.5 : 1, transition: 'opacity .3s ease' }}>
                    <span style={{ width: 16, height: 16, borderRadius: 5, background: c, flex: '0 0 auto',
                      boxShadow: `0 0 16px ${c}` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: 'var(--gxn-text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</h3>
                      <div className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', marginTop: 4 }}>
                        最强 · {top}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                      <div className="gxn-num" style={{ fontSize: 52, fontWeight: 600, lineHeight: 0.9, color: c }}>{avg}</div>
                      <div className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', marginTop: 4 }}>综合分</div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideRadar;
