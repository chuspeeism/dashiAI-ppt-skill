import React from "react";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   CoverBandSlide — 封面 · 横向编辑式版式 (editorial horizontal bands).
   构图：顶栏微标签 → 满幅超大标题（自上而下阅读）→ 底部一条大数字数据带。
   纯展示组件，所有可变项经 props：controls 暴露页面开关，defaultProps 暴露
   全部可见文案与数据默认值，便于整组替换并迁移。
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签的显示 / 隐藏" },
  { key: "theme", label: "背景主题", type: "select", default: "light",
    options: [{ value: "dark", label: "深色" }, { value: "light", label: "浅色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "标题高亮词与数据强调使用的强调色" },
  { key: "statCount", label: "数据条目", type: "slider", default: 3, min: 0, max: 4, step: 1,
    help: "底部数据带的统计条目数量，0 为纯标题封面" },
  { key: "showMeta", label: "页脚信息", type: "toggle", default: true,
    help: "底部数据口径说明的显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  theme: "light",
  accent: "blue",
  statCount: 3,
  showMeta: true,
  // —— visible content (override per deck) ——
  eyebrow: "行业研究报告 · 年度",
  kicker: "SMART HARDWARE // CHINA 2026",
  titleA: "2026 中国",
  titleAccent: "智能硬件",
  titleB: " 产业",
  titleC: "增长报告",
  sub: "供应链、终端体验与生态格局的全景扫描 —— 一份关于「谁在增长、增长从何而来」的结构化研究。",
  stats: [
    { v: "4820", u: "亿元", k: "市场规模 / 2026E" },
    { v: "+38", u: "%", k: "整体同比增速" },
    { v: "97", u: "家", k: "头部厂商样本" },
    { v: "12", u: "类", k: "覆盖核心品类" },
  ],
  meta: ["编制 · 2026.06", "口径 · 公开市场数据 + 厂商调研", "样本 · 2,400+", "仅供研究参考"],
  ...decorDefaults,
};

export default function CoverBandSlide(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent === "lime" ? "var(--rd-lime)" : "var(--rd-blue)";
  const onLime = p.accent === "lime";
  const allStats = p.stats || [];
  const stats = allStats.slice(0, Math.max(0, Math.min(allStats.length, p.statCount)));
  const meta = p.meta || [];

  return (
    <div className={`rd-slide${p.theme === "dark" ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        {/* top bar */}
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className={`rd-tag rd-anim ${onLime ? "rd-tag--lime" : ""}`}>{p.eyebrow}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        {/* giant masthead title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0, paddingBottom: 40 }}>
          <h1 className="rd-display rd-anim rd-anim-2"
            style={{ fontSize: 152, lineHeight: 0.99, letterSpacing: "-0.03em" }}>
            <span>{p.titleA}</span>
            <br />
            <span style={{ color: accent }}>{p.titleAccent}</span>
            <span>{p.titleB}</span>
            <br />
            <span>{p.titleC}</span>
          </h1>
          <p className="rd-sub rd-anim rd-anim-3"
            style={{ marginTop: 30, maxWidth: 1180, fontSize: 31, fontWeight: 500, color: "var(--rd-ink-2)" }}>
            {p.sub}
          </p>
        </div>

        {/* bottom data band */}
        {stats.length > 0 && (
          <div className="rd-anim rd-anim-4" style={{ marginBottom: p.showMeta ? 26 : 0 }}>
            <div className="rd-hairline" style={{ marginBottom: 30 }} />
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  flex: 1, paddingRight: 40, marginRight: 40,
                  borderRight: i < stats.length - 1 ? "1px solid var(--rd-line)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ fontFamily: "var(--rd-mono)", fontWeight: 700, fontSize: 84,
                      lineHeight: 0.82, letterSpacing: "-0.02em",
                      color: i === 0 ? accent : "var(--rd-ink)" }}>{s.v}</span>
                    <span className="rd-headline" style={{ fontSize: 30, marginBottom: 8 }}>{s.u}</span>
                  </div>
                  <p className="rd-mono" style={{ marginTop: 14, fontSize: 24 }}>{s.k}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* footer meta */}
        {p.showMeta && meta.length > 0 && (
          <div className="rd-mono" style={{ display: "flex", gap: 44, fontSize: 24, paddingTop: stats.length ? 0 : 24,
            borderTop: stats.length ? "none" : "1px solid var(--rd-line)" }}>
            {meta.map((m, i) => (
              <span key={i} style={i === meta.length - 1 ? { marginLeft: "auto" } : undefined}>{m}</span>
            ))}
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={280} rotate={6} pos={{ right: 92, top: 150 }} />
    </div>
  );
}
