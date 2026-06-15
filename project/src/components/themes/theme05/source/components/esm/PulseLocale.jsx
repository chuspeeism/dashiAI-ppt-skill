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
   PulseLocale — P58 image-led page ("云计算人才外溢 / Geo Mosaic Locator" archetype).
   A generic place-locator page whose distinguishing visual is a MOSAIC MAP GRID:
   an N×M cell grid (stylized territory) with deterministic tinted "peer" cells and
   one marked cluster cell, paired with a top metric rail, theme tag chips and a
   ratio-aware image gallery (0–n justified slots). Mosaic / image sides are
   swappable; with 0 images the mosaic goes full-width with a side legend. The
   reusable template for any "locate one place/segment on a field + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-loc / .pulse-* CSS. Text/data live in COPY (not prop-driven).

   To migrate into a bundler: delete the `window.PulseLocale = …` line and
   `export default PulseLocale; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "SEATTLE CLUSTER",
    title: "云计算人才外溢",
    sheet: "IMAGE · 58 / 80",
    marker: "SEATTLE",
    locale: "西雅图集群",
    lead: "西雅图受益于云计算生态和大厂工程人才外溢，更适合孕育基础设施、开发者工具和企业 AI。",
    tags: ["云基础设施", "开发者工具", "企业 AI", "工程人才"],
    metrics: [
      ["融资额", "95", "亿美元"],
      ["市场占比", "9.8", "%"],
      ["事件数", "10", "笔"],
      ["平均单笔", "9.5", "亿美元"],
    ],
    mediaCap: "云生态场景",
    mediaUnit: "DROP IMAGE",
    mosaicCap: "区域定位",
    mosaicUnit: "TERRITORY MAP",
    conclusion: "云计算底座带来 AI 基础设施机会。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }
  // Deterministic peer-cell scatter (stable across renders).
  function peerCells(total, count, markerIdx) {
    const out = []; let s = 9301;
    for (let i = 0; i < total * 8 && out.length < count; i++) {
      s = (s * 9301 + 49297) % 233280;
      const idx = Math.floor((s / 233280) * total);
      if (idx !== markerIdx && out.indexOf(idx) < 0) out.push(idx);
    }
    return out;
  }

  const controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
      description: "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时定位图铺满整幅并显示侧栏图例。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "left",
      options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
      description: "图片相对定位图的位置（有图片时生效）。" },
    { key: "mosaicCols", type: "slider", label: "网格列数", default: 7, min: 5, max: 9, step: 1,
      description: "定位图的网格列数。" },
    { key: "mosaicRows", type: "slider", label: "网格行数", default: 4, min: 3, max: 6, step: 1,
      description: "定位图的网格行数。" },
    { key: "markerIndex", type: "slider", label: "定位格序号", default: 4, min: 1, max: 54, step: 1,
      description: "被标记为本集群的网格单元序号（按行优先，自动收敛到网格范围内）。" },
    { key: "showPeers", type: "toggle", label: "邻近区域", default: true,
      description: "网格内装饰性的邻近区域 tinted 单元。" },
    { key: "peerCount", type: "slider", label: "邻近区域数", default: 6, min: 0, max: 10, step: 1,
      description: "邻近区域 tinted 单元的数量。" },
    { key: "metricCount", type: "slider", label: "指标项数", default: 4, min: 2, max: 4, step: 1,
      description: "顶部指标条的指标数量。" },
    { key: "tagCount", type: "slider", label: "标签数量", default: 4, min: 0, max: 4, step: 1,
      description: "主题标签 chip 数量（0 隐藏整行）。" },
    { key: "showLead", type: "toggle", label: "引导文案", default: true,
      description: "标题下方的一段引导说明。" },
    { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
      description: "眉标 / 定位格 / 指标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseLocale(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = (typeof window !== "undefined" && window.PulseImageFrame) || props.ImageFrame;

    const cols = Math.max(5, Math.min(9, p.mosaicCols));
    const rows = Math.max(3, Math.min(6, p.mosaicRows));
    const total = cols * rows;
    const markerIdx = Math.min(p.markerIndex, total) - 1;
    const peers = p.showPeers ? peerCells(total, Math.min(p.peerCount, total - 1), markerIdx) : [];
    const peerTints = [SPECTRUM[5], SPECTRUM[3], SPECTRUM[1], SPECTRUM[0], SPECTRUM[6], SPECTRUM[2]];

    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const nTag = Math.max(0, Math.min(COPY.tags.length, p.tagCount));
    const tags = COPY.tags.slice(0, nTag);

    const nImg = Math.max(0, Math.min(3, p.imageCount));
    const images = p.images || [];
    const hasMedia = nImg > 0 && Frame;

    const mosaic = (
      <div className={"pulse-loc__mosaic" + (hasMedia ? "" : " pulse-loc__mosaic--wide")}>
        <div className="pulse-loc__map-cap">
          <span className="pulse-label">{COPY.mosaicCap}</span>
          <span className="pulse-mono">{COPY.mosaicUnit}</span>
        </div>
        <div className="pulse-loc__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: total }).map((_, i) => {
            if (i === markerIdx) {
              return (
                <div key={i} className="pulse-loc__cell pulse-loc__cell--marker" style={{ background: accent }}>
                  <span className="pulse-loc__pin" />
                  <span className="pulse-loc__marker-lab">{COPY.marker}</span>
                </div>
              );
            }
            const pj = peers.indexOf(i);
            const tint = pj >= 0 ? peerTints[pj % peerTints.length] : null;
            return (
              <div key={i} className={"pulse-loc__cell" + (tint ? " pulse-loc__cell--peer" : "")}
                style={tint ? { background: tint } : null} />
            );
          })}
        </div>
        {nTag > 0 && (
          <div className="pulse-loc__tags">
            {tags.map((t, i) => <span key={i} className="pulse-loc__tag" style={{ borderColor: accent }}>{t}</span>)}
          </div>
        )}
      </div>
    );

    const media = hasMedia && (
      <div className="pulse-loc__media">
        {p.showMediaCaption && (
          <div className="pulse-loc__media-cap">
            <span className="pulse-label">{COPY.mediaCap}</span>
            <span className="pulse-mono">{COPY.mediaUnit}</span>
          </div>
        )}
        <div className="pulse-loc__media-row">
          {Array.from({ length: nImg }).map((_, i) => {
            const im = images[i] || {};
            const grow = clampAR(im.ar);
            return (
              <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                <Frame src={im.src || null} ar={im.ar || null} fill={true}
                  editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入生态场景图"
                  onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="pulse-slide pulse-loc" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-loc__body">
          <div className="pulse-loc__top">
            <div className="pulse-loc__lead-wrap">
              <div className="pulse-loc__locale">{COPY.locale}</div>
              {p.showLead && <div className="pulse-loc__lead">{COPY.lead}</div>}
            </div>
            <div className="pulse-loc__rail">
              {metrics.map((m, i) => (
                <div key={i} className="pulse-loc__r">
                  <span className="pulse-loc__r-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                  <span className="pulse-loc__r-k">{m[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={"pulse-loc__row" + (hasMedia && p.imageSide === "right" ? " pulse-loc__row--rev" : "")}>
            {hasMedia ? <React.Fragment>{media}{mosaic}</React.Fragment> : mosaic}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-loc__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseLocale.controls = controls;
  PulseLocale.defaults = defaults;

  if (typeof window !== "undefined") PulseLocale.copyDefaults = COPY;
  PulseLocale.defaults = { ...(PulseLocale.defaults || {}), copy: COPY };
  window.PulseLocale = PulseLocale;
})();

const Component = window.PulseLocale;
if (!Component) throw new Error('Missing theme05 component PulseLocale');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;