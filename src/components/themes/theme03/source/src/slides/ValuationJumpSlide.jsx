import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ValuationJumpSlide — 图表 · Anthropic 估值跃迁 (step / bar chart).
   Self-contained SVG: primary series = post-money valuation across 2024's three
   rounds, optional secondary series = ticket size on a right axis. The dramatic
   600→830→9650 step is the story. Driven entirely by props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chartType", label: "图表类型", type: "select", default: "bar",
    options: [
      { value: "bar", label: "柱状" },
      { value: "step", label: "阶梯" },
      { value: "area", label: "面积" },
    ], help: "估值主系列的呈现方式" },
  { key: "showSecondary", label: "次级系列", type: "toggle", default: true,
    help: "叠加「单轮融资额」标记及右轴" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "图表背景的水平网格线" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一轮并显示数值" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 2, step: 1,
    help: "被高亮的轮次序号（从 0 起）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "右侧反超解读文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chartType: "bar",
  showSecondary: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 2,
  showCallout: true,
  // —— visible content (override per deck) ——
  eyebrow: "典型案例 / JUMP",
  kicker: "Anthropic · 2024 估值（亿美元）",
  title: "从追赶到反超 · 估值跃迁",
  primaryLegend: "投后估值",
  secondaryLegend: "单轮融资额",
  focusUnit: "亿估值",
  focusRaisePre: "单轮融资 ",
  focusRaiseSuffix: " 亿美元",
  calloutLabel: "↳ 反超 OpenAI",
  calloutBody: "2024 年连续三轮、累计融资超 650 亿美元，估值一举突破 9650 亿——超越 OpenAI 成为全球估值最高的 AI 初创企业；2026 年 6 月已递交 IPO 申请。",
  data: [
    { label: "5 月", en: "Series G", val: 600, raise: 280 },
    { label: "8 月", en: "Series H", val: 830, raise: 180 },
    { label: "11 月", en: "H 扩轮", val: 9650, raise: 190 },
  ],
  ...decorDefaults,
};

