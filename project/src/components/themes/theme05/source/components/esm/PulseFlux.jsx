/* =========================================================================
   PulseFlux — P47 image-led page ("转化通道 / Conversion Flux" archetype).
   A generic two-pool CONVERSION page: a large source pool (big readout) flows
   through a labeled transfer band into a destination pool (big readout) — the
   distinguishing visual is the source→destination conversion, NOT bars/stages.
   It sits beside a ratio-aware image gallery (0–n justified slots); a headline
   metric pair sits under the lead. The reusable template for any "funnel-to /
   pipeline / community→revenue conversion + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + CSS.
   See PulseFlux.controls for the typed, documented parameter list.
   `export default PulseFlux; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';
import PulseImageFrame from './PulseImageFrame.jsx';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "OPEN-SOURCE MODELS",
  title: "社区影响力变现",
  sheet: "IMAGE · 47 / 80",
  lead: "开源模型公司通过社区影响力、托管服务和企业支持变现。",
  metrics: [
    ["融资额", "28", "亿美元"],
    ["事件数", "7", "笔"],
  ],
  fluxCap: "影响力变现路径",
  fluxUnit: "COMMUNITY → REVENUE",
  transfer: "托管服务 · 企业支持",
  source: { en: "COMMUNITY", zh: "开源社区", num: "2.8", unit: "亿次", cap: "社区下载量" },
  dest:   { en: "ENTERPRISE", zh: "企业服务", num: "37", unit: "%", cap: "企业服务收入占比" },
  galleryCap: "场景图示",
  galleryUnit: "DROP IMAGES",
  conclusion: "开源是入口，不是完整商业模式。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "图片槽数量（0–3）；按各图比例自适应。为 0 时转化通道铺满整幅。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
    description: "图片相对转化通道的位置（有图片时生效）。" },
  { key: "showTransfer", type: "toggle", label: "转化连接带", default: true,
    description: "两个池之间的转化连接带与说明。" },
  { key: "emphasize", type: "radio", label: "强调端", default: "dest",
    options: [{ value: "source", label: "源头" }, { value: "dest", label: "终点" }],
    description: "用强调色着重的一端（源头社区 / 终点企业）。" },
  { key: "showMetrics", type: "toggle", label: "指标对", default: true,
    description: "引导文案右侧的一对关键指标。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "标题下方的一段引导说明。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[6], options: SPECTRUM,
    description: "眉标 / 指标 / 强调端的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseFlux(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;

  const srcAccent = p.emphasize === "source";
  const pool = (d, isAccent) => (
    <div className="pulse-flux__pool"
      style={{ background: isAccent ? accent : "var(--pulse-dark)", color: "#fff" }}>
      <div className="pulse-flux__pool-head">
        <span className="pulse-flux__pool-en">{d.en}</span>
        <span className="pulse-flux__pool-zh">{d.zh}</span>
      </div>
      <div className="pulse-flux__pool-num">{d.num}<small>{d.unit}</small></div>
      <div className="pulse-flux__pool-cap">{d.cap}</div>
    </div>
  );

  const fluxBlock = (
    <div className={"pulse-flux__flux" + (hasMedia ? "" : " pulse-flux__flux--wide")}>
      <div className="pulse-flux__cap">
        <span className="pulse-label">{COPY.fluxCap}</span>
        <span className="pulse-mono">{COPY.fluxUnit}</span>
      </div>
      <div className="pulse-flux__channel">
        {pool(COPY.source, srcAccent)}
        {p.showTransfer && (
          <div className="pulse-flux__transfer">
            <div className="pulse-flux__arrow" />
            <div className="pulse-flux__transfer-lab">{COPY.transfer}</div>
          </div>
        )}
        {pool(COPY.dest, !srcAccent)}
      </div>
    </div>
  );

  const media = hasMedia && (
    <div className="pulse-flux__media">
      {p.showGalleryCaption && (
        <div className="pulse-flux__media-cap">
          <span className="pulse-label">{COPY.galleryCap}</span>
          <span className="pulse-mono">{COPY.galleryUnit}</span>
        </div>
      )}
      <div className="pulse-flux__media-row">
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
    <div className="pulse-slide pulse-flux" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-flux__body">
        {(p.showLead || p.showMetrics) && (
          <div className="pulse-flux__lead-row">
            {p.showLead && <div className="pulse-flux__lead">{COPY.lead}</div>}
            {p.showMetrics && (
              <div className="pulse-flux__metrics">
                {COPY.metrics.map((m, i) => (
                  <div className="pulse-flux__hm" key={i}>
                    <span className="pulse-flux__hm-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                    <span className="pulse-flux__hm-k">{m[0]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={"pulse-flux__row" + (hasMedia && p.imageSide === "left" ? " pulse-flux__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{fluxBlock}{media}</React.Fragment> : fluxBlock}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-flux__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseFlux.controls = controls;
PulseFlux.defaults = defaults;
export default PulseFlux;
export { controls };
export { defaults };
