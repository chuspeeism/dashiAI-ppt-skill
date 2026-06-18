/* Slide45Roadmap.jsx — IGNIS deck · horizontal milestone roadmap timeline page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: roadmapDefaultProps (complete defaults) + roadmapControls (1:1).
 *
 * Timeline page. A horizontal spine with alternating above/below milestone
 * nodes across phases. Distinct from the vertical Process (07) step list — this
 * is a left-to-right roadmap with a progress fill marking "you are here".
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-rmp .ign-frame{justify-content:space-between}
.ign-rmp .b1{width:1500px;height:800px;left:50%;top:55%;transform:translate(-50%,-50%);
  background:radial-gradient(48% 50% at 50% 50%,rgba(255,130,60,0.26),rgba(255,90,35,0) 70%);filter:blur(64px)}
.ign-rmp .ign-ghost{font-size:520px;right:20px;bottom:-150px}
.ign-rmp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-rmp-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-rmp-head h2{font-size:64px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-rmp-head h2 .ign-serif{color:var(--ign-a)}
.ign-rmp-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:380px;text-align:right;text-wrap:pretty}
.ign-rmp-body{flex:1;display:flex;align-items:center}
.ign-rmp-track{position:relative;width:100%;height:430px}
.ign-rmp-spine{position:absolute;left:0;right:0;top:50%;height:2px;background:var(--ign-hair2);transform:translateY(-50%)}
.ign-rmp-fill{position:absolute;left:0;top:50%;height:3px;transform:translateY(-50%);
  background:linear-gradient(90deg,var(--ign-a),var(--ign-b));box-shadow:0 0 10px rgba(255,110,46,0.35)}
.ign-rmp-cols{position:absolute;inset:0;display:grid}
.ign-rmp-node{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ign-rmp-dot{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;
  background:var(--ign-bg);border:2px solid var(--ign-hair2);z-index:2}
.ign-rmp-node.done .ign-rmp-dot{background:var(--ign-ember);border-color:transparent}
.ign-rmp-node.now .ign-rmp-dot{background:var(--ign-ember);border:none;width:18px;height:18px;
  box-shadow:0 0 18px rgba(255,110,46,0.55)}
.ign-rmp-node.now .ign-rmp-dot::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:34px;height:34px;border-radius:50%;border:2px solid var(--ign-a)}
.ign-rmp-card{position:absolute;left:50%;transform:translateX(-50%);width:230px;text-align:center}
.ign-rmp-card.up{bottom:calc(50% + 40px)}
.ign-rmp-card.dn{top:calc(50% + 40px)}
.ign-rmp-ph{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3);margin-bottom:8px}
.ign-rmp-node.now .ign-rmp-ph,.ign-rmp-node.done .ign-rmp-ph{color:var(--ign-a)}
.ign-rmp-tt{font-size:28px;font-weight:700;letter-spacing:-0.01em;line-height:1.2}
.ign-rmp-ds{font-size:21px;font-weight:300;line-height:1.4;color:var(--ign-ink2);margin-top:8px;text-wrap:pretty}
.ign-rmp-conn{position:absolute;left:50%;width:1px;background:var(--ign-hair2);transform:translateX(-50%)}
.ign-rmp-conn.up{bottom:50%;height:32px}
.ign-rmp-conn.dn{top:50%;height:32px}
.ign-rmp-node.pending{opacity:0.5}
`;

export const roadmapDefaultProps = {
  surface: 'ink',
  milestoneCount: 5,
  currentIndex: 2,
  showDesc: true,
  showPhaseLabel: true,
  showProgress: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '→',
  railText: 'Roadmap — 路线',
  navItems: ['路线'],
  navCurrent: 0,
  ixNo: '45',
  ixLabel: 'Roadmap',
  lead: 'You are here.',
  headingHtml: '从点火到自转，<span class="ign-ember-text">五个阶段</span>。',
  lede: '不是一锤子买卖，而是一条有节奏的路线——你现在在第三阶段，引擎刚刚点火。',
  miles: [
    { ph: 'Phase 0', tt: '诊断与对齐', ds: '量化现状，锁定北极星指标。' },
    { ph: 'Phase 1', tt: '基建与埋点', ds: '搭好数据与内容地基。' },
    { ph: 'Phase 2', tt: '增长引擎点火', ds: '多渠道同时跑起来。' },
    { ph: 'Phase 3', tt: '复利放大', ds: '把赢的部分加倍投入。' },
    { ph: 'Phase 4', tt: '自运转体系', ds: '团队接手，引擎自转。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 合作路线图',
  metaMid: '一步一个台阶',
};

export const roadmapControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'milestoneCount', type: 'slider', label: '里程碑数量', default: 5, min: 3, max: 5, step: 1, describe: '路线图上的阶段节点数量。' },
  { key: 'currentIndex', type: 'slider', label: '当前阶段', default: 2, min: 0, max: 4, step: 1, describe: '「当前所在」节点序号（从 0 起）；之前为已完成，之后为待办。' },
  { key: 'showDesc', type: 'toggle', label: '节点描述', default: true, describe: '每个里程碑下方的描述句。' },
  { key: 'showPhaseLabel', type: 'toggle', label: '阶段标签', default: true, describe: '每个节点的 Phase 标签。' },
  { key: 'showProgress', type: 'toggle', label: '进度填充', default: true, describe: '主轴上的暖橙进度填充。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function RoadmapSlide(props) {
  injectCSS('ign-rmp-css', CSS);
  const p = { ...roadmapDefaultProps, ...props };
  const n = clampInt(p.milestoneCount, 3, 5);
  const cur = clampInt(p.currentIndex, 0, n - 1);
  const miles = (Array.isArray(p.miles) ? p.miles : []).slice(0, n).map((m, i) => ({
    ...m, st: i < cur ? 'done' : i === cur ? 'now' : 'pending',
  }));
  const fillPct = (cur / (n - 1)) * 100;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-rmp">
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

        <div className="ign-rmp-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-rmp-body ign-a2">
          <div className="ign-rmp-track">
            <div className="ign-rmp-spine" />
            {p.showProgress && <div className="ign-rmp-fill" style={{ width: `${fillPct}%` }} />}
            <div className="ign-rmp-cols" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
              {miles.map((m, i) => {
                const up = i % 2 === 0;
                return (
                  <div key={i} className={`ign-rmp-node ${m.st}`}>
                    <span className={`ign-rmp-conn ${up ? 'up' : 'dn'}`} />
                    <span className="ign-rmp-dot" />
                    <div className={`ign-rmp-card ${up ? 'up' : 'dn'}`}>
                      {p.showPhaseLabel && <div className="ign-rmp-ph">{m.ph}</div>}
                      <div className="ign-rmp-tt">{m.st === 'now' ? <EmberText>{m.tt}</EmberText> : m.tt}</div>
                      {p.showDesc && <div className="ign-rmp-ds">{m.ds}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '55%' }} /></span> 45 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
