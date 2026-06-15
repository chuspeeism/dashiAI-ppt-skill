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
   PulseLedger — P38 table page ("结构拆分表 / Ledger Table + inline bars").
   A generic Swiss data table whose distinguishing element is an INLINE
   proportion bar column (a data-bar table) plus a computed total row. Rows
   carry a name (+ en), an amount (num + unit), a proportional bar, and an
   optional verdict chip. The reusable `table_page` archetype for any
   "layer / item × amount × share × judgement" structured breakdown.

   Self-contained: React + .pulse-ldg / .pulse-* CSS only. Controlled entirely
   by props. See PulseLedger.controls for the typed, documented parameter list.

   To migrate into a bundler: delete the `window.PulseLedger = …` line and
   `export default PulseLedger` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "AI CHIPS",
    title: "训练与推理硬件",
    sheet: "TABLE · 38 / 80",
    lead: "AI 芯片融资集中在训练加速器、推理芯片与边缘 AI。",
    tag: "层级 × 资金规模 × 资金占比 × 判断",
    unit: "亿美元",
    totalLabel: "合计",
    totalEn: "TOTAL FUNDING",
    headers: ["层级", "资金规模", "资金占比", "判断"],
    rows: [
      { k: "训练芯片", en: "Training Accelerator", v: 46, chip: "高资本", c: SPECTRUM[0] },
      { k: "推理芯片", en: "Inference Chip",       v: 32, chip: "放量",   c: SPECTRUM[5] },
      { k: "边缘 AI",  en: "Edge AI",              v: 19, chip: "早期",   c: SPECTRUM[3] },
      { k: "封装互联", en: "Packaging / Interconnect", v: 12, chip: "壁垒", c: SPECTRUM[4] },
    ],
    conclusion: "硬件方向看长期确定性。",
  };

  const controls = [
    { key: "rowCount", type: "slider", label: "数据行数", default: 3, min: 2, max: 4, step: 1,
      description: "表格的数据行数量。" },
    { key: "showBar", type: "toggle", label: "内联占比条", default: true,
      description: "「资金占比」列内的水平占比条（数据条表）。" },
    { key: "showTotal", type: "toggle", label: "合计行", default: true,
      description: "末尾按当前行自动汇总的合计行。" },
    { key: "showVerdict", type: "toggle", label: "判断列", default: true,
      description: "末列的「判断」标签 chip（关闭则收起该列）。" },
    { key: "zebra", type: "toggle", label: "斑马纹", default: false,
      description: "隔行底色，便于横向读取。" },
    { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
      description: "是否突出某一行。" },
    { key: "focusIndex", type: "slider", label: "重点行序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的行序号（从 1 起）。" },
    { key: "colorMode", type: "radio", label: "占比条配色", default: "category",
      options: [{ value: "category", label: "按类别" }, { value: "accent", label: "强调色" }, { value: "mono", label: "单色" }],
      description: "内联占比条的配色方式。" },
    { key: "showIntro", type: "toggle", label: "引导栏", default: true,
      description: "表格上方的引导文案与维度说明。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "眉标 / 重点行 / 合计行的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "表格下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseLedger(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
    const rows = COPY.rows.slice(0, n);
    const max = Math.max.apply(null, rows.map((r) => r.v));
    const total = rows.reduce((s, r) => s + r.v, 0);

    const barColor = (r) => p.colorMode === "accent" ? accent
      : p.colorMode === "mono" ? "var(--pulse-ink)" : r.c;

    // build column template from which columns are visible
    const cols = [];
    cols.push("1.5fr");          // layer name
    cols.push("1.05fr");         // amount
    if (p.showBar) cols.push("2fr"); // inline share bar
    if (p.showVerdict) cols.push("0.85fr"); // verdict
    const template = cols.join(" ");
    const headers = [COPY.headers[0], COPY.headers[1]];
    if (p.showBar) headers.push(COPY.headers[2]);
    if (p.showVerdict) headers.push(COPY.headers[3]);

    return (
      <div className="pulse-slide pulse-ldg" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-ldg__body">
          {p.showIntro && (
            <div className="pulse-ldg__intro">
              <div className="pulse-ldg__intro-lead">{COPY.lead}</div>
              <div className="pulse-ldg__intro-tag">{COPY.tag}</div>
            </div>
          )}

          <div className="pulse-ldg__table">
            <div className="pulse-ldg__row pulse-ldg__row--head" style={{ gridTemplateColumns: template }}>
              {headers.map((h, i) => (
                <div className="pulse-ldg__cell" key={i}><span className="pulse-ldg__h">{h}</span></div>
              ))}
            </div>

            {rows.map((r, i) => {
              const focus = p.focusEnabled && i + 1 === p.focusIndex;
              const zebra = p.zebra && !focus && i % 2 === 1;
              const cls = "pulse-ldg__row pulse-ldg__row--body"
                + (focus ? " pulse-ldg__row--focus" : "")
                + (zebra ? " pulse-ldg__row--zebra" : "");
              return (
                <div key={i} className={cls} style={{ gridTemplateColumns: template }}>
                  <div className="pulse-ldg__cell">
                    <span className="pulse-ldg__k">{r.k}</span>
                    <span className="pulse-ldg__en">{r.en}</span>
                  </div>
                  <div className="pulse-ldg__cell pulse-ldg__cell--num">
                    <span className="pulse-ldg__num">{r.v}<small>{COPY.unit}</small></span>
                  </div>
                  {p.showBar && (
                    <div className="pulse-ldg__cell pulse-ldg__cell--bar">
                      <div className="pulse-ldg__bar-track">
                        <div className="pulse-ldg__bar-fill"
                          style={{ width: (r.v / max) * 100 + "%", background: focus ? "#fff" : barColor(r) }} />
                      </div>
                      <span className="pulse-ldg__bar-pct">{Math.round((r.v / total) * 100)}%</span>
                    </div>
                  )}
                  {p.showVerdict && (
                    <div className="pulse-ldg__cell pulse-ldg__cell--chip">
                      <span className="pulse-ldg__chip" style={{ background: r.c }}>{r.chip}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {p.showTotal && (
              <div className="pulse-ldg__row pulse-ldg__row--total" style={{ gridTemplateColumns: template, background: accent }}>
                <div className="pulse-ldg__cell">
                  <span className="pulse-ldg__k">{COPY.totalLabel}</span>
                  <span className="pulse-ldg__en">{COPY.totalEn}</span>
                </div>
                <div className="pulse-ldg__cell pulse-ldg__cell--num">
                  <span className="pulse-ldg__num">{total}<small>{COPY.unit}</small></span>
                </div>
                {p.showBar && (
                  <div className="pulse-ldg__cell pulse-ldg__cell--bar">
                    <div className="pulse-ldg__bar-track pulse-ldg__bar-track--total">
                      <div className="pulse-ldg__bar-fill" style={{ width: "100%", background: "#fff" }} />
                    </div>
                    <span className="pulse-ldg__bar-pct">100%</span>
                  </div>
                )}
                {p.showVerdict && <div className="pulse-ldg__cell" />}
              </div>
            )}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-ldg__foot">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseLedger.controls = controls;
  PulseLedger.defaults = defaults;

  if (typeof window !== "undefined") PulseLedger.copyDefaults = COPY;
  PulseLedger.defaults = { ...(PulseLedger.defaults || {}), copy: COPY };
  window.PulseLedger = PulseLedger;
})();

const Component = window.PulseLedger;
if (!Component) throw new Error('Missing theme05 component PulseLedger');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;