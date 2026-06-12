/* =========================================================================
   PulseShare — P06 chart page ("赛道占比 / Composition" archetype).
   A generic part-to-whole chart slide: switchable chart type (donut / bar /
   stack), a focus segment, an adjustable segment count, and a legend list.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseShare.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

const COPY = {
  eyebrow: "CROSS-SECTION",
  title: "横向透视 · 赛道占比",
  sub: "钱流向哪些赛道",
  sheet: "SHARE · 06 / 32",
  unit: "SHARE OF $97B",
  segments: [
    { name: "通用大模型", v: 43.3, c: SPECTRUM[0] },
    { name: "垂直应用",   v: 25.3, c: SPECTRUM[1] },
    { name: "基础设施",   v: 16.3, c: SPECTRUM[4] },
    { name: "AI 芯片",    v: 10.0, c: SPECTRUM[5] },
    { name: "其他",       v: 5.1,  c: SPECTRUM[3] },
  ],
  conclusion: "融资额排名背后，是资本对叙事和兑现的双重押注。",
};

const R = 40, C = 2 * Math.PI * R;

function Donut({ segs, focusEnabled, focusIndex }) {
  const total = segs.reduce((a, s) => a + s.v, 0);
  let acc = 0;
  const focus = focusEnabled ? (segs[focusIndex - 1] || segs[0]) : segs[0];
  return (
    <div className="pulse-share__donut">
      <svg viewBox="0 0 100 100">
        {segs.map((s, i) => {
          const frac = s.v / total;
          const len = frac * C;
          const off = -acc * C;
          acc += frac;
          const isFocus = focusEnabled && i + 1 === focusIndex;
          return (
            <circle key={i} className="pulse-share__donut-seg" cx="50" cy="50" r={R}
              stroke={s.c} strokeWidth={isFocus ? 19 : 14}
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={off} />
          );
        })}
      </svg>
      <div className="pulse-share__donut-center">
        <div className="pulse-share__donut-num">{focus.v}%</div>
        <div className="pulse-share__donut-cap">{focus.name}</div>
      </div>
    </div>
  );
}

function Bars({ segs, focusEnabled, focusIndex }) {
  const max = Math.max.apply(null, segs.map((s) => s.v));
  return (
    <div className="pulse-share__bars">
      {segs.map((s, i) => {
        const isFocus = focusEnabled && i + 1 === focusIndex;
        return (
          <div key={i} className={"pulse-share__barrow" + (isFocus ? " pulse-share__barrow--focus" : "")}>
            <div className="pulse-share__barrow-h"><span>{s.name}</span><span>{s.v}%</span></div>
            <div className="pulse-share__barrow-track">
              <div className="pulse-share__barrow-fill" style={{ width: (s.v / max) * 100 + "%", background: s.c }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Stack({ segs }) {
  const total = segs.reduce((a, s) => a + s.v, 0);
  return (
    <div className="pulse-share__stack">
      <div className="pulse-share__stack-bar">
        {segs.map((s, i) => (
          <i key={i} style={{ background: s.c, width: (s.v / total) * 100 + "%" }}>
            {s.v / total >= 0.1 && <span>{s.v}%</span>}
          </i>
        ))}
      </div>
    </div>
  );
}

function PulseShare(props) {
  const p = Object.assign({}, PulseShare.defaults, props);
  const accent = p.accentColor;
  const n = Math.max(3, Math.min(COPY.segments.length, p.segmentCount));
  const segs = COPY.segments.slice(0, n);

  return (
    <div className="pulse-slide pulse-share" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-share__body">
        <div className="pulse-share__viz">
          {p.chartType === "donut" && (
            <Donut segs={segs} focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} />
          )}
          {p.chartType === "bar" && (
            <Bars segs={segs} focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} />
          )}
          {p.chartType === "stack" && <Stack segs={segs} />}
        </div>

        {p.showLegend && (
          <div className="pulse-share__legend">
            <div className="pulse-share__leg-head pulse-label" style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>{COPY.sub}</span><span className="pulse-mono">{COPY.unit}</span>
            </div>
            {segs.map((s, i) => {
              const isFocus = p.focusEnabled && i + 1 === p.focusIndex;
              return (
                <div key={i} className={"pulse-share__leg-row" + (isFocus ? " pulse-share__leg-row--focus" : "")}>
                  <span className="pulse-share__leg-dot" style={{ background: s.c }} />
                  <span className="pulse-share__leg-name">{s.name}</span>
                  <span className="pulse-share__leg-val">{s.v}%</span>
                </div>
              );
            })}
            {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

PulseShare.controls = [
  { key: "chartType", type: "radio", label: "图表类型", default: "donut",
    options: [{ value: "donut", label: "环形" }, { value: "bar", label: "条形" }, { value: "stack", label: "堆叠" }],
    description: "占比图呈现方式：环形 / 条形 / 堆叠。" },
  { key: "segmentCount", type: "slider", label: "分段数量", default: 5, min: 3, max: 5, step: 1,
    description: "参与占比拆分的分段数量。" },
  { key: "focusEnabled", type: "toggle", label: "重点分段", default: true,
    description: "是否突出某一个分段（环形居中显示该项）。" },
  { key: "focusIndex", type: "slider", label: "重点分段序号", default: 1, min: 1, max: 5, step: 1,
    description: "被突出的分段序号（从 1 起）。" },
  { key: "showLegend", type: "toggle", label: "图例列表", default: true,
    description: "右侧带数值的图例列表。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "图例下方的一句装饰性结论。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标与重点项的强调色。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseShare.defaults = PulseShare.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseShare;
export const controls = PulseShare.controls || [];
export const defaults = PulseShare.defaults || {};
