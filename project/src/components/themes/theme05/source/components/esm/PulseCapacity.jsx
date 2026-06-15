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
   PulseCapacity — P37 chart page ("容量栅格 + 资源构成 / Capacity Grid + Mix").
   A generic "supply / utilization" chart archetype: a unit grid whose filled
   share visualizes occupancy / scarcity (the main visual), beside an evidence
   column carrying a colored metric spec card and a part-to-whole resource
   composition (switchable bars / stacked bar). The reusable template for any
   "capacity, load, utilization, supply" page where the headline is a fill rate.

   Self-contained & migratable: depends only on React + the shared .pulse-cap /
   .pulse-* CSS. Controlled ENTIRELY by props. See PulseCapacity.controls for
   the typed, documented parameter list.

   To migrate into a bundler: delete the `window.PulseCapacity = …` line at the
   bottom and `export default PulseCapacity` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "GPU CLOUD",
    title: "算力供给稀缺",
    sheet: "CHART · 37 / 80",
    gridCap: "算力集群占用示意",
    gridUnit: "CLUSTER LOAD",
    utilLabel: "高端算力占用率",
    metrics: [
      ["融资额", "64", "亿美元"],
      ["事件数", "9", "笔"],
      ["平均单笔", "7.1", "亿美元"],
      ["H100/H200 占比", "58", "%"],
    ],
    shareCap: "资源构成",
    shareUnit: "BY CHIP",
    shares: [
      { k: "H100", v: 38, c: SPECTRUM[0] },
      { k: "H200", v: 20, c: SPECTRUM[1] },
      { k: "A100", v: 27, c: SPECTRUM[4] },
      { k: "其他", v: 15, c: SPECTRUM[6] },
    ],
    conclusion: "算力是 AI 时代最直接的硬资源。",
  };

  const controls = [
    { key: "unitCount", type: "slider", label: "容量单元数", default: 32, min: 16, max: 48, step: 1,
      description: "占用栅格的单元（算力节点）总数。" },
    { key: "columns", type: "slider", label: "栅格列数", default: 8, min: 4, max: 10, step: 1,
      description: "占用栅格的列数。" },
    { key: "fillPercent", type: "slider", label: "占用率(%)", default: 58, min: 30, max: 95, step: 1,
      description: "被占用单元的比例（同时作为占用率读数）。" },
    { key: "showUtil", type: "toggle", label: "占用率读数", default: true,
      description: "栅格上方的巨号占用率百分比。" },
    { key: "chartType", type: "radio", label: "资源构成图表", default: "bar",
      options: [{ value: "bar", label: "条形" }, { value: "stack", label: "堆叠" }],
      description: "资源构成的呈现方式：逐项条形 / 单条堆叠。" },
    { key: "shareCount", type: "slider", label: "资源构成项数", default: 4, min: 2, max: 4, step: 1,
      description: "资源构成（部分-整体）的分项数量。" },
    { key: "focusEnabled", type: "toggle", label: "重点构成项", default: true,
      description: "是否突出某一资源构成分项。" },
    { key: "focusIndex", type: "slider", label: "重点构成序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的资源构成分项序号（从 1 起）。" },
    { key: "showShare", type: "toggle", label: "资源构成块", default: true,
      description: "右下的资源构成（部分-整体）模块。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "右上指标卡的指标行数。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 占用单元 / 指标卡的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseCapacity(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const units = Math.max(16, Math.min(48, p.unitCount));
    const cols = Math.max(4, Math.min(10, p.columns));
    const fill = Math.max(30, Math.min(95, p.fillPercent));
    const filled = Math.round((units * fill) / 100);

    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);

    const nShare = Math.max(2, Math.min(COPY.shares.length, p.shareCount));
    const shares = COPY.shares.slice(0, nShare);
    const shareTotal = shares.reduce((s, x) => s + x.v, 0);
    const shareMax = Math.max.apply(null, shares.map((x) => x.v));
    const focusN = Math.min(p.focusIndex, nShare);

    return (
      <div className="pulse-slide pulse-cap" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-cap__body">
          <div className="pulse-cap__main">
            <div className="pulse-cap__caphead">
              <div className="pulse-cap__cap">
                <span className="pulse-label">{COPY.gridCap}</span>
                <span className="pulse-mono">{COPY.gridUnit}</span>
              </div>
              {p.showUtil && (
                <div className="pulse-cap__util">
                  <b style={{ color: accent }}>{fill}</b><span>%</span>
                  <em>{COPY.utilLabel}</em>
                </div>
              )}
            </div>

            <div className="pulse-cap__grid"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: units }).map((_, i) => {
                const on = i < filled;
                return (
                  <div key={i}
                    className={"pulse-cap__unit" + (on ? " pulse-cap__unit--on" : "")}
                    style={on ? { background: accent } : undefined} />
                );
              })}
            </div>

            <div className="pulse-cap__legend">
              <span><i style={{ background: accent }} />占用 {filled} / {units} 单元</span>
              <span><i className="pulse-cap__legend-idle" />闲置 {units - filled} 单元</span>
            </div>
          </div>

          <div className="pulse-cap__side">
            <div className="pulse-cap__metrics" style={{ background: accent }}>
              {metrics.map((m, i) => (
                <div className="pulse-cap__m" key={i}>
                  <span className="pulse-cap__m-k">{m[0]}</span>
                  <span className="pulse-cap__m-v">{m[1]}<small>{m[2]}</small></span>
                </div>
              ))}
            </div>

            {p.showShare && (
              <div className="pulse-cap__share">
                <div className="pulse-cap__share-cap">
                  <span className="pulse-label">{COPY.shareCap}</span>
                  <span className="pulse-mono">{COPY.shareUnit}</span>
                </div>

                {p.chartType === "stack" ? (
                  <React.Fragment>
                    <div className="pulse-cap__stack">
                      {shares.map((s, i) => {
                        const focus = p.focusEnabled && i + 1 === focusN;
                        const w = (s.v / shareTotal) * 100;
                        return (
                          <i key={i} style={{ width: w + "%", background: s.c,
                            opacity: p.focusEnabled && !focus ? 0.4 : 1 }}>
                            {w > 12 && <span>{s.k}</span>}
                          </i>
                        );
                      })}
                    </div>
                    <div className="pulse-cap__stack-legend">
                      {shares.map((s, i) => (
                        <span key={i} className={p.focusEnabled && i + 1 === focusN ? "is-focus" : ""}>
                          <i style={{ background: s.c }} />{s.k}
                          <b>{Math.round((s.v / shareTotal) * 100)}%</b>
                        </span>
                      ))}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="pulse-cap__bars">
                    {shares.map((s, i) => {
                      const focus = p.focusEnabled && i + 1 === focusN;
                      return (
                        <div className={"pulse-cap__bar" + (focus ? " pulse-cap__bar--focus" : "")} key={i}>
                          <div className="pulse-cap__bar-h">
                            <span className="pulse-cap__bar-name">{s.k}</span>
                            <span className="pulse-cap__bar-v">{Math.round((s.v / shareTotal) * 100)}<small>%</small></span>
                          </div>
                          <div className="pulse-cap__bar-track">
                            <div className="pulse-cap__bar-fill"
                              style={{ width: (s.v / shareMax) * 100 + "%", background: s.c,
                                opacity: p.focusEnabled && !focus ? 0.45 : 1 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-cap__concl">{COPY.conclusion}</div>}
      </div>
    );
  }

  PulseCapacity.controls = controls;
  PulseCapacity.defaults = defaults;

  if (typeof window !== "undefined") PulseCapacity.copyDefaults = COPY;
  PulseCapacity.defaults = { ...(PulseCapacity.defaults || {}), copy: COPY };
  window.PulseCapacity = PulseCapacity;
})();

const Component = window.PulseCapacity;
if (!Component) throw new Error('Missing theme05 component PulseCapacity');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;