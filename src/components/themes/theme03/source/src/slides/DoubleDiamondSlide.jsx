import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   DoubleDiamondSlide — 双钻模型 (Design Council Double Diamond).
   Two diamonds: Discover → Define (problem space) | Develop → Deliver
   (solution space), each a diverge / converge half. SVG drawn at a 1:1 viewBox
   (no stretch → labels never deform); analysis callout + per-stage cards.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showSpaces", label: "空间括注", type: "toggle", default: true,
    help: "「问题空间 / 解决方案空间」顶部括注显示 / 隐藏" },
  { key: "showFlow", label: "发散收敛标注", type: "toggle", default: true,
    help: "各阶段「发散 / 收敛」方向标注显示 / 隐藏" },
  { key: "showCards", label: "阶段说明", type: "toggle", default: true,
    help: "底部四阶段说明卡显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个阶段（发现 / 定义 / 开发 / 交付）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 3, step: 1,
    help: "被高亮的阶段序号（0 发现 → 3 交付）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showSpaces: true,
  showFlow: true,
  showCards: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "决策模型 / DOUBLE DIAMOND",
    t002: "发现 · 定义 · 构建 · 配置",
    t003: "投资决策双钻",
    t004: "两次「发散—收敛」· 先选对赛道，再配好组合",
    t005: "问题空间",
    t006: "投什么赛道",
    t007: "解决方案空间",
    t008: "怎么配组合",
    t009: "发散",
    t010: "◄ 发散 ►",
    t011: "► 收敛 ◄",
    t012: "0",
    t013: "↳ 解读",
    t014: "投资决策双钻的价值在于「两次收敛」——第一颗钻避免一上来就追单个标的、确保先选对赛道（兑现 > 叙事）； 第二颗钻避免过早押注单一标的，在候选池中分散择优。发散阶段重机会与广度，收敛阶段重纪律与取舍。",
  },
  stages: [
  { cn: "发现", en: "DISCOVER", dir: "发散", desc: "广扫 970 亿融资全景 · 识别热点、拐点与风险信号", accent: COLORS.blue },
  { cn: "定义", en: "DEFINE",   dir: "收敛", desc: "收敛到兑现确定性高的赛道 · 锁定投资主题", accent: COLORS.blue },
  { cn: "构建", en: "DEVELOP",  dir: "发散", desc: "多元筛选头部与潜力标的 · 搭建候选标的池", accent: "#7ba80c" },
  { cn: "配置", en: "DELIVER",  dir: "收敛", desc: "择优定权重 · 交付可落地的投资组合", accent: "#7ba80c" },
  ],
  ...decorDefaults,
};



// 1:1 viewBox geometry (1680 × 360) — 4 equal 420-wide quarters
const CY = 180, TOP = 30, BOT = 330;
const TRIS = [
  `0,${CY} 420,${TOP} 420,${BOT}`,
  `420,${TOP} 840,${CY} 420,${BOT}`,
  `840,${CY} 1260,${TOP} 1260,${BOT}`,
  `1260,${TOP} 1680,${CY} 1260,${BOT}`,
];
const OUTLINES = [`0,${CY} 420,${TOP} 840,${CY} 420,${BOT}`, `840,${CY} 1260,${TOP} 1680,${CY} 1260,${BOT}`];
const FILLS = ["rgba(39,66,236,0.10)", "rgba(39,66,236,0.22)", "rgba(143,184,15,0.16)", "rgba(143,184,15,0.32)"];
const CXS = [280, 560, 1120, 1400];

export default function DoubleDiamondSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const fi = Math.min(Math.max(0, p.focusIndex), 3);
  const stroke = dark ? "#f3f2ee" : COLORS.ink;

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

        {/* problem / solution space brackets */}
        {p.showSpaces && (
          <div className="rd-anim rd-anim-2" style={{ display: "flex", marginTop: 18 }}>
            {[[copy.t005, copy.t006, COLORS.blue], [copy.t007, copy.t008, "#7ba80c"]].map(([cn, en, c], i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", paddingBottom: 7, borderBottom: `2px solid ${c}`, margin: i === 0 ? "0 14px 0 0" : "0 0 0 14px" }}>
                <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 24, color: COLORS.ink }}>{cn}</span>
                <span className="rd-mono" style={{ fontSize: 17, color: COLORS.ink3, marginLeft: 10 }}>{en}</span>
              </div>
            ))}
          </div>
        )}

        {/* the two diamonds — drawn at native px ratio so text never deforms */}
        <div className="rd-anim rd-anim-3" style={{ marginTop: 14 }}>
          <svg viewBox="0 0 1680 360" style={{ width: "100%", height: "auto", display: "block" }}>
            {/* tinted diverge / converge halves */}
            {TRIS.map((pts, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return <polygon key={i} points={pts} fill={hot ? p.stages[i].accent : FILLS[i]} opacity={dim ? 0.3 : 1} style={{ transition: "opacity .3s, fill .3s" }} />;
            })}
            {/* clean diamond outlines on top */}
            {OUTLINES.map((pts, i) => (
              <polygon key={i} points={pts} fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
            ))}
            {/* internal seam (diverge|converge divider) */}
            <line x1="420" y1={TOP} x2="420" y2={BOT} stroke={stroke} strokeWidth="1" strokeDasharray="5 6" opacity="0.5" />
            <line x1="1260" y1={TOP} x2="1260" y2={BOT} stroke={stroke} strokeWidth="1" strokeDasharray="5 6" opacity="0.5" />
            {/* stage names */}
            {p.stages.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <text key={i} x={CXS[i]} y={CY + 13} textAnchor="middle" fontFamily="Archivo, 'Noto Sans SC', sans-serif"
                  fontWeight="800" fontSize="42" fill={hot ? "#fff" : COLORS.ink} opacity={p.focusEnabled && !hot ? 0.4 : 1}>{s.cn}</text>
              );
            })}
            {/* diverge / converge direction cues */}
            {p.showFlow && p.stages.map((s, i) => (
              <text key={i} x={CXS[i]} y={BOT + 34} textAnchor="middle" fontFamily="'Space Mono', monospace"
                fontSize="22" letterSpacing="2" fill={COLORS.ink3}>{s.dir === copy.t009 ? copy.t010 : copy.t011}</text>
            ))}
          </svg>
        </div>

        {/* four stage cards */}
        {p.showCards && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", marginTop: 20 }}>
            {p.stages.map((s, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              return (
                <div key={i} style={{
                  flex: 1, padding: "14px 22px", borderTop: `3px solid ${hot ? s.accent : COLORS.ink}`,
                  borderLeft: i > 0 ? `1px solid ${COLORS.line2}` : "none",
                  opacity: dim ? 0.5 : 1, transition: "opacity .3s",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span className="rd-mono" style={{ fontSize: 16, color: hot ? s.accent : COLORS.ink3 }}>{copy.t012}{i + 1}</span>
                    <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 27, color: hot ? s.accent : COLORS.ink }}>{s.cn}</span>
                    <span className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3 }}>{s.en}</span>
                  </div>
                  <p className="rd-cap" style={{ margin: "9px 0 0", fontSize: 21 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* analysis */}
        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t013}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t014}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={130} rotate={6} pos={{ right: 54, top: 120 }} />
    </div>
  );
}
