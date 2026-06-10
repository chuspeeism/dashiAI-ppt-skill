import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   EscalationSlide — 融资轮次单笔阶梯 (data: 报告 3.2 轮次结构).
   An ascending staircase of 平均单笔 across rounds (Seed→D+), annotated with the
   ×multiple vs seed — dramatising the "资金巨额化 · 越往后单笔越大" story (≈12×).
   Figures verbatim. Fixed-px SVG geometry. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showStep", label: "阶梯连线", type: "toggle", default: true,
    help: "贯穿各柱顶的阶梯连线显示 / 隐藏" },
  { key: "showMultiple", label: "放大倍数", type: "toggle", default: true,
    help: "各轮相对种子轮的 ×倍数显示 / 隐藏" },
  { key: "showCount", label: "事件笔数", type: "toggle", default: true,
    help: "各轮事件笔数显示 / 隐藏" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "背景水平网格线显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一轮次并显示数值" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 4, min: 0, max: 4, step: 1,
    help: "被高亮的轮次序号（0 = 种子轮）" },
  { key: "showCallout", label: "结构解读", type: "toggle", default: true,
    help: "底部巨额化解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showStep: true,
  showMultiple: true,
  showCount: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 4,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / ESCALATION",
  kicker: "2024 · 轮次平均单笔 · 单位亿美元",
  title: "资金巨额化 · 单笔阶梯",
  titleNotePre: "种子轮 → D 轮及以后 · 平均单笔放大约 ",
  titleNoteStrong: "12×",
  calloutLabel: "↳ 解读",
  calloutPre: "单笔金额随轮次拾级而上——种子轮 1.2 亿，到 D 轮及以后跃升至 15.2 亿，放大约 ",
  calloutStrong: "12.7×",
  calloutPost: "。资金明显向后期、头部标的集中；早期虽笔数不少，但“巨额化”主要发生在成长后段。",
  rounds: [
    { label: "种子轮", en: "SEED",     avg: 1.2,  cnt: 8 },
    { label: "A 轮",   en: "SERIES A", avg: 1.8,  cnt: 12 },
    { label: "B 轮",   en: "SERIES B", avg: 3.5,  cnt: 18 },
    { label: "C 轮",   en: "SERIES C", avg: 6.8,  cnt: 15 },
    { label: "D 轮及以后", en: "SERIES D+", avg: 15.2, cnt: 22 },
  ],
  copy: {
    t001: "笔 ·",
  },
  ...decorDefaults,
};

export default function EscalationSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const ROUNDS = p.rounds || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), ROUNDS.length - 1);
  const data = ROUNDS.map((r) => ({ ...r, mult: r.avg / ROUNDS[0].avg }));

  const W = 1680, H = 520, mL = 64, mR = 48, mT = 96, mB = 92;
  const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
  const maxV = 17;
  const Y = (v) => y1 - (v / maxV) * (y1 - y0);
  const n = data.length, slot = (x1 - x0) / n, barW = slot * 0.52;
  const cx = (i) => x0 + slot * (i + 0.5);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const grid = [0, 5, 10, 15];
  const rgb = dark ? "110,133,255" : "39,66,236";

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.titleNotePre}<strong style={{ color: accent, fontWeight: 800 }}>{p.titleNoteStrong}</strong></span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {p.showGrid && grid.map((g) => (
              <g key={g}>
                <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke={COLORS.line2} strokeWidth="1" />
                <text x={x0 - 12} y={Y(g) + 6} textAnchor="end" fontFamily={FONTS.mono} fontSize="19" fill={axisCol}>{g}</text>
              </g>
            ))}

            {/* step line across bar tops */}
            {p.showStep && (
              <path d={data.map((d, i) => {
                const xL = cx(i) - barW / 2, xR = cx(i) + barW / 2, yT = Y(d.avg);
                return `${i === 0 ? `M ${x0} ${Y(0)} L ${xL} ${yT}` : `L ${xL} ${yT}`} L ${xR} ${yT}`;
              }).join(" ")} fill="none" stroke={axisCol} strokeWidth="2" strokeDasharray="2 7" />
            )}

            {/* bars */}
            {data.map((d, i) => {
              const hot = p.focusEnabled && i === fi;
              const op = 0.42 + 0.58 * (i / (n - 1));
              const yb = Y(d.avg);
              return (
                <g key={i} opacity={p.focusEnabled && !hot ? 0.5 : 1}>
                  <rect x={cx(i) - barW / 2} y={yb} width={barW} height={y1 - yb}
                    fill={hot ? accent : `rgba(${rgb},${op.toFixed(3)})`} />
                  <text x={cx(i)} y={yb - 42} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="900" fontSize={hot ? 44 : 36} fill={hot ? accent : COLORS.ink}>{d.avg}</text>
                  {p.showMultiple && (
                    <text x={cx(i)} y={yb - 16} textAnchor="middle" fontFamily={FONTS.mono} fontWeight="700" fontSize="20" fill={i === 0 ? axisCol : accent}>{d.mult.toFixed(1)}×</text>
                  )}
                </g>
              );
            })}

            {/* x labels + counts */}
            {data.map((d, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <g key={i}>
                  <text x={cx(i)} y={y1 + 38} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize="24" fill={hot ? accent : COLORS.ink}>{d.label}</text>
                  {p.showCount && <text x={cx(i)} y={y1 + 64} textAnchor="middle" fontFamily={FONTS.mono} fontSize="16" fill={axisCol}>{d.cnt}{copy.t001}{d.en}</text>}
                </g>
              );
            })}
            <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={COLORS.ink} strokeWidth="2" />
          </svg>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.calloutPre}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{p.calloutStrong}</strong>{p.calloutPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={7} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
