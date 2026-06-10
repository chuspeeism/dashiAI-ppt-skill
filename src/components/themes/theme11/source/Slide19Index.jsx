/* Slide19Index.jsx — IGNIS deck · numbered table-of-contents divider page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: indexDefaultProps (complete defaults) + indexControls (1:1).
 *
 * A "contents" divider whose hero IS the index itself: oversized part numerals
 * stacked as editorial rows. Distinct from the Section chapter divider — there
 * the headline leads; here the running order leads.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-idx .ign-frame{justify-content:space-between}
.ign-idx .b1{width:1280px;height:1280px;left:-300px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.42),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-idx .ign-ghost{font-size:600px;right:30px;bottom:-150px}
.ign-idx-body{flex:1;display:grid;grid-template-columns:0.62fr 1.38fr;gap:96px;align-items:center;margin-top:10px}
.ign-idx-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:30px;color:var(--ign-a);margin-bottom:16px}
.ign-idx-head h2{font-size:90px;font-weight:900;line-height:0.96;letter-spacing:-0.035em}
.ign-idx-head h2 .ign-serif{color:var(--ign-a)}
.ign-idx-head p{font-size:25px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:28px;max-width:360px;text-wrap:pretty}
.ign-idx-list{display:flex;flex-direction:column;border-top:1px solid var(--ign-hair)}
.ign-idx-row{display:flex;align-items:baseline;gap:40px;padding:26px 8px 26px 0;border-bottom:1px solid var(--ign-hair);position:relative}
.ign-idx-row .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:78px;line-height:0.8;letter-spacing:-0.04em;color:var(--ign-ink4);min-width:128px}
.ign-idx-row.hot .no{color:transparent;background:var(--ign-ember);-webkit-background-clip:text;background-clip:text}
.ign-idx-row .t{font-size:46px;font-weight:700;letter-spacing:-0.02em}
.ign-idx-row .en{font-family:'Space Grotesk',sans-serif;font-size:25px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3);margin-left:auto}
.ign-idx-row .arrow{position:absolute;left:-2px;top:50%;transform:translateY(-50%);width:0;opacity:0;transition:.25s}
.ign-idx-row.hot{padding-left:40px}
.ign-idx-row.hot .arrow{width:24px;opacity:1;color:var(--ign-b)}
.ign-idx-row.hot .arrow svg{display:block}
`;

export const indexDefaultProps = {
  surface: 'ink',
  partCount: 5,
  emphasis: true,
  emphasisIndex: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '目录',
  railText: 'Contents — 纲目',
  navItems: ['纲目'],
  navCurrent: 0,
  ixNo: '01',
  ixLabel: 'Contents',
  lead: 'What follows.',
  headingHtml: '这一程，<br><span class="ign-ember-text">怎么走</span>。',
  lede: '五个部分，从看清局面到一起行动。每一段都对应一组可被验证的动作。',
  parts: [
    { t: '增长逻辑', en: 'The Logic' },
    { t: '方法与实证', en: 'Method & Proof' },
    { t: '服务与流程', en: 'Services & Process' },
    { t: '路线与套餐', en: 'Roadmap & Plans' },
    { t: '一起行动', en: 'Take Action' },
  ],
  metaLeft: 'IGNIS — 燃点 · 内容纲目',
  metaMid: '先看清，再点燃',
};

export const indexControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'partCount', type: 'slider', label: '章节数量', default: 5, min: 3, max: 5, step: 1, describe: '目录中列出的章节条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后高亮当前章节（编号着色 + 箭头），其余保持低调。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要高亮的章节序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function IndexSlide(props) {
  injectCSS('ign-idx-css', CSS);
  const p = { ...indexDefaultProps, ...props };
  const count = clampInt(p.partCount, 3, 5);
  const parts = (Array.isArray(p.parts) ? p.parts : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-idx">
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

        <div className="ign-idx-body">
          <div className="ign-idx-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
          </div>

          <div className="ign-idx-list ign-a2">
            {parts.map((m, i) => (
              <div key={i} className={`ign-idx-row ${p.emphasis && i === emi ? 'hot' : ''}`}>
                <span className="arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l7 6-7 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="no">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">{m.t}</span>
                <span className="en">{m.en}</span>
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '4%' }} /></span> 3 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
