/* =========================================================================
   PulseMonolith — P70 big-number page ("人形机器人 / Anchor Figure" archetype).
   A second, deliberately distinct single-figure page (vs. PulseBigNumber P24):
   here the dominant numeral sits as a MONOLITH beside a vertical, TR-808-style
   COLOR LEVEL METER (N stacked segments lit to a level, one emphasizable),
   with a caption + supporting line under the number and 0–n aux metrics stacked
   on the right. Echoes the cover's oversized numerals and the reference's
   vertical fader columns. Self-contained: React + .pulse-* CSS only; by props.
   `export default PulseMonolith; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "FIGURE AI CASE",
  title: "人形机器人",
  sheet: "CASE · 70 / 80",
  number: "6.8",
  unit: "亿美元",
  caption: "Figure AI 最大单笔融资。",
  message: "关键不只是 demo，而是供应链、可靠性和量产成本。",
  meterCap: "量产就绪度",
  meterUnit: "READINESS LEVEL",
  aux: [
    { k: "硬件迭代", v: "3", u: "代" },
    { k: "合作产线", v: "2", u: "条" },
    { k: "赛道", v: "人形机器人", u: "" },
  ],
  conclusion: "硬件 AI 要用量产证明自己。",
};

const controls = [
  { key: "showMeter", type: "toggle", label: "色阶量表", default: true,
    description: "主数字旁的竖向色阶量表（关闭则数字占满）。" },
  { key: "meterSegments", type: "slider", label: "色阶段数", default: 7, min: 3, max: 7, step: 1,
    description: "竖向量表的色块段数。" },
  { key: "meterLevel", type: "slider", label: "点亮段数", default: 4, min: 1, max: 7, step: 1,
    description: "量表自下而上点亮的段数。" },
  { key: "focusEnabled", type: "toggle", label: "重点段", default: true,
    description: "是否突出某一段（描边强调）。" },
  { key: "focusIndex", type: "slider", label: "重点段序号", default: 4, min: 1, max: 7, step: 1,
    description: "被突出的色阶段序号（自下而上，从 1 起）。" },
  { key: "auxCount", type: "slider", label: "辅助指标数量", default: 3, min: 0, max: 3, step: 1,
    description: "右侧支撑指标的数量（0 隐藏整列）。" },
  { key: "showCaption", type: "toggle", label: "解释说明", default: true,
    description: "主数字下方的一句解释说明。" },
  { key: "showMessage", type: "toggle", label: "支撑文案", default: true,
    description: "解释下方的一句支撑性文案。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[2], options: SPECTRUM,
    description: "主数字 / 眉标 / 重点段的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseMonolith(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const segs = Math.max(3, Math.min(7, p.meterSegments));
  const level = Math.max(1, Math.min(segs, p.meterLevel));
  const focusSeg = p.focusEnabled ? Math.min(p.focusIndex, segs) - 1 : -1;
  const aux = COPY.aux.slice(0, Math.max(0, Math.min(COPY.aux.length, p.auxCount)));

  return (
    <div className="pulse-slide pulse-mono" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-mono__body">
        <div className="pulse-mono__stage">
          {p.showMeter && (
            <div className="pulse-mono__meter">
              <div className="pulse-mono__meter-col">
                {Array.from({ length: segs }).map((_, i) => {
                  const idx = segs - 1 - i;          // render top→bottom; idx is bottom-based
                  const on = idx < level;
                  const isFocus = idx === focusSeg;
                  const col = SPECTRUM[idx % SPECTRUM.length];
                  return (
                    <div key={i} className={"pulse-mono__seg" + (isFocus ? " pulse-mono__seg--focus" : "")}
                      style={on
                        ? { background: col, borderColor: isFocus ? "var(--pulse-ink)" : "transparent" }
                        : { background: "transparent", borderColor: "var(--pulse-hair)" }} />
                  );
                })}
              </div>
              <div className="pulse-mono__meter-cap">
                <span className="pulse-label">{COPY.meterCap}</span>
                <span className="pulse-mono-tag">{COPY.meterUnit}</span>
              </div>
            </div>
          )}

          <div className="pulse-mono__figure">
            <div className="pulse-mono__num" style={{ color: accent }}>
              <b>{COPY.number}</b><em>{COPY.unit}</em>
            </div>
            {p.showCaption && <div className="pulse-mono__caption">{COPY.caption}</div>}
            {p.showMessage && <div className="pulse-mono__msg">{COPY.message}</div>}
          </div>

          {aux.length > 0 && (
            <div className="pulse-mono__aux">
              {aux.map((a, i) => (
                <div className="pulse-mono__aux-item" key={i}>
                  <span className="pulse-mono__aux-v">{a.v}{a.u ? <small>{a.u}</small> : null}</span>
                  <span className="pulse-mono__aux-k">{a.k}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-mono__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseMonolith.controls = controls;
PulseMonolith.defaults = defaults;
export default PulseMonolith;
export { controls };
export { defaults };
