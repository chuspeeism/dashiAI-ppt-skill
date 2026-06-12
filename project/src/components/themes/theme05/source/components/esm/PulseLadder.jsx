/* =========================================================================
   PulseLadder — P73 content page ("从试点到稳定收入 / Conversion Ladder" archetype).
   A generic content_page whose DISTINGUISHING element is a stage-by-stage
   CONVERSION LADDER with visible ATTRITION: N descending bars (width = value),
   each annotated with the drop-off lost to the next step, sitting beside a
   themed "Risk Card" of KPI rows. Complementary to the trapezoid funnel
   (P45) and one-way pipeline (P48) — here the story is leakage between steps.
   The reusable template for any "stage → retained value, with drop-off" page
   (pilot→paid, lead→won, install→active, trial→subscription…).

   Self-contained & migratable: depends only on React + the shared .pulse-lad /
   .pulse-* CSS. Text/data live in COPY (not prop-driven); everything else by
   props. See PulseLadder.controls for the typed parameter list.
   `export default PulseLadder; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "REVENUE RISK",
  title: "从试点到稳定收入",
  sheet: "RISK · 73 / 80",
  lead: "多数 AI 公司需要证明自己能从试点项目转向稳定订阅收入。",
  stageCap: "试点 → 收入 转化阶梯",
  stageUnit: "PILOT → REVENUE",
  // value = share of the original pilot cohort that survives to this stage.
  stages: [
    { k: "试点客户", en: "PILOT",        v: 100 },
    { k: "付费转化", en: "PAID",         v: 28  },
    { k: "12 个月留存", en: "RETAINED",  v: 23  },
    { k: "营收扩张", en: "EXPANSION",    v: 11  },
  ],
  cardTitle: "收入验证",
  cardEn: "REVENUE VALIDATION",
  cardLead: "收入验证要看留存、毛利和客户扩张，而不是只看 Logo。",
  kpis: [
    ["试点转付费率", "28", "%"],
    ["企业年流失率", "17", "%"],
    ["毛利率中位数", "54", "%"],
    ["推理成本占收入", "31", "%"],
  ],
  conclusion: "客户试点不等于商业化成功。",
};

const controls = [
  { key: "stageCount", type: "slider", label: "阶段数量", default: 4, min: 2, max: 4, step: 1,
    description: "转化阶梯的阶段（台阶）数量。" },
  { key: "chartType", type: "radio", label: "阶梯样式", default: "ladder",
    options: [{ value: "ladder", label: "居中收窄" }, { value: "bars", label: "左对齐条" }],
    description: "阶梯呈现：居中收窄（漏斗感）/ 左对齐横向条。" },
  { key: "focusEnabled", type: "toggle", label: "重点阶段", default: true,
    description: "是否突出某一阶段（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点阶段序号", default: 2, min: 1, max: 4, step: 1,
    description: "被突出的阶段序号（从 1 起）。" },
  { key: "showDropoff", type: "toggle", label: "流失标注", default: true,
    description: "相邻阶段之间的流失（drop-off）标注。" },
  { key: "showValue", type: "toggle", label: "数值标注", default: true,
    description: "各阶段的占比数值标注。" },
  { key: "showMetricCard", type: "toggle", label: "指标卡", default: true,
    description: "右侧的「风险卡」指标卡（关闭则阶梯铺满整幅）。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "指标卡内的指标行数。" },
  { key: "cardTheme", type: "radio", label: "指标卡主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
    description: "指标卡背景：深色 / 强调色块 / 纸色。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 重点阶段 /「色块」主题指标卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseLadder(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.stages.length, p.stageCount));
  const stages = COPY.stages.slice(0, n);
  const maxV = stages[0].v || 100;
  const focus = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : -1;
  const centered = p.chartType === "ladder";

  const nKpi = Math.max(2, Math.min(COPY.kpis.length, p.metricCount));
  const kpis = COPY.kpis.slice(0, nKpi);
  const hasCard = p.showMetricCard;

  let bg, fg, div;
  if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }

  return (
    <div className="pulse-slide pulse-lad" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          {p.showLead && <div className="pulse-pagehead__sub pulse-lad__lead">{COPY.lead}</div>}
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-lad__body">
        <div className={"pulse-lad__row" + (hasCard ? "" : " pulse-lad__row--solo")}>
          <div className="pulse-lad__plot">
            <div className="pulse-lad__plot-cap">
              <span className="pulse-label">{COPY.stageCap}</span>
              <span className="pulse-mono">{COPY.stageUnit}</span>
            </div>
            <div className="pulse-lad__steps">
              {stages.map((s, i) => {
                const w = Math.max(7, (s.v / maxV) * 100);
                const col = SPECTRUM[i % SPECTRUM.length];
                const dim = focus >= 0 && i !== focus;
                const isFocus = i === focus;
                const drop = i > 0 ? stages[i - 1].v - s.v : 0;
                return (
                  <div className="pulse-lad__step" key={i}>
                    <div className="pulse-lad__step-rail" style={{ justifyContent: centered ? "center" : "flex-start" }}>
                      <div className={"pulse-lad__bar" + (isFocus ? " pulse-lad__bar--focus" : "") + (dim ? " pulse-lad__bar--dim" : "")}
                        style={{ width: w + "%", background: col }}>
                        <span className="pulse-lad__bar-k">
                          <b>{s.k}</b><i>{s.en}</i>
                        </span>
                        {p.showValue && <span className="pulse-lad__bar-v">{s.v}<small>%</small></span>}
                      </div>
                    </div>
                    {p.showDropoff && drop > 0 && (
                      <div className="pulse-lad__note" style={{ textAlign: centered ? "center" : "left" }}>
                        <span className="pulse-lad__note-tick">↘</span> 较上一阶段流失 <b>−{drop}%</b>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {hasCard && (
            <div className="pulse-lad__card" style={{ background: bg, color: fg, "--lad-div": div }}>
              <div className="pulse-lad__card-en">{COPY.cardEn}</div>
              <div className="pulse-lad__card-t">{COPY.cardTitle}</div>
              <div className="pulse-lad__card-lead">{COPY.cardLead}</div>
              <div className="pulse-lad__kpis">
                {kpis.map((m, i) => (
                  <div className="pulse-lad__k" key={i}>
                    <span className="pulse-lad__k-k">{m[0]}</span>
                    <span className="pulse-lad__k-v">{m[1]}<small>{m[2]}</small></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-lad__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseLadder.controls = controls;
PulseLadder.defaults = defaults;
export default PulseLadder;
export { controls };
export { defaults };
