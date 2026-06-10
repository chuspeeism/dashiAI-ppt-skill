/* Slide25Grid.jsx — IGNIS deck · capability symbol-matrix table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: gridDefaultProps (complete defaults) + gridControls (1:1).
 *
 * Table page. A dense spec-sheet matrix — capabilities down the side, options
 * across the top, each cell a full / partial / missing mark. Distinct from the
 * prose-tier Compare table: this one reads at a glance as coverage.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-grd .ign-frame{justify-content:space-between}
.ign-grd .b1{width:1080px;height:1080px;left:50%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,120,52,0.3),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-grd .ign-ghost{font-size:520px;right:30px;bottom:-130px}
.ign-grd-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-grd-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-grd-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-grd-head h2 .ign-serif{color:var(--ign-a)}
.ign-grd-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:400px;text-align:right;text-wrap:pretty}
.ign-grd-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-grd-tbl{display:grid;position:relative}
.ign-grd-cell{display:flex;align-items:center;padding:13px 20px;border-bottom:1px solid var(--ign-hair);min-width:0}
.ign-grd-cell.ctr{justify-content:center}
.ign-grd-cap{font-size:27px;font-weight:600}
.ign-grd-cap .en{display:block;font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:var(--ign-ink3);margin-top:3px}
.ign-grd-hd{font-family:'Space Grotesk',sans-serif;font-size:25px;font-weight:600;letter-spacing:0.02em;color:var(--ign-ink2);border-bottom:1px solid var(--ign-hair2);padding-bottom:14px}
.ign-grd-hd.us{color:var(--ign-ink)}
.ign-grd-hot{position:absolute;top:0;bottom:0;background:linear-gradient(180deg,rgba(255,120,52,0.16),rgba(255,120,52,0.04));
  border-left:1px solid rgba(255,160,100,0.4);border-right:1px solid rgba(255,160,100,0.4);z-index:0;pointer-events:none}
.ign-grd-cell,.ign-grd-hd{position:relative;z-index:1}
.ign-sym{display:inline-block}
.ign-sym.full{width:24px;height:24px;border-radius:50%;background:var(--ign-ember);box-shadow:0 0 12px rgba(255,110,46,0.5)}
.ign-sym.half{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--ign-a);
  background:linear-gradient(90deg,var(--ign-a) 0 50%,transparent 50% 100%)}
.ign-sym.none{width:20px;height:2px;background:var(--ign-ink4)}
.ign-grd-leg{display:flex;align-items:center;gap:34px;margin-top:18px;font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.04em;color:var(--ign-ink3)}
.ign-grd-leg .it{display:flex;align-items:center;gap:11px}
`;

const Sym = ({ v }) => <span className={`ign-sym ${v === 2 ? 'full' : v === 1 ? 'half' : 'none'}`} />;

export const gridDefaultProps = {
  surface: 'ink',
  rowCount: 7,
  columnCount: 4,
  highlightColumnIndex: 3,
  showHeadRow: true,
  showLegend: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '✓',
  railText: 'Coverage — 清单',
  navItems: ['清单'],
  navCurrent: 0,
  ixNo: '13',
  ixLabel: 'Coverage',
  lead: 'One team covers it.',
  headingHtml: '覆盖，<span class="ign-ember-text">无死角</span>。',
  lede: '把能力摊开看：别的方案总在某一格留白，而一体化的意义，是没有那一格。',
  rowHeadLabel: '能力维度',
  colLabels: ['内部团队', '综合代理', '垂直工具'],
  usLabel: '燃点',
  rows: [
    { t: '搜索与内容', en: 'SEO & Content', cells: [1, 2, 1, 2] },
    { t: '转化率优化', en: 'CRO', cells: [0, 1, 1, 2] },
    { t: '网站开发维护', en: 'Web & Maintenance', cells: [1, 1, 0, 2] },
    { t: '付费投放', en: 'Paid Media', cells: [1, 2, 2, 2] },
    { t: '数据与归因', en: 'Data & Attribution', cells: [0, 1, 1, 2] },
    { t: '一体化协同', en: 'One Team', cells: [0, 0, 0, 2] },
    { t: '复利式增长', en: 'Compounding', cells: [0, 1, 0, 2] },
  ],
  legendFull: '完整覆盖',
  legendHalf: '部分覆盖',
  legendNone: '基本缺失',
  metaLeft: 'IGNIS — 燃点 · 能力覆盖矩阵',
  metaMid: '没有留白的那一格',
};

export const gridControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '能力行数', default: 7, min: 4, max: 7, step: 1, describe: '矩阵中的能力维度行数。' },
  { key: 'columnCount', type: 'slider', label: '对比列数', default: 4, min: 2, max: 4, step: 1, describe: '对比的方案列数（最后一列始终为「燃点」）。' },
  { key: 'highlightColumnIndex', type: 'slider', label: '高亮列', default: 3, min: 0, max: 3, step: 1, describe: '需要高亮的列序号（从 0 起，超出列数自动收敛）。' },
  { key: 'showHeadRow', type: 'toggle', label: '表头行', default: true, describe: '顶部的方案名称表头。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '底部的符号含义图例。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function GridSlide(props) {
  injectCSS('ign-grd-css', CSS);
  const p = { ...gridDefaultProps, ...props };
  const ncol = clampInt(p.columnCount, 2, 4);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, clampInt(p.rowCount, 4, 7));
  const colLabels = Array.isArray(p.colLabels) ? p.colLabels : [];
  const cols = [...colLabels.slice(0, ncol - 1), p.usLabel];   // shown column labels
  const colSrc = [...Array(ncol - 1).keys(), 3];           // map shown col → cell index (us = 3)
  const hot = clampInt(p.highlightColumnIndex, 0, ncol - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const headN = p.showHeadRow ? 1 : 0;
  const totalRows = headN + rows.length;

  // hot band geometry (first col is 1.7fr; option cols equal share of remainder)
  const firstFr = 1.7, optFr = 1, totalFr = firstFr + ncol * optFr;
  const bandLeft = (firstFr + hot * optFr) / totalFr * 100;
  const bandWidth = optFr / totalFr * 100;

  return (
    <Slide surface={p.surface} className="ign-grd">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <div className="ign-lock"><div className="ign-wm">IGNIS <em>燃点</em></div></div>
          <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-grd-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-grd-body ign-a2">
          <div className="ign-grd-tbl" style={{ gridTemplateColumns: `${firstFr}fr repeat(${ncol}, ${optFr}fr)` }}>
            <span className="ign-grd-hot" style={{ left: `${bandLeft}%`, width: `${bandWidth}%`, top: 0, bottom: 0, display: 'block' }} />
            {p.showHeadRow && (
              <>
                <div className="ign-grd-cell ign-grd-hd">{p.rowHeadLabel}</div>
                {cols.map((c, i) => (
                  <div key={i} className={`ign-grd-cell ctr ign-grd-hd ${c === p.usLabel ? 'us' : ''}`}>{c === p.usLabel ? <EmberText>{c}</EmberText> : c}</div>
                ))}
              </>
            )}
            {rows.map((r, ri) => (
              <React.Fragment key={ri}>
                <div className="ign-grd-cell" style={ri === rows.length - 1 ? { borderBottom: 'none' } : undefined}>
                  <span className="ign-grd-cap">{r.t}<span className="en">{r.en}</span></span>
                </div>
                {colSrc.map((src, ci) => (
                  <div key={ci} className="ign-grd-cell ctr" style={ri === rows.length - 1 ? { borderBottom: 'none' } : undefined}>
                    <Sym v={r.cells[src]} />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {p.showLegend && (
            <div className="ign-grd-leg">
              <span className="it"><span className="ign-sym full" /> {p.legendFull}</span>
              <span className="it"><span className="ign-sym half" /> {p.legendHalf}</span>
              <span className="it"><span className="ign-sym none" /> {p.legendNone}</span>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '27%' }} /></span> 22 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
