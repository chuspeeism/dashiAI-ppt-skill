import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RadarSlide — 风险信号雷达图 (data: 报告 6.1 当前市场的主要风险).
   A four-axis radar scoring the report's four documented risk categories by
   intensity (1–5), with a mirrored panel that lists each risk + a meter.
   Visualises "尽管创纪录，但多重风险信号不容忽视". Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showRings", label: "强度刻度环", type: "toggle", default: true,
    help: "雷达图同心强度刻度环显示 / 隐藏" },
  { key: "showValue", label: "强度数值", type: "toggle", default: true,
    help: "各风险顶点的强度数值显示 / 隐藏" },
  { key: "showPanel", label: "风险解读", type: "toggle", default: true,
    help: "右侧四类风险释义 + 强度标尺显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一类风险（轴 + 释义）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 3, step: 1,
    help: "被高亮的风险序号（0 估值泡沫 · 1 算力卡脖子 · 2 大厂/开源 · 3 监管压力）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showRings: true,
  showValue: true,
  showPanel: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "风险研判 / RISK RADAR",
    t002: "创纪录之下 · 四维风险信号",
    t003: "风险信号雷达",
    t004: "融资虽创历史新高 · 多重风险不容忽视",
    t005: "强度",
    t006: "/5",
    t007: "↳ 解读",
    t008: "四股风险并非孤立——估值泡沫被算力成本与大厂/开源的双重挤压放大，又被趋紧的监管点燃；一旦宏观收紧， 它们会沿“估值回调 → 融资断档 → 倒闭潮”的链条相互传导。资本热度越高，越需对兑现能力保持清醒。",
  },
  risks: [
  { cn: "估值泡沫", en: "VALUATION BUBBLE", lvl: 5, accent: "#b04a2f",
    desc: "估值建立在“未来市值”而非当前收入：Anthropic 9650 亿估值对应约 8 亿收入，P/S 超千倍。" },
  { cn: "算力卡脖子", en: "COMPUTE SUPPLY", lvl: 4, accent: "#b8821a",
    desc: "NVIDIA GPU 供应紧张，叠加对华出口管制加码，算力成本居高不下。" },
  { cn: "大厂 / 开源", en: "INCUMBENTS & OSS", lvl: 4, accent: "#6a4ea3",
    desc: "Google / Meta / 微软自研模型降维打击；Llama、Mistral 等开源逼近闭源。" },
  { cn: "监管压力", en: "REGULATION", lvl: 3, accent: "#2a7d8c",
    desc: "欧盟 AI Act、美国各州隐私法相继生效，合规成本与法律不确定性上升。" },
],
  lv: ["", "很低", "低", "中", "高", "极高"],
  ...decorDefaults,
};

// 报告 6.1 四类风险（强度 1–5 据原文措辞研判）



export default function RadarSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), 3);

  // radar geometry — a wide viewBox reserves left/right label gutters so the
  // 算力卡脖子 / axis labels never spill into the right-hand panel.
  const VW = 760, VH = 560, cx = 380, cy = 280, R = 196, MAX = 5;
  const ang = [-90, 0, 90, 180];
  const pt = (i, r) => {
    const a = (ang[i] * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const valPts = p.risks.map((rk, i) => pt(i, (rk.lvl / MAX) * R));
  const poly = valPts.map((pp) => pp.join(",")).join(" ");
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22, paddingBottom: 6 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 36, minHeight: 0, alignItems: "center" }}>
          {/* radar */}
          <div className="rd-anim rd-anim-3" style={{ flex: "none", width: 740, position: "relative" }}>
            <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
              {/* rings */}
              {p.showRings && [1, 2, 3, 4, 5].map((lv) => {
                const rr = (lv / MAX) * R;
                const pts = ang.map((_, i) => pt(i, rr).join(",")).join(" ");
                return <polygon key={lv} points={pts} fill="none" stroke={COLORS.line2} strokeWidth="1.5" />;
              })}
              {/* axes */}
              {ang.map((_, i) => {
                const [ex, ey] = pt(i, R);
                return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke={COLORS.line} strokeWidth="1.5" />;
              })}
              {/* value polygon */}
              <polygon points={poly} fill={`${accent}24`} stroke={accent} strokeWidth="3" />
              {valPts.map((pp, i) => {
                const hot = p.focusEnabled && i === fi;
                return <circle key={i} cx={pp[0]} cy={pp[1]} r={hot ? 13 : 9} fill={hot ? p.risks[i].accent : accent} stroke="#fff" strokeWidth="2.5" />;
              })}
              {/* axis labels */}
              {p.risks.map((rk, i) => {
                const [lx, ly] = pt(i, R + 46);
                const hot = p.focusEnabled && i === fi;
                const anchor = i === 1 ? "start" : i === 3 ? "end" : "middle";
                return (
                  <g key={i} opacity={p.focusEnabled && !hot ? 0.45 : 1}>
                    <text x={lx} y={ly - 4} textAnchor={anchor} fontFamily={FONTS.sans} fontWeight="900" fontSize="26" fill={hot ? rk.accent : COLORS.ink}>{rk.cn}</text>
                    {p.showValue && <text x={lx} y={ly + 22} textAnchor={anchor} fontFamily={FONTS.mono} fontSize="17" fill={axisCol}>{copy.t005}{rk.lvl}{copy.t006}</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* risk panel */}
          {p.showPanel && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 36 }}>
              {p.risks.map((rk, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{ padding: "13px 0", borderBottom: i < 3 ? `1px solid ${COLORS.line2}` : "none", opacity: dim ? 0.4 : 1, transition: "opacity .3s" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                      <span style={{ width: 12, height: 12, flex: "none", background: rk.accent }} />
                      <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 25, color: COLORS.ink }}>{rk.cn}</span>
                      <span className="rd-mono" style={{ fontSize: 13, color: axisCol }}>{rk.en}</span>
                      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ display: "flex", gap: 3 }}>
                          {[0, 1, 2, 3, 4].map((s) => (
                            <span key={s} style={{ width: 16, height: 8, background: s < rk.lvl ? rk.accent : COLORS.line2 }} />
                          ))}
                        </span>
                        <span className="rd-mono" style={{ fontSize: 14, color: rk.accent, fontWeight: 700 }}>{p.lv[rk.lvl]}</span>
                      </span>
                    </div>
                    <p className="rd-cap" style={{ margin: "5px 0 0 24px", fontSize: 18.5, lineHeight: 1.38 }}>{rk.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t007}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t008}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={-8} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