function JumpChart({ type, showSecondary, showGrid, focusEnabled, focusIndex, accent, data }) {
  const DATA = data || [];
  const W = 980, H = 560;
  const mL = 96, mR = showSecondary ? 76 : 24, mT = 48, mB = 80;
  const iW = W - mL - mR, iH = H - mT - mB;
  const vMax = 10000, rMax = 300;
  const n = DATA.length;
  const slot = iW / n;
  const cx = (i) => mL + slot * i + slot / 2;
  const yV = (v) => mT + iH - (v / vMax) * iH;
  const yR = (v) => mT + iH - (v / rMax) * iH;

  const grid = [0, 2500, 5000, 7500, 10000];
  const barW = slot * 0.46;
  const valPts = DATA.map((d, i) => [cx(i), yV(d.val)]);
  const stepPath = valPts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt[0]} ${pt[1]}`;
    const prev = valPts[i - 1];
    return acc + ` L ${pt[0]} ${prev[1]} L ${pt[0]} ${pt[1]}`;
  }, "");
  const areaPath = `M ${valPts[0][0]} ${mT + iH} ` + valPts.map((pt) => `L ${pt[0]} ${pt[1]}`).join(" ") + ` L ${valPts[n - 1][0]} ${mT + iH} Z`;
  const raisePts = DATA.map((d, i) => [cx(i), yR(d.raise)]);
  const raisePath = raisePts.map((pt, i) => (i ? "L" : "M") + pt[0] + " " + pt[1]).join(" ");

  const fmt = (v) => v >= 1000 ? (v / 10000).toFixed(2).replace(/\.?0+$/, "") + " 万" : v;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      {grid.map((v) => (
        <g key={v}>
          {showGrid && <line x1={mL} y1={yV(v)} x2={mL + iW} y2={yV(v)} stroke={COLORS.line2} strokeWidth="1" />}
          <text x={mL - 14} y={yV(v) + 6} textAnchor="end" fontFamily='"Space Mono",monospace' fontSize="22" fill={COLORS.ink3}>{v >= 10000 ? "1万" : v}</text>
        </g>
      ))}
      <line x1={mL} y1={mT + iH} x2={mL + iW} y2={mT + iH} stroke={COLORS.line} strokeWidth="1.5" />

      {/* primary: valuation */}
      {type === "area" && <path d={areaPath} fill={focusEnabled ? "rgba(39,66,236,0.10)" : COLORS.fog} stroke="none" />}
      {(type === "area" || type === "step") && (
        <path d={type === "step" ? stepPath : valPts.map((pt, i) => (i ? "L" : "M") + pt[0] + " " + pt[1]).join(" ")}
          fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
      )}
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        const fill = hot ? accent : (focusEnabled ? COLORS.ink3 : COLORS.ink);
        if (type === "bar") {
          return <rect key={i} x={cx(i) - barW / 2} y={yV(d.val)} width={barW} height={mT + iH - yV(d.val)} fill={fill} />;
        }
        return <circle key={i} cx={cx(i)} cy={yV(d.val)} r={hot ? 13 : 9} fill={fill} />;
      })}

      {/* valuation value labels */}
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        return (
          <text key={i} x={cx(i)} y={yV(d.val) - 18} textAnchor="middle"
            fontFamily='"Archivo",sans-serif' fontWeight="800" fontSize={hot ? 38 : 28}
            fill={hot ? accent : COLORS.ink2} fontFeatureSettings='"tnum" 1'>{d.val}</text>
        );
      })}

      {/* secondary: ticket size */}
      {showSecondary && (
        <>
          <path d={raisePath} fill="none" stroke={COLORS.blue} strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
          {raisePts.map((pt, i) => (
            <circle key={i} cx={pt[0]} cy={pt[1]} r="5" fill={COLORS.bg} stroke={COLORS.blue} strokeWidth="2.5" />
          ))}
          {[0, 100, 200, 300].map((v) => (
            <text key={v} x={mL + iW + 14} y={yR(v) + 6} textAnchor="start"
              fontFamily='"Space Mono",monospace' fontSize="22" fill={COLORS.blue}>{v}</text>
          ))}
        </>
      )}

      {/* x labels */}
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        return (
          <g key={i}>
            <text x={cx(i)} y={mT + iH + 40} textAnchor="middle"
              fontFamily='"Archivo","Noto Sans SC",sans-serif' fontWeight={hot ? 800 : 600} fontSize="28"
              fill={hot ? accent : COLORS.ink}>{d.label}</text>
            <text x={cx(i)} y={mT + iH + 66} textAnchor="middle"
              fontFamily='"Space Mono",monospace' fontSize="20" letterSpacing="0.04em" fill={COLORS.ink3}>{d.en}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ValuationJumpSlide(props) {
  const p = { ...defaultProps, ...props };
  const DATA = p.data || [];
  const accent = "var(--rd-blue)";
  const f = DATA[Math.min(p.focusIndex, DATA.length - 1)];

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 60, paddingTop: 36, minHeight: 0 }}>
          {/* chart */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.75, display: "flex", flexDirection: "column" }}>
            <h2 className="rd-title">{p.title}</h2>
            <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 16 }}>
              <JumpChart type={p.chartType} showSecondary={p.showSecondary} showGrid={p.showGrid}
                focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} accent={COLORS.blue} data={DATA} />
            </div>
            <div className="rd-mono" style={{ display: "flex", gap: 32, fontSize: 24, marginTop: 4 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <i style={{ width: 16, height: 16, background: COLORS.ink, display: "inline-block" }} />{p.primaryLegend}
              </span>
              {p.showSecondary && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <i style={{ width: 18, height: 0, borderTop: `2px dashed ${COLORS.blue}`, display: "inline-block" }} />{p.secondaryLegend}
                </span>
              )}
            </div>
          </div>

          {/* side panel */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: "1px solid var(--rd-line)", paddingLeft: 52, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {p.focusEnabled && (
              <div style={{ marginBottom: 30 }}>
                <div className="rd-mono" style={{ color: accent, marginBottom: 8 }}>↳ {f.label} · {f.en}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="rd-figure" style={{ fontSize: 104 }}>{f.val}</span>
                  <span className="rd-sub" style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{p.focusUnit}</span>
                </div>
                <p className="rd-cap" style={{ marginTop: 6 }}>{p.focusRaisePre}{f.raise}{p.focusRaiseSuffix}</p>
              </div>
            )}
            {p.showCallout && (
              <div style={{ paddingTop: 26, borderTop: `2px solid var(--rd-blue)` }}>
                <div className="rd-mono" style={{ color: accent, marginBottom: 12 }}>{p.calloutLabel}</div>
                <p className="rd-cap">
                  {p.calloutBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={186} rotate={6} pos={{ right: 64, top: 150 }} />
    </div>
  );
}
