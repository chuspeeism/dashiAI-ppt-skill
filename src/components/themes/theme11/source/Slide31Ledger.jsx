/* Slide31Ledger.jsx — IGNIS deck · value-ledger table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: ledgerDefaultProps (complete defaults) + ledgerControls (1:1).
 *
 * Table page. A financial-style ledger: line items down the side, cost / return
 * / multiple across, capped by a highlighted net-total row. Distinct from the
 * symbol-coverage Grid and the tier-prose Compare tables.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-led .ign-frame{justify-content:space-between}
.ign-led .b1{width:1080px;height:1080px;right:-200px;top:-160px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.34),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-led .ign-ghost{font-size:520px;left:20px;bottom:-130px}
.ign-led-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-led-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-led-head h2{font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-led-head h2 .ign-serif{color:var(--ign-a)}
.ign-led-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:400px;text-align:right;text-wrap:pretty}
.ign-led-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-led-tbl{display:grid;grid-template-columns:1.7fr 1fr 1fr 0.9fr}
.ign-led-hd{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;
  color:var(--ign-ink3);padding:0 22px 16px;border-bottom:1px solid var(--ign-hair2)}
.ign-led-hd.r{text-align:right}
.ign-led-cell{padding:11px 22px;border-bottom:1px solid var(--ign-hair);display:flex;align-items:baseline}
.ign-led-cell.r{justify-content:flex-end}
.ign-led-it{font-size:28px;font-weight:600;letter-spacing:-0.01em}
.ign-led-it .en{display:block;font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3);margin-top:4px}
.ign-led-num{font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:500;letter-spacing:-0.02em}
.ign-led-num.muted{color:var(--ign-ink2);font-weight:400}
.ign-led-mult{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:600}
.ign-led-row.lit .ign-led-cell{background:rgba(255,120,52,0.07)}
.ign-led-row.dim{opacity:0.4}
.ign-led-net{display:grid;grid-template-columns:1.7fr 1fr 1fr 0.9fr;margin-top:6px;
  background:linear-gradient(90deg,rgba(255,120,52,0.16),rgba(255,120,52,0.05));
  border-top:1px solid rgba(255,160,100,0.45);border-bottom:1px solid rgba(255,160,100,0.45)}
.ign-led-net .ign-led-cell{border-bottom:none;padding:15px 22px;align-items:center}
.ign-led-net .lbl{font-size:30px;font-weight:700}
.ign-led-net .lbl .en{display:block;font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:var(--ign-a);margin-top:4px}
.ign-led-net .big{font-family:'Space Grotesk',sans-serif;font-size:46px;font-weight:600;letter-spacing:-0.03em}
.ign-led-foot{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:23px;color:var(--ign-ink3);margin-top:12px;text-align:right}
`;

export const ledgerDefaultProps = {
  surface: 'paper',
  rowCount: 6,
  showColHeads: true,
  emphasis: false,
  emphasisIndex: 1,
  showNetRow: true,
  showFootNote: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '¥',
  railText: 'Ledger — 账目',
  navItems: ['账目'],
  navCurrent: 0,
  ixNo: '31',
  ixLabel: 'Ledger',
  leadHtml: 'Read it like a P&amp;L.',
  headingHtml: '每一笔投入，<span class="ign-ember-text">都记得清</span>。',
  lede: '把预算摊到每条线上看回报：增长不是玄学，是一张能对账的明细表。',
  colHeads: ['投入项目', '月度投入', '12 月回报', '回报倍数'],
  rows: [
    { it: '搜索与内容', en: 'SEO & Content', cost: '¥38K', gain: '¥182K', mult: '×4.8' },
    { it: '转化率优化', en: 'CRO', cost: '¥22K', gain: '¥150K', mult: '×6.8' },
    { it: '付费投放', en: 'Paid Media', cost: '¥60K', gain: '¥204K', mult: '×3.4' },
    { it: '网站与性能', en: 'Web & Perf', cost: '¥18K', gain: '¥66K', mult: '×3.7' },
    { it: '数据与归因', en: 'Data & Attribution', cost: '¥12K', gain: '¥58K', mult: '×4.8' },
    { it: '一体化协同', en: 'One Team', cost: '¥10K', gain: '¥70K', mult: '×7.0' },
  ],
  netLabel: '净增长价值',
  netEn: 'Net created value',
  netCostLabel: '合计投入',
  netGain: '¥730K',
  netMult: '×4.6',
  footNote: '＊ 数据为中位客户 12 个月口径，含自然与付费合并归因。',
  metaLeft: 'IGNIS — 燃点 · 价值账目表',
  metaMid: '能对账的增长，才是真增长',
};

export const ledgerControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '账目行数', default: 6, min: 3, max: 6, step: 1, describe: '账目表的明细行数。' },
  { key: 'showColHeads', type: 'toggle', label: '表头行', default: true, describe: '顶部的列名表头。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后高亮某一明细行，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 1, min: 0, max: 5, step: 1, describe: '需要高亮的明细行序号（从 0 起）。' },
  { key: 'showNetRow', type: 'toggle', label: '净值汇总行', default: true, describe: '底部高亮的净值/总回报汇总行。' },
  { key: 'showFootNote', type: 'toggle', label: '脚注', default: true, describe: '表格右下角的衬线脚注。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function LedgerSlide(props) {
  injectCSS('ign-led-css', CSS);
  const p = { ...ledgerDefaultProps, ...props };
  const count = clampInt(p.rowCount, 3, 6);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const colHeads = Array.isArray(p.colHeads) ? p.colHeads : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-led">
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

        <div className="ign-led-head ign-a1">
          <div>
            {p.showKicker && <div className="lead" dangerouslySetInnerHTML={{ __html: p.leadHtml }} />}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-led-body ign-a2">
          <div className="ign-led-tbl">
            {p.showColHeads && (
              <>
                <div className="ign-led-hd">{colHeads[0]}</div>
                <div className="ign-led-hd r">{colHeads[1]}</div>
                <div className="ign-led-hd r">{colHeads[2]}</div>
                <div className="ign-led-hd r">{colHeads[3]}</div>
              </>
            )}
            {rows.map((r, i) => {
              const cls = p.emphasis ? (i === emi ? 'lit' : 'dim') : '';
              const last = i === rows.length - 1 && !p.showNetRow;
              const bb = last ? { borderBottom: 'none' } : undefined;
              return (
                <div key={i} className={`ign-led-row ${cls}`} style={{ display: 'contents' }}>
                  <div className="ign-led-cell" style={bb}><span className="ign-led-it">{r.it}<span className="en">{r.en}</span></span></div>
                  <div className="ign-led-cell r" style={bb}><span className="ign-led-num muted">{r.cost}</span></div>
                  <div className="ign-led-cell r" style={bb}><span className="ign-led-num">{r.gain}</span></div>
                  <div className="ign-led-cell r" style={bb}><EmberText className="ign-led-mult">{r.mult}</EmberText></div>
                </div>
              );
            })}
          </div>

          {p.showNetRow && (
            <div className="ign-led-net">
              <div className="ign-led-cell"><span className="lbl">{p.netLabel}<span className="en">{p.netEn}</span></span></div>
              <div className="ign-led-cell r"><span className="ign-led-num muted">{p.netCostLabel}</span></div>
              <div className="ign-led-cell r"><EmberText className="big">{p.netGain}</EmberText></div>
              <div className="ign-led-cell r"><EmberText className="big">{p.netMult}</EmberText></div>
            </div>
          )}

          {p.showFootNote && <div className="ign-led-foot">{p.footNote}</div>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '38%' }} /></span> 31 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
