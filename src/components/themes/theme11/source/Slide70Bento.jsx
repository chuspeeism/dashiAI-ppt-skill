/* Slide70Bento.jsx — IGNIS deck · bento-grid image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: bentoDefaultProps (complete defaults) + bentoControls (1:1).
 *
 * Image page. An asymmetric bento of mixed tiles — one hero image, two
 * supporting image slots and two typographic stat tiles — packed edge to edge.
 * Distinct from Gallery (18, even grid), Mosaic (37, tilted collage) and Cards
 * (55, equal row): the bento mixes media and figures at different weights.
 * Image slots cover-fill their tiles; empty slots fall back to striped
 * placeholders so the packing stays solid at any image count.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-bto .ign-frame{justify-content:space-between}
.ign-bto .b1{width:1300px;height:820px;left:42%;top:60%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.18),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-bto .ign-ghost{font-size:520px;right:-10px;bottom:-140px}
.ign-bto .ign-eyebrow{white-space:nowrap}
.ign-bto-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:22px}
.ign-bto-head h2{font-size:54px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-bto-head h2 .ign-serif{color:var(--ign-a)}
.ign-bto-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:23px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-bto-grid{flex:1;display:grid;grid-template-columns:1.32fr 0.84fr 0.84fr;grid-template-rows:1fr 1fr;
  gap:18px;margin-top:24px;
  grid-template-areas:"hero shot stat" "hero kpi band"}
.ign-bto-tile{position:relative;border-radius:8px;overflow:hidden;min-height:0}
.ign-bto-tile.hero{grid-area:hero}
.ign-bto-tile.shot{grid-area:shot}
.ign-bto-tile.band{grid-area:band}
.ign-bto-tile.stat{grid-area:stat}
.ign-bto-tile.kpi{grid-area:kpi}
.ign-bto-img .ign-imgslot{width:100%;height:100%;border-radius:8px}
.ign-bto-tag{position:absolute;z-index:3;left:18px;bottom:16px;display:inline-flex;align-items:center;gap:9px;
  padding:8px 14px;border-radius:999px;background:rgba(8,6,5,0.46);backdrop-filter:blur(6px);
  border:1px solid rgba(246,239,230,0.18);font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:0.06em;color:#F6EFE6}
.ign-bto-tag .d{width:7px;height:7px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 10px var(--ign-b)}
.ign-bto-stat{display:flex;flex-direction:column;justify-content:space-between;padding:26px 24px;
  border:1px solid var(--ign-hair);background:var(--ign-panel)}
.ign-bto-stat.lit{border-color:rgba(226,42,12,0.5);background:linear-gradient(150deg,rgba(255,110,46,0.14),rgba(226,42,12,0.03))}
.ign-bto-stat .k{font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-bto-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:74px;line-height:0.84;letter-spacing:-0.03em}
.ign-bto-stat .v .u{font-size:0.42em;color:var(--ign-ink2);font-weight:400;margin-left:2px}
.ign-bto-stat .c{font-size:19px;font-weight:300;color:var(--ign-ink2);line-height:1.4;text-wrap:pretty}
`;

export const bentoDefaultProps = {
  surface: 'ink',
  images: [],
  showTags: true,
  showStats: true,
  emphasis: false,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '▦',
  railText: 'Bento — 全景',
  navItems: ['全景'],
  navCurrent: 0,
  ixNo: '69',
  ixLabel: 'Bento',
  eyebrowNo: '一屏看全',
  eyebrowEn: 'At a glance',
  headingHtml: '画面与数字，<span class="ign-ember-text">拼成一张全景</span>。',
  noteHtml: '触点、资产、成果——<br>在同一格栅里互相印证。',
  stats: [
    { k: 'Conversion', v: '×3.8', c: '主路径重排后的转化提升' },
    { k: 'Organic', v: '+182', u: '%', c: '12 个月自然进线增量' },
  ],
  shots: ['落地页', '私域承接', '内容资产'],
  metaLeft: 'IGNIS — 燃点 · 增长全景',
  metaMid: '画面会骗人，并排就不会',
};

export const bentoControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showTags', type: 'toggle', label: '图片角标', default: true, describe: '图片格左下角的标签。' },
  { key: 'showStats', type: 'toggle', label: '数据格', default: true, describe: '显示两个排版化数据格（关闭则全部为图片格）。' },
  { key: 'emphasis', type: 'toggle', label: '数据格点亮', default: false, describe: '开启后第一个数据格点亮为暖橙。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function BentoSlide(props) {
  injectCSS('ign-bto-css', CSS);
  const p = { ...bentoDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const STATS = Array.isArray(p.stats) ? p.stats : [];
  const SHOTS = Array.isArray(p.shots) ? p.shots : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const showStats = p.showStats;

  // tiles in fixed grid areas; image tiles indexed 0..2 for the slots
  const imgTile = (area, idx) => (
    <div className={`ign-bto-tile ${area} ign-bto-img`}>
      <ImageSlot src={images[idx]} placeholder={`${SHOTS[idx]} · 配图`} mode="fill" radius={8} />
      {p.showTags && <span className="ign-bto-tag"><span className="d" />{SHOTS[idx]}</span>}
    </div>
  );
  const statTile = (area, s, lit) => (
    <div className={`ign-bto-tile ${area} ign-bto-stat ${lit ? 'lit' : ''}`}>
      <div className="k">{s.k}</div>
      <div className="v">{area === 'stat' && p.emphasis
        ? <EmberText>{s.v}{s.u && <span className="u">{s.u}</span>}</EmberText>
        : <>{s.v}{s.u && <span className="u">{s.u}</span>}</>}</div>
      <div className="c">{s.c}</div>
    </div>
  );

  return (
    <Slide surface={p.surface} className="ign-bto">
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

        <div className="ign-bto-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-bto-grid ign-a2">
          {imgTile('hero', 0)}
          {imgTile('shot', 1)}
          {showStats ? statTile('stat', STATS[0], p.emphasis) : imgTile('stat', 1)}
          {showStats ? statTile('kpi', STATS[1], false) : imgTile('kpi', 2)}
          {imgTile('band', 2)}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 22 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '84%' }} /></span> 69 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
