/* Slide53Headline.jsx — IGNIS deck · single oversized hero-number page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: headlineDefaultProps (complete defaults) + headlineControls (1:1).
 *
 * Big-number page. ONE enormous figure dominates the slide, with a kicker
 * above and a serif subline + small supporting stats below. Distinct from
 * Metric (12, trend line), Triptych (41, three numbers) and Split (28, two) —
 * this is the deck's single-number gut-punch.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-hl .ign-frame{justify-content:space-between}
.ign-hl .b1{width:1500px;height:1100px;left:50%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 48% at 50% 50%,rgba(255,130,60,0.34),rgba(255,90,35,0) 70%);filter:blur(70px)}
.ign-hl .ign-ghost{font-size:680px;right:-30px;bottom:-220px}
.ign-hl-body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ign-hl-body.center{align-items:center;text-align:center}
.ign-hl-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:25px;
  letter-spacing:0.26em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:14px}
.ign-hl-body.center .ign-hl-kick{justify-content:center}
.ign-hl-kick .tick{width:36px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-hl-kick .no{color:var(--ign-a)}
.ign-hl-num{font-family:'Space Grotesk',sans-serif;font-weight:500;line-height:0.78;letter-spacing:-0.05em;
  font-size:clamp(320px,30vw,460px);display:inline-flex;align-items:flex-start}
.ign-hl-num .u{font-size:0.32em;font-weight:400;color:var(--ign-ink2);margin-top:0.12em;letter-spacing:0}
.ign-hl-num .pre{font-size:0.42em;font-weight:400;color:var(--ign-ink2);margin-top:0.16em;margin-right:0.04em}
.ign-hl-sub{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:34px;color:var(--ign-ink);margin-top:8px;max-width:880px;text-wrap:pretty}
.ign-hl-body.center .ign-hl-sub{max-width:920px}
.ign-hl-foot{display:flex;gap:0;border-top:1px solid var(--ign-hair);padding-top:24px}
.ign-hl-body.center .ign-hl-foot{justify-content:center}
.ign-hl-fs{padding-right:48px}
.ign-hl-fs + .ign-hl-fs{border-left:1px solid var(--ign-hair);padding-left:48px}
.ign-hl-fs .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:40px;line-height:0.9;letter-spacing:-0.02em}
.ign-hl-fs .l{font-size:23px;font-weight:300;color:var(--ign-ink2);margin-top:10px}
`;

export const headlineDefaultProps = {
  surface: 'paper',
  align: 'left',
  showKicker: true,
  showPrefix: false,
  showUnit: true,
  showSub: true,
  showFootStats: true,
  subStatCount: 3,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '%',
  railText: 'Headline — 数字',
  navItems: ['数字'],
  navCurrent: 0,
  ixNo: '52',
  ixLabel: 'Headline',
  kickerEn: 'One number',
  kickerZh: '平均自然流量增幅',
  prefix: '+',
  bigNumber: '182',
  unit: '%',
  sub: '接入燃点 12 个月后，自然搜索流量的中位增幅——不是某个爆款，是 2,400+ 品牌一起跑出来的。',
  subs: [
    { v: '2,400+', l: '合作品牌样本' },
    { v: '12 个月', l: '统计窗口' },
    { v: '中位口径', l: '非头部个例' },
  ],
  metaLeft: 'IGNIS — 燃点 · 全样本中位',
  metaMid: '一个数字，胜过一页 slide',
};

export const headlineControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'align', type: 'select', label: '对齐方式', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }], describe: '巨型数字与文案的对齐方向。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '数字上方的装饰标签。' },
  { key: 'showPrefix', type: 'toggle', label: '前缀符号', default: false, describe: '数字前的符号（如 + 号）。' },
  { key: 'showUnit', type: 'toggle', label: '单位符号', default: true, describe: '数字后的单位（如 %）。' },
  { key: 'showSub', type: 'toggle', label: '副标题', default: true, describe: '数字下方的衬线说明句。' },
  { key: 'showFootStats', type: 'toggle', label: '辅助数据', default: true, describe: '底部的小号辅助数据行。' },
  { key: 'subStatCount', type: 'slider', label: '辅助数据数量', default: 3, min: 1, max: 3, step: 1, describe: '底部辅助数据的条目数量。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function HeadlineSlide(props) {
  injectCSS('ign-hl-css', CSS);
  const p = { ...headlineDefaultProps, ...props };
  const center = p.align === 'center';
  const sc = clampInt(p.subStatCount, 1, 3);
  const subs = (Array.isArray(p.subs) ? p.subs : []).slice(0, sc);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-hl">
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

        <div className={`ign-hl-body ${center ? 'center' : ''}`}>
          {p.showKicker && (
            <div className="ign-hl-kick ign-a1"><span className="tick" /><span className="no">{p.kickerEn}</span><span>{p.kickerZh}</span></div>
          )}
          <EmberText className="ign-hl-num ign-a1">
            {p.showPrefix && <span className="pre">{p.prefix}</span>}{p.bigNumber}{p.showUnit && <span className="u">{p.unit}</span>}
          </EmberText>
          {p.showSub && (
            <div className="ign-hl-sub ign-a2">{p.sub}</div>
          )}
          {p.showFootStats && (
            <div className="ign-hl-foot ign-a3" style={{ marginTop: 44 }}>
              {subs.map((s, i) => (
                <div key={i} className="ign-hl-fs">
                  <div className="v">{s.v}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '63%' }} /></span> 52 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
