import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RoseSlide — 逐月融资 · 南丁格尔玫瑰图 (data: 报告 2.2 逐月融资额明细).
   A 12-petal polar-area (rose) chart: each month is a 30° wedge whose radius
   ∝ 融资额, grouped/colored by quarter, with the report's 5月 / 8月 双峰
   highlighted. Figures verbatim. Fixed-px SVG geometry. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showRings", label: "刻度环", type: "toggle", default: true,
    help: "同心刻度环 + 数值标注显示 / 隐藏" },
  { key: "showValue", label: "花瓣数值", type: "toggle", default: true,
    help: "各月融资额数值显示 / 隐藏" },
  { key: "showLegend", label: "季度面板", type: "toggle", default: true,
    help: "右侧季度汇总面板显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个月份花瓣" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 7, min: 0, max: 11, step: 1,
    help: "被高亮的月份序号（0 = 1 月）" },
  { key: "showCallout", label: "趋势解读", type: "toggle", default: true,
    help: "底部双峰节奏解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showRings: true,
  showValue: true,
  showLegend: true,
  focusEnabled: true,
  focusIndex: 7,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "市场全景 / SEASONALITY",
  kicker: "2024 · 逐月融资额 · 单位亿美元",
  title: "逐月融资 · 玫瑰图",
  titleNote: "花瓣半径 ∝ 当月融资额 · 5 月 / 8 月双峰",
  legendTitle: "季度汇总 · 亿美元",
  peakPre: "峰值：",
  peakStrong: "8 月 118",
  peakPost: " · 5 月 105，与头部公司集中关账有关。",
  calloutLabel: "↳ 节奏解读",
  calloutPre: "全年呈双峰节律——",
  calloutStrong: "5 月、8 月",
  calloutPost: "两次冲高对应多家头部公司集中关账；Q2–Q3 维持高位后于年末回落，印证「前高后稳」的整体走势。",
  months: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  quarters: [
    { name: "Q1", total: 162 },
    { name: "Q2", total: 284 },
    { name: "Q3", total: 318 },
    { name: "Q4", total: 206 },
  ],
  copy: {
    t001: "月",
  },
  ...decorDefaults,
};

export default function RoseSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const MONTHS = p.months || [];
  const QUARTERS = p.quarters || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), 11);
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  // geometry
  const S = 600, cx = 300, cy = 308, Rmax = 244, innerR = 12;
  const maxV = 120;
  const r = (v) => innerR + (v / maxV) * (Rmax - innerR);
  const pt = (deg, rad) => {
    const a = (deg) * Math.PI / 180;
    return [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
  };
  const wedge = (i, rad) => {
    const a0 = i * 30, a1 = (i + 1) * 30;
    const [x0, y0] = pt(a0, rad), [x1, y1] = pt(a1, rad);
    return `M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${rad.toFixed(1)},${rad.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`;
  };
  const qOf = (i) => Math.floor(i / 3);
  const qColor = (i) => RAMP[qOf(i)];
  const rings = [30, 60, 90, 120];

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.titleNote}</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, marginTop: 6, display: "flex", gap: 48, alignItems: "center" }}>
          {/* rose */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1.1, minWidth: 0, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${S} ${S}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", maxHeight: "100%", overflow: "visible" }}>
              {/* rings */}
              {p.showRings && rings.map((g) => (
                <g key={g}>
                  <circle cx={cx} cy={cy} r={r(g)} fill="none" stroke={COLORS.line2} strokeWidth="1" />
                  <text x={cx + 4} y={cy - r(g) - 4} fontFamily={FONTS.mono} fontSize="14" fill={axisCol}>{g}</text>
                </g>
              ))}
              {/* petals */}
              {MONTHS.map((v, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <path key={i} d={wedge(i, r(v))}
                    fill={hot ? accent : qColor(i)}
                    stroke={dark ? COLORS.bg : "#fff"} strokeWidth="2"
                    opacity={dim ? 0.5 : 0.95} />
                );
              })}
              {/* month labels + values */}
              {MONTHS.map((v, i) => {
                const hot = p.focusEnabled && i === fi;
                const [lx, ly] = pt(i * 30 + 15, Rmax + 26);
                return (
                  <g key={i}>
                    <text x={lx} y={ly - 8} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 600} fontSize="18" fill={hot ? accent : COLORS.ink}>{i + 1}{copy.t001}</text>
                    {p.showValue && <text x={lx} y={ly + 12} textAnchor="middle" fontFamily={FONTS.mono} fontSize="15" fill={hot ? accent : axisCol}>{v}</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* legend */}
          {p.showLegend && (
            <div className="rd-anim rd-anim-3" style={{ flex: 0.78, minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
              <div className="rd-mono" style={{ fontSize: 16, color: axisCol, marginBottom: 8 }}>{p.legendTitle}</div>
              {QUARTERS.map((q, i) => {
                const w = (q.total / 360) * 100;
                return (
                  <div key={i} style={{ padding: "16px 0", borderTop: `1px solid ${COLORS.line2}`, borderBottom: i === 3 ? `1px solid ${COLORS.line2}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 14, height: 14, background: RAMP[i], flex: "none" }} />
                        <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 22, color: COLORS.ink }}>{q.name}</span>
                      </span>
                      <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 30, color: COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{q.total}</span>
                    </div>
                    <div style={{ height: 6, background: COLORS.line2, marginTop: 10 }}>
                      <div style={{ width: `${w}%`, height: "100%", background: RAMP[i] }} />
                    </div>
                  </div>
                );
              })}
              <div className="rd-cap" style={{ fontSize: 17, marginTop: 14 }}>{p.peakPre}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{p.peakStrong}</strong>{p.peakPost}</div>
            </div>
          )}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutPre}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{p.calloutStrong}</strong>{p.calloutPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={9} pos={{ right: 40, top: 104 }} />
    </div>
  );
}
