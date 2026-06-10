/* Slide15Feature.jsx — IGNIS deck · feature-image showcase page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: featureDefaultProps (complete defaults) + featureControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-feat .ign-frame{justify-content:space-between}
.ign-feat .b1{width:1100px;height:1100px;right:-240px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.28),rgba(226,42,12,0) 68%);filter:blur(56px)}
.ign-feat .ign-ghost{font-size:520px;left:40px;bottom:-110px}
.ign-feat-body{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:84px;align-items:center;margin-top:18px}
.ign-feat-body.flip{direction:rtl}
.ign-feat-body.flip > *{direction:ltr}
.ign-feat-body.solo{grid-template-columns:1fr;max-width:1180px}
.ign-feat-txt h2{font-size:74px;font-weight:900;line-height:1.02;letter-spacing:-0.03em;margin-top:24px}
.ign-feat-txt h2 .ign-serif{color:var(--ign-a)}
.ign-feat-txt p{font-size:28px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:28px;max-width:560px;text-wrap:pretty}
.ign-feat-stats{display:flex;margin-top:40px;border-top:1px solid var(--ign-hair);padding-top:26px}
.ign-feat-stat{padding-right:40px}
.ign-feat-stat + .ign-feat-stat{border-left:1px solid var(--ign-hair);padding-left:40px}
.ign-feat-stat .sv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:52px;line-height:0.9;letter-spacing:-0.03em}
.ign-feat-stat .sl{font-size:24px;font-weight:300;color:var(--ign-ink2);margin-top:10px}
.ign-feat-media{position:relative}
.ign-feat-cap{display:flex;align-items:center;gap:14px;margin-top:20px;font-family:'Space Grotesk',sans-serif;
  font-size:24px;letter-spacing:0.08em;color:var(--ign-ink3)}
.ign-feat-cap .tag{color:var(--ign-a)}
.ign-feat-cap .ln{flex:1;height:1px;background:var(--ign-hair)}
`;

const STATS = [
  { sv: '×3.8', sl: '转化率提升' },
  { sv: '−41%', sl: '获客成本' },
  { sv: '14 天', sl: '首次见效' },
];

export const featureDefaultProps = {
  surface: 'ink',
  imageCount: 1,
  images: [],
  imagePosition: 'right',
  showStats: true,
  statCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showCaption: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '08',
  railText: 'Case — 案例',
  navItems: ['案例'],
  navCurrent: 0,
  ixNo: '08',
  ixLabel: 'Case',
  kickerNo: '案例',
  kickerEn: 'Case study',
  headingHtml: '一个落地页，<br><span class="ign-ember-text">跑赢三家代理</span>。',
  bodyText: '我们重建了客户的主落地页：信息层级、首屏主张、行动路径全部围绕「转化」重写。上线 14 天，自然进线翻倍，单客成本反而下降。',
  imagePlaceholder: '案例主图 · 16:10',
  capTag: '↗ Before / After',
  capText: 'VOLT 落地页改版',
  stats: [
    { sv: '×3.8', sl: '转化率提升' },
    { sv: '−41%', sl: '获客成本' },
    { sv: '14 天', sl: '首次见效' },
  ],
  metaLeft: 'IGNIS — 燃点 · 真实客户案例',
  metaMid: '改版不是换皮，是重排路径',
};

export const featureControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 1, min: 0, max: 1, step: 1, describe: '主图图片槽数量；为 0 时回退为单栏文字版式。' },
  { key: 'imagePosition', type: 'select', label: '图片位置', default: 'right',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], describe: '主图相对文字的位置。' },
  { key: 'showStats', type: 'toggle', label: '指标行', default: true, describe: '正文下方的关键指标行。' },
  { key: 'statCount', type: 'slider', label: '指标数量', default: 3, min: 1, max: 3, step: 1, describe: '关键指标的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一指标，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的指标序号（从 0 起）。' },
  { key: 'showCaption', type: 'toggle', label: '图片说明', default: true, describe: '主图下方的说明标注（有图时）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function FeatureSlide(props) {
  injectCSS('ign-feat-css', CSS);
  const p = { ...featureDefaultProps, ...props };
  const hasImg = clampInt(p.imageCount, 0, 1) > 0;
  const images = Array.isArray(p.images) ? p.images : [];
  const sc = clampInt(p.statCount, 1, 3);
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, sc);
  const emi = clampInt(p.emphasisIndex, 0, sc - 1);
  const flip = hasImg && p.imagePosition === 'left';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const Text = (
    <div className="ign-feat-txt">
      {p.showKicker && <div className="ign-eyebrow ign-a1"><span className="tick" /><span className="no">{p.kickerNo}</span><span>{p.kickerEn}</span></div>}
      <h2 className="ign-a1" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
      <p className="ign-a2">{p.bodyText}</p>
      {p.showStats && (
        <div className="ign-feat-stats ign-a3">
          {stats.map((s, i) => (
            <div key={i} className={`ign-feat-stat ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
              <EmberText className="sv">{s.sv}</EmberText>
              <div className="sl">{s.sl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Media = hasImg ? (
    <div className="ign-feat-media ign-a2">
      <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="ratio" radius={6} />
      {p.showCaption && (
        <div className="ign-feat-cap"><span className="tag">{p.capTag}</span><span className="ln" /><span>{p.capText}</span></div>
      )}
    </div>
  ) : null;

  return (
    <Slide surface={p.surface} className="ign-feat">
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

        <div className={`ign-feat-body ${hasImg ? (flip ? 'flip' : '') : 'solo'}`}>
          {hasImg && flip ? <>{Media}{Text}</> : <>{Text}{Media}</>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '15%' }} /></span> 12 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
