import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   TrendSlide — quarterly funding trend (市场全景 · 纵向趋势).
   A self-contained SVG chart driven entirely by props: chart type, the
   optional secondary series, gridlines, and a focusable datum.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chartType", label: "图表类型", type: "select", default: "line",
    options: [
      { value: "line", label: "折线" },
      { value: "bar", label: "柱状" },
      { value: "area", label: "面积" },
    ], help: "主数据系列的呈现方式" },
  { key: "showSecondary", label: "次级系列", type: "toggle", default: true,
    help: "叠加「事件笔数」次级折线及右轴" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "图表背景的水平网格线" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某个数据点并显示数值" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 3, step: 1,
    help: "被高亮的数据点序号（从 0 起）" },
  { key: "showAnnotation", label: "装饰解读", type: "toggle", default: true,
    help: "右侧趋势解读文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chartType: "line",
  showSecondary: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 2,
  showAnnotation: true,
  // —— visible content (override per deck) ——
  eyebrow: "市场全景 / 02",
  kicker: "单笔 ≥1 亿美元 · 单位：亿美元",
  chartTitle: "逐季度融资额走势",
  figureValue: "970",
  figureUnit: "亿美元",
  figureCaption: "全年合计 · 97 笔事件 · 平均单笔约 10 亿美元",
  annotationLabel: "↳ 趋势解读",
  annotationBody: "Q2、Q3 为融资高峰，进入 Q4 有所回落但仍处高位。市场对头部标的高度追捧，全年呈「前高后稳」态势。",
  primaryLegend: "融资总额",
  secondaryLegend: "事件笔数",
  data: [
    { label: "Q1", amount: 162, count: 18 },
    { label: "Q2", amount: 284, count: 26 },
    { label: "Q3", amount: 318, count: 31 },
    { label: "Q4", amount: 206, count: 22 },
  ],
  ...decorDefaults,
};

