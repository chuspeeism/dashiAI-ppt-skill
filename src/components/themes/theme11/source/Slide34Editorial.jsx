/* Slide34Editorial.jsx — IGNIS deck · magazine-editorial prose page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: editorialDefaultProps (complete defaults) + editorialControls (1:1).
 *
 * Editorial / image page. A drop-capped multi-column column of prose with an
 * inset pull-quote, beside an adaptive image slot. The deck's prose moment —
 * distinct from every card / chart / table layout.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-edt .ign-frame{justify-content:space-between}
.ign-edt .b1{width:1080px;height:1080px;left:-200px;bottom:-220px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.3),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-edt .ign-ghost{font-size:520px;right:30px;top:-60px}
.ign-edt-body{flex:1;display:grid;grid-template-columns:1.32fr 0.68fr;gap:80px;align-items:center;margin-top:8px}
.ign-edt-body.flip{direction:rtl}
.ign-edt-body.flip > *{direction:ltr}
.ign-edt-body.solo{grid-template-columns:1fr;max-width:1240px}
.ign-edt-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:23px;
  letter-spacing:0.26em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:18px}
.ign-edt-kick .no{color:var(--ign-a)}
.ign-edt-kick .tick{width:30px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-edt h2{font-size:62px;font-weight:900;line-height:1.04;letter-spacing:-0.03em}
.ign-edt h2 .ign-serif{color:var(--ign-a);font-weight:800}
.ign-edt-cols{column-gap:48px;margin-top:34px;font-size:24px;font-weight:300;line-height:1.62;color:var(--ign-ink2);text-wrap:pretty}
.ign-edt-cols p{margin-bottom:18px;break-inside:avoid}
.ign-edt-cols p:last-child{margin-bottom:0}
.ign-edt-cols .cap::first-letter{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:104px;line-height:0.74;
  float:left;margin:8px 16px 0 0;background:var(--ign-ember);-webkit-background-clip:text;background-clip:text;color:transparent}
.ign-edt-pull{border-left:3px solid;border-image:var(--ign-ember) 1;padding-left:26px;margin:30px 0;
  font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:34px;line-height:1.34;color:var(--ign-ink);max-width:560px;text-wrap:pretty}
.ign-edt-by{display:flex;align-items:center;gap:14px;margin-top:30px;font-family:'Space Grotesk',sans-serif;
  font-size:21px;letter-spacing:0.1em;color:var(--ign-ink3)}
.ign-edt-by .ln{width:40px;height:1px;background:var(--ign-hair2)}
.ign-edt-by b{color:var(--ign-ink2);font-weight:500}
.ign-edt-media{position:relative}
.ign-edt-cap{display:flex;align-items:center;gap:12px;margin-top:16px;font-family:'Space Grotesk',sans-serif;
  font-size:20px;letter-spacing:0.08em;color:var(--ign-ink3)}
.ign-edt-cap .tag{color:var(--ign-a)}
`;

export const editorialDefaultProps = {
  surface: 'paper',
  imageCount: 1,
  images: [],
  imagePosition: 'right',
  columnCount: 2,
  showDropCap: true,
  showPullQuote: true,
  showByline: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '札记',
  railText: 'Essay — 观点',
  navItems: ['观点'],
  navCurrent: 0,
  ixNo: '34',
  ixLabel: 'Essay',
  kickerNo: '观点',
  kickerEn: 'The long game',
  headingHtml: '增长不是冲刺，<br><span class="ign-serif">是一场复利</span>。',
  para1: '大多数团队把增长理解成一次次活动：投一波广告、换一版页面、追一个热点。流量来了又走，预算停了就归零，报表上的曲线像心电图——好看，但不持续。',
  pullQuote: '真正的增长，是停止投放之后还在发生的那部分。',
  para2: '我们做的事情相反：把搜索、内容、转化、性能拧成一条能复利的链路。每一次曝光都沉淀成资产，每一处优化都抬高下一次的起点。慢，但是越跑越快。',
  bylineHtml: '燃点增长团队 · <b>策略札记</b>',
  imagePlaceholder: '配图 · 4:5',
  capText: '现场 · 增长复盘会',
  metaLeft: 'IGNIS — 燃点 · 增长札记',
  metaMid: '越跑越快的那种慢',
};

export const editorialControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 1, min: 0, max: 1, step: 1, describe: '配图槽数量；为 0 时正文扩展为单栏满宽。' },
  { key: 'imagePosition', type: 'select', label: '配图位置', default: 'right',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], describe: '配图相对正文的位置。' },
  { key: 'columnCount', type: 'slider', label: '正文栏数', default: 2, min: 1, max: 2, step: 1, describe: '正文的分栏数量。' },
  { key: 'showDropCap', type: 'toggle', label: '首字下沉', default: true, describe: '正文首段的大号首字母装饰。' },
  { key: 'showPullQuote', type: 'toggle', label: '插入金句', default: true, describe: '正文中的衬线引文段落。' },
  { key: 'showByline', type: 'toggle', label: '署名行', default: true, describe: '正文末尾的作者署名。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function EditorialSlide(props) {
  injectCSS('ign-edt-css', CSS);
  const p = { ...editorialDefaultProps, ...props };
  const hasImg = clampInt(p.imageCount, 0, 1) > 0;
  const images = Array.isArray(p.images) ? p.images : [];
  const cols = clampInt(p.columnCount, 1, 2);
  const flip = hasImg && p.imagePosition === 'left';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const Text = (
    <div className="ign-edt-txt">
      {p.showKicker && <div className="ign-edt-kick"><span className="no">{p.kickerNo}</span><span className="tick" /><span>{p.kickerEn}</span></div>}
      <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
      <div className="ign-edt-cols" style={{ columnCount: hasImg ? 1 : cols }}>
        <p className={p.showDropCap ? 'cap' : ''}>{p.para1}</p>
        {p.showPullQuote && (
          <div className="ign-edt-pull">{p.pullQuote}</div>
        )}
        <p>{p.para2}</p>
        {p.showByline && (
          <div className="ign-edt-by"><span className="ln" /><span dangerouslySetInnerHTML={{ __html: p.bylineHtml }} /></div>
        )}
      </div>
    </div>
  );

  const Media = hasImg ? (
    <div className="ign-edt-media">
      <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="ratio" radius={6} />
      {p.showCaption !== false && (
        <div className="ign-edt-cap"><span className="tag">▦</span><span>{p.capText}</span></div>
      )}
    </div>
  ) : null;

  return (
    <Slide surface={p.surface} className="ign-edt">
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

        <div className={`ign-edt-body ign-a1 ${hasImg ? (flip ? 'flip' : '') : 'solo'}`}>
          {hasImg && flip ? <>{Media}{Text}</> : <>{Text}{Media}</>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '41%' }} /></span> 34 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
