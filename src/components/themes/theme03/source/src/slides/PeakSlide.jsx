import React from "react";
import { COLORS, FONTS } from "../theme.js";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   PeakSlide — 大数字 · 全年单月峰值 (oversized figure + 12-month rhythm strip).
   主数字 = 8 月单月 118 亿美元（全年峰值）；底部 12 个月微型柱呈现报告 2.2 的
   "双峰 + 前高后稳" 节奏（5 月、8 月两次峰值，Q2–Q3 达峰后理性回落）。
   月度数据 verbatim 报告 2.2。Light / dark theme. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "巨型数字与峰值柱的强调色" },
  { key: "showUnit", label: "数字单位", type: "toggle", default: true,
    help: "巨型数字后缀单位显示 / 隐藏" },
  { key: "showSupport", label: "辅助说明", type: "toggle", default: true,
    help: "右侧辅助解读文案显示 / 隐藏" },
  { key: "showChart", label: "月度节奏", type: "toggle", default: true,
    help: "底部 12 个月微型柱条显示 / 隐藏" },
  { key: "showSecondPeak", label: "次峰标记", type: "toggle", default: true,
    help: "5 月次峰是否同样以强调色标记" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "dark",
  accent: "lime",
  showUnit: true,
  showSupport: true,
  showChart: true,
  showSecondPeak: true,
  // —— visible content (override per deck) ——
  eyebrow: "纵向节奏 / RHYTHM",
  kicker: "2024 · 逐月融资额 · 单月峰值",
  figureValue: "118",
  unit: "亿\n美元",
  headlineSegments: [
    { t: "8 月", a: true },
    { t: " 单月融资创全年峰值——" },
    { br: true },
    { t: "全年呈「" },
    { t: "前高后稳", a: true },
    { t: "」，Q2–Q3 达峰后理性回落。" },
  ],
  supportLabel: "↳ 双峰节奏",
  supportSegments: [
    { t: "全年出现 " },
    { t: "5 月（105 亿）", b: true },
    { t: " 与" },
    { t: " 8 月（118 亿）", b: true },
    { t: " 两次峰值，与多家头部公司集中关账有关。达峰后市场并未失速，而是从狂热转向分化——节奏的变化，往往比总量更早预示风向。" },
  ],
  peakIndex: 7,
  secondIndex: 4,
  data: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  copy: {
    t001: "月",
  },
  ...decorDefaults,
};

export default function PeakSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const DATA = p.data || [];
  const MONTHS = p.months || [];
  const PEAK = p.peakIndex;
  const SECOND = p.secondIndex;
  const dark = p.theme === "dark";
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const onLime = p.accent === "lime";
  const max = DATA.length ? Math.max(...DATA) : 1;

  const unitLines = (p.unit || "").split("\n");
  const isHot = (i) => i === PEAK || (p.showSecondPeak && i === SECOND);

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        {/* main figure + support */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 64, minHeight: 0, paddingTop: 8 }}>
          <div className="rd-anim rd-anim-2" style={{ flex: 1.35, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 380, lineHeight: 0.78,
                letterSpacing: "-0.04em", color: accent, fontFeatureSettings: '"tnum" 1' }}>{p.figureValue}</span>
              {p.showUnit && (
                <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 56, lineHeight: 1,
                  letterSpacing: "-0.01em", marginTop: 40, color: accent }}>{unitLines.map((u, i) => (
                    <React.Fragment key={i}>{i > 0 && <br />}{u}</React.Fragment>
                  ))}</span>
              )}
            </div>
            <p className="rd-headline rd-anim rd-anim-3" style={{ marginTop: 24, maxWidth: 880 }}>
              {p.headlineSegments.map((s, i) => (
                s.br ? <br key={i} /> : <span key={i} style={s.a ? { color: accent } : undefined}>{s.t}</span>
              ))}
            </p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={230} rotate={11}
              pos={{ left: 470, top: -60 }} z={6} />
          </div>

          {p.showSupport && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 56 }}>
              <div className="rd-mono" style={{ color: accent, marginBottom: 16 }}>{p.supportLabel}</div>
              <p className="rd-body">
                {p.supportSegments.map((s, i) => (
                  s.b
                    ? <strong key={i} style={{ color: COLORS.ink, fontWeight: 700 }}>{s.t}</strong>
                    : <React.Fragment key={i}>{s.t}</React.Fragment>
                ))}
              </p>
            </div>
          )}
        </div>

        {/* 12-month rhythm strip */}
        {p.showChart && (
          <div className="rd-anim rd-anim-4">
            <div className="rd-hairline" style={{ marginBottom: 18 }} />
            <div style={{ display: "flex", alignItems: "flex-end", gap: "min(1.4vw, 22px)", height: 150 }}>
              {DATA.map((v, i) => {
                const hot = isHot(i);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                    <span style={{ fontFamily: FONTS.sans, fontWeight: hot ? 800 : 600, fontSize: hot ? 22 : 18,
                      color: hot ? accent : COLORS.ink3, marginBottom: 7, fontFeatureSettings: '"tnum" 1' }}>{v}</span>
                    <div style={{
                      width: "100%", height: `${(v / max) * 100}%`,
                      background: hot ? accent : (dark ? "rgba(243,242,238,0.22)" : "rgba(22,21,19,0.20)"),
                    }} />
                    <span className="rd-mono" style={{ fontSize: 16, color: hot ? COLORS.ink : COLORS.ink3, marginTop: 9 }}>{MONTHS[i]}{copy.t001}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
