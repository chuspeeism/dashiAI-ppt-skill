import React from "react";
import { ImageGallery } from "../ImageSlot.jsx";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   SectionSlide — 章节分隔页 (section divider).
   A bold, full-bleed chapter opener: oversized index + title, optional
   adaptive image column, optional interleaved 3D hero. Light / dark theme.
   Pure presentational — every variable arrives via props. Text is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签的显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮元素使用的强调色" },
  { key: "showIndex", label: "章节序号", type: "toggle", default: true,
    help: "超大章节序号的显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 1, min: 0, max: 2, step: 1,
    help: "右侧图片槽数量，0 为纯文字章节页（改为巨型描边序号）" },
  { key: "showMeta", label: "页脚信息", type: "toggle", default: true,
    help: "底部小节索引的显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  accent: "blue",
  showIndex: true,
  imageCount: 1,
  showMeta: true,
  copy: {
    t001: "章节 / SECTION",
    t002: "AI · VENTURE CAPITAL // USA",
    t003: "04",
    t004: "CHAPTER FOUR",
    t005: "结构透视",
    t006: "与",
    t007: "展望",
    t008: "在市场全景之上，进一步拆解轮次结构、月度节奏与集中度， 回答资金「如何分布、何时加速、向谁集中」，并据此展望下一阶段的产业走向。",
    t009: "章节配图 / DROP IMAGE",
    t010: "04",
    t011: "本章包含",
    t012: "横纵分析法",
  },
  subsections: ["逐月明细", "轮次结构", "核心数据"],
  ...decorDefaults,
};



export default function SectionSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        {/* top bar */}
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{copy.t001}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        {/* main */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 72, minHeight: 0, paddingTop: 8 }}>
          {/* left: index + title */}
          <div style={{ flex: 1.4, position: "relative" }}>
            {p.showIndex && (
              <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 18 }}>
                <span style={{ fontFamily: 'var(--rd-mono)', fontWeight: 700, fontSize: 168, lineHeight: 0.8,
                  letterSpacing: "-0.04em", color: accent }}>{copy.t003}</span>
                <span style={{ width: 2, height: 132, background: "var(--rd-line)" }} />
                <span className="rd-mono" style={{ fontSize: 26, writingMode: "vertical-rl", letterSpacing: "0.22em" }}>{copy.t004}</span>
              </div>
            )}
            <h2 className="rd-display rd-anim rd-anim-3" style={{ fontSize: 132, maxWidth: 980 }}>{copy.t005}<br />{copy.t006}<span style={{ color: accent }}>{copy.t007}</span>
            </h2>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 30, maxWidth: 760 }}>{copy.t008}</p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={196} rotate={-6}
              pos={{ left: 470, top: -150 }} z={2} />
          </div>

          {/* right: adaptive image column, or oversized ghost index */}
          <div className="rd-anim rd-anim-4" style={{ width: 600, flex: "none", display: "flex", justifyContent: "flex-end" }}>
            {p.imageCount > 0 ? (
              <ImageGallery layout="column" count={p.imageCount} width={600} height={760} gap={16}
                caption={copy.t009} />
            ) : (
              <span aria-hidden="true" style={{
                fontFamily: 'var(--rd-sans)', fontWeight: 900, fontSize: 560, lineHeight: 0.74,
                letterSpacing: "-0.05em", color: "transparent",
                WebkitTextStroke: `2px var(--rd-line)`, userSelect: "none",
              }}>{copy.t010}</span>
            )}
          </div>
        </div>

        {/* footer meta */}
        {p.showMeta && (
          <div>
            <div className="rd-hairline" style={{ marginBottom: 18 }} />
            <div className="rd-mono" style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 24 }}>
              <span style={{ color: accent }}>{copy.t011}</span>
              {p.subsections.map((s, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 22 }}>
                  <span>{String(i + 1).padStart(2, "0")} · {s}</span>
                  {i < p.subsections.length - 1 && <span style={{ width: 6, height: 6, background: "var(--rd-line)", borderRadius: "50%" }} />}
                </span>
              ))}
              <span style={{ marginLeft: "auto" }}>{copy.t012}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
