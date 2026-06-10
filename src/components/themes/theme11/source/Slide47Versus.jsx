/* Slide47Versus.jsx — IGNIS deck · us-vs-them comparison checklist table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: versusDefaultProps (complete defaults) + versusControls (1:1).
 *
 * Table page. Criteria rows × two columns (燃点 / 传统代理) with check / cross
 * marks and short notes. Distinct from the tier-pricing Compare, the symbol
 * Grid, the value Ledger and the Q/A FAQ tables — this is a head-to-head check.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-vss .ign-frame{justify-content:space-between}
.ign-vss .b1{width:1080px;height:1080px;right:-200px;top:-160px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.32),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-vss .ign-ghost{font-size:520px;left:20px;bottom:-130px}
.ign-vss-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-vss-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-vss-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-vss-head h2 .ign-serif{color:var(--ign-a)}
.ign-vss-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:380px;text-align:right;text-wrap:pretty}
.ign-vss-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-vss-tbl{display:grid;grid-template-columns:1.5fr 1.1fr 1.1fr}
.ign-vss-ch{padding:0 26px 18px;display:flex;flex-direction:column;gap:4px;border-bottom:1px solid var(--ign-hair2)}
.ign-vss-ch.us{background:linear-gradient(180deg,rgba(255,120,52,0.12),transparent)}
.ign-vss-ch .nm{font-size:30px;font-weight:800;letter-spacing:-0.01em}
.ign-vss-ch.us .nm{color:var(--ign-a)}
.ign-vss-ch .en{font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-vss-cell{padding:18px 26px;border-bottom:1px solid var(--ign-hair);display:flex;align-items:center;gap:16px}
.ign-vss-cell.us{background:rgba(255,120,52,0.05)}
.ign-vss-crit{font-size:26px;font-weight:600;letter-spacing:-0.01em}
.ign-vss-mk{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;
  font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:22px}
.ign-vss-mk.y{background:var(--ign-ember);color:#1B1108}
.ign-vss-mk.n{background:transparent;border:1.5px solid var(--ign-hair2);color:var(--ign-ink3)}
.ign-vss-tx{font-size:22px;font-weight:300;line-height:1.32;color:var(--ign-ink2);text-wrap:pretty}
.ign-vss-cell.us .ign-vss-tx{color:var(--ign-ink)}
`;

export const versusDefaultProps = {
  surface: 'paper',
  rowCount: 4,
  showColHeads: true,
  showNotes: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '✓',
  railText: 'Versus — 对比',
  navItems: ['对比'],
  navCurrent: 0,
  ixNo: '47',
  ixLabel: 'Versus',
  lead: 'Same brief, different model.',
  headingHtml: '同样的活，<span class="ign-ember-text">不一样的接法</span>。',
  lede: '把我们和传统代理摆在一张表里——你最在意的那几项，差别一眼就看得出。',
  critHead: '对比维度',
  critHeadEn: 'Criteria',
  usHead: '燃点',
  usHeadEn: 'IGNIS',
  themHead: '传统代理',
  themHeadEn: 'Legacy agency',
  rows: [
    { crit: '按结果计费', us: [true, '季度结算，不满意退款'], them: [false, '预付坑位，先收钱'] },
    { crit: '全链路一体', us: [true, '策略到工程一个团队'], them: [false, '环节割裂，反复交接'] },
    { crit: '数据可对账', us: [true, '埋点透明，随时可查'], them: [false, '报表美化，归因模糊'] },
    { crit: '资产可沉淀', us: [true, '停投后仍持续带量'], them: [false, '停投即归零'] },
    { crit: '响应速度', us: [true, '周级迭代'], them: [false, '月级排期'] },
  ],
  yesMark: '✓',
  noMark: '✕',
  metaLeft: 'IGNIS — 燃点 · 与传统代理对比',
  metaMid: '差别，写在表里',
};

export const versusControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '对比项数', default: 4, min: 3, max: 5, step: 1, describe: '对比清单的标准行数。' },
  { key: 'showColHeads', type: 'toggle', label: '列表头', default: true, describe: '顶部「燃点 / 传统代理」列头。' },
  { key: 'showNotes', type: 'toggle', label: '说明文案', default: true, describe: '每个对勾旁的简短说明。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后高亮某一对比项，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要高亮的对比项序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function VersusSlide(props) {
  injectCSS('ign-vss-css', CSS);
  const p = { ...versusDefaultProps, ...props };
  const n = clampInt(p.rowCount, 3, 5);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const Cell = ({ data, us, last, dim }) => {
    const [yes, note] = data;
    const st = { ...(last ? { borderBottom: 'none' } : {}), ...(dim ? { opacity: 0.4 } : {}) };
    return (
      <div className={`ign-vss-cell ${us ? 'us' : ''}`} style={st}>
        <span className={`ign-vss-mk ${yes ? 'y' : 'n'}`}>{yes ? p.yesMark : p.noMark}</span>
        {p.showNotes && <span className="ign-vss-tx">{note}</span>}
      </div>
    );
  };

  return (
    <Slide surface={p.surface} className="ign-vss">
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

        <div className="ign-vss-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-vss-body ign-a2">
          <div className="ign-vss-tbl">
            {p.showColHeads && (
              <>
                <div className="ign-vss-ch"><span className="nm">{p.critHead}</span><span className="en">{p.critHeadEn}</span></div>
                <div className="ign-vss-ch us"><span className="nm">{p.usHead}</span><span className="en">{p.usHeadEn}</span></div>
                <div className="ign-vss-ch"><span className="nm">{p.themHead}</span><span className="en">{p.themHeadEn}</span></div>
              </>
            )}
            {rows.map((r, i) => {
              const last = i === rows.length - 1;
              const dim = p.emphasis && i !== emi;
              return (
                <React.Fragment key={i}>
                  <div className="ign-vss-cell" style={{ opacity: dim ? 0.4 : 1, ...(last ? { borderBottom: 'none' } : {}) }}>
                    <span className="ign-vss-crit">{r.crit}</span>
                  </div>
                  <Cell data={r.us} us last={last} dim={dim} />
                  <Cell data={r.them} last={last} dim={dim} />
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '57%' }} /></span> 47 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
