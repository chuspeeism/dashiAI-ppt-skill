import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   WaterfallSlide — 季度融资额桥接图 (data: 报告 2.1 逐季度走势).
   A bridge / waterfall on the quarterly amount series (Q1→Q4): an anchor bar
   plus signed floating deltas reveal the report's "前高后稳 · Q2–Q3 达峰后理性
   回落" rhythm. Figures verbatim. Fixed-px SVG geometry. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showConnector", label: "桥接连线", type: "toggle", default: true,
    help: "相邻季度之间的桥接虚线显示 / 隐藏" },
  { key: "showDelta", label: "环比变化", type: "toggle", default: true,
    help: "各季度环比增减数值显示 / 隐藏" },
  { key: "showCount", label: "事件笔数", type: "toggle", default: true,
    help: "各季度事件笔数显示 / 隐藏" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "背景水平网格线显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一季度" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 3, step: 1,
    help: "被高亮的季度序号（0 = Q1）" },
  { key: "showCallout", label: "趋势解读", type: "toggle", default: true,
    help: "底部节奏解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showConnector: true,
  showDelta: true,
  showCount: true,
  showGrid: true,
  focusEnabled: true,
  focusIndex: 2,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "市场全景 / MOMENTUM",
  kicker: "2024 · 逐季度融资额 · 单位亿美元",
  title: "季度融资节奏 · 桥接图",
  titleNote: "前高后稳 · Q2–Q3 达峰后理性回落",
  calloutLabel: "↳ 趋势解读",
  calloutSegments: [
    { t: "Q2 单季猛增 " },
    { t: "+122", c: "up" },
    { t: "、Q3 再创 318 亿峰值，随后 Q4 理性回落 " },
    { t: "−112", c: "down" },
    { t: "——全年合计 970 亿、97 笔，平均单笔约 10 亿美元，显示市场对头部标的高度追捧但已从狂热转向分化。" },
  ],
  data: [
    { label: "Q1", amt: 162, cnt: 18 },
    { label: "Q2", amt: 284, cnt: 26 },
    { label: "Q3", amt: 318, cnt: 31 },
    { label: "Q4", amt: 206, cnt: 22 },
  ],
  copy: {
    t001: "笔",
  },
  ...decorDefaults,
};
const UP = "#5f8f0c", DOWN = "#b04a2f";

export default function WaterfallSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const Q = p.data || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), Q.length - 1);

  const W = 1680, H = 532, mL = 74, mR = 48, mT = 56, mB = 96;
  const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
  const maxV = 360;
  const Y = (v) => y1 - (v / maxV) * (y1 - y0);
  const n = Q.length, slot = (x1 - x0) / n, barW = slot * 0.5;
  const cx = (i) => x0 + slot * (i + 0.5);
  const axisCol = dark ? "#84827c" : COLORS.ink3;
  const upC = dark ? "#9ccb3a" : UP, downC = dark ? "#e07a5a" : DOWN;
  const grid = [0, 90, 180, 270, 360];

  // bridge segments: prev level → this level
  const segs = Q.map((q, i) => {
    const prev = i === 0 ? 0 : Q[i - 1].amt;
    const delta = q.amt - prev;
    return { ...q, prev, delta, top: Y(Math.max(prev, q.amt)), bot: Y(Math.min(prev, q.amt)) };
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
            {p.showGrid && grid.map((g) => (
              <g key={g}>
                <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke={COLORS.line2} strokeWidth="1" />
                <text x={x0 - 14} y={Y(g) + 6} textAnchor="end" fontFamily={FONTS.mono} fontSize="19" fill={axisCol}>{g}</text>
              </g>
            ))}

            {/* connectors */}
            {p.showConnector && segs.slice(0, -1).map((s, i) => (
              <line key={i} x1={cx(i) + barW / 2} y1={Y(s.amt)} x2={cx(i + 1) - barW / 2} y2={Y(s.amt)} stroke={axisCol} strokeWidth="1.5" strokeDasharray="3 6" />
            ))}

            {/* bars */}
            {segs.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const isAnchor = i === 0;
              const col = isAnchor ? accent : (s.delta >= 0 ? upC : downC);
              return (
                <g key={i} opacity={dim ? 0.5 : 1}>
                  <rect x={cx(i) - barW / 2} y={s.top} width={barW} height={Math.max(2, s.bot - s.top)} fill={hot ? accent : col} />
                  {/* level label */}
                  <text x={cx(i)} y={Y(s.amt) - 16} textAnchor="middle" fontFamily={FONTS.sans} fontWeight="800" fontSize={hot ? 34 : 28} fill={hot ? accent : COLORS.ink}>{s.amt}</text>
                  {/* delta label */}
                  {p.showDelta && !isAnchor && (
                    <text x={cx(i)} y={(s.top + s.bot) / 2 + 7} textAnchor="middle" fontFamily={FONTS.mono} fontWeight="700" fontSize="21" fill="#fff">{s.delta > 0 ? `+${s.delta}` : s.delta}</text>
                  )}
                </g>
              );
            })}

            {/* x labels + counts */}
            {segs.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <g key={i}>
                  <text x={cx(i)} y={y1 + 38} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={hot ? 800 : 700} fontSize="25" fill={hot ? accent : COLORS.ink}>{s.label}</text>
                  {p.showCount && <text x={cx(i)} y={y1 + 64} textAnchor="middle" fontFamily={FONTS.mono} fontSize="16" fill={axisCol}>{s.cnt}{copy.t001}</text>}
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
              {(p.calloutSegments || []).map((s, i) => (
                s.c
                  ? <strong key={i} style={{ color: s.c === "up" ? upC : downC, fontWeight: 700 }}>{s.t}</strong>
                  : <React.Fragment key={i}>{s.t}</React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={-8} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
