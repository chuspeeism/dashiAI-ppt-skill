/* Slide44Bubble.jsx — IGNIS deck · effort/impact bubble-scatter chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: bubbleDefaultProps (complete defaults) + bubbleControls (1:1).
 *
 * Chart page. A 2-axis scatter (effort × impact) where bubble area encodes a
 * third dimension (reach). Distinct from the 2×2 Matrix (labelled quadrants,
 * no axes) and every bar/line/area chart — this is the only sized-bubble plot.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-bub .ign-frame{justify-content:space-between}
.ign-bub .b1{width:1100px;height:1100px;right:-220px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.32),rgba(226,42,12,0) 66%);filter:blur(58px)}
.ign-bub .ign-ghost{font-size:520px;left:20px;bottom:-140px}
.ign-bub-body{flex:1;display:grid;grid-template-columns:0.6fr 1.4fr;gap:64px;align-items:center;margin-top:6px}
.ign-bub-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-bub-head h2{font-size:66px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-bub-head h2 .ign-serif{color:var(--ign-a)}
.ign-bub-head p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:380px;text-wrap:pretty}
.ign-bub-leg{margin-top:32px;display:flex;flex-direction:column;gap:14px}
.ign-bub-leg .it{display:flex;align-items:center;gap:14px;font-size:22px;color:var(--ign-ink2)}
.ign-bub-leg .it .dot{width:18px;height:18px;border-radius:50%;flex:none}
.ign-bub-leg .it .dot.lit{background:var(--ign-ember)}
.ign-bub-leg .it .dot.base{background:var(--ign-ink4)}
.ign-bub-leg .it .ring{width:18px;height:18px;border-radius:50%;border:1.5px dashed var(--ign-hair2);flex:none}
.ign-bub-plot{position:relative}
.ign-bub-plot svg{width:100%;height:auto;overflow:visible}
.ign-bub-axt{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.08em;fill:var(--ign-ink3)}
.ign-bub-axl{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.14em;text-transform:uppercase;fill:var(--ign-ink2)}
.ign-bub-blab{font-family:'Noto Sans SC',sans-serif;font-size:21px;font-weight:600;fill:var(--ign-ink)}
`;

export const bubbleDefaultProps = {
  surface: 'paper',
  bubbleCount: 6,
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showLegend: true,
  showSweetSpot: true,
  emphasis: false,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '◌',
  railText: 'Impact — 优先级',
  navItems: ['优先级'],
  navCurrent: 0,
  ixNo: '44',
  ixLabel: 'Impact',
  lead: 'Where the leverage lives.',
  headingHtml: '把力气，<br><span class="ign-ember-text">花在右上角</span>。',
  lede: '横轴是投入，纵轴是影响，气泡大小是覆盖面。我们只重押右上角——高影响、低投入、广覆盖。',
  legendLit: '燃点主推举措',
  legendBase: '常规备选',
  legendSize: '气泡大小 = 覆盖面',
  axisX: '投入 →',
  axisY: '影响 →',
  axisXLow: '低',
  axisYLow: '低',
  bubbles: [
    { x: 22, y: 78, r: 46, lit: true, label: '内容引擎' },
    { x: 38, y: 62, r: 34, lit: true, label: '转化优化' },
    { x: 68, y: 84, r: 40, lit: true, label: '付费放大' },
    { x: 30, y: 34, r: 22, lit: false, label: '社媒运营' },
    { x: 74, y: 40, r: 28, lit: false, label: '线下活动' },
    { x: 55, y: 52, r: 18, lit: false, label: '邮件触达' },
  ],
  metaLeft: 'IGNIS — 燃点 · 举措优先级（投入 × 影响 × 覆盖）',
  metaMid: '少做，但做对',
};

export const bubbleControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'bubbleCount', type: 'slider', label: '气泡数量', default: 6, min: 3, max: 6, step: 1, describe: '散点图中的气泡（举措）数量。' },
  { key: 'showAxes', type: 'toggle', label: '坐标轴', default: true, describe: 'X/Y 轴线与轴标题。' },
  { key: 'showGrid', type: 'toggle', label: '网格线', default: true, describe: '背景刻度网格。' },
  { key: 'showLabels', type: 'toggle', label: '气泡标签', default: true, describe: '每个气泡旁的举措名称。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '左侧的气泡含义图例。' },
  { key: 'showSweetSpot', type: 'toggle', label: '甜区高亮', default: true, describe: '右上角「高影响·低投入」甜区高亮。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后弱化非重点气泡，突出燃点主推举措。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function BubbleSlide(props) {
  injectCSS('ign-bub-css', CSS);
  const p = { ...bubbleDefaultProps, ...props };
  const n = clampInt(p.bubbleCount, 3, 6);
  const bubbles = (Array.isArray(p.bubbles) ? p.bubbles : []).slice(0, n);
  const PX = 90, PW = 620, PY = 40, PH = 470;
  const sx = (v) => PX + (v / 100) * PW;
  const sy = (v) => PY + (1 - v / 100) * PH;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-bub">
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

        <div className="ign-bub-body">
          <div className="ign-bub-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showLegend && (
              <div className="ign-bub-leg">
                <div className="it"><span className="dot lit" />{p.legendLit}</div>
                <div className="it"><span className="dot base" />{p.legendBase}</div>
                <div className="it"><span className="ring" />{p.legendSize}</div>
              </div>
            )}
          </div>

          <div className="ign-bub-plot ign-a2">
            <svg viewBox="0 0 740 560">
              <defs>
                <radialGradient id="ign-bub-g" cx="38%" cy="34%" r="70%">
                  <stop offset="0" stopColor="#FFC07A" /><stop offset="0.5" stopColor="#FF6E2E" /><stop offset="1" stopColor="#E22A0C" />
                </radialGradient>
              </defs>

              {p.showSweetSpot && (
                <rect x={sx(55)} y={sy(100)} width={PW * 0.45} height={PH * 0.45} rx="8"
                  fill="rgba(255,110,46,0.07)" stroke="rgba(255,160,100,0.4)" strokeDasharray="6 6" strokeWidth="1.5" />
              )}

              {p.showGrid && [25, 50, 75].map((g) => (
                <g key={g}>
                  <line x1={sx(g)} y1={PY} x2={sx(g)} y2={PY + PH} stroke="var(--ign-hair)" strokeWidth="1" />
                  <line x1={PX} y1={sy(g)} x2={PX + PW} y2={sy(g)} stroke="var(--ign-hair)" strokeWidth="1" />
                </g>
              ))}

              {p.showAxes && (
                <g>
                  <line x1={PX} y1={PY} x2={PX} y2={PY + PH} stroke="var(--ign-hair2)" strokeWidth="1.5" />
                  <line x1={PX} y1={PY + PH} x2={PX + PW} y2={PY + PH} stroke="var(--ign-hair2)" strokeWidth="1.5" />
                  <text x={PX + PW} y={PY + PH + 36} textAnchor="end" className="ign-bub-axl">{p.axisX}</text>
                  <text x={PX - 24} y={PY + 6} textAnchor="end" className="ign-bub-axl" transform={`rotate(-90 ${PX - 24} ${PY + 6})`}>{p.axisY}</text>
                  <text x={PX} y={PY + PH + 36} textAnchor="start" className="ign-bub-axt">{p.axisXLow}</text>
                  <text x={PX - 14} y={PY + PH} textAnchor="end" className="ign-bub-axt">{p.axisYLow}</text>
                </g>
              )}

              {bubbles.map((b, i) => {
                const dim = p.emphasis && !b.lit;
                return (
                  <g key={i} style={{ opacity: dim ? 0.3 : 1 }}>
                    <circle cx={sx(b.x)} cy={sy(b.y)} r={b.r}
                      fill={b.lit ? 'url(#ign-bub-g)' : 'var(--ign-ink4)'}
                      stroke={b.lit ? '#E22A0C' : 'var(--ign-hair2)'} strokeWidth={b.lit ? 1.5 : 1}
                      fillOpacity={b.lit ? 0.92 : 0.5} />
                    {p.showLabels && (
                      <text x={sx(b.x)} y={sy(b.y) + b.r + 24} textAnchor="middle" className="ign-bub-blab">{b.label}</text>
                    )}
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
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '54%' }} /></span> 44 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
