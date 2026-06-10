/* Slide71Cadence.jsx — IGNIS deck · execution-cadence schedule table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: cadenceDefaultProps (complete defaults) + cadenceControls (1:1).
 *
 * Table page. A Gantt-style cadence grid — workstreams down the side, periods
 * across the top, each stream a span bar with a kickoff dot and milestone
 * marker. Distinct from Heatmap (43, retention intensity) and Roadmap (45,
 * single milestone axis): this reads as an operating SCHEDULE, who-does-what-
 * when. Period count, row count and the highlighted stream are prop-driven.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cdn .ign-frame{justify-content:space-between}
.ign-cdn .b1{width:1180px;height:820px;right:-220px;top:56%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.16),rgba(226,42,12,0) 70%);filter:blur(58px)}
.ign-cdn .ign-ghost{font-size:520px;left:-10px;bottom:-150px}
.ign-cdn .ign-eyebrow{white-space:nowrap}
.ign-cdn-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:22px}
.ign-cdn-head h2{font-size:54px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-cdn-head h2 .ign-serif{color:var(--ign-a)}
.ign-cdn-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:23px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-cdn-tbl{flex:1;display:flex;flex-direction:column;margin-top:26px}
.ign-cdn-r{display:grid;grid-template-columns:248px 1fr;align-items:center}
.ign-cdn-colhead{display:grid;grid-template-columns:repeat(var(--cols),1fr);border-bottom:1px solid var(--ign-hair2);padding-bottom:12px}
.ign-cdn-colhead span{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.04em;color:var(--ign-ink3);text-align:center}
.ign-cdn-row{border-bottom:1px solid var(--ign-hair);min-height:0}
.ign-cdn-lbl{display:flex;flex-direction:column;gap:3px;padding:18px 24px 18px 0}
.ign-cdn-lbl .t{font-size:26px;font-weight:600;letter-spacing:-0.01em}
.ign-cdn-lbl .e{font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:0.08em;color:var(--ign-ink3);text-transform:uppercase}
.ign-cdn-track{position:relative;height:100%;min-height:72px}
.ign-cdn-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(var(--cols),1fr);pointer-events:none}
.ign-cdn-grid i{border-left:1px solid var(--ign-hair)}
.ign-cdn-grid i:first-child{border-left:none}
.ign-cdn-bar{position:absolute;top:50%;transform:translateY(-50%);height:18px;border-radius:10px;
  background:var(--ign-hair2);display:flex;align-items:center;padding:0 14px}
.ign-cdn-bar .ph{font-family:'Space Grotesk',sans-serif;font-size:16px;letter-spacing:0.04em;color:var(--ign-ink2);white-space:nowrap}
.ign-cdn-row.lead .ign-cdn-bar{height:22px;background:linear-gradient(90deg,#FFC07A,#FF6E2E 55%,#E22A0C)}
.ign-cdn-row.lead .ign-cdn-bar .ph{color:#1B1108;font-weight:500}
.ign-cdn-dot{position:absolute;top:50%;transform:translate(-50%,-50%);width:13px;height:13px;border-radius:50%;
  background:var(--ign-bg);border:2px solid var(--ign-ink2);z-index:2}
.ign-cdn-row.lead .ign-cdn-dot{border-color:#E22A0C}
.ign-cdn-mile{position:absolute;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;rotate:45deg;
  background:var(--ign-bg);border:2px solid var(--ign-a);z-index:2}
.ign-cdn-row.dim{opacity:0.4}
.ign-cdn-legend{display:flex;gap:30px;align-items:center;margin-top:18px;font-family:'Space Grotesk',sans-serif;
  font-size:19px;letter-spacing:0.03em;color:var(--ign-ink3)}
.ign-cdn-legend .it{display:flex;align-items:center;gap:9px}
.ign-cdn-legend .sw{width:24px;height:10px;border-radius:6px;background:var(--ign-hair2)}
.ign-cdn-legend .sw.lead{background:linear-gradient(90deg,#FFC07A,#E22A0C)}
.ign-cdn-legend .dt{width:12px;height:12px;border-radius:50%;border:2px solid var(--ign-ink2);background:var(--ign-bg)}
.ign-cdn-legend .dm{width:13px;height:13px;rotate:45deg;border:2px solid var(--ign-a);background:var(--ign-bg)}
`;

/* start = 1-based first period; span = periods covered; mileAt = milestone period (end-of). */
export const cadenceDefaultProps = {
  surface: 'paper',
  rowCount: 5,
  periodCount: 6,
  highlightRowIndex: 1,
  showColHeads: true,
  showBars: true,
  showMilestones: true,
  showLegend: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '90d',
  railText: 'Cadence — 排期',
  navItems: ['排期'],
  navCurrent: 0,
  ixNo: '70',
  ixLabel: 'Cadence',
  eyebrowNo: '执行排期',
  eyebrowEn: 'The schedule',
  headingHtml: '不是 PPT 上的承诺，<span class="ign-ember-text">是排进日历的事</span>。',
  noteHtml: '六个月运行节奏<br>每条工作流都有起点与交付。',
  legendLead: '主线工作流',
  legendNormal: '常规工作流',
  legendStart: '启动',
  legendMile: '里程碑交付',
  rows: [
    { nm: '诊断与基线', en: 'Audit', start: 1, span: 2, mileAt: 2, ph: '建立口径' },
    { nm: '内容与 SEO', en: 'Content', start: 2, span: 5, mileAt: 4, ph: '矩阵铺开' },
    { nm: '落地页重排', en: 'Pages', start: 2, span: 3, mileAt: 5, ph: '转化收口' },
    { nm: '私域承接', en: 'Retention', start: 4, span: 3, mileAt: 6, ph: '复利沉淀' },
    { nm: '复盘与扩量', en: 'Scale', start: 5, span: 2, mileAt: 6, ph: '放大赢家' },
  ],
  periods: ['月 1', '月 2', '月 3', '月 4', '月 5', '月 6'],
  metaLeft: 'IGNIS — 燃点 · 六个月执行排期',
  metaMid: '排进日历，才会发生',
};

