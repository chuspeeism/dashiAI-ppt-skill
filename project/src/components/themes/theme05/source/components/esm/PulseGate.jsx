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
   PulseGate — P41 chart page ("分层防线图 / Layered Bands" archetype).
   A generic LAYERED-GATING chart: N stacked bands whose width encodes a value
   (a defense / stage / gate hierarchy), rendered either as a centered nested
   "tower" (chartType=nested) or as left-aligned horizontal bars (chartType=bar).
   A focus band can be outlined while the rest dim. A colored metric spec card +
   note sit in the evidence column. The reusable template for any "layered
   defense / staged funnel / nested composition" chart page.

   Self-contained & migratable: depends only on React + the shared .pulse-gate /
   .pulse-* CSS. Controlled ENTIRELY by props. See PulseGate.controls for the
   typed, documented parameter list. Text/data live in COPY (not prop-driven).

   To migrate into a bundler: delete the `window.PulseGate = …` line at the
   bottom and `export default PulseGate; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "AI SAFETY",
    title: "评测、红队与合规",
    sheet: "CHART · 41 / 80",
    layerCap: "安全防线分层",
    layerUnit: "DEFENSE LAYERS",
    layers: [
      { en: "EVALUATION", zh: "模型评测", v: 6, c: SPECTRUM[5] },
      { en: "RED TEAM",   zh: "红队测试", v: 4, c: SPECTRUM[0] },
      { en: "CONTENT",    zh: "内容安全", v: 5, c: SPECTRUM[1] },
      { en: "COMPLIANCE", zh: "合规监测", v: 5, c: SPECTRUM[3] },
    ],
    metricCap: "赛道指标",
    metricUnit: "BY SEGMENT",
    metrics: [
      ["融资额", "16", "亿美元"],
      ["事件数", "8", "笔"],
      ["平均单笔", "2.0", "亿美元"],
      ["预算属性", "刚性", ""],
    ],
    note: "监管收紧会把 AI 安全从可选预算变成刚性预算。",
    conclusion: "安全能力会成为企业采购门槛。",
  };

  const controls = [
    { key: "layerCount", type: "slider", label: "防线层数", default: 4, min: 2, max: 4, step: 1,
      description: "纵向堆叠的防线（分层）数量。" },
    { key: "chartType", type: "radio", label: "防线图样式", default: "nested",
      options: [{ value: "nested", label: "嵌套" }, { value: "bar", label: "条形" }],
      description: "分层呈现方式：居中嵌套塔 / 左对齐横向条形。" },
    { key: "focusEnabled", type: "toggle", label: "重点防线", default: true,
      description: "是否突出某一层（其余淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点防线序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的防线序号（从 1 起）。" },
    { key: "showValue", type: "toggle", label: "防线数值", default: true,
      description: "各层右侧的数值标注。" },
    { key: "showMetricCard", type: "toggle", label: "侧栏指标卡", default: true,
      description: "右侧的彩色指标规格卡。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "侧栏指标卡的指标行数。" },
    { key: "showNote", type: "toggle", label: "侧栏说明", default: true,
      description: "侧栏底部的一段说明文案。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "眉标 / 指标卡 / 重点标记的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseGate(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const nLayer = Math.max(2, Math.min(COPY.layers.length, p.layerCount));
    const layers = COPY.layers.slice(0, nLayer);
    const maxV = Math.max.apply(null, layers.map((l) => l.v));
    const focusN = Math.min(p.focusIndex, nLayer);

    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);

    const nested = p.chartType === "nested";

    return (
      <div className="pulse-slide pulse-gate" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-gate__body">
          <div className="pulse-gate__main">
            <div className="pulse-gate__cap">
              <span className="pulse-label">{COPY.layerCap}</span>
              <span className="pulse-mono">{COPY.layerUnit}</span>
            </div>

            <div className={"pulse-gate__stack" + (nested ? " pulse-gate__stack--nested" : " pulse-gate__stack--bar")}>
              {layers.map((l, i) => {
                const focus = p.focusEnabled && i + 1 === focusN;
                const dim = p.focusEnabled && !focus;
                // nested: min 42% so the tower keeps a readable silhouette; bar: from 0.
                const w = nested
                  ? (42 + (l.v / maxV) * 58)
                  : ((l.v / maxV) * 100);
                return (
                  <div key={i} className="pulse-gate__layer">
                    <div className="pulse-gate__band"
                      style={{ width: w + "%", background: l.c, opacity: dim ? 0.32 : 1,
                        boxShadow: focus ? "inset 0 0 0 5px var(--pulse-ink)" : "none" }}>
                      <span className="pulse-gate__band-zh">{l.zh}</span>
                      <span className="pulse-gate__band-en">{l.en}</span>
                      {p.showValue && (
                        <span className="pulse-gate__band-v">{l.v}<small>亿美元</small></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pulse-gate__axis">
              <span>外层 · 通用防护</span>
              <span>内层 · 核心合规</span>
            </div>
          </div>

          {p.showMetricCard && (
            <div className="pulse-gate__side">
              <div className="pulse-gate__metrics" style={{ background: accent }}>
                <div className="pulse-gate__metrics-cap">
                  <span>{COPY.metricCap}</span>
                  <span>{COPY.metricUnit}</span>
                </div>
                {metrics.map((m, i) => (
                  <div className="pulse-gate__m" key={i}>
                    <span className="pulse-gate__m-k">{m[0]}</span>
                    <span className="pulse-gate__m-v">{m[1]}{m[2] && <small>{m[2]}</small>}</span>
                  </div>
                ))}
              </div>
              {p.showNote && <div className="pulse-gate__note">{COPY.note}</div>}
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-gate__concl">{COPY.conclusion}</div>}
      </div>
    );
  }

  PulseGate.controls = controls;
  PulseGate.defaults = defaults;

  if (typeof window !== "undefined") PulseGate.copyDefaults = COPY;
  PulseGate.defaults = { ...(PulseGate.defaults || {}), copy: COPY };
  window.PulseGate = PulseGate;
})();

const Component = window.PulseGate;
if (!Component) throw new Error('Missing theme05 component PulseGate');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;