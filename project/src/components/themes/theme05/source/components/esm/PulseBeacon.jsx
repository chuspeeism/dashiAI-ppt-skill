/* =========================================================================
   PulseBeacon — P79 timeline page ("估值锚重定价 / Re-anchoring" archetype).
   A bold horizontal MILESTONE timeline whose distinguishing element is a
   measured "window" axis: N evenly-spaced phase nodes sit on a thick axis, and
   an accent OVERLAY fills the axis from the start up to the focus node — reading
   as "how far into the observation window we are". A watchlist chip strip names
   the entities being tracked; a themed indicator panel lists the dimensions to
   watch (label + gloss, no fabricated numbers). The reusable `timeline_page`
   template for any "watch this window → these signals re-price the anchor" page.

   Self-contained & migratable: depends only on React + the shared .pulse-bcn /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseBeacon.controls for the typed parameter list.
   `export default PulseBeacon; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "IPO WATCH · 策略：观察 IPO 窗口",
  title: "估值锚重定价",
  sheet: "TIMELINE · 79 / 80",
  lead: "头部公司 IPO 表现会影响整个 AI 一级市场估值锚。",
  watchCap: "观察对象",
  watchUnit: "WATCHLIST",
  watch: ["OpenAI", "Anthropic", "Databricks", "CoreWeave"],
  timeCap: "IPO 观察窗口",
  timeUnit: "IPO WINDOW",
  nodes: [
    { i: "PHASE 01", t: "窗口开启", d: "头部公司启动上市筹备，开始路演与定价。" },
    { i: "PHASE 02", t: "首日表现", d: "挂牌首日股价表现给出第一个公开锚点。" },
    { i: "PHASE 03", t: "季度兑现", d: "上市后季报检验收入增速与毛利率。" },
    { i: "PHASE 04", t: "估值回传", d: "公开市场定价回传一级市场预期。" },
  ],
  indCap: "观察指标",
  indUnit: "INDICATORS",
  indicators: [
    { k: "上市表现", en: "IPO PERF" },
    { k: "收入增速", en: "REV GROWTH" },
    { k: "毛利率", en: "GROSS MARGIN" },
    { k: "云成本占比", en: "CLOUD COST" },
  ],
  note: "如果头部公司上市后估值承压，一级市场会同步下修预期。",
  conclusion: "公开市场会重新定价 AI 叙事。",
};

const controls = [
  { key: "nodeCount", type: "slider", label: "阶段节点数", default: 4, min: 2, max: 4, step: 1,
    description: "时间轴的阶段（节点）数量。" },
  { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
    description: "是否突出某一个时间轴节点。" },
  { key: "focusIndex", type: "slider", label: "重点节点序号", default: 2, min: 1, max: 4, step: 1,
    description: "被突出的节点序号（同时决定窗口进度的终点，从 1 起）。" },
  { key: "showWindowFill", type: "toggle", label: "窗口进度", default: true,
    description: "轴线上从起点到重点节点的强调色进度叠层（已进入的观察窗口）。" },
  { key: "showWatchlist", type: "toggle", label: "观察对象带", default: true,
    description: "顶部的观察对象标签带（关闭则隐藏整条）。" },
  { key: "watchCount", type: "slider", label: "观察对象数", default: 4, min: 2, max: 4, step: 1,
    description: "观察对象标签的数量。" },
  { key: "showIndicators", type: "toggle", label: "指标面板", default: true,
    description: "底部的观察指标面板（关闭则时间轴铺满整幅）。" },
  { key: "indicatorCount", type: "slider", label: "指标项数量", default: 4, min: 2, max: 4, step: 1,
    description: "观察指标的条目数量。" },
  { key: "panelTheme", type: "radio", label: "面板主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
    description: "指标面板背景：深色 / 强调色块 / 纸色。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标 / 重点节点 / 窗口进度 /「色块」主题面板的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseBeacon(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.nodes.length, p.nodeCount));
  const nodes = COPY.nodes.slice(0, n);
  const focusIdx = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : -1;
  // window fill ends at the focus marker centre. Markers sit at the LEFT of
  // each equal-width flex cell → marker i centre = (i / n) * 100% + 28px.
  const fillTo = p.focusEnabled ? focusIdx : n - 1;
  const fillPct = (fillTo / n) * 100;

  const watch = COPY.watch.slice(0, Math.max(2, Math.min(COPY.watch.length, p.watchCount)));
  const nInd = Math.max(2, Math.min(COPY.indicators.length, p.indicatorCount));
  const indicators = COPY.indicators.slice(0, nInd);
  const hasPanel = p.showIndicators;

  let bg, fg, div, mute;
  if (p.panelTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.28)"; mute = "rgba(255,255,255,0.74)"; }
  else if (p.panelTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; mute = "var(--pulse-mute)"; }
  else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; mute = "var(--pulse-on-dark-mute)"; }

  return (
    <div className="pulse-slide pulse-bcn" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          {p.showLead && <div className="pulse-pagehead__sub pulse-bcn__lead">{COPY.lead}</div>}
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-bcn__body">
        {p.showWatchlist && (
          <div className="pulse-bcn__watch">
            <span className="pulse-bcn__watch-cap">
              {COPY.watchCap}<em>{COPY.watchUnit}</em>
            </span>
            <div className="pulse-bcn__chips">
              {watch.map((w, i) => (
                <span className="pulse-bcn__chip" key={i}>
                  <i style={{ background: SPECTRUM[i % SPECTRUM.length] }} />{w}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pulse-bcn__time">
          <div className="pulse-bcn__time-cap">
            <span className="pulse-label">{COPY.timeCap}</span>
            <span className="pulse-mono">{COPY.timeUnit}</span>
          </div>
          <div className="pulse-bcn__track">
            <div className="pulse-bcn__axis" />
            {p.showWindowFill && (
              <div className="pulse-bcn__axis-fill" style={{ width: `calc(${fillPct}% + 28px)`, background: accent }} />
            )}
            {nodes.map((nd, i) => {
              const isFocus = i === focusIdx;
              return (
                <div className={"pulse-bcn__node" + (isFocus ? " pulse-bcn__node--focus" : "")} key={i}>
                  <div className="pulse-bcn__marker" style={isFocus ? { background: accent, color: "#fff", borderColor: accent } : null}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="pulse-bcn__card">
                    <div className="pulse-bcn__node-i">{nd.i}</div>
                    <div className="pulse-bcn__node-t">{nd.t}</div>
                    <div className="pulse-bcn__node-d">{nd.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {hasPanel && (
          <div className="pulse-bcn__ind" style={{ background: bg, color: fg, "--bcn-div": div, "--bcn-mute": mute }}>
            <div className="pulse-bcn__ind-head">
              <span>{COPY.indCap}</span>
              <span className="pulse-bcn__ind-unit">{COPY.indUnit}</span>
            </div>
            <div className="pulse-bcn__ind-grid">
              {indicators.map((m, i) => (
                <div className="pulse-bcn__ind-cell" key={i}>
                  <span className="pulse-bcn__ind-mark" style={{ background: accent }} />
                  <span className="pulse-bcn__ind-k">{m.k}</span>
                  <span className="pulse-bcn__ind-en">{m.en}</span>
                </div>
              ))}
            </div>
            <div className="pulse-bcn__ind-note">{COPY.note}</div>
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-bcn__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseBeacon.controls = controls;
PulseBeacon.defaults = defaults;
export default PulseBeacon;
export { controls };
export { defaults };
