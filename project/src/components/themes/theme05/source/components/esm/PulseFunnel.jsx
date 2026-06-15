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
   PulseFunnel — P45 image-led page ("增长漏斗 / Growth Funnel" archetype).
   A generic FUNNEL chart: N tapered tiers whose width encodes a value (real
   clip-path trapezoids that connect tier-to-tier into a funnel silhouette),
   beside a ratio-aware image gallery (0–n justified slots). A headline metric
   pair sits under the lead; a focus tier can be outlined. The reusable template
   for any "funnel / narrowing stages / conversion ladder + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + CSS.
   See PulseFunnel.controls for the typed, documented parameter list.

   To migrate into a bundler: delete the `window.PulseFunnel = …` line and
   `export default PulseFunnel; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "SALES & MARKETING AI",
    title: "增长效率工具",
    sheet: "IMAGE · 45 / 80",
    lead: "销售与营销 AI 集中在线索评分、自动外呼、邮件和广告创意。",
    metrics: [
      ["融资额", "24", "亿美元"],
      ["事件数", "10", "笔"],
    ],
    funnelCap: "增长漏斗",
    funnelUnit: "GROWTH FUNNEL",
    tiers: [
      { en: "REACH",   zh: "广告创意", v: 8, c: SPECTRUM[2] },
      { en: "LEAD",    zh: "线索评分", v: 7, c: SPECTRUM[0] },
      { en: "OUTREACH",zh: "自动外呼", v: 6, c: SPECTRUM[5] },
      { en: "CONVERT", zh: "转化成交", v: 4, c: SPECTRUM[3] },
    ],
    galleryCap: "场景图示",
    galleryUnit: "DROP IMAGES",
    conclusion: "营销 AI 要用转化率证明自己。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  const controls = [
    { key: "tierCount", type: "slider", label: "漏斗层数", default: 4, min: 2, max: 4, step: 1,
      description: "漏斗的层级（阶段）数量。" },
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
      description: "图片槽数量（0–3）；按各图比例自适应。为 0 时漏斗铺满整幅。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
      description: "图片相对漏斗的位置（有图片时生效）。" },
    { key: "focusEnabled", type: "toggle", label: "重点层", default: false,
      description: "是否突出某一漏斗层（其余淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点层序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的漏斗层序号（从 1 起）。" },
    { key: "showValue", type: "toggle", label: "层数值", default: true,
      description: "各层右侧的数值标注。" },
    { key: "showMetrics", type: "toggle", label: "指标对", default: true,
      description: "引导文案右侧的一对关键指标。" },
    { key: "showLead", type: "toggle", label: "引导文案", default: true,
      description: "标题下方的一段引导说明。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[1], options: SPECTRUM,
      description: "眉标 / 指标 / 重点层的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseFunnel(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = (typeof window !== "undefined" && window.PulseImageFrame) || props.ImageFrame;

    const nTier = Math.max(2, Math.min(COPY.tiers.length, p.tierCount));
    const tiers = COPY.tiers.slice(0, nTier);
    const maxV = Math.max.apply(null, tiers.map((t) => t.v));
    const focusN = Math.min(p.focusIndex, nTier);

    const nImg = Math.max(0, Math.min(3, p.imageCount));
    const images = p.images || [];
    const hasMedia = nImg > 0 && Frame;

    // width% of each tier (40–100 by value), tapered into the next tier.
    const widths = tiers.map((t) => 40 + (t.v / maxV) * 60);

    const funnelBlock = (
      <div className={"pulse-fun__funnel" + (hasMedia ? "" : " pulse-fun__funnel--wide")}>
        <div className="pulse-fun__cap">
          <span className="pulse-label">{COPY.funnelCap}</span>
          <span className="pulse-mono">{COPY.funnelUnit}</span>
        </div>
        <div className="pulse-fun__tiers">
          {tiers.map((t, i) => {
            const w = widths[i];
            const nextW = i < nTier - 1 ? widths[i + 1] : w * 0.66;
            const r = nextW / w;                 // bottom width ratio
            const inset = ((1 - r) / 2) * 100;    // each-side inset %
            const focus = p.focusEnabled && i + 1 === focusN;
            const dim = p.focusEnabled && !focus;
            return (
              <div key={i} className="pulse-fun__tier-row">
                <div className="pulse-fun__tier"
                  style={{ width: w + "%", background: t.c, opacity: dim ? 0.34 : 1,
                    clipPath: `polygon(0 0, 100% 0, ${100 - inset}% 100%, ${inset}% 100%)`,
                    boxShadow: focus ? "inset 0 0 0 5px var(--pulse-ink)" : "none" }}>
                  <span className="pulse-fun__tier-zh">{t.zh}</span>
                  <span className="pulse-fun__tier-en">{t.en}</span>
                  {p.showValue && <span className="pulse-fun__tier-v">{t.v}<small>亿美元</small></span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    const media = hasMedia && (
      <div className="pulse-fun__media">
        {p.showGalleryCaption && (
          <div className="pulse-fun__media-cap">
            <span className="pulse-label">{COPY.galleryCap}</span>
            <span className="pulse-mono">{COPY.galleryUnit}</span>
          </div>
        )}
        <div className="pulse-fun__media-row">
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
      <div className="pulse-slide pulse-fun" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-fun__body">
          {(p.showLead || p.showMetrics) && (
            <div className="pulse-fun__lead-row">
              {p.showLead && <div className="pulse-fun__lead">{COPY.lead}</div>}
              {p.showMetrics && (
                <div className="pulse-fun__metrics">
                  {COPY.metrics.map((m, i) => (
                    <div className="pulse-fun__hm" key={i}>
                      <span className="pulse-fun__hm-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                      <span className="pulse-fun__hm-k">{m[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={"pulse-fun__row" + (hasMedia && p.imageSide === "left" ? " pulse-fun__row--rev" : "")}>
            {hasMedia ? <React.Fragment>{funnelBlock}{media}</React.Fragment> : funnelBlock}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-fun__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseFunnel.controls = controls;
  PulseFunnel.defaults = defaults;

  if (typeof window !== "undefined") PulseFunnel.copyDefaults = COPY;
  PulseFunnel.defaults = { ...(PulseFunnel.defaults || {}), copy: COPY };
  window.PulseFunnel = PulseFunnel;
})();

const Component = window.PulseFunnel;
if (!Component) throw new Error('Missing theme05 component PulseFunnel');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;