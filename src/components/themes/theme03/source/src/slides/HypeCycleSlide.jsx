import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   HypeCycleSlide — 技术成熟度曲线 / 炒作周期 (data: 报告 3.4 选题主线 + 6.1/6.2).
   The Gartner-style hype curve (trigger → peak → trough → slope → plateau) with
   the year's AI 赛道 plotted along it by qualitative maturity. Echoes the report's
   "叙事驱动 → 兑现驱动" thesis. Curve sampled so dots sit exactly on it. Portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showPhases", label: "阶段分区", type: "toggle", default: true,
    help: "五个成熟阶段的底部色带与名称显示 / 隐藏" },
  { key: "showReads", label: "赛道读解", type: "toggle", default: true,
    help: "右侧各赛道一行定位读解显示 / 隐藏" },
  { key: "showValue", label: "量级标注", type: "toggle", default: true,
    help: "各赛道融资额量级标注显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个赛道（曲线点 + 读解）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 1, min: 0, max: 4, step: 1,
    help: "被高亮的赛道序号（0 = 具身智能）" },
  { key: "showCallout", label: "底部小结", type: "toggle", default: true,
    help: "底部周期解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showPhases: true,
  showReads: true,
  showValue: true,
  focusEnabled: true,
  focusIndex: 1,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "选题主线 / HYPE CYCLE",
  kicker: "AI 赛道 · 资本热度 × 技术成熟度",
  title: "技术成熟度曲线",
  titleNote: "谁在烒作顶点 · 谁已走向兑现",
  axisLabel: "资本热度 / 预期 ▲",
  calloutLabel: "↳ 周期解读",
  calloutSegments: [
    { t: "热钱集中在曲线左半的" },
    { t: "「期望膨胀」顶点", b: true },
    { t: "，而现金流确定性沿右半的爨升段累积——投资的胜负手，是判断每条赛道" },
    { t: "距离「兑现」还有多远", a: true },
    { t: "。" },
  ],
  sectors: [
    { name: "具身智能", en: "EMBODIED", t: 0.205, amt: "前沿押注", phase: "期望膨胀", read: "热度顶点、估值领跑，落地仍待验证（6.2 前沿押注）" },
    { name: "通用大模型", en: "FOUNDATION", t: 0.315, amt: "420 亿 · 43.3%", phase: "见顶回落", read: "吸金最猛但 P/S 高悬，叙事开始接受兑现拷问（6.1）" },
    { name: "AI 芯片", en: "SILICON", t: 0.52, amt: "97 亿 · 10%", phase: "触底爨升", read: "上游确定性最强，算力刚需托底（卖铲逻辑）" },
    { name: "算力基础设施", en: "INFRA", t: 0.635, amt: "158 亿 · 16%", phase: "稳步爨升", read: "CoreWeave 等卖铲赢家率先兑现现金流（5.3）" },
    { name: "垂直应用", en: "VERTICAL", t: 0.79, amt: "245 亿 · 25%", phase: "趋于成熟", read: "已验证 PMF、嵌入业务流程的隐形价值区（3.4）" },
  ],
  phases: [
    { cn: "萌芽期", en: "TRIGGER", a: 0.0, b: 0.12 },
    { cn: "期望膨胀期", en: "PEAK", a: 0.12, b: 0.36 },
    { cn: "泡沫低谷期", en: "TROUGH", a: 0.36, b: 0.5 },
    { cn: "稳步爨升期", en: "SLOPE", a: 0.5, b: 0.72 },
    { cn: "生产成熟期", en: "PLATEAU", a: 0.72, b: 1.0 },
  ],
  ...decorDefaults,
};

// hype-cycle value in 0..~1.1 — shared by the drawn curve AND the dot placement
function hypeVal(t) {
  const peak = 0.96 * Math.exp(-Math.pow((t - 0.2) / 0.085, 2));
  const plateau = 0.6 / (1 + Math.exp(-(t - 0.6) / 0.06));
  return 0.13 + peak + plateau;
}

