/* Slide11Section.jsx — IGNIS deck · chapter / section-divider page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: sectionDefaultProps (complete defaults) + sectionControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-sec .ign-frame{justify-content:space-between}
.ign-sec .b1{width:1480px;height:1120px;left:-280px;top:50%;transform:translateY(-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,150,70,0.5),rgba(255,90,35,0) 70%),
  radial-gradient(64% 64% at 46% 54%,rgba(226,42,12,0.4),rgba(120,20,8,0) 72%);filter:blur(48px)}
.ign-sec .ign-ghost{font-size:780px;right:-20px;bottom:-200px}
.ign-sec-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-sec-tag{display:flex;align-items:center;gap:20px;font-family:'Space Grotesk',sans-serif;font-size:26px;
  letter-spacing:0.3em;text-transform:uppercase;color:var(--ign-ink2)}
.ign-sec-tag .ch{font-weight:600;color:var(--ign-a)}
.ign-sec-tag .ln{width:72px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-sec h2{font-size:150px;font-weight:900;line-height:0.96;letter-spacing:-0.045em;margin-top:34px}
.ign-sec h2 .ign-serif{color:var(--ign-a);font-weight:800}
.ign-sec-lede{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:34px;color:var(--ign-ink2);
  max-width:880px;margin-top:36px;line-height:1.42;text-wrap:pretty}
.ign-sec-agenda{display:flex;margin-top:60px;border-top:1px solid var(--ign-hair2)}
.ign-sec-ag{flex:1;padding:28px 40px 0 0}
.ign-sec-ag + .ign-sec-ag{border-left:1px solid var(--ign-hair);padding-left:40px}
.ign-sec-ag .n{font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-a);letter-spacing:0.14em}
.ign-sec-ag .t{font-size:32px;font-weight:700;margin-top:16px;line-height:1.15}
.ign-sec-ag .e{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);margin-top:8px}
`;

export const sectionDefaultProps = {
  surface: 'ember',
  showTag: true,
  showLede: true,
  showAgenda: true,
  agendaCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '01',
  railText: 'Chapter — 序章',
  navItems: ['序章'],
  navCurrent: 0,
  ixNo: '01',
  ixLabel: 'Chapter',
  tagChapter: '第一章',
  tagEn: 'The Growth Logic',
  headingHtml: '增长，<br><span class="ign-ember-text">不靠运气</span>。',
  lede: '市场每天都在变，但增长的底层逻辑没变——把对的内容，放到对的人面前，让每一次曝光都通向收入。',
  agenda: [
    { t: '市场现状', e: 'Where you are' },
    { t: '增长杠杆', e: 'What moves it' },
    { t: '燃点方法', e: 'How we do it' },
    { t: '真实成果', e: 'What you get' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长引擎',
  metaMid: '先看清局面，再点燃增长',
};

export const sectionControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showTag', type: 'toggle', label: '章节标签', default: true, describe: '主标题上方的「第 N 章」标签行。' },
  { key: 'showLede', type: 'toggle', label: '导语', default: true, describe: '标题下方的衬线斜体导语。' },
  { key: 'showAgenda', type: 'toggle', label: '本章导览', default: true, describe: '底部分栏的章节导览条目。' },
  { key: 'agendaCount', type: 'slider', label: '导览条目数', default: 3, min: 2, max: 4, step: 1, describe: '本章导览的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条导览，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的导览序号（从 0 起）。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function SectionSlide(props) {
  injectCSS('ign-sec-css', CSS);
  const p = { ...sectionDefaultProps, ...props };
  const count = clampInt(p.agendaCount, 2, 4);
  const items = (Array.isArray(p.agenda) ? p.agenda : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-sec">
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

        <div className="ign-sec-body">
          {p.showTag && (
            <div className="ign-sec-tag ign-a1"><span className="ch">{p.tagChapter}</span><span className="ln" /><span>{p.tagEn}</span></div>
          )}
          <h2 className="ign-a2" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showLede && (
            <div className="ign-sec-lede ign-a3">{p.lede}</div>
          )}
          {p.showAgenda && (
            <div className="ign-sec-agenda ign-a3">
              {items.map((it, i) => (
                <div key={i} className={`ign-sec-ag ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
                  <div className="n">{String(i + 1).padStart(2, '0')}</div>
                  <div className="t">{it.t}</div>
                  <div className="e">{it.e}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '2%' }} /></span> 2 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
