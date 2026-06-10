/*
 * Slide52Metro — 资本地铁线（时间轴页 · 横向连续「地铁线」里程碑）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsMt- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与已有时间轴互补：Slide12Timeline（横向三大卡）/ Chronicle（纵向脊柱）/ Roadmap（阶梯升阶）。
 * 本页是一条贯穿全幅的「地铁线」，多个换乘站节点等距分布，标签在线上 / 线下交替，
 * 适合「一年内多个资本里程碑」的密集叙事。数据为调研整理（报告 2.x 时间线，示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  nodeCount       number 站点数量(3–6)        默认 6
 *  focusEnabled    bool   重点站高亮开关         默认 true
 *  focusIndex      number 重点站序号(从1起)     默认 3   范围 1–nodeCount
 *  alternate       bool   标签线上/线下交替       默认 true（关=全部在线下）
 *  showValue       bool   站点金额/结论行显隐     默认 true
 *  showLine        bool   贯穿地铁线显隐         默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide52Metro, { defaults, controls } from './Slide52Metro.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 站点（写死）：季度徽章 / 站名 / 结论值 / 主色
const XHSMT_NODES = [
  { tag: '2023 Q4', name: '资本回暖', val: '基础模型重启大额融资', color: '#27E021' },
  { tag: '2024 Q1', name: 'Anthropic 加注', val: '亚马逊再追投 40 亿', color: '#15A7F0' },
  { tag: '2024 Q2', name: 'xAI B 轮', val: '单笔募资 60 亿美元', color: '#FFC700' },
  { tag: '2024 Q4', name: 'Databricks', val: '史上最大轮 100 亿', color: '#FF9FE2' },
  { tag: '2024 末', name: 'OpenAI', val: '66 亿 · 估值 1570 亿', color: '#27E021' },
  { tag: '2025 展望', name: 'IPO 窗口', val: '头部排队冲刺上市', color: '#15A7F0' },
];

function MtSpark({ size = 20, color = '#fff', style }) {
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


const SLIDE52METRO_COPY = {
  text001: "资本时间线 · CAPITAL LINE",
  text002: "一年六站，",
  text003: "资本一路加速",
  text004: "节节攀升",
  text005: "从基础模型回暖到头部冲刺 IPO，2024 资本沿这条线一路加速 · 数据为调研整理（报告 2.x · 示意）",
};
function Slide52Metro(props) {
  const {
      copy = SLIDE52METRO_COPY,
      nodesData = XHSMT_NODES,
    nodeCount = 6,
    focusEnabled = true,
    focusIndex = 3,
    alternate = true,
    showValue = true,
    showLine = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(3, Math.min(6, nodeCount));
  const nodes = nodesData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsMt-root" data-label="资本地铁线" data-screen-label="资本地铁线">
      <style>{XHSMT_CSS}</style>

      <header className="xhsMt-head">
        <div className="xhsMt-kicker">{copy.text001}</div>
        <h2 className="xhsMt-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsMt-stage">
        <div className="xhsMt-track" style={{ '--n': n }}>
          {showLine && <span className="xhsMt-line" aria-hidden="true" />}
          {nodes.map((d, i) => {
            const above = alternate ? i % 2 === 0 : false;
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i}
                className={'xhsMt-stop' + (above ? ' is-above' : ' is-below') + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': d.color }}>
                <div className="xhsMt-card">
                  <span className="xhsMt-tag">{d.tag}</span>
                  <span className="xhsMt-name">{d.name}</span>
                  {showValue && <span className="xhsMt-val">{d.val}</span>}
                </div>
                <span className="xhsMt-stub" aria-hidden="true" />
                <span className="xhsMt-node"><span className="xhsMt-nodeNum">{i + 1}</span></span>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="xhsMt-foot">
        <span className="xhsMt-foot-tag">{copy.text004}</span>
        <span className="xhsMt-foot-txt">{copy.text005}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <MtSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 100, top: 150 }} />
          <MtSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 116 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSMT_CSS = `
  .xhsMt-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsMt-head{ flex:0 0 auto; margin-bottom:8px; }
  .xhsMt-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsMt-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsMt-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }
  .xhsMt-track{ position:relative; width:100%; display:grid; grid-template-columns:repeat(var(--n),1fr); align-items:center; }

  /* 贯穿地铁线：圆心约在每列水平中点；两端内缩半列对齐首尾节点圆心 */
  .xhsMt-line{ position:absolute; top:50%; left:calc(50% / var(--n)); right:calc(50% / var(--n)); height:6px; transform:translateY(-50%);
    background:linear-gradient(90deg,#27E021,#15A7F0,#FFC700,#FF9FE2,#27E021); border-radius:6px; opacity:.85;
    box-shadow:0 0 16px rgba(255,255,255,.1); z-index:0; }

  .xhsMt-stop{ position:relative; z-index:2; height:560px; display:flex; flex-direction:column; align-items:center; justify-content:center;
    transition:opacity .3s ease, filter .3s ease; }
  /* 深化只作用在卡片/连接段，节点圆保持不透明才能干净遮住地铁线 */
  .xhsMt-stop.is-dim{ filter:saturate(.7); }
  .xhsMt-stop.is-dim .xhsMt-card{ opacity:.5; }
  .xhsMt-stop.is-dim .xhsMt-stub{ opacity:.55; }

  /* 节点圆：实心「站点珠」压在线上，外加大号黑环把地铁线干净断开（珠串而非穿过） */
  .xhsMt-node{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:3;
    width:60px; height:60px; border-radius:50%;
    background:radial-gradient(circle at 50% 36%, #262626 0%, #0d0d0d 74%); border:4px solid var(--c); box-sizing:border-box;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 0 11px #000, inset 0 2px 6px rgba(0,0,0,.55), 0 0 18px color-mix(in srgb, var(--c) 30%, transparent);
    transition:transform .3s ease, box-shadow .3s ease, background .3s ease; }
  .xhsMt-nodeNum{ font-family:"Space Mono",monospace; font-size:26px; font-weight:700; color:var(--c); transition:color .3s ease; }
  .xhsMt-stop.is-hot .xhsMt-node{ background:var(--c); transform:translate(-50%,-50%) scale(1.16);
    box-shadow:0 0 0 10px #000, 0 0 44px color-mix(in srgb, var(--c) 65%, transparent); }
  .xhsMt-stop.is-hot .xhsMt-nodeNum{ color:#06140f; }

  /* 站点到线之间的小连接段 */
  .xhsMt-stub{ position:absolute; left:50%; transform:translateX(-50%); width:3px; height:64px;
    background:linear-gradient(var(--c), color-mix(in srgb, var(--c) 30%, transparent)); z-index:1; }
  .xhsMt-stop.is-above .xhsMt-stub{ top:calc(50% - 94px); }
  .xhsMt-stop.is-below .xhsMt-stub{ top:calc(50% + 30px); }

  /* 站点卡：线上 / 线下分别定位，留出节点与连接段空间 */
  .xhsMt-card{ position:absolute; left:50%; transform:translateX(-50%); width:88%; max-width:280px;
    display:flex; flex-direction:column; align-items:flex-start; gap:10px;
    background:linear-gradient(165deg, color-mix(in srgb, var(--c) 15%, #161616), #0d0d0d 72%);
    border:1.5px solid color-mix(in srgb, var(--c) 36%, rgba(255,255,255,.08)); border-radius:20px;
    padding:22px 24px 24px; box-shadow:0 18px 44px rgba(0,0,0,.5);
    transition:border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsMt-stop.is-above .xhsMt-card{ bottom:calc(50% + 92px); }
  .xhsMt-stop.is-below .xhsMt-card{ top:calc(50% + 92px); }
  .xhsMt-stop.is-hot .xhsMt-card{ border-color:var(--c); transform:translateX(-50%) translateY(-4px);
    box-shadow:0 0 52px color-mix(in srgb, var(--c) 26%, transparent); }

  .xhsMt-tag{ font-family:"Space Mono",monospace; font-size:18px; font-weight:700; letter-spacing:.06em; color:#06140f;
    background:var(--c); padding:4px 14px; border-radius:8px;
    box-shadow:inset 0 2px 0 rgba(255,255,255,.5), 0 6px 16px color-mix(in srgb, var(--c) 36%, transparent); }
  .xhsMt-name{ font-size:30px; font-weight:900; color:#fff; line-height:1.08; }
  .xhsMt-stop.is-hot .xhsMt-name{ color:var(--c); }
  .xhsMt-val{ font-size:20px; font-weight:600; color:#9c9c9c; line-height:1.4; text-wrap:pretty; }

  .xhsMt-foot{ flex:0 0 auto; margin-top:14px; display:flex; align-items:center; gap:18px; }
  .xhsMt-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#27E021; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(39,224,33,.4); }
  .xhsMt-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'metro',
  label: '资本地铁线',
  Component: Slide52Metro,
  defaults: {
      copy: SLIDE52METRO_COPY,
      nodesData: XHSMT_NODES,
    ...hlDefaults,
    nodeCount: 6,
    focusEnabled: true,
    focusIndex: 3,
    alternate: true,
    showValue: true,
    showLine: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }], default: SLIDE52METRO_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'nodesData', type: 'list', label: 'nodesData', itemLabel: '数据', fields: [{ key: "tag", label: "tag" }, { key: "name", label: "name" }, { key: "val", label: "val" }, { key: "color", label: "color" }], default: XHSMT_NODES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'nodeCount', type: 'slider', label: '站点数量', min: 3, max: 6, step: 1, default: 6, desc: '地铁线上的里程碑站点数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一站' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 6, step: 1, default: 3, maxFromKey: 'nodeCount', showIf: (v) => v.focusEnabled, desc: '被高亮站点的序号' },
    { key: 'alternate', type: 'toggle', label: '上下交替', default: true, desc: '标签在线上 / 线下交替（关=全部在线下）' },
    { key: 'showValue', type: 'toggle', label: '结论行', default: true, desc: '站点金额 / 结论行显隐' },
    { key: 'showLine', type: 'toggle', label: '贯穿线', default: true, desc: '贯穿全幅的地铁线显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide52Metro.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide52Metro;