export default function HypeCycleSlide(props) {
  const p = { ...defaultProps, ...props };
  const SECTORS = p.sectors || [];
  const PHASES = p.phases || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), SECTORS.length - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const curveCol = dark ? "#6f6d68" : "#9b9994";

  const W = 1040, H = 560, mL = 30, mR = 30, mT = 28, mB = 74;
  const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
  const vMax = 1.12;
  const X = (t) => x0 + t * (x1 - x0);
  const Y = (v) => y1 - (v / vMax) * (y1 - y0);

  const N = 160;
  const curvePts = [];
  for (let i = 0; i <= N; i++) { const t = i / N; curvePts.push(`${X(t).toFixed(1)},${Y(hypeVal(t)).toFixed(1)}`); }
  const curve = curvePts.join(" ");

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

        <div style={{ flex: 1, display: "flex", gap: 44, minHeight: 0, marginTop: 12 }}>
          {/* curve */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1.42, minWidth: 0, display: "flex" }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              {/* phase bands */}
              {p.showPhases && PHASES.map((ph, i) => (
                <g key={i}>
                  {i % 2 === 1 && <rect x={X(ph.a)} y={y0 - 6} width={X(ph.b) - X(ph.a)} height={y1 - y0 + 6} fill={dark ? "rgba(243,242,238,0.04)" : "rgba(22,21,19,0.035)"} />}
                  <line x1={X(ph.b)} y1={y0 - 6} x2={X(ph.b)} y2={y1} stroke={COLORS.line2} strokeWidth="1" />
                  <text x={(X(ph.a) + X(ph.b)) / 2} y={y1 + 28} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="700" fontSize="16" fill={dark ? COLORS.ink2 : COLORS.ink}>{ph.cn}</text>
                  <text x={(X(ph.a) + X(ph.b)) / 2} y={y1 + 48} textAnchor="middle" fontFamily={FONTS.mono} fontSize="12" fill={axisCol} style={{ letterSpacing: "0.08em" }}>{ph.en}</text>
                </g>
              ))}
              <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={COLORS.ink} strokeWidth="2" />
              <text x={x0 + 2} y={y0 + 4} fontFamily={FONTS.mono} fontSize="13" fill={axisCol} style={{ letterSpacing: "0.08em" }}>{p.axisLabel}</text>

              {/* curve */}
              <polyline points={curve} fill="none" stroke={curveCol} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

              {/* sector dots */}
              {SECTORS.map((s, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                const cx = X(s.t), cy = Y(hypeVal(s.t));
                const up = i % 2 === 0; // alternate label side
                const ly = up ? cy - 18 : cy + 34;
                return (
                  <g key={i} opacity={dim ? 0.42 : 1}>
                    <circle cx={cx} cy={cy} r={hot ? 14 : 9} fill={hot ? accent : (dark ? COLORS.bg : "#fff")} stroke={hot ? accent : COLORS.ink} strokeWidth={hot ? 0 : 3} />
                    {hot && <circle cx={cx} cy={cy} r={22} fill="none" stroke={accent} strokeWidth="2" opacity="0.5" />}
                    <text x={cx} y={ly} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize={hot ? 24 : 21} fill={hot ? accent : COLORS.ink}>{s.name}</text>
                    {p.showValue && <text x={cx} y={up ? ly + 19 : ly + 19} textAnchor="middle" fontFamily={FONTS.mono} fontSize="13" fill={axisCol}>{s.amt}</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* readings panel */}
          {p.showReads && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 30 }}>
              {SECTORS.map((s, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "15px 0", borderBottom: i < SECTORS.length - 1 ? `1px solid ${COLORS.line2}` : "none", opacity: dim ? 0.5 : 1 }}>
                    <span style={{ flex: "none", width: 30, fontFamily: FONTS.mono, fontWeight: 700, fontSize: 20, color: hot ? accent : COLORS.ink3 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 23, color: COLORS.ink }}>{s.name}</span>
                        <span style={{ fontFamily: FONTS.mono, fontSize: 13, padding: "3px 8px", background: hot ? accent : (dark ? "rgba(243,242,238,0.08)" : "rgba(22,21,19,0.06)"), color: hot ? COLORS.blueInk : COLORS.ink2 }}>{s.phase}</span>
                      </div>
                      <p className="rd-cap" style={{ margin: "5px 0 0", fontSize: 17.5, lineHeight: 1.4 }}>{s.read}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {(p.calloutSegments || []).map((s, i) => (
                s.b
                  ? <strong key={i} style={{ color: COLORS.ink, fontWeight: 700 }}>{s.t}</strong>
                  : s.a
                    ? <strong key={i} style={{ color: accent, fontWeight: 700 }}>{s.t}</strong>
                    : <React.Fragment key={i}>{s.t}</React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={8} pos={{ right: 40, top: 100 }} />
    </div>
  );
}
