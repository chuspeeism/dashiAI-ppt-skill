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
  if (isTheme05ReactElementLike(base)) {
    if (typeof override === 'string' || typeof override === 'number') return String(override);
    if (isTheme05ReactElementLike(override)) return theme05ElementText(override);
    return base;
  }
  if (!base || typeof base !== 'object') return override ?? base;
  if (override == null || typeof override !== 'object') return base;
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
  if (!base || copy == null) return map;
  if (isTheme05ReactElementLike(base) && (typeof copy === 'string' || typeof copy === 'number')) {
    const from = theme05ElementText(base).replace(/ /g, ' ');
    const to = String(copy);
    if (from && to !== from) map.set(from, to);
    return map;
  }
  if (typeof base === 'string' || typeof base === 'number') {
    const from = String(base).replace(/ /g, ' ');
    if (typeof copy !== 'string' && typeof copy !== 'number') return map;
    const to = String(copy);
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
    return replacements.get(String(node).replace(/ /g, ' ')) ?? node;
  }
  if (Array.isArray(node)) return node.map(child => replaceTheme05Text(child, replacements));
  if (!React.isValidElement(node)) return node;
  const elementText = theme05ElementText(node).replace(/ /g, ' ');
  if (replacements.has(elementText)) return replacements.get(elementText);
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

function isTheme05ReactElementLike(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (React.isValidElement(value)) return true;
  if (!value.props || typeof value.props !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(value, 'type')
    || Object.prototype.hasOwnProperty.call(value, 'ref')
    || Object.prototype.hasOwnProperty.call(value, 'key')
    || Object.prototype.hasOwnProperty.call(value, '_owner')
    || Object.prototype.hasOwnProperty.call(value, '_store');
}

function theme05ElementText(value) {
  if (value == null || value === false) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(theme05ElementText).join('');
  if (!value || typeof value !== 'object') return '';
  if (String(value.type || '').toLowerCase() === 'br') return '\n';
  if (isTheme05ReactElementLike(value)) return theme05ElementText(value.props?.children);
  return '';
}

/* =========================================================================
   PulseQuote — P14 quote page ("金句结论页 / Quote").
   A generic single-statement slide: one big quote as the focal point, an
   optional row of N supporting conclusion points, and an optional source
   footer. Switchable light / dark theme and left / center alignment.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseQuote.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy (text intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "CONCLUSION",
    sheet: "CONCLUSION · 14 / 32",
    // quote rendered as JSX so key phrases can be emphasised
    quote: (
      <React.Fragment>
        资本下一阶段，将从<span className="mute">赌叙事</span>，<br />
        转向<span className="hl">看兑现</span>。
      </React.Fragment>
    ),
    sub: "三条核心结论",
    points: [
      { n: "01", t: "头部集中", d: "资金高度向头部公司集中，赢家通吃格局确立。" },
      { n: "02", t: "兑现为王", d: "估值锚从叙事转向收入、毛利与客户留存。" },
      { n: "03", t: "底座确定", d: "算力与数据基础设施最接近企业刚性预算。" },
    ],
    source: "数据口径：2024 全年 · 单笔 ≥1 亿美元 · 样本 97 笔",
  };

  function PulseQuote(props) {
    const p = Object.assign({}, PulseQuote.defaults, props);
    const accent = p.accentColor;
    const dark = p.theme === "dark";
    const center = p.quoteAlign === "center";
    const nPts = Math.max(0, Math.min(COPY.points.length, p.conclusionCount));
    const pts = COPY.points.slice(0, nPts);

    return (
      <div
        className={"pulse-slide pulse-quote" + (dark ? " pulse-quote--dark" : "")}
        style={{ "--pulse-accent": accent }}
      >
        <div className="pulse-quote__top">
          <div className="pulse-eyebrow pulse-quote__eyebrow">{COPY.eyebrow}</div>
          {p.showSheetLabel && <div className="pulse-quote__sheet">{COPY.sheet}</div>}
        </div>

        <div className={"pulse-quote__main" + (center ? " pulse-quote__main--center" : "")}>
          {p.showQuoteMark && <span className="pulse-quote__mark">“</span>}
          <div className="pulse-quote__big">{COPY.quote}</div>
          <div className="pulse-quote__sub">{COPY.sub}</div>
        </div>

        {nPts > 0 && (
          <div className="pulse-quote__points">
            {pts.map((pt, i) => (
              <div className="pulse-quote__point" key={i}>
                <div className="pulse-quote__point-n">{pt.n}</div>
                <div className="pulse-quote__point-t">{pt.t}</div>
                <div className="pulse-quote__point-d">{pt.d}</div>
              </div>
            ))}
          </div>
        )}

        {(p.showSource || p.showColorBand) && (
          <div className="pulse-quote__foot">
            {p.showSource ? (
              <div className="pulse-quote__source">{COPY.source}</div>
            ) : <span />}
            {p.showColorBand && (
              <div className="pulse-quote__band" aria-hidden="true">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  PulseQuote.controls = [
    { key: "theme", type: "radio", label: "背景主题", default: "paper",
      options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }],
      description: "页面整体明 / 暗背景。" },
    { key: "quoteAlign", type: "radio", label: "金句对齐", default: "left",
      options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
      description: "金句的对齐方式。" },
    { key: "conclusionCount", type: "slider", label: "结论点数量", default: 3, min: 0, max: 3, step: 1,
      description: "金句下方的支撑结论点数量（0 隐藏）。" },
    { key: "showQuoteMark", type: "toggle", label: "引号装饰", default: true,
      description: "金句上方的大号装饰引号。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标、引号与金句重点词的强调色。" },
    { key: "showSource", type: "toggle", label: "数据来源", default: true,
      description: "底部的数据口径 / 来源说明。" },
    { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
      description: "右下角的小色谱条带。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseQuote.defaults = PulseQuote.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseQuote.copyDefaults = COPY;
  PulseQuote.defaults = { ...(PulseQuote.defaults || {}), copy: COPY };
  window.PulseQuote = PulseQuote;
})();

const Component = window.PulseQuote;
if (!Component) throw new Error('Missing theme05 component PulseQuote');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;