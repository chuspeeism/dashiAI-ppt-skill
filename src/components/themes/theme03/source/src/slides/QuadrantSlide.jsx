import React from "react";
import { COLORS } from "../theme.js";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   QuadrantSlide — 资本热度 × 商业兑现度 四象限.
   2×2 matrix with axis labels, a focusable quadrant, company chips, and a 3D
   element interleaved at the axis cross.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showAxis", label: "坐标轴标注", type: "toggle", default: true,
    help: "四周的坐标轴文字显示 / 隐藏" },
  { key: "showChips", label: "公司标签", type: "toggle", default: true,
    help: "各象限内代表公司标签显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个象限" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 1, min: 0, max: 3, step: 1,
    help: "被高亮的象限序号（从 0 起，左上→右上→左下→右下）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showAxis: true,
  showChips: true,
  focusEnabled: true,
  focusIndex: 1,
  copy: {
    t001: "横向透视 / 05",
    t002: "资本热度 × 商业兑现度",
    t003: "选题四象限",
    t004: "从「融资总量大」到「资本从叙事驱动转向兑现驱动」",
    t005: "资本热度 高 ↑",
    t006: "低",
    t007: "商业兑现度 高 →",
    t008: "← 低",
  },
  cells: [
  { name: "叙事泡沫区", tag: "热度高 · 兑现待验证",
    desc: "通用大模型与 AGI 实验室获得巨额融资，但兑现仍受算力成本、模型差异化与监管约束。",
    chips: ["OpenAI", "Anthropic", "xAI", "SSI"] },
  { name: "明星兑现区", tag: "热度高 · 兑现高",
    desc: "基础设施、算力云、数据平台兼具融资热度与收入确定性，典型的「卖铲子」逻辑。",
    chips: ["CoreWeave", "Databricks", "Scale AI"] },
  { name: "等待验证区", tag: "热度中低 · 兑现待验证",
    desc: "长尾工具链、安全与早期硬件「概念成立但规模未证」，更适合作为风险与边缘变量。",
    chips: ["工具链", "安全", "早期硬件"] },
  { name: "隐形价值区", tag: "热度中低 · 兑现高",
    desc: "垂直应用、企业搜索、工作流自动化单笔不一定最大，但落地路径更清晰。",
    chips: ["Glean", "Perplexity"] },
  ],
  ...decorDefaults,
};

// reading order: 0 左上, 1 右上, 2 左下, 3 右下


export default function QuadrantSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = COLORS.blue;

  const Cell = (i, extra) => {
    const c = p.cells[i];
    const hot = p.focusEnabled && i === p.focusIndex;
    const dim = p.focusEnabled && !hot;
    return (
      <div className="rd-anim rd-anim-3" style={{
        padding: 40, display: "flex", flexDirection: "column",
        opacity: dim ? 0.4 : 1,
        background: hot ? "rgba(39,66,236,0.05)" : "transparent",
        transition: "opacity .3s, background .3s",
        ...extra,
      }}>
        <h3 className="rd-headline" style={{ fontSize: 38, color: hot ? accent : COLORS.ink }}>{c.name}</h3>
        <div className="rd-mono" style={{ fontSize: 22, marginTop: 8, color: hot ? accent : COLORS.ink3 }}>{c.tag}</div>
        <p className="rd-cap" style={{ marginTop: 16, maxWidth: 540 }}>{c.desc}</p>
        {p.showChips && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto", paddingTop: 18 }}>
            {c.chips.map((ch) => (
              <span key={ch} style={{
                fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 600, fontSize: 22,
                padding: "5px 12px", border: `1px solid ${hot ? accent : COLORS.line}`,
                color: hot ? accent : COLORS.ink2,
              }}>{ch}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 24, paddingBottom: 14 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        {/* matrix */}
        <div style={{ flex: 1, position: "relative", margin: p.showAxis ? "0 64px 36px 96px" : "0 0 12px" }}>
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", border: `1px solid ${COLORS.line}` }}>
            {Cell(0, { borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` })}
            {Cell(1, { borderBottom: `1px solid ${COLORS.line}` })}
            {Cell(2, { borderRight: `1px solid ${COLORS.line}` })}
            {Cell(3, {})}
          </div>

          {/* 3D element nudged into the top-right corner so it doesn't cover cell text */}
          <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={176} rotate={6}
            pos={{ right: -42, top: -150 }} z={5} />

          {/* axis labels */}
          {p.showAxis && (
            <>
              <div className="rd-mono" style={{ position: "absolute", left: -52, top: "6%", writingMode: "vertical-rl", textOrientation: "upright", letterSpacing: "2px", color: COLORS.ink2 }}>{copy.t005}</div>
              <div className="rd-mono" style={{ position: "absolute", left: -52, bottom: "8%", writingMode: "vertical-rl", textOrientation: "upright", color: COLORS.ink3 }}>{copy.t006}</div>
              <div className="rd-mono" style={{ position: "absolute", right: 0, bottom: -34, color: COLORS.ink2 }}>{copy.t007}</div>
              <div className="rd-mono" style={{ position: "absolute", left: 0, bottom: -34, color: COLORS.ink3 }}>{copy.t008}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
