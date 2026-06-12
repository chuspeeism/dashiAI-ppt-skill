/* =========================================================================
   PulseScorecard — P84 table page ("综合评分 / Scorecard" archetype).
   A generic GRADED MATRIX table: N subjects (rows) × M dimensions (columns),
   each cell a 0–100 score rendered as a letter grade, the raw score, or a
   filled-dot rating, on a colour-coded block (heat / mono / accent scales).
   An optional emphasised "overall" column closes each row. One row can be
   focused. The fourth distinct table_page archetype — its identifying element
   is the colour-graded cell grid (vs. chip / data-bar / gauge / signal-dot
   tables elsewhere). Reusable for any "score subjects across dimensions" page.

   Self-contained: React + the shared .pulse-score / .pulse-* CSS. Text/data live
   in COPY (not prop-driven); structure & styling are prop-driven (see controls).
   `export default PulseScorecard; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "Composite Scorecard",
  title: "赛道综合评分",
  sheet: "TABLE · 84 / 86",
  intro: "六条评分维度按 0–100 标准化，综合分加权汇总，用于横向比较各赛道当前的投资性价比。",
  subjectHead: "赛道 / Segment",
  overallHead: "综合",
  cols: [
    { name: "融资热度", en: "Heat" },
    { name: "商业兑现", en: "Revenue" },
    { name: "技术壁垒", en: "Moat" },
    { name: "风险控制", en: "Risk" },
    { name: "退出预期", en: "Exit" },
  ],
  rows: [
    { name: "大模型基础设施", en: "Foundation", scores: [96, 71, 92, 64, 78], overall: 84 },
    { name: "AI 应用层", en: "Applications", scores: [88, 83, 58, 72, 80], overall: 78 },
    { name: "算力与芯片", en: "Compute", scores: [82, 66, 88, 60, 70], overall: 75 },
    { name: "企业服务", en: "Enterprise", scores: [70, 86, 62, 81, 74], overall: 74 },
    { name: "医疗 AI", en: "Healthcare", scores: [61, 54, 79, 58, 56], overall: 62 },
    { name: "机器人与具身", en: "Robotics", scores: [74, 41, 70, 47, 52], overall: 55 },
  ],
  conclusion: "基础设施综合分领先，应用层胜在兑现与退出预期均衡。",
};

// 0–100 → grade band. band index 0 (best) … 4 (worst).
function band(v) { return v >= 85 ? 0 : v >= 75 ? 1 : v >= 65 ? 2 : v >= 55 ? 3 : 4; }
const GRADE = ["A", "B", "C", "D", "E"];
const HEAT = [SPECTRUM[3], SPECTRUM[4], SPECTRUM[2], SPECTRUM[1], SPECTRUM[0]]; // green→red

const controls = [
  { key: "rowCount", type: "slider", label: "评分主体数", default: 5, min: 3, max: 6, step: 1,
    description: "参与评分的主体（行）数量（3–6）。" },
  { key: "colCount", type: "slider", label: "评分维度数", default: 4, min: 3, max: 5, step: 1,
    description: "评分维度（列）数量（3–5）。" },
  { key: "gradeStyle", type: "radio", label: "单元样式", default: "letter",
    options: [{ value: "letter", label: "等级" }, { value: "score", label: "分值" }, { value: "dot", label: "点阵" }],
    description: "单元格内容：字母等级 / 0–100 分值 / 五点评级。" },
  { key: "colorScale", type: "radio", label: "色阶", default: "heat",
    options: [{ value: "heat", label: "热力" }, { value: "accent", label: "强调" }, { value: "mono", label: "单色" }],
    description: "单元格底色映射：热力色阶 / 强调色深浅 / 单色深浅。" },
  { key: "showOverall", type: "toggle", label: "综合列", default: true,
    description: "末尾加权综合分列（强调显示）。" },
  { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
    description: "是否突出某一行（整行描边）。" },
  { key: "focusIndex", type: "slider", label: "重点序号", default: 1, min: 1, max: 6, step: 1,
    description: "重点行序号。" },
  { key: "zebra", type: "toggle", label: "隔行底色", default: false,
    description: "行名称列的斑马纹底色。" },
  { key: "showIntro", type: "toggle", label: "引导文案", default: true,
    description: "表格上方的引导说明。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标 / 表头 / 重点行 / 综合列的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "表格下方的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseScorecard(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const nRow = Math.max(3, Math.min(COPY.rows.length, p.rowCount));
  const nCol = Math.max(3, Math.min(COPY.cols.length, p.colCount));
  const rows = COPY.rows.slice(0, nRow);
  const cols = COPY.cols.slice(0, nCol);
  const focus = Math.min(p.focusIndex, nRow) - 1;

  const grid = `minmax(300px, 1.5fr) repeat(${nCol}, 1fr)` + (p.showOverall ? " 168px" : "");

  function cellBg(v) {
    const b = band(v);
    if (p.colorScale === "heat") return HEAT[b];
    const t = [0.92, 0.74, 0.56, 0.4, 0.26][b];  // strength by band
    if (p.colorScale === "accent") return mix(accent, t);
    return `rgba(20,19,15,${(t * 0.86).toFixed(2)})`;
  }
  // approximate tint by overlaying onto paper via rgba of the hue is hard;
  // use opacity wash on the accent itself for a clean block.
  function mix(hex, t) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    // blend toward paper (#e9e4d6) for low strength
    const pr = 233, pg = 228, pb = 214, k = 0.18 + t * 0.82;
    const R = Math.round(pr + (r - pr) * k), G = Math.round(pg + (g - pg) * k), B = Math.round(pb + (b - pb) * k);
    return `rgb(${R},${G},${B})`;
  }

  function cellContent(v) {
    if (p.gradeStyle === "score") return <b>{v}</b>;
    if (p.gradeStyle === "dot") {
      const filled = Math.round(v / 20);
      return (
        <span className="pulse-score__dots">
          {Array.from({ length: 5 }).map((_, k) => <i key={k} className={k < filled ? "on" : ""} />)}
        </span>
      );
    }
    return <b>{GRADE[band(v)]}</b>;
  }

  return (
    <div className="pulse-slide pulse-score" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-score__body">
        {p.showIntro && <div className="pulse-score__intro">{COPY.intro}</div>}

        <div className="pulse-score__table">
          <div className="pulse-score__hrow" style={{ gridTemplateColumns: grid, background: accent }}>
            <div className="pulse-score__h pulse-score__h--name">{COPY.subjectHead}</div>
            {cols.map((c, i) => (
              <div key={i} className="pulse-score__h">{c.name}<small>{c.en}</small></div>
            ))}
            {p.showOverall && <div className="pulse-score__h pulse-score__h--ov">{COPY.overallHead}</div>}
          </div>

          {rows.map((r, ri) => {
            const isFocus = p.focusEnabled && ri === focus;
            return (
              <div key={ri}
                className={"pulse-score__row" + (p.zebra && ri % 2 ? " is-zebra" : "") + (isFocus ? " is-focus" : "")}
                style={{ gridTemplateColumns: grid }}>
                <div className="pulse-score__name">
                  <span className="pulse-score__name-zh">{r.name}</span>
                  <span className="pulse-score__name-en">{r.en}</span>
                </div>
                {r.scores.slice(0, nCol).map((v, ci) => (
                  <div key={ci} className={"pulse-score__cell pulse-score__cell--" + p.gradeStyle}
                    style={{ background: cellBg(v) }}>
                    <span className="pulse-score__cell-in">{cellContent(v)}</span>
                  </div>
                ))}
                {p.showOverall && (
                  <div className="pulse-score__ov">
                    <b style={{ color: accent }}>{r.overall}</b>
                    <small>{GRADE[band(r.overall)]}</small>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-score__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseScorecard.controls = controls;
PulseScorecard.defaults = defaults;
export default PulseScorecard;
export { controls };
export { defaults };
