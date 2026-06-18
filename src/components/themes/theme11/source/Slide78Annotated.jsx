/* Slide78Annotated.jsx — IGNIS deck · annotated-screenshot image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: annotatedDefaultProps (complete defaults) + annotatedControls (1:1).
 *
 * Image page. One large landscape screenshot with numbered hotspots pinned at
 * positions over the image, mapped to a legend strip beneath. Distinct from
 * Device (32, browser chrome + side pins) and Handset (75, phone): this is a
 * bare full-bleed screenshot with floating callouts. The slot cover-fills;
 * empty falls back to a striped placeholder so hotspots still read.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-ant .ign-frame{justify-content:space-between}
.ign-ant .b1{width:1300px;height:760px;left:50%;top:54%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.18),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-ant .ign-ghost{font-size:520px;right:-10px;bottom:-150px}
.ign-ant .ign-eyebrow{white-space:nowrap}
.ign-ant-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:22px}
.ign-ant-head h2{font-size:54px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-ant-head h2 .ign-serif{color:var(--ign-a)}
.ign-ant-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:23px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-ant-stage{flex:1;position:relative;margin-top:22px;border-radius:8px;overflow:hidden;border:1px solid var(--ign-hair);min-height:0}
.ign-ant-stage .ign-imgslot{position:absolute;inset:0;width:100%;height:100%;border-radius:8px}
.ign-ant-scrim{position:absolute;inset:0;z-index:2;background:radial-gradient(120% 120% at 50% 40%,rgba(6,5,4,0) 55%,rgba(6,5,4,0.42) 100%)}
.ign-ant-pin{position:absolute;z-index:3;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:22px;
  color:#F6EFE6;background:rgba(8,6,5,0.55);backdrop-filter:blur(5px);border:1px solid rgba(246,239,230,0.4);
  box-shadow:0 6px 20px rgba(0,0,0,0.4)}
.ign-ant-pin.lead{color:#1B1108;background:linear-gradient(135deg,#FFC07A,#E22A0C);border-color:transparent;
  box-shadow:0 0 26px rgba(255,110,46,0.7)}
.ign-ant-pin::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:1px solid rgba(246,239,230,0.22)}
.ign-ant-pin.lead::after{border-color:rgba(226,42,12,0.5)}
.ign-ant-legend{display:grid;gap:24px;margin-top:22px;grid-template-columns:repeat(var(--cols),1fr)}
.ign-ant-li{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:baseline}
.ign-ant-li .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:21px;width:34px;height:34px;border-radius:50%;
  border:1px solid var(--ign-hair2);display:flex;align-items:center;justify-content:center;color:var(--ign-ink2)}
.ign-ant-li.lead .no{border-color:transparent;background:linear-gradient(135deg,#FFC07A,#E22A0C);color:#1B1108}
.ign-ant-li .t{font-size:23px;font-weight:600;letter-spacing:-0.01em}
.ign-ant-li .d{font-size:18px;font-weight:300;color:var(--ign-ink2);line-height:1.4;margin-top:4px;text-wrap:pretty}
.ign-ant-li.dim{opacity:0.42}
`;

export const annotatedDefaultProps = {
  surface: 'ink',
  images: [],
  pinCount: 4,
  emphasis: false,
  emphasisIndex: 0,
  showPins: true,
  showLegend: true,
  showScrim: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '◉',
  railText: 'Annotated — 标注',
  navItems: ['标注'],
  navCurrent: 0,
  ixNo: '77',
  ixLabel: 'Annotated',
  imagePlaceholder: '落地页 / 产品截图',
  eyebrowNo: '逐处拆解',
  eyebrowEn: 'What we changed',
  headingHtml: '一张截图，<span class="ign-ember-text">把每处改动指出来</span>。',
  noteHtml: '编号对应改动点——<br>每一处都对着转化。',
  pins: [
    { x: 16, y: 26, t: '价值主张', d: '首屏一句话锁定意图。' },
    { x: 78, y: 34, t: '社会证明', d: '客户与数据即时建立信任。' },
    { x: 30, y: 72, t: '主行动按钮', d: '高对比、零干扰的唯一出口。' },
    { x: 66, y: 78, t: '风险消解', d: '退款与保障，临门一脚不丢人。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 改动逐处标注',
  metaMid: '改在哪，写在哪',
};

export const annotatedControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'pinCount', type: 'slider', label: '标注数量', default: 4, min: 2, max: 4, step: 1, describe: '图上热点与图例条目的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一标注，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的标注序号（从 0 起）。' },
  { key: 'showPins', type: 'toggle', label: '图上热点', default: true, describe: '叠在截图上的编号热点。' },
  { key: 'showLegend', type: 'toggle', label: '图例条', default: true, describe: '截图下方的编号图例。' },
  { key: 'showScrim', type: 'toggle', label: '压暗叠层', default: true, describe: '截图四周的压暗渐变，提升热点可读性。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function AnnotatedSlide(props) {
  injectCSS('ign-ant-css', CSS);
  const p = { ...annotatedDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const n = clampInt(p.pinCount, 2, 4);
  const pins = (Array.isArray(p.pins) ? p.pins : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-ant">
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

        <div className="ign-ant-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-ant-stage ign-a2">
          <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="fill" radius={8} />
          {p.showScrim && <div className="ign-ant-scrim" />}
          {p.showPins && pins.map((pin, i) => (
            <span key={i} className={`ign-ant-pin ${p.emphasis && i === emi ? 'lead' : ''}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, opacity: (p.emphasis && i !== emi) ? 0.55 : 1 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          ))}
        </div>

        {p.showLegend && (
          <div className="ign-ant-legend ign-a3" style={{ '--cols': n }}>
            {pins.map((pin, i) => (
              <div key={i} className={`ign-ant-li ${p.emphasis && i === emi ? 'lead' : ''} ${p.emphasis && i !== emi ? 'dim' : ''}`}>
                <span className="no">{String(i + 1).padStart(2, '0')}</span>
                <div><div className="t">{pin.t}</div><div className="d">{pin.d}</div></div>
              </div>
            ))}
          </div>
        )}

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 20 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '94%' }} /></span> 77 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
