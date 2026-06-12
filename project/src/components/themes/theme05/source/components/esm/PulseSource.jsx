/* =========================================================================
   PulseSource — P52 timeline page ("资本来源结构 / Investor Mix" archetype).
   A part-to-whole donut (investor types, centered focus readout) paired with a
   horizontal EVOLUTION timeline showing how the capital mix shifted across the
   cycle. The distinguishing element is the donut+timeline combination. The
   reusable `timeline_page` template for any "composition + how it evolved"
   page. Text/data live in COPY (not prop-driven); everything else by props.

   Self-contained & migratable: depends only on React + the shared .pulse-src /
   .pulse-* CSS. See PulseSource.controls for the typed parameter list.
   `export default PulseSource; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "INVESTOR MIX",
  title: "资本来源结构",
  sheet: "TIMELINE · 52 / 80",
  lead: "传统 VC、企业战略投资者、成长基金和云厂商共同推动 AI 大额融资。",
  shareCap: "投资人类型分布",
  shareUnit: "BY TYPE",
  types: [
    { name: "传统 VC", en: "Venture",   v: 42, c: SPECTRUM[5] },
    { name: "企业战略", en: "Strategic", v: 27, c: SPECTRUM[0] },
    { name: "成长基金", en: "Growth",    v: 18, c: SPECTRUM[3] },
    { name: "云厂商相关", en: "Cloud",   v: 13, c: SPECTRUM[1] },
  ],
  timeCap: "资本来源演进",
  timeUnit: "CAPITAL EVOLUTION",
  nodes: [
    { i: "STAGE 01", t: "纯 VC 主导", d: "早期由传统风险资本独立定价。" },
    { i: "STAGE 02", t: "战略资本进入", d: "云厂商与大厂以资源换股权。" },
    { i: "STAGE 03", t: "成长基金加注", d: "后期成长基金主导大额轮次。" },
    { i: "STAGE 04", t: "产业混合交易", d: "VC + 产业 + 债务的混合结构。" },
  ],
  conclusion: "钱的来源本身也是产业结构信号。",
};

const R = 40, C = 2 * Math.PI * R;

const controls = [
  { key: "typeCount", type: "slider", label: "投资人类型数", default: 4, min: 2, max: 4, step: 1,
    description: "投资人类型环图的分段数量。" },
  { key: "chartType", type: "radio", label: "图表类型", default: "donut",
    options: [{ value: "donut", label: "环形" }, { value: "pie", label: "饼图" }],
    description: "占比图呈现方式：环形（中心显示重点）/ 饼图。" },
  { key: "focusEnabled", type: "toggle", label: "重点类型", default: true,
    description: "是否突出某一类型（环形中心显示该项）。" },
  { key: "focusIndex", type: "slider", label: "重点类型序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的投资人类型序号（从 1 起）。" },
  { key: "showLegend", type: "toggle", label: "类型图例", default: true,
    description: "环图右侧带占比的类型图例。" },
  { key: "showTimeline", type: "toggle", label: "演进时间轴", default: true,
    description: "底部的横向资本来源演进时间轴。" },
  { key: "nodeCount", type: "slider", label: "时间轴节点数", default: 4, min: 2, max: 4, step: 1,
    description: "演进时间轴的节点数量。" },
  { key: "timelineFocus", type: "slider", label: "重点节点序号", default: 4, min: 1, max: 4, step: 1,
    description: "被突出的时间轴节点序号（从 1 起）。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标 / 环心数字 / 重点节点的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseSource(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.types.length, p.typeCount));
  const types = COPY.types.slice(0, n);
  const total = types.reduce((a, s) => a + s.v, 0);
  const focusIdx = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : 0;
  const focus = types[focusIdx] || types[0];

  const isPie = p.chartType === "pie";
  const ringR = isPie ? R / 2 : R;
  const ringC = isPie ? Math.PI * R : C;
  let acc = 0;

  const nNode = Math.max(2, Math.min(COPY.nodes.length, p.nodeCount));
  const nodes = COPY.nodes.slice(0, nNode);
  const tFocus = Math.min(p.timelineFocus, nNode);

  return (
    <div className="pulse-slide pulse-src" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-src__body">
        <div className="pulse-src__top">
          <div className="pulse-src__donut">
            <svg viewBox="0 0 100 100">
              {types.map((s, i) => {
                const frac = s.v / total;
                const len = frac * ringC;
                const off = -acc * ringC;
                acc += frac;
                const isFocus = p.focusEnabled && i === focusIdx;
                const w = isPie ? R : (isFocus ? 21 : 15);
                return (
                  <circle key={i} className="pulse-src__donut-seg" cx="50" cy="50"
                    r={ringR} stroke={s.c} strokeWidth={w}
                    strokeDasharray={`${len} ${ringC - len}`} strokeDashoffset={off} />
                );
              })}
            </svg>
            {!isPie && (
              <div className="pulse-src__donut-center">
                <div className="pulse-src__donut-num">{focus.v}%</div>
                <div className="pulse-src__donut-cap">{focus.name}</div>
              </div>
            )}
          </div>

          <div className="pulse-src__side">
            <div className="pulse-src__lead">{COPY.lead}</div>
            <div className="pulse-label" style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
              <span>{COPY.shareCap}</span><span className="pulse-mono">{COPY.shareUnit}</span>
            </div>
            {p.showLegend && (
              <div className="pulse-src__legend">
                {types.map((s, i) => {
                  const isFocus = p.focusEnabled && i === focusIdx;
                  return (
                    <div key={i} className={"pulse-src__leg" + (isFocus ? " pulse-src__leg--focus" : "")}>
                      <span className="pulse-src__leg-dot" style={{ background: s.c }} />
                      <span className="pulse-src__leg-name">{s.name}</span>
                      <span className="pulse-src__leg-en">{s.en}</span>
                      <span className="pulse-src__leg-v">{s.v}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {p.showTimeline && (
          <div className="pulse-src__time">
            <div className="pulse-src__time-cap">
              <span className="pulse-label">{COPY.timeCap}</span>
              <span className="pulse-mono">{COPY.timeUnit}</span>
            </div>
            <div className="pulse-src__track">
              {nodes.map((nd, i) => {
                const isFocus = i + 1 === tFocus;
                return (
                  <div key={i} className={"pulse-src__node" + (isFocus ? " pulse-src__node--focus" : "")}>
                    <div className="pulse-src__node-dot" />
                    <div className="pulse-src__node-i">{nd.i}</div>
                    <div className="pulse-src__node-t">{nd.t}</div>
                    <div className="pulse-src__node-d">{nd.d}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-src__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseSource.controls = controls;
PulseSource.defaults = defaults;
export default PulseSource;
export { controls };
export { defaults };
