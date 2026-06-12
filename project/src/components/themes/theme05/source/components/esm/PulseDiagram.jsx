/* =========================================================================
   PulseDiagram — P35 image-led page ("主视觉图示 + 规格卡 / Diagram + Spec").
   A generic "dominant uploaded visual + metric spec card" archetype: a
   dominant, ratio-aware image area (0–n justified slots — e.g. an architecture
   diagram) beside a metric spec card (color / dark / paper). Image / card sides
   are swappable; with 0 images the card goes full-width (two-column metrics) so
   the composition stays balanced at any slot count. The reusable template for
   any "one diagram, one spec card" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + PulseImageFrame + .pulse-diag / .pulse-* CSS.
   See PulseDiagram.controls for the typed, documented parameter list.
   `export default PulseDiagram` instead (import PulseImageFrame as a module).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "VECTOR DATABASE",
  title: "RAG 基础组件",
  sheet: "DIAGRAM · 35 / 80",
  en: "VECTOR DATABASE",
  zh: "RAG 基础组件",
  lead: "向量数据库从概念热度，进入企业部署的竞争阶段。",
  metrics: [
    ["融资额", "18", "亿美元"],
    ["事件数", "5", "笔"],
    ["平均单笔", "3.6", "亿美元"],
    ["付费客户中位数", "620", "家"],
  ],
  mediaCap: "RAG 架构图",
  mediaUnit: "DROP DIAGRAM",
  conclusion: "基础组件的胜负，取决于企业级可靠性。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.9, v || 1.4)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
    description: "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时规格卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "left",
    options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
    description: "图片相对规格卡的位置（有图片时生效）。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "规格卡内的指标行数。" },
  { key: "cardTheme", type: "radio", label: "规格卡主题", default: "dark",
    options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
    description: "规格卡背景：强调色块 / 深色 / 纸色。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "标题下方的一段引导说明。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
    description: "眉标 / 卡内强调条 /「色块」主题下规格卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseDiagram(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const metrics = COPY.metrics.slice(0, nMetric);
  const nImg = Math.max(0, Math.min(2, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasMedia = nImg > 0 && Frame;

  let bg, fg, div;
  if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.24)"; }

  const media = hasMedia && (
    <div className="pulse-diag__media">
      {p.showMediaCaption && (
        <div className="pulse-diag__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-diag__media-row">
        {Array.from({ length: nImg }).map((_, i) => {
          const im = images[i] || {};
          const grow = clampAR(im.ar);
          return (
            <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
              <Frame src={im.src || null} ar={im.ar || null} fill={true}
                editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入架构图"
                onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  const card = (
    <div className={"pulse-diag__card" + (hasMedia ? "" : " pulse-diag__card--wide")}
      style={{ background: bg, color: fg, "--diag-div": div, flex: hasMedia ? "1 1 0" : "1 1 auto" }}>
      <div className="pulse-diag__bar" style={{ color: p.cardTheme === "color" ? "#fff" : accent }} />
      <div className="pulse-diag__en">{COPY.en}</div>
      <div className="pulse-diag__zh">{COPY.zh}</div>
      {p.showLead && <div className="pulse-diag__lead">{COPY.lead}</div>}
      <div className="pulse-diag__metrics">
        {metrics.map((m, i) => (
          <div className="pulse-diag__m" key={i}>
            <span className="pulse-diag__m-k">{m[0]}</span>
            <span className="pulse-diag__m-v">{m[1]}<small>{m[2]}</small></span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-diag" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-diag__body">
        <div className={"pulse-diag__row" + (hasMedia && p.imageSide === "right" ? " pulse-diag__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{media}{card}</React.Fragment> : card}
        </div>
        {p.showConclusion && <div className="pulse-conclusion pulse-diag__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseDiagram.controls = controls;
PulseDiagram.defaults = defaults;
export default PulseDiagram;
export { controls };
export { defaults };
