/*
 * Slide51StatTrio — 三联大数字（大数字页 · 三栏巨数并置 KPI band）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsT3- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与单数字页 Slide15BigNumber（一巨数 + 支撑卡）/ 对决页 Slide35Versus（两数对峙）互补：
 * 三个并置的巨型数字，一眼读完「资本大年」三组头条数据。focus 时放大其一、淡化其余。
 * 数据为调研整理（报告 2.x 市场规模，单位亿美元 / 笔，示意比例）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  statCount       number 展示的巨数列数(1–3)   默认 3
 *  focusEnabled    bool   重点列高亮开关         默认 false
 *  focusIndex      number 重点列序号(从1起)     默认 1   范围 1–statCount
 *  showDelta       bool   数字下方趋势徽标显隐    默认 true
 *  showDivider     bool   列间分隔线显隐         默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide51StatTrio, { defaults, controls } from './Slide51StatTrio.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 三组头条数字（写死）：眉标 / 主数字 / 单位 / 释义 / 趋势 / 主色
const XHST3_STATS = [
  { eyebrow: '全年总额 · TOTAL', num: '970', unit: '亿', sub: '2024 全年 AI 初创吸纳风险投资', delta: '创历史新高', color: '#27E021' },
  { eyebrow: '大额事件 · MEGA-DEALS', num: '97', unit: '笔', sub: '单笔 ≥1 亿美元的融资事件', delta: '头部高度集中', color: '#15A7F0' },
  { eyebrow: '市场占比 · SHARE', num: '≈1/3', unit: '', sub: '占全美风险投资总额', delta: '近三分之一', color: '#FFC700' },
];

function T3Spark({ size = 22, color = '#fff', style }) {
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


const SLIDE51STATTRIO_COPY = {
  text001: "资本大年 · BY THE NUMBERS",
  text002: "三组数字，",
  text003: "读懂这一年",
  text004: "▲",
  text005: "资本大年",
  text006: "数据口径：2024 全年公开披露的 ≥1 亿美元 AI 融资事件 · 占美国 VC 近三分之一（报告 2.x · 调研整理）",
};
function Slide51StatTrio(props) {
  const {
      copy = SLIDE51STATTRIO_COPY,
      statsData = XHST3_STATS,
    statCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showDelta = true,
    showDivider = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(1, Math.min(3, statCount));
  const stats = statsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsT3-root" data-label="三联大数字" data-screen-label="三联大数字">
      <style>{XHST3_CSS}</style>

      <header className="xhsT3-head">
        <div className="xhsT3-kicker">{copy.text001}</div>
        <h2 className="xhsT3-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className={'xhsT3-band' + (showDivider ? ' has-div' : '')} style={{ '--n': n }}>
        {stats.map((s, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsT3-col' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': s.color }}>
              <span className="xhsT3-eyebrow">{s.eyebrow}</span>
              <div className="xhsT3-num">
                <span className="xhsT3-digits">{s.num}</span>
                {s.unit && <span className="xhsT3-unit">{s.unit}</span>}
              </div>
              <p className="xhsT3-sub">{s.sub}</p>
              {showDelta && (
                <span className="xhsT3-delta">
                  <span className="xhsT3-arrow" aria-hidden="true">{copy.text004}</span>{s.delta}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <footer className="xhsT3-foot">
        <span className="xhsT3-foot-tag">{copy.text005}</span>
        <span className="xhsT3-foot-txt">{copy.text006}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <T3Spark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <T3Spark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 110 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 200, top: 196, width: 40, height: 40, borderRadius: '50%', border: '5px solid rgba(255,255,255,.82)', boxShadow: '0 0 20px rgba(255,255,255,.2)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHST3_CSS = `
  .xhsT3-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsT3-head{ flex:0 0 auto; margin-bottom:18px; }
  .xhsT3-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsT3-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsT3-band{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--n),1fr); align-items:center; }
  .xhsT3-band.has-div .xhsT3-col:not(:last-child){ border-right:1.5px solid rgba(255,255,255,.1); }

  .xhsT3-col{ display:flex; flex-direction:column; align-items:flex-start; justify-content:center; padding:0 56px;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsT3-col:first-child{ padding-left:0; }
  .xhsT3-col:last-child{ padding-right:0; }
  .xhsT3-col.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsT3-col.is-hot{ transform:scale(1.04); }

  .xhsT3-eyebrow{ font-family:"Space Mono",monospace; font-size:21px; font-weight:700; letter-spacing:.08em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 32%, transparent); }
  .xhsT3-num{ display:flex; align-items:flex-end; gap:10px; margin:16px 0 4px; }
  .xhsT3-digits{ font-family:"Space Mono",monospace; font-weight:700; font-size:176px; line-height:.84; letter-spacing:-.03em; color:#fff;
    font-variant-numeric:tabular-nums;
    text-shadow:0 0 56px color-mix(in srgb, var(--c) 44%, transparent), 0 0 120px color-mix(in srgb, var(--c) 22%, transparent); }
  .xhsT3-col.is-hot .xhsT3-digits{ color:var(--c);
    text-shadow:0 0 64px color-mix(in srgb, var(--c) 60%, transparent), 0 0 140px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsT3-unit{ font-size:54px; font-weight:900; color:var(--c); padding-bottom:22px;
    text-shadow:0 0 26px color-mix(in srgb, var(--c) 46%, transparent); }
  .xhsT3-sub{ margin:14px 0 0; font-size:25px; font-weight:600; color:#b2b2b2; line-height:1.4; max-width:420px; text-wrap:pretty; }

  .xhsT3-delta{ display:inline-flex; align-items:center; gap:9px; margin-top:24px; font-size:20px; font-weight:800; color:#06140f;
    background:var(--c); padding:7px 18px 8px; border-radius:999px;
    box-shadow:0 8px 24px color-mix(in srgb, var(--c) 40%, transparent), inset 0 2px 0 rgba(255,255,255,.55), inset 0 0 16px rgba(255,255,255,.4); }
  .xhsT3-arrow{ font-size:13px; line-height:1; }

  .xhsT3-foot{ flex:0 0 auto; margin-top:24px; display:flex; align-items:center; gap:18px; }
  .xhsT3-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#27E021; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(39,224,33,.4); }
  .xhsT3-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'stattrio',
  label: '三联大数字',
  Component: Slide51StatTrio,
  defaults: {
      copy: SLIDE51STATTRIO_COPY,
      statsData: XHST3_STATS,
    ...hlDefaults,
    statCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showDelta: true,
    showDivider: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }], default: SLIDE51STATTRIO_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'statsData', type: 'list', label: 'statsData', itemLabel: '数据', fields: [{ key: "eyebrow", label: "eyebrow" }, { key: "num", label: "num" }, { key: "unit", label: "unit" }, { key: "sub", label: "sub" }, { key: "delta", label: "delta" }, { key: "color", label: "color" }], default: XHST3_STATS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'statCount', type: 'slider', label: '巨数列数', min: 1, max: 3, step: 1, default: 3, desc: '并置展示的巨型数字列数' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一列' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'statCount', showIf: (v) => v.focusEnabled, desc: '被高亮列的序号' },
    { key: 'showDelta', type: 'toggle', label: '趋势徽标', default: true, desc: '数字下方趋势徽标' },
    { key: 'showDivider', type: 'toggle', label: '列间分隔', default: true, desc: '列与列之间的分隔线' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide51StatTrio.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide51StatTrio;
