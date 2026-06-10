import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   TornadoSlide — 轮次「笔数 ↔ 金额」背向条形图 (data: 报告 3.2 轮次结构).
   A back-to-back tornado: left = 事件笔数 (verbatim), right = 估算金额
   (= 笔数 × 平均单笔, both verbatim from the report). Reveals that late rounds
   are few deals but most capital. Fixed-px SVG geometry. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showValues", label: "数值标注", type: "toggle", default: true,
    help: "两侧条形末端数值显示 / 隐藏" },
  { key: "showAxis", label: "两侧轴名", type: "toggle", default: true,
    help: "左右两栏「笔数 / 金额」轴名显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个轮次" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 4, min: 0, max: 5, step: 1,
    help: "被高亮的轮次序号（0 = 种子轮）" },
  { key: "showCallout", label: "结构解读", type: "toggle", default: true,
    help: "底部「少笔数、多资金」解读显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮轮次的条形与数值强调色" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showValues: true,
  showAxis: true,
  focusEnabled: true,
  focusIndex: 4,
  showCallout: true,
  accent: "blue",
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / ROUND STRUCTURE",
  kicker: "2024 · 97 笔 · 金额 = 笔数 × 平均单笔",
  title: "轮次结构 · 笔数 ↔ 金额",
  titleNote: "左：事件笔数　右：估算资金量级",
  axisLeft: "事件笔数 ◂",
  axisRight: "▸ 估算金额 / 亿美元",
  calloutLabel: "↳ 结构解读",
  calloutPre: "笔数沿轮次抬升，但",
  calloutStrong: "资金量级在 D 轮及以后陡然放大",
  calloutPost: "——后期 + 未标明轮次约占四成笔数，却吸纳近八成资金，\"钱往后期头部集中\"的特征一目了然。",
  rounds: [
    { name: "种子轮",   cnt: 8,  avg: 1.2 },
    { name: "A 轮",     cnt: 12, avg: 1.8 },
    { name: "B 轮",     cnt: 18, avg: 3.5 },
    { name: "C 轮",     cnt: 15, avg: 6.8 },
    { name: "D 轮及以后", cnt: 22, avg: 15.2 },
    { name: "未标明轮次", cnt: 22, avg: 18.6 },
  ],
  ...decorDefaults,
};

export default function TornadoSlide(props) {
  const p = { ...defaultProps, ...props };
  const ROUNDS = (p.rounds || []).map((r) => ({ ...r, amt: Math.round(r.cnt * r.avg * 10) / 10 }));
  const dark = p.theme === "dark";
  // accent = the highlighted bar fill; accentText keeps the highlighted labels
  // legible (lime text would wash out on the light field, so fall back to ink).
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentText = p.accent === "lime" ? (dark ? COLORS.lime : COLORS.ink) : COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), ROUNDS.length - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const neutral = dark ? "#6f6d68" : "#a9a7a1";

  const W = 1680, H = 540, mT = 56, mB = 16;
  const cLabW = 240, gap = 18;
  const cxL = (W - cLabW) / 2, cxR = (W + cLabW) / 2;
  const maxBarL = cxL - 40 - gap, maxBarR = (W - 40) - cxR - gap;
  const maxCnt = 22, maxAmt = Math.max(...ROUNDS.map((r) => r.amt));
  const rowH = (H - mT - mB) / ROUNDS.length;
  const barH = rowH * 0.56;

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

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {p.showAxis && (
              <g>
                <text x={cxL - gap} y={36} textAnchor="end" fontFamily={FONTS.mono} fontSize="18" fill={axisCol} style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.axisLeft}</text>
                <text x={cxR + gap} y={36} textAnchor="start" fontFamily={FONTS.mono} fontSize="18" fill={axisCol} style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.axisRight}</text>
              </g>
            )}
            {ROUNDS.map((r, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const cy = mT + rowH * i + rowH / 2;
              const lLen = (r.cnt / maxCnt) * maxBarL;
              const rLen = (r.amt / maxAmt) * maxBarR;
              const col = hot ? accent : neutral;
              return (
                <g key={i} opacity={dim ? 0.5 : 1}>
                  {/* center label */}
                  <text x={W / 2} y={cy + 7} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize="22" fill={hot ? accentText : COLORS.ink}>{r.name}</text>
                  {/* left bar (笔数) */}
                  <rect x={cxL - gap - lLen} y={cy - barH / 2} width={lLen} height={barH} fill={col} />
                  {p.showValues && <text x={cxL - gap - lLen - 12} y={cy + 7} textAnchor="end" fontFamily={FONTS.sans} fontWeight="800" fontSize="22" fill={hot ? accentText : COLORS.ink} style={{ fontFeatureSettings: '"tnum" 1' }}>{r.cnt}</text>}
                  {/* right bar (金额) */}
                  <rect x={cxR + gap} y={cy - barH / 2} width={rLen} height={barH} fill={hot ? accent : (dark ? "#cfcdc7" : COLORS.ink)} />
                  {p.showValues && <text x={cxR + gap + rLen + 12} y={cy + 7} textAnchor="start" fontFamily={FONTS.sans} fontWeight="800" fontSize="22" fill={hot ? accentText : COLORS.ink} style={{ fontFeatureSettings: '"tnum" 1' }}>{r.amt}</text>}
                </g>
              );
            })}
            {/* center divider */}
            <line x1={W / 2} y1={mT - 6} x2={W / 2} y2={H - mB} stroke={COLORS.line2} strokeWidth="1" />
          </svg>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accentText, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutPre}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{p.calloutStrong}</strong>{p.calloutPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={-7} pos={{ right: 44, top: 102 }} />
    </div>
  );
}
