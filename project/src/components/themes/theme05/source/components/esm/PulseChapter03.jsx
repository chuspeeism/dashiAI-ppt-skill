/* =========================================================================
   PulseChapter03 — P26 chapter divider (second instance of the section-break
   archetype). Identical structure/CSS to PulseChapter (P15) — only the baked
   COPY and a few defaults differ, per the kit convention of one file per page
   (text lives in COPY, not in props). Defaults to the full-bleed "color"
   theme so it reads differently from the dark P15 divider and creates rhythm.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseChapter03.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text intentionally NOT prop-driven, per spec).
const COPY = {
  brand: "AICL",
  barMeta: "SECTION DIVIDER",
  eyebrow: "CHAPTER 03",
  num: "03",
  title: "赛道结构细分",
  sub: "从大模型到垂直应用",
  sheet: "26 / 32",
  keywords: ["通用模型", "Agent", "企业搜索", "开发者工具"],
};

function PulseChapter03(props) {
  const p = Object.assign({}, PulseChapter03.defaults, props);
  const accent = p.accentColor;
  const theme = p.theme; // dark | paper | color
  const nKw = Math.max(0, Math.min(COPY.keywords.length, p.keywordCount));

  let bg, fg, numColor, eyebrowColor;
  if (theme === "paper") {
    bg = "var(--pulse-paper)"; fg = "var(--pulse-ink)";
    numColor = accent; eyebrowColor = accent;
  } else if (theme === "color") {
    bg = p.bgColor; fg = "#fff";
    numColor = "rgba(255,255,255,0.20)"; eyebrowColor = "#fff";
  } else { // dark
    bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)";
    numColor = accent; eyebrowColor = accent;
  }

  const cls = "pulse-slide pulse-chapter" + (theme === "dark" ? " pulse-chapter--dark" : "");

  return (
    <div className={cls} style={{ "--pulse-accent": accent, background: bg, color: fg }}>
      <div className="pulse-chapter__bar">
        {p.showWordmark
          ? <div className="pulse-wordmark">{COPY.brand}<sup>®</sup></div>
          : <span />}
        {p.showSheetLabel && <div className="pulse-chapter__bar-meta">{COPY.barMeta} · {COPY.sheet}</div>}
      </div>

      <div className="pulse-chapter__main">
        <div className="pulse-chapter__text">
          <div className="pulse-chapter__eyebrow" style={{ color: eyebrowColor }}>{COPY.eyebrow}</div>
          <h1 className="pulse-chapter__title">{COPY.title}</h1>
          <div className="pulse-chapter__sub">{COPY.sub}</div>
        </div>
        {p.showBigNumber && (
          <div className="pulse-chapter__num" style={{ color: numColor }}>{COPY.num}</div>
        )}
      </div>

      <div className="pulse-chapter__foot">
        {nKw > 0 && (
          <div className="pulse-chapter__kw">
            {COPY.keywords.slice(0, nKw).map((k, i) => (
              <span className="pulse-chapter__chip" key={i}>{k}</span>
            ))}
          </div>
        )}
        {p.showColorBand && (
          <div className="pulse-chapter__band" aria-hidden="true">
            {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
          </div>
        )}
      </div>
    </div>
  );
}

PulseChapter03.controls = [
  { key: "theme", type: "radio", label: "背景主题", default: "color",
    options: [{ value: "dark", label: "深色" }, { value: "paper", label: "纸色" }, { value: "color", label: "色块" }],
    description: "章节页背景：深色 / 纸色 / 整页色块。" },
  { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[0], options: SPECTRUM,
    description: "「色块」主题下的整页背景色。" },
  { key: "showBigNumber", type: "toggle", label: "大号章节号", default: true,
    description: "右侧的超大章节编号。" },
  { key: "keywordCount", type: "slider", label: "关键词数量", default: 4, min: 0, max: 4, step: 1,
    description: "底部关键词标签数量（0 隐藏）。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标与章节编号的强调色（色块主题除外）。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "底部的色谱条带。" },
  { key: "showWordmark", type: "toggle", label: "品牌标识", default: true,
    description: "左上角的品牌标识。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的章节 / 页码标签。" },
];
PulseChapter03.defaults = PulseChapter03.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseChapter03;
export const controls = PulseChapter03.controls || [];
export const defaults = PulseChapter03.defaults || {};
