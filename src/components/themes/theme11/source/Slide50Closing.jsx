/* Slide50Closing.jsx — IGNIS deck · closing / sign-off page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: closingDefaultProps (complete defaults) + closingControls (1:1).
 *
 * Closing image page. A full-height adaptive image slot on one side, a sign-off
 * statement + typographic contact lines on the other. Distinct from the Cover
 * (01) and the Contact (CTA) page — this is the deck's end-plate / thank-you.
 * Contact reads as typography (no buttons / inputs / UI controls).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cls .ign-frame{justify-content:space-between}
.ign-cls .b1{width:1300px;height:1100px;left:-220px;top:50%;transform:translateY(-50%);
  background:radial-gradient(46% 50% at 40% 50%,rgba(255,140,64,0.42),rgba(255,90,35,0) 70%);filter:blur(56px)}
.ign-cls .ign-ghost{font-size:760px;right:-40px;bottom:-220px}
.ign-cls-body{flex:1;display:grid;grid-template-columns:1.18fr 0.82fr;gap:72px;align-items:center;margin-top:6px}
.ign-cls-body.solo{grid-template-columns:1fr;max-width:1280px}
.ign-cls-body.flip{direction:rtl}
.ign-cls-body.flip > *{direction:ltr}
.ign-cls-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.28em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:26px}
.ign-cls-kick .tick{width:40px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-cls-kick .no{color:var(--ign-a)}
.ign-cls-h{font-size:104px;font-weight:900;line-height:0.96;letter-spacing:-0.04em}
.ign-cls-h .ign-serif{font-weight:400;color:var(--ign-a)}
.ign-cls-sub{font-size:27px;font-weight:300;line-height:1.5;color:var(--ign-ink2);margin-top:28px;max-width:520px;text-wrap:pretty}
.ign-cls-rule{width:160px;height:3px;background:var(--ign-ember);margin:40px 0 32px;border-radius:2px}
.ign-cls-contact{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--ign-hair)}
.ign-cls-cl{display:grid;grid-template-columns:120px 1fr;gap:22px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--ign-hair)}
.ign-cls-cl .k{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-cls-cl .v{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:500;letter-spacing:-0.01em;display:flex;align-items:center;gap:14px}
.ign-cls-cl .v .ar{color:var(--ign-a)}
.ign-cls-media{position:relative;height:100%;min-height:0}
.ign-cls-media .ign-imgslot{height:100%}
.ign-cls-media.ratio .ign-imgslot{height:auto}
.ign-cls-badge{position:absolute;left:24px;top:24px;z-index:2;font-family:'Space Grotesk',sans-serif;font-size:20px;
  letter-spacing:0.2em;text-transform:uppercase;color:#F8ECE2;text-shadow:0 1px 12px rgba(0,0,0,0.7)}
`;

export const closingDefaultProps = {
  surface: 'ink',
  imageCount: 1,
  image: '',
  imagePosition: 'right',
  imageMode: 'fill',
  showSub: true,
  showRule: true,
  showContact: true,
  contactCount: 3,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↗',
  railText: 'Thank you — 谢幕',
  navItems: ['谢幕'],
  navCurrent: 0,
  ixNo: '82',
  ixLabel: 'End',
  kickerEn: 'Thank you',
  kickerZh: '谢谢',
  headingHtml: '一起，<br><span class="ign-serif">把它点燃</span>。',
  sub: '增长不是等来的。准备好了，我们随时可以开始第一次诊断。',
  badge: 'IGNIS · 燃点',
  imagePlaceholderFill: '配图 · 满铺',
  imagePlaceholderRatio: '配图 · 原比例',
  contact: [
    { k: '官网', v: 'ignis.studio', ar: '↗' },
    { k: '邮箱', v: 'hi@ignis.studio', ar: '→' },
    { k: '电话', v: '400-820-1958', ar: '' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长引擎',
  metaMid: '流量会停，复利不会',
};

export const closingControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 1, min: 0, max: 1, step: 1, describe: '配图槽数量；为 0 时谢幕语整宽居中。' },
  { key: 'image', type: 'image', label: '配图上传', default: '', boundCount: 'imageCount', describe: '上传谢幕配图，按原图比例自适应。' },
  { key: 'imagePosition', type: 'select', label: '配图位置', default: 'right',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], describe: '配图相对文字的位置。' },
  { key: 'imageMode', type: 'select', label: '配图填充', default: 'fill',
    options: [{ value: 'fill', label: '满铺裁切' }, { value: 'ratio', label: '原比例' }], describe: '配图的填充方式。' },
  { key: 'showSub', type: 'toggle', label: '谢幕说明', default: true, describe: '谢幕语下方的说明句。' },
  { key: 'showRule', type: 'toggle', label: '强调短线', default: true, describe: '谢幕语下方的暖橙强调短线。' },
  { key: 'showContact', type: 'toggle', label: '联系方式', default: true, describe: '排版化的联系方式清单（非按钮控件）。' },
  { key: 'contactCount', type: 'slider', label: '联系条数', default: 3, min: 1, max: 3, step: 1, describe: '联系方式的条目数量。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '谢幕语上方的装饰引导标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ClosingSlide(props) {
  injectCSS('ign-cls-css', CSS);
  const p = { ...closingDefaultProps, ...props };
  const hasImg = clampInt(p.imageCount, 0, 1) > 0;
  const cc = clampInt(p.contactCount, 1, 3);
  const contact = (Array.isArray(p.contact) ? p.contact : []).slice(0, cc);
  const ratio = p.imageMode === 'ratio';
  const flip = hasImg && p.imagePosition === 'left';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const Text = (
    <div className="ign-cls-txt">
      {p.showKicker && <div className="ign-cls-kick"><span className="no">{p.kickerEn}</span><span className="tick" /><span>{p.kickerZh}</span></div>}
      <h2 className="ign-cls-h" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
      {p.showSub && <p className="ign-cls-sub">{p.sub}</p>}
      {p.showRule && <div className="ign-cls-rule" />}
      {p.showContact && (
        <div className="ign-cls-contact">
          {contact.map((c, i) => (
            <div key={i} className="ign-cls-cl">
              <span className="k">{c.k}</span>
              <span className="v">{c.v}{c.ar && <span className="ar">{c.ar}</span>}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Media = hasImg ? (
    <div className={`ign-cls-media ${ratio ? 'ratio' : ''}`} style={ratio ? undefined : { height: 640 }}>
      <ImageSlot src={p.image || undefined} placeholder={ratio ? p.imagePlaceholderRatio : p.imagePlaceholderFill}
        mode={ratio ? 'ratio' : 'fill'} radius={0} />
      <div className="ign-cls-badge">{p.badge}</div>
    </div>
  ) : null;

  return (
    <Slide surface={p.surface} className="ign-cls">
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

        <div className={`ign-cls-body ign-a1 ${hasImg ? (flip ? 'flip' : '') : 'solo'}`}>
          {hasImg && flip ? <>{Media}{Text}</> : <>{Text}{Media}</>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '100%' }} /></span> 82 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
