/* Slide28Split.jsx — IGNIS deck · before/after split big-number page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: splitDefaultProps (complete defaults) + splitControls (1:1).
 *
 * Big-number page. Two halves divided by a diagonal seam — a muted "before"
 * numeral against a glowing ember "after". Distinct from the single-hero Metric
 * page: this one is a head-to-head contrast with a delta chip between them.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-vs .ign-frame{justify-content:space-between}
.ign-vs .b1{width:1500px;height:1000px;right:-200px;top:50%;transform:translateY(-50%);
  background:radial-gradient(44% 50% at 60% 50%,rgba(255,140,64,0.34),rgba(255,90,35,0) 70%);filter:blur(60px)}
.ign-vs .ign-ghost{font-size:600px;left:30px;top:-40px}
.ign-vs-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-vs-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-vs-head h2{font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-vs-head h2 .ign-serif{color:var(--ign-a)}
.ign-vs-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:400px;text-align:right;text-wrap:pretty}
.ign-vs-body{flex:1;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0;position:relative}
.ign-vs-side{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 40px;text-align:center}
.ign-vs-side.left{border-right:1px solid var(--ign-hair)}
.ign-vs-tag{display:flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.2em;text-transform:uppercase;color:var(--ign-ink3);margin-bottom:22px}
.ign-vs-tag .dot{width:9px;height:9px;border-radius:50%;background:var(--ign-ink4)}
.ign-vs-side.lit .ign-vs-tag{color:var(--ign-a)}
.ign-vs-side.lit .ign-vs-tag .dot{background:var(--ign-b);box-shadow:0 0 12px var(--ign-b)}
.ign-vs-num{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:300px;line-height:0.8;letter-spacing:-0.05em;color:var(--ign-ink3)}
.ign-vs-side.lit .ign-vs-num{color:transparent}
.ign-vs-cap{font-size:26px;font-weight:300;color:var(--ign-ink2);margin-top:24px;max-width:340px;line-height:1.4;text-wrap:pretty}
.ign-vs-mid{display:flex;flex-direction:column;align-items:center;gap:16px;padding:0 30px;z-index:2}
.ign-vs-chip{display:inline-flex;align-items:center;gap:12px;padding:14px 26px;border:1px solid var(--ign-hair2);
  border-radius:999px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:40px;letter-spacing:-0.01em;
  background:var(--ign-panel)}
.ign-vs-chip .ar{color:var(--ign-b)}
.ign-vs-mlabel{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-vs-subs{display:flex;align-items:stretch;border-top:1px solid var(--ign-hair);padding:30px 0}
.ign-vs-sub{flex:1;padding:0 40px;text-align:center}
.ign-vs-sub + .ign-vs-sub{border-left:1px solid var(--ign-hair)}
.ign-vs-sub .sv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:50px;line-height:0.9;letter-spacing:-0.03em}
.ign-vs-sub .sl{font-size:23px;font-weight:300;color:var(--ign-ink2);margin-top:10px}
`;

export const splitDefaultProps = {
  surface: 'paper',
  showKicker: true,
  showDelta: true,
  showCaptions: true,
  emphasis: true,
  emphasisSide: 'right',
  showSubStats: true,
  subStatCount: 3,
  showNote: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'vs',
  railText: 'Before / After — 对照',
  navItems: ['对照'],
  navCurrent: 0,
  ixNo: '28',
  ixLabel: 'Before / After',
  lead: 'Same budget, different math.',
  headingHtml: '同一笔预算，<span class="ign-ember-text">两种结局</span>。',
  showLede: false,
  lede: '左边是接入前的转化效率，右边是同样投入下，引擎跑满之后的样子。',
  leftTag: '接入前 · Before',
  rightTag: '接入后 · After',
  beforeValue: '1.0×',
  afterValue: '3.8×',
  leftCaption: '转化基线——流量来了，却大多在首屏流失。',
  rightCaption: '同样的曝光，把每一级转化率都抬上去。',
  deltaValue: '+280%',
  deltaLabel: '净增幅',
  subs: [
    { v: '−41%', l: '获客成本' },
    { v: '×2.4', l: '线索质量' },
    { v: '14 天', l: '首次见效' },
  ],
  metaLeft: 'IGNIS — 燃点 · 接入前后对照（中位样本）',
  noteText: '差距，不在预算，在引擎',
};

export const splitControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showDelta', type: 'toggle', label: '中间增幅章', default: true, describe: '两栏之间的增幅对比标记。' },
  { key: 'showCaptions', type: 'toggle', label: '数字说明', default: true, describe: '每栏大数字下方的说明文案。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后点亮其中一栏，另一栏弱化为「现状」。' },
  { key: 'emphasisSide', type: 'select', label: '重点栏位', default: 'right',
    options: [{ value: 'left', label: '左栏' }, { value: 'right', label: '右栏' }], describe: '被点亮（暖橙）的栏位。' },
  { key: 'showSubStats', type: 'toggle', label: '辅助数据行', default: true, describe: '底部分栏的辅助数据。' },
  { key: 'subStatCount', type: 'slider', label: '辅助数据数量', default: 3, min: 1, max: 3, step: 1, describe: '底部辅助数据的条目数量。' },
  { key: 'showNote', type: 'toggle', label: '装饰注释', default: true, describe: '底部信息条中间的衬线注释。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function SplitSlide(props) {
  injectCSS('ign-vs-css', CSS);
  const p = { ...splitDefaultProps, ...props };
  const count = clampInt(p.subStatCount, 1, 3);
  const subs = (Array.isArray(p.subs) ? p.subs : []).slice(0, count);
  const litRight = p.emphasisSide !== 'left';
  const leftLit = p.emphasis && !litRight;
  const rightLit = p.emphasis ? litRight : false;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-vs">
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

        <div className="ign-vs-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-vs-body ign-a2">
          <div className={`ign-vs-side left ${leftLit ? 'lit' : ''}`}>
            <div className="ign-vs-tag"><span className="dot" />{p.leftTag}</div>
            {leftLit ? <EmberText className="ign-vs-num">{p.afterValue}</EmberText> : <div className="ign-vs-num">{p.beforeValue}</div>}
            {p.showCaptions && <div className="ign-vs-cap">{p.leftCaption}</div>}
          </div>

          <div className="ign-vs-mid">
            {p.showDelta && (
              <>
                <span className="ign-vs-chip"><span className="ar">↗</span><EmberText>{p.deltaValue}</EmberText></span>
                <span className="ign-vs-mlabel">{p.deltaLabel}</span>
              </>
            )}
          </div>

          <div className={`ign-vs-side ${rightLit ? 'lit' : ''}`}>
            <div className="ign-vs-tag"><span className="dot" />{p.rightTag}</div>
            {rightLit ? <EmberText className="ign-vs-num">{p.afterValue}</EmberText> : <div className="ign-vs-num">{p.afterValue}</div>}
            {p.showCaptions && <div className="ign-vs-cap">{p.rightCaption}</div>}
          </div>
        </div>

        {p.showSubStats && (
          <div className="ign-vs-subs ign-a3">
            {subs.map((s, i) => (
              <div key={i} className="ign-vs-sub">
                <EmberText className="sv">{s.v}</EmberText>
                <div className="sl">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.showNote ? p.noteText : ''}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '34%' }} /></span> 28 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
