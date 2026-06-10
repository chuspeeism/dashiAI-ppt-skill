import React from "react";
import { COLORS, RAMP } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   SectorSlide — sector funding share (横向透视 · 行业赛道占比).
   Donut / pie / bar driven by props, with a focusable segment, optional
   donut-center stat, legend and callout.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chartType", label: "图表类型", type: "select", default: "donut",
    options: [
      { value: "donut", label: "环形" },
      { value: "pie", label: "饼图" },
      { value: "bar", label: "条形" },
    ], help: "占比数据的呈现方式" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一赛道（环形 / 饼图会微微外移）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的赛道序号（从 0 起）" },
  { key: "dotFill", label: "点阵填充", type: "toggle", default: true,
    help: "高亮赛道叠加点阵 / 半调网点纹理（需开启重点突出）" },
  { key: "showCenter", label: "中心数据", type: "toggle", default: true,
    help: "环形图中心的合计数值（仅环形）" },
  { key: "showLegend", label: "图例明细", type: "toggle", default: true,
    help: "右侧赛道明细列表" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部核心发现文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chartType: "donut",
  focusEnabled: true,
  focusIndex: 0,
  dotFill: true,
  showCenter: true,
  showLegend: true,
  showCallout: true,
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / 03",
  kicker: "97 笔融资 · 按赛道归类",
  title: "行业赛道融资额占比",
  centerValue: "970",
  centerUnit: "亿美元 · 100%",
  calloutLabel: "↳ 核心发现",
  calloutBody: "通用大模型占据近半壁江山，反映投资人押注「AGI 叙事」；垂直应用紧随其后，显示市场已开始寻找商业化路径；基础设施与芯片合计超四分之一，上游投资热度不减。",
  data: [
    { label: "通用大模型", en: "Foundation Model", amount: 420, pct: 43.3 },
    { label: "垂直应用", en: "Vertical AI", amount: 245, pct: 25.3 },
    { label: "AI 基础设施", en: "Infrastructure", amount: 158, pct: 16.3 },
    { label: "AI 芯片", en: "Hardware", amount: 97, pct: 10.0 },
    { label: "其他", en: "Tooling · Safety", amount: 50, pct: 5.1 },
  ],
  copy: {
    t001: "亿",
  },
  ...decorDefaults,
};

