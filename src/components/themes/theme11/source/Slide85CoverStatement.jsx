/* Slide85CoverStatement.jsx — IGNIS deck · ALTERNATE COVER C (statement).
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: coverStatementDefaultProps (complete defaults) + coverStatementControls (1:1).
 *
 * Cover variant. An ember-field manifesto: a bold arrow-railed tag bar up top, a
 * giant oversized arrow mark, a three-line statement headline mixing sans +
 * serif-italic with an ember phrase, and a divided stat ribbon along the bottom.
 * Distinct from the poster (A), photo Hero (B) and split panel (D) — the loud,
 * editorial "thesis" opener. No image; pure type + brand devices.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cvm .ign-frame{justify-content:space-between}
.ign-cvm .b1{width:1500px;height:1080px;left:54%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(44% 50% at 50% 50%,rgba(255,150,70,0.42),rgba(255,90,35,0) 70%),
  radial-gradient(60% 60% at 52% 56%,rgba(226,42,12,0.36),rgba(120,20,8,0) 74%);filter:blur(46px)}
.ign-cvm-mid{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-cvm-tagbar{display:flex;align-items:center;gap:18px;font-family:'Space Grotesk',sans-serif;font-size:25px;
  letter-spacing:0.22em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:8px}
.ign-cvm-tagbar .seg{display:flex;align-items:center;gap:18px}
.ign-cvm-tagbar .ar{color:var(--ign-a);font-size:27px}
.ign-cvm-tagbar .line{flex:1;height:1px;background:var(--ign-hair2)}
.ign-cvm-mark{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:140px;line-height:1;
  letter-spacing:-0.04em;margin:22px 0 20px;align-self:flex-start}
.ign-cvm-h{font-size:102px;font-weight:800;line-height:1.44;letter-spacing:-0.035em;text-wrap:balance;align-self:flex-start}
.ign-cvm-h .row{display:block}
.ign-cvm-h em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;letter-spacing:-0.01em}
.ign-cvm-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;
  border-top:1px solid var(--ign-hair);padding-top:26px}
.ign-cvm-ribbon{display:flex;gap:0}
.ign-cvm-stat{padding-right:52px}
.ign-cvm-stat + .ign-cvm-stat{border-left:1px solid var(--ign-hair2);padding-left:52px}
.ign-cvm-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:54px;line-height:0.86;letter-spacing:-0.03em}
.ign-cvm-stat .l{font-size:24px;font-weight:300;color:var(--ign-ink2);margin-top:12px;letter-spacing:0.02em}
.ign-cvm-sign{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.18em;text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap;padding-bottom:6px}
.ign-cvm-sign .ar{font-size:30px;color:var(--ign-a)}
`;

export const coverStatementDefaultProps = {
  surface: 'ember',
  showTagBar: true,
  showMark: true,
  showRibbon: true,
  statCount: 3,
  showSignoff: true,
  showGhostMark: true,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  deckLabel: 'CAPABILITIES DECK',
  deckYear: '2026',
  ghostMark: 'IG',
  tagSegHtml: 'AI 增长引擎<span class="ar">→</span>系统化<span class="ar">→</span>可复利',
  tagYear: '2026',
  markGlyph: '↗',
  headlineHtml: '<span class="row">增长不是运气，</span><span class="row">是一套 <span class="ign-ember-text">可复用</span> 的</span><span class="row"><em>增长系统</em>。</span>',
  signoffText: '向后翻阅',
  stats: [
    { v: '×3.8', l: '平均转化率提升' },
    { v: '+182%', l: '12 个月自然流量' },
    { v: '14 天', l: '首次见效周期' },
  ],
};

export const coverStatementControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showTagBar', type: 'toggle', label: '箭头标签栏', default: true, describe: '顶部的箭头串联标签栏。' },
  { key: 'showMark', type: 'toggle', label: '巨型箭头母题', default: true, describe: '陈述句上方的超大暖橙箭头母题。' },
  { key: 'showRibbon', type: 'toggle', label: '指标条', default: true, describe: '底部的分隔式关键指标条。' },
  { key: 'statCount', type: 'slider', label: '指标数量', default: 3, min: 1, max: 3, step: 1, describe: '指标条中的指标数量。' },
  { key: 'showSignoff', type: 'toggle', label: '翻页提示', default: true, describe: '右下角的箭头母题与翻页提示。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落的超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function CoverStatementSlide(props) {
  injectCSS('ign-cvm-css', CSS);
  const p = { ...coverStatementDefaultProps, ...props };
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, clampInt(p.statCount, 1, 3));

  return (
    <Slide surface={p.surface} className="ign-cvm">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost style={{ fontSize: 340, right: 80, top: '50%', transform: 'translateY(-50%)' }}>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>AI Growth Engine — 燃点</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <span />
          <div className="ign-ix">{p.deckLabel} · <b>{p.deckYear}</b></div>
        </header>

        <div className="ign-cvm-mid">
          {p.showTagBar && (
            <div className="ign-cvm-tagbar ign-a1">
              <span className="seg" dangerouslySetInnerHTML={{ __html: p.tagSegHtml }} />
              <span className="line" /><span>{p.tagYear}</span>
            </div>
          )}
          {p.showMark && <div className="ign-cvm-mark ign-a1"><EmberText>{p.markGlyph}</EmberText></div>}
          <h1 className="ign-cvm-h ign-a2" dangerouslySetInnerHTML={{ __html: p.headlineHtml }} />
        </div>

        <footer className="ign-cvm-foot ign-a3">
          {p.showRibbon ? (
            <div className="ign-cvm-ribbon">
              {stats.map((s, i) => (
                <div key={i} className="ign-cvm-stat"><EmberText className="v">{s.v}</EmberText><div className="l">{s.l}</div></div>
              ))}
            </div>
          ) : <span />}
          {p.showSignoff && <div className="ign-cvm-sign">{p.signoffText} <span className="ar">→</span></div>}
        </footer>
      </Frame>
    </Slide>
  );
}
