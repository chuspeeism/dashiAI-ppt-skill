import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   PyramidSlide — 金字塔模型 (战略 / 层级金字塔).
   A stacked-trapezoid pyramid: apex = the strategic "why", base = the resource
   "how". Layer count is tunable; each layer carries a tier name + side note,
   with an optional side panel that mirrors the stack. Trapezoids are computed
   with clip-path from layer index so any count stays a clean pyramid.
   Pure / portable — props only, scoped tokens, soft entrance.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "layerCount", label: "层级数量", type: "slider", default: 5, min: 3, max: 6, step: 1,
    help: "金字塔层级数量（自顶向下）" },
  { key: "showSideNote", label: "层级解读", type: "toggle", default: true,
    help: "右侧各层级名称 + 释义面板显示 / 隐藏" },
  { key: "showTierTag", label: "层级序号", type: "toggle", default: true,
    help: "每层左侧层级序号标记显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个层级" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 5, step: 1,
    help: "被高亮的层级序号（0 = 顶层，自动随层级数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  layerCount: 5,
  showSideNote: true,
  showTierTag: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "战略模型 / PYRAMID",
    t002: "自上而下 · 愿景 → 资源",
    t003: "金字塔模型",
    t004: "层层支撑 · 把愿景拆解为可执行的底座",
    t005: "↳ 解读",
    t006: "金字塔的价值在于「向下追问支撑」：每上一层都必须由下一层兜底——没有资源基础的战略是空想， 没有愿景牵引的资源是浪费。自上而下对齐方向、自下而上验证可行，才能让顶层意图真正落地。",
  },
  layers: [
  { cn: "愿景使命", en: "VISION",       note: "组织存在的根本意义与长期方向" },
  { cn: "战略目标", en: "STRATEGY",     note: "可衡量的中期目标与必赢之战" },
  { cn: "核心能力", en: "CAPABILITY",   note: "支撑战略的差异化能力与壁垒" },
  { cn: "关键举措", en: "INITIATIVES",  note: "落地战略的重点项目与节奏" },
  { cn: "运营机制", en: "OPERATIONS",   note: "保障执行的流程、组织与协同" },
  { cn: "资源基础", en: "FOUNDATION",   note: "人才、资本、数据与技术底座" },
  ],
  ...decorDefaults,
};

// index 0 = apex (most strategic) → base (foundational).


export default function PyramidSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const n = Math.min(Math.max(3, p.layerCount), 6);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  // bottom n layers anchor to FOUNDATION, top is always the apex idea.
  const layers = [p.layers[0], ...p.layers.slice(1 + (p.layers.length - 1 - (n - 1)))];
  const rgb = dark ? "110,133,255" : "39,66,236";

  // Truncated pyramid: the apex is a FLAT top (not a point) so even the
  // narrowest top layer is wide enough to hold its label without clipping.
  const APEX = 0.34;                                   // top-layer width fraction
  const bound = (k) => APEX + (1 - APEX) * (k / n);    // edge width fraction at row boundary k
  const pct = (frac) => `${((1 - frac) / 2) * 100}%`;
  const clipFor = (i) => {
    const topF = bound(i), botF = bound(i + 1);
    const tl = ((1 - topF) / 2) * 100, tr = ((1 + topF) / 2) * 100;
    const bl = ((1 - botF) / 2) * 100, br = ((1 + botF) / 2) * 100;
    return `polygon(${tl}% 0, ${tr}% 0, ${br}% 100%, ${bl}% 100%)`;
  };

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

        <div style={{ flex: 1, display: "flex", gap: 52, minHeight: 0, alignItems: "stretch" }}>
          {/* pyramid stack */}
          <div className="rd-anim rd-anim-3" style={{ flex: p.showSideNote ? 1.15 : 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, paddingTop: 8, paddingBottom: 8 }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {layers.map((L, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                const t = n === 1 ? 0 : i / (n - 1);
                const op = 1 - t * 0.78;                     // apex saturated → base faint
                const onDark = op > 0.5;                     // ink color for label
                const fill = hot ? `rgb(${rgb})` : `rgba(${rgb},${op.toFixed(3)})`;
                const ink = hot || onDark ? "#fff" : COLORS.ink;
                const subInk = hot || onDark ? "rgba(255,255,255,0.82)" : COLORS.ink3;
                // left-align the label, pushed just inside the trapezoid's left
                // slant at this row's mid-height.
                const midFrac = (bound(i) + bound(i + 1)) / 2;
                const leftPad = `calc(${pct(midFrac)} + 28px)`;
                return (
                  <div key={i} style={{ position: "relative", height: `calc((100% ) )`, flex: 1, minHeight: 64, display: "flex", alignItems: "center", opacity: dim ? 0.42 : 1, transition: "opacity .3s" }}>
                    {/* tier tag at the left gutter */}
                    {p.showTierTag && (
                      <span className="rd-mono" style={{ position: "absolute", left: pct(bound(i + 1)), transform: "translateX(-160%)", fontSize: 16, color: COLORS.ink3, whiteSpace: "nowrap" }}>L{i + 1}</span>
                    )}
                    <div style={{ width: "100%", height: "100%", background: fill, clipPath: clipFor(i), WebkitClipPath: clipFor(i), display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: leftPad, boxShadow: hot ? `0 10px 26px rgba(${rgb},0.34)` : "none", transition: "background .3s" }}>
                      <div style={{ textAlign: "left", display: "flex", alignItems: "baseline", gap: 12 }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 30, color: ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{L.cn}</span>
                        <span className="rd-mono" style={{ fontSize: 15, color: subInk }}>{L.en}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* side notes mirror the stack top→bottom */}
          {p.showSideNote && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 40, gap: 0 }}>
              {layers.map((L, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                const t = n === 1 ? 0 : i / (n - 1);
                const op = 1 - t * 0.78;
                return (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "14px 0", borderBottom: i < n - 1 ? `1px solid ${COLORS.line2}` : "none", opacity: dim ? 0.4 : 1, transition: "opacity .3s" }}>
                    <span style={{ flex: "none", width: 14, height: 14, marginTop: 9, background: `rgba(${rgb},${Math.max(op, 0.25).toFixed(3)})`, border: `2px solid rgb(${rgb})` }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 24, color: COLORS.ink }}>{L.cn}</span>
                        <span className="rd-mono" style={{ fontSize: 14, color: COLORS.ink3 }}>{L.en}</span>
                      </div>
                      <p className="rd-cap" style={{ margin: "3px 0 0", fontSize: 19 }}>{L.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t005}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t006}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={126} rotate={-8} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
