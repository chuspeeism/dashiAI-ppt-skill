import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   MabaSlide — MABA 矩阵模型（AI 赛道投资版）.
   GE / McKinsey 九宫格：赛道吸引力 × 竞争实力，对角三区（投资 / 选择 / 收获）
   配色，气泡面积 ∝ 报告融资额。右侧把每个赛道气泡配一行投资读解（不再只讲三区），
   信息更密、更可用。报告数据：通用大模型 420 亿 / 垂直应用 245 亿 / 基础设施
   158 亿 / 芯片 97 亿 / 其他 50 亿。纯 props 驱动，可迁移。
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showAxis", label: "坐标轴标注", type: "toggle", default: true,
    help: "两轴（赛道吸引力 / 竞争实力）文字标注显示 / 隐藏" },
  { key: "showZones", label: "三区配色", type: "toggle", default: true,
    help: "投资 / 选择 / 收获 三个对角区的配色显示 / 隐藏" },
  { key: "bubbleCount", label: "赛道数量", type: "slider", default: 6, min: 1, max: 6, step: 1,
    help: "矩阵中展示的赛道气泡数量" },
  { key: "showReads", label: "赛道读解", type: "toggle", default: true,
    help: "右侧每个赛道一行投资读解显示 / 隐藏" },
  { key: "showAnalysis", label: "策略解读", type: "toggle", default: true,
    help: "底部重点结论条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个赛道气泡" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 5, step: 1,
    help: "被高亮的赛道序号（自动随赛道数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showAxis: true,
  showZones: true,
  bubbleCount: 6,
  showReads: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "战略模型 / MABA",
    t002: "赛道吸引力 × 竞争实力 · 气泡 ∝ 融资额",
    t003: "MABA 赛道矩阵",
    t004: "九宫格研判 AI 赛道投资优先级 · 把 970 亿配到对的格子",
    t005: "赛道吸引力 — 高 → 低",
    t006: "竞争实力 — 强 → 弱",
    t007: "各赛道投资读解 / READ-OUT",
    t008: "↳ 结论",
    t009: "垂直应用",
    t010: "与",
    t011: "基础设施",
    t012: "落在「投资区」——兑现确定性高，是组合的压舱石； 通用大模型吸引力虽高但竞争白热、风险并存，宜以头部集中、控制单一敞口；早期硬件位于「收获区」，控敞口、择优跟踪。",
  },
  bubbles: [
  { name: "通用大模型", amt: "420 亿", r: 0, c: 0, size: 1.0,  read: "资本最密集（43%），但算力成本高、差异化收窄——高投入高风险。" },
  { name: "垂直应用",   amt: "245 亿", r: 1, c: 0, size: 0.9,  read: "商业化路径渐清晰（25%），落地为王、兑现确定性最高。" },
  { name: "AI 基础设施", amt: "158 亿", r: 0, c: 1, size: 0.78, read: "「卖铲子」逻辑（16%），收入确定性高、贯穿全周期。" },
  { name: "AI 芯片",     amt: "97 亿",  r: 1, c: 1, size: 0.58, read: "上游硬件（10%），壁垒高、资本密集、回报周期长。" },
  { name: "工具 · 安全", amt: "50 亿",  r: 1, c: 2, size: 0.4,  read: "长尾概念（5%），方向成立但规模与盈利仍待验证。" },
  { name: "早期硬件",    amt: "—",      r: 2, c: 2, size: 0.34, read: "早期形态、规模未证，敞口宜控、择优跟踪。" },
  ],
  zones: [
  { label: "投资 / 增长", en: "INVEST",    color: COLORS.blue, strat: "资源倾斜，抢占市场份额" },
  { label: "选择 / 盈利", en: "SELECTIVE", color: "#aee21f",   strat: "选择性投入，维持现金流" },
  { label: "收获 / 退出", en: "HARVEST",   color: "#9a988f",   strat: "控制投入，收获或退出" },
  ],
  ...decorDefaults,
};

// row 0 = 吸引力高(top), col 0 = 实力强(left). size = 相对融资量级.




function zoneOf(r, c) {
  const score = (2 - r) + (2 - c); // 0..4
  if (score >= 3) return 0;
  if (score === 2) return 1;
  return 2;
}

