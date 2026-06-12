/* =========================================================================
   PulseMix — P36 image-led page ("图示 + 占比构成 / Image + Composition").
   A generic "dominant image + part-to-whole makeup" archetype: a dominant,
   ratio-aware image (0–n slots — e.g. a supply-chain diagram) beside a card
   whose upper half is a compact metric pair and whose lower half is a set of
   horizontal proportion bars (a composition makeup), with values, a focus bar,
   and switchable coloring. Image / card sides swappable; 0 images → card full
   width. The reusable template for any "one visual + one composition" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + PulseImageFrame + .pulse-mix / .pulse-* CSS.
   See PulseMix.controls for the typed, documented parameter list.
   `export default PulseMix` instead (import PulseImageFrame as a module).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "DATA LABELING",
  title: "高质量数据供给",
  sheet: "MIX · 36 / 80",
  en: "DATA LABELING",
  zh: "数据标注与合成数据",
  metrics: [
    ["融资额", "33", "亿美元"],
    ["事件数", "6", "笔"],
  ],
  splitCap: "训练数据构成",
  splitUnit: "DATA MIX",
  // part-to-whole makeup; color = category index into SPECTRUM
  bars: [
    { name: "合成数据", v: 42, color: SPECTRUM[0] },
    { name: "人类反馈数据", v: 35, color: SPECTRUM[3] },
    { name: "真实采集", v: 23, color: SPECTRUM[5] },
  ],
  conclusion: "数据越稀缺，数据基础设施越有价值。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
    description: "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时卡片铺满整幅。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对卡片的位置（有图片时生效）。" },
  { key: "barCount", type: "slider", label: "占比条数量", default: 3, min: 2, max: 3, step: 1,
    description: "构成区横向占比条的数量。" },
  { key: "sortDescending", type: "toggle", label: "按占比降序", default: true,
    description: "占比条是否按数值由大到小排序。" },
  { key: "colorMode", type: "radio", label: "占比条配色", default: "category",
    options: [{ value: "category", label: "按类别" }, { value: "accent", label: "强调色" }, { value: "mono", label: "单色" }],
    description: "占比条的配色方式：按类别 / 统一强调色 / 单色阶。" },
  { key: "focusEnabled", type: "toggle", label: "重点占比条", default: true,
    description: "是否突出某一条占比。" },
  { key: "focusIndex", type: "slider", label: "重点条序号", default: 1, min: 1, max: 3, step: 1,
    description: "被突出的占比条序号（按当前排序后顺序）。" },
  { key: "showMetrics", type: "toggle", label: "指标对", default: true,
    description: "卡片上半部分的一对关键指标。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[1], options: SPECTRUM,
    description: "眉标 / 重点条 /「强调色」配色模式下占比条的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseMix(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const nImg = Math.max(0, Math.min(2, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasMedia = nImg > 0 && Frame;

  const nBar = Math.max(2, Math.min(COPY.bars.length, p.barCount));
  let bars = COPY.bars.slice(0, nBar);
  if (p.sortDescending) bars = bars.slice().sort((a, b) => b.v - a.v);
  const maxV = Math.max.apply(null, bars.map((b) => b.v));

  function barColor(b, i) {
    if (p.colorMode === "accent") return accent;
    if (p.colorMode === "mono") return ["#14130f", "#3d3a32", "#6b665a"][i % 3];
    return b.color;
  }

  const media = hasMedia && (
    <div className="pulse-mix__media">
      <div className="pulse-mix__media-cap">
        <span className="pulse-label">数据供应链图示</span>
        <span className="pulse-mono">DROP IMAGE</span>
      </div>
      <div className="pulse-mix__media-row">
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

  const card = (
    <div className={"pulse-mix__card" + (hasMedia ? "" : " pulse-mix__card--wide")}
      style={{ flex: hasMedia ? "1 1 0" : "1 1 auto" }}>
      <div className="pulse-mix__en">{COPY.en}</div>
      <div className="pulse-mix__zh">{COPY.zh}</div>

      {p.showMetrics && (
        <div className="pulse-mix__metrics">
          {COPY.metrics.map((m, i) => (
            <div className="pulse-mix__metric" key={i}>
              <div className="pulse-mix__metric-k">{m[0]}</div>
              <div className="pulse-mix__metric-v">{m[1]}<small>{m[2]}</small></div>
            </div>
          ))}
        </div>
      )}

      <div className="pulse-mix__split">
        <div className="pulse-mix__split-cap">
          <span className="pulse-label">{COPY.splitCap}</span>
          <span className="pulse-mono">{COPY.splitUnit}</span>
        </div>
        <div className="pulse-mix__bars">
          {bars.map((b, i) => {
            const focus = p.focusEnabled && i + 1 === p.focusIndex;
            return (
              <div className={"pulse-mix__bar" + (focus ? " pulse-mix__bar--focus" : "")} key={i}>
                <div className="pulse-mix__bar-h">
                  <span className="pulse-mix__bar-name">{b.name}</span>
                  <span className="pulse-mix__bar-v">{b.v}%</span>
                </div>
                <div className="pulse-mix__bar-track">
                  <div className="pulse-mix__bar-fill" style={{ width: (b.v / maxV) * 100 + "%", background: barColor(b, i) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-mix" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-mix__body">
        <div className={"pulse-mix__row" + (hasMedia && p.imageSide === "left" ? " pulse-mix__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{card}{media}</React.Fragment> : card}
        </div>
        {p.showConclusion && <div className="pulse-conclusion pulse-mix__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseMix.controls = controls;
PulseMix.defaults = defaults;
export default PulseMix;
export { controls };
export { defaults };
