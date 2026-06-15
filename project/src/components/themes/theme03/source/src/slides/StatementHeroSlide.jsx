import React from "react";
import { COLORS, FONTS } from "../theme.js";
import ImageSlot from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from "../../../../unicorn-background.jsx";

/* ============================================================================
   StatementSlide — 全幅影像主张页 (data: 报告摘要「近三分之一」+ 970 亿 / 97 笔).
   A full-bleed single image (aspect-adaptive, cover) under a legibility scrim,
   carrying one giant statement + anchor figure. Works image-led OR as a pure
   type poster (imageCount 0). Bold visual punctuation. Pure / portable.
   ========================================================================== */

export const controls = [
  UNICORN_BACKGROUND_CONTROL,
  createUnicornSceneControl("goey"),
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 1, min: 0, max: 1, step: 1,
    help: "全幅背景图槽数量（0 为纯文字主张海报）" },
  { key: "showFigure", label: "核心数字", type: "toggle", default: true,
    help: "右下角核心数字（≈1/3）显示 / 隐藏" },
  { key: "showMeta", label: "支撑数据", type: "toggle", default: true,
    help: "底部支撑微数据条显示 / 隐藏" },
  { key: "align", label: "文案对齐", type: "select", default: "left",
    options: [{ value: "left", label: "左下" }, { value: "center", label: "居中" }],
    help: "主张文案的版面位置" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮词与核心数字的强调色" },
  { key: "theme", label: "主题", type: "select", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "底色 / 蒙版明暗（纯文字版式时生效）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  imageCount: 1,
  backgroundMode: "unicorn",
  unicornScene: "goey",
  showFigure: true,
  showMeta: true,
  align: "left",
  accent: "lime",
  theme: "dark",
  copy: {
    t001: "全幅主视觉 / DROP HERO IMAGE",
    t002: "资本大年 / CAPITAL YEAR",
    t003: "2024 · 美国 AI 大额融资",
    t004: "报告摘要 · 一句话定调",
    t005: "这一年，AI 吞下了全美",
    t006: "近三分之一",
    t007: "的风险投资。",
    t008: "970 亿美元、97 笔单笔过亿的大额融资，把资本的天平彻底压向人工智能——一个由少数头部赢家定义的资本大年。",
    t009: "AI 占全美风投 · 近三分之一",
  },
  meta: [
  { v: "970 亿", k: "全年大额融资总额 / 美元" },
  { v: "97 笔", k: "单笔 ≥ 1 亿美元事件" },
  { v: "43.3%", k: "通用大模型占 AI 大额融资" },
  ],
  ...decorDefaults,
};



export default function StatementSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme !== "light";
  const accent = p.accent === "blue" ? "#6e85ff" : COLORS.lime;
  const useUnicorn = p.backgroundMode === "unicorn";
  const hasImg = !useUnicorn && p.imageCount > 0;
  const center = p.align === "center";

  // overlay text always reads on a dark scrim/field → fixed light ink
  const ink = "#f4f3ef", ink2 = "rgba(244,243,239,0.74)", line = "rgba(244,243,239,0.24)";
  const fieldBg = dark ? "#161513" : "#26251f";
  const scrim = center
    ? "linear-gradient(0deg, rgba(13,12,11,0.78) 0%, rgba(13,12,11,0.42) 50%, rgba(13,12,11,0.72) 100%)"
    : "linear-gradient(90deg, rgba(13,12,11,0.86) 0%, rgba(13,12,11,0.55) 46%, rgba(13,12,11,0.18) 100%), linear-gradient(0deg, rgba(13,12,11,0.6) 0%, rgba(13,12,11,0) 42%)";

  return (
    <div className="rd-slide rd-dark">
      {/* full-bleed image / field */}
      <div style={{ position: "absolute", inset: 0, background: fieldBg }}>
        {useUnicorn ? (
          <UnicornBackground scene={p.unicornScene} accent={accent} />
        ) : hasImg ? (
          <ImageSlot fit="cover" radius={0} caption={copy.t001} />
        ) : null}
      </div>
      {/* legibility scrim */}
      <div style={{ position: "absolute", inset: 0, background: scrim, pointerEvents: "none" }} />

      {/* content */}
      <div className="rd-frame" style={{ justifyContent: center ? "center" : "flex-end", alignItems: center ? "center" : "flex-start", textAlign: center ? "center" : "left", zIndex: 3, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 22 }}>
          {p.showEyebrow ? <span className="rd-tag rd-anim" style={{ background: accent, color: "#161513" }}>{copy.t002}</span> : <span />}
          <span className="rd-mono rd-anim" style={{ color: ink2 }}>{copy.t003}</span>
        </div>

        <div style={{ maxWidth: center ? 1320 : 1180 }}>
          <span className="rd-mono rd-anim" style={{ color: accent, fontSize: 26 }}>{copy.t004}</span>
          <h2 className="rd-anim rd-anim-2" style={{ margin: "18px 0 0", fontFamily: FONTS.sans, fontWeight: 900, fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.02em", color: ink, textWrap: "balance" }}>{copy.t005}<br />
            <span style={{ color: accent }}>{copy.t006}</span>{copy.t007}</h2>
          <p className="rd-anim rd-anim-3" style={{ margin: "26px 0 0", fontSize: 28, lineHeight: 1.5, color: ink2, maxWidth: center ? 900 : 820, marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }}>{copy.t008}</p>
        </div>

        {p.showMeta && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", gap: 0, borderTop: `1px solid ${line}`, paddingTop: 22, marginTop: 48, justifyContent: center ? "center" : "flex-start" }}>
            {p.meta.map((m, i) => (
              <div key={i} style={{ paddingRight: 48, marginRight: 48, borderRight: i < p.meta.length - 1 ? `1px solid ${line}` : "none" }}>
                <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 40, letterSpacing: "-0.01em", color: ink, fontFeatureSettings: '"tnum" 1' }}>{m.v}</div>
                <div className="rd-mono" style={{ fontSize: 15, color: ink2, marginTop: 4 }}>{m.k}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* giant anchor figure */}
      {p.showFigure && !center && (
        <div className="rd-anim rd-anim-3" style={{ position: "absolute", top: 150, right: 120, zIndex: 3, textAlign: "right", pointerEvents: "none" }}>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 260, lineHeight: 0.8, letterSpacing: "-0.04em", color: accent, fontFeatureSettings: '"tnum" 1' }}>⅓</div>
          <div className="rd-mono" style={{ fontSize: 20, color: ink2, marginTop: 14 }}>{copy.t009}</div>
        </div>
      )}

      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 60, bottom: 200 }} />
    </div>
  );
}
