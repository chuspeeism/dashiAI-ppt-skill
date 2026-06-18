/* Slide36Bridge.jsx — IGNIS deck · waterfall (bridge) decomposition chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: bridgeDefaultProps (complete defaults) + bridgeControls (1:1).
 *
 * Chart page. A waterfall that decomposes growth: baseline → +increments →
 * total. Floating bars + dashed connectors. Distinct from every other chart in
 * the deck (line, donut, funnel, radar, rings, stacked column).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-brg .ign-frame{justify-content:space-between}
.ign-brg .b1{width:1300px;height:900px;left:50%;top:56%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,130,60,0.28),rgba(255,90,35,0) 70%);filter:blur(62px)}
.ign-brg .ign-ghost{font-size:520px;right:10px;bottom:-130px}
.ign-brg-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-brg-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-brg-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-brg-head h2 .ign-serif{color:var(--ign-a)}
.ign-brg-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:380px;text-align:right;text-wrap:pretty}
.ign-brg-body{flex:1;display:flex;flex-direction:column;justify-content:flex-end;margin-top:18px}
.ign-brg-plot{position:relative;display:grid;align-items:end;gap:5%;height:540px;padding:0 6px;
  border-bottom:1px solid var(--ign-hair2)}
.ign-brg-col{position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end}
.ign-brg-bar{position:relative;width:100%;border-radius:3px 3px 0 0}
.ign-brg-bar.base{background:var(--ign-ink4)}
.ign-brg-bar.inc{background:var(--ign-ember);box-shadow:inset 0 0 26px rgba(255,200,150,0.35)}
.ign-brg-bar.tot{background:linear-gradient(180deg,rgba(255,150,70,0.9),rgba(226,42,12,0.85));box-shadow:0 0 28px rgba(255,110,46,0.4)}
.ign-brg-val{position:absolute;top:-40px;left:0;right:0;text-align:center;font-family:'Space Grotesk',sans-serif;
  font-weight:600;font-size:26px;letter-spacing:-0.02em}
.ign-brg-val.pos{color:var(--ign-a)}
.ign-brg-conn{position:absolute;height:0;border-top:1.5px dashed var(--ign-hair2);z-index:0}
.ign-brg-x{display:grid;gap:5%;padding:18px 6px 0}
.ign-brg-xl{text-align:center}
.ign-brg-xl .zh{font-size:23px;font-weight:600;color:var(--ign-ink)}
.ign-brg-xl .en{display:block;font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3);margin-top:4px}
.ign-brg-col.dim{opacity:0.34;filter:saturate(0.5)}
`;

export const bridgeDefaultProps = {
  surface: 'paper',
  stepCount: 4,
  showConnectors: true,
  showValues: true,
  showBaseline: true,
  showTotal: true,
  emphasis: false,
  emphasisIndex: 1,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↗',
  railText: 'Bridge — 拆解',
  navItems: ['拆解'],
  navCurrent: 0,
  ixNo: '36',
  ixLabel: 'Bridge',
  lead: 'From 100 to 300, step by step.',
  headingHtml: '这 <span class="ign-ember-text">3 倍</span>，<br>是怎么一段段搭起来的。',
  lede: '把增长拆成可解释的几段：每一段都来自一个具体动作，没有黑箱。',
  steps: [
    { type: 'base', zh: '接入前基线', en: 'Baseline', v: 100 },
    { type: 'inc', zh: '搜索与内容', en: '+SEO', v: 64 },
    { type: 'inc', zh: '转化优化', en: '+CRO', v: 52 },
    { type: 'inc', zh: '付费放大', en: '+Paid', v: 48 },
    { type: 'inc', zh: '协同复利', en: '+Synergy', v: 36 },
    { type: 'tot', zh: '12 个月后', en: 'Total', v: 300 },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长来源拆解（指数化 · 基线 = 100）',
  metaMid: '每一段，都说得清来源',
};

export const bridgeControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'stepCount', type: 'slider', label: '增量步骤', default: 4, min: 2, max: 4, step: 1, describe: '基线与总计之间的增量步骤数量。' },
  { key: 'showConnectors', type: 'toggle', label: '连接虚线', default: true, describe: '相邻柱之间的水平连接虚线。' },
  { key: 'showValues', type: 'toggle', label: '数值标签', default: true, describe: '每根柱顶部的数值。' },
  { key: 'showBaseline', type: 'toggle', label: '基线柱', default: true, describe: '最左侧的接入前基线柱。' },
  { key: 'showTotal', type: 'toggle', label: '总计柱', default: true, describe: '最右侧的累计总计柱。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一增量步骤，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 1, min: 0, max: 5, step: 1, describe: '需要突出的柱序号（含基线，从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function BridgeSlide(props) {
  injectCSS('ign-brg-css', CSS);
  const p = { ...bridgeDefaultProps, ...props };
  const sc = clampInt(p.stepCount, 2, 4);
  const STEPS = Array.isArray(p.steps) ? p.steps : [];
  const baseStep = STEPS[0] || { type: 'base', zh: '', en: '', v: 100 };
  const totStep = STEPS[STEPS.length - 1] || { type: 'tot', zh: '', en: '', v: 0 };
  const incs = STEPS.filter((s) => s.type === 'inc').slice(0, sc);
  let seq = [];
  if (p.showBaseline) seq.push(baseStep);
  seq = seq.concat(incs);
  if (p.showTotal) seq.push({ ...totStep, v: (p.showBaseline ? baseStep.v : 0) + incs.reduce((a, b) => a + b.v, 0) });
  const total = Math.max(seq.reduce((m, s) => Math.max(m, s.type === 'tot' ? s.v : 0), 0),
    (p.showBaseline ? baseStep.v : 0) + incs.reduce((a, b) => a + b.v, 0));
  const max = total * 1.12;

  // compute cumulative bottoms for floating bars
  let cum = p.showBaseline ? baseStep.v : 0;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const layout = seq.map((s, i) => {
    let bottom, height;
    if (s.type === 'base') { bottom = 0; height = s.v; }
    else if (s.type === 'tot') { bottom = 0; height = s.v; }
    else { bottom = cum; height = s.v; cum += s.v; }
    return { ...s, bottom, height };
  });
  const cols = `repeat(${seq.length}, 1fr)`;
  const emi = clampInt(p.emphasisIndex, 0, seq.length - 1);

  return (
    <Slide surface={p.surface} className="ign-brg">
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

        <div className="ign-brg-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-brg-body ign-a2">
          <div className="ign-brg-plot" style={{ gridTemplateColumns: cols }}>
            {layout.map((s, i) => {
              const topPct = (s.bottom + s.height) / max * 100;
              const dim = p.emphasis && i !== emi && s.type === 'inc';
              return (
                <div key={i} className={`ign-brg-col ${dim ? 'dim' : ''}`}>
                  {p.showConnectors && i < layout.length - 1 && (
                    <span className="ign-brg-conn" style={{ bottom: `${topPct}%`, left: '50%', right: '-55%' }} />
                  )}
                  <div className={`ign-brg-bar ${s.type}`} style={{ height: `${s.height / max * 100}%`, marginBottom: `${s.bottom / max * 100}%` }}>
                    {p.showValues && (
                      <span className={`ign-brg-val ${s.type === 'inc' ? 'pos' : ''}`}>
                        {s.type === 'inc' ? '+' : ''}{s.v}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ign-brg-x" style={{ gridTemplateColumns: cols }}>
            {layout.map((s, i) => (
              <div key={i} className="ign-brg-xl"><span className="zh">{s.zh}</span><span className="en">{s.en}</span></div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '44%' }} /></span> 36 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
