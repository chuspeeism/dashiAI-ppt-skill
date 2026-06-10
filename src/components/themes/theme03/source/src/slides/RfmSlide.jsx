import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RfmSlide — RFM 标的分层模型 (AI 融资语境).
   RFM 三维被重定义为融资行为指标：R 近期度（最近一轮距今）· F 频次（轮次密度）
   · M 金额（累计融资 / 估值量级）。三维二分 → 8 类投资标的，每类各配一条
   行动策略。左侧保留一个「压缩版」立方体作方位锚点，右侧密集分层清单为主角。
   纯 props 驱动，可迁移。
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showCube", label: "方位立方体", type: "toggle", default: true,
    help: "左侧 RFM 三维方位立方体显示 / 隐藏" },
  { key: "showAxis", label: "坐标轴标注", type: "toggle", default: true,
    help: "R / F / M 三轴文字标注显示 / 隐藏" },
  { key: "showAction", label: "行动策略", type: "toggle", default: true,
    help: "每类标的的行动策略一行字显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一类标的（同时点亮其立方体）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 7, step: 1,
    help: "被高亮的标的序号（0 = 头部吸金兽）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showCube: true,
  showAxis: true,
  showAction: true,
  showAnalysis: true,
  focusEnabled: true,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "投资模型 / RFM",
    t002: "近期度 · 频次 · 金额 → 标的分层",
    t003: "RFM 标的分层模型",
    t004: "用 RFM 三维切分 97 笔 AI 融资标的 · 八类差异化打法",
    t005: "↑ M 金额",
    t006: "F 频次 →",
    t007: "↙ R 近期",
    t008: "近期度",
    t009: "最近一轮距今",
    t010: "频次",
    t011: "轮次密度",
    t012: "金额",
    t013: "累计 / 估值量级",
    t014: "8 类标的 · 差异化打法 / SEGMENTS",
    t015: "高",
    t016: "低",
    t017: "↳ 解读",
    t018: "「巨额」不等于「健康」——",
    t019: "降温巨鲸",
    t020: "（高额却近期转冷）往往是估值回调的前兆，需逢高减配； 真正的超额收益常藏在",
    t021: "成长黑马",
    t022: "（高频小额）里。当前聚焦：",
    t023: "· 建议",
  },
  segments: [
  { name: "头部吸金兽", r: 1, f: 1, m: 1, tag: "近期 · 高频 · 巨额", act: "核心配置 · 长期跟踪、逢轮加注" },
  { name: "巨额新贵",   r: 1, f: 0, m: 1, tag: "近期 · 低频 · 巨额", act: "关注兑现 · 单笔巨额，择机重仓" },
  { name: "降温巨鲸",   r: 0, f: 1, m: 1, tag: "沉寂 · 高频 · 巨额", act: "警惕回调 · 高位逢高减配" },
  { name: "滞涨巨头",   r: 0, f: 0, m: 1, tag: "沉寂 · 低频 · 巨额", act: "盯基本面 · 防估值泡沫挤压" },
  { name: "成长黑马",   r: 1, f: 1, m: 0, tag: "近期 · 高频 · 小额", act: "早期布局 · 跟投高潜力标的" },
  { name: "首融新秀",   r: 1, f: 0, m: 0, tag: "近期 · 低频 · 小额", act: "小额试探 · 纳入观察池" },
  { name: "长尾活跃",   r: 0, f: 1, m: 0, tag: "沉寂 · 高频 · 小额", act: "分散谨慎 · 小额跟投验证" },
  { name: "沉寂长尾",   r: 0, f: 0, m: 0, tag: "沉寂 · 低频 · 小额", act: "低优先级 · 接受自然淘汰" },
  ],
  ...decorDefaults,
};

// 8 类标的 — r/f/m 布尔（1 = 高）。tier=true 表示 M 高（高资金量级）。


// ---- isometric cube (left hero) ------------------------------------------
const S = 104, GAP = 56, U = S + GAP, HALF = S / 2;

function Cube({ faces, edge, x, y, z }) {
  const fb = { position: "absolute", width: S, height: S, left: 0, top: 0, border: `1px solid ${edge}` };
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: S, height: S,
      transformStyle: "preserve-3d", transform: `translate(-50%,-50%) translate3d(${x}px, ${y}px, ${z}px)` }}>
      <div style={{ ...fb, background: faces.top,   transform: `rotateX(90deg) translateZ(${HALF}px)` }} />
      <div style={{ ...fb, background: faces.right, transform: `rotateY(90deg) translateZ(${HALF}px)` }} />
      <div style={{ ...fb, background: faces.front, transform: `translateZ(${HALF}px)` }} />
    </div>
  );
}

function shades(base) {
  if (base === "blue") return { top: "#7184ff", front: "#2742ec", right: "#1a2da6", edge: "rgba(255,255,255,0.22)" };
  if (base === "dark") return { top: "#494742", front: "#2b2a27", right: "#181714", edge: "rgba(243,242,238,0.16)" };
  return { top: "#dedcd6", front: "#bfbdb6", right: "#97958e", edge: "rgba(22,21,19,0.16)" };
}

