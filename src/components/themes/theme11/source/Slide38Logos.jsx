/* Slide38Logos.jsx — IGNIS deck · partner / client logo-wall page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: logosDefaultProps (complete defaults) + logosControls (1:1).
 *
 * Image / brand page. A wall of logo slots (height-mode, ratio-adaptive) with
 * elegant monogram fallbacks, framed by a headline + trust stat. Distinct from
 * every photographic image page — this is the deck's client-proof wall.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-lgo .ign-frame{justify-content:space-between}
.ign-lgo .b1{width:1500px;height:900px;left:50%;top:54%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,120,52,0.24),rgba(226,42,12,0) 70%);filter:blur(64px)}
.ign-lgo .ign-ghost{font-size:560px;right:20px;bottom:-160px}
.ign-lgo-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-lgo-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-lgo-head h2{font-size:62px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-lgo-head h2 .ign-serif{color:var(--ign-a)}
.ign-lgo-stat{text-align:right}
.ign-lgo-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:80px;line-height:0.85;letter-spacing:-0.04em}
.ign-lgo-stat .l{font-size:22px;font-weight:300;color:var(--ign-ink2);margin-top:8px}
.ign-lgo-wall{flex:1;display:grid;gap:0;margin-top:24px;border-top:1px solid var(--ign-hair);border-left:1px solid var(--ign-hair)}
.ign-lgo-cell{position:relative;display:flex;align-items:center;justify-content:center;
  border-right:1px solid var(--ign-hair);border-bottom:1px solid var(--ign-hair);padding:30px}
.ign-lgo-mono{display:flex;align-items:center;gap:14px}
.ign-lgo-mono .mk{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:40px;letter-spacing:-0.02em;
  background:var(--ign-ember);-webkit-background-clip:text;background-clip:text;color:transparent}
.ign-lgo-mono .nm{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;letter-spacing:0.02em;color:var(--ign-ink2)}
.ign-lgo-cell .ign-imgslot{filter:saturate(0)}
`;

export const logosDefaultProps = {
  surface: 'ink',
  brandCount: 8,
  columns: 4,
  logoCount: 0,
  images: [],
  showNames: true,
  showStat: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '★',
  railText: 'Clients — 信任',
  navItems: ['信任'],
  navCurrent: 0,
  ixNo: '38',
  ixLabel: 'Clients',
  lead: 'They bet on the engine.',
  headingHtml: '这些团队，<span class="ign-ember-text">把增长交给了我们</span>。',
  statValue: '120+',
  statLabel: '合作品牌 · 续约率 94%',
  brands: [
    { mk: 'V', nm: 'VOLT' }, { mk: 'Ar', nm: 'ARCO' }, { mk: 'N', nm: 'NIMBUS' }, { mk: 'Q', nm: 'QUILL' },
    { mk: 'Fe', nm: 'FERRO' }, { mk: 'Lu', nm: 'LUMA' }, { mk: 'Hx', nm: 'HELIX' }, { mk: 'Od', nm: 'ODEON' },
    { mk: 'Pi', nm: 'PIVOT' }, { mk: 'Sa', nm: 'SABLE' }, { mk: 'Tg', nm: 'TANGRAM' }, { mk: 'Ze', nm: 'ZEN' },
  ],
  metaLeft: 'IGNIS — 燃点 · 部分合作品牌',
  metaMid: '信任，是最难伪造的指标',
};

export const logosControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'brandCount', type: 'slider', label: '品牌数量', default: 8, min: 4, max: 12, step: 1, describe: '展示的品牌格子数量。' },
  { key: 'columns', type: 'slider', label: '每行列数', default: 4, min: 3, max: 6, step: 1, describe: '品牌墙每行的列数。' },
  { key: 'logoCount', type: 'slider', label: 'Logo 槽数量', default: 0, min: 0, max: 12, step: 1, describe: '使用真实 logo 的格子数；其余回退为字母组合标记。' },
  { key: 'showNames', type: 'toggle', label: '品牌名', default: true, describe: '字母标记旁的品牌名称。' },
  { key: 'showStat', type: 'toggle', label: '信任数据', default: true, describe: '右上角的客户数量大数字。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function LogosSlide(props) {
  injectCSS('ign-lgo-css', CSS);
  const p = { ...logosDefaultProps, ...props };
  const n = clampInt(p.brandCount, 4, 12);
  const cols = clampInt(p.columns, 3, 6);
  const brands = (Array.isArray(p.brands) ? p.brands : []).slice(0, n);
  const images = Array.isArray(p.images) ? p.images : [];
  const filled = clampInt(p.logoCount, 0, n);
  const rows = Math.ceil(n / cols);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-lgo">
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

        <div className="ign-lgo-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showStat && (
            <div className="ign-lgo-stat"><EmberText className="v">{p.statValue}</EmberText><div className="l">{p.statLabel}</div></div>
          )}
        </div>

        <div className="ign-lgo-wall ign-a2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {brands.map((b, i) => (
            <div key={i} className="ign-lgo-cell">
              {i < filled
                ? <ImageSlot src={images[i]} placeholder={b.nm} mode="height" height={52} radius={0} fit="contain" />                : <div className="ign-lgo-mono"><span className="mk">{b.mk}</span>{p.showNames && <span className="nm">{b.nm}</span>}</div>}
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '46%' }} /></span> 38 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
