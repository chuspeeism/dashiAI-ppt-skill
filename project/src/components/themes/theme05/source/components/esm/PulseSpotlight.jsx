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
   PulseSpotlight — P29 image-led page ("赛道聚焦 / Segment Spotlight" archetype).
   A generic segment hero: a colored identity block (eyebrow + title + lead +
   metric rail) beside a DOMINANT, ratio-aware image (0–n). With 0 images the
   text block goes full-width and the metric rail becomes a 2-column grid; the
   image / text sides are swappable. The reusable template for any "one segment,
   one big visual" page.
   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. See PulseSpotlight.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "ENTERPRISE SEARCH",
    en: "ENTERPRISE SEARCH",
    title: "知识入口机会",
    sub: "企业搜索赛道",
    sheet: "SEGMENT · 29 / 32",
    lead: "企业搜索是较早形成明确付费场景的应用方向；接入内部知识后具备高频使用场景。",
    metrics: [
      ["融资额", "38", "亿美元"],
      ["事件数", "9", "笔"],
      ["平均单笔", "4.2", "亿美元"],
      ["付费客户中位数", "620", "家"],
    ],
    mediaCap: "赛道主视觉",
    mediaUnit: "DROP IMAGE",
    conclusion: "企业知识入口是 AI 应用的重要落地点。",
  };

  function clampAR(v) { return Math.max(0.6, Math.min(1.9, v || 1.2)); }

  function PulseSpotlight(props) {
    const p = Object.assign({}, PulseSpotlight.defaults, props);
    const accent = p.accentColor;
    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const nImg = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const Frame = window.PulseImageFrame;
    const hasMedia = nImg > 0 && Frame;

    let bg, fg, div;
    if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
    else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
    else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.24)"; }

    return (
      <div className={"pulse-slide pulse-spot"} style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className={"pulse-spot__body" + (hasMedia && p.imageSide === "left" ? " pulse-spot__body--rev" : "")}>
          <div className={"pulse-spot__info" + (hasMedia ? "" : " pulse-spot__info--wide")}
            style={{ background: bg, color: fg, "--spot-div": div }}>
            <div className="pulse-spot__en">{COPY.en}</div>
            <div className="pulse-spot__zh">{COPY.title}</div>
            {p.showLead && <div className="pulse-spot__lead">{COPY.lead}</div>}
            <div className="pulse-spot__rail">
              {metrics.map((m, i) => {
                const focus = p.focusEnabled && i + 1 === p.focusIndex;
                return (
                  <div key={i} className={"pulse-spot__m" + (focus ? " pulse-spot__m--focus" : "")}>
                    <span className="pulse-spot__m-k">{m[0]}</span>
                    <span className="pulse-spot__m-v">{m[1]}<small>{m[2]}</small></span>
                  </div>
                );
              })}
            </div>
          </div>

          {hasMedia && (
            <div className="pulse-spot__media">
              {p.showMediaCaption && (
                <div className="pulse-spot__media-cap">
                  <span className="pulse-label">{COPY.mediaCap}</span>
                  <span className="pulse-mono">{COPY.mediaUnit}</span>
                </div>
              )}
              <div className="pulse-spot__media-row">
                {Array.from({ length: nImg }).map((_, i) => {
                  const im = images[i] || {};
                  const grow = clampAR(im.ar);
                  return (
                    <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                      <Frame
                        src={im.src || null}
                        ar={im.ar || null}
                        fill={true}
                        editable={p.editable !== false}
                        label={"IMG." + (i + 1)}
                        placeholder="拖入图片"
                        onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)}
                      />
                    </div>
                  );
                })}
              </div>
              {p.showConclusion && <div className="pulse-conclusion pulse-spot__concl">{COPY.conclusion}</div>}
            </div>
          )}
        </div>

        {!hasMedia && p.showConclusion && (
          <div className="pulse-conclusion" style={{ flex: "0 0 auto" }}>{COPY.conclusion}</div>
        )}
      </div>
    );
  }

  PulseSpotlight.controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
      description: "主视觉图片槽数量（0–2）；按比例自适应。为 0 时文本卡铺满整幅、指标转两列。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
      description: "图片相对文本卡的位置（仅在有图片时生效）。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "文本卡内的指标行数。" },
    { key: "cardTheme", type: "radio", label: "文本卡主题", default: "color",
      options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
      description: "文本卡背景：强调色块 / 深色 / 纸色。" },
    { key: "focusEnabled", type: "toggle", label: "重点指标", default: false,
      description: "是否突出某一条指标。" },
    { key: "focusIndex", type: "slider", label: "重点指标序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的指标序号（从 1 起）。" },
    { key: "showLead", type: "toggle", label: "引导文案", default: true,
      description: "标题下方的一段引导说明。" },
    { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[2], options: SPECTRUM,
      description: "眉标与「色块」主题下文本卡的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseSpotlight.defaults = PulseSpotlight.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseSpotlight.copyDefaults = COPY;
  PulseSpotlight.defaults = { ...(PulseSpotlight.defaults || {}), copy: COPY };
  window.PulseSpotlight = PulseSpotlight;
})();

const Component = window.PulseSpotlight;
if (!Component) throw new Error('Missing theme05 component PulseSpotlight');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;