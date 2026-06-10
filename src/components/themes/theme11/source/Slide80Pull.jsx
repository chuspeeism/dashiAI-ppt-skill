/* Slide80Pull.jsx — IGNIS deck · data pull-quote page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: pullDefaultProps (complete defaults) + pullControls (1:1).
 *
 * Quote page. A single statement with one clause blown up into an oversized
 * ember figure woven into the sentence — a quote and a number in one breath.
 * Distinct from Quote (13, founder note), Manifesto (33, plain words) and Coda
 * (66, sign-off): this is the deck's metric-charged pull-quote. align and the
 * decorative parts are prop-driven; the words are fixed.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS } from './ignBase.jsx';

const CSS = `
.ign-puq .ign-frame{justify-content:space-between}
.ign-puq .b1{width:1560px;height:900px;left:50%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.4),rgba(226,42,12,0) 66%);filter:blur(72px)}
.ign-puq .ign-ghost{font-size:720px;right:0;top:-140px}
.ign-puq-body{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative}
.ign-puq-body.center{align-items:center;text-align:center}
.ign-puq-mark{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;font-size:280px;line-height:0.5;
  color:var(--ign-a);height:108px;margin-bottom:8px;user-select:none}
.ign-puq-q{quotes:none;font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;font-size:76px;line-height:1.22;
  letter-spacing:-0.01em;max-width:1380px;text-wrap:pretty}
.ign-puq-body.center .ign-puq-q{max-width:1500px}
.ign-puq-big{display:inline-flex;align-items:baseline;font-family:'Space Grotesk',sans-serif;font-style:normal;font-weight:700;
  font-size:168px;line-height:0.7;letter-spacing:-0.04em;vertical-align:baseline;margin:0 10px;
  transform:translateY(28px)}
.ign-puq-big .u{font-size:0.34em;font-weight:500;margin-left:4px;color:var(--ign-ink)}
.ign-puq-attr{display:flex;align-items:center;gap:22px;margin-top:54px;padding-top:28px;border-top:1px solid var(--ign-hair)}
.ign-puq-body.center .ign-puq-attr{justify-content:center;width:100%;max-width:760px}
.ign-puq-attr .nm{font-size:28px;font-weight:700}
.ign-puq-attr .rl{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.08em;color:var(--ign-ink3);margin-top:5px}
.ign-puq-attr .src{margin-left:auto;font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.16em;
  text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap}
.ign-puq-body.center .ign-puq-attr .src{margin-left:24px}
`;

export const pullDefaultProps = {
  surface: 'ember',
  align: 'left',
  showMark: true,
  showBig: true,
  showRule: true,
  showAttribution: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '¥',
  railText: 'Pull — 金句',
  navItems: ['金句'],
  navCurrent: 0,
  ixNo: '79',
  ixLabel: 'Pull',
  markGlyph: '“',
  quotePre: '每投入 1 块预算，我们还给你',
  bigValue: '¥7',
  bigUnit: '.4',
  bigInline: ' ¥7.4 ',
  quotePost: '的可归因增量营收。',
  attrName: '跨 2,400+ 品牌 · 中位口径',
  attrRole: '12 个月真实结算数据',
  attrSrc: 'Median ROAS',
  metaLeft: 'IGNIS — 燃点 · 投产比',
  metaMid: '能归因的回报，才敢承诺',
};

export const pullControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'align', type: 'select', label: '对齐', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }], describe: '金句的对齐方式。' },
  { key: 'showMark', type: 'toggle', label: '引号字符', default: true, describe: '金句上方的超大装饰引号。' },
  { key: 'showBig', type: 'toggle', label: '巨号数字', default: true, describe: '句中嵌入的巨号暖橙数字（关闭则回退为普通字号）。' },
  { key: 'showRule', type: 'toggle', label: '分隔细线', default: true, describe: '署名上方的分隔细线。' },
  { key: 'showAttribution', type: 'toggle', label: '署名区块', default: true, describe: '金句下方的署名与来源。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '顶部导航处的章节标识。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PullSlide(props) {
  injectCSS('ign-puq-css', CSS);
  const p = { ...pullDefaultProps, ...props };
  const center = p.align === 'center';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-puq">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          {p.showKicker ? <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav> : <span />}
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className={`ign-puq-body ${center ? 'center' : ''}`}>
          {p.showMark && <div className="ign-puq-mark ign-a1">{p.markGlyph}</div>}
          <div className="ign-puq-q ign-a2">
            {p.quotePre}
            {p.showBig
              ? <EmberText className="ign-puq-big">{p.bigValue}<span className="u">{p.bigUnit}</span></EmberText>
              : <EmberText>{p.bigInline}</EmberText>}
            {p.quotePost}
          </div>
          {p.showAttribution && (
            <div className="ign-puq-attr ign-a3" style={p.showRule ? undefined : { borderTop: 'none', paddingTop: 0 }}>
              <div>
                <div className="nm">{p.attrName}</div>
                <div className="rl">{p.attrRole}</div>
              </div>
              <div className="src">{p.attrSrc}</div>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '96%' }} /></span> 79 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
