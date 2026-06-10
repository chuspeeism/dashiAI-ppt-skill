/* Slide40Chapter.jsx — IGNIS deck · numeral-led chapter divider page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: chapterDefaultProps (complete defaults) + chapterControls (1:1).
 *
 * Section / transition page. A giant outlined chapter numeral anchors a title
 * and an optional mini-agenda of what the chapter covers. Distinct from the
 * editorial Section (11) divider — this is the numeric, index-style transition.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-chp .ign-frame{justify-content:space-between}
.ign-chp .b1{width:1500px;height:1100px;left:-200px;top:50%;transform:translateY(-50%);
  background:radial-gradient(44% 50% at 40% 50%,rgba(255,140,64,0.4),rgba(255,90,35,0) 70%);filter:blur(58px)}
.ign-chp .ign-ghost{font-size:300px;right:96px;bottom:60px;color:transparent;
  -webkit-text-stroke:2px var(--ign-hair2)}
.ign-chp-body{flex:1;display:grid;grid-template-columns:0.78fr 1.22fr;gap:72px;align-items:center}
.ign-chp-num{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:440px;line-height:0.74;letter-spacing:-0.06em;
  background:var(--ign-ember);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 0 60px rgba(255,110,46,0.32));text-align:center}
.ign-chp-left .lead{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.28em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:22px}
.ign-chp-left .lead .tick{width:40px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-chp-left .lead .no{color:var(--ign-a)}
.ign-chp-h{font-size:84px;font-weight:900;line-height:0.98;letter-spacing:-0.04em;margin-bottom:22px}
.ign-chp-h .ign-serif{font-weight:400;color:var(--ign-a)}
.ign-chp-sub{font-size:25px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:560px;text-wrap:pretty;margin-bottom:34px}
.ign-chp-agenda{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--ign-hair2)}
.ign-chp-item{display:grid;grid-template-columns:54px 1fr auto;gap:22px;align-items:center;
  padding:22px 0;border-bottom:1px solid var(--ign-hair)}
.ign-chp-item .ix{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.1em;color:var(--ign-ink3)}
.ign-chp-item .tt{font-size:30px;font-weight:600;letter-spacing:-0.01em}
.ign-chp-item .tt .en{display:block;font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3);margin-top:4px}
.ign-chp-item .ar{font-size:30px;color:var(--ign-ink3)}
.ign-chp-item.on .ix{color:var(--ign-a)}
.ign-chp-item.on .ar{color:var(--ign-a)}
.ign-chp-item.on{background:linear-gradient(90deg,rgba(255,120,52,0.08),transparent)}
`;

export const chapterDefaultProps = {
  surface: 'ink',
  chapterNo: '03',
  showNumber: true,
  showSub: true,
  showAgenda: true,
  agendaCount: 4,
  agendaCurrent: 0,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  railText: 'Chapter — 章节',
  navItems: ['章节'],
  navCurrent: 0,
  ixNo: '40',
  ixLabel: 'Chapter',
  leadEnPrefix: 'Chapter',
  leadZh: '本章',
  headingHtml: '把引擎，<br><span class="ign-serif">拆给你看</span>。',
  sub: '接下来三页，我们逐层打开增长引擎——每一个齿轮，怎么咬合、怎么发力。',
  agenda: [
    { tt: '增长引擎拆解', en: 'The engine', cur: true },
    { tt: '渠道与归因', en: 'Channels & data', cur: false },
    { tt: '定价与合作', en: 'Pricing', cur: false },
    { tt: '下一步行动', en: 'Next steps', cur: false },
  ],
  metaMid: '逐层打开',
};

export const chapterControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'chapterNo', type: 'select', label: '章节编号', default: '03',
    options: [{ value: '01', label: '01' }, { value: '02', label: '02' }, { value: '03', label: '03' }, { value: '04', label: '04' }, { value: '05', label: '05' }],
    describe: '巨型章节序号。' },
  { key: 'showNumber', type: 'toggle', label: '巨型序号', default: true, describe: '左侧的超大章节数字。' },
  { key: 'showSub', type: 'toggle', label: '副标题', default: true, describe: '章节标题下方的说明句。' },
  { key: 'showAgenda', type: 'toggle', label: '小目录', default: true, describe: '右侧本章覆盖要点的小目录。' },
  { key: 'agendaCount', type: 'slider', label: '目录条数', default: 4, min: 2, max: 4, step: 1, describe: '小目录的条目数量。' },
  { key: 'agendaCurrent', type: 'slider', label: '当前条目', default: 0, min: 0, max: 3, step: 1, describe: '小目录中高亮的当前条目序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的章节引导标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大描边字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ChapterSlide(props) {
  injectCSS('ign-chp-css', CSS);
  const p = { ...chapterDefaultProps, ...props };
  const n = clampInt(p.agendaCount, 2, 4);
  const items = (Array.isArray(p.agenda) ? p.agenda : []).slice(0, n);
  const cur = clampInt(p.agendaCurrent, 0, n - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-chp">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.chapterNo}</Ghost>}
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

        <div className="ign-chp-body">
          {p.showNumber && <div className="ign-chp-num ign-a1">{p.chapterNo}</div>}

          <div className="ign-chp-left ign-a2">
            {p.showKicker && <div className="lead"><span className="no">{p.leadEnPrefix} {p.chapterNo}</span><span className="tick" /><span>{p.leadZh}</span></div>}
            <h2 className="ign-chp-h" dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showSub && <p className="ign-chp-sub">{p.sub}</p>}
            {p.showAgenda && (
              <div className="ign-chp-agenda">
                {items.map((it, i) => (
                  <div key={i} className={`ign-chp-item ${i === cur ? 'on' : ''}`}>
                    <span className="ix">{String(i + 1).padStart(2, '0')}</span>
                    <span className="tt">{it.tt}<span className="en">{it.en}</span></span>
                    <span className="ar">{i === cur ? '→' : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>IGNIS — 燃点 · 第 {p.chapterNo} 章</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '49%' }} /></span> 40 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
