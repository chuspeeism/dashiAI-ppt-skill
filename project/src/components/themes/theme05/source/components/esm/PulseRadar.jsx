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
   PulseRadar — P27 chart page ("能力雷达 / Capability Radar" archetype).
   A generic N-axis radar: concentric ring grid, spokes, a filled/outline data
   polygon, vertex dots, smart-anchored axis labels (CJK-safe), a focus axis,
   and a side metric list. Radius encodes magnitude (|value|); labels carry the
   signed value. Geometry is computed in the component.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseRadar.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  // v = YoY change (%, signed); radius uses magnitude, label shows the sign.
  const COPY = {
    eyebrow: "MODEL LAB RACE",
    title: "算力、数据、人才与渠道",
    sub: "模型实验室竞争",
    sheet: "RADAR · 27 / 32",
    unit: "同比变化 %",
    axes: [
      { k: "算力预算",     v: 64 },
      { k: "研究团队",     v: 38 },
      { k: "企业 API 客户", v: 52 },
      { k: "推理成本",     v: -21 },
    ],
    conclusion: "模型能力只是入口，交付能力才是商业化。",
  };

  const R = 42, CX = 50, CY = 50;
  const fmt = (v) => (v > 0 ? "+" : "") + v + "%";

  function PulseRadar(props) {
    const p = Object.assign({}, PulseRadar.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(3, Math.min(COPY.axes.length, p.axisCount));
    const axes = COPY.axes.slice(0, n);
    const maxAbs = Math.max.apply(null, axes.map((a) => Math.abs(a.v))) || 1;

    const angle = (i) => (-90 + i * (360 / n)) * (Math.PI / 180);
    const ptAt = (i, frac) => [CX + R * frac * Math.cos(angle(i)), CY + R * frac * Math.sin(angle(i))];
    const rings = [0.25, 0.5, 0.75, 1];
    const ringPoly = (frac) => axes.map((_, i) => ptAt(i, frac).join(",")).join(" ");
    const dataPoly = axes.map((a, i) => ptAt(i, Math.abs(a.v) / maxAbs).join(",")).join(" ");

    return (
      <div className="pulse-slide pulse-radar" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-radar__body">
          <div className="pulse-radar__main">
            <div className="pulse-radar__chart">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {p.showGrid && rings.map((f, ri) => (
                  <polygon key={ri} className={"pulse-radar__ring" + (f === 1 ? " pulse-radar__ring--out" : "")}
                    points={ringPoly(f)} />
                ))}
                {p.showGrid && axes.map((_, i) => {
                  const [x, y] = ptAt(i, 1);
                  return <line key={i} className="pulse-radar__spoke" x1={CX} y1={CY} x2={x} y2={y} />;
                })}
                <polygon className={"pulse-radar__area" + (p.fillShape ? "" : " pulse-radar__area--line")}
                  points={dataPoly} />
                {axes.map((a, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  const [x, y] = ptAt(i, Math.abs(a.v) / maxAbs);
                  return <circle key={i} className={"pulse-radar__vtx" + (focus ? " pulse-radar__vtx--focus" : "")}
                    cx={x} cy={y} r={focus ? 2.3 : 1.7} />;
                })}
              </svg>

              {p.showLabels && (
                <div className="pulse-radar__labels">
                  {axes.map((a, i) => {
                    const focus = p.focusEnabled && i + 1 === p.focusIndex;
                    const ca = Math.cos(angle(i)), sa = Math.sin(angle(i));
                    const lx = CX + R * 1.07 * ca, ly = CY + R * 1.07 * sa;
                    let tx, align;
                    if (ca > 0.25) { tx = "translateY(-50%)"; align = "left"; }
                    else if (ca < -0.25) { tx = "translate(-100%, -50%)"; align = "right"; }
                    else { tx = "translate(-50%, " + (sa < 0 ? "-100%" : "0") + ")"; align = "center"; }
                    return (
                      <div key={i} className={"pulse-radar__lab" + (focus ? " is-focus" : "")}
                        style={{ left: lx + "%", top: ly + "%", transform: tx, textAlign: align, width: "auto", maxWidth: 170 }}>
                        <div className="pulse-radar__lab-k">{a.k}</div>
                        <div className="pulse-radar__lab-v" style={focus ? { color: accent } : undefined}>{fmt(a.v)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pulse-radar__side">
            <div className="pulse-label" style={{ marginBottom: 22, display: "flex", justifyContent: "space-between" }}>
              <span>{COPY.sub}</span><span className="pulse-mono" style={{ whiteSpace: "nowrap" }}>{COPY.unit}</span>
            </div>
            {p.showMetrics && (
              <div className="pulse-radar__metrics">
                {axes.map((a, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  return (
                    <div key={i} className={"pulse-radar__metric" + (focus ? " pulse-radar__metric--focus" : "")}>
                      <span className="pulse-radar__m-dot" style={{ background: focus ? accent : "var(--pulse-ink)" }} />
                      <span className="pulse-radar__m-k">{a.k}</span>
                      <span className="pulse-radar__m-v" style={focus ? { color: accent } : undefined}>{fmt(a.v)}</span>
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

  PulseRadar.controls = [
    { key: "axisCount", type: "slider", label: "维度数量", default: 4, min: 3, max: 4, step: 1,
      description: "雷达图的能力维度（轴）数量（雷达至少 3 维）。" },
    { key: "fillShape", type: "toggle", label: "填充形态", default: true,
      description: "数据多边形填充（开）或仅描边（关）。" },
    { key: "showGrid", type: "toggle", label: "网格刻度", default: true,
      description: "同心环刻度与放射轴线。" },
    { key: "showLabels", type: "toggle", label: "维度标签", default: true,
      description: "各轴外侧的维度名称与数值标签。" },
    { key: "focusEnabled", type: "toggle", label: "重点维度", default: true,
      description: "是否突出某一个维度。" },
    { key: "focusIndex", type: "slider", label: "重点维度序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的维度序号（从 1 起）。" },
    { key: "showMetrics", type: "toggle", label: "指标列表", default: true,
      description: "右侧的逐维数值列表。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
      description: "数据多边形与重点 / 眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "右下角的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseRadar.defaults = PulseRadar.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseRadar.copyDefaults = COPY;
  PulseRadar.defaults = { ...(PulseRadar.defaults || {}), copy: COPY };
  window.PulseRadar = PulseRadar;
})();

const Component = window.PulseRadar;
if (!Component) throw new Error('Missing theme05 component PulseRadar');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;