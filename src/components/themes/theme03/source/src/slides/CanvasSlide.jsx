import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CanvasSlide — 商业模式画布 (Business Model Canvas, Osterwalder).
   The canonical 9-block grid: 5-column upper band (KP · KA/KR · VP · CR/CH ·
   CS) over a 2-cell base band (Cost | Revenue). Built with CSS grid-areas so
   the layout holds at any scale; per-block focus + tunable mini-items. Pure /
   portable — props only, scoped tokens.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showItems", label: "要点条目", type: "toggle", default: true,
    help: "各模块内的要点条目显示 / 隐藏" },
  { key: "showIndex", label: "模块编号", type: "toggle", default: true,
    help: "每个模块的序号显示 / 隐藏" },
  { key: "groupColor", label: "三区配色", type: "toggle", default: true,
    help: "按「效率 / 价值 / 客户」三区给模块上色" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个模块" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 8, step: 1,
    help: "被高亮的模块序号（0–8，按画布从左到右、上到下）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showItems: true,
  showIndex: true,
  groupColor: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "商业设计 / BMC",
  kicker: "九大模块 · 一页看懂商业模式",
  title: "商业模式画布",
  subtitle: "效率侧 · 价值主张 · 客户侧 · 财务底盘，环环相扣",
  analysisLabel: "↳ 解读",
  analysisBody: "画布以「价值主张」为枢纽：右侧三块回答「为谁、如何触达、靠什么维系」，左侧三块回答「靠谁、做什么、用什么」交付价值，底部两块则是这套逻辑的财务投影。九块自洽闭环，才算一个跑得通的商业模式。",
  // group: 0 效率侧(左) · 1 价值(中) · 2 客户侧(右) · 3 财务(底)
  blocks: [
    { area: "kp", cn: "重要合作", en: "KEY PARTNERS", g: 0, items: ["战略联盟", "关键供应商"] },
    { area: "ka", cn: "关键业务", en: "KEY ACTIVITIES", g: 0, items: ["平台研发", "运营履约"] },
    { area: "kr", cn: "核心资源", en: "KEY RESOURCES", g: 0, items: ["技术 IP", "数据资产"] },
    { area: "vp", cn: "价值主张", en: "VALUE PROPOSITIONS", g: 1, items: ["更省 · 更快 · 更可靠", "解决核心痛点"] },
    { area: "cr", cn: "客户关系", en: "CUSTOMER RELATIONS", g: 2, items: ["自助服务", "专属客户成功"] },
    { area: "ch", cn: "渠道通路", en: "CHANNELS", g: 2, items: ["直销 + 生态分发", "线上自服务"] },
    { area: "cs", cn: "客户细分", en: "CUSTOMER SEGMENTS", g: 2, items: ["头部企业", "中长尾开发者"] },
    { area: "cost", cn: "成本结构", en: "COST STRUCTURE", g: 3, items: ["研发与算力", "获客与履约"] },
    { area: "rev", cn: "收入来源", en: "REVENUE STREAMS", g: 3, items: ["订阅 · 按量计费", "增值与服务"] },
  ],
  copy: {
    t001: "0",
  },
  ...decorDefaults,
};

// group: 0 效率侧(左) · 1 价值(中) · 2 客户侧(右) · 3 财务(底)
// Built per-render (getGroup) so category accents brighten on the dark field.
function getGroup() {
  const dk = isRDDark();
  return dk ? {
    0: { c: "#9ccb3a", tint: "rgba(156,203,58,0.12)" },
    1: { c: "#6e85ff", tint: "rgba(110,133,255,0.12)" },
    2: { c: "#dba84a", tint: "rgba(219,168,74,0.12)" },
    3: { c: "#a9a7a1", tint: "rgba(169,167,161,0.12)" },
  } : {
    0: { c: "#5f8f0c", tint: "rgba(95,143,12,0.10)" },
    1: { c: COLORS.blue, tint: "rgba(39,66,236,0.10)" },
    2: { c: "#b8821a", tint: "rgba(184,130,26,0.11)" },
    3: { c: "#5c5b57", tint: "rgba(92,91,87,0.10)" },
  };
}

export default function CanvasSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const GROUP = getGroup();
  const dark = p.theme === "dark";
  const fi = Math.min(Math.max(0, p.focusIndex), 8);

  const cell = (b, i) => {
    const hot = p.focusEnabled && i === fi;
    const dim = p.focusEnabled && !hot;
    const g = p.groupColor ? GROUP[b.g] : GROUP[1];
    return (
      <div key={b.area} style={{
        gridArea: b.area, position: "relative", overflow: "hidden",
        padding: "14px 18px", display: "flex", flexDirection: "column",
        background: hot ? g.c : (p.groupColor ? g.tint : (dark ? "rgba(243,242,238,0.04)" : "rgba(255,255,255,0.5)")),
        borderTop: `3px solid ${hot ? g.c : g.c}`,
        border: `1px solid ${hot ? g.c : COLORS.line2}`,
        borderTopWidth: 3,
        opacity: dim ? 0.4 : 1, transition: "opacity .3s, background .3s",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
          {p.showIndex && <span className="rd-mono" style={{ fontSize: 14, color: hot ? "rgba(255,255,255,0.8)" : g.c }}>{copy.t001}{i + 1}</span>}
          <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 24, color: hot ? "#fff" : COLORS.ink }}>{b.cn}</span>
        </div>
        <span className="rd-mono" style={{ fontSize: 13, color: hot ? "rgba(255,255,255,0.78)" : COLORS.ink3, marginTop: 2 }}>{b.en}</span>
        {p.showItems && (
          <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {b.items.map((it, j) => (
              <li key={j} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 18, lineHeight: 1.3, color: hot ? "rgba(255,255,255,0.95)" : COLORS.ink2 }}>
                <span style={{ flex: "none", width: 6, height: 6, marginTop: 7, background: hot ? "#fff" : g.c }} />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.subtitle}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{
          flex: 1, minHeight: 0, marginTop: 22,
          display: "grid", gap: 12,
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "1fr 1fr 0.62fr",
          gridTemplateAreas: `
            "kp ka vp cr cs"
            "kp kr vp ch cs"
            "cost cost cost rev rev"`,
        }}>
          {p.blocks.map((b, i) => cell(b, i))}
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{p.analysisLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.analysisBody}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={-6} pos={{ right: 44, top: 112 }} />
    </div>
  );
}
