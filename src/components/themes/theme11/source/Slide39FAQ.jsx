/* Slide39FAQ.jsx — IGNIS deck · objection / FAQ table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: faqDefaultProps (complete defaults) + faqControls (1:1).
 *
 * Table page. A two-column ledger of common objections vs our answer, numbered.
 * Distinct from the symbol-coverage Grid, the value Ledger and the tier Compare
 * tables — this one is prose Q/A, framed like an FAQ index.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-faq .ign-frame{justify-content:space-between}
.ign-faq .b1{width:1080px;height:1080px;left:-220px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.3),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-faq .ign-ghost{font-size:560px;right:10px;bottom:-150px}
.ign-faq-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-faq-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-faq-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-faq-head h2 .ign-serif{color:var(--ign-a)}
.ign-faq-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:380px;text-align:right;text-wrap:pretty}
.ign-faq-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-faq-row{display:grid;grid-template-columns:60px 1fr 1.25fr;gap:30px;align-items:start;
  padding:24px 0;border-bottom:1px solid var(--ign-hair)}
.ign-faq-row:first-child{border-top:1px solid var(--ign-hair2)}
.ign-faq-no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:34px;letter-spacing:-0.02em;color:var(--ign-ink3);line-height:1}
.ign-faq-q{font-size:30px;font-weight:700;line-height:1.32;letter-spacing:-0.01em}
.ign-faq-q .qm{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;color:var(--ign-a);margin-right:8px}
.ign-faq-a{font-size:24px;font-weight:300;line-height:1.5;color:var(--ign-ink2);text-wrap:pretty}
.ign-faq-a .am{font-family:'Space Grotesk',sans-serif;font-weight:600;color:var(--ign-a);margin-right:10px;letter-spacing:0.04em}
.ign-faq-row.lit .ign-faq-no{color:var(--ign-a)}
.ign-faq-row.lit{background:linear-gradient(90deg,rgba(255,120,52,0.07),transparent)}
.ign-faq-row.dim{opacity:0.4}
.ign-faq-cap{display:grid;grid-template-columns:60px 1fr 1.25fr;gap:30px;padding-bottom:14px}
.ign-faq-cap div{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-ink3)}
`;

export const faqDefaultProps = {
  surface: 'paper',
  rowCount: 4,
  showColHeads: true,
  showNumbers: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '?',
  railText: 'FAQ — 异议',
  navItems: ['异议'],
  navCurrent: 0,
  ixNo: '39',
  ixLabel: 'FAQ',
  lead: 'The honest answers.',
  headingHtml: '你大概在想的，<span class="ign-ember-text">我们先答了</span>。',
  lede: '把最常见的顾虑摆到台面上——不绕弯子，直接给确定的回答。',
  numLabel: '№',
  qHead: '常见顾虑',
  aHead: '我们的回答',
  qMark: 'Q',
  aMark: 'A',
  qa: [
    { q: '是不是又要长期绑定？', a: '按季度结算，首季不满意全额退。我们靠结果续约，不靠合同锁定。' },
    { q: '多久能看到效果？', a: '14 天内出可量化的首批信号，90 天进入复利区间。每周同步进展。' },
    { q: '我们已经有营销团队了。', a: '我们不替代，我们补齐缺口、放大产能。你的团队 + 我们的引擎。' },
    { q: '数据和归因可信吗？', a: '全链路埋点，自然与付费合并归因，报表你随时可查、可导出。' },
    { q: '预算停了会归零吗？', a: '内容与SEO是沉淀资产，停投后仍持续带量——这正是复利的意义。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 常见顾虑与回答',
  metaMid: '把疑虑摆上台面',
};

export const faqControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '问答行数', default: 4, min: 3, max: 5, step: 1, describe: '问答表的行数。' },
  { key: 'showColHeads', type: 'toggle', label: '列名表头', default: true, describe: '顶部「顾虑 / 我们的回答」列名。' },
  { key: 'showNumbers', type: 'toggle', label: '序号列', default: true, describe: '每行左侧的编号。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后高亮某一行，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要高亮的行序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function FAQSlide(props) {
  injectCSS('ign-faq-css', CSS);
  const p = { ...faqDefaultProps, ...props };
  const n = clampInt(p.rowCount, 3, 5);
  const rows = (Array.isArray(p.qa) ? p.qa : []).slice(0, n);
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const gridCols = p.showNumbers ? '60px 1fr 1.25fr' : '1fr 1.25fr';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-faq">
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

        <div className="ign-faq-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-faq-body ign-a2">
          {p.showColHeads && (
            <div className="ign-faq-cap" style={{ gridTemplateColumns: gridCols }}>
              {p.showNumbers && <div>{p.numLabel}</div>}
              <div>{p.qHead}</div>
              <div>{p.aHead}</div>
            </div>
          )}
          {rows.map((r, i) => {
            const cls = p.emphasis ? (i === emi ? 'lit' : 'dim') : '';
            return (
              <div key={i} className={`ign-faq-row ${cls}`} style={{ gridTemplateColumns: gridCols }}>
                {p.showNumbers && <div className="ign-faq-no">{String(i + 1).padStart(2, '0')}</div>}
                <div className="ign-faq-q"><span className="qm">{p.qMark}</span>{r.q}</div>
                <div className="ign-faq-a"><span className="am">{p.aMark}</span>{r.a}</div>
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '48%' }} /></span> 39 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
