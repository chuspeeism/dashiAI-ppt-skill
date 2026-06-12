// ============================================================================
// SlideMatrix.jsx — P66 数据基础设施 / Structured Comparison Table (table_page)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "structured matrix" page: a multi-column comparison table where each
// row is a dimension and the columns carry a figure / example / verdict. Built
// for any "维度 / 模拟数据 / 代表对象 / 判断"-style table. In the demo deck it
// renders P66 数据基础设施 (Scale AI), giving the long deck a table-typed beat.
//
// Visual: case identity header (eyebrow + CJK title + Latin wordmark + CASE idx),
// an optional band of key figures, then a numbered matrix table. One row can be
// pulled out as a full lime focus row (the punch-line dimension); columns can be
// trimmed; row striping (zebra) is a generic table-styling toggle.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   company                          big Latin wordmark (case identity)
//   caseIndex,caseTotal              "CASE NN / total" index (decorative)
//   caseTag                          company badge chip (decorative)
//   figures ({v,k}[])                key-figure band (decorative anchor)
//   columns ({k,en}[])               column headers (col 0 = dimension column)
//   rows ({no,dim,en,cells:[...]}[]) table rows; cells[] align to columns 1..n
//   footRight                        mono caption at the foot-right (decorative)
// PROPS (visual — all map 1:1 to .controls)
//   rowCount (int 3..5)        table rows shown
//   columnCount (int 3..4)     total columns shown (dimension + cells)
//   focusEnabled (bool)        pull one row out as a lime focus row
//   focusIndex (int)           which row
//   showFigures (bool)         key-figure band (decorative anchor)
//   showIndex (bool)           row numbers 01.. (decorative)
//   showCaseIndex (bool)       "CASE NN / total" index (decorative)
//   showTagBadge (bool)        company badge chip (decorative)
//   zebra (bool)               alternating row tint (generic table styling)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-mtx-css')) {
  const css = `
  .kx-mtx-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-mtx-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-mtx-title{font-size:66px;}
  .kx-mtx-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-mtx-id{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right;white-space:nowrap;}
  .kx-mtx-wm{font-family:var(--kx-disp);font-weight:900;letter-spacing:-.02em;line-height:.84;
    font-size:78px;text-transform:none;color:var(--kx-accent);}
  .kx-mtx-idx{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;}
  .kx-mtx-idx b{color:var(--kx-accent);font-weight:700;}

  /* key-figure band */
  .kx-mtx-figs{display:grid;border-bottom:1px solid var(--kx-line);margin-top:26px;}
  .kx-mtx-fig{padding:16px 30px 16px 0;border-right:1px solid var(--kx-line);
    display:flex;flex-direction:column;gap:8px;min-width:0;}
  .kx-mtx-fig:last-child{border-right:none;}
  .kx-mtx-fig .kx-fv{font-family:var(--kx-disp);font-weight:800;font-size:48px;line-height:.86;
    letter-spacing:-.02em;color:var(--kx-accent);overflow-wrap:anywhere;}
  .kx-mtx-fig .kx-fk{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.03em;}

  /* matrix table */
  .kx-mtx-table{flex:1;min-height:0;display:flex;flex-direction:column;margin-top:14px;}
  .kx-mtx-row{display:grid;align-items:center;column-gap:34px;}
  .kx-mtx-colhead{padding:14px 0 12px;border-bottom:1px solid var(--kx-line);}
  .kx-mtx-ch{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:baseline;gap:9px;}
  .kx-mtx-ch b{color:var(--kx-accent);font-weight:700;font-size:16px;}
  .kx-mtx-ch.kx-verdict{color:var(--kx-accent);}

  .kx-mtx-body{flex:1;min-height:0;display:flex;flex-direction:column;}
  .kx-mtx-drow{flex:1;min-height:0;border-bottom:1px solid var(--kx-line);
    padding:0 14px 0 0;position:relative;}
  .kx-mtx-drow.kx-zebra{background:rgba(255,255,255,.022);}
  .kx-mtx-drow.kx-on{background:var(--kx-accent);color:var(--kx-ink);
    margin:0 -22px;padding:0 22px 0 22px;border-bottom-color:transparent;z-index:1;}

  .kx-mtx-no{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);font-weight:700;letter-spacing:.02em;}
  .kx-mtx-drow.kx-on .kx-mtx-no{color:var(--kx-ink);opacity:.55;}

  .kx-mtx-dim{display:flex;flex-direction:column;gap:5px;min-width:0;}
  .kx-mtx-dim .kx-dn{font-family:var(--kx-disp);font-weight:900;font-size:34px;line-height:1;
    letter-spacing:.01em;}
  .kx-mtx-dim .kx-de{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.04em;}
  .kx-mtx-drow.kx-on .kx-de{color:var(--kx-ink);opacity:.62;}

  .kx-mtx-figc{font-family:var(--kx-disp);font-weight:800;font-size:40px;line-height:.92;
    letter-spacing:-.02em;color:var(--kx-accent);overflow-wrap:anywhere;}
  .kx-mtx-drow.kx-on .kx-mtx-figc{color:var(--kx-ink);}

  .kx-mtx-cell{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute);
    letter-spacing:.01em;line-height:1.32;text-wrap:pretty;min-width:0;}
  .kx-mtx-drow.kx-on .kx-mtx-cell{color:var(--kx-ink);}

  .kx-mtx-verdict{font-family:var(--kx-disp);font-weight:600;font-size:24px;color:var(--kx-cream);
    line-height:1.24;letter-spacing:.005em;text-wrap:pretty;min-width:0;display:flex;gap:11px;align-items:baseline;}
  .kx-mtx-verdict::before{content:'';flex:none;width:11px;height:11px;margin-top:4px;
    background:var(--kx-accent);transform:rotate(45deg);}
  .kx-mtx-drow.kx-on .kx-mtx-verdict{color:var(--kx-ink);font-weight:700;}
  .kx-mtx-drow.kx-on .kx-mtx-verdict::before{background:var(--kx-ink);}

  .kx-mtx-foot{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--kx-line);}
  .kx-mtx-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-mtx-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-mtx-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideMatrix(props) {
  const p = { ...SlideMatrix.defaults, ...props };

  // visible columns: col 0 (dimension) + (columnCount-1) cell columns
  const totalCols = clamp(p.columnCount, 3, p.columns.length);
  const cellCols = totalCols - 1;                     // how many of cells[] to show
  const rows = p.rows.slice(0, clamp(p.rowCount, 3, p.rows.length));
  const fi = clamp(p.focusIndex, 0, rows.length - 1);

  // grid template — index? + dimension + N cell columns (last = verdict, widest)
  const idxCol = p.showIndex ? '56px ' : '';
  const cellTemplate = Array.from({ length: cellCols }, (_, i) =>
    i === cellCols - 1 ? 'minmax(0,1.4fr)' : i === 0 ? 'minmax(0,0.85fr)' : 'minmax(0,1fr)').join(' ');
  const gridTemplate = `${idxCol}minmax(0,1.5fr) ${cellTemplate}`;

  // figures band columns
  const figs = p.figures.slice(0, 4);

  // ---- column header row ----------------------------------------------
  const head = h('div', { className: 'kx-mtx-row kx-mtx-colhead', style: { gridTemplateColumns: gridTemplate } },
    p.showIndex ? h('div', { className: 'kx-mtx-ch' }, '#') : null,
    p.columns.slice(0, totalCols).map((c, i) =>
      h('div', { key: i, className: 'kx-mtx-ch' + (i === totalCols - 1 ? ' kx-verdict' : '') },
        c.k, c.en ? h('b', null, c.en) : null)));

  // ---- data rows -------------------------------------------------------
  const body = h('div', { className: 'kx-mtx-body' },
    rows.map((r, ri) => {
      const on = p.focusEnabled && ri === fi;
      const zeb = !on && p.zebra && ri % 2 === 1;
      const cls = 'kx-mtx-drow kx-mtx-row' + (on ? ' kx-on' : zeb ? ' kx-zebra' : '');
      const cells = r.cells.slice(0, cellCols);
      return h('div', { key: ri, className: cls, style: { gridTemplateColumns: gridTemplate } },
        p.showIndex ? h('div', { className: 'kx-mtx-no' }, String(r.no != null ? r.no : ri + 1).padStart(2, '0')) : null,
        h('div', { className: 'kx-mtx-dim' },
          h('span', { className: 'kx-dn' }, r.dim),
          r.en ? h('span', { className: 'kx-de' }, r.en) : null),
        cells.map((cell, ci) => {
          const isFigure = ci === 0;                 // first cell column = figure
          const isVerdict = ci === cellCols - 1;     // last cell column = verdict
          const klass = isFigure ? 'kx-mtx-figc' : isVerdict ? 'kx-mtx-verdict' : 'kx-mtx-cell';
          return h('div', { key: ci, className: klass }, cell);
        }));
    }));

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-mtx-pad' },
      h('div', { className: 'kx-mtx-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-mtx-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-mtx-sub' }, p.subhead)),
        h('div', { className: 'kx-mtx-id' },
          h('div', { className: 'kx-mtx-wm' }, p.company),
          p.showCaseIndex ? h('div', { className: 'kx-mtx-idx' },
            'CASE ', h('b', null, String(p.caseIndex).padStart(2, '0')), ' / ', String(p.caseTotal).padStart(2, '0')) : null)),
      p.showFigures ? h('div', { className: 'kx-mtx-figs', style: { gridTemplateColumns: `repeat(${figs.length},1fr)` } },
        figs.map((f, i) => h('div', { key: i, className: 'kx-mtx-fig' },
          h('div', { className: 'kx-fv' }, f.v),
          h('div', { className: 'kx-fk' }, f.k)))) : null,
      h('div', { className: 'kx-mtx-table' }, head, body),
      h('div', { className: 'kx-mtx-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight || (rows.length + ' DIM × ' + totalCols + ' COL')))));
}

SlideMatrix.defaults = {
  eyebrowId: '66', eyebrowLabel: 'SCALE AI CASE',
  title: '数据基础设施', subhead: 'Scale AI 案例 / DATA INFRASTRUCTURE',
  closing: '数据质量是模型竞争的底层变量。',
  company: 'Scale AI', caseIndex: 5, caseTotal: 9, caseTag: 'CASE · SCALE AI',
  figures: [
    { v: '10 亿$', k: '最大单笔融资 / LARGEST ROUND' },
    { v: '1200 家', k: '企业客户 / ENTERPRISE' },
    { v: '18%', k: '政府客户占比 / GOV SHARE' },
    { v: '3 类', k: '核心业务 / CORE LINES' },
  ],
  columns: [
    { k: '维度', en: 'DIMENSION' },
    { k: '模拟数据', en: 'FIGURE' },
    { k: '代表对象', en: 'EXAMPLE' },
    { k: '判断', en: 'VERDICT' },
  ],
  rows: [
    { no: 1, dim: '数据标注', en: 'DATA LABELING', cells: ['1200 家', '头部模型公司', '高质量训练数据的主入口'] },
    { no: 2, dim: '人类反馈', en: 'RLHF', cells: ['主营业务', '前沿实验室', '对齐质量的关键供给侧'] },
    { no: 3, dim: '模型评测', en: 'EVALUATION', cells: ['18% 政府', '标准机构 · 监管', '能力验证的客观标尺'] },
    { no: 4, dim: '数据飞轮', en: 'DATA FLYWHEEL', cells: ['10 亿$', '企业推理客户', '越用越强的数据护城河'] },
  ],
  footRight: '4 DIM × 4 COL / TABLE',
  rowCount: 4, columnCount: 4,
  focusEnabled: true, focusIndex: 3,
  showFigures: true, showIndex: true, showCaseIndex: true, showTagBadge: true, zebra: true,
  accent: '#c8f135',
};

SlideMatrix.controls = [
  { key: 'rowCount', label: '行数', type: 'number', default: 4, min: 3, max: 5, desc: '展示的维度行数（按数据截取）' },
  { key: 'columnCount', label: '列数', type: 'number', default: 4, min: 3, max: 4, desc: '展示的列数（维度列恒显，3 时省略中间列）' },
  { key: 'focusEnabled', label: '重点行高亮', type: 'toggle', default: true, desc: '是否把某一行拉成整条强调行' },
  { key: 'focusIndex', label: '高亮第几行', type: 'number', default: 3, min: 0, max: 4, desc: '被强调的行序号', showIf: (p) => p.focusEnabled },
  { key: 'showFigures', label: '关键数字带', type: 'toggle', default: true, desc: '显示/隐藏顶部关键数字带（装饰锚点）' },
  { key: 'showIndex', label: '行编号', type: 'toggle', default: true, desc: '显示/隐藏行首序号（装饰）' },
  { key: 'showCaseIndex', label: '案例编号', type: 'toggle', default: true, desc: '显示/隐藏右上角 CASE 编号（装饰）' },
  { key: 'showTagBadge', label: '案例徽标', type: 'toggle', default: true, desc: '显示/隐藏案例徽标占位（装饰）' },
  { key: 'zebra', label: '隔行底色', type: 'toggle', default: true, desc: '表格隔行浅底（通用表格样式）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

// P74 隐私、版权与安全 / Regulation Risk — reuse this matrix as a NON-case
// structured table (showCaseIndex:false, thematic wordmark). Props only.
// Migration: any host can render <SlideMatrix {...SlideMatrix.presetRegRisk} />.
SlideMatrix.presetRegRisk = {
  eyebrowId: '74', eyebrowLabel: 'REGULATION RISK',
  title: '隐私、版权与安全', subhead: '风险 · 监管合规 / COMPLIANCE',
  closing: '合规能力会成为企业采购门槛。',
  company: 'RISK', caseIndex: 2, caseTotal: 5, caseTag: 'RISK · 合规',
  figures: [
    { v: '+42%', k: '合规团队增长 / COMPLIANCE TEAM' },
    { v: '+36%', k: '采购审查周期 / REVIEW CYCLE' },
    { v: '58%', k: '数据隔离需求 / ISOLATION' },
    { v: '19 起', k: '版权风险事件 / IP EVENTS' },
  ],
  columns: [
    { k: '维度', en: 'DIMENSION' },
    { k: '模拟数据', en: 'FIGURE' },
    { k: '代表对象', en: 'EXAMPLE' },
    { k: '判断', en: 'VERDICT' },
  ],
  rows: [
    { no: 1, dim: '隐私合规', en: 'PRIVACY', cells: ['+42%', '金融 · 医疗客户', '数据治理成为采购前置门槛'] },
    { no: 2, dim: '采购审查', en: 'PROCUREMENT', cells: ['+36%', '大型企业 IT', '审查周期拉长交付与回款'] },
    { no: 3, dim: '数据隔离', en: 'ISOLATION', cells: ['58%', '受监管行业', '私有化/隔离部署推高成本'] },
    { no: 4, dim: '版权风险', en: 'COPYRIGHT', cells: ['19 起', '内容生成公司', '训练数据来源的法律敞口'] },
  ],
  footRight: '4 DIM × 4 COL / TABLE',
  rowCount: 4, columnCount: 4,
  focusEnabled: true, focusIndex: 2,
  showFigures: true, showIndex: true, showCaseIndex: false, showTagBadge: true, zebra: true,
  accent: '#c8f135',
};

// 数据来源与口径 / Sources & Scope — reuse this matrix as an appendix table
// (NON-case, showCaseIndex:false, thematic wordmark SOURCES). Maps the generic
// dimension/figure/example/verdict columns to 来源类型/覆盖/代表来源/口径说明.
// Migration: any host can render <SlideMatrix {...SlideMatrix.presetSources} />.
SlideMatrix.presetSources = {
  eyebrowId: '82', eyebrowLabel: 'SOURCES & SCOPE',
  title: '数据来源与口径', subhead: '附录 · 口径说明 / SOURCES & SCOPE',
  closing: '数据为研究估算，引用请注明口径。',
  company: 'SOURCES', caseIndex: 1, caseTotal: 4, caseTag: 'APPENDIX',
  figures: [
    { v: '2024', k: '数据区间 / PERIOD' },
    { v: '≥1 亿$', k: '纳入门槛 / THRESHOLD' },
    { v: '97 笔', k: '样本规模 / SAMPLE' },
    { v: '9 类', k: '赛道划分 / SEGMENTS' },
  ],
  columns: [
    { k: '来源类型', en: 'SOURCE' },
    { k: '覆盖', en: 'COVERAGE' },
    { k: '代表来源', en: 'EXAMPLE' },
    { k: '口径说明', en: 'SCOPE NOTE' },
  ],
  rows: [
    { no: 1, dim: '融资事件库', en: 'DEAL DATABASE', cells: ['97 笔', '一级市场数据库', '单笔 ≥1 亿美元为纳入门槛'] },
    { no: 2, dim: '公司披露', en: 'COMPANY FILINGS', cells: ['头部 12 家', '官方公告 · 新闻稿', '以最大单笔融资作为排名口径'] },
    { no: 3, dim: '行业研究', en: 'MARKET RESEARCH', cells: ['赛道 9 类', '第三方研究 · 投行报告', '赛道占比为模拟估算值'] },
    { no: 4, dim: '公开报道', en: 'PUBLIC PRESS', cells: ['2024 全年', '主流科技与财经媒体', '未披露轮次按区间中值估计'] },
  ],
  footRight: '4 SRC × 4 COL / APPENDIX',
  rowCount: 4, columnCount: 4,
  focusEnabled: true, focusIndex: 0,
  showFigures: true, showIndex: true, showCaseIndex: false, showTagBadge: true, zebra: true,
  accent: '#c8f135',
};

export default SlideMatrix;
