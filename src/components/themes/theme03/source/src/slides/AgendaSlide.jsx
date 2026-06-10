import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   AgendaSlide — 报告导览 / 目录 (numbered chapter index).
   An editorial table-of-contents: oversized index numerals + chapter titles.
   Count / columns / focus / accent are props; the chapter copy is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "章节数量", type: "slider", default: 7, min: 4, max: 7, step: 1,
    help: "展示的章节数量" },
  { key: "columns", label: "栏目布局", type: "select", default: "1",
    options: [{ value: "1", label: "单栏" }, { value: "2", label: "双栏" }],
    help: "目录的栏数布局" },
  { key: "showRule", label: "分隔线", type: "toggle", default: true,
    help: "条目之间的分隔细线显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它章节以突出某一章" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 6, step: 1,
    help: "被突出的章节序号（自动随章节数量收敛）" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "序号与高亮使用的强调色" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 7,
  columns: "1",
  showRule: true,
  focusEnabled: false,
  focusIndex: 0,
  accent: "blue",
  // —— visible content (override per deck) ——
  eyebrow: "导览 / CONTENTS",
  kicker: "07 章 · 横纵分析法",
  titlePre: "报告",
  titleAccent: "导览",
  chapters: [
    { idx: "01", title: "研究方法 · 横纵分析法", en: "METHODOLOGY" },
    { idx: "02", title: "市场全景 · 纵向趋势", en: "MARKET PANORAMA" },
    { idx: "03", title: "横向透视 · 行业·轮次·头部", en: "HORIZONTAL VIEW" },
    { idx: "04", title: "产业链分层 · 上中下游", en: "VALUE CHAIN" },
    { idx: "05", title: "典型案例 · 深度剖析", en: "CASE STUDIES" },
    { idx: "06", title: "风险研判与投资展望", en: "RISK & OUTLOOK" },
    { idx: "07", title: "结论 · 横纵收束", en: "CONCLUSION" },
  ],
  ...decorDefaults,
};

export default function AgendaSlide(props) {
  const p = { ...defaultProps, ...props };
  const CHAPTERS = p.chapters || [];
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const n = Math.max(4, Math.min(CHAPTERS.length, p.itemCount));
  const items = CHAPTERS.slice(0, n);
  const fi = Math.min(p.focusIndex, n - 1);
  const twoCol = p.columns === "2";
  // When chapters are dense (≥6), step the titles / numerals down so rows
  // breathe in the single-column layout.
  const dense = n >= 6;
  const idxSize = twoCol ? 64 : (dense ? 62 : 76);
  const idxWidth = twoCol ? 96 : (dense ? 96 : 116);
  const titleSize = twoCol ? 34 : (dense ? 34 : 42);
  const enSize = dense && !twoCol ? 19 : 21;
  const rowGap = twoCol ? 32 : (dense ? 28 : 32);

  const Row = (c, i) => {
    const hot = p.focusEnabled && i === fi;
    const dim = p.focusEnabled && !hot;
    return (
      <div key={c.idx} className={`rd-anim rd-anim-${Math.min(4, (i % 4) + 1)}`} style={{
        display: "flex", alignItems: "center", gap: rowGap,
        flex: twoCol ? "none" : 1,
        padding: twoCol ? "22px 0" : "0 8px",
        borderTop: p.showRule && (twoCol ? i >= (twoCol ? 0 : 0) : i > 0) ? `1px solid ${COLORS.line2}` : "none",
        opacity: dim ? 0.4 : 1, transition: "opacity .3s",
      }}>
        <span style={{
          fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: idxSize, lineHeight: 0.9,
          letterSpacing: "-0.02em", color: "transparent",
          WebkitTextStroke: `2px ${hot ? accentInk : COLORS.line}`,
          fontFeatureSettings: '"tnum" 1', flexShrink: 0, width: idxWidth,
        }}>{c.idx}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: titleSize,
            letterSpacing: "-0.01em", color: hot ? accentInk : COLORS.ink, lineHeight: 1.1 }}>{c.title}</div>
          <div className="rd-mono" style={{ fontSize: enSize, marginTop: 6, color: hot ? accentInk : COLORS.ink3 }}>{c.en}</div>
        </div>
        <span style={{ marginLeft: "auto", width: hot ? 40 : 22, height: 3, background: hot ? accent : COLORS.line, flexShrink: 0 }} />
      </div>
    );
  };

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className={`rd-tag rd-anim ${p.accent === "lime" ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 28, paddingBottom: 14 }}>
          <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 1100 }}>
            {p.titlePre}<span style={{ color: accentInk }}>{p.titleAccent}</span>
          </h2>
          <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={186} rotate={6} pos={{ right: 96, top: -26 }} />
        </div>

        {twoCol ? (
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 80, alignContent: "center", minHeight: 0 }}>
            {items.map((c, i) => Row(c, i))}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {items.map((c, i) => Row(c, i))}
          </div>
        )}
      </div>
    </div>
  );
}
