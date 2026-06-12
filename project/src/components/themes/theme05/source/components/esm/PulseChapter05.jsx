/* =========================================================================
   PulseChapter05 — P72 chapter divider, a deliberately DISTINCT take on the
   section-break archetype (vs. PulseChapter P15 / 03 P26 / 04 P49 which share a
   single layout). This one is a TRANSIT DEPARTURE BOARD: an oversized chapter
   title + number "platform" header over a board of keyword "departures" — each
   row a mono index code + zh keyword + en gloss + status dot (one row
   emphasizable as the next stop). Echoes the reference's "Platform 08 / Helsinki
   Oslo London" signage and the Swiss transit aesthetic. Self-contained:
   React + .pulse-ch5-* CSS only; controlled entirely by props.
   `export default PulseChapter05; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text intentionally NOT prop-driven, per spec).
const COPY = {
  brand: "AICL",
  boardMeta: "SECTION DIVIDER",
  eyebrow: "CHAPTER 05",
  num: "05",
  title: "风险与策略",
  sub: "从估值压力到投资筛选",
  sheet: "72 / 80",
  platformLabel: "CHAPTER",
  // each row: mono code + zh keyword + en gloss
  rows: [
    { code: "05·1", k: "估值泡沫", en: "VALUATION" },
    { code: "05·2", k: "收入验证", en: "REVENUE" },
    { code: "05·3", k: "合规监管", en: "COMPLIANCE" },
    { code: "05·4", k: "算力成本", en: "COMPUTE COST" },
    { code: "05·5", k: "垂直应用筛选", en: "VERTICAL PICK" },
  ],
};

const controls = [
  { key: "theme", type: "radio", label: "背景主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "paper", label: "纸色" }, { value: "color", label: "色块" }],
    description: "章节页背景：深色 / 纸色 / 整页色块。" },
  { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[5], options: SPECTRUM,
    description: "「色块」主题下的整页背景色。" },
  { key: "showBigNumber", type: "toggle", label: "站台号", default: true,
    description: "右上的大号章节「站台」编号。" },
  { key: "rowCount", type: "slider", label: "看板行数", default: 5, min: 2, max: 5, step: 1,
    description: "出发看板的关键词行数。" },
  { key: "showStatus", type: "toggle", label: "状态灯", default: true,
    description: "各行右侧的状态指示灯。" },
  { key: "showGloss", type: "toggle", label: "英文注", default: true,
    description: "各行关键词的英文注释列。" },
  { key: "focusEnabled", type: "toggle", label: "高亮行", default: true,
    description: "是否高亮某一行（作为「下一站」）。" },
  { key: "focusIndex", type: "slider", label: "高亮行序号", default: 1, min: 1, max: 5, step: 1,
    description: "被高亮的看板行序号（从 1 起）。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 站台号 / 高亮行 / 状态灯的强调色。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "底部的色谱条带。" },
  { key: "showWordmark", type: "toggle", label: "品牌标识", default: true,
    description: "左上角的品牌标识。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的章节 / 页码标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseChapter05(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const theme = p.theme; // dark | paper | color
  const nRow = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
  const rows = COPY.rows.slice(0, nRow);
  const focusRow = p.focusEnabled ? Math.min(p.focusIndex, nRow) - 1 : -1;

  let bg, fg, numColor, eyebrowColor, rowLine, codeColor;
  if (theme === "paper") {
    bg = "var(--pulse-paper)"; fg = "var(--pulse-ink)";
    numColor = accent; eyebrowColor = accent; rowLine = "var(--pulse-hair)"; codeColor = "var(--pulse-mute)";
  } else if (theme === "color") {
    bg = p.bgColor; fg = "#fff";
    numColor = "rgba(255,255,255,0.22)"; eyebrowColor = "#fff"; rowLine = "rgba(255,255,255,0.22)"; codeColor = "rgba(255,255,255,0.7)";
  } else { // dark
    bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)";
    numColor = accent; eyebrowColor = accent; rowLine = "rgba(255,255,255,0.16)"; codeColor = "rgba(255,255,255,0.55)";
  }

  return (
    <div className="pulse-slide pulse-ch5" style={{ "--pulse-accent": accent, background: bg, color: fg, "--ch5-line": rowLine, "--ch5-code": codeColor }}>
      <div className="pulse-ch5__bar">
        {p.showWordmark
          ? <div className="pulse-wordmark">{COPY.brand}<sup>®</sup></div>
          : <span />}
        {p.showSheetLabel && <div className="pulse-ch5__bar-meta">{COPY.boardMeta} · {COPY.sheet}</div>}
      </div>

      <div className="pulse-ch5__head">
        <div className="pulse-ch5__head-l">
          <div className="pulse-ch5__eyebrow" style={{ color: eyebrowColor }}>{COPY.eyebrow}</div>
          <h1 className="pulse-ch5__title">{COPY.title}</h1>
          <div className="pulse-ch5__sub">{COPY.sub}</div>
        </div>
        {p.showBigNumber && (
          <div className="pulse-ch5__platform">
            <span className="pulse-ch5__platform-label" style={{ color: eyebrowColor }}>{COPY.platformLabel}</span>
            <span className="pulse-ch5__num" style={{ color: numColor }}>{COPY.num}</span>
          </div>
        )}
      </div>

      <div className="pulse-ch5__board">
        {rows.map((r, i) => {
          const isFocus = i === focusRow;
          return (
            <div className={"pulse-ch5__row" + (isFocus ? " pulse-ch5__row--focus" : "")} key={i}
              style={isFocus ? { background: accent, color: "#fff", borderColor: "transparent" } : null}>
              <span className="pulse-ch5__code" style={isFocus ? { color: "rgba(255,255,255,0.85)" } : null}>{r.code}</span>
              <span className="pulse-ch5__kw">{r.k}</span>
              {p.showGloss && <span className="pulse-ch5__gloss" style={isFocus ? { color: "rgba(255,255,255,0.8)" } : null}>{r.en}</span>}
              {p.showStatus && (
                <span className="pulse-ch5__status">
                  <i style={{ background: isFocus ? "#fff" : accent }} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {p.showColorBand && (
        <div className="pulse-ch5__band" aria-hidden="true">
          {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
        </div>
      )}
    </div>
  );
}

PulseChapter05.controls = controls;
PulseChapter05.defaults = defaults;
export default PulseChapter05;
export { controls };
export { defaults };
