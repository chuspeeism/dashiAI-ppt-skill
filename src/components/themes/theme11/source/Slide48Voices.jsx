/* Slide48Voices.jsx — IGNIS deck · multi-quote testimonial spread page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: voicesDefaultProps (complete defaults) + voicesControls (1:1).
 *
 * Editorial testimonial spread: one oversized lead pull-quote anchored on the
 * left (ember rule + giant quotation glyph), and the remaining voices as a
 * hairline-separated list on the right. Typographic, not boxed UI cards —
 * distinct from the single attributed Quote (13) and the Manifesto (33).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-vcs .ign-frame{justify-content:space-between}
.ign-vcs .b1{width:1200px;height:1000px;left:24%;top:58%;transform:translate(-50%,-50%);
  background:radial-gradient(48% 50% at 50% 50%,rgba(255,120,52,0.22),rgba(226,42,12,0) 70%);filter:blur(64px)}
.ign-vcs .ign-ghost{font-size:560px;right:0;bottom:-150px}

.ign-vcs-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-vcs-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-vcs-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-vcs-stat{text-align:right;flex:none}
.ign-vcs-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:76px;line-height:0.85;letter-spacing:-0.04em}
.ign-vcs-stat .l{font-size:21px;font-weight:300;color:var(--ign-ink2);margin-top:8px}

.ign-vcs-body{flex:1;display:grid;gap:84px;margin-top:26px;min-height:0;align-items:stretch}
.ign-vcs-body.two{grid-template-columns:560px 1fr}
.ign-vcs-body.solo{grid-template-columns:1fr}

/* lead pull-quote (left anchor) — featured testimonial */
.ign-vcs-lead{position:relative;display:flex;flex-direction:column;justify-content:center;padding-left:44px}
.ign-vcs-lead::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;
  background:var(--ign-ember);border-radius:3px}
.ign-vcs-lead .mark{font-family:'Newsreader','Noto Serif SC',serif;font-weight:800;font-size:170px;line-height:0.5;height:82px;
  color:var(--ign-a);letter-spacing:-0.04em}
