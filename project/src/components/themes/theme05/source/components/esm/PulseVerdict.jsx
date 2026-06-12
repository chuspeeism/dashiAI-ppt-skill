/* =========================================================================
   PulseVerdict — P80 quote page ("最终判断 / Final Verdict" archetype).
   The deck's CLOSING punctuation: one oversized editorial verdict centred in a
   framed field, a "FINAL VERDICT" tag, an optional supporting line, an optional
   closing "完 / END" device, and a footer that book-ends the cover (wordmark +
   report reference). Distinct from the mid-deck statement page (PulseStatement)
   by its framed, back-matter framing and closing marker. Low density by design.

   Self-contained & migratable: depends only on React + the shared .pulse-vrd /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseVerdict.controls for the typed parameter list.
   `export default PulseVerdict; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text intentionally NOT prop-driven, per spec — edit here).
const COPY = {
  kicker: "CLOSING · 收尾页",
  sheet: "VERDICT · 80 / 80",
  tag: "最终判断",
  tagEn: "FINAL VERDICT",
  // verdict rendered as JSX so key phrases can be emphasised
  quote: (
    <React.Fragment>
      融资盛宴之后，<br />
      <span className="hl">真正的竞争</span>才刚开始。
    </React.Fragment>
  ),
  quotePlain: (
    <React.Fragment>
      融资盛宴之后，<br />真正的竞争才刚开始。
    </React.Fragment>
  ),
  sub: "下一阶段比拼的不再是融资规模，而是把叙事兑现为收入的能力。",
  marker: "完",
  markerEn: "END",
  brand: "AICL",
  ref: "美国大额融资 AI 公司调研报告 · 2024",
};

const controls = [
  { key: "theme", type: "radio", label: "背景主题", default: "dark",
    options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }, { value: "color", label: "色块" }],
    description: "页面背景：纸色 / 深色 / 整页强调色块。" },
  { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[0], options: SPECTRUM,
    description: "「色块」主题下的整页背景色（其它主题忽略）。" },
  { key: "align", type: "radio", label: "对齐方式", default: "center",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "金句与辅助信息的对齐方式。" },
  { key: "emphasis", type: "toggle", label: "重点词高亮", default: true,
    description: "是否用强调色高亮金句中的关键词。" },
  { key: "showTag", type: "toggle", label: "判断标签", default: true,
    description: "金句上方的「最终判断」标签。" },
  { key: "showSub", type: "toggle", label: "辅助说明", default: true,
    description: "金句下方的一行辅助说明文字。" },
  { key: "showMarker", type: "toggle", label: "收尾标记", default: true,
    description: "右下角的「完 / END」收尾装饰标记。" },
  { key: "showFooter", type: "toggle", label: "页脚署名", default: true,
    description: "底部品牌标识与报告署名（与封面呼应）。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "页脚处的小色谱条带。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "标签 / 重点词 / 收尾标记的强调色。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseVerdict(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const isColor = p.theme === "color";
  const center = p.align === "center";
  const cls =
    "pulse-slide pulse-vrd" +
    (p.theme === "dark" ? " pulse-vrd--dark" : "") +
    (isColor ? " pulse-vrd--color" : "") +
    (center ? " pulse-vrd--center" : "");

  const style = { "--pulse-accent": accent };
  if (isColor) style.background = p.bgColor;

  return (
    <div className={cls} style={style}>
      <div className="pulse-vrd__top">
        <div className="pulse-vrd__kicker">{COPY.kicker}</div>
        {p.showSheetLabel && <div className="pulse-vrd__sheet">{COPY.sheet}</div>}
      </div>

      <div className="pulse-vrd__field">
        <div className="pulse-vrd__main">
          {p.showTag && (
            <div className="pulse-vrd__tag">
              <span className="pulse-vrd__tag-zh" style={{ background: isColor ? "#fff" : accent, color: isColor ? "var(--pulse-ink)" : "#fff" }}>{COPY.tag}</span>
              <span className="pulse-vrd__tag-en">{COPY.tagEn}</span>
            </div>
          )}
          <div className="pulse-vrd__quote">{p.emphasis ? COPY.quote : COPY.quotePlain}</div>
          {p.showSub && <div className="pulse-vrd__sub">{COPY.sub}</div>}
        </div>

        {p.showMarker && (
          <div className="pulse-vrd__marker" aria-hidden="true">
            <span className="pulse-vrd__marker-zh">{COPY.marker}</span>
            <span className="pulse-vrd__marker-en">{COPY.markerEn}</span>
          </div>
        )}
      </div>

      {(p.showFooter || p.showColorBand) && (
        <div className="pulse-vrd__foot">
          {p.showFooter ? (
            <div className="pulse-vrd__sign">
              <span className="pulse-vrd__brand">{COPY.brand}<sup>®</sup></span>
              <span className="pulse-vrd__ref">{COPY.ref}</span>
            </div>
          ) : <span />}
          {p.showColorBand && (
            <div className="pulse-vrd__band" aria-hidden="true">
              {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

PulseVerdict.controls = controls;
PulseVerdict.defaults = defaults;
export default PulseVerdict;
export { controls };
export { defaults };
