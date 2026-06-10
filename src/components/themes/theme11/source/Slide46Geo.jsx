/* Slide46Geo.jsx — IGNIS deck · market-coverage dotted-map page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: geoDefaultProps (complete defaults) + geoControls (1:1).
 *
 * Image / brand page. A stylised dotted-grid "map" with glowing market pins +
 * a region legend and an optional adaptive image slot inset. Distinct from any
 * photo page — this is the deck's geographic-reach surface. The map is drawn as
 * an abstract dot field (not a literal country illustration).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-geo .ign-frame{justify-content:space-between}
.ign-geo .b1{width:1300px;height:1000px;right:-220px;top:50%;transform:translateY(-50%);
  background:radial-gradient(48% 50% at 50% 50%,rgba(255,120,52,0.28),rgba(226,42,12,0) 68%);filter:blur(62px)}
.ign-geo .ign-ghost{font-size:480px;left:20px;bottom:-120px}
.ign-geo-body{flex:1;display:grid;grid-template-columns:0.64fr 1.36fr;gap:64px;align-items:center;margin-top:6px}
.ign-geo-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-geo-head h2{font-size:66px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-geo-head h2 .ign-serif{color:var(--ign-a)}
.ign-geo-head p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:380px;text-wrap:pretty}
.ign-geo-reg{margin-top:32px;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--ign-hair)}
.ign-geo-reg .it{display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:baseline;
  padding:15px 0;border-bottom:1px solid var(--ign-hair)}
.ign-geo-reg .it .nm{font-size:25px;font-weight:600}
.ign-geo-reg .it .dot{width:11px;height:11px;border-radius:50%;background:var(--ign-ember);box-shadow:0 0 10px rgba(255,110,46,0.6);align-self:center}
.ign-geo-reg .it .vl{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:28px;letter-spacing:-0.02em}
.ign-geo-map{position:relative}
.ign-geo-map svg{width:100%;height:auto;display:block}
.ign-geo-pin{transform-box:fill-box;transform-origin:center}
.ign-geo-inset{position:absolute;right:0;bottom:0;width:230px;border:1px solid var(--ign-hair2);overflow:hidden;
  box-shadow:0 18px 50px rgba(0,0,0,0.35)}
`;

// abstract dot-field map: dots inside a loose blob mask
function buildDots() {
  const dots = [];
  for (let gx = 0; gx < 30; gx++) {
    for (let gy = 0; gy < 18; gy++) {
      const x = gx / 29, y = gy / 17;
      // loose continental band
      const inland = (y > 0.18 && y < 0.86) &&
        ((x > 0.1 && x < 0.46 && Math.abs(y - 0.5) < 0.34) ||
         (x > 0.46 && x < 0.78 && Math.abs(y - 0.5) < 0.42) ||
         (x > 0.78 && x < 0.9 && Math.abs(y - 0.42) < 0.22));
      if (inland) dots.push([x, y]);
    }
  }
  return dots;
}
const DOTS = buildDots();

export const geoDefaultProps = {
  surface: 'ink',
  regionCount: 4,
  showPins: true,
  showRegionList: true,
  showValues: true,
  showInset: false,
  insetImage: '',
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '◍',
  railText: 'Coverage — 覆盖',
  navItems: ['覆盖'],
  navCurrent: 0,
  ixNo: '46',
  ixLabel: 'Coverage',
  lead: 'Wherever your buyers are.',
  headingHtml: '增长不挑<br><span class="ign-ember-text">地理边界</span>。',
  lede: '同一套引擎，已经在这些市场点亮——区域不同，复利的逻辑一样成立。',
  insetPlaceholder: '现场 · 16:10',
  regions: [
    { nm: '华东', vl: '38%', pins: [[0.62, 0.46, 30], [0.66, 0.52, 18]] },
    { nm: '华南', vl: '24%', pins: [[0.58, 0.66, 24]] },
    { nm: '华北', vl: '21%', pins: [[0.56, 0.30, 22]] },
    { nm: '西部', vl: '11%', pins: [[0.34, 0.44, 16]] },
    { nm: '海外', vl: '6%', pins: [[0.16, 0.36, 13], [0.82, 0.40, 13]] },
  ],
  metaLeft: 'IGNIS — 燃点 · 市场覆盖分布',
  metaMid: '边界之外，依然成立',
};

export const geoControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'regionCount', type: 'slider', label: '区域数量', default: 4, min: 2, max: 5, step: 1, describe: '展示的市场区域数量（同时影响地图上的光点）。' },
  { key: 'showPins', type: 'toggle', label: '市场光点', default: true, describe: '地图上的发光市场光点。' },
  { key: 'showRegionList', type: 'toggle', label: '区域清单', default: true, describe: '左侧的区域占比清单。' },
  { key: 'showValues', type: 'toggle', label: '占比数值', default: true, describe: '区域清单右侧的占比数值。' },
  { key: 'showInset', type: 'toggle', label: '图片插角', default: false, describe: '地图右下角的图片插角（自适应比例）。' },
  { key: 'insetImage', type: 'image', label: '插角图片', default: '', describe: '上传插角图片，按原图比例自适应。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function GeoSlide(props) {
  injectCSS('ign-geo-css', CSS);
  const p = { ...geoDefaultProps, ...props };
  const n = clampInt(p.regionCount, 2, 5);
  const regions = (Array.isArray(p.regions) ? p.regions : []).slice(0, n);
  const W = 780, H = 470;
  const pins = regions.flatMap((r) => r.pins);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-geo">
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

        <div className="ign-geo-body">
          <div className="ign-geo-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showRegionList && (
              <div className="ign-geo-reg">
                {regions.map((r, i) => (
                  <div key={i} className="it">
                    <span className="dot" /><span className="nm">{r.nm}</span>
                    {p.showValues && <EmberText className="vl">{r.vl}</EmberText>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-geo-map ign-a2">
            <svg viewBox={`0 0 ${W} ${H}`}>
              <defs>
                <radialGradient id="ign-geo-pin" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#FFC07A" /><stop offset="0.6" stopColor="#FF6E2E" /><stop offset="1" stopColor="#E22A0C" />
                </radialGradient>
              </defs>
              {DOTS.map(([x, y], i) => (
                <circle key={i} cx={x * W} cy={y * H} r="2.6" fill="var(--ign-hair2)" />
              ))}
              {p.showPins && pins.map(([x, y, r], i) => (
                <g key={i} className="ign-geo-pin">
                  <circle cx={x * W} cy={y * H} r={r} fill="rgba(255,110,46,0.12)" />
                  <circle cx={x * W} cy={y * H} r={r * 0.42} fill="url(#ign-geo-pin)" stroke="#E22A0C" strokeWidth="1" />
                </g>
              ))}
            </svg>
            {p.showInset && (
              <div className="ign-geo-inset">
                <ImageSlot src={p.insetImage || undefined} placeholder={p.insetPlaceholder} mode="ratio" radius={0} />
              </div>
            )}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '56%' }} /></span> 46 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
