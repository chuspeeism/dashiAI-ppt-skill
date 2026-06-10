/* Slide77Scorecard.jsx — IGNIS deck · rated scorecard table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: scorecardDefaultProps (complete defaults) + scorecardControls (1:1).
 *
 * Table page. Dimensions down the side, each with a 5-dot rating, a numeric
 * score and a delta-vs-benchmark column. Distinct from Versus (47, check/cross),
 * Grid (25, symbol matrix) and Sheet (54, delivery rows): this is the deck's
 * graded scorecard. Lead row is rendered ember. Row count and highlight are
 * prop-driven.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-scr .ign-frame{justify-content:space-between}
.ign-scr .b1{width:1240px;height:860px;left:50%;top:58%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.32),rgba(226,42,12,0) 68%);filter:blur(64px)}
.ign-scr .ign-ghost{font-size:540px;right:0;bottom:-160px}
.ign-scr .ign-eyebrow{white-space:nowrap}
.ign-scr-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-scr-head h2{font-size:56px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-scr-head h2 .ign-serif{color:var(--ign-a)}
.ign-scr-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:300px;line-height:1.4}
.ign-scr-tbl{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:14px}
.ign-scr-colhead,.ign-scr-row{display:grid;grid-template-columns:1.5fr 1fr 150px 150px;align-items:center;gap:28px}
.ign-scr-colhead{padding-bottom:14px;border-bottom:1px solid var(--ign-hair2);
  font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-scr-colhead .r{text-align:right}
.ign-scr-row{padding:19px 0;border-bottom:1px solid var(--ign-hair)}
.ign-scr-dim{display:flex;flex-direction:column;gap:4px}
.ign-scr-dim .t{font-size:27px;font-weight:600;letter-spacing:-0.01em}
.ign-scr-dim .e{font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:0.08em;color:var(--ign-ink3);text-transform:uppercase}
.ign-scr-dots{display:flex;gap:8px}
.ign-scr-dots i{width:15px;height:15px;border-radius:50%;background:var(--ign-hair2)}
.ign-scr-dots i.on{background:var(--ign-ink2)}
.ign-scr-row.lead .ign-scr-dots i.on{background:linear-gradient(135deg,#FFC07A,#E22A0C)}
.ign-scr-score{text-align:right;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:40px;letter-spacing:-0.02em;line-height:1}
.ign-scr-score .u{font-size:0.46em;color:var(--ign-ink3);font-weight:400}
.ign-scr-row.lead .ign-scr-score .n{font-size:48px}
.ign-scr-delta{text-align:right;font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:500;letter-spacing:-0.01em;color:var(--ign-a)}
.ign-scr-delta.flat{color:var(--ign-ink3)}
.ign-scr-row.dim{opacity:0.4;filter:saturate(0.5)}
`;

export const scorecardDefaultProps = {
  surface: 'ember',
  rowCount: 5,
  emphasis: true,
  emphasisIndex: 0,
  showColHeads: true,
  showDots: true,
  showScore: true,
  showDelta: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '★',
  railText: 'Scorecard — 评分',
  navItems: ['评分'],
  navCurrent: 0,
  ixNo: '76',
  ixLabel: 'Scorecard',
  eyebrowNo: '能力评分',
  eyebrowEn: 'Graded',
  headingHtml: '逐项打分，<span class="ign-ember-text">不挑好看的说</span>。',
  noteHtml: '10 分制 · 对标行业基准<br>差值即领先幅度。',
  cols: ['维度 / Dimension', '评级', '得分', '对比基准'],
  scoreUnit: ' /10',
  deltaSuffix: ' vs 基准',
  rows: [
    { nm: '自然增长', en: 'Organic', dots: 5, score: '9.4', delta: '+3.1' },
    { nm: '转化效率', en: 'Conversion', dots: 5, score: '9.0', delta: '+2.4' },
    { nm: '内容资产', en: 'Content', dots: 4, score: '8.2', delta: '+1.8' },
    { nm: '私域复利', en: 'Retention', dots: 4, score: '7.8', delta: '+1.5' },
    { nm: '投放效率', en: 'Paid ROI', dots: 3, score: '6.9', delta: '+0.6' },
  ],
  metaLeft: 'IGNIS — 燃点 · 能力评分卡（对标行业基准）',
  metaMid: '打分这事，不留情面',
};

export const scorecardControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '维度数量', default: 5, min: 3, max: 5, step: 1, describe: '评分卡的维度行数。' },
  { key: 'emphasis', type: 'toggle', label: '首行突出', default: true, describe: '开启后首行点亮为暖橙，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的维度序号（从 0 起）。' },
  { key: 'showColHeads', type: 'toggle', label: '列表头', default: true, describe: '顶部的列标题行。' },
  { key: 'showDots', type: 'toggle', label: '评级圆点', default: true, describe: '每行的 5 点评级。' },
  { key: 'showScore', type: 'toggle', label: '得分', default: true, describe: '每行的 10 分制得分。' },
  { key: 'showDelta', type: 'toggle', label: '对比基准', default: true, describe: '每行相对行业基准的差值列。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ScorecardSlide(props) {
  injectCSS('ign-scr-css', CSS);
  const p = { ...scorecardDefaultProps, ...props };
  const n = clampInt(p.rowCount, 3, 5);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const cols = Array.isArray(p.cols) ? p.cols : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-scr">
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

        <div className="ign-scr-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-scr-tbl ign-a2">
          {p.showColHeads && (
            <div className="ign-scr-colhead">
              <span>{cols[0]}</span>
              <span>{p.showDots ? cols[1] : ''}</span>
              <span className="r">{p.showScore ? cols[2] : ''}</span>
              <span className="r">{p.showDelta ? cols[3] : ''}</span>
            </div>
          )}
          {rows.map((r, i) => {
            const lead = i === 0;
            const dim = p.emphasis && i !== emi;
            return (
              <div key={i} className={`ign-scr-row ${p.emphasis && lead ? 'lead' : ''} ${dim ? 'dim' : ''}`}>
                <div className="ign-scr-dim"><span className="t">{r.nm}</span><span className="e">{r.en}</span></div>
                {p.showDots
                  ? <div className="ign-scr-dots">{Array.from({ length: 5 }).map((_, k) => <i key={k} className={k < r.dots ? 'on' : ''} />)}</div>
                  : <span />}
                {p.showScore
                  ? <div className="ign-scr-score">{p.emphasis && lead ? <EmberText className="n">{r.score}</EmberText> : <span className="n">{r.score}</span>}<span className="u">{p.scoreUnit}</span></div>
                  : <span />}
                {p.showDelta
                  ? <div className="ign-scr-delta">{r.delta}<span style={{ fontSize: '0.7em', color: 'var(--ign-ink3)' }}>{p.deltaSuffix}</span></div>
                  : <span />}
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 16 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '93%' }} /></span> 76 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
