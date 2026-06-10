/*
 * Slide12Timeline — 阶段性策略（横向三步走 · 连接轴 + 等高卡片）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsTl- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  stepCount        number 阶段数量            默认 3   可选 2–3
 *  focusEnabled     bool   重点突出开关         默认 false
 *  focusIndex       number 重点阶段序号(从1起)   默认 1   范围 1–stepCount
 *  showAxis         bool   连接轴线显隐         默认 true
 *  showRange        bool   时间区间显隐         默认 true
 *  showDecorations  bool   装饰元素显隐         默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide12Timeline, { defaults, controls } from './Slide12Timeline.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSTL_STEPS = [
  { range: '2025 – 2026', color: '#27E021', focus: '观察 IPO', desc: '盯头部公司 IPO 表现；若 OpenAI / Anthropic 上市破发，警惕全行业估值回调。' },
  { range: '2026 – 2027', color: '#15A7F0', focus: '收入曲线', desc: '关注垂直应用收入增长；优选 ARR ≥ 1 亿美元、续约率 > 120% 的标的。' },
  { range: '2027 年后', color: '#FFC700', focus: '行业洗牌', desc: '若 AGI 突破未兑现，进入洗牌期，可逢低抄底被低估的技术资产。' },
];

function TlSpark({ size = 20, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

function Slide12Timeline(props) {
  const {
    stepCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showAxis = true,
    showRange = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '投资展望 · 阶段性策略',
    titleLead = '分三步走，',
    titleKeyword = '穿越周期',
    sub = '不押注单点爆发，按时间窗口分阶段布局——用纪律穿越 AI 资本周期的起伏。',
    // 数据
    steps = XHSTL_STEPS,
  } = props;

  const src = Array.isArray(steps) ? steps : XHSTL_STEPS;
  const count = Math.max(2, Math.min(src.length, stepCount));
  const list = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsTl-root" data-label="阶段策略" data-screen-label="阶段策略">
      <style>{XHSTL_CSS}</style>

      <header className="xhsTl-head">
        <div className="xhsTl-kicker">{kicker}</div>
        <h2 className="xhsTl-title">
          <span>{titleLead}</span>
          <HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
        <p className="xhsTl-sub">{sub}</p>
      </header>

      <div className="xhsTl-stage">
        <div className="xhsTl-flow" style={{ '--n': count }}>
          {showAxis && <span className="xhsTl-rail" />}
          {list.map((s, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i}
                className={'xhsTl-col' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': s.color }}>
                <span className="xhsTl-node"><span className="xhsTl-nodeNum">{i + 1}</span></span>
                {showRange && <span className="xhsTl-range">{s.range}</span>}
                <div className="xhsTl-card">
                  <span className="xhsTl-ghost" aria-hidden="true">{'0' + (i + 1)}</span>
                  <span className="xhsTl-focus">{s.focus}</span>
                  <p className="xhsTl-desc">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 122, top: 188, width: 44, height: 44, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <TlSpark size={24} color="#27E021" style={{ position: 'absolute', right: 210, top: 150 }} />
          <TlSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSTL_CSS = `
  .xhsTl-root{ padding:80px 110px 72px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsTl-head{ flex:0 0 auto; }
  .xhsTl-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:16px; }
  .xhsTl-title{ margin:0; display:flex; align-items:center; gap:22px; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsTl-sub{ margin:20px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1300px; }

  /* 居中承载横向流程 */
  .xhsTl-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }
  .xhsTl-flow{ width:100%; position:relative; display:grid; grid-template-columns:repeat(var(--n),minmax(0,1fr)); column-gap:60px; align-items:stretch; }

  /* 连接轴：贯穿各节点圆心（圆心约在每列水平中点）。节点的黑环遮住穿过处。 */
  .xhsTl-rail{ position:absolute; top:34px; left:calc(50% / var(--n)); right:calc(50% / var(--n)); height:3px; transform:translateY(-50%);
    background:linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.3), rgba(255,255,255,.1)); border-radius:2px; z-index:0; }

  .xhsTl-col{ position:relative; min-width:0; display:flex; flex-direction:column; align-items:center; transition:opacity .3s ease, filter .3s ease; }
  /* 深化只作用在卡片/区间文字，节点圆保持不透明才能干净遮住轴线 */
  .xhsTl-col.is-dim{ filter:saturate(.7); }
  .xhsTl-col.is-dim .xhsTl-card, .xhsTl-col.is-dim .xhsTl-range{ opacity:.5; }

  .xhsTl-node{ position:relative; z-index:2; width:68px; height:68px; border-radius:50%; background:#0c0c0c; border:4px solid var(--c);
    box-sizing:border-box; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 9px #000;
    transition:transform .3s ease, box-shadow .3s ease, background .3s ease; }
  .xhsTl-nodeNum{ font-family:"Space Mono",monospace; font-size:30px; font-weight:700; color:var(--c); }
  .xhsTl-col.is-hot .xhsTl-node{ background:var(--c); transform:scale(1.14);
    box-shadow:0 0 0 9px #000, 0 0 44px color-mix(in srgb, var(--c) 65%, transparent); }
  .xhsTl-col.is-hot .xhsTl-nodeNum{ color:#000; }

  .xhsTl-range{ margin:18px 0 30px; font-family:"Space Mono",monospace; font-size:27px; font-weight:700; color:#cfcfcf; white-space:nowrap; }
  /* 无时间区间时给卡片留出与节点的间距 */
  .xhsTl-col:not(:has(.xhsTl-range)) .xhsTl-card{ margin-top:34px; }

  .xhsTl-card{ position:relative; overflow:hidden; width:100%; flex:1 1 auto;
    background:linear-gradient(165deg,#181818,#0d0d0d); border:1.5px solid color-mix(in srgb, var(--c) 26%, rgba(255,255,255,.07)); border-radius:22px;
    padding:32px 34px 34px; display:flex; flex-direction:column; gap:18px;
    transition:border-color .3s ease, box-shadow .3s ease; }
  /* 角落柔光替代顶部横杠：从左上角洇出的色光，与全局霓虹辉光一致 */
  .xhsTl-card::before{ content:""; position:absolute; left:0; top:0; width:58%; height:54%; z-index:0; pointer-events:none;
    background:radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--c) 32%, transparent), transparent 66%); }
  /* 重点突出：整卡填充「玻璃糖果」高光（与案例时间轴 Slide07Case 一致），文字转深色 */
  .xhsTl-col.is-hot .xhsTl-card{ border-color:transparent; transform:translateY(-4px) scale(1.02);
    background:linear-gradient(162deg, color-mix(in srgb, var(--c) 86%, #fff) 0%, var(--c) 48%, color-mix(in srgb, var(--c) 84%, #000) 100%);
    box-shadow:0 22px 50px color-mix(in srgb, var(--c) 40%, transparent), inset 0 3px 0 rgba(255,255,255,.62), inset 0 0 26px rgba(255,255,255,.42), inset 0 -12px 24px rgba(0,0,0,.16); }
  .xhsTl-col.is-hot .xhsTl-card::before{ opacity:0; }
  .xhsTl-ghost{ position:absolute; top:6px; right:20px; font-family:"Space Mono",monospace; font-size:108px; font-weight:700;
    line-height:1; color:var(--c); opacity:.13; letter-spacing:-.02em; pointer-events:none; transition:color .3s ease, opacity .3s ease; }
  .xhsTl-col.is-hot .xhsTl-ghost{ color:#06140f; opacity:.16; }
  .xhsTl-focus{ align-self:flex-start; position:relative; z-index:1; font-size:25px; font-weight:900; color:#000; background:var(--c);
    padding:7px 22px; border-radius:999px; box-shadow:inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45),
      0 6px 20px color-mix(in srgb, var(--c) 40%, transparent); transition:background .3s ease, color .3s ease, box-shadow .3s ease; }
  .xhsTl-col.is-hot .xhsTl-focus{ background:rgba(255,255,255,.92); color:#06140f;
    box-shadow:inset 0 2px 0 rgba(255,255,255,.85), 0 6px 18px rgba(0,0,0,.18); }
  .xhsTl-desc{ margin:0; position:relative; z-index:1; font-size:24px; line-height:1.58; font-weight:500; color:#a8a8a8; text-wrap:pretty; transition:color .3s ease; }
  .xhsTl-col.is-hot .xhsTl-desc{ color:#06140f; opacity:.84; font-weight:600; }
`;

const META = {
  id: 'timeline',
  label: '阶段策略',
  Component: Slide12Timeline,
  defaults: {
    ...hlDefaults,
    stepCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showAxis: true,
    showRange: true,
    showDecorations: true,
    kicker: '投资展望 · 阶段性策略',
    titleLead: '分三步走，',
    titleKeyword: '穿越周期',
    sub: '不押注单点爆发，按时间窗口分阶段布局——用纪律穿越 AI 资本周期的起伏。',
    steps: XHSTL_STEPS,
  },
  controls: [
    ...hlControls,
    { key: 'stepCount', type: 'slider', label: '阶段数量', min: 2, max: 3, step: 1, default: 3, desc: '时间轴阶段数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一阶段' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'stepCount', showIf: (v) => v.focusEnabled, desc: '被高亮阶段的序号' },
    { key: 'showAxis', type: 'toggle', label: '连接轴线', default: true, desc: '贯穿节点的横向轴线' },
    { key: 'showRange', type: 'toggle', label: '时间区间', default: true, desc: '节点下方的时间区间标签' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '投资展望 · 阶段性策略', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '分三步走，', desc: '标题关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '穿越周期', desc: '高亮关键词' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 2, default: '不押注单点爆发，按时间窗口分阶段布局——用纪律穿越 AI 资本周期的起伏。', desc: '标题下方说明' },
    { type: 'section', label: '数据 · 阶段' },
    {
      key: 'steps', type: 'list', label: '阶段', itemLabel: '阶段', countFromKey: 'stepCount',
      fields: [{ key: 'range', label: '时间区间' }, { key: 'focus', label: '关键词' }, { key: 'desc', label: '说明' }, { key: 'color', label: '颜色' }],
      default: XHSTL_STEPS, desc: '时间轴阶段：区间 / 关键词 / 说明 / 主色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide12Timeline.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide12Timeline;
