import React from "react";
import { COLORS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   GallerySlide — 图片页 · 模型层头部实验室影像志 (data: 第四章 中游模型层 +
   案例章节估值). An image-led "photo ledger": an adaptive justified gallery
   (0–n slots, any uploaded ratio) over a row of lab entries (name / 赛道 /
   估值 tag, focusable). All variable parts are props. Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 3, min: 0, max: 5, step: 1,
    help: "图片槽数量（按真实比例对齐排布，0 为纯文字）" },
  { key: "layout", label: "图片排布", type: "select", default: "row",
    options: [{ value: "row", label: "横排" }, { value: "column", label: "竖排" }],
    help: "图片画廊的排布方式" },
  { key: "labCount", label: "实验室数量", type: "slider", default: 4, min: 2, max: 5, step: 1,
    help: "底部实验室档案条目数量" },
  { key: "showValuation", label: "估值标记", type: "toggle", default: true,
    help: "各实验室估值 / 定位标记显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一家实验室" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的实验室序号（自动随实验室数量收敛）" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮实验室与标记的强调色" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  imageCount: 3,
  layout: "row",
  labCount: 4,
  showValuation: true,
  focusEnabled: true,
  focusIndex: 0,
  accent: "blue",
  copy: {
    t001: "中游 · 模型层 / LABS",
    t002: "2024 · 头部实验室影像志",
    t003: "押注 AGI 的",
    t004: "四张面孔",
    t005: "资本最密集、竞争最激烈、兑现最待验证的一层",
    t006: "实验室影像 / DROP IMAGE",
    t007: "实验室影像 / DROP IMAGE",
    t008: "纯文字版式 · 无配图",
    t009: "0",
  },
  labs: [
  { name: "Anthropic", tag: "通用大模型", note: "估值 9650 亿 · 全球最高" },
  { name: "OpenAI",    tag: "通用大模型", note: "估值次席 · AGI 先行者" },
  { name: "xAI",       tag: "通用大模型", note: "估值 500 亿 · 18 个月跻身" },
  { name: "SSI",       tag: "安全超级智能", note: "专用路线 · 安全对齐" },
  { name: "Mistral",   tag: "开源模型",   note: "欧洲 · 开源专用" },
  ],
  ...decorDefaults,
};

// 报告：中游 · 模型层头部实验室（估值 / 定位均取自原文）


export default function GallerySlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const n = Math.max(2, Math.min(p.labs.length, p.labCount));
  const labs = p.labs.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{copy.t003}<span style={{ color: accentInk }}>{copy.t004}</span></h2>
          <span className="rd-cap">{copy.t005}</span>
        </div>

        {/* adaptive image gallery */}
        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 22, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {p.imageCount > 0 ? (
            p.layout === "column" ? (
              <ImageGallery layout="column" count={p.imageCount} width={1680} height={470} gap={16}
                caption={copy.t006} />
            ) : (
              <ImageGallery layout="row" count={p.imageCount} width={1680} maxHeight={470} minHeight={240} gap={16}
                caption={copy.t007} />
            )
          ) : (
            <div className="rd-mono" style={{ color: COLORS.ink3, border: `1px solid ${COLORS.line2}`, padding: "70px 40px", textAlign: "center" }}>{copy.t008}</div>
          )}
        </div>

        {/* lab ledger */}
        <div className="rd-anim rd-anim-4" style={{ display: "flex", gap: 0, marginTop: 24 }}>
          {labs.map((L, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={i} style={{
                flex: 1, paddingTop: 14, paddingRight: 26, marginRight: i < n - 1 ? 26 : 0,
                borderTop: `3px solid ${hot ? accentInk : COLORS.ink}`,
                borderRight: i < n - 1 ? `1px solid ${COLORS.line2}` : "none",
                opacity: dim ? 0.5 : 1,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.01em", color: hot ? accentInk : COLORS.ink }}>{L.name}</span>
                  <span className="rd-mono" style={{ fontSize: 14, color: COLORS.ink3 }}>{copy.t009}{i + 1}</span>
                </div>
                <div className="rd-mono" style={{ fontSize: 15, color: COLORS.ink2, marginTop: 8 }}>{L.tag}</div>
                {p.showValuation && (
                  <div className="rd-cap" style={{ fontSize: 18, marginTop: 6, color: hot ? COLORS.ink : COLORS.ink2 }}>{L.note}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={118} rotate={8} pos={{ right: 40, top: 104 }} />
    </div>
  );
}
