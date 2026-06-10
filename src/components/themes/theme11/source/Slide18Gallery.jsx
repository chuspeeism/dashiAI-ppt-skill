/* Slide18Gallery.jsx — IGNIS deck · case-study image-gallery page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: galleryDefaultProps (complete defaults) + galleryControls (1:1).
 * Image slots are adjustable 0–4; the grid layout adapts to keep composition tidy.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-gal .ign-frame{justify-content:space-between}
.ign-gal .b1{width:1200px;height:760px;left:50%;bottom:-260px;transform:translateX(-50%);
  background:radial-gradient(50% 70% at 50% 100%,rgba(255,130,58,0.34),rgba(255,90,35,0) 66%);filter:blur(50px)}
.ign-gal .ign-ghost{font-size:520px;right:40px;top:-80px}
.ign-gal-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:30px;gap:48px}
.ign-gal-head h2{font-size:64px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-gal-head h2 .ign-serif{color:var(--ign-a)}
.ign-gal-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);max-width:360px;text-align:right;line-height:1.4}
.ign-gal-grid{flex:1;display:grid;gap:26px;margin-top:28px;min-height:0}
.ign-gal-grid.n1{grid-template-columns:1fr}
.ign-gal-grid.n2{grid-template-columns:1fr 1fr}
.ign-gal-grid.n3{grid-template-columns:1.4fr 1fr;grid-template-rows:1fr 1fr}
.ign-gal-grid.n3 .cell:first-child{grid-row:1 / span 2}
.ign-gal-grid.n4{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.ign-gal-cell{position:relative;display:flex;flex-direction:column;min-height:0}
.ign-gal-cell .slot{flex:1;min-height:0}
.ign-gal-cell .slot .ign-imgslot{width:100%;height:100%;aspect-ratio:auto}
.ign-gal-cap{display:flex;align-items:center;gap:12px;margin-top:14px;font-family:'Space Grotesk',sans-serif;
  font-size:24px;letter-spacing:0.06em;color:var(--ign-ink3)}
.ign-gal-cap .no{color:var(--ign-a)}
.ign-gal-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
  border:1px solid var(--ign-hair);border-radius:6px;margin-top:28px;
  background:repeating-linear-gradient(135deg,var(--ign-panel) 0 12px,transparent 12px 24px)}
.ign-gal-empty .big{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:52px;color:var(--ign-ink2)}
.ign-gal-empty .hint{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.12em;color:var(--ign-ink3);margin-top:16px}
`;

export const galleryDefaultProps = {
  surface: 'ink',
  imageCount: 3,
  images: [],
  showCaptions: true,
  showHeadline: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'WORK',
  railText: 'Gallery — 作品',
  navItems: ['作品'],
  navCurrent: 0,
  ixNo: '16',
  ixLabel: 'Gallery',
  headingHtml: '把结果，<span class="ign-ember-text">摆出来看</span>。',
  noteHtml: '作品会说话，<br>增长更会。',
  emptyTitle: '案例画廊',
  emptyHint: '上传作品图片以填充 · 支持 1–4 张',
  caps: [
    { no: 'VOLT', t: '落地页改版' },
    { no: 'CAYO', t: '搜索增长' },
    { no: 'DAZZ', t: '内容矩阵' },
    { no: 'DENSIFY', t: '投放重构' },
  ],
  metaLeft: 'IGNIS — 燃点 · 精选作品',
  metaMid: '少即是多，结果即代表作',
};

export const galleryControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 3, min: 0, max: 4, step: 1, describe: '画廊图片槽数量（0–4）；版式随数量自适应，为 0 时回退为留白引导。' },
  { key: 'showCaptions', type: 'toggle', label: '图片说明', default: true, describe: '每张图片下方的客户标注。' },
  { key: 'showHeadline', type: 'toggle', label: '标题', default: true, describe: '页面主标题的显示与隐藏。' },
  { key: 'showKicker', type: 'toggle', label: '装饰注释', default: true, describe: '标题旁的衬线注释文案。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function GallerySlide(props) {
  injectCSS('ign-gal-css', CSS);
  const p = { ...galleryDefaultProps, ...props };
  const n = clampInt(p.imageCount, 0, 4);
  const images = Array.isArray(p.images) ? p.images : [];
  const caps = Array.isArray(p.caps) ? p.caps : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-gal">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <div className="ign-lock"><div className="ign-wm">IGNIS <em>燃点</em></div></div>
          <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-gal-head ign-a1">
          {p.showHeadline ? <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} /> : <div />}
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        {n === 0 ? (
          <div className="ign-gal-empty ign-a2">
            <div className="big">{p.emptyTitle}</div>
            <div className="hint">{p.emptyHint}</div>
          </div>
        ) : (
          <div className={`ign-gal-grid ign-a2 n${n}`}>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="ign-gal-cell">
                <div className="slot"><ImageSlot src={images[i]} placeholder={`作品 ${i + 1}`} mode="fill" radius={6} /></div>
                {p.showCaptions && caps[i] && (
                  <div className="ign-gal-cap"><span className="no">{caps[i].no}</span><span>· {caps[i].t}</span></div>
                )}
              </div>
            ))}
          </div>
        )}

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 24 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '30%' }} /></span> 25 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
