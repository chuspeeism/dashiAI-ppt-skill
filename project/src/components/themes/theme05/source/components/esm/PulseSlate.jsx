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
   PulseSlate — P77 content page ("确定性预算 / Strategy Board" archetype).
   A generic content_page whose DISTINGUISHING element is a RECOMMENDATION
   BOARD: a grid of N colored direction cards (recommended sectors) paired with
   a themed SCREENING panel — a checklist of selection criteria (label + gloss,
   no fabricated numbers). One card is emphasizable; the rest dim, so the slide
   reads as "here is what we recommend, and here is how we screen". The reusable
   template for any "recommended directions + selection criteria" strategy page.

   Self-contained & migratable: depends only on React + the shared .pulse-slt /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseSlate.controls for the typed parameter list.

   To migrate into a bundler: delete the `window.PulseSlate = …` line and
   `export default PulseSlate; export { controls, defaults };` instead.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  // Static copy + data (text/data intentionally NOT prop-driven, per spec).
  const COPY = {
    eyebrow: "INFRASTRUCTURE STRATEGY · 策略：优先基础设施",
    title: "确定性预算",
    sheet: "STRATEGY · 77 / 80",
    lead: "基础设施公司更接近刚性预算，收入确定性相对更强。",
    boardCap: "推荐方向",
    boardUnit: "RECOMMENDED",
    cards: [
      { en: "CLOUD", k: "GPU 云",   tag: "算力供给 · 刚性预算", color: SPECTRUM[0] },
      { en: "DATA",  k: "数据平台", tag: "数据治理 · 长期锁定", color: SPECTRUM[5] },
      { en: "EVAL",  k: "评测工具", tag: "合规评测 · 采购门槛", color: SPECTRUM[3] },
      { en: "INFER", k: "推理优化", tag: "降本增效 · 全行业需求", color: SPECTRUM[1] },
    ],
    criteriaCap: "筛选指标",
    criteriaUnit: "SCREEN BY",
    criteria: [
      { k: "收入增速", en: "GROWTH" },
      { k: "毛利率", en: "MARGIN" },
      { k: "客户集中度", en: "CONCENTRATION" },
      { k: "资源锁定", en: "LOCK-IN" },
    ],
    criteriaNote: "模型胜负未定时，卖铲子仍是更稳的资本逻辑。",
    conclusion: "优先看能支撑全行业增长的基础设施。",
  };

  const controls = [
    { key: "cardCount", type: "slider", label: "方向卡数量", default: 4, min: 2, max: 4, step: 1,
      description: "推荐方向卡的数量。" },
    { key: "columns", type: "slider", label: "网格列数", default: 2, min: 2, max: 4, step: 1,
      description: "方向卡网格的列数。" },
    { key: "focusEnabled", type: "toggle", label: "重点方向", default: true,
      description: "是否突出某一张方向卡（其余淡出）。" },
    { key: "focusIndex", type: "slider", label: "重点方向序号", default: 1, min: 1, max: 4, step: 1,
      description: "被突出的方向卡序号（从 1 起）。" },
    { key: "showCardCode", type: "toggle", label: "卡片代号", default: true,
      description: "方向卡上的英文代号。" },
    { key: "showCardTag", type: "toggle", label: "卡片说明", default: true,
      description: "方向卡底部的一行说明标签。" },
    { key: "showCriteria", type: "toggle", label: "筛选面板", default: true,
      description: "右侧的筛选指标面板（关闭则方向卡铺满整幅）。" },
    { key: "criteriaCount", type: "slider", label: "筛选项数量", default: 4, min: 2, max: 4, step: 1,
      description: "筛选指标清单的条目数量。" },
    { key: "panelTheme", type: "radio", label: "面板主题", default: "dark",
      options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
      description: "筛选面板背景：深色 / 强调色块 / 纸色。" },
    { key: "showLead", type: "toggle", label: "引导说明", default: true,
      description: "标题下方的一句引导说明。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
      description: "眉标 / 重点方向 /「色块」主题面板 / 筛选标记的颜色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  function PulseSlate(props) {
    const p = Object.assign({}, defaults, props);
    const accent = p.accentColor;

    const n = Math.max(2, Math.min(COPY.cards.length, p.cardCount));
    const cards = COPY.cards.slice(0, n);
    const cols = Math.max(2, Math.min(4, p.columns));
    const focus = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : -1;

    const nCrit = Math.max(2, Math.min(COPY.criteria.length, p.criteriaCount));
    const crit = COPY.criteria.slice(0, nCrit);
    const hasPanel = p.showCriteria;

    let bg, fg, div, mute;
    if (p.panelTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; mute = "rgba(255,255,255,0.72)"; }
    else if (p.panelTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; mute = "var(--pulse-mute)"; }
    else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; mute = "var(--pulse-on-dark-mute)"; }

    return (
      <div className="pulse-slide pulse-slt" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
            {p.showLead && <div className="pulse-pagehead__sub pulse-slt__lead">{COPY.lead}</div>}
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-slt__body">
          <div className={"pulse-slt__row" + (hasPanel ? "" : " pulse-slt__row--solo")}>
            <div className="pulse-slt__board">
              <div className="pulse-slt__board-cap">
                <span className="pulse-label">{COPY.boardCap}</span>
                <span className="pulse-mono">{COPY.boardUnit}</span>
              </div>
              <div className="pulse-slt__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {cards.map((c, i) => {
                  const dim = focus >= 0 && i !== focus;
                  const isFocus = i === focus;
                  return (
                    <div className={"pulse-slt__card" + (isFocus ? " pulse-slt__card--focus" : "") + (dim ? " pulse-slt__card--dim" : "")}
                      key={i} style={{ background: c.color }}>
                      {p.showCardCode && <span className="pulse-slt__card-code">{c.en}</span>}
                      <span className="pulse-slt__card-idx">{String(i + 1).padStart(2, "0")}</span>
                      <div className="pulse-slt__card-foot">
                        <span className="pulse-slt__card-k">{c.k}</span>
                        {p.showCardTag && <span className="pulse-slt__card-tag">{c.tag}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {hasPanel && (
              <div className="pulse-slt__panel" style={{ background: bg, color: fg, "--slt-div": div, "--slt-mute": mute }}>
                <div className="pulse-slt__panel-cap">
                  <span>{COPY.criteriaCap}</span>
                  <span className="pulse-slt__panel-unit">{COPY.criteriaUnit}</span>
                </div>
                <div className="pulse-slt__crit">
                  {crit.map((c, i) => (
                    <div className="pulse-slt__crit-row" key={i}>
                      <span className="pulse-slt__crit-mark" style={{ background: accent }} />
                      <span className="pulse-slt__crit-k">{c.k}</span>
                      <span className="pulse-slt__crit-en">{c.en}</span>
                    </div>
                  ))}
                </div>
                <div className="pulse-slt__panel-note">{COPY.criteriaNote}</div>
              </div>
            )}
          </div>

          {p.showConclusion && <div className="pulse-conclusion pulse-slt__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseSlate.controls = controls;
  PulseSlate.defaults = defaults;

  if (typeof window !== "undefined") PulseSlate.copyDefaults = COPY;
  PulseSlate.defaults = { ...(PulseSlate.defaults || {}), copy: COPY };
  window.PulseSlate = PulseSlate;
})();

const Component = window.PulseSlate;
if (!Component) throw new Error('Missing theme05 component PulseSlate');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;