import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   HorizonSlide — 三视野投资框架 H1 / H2 / H3 (data: 报告 3.4 + 6.2 + 结论).
   McKinsey Three-Horizons curves (three successive humps + an ambition
   envelope) over a time axis, each horizon mapped to a tier of the year's AI
   bets — 守正 / 成长 / 远望. Qualitative tags only (no fabricated %). Portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showEnvelope", label: "雄心包络", type: "toggle", default: true,
    help: "贯穿三视野的虚线包络（整体增长曲线）显示 / 隐藏" },
  { key: "showCards", label: "视野卡片", type: "toggle", default: true,
    help: "底部三个视野说明卡显示 / 隐藏" },
  { key: "showMeter", label: "定性标尺", type: "toggle", default: true,
    help: "卡片内确定性 / 赔率 / 现金流定性标尺显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个视野（曲线 + 卡片）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被高亮的视野序号（0 = H1 守正）" },
  { key: "showCallout", label: "底部小结", type: "toggle", default: true,
    help: "底部组合配置解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showEnvelope: true,
  showCards: true,
  showMeter: true,
  focusEnabled: false,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  copy: {
    t001: "投资框架 / THREE HORIZONS",
    t002: "守正 · 成长 · 远望 · 三层配置",
    t003: "三视野投资框架",
    t004: "用时间轴把 AI 押注分成三档梯队",
    t005: "价值 / 确定性 ▲ 时间 / 兑现距离 ▶",
    t006: "↳ 组合配置",
    t007: "以",
    t008: "H1 守正",
    t009: "锚定现金流确定性，用",
    t010: "H2 成长",
    t011: "捕捉高增长主战场，再以小仓位的",
    t012: "H3 远望",
    t013: "买入非连续性期权——三档梯队对冲「叙事兑现」的时间差。",
  },
  horizons: [
  {
    h: "H1", cn: "守正", en: "DEFEND THE CORE", t: 0.17, amp: 0.74,
    theme: "当下兑现", lanes: ["已验证 PMF 的应用层", "算力基建 · 卖铲赢家"],
    meter: { 确定性: 3, 赔率: 2, 现金流: 3 },
    read: "现金流可被验证、嵌入业务流程；CoreWeave、Databricks 一类已在兑现。",
  },
  {
    h: "H2", cn: "成长", en: "GROW THE NEXT", t: 0.5, amp: 0.92,
    theme: "高增长主战场", lanes: ["通用大模型头部", "垂直应用龙头"],
    meter: { 确定性: 2, 赔率: 3, 现金流: 2 },
    read: "吸金最猛、增速最高，但估值博弈激烈，需紧盯叙事向兑现的转化。",
  },
  {
    h: "H3", cn: "远望", en: "SEED THE FUTURE", t: 0.84, amp: 0.66,
    theme: "前沿期权", lanes: ["具身智能", "AGI 级前沿押注"],
    meter: { 确定性: 1, 赔率: 3, 现金流: 1 },
    read: "落地遥远、波动极大，以小仓位押注非连续性的高赔率期权。",
  },
],
  timeAxis: ["现在", "1–2 年", "3–5 年", "未来"],
  ...decorDefaults,
};

// 三视野 → AI 投资分层（赛道映射依据报告 3.1/3.4/5.3/6.2）。定性标尺，非报告原始数值。



function hump(t, center, amp, sigma) { return amp * Math.exp(-Math.pow((t - center) / sigma, 2)); }

