/* Slide84CoverHero.jsx — IGNIS deck · ALTERNATE COVER B (full-bleed image).
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: coverHeroDefaultProps (complete defaults) + coverHeroControls (1:1).
 *
 * Cover variant. ONE full-bleed image behind a darkening scrim, with the
 * wordmark at top, a status pill, an oversized bottom-anchored title and a
 * thin metric strip. The deck's cinematic photo cover. Image slot adapts to any
 * upload (object-fit cover); 0 images = striped placeholder fill.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cvh{position:absolute;inset:0}
.ign-cvh .ign-frame{justify-content:space-between;z-index:6}
.ign-cvh-img{position:absolute;inset:0;z-index:0}
.ign-cvh-img .ign-imgslot{width:100%;height:100%;border-radius:0}
.ign-cvh-img .ign-imgslot img,.ign-cvh-img .ign-imgslot-ph{border-radius:0}
.ign-cvh-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(8,5,3,0.66) 0%,rgba(8,5,3,0.16) 30%,rgba(8,5,3,0.42) 60%,rgba(8,5,3,0.90) 100%)}
.ign-cvh .ign-grain,.ign-cvh .ign-edge{z-index:2}
.ign-cvh-status{display:inline-flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.18em;text-transform:uppercase;color:rgba(246,239,230,0.86);border:1px solid rgba(246,239,230,0.34);
  border-radius:999px;padding:11px 22px;white-space:nowrap}
.ign-cvh-status .dot{width:8px;height:8px;border-radius:50%;background:#54d17a;box-shadow:0 0 12px #54d17a}
.ign-cvh-foot{margin-top:auto}
.ign-cvh-lede{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:40px;color:var(--ign-a);margin-bottom:18px}
.ign-cvh-h{font-size:170px;font-weight:900;line-height:0.92;letter-spacing:-0.045em;color:#F7F0E7}
.ign-cvh-h .row{display:block;white-space:nowrap}
.ign-cvh-h em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400}
.ign-cvh-sub{margin-top:26px;font-size:34px;font-weight:300;color:rgba(246,239,230,0.78)}
.ign-cvh-strip{display:flex;gap:0;margin-top:40px;border-top:1px solid rgba(246,239,230,0.26);padding-top:26px}
.ign-cvh-stat{padding-right:54px}
.ign-cvh-stat + .ign-cvh-stat{border-left:1px solid rgba(246,239,230,0.26);padding-left:54px}
.ign-cvh-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:58px;line-height:0.86;letter-spacing:-0.03em;color:#F7F0E7}
.ign-cvh-stat .l{font-size:24px;font-weight:300;color:rgba(246,239,230,0.74);margin-top:12px;letter-spacing:0.02em}
.ign-cvh .ign-util,.ign-cvh .ign-wm,.ign-cvh .ign-ix{color:#F7F0E7}
.ign-cvh .ign-ix{color:rgba(246,239,230,0.7)}
.ign-cvh .ign-ix b{color:var(--ign-a)}
`;

export const coverHeroDefaultProps = {
  surface: 'ink',
  images: [],
  showScrim: true,
  showStatus: true,
  showLede: true,
  showSub: true,
  showStrip: true,
  statCount: 3,
  showGhostMark: false,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  imagePlaceholder: '封面满铺主图 · 16:9 横构图',
  statusText: '现接受 2026 Q3 合作',
  deckLabel: 'CAPABILITIES DECK',
  deckYear: '2026',
  ghostMark: 'IGNIS',
  lede: 'Rank higher, convert better.',
  headlineHtml: '<span class="row">排名更高，</span><span class="row">转化<em>更强</em>。</span>',
  sub: '把搜索、内容与投放，拧成一股力。',
  stats: [
    { v: '×3.8', l: '平均转化率提升' },
    { v: '+182%', l: '12 个月自然流量' },
    { v: '14 天', l: '首次见效周期' },
  ],
};

export const coverHeroControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showScrim', type: 'toggle', label: '压暗叠层', default: true, describe: '图片上的渐变压暗层，保证文字可读。' },
  { key: 'showStatus', type: 'toggle', label: '状态胶囊', default: true, describe: '顶部的接单状态胶囊。' },
  { key: 'showLede', type: 'toggle', label: '衬线引言', default: true, describe: '主标题上方的衬线斜体引言。' },
  { key: 'showSub', type: 'toggle', label: '副标题', default: true, describe: '主标题下方的副标题。' },
  { key: 'showStrip', type: 'toggle', label: '指标条', default: true, describe: '底部的关键指标条。' },
  { key: 'statCount', type: 'slider', label: '指标数量', default: 3, min: 2, max: 3, step: 1, describe: '指标条中的指标数量。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: false, describe: '角落超大幽灵字符装饰（满铺图上默认关闭）。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function CoverHeroSlide(props) {
  injectCSS('ign-cvh-css', CSS);
  const p = { ...coverHeroDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, clampInt(p.statCount, 2, 3));

  return (
    <Slide surface={p.surface} className="ign-cvh">
      <div className="ign-cvh-img">
        <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="fill" height="100%" radius={0} />
      </div>
      {p.showScrim && <div className="ign-cvh-scrim" />}
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>AI Growth Engine — 燃点</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav>{p.showStatus && <span className="ign-cvh-status"><span className="dot" />{p.statusText}</span>}</nav>
          <div className="ign-ix">{p.deckLabel} · <b>{p.deckYear}</b></div>
        </header>

        <div className="ign-cvh-foot ign-a1">
          {p.showLede && <div className="ign-cvh-lede">{p.lede}</div>}
          <h1 className="ign-cvh-h" dangerouslySetInnerHTML={{ __html: p.headlineHtml }} />
          {p.showSub && <div className="ign-cvh-sub ign-a2">{p.sub}</div>}
          {p.showStrip && (
            <div className="ign-cvh-strip ign-a2">
              {stats.map((s, i) => (
                <div key={i} className="ign-cvh-stat"><EmberText className="v">{s.v}</EmberText><div className="l">{s.l}</div></div>
              ))}
            </div>
          )}
        </div>
      </Frame>
    </Slide>
  );
}
