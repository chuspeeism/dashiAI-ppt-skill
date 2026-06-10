import React from "react";
import { COLORS, FONTS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   EmbodiedSlide — 图片页 · 下游前沿 · 具身智能 (data: 第四章 下游应用层 +
   6.2 看好方向 · 具身智能). Image-led: an adaptive justified gallery (0–n) plus
   a narrative column with one anchored figure (Figure AI 最大单笔 6.8 亿) and a
   set of qualitative "看好理由" chips. All variable parts are props. Portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 2, min: 0, max: 4, step: 1,
    help: "图片槽数量（按真实比例对齐排布，0 为纯文字）" },
  { key: "layout", label: "图片排布", type: "select", default: "row",
    options: [{ value: "row", label: "横排" }, { value: "column", label: "竖排" }],
    help: "图片画廊的排布方式" },
  { key: "showFigure", label: "核心数字", type: "toggle", default: true,
    help: "Figure AI 最大单笔核心数字显示 / 隐藏" },
  { key: "chipCount", label: "理由标签", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "「看好理由」特征标签数量" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部看好逻辑解读显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "核心数字与标记的强调色" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  imageCount: 2,
  layout: "row",
  showFigure: true,
  chipCount: 3,
  showCallout: true,
  accent: "lime",
  copy: {
    t001: "下游应用层 / FRONTIER",
    t002: "看好方向 · 具身智能 / EMBODIED AI",
    t003: "SECTOR · 具身智能",
    t004: "把模型",
    t005: "装进身体",
    t006: "的下一站",
    t007: "人形机器人与自动驾驶把通用智能从屏幕推向物理世界。Figure AI 作为该赛道代表， 坐落产业链下游应用层——单笔融资即达 6.8 亿美元，是「需要长周期技术积累的硬科技」典型。",
    t008: "6.8",
    t009: "亿美元",
    t010: "Figure AI · 最大单笔",
    t011: "↳ 看好逻辑",
    t012: "技术壁垒高、复制周期长，一旦落地便形成数据 + 硬件双护城河—— 适合作为「长周期、高确定性」的耐心资本配置，而非短线叙事博弈。",
    t013: "具身智能配图 / DROP IMAGE",
    t014: "具身智能配图 / DROP IMAGE",
    t015: "纯文字版式 · 无配图",
    t016: "↗ 人形机器人 · 物理世界落地",
  },
  chips: ["人形机器人 · 具身硬件", "长周期硬科技壁垒", "与自动驾驶协同感知"],
  ...decorDefaults,
};

// 报告 6.2 看好方向 · 具身智能（特征均取自原文）


export default function EmbodiedSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const chips = p.chips.slice(0, Math.max(0, Math.min(p.chips.length, p.chipCount)));

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 72, paddingTop: 36, minHeight: 0 }}>
          {/* left: narrative */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
            <span className="rd-tag rd-tag--ghost rd-anim" style={{ alignSelf: "flex-start", marginBottom: 22 }}>{copy.t003}</span>
            <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 760 }}>{copy.t004}<span style={{ color: accentInk }}>{copy.t005}</span>{copy.t006}</h2>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 20, maxWidth: 760 }}>{copy.t007}</p>

            {p.showFigure && (
              <div className="rd-anim rd-anim-3" style={{ marginTop: 36, display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 116, lineHeight: 0.86, letterSpacing: "-0.03em", color: accentInk, fontFeatureSettings: '"tnum" 1' }}>{copy.t008}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="rd-mono" style={{ fontSize: 22, color: COLORS.ink2 }}>{copy.t009}</span>
                  <span className="rd-cap" style={{ fontSize: 18 }}>{copy.t010}</span>
                </div>
              </div>
            )}

            {chips.length > 0 && (
              <div className="rd-anim rd-anim-3" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
                {chips.map((c, i) => (
                  <span key={i} style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 20, color: COLORS.ink, border: `1.5px solid ${COLORS.ink}`, padding: "9px 16px" }}>{c}</span>
                ))}
              </div>
            )}

            {p.showCallout && (
              <div className="rd-anim rd-anim-4" style={{ marginTop: "auto", paddingTop: 22, borderTop: `2px solid ${accentInk}` }}>
                <div className="rd-mono" style={{ color: accentInk, marginBottom: 12 }}>{copy.t011}</div>
                <p className="rd-cap" style={{ maxWidth: 820 }}>{copy.t012}</p>
              </div>
            )}
          </div>

          {/* right: adaptive image gallery */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.18, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", minWidth: 0 }}>
            {p.imageCount > 0 ? (
              p.layout === "column" ? (
                <ImageGallery layout="column" count={p.imageCount} width={760} height={780} gap={16}
                  caption={copy.t013} />
              ) : (
                <ImageGallery layout="row" count={p.imageCount} width={760} maxHeight={780} minHeight={300} gap={16}
                  caption={copy.t014} />
              )
            ) : (
              <div className="rd-mono" style={{ color: COLORS.ink3, border: `1px solid ${COLORS.line2}`, padding: "60px 40px", textAlign: "center" }}>{copy.t015}</div>
            )}
            {p.imageCount > 0 && (
              <span className="rd-mono" style={{ marginTop: 16, color: COLORS.ink3, alignSelf: "flex-end" }}>{copy.t016}</span>
            )}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={130} rotate={7} pos={{ left: 0, bottom: 150 }} />
    </div>
  );
}
