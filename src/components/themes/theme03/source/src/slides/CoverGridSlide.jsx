import React from "react";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CoverGridSlide — 封面 · 深色模块网格式 (dark modular / Swiss-brutalist grid).
   构图：粗野主义分栏网格 —— 标题模块 + 竖向巨数模块 + 荧光绿色块 + 等宽元数据。
   网格线由 gap 透出底色形成。controls 暴露页面开关；defaultProps 暴露全部可见文案。
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签的显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题（亦随预览深浅切换）" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "竖向巨数与强调元素使用的强调色" },
  { key: "showFigure", label: "巨数模块", type: "toggle", default: true,
    help: "右侧竖向巨型数字模块的显示 / 隐藏" },
  { key: "showPunch", label: "荧光绿块", type: "toggle", default: true,
    help: "左下荧光绿主张色块的显示 / 隐藏" },
  { key: "showMeta", label: "元数据块", type: "toggle", default: true,
    help: "底部等宽元数据模块的显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  accent: "blue",
  showFigure: true,
  showPunch: true,
  showMeta: true,
  // —— visible content (override per deck) ——
  eyebrow: "行业研究报告 · 04",
  kicker: "SMART HARDWARE // CHINA · 2026",
  titleKicker: "ANNUAL · 年度增长研究",
  titleA: "2026 中国",
  titleAccent: "智能硬件",
  titleC: "增长报告",
  titleBody: "供应链、终端体验与生态格局的全景扫描。",
  figureLabel: "市场规模 / 2026E",
  figureValue: "4820",
  figureUnit: "亿元 · 同比 +38%",
  figureNote: "— 97 家头部厂商样本",
  punchKicker: "核心判断 / THESIS",
  punchText: "增长来自结构性升级，\n而非总量扩张。",
  metaLines: ["编制 · 2026.06", "口径 · 公开市场数据 + 厂商调研", "样本 · 2,400+ · 仅供研究参考"],
  metaStrip: ["编制 · 2026.06", "口径 · 公开市场数据 + 厂商调研", "样本 · 2,400+", "仅供研究参考"],
  ...decorDefaults,
};

export default function CoverGridSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const cell = { background: "var(--rd-bg)", display: "flex", flexDirection: "column" };
  const punchLines = (p.punchText || "").split("\n");
  const metaLines = p.metaLines || [];
  const metaStrip = p.metaStrip || [];

  // grid areas adapt to which modules are visible
  const cols = p.showFigure ? "1.6fr 1.05fr" : "1fr";
  const rows = (p.showPunch || p.showMeta) ? "1.75fr 1fr" : "1fr";
  let areas;
  if (p.showFigure) {
    areas = (p.showPunch || p.showMeta)
      ? `"title fig" "${p.showPunch ? "punch" : "meta"} fig"`
      : `"title fig" "title fig"`;
  } else {
    areas = (p.showPunch || p.showMeta) ? `"title" "${p.showPunch ? "punch" : "meta"}"` : `"title"`;
  }

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame" style={{ padding: 56 }}>
        {/* top bar */}
        <div className="rd-topbar" style={{ paddingBottom: 18, borderBottom: "none" }}>
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        {/* modular grid */}
        <div className="rd-anim rd-anim-2" style={{
          flex: 1, minHeight: 0, marginTop: 16,
          display: "grid", gridTemplateColumns: cols, gridTemplateRows: rows,
          gridTemplateAreas: areas, gap: 3, background: "var(--rd-line)",
          border: "3px solid var(--rd-line)",
        }}>
          {/* title module */}
          <div style={{ ...cell, gridArea: "title", justifyContent: "space-between", padding: "48px 52px" }}>
            <span className="rd-mono" style={{ fontSize: 24, letterSpacing: "0.14em" }}>{p.titleKicker}</span>
            <h1 className="rd-display" style={{ fontSize: 116, lineHeight: 0.98 }}>
              <span>{p.titleA}</span>
              <br />
              <span style={{ color: accent }}>{p.titleAccent}</span>
              <br />
              <span>{p.titleC}</span>
            </h1>
            <p className="rd-body" style={{ maxWidth: 700, fontSize: 26 }}>
              {p.titleBody}
            </p>
          </div>

          {/* tall figure module */}
          {p.showFigure && (
            <div style={{ ...cell, gridArea: "fig", justifyContent: "space-between", padding: "48px 44px" }}>
              <span className="rd-mono" style={{ fontSize: 24, letterSpacing: "0.12em" }}>{p.figureLabel}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--rd-mono)", fontWeight: 700, fontSize: 168,
                  lineHeight: 0.82, letterSpacing: "-0.04em", color: accent }}>{p.figureValue}</span>
                <span className="rd-headline" style={{ fontSize: 40, marginTop: 6 }}>{p.figureUnit}</span>
              </div>
              <span className="rd-mono" style={{ fontSize: 24, color: "var(--rd-ink-3)" }}>{p.figureNote}</span>
            </div>
          )}

          {/* lime punch module */}
          {p.showPunch && (
            <div style={{ gridArea: "punch", display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "40px 52px", background: "var(--rd-lime)", color: "#161513" }}>
              <span style={{ fontFamily: "var(--rd-mono)", fontSize: 24, letterSpacing: "0.12em", marginBottom: 14 }}>{p.punchKicker}</span>
              <p style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 42, lineHeight: 1.12, margin: 0, letterSpacing: "-0.01em" }}>
                {punchLines.map((ln, i) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{ln}</React.Fragment>
                ))}
              </p>
            </div>
          )}

          {/* meta module (shown when punch hidden, or below as area swap) */}
          {!p.showPunch && p.showMeta && (
            <div style={{ ...cell, gridArea: "meta", justifyContent: "center", padding: "40px 52px" }}>
              <div className="rd-mono" style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 24 }}>
                {metaLines.map((m, i) => <span key={i}>{m}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* footer meta strip (when punch occupies the grid cell) */}
        {p.showMeta && p.showPunch && (
          <div className="rd-mono rd-anim rd-anim-4" style={{ display: "flex", gap: 40, fontSize: 24, marginTop: 18 }}>
            {metaStrip.map((m, i) => (
              <span key={i} style={i === metaStrip.length - 1 ? { marginLeft: "auto" } : undefined}>{m}</span>
            ))}
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={200} rotate={5} pos={{ right: 470, bottom: 150 }} />
    </div>
  );
}
