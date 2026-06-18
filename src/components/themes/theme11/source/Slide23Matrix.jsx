/* Slide23Matrix.jsx — IGNIS deck · 2x2 positioning-matrix chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: matrixDefaultProps (complete defaults) + matrixControls (1:1).
 *
 * Chart page. A cost / effect quadrant plots the field as muted bubbles and
 * our position as a glowing ember bubble in the sweet-spot quadrant. Distinct
 * from the line/area Proof and the share-of-mix Mix charts.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-mx .ign-frame{justify-content:space-between}
.ign-mx .b1{width:1100px;height:1100px;right:-160px;bottom:-220px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.4),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-mx .ign-ghost{font-size:560px;left:10px;bottom:-150px}
.ign-mx-body{flex:1;display:grid;grid-template-columns:0.62fr 1.38fr;gap:80px;align-items:center;margin-top:6px}
.ign-mx-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-mx-head h2{font-size:74px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-mx-head h2 .ign-serif{color:var(--ign-a)}
.ign-mx-head p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:360px;text-wrap:pretty}
.ign-mx-leg{margin-top:30px;display:flex;flex-direction:column;gap:14px}
.ign-mx-leg .it{display:flex;align-items:center;gap:14px;font-size:22px;color:var(--ign-ink2)}
.ign-mx-leg .it .d{width:16px;height:16px;border-radius:50%;flex:none}
.ign-mx-leg .it .d.us{background:var(--ign-ember);box-shadow:0 0 14px var(--ign-b)}
.ign-mx-leg .it .d.them{background:var(--ign-ink4);border:1px solid var(--ign-hair2)}
.ign-mx-plot{position:relative;height:620px;border-left:1px solid var(--ign-hair2);border-bottom:1px solid var(--ign-hair2)}
.ign-mx-plot .sweet{position:absolute;left:0;top:0;width:50%;height:50%;
  background:linear-gradient(135deg,rgba(255,120,52,0.14),transparent 70%)}
.ign-mx-plot .cross{position:absolute;background:repeating-linear-gradient(var(--ign-hair) 0 6px,transparent 6px 12px)}
.ign-mx-plot .cross.v{left:50%;top:0;bottom:0;width:1px;background:repeating-linear-gradient(180deg,var(--ign-hair) 0 6px,transparent 6px 12px)}
.ign-mx-plot .cross.h{top:50%;left:0;right:0;height:1px}
.ign-mx-ql{position:absolute;font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-mx-ql.tl{left:18px;top:14px;color:var(--ign-a)}
.ign-mx-ql.tr{right:18px;top:14px;text-align:right}
.ign-mx-ql.bl{left:18px;bottom:14px}
.ign-mx-ql.br{right:18px;bottom:14px;text-align:right}
.ign-mx-ax{position:absolute;font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink2)}
.ign-mx-ax.x{right:-4px;bottom:-44px;text-align:right}
.ign-mx-ax.y{left:-4px;top:-46px}
.ign-mx-bub{position:absolute;transform:translate(-50%,50%);display:flex;flex-direction:column;align-items:center;gap:8px}
.ign-mx-bub .dot{border-radius:50%}
.ign-mx-bub.them .dot{background:rgba(244,238,230,0.14);border:1px solid var(--ign-hair2)}
.ign-mx-bub.us .dot{background:var(--ign-ember);box-shadow:0 0 30px rgba(255,110,46,0.8),0 0 0 6px rgba(255,110,46,0.12)}
.ign-mx-bub .nm{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.04em;color:var(--ign-ink2);white-space:nowrap}
.ign-mx-bub.us .nm{font-weight:700;font-size:26px;color:var(--ign-ink)}
.ign-mx-bub.dim{opacity:0.4}
`;

export const matrixDefaultProps = {
  surface: 'ember',
  plotCount: 6,
  emphasis: true,
  showAxisLabels: true,
  showQuadrantLabels: true,
  showLegend: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '2×2',
  railText: 'Landscape — 格局',
  navItems: ['格局'],
  navCurrent: 0,
  ixNo: '10',
  ixLabel: 'Landscape',
  lead: 'Where we sit.',
  headingHtml: '同样的钱，<br><span class="ign-ember-text">买更高的效</span>。',
  lede: '把市面上的选择放进同一张图：多数方案要么贵、要么平庸，左上角的「划算且高效」几乎空着。',
  legendUs: '燃点 · 高效且划算',
  legendThem: '其它方案 · 现状分布',
  quadrantLabels: ['划算 · 高效', '昂贵 · 高效', '便宜 · 平庸', '昂贵 · 低效'],
  axisX: '投入成本 →',
  axisY: '增长效果 →',
  others: [
    { name: '综合代理', x: 78, y: 50, r: 36 },
    { name: '外包工厂', x: 68, y: 20, r: 30 },
    { name: '内部团队', x: 56, y: 34, r: 32 },
    { name: '垂直工具', x: 40, y: 42, r: 28 },
    { name: '自由职业', x: 28, y: 22, r: 26 },
  ],
  us: { name: '燃点', x: 22, y: 80, r: 52, us: true },
  metaLeft: 'IGNIS — 燃点 · 竞争格局',
  metaMid: '左上角，本该有人站',
};

export const matrixControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'plotCount', type: 'slider', label: '气泡数量', default: 6, min: 3, max: 6, step: 1, describe: '矩阵中绘制的参与者数量（始终包含「燃点」自身）。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后弱化竞品气泡，突出「燃点」自身。' },
  { key: 'showAxisLabels', type: 'toggle', label: '坐标轴标签', default: true, describe: '横纵坐标轴的含义标签。' },
  { key: 'showQuadrantLabels', type: 'toggle', label: '象限标签', default: true, describe: '四个象限角落的定性标签。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '左侧的气泡含义图例。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function MatrixSlide(props) {
  injectCSS('ign-mx-css', CSS);
  const p = { ...matrixDefaultProps, ...props };
  const count = clampInt(p.plotCount, 3, 6);
  const others = (Array.isArray(p.others) ? p.others : []).slice(0, count - 1);
  const bubbles = [...others, p.us];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-mx">
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

        <div className="ign-mx-body">
          <div className="ign-mx-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showLegend && (
              <div className="ign-mx-leg">
                <div className="it"><span className="d us" />{p.legendUs}</div>
                <div className="it"><span className="d them" />{p.legendThem}</div>
              </div>
            )}
          </div>

          <div className="ign-mx-plot ign-a2">
            <div className="sweet" />
            <span className="cross v" /><span className="cross h" />
            {p.showQuadrantLabels && (
              <>
                <span className="ign-mx-ql tl">{p.quadrantLabels[0]}</span>
                <span className="ign-mx-ql tr">{p.quadrantLabels[1]}</span>
                <span className="ign-mx-ql bl">{p.quadrantLabels[2]}</span>
                <span className="ign-mx-ql br">{p.quadrantLabels[3]}</span>
              </>
            )}
            {p.showAxisLabels && (
              <>
                <span className="ign-mx-ax x">{p.axisX}</span>
                <span className="ign-mx-ax y">{p.axisY}</span>
              </>
            )}
            {bubbles.map((b, i) => (
              <div key={i}
                className={`ign-mx-bub ${b.us ? 'us' : 'them'} ${p.emphasis && !b.us ? 'dim' : ''}`}
                style={{ left: `${b.x}%`, bottom: `${b.y}%` }}>
                <span className="dot" style={{ width: b.r, height: b.r }} />
                <span className="nm">{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '18%' }} /></span> 15 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
