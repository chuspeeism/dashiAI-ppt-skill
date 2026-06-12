/*
 * Slide70DeltaHero — 一年之变·增长大数字（大数字 · delta hero 新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsDh- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 BigNumber（一巨数 + 支撑卡）/ StatTrio（三数并置）/ Versus（两数对峙）互补：
 * 本页强调「一年之变」——一个巨型同比增速 + 「去年→今年」体量跃迁条 + 右栏支撑变化卡，
 * 一眼读懂「资本大年到底涨了多少」。数据为调研整理（报告 2.x，单位亿美元，示意比例）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   主色调(通用命名)       默认 'green' 可选 green/yellow/blue/pink
 *  metricCount     number 右栏支撑变化卡数(0–3)  默认 3
 *  focusEnabled    bool   重点支撑卡高亮开关      默认 false
 *  focusIndex      number 重点卡序号(从1起)      默认 1   范围 1–metricCount
 *  showTrack       bool   去年→今年跃迁条显隐     默认 true
 *  showUnit        bool   主数字单位后缀显隐      默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide70DeltaHero, { defaults, controls } from './Slide70DeltaHero.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSDH_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 右栏支撑变化卡（写死）：标签 / 变化值 / 方向 up|down / 注脚
const XHSDH_METRICS = [
  { k: '大额事件数', d: '+64', u: '%', dir: 'up', note: '≥1 亿美元单笔融资' },
  { k: '单笔均值', d: '+38', u: '%', dir: 'up', note: '头部抬高整体水位' },
  { k: '占全美 VC', d: '+9', u: 'pct', dir: 'up', note: '逼近三分之一' },
];

function DhSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE70DELTAHERO_COPY = {
  text001: "一年之变 · YEAR-OVER-YEAR",
  text002: "一年时间，",
  text003: "资本翻了一倍",
  text004: "▲",
  text005: "116",
  text006: "%",
  text007: "2024 AI 初创吸纳风险投资 · 同比增速",
  text008: "2023",
  text009: "≈450",
  text010: "亿",
  text011: "×2.2",
  text012: "2024",
  text013: "≈970",
  text014: "亿",
  text015: "一年之变",
  text016: "同比口径：2023→2024 全年公开披露 AI 融资额，比例为示意（报告 2.x · 调研整理）",
};
function Slide70DeltaHero(props) {
  const {
      copy = SLIDE70DELTAHERO_COPY,
      metricsData = XHSDH_METRICS,
    accentTone = 'green',
    metricCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showTrack = true,
    showUnit = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const accent = XHSDH_TONES[accentTone] || XHSDH_TONES.green;
  const mc = Math.max(0, Math.min(3, metricCount));
  const metrics = metricsData.slice(0, mc);
  const focus = Math.max(1, Math.min(Math.max(1, mc), focusIndex)) - 1;

  return (
    <section className="xhs-base xhsDh-root" data-label="增长大数字" data-screen-label="增长大数字"
      style={{ '--c': accent }}>
      <style>{XHSDH_CSS}</style>

      <header className="xhsDh-head">
        <div className="xhsDh-kicker">{copy.text001}</div>
        <h2 className="xhsDh-title">{copy.text002}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsDh-body">
        <div className="xhsDh-hero">
          <span className="xhsDh-arrow" aria-hidden="true">{copy.text004}</span>
          <div className="xhsDh-bignum">
            <span className="xhsDh-sign">+</span>
            <span className="xhsDh-digits">{copy.text005}</span>
            {showUnit && <span className="xhsDh-unit">{copy.text006}</span>}
          </div>
          <p className="xhsDh-cap">{copy.text007}</p>

          {showTrack && (
            <div className="xhsDh-track">
              <div className="xhsDh-tnode is-prev">
                <span className="xhsDh-tyear">{copy.text008}</span>
                <span className="xhsDh-tval">{copy.text009}<i>{copy.text010}</i></span>
              </div>
              <div className="xhsDh-tline" aria-hidden="true">
                <span className="xhsDh-tmul">{copy.text011}</span>
              </div>
              <div className="xhsDh-tnode is-now">
                <span className="xhsDh-tyear">{copy.text012}</span>
                <span className="xhsDh-tval">{copy.text013}<i>{copy.text014}</i></span>
              </div>
            </div>
          )}
        </div>

        {mc > 0 && (
          <div className="xhsDh-side">
            {metrics.map((m, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              return (
                <div key={i} className={'xhsDh-mcard' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}>
                  <span className="xhsDh-mk">{m.k}</span>
                  <span className="xhsDh-md">
                    <i className="xhsDh-mar" aria-hidden="true">{m.dir === 'down' ? '▼' : '▲'}</i>
                    {m.d}<em>{m.u}</em>
                  </span>
                  <span className="xhsDh-mnote">{m.note}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="xhsDh-foot">
        <span className="xhsDh-foot-tag">{copy.text015}</span>
        <span className="xhsDh-foot-txt">{copy.text016}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <DhSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <DhSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 116 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSDH_CSS = `
  .xhsDh-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsDh-head{ flex:0 0 auto; margin-bottom:14px; }
  .xhsDh-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsDh-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsDh-body{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1.5fr 1fr; gap:64px; align-items:center; }

  .xhsDh-hero{ position:relative; display:flex; flex-direction:column; align-items:flex-start; }
  .xhsDh-arrow{ font-size:48px; line-height:1; color:var(--c); text-shadow:0 0 30px color-mix(in srgb, var(--c) 60%, transparent); margin-bottom:-6px; }
  .xhsDh-bignum{ display:flex; align-items:flex-start; line-height:.82; }
  .xhsDh-sign{ font-family:"Space Mono",monospace; font-weight:700; font-size:200px; color:var(--c); letter-spacing:-.04em;
    text-shadow:0 0 50px color-mix(in srgb, var(--c) 46%, transparent); }
  .xhsDh-digits{ font-family:"Space Mono",monospace; font-weight:700; font-size:300px; color:#fff; letter-spacing:-.05em;
    font-variant-numeric:tabular-nums;
    text-shadow:0 0 64px color-mix(in srgb, var(--c) 40%, transparent), 0 0 140px color-mix(in srgb, var(--c) 20%, transparent); }
  .xhsDh-unit{ font-family:"Space Mono",monospace; font-weight:700; font-size:128px; color:var(--c); padding-top:36px;
    text-shadow:0 0 36px color-mix(in srgb, var(--c) 46%, transparent); }
  .xhsDh-cap{ margin:14px 0 0; font-size:27px; font-weight:600; color:#b6b6b6; }

  .xhsDh-track{ margin-top:48px; display:flex; align-items:center; gap:26px; width:100%; }
  .xhsDh-tnode{ display:flex; flex-direction:column; gap:7px; flex:0 0 auto; }
  .xhsDh-tyear{ font-family:"Space Mono",monospace; font-size:19px; font-weight:700; letter-spacing:.08em; color:#8a8a8a; }
  .xhsDh-tval{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; color:#cfcfcf; line-height:1; }
  .xhsDh-tnode.is-now .xhsDh-tval{ color:var(--c); text-shadow:0 0 26px color-mix(in srgb, var(--c) 42%, transparent); }
  .xhsDh-tval i{ font-style:normal; font-size:22px; margin-left:4px; color:inherit; opacity:.8; }
  .xhsDh-tline{ position:relative; flex:1 1 auto; height:14px; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb,#555 70%, transparent), var(--c));
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 34%, transparent), inset 0 2px 0 rgba(255,255,255,.4); }
  .xhsDh-tmul{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
    font-family:"Space Mono",monospace; font-size:30px; font-weight:700; color:#06140f; background:var(--c);
    padding:4px 16px; border-radius:999px; box-shadow:0 8px 22px color-mix(in srgb, var(--c) 42%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }

  .xhsDh-side{ display:flex; flex-direction:column; gap:18px; }
  .xhsDh-mcard{ position:relative; padding:24px 30px; border-radius:20px;
    background:linear-gradient(150deg, color-mix(in srgb, var(--c) 14%, #141414), #0b0b0b 72%);
    border:1.5px solid color-mix(in srgb, var(--c) 36%, rgba(255,255,255,.06));
    display:flex; flex-direction:column; gap:6px; overflow:hidden;
    transition:opacity .3s ease, filter .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsDh-mcard::after{ content:""; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(135deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 42%); }
  .xhsDh-mcard.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsDh-mcard.is-hot{ border-color:var(--c); box-shadow:0 0 52px color-mix(in srgb, var(--c) 24%, transparent); transform:translateX(8px); }
  .xhsDh-mk{ font-size:21px; font-weight:700; color:#a6a6a6; }
  .xhsDh-md{ display:flex; align-items:baseline; gap:6px; font-family:"Space Mono",monospace; font-size:64px; font-weight:700; color:#fff; line-height:1; }
  .xhsDh-mar{ font-size:26px; color:var(--c); font-style:normal; text-shadow:0 0 16px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsDh-md em{ font-style:normal; font-size:28px; color:var(--c); margin-left:2px; }
  .xhsDh-mnote{ font-size:18px; font-weight:600; color:#7e7e7e; }

  .xhsDh-foot{ flex:0 0 auto; margin-top:16px; display:flex; align-items:center; gap:18px; }
  .xhsDh-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:var(--c); padding:5px 14px; border-radius:8px; box-shadow:0 0 22px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsDh-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'deltahero',
  label: '增长大数字',
  Component: Slide70DeltaHero,
  defaults: {
      copy: SLIDE70DELTAHERO_COPY,
      metricsData: XHSDH_METRICS,
    ...hlDefaults,
    accentTone: 'green',
    metricCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showTrack: true,
    showUnit: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }, { key: "text013", label: "text013" }, { key: "text014", label: "text014" }, { key: "text015", label: "text015" }, { key: "text016", label: "text016" }], default: SLIDE70DELTAHERO_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'metricsData', type: 'list', label: 'metricsData', itemLabel: '数据', fields: [{ key: "k", label: "k" }, { key: "d", label: "d" }, { key: "u", label: "u" }, { key: "dir", label: "dir" }, { key: "note", label: "note" }], default: XHSDH_METRICS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '页面主色调(通用命名)' },
    { key: 'metricCount', type: 'slider', label: '支撑变化卡', min: 0, max: 3, step: 1, default: 3, desc: '右栏支撑变化卡数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, showIf: (v) => v.metricCount > 0, desc: '是否高亮某一张支撑卡' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'metricCount', showIf: (v) => v.metricCount > 0 && v.focusEnabled, desc: '被高亮支撑卡序号' },
    { key: 'showTrack', type: 'toggle', label: '跃迁条', default: true, desc: '去年→今年体量跃迁条' },
    { key: 'showUnit', type: 'toggle', label: '单位后缀', default: true, desc: '主数字 % 单位后缀' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide70DeltaHero.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide70DeltaHero;
