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
   PulseBigNumber — P24 big-number page ("赛道平均融资额 / Headline Stat" archetype).
   A generic single-figure anchor page echoing the cover's oversized numerals
   and the spec sheet's supporting rows: one dominant number + unit, an
   explanatory caption, a supporting line, and 0–n supporting metrics.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseBigNumber.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "AVERAGE TICKET",
    title: "赛道平均融资额",
    sub: "平均单笔规模",
    sheet: "AVERAGE · 24 / 32",
    number: "10",
    unit: "亿美元",
    caption: "全年单笔大额融资的平均规模。",
    message: "融资规模越大，后续兑现压力越高。",
    aux: [
      { k: "大额事件", v: "97", u: "笔" },
      { k: "全年融资", v: "970", u: "亿美元" },
      { k: "最大单笔", v: "66", u: "亿美元" },
    ],
  };

  function PulseBigNumber(props) {
    const p = Object.assign({}, PulseBigNumber.defaults, props);
    const accent = p.accentColor;
    const aux = COPY.aux.slice(0, Math.max(0, Math.min(COPY.aux.length, p.auxCount)));
    const center = p.numberAlign === "center";

    return (
      <div className="pulse-slide pulse-big" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-big__body">
          <div className={"pulse-big__hero" + (center ? " pulse-big__hero--center" : "")}>
            <div className="pulse-big__num">
              <b>{COPY.number}</b>
              {p.showUnit && <em>{COPY.unit}</em>}
            </div>
            {p.showCaption && <div className="pulse-big__caption">{COPY.caption}</div>}
            {p.showMessage && <div className="pulse-big__msg">{COPY.message}</div>}
          </div>

          {aux.length > 0 && (
            <div className="pulse-big__aux">
              {aux.map((a, i) => (
                <div className="pulse-big__aux-item" key={i}>
                  <div className="pulse-big__aux-k">{a.k}</div>
                  <div className="pulse-big__aux-v">{a.v}<small>{a.u}</small></div>
                </div>
              ))}
            </div>
          )}

          {(p.showWordmark || p.showColorBand) && (
            <div className="pulse-big__foot">
              {p.showWordmark
                ? <span className="pulse-wordmark">PULSE<sup>R</sup></span>
                : <span />}
              {p.showColorBand && (
                <span className="pulse-big__band">
                  {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  PulseBigNumber.controls = [
    { key: "auxCount", type: "slider", label: "辅助指标数量", default: 3, min: 0, max: 3, step: 1,
      description: "底部支撑指标的数量（0 隐藏整行）。" },
    { key: "numberAlign", type: "radio", label: "主数字对齐", default: "left",
      options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
      description: "主数字与说明文字的对齐方式。" },
    { key: "showUnit", type: "toggle", label: "单位显示", default: true,
      description: "主数字后的单位后缀。" },
    { key: "showCaption", type: "toggle", label: "解释说明", default: true,
      description: "主数字下方的一句解释说明。" },
    { key: "showMessage", type: "toggle", label: "支撑文案", default: true,
      description: "解释下方的一句支撑性文案。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "主数字与眉标的强调色。" },
    { key: "showWordmark", type: "toggle", label: "品牌标识", default: true,
      description: "左下角的品牌标识。" },
    { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
      description: "右下角的装饰色谱条。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseBigNumber.defaults = PulseBigNumber.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseBigNumber.copyDefaults = COPY;
  PulseBigNumber.defaults = { ...(PulseBigNumber.defaults || {}), copy: COPY };
  window.PulseBigNumber = PulseBigNumber;
})();

const Component = window.PulseBigNumber;
if (!Component) throw new Error('Missing theme05 component PulseBigNumber');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;