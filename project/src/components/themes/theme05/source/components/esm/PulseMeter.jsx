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
   PulseMeter — P44 table page ("指标仪表表 / KPI Gauge Table" archetype).
   A generic structured table whose distinguishing element is a GAUGE column:
   each row carries a 0–100 metric rendered as a filled track with an optional
   benchmark tick (vs. baseline), plus a value cell and an optional verdict chip.
   An optional compact process strip sits above the table. Complements PulseMatrix
   (chip table) and PulseLedger (share-bar + total) as a third reusable
   `table_page` archetype — for any "KPI / ratio / ROI vs. benchmark" comparison.

   Self-contained & migratable: depends only on React + the shared .pulse-meter /
   .pulse-* CSS. Controlled ENTIRELY by props. See PulseMeter.controls for the
   typed, documented parameter list. Text/data live in COPY (not prop-driven).

   To migrate into a bundler: delete the `window.PulseMeter = …` line and
   `export default PulseMeter; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  // Each row: name (k + en), value (val + unit), benchmark (base), gauge fill
  // (0–100), verdict chip (+ color).
  const COPY = {
    eyebrow: "CUSTOMER SUPPORT AI",
    title: "可量化降本场景",
    sub: "客服 AI 赛道",
    sheet: "TABLE · 44 / 80",
    lead: "客服 AI 是最容易量化 ROI 的垂直应用之一。",
    tag: "指标 × 当前值 × 行业基准 × 判断",
    metrics: [
      ["融资额", "27", "亿美元"],
      ["事件数", "9", "笔"],
    ],
    process: [
      { zh: "受理",     en: "INTAKE" },
      { zh: "自动分流", en: "ROUTE" },
      { zh: "AI 回复",  en: "AI REPLY" },
      { zh: "人工升级", en: "ESCALATE" },
    ],
    headers: ["指标", "当前值", "对比行业基准", "判断"],
    rows: [
      { k: "对话替代率",   en: "Deflection Rate", val: 32, unit: "%", base: 20, chip: "可量化", c: SPECTRUM[0] },
      { k: "工单时长下降", en: "Handle Time",     val: 41, unit: "%", base: 25, chip: "高 ROI", c: SPECTRUM[3] },
      { k: "首次解决率",   en: "First Contact",    val: 68, unit: "%", base: 55, chip: "稳健",   c: SPECTRUM[5] },
      { k: "客户满意度",   en: "CSAT",             val: 88, unit: "%", base: 80, chip: "正向",   c: SPECTRUM[4] },
    ],
    conclusion: "能量化 ROI 的场景更容易获得预算。",
  };

  const controls = [
    { key: "rowCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "表格的指标行数量。" },
    { key: "showGauge", type: "toggle", label: "仪表列", default: true,
      description: "0–100 的指标仪表条列（关闭则收起该列）。" },
    { key: "showBenchmark", type: "toggle", label: "行业基准标记", default: true,
      description: "仪表条上的行业基准刻度与差值。" },
    { key: "showVerdict", type: "toggle", label: "判断列", default: true,
      description: "末尾的「判断」标签列（关闭则收起该列）。" },
    { key: "zebra", type: "toggle", label: "斑马纹", default: false,
      description: "隔行底色，便于横向读取。" },
    { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
      description: "是否突出某一行。" },
    { key: "focusIndex", type: "slider", label: "重点行序号", default: 2, min: 1, max: 4, step: 1,
      description: "被突出的行序号（从 1 起）。" },
    { key: "showProcess", type: "toggle", label: "流程条", default: true,
      description: "表格上方的工单流程节点条。" },
    { key: "processNodeCount", type: "slider", label: "流程节点数", default: 4, min: 2, max: 4, step: 1,
      description: "流程条的节点数量。" },
    { key: "showIntro", type: "toggle", label: "引导栏", default: true,
      description: "表格上方的引导文案、维度说明与指标对。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 重点行 / 仪表填充的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "表格下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseMeter(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
    const rows = COPY.rows.slice(0, n);
    const focusN = Math.min(p.focusIndex, n);

    const nProc = Math.max(2, Math.min(COPY.process.length, p.processNodeCount));
    const procs = COPY.process.slice(0, nProc);

    // Column template assembled from toggles: name / value / gauge? / verdict?
    const cols = ["1.5fr", "0.95fr"];
    if (p.showGauge) cols.push("2.4fr");
    if (p.showVerdict) cols.push("0.85fr");
    const template = cols.join(" ");
    const headers = [COPY.headers[0], COPY.headers[1]];
    if (p.showGauge) headers.push(COPY.headers[2]);
    if (p.showVerdict) headers.push(COPY.headers[3]);

    return (
      <div className="pulse-slide pulse-meter pulse-meter--no-motion" style={{ "--pulse-accent": accent }}>
        <style>{`.pulse-meter--no-motion,.pulse-meter--no-motion *,.pulse-meter--no-motion *::before,.pulse-meter--no-motion *::after{transition:none!important;animation:none!important;}`}</style>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-meter__body">
          {p.showIntro && (
            <div className="pulse-meter__intro">
              <div className="pulse-meter__intro-l">
                <div className="pulse-meter__intro-lead">{COPY.lead}</div>
                <div className="pulse-meter__intro-tag">{COPY.tag}</div>
              </div>
              <div className="pulse-meter__intro-metrics">
                {COPY.metrics.map((m, i) => (
                  <div className="pulse-meter__hm" key={i}>
                    <span className="pulse-meter__hm-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                    <span className="pulse-meter__hm-k">{m[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {p.showProcess && (
            <div className="pulse-meter__process">
              {procs.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="pulse-meter__proc">
                    <span className="pulse-meter__proc-i">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pulse-meter__proc-zh">{s.zh}</span>
                    <span className="pulse-meter__proc-en">{s.en}</span>
                  </div>
                  {i < procs.length - 1 && <span className="pulse-meter__proc-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="pulse-meter__table">
            <div className="pulse-meter__row pulse-meter__row--head" style={{ gridTemplateColumns: template }}>
              {headers.map((h, i) => (
                <div className="pulse-meter__cell" key={i}><span className="pulse-meter__h">{h}</span></div>
              ))}
            </div>

            {rows.map((r, i) => {
              const focus = p.focusEnabled && i + 1 === focusN;
              const zebra = p.zebra && !focus && i % 2 === 1;
              const cls = "pulse-meter__row pulse-meter__row--body"
                + (focus ? " pulse-meter__row--focus" : "")
                + (zebra ? " pulse-meter__row--zebra" : "");
              const delta = r.val - r.base;
              return (
                <div key={i} className={cls} style={{ gridTemplateColumns: template }}>
                  <div className="pulse-meter__cell">
                    <span className="pulse-meter__k">{r.k}</span>
                    <span className="pulse-meter__sub">{r.en}</span>
                  </div>
                  <div className="pulse-meter__cell">
                    <span className="pulse-meter__num">{r.val}<small>{r.unit}</small></span>
                  </div>
                  {p.showGauge && (
                    <div className="pulse-meter__cell pulse-meter__cell--gauge">
                      <div className="pulse-meter__gauge">
                        <div className="pulse-meter__gauge-track">
                          <div className="pulse-meter__gauge-fill"
                            style={{ width: Math.max(0, Math.min(100, r.val)) + "%",
                              background: focus ? accent : r.c }} />
                          {p.showBenchmark && (
                            <div className="pulse-meter__gauge-mark" style={{ left: Math.max(0, Math.min(100, r.base)) + "%" }} />
                          )}
                        </div>
                        {p.showBenchmark && (
                          <div className="pulse-meter__gauge-cap">
                            基准 {r.base}{r.unit} · <b style={{ color: focus ? "#fff" : accent }}>{delta >= 0 ? "+" : ""}{delta}pt</b>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {p.showVerdict && (
                    <div className="pulse-meter__cell">
                      <span className="pulse-meter__chip" style={{ background: r.c }}>{r.chip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-meter__foot">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseMeter.controls = controls;
  PulseMeter.defaults = defaults;

  if (typeof window !== "undefined") PulseMeter.copyDefaults = COPY;
  PulseMeter.defaults = { ...(PulseMeter.defaults || {}), copy: COPY };
  window.PulseMeter = PulseMeter;
})();

const Component = window.PulseMeter;
if (!Component) throw new Error('Missing theme05 component PulseMeter');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;
