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
   PulseStack — P68 content page ("数据平台延展 / Platform Architecture Stack").
   A no-image content page whose DISTINGUISHING element is a LAYERED PLATFORM
   ARCHITECTURE stack: N full-width tiers stacked bottom→top (storage → compute →
   ML/AI → apps), one tier emphasizable as the "AI extension", each carrying a
   zh/en label and optional capability chips. A themed identity card (EN +
   headline + sub + lead + metric ledger) sits beside the stack. The reusable
   template for any "single-company platform / architecture extension" page —
   complementary to PulseChain (P07, a 3-tier value chain with a side panel).

   Self-contained & migratable: depends only on React + the shared .pulse-stk /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. To migrate into a bundler: delete the `window.PulseStack = …` line and
   `export default PulseStack; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  // tiers listed top→bottom (apps first); rendered in that order.
  const COPY = {
    eyebrow: "DATABRICKS CASE",
    title: "数据平台延展",
    sheet: "CASE · 68 / 80",
    en: "DATABRICKS",
    zh: "数据平台 → AI 平台",
    sub: "Databricks 案例",
    lead: "已有数据平台更容易把 AI 能力卖给现有企业客户 —— 存量客户基础是 AI 商业化捷径。",
    ledger: [
      ["最大单笔融资", "5.0", "亿美元"],
      ["企业客户", "1.1", "万家"],
      ["净收入留存", "132", "%"],
      ["赛道", "数据平台", ""],
    ],
    stackCap: "平台架构",
    stackUnit: "DATA → AI EXTENSION",
    tiers: [
      { zh: "智能应用", en: "AI APPS", items: ["助手", "检索增强", "智能决策"] },
      { zh: "ML / AI 平台", en: "ML PLATFORM", items: ["模型训练", "特征工程", "MLOps"] },
      { zh: "计算引擎", en: "COMPUTE", items: ["Spark", "SQL 引擎", "流批一体"] },
      { zh: "数据湖仓", en: "LAKEHOUSE", items: ["统一存储", "数据治理", "开放表格式"] },
    ],
    expandK: "净收入留存",
    expandNote: "存量客户向 AI 层扩张",
    conclusion: "存量客户基础是 AI 商业化捷径。",
  };

  const controls = [
    { key: "tierCount", type: "slider", label: "架构层数", default: 4, min: 2, max: 4, step: 1,
      description: "平台架构的层级（tier）数量。" },
    { key: "focusEnabled", type: "toggle", label: "突出层", default: true,
      description: "是否突出某一层（作为「AI 延展层」以强调色着色）。" },
    { key: "focusIndex", type: "slider", label: "突出层序号", default: 2, min: 1, max: 4, step: 1,
      description: "被突出的层序号（自顶向下，从 1 起）。" },
    { key: "showItems", type: "toggle", label: "能力标签", default: true,
      description: "各层右侧的能力 chip 标签。" },
    { key: "showExpand", type: "toggle", label: "扩张读数", default: true,
      description: "架构带顶部的净收入留存扩张读数。" },
    { key: "cardTheme", type: "radio", label: "主体卡主题", default: "dark",
      options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
      description: "主体卡背景：深色 / 强调色块 / 纸色。" },
    { key: "metricCount", type: "slider", label: "明细行数", default: 4, min: 2, max: 4, step: 1,
      description: "主体卡内的指标明细行数。" },
    { key: "showLead", type: "toggle", label: "引导说明", default: true,
      description: "标题下方的一句引导说明。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标 / 延展层 /「色块」主题下主体卡的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseStack(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const nTier = Math.max(2, Math.min(COPY.tiers.length, p.tierCount));
    const tiers = COPY.tiers.slice(0, nTier);
    const focusTier = p.focusEnabled ? Math.min(p.focusIndex, nTier) - 1 : -1;
    const nLedger = Math.max(2, Math.min(COPY.ledger.length, p.metricCount));
    const ledger = COPY.ledger.slice(0, nLedger);

    // theme → card bg / fg / divider color
    let bg, fg, div;
    if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }
    else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
    else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }

    return (
      <div className="pulse-slide pulse-stk" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-stk__body">
          <div className="pulse-stk__row">
            <div className="pulse-stk__card" style={{ background: bg, color: fg, "--stk-div": div }}>
              <div className="pulse-stk__en">{COPY.en}</div>
              <div className="pulse-stk__zh">{COPY.zh}</div>
              <div className="pulse-stk__sub">{COPY.sub}</div>
              {p.showLead && <div className="pulse-stk__lead">{COPY.lead}</div>}
              <div className="pulse-stk__ledger">
                {ledger.map((m, i) => (
                  <div className="pulse-stk__l" key={i}>
                    <span className="pulse-stk__l-k">{m[0]}</span>
                    <span className="pulse-stk__l-v">{m[1]}{m[2] ? <small>{m[2]}</small> : null}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pulse-stk__arch">
              <div className="pulse-stk__arch-cap">
                <span className="pulse-label">{COPY.stackCap}</span>
                <span className="pulse-mono">{COPY.stackUnit}</span>
              </div>
              <div className="pulse-stk__tiers">
                {tiers.map((tr, i) => {
                  const isFocus = i === focusTier;
                  return (
                    <div className={"pulse-stk__tier" + (isFocus ? " pulse-stk__tier--focus" : "")} key={i}
                      style={isFocus ? { background: accent, borderColor: accent, color: "#fff" } : null}>
                      <span className="pulse-stk__tier-no">L{nTier - i}</span>
                      <span className="pulse-stk__tier-id">
                        <span className="pulse-stk__tier-zh">{tr.zh}</span>
                        <span className="pulse-stk__tier-en">{tr.en}</span>
                      </span>
                      {p.showItems && (
                        <span className="pulse-stk__tier-items">
                          {tr.items.map((it, k) => (
                            <span className="pulse-stk__chip"
                              style={isFocus ? { borderColor: "rgba(255,255,255,0.55)" } : null} key={k}>{it}</span>
                          ))}
                        </span>
                      )}
                      {isFocus && <span className="pulse-stk__tier-flag">AI 延展</span>}
                    </div>
                  );
                })}
              </div>
              {p.showExpand && (
                <div className="pulse-stk__expand">
                  <span className="pulse-stk__expand-v" style={{ color: accent }}>132<small>%</small></span>
                  <span className="pulse-stk__expand-body">
                    <span className="pulse-stk__expand-k">{COPY.expandK}</span>
                    <span className="pulse-stk__expand-note">{COPY.expandNote}</span>
                  </span>
                  <span className="pulse-stk__expand-arrow" style={{ color: accent }}>↑</span>
                </div>
              )}
            </div>
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-stk__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseStack.controls = controls;
  PulseStack.defaults = defaults;

  if (typeof window !== "undefined") PulseStack.copyDefaults = COPY;
  PulseStack.defaults = { ...(PulseStack.defaults || {}), copy: COPY };
  window.PulseStack = PulseStack;
})();

const Component = window.PulseStack;
if (!Component) throw new Error('Missing theme05 component PulseStack');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;