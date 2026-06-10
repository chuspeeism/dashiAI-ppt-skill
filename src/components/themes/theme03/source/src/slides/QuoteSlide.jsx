import React from "react";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   QuoteSlide — 金句页 / 结论 (oversized pull-quote).
   One bold typographic statement, optional quotation mark, attribution, and an
   interleaved 3D hero. Light / dark theme. Pure presentational, props-driven.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "金句高亮词的强调色" },
  { key: "showMark", label: "引号装饰", type: "toggle", default: true,
    help: "巨型装饰引号显示 / 隐藏" },
  { key: "align", label: "对齐方式", type: "select", default: "left",
    options: [{ value: "left", label: "左对齐" }, { value: "center", label: "居中" }],
    help: "金句的对齐方式" },
  { key: "showAttribution", label: "署名出处", type: "toggle", default: true,
    help: "底部署名 / 出处显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  accent: "blue",
  showMark: true,
  align: "left",
  showAttribution: true,
  copy: {
    t001: "结论 / CONCLUSION",
    t002: "2024 · 一句话总结",
    t003: "AI 融资盛宴仍在继续，",
    t004: "但",
    t005: "音乐节奏",
    t006: "正在变化——资本的下一阶段，",
    t007: "将从「",
    t008: "赌叙事",
    t009: "」转向「",
    t010: "看兑现",
    t011: "能把技术转化为可持续收入的公司，才能在退潮后留在牌桌上",
    t012: "《2024 美国大额融资 AI 公司调研报告》",
    t013: "横向看集中 · 纵向看节奏 · 结构看分层",
  },
  ...decorDefaults,
};

export default function QuoteSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const centered = p.align === "center";

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{copy.t001}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: centered ? "center" : "flex-start",
          textAlign: centered ? "center" : "left", position: "relative", minHeight: 0, paddingTop: 8,
        }}>
          {p.showMark && (
            <span aria-hidden="true" className="rd-anim" style={{
              fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 220, lineHeight: 0.6,
              color: accent, marginBottom: 8, userSelect: "none",
            }}>“</span>
          )}

          <blockquote className="rd-anim rd-anim-2" style={{
            margin: 0, fontFamily: 'var(--rd-sans)', fontWeight: 800,
            fontSize: 76, lineHeight: 1.18, letterSpacing: "-0.015em",
            maxWidth: 1480, textWrap: "balance",
          }}>{copy.t003}<br />{copy.t004}<span style={{ color: accent }}>{copy.t005}</span>{copy.t006}<br />{copy.t007}<span style={{ color: accent }}>{copy.t008}</span>{copy.t009}<span style={{ color: accent }}>{copy.t010}</span>」。
          </blockquote>

          <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={250} rotate={10}
            pos={centered ? { right: 150, top: 20 } : { right: 120, top: -10 }} z={5} />

          {p.showAttribution && (
            <div className="rd-anim rd-anim-3" style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ width: 56, height: 3, background: accent }} />
              <span className="rd-mono" style={{ fontSize: 24 }}>{copy.t011}</span>
            </div>
          )}
        </div>

        <div>
          <div className="rd-hairline" style={{ marginBottom: 18 }} />
          <div className="rd-mono" style={{ display: "flex", gap: 48, fontSize: 24 }}>
            <span>{copy.t012}</span>
            <span style={{ marginLeft: "auto" }}>{copy.t013}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
