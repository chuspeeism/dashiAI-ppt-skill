/* =========================================================================
   PulseResource — P53 image-led page ("钱以外的资源 / Resource Map" archetype).
   A generic "資源類型卡 + 主視覺圖" page: N full-bleed colored resource-type
   tiles (each EN label + ZH name + big value) stacked beside a ratio-aware image
   gallery (0–n justified slots). Image / tile sides are swappable; with 0 images
   the tiles auto-reflow into a balanced 2-column grid that fills the whole frame.
   The reusable template for any "categorized resources / assets + imagery" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-res / .pulse-* CSS. See PulseResource.controls for the typed,
   documented parameter list. Text/data live in COPY (not prop-driven, per spec).
   `export default PulseResource; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "STRATEGIC INVESTORS",
  title: "钱以外的资源",
  sheet: "IMAGE · 53 / 80",
  lead: "战略投资者提供渠道、云资源、芯片供应和客户入口 —— 交易真正价值经常不只在现金，而在关键资源绑定。",
  tiles: [
    { en: "CLOUD CREDIT",      zh: "云资源授信", v: "118", unit: "亿美元", c: SPECTRUM[5] },
    { en: "CO-SELLING",        zh: "联合销售",   v: "36",  unit: "起",     c: SPECTRUM[0] },
    { en: "CHIP SUPPLY",       zh: "芯片供应",   v: "22",  unit: "起",     c: SPECTRUM[3] },
    { en: "DATA PARTNERSHIP",  zh: "数据合作",   v: "17",  unit: "起",     c: SPECTRUM[1] },
  ],
  mediaCap: "资源绑定",
  mediaUnit: "DROP IMAGE",
  conclusion: "AI 公司融资是在锁定未来资源。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }

const controls = [
  { key: "cardCount", type: "slider", label: "卡片数量", default: 4, min: 2, max: 4, step: 1,
    description: "资源类型卡数量（2–4）。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时卡片自动转两列网格、铺满整幅。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对资源卡的位置（有图片时生效）。" },
  { key: "showValue", type: "toggle", label: "卡内数值", default: true,
    description: "各资源卡内的大号数值与单位。" },
  { key: "focusEnabled", type: "toggle", label: "重点卡片", default: true,
    description: "是否突出某一张资源卡（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点卡序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的资源卡序号（从 1 起）。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "标题下方的一段引导说明。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 重点标记的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseResource(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const n = Math.max(2, Math.min(COPY.tiles.length, p.cardCount));
  const tiles = COPY.tiles.slice(0, n);
  const focusN = Math.min(p.focusIndex, n);

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;

  const tilesBlock = (
    <div className={"pulse-res__tiles" + (hasMedia ? "" : " pulse-res__tiles--grid")}>
      {tiles.map((tl, i) => {
        const isFocus = p.focusEnabled && i + 1 === focusN;
        const dim = p.focusEnabled && !isFocus;
        return (
          <div key={i}
            className={"pulse-res__tile" + (isFocus ? " pulse-res__tile--focus" : "") + (dim ? " pulse-res__tile--dim" : "")}
            style={{ background: tl.c }}>
            <div className="pulse-res__tile-i">{String(i + 1).padStart(2, "0")}</div>
            <div className="pulse-res__tile-en">{tl.en}</div>
            <div className="pulse-res__tile-zh">{tl.zh}</div>
            {p.showValue && (
              <div className="pulse-res__tile-v">{tl.v}<small>{tl.unit}</small></div>
            )}
          </div>
        );
      })}
    </div>
  );

  const media = hasMedia && (
    <div className="pulse-res__media">
      {p.showMediaCaption && (
        <div className="pulse-res__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-res__media-row">
        {Array.from({ length: nImg }).map((_, i) => {
          const im = images[i] || {};
          const grow = clampAR(im.ar);
          return (
            <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
              <Frame src={im.src || null} ar={im.ar || null} fill={true}
                editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入资源场景图"
                onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-res" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-res__body">
        {p.showLead && <div className="pulse-res__lead">{COPY.lead}</div>}
        <div className={"pulse-res__row" + (hasMedia && p.imageSide === "left" ? " pulse-res__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{tilesBlock}{media}</React.Fragment> : tilesBlock}
        </div>
        {p.showConclusion && <div className="pulse-conclusion pulse-res__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseResource.controls = controls;
PulseResource.defaults = defaults;
export default PulseResource;
export { controls };
export { defaults };
