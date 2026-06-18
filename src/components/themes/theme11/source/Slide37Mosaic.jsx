/* Slide37Mosaic.jsx — IGNIS deck · asymmetric image-mosaic page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: mosaicDefaultProps (complete defaults) + mosaicControls (1:1).
 *
 * Image page. An asymmetric editorial collage: one hero tile + supporting tiles,
 * each an adaptive slot (0–n filled). Distinct from the even Gallery grid and
 * the single Showcase/Feature image — this is a composed, ragged mosaic.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-mos .ign-frame{justify-content:space-between}
.ign-mos .b1{width:1100px;height:1100px;right:-240px;top:-200px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.34),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-mos .ign-ghost{font-size:480px;left:20px;bottom:-120px}
.ign-mos-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-mos-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-mos-head h2{font-size:62px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-mos-head h2 .ign-serif{color:var(--ign-a)}
.ign-mos-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:420px;text-align:right;text-wrap:pretty}
.ign-mos-grid{flex:1;display:grid;gap:18px;margin-top:22px;
  grid-template-columns:1.5fr 1fr 1fr;grid-template-rows:1fr 1fr;
  grid-template-areas:"a a b" "a a c";min-height:0}
.ign-mos-grid.n2{grid-template-areas:"a a b" "a a b"}
.ign-mos-grid.n3{grid-template-areas:"a a b" "a a c"}
.ign-mos-grid.n4{grid-template-columns:1.5fr 1fr 1fr;grid-template-areas:"a a b" "a d c"}
.ign-mos-grid.n5{grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;
  grid-template-areas:"a a b" "a a c" "e d c"}
.ign-mos-cell{position:relative;overflow:hidden;border:1px solid var(--ign-hair);min-height:0}
.ign-mos-cell .ign-imgslot{width:100%;height:100%}
.ign-mos-cell.ca{grid-area:a}.ign-mos-cell.cb{grid-area:b}.ign-mos-cell.cc{grid-area:c}
.ign-mos-cell.cd{grid-area:d}.ign-mos-cell.ce{grid-area:e}
.ign-mos-tag{position:absolute;left:18px;bottom:16px;z-index:2;display:flex;align-items:center;gap:10px;
  font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.06em;color:#F8ECE2;
  text-shadow:0 1px 14px rgba(0,0,0,0.7)}
.ign-mos-tag .no{color:var(--ign-a);font-weight:600}
.ign-mos-cell.ca .ign-mos-tag{font-size:26px}
`;

export const mosaicDefaultProps = {
  surface: 'ember',
  tileCount: 3,
  images: [],
  showTags: true,
  showHead: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '◳',
  railText: 'Mosaic — 影像',
  navItems: ['影像'],
  navCurrent: 0,
  ixNo: '37',
  ixLabel: 'Mosaic',
  lead: 'One look, every surface.',
  headingHtml: '一套视觉，<span class="ign-ember-text">铺满每个触点</span>。',
  lede: '从落地页到广告位到社媒，同一套语言反复出现——认知靠的是一致，不是惊喜。',
  tiles: [
    { area: 'ca', cls: 'ca', ph: '主视觉 · 3:2', no: '01', tag: '品牌主张' },
    { area: 'cb', cls: 'cb', ph: '场景 · 4:3', no: '02', tag: '落地页' },
    { area: 'cc', cls: 'cc', ph: '细节 · 4:3', no: '03', tag: '内容矩阵' },
    { area: 'cd', cls: 'cd', ph: '细节 · 1:1', no: '04', tag: '社媒' },
    { area: 'ce', cls: 'ce', ph: '细节 · 1:1', no: '05', tag: '广告' },
  ],
  metaLeft: 'IGNIS — 燃点 · 全触点视觉拼贴',
  metaMid: '一致，才会被记住',
};

export const mosaicControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'tileCount', type: 'slider', label: '拼贴块数', default: 3, min: 2, max: 5, step: 1, describe: '拼贴的图块数量，每个图块都是可点击上传的图片槽，布局随之自适应。' },
  { key: 'showTags', type: 'toggle', label: '图块标注', default: true, describe: '每个图块左下角的编号标注。' },
  { key: 'showHead', type: 'toggle', label: '标题区', default: true, describe: '顶部标题与说明区域。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function MosaicSlide(props) {
  injectCSS('ign-mos-css', CSS);
  const p = { ...mosaicDefaultProps, ...props };
  const n = clampInt(p.tileCount, 2, 5);
  const tiles = (Array.isArray(p.tiles) ? p.tiles : []).slice(0, n);
  const images = Array.isArray(p.images) ? p.images : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-mos">
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

        {p.showHead && (
          <div className="ign-mos-head ign-a1">
            <div>
              {p.showKicker && <div className="lead">{p.lead}</div>}
              <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            </div>
            {p.showLede && <p>{p.lede}</p>}
          </div>
        )}

        <div className={`ign-mos-grid n${n} ign-a2`}>
          {tiles.map((t, i) => (
            <div key={i} className={`ign-mos-cell ${t.cls}`}>
              <ImageSlot src={images[i]} placeholder={t.ph} mode="fill" fit="cover" radius={0} />
              {p.showTags && <div className="ign-mos-tag"><span className="no">{t.no}</span>{t.tag}</div>}
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '45%' }} /></span> 37 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
