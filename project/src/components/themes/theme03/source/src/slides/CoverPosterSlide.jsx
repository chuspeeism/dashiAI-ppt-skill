import React from "react";
import ImageSlot from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from "../../../../unicorn-background.jsx";

/* ============================================================================
   CoverPosterSlide — 封面 · 中央对称海报式 (centered symmetric poster).
   构图：内描边框 + 四角等宽标注 + 居中分类标签 / 巨型标题 / 副标题 / 底部数据。
   controls 暴露页面开关；defaultProps 暴露全部可见文案（标题 / 四角标注 / 数据）。
   ========================================================================== */

export const controls = [
  UNICORN_BACKGROUND_CONTROL,
  createUnicornSceneControl("automations"),
  { key: "imageCount", label: "背景图", type: "slider", default: 1, min: 0, max: 1, step: 1,
    dependsOn: "backgroundMode", dependsOnValue: "media", help: "上传模式下的整页背景图槽" },
  { key: "showEyebrow", label: "中央标签", type: "toggle", default: true,
    help: "居中分类标签的显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "标题高亮词与强调元素使用的强调色" },
  { key: "showFrame", label: "描边边框", type: "toggle", default: true,
    help: "海报内描边框与四角标注的显示 / 隐藏" },
  { key: "showFigure", label: "核心数字", type: "toggle", default: true,
    help: "标题下方核心数据徽标的显示 / 隐藏" },
  { key: "showMeta", label: "页脚信息", type: "toggle", default: true,
    help: "底部数据口径说明的显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  accent: "lime",
  backgroundMode: "unicorn",
  unicornScene: "automations",
  imageCount: 1,
  imageCaption: "背景图 / DROP IMAGE",
  showFrame: true,
  showFigure: true,
  showMeta: true,
  // —— visible content (override per deck) ——
  eyebrow: "行业研究报告 · 年度专题",
  titleA: "2026 中国智能硬件",
  titleB: "产业",
  titleAccent: "增长",
  titleC: "报告",
  sub: "供应链、终端体验与生态格局的全景扫描",
  figureValue: "4820",
  figureCaption: "亿元市场规模 · 同比 +38%",
  corners: [
    { pos: { top: 0, left: 0 }, t: "VOL. 04" },
    { pos: { top: 0, right: 0 }, t: "2026.06" },
    { pos: { bottom: 0, left: 0 }, t: "RESEARCH" },
    { pos: { bottom: 0, right: 0 }, t: "CN // HW" },
  ],
  meta: ["编制 · 2026.06", "口径 · 公开市场数据", "样本 · 2,400+"],
  ...decorDefaults,
};

export default function CoverPosterSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const useUnicorn = p.backgroundMode === "unicorn";
  const hasImg = !useUnicorn && p.imageCount > 0;
  const corners = p.corners || [];
  const meta = p.meta || [];

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      {(useUnicorn || hasImg) && (
        <div style={{ position: "absolute", inset: 0, background: p.theme === "dark" ? "#161513" : "#d6d6d3" }}>
          {useUnicorn ? (
            <UnicornBackground scene={p.unicornScene} accent={accent} />
          ) : (
            <ImageSlot fit="cover" radius={0} caption={p.imageCaption} />
          )}
        </div>
      )}
      {(useUnicorn || hasImg) && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: p.theme === "dark" ? "rgba(22,21,19,0.58)" : "rgba(214,214,211,0.72)" }} />
      )}
      <div className="rd-frame" style={{ padding: 64 }}>
        {/* inner outline + corner labels */}
        {p.showFrame && (
          <div className="rd-anim" style={{ position: "absolute", inset: 64, border: "1px solid var(--rd-line)", pointerEvents: "none" }}>
            {corners.map((c, i) => (
              <span key={i} className="rd-mono" style={{
                position: "absolute", ...c.pos, fontSize: 24, padding: "14px 18px",
                background: "var(--rd-bg)", color: "var(--rd-ink-2)", letterSpacing: "0.12em",
              }}>{c.t}</span>
            ))}
          </div>
        )}

        {/* centered stack */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", gap: 0, padding: "0 120px",
        }}>
          {p.showEyebrow && (
            <span className={`rd-tag rd-anim rd-anim-2 ${onLime ? "rd-tag--lime" : ""}`} style={{ marginBottom: 44 }}>
              {p.eyebrow}
            </span>
          )}

          <h1 className="rd-display rd-anim rd-anim-2" style={{ fontSize: 134, lineHeight: 1.02 }}>
            <span>{p.titleA}</span>
            <br />
            <span>{p.titleB}</span>
            <span style={{ color: accent }}>{p.titleAccent}</span>
            <span>{p.titleC}</span>
          </h1>

          <p className="rd-sub rd-anim rd-anim-3" style={{
            marginTop: 40, maxWidth: 1080, fontWeight: 500, color: "var(--rd-ink-2)",
          }}>
            {p.sub}
          </p>

          {p.showFigure && (
            <div className="rd-anim rd-anim-3" style={{
              marginTop: 56, display: "inline-flex", alignItems: "center", gap: 22,
              padding: "16px 30px", border: "2px solid var(--rd-ink)",
            }}>
              <span style={{ fontFamily: "var(--rd-mono)", fontWeight: 700, fontSize: 56, lineHeight: 1, color: "var(--rd-ink)" }}>{p.figureValue}</span>
              <span className="rd-mono" style={{ fontSize: 26, color: "var(--rd-ink-2)" }}>{p.figureCaption}</span>
            </div>
          )}
        </div>

        {/* bottom centered meta */}
        {p.showMeta && meta.length > 0 && (
          <div className="rd-mono rd-anim rd-anim-4" style={{
            display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 24,
            paddingBottom: 8, whiteSpace: "nowrap",
          }}>
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: accent }}>●</span>}
                <span>{m}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={210} rotate={-8} pos={{ right: 150, bottom: 150 }} />
    </div>
  );
}
