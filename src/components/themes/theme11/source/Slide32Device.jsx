/* Slide32Device.jsx — IGNIS deck · device-mockup image page with callouts.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: deviceDefaultProps (complete defaults) + deviceControls (1:1).
 *
 * Image page. A browser-window frame holds one adaptive image slot; numbered
 * annotation pins sit on the screenshot and tie to a typographic legend.
 * Distinct from the plain Feature image and the full-bleed Showcase. The frame
 * is a flat bezel (presentation prop), not an interactive UI control.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-dev .ign-frame{justify-content:space-between}
.ign-dev .b1{width:1180px;height:1180px;right:-220px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.3),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-dev .ign-ghost{font-size:480px;left:30px;bottom:-110px}
.ign-dev-body{flex:1;display:grid;grid-template-columns:0.74fr 1.26fr;gap:74px;align-items:center;margin-top:10px}
.ign-dev-body.solo{grid-template-columns:1fr;gap:0;justify-items:center;text-align:center}
.ign-dev-body.solo .ign-dev-txt{max-width:1500px;display:flex;flex-direction:column;align-items:center}
.ign-dev-body.solo .ign-dev-txt .ign-eyebrow{justify-content:center}
.ign-dev-body.solo .ign-dev-txt h2{font-size:92px}
.ign-dev-body.solo .ign-dev-txt p{max-width:780px}
.ign-dev-body.solo .ign-dev-notes{flex-direction:row;justify-content:center;gap:56px;margin-top:52px}
.ign-dev-body.solo .ign-dev-note{flex-direction:column;align-items:center;text-align:center;max-width:280px;gap:14px}
.ign-dev-body.flip{direction:rtl}
.ign-dev-body.flip > *{direction:ltr}
.ign-dev-txt h2{font-size:66px;font-weight:900;line-height:1.02;letter-spacing:-0.03em;margin-top:22px}
.ign-dev-txt h2 .ign-serif{color:var(--ign-a)}
.ign-dev-txt p{font-size:25px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:440px;text-wrap:pretty}
.ign-dev-notes{margin-top:34px;display:flex;flex-direction:column;gap:20px}
.ign-dev-note{display:flex;align-items:flex-start;gap:18px}
.ign-dev-bdg{flex:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:22px;color:#1B1108;background:var(--ign-ember);
  box-shadow:0 0 16px rgba(255,110,46,0.5)}
.ign-dev-note .t{font-size:25px;font-weight:600;line-height:1.3}
.ign-dev-note .t .en{display:block;font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3);margin-top:3px}
.ign-dev-media{position:relative}
.ign-dev-win{border:1px solid var(--ign-hair2);border-radius:10px;overflow:hidden;background:var(--ign-panel)}
.ign-dev-chrome{display:flex;align-items:center;gap:8px;padding:14px 20px;border-bottom:1px solid var(--ign-hair)}
.ign-dev-chrome .dot{width:13px;height:13px;border-radius:50%;background:var(--ign-ink4)}
.ign-dev-chrome .url{margin-left:18px;font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.04em;color:var(--ign-ink3)}
.ign-dev-screen{position:relative}
.ign-dev-pin{position:absolute;width:42px;height:42px;border-radius:50%;transform:translate(-50%,-50%);
  display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;
  color:#1B1108;background:var(--ign-ember);box-shadow:0 0 0 6px rgba(255,110,46,0.18),0 0 22px rgba(255,110,46,0.7);z-index:3}
.ign-dev-cap{display:flex;align-items:center;gap:14px;margin-top:20px;font-family:'Space Grotesk',sans-serif;
  font-size:22px;letter-spacing:0.08em;color:var(--ign-ink3)}
.ign-dev-cap .tag{color:var(--ign-a)}
.ign-dev-cap .ln{flex:1;height:1px;background:var(--ign-hair)}
`;

export const deviceDefaultProps = {
  surface: 'ink',
  imageCount: 1,
  images: [],
  imagePosition: 'right',
  showChrome: true,
  showPins: true,
  pinCount: 3,
  showCaption: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'UI',
  railText: 'Teardown — 拆解',
  navItems: ['拆解'],
  navCurrent: 0,
  ixNo: '32',
  ixLabel: 'Teardown',
  kickerNo: '改版拆解',
  kickerEn: 'Teardown',
  headingHtml: '不是更好看，<br><span class="ign-ember-text">是更会转化</span>。',
  bodyText: '同一个页面，重排信息层级之后的样子——每一处改动，都对着一个转化目标。',
  chromeUrl: 'volt.io / growth',
  imagePlaceholder: '产品截图 · 16:10',
  capTag: '↗ After',
  capText: 'VOLT 落地页 · 重构版',
  pins: [
    { x: 24, y: 30, t: '首屏主张', en: 'Hero promise' },
    { x: 72, y: 52, t: '单一行动路径', en: 'One clear CTA' },
    { x: 38, y: 78, t: '社会证明前置', en: 'Proof up front' },
  ],
  metaLeft: 'IGNIS — 燃点 · 落地页改版拆解',
  metaMid: '每一处改动，都对着转化',
};

export const deviceControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 1, min: 0, max: 1, step: 1, describe: '样机内的截图槽数量；为 0 时显示条纹占位。' },
  { key: 'imagePosition', type: 'select', label: '样机位置', default: 'right',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], describe: '设备样机相对文字的位置。' },
  { key: 'showChrome', type: 'toggle', label: '浏览器外框', default: true, describe: '样机顶部的浏览器窗口外框。' },
  { key: 'showPins', type: 'toggle', label: '标注点', default: true, describe: '截图上的编号标注点与左侧说明清单。' },
  { key: 'pinCount', type: 'slider', label: '标注数量', default: 3, min: 2, max: 3, step: 1, describe: '编号标注点的数量。' },
  { key: 'showCaption', type: 'toggle', label: '图片说明', default: true, describe: '样机下方的说明标注。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function DeviceSlide(props) {
  injectCSS('ign-dev-css', CSS);
  const p = { ...deviceDefaultProps, ...props };
  const hasImg = clampInt(p.imageCount, 0, 1) > 0;
  const images = Array.isArray(p.images) ? p.images : [];
  const pc = clampInt(p.pinCount, 2, 3);
  const pins = (Array.isArray(p.pins) ? p.pins : []).slice(0, pc);
  const flip = p.imagePosition === 'left';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const Text = (
    <div className="ign-dev-txt">
      {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.kickerNo}</span><span>{p.kickerEn}</span></div>}
      <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
      <p>{p.bodyText}</p>
      {p.showPins && (
        <div className="ign-dev-notes">
          {pins.map((pin, i) => (
            <div key={i} className="ign-dev-note">
              <span className="ign-dev-bdg">{i + 1}</span>
              <span className="t">{pin.t}<span className="en">{pin.en}</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Media = (
    <div className="ign-dev-media">
      <div className="ign-dev-win">
        {p.showChrome && (
          <div className="ign-dev-chrome">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="url">{p.chromeUrl}</span>
          </div>
        )}
        <div className="ign-dev-screen">
          <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="ratio" radius={0} />
          {p.showPins && pins.map((pin, i) => (
            <span key={i} className="ign-dev-pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>{i + 1}</span>
          ))}
        </div>
      </div>
      {p.showCaption && (
        <div className="ign-dev-cap"><span className="tag">{p.capTag}</span><span className="ln" /><span>{p.capText}</span></div>
      )}
    </div>
  );

  return (
    <Slide surface={p.surface} className="ign-dev">
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

        <div className={`ign-dev-body ign-a1 ${flip ? 'flip' : ''} ${hasImg ? '' : 'solo'}`}>
          {hasImg ? (flip ? <>{Media}{Text}</> : <>{Text}{Media}</>) : Text}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '39%' }} /></span> 32 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
