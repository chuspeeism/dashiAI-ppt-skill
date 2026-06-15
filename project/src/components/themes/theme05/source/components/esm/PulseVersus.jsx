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
   PulseVersus — P89 big-number page ("对比大数字 / Versus Ratio" archetype).
   A generic TWO-FIGURE headline: two colossal numbers face off across a central
   operator (× / ∶ / →) with an optional ratio badge, so a comparison or a
   multiple reads in one glance. Either side (or both) can carry the accent;
   0–n supporting metrics line the foot. The reusable template for any "A vs B /
   N× multiple / before→after" headline — distinct from the single big-number
   pages by being a deliberate face-off.

   Self-contained: React + the shared .pulse-vs / .pulse-* CSS. Text/data live in
   COPY (not prop-driven); structure & styling are prop-driven (see controls).

   To migrate into a bundler: delete the `window.PulseVersus = …` line and
   `export default PulseVersus; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "Concentration",
    title: "头部与长尾",
    sheet: "BIG NUMBER · 89 / 90",
    left: { label: "TOP 5 公司", value: "63", unit: "%", caption: "拿走全年大额融资的六成以上。" },
    right: { label: "其余 90+ 公司", value: "37", unit: "%", caption: "分食剩下的不到四成资金。" },
    badge: { value: "1.7×", note: "头部 / 长尾 倍差" },
    aux: [
      ["大额事件", "97", "笔"],
      ["头部均单笔", "24", "亿美元"],
      ["长尾均单笔", "3.1", "亿美元"],
    ],
    wordmark: "AICL",
    closing: "资本高度向头部集中，长尾的窗口正在收窄。",
  };

  const controls = [
    { key: "operator", type: "radio", label: "对比符号", default: "ratio",
      options: [{ value: "ratio", label: "∶" }, { value: "times", label: "×" }, { value: "arrow", label: "→" }],
      description: "两个数字之间的运算 / 关系符号。" },
    { key: "emphasize", type: "radio", label: "强调侧", default: "left",
      options: [{ value: "left", label: "左" }, { value: "right", label: "右" }, { value: "both", label: "两侧" }],
      description: "用强调色着重的一侧数字。" },
    { key: "showBadge", type: "toggle", label: "倍数徽标", default: true,
      description: "中心的比值 / 倍数徽标。" },
    { key: "showCaption", type: "toggle", label: "数字说明", default: true,
      description: "每个数字下方的一句说明。" },
    { key: "auxCount", type: "slider", label: "辅助指标数", default: 3, min: 0, max: 3, step: 1,
      description: "底部支撑指标的数量（0 隐藏整行）。" },
    { key: "showClosing", type: "toggle", label: "结语文案", default: true,
      description: "底部的一句结语。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 强调侧数字 / 徽标的强调色。" },
    { key: "showWordmark", type: "toggle", label: "品牌标识", default: true,
      description: "左下角的品牌标识。" },
    { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
      description: "右下角的装饰色谱条。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  const OP = { ratio: "∶", times: "×", arrow: "→" };

  function PulseVersus(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const nAux = Math.max(0, Math.min(COPY.aux.length, p.auxCount));
    const aux = COPY.aux.slice(0, nAux);
    const leftAccent = p.emphasize === "left" || p.emphasize === "both";
    const rightAccent = p.emphasize === "right" || p.emphasize === "both";

    const Side = ({ d, on }) => (
      <div className="pulse-vs__side">
        <div className="pulse-vs__label">{d.label}</div>
        <div className="pulse-vs__num" style={{ color: on ? accent : "var(--pulse-ink)" }}>
          {d.value}<small>{d.unit}</small>
        </div>
        {p.showCaption && <div className="pulse-vs__cap">{d.caption}</div>}
      </div>
    );

    return (
      <div className="pulse-slide pulse-vs" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-vs__body">
          <div className="pulse-vs__row">
            <Side d={COPY.left} on={leftAccent} />
            <div className="pulse-vs__mid">
              <div className="pulse-vs__op">{OP[p.operator]}</div>
              {p.showBadge && (
                <div className="pulse-vs__badge">
                  <span className="pulse-vs__badge-v" style={{ color: accent }}>{COPY.badge.value}</span>
                  <span className="pulse-vs__badge-n">{COPY.badge.note}</span>
                </div>
              )}
            </div>
            <Side d={COPY.right} on={rightAccent} />
          </div>

          {nAux > 0 && (
            <div className="pulse-vs__aux">
              {aux.map((m, i) => (
                <div key={i} className="pulse-vs__aux-item">
                  <span className="pulse-vs__aux-v">{m[1]}<small>{m[2]}</small></span>
                  <span className="pulse-vs__aux-k">{m[0]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pulse-vs__foot">
            {p.showWordmark ? <div className="pulse-vs__wordmark">{COPY.wordmark}<sup>®</sup></div> : <span />}
            {p.showClosing && <div className="pulse-vs__closing">{COPY.closing}</div>}
            {p.showColorBand ? (
              <div className="pulse-vs__band" aria-hidden="true">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            ) : <span />}
          </div>
        </div>
      </div>
    );
  }

  PulseVersus.controls = controls;
  PulseVersus.defaults = defaults;

  if (typeof window !== "undefined") PulseVersus.copyDefaults = COPY;
  PulseVersus.defaults = { ...(PulseVersus.defaults || {}), copy: COPY };
  window.PulseVersus = PulseVersus;
})();

const Component = window.PulseVersus;
if (!Component) throw new Error('Missing theme05 component PulseVersus');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;