/*
 * Slide69Gantt — 资本节奏·泳道甘特（时间轴 · 新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsGt- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Timeline（横向三卡）/ Chronicle（纵向脊柱）/ Roadmap（阶梯升阶）/ Metro（地铁线）互补：
 * 本页是「泳道甘特」——左侧公司泳道、顶部 12 个月刻度，每家在自己的泳道上按月份落下
 * 融资事件标记（多轮用区间条连起来），一屏看清「这一年的资本节奏：谁先出手、谁连发」。
 * 数值为调研整理（报告案例，单位亿美元，月份为示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  laneCount       number 展示的公司泳道数(3–6)   默认 6
 *  focusEnabled    bool   重点泳道高亮开关         默认 true
 *  focusIndex      number 重点泳道序号(从1起)     默认 1   范围 1–laneCount
 *  showSpan        bool   多轮区间连接条显隐       默认 true
 *  showAmount      bool   事件金额标签显隐         默认 true
 *  showQuarterTint bool   季度背景分区淡色块       默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide69Gantt, { defaults, controls } from './Slide69Gantt.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSGT_MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
// 公司泳道（写死）：名 / 主色 / 事件[ {m:0-11, amt:'亿'} ]
const XHSGT_LANES = [
  { name: 'OpenAI', en: 'GENERAL', color: '#27E021', ev: [{ m: 9, amt: '66' }] },
  { name: 'Databricks', en: 'DATA', color: '#FFC700', ev: [{ m: 11, amt: '100' }] },
  { name: 'Anthropic', en: 'SAFETY', color: '#15A7F0', ev: [{ m: 2, amt: '27' }, { m: 10, amt: '40' }] },
  { name: 'xAI', en: 'GENERAL', color: '#FF9FE2', ev: [{ m: 4, amt: '60' }, { m: 11, amt: '50' }] },
  { name: 'CoreWeave', en: 'COMPUTE', color: '#27E021', ev: [{ m: 4, amt: '75' }] },
  { name: 'Figure AI', en: 'ROBOTICS', color: '#15A7F0', ev: [{ m: 1, amt: '6.7' }] },
];

function GtSpark({ size = 22, color = '#fff', style }) {
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

const mpos = (m) => ((m + 0.5) / 12) * 100; // 月份中点 left %


const SLIDE69GANTT_COPY = {
  text001: "资本节奏 · 2024 FUNDING CALENDAR",
  text002: "一整年的",
  text003: "资本节奏",
  text004: "Q",
  text005: "亿",
  text006: "资本节奏",
  text007: "每个标记 = 一笔披露融资 · 区间条 = 同年多轮 · 月份为示意（报告案例 · 调研整理）",
};
function Slide69Gantt(props) {
  const {
      copy = SLIDE69GANTT_COPY,
      lanesData = XHSGT_LANES,
      monthsData = XHSGT_MONTHS,
    laneCount = 6,
    focusEnabled = true,
    focusIndex = 1,
    showSpan = true,
    showAmount = true,
    showQuarterTint = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(3, Math.min(6, laneCount));
  const lanes = lanesData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsGt-root" data-label="泳道甘特" data-screen-label="泳道甘特"
      style={{ '--c': '#15A7F0' }}>
      <style>{XHSGT_CSS}</style>

      <header className="xhsGt-head">
        <div className="xhsGt-kicker">{copy.text001}</div>
        <h2 className="xhsGt-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsGt-board">
        {/* 月份刻度 */}
        <div className="xhsGt-axis">
          <span className="xhsGt-laneHeadSpacer" />
          <div className="xhsGt-months">
            {showQuarterTint && [0, 1, 2, 3].map((q) => (
              <span key={'q' + q} className={'xhsGt-qtint' + (q % 2 ? ' is-alt' : '')}
                style={{ left: `${q * 25}%`, width: '25%' }} aria-hidden="true">
                <span className="xhsGt-qlab">{copy.text004}{q + 1}</span>
              </span>
            ))}
            {monthsData.map((mo, i) => (
              <span key={i} className="xhsGt-mo" style={{ left: `${mpos(i)}%` }}>{mo}</span>
            ))}
          </div>
        </div>

        {/* 泳道 */}
        <div className="xhsGt-lanes">
          {lanes.map((lane, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            const first = lane.ev[0].m;
            const last = lane.ev[lane.ev.length - 1].m;
            const hasSpan = showSpan && lane.ev.length > 1;
            return (
              <div key={i} className={'xhsGt-lane' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': lane.color }}>
                <div className="xhsGt-laneHead">
                  <span className="xhsGt-ldot" aria-hidden="true" />
                  <span className="xhsGt-lname">{lane.name}</span>
                  <span className="xhsGt-len">{lane.en}</span>
                </div>
                <div className="xhsGt-track">
                  {showQuarterTint && [25, 50, 75].map((g) => (
                    <span key={g} className="xhsGt-gl" style={{ left: `${g}%` }} aria-hidden="true" />
                  ))}
                  {hasSpan && (
                    <span className="xhsGt-span" aria-hidden="true"
                      style={{ left: `${mpos(first)}%`, width: `${mpos(last) - mpos(first)}%` }} />
                  )}
                  {lane.ev.map((e, j) => (
                    <div key={j} className="xhsGt-ev" style={{ left: `${mpos(e.m)}%` }}>
                      <span className="xhsGt-evdot" aria-hidden="true" />
                      {showAmount && <span className="xhsGt-evamt">{e.amt}<i>{copy.text005}</i></span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="xhsGt-foot">
        <span className="xhsGt-foot-tag">{copy.text006}</span>
        <span className="xhsGt-foot-txt">{copy.text007}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <GtSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <GtSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 86, bottom: 116 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSGT_CSS = `
  .xhsGt-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsGt-head{ flex:0 0 auto; margin-bottom:22px; }
  .xhsGt-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsGt-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsGt-board{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; margin:6px 0 24px; }
  .xhsGt-axis{ flex:0 0 auto; display:flex; align-items:flex-end; height:42px; margin-bottom:8px; }
  .xhsGt-laneHeadSpacer{ flex:0 0 280px; }
  .xhsGt-months{ position:relative; flex:1 1 auto; height:100%; }
  .xhsGt-qtint{ position:absolute; top:0; bottom:0; pointer-events:none; }
  .xhsGt-qtint.is-alt{ background:rgba(255,255,255,.03); }
  .xhsGt-qlab{ position:absolute; top:0; left:10px; font-family:"Space Mono",monospace; font-size:15px; font-weight:700;
    letter-spacing:.1em; color:#5d5d5d; }
  .xhsGt-mo{ position:absolute; bottom:0; transform:translateX(-50%); font-family:"Space Mono",monospace;
    font-size:18px; font-weight:700; color:#7e7e7e; }

  .xhsGt-lanes{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:space-evenly; gap:8px;
    border-top:1.5px solid rgba(255,255,255,.1); padding-top:4px; }
  .xhsGt-lane{ display:flex; align-items:center; flex:1 1 0; min-height:0;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsGt-lane.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsGt-lane.is-hot{ transform:translateX(6px); }
  .xhsGt-laneHead{ flex:0 0 280px; display:flex; align-items:center; gap:14px; padding-right:24px; box-sizing:border-box; }
  .xhsGt-ldot{ width:14px; height:14px; border-radius:50%; background:var(--c); flex:0 0 auto;
    box-shadow:0 0 12px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsGt-lname{ font-size:27px; font-weight:800; color:#ededed; white-space:nowrap; }
  .xhsGt-lane.is-hot .xhsGt-lname{ color:#fff; }
  .xhsGt-len{ font-family:"Space Mono",monospace; font-size:13px; letter-spacing:.1em; color:#6a6a6a; }

  .xhsGt-track{ position:relative; flex:1 1 auto; height:100%; min-width:0;
    display:flex; align-items:center; border-radius:14px; background:rgba(255,255,255,.028); }
  .xhsGt-gl{ position:absolute; top:8px; bottom:8px; width:1.5px; background:rgba(255,255,255,.05); }
  .xhsGt-span{ position:absolute; top:50%; transform:translateY(-50%); height:10px; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 40%, transparent), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsGt-ev{ position:absolute; top:50%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; gap:6px; }
  .xhsGt-evdot{ width:26px; height:26px; border-radius:50%;
    background:radial-gradient(circle at 36% 30%, color-mix(in srgb, var(--c) 92%, #fff), var(--c) 60%, color-mix(in srgb, var(--c) 72%, #000));
    border:2.5px solid #000; box-shadow:0 0 0 4px color-mix(in srgb, var(--c) 26%, transparent), 0 0 22px color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsGt-evamt{ position:absolute; bottom:calc(50% + 20px); font-family:"Space Mono",monospace; font-size:21px; font-weight:700; color:#fff;
    white-space:nowrap; text-shadow:0 2px 8px rgba(0,0,0,.7); }
  .xhsGt-evamt i{ font-style:normal; font-size:14px; color:var(--c); margin-left:2px; }
  .xhsGt-lane.is-hot .xhsGt-evdot{ transform:scale(1.14); }

  .xhsGt-foot{ flex:0 0 auto; display:flex; align-items:center; gap:18px; }
  .xhsGt-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#15A7F0; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(21,167,240,.4); }
  .xhsGt-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'gantt',
  label: '泳道甘特',
  Component: Slide69Gantt,
  defaults: {
      copy: SLIDE69GANTT_COPY,
      lanesData: XHSGT_LANES,
      monthsData: XHSGT_MONTHS,
    ...hlDefaults,
    laneCount: 6,
    focusEnabled: true,
    focusIndex: 1,
    showSpan: true,
    showAmount: true,
    showQuarterTint: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE69GANTT_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'lanesData', type: 'list', label: 'lanesData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "en", label: "en" }, { key: "color", label: "color" }], default: XHSGT_LANES, desc: '默认数据内容' },
    { key: 'monthsData', type: 'list', label: 'monthsData', itemLabel: '数据', primitive: true, default: XHSGT_MONTHS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'laneCount', type: 'slider', label: '公司泳道数', min: 3, max: 6, step: 1, default: 6, desc: '展示的公司泳道数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一泳道' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'laneCount', showIf: (v) => v.focusEnabled, desc: '被高亮泳道的序号' },
    { key: 'showSpan', type: 'toggle', label: '多轮区间条', default: true, desc: '同年多轮的区间连接条' },
    { key: 'showAmount', type: 'toggle', label: '金额标签', default: true, desc: '事件金额标签' },
    { key: 'showQuarterTint', type: 'toggle', label: '季度分区', default: true, desc: '季度背景分区淡色块' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide69Gantt.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide69Gantt;
