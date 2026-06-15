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
   PulseProcess — P66 table page ("数据基础设施 / Pipeline Table" archetype).
   A generic Swiss data table whose DISTINGUISHING element is a full-width
   PROCESS PIPELINE band on top (N numbered, connected stages = a data-flow
   diagram) above a structured table [dimension / data / representative /
   verdict]. Complementary to the other table_page archetypes — Matrix (chip
   verdicts), Ledger (inline bars + total), Meter (0–100 gauges), Signal (dot
   meters). Each row optionally carries a color-coded stage tag tying it back to
   the pipeline. The reusable template for any "process + structured table" page.

   Self-contained & migratable: depends only on React + the shared .pulse-proc /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. To migrate into a bundler: delete the `window.PulseProcess = …` line
   and `export default PulseProcess; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
  const STAGE_C = ["#4da0c6","#3c9a52","#e2742c","#d8402e"]; // per-stage colors

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "SCALE AI CASE",
    title: "数据基础设施",
    sheet: "CASE · 66 / 80",
    lead: "Scale AI 代表数据标注、RLHF 和评测数据需求 —— 模型越依赖高质量数据，数据层越有价值。",
    headlines: [
      ["最大单笔融资", "10", "亿美元"],
      ["企业客户", "1200", "家"],
    ],
    stages: [
      { zh: "数据采集", en: "COLLECT" },
      { zh: "人工标注", en: "LABEL" },
      { zh: "RLHF 反馈", en: "FEEDBACK" },
      { zh: "模型评测", en: "EVALUATE" },
    ],
    headers: ["业务维度", "模拟数据", "代表对象", "判断"],
    rows: [
      { stage: 1, k: "数据标注", en: "Annotation", data: "1200 家企业客户", rep: "标注 · 质检 · 数据集", v: "核心" },
      { stage: 2, k: "人类反馈", en: "RLHF",        data: "偏好对齐数据",   rep: "奖励建模 · 偏好", v: "关键" },
      { stage: 3, k: "模型评测", en: "Evaluation",  data: "政府客户 18%",   rep: "安全 · 合规 · 红队", v: "高价值" },
      { stage: 0, k: "规模交付", en: "Operations",  data: "10 亿美元单笔",  rep: "众包 · 流水线",   v: "壁垒" },
    ],
    conclusion: "数据质量是模型竞争的底层变量。",
  };

  const controls = [
    { key: "rowCount", type: "slider", label: "数据行数", default: 4, min: 2, max: 4, step: 1,
      description: "表格的数据行数量。" },
    { key: "showProcess", type: "toggle", label: "流程带", default: true,
      description: "表格上方的数据流程管线带（关闭则隐藏整条）。" },
    { key: "stageCount", type: "slider", label: "流程节点数", default: 4, min: 2, max: 4, step: 1,
      description: "流程管线的阶段（节点）数量。" },
    { key: "stageFocus", type: "slider", label: "重点节点", default: 2, min: 1, max: 4, step: 1,
      description: "被突出的流程节点序号（从 1 起）。" },
    { key: "showStageTag", type: "toggle", label: "阶段标签列", default: true,
      description: "维度列内的彩色阶段标签（与流程带对应）。" },
    { key: "showVerdict", type: "toggle", label: "判断列", default: true,
      description: "末尾「判断」标签列（关闭则为三列表）。" },
    { key: "zebra", type: "toggle", label: "斑马纹", default: false,
      description: "隔行底色，便于横向读取。" },
    { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
      description: "是否突出某一行。" },
    { key: "focusIndex", type: "slider", label: "重点行序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的行序号（从 1 起）。" },
    { key: "showIntro", type: "toggle", label: "引导栏", default: true,
      description: "流程带上方的引导文案与一对头部指标。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
      description: "眉标 / 头部指标 / 重点行的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "表格下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseProcess(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
    const rows = COPY.rows.slice(0, n);
    const nStage = Math.max(2, Math.min(COPY.stages.length, p.stageCount));
    const stages = COPY.stages.slice(0, nStage);
    const stageFocus = Math.min(p.stageFocus, nStage) - 1;

    const showVerdict = p.showVerdict;
    const template = showVerdict ? "1.5fr 1.5fr 1.8fr 1fr" : "1.6fr 1.7fr 2.1fr";
    const headers = showVerdict ? COPY.headers : COPY.headers.slice(0, 3);

    return (
      <div className="pulse-slide pulse-proc" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-proc__body">
          {p.showIntro && (
            <div className="pulse-proc__intro">
              <div className="pulse-proc__lead">{COPY.lead}</div>
              <div className="pulse-proc__hm">
                {COPY.headlines.map((h, i) => (
                  <div className="pulse-proc__hm-item" key={i}>
                    <span className="pulse-proc__hm-v">{h[1]}<small>{h[2]}</small></span>
                    <span className="pulse-proc__hm-k">{h[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {p.showProcess && (
            <div className="pulse-proc__pipe">
              {stages.map((s, i) => {
                const isFocus = i === stageFocus;
                const col = STAGE_C[i % STAGE_C.length];
                return (
                  <React.Fragment key={i}>
                    <div className={"pulse-proc__stage" + (isFocus ? " pulse-proc__stage--focus" : "")}
                      style={isFocus ? { background: col, borderColor: col, color: "#fff" } : { borderColor: col }}>
                      <span className="pulse-proc__stage-no" style={isFocus ? null : { background: col, color: "#fff" }}>{i + 1}</span>
                      <span className="pulse-proc__stage-body">
                        <span className="pulse-proc__stage-zh">{s.zh}</span>
                        <span className="pulse-proc__stage-en">{s.en}</span>
                      </span>
                    </div>
                    {i < stages.length - 1 && <span className="pulse-proc__arrow">→</span>}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div className="pulse-proc__table">
            <div className="pulse-proc__row pulse-proc__row--head" style={{ gridTemplateColumns: template }}>
              {headers.map((h, i) => (
                <div className="pulse-proc__cell" key={i}><span className="pulse-proc__h">{h}</span></div>
              ))}
            </div>

            {rows.map((r, i) => {
              const focus = p.focusEnabled && i + 1 === p.focusIndex;
              const zebra = p.zebra && !focus && i % 2 === 1;
              const cls = "pulse-proc__row pulse-proc__row--body"
                + (focus ? " pulse-proc__row--focus" : "")
                + (zebra ? " pulse-proc__row--zebra" : "");
              const sc = STAGE_C[(r.stage % STAGE_C.length + STAGE_C.length) % STAGE_C.length];
              return (
                <div key={i} className={cls} style={{ gridTemplateColumns: template }}>
                  <div className="pulse-proc__cell">
                    <span className="pulse-proc__k">
                      {p.showStageTag && <i className="pulse-proc__dot" style={{ background: focus ? "#fff" : sc }} />}
                      {r.k}
                    </span>
                    <span className="pulse-proc__sub">{r.en}</span>
                  </div>
                  <div className="pulse-proc__cell">
                    <span className="pulse-proc__data">{r.data}</span>
                  </div>
                  <div className="pulse-proc__cell">
                    <span className="pulse-proc__rep">{r.rep}</span>
                  </div>
                  {showVerdict && (
                    <div className="pulse-proc__cell">
                      <span className="pulse-proc__chip"
                        style={focus ? { background: "#fff", color: accent, borderColor: "#fff" } : null}>{r.v}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-proc__foot">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseProcess.controls = controls;
  PulseProcess.defaults = defaults;

  if (typeof window !== "undefined") PulseProcess.copyDefaults = COPY;
  PulseProcess.defaults = { ...(PulseProcess.defaults || {}), copy: COPY };
  window.PulseProcess = PulseProcess;
})();

const Component = window.PulseProcess;
if (!Component) throw new Error('Missing theme05 component PulseProcess');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;