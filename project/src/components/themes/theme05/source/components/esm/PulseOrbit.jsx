/* =========================================================================
   PulseOrbit — P55 image-led page ("GPU 资源链条 / Ecosystem Ring" archetype).
   A generic ecosystem/orbit diagram: one central hub with N satellite nodes
   placed evenly around it (each sized by its value), wired by radial spokes over
   concentric orbit rings — paired with a ratio-aware image gallery (0–n justified
   slots). Orbit / image sides are swappable; with 0 images the orbit goes
   full-width with a side legend. Geometry is computed inside the component, so it
   stays balanced at any node count. The reusable template for any "hub-and-spoke
   ecosystem / platform + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-orb / .pulse-* CSS. Text/data live in COPY (not prop-driven).
   `export default PulseOrbit; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "NVIDIA ECOSYSTEM",
  title: "GPU 资源链条",
  sheet: "IMAGE · 55 / 80",
  lead: "NVIDIA 生态内融资围绕 GPU、网络、集群运维和推理优化展开。",
  hub: { en: "GPU", zh: "算力核心" },
  nodes: [
    { en: "GPU CLOUD",    zh: "GPU 云",   v: 64, c: SPECTRUM[3] },
    { en: "CLUSTER OPS",  zh: "集群管理", v: 12, c: SPECTRUM[5] },
    { en: "INFERENCE",    zh: "推理优化", v: 9,  c: SPECTRUM[1] },
    { en: "INTERCONNECT", zh: "芯片互联", v: 7,  c: SPECTRUM[0] },
  ],
  mediaCap: "GPU 生态",
  mediaUnit: "DROP IMAGE",
  conclusion: "算力供给能力正在变成融资能力。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }

const controls = [
  { key: "nodeCount", type: "slider", label: "卫星节点数", default: 4, min: 2, max: 4, step: 1,
    description: "围绕核心的生态节点数量（2–4）。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时环图铺满整幅并显示侧栏图例。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对环图的位置（有图片时生效）。" },
  { key: "showSpokes", type: "toggle", label: "连接轨道", default: true,
    description: "核心到各节点的放射连线与同心轨道环。" },
  { key: "showValue", type: "toggle", label: "节点数值", default: true,
    description: "各节点内的数值标注（节点尺寸已按数值缩放）。" },
  { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
    description: "是否突出某一个节点（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点节点序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的节点序号（从 1 起）。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
    description: "眉标 / 核心 / 重点节点的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseOrbit(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const n = Math.max(2, Math.min(COPY.nodes.length, p.nodeCount));
  const nodes = COPY.nodes.slice(0, n);
  const focusN = Math.min(p.focusIndex, n);
  const maxV = Math.max.apply(null, nodes.map((d) => d.v));

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;

  // ---- Geometry (percent units inside a square plot) ----
  const CX = 50, CY = 50, RAD = 33;     // satellites sit on this radius
  const placed = nodes.map((d, i) => {
    const ang = (-90 + i * (360 / n)) * Math.PI / 180;
    const x = CX + RAD * Math.cos(ang);
    const y = CY + RAD * Math.sin(ang);
    const size = 13 + 9 * Math.sqrt(d.v / maxV);   // % diameter
    return Object.assign({}, d, { x, y, size });
  });

  const orbit = (
    <div className={"pulse-orb__plot" + (hasMedia ? "" : " pulse-orb__plot--wide")}>
      <div className="pulse-orb__stage">
        {p.showSpokes && (
          <svg className="pulse-orb__wire" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r={RAD} className="pulse-orb__ring" />
            <circle cx="50" cy="50" r={RAD * 0.5} className="pulse-orb__ring pulse-orb__ring--inner" />
            {placed.map((d, i) => (
              <line key={i} x1="50" y1="50" x2={d.x} y2={d.y}
                className={"pulse-orb__spoke" + (p.focusEnabled && i + 1 === focusN ? " pulse-orb__spoke--focus" : "")} />
            ))}
          </svg>
        )}
        {placed.map((d, i) => {
          const isFocus = p.focusEnabled && i + 1 === focusN;
          const dim = p.focusEnabled && !isFocus;
          return (
            <div key={i}
              className={"pulse-orb__node" + (isFocus ? " pulse-orb__node--focus" : "") + (dim ? " pulse-orb__node--dim" : "")}
              style={{ left: d.x + "%", top: d.y + "%", width: d.size + "%", height: d.size + "%", background: d.c }}>
              {p.showValue && <span className="pulse-orb__node-v">{d.v}</span>}
              <span className="pulse-orb__node-zh">{d.zh}</span>
            </div>
          );
        })}
        <div className="pulse-orb__hub" style={{ borderColor: accent }}>
          <span className="pulse-orb__hub-en" style={{ color: accent }}>{COPY.hub.en}</span>
          <span className="pulse-orb__hub-zh">{COPY.hub.zh}</span>
        </div>
      </div>
      {!hasMedia && (
        <div className="pulse-orb__legend">
          {placed.map((d, i) => (
            <div key={i} className={"pulse-orb__leg" + (p.focusEnabled && i + 1 === focusN ? " pulse-orb__leg--focus" : "")}>
              <span className="pulse-orb__leg-dot" style={{ background: d.c }} />
              <span className="pulse-orb__leg-zh">{d.zh}</span>
              <span className="pulse-orb__leg-en">{d.en}</span>
              <span className="pulse-orb__leg-v">{d.v}<small>亿</small></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const media = hasMedia && (
    <div className="pulse-orb__media">
      {p.showMediaCaption && (
        <div className="pulse-orb__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-orb__media-row">
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
    <div className="pulse-slide pulse-orb" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-orb__body">
        <div className="pulse-orb__lead">{COPY.lead}</div>
        <div className={"pulse-orb__row" + (hasMedia && p.imageSide === "left" ? " pulse-orb__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{orbit}{media}</React.Fragment> : orbit}
        </div>
        {p.showConclusion && <div className="pulse-conclusion pulse-orb__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseOrbit.controls = controls;
PulseOrbit.defaults = defaults;
export default PulseOrbit;
export { controls };
export { defaults };
