// SlidePolar.jsx — 极坐标花瓣 / coxcomb (polar area) chart.
// N equal-angle wedges radiating from a centre, each wedge's RADIUS encoding a
// value — a "rose" diagram. Distinct from SlideRadar (a polygon over axes),
// SlideOrbit (hub-spoke) and any donut (equal radius, angle-encoded): here the
// radius carries the value. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.pol-`.
//
// ── Props (canonical list in SlidePolar.META.controls) ────────────────────────
//   wedgeCount  number 4..8   how many wedges                              (6)
//   showRings   boolean       the radial scale rings                       (true)
//   showLabels  boolean       the outer category labels                    (true)
//   showValues  boolean       the value on each wedge                      (true)
//   focus       boolean       emphasise one wedge, dim the rest            (false)
//   focusIndex  number 1..8   which wedge is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, unit, ringLabels:[string],
//   wedges:[{ label, value(number) }]

import React from 'react';

function SlidePolar({
  overline = '多维表现 · BY DIMENSION', title = '六个维度，一朵盛开的图',
  unit = '', ringLabels = ['', '', ''],
  wedges = [
    { label: '回报', value: 86 },
    { label: '稳健', value: 72 },
    { label: '成本', value: 91 },
    { label: '流动性', value: 64 },
    { label: '透明', value: 95 },
    { label: '自动化', value: 88 },
    { label: '税务', value: 70 },
    { label: '传承', value: 58 },
  ],
  wedgeCount = 6, showRings = true, showLabels = true, showValues = true, focus = false, focusIndex = 1,
  layout = 'top',
}) {
  React.useEffect(() => { polInjectStyle(); }, []);
  const n = Math.max(4, Math.min(wedges.length, wedgeCount));
  const used = wedges.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const max = Math.max(...used.map((w) => w.value)) || 1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];

  const W = 760, cx = W / 2, cy = W / 2, Rmax = 290, Rmin = 16;
  const step = (2 * Math.PI) / n;
  const rOf = (v) => Rmin + (v / max) * (Rmax - Rmin);
  const pt = (ang, r) => [cx + r * Math.cos(ang - Math.PI / 2), cy + r * Math.sin(ang - Math.PI / 2)];
  const wedgePath = (i, r) => {
    const a0 = i * step + step * 0.05, a1 = (i + 1) * step - step * 0.05;
    const [x0, y0] = pt(a0, Rmin), [x1, y1] = pt(a0, r), [x2, y2] = pt(a1, r), [x3, y3] = pt(a1, Rmin);
    return `M${x0.toFixed(1)},${y0.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} A${Rmin},${Rmin} 0 0 0 ${x0.toFixed(1)},${y0.toFixed(1)} Z`;
  };

  return (
    <div className={`pol-root pol-${layout === 'side' ? 'side' : 'top'}`}>
      <div className="pol-head">
        <div className="pol-overline">{overline}</div>
        <h2 className="pol-title">{title}</h2>
      </div>

      <div className="pol-stage">
        <svg className="pol-svg" viewBox={`0 0 ${W} ${W}`} preserveAspectRatio="xMidYMid meet">
          {showRings && [0.33, 0.66, 1].map((t, i) => (
            <circle key={i} cx={cx} cy={cy} r={Rmin + t * (Rmax - Rmin)} className="pol-ring" />
          ))}
          <defs>
            {used.map((w, i) => (
              <radialGradient key={i} id={`polG${i}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={Rmax}>
                <stop offset="0%" stopColor={`color-mix(in srgb, ${HUE[i % HUE.length]} 45%, #fff)`} />
                <stop offset="100%" stopColor={HUE[i % HUE.length]} />
              </radialGradient>
            ))}
          </defs>
          {used.map((w, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            return (
              <path key={i} d={wedgePath(i, rOf(w.value))}
                    className={`pol-wedge ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}
                    style={{ fill: `url(#polG${i})`, fillOpacity: 0.68 + 0.32 * (w.value / max) }} />
            );
          })}
          {/* spokes */}
          {used.map((_, i) => {
            const [x, y] = pt(i * step, Rmax + 4);
            return <line key={'s' + i} x1={cx} y1={cy} x2={x} y2={y} className="pol-spoke" />;
          })}
          {showLabels && used.map((w, i) => {
            const mid = (i + 0.5) * step;
            const [lx, ly] = pt(mid, Rmax + 46);
            const anchor = Math.abs(Math.cos(mid - Math.PI / 2)) < 0.3 ? 'middle' : (lx > cx ? 'start' : 'end');
            return (
              <g key={'l' + i}>
                <text x={lx} y={ly} className="pol-label" textAnchor={anchor}>{w.label}</text>
                {showValues && <text x={lx} y={ly + 30} className="pol-val" textAnchor={anchor}>{w.value}{unit}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function polInjectStyle() {
  if (document.getElementById('pol-style')) return;
  const s = document.createElement('style'); s.id = 'pol-style';
  s.textContent = `
  .pol-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .pol-side{flex-direction:row;align-items:center;gap:48px;}
  .pol-side .pol-head{margin-bottom:0;flex:0 0 32%;max-width:32%;}
  .pol-side .pol-stage{flex:1;min-width:0;}
  .pol-head{margin-bottom:6px;}
  .pol-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .pol-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .pol-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;}
  .pol-svg{height:100%;width:auto;max-width:100%;max-height:680px;overflow:visible;}
  .pol-side .pol-svg{max-height:600px;}
  .pol-ring{fill:none;stroke:var(--ds-line,rgba(242,243,246,.12));stroke-width:1;}
  .pol-spoke{stroke:var(--ds-line,rgba(242,243,246,.1));stroke-width:1;}
  .pol-wedge{fill:var(--ds-accent,#6f9bd8);stroke:var(--ds-bg,#0d0e11);stroke-width:2;transition:opacity .25s,fill-opacity .25s;}
  .pol-wedge.is-dim{opacity:.3;}
  .pol-wedge.is-focus{fill:var(--ds-accent-2,#8fa8e6);fill-opacity:1 !important;stroke:var(--ds-ink,#f2f3f6);stroke-width:2.5;}
  .pol-label{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);font-size:28px;font-weight:300;}
  .pol-val{fill:var(--ds-faint,rgba(242,243,246,.55));font-family:var(--font-mono);font-size:24px;font-variant-numeric:tabular-nums;}
  `;
  document.head.appendChild(s);
}

SlidePolar.META = {
  id: 'polar', title: '极坐标花瓣',
  defaults: { wedgeCount: 6, showRings: true, showLabels: true, showValues: true, focus: false, focusIndex: 1, layout: 'top' },
  controls: [
    { key: 'layout', type: 'radio', label: '布局', default: 'top',
      options: [{ value: 'top', label: '上下' }, { value: 'side', label: '左右' }],
      description: '标题与图表的排布：上下堆叠或左右分栏。' },
    { key: 'wedgeCount', type: 'slider', label: '花瓣数量', default: 6, min: 4, max: 8, step: 1,
      description: '维度（花瓣）数量。' },
    { key: 'showRings', type: 'toggle', label: '刻度环', default: true,
      description: '径向的刻度参考环。' },
    { key: 'showLabels', type: 'toggle', label: '维度标签', default: true,
      description: '外圈的维度名称。' },
    { key: 'showValues', type: 'toggle', label: '数值', default: true,
      description: '每个维度的数值。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一花瓣，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlidePolar };
export const META = SlidePolar.META;
export default SlidePolar;
