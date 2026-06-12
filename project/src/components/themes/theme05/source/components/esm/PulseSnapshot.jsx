/* =========================================================================
   PulseSnapshot — P17 single-subject snapshot page ("数据快照" archetype).
   A generic "focal subject + metric spec + mini chart" slide: a giant subject
   glyph and a metric spec table on the left, a small switchable chart
   (bar / line / area) on a dark evidence panel at right with a focus marker.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseSnapshot.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "QUARTER BREAKDOWN",
  title: "冷启动季度",
  sub: "Q1 融资拆解",
  sheet: "Q1 · 17 / 32",
  glyph: "Q1",
  name: "Q1 融资拆解 · 起步阶段",
  metrics: [
    { k: "融资额", v: "162", u: "亿美元" },
    { k: "事件数", v: "18", u: "笔" },
    { k: "平均单笔", v: "9.0", u: "亿美元" },
    { k: "最大单笔", v: "32", u: "亿美元" },
  ],
  panelTitle: "月度拆解",
  panelNote: "MONTHLY · Q1",
  unit: "亿美元 / 月",
  points: [
    { axis: "1月", v: 45 },
    { axis: "2月", v: 58 },
    { axis: "3月", v: 59 },
  ],
  conclusion: "全年热度从保守启动开始。",
};

function MiniChart({ pts, type, focusEnabled, focusIndex, accent }) {
  const max = Math.max.apply(null, pts.map((p) => p.v)) * 1.18;
  const base = "#efe9da";
  const n = pts.length;
  const xAt = (i) => (n === 1 ? 50 : (i / (n - 1)) * 96 + 2);
  const yAt = (v) => 100 - (v / max) * 100;
  const linePts = pts.map((p, i) => `${xAt(i)},${yAt(p.v)}`).join(" ");
  const areaPts = `2,100 ${linePts} ${xAt(n - 1)},100`;

  return (
    <div className="pulse-chart">
      <div className="pulse-chart__plot">
        <div className="pulse-chart__grid">
          {[25, 50, 75].map((t) => <i key={t} style={{ top: t + "%" }} />)}
        </div>

        {type === "bar" ? (
          <div className="pulse-chart__bars">
            {pts.map((p, i) => {
              const focus = focusEnabled && i + 1 === focusIndex;
              return (
                <div className="pulse-chart__col" key={i}>
                  <div
                    className={"pulse-chart__bar" + (focus ? " pulse-chart__bar--focus" : "")}
                    style={{ height: (p.v / max) * 100 + "%", "--bar": focus ? accent : base }}>
                    <span className="pulse-chart__val">{p.v}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <React.Fragment>
            <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {type === "area" && <polygon points={areaPts} fill={accent} fillOpacity="0.22" />}
              <polyline points={linePts} fill="none" stroke={accent} strokeWidth="2.6"
                strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {pts.map((p, i) => {
                const focus = focusEnabled && i + 1 === focusIndex;
                return (
                  <circle key={i} cx={xAt(i)} cy={yAt(p.v)} r={focus ? 2.6 : 1.8}
                    vectorEffect="non-scaling-stroke" className="pulse-chart__dot"
                    stroke={focus ? "#fff" : accent} strokeWidth="4" />
                );
              })}
            </svg>
          </React.Fragment>
        )}
      </div>

      <div className="pulse-chart__axis">
        {pts.map((p, i) => {
          const focus = focusEnabled && i + 1 === focusIndex;
          return <span key={i} className={focus ? "is-focus" : ""}>{p.axis}</span>;
        })}
      </div>
    </div>
  );
}

function PulseSnapshot(props) {
  const p = Object.assign({}, PulseSnapshot.defaults, props);
  const accent = p.accentColor;
  const nPts = Math.max(2, Math.min(COPY.points.length, p.pointCount));
  const pts = COPY.points.slice(0, nPts);
  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const metrics = COPY.metrics.slice(0, nMetric);

  return (
    <div className="pulse-slide pulse-stat" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-stat__body">
        <div className="pulse-stat__id">
          <div className="pulse-stat__glyph">{COPY.glyph}</div>
          <div className="pulse-stat__name">{COPY.name}</div>
          <div className="pulse-stat__metrics">
            {metrics.map((m, i) => {
              const focus = p.focusEnabled && i + 1 === p.focusIndex && false;
              return (
                <div key={i} className={"pulse-stat__m" + (focus ? " pulse-stat__m--focus" : "")}>
                  <div className="pulse-stat__m-k">{m.k}</div>
                  <div className="pulse-stat__m-v">{m.v}<small>{m.u}</small></div>
                </div>
              );
            })}
          </div>
          {p.showSwatches && (
            <div className="pulse-stat__band">
              {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
            </div>
          )}
        </div>

        <div className="pulse-stat__viz">
          <div className="pulse-stat__panel">
            <div className="pulse-stat__panel-head">
              <div className="pulse-stat__panel-title">{COPY.panelTitle}</div>
              <div className="pulse-mono" style={{ color: "var(--pulse-on-dark-mute)" }}>{COPY.unit}</div>
            </div>
            <MiniChart pts={pts} type={p.chartType} focusEnabled={p.focusEnabled}
              focusIndex={p.focusIndex} accent={accent} />
          </div>
          {p.showConclusion && <div className="pulse-conclusion pulse-stat__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    </div>
  );
}

PulseSnapshot.controls = [
  { key: "chartType", type: "radio", label: "图表类型", default: "bar",
    options: [{ value: "bar", label: "柱状" }, { value: "line", label: "折线" }, { value: "area", label: "面积" }],
    description: "右侧证据图表的呈现方式：柱状 / 折线 / 面积。" },
  { key: "pointCount", type: "slider", label: "数据点数量", default: 3, min: 2, max: 3, step: 1,
    description: "证据图表展示的数据点（时间截面）数量。" },
  { key: "focusEnabled", type: "toggle", label: "重点标注", default: true,
    description: "是否突出某一个数据点（峰值 / 关键截面）。" },
  { key: "focusIndex", type: "slider", label: "重点数据点", default: 3, min: 1, max: 3, step: 1,
    description: "被突出的数据点序号（从 1 起）。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "左侧主体卡的指标行数量。" },
  { key: "showSwatches", type: "toggle", label: "色谱色卡", default: true,
    description: "左下角的装饰性色谱色卡。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "主体字形 / 重点标注 / 眉标的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "面板下方的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseSnapshot.defaults = PulseSnapshot.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseSnapshot;
export const controls = PulseSnapshot.controls || [];
export const defaults = PulseSnapshot.defaults || {};
