import React from 'react';
import './PulseImageFrame.jsx';
const window = globalThis.__theme05Window || (globalThis.__theme05Window = {});
globalThis.React = React;
function withTheme05Copy(Component) {
  const defaultCopy = Component.copyDefaults || Component.defaults?.copy || null;
  function Theme05CopyWrapped(props = {}) {
    const copy = mergeTheme05Copy(defaultCopy, props.copy);
    const element = Component({ ...props, copy });
    return replaceTheme05Text(element, theme05ReplacementMap(defaultCopy, copy));
  }
  Theme05CopyWrapped.controls = Component.controls || [];
  Theme05CopyWrapped.defaults = { ...(Component.defaults || {}), ...(defaultCopy ? { copy: defaultCopy } : {}) };
  return Theme05CopyWrapped;
}

function mergeTheme05Copy(base, override) {
  if (!base || typeof base !== 'object') return override || base;
  if (!override || typeof override !== 'object') return base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  const next = { ...base };
  for (const [key, value] of Object.entries(override)) {
    next[key] = base[key] && typeof base[key] === 'object' && value && typeof value === 'object'
      ? mergeTheme05Copy(base[key], value)
      : value;
  }
  return next;
}

function theme05ReplacementMap(base, copy, map = new Map()) {
  if (!base || !copy) return map;
  if (typeof base === 'string' || typeof base === 'number') {
    const from = String(base).replace(/\u00a0/g, ' ');
    const to = typeof copy === 'string' || typeof copy === 'number' ? String(copy) : copy;
    if (from && to !== undefined && to !== null && (!map.has(from) || String(to) !== from)) map.set(from, to);
    return map;
  }
  if (Array.isArray(base) && Array.isArray(copy)) {
    base.forEach((item, index) => theme05ReplacementMap(item, copy[index], map));
    return map;
  }
  if (typeof base === 'object' && typeof copy === 'object') {
    Object.keys(base).forEach(key => theme05ReplacementMap(base[key], copy[key], map));
  }
  return map;
}

function replaceTheme05Text(node, replacements) {
  if (!replacements?.size) return node;
  if (typeof node === 'string' || typeof node === 'number') {
    return replacements.get(String(node).replace(/\u00a0/g, ' ')) ?? node;
  }
  if (Array.isArray(node)) return node.map(child => replaceTheme05Text(child, replacements));
  if (!React.isValidElement(node)) return node;
  const nextProps = {};
  let changed = false;
  for (const key of ['children', 'label', 'placeholder', 'title', 'alt', 'aria-label']) {
    if (!(key in node.props)) continue;
    const next = replaceTheme05Text(node.props[key], replacements);
    if (next !== node.props[key]) {
      nextProps[key] = next;
      changed = true;
    }
  }
  return changed ? React.cloneElement(node, nextProps) : node;
}

