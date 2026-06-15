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
   PulseHeatmap — P09 chart page ("周期热力 / Periodic Intensity" archetype).
   A generic periodic heat-grid slide: N data cells laid out on an adjustable
   column grid, each cell shaded by its value (switchable colour ramp), with an
   optional extreme-value highlight, a colour-scale legend and a peak list.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseHeatmap.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "MONTHLY HEATMAP",
    title: "市场月度热力",
    sub: "12 个月融资节奏",
    sheet: "DETAIL · 09 / 32",
    unit: "亿美元 / 月",
    cells: [
      { k: "1月", v: 45 },  { k: "2月", v: 58 },  { k: "3月", v: 59 },
      { k: "4月", v: 86 },  { k: "5月", v: 105 }, { k: "6月", v: 93 },
      { k: "7月", v: 92 },  { k: "8月", v: 118 }, { k: "9月", v: 108 },
      { k: "10月", v: 73 }, { k: "11月", v: 81 }, { k: "12月", v: 52 },
    ],
    conclusion: "融资节奏的核心不是平均值，而是峰值背后的超级交易。",
  };

  // ---- colour helpers (ramp from paper to a saturated end-stop) ----
  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lerp(a, b, t) { return a.map((x, i) => Math.round(x + (b[i] - x) * t)); }
  function css(rgb) { return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`; }
  function lum(rgb) { return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255; }

  // Multi-stop ramps keyed by scale mode. First stop ≈ paper, last ≈ ink/accent.
  const RAMPS = {
    warm: ["#efe9da", "#efbe2e", "#e2742c", "#d8402e", "#a8281a"],
    cool: ["#efe9da", "#9fc6d8", "#4da0c6", "#2c44a0", "#1b2a63"],
    mono: ["#efe9da", "#bdb7a4", "#7c776a", "#3d3a32", "#14130f"],
  };
  function sample(ramp, t) {
    const stops = ramp.map(hexToRgb);
    const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
    const i = Math.floor(x);
    if (i >= stops.length - 1) return stops[stops.length - 1];
    return lerp(stops[i], stops[i + 1], x - i);
  }

  function PulseHeatmap(props) {
    const p = Object.assign({}, PulseHeatmap.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(6, Math.min(COPY.cells.length, p.cellCount));
    const cells = COPY.cells.slice(0, n);
    const cols = Math.max(2, Math.min(6, p.columns));
    const ramp = RAMPS[p.colorScale] || RAMPS.warm;

    const vals = cells.map((c) => c.v);
    const min = Math.min.apply(null, vals);
    const max = Math.max.apply(null, vals);
    const span = max - min || 1;

    // Indices of the top-N extreme cells (for the focus highlight + peak list).
    const ranked = cells
      .map((c, i) => ({ i, v: c.v }))
      .sort((a, b) => b.v - a.v);
    const focusCount = Math.max(1, Math.min(4, p.focusCount));
    const focusSet = new Set(ranked.slice(0, focusCount).map((r) => r.i));

    return (
      <div className="pulse-slide pulse-heat" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-heat__body">
          <div className="pulse-heat__main">
            <div className="pulse-heat__caphead">
              <span className="pulse-label">{COPY.sub}</span>
              <span className="pulse-mono">{COPY.unit}</span>
            </div>
            <div className="pulse-heat__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {cells.map((c, i) => {
                const t = (c.v - min) / span;
                const isFocus = p.focusEnabled && focusSet.has(i);
                const bg = sample(ramp, 0.12 + t * 0.88);
                const light = lum(bg) < 0.52;
                return (
                  <div
                    key={i}
                    className={"pulse-heat__cell" + (isFocus ? " pulse-heat__cell--focus" : "")}
                    style={{ background: css(bg), color: light ? "#efe9da" : "#14130f" }}
                  >
                    <span className="pulse-heat__cell-k">{c.k}</span>
                    {p.showValues && <span className="pulse-heat__cell-v">{c.v}</span>}
                    {isFocus && <span className="pulse-heat__cell-flag" style={{ background: accent }}>峰值</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pulse-heat__side">
            {p.showPeakList && (
              <div className="pulse-heat__peaks">
                <div className="pulse-label" style={{ marginBottom: 18 }}>峰值月份</div>
                {ranked.slice(0, Math.max(2, focusCount)).map((r, k) => (
                  <div key={r.i} className="pulse-heat__peak">
                    <span className="pulse-heat__peak-rk">{String(k + 1).padStart(2, "0")}</span>
                    <span className="pulse-heat__peak-k">{cells[r.i].k}</span>
                    <span className="pulse-heat__peak-v">{cells[r.i].v}</span>
                  </div>
                ))}
              </div>
            )}

            {p.showScaleLegend && (
              <div className="pulse-heat__scale">
                <div className="pulse-heat__scale-bar"
                  style={{ background: `linear-gradient(90deg, ${ramp.join(",")})` }} />
                <div className="pulse-heat__scale-cap">
                  <span>{min} 亿</span><span>低 — 高</span><span>{max} 亿</span>
                </div>
              </div>
            )}

            {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
          </div>
        </div>
      </div>
    );
  }

  PulseHeatmap.controls = [
    { key: "cellCount", type: "slider", label: "数据格数量", default: 12, min: 6, max: 12, step: 1,
      description: "参与展示的周期格（月份）数量。" },
    { key: "columns", type: "slider", label: "网格列数", default: 4, min: 2, max: 6, step: 1,
      description: "热力网格的列数，决定排布形状。" },
    { key: "colorScale", type: "radio", label: "色阶模式", default: "warm",
      options: [{ value: "warm", label: "暖色" }, { value: "cool", label: "冷色" }, { value: "mono", label: "单色" }],
      description: "数值映射到颜色的色阶：暖色 / 冷色 / 单色。" },
    { key: "focusEnabled", type: "toggle", label: "突出极值", default: true,
      description: "是否在网格上标记数值最高的若干格。" },
    { key: "focusCount", type: "slider", label: "极值数量", default: 2, min: 1, max: 4, step: 1,
      description: "被标记 / 列出的峰值格数量（取最大的前 N 个）。" },
    { key: "showValues", type: "toggle", label: "显示数值", default: true,
      description: "在每个格内显示数值。" },
    { key: "showPeakList", type: "toggle", label: "峰值列表", default: true,
      description: "右侧按数值排序的峰值列表。" },
    { key: "showScaleLegend", type: "toggle", label: "色阶图例", default: true,
      description: "右侧的色阶渐变图例条。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "峰值标记与眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "右下角的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseHeatmap.defaults = PulseHeatmap.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseHeatmap.copyDefaults = COPY;
  PulseHeatmap.defaults = { ...(PulseHeatmap.defaults || {}), copy: COPY };
  window.PulseHeatmap = PulseHeatmap;
})();

const Component = window.PulseHeatmap;
if (!Component) throw new Error('Missing theme05 component PulseHeatmap');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;