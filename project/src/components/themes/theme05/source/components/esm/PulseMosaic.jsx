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
   PulseMosaic — P86 image page ("代表企业影像 / Editorial Mosaic" archetype).
   A generic IMAGE-LED editorial spread: an identity column (eyebrow, display
   word, lead, tag chips, caption) beside a justified image mosaic of 0–n
   ratio-aware slots. The first slot can be weighted as a hero so a lead image
   anchors the composition; every slot grows ∝ its image aspect ratio, so the
   row stays balanced at any count and any proportions. With 0 images the
   identity column goes full-width and a spectrum placeholder mosaic fills the
   media side. The reusable template for any "subject portrait / contact-sheet"
   page where photography leads.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-mos / .pulse-* CSS. Text/data live in COPY (not prop-driven).

   To migrate into a bundler: delete the `window.PulseMosaic = …` line and
   `export default PulseMosaic; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "Visual Field Notes",
    title: "代表企业影像",
    sheet: "IMAGE · 86 / 86",
    display: "97",
    displayCap: "笔大额事件 · 影像档案",
    lead: "用一组现场影像收束报告 —— 实验室、数据中心、路演与产品现场，构成 2024 美国 AI 资本最直观的注脚。",
    tags: ["大模型", "算力集群", "机器人", "医疗 AI"],
    mediaCap: "影像档案",
    mediaUnit: "DROP IMAGE",
    conclusion: "数字之外，是一群正在把资本变成产品的人。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }

  const controls = [
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 3, min: 0, max: 5, step: 1,
      description: "图片槽数量（0–5），按各图比例自适应均衡排布。为 0 时身份列铺满整幅、媒体侧转为色谱占位。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
      description: "图片区相对身份列的位置（有图片时生效）。" },
    { key: "heroWeight", type: "toggle", label: "首图主图", default: true,
      description: "首张图片额外加宽，作为视觉主图锚定构图。" },
    { key: "showDisplay", type: "toggle", label: "巨号字标", default: true,
      description: "身份列的巨号数字字标与说明。" },
    { key: "showIndex", type: "toggle", label: "图片编号", default: true,
      description: "各图角上的序号标签。" },
    { key: "tagCount", type: "slider", label: "标签数量", default: 4, min: 0, max: 4, step: 1,
      description: "主题标签 chip 数量（0 隐藏整行）。" },
    { key: "showLead", type: "toggle", label: "引导文案", default: true,
      description: "标题下方的一段引导说明。" },
    { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 巨号字标 / 强调条的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseMosaic(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = (typeof window !== "undefined" && window.PulseImageFrame) || props.ImageFrame;

    const nImg = Math.max(0, Math.min(5, p.imageCount));
    const images = p.images || [];
    const hasMedia = nImg > 0 && Frame;

    const nTag = Math.max(0, Math.min(COPY.tags.length, p.tagCount));
    const tags = COPY.tags.slice(0, nTag);

    // split slots into up to two justified rows for a true mosaic when dense.
    const rows = nImg <= 3 ? [range(0, nImg)] : [range(0, Math.ceil(nImg / 2)), range(Math.ceil(nImg / 2), nImg)];

    const identity = (
      <div className={"pulse-mos__id" + (hasMedia ? "" : " pulse-mos__id--wide")}>
        <div className="pulse-mos__id-top">
          {p.showDisplay && (
            <div className="pulse-mos__display">
              <span className="pulse-mos__display-n" style={{ color: accent }}>{COPY.display}</span>
              <span className="pulse-mos__display-c">{COPY.displayCap}</span>
            </div>
          )}
          {p.showLead && <div className="pulse-mos__lead">{COPY.lead}</div>}
        </div>
        {nTag > 0 && (
          <div className="pulse-mos__tags">
            {tags.map((t, i) => <span key={i} className="pulse-mos__tag" style={{ borderColor: accent }}>{t}</span>)}
          </div>
        )}
      </div>
    );

    const media = hasMedia ? (
      <div className="pulse-mos__media">
        {p.showMediaCaption && (
          <div className="pulse-mos__media-cap">
            <span className="pulse-label">{COPY.mediaCap}</span>
            <span className="pulse-mono">{nImg} {COPY.mediaUnit}</span>
          </div>
        )}
        <div className="pulse-mos__grid">
          {rows.map((row, ri) => (
            <div key={ri} className="pulse-mos__row">
              {row.map((i) => {
                const im = images[i] || {};
                let grow = clampAR(im.ar);
                if (p.heroWeight && i === 0) grow *= 1.6;
                return (
                  <div key={i} className="pulse-mos__cell" style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                    <Frame src={im.src || null} ar={im.ar || null} fill={true}
                      editable={p.editable !== false} label={p.showIndex ? "0" + (i + 1) : ""}
                      placeholder="拖入影像" onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="pulse-mos__media pulse-mos__media--empty">
        <div className="pulse-mos__placeholder">
          {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
          <span className="pulse-mono pulse-mos__ph-cap">SET 图片槽数量 ≥ 1 · 拖入影像</span>
        </div>
      </div>
    );

    return (
      <div className="pulse-slide pulse-mos" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-mos__body">
          <div className={"pulse-mos__row-main" + (hasMedia && p.imageSide === "left" ? " pulse-mos__row-main--rev" : "")}>
            {hasMedia || nImg === 0 ? (
              p.imageSide === "left" && hasMedia
                ? <React.Fragment>{media}{identity}</React.Fragment>
                : <React.Fragment>{identity}{media}</React.Fragment>
            ) : identity}
          </div>
          {p.showConclusion && <div className="pulse-conclusion pulse-mos__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  function range(a, b) { const r = []; for (let i = a; i < b; i++) r.push(i); return r; }

  PulseMosaic.controls = controls;
  PulseMosaic.defaults = defaults;

  if (typeof window !== "undefined") PulseMosaic.copyDefaults = COPY;
  PulseMosaic.defaults = { ...(PulseMosaic.defaults || {}), copy: COPY };
  window.PulseMosaic = PulseMosaic;
})();

const Component = window.PulseMosaic;
if (!Component) throw new Error('Missing theme05 component PulseMosaic');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;