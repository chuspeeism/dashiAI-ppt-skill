import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   MonthlySlide — 逐月融资额明细 (data table + heat).
   A two-column data table with optional heat shading, inline magnitude bars,
   a focusable row, and a side summary. All variable parts are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showHeat", label: "热力底色", type: "toggle", default: true,
    help: "按数值大小为每行铺设热力底色" },
  { key: "showBar", label: "数值条", type: "toggle", default: true,
    help: "每行内嵌的数值量级条" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个月份（峰值）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 7, min: 0, max: 11, step: 1,
    help: "被高亮的月份序号（0 = 1 月）" },
  { key: "showSummary", label: "侧栏汇总", type: "toggle", default: true,
    help: "右侧季度 / 峰值汇总面板显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showHeat: true,
  showBar: true,
  focusEnabled: true,
  focusIndex: 7,
  showSummary: true,
  // —— visible content (override per deck) ——
  eyebrow: "月度明细 / 03",
  kicker: "单位：亿美元 · 2024 全年",
  title: "逐月融资额明细",
  h1Label: "上半年 · H1",
  h2Label: "下半年 · H2",
  peakLabel: "↳ 全年峰值",
  unit: "亿美元",
  monthSuffix: "月",
  peakNote: "月单月新高 · 多家头部公司集中关账",
  quarterLabel: "↳ 季度合计",
  data: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  quarters: [["Q1", 162], ["Q2", 284], ["Q3", 318], ["Q4", 206]],
  ...decorDefaults,
};

function Row({ i, value, max, monthSuffix, showHeat, showBar, hot, dim }) {
  const intensity = value / max;
  // Monochrome heat — a clean neutral ink wash that deepens with value, so the
  // table reads as one calm grayscale gradient; blue is reserved for the peak.
  // Theme-aware ink base so the wash + bars stay visible when the deck flips dark.
  const inkRGB = isRDDark() ? "243,242,238" : "22,21,19";
  const heatBg = showHeat ? `rgba(${inkRGB},${(0.015 + intensity * 0.055).toFixed(3)})` : "transparent";
  const barColor = hot ? COLORS.blue : `rgba(${inkRGB},${(0.34 + intensity * 0.44).toFixed(3)})`;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18, padding: "0 16px", height: 78,
      background: hot ? "rgba(39,66,236,0.08)" : heatBg,
      borderBottom: `1px solid var(--rd-line-2)`,
      boxShadow: hot ? `inset 3px 0 0 ${COLORS.blue}` : "none",
      opacity: dim ? 0.55 : 1,
    }}>
      <span style={{ fontFamily: 'var(--rd-mono)', fontSize: 24, color: hot ? COLORS.blue : COLORS.ink3, width: 64, flex: "none" }}>
        {String(i + 1).padStart(2, "0")}{monthSuffix}
      </span>
      {showBar && (
        <div style={{ flex: 1, height: 14, background: COLORS.fog, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, width: `${intensity * 100}%`, background: barColor }} />
        </div>
      )}
      <span style={{
        fontFamily: 'var(--rd-sans)', fontWeight: hot ? 800 : 700, fontSize: hot ? 38 : 32,
        color: hot ? COLORS.blue : COLORS.ink, width: showBar ? 92 : 160, flex: "none",
        textAlign: "right", fontFeatureSettings: '"tnum" 1',
      }}>{value}</span>
    </div>
  );
}

export default function MonthlySlide(props) {
  const p = { ...defaultProps, ...props };
  const DATA = p.data || [];
  const MAX = DATA.length ? Math.max(...DATA) : 1;
  const quarters = p.quarters || [];
  const qMax = quarters.length ? Math.max(...quarters.map((q) => q[1])) : 1;
  const accent = "var(--rd-blue)";
  const cols = [DATA.slice(0, 6), DATA.slice(6, 12)];
  const peak = DATA.indexOf(MAX);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 56, paddingTop: 32, minHeight: 0 }}>
          {/* tables */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.85, display: "flex", flexDirection: "column" }}>
            <h2 className="rd-title">{p.title}</h2>
            <div className="rd-mono" style={{ marginTop: 12, display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ color: COLORS.ink3 }}>{p.h1Label}</span>
              <span style={{ flex: 1, height: 1, background: "var(--rd-line)" }} />
              <span style={{ color: COLORS.ink3 }}>{p.h2Label}</span>
            </div>
            <div style={{ flex: 1, display: "flex", gap: 40, marginTop: 14 }}>
              {cols.map((col, c) => (
                <div key={c} style={{ flex: 1, borderTop: `2px solid var(--rd-ink)` }}>
                  {col.map((v, k) => {
                    const i = c * 6 + k;
                    const hot = p.focusEnabled && i === p.focusIndex;
                    return (
                      <Row key={i} i={i} value={v} max={MAX} showHeat={p.showHeat} showBar={p.showBar}
                        monthSuffix={p.monthSuffix} hot={hot} dim={p.focusEnabled && !hot} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* summary panel */}
          {p.showSummary && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: "1px solid var(--rd-line)", paddingLeft: 52, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="rd-mono" style={{ color: accent, marginBottom: 10 }}>{p.peakLabel}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span className="rd-figure" style={{ fontSize: 132 }}>{MAX}</span>
                <span className="rd-sub" style={{ fontWeight: 700 }}>{p.unit}</span>
              </div>
              <p className="rd-cap" style={{ marginTop: 6 }}>
                {peak + 1} {p.peakNote}
              </p>

              <div style={{ marginTop: 38, paddingTop: 26, borderTop: `2px solid var(--rd-blue)` }}>
                <div className="rd-mono" style={{ color: accent, marginBottom: 14 }}>{p.quarterLabel}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {quarters.map(([q, val]) => (
                    <div key={q} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span className="rd-mono" style={{ width: 44, flex: "none" }}>{q}</span>
                      <div style={{ flex: 1, height: 10, background: COLORS.fog }}>
                        <div style={{ width: `${(val / qMax) * 100}%`, height: "100%", background: COLORS.ink }} />
                      </div>
                      <span style={{ fontFamily: 'var(--rd-sans)', fontWeight: 700, fontSize: 26, width: 64, textAlign: "right" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={176} rotate={-5} pos={{ right: 52, top: 150 }} />
    </div>
  );
}
