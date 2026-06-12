/* =========================================================================
   PulseQuote — P14 quote page ("金句结论页 / Quote").
   A generic single-statement slide: one big quote as the focal point, an
   optional row of N supporting conclusion points, and an optional source
   footer. Switchable light / dark theme and left / center alignment.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseQuote.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "CONCLUSION",
  sheet: "CONCLUSION · 14 / 32",
  // quote rendered as JSX so key phrases can be emphasised
  quote: (
    <React.Fragment>
      资本下一阶段，将从<span className="mute">赌叙事</span>，<br />
      转向<span className="hl">看兑现</span>。
    </React.Fragment>
  ),
  sub: "三条核心结论",
  points: [
    { n: "01", t: "头部集中", d: "资金高度向头部公司集中，赢家通吃格局确立。" },
    { n: "02", t: "兑现为王", d: "估值锚从叙事转向收入、毛利与客户留存。" },
    { n: "03", t: "底座确定", d: "算力与数据基础设施最接近企业刚性预算。" },
  ],
  source: "数据口径：2024 全年 · 单笔 ≥1 亿美元 · 样本 97 笔",
};

function PulseQuote(props) {
  const p = Object.assign({}, PulseQuote.defaults, props);
  const accent = p.accentColor;
  const dark = p.theme === "dark";
  const center = p.quoteAlign === "center";
  const nPts = Math.max(0, Math.min(COPY.points.length, p.conclusionCount));
  const pts = COPY.points.slice(0, nPts);

  return (
    <div
      className={"pulse-slide pulse-quote" + (dark ? " pulse-quote--dark" : "")}
      style={{ "--pulse-accent": accent }}
    >
      <div className="pulse-quote__top">
        <div className="pulse-eyebrow pulse-quote__eyebrow">{COPY.eyebrow}</div>
        {p.showSheetLabel && <div className="pulse-quote__sheet">{COPY.sheet}</div>}
      </div>

      <div className={"pulse-quote__main" + (center ? " pulse-quote__main--center" : "")}>
        {p.showQuoteMark && <span className="pulse-quote__mark">“</span>}
        <div className="pulse-quote__big">{COPY.quote}</div>
        <div className="pulse-quote__sub">{COPY.sub}</div>
      </div>

      {nPts > 0 && (
        <div className="pulse-quote__points">
          {pts.map((pt, i) => (
            <div className="pulse-quote__point" key={i}>
              <div className="pulse-quote__point-n">{pt.n}</div>
              <div className="pulse-quote__point-t">{pt.t}</div>
              <div className="pulse-quote__point-d">{pt.d}</div>
            </div>
          ))}
        </div>
      )}

      {(p.showSource || p.showColorBand) && (
        <div className="pulse-quote__foot">
          {p.showSource ? (
            <div className="pulse-quote__source">{COPY.source}</div>
          ) : <span />}
          {p.showColorBand && (
            <div className="pulse-quote__band" aria-hidden="true">
              {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

PulseQuote.controls = [
  { key: "theme", type: "radio", label: "背景主题", default: "paper",
    options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }],
    description: "页面整体明 / 暗背景。" },
  { key: "quoteAlign", type: "radio", label: "金句对齐", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "金句的对齐方式。" },
  { key: "conclusionCount", type: "slider", label: "结论点数量", default: 3, min: 0, max: 3, step: 1,
    description: "金句下方的支撑结论点数量（0 隐藏）。" },
  { key: "showQuoteMark", type: "toggle", label: "引号装饰", default: true,
    description: "金句上方的大号装饰引号。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标、引号与金句重点词的强调色。" },
  { key: "showSource", type: "toggle", label: "数据来源", default: true,
    description: "底部的数据口径 / 来源说明。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "右下角的小色谱条带。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseQuote.defaults = PulseQuote.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseQuote;
export const controls = PulseQuote.controls || [];
export const defaults = PulseQuote.defaults || {};
