import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RegisterSlide — 表格 · 风险登记册 (data: 报告 6.1 当前市场的主要风险). A risk
   register: each risk scored on 严重度 / 可能性 (5-step square meters, derived
   from the report's qualitative framing) plus its verbatim 触发条件 and 主要影响.
   Distinct from RiskSlide (cards) — adds trigger / impact analysis dimensions.
   Pure / portable — row count, columns and focus are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "风险数量", type: "slider", default: 4, min: 2, max: 4, step: 1,
    help: "登记册展示的风险条目数量" },
  { key: "showLikelihood", label: "可能性列", type: "toggle", default: true,
    help: "「可能性」评分列显示 / 隐藏" },
  { key: "showImpact", label: "主要影响列", type: "toggle", default: true,
    help: "「主要影响」列显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一行风险" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 3, step: 1,
    help: "被高亮的风险序号（自动随数量收敛）" },
  { key: "showCallout", label: "结论解读", type: "toggle", default: true,
    help: "底部登记册小结显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 4,
  showLikelihood: true,
  showImpact: true,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  copy: {
    t001: "风险研判 / RISK REGISTER",
    t002: "依据 · 报告 6.1 主要风险",
    t003: "风险登记册",
    t004: "严重度 × 可能性 · 五档量表 · 触发条件 → 主要影响",
    t005: "风险类型",
    t006: "严重度",
    t007: "可能性",
    t008: "触发条件",
    t009: "主要影响",
    t010: "↳ 登记册小结",
    t011: "估值泡沫与算力卡脖子",
    t012: "严重度最高、且高度可能—— 四类风险首尾相扣：高估值需要持续烧钱，烧钱依赖紧缺算力，一旦资本耐心耗尽，回调与洗牌随之而来。",
  },
  rows: [
  { name: "估值泡沫与盈利困境", sev: 5, like: 4, trig: "P/S 超千倍 · 收入远不及估值", impact: "估值回调 · 倒闭潮" },
  { name: "算力供应链卡脖子",   sev: 5, like: 4, trig: "GPU 供应紧张 · 对华出口管制", impact: "成本居高 · 中小出局" },
  { name: "大厂挤压与开源冲击", sev: 4, like: 4, trig: "巨头自研 · Llama / Mistral 逼近", impact: "商业壁垒降低" },
  { name: "监管压力加大",       sev: 3, like: 4, trig: "欧盟 AI Act · 各州隐私法案", impact: "合规成本激增" },
  ],
  ...decorDefaults,
};

// 报告 6.1：四类风险；严重度 / 可能性为依据原文定性的五档量化


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

export default function RegisterSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const n = Math.max(2, Math.min(p.rows.length, p.itemCount));
  const rows = p.rows.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  const cols = `2.4fr 1.5fr ${p.showLikelihood ? "1.5fr " : ""}2.6fr ${p.showImpact ? "1.9fr" : ""}`;
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
            <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol }}>{copy.t006}</span>
            {p.showLikelihood && <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol }}>{copy.t007}</span>}
            <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol, textTransform: "uppercase" }}>{copy.t008}</span>
            {p.showImpact && <span style={{ ...cellPad, fontFamily: FONTS.mono, fontSize: 16, color: axisCol, textTransform: "uppercase" }}>{copy.t009}</span>}
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {rows.map((r, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: cols, alignItems: "center", flex: 1,
                  borderBottom: `1px solid ${COLORS.line2}`,
                  background: hot ? (dark ? "rgba(110,133,255,0.14)" : "rgba(39,66,236,0.06)") : "transparent",
                  opacity: dim ? 0.62 : 1,
                }}>
                  <span style={{ ...cellPad, paddingLeft: hot ? 14 : 0, borderLeft: hot ? `4px solid ${accent}` : "none", fontFamily: FONTS.sans, fontWeight: 800, fontSize: 25, lineHeight: 1.12, color: hot ? accent : COLORS.ink }}>{r.name}</span>
                  <span style={cellPad}><Meter value={r.sev} color={hot ? accent : COLORS.ink} dim={dim} /></span>
                  {p.showLikelihood && <span style={cellPad}><Meter value={r.like} color={hot ? accent : COLORS.ink} dim={dim} /></span>}
                  <span style={{ ...cellPad, fontFamily: FONTS.sans, fontWeight: 500, fontSize: 20, color: COLORS.ink2 }}>{r.trig}</span>
                  {p.showImpact && (
                    <span style={{ ...cellPad }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                        <span style={{ color: hot ? accent : COLORS.ink3, fontFamily: FONTS.mono, fontSize: 18 }}>↳</span>
                        <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 20, color: COLORS.ink }}>{r.impact}</span>
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
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t010}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              <strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t011}</strong>{copy.t012}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={-7} pos={{ right: 44, top: 100 }} />
    </div>
  );
}
