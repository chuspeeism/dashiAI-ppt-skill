/* Slide07Process.jsx — IGNIS deck · horizontal workflow / process page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: processDefaultProps (complete defaults) + processControls (1:1).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-flow7 .ign-frame{justify-content:space-between}
.ign-flow7 .b1{width:1500px;height:760px;left:50%;top:54%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.24),rgba(226,42,12,0) 70%);filter:blur(56px)}
.ign-flow7 .ign-ghost{font-size:540px;right:30px;top:-70px}
.ign-flow7-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:40px;gap:48px}
.ign-flow7-head h2{font-size:74px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-flow7-head h2 .ign-serif{color:var(--ign-a)}
.ign-flow7-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:30px;color:var(--ign-a);margin-bottom:12px}
.ign-flow7-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);max-width:340px;text-align:right;line-height:1.4}
.ign-flow7-track{display:flex;align-items:center;margin-top:8px}
.ign-flow7-start{width:64px;height:64px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;position:relative;
  border:1px solid var(--ign-hair2)}
.ign-flow7-start::after{content:"";width:18px;height:18px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 22px var(--ign-b)}
.ign-flow7-start .ring{position:absolute;inset:-10px;border-radius:50%;border:1px solid var(--ign-hair)}
.ign-flow7-conn{flex:none;width:54px;height:1px;background:linear-gradient(90deg,var(--ign-hair2),var(--ign-hair2));position:relative}
.ign-flow7-conn::after{content:"";position:absolute;right:0;top:-4px;width:8px;height:8px;border-top:1px solid var(--ign-ink3);border-right:1px solid var(--ign-ink3);transform:rotate(45deg)}
.ign-flow7-node{flex:1;background:var(--ign-panel);border:1px solid var(--ign-hair);border-radius:4px;padding:26px 26px 28px}
.ign-flow7-node.hot{border-color:var(--ign-b);background:rgba(255,110,46,0.06)}
.ign-flow7-node .nn{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;color:var(--ign-a)}
.ign-flow7-node .nt{font-size:30px;font-weight:700;margin-top:18px;line-height:1.2}
.ign-flow7-node .ne{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:24px;color:var(--ign-ink3);margin-top:8px}
.ign-flow7-caps{display:grid;gap:48px;border-top:1px solid var(--ign-hair);padding-top:28px}
.ign-flow7-caps .cap .ct{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-a);margin-bottom:12px}
.ign-flow7-caps .cap .cd{font-size:26px;font-weight:300;line-height:1.5;color:var(--ign-ink2)}
`;

const STEPS = [
  { t: '关键词研究', e: 'Research' },
  { t: '落地页搭建', e: 'Build' },
  { t: '文案撰写', e: 'Copy' },
  { t: 'A/B 测试', e: 'Test' },
  { t: '转化率优化', e: 'Optimize' },
];
const CAPS = [
  { t: 'Immediate exposure', d: '凭借精准的渠道定位，让品牌即刻获得有效曝光。' },
  { t: 'Accelerate leads', d: '用清晰、高转化的落地页，加速整条线索生成流程。' },
  { t: 'Maximize budget', d: '以高效的出价策略，让每一份预算都物尽其用。' },
];

export const processDefaultProps = {
  surface: 'paper',
  stepCount: 5,
  showStartNode: true,
  emphasis: false,
  emphasisIndex: 0,
  showCaptions: true,
  captionCount: 3,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '06',
  railText: 'Process — 流程',
  navItems: ['流程'],
  navCurrent: 0,
  ixNo: '06',
  ixLabel: 'Process',
  lead: 'Make every dollar count.',
  headingHtml: '让每一分投入，<br><span class="ign-ember-text">都转化为增长</span>。',
  noteHtml: '一条贯通的工作流，<br>从研究到复利环环相扣。',
  steps: [
    { t: '关键词研究', e: 'Research' },
    { t: '落地页搭建', e: 'Build' },
    { t: '文案撰写', e: 'Copy' },
    { t: 'A/B 测试', e: 'Test' },
    { t: '转化率优化', e: 'Optimize' },
  ],
  caps: [
    { t: 'Immediate exposure', d: '凭借精准的渠道定位，让品牌即刻获得有效曝光。' },
    { t: 'Accelerate leads', d: '用清晰、高转化的落地页，加速整条线索生成流程。' },
    { t: 'Maximize budget', d: '以高效的出价策略，让每一份预算都物尽其用。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长工作流',
  metaMid: '研究 → 搭建 → 测试 → 复利',
};

export const processControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'stepCount', type: 'slider', label: '流程节点数', default: 5, min: 3, max: 5, step: 1, describe: '横向流程的节点数量。' },
  { key: 'showStartNode', type: 'toggle', label: '起点节点', default: true, describe: '流程最左侧的脉冲起点圆点。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一个流程节点，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的节点序号（从 0 起）。' },
  { key: 'showCaptions', type: 'toggle', label: '底部说明', default: true, describe: '底部的成果说明栏。' },
  { key: 'captionCount', type: 'slider', label: '说明数量', default: 3, min: 2, max: 3, step: 1, describe: '底部说明栏的条目数量。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的衬线引言。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ProcessSlide(props) {
  injectCSS('ign-flow7-css', CSS);
  const p = { ...processDefaultProps, ...props };
  const count = clampInt(p.stepCount, 3, 5);
  const steps = (Array.isArray(p.steps) ? p.steps : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const cc = clampInt(p.captionCount, 2, 3);
  const caps = (Array.isArray(p.caps) ? p.caps : []).slice(0, cc);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-flow7">
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

        <div className="ign-flow7-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-flow7-track ign-a2">
          {p.showStartNode && <div className="ign-flow7-start"><span className="ring" /></div>}
          {p.showStartNode && <div className="ign-flow7-conn" />}
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="ign-flow7-conn" />}
              <div className={`ign-flow7-node ${p.emphasis ? (i === emi ? 'hot ign-lit' : 'ign-dim') : ''}`}>
                <div className="nn">{String(i + 1).padStart(2, '0')}</div>
                <div className="nt">{s.t}</div>
                <div className="ne">{s.e}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {p.showCaptions && (
          <div className="ign-flow7-caps ign-a3" style={{ gridTemplateColumns: `repeat(${cc},1fr)` }}>
            {caps.map((c, i) => (
              <div key={i} className="cap"><div className="ct">{c.t}</div><div className="cd">{c.d}</div></div>
            ))}
          </div>
        )}

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '23%' }} /></span> 19 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
