/* =========================================================================
   PulseWaterfall — P22 chart page ("赛道贡献拆分 / Waterfall" archetype).
   A generic cumulative part-to-whole waterfall: floating segments accumulate
   left→right to an optional total bar, with optional dashed connectors, a
   focus segment, switchable coloring, and a side legend (value + % of total).
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseWaterfall.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "FUNDING WATERFALL",
  title: "赛道贡献拆分",
  sub: "融资额贡献瀑布",
  sheet: "WATERFALL · 22 / 32",
  unit: "亿美元",
  totalLabel: "全年合计",
  steps: [
    { name: "通用大模型", v: 420, c: SPECTRUM[0] },
    { name: "垂直应用",   v: 245, c: SPECTRUM[1] },
    { name: "基础设施",   v: 158, c: SPECTRUM[4] },
    { name: "AI 芯片",    v: 97,  c: SPECTRUM[5] },
    { name: "其他",       v: 50,  c: SPECTRUM[3] },
  ],
  conclusion: "大模型制造热度，基础设施和应用承接兑现。",
};

function PulseWaterfall(props) {
  const p = Object.assign({}, PulseWaterfall.defaults, props);
  const accent = p.accentColor;
  const n = Math.max(3, Math.min(COPY.steps.length, p.stepCount));
  const steps = COPY.steps.slice(0, n);
  const total = steps.reduce((a, s) => a + s.v, 0);
  const scale = total * 1.12;

  // cumulative start for each step
  let acc = 0;
  const geo = steps.map((s) => {
    const start = acc; acc += s.v;
    return { start, end: acc };
  });

  const colorOf = (s) =>
    p.colorMode === "accent" ? accent
    : p.colorMode === "mono" ? "#3d3a32"
    : s.c;

  // column centers (percent) matching the flex plot: padding 1% each side, gap 2.6%
  const cols = n + (p.showTotal ? 1 : 0);
  const gap = 2.6, padX = 1, usable = 100 - padX * 2;
  const colW = (usable - gap * (cols - 1)) / cols;
  const centerOf = (i) => padX + i * (colW + gap) + colW / 2;
  const yTop = (v) => 100 - (v / scale) * 100;

  return (
    <div className="pulse-slide pulse-wf" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-wf__body">
        <div className="pulse-wf__main">
          <div className="pulse-label" style={{ marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
            <span>{COPY.sub}</span><span className="pulse-mono">{COPY.unit}</span>
          </div>

          <div className="pulse-wf__chart">
            <div className="pulse-wf__plot">
              <div className="pulse-wf__grid">
                {[20, 40, 60, 80].map((t) => <i key={t} style={{ top: t + "%" }} />)}
              </div>

              {p.showConnectors && (
                <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none"
                  style={{ position: "absolute", inset: 0 }}>
                  {geo.map((g, i) => {
                    if (i === n - 1 && !p.showTotal) return null;
                    const x1 = centerOf(i), x2 = centerOf(i + 1);
                    const y = yTop(g.end);
                    return <line key={i} x1={x1} y1={y} x2={x2} y2={y}
                      stroke="#8a8576" strokeWidth="1" strokeDasharray="2 2"
                      vectorEffect="non-scaling-stroke" />;
                  })}
                </svg>
              )}

              <div className="pulse-wf__cols">
                {steps.map((s, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  const h = (s.v / scale) * 100;
                  const bottom = (geo[i].start / scale) * 100;
                  return (
                    <div className="pulse-wf__col" key={i}>
                      <div className={"pulse-wf__bar" + (focus ? " pulse-wf__bar--focus" : "")}
                        style={{ bottom: bottom + "%", height: h + "%", "--bar": colorOf(s) }}>
                        {p.showValue && <span className="pulse-wf__val">{s.v}</span>}
                      </div>
                    </div>
                  );
                })}
                {p.showTotal && (
                  <div className="pulse-wf__col">
                    <div className="pulse-wf__bar pulse-wf__bar--total"
                      style={{ bottom: "0%", height: (total / scale) * 100 + "%" }}>
                      {p.showValue && <span className="pulse-wf__val">{total}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pulse-wf__axis">
              {steps.map((s, i) => {
                const focus = p.focusEnabled && i + 1 === p.focusIndex;
                return <span key={i} className={focus ? "is-focus" : ""}>{s.name}</span>;
              })}
              {p.showTotal && <span style={{ fontWeight: 800 }}>{COPY.totalLabel}</span>}
            </div>
          </div>
        </div>

        <div className="pulse-wf__side">
          <div className="pulse-label" style={{ marginBottom: 6 }}>赛道贡献明细</div>
          {p.showLegend && (
            <div className="pulse-wf__legend">
              {steps.map((s, i) => {
                const focus = p.focusEnabled && i + 1 === p.focusIndex;
                return (
                  <div key={i} className={"pulse-wf__leg" + (focus ? " pulse-wf__leg--focus" : "")}>
                    <span className="pulse-wf__leg-dot" style={{ background: colorOf(s) }} />
                    <span className="pulse-wf__leg-name">{s.name}</span>
                    <span className="pulse-wf__leg-v">{s.v}<small>{((s.v / total) * 100).toFixed(0)}%</small></span>
                  </div>
                );
              })}
              {p.showTotal && (
                <div className="pulse-wf__leg pulse-wf__leg--total">
                  <span className="pulse-wf__leg-dot" style={{ background: "#14130f" }} />
                  <span className="pulse-wf__leg-name">{COPY.totalLabel}</span>
                  <span className="pulse-wf__leg-v">{total}<small>100%</small></span>
                </div>
              )}
            </div>
          )}
          {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
        </div>
      </div>
    </div>
  );
}

PulseWaterfall.controls = [
  { key: "stepCount", type: "slider", label: "分段数量", default: 5, min: 3, max: 5, step: 1,
    description: "参与累计贡献的分段（瀑布台阶）数量。" },
  { key: "showTotal", type: "toggle", label: "合计列", default: true,
    description: "末尾的累计合计柱与图例合计行。" },
  { key: "showConnectors", type: "toggle", label: "连接线", default: true,
    description: "相邻台阶之间的累计水平虚线连接线。" },
  { key: "focusEnabled", type: "toggle", label: "重点分段", default: true,
    description: "是否突出某一个分段（贡献台阶）。" },
  { key: "focusIndex", type: "slider", label: "重点分段序号", default: 1, min: 1, max: 5, step: 1,
    description: "被突出的分段序号（从 1 起）。" },
  { key: "showValue", type: "toggle", label: "数值显示", default: true,
    description: "柱顶显示数值。" },
  { key: "colorMode", type: "radio", label: "配色方式", default: "category",
    options: [{ value: "category", label: "按类别" }, { value: "accent", label: "强调色" }, { value: "mono", label: "单色" }],
    description: "台阶配色：按类别 / 统一强调色 / 单色。" },
  { key: "showLegend", type: "toggle", label: "图例列表", default: true,
    description: "右侧带数值与占比的明细列表。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标与重点项的强调色（强调色配色下也用于台阶）。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "右下角的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseWaterfall.defaults = PulseWaterfall.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseWaterfall;
export const controls = PulseWaterfall.controls || [];
export const defaults = PulseWaterfall.defaults || {};
