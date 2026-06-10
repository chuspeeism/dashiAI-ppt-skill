import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ConcentrationSlide — 资本大年 · 三重集中 (data: 报告摘要 + 3.1 + 4.1 + 结论一).
   A triptych of ring gauges quantifying "赢家通吃"：AI 占全美风投近 1/3、通用大
   模型占 AI 大额融资 43.3%、旧金山湾区占 63.9%。Figures verbatim. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "ringCount", label: "圆环数量", type: "slider", default: 3, min: 2, max: 3, step: 1,
    help: "展示的集中度圆环数量" },
  { key: "showArc", label: "环形进度", type: "toggle", default: true,
    help: "圆环进度弧显示 / 隐藏（关闭则仅留巨型数字）" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个集中度维度" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 2, step: 1,
    help: "被高亮的维度序号（自动随圆环数量收敛）" },
  { key: "showCallout", label: "结论解读", type: "toggle", default: true,
    help: "底部「赢家通吃」结论显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮维度的强调色" },
  { key: "theme", label: "主题", type: "select", default: "dark",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  ringCount: 3,
  showArc: true,
  focusEnabled: true,
  focusIndex: 2,
  showCallout: true,
  accent: "blue",
  theme: "dark",
  // —— visible content (override per deck) ——
  eyebrow: "结论 · 横向看集中 / WINNER-TAKE-ALL",
  kicker: "2024 · 资本高度集聚",
  titlePre: "资本大年的",
  titleAccent: "三重集中",
  titleNote: "资金向赛道、地区、头部三向收敛",
  shareLabel: "占比 / SHARE",
  calloutLabel: "↳ 结论一",
  calloutPre: "资金高度向",
  calloutStrong: "头部公司、通用大模型赛道、旧金山湾区",
  calloutPost: "集中，「赢家通吃」格局确立——人才、资本、算力的虹吸效应短期内难以撆动。",
  dims: [
    { pct: 33,   label: "AI 占全美风投", sub: "近三分之一 · 资本大年" },
    { pct: 43.3, label: "通用大模型",   sub: "占 AI 大额融资 · 赛道集中" },
    { pct: 63.9, label: "旧金山湾区",   sub: "占 AI 大额融资 · 地理集中" },
  ],
  ...decorDefaults,
};

