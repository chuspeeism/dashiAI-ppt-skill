/* Slide58Shift.jsx — IGNIS deck · before/after full-bleed diptych image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: shiftDefaultProps (complete defaults) + shiftControls (1:1).
 *
 * Image page. Two full-height image panels (before / after) meet at a center
 * seam with corner labels and a bottom result strip. Distinct from Showcase
 * (20, text-overlay duplex) and Spread (24, collage) — this is the deck's clean
 * redesign diptych. Slots adapt to uploads (object-fit cover); 0 images falls
 * back to striped placeholder panels.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-ba .ign-frame{justify-content:space-between}
.ign-ba .b1{width:1100px;height:760px;left:50%;top:54%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.2),rgba(226,42,12,0) 72%);filter:blur(60px)}
.ign-ba .ign-ghost{font-size:520px;right:20px;top:-60px}
.ign-ba-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-ba-head h2{font-size:56px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-ba-head h2 .ign-serif{color:var(--ign-a)}
.ign-ba-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-ba-stage{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:24px;position:relative;min-height:0}
.ign-ba-panel{position:relative;overflow:hidden}
.ign-ba-panel .ign-imgslot{width:100%;height:100%;border-radius:0}
.ign-ba-panel.before{border-radius:6px 0 0 6px}
.ign-ba-panel.before .ign-imgslot,.ign-ba-panel.before .ign-imgslot img,.ign-ba-panel.before .ign-imgslot-ph{border-radius:6px 0 0 6px}
.ign-ba-panel.after{border-radius:0 6px 6px 0}
.ign-ba-panel.after .ign-imgslot,.ign-ba-panel.after .ign-imgslot img,.ign-ba-panel.after .ign-imgslot-ph{border-radius:0 6px 6px 0}
.ign-ba-chip{position:absolute;top:22px;left:22px;z-index:3;display:inline-flex;align-items:center;gap:10px;
  font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.16em;text-transform:uppercase;
  color:var(--ign-ink);background:rgba(8,5,3,0.5);backdrop-filter:blur(3px);padding:9px 16px;border-radius:3px}
.ign-ba-panel.after .ign-ba-chip{color:#1B1108;background:linear-gradient(120deg,#FFC07A,#FF6E2E)}
.ign-ba-cap{position:absolute;left:22px;bottom:20px;z-index:3;font-size:23px;font-weight:300;color:var(--ign-ink2);
  background:linear-gradient(0deg,rgba(8,5,3,0.55),transparent);padding:30px 16px 4px;left:0;right:0;bottom:0}
.ign-ba-seam{position:absolute;left:50%;top:0;bottom:0;width:0;z-index:4;transform:translateX(-50%);
  display:flex;align-items:center;justify-content:center;pointer-events:none}
.ign-ba-seam .badge{flex:none;width:62px;height:62px;border-radius:50%;background:var(--ign-bg);border:1px solid var(--ign-hair2);
  display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-size:30px;color:var(--ign-a)}
.ign-ba-strip{display:flex;gap:0;margin-top:24px;border-top:1px solid var(--ign-hair2);padding-top:22px}
.ign-ba-stat{padding-right:48px}
.ign-ba-stat + .ign-ba-stat{border-left:1px solid var(--ign-hair2);padding-left:48px}
.ign-ba-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:50px;line-height:0.86;letter-spacing:-0.03em}
.ign-ba-stat .l{font-size:22px;font-weight:300;color:var(--ign-ink2);margin-top:10px}
`;

export const shiftDefaultProps = {
  surface: 'paper',
  images: [],
  showLabels: true,
  showCaptions: true,
  showSeam: true,
  showStrip: true,
  statCount: 3,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↔',
  railText: 'Before · After',
  navItems: ['蜕变'],
  navCurrent: 0,
  ixNo: '57',
  ixLabel: 'Redesign',
  eyebrowNo: '改版前后',
  eyebrowEn: 'Same page, rebuilt',
  headingHtml: '不是换皮，<span class="ign-ember-text">是重排路径</span>。',
  noteHtml: 'VOLT 电动 · 主落地页<br>同一份流量，两种结果。',
  beforePlaceholder: '改版前截图',
  afterPlaceholder: '改版后截图',
  beforeChip: '改版前 · Before',
  afterChip: '改版后 · After',
  beforeCap: '信息堆叠、行动模糊，跳出率高。',
  afterCap: '层级清晰、主张前置，路径直达转化。',
  seamGlyph: '→',
  stats: [
    { v: '×3.8', l: '转化率' },
    { v: '+182%', l: '自然进线' },
    { v: '14 天', l: '见效周期' },
  ],
  metaLeft: 'IGNIS — 燃点 · 落地页改版',
  metaMid: '改对地方，数字自己会说话',
};

export const shiftControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showLabels', type: 'toggle', label: '前后标签', default: true, describe: '面板左上角的「改版前 / 改版后」标签。' },
  { key: 'showCaptions', type: 'toggle', label: '面板说明', default: true, describe: '面板底部的说明文案。' },
  { key: 'showSeam', type: 'toggle', label: '中缝徽标', default: true, describe: '两幅图中缝的箭头徽标。' },
  { key: 'showStrip', type: 'toggle', label: '成果条', default: true, describe: '底部的成果指标条。' },
  { key: 'statCount', type: 'slider', label: '成果数量', default: 3, min: 1, max: 3, step: 1, describe: '成果条中的指标数量。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ShiftSlide(props) {
  injectCSS('ign-ba-css', CSS);
  const p = { ...shiftDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const sc = clampInt(p.statCount, 1, 3);
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, sc);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-ba">
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

        <div className="ign-ba-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-ba-stage ign-a2">
          <div className="ign-ba-panel before">
            <ImageSlot src={images[0]} placeholder={p.beforePlaceholder} mode="fill" height="100%" radius={0} />
            {p.showLabels && <span className="ign-ba-chip">{p.beforeChip}</span>}
            {p.showCaptions && <div className="ign-ba-cap">{p.beforeCap}</div>}
          </div>
          <div className="ign-ba-panel after">
            <ImageSlot src={images[1]} placeholder={p.afterPlaceholder} mode="fill" height="100%" radius={0} />
            {p.showLabels && <span className="ign-ba-chip">{p.afterChip}</span>}
            {p.showCaptions && <div className="ign-ba-cap">{p.afterCap}</div>}
          </div>
          {p.showSeam && <div className="ign-ba-seam"><span className="badge">{p.seamGlyph}</span></div>}
        </div>

        {p.showStrip && (
          <div className="ign-ba-strip ign-a3">
            {stats.map((s, i) => (
              <div key={i} className="ign-ba-stat">
                <EmberText className="v">{s.v}</EmberText>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 22 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '70%' }} /></span> 57 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
