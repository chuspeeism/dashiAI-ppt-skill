/* Slide10Contact.jsx — IGNIS deck · closing / call-to-action page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: contactDefaultProps (complete defaults) + contactControls (1:1).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, Brandmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-contact .ign-frame{justify-content:space-between}
.ign-contact .b1{width:1860px;height:900px;left:50%;bottom:-360px;transform:translateX(-50%);
  background:radial-gradient(50% 70% at 50% 100%,rgba(255,150,70,0.55),rgba(255,90,35,0) 64%),
  radial-gradient(70% 90% at 50% 100%,rgba(226,42,12,0.4),rgba(120,20,8,0) 72%);filter:blur(46px)}
.ign-contact .ign-ghost{font-size:300px;right:96px;top:90px}
.ign-contact-mid{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-contact-lede{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:40px;color:var(--ign-a);margin-bottom:22px}
.ign-contact-h{font-size:128px;font-weight:900;line-height:1.02;letter-spacing:-0.035em}
.ign-contact-sub{margin-top:26px;font-size:32px;font-weight:300;color:var(--ign-ink2);max-width:880px;line-height:1.5}
.ign-contact-cta{margin-top:48px;max-width:980px;padding-bottom:26px;border-bottom:2px solid var(--ign-hair2)}
.ign-contact-cta .lab{display:inline-flex;align-items:baseline;gap:24px;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:68px;letter-spacing:-0.025em;line-height:1}
.ign-contact-cta .lab .arw{font-size:50px}
.ign-channels{display:flex;gap:56px;margin-top:40px}
.ign-channel .cl{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-channel .cv{font-family:'Space Grotesk',sans-serif;font-size:32px;margin-top:10px;letter-spacing:-0.01em}
.ign-contact-foot{display:flex;align-items:center;justify-content:space-between;gap:40px}
.ign-partners{display:flex;align-items:center;gap:34px;flex:1}
.ign-partners .tl{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap}
.ign-partner-marks{display:flex;align-items:center;gap:40px}
.ign-partner-marks span{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:27px;letter-spacing:0.04em;color:var(--ign-ink4);white-space:nowrap}
.ign-partner-logos{display:flex;align-items:center;gap:34px}
.ign-contact-mark{display:flex;align-items:center;gap:16px;flex:none}
.ign-contact-mark .wm{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:27px;letter-spacing:0.02em}
.ign-contact-mark .wm em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;color:var(--ign-a)}
`;

const MARKS = ['DAZZ', 'MULTIPLY', 'VOLT', 'DENSIFY'];

export const contactDefaultProps = {
  surface: 'ember',
  showLede: true,
  showSub: true,
  showCta: true,
  showChannels: true,
  channelCount: 3,
  showBigMark: true,
  showGhostMark: true,
  showScaffold: true,
  logoCount: 0,
  logos: [],
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '09',
  railText: "Let's begin — 行动",
  navItems: ['行动'],
  navCurrent: 0,
  ixNo: '09',
  ixLabel: 'Contact',
  lede: "Let's get started.",
  headingHtml: '一起，<span class="ign-ember-text">点燃增长</span>。',
  sub: '把搜索、内容与投放交给一支团队。我们先做一次免费的增长诊断，再谈下一步。',
  ctaText: '预约一次免费增长诊断',
  trustedLabel: 'Trusted by',
  marks: ['DAZZ', 'MULTIPLY', 'VOLT', 'DENSIFY'],
  channels: [
    { l: 'Email', v: 'hello@ignis.cn' },
    { l: 'Phone', v: '400 818 0826' },
    { l: 'Studio', v: '上海 · 北京' },
  ],
};

export const contactControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showLede', type: 'toggle', label: '装饰引言', default: true, describe: '主标题上方的衬线斜体引言。' },
  { key: 'showSub', type: 'toggle', label: '副标题', default: true, describe: '主标题下方的说明副标题。' },
  { key: 'showCta', type: 'toggle', label: '行动召唤', default: true, describe: '排版化的主行动召唤语（大字 + 箭头 + 分隔线）。' },
  { key: 'showChannels', type: 'toggle', label: '联系方式', default: true, describe: '邮箱 / 电话 / 地点等联系信息组。' },
  { key: 'channelCount', type: 'slider', label: '联系方式数量', default: 3, min: 1, max: 3, step: 1, describe: '展示的联系方式条目数量。' },
  { key: 'showBigMark', type: 'toggle', label: '右上品牌标', default: true, describe: '右上角的品牌图标锁定组合。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'logoCount', type: 'slider', label: '合作图片槽', default: 0, min: 0, max: 6, step: 1, describe: '底部合作伙伴图片槽数量；为 0 时回退为文字标识。' },
];

export default function ContactSlide(props) {
  injectCSS('ign-contact-css', CSS);
  const p = { ...contactDefaultProps, ...props };
  const n = clampInt(p.logoCount, 0, 6);
  const logos = Array.isArray(p.logos) ? p.logos : [];
  const cc = clampInt(p.channelCount, 1, 3);
  const channels = (Array.isArray(p.channels) ? p.channels : []).slice(0, cc);
  const marks = Array.isArray(p.marks) ? p.marks : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-contact">
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

        <div className="ign-contact-mid">
          {p.showLede && <div className="ign-contact-lede ign-a1">{p.lede}</div>}
          <h1 className="ign-contact-h ign-a1" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showSub && <div className="ign-contact-sub ign-a2">{p.sub}</div>}
          {p.showCta && (
            <div className="ign-contact-cta ign-a2">
              <EmberText className="lab">{p.ctaText} <span className="arw">↗</span></EmberText>
            </div>
          )}
          {p.showChannels && (
            <div className="ign-channels ign-a3">
              {channels.map((c, i) => (
                <div key={i} className="ign-channel"><div className="cl">{c.l}</div><div className="cv">{c.v}</div></div>
              ))}
            </div>
          )}
        </div>

        <footer className="ign-contact-foot ign-a3">
          <div className="ign-partners">
            <div className="tl">{p.trustedLabel}</div>
            {n > 0
              ? <div className="ign-partner-logos">{Array.from({ length: n }).map((_, i) => (
                  <ImageSlot key={i} src={logos[i]} placeholder={`LOGO ${i + 1}`} mode="height" height={38} fit="contain" />
                ))}</div>
              : <div className="ign-partner-marks">{marks.map((m, i) => <span key={i}>{m}</span>)}</div>}
          </div>
          {p.showBigMark && (
            <div className="ign-contact-mark"><Brandmark size={30} /><div className="wm">IGNIS <em>燃点</em></div></div>
          )}
        </footer>
      </Frame>
    </Slide>
  );
}
