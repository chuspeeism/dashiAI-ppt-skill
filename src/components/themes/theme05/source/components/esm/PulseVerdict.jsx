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
   PulseVerdict — P80 quote page ("最终判断 / Final Verdict" archetype).
   The deck's CLOSING punctuation: one oversized editorial verdict centred in a
   framed field, a "FINAL VERDICT" tag, an optional supporting line, an optional
   closing "完 / END" device, and a footer that book-ends the cover (wordmark +
   report reference). Distinct from the mid-deck statement page (PulseStatement)
   by its framed, back-matter framing and closing marker. Low density by design.

   Self-contained & migratable: depends only on React + the shared .pulse-vrd /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseVerdict.controls for the typed parameter list.

   To migrate into a bundler: delete the `window.PulseVerdict = …` line and
   `export default PulseVerdict; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy (text intentionally NOT prop-driven, per spec — edit here).
  const COPY = {
    kicker: "CLOSING · 收尾页",
    sheet: "VERDICT · 80 / 80",
    tag: "最终判断",
    tagEn: "FINAL VERDICT",
    // verdict rendered as JSX so key phrases can be emphasised
    quote: (
      <React.Fragment>
        融资盛宴之后，<br />
        <span className="hl">真正的竞争</span>才刚开始。
      </React.Fragment>
    ),
    quotePlain: (
      <React.Fragment>
        融资盛宴之后，<br />真正的竞争才刚开始。
      </React.Fragment>
    ),
    sub: "下一阶段比拼的不再是融资规模，而是把叙事兑现为收入的能力。",
    marker: "完",
    markerEn: "END",
    brand: "AICL",
    ref: "美国大额融资 AI 公司调研报告 · 2024",
  };

  const controls = [
    { key: "theme", type: "radio", label: "背景主题", default: "dark",
      options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }, { value: "color", label: "色块" }],
      description: "页面背景：纸色 / 深色 / 整页强调色块。" },
    { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[0], options: SPECTRUM,
      description: "「色块」主题下的整页背景色（其它主题忽略）。" },
    { key: "align", type: "radio", label: "对齐方式", default: "center",
      options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
      description: "金句与辅助信息的对齐方式。" },
    { key: "emphasis", type: "toggle", label: "重点词高亮", default: true,
      description: "是否用强调色高亮金句中的关键词。" },
    { key: "showTag", type: "toggle", label: "判断标签", default: true,
      description: "金句上方的「最终判断」标签。" },
    { key: "showSub", type: "toggle", label: "辅助说明", default: true,
      description: "金句下方的一行辅助说明文字。" },
    { key: "showMarker", type: "toggle", label: "收尾标记", default: true,
      description: "右下角的「完 / END」收尾装饰标记。" },
    { key: "showFooter", type: "toggle", label: "页脚署名", default: true,
      description: "底部品牌标识与报告署名（与封面呼应）。" },
    { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
      description: "页脚处的小色谱条带。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "标签 / 重点词 / 收尾标记的强调色。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseVerdict(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const isColor = p.theme === "color";
    const center = p.align === "center";
    const cls =
      "pulse-slide pulse-vrd" +
      (p.theme === "dark" ? " pulse-vrd--dark" : "") +
      (isColor ? " pulse-vrd--color" : "") +
      (center ? " pulse-vrd--center" : "");

    const style = { "--pulse-accent": accent };
    if (isColor) style.background = p.bgColor;

    return (
      <div className={cls} style={style}>
        <div className="pulse-vrd__top">
          <div className="pulse-vrd__kicker">{COPY.kicker}</div>
          {p.showSheetLabel && <div className="pulse-vrd__sheet">{COPY.sheet}</div>}
        </div>

        <div className="pulse-vrd__field">
          <div className="pulse-vrd__main">
            {p.showTag && (
              <div className="pulse-vrd__tag">
                <span className="pulse-vrd__tag-zh" style={{ background: isColor ? "#fff" : accent, color: isColor ? "var(--pulse-ink)" : "#fff" }}>{COPY.tag}</span>
                <span className="pulse-vrd__tag-en">{COPY.tagEn}</span>
              </div>
            )}
            <div className="pulse-vrd__quote">{p.emphasis ? COPY.quote : COPY.quotePlain}</div>
            {p.showSub && <div className="pulse-vrd__sub">{COPY.sub}</div>}
          </div>

          {p.showMarker && (
            <div className="pulse-vrd__marker" aria-hidden="true">
              <span className="pulse-vrd__marker-zh">{COPY.marker}</span>
              <span className="pulse-vrd__marker-en">{COPY.markerEn}</span>
            </div>
          )}
        </div>

        {(p.showFooter || p.showColorBand) && (
          <div className="pulse-vrd__foot">
            {p.showFooter ? (
              <div className="pulse-vrd__sign">
                <span className="pulse-vrd__brand">{COPY.brand}<sup>®</sup></span>
                <span className="pulse-vrd__ref">{COPY.ref}</span>
              </div>
            ) : <span />}
            {p.showColorBand && (
              <div className="pulse-vrd__band" aria-hidden="true">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  PulseVerdict.controls = controls;
  PulseVerdict.defaults = defaults;

  if (typeof window !== "undefined") PulseVerdict.copyDefaults = COPY;
  PulseVerdict.defaults = { ...(PulseVerdict.defaults || {}), copy: COPY };
  window.PulseVerdict = PulseVerdict;
})();

const Component = window.PulseVerdict;
if (!Component) throw new Error('Missing theme05 component PulseVerdict');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;