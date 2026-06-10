/* Slide66Coda.jsx — IGNIS deck · pre-close coda statement page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: codaDefaultProps (complete defaults) + codaControls (1:1).
 *
 * Quote page. A single emphatic sign-off line that hands the room over to the
 * closing — set as a destination, not a control (oversized type + arrow motif +
 * hairline + small brand signoff). Distinct from Quote (13, attributed), Mani-
 * festo (33, full-bleed declaration) and Voices (48, multi-quote) — this is the
 * deck's last word before the curtain.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS } from './ignBase.jsx';

const CSS = `
.ign-cda .ign-frame{justify-content:space-between}
.ign-cda .b1{width:1500px;height:1040px;left:50%;top:52%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 48% at 50% 50%,rgba(255,120,52,0.3),rgba(255,90,35,0) 70%);filter:blur(72px)}
.ign-cda .ign-ghost{font-size:720px;right:-40px;bottom:-260px}
.ign-cda-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-cda-body.center{align-items:center;text-align:center}
.ign-cda-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.26em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:30px}
.ign-cda-body.center .ign-cda-kick{justify-content:center}
.ign-cda-kick .tick{width:36px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-cda-kick .no{color:var(--ign-a)}
.ign-cda-q{font-size:96px;font-weight:900;line-height:1.04;letter-spacing:-0.035em;max-width:1380px;text-wrap:balance}
.ign-cda-body.center .ign-cda-q{max-width:1480px}
.ign-cda-q .ign-serif{font-weight:400;color:var(--ign-a)}
.ign-cda-arrow{display:inline-block;color:var(--ign-a);transform:translateY(6px)}
.ign-cda-rule{display:flex;align-items:center;gap:22px;margin-top:46px}
.ign-cda-body.center .ign-cda-rule{justify-content:center}
.ign-cda-rule .ln{width:120px;height:1px;background:var(--ign-hair2)}
.ign-cda-rule .sg{font-family:'Space Grotesk',sans-serif;font-size:23px;letter-spacing:0.14em;color:var(--ign-ink2);text-transform:uppercase}
.ign-cda-rule .sg b{color:var(--ign-a);font-weight:500}
`;

export const codaDefaultProps = {
  surface: 'paper',
  align: 'left',
  showKicker: true,
  showArrow: true,
  showRule: true,
  showSignoff: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '→',
  railText: 'Coda — 收束',
  navItems: ['收束'],
  navCurrent: 0,
  ixNo: '65',
  ixLabel: 'Coda',
  kickerNo: '最后一句',
  kickerEn: 'Before we hand it over',
  quoteHtml: '别再为流量<span class="ign-serif">付租金</span>，<br>是时候<span class="ign-ember-text">盖一栋自己的楼</span>',
  arrowGlyph: '→',
  signoffHtml: 'IGNIS <b>燃点</b> · 用数据，点燃增长',
  metaLeft: 'IGNIS — 燃点 · 收束语',
  metaMid: '下一页，见真章',
};

export const codaControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'align', type: 'select', label: '对齐方式', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }], describe: '收束语的对齐方向。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '金句上方的装饰标签。' },
  { key: 'showArrow', type: 'toggle', label: '箭头母题', default: true, describe: '句末的箭头母题。' },
  { key: 'showRule', type: 'toggle', label: '细分隔线', default: true, describe: '金句下方的细分隔线。' },
  { key: 'showSignoff', type: 'toggle', label: '署名', default: true, describe: '分隔线旁的品牌署名。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function CodaSlide(props) {
  injectCSS('ign-cda-css', CSS);
  const p = { ...codaDefaultProps, ...props };
  const center = p.align === 'center';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-cda">
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

        <div className={`ign-cda-body ${center ? 'center' : ''}`}>
          {p.showKicker && (
            <div className="ign-cda-kick ign-a1"><span className="tick" /><span className="no">{p.kickerNo}</span><span>{p.kickerEn}</span></div>
          )}
          <h2 className="ign-cda-q ign-a2">
            <span dangerouslySetInnerHTML={{ __html: p.quoteHtml }} />
            {p.showArrow && <span className="ign-cda-arrow"> {p.arrowGlyph}</span>}
          </h2>
          {p.showRule && (
            <div className="ign-cda-rule ign-a3">
              <span className="ln" />
              {p.showSignoff && <span className="sg" dangerouslySetInnerHTML={{ __html: p.signoffHtml }} />}
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '79%' }} /></span> 65 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
