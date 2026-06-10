/* Slide56Treemap.jsx — IGNIS deck · proportional treemap chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: treemapDefaultProps (complete defaults) + treemapControls (1:1).
 *
 * Chart page. Channel contribution to growth rendered as area-proportional
 * rectangles (slice-and-dice treemap). Distinct from Mix (14, donut/bars),
 * Stack (35, stacked bars) and Funnel (21) — this is the deck's only treemap,
 * the one view where block AREA equals share.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-tm .ign-frame{justify-content:space-between}
.ign-tm .b1{width:1100px;height:1100px;right:-220px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.28),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-tm .ign-ghost{font-size:540px;left:10px;bottom:-150px}
.ign-tm-body{flex:1;display:grid;grid-template-columns:0.78fr 1.32fr;gap:60px;align-items:center;margin-top:16px}
.ign-tm-l .ign-eyebrow{margin-bottom:22px}
.ign-tm-l h2{font-size:60px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-tm-l h2 .ign-serif{color:var(--ign-a)}
.ign-tm-l p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:22px;max-width:400px;text-wrap:pretty}
.ign-tm-keys{margin-top:30px;border-top:1px solid var(--ign-hair)}
.ign-tm-key{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:14px;padding:13px 0;border-bottom:1px solid var(--ign-hair)}
.ign-tm-key .sw{width:13px;height:13px;border-radius:3px;align-self:center}
.ign-tm-key .nm{font-size:24px;font-weight:500}
.ign-tm-key .pc{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:26px;letter-spacing:-0.01em}
.ign-tm-key.dim{opacity:0.34;filter:saturate(0.5)}
.ign-tm-plot{position:relative;width:100%;aspect-ratio:1.32 / 1}
.ign-tm-cell{position:absolute;overflow:hidden;border-radius:5px;padding:20px 22px;display:flex;flex-direction:column;justify-content:flex-end}
.ign-tm-cell .cn{font-size:27px;font-weight:700;letter-spacing:-0.01em;color:#1B1108}
.ign-tm-cell .cp{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:23px;color:rgba(27,17,8,0.72);margin-top:3px}
.ign-tm-cell.muted .cn{color:var(--ign-ink)}
.ign-tm-cell.muted .cp{color:var(--ign-ink2)}
.ign-tm-cell.sm{padding:14px 16px}
.ign-tm-cell.sm .cn{font-size:23px}
.ign-tm-cell.sm .cp{font-size:20px}
.ign-tm-cell.dim{opacity:0.3}
`;

/* slice-and-dice treemap: largest item peels off one strip, recurse on rest,
 * alternating split orientation each level. Generic for any item count. */
function layout(items, x, y, w, h, horiz) {
  if (items.length === 1) return [{ ...items[0], x, y, w, h }];
  const total = items.reduce((s, it) => s + it.v, 0);
  const a = items[0];
  const frac = a.v / total;
  if (horiz) {
    const aw = w * frac;
    return [{ ...a, x, y, w: aw, h }, ...layout(items.slice(1), x + aw, y, w - aw, h, !horiz)];
  }
  const ah = h * frac;
  return [{ ...a, x, y, w, h: ah }, ...layout(items.slice(1), x, y + ah, w, h - ah, !horiz)];
}

export const treemapDefaultProps = {
  surface: 'ink',
  blockCount: 5,
  emphasis: false,
  emphasisIndex: 0,
  showKeys: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '▦',
  railText: 'Mix — 构成',
  navItems: ['构成'],
  navCurrent: 0,
  ixNo: '55',
  ixLabel: 'Mix',
  eyebrowNo: '构成',
  eyebrowEn: 'Where growth comes from',
  headingHtml: '增长从哪来，<br><span class="ign-ember-text">面积说了算</span>。',
  lede: '把一年的增量按来源拆开——块越大，贡献越多。自然资产，才是底盘。',
  data: [
    { nm: '自然搜索', v: 38 },
    { nm: '内容分发', v: 24 },
    { nm: '付费投放', v: 18 },
    { nm: '社媒互动', v: 12 },
    { nm: '品牌直访', v: 8 },
  ],
  metaLeft: 'IGNIS — 燃点 · 增量来源拆解',
  metaMid: '大的那块，得是你自己的',
};

export const treemapControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'blockCount', type: 'slider', label: '区块数量', default: 5, min: 3, max: 5, step: 1, describe: '树图中按占比划分的渠道区块数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一区块，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的区块序号（从 0 起）。' },
  { key: 'showKeys', type: 'toggle', label: '占比图例', default: true, describe: '左侧带百分比的图例清单。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function TreemapSlide(props) {
  injectCSS('ign-tm-css', CSS);
  const p = { ...treemapDefaultProps, ...props };
  const n = clampInt(p.blockCount, 3, 5);
  const raw = (Array.isArray(p.data) ? p.data : []).slice(0, n);
  const sum = raw.reduce((s, it) => s + it.v, 0);
  const items = raw.map((it, i) => ({ ...it, i, pct: Math.round((it.v / sum) * 100) }));
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const rects = layout(items, 0, 0, 100, 100, true);
  const tone = ['url(#x)', 'rgba(255,110,46,0.30)', 'rgba(255,110,46,0.18)', 'rgba(255,110,46,0.10)', 'rgba(255,110,46,0.055)'];
  const fill = (idx) => idx === 0 ? 'linear-gradient(150deg,#FFC07A,#FF6E2E 52%,#E22A0C)' : tone[idx];

  return (
    <Slide surface={p.surface} className="ign-tm">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav className="ign-nav">{(Array.isArray(p.navItems) ? p.navItems : []).map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-tm-body">
          <div className="ign-tm-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showKeys && (
              <div className="ign-tm-keys">
                {items.map((it) => (
                  <div key={it.i} className={`ign-tm-key ${p.emphasis && it.i !== emi ? 'dim' : ''}`}>
                    <span className="sw" style={{ background: it.i === 0 ? 'linear-gradient(135deg,#FFC07A,#E22A0C)' : tone[it.i], border: it.i === 0 ? 'none' : '1px solid var(--ign-hair2)' }} />
                    <span className="nm">{it.nm}</span>
                    {it.i === 0 ? <EmberText className="pc">{it.pct}%</EmberText> : <span className="pc" style={{ color: 'var(--ign-ink2)' }}>{it.pct}%</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-tm-plot ign-a2">
            {rects.map((r) => {
              const small = (r.w * r.h) < 130;
              const lit = !p.emphasis || r.i === emi;
              return (
                <div key={r.i}
                  className={`ign-tm-cell ${r.i === 0 ? '' : 'muted'} ${small ? 'sm' : ''} ${lit ? '' : 'dim'}`}
                  style={{
                    left: `calc(${r.x}% + 3px)`, top: `calc(${r.y}% + 3px)`,
                    width: `calc(${r.w}% - 6px)`, height: `calc(${r.h}% - 6px)`,
                    background: fill(r.i),
                    border: r.i === 0 ? '1px solid #E22A0C' : '1px solid var(--ign-hair2)',
                  }}>
                  <span className="cn">{r.nm}</span>
                  <span className="cp">{r.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '67%' }} /></span> 55 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
