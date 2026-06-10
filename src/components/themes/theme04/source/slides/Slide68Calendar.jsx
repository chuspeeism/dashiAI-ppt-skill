/*
 * Slide68Calendar — 2024 资本月历（表格 / 日历 · 月格事件新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCl- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Heatmap（赛道×月 强度矩阵）/ QuarterTable（季度指标）互补：本页是「资本月历」——
 * 12 个月格排成 4×3 日历，每格按当月大额融资笔数热力着色 + 标志事件芯片，峰值月加 accent 角标，
 * 一屏读出「全年资本节奏：哪几个月最热」。数值为调研整理（报告 2.x，笔数/事件为示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  monthCount      number 展示的月份数(6–12)     默认 12
 *  focusEnabled    bool   重点月份高亮开关         默认 true
 *  focusIndex      number 重点月份序号(1=1月)     默认 12   范围 1–monthCount
 *  showHeat        bool   按笔数热力着色显隐       默认 true
 *  showEventNote   bool   标志事件芯片显隐         默认 true
 *  showPeakTag     bool   峰值月角标显隐          默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide68Calendar, { defaults, controls } from './Slide68Calendar.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 月历（写死）：月 / 大额笔数 deals / 标志事件 ev（可空）/ 是否峰值 peak
const XHSCL_MONTHS = [
  { mo: '1月', en: 'JAN', deals: 5, ev: '', peak: false },
  { mo: '2月', en: 'FEB', deals: 6, ev: 'Figure 6.7亿', peak: false },
  { mo: '3月', en: 'MAR', deals: 8, ev: 'Anthropic 加注', peak: false },
  { mo: '4月', en: 'APR', deals: 6, ev: '', peak: false },
  { mo: '5月', en: 'MAY', deals: 11, ev: 'xAI 60亿 · CoreWeave', peak: true },
  { mo: '6月', en: 'JUN', deals: 7, ev: '', peak: false },
  { mo: '7月', en: 'JUL', deals: 6, ev: '', peak: false },
  { mo: '8月', en: 'AUG', deals: 9, ev: '应用层放量', peak: false },
  { mo: '9月', en: 'SEP', deals: 7, ev: '', peak: false },
  { mo: '10月', en: 'OCT', deals: 10, ev: 'OpenAI 66亿', peak: true },
  { mo: '11月', en: 'NOV', deals: 8, ev: 'Anthropic 40亿', peak: false },
  { mo: '12月', en: 'DEC', deals: 14, ev: 'Databricks 100亿', peak: true },
];

const XHSCL_HEAT = '#27E021';

function ClSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE68CALENDAR_COPY = {
  text001: "资本月历 · 2024 CALENDAR",
  text002: "一年十二格，",
  text003: "三个月最热",
  text004: "大额融资笔数",
  text005: "少",
  text006: "多",
  text007: "★ 峰值",
  text008: "笔",
  text009: "资本月历",
  text010: "格内为当月 ≥1 亿美元融资笔数 · 着色随笔数加深 · 峰值月加 ★（报告 2.x · 调研整理）",
};
function Slide68Calendar(props) {
  const {
      copy = SLIDE68CALENDAR_COPY,
      monthsData = XHSCL_MONTHS,
    monthCount = 12,
    focusEnabled = true,
    focusIndex = 12,
    showHeat = true,
    showEventNote = true,
    showPeakTag = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(6, Math.min(12, monthCount));
  const months = monthsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const maxD = Math.max(...months.map((m) => m.deals));
  const cols = n <= 6 ? 3 : n <= 8 ? 4 : 4;

  return (
    <section className="xhs-base xhsCl-root" data-label="资本月历" data-screen-label="资本月历"
      style={{ '--c': XHSCL_HEAT }}>
      <style>{XHSCL_CSS}</style>

      <header className="xhsCl-head">
        <div className="xhsCl-headL">
          <div className="xhsCl-kicker">{copy.text001}</div>
          <h2 className="xhsCl-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
          </h2>
        </div>
        {showHeat && (
          <div className="xhsCl-scale">
            <span className="xhsCl-scaleLab">{copy.text004}</span>
            <span className="xhsCl-ramp" aria-hidden="true" />
            <span className="xhsCl-scaleEnds"><i>{copy.text005}</i><i>{copy.text006}</i></span>
          </div>
        )}
      </header>

      <div className="xhsCl-grid" style={{ '--cols': cols }}>
        {months.map((m, i) => {
          const t = m.deals / maxD; // 0..1 热度
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          const heatPct = showHeat ? Math.round(10 + t * 26) : 8;
          return (
            <div key={i} className={'xhsCl-cell' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '') + (m.peak ? ' is-peak' : '')}
              style={{ '--heat': heatPct + '%' }}>
              <div className="xhsCl-cellTop">
                <span className="xhsCl-mo">{m.mo}</span>
                <span className="xhsCl-en">{m.en}</span>
                {showPeakTag && m.peak && <span className="xhsCl-peak" aria-hidden="true">{copy.text007}</span>}
              </div>
              <div className="xhsCl-deals">
                <span className="xhsCl-dnum">{m.deals}</span>
                <span className="xhsCl-dunit">{copy.text008}</span>
              </div>
              {showEventNote && (
                <span className={'xhsCl-ev' + (m.ev ? '' : ' is-empty')}>{m.ev || '—'}</span>
              )}
            </div>
          );
        })}
      </div>

      <footer className="xhsCl-foot">
        <span className="xhsCl-foot-tag">{copy.text009}</span>
        <span className="xhsCl-foot-txt">{copy.text010}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <ClSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <ClSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCL_CSS = `
  .xhsCl-root{ padding:70px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsCl-head{ flex:0 0 auto; margin-bottom:26px; display:flex; align-items:flex-end; justify-content:space-between; gap:30px; }
  .xhsCl-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsCl-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsCl-scale{ flex:0 0 auto; display:flex; flex-direction:column; align-items:flex-end; gap:8px; padding-bottom:6px; }
  .xhsCl-scaleLab{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.06em; color:#8a8a8a; }
  .xhsCl-ramp{ width:230px; height:14px; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 12%, #161616), var(--c));
    box-shadow:inset 0 1px 0 rgba(255,255,255,.18); }
  .xhsCl-scaleEnds{ width:230px; display:flex; justify-content:space-between; font-family:"Space Mono",monospace; font-size:14px; color:#777; }
  .xhsCl-scaleEnds i{ font-style:normal; }

  .xhsCl-grid{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--cols),1fr); gap:18px; }
  .xhsCl-cell{ position:relative; min-height:0; border-radius:18px; padding:22px 24px; display:flex; flex-direction:column;
    background:linear-gradient(150deg, color-mix(in srgb, var(--c) var(--heat), #131313), #0b0b0b 84%);
    border:1.5px solid color-mix(in srgb, var(--c) 26%, rgba(255,255,255,.06)); overflow:hidden;
    transition:opacity .3s ease, filter .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsCl-cell.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCl-cell.is-peak{ border-color:color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsCl-cell.is-hot{ border-color:var(--c); box-shadow:0 0 48px color-mix(in srgb, var(--c) 26%, transparent); transform:translateY(-5px); }

  .xhsCl-cellTop{ display:flex; align-items:baseline; gap:12px; }
  .xhsCl-mo{ font-size:30px; font-weight:900; color:#fff; line-height:1; }
  .xhsCl-en{ font-family:"Space Mono",monospace; font-size:15px; font-weight:700; letter-spacing:.1em; color:#8f8f8f; }
  .xhsCl-peak{ margin-left:auto; font-family:"Space Mono",monospace; font-size:15px; font-weight:700; color:#06140f;
    background:var(--c); padding:3px 11px; border-radius:999px; box-shadow:0 0 16px color-mix(in srgb, var(--c) 44%, transparent); white-space:nowrap; }
  .xhsCl-deals{ margin-top:auto; display:flex; align-items:baseline; gap:8px; }
  .xhsCl-dnum{ font-family:"Space Mono",monospace; font-size:64px; font-weight:700; line-height:.85; color:#fff;
    text-shadow:0 0 30px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsCl-cell.is-peak .xhsCl-dnum{ color:var(--c); }
  .xhsCl-dunit{ font-size:22px; font-weight:700; color:#a8a8a8; }
  .xhsCl-ev{ margin-top:12px; font-size:18px; font-weight:700; color:#dcdcdc; line-height:1.25;
    padding:6px 12px; border-radius:9px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .xhsCl-ev.is-empty{ color:#5a5a5a; background:transparent; border-color:transparent; padding-left:0; }

  .xhsCl-foot{ flex:0 0 auto; margin-top:24px; display:flex; align-items:center; gap:18px; }
  .xhsCl-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#27E021; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(39,224,33,.4); }
  .xhsCl-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'calendar',
  label: '资本月历',
  Component: Slide68Calendar,
  defaults: {
      copy: SLIDE68CALENDAR_COPY,
      monthsData: XHSCL_MONTHS,
    ...hlDefaults,
    monthCount: 12,
    focusEnabled: true,
    focusIndex: 12,
    showHeat: true,
    showEventNote: true,
    showPeakTag: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }], default: SLIDE68CALENDAR_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'monthsData', type: 'list', label: 'monthsData', itemLabel: '数据', fields: [{ key: "mo", label: "mo" }, { key: "en", label: "en" }, { key: "deals", label: "deals" }, { key: "ev", label: "ev" }, { key: "peak", label: "peak" }], default: XHSCL_MONTHS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'monthCount', type: 'slider', label: '月份数', min: 6, max: 12, step: 1, default: 12, desc: '展示的月份数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一月份' },
    { key: 'focusIndex', type: 'slider', label: '重点月份', min: 1, max: 12, step: 1, default: 12, maxFromKey: 'monthCount', showIf: (v) => v.focusEnabled, desc: '被高亮月份(1=1月)' },
    { key: 'showHeat', type: 'toggle', label: '热力着色', default: true, desc: '按笔数热力着色' },
    { key: 'showEventNote', type: 'toggle', label: '标志事件', default: true, desc: '标志事件芯片' },
    { key: 'showPeakTag', type: 'toggle', label: '峰值角标', default: true, desc: '峰值月 ★ 角标' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide68Calendar.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide68Calendar;
