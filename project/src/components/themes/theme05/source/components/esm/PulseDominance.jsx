/* =========================================================================
   PulseDominance — P56 big-number page ("最大地理中心 / Share-of-whole" archetype).
   A generic dominant-share headline page: one oversized percentage rendered AS a
   part-of-whole proportion — paired with a gauge (vertical fill OR a 10×10 dot
   grid) that fills exactly that share, plus caption, message and 0–n auxiliary
   metrics. The distinguishing element vs a plain big number (P24) or big-number+
   image (P46) is that the headline % is also drawn as its share of the whole.
   The reusable template for any single "X% of total / concentration" page.

   Self-contained & migratable: depends only on React + the shared .pulse-dom /
   .pulse-* CSS. Text/data live in COPY (not prop-driven, per spec); everything
   else is prop-driven. See PulseDominance.controls for the typed parameter list.
   `export default PulseDominance; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "BAY AREA CLUSTER",
  title: "最大地理中心",
  sheet: "BIG NUMBER · 56 / 80",
  number: "63.9",
  unit: "%",
  pct: 63.9,                      // numeric share, drives the gauge
  caption: "旧金山湾区融资额占比",
  message: "优势来自人才密度、资本网络、云厂商和模型实验室邻近。",
  shareLabel: "湾区",
  restLabel: "其余地区",
  aux: [
    ["其余地区合计", "36.1", "%"],
    ["枢纽城市", "旧金山", ""],
    ["集中度排名", "TOP 1", ""],
  ],
  conclusion: "湾区仍是 AI 资本重力中心。",
};

const controls = [
  { key: "showGauge", type: "toggle", label: "份额量规", default: true,
    description: "右侧把主数字渲染成「部分-整体」的占比量规。" },
  { key: "gaugeStyle", type: "radio", label: "量规样式", default: "bar",
    options: [{ value: "bar", label: "竖向占比" }, { value: "grid", label: "点阵" }],
    description: "占比量规呈现：竖向填充条 / 10×10 点阵。" },
  { key: "numberAlign", type: "radio", label: "数字对齐", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "主数字块的对齐方式（关闭量规时整幅居中更佳）。" },
  { key: "auxCount", type: "slider", label: "辅助指标数", default: 3, min: 0, max: 3, step: 1,
    description: "主数字下方的支撑指标数量（0 隐藏整行）。" },
  { key: "showUnit", type: "toggle", label: "数字单位", default: true,
    description: "主数字后的单位后缀。" },
  { key: "showCaption", type: "toggle", label: "数字说明", default: true,
    description: "主数字下方的解释说明。" },
  { key: "showMessage", type: "toggle", label: "支撑文案", default: true,
    description: "说明下方的一段支撑性文案。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "主数字 / 眉标 / 量规填充的强调色。" },
  { key: "showWordmark", type: "toggle", label: "品牌标识", default: true,
    description: "左下角的 PULSE 品牌标识。" },
  { key: "showColorBand", type: "toggle", label: "装饰色谱条", default: true,
    description: "右下角的装饰性 TR-808 色谱条。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseDominance(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const nAux = Math.max(0, Math.min(COPY.aux.length, p.auxCount));
  const aux = COPY.aux.slice(0, nAux);
  const pct = Math.max(0, Math.min(100, COPY.pct));
  const filled = Math.round(pct);   // dot-grid cells out of 100

  const statBlock = (
    <div className={"pulse-dom__stat" + (p.showGauge ? "" : " pulse-dom__stat--wide") +
      (p.numberAlign === "center" ? " pulse-dom__stat--center" : "")}>
      <div className="pulse-dom__num" style={{ color: accent }}>
        {COPY.number}{p.showUnit && <span className="pulse-dom__unit">{COPY.unit}</span>}
      </div>
      {p.showCaption && <div className="pulse-dom__caption">{COPY.caption}</div>}
      {p.showMessage && <div className="pulse-dom__message">{COPY.message}</div>}
      {nAux > 0 && (
        <div className="pulse-dom__aux">
          {aux.map((m, i) => (
            <div className="pulse-dom__aux-m" key={i}>
              <span className="pulse-dom__aux-v">{m[1]}{m[2] && <small>{m[2]}</small>}</span>
              <span className="pulse-dom__aux-k">{m[0]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const gauge = p.showGauge && (
    <div className="pulse-dom__gauge">
      {p.gaugeStyle === "grid" ? (
        <div className="pulse-dom__grid">
          {Array.from({ length: 100 }).map((_, i) => (
            <i key={i} className={"pulse-dom__cell" + (i < filled ? " pulse-dom__cell--on" : "")}
              style={i < filled ? { background: accent } : null} />
          ))}
        </div>
      ) : (
        <div className="pulse-dom__bar">
          <div className="pulse-dom__bar-rest">
            <span className="pulse-dom__bar-lab">{COPY.restLabel}</span>
            <span className="pulse-dom__bar-pct">{(100 - pct).toFixed(1)}%</span>
          </div>
          <div className="pulse-dom__bar-share" style={{ height: pct + "%", background: accent }}>
            <span className="pulse-dom__bar-lab">{COPY.shareLabel}</span>
            <span className="pulse-dom__bar-pct">{pct.toFixed(1)}%</span>
          </div>
        </div>
      )}
      <div className="pulse-dom__gauge-cap">
        <span className="pulse-label">占比构成</span>
        <span className="pulse-mono">SHARE OF TOTAL</span>
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-dom" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-dom__body">
        <div className="pulse-dom__row">
          {statBlock}
          {gauge}
        </div>

        <div className="pulse-dom__foot">
          {p.showWordmark
            ? <div className="pulse-wordmark pulse-dom__mark">PULSE<sup>R</sup></div>
            : <span />}
          {p.conclusion !== false && <div className="pulse-dom__concl">{COPY.conclusion}</div>}
          {p.showColorBand
            ? <div className="pulse-dom__band">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            : <span />}
        </div>
      </div>
    </div>
  );
}

PulseDominance.controls = controls;
PulseDominance.defaults = defaults;
export default PulseDominance;
export { controls };
export { defaults };