/* =========================================================================
   PulseFlow — P34 chart page ("流程管线 + 增长 / Process Flow + Growth").
   A generic "staged process + key-metric growth" archetype: a horizontal
   N-stage pipeline (colored stage blocks joined by arrows) as the main visual,
   beside an evidence column carrying a metric spec card and a headline growth
   read-out with a mini chart (bar / line / area). The reusable template for any
   "pipeline / value flow + one growth number" page.

   Self-contained & migratable: depends only on React + the .pulse-flow /
   shared .pulse-chart / .pulse-* CSS. Controlled ENTIRELY by props.
   See PulseFlow.controls for the typed, documented parameter list.

   To migrate into a bundler: delete the `window.PulseFlow = …` line at the
   bottom and `export default PulseFlow` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "DATA INFRASTRUCTURE",
    title: "企业 AI 底座",
    sheet: "FLOW · 34 / 80",
    flowCap: "数据流转管线",
    flowUnit: "INGEST → SERVE",
    // stage blocks (colored) — left→right pipeline
    stages: [
      { en: "INGEST",  zh: "数据采集", note: "多源接入", color: SPECTRUM[5] },
      { en: "CLEAN",   zh: "清洗治理", note: "质量校验", color: SPECTRUM[4] },
      { en: "INDEX",   zh: "向量索引", note: "RAG 检索", color: SPECTRUM[3] },
      { en: "SERVE",   zh: "服务编排", note: "应用调用", color: SPECTRUM[0] },
      { en: "GOVERN",  zh: "监控治理", note: "权限审计", color: SPECTRUM[6] },
    ],
    metrics: [
      ["融资额", "61", "亿美元"],
      ["事件数", "12", "笔"],
      ["平均单笔", "5.1", "亿美元"],
    ],
    growthValue: "+47",
    growthUnit: "%",
    growthLabel: "企业客户同比增长",
    growthSeries: [ { axis: "Q1", v: 100 }, { axis: "Q2", v: 126 }, { axis: "Q3", v: 147 } ],
    conclusion: "没有数据底座，AI 应用很难稳定落地。",
  };

  function MiniChart({ pts, type, focusEnabled, focusIndex, accent }) {
    const max = Math.max.apply(null, pts.map((p) => p.v)) * 1.16;
    const base = "#efe9da";
    const n = pts.length;
    const xAt = (i) => (n === 1 ? 50 : (i / (n - 1)) * 96 + 2);
    const yAt = (v) => 100 - (v / max) * 100;
    const linePts = pts.map((p, i) => `${xAt(i)},${yAt(p.v)}`).join(" ");
    const areaPts = `2,100 ${linePts} ${xAt(n - 1)},100`;
    return (
      <div className="pulse-chart">
        <div className="pulse-chart__plot">
          <div className="pulse-chart__grid">{[25, 50, 75].map((t) => <i key={t} style={{ top: t + "%" }} />)}</div>
          {type === "bar" ? (
            <div className="pulse-chart__bars">
              {pts.map((p, i) => {
                const focus = focusEnabled && i + 1 === focusIndex;
                return (
                  <div className="pulse-chart__col" key={i}>
                    <div className={"pulse-chart__bar" + (focus ? " pulse-chart__bar--focus" : "")}
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
                    <g key={i}>
                      <path d={`M ${xAt(i)} ${yAt(p.v)} h 0.001`} className="pulse-dotcap"
                        vectorEffect="non-scaling-stroke" strokeWidth={focus ? 28 : 20}
                        stroke={focus ? "#fff" : accent} />
                      <path d={`M ${xAt(i)} ${yAt(p.v)} h 0.001`} className="pulse-dotcap pulse-dotcap--core"
                        vectorEffect="non-scaling-stroke" strokeWidth={focus ? 20 : 12} />
                    </g>
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

  const controls = [
    { key: "nodeCount", type: "slider", label: "流程节点数量", default: 4, min: 3, max: 5, step: 1,
      description: "主视觉管线的阶段（节点）数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
      description: "是否突出某一阶段（其余阶段淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点节点序号", default: 4, min: 1, max: 5, step: 1,
      description: "被突出的阶段序号（从 1 起；超出节点数自动收敛到末段）。" },
    { key: "showGrowth", type: "toggle", label: "增长指标面板", default: true,
      description: "右下深色面板：巨号增长数字 + 迷你图表。" },
    { key: "chartType", type: "radio", label: "图表类型", default: "bar",
      options: [{ value: "bar", label: "柱状" }, { value: "line", label: "折线" }, { value: "area", label: "面积" }],
      description: "增长面板内迷你图表的呈现方式。" },
    { key: "pointCount", type: "slider", label: "数据点数量", default: 3, min: 2, max: 3, step: 1,
      description: "增长迷你图表的数据点（时间截面）数量。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 3, min: 2, max: 3, step: 1,
      description: "右上指标卡的指标行数。" },
    { key: "showFlowCaption", type: "toggle", label: "管线图注", default: true,
      description: "主视觉上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
      description: "眉标 / 增长数字 / 指标卡的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseFlow(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;
    const nStage = Math.max(3, Math.min(COPY.stages.length, p.nodeCount));
    const stages = COPY.stages.slice(0, nStage);
    const focusN = Math.min(p.focusIndex, nStage);
    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const nPts = Math.max(2, Math.min(COPY.growthSeries.length, p.pointCount));
    const pts = COPY.growthSeries.slice(0, nPts);

    return (
      <div className="pulse-slide pulse-flow" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-flow__body">
          <div className="pulse-flow__main">
            {p.showFlowCaption && (
              <div className="pulse-flow__cap">
                <span className="pulse-label">{COPY.flowCap}</span>
                <span className="pulse-mono">{COPY.flowUnit}</span>
              </div>
            )}
            <div className="pulse-flow__pipe">
              {stages.map((s, i) => {
                const focus = p.focusEnabled && i + 1 === focusN;
                const dim = p.focusEnabled && !focus;
                return (
                  <React.Fragment key={i}>
                    <div className={"pulse-flow__stage" + (focus ? " pulse-flow__stage--focus" : "") + (dim ? " pulse-flow__stage--dim" : "")}
                      style={{ background: s.color }}>
                      <div className="pulse-flow__stage-idx">0{i + 1}</div>
                      <div className="pulse-flow__stage-body">
                        <div className="pulse-flow__stage-en">{s.en}</div>
                        <div className="pulse-flow__stage-zh">{s.zh}</div>
                      </div>
                    </div>
                    {i < stages.length - 1 && <div className="pulse-flow__arrow" aria-hidden="true">→</div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="pulse-flow__side">
            <div className="pulse-flow__metrics" style={{ background: accent, color: "#fff" }}>
              {metrics.map((m, i) => (
                <div className="pulse-flow__m" key={i}>
                  <span className="pulse-flow__m-k">{m[0]}</span>
                  <span className="pulse-flow__m-v">{m[1]}<small>{m[2]}</small></span>
                </div>
              ))}
            </div>

            {p.showGrowth && (
              <div className="pulse-flow__growth">
                <div className="pulse-flow__growth-head">
                  <div className="pulse-flow__growth-big">
                    <b>{COPY.growthValue}</b>
                    <span style={{ fontSize: 40, fontWeight: 800, color: accent }}>{COPY.growthUnit}</span>
                  </div>
                  <div className="pulse-flow__growth-lab">{COPY.growthLabel}</div>
                </div>
                <div className="pulse-flow__growth-chart">
                  <MiniChart pts={pts} type={p.chartType} focusEnabled={true} focusIndex={nPts} accent={accent} />
                </div>
              </div>
            )}
          </div>
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-flow__concl">{COPY.conclusion}</div>}
      </div>
    );
  }

  PulseFlow.controls = controls;
  PulseFlow.defaults = defaults;

  if (typeof window !== "undefined") PulseFlow.copyDefaults = COPY;
  PulseFlow.defaults = { ...(PulseFlow.defaults || {}), copy: COPY };
  window.PulseFlow = PulseFlow;
})();

const Component = window.PulseFlow;
if (!Component) throw new Error('Missing theme05 component PulseFlow');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;