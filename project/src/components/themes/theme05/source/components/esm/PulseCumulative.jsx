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
   PulseCumulative — P25 chart page ("累计资金分布 / Cumulative Curve" archetype).
   A generic cumulative concentration curve: y = cumulative share, x = ranked
   tiers (Top-N). Switchable area / line, node value labels, a focus node, and
   a ranked side list showing cumulative + marginal contribution.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseCumulative.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
  const PRIMARY = SPECTRUM[5]; // blue curve

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  // v = cumulative % of total capital held by the top-N companies.
  const COPY = {
    eyebrow: "CAPITAL CURVE",
    title: "累计资金分布",
    sub: "资本集中曲线",
    sheet: "CURVE · 25 / 32",
    unit: "累计资金占比 %",
    nodes: [
      { axis: "Top 3",  v: 18.7 },
      { axis: "Top 10", v: 23.8 },
      { axis: "Top 25", v: 48.5 },
      { axis: "Top 50", v: 71.2 },
    ],
    conclusion: "集中度本身就是市场结构。",
  };

  function PulseCumulative(props) {
    const p = Object.assign({}, PulseCumulative.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(2, Math.min(COPY.nodes.length, p.nodeCount));
    const nodes = COPY.nodes.slice(0, n);

    const max = 100; // cumulative share axis is a fixed 0–100%
    const xAt = (i) => (n === 1 ? 50 : (i / (n - 1)) * 94 + 3);
    const yAt = (v) => 100 - (v / max) * 100;
    const linePts = nodes.map((nd, i) => `${xAt(i)},${yAt(nd.v)}`).join(" ");
    const areaPts = `${xAt(0)},100 ${linePts} ${xAt(n - 1)},100`;

    return (
      <div className="pulse-slide pulse-cum" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-cum__body">
          <div className="pulse-cum__main">
            <div className="pulse-label" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
              <span>{COPY.sub}</span><span className="pulse-mono" style={{ whiteSpace: "nowrap" }}>{COPY.unit}</span>
            </div>

            <div className="pulse-chart">
              <div className="pulse-chart__plot">
                <div className="pulse-chart__grid">
                  {[20, 40, 60, 80].map((t) => <i key={t} style={{ top: t + "%" }} />)}
                </div>

                <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {p.chartType === "area" && <polygon points={areaPts} fill={PRIMARY} fillOpacity="0.16" />}
                  <polyline points={linePts} fill="none" stroke={PRIMARY} strokeWidth="2.6"
                    strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>

                <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {nodes.map((nd, i) => {
                    const focus = p.focusEnabled && i + 1 === p.focusIndex;
                    return (
                      <g key={i}>
                        <path d={`M ${xAt(i)} ${yAt(nd.v)} h 0.001`} className="pulse-dotcap"
                          vectorEffect="non-scaling-stroke" strokeWidth={focus ? 28 : 20}
                          stroke={focus ? accent : PRIMARY} />
                        <path d={`M ${xAt(i)} ${yAt(nd.v)} h 0.001`} className="pulse-dotcap pulse-dotcap--core"
                          vectorEffect="non-scaling-stroke" strokeWidth={focus ? 20 : 12} />
                      </g>
                    );
                  })}
                </svg>

                {p.showStageLabels && (
                  <div className="pulse-cum__pts">
                    {nodes.map((nd, i) => {
                      const focus = p.focusEnabled && i + 1 === p.focusIndex;
                      return (
                        <div key={i} className={"pulse-cum__pt" + (focus ? " is-focus" : "")}
                          style={{ left: xAt(i) + "%", top: yAt(nd.v) + "%" }}>
                          {nd.v}%
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pulse-chart__axis">
                {nodes.map((nd, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  return <span key={i} className={focus ? "is-focus" : ""}>{nd.axis}</span>;
                })}
              </div>
            </div>
          </div>

          <div className="pulse-cum__side">
            <div className="pulse-label" style={{ marginBottom: 22 }}>头部集中度</div>
            {p.showMetrics && (
              <div className="pulse-cum__metrics">
                {nodes.map((nd, i) => {
                  const focus = p.focusEnabled && i + 1 === p.focusIndex;
                  const prev = i === 0 ? 0 : nodes[i - 1].v;
                  const marginal = (nd.v - prev).toFixed(1);
                  return (
                    <div key={i}
                      className={"pulse-cum__metric" + (focus ? " pulse-cum__metric--focus" : "")}
                      style={focus ? { background: accent } : undefined}>
                      <span className="pulse-cum__m-k">{nd.axis}</span>
                      <span className="pulse-cum__m-r">
                        <span className="pulse-cum__m-d">+{marginal}</span>
                        <span className="pulse-cum__m-v">{nd.v}%</span>
                      </span>
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

  PulseCumulative.controls = [
    { key: "chartType", type: "radio", label: "曲线类型", default: "area",
      options: [{ value: "area", label: "面积" }, { value: "line", label: "折线" }],
      description: "累计曲线呈现方式：面积 / 折线。" },
    { key: "nodeCount", type: "slider", label: "节点数量", default: 4, min: 2, max: 4, step: 1,
      description: "累计曲线的分位节点（Top-N 档位）数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
      description: "是否突出某一个分位节点。" },
    { key: "focusIndex", type: "slider", label: "重点节点序号", default: 4, min: 1, max: 4, step: 1,
      description: "被突出的节点序号（从 1 起）。" },
    { key: "showStageLabels", type: "toggle", label: "阶段占比标签", default: true,
      description: "各节点上方的累计占比标签。" },
    { key: "showMetrics", type: "toggle", label: "指标列表", default: true,
      description: "右侧带累计值与边际增量的列表。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[6], options: SPECTRUM,
      description: "重点标注与眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "右下角的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseCumulative.defaults = PulseCumulative.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseCumulative.copyDefaults = COPY;
  PulseCumulative.defaults = { ...(PulseCumulative.defaults || {}), copy: COPY };
  window.PulseCumulative = PulseCumulative;
})();

const Component = window.PulseCumulative;
if (!Component) throw new Error('Missing theme05 component PulseCumulative');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;