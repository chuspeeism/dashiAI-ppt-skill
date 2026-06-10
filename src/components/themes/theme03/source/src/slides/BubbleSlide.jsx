import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   BubbleSlide — 图表 · Top 10 公司融资体量气泡阵 (data: 报告 3.3 Top 10 + 3.1 赛道).
   A proportional-bubble lineup: every Top-10 company is a circle whose AREA ∝
   its largest single round (亿美元, verbatim), grown from a common baseline and
   sorted descending so the three foundation-model giants visibly dwarf the rest
   ("赢家通吃"). Bubbles are shaded by sector (neutral ramp); the focused one
   pops in accent. Fixed-px SVG geometry. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showValues", label: "数值标注", type: "toggle", default: true,
    help: "各气泡的融资额数值显示 / 隐藏" },
  { key: "showLegend", label: "赛道图例", type: "toggle", default: true,
    help: "右上角赛道配色图例显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一家公司气泡" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 9, step: 1,
    help: "被高亮的公司序号（0 = 融资额最大，自动随数量收敛）" },
  { key: "showCallout", label: "结构解读", type: "toggle", default: true,
    help: "底部「赢家通吃」解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showValues: true,
  showLegend: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "头部玩家 / TOP 10",
  kicker: "2024 · 单笔最大融资额 · 亿美元",
  title: "融资体量 · 气泡阵",
  titleNote: "圆面积 ∝ 单笔融资额　·　按赛道着色",
  calloutLabel: "↳ 赢家通吃",
  calloutPre: "通用大模型三强 ",
  calloutStrong: "OpenAI / Anthropic / xAI 单笔即达 50–66 亿美元",
  calloutPost: "，体量碾压其余赛道——前三名吸纳的资金便超过 Top 10 其余七家之和，头部集中度一目了然。",
  sectors: ["通用大模型", "AI 基础设施", "垂直应用", "AI 硬件"],
  companies: [
    { name: "OpenAI",       amt: 66,  s: 0 },
    { name: "Anthropic",    amt: 65,  s: 0 },
    { name: "xAI",          amt: 50,  s: 0 },
    { name: "CoreWeave",    amt: 11,  s: 1 },
    { name: "Scale AI",     amt: 10,  s: 1 },
    { name: "SSI",          amt: 10,  s: 0 },
    { name: "Figure AI",    amt: 6.8, s: 3 },
    { name: "Perplexity",   amt: 5.2, s: 2 },
    { name: "Databricks",   amt: 5.0, s: 1 },
    { name: "Glean",        amt: 2.6, s: 2 },
  ],
  ...decorDefaults,
};

export default function BubbleSlide(props) {
  const p = { ...defaultProps, ...props };
  const SECTORS = p.sectors || [];
  const COMPANIES = p.companies || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const n = COMPANIES.length;
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  // sector → neutral ramp shade
  const shade = (s) => RAMP[[1, 2, 3, 4][s]];

  // geometry
  const W = 1680, H = 560;
  const mX = 24, baseline = 408;
  const k = 13;                                   // r = k·√amt → area ∝ amt
  const r = COMPANIES.map((c) => k * Math.sqrt(c.amt));
  const totalDia = r.reduce((a, v) => a + 2 * v, 0);
  const gap = (W - 2 * mX - totalDia) / (n - 1);
  let cur = mX;
  const cx = r.map((rr) => { const x = cur + rr; cur += 2 * rr + gap; return x; });

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

        {/* legend */}
        {p.showLegend && (
          <div className="rd-anim rd-anim-2" style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 14 }}>
            {SECTORS.map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 15, height: 15, borderRadius: 999, background: shade(i), flex: "none" }} />
                <span className="rd-mono" style={{ fontSize: 18, color: COLORS.ink2, textTransform: "none", letterSpacing: 0 }}>{s}</span>
              </span>
            ))}
          </div>
        )}

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 6 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {/* ground line */}
            <line x1={mX} y1={baseline} x2={W - mX} y2={baseline} stroke={COLORS.line} strokeWidth="1.5" />
            {COMPANIES.map((c, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const rr = r[i], yc = baseline - rr;
              const fill = hot ? accent : shade(c.s);
              const big = rr > 34;
              return (
                <g key={i} opacity={dim ? 0.55 : 1}>
                  <circle cx={cx[i]} cy={yc} r={rr} fill={fill} />
                  {/* amount value */}
                  {p.showValues && (
                    big ? (
                      <text x={cx[i]} y={yc + 9} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="800"
                        fontSize={Math.min(40, rr * 0.62)} fill={dark ? "#161513" : "#f3f2ee"}
                        style={{ fontFeatureSettings: '"tnum" 1' }}>{c.amt}</text>
                    ) : (
                      <text x={cx[i]} y={yc - rr - 12} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="800"
                        fontSize="22" fill={hot ? accent : COLORS.ink}
                        style={{ fontFeatureSettings: '"tnum" 1' }}>{c.amt}</text>
                    )
                  )}
                  {/* company name — vertical, below the ground line */}
                  <text x={cx[i]} y={baseline + 18} textAnchor="end"
                    transform={`rotate(-90 ${cx[i]} ${baseline + 18})`}
                    fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize="22"
                    fill={hot ? accent : COLORS.ink}>{c.name}</text>
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
