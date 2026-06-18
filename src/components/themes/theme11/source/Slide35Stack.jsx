/* Slide35Stack.jsx — IGNIS deck · stacked-column growth chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: stackDefaultProps (complete defaults) + stackControls (1:1).
 *
 * Chart page. Channel contribution stacked into growing columns across periods.
 * Distinct from the Proof line/area, the Mix donut share, the Funnel, the Radar
 * and the Rings — this is the only stacked-column composition in the deck.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-stk .ign-frame{justify-content:space-between}
.ign-stk .b1{width:1200px;height:900px;right:-220px;bottom:-180px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.32),rgba(226,42,12,0) 68%);filter:blur(60px)}
.ign-stk .ign-ghost{font-size:540px;left:20px;top:-70px}
.ign-stk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-stk-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-stk-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-stk-head h2 .ign-serif{color:var(--ign-a)}
.ign-stk-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:380px;text-align:right;text-wrap:pretty}
.ign-stk-body{flex:1;display:flex;flex-direction:column;justify-content:flex-end;position:relative;margin-top:14px}
.ign-stk-plot{position:relative;display:grid;align-items:end;gap:7%;height:560px;
  border-bottom:1px solid var(--ign-hair2);padding:0 8px}
.ign-stk-grid{position:absolute;inset:0;z-index:0;display:flex;flex-direction:column;justify-content:space-between}
.ign-stk-grid span{height:1px;background:var(--ign-hair);width:100%}
.ign-stk-col{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%}
.ign-stk-total{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;letter-spacing:-0.02em;
  text-align:center;margin-bottom:14px;color:var(--ign-ink)}
.ign-stk-seg{width:100%;border-top:1px solid rgba(11,9,8,0.18)}
.ign-stk-seg.s0{background:var(--ign-ink4)}
.ign-stk-seg.s1{background:rgba(255,120,52,0.42)}
.ign-stk-seg.s2{background:var(--ign-ember);box-shadow:inset 0 0 30px rgba(255,200,150,0.4)}
.ign-stk-col.dim{opacity:0.32;filter:saturate(0.5)}
.ign-stk-x{display:grid;gap:7%;padding:18px 8px 0}
.ign-stk-xl{text-align:center;font-family:'Space Grotesk',sans-serif;font-size:23px;letter-spacing:0.04em;color:var(--ign-ink2)}
.ign-stk-leg{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:14px 30px;margin-bottom:20px;z-index:2}
.ign-stk-leg .it{display:flex;align-items:center;gap:11px;font-size:22px;color:var(--ign-ink2)}
.ign-stk-leg .it .sw{width:26px;height:14px;border-radius:3px;flex:none}
.ign-stk-leg .it .sw.s0{background:var(--ign-ink4)}
.ign-stk-leg .it .sw.s1{background:rgba(255,120,52,0.42)}
.ign-stk-leg .it .sw.s2{background:var(--ign-ember)}
`;

export const stackDefaultProps = {
  surface: 'ink',
  periodCount: 5,
  segmentCount: 3,
  showTotals: true,
  showGrid: true,
  showLegend: true,
  emphasis: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '▦',
  railText: 'Stacked — 叠加',
  navItems: ['叠加'],
  navCurrent: 0,
  ixNo: '35',
  ixLabel: 'Stacked',
  lead: 'Channels compound.',
  headingHtml: '每个季度，<span class="ign-ember-text">多一层动能</span>。',
  lede: '不是把预算从一个渠道挪到另一个，而是让每条渠道都往上叠——这才是复利的形状。',
  segs: [
    { key: 's2', name: '付费投放', en: 'Paid' },
    { key: 's1', name: '内容自然', en: 'Content' },
    { key: 's0', name: '直接/品牌', en: 'Direct' },
  ],
  periods: [
    { x: 'Q1', vals: [10, 14, 12] },
    { x: 'Q2', vals: [16, 22, 16] },
    { x: 'Q3', vals: [24, 34, 20] },
    { x: 'Q4', vals: [34, 48, 26] },
    { x: 'Q5', vals: [46, 64, 32] },
    { x: 'Q6', vals: [58, 82, 40] },
  ],
  metaLeft: 'IGNIS — 燃点 · 渠道贡献叠加（季度营收 / 万元）',
  metaMid: '往上叠，别来回挪',
};

export const stackControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'periodCount', type: 'slider', label: '周期数量', default: 5, min: 3, max: 6, step: 1, describe: '横轴上的时间周期（柱子）数量。' },
  { key: 'segmentCount', type: 'slider', label: '渠道层数', default: 3, min: 2, max: 3, step: 1, describe: '每根柱子堆叠的渠道层数。' },
  { key: 'showTotals', type: 'toggle', label: '柱顶合计', default: true, describe: '每根柱子顶部的合计数值。' },
  { key: 'showGrid', type: 'toggle', label: '网格线', default: true, describe: '背景的水平刻度网格。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '右上角的渠道图例。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后突出最新一根柱子，其余弱化。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function StackSlide(props) {
  injectCSS('ign-stk-css', CSS);
  const p = { ...stackDefaultProps, ...props };
  const pc = clampInt(p.periodCount, 3, 6);
  const sc = clampInt(p.segmentCount, 2, 3);
  const periods = (Array.isArray(p.periods) ? p.periods : []).slice(0, pc);
  const segs = (Array.isArray(p.segs) ? p.segs : []).slice(0, sc);
  const totals = periods.map((pr) => pr.vals.slice(0, sc).reduce((a, b) => a + b, 0));
  const max = Math.max(...totals) * 1.08;
  const cols = `repeat(${pc}, 1fr)`;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-stk">
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

        <div className="ign-stk-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-stk-body ign-a2">
          {p.showLegend && (
            <div className="ign-stk-leg">
              {segs.map((s) => (
                <div key={s.key} className="it"><span className={`sw ${s.key}`} />{s.name} · {s.en}</div>
              ))}
            </div>
          )}
          <div className="ign-stk-plot" style={{ gridTemplateColumns: cols }}>
            {p.showGrid && (
              <div className="ign-stk-grid">{[0, 1, 2, 3, 4].map((i) => <span key={i} />)}</div>
            )}
            {periods.map((pr, i) => {
              const last = i === periods.length - 1;
              return (
                <div key={i} className={`ign-stk-col ${p.emphasis && !last ? 'dim' : ''}`}>
                  {p.showTotals && <div className="ign-stk-total">{totals[i]}</div>}
                  {segs.map((s, j) => (
                    <div key={s.key} className={`ign-stk-seg ${s.key}`}
                      style={{ height: `${(pr.vals[j] / max) * 100}%` }} />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="ign-stk-x" style={{ gridTemplateColumns: cols }}>
            {periods.map((pr, i) => <div key={i} className="ign-stk-xl">{pr.x}</div>)}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '43%' }} /></span> 35 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
