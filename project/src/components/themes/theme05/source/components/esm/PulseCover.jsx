/* =========================================================================
   PulseCover — P01 cover slide ("RC-9 cover" archetype).
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseCover.controls for the full, typed parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text is intentionally NOT prop-driven, per spec).
const COPY = {
  brand: "AICL",
  meta: ["UNITED STATES · AI", "2024 FY", "DEALS ≥ $100M"],
  eyebrow: "美国 AI 大额融资 · RESEARCH",
  display: "2024",
  titleLines: ["美国大额融资", "AI 公司调研报告"],
  sub: "数据口径：2024 全年 · 单笔 ≥ 1 亿美元",
  tagline: "从资本流向，看 AI 产业下一阶段的真实重心。",
  panelHead: "SPECIFICATION",
  specs: [
    { k: "数据口径", v: "≥ $100M" },
    { k: "大额事件", v: "97 笔" },
    { k: "研究主题", v: "美国 AI" },
    { k: "报告日期", v: "2026.06" },
    { k: "报告篇幅", v: "14 页" },
  ],
};

function Band() {
  const weights = [1.5, 1, 1, 1, 1, 1.5, 1];
  return (
    <div className="pulse-band" aria-hidden="true">
      {SPECTRUM.map((c, i) => (
        <i key={i} style={{ background: c, flexGrow: weights[i] }} />
      ))}
    </div>
  );
}

function PulseCover(props) {
  const p = Object.assign({}, PulseCover.defaults, props);
  const accent = p.accentColor;
  const dark = p.sidePanelTheme === "dark";
  const specs = COPY.specs.slice(0, Math.max(1, p.metaCount));

  return (
    <div className="pulse-slide pulse-cover" style={{ "--pulse-accent": accent }}>
      <header className="pulse-bar pulse-bar--dark">
        <div className="pulse-wordmark">{COPY.brand}<sup>®</sup></div>
        <div className="pulse-bar__meta">
          {COPY.meta.map((m, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">/</span>}
              <span>{m}</span>
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="pulse-cover__main">
        <div className="pulse-cover__left">
          <div className="pulse-eyebrow pulse-cover__eyebrow" style={{ color: accent }}>
            {COPY.eyebrow}
          </div>
          <div className="pulse-cover__display">{COPY.display}</div>
          <h1 className="pulse-cover__title">
            {COPY.titleLines[0]}<br />{COPY.titleLines[1]}
          </h1>
          <div className="pulse-cover__sub">{COPY.sub}</div>
          {p.showTagline && (
            <div className="pulse-cover__tagline">{COPY.tagline}</div>
          )}
        </div>

        {p.showSidePanel && (
          <aside className={"pulse-cover__panel " + (dark ? "pulse-cover__panel--dark" : "pulse-cover__panel--light")}>
            <div className="pulse-cover__panel-head">{COPY.panelHead}</div>
            <div className="pulse-cover__spec">
              {specs.map((s, i) => (
                <div className="pulse-cover__spec-row" key={i}>
                  <div className="pulse-cover__spec-k">{s.k}</div>
                  <div className="pulse-cover__spec-v">{s.v}</div>
                </div>
              ))}
            </div>
            {p.showSwatches && (
              <div className="pulse-cover__swatches">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            )}
          </aside>
        )}
      </div>

      {p.showColorBand && <Band />}
    </div>
  );
}

// ---- Typed, documented parameter schema (drives Tweaks + handoff docs) ----
PulseCover.controls = [
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标与装饰条的强调色，取自色谱。" },
  { key: "showSidePanel", type: "toggle", label: "侧栏参数面板", default: true,
    description: "显示右侧规格参数面板。" },
  { key: "sidePanelTheme", type: "radio", label: "侧栏主题", default: "dark", options: ["dark", "light"],
    description: "侧栏深色 / 浅色两种配色。" },
  { key: "metaCount", type: "slider", label: "参数行数", default: 4, min: 1, max: 5, step: 1,
    description: "侧栏展示的规格行数量。" },
  { key: "showSwatches", type: "toggle", label: "色谱色卡", default: true,
    description: "侧栏底部的七色色谱色卡。" },
  { key: "showColorBand", type: "toggle", label: "底部色谱条", default: true,
    description: "页面底部贯穿的色谱条带。" },
  { key: "showTagline", type: "toggle", label: "装饰标语", default: true,
    description: "左下角的一句装饰性结语。" },
];
PulseCover.defaults = PulseCover.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseCover;
export const controls = PulseCover.controls || [];
export const defaults = PulseCover.defaults || {};
