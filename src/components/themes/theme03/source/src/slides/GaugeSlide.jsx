import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   GaugeSlide — 大数字 / 仪表盘 · 估值泡沫温度计 (data: 报告 6.1 风险研判).
   A 180° gauge plots the head-of-market P/S multiple on a log scale — Anthropic
   的 9650 亿估值 / ≈8 亿收入 → P/S 超千倍 — with the needle deep in the「泡沫」
   zone. Figures verbatim from the report. Fixed-px SVG. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showZones", label: "区间色带", type: "toggle", default: true,
    help: "理性 / 偏热 / 过热 / 泡沫 四段色带显示 / 隐藏" },
  { key: "showTicks", label: "刻度标注", type: "toggle", default: true,
    help: "P/S 倍数刻度标注显示 / 隐藏" },
  { key: "showSupport", label: "佐证数据", type: "toggle", default: true,
    help: "右侧估值 / 收入 / 倍数佐证显示 / 隐藏" },
  { key: "showCallout", label: "风险解读", type: "toggle", default: true,
    help: "底部泡沫风险解读显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "指针与泡沫区强调色" },
  { key: "theme", label: "主题", type: "select", default: "dark",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showZones: true,
  showTicks: true,
  showSupport: true,
  showCallout: true,
  accent: "blue",
  theme: "dark",
  // —— visible content (override per deck) ——
  eyebrow: "风险研判 / VALUATION HEAT",
  kicker: "报告 6.1 · 估值泡沫与盈利困境",
  title: "估值泡沫温度计",
  titleNote: "市销率 P/S · 头部标的已驶入「泡沫」区",
  scaleLo: 5,
  scaleHi: 1500,
  value: 1200,
  centerLabel: "当前头部 P/S 量级",
  calloutLabel: "↳ 风险解读",
  calloutPre: "多数头部估值建立在「未来市值」而非当前收入之上——Anthropic 9650 亿估值对应预计收入仅约 8 亿，",
  calloutStrong: " P/S 超千倍",
  calloutPost: "。一旦宏观收紧或 IPO 破发，估值回调难以避免。",
  zones: [
    { v0: 5,   v1: 25,   label: "理性" },
    { v0: 25,  v1: 100,  label: "偏热" },
    { v0: 100, v1: 500,  label: "过热" },
    { v0: 500, v1: 1500, label: "泡沫" },
  ],
  support: [
    { num: "9650", unit: "亿美元", note: "Anthropic 最新估值" },
    { num: "≈8", unit: "亿美元", note: "2024 预计年收入" },
    { num: ">1000", unit: "倍", note: "P/S 市销率" },
  ],
  ...decorDefaults,
};

// 按填充色亮度选择可读文字色（深 / 浅）
function textOn(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#161513" : "#f3f2ee";
}

export default function GaugeSlide(props) {
  const p = { ...defaultProps, ...props };
  const LO = p.scaleLo, HI = p.scaleHi, VALUE = p.value;
  const ZONES = p.zones || [];
  const SUPPORT = p.support || [];
  const dark = p.theme === "dark";
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : (dark ? COLORS.blue : COLORS.blue);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const trackCol = dark ? "rgba(243,242,238,0.16)" : "rgba(22,21,19,0.12)";

  // geometry
  const Wd = 900, Hd = 520, cx = 450, cy = 432, R = 326, sw = 50;
  const L0 = Math.log10(LO), L1 = Math.log10(HI), span = L1 - L0;
  const deg = (v) => 180 - 180 * (Math.log10(v) - L0) / span;
  const pt = (v, r) => {
    const a = deg(v) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  };
  const arcPath = (v0, v1, r) => {
    const steps = 36, pts = [];
    for (let i = 0; i <= steps; i++) {
      const lg = Math.log10(v0) + (Math.log10(v1) - Math.log10(v0)) * (i / steps);
      pts.push(pt(Math.pow(10, lg), r));
    }
    return "M" + pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" L");
  };
  const zoneColor = (i) => {
    if (i === 3) return accent;                       // 泡沫
    if (i === 2) return dark ? "#cfcdc7" : COLORS.ink; // 过热
    if (i === 1) return dark ? "#7c7a74" : "#908f8a";  // 偏热
    return dark ? "#9ccb3a" : "#7fae1f";               // 理性
  };
  const ticks = [5, 25, 100, 500, 1500];
  const [nx, ny] = pt(VALUE, R - 6);

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

        <div style={{ flex: 1, minHeight: 0, marginTop: 8, display: "flex", gap: 56, alignItems: "center" }}>
          {/* gauge */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1.25, minWidth: 0, height: "100%", display: "flex", alignItems: "center" }}>
            <svg viewBox={`0 0 ${Wd} ${Hd}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              {/* base track */}
              <path d={arcPath(LO, HI, R)} fill="none" stroke={trackCol} strokeWidth={sw} strokeLinecap="butt" />
              {/* zones */}
              {p.showZones && ZONES.map((z, i) => (
                <path key={i} d={arcPath(z.v0, z.v1, R)} fill="none" stroke={zoneColor(i)} strokeWidth={sw} strokeLinecap="butt"
                  opacity={i === 3 ? 1 : 0.92} />
              ))}
              {/* zone labels along arc */}
              {p.showZones && ZONES.map((z, i) => {
                const mid = Math.pow(10, (Math.log10(z.v0) + Math.log10(z.v1)) / 2);
                const [lx, ly] = pt(mid, R);
                return (
                  <text key={i} x={lx} y={ly + 6} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="800" fontSize="20"
                    fill={textOn(zoneColor(i))}>{z.label}</text>
                );
              })}
              {/* ticks */}
              {p.showTicks && ticks.map((t, i) => {
                const [ox, oy] = pt(t, R + sw / 2 + 6);
                const [tx, ty] = pt(t, R + sw / 2 + 30);
                return (
                  <g key={i}>
                    <line x1={ox} y1={oy} x2={tx} y2={ty} stroke={axisCol} strokeWidth="1.5" />
                    <text x={tx} y={ty + (oy > cy - 40 ? 18 : 4)} textAnchor="middle" fontFamily={FONTS.mono} fontSize="17" fill={axisCol}>{t}×</text>
                  </g>
                );
              })}
              {/* needle */}
              <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={accentInk} strokeWidth="7" strokeLinecap="round" />
              <circle cx={cx} cy={cy} r="16" fill={accentInk} />
              <circle cx={cx} cy={cy} r="7" fill={dark ? COLORS.bg : "#fff"} />
              {/* center readout */}
              <text x={cx} y={cy - 116} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="900" fontSize="118" letterSpacing="-0.03em" fill={accentInk} style={{ fontFeatureSettings: '"tnum" 1' }}>{VALUE}×</text>
              <text x={cx} y={cy - 70} textAnchor="middle" fontFamily={FONTS.mono} fontSize="20" fill={axisCol}>{p.centerLabel}</text>
            </svg>
          </div>

          {/* support */}
          {p.showSupport && (
            <div className="rd-anim rd-anim-3" style={{ flex: 0.85, minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
              {SUPPORT.map((s, i) => (
                <div key={i} style={{ padding: "20px 0", borderTop: `1px solid ${COLORS.line2}`, borderBottom: i === SUPPORT.length - 1 ? `1px solid ${COLORS.line2}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 60, lineHeight: 0.9, letterSpacing: "-0.03em", color: i === 2 ? accentInk : COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{s.num}</span>
                    <span className="rd-mono" style={{ fontSize: 20, color: COLORS.ink2 }}>{s.unit}</span>
                  </div>
                  <div className="rd-cap" style={{ marginTop: 8, fontSize: 19 }}>{s.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accentInk, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutPre}<strong style={{ color: accentInk, fontWeight: 700 }}>{p.calloutStrong}</strong>{p.calloutPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={9} pos={{ right: 40, top: 100 }} />
    </div>
  );
}
