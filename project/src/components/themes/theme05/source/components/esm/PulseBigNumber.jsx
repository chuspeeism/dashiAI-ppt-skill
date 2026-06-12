/* =========================================================================
   PulseBigNumber — P24 big-number page ("赛道平均融资额 / Headline Stat" archetype).
   A generic single-figure anchor page echoing the cover's oversized numerals
   and the spec sheet's supporting rows: one dominant number + unit, an
   explanatory caption, a supporting line, and 0–n supporting metrics.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseBigNumber.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "AVERAGE TICKET",
  title: "赛道平均融资额",
  sub: "平均单笔规模",
  sheet: "AVERAGE · 24 / 32",
  number: "10",
  unit: "亿美元",
  caption: "全年单笔大额融资的平均规模。",
  message: "融资规模越大，后续兑现压力越高。",
  aux: [
    { k: "大额事件", v: "97", u: "笔" },
    { k: "全年融资", v: "970", u: "亿美元" },
    { k: "最大单笔", v: "66", u: "亿美元" },
  ],
};

function PulseBigNumber(props) {
  const p = Object.assign({}, PulseBigNumber.defaults, props);
  const accent = p.accentColor;
  const aux = COPY.aux.slice(0, Math.max(0, Math.min(COPY.aux.length, p.auxCount)));
  const center = p.numberAlign === "center";

  return (
    <div className="pulse-slide pulse-big" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-big__body">
        <div className={"pulse-big__hero" + (center ? " pulse-big__hero--center" : "")}>
          <div className="pulse-big__num">
            <b>{COPY.number}</b>
            {p.showUnit && <em>{COPY.unit}</em>}
          </div>
          {p.showCaption && <div className="pulse-big__caption">{COPY.caption}</div>}
          {p.showMessage && <div className="pulse-big__msg">{COPY.message}</div>}
        </div>

        {aux.length > 0 && (
          <div className="pulse-big__aux">
            {aux.map((a, i) => (
              <div className="pulse-big__aux-item" key={i}>
                <div className="pulse-big__aux-k">{a.k}</div>
                <div className="pulse-big__aux-v">{a.v}<small>{a.u}</small></div>
              </div>
            ))}
          </div>
        )}

        {(p.showWordmark || p.showColorBand) && (
          <div className="pulse-big__foot">
            {p.showWordmark
              ? <span className="pulse-wordmark">PULSE<sup>R</sup></span>
              : <span />}
            {p.showColorBand && (
              <span className="pulse-big__band">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

PulseBigNumber.controls = [
  { key: "auxCount", type: "slider", label: "辅助指标数量", default: 3, min: 0, max: 3, step: 1,
    description: "底部支撑指标的数量（0 隐藏整行）。" },
  { key: "numberAlign", type: "radio", label: "主数字对齐", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "主数字与说明文字的对齐方式。" },
  { key: "showUnit", type: "toggle", label: "单位显示", default: true,
    description: "主数字后的单位后缀。" },
  { key: "showCaption", type: "toggle", label: "解释说明", default: true,
    description: "主数字下方的一句解释说明。" },
  { key: "showMessage", type: "toggle", label: "支撑文案", default: true,
    description: "解释下方的一句支撑性文案。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "主数字与眉标的强调色。" },
  { key: "showWordmark", type: "toggle", label: "品牌标识", default: true,
    description: "左下角的品牌标识。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "右下角的装饰色谱条。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseBigNumber.defaults = PulseBigNumber.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseBigNumber;
export const controls = PulseBigNumber.controls || [];
export const defaults = PulseBigNumber.defaults || {};
