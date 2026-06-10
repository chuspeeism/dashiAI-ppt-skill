import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CaseCompareSlide — 表格 · 三大案例对比 (side-by-side comparison table).
   Companies as columns, metrics as rows. A company column can be focused, the
   edge row toggled, count clamped. Pure & portable; data from the report.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "公司数量", type: "slider", default: 3, min: 2, max: 3, step: 1,
    help: "参与对比的公司数量" },
  { key: "showEdge", label: "差异化行", type: "toggle", default: true,
    help: "「差异化优势」对比行显示 / 隐藏" },
  { key: "showRank", label: "估值标记", type: "toggle", default: true,
    help: "表头公司的估值梯队标记显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一家公司列" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被高亮的公司序号（自动随公司数量收敛）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部对比小结显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 3,
  showEdge: true,
  showRank: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  // —— visible content (override per deck) ——
  eyebrow: "典型案例 / 对比",
  kicker: "三大案例 · 横向对比",
  title: "三大案例对比速览",
  cornerLabel: "维度 / COMPANY",
  calloutLabel: "↳ 小结",
  calloutBody: "三家路径迥异——Anthropic 以「安全对齐」构筑企业信任，xAI 靠数据与速度后来居上，CoreWeave 则以「卖铲子」绕开模型竞争。叙事不同，但都印证了头部标的的资本虹吸。",
  companies: [
    { name: "Anthropic", en: "通用大模型", tier: "全球估值最高" },
    { name: "xAI", en: "通用大模型", tier: "18 个月入头部" },
    { name: "CoreWeave", en: "AI 算力云", tier: "卖铲子赢家" },
  ],
  // rows: each metric across the companies (data exactly from the report)
  rows: [
    { metric: "成立年份", en: "FOUNDED", vals: ["2021", "2023", "2023 转型"] },
    { metric: "2024 融资", en: "RAISED", vals: ["累计 650 亿", "50 亿", "110 亿"], unit: "亿美元" },
    { metric: "最新估值", en: "VALUATION", vals: ["9650 亿", "500 亿", "190 亿+"], unit: "亿美元", strong: true },
    { metric: "主营赛道", en: "SECTOR", vals: ["通用大模型", "通用大模型", "AI 算力云"] },
    { metric: "差异化优势", en: "EDGE", vals: ["安全对齐 · 企业信任", "X 实时数据 · 特斯拉协同", "锁定算力 · 卖铲子逻辑"], edge: true },
  ],
  ...decorDefaults,
};

export default function CaseCompareSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = COLORS.blue;
  const nco = Math.max(2, Math.min(p.companies.length, p.itemCount));
  const cos = p.companies.slice(0, nco);
  const fi = Math.min(p.focusIndex, nco - 1);
  const rows = p.rows.filter((r) => p.showEdge || !r.edge);

  const grid = `1.05fr ${cos.map(() => "1.3fr").join(" ")}`;

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <h2 className="rd-title rd-anim rd-anim-2" style={{ marginTop: 34 }}>{p.title}</h2>

        <div className="rd-anim rd-anim-2" style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: 22, minHeight: 0 }}>
          {/* header: company names */}
          <div style={{ display: "grid", gridTemplateColumns: grid, alignItems: "end", gap: 20, padding: "0 18px 14px", borderBottom: `2px solid ${COLORS.ink}` }}>
            <span className="rd-mono" style={{ fontSize: 21, color: COLORS.ink3 }}>{p.cornerLabel}</span>
            {cos.map((c, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <div key={i} style={{ opacity: p.focusEnabled && !hot ? 0.55 : 1 }}>
                  <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 34, color: hot ? accent : COLORS.ink, letterSpacing: "-0.01em" }}>{c.name}</div>
                  {p.showRank && (
                    <div className="rd-mono" style={{ fontSize: 19, marginTop: 6, color: hot ? accent : COLORS.ink3 }}>{c.tier}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {rows.map((r, ri) => (
              <div key={ri} style={{
                flex: 1, display: "grid", gridTemplateColumns: grid, alignItems: "center", gap: 20,
                padding: "0 18px", borderBottom: ri < rows.length - 1 ? `1px solid ${COLORS.line2}` : "none",
                background: ri % 2 ? "rgba(22,21,19,0.022)" : "transparent",
              }}>
                <div>
                  <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 700, fontSize: 25, color: COLORS.ink }}>{r.metric}</div>
                  <div className="rd-mono" style={{ fontSize: 18, marginTop: 3, color: COLORS.ink3 }}>{r.en}</div>
                </div>
                {cos.map((c, ci) => {
                  const hot = p.focusEnabled && ci === fi;
                  const dim = p.focusEnabled && !hot;
                  return (
                    <div key={ci} style={{
                      alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "center",
                      paddingLeft: 18, marginLeft: -18,
                      background: hot ? "rgba(39,66,236,0.06)" : "transparent",
                      boxShadow: hot ? `inset 3px 0 0 ${accent}` : "none",
                      opacity: dim ? 0.5 : 1,
                    }}>
                      {r.edge ? (
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 500, fontSize: 22, lineHeight: 1.3, color: COLORS.ink2 }}>{r.vals[ci]}</span>
                      ) : (
                        <div style={{ display: "flex", alignItems: "baseline", gap: 7, flexWrap: "nowrap" }}>
                          <span style={{ fontFamily: "var(--rd-sans)", fontWeight: r.strong ? 800 : 700,
                            fontSize: r.strong ? 36 : 28, letterSpacing: "-0.01em",
                            color: hot && r.strong ? accent : COLORS.ink, fontFeatureSettings: '"tnum" 1', whiteSpace: "nowrap" }}>{r.vals[ci]}</span>
                          {r.unit && <span className="rd-mono" style={{ fontSize: 18, color: COLORS.ink3, whiteSpace: "nowrap" }}>{r.unit}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
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
