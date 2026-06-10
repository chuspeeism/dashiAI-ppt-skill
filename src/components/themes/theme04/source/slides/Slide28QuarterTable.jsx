/*
 * Slide28QuarterTable — 季度走势表（表格页 · 四季度多指标 + 行内迷你趋势条）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsQt- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  columnCount     number 展示的季度列数        默认 4   可选 2–4
 *  rowCount        number 展示的指标行数        默认 4   可选 2–4
 *  focusEnabled    bool   重点列高亮开关         默认 true
 *  focusIndex      number 重点列序号(从1起)     默认 4
 *  showTrendBar    bool   行尾迷你趋势条显隐      默认 true
 *  showPeakTag     bool   峰值单元格角标显隐      默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide28QuarterTable, { defaults, controls } from './Slide28QuarterTable.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSQT_COLS = ['Q1', 'Q2', 'Q3', 'Q4'];
// 2024 分季度指标（报告 2.x 推演整理）
const XHSQT_ROWS = [
  { metric: '融资总额', unit: '亿美元', color: '#15A7F0', vals: [185, 232, 248, 305] },
  { metric: '大额轮次', unit: '笔', color: '#27E021', vals: [18, 23, 27, 29] },
  { metric: '平均单笔', unit: '亿美元', color: '#FFC700', vals: [10.3, 10.1, 9.2, 10.5] },
  { metric: '十亿级轮次', unit: '笔', color: '#FF9FE2', vals: [2, 4, 5, 7] },
];

function QtSpark({ size = 20, color = '#fff', style }) {
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

// 行尾迷你趋势条（sparkline 折线）
function QtSparkline({ vals, color }) {
  const max = Math.max.apply(null, vals);
  const min = Math.min.apply(null, vals);
  const span = max - min || 1;
  const n = vals.length;
  const pts = vals.map((v, i) => {
    const x = n === 1 ? 50 : (i / (n - 1)) * 96 + 2;
    const y = 30 - ((v - min) / span) * 26 - 2;
    return `${x},${y}`;
  });
  const last = pts[pts.length - 1].split(',');
  return (
    <svg className="xhsQt-spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.4"
        vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.4" fill={color} />
    </svg>
  );
}


const SLIDE28QUARTERTABLE_COPY = {
  text001: "季度走势 · QUARTERLY TREND",
  text002: "四个季度",
  text003: "逐级走高",
  text004: "，Q4 冲上全年峰值",
  text005: "指标 / 季度",
  text006: "趋势",
  text007: "峰值",
  text008: "数据为调研整理与推演 · 单位见各行标注 · 峰值角标标示该指标全年最高季度",
};
function Slide28QuarterTable(props) {
  const {
      copy = SLIDE28QUARTERTABLE_COPY,
      colsData = XHSQT_COLS,
      rowsData = XHSQT_ROWS,
    columnCount = 4,
    rowCount = 4,
    focusEnabled = true,
    focusIndex = 4,
    showTrendBar = false,
    showPeakTag = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const cc = Math.max(2, Math.min(4, columnCount));
  const rc = Math.max(2, Math.min(4, rowCount));
  const cols = colsData.slice(0, cc);
  const rows = rowsData.slice(0, rc);
  const focus = Math.max(1, Math.min(cc, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsQt-root" data-label="季度走势表" data-screen-label="季度走势表">
      <style>{XHSQT_CSS}</style>

      <header className="xhsQt-head">
        <div className="xhsQt-kicker">{copy.text001}</div>
        <h2 className="xhsQt-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>{copy.text004}</h2>
      </header>

      <div className="xhsQt-tableWrap">
        <table className="xhsQt-table">
          <thead>
            <tr>
              <th className="xhsQt-th xhsQt-th--metric">{copy.text005}</th>
              {cols.map((c, i) => (
                <th key={i} className={'xhsQt-th' + (focusEnabled && i === focus ? ' is-hot' : '') + (focusEnabled && i !== focus ? ' is-dim' : '')}>
                  {c}
                </th>
              ))}
              {showTrendBar && <th className="xhsQt-th xhsQt-th--trend">{copy.text006}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const slice = r.vals.slice(0, cc);
              const peak = Math.max.apply(null, slice);
              return (
                <tr key={ri} className="xhsQt-tr" style={{ '--c': r.color }}>
                  <td className="xhsQt-metric">
                    <span className="xhsQt-mbar" />
                    <span className="xhsQt-mtxt"><b>{r.metric}</b><i>{r.unit}</i></span>
                  </td>
                  {slice.map((v, ci) => {
                    const isPeak = showPeakTag && v === peak;
                    const hot = focusEnabled && ci === focus;
                    const dim = focusEnabled && ci !== focus;
                    return (
                      <td key={ci} className={'xhsQt-cell' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '') + (isPeak ? ' is-peak' : '')}>
                        <span className="xhsQt-val">{v}</span>
                        {isPeak && <span className="xhsQt-peak">{copy.text007}</span>}
                      </td>
                    );
                  })}
                  {showTrendBar && (
                    <td className="xhsQt-trendcell"><QtSparkline vals={slice} color={r.color} /></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="xhsQt-caption">{copy.text008}</div>

      {showDecorations && (
        <React.Fragment>
          <QtSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <QtSpark size={16} color="#15A7F0" style={{ position: 'absolute', left: 84, bottom: 96 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSQT_CSS = `
  .xhsQt-root{ padding:74px 100px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsQt-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsQt-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsQt-title{ margin:0; font-size:52px; font-weight:900; color:#fff; line-height:1.14; }

  .xhsQt-tableWrap{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }
  .xhsQt-table{ width:100%; border-collapse:separate; border-spacing:0 14px; }

  .xhsQt-th{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:#cfcfcf; text-align:center;
    padding:0 10px 18px; transition:color .3s, opacity .3s; }
  .xhsQt-th--metric{ text-align:left; font-size:22px; letter-spacing:.06em; color:#8a8a8a; padding-left:30px; }
  .xhsQt-th--trend{ font-size:22px; letter-spacing:.06em; color:#8a8a8a; width:200px; }
  .xhsQt-th.is-hot{ color:#27E021; text-shadow:0 0 18px rgba(39,224,33,.45); }
  .xhsQt-th.is-dim{ opacity:.5; }

  .xhsQt-tr{ }
  .xhsQt-metric{ padding:0 24px 0 30px; border-radius:18px 0 0 18px; background:linear-gradient(120deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.07); border-right:none; }
  .xhsQt-metric .xhsQt-mbar{ display:inline-block; width:14px; height:14px; border-radius:50%; background:var(--c); vertical-align:middle;
    margin-right:16px; box-shadow:0 0 16px color-mix(in srgb, var(--c) 65%, transparent); }
  .xhsQt-mtxt{ display:inline-flex; flex-direction:column; gap:2px; vertical-align:middle; }
  .xhsQt-mtxt b{ font-size:30px; font-weight:900; color:#fff; }
  .xhsQt-mtxt i{ font-style:normal; font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.06em; color:#7c7c7c; }

  .xhsQt-cell{ position:relative; text-align:center; padding:22px 10px; background:linear-gradient(180deg,#141414,#0d0d0d);
    border-top:1.5px solid rgba(255,255,255,.07); border-bottom:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s, filter .3s, background .3s; }
  .xhsQt-val{ font-family:"Space Mono",monospace; font-size:42px; font-weight:700; color:#e8e8e8; }
  .xhsQt-cell.is-hot{ background:linear-gradient(180deg, color-mix(in srgb, var(--c) 18%, #141414), #0d0d0d); }
  .xhsQt-cell.is-hot .xhsQt-val{ color:#fff; }
  .xhsQt-cell.is-dim{ opacity:.5; }
  .xhsQt-cell.is-peak .xhsQt-val{ color:var(--c); text-shadow:0 0 20px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsQt-peak{ position:absolute; top:8px; right:10px; font-size:14px; font-weight:800; color:#06140f; padding:2px 10px;
    border-radius:999px; background:var(--c); box-shadow:0 4px 12px color-mix(in srgb, var(--c) 45%, transparent); }

  .xhsQt-trendcell{ padding:18px 24px; background:linear-gradient(180deg,#141414,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.07); border-left:none; border-radius:0 18px 18px 0; }
  .xhsQt-spark{ width:150px; height:46px; display:block; }

  .xhsQt-caption{ flex:0 0 auto; margin-top:18px; font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'quartertable',
  label: '季度走势表',
  Component: Slide28QuarterTable,
  defaults: {
      copy: SLIDE28QUARTERTABLE_COPY,
      colsData: XHSQT_COLS,
      rowsData: XHSQT_ROWS,
    ...hlDefaults,
    columnCount: 4,
    rowCount: 4,
    focusEnabled: true,
    focusIndex: 4,
    showTrendBar: false,
    showPeakTag: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }], default: SLIDE28QUARTERTABLE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'colsData', type: 'list', label: 'colsData', itemLabel: '数据', primitive: true, default: XHSQT_COLS, desc: '默认数据内容' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "metric", label: "metric" }, { key: "unit", label: "unit" }, { key: "color", label: "color" }], default: XHSQT_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'columnCount', type: 'slider', label: '季度列数', min: 2, max: 4, step: 1, default: 4, desc: '展示的季度列数' },
    { key: 'rowCount', type: 'slider', label: '指标行数', min: 2, max: 4, step: 1, default: 4, desc: '展示的指标行数' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一列' },
    { key: 'focusIndex', type: 'slider', label: '重点列序号', min: 1, max: 4, step: 1, default: 4, maxFromKey: 'columnCount', showIf: (v) => v.focusEnabled, desc: '被高亮列的序号' },
    { key: 'showTrendBar', type: 'toggle', label: '趋势条', default: false, desc: '行尾迷你趋势折线' },
    { key: 'showPeakTag', type: 'toggle', label: '峰值角标', default: true, desc: '各行峰值单元格角标' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide28QuarterTable.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide28QuarterTable;
