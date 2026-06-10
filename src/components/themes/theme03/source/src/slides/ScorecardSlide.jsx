import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ScorecardSlide — 表格 · 头部标的投资记分卡 (data: 报告 3.4 选题四象限).
   A ratings table: each head company scored on 资本热度 / 商业兑现 / 竞争壁垒
   (5-step square meters) + its quadrant placement. Scores follow the report's
   four-quadrant positioning verbatim; amounts cite the case chapters. Pure /
   portable — variable parts (row count, columns, focus) are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "公司数量", type: "slider", default: 8, min: 4, max: 8, step: 1,
    help: "记分卡展示的公司数量（Top N）" },
  { key: "showQuadrant", label: "象限定位", type: "toggle", default: true,
    help: "「四象限定位」列显示 / 隐藏" },
  { key: "showBarrier", label: "竞争壁垒", type: "toggle", default: true,
    help: "「竞争壁垒」评分列显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一行公司" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 7, step: 1,
    help: "被高亮的公司序号（自动随公司数量收敛）" },
  { key: "showCallout", label: "结论解读", type: "toggle", default: true,
    help: "底部记分卡小结显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 8,
  showQuadrant: true,
  showBarrier: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  copy: {
    t001: "投资研判 / SCORECARD",
    t002: "评分依据 · 报告 3.4 选题四象限",
    t003: "头部标的 · 投资记分卡",
    t004: "资本热度 × 商业兑现 × 竞争壁垒 · 五档量表",
    t005: "公司",
    t006: "赛道 / 产业链层",
    t007: "资本热度",
    t008: "商业兑现",
    t009: "竞争壁垒",
    t010: "四象限定位",
    t011: "↳ 记分卡小结",
    t012: "热度 ≠ 兑现",
    t013: "：模型层四巨头资本热度满格，但商业兑现仍待验证； 真正\"热度 × 兑现\"双高的，是 CoreWeave、Databricks 等上游基础设施\"卖铲\"标的——记分卡越往兑现列看，确定性越分化。",
  },
  rows: [
  { name: "CoreWeave",     seg: "上游 · 算力云",   heat: 5, deliver: 5, moat: 4, q: "star" },
  { name: "Databricks",    seg: "下游 · 数据平台", heat: 5, deliver: 5, moat: 4, q: "star" },
  { name: "Scale AI",      seg: "上游 · 数据标注", heat: 4, deliver: 4, moat: 4, q: "star" },
  { name: "Anthropic",     seg: "中游 · 通用大模型", heat: 5, deliver: 2, moat: 4, q: "bubble" },
  { name: "OpenAI",        seg: "中游 · 通用大模型", heat: 5, deliver: 2, moat: 4, q: "bubble" },
  { name: "xAI",           seg: "中游 · 通用大模型", heat: 4, deliver: 2, moat: 3, q: "bubble" },
  { name: "Glean",         seg: "下游 · 企业搜索", heat: 3, deliver: 4, moat: 3, q: "hidden" },
  { name: "Perplexity AI", seg: "下游 · 消费搜索", heat: 3, deliver: 4, moat: 2, q: "hidden" },
],
  quad: {
  star:   { label: "明星兑现区", c: "#5f8f0c" },
  bubble: { label: "叙事泡沫区", c: COLORS.blue },
  hidden: { label: "隐形价值区", c: "#5c5b57" },
},
  ...decorDefaults,
};

// 评分 = 报告 3.4 四象限定位（热度/兑现）+ 各案例壁垒描述；q = 象限键



function Meter({ value, color, dim }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{
          width: 16, height: 16,
          background: i < value ? color : "transparent",
          border: `1.5px solid ${i < value ? color : "var(--rd-line)"}`,
          opacity: dim ? 0.6 : 1,
        }} />
      ))}
    </div>
  );
}

export default function ScorecardSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const n = Math.max(4, Math.min(p.rows.length, p.itemCount));
  const rows = p.rows.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  const cols = `2.0fr 2.0fr 1.5fr 1.5fr ${p.showBarrier ? "1.5fr " : ""}${p.showQuadrant ? "1.7fr" : ""}`;
  const cellPad = { padding: "0 18px", display: "flex", alignItems: "center" };

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 22, display: "flex", flexDirection: "column" }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: cols, alignItems: "center", height: 52, borderBottom: `2px solid ${COLORS.ink}` }}>
            <span style={{ ...cellPad, paddingLeft: 0, fontFamily: FONTS.mono, fontSize: 16, letterSpacing: "0.06em", color: axisCol, textTransform: "uppercase" }}>{copy.t005}</span>
            <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, letterSpacing: "0.06em", color: axisCol, textTransform: "uppercase" }}>{copy.t006}</span>
            <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol }}>{copy.t007}</span>
            <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol }}>{copy.t008}</span>
            {p.showBarrier && <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol }}>{copy.t009}</span>}
            {p.showQuadrant && <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol }}>{copy.t010}</span>}
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {rows.map((r, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const q = p.quad[r.q];
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: cols, alignItems: "center", flex: 1,
                  borderBottom: `1px solid ${COLORS.line2}`,
                  background: hot ? (dark ? "rgba(110,133,255,0.14)" : "rgba(39,66,236,0.06)") : "transparent",
                  opacity: dim ? 0.62 : 1,
                }}>
                  <span style={{ ...cellPad, paddingLeft: hot ? 14 : 0, borderLeft: hot ? `4px solid ${accent}` : "none", fontFamily: FONTS.sans, fontWeight: 800, fontSize: 27, color: hot ? accent : COLORS.ink }}>{r.name}</span>
                  <span style={{ ...cellPad, fontFamily: FONTS.sans, fontWeight: 500, fontSize: 21, color: COLORS.ink2 }}>{r.seg}</span>
                  <span style={cellPad}><Meter value={r.heat} color={hot ? accent : COLORS.ink} dim={dim} /></span>
                  <span style={cellPad}><Meter value={r.deliver} color={hot ? accent : COLORS.ink} dim={dim} /></span>
                  {p.showBarrier && <span style={cellPad}><Meter value={r.moat} color={hot ? accent : COLORS.ink} dim={dim} /></span>}
                  {p.showQuadrant && (
                    <span style={cellPad}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                        <span style={{ width: 12, height: 12, background: q.c, flex: "none" }} />
                        <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 19, color: COLORS.ink }}>{q.label}</span>
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t011}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              <strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t012}</strong>{copy.t013}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={-7} pos={{ right: 44, top: 100 }} />
    </div>
  );
}