export default function RfmSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), 7);
  const focused = p.segments[fi];

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

        <div style={{ flex: 1, display: "flex", gap: 44, minHeight: 0, alignItems: "stretch", paddingTop: 14 }}>
          {/* ---- left: large cube hero ---- */}
          {p.showCube && (
            <div className="rd-anim rd-anim-3" style={{ flex: "none", width: 600, position: "relative", minWidth: 0 }}>
              <div style={{ position: "absolute", inset: 0, perspective: "1900px" }}>
                <div style={{ position: "absolute", left: "50%", top: "52%", width: 0, height: 0,
                  transformStyle: "preserve-3d", transform: "rotateX(-26deg) rotateY(-36deg)" }}>
                  {p.segments.map((seg, idx) => {
                    const hot = p.focusEnabled && idx === fi;
                    const base = hot ? "blue" : seg.m ? "dark" : "light";
                    const sh = shades(base);
                    const x = (seg.f ? 0.5 : -0.5) * U;
                    const yy = (seg.m ? -0.5 : 0.5) * U;
                    const z = (seg.r ? 0.5 : -0.5) * U;
                    return <Cube key={idx} faces={sh} edge={sh.edge} x={x} y={yy} z={z} />;
                  })}
                </div>
              </div>
              {p.showAxis && (
                <>
                  <div className="rd-mono" style={{ position: "absolute", left: "34%", top: 4, color: COLORS.ink2, fontSize: 20 }}>{copy.t005}</div>
                  <div className="rd-mono" style={{ position: "absolute", right: 8, bottom: 30, color: COLORS.ink2, fontSize: 20 }}>{copy.t006}</div>
                  <div className="rd-mono" style={{ position: "absolute", left: 8, bottom: 30, color: COLORS.ink2, fontSize: 20 }}>{copy.t007}</div>
                </>
              )}
            </div>
          )}

          {/* ---- right: dimension key + 8-segment dense list ---- */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderLeft: p.showCube ? `1px solid ${COLORS.line}` : "none", paddingLeft: p.showCube ? 40 : 0 }}>
            {/* three-dimension definition — horizontal strip */}
            <div style={{ display: "flex", gap: 24, paddingBottom: 14, marginBottom: 6, borderBottom: `2px solid ${COLORS.ink}` }}>
              {[
                ["R", copy.t008, copy.t009],
                ["F", copy.t010,   copy.t011],
                ["M", copy.t012,   copy.t013],
              ].map(([k, cn, note]) => (
                <div key={k} style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 11, minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 34, lineHeight: 1, color: accent, flex: "none" }}>{k}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 21, color: COLORS.ink, lineHeight: 1 }}>{cn}</div>
                    <div className="rd-cap" style={{ fontSize: 16, marginTop: 4 }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rd-mono" style={{ fontSize: 18, color: COLORS.ink3, marginBottom: 2 }}>{copy.t014}</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {p.segments.map((seg, idx) => {
                const hot = p.focusEnabled && idx === fi;
                const dim = p.focusEnabled && !hot;
                const sw = hot ? accent : seg.m ? (dark ? "#494742" : "#2b2a27") : (dark ? "#6d6b66" : "#bfbdb6");
                return (
                  <div key={idx} style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 16,
                    borderBottom: idx < 7 ? `1px solid ${COLORS.line2}` : "none",
                    opacity: dim ? 0.5 : 1, transition: "opacity .3s",
                  }}>
                    <span style={{ width: 14, height: 14, flex: "none", background: sw,
                      boxShadow: hot ? `0 0 0 4px rgba(39,66,236,0.18)` : "none" }} />
                    <div style={{ width: 132, flex: "none" }}>
                      <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 23, color: hot ? accent : COLORS.ink, whiteSpace: "nowrap" }}>{seg.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, flex: "none", width: 132 }}>
                      {[["R", seg.r], ["F", seg.f], ["M", seg.m]].map(([k, v]) => (
                        <span key={k} style={{
                          fontFamily: "var(--rd-mono)", fontSize: 14, fontWeight: 700,
                          width: 40, textAlign: "center", padding: "3px 0", lineHeight: 1.2,
                          background: v ? (hot ? accent : COLORS.ink) : "transparent",
                          color: v ? (hot ? "#fff" : COLORS.bg) : COLORS.ink3,
                          border: v ? "none" : `1px solid ${COLORS.line}`,
                        }}>{k}{v ? copy.t015 : copy.t016}</span>
                      ))}
                    </div>
                    {p.showAction && (
                      <span className="rd-cap" style={{ flex: 1, fontSize: 19, minWidth: 0, color: hot ? COLORS.ink : COLORS.ink2 }}>{seg.act}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* analysis */}
        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t017}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t018}<b style={{ color: accent, fontWeight: 700 }}>{copy.t019}</b>{copy.t020}<b style={{ color: accent, fontWeight: 700 }}>{copy.t021}</b>{copy.t022}<b style={{ color: accent, fontWeight: 700 }}>{focused.name}</b>{copy.t023}{focused.act.split(" · ")[1] || focused.act}。
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={-6} pos={{ right: 50, top: 112 }} />
    </div>
  );
}
