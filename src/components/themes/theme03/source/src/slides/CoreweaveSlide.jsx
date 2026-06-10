import React from "react";
import { COLORS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CoreweaveSlide — 图片页 · 案例聚焦 (the "pick-and-shovel" winner, CoreWeave).
   Distinct from SpotlightSlide: a before→after PIVOT block drives the narrative
   (crypto-mine → AI compute-cloud), paired with key figures, a callout, and an
   adaptive justified image gallery (0–n, any ratio). All variable parts props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showPivot", label: "转型对比", type: "toggle", default: true,
    help: "「矿场 → 算力云」转型对比块显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 2, min: 0, max: 4, step: 1,
    help: "图片槽数量（按真实比例对齐排布，0 为纯文字）" },
  { key: "layout", label: "图片排布", type: "select", default: "column",
    options: [
      { value: "row", label: "横排" },
      { value: "column", label: "竖排" },
    ], help: "图片画廊的排布方式" },
  { key: "statCount", label: "关键数字", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "展示的关键数字数量" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个关键数字" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被高亮的关键数字序号（自动随关键数字数量收敛）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部「卖铲子」逻辑解读显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "关键数字与标记的强调色" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showPivot: true,
  imageCount: 2,
  layout: "column",
  statCount: 3,
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  accent: "lime",
  // —— visible content (override per deck) ——
  eyebrow: "典型案例 / 03",
  kicker: "CoreWeave · 估值 190 亿美元+",
  caseTag: "CASE STUDY · CoreWeave",
  titlePrefix: "「卖铲子」的人，",
  titleAccentPrefix: "也",
  titleAccent: "赚翻了",
  pivotFromTime: "2018 — 2022",
  pivotFromLabel: "加密货币挖矿",
  pivotToTime: "2023 →",
  pivotToLabel: "AI 算力云服务",
  lead: "CoreWeave 原本是一家加密货币挖矿公司，2023 年转身为 AI 算力云服务商。与 NVIDIA 签订长期供应协议，手握数万张 H100 / H200 GPU，成为 OpenAI、Stability AI 等公司的核心算力供应商。",
  calloutLabel: "↳ 「卖铲子」逻辑",
  calloutBody: "当所有模型公司都在抢 GPU，提前锁定算力资源的基础设施提供商，反而成为最稀缺的标的——「淘金热中卖铲子」的商业逻辑被完美印证。",
  galleryCaption: "案例配图 / DROP IMAGE",
  emptyText: "纯文字案例 · 无配图",
  stats: [
    { num: "110", unit: "亿美元", note: "2024 年融资额" },
    { num: "190", unit: "亿美元+", note: "最新估值" },
    { num: "2023", unit: "转型元年", note: "矿场 → 算力云" },
  ],
  ...decorDefaults,
};

export default function CoreweaveSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const statN = Math.max(0, Math.min(p.stats.length, p.statCount));
  const stats = p.stats.slice(0, statN);
  const fi = Math.min(p.focusIndex, Math.max(0, statN - 1));

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 72, paddingTop: 36, minHeight: 0 }}>
          {/* left: narrative */}
          <div style={{ flex: 1.04, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
            <span className="rd-tag rd-tag--ghost rd-anim" style={{ alignSelf: "flex-start", marginBottom: 22 }}>{p.caseTag}</span>
            <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 760 }}>
              {p.titlePrefix}<br />{p.titleAccentPrefix}<span style={{ color: accentInk }}>{p.titleAccent}</span>
            </h2>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={158} rotate={-8}
              pos={{ right: -18, top: 150 }} />

            {p.showPivot && (
              <div className="rd-anim rd-anim-3" style={{ display: "flex", alignItems: "stretch", gap: 18, marginTop: 30 }}>
                <div style={{ flex: 1, padding: "18px 22px", border: `1px solid ${COLORS.line}`, background: "transparent", minWidth: 0 }}>
                  <div className="rd-mono" style={{ fontSize: 20, color: COLORS.ink3 }}>{p.pivotFromTime}</div>
                  <div className="rd-sub" style={{ fontSize: 30, marginTop: 7, color: COLORS.ink2, textDecoration: "line-through", textDecorationColor: COLORS.line }}>{p.pivotFromLabel}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 40, color: accentInk, lineHeight: 1 }}>→</span>
                </div>
                <div style={{ flex: 1, padding: "18px 22px", border: `2px solid ${accentInk}`, background: p.accent === "lime" ? "rgba(194,245,61,0.16)" : "rgba(39,66,236,0.06)", minWidth: 0 }}>
                  <div className="rd-mono" style={{ fontSize: 20, color: accentInk }}>{p.pivotToTime}</div>
                  <div className="rd-sub" style={{ fontSize: 30, marginTop: 7, color: COLORS.ink }}>{p.pivotToLabel}</div>
                </div>
              </div>
            )}

            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 26, maxWidth: 760 }}>
              {p.lead}
            </p>

            {statN > 0 && (
              <div className="rd-anim rd-anim-3" style={{ display: "flex", gap: 0, marginTop: "auto", paddingTop: 28 }}>
                {stats.map((s, i) => {
                  const hot = p.focusEnabled && i === fi;
                  return (
                    <div key={i} style={{
                      flex: 1, paddingRight: 24, marginRight: 24,
                      borderRight: i < statN - 1 ? `1px solid ${COLORS.line2}` : "none",
                      opacity: p.focusEnabled && !hot ? 0.45 : 1,
                    }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "nowrap" }}>
                        <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 66, lineHeight: 0.9, letterSpacing: "-0.03em", color: hot ? accentInk : COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{s.num}</span>
                        <span className="rd-mono" style={{ fontSize: 20, color: COLORS.ink2, whiteSpace: "nowrap", flexShrink: 0 }}>{s.unit}</span>
                      </div>
                      <div className="rd-cap" style={{ marginTop: 9, fontSize: 22 }}>{s.note}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* right: adaptive image gallery + callout */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
            {p.imageCount > 0 ? (
              p.layout === "column" ? (
                <ImageGallery layout="column" count={p.imageCount} width={720}
                  height={p.showCallout ? 560 : 760} gap={16} caption={p.galleryCaption} />
              ) : (
                <ImageGallery layout="row" count={p.imageCount} width={720}
                  maxHeight={p.showCallout ? 560 : 760} minHeight={260} gap={16} caption={p.galleryCaption} />
              )
            ) : (
              <div className="rd-mono" style={{ color: COLORS.ink3, border: `1px solid ${COLORS.line2}`, padding: "60px 40px", textAlign: "center" }}>{p.emptyText}</div>
            )}

            {p.showCallout && (
              <div className="rd-anim rd-anim-4" style={{ marginTop: "auto", paddingTop: 22, borderTop: `2px solid ${accentInk}` }}>
                <div className="rd-mono" style={{ color: accentInk, marginBottom: 12 }}>{p.calloutLabel}</div>
                <p className="rd-cap" style={{ maxWidth: 720 }}>
                  {p.calloutBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
