/* Slide75Handset.jsx — IGNIS deck · single-handset showcase image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: handsetDefaultProps (complete defaults) + handsetControls (1:1).
 *
 * Image page. One oversized phone mock paired with a column of numbered
 * annotations that call out what each part of the screen does. Distinct from
 * AppFlow (67, a ROW of screens) and Device (32, a browser frame): this is the
 * deck's single hero handset with feature callouts. The screen slot cover-fills
 * the phone; empty falls back to a striped placeholder.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-hns .ign-frame{justify-content:space-between}
.ign-hns .b1{width:1200px;height:980px;left:30%;top:56%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.2),rgba(226,42,12,0) 70%);filter:blur(62px)}
.ign-hns .ign-ghost{font-size:540px;right:-10px;bottom:-160px}
.ign-hns-body{flex:1;display:grid;grid-template-columns:0.92fr 1.08fr;gap:72px;align-items:center;margin-top:6px}
.ign-hns-body.rev{grid-template-columns:1.08fr 0.92fr}
.ign-hns-body.rev .ign-hns-stage{order:2}
.ign-hns-stage{display:flex;align-items:center;justify-content:center;position:relative;height:100%}
.ign-hns-phone{position:relative;width:312px;aspect-ratio:9 / 19.2;border-radius:42px;padding:11px;
  background:linear-gradient(150deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02));
  border:1px solid var(--ign-hair2);box-shadow:0 44px 90px rgba(0,0,0,0.5)}
.ign-hns-screen{position:relative;width:100%;height:100%;border-radius:32px;overflow:hidden;background:var(--ign-panel)}
.ign-hns-screen .ign-imgslot{width:100%;height:100%;border-radius:32px}
.ign-hns-notch{position:absolute;z-index:3;top:16px;left:50%;transform:translateX(-50%);width:96px;height:9px;border-radius:8px;background:rgba(0,0,0,0.5)}
.ign-hns-l .ign-eyebrow{margin-bottom:22px;white-space:nowrap}
.ign-hns-l h2{font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-hns-l h2 .ign-serif{color:var(--ign-a)}
.ign-hns-l p{font-size:23px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:20px;max-width:440px;text-wrap:pretty}
.ign-hns-notes{margin-top:30px;display:flex;flex-direction:column}
.ign-hns-note{display:grid;grid-template-columns:auto 1fr;align-items:baseline;gap:20px;padding:18px 0;border-top:1px solid var(--ign-hair)}
.ign-hns-note .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:24px;letter-spacing:-0.01em;
  width:44px;height:44px;border-radius:50%;border:1px solid var(--ign-hair2);display:flex;align-items:center;justify-content:center;color:var(--ign-ink2)}
.ign-hns-note .bd .t{font-size:26px;font-weight:600;letter-spacing:-0.01em}
.ign-hns-note .bd .d{font-size:20px;font-weight:300;color:var(--ign-ink2);line-height:1.45;margin-top:5px;text-wrap:pretty}
.ign-hns-note.lead .no{border-color:transparent;background:linear-gradient(135deg,#FFC07A,#E22A0C);color:#1B1108}
.ign-hns-note.lead .bd .t{color:transparent;background:linear-gradient(120deg,#FFC07A,#FF6E2E 52%,#E22A0C);-webkit-background-clip:text;background-clip:text}
.ign-hns-note.dim{opacity:0.4}
`;

export const handsetDefaultProps = {
  surface: 'ink',
  images: [],
  imagePosition: 'left',
  annotationCount: 4,
  emphasis: false,
  emphasisIndex: 0,
  showLede: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '▤',
  railText: 'Handset — 主屏',
  navItems: ['主屏'],
  navCurrent: 0,
  ixNo: '74',
  ixLabel: 'Handset',
  imagePlaceholder: '主屏 · 截图',
  eyebrowNo: '产品主屏',
  eyebrowEn: 'The hero screen',
  headingHtml: '一屏之内，<br><span class="ign-ember-text">把转化讲完</span>。',
  lede: '没有第二次机会做第一印象——主屏的每一块都在替转化工作。',
  notes: [
    { t: '三秒说清价值', d: '首屏只讲一件事：为什么是你，现在就买。' },
    { t: '零摩擦下单', d: '把表单砍到一步，犹豫拦在按钮之前。' },
    { t: '会员即时承接', d: '成交当下入会，把一次性变成可复利。' },
    { t: '行为埋点回流', d: '每次点击都回流，喂养下一轮投放与内容。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 产品主屏',
  metaMid: '第一屏，就是全部',
};

export const handsetControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imagePosition', type: 'select', label: '手机位置', default: 'left',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], describe: '手机在版面中的左右位置。' },
  { key: 'annotationCount', type: 'slider', label: '标注数量', default: 4, min: 2, max: 4, step: 1, describe: '右侧功能标注的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条标注，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的标注序号（从 0 起）。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function HandsetSlide(props) {
  injectCSS('ign-hns-css', CSS);
  const p = { ...handsetDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const n = clampInt(p.annotationCount, 2, 4);
  const notes = (Array.isArray(p.notes) ? p.notes : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const rev = p.imagePosition === 'right';

  const stage = (
    <div className="ign-hns-stage">
      <div className="ign-hns-phone">
        <span className="ign-hns-notch" />
        <div className="ign-hns-screen">
          <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="fill" radius={32} />
        </div>
      </div>
    </div>
  );

  const panel = (
    <div className="ign-hns-l ign-a2">
      {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
      <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
      {p.showLede && <p>{p.lede}</p>}
      <div className="ign-hns-notes">
        {notes.map((nt, i) => (
          <div key={i} className={`ign-hns-note ${p.emphasis && i === emi ? 'lead' : ''} ${p.emphasis && i !== emi ? 'dim' : ''}`}>
            <span className="no">{String(i + 1).padStart(2, '0')}</span>
            <div className="bd"><div className="t">{nt.t}</div><div className="d">{nt.d}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Slide surface={p.surface} className="ign-hns">
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

        <div className={`ign-hns-body ign-a1 ${rev ? 'rev' : ''}`}>
          {rev ? <>{panel}{stage}</> : <>{stage}{panel}</>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '90%' }} /></span> 74 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