function TrendChart({ type, showSecondary, showGrid, focusEnabled, focusIndex, accent, data }) {
  const DATA = data || [];
  const W = 1000, H = 540;
  const mL = 70, mR = showSecondary ? 64 : 24, mT = 40, mB = 64;
  const iW = W - mL - mR, iH = H - mT - mB;
  const aMax = 360, cMax = 40;
  const n = DATA.length;

  const slot = iW / n;
  const cx = (i) => mL + slot * i + slot / 2;
  const yA = (v) => mT + iH - (v / aMax) * iH;
  const yC = (v) => mT + iH - (v / cMax) * iH;

  const gridVals = [0, 90, 180, 270, 360];
  const linePts = DATA.map((d, i) => [cx(i), yA(d.amount)]);
  const linePath = linePts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
  const areaPath = `${linePath} L ${cx(n - 1)} ${mT + iH} L ${cx(0)} ${mT + iH} Z`;
  const countPts = DATA.map((d, i) => [cx(i), yC(d.count)]);
  const countPath = countPts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");

  const barW = slot * 0.46;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      {/* gridlines + left axis labels */}
      {gridVals.map((v) => (
        <g key={v}>
          {showGrid && <line x1={mL} y1={yA(v)} x2={mL + iW} y2={yA(v)} stroke={COLORS.line2} strokeWidth="1" />}
          <text x={mL - 14} y={yA(v) + 6} textAnchor="end" fontFamily='"Space Mono",monospace' fontSize="24" fill={COLORS.ink3}>{v}</text>
        </g>
      ))}
      {/* baseline */}
      <line x1={mL} y1={mT + iH} x2={mL + iW} y2={mT + iH} stroke={COLORS.line} strokeWidth="1.5" />

      {/* focus guide */}
      {focusEnabled && (
        <line x1={cx(focusIndex)} y1={mT} x2={cx(focusIndex)} y2={mT + iH} stroke={accent} strokeWidth="1" strokeDasharray="4 5" opacity="0.6" />
      )}

      {/* primary series */}
      {type === "bar" ? (
        DATA.map((d, i) => {
          const hot = focusEnabled && i === focusIndex;
          return (
            <rect key={i} x={cx(i) - barW / 2} y={yA(d.amount)} width={barW} height={mT + iH - yA(d.amount)}
              fill={hot ? accent : (focusEnabled ? COLORS.ink3 : COLORS.ink)} />
          );
        })
      ) : (
        <>
          {type === "area" && <path d={areaPath} fill={accent} opacity="0.12" />}
          <path d={linePath} fill="none" stroke={COLORS.ink} strokeWidth="2.5" strokeLinejoin="round" />
          {linePts.map((pt, i) => {
            const hot = focusEnabled && i === focusIndex;
            return <circle key={i} cx={pt[0]} cy={pt[1]} r={hot ? 8 : 4.5}
              fill={hot ? accent : COLORS.ink} stroke={hot ? "#fff" : "none"} strokeWidth={hot ? 2 : 0} />;
          })}
        </>
      )}

      {/* focus value label */}
      {focusEnabled && (
        <text x={cx(focusIndex)} y={yA(DATA[focusIndex].amount) - 20} textAnchor="middle"
          fontFamily='"Archivo",sans-serif' fontWeight="800" fontSize="34" fill={accent}>
          {DATA[focusIndex].amount}
        </text>
      )}

      {/* secondary series */}
      {showSecondary && (
        <>
          <path d={countPath} fill="none" stroke={COLORS.blue} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
          {countPts.map((pt, i) => (
            <circle key={i} cx={pt[0]} cy={pt[1]} r="3.5" fill={COLORS.bg} stroke={COLORS.blue} strokeWidth="2" />
          ))}
          {[0, 10, 20, 30, 40].map((v) => (
            <text key={v} x={mL + iW + 14} y={yC(v) + 6} textAnchor="start"
              fontFamily='"Space Mono",monospace' fontSize="24" fill={COLORS.blue}>{v}</text>
          ))}
        </>
      )}

      {/* x labels */}
      {DATA.map((d, i) => (
        <text key={i} x={cx(i)} y={mT + iH + 38} textAnchor="middle"
          fontFamily='"Space Mono",monospace' fontSize="24" letterSpacing="1"
          fill={focusEnabled && i === focusIndex ? accent : COLORS.ink2}>{d.label} 2024</text>
      ))}
    </svg>
  );
}

export default function TrendSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = "var(--rd-blue)";

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 64, paddingTop: 40 }}>
          {/* chart */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.7, display: "flex", flexDirection: "column" }}>
            <h2 className="rd-title">{p.chartTitle}</h2>
            <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 20 }}>
              <TrendChart
                type={p.chartType}
                showSecondary={p.showSecondary}
                showGrid={p.showGrid}
                focusEnabled={p.focusEnabled}
                focusIndex={p.focusIndex}
                accent={COLORS.blue}
                data={p.data}
              />
            </div>
            {/* legend */}
            <div className="rd-mono" style={{ display: "flex", gap: 32, fontSize: 24, marginTop: 4 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <i style={{ width: 18, height: 3, background: COLORS.ink, display: "inline-block" }} />{p.primaryLegend}
              </span>
              {p.showSecondary && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <i style={{ width: 18, height: 0, borderTop: `2px dashed ${COLORS.blue}`, display: "inline-block" }} />{p.secondaryLegend}
                </span>
              )}
            </div>
          </div>

          {/* side panel */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: "1px solid var(--rd-line)", paddingLeft: 56, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="rd-figure" style={{ fontSize: 132 }}>{p.figureValue}</span>
              <span className="rd-sub" style={{ fontWeight: 700 }}>{p.figureUnit}</span>
            </div>
            <p className="rd-cap" style={{ marginTop: 6 }}>{p.figureCaption}</p>

            {p.showAnnotation && (
              <div style={{ marginTop: 44, paddingTop: 26, borderTop: `2px solid ${"var(--rd-blue)"}` }}>
                <div className="rd-mono" style={{ color: accent, marginBottom: 12 }}>{p.annotationLabel}</div>
                <p className="rd-cap">
                  {p.annotationBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={196} rotate={5} pos={{ right: 60, top: 150 }} />
    </div>
  );
}
