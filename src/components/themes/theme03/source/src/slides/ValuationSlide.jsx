import React from "react";
import { COLORS } from "../theme.js";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ValuationSlide — 大数字对比 · 估值之谜 (oversized ratio statement).
   Hero is the P/S multiple; two input figures (valuation vs revenue) feed it,
   with an optional log-scale magnitude bar that dramatises the gap. Light/dark
   theme, accent switch. Pure presentational, props-driven; copy is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "巨型倍数使用的强调色" },
  { key: "showInputs", label: "构成项", type: "toggle", default: true,
    help: "右侧「估值 / 收入」构成项显示 / 隐藏" },
  { key: "showBar", label: "量级条", type: "toggle", default: true,
    help: "构成项内的量级对比条显示 / 隐藏" },
  { key: "showSupport", label: "辅助说明", type: "toggle", default: true,
    help: "底部泡沫风险解读显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "dark",
  accent: "lime",
  showInputs: true,
  showBar: true,
  showSupport: true,
  // —— visible content (override per deck) ——
  eyebrow: "估值研判 / VALUATION",
  kicker: "Anthropic · 2024E",
  ratioLabel: "市销率 · P/S RATIO",
  ratioValue: "1000",
  ratioSuffix: "×+",
  headlineSegments: [
    { t: "估值建立在「" },
    { t: "未来市值", a: true },
    { t: "」，" },
    { br: true },
    { t: "而非当期收入之上。" },
  ],
  supportLabel: "↳ 泡沫信号",
  supportBody: "Anthropic 9650 亿美元估值，对应 2024 年预计收入仅约 8 亿美元。一旦宏观环境收紧，估值回调几乎不可避免——这也是当前 AI 资本市场最核心的结构性风险。",
  inputs: [
    { label: "最新估值", en: "VALUATION", value: "9650", unit: "亿美元", mag: 1 },
    { label: "2024E 收入", en: "REVENUE", value: "8", unit: "亿美元", mag: 8 / 9650 },
  ],
  ...decorDefaults,
};

export default function ValuationSlide(props) {
  const p = { ...defaultProps, ...props };
  const INPUTS = p.inputs || [];
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const accentText = p.accent === "lime" && p.theme === "dark" ? "var(--rd-lime)"
    : p.accent === "lime" ? "var(--rd-ink)" : "var(--rd-blue)";

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${p.accent === "lime" ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 80, minHeight: 0, paddingTop: 8 }}>
          {/* hero: the P/S multiple */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.3, position: "relative" }}>
            <div className="rd-mono" style={{ color: accentText, marginBottom: 4 }}>{p.ratioLabel}</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 360, lineHeight: 0.78,
                letterSpacing: "-0.04em", color: accent, fontFeatureSettings: '"tnum" 1' }}>{p.ratioValue}</span>
              <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 150, lineHeight: 1,
                letterSpacing: "-0.02em", marginTop: 26, color: accent }}>{p.ratioSuffix}</span>
            </div>
            <p className="rd-headline rd-anim rd-anim-3" style={{ marginTop: 24, maxWidth: 820 }}>
              {p.headlineSegments.map((s, i) => (
                s.br ? <br key={i} /> : <span key={i} style={s.a ? { color: accentText } : undefined}>{s.t}</span>
              ))}
            </p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={240} rotate={11}
              pos={{ left: 560, top: -56 }} z={6} />
          </div>

          {/* inputs: valuation vs revenue */}
          {p.showInputs && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: "1px solid var(--rd-line)", paddingLeft: 56, display: "flex", flexDirection: "column", gap: 44 }}>
              {INPUTS.map((it, i) => {
                const hot = i === 0;
                return (
                  <div key={i}>
                    <div className="rd-mono" style={{ fontSize: 22, color: "var(--rd-ink-3)", marginBottom: 8 }}>{it.en} · {it.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 96, lineHeight: 0.86,
                        letterSpacing: "-0.03em", color: i === 0 ? "var(--rd-ink)" : accentText, fontFeatureSettings: '"tnum" 1' }}>{it.value}</span>
                      <span className="rd-sub" style={{ fontWeight: 700 }}>{it.unit}</span>
                    </div>
                    {p.showBar && (
                      <div style={{ marginTop: 16, height: 12, background: "var(--rd-line-2)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, width: `${Math.max(1.2, it.mag * 100)}%`,
                          background: i === 0 ? "var(--rd-ink)" : accent }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* support note */}
        {p.showSupport && (
          <div className="rd-anim rd-anim-4">
            <div className="rd-hairline" style={{ marginBottom: 20 }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span className="rd-mono" style={{ color: accentText, flexShrink: 0 }}>{p.supportLabel}</span>
              <p className="rd-body" style={{ maxWidth: 1380 }}>
                {p.supportBody}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
