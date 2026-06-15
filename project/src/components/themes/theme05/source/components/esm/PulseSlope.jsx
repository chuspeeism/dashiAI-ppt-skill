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
   PulseSlope — P83 chart page ("排名变迁 / Ranking Shift" archetype).
   A generic SLOPE / BUMP chart: two ranked columns (a prior period → a current
   period) with each subject connected by a line, so rises and falls in rank
   read instantly. Line color can encode the change direction, the category, or
   stay monochrome; one subject can be focused (others fade). Geometry is
   computed in-component from numeric scores, so any item subset stays a valid
   ranking permutation. The reusable template for any "how did the ordering
   change between two snapshots" page.

   Self-contained: React + the shared .pulse-slope / .pulse-* CSS. Text/data live
   in COPY (not prop-driven); structure & styling are prop-driven (see controls).

   To migrate into a bundler: delete the `window.PulseSlope = …` line and
   `export default PulseSlope; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "Ranking Shift",
    title: "赛道排名变迁",
    sheet: "CHART · 83 / 86",
    fromLabel: "2023",
    toLabel: "2024",
    fromCap: "上一周期排名",
    toCap: "本周期排名",
    unit: "亿美元",
    // ordering driven by numeric scores → any slice stays a valid permutation.
    items: [
      { name: "大模型基础设施", en: "Foundation", prev: 58, now: 182, cat: 0 },
      { name: "AI 应用层", en: "Applications", prev: 96, now: 121, cat: 3 },
      { name: "算力与芯片", en: "Compute", prev: 74, now: 110, cat: 5 },
      { name: "企业服务", en: "Enterprise", prev: 88, now: 64, cat: 4 },
      { name: "数据与安全", en: "Data & Safety", prev: 41, now: 58, cat: 6 },
      { name: "医疗 AI", en: "Healthcare", prev: 63, now: 47, cat: 1 },
      { name: "机器人与具身", en: "Robotics", prev: 22, now: 39, cat: 2 },
    ],
    conclusion: "基础设施一年内跃居首位，资本重心由应用回流底层。",
  };

  const controls = [
    { key: "itemCount", type: "slider", label: "条目数量", default: 6, min: 4, max: 7, step: 1,
      description: "参与排名对比的条目数量（4–7）。两侧排名按各自周期分值自动计算。" },
    { key: "colorMode", type: "radio", label: "连线配色", default: "change",
      options: [{ value: "change", label: "涨跌" }, { value: "category", label: "类别" }, { value: "mono", label: "单色" }],
      description: "连线着色：按排名涨跌（升绿/降红/平墨）/ 按类别色谱 / 单色。" },
    { key: "focusEnabled", type: "toggle", label: "重点条目", default: true,
      description: "是否突出某一条目（其余连线淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点序号", default: 1, min: 1, max: 7, step: 1,
      description: "重点条目序号（按本周期排名）。" },
    { key: "showRankNumber", type: "toggle", label: "排名序号", default: true,
      description: "两侧的大号排名序号。" },
    { key: "showValue", type: "toggle", label: "数值标注", default: true,
      description: "条目名称旁的本期数值。" },
    { key: "showDelta", type: "toggle", label: "升降标记", default: true,
      description: "右侧的排名升降量（▲/▼）标记。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 重点连线 / 标记的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  // chart geometry (px on the 1920-wide canvas inner content area).
  const W = 1776, H = 678;
  const COLW = 452;        // label column width on each side
  const x0 = COLW, x1 = W - COLW;

  function PulseSlope(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(4, Math.min(COPY.items.length, p.itemCount));
    const slice = COPY.items.slice(0, n);

    // derive prev / now ranks from numeric scores within the current slice.
    const byNow = slice.map((it, i) => i).sort((a, b) => slice[b].now - slice[a].now);
    const byPrev = slice.map((it, i) => i).sort((a, b) => slice[b].prev - slice[a].prev);
    const nowRank = {}, prevRank = {};
    byNow.forEach((idx, r) => { nowRank[idx] = r; });
    byPrev.forEach((idx, r) => { prevRank[idx] = r; });

    const rowH = H / n;
    const y = (rank) => rank * rowH + rowH / 2;
    const focus = Math.min(p.focusIndex, n) - 1;           // 0-based now-rank
    const focusIdx = byNow[focus];                         // item index in focus

    function lineColor(idx) {
      const d = prevRank[idx] - nowRank[idx];              // +rose / -fell
      if (p.colorMode === "category") return SPECTRUM[slice[idx].cat % 7];
      if (p.colorMode === "mono") return "var(--pulse-ink)";
      return d > 0 ? SPECTRUM[3] : d < 0 ? SPECTRUM[0] : "var(--pulse-ink-2)";
    }

    // ordered lists for the two columns (top rank first)
    const leftList = byPrev.map((idx) => ({ idx, rank: prevRank[idx] }));
    const rightList = byNow.map((idx) => ({ idx, rank: nowRank[idx] }));

    return (
      <div className="pulse-slide pulse-slope" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-slope__body">
          <div className="pulse-slope__axis">
            <div className="pulse-slope__axis-cap">
              <b style={{ color: accent }}>{COPY.fromLabel}</b><span>{COPY.fromCap}</span>
            </div>
            <div className="pulse-slope__axis-cap pulse-slope__axis-cap--r">
              <b style={{ color: accent }}>{COPY.toLabel}</b><span>{COPY.toCap}</span>
            </div>
          </div>

          <div className="pulse-slope__plot">
            <svg className="pulse-slope__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              {rightList.map(({ idx }) => {
                const dim = p.focusEnabled && idx !== focusIdx;
                const c = lineColor(idx);
                const yL = y(prevRank[idx]), yR = y(nowRank[idx]);
                const focused = p.focusEnabled && idx === focusIdx;
                return (
                  <g key={idx} opacity={dim ? 0.22 : 1}>
                    <line x1={x0} y1={yL} x2={x1} y2={yR} stroke={c}
                      strokeWidth={focused ? 9 : 5} strokeLinecap="round" />
                    <path d={`M ${x0} ${yL} h 0.001`} stroke={c} fill="none" strokeLinecap="round"
                      vectorEffect="non-scaling-stroke" strokeWidth={focused ? 26 : 18} />
                    <path d={`M ${x1} ${yR} h 0.001`} stroke={c} fill="none" strokeLinecap="round"
                      vectorEffect="non-scaling-stroke" strokeWidth={focused ? 26 : 18} />
                  </g>
                );
              })}
            </svg>

            <div className="pulse-slope__col pulse-slope__col--l">
              {leftList.map(({ idx, rank }) => {
                const dim = p.focusEnabled && idx !== focusIdx;
                return (
                  <div key={idx} className={"pulse-slope__node" + (dim ? " is-dim" : "")}
                    style={{ top: (y(rank) / H * 100) + "%" }}>
                    <span className="pulse-slope__name">{COPY.items[idx].name}</span>
                    {p.showRankNumber && <span className="pulse-slope__rk" style={{ color: accent }}>{rank + 1}</span>}
                  </div>
                );
              })}
            </div>

            <div className="pulse-slope__col pulse-slope__col--r">
              {rightList.map(({ idx, rank }) => {
                const dim = p.focusEnabled && idx !== focusIdx;
                const d = prevRank[idx] - nowRank[idx];
                return (
                  <div key={idx} className={"pulse-slope__node pulse-slope__node--r" + (dim ? " is-dim" : "")}
                    style={{ top: (y(rank) / H * 100) + "%" }}>
                    {p.showRankNumber && <span className="pulse-slope__rk" style={{ color: accent }}>{rank + 1}</span>}
                    <div className="pulse-slope__text">
                      <span className="pulse-slope__name">{COPY.items[idx].name}</span>
                      {(p.showValue || (p.showDelta && d !== 0)) && (
                        <div className="pulse-slope__sub">
                          {p.showValue && <span className="pulse-slope__val">{COPY.items[idx].now}<small>{COPY.unit}</small></span>}
                          {p.showDelta && d !== 0 && (
                            <span className="pulse-slope__delta" style={{ color: d > 0 ? SPECTRUM[3] : SPECTRUM[0] }}>
                              {d > 0 ? "▲" : "▼"}{Math.abs(d)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-slope__concl">{COPY.conclusion}</div>}
      </div>
    );
  }

  PulseSlope.controls = controls;
  PulseSlope.defaults = defaults;

  if (typeof window !== "undefined") PulseSlope.copyDefaults = COPY;
  PulseSlope.defaults = { ...(PulseSlope.defaults || {}), copy: COPY };
  window.PulseSlope = PulseSlope;
})();

const Component = window.PulseSlope;
if (!Component) throw new Error('Missing theme05 component PulseSlope');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;