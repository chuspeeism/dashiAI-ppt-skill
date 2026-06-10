import React from "react";
import { COLORS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CaseSlide — 典型案例 · Anthropic.
   Adaptive image column (0–n slots) + milestone timeline + quote, with an
   interleaved 3D hero. All variable parts are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 1, min: 0, max: 3, step: 1,
    help: "左侧图片槽数量，0 为纯文字案例" },
  { key: "showTimeline", label: "融资时间轴", type: "toggle", default: true,
    help: "右侧融资里程碑时间轴显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个里程碑" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 3, step: 1,
    help: "被高亮的里程碑序号（从 0 起）" },
  { key: "showQuote", label: "装饰引言", type: "toggle", default: true,
    help: "底部创始人引言显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  imageCount: 1,
  showTimeline: true,
  focusEnabled: true,
  focusIndex: 2,
  showQuote: true,
  // —— visible content (override per deck) ——
  eyebrow: "典型案例 / 07",
  kicker: "估值 9650 亿美元 · 全球最高",
  caseTag: "CASE STUDY · ANTHROPIC",
  title: "Anthropic：从追赶到反超",
  lead: "由 Dario Amodei 团队 2021 年创立。2024 年连续完成三轮大额融资，累计超 650 亿美元，估值突破 9650 亿美元，超越 OpenAI 成为全球估值最高的 AI 初创企业。",
  galleryCaption: "案例配图 / DROP IMAGE",
  quoteBody: "「通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。」",
  quoteAttribution: "—— Dario Amodei · CEO",
  milestones: [
    { time: "2024.05", label: "Series G", detail: "融资 280 亿 · 估值 600 亿" },
    { time: "2024.08", label: "Series H 首轮", detail: "融资 180 亿 · 估值 830 亿" },
    { time: "2024.11", label: "Series H 扩轮", detail: "融资 190 亿 · 估值 9650 亿" },
    { time: "2026.06", label: "已递交 IPO 申请", detail: "预计年内上市" },
  ],
  ...decorDefaults,
};

export default function CaseSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = COLORS.blue;

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 72, paddingTop: 36, minHeight: 0 }}>
          {/* left: image column + case tag */}
          <div className="rd-anim rd-anim-2" style={{ width: 560, flex: "none", display: "flex", flexDirection: "column", gap: 18 }}>
            {p.imageCount > 0 ? (
              <ImageGallery layout="column" count={p.imageCount} width={560} height={700} gap={14}
                caption={p.galleryCaption} />
            ) : <div style={{ flex: 1 }} />}
            <span className="rd-tag rd-tag--lime" style={{ alignSelf: "flex-start" }}>{p.caseTag}</span>
          </div>

          {/* right: title + story + timeline */}
          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
            <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 760 }}>{p.title}</h2>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 22, maxWidth: 780 }}>
              {p.lead}
            </p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={196} rotate={6}
              pos={{ right: 0, top: -10 }} />

            {p.showTimeline && (
              <div className="rd-anim rd-anim-3" style={{ marginTop: 34, display: "flex", flexDirection: "column" }}>
                {p.milestones.map((m, i) => {
                  const hot = p.focusEnabled && i === p.focusIndex;
                  return (
                    <div key={i} style={{ display: "flex", gap: 22, opacity: p.focusEnabled && !hot ? 0.5 : 1 }}>
                      {/* rail */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none", width: 16 }}>
                        <span style={{ width: hot ? 16 : 11, height: hot ? 16 : 11, borderRadius: "50%", background: hot ? accent : COLORS.ink, marginTop: 8 }} />
                        {i < p.milestones.length - 1 && <span style={{ flex: 1, width: 2, background: COLORS.line }} />}
                      </div>
                      <div style={{ paddingBottom: 22, flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                          <span className="rd-mono" style={{ fontSize: 24, color: hot ? accent : COLORS.ink3 }}>{m.time}</span>
                          <span style={{ fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 28, color: hot ? accent : COLORS.ink }}>{m.label}</span>
                        </div>
                        <div className="rd-cap" style={{ marginTop: 4 }}>{m.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {p.showQuote && (
              <div className="rd-anim rd-anim-4" style={{ marginTop: "auto", paddingTop: 18, borderTop: `2px solid ${COLORS.blue}` }}>
                <p style={{ fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 600, fontSize: 28, lineHeight: 1.4, color: COLORS.ink, margin: 0, textWrap: "pretty" }}>
                  {p.quoteBody}
                </p>
                <div className="rd-mono" style={{ marginTop: 10, color: COLORS.ink2 }}>{p.quoteAttribution}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
