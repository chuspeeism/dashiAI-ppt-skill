/* Slide13Quote.jsx — IGNIS deck · pull-quote / manifesto page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: quoteDefaultProps (complete defaults) + quoteControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-quo .ign-frame{justify-content:space-between}
.ign-quo .b1{width:1500px;height:760px;left:50%;top:48%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.26),rgba(226,42,12,0) 70%);filter:blur(58px)}
.ign-quo .ign-ghost{font-size:680px;right:10px;top:-110px}
.ign-quo-body{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative}
.ign-quo-mark{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;font-size:300px;line-height:0.5;
  color:var(--ign-a);opacity:0.9;height:120px;margin-bottom:18px;user-select:none}
.ign-quo q{quotes:none;font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;font-size:88px;line-height:1.16;
  letter-spacing:-0.01em;display:block;max-width:1340px;text-wrap:pretty}
.ign-quo q .ign-ember-text{font-style:italic}
.ign-quo-attr{display:flex;align-items:center;gap:24px;margin-top:54px;padding-top:30px;border-top:1px solid var(--ign-hair)}
.ign-quo-attr .who .nm{font-size:30px;font-weight:700}
.ign-quo-attr .who .rl{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.1em;color:var(--ign-ink3);margin-top:6px}
.ign-quo-attr .src{margin-left:auto;font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap}
`;

export const quoteDefaultProps = {
  surface: 'ink',
  showMark: true,
  showRule: true,
  showAttribution: true,
  avatarCount: 0,
  avatar: [],
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: false,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '“',
  markGlyph: '“',
  railText: 'Manifesto — 主张',
  navItems: ['主张'],
  navCurrent: 0,
  ixNo: '03',
  ixLabel: 'Manifesto',
  quoteHtml: '我们不投放广告。<br>我们设计<span class="ign-ember-text">增长</span>。',
  attrName: '林越 · Lin Yue',
  attrRole: '创始人 / 燃点 IGNIS',
  attrSrc: "Founder's note",
  avatarPlaceholder: '头像',
  metaLeft: 'IGNIS — 燃点 · 增长主张',
  metaMid: '把曝光做成收入',
};

export const quoteControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showMark', type: 'toggle', label: '引号字符', default: true, describe: '金句上方的超大装饰引号。' },
  { key: 'showAttribution', type: 'toggle', label: '署名区块', default: true, describe: '金句下方的署名与来源行。' },
  { key: 'showRule', type: 'toggle', label: '分隔细线', default: true, describe: '署名上方的分隔细线。' },
  { key: 'avatarCount', type: 'slider', label: '头像图片槽', default: 0, min: 0, max: 1, step: 1, describe: '署名旁的头像图片槽数量（0 或 1），自动裁为圆形。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '顶部导航处的章节标识。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: false, describe: '底部页脚信息与进度条。' },
];

export default function QuoteSlide(props) {
  injectCSS('ign-quo-css', CSS);
  const p = { ...quoteDefaultProps, ...props };
  const avatars = Array.isArray(p.avatar) ? p.avatar : [];
  const showAvatar = clampInt(p.avatarCount, 0, 1) > 0;

  return (
    <Slide surface={p.surface} className="ign-quo">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          {p.showKicker ? <nav className="ign-nav">{(Array.isArray(p.navItems) ? p.navItems : []).map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav> : <span />}
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-quo-body">
          {p.showMark && <div className="ign-quo-mark ign-a1">{p.markGlyph}</div>}
          <q className="ign-a2" dangerouslySetInnerHTML={{ __html: p.quoteHtml }} />
          {p.showAttribution && (
            <div className="ign-quo-attr ign-a3" style={p.showRule ? undefined : { borderTop: 'none', paddingTop: 0 }}>
              {showAvatar && <ImageSlot src={avatars[0]} placeholder={p.avatarPlaceholder} mode="fill" height={84} radius={999} />}
              <div className="who">
                <div className="nm">{p.attrName}</div>
                <div className="rl">{p.attrRole}</div>
              </div>
              <div className="src">{p.attrSrc}</div>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '7%' }} /></span> 6 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
