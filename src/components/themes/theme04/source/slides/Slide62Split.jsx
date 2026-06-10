/*
 * Slide62Split — 分屏章节页（章节页 · 实色 accent 面板 + 议题清单，新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSpl- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Section（海报卡+索引）/ Chapter（幽灵大字）/ CoverSection（整屏图背）互补：
 * 本页是「左右分屏」——一侧整块实色 accent 面板托住超大 Part 编号 + 中英标题，
 * 另一侧黑底列出「本章将回答的议题」，开篇即立纲。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  partNumber      number 章节编号(徽章/巨数)   默认 5   可选 1–6
 *  accentTone      enum   主色调(通用命名)       默认 'yellow' 可选 green|yellow|blue|pink
 *  panelSide       enum   accent 面板侧          默认 'left' 可选 'left'|'right'
 *  showObjectives  bool   议题清单显隐           默认 true
 *  objectiveCount  number 议题条数(2–4)          默认 3
 *  focusEnabled    bool   当前议题高亮开关        默认 true
 *  focusIndex      number 当前议题序号(从1起)    默认 1   范围 1–objectiveCount
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide62Split, { defaults, controls } from './Slide62Split.jsx'
 */
import React from 'react';

const XHSSPL_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 章节信息（写死）
const XHSSPL_CHAPTER = { zh: '风险与展望', en: 'RISK & OUTLOOK', tag: '本章导读 · CHAPTER BRIEF' };

// 议题清单（写死）：编号 + 中文 + 英文小注
const XHSSPL_OBJECTIVES = [
  { no: '01', zh: '资本高度集中的结构性风险', en: 'CONCENTRATION RISK' },
  { no: '02', zh: '估值与商业兑现的落差', en: 'VALUATION vs DELIVERY' },
  { no: '03', zh: '2025 的三段式演进路径', en: 'PATH AHEAD · 2025' },
  { no: '04', zh: '泡沫还是新基建之争', en: 'BUBBLE OR BEDROCK' },
];

function SplSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE62SPLIT_COPY = {
  text001: "这一章，我们回答四个问题里",
  text002: "最关键的",
  text003: "几个",
};
function Slide62Split(props) {
  const {
      copy = SLIDE62SPLIT_COPY,
      objectivesData = XHSSPL_OBJECTIVES,
      chapterData = XHSSPL_CHAPTER,
    partNumber = 5,
    accentTone = 'yellow',
    panelSide = 'left',
    showObjectives = true,
    objectiveCount = 3,
    focusEnabled = true,
    focusIndex = 1,
    showDecorations = true,
  } = props;

  const accent = XHSSPL_TONES[accentTone] || XHSSPL_TONES.yellow;
  const part = Math.max(1, Math.min(6, partNumber));
  const partStr = String(part).padStart(2, '0');
  const oc = Math.max(2, Math.min(4, objectiveCount));
  const objs = objectivesData.slice(0, oc);
  const focus = Math.max(1, Math.min(oc, focusIndex)) - 1;
  const panelRight = panelSide === 'right';

  const Panel = (
    <div className="xhsSpl-panel">
      <span className="xhsSpl-tag">{`PART ${partStr}`}</span>
      <span className="xhsSpl-bignum" aria-hidden="true">{partStr}</span>
      <div className="xhsSpl-titleBlock">
        <span className="xhsSpl-zh">{chapterData.zh}</span>
        <span className="xhsSpl-en">{chapterData.en}</span>
      </div>
      {showDecorations && (
        <React.Fragment>
          <SplSpark size={36} color="#ffffff" style={{ position: 'absolute', top: 64, right: 60 }} />
          <span aria-hidden="true" className="xhsSpl-ring" style={{ bottom: 86, left: 70 }} />
        </React.Fragment>
      )}
    </div>
  );

  const Content = (
    <div className="xhsSpl-content">
      <div className="xhsSpl-kicker">{chapterData.tag}</div>
      <h3 className="xhsSpl-lead">{copy.text001}<br />{copy.text002}<span className="xhsSpl-em">{copy.text003}</span>。
      </h3>
      {showObjectives && (
        <ul className="xhsSpl-list">
          {objs.map((o, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <li key={i} className={'xhsSpl-item' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}>
                <span className="xhsSpl-no">{o.no}</span>
                <span className="xhsSpl-otext">
                  <span className="xhsSpl-ozh">{o.zh}</span>
                  <span className="xhsSpl-oen">{o.en}</span>
                </span>
                {hot && <span className="xhsSpl-mark" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <section className={'xhs-base xhsSpl-root' + (panelRight ? ' is-rev' : '')}
      data-label="分屏章节" data-screen-label="分屏章节" style={{ '--c': accent }}>
      <style>{XHSSPL_CSS}</style>
      {panelRight ? <React.Fragment>{Content}{Panel}</React.Fragment>
        : <React.Fragment>{Panel}{Content}</React.Fragment>}

      {showDecorations && (
        <SplSpark size={18} color={accent} style={{ position: 'absolute', right: panelRight ? 'auto' : 90, left: panelRight ? 90 : 'auto', bottom: 70 }} />
      )}
    </section>
  );
}

const XHSSPL_CSS = `
  .xhsSpl-root{ padding:0; position:relative; display:grid; grid-template-columns:0.86fr 1.14fr; height:100%; box-sizing:border-box; }
  .xhsSpl-root.is-rev{ grid-template-columns:1.14fr 0.86fr; }

  /* —— 实色 accent 面板 —— */
  .xhsSpl-panel{ position:relative; overflow:hidden; min-width:0; display:flex; flex-direction:column; justify-content:center;
    padding:120px 96px; box-sizing:border-box;
    background:linear-gradient(152deg, color-mix(in srgb, var(--c) 88%, #fff) 0%, var(--c) 48%, color-mix(in srgb, var(--c) 74%, #000) 100%);
    box-shadow:inset 0 3px 0 rgba(255,255,255,.4); }
  .xhsSpl-panel::after{ content:""; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(620px 520px at 78% 16%, rgba(255,255,255,.32), transparent 60%); }
  .xhsSpl-tag{ font-family:"Space Mono",monospace; font-size:28px; font-weight:700; letter-spacing:.16em; color:rgba(0,0,0,.62); }
  .xhsSpl-bignum{ font-family:"Space Mono",monospace; font-weight:700; font-size:380px; line-height:.8;
    color:#000; letter-spacing:-.05em; margin:6px 0 auto -14px; }
  .xhsSpl-titleBlock{ display:flex; flex-direction:column; gap:12px; }
  .xhsSpl-zh{ font-size:78px; font-weight:900; color:#000; line-height:1; letter-spacing:.02em; }
  .xhsSpl-en{ font-family:"Space Mono",monospace; font-size:22px; letter-spacing:.18em; color:rgba(0,0,0,.6); }
  .xhsSpl-ring{ position:absolute; width:62px; height:62px; border-radius:50%;
    border:6px solid rgba(0,0,0,.55); }

  /* —— 黑底议题侧 —— */
  .xhsSpl-content{ position:relative; display:flex; flex-direction:column; justify-content:center;
    padding:120px 110px; box-sizing:border-box; min-width:0; }
  .xhsSpl-content::before{ content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(900px 700px at 80% 30%, color-mix(in srgb, var(--c) 12%, transparent), transparent 70%); }
  .xhsSpl-kicker{ position:relative; font-family:"Space Mono",monospace; font-size:22px; letter-spacing:.16em; color:#7c7c7c; margin-bottom:24px; }
  .xhsSpl-lead{ position:relative; margin:0 0 50px; font-size:50px; font-weight:900; color:#fff; line-height:1.22; }
  .xhsSpl-em{ color:var(--c); text-shadow:0 0 .5em color-mix(in srgb, var(--c) 32%, transparent); }

  .xhsSpl-list{ position:relative; list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:16px; }
  .xhsSpl-item{ position:relative; display:flex; align-items:center; gap:28px; padding:22px 30px; border-radius:18px;
    background:linear-gradient(120deg,#151515,#0c0c0c); border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s, filter .3s, border-color .3s, box-shadow .3s, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsSpl-item.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSpl-item.is-hot{ border-color:var(--c); box-shadow:0 0 52px color-mix(in srgb, var(--c) 24%, transparent); transform:translateX(8px); }
  .xhsSpl-no{ font-family:"Space Mono",monospace; font-size:44px; font-weight:700; line-height:1; flex:0 0 auto;
    color:transparent; -webkit-text-stroke:2px color-mix(in srgb, var(--c) 60%, #555); }
  .xhsSpl-item.is-hot .xhsSpl-no{ color:var(--c); -webkit-text-stroke:0; text-shadow:0 0 20px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsSpl-otext{ display:flex; flex-direction:column; gap:5px; min-width:0; }
  .xhsSpl-ozh{ font-size:32px; font-weight:800; color:#eee; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
  .xhsSpl-item.is-hot .xhsSpl-ozh{ color:#fff; }
  .xhsSpl-oen{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.14em; color:#6f6f6f; }
  .xhsSpl-mark{ position:absolute; right:26px; top:50%; transform:translateY(-50%);
    width:13px; height:13px; border-radius:50%; background:var(--c); box-shadow:0 0 12px color-mix(in srgb, var(--c) 60%, transparent); }
`;

const META = {
  id: 'split',
  label: '分屏章节',
  Component: Slide62Split,
  defaults: {
      copy: SLIDE62SPLIT_COPY,
      objectivesData: XHSSPL_OBJECTIVES,
      chapterData: XHSSPL_CHAPTER,
    partNumber: 5,
    accentTone: 'yellow',
    panelSide: 'left',
    showObjectives: true,
    objectiveCount: 3,
    focusEnabled: true,
    focusIndex: 1,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }], default: SLIDE62SPLIT_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'objectivesData', type: 'list', label: 'objectivesData', itemLabel: '数据', fields: [{ key: "no", label: "no" }, { key: "zh", label: "zh" }, { key: "en", label: "en" }], default: XHSSPL_OBJECTIVES, desc: '默认数据内容' },
    { key: 'chapterData', type: 'list', label: 'chapterData', itemLabel: '数据', single: true, fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "tag", label: "tag" }], default: XHSSPL_CHAPTER, desc: '默认数据内容' },
    { key: 'partNumber', type: 'slider', label: '章节编号', min: 1, max: 6, step: 1, default: 5, desc: '大号 Part 编号' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'yellow', desc: '页面主色调' },
    { key: 'panelSide', type: 'radio', label: '面板侧', options: ['left', 'right'], optionLabels: ['左', '右'], default: 'left', desc: 'accent 面板在左 / 右' },
    { key: 'showObjectives', type: 'toggle', label: '议题清单', default: true, desc: '右侧议题清单' },
    { key: 'objectiveCount', type: 'slider', label: '议题条数', min: 2, max: 4, step: 1, default: 3, showIf: (v) => v.showObjectives, desc: '议题条目数量' },
    { key: 'focusEnabled', type: 'toggle', label: '当前高亮', default: true, showIf: (v) => v.showObjectives, desc: '高亮当前议题' },
    { key: 'focusIndex', type: 'slider', label: '当前序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'objectiveCount', showIf: (v) => v.showObjectives && v.focusEnabled, desc: '当前议题序号' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide62Split.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide62Split;
