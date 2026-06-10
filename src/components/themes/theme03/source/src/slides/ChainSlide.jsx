import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ChainSlide — AI 产业链分层 (上游 / 中游 / 下游).
   Stacked layer bands with company chips and an interleaved 3D hero.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "layerCount", label: "层级数量", type: "slider", default: 3, min: 1, max: 3, step: 1,
    help: "展示的产业链层级数量（上游→下游）" },
  { key: "showChips", label: "公司标签", type: "toggle", default: true,
    help: "各环节代表公司标签显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一层级" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 1, min: 0, max: 2, step: 1,
    help: "被高亮的层级序号（从 0 起）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  layerCount: 3,
  showChips: true,
  focusEnabled: false,
  focusIndex: 1,
  // —— visible content (override per deck) ——
  eyebrow: "产业链 / 06",
  kicker: "上游 → 中游 → 下游 · 分层映射",
  title: "产业链分层透视",
  layers: [
    { idx: "01", tier: "上游", name: "基础设施", en: "INFRASTRUCTURE",
      segs: [
        { seg: "AI 芯片", cos: ["Cerebras", "Groq"] },
        { seg: "算力云 / 数据", cos: ["CoreWeave", "Scale AI"] },
      ] },
    { idx: "02", tier: "中游", name: "模型层", en: "MODEL LAYER",
      segs: [
        { seg: "通用大模型", cos: ["OpenAI", "Anthropic", "xAI"] },
        { seg: "开源 / 专用模型", cos: ["Mistral", "SSI"] },
      ] },
    { idx: "03", tier: "下游", name: "应用层", en: "APPLICATION",
      segs: [
        { seg: "企业生产力", cos: ["Glean", "Databricks"] },
        { seg: "消费 / 搜索", cos: ["Perplexity"] },
        { seg: "具身智能", cos: ["Figure AI"] },
      ] },
  ],
  ...decorDefaults,
};

// Each tier carries its own colour identity so the three layers read as
// distinct strata at a glance: ink (上游) → blue (中游) → lime (下游).
// Built per-render (see getTones) so it follows the JS theme.
function getTones() {
  const dk = isRDDark();
  return [
    { solid: COLORS.ink,  text: COLORS.bg,      tint: dk ? "rgba(243,242,238,0.05)" : "rgba(22,21,19,0.055)", chip: dk ? "rgba(243,242,238,0.06)" : "rgba(22,21,19,0.05)",  chipText: COLORS.ink2 },
    { solid: COLORS.blue, text: COLORS.blueInk, tint: dk ? "rgba(110,133,255,0.10)" : "rgba(39,66,236,0.07)",  chip: dk ? "rgba(110,133,255,0.14)" : "rgba(39,66,236,0.10)", chipText: COLORS.blue },
    { solid: "#aee21f",   text: "#161513",       tint: dk ? "rgba(174,226,31,0.14)" : "rgba(174,226,31,0.16)", chip: dk ? "rgba(174,226,31,0.16)" : "rgba(120,160,10,0.16)", chipText: dk ? "#cfe86b" : "#3f5408" },
  ];
}

export default function ChainSlide(props) {
  const TONES = getTones();
  const p = { ...defaultProps, ...props };
  const LAYERS = p.layers || [];
  const accent = COLORS.blue;
  const count = Math.max(1, Math.min(3, p.layerCount));
  const layers = LAYERS.slice(0, count);
  const focusIndex = Math.min(p.focusIndex, count - 1);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 28, paddingBottom: 18 }}>
          <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 1000 }}>{p.title}</h2>
          <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={250} rotate={-6}
            pos={{ right: 120, top: -28 }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {layers.map((L, i) => {
            const tone = TONES[i % TONES.length];
            const hot = p.focusEnabled && i === focusIndex;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={L.idx} className="rd-anim rd-anim-3" style={{
                flex: 1, display: "flex", gap: 0, alignItems: "stretch",
                background: tone.tint,
                outline: hot ? `3px solid ${tone.solid}` : "none",
                outlineOffset: -3,
                opacity: dim ? 0.32 : 1, transition: "opacity .3s",
              }}>
                {/* layer label — solid colour block per tier */}
                <div style={{
                  width: 320, flex: "none", background: tone.solid, color: tone.text,
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  padding: "0 30px",
                }}>
                  <div className="rd-mono" style={{ fontSize: 24, opacity: 0.78, color: tone.text }}>{L.idx} · {L.tier}</div>
                  <h3 className="rd-headline" style={{ fontSize: 46, marginTop: 4, color: tone.text }}>{L.name}</h3>
                  <div className="rd-mono" style={{ fontSize: 20, marginTop: 6, opacity: 0.62, color: tone.text }}>{L.en}</div>
                </div>
                {/* segments */}
                <div style={{ flex: 1, display: "flex", gap: 0, alignItems: "stretch", paddingLeft: 6 }}>
                  {L.segs.map((s, si) => (
                    <div key={s.seg} style={{
                      flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                      padding: "0 28px", borderLeft: si === 0 ? "none" : `1px solid ${COLORS.line2}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 10, height: 10, flex: "none", background: tone.solid }} />
                        <span style={{ fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 27, color: COLORS.ink }}>{s.seg}</span>
                      </div>
                      {p.showChips && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12, paddingLeft: 20 }}>
                          {s.cos.map((co) => (
                            <span key={co} style={{
                              fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 600, fontSize: 22,
                              padding: "4px 11px", background: tone.chip, color: tone.chipText,
                            }}>{co}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
