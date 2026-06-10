import React from "react";
import { COLORS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   SpotlightSlide — 图片页 · 案例聚焦 (image-led case spotlight, xAI).
   An adaptive justified image gallery (0–n, any ratio) paired with a narrative
   column: key figures (focusable) + a callout. All variable parts are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 2, min: 0, max: 4, step: 1,
    help: "图片槽数量（按真实比例对齐排布，0 为纯文字）" },
  { key: "layout", label: "图片排布", type: "select", default: "row",
    options: [
      { value: "row", label: "横排" },
      { value: "column", label: "竖排" },
    ], help: "图片画廊的排布方式" },
  { key: "statCount", label: "关键数字", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "展示的关键数字数量" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个关键数字" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 1, min: 0, max: 2, step: 1,
    help: "被高亮的关键数字序号（自动随关键数字数量收敛）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部差异化优势解读显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "关键数字与标记的强调色" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  imageCount: 2,
  layout: "row",
  statCount: 3,
  focusEnabled: true,
  focusIndex: 1,
  showCallout: true,
  accent: "blue",
  copy: {
    t001: "典型案例 / 08",
    t002: "xAI · 估值 500 亿美元",
    t003: "CASE STUDY · xAI",
    t004: "马斯克的",
    t005: "「第三次创业」",
    t006: "2023 年由埃隆·马斯克创立，2024 年 11 月完成 50 亿美元融资、估值达 500 亿美元。 体量虽不及 OpenAI / Anthropic，但增速惊人——从成立到跻身头部梯队仅用 18 个月。",
    t007: "↳ 差异化优势",
    t008: "背靠 X（原 Twitter）平台的海量实时社交数据，并与特斯拉自动驾驶团队协同； Grok 模型主打「幽默 · 实时 · 无审查」，差异化定位明显。",
    t009: "案例配图 / DROP IMAGE",
    t010: "案例配图 / DROP IMAGE",
    t011: "纯文字案例 · 无配图",
    t012: "↗ Grok · 多模态感知",
  },
  stats: [
  { num: "50", unit: "亿美元", note: "2024.11 单轮融资" },
  { num: "500", unit: "亿美元", note: "最新估值" },
  { num: "18", unit: "个月", note: "从成立到头部梯队" },
  ],
  ...decorDefaults,
};



export default function SpotlightSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const statN = Math.max(0, Math.min(p.stats.length, p.statCount));
  const stats = p.stats.slice(0, statN);
  const fi = Math.min(p.focusIndex, Math.max(0, statN - 1));

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
            <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 760 }}>{copy.t004}<span style={{ color: accentInk }}>{copy.t005}</span>
            </h2>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 20, maxWidth: 760 }}>{copy.t006}</p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={130} rotate={7}
              pos={{ left: 0, bottom: 200 }} />

            {statN > 0 && (
              <div className="rd-anim rd-anim-3" style={{ display: "flex", gap: 0, marginTop: 40 }}>
                {stats.map((s, i) => {
                  const hot = p.focusEnabled && i === fi;
                  return (
                    <div key={i} style={{
                      flex: 1, paddingRight: 28, marginRight: 28,
                      borderRight: i < statN - 1 ? `1px solid ${COLORS.line2}` : "none",
                      opacity: p.focusEnabled && !hot ? 0.45 : 1,
                    }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "nowrap" }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 78, lineHeight: 0.9, letterSpacing: "-0.03em", color: hot ? accentInk : COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{s.num}</span>
                        <span className="rd-mono" style={{ fontSize: 22, color: COLORS.ink2, whiteSpace: "nowrap", flexShrink: 0 }}>{s.unit}</span>
                      </div>
                      <div className="rd-cap" style={{ marginTop: 10 }}>{s.note}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {p.showCallout && (
              <div className="rd-anim rd-anim-4" style={{ marginTop: "auto", paddingTop: 22, borderTop: `2px solid ${accentInk}` }}>
                <div className="rd-mono" style={{ color: accentInk, marginBottom: 12 }}>{copy.t007}</div>
                <p className="rd-cap" style={{ maxWidth: 800 }}>{copy.t008}</p>
              </div>
            )}
          </div>

          {/* right: adaptive image gallery */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.18, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", minWidth: 0 }}>
            {p.imageCount > 0 ? (
              p.layout === "column" ? (
                <ImageGallery layout="column" count={p.imageCount} width={760} height={780} gap={16}
                  caption={copy.t009} />
              ) : (
                <ImageGallery layout="row" count={p.imageCount} width={760} maxHeight={780} minHeight={300} gap={16}
                  caption={copy.t010} />
              )
            ) : (
              <div className="rd-mono" style={{ color: COLORS.ink3, border: `1px solid ${COLORS.line2}`, padding: "60px 40px", textAlign: "center" }}>{copy.t011}</div>
            )}
            {p.imageCount > 0 && (
              <span className="rd-mono" style={{ marginTop: 16, color: COLORS.ink3, alignSelf: "flex-end" }}>{copy.t012}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
