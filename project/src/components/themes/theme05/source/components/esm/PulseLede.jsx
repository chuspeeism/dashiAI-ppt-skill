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
   PulseLede — P90 quote page ("首字下沉金句 / Editorial Lede" archetype).
   A generic low-density EDITORIAL LEDE: one oversized statement set as a
   measured column, opened by a colossal drop-initial (首字下沉) in the accent,
   with an optional highlighted keyword and a source line over the spectrum
   rule. paper / dark / colour themes; left (with drop-initial) or centred.
   The reusable closing/breather page — distinct from the other quote pages by
   the magazine drop-cap device + flowing measure.

   Self-contained: React + the shared .pulse-lede / .pulse-* CSS. Text/data live
   in COPY (not prop-driven); structure & styling are prop-driven (see controls).

   To migrate into a bundler: delete the `window.PulseLede = …` line and
   `export default PulseLede; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy (text intentionally NOT prop-driven, per spec — edit here).
  const COPY = {
    eyebrow: "Editorial · 收束",
    sheet: "QUOTE · 90 / 90",
    lead: "当资本不再为故事付费，AI 公司必须用收入证明自己配得上这个价格。",
    hot: "用收入证明",
    source: "— 美国大额融资 AI 公司调研报告 · 结语",
    tag: "RE-ANCHORING VALUE",
  };

  const controls = [
    { key: "theme", type: "radio", label: "背景主题", default: "paper",
      options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }, { value: "color", label: "色块" }],
      description: "页面背景：纸色 / 深色 / 整页强调色块。" },
    { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[5], options: SPECTRUM,
      description: "「色块」主题下的整页背景色（其它主题忽略）。" },
    { key: "align", type: "radio", label: "对齐", default: "left",
      options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
      description: "金句对齐方式（左对齐时启用首字下沉）。" },
    { key: "showInitial", type: "toggle", label: "首字下沉", default: true,
      description: "句首的巨号下沉首字（仅左对齐生效）。" },
    { key: "emphasis", type: "toggle", label: "关键词强调", default: true,
      description: "用强调色高亮句中的关键词。" },
    { key: "showSource", type: "toggle", label: "来源署名", default: true,
      description: "金句下方的来源 / 署名行。" },
    { key: "showTag", type: "toggle", label: "主题标签", default: true,
      description: "顶部的一枚主题标签。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 首字 / 关键词强调色。" },
    { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
      description: "底部贯穿的色谱条带。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  // render text, optionally wrapping the hot phrase in an accent span.
  function renderText(text, hot, on, accent) {
    if (!on || !hot || text.indexOf(hot) < 0) return text;
    const i = text.indexOf(hot);
    return (
      <React.Fragment>
        {text.slice(0, i)}
        <span className="pulse-lede__hot" style={{ color: accent }}>{hot}</span>
        {text.slice(i + hot.length)}
      </React.Fragment>
    );
  }

  function PulseLede(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const isColor = p.theme === "color";
    const center = p.align === "center";
    const cls = "pulse-slide pulse-lede" +
      (p.theme === "dark" ? " pulse-lede--dark" : "") +
      (isColor ? " pulse-lede--color" : "") +
      (center ? " pulse-lede--center" : "");
    const style = { "--pulse-accent": accent };
    if (isColor) style.background = p.bgColor;

    const useInitial = p.showInitial && !center;
    const initial = COPY.lead.charAt(0);
    const rest = useInitial ? COPY.lead.slice(1) : COPY.lead;

    return (
      <div className={cls} style={style}>
        <header className="pulse-lede__head">
          {p.showTag && <div className="pulse-lede__tag" style={isColor ? null : { borderColor: accent, color: accent }}>{COPY.tag}</div>}
          {p.showSheetLabel && <div className="pulse-lede__sheet">{COPY.sheet}</div>}
        </header>

        <div className="pulse-lede__main">
          <div className="pulse-eyebrow pulse-lede__eyebrow" style={isColor ? null : { color: accent }}>{COPY.eyebrow}</div>
          <blockquote className="pulse-lede__quote">
            {useInitial && <span className="pulse-lede__initial" style={{ color: accent }}>{initial}</span>}
            {renderText(rest, COPY.hot, p.emphasis, accent)}
          </blockquote>
          {p.showSource && <div className="pulse-lede__source">{COPY.source}</div>}
        </div>

        {p.showColorBand && (
          <div className="pulse-lede__band" aria-hidden="true">
            {SPECTRUM.map((c, i) => <i key={i} style={{ background: c, flexGrow: [1.5,1,1,1,1,1.5,1][i] }} />)}
          </div>
        )}
      </div>
    );
  }

  PulseLede.controls = controls;
  PulseLede.defaults = defaults;

  if (typeof window !== "undefined") PulseLede.copyDefaults = COPY;
  PulseLede.defaults = { ...(PulseLede.defaults || {}), copy: COPY };
  window.PulseLede = PulseLede;
})();

const Component = window.PulseLede;
if (!Component) throw new Error('Missing theme05 component PulseLede');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;