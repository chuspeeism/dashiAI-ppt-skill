import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   TreemapSlide — 赛道资金矩形树图 (data: 报告 3.1 + 4 — “缩进层级可直接转换为
   矩形树图”). A slice-and-dice treemap whose rectangle AREAS are exactly
   proportional to each sector's 融资额 (via nested flexbox basis), labelled
   with amount / share / representative companies. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showShare", label: "金额/占比", type: "toggle", default: true,
    help: "各赛道金额与占比显示 / 隐藏" },
  { key: "showCompanies", label: "代表公司", type: "toggle", default: true,
    help: "各赛道代表公司标签显示 / 隐藏" },
  { key: "showCallout", label: "核心发现", type: "toggle", default: true,
    help: "底部资金版图解读显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一赛道块" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的赛道序号（0 = 通用大模型）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showShare: true,
  showCompanies: true,
  showCallout: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / TREEMAP",
  kicker: "2024 · 970 亿美元 · 赛道资金版图",
  title: "赛道资金版图",
  titleNote: "块面积 ∝ 融资额 · 一眼看清资本去向",
  unit: "亿美元",
  calloutLabel: "↳ 核心发现",
  calloutBody: "通用大模型独占近半壁江山（420 亿 / 43.3%），反映投资人押注“AGI 叙事”；垂直应用紧随其后，显示市场已开始寻找商业化路径；基础设施与芯片合计超四分之一，产业链上游投资热度不减。",
  sectors: [
    { cn: "通用大模型", en: "FOUNDATION MODEL", amt: 420, pct: "43.3%", firms: "OpenAI · Anthropic · xAI · SSI" },
    { cn: "垂直应用",   en: "VERTICAL AI",      amt: 245, pct: "25.3%", firms: "Glean · Perplexity · Harvey" },
    { cn: "AI 基础设施", en: "INFRASTRUCTURE",   amt: 158, pct: "16.3%", firms: "CoreWeave · Databricks · Scale AI" },
    { cn: "AI 芯片",    en: "HARDWARE",         amt: 97,  pct: "10.0%", firms: "GPU · 加速芯片" },
    { cn: "其他",       en: "TOOLING / SAFETY", amt: 50,  pct: "5.1%",  firms: "工具链 · 安全" },
  ],
  ...decorDefaults,
};

export default function TreemapSlide(props) {
  const p = { ...defaultProps, ...props };
  const SECTORS = p.sectors || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), SECTORS.length - 1);

  const Block = ({ i, big }) => {
    const s = SECTORS[i];
    const hot = p.focusEnabled && i === fi;
    const dim = p.focusEnabled && !hot;
    const base = i === 0 ? accent : RAMP[i];
    const solid = i === 0;                       // hero block reads as filled
    const bg = hot ? accent : (solid ? accent : `${base}${dark ? "30" : "26"}`);
    const ink = hot || solid ? "#fff" : COLORS.ink;
    const sub = hot || solid ? "rgba(255,255,255,0.82)" : COLORS.ink3;
    return (
      <div style={{
        flex: `${s.amt} 1 0`, minWidth: 0, minHeight: 0, position: "relative",
        background: bg, border: `2px solid ${hot || solid ? accent : base}`,
        padding: big ? "22px 24px" : "14px 16px", overflow: "hidden",
        display: "flex", flexDirection: "column",
        opacity: dim ? 0.4 : 1, transition: "opacity .3s, background .3s",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: big ? 40 : 26, color: ink, letterSpacing: "-0.01em", lineHeight: 1 }}>{s.cn}</span>
          {p.showShare && <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: big ? 30 : 21, color: hot || solid ? "#fff" : accent }}>{s.pct}</span>}
        </div>
        <span className="rd-mono" style={{ fontSize: big ? 16 : 13, color: sub, marginTop: 6 }}>{s.en}</span>
        {p.showShare && <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: big ? 26 : 19, color: ink, marginTop: big ? 12 : 6 }}>{s.amt} <span style={{ fontSize: big ? 16 : 13, color: sub }}>{p.unit}</span></span>}
        {p.showCompanies && (
          <span className="rd-mono" style={{ fontSize: big ? 16 : 13, color: sub, marginTop: "auto", paddingTop: 8, lineHeight: 1.3 }}>{s.firms}</span>
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

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22, paddingBottom: 6 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.titleNote}</span>
        </div>

        {/* treemap: areas exactly proportional via nested flex basis */}
        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", gap: 8, minHeight: 0, marginTop: 14 }}>
          <Block i={0} big />
          <div style={{ flex: `${245 + 158 + 97 + 50} 1 0`, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
            <Block i={1} big />
            <Block i={2} />
            <div style={{ flex: `${97 + 50} 1 0`, display: "flex", gap: 8, minHeight: 0 }}>
              <Block i={3} />
              <Block i={4} />
            </div>
          </div>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutBody}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={7} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
