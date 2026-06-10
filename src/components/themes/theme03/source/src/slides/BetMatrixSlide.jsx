import React from "react";
import { COLORS, FONTS, rich } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   BetMatrixSlide — 投资标的决策矩阵 (data: 报告 6.2 投资建议 + 3.4 四象限).
   A scatter of REAL named companies plotted on 商业兑现确定性 (x) × 竞争壁垒
   (y); a diagonal 优选→规避 gradient separates 看好 bets (upper-right) from
   规避 categories (lower-left). Names/notes are verbatim from the report's
   "看好 / 规避" lists. Pure / portable — props only.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showAxis", label: "坐标轴标注", type: "toggle", default: true,
    help: "两轴（兑现确定性 / 竞争壁垒）标注显示 / 隐藏" },
  { key: "showZones", label: "优选/规避区", type: "toggle", default: true,
    help: "对角「优选区 / 规避区」配色与角标显示 / 隐藏" },
  { key: "showAvoid", label: "规避标的", type: "toggle", default: true,
    help: "规避类标的（左下）显示 / 隐藏" },
  { key: "showCallout", label: "策略小结", type: "toggle", default: true,
    help: "底部投资策略小结显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个标的" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 10, step: 1,
    help: "被高亮的标的序号（自动随显示数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showAxis: true,
  showZones: true,
  showAvoid: true,
  showCallout: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "投资建议 / BET MATRIX",
  kicker: "兑现确定性 × 竞争壁垒",
  title: "投资标的决策矩阵",
  subtitle: "看好右上「优选区」· 规避左下「规避区」",
  yAxisLabel: "竞争壁垒 / 护城河 — 低 → 高",
  xAxisLabel: "商业兑现确定性 — 低 → 高",
  zoneGoodLabel: "优选区 / PREFER ✓",
  zoneAvoidLabel: "规避区 / AVOID ✕",
  calloutLabel: "↳ 策略",
  calloutBody: "看好兑现路径清晰、壁垒可守的标的——垂直应用（Glean、Harvey）、中游“卖铲子”（Scale AI、Pinecone、CoreWeave）与长周期具身智能（Figure AI）；规避高估值无收入的纯模型、“AI 包装”项目与缺乏数据护城河的消费应用。**判断重点不是融资规模，而是兑现与壁垒。**",
  // gx = 兑现确定性 (0低→1高), gy = 竞争壁垒/护城河 (0低→1高). w = 相对体量.
  goodItems: [
    { name: "CoreWeave", note: "算力云 · NVIDIA 长约", gx: 0.86, gy: 0.7, w: 1.0 },
    { name: "Databricks", note: "数据平台", gx: 0.78, gy: 0.83, w: 0.82 },
    { name: "Scale AI", note: "数据标注", gx: 0.68, gy: 0.58, w: 0.66 },
    { name: "Glean", note: "企业搜索", gx: 0.66, gy: 0.67, w: 0.58 },
    { name: "Harvey", note: "法律 AI", gx: 0.55, gy: 0.69, w: 0.52 },
    { name: "Pinecone", note: "向量数据库", gx: 0.58, gy: 0.49, w: 0.48 },
    { name: "Figure AI", note: "人形机器人 · 具身智能", gx: 0.37, gy: 0.81, w: 0.6 },
    { name: "Perplexity", note: "AI 搜索", gx: 0.5, gy: 0.37, w: 0.5 },
  ],
  avoidItems: [
    { name: "高估值纯模型", note: "烧钱快 · 壁垒被开源削弱", gx: 0.22, gy: 0.45, w: 0.86 },
    { name: "“AI 包装”项目", note: "仅套一层 LLM 调用", gx: 0.36, gy: 0.17, w: 0.5 },
    { name: "无护城河消费应用", note: "易被大厂复制", gx: 0.48, gy: 0.2, w: 0.52 },
  ],
  ...decorDefaults,
};

