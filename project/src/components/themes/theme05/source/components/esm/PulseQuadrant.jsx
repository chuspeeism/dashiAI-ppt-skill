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
   PulseQuadrant — P11 chart page ("四象限 / 2×2 Matrix" archetype).
   A generic 2×2 opportunity matrix: four labelled quadrants positioned by two
   axes, each holding a name, an english tag and representative items, with an
   optional quadrant focus, decorative scatter dots and tinted cells.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseQuadrant.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    eyebrow: "HEAT vs. MONETIZATION",
    title: "资本热度 × 商业兑现",
    sub: "四象限机会判断",
    sheet: "OPPORTUNITY · 11 / 32",
    axisX: "商业兑现",
    axisY: "资本热度",
    // Quadrant order matches the focusIndex (1..4); `area` places it on the grid.
    quads: [
      { zh: "明星兑现", en: "STAR DELIVERY", c: SPECTRUM[3], area: "tr", note: "高热度 · 高兑现",
        items: ["基础设施", "数据平台"], dots: [[30, 38], [58, 26], [72, 60]] },
      { zh: "叙事泡沫", en: "NARRATIVE BUBBLE", c: SPECTRUM[0], area: "tl", note: "高热度 · 低兑现",
        items: ["通用模型", "AGI 实验室"], dots: [[40, 30], [64, 52], [28, 64]] },
      { zh: "隐形价值", en: "HIDDEN VALUE", c: SPECTRUM[5], area: "br", note: "低热度 · 高兑现",
        items: ["垂直应用", "企业搜索"], dots: [[34, 44], [60, 34], [50, 66]] },
      { zh: "等待验证", en: "TO BE PROVEN", c: SPECTRUM[1], area: "bl", note: "低热度 · 低兑现",
        items: ["长尾工具", "安全", "早期硬件"], dots: [[36, 40], [58, 58], [70, 30]] },
    ],
    conclusion: "资本正在从叙事驱动转向兑现驱动。",
  };

  function Quad({ q, idx, p, accent }) {
    const focus = p.focusEnabled && idx + 1 === p.focusIndex;
    const filled = p.quadrantTint || focus; // focus quadrant fills even in line-art mode
    const tint = filled
      ? { background: q.c, "--qfg": "#fff", "--qchip": "rgba(255,255,255,0.18)", "--qmute": "rgba(255,255,255,0.72)" }
      : { background: "var(--pulse-paper)", "--qfg": "var(--pulse-ink)", "--qchip": "var(--pulse-paper-2)", "--qmute": "var(--pulse-mute)" };
    return (
      <div
        className={"pulse-quad__cell" + (focus ? " pulse-quad__cell--focus" : "")}
        style={Object.assign({ gridArea: q.area }, tint)}
      >
        {focus && <div className="pulse-quad__flag" style={{ background: accent }}>重点</div>}
        {p.showScatter && q.dots.map((d, k) => (
          <span key={k} className="pulse-quad__dot"
            style={{ left: d[0] + "%", top: d[1] + "%", background: filled ? "#fff" : q.c }} />
        ))}
        <div className="pulse-quad__cell-head">
          <span className="pulse-quad__cell-bullet" style={{ background: filled ? "#fff" : q.c }} />
          <span className="pulse-quad__cell-note">{q.note}</span>
        </div>
        <div className="pulse-quad__cell-zh">{q.zh}</div>
        <div className="pulse-quad__cell-en">{q.en}</div>
        {p.showItems && (
          <div className="pulse-quad__chips">
            {q.items.map((it, k) => <span key={k} className="pulse-quad__chip">{it}</span>)}
          </div>
        )}
      </div>
    );
  }

  function PulseQuadrant(props) {
    const p = Object.assign({}, PulseQuadrant.defaults, props);
    const accent = p.accentColor;

    return (
      <div className="pulse-slide pulse-quad" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-quad__caphead">
          <span className="pulse-label">{COPY.sub}</span>
        </div>

        <div className="pulse-quad__plot">
          {p.showAxisLabels && (
            <div className="pulse-quad__yaxis">
              <span className="pulse-quad__axis-hi">高</span>
              <span className="pulse-quad__axis-name">{COPY.axisY}</span>
              <span className="pulse-quad__axis-lo">低</span>
            </div>
          )}
          <div className="pulse-quad__grid">
            {COPY.quads.map((q, i) => <Quad key={i} q={q} idx={i} p={p} accent={accent} />)}
          </div>
          {p.showAxisLabels && (
            <div className="pulse-quad__xaxis">
              <span className="pulse-quad__axis-lo">低</span>
              <span className="pulse-quad__axis-name">{COPY.axisX}</span>
              <span className="pulse-quad__axis-hi">高</span>
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-quad__concl">{COPY.conclusion}</div>}
      </div>
    );
  }

  PulseQuadrant.controls = [
    { key: "focusEnabled", type: "toggle", label: "突出象限", default: true,
      description: "是否突出某一个象限。" },
    { key: "focusIndex", type: "slider", label: "重点象限", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的象限序号（1 明星兑现 / 2 叙事泡沫 / 3 隐形价值 / 4 等待验证）。" },
    { key: "quadrantTint", type: "toggle", label: "象限底色", default: false,
      description: "是否为四个象限填充类别底色（关闭则为线框留白风格）。" },
    { key: "showItems", type: "toggle", label: "代表方向", default: true,
      description: "每个象限内的代表方向标签。" },
    { key: "showScatter", type: "toggle", label: "散点标记", default: true,
      description: "象限内装饰性散点（代表落点公司）。" },
    { key: "showAxisLabels", type: "toggle", label: "坐标轴标签", default: true,
      description: "矩阵外侧的两条坐标轴标签。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "重点象限标记与眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseQuadrant.defaults = PulseQuadrant.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseQuadrant.copyDefaults = COPY;
  PulseQuadrant.defaults = { ...(PulseQuadrant.defaults || {}), copy: COPY };
  window.PulseQuadrant = PulseQuadrant;
})();

const Component = window.PulseQuadrant;
if (!Component) throw new Error('Missing theme05 component PulseQuadrant');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;