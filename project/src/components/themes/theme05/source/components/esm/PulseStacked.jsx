/* =========================================================================
   PulseStacked — P23 chart page ("金额区间结构 / Dual-dimension Split" archetype).
   A generic "same segments, two measures" comparison: two 100%-stacked bars
   share one segmentation (e.g. count vs amount), making divergence between the
   two measures obvious. Focus segment, optional second dimension, side legend
   carrying both raw measures.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseStacked.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
// Each segment carries two measures: a (count) and b (amount).
const COPY = {
  eyebrow: "DEAL SIZE SPLIT",
  title: "金额区间结构",
  sub: "交易规模分布",
  sheet: "SPLIT · 23 / 32",
  measureA: { name: "笔数", unit: "笔" },
  measureB: { name: "金额", unit: "亿美元" },
  segments: [
    { name: "1–2 亿美元",  a: 41, b: 58,  c: SPECTRUM[3] },
    { name: "2–5 亿美元",  a: 29, b: 91,  c: SPECTRUM[4] },
    { name: "5–10 亿美元", a: 15, b: 103, c: SPECTRUM[1] },
    { name: "10 亿以上",   a: 12, b: 718, c: SPECTRUM[0] },
  ],
  conclusion: "市场被少数超级交易重新定价。",
};

function StackBar({ segs, measure, total, focusEnabled, focusIndex, showValue }) {
  return (
    <div className="pulse-dual__stack">
      {segs.map((s, i) => {
        const val = s[measure];
        const pct = (val / total) * 100;
        const focus = focusEnabled && i + 1 === focusIndex;
        const dim = focusEnabled && !focus;
        return (
          <div key={i}
            className={"pulse-dual__seg" + (focus ? " pulse-dual__seg--focus" : "") + (dim ? " pulse-dual__seg--dim" : "")}
            style={{ flex: pct + " 1 0", background: s.c }}>
            {showValue && pct >= 9 && (
              <React.Fragment>
                <div className="pulse-dual__seg-v">{val}</div>
                <div className="pulse-dual__seg-p">{pct.toFixed(0)}%</div>
              </React.Fragment>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PulseStacked(props) {
  const p = Object.assign({}, PulseStacked.defaults, props);
  const accent = p.accentColor;
  const n = Math.max(2, Math.min(COPY.segments.length, p.segmentCount));
  const segs = COPY.segments.slice(0, n);
  const totalA = segs.reduce((s, x) => s + x.a, 0);
  const totalB = segs.reduce((s, x) => s + x.b, 0);

  return (
    <div className="pulse-slide pulse-dual" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-dual__body">
        <div className="pulse-dual__main">
          <div className="pulse-dual__row">
            <div className="pulse-dual__row-h">
              <span className="pulse-dual__row-name">{COPY.measureA.name}分布</span>
              <span className="pulse-dual__row-total">合计 {totalA} {COPY.measureA.unit}</span>
            </div>
            <StackBar segs={segs} measure="a" total={totalA}
              focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} showValue={p.showValue} />
          </div>

          {p.showSecondDimension && (
            <div className="pulse-dual__row">
              <div className="pulse-dual__row-h">
                <span className="pulse-dual__row-name">{COPY.measureB.name}分布</span>
                <span className="pulse-dual__row-total">合计 {totalB} {COPY.measureB.unit}</span>
              </div>
              <StackBar segs={segs} measure="b" total={totalB}
                focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} showValue={p.showValue} />
            </div>
          )}
        </div>

        <div className="pulse-dual__side">
          <div className="pulse-label" style={{ marginBottom: 4 }}>{COPY.sub}</div>
          {p.showLegend && (
            <div className="pulse-dual__legend">
              <div className="pulse-dual__leghd">
                <span className="sp" />
                <span className="pulse-label">{COPY.measureA.name}</span>
                <span className="pulse-label">{COPY.measureB.name}</span>
              </div>
              {segs.map((s, i) => {
                const focus = p.focusEnabled && i + 1 === p.focusIndex;
                return (
                  <div key={i} className={"pulse-dual__leg" + (focus ? " pulse-dual__leg--focus" : "")}>
                    <span className="pulse-dual__leg-dot" style={{ background: s.c }} />
                    <span className="pulse-dual__leg-name">{s.name}</span>
                    <span className="pulse-dual__leg-num">{s.a}</span>
                    <span className="pulse-dual__leg-num">{s.b}</span>
                  </div>
                );
              })}
            </div>
          )}
          {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
        </div>
      </div>
    </div>
  );
}

PulseStacked.controls = [
  { key: "segmentCount", type: "slider", label: "分段数量", default: 4, min: 2, max: 4, step: 1,
    description: "参与拆分的分段（金额区间）数量。" },
  { key: "showSecondDimension", type: "toggle", label: "第二维度", default: true,
    description: "是否显示第二条维度堆叠条（关闭则仅显示第一维度）。" },
  { key: "focusEnabled", type: "toggle", label: "重点分段", default: true,
    description: "是否突出某一个分段（其余分段淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点分段序号", default: 4, min: 1, max: 4, step: 1,
    description: "被突出的分段序号（从 1 起）。" },
  { key: "showValue", type: "toggle", label: "数值显示", default: true,
    description: "在足够宽的色块内显示数值与占比。" },
  { key: "showLegend", type: "toggle", label: "图例列表", default: true,
    description: "右侧带两个维度数值的明细列表。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "右下角的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseStacked.defaults = PulseStacked.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseStacked;
export const controls = PulseStacked.controls || [];
export const defaults = PulseStacked.defaults || {};
