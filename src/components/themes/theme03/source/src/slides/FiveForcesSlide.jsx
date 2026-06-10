import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   FiveForcesSlide — 波特五力模型 (Porter's Five Forces).
   A central "industry rivalry" node pressured by four surrounding forces
   (new entrants ↑, substitutes ↓, suppliers ←, buyers →). Arrows converge on
   the centre; each force carries a 3-segment intensity meter. Fixed 1680px
   content width (slide renders at native 1920 then scales) → px geometry is
   exact and arrows line up with the cards. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showArrows", label: "传导箭头", type: "toggle", default: true,
    help: "四方力量指向中心的箭头显示 / 隐藏" },
  { key: "showMeter", label: "强度标尺", type: "toggle", default: true,
    help: "各力量的强弱标尺（高 / 中 / 低）显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一股力量（含中心同业竞争）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的力量序号（0 同业竞争 · 1 新进入者 · 2 替代品 · 3 供应商 · 4 购买方）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showArrows: true,
  showMeter: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "核心",
    t002: "竞争分析 / FIVE FORCES",
    t003: "五力 · 行业结构与盈利能力",
    t004: "波特五力模型",
    t005: "从五股力量研判行业吸引力与议价格局",
    t006: "↳ 解读",
    t007: "五力越强、行业平均盈利越被挤压。分析的目的不是描述现状，而是找到「改变力量对比」的着力点—— 抬高进入壁垒、降低对单一供应商的依赖、用差异化削弱买方议价与替代威胁，从而把行业结构往有利方向重塑。",
  },
  center: { cn: "现有竞争者", en: "COMPETITIVE RIVALRY", desc: "同业竞争激烈程度 · 五力交汇的核心", lvl: 3 },
  forces: [
  { cn: "新进入者威胁", en: "NEW ENTRANTS",  desc: "进入壁垒 · 规模与资本门槛", lvl: 2 },   // top
  { cn: "购买方议价",  en: "BUYER POWER",    desc: "客户集中度 · 转换成本高低", lvl: 1 },   // right
  { cn: "替代品威胁",  en: "SUBSTITUTES",    desc: "替代方案 · 性价比与迁移意愿", lvl: 3 },  // bottom
  { cn: "供应商议价",  en: "SUPPLIER POWER", desc: "上游集中度 · 关键资源稀缺性", lvl: 2 },  // left
],
  meterLabel: "强度",
  levelLabels: ["低", "中", "高"],
  ...decorDefaults,
};

// idx 0 = centre, 1=top, 2=right, 3=bottom, 4=left


function Meter({ lvl, hot, label, levelLabels }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
      <span className="rd-mono" style={{ fontSize: 14, color: hot ? "rgba(255,255,255,0.8)" : COLORS.ink3 }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((s) => (
          <span key={s} style={{ width: 22, height: 7, background: s < lvl ? (hot ? "#fff" : COLORS.blue) : (hot ? "rgba(255,255,255,0.28)" : COLORS.line2) }} />
        ))}
      </div>
      <span className="rd-mono" style={{ fontSize: 14, color: hot ? "#fff" : COLORS.ink2 }}>{levelLabels[lvl - 1]}</span>
    </div>
  );
}

export default function FiveForcesSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const fi = Math.min(Math.max(0, p.focusIndex), 4);
  const arrowCol = dark ? "#84827c" : COLORS.ink3;

  // px geometry inside the fixed 1680-wide content column
  const W = 1680, H = 600;
  const cardW = 380, cardH = 168, centerW = 420, centerH = 196;

  const Card = ({ data, idx, x, y, w, h }) => {
    const hot = p.focusEnabled && idx === fi;
    const dim = p.focusEnabled && !hot;
    const center = idx === 0;
    return (
      <div style={{
        position: "absolute", left: x, top: y, width: w, height: h,
        background: hot ? COLORS.blue : (center ? (dark ? "rgba(243,242,238,0.06)" : "#fff") : "transparent"),
        border: center ? `3px solid ${hot ? COLORS.blue : COLORS.ink}` : `2px solid ${hot ? COLORS.blue : COLORS.line}`,
        padding: center ? "26px 30px" : "20px 24px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        opacity: dim ? 0.42 : 1, transition: "opacity .3s, background .3s", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: center ? 38 : 28, color: hot ? "#fff" : (center ? COLORS.ink : COLORS.ink) }}>{data.cn}</span>
          {center && <span className="rd-tag" style={{ background: hot ? "#fff" : COLORS.blue, color: hot ? COLORS.blue : COLORS.blueInk, fontSize: 15, padding: "6px 9px" }}>{copy.t001}</span>}
        </div>
        <span className="rd-mono" style={{ fontSize: center ? 17 : 15, color: hot ? "rgba(255,255,255,0.85)" : COLORS.ink3, marginTop: 4 }}>{data.en}</span>
        <p className="rd-cap" style={{ margin: "8px 0 0", fontSize: center ? 21 : 19, color: hot ? "rgba(255,255,255,0.92)" : COLORS.ink2 }}>{data.desc}</p>
        {p.showMeter && <Meter lvl={data.lvl} hot={hot} label={p.meterLabel} levelLabels={p.levelLabels} />}
      </div>
    );
  };

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t002}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t003}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{copy.t004}</h2>
          <span className="rd-cap">{copy.t005}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ position: "relative", width: W, height: H, margin: "24px auto 0" }}>
          {/* arrow layer — converges on the centre */}
          {p.showArrows && (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, overflow: "visible" }}>
              <defs>
                <marker id="ff-arrow" markerWidth="11" markerHeight="11" refX="7" refY="5" orient="auto">
                  <path d="M0,0 L9,5 L0,10 Z" fill={arrowCol} />
                </marker>
              </defs>
              {/* top → center */}
              <line x1={W / 2} y1={cardH} x2={W / 2} y2={(H - centerH) / 2 - 14} stroke={arrowCol} strokeWidth="2.5" markerEnd="url(#ff-arrow)" />
              {/* bottom → center */}
              <line x1={W / 2} y1={H - cardH} x2={W / 2} y2={(H + centerH) / 2 + 14} stroke={arrowCol} strokeWidth="2.5" markerEnd="url(#ff-arrow)" />
              {/* left → center */}
              <line x1={cardW} y1={H / 2} x2={(W - centerW) / 2 - 14} y2={H / 2} stroke={arrowCol} strokeWidth="2.5" markerEnd="url(#ff-arrow)" />
              {/* right → center */}
              <line x1={W - cardW} y1={H / 2} x2={(W + centerW) / 2 + 14} y2={H / 2} stroke={arrowCol} strokeWidth="2.5" markerEnd="url(#ff-arrow)" />
            </svg>
          )}

          {/* centre */}
          <Card data={p.center} idx={0} x={(W - centerW) / 2} y={(H - centerH) / 2} w={centerW} h={centerH} />
          {/* top */}
          <Card data={p.forces[0]} idx={1} x={(W - cardW) / 2} y={0} w={cardW} h={cardH} />
          {/* right */}
          <Card data={p.forces[1]} idx={2} x={W - cardW} y={(H - cardH) / 2} w={cardW} h={cardH} />
          {/* bottom */}
          <Card data={p.forces[2]} idx={3} x={(W - cardW) / 2} y={H - cardH} w={cardW} h={cardH} />
          {/* left */}
          <Card data={p.forces[3]} idx={4} x={0} y={(H - cardH) / 2} w={cardW} h={cardH} />
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t006}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t007}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 40, top: 108 }} />
    </div>
  );
}
