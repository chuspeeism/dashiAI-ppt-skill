/* Slide81Plate.jsx — IGNIS deck · framed gallery-plate image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: plateDefaultProps (complete defaults) + plateControls (1:1).
 *
 * Image page. A single hero image presented like an exhibition plate — matted
 * inside a hairline frame, with a centered caption plaque beneath. Distinct
 * from Showcase (20, full-bleed), Feature (15, split) and Cards (55, row):
 * this is the deck's quiet, gallery-style single-image moment with lots of
 * negative space. The slot keeps the image's natural ratio; empty falls back
 * to a striped placeholder.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-plt .ign-frame{justify-content:space-between}
.ign-plt .b1{width:1200px;height:820px;left:50%;top:52%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.16),rgba(226,42,12,0) 72%);filter:blur(64px)}
.ign-plt .ign-ghost{font-size:560px;left:-10px;bottom:-170px}
.ign-plt-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;margin-top:6px}
.ign-plt-mat{position:relative;padding:20px;border:1px solid var(--ign-hair2);border-radius:6px;background:var(--ign-panel);
  width:700px;max-width:62%}
.ign-plt-mat .ign-imgslot{width:100%;max-height:520px;border-radius:3px}
.ign-plt-mat .ign-imgslot img{max-height:520px}
.ign-plt-frameline{position:absolute;inset:9px;border:1px solid var(--ign-hair);border-radius:4px;pointer-events:none}
.ign-plt-plate{display:flex;align-items:center;gap:26px;text-align:center}
.ign-plt-plate .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:24px;letter-spacing:0.04em;color:var(--ign-a)}
.ign-plt-plate .ttl{font-size:30px;font-weight:700;letter-spacing:-0.01em}
.ign-plt-plate .ttl .ign-serif{color:var(--ign-a)}
.ign-plt-plate .meta{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-plt-plate .div{width:1px;height:34px;background:var(--ign-hair2)}
`;

export const plateDefaultProps = {
  surface: 'ink',
  images: [],
  showFrameLine: true,
  showPlate: true,
  showIndex: true,
  showMeta_meta: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '◳',
  railText: 'Plate — 陈列',
  navItems: ['陈列'],
  navCurrent: 0,
  ixNo: '80',
  ixLabel: 'Plate',
  imagePlaceholder: '代表作 · 主视觉',
  plateIndex: '№ 01',
  plateTitleHtml: 'VOLT 电动 · <span class="ign-serif">主视觉重制</span>',
  plateMeta: 'Brand · 2026',
  metaLeft: 'IGNIS — 燃点 · 作品陈列',
  metaMid: '一件作品，留足呼吸',
};

export const plateControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showFrameLine', type: 'toggle', label: '内框线', default: true, describe: '画框内的双重细线。' },
  { key: 'showPlate', type: 'toggle', label: '说明牌', default: true, describe: '图片下方的居中说明牌。' },
  { key: 'showIndex', type: 'toggle', label: '编号', default: true, describe: '说明牌左侧的作品编号。' },
  { key: 'showMeta_meta', type: 'toggle', label: '说明牌副信息', default: true, describe: '说明牌右侧的媒介 / 年份式副信息。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '顶部导航处的章节标识。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PlateSlide(props) {
  injectCSS('ign-plt-css', CSS);
  const p = { ...plateDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-plt">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          {p.showKicker ? <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav> : <span />}
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-plt-body">
          <div className="ign-plt-mat ign-a1">
            <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="ratio" radius={3} />
            {p.showFrameLine && <span className="ign-plt-frameline" />}
          </div>
          {p.showPlate && (
            <div className="ign-plt-plate ign-a2">
              {p.showIndex && <span className="no">{p.plateIndex}</span>}
              {p.showIndex && <span className="div" />}
              <span className="ttl" dangerouslySetInnerHTML={{ __html: p.plateTitleHtml }} />
              {p.showMeta_meta && <span className="div" />}
              {p.showMeta_meta && <span className="meta">{p.plateMeta}</span>}
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '98%' }} /></span> 80 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
