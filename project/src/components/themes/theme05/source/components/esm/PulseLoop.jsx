/* =========================================================================
   PulseLoop — P54 chart page ("投资与算力消费闭环 / Closed-loop Map" archetype).
   A generic alliance + closed-loop chart: N alliance rows on the left (each a
   horizontal bar whose width encodes a value), paired with a vivid CLOSED-LOOP
   panel on the right — sequential stages (capital → consumption → recovery) wired
   top-to-bottom with a return arrow so the loop reads at a glance. The
   distinguishing element is the visible feedback loop (vs a one-way pipeline).
   The reusable template for any "alliance / flywheel / capital-returns" page.

   Self-contained & migratable: depends only on React + the shared .pulse-loop /
   .pulse-* CSS. Text/data live in COPY (not prop-driven, per spec); everything
   else is prop-driven. See PulseLoop.controls for the typed parameter list.
   `export default PulseLoop; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "CLOUD ALLIANCES",
  title: "投资与算力消费闭环",
  sheet: "CHART · 54 / 80",
  lead: "云厂商投资 AI 公司，并通过算力消费回收价值 —— 云投资本质上是在锁定未来算力需求。",
  barCap: "云厂商联盟",
  barUnit: "BY VENDOR · 亿美元",
  vendors: [
    { en: "AZURE",        zh: "Azure 相关",        v: 88, c: SPECTRUM[3] },
    { en: "AWS",          zh: "AWS 相关",          v: 74, c: SPECTRUM[1] },
    { en: "GOOGLE CLOUD", zh: "Google Cloud 相关", v: 69, c: SPECTRUM[5] },
    { en: "ORACLE CLOUD", zh: "Oracle Cloud 相关", v: 21, c: SPECTRUM[0] },
  ],
  loopCap: "资金—算力闭环",
  loopUnit: "CLOSED LOOP",
  stages: [
    { i: "01", t: "资本投入", d: "云厂商以现金 + 信用入股模型公司。" },
    { i: "02", t: "算力消费", d: "融资被投回云上训练与推理。" },
    { i: "03", t: "价值回收", d: "云收入与算力需求被同步锁定。" },
  ],
  returnLabel: "价值回流",
  conclusion: "云资源正在成为融资交易的一部分。",
};

const controls = [
  { key: "nodeCount", type: "slider", label: "联盟节点数", default: 4, min: 2, max: 4, step: 1,
    description: "云厂商联盟条形的数量（2–4）。" },
  { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
    description: "是否突出某一条联盟条（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点节点序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的联盟条序号（按数值由高到低，从 1 起）。" },
  { key: "showValue", type: "toggle", label: "条形数值", default: true,
    description: "各联盟条末端的数值标注。" },
  { key: "showLoop", type: "toggle", label: "闭环面板", default: true,
    description: "右侧的资金—算力闭环面板（阶段 + 回流箭头）。" },
  { key: "stageCount", type: "slider", label: "闭环阶段数", default: 3, min: 2, max: 3, step: 1,
    description: "闭环面板内的阶段数量（2–3）。" },
  { key: "showReturn", type: "toggle", label: "回流箭头", default: true,
    description: "闭环面板的「价值回流」回路箭头（构成可见闭环）。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[1], options: SPECTRUM,
    description: "眉标 / 重点条 / 闭环面板的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseLoop(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.vendors.length, p.nodeCount));
  const vendors = COPY.vendors.slice(0, n);
  const max = Math.max.apply(null, vendors.map((v) => v.v));
  const focusN = Math.min(p.focusIndex, n);

  const ns = Math.max(2, Math.min(COPY.stages.length, p.stageCount));
  const stages = COPY.stages.slice(0, ns);

  return (
    <div className="pulse-slide pulse-loop" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-loop__body">
        <div className="pulse-loop__lead">{COPY.lead}</div>

        <div className="pulse-loop__main">
          <div className={"pulse-loop__bars" + (p.showLoop ? "" : " pulse-loop__bars--wide")}>
            <div className="pulse-loop__cap">
              <span className="pulse-label">{COPY.barCap}</span>
              <span className="pulse-mono">{COPY.barUnit}</span>
            </div>
            <div className="pulse-loop__rows">
              {vendors.map((v, i) => {
                const isFocus = p.focusEnabled && i + 1 === focusN;
                const dim = p.focusEnabled && !isFocus;
                return (
                  <div key={i} className={"pulse-loop__row" + (dim ? " pulse-loop__row--dim" : "")}>
                    <div className="pulse-loop__row-head">
                      <span className="pulse-loop__row-zh">{v.zh}</span>
                      <span className="pulse-loop__row-en">{v.en}</span>
                    </div>
                    <div className="pulse-loop__track">
                      <div className={"pulse-loop__fill" + (isFocus ? " pulse-loop__fill--focus" : "")}
                        style={{ width: (v.v / max) * 100 + "%", background: v.c }} />
                      {p.showValue && <span className="pulse-loop__row-v">{v.v}<small>亿</small></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {p.showLoop && (
            <div className="pulse-loop__panel">
              <div className="pulse-loop__panel-cap">
                <span>{COPY.loopCap}</span>
                <span className="pulse-loop__panel-unit">{COPY.loopUnit}</span>
              </div>
              {p.showReturn && (
                <div className="pulse-loop__return">
                  <span className="pulse-loop__return-lab">{COPY.returnLabel}</span>
                </div>
              )}
              <div className="pulse-loop__stages">
                {stages.map((s, i) => (
                  <React.Fragment key={i}>
                    <div className="pulse-loop__stage" style={{ borderLeftColor: accent }}>
                      <span className="pulse-loop__stage-i">{s.i}</span>
                      <div className="pulse-loop__stage-body">
                        <div className="pulse-loop__stage-t">{s.t}</div>
                        <div className="pulse-loop__stage-d">{s.d}</div>
                      </div>
                    </div>
                    {i < stages.length - 1 && <div className="pulse-loop__down" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-loop__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseLoop.controls = controls;
PulseLoop.defaults = defaults;
export default PulseLoop;
export { controls };
export { defaults };