function Ring({ d, i, hot, dim, accent, showArc, dark, shareLabel }) {
  const VB = 360, cx = 180, cy = 180, R = 138, sw = 18;
  const circ = 2 * Math.PI * R;
  const arc = (d.pct / 100) * circ;
  const ringInk = hot ? accent : (dark ? "#f3f2ee" : COLORS.ink);
  const trackCol = dark ? "rgba(243,242,238,0.10)" : "rgba(22,21,19,0.08)";
  const gid = `cc-grad-${i}`;
  const lightAccent = hot ? accent : (dark ? "#f3f2ee" : COLORS.ink);

  // graduated tick scale (60 ticks) — covered portion tints toward the value
  const TICKS = 60;
  const ticks = [];
  for (let k = 0; k < TICKS; k++) {
    const ang = (k / TICKS) * 2 * Math.PI - Math.PI / 2;
    const major = k % 5 === 0;
    const rIn = R + sw / 2 + 8;
    const rOut = rIn + (major ? 13 : 8);
    const covered = (k / TICKS) * 100 <= d.pct + 0.6;
    ticks.push(
      <line key={k}
        x1={cx + rIn * Math.cos(ang)} y1={cy + rIn * Math.sin(ang)}
        x2={cx + rOut * Math.cos(ang)} y2={cy + rOut * Math.sin(ang)}
        stroke={covered ? ringInk : (dark ? "rgba(243,242,238,0.16)" : "rgba(22,21,19,0.14)")}
        strokeWidth={major ? 2.4 : 1.4}
        opacity={covered ? (hot ? 0.9 : 0.55) : 1} />
    );
  }

  // endpoint knob
  const kAng = (d.pct / 100) * 2 * Math.PI - Math.PI / 2;
  const kx = cx + R * Math.cos(kAng), ky = cy + R * Math.sin(kAng);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", opacity: dim ? 0.46 : 1, transition: "opacity .3s" }}>
      <div style={{ position: "relative", width: 360, height: 360 }}>
        <svg viewBox={`0 0 ${VB} ${VB}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={ringInk} />
              <stop offset="100%" stopColor={lightAccent} stopOpacity={hot ? 0.55 : 0.4} />
            </linearGradient>
          </defs>

          {showArc && ticks}
          {showArc && <circle cx={cx} cy={cy} r={R} fill="none" stroke={trackCol} strokeWidth={sw} />}
          {showArc && (
            <circle className="cc-ring-arc" cx={cx} cy={cy} r={R} fill="none" stroke={`url(#${gid})`} strokeWidth={sw}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{
                strokeDasharray: circ,
                strokeDashoffset: circ - arc,
                "--cc-from": circ,
                "--cc-to": circ - arc,
                filter: hot ? `drop-shadow(0 0 14px ${accent}66)` : "none",
              }} />
          )}
          {showArc && (
            <g style={{ filter: hot ? `drop-shadow(0 0 10px ${accent}88)` : "none" }}>
              <circle cx={kx} cy={ky} r={sw / 2 + 4} fill={ringInk} />
              <circle cx={kx} cy={ky} r={4.5} fill={dark ? "#161513" : "#f3f2ee"} />
            </g>
          )}
        </svg>
        <div style={{ position: "absolute", inset: 0 }}>
          <span className="rd-mono" style={{ position: "absolute", left: 0, right: 0, top: "calc(50% - 64px)", textAlign: "center", fontSize: 15, letterSpacing: "0.14em", color: dark ? "#84827c" : COLORS.ink3 }}>{shareLabel}</span>
          <span style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", textAlign: "center", fontFamily: FONTS.sans, fontWeight: 900, fontSize: 88, lineHeight: 0.9, letterSpacing: "-0.03em", color: ringInk, fontFeatureSettings: '"tnum" 1' }}>
            {d.pct}
            <span style={{ fontSize: 38, fontWeight: 800 }}>%</span>
          </span>
        </div>
      </div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 30, color: dark ? "#f3f2ee" : COLORS.ink, marginTop: 18, textAlign: "center" }}>{d.label}</div>
      <div className="rd-cap" style={{ fontSize: 19, marginTop: 8, textAlign: "center" }}>{d.sub}</div>
    </div>
  );
}

export default function ConcentrationSlide(props) {
  const p = { ...defaultProps, ...props };
  const DIMS = p.dims || [];
  const dark = p.theme === "dark";
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const n = Math.max(2, Math.min(DIMS.length, p.ringCount));
  const dims = DIMS.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          [data-deck-active] .cc-ring-arc { animation: cc-ring-draw 1.15s cubic-bezier(.2,.7,.2,1) both; }
        }
        @keyframes cc-ring-draw { from { stroke-dashoffset: var(--cc-from); } to { stroke-dashoffset: var(--cc-to); } }
      `}</style>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{p.titlePre}<span style={{ color: p.accent === "lime" ? COLORS.lime : accent }}>{p.titleAccent}</span></h2>
          <span className="rd-cap">{p.titleNote}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 8 }}>
          {dims.map((d, i) => (
            <Ring key={i} d={d} i={i}
              hot={p.focusEnabled && i === fi}
              dim={p.focusEnabled && i !== fi}
              accent={accent} showArc={p.showArc} dark={dark} shareLabel={p.shareLabel} />
          ))}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutPre}<strong style={{ color: dark ? "#f3f2ee" : COLORS.ink, fontWeight: 700 }}>{p.calloutStrong}</strong>{p.calloutPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 40, top: 104 }} />
    </div>
  );
}
