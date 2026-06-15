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
   PulseDelta — P18 period-over-period page ("环比对比" archetype).
   A generic "focal subject + metric spec + change callout" slide: the giant
   subject glyph and metric spec on the left; a dark evidence panel at right
   showing a big period-over-period delta (arrow + %), an optional before/
   after comparison, and a list of sub-period bars with a focus highlight.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseDelta.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    eyebrow: "QUARTER BREAKDOWN",
    title: "加速季度",
    sub: "Q2 融资拆解",
    sheet: "Q2 · 18 / 32",
    glyph: "Q2",
    name: "Q2 融资拆解 · 加速阶段",
    metrics: [
      { k: "融资额", v: "284", u: "亿美元" },
      { k: "事件数", v: "26", u: "笔" },
      { k: "平均单笔", v: "10.9", u: "亿美元" },
      { k: "环比增长", v: "75.3", u: "%" },
    ],
    panelTitle: "环比对比",
    panelNote: "QoQ · Q1 → Q2",
    delta: { sign: "+", value: "75.3%", cap: "对比 Q1：162 → 284 亿美元" },
    compare: [
      { axis: "Q1", v: 162 },
      { axis: "Q2", v: 284 },
    ],
    unit: "亿美元 / 月",
    rows: [
      { axis: "4月", v: 86 },
      { axis: "5月", v: 105 },
      { axis: "6月", v: 93 },
    ],
    conclusion: "Q2 是融资窗口打开的关键节点。",
  };

  function PulseDelta(props) {
    const p = Object.assign({}, PulseDelta.defaults, props);
    const accent = p.accentColor;
    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const nRow = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
    const rows = COPY.rows.slice(0, nRow);
    const rowMax = Math.max.apply(null, rows.map((r) => r.v)) * 1.06;
    const cmpMax = Math.max.apply(null, COPY.compare.map((c) => c.v));

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
                <div className="pulse-mono" style={{ color: "var(--pulse-on-dark-mute)" }}>{COPY.panelNote}</div>
              </div>

              {p.showDelta && (
                <div className="pulse-delta__hero">
                  {p.showArrow && <div className="pulse-delta__arrow">↗</div>}
                  <div className="pulse-delta__big">
                    <b>{COPY.delta.sign}{COPY.delta.value}</b>
                    <span>{COPY.delta.cap}</span>
                  </div>
                  {p.showCompare && (
                    <div className="pulse-delta__compare">
                      {COPY.compare.map((c, i) => {
                        const last = i === COPY.compare.length - 1;
                        return (
                          <div className="pulse-delta__compbar" key={i}>
                            <i style={{
                              height: (c.v / cmpMax) * 100 + "%",
                              background: last ? accent : "rgba(239,233,218,0.32)",
                            }} />
                            <em>{c.axis} · {c.v}</em>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="pulse-delta__bars">
                {rows.map((r, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  return (
                    <div key={i} className={"pulse-delta__barrow" + (focus ? " pulse-delta__barrow--focus" : "")}>
                      <div className="pulse-delta__barrow-h">
                        <span>{r.axis}</span>
                        <span>{r.v}<small>亿美元</small></span>
                      </div>
                      <div className="pulse-delta__track">
                        <div className="pulse-delta__fill" style={{
                          width: (r.v / rowMax) * 100 + "%",
                          background: focus ? accent : "rgba(239,233,218,0.55)",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {p.showConclusion && <div className="pulse-conclusion pulse-stat__concl">{COPY.conclusion}</div>}
          </div>
        </div>
      </div>
    );
  }

  PulseDelta.controls = [
    { key: "rowCount", type: "slider", label: "对比行数", default: 3, min: 2, max: 3, step: 1,
      description: "下方分段（子周期）条形的数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点标注", default: true,
      description: "是否突出某一条分段（峰值 / 关键项）。" },
    { key: "focusIndex", type: "slider", label: "重点分段", default: 2, min: 1, max: 3, step: 1,
      description: "被突出的分段序号（从 1 起）。" },
    { key: "showDelta", type: "toggle", label: "变化量标注", default: true,
      description: "顶部的大号环比变化量（箭头 + 百分比）。" },
    { key: "showCompare", type: "toggle", label: "前后对比", default: true,
      description: "变化量右侧的前 / 后两段对比柱。" },
    { key: "showArrow", type: "toggle", label: "趋势箭头", default: true,
      description: "变化量左侧的趋势方向箭头。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "左侧主体卡的指标行数量。" },
    { key: "showSwatches", type: "toggle", label: "色谱色卡", default: true,
      description: "左下角的装饰性色谱色卡。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[1], options: SPECTRUM,
      description: "主体字形 / 变化量 / 重点标注的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "面板下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseDelta.defaults = PulseDelta.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseDelta.copyDefaults = COPY;
  PulseDelta.defaults = { ...(PulseDelta.defaults || {}), copy: COPY };
  window.PulseDelta = PulseDelta;
})();

const Component = window.PulseDelta;
if (!Component) throw new Error('Missing theme05 component PulseDelta');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;