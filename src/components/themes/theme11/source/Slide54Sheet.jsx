/* Slide54Sheet.jsx — IGNIS deck · service spec / rate-sheet table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: sheetDefaultProps (complete defaults) + sheetControls (1:1).
 *
 * Table page. A dense 4-column delivery sheet (module / cadence / deliverables
 * / measured-by), one row per service module, with an optional highlighted row.
 * Distinct from Compare (17, plan tiers w/ hero column), Versus (47, check/cross)
 * and Ledger (31, P&L) — this is the deck's straight specification sheet.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-sht .ign-frame{justify-content:space-between}
.ign-sht .b1{width:1400px;height:760px;left:50%;top:56%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.22),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-sht .ign-ghost{font-size:520px;right:20px;top:-60px}
.ign-sht-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:20px}
.ign-sht-head h2{font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-sht-head h2 .ign-serif{color:var(--ign-a)}
.ign-sht-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:25px;color:var(--ign-ink3);text-align:right;max-width:360px;line-height:1.4}
.ign-sht-table{margin-top:24px}
.ign-sht-row{display:grid;grid-template-columns:1.05fr 0.62fr 1.7fr 1.05fr;align-items:center;column-gap:32px}
.ign-sht-hr{padding-bottom:16px;border-bottom:1px solid var(--ign-hair2)}
.ign-sht-hr .h{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-sht-r{padding:16px 0;border-bottom:1px solid var(--ign-hair)}
.ign-sht-r .m{display:flex;flex-direction:column;gap:5px}
.ign-sht-r .m .mn{font-size:29px;font-weight:700;letter-spacing:-0.01em}
.ign-sht-r .m .me{font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.08em;color:var(--ign-ink3)}
.ign-sht-r .cad{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:500;color:var(--ign-ink)}
.ign-sht-r .dl{font-size:24px;font-weight:300;color:var(--ign-ink2);line-height:1.4;text-wrap:pretty}
.ign-sht-r .mb{font-size:24px;font-weight:500;color:var(--ign-ink);display:flex;align-items:center;gap:10px}
.ign-sht-r .mb::before{content:"→";color:var(--ign-a);font-family:'Space Grotesk',sans-serif}
.ign-sht-r.lit{position:relative}
.ign-sht-r.lit .mn{color:var(--ign-a)}
.ign-sht-r.lit::before{content:"";position:absolute;left:-22px;right:-22px;top:0;bottom:0;z-index:-1;
  background:linear-gradient(90deg,rgba(255,110,46,0.12),rgba(255,110,46,0.02));
  border-top:1px solid var(--ign-hair2);border-bottom:1px solid var(--ign-hair2)}
.ign-sht-foot{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);margin-top:18px}
`;

export const sheetDefaultProps = {
  surface: 'ink',
  rowCount: 6,
  showColHeads: true,
  emphasis: true,
  emphasisIndex: 0,
  showKicker: true,
  showFootNote: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '§',
  railText: 'Spec — 明细',
  navItems: ['明细'],
  navCurrent: 0,
  ixNo: '53',
  ixLabel: 'Spec',
  eyebrowNo: '交付明细',
  eyebrowEn: 'What you get',
  headingHtml: '每个模块，<span class="ign-ember-text">怎么交、怎么量</span>。',
  noteHtml: '一份预算，<br>一张清单说清楚。',
  cols: ['模块 · Module', '周期 · Cadence', '关键交付 · Deliverables', '衡量指标 · Measured by'],
  rows: [
    { mn: '搜索增长', me: 'SEARCH', cad: '持续', dl: '技术 SEO · 内容矩阵 · 权威外链', mb: '自然流量 / 关键词排名' },
    { mn: '转化优化', me: 'CONVERT', cad: '4 周冲刺', dl: '落地页重写 · 路径梳理 · A/B 测试', mb: '转化率 / 单客成本' },
    { mn: '付费投放', me: 'PAID', cad: '月度', dl: '渠道组合 · 创意迭代 · 预算调度', mb: 'ROAS / 获客成本' },
    { mn: '内容引擎', me: 'CONTENT', cad: '双周', dl: '选题 · 制作 · 多渠道分发', mb: '触达 / 互动率' },
    { mn: '数据看板', me: 'DATA', cad: '实时', dl: '指标定义 · 归因模型 · 自动报表', mb: '全链路可见' },
    { mn: '增长复盘', me: 'REVIEW', cad: '月度', dl: '结论沉淀 · 下阶段路线图', mb: '目标达成率' },
  ],
  footNote: '* 各模块按需组合，周期可随阶段目标调整；具体交付以诊断后的路线图为准。',
  metaLeft: 'IGNIS — 燃点 · 服务交付明细',
  metaMid: '说得清，才交付得了',
};

export const sheetControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '模块行数', default: 6, min: 4, max: 6, step: 1, describe: '明细表的模块（行）数量。' },
  { key: 'showColHeads', type: 'toggle', label: '表头行', default: true, describe: '列标题行的显示与隐藏。' },
  { key: 'emphasis', type: 'toggle', label: '高亮某行', default: true, describe: '开启后高亮某一模块行。' },
  { key: 'emphasisIndex', type: 'slider', label: '高亮行序号', default: 0, min: 0, max: 5, step: 1, describe: '需要高亮的模块行序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showFootNote', type: 'toggle', label: '脚注', default: true, describe: '表格下方的衬线脚注。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function SheetSlide(props) {
  injectCSS('ign-sht-css', CSS);
  const p = { ...sheetDefaultProps, ...props };
  const rc = clampInt(p.rowCount, 4, 6);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, rc);
  const COLS = Array.isArray(p.cols) ? p.cols : [];
  const emi = clampInt(p.emphasisIndex, 0, rc - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-sht">
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

        <div className="ign-sht-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-sht-table ign-a2">
          {p.showColHeads && (
            <div className="ign-sht-row ign-sht-hr">
              {COLS.map((c, i) => <span key={i} className="h">{c}</span>)}
            </div>
          )}
          {rows.map((r, i) => (
            <div key={i} className={`ign-sht-row ign-sht-r ${p.emphasis && i === emi ? 'lit' : ''}`}>
              <div className="m"><span className="mn">{r.mn}</span><span className="me">{r.me}</span></div>
              <div className="cad">{r.cad}</div>
              <div className="dl">{r.dl}</div>
              <div className="mb">{r.mb}</div>
            </div>
          ))}
          {p.showFootNote && <div className="ign-sht-foot">{p.footNote}</div>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '65%' }} /></span> 53 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