export default function HorizonSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), p.horizons.length - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const sigma = 0.135;
  const COLS = [dark ? "#8f8d87" : "#7d7b76", accent, COLORS.lime];
  const INK_ON = [dark ? COLORS.ink : "#fff", COLORS.blueInk, COLORS.ink];

  const W = 1680, H = 330, mL = 30, mR = 30, mT = 30, mB = 50;
  const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
  const vMax = 1.0;
  const X = (t) => x0 + t * (x1 - x0);
  const Y = (v) => y1 - (v / vMax) * (y1 - y0);
  const N = 120;

  const humpPath = (c, amp) => {
    const pts = [];
    for (let i = 0; i <= N; i++) { const t = i / N; pts.push(`${X(t).toFixed(1)},${Y(hump(t, c, amp, sigma)).toFixed(1)}`); }
    return `M ${X(0)},${y1} L ${pts.join(" L ")} L ${X(1)},${y1} Z`;
  };
  const envPts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const v = Math.max(...p.horizons.map((hz) => hump(t, hz.t, hz.amp, sigma)));
    envPts.push(`${X(t).toFixed(1)},${Y(v + 0.04).toFixed(1)}`);
  }

  const Meter = ({ label, v, hot }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3, width: 56, flex: "none" }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((k) => (
          <span key={k} style={{ width: 22, height: 7, background: k < v ? (hot ? accent : COLORS.ink) : COLORS.line2 }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ marginTop: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: 300, overflow: "visible" }}>
            {/* humps */}
            {p.horizons.map((hz, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return (
                <g key={i} opacity={dim ? 0.34 : 1}>
                  <path d={humpPath(hz.t, hz.amp)} fill={COLS[i]} opacity={dark ? 0.5 : 0.34} />
                  <text x={X(hz.t)} y={Y(hz.amp) - 16} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="900" fontSize="30" fill={i === 2 ? COLORS.ink : COLS[i]}>{hz.h}</text>
                </g>
              );
            })}
            {/* ambition envelope */}
            {p.showEnvelope && <polyline points={envPts.join(" ")} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />}

            {/* axis */}
            <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={COLORS.ink} strokeWidth="2" />
            {p.timeAxis.map((t, i) => (
              <text key={i} x={x0 + (i / (p.timeAxis.length - 1)) * (x1 - x0)} y={y1 + 32} textAnchor={i === 0 ? "start" : i === p.timeAxis.length - 1 ? "end" : "middle"} fontFamily={FONTS.mono} fontSize="16" fill={axisCol} style={{ letterSpacing: "0.06em" }}>{t}</text>
            ))}
            <text x={x0 + 2} y={y0 + 4} fontFamily={FONTS.mono} fontSize="13" fill={axisCol} style={{ letterSpacing: "0.08em" }}>{copy.t005}</text>
          </svg>
        </div>

        {/* cards */}
        {p.showCards && (
          <div className="rd-anim rd-anim-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 14 }}>
            {p.horizons.map((hz, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return (
                <div key={i} style={{ border: `2px solid ${hot ? accent : COLORS.line}`, background: hot ? `${accent}0d` : (dark ? "rgba(243,242,238,0.03)" : "rgba(22,21,19,0.02)"), padding: "20px 22px", display: "flex", flexDirection: "column", opacity: dim ? 0.5 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ flex: "none", fontFamily: FONTS.sans, fontWeight: 900, fontSize: 30, color: INK_ON[i], background: COLS[i], padding: "2px 12px", lineHeight: 1.1 }}>{hz.h}</span>
                    <div>
                      <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 25, color: COLORS.ink, lineHeight: 1.05 }}>{hz.cn} · {hz.theme}</div>
                      <span className="rd-mono" style={{ fontSize: 12, color: COLORS.ink3 }}>{hz.en}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {hz.lanes.map((l, j) => (
                      <span key={j} style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 16, color: COLORS.ink, border: `1.5px solid ${COLORS.line}`, padding: "6px 11px" }}>{l}</span>
                    ))}
                  </div>
                  <p className="rd-cap" style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.45 }}>{hz.read}</p>
                  {p.showMeter && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto", paddingTop: 16 }}>
                      {Object.entries(hz.meter).map(([k, v]) => <Meter key={k} label={k} v={v} hot={hot} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t006}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t007}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t008}</strong>{copy.t009}<strong style={{ color: accent, fontWeight: 700 }}>{copy.t010}</strong>{copy.t011}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t012}</strong>{copy.t013}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={112} rotate={-7} pos={{ right: 40, top: 98 }} />
    </div>
  );
}
