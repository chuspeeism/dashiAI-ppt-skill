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
   PulsePath — P43 image-led page ("路径流程图 / Journey Path" archetype).
   A generic staged-journey page: a numbered vertical PATH of N nodes (with a
   connecting rail + a focus node) beside a dominant, ratio-aware image gallery
   (0–n justified slots — wide images take more width, balanced at any count).
   A full-width scene-split band of colored value cards runs below; a headline
   metric pair sits under the lead. Image / path sides are swappable; with 0
   images the path goes full-width. The reusable template for any "process /
   journey / pathway + supporting imagery + scene split" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + CSS.
   See PulsePath.controls for the typed, documented parameter list.

   To migrate into a bundler: delete the `window.PulsePath = …` line and
   `export default PulsePath; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "EDUCATION AI",
    title: "个性化学习与教师工具",
    sheet: "IMAGE · 43 / 80",
    lead: "教育 AI 从通用答疑转向个性化辅导和教师工作台。",
    metrics: [
      ["融资额", "14", "亿美元"],
      ["事件数", "5", "笔"],
    ],
    pathCap: "学习路径",
    pathUnit: "LEARNING PATH",
    stages: [
      { en: "Q&A",      zh: "通用答疑",   d: "标准化问答与作业批改" },
      { en: "ADAPTIVE", zh: "个性化辅导", d: "按能力分层的自适应练习" },
      { en: "PLANNING", zh: "路径规划",   d: "学习目标与节奏编排" },
      { en: "TEACHER",  zh: "教师工作台", d: "备课、评估与学情看板" },
    ],
    galleryCap: "场景图示",
    galleryUnit: "DROP IMAGES",
    sceneCap: "场景拆分",
    sceneUnit: "BY SCENE",
    scenes: [
      { en: "K12",        zh: "K12 辅导", v: "6", unit: "亿美元", c: SPECTRUM[3] },
      { en: "ENTERPRISE", zh: "企业培训", v: "5", unit: "亿美元", c: SPECTRUM[1] },
      { en: "TEACHER",    zh: "教师工具", v: "3", unit: "亿美元", c: SPECTRUM[5] },
    ],
    conclusion: "教育 AI 需要用结果证明价值。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  const controls = [
    { key: "nodeCount", type: "slider", label: "路径节点数", default: 4, min: 2, max: 4, step: 1,
      description: "学习路径的阶段（节点）数量。" },
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
      description: "图片槽数量（0–3）；按各图比例自适应排布。为 0 时路径铺满整幅。" },
    { key: "imageSide", type: "radio", label: "图片位置", default: "right",
      options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
      description: "图片相对路径的位置（有图片时生效）。" },
    { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
      description: "是否突出某一路径节点。" },
    { key: "focusIndex", type: "slider", label: "重点节点序号", default: 2, min: 1, max: 4, step: 1,
      description: "被突出的节点序号（从 1 起）。" },
    { key: "sceneCount", type: "slider", label: "场景卡数量", default: 3, min: 2, max: 3, step: 1,
      description: "底部场景拆分带的卡片数量。" },
    { key: "showScenes", type: "toggle", label: "场景拆分带", default: true,
      description: "底部全宽的场景拆分带。" },
    { key: "showLead", type: "toggle", label: "引导文案", default: true,
      description: "标题下方的一段引导说明。" },
    { key: "showMetrics", type: "toggle", label: "指标对", default: true,
      description: "引导文案右侧的一对关键指标。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
      description: "眉标 / 重点节点 / 指标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulsePath(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const Frame = (typeof window !== "undefined" && window.PulseImageFrame) || props.ImageFrame;

    const nNode = Math.max(2, Math.min(COPY.stages.length, p.nodeCount));
    const stages = COPY.stages.slice(0, nNode);
    const focusN = Math.min(p.focusIndex, nNode);

    const nImg = Math.max(0, Math.min(3, p.imageCount));
    const images = p.images || [];
    const hasMedia = nImg > 0 && Frame;

    const nScene = Math.max(2, Math.min(COPY.scenes.length, p.sceneCount));
    const scenes = COPY.scenes.slice(0, nScene);

    const pathBlock = (
      <div className={"pulse-path__path" + (hasMedia ? "" : " pulse-path__path--wide")}>
        <div className="pulse-path__cap">
          <span className="pulse-label">{COPY.pathCap}</span>
          <span className="pulse-mono">{COPY.pathUnit}</span>
        </div>
        <div className="pulse-path__steps">
          {stages.map((s, i) => {
            const focus = p.focusEnabled && i + 1 === focusN;
            return (
              <div key={i} className={"pulse-path__step" + (focus ? " pulse-path__step--focus" : "")}>
                <div className="pulse-path__rail">
                  <div className="pulse-path__line pulse-path__line--top" />
                  <div className="pulse-path__node" style={focus ? { background: accent, color: "#fff", borderColor: accent } : undefined}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="pulse-path__line pulse-path__line--bot" />
                </div>
                <div className="pulse-path__step-body">
                  <div className="pulse-path__step-zh">{s.zh}</div>
                  <div className="pulse-path__step-en">{s.en}</div>
                  <div className="pulse-path__step-d">{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    const media = hasMedia && (
      <div className="pulse-path__media">
        {p.showGalleryCaption && (
          <div className="pulse-path__media-cap">
            <span className="pulse-label">{COPY.galleryCap}</span>
            <span className="pulse-mono">{COPY.galleryUnit}</span>
          </div>
        )}
        <div className="pulse-path__media-row">
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
      <div className="pulse-slide pulse-path" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-path__body">
          {(p.showLead || p.showMetrics) && (
            <div className="pulse-path__lead-row">
              {p.showLead && <div className="pulse-path__lead">{COPY.lead}</div>}
              {p.showMetrics && (
                <div className="pulse-path__metrics">
                  {COPY.metrics.map((m, i) => (
                    <div className="pulse-path__hm" key={i}>
                      <span className="pulse-path__hm-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                      <span className="pulse-path__hm-k">{m[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={"pulse-path__row" + (hasMedia && p.imageSide === "left" ? " pulse-path__row--rev" : "")}>
            {hasMedia ? <React.Fragment>{pathBlock}{media}</React.Fragment> : pathBlock}
          </div>

          {p.showScenes && (
            <div className="pulse-path__scenes">
              <div className="pulse-path__scenes-cap">
                <span className="pulse-label">{COPY.sceneCap}</span>
                <span className="pulse-mono">{COPY.sceneUnit}</span>
              </div>
              <div className="pulse-path__scene-row">
                {scenes.map((s, i) => (
                  <div key={i} className="pulse-path__scene" style={{ background: s.c }}>
                    <div className="pulse-path__scene-zh">{s.zh}</div>
                    <div className="pulse-path__scene-en">{s.en}</div>
                    <div className="pulse-path__scene-v">{s.v}<small>{s.unit}</small></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {p.showConclusion && <div className="pulse-conclusion pulse-path__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulsePath.controls = controls;
  PulsePath.defaults = defaults;

  if (typeof window !== "undefined") PulsePath.copyDefaults = COPY;
  PulsePath.defaults = { ...(PulsePath.defaults || {}), copy: COPY };
  window.PulsePath = PulsePath;
})();

const Component = window.PulsePath;
if (!Component) throw new Error('Missing theme05 component PulsePath');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;