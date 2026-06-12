/* =========================================================================
   PulseRegister — P74 table page ("隐私、版权与安全 / Risk Register" archetype).
   A generic Swiss data table whose DISTINGUISHING element is a SEVERITY
   EXPOSURE BAND column — a green→red segmented ramp lit to each row's risk
   level, paired with a 低/中/高 verdict chip. The fifth complementary
   `table_page` type alongside PulseMatrix (chip verdicts), PulseLedger (inline
   data bars), PulseMeter (0–100 gauges) and PulseSignal (signal dots). Rows can
   sort by severity; an intro carries the lead + a headline metric pair. The
   reusable template for any "risk / compliance register · dimension × evidence
   × representative × severity" table.

   Self-contained & migratable: depends only on React + the shared .pulse-reg /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseRegister.controls for the typed parameter list.
   `export default PulseRegister; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
// Severity ramp: low → high (green … deep red). Independent of accent color.
const RAMP = ["#3c9a52","#efbe2e","#e2742c","#d8402e","#b32a1e"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
// Each row: dim (k+en), data (num+sub), rep, level (1..5).
const COPY = {
  eyebrow: "REGULATION RISK",
  title: "隐私、版权与安全",
  sheet: "RISK · 74 / 80",
  lead: "隐私、版权、安全和行业监管会增加交付成本。",
  headlines: [
    ["合规团队增长", "+42", "%"],
    ["采购审查周期", "+36", "%"],
  ],
  headers: ["维度", "模拟数据", "代表对象", "严重度"],
  sevHead: "SEVERITY",
  rows: [
    { k: "数据隐私", en: "Privacy",     num: "58", unit: "%", sub: "数据隔离需求", rep: "医疗 · 金融客户", level: 5 },
    { k: "版权合规", en: "Copyright",   num: "19", unit: "起", sub: "版权风险事件", rep: "图像 · 视频生成", level: 4 },
    { k: "模型安全", en: "Safety",      num: "+42", unit: "%", sub: "合规团队增长", rep: "通用大模型", level: 3 },
    { k: "行业监管", en: "Regulation",  num: "+36", unit: "%", sub: "采购审查周期", rep: "受监管行业", level: 3 },
  ],
  conclusion: "合规能力会成为企业采购门槛。",
};

function levelLabel(lv) { return lv >= 4 ? "高" : lv >= 3 ? "中" : "低"; }

const controls = [
  { key: "rowCount", type: "slider", label: "数据行数", default: 4, min: 2, max: 4, step: 1,
    description: "表格的数据行数量。" },
  { key: "showExposure", type: "toggle", label: "严重度带", default: true,
    description: "末尾的严重度暴露带列（green→red 色阶，关闭则收起该列）。" },
  { key: "scaleMax", type: "slider", label: "严重度刻度", default: 5, min: 3, max: 5, step: 1,
    description: "严重度暴露带的总刻度段数。" },
  { key: "showVerdict", type: "toggle", label: "判断标签", default: true,
    description: "严重度带旁的「低 / 中 / 高」判断 chip。" },
  { key: "sortDescending", type: "toggle", label: "按严重度降序", default: true,
    description: "是否按严重度由高到低排序行。" },
  { key: "zebra", type: "toggle", label: "斑马纹", default: false,
    description: "隔行底色，便于横向读取。" },
  { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
    description: "是否突出某一行。" },
  { key: "focusIndex", type: "slider", label: "重点行序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的行序号（按当前排序后顺序，从 1 起）。" },
  { key: "showIntro", type: "toggle", label: "引导栏", default: true,
    description: "表格上方的引导文案与一对头部指标。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 头部指标 / 重点行的强调色（严重度带用独立色阶）。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "表格下方的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseRegister(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
  let rows = COPY.rows.slice(0, n);
  if (p.sortDescending) rows = rows.slice().sort((a, b) => b.level - a.level);

  const scaleMax = Math.max(3, Math.min(5, p.scaleMax));
  const showExp = p.showExposure;
  const showVer = p.showVerdict;
  // Column template: dim / data / rep / [exposure] [verdict]
  let cols = ["1.5fr", "1.4fr", "1.7fr"];
  if (showExp) cols.push("1.5fr");
  if (showVer) cols.push("0.7fr");
  const template = cols.join(" ");
  const headers = COPY.headers.slice(0, showExp ? 4 : 3);

  return (
    <div className="pulse-slide pulse-reg" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-reg__body">
        {p.showIntro && (
          <div className="pulse-reg__intro">
            <div className="pulse-reg__lead">{COPY.lead}</div>
            <div className="pulse-reg__hm">
              {COPY.headlines.map((h, i) => (
                <div className="pulse-reg__hm-item" key={i}>
                  <span className="pulse-reg__hm-v">{h[1]}<small>{h[2]}</small></span>
                  <span className="pulse-reg__hm-k">{h[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pulse-reg__table">
          <div className="pulse-reg__row pulse-reg__row--head" style={{ gridTemplateColumns: template }}>
            {headers.map((h, i) => (
              <div className="pulse-reg__cell" key={i}>
                <span className="pulse-reg__h">{i === 3 ? COPY.sevHead : h}</span>
              </div>
            ))}
            {showExp && showVer && <div className="pulse-reg__cell"><span className="pulse-reg__h">判断</span></div>}
          </div>

          {rows.map((r, i) => {
            const focus = p.focusEnabled && i + 1 === p.focusIndex;
            const zebra = p.zebra && !focus && i % 2 === 1;
            const lv = Math.max(1, Math.min(scaleMax, r.level));
            const sevColor = RAMP[Math.min(RAMP.length - 1, lv - 1)];
            const cls = "pulse-reg__row pulse-reg__row--body"
              + (focus ? " pulse-reg__row--focus" : "")
              + (zebra ? " pulse-reg__row--zebra" : "");
            return (
              <div key={i} className={cls} style={{ gridTemplateColumns: template }}>
                <div className="pulse-reg__cell">
                  <span className="pulse-reg__k">{r.k}</span>
                  <span className="pulse-reg__sub">{r.en}</span>
                </div>
                <div className="pulse-reg__cell">
                  <span className="pulse-reg__num">{r.num}<small>{r.unit}</small></span>
                  <span className="pulse-reg__dsub">{r.sub}</span>
                </div>
                <div className="pulse-reg__cell">
                  <span className="pulse-reg__rep">{r.rep}</span>
                </div>
                {showExp && (
                  <div className="pulse-reg__cell">
                    <div className="pulse-reg__band">
                      {Array.from({ length: scaleMax }).map((_, d) => {
                        const on = d < lv;
                        return (
                          <span key={d} className="pulse-reg__seg"
                            style={on
                              ? { background: RAMP[Math.min(RAMP.length - 1, d)] }
                              : { background: focus ? "rgba(255,255,255,0.22)" : "var(--pulse-paper-2)", boxShadow: "inset 0 0 0 1px " + (focus ? "rgba(255,255,255,0.3)" : "var(--pulse-hair)") }} />
                        );
                      })}
                    </div>
                  </div>
                )}
                {showExp && showVer && (
                  <div className="pulse-reg__cell pulse-reg__cell--ver">
                    <span className="pulse-reg__chip" style={{ background: sevColor }}>{levelLabel(lv)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-reg__foot">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseRegister.controls = controls;
PulseRegister.defaults = defaults;
export default PulseRegister;
export { controls };
export { defaults };
