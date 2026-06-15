import React from "react";
import { FONTS } from "../theme.js";
import ImageSlot from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from "../../../../unicorn-background.jsx";

/* ============================================================================
   CoverImageSlide — 封面 · 全幅影像式 (full-bleed image cover).
   构图：满版背景图槽（cover 自适应）+ 随主题翻转的可读蒙版 + 压图巨型标题 + 数据带。
   蒙版用 color-mix(var(--rd-bg)) 表达 → 跟随明暗主题双向切换；文字用 var(--rd-ink)。
   imageCount=0 退化为纯色封面。controls 暴露页面开关；defaultProps 暴露全部可见文案；
   图片由用户拖入图片槽（自适应比例）。
   ========================================================================== */

export const controls = [
  UNICORN_BACKGROUND_CONTROL,
  createUnicornSceneControl("moving"),
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "左上角分类标签的显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "蒙版 / 文字明暗主题（亦随预览深浅切换）" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 1, min: 0, max: 1, step: 1,
    help: "全幅背景图槽数量（0 为纯色封面）" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "标签、高亮词与核心数字的强调色" },
  { key: "showFigure", label: "核心数字", type: "toggle", default: true,
    help: "右上角核心数字徽标的显示 / 隐藏" },
  { key: "showMeta", label: "底部数据", type: "toggle", default: true,
    help: "底部支撑数据带的显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  imageCount: 1,
  backgroundMode: "unicorn",
  unicornScene: "moving",
  accent: "blue",
  showFigure: true,
  showMeta: true,
  // —— visible content (override per deck) ——
  eyebrow: "行业研究报告 · 年度",
  kicker: "SMART HARDWARE // CHINA 2026",
  titleKicker: "年度增长研究 · 封面",
  titleA: "2026 中国",
  titleAccent: "智能硬件",
  titleC: "产业增长报告",
  sub: "供应链、终端体验与生态格局的全景扫描。",
  imageCaption: "封面主视觉 / DROP HERO IMAGE",
  figureValue: "+38",
  figureUnit: "%",
  figureCaption: "整体市场 · 同比增速",
  meta: [
    { v: "4820 亿", k: "市场规模 · 元 / 2026E" },
    { v: "+38%", k: "整体同比增速" },
    { v: "97 家", k: "头部厂商样本" },
  ],
  ...decorDefaults,
};

export default function CoverImageSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const useUnicorn = p.backgroundMode === "unicorn";
  const hasImg = !useUnicorn && p.imageCount > 0;
  const meta = p.meta || [];

  // scrim derives from the theme bg token → flips with light / dark (and the
  // preview deep/shallow toggle). Text uses the matching ink tokens.
  const ink = "var(--rd-ink)", ink2 = "var(--rd-ink-2)", line = "var(--rd-line)";
  const field = "color-mix(in srgb, var(--rd-bg) 84%, var(--rd-ink) 16%)";
  const scrim =
    "linear-gradient(90deg, color-mix(in srgb, var(--rd-bg) 92%, transparent) 0%," +
    " color-mix(in srgb, var(--rd-bg) 56%, transparent) 44%, color-mix(in srgb, var(--rd-bg) 12%, transparent) 100%)," +
    "linear-gradient(0deg, color-mix(in srgb, var(--rd-bg) 88%, transparent) 0%," +
    " color-mix(in srgb, var(--rd-bg) 6%, transparent) 42%, color-mix(in srgb, var(--rd-bg) 26%, transparent) 100%)";

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      {/* full-bleed image / field */}
      <div style={{ position: "absolute", inset: 0, background: field }}>
        {useUnicorn ? (
          <UnicornBackground scene={p.unicornScene} accent={accent} />
        ) : hasImg ? (
          <ImageSlot fit="cover" radius={0} caption={p.imageCaption} />
        ) : null}
      </div>
      <div style={{ position: "absolute", inset: 0, background: scrim, pointerEvents: "none" }} />

      {/* content frame */}
      <div className="rd-frame" style={{ justifyContent: "flex-end", zIndex: 3, pointerEvents: "none" }}>
        {/* top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "var(--rd-pad-y) var(--rd-pad-x) 0",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          {p.showEyebrow
            ? <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span>
            : <span />}
          <span className="rd-mono rd-anim" style={{ color: ink2 }}>{p.kicker}</span>
        </div>

        {/* masthead title bottom-left */}
        <div style={{ maxWidth: 1240 }}>
          <span className="rd-mono rd-anim" style={{ color: accent, fontSize: 26 }}>{p.titleKicker}</span>
          <h1 className="rd-anim rd-anim-2" style={{
            margin: "20px 0 0", fontFamily: FONTS.sans, fontWeight: 900, fontSize: 128,
            lineHeight: 0.99, letterSpacing: "-0.02em", color: ink, textWrap: "balance",
          }}>
            <span>{p.titleA}</span>
            <span style={{ color: accent }}>{p.titleAccent}</span>
            <br />
            <span>{p.titleC}</span>
          </h1>
          <p className="rd-anim rd-anim-3" style={{
            margin: "28px 0 0", fontSize: 30, lineHeight: 1.45, color: ink2, maxWidth: 900,
          }}>
            {p.sub}
          </p>
        </div>

        {/* bottom data band */}
        {p.showMeta && meta.length > 0 && (
          <div className="rd-anim rd-anim-4" style={{
            display: "flex", gap: 0, borderTop: `1px solid ${line}`, paddingTop: 24, marginTop: 46,
          }}>
            {meta.map((m, i) => (
              <div key={i} style={{ paddingRight: 52, marginRight: 52,
                borderRight: i < meta.length - 1 ? `1px solid ${line}` : "none" }}>
                <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 48, letterSpacing: "-0.01em",
                  color: ink, fontFeatureSettings: '"tnum" 1' }}>{m.v}</div>
                <div className="rd-mono" style={{ fontSize: 24, color: ink2, marginTop: 6 }}>{m.k}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* giant anchor figure top-right */}
      {p.showFigure && (
        <div className="rd-anim rd-anim-3" style={{ position: "absolute", top: 184, right: 120, zIndex: 3,
          textAlign: "right", pointerEvents: "none" }}>
          <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 220, lineHeight: 0.8,
            letterSpacing: "-0.04em", color: accent, fontFeatureSettings: '"tnum" 1' }}>{p.figureValue}<span style={{ fontSize: 120 }}>{p.figureUnit}</span></div>
          <div className="rd-mono" style={{ fontSize: 24, color: ink2, marginTop: 16 }}>{p.figureCaption}</div>
        </div>
      )}

      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={150} rotate={8} pos={{ right: 90, bottom: 240 }} />
    </div>
  );
}
