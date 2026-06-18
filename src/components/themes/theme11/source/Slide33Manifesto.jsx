/* Slide33Manifesto.jsx — IGNIS deck · full-bleed manifesto statement page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: manifestoDefaultProps (complete defaults) + manifestoControls (1:1).
 *
 * Quote / statement page. A single oversized declaration fills the frame, with
 * ember accent words. Distinct from the attributed Quote page (mark + avatar +
 * byline) and the numbered Principles list — this is a pure typographic anthem.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS } from './ignBase.jsx';

const CSS = `
.ign-man .ign-frame{justify-content:space-between}
.ign-man .b1{width:1700px;height:1100px;left:50%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(44% 50% at 50% 50%,rgba(255,150,70,0.46),rgba(255,90,35,0) 70%),
  radial-gradient(60% 60% at 50% 55%,rgba(226,42,12,0.34),rgba(120,20,8,0) 74%);filter:blur(54px)}
.ign-man .ign-ghost{font-size:820px;right:-40px;bottom:-260px}
.ign-man-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-man-body.center{align-items:center;text-align:center}
.ign-man-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:25px;
  letter-spacing:0.3em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:34px}
.ign-man-body.center .ign-man-kick{justify-content:center}
.ign-man-kick .tick{width:40px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-man-kick .no{color:var(--ign-a)}
.ign-man-h{font-size:132px;font-weight:900;line-height:0.98;letter-spacing:-0.045em;max-width:1480px}
.ign-man-h .ign-serif{font-weight:800;color:var(--ign-a)}
.ign-man-rule{width:160px;height:3px;background:var(--ign-ember);margin-top:48px;border-radius:2px}
.ign-man-body.center .ign-man-rule{margin-left:auto;margin-right:auto}
.ign-man-foot{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:34px;color:var(--ign-ink2);margin-top:36px;
  max-width:920px;line-height:1.4;text-wrap:pretty}
`;

export const manifestoDefaultProps = {
  surface: 'ember',
  align: 'left',
  showKicker: true,
  showRule: true,
  showFootLine: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↗',
  railText: 'Manifesto — 宣言',
  navItems: ['宣言'],
  navCurrent: 0,
  ixNo: '33',
  ixLabel: 'Manifesto',
  kickerNo: 'Our promise',
  kickerZh: '燃点的承诺',
  headingHtml: '我们不卖<span class="ign-ember-text">流量</span>，<br>我们交付<span class="ign-ember-text">复利</span>。',
  footLine: '把每一次曝光都接到收入上，让增长在停止投放之后，还在继续发生。',
  metaLeft: 'IGNIS — 燃点 · 增长哲学',
  metaMid: '流量会停，复利不会',
};

export const manifestoControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'align', type: 'select', label: '对齐方式', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }], describe: '宣言文字的对齐方式。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '宣言上方的装饰性引导标签。' },
  { key: 'showRule', type: 'toggle', label: '强调短线', default: true, describe: '宣言下方的暖橙强调短线。' },
  { key: 'showFootLine', type: 'toggle', label: '落款句', default: true, describe: '宣言下方的衬线收束句。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ManifestoSlide(props) {
  injectCSS('ign-man-css', CSS);
  const p = { ...manifestoDefaultProps, ...props };
  const center = p.align === 'center';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-man">
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

        <div className={`ign-man-body ${center ? 'center' : ''}`}>
          {p.showKicker && (
            <div className="ign-man-kick ign-a1"><span className="no">{p.kickerNo}</span><span className="tick" /><span>{p.kickerZh}</span></div>
          )}
          <h1 className="ign-man-h ign-a2" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showRule && <div className="ign-man-rule ign-a3" />}
          {p.showFootLine && (
            <div className="ign-man-foot ign-a3">{p.footLine}</div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '40%' }} /></span> 33 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
