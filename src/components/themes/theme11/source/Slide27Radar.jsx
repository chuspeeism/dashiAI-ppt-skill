/* Slide27Radar.jsx — IGNIS deck · capability radar (spider) chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: radarDefaultProps (complete defaults) + radarControls (1:1).
 *
 * Chart page. A polygon radar plots us vs the field across N capability axes —
 * visually distinct from the line/area Proof, share-of-mix Mix, narrowing
 * Funnel and 2×2 Matrix charts. Pure SVG polygons (data viz, not illustration).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-rdr .ign-frame{justify-content:space-between}
.ign-rdr .b1{width:1080px;height:1080px;right:-180px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.4),rgba(226,42,12,0) 66%);filter:blur(58px)}
.ign-rdr .ign-ghost{font-size:560px;left:10px;bottom:-150px}
.ign-rdr-body{flex:1;display:grid;grid-template-columns:0.66fr 1.34fr;gap:72px;align-items:center;margin-top:6px}
.ign-rdr-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-rdr-head h2{font-size:74px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-rdr-head h2 .ign-serif{color:var(--ign-a)}
.ign-rdr-head p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:380px;text-wrap:pretty}
.ign-rdr-leg{margin-top:34px;display:flex;flex-direction:column;gap:16px}
.ign-rdr-leg .it{display:flex;align-items:center;gap:16px;font-size:23px;color:var(--ign-ink2)}
.ign-rdr-leg .it .sw{width:30px;height:12px;border-radius:2px;flex:none}
.ign-rdr-leg .it .sw.us{background:var(--ign-ember);box-shadow:0 0 14px rgba(255,110,46,0.6)}
.ign-rdr-leg .it .sw.base{background:transparent;border:1.5px dashed var(--ign-hair2);height:0;box-shadow:none}
.ign-rdr-leg .it b{font-family:'Space Grotesk',sans-serif;font-weight:600;color:var(--ign-ink)}
.ign-rdr-plot{position:relative;display:flex;justify-content:center;align-items:center}
.ign-rdr-plot svg{width:660px;height:auto;overflow:visible}
.ign-rdr-axt{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.06em;fill:var(--ign-ink2)}
.ign-rdr-axt.zh{font-family:'Noto Sans SC',sans-serif;font-size:24px;font-weight:600;fill:var(--ign-ink)}
.ign-rdr.dimbase .ign-rdr-base{opacity:0.4}
`;

export const radarDefaultProps = {
  surface: 'ink',
  axisCount: 7,
  emphasis: true,
  showBaseline: true,
  showRings: true,
  showAxisLabels: true,
  showLegend: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '◆',
  railText: 'Radar — 能力',
  navItems: ['能力'],
  navCurrent: 0,
  ixNo: '27',
  ixLabel: 'Radar',
  lead: 'All axes, lit at once.',
  headingHtml: '不是某一项强，<br><span class="ign-ember-text">是整张图都满</span>。',
  lede: '多数方案只在一两个维度突出，其余塌陷。燃点要的是覆盖整张能力图——没有短板拖累复利。',
  legendUsName: '燃点',
  legendUsDesc: '能力轮廓',
  legendBaseName: '行业基准',
  legendBaseDesc: '中位水平',
  axes: [
    { zh: '搜索可见度', en: 'Visibility', us: 92, base: 55 },
    { zh: '转化效率', en: 'Conversion', us: 88, base: 48 },
    { zh: '内容产能', en: 'Content', us: 80, base: 60 },
    { zh: '数据归因', en: 'Attribution', us: 86, base: 40 },
    { zh: '投放回报', en: 'Paid ROI', us: 78, base: 52 },
    { zh: '站点性能', en: 'Performance', us: 90, base: 58 },
    { zh: '协同响应', en: 'Velocity', us: 95, base: 45 },
  ],
  metaLeft: 'IGNIS — 燃点 · 能力轮廓（自评 vs 行业中位）',
  metaMid: '短板，才是复利的天花板',
};

export const radarControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'axisCount', type: 'slider', label: '能力维度', default: 7, min: 5, max: 7, step: 1, describe: '雷达图的能力轴数量（多边形边数）。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后弱化「行业基准」多边形，突出「燃点」。' },
  { key: 'showBaseline', type: 'toggle', label: '行业基准', default: true, describe: '叠加的行业基准对比多边形。' },
  { key: 'showRings', type: 'toggle', label: '刻度网格', default: true, describe: '同心刻度环与放射轴线。' },
  { key: 'showAxisLabels', type: 'toggle', label: '维度标签', default: true, describe: '每条轴外侧的能力维度标签。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '左侧的多边形含义图例。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function RadarSlide(props) {
  injectCSS('ign-rdr-css', CSS);
  const p = { ...radarDefaultProps, ...props };
  const n = clampInt(p.axisCount, 5, 7);
  const axes = (Array.isArray(p.axes) ? p.axes : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const CX = 330, CY = 320, R = 230;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, v) => [CX + R * (v / 100) * Math.cos(ang(i)), CY + R * (v / 100) * Math.sin(ang(i))];
  const poly = (key) => axes.map((a, i) => pt(i, a[key]).join(',')).join(' ');
  const rings = [25, 50, 75, 100];
  const ringPoly = (pct) => axes.map((_, i) => pt(i, pct).join(',')).join(' ');

  return (
    <Slide surface={p.surface} className={`ign-rdr ${p.emphasis ? 'dimbase' : ''}`}>
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-rdr-body">
          <div className="ign-rdr-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showLegend && (
              <div className="ign-rdr-leg">
                <div className="it"><span className="sw us" /><b>{p.legendUsName}</b> · {p.legendUsDesc}</div>
                <div className="it"><span className="sw base" /><b>{p.legendBaseName}</b> · {p.legendBaseDesc}</div>
              </div>
            )}
          </div>

          <div className="ign-rdr-plot ign-a2">
            <svg viewBox="0 0 660 640">
              <defs>
                <linearGradient id="ign-rdr-g" x1="100" y1="90" x2="560" y2="560" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFC07A" /><stop offset="0.5" stopColor="#FF6E2E" /><stop offset="1" stopColor="#E22A0C" />
                </linearGradient>
              </defs>

              {p.showRings && (
                <g>
                  {rings.map((pct, i) => (
                    <polygon key={i} points={ringPoly(pct)} fill="none"
                      stroke="var(--ign-hair)" strokeWidth="1" />
                  ))}
                  {axes.map((_, i) => {
                    const [x, y] = pt(i, 100);
                    return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--ign-hair)" strokeWidth="1" />;
                  })}
                </g>
              )}

              {p.showBaseline && (
                <polygon className="ign-rdr-base" points={poly('base')}
                  fill="var(--ign-ink4)" stroke="var(--ign-hair2)" strokeWidth="1.5" strokeDasharray="5 5" />
              )}

              <polygon points={poly('us')} fill="rgba(255,110,46,0.18)"
                stroke="url(#ign-rdr-g)" strokeWidth="3.5" strokeLinejoin="round" />
              {axes.map((a, i) => {
                const [x, y] = pt(i, a.us);
                return <circle key={i} cx={x} cy={y} r="6" fill="#FFC07A" stroke="#E22A0C" strokeWidth="1.5" />;
              })}

              {p.showAxisLabels && axes.map((a, i) => {
                const [x, y] = pt(i, 118);
                const anchor = Math.abs(x - CX) < 24 ? 'middle' : x > CX ? 'start' : 'end';
                return (
                  <g key={i}>
                    <text x={x} y={y - 8} textAnchor={anchor} className="ign-rdr-axt zh">{a.zh}</text>
                    <text x={x} y={y + 16} textAnchor={anchor} className="ign-rdr-axt">{a.en}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '33%' }} /></span> 27 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
