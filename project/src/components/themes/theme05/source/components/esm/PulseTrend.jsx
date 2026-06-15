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
   PulseTrend — P05 chart page ("纵向趋势 / Trend" archetype).
   A generic time-series chart slide: switchable chart type (bar / line / area),
   an optional secondary series, a focus marker, and a side metric list.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseTrend.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
  const PRIMARY = SPECTRUM[5]; // blue bars

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "MARKET PANORAMA",
    title: "市场全景 · 纵向趋势",
    sub: "逐季度融资额走势",
    sheet: "TREND · 05 / 32",
    primaryName: "融资额（亿美元）",
    secondaryName: "事件数（笔）",
    points: [
      { axis: "Q1", v: 162, s: 18 },
      { axis: "Q2", v: 284, s: 26 },
      { axis: "Q3", v: 318, s: 31 },
      { axis: "Q4", v: 206, s: 22 },
    ],
    conclusion: "高峰过后不是崩塌，而是市场开始筛选。",
  };

  function Chart({ pts, type, focusEnabled, focusIndex, showSecondary, accent }) {
    const max = Math.max.apply(null, pts.map((p) => p.v)) * 1.14;
    const sMax = Math.max.apply(null, pts.map((p) => p.s)) * 1.25;
    const n = pts.length;
    const xAt = (i) => (n === 1 ? 50 : (i / (n - 1)) * 96 + 2);
    const yAt = (v, m) => 100 - (v / m) * 100;
    const linePts = pts.map((p, i) => `${xAt(i)},${yAt(p.v, max)}`).join(" ");
    const areaPts = `2,100 ${linePts} ${xAt(n - 1)},100`;
    const secPts = pts.map((p, i) => `${xAt(i)},${yAt(p.s, sMax)}`).join(" ");

    return (
      <div className="pulse-chart">
        <div className="pulse-chart__plot">
          <div className="pulse-chart__grid">
            {[20, 40, 60, 80].map((t) => <i key={t} style={{ top: t + "%" }} />)}
          </div>

          {type === "bar" ? (
            <div className="pulse-chart__bars">
              {pts.map((p, i) => {
                const focus = focusEnabled && i + 1 === focusIndex;
                return (
                  <div className="pulse-chart__col" key={i}>
                    <div
                      className={"pulse-chart__bar" + (focus ? " pulse-chart__bar--focus" : "")}
                      style={{ height: (p.v / max) * 100 + "%", "--bar": focus ? accent : PRIMARY }}
                    >
                      <span className="pulse-chart__val">{p.v}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {type === "area" && <polygon points={areaPts} fill={PRIMARY} fillOpacity="0.18" />}
              <polyline points={linePts} fill="none" stroke={PRIMARY} strokeWidth="2.4"
                strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          )}

          {showSecondary && (
            <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points={secPts} fill="none" stroke={SPECTRUM[0]} strokeWidth="2"
                strokeDasharray="2 2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
          )}

          {type !== "bar" && (
            <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {pts.map((p, i) => {
                const focus = focusEnabled && i + 1 === focusIndex;
                return (
                  <g key={i}>
                    <path d={`M ${xAt(i)} ${yAt(p.v, max)} h 0.001`} className="pulse-dotcap"
                      vectorEffect="non-scaling-stroke" strokeWidth={focus ? 28 : 20}
                      stroke={focus ? accent : PRIMARY} />
                    <path d={`M ${xAt(i)} ${yAt(p.v, max)} h 0.001`} className="pulse-dotcap pulse-dotcap--core"
                      vectorEffect="non-scaling-stroke" strokeWidth={focus ? 20 : 12} />
                  </g>
                );
              })}
            </svg>
          )}
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

  function PulseTrend(props) {
    const p = Object.assign({}, PulseTrend.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(2, Math.min(COPY.points.length, p.pointCount));
    const pts = COPY.points.slice(0, n);

    return (
      <div className="pulse-slide pulse-trend" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-trend__body">
          <div className="pulse-trend__main">
            <div className="pulse-trend__legend">
              <span><i style={{ background: PRIMARY }} />{COPY.primaryName}</span>
              {p.showSecondary && (
                <span><i className="is-line" style={{ borderColor: SPECTRUM[0] }} />{COPY.secondaryName}</span>
              )}
            </div>
            <Chart pts={pts} type={p.chartType} focusEnabled={p.focusEnabled}
              focusIndex={p.focusIndex} showSecondary={p.showSecondary} accent={accent} />
          </div>

          <div className="pulse-trend__side">
            <div className="pulse-label" style={{ marginBottom: 22 }}>{COPY.sub}</div>
            {p.showMetrics && (
              <div className="pulse-trend__metrics">
                {pts.map((pt, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  return (
                    <div key={i}
                      className={"pulse-trend__metric" + (focus ? " pulse-trend__metric--focus" : "")}
                      style={focus ? { background: accent } : undefined}>
                      <div className="pulse-trend__m-k">{pt.axis}</div>
                      <div className="pulse-trend__m-v">{pt.v}<small>{pt.s} 笔</small></div>
                    </div>
                  );
                })}
              </div>
            )}
            {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
          </div>
        </div>
      </div>
    );
  }

  PulseTrend.controls = [
    { key: "chartType", type: "radio", label: "图表类型", default: "bar",
      options: [{ value: "bar", label: "柱状" }, { value: "line", label: "折线" }, { value: "area", label: "面积" }],
      description: "主图表呈现方式：柱状 / 折线 / 面积。" },
    { key: "pointCount", type: "slider", label: "数据点数量", default: 4, min: 2, max: 4, step: 1,
      description: "图表与指标列表展示的数据点（时间截面）数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点标注", default: true,
      description: "是否突出某一个数据点（峰值 / 关键截面）。" },
    { key: "focusIndex", type: "slider", label: "重点数据点", default: 3, min: 1, max: 4, step: 1,
      description: "被突出的数据点序号（从 1 起）。" },
    { key: "showSecondary", type: "toggle", label: "副数据系列", default: true,
      description: "叠加第二条数据系列（虚线）。" },
    { key: "showMetrics", type: "toggle", label: "指标列表", default: true,
      description: "右侧的逐项数据指标列表。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "重点标注与眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "右下角的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseTrend.defaults = PulseTrend.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseTrend.copyDefaults = COPY;
  PulseTrend.defaults = { ...(PulseTrend.defaults || {}), copy: COPY };
  window.PulseTrend = PulseTrend;
})();

const Component = window.PulseTrend;
if (!Component) throw new Error('Missing theme05 component PulseTrend');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;