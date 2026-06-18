/* Slide26Principles.jsx — IGNIS deck · numbered operating-principles page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: principlesDefaultProps (complete defaults) + principlesControls (1:1).
 *
 * Regular editorial page. A manifesto of operating principles set as
 * hairline-separated, big-numeral typographic blocks — no UI chrome, reads as
 * statements rather than cards.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-prn .ign-frame{justify-content:space-between}
.ign-prn .b1{width:1180px;height:1180px;left:50%;top:-260px;transform:translateX(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.4),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-prn .ign-ghost{font-size:600px;right:30px;bottom:-150px}
.ign-prn-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-prn-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-prn-head h2{font-size:74px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-prn-head h2 .ign-serif{color:var(--ign-a)}
.ign-prn-head p{font-size:24px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:430px;text-align:right;text-wrap:pretty}
.ign-prn-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;column-gap:80px;align-content:center;margin-top:8px}
.ign-prn-it{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:start;padding:26px 0;border-top:1px solid var(--ign-hair)}
.ign-prn-it .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:52px;line-height:0.78;letter-spacing:-0.03em;
  color:transparent;background:var(--ign-ember);-webkit-background-clip:text;background-clip:text}
.ign-prn-it .t{font-size:34px;font-weight:700;letter-spacing:-0.015em;line-height:1.1}
.ign-prn-it .d{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);margin-top:10px;text-wrap:pretty}
`;

export const principlesDefaultProps = {
  surface: 'ember',
  principleCount: 6,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '原则',
  railText: 'Principles — 原则',
  navItems: ['原则'],
  navCurrent: 0,
  ixNo: '14',
  ixLabel: 'Principles',
  lead: 'How we operate.',
  headingHtml: '我们怎么<span class="ign-ember-text">做事</span>。',
  lede: '六条原则，不写在墙上，写在每一次决策里——它们决定了我们拒绝什么、坚持什么。',
  principles: [
    { t: '先诊断，再动手', d: '没有数据支撑的动作，我们不做。' },
    { t: '一支团队，一条路径', d: '搜索、内容、投放不再各管一段。' },
    { t: '为收入负责', d: '只盯能真正兑现成收入的指标。' },
    { t: '复利优先', d: '宁可慢一点，也要可持续地涨。' },
    { t: '透明到底', d: '报表里没有任何看不懂的成本。' },
    { t: '结果即代表作', d: '作品会说话，增长更会说话。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 操作原则',
  metaMid: '写在每一次决策里',
};

export const principlesControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'principleCount', type: 'slider', label: '原则数量', default: 6, min: 3, max: 6, step: 1, describe: '列出的操作原则条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条原则，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 5, step: 1, describe: '需要突出的原则序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PrinciplesSlide(props) {
  injectCSS('ign-prn-css', CSS);
  const p = { ...principlesDefaultProps, ...props };
  const count = clampInt(p.principleCount, 3, 6);
  const items = (Array.isArray(p.principles) ? p.principles : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-prn">
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

        <div className="ign-prn-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-prn-grid ign-a2">
          {items.map((m, i) => (
            <div key={i} className={`ign-prn-it ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
              <span className="no">{String(i + 1).padStart(2, '0')}</span>
              <div><div className="t">{m.t}</div><div className="d">{m.d}</div></div>
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '29%' }} /></span> 24 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
