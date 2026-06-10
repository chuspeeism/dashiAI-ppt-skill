import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   TableSlide — 表格页 · 头部玩家速查表 (data league table).
   A props-driven data table: Top-N rows, optional magnitude bar, optional
   secondary column (产业链层级), a focusable row and a takeaway callout.
   Pure & portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "条目数量", type: "slider", default: 10, min: 5, max: 10, step: 1,
    help: "展示的公司数量（Top N）" },
  { key: "showBar", label: "数值条", type: "toggle", default: true,
    help: "「最大单笔」列内嵌数值量级条" },
  { key: "showSecondary", label: "附加列", type: "toggle", default: true,
    help: "「产业链层级」附加列显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一行公司" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 9, step: 1,
    help: "被高亮的名次（自动随条目数量收敛）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部集中度解读显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 10,
  showBar: true,
  showSecondary: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  // —— visible content (override per deck) ——
  eyebrow: "头部玩家 / 04",
  kicker: "TOP 10 · 最大单笔融资（亿美元）",
  title: "头部玩家融资速查表",
  headers: ["排名", "公司", "最大单笔", "主营赛道", "产业链层级"],
  calloutLabel: "↳ 集中度",
  calloutBody: "前三名均为通用大模型赛道，单笔融资均超 50 亿美元——资本高度向头部公司与 AGI 叙事集中，「赢家通吃」格局确立。",
  rows: [
    { co: "OpenAI", amt: 66, sector: "通用大模型", layer: "中游" },
    { co: "Anthropic", amt: 65, sector: "通用大模型", layer: "中游" },
    { co: "xAI", amt: 50, sector: "通用大模型", layer: "中游" },
    { co: "Safe Superintelligence", amt: 10, sector: "通用大模型", layer: "中游" },
    { co: "CoreWeave", amt: 11, sector: "AI 基础设施", layer: "上游" },
    { co: "Figure AI", amt: 6.8, sector: "AI 硬件 · 人形机器人", layer: "下游" },
    { co: "Scale AI", amt: 10, sector: "AI 基础设施 · 数据标注", layer: "上游" },
    { co: "Perplexity AI", amt: 5.2, sector: "垂直应用 · AI 搜索", layer: "下游" },
    { co: "Databricks", amt: 5.0, sector: "AI 基础设施 · 数据平台", layer: "下游" },
    { co: "Glean", amt: 2.6, sector: "垂直应用 · 企业搜索", layer: "下游" },
  ],
  ...decorDefaults,
};

// Built per-render so layer badges follow the JS theme. Badge text on the
// bright lime/ink fills stays dark/light by intent (not the slide-body ink).
function getLayer() {
  const dk = isRDDark();
  return {
    上游: { bg: dk ? "rgba(110,133,255,0.18)" : "rgba(39,66,236,0.12)", fg: COLORS.blue },
    中游: { bg: COLORS.ink, fg: COLORS.bg },
    下游: { bg: COLORS.lime, fg: "#161513" },
  };
}

export default function TableSlide(props) {
  const LAYER = getLayer();
  const p = { ...defaultProps, ...props };
  const ROWS = p.rows || [];
  const MAX = ROWS.length ? Math.max(...ROWS.map((r) => r.amt)) : 1;
  const accent = COLORS.blue;
  const n = Math.max(5, Math.min(ROWS.length, p.itemCount));
  const rows = ROWS.slice(0, n);
  const fi = Math.min(p.focusIndex, n - 1);

  const grid = p.showSecondary
    ? "84px 1.5fr 1.7fr 1.5fr 132px"
    : "84px 1.6fr 1.9fr 1.6fr";

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <h2 className="rd-title rd-anim rd-anim-2" style={{ marginTop: 34 }}>{p.title}</h2>

        <div className="rd-anim rd-anim-2" style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: 22, minHeight: 0 }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: grid, alignItems: "center", gap: 22, padding: "0 16px 12px", borderBottom: `2px solid ${COLORS.ink}` }}>
            {(p.headers || []).slice(0, p.showSecondary ? 5 : 4).map((h, i) => (
              <span key={i} className="rd-mono" style={{ fontSize: 21, color: COLORS.ink3, textAlign: i === 4 ? "center" : "left" }}>{h}</span>
            ))}
          </div>
          {/* rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {rows.map((r, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const intensity = r.amt / MAX;
              const lay = LAYER[r.layer];
              return (
                <div key={i} style={{
                  flex: 1, display: "grid", gridTemplateColumns: grid, alignItems: "center", gap: 22,
                  padding: "0 16px", borderBottom: `1px solid ${COLORS.line2}`,
                  background: hot ? "rgba(39,66,236,0.07)" : (i % 2 ? "rgba(22,21,19,0.022)" : "transparent"),
                  boxShadow: hot ? `inset 3px 0 0 ${accent}` : "none",
                  opacity: dim ? 0.6 : 1,
                }}>
                  <span style={{ fontFamily: "var(--rd-mono)", fontSize: 30, fontWeight: 700, color: hot ? accent : (i < 3 ? COLORS.ink : COLORS.ink3) }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: hot ? 800 : 700, fontSize: 30, color: hot ? accent : COLORS.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.co}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {p.showBar && (
                      <div style={{ flex: 1, height: 12, background: "rgba(22,21,19,0.06)", position: "relative", minWidth: 60 }}>
                        <div style={{ position: "absolute", inset: 0, width: `${intensity * 100}%`, background: hot ? accent : `rgba(22,21,19,${(0.32 + intensity * 0.46).toFixed(3)})` }} />
                      </div>
                    )}
                    <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 28, color: hot ? accent : COLORS.ink, width: 56, textAlign: "right", flex: "none", fontFeatureSettings: '"tnum" 1' }}>{r.amt}</span>
                  </div>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 500, fontSize: 23, color: COLORS.ink2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sector}</span>
                  {p.showSecondary && (
                    <span style={{ justifySelf: "center", fontFamily: "var(--rd-mono)", fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", padding: "6px 14px", background: lay.bg, color: lay.fg, whiteSpace: "nowrap" }}>{r.layer}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0 }}>
              {p.calloutBody}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={150} rotate={5} pos={{ right: 60, top: 128 }} />
    </div>
  );
}
