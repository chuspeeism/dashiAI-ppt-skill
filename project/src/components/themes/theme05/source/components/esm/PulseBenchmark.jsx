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
   PulseBenchmark — P62 image page ("商业化标杆 / Benchmark Case" archetype).
   An image-led case profile: a themed identity card (EN + headline + sub + lead
   + oversized KPI rows + optional corner badge) beside an ADAPTIVE image gallery
   (0–n justified, ratio-aware slots, side swappable). With 0 images the card
   goes full-width and the KPIs reflow into two columns, so composition stays
   balanced at any slot count. The reusable template for any flagship-case page
   that leads with one hero visual and a few oversized headline metrics.

   Image slots are prop-driven (`images` + `onImageChange`); the image component
   is injected via `props.ImageFrame` (falls back to `window.PulseImageFrame` in
   the no-build preview). Everything else is by props.

   To migrate into a bundler: delete the `window.PulseBenchmark = …` line, write
   `export default PulseBenchmark; export { controls, defaults };`, and
   `import PulseImageFrame` (or pass it via `props.ImageFrame`).
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "BENCHMARK CASE",
    title: "商业化标杆",
    sheet: "CASE · 62 / 80",
    en: "OPENAI",
    zh: "通用大模型样本",
    sub: "OpenAI 案例",
    lead: "模型能力、生态入口与企业商业化能否同时领先，是衡量这一阶段标杆的核心标尺。",
    badge: "BENCHMARK",
    kpis: [
      ["最大单笔融资", "66", "亿美元"],
      ["企业客户", "9.4", "万家"],
      ["年度化收入", "38", "亿美元"],
      ["赛道", "通用大模型", ""],
    ],
    galleryCap: "案例主视觉",
    galleryUnit: "DROP IMAGES",
    conclusion: "模型能力必须转成生态和收入。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  const controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
      description: "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
      description: "图片相对主体卡的位置（有图片时生效）。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 3, min: 2, max: 4, step: 1,
      description: "主体卡内的大号指标行数。" },
    { key: "cardTheme", type: "radio", label: "主体卡主题", default: "color",
      options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
      description: "主体卡背景：强调色块 / 深色 / 纸色。" },
    { key: "showBadge", type: "toggle", label: "角标", default: true,
      description: "主体卡右上角的标杆角标。" },
    { key: "showLead", type: "toggle", label: "引导说明", default: true,
      description: "标题下方的一句引导说明。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
      description: "眉标 / 角标 /「色块」主题下主体卡的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseBenchmark(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = props.ImageFrame || (typeof window !== "undefined" && window.PulseImageFrame);

    const nKpi = Math.max(2, Math.min(COPY.kpis.length, p.metricCount));
    const kpis = COPY.kpis.slice(0, nKpi);
    const nImg = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const hasGallery = nImg > 0 && Frame;

    // theme → card bg / fg / divider color
    let bg, fg, div;
    if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
    else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
    else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }

    const cardCls = "pulse-bench__card" + (hasGallery ? "" : " pulse-bench__card--wide");
    const rowCls = "pulse-bench__row" + (hasGallery && p.imageSide === "left" ? " pulse-bench__row--rev" : "");

    return (
      <div className="pulse-slide pulse-bench" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-bench__body">
          <div className={rowCls}>
            <div className={cardCls} style={{ background: bg, color: fg, "--bench-div": div, flex: hasGallery ? "0 0 47%" : "1 1 auto" }}>
              {p.showBadge && <div className="pulse-bench__badge"><i />{COPY.badge}</div>}
              <div className="pulse-bench__en">{COPY.en}</div>
              <div className="pulse-bench__zh">{COPY.zh}</div>
              <div className="pulse-bench__sub">{COPY.sub}</div>
              {p.showLead && <div className="pulse-bench__lead">{COPY.lead}</div>}
              <div className="pulse-bench__kpis">
                {kpis.map((m, i) => (
                  <div className="pulse-bench__k" key={i}>
                    <span className="pulse-bench__k-k">{m[0]}</span>
                    <span className="pulse-bench__k-v">{m[1]}{m[2] ? <small>{m[2]}</small> : null}</span>
                  </div>
                ))}
              </div>
            </div>

            {hasGallery && (
              <div className="pulse-bench__media">
                {p.showGalleryCaption && (
                  <div className="pulse-bench__media-cap">
                    <span className="pulse-label">{COPY.galleryCap}</span>
                    <span className="pulse-mono">{COPY.galleryUnit}</span>
                  </div>
                )}
                <div className="pulse-bench__media-row">
                  {Array.from({ length: nImg }).map((_, i) => {
                    const im = images[i] || {};
                    const grow = clampAR(im.ar);
                    return (
                      <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                        <Frame src={im.src || null} ar={im.ar || null} fill={true}
                          editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入案例图片"
                          onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-bench__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseBenchmark.controls = controls;
  PulseBenchmark.defaults = defaults;

  if (typeof window !== "undefined") PulseBenchmark.copyDefaults = COPY;
  PulseBenchmark.defaults = { ...(PulseBenchmark.defaults || {}), copy: COPY };
  window.PulseBenchmark = PulseBenchmark;
})();

const Component = window.PulseBenchmark;
if (!Component) throw new Error('Missing theme05 component PulseBenchmark');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;