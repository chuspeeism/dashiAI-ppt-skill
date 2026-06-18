/* Slide61Ranking.jsx — IGNIS deck · horizontal leaderboard big-number page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: rankingDefaultProps (complete defaults) + rankingControls (1:1).
 *
 * Big-number page. A ranked leaderboard of growth levers — each row a giant
 * rank numeral, a name, a proportional bar and an oversized value, with the
 * leader rendered ember and largest. Distinct from Stack (35) and Mix (14,
 * shares) — here the ranking ITSELF is the message, and the #1 value is the
 * slide's hero figure.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-rnk .ign-frame{justify-content:space-between}
.ign-rnk .b1{width:1300px;height:900px;left:54%;top:56%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.24),rgba(226,42,12,0) 70%);filter:blur(62px)}
.ign-rnk .ign-ghost{font-size:560px;right:10px;top:-80px}
.ign-rnk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-rnk-head h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-rnk-head h2 .ign-serif{color:var(--ign-a)}
.ign-rnk-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:300px;line-height:1.4}
.ign-rnk-list{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:18px;gap:4px}
.ign-rnk-row{display:grid;grid-template-columns:96px 1fr 220px;align-items:center;gap:30px;padding:18px 0;border-bottom:1px solid var(--ign-hair)}
.ign-rnk-row:first-child{border-top:1px solid var(--ign-hair)}
.ign-rnk-no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:56px;line-height:0.8;letter-spacing:-0.03em;color:var(--ign-ink3)}
.ign-rnk-row.lead .ign-rnk-no{color:var(--ign-a)}
.ign-rnk-mid{display:flex;flex-direction:column;gap:12px;min-width:0}
.ign-rnk-nm{display:flex;align-items:baseline;gap:14px}
.ign-rnk-nm .t{font-size:30px;font-weight:600;letter-spacing:-0.01em}
.ign-rnk-row.lead .ign-rnk-nm .t{font-size:34px;font-weight:700}
.ign-rnk-nm .e{font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.08em;color:var(--ign-ink3);text-transform:uppercase}
.ign-rnk-bar{height:8px;border-radius:6px;background:var(--ign-panel);overflow:hidden;border:1px solid var(--ign-hair)}
.ign-rnk-fill{height:100%;border-radius:6px;background:var(--ign-hair2)}
.ign-rnk-row.lead .ign-rnk-fill{background:linear-gradient(90deg,#FFC07A,#FF6E2E 55%,#E22A0C)}
.ign-rnk-val{text-align:right;font-family:'Space Grotesk',sans-serif;font-weight:500;letter-spacing:-0.03em;line-height:0.84}
.ign-rnk-val .n{font-size:52px}
.ign-rnk-row.lead .ign-rnk-val .n{font-size:84px}
.ign-rnk-val .u{font-size:0.42em;color:var(--ign-ink2);font-weight:400;margin-left:2px}
.ign-rnk-val .d{font-family:'Space Grotesk',sans-serif;font-size:19px;color:var(--ign-ink3);margin-top:8px;font-weight:400}
.ign-rnk-row.dim{opacity:0.32;filter:saturate(0.5)}
`;

/* sorted high→low; value = headline figure, w = bar fill % (relative to max) */
export const rankingDefaultProps = {
  surface: 'ember',
  rowCount: 5,
  emphasis: true,
  showRankNo: true,
  showBars: true,
  showDelta: true,
  showNote: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '#1',
  railText: 'Ranking — 排行',
  navItems: ['排行'],
  navCurrent: 0,
  ixNo: '60',
  ixLabel: 'Ranking',
  eyebrowNo: '谁在拉增长',
  eyebrowEn: 'What moves the needle',
  headingHtml: '把增长的功劳，<span class="ign-ember-text">按贡献排个序</span>。',
  noteHtml: '12 个月增量归因<br>榜首抵得过后四名之和。',
  unit: '%',
  rows: [
    { nm: '自然搜索', en: 'Organic', val: 182, w: 100, d: '占增量 38%' },
    { nm: '内容分发', en: 'Content', val: 124, w: 68, d: '占增量 24%' },
    { nm: '私域复购', en: 'Retention', val: 96, w: 53, d: '占增量 18%' },
    { nm: '社媒互动', en: 'Social', val: 61, w: 34, d: '占增量 12%' },
    { nm: '付费投放', en: 'Paid', val: 38, w: 21, d: '占增量 8%' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增量归因排行',
  metaMid: '把钱押在第一名上',
};

export const rankingControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '榜单条目', default: 5, min: 3, max: 5, step: 1, describe: '排行榜的条目数量（自高到低）。' },
  { key: 'emphasis', type: 'toggle', label: '榜首突出', default: true, describe: '开启后榜首放大并点亮为暖橙，其余弱化。' },
  { key: 'showRankNo', type: 'toggle', label: '名次序号', default: true, describe: '每行左侧的名次大序号。' },
  { key: 'showBars', type: 'toggle', label: '占比条', default: true, describe: '每行的占比进度条。' },
  { key: 'showDelta', type: 'toggle', label: '占比注释', default: true, describe: '数值下方的占增量注释。' },
  { key: 'showNote', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function RankingSlide(props) {
  injectCSS('ign-rnk-css', CSS);
  const p = { ...rankingDefaultProps, ...props };
  const n = clampInt(p.rowCount, 3, 5);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const max = Math.max(...rows.map((r) => r.w));

  return (
    <Slide surface={p.surface} className="ign-rnk">
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

        <div className="ign-rnk-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showNote && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-rnk-list ign-a2">
          {rows.map((r, i) => {
            const lead = i === 0;
            const dim = p.emphasis && !lead;
            return (
              <div key={i} className={`ign-rnk-row ${p.emphasis && lead ? 'lead' : ''} ${dim ? 'dim' : ''}`}>
                {p.showRankNo && <div className="ign-rnk-no">{String(i + 1).padStart(2, '0')}</div>}
                <div className="ign-rnk-mid" style={p.showRankNo ? null : { gridColumn: '1 / 3' }}>
                  <div className="ign-rnk-nm"><span className="t">{r.nm}</span><span className="e">{r.en}</span></div>
                  {p.showBars && <div className="ign-rnk-bar"><div className="ign-rnk-fill" style={{ width: `${(r.w / max) * 100}%` }} /></div>}
                </div>
                <div className="ign-rnk-val">
                  {p.emphasis && lead
                    ? <EmberText className="n">+{r.val}<span className="u">{p.unit}</span></EmberText>
                    : <span className="n">+{r.val}<span className="u">{p.unit}</span></span>}
                  {p.showDelta && <div className="d">{r.d}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 18 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '73%' }} /></span> 60 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
