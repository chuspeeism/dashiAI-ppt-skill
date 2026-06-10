import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ShiftSlide — 叙事驱动 → 兑现驱动 (data: 报告 3.4 选题主线 + 判断标准).
   Editorial before→after pivot: 热度（叙事）on the left, 兑现 on the right,
   bridged by a transition band carrying the report's thesis. Each side lists
   its judgement criteria verbatim from the report. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showCriteria", label: "判断标准", type: "toggle", default: true,
    help: "每侧底部「判断标准」标签条显示 / 隐藏" },
  { key: "showBridge", label: "转变中枢", type: "toggle", default: true,
    help: "中间「→」转变中枢与主线文案显示 / 隐藏" },
  { key: "focusSide", label: "重点突出", type: "select", default: "none",
    options: [{ value: "none", label: "无" }, { value: "left", label: "叙事侧" }, { value: "right", label: "兑现侧" }],
    help: "弱化另一侧以突出某一侧" },
  { key: "showMeta", label: "底部小结", type: "toggle", default: true,
    help: "底部「内容重点」小结显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showCriteria: true,
  showBridge: true,
  focusSide: "none",
  showMeta: true,
  theme: "light",
  copy: {
    t001: "判断标准 ·",
    t002: "看热度",
    t003: "看兑现",
    t004: "选题主线 / THESIS",
    t005: "资本逻辑的范式转变",
    t006: "从叙事驱动 → 兑现驱动",
    t007: "资本不再只为故事买单 · 开始追问能否兑现",
    t008: "融资额",
    t009: "轮次",
    t010: "头部集中度",
    t011: "资本正在",
    t012: "转向兑现",
    t013: "收入确定性",
    t014: "客户留存",
    t015: "成本结构",
    t016: "商业闭环",
    t017: "↳ 内容重点",
    t018: "前半部分用数据证明资本热度，后半部分用案例与风险证明兑现能力的分化——",
    t019: "“融资总量很大”只是起点，“资本从叙事转向兑现”才是这一年的真正主线。",
  },
  narrativeItems: [
  { k: "融资额", en: "CAPITAL", v: "全年 970 亿美元 · 创历史新高" },
  { k: "轮次结构", en: "ROUNDS", v: "D 轮及以后平均单笔 15.2 亿" },
  { k: "头部集中度", en: "CONCENTRATION", v: "通用大模型独占 43.3%" },
  ],
  deliveryItems: [
  { k: "收入确定性", en: "REVENUE", v: "ARR 规模与增速可被验证" },
  { k: "客户留存", en: "RETENTION", v: "续约率、付费留存、使用频次" },
  { k: "成本结构", en: "COST", v: "毛利稳定性与算力成本" },
  { k: "商业闭环", en: "LOOP", v: "是否嵌入刚性业务流程" },
  ],
  ...decorDefaults,
};




export default function ShiftSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const dimL = p.focusSide === "right";
  const dimR = p.focusSide === "left";

  const Side = ({ side, tag, cn, en, items, criteria, hot, dim }) => (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", opacity: dim ? 0.42 : 1, transition: "opacity .3s" }}>
      <div style={{
        display: "flex", flexDirection: "column", flex: 1,
        border: `2px solid ${hot ? accent : COLORS.line}`,
        background: hot ? `${accent}10` : (dark ? "rgba(243,242,238,0.03)" : "rgba(22,21,19,0.02)"),
        padding: "26px 30px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span className="rd-mono" style={{ fontSize: 16, color: side === "narr" ? COLORS.ink3 : accent, fontWeight: 700 }}>{tag}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
          <h3 style={{ margin: 0, fontFamily: FONTS.sans, fontWeight: 900, fontSize: 44, letterSpacing: "-0.01em", color: side === "narr" ? COLORS.ink2 : COLORS.ink }}>{cn}</h3>
          <span className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3 }}>{en}</span>
        </div>
        <ul style={{ listStyle: "none", margin: "18px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
          {items.map((it, j) => (
            <li key={j} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "13px 0", borderBottom: j < items.length - 1 ? `1px solid ${COLORS.line2}` : "none" }}>
              <span style={{ flex: "none", width: 9, height: 9, marginTop: 9, background: side === "narr" ? COLORS.ink3 : accent, borderRadius: side === "narr" ? 0 : "50%" }} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 25, color: COLORS.ink }}>{it.k}</span>
                <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3, marginLeft: 10 }}>{it.en}</span>
                <p className="rd-cap" style={{ margin: "2px 0 0", fontSize: 19 }}>{it.v}</p>
              </div>
            </li>
          ))}
        </ul>
        {p.showCriteria && (
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ fontSize: 14, color: COLORS.ink3 }}>{copy.t001}{side === "narr" ? copy.t002 : copy.t003}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {criteria.map((c, j) => (
                <span key={j} style={{ fontFamily: FONTS.mono, fontSize: 15, padding: "6px 11px", background: side === "narr" ? (dark ? "rgba(243,242,238,0.08)" : "rgba(22,21,19,0.06)") : accent, color: side === "narr" ? COLORS.ink2 : COLORS.blueInk }}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t004}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t005}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22, paddingBottom: 6 }}>
          <h2 className="rd-title">{copy.t006}</h2>
          <span className="rd-cap">{copy.t007}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", alignItems: "stretch", gap: 0, minHeight: 0, marginTop: 16 }}>
          <Side side="narr" tag="过去 · 叙事驱动 / NARRATIVE" cn="押注热度" en="STORY × HYPE"
            items={p.narrativeItems} criteria={[copy.t008, copy.t009, copy.t010]} hot={p.focusSide === "left"} dim={dimL} />

          {/* bridge */}
          {p.showBridge && (
            <div style={{ flex: "none", width: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
              <div style={{ width: 1, flex: 1, background: COLORS.line }} />
              <div style={{ flex: "none", width: 84, height: 84, borderRadius: "50%", background: accent, color: COLORS.blueInk, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 900, margin: "14px 0", boxShadow: `0 12px 26px ${accent}40` }}>→</div>
              <span className="rd-mono" style={{ fontSize: 13, color: COLORS.ink3, textAlign: "center", lineHeight: 1.4 }}>{copy.t011}<br/>{copy.t012}</span>
              <div style={{ width: 1, flex: 1, background: COLORS.line }} />
            </div>
          )}

          <Side side="deliv" tag="现在 · 兑现驱动 / DELIVERY" cn="验证兑现" en="REVENUE × MOAT"
            items={p.deliveryItems} criteria={[copy.t013, copy.t014, copy.t015, copy.t016]} hot={p.focusSide === "right"} dim={dimR} />
        </div>

        {p.showMeta && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t017}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t018}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t019}</strong>
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
