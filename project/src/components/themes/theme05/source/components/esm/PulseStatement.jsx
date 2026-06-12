/* =========================================================================
   PulseStatement — P33 statement page ("金句 / Bold Statement" archetype).
   A generic single-statement slide for stage-ending punctuation: one oversized
   editorial line as the focal point, an optional ghost index numeral, a kicker
   + sub line, and an optional keyword strip. paper / dark / color themes.
   Low information density by design — for收束 / 观点强调.

   Self-contained & migratable: depends only on React + the .pulse-stmt / shared
   .pulse-* CSS. Controlled ENTIRELY by props (text lives in COPY, structure /
   style in props). See PulseStatement.controls for the typed parameter list.
   bottom and instead `export default PulseStatement` (controls / defaults are
   already attached as static props, and are also exported as named consts).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy (text intentionally NOT prop-driven, per spec — edit here).
const COPY = {
  kicker: "DEVELOPER TOOLS · 开发者工具赛道",
  index: "33",
  sheet: "STATEMENT · 33 / 80",
  // statement rendered as JSX so key phrases can be emphasised
  quote: (
    <React.Fragment>
      研发效率，是企业<br />
      <span className="hl">最直接</span>的 AI <span className="mute">预算入口</span>之一。
    </React.Fragment>
  ),
  sub: "效率工具最贴近开发团队的日常，预算决策链路短、落地周期快。",
  keywords: ["一句话判断", "信息密度 · 低", "阶段性收束"],
};

// ---- adjustable parameters (schema = documentation = control source) ----
const controls = [
  { key: "theme", type: "radio", label: "背景主题", default: "dark",
    options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }, { value: "color", label: "色块" }],
    description: "页面背景：纸色 / 深色 / 整页强调色块。" },
  { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[5], options: SPECTRUM,
    description: "「色块」主题下的整页背景色（其它主题忽略）。" },
  { key: "align", type: "radio", label: "对齐方式", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    description: "金句与辅助信息的对齐方式。" },
  { key: "showIndex", type: "toggle", label: "装饰大号数字", default: true,
    description: "背景中的超大半透明序号（装饰）。" },
  { key: "emphasis", type: "toggle", label: "重点词高亮", default: true,
    description: "是否用强调色高亮金句中的关键词。" },
  { key: "keywordCount", type: "slider", label: "关键词数量", default: 3, min: 0, max: 3, step: 1,
    description: "底部装饰关键词标签数量（0 隐藏整行）。" },
  { key: "showSub", type: "toggle", label: "辅助说明", default: true,
    description: "金句下方的一行辅助说明文字。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[2], options: SPECTRUM,
    description: "眉标 / 重点词 / 装饰数字的强调色。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "右下角的小色谱条带。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseStatement(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const isColor = p.theme === "color";
  const cls =
    "pulse-slide pulse-stmt" +
    (p.theme === "dark" ? " pulse-stmt--dark" : "") +
    (isColor ? " pulse-stmt--color" : "");
  const center = p.align === "center";
  const nKw = Math.max(0, Math.min(COPY.keywords.length, p.keywordCount));
  const keywords = COPY.keywords.slice(0, nKw);

  const style = { "--pulse-accent": accent };
  if (isColor) style.background = p.bgColor;

  // emphasis off → strip the highlight class so the line reads flat
  const quote = p.emphasis ? COPY.quote : (
    <React.Fragment>
      研发效率，是企业<br />最直接的 AI 预算入口之一。
    </React.Fragment>
  );

  return (
    <div className={cls} style={style}>
      <div className="pulse-stmt__top">
        <div className="pulse-stmt__kicker">{COPY.kicker}</div>
        {p.showSheetLabel && <div className="pulse-stmt__sheet">{COPY.sheet}</div>}
      </div>

      <div className={"pulse-stmt__main" + (center ? " pulse-stmt__main--center" : "")}>
        {p.showIndex && <div className="pulse-stmt__ghost" aria-hidden="true">{COPY.index}</div>}
        <div className="pulse-stmt__lead">研发效率 <span>Developer Productivity</span></div>
        <div className="pulse-stmt__quote">{quote}</div>
        {p.showSub && <div className="pulse-stmt__sub">{COPY.sub}</div>}
      </div>

      {(nKw > 0 || p.showColorBand) && (
        <div className="pulse-stmt__foot">
          {nKw > 0 ? (
            <div className="pulse-stmt__kw">
              {keywords.map((k, i) => <span className="pulse-stmt__chip" key={i}>{k}</span>)}
            </div>
          ) : <span />}
          {p.showColorBand && (
            <div className="pulse-stmt__band" aria-hidden="true">
              {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

PulseStatement.controls = controls;
PulseStatement.defaults = defaults;

// ---- preview-only registration (swap for `export default` in a bundler) ----
export default PulseStatement;
export { controls };
export { defaults };
