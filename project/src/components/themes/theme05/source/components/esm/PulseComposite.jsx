/* =========================================================================
   PulseComposite — P51 chart page ("结构拆解 / Deal Decomposition" archetype).
   A single large entity (dark anchor card with a giant readout) is broken into
   N structural components. The composition can render two ways: per-part
   horizontal bars (detail) or one 100% stacked strip (summary) — selectable via
   chartType. A component legend sits under the stack. The reusable template for
   any "one total → structural parts / deal-structure / cost build-up" chart.

   Self-contained & migratable: depends only on React + the shared .pulse-dcmp /
   .pulse-* CSS. Controlled ENTIRELY by props. Text/data live in COPY.
   See PulseComposite.controls for the typed, documented parameter list.
   `export default PulseComposite; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "UNDISCLOSED MEGA ROUNDS",
  title: "复杂交易结构",
  sheet: "STRUCTURE · 51 / 80",
  lead: "未披露轮次常对应战略投资、债务组合或云资源置换。",
  cap: "交易结构拆解",
  capUnit: "DEAL STRUCTURE",
  anchor: { en: "UNDISCLOSED ROUND", zh: "未披露巨额轮", num: "18.6", unit: "亿美元", sub: "平均单笔 · 22 笔事件" },
  // parts sum to 100
  parts: [
    { k: "云资源置换", en: "Cloud Credits", v: 39, c: SPECTRUM[4] },
    { k: "战略投资",   en: "Strategic",     v: 31, c: SPECTRUM[5] },
    { k: "债务组合",   en: "Debt",          v: 18, c: SPECTRUM[6] },
    { k: "普通股权",   en: "Equity",        v: 12, c: SPECTRUM[3] },
  ],
  conclusion: "AI 融资越来越像资源组合交易。",
};

const controls = [
  { key: "partCount", type: "slider", label: "构成分项数", default: 4, min: 2, max: 4, step: 1,
    description: "交易结构的构成分项数量。" },
  { key: "chartType", type: "radio", label: "图表类型", default: "bars",
    options: [{ value: "bars", label: "分项条" }, { value: "stack", label: "百分比堆叠" }],
    description: "构成呈现方式：逐项横向条 / 单条 100% 堆叠。" },
  { key: "showAnchor", type: "toggle", label: "主体锚点卡", default: true,
    description: "左侧的深色主体卡（巨号读数）。" },
  { key: "focusEnabled", type: "toggle", label: "重点分项", default: false,
    description: "是否突出某一分项（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点分项序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的分项序号（从 1 起）。" },
  { key: "showValue", type: "toggle", label: "分项数值", default: true,
    description: "各分项的百分比数值标注。" },
  { key: "showLegend", type: "toggle", label: "图例", default: true,
    description: "100% 堆叠模式下方的分项图例。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
    description: "眉标 / 主体卡巨号读数的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseComposite(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.parts.length, p.partCount));
  const raw = COPY.parts.slice(0, n);
  const total = raw.reduce((a, s) => a + s.v, 0);
  const parts = raw.map((s) => Object.assign({}, s, { pct: Math.round((s.v / total) * 100) }));
  const maxPct = Math.max.apply(null, parts.map((s) => s.pct));
  const focusN = Math.min(p.focusIndex, n);
  const isStack = p.chartType === "stack";

  const anchor = (
    <div className="pulse-dcmp__anchor">
      <div className="pulse-dcmp__anchor-en">{COPY.anchor.en}</div>
      <div className="pulse-dcmp__anchor-zh">{COPY.anchor.zh}</div>
      <div className="pulse-dcmp__anchor-num">{COPY.anchor.num}<small>{COPY.anchor.unit}</small></div>
      <div className="pulse-dcmp__anchor-sub">{COPY.anchor.sub}</div>
    </div>
  );

  const barsView = (
    <div className="pulse-dcmp__parts">
      {parts.map((s, i) => {
        const dim = p.focusEnabled && i + 1 !== focusN;
        return (
          <div className={"pulse-dcmp__part" + (dim ? " pulse-dcmp__part--dim" : "")} key={i}>
            <div className="pulse-dcmp__part-top">
              <span><span className="pulse-dcmp__part-k">{s.k}</span><span className="pulse-dcmp__part-en">{s.en}</span></span>
              {p.showValue && <span className="pulse-dcmp__part-v">{s.pct}<small>%</small></span>}
            </div>
            <div className="pulse-dcmp__track">
              <div className="pulse-dcmp__fill" style={{ width: (s.pct / maxPct * 100) + "%", background: s.c }} />
            </div>
          </div>
        );
      })}
    </div>
  );

  const stackView = (
    <div className="pulse-dcmp__strip">
      <div className="pulse-dcmp__stack">
        {parts.map((s, i) => {
          const dim = p.focusEnabled && i + 1 !== focusN;
          return (
            <div className={"pulse-dcmp__seg" + (dim ? " pulse-dcmp__seg--dim" : "")} key={i}
              style={{ flex: s.pct + " 1 0", background: s.c }}>
              {p.showValue && <span className="pulse-dcmp__seg-v">{s.pct}%</span>}
              {s.pct >= 14 && <span className="pulse-dcmp__seg-k">{s.k}</span>}
            </div>
          );
        })}
      </div>
      {p.showLegend && (
        <div className="pulse-dcmp__legend">
          {parts.map((s, i) => (
            <div className="pulse-dcmp__leg" key={i}>
              <span className="pulse-dcmp__leg-dot" style={{ background: s.c }} />
              <span className="pulse-dcmp__leg-k">{s.k}</span>
              <span className="pulse-dcmp__leg-en">{s.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="pulse-slide pulse-dcmp" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-dcmp__body">
        <div className="pulse-dcmp__lead-row">
          <div className="pulse-dcmp__lead">{COPY.lead}</div>
          <div className="pulse-dcmp__cap">
            <span className="pulse-label">{COPY.cap}</span>
            <span className="pulse-mono">{COPY.capUnit}</span>
          </div>
        </div>

        <div className="pulse-dcmp__main">
          {p.showAnchor && anchor}
          {isStack ? stackView : barsView}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-dcmp__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseComposite.controls = controls;
PulseComposite.defaults = defaults;
export default PulseComposite;
export { controls };
export { defaults };
