import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   JourneySlide — 用户旅程地图 (Customer Journey Map).
   Stages run left→right; for each, a behaviour card, a shared emotion curve
   (SVG, peaks/dips across the journey), and an opportunity card. The curve's
   x positions are locked to the stage-grid column centres (fixed 1680px
   content width → exact alignment). Tunable stage count + per-stage focus.
   Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "stageCount", label: "阶段数量", type: "slider", default: 5, min: 3, max: 5, step: 1,
    help: "旅程阶段数量" },
  { key: "showBehaviour", label: "用户行为", type: "toggle", default: true,
    help: "各阶段「用户行为」行显示 / 隐藏" },
  { key: "showCurve", label: "情绪曲线", type: "toggle", default: true,
    help: "贯穿各阶段的情绪曲线显示 / 隐藏" },
  { key: "showOpportunity", label: "机会点", type: "toggle", default: true,
    help: "各阶段「机会点」行显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个阶段" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 4, step: 1,
    help: "被高亮的阶段序号（自动随阶段数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  stageCount: 5,
  showBehaviour: true,
  showCurve: true,
  showOpportunity: true,
  focusEnabled: false,
  focusIndex: 2,
  theme: "light",
  copy: {
    t001: "体验设计 / JOURNEY MAP",
    t002: "阶段 · 行为 · 情绪 · 机会",
    t003: "用户旅程地图",
    t004: "沿全旅程还原体验起伏，定位关键时刻与机会点",
    t005: "0",
    t006: "用户行为",
    t007: "情绪曲线 · 高 ↑ / 低 ↓",
    t008: "↳ 机会点",
  },
  stages: [
  { cn: "认知", en: "AWARE",    behaviour: "广告 / 口碑触达，初次建立印象", score: 0.55, mood: "好奇", opp: "精准触达 · 内容种草" },
  { cn: "考虑", en: "CONSIDER", behaviour: "横向比价、查评测，反复犹豫", score: 0.32, mood: "纠结", opp: "场景化案例 · 打消疑虑" },
  { cn: "转化", en: "CONVERT",  behaviour: "注册下单 / 开通付费", score: 0.72, mood: "期待", opp: "简化流程 · 限时激励" },
  { cn: "使用", en: "USE",      behaviour: "上手体验，遇阻时求助客服", score: 0.48, mood: "考验", opp: "引导上手 · 主动关怀" },
  { cn: "拥护", en: "ADVOCATE", behaviour: "复购续费，主动推荐分享", score: 0.92, mood: "认同", opp: "会员体系 · 裂变激励" },
  ],
  ...decorDefaults,
};



export default function JourneySlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const n = Math.min(Math.max(3, p.stageCount), 5);
  const stages = p.stages.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);

  // emotion curve in a 100×100 viewBox (preserveAspectRatio="none") so it
  // stretches to fill a flexible band; HTML-overlay dots stay perfectly round.
  const xPct = (i) => ((i + 0.5) / n) * 100;
  const yPct = (s) => 14 + (1 - s) * 64;     // band 14→78 for score 1→0
  const linePath = stages.map((s, i) => `${i === 0 ? "M" : "L"}${xPct(i).toFixed(2)},${yPct(s.score).toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L${xPct(n - 1).toFixed(2)},90 L${xPct(0).toFixed(2)},90 Z`;

  const colStyle = { display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 14 };

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

        {/* stage headers */}
        <div className="rd-anim rd-anim-3" style={{ ...colStyle, marginTop: 24 }}>
          {stages.map((s, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={i} style={{ padding: "12px 16px", background: hot ? COLORS.blue : "transparent", borderTop: `3px solid ${hot ? COLORS.blue : COLORS.ink}`, opacity: dim ? 0.42 : 1, transition: "opacity .3s, background .3s" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="rd-mono" style={{ fontSize: 16, color: hot ? "rgba(255,255,255,0.85)" : COLORS.ink3 }}>{copy.t005}{i + 1}</span>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 30, color: hot ? "#fff" : COLORS.ink }}>{s.cn}</span>
                </div>
                <span className="rd-mono" style={{ fontSize: 14, color: hot ? "rgba(255,255,255,0.78)" : COLORS.ink3 }}>{s.en}</span>
              </div>
            );
          })}
        </div>

        {/* behaviour row */}
        {p.showBehaviour && (
          <div className="rd-anim rd-anim-3" style={{ ...colStyle, marginTop: 14 }}>
            {stages.map((s, i) => {
              const dim = p.focusEnabled && i !== fi;
              return (
                <div key={i} style={{ opacity: dim ? 0.42 : 1, transition: "opacity .3s" }}>
                  <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3 }}>{copy.t006}</span>
                  <p className="rd-cap" style={{ margin: "5px 0 0", fontSize: 19, lineHeight: 1.4 }}>{s.behaviour}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* emotion curve — flexible hero band that fills remaining height */}
        {p.showCurve && (
          <div className="rd-anim rd-anim-4" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", marginTop: 20 }}>
            <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3, marginBottom: 8 }}>{copy.t007}</span>
            <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                <defs>
                  <linearGradient id="journeyArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.24" />
                    <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {[1, 0.5, 0].map((g, k) => (
                  <line key={k} x1="0" y1={yPct(g)} x2="100" y2={yPct(g)} stroke={COLORS.line2} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray={g === 0.5 ? "4 7" : "0"} />
                ))}
                <path d={areaPath} fill="url(#journeyArea)" />
                <path d={linePath} fill="none" stroke={COLORS.blue} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              {/* dots + mood labels (HTML overlay keeps them circular & crisp) */}
              {stages.map((s, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{ position: "absolute", left: `${xPct(i)}%`, top: `${yPct(s.score)}%`, transform: "translate(-50%,-50%)", opacity: dim ? 0.5 : 1, transition: "opacity .3s" }}>
                    <span className="rd-mono" style={{ position: "absolute", bottom: "calc(100% + 9px)", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 18, color: hot ? COLORS.blue : COLORS.ink2 }}>{s.mood}</span>
                    <span style={{ display: "block", width: hot ? 26 : 18, height: hot ? 26 : 18, borderRadius: "50%", background: hot ? COLORS.blue : (dark ? "#161513" : "#fff"), border: `3px solid ${COLORS.blue}`, boxShadow: hot ? `0 0 0 6px ${COLORS.blue}22` : "none" }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* opportunity row */}
        {p.showOpportunity && (
          <div className="rd-anim rd-anim-4" style={{ ...colStyle, marginTop: 18 }}>
            {stages.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return (
                <div key={i} style={{ padding: "12px 16px", background: dark ? "rgba(243,242,238,0.05)" : "rgba(255,255,255,0.55)", borderLeft: `3px solid ${hot ? COLORS.blue : "#5f8f0c"}`, opacity: dim ? 0.42 : 1, transition: "opacity .3s" }}>
                  <span className="rd-mono" style={{ fontSize: 13, color: "#5f8f0c" }}>{copy.t008}</span>
                  <p style={{ margin: "5px 0 0", fontSize: 19, lineHeight: 1.35, fontWeight: 600, color: COLORS.ink }}>{s.opp}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={7} pos={{ right: 48, top: 110 }} />
    </div>
  );
}
