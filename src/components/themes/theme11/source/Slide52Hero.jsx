/* Slide52Hero.jsx — IGNIS deck · full-bleed hero-image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: heroDefaultProps (complete defaults) + heroControls (1:1).
 *
 * Image page (full bleed). A single edge-to-edge image with a darkening
 * overlay, a bottom-anchored headline and a thin stat strip. Distinct from the
 * split Showcase (20) and the side-by-side Feature (15) — this is the deck's
 * cinematic single-image moment. Image slot adapts to any uploaded picture
 * (object-fit cover); 0 images falls back to a striped placeholder fill.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../unicorn-background.jsx';

const CSS = `
.ign-hero .ign-frame{justify-content:space-between;z-index:6}
.ign-hero-img{position:absolute;inset:0;z-index:0}
.ign-hero-img .ign-imgslot{width:100%;height:100%;border-radius:0}
.ign-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(8,5,3,0.55) 0%,rgba(8,5,3,0.12) 30%,rgba(8,5,3,0.42) 64%,rgba(8,5,3,0.86) 100%)}
.ign-hero-tag{display:inline-flex;align-items:center;gap:14px;font-family:'Space Grotesk',sans-serif;font-size:23px;
  letter-spacing:0.26em;text-transform:uppercase;color:var(--ign-ink2)}
.ign-hero-tag .dot{width:8px;height:8px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 14px var(--ign-b)}
.ign-hero-foot{margin-top:auto}
.ign-hero-foot h2{font-size:104px;font-weight:900;line-height:0.96;letter-spacing:-0.04em;max-width:1280px;text-wrap:balance}
.ign-hero-foot h2 .ign-serif{color:var(--ign-a);font-weight:800}
.ign-hero-sub{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:30px;color:var(--ign-ink2);margin-top:24px;max-width:680px}
.ign-hero-strip{display:flex;gap:0;margin-top:42px;border-top:1px solid var(--ign-hair2);padding-top:26px}
.ign-hero-stat{padding-right:54px}
.ign-hero-stat + .ign-hero-stat{border-left:1px solid var(--ign-hair2);padding-left:54px}
.ign-hero-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:60px;line-height:0.86;letter-spacing:-0.03em}
.ign-hero-stat .l{font-size:23px;font-weight:300;color:var(--ign-ink2);margin-top:12px;letter-spacing:0.02em}
`;

export const heroDefaultProps = {
  surface: 'ember',
  images: [],
  backgroundMode: 'unicorn',
  unicornScene: 'goey',
  showScrim: true,
  showTag: true,
  showSub: true,
  showStrip: true,
  statCount: 3,
  showGhostMark: false,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'IGNIS',
  railText: 'Vision — 主张',
  ixNo: '51',
  ixLabel: 'Vision',
  imagePlaceholder: '满铺主图 · 16:9 横构图',
  tagText: 'Field note',
  headingHtml: '把每一次曝光，<br>都换成 <span class="ign-ember-text">实际增长</span>。',
  sub: '流量是借来的，资产才是自己的——我们帮你把前者沉淀成后者。',
  stats: [
    { v: '×3.8', l: '平均转化率提升' },
    { v: '+182%', l: '12 个月自然流量' },
    { v: '14 天', l: '首次见效周期' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长引擎',
  metaMid: '看得见的曝光，留得住的增长',
};

export const heroControls = [
  UNICORN_BACKGROUND_CONTROL,
  createUnicornSceneControl('goey'),
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showScrim', type: 'toggle', label: '压暗叠层', default: true, describe: '图片上的渐变压暗层，保证文字可读。' },
  { key: 'showTag', type: 'toggle', label: '顶部标签', default: true, describe: '左上角的装饰标签。' },
  { key: 'showSub', type: 'toggle', label: '副标题', default: true, describe: '主标题下方的衬线副标题。' },
  { key: 'showStrip', type: 'toggle', label: '指标条', default: true, describe: '底部的关键指标条。' },
  { key: 'statCount', type: 'slider', label: '指标数量', default: 3, min: 2, max: 3, step: 1, describe: '指标条中的指标数量。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: false, describe: '角落超大幽灵字符装饰（满铺图上默认关闭）。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function HeroSlide(props) {
  injectCSS('ign-hero-css', CSS);
  const p = { ...heroDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const sc = clampInt(p.statCount, 2, 3);
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, sc);
  const useUnicorn = p.backgroundMode === 'unicorn';

  return (
    <Slide surface={p.surface} className="ign-hero">
      <div className="ign-hero-img">
        {useUnicorn
          ? <UnicornBackground scene={p.unicornScene} accent="var(--ign-a,#ffb168)" />
          : <ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="fill" height="100%" radius={0} />}
      </div>
      {p.showScrim && <div className="ign-hero-scrim" />}
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav className="ign-nav">{p.showTag && <span className="ign-hero-tag"><span className="dot" />{p.tagText}</span>}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-hero-foot ign-a1">
          <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showSub && <div className="ign-hero-sub">{p.sub}</div>}
          {p.showStrip && (
            <div className="ign-hero-strip ign-a2">
              {stats.map((s, i) => (
                <div key={i} className="ign-hero-stat">
                  <EmberText className="v">{s.v}</EmberText>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 36 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '62%' }} /></span> 51 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
