import React from "react";
import { ImageGallery } from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CoverSlide — report title / cover.
   Pure presentational: every variable aspect — including all visible copy and
   data — arrives via props. `controls` exposes page-level toggles; the full
   default content lives in `defaultProps` so the page is self-contained and
   portable to any host without the demo runtime.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签的显示 / 隐藏" },
  { key: "showFigure", label: "重点数字", type: "toggle", default: true,
    help: "右侧核心数据是否突出展示" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮元素使用的强调色" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 1, min: 0, max: 3, step: 1,
    help: "封面图片槽数量，0 为纯文字封面" },
  { key: "showMeta", label: "页脚信息", type: "toggle", default: true,
    help: "底部数据口径说明的显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showFigure: true,
  accent: "blue",
  imageCount: 1,
  showMeta: true,
  // —— visible content (override per deck) ——
  eyebrow: "调研报告 · 2024",
  kicker: "AI · VENTURE CAPITAL // USA",
  titlePrefix: "2024 美国大额融资",
  titleAccent: "AI",
  titleSuffix: " 公司调研报告",
  lead: "2024 年是美国人工智能产业的「资本大年」。本报告聚焦单笔 ≥1 亿美元的大额融资事件，以横纵分析法梳理市场全景、行业分布、轮次结构与典型案例。",
  figureValue: "970",
  figureUnit: "亿美元",
  figureLabel: "全年 AI 风险投资额",
  figureCaption: "占全美风险投资近 ⅓ · 97 笔大额融资事件",
  galleryCaption: "封面配图 / DROP IMAGE",
  meta: ["编制 · 2026.06", "口径 · ≥1 亿美元公开融资", "横纵分析法", "仅供研究参考"],
  ...decorDefaults,
};

export default function CoverSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const meta = p.meta || [];

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        {/* top bar */}
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${p.accent === "lime" ? "rd-tag--lime" : ""}`}>
              {p.eyebrow}
            </span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        {/* main */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 80, paddingTop: 24 }}>
          <div style={{ flex: 1.5 }}>
            <h1 className="rd-display rd-anim rd-anim-2" style={{ maxWidth: 1000 }}>
              <span>{p.titlePrefix}</span>
              <br />
              <span className="rd-blue" style={{ color: accent }}>{p.titleAccent}</span>
              <span>{p.titleSuffix}</span>
            </h1>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 40, maxWidth: 760 }}>
              {p.lead}
            </p>
          </div>

          {p.showFigure && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, textAlign: "right", borderLeft: "1px solid var(--rd-line)", paddingLeft: 64 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 12 }}>
                <span className="rd-figure" style={{ color: "var(--rd-ink)" }}>{p.figureValue}</span>
                <span className="rd-headline" style={{ marginTop: 14, color: accent }}>{p.figureUnit}</span>
              </div>
              <p className="rd-sub" style={{ fontSize: "var(--rd-sub)", fontWeight: 700, margin: "18px 0 0" }}>
                {p.figureLabel}
              </p>
              <p className="rd-cap" style={{ marginTop: 8 }}>
                {p.figureCaption}
              </p>
            </div>
          )}
        </div>

        {/* image band */}
        {p.imageCount > 0 && (
          <div className="rd-anim rd-anim-4" style={{ marginBottom: 28 }}>
            <ImageGallery
              count={p.imageCount}
              width={1680}
              maxHeight={222}
              minHeight={150}
              gap={16}
              caption={p.galleryCaption}
            />
          </div>
        )}

        {/* footer meta */}
        {p.showMeta && meta.length > 0 && (
          <div>
            <div className="rd-hairline" style={{ marginBottom: 18 }} />
            <div className="rd-mono" style={{ display: "flex", gap: 48, fontSize: 24 }}>
              {meta.map((m, i) => (
                <span key={i} style={i === meta.length - 1 ? { marginLeft: "auto" } : undefined}>{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={296} rotate={4} pos={{ right: 76, bottom: 126 }} />
    </div>
  );
}
