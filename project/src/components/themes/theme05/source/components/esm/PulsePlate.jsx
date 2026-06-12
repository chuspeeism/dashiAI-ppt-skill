/* =========================================================================
   PulsePlate — P87 image page ("全幅影像 / Full-Bleed Plate" archetype).
   A generic EDGE-TO-EDGE image poster: 0–n ratio-aware image slots bleed to all
   four slide edges (1 = single full-bleed frame, 2–3 = full-height columns that
   grow ∝ each image's aspect ratio), under a solid title panel (ink / paper /
   colour) and an optional bottom metric ticker. A legibility scrim keeps text
   readable over any photo. The reusable template for any "one dominant
   photograph as the whole slide + a poster-style caption" page — the boldest,
   most image-forward layout in the kit (contrast to the padded image pages).

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-plate / .pulse-* CSS. Text/data live in COPY (not prop-driven).
   `export default PulsePlate; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "Field · 现场",
  title: "硅谷的一天",
  sheet: "IMAGE · 87 / 90",
  kicker: "湾区是美国 AI 资本最密集的现场 —— 实验室、机房与路演同时运转。",
  ticker: [
    ["集群占比", "41%"],
    ["大额事件", "39 笔"],
    ["平均单笔", "11.6 亿美元"],
    ["头部公司", "OpenAI · Anthropic"],
  ],
  mediaCap: "现场影像",
  mediaUnit: "DROP IMAGE",
};

function clampAR(v) { return Math.max(0.55, Math.min(1.9, v || 1.5)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "全幅图片槽数量（0–3）。1 张铺满整幅；多张按比例自适应分列；为 0 时显示色谱占位。" },
  { key: "panelPosition", type: "radio", label: "标题位置", default: "tl",
    options: [{ value: "tl", label: "左上" }, { value: "tr", label: "右上" }, { value: "bl", label: "左下" }],
    description: "标题面板的锚定位置（左下时自动隐藏底部指标条以避免重叠）。" },
  { key: "panelTheme", type: "radio", label: "面板主题", default: "ink",
    options: [{ value: "ink", label: "墨色" }, { value: "paper", label: "纸色" }, { value: "color", label: "色块" }],
    description: "标题面板背景：墨色 / 纸色 / 强调色块（保证压在图片上的可读性）。" },
  { key: "showKicker", type: "toggle", label: "引导文案", default: true,
    description: "标题面板内的一句引导说明。" },
  { key: "showTicker", type: "toggle", label: "指标条", default: true,
    description: "底部贯穿的指标 ticker（左下标题时自动隐藏）。" },
  { key: "tickerCount", type: "slider", label: "指标条目数", default: 4, min: 1, max: 4, step: 1,
    description: "底部指标条的条目数量。" },
  { key: "showScrim", type: "toggle", label: "压暗蒙层", default: true,
    description: "图片上的渐变压暗蒙层（提升叠字可读性）。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片角上的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 色块面板 / 指标条强调色。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "角上的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulsePlate(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;
  const nTick = Math.max(1, Math.min(COPY.ticker.length, p.tickerCount));
  const ticker = COPY.ticker.slice(0, nTick);
  const tickerOn = p.showTicker && p.panelPosition !== "bl";

  const panelCls = "pulse-plate__panel pulse-plate__panel--" + p.panelPosition +
    " pulse-plate__panel--" + p.panelTheme;
  const panelStyle = p.panelTheme === "color" ? { background: accent } : {};

  return (
    <div className="pulse-slide pulse-plate" style={{ "--pulse-accent": accent }}>
      <div className="pulse-plate__media">
        {hasMedia ? (
          Array.from({ length: nImg }).map((_, i) => {
            const im = images[i] || {};
            const grow = clampAR(im.ar);
            return (
              <div key={i} className="pulse-plate__cell" style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                <Frame src={im.src || null} ar={im.ar || null} fill={true}
                  editable={p.editable !== false} label={"0" + (i + 1)} placeholder="拖入现场影像"
                  onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
              </div>
            );
          })
        ) : (
          <div className="pulse-plate__empty">
            {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
            <span className="pulse-mono pulse-plate__empty-cap">SET 图片槽数量 ≥ 1 · 拖入现场影像</span>
          </div>
        )}
      </div>

      {p.showScrim && hasMedia && <div className={"pulse-plate__scrim pulse-plate__scrim--" + p.panelPosition} aria-hidden="true" />}

      <div className={panelCls} style={panelStyle}>
        <div className="pulse-eyebrow pulse-plate__eyebrow" style={p.panelTheme === "color" ? null : { color: accent }}>{COPY.eyebrow}</div>
        <h1 className="pulse-plate__title">{COPY.title}</h1>
        {p.showKicker && <div className="pulse-plate__kicker">{COPY.kicker}</div>}
      </div>

      {p.showMediaCaption && hasMedia && (
        <div className="pulse-plate__mediacap">
          <span>{COPY.mediaCap}</span><span className="pulse-mono">{nImg} {COPY.mediaUnit}</span>
        </div>
      )}

      {tickerOn && (
        <div className="pulse-plate__ticker">
          {ticker.map((t, i) => (
            <div key={i} className="pulse-plate__tick">
              <span className="pulse-plate__tick-k">{t[0]}</span>
              <span className="pulse-plate__tick-v">{t[1]}</span>
            </div>
          ))}
          <div className="pulse-plate__ticker-band" aria-hidden="true">
            {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
          </div>
        </div>
      )}

      {p.showSheetLabel && <div className={"pulse-plate__sheet pulse-plate__sheet--" + (p.panelPosition === "tr" ? "left" : "right")}>{COPY.sheet}</div>}
    </div>
  );
}

PulsePlate.controls = controls;
PulsePlate.defaults = defaults;
export default PulsePlate;
export { controls };
export { defaults };
