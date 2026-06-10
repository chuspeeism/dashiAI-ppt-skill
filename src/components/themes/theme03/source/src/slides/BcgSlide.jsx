import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

// Per-quadrant glyph as a clean inline SVG (replaces the bare ★ ? $ ✕ text
// marks). Simple iconographic shapes only — star, question, dollar, decline.
function QuadIcon({ type, size = 24, color = "currentColor" }) {
  const sw = type === "star" ? 0 : 2.1;
  const base = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": true, style: { display: "block" },
  };
  switch (type) {
    case "star":
      return <svg {...base} fill={color}><path d="M12 2.5l2.7 6.6 7.1.5-5.4 4.6 1.7 6.9L12 17.8 5.9 21.1l1.7-6.9L2.2 9.6l7.1-.5z" /></svg>;
    case "question":
      return <svg {...base}><path d="M8.6 8.8a3.4 3.4 0 1 1 5 3c-1.1.7-1.6 1.3-1.6 2.6" /><circle cx="12" cy="18.4" r="1.15" fill={color} stroke="none" /></svg>;
    case "cash":
      return <svg {...base}><path d="M12 3.4v17.2" /><path d="M16.2 6.9c-.9-1.3-2.4-2.1-4-2.1-2.2 0-3.9 1.2-3.9 3 0 1.7 1.4 2.5 4.1 3 2.6.5 4.1 1.4 4.1 3.2 0 1.9-1.8 3.1-4.3 3.1-1.8 0-3.4-.8-4.3-2.1" /></svg>;
    case "dog":
    default:
      return <svg {...base}><path d="M6 6l12 12" /><path d="M11 18h7v-7" /></svg>;
  }
}

