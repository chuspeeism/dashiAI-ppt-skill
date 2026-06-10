/* Slide57PainGain.jsx — IGNIS deck · pain → solution paired-list page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: painGainDefaultProps (complete defaults) + painGainControls (1:1).
 *
 * Regular text page. Each row pairs a pain on the left with the IGNIS answer on
 * the right, joined by the deck's arrow motif. Distinct from FAQ (39, Q/A) and
 * Versus (47, check/cross table) — this is the deck's transformation pairing.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-pg .ign-frame{justify-content:space-between}
.ign-pg .b1{width:1300px;height:820px;left:56%;top:56%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.26),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-pg .ign-ghost{font-size:540px;left:10px;bottom:-150px}
.ign-pg-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:26px}
.ign-pg-head h2{font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-pg-head h2 .ign-serif{color:var(--ign-a)}
.ign-pg-head .lab{display:flex;gap:0;align-items:flex-end}
.ign-pg-head .lab span{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-pg-list{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:18px;border-top:1px solid var(--ign-hair)}
.ign-pg-row{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:40px;padding:26px 0;border-bottom:1px solid var(--ign-hair)}
.ign-pg-pain{display:flex;align-items:baseline;gap:18px}
.ign-pg-pain .no{font-family:'Space Grotesk',sans-serif;font-size:22px;color:var(--ign-ink3);flex:none;width:30px}
.ign-pg-pain .tx{font-size:30px;font-weight:300;color:var(--ign-ink3);line-height:1.3;text-wrap:pretty}
.ign-pg-arrow{font-family:'Space Grotesk',sans-serif;font-size:34px;color:var(--ign-a);flex:none;line-height:1}
.ign-pg-gain .tx{font-size:30px;font-weight:600;color:var(--ign-ink);line-height:1.3;text-wrap:pretty}
.ign-pg-gain .tx b{font-weight:600}
.ign-pg-row.dim{opacity:0.34;filter:saturate(0.5)}
.ign-pg-foot{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);margin-top:22px}
`;

export const painGainDefaultProps = {
  surface: 'ember',
  pairCount: 4,
  showArrows: true,
  showColLabels: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showFootLine: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '→',
  railText: 'Shift — 痛点',
  navItems: ['痛点'],
  navCurrent: 0,
  ixNo: '56',
  ixLabel: 'Shift',
  eyebrowNo: '从痛点到解法',
  eyebrowEn: 'Old way → IGNIS',
  headingHtml: '把每一个老问题，<span class="ign-ember-text">翻成新答案</span>。',
  colLabel: '过去这样 → 现在这样',
  pairs: [
    { p: '流量买来就走，留不住', g: '内容沉淀成资产，复利留存' },
    { p: '报表一大堆，看不懂赚没赚', g: '一块看板，直接对齐利润' },
    { p: '换了三家代理，各说各话', g: '一支团队，对增长负责' },
    { p: '投放一停，增长就停', g: '自然流量托底，越滚越大' },
  ],
  footLine: '同样的预算，换一种活法——把花掉的流量，变成攒下的资产。',
  metaLeft: 'IGNIS — 燃点 · 痛点与解法',
  metaMid: '问题没变，答法变了',
};

export const painGainControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'pairCount', type: 'slider', label: '配对数量', default: 4, min: 2, max: 4, step: 1, describe: '痛点→解法配对的数量。' },
  { key: 'showArrows', type: 'toggle', label: '箭头母题', default: true, describe: '痛点与解法之间的箭头。' },
  { key: 'showColLabels', type: 'toggle', label: '列标签', default: true, describe: '顶部「痛点 / 解法」列标签。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一对，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的配对序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showFootLine', type: 'toggle', label: '收束句', default: true, describe: '列表下方的衬线收束句。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PainGainSlide(props) {
  injectCSS('ign-pg-css', CSS);
  const p = { ...painGainDefaultProps, ...props };
  const n = clampInt(p.pairCount, 2, 4);
  const pairs = (Array.isArray(p.pairs) ? p.pairs : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-pg">
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

        <div className="ign-pg-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showColLabels && (
            <div className="lab" style={{ display: 'grid', gridTemplateColumns: '1fr', textAlign: 'right' }}>
              <span>{p.colLabel}</span>
            </div>
          )}
        </div>

        <div className="ign-pg-list ign-a2">
          {pairs.map((pr, i) => (
            <div key={i} className={`ign-pg-row ${p.emphasis && i !== emi ? 'dim' : ''}`}>
              <div className="ign-pg-pain"><span className="no">{String(i + 1).padStart(2, '0')}</span><span className="tx">{pr.p}</span></div>
              <span className="ign-pg-arrow">{p.showArrows ? '→' : '·'}</span>
              <div className="ign-pg-gain"><span className="tx">{pr.g}</span></div>
            </div>
          ))}
        </div>

        {p.showFootLine && <div className="ign-pg-foot">{p.footLine}</div>}

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '68%' }} /></span> 56 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
