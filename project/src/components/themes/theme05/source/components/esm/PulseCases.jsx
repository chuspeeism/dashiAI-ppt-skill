/* =========================================================================
   PulseCases — P08 image-led page ("典型案例 / Case Cards" archetype).
   A generic case-card slide with an ADAPTIVE image gallery: 0–n image slots
   laid out as a justified row where each slot's width tracks its image's
   aspect ratio, so the composition stays balanced at any count and any ratio.
   Image slots are prop-driven (pass `images` + `onImageChange`); cards, focus
   and slot count are all controlled by props.
   See PulseCases.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';
import PulseImageFrame from './PulseImageFrame.jsx';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

const COPY = {
  eyebrow: "CASE STUDIES",
  title: "典型案例深度剖析",
  sub: "三类资本逻辑的代表公司",
  sheet: "CASES · 08 / 32",
  cards: [
    { en: "ANTHROPIC", zh: "安全可靠模型", c: SPECTRUM[0], fg: "#fff",
      metrics: [["融资", "650 亿+"], ["方向", "安全对齐"], ["产品", "Claude"]] },
    { en: "XAI",       zh: "实时数据生态", c: SPECTRUM[5], fg: "#fff",
      metrics: [["融资", "50 亿"], ["数据", "X 平台"], ["方向", "多模态"]] },
    { en: "COREWEAVE", zh: "算力基础设施", c: SPECTRUM[3], fg: "#fff",
      metrics: [["融资", "110 亿"], ["GPU", "7.8 万张"], ["方向", "算力云"]] },
    { en: "OPENAI",    zh: "商业化标杆",   c: SPECTRUM[6], fg: "#fff",
      metrics: [["融资", "66 亿"], ["客户", "9.4 万家"], ["方向", "通用模型"]] },
  ],
  galleryCap: "案例图示",
  galleryUnit: "DROP IMAGES",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

function PulseCases(props) {
  const p = Object.assign({}, PulseCases.defaults, props);
  const accent = p.accentColor;
  const count = Math.max(2, Math.min(COPY.cards.length, p.cardCount));
  const cards = COPY.cards.slice(0, count);
  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;

  return (
    <div className="pulse-slide pulse-cases" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-cases__body">
        <div className="pulse-cases__cards" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
          {cards.map((card, i) => {
            const focus = p.focusEnabled && i + 1 === p.focusIndex;
            return (
              <div key={i}
                className={"pulse-casecard" + (focus ? " pulse-casecard--focus" : "")}
                style={{ background: card.c, color: card.fg }}>
                {focus && <div className="pulse-casecard__flag">重点</div>}
                <div className="pulse-casecard__idx">{String(i + 1).padStart(2, "0")}</div>
                <div className="pulse-casecard__en">{card.en}</div>
                <div className="pulse-casecard__zh">{card.zh}</div>
                {p.showMetrics && (
                  <div className="pulse-casecard__metrics">
                    {card.metrics.map((m, k) => (
                      <div className="pulse-casecard__m" key={k}>
                        <span className="pulse-casecard__m-k">{m[0]}</span>
                        <span className="pulse-casecard__m-v">{m[1]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {nImg > 0 && Frame && (
          <div className="pulse-cases__gallery">
            {p.showGalleryCaption && (
              <div className="pulse-cases__gallery-cap">
                <span className="pulse-label">{COPY.galleryCap}</span>
                <span className="pulse-mono">{COPY.galleryUnit}</span>
              </div>
            )}
            <div className="pulse-cases__gallery-row">
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
    </div>
  );
}

PulseCases.controls = [
  { key: "cardCount", type: "slider", label: "案例卡数量", default: 3, min: 2, max: 4, step: 1,
    description: "横向排列的案例卡数量。" },
  { key: "focusEnabled", type: "toggle", label: "重点卡", default: true,
    description: "是否突出某一张案例卡。" },
  { key: "focusIndex", type: "slider", label: "重点卡序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的案例卡序号（从 1 起）。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 2, min: 0, max: 3, step: 1,
    description: "底部图片槽数量（0–3）；按各图比例自适应排布，构图自动均衡。" },
  { key: "showMetrics", type: "toggle", label: "卡内指标", default: true,
    description: "案例卡内部的指标列表。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标的强调色。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseCases.defaults = PulseCases.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseCases;
export const controls = PulseCases.controls || [];
export const defaults = PulseCases.defaults || {};
