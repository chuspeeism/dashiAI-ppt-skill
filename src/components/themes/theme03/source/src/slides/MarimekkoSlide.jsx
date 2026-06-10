import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   MarimekkoSlide — 产业链资金结构矩阵 / Marimekko (data: 报告 3.1 赛道金额 +
   第四章 产业链分层). Three layer-columns (width ∝ 层总额) each split into its
   member sectors (height ∝ 赛道金额 / 层总额). Every block's area ∝ 该赛道金额.
   Figures verbatim. Fixed-px SVG geometry. Pure / portable — all props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showValues", label: "金额标注", type: "toggle", default: true,
    help: "各赛道金额显示 / 隐藏" },
  { key: "showPercent", label: "占比标注", type: "toggle", default: true,
    help: "各赛道占全年总额的百分比显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个赛道块" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的赛道序号（0 = 通用大模型）" },
  { key: "showCallout", label: "结构解读", type: "toggle", default: true,
    help: "底部资金结构解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showValues: true,
  showPercent: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / STRUCTURE",
  kicker: "2024 · 全年 970 亿美元 · 块面积 ∝ 金额",
  title: "产业链资金结构矩阵",
  titleNote: "列宽 ∝ 层级总额 · 段高 ∝ 层内赛道占比",
  calloutLabel: "↳ 结构解读",
  calloutPre: "中游模型层以单一赛道",
  calloutStrong: "通用大模型",
  calloutPost: "独占 43.3%、列宽最大；上游靠基础设施 + 芯片两段堆出 26.3%；下游由垂直应用主导、其他工具链补足——一图看清「钱去了哪层、又压在哪个赛道」。",
  total: 970,
  layers: [
    { name: "上游 · 基础设施", total: 255, members: [
      { fi: 2, name: "AI 基础设施", amt: 158 },
      { fi: 3, name: "AI 芯片", amt: 97 },
    ] },
    { name: "中游 · 模型层", total: 420, members: [
      { fi: 0, name: "通用大模型", amt: 420 },
    ] },
    { name: "下游 · 应用层", total: 295, members: [
      { fi: 1, name: "垂直应用", amt: 245 },
      { fi: 4, name: "其他工具链", amt: 50 },
    ] },
  ],
  copy: {
    t001: "亿 ·",
  },
  ...decorDefaults,
};
// 按填充色亮度选择可读文字色
function textOn(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#161513" : "#f3f2ee";
}

export default function MarimekkoSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const TOTAL = p.total;
  const LAYERS = p.layers || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), 4);
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  const W = 1680, H = 540, yTop = 92, yBot = H - 6;
  const colH = yBot - yTop;
  const colGap = 12, segGap = 4;
  const usableW = W - colGap * (LAYERS.length - 1);

  let cx = 0;
  const cols = LAYERS.map((L) => {
    const w = (L.total / TOTAL) * usableW;
    const x = cx;
    cx += w + colGap;
    return { ...L, x, w };
  });

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

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 12 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {cols.map((L, ci) => {
              let y = yTop;
              return (
                <g key={ci}>
                  {/* column header */}
                  <text x={L.x} y={42} fontFamily={FONTS.sans} fontWeight="800" fontSize="24" fill={COLORS.ink}>{L.name}</text>
                  <text x={L.x} y={72} fontFamily={FONTS.mono} fontSize="18" fill={axisCol}>{L.total}{copy.t001}{(L.total / TOTAL * 100).toFixed(1)}%</text>
                  {/* segments */}
                  {L.members.map((m, mi) => {
                    const segH = (m.amt / L.total) * (colH - segGap * (L.members.length - 1));
                    const yy = y;
                    y += segH + segGap;
                    const hot = p.focusEnabled && m.fi === fi;
                    const dim = p.focusEnabled && !hot;
                    const big = segH > 70;
                    const segColor = hot ? accent : RAMP[m.fi];
                    const tCol = textOn(segColor);
                    return (
                      <g key={mi} opacity={dim ? 0.5 : 1}>
                        <rect x={L.x} y={yy} width={L.w} height={segH} fill={segColor} />
                        <text x={L.x + 18} y={yy + (big ? 36 : segH / 2 + 7)}
                          fontFamily={FONTS.sans} fontWeight="700" fontSize={big ? 24 : 19}
                          fill={tCol}>{m.name}</text>
                        {big && (p.showValues || p.showPercent) && (
                          <text x={L.x + 18} y={yy + 70} fontFamily={FONTS.mono} fontSize="19"
                            fill={tCol} fillOpacity="0.82">
                            {p.showValues ? `${m.amt} 亿` : ""}{p.showValues && p.showPercent ? " · " : ""}{p.showPercent ? `${(m.amt / TOTAL * 100).toFixed(1)}%` : ""}
                          </text>
                        )}
                        {!big && (p.showValues || p.showPercent) && (
                          <text x={L.x + L.w - 18} y={yy + segH / 2 + 7} textAnchor="end" fontFamily={FONTS.mono} fontSize="17"
                            fill={tCol} fillOpacity="0.92">
                            {p.showValues ? `${m.amt}亿` : ""}{p.showPercent ? ` ${(m.amt / TOTAL * 100).toFixed(1)}%` : ""}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutPre}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{p.calloutStrong}</strong>{p.calloutPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={-7} pos={{ right: 44, top: 100 }} />
    </div>
  );
}
