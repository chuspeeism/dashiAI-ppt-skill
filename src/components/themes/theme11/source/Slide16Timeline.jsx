/* Slide16Timeline.jsx — IGNIS deck · vertical milestone-timeline page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: timelineDefaultProps (complete defaults) + timelineControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-tl .ign-frame{justify-content:space-between}
.ign-tl .b1{width:1180px;height:1180px;right:-260px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.4),rgba(226,42,12,0) 68%);filter:blur(54px)}
.ign-tl .ign-ghost{font-size:560px;left:30px;top:-90px}
.ign-tl-body{flex:1;display:grid;grid-template-columns:0.78fr 1.22fr;gap:80px;align-items:center;margin-top:14px}
.ign-tl-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:30px;color:var(--ign-a);margin-bottom:14px}
.ign-tl-head h2{font-size:78px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-tl-head h2 .ign-serif{color:var(--ign-a)}
.ign-tl-head p{font-size:26px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:26px;max-width:420px;text-wrap:pretty}
.ign-tl-list{position:relative;padding-left:42px}
.ign-tl-list::before{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:2px;
  background:linear-gradient(180deg,var(--ign-a),var(--ign-b) 60%,var(--ign-hair))}
.ign-tl-list.noaxis{padding-left:0}
.ign-tl-list.noaxis::before{display:none}
.ign-tl-item{position:relative;padding:18px 0 18px 0}
.ign-tl-item + .ign-tl-item{border-top:1px solid var(--ign-hair)}
.ign-tl-item .dot{position:absolute;left:-37px;top:24px;width:16px;height:16px;border-radius:50%;
  background:var(--ign-bg);border:2px solid var(--ign-b);box-shadow:0 0 0 4px var(--ign-bg)}
.ign-tl-item.hot .dot{background:var(--ign-b);box-shadow:0 0 18px var(--ign-b),0 0 0 4px var(--ign-bg)}
.ign-tl-item .top{display:flex;align-items:baseline;gap:18px}
.ign-tl-item .day{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:30px;letter-spacing:-0.01em;color:var(--ign-a);min-width:118px}
.ign-tl-item .t{font-size:32px;font-weight:700}
.ign-tl-item .en{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.1em;color:var(--ign-ink3);margin-left:auto}
.ign-tl-item .d{font-size:24px;font-weight:300;color:var(--ign-ink2);margin-top:8px;line-height:1.45;max-width:680px}
`;

export const timelineDefaultProps = {
  surface: 'ember',
  milestoneCount: 5,
  emphasis: false,
  emphasisIndex: 0,
  showAxis: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '90d',
  railText: 'Roadmap — 路线',
  navItems: ['路线'],
  navCurrent: 0,
  ixNo: '11',
  ixLabel: 'Roadmap',
  lead: 'First 90 days.',
  headingHtml: '前 90 天，<br><span class="ign-ember-text">路线清晰</span>。',
  lede: '没有模糊的「再观察看看」。每个阶段都有明确动作、明确产出、明确节点。',
  miles: [
    { day: '第 0 天', t: '增长诊断', en: 'Audit', d: '盘点现状、锁定增长瓶颈，给出可执行的优先级清单。' },
    { day: '第 14 天', t: '首批见效', en: 'Quick wins', d: '从最容易兑现的杠杆切入，两周内拿到第一波可量化结果。' },
    { day: '第 30 天', t: '落地页上线', en: 'Launch', d: '围绕转化重写主路径，新落地页与投放联动上线。' },
    { day: '第 60 天', t: '规模化测试', en: 'Scale', d: '把跑通的玩法放大，系统化做 A/B 与渠道扩张。' },
    { day: '第 90 天', t: '复利增长', en: 'Compounding', d: '增长进入复利区间，结构沉淀为可持续的引擎。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 合作路线图',
  metaMid: '每个节点，都看得见',
};

export const timelineControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'milestoneCount', type: 'slider', label: '里程碑数量', default: 5, min: 3, max: 5, step: 1, describe: '时间轴里程碑的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一里程碑，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的里程碑序号（从 0 起）。' },
  { key: 'showAxis', type: 'toggle', label: '时间轴线', default: true, describe: '左侧的竖向轴线与节点圆点。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function TimelineSlide(props) {
  injectCSS('ign-tl-css', CSS);
  const p = { ...timelineDefaultProps, ...props };
  const count = clampInt(p.milestoneCount, 3, 5);
  const miles = (Array.isArray(p.miles) ? p.miles : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-tl">
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

        <div className="ign-tl-body">
          <div className="ign-tl-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
          </div>

          <div className={`ign-tl-list ign-a2 ${p.showAxis ? '' : 'noaxis'}`}>
            {miles.map((m, i) => (
              <div key={i} className={`ign-tl-item ${p.emphasis ? (i === emi ? 'hot ign-lit' : 'ign-dim') : ''}`}>
                {p.showAxis && <span className="dot" />}
                <div className="top">
                  <span className="day">{m.day}</span>
                  <span className="t">{m.t}</span>
                  <span className="en">{m.en}</span>
                </div>
                <div className="d">{m.d}</div>
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '21%' }} /></span> 17 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
