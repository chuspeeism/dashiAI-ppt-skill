import React from "react";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ColophonSlide — 数据来源 / 封底 (back cover & sources).
   A closing colophon: report title restated, data scope + sources + the
   research disclaimers, and meta footer. Light / dark theme. Pure & portable;
   copy is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "lime",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "强调元素使用的强调色" },
  { key: "showSources", label: "来源说明", type: "toggle", default: true,
    help: "数据口径 / 来源说明列表显示 / 隐藏" },
  { key: "noteCount", label: "提示条数", type: "slider", default: 3, min: 1, max: 3, step: 1,
    help: "底部研究提示 / 免责声明条数" },
  { key: "showMeta", label: "页脚信息", type: "toggle", default: true,
    help: "底部编制信息显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "dark",
  accent: "lime",
  showSources: true,
  noteCount: 3,
  showMeta: true,
  // —— visible content (override per deck) ——
  eyebrow: "附录 / COLOPHON",
  kicker: "END · 数据来源与说明",
  titlePrefix: "下一程，",
  titleAccentA: "赌叙事",
  titleMid: "到",
  titleAccentB: "看兑现",
  titleSuffix: "。",
  lead: "2024 年是美国 AI 资本化进程的关键一年。能把技术转化为可持续收入的公司，才能在退潮后留在牌桌上。",
  meta: ["《2024 美国大额融资 AI 公司调研报告》", "编制 · 2026.06", "仅供研究参考"],
  sourcesLabel: "↳ 数据来源",
  notesLabel: "↳ 研究提示",
  sources: [
    { k: "数据口径", v: "2024 全年公开披露的 ≥1 亿美元融资事件" },
    { k: "数据来源", v: "综合整理自公开渠道，部分数据经研究性推演" },
    { k: "分析框架", v: "横纵分析法 · 横向看集中 / 纵向看节奏 / 结构看分层" },
  ],
  notes: [
    "本报告数据仅供研究与测试参考，不构成任何投资建议。",
    "部分估值与收入为研究性推演，可能与最终披露存在差异。",
    "内容由 AI 生成，请谨慎参考并自行核实关键数据。",
  ],
  copy: {
    t001: "从",
  },
  ...decorDefaults,
};

export default function ColophonSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const notes = p.notes.slice(0, Math.max(1, Math.min(p.notes.length, p.noteCount)));

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 80, paddingTop: 36, minHeight: 0 }}>
          {/* left: closing statement */}
          <div style={{ flex: 1.2, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
            <h2 className="rd-display rd-anim rd-anim-2" style={{ fontSize: 92, maxWidth: 820 }}>
              {p.titlePrefix}<br />{copy.t001}<span style={{ color: accent }}>{p.titleAccentA}</span>{p.titleMid}<span style={{ color: accent }}>{p.titleAccentB}</span>{p.titleSuffix}
            </h2>
            <p className="rd-body rd-anim rd-anim-3" style={{ marginTop: 28, maxWidth: 720 }}>
              {p.lead}
            </p>

            <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={210} rotate={9}
              pos={{ left: 40, top: 348 }} z={6} />

            {p.showMeta && (
              <div className="rd-anim rd-anim-4" style={{ marginTop: "auto" }}>
                <div className="rd-hairline" style={{ marginBottom: 18 }} />
                <div className="rd-mono" style={{ display: "flex", gap: 44, fontSize: 23, flexWrap: "wrap" }}>
                  {p.meta.map((m, i) => (
                    <span key={i} style={i === p.meta.length - 1 ? { color: accent } : undefined}>{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right: sources + disclaimers */}
          {p.showSources && (
            <div className="rd-anim rd-anim-3" style={{ flex: 1, borderLeft: "1px solid var(--rd-line)", paddingLeft: 56, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              <div className="rd-mono" style={{ color: accent, marginBottom: 22 }}>{p.sourcesLabel}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {p.sources.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 22, padding: "16px 0", borderTop: i > 0 ? "1px solid var(--rd-line-2)" : "none" }}>
                    <span className="rd-mono" style={{ fontSize: 21, width: 116, flexShrink: 0, color: "var(--rd-ink-3)" }}>{s.k}</span>
                    <span className="rd-cap" style={{ flex: 1 }}>{s.v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 30, paddingTop: 24, borderTop: `2px solid ${accent}` }}>
                <div className="rd-mono" style={{ color: accent, marginBottom: 14 }}>{p.notesLabel}</div>
                <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {notes.map((nt, i) => (
                    <li key={i} className="rd-cap" style={{ display: "flex", gap: 12 }}>
                      <span className="rd-mono" style={{ color: accent, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                      <span>{nt}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