/* ============================================================================
   BcgSlide — 波士顿矩阵 (BCG Growth–Share Matrix).
   2×2 plot: market growth (y, high→low) × relative market share (x, high→low).
   Quadrants = 明星 / 问题 / 现金牛 / 瘦狗, each tinted + watermarked; business
   units are plotted as size-weighted bubbles. Right panel mirrors the four
   quadrants with their portfolio strategy. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showAxis", label: "坐标轴标注", type: "toggle", default: true,
    help: "两轴（市场增长率 / 相对市场份额）文字标注显示 / 隐藏" },
  { key: "showQuadLabel", label: "象限水印", type: "toggle", default: true,
    help: "各象限的名称 + 巨型水印符号显示 / 隐藏" },
  { key: "showEmblem", label: "3D 象限元素", type: "toggle", default: true,
    help: "用 3D 元素作为四象限标识（明星 / 问题 / 现金牛 / 瘦狗）；关闭则用简洁图标（需宿主提供 3D 素材，保持可迁移）" },
  { key: "bubbleCount", label: "气泡数量", type: "slider", default: 6, min: 1, max: 6, step: 1,
    help: "矩阵中展示的业务气泡数量" },
  { key: "showPanel", label: "策略面板", type: "toggle", default: true,
    help: "右侧四象限策略 + 重点结论显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个象限（同时点亮落在其中的气泡）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 3, step: 1,
    help: "被高亮的象限序号（0 明星 · 1 问题 · 2 现金牛 · 3 瘦狗）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showAxis: true,
  showQuadLabel: true,
  showEmblem: true,
  quadIcons: null,
  bubbleCount: 6,
  showPanel: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "战略模型 / BCG",
  kicker: "增长率 × 相对市场份额",
  title: "波士顿矩阵",
  subtitle: "业务组合定位 · 现金流与增长的平衡",
  yAxisLabel: "市场增长率 — 高 → 低",
  xAxisLabel: "相对市场份额 — 高 → 低",
  panelTitle: "四象限策略 / STRATEGY",
  conclusionLabel: "↳ 结论",
  conclusionBody: "用现金牛的盈余去喂养明星、孵化问题业务，让组合形成「造血—增长」的良性循环。",
  // quadrant order: 0 TL star, 1 TR question, 2 BL cow, 3 BR dog
  quads: [
    { cn: "明星", en: "STAR",          icon: "star",     side: "高增长 · 高份额", accent: "#2742ec", strat: "加大投入，保持领先地位" },
    { cn: "问题", en: "QUESTION MARK", icon: "question", side: "高增长 · 低份额", accent: "#b8821a", strat: "选择性投入，择优育成明星" },
    { cn: "现金牛", en: "CASH COW",    icon: "cash",     side: "低增长 · 高份额", accent: "#5f8f0c", strat: "收割现金流，反哺增长业务" },
    { cn: "瘦狗", en: "DOG",           icon: "dog",      side: "低增长 · 低份额", accent: "#b04a2f", strat: "控制投入，适时收缩退出" },
  ],
  quadDarkAccents: ["#6e85ff", "#d8a43c", "#9ccb3a", "#e07a5a"],
  // gx: 0 = high share (left) → 1 low; gy: 0 = high growth (top) → 1 low. size: weight.
  bubbles: [
    { name: "通用大模型", gx: 0.22, gy: 0.20, size: 1.0,  q: 0 },
    { name: "算力设施",   gx: 0.32, gy: 0.36, size: 0.9,  q: 0 },
    { name: "企业级应用", gx: 0.70, gy: 0.26, size: 0.6,  q: 1 },
    { name: "垂直方案",   gx: 0.78, gy: 0.42, size: 0.5,  q: 1 },
    { name: "云服务",     gx: 0.26, gy: 0.74, size: 0.85, q: 2 },
    { name: "早期硬件",   gx: 0.78, gy: 0.79, size: 0.42, q: 3 },
  ],
  ...decorDefaults,
};

export default function BcgSlide(props) {
  const p = { ...defaultProps, ...props };
  const dark = p.theme === "dark";
  const QUAD_T = p.quads.map((q, i) => ({ ...q, accent: dark ? (p.quadDarkAccents[i] || q.accent) : q.accent }));
  const fi = Math.min(Math.max(0, p.focusIndex), 3);
  const nb = Math.max(1, Math.min(p.bubbles.length, p.bubbleCount));
  const bubbles = p.bubbles.slice(0, nb);
  // 3D quadrant emblems are injected via props (portable — no hard-coded paths);
  // when absent, fall back to the clean inline SVG glyphs.
  const emblems = Array.isArray(p.quadIcons) ? p.quadIcons : [];
  const useEmblem = (i) => p.showEmblem && !!emblems[i];

  const tint = (i) => {
    const a = QUAD_T[i].accent;
    return p.focusEnabled && i !== fi ? "transparent"
      : `${a}${i === 0 ? "1c" : i === 3 ? "12" : "18"}`;
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
          <span className="rd-cap">{p.subtitle}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 44, minHeight: 0 }}>
          {/* matrix block */}
          <div style={{ flex: 1.45, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ flex: 1, display: "flex", gap: 14, minHeight: 0 }}>
              {p.showAxis && (
                <div style={{ flex: "none", width: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="rd-mono" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: COLORS.ink2, fontSize: 20, letterSpacing: "0.08em" }}>{p.yAxisLabel}</span>
                </div>
              )}
              <div className="rd-anim rd-anim-3" style={{ flex: 1, position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", border: `1.5px solid ${COLORS.ink}` }}>
                {QUAD_T.map((q, i) => {
                  const c = i % 2, r = Math.floor(i / 2);
                  const dim = p.focusEnabled && i !== fi;
                  return (
                    <div key={i} style={{
                      position: "relative", overflow: "hidden", background: tint(i),
                      borderRight: c < 1 ? `1px solid ${COLORS.ink}` : "none",
                      borderBottom: r < 1 ? `1px solid ${COLORS.ink}` : "none",
                      opacity: dim ? 0.5 : 1, transition: "opacity .3s, background .3s",
                    }}>
                      {p.showQuadLabel && (
                        useEmblem(i) ? (
                          <img src={emblems[i]} alt="" aria-hidden="true" style={{ position: "absolute", right: -40, bottom: -30, width: 170, height: "auto", opacity: dim ? 0.5 : 1, pointerEvents: "none", filter: "drop-shadow(0 14px 18px rgba(22,21,19,0.26))" }} />
                        ) : (
                          <div style={{ position: "absolute", right: 14, bottom: 12, width: 116, height: 116, opacity: 0.14, pointerEvents: "none" }}>
                            <QuadIcon type={q.icon} size={116} color={q.accent} />
                          </div>
                        )
                      )}
                      <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "baseline", gap: 9 }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 26, color: q.accent }}>{q.cn}</span>
                        <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3 }}>{q.en}</span>
                      </div>
                    </div>
                  );
                })}
                {/* bubbles */}
                {bubbles.map((b, i) => {
                  const hot = p.focusEnabled && b.q === fi;
                  const dim = p.focusEnabled && !hot;
                  const dia = 58 + b.size * 70;
                  const a = QUAD_T[b.q].accent;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${b.gx * 100}%`, top: `${b.gy * 100}%`,
                      transform: "translate(-50%,-50%)", width: dia, height: dia, borderRadius: "50%",
                      background: `${a}2e`, border: `2.5px solid ${a}`,
                      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                      opacity: dim ? 0.35 : 1, transition: "opacity .3s",
                      boxShadow: hot ? `0 0 0 6px ${a}24` : "none", zIndex: hot ? 3 : 2,
                    }}>
                      <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 700, fontSize: 17, lineHeight: 1.12, color: COLORS.ink, padding: "0 6px" }}>{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {p.showAxis && (
              <div className="rd-mono" style={{ textAlign: "center", paddingTop: 10, paddingLeft: 44, color: COLORS.ink2, fontSize: 20, letterSpacing: "0.08em" }}>{p.xAxisLabel}</div>
            )}
          </div>

          {/* strategy panel */}
          {p.showPanel && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 40 }}>
              <div className="rd-mono" style={{ fontSize: 19, color: COLORS.ink3, marginBottom: 12 }}>{p.panelTitle}</div>
              {QUAD_T.map((q, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: 13, marginBottom: 13, borderBottom: i < 3 ? `1px solid ${COLORS.line2}` : "none", opacity: dim ? 0.4 : 1, transition: "opacity .3s" }}>
                    {useEmblem(i) ? (
                      <img src={emblems[i]} alt="" aria-hidden="true" style={{ width: 50, height: 50, flex: "none", marginTop: 0, objectFit: "contain", filter: "drop-shadow(0 6px 9px rgba(22,21,19,0.2))" }} />
                    ) : (
                      <span style={{ width: 30, height: 30, flex: "none", marginTop: 2, background: hot ? q.accent : `${q.accent}26`, border: `2px solid ${q.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}><QuadIcon type={q.icon} size={17} color={hot ? "#fff" : q.accent} /></span>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 24, color: COLORS.ink }}>{q.cn}</span>
                        <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3 }}>{q.side}</span>
                      </div>
                      <p className="rd-cap" style={{ margin: "3px 0 0", fontSize: 19 }}>{q.strat}</p>
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-start", gap: 14, paddingTop: 14, borderTop: `2px solid ${COLORS.ink}` }}>
                <span className="rd-mono" style={{ color: COLORS.blue, flex: "none", marginTop: 2 }}>{p.conclusionLabel}</span>
                <p className="rd-cap" style={{ margin: 0, fontSize: 20 }}>
                  {p.conclusionBody}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={128} rotate={7} pos={{ right: 50, top: 116 }} />
    </div>
  );
}
