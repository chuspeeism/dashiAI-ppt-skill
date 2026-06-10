/* Slide20Showcase.jsx — IGNIS deck · full-bleed image showcase page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: showcaseDefaultProps (complete defaults) + showcaseControls (1:1).
 *
 * Image page (full-bleed). The picture(s) run edge to edge; a corner-anchored
 * scrim carries an editorial plate over them. 0 images → an elegant striped
 * placeholder; 2 images → a split diptych. Distinct from the contained Feature
 * and the multi-up Gallery — here a single image owns the whole frame.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-show .ign-frame{justify-content:flex-end}
.ign-show-media{position:absolute;inset:0;z-index:1;display:flex;gap:0}
.ign-show-media .half{flex:1;position:relative;min-width:0}
.ign-show-media .half + .half{border-left:1px solid rgba(255,180,120,0.28)}
.ign-show-media .ign-imgslot{width:100%;height:100%;border-radius:0}
.ign-show-media .ign-imgslot-ph{border:none;border-radius:0}
.ign-show-scrim{position:absolute;inset:0;z-index:3;pointer-events:none}
.ign-show-scrim.left{background:linear-gradient(78deg,rgba(8,5,4,0.9) 0%,rgba(8,5,4,0.62) 28%,rgba(8,5,4,0) 60%),
  linear-gradient(0deg,rgba(8,5,4,0.78),rgba(8,5,4,0) 46%)}
.ign-show-scrim.right{background:linear-gradient(282deg,rgba(8,5,4,0.9) 0%,rgba(8,5,4,0.62) 28%,rgba(8,5,4,0) 60%),
  linear-gradient(0deg,rgba(8,5,4,0.78),rgba(8,5,4,0) 46%)}
.ign-show .ign-frame{z-index:5}
.ign-show .ign-util{color:#F4EEE6}
.ign-show .ign-wm,.ign-show .ign-nav span.on,.ign-show .ign-ix b{color:#F4EEE6}
.ign-show-plate{max-width:920px;display:flex;flex-direction:column;align-items:flex-start;color:#F8ECE2}
.ign-show-plate.right{margin-left:auto;align-items:flex-end;text-align:right}
.ign-show-tag{display:inline-flex;align-items:center;gap:14px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.2em;text-transform:uppercase;color:rgba(248,236,226,0.72);margin-bottom:24px}
.ign-show-tag .tick{width:30px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-show-plate.right .ign-show-tag .tick{background:linear-gradient(270deg,var(--ign-b),transparent)}
.ign-show-h{font-size:108px;font-weight:900;line-height:0.98;letter-spacing:-0.035em}
.ign-show-cap{font-size:28px;font-weight:300;line-height:1.5;color:rgba(248,236,226,0.78);margin-top:28px;max-width:680px;text-wrap:pretty}
.ign-show-stat{position:absolute;top:150px;z-index:5;display:flex;flex-direction:column;gap:6px}
.ign-show-stat.onright{right:128px;text-align:right;align-items:flex-end}
.ign-show-stat.onleft{left:128px}
.ign-show-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:84px;line-height:0.82;letter-spacing:-0.03em}
.ign-show-stat .l{font-family:'Space Grotesk',sans-serif;font-size:23px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(248,236,226,0.7)}
.ign-show .ign-meta{border-top-color:rgba(248,236,226,0.18);color:rgba(248,236,226,0.62)}
.ign-show .ign-meta .mid{color:rgba(248,236,226,0.8)}
`;

export const showcaseDefaultProps = {
  surface: 'ember',
  imageCount: 1,
  images: [],
  overlayPosition: 'left',
  showCaption: true,
  showOverlayStat: true,
  showTag: true,
  showGhostMark: false,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '案例',
  railText: 'Showcase — 图景',
  navItems: ['图景'],
  navCurrent: 0,
  ixNo: '05',
  ixLabel: 'Showcase',
  placeholderFull: '满铺主图 · FULL-BLEED',
  placeholder1: '主图 01',
  placeholder2: '主图 02',
  statValue: '+182%',
  statLabel: 'Organic traffic · 12mo',
  tagText: '客户案例 · DAZZ 重构',
  headingHtml: '看得见的，<br><span class="ign-ember-text">才算数</span>。',
  caption: '一次彻底的转化重排：把首页、落地页与投放拧成同一条路径，三个月内自然流量与成交同步抬升。',
  metaLeft: 'IGNIS — 燃点 · 案例图景',
  metaMid: '结果，摆出来看',
};

export const showcaseControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '空槽占位与底纹的基调（图片满铺时主要影响占位区）。' },
  { key: 'imageCount', type: 'slider', label: '图片数量', default: 1, min: 0, max: 2, step: 1, describe: '满铺图片槽数量：0 为留白占位，1 为整幅，2 为左右双联。点击画面上的图片区域即可上传/更换。' },
  { key: 'overlayPosition', type: 'select', label: '文字位置', default: 'left',
    options: [{ value: 'left', label: '左下' }, { value: 'right', label: '右下' }], describe: '标题文字版块所在角落。' },
  { key: 'showCaption', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showOverlayStat', type: 'toggle', label: '浮层数字', default: true, describe: '画面一角的大号叠加指标。' },
  { key: 'showTag', type: 'toggle', label: '标签行', default: true, describe: '标题上方的分类标签行。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: false, describe: '角落超大幽灵字符装饰（满铺图片时通常关闭）。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ShowcaseSlide(props) {
  injectCSS('ign-show-css', CSS);
  const p = { ...showcaseDefaultProps, ...props };
  const count = clampInt(p.imageCount, 0, 2);
  const imgs = Array.isArray(p.images) ? p.images : [];
  const right = p.overlayPosition === 'right';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-show">
      <div className="ign-show-media">
        {count === 0 && <div className="half"><ImageSlot mode="fill" placeholder={p.placeholderFull} /></div>}
        {count >= 1 && <div className="half"><ImageSlot src={imgs[0]} mode="fill" placeholder={p.placeholder1} /></div>}
        {count >= 2 && <div className="half"><ImageSlot src={imgs[1]} mode="fill" placeholder={p.placeholder2} /></div>}
      </div>
      <div className={`ign-show-scrim ${right ? 'right' : 'left'}`} />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      {p.showOverlayStat && (
        <div className={`ign-show-stat ${right ? 'onleft' : 'onright'}`}>
          <EmberText className="v">{p.statValue}</EmberText>
          <span className="l">{p.statLabel}</span>
        </div>
      )}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className={`ign-show-plate ${right ? 'right' : ''} ign-a1`}>
          {p.showTag && <div className="ign-show-tag"><span className="tick" />{p.tagText}</div>}
          <h1 className="ign-show-h" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showCaption && <div className="ign-show-cap">{p.caption}</div>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '6%' }} /></span> 5 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
