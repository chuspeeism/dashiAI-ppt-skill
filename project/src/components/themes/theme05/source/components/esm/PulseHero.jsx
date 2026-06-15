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
   PulseHero — P46 big-number page with image ("大数字主视觉 / Headline Stat + Image").
   A generic headline-statistic page: one oversized number (+ unit) with caption,
   supporting message and 0–n auxiliary metric chips, beside a ratio-aware image
   gallery (0–n justified slots). Number side / image side swappable; with 0
   images the stat block goes full-width. The reusable template for any single
   "hero KPI + supporting evidence + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + CSS.
   See PulseHero.controls for the typed, documented parameter list.

   To migrate into a bundler: delete the `window.PulseHero = …` line and
   `export default PulseHero; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "LOW-CODE AI",
    title: "企业流程嵌入",
    sheet: "BIG NUMBER · 46 / 80",
    number: "118",
    unit: "%",
    caption: "净收入留存 · NRR",
    message: "低代码 AI 平台帮助企业把模型能力嵌入内部流程。",
    aux: [
      ["融资额", "19", "亿美元"],
      ["事件数", "6", "笔"],
      ["企业客户中位数", "430", "家"],
    ],
    galleryCap: "平台图示",
    galleryUnit: "DROP IMAGES",
    conclusion: "能被业务团队使用的平台更容易扩散。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }

  const controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
      description: "图片槽数量（0–2）；按各图比例自适应。为 0 时主数字块铺满整幅。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
      description: "图片相对主数字块的位置（有图片时生效）。" },
    { key: "auxCount", type: "slider", label: "辅助指标数", default: 3, min: 0, max: 3, step: 1,
      description: "主数字下方的支撑指标数量（0 隐藏整行）。" },
    { key: "showUnit", type: "toggle", label: "数字单位", default: true,
      description: "主数字后的单位后缀。" },
    { key: "showCaption", type: "toggle", label: "数字说明", default: true,
      description: "主数字下方的解释说明。" },
    { key: "showMessage", type: "toggle", label: "支撑文案", default: true,
      description: "说明下方的一段支撑性文案。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
      description: "主数字 / 眉标 / 辅助指标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseHero(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = (typeof window !== "undefined" && window.PulseImageFrame) || props.ImageFrame;

    const nAux = Math.max(0, Math.min(COPY.aux.length, p.auxCount));
    const aux = COPY.aux.slice(0, nAux);

    const nImg = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const hasMedia = nImg > 0 && Frame;

    const statBlock = (
      <div className={"pulse-hero__stat" + (hasMedia ? "" : " pulse-hero__stat--wide")}>
        <div className="pulse-hero__num" style={{ color: accent }}>
          {COPY.number}{p.showUnit && <span className="pulse-hero__unit">{COPY.unit}</span>}
        </div>
        {p.showCaption && <div className="pulse-hero__caption">{COPY.caption}</div>}
        {p.showMessage && <div className="pulse-hero__message">{COPY.message}</div>}
        {nAux > 0 && (
          <div className="pulse-hero__aux">
            {aux.map((m, i) => (
              <div className="pulse-hero__aux-m" key={i}>
                <span className="pulse-hero__aux-v">{m[1]}<small>{m[2]}</small></span>
                <span className="pulse-hero__aux-k">{m[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const media = hasMedia && (
      <div className="pulse-hero__media">
        {p.showGalleryCaption && (
          <div className="pulse-hero__media-cap">
            <span className="pulse-label">{COPY.galleryCap}</span>
            <span className="pulse-mono">{COPY.galleryUnit}</span>
          </div>
        )}
        <div className="pulse-hero__media-row">
          {Array.from({ length: nImg }).map((_, i) => {
            const im = images[i] || {};
            const grow = clampAR(im.ar);
            return (
              <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                <Frame src={im.src || null} ar={im.ar || null} fill={true}
                  editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入图片"
                  onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="pulse-slide pulse-hero" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-hero__body">
          <div className={"pulse-hero__row" + (hasMedia && p.imageSide === "left" ? " pulse-hero__row--rev" : "")}>
            {hasMedia ? <React.Fragment>{statBlock}{media}</React.Fragment> : statBlock}
          </div>
          {p.showConclusion && <div className="pulse-conclusion pulse-hero__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseHero.controls = controls;
  PulseHero.defaults = defaults;

  if (typeof window !== "undefined") PulseHero.copyDefaults = COPY;
  PulseHero.defaults = { ...(PulseHero.defaults || {}), copy: COPY };
  window.PulseHero = PulseHero;
})();

const Component = window.PulseHero;
if (!Component) throw new Error('Missing theme05 component PulseHero');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;