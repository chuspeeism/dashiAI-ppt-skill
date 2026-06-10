import React from "react";
import { COLORS, FONTS } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ComputeSlide — 图片页 · 算力军备竞赛 · GPU 集群 (data: 报告 3.1 基础设施 158 亿 /
   16.3% + 5.3 CoreWeave 数万张 H100/H200 + 6.1 算力卡脖子 / NVIDIA 长约). Image-led:
   adaptive gallery (0–n datacenter shots) + narrative anchored on one figure and
   qualitative chips. Distinct from ChipsSlide (上游芯片) — this is 算力云 / 数据
   中心 / GPU 机柜. Pure / portable.
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
    help: "基础设施赛道融资额核心数字显示 / 隐藏" },
  { key: "chipCount", label: "特征标签", type: "slider", default: 3, min: 0, max: 3, step: 1,
    help: "底部特征标签数量" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部算力卡位解读显示 / 隐藏" },
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
  // —— visible content (override per deck) ——
  eyebrow: "中游 · 基础设施 / COMPUTE",
  kicker: "算力云 · 代表 CoreWeave / NVIDIA 长约",
  sectorTag: "SECTOR · 算力云 / 数据中心",
  titlePrefix: "抢 GPU，就是",
  titleAccent: "抢未来",
  titleSuffix: "",
  lead: "当所有模型公司都在抢 GPU，提前锁定算力的基础设施提供商反而成为稀缺标的。CoreWeave 手握数万张 H100/H200、与 NVIDIA 签下长期供应协议，成为 OpenAI、Stability AI 等公司的核心算力供应商——基础设施赛道全年吸纳 158 亿美元、约占 16.3%。",
  figureValue: "158",
  figureUnit: "亿美元",
  figureCaption: "基础设施赛道 · 占全年 16.3%",
  chips: ["数万张 H100 / H200", "NVIDIA 长期供应协议", "头部模型公司核心供应商"],
  calloutLabel: "↳ 卖铲赢家",
  calloutBody: "“淘金热中卖铲子”——谁掌握 GPU 与电力，谁就握住整条价值链的咽喉。算力云因此成为兼具融资热度与收入确定性的“明星兑现”标的。",
  galleryCaption: "数据中心 / GPU 机柜 / DROP IMAGE",
  galleryNote: "↗ 机房 · GPU 机柜 · 算力集群",
  emptyText: "纯文字版式 · 无配图",
  ...decorDefaults,
};

export default function ComputeSlide(props) {
  const p = { ...defaultProps, ...props };
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const chips = p.chips.slice(0, Math.max(0, Math.min(p.chips.length, p.chipCount)));

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 72, paddingTop: 36, minHeight: 0 }}>
          {/* left: narrative */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
            <span className="rd-tag rd-tag--ghost rd-anim" style={{ alignSelf: "flex-start", marginBottom: 22 }}>{p.sectorTag}</span>
            <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 760 }}>
              {p.titlePrefix}<span style={{ color: accentInk }}>{p.titleAccent}</span>{p.titleSuffix}
            </h2>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 20, maxWidth: 760 }}>
              {p.lead}
            </p>

            {p.showFigure && (
              <div className="rd-anim rd-anim-3" style={{ marginTop: 36, display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 116, lineHeight: 0.86, letterSpacing: "-0.03em", color: accentInk, fontFeatureSettings: '"tnum" 1' }}>{p.figureValue}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="rd-mono" style={{ fontSize: 22, color: COLORS.ink2 }}>{p.figureUnit}</span>
                  <span className="rd-cap" style={{ fontSize: 18 }}>{p.figureCaption}</span>
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
                <div className="rd-mono" style={{ color: accentInk, marginBottom: 12 }}>{p.calloutLabel}</div>
                <p className="rd-cap" style={{ maxWidth: 820 }}>
                  {p.calloutBody}
                </p>
              </div>
            )}
          </div>

          {/* right: adaptive image gallery */}
          <div className="rd-anim rd-anim-2" style={{ flex: 1.18, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", minWidth: 0 }}>
            {p.imageCount > 0 ? (
              p.layout === "column" ? (
                <ImageGallery layout="column" count={p.imageCount} width={760} height={780} gap={16}
                  caption={p.galleryCaption} />
              ) : (
                <ImageGallery layout="row" count={p.imageCount} width={760} maxHeight={780} minHeight={300} gap={16}
                  caption={p.galleryCaption} />
              )
            ) : (
              <div className="rd-mono" style={{ color: COLORS.ink3, border: `1px solid ${COLORS.line2}`, padding: "60px 40px", textAlign: "center" }}>{p.emptyText}</div>
            )}
            {p.imageCount > 0 && (
              <span className="rd-mono" style={{ marginTop: 16, color: COLORS.ink3, alignSelf: "flex-end" }}>{p.galleryNote}</span>
            )}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={130} rotate={7} pos={{ left: 0, bottom: 150 }} />
    </div>
  );
}
