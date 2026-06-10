// SlideRadar.jsx — 多因子雷达图 / factor radar (spider) chart.
// One or two polygon series plotted over N labelled factor axes, on a polar grid.
// Distinct from SlideGauges (independent radial rings) and SlideScatter (cartesian
// bubbles): this compares a profile across many dimensions at once. Standalone &
// migratable: depends only on React (imported). Token-driven. CSS scoped `.rad-`.
//
// ── Props (canonical list in SlideRadar.META.controls) ────────────────────────
//   axisCount    number 4..8   how many factor axes                         (6)
//   showCompare  boolean       overlay the 2nd (benchmark) series           (true)
//   showGrid     boolean       concentric polar rings + spokes              (true)
//   fillArea     boolean       fill the primary polygon (vs outline only)   (true)
//   showScores   boolean       numeric score chips beside each axis label   (true)
//
// Content props (authored at call-site):
//   overline, title, primaryLabel, compareLabel,
//   axes:[{label, a, b}]  (a = primary 0..100, b = benchmark 0..100)

import React from 'react';

function SlideRadar({
  overline = '组合体检 · FACTOR PROFILE', title = '六个维度的均衡',
  primaryLabel = '本组合', compareLabel = '市场基准',
  axes = [
    { label: '回报', a: 88, b: 62 },
    { label: '抗跌', a: 74, b: 58 },
    { label: '分散度', a: 92, b: 50 },
    { label: '流动性', a: 66, b: 80 },
    { label: '税务效率', a: 95, b: 40 },
    { label: '成本', a: 84, b: 55 },
    { label: '透明度', a: 90, b: 48 },
    { label: '自动化', a: 97, b: 35 },
  ],
  axisCount = 6, showCompare = true, showGrid = true, fillArea = true, showScores = true,
}) {
  React.useEffect(() => { radInjectStyle(); }, []);
  const n = Math.max(4, Math.min(axes.length, axisCount));
  const used = axes.slice(0, n);
  const CX = 250, CY = 250, R = 200;
  const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, val) => [CX + Math.cos(ang(i)) * R * (val / 100), CY + Math.sin(ang(i)) * R * (val / 100)];
  const poly = (key) => used.map((ax, i) => pt(i, ax[key]).map((v) => v.toFixed(1)).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="rad-root">
      <div className="rad-head">
        <div className="rad-overline">{overline}</div>
        <h2 className="rad-title">{title}</h2>
      </div>

      <div className="rad-body">
        <div className="rad-chart">
          <svg viewBox="0 0 500 500" className="rad-svg">
            <defs>
              <radialGradient id="radFillA" cx="50%" cy="46%" r="62%">
                <stop offset="0%" stopColor="var(--ds-c1)" stopOpacity="0.46" />
                <stop offset="60%" stopColor="var(--ds-c3)" stopOpacity="0.26" />
                <stop offset="100%" stopColor="var(--ds-c3)" stopOpacity="0.12" />
              </radialGradient>
            </defs>
            {showGrid && (
              <g className="rad-grid">
                {rings.map((f, i) => (
                  <polygon key={i} points={used.map((_, j) => [CX + Math.cos(ang(j)) * R * f, CY + Math.sin(ang(j)) * R * f].join(',')).join(' ')}
                           fill="none" stroke="currentColor" strokeOpacity={i === rings.length - 1 ? 0.28 : 0.12} />
                ))}
                {used.map((_, i) => {
                  const [x, y] = pt(i, 100);
                  return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.12" />;
                })}
              </g>
            )}
            {showCompare && (
              <polygon points={poly('b')} className="rad-poly rad-poly-b" />
            )}
            <polygon points={poly('a')} className={`rad-poly rad-poly-a ${fillArea ? 'is-filled' : ''}`}
                     style={{ fill: fillArea ? 'color-mix(in srgb, var(--ds-accent,#6f9bd8) 22%, transparent)' : 'none', fillOpacity: 1 }} />
            {used.map((_, i) => {
              const [x, y] = pt(i, used[i].a);
              return <circle key={i} cx={x} cy={y} r="5" className="rad-node" />;
            })}
            {used.map((ax, i) => {
              const [lx, ly] = [CX + Math.cos(ang(i)) * (R + 30), CY + Math.sin(ang(i)) * (R + 30)];
              const anchor = Math.abs(lx - CX) < 8 ? 'middle' : lx > CX ? 'start' : 'end';
              return (
                <text key={i} x={lx} y={ly} className="rad-axlab" textAnchor={anchor} dominantBaseline="middle">
                  {ax.label}{showScores && <tspan className="rad-axscore" dx="8">{ax.a}</tspan>}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="rad-side">
          <div className="rad-legend">
            <div className="rad-leg-item">
              <span className="rad-sw rad-sw-a" /><span className="rad-leg-name">{primaryLabel}</span>
            </div>
            {showCompare && (
              <div className="rad-leg-item">
                <span className="rad-sw rad-sw-b" /><span className="rad-leg-name">{compareLabel}</span>
              </div>
            )}
          </div>
          <div className="rad-avg">
            <span className="rad-avg-num">{Math.round(used.reduce((a, x) => a + x.a, 0) / n)}</span>
            <span className="rad-avg-lab">综合评分 / 100</span>
          </div>
          <p className="rad-note">每根轴代表一个独立维度，越靠外表现越好。</p>
        </div>
      </div>
    </div>
  );
}

function radInjectStyle() {
  if (document.getElementById('rad-style')) return;
  const s = document.createElement('style'); s.id = 'rad-style';
  s.textContent = `
  .rad-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .rad-head{margin-bottom:24px;}
  .rad-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .rad-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .rad-body{flex:1;display:grid;grid-template-columns:1fr 360px;align-items:center;gap:40px;min-height:0;}
  .rad-chart{height:100%;min-height:0;display:flex;align-items:center;justify-content:center;color:var(--ds-ink,#f2f3f6);}
  .rad-svg{height:100%;max-height:760px;width:auto;overflow:visible;}
  .rad-poly{transition:all .3s;}
  .rad-poly-a{fill:var(--ds-accent,#6f9bd8);fill-opacity:0;stroke:var(--ds-accent,#6f9bd8);stroke-width:2.5;}
  .rad-poly-a.is-filled{fill-opacity:.18;}
  .rad-poly-b{fill:none;stroke:currentColor;stroke-opacity:.4;stroke-width:1.8;stroke-dasharray:6 6;}
  .rad-node{fill:var(--ds-accent,#6f9bd8);}
  .rad-axlab{font-family:var(--font-sans);font-size:27px;font-weight:300;fill:var(--ds-ink,#f2f3f6);}
  .rad-axscore{font-family:var(--font-mono);font-size:22px;fill:var(--ds-faint,rgba(242,243,246,.5));}
  .rad-side{display:flex;flex-direction:column;gap:38px;}
  .rad-legend{display:flex;flex-direction:column;gap:18px;}
  .rad-leg-item{display:flex;align-items:center;gap:16px;}
  .rad-sw{width:30px;height:0;flex:0 0 auto;}
  .rad-sw-a{border-top:3px solid var(--ds-accent,#6f9bd8);}
  .rad-sw-b{border-top:2px dashed var(--ds-muted,rgba(242,243,246,.5));}
  .rad-leg-name{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.8));}
  .rad-avg{display:flex;flex-direction:column;gap:8px;padding:32px 36px;border-radius:20px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));}
  .rad-avg-num{font-size:88px;font-weight:300;line-height:1;font-variant-numeric:tabular-nums;color:var(--ds-accent,#6f9bd8);}
  .rad-avg-lab{font-family:var(--font-mono);font-size:23px;letter-spacing:.08em;color:var(--ds-faint,rgba(242,243,246,.45));}
  .rad-note{font-size:25px;font-weight:300;line-height:1.6;color:var(--ds-muted,rgba(242,243,246,.6));margin:0;max-width:330px;text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideRadar.META = {
  id: 'radar', title: '多因子雷达图',
  defaults: { axisCount: 6, showCompare: true, showGrid: true, fillArea: true, showScores: true },
  controls: [
    { key: 'axisCount', type: 'slider', label: '维度轴数', default: 6, min: 4, max: 8, step: 1,
      description: '雷达图的因子轴数量。' },
    { key: 'showCompare', type: 'toggle', label: '对比序列', default: true,
      description: '叠加第二条（基准）虚线多边形。' },
    { key: 'showGrid', type: 'toggle', label: '极坐标网格', default: true,
      description: '同心环与放射状轴线。' },
    { key: 'fillArea', type: 'toggle', label: '填充面积', default: true,
      description: '主多边形是否填充半透明色块。' },
    { key: 'showScores', type: 'toggle', label: '轴上评分', default: true,
      description: '在每个轴标签旁显示分值。' },
  ],
};

export { SlideRadar };
export const META = SlideRadar.META;
export default SlideRadar;
