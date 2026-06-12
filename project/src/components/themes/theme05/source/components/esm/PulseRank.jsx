/* =========================================================================
   PulseRank — P10 table page ("排行榜 / Ranking Bars" archetype).
   A generic ranked list slide: N rows sorted by value, each with a rank index,
   a label + category tag, a proportional bar and a value. Switchable colour
   mode (by-category / single-accent / mono) and a top-N highlight.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseRank.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Category → colour map (drives the by-category colour mode).
const CAT = {
  "通用大模型": SPECTRUM[0],
  "算力基础设施": SPECTRUM[5],
  "数据基础设施": SPECTRUM[4],
  "数据平台": SPECTRUM[4],
  "安全智能": SPECTRUM[6],
  "具身智能": SPECTRUM[3],
  "AI 搜索": SPECTRUM[1],
  "企业搜索": SPECTRUM[2],
};

const COPY = {
  eyebrow: "TOP FUNDED COMPANIES",
  title: "Top 10 融资公司",
  sub: "头部玩家资金排名",
  sheet: "RANKING · 10 / 32",
  unit: "最大单笔 · 亿美元",
  rows: [
    { name: "OpenAI",     cat: "通用大模型",   v: 66 },
    { name: "Anthropic",  cat: "通用大模型",   v: 65 },
    { name: "xAI",        cat: "通用大模型",   v: 50 },
    { name: "CoreWeave",  cat: "算力基础设施", v: 11 },
    { name: "SSI",        cat: "安全智能",     v: 10 },
    { name: "Scale AI",   cat: "数据基础设施", v: 10 },
    { name: "Figure AI",  cat: "具身智能",     v: 6.8 },
    { name: "Perplexity", cat: "AI 搜索",      v: 5.2 },
    { name: "Databricks", cat: "数据平台",     v: 5.0 },
    { name: "Glean",      cat: "企业搜索",     v: 2.6 },
  ],
  conclusion: "头部融资规模既反映技术叙事，也反映资源绑定能力。",
};

function PulseRank(props) {
  const p = Object.assign({}, PulseRank.defaults, props);
  const accent = p.accentColor;
  const n = Math.max(3, Math.min(COPY.rows.length, p.rowCount));
  const rows = COPY.rows.slice(0, n);
  const max = Math.max.apply(null, rows.map((r) => r.v));
  const focusCount = Math.max(1, Math.min(3, p.focusCount));

  function barColor(r, i) {
    if (p.colorMode === "accent") return accent;
    if (p.colorMode === "mono") return "#3d3a32";
    return CAT[r.cat] || SPECTRUM[5];
  }

  return (
    <div className="pulse-slide pulse-rank" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-rank__caphead">
        <span className="pulse-label">{COPY.sub}</span>
        <span className="pulse-mono">{COPY.unit}</span>
      </div>

      <div className="pulse-rank__list">
        {rows.map((r, i) => {
          const isFocus = p.focusEnabled && i < focusCount;
          const col = barColor(r, i);
          return (
            <div key={i} className={"pulse-rank__row" + (isFocus ? " pulse-rank__row--focus" : "")}>
              {p.showRankNumber && <div className="pulse-rank__rk">{String(i + 1).padStart(2, "0")}</div>}
              <div className="pulse-rank__label">
                <span className="pulse-rank__name">{r.name}</span>
                {p.showTag && <span className="pulse-rank__tag" style={{ color: col }}>{r.cat}</span>}
              </div>
              <div className="pulse-rank__track">
                <div className="pulse-rank__fill" style={{ width: (r.v / max) * 100 + "%", background: col }} />
              </div>
              {p.showValue && <div className="pulse-rank__val">{r.v}</div>}
            </div>
          );
        })}
      </div>

      {p.showConclusion && <div className="pulse-conclusion pulse-rank__concl">{COPY.conclusion}</div>}
    </div>
  );
}

PulseRank.controls = [
  { key: "rowCount", type: "slider", label: "排名条目数", default: 10, min: 3, max: 10, step: 1,
    description: "榜单展示的条目数量（按数值从高到低）。" },
  { key: "focusEnabled", type: "toggle", label: "突出榜首", default: true,
    description: "是否突出排名靠前的若干条目。" },
  { key: "focusCount", type: "slider", label: "突出数量", default: 3, min: 1, max: 3, step: 1,
    description: "被突出的头部条目数量（前 N 名）。" },
  { key: "colorMode", type: "radio", label: "配色模式", default: "category",
    options: [{ value: "category", label: "按类别" }, { value: "accent", label: "强调色" }, { value: "mono", label: "单色" }],
    description: "条形配色：按类别 / 统一强调色 / 单色。" },
  { key: "showRankNumber", type: "toggle", label: "排名序号", default: true,
    description: "每行左侧的两位排名序号。" },
  { key: "showTag", type: "toggle", label: "类别标签", default: true,
    description: "名称下方的类别 / 赛道标签。" },
  { key: "showValue", type: "toggle", label: "数值标注", default: true,
    description: "每行右侧的数值标注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "突出条目与眉标的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseRank.defaults = PulseRank.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseRank;
export const controls = PulseRank.controls || [];
export const defaults = PulseRank.defaults || {};
