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
   PulseEra — P85 timeline page ("周期里程碑 / Era Timeline" archetype).
   A generic horizontal MILESTONE timeline: N evenly-spaced stations on a thick
   axis, each with a period label, title, note and an optional headline value.
   Cards alternate above / below the axis (or all sit below); one station can be
   focused (enlarged + accent). The reusable template for any "chronology /
   phases / milestones across a cycle" page — bold, low-density, a breathing
   beat between dense data pages.

   Self-contained: React + the shared .pulse-era / .pulse-* CSS. Text/data live
   in COPY (not prop-driven); structure & styling are prop-driven (see controls).

   To migrate into a bundler: delete the `window.PulseEra = …` line and
   `export default PulseEra; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "Capital Cycle",
    title: "资本周期回顾",
    sheet: "TIMELINE · 85 / 86",
    startCap: "周期起点",
    endCap: "当前位置",
    nodes: [
      { time: "23 Q4", title: "叙事启动", note: "大模型热度点燃一级市场，资金开始排队入场。", value: "58", unit: "亿美元" },
      { time: "24 Q1", title: "冷启动", note: "大额事件稀少，资本观望，估值预期重新校准。", value: "41", unit: "亿美元" },
      { time: "24 Q2", title: "加速", note: "基础设施轮次集中落地，单笔金额快速抬升。", value: "96", unit: "亿美元" },
      { time: "24 Q3", title: "峰值", note: "全年峰值季度，头部公司吸走绝大部分资金。", value: "182", unit: "亿美元" },
      { time: "24 Q4", title: "理性回落", note: "热度由叙事转向兑现，资金更挑剔、更集中。", value: "121", unit: "亿美元" },
      { time: "25 H1", title: "结构分化", note: "底层与应用分道，壁垒清晰者获得溢价。", value: "—", unit: "展望" },
    ],
    conclusion: "一个完整周期里，资本从赌叙事走向看兑现。",
  };

  const controls = [
    { key: "nodeCount", type: "slider", label: "节点数量", default: 5, min: 3, max: 6, step: 1,
      description: "时间轴里程碑节点数量（3–6）。" },
    { key: "layout", type: "radio", label: "卡片排布", default: "alternate",
      options: [{ value: "alternate", label: "上下交错" }, { value: "below", label: "全部在下" }],
      description: "节点卡片相对轴线的位置：上下交错 / 全部在轴线下方。" },
    { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
      description: "是否突出某一节点（放大 + 强调色）。" },
    { key: "focusIndex", type: "slider", label: "重点序号", default: 4, min: 1, max: 6, step: 1,
      description: "重点节点序号。" },
    { key: "showValue", type: "toggle", label: "节点数值", default: true,
      description: "每个节点的巨号数值（如季度金额）。" },
    { key: "showNote", type: "toggle", label: "节点说明", default: true,
      description: "每个节点卡片内的一句说明。" },
    { key: "showAxisCaps", type: "toggle", label: "轴端标签", default: true,
      description: "轴线两端的「起点 / 当前」标签。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "眉标 / 轴线 / 重点节点的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseEra(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(3, Math.min(COPY.nodes.length, p.nodeCount));
    const nodes = COPY.nodes.slice(0, n);
    const focus = Math.min(p.focusIndex, n) - 1;
    const alt = p.layout === "alternate";

    return (
      <div className="pulse-slide pulse-era" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-era__body">
          {p.showAxisCaps && (
            <div className="pulse-era__caps">
              <span><b style={{ color: accent }}>↦</b> {COPY.startCap}</span>
              <span>{COPY.endCap} <b style={{ color: accent }}>◆</b></span>
            </div>
          )}

          <div className={"pulse-era__track" + (alt ? " pulse-era__track--alt" : " pulse-era__track--below")}
            style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {/* axis line behind the stations */}
            <div className="pulse-era__axis" style={{ background: accent }} aria-hidden="true" />

            {nodes.map((nd, i) => {
              const up = alt && i % 2 === 0;
              const isFocus = p.focusEnabled && i === focus;
              return (
                <div key={i}
                  className={"pulse-era__station" + (up ? " is-up" : " is-down") + (isFocus ? " is-focus" : "")}>
                  <div className="pulse-era__card">
                    <div className="pulse-era__time" style={{ color: isFocus ? accent : undefined }}>{nd.time}</div>
                    <div className="pulse-era__ctitle">{nd.title}</div>
                    {p.showValue && (
                      <div className="pulse-era__val" style={{ color: isFocus ? accent : undefined }}>
                        {nd.value}<small>{nd.unit}</small>
                      </div>
                    )}
                    {p.showNote && <div className="pulse-era__note">{nd.note}</div>}
                  </div>
                  <span className="pulse-era__stem" aria-hidden="true" />
                  <span className="pulse-era__dot" style={{ background: isFocus ? accent : "var(--pulse-ink)" }}>
                    <i>{String(i + 1).padStart(2, "0")}</i>
                  </span>
                </div>
              );
            })}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-era__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseEra.controls = controls;
  PulseEra.defaults = defaults;

  if (typeof window !== "undefined") PulseEra.copyDefaults = COPY;
  PulseEra.defaults = { ...(PulseEra.defaults || {}), copy: COPY };
  window.PulseEra = PulseEra;
})();

const Component = window.PulseEra;
if (!Component) throw new Error('Missing theme05 component PulseEra');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;