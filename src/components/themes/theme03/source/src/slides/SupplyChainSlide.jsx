import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   SupplyChainSlide — 算力供应链「卡脖子」(data: 报告 6.1 + 5.3 CoreWeave).
   A left-to-right constraint pipeline (供应紧张 → 出口管制 → 成本高企 → 难承受)
   with a winner band (CoreWeave 长约锁定算力). Text verbatim. Pure / portable —
   stage count, connectors, winner band, focus are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "stageCount", label: "环节数量", type: "slider", default: 4, min: 2, max: 4, step: 1,
    help: "供应链约束环节数量" },
  { key: "showConnector", label: "传导箭头", type: "toggle", default: true,
    help: "环节之间的传导箭头显示 / 隐藏" },
  { key: "showWinner", label: "赢家条", type: "toggle", default: true,
    help: "底部「卖铲子赢家 · CoreWeave」条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个约束环节（默认瓶颈）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 1, min: 0, max: 3, step: 1,
    help: "被高亮的环节序号（自动随环节数量收敛）" },
  { key: "showCallout", label: "结构解读", type: "toggle", default: true,
    help: "底部「卖铲子」逻辑解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  stageCount: 4,
  showConnector: true,
  showWinner: true,
  focusEnabled: true,
  focusIndex: 1,
  showCallout: true,
  theme: "light",
  copy: {
    t001: "风险研判 / SUPPLY CHAIN",
    t002: "报告 6.1 · 算力「卡脖子」",
    t003: "算力供应链的瓶颈",
    t004: "从 GPU 紧缺到中小出清 · 一条约束传导链",
    t005: "◆ 瓶颈所在",
    t006: "卖铲赢家",
    t007: "CoreWeave",
    t008: "与 NVIDIA 签长约、手握数万张 H100 / H200，成为 OpenAI、Stability 的核心算力供应商—— 当所有人抢 GPU，提前锁定算力的人反而成了稀缺标的。",
    t009: "↳ 卖铲子逻辑",
    t010: "算力是这轮 AI 的硬约束——卡脖子越紧，越凸显上游\"卖铲子\"环节的确定性溢价。",
  },
  stages: [
  { tag: "供给", title: "NVIDIA GPU 供应紧张", note: "高端算力卡产能受限" },
  { tag: "政策", title: "对华出口管制加码", note: "可用算力进一步收窄" },
  { tag: "成本", title: "算力成本居高不下", note: "训练 / 推理开销攀升" },
  { tag: "出清", title: "中小公司难以承受", note: "长期烧钱被迫退出" },
  ],
  ...decorDefaults,
};



export default function SupplyChainSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const danger = dark ? "#e07a5a" : "#b04a2f";
  const n = Math.max(2, Math.min(p.stages.length, p.stageCount));
  const list = p.stages.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const cardBg = dark ? "rgba(243,242,238,0.05)" : "rgba(22,21,19,0.04)";

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

        {/* pipeline */}
        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 30, display: "flex", alignItems: "stretch", gap: 0 }}>
          {list.map((s, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <React.Fragment key={i}>
                <div style={{
                  flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
                  border: `2px solid ${hot ? danger : COLORS.ink}`,
                  background: hot ? (dark ? "rgba(224,122,90,0.14)" : "rgba(176,74,47,0.07)") : cardBg,
                  padding: "26px 24px", opacity: dim ? 0.55 : 1,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="rd-mono" style={{ fontSize: 14, letterSpacing: "0.08em", color: hot ? danger : axisCol, textTransform: "uppercase" }}>{s.tag}</span>
                    <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 30, color: hot ? danger : COLORS.ink3, fontFeatureSettings: '"tnum" 1' }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 27, lineHeight: 1.18, letterSpacing: "-0.01em", color: COLORS.ink, marginTop: 18 }}>{s.title}</div>
                  <div className="rd-cap" style={{ fontSize: 18, marginTop: "auto", paddingTop: 16 }}>{s.note}</div>
                  {hot && <div style={{ marginTop: 14, fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: danger, textTransform: "uppercase" }}>{copy.t005}</div>}
                </div>
                {p.showConnector && i < n - 1 && (
                  <div style={{ flex: "0 0 54px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 34, color: axisCol }}>▸</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* winner band */}
        {p.showWinner && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 22, padding: "20px 26px", borderLeft: `8px solid ${COLORS.lime}`, background: dark ? "rgba(194,245,61,0.10)" : "rgba(194,245,61,0.18)" }}>
            <span style={{ flex: "none", fontFamily: FONTS.sans, fontWeight: 800, fontSize: 22, color: "#161513", background: COLORS.lime, padding: "8px 14px" }}>{copy.t006}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21, color: COLORS.ink }}>
              <strong style={{ fontWeight: 800 }}>{copy.t007}</strong>{copy.t008}</p>
          </div>
        )}

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t009}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 20 }}>{copy.t010}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={112} rotate={-7} pos={{ right: 44, top: 100 }} />
    </div>
  );
}
