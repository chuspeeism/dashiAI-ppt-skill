/* =========================================================================
   PulseRegion — P57 image-led page ("行业客户优势 / Geo Identity Card" archetype).
   A generic geographic-cluster identity page: a typographic identity card
   (oversized cluster wordmark + locale + locator tag + industry tag chips +
   metric spec) beside a ratio-aware image gallery (0–n justified slots). Card /
   image sides are swappable; with 0 images the card goes full-width (two-column
   metrics) so composition stays balanced at any slot count. The reusable template
   for any "place / cluster / segment identity + tags + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-rgn / .pulse-* CSS. Text/data live in COPY (not prop-driven).
   `export default PulseRegion; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "NEW YORK CLUSTER",
  title: "行业客户优势",
  sheet: "IMAGE · 57 / 80",
  cluster: "NEW YORK",
  locale: "纽约集群",
  locator: "EAST · 40.7°N",
  lead: "纽约 AI 融资以金融、媒体、企业服务和法律 AI 为主 —— 优势不在基础模型，而在高价值行业客户。",
  tags: ["金融", "媒体", "企业服务", "法律 AI"],
  metrics: [
    ["融资额", "120", "亿美元"],
    ["市场占比", "12.4", "%"],
    ["事件数", "14", "笔"],
    ["平均单笔", "8.6", "亿美元"],
  ],
  mediaCap: "城市场景",
  mediaUnit: "DROP IMAGE",
  conclusion: "行业客户密度决定垂直应用机会。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时身份卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对身份卡的位置（有图片时生效）。" },
  { key: "cardTheme", type: "radio", label: "身份卡主题", default: "paper",
    options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }, { value: "color", label: "色块" }],
    description: "身份卡背景：纸色 / 深色 / 强调色块。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "身份卡内的指标行数。" },
  { key: "tagCount", type: "slider", label: "标签数量", default: 4, min: 0, max: 4, step: 1,
    description: "行业 / 主题标签 chip 数量（0 隐藏整行）。" },
  { key: "showLocator", type: "toggle", label: "定位标签", default: true,
    description: "地名下方的方位 / 坐标定位标签。" },
  { key: "focusEnabled", type: "toggle", label: "重点指标", default: false,
    description: "是否突出某一条指标行。" },
  { key: "focusIndex", type: "slider", label: "重点指标序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的指标行序号（从 1 起）。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "地名下方的一段引导说明。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标 / 强调条 /「色块」主题身份卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseRegion(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const metrics = COPY.metrics.slice(0, nMetric);
  const nTag = Math.max(0, Math.min(COPY.tags.length, p.tagCount));
  const tags = COPY.tags.slice(0, nTag);
  const focusN = Math.min(p.focusIndex, nMetric);

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;

  let bg, fg, div, mute;
  if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; mute = "var(--pulse-on-dark-mute)"; }
  else if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; mute = "rgba(255,255,255,0.78)"; }
  else { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; mute = "var(--pulse-mute)"; }
  const barColor = p.cardTheme === "color" ? "#fff" : accent;

  const card = (
    <div className={"pulse-rgn__card" + (hasMedia ? "" : " pulse-rgn__card--wide")}
      style={{ background: bg, color: fg, "--rgn-div": div, "--rgn-mute": mute, flex: hasMedia ? "0 0 40%" : "1 1 auto" }}>
      <div className="pulse-rgn__bar" style={{ background: barColor }} />
      <div className="pulse-rgn__cluster">{COPY.cluster}</div>
      <div className="pulse-rgn__locale">
        <span>{COPY.locale}</span>
        {p.showLocator && <span className="pulse-rgn__locator">{COPY.locator}</span>}
      </div>
      {p.showLead && <div className="pulse-rgn__lead">{COPY.lead}</div>}
      {nTag > 0 && (
        <div className="pulse-rgn__tags">
          {tags.map((t, i) => (
            <span key={i} className="pulse-rgn__tag" style={{ borderColor: barColor }}>{t}</span>
          ))}
        </div>
      )}
      <div className={"pulse-rgn__metrics" + (hasMedia ? "" : " pulse-rgn__metrics--grid")}>
        {metrics.map((m, i) => {
          const isFocus = p.focusEnabled && i + 1 === focusN;
          return (
            <div key={i} className={"pulse-rgn__m" + (isFocus ? " pulse-rgn__m--focus" : "")}>
              <span className="pulse-rgn__m-k">{m[0]}</span>
              <span className="pulse-rgn__m-v" style={isFocus ? { color: barColor } : null}>{m[1]}<small>{m[2]}</small></span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const media = hasMedia && (
    <div className="pulse-rgn__media">
      {p.showMediaCaption && (
        <div className="pulse-rgn__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-rgn__media-row">
        {Array.from({ length: nImg }).map((_, i) => {
          const im = images[i] || {};
          const grow = clampAR(im.ar);
          return (
            <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
              <Frame src={im.src || null} ar={im.ar || null} fill={true}
                editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入城市场景图"
                onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-rgn" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-rgn__body">
        <div className={"pulse-rgn__row" + (hasMedia && p.imageSide === "left" ? " pulse-rgn__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{card}{media}</React.Fragment> : card}
        </div>
        {p.showConclusion && <div className="pulse-conclusion pulse-rgn__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseRegion.controls = controls;
PulseRegion.defaults = defaults;
export default PulseRegion;
export { controls };
export { defaults };