const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
function arcPath(cx, cy, r0, r1, a0, a1) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(cx, cy, r1, a0);
  const [x1o, y1o] = polar(cx, cy, r1, a1);
  const [x1i, y1i] = polar(cx, cy, r0, a1);
  const [x0i, y0i] = polar(cx, cy, r0, a0);
  if (r0 === 0)
    return `M ${cx} ${cy} L ${x0o} ${y0o} A ${r1} ${r1} 0 ${large} 1 ${x1o} ${y1o} Z`;
  return `M ${x0o} ${y0o} A ${r1} ${r1} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${r0} ${r0} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

function SectorChart({ type, focusEnabled, focusIndex, showCenter, dotFill, accent, data, centerValue, centerUnit }) {
  const DATA = data || [];
  const S = 460, c = S / 2;
  const r1 = 200, r0 = type === "pie" ? 0 : 116;
  let a = -Math.PI / 2;
  const segs = DATA.map((d, i) => {
    const a0 = a, a1 = a + (d.pct / 100) * Math.PI * 2;
    a = a1;
    return { d, i, a0, a1, mid: (a0 + a1) / 2 };
  });
  return (
    <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ display: "block", overflow: "visible" }}>
      {/* evilcharts-style halftone: bg-colored dots punched into the focus arc */}
      <defs>
        <pattern id="rdSectorDots" width="5.5" height="5.5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <circle cx="2.75" cy="2.75" r="1.05" fill={COLORS.bg} />
        </pattern>
      </defs>
      {segs.map(({ d, i, a0, a1, mid }) => {
        const hot = focusEnabled && i === focusIndex;
        const dim = focusEnabled && i !== focusIndex;
        const off = hot && type !== "bar" ? 14 : 0;
        const [ox, oy] = polar(0, 0, off, mid);
        const path = arcPath(c + ox, c + oy, r0, r1, a0, a1);
        return (
          <g key={i}>
            <path d={path} fill={hot ? accent : RAMP[i]} opacity={dim ? 0.85 : 1}
              stroke={COLORS.bg} strokeWidth="2" />
            {hot && dotFill && <path d={path} fill="url(#rdSectorDots)" stroke="none" />}
          </g>
        );
      })}
      {type === "donut" && showCenter && (
        <>
          <text x={c} y={c - 6} textAnchor="middle" fontFamily='"Archivo",sans-serif' fontWeight="800" fontSize="64" fill={COLORS.ink}>{centerValue}</text>
          <text x={c} y={c + 30} textAnchor="middle" fontFamily='"Space Mono",monospace' fontSize="24" fill={COLORS.ink2}>{centerUnit}</text>
        </>
      )}
    </svg>
  );
}

function SectorBars({ focusEnabled, focusIndex, dotFill, accent, data }) {
  const DATA = data || [];
  const max = DATA.length ? Math.max(...DATA.map((d) => d.amount)) : 1;
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 22 }}>
      {DATA.map((d, i) => {
        const hot = focusEnabled && i === focusIndex;
        const fillStyle = hot
          ? (dotFill
              ? { background: accent, backgroundImage: `radial-gradient(${COLORS.bg} 1.05px, transparent 1.25px)`, backgroundSize: "5.5px 5.5px", backgroundPosition: "0 0" }
              : { background: accent })
          : { background: RAMP[i] };
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 26, color: hot ? accent : COLORS.ink }}>{d.label}</span>
              <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 24, color: COLORS.ink2 }}>{d.amount} · {d.pct}%</span>
            </div>
            <div style={{ height: 18, background: COLORS.fog }}>
              <div style={{ width: `${(d.amount / max) * 100}%`, height: "100%", ...fillStyle }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SectorSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const DATA = p.data || [];
  const accent = COLORS.blue;
  const isBar = p.chartType === "bar";

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <h2 className="rd-title rd-anim rd-anim-2" style={{ marginTop: 40 }}>{p.title}</h2>

        <div style={{ flex: 1, display: "flex", gap: 72, alignItems: "center", paddingTop: 16 }}>
          {/* chart */}
          <div className="rd-anim rd-anim-2" style={{ flex: isBar ? 1.1 : 0.9, display: "flex", justifyContent: "center" }}>
            {isBar
              ? <SectorBars focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} dotFill={p.dotFill} accent={accent} data={DATA} />
              : <SectorChart type={p.chartType} focusEnabled={p.focusEnabled} focusIndex={p.focusIndex} showCenter={p.showCenter} dotFill={p.dotFill} accent={accent} data={DATA} centerValue={p.centerValue} centerUnit={p.centerUnit} />}
          </div>

          {/* legend + callout */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: 28 }}>
            {p.showLegend && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {DATA.map((d, i) => {
                  const hot = p.focusEnabled && i === p.focusIndex;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "15px 0", borderBottom: `1px solid ${COLORS.line2}`,
                      opacity: p.focusEnabled && !hot ? 0.5 : 1,
                    }}>
                      <span style={{ width: 16, height: 16, flex: "none", background: hot ? accent : RAMP[i] }} />
                      <span style={{ flex: 1, fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 28, color: hot ? accent : COLORS.ink }}>{d.label}</span>
                      <span style={{ width: 116, textAlign: "right", whiteSpace: "nowrap", fontFamily: '"Archivo",sans-serif', fontWeight: 700, fontSize: 28 }}>{d.amount}<span style={{ fontSize: 24, color: COLORS.ink2 }}>{copy.t001}</span></span>
                      <span style={{ width: 92, textAlign: "right", whiteSpace: "nowrap", fontFamily: '"Space Mono",monospace', fontSize: 24, color: hot ? accent : COLORS.ink2 }}>{d.pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            {p.showCallout && (
              <div style={{ paddingTop: 4 }}>
                <div className="rd-mono" style={{ color: accent, marginBottom: 12 }}>{p.calloutLabel}</div>
                <p className="rd-cap">
                  {p.calloutBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={188} rotate={-3} pos={{ left: 86, bottom: 64 }} />
    </div>
  );
}
