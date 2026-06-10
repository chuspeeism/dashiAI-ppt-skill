/*
 * Slide38Heatmap — 资金热力矩阵（图表页 · 月度 × 赛道 资金强度热力图）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsHm- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 新图表类型：N 个月（列）× M 条赛道（行）的强度矩阵，单元格颜色深浅 = 当月该赛道
 * 资金强度；chartVariant 在「热力格」与「气泡」两种编码间切换（数值以单元格标注为准）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  columnCount     number 展示的月份列数        默认 12  可选 6–12
 *  rowCount        number 展示的赛道行数        默认 4   可选 2–4
 *  chartVariant    enum   编码方式             默认 'heat' 可选 'heat'|'bubble'
 *  focusEnabled    bool   重点月份高亮开关       默认 true
 *  focusIndex      number 重点月份序号(从1起)   默认 5   范围 1–columnCount
 *  showRowTotal    bool   行尾赛道合计显隐       默认 true
 *  showScale       bool   底部强度图例显隐       默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide38Heatmap, { defaults, controls } from './Slide38Heatmap.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSHM_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
// 12 个月 × 4 条赛道的资金强度（0–100 相对热度，报告 2.x 月度推演整理）
const XHSHM_ROWS = [
  { track: '通用大模型', short: 'LLM', color: '#27E021', vals: [32, 44, 58, 70, 96, 54, 50, 92, 64, 82, 70, 76] },
  { track: 'AI 基础设施', short: 'INFRA', color: '#15A7F0', vals: [40, 34, 50, 46, 62, 56, 70, 76, 56, 60, 66, 82] },
  { track: 'AI 硬件', short: 'HW', color: '#FFC700', vals: [22, 30, 56, 40, 84, 36, 30, 46, 40, 30, 36, 42] },
  { track: '垂直应用', short: 'APP', color: '#FF9FE2', vals: [24, 30, 36, 30, 42, 46, 36, 56, 40, 52, 46, 60] },
];

function HmSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE38HEATMAP_COPY = {
  text001: "资金热力 · MONTHLY HEATMAP",
  text002: "热钱",
  text003: "扎堆 5 月、8 月",
  text004: "，通用大模型最烫手",
  text005: "赛道 / 月",
  text006: "合计",
  text007: "弱",
  text008: "强",
  text009: "数值为相对热度（0–100）· 颜色深浅 / 气泡大小同义",
  text010: "数据为调研整理与月度推演 · 列「合计」越高代表当月越热",
};
function Slide38Heatmap(props) {
  const {
      copy = SLIDE38HEATMAP_COPY,
      monthsData = XHSHM_MONTHS,
      rowsData = XHSHM_ROWS,
    columnCount = 12,
    rowCount = 4,
    chartVariant = 'heat',
    focusEnabled = true,
    focusIndex = 5,
    showRowTotal = true,
    showScale = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const cc = Math.max(6, Math.min(12, columnCount));
  const rc = Math.max(2, Math.min(4, rowCount));
  const bubble = chartVariant === 'bubble';
  const months = monthsData.slice(0, cc);
  const rows = rowsData.slice(0, rc);
  const focus = Math.max(1, Math.min(cc, focusIndex)) - 1;

  // 列合计（用于列峰值判断）
  const colSums = months.map((_, ci) => rows.reduce((s, r) => s + r.vals[ci], 0));
  const peakCol = colSums.indexOf(Math.max.apply(null, colSums));

  return (
    <section className="xhs-base xhsHm-root" data-label="资金热力矩阵" data-screen-label="资金热力矩阵">
      <style>{XHSHM_CSS}</style>

      <header className="xhsHm-head">
        <div className="xhsHm-kicker">{copy.text001}</div>
        <h2 className="xhsHm-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>{copy.text004}</h2>
      </header>

      <div className={'xhsHm-matrix' + (bubble ? ' is-bubble' : '')}
        style={{ '--cols': cc, gridTemplateColumns: `220px repeat(${cc}, 1fr)` + (showRowTotal ? ' 96px' : '') }}>
        {/* 列头：月份 */}
        <div className="xhsHm-corner">{copy.text005}</div>
        {months.map((m, ci) => {
          const hot = focusEnabled && ci === focus;
          const dim = focusEnabled && ci !== focus;
          return (
            <div key={'h' + ci} className={'xhsHm-colh' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}>
              {m}
              {ci === peakCol && <span className="xhsHm-peakdot" aria-hidden="true" />}
            </div>
          );
        })}
        {showRowTotal && <div className="xhsHm-corner xhsHm-corner--end">{copy.text006}</div>}

        {/* 数据行 */}
        {rows.map((r, ri) => {
          const slice = r.vals.slice(0, cc);
          const total = slice.reduce((s, v) => s + v, 0);
          const rowMax = Math.max.apply(null, slice);
          return (
            <React.Fragment key={'r' + ri}>
              <div className="xhsHm-rowh" style={{ '--c': r.color }}>
                <span className="xhsHm-rowbar" />
                <span className="xhsHm-rowtxt"><b>{r.track}</b><i>{r.short}</i></span>
              </div>
              {slice.map((v, ci) => {
                const pct = 10 + (v / 100) * 80; // 10%–90% 透明度映射
                const colDim = focusEnabled && ci !== focus;
                const colHot = focusEnabled && ci === focus;
                const isMax = v === rowMax;
                const cellStyle = bubble
                  ? {}
                  : { background: `color-mix(in srgb, ${r.color} ${pct}%, #0b0b0b)` };
                return (
                  <div key={ci}
                    className={'xhsHm-cell' + (colDim ? ' is-dim' : '') + (colHot ? ' is-hot' : '') + (isMax ? ' is-peak' : '')}
                    style={{ '--c': r.color, ...cellStyle }}>
                    {bubble ? (
                      <span className="xhsHm-bubble" style={{ width: (24 + (v / 100) * 64) + '%' }} />
                    ) : null}
                    <span className={'xhsHm-num' + (v >= 60 || bubble ? ' is-strong' : '')}>{v}</span>
                  </div>
                );
              })}
              {showRowTotal && (
                <div className="xhsHm-total" style={{ '--c': r.color }}>{total}</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <footer className="xhsHm-foot">
        {showScale && (
          <div className="xhsHm-scale">
            <span className="xhsHm-scale-label">{copy.text007}</span>
            <span className="xhsHm-scale-bar" aria-hidden="true" />
            <span className="xhsHm-scale-label">{copy.text008}</span>
            <span className="xhsHm-scale-note">{copy.text009}</span>
          </div>
        )}
        <div className="xhsHm-caption">{copy.text010}</div>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <HmSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <HmSpark size={16} color="#27E021" style={{ position: 'absolute', left: 80, bottom: 92 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSHM_CSS = `
  .xhsHm-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsHm-head{ flex:0 0 auto; margin-bottom:30px; }
  .xhsHm-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsHm-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsHm-matrix{ flex:1 1 auto; min-height:0; display:grid; gap:8px; align-content:center; }

  .xhsHm-corner{ font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; color:#7c7c7c;
    display:flex; align-items:flex-end; padding-bottom:8px; }
  .xhsHm-corner--end{ justify-content:center; }

  .xhsHm-colh{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; color:#cfcfcf; text-align:center;
    display:flex; align-items:flex-end; justify-content:center; gap:5px; padding-bottom:8px; position:relative;
    transition:color .3s, opacity .3s; }
  .xhsHm-colh.is-hot{ color:#27E021; text-shadow:0 0 16px rgba(39,224,33,.5); }
  .xhsHm-colh.is-dim{ opacity:.45; }
  .xhsHm-peakdot{ width:8px; height:8px; border-radius:50%; background:#FFC700; box-shadow:0 0 12px rgba(255,199,0,.8); margin-bottom:4px; }

  .xhsHm-rowh{ display:flex; align-items:center; gap:14px; padding-right:14px; min-width:0; }
  .xhsHm-rowbar{ flex-shrink:0; width:14px; height:14px; border-radius:50%; background:var(--c);
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsHm-rowtxt{ display:flex; flex-direction:column; gap:2px; min-width:0; }
  .xhsHm-rowtxt b{ font-size:26px; font-weight:900; color:#fff; white-space:nowrap; }
  .xhsHm-rowtxt i{ font-style:normal; font-family:"Space Mono",monospace; font-size:14px; letter-spacing:.08em; color:#7c7c7c; }

  .xhsHm-cell{ position:relative; border-radius:12px; min-height:0; min-width:0; display:flex; align-items:center; justify-content:center;
    border:1.5px solid rgba(255,255,255,.06); overflow:hidden;
    transition:opacity .3s, filter .3s, transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s, border-color .3s; }
  .xhsHm-num{ position:relative; font-family:"Space Mono",monospace; font-size:24px; font-weight:700; color:rgba(255,255,255,.42); z-index:1; }
  .xhsHm-num.is-strong{ color:#fff; text-shadow:0 1px 8px rgba(0,0,0,.6); }
  .xhsHm-cell.is-dim{ opacity:.4; filter:saturate(.7); }
  .xhsHm-cell.is-hot{ border-color:rgba(255,255,255,.4); box-shadow:0 0 26px rgba(255,255,255,.14); transform:scale(1.04); z-index:2; }
  .xhsHm-cell.is-peak{ border-color:color-mix(in srgb, var(--c) 70%, transparent);
    box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--c) 60%, transparent), 0 0 22px color-mix(in srgb, var(--c) 28%, transparent); }

  /* 气泡编码 */
  .xhsHm-matrix.is-bubble .xhsHm-cell{ background:linear-gradient(180deg,#121212,#0b0b0b) !important; }
  .xhsHm-bubble{ position:absolute; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle at 38% 34%,
    color-mix(in srgb, var(--c) 96%, #fff) 0%, var(--c) 66%, color-mix(in srgb, var(--c) 60%, #000) 100%);
    box-shadow:0 0 22px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.4); }
  .xhsHm-matrix.is-bubble .xhsHm-num{ font-size:20px; }

  .xhsHm-total{ display:flex; align-items:center; justify-content:center; font-family:"Space Mono",monospace;
    font-size:30px; font-weight:700; color:var(--c); text-shadow:0 0 20px color-mix(in srgb, var(--c) 36%, transparent); }

  .xhsHm-foot{ flex:0 0 auto; margin-top:22px; display:flex; align-items:center; justify-content:space-between; gap:30px; }
  .xhsHm-scale{ display:flex; align-items:center; gap:12px; }
  .xhsHm-scale-label{ font-family:"Space Mono",monospace; font-size:16px; color:#8a8a8a; }
  .xhsHm-scale-bar{ width:200px; height:14px; border-radius:999px;
    background:linear-gradient(90deg, #0b0b0b, #15A7F0 40%, #27E021 72%, #FFC700 100%);
    border:1px solid rgba(255,255,255,.12); box-shadow:inset 0 1px 0 rgba(255,255,255,.2); }
  .xhsHm-scale-note{ margin-left:14px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
  .xhsHm-caption{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; text-align:right; }
`;

const META = {
  id: 'heatmap',
  label: '资金热力矩阵',
  Component: Slide38Heatmap,
  defaults: {
      copy: SLIDE38HEATMAP_COPY,
      monthsData: XHSHM_MONTHS,
      rowsData: XHSHM_ROWS,
    ...hlDefaults,
    columnCount: 12,
    rowCount: 4,
    chartVariant: 'heat',
    focusEnabled: true,
    focusIndex: 5,
    showRowTotal: true,
    showScale: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }], default: SLIDE38HEATMAP_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'monthsData', type: 'list', label: 'monthsData', itemLabel: '数据', primitive: true, default: XHSHM_MONTHS, desc: '默认数据内容' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "track", label: "track" }, { key: "short", label: "short" }, { key: "color", label: "color" }], default: XHSHM_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'columnCount', type: 'slider', label: '月份列数', min: 6, max: 12, step: 1, default: 12, desc: '展示的月份列数' },
    { key: 'rowCount', type: 'slider', label: '赛道行数', min: 2, max: 4, step: 1, default: 4, desc: '展示的赛道行数' },
    { key: 'chartVariant', type: 'radio', label: '编码方式', options: ['heat', 'bubble'], optionLabels: ['热力格', '气泡'], default: 'heat', desc: '颜色深浅 / 气泡大小' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一月份' },
    { key: 'focusIndex', type: 'slider', label: '重点月份', min: 1, max: 12, step: 1, default: 5, maxFromKey: 'columnCount', showIf: (v) => v.focusEnabled, desc: '被高亮月份的序号' },
    { key: 'showRowTotal', type: 'toggle', label: '赛道合计', default: true, desc: '行尾赛道合计列' },
    { key: 'showScale', type: 'toggle', label: '强度图例', default: true, desc: '底部强度图例' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide38Heatmap.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide38Heatmap;
