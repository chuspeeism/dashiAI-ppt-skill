/* =========================================================================
   PulseColophon — P81 appendix page ("数据来源与研究方法 / Sources" archetype).
   Back-matter reference page. A themed SCOPE panel (label/value spec rows) sits
   beside a numbered SOURCE ledger (N entries, 1–2 columns), with a method-note
   chip band beneath. The distinguishing element is the numbered source ledger +
   scope table — the reusable back-matter template for any "data sources /
   methodology / appendix" page. No inputs or buttons — print-style reference.

   Self-contained & migratable: depends only on React + the shared .pulse-cph /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseColophon.controls for the typed parameter list.
   `export default PulseColophon; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "APPENDIX · 数据来源与研究方法",
  title: "数据来源与研究方法",
  sheet: "APPENDIX · A1",
  lead: "本报告基于公开融资数据与行业访谈交叉验证，统一口径后汇总。",
  scopeCap: "研究口径",
  scopeUnit: "SCOPE",
  scope: [
    { k: "数据口径", v: "≥ $100M" },
    { k: "时间范围", v: "2024 FY" },
    { k: "样本规模", v: "97 笔" },
    { k: "覆盖地区", v: "美国" },
    { k: "货币单位", v: "美元" },
  ],
  sourceCap: "数据来源",
  sourceUnit: "SOURCES",
  sources: [
    { name: "公开融资数据库", en: "FUNDING DB", d: "一级市场融资事件、金额与轮次记录。" },
    { name: "公司公告与新闻稿", en: "FILINGS", d: "官方融资公告、估值与投资人披露。" },
    { name: "行业访谈", en: "INTERVIEWS", d: "投资人与从业者的定性交叉验证。" },
    { name: "第三方研究报告", en: "RESEARCH", d: "赛道规模与趋势的外部参照。" },
  ],
  methodCap: "方法说明",
  methods: ["口径统一", "事件去重", "区间分层", "汇率折算"],
  conclusion: "口径与方法决定结论的可比性。",
};

const controls = [
  { key: "sourceCount", type: "slider", label: "来源条目数", default: 4, min: 2, max: 4, step: 1,
    description: "数据来源台账的条目数量。" },
  { key: "columns", type: "slider", label: "来源列数", default: 2, min: 1, max: 2, step: 1,
    description: "数据来源台账的排布列数。" },
  { key: "showScopePanel", type: "toggle", label: "口径面板", default: true,
    description: "左侧的研究口径面板（关闭则来源台账铺满整幅）。" },
  { key: "specRowCount", type: "slider", label: "口径行数", default: 5, min: 2, max: 5, step: 1,
    description: "研究口径面板的行数。" },
  { key: "panelTheme", type: "radio", label: "面板主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
    description: "口径面板背景：深色 / 强调色块 / 纸色。" },
  { key: "focusEnabled", type: "toggle", label: "重点来源", default: false,
    description: "是否突出某一条数据来源。" },
  { key: "focusIndex", type: "slider", label: "重点来源序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的来源序号（从 1 起）。" },
  { key: "showMethodChips", type: "toggle", label: "方法标签带", default: true,
    description: "底部的方法说明标签带。" },
  { key: "methodCount", type: "slider", label: "方法标签数", default: 4, min: 2, max: 4, step: 1,
    description: "方法说明标签的数量。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[4], options: SPECTRUM,
    description: "眉标 / 来源序号 /「色块」主题面板 / 重点项的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseColophon(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.sources.length, p.sourceCount));
  const sources = COPY.sources.slice(0, n);
  const focusIdx = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : -1;
  const cols = Math.max(1, Math.min(2, p.columns));
  const scope = COPY.scope.slice(0, Math.max(2, Math.min(COPY.scope.length, p.specRowCount)));
  const methods = COPY.methods.slice(0, Math.max(2, Math.min(COPY.methods.length, p.methodCount)));
  const hasPanel = p.showScopePanel;

  let bg, fg, div, mute;
  if (p.panelTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.28)"; mute = "rgba(255,255,255,0.74)"; }
  else if (p.panelTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; mute = "var(--pulse-mute)"; }
  else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; mute = "var(--pulse-on-dark-mute)"; }

  return (
    <div className="pulse-slide pulse-cph" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          {p.showLead && <div className="pulse-pagehead__sub pulse-cph__lead">{COPY.lead}</div>}
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-cph__body">
        <div className={"pulse-cph__row" + (hasPanel ? "" : " pulse-cph__row--solo")}>
          {hasPanel && (
            <div className="pulse-cph__scope" style={{ background: bg, color: fg, "--cph-div": div, "--cph-mute": mute }}>
              <div className="pulse-cph__scope-cap">
                <span>{COPY.scopeCap}</span>
                <span className="pulse-cph__scope-unit">{COPY.scopeUnit}</span>
              </div>
              <div className="pulse-cph__scope-rows">
                {scope.map((s, i) => (
                  <div className="pulse-cph__scope-row" key={i}>
                    <span className="pulse-cph__scope-k">{s.k}</span>
                    <span className="pulse-cph__scope-v">{s.v}</span>
                  </div>
                ))}
              </div>
              <div className="pulse-cph__scope-mark">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            </div>
          )}

          <div className="pulse-cph__sources">
            <div className="pulse-cph__sources-cap">
              <span className="pulse-label">{COPY.sourceCap}</span>
              <span className="pulse-mono">{COPY.sourceUnit}</span>
            </div>
            <div className="pulse-cph__ledger" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {sources.map((s, i) => {
                const isFocus = i === focusIdx;
                return (
                  <div className={"pulse-cph__src" + (isFocus ? " pulse-cph__src--focus" : "")} key={i}>
                    <div className="pulse-cph__src-n" style={isFocus ? { color: accent } : null}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="pulse-cph__src-body">
                      <div className="pulse-cph__src-name">{s.name}</div>
                      <div className="pulse-cph__src-en">{s.en}</div>
                      <div className="pulse-cph__src-d">{s.d}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {p.showMethodChips && (
          <div className="pulse-cph__methods">
            <span className="pulse-cph__methods-cap">{COPY.methodCap}</span>
            <div className="pulse-cph__chips">
              {methods.map((m, i) => <span className="pulse-cph__chip" key={i}>{m}</span>)}
            </div>
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-cph__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseColophon.controls = controls;
PulseColophon.defaults = defaults;
export default PulseColophon;
export { controls };
export { defaults };
