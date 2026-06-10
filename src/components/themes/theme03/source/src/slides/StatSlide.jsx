import React from "react";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   StatSlide — 大数字 / 核心数据 (oversized figure statement).
   One headline metric rendered huge, with optional unit, supporting copy, and
   a micro-stat cluster. Light / dark theme. Pure presentational, props-driven.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "巨型数字使用的强调色" },
  { key: "showUnit", label: "数字单位", type: "toggle", default: true,
    help: "巨型数字后缀单位（如 %）显示 / 隐藏" },
  { key: "showSupport", label: "辅助说明", type: "toggle", default: true,
    help: "右侧辅助解读文案显示 / 隐藏" },
  { key: "statCount", label: "佐证数据", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "底部佐证微数据的数量（0 为隐藏）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  accent: "blue",
  showUnit: true,
  showSupport: true,
  statCount: 3,
  copy: {
    t001: "核心数据 / KEY FIGURE",
    t002: "2024 · USA · AI VENTURE",
    t003: "32",
    t004: "2024 年美国 AI 吸纳的风险投资，",
    t005: "约占全美风险投资总额的",
    t006: "三分之一",
    t007: "↳ 资本大年",
    t008: "AI 首次成为美国风险投资的绝对主线。资本以前所未有的密度向「AGI 叙事」 押注——单笔 ≥1 亿美元的大额事件高度集中于头部标的，平均单笔接近 10 亿美元， 创下历史新高。",
  },
  stats: [
  { value: "970", unit: "亿美元", label: "全年 AI 风险投资额" },
  { value: "97", unit: "笔", label: "单笔 ≥1 亿美元事件" },
  { value: "10", unit: "亿美元", label: "平均单笔融资额" },
  ],
  ...decorDefaults,
};



export default function StatSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const stats = p.stats.slice(0, p.statCount);

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{copy.t001}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        {/* main */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 64, minHeight: 0, paddingTop: 8 }}>
          {/* big figure */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.35, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 380, lineHeight: 0.78,
                letterSpacing: "-0.04em", color: accent, fontFeatureSettings: '"tnum" 1' }}>{copy.t003}</span>
              {p.showUnit && (
                <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 150, lineHeight: 1,
                  letterSpacing: "-0.02em", marginTop: 26, color: accent }}>%</span>
              )}
            </div>
            <p className="rd-headline rd-anim rd-anim-3" style={{ marginTop: 28, maxWidth: 820 }}>{copy.t004}<br />{copy.t005}<span style={{ color: accent }}>{copy.t006}</span>。
            </p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={250} rotate={12}
              pos={{ left: 372, top: -66 }} z={6} />
          </div>

          {/* support */}
          {p.showSupport && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: "1px solid var(--rd-line)", paddingLeft: 56 }}>
              <div className="rd-mono" style={{ color: accent, marginBottom: 16 }}>{copy.t007}</div>
              <p className="rd-body">{copy.t008}</p>
            </div>
          )}
        </div>

        {/* micro-stat cluster */}
        {stats.length > 0 && (
          <div>
            <div className="rd-hairline" style={{ marginBottom: 22 }} />
            <div style={{ display: "flex", gap: 0 }}>
              {stats.map((s, i) => (
                <div key={i} className={`rd-anim rd-anim-4`} style={{
                  flex: 1, paddingLeft: i === 0 ? 0 : 44,
                  borderLeft: i === 0 ? "none" : "1px solid var(--rd-line)",
                  marginLeft: i === 0 ? 0 : 44,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 800, fontSize: 64, letterSpacing: "-0.02em", fontFeatureSettings: '"tnum" 1' }}>{s.value}</span>
                    <span className="rd-sub" style={{ fontWeight: 700 }}>{s.unit}</span>
                  </div>
                  <p className="rd-mono" style={{ marginTop: 8, fontSize: 22 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
