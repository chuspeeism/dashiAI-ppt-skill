/* Slide43Heatmap.jsx — IGNIS deck · cohort retention heatmap chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: heatmapDefaultProps (complete defaults) + heatmapControls (1:1).
 *
 * Chart page. A cohort × period grid where cell ember-intensity encodes
 * retention. Distinct from every other chart in the deck (line, donut, funnel,
 * radar, rings, stacked column, waterfall) — this is the only matrix heatmap.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-hmp .ign-frame{justify-content:space-between}
.ign-hmp .b1{width:1200px;height:900px;right:-220px;bottom:-160px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.3),rgba(226,42,12,0) 68%);filter:blur(60px)}
.ign-hmp .ign-ghost{font-size:520px;left:20px;top:-70px}
.ign-hmp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-hmp-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-hmp-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-hmp-head h2 .ign-serif{color:var(--ign-a)}
.ign-hmp-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:380px;text-align:right;text-wrap:pretty}
.ign-hmp-body{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:10px}
.ign-hmp-grid{display:grid;gap:7px}
.ign-hmp-rowh{display:flex;flex-direction:column;justify-content:center;padding-right:22px}
.ign-hmp-rowh .c{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:23px;letter-spacing:-0.01em;color:var(--ign-ink)}
.ign-hmp-rowh .s{font-size:17px;font-weight:300;color:var(--ign-ink3);margin-top:2px}
.ign-hmp-colh{font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.06em;text-transform:uppercase;
  color:var(--ign-ink3);text-align:center;padding-bottom:4px}
.ign-hmp-cell{height:88px;border-radius:4px;display:flex;align-items:center;justify-content:center;
  font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;letter-spacing:-0.01em;border:1px solid rgba(255,255,255,0.04)}
.ign-hmp-leg{display:flex;align-items:center;gap:16px;margin-top:22px;font-size:20px;color:var(--ign-ink3)}
.ign-hmp-leg .scale{display:flex;height:14px;width:240px;border-radius:7px;overflow:hidden}
.ign-hmp-leg .scale i{flex:1}
`;

export const heatmapDefaultProps = {
  surface: 'ink',
  cohortCount: 5,
  periodCount: 6,
  showValues: true,
  showRowHead: true,
  showColHead: true,
  showLegend: true,
  emphasis: false,
  emphasisRow: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '▥',
  railText: 'Cohort — 留存',
  navItems: ['留存'],
  navCurrent: 0,
  ixNo: '43',
  ixLabel: 'Cohort',
  lead: 'Newer cohorts hold better.',
  headingHtml: '越往后的客户，<span class="ign-ember-text">留得越久</span>。',
  lede: '每一行是一个月的新客队列，颜色越亮代表留存越高——引擎在让后面的队列站得更稳。',
  legendLow: '低留存',
  legendHigh: '高留存',
  cohorts: [
    { c: '1 月', s: '1,240 新客', vals: [100, 82, 71, 64, 58, 54] },
    { c: '2 月', s: '1,580 新客', vals: [100, 85, 75, 68, 63, 0] },
    { c: '3 月', s: '1,910 新客', vals: [100, 88, 80, 74, 0, 0] },
    { c: '4 月', s: '2,260 新客', vals: [100, 90, 84, 0, 0, 0] },
    { c: '5 月', s: '2,640 新客', vals: [100, 92, 0, 0, 0, 0] },
  ],
  periods: ['第0周', '第1周', '第2周', '第3周', '第4周', '第5周'],
  metaLeft: 'IGNIS — 燃点 · 月度群组周留存（%）',
  metaMid: '留得住，才算赢',
};

function cellColor(v) {
  if (v <= 0) return { bg: 'var(--ign-panel)', fg: 'transparent', txt: '' };
  const t = (v - 50) / 50; // 50→0, 100→1
  const a = 0.12 + Math.max(0, Math.min(1, t)) * 0.82;
  const fg = a > 0.6 ? '#1B1108' : 'var(--ign-ink2)';
  return { bg: `rgba(255,110,46,${a.toFixed(2)})`, fg, txt: v + '%' };
}

export const heatmapControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'cohortCount', type: 'slider', label: '群组行数', default: 5, min: 3, max: 5, step: 1, describe: '横向群组（每月新客队列）行数。' },
  { key: 'periodCount', type: 'slider', label: '观察周期', default: 6, min: 4, max: 6, step: 1, describe: '纵向观察周期（周）列数。' },
  { key: 'showValues', type: 'toggle', label: '单元数值', default: true, describe: '每个色块中的留存百分比数值。' },
  { key: 'showRowHead', type: 'toggle', label: '行标题', default: true, describe: '左侧群组名称与样本量。' },
  { key: 'showColHead', type: 'toggle', label: '列标题', default: true, describe: '顶部周期标签。' },
  { key: 'showLegend', type: 'toggle', label: '色阶图例', default: true, describe: '底部留存强度色阶。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一行群组，其余弱化。' },
  { key: 'emphasisRow', type: 'slider', label: '重点行', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的群组行序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function HeatmapSlide(props) {
  injectCSS('ign-hmp-css', CSS);
  const p = { ...heatmapDefaultProps, ...props };
  const rows = clampInt(p.cohortCount, 3, 5);
  const colsN = clampInt(p.periodCount, 4, 6);
  const cohorts = (Array.isArray(p.cohorts) ? p.cohorts : []).slice(0, rows);
  const periods = (Array.isArray(p.periods) ? p.periods : []).slice(0, colsN);
  const emr = clampInt(p.emphasisRow, 0, rows - 1);
  const headW = p.showRowHead ? '210px' : '0px';
  const gridCols = `${headW} repeat(${colsN}, 1fr)`;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-hmp">
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

        <div className="ign-hmp-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-hmp-body ign-a2">
          <div className="ign-hmp-grid" style={{ gridTemplateColumns: gridCols }}>
            {p.showColHead && (
              <>
                {p.showRowHead && <div />}
                {periods.map((pd, i) => <div key={i} className="ign-hmp-colh">{pd}</div>)}
              </>
            )}
            {cohorts.map((co, ri) => (
              <React.Fragment key={ri}>
                {p.showRowHead && (
                  <div className="ign-hmp-rowh" style={{ opacity: p.emphasis && ri !== emr ? 0.4 : 1 }}>
                    <span className="c">{co.c}</span><span className="s">{co.s}</span>
                  </div>
                )}
                {periods.map((_, ci) => {
                  const cc = cellColor(co.vals[ci]);
                  return (
                    <div key={ci} className="ign-hmp-cell"
                      style={{ background: cc.bg, color: cc.fg, opacity: p.emphasis && ri !== emr ? 0.32 : 1 }}>
                      {p.showValues ? cc.txt : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {p.showLegend && (
            <div className="ign-hmp-leg">
              <span>{p.legendLow}</span>
              <span className="scale">
                <i style={{ background: 'rgba(255,110,46,0.14)' }} /><i style={{ background: 'rgba(255,110,46,0.34)' }} />
                <i style={{ background: 'rgba(255,110,46,0.56)' }} /><i style={{ background: 'rgba(255,110,46,0.78)' }} />
                <i style={{ background: 'rgba(255,110,46,0.94)' }} />
              </span>
              <span>{p.legendHigh}</span>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '52%' }} /></span> 43 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
