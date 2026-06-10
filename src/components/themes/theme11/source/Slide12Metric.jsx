/* Slide12Metric.jsx — IGNIS deck · single hero-metric (big-number) page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: metricDefaultProps (complete defaults) + metricControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-met .ign-frame{justify-content:space-between}
.ign-met .b1{width:1700px;height:900px;left:50%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,140,64,0.32),rgba(255,90,35,0) 70%);filter:blur(60px)}
.ign-met .ign-ghost{font-size:600px;left:40px;bottom:-120px}
.ign-met-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ign-met-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:26px;
  letter-spacing:0.28em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:18px}
.ign-met-kick .tick{width:34px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-met-kick .no{color:var(--ign-a)}
.ign-met-hero{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:420px;line-height:0.82;letter-spacing:-0.05em}
.ign-met-cap{font-size:32px;font-weight:300;color:var(--ign-ink2);margin-top:26px;max-width:780px;line-height:1.4;text-wrap:pretty}
.ign-met-trend{width:560px;height:60px;margin-top:30px}
.ign-met-trend svg{width:100%;height:100%;display:block;overflow:visible}
.ign-met-subs{display:flex;align-items:stretch;border-top:1px solid var(--ign-hair);padding:42px 0}
.ign-met-sub{flex:1;padding:0 44px;text-align:center}
.ign-met-sub + .ign-met-sub{border-left:1px solid var(--ign-hair)}
.ign-met-sub .sv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:54px;line-height:0.9;letter-spacing:-0.03em}
.ign-met-sub .sl{font-size:24px;font-weight:300;color:var(--ign-ink2);margin-top:12px}
.ign-met-note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);text-align:center}
`;

export const metricDefaultProps = {
  surface: 'paper',
  showKicker: true,
  showTrend: true,
  showCaption: true,
  showSubStats: true,
  subStatCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showNote: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '%',
  railText: 'Headline — 大势',
  navItems: ['大势'],
  navCurrent: 0,
  ixNo: '02',
  ixLabel: 'Headline',
  kickerLead: 'Average organic lift',
  kickerEn: '12-month median',
  heroValue: '+182%',
  caption: '接入燃点后，自然搜索流量在 12 个月内的平均增幅——不是一次性峰值，而是持续复利。',
  subs: [
    { v: '2,400+', l: '服务品牌总数' },
    { v: '12 月', l: '复利兑现周期' },
    { v: '0', l: '隐藏在报表里的成本' },
  ],
  metaLeft: 'IGNIS — 燃点 · 跨 2,400+ 品牌中位',
  noteText: '一个数字，胜过一页 slide',
};

export const metricControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '大数字上方的装饰性引导标签。' },
  { key: 'showTrend', type: 'toggle', label: '迷你趋势线', default: true, describe: '大数字下方的装饰趋势曲线。' },
  { key: 'showCaption', type: 'toggle', label: '数字说明', default: true, describe: '大数字正下方的说明文案。' },
  { key: 'showSubStats', type: 'toggle', label: '辅助数据行', default: true, describe: '底部分栏的辅助数据。' },
  { key: 'subStatCount', type: 'slider', label: '辅助数据数量', default: 3, min: 1, max: 3, step: 1, describe: '底部辅助数据的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条辅助数据，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的辅助数据序号（从 0 起）。' },
  { key: 'showNote', type: 'toggle', label: '装饰注释', default: true, describe: '底部居中的衬线注释文案。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function MetricSlide(props) {
  injectCSS('ign-met-css', CSS);
  const p = { ...metricDefaultProps, ...props };
  const count = clampInt(p.subStatCount, 1, 3);
  const subs = (Array.isArray(p.subs) ? p.subs : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-met">
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

        <div className="ign-met-body">
          {p.showKicker && (
            <div className="ign-met-kick ign-a1"><span className="no">{p.kickerLead}</span><span className="tick" /><span>{p.kickerEn}</span></div>
          )}
          <EmberText className="ign-met-hero ign-a2">{p.heroValue}</EmberText>
          {p.showCaption && <div className="ign-met-cap ign-a3">{p.caption}</div>}
          {p.showTrend && (
            <div className="ign-met-trend ign-a3">
              <svg viewBox="0 0 560 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ign-met-g" x1="0" y1="0" x2="560" y2="0"><stop stopColor="#FFC07A" /><stop offset="1" stopColor="#E22A0C" /></linearGradient>
                </defs>
                <polyline points="0,52 90,50 180,46 270,40 360,30 450,18 560,2" fill="none" stroke="url(#ign-met-g)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="560" cy="2" r="6" fill="#FFC07A" />
              </svg>
            </div>
          )}
        </div>

        {p.showSubStats && (
          <div className="ign-met-subs ign-a3">
            {subs.map((s, i) => (
              <div key={i} className={`ign-met-sub ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
                <div className="sv">{s.v}</div>
                <div className="sl">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.showNote ? p.noteText : ''}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '5%' }} /></span> 4 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
