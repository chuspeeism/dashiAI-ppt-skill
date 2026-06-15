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
   PulseEmbed — P78 content page ("嵌入工作流 / Workflow Embedding" archetype).
   A generic content_page whose DISTINGUISHING element is a HOST-WORKFLOW track
   (N sequential stage blocks, arrow-connected) with an AI node EMBEDDED into one
   focal stage — a badge drops in from above and the stage turns accent — making
   the point "the app lives inside a rigid process, not beside it". A themed
   panel lists the screening indicators (label + gloss, no fabricated numbers)
   and a full-width band carries the scenario chips. The reusable template for
   any "embed into workflow + what-to-watch + where-it-applies" strategy page.

   Self-contained & migratable: depends only on React + the shared .pulse-emb /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseEmbed.controls for the typed parameter list.

   To migrate into a bundler: delete the `window.PulseEmbed = …` line and
   `export default PulseEmbed; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "VERTICAL STRATEGY · 策略：筛选垂直应用",
    title: "嵌入工作流",
    sheet: "STRATEGY · 78 / 80",
    lead: "垂直应用要看是否嵌入刚性流程，而不是只看生成效果。",
    flowCap: "工作流嵌入点",
    flowUnit: "EMBED IN PROCESS",
    embedBadge: "AI 嵌入",
    // host process stages (the rigid workflow the app embeds into)
    stages: [
      { k: "业务输入", en: "INPUT" },
      { k: "流程处理", en: "PROCESS" },
      { k: "决策审批", en: "DECISION" },
      { k: "结果交付", en: "DELIVERY" },
    ],
    metricCap: "关注指标",
    metricUnit: "WATCH",
    metrics: [
      { k: "付费留存", en: "RETENTION" },
      { k: "使用频次", en: "FREQUENCY" },
      { k: "席位扩张", en: "SEATS" },
      { k: "净收入留存", en: "NRR" },
    ],
    metricNote: "好的垂直 AI 应用应该成为工作流的一部分。",
    sceneCap: "落地场景",
    scenes: ["法律", "医疗", "客服", "企业搜索", "开发者工具"],
    conclusion: "应用价值来自流程位置。",
  };

  const controls = [
    { key: "nodeCount", type: "slider", label: "流程阶段数", default: 4, min: 3, max: 5, step: 1,
      description: "宿主工作流的阶段（节点）数量。" },
    { key: "focusEnabled", type: "toggle", label: "嵌入标记", default: true,
      description: "是否在某一阶段显示「AI 嵌入」标记（嵌入点）。" },
    { key: "focusIndex", type: "slider", label: "嵌入点序号", default: 2, min: 1, max: 5, step: 1,
      description: "AI 嵌入所在的阶段序号（从 1 起）。" },
    { key: "showConnectors", type: "toggle", label: "流向箭头", default: true,
      description: "相邻阶段之间的流向箭头。" },
    { key: "showMetrics", type: "toggle", label: "指标面板", default: true,
      description: "右侧的关注指标面板（关闭则工作流铺满整幅）。" },
    { key: "metricCount", type: "slider", label: "指标项数量", default: 4, min: 2, max: 4, step: 1,
      description: "关注指标清单的条目数量。" },
    { key: "panelTheme", type: "radio", label: "面板主题", default: "dark",
      options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
      description: "指标面板背景：深色 / 强调色块 / 纸色。" },
    { key: "showScenes", type: "toggle", label: "场景带", default: true,
      description: "底部的全宽落地场景标签带。" },
    { key: "sceneCount", type: "slider", label: "场景数量", default: 5, min: 2, max: 5, step: 1,
      description: "落地场景标签的数量。" },
    { key: "showLead", type: "toggle", label: "引导说明", default: true,
      description: "标题下方的一句引导说明。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[1], options: SPECTRUM,
      description: "眉标 / 嵌入节点 /「色块」主题面板 / 标记的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseEmbed(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(3, Math.min(5, p.nodeCount));
    // pad host stages if nodeCount exceeds the defined list
    const baseStages = COPY.stages.slice();
    while (baseStages.length < n) baseStages.push({ k: "流程节点", en: "STAGE" });
    const stages = baseStages.slice(0, n);
    const embed = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : -1;

    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const hasPanel = p.showMetrics;
    const scenes = COPY.scenes.slice(0, Math.max(2, Math.min(COPY.scenes.length, p.sceneCount)));

    let bg, fg, div, mute;
    if (p.panelTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; mute = "rgba(255,255,255,0.72)"; }
    else if (p.panelTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; mute = "var(--pulse-mute)"; }
    else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; mute = "var(--pulse-on-dark-mute)"; }

    return (
      <div className="pulse-slide pulse-emb" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
            {p.showLead && <div className="pulse-pagehead__sub pulse-emb__lead">{COPY.lead}</div>}
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-emb__body">
          <div className={"pulse-emb__row" + (hasPanel ? "" : " pulse-emb__row--solo")}>
            <div className="pulse-emb__flow">
              <div className="pulse-emb__flow-cap">
                <span className="pulse-label">{COPY.flowCap}</span>
                <span className="pulse-mono">{COPY.flowUnit}</span>
              </div>
              <div className="pulse-emb__track">
                {stages.map((s, i) => {
                  const isEmbed = i === embed;
                  return (
                    <React.Fragment key={i}>
                      <div className={"pulse-emb__node" + (isEmbed ? " pulse-emb__node--embed" : "")}
                        style={isEmbed ? { background: accent, color: "#fff" } : null}>
                        {isEmbed && (
                          <div className="pulse-emb__badge">
                            <span className="pulse-emb__badge-tag" style={{ background: accent }}>{COPY.embedBadge}</span>
                            <span className="pulse-emb__badge-stem" style={{ background: accent }} />
                          </div>
                        )}
                        <span className="pulse-emb__node-idx">{String(i + 1).padStart(2, "0")}</span>
                        <span className="pulse-emb__node-k">{s.k}</span>
                        <span className="pulse-emb__node-en">{s.en}</span>
                      </div>
                      {i < stages.length - 1 && p.showConnectors && (
                        <span className="pulse-emb__arrow">▶</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="pulse-emb__track-base">宿主刚性流程 · HOST PROCESS</div>
            </div>

            {hasPanel && (
              <div className="pulse-emb__panel" style={{ background: bg, color: fg, "--emb-div": div, "--emb-mute": mute }}>
                <div className="pulse-emb__panel-cap">
                  <span>{COPY.metricCap}</span>
                  <span className="pulse-emb__panel-unit">{COPY.metricUnit}</span>
                </div>
                <div className="pulse-emb__metrics">
                  {metrics.map((m, i) => (
                    <div className="pulse-emb__m" key={i}>
                      <span className="pulse-emb__m-mark" style={{ background: accent }} />
                      <span className="pulse-emb__m-k">{m.k}</span>
                      <span className="pulse-emb__m-en">{m.en}</span>
                    </div>
                  ))}
                </div>
                <div className="pulse-emb__panel-note">{COPY.metricNote}</div>
              </div>
            )}
          </div>

          {p.showScenes && (
            <div className="pulse-emb__scenes">
              <span className="pulse-emb__scenes-cap">{COPY.sceneCap}</span>
              <div className="pulse-emb__chips">
                {scenes.map((s, i) => (
                  <span className="pulse-emb__chip" key={i}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {p.showConclusion && <div className="pulse-conclusion pulse-emb__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseEmbed.controls = controls;
  PulseEmbed.defaults = defaults;

  if (typeof window !== "undefined") PulseEmbed.copyDefaults = COPY;
  PulseEmbed.defaults = { ...(PulseEmbed.defaults || {}), copy: COPY };
  window.PulseEmbed = PulseEmbed;
})();

const Component = window.PulseEmbed;
if (!Component) throw new Error('Missing theme05 component PulseEmbed');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;