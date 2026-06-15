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
   PulsePeakTrough — P21 chart page ("峰值与低位 / Peak & Trough" archetype).
   A generic value-ranked comparison chart: bars are split into a HIGH band
   and a LOW band (two colors), with an optional mean reference line, a focus
   bar, and a ranked side list tagged 高位 / 低位.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulsePeakTrough.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  // Ordered high → low so the high/low split reads cleanly.
  const COPY = {
    eyebrow: "PEAK AND TROUGH",
    title: "峰值与低位",
    sub: "月度峰谷对比",
    sheet: "PEAK · 21 / 32",
    unit: "亿美元 / 月",
    highLabel: "高位",
    lowLabel: "低位",
    points: [
      { axis: "8 月", v: 118 },
      { axis: "9 月", v: 108 },
      { axis: "5 月", v: 105 },
      { axis: "12 月", v: 52 },
      { axis: "1 月", v: 45 },
    ],
    conclusion: "月度波动背后是头部交易节奏。",
  };

  function PulsePeakTrough(props) {
    const p = Object.assign({}, PulsePeakTrough.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(3, Math.min(COPY.points.length, p.pointCount));
    const pts = COPY.points.slice(0, n);
    const highN = Math.max(1, Math.min(n - 1, p.highBandCount));

    const max = Math.max.apply(null, pts.map((pt) => pt.v)) * 1.16;
    const mean = pts.reduce((a, pt) => a + pt.v, 0) / pts.length;
    const colorOf = (i) => (i < highN ? p.highColor : p.lowColor);

    return (
      <div className="pulse-slide pulse-pt" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-pt__body">
          <div className="pulse-pt__main">
            <div className="pulse-pt__legend">
              <span><i style={{ background: p.highColor }} />{COPY.highLabel}</span>
              <span><i style={{ background: p.lowColor }} />{COPY.lowLabel}</span>
              {p.showBaseline && <span><i className="is-line" />月度均值</span>}
            </div>

            <div className="pulse-chart">
              <div className="pulse-chart__plot">
                <div className="pulse-chart__grid">
                  {[20, 40, 60, 80].map((t) => <i key={t} style={{ top: t + "%" }} />)}
                </div>

                {p.showBaseline && (
                  <div className="pulse-pt__base" style={{ bottom: (mean / max) * 100 + "%" }}>
                    <span>均值 {mean.toFixed(0)}</span>
                  </div>
                )}

                <div className="pulse-chart__bars">
                  {pts.map((pt, i) => {
                    const focus = p.focusEnabled && i + 1 === p.focusIndex;
                    return (
                      <div className="pulse-chart__col" key={i}>
                        <div
                          className={"pulse-chart__bar" + (focus ? " pulse-chart__bar--focus" : "")}
                          style={{ height: (pt.v / max) * 100 + "%", "--bar": colorOf(i) }}
                        >
                          {p.showValue && <span className="pulse-chart__val">{pt.v}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pulse-chart__axis">
                {pts.map((pt, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  return <span key={i} className={focus ? "is-focus" : ""}>{pt.axis}</span>;
                })}
              </div>
            </div>
          </div>

          <div className="pulse-pt__side">
            <div className="pulse-label" style={{ marginBottom: 22, display: "flex", justifyContent: "space-between" }}>
              <span>{COPY.sub}</span><span className="pulse-mono">{COPY.unit}</span>
            </div>
            {p.showMetrics && (
              <div className="pulse-pt__metrics">
                {pts.map((pt, i) => {
                  const isHigh = i < highN;
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  return (
                    <div key={i} className={"pulse-pt__metric" + (focus ? " pulse-pt__metric--focus" : "")}>
                      <span className="pulse-pt__m-dot" style={{ background: colorOf(i) }} />
                      <span className="pulse-pt__m-k">{pt.axis}</span>
                      <span className="pulse-pt__m-tag" style={{ background: isHigh ? p.highColor : p.lowColor }}>
                        {isHigh ? COPY.highLabel : COPY.lowLabel}
                      </span>
                      <span className="pulse-pt__m-v">{pt.v}</span>
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

  PulsePeakTrough.controls = [
    { key: "pointCount", type: "slider", label: "数据点数量", default: 5, min: 3, max: 5, step: 1,
      description: "参与峰谷对比的柱子（数据点）数量。" },
    { key: "highBandCount", type: "slider", label: "高位数量", default: 3, min: 1, max: 4, step: 1,
      description: "归入“高位”色组的前 N 个数据点，其余归入“低位”（自动不超过总数-1）。" },
    { key: "focusEnabled", type: "toggle", label: "重点标注", default: true,
      description: "是否突出某一个数据点（极值 / 关键截面）。" },
    { key: "focusIndex", type: "slider", label: "重点数据点", default: 1, min: 1, max: 5, step: 1,
      description: "被突出的数据点序号（从 1 起，按数值由高到低排列）。" },
    { key: "showBaseline", type: "toggle", label: "均值参考线", default: true,
      description: "叠加一条数据均值的水平虚线参考线。" },
    { key: "showValue", type: "toggle", label: "数值显示", default: true,
      description: "柱顶显示数值。" },
    { key: "showMetrics", type: "toggle", label: "指标列表", default: true,
      description: "右侧带高位 / 低位标签的逐项列表。" },
    { key: "highColor", type: "color", label: "高位色", default: SPECTRUM[0], options: SPECTRUM,
      description: "高位色组的柱体颜色。" },
    { key: "lowColor", type: "color", label: "低位色", default: SPECTRUM[4], options: SPECTRUM,
      description: "低位色组的柱体颜色。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标与重点标注的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "右下角的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulsePeakTrough.defaults = PulsePeakTrough.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulsePeakTrough.copyDefaults = COPY;
  PulsePeakTrough.defaults = { ...(PulsePeakTrough.defaults || {}), copy: COPY };
  window.PulsePeakTrough = PulsePeakTrough;
})();

const Component = window.PulsePeakTrough;
if (!Component) throw new Error('Missing theme05 component PulsePeakTrough');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;