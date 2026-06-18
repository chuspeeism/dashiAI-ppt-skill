/* Slide68Lollipop.jsx — IGNIS deck · horizontal lollipop ranking chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: lollipopDefaultProps (complete defaults) + lollipopControls (1:1).
 *
 * Chart page. Each row is a thin stem from the baseline to a filled dot,
 * encoding a value — lighter ink than a bar, so several series read at once
 * without the page going heavy. Distinct from Ranking (61, solid bars +
 * rank numerals) and Stack (35): the lollipop is the deck's airy magnitude
 * comparison. Lead row is rendered ember.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-lol .ign-frame{justify-content:space-between}
.ign-lol .b1{width:1180px;height:900px;right:-200px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.18),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-lol .ign-ghost{font-size:540px;left:-10px;bottom:-160px}
.ign-lol .ign-eyebrow{white-space:nowrap}
.ign-lol-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-lol-head h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-lol-head h2 .ign-serif{color:var(--ign-a)}
.ign-lol-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:300px;line-height:1.4}
.ign-lol-plot{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:14px;position:relative}
.ign-lol-grid{position:absolute;inset:0;left:230px;right:96px;z-index:0;pointer-events:none}
.ign-lol-gl{position:absolute;top:0;bottom:0;width:1px;background:var(--ign-hair)}
.ign-lol-gx{position:absolute;bottom:-30px;transform:translateX(-50%);font-family:'Space Grotesk',sans-serif;
  font-size:18px;color:var(--ign-ink3)}
.ign-lol-row{position:relative;z-index:1;display:grid;grid-template-columns:230px 1fr 96px;align-items:center;
  gap:0;height:74px}
.ign-lol-nm{display:flex;flex-direction:column;gap:3px;padding-right:24px}
.ign-lol-nm .t{font-size:27px;font-weight:600;letter-spacing:-0.01em}
.ign-lol-row.lead .ign-lol-nm .t{font-weight:700}
.ign-lol-nm .e{font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:0.08em;color:var(--ign-ink3);text-transform:uppercase}
.ign-lol-track{position:relative;height:100%;display:flex;align-items:center}
.ign-lol-stem{position:absolute;left:0;height:3px;border-radius:3px;background:var(--ign-hair2)}
.ign-lol-row.lead .ign-lol-stem{background:linear-gradient(90deg,rgba(255,110,46,0.35),#FF6E2E)}
.ign-lol-dot{position:absolute;width:22px;height:22px;border-radius:50%;transform:translateX(-50%);
  background:var(--ign-ink2);border:3px solid var(--ign-bg);box-shadow:0 0 0 1px var(--ign-hair2)}
.ign-lol-row.lead .ign-lol-dot{width:30px;height:30px;background:linear-gradient(135deg,#FFC07A,#E22A0C);
  box-shadow:0 0 22px rgba(255,110,46,0.6),0 0 0 1px rgba(226,42,12,0.4)}
.ign-lol-val{text-align:right;font-family:'Space Grotesk',sans-serif;font-weight:500;letter-spacing:-0.02em;
  font-size:34px;line-height:1}
.ign-lol-val .u{font-size:0.5em;color:var(--ign-ink2);font-weight:400;margin-left:1px}
.ign-lol-row.lead .ign-lol-val .n{font-size:42px}
.ign-lol-row.dim{opacity:0.34;filter:saturate(0.5)}
`;

/* value drives both stem length and dot position (% of max). Sorted high→low. */
export const lollipopDefaultProps = {
  surface: 'paper',
  itemCount: 6,
  emphasis: true,
  emphasisIndex: 0,
  showValues: true,
  showGrid: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '＋',
  railText: 'Lollipop — 量级',
  navItems: ['量级'],
  navCurrent: 0,
  ixNo: '67',
  ixLabel: 'Lollipop',
  eyebrowNo: '渠道量级',
  eyebrowEn: 'Lift by channel',
  headingHtml: '同一个口径，<span class="ign-ember-text">量级一目了然</span>。',
  noteHtml: '12 个月增量指数<br>（基线 = 100，越远越强）。',
  rows: [
    { nm: '自然搜索', en: 'Organic', val: 182 },
    { nm: '内容矩阵', en: 'Content', val: 138 },
    { nm: '私域复购', en: 'Retention', val: 104 },
    { nm: '社媒互动', en: 'Social', val: 72 },
    { nm: '联盟分发', en: 'Affiliate', val: 49 },
    { nm: '付费投放', en: 'Paid', val: 31 },
  ],
  metaLeft: 'IGNIS — 燃点 · 渠道增量量级（指数化）',
  metaMid: '越远的那颗，越值得加注',
};

export const lollipopControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'itemCount', type: 'slider', label: '条目数量', default: 6, min: 3, max: 6, step: 1, describe: '棒棒糖条目数量（自高到低）。' },
  { key: 'emphasis', type: 'toggle', label: '榜首突出', default: true, describe: '开启后榜首点亮为暖橙并放大圆点，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 5, step: 1, describe: '需要突出的条目序号（从 0 起）。' },
  { key: 'showValues', type: 'toggle', label: '数值标注', default: true, describe: '每行右侧的数值。' },
  { key: 'showGrid', type: 'toggle', label: '刻度网格', default: true, describe: '背景的纵向刻度线与轴标。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function LollipopSlide(props) {
  injectCSS('ign-lol-css', CSS);
  const p = { ...lollipopDefaultProps, ...props };
  const n = clampInt(p.itemCount, 3, 6);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const max = Math.max(...rows.map((r) => r.val));
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const ticks = [0, 50, 100, 150, 200];

  return (
    <Slide surface={p.surface} className="ign-lol">
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

        <div className="ign-lol-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-lol-plot ign-a2">
          {p.showGrid && (
            <div className="ign-lol-grid">
              {ticks.map((t) => (
                <div key={t} className="ign-lol-gl" style={{ left: `${(t / 200) * 100}%` }}>
                  <span className="ign-lol-gx" style={{ left: 0 }}>{t}</span>
                </div>
              ))}
            </div>
          )}
          {rows.map((r, i) => {
            const lead = i === 0;
            const dim = p.emphasis && i !== emi;
            const pct = (r.val / max) * 100;
            return (
              <div key={i} className={`ign-lol-row ${p.emphasis && lead ? 'lead' : ''} ${dim ? 'dim' : ''}`}>
                <div className="ign-lol-nm"><span className="t">{r.nm}</span><span className="e">{r.en}</span></div>
                <div className="ign-lol-track">
                  <span className="ign-lol-stem" style={{ width: `${pct}%` }} />
                  <span className="ign-lol-dot" style={{ left: `${pct}%` }} />
                </div>
                {p.showValues && (
                  <div className="ign-lol-val">
                    {p.emphasis && lead
                      ? <EmberText className="n">{r.val}</EmberText>
                      : <span className="n">{r.val}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 30 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '82%' }} /></span> 67 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
