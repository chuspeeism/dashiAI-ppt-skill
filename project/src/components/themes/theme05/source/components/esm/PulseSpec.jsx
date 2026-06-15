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
   PulseSpec — P02 specification / summary slide ("Specification" archetype).
   Self-contained: React + .pulse-* CSS (+ optional PulseImageFrame for slots).
   Image slots are prop-driven: pass `images` (array of {src, ar}) and
   `onImageChange(index, src, ar)`; the component lays out `imageCount` frames
   in a balanced column and they self-adapt to each image's aspect ratio.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    title: "报告摘要",
    sheet: "OVERVIEW · 02 / 32",
    figCap: "FIG.1 — 资本流向全景",
    figMono: "97 DEALS · 16 SECTORS · 4 QUARTERS",
    leadPre: "2024 年美国 AI 初创公司吸纳约 ",
    leadHL1: "970 亿美元",
    leadMid: " 风险投资，单笔 ≥ 1 亿美元的大额融资事件达 ",
    leadHL2: "97 笔",
    leadPost: "，资本向头部高度集中。",
    specs: [
      { k: "全年融资", v: "970 亿美元" },
      { k: "大额事件", v: "97 笔" },
      { k: "平均单笔", v: "10 亿美元" },
      { k: "湾区占比", v: "63.9%" },
      { k: "Top10 集中", v: "23.8%" },
    ],
    propTitle: "赛道融资占比",
    props: [
      { name: "通用大模型", v: 43.3, c: SPECTRUM[0] },
      { name: "垂直应用",   v: 25.3, c: SPECTRUM[1] },
      { name: "基础设施",   v: 16.3, c: SPECTRUM[4] },
      { name: "AI 芯片",    v: 10.0, c: SPECTRUM[5] },
      { name: "其他",       v: 5.1,  c: SPECTRUM[3] },
    ],
  };

  function Proportion({ type }) {
    if (type === "cells") {
      return (
        <div className="pulse-spec2__cells">
          {COPY.props.map((s, i) => (
            <div className="pulse-spec2__cell" key={i} style={{ flexGrow: s.v }}>
              <div className="pulse-spec2__cell-bar" style={{ background: s.c }} />
              <div className="pulse-spec2__cell-cap">
                <span className="pulse-spec2__cell-name">{s.name}</span>
                <b>{s.v}%</b>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="pulse-spec2__bar">
        {COPY.props.map((s, i) => (
          <span key={i} style={{ background: s.c, flexGrow: s.v }}>
            {s.v >= 10 ? s.v + "%" : ""}
          </span>
        ))}
      </div>
    );
  }

  function PulseSpec(props) {
    const p = Object.assign({}, PulseSpec.defaults, props);
    const accent = p.accentColor;
    const specs = COPY.specs.slice(0, Math.max(2, p.specRowCount));
    const n = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const Frame = window.PulseImageFrame;

    const lead = p.showHighlight ? (
      <p className="pulse-spec2__lead">
        {COPY.leadPre}<span className="hl">{COPY.leadHL1}</span>{COPY.leadMid}
        <span className="hl">{COPY.leadHL2}</span>{COPY.leadPost}
      </p>
    ) : (
      <p className="pulse-spec2__lead">
        {COPY.leadPre}{COPY.leadHL1}{COPY.leadMid}{COPY.leadHL2}{COPY.leadPost}
      </p>
    );

    return (
      <div className="pulse-slide pulse-spec2" style={{ "--pulse-accent": accent }}>
        <div className="pulse-spec2__head">
          <h1 className="pulse-spec2__title">{COPY.title}</h1>
          {p.showSheetLabel && <div className="pulse-spec2__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-spec2__body">
          {n > 0 && Frame && (
            <div className="pulse-spec2__figs" style={{ gridTemplateRows: `repeat(${n}, auto)` }}>
              {Array.from({ length: n }).map((_, i) => {
                const im = images[i] || {};
                return (
                  <div key={i}>
                    <Frame
                      src={im.src || null}
                      ar={im.ar || null}
                      editable={p.editable !== false}
                      defaultAR={n === 1 ? 1.45 : 1.7}
                      label={"FIG." + (i + 1)}
                      placeholder="拖入或点击上传图片"
                      onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)}
                    />
                    {i === 0 && (
                      <div className="pulse-spec2__figcap">
                        <div className="pulse-label">{COPY.figCap}</div>
                        <div className="pulse-mono" style={{ marginTop: 8 }}>{COPY.figMono}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="pulse-spec2__right">
            {lead}
            <div className="pulse-spectable">
              {specs.map((s, i) => (
                <div className="pulse-spectable__row" key={i}>
                  <div className="pulse-spectable__k">{s.k}</div>
                  <div className="pulse-spectable__v"><b>{s.v}</b></div>
                </div>
              ))}
            </div>

            {p.showProportionBar && (
              <div className="pulse-spec2__prop">
                <div className="pulse-spec2__prop-label">
                  <span className="pulse-label">{COPY.propTitle}</span>
                  <span className="pulse-mono">SHARE OF $97B</span>
                </div>
                <Proportion type={p.chartType} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  PulseSpec.controls = [
    { key: "imageCount", type: "slider", label: "图片数量", default: 1, min: 0, max: 2, step: 1,
      description: "左侧图示槽位数量（0–2），图片按上传比例自适应。" },
    { key: "specRowCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 5, step: 1,
      description: "右侧规格指标表的行数。" },
    { key: "showHighlight", type: "toggle", label: "关键数据高亮", default: true,
      description: "正文中关键数字使用强调色高亮。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "正文高亮使用的强调色。" },
    { key: "chartType", type: "radio", label: "占比图样式", default: "bar", options: ["bar", "cells"],
      description: "占比可视化：整条堆叠 (bar) 或分段色块 (cells)。" },
    { key: "showProportionBar", type: "toggle", label: "底部占比图", default: true,
      description: "显示底部赛道占比可视化。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseSpec.defaults = PulseSpec.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseSpec.copyDefaults = COPY;
  PulseSpec.defaults = { ...(PulseSpec.defaults || {}), copy: COPY };
  window.PulseSpec = PulseSpec;
})();

const Component = window.PulseSpec;
if (!Component) throw new Error('Missing theme05 component PulseSpec');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;