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
   PulseShield — P48 chart page ("评测流程管线 / Evaluation Pipeline" archetype).
   A generic SEQUENTIAL-PIPELINE chart: N stages laid left→right, each a column
   with a vertical funding bar (height = value) joined by flow arrows — a process
   AND a bar chart in one. A colored metric spec card + note sit in the evidence
   column; a focus stage can be outlined. The reusable template for any
   "process / pipeline / staged spend" chart page.

   Self-contained & migratable: depends only on React + the shared .pulse-shld /
   .pulse-* CSS. Controlled ENTIRELY by props. See PulseShield.controls for the
   typed, documented parameter list. Text/data live in COPY (not prop-driven).

   To migrate into a bundler: delete the `window.PulseShield = …` line and
   `export default PulseShield; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "MODEL ALIGNMENT",
    title: "安全与对齐工具",
    sheet: "CHART · 48 / 80",
    lead: "模型安全和对齐公司吸引长期资本关注。",
    pipeCap: "安全评测流程",
    pipeUnit: "EVAL PIPELINE",
    stages: [
      { en: "EVALUATION", zh: "评测平台", v: 8, c: SPECTRUM[5] },
      { en: "ALIGNMENT",  zh: "对齐工具", v: 7, c: SPECTRUM[3] },
      { en: "RED TEAM",   zh: "红队服务", v: 6, c: SPECTRUM[0] },
    ],
    metricCap: "赛道指标",
    metricUnit: "BY SEGMENT",
    metrics: [
      ["融资额", "21", "亿美元"],
      ["事件数", "5", "笔"],
      ["平均单笔", "4.2", "亿美元"],
    ],
    note: "安全对齐既是技术壁垒，也是大客户信任入口。",
    conclusion: "可信 AI 会成为企业级 AI 的基础设施。",
  };

  const controls = [
    { key: "stageCount", type: "slider", label: "流程节点数", default: 3, min: 2, max: 3, step: 1,
      description: "评测流程的阶段（节点）数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
      description: "是否突出某一节点（其余淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点节点序号", default: 1, min: 1, max: 3, step: 1,
      description: "被突出的节点序号（从 1 起）。" },
    { key: "showValue", type: "toggle", label: "节点数值", default: true,
      description: "各节点柱顶的数值标注。" },
    { key: "showArrows", type: "toggle", label: "流程箭头", default: true,
      description: "相邻节点间的流向箭头。" },
    { key: "showMetricCard", type: "toggle", label: "侧栏指标卡", default: true,
      description: "右侧的彩色指标规格卡。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 3, min: 2, max: 3, step: 1,
      description: "侧栏指标卡的指标行数。" },
    { key: "showNote", type: "toggle", label: "侧栏说明", default: true,
      description: "侧栏底部的一段说明文案。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "眉标 / 指标卡 / 重点标记的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseShield(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const nStage = Math.max(2, Math.min(COPY.stages.length, p.stageCount));
    const stages = COPY.stages.slice(0, nStage);
    const maxV = Math.max.apply(null, stages.map((s) => s.v));
    const focusN = Math.min(p.focusIndex, nStage);

    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);

    return (
      <div className="pulse-slide pulse-shld" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-shld__body">
          <div className="pulse-shld__main">
            <div className="pulse-shld__cap">
              <span className="pulse-label">{COPY.pipeCap}</span>
              <span className="pulse-mono">{COPY.pipeUnit}</span>
            </div>

            <div className="pulse-shld__pipe">
              {stages.map((s, i) => {
                const focus = p.focusEnabled && i + 1 === focusN;
                const dim = p.focusEnabled && !focus;
                const h = 30 + (s.v / maxV) * 70;
                return (
                  <React.Fragment key={i}>
                    <div className={"pulse-shld__stage" + (focus ? " pulse-shld__stage--focus" : "")}>
                      <div className="pulse-shld__plot">
                        <div className="pulse-shld__bar"
                          style={{ height: h + "%", background: s.c, opacity: dim ? 0.4 : 1 }}>
                          {p.showValue && <span className="pulse-shld__bar-v">{s.v}<small>亿美元</small></span>}
                        </div>
                      </div>
                      <div className="pulse-shld__foot">
                        <span className="pulse-shld__foot-i" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                        <span className="pulse-shld__foot-zh">{s.zh}</span>
                        <span className="pulse-shld__foot-en">{s.en}</span>
                      </div>
                    </div>
                    {p.showArrows && i < nStage - 1 && (
                      <div className="pulse-shld__arrow">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {p.showMetricCard && (
            <div className="pulse-shld__side">
              <div className="pulse-shld__lead">{COPY.lead}</div>
              <div className="pulse-shld__metrics" style={{ background: accent }}>
                <div className="pulse-shld__metrics-cap">
                  <span>{COPY.metricCap}</span>
                  <span>{COPY.metricUnit}</span>
                </div>
                {metrics.map((m, i) => (
                  <div className="pulse-shld__m" key={i}>
                    <span className="pulse-shld__m-k">{m[0]}</span>
                    <span className="pulse-shld__m-v">{m[1]}<small>{m[2]}</small></span>
                  </div>
                ))}
              </div>
              {p.showNote && <div className="pulse-shld__note">{COPY.note}</div>}
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-shld__concl">{COPY.conclusion}</div>}
      </div>
    );
  }

  PulseShield.controls = controls;
  PulseShield.defaults = defaults;

  if (typeof window !== "undefined") PulseShield.copyDefaults = COPY;
  PulseShield.defaults = { ...(PulseShield.defaults || {}), copy: COPY };
  window.PulseShield = PulseShield;
})();

const Component = window.PulseShield;
if (!Component) throw new Error('Missing theme05 component PulseShield');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;