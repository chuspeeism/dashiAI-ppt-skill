import React from 'react';
import './PulseImageFrame.jsx';
const window = globalThis.__theme05Window || (globalThis.__theme05Window = {});
globalThis.React = React;
function withTheme05Copy(Component) {
  const defaultCopy = Component.copyDefaults || Component.defaults?.copy || null;
  function Theme05CopyWrapped(props = {}) {
    const copy = mergeTheme05Copy(defaultCopy, props.copy);
    const element = Component({ ...props, copy });
    return replaceTheme05Text(element, theme05ReplacementMap(defaultCopy, copy));
  }
  Theme05CopyWrapped.controls = Component.controls || [];
  Theme05CopyWrapped.defaults = { ...(Component.defaults || {}), ...(defaultCopy ? { copy: defaultCopy } : {}) };
  return Theme05CopyWrapped;
}

function mergeTheme05Copy(base, override) {
  if (!base || typeof base !== 'object') return override || base;
  if (!override || typeof override !== 'object') return base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  const next = { ...base };
  for (const [key, value] of Object.entries(override)) {
    next[key] = base[key] && typeof base[key] === 'object' && value && typeof value === 'object'
      ? mergeTheme05Copy(base[key], value)
      : value;
  }
  return next;
}

function theme05ReplacementMap(base, copy, map = new Map()) {
  if (!base || !copy) return map;
  if (typeof base === 'string' || typeof base === 'number') {
    const from = String(base).replace(/\u00a0/g, ' ');
    const to = typeof copy === 'string' || typeof copy === 'number' ? String(copy) : copy;
    if (from && to !== undefined && to !== null && (!map.has(from) || String(to) !== from)) map.set(from, to);
    return map;
  }
  if (Array.isArray(base) && Array.isArray(copy)) {
    base.forEach((item, index) => theme05ReplacementMap(item, copy[index], map));
    return map;
  }
  if (typeof base === 'object' && typeof copy === 'object') {
    Object.keys(base).forEach(key => theme05ReplacementMap(base[key], copy[key], map));
  }
  return map;
}

function replaceTheme05Text(node, replacements) {
  if (!replacements?.size) return node;
  if (typeof node === 'string' || typeof node === 'number') {
    return replacements.get(String(node).replace(/\u00a0/g, ' ')) ?? node;
  }
  if (Array.isArray(node)) return node.map(child => replaceTheme05Text(child, replacements));
  if (!React.isValidElement(node)) return node;
  const nextProps = {};
  let changed = false;
  for (const key of ['children', 'label', 'placeholder', 'title', 'alt', 'aria-label']) {
    if (!(key in node.props)) continue;
    const next = replaceTheme05Text(node.props[key], replacements);
    if (next !== node.props[key]) {
      nextProps[key] = next;
      changed = true;
    }
  }
  return changed ? React.cloneElement(node, nextProps) : node;
}

