import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ParetoSlide — 资本集中度 · 帕累托曲线 (data: 《2024 美国大额融资 AI 公司调研报告》).
   Combo chart: ranked sector bars (融资额) + cumulative-share line (右轴 %),
   with an 80% threshold marker — visualises the report's "赢家通吃 / 头部集中"
   conclusion. All figures are from the report's 行业赛道 table. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chartType", label: "柱样式", type: "select", default: "bar",
    options: [{ value: "bar", label: "柱状" }, { value: "lollipop", label: "棒棒糖" }],
    help: "融资额主系列的呈现方式" },
  { key: "showCumulative", label: "累计曲线", type: "toggle", default: true,
    help: "叠加各赛道累计占比折线及右轴" },
  { key: "showThreshold", label: "80% 基准线", type: "toggle", default: true,
    help: "帕累托 80% 参考线显示 / 隐藏" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "背景水平网格线显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一赛道并显示数值" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的赛道序号（0 = 通用大模型）" },
  { key: "showCallout", label: "核心发现", type: "toggle", default: true,
    help: "底部头部集中度解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chartType: "bar",
  showCumulative: true,
  showThreshold: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / CONCENTRATION",
  kicker: "2024 · 赛道融资额 × 累计占比",
  title: "资本集中度 · 帕累托",
  titleNote: "少数赛道吸纳绝大多数资本 · “赢家通吃”",
  leftAxisLabel: "亿美元",
  rightAxisLabel: "累计",
  thresholdLabel: "帕累托 80% 线",
  calloutLabel: "↳ 核心发现",
  calloutSegments: [
    { t: "头部两条赛道（通用大模型 + 垂直应用）吸纳全年 " },
    { t: "68.6%", b: true },
    { t: " 的大额资本；叠加基础设施后前三名突破 " },
    { t: "85%", b: true },
    { t: "。更极端的是公司层面——Anthropic 三轮合计 650 亿美元，约占全年 970 亿的 " },
    { t: "67%", b: true },
    { t: "，集中度远超典型 80/20。" },
  ],
  sectors: [
    { cn: "通用大模型", en: "FOUNDATION", amt: 420, pct: 43.3 },
    { cn: "垂直应用",   en: "VERTICAL AI", amt: 245, pct: 25.3 },
    { cn: "AI 基础设施", en: "INFRA",      amt: 158, pct: 16.3 },
    { cn: "AI 芯片",    en: "HARDWARE",   amt: 97,  pct: 10.0 },
    { cn: "其他",       en: "TOOLING",    amt: 50,  pct: 5.1 },
  ],
  ...decorDefaults,
};

export default function ParetoSlide(props) {
  const p = { ...defaultProps, ...props };
  const SECTORS = p.sectors || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const lime = COLORS.lime;
  const fi = Math.min(Math.max(0, p.focusIndex), SECTORS.length - 1);

  // cumulative share
  let acc = 0;
  const data = SECTORS.map((s) => { acc += s.pct; return { ...s, cum: acc }; });
  const maxAmt = SECTORS.length ? Math.max(...SECTORS.map((s) => s.amt)) : 1;

  // SVG geometry
  const W = 1680, H = 540;
  const mL = 92, mR = 92, mT = 36, mB = 78;
  const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
  const n = data.length;
  const slot = (x1 - x0) / n;
  const cx = (i) => x0 + slot * (i + 0.5);
  const barW = slot * 0.46;
  const yAmt = (v) => y1 - (v / maxAmt) * (y1 - y0);
  const yPct = (v) => y1 - (v / 100) * (y1 - y0);
  const gridVals = [0, 25, 50, 75, 100];
  const axisCol = dark ? "#84827c" : COLORS.ink3;

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

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 14 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <marker id="pa-dot" markerWidth="12" markerHeight="12" refX="6" refY="6">
                <circle cx="6" cy="6" r="5" fill={lime} stroke={COLORS.ink} strokeWidth="1.5" />
              </marker>
            </defs>
            {/* grid + right axis ticks */}
            {p.showGrid && gridVals.map((g) => (
              <g key={g}>
                <line x1={x0} y1={yPct(g)} x2={x1} y2={yPct(g)} stroke={COLORS.line2} strokeWidth="1" />
                <text x={x1 + 14} y={yPct(g) + 6} fontFamily={FONTS.mono} fontSize="20" fill={axisCol}>{g}%</text>
              </g>
            ))}
            {/* left axis caption */}
            <text x={x0 - 16} y={y0 - 12} fontFamily={FONTS.mono} fontSize="19" fill={axisCol} textAnchor="start">{p.leftAxisLabel}</text>
            <text x={x1 + 14} y={y0 - 12} fontFamily={FONTS.mono} fontSize="19" fill={axisCol} textAnchor="start">{p.rightAxisLabel}</text>

            {/* 80% threshold */}
            {p.showThreshold && (
              <g>
                <line x1={x0} y1={yPct(80)} x2={x1} y2={yPct(80)} stroke={accent} strokeWidth="2" strokeDasharray="3 7" />
                <text x={x0 + 6} y={yPct(80) - 10} fontFamily={FONTS.mono} fontSize="18" fill={accent}>{p.thresholdLabel}</text>
              </g>
            )}

            {/* bars */}
            {data.map((d, i) => {
              const hot = p.focusEnabled && i === fi;
              const col = hot ? accent : RAMP[i];
              const yb = yAmt(d.amt);
              if (p.chartType === "lollipop") {
                return (
                  <g key={i} opacity={p.focusEnabled && !hot ? 0.5 : 1}>
                    <line x1={cx(i)} y1={y1} x2={cx(i)} y2={yb} stroke={col} strokeWidth="5" />
                    <circle cx={cx(i)} cy={yb} r={hot ? 18 : 14} fill={col} />
                  </g>
                );
              }
              return (
                <rect key={i} x={cx(i) - barW / 2} y={yb} width={barW} height={y1 - yb} fill={col}
                  opacity={p.focusEnabled && !hot ? 0.5 : 1} />
              );
            })}
            {/* amount value labels */}
            {data.map((d, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <text key={i} x={cx(i)} y={yAmt(d.amt) - 14} textAnchor="middle"
                  fontFamily={FONTS.sans} fontWeight="800" fontSize={hot ? 30 : 25}
                  fill={hot ? accent : COLORS.ink}>{d.amt}</text>
              );
            })}

            {/* cumulative line */}
            {p.showCumulative && (
              <g>
                <path d={data.map((d, i) => `${i === 0 ? "M" : "L"} ${cx(i)} ${yPct(d.cum)}`).join(" ")}
                  fill="none" stroke={COLORS.ink} strokeWidth="3" markerStart="url(#pa-dot)" markerMid="url(#pa-dot)" markerEnd="url(#pa-dot)" />
                {data.map((d, i) => (
                  <text key={i} x={cx(i)} y={yPct(d.cum) - 20} textAnchor="middle"
                    fontFamily={FONTS.mono} fontWeight="700" fontSize="21" fill={COLORS.ink}>{d.cum.toFixed(1)}%</text>
                ))}
              </g>
            )}

            {/* x labels */}
            {data.map((d, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <g key={i}>
                  <text x={cx(i)} y={y1 + 36} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize="23" fill={hot ? accent : COLORS.ink}>{d.cn}</text>
                  <text x={cx(i)} y={y1 + 60} textAnchor="middle" fontFamily={FONTS.mono} fontSize="15" fill={axisCol}>{d.pct}% · {d.en}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {(p.calloutSegments || []).map((s, i) => (
                s.b
                  ? <strong key={i} style={{ color: COLORS.ink, fontWeight: 700 }}>{s.t}</strong>
                  : <React.Fragment key={i}>{s.t}</React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
