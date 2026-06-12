/* =========================================================================
   PulseShowcase — P39 image-led page ("图像主视觉 + 应用分布 / Showcase").
   A generic image-dominant page: a large, ratio-aware hero image (0–n
   justified slots) beside a colored identity card (eyebrow + title + metric
   spec), with a FULL-WIDTH application-distribution band below — a single 100%
   segmented bar (part-to-whole) with a labeled legend. Image / card sides are
   swappable; with 0 images the card goes full-width (two-column metrics) so
   composition stays balanced at any slot count. The reusable template for any
   "one segment, dominant visual, + scene/application split" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + PulseImageFrame + .pulse-show / .pulse-* CSS.
   See PulseShowcase.controls for the typed, documented parameter list.
   `export default PulseShowcase` instead (import PulseImageFrame as a module;
   the component also accepts an injected `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "EMBODIED AI",
  title: "从软件走向物理世界",
  en: "EMBODIED AI",
  zh: "机器人与具身智能",
  sheet: "IMAGE · 39 / 80",
  lead: "具身智能成为 AI 从软件能力延伸到物理场景的重要方向。",
  metrics: [
    ["融资额", "41", "亿美元"],
    ["事件数", "7", "笔"],
    ["平均单笔", "5.9", "亿美元"],
    ["人形机器人占比", "51", "%"],
  ],
  mediaCap: "机器人场景",
  mediaUnit: "DROP IMAGE",
  distCap: "应用分布",
  distUnit: "BY APPLICATION",
  dist: [
    { k: "人形机器人", v: 21, c: SPECTRUM[0] },
    { k: "工业自动化", v: 11, c: SPECTRUM[5] },
    { k: "仓储机器人", v: 9,  c: SPECTRUM[3] },
  ],
  conclusion: "长周期赛道需要看供应链和量产能力。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.9, v || 1.4)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
    description: "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时身份卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "left",
    options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
    description: "图片相对身份卡的位置（有图片时生效）。" },
  { key: "cardTheme", type: "radio", label: "身份卡主题", default: "color",
    options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
    description: "身份卡背景：强调色块 / 深色 / 纸色。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 3, min: 2, max: 4, step: 1,
    description: "身份卡内的指标行数。" },
  { key: "distCount", type: "slider", label: "分布项数", default: 3, min: 2, max: 3, step: 1,
    description: "底部应用分布带的分项数量。" },
  { key: "showDistribution", type: "toggle", label: "应用分布带", default: true,
    description: "底部全宽的应用分布带（单条 100% 分段 + 图例）。" },
  { key: "focusEnabled", type: "toggle", label: "重点分布项", default: false,
    description: "是否突出某一分布分项（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点分布序号", default: 1, min: 1, max: 3, step: 1,
    description: "被突出的分布分项序号（从 1 起）。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "标题下方的一段引导说明。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 /「色块」主题身份卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseShowcase(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const metrics = COPY.metrics.slice(0, nMetric);
  const nImg = Math.max(0, Math.min(2, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasMedia = nImg > 0 && Frame;

  const nDist = Math.max(2, Math.min(COPY.dist.length, p.distCount));
  const dist = COPY.dist.slice(0, nDist);
  const distTotal = dist.reduce((s, d) => s + d.v, 0);
  const focusN = Math.min(p.focusIndex, nDist);

  let bg, fg, div;
  if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.24)"; }

  const media = hasMedia && (
    <div className="pulse-show__media">
      {p.showMediaCaption && (
        <div className="pulse-show__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-show__media-row">
        {Array.from({ length: nImg }).map((_, i) => {
          const im = images[i] || {};
          const grow = clampAR(im.ar);
          return (
            <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
              <Frame src={im.src || null} ar={im.ar || null} fill={true}
                editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入场景图"
                onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  const card = (
    <div className={"pulse-show__card" + (hasMedia ? "" : " pulse-show__card--wide")}
      style={{ background: bg, color: fg, "--show-div": div, flex: hasMedia ? "0 0 38%" : "1 1 auto" }}>
      <div className="pulse-show__bar" style={{ color: p.cardTheme === "color" ? "#fff" : accent }} />
      <div className="pulse-show__en">{COPY.en}</div>
      <div className="pulse-show__zh">{COPY.zh}</div>
      {p.showLead && <div className="pulse-show__lead">{COPY.lead}</div>}
      <div className="pulse-show__metrics">
        {metrics.map((m, i) => (
          <div className="pulse-show__m" key={i}>
            <span className="pulse-show__m-k">{m[0]}</span>
            <span className="pulse-show__m-v">{m[1]}<small>{m[2]}</small></span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-show" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-show__body">
        <div className={"pulse-show__row" + (hasMedia && p.imageSide === "right" ? " pulse-show__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{media}{card}</React.Fragment> : card}
        </div>

        {p.showDistribution && (
          <div className="pulse-show__dist">
            <div className="pulse-show__dist-cap">
              <span className="pulse-label">{COPY.distCap}</span>
              <span className="pulse-mono">{COPY.distUnit}</span>
            </div>
            <div className="pulse-show__dist-bar">
              {dist.map((d, i) => {
                const focus = p.focusEnabled && i + 1 === focusN;
                const w = (d.v / distTotal) * 100;
                return (
                  <i key={i} style={{ width: w + "%", background: d.c,
                    opacity: p.focusEnabled && !focus ? 0.4 : 1 }}>
                    {w > 14 && <b>{Math.round(w)}%</b>}
                  </i>
                );
              })}
            </div>
            <div className="pulse-show__dist-legend">
              {dist.map((d, i) => (
                <span key={i} className={p.focusEnabled && i + 1 === focusN ? "is-focus" : ""}>
                  <i style={{ background: d.c }} />
                  <em>{d.k}</em>
                  <b>{d.v}<small>亿</small></b>
                </span>
              ))}
            </div>
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-show__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseShowcase.controls = controls;
PulseShowcase.defaults = defaults;
export default PulseShowcase;
export { controls };
export { defaults };
