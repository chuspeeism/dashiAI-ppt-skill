/* Slide17Compare.jsx — IGNIS deck · comparison-table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: compareDefaultProps (complete defaults) + compareControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cmp .ign-frame{justify-content:space-between}
.ign-cmp .b1{width:1500px;height:760px;left:50%;top:54%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.24),rgba(226,42,12,0) 70%);filter:blur(58px)}
.ign-cmp .ign-ghost{font-size:540px;right:30px;top:-80px}
.ign-cmp-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:30px;gap:48px}
.ign-cmp-head h2{font-size:64px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-cmp-head h2 .ign-serif{color:var(--ign-a)}
.ign-cmp-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:26px;color:var(--ign-ink3);max-width:360px;text-align:right;line-height:1.4}
.ign-cmp-table{margin-top:30px;width:100%}
.ign-cmp-row{display:grid;align-items:center}
.ign-cmp-row .c{padding:22px 28px}
.ign-cmp-row .rk{font-size:28px;font-weight:700}
.ign-cmp-head-row .c{padding-bottom:20px}
.ign-cmp-head-row .hc{display:flex;flex-direction:column;gap:6px}
.ign-cmp-head-row .hc .hn{font-size:30px;font-weight:700}
.ign-cmp-head-row .hc .ht{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-cmp-head-row .hc.hero .hn{color:var(--ign-a)}
.ign-cmp-body .ign-cmp-row{border-top:1px solid var(--ign-hair)}
.ign-cmp-body .ign-cmp-row:last-child{border-bottom:1px solid var(--ign-hair)}
.ign-cmp-cell{font-size:27px;font-weight:300;color:var(--ign-ink2);display:flex;align-items:center;gap:14px}
.ign-cmp-cell.hero{color:var(--ign-ink);font-weight:500}
.ign-cmp-cell .mk{font-family:'Space Grotesk',sans-serif;font-size:24px;flex:none}
.ign-cmp-cell.hero .mk{color:var(--ign-a)}
.ign-cmp-cell.muted{color:var(--ign-ink3)}
.ign-cmp-herocol{position:relative;background:linear-gradient(180deg,rgba(255,110,46,0.10),rgba(255,110,46,0.03));
  border-left:1px solid var(--ign-hair2);border-right:1px solid var(--ign-hair2)}
.ign-cmp-herocap{position:absolute;left:0;right:0;top:-1px;height:3px;background:linear-gradient(90deg,var(--ign-a),var(--ign-b))}
.ign-cmp-foot{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:26px;color:var(--ign-ink3);margin-top:22px}
`;

export const compareDefaultProps = {
  surface: 'ember',
  columnCount: 3,
  rowCount: 6,
  highlightColumnIndex: 0,
  showHeadRow: true,
  showKicker: true,
  showFootNote: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'VS',
  railText: 'Compare — 对比',
  navItems: ['对比'],
  navCurrent: 0,
  ixNo: '14',
  ixLabel: 'Compare',
  eyebrowNo: '14',
  eyebrowText: 'Why one team wins',
  headingHtml: '一支团队，<span class="ign-ember-text">胜过一堆外包</span>。',
  noteHtml: '同样的预算，<br>放在哪里更划算？',
  cols: [
    { hn: '燃点 IGNIS', ht: 'One team' },
    { hn: '传统代理', ht: 'Agency' },
    { hn: '自建团队', ht: 'In-house' },
  ],
  rows: [
    { k: '上线速度', cells: ['14 天见效', '45–90 天', '3–6 个月'] },
    { k: '数据透明', cells: ['全程可见', '月度报告', '视情况而定'] },
    { k: '月度成本', cells: ['一份预算', '多笔外包', '多份全职薪资'] },
    { k: '渠道覆盖', cells: ['搜索 + 投放 + 内容', '按项目拆分', '受限于人手'] },
    { k: '灵活度', cells: ['随时调整', '合同绑定', '招聘周期'] },
    { k: '结果归属', cells: ['对增长负责', '对交付负责', '对任务负责'] },
  ],
  footNote: '* 数据为典型合作场景下的中位表现，具体以诊断结果为准。',
  metaLeft: 'IGNIS — 燃点 · 方案对比',
  metaMid: '省下的，都是利润',
};

export const compareControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'columnCount', type: 'slider', label: '对比列数', default: 3, min: 2, max: 3, step: 1, describe: '参与对比的方案列数。' },
  { key: 'rowCount', type: 'slider', label: '对比行数', default: 6, min: 3, max: 6, step: 1, describe: '对比维度（行）的数量。' },
  { key: 'highlightColumnIndex', type: 'slider', label: '高亮列', default: 0, min: 0, max: 2, step: 1, describe: '需要高亮的方案列序号（从 0 起，默认燃点列）。' },
  { key: 'showHeadRow', type: 'toggle', label: '表头行', default: true, describe: '方案名称表头行的显示与隐藏。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showFootNote', type: 'toggle', label: '脚注', default: true, describe: '表格下方的衬线脚注。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function CompareSlide(props) {
  injectCSS('ign-cmp-css', CSS);
  const p = { ...compareDefaultProps, ...props };
  const cc = clampInt(p.columnCount, 2, 3);
  const rc = clampInt(p.rowCount, 3, 6);
  const cols = (Array.isArray(p.cols) ? p.cols : []).slice(0, cc);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, rc);
  const hero = clampInt(p.highlightColumnIndex, 0, cc - 1);
  const gridCols = `1.05fr ${cols.map(() => '1fr').join(' ')}`;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-cmp">
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

        <div className="ign-cmp-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 18 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowText}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-cmp-table ign-a2">
          {p.showHeadRow && (
            <div className="ign-cmp-row ign-cmp-head-row" style={{ gridTemplateColumns: gridCols }}>
              <div className="c" />
              {cols.map((co, ci) => (
                <div key={ci} className={`c ${ci === hero ? 'ign-cmp-herocol' : ''}`}>
                  {ci === hero && <span className="ign-cmp-herocap" />}
                  <div className={`hc ${ci === hero ? 'hero' : ''}`}><span className="hn">{co.hn}</span><span className="ht">{co.ht}</span></div>
                </div>
              ))}
            </div>
          )}
          <div className="ign-cmp-body">
            {rows.map((r, ri) => (
              <div key={ri} className="ign-cmp-row" style={{ gridTemplateColumns: gridCols }}>
                <div className="c"><span className="rk">{r.k}</span></div>
                {cols.map((_, ci) => (
                  <div key={ci} className={`c ${ci === hero ? 'ign-cmp-herocol' : ''}`}>
                    <span className={`ign-cmp-cell ${ci === hero ? 'hero' : ci === cc - 1 ? 'muted' : ''}`}>
                      <span className="mk">{ci === hero ? '✦' : '·'}</span>{r.cells[ci]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {p.showFootNote && <div className="ign-cmp-foot">{p.footNote}</div>}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '26%' }} /></span> 21 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
