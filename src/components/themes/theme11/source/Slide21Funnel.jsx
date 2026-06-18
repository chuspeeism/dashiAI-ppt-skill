/* Slide21Funnel.jsx — IGNIS deck · conversion-funnel chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: funnelDefaultProps (complete defaults) + funnelControls (1:1).
 *
 * Chart page. A genuine narrowing funnel built from per-stage clip-path
 * trapezoids whose edges meet continuously; value sits inside each band, the
 * stage label to the left and the step conversion to the right.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-fnl .ign-frame{justify-content:space-between}
.ign-fnl .b1{width:1180px;height:1180px;right:-220px;top:-160px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.4),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-fnl .ign-ghost{font-size:560px;right:40px;bottom:-150px}
.ign-fnl-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:8px}
.ign-fnl-head h2{font-size:74px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-fnl-head h2 .ign-serif{color:var(--ign-a)}
.ign-fnl-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-fnl-head p{font-size:24px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:430px;text-align:right;text-wrap:pretty}
.ign-fnl-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:6px 0}
.ign-fnl-row{display:grid;grid-template-columns:1fr 660px 1fr;align-items:center;gap:30px}
.ign-fnl-name{text-align:right}
.ign-fnl-name .n{font-size:30px;font-weight:700;letter-spacing:-0.01em}
.ign-fnl-name .en{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-ink3);margin-top:4px}
.ign-fnl-band{position:relative;height:92px;display:flex;align-items:center;justify-content:center}
.ign-fnl-band .seg{position:absolute;inset:0;background:var(--ign-ember)}
.ign-fnl-band .v{position:relative;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:44px;letter-spacing:-0.02em;color:#1B1108}
.ign-fnl-rate{display:flex;align-items:center;gap:12px}
.ign-fnl-rate .pct{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:34px;letter-spacing:-0.01em;color:var(--ign-ink)}
.ign-fnl-rate .ar{color:var(--ign-b);flex:none}
.ign-fnl-rate .ent{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-a)}
.ign-fnl-row.dim{opacity:0.32;filter:saturate(0.5)}
.ign-fnl-row.lit .ign-fnl-band .v{color:#160D06}
`;

export const funnelDefaultProps = {
  surface: 'paper',
  stageCount: 5,
  emphasis: false,
  emphasisIndex: 4,
  showRates: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↓',
  railText: 'Funnel — 漏斗',
  navItems: ['漏斗'],
  navCurrent: 0,
  ixNo: '07',
  ixLabel: 'Funnel',
  lead: 'From reach to revenue.',
  headingHtml: '每一层，<span class="ign-ember-text">都在漏</span>。',
  lede: '增长不是堆流量，而是把每一级的转化率抬上去——同样的曝光，成交能差出数倍。',
  stages: [
    { name: '曝光触达', en: 'Reach', v: '1.2M', rate: '入口' },
    { name: '点击进入', en: 'Clicks', v: '216K', rate: '18%' },
    { name: '互动停留', en: 'Engaged', v: '77K', rate: '36%' },
    { name: '留资线索', en: 'Leads', v: '15.4K', rate: '20%' },
    { name: '成交客户', en: 'Customers', v: '2.9K', rate: '19%' },
  ],
  metaLeft: 'IGNIS — 燃点 · 转化漏斗（中位样本）',
  metaMid: '省下的漏损，都是利润',
};

export const funnelControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'stageCount', type: 'slider', label: '漏斗层数', default: 5, min: 3, max: 5, step: 1, describe: '从曝光到成交的漏斗阶段数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一阶段，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 4, min: 0, max: 4, step: 1, describe: '需要突出的阶段序号（从 0 起）。' },
  { key: 'showRates', type: 'toggle', label: '转化率标注', default: true, describe: '右侧逐级转化率与下钻箭头。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function FunnelSlide(props) {
  injectCSS('ign-fnl-css', CSS);
  const p = { ...funnelDefaultProps, ...props };
  const count = clampInt(p.stageCount, 3, 5);
  const stages = (Array.isArray(p.stages) ? p.stages : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const step = 0.72 / count;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const clipFor = (i) => {
    const top = 1 - i * step, bot = 1 - (i + 1) * step;
    const lt = ((1 - top) / 2) * 100, rt = ((1 + top) / 2) * 100;
    const lb = ((1 - bot) / 2) * 100, rb = ((1 + bot) / 2) * 100;
    return `polygon(${lt}% 0, ${rt}% 0, ${rb}% 100%, ${lb}% 100%)`;
  };

  return (
    <Slide surface={p.surface} className="ign-fnl">
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

        <div className="ign-fnl-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-fnl-body ign-a2">
          {stages.map((s, i) => {
            const op = 0.52 + 0.48 * (count > 1 ? i / (count - 1) : 1);
            const cls = p.emphasis ? (i === emi ? 'lit' : 'dim') : '';
            return (
              <div key={i} className={`ign-fnl-row ${cls}`}>
                <div className="ign-fnl-name"><div className="n">{s.name}</div><div className="en">{s.en}</div></div>
                <div className="ign-fnl-band">
                  <span className="seg" style={{ clipPath: clipFor(i), opacity: op }} />
                  <span className="v">{s.v}</span>
                </div>
                <div className="ign-fnl-rate">
                  {p.showRates && (i === 0
                    ? <span className="ent">{s.rate}</span>
                    : <><span className="ar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span><span className="pct">{s.rate}</span></>)}
                </div>
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '13%' }} /></span> 11 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
