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
   PulseNexus — P64 image page ("实时数据生态 / Ecosystem Nexus" archetype).
   An image page whose distinguishing element is a full-width "nexus" band: a hub
   block (the entity) with SVG spokes fanning out to N labelled ecosystem nodes
   (one emphasizable). Above the band, a themed identity card (+ a metric pair)
   sits beside an ADAPTIVE image gallery (0–n justified, ratio-aware, side
   swappable); with 0 images the card goes full-width. The reusable template for
   any "entity + its connected ecosystem + hero visual" page (distinct from the
   value-scaled radial Orbit page: here the point is the connections themselves).

   Image slots are prop-driven (`images` + `onImageChange`); the image component
   is injected via `props.ImageFrame` (falls back to `window.PulseImageFrame` in
   the no-build preview). Everything else is by props. Spoke geometry is computed
   deterministically from node positions, so it stays aligned at any node count.

   To migrate into a bundler: delete the `window.PulseNexus = …` line, write
   `export default PulseNexus; export { controls, defaults };`, and
   `import PulseImageFrame` (or pass it via `props.ImageFrame`).
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "ECOSYSTEM NEXUS",
    title: "实时数据生态",
    sheet: "CASE · 64 / 80",
    en: "XAI",
    zh: "实时数据差异化",
    sub: "xAI 案例",
    lead: "核心资产不是模型本身，而是实时数据与生态流量 —— 独特的数据入口构成模型差异化。",
    metrics: [
      ["单笔融资", "50", "亿美元"],
      ["估值", "500", "亿美元"],
    ],
    galleryCap: "案例主视觉",
    galleryUnit: "DROP IMAGES",
    netCap: "生态连接",
    netUnit: "DATA + ECOSYSTEM",
    hubEn: "XAI",
    hubZh: "实时数据内核",
    hubNote: "以实时数据与马斯克生态为差异化中枢",
    nodes: [
      { zh: "X 平台",   en: "DATA GATEWAY",  role: "数据入口", c: SPECTRUM[0] },
      { zh: "特斯拉",   en: "FLEET SIGNALS", role: "协同",     c: SPECTRUM[5] },
      { zh: "多模态",   en: "MULTIMODAL",    role: "能力",     c: SPECTRUM[3] },
      { zh: "实时搜索", en: "LIVE SEARCH",   role: "场景",     c: SPECTRUM[4] },
    ],
    conclusion: "独特数据入口可以成为模型差异化。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  const controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
      description: "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
      description: "图片相对主体卡的位置（有图片时生效）。" },
    { key: "nodeCount", type: "slider", label: "生态节点数", default: 4, min: 2, max: 4, step: 1,
      description: "连接带中围绕中枢的生态节点数量。" },
    { key: "showSpokes", type: "toggle", label: "连接连线", default: true,
      description: "中枢到各节点的放射连线。" },
    { key: "focusEnabled", type: "toggle", label: "重点节点", default: false,
      description: "是否突出某一节点（其余淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点节点序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的节点序号（从 1 起）。" },
    { key: "metricCount", type: "slider", label: "指标数量", default: 2, min: 1, max: 2, step: 1,
      description: "主体卡内的关键指标对数量。" },
    { key: "cardTheme", type: "radio", label: "主体卡主题", default: "color",
      options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
      description: "主体卡背景：强调色块 / 深色 / 纸色。" },
    { key: "showLead", type: "toggle", label: "引导说明", default: true,
      description: "标题下方的一句引导说明。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
      description: "眉标 / 重点节点 /「色块」主题下主体卡的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseNexus(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = props.ImageFrame || (typeof window !== "undefined" && window.PulseImageFrame);

    const nNode = Math.max(2, Math.min(COPY.nodes.length, p.nodeCount));
    const nodes = COPY.nodes.slice(0, nNode);
    const focus = p.focusEnabled ? Math.min(p.focusIndex, nNode) - 1 : -1;

    const nMetric = Math.max(1, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);

    const nImg = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const hasGallery = nImg > 0 && Frame;

    // theme → card bg / fg / divider color
    let bg, fg;
    if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; }
    else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; }
    else { bg = accent; fg = "#fff"; }

    const cardCls = "pulse-nex__card" + (hasGallery ? "" : " pulse-nex__card--wide");
    const rowCls = "pulse-nex__row" + (hasGallery && p.imageSide === "left" ? " pulse-nex__row--rev" : "");

    // Spoke geometry: hub right-anchor (x=30) → each node's left dot (x≈42).
    const HUB_X = 30, NODE_X = 42;
    const spokes = nodes.map((_, i) => ({ y: ((i + 0.5) / nNode) * 100, i }));

    return (
      <div className="pulse-slide pulse-nex" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-nex__body">
          <div className={rowCls}>
            <div className={cardCls} style={{ background: bg, color: fg, flex: hasGallery ? "0 0 42%" : "1 1 auto" }}>
              <div className="pulse-nex__en">{COPY.en}</div>
              <div className="pulse-nex__zh">{COPY.zh}</div>
              <div className="pulse-nex__sub">{COPY.sub}</div>
              {p.showLead && <div className="pulse-nex__lead">{COPY.lead}</div>}
              <div className="pulse-nex__metrics">
                {metrics.map((m, i) => (
                  <div className="pulse-nex__met" key={i}>
                    <span className="pulse-nex__met-v">{m[1]}<small>{m[2]}</small></span>
                    <span className="pulse-nex__met-k">{m[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {hasGallery && (
              <div className="pulse-nex__media">
                {p.showGalleryCaption && (
                  <div className="pulse-nex__media-cap">
                    <span className="pulse-label">{COPY.galleryCap}</span>
                    <span className="pulse-mono">{COPY.galleryUnit}</span>
                  </div>
                )}
                <div className="pulse-nex__media-row">
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

          <div className="pulse-nex__net">
            <div className="pulse-nex__net-cap">
              <span className="pulse-label">{COPY.netCap}</span>
              <span className="pulse-mono">{COPY.netUnit}</span>
            </div>
            <div className="pulse-nex__net-row">
              {p.showSpokes && (
                <svg className="pulse-nex__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {spokes.map((s) => {
                    const isFocus = focus === s.i;
                    const dim = focus >= 0 && !isFocus;
                    return (
                      <line key={s.i} x1={HUB_X} y1="50" x2={NODE_X} y2={s.y}
                        stroke={isFocus ? accent : "var(--pulse-ink)"}
                        strokeWidth={isFocus ? 3.5 : 2}
                        strokeOpacity={dim ? 0.18 : isFocus ? 1 : 0.4}
                        vectorEffect="non-scaling-stroke" />
                    );
                  })}
                </svg>
              )}
              <div className="pulse-nex__hub" style={{ background: "var(--pulse-dark)" }}>
                <div className="pulse-nex__hub-en">{COPY.hubEn}</div>
                <div className="pulse-nex__hub-zh">{COPY.hubZh}</div>
                <div className="pulse-nex__hub-note">{COPY.hubNote}</div>
              </div>
              <div className="pulse-nex__spacer" />
              <div className="pulse-nex__nodes">
                {nodes.map((n, i) => {
                  const isFocus = focus === i;
                  const dim = focus >= 0 && !isFocus;
                  return (
                    <div key={i}
                      className={"pulse-nex__node" + (isFocus ? " pulse-nex__node--focus" : "") + (dim ? " pulse-nex__node--dim" : "")}
                      style={isFocus ? { background: accent } : null}>
                      <span className="pulse-nex__node-dot" style={{ background: isFocus ? "#fff" : n.c }} />
                      <span className="pulse-nex__node-body">
                        <span className="pulse-nex__node-zh">{n.zh}</span>
                        <span className="pulse-nex__node-en">{n.en}</span>
                      </span>
                      <span className="pulse-nex__node-role">{n.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-nex__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseNexus.controls = controls;
  PulseNexus.defaults = defaults;

  if (typeof window !== "undefined") PulseNexus.copyDefaults = COPY;
  PulseNexus.defaults = { ...(PulseNexus.defaults || {}), copy: COPY };
  window.PulseNexus = PulseNexus;
})();

const Component = window.PulseNexus;
if (!Component) throw new Error('Missing theme05 component PulseNexus');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;