/* =========================================================================
   PulseCurve — P20 trend-curve page ("走势曲线" archetype).
   A generic "focal subject + metric spec + trend curve" slide. Left: giant
   subject glyph + metric spec. Right (dark panel): a line / area curve with a
   focus node, an optional baseline reference (start-of-range level) and an
   optional change badge — built to show a pullback that stays above the start.
   The curve can plot the full range or just the current sub-period.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseCurve.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    eyebrow: "QUARTER BREAKDOWN",
    title: "理性回落季度",
    sub: "Q4 融资拆解",
    sheet: "Q4 · 20 / 32",
    glyph: "Q4",
    name: "Q4 融资拆解 · 回落但仍高位",
    metrics: [
      { k: "融资额", v: "206", u: "亿美元" },
      { k: "事件数", v: "22", u: "笔" },
      { k: "平均单笔", v: "9.4", u: "亿美元" },
      { k: "较 Q3 下降", v: "35.2", u: "%" },
    ],
    panelTitle: "走势回落",
    deltaBadge: "较 Q3 −35.2%",
    unit: "亿美元",
    // two ranges: full-year quarterly arc / Q4 monthly detail
    year: [
      { axis: "Q1", v: 162 },
      { axis: "Q2", v: 284 },
      { axis: "Q3", v: 318 },
      { axis: "Q4", v: 206 },
    ],
    month: [
      { axis: "10月", v: 73 },
      { axis: "11月", v: 81 },
      { axis: "12月", v: 52 },
    ],
    conclusion: "回落不是终点，而是分化的开始。",
  };

  function CurveChart({ pts, type, focusEnabled, focusIndex, showBaseline, accent }) {
    const max = Math.max.apply(null, pts.map((p) => p.v)) * 1.16;
    const n = pts.length;
    const xAt = (i) => (n === 1 ? 50 : (i / (n - 1)) * 96 + 2);
    const yAt = (v) => 100 - (v / max) * 100;
    const linePts = pts.map((p, i) => `${xAt(i)},${yAt(p.v)}`).join(" ");
    const areaPts = `2,100 ${linePts} ${xAt(n - 1)},100`;
    const baseV = pts[0].v;
    const baseTop = (1 - baseV / max) * 100;

    return (
      <div className="pulse-chart">
        <div className="pulse-chart__plot">
          <div className="pulse-chart__grid">
            {[25, 50, 75].map((t) => <i key={t} style={{ top: t + "%" }} />)}
          </div>

          {showBaseline && (
            <div className="pulse-curve__base" style={{ top: baseTop + "%" }}>
              <span>基准 · {pts[0].axis} {baseV}</span>
            </div>
          )}

          <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {type === "area" && <polygon points={areaPts} fill={accent} fillOpacity="0.2" />}
            <polyline points={linePts} fill="none" stroke={accent} strokeWidth="2.6"
              strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {pts.map((p, i) => {
              const focus = focusEnabled && i + 1 === focusIndex;
              return (
                <g key={i}>
                  <path d={`M ${xAt(i)} ${yAt(p.v)} h 0.001`} className="pulse-dotcap"
                    vectorEffect="non-scaling-stroke" strokeWidth={focus ? 28 : 20}
                    stroke={focus ? "#fff" : accent} />
                  <path d={`M ${xAt(i)} ${yAt(p.v)} h 0.001`} className="pulse-dotcap pulse-dotcap--core"
                    vectorEffect="non-scaling-stroke" strokeWidth={focus ? 20 : 12} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="pulse-chart__axis">
          {pts.map((p, i) => {
            const focus = focusEnabled && i + 1 === focusIndex;
            return <span key={i} className={focus ? "is-focus" : ""}>{p.axis}</span>;
          })}
        </div>
      </div>
    );
  }

  function PulseCurve(props) {
    const p = Object.assign({}, PulseCurve.defaults, props);
    const accent = p.accentColor;
    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const pts = p.scope === "month" ? COPY.month : COPY.year;
    const focusIndex = Math.max(1, Math.min(pts.length, p.focusIndex));

    return (
      <div className="pulse-slide pulse-stat" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-stat__body">
          <div className="pulse-stat__id">
            <div className="pulse-stat__glyph">{COPY.glyph}</div>
            <div className="pulse-stat__name">{COPY.name}</div>
            <div className="pulse-stat__metrics">
              {metrics.map((m, i) => (
                <div key={i} className="pulse-stat__m">
                  <div className="pulse-stat__m-k">{m.k}</div>
                  <div className="pulse-stat__m-v">{m.v}<small>{m.u}</small></div>
                </div>
              ))}
            </div>
            {p.showSwatches && (
              <div className="pulse-stat__band">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            )}
          </div>

          <div className="pulse-stat__viz">
            <div className="pulse-stat__panel">
              <div className="pulse-stat__panel-head">
                <div className="pulse-stat__panel-title">{COPY.panelTitle}</div>
                {p.showDeltaBadge
                  ? <div className="pulse-stat__pill" style={{ background: accent }}>{COPY.deltaBadge}</div>
                  : <div className="pulse-mono" style={{ color: "var(--pulse-on-dark-mute)" }}>{COPY.unit}</div>}
              </div>
              <div className="pulse-curve__chart">
                <CurveChart pts={pts} type={p.chartType} focusEnabled={p.focusEnabled}
                  focusIndex={focusIndex} showBaseline={p.showBaseline} accent={accent} />
              </div>
            </div>
            {p.showConclusion && <div className="pulse-conclusion pulse-stat__concl">{COPY.conclusion}</div>}
          </div>
        </div>
      </div>
    );
  }

  PulseCurve.controls = [
    { key: "chartType", type: "radio", label: "曲线类型", default: "area",
      options: [{ value: "area", label: "面积" }, { value: "line", label: "折线" }],
      description: "走势曲线的呈现方式：面积 / 折线。" },
    { key: "scope", type: "radio", label: "数据范围", default: "year",
      options: [{ value: "year", label: "全程" }, { value: "month", label: "本段" }],
      description: "曲线绘制全程（各分段）还是仅当前子周期。" },
    { key: "focusEnabled", type: "toggle", label: "重点标注", default: true,
      description: "是否突出某一个数据点（终点 / 关键截面）。" },
    { key: "focusIndex", type: "slider", label: "重点数据点", default: 4, min: 1, max: 4, step: 1,
      description: "被突出的数据点序号（从 1 起；超出范围自动收敛到末点）。" },
    { key: "showBaseline", type: "toggle", label: "基准参考线", default: true,
      description: "起点水平的虚线参考线，用于对比当前是否仍高于起点。" },
    { key: "showDeltaBadge", type: "toggle", label: "变化量标注", default: true,
      description: "面板右上角的变化量徽标（关闭时显示单位说明）。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "左侧主体卡的指标行数量。" },
    { key: "showSwatches", type: "toggle", label: "色谱色卡", default: true,
      description: "左下角的装饰性色谱色卡。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
      description: "主体字形 / 曲线 / 重点标注的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "面板下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseCurve.defaults = PulseCurve.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseCurve.copyDefaults = COPY;
  PulseCurve.defaults = { ...(PulseCurve.defaults || {}), copy: COPY };
  window.PulseCurve = PulseCurve;
})();

const Component = window.PulseCurve;
if (!Component) throw new Error('Missing theme05 component PulseCurve');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;