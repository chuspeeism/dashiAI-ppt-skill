import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   FlywheelSlide — 飞轮模型 (Growth Flywheel).
   A closed loop of reinforcing stages arranged on a ring; clockwise arcs show
   momentum compounding back into itself, with a central hub. Stage count is
   tunable and node positions are computed with polar geometry so any count
   stays evenly spaced. A side legend mirrors the ring. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "stageCount", label: "环节数量", type: "slider", default: 6, min: 4, max: 6, step: 1,
    help: "飞轮上的环节数量（沿环均匀分布）" },
  { key: "showArrows", label: "传导箭头", type: "toggle", default: true,
    help: "环节之间顺时针的循环箭头显示 / 隐藏" },
  { key: "showLegend", label: "环节解读", type: "toggle", default: true,
    help: "右侧各环节名称 + 释义列表显示 / 隐藏" },
  { key: "showHub", label: "中心枢纽", type: "toggle", default: true,
    help: "飞轮中心的「增长飞轮」枢纽显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个环节" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 5, step: 1,
    help: "被高亮的环节序号（自动随环节数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  stageCount: 6,
  showArrows: true,
  showLegend: true,
  showHub: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "增长模型 / FLYWHEEL",
    t002: "自我强化 · 越转越快",
    t003: "飞轮模型",
    t004: "环环相扣 · 让每个环节都为下一环加速",
    t005: "增长飞轮",
    t006: "FLYWHEEL",
    t007: "↳ 解读",
    t008: "飞轮没有起点，关键是找到能持续发力的一两个环节、把阻力降到最低。前期推动很费力， 但一旦每一圈都把动能传给下一环，增长就会自我强化、越转越快——复利效应正源于此。",
  },
  stages: [
  { cn: "优质供给", en: "SELECTION",  note: "更丰富的产品与内容供给" },
  { cn: "体验提升", en: "EXPERIENCE", note: "更优的体验赢得用户口碑" },
  { cn: "流量增长", en: "TRAFFIC",    note: "访问量与用户规模扩大" },
  { cn: "生态扩张", en: "ECOSYSTEM",  note: "更多伙伴与供给方加入" },
  { cn: "规模效应", en: "SCALE",      note: "规模摊薄单位成本结构" },
  { cn: "成本下降", en: "LOWER COST", note: "成本与价格持续优化" },
  ],
  ...decorDefaults,
};



export default function FlywheelSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const n = Math.min(Math.max(4, p.stageCount), 6);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const stages = p.stages.slice(0, n);

  // ring geometry (fixed px box → exact)
  const W = 720, H = 632, cx = 360, cy = 316, R = 232, node = 116, hub = 188;
  const polar = (r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const step = 360 / n;
  const gap = 19;
  const arrowCol = dark ? "#84827c" : COLORS.ink3;

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

        <div style={{ flex: 1, display: "flex", gap: 40, minHeight: 0, alignItems: "center" }}>
          {/* the wheel */}
          <div className="rd-anim rd-anim-3" style={{ flex: p.showLegend ? "none" : 1, width: W, height: H, position: "relative", margin: p.showLegend ? "0" : "0 auto" }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <defs>
                <marker id="fw-arrow" markerWidth="12" markerHeight="12" refX="7" refY="5" orient="auto">
                  <path d="M0,0 L9,5 L0,10 Z" fill={arrowCol} />
                </marker>
              </defs>
              {/* faint guide ring */}
              <circle cx={cx} cy={cy} r={R} fill="none" stroke={COLORS.line2} strokeWidth="2" />
              {/* momentum arcs between consecutive nodes */}
              {p.showArrows && stages.map((_, i) => {
                const a = polar(R, i * step + gap);
                const b = polar(R, (i + 1) * step - gap);
                const hot = p.focusEnabled && (i === fi);
                return (
                  <path key={i} d={`M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`}
                    fill="none" stroke={hot ? accent : arrowCol} strokeWidth={hot ? 4 : 2.6}
                    markerEnd="url(#fw-arrow)" style={{ transition: "stroke .3s" }} />
                );
              })}
            </svg>

            {/* hub */}
            {p.showHub && (
              <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", width: hub, height: hub, borderRadius: "50%", background: dark ? "rgba(243,242,238,0.06)" : "#fff", border: `3px solid ${COLORS.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 34, color: COLORS.ink, lineHeight: 1 }}>{copy.t005}</span>
                <span className="rd-mono" style={{ fontSize: 14, color: COLORS.ink3, marginTop: 8 }}>{copy.t006}</span>
                <div style={{ width: 40, height: 4, background: accent, marginTop: 10 }} />
              </div>
            )}

            {/* nodes */}
            {stages.map((s, i) => {
              const pos = polar(R, i * step);
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return (
                <div key={i} style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", width: node, height: node, borderRadius: "50%", background: hot ? accent : (dark ? "#211f1c" : "#ecebe7"), border: `2.5px solid ${hot ? accent : COLORS.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: dim ? 0.42 : 1, transition: "opacity .3s, background .3s", boxShadow: hot ? `0 10px 24px ${accent}3a` : "none", zIndex: 2 }}>
                  <span className="rd-mono" style={{ fontSize: 13, color: hot ? "rgba(255,255,255,0.8)" : COLORS.ink3, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 21, color: hot ? "#fff" : COLORS.ink, marginTop: 5, lineHeight: 1.05 }}>{s.cn}</span>
                </div>
              );
            })}
          </div>

          {/* legend */}
          {p.showLegend && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 40 }}>
              {stages.map((s, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "12px 0", borderBottom: i < n - 1 ? `1px solid ${COLORS.line2}` : "none", opacity: dim ? 0.4 : 1, transition: "opacity .3s" }}>
                    <span style={{ flex: "none", width: 34, height: 34, borderRadius: "50%", background: hot ? accent : "transparent", border: `2px solid ${hot ? accent : COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--rd-mono)", fontWeight: 700, fontSize: 16, color: hot ? "#fff" : COLORS.ink }}>{i + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 24, color: COLORS.ink }}>{s.cn}</span>
                        <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3 }}>{s.en}</span>
                      </div>
                      <p className="rd-cap" style={{ margin: "2px 0 0", fontSize: 19 }}>{s.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t007}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t008}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={9} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
