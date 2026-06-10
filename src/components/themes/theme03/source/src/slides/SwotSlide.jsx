import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   SwotSlide — SWOT 模型 (Strengths / Weaknesses / Opportunities / Threats).
   A 2×2 quadrant split by two axes: 内部 vs 外部 (rows) × 增益 vs 损害
   (columns). Each quadrant carries a watermark letter, header, and a tunable
   list of points. Pure / portable — props only, scoped tokens, soft entrance.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showAxis", label: "坐标轴标注", type: "toggle", default: true,
    help: "「内部 / 外部 · 增益 / 损害」坐标轴标注显示 / 隐藏" },
  { key: "showLetter", label: "象限字母", type: "toggle", default: true,
    help: "各象限的巨型水印字母 (S / W / O / T) 显示 / 隐藏" },
  { key: "itemCount", label: "每象限条目", type: "slider", default: 3, min: 2, max: 4, step: 1,
    help: "每个象限展示的要点数量" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个象限" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 3, step: 1,
    help: "被高亮的象限序号（0 S → 1 W → 2 O → 3 T）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showAxis: true,
  showLetter: true,
  itemCount: 3,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "战略模型 / SWOT",
    t002: "优势 · 劣势 · 机会 · 威胁",
    t003: "SWOT 模型",
    t004: "内部能力 × 外部环境 · 系统盘点优劣与机危",
    t005: "内部",
    t006: "外部",
    t007: "INTERNAL",
    t008: "EXTERNAL",
    t009: "增益 · HELPFUL",
    t010: "损害 · HARMFUL",
    t011: "↳ 解读",
    t012: "SWOT 不止于罗列——价值在于「交叉匹配」：用优势抓机会（SO 进攻）、补劣势防威胁（WT 防守）、 以机会化解劣势（WO 改善）、用优势对冲威胁（ST 缓冲），从四象限推导出可执行的战略组合。",
  },
  quadrants: [
  { k: "S", cn: "优势", en: "STRENGTHS", side: "内部 · 增益", accent: COLORS.blue, tint: "rgba(39,66,236,0.10)",
    items: ["核心技术壁垒领先", "研发团队稳定高效", "现金流健康可持续", "头部客户粘性强"] },
  { k: "W", cn: "劣势", en: "WEAKNESSES", side: "内部 · 损害", accent: "#b8821a", tint: "rgba(184,130,26,0.12)",
    items: ["渠道覆盖仍有限", "品牌认知度偏弱", "单一客户依赖度高", "组织扩张存挑战"] },
  { k: "O", cn: "机会", en: "OPPORTUNITIES", side: "外部 · 增益", accent: "#5f8f0c", tint: "rgba(95,143,12,0.13)",
    items: ["政策红利持续释放", "新兴市场快速扩张", "上下游整合空间大", "需求侧加速渗透"] },
  { k: "T", cn: "威胁", en: "THREATS", side: "外部 · 损害", accent: "#b04a2f", tint: "rgba(176,74,47,0.12)",
    items: ["巨头入场加剧竞争", "替代技术迭代涌现", "行业监管趋于收紧", "资本环境周期波动"] },
  ],
  quadDarkAccents: ["#6e85ff", "#d8a43c", "#9ccb3a", "#e07a5a"],
  ...decorDefaults,
};

// Accents brighten on the dark field so quadrant titles/markers keep contrast.
function getQuad(quadrants, darkAccents) {
  if (!isRDDark()) return quadrants;
  return quadrants.map((q, i) => ({ ...q, accent: darkAccents[i] || q.accent }));
}

export default function SwotSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const QUAD_T = getQuad(p.quadrants, p.quadDarkAccents);
  const dark = p.theme === "dark";
  const fi = Math.min(Math.max(0, p.focusIndex), 3);
  const n = Math.min(Math.max(2, p.itemCount), 4);

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        {/* axis-labelled 2×2 board */}
        <div className="rd-anim rd-anim-3" style={{ display: "flex", marginTop: 22, flex: 1, minHeight: 0 }}>
          {/* vertical axis (内部 / 外部) */}
          {p.showAxis && (
            <div style={{ display: "flex", flexDirection: "column", width: 40, flex: "none", marginRight: 14 }}>
              {[copy.t005, copy.t006].map((t, i) => (
                <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="rd-mono" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 18, letterSpacing: "0.16em", color: COLORS.ink3 }}>{t} {i === 0 ? copy.t007 : copy.t008}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {/* horizontal axis (增益 / 损害) */}
            {p.showAxis && (
              <div style={{ display: "flex", gap: 18, marginBottom: 10 }}>
                {[[copy.t009, "#5f8f0c"], [copy.t010, "#b04a2f"]].map(([t, c], i) => (
                  <span key={i} className="rd-mono" style={{ flex: 1, textAlign: "center", fontSize: 18, letterSpacing: "0.12em", color: c }}>{t}</span>
                ))}
              </div>
            )}

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 18, minHeight: 0 }}>
              {QUAD_T.map((q, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{
                    position: "relative", overflow: "hidden",
                    padding: "22px 26px",
                    background: hot ? q.accent : q.tint,
                    border: `2px solid ${hot ? q.accent : q.accent}`,
                    opacity: dim ? 0.4 : 1, transition: "opacity .3s, background .3s",
                  }}>
                    {p.showLetter && (
                      <span style={{
                        position: "absolute", right: 14, bottom: -22,
                        fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 150, lineHeight: 1,
                        color: hot ? "rgba(255,255,255,0.22)" : q.accent, opacity: hot ? 1 : 0.16,
                        pointerEvents: "none",
                      }}>{q.k}</span>
                    )}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, position: "relative" }}>
                      <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 32, color: hot ? "#fff" : q.accent }}>{q.cn}</span>
                      <span className="rd-mono" style={{ fontSize: 16, color: hot ? "rgba(255,255,255,0.85)" : COLORS.ink3 }}>{q.en}</span>
                      <span className="rd-mono" style={{ fontSize: 14, marginLeft: "auto", color: hot ? "rgba(255,255,255,0.7)" : COLORS.ink3 }}>{q.side}</span>
                    </div>
                    <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, position: "relative", display: "flex", flexDirection: "column", gap: 9 }}>
                      {q.items.slice(0, n).map((it, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 22, color: hot ? "#fff" : COLORS.ink2 }}>
                          <span style={{ flex: "none", width: 7, height: 7, marginTop: 9, background: hot ? "#fff" : q.accent }} />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t011}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t012}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={132} rotate={-7} pos={{ right: 56, top: 116 }} />
    </div>
  );
}