.ign-vcs-lead .lq{font-size:46px;line-height:1.3;font-weight:500;letter-spacing:-0.015em;text-wrap:pretty;margin-top:6px}
.ign-vcs-lead .lq .hl{color:var(--ign-a)}
.ign-vcs-lead .rate{display:flex;align-items:center;gap:9px;margin-top:30px}
.ign-vcs-lead .rate i{width:13px;height:13px;background:var(--ign-ember);transform:rotate(45deg)}
.ign-vcs-lead .rate span{font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.12em;color:var(--ign-ink3);margin-left:8px;white-space:nowrap}
.ign-vcs-lead .by{display:flex;align-items:center;gap:16px;margin-top:22px}
.ign-vcs-mono{border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;
  font-family:'Space Grotesk',sans-serif;font-weight:600;color:#1B1108;background:var(--ign-ember)}
.ign-vcs-lead .ign-vcs-mono{width:52px;height:52px;font-size:24px}
.ign-vcs-lead .nm{font-size:25px;font-weight:600;letter-spacing:-0.01em}
.ign-vcs-lead .rl{font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:0.08em;color:var(--ign-ink3);margin-top:3px;white-space:nowrap}

/* supporting voices (right) — equal-height blocks that fill the column */
.ign-vcs-list{display:grid;gap:0 64px;align-content:stretch;min-height:0}
.ign-vcs-item{display:flex;flex-direction:column;justify-content:center;padding:30px 0;border-top:1px solid var(--ign-hair)}
.ign-vcs-item.coltop{border-top:0}
.ign-vcs-item .hd{display:flex;align-items:center;flex-wrap:nowrap;gap:13px;margin-bottom:16px}
.ign-vcs-item .hd .ign-vcs-mono{width:38px;height:38px;font-size:18px}
.ign-vcs-item .hd .nm{font-size:22px;font-weight:600;letter-spacing:-0.01em;white-space:nowrap}
.ign-vcs-item .hd .rl{font-family:'Space Grotesk',sans-serif;font-size:16px;letter-spacing:0.08em;color:var(--ign-ink3);white-space:nowrap}
.ign-vcs-item .hd .sep{width:4px;height:4px;border-radius:50%;background:var(--ign-hair2)}
.ign-vcs-item .q{font-size:27px;line-height:1.42;font-weight:400;letter-spacing:-0.01em;color:var(--ign-ink2);text-wrap:pretty}
.ign-vcs-item .q .hl{color:var(--ign-a)}
`;

export const voicesDefaultProps = {
  surface: 'ink',
  quoteCount: 4,
  columns: 1,
  showLeadQuote: true,
  showBylines: true,
  showStat: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '“',
  railText: 'Voices — 证言',
  navItems: ['证言'],
  navCurrent: 0,
  ixNo: '48',
  ixLabel: 'Voices',
  lead: 'In their words.',
  headingHtml: '不用我们说，<span class="ign-ember-text">听他们说</span>。',
  statValue: '4.9/5',
  statLabel: '客户满意度 · 120+ 合作品牌',
  leadRating: '5.0 · 长期续约',
  quotes: [
    { q: '停掉投放那个月，自然流量反而<span class="hl">还在涨</span>。这才是我们要的增长。', nm: '周岚', rl: 'VOLT · CMO', mono: 'V' },
    { q: '第一次有团队把转化率讲清楚，而不是甩给我一堆漂亮图表。', nm: '李航', rl: 'ARCO · 创始人', mono: 'A' },
    { q: '14 天就出了首批信号，季度复盘直接超了 KPI。', nm: '陈思', rl: 'NIMBUS · 增长负责人', mono: 'N' },
    { q: '一个团队搞定策略到落地，再没有来回扯皮。', nm: '吴桐', rl: 'QUILL · COO', mono: 'Q' },
    { q: '续了第三年——结果说话，比什么承诺都管用。', nm: '何宇', rl: 'FERRO · CEO', mono: 'F' },
  ],
  metaLeft: 'IGNIS — 燃点 · 客户证言',
  metaMid: '结果，会自己说话',
};

export const voicesControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'quoteCount', type: 'slider', label: '证言数量', default: 4, min: 2, max: 5, step: 1, describe: '展示的客户证言数量（含主推）。' },
  { key: 'columns', type: 'slider', label: '列表列数', default: 1, min: 1, max: 2, step: 1, describe: '右侧次要证言的排布列数；证言较多时可用 2 列。' },
  { key: 'showLeadQuote', type: 'toggle', label: '主推证言', default: true, describe: '首条证言作为左侧大号引述锚点；关闭则全部并入列表。' },
  { key: 'showBylines', type: 'toggle', label: '署名', default: true, describe: '每条证言下方的姓名与职务。' },
  { key: 'showStat', type: 'toggle', label: '信任数据', default: true, describe: '右上角的满意度大数字。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function VoicesSlide(props) {
  injectCSS('ign-vcs-css', CSS);
  const p = { ...voicesDefaultProps, ...props };
  const n = clampInt(p.quoteCount, 2, 5);
  const cols = clampInt(p.columns, 1, 2);
  const quotes = (Array.isArray(p.quotes) ? p.quotes : []).slice(0, n);
  const hasLead = p.showLeadQuote;
  const lead = hasLead ? quotes[0] : null;
  const rest = hasLead ? quotes.slice(1) : quotes;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  // distribute the supporting list across `cols` columns; mark first item of
  // each column so its top hairline is suppressed (clean column heads).
  // grid flows row-wise: the first row (i < cols) are column heads → no top rule.

  return (
    <Slide surface={p.surface} className="ign-vcs">
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

        <div className="ign-vcs-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showStat && (
            <div className="ign-vcs-stat"><EmberText className="v">{p.statValue}</EmberText><div className="l">{p.statLabel}</div></div>
          )}
        </div>

        <div className={`ign-vcs-body ${hasLead ? 'two' : 'solo'}`}>
          {hasLead && lead && (
            <div className="ign-vcs-lead ign-a2">
              <div className="mark">“</div>
              <div className="lq" dangerouslySetInnerHTML={{ __html: lead.q }} />
              <div className="rate"><i /><i /><i /><i /><i /><span>{p.leadRating}</span></div>
              {p.showBylines && (
                <div className="by">
                  <span className="ign-vcs-mono">{lead.mono}</span>
                  <div><div className="nm">{lead.nm}</div><div className="rl">{lead.rl}</div></div>
                </div>
              )}
            </div>
          )}

          <div className="ign-vcs-list ign-a3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: '1fr' }}>
            {rest.map((qt, i) => (
              <div key={i} className={`ign-vcs-item ${i < cols ? 'coltop' : ''}`}>
                {p.showBylines && (
                  <div className="hd">
                    <span className="ign-vcs-mono">{qt.mono}</span>
                    <span className="nm">{qt.nm}</span>
                    <span className="sep" />
                    <span className="rl">{qt.rl}</span>
                  </div>
                )}
                <div className="q" dangerouslySetInnerHTML={{ __html: qt.q }} />
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '59%' }} /></span> 48 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
