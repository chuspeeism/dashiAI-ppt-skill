/* =========================================================================
   PulseEndcap — P82 back-cover slide ("封底 / Back Cover" archetype).
   Book-ends the front cover (PulseCover): a full-bleed closing frame with a
   large display word, the report-title recap, a closing tagline, a COLOPHON
   meta panel and the spectrum band. dark / paper / color themes; left or
   centred composition. The reusable back-cover template — a real deck ending
   that mirrors the cover's system. Self-contained & migratable.

   Depends only on React + the shared .pulse-end / .pulse-* CSS. Text/data live
   in COPY (not prop-driven); everything else by props. See controls below.
   `export default PulseEndcap; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text intentionally NOT prop-driven, per spec — edit here).
const COPY = {
  brand: "AICL",
  meta: ["UNITED STATES · AI", "2024 FY", "DEALS ≥ $100M"],
  eyebrow: "THANK YOU · 感谢阅读",
  display: "感谢阅读",
  titleRecap: "美国大额融资 AI 公司调研报告",
  closing: "从资本流向，看 AI 产业下一阶段的真实重心。",
  panelHead: "COLOPHON",
  specs: [
    { k: "研究主题", v: "美国 AI" },
    { k: "数据口径", v: "≥ $100M" },
    { k: "大额事件", v: "97 笔" },
    { k: "报告日期", v: "2026.06" },
  ],
  sheet: "BACK COVER",
};

const controls = [
  { key: "theme", type: "radio", label: "背景主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "paper", label: "纸色" }, { value: "color", label: "色块" }],
    description: "页面背景：深色 / 纸色 / 整页强调色块。" },
  { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[5], options: SPECTRUM,
    description: "「色块」主题下的整页背景色（其它主题忽略）。" },
  { key: "layout", type: "radio", label: "构图方式", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "大字与信息的整体构图：左对齐（带侧栏面板）/ 居中。" },
  { key: "showMetaBar", type: "toggle", label: "顶部品牌条", default: true,
    description: "顶部的品牌标识与元信息条。" },
  { key: "showPanel", type: "toggle", label: "版本信息面板", default: true,
    description: "右侧 COLOPHON 版本信息面板（居中构图时转为底部信息行）。" },
  { key: "specRowCount", type: "slider", label: "信息行数", default: 4, min: 1, max: 4, step: 1,
    description: "版本信息面板的行数。" },
  { key: "showClosing", type: "toggle", label: "结语标语", default: true,
    description: "大字下方的一句结语标语。" },
  { key: "showSwatches", type: "toggle", label: "色谱色卡", default: true,
    description: "面板内的七色色谱色卡。" },
  { key: "showColorBand", type: "toggle", label: "底部色谱条", default: true,
    description: "页面底部贯穿的色谱条带。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 大字强调的颜色。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: false,
    description: "右上角的封底标签（封底默认隐藏）。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseEndcap(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const isColor = p.theme === "color";
  const center = p.layout === "center";
  const cls =
    "pulse-slide pulse-end" +
    (p.theme === "dark" ? " pulse-end--dark" : "") +
    (isColor ? " pulse-end--color" : "") +
    (center ? " pulse-end--center" : "");

  const style = { "--pulse-accent": accent };
  if (isColor) style.background = p.bgColor;
  const specs = COPY.specs.slice(0, Math.max(1, Math.min(COPY.specs.length, p.specRowCount)));

  const Panel = (
    <aside className="pulse-end__panel">
      <div className="pulse-end__panel-head">{COPY.panelHead}</div>
      <div className="pulse-end__spec">
        {specs.map((s, i) => (
          <div className="pulse-end__spec-row" key={i}>
            <span className="pulse-end__spec-k">{s.k}</span>
            <span className="pulse-end__spec-v">{s.v}</span>
          </div>
        ))}
      </div>
      {p.showSwatches && (
        <div className="pulse-end__swatches">
          {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
        </div>
      )}
    </aside>
  );

  return (
    <div className={cls} style={style}>
      {p.showMetaBar && (
        <header className="pulse-end__bar">
          <div className="pulse-end__wordmark">{COPY.brand}<sup>®</sup></div>
          <div className="pulse-end__bar-meta">
            {COPY.meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">/</span>}
                <span>{m}</span>
              </React.Fragment>
            ))}
          </div>
          {p.showSheetLabel && <div className="pulse-end__sheet">{COPY.sheet}</div>}
        </header>
      )}

      <div className="pulse-end__main">
        <div className="pulse-end__left">
          <div className="pulse-eyebrow pulse-end__eyebrow" style={{ color: accent }}>{COPY.eyebrow}</div>
          <div className="pulse-end__display">{COPY.display}</div>
          <div className="pulse-end__recap">{COPY.titleRecap}</div>
          {p.showClosing && <div className="pulse-end__closing">{COPY.closing}</div>}
          {center && p.showPanel && (
            <div className="pulse-end__metarow">
              {specs.map((s, i) => (
                <div className="pulse-end__metarow-item" key={i}>
                  <span className="pulse-end__metarow-k">{s.k}</span>
                  <span className="pulse-end__metarow-v">{s.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {!center && p.showPanel && Panel}
      </div>

      {p.showColorBand && (
        <div className="pulse-end__band" aria-hidden="true">
          {SPECTRUM.map((c, i) => <i key={i} style={{ background: c, flexGrow: [1.5,1,1,1,1,1.5,1][i] }} />)}
        </div>
      )}
    </div>
  );
}

PulseEndcap.controls = controls;
PulseEndcap.defaults = defaults;
export default PulseEndcap;
export { controls };
export { defaults };
