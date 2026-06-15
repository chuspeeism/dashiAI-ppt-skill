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
   PulseChain — P07 content page ("产业链分层 / Layered Chain" archetype).
   A generic layered-structure slide: N stacked layer bands (each with a label
   and item chips), an optional focus layer, and an optional side distribution
   panel. Self-contained: React + .pulse-* CSS only. Controlled by props.
   See PulseChain.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    eyebrow: "VALUE CHAIN",
    title: "产业链分层透视",
    sub: "上游、中游、下游的资本位置",
    sheet: "CHAIN · 07 / 32",
    layers: [
      { zh: "上游", en: "UPSTREAM",   c: SPECTRUM[4], items: ["算力", "芯片", "数据"] },
      { zh: "中游", en: "MIDSTREAM",  c: SPECTRUM[5], items: ["通用模型", "专用模型"] },
      { zh: "下游", en: "DOWNSTREAM", c: SPECTRUM[3], items: ["企业应用", "搜索", "机器人"] },
      { zh: "支撑", en: "ENABLERS",   c: SPECTRUM[6], items: ["安全", "评测", "数据标注"] },
    ],
    sideHead: "地区分布",
    sideUnit: "GEO SHARE",
    dist: [
      { name: "旧金山湾区", v: 63.9, c: SPECTRUM[0] },
      { name: "纽约",       v: 12.4, c: SPECTRUM[1] },
      { name: "西雅图",     v: 9.8,  c: SPECTRUM[2] },
      { name: "波士顿",     v: 7.7,  c: SPECTRUM[3] },
    ],
    conclusion: "产业链分层决定了资本确定性与商业风险的不同位置。",
  };

  function PulseChain(props) {
    const p = Object.assign({}, PulseChain.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(2, Math.min(COPY.layers.length, p.layerCount));
    const layers = COPY.layers.slice(0, n);
    const distMax = Math.max.apply(null, COPY.dist.map((d) => d.v));

    return (
      <div className="pulse-slide pulse-chain" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-chain__body">
          <div className="pulse-chain__layers">
            {layers.map((l, i) => {
              const focus = p.focusEnabled && i + 1 === p.focusIndex;
              return (
                <div key={i}
                  className={"pulse-chain__layer" + (focus ? " pulse-chain__layer--focus" : "")}
                  style={{ background: l.c }}>
                  {focus && <div className="pulse-chain__layer-flag">重点</div>}
                  <div className="pulse-chain__layer-idx">{String(i + 1).padStart(2, "0")}</div>
                  <div className="pulse-chain__layer-tag">
                    <div className="pulse-chain__layer-zh">{l.zh}</div>
                    <div className="pulse-chain__layer-en">{l.en}</div>
                  </div>
                  {p.showItems && (
                    <div className="pulse-chain__layer-items">
                      {l.items.map((it, k) => (
                        <span className="pulse-chain__chip" key={k}>{it}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {p.showSidePanel && (
            <div className="pulse-chain__side">
              <div className="pulse-chain__side-head">
                <span className="pulse-label">{COPY.sideHead}</span>
                <span className="pulse-mono">{COPY.sideUnit}</span>
              </div>
              <div className="pulse-chain__dist">
                {COPY.dist.map((d, i) => (
                  <div className="pulse-chain__dist-row" key={i}>
                    <div className="pulse-chain__dist-h">
                      <span className="pulse-chain__dist-name">{d.name}</span>
                      <span className="pulse-chain__dist-val">{d.v}%</span>
                    </div>
                    <div className="pulse-chain__dist-track">
                      <div className="pulse-chain__dist-fill" style={{ width: (d.v / distMax) * 100 + "%", background: d.c }} />
                    </div>
                  </div>
                ))}
              </div>
              {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  PulseChain.controls = [
    { key: "layerCount", type: "slider", label: "层级数量", default: 3, min: 2, max: 4, step: 1,
      description: "纵向堆叠的结构层级数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点层级", default: true,
      description: "是否突出某一层级。" },
    { key: "focusIndex", type: "slider", label: "重点层级序号", default: 2, min: 1, max: 4, step: 1,
      description: "被突出的层级序号（从 1 起）。" },
    { key: "showItems", type: "toggle", label: "层级标签", default: true,
      description: "每个层级内部的要素标签。" },
    { key: "showSidePanel", type: "toggle", label: "侧栏分布", default: true,
      description: "右侧的分布占比面板。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标与重点层级标记的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "侧栏底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseChain.defaults = PulseChain.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseChain.copyDefaults = COPY;
  PulseChain.defaults = { ...(PulseChain.defaults || {}), copy: COPY };
  window.PulseChain = PulseChain;
})();

const Component = window.PulseChain;
if (!Component) throw new Error('Missing theme05 component PulseChain');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;