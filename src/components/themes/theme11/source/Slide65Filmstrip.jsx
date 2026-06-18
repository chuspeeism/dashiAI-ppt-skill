/* Slide65Filmstrip.jsx — IGNIS deck · horizontal film-strip image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: filmstripDefaultProps (complete defaults) + filmstripControls (1:1).
 *
 * Image page. A single horizontal strip of equal frames with sprocket-hole
 * perforations top and bottom, each frame an image slot with a numbered
 * caption — a story told sequentially. Distinct from Gallery (18, grid),
 * Polaroid (60, scattered) and Mosaic (37, collage) — this is the deck's
 * left-to-right sequence reel. Slots adapt to uploads; empty = striped frames.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-flm .ign-frame{justify-content:space-between}
.ign-flm .b1{width:1300px;height:760px;left:50%;top:58%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.2),rgba(226,42,12,0) 72%);filter:blur(62px)}
.ign-flm .ign-ghost{font-size:520px;right:10px;top:-70px}
.ign-flm-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-flm-head h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-flm-head h2 .ign-serif{color:var(--ign-a)}
.ign-flm-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:300px;line-height:1.4}
.ign-flm-stage{flex:1;display:flex;align-items:center;margin-top:18px}
.ign-flm-reel{width:100%;background:#0E0A08;border-radius:8px;padding:26px 18px;
  box-shadow:0 24px 50px -22px rgba(0,0,0,0.6)}
.ign-slide[data-surface="paper"] .ign-flm-reel{background:#16100C}
.ign-flm-perf{display:flex;gap:0;justify-content:space-between;padding:0 10px}
.ign-flm-perf i{flex:1;max-width:34px;height:16px;margin:0 7px;border-radius:3px;background:rgba(244,238,230,0.14)}
.ign-flm-frames{display:flex;gap:14px;padding:16px 8px}
.ign-flm-frame{flex:1;min-width:0;display:flex;flex-direction:column;gap:0}
.ign-flm-frame .ign-imgslot{width:100%;height:230px;border-radius:3px;border:1px solid rgba(244,238,230,0.16)}
.ign-flm-frame .ign-imgslot img,.ign-flm-frame .ign-imgslot-ph{border-radius:3px}
.ign-flm-cap{display:flex;align-items:baseline;gap:10px;padding:14px 4px 2px}
.ign-flm-cap .no{font-family:'Space Grotesk',sans-serif;font-size:19px;color:var(--ign-a);flex:none}
.ign-flm-cap .tx{font-size:21px;font-weight:300;color:rgba(244,238,230,0.7);line-height:1.25;text-wrap:pretty}
.ign-flm-frame.lead .ign-flm-cap .tx{color:rgba(244,238,230,0.96);font-weight:500}
.ign-flm-frame.lead .ign-imgslot{border-color:#E22A0C}
`;

export const filmstripDefaultProps = {
  surface: 'ink',
  frameCount: 5,
  images: [],
  emphasis: false,
  emphasisIndex: 0,
  showPerf: true,
  showCaptions: true,
  showNote: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '►',
  railText: 'Reel — 序列',
  navItems: ['序列'],
  navCurrent: 0,
  ixNo: '64',
  ixLabel: 'Reel',
  eyebrowNo: '一卷到底',
  eyebrowEn: 'One reel, start to scale',
  headingHtml: '增长不是一帧，<span class="ign-ember-text">是连起来的一卷</span>。',
  noteHtml: '从诊断到复利<br>每一格都接得上一格。',
  frames: [
    { ph: '诊断', tx: '盘清家底，找出漏点' },
    { ph: '搭建', tx: '接入引擎，铺好资产' },
    { ph: '点火', tx: '内容投放，同时起跑' },
    { ph: '复盘', tx: '看板对齐，持续加注' },
    { ph: '复利', tx: '自然滚大，越跑越省' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长序列',
  metaMid: '连起来看，才看得懂',
};

export const filmstripControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'frameCount', type: 'slider', label: '画格数量', default: 5, min: 3, max: 5, step: 1, describe: '胶片画格的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后高亮某一画格的边框与说明。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的画格序号（从 0 起）。' },
  { key: 'showPerf', type: 'toggle', label: '齿孔', default: true, describe: '胶片上下的齿孔装饰。' },
  { key: 'showCaptions', type: 'toggle', label: '画格说明', default: true, describe: '每个画格下方的编号说明。' },
  { key: 'showNote', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function FilmstripSlide(props) {
  injectCSS('ign-flm-css', CSS);
  const p = { ...filmstripDefaultProps, ...props };
  const n = clampInt(p.frameCount, 3, 5);
  const images = Array.isArray(p.images) ? p.images : [];
  const frames = (Array.isArray(p.frames) ? p.frames : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const perfN = n * 3 + 1;

  return (
    <Slide surface={p.surface} className="ign-flm">
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

        <div className="ign-flm-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showNote && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-flm-stage ign-a2">
          <div className="ign-flm-reel">
            {p.showPerf && <div className="ign-flm-perf">{Array.from({ length: perfN }).map((_, i) => <i key={i} />)}</div>}
            <div className="ign-flm-frames">
              {frames.map((f, i) => (
                <div key={i} className={`ign-flm-frame ${p.emphasis && i === emi ? 'lead' : ''}`}>
                  <ImageSlot src={images[i]} placeholder={f.ph} mode="fill" height="100%" radius={3} />
                  {p.showCaptions && (
                    <div className="ign-flm-cap"><span className="no">{String(i + 1).padStart(2, '0')}</span><span className="tx">{f.tx}</span></div>
                  )}
                </div>
              ))}
            </div>
            {p.showPerf && <div className="ign-flm-perf">{Array.from({ length: perfN }).map((_, i) => <i key={i} />)}</div>}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 18 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '78%' }} /></span> 64 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
