/* Slide60Polaroid.jsx — IGNIS deck · scattered instant-photo collage page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: polaroidDefaultProps (complete defaults) + polaroidControls (1:1).
 *
 * Image page. 0–4 tilted white-framed "instant photo" cards scattered in a
 * cluster, each with a handwritten serif caption. Distinct from Gallery (18,
 * grid), Mosaic (37, tight asymmetric collage) and Spread (24, offset duo) —
 * this is the deck's loose, tactile snapshot wall. Slots adapt to uploads;
 * 0 images falls back to striped placeholders.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-pol .ign-frame{justify-content:space-between}
.ign-pol .b1{width:1080px;height:780px;right:60px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.22),rgba(226,42,12,0) 72%);filter:blur(60px)}
.ign-pol .ign-ghost{font-size:520px;left:0;bottom:-160px}
.ign-pol-body{flex:1;display:grid;grid-template-columns:0.74fr 1.26fr;gap:48px;align-items:center;margin-top:14px}
.ign-pol-l .ign-eyebrow{margin-bottom:22px}
.ign-pol-l h2{font-size:62px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-pol-l h2 .ign-serif{color:var(--ign-a)}
.ign-pol-l p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:380px;text-wrap:pretty}
.ign-pol-tags{margin-top:30px;display:flex;flex-wrap:wrap;gap:10px 12px}
.ign-pol-tags span{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.06em;color:var(--ign-ink2);
  border:1px solid var(--ign-hair2);border-radius:999px;padding:7px 16px}
.ign-pol-stage{position:relative;height:780px}
.ign-pol-card{position:absolute;background:#FBF7EF;padding:16px 16px 0;border-radius:3px;
  box-shadow:0 24px 50px -18px rgba(20,10,4,0.55),0 2px 0 rgba(255,255,255,0.6) inset}
.ign-slide[data-surface="paper"] .ign-pol-card{background:#FFFDF8}
.ign-pol-card .ign-imgslot{width:100%}
.ign-pol-cap{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:25px;color:#2A1C12;
  padding:16px 4px 18px;line-height:1.2;text-align:center}
.ign-pol-cap b{font-style:normal;font-weight:500;color:#C7401A}
.ign-pol-pin{position:absolute;top:-9px;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#FF8A4A,#C7401A);box-shadow:0 3px 6px rgba(20,10,4,0.4)}
`;

export const polaroidDefaultProps = {
  surface: 'paper',
  imageCount: 4,
  images: [],
  showCaptions: true,
  showPins: true,
  showTags: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '◆',
  railText: 'Field — 现场',
  navItems: ['现场'],
  navCurrent: 0,
  ixNo: '59',
  ixLabel: 'Field',
  eyebrowNo: '现场',
  eyebrowEn: 'From the field',
  headingHtml: '数据之外，<br><span class="ign-ember-text">是真发生的事</span>。',
  lede: '报表会冷掉，现场不会——把这些瞬间钉在墙上，提醒我们增长长什么样。',
  tags: ['门店', '产品', '团队', '后台'],
  photos: [
    { ph: '门店开业', cap: '首店 · 当天售罄', rot: -6, w: 360, x: 2, y: 40, z: 4 },
    { ph: '产品特写', cap: '复购率 ×2.4', rot: 5, w: 320, x: 360, y: 8, z: 3 },
    { ph: '团队现场', cap: '上线第 14 天', rot: -3, w: 300, x: 240, y: 360, z: 5 },
    { ph: '后台数据', cap: '自然进线 +182%', rot: 7, w: 286, x: 612, y: 300, z: 2 },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长现场',
  metaMid: '看得见的增长，才让人信',
};

export const polaroidControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '照片数量', default: 4, min: 0, max: 4, step: 1, describe: '散落宝丽来照片槽数量（0–4）；不足回退条纹占位。' },
  { key: 'showCaptions', type: 'toggle', label: '手写说明', default: true, describe: '每张相纸下方的手写体说明。' },
  { key: 'showPins', type: 'toggle', label: '图钉', default: true, describe: '相纸顶部的图钉装饰。' },
  { key: 'showTags', type: 'toggle', label: '标签行', default: true, describe: '左侧的关键词标签行。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PolaroidSlide(props) {
  injectCSS('ign-pol-css', CSS);
  const p = { ...polaroidDefaultProps, ...props };
  const n = clampInt(p.imageCount, 0, 4);
  const images = Array.isArray(p.images) ? p.images : [];
  const PHOTOS = Array.isArray(p.photos) ? p.photos : [];
  const tags = Array.isArray(p.tags) ? p.tags : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const shown = n > 0 ? PHOTOS.slice(0, n) : PHOTOS.slice(0, 3); // keep a tasteful cluster even at 0

  return (
    <Slide surface={p.surface} className="ign-pol">
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

        <div className="ign-pol-body">
          <div className="ign-pol-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showTags && (
              <div className="ign-pol-tags">
                {tags.map((t, i) => <span key={i}>{t}</span>)}
              </div>
            )}
          </div>

          <div className="ign-pol-stage ign-a2">
            {shown.map((ph, i) => (
              <div key={i} className="ign-pol-card"
                style={{ left: ph.x, top: ph.y, width: ph.w, transform: `rotate(${ph.rot}deg)`, zIndex: ph.z }}>
                {p.showPins && <span className="ign-pol-pin" />}
                <ImageSlot src={n > i ? images[i] : undefined} placeholder={ph.ph} mode="ratio" radius={2} />
                {p.showCaptions && <div className="ign-pol-cap" dangerouslySetInnerHTML={{ __html: ph.cap.replace(/([×+]\S+|售罄)/, '<b>$1</b>') }} />}
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '72%' }} /></span> 59 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