export const cadenceControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '工作流数量', default: 5, min: 3, max: 5, step: 1, describe: '排期表的工作流行数。' },
  { key: 'periodCount', type: 'slider', label: '周期列数', default: 6, min: 4, max: 6, step: 1, describe: '时间轴的周期列数（月）。' },
  { key: 'highlightRowIndex', type: 'slider', label: '高亮工作流', default: 1, min: 0, max: 4, step: 1, describe: '点亮为暖橙的工作流序号（从 0 起）。' },
  { key: 'showColHeads', type: 'toggle', label: '周期表头', default: true, describe: '顶部的周期列标题。' },
  { key: 'showBars', type: 'toggle', label: '排期色条', default: true, describe: '每行的跨周期排期色条。' },
  { key: 'showMilestones', type: 'toggle', label: '里程碑标记', default: true, describe: '每行的菱形里程碑标记。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '底部的色条 / 节点 / 里程碑图例。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function CadenceSlide(props) {
  injectCSS('ign-cdn-css', CSS);
  const p = { ...cadenceDefaultProps, ...props };
  const cols = clampInt(p.periodCount, 4, 6);
  const n = clampInt(p.rowCount, 3, 5);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const PERIODS = Array.isArray(p.periods) ? p.periods : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const hi = clampInt(p.highlightRowIndex, 0, n - 1);
  const pct = (v) => `${(v / cols) * 100}%`;

  return (
    <Slide surface={p.surface} className="ign-cdn">
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

        <div className="ign-cdn-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-cdn-tbl ign-a2" style={{ '--cols': cols }}>
          {p.showColHeads && (
            <div className="ign-cdn-r">
              <span />
              <div className="ign-cdn-colhead">
                {PERIODS.slice(0, cols).map((pd, i) => <span key={i}>{pd}</span>)}
              </div>
            </div>
          )}
          {rows.map((r, i) => {
            const lead = i === hi;
            const start = Math.min(r.start, cols);
            const span = Math.min(r.span, cols - start + 1);
            const mile = Math.min(r.mileAt, cols);
            return (
              <div key={i} className={`ign-cdn-r ign-cdn-row ${lead ? 'lead' : ''}`}>
                <div className="ign-cdn-lbl"><span className="t">{r.nm}</span><span className="e">{r.en}</span></div>
                <div className="ign-cdn-track">
                  <div className="ign-cdn-grid">{Array.from({ length: cols }).map((_, c) => <i key={c} />)}</div>
                  {p.showBars && (
                    <div className="ign-cdn-bar" style={{ left: pct(start - 1), width: pct(span) }}>
                      <span className="ph">{r.ph}</span>
                    </div>
                  )}
                  {p.showBars && <span className="ign-cdn-dot" style={{ left: pct(start - 1) }} />}
                  {p.showMilestones && <span className="ign-cdn-mile" style={{ left: pct(mile) }} />}
                </div>
              </div>
            );
          })}
          {p.showLegend && (
            <div className="ign-cdn-legend">
              <span className="it"><span className="sw lead" />{p.legendLead}</span>
              <span className="it"><span className="sw" />{p.legendNormal}</span>
              <span className="it"><span className="dt" />{p.legendStart}</span>
              <span className="it"><span className="dm" />{p.legendMile}</span>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 16 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '85%' }} /></span> 70 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
