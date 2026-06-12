/* =========================================================================
   PulseSegment — P28 image-led page ("赛道剖析 / Segment Profile" archetype).
   A generic single-segment deep-dive: a colored identity card (eyebrow + title
   + metric spec) beside an ADAPTIVE image gallery (0–n justified, ratio-aware
   slots). With 0 images the card goes full-width with two-column metrics, so
   the composition stays balanced at any slot count. This is the reusable
   template for every sector / segment page in the deck.
   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. See PulseSegment.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';
import PulseImageFrame from './PulseImageFrame.jsx';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "SEGMENT PROFILE",
  en: "AI AGENTS",
  title: "工作流自动化机会",
  sub: "AI Agent 赛道",
  sheet: "SEGMENT · 28 / 32",
  metrics: [
    ["融资额", "72", "亿美元"],
    ["事件数", "16", "笔"],
    ["平均单笔", "4.5", "亿美元"],
    ["样本 ARR 中位数", "4200", "万美元"],
  ],
  galleryCap: "赛道图示",
  galleryUnit: "DROP IMAGES",
  conclusion: "能进入工作流的 Agent 才有长期价值。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

function PulseSegment(props) {
  const p = Object.assign({}, PulseSegment.defaults, props);
  const accent = p.accentColor;
  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const metrics = COPY.metrics.slice(0, nMetric);
  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasGallery = nImg > 0 && Frame;

  // theme → card bg / fg / divider color
  let bg, fg, div;
  if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.24)"; }

  const cardCls = "pulse-seg__card" + (hasGallery ? "" : " pulse-seg__card--wide");

  return (
    <div className="pulse-slide pulse-seg" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-seg__body">
        <div className="pulse-seg__row">
          <div className={cardCls}
            style={{ background: bg, color: fg, "--seg-div": div, flex: hasGallery ? "0 0 42%" : "1 1 auto" }}>
            <div className="pulse-seg__head">
              <div className="pulse-seg__en">{COPY.en}</div>
              <div className="pulse-seg__zh">{COPY.title}</div>
              <div className="pulse-seg__sub">{COPY.sub}</div>
            </div>
            <div className="pulse-seg__metrics">
              {metrics.map((m, i) => (
                <div className="pulse-seg__m" key={i}>
                  <span className="pulse-seg__m-k">{m[0]}</span>
                  <span className="pulse-seg__m-v">{m[1]}<small>{m[2]}</small></span>
                </div>
              ))}
            </div>
          </div>

          {hasGallery && (
            <div className="pulse-seg__gallery">
              {p.showGalleryCaption && (
                <div className="pulse-seg__gallery-cap">
                  <span className="pulse-label">{COPY.galleryCap}</span>
                  <span className="pulse-mono">{COPY.galleryUnit}</span>
                </div>
              )}
              <div className="pulse-seg__gallery-row">
                {Array.from({ length: nImg }).map((_, i) => {
                  const im = images[i] || {};
                  const grow = clampAR(im.ar);
                  return (
                    <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                      <Frame
                        src={im.src || null}
                        ar={im.ar || null}
                        fill={true}
                        editable={p.editable !== false}
                        label={"IMG." + (i + 1)}
                        placeholder="拖入图片"
                        onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-seg__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseSegment.controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 2, min: 0, max: 3, step: 1,
    description: "图片槽数量（0–3）；按各图比例自适应排布。为 0 时主体卡自动铺满整幅。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "主体卡内的指标行数。" },
  { key: "cardTheme", type: "radio", label: "主体卡主题", default: "color",
    options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
    description: "主体卡背景：强调色块 / 深色 / 纸色。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标与「色块」主题下主体卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseSegment.defaults = PulseSegment.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseSegment;
export const controls = PulseSegment.controls || [];
export const defaults = PulseSegment.defaults || {};
