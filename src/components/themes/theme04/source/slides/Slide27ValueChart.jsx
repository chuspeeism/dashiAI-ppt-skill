/*
 * Slide27ValueChart — 估值三级跳（图表页 · Anthropic 估值跃迁 面积 / 柱状）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsVc- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  pointCount        number 展示的数据点数量      默认 3   可选 2–3
 *  chartVariant      enum   图表类型            默认 'area' 可选 'area'|'bar'
 *  focusEnabled      bool   重点点 / 柱高亮开关    默认 true
 *  focusIndex        number 重点序号(从1起)       默认 3
 *  showGrowthMarkers bool   点 / 柱间增幅标注显隐   默认 true
 *  showValueLabels   bool   数值标签显隐          默认 true
 *  showDecorations   bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。纵轴为 sqrt 示意比例，数值以标签为准。
 * 迁移：import Slide27ValueChart, { defaults, controls } from './Slide27ValueChart.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// Anthropic 2024 三轮融资估值（报告 5.1，单位：亿美元）
const XHSVC_POINTS = [
  { month: '5 月', round: 'Series G', val: 600, color: '#15A7F0' },
  { month: '8 月', round: 'Series H 首轮', val: 830, color: '#27E021' },
  { month: '11 月', round: 'Series H 扩轮', val: 9650, color: '#FFC700' },
];

function VcSpark({ size = 20, color = '#fff', style }) {
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

function fmtGrowth(a, b) {
  const r = b / a;
  return r < 2 ? '+' + Math.round((r - 1) * 100) + '%' : '×' + r.toFixed(1);
}


const SLIDE27VALUECHART_COPY = {
  text001: "典型案例 · ANTHROPIC 估值跃迁",
  text002: "Anthropic 估值，半年内",
  text003: "三级跳",
  text004: "5 月 → 8 月 → 11 月 连续三轮，估值从 600 亿冲上 9650 亿美元，登顶全球最高估值 AI 初创。",
  text005: "亿",
  text006: "亿",
  text007: "估值单位：亿美元 · 纵轴为示意比例，数值以标签为准 · 数据为调研整理推演",
};
function Slide27ValueChart(props) {
  const {
      copy = SLIDE27VALUECHART_COPY,
      pointsData = XHSVC_POINTS,
    pointCount = 3,
    chartVariant = 'area',
    focusEnabled = true,
    focusIndex = 3,
    showGrowthMarkers = true,
    showValueLabels = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(2, Math.min(3, pointCount));
  const pts = pointsData.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const isBar = chartVariant === 'bar';

  // sqrt 示意比例：让较小数值仍可辨识，同时保留「三级跳」的陡升
  const maxV = Math.max.apply(null, pts.map((p) => p.val));
  const denom = Math.sqrt(maxV) * 1.06;
  const hpct = (v) => (Math.sqrt(v) / denom) * 100; // 0–100 高度百分比
  const xAt = (i) => ((i + 0.5) / count) * 100;

  // 面积 / 折线几何（SVG viewBox 0..100, preserveAspectRatio none）
  const linePts = pts.map((p, i) => `${xAt(i)},${100 - hpct(p.val)}`).join(' ');
  const areaD = `M${xAt(0)},100 L ${linePts.split(' ').join(' L ')} L${xAt(count - 1)},100 Z`;
  const hotColor = (pts[focus] && pts[focus].color) || '#FFC700';

  return (
    <section className="xhs-base xhsVc-root" data-label="估值三级跳" data-screen-label="估值三级跳"
      style={{ '--c': hotColor }}>
      <style>{XHSVC_CSS}</style>

      <header className="xhsVc-head">
        <div className="xhsVc-kicker">{copy.text001}</div>
        <h2 className="xhsVc-title">{copy.text002}<HL color={hotColor} variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>
        </h2>
        <p className="xhsVc-sub">{copy.text004}</p>
      </header>

      <div className="xhsVc-plot">
        {isBar ? (
          <div className="xhsVc-bars">
            {pts.map((p, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              return (
                <div key={i} className={'xhsVc-barcol' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                  style={{ '--c': p.color }}>
                  <div className="xhsVc-barwrap">
                    {showValueLabels && <span className="xhsVc-barval">{p.val.toLocaleString()}<i>{copy.text005}</i></span>}
                    <div className="xhsVc-bar" style={{ height: hpct(p.val) + '%' }} />
                  </div>
                  <div className="xhsVc-xlab"><span className="xhsVc-xmonth">{p.month}</span><span className="xhsVc-xround">{p.round}</span></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="xhsVc-area">
            <svg className="xhsVc-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="xhsVcFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hotColor} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={hotColor} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#xhsVcFill)" />
              <polyline points={linePts} fill="none" stroke={hotColor} strokeWidth="3"
                vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="xhsVc-overlay">
              {pts.map((p, i) => {
                const hot = focusEnabled && i === focus;
                const dim = focusEnabled && i !== focus;
                return (
                  <div key={i} className={'xhsVc-node' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                    style={{ left: xAt(i) + '%', bottom: hpct(p.val) + '%', '--c': p.color }}>
                    {showValueLabels && <span className="xhsVc-nodeval">{p.val.toLocaleString()}<i>{copy.text006}</i></span>}
                    <span className="xhsVc-dot" />
                  </div>
                );
              })}
              {pts.map((p, i) => (
                <div key={'x' + i} className="xhsVc-xlab xhsVc-xlab--abs" style={{ left: xAt(i) + '%' }}>
                  <span className="xhsVc-xmonth">{p.month}</span>
                  <span className="xhsVc-xround">{p.round}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showGrowthMarkers && pts.slice(1).map((p, i) => {
          const midX = (xAt(i) + xAt(i + 1)) / 2;
          const midY = (hpct(pts[i].val) + hpct(p.val)) / 2;
          return (
            <span key={i} className="xhsVc-growth" style={{ left: midX + '%', bottom: 'calc(' + midY + '% + 30px)' }}>
              {fmtGrowth(pts[i].val, p.val)}
            </span>
          );
        })}
      </div>

      <div className="xhsVc-caption">{copy.text007}</div>

      {showDecorations && (
        <React.Fragment>
          <VcSpark size={24} color="#27E021" style={{ position: 'absolute', left: 88, top: 210 }} />
          <VcSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 100, bottom: 120 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSVC_CSS = `
  .xhsVc-root{ padding:78px 120px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsVc-head{ flex:0 0 auto; margin-bottom:18px; }
  .xhsVc-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsVc-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsVc-sub{ margin:18px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1340px; }

  .xhsVc-plot{ flex:1 1 auto; min-height:0; position:relative; margin:18px 20px 0; }

  /* ── 面积 / 折线 ── */
  .xhsVc-area{ position:absolute; inset:0 0 96px; }
  .xhsVc-svg{ position:absolute; inset:0; width:100%; height:100%; }
  .xhsVc-overlay{ position:absolute; inset:0; }
  .xhsVc-node{ position:absolute; width:0; height:0; }
  .xhsVc-dot{ position:absolute; left:0; top:0; transform:translate(-50%,-50%); width:22px; height:22px; border-radius:50%; background:#000; border:5px solid var(--c);
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsVc-node.is-hot .xhsVc-dot{ width:32px; height:32px; border-width:7px;
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 85%, transparent); }
  .xhsVc-nodeval{ position:absolute; left:0; bottom:20px; transform:translateX(-50%); white-space:nowrap;
    font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:#eaeaea; }
  .xhsVc-nodeval i{ font-style:normal; font-size:20px; font-weight:700; margin-left:2px; color:#9a9a9a; }
  .xhsVc-node.is-hot .xhsVc-nodeval{ bottom:30px; font-size:48px; color:var(--c); text-shadow:0 0 22px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsVc-node.is-hot .xhsVc-nodeval i{ color:var(--c); }
  .xhsVc-node.is-dim .xhsVc-nodeval{ opacity:.6; }

  .xhsVc-xlab{ display:flex; flex-direction:column; gap:3px; align-items:center; white-space:nowrap; }
  .xhsVc-xlab--abs{ position:absolute; bottom:-92px; transform:translateX(-50%); }
  .xhsVc-xmonth{ font-size:32px; font-weight:900; color:#fff; }
  .xhsVc-xround{ font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.06em; color:#7c7c7c; white-space:nowrap; }

  /* ── 柱状 ── */
  .xhsVc-bars{ position:absolute; inset:0 0 96px; display:flex; align-items:flex-end; justify-content:space-around; gap:60px; }
  .xhsVc-barcol{ flex:1; max-width:260px; height:100%; display:flex; flex-direction:column; justify-content:flex-end;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsVc-barcol.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsVc-barwrap{ flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; min-height:0; }
  .xhsVc-barval{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:#eaeaea; margin-bottom:14px; }
  .xhsVc-barval i{ font-style:normal; font-size:20px; margin-left:2px; color:#9a9a9a; }
  .xhsVc-barcol.is-hot .xhsVc-barval{ font-size:48px; color:var(--c); text-shadow:0 0 22px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsVc-barcol.is-hot .xhsVc-barval i{ color:var(--c); }
  .xhsVc-bar{ width:100%; border-radius:18px 18px 6px 6px;
    background:linear-gradient(180deg, var(--c), color-mix(in srgb, var(--c) 55%, #000));
    box-shadow:0 0 34px color-mix(in srgb, var(--c) 38%, transparent), inset 0 3px 0 rgba(255,255,255,.4); }
  .xhsVc-barcol.is-hot .xhsVc-bar{ box-shadow:0 0 60px color-mix(in srgb, var(--c) 55%, transparent), inset 0 3px 0 rgba(255,255,255,.5); }
  .xhsVc-barcol .xhsVc-xlab{ margin-top:22px; }

  /* ── 增幅标注 ── */
  .xhsVc-growth{ position:absolute; transform:translate(-50%, 50%); font-family:"Space Mono",monospace;
    font-size:30px; font-weight:700; color:#fff; padding:8px 22px; border-radius:999px;
    background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.28); white-space:nowrap;
    box-shadow:0 8px 24px rgba(0,0,0,.5); }

  .xhsVc-caption{ flex:0 0 auto; margin-top:16px; font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'valuechart',
  label: '估值三级跳',
  Component: Slide27ValueChart,
  defaults: {
      copy: SLIDE27VALUECHART_COPY,
      pointsData: XHSVC_POINTS,
    ...hlDefaults,
    pointCount: 3,
    chartVariant: 'area',
    focusEnabled: true,
    focusIndex: 3,
    showGrowthMarkers: true,
    showValueLabels: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE27VALUECHART_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'pointsData', type: 'list', label: 'pointsData', itemLabel: '数据', fields: [{ key: "month", label: "month" }, { key: "round", label: "round" }, { key: "val", label: "val" }, { key: "color", label: "color" }], default: XHSVC_POINTS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'pointCount', type: 'slider', label: '数据点数量', min: 2, max: 3, step: 1, default: 3, desc: '展示的估值数据点数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['area', 'bar'], optionLabels: ['面积', '柱状'], default: 'area', desc: '面积折线 / 柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一数据点' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 3, maxFromKey: 'pointCount', showIf: (v) => v.focusEnabled, desc: '被高亮数据点的序号' },
    { key: 'showGrowthMarkers', type: 'toggle', label: '增幅标注', default: true, desc: '点 / 柱间增幅标注' },
    { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true, desc: '各点 / 柱数值标签' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide27ValueChart.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide27ValueChart;
