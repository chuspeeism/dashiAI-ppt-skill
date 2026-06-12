/* =========================================================================
   PulseBreakdown — P31 page ("子项拆分 / Sub-allocation Breakdown" archetype).
   A generic part-to-whole breakdown: a compact segment identity card (with a
   running total) beside a set of labeled horizontal bars (sub-allocation),
   with values, a focus bar, switchable coloring, and an OPTIONAL adaptive
   image strip below. The reusable template for "one segment → N sub-areas".
   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. See PulseBreakdown.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';
import PulseImageFrame from './PulseImageFrame.jsx';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "HEALTHCARE AI",
  en: "HEALTHCARE AI",
  title: "慢变量高壁垒",
  sub: "医疗 AI 赛道",
  sheet: "BREAKDOWN · 31 / 32",
  totalK: "赛道融资额",
  totalV: "34",
  totalUnit: "亿美元 · 8 笔",
  unit: "亿美元",
  items: [
    { name: "药物发现", v: 14, c: SPECTRUM[5] },
    { name: "影像诊断", v: 11, c: SPECTRUM[0] },
    { name: "临床文书", v: 9,  c: SPECTRUM[3] },
  ],
  mediaCap: "赛道图示",
  mediaUnit: "DROP IMAGES",
  conclusion: "慢场景不代表低价值。",
};

function clampAR(v) { return Math.max(0.7, Math.min(1.8, v || 1.4)); }

function PulseBreakdown(props) {
  const p = Object.assign({}, PulseBreakdown.defaults, props);
  const accent = p.accentColor;
  const n = Math.max(2, Math.min(COPY.items.length, p.itemCount));
  let items = COPY.items.slice(0, n).map((it, i) => ({ ...it, _i: i }));
  if (p.sortDescending) items = items.slice().sort((a, b) => b.v - a.v);
  const max = Math.max.apply(null, items.map((it) => it.v));
  const sum = items.reduce((a, it) => a + it.v, 0);

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasMedia = nImg > 0 && Frame;

  const colorOf = (it) =>
    p.colorMode === "accent" ? accent
    : p.colorMode === "mono" ? "#3d3a32"
    : it.c;

  let bg, fg, div;
  if (p.cardTheme === "dark") { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.24)"; }

  return (
    <div className="pulse-slide pulse-bd" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-bd__body">
        <div className="pulse-bd__row">
          <div className="pulse-bd__card" style={{ background: bg, color: fg, "--bd-div": div }}>
            <div className="pulse-bd__en">{COPY.en}</div>
            <div className="pulse-bd__zh">{COPY.title}</div>
            <div className="pulse-bd__sub">{COPY.sub}</div>
            {p.showTotal && (
              <div className="pulse-bd__total">
                <div className="pulse-bd__total-k">{COPY.totalK}</div>
                <div className="pulse-bd__total-v">{COPY.totalV}<small>{COPY.totalUnit}</small></div>
              </div>
            )}
          </div>

          <div className="pulse-bd__bars">
            {items.map((it, i) => {
              const focus = p.focusEnabled && it._i + 1 === p.focusIndex;
              const pct = ((it.v / sum) * 100).toFixed(0);
              return (
                <div key={it._i} className={"pulse-bd__bar" + (focus ? " pulse-bd__bar--focus" : "")}>
                  <div className="pulse-bd__bar-h">
                    <span className="pulse-bd__bar-name">{it.name}</span>
                    <span className="pulse-bd__bar-v">{it.v}<small>{COPY.unit} · {pct}%</small></span>
                  </div>
                  <div className="pulse-bd__bar-track">
                    <div className="pulse-bd__bar-fill" style={{ width: (it.v / max) * 100 + "%", background: colorOf(it) }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {hasMedia && (
          <div className="pulse-bd__media">
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
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-bd__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseBreakdown.controls = [
  { key: "itemCount", type: "slider", label: "子项数量", default: 3, min: 2, max: 3, step: 1,
    description: "子项拆分的横条数量。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 0, min: 0, max: 3, step: 1,
    description: "底部图片槽数量（0–3），按比例自适应；为 0 时隐藏整条图片带。" },
  { key: "sortDescending", type: "toggle", label: "按值降序", default: true,
    description: "横条是否按数值由大到小排序。" },
  { key: "focusEnabled", type: "toggle", label: "重点子项", default: true,
    description: "是否突出某一个子项。" },
  { key: "focusIndex", type: "slider", label: "重点子项序号", default: 1, min: 1, max: 3, step: 1,
    description: "被突出的子项序号（按原始顺序，从 1 起）。" },
  { key: "colorMode", type: "radio", label: "配色方式", default: "category",
    options: [{ value: "category", label: "按类别" }, { value: "accent", label: "强调色" }, { value: "mono", label: "单色" }],
    description: "横条配色：按类别 / 统一强调色 / 单色。" },
  { key: "cardTheme", type: "radio", label: "主体卡主题", default: "color",
    options: [{ value: "color", label: "色块" }, { value: "dark", label: "深色" }, { value: "paper", label: "纸色" }],
    description: "主体卡背景：强调色块 / 深色 / 纸色。" },
  { key: "showTotal", type: "toggle", label: "合计区", default: true,
    description: "主体卡底部的赛道合计数值。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标 /「色块」主题主体卡 / 重点项的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseBreakdown.defaults = PulseBreakdown.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseBreakdown;
export const controls = PulseBreakdown.controls || [];
export const defaults = PulseBreakdown.defaults || {};