export default function BetMatrixSlide(props) {
  const p = { ...defaultProps, ...props };
  const dark = p.theme === "dark";
  const good = COLORS.blue;
  const goodTint = "#5f8f0c";
  const avoidC = "#b04a2f";
  const list = [...p.goodItems.map((d) => ({ ...d, bucket: "good" })), ...(p.showAvoid ? p.avoidItems.map((d) => ({ ...d, bucket: "avoid" })) : [])];
  const fi = Math.min(Math.max(0, p.focusIndex), list.length - 1);

  // plot geometry (fixed px → exact)
  const W = 1380, H = 556, padL = 8, padR = 8, padT = 8, padB = 8;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const X = (gx) => padL + gx * plotW;
  const Y = (gy) => padT + (1 - gy) * plotH;
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22, paddingBottom: 6 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.subtitle}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", gap: 14, minHeight: 0 }}>
          {/* y axis */}
          {p.showAxis && (
            <div style={{ flex: "none", width: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="rd-mono" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: COLORS.ink2, fontSize: 19, letterSpacing: "0.06em" }}>{p.yAxisLabel}</span>
            </div>
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ flex: 1, position: "relative", border: `1.5px solid ${COLORS.ink}`, minHeight: 0 }}>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                {p.showZones && (
                  <>
                    <polygon points={`${padL},${padT} ${W - padR},${padT} ${W - padR},${H - padB}`} fill={`${goodTint}16`} />
                    <polygon points={`${padL},${padT} ${padL},${H - padB} ${W - padR},${H - padB}`} fill={`${avoidC}12`} />
                    <line x1={padL} y1={H - padB} x2={W - padR} y2={padT} stroke={COLORS.line} strokeWidth="1.5" strokeDasharray="4 7" />
                  </>
                )}
                {/* mid grid */}
                <line x1={X(0.5)} y1={padT} x2={X(0.5)} y2={H - padB} stroke={COLORS.line2} strokeWidth="1" />
                <line x1={padL} y1={Y(0.5)} x2={W - padR} y2={Y(0.5)} stroke={COLORS.line2} strokeWidth="1" />
              </svg>

              {/* zone corner tags */}
              {p.showZones && (
                <>
                  <span className="rd-mono" style={{ position: "absolute", right: 16, top: 14, fontSize: 16, fontWeight: 700, color: goodTint }}>{p.zoneGoodLabel}</span>
                  <span className="rd-mono" style={{ position: "absolute", left: 16, bottom: 14, fontSize: 16, fontWeight: 700, color: avoidC }}>{p.zoneAvoidLabel}</span>
                </>
              )}

              {/* dots */}
              {list.map((d, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                const isGood = d.bucket === "good";
                const col = isGood ? good : avoidC;
                const dia = 18 + d.w * 30;
                const left = `${(X(d.gx) / W) * 100}%`;
                const top = `${(Y(d.gy) / H) * 100}%`;
                const labelLeft = d.gx > 0.74;   // flip label to the left near right edge
                return (
                  <div key={i} style={{ position: "absolute", left, top, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", flexDirection: labelLeft ? "row-reverse" : "row", gap: 9, opacity: dim ? 0.32 : 1, transition: "opacity .3s", zIndex: hot ? 4 : 2, whiteSpace: "nowrap" }}>
                    <span style={{ flex: "none", width: dia, height: dia, borderRadius: "50%", background: `${col}${isGood ? "2e" : "26"}`, border: `${hot ? 3 : 2.5}px solid ${col}`, boxShadow: hot ? `0 0 0 6px ${col}22` : "none" }} />
                    <span style={{ display: "flex", flexDirection: "column", textAlign: labelLeft ? "right" : "left" }}>
                      <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: hot ? 22 : 20, color: COLORS.ink, lineHeight: 1.1 }}>{d.name}</span>
                      <span className="rd-mono" style={{ fontSize: 13, color: axisCol }}>{d.note}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            {p.showAxis && (
              <div className="rd-mono" style={{ textAlign: "center", paddingTop: 8, color: COLORS.ink2, fontSize: 19, letterSpacing: "0.06em" }}>{p.xAxisLabel}</div>
            )}
          </div>
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {rich(p.calloutBody)}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={-7} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
