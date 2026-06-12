/* =========================================================================
   PulseAtlas — P40 image-led page ("架构图 + 场景拆分 / Atlas").
   A generic image-led page whose distinguishing element is a row of DISCRETE
   scene-split stat blocks (colored stripe + name + big number) — not bars. A
   ratio-aware architecture image (0–n justified slots) sits beside a colored
   identity card (eyebrow + title + metric spec); a full-width scene-split band
   of N stat blocks runs below. Image / card sides swappable; with 0 images the
   card goes full-width (two-column metrics). The reusable template for any
   "system / architecture diagram + discrete scene split" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + PulseImageFrame + .pulse-atl / .pulse-* CSS.
   See PulseAtlas.controls for the typed, documented parameter list.
   `export default PulseAtlas` instead (import PulseImageFrame as a module; the
   component also accepts an injected `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "AUTONOMOUS AI",
  title: "车载模型升级",
  en: "AUTONOMOUS AI",
  zh: "自动驾驶与车载 AI",
  sheet: "IMAGE · 40 / 80",
  lead: "车载 AI 从感知模块转向端到端模型和座舱智能。",
  metrics: [
    ["融资额", "29", "亿美元"],
    ["事件数", "6", "笔"],
    ["平均单笔", "4.8", "亿美元"],
    ["端到端占比", "45", "%"],
  ],
  mediaCap: "车载 AI 架构",
  mediaUnit: "DROP DIAGRAM",
  sceneCap: "场景拆分",
  sceneUnit: "BY SCENE",
  scenes: [
    { en: "END-TO-END",  zh: "端到端驾驶", num: "13", unit: "亿美元", c: SPECTRUM[5] },
    { en: "SIMULATION",  zh: "仿真平台",   num: "9",  unit: "亿美元", c: SPECTRUM[3] },
    { en: "IN-CAR COPILOT", zh: "车载助手", num: "7", unit: "亿美元", c: SPECTRUM[1] },
  ],
  conclusion: "自动驾驶回暖，但更看重工程兑现。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.9, v || 1.5)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
    description: "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时身份卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
    description: "图片相对身份卡的位置（有图片时生效）。" },
  { key: "cardTheme", type: "radio", label: "身份卡主题", default: "dark",
    options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
    description: "身份卡背景：强调色块 / 深色 / 纸色。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 3, min: 2, max: 4, step: 1,
    description: "身份卡内的指标行数。" },
  { key: "sceneCount", type: "slider", label: "场景块数", default: 3, min: 2, max: 3, step: 1,
    description: "底部场景拆分带的 stat 块数量。" },
  { key: "showScenes", type: "toggle", label: "场景拆分带", default: true,
    description: "底部全宽的场景拆分带（离散 stat 块）。" },
  { key: "focusEnabled", type: "toggle", label: "重点场景块", default: true,
    description: "是否突出某一场景块（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点场景序号", default: 1, min: 1, max: 3, step: 1,
    description: "被突出的场景块序号（从 1 起）。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "标题下方的一段引导说明。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
    description: "眉标 / 卡内强调条 /「色块」主题身份卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseAtlas(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const metrics = COPY.metrics.slice(0, nMetric);
  const nImg = Math.max(0, Math.min(2, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasMedia = nImg > 0 && Frame;

  const nScene = Math.max(2, Math.min(COPY.scenes.length, p.sceneCount));
  const scenes = COPY.scenes.slice(0, nScene);
  const focusN = Math.min(p.focusIndex, nScene);

  let bg, fg, div;
  if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.24)"; }

  const media = hasMedia && (
    <div className="pulse-atl__media">
      {p.showMediaCaption && (
        <div className="pulse-atl__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-atl__media-row">
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
    <div className={"pulse-atl__card" + (hasMedia ? "" : " pulse-atl__card--wide")}
      style={{ background: bg, color: fg, "--atl-div": div, flex: hasMedia ? "0 0 38%" : "1 1 auto" }}>
      <div className="pulse-atl__bar" style={{ color: p.cardTheme === "color" ? "#fff" : accent }} />
      <div className="pulse-atl__en">{COPY.en}</div>
      <div className="pulse-atl__zh">{COPY.zh}</div>
      {p.showLead && <div className="pulse-atl__lead">{COPY.lead}</div>}
      <div className="pulse-atl__metrics">
        {metrics.map((m, i) => (
          <div className="pulse-atl__m" key={i}>
            <span className="pulse-atl__m-k">{m[0]}</span>
            <span className="pulse-atl__m-v">{m[1]}<small>{m[2]}</small></span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-atl" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-atl__body">
        <div className={"pulse-atl__row" + (hasMedia && p.imageSide === "left" ? " pulse-atl__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{card}{media}</React.Fragment> : card}
        </div>

        {p.showScenes && (
          <div className="pulse-atl__scenes">
            {scenes.map((s, i) => {
              const focus = p.focusEnabled && i + 1 === focusN;
              const dim = p.focusEnabled && !focus;
              return (
                <div key={i}
                  className={"pulse-atl__scene" + (focus ? " pulse-atl__scene--focus" : "") + (dim ? " pulse-atl__scene--dim" : "")}>
                  <div className="pulse-atl__scene-stripe" style={{ background: s.c }} />
                  <div className="pulse-atl__scene-en">{s.en}</div>
                  <div className="pulse-atl__scene-zh">{s.zh}</div>
                  <div className="pulse-atl__scene-num">{s.num}<small>{s.unit}</small></div>
                </div>
              );
            })}
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-atl__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseAtlas.controls = controls;
PulseAtlas.defaults = defaults;
export default PulseAtlas;
export { controls };
export { defaults };
