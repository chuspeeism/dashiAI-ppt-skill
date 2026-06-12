/* =========================================================================
   PulseCatalog — P42 image-led page ("图像型录卡 / Catalog Cards" archetype).
   A bold contact-sheet / catalog grid (echoes the reference "Sound Bank"): a row
   of N category cards whose WIDTH encodes a value (so the row itself reads as a
   part-to-whole distribution). The first `imageCount` cards are ratio-aware image
   SLOTS (drop an image → it fills the card); the remaining cards render as solid
   TR-808 color tiles with an oversized code. A thin identity strip carries the
   headline metrics. The reusable template for any "type / category catalog with
   imagery + value split" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + CSS.
   See PulseCatalog.controls for the typed, documented parameter list.
   `export default PulseCatalog; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or inject via props.ImageFrame).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "GENERATIVE CONTENT",
  title: "图像、视频与创意",
  sub: "内容生成赛道",
  sheet: "IMAGE · 42 / 80",
  metrics: [
    ["融资额", "31", "亿美元"],
    ["事件数", "11", "笔"],
    ["平均单笔", "2.8", "亿美元"],
  ],
  galleryCap: "内容类型型录",
  galleryUnit: "DROP IMAGES",
  cards: [
    { en: "VIDEO", zh: "视频生成", code: "VG", v: 14, unit: "亿美元", c: SPECTRUM[0] },
    { en: "ADS",   zh: "广告创意", code: "AD", v: 8,  unit: "亿美元", c: SPECTRUM[2] },
    { en: "IMAGE", zh: "图像生成", code: "IM", v: 5,  unit: "亿美元", c: SPECTRUM[5] },
    { en: "AUDIO", zh: "音乐音频", code: "AU", v: 4,  unit: "亿美元", c: SPECTRUM[4] },
  ],
  conclusion: "流量热度不等于商业壁垒。",
};

const controls = [
  { key: "cardCount", type: "slider", label: "型录卡数量", default: 4, min: 2, max: 4, step: 1,
    description: "类型卡（型录单元）的数量。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 2, min: 0, max: 4, step: 1,
    description: "前 N 张卡作为图片槽（按比例填充）；其余卡为纯色型录块。" },
  { key: "widthByValue", type: "toggle", label: "按数值定宽", default: true,
    description: "卡片宽度按数值分配（整行即一条资金分布）；关闭则等宽。" },
  { key: "showCode", type: "toggle", label: "卡片代号", default: true,
    description: "卡片角上的两字母代号。" },
  { key: "showValue", type: "toggle", label: "卡片数值", default: true,
    description: "卡片底部的数值标注。" },
  { key: "focusEnabled", type: "toggle", label: "重点卡片", default: false,
    description: "是否突出某一张卡（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点卡序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的卡片序号（从 1 起）。" },
  { key: "showHeadline", type: "toggle", label: "指标条", default: true,
    description: "型录上方的标题指标条。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "型录区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 指标条强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseCatalog(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nCard = Math.max(2, Math.min(COPY.cards.length, p.cardCount));
  const cards = COPY.cards.slice(0, nCard);
  const sum = cards.reduce((s, c) => s + c.v, 0);
  const nImg = Math.max(0, Math.min(nCard, p.imageCount));
  const images = p.images || [];
  const focusN = Math.min(p.focusIndex, nCard);

  return (
    <div className="pulse-slide pulse-cat" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-cat__body">
        {p.showHeadline && (
          <div className="pulse-cat__headline">
            <div className="pulse-cat__headline-sub">{COPY.sub}</div>
            <div className="pulse-cat__headline-metrics">
              {COPY.metrics.map((m, i) => (
                <div className="pulse-cat__hm" key={i}>
                  <span className="pulse-cat__hm-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                  <span className="pulse-cat__hm-k">{m[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {p.showGalleryCaption && (
          <div className="pulse-cat__cap">
            <span className="pulse-label">{COPY.galleryCap}</span>
            <span className="pulse-mono">{COPY.galleryUnit}</span>
          </div>
        )}

        <div className="pulse-cat__row">
          {cards.map((c, i) => {
            const isSlot = i < nImg && Frame;
            const im = images[i] || {};
            const grow = p.widthByValue ? (c.v / sum) * nCard : 1;
            const focus = p.focusEnabled && i + 1 === focusN;
            const dim = p.focusEnabled && !focus;
            return (
              <div key={i}
                className={"pulse-cat__card" + (focus ? " pulse-cat__card--focus" : "")}
                style={{ flex: `${grow} 1 0`, minWidth: 0, opacity: dim ? 0.4 : 1,
                  background: isSlot ? "var(--pulse-dark)" : c.c }}>

                {isSlot && (
                  <div className="pulse-cat__img">
                    <Frame src={im.src || null} ar={im.ar || null} fill={true}
                      editable={p.editable !== false} label={"NO." + (i + 1)} placeholder="拖入图片"
                      onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                  </div>
                )}

                <div className="pulse-cat__card-top">
                  <span className="pulse-cat__idx" style={{ color: isSlot ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.5)" }}>{String(i + 1).padStart(2, "0")}</span>
                  {p.showCode && <span className="pulse-cat__code" style={{ color: isSlot ? "#fff" : "rgba(0,0,0,0.4)" }}>{c.code}</span>}
                </div>

                {!isSlot && <span className="pulse-cat__bigcode">{c.code}</span>}

                <div className="pulse-cat__card-foot" style={{ background: c.c }}>
                  <div className="pulse-cat__card-zh">{c.zh}</div>
                  <div className="pulse-cat__card-en">{c.en}</div>
                  {p.showValue && (
                    <div className="pulse-cat__card-v">{c.v}<small>{c.unit}</small></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {p.showConclusion && <div className="pulse-conclusion pulse-cat__concl">{COPY.conclusion}</div>}
    </div>
  );
}

PulseCatalog.controls = controls;
PulseCatalog.defaults = defaults;
export default PulseCatalog;
export { controls };
export { defaults };
