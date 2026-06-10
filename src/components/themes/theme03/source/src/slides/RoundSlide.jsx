import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RoundSlide — 融资轮次结构对比 (grouped chart).
   Self-contained SVG: primary series = event count per round, optional
   secondary series = average ticket on a right axis. Driven entirely by props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chartType", label: "图表类型", type: "select", default: "bar",
    options: [{ value: "bar", label: "柱状" }, { value: "lollipop", label: "棒棒糖" }],
    help: "主数据系列（事件笔数）的呈现方式" },
  { key: "showSecondary", label: "次级系列", type: "toggle", default: true,
    help: "叠加「平均单笔金额」折线及右轴" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "图表背景的水平网格线" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某个轮次并显示数值" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 4, min: 0, max: 5, step: 1,
    help: "被高亮的轮次序号（从 0 起）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "右侧结构解读文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chartType: "bar",
  showSecondary: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 4,
  showCallout: true,
  // —— visible content (override per deck) ——
  eyebrow: "轮次结构 / 03",
  kicker: "97 笔 · 笔数 × 平均单笔（亿美元）",
  title: "融资轮次结构对比",
  primaryLegend: "事件笔数",
  secondaryLegend: "平均单笔",
  focusUnit: "亿美元 / 笔",
  focusCaptionSuffix: "笔事件 · 平均单笔金额",
  calloutLabel: "↳ 结构解读",
  calloutBody: "笔数集中在 B 轮及以后，资金则随轮次显著上移——平均单笔从种子轮的 1.2 亿攀升至 D+ 轮的 15.2 亿，呈现「后期化、巨额化」的典型特征。",
  data: [
    { label: "种子", en: "Seed", count: 8, avg: 1.2 },
    { label: "A 轮", en: "Series A", count: 12, avg: 1.8 },
    { label: "B 轮", en: "Series B", count: 18, avg: 3.5 },
    { label: "C 轮", en: "Series C", count: 15, avg: 6.8 },
    { label: "D+ 轮", en: "Series D+", count: 22, avg: 15.2 },
    { label: "未披露", en: "Undisc.", count: 22, avg: 18.6 },
  ],
  ...decorDefaults,
};

function RoundChart({ type, showSecondary, showGrid, focusEnabled, focusIndex, accent, data }) {
  const DATA = data || [];
  const W = 1040, H = 560;
  const mL = 64, mR = showSecondary ? 70 : 24, mT = 44, mB = 78;
  const iW = W - mL - mR, iH = H - mT - mB;
  const cMax = 24, aMax = 20;
  const n = DATA.length;
  const slot = iW / n;
  const cx = (i) => mL + slot * i + slot / 2;
  const yC = (v) => mT + iH - (v / cMax) * iH;
  const yA = (v) => mT + iH - (v / aMax) * iH;

  const grid = [0, 6, 12, 18, 24];
  const barW = slot * 0.4;
  const avgPts = DATA.map((d, i) => [cx(i), yA(d.avg)]);
  const avgPath = avgPts.map((pt, i) => (i ? "L" : "M") + pt[0] + " " + pt[1]).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      {grid.map((v) => (
        <g key={v}>
          {showGrid && <line x1={mL} y1={yC(v)} x2={mL + iW} y2={yC(v)} stroke={COLORS.line2} strokeWidth="1" />}
          <text x={mL - 14} y={yC(v) + 6} textAnchor="end" fontFamily='"Space Mono",monospace' fontSize="23" fill={COLORS.ink3}>{v}</text>
        </g>
      ))}
      <line x1={mL} y1={mT + iH} x2={mL + iW} y2={mT + iH} stroke={COLORS.line} strokeWidth="1.5" />

      {/* primary: event count */}
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        const fill = hot ? accent : (focusEnabled ? COLORS.ink3 : COLORS.ink);
        if (type === "lollipop") {
          return (
            <g key={i}>
              <line x1={cx(i)} y1={mT + iH} x2={cx(i)} y2={yC(d.count)} stroke={fill} strokeWidth="3" />
              <circle cx={cx(i)} cy={yC(d.count)} r={hot ? 13 : 9} fill={fill} />
            </g>
          );
        }
        return <rect key={i} x={cx(i) - barW / 2} y={yC(d.count)} width={barW} height={mT + iH - yC(d.count)} fill={fill} />;
      })}

      {/* count value labels */}
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        return (
          <text key={i} x={cx(i)} y={yC(d.count) - 16} textAnchor="middle"
            fontFamily='"Archivo",sans-serif' fontWeight="800" fontSize={hot ? 36 : 27}
            fill={hot ? accent : COLORS.ink2}>{d.count}</text>
        );
      })}

      {/* secondary: average ticket */}
      {showSecondary && (
        <>
          <path d={avgPath} fill="none" stroke={COLORS.blue} strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
          {avgPts.map((pt, i) => (
            <circle key={i} cx={pt[0]} cy={pt[1]} r="4" fill={COLORS.bg} stroke={COLORS.blue} strokeWidth="2.5" />
          ))}
          {[0, 5, 10, 15, 20].map((v) => (
            <text key={v} x={mL + iW + 14} y={yA(v) + 6} textAnchor="start"
              fontFamily='"Space Mono",monospace' fontSize="23" fill={COLORS.blue}>{v}</text>
          ))}
        </>
      )}

      {/* x labels */}
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        return (
          <g key={i}>
            <text x={cx(i)} y={mT + iH + 38} textAnchor="middle"
              fontFamily='"Archivo","Noto Sans SC",sans-serif' fontWeight={hot ? 800 : 600} fontSize="26"
              fill={hot ? accent : COLORS.ink}>{d.label}</text>
            <text x={cx(i)} y={mT + iH + 64} textAnchor="middle"
              fontFamily='"Space Mono",monospace' fontSize="20" letterSpacing="0.04em" fill={COLORS.ink3}>{d.en}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function RoundSlide(props) {
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
              <RoundChart type={p.chartType} showSecondary={p.showSecondary} showGrid={p.showGrid}
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
                  <span className="rd-figure" style={{ fontSize: 116 }}>{f.avg}</span>
                  <span className="rd-sub" style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{p.focusUnit}</span>
                </div>
                <p className="rd-cap" style={{ marginTop: 6 }}>{f.count} {p.focusCaptionSuffix}</p>
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
