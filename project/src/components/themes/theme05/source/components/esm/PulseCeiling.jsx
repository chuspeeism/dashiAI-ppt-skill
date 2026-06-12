/* =========================================================================
   PulseCeiling — P75 big-number page ("毛利天花板 / Margin Ceiling" archetype).
   A deliberately distinct single-figure page (vs. PulseBigNumber P24 / Monolith
   P70 / Hero P46): the dominant numeral sits beside a vertical PRESSURE GAUGE
   whose fill rises from the floor toward a bold THRESHOLD ("ceiling") line, with
   a hatched headroom zone above — visualising a cost/pressure level pushing
   against a hard cap (compute cost eating gross margin). A caption + supporting
   line under the number and 0–n aux metrics on the right. The reusable template
   for any "single headline % + cap/ceiling pressure" page.

   Self-contained: React + .pulse-* CSS only; everything by props. Text/data live
   in COPY (not prop-driven).
   `export default PulseCeiling; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "COMPUTE COST RISK",
  title: "毛利天花板",
  sheet: "RISK · 75 / 80",
  number: "61",
  unit: "%",
  caption: "训练预算模拟增长幅度。",
  message: "如果推理成本降不下来，收入增长会被毛利吞掉。",
  gaugeCap: "成本压力线",
  gaugeUnit: "COST PRESSURE",
  ceilingLabel: "毛利天花板",
  floorLabel: "收入基线",
  aux: [
    { k: "推理成本占收入", v: "31", u: "%" },
    { k: "毛利率中位数", v: "54", u: "%" },
    { k: "风险", v: "算力成本", u: "" },
  ],
  conclusion: "算力成本是模型商业化的硬约束。",
};

const controls = [
  { key: "showGauge", type: "toggle", label: "压力量表", default: true,
    description: "主数字旁的竖向压力量表（关闭则数字占满）。" },
  { key: "gaugeValue", type: "slider", label: "压力水位", default: 61, min: 0, max: 100, step: 1,
    description: "量表自下而上的填充比例（0–100，天花板线随之移动）。" },
  { key: "showThresholdLine", type: "toggle", label: "天花板线", default: true,
    description: "填充顶部的天花板阈值线与上方剖面网纹。" },
  { key: "auxCount", type: "slider", label: "辅助指标数量", default: 3, min: 0, max: 3, step: 1,
    description: "右侧支撑指标的数量（0 隐藏整列）。" },
  { key: "numberAlign", type: "radio", label: "主数字对齐", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "主数字与说明的对齐方式。" },
  { key: "showCaption", type: "toggle", label: "解释说明", default: true,
    description: "主数字下方的一句解释说明。" },
  { key: "showMessage", type: "toggle", label: "支撑文案", default: true,
    description: "解释下方的一句支撑性文案。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "主数字 / 眉标 / 压力填充的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseCeiling(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const fill = Math.max(0, Math.min(100, p.gaugeValue));
  const aux = COPY.aux.slice(0, Math.max(0, Math.min(COPY.aux.length, p.auxCount)));
  const centered = p.numberAlign === "center";

  return (
    <div className="pulse-slide pulse-cei" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-cei__body">
        <div className="pulse-cei__stage">
          {p.showGauge && (
            <div className="pulse-cei__gauge">
              <div className="pulse-cei__col">
                <div className="pulse-cei__head" style={{ height: (100 - fill) + "%" }}>
                  {p.showThresholdLine && <span className="pulse-cei__hatch" />}
                </div>
                <div className="pulse-cei__fill" style={{ height: fill + "%", background: accent }}>
                  {p.showThresholdLine && (
                    <span className="pulse-cei__ceiling">
                      <span className="pulse-cei__ceiling-tag">{COPY.ceilingLabel}</span>
                    </span>
                  )}
                  <span className="pulse-cei__fill-v">{fill}<small>%</small></span>
                </div>
              </div>
              <div className="pulse-cei__gauge-cap">
                <span className="pulse-label">{COPY.gaugeCap}</span>
                <span className="pulse-mono">{COPY.gaugeUnit}</span>
              </div>
            </div>
          )}

          <div className={"pulse-cei__figure" + (centered ? " pulse-cei__figure--c" : "")}>
            <div className="pulse-cei__num" style={{ color: accent }}>
              <b>{COPY.number}</b><em>{COPY.unit}</em>
            </div>
            {p.showCaption && <div className="pulse-cei__caption">{COPY.caption}</div>}
            {p.showMessage && <div className="pulse-cei__msg">{COPY.message}</div>}
          </div>

          {aux.length > 0 && (
            <div className="pulse-cei__aux">
              {aux.map((a, i) => (
                <div className="pulse-cei__aux-item" key={i}>
                  <span className="pulse-cei__aux-v">{a.v}{a.u ? <small>{a.u}</small> : null}</span>
                  <span className="pulse-cei__aux-k">{a.k}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-cei__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseCeiling.controls = controls;
PulseCeiling.defaults = defaults;
export default PulseCeiling;
export { controls };
export { defaults };
