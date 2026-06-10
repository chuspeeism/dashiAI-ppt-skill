import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ShareSlide — AI 占全美风险投资份额 (data: 报告摘要 — “约 970 亿美元，占美国全部
   风险投资的近三分之一”). A big-proportion ring + hero figure framing 2024 as
   the “资本大年”. Single share arc, supporting micro-stats. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showRing", label: "占比圆环", type: "toggle", default: true,
    help: "左侧占比圆环显示 / 隐藏（隐藏则仅留巨型数字）" },
  { key: "showSupport", label: "支撑微数据", type: "toggle", default: true,
    help: "右侧支撑性微数据列显示 / 隐藏" },
  { key: "statCount", label: "微数据条数", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "右侧支撑微数据的条数" },
  { key: "showNote", label: "口径注记", type: "toggle", default: true,
    help: "底部数据口径注记显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "占比环与巨型数字的强调色" },
  { key: "theme", label: "主题", type: "select", default: "dark",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showRing: true,
  showSupport: true,
  statCount: 3,
  showNote: true,
  accent: "blue",
  theme: "dark",
  // —— visible content (override per deck) ——
  eyebrow: "资本大年 / CAPITAL YEAR",
  kicker: "2024 · 美国 AI 风险投资",
  ringSymbol: "⅓",
  ringNote: "≈ 32% · 占全美风投",
  figureValue: "970",
  figureUnit: "亿美元",
  leadSegments: [
    { t: "2024 全年 AI 初创公司吸纳风险投资约 " },
    { t: "970 亿美元", b: true },
    { t: "，占美国全部风险投资的" },
    { t: "近三分之一", b: true },
    { t: "，是名副其实的“资本大年”。" },
  ],
  noteLabel: "口径",
  noteBody: "“近三分之一”为报告原文口径；970 亿为 2024 全年公开披露的 AI 风险投资合计。",
  stats: [
    { v: "历史新高", k: "全年 AI 风投同比创纪录" },
    { v: "97 笔", k: "单笔 ≥ 1 亿美元的大额事件" },
    { v: "≈ 10 亿", k: "平均单笔融资额（美元）" },
  ],
  ...decorDefaults,
};

export default function ShareSlide(props) {
  const p = { ...defaultProps, ...props };
  const STATS = p.stats || [];
  const dark = p.theme === "dark";
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const onAccentInk = p.accent === "lime" ? COLORS.ink : COLORS.blueInk;
  const ns = Math.max(0, Math.min(3, p.statCount));

  // ring geometry
  const S = 460, c = S / 2, r = 176, sw = 52;
  const C = 2 * Math.PI * r;
  const frac = 0.32; // ≈ 1/3
  const trackCol = dark ? "rgba(243,242,238,0.12)" : "rgba(22,21,19,0.10)";

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 72, minHeight: 0, paddingTop: 8 }}>
          {/* ring */}
          {p.showRing && (
            <div className="rd-anim rd-anim-2" style={{ flex: "none", width: S, height: S, position: "relative" }}>
              <svg viewBox={`0 0 ${S} ${S}`} style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx={c} cy={c} r={r} fill="none" stroke={trackCol} strokeWidth={sw} />
                <circle cx={c} cy={c} r={r} fill="none" stroke={accent} strokeWidth={sw}
                  strokeDasharray={`${frac * C} ${C}`} strokeLinecap="butt" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 132, lineHeight: 0.9, letterSpacing: "-0.03em", color: accent }}>{p.ringSymbol}</span>
                <span className="rd-mono" style={{ fontSize: 18, color: COLORS.ink2, marginTop: 12, letterSpacing: "0.08em" }}>{p.ringNote}</span>
              </div>
            </div>
          )}

          {/* hero + support */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="rd-anim rd-anim-2">
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 200, lineHeight: 0.82, letterSpacing: "-0.03em", color: COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{p.figureValue}</span>
                <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 56, color: accent }}>{p.figureUnit}</span>
              </div>
              <p className="rd-sub" style={{ marginTop: 18, color: COLORS.ink2, maxWidth: 760 }}>
                {p.leadSegments.map((s, i) => (
                  s.b ? <strong key={i} style={{ color: COLORS.ink }}>{s.t}</strong> : <React.Fragment key={i}>{s.t}</React.Fragment>
                ))}
              </p>
            </div>

            {p.showSupport && ns > 0 && (
              <div className="rd-anim rd-anim-3" style={{ display: "flex", gap: 0, marginTop: 40, borderTop: `1px solid ${COLORS.line}`, paddingTop: 26 }}>
                {STATS.slice(0, ns).map((s, i) => (
                  <div key={i} style={{ flex: 1, paddingRight: 24, marginRight: 24, borderRight: i < ns - 1 ? `1px solid ${COLORS.line2}` : "none" }}>
                    <div style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 46, color: accent, lineHeight: 1 }}>{s.v}</div>
                    <p className="rd-cap" style={{ margin: "10px 0 0", fontSize: 20 }}>{s.k}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {p.showNote && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ fontSize: 16, color: COLORS.ink3 }}>{p.noteLabel}</span>
            <span className="rd-mono" style={{ fontSize: 16, color: COLORS.ink3 }}>{p.noteBody}</span>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 56, top: 120 }} />
    </div>
  );
}
