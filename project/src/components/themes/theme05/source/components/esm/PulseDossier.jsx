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
   PulseDossier — P63 image page ("安全可靠模型 / Tagged Dossier" archetype).
   An image page styled as a "file / dossier": a themed card carrying a filing
   code, identity (EN + headline + sub + lead), a keyword-chip band and a metric
   ledger (label/value rows, one row emphasizable), beside an ADAPTIVE image
   gallery (0–n justified, ratio-aware, side swappable). With 0 images the card
   goes full-width and the ledger reflows into two columns. The reusable template
   for any profile page whose distinguishing element is "keyword tags + a tidy
   metric ledger" rather than oversized KPIs.

   Image slots are prop-driven (`images` + `onImageChange`); the image component
   is injected via `props.ImageFrame` (falls back to `window.PulseImageFrame` in
   the no-build preview). Everything else is by props.

   To migrate into a bundler: delete the `window.PulseDossier = …` line, write
   `export default PulseDossier; export { controls, defaults };`, and
   `import PulseImageFrame` (or pass it via `props.ImageFrame`).
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "TRUST DOSSIER",
    title: "安全可靠模型",
    sheet: "CASE · 63 / 80",
    filing: "FILE · A-02 · ENTERPRISE",
    en: "ANTHROPIC",
    zh: "企业级可信模型",
    sub: "安全与可靠的定位",
    lead: "优势不是更激进的叙事，而是更可信的企业采用 —— 安全、对齐与稳定本身构成壁垒。",
    tags: ["安全对齐", "长上下文", "企业采用", "可信交付"],
    ledger: [
      ["累计融资", "650+", "亿美元"],
      ["估值", "9650", "亿美元"],
      ["核心客户", "云 / 金融 / 专业服务", ""],
      ["关键能力", "安全 · 长上下文", ""],
    ],
    galleryCap: "案例主视觉",
    galleryUnit: "DROP IMAGES",
    conclusion: "可信度本身可以成为商业壁垒。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  const controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
      description: "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、明细转两列。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
      description: "图片相对主体卡的位置（有图片时生效）。" },
    { key: "tagCount", type: "slider", label: "标签数量", default: 3, min: 0, max: 4, step: 1,
      description: "关键词标签 chip 数量（0 隐藏整条）。" },
    { key: "metricCount", type: "slider", label: "明细行数", default: 4, min: 2, max: 4, step: 1,
      description: "主体卡内的指标明细行数。" },
    { key: "cardTheme", type: "radio", label: "主体卡主题", default: "dark",
      options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
      description: "主体卡背景：深色 / 强调色块 / 纸色。" },
    { key: "focusEnabled", type: "toggle", label: "重点明细", default: false,
      description: "是否突出某一条明细行。" },
    { key: "focusIndex", type: "slider", label: "重点行序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的明细行序号（从 1 起）。" },
    { key: "showLead", type: "toggle", label: "引导说明", default: true,
      description: "标题下方的一句引导说明。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[2], options: SPECTRUM,
      description: "眉标 /「色块」主题下主体卡的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseDossier(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = props.ImageFrame || (typeof window !== "undefined" && window.PulseImageFrame);

    const nTag = Math.max(0, Math.min(COPY.tags.length, p.tagCount));
    const tags = COPY.tags.slice(0, nTag);
    const nLedger = Math.max(2, Math.min(COPY.ledger.length, p.metricCount));
    const ledger = COPY.ledger.slice(0, nLedger);
    const focus = p.focusEnabled ? Math.min(p.focusIndex, nLedger) - 1 : -1;
    const nImg = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const hasGallery = nImg > 0 && Frame;

    // theme → card bg / fg / divider color
    let bg, fg, div;
    if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }
    else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
    else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }

    const cardCls = "pulse-dos__card" + (hasGallery ? "" : " pulse-dos__card--wide");
    const rowCls = "pulse-dos__row" + (hasGallery && p.imageSide === "left" ? " pulse-dos__row--rev" : "");

    return (
      <div className="pulse-slide pulse-dos" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-dos__body">
          <div className={rowCls}>
            <div className={cardCls} style={{ background: bg, color: fg, "--dos-div": div, flex: hasGallery ? "0 0 45%" : "1 1 auto" }}>
              <div className="pulse-dos__filing">{COPY.filing}<i /></div>
              <div className="pulse-dos__en">{COPY.en}</div>
              <div className="pulse-dos__zh">{COPY.zh}</div>
              <div className="pulse-dos__sub">{COPY.sub}</div>
              {p.showLead && <div className="pulse-dos__lead">{COPY.lead}</div>}
              {nTag > 0 && (
                <div className="pulse-dos__tags">
                  {tags.map((t, i) => <span className="pulse-dos__tag" key={i}>{t}</span>)}
                </div>
              )}
              <div className="pulse-dos__ledger">
                {ledger.map((m, i) => (
                  <div className={"pulse-dos__l" + (focus === i ? " pulse-dos__l--focus" : "")} key={i}>
                    <span className="pulse-dos__l-k">{m[0]}</span>
                    <span className="pulse-dos__l-v">{m[1]}{m[2] ? <small>{m[2]}</small> : null}</span>
                  </div>
                ))}
              </div>
            </div>

            {hasGallery && (
              <div className="pulse-dos__media">
                {p.showGalleryCaption && (
                  <div className="pulse-dos__media-cap">
                    <span className="pulse-label">{COPY.galleryCap}</span>
                    <span className="pulse-mono">{COPY.galleryUnit}</span>
                  </div>
                )}
                <div className="pulse-dos__media-row">
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

          {p.showConclusion && <div className="pulse-conclusion pulse-dos__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseDossier.controls = controls;
  PulseDossier.defaults = defaults;

  if (typeof window !== "undefined") PulseDossier.copyDefaults = COPY;
  PulseDossier.defaults = { ...(PulseDossier.defaults || {}), copy: COPY };
  window.PulseDossier = PulseDossier;
})();

const Component = window.PulseDossier;
if (!Component) throw new Error('Missing theme05 component PulseDossier');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;