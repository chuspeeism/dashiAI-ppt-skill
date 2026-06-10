import React from "react";
import { COLORS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   PestSlide — PEST / PESTEL 宏观环境分析.
   Vertical factor pillars (政治 / 经济 / 社会 / 技术 [+ 环境 / 法律]); each
   column carries a watermark letter, header, and a tunable list of forces.
   Column count switches PEST(4) ↔ PESTEL(6); item count is tunable. Distinct
   "newspaper columns" composition. Pure / portable — props only.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "factorCount", label: "因素维度", type: "slider", default: 4, min: 4, max: 6, step: 1,
    help: "环境因素维度数量（4 = PEST · 6 = PESTEL）" },
  { key: "itemCount", label: "每维条目", type: "slider", default: 3, min: 2, max: 4, step: 1,
    help: "每个维度展示的要点数量" },
  { key: "showLetter", label: "维度字母", type: "toggle", default: true,
    help: "各列的巨型水印字母（P / E / S / T …）显示 / 隐藏" },
  { key: "showAnalysis", label: "模型解读", type: "toggle", default: true,
    help: "底部分析解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个维度列" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 5, step: 1,
    help: "被高亮的维度序号（自动随因素维度数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  factorCount: 4,
  itemCount: 3,
  showLetter: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 0,
  theme: "light",
  copy: {
    t001: "环境分析 /",
    t002: "宏观环境 · 不可控外部力量",
    t003: "宏观环境分析",
    t004: "扫描外部不可控力量 · 识别机会与威胁",
    t005: "↳ 解读",
    t006: "扫描的是企业「不可控」的外部环境——分析重点不是逐条罗列，而是判断每股力量的",
    t007: "方向与强度",
    t008: "， 进而把宏观趋势转译为自身的机会与威胁，前置到战略与 SWOT 之中。",
  },
  factors: [
  { k: "P", cn: "政治", en: "POLITICAL",      accent: COLORS.blue, items: ["政策监管走向", "政府补贴与扶持", "出口与技术管制", "地缘政治格局"] },
  { k: "E", cn: "经济", en: "ECONOMIC",       accent: "#5f8f0c",   items: ["利率与流动性", "资本市场景气", "通胀与成本压力", "整体增长预期"] },
  { k: "S", cn: "社会", en: "SOCIAL",         accent: "#b8821a",   items: ["用户接受度", "人才供给结构", "伦理与舆论环境", "使用习惯迁移"] },
  { k: "T", cn: "技术", en: "TECHNOLOGICAL",  accent: "#b04a2f",   items: ["算法能力突破", "算力成本曲线", "开源生态演进", "专利与标准之争"] },
  { k: "E", cn: "环境", en: "ENVIRONMENTAL",  accent: "#2a7d8c",   items: ["能耗与碳排放", "数据中心选址", "绿色算力转型", "可持续合规要求"] },
  { k: "L", cn: "法律", en: "LEGAL",          accent: "#6a4ea3",   items: ["数据合规要求", "知识产权边界", "反垄断审查", "安全与责任立法"] },
  ],
  ...decorDefaults,
};


const FACTOR_DARK = ["#6e85ff", "#9ccb3a", "#d8a43c", "#e07a5a", "#56b9c9", "#a98fd6"];

export default function PestSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const n = Math.min(Math.max(4, p.factorCount), 6);
  const ni = Math.min(Math.max(2, p.itemCount), 4);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const cols = p.factors.slice(0, n).map((f, i) => ({ ...f, accent: dark ? FACTOR_DARK[i] : f.accent }));
  const kind = n >= 6 ? "PESTEL" : n === 5 ? "PESTE" : "PEST";

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}{kind}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22, paddingBottom: 6 }}>
          <h2 className="rd-title">{kind}{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 16, minHeight: 0, marginTop: 20 }}>
          {cols.map((f, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", minWidth: 0, border: `2px solid ${hot ? f.accent : COLORS.line}`, opacity: dim ? 0.42 : 1, transition: "opacity .3s, border-color .3s" }}>
                {/* header band */}
                <div style={{ position: "relative", overflow: "hidden", padding: "18px 20px 16px", background: hot ? f.accent : `${f.accent}16`, borderBottom: `2px solid ${f.accent}` }}>
                  {p.showLetter && (
                    <span style={{ position: "absolute", right: 4, bottom: -38, fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 150, lineHeight: 1, color: hot ? "rgba(255,255,255,0.22)" : f.accent, opacity: hot ? 1 : 0.16, pointerEvents: "none" }}>{f.k}</span>
                  )}
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 36, color: hot ? "#fff" : COLORS.ink, lineHeight: 1 }}>{f.cn}</div>
                    <div className="rd-mono" style={{ fontSize: 14, color: hot ? "rgba(255,255,255,0.85)" : COLORS.ink3, marginTop: 7, letterSpacing: "0.08em" }}>{f.en}</div>
                  </div>
                </div>
                {/* factor list */}
                <ul style={{ listStyle: "none", margin: 0, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
                  {f.items.slice(0, ni).map((it, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "11px 0", borderBottom: j < ni - 1 ? `1px solid ${COLORS.line2}` : "none", fontSize: 21, lineHeight: 1.3, color: COLORS.ink2 }}>
                      <span style={{ flex: "none", width: 8, height: 8, marginTop: 9, background: f.accent }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{copy.t005}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {kind}{copy.t006}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t007}</strong>{copy.t008}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={124} rotate={-7} pos={{ right: 44, top: 110 }} />
    </div>
  );
}
