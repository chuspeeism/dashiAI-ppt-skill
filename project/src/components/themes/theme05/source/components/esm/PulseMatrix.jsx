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
   PulseMatrix — P30 table page ("结构化对照表 / Comparison Matrix" archetype).
   A generic Swiss data table: a colored header band, N rows × M columns,
   optional zebra striping, a focus row, and a final "verdict" column rendered
   as colored tag chips. The reusable `table_page` template for any structured
   dimension / data / example / judgement comparison.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseMatrix.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  // Each row: dimension (k + sub), data (num + unit), example (v), verdict
  // (chip label + color). The verdict column is optional via showVerdict.
  const COPY = {
    eyebrow: "LEGAL AI",
    title: "专业服务高客单价",
    sub: "法律 AI 赛道",
    sheet: "MATRIX · 30 / 32",
    lead: "法律 AI 具备高客单价、强专业壁垒和明确效率提升空间。",
    tag: "维度 × 模拟数据 × 代表场景 × 判断",
    headers: ["维度", "模拟数据", "代表场景", "判断"],
    rows: [
      { k: "合同审查",   sub: "Contract Review", num: "46", unit: "% 场景占比", ex: "条款比对 · 风险标注", chip: "高频", c: SPECTRUM[0] },
      { k: "尽职调查",   sub: "Due Diligence",   num: "12", unit: "亿美元",     ex: "文档归集 · 引用核验", chip: "高值", c: SPECTRUM[5] },
      { k: "法律检索",   sub: "Legal Research",  num: "4.3", unit: "亿美元/笔",  ex: "判例检索 · 摘要生成", chip: "成熟", c: SPECTRUM[3] },
      { k: "合规问答",   sub: "Compliance Q&A",  num: "6", unit: "笔事件",       ex: "政策解读 · 审计链路", chip: "壁垒", c: SPECTRUM[4] },
    ],
    conclusion: "法律 AI 是垂直应用商业化样本。",
  };

  function PulseMatrix(props) {
    const p = Object.assign({}, PulseMatrix.defaults, props);
    const accent = p.accentColor;
    const n = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
    const rows = COPY.rows.slice(0, n);
    const showVerdict = p.showVerdict;
    const cols = showVerdict ? 4 : 3;
    // dimension wider; data / example / verdict share the rest
    const template = showVerdict ? "1.5fr 1.3fr 1.7fr 1fr" : "1.5fr 1.4fr 2fr";

    return (
      <div className="pulse-slide pulse-mtx" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-mtx__body">
          {p.showIntro && (
            <div className="pulse-mtx__intro">
              <div className="pulse-mtx__intro-lead">{COPY.lead}</div>
              <div className="pulse-mtx__intro-tag">{COPY.tag}</div>
            </div>
          )}

          <div className="pulse-mtx__table">
            <div className="pulse-mtx__row pulse-mtx__row--head" style={{ gridTemplateColumns: template }}>
              {COPY.headers.slice(0, cols).map((h, i) => (
                <div className="pulse-mtx__cell" key={i}><span className="pulse-mtx__h">{h}</span></div>
              ))}
            </div>

            {rows.map((r, i) => {
              const focus = p.focusEnabled && i + 1 === p.focusIndex;
              const zebra = p.zebra && !focus && i % 2 === 1;
              const cls = "pulse-mtx__row pulse-mtx__row--body"
                + (focus ? " pulse-mtx__row--focus" : "")
                + (zebra ? " pulse-mtx__row--zebra" : "");
              return (
                <div key={i} className={cls} style={{ gridTemplateColumns: template }}>
                  <div className="pulse-mtx__cell">
                    <span className="pulse-mtx__k">{r.k}</span>
                    <span className="pulse-mtx__sub">{r.sub}</span>
                  </div>
                  <div className="pulse-mtx__cell">
                    <span className="pulse-mtx__num">{r.num}<span style={{ fontSize: "0.5em", fontWeight: 600, marginLeft: 6, opacity: 0.7 }}>{r.unit}</span></span>
                  </div>
                  <div className="pulse-mtx__cell">
                    <span className="pulse-mtx__v">{r.ex}</span>
                  </div>
                  {showVerdict && (
                    <div className="pulse-mtx__cell">
                      <span className="pulse-mtx__chip" style={{ background: r.c }}>{r.chip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-mtx__foot">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseMatrix.controls = [
    { key: "rowCount", type: "slider", label: "数据行数", default: 4, min: 2, max: 4, step: 1,
      description: "表格的数据行数量。" },
    { key: "showVerdict", type: "toggle", label: "判断列", default: true,
      description: "是否显示末尾的「判断」标签列（关闭则为三列表）。" },
    { key: "zebra", type: "toggle", label: "斑马纹", default: false,
      description: "隔行底色，便于横向读取。" },
    { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
      description: "是否突出某一行。" },
    { key: "focusIndex", type: "slider", label: "重点行序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的行序号（从 1 起）。" },
    { key: "showIntro", type: "toggle", label: "引导栏", default: true,
      description: "表格上方的引导文案与维度说明。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "眉标与重点行的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "表格下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseMatrix.defaults = PulseMatrix.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseMatrix.copyDefaults = COPY;
  PulseMatrix.defaults = { ...(PulseMatrix.defaults || {}), copy: COPY };
  window.PulseMatrix = PulseMatrix;
})();

const Component = window.PulseMatrix;
if (!Component) throw new Error('Missing theme05 component PulseMatrix');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;