export default function MabaSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const nb = Math.max(1, Math.min(p.bubbles.length, p.bubbleCount));
  const bubbles = p.bubbles.slice(0, nb);
  const fi = Math.min(p.focusIndex, nb - 1);

  const zoneFill = (zi) => {
    if (!p.showZones) return "transparent";
    if (zi === 0) return "rgba(39,66,236,0.10)";
    if (zi === 1) return "rgba(174,226,31,0.16)";
    return dark ? "rgba(243,242,238,0.04)" : "rgba(22,21,19,0.04)";
  };

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22, paddingBottom: 6 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 44, minHeight: 0 }}>
          {/* matrix block (y-axis + grid + x-axis) */}
          <div style={{ flex: 1.3, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ flex: 1, display: "flex", gap: 14, minHeight: 0 }}>
              {p.showAxis && (
                <div style={{ flex: "none", width: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="rd-mono" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: COLORS.ink2, fontSize: 20, letterSpacing: "0.08em" }}>{copy.t005}</span>
                </div>
              )}
              <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", border: `1.5px solid ${COLORS.ink}`, position: "relative" }}>
                {Array.from({ length: 9 }).map((_, idx) => {
                  const r = Math.floor(idx / 3), c = idx % 3;
                  const zi = zoneOf(r, c);
                  return (
                    <div key={idx} style={{
                      position: "relative", background: zoneFill(zi),
                      borderRight: c < 2 ? `1px solid ${COLORS.line}` : "none",
                      borderBottom: r < 2 ? `1px solid ${COLORS.line}` : "none",
                    }}>
                      <span className="rd-mono" style={{ position: "absolute", top: 8, left: 10, fontSize: 14, color: COLORS.ink3, opacity: 0.8 }}>{p.zones[zi].en}</span>
                    </div>
                  );
                })}
                {bubbles.map((b, i) => {
                  const hot = p.focusEnabled && i === fi;
                  const dim = p.focusEnabled && !hot;
                  const dia = 64 + b.size * 74;
                  const zi = zoneOf(b.r, b.c);
                  const fill = hot ? accent : p.zones[zi].color;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${((b.c + 0.5) / 3) * 100}%`, top: `${((b.r + 0.5) / 3) * 100}%`,
                      transform: "translate(-50%,-50%)", width: dia, height: dia, borderRadius: "50%",
                      background: zi === 1 ? "rgba(174,226,31,0.32)" : `${fill}2b`, border: `2.5px solid ${fill}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
                      opacity: dim ? 0.4 : 1, transition: "opacity .3s",
                      boxShadow: hot ? `0 0 0 6px rgba(39,66,236,0.14)` : "none", zIndex: hot ? 3 : 2,
                    }}>
                      <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 700, fontSize: 18, lineHeight: 1.1, color: COLORS.ink, padding: "0 6px" }}>{b.name}</span>
                      <span className="rd-mono" style={{ fontSize: 14, marginTop: 3, color: hot ? accent : COLORS.ink2 }}>{b.amt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {p.showAxis && (
              <div className="rd-mono" style={{ textAlign: "center", paddingTop: 10, paddingLeft: 44, color: COLORS.ink2, fontSize: 20, letterSpacing: "0.08em" }}>{copy.t006}</div>
            )}
          </div>

          {/* per-track read-out */}
          {p.showReads && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 40 }}>
              <div className="rd-mono" style={{ fontSize: 18, color: COLORS.ink3, marginBottom: 4 }}>{copy.t007}</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {bubbles.map((b, i) => {
                  const hot = p.focusEnabled && i === fi;
                  const dim = p.focusEnabled && !hot;
                  const zc = p.zones[zoneOf(b.r, b.c)].color;
                  return (
                    <div key={i} style={{
                      flex: 1, display: "flex", gap: 14, alignItems: "center",
                      borderBottom: i < nb - 1 ? `1px solid ${COLORS.line2}` : "none",
                      opacity: dim ? 0.45 : 1, transition: "opacity .3s",
                    }}>
                      <span style={{ width: 14, height: 14, flex: "none", background: hot ? accent : zc }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                          <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 23, color: hot ? accent : COLORS.ink, whiteSpace: "nowrap" }}>{b.name}</span>
                          <span className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3 }}>{b.amt}</span>
                        </div>
                        <p className="rd-cap" style={{ margin: "3px 0 0", fontSize: 18.5, lineHeight: 1.3 }}>{b.read}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* analysis */}
        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t008}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              <b style={{ color: accent, fontWeight: 700 }}>{copy.t009}</b>{copy.t010}<b style={{ color: accent, fontWeight: 700 }}>{copy.t011}</b>{copy.t012}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={6} pos={{ right: 50, top: 110 }} />
    </div>
  );
}
