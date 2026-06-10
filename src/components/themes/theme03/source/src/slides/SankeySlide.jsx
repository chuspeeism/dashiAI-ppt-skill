import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   SankeySlide — 资本流向桑基图 (data: 报告 3.1 赛道占比 + 第四章 产业链分层).
   A two-stage Sankey routes the year's total (970 亿) through the 5 funding
   sectors and into the 3 supply-chain layers (上/中/下游). Ribbon widths are
   strictly ∝ amount; layer assignment follows the report's chain mapping.
   Fixed-px SVG geometry. Pure / portable — all variable parts are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showLayers", label: "产业链分层", type: "toggle", default: true,
    help: "右侧「上 / 中 / 下游」汇聚列显示 / 隐藏（关闭则仅看赛道分流）" },
  { key: "showValues", label: "数值标注", type: "toggle", default: true,
    help: "各节点金额 / 占比显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一条赛道流" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的赛道序号（0 = 通用大模型）" },
  { key: "showCallout", label: "趋势解读", type: "toggle", default: true,
    help: "底部流向解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showLayers: true,
  showValues: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / FLOW OF CAPITAL",
  kicker: "2024 · 全年 970 亿美元 · 97 笔",
  title: "资本流向 · 桑基图",
  titleNote: "从总盘 → 五大赛道 → 产业链上 / 中 / 下游",
  captionTotal: "全年总额",
  captionSector: "业务赛道",
  captionLayer: "产业链层级",
  totalValue: "970",
  totalUnit: "亿美元 · 100%",
  calloutLabel: "↳ 流向解读",
  calloutSegments: [
    { t: "资金主流汇入" },
    { t: "中游模型层", b: true },
    { t: "（420 亿，43.3%）；上游基础设施 + 芯片合计 " },
    { t: "255 亿", b: true },
    { t: "（26.3%），\"卖铲子\"环节热度不减；下游应用层 295 亿承接落地需求——产业链三层均被重金押注，但确定性自上而下递减。" },
  ],
  total: 970,
  layers: [
    { id: "up",   name: "上游 · 基础设施" },
    { id: "mid",  name: "中游 · 模型层" },
    { id: "down", name: "下游 · 应用层" },
  ],
  sectors: [
    { name: "通用大模型",   amt: 420, pct: "43.3%", layer: "mid"  },
    { name: "垂直应用",     amt: 245, pct: "25.3%", layer: "down" },
    { name: "AI 基础设施",  amt: 158, pct: "16.3%", layer: "up"   },
    { name: "AI 芯片",      amt: 97,  pct: "10.0%", layer: "up"   },
    { name: "其他工具链",   amt: 50,  pct: "5.1%",  layer: "down" },
  ],
  copy: {
    t001: "亿 ·",
    t002: "亿 ·",
  },
  ...decorDefaults,
};

export default function SankeySlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const TOTAL = p.total;
  const LAYERS = p.layers || [];
  const SECTORS = p.sectors || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), SECTORS.length - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const showLayers = p.showLayers;
  // Monochrome-blue ramp for the flow — keeps the sankey on a single hue that
  // harmonizes with the blue total node + accent text (replaces the muddy
  // neutral-gray ramp). Ordered accent → progressively lighter tints.
  const BLUE = dark
    ? ["#6e85ff", "#8193ff", "#94a3ff", "#aab6ff", "#c3cbff"]
    : ["#2742ec", "#4659ee", "#6675f0", "#8c97ec", "#aab1ee"];

  // geometry --------------------------------------------------------------
  const W = 1680, H = 556;
  const yTop = 18, yBot = H - 18;
  const areaH = yBot - yTop;
  const nodeW = 26;
  const xTotal = 8;
  const xSec = 560;
  const xLayer = W - nodeW - 8;

  // shared value→px scale, reserving gaps between the 5 sector nodes
  const secGap = 22;
  const sScale = (areaH - secGap * (SECTORS.length - 1)) / TOTAL;
  const px = (v) => v * sScale;

  // sector node y positions (stacked top→bottom by report order)
  let cy = yTop;
  const sec = SECTORS.map((s, i) => {
    const h = px(s.amt);
    const node = { ...s, idx: i, y0: cy, h, color: BLUE[i % BLUE.length] };
    cy += h + secGap;
    return node;
  });

  // total node spans the full stack height (no internal gaps)
  const totalH = px(TOTAL);
  const totalY0 = yTop + (areaH - totalH) / 2;

  // layer nodes: height = sum of member sectors (+ internal gap echo)
  const layerData = LAYERS.map((L) => {
    const members = sec.filter((s) => s.layer === L.id);
    const amt = members.reduce((a, b) => a + b.amt, 0);
    return { ...L, members, amt, h: px(amt) };
  }).filter((L) => L.members.length);
  const layGap = 26;
  let ly = yTop + (areaH - layGap * (layerData.length - 1) - layerData.reduce((a, b) => a + b.h, 0)) / 2;
  layerData.forEach((L) => { L.y0 = ly; ly += L.h + layGap; });

  // inflow offset within the total node (cumulative), in report order
  let tOff = 0;
  const totalOffsets = sec.map((s) => { const o = tOff; tOff += s.h; return o; });
  // outflow offset within each layer node (cumulative)
  const layOff = {};
  layerData.forEach((L) => { layOff[L.id] = L.y0; });

  // ribbon builder: a horizontal band with cubic-bezier edges
  const ribbon = (x0, ya0, x1, yb0, h) => {
    const xm = (x0 + x1) / 2;
    const ya1 = ya0 + h, yb1 = yb0 + h;
    return `M${x0},${ya0} C${xm},${ya0} ${xm},${yb0} ${x1},${yb0} `
         + `L${x1},${yb1} C${xm},${yb1} ${xm},${ya1} ${x0},${ya1} Z`;
  };

  const dimOf = (i) => p.focusEnabled && i !== fi;

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

        {/* column captions */}
        <div className="rd-anim rd-anim-2" style={{ display: "flex", justifyContent: "space-between", marginTop: 14, marginBottom: 2 }}>
          <span className="rd-mono" style={{ fontSize: 17, color: axisCol }}>{p.captionTotal}</span>
          <span className="rd-mono" style={{ fontSize: 17, color: axisCol, marginLeft: showLayers ? "-26%" : 0 }}>{p.captionSector}</span>
          {showLayers && <span className="rd-mono" style={{ fontSize: 17, color: axisCol }}>{p.captionLayer}</span>}
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              {sec.map((s, i) => (
                <linearGradient key={"g" + i} id={`sankGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.46" />
                </linearGradient>
              ))}
              <linearGradient id="sankGradHot" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
                <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* total → sector ribbons */}
            {sec.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <path key={"ts" + i}
                  d={ribbon(xTotal + nodeW, totalY0 + totalOffsets[i], xSec, s.y0, s.h)}
                  fill={hot ? "url(#sankGradHot)" : `url(#sankGrad${i})`} opacity={dimOf(i) ? 0.2 : 1} />
              );
            })}
            {/* sector → layer ribbons */}
            {showLayers && sec.map((s, i) => {
              const o = layOff[s.layer];
              layOff[s.layer] += s.h;
              const hot = p.focusEnabled && i === fi;
              return (
                <path key={"sl" + i}
                  d={ribbon(xSec + nodeW, s.y0, xLayer, o, s.h)}
                  fill={hot ? "url(#sankGradHot)" : `url(#sankGrad${i})`} opacity={dimOf(i) ? 0.2 : 1} />
              );
            })}

            {/* total node */}
            <rect x={xTotal} y={totalY0} width={nodeW} height={totalH} fill={accent} />
            <text x={xTotal + nodeW + 16} y={totalY0 + totalH / 2 - 6} fontFamily={FONTS.sans} fontWeight="900" fontSize="40" fill={COLORS.ink} style={{ fontFeatureSettings: '"tnum" 1' }}>{p.totalValue}</text>
            <text x={xTotal + nodeW + 16} y={totalY0 + totalH / 2 + 24} fontFamily={FONTS.mono} fontSize="18" fill={axisCol}>{p.totalUnit}</text>

            {/* sector nodes + labels */}
            {sec.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = dimOf(i);
              return (
                <g key={"sn" + i} opacity={dim ? 0.5 : 1}>
                  <rect x={xSec} y={s.y0} width={nodeW} height={s.h} fill={hot ? accent : s.color} />
                  <text x={xSec - 14} y={s.y0 + s.h / 2 - 4} textAnchor="end" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize="24" fill={hot ? accent : COLORS.ink}>{s.name}</text>
                  {p.showValues && (
                    <text x={xSec - 14} y={s.y0 + s.h / 2 + 22} textAnchor="end" fontFamily={FONTS.mono} fontSize="18" fill={axisCol}>{s.amt}{copy.t001}{s.pct}</text>
                  )}
                </g>
              );
            })}

            {/* layer nodes + labels */}
            {showLayers && layerData.map((L, i) => (
              <g key={"ln" + i}>
                <rect x={xLayer} y={L.y0} width={nodeW} height={L.h} fill={dark ? "#cfcdc7" : COLORS.ink} />
                <text x={xLayer - 14} y={L.y0 + L.h / 2 - 4} textAnchor="end" fontFamily={FONTS.sans} fontWeight="800" fontSize="23" fill={COLORS.ink}>{L.name}</text>
                {p.showValues && (
                  <text x={xLayer - 14} y={L.y0 + L.h / 2 + 22} textAnchor="end" fontFamily={FONTS.mono} fontSize="18" fill={axisCol}>{L.amt}{copy.t002}{(L.amt / TOTAL * 100).toFixed(1)}%</text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
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
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={-8} pos={{ left: 360, top: 96 }} />
    </div>
  );
}
