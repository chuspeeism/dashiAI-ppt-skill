/* Slide01Cover.jsx — IGNIS deck · cover page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: coverDefaultProps (complete defaults) + coverControls (1:1 with props).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cover .ign-frame{justify-content:space-between}
.ign-cover .b1{width:1640px;height:1060px;left:50%;top:53%;transform:translate(-50%,-50%);
  background:radial-gradient(42% 50% at 50% 50%,rgba(255,150,70,0.5),rgba(255,90,35,0) 70%),
  radial-gradient(60% 64% at 50% 56%,rgba(226,42,12,0.4),rgba(120,20,8,0) 72%);filter:blur(40px)}
.ign-cover .b2{width:720px;height:280px;left:50%;top:51%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,196,122,0.5),rgba(255,150,70,0) 72%);filter:blur(46px)}
.ign-cover-mid{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transform:translateY(-2px)}
.ign-status{display:flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--ign-ink2);border:1px solid var(--ign-hair2);border-radius:999px;padding:11px 22px;margin-bottom:30px;white-space:nowrap}
.ign-status .dot{width:8px;height:8px;border-radius:50%;background:#54d17a;box-shadow:0 0 12px #54d17a}
.ign-lede{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:40px;color:var(--ign-a);margin-bottom:24px;white-space:nowrap}
.ign-cover-h{font-size:140px;font-weight:900;line-height:1.18;letter-spacing:-0.035em;text-align:center}
.ign-cover-h .row{display:block;white-space:nowrap}
.ign-cover-sub{margin-top:30px;font-size:34px;font-weight:300;color:var(--ign-ink2);white-space:nowrap}
.ign-cover-stats{display:flex;gap:48px;margin-top:34px}
.ign-cover-stats .cs{display:flex;align-items:baseline;gap:12px}
.ign-cover-stats .cs .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:34px;letter-spacing:-0.01em}
.ign-cover-stats .cs .l{font-size:24px;color:var(--ign-ink3);font-family:'Space Grotesk',sans-serif;letter-spacing:0.12em;text-transform:uppercase}
.ign-trusted{display:flex;align-items:center;gap:40px}
.ign-trusted .tl{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap}
.ign-marks{display:flex;align-items:center;gap:46px;flex:1}
.ign-marks span{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:27px;letter-spacing:0.04em;color:var(--ign-ink4);white-space:nowrap}
.ign-marks span em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800}
.ign-logos{display:flex;align-items:center;gap:34px;flex:1}
`;

export const coverDefaultProps = {
  surface: 'ink',
  showNav: true,
  showKicker: true,
  showStats: true,
  showGhostMark: true,
  showScaffold: true,
  logoCount: 0,
  logos: [],
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'IG',
  deckLabel: 'CAPABILITIES DECK',
  deckYear: '2026',
  navItems: ['封面', '方法', '实证', '成果'],
  navCurrent: 0,
  statusText: '现接受 2026 Q3 增长合作',
  lede: 'Rank higher, convert better.',
  headlineHtml: '<span class="row">排名<span class="ign-ember-text">更高</span></span><span class="row">转化<span class="ign-ember-text">更强</span></span>',
  subHtml: '把搜索、内容与投放，拧成<span class="ign-serif" style="color:var(--ign-ink)"> one </span>股力。',
  stats: [
    { v: '2,400+', l: 'Brands served' },
    { v: '3.8×', l: 'Conversion lift' },
    { v: '14d', l: 'Time to impact' },
  ],
  trustedLabel: 'Trusted by',
  marks: [['DAZZ', '.'], ['MULTIPLY'], ['CLOUDBOLT'], ['VOLT'], ['CAYO', 'soft'], ['DENSIFY']],
  pageRange: '↓ 01 — 18',
};

export const coverControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showNav', type: 'toggle', label: '章节导航', default: true, describe: '顶部章节面包屑导航的显示与隐藏。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '状态胶囊 + 衬线斜体引言等装饰性文案。' },
  { key: 'showStats', type: 'toggle', label: '关键指标行', default: true, describe: '主标题下方的三组关键数字。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落的超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'logoCount', type: 'slider', label: '图片槽数量', default: 0, min: 0, max: 6, step: 1,
    describe: '底部图片槽（Logo 墙）的数量；为 0 时回退为文字标识。' },
];

export default function CoverSlide(props) {
  injectCSS('ign-cover-css', CSS);
  const p = { ...coverDefaultProps, ...props };
  const n = clampInt(p.logoCount, 0, 6);
  const logos = Array.isArray(p.logos) ? p.logos : [];
  const marks = Array.isArray(p.marks) ? p.marks : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-cover">
      <span className="ign-bloom b1" /><span className="ign-bloom b2" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost style={{ fontSize: 300, right: 96, bottom: 88 }}>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>AI Growth Engine — 燃点</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          {p.showNav
            ? <nav className="ign-nav">{nav.map((it, i) => (
                <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
              ))}</nav>
            : <span />}
          <div className="ign-ix">{p.deckLabel} · <b>{p.deckYear}</b></div>
        </header>

        <div className="ign-cover-mid">
          {p.showKicker && <div className="ign-status ign-a1"><span className="dot" />{p.statusText}</div>}
          {p.showKicker && <div className="ign-lede ign-a1">{p.lede}</div>}
          <h1 className="ign-cover-h ign-a2" dangerouslySetInnerHTML={{ __html: p.headlineHtml }} />
          <div className="ign-cover-sub ign-a3" dangerouslySetInnerHTML={{ __html: p.subHtml }} />
          {p.showStats && (
            <div className="ign-cover-stats ign-a3">
              {(Array.isArray(p.stats) ? p.stats : []).map((s, i) => (
                <div key={i} className="cs"><EmberText className="v">{s.v}</EmberText><span className="l">{s.l}</span></div>
              ))}
            </div>
          )}
        </div>

        <footer className="ign-trusted ign-a3">
          <div className="tl">{p.trustedLabel}</div>
          {n > 0
            ? <div className="ign-logos">{Array.from({ length: n }).map((_, i) => (
                <ImageSlot key={i} src={logos[i]} placeholder={`LOGO ${i + 1}`} mode="height" height={40} fit="contain" />
              ))}</div>
            : <div className="ign-marks">{marks.map((m, i) => <span key={i}>{m[0]}{m[1] && <em>{m[1]}</em>}</span>)}</div>}
          <div className="tl" style={{ color: 'var(--ign-ink2)' }}>{p.pageRange}</div>
        </footer>
      </Frame>
    </Slide>
  );
}
