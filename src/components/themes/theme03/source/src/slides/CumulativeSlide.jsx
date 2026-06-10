import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CumulativeSlide — 全年资金累积 · S 曲线 (data: 报告 2.2 逐月融资额).
   The monthly amounts (verbatim) summed running-total to exactly 970 亿 —
   an area + cumulative curve shows HOW the record year piled up, with optional
   monthly-increment mini-bars (secondary scale). Fixed-px SVG. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chartType", label: "主系列样式", type: "select", default: "area",
    options: [{ value: "area", label: "面积" }, { value: "line", label: "折线" }],
    help: "累计主系列呈现方式" },
  { key: "showSecondary", label: "月度增量", type: "toggle", default: true,
    help: "叠加各月新增融资额 mini 柱（次级尺度）" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "背景水平网格线显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个月并显示累计 / 增量数值" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 7, min: 0, max: 11, step: 1,
    help: "被高亮的月份序号（0 = 1 月）" },
  { key: "showCallout", label: "趋势解读", type: "toggle", default: true,
    help: "底部累积节奏解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chartType: "area",
  showSecondary: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 7,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "市场全景 / ACCUMULATION",
  kicker: "2024 · 逐月累计融资额 · 单位亿美元",
  title: "970 亿是如何累积的",
  titleNote: "逐月新增汇成全年总额 · S 曲线",
  calloutLabel: "↳ 累积节奏",
  calloutSegments: [
    { t: "曲线在 " },
    { t: "5 月、8 月两度陡峭抬升", b: true },
    { t: "——年中至下半年贡献了大半增量，到 8 月累计已破 650 亿；全年逐月汇成 " },
    { t: "970 亿美元", a: true },
    { t: " 的历史新高，呈典型「双峰 + 前高后稳」节律。" },
  ],
  monthly: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  monthLabels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  copy: {
    t001: "累计 · +",
  },
  ...decorDefaults,
};

export default function CumulativeSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const MONTHLY = p.monthly || [];
  const MLABEL = p.monthLabels || [];
  const CUM = MONTHLY.reduce((acc, v) => { acc.push((acc[acc.length - 1] || 0) + v); return acc; }, []);
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), MONTHLY.length - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const neutral = dark ? "#56544f" : "#b9b7b1";

  const W = 1680, H = 532, mL = 86, mR = 56, mT = 30, mB = 70;
  const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
  const n = MONTHLY.length;
  const cumMax = 1000, monMax = 120;
  const X = (i) => x0 + (i / (n - 1)) * (x1 - x0);
  const Yc = (v) => y1 - (v / cumMax) * (y1 - y0);
  const Ym = (v) => y1 - (v / monMax) * (y1 - y0) * 0.42; // mini-bars: bottom 42%
  const grid = [0, 250, 500, 750, 1000];
  const slot = (x1 - x0) / (n - 1);
  const barW = Math.min(34, slot * 0.4);

  const linePts = CUM.map((v, i) => `${X(i)},${Yc(v)}`).join(" ");
  const areaPath = `M ${X(0)},${y1} L ${CUM.map((v, i) => `${X(i)},${Yc(v)}`).join(" L ")} L ${X(n - 1)},${y1} Z`;

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

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {p.showGrid && grid.map((g) => (
              <g key={g}>
                <line x1={x0} y1={Yc(g)} x2={x1} y2={Yc(g)} stroke={COLORS.line2} strokeWidth="1" />
                <text x={x0 - 16} y={Yc(g) + 6} textAnchor="end" fontFamily={FONTS.mono} fontSize="19" fill={axisCol}>{g}</text>
              </g>
            ))}

            {/* monthly increment mini-bars (secondary) */}
            {p.showSecondary && MONTHLY.map((v, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <rect key={i} x={X(i) - barW / 2} y={Ym(v)} width={barW} height={Math.max(2, y1 - Ym(v))}
                  fill={hot ? accent : neutral} opacity={hot ? 0.9 : 0.5} />
              );
            })}

            {/* cumulative area / line */}
            {p.chartType === "area" && <path d={areaPath} fill={accent} opacity={dark ? 0.16 : 0.12} />}
            <polyline points={linePts} fill="none" stroke={accent} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

            {/* dots */}
            {CUM.map((v, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <g key={i}>
                  {hot && <line x1={X(i)} y1={Yc(v)} x2={X(i)} y2={y1} stroke={accent} strokeWidth="1.5" strokeDasharray="3 5" />}
                  <circle cx={X(i)} cy={Yc(v)} r={hot ? 9 : 4.5} fill={hot ? accent : (dark ? COLORS.bg : "#fff")} stroke={accent} strokeWidth={hot ? 0 : 3} />
                  {hot && (
                    <g>
                      <text x={X(i)} y={Yc(v) - 50} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="800" fontSize="40" fill={accent} style={{ fontFeatureSettings: '"tnum" 1' }}>{v}</text>
                      <text x={X(i)} y={Yc(v) - 26} textAnchor="middle" fontFamily={FONTS.mono} fontSize="16" fill={axisCol}>{copy.t001}{MONTHLY[i]}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* end total marker */}
            {!(p.focusEnabled && fi === n - 1) && (
              <text x={X(n - 1)} y={Yc(CUM[n - 1]) - 18} textAnchor="end" fontFamily={FONTS.sans} fontWeight="800" fontSize="26" fill={COLORS.ink} style={{ fontFeatureSettings: '"tnum" 1' }}>{CUM[n - 1]}</text>
            )}

            {/* x labels */}
            {MLABEL.map((m, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <text key={i} x={X(i)} y={y1 + 34} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 600} fontSize="20" fill={hot ? accent : axisCol}>{m}</text>
              );
            })}
            <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={COLORS.ink} strokeWidth="2" />
          </svg>
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
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={-7} pos={{ right: 44, top: 104 }} />
    </div>
  );
}
