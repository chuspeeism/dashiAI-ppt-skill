/* Slide42Beat.jsx — IGNIS deck · feature beat (text + image + inline stat) page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: beatDefaultProps (complete defaults) + beatControls (1:1).
 *
 * Regular image/text page. Headline + numbered feature points + one inline stat
 * callout, beside a tall adaptive image slot with an overlaid metric tab.
 * The deck's everyday text+image layout — distinct from Feature/Showcase/Editorial.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-bet .ign-frame{justify-content:space-between}
.ign-bet .b1{width:1100px;height:1100px;left:-220px;bottom:-220px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.32),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-bet .ign-ghost{font-size:480px;right:30px;top:-70px}
.ign-bet-body{flex:1;display:grid;grid-template-columns:1.12fr 0.88fr;gap:80px;align-items:center;margin-top:10px}
.ign-bet-body.flip{direction:rtl}
.ign-bet-body.flip > *{direction:ltr}
.ign-bet-txt h2{font-size:64px;font-weight:900;line-height:1.02;letter-spacing:-0.03em;margin-top:20px}
.ign-bet-txt h2 .ign-serif{color:var(--ign-a);font-weight:400}
.ign-bet-lede{font-size:25px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:560px;text-wrap:pretty}
.ign-bet-points{margin-top:34px;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--ign-hair)}
.ign-bet-pt{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:baseline;padding:20px 0;border-bottom:1px solid var(--ign-hair)}
.ign-bet-pt .nv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:46px;line-height:0.9;letter-spacing:-0.03em;white-space:nowrap}
.ign-bet-pt .tx{font-size:25px;font-weight:600;line-height:1.34}
.ign-bet-pt .tx .sub{display:block;font-size:21px;font-weight:300;color:var(--ign-ink2);margin-top:5px}
.ign-bet-media{position:relative}
.ign-bet-media .ign-imgslot{width:100%}
.ign-bet-tab{position:absolute;left:0;bottom:34px;background:var(--ign-bg);border:1px solid var(--ign-hair2);
  border-left:3px solid;border-image:var(--ign-ember) 1;padding:18px 26px 18px 24px;display:flex;flex-direction:column;gap:4px;
  box-shadow:0 18px 50px rgba(0,0,0,0.3)}
.ign-bet-tab .v{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:48px;line-height:0.9;letter-spacing:-0.03em}
.ign-bet-tab .l{font-size:20px;font-weight:300;letter-spacing:0.04em;color:var(--ign-ink2)}
`;

export const beatDefaultProps = {
  surface: 'ink',
  imageCount: 1,
  images: [],
  imagePosition: 'right',
  pointCount: 3,
  showLede: true,
  showStatTab: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '节拍',
  railText: 'Cadence — 节拍',
  navItems: ['节拍'],
  navCurrent: 0,
  ixNo: '42',
  ixLabel: 'Cadence',
  kickerNo: '工作方式',
  kickerEn: 'How we run',
  headingHtml: '慢一点开始，<br><span class="ign-serif">快很多见效</span>。',
  lede: '我们不追求第一周就放烟花，而是把基础打牢——让后面每一步都踩在前一步的肩膀上。',
  imagePlaceholder: '配图 · 4:5',
  statValue: '×2.4',
  statLabel: '迭代效率 · 对比传统排期',
  points: [
    { nv: '01', tx: '诊断先行', sub: '上手前先把现状量化，不拍脑袋。' },
    { nv: '02', tx: '小步快跑', sub: '每周一次迭代，快速验证、快速纠偏。' },
    { nv: '03', tx: '资产沉淀', sub: '内容与数据留存复用，越跑越省力。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 工作方式',
  metaMid: '打牢地基，再起跳',
};

export const beatControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 1, min: 0, max: 1, step: 1, describe: '配图槽数量；为 0 时正文区扩展为整宽。' },
  { key: 'imagePosition', type: 'select', label: '配图位置', default: 'right',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], describe: '配图相对正文的位置。' },
  { key: 'pointCount', type: 'slider', label: '要点数量', default: 3, min: 2, max: 3, step: 1, describe: '编号要点的数量。' },
  { key: 'showLede', type: 'toggle', label: '导语', default: true, describe: '标题下方的说明段落。' },
  { key: 'showStatTab', type: 'toggle', label: '数据浮签', default: true, describe: '配图上叠加的数据浮签。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function BeatSlide(props) {
  injectCSS('ign-bet-css', CSS);
  const p = { ...beatDefaultProps, ...props };
  const hasImg = clampInt(p.imageCount, 0, 1) > 0;
  const images = Array.isArray(p.images) ? p.images : [];
  const n = clampInt(p.pointCount, 2, 3);
  const points = (Array.isArray(p.points) ? p.points : []).slice(0, n);
  const flip = hasImg && p.imagePosition === 'left';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const Text = (
    <div className="ign-bet-txt">
      {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.kickerNo}</span><span>{p.kickerEn}</span></div>}
      <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
      {p.showLede && <p className="ign-bet-lede">{p.lede}</p>}
      <div className="ign-bet-points">
        {points.map((pt, i) => (
          <div key={i} className="ign-bet-pt">
            <EmberText className="nv">{pt.nv}</EmberText>
            <span className="tx">{pt.tx}<span className="sub">{pt.sub}</span></span>
          </div>
        ))}
      </div>
    </div>
  );

  const Media = hasImg ? (
    <div className="ign-bet-media">
      <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="ratio" radius={6} />
      {p.showStatTab && (
        <div className="ign-bet-tab">
          <EmberText className="v">{p.statValue}</EmberText>
          <span className="l">{p.statLabel}</span>
        </div>
      )}
    </div>
  ) : null;

  return (
    <Slide surface={p.surface} className="ign-bet">
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

        <div className={`ign-bet-body ign-a1 ${hasImg ? (flip ? 'flip' : '') : ''}`}
          style={hasImg ? undefined : { gridTemplateColumns: '1fr', maxWidth: 1200 }}>
          {hasImg && flip ? <>{Media}{Text}</> : <>{Text}{Media}</>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '51%' }} /></span> 42 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
