import React from "react";
import { COLORS, FONTS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   VerticalSlide — 图片页 · 下游应用层 · 垂直应用 (data: 报告 3.1 垂直应用 245 亿 /
   25.3% + 第四章 下游 · 应用层 代表 Glean / Perplexity / Databricks + 6.2 看好方向
   垂直应用 · 已验证 PMF). Image-led: adaptive gallery (0–n) + narrative with one
   anchored figure and qualitative chips. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 2, min: 0, max: 4, step: 1,
    help: "图片槽数量（按真实比例对齐，0 为纯文字）" },
  { key: "layout", label: "图片排布", type: "select", default: "row",
    options: [{ value: "row", label: "横排" }, { value: "column", label: "竖排" }],
    help: "图片画廊的排布方式" },
  { key: "showFigure", label: "核心数字", type: "toggle", default: true,
    help: "垂直应用赛道融资额核心数字显示 / 隐藏" },
  { key: "chipCount", label: "特征标签", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "底部特征标签数量" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部「隐形价值」解读显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
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
  accent: "blue",
  copy: {
    t001: "下游 · 应用层 / VERTICAL AI",
    t002: "垂直应用 · 代表 Glean / Perplexity / Databricks",
    t003: "SECTOR · 垂直应用",
    t004: "离",
    t005: "收入最近",
    t006: "的一层",
    t007: "企业搜索、工作流自动化、行业 AI 等垂直应用全年吸纳 245 亿美元、占比 25.3%，仅次于通用大模型。 单笔金额不一定最大，但落地路径更清晰——Glean、Perplexity AI、Databricks 这类场景型公司 已嵌入真实业务流程，判断重点从\"融资规模\"转向\"付费留存与客户续约\"。",
    t008: "245",
    t009: "亿美元",
    t010: "垂直应用 · 占全年 25.3%",
    t011: "↳ 隐形价值区",
    t012: "当资本从\"赌叙事\"转向\"看兑现\"，已验证 PMF、ARR 持续增长的垂直应用， 是退潮后最可能留在牌桌上的标的——下游潜力最大，但仍需时间验证。",
    t013: "应用 / 产品界面配图 / DROP IMAGE",
    t014: "应用 / 产品界面配图 / DROP IMAGE",
    t015: "纯文字版式 · 无配图",
    t016: "↗ 企业搜索 · 工作流 · 数据平台界面",
  },
  chips: ["落地路径清晰 · 已验证 PMF", "看付费留存与客户续约", "嵌入刚性业务流程"],
  ...decorDefaults,
};



export default function VerticalSlide(props) {
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
