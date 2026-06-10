import React from "react";
import { COLORS, FONTS, isRDDark } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   LayerTableSlide — 表格页 · AI 产业链分层速查表 (data: 报告第四章 产业链分层 +
   3.1 层额 + 结论三). 把上游—中游—下游的细分环节、代表公司、层资金量级与确定性
   定性收拢成一张可查阅的分层表，作为图表型产业链页（树图 / 桑基 / 矩阵）的索引。
   Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "showCompanies", label: "代表公司", type: "toggle", default: true,
    help: "各环节代表公司标签显示 / 隐藏" },
  { key: "showAmount", label: "层资金量级", type: "toggle", default: true,
    help: "各层级融资额（亿美元）显示 / 隐藏" },
  { key: "showCertainty", label: "确定性标记", type: "toggle", default: true,
    help: "各层级确定性 / 竞争定性标记显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它层级以突出某一层" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被突出的层级序号（0 上游 · 1 中游 · 2 下游）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部分层小结显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  showCompanies: true,
  showAmount: true,
  showCertainty: true,
  focusEnabled: false,
  focusIndex: 0,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "结构透视 / VALUE CHAIN",
  kicker: "上游 → 中游 → 下游 · 分层速查",
  title: "AI 产业链分层速查表",
  titleNote: "环节 · 代表公司 · 层资金量级 · 确定性",
  header1: "层级 / 资金量级",
  header2: "细分环节 · 代表公司",
  calloutLabel: "↳ 结构看分层",
  calloutSegments: [
    { t: "上游基础设施" },
    { t: "确定性最强", b: true },
    { t: "，中游模型层" },
    { t: "竞争最激烈", b: true },
    { t: "，下游应用层" },
    { t: "潜力最大但尚需时间验证", b: true },
    { t: "——\"卖铲子\" 环节最稳，模型层最卷，应用层赔率最高。" },
  ],
  layers: [
    {
      cn: "上游 · 基础设施", en: "UPSTREAM", amt: 255, tag: "确定性最强",
      rows: [
        { seg: "AI 芯片", cos: ["Cerebras", "Groq"] },
        { seg: "算力云 / 数据", cos: ["CoreWeave", "Scale AI"] },
      ],
    },
    {
      cn: "中游 · 模型层", en: "MIDSTREAM", amt: 420, tag: "竞争最激烈",
      rows: [
        { seg: "通用大模型", cos: ["OpenAI", "Anthropic", "xAI"] },
        { seg: "开源 / 专用模型", cos: ["Mistral", "SSI"] },
      ],
    },
    {
      cn: "下游 · 应用层", en: "DOWNSTREAM", amt: 295, tag: "潜力最大 · 待验证",
      rows: [
        { seg: "企业生产力", cos: ["Glean", "Databricks"] },
        { seg: "消费 / 搜索", cos: ["Perplexity AI"] },
        { seg: "具身智能 / 机器人", cos: ["Figure AI"] },
      ],
    },
  ],
  copy: {
    t001: "亿",
  },
  ...decorDefaults,
};

export default function LayerTableSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const LAYERS = p.layers || [];
  const dark = p.theme === "dark";
  const fi = Math.min(Math.max(0, p.focusIndex), LAYERS.length - 1);

  // layer accent colors (mirror TableSlide's layer badges)
  const dk = isRDDark();
  const TINT = [
    dark ? "rgba(110,133,255,0.15)" : "rgba(39,66,236,0.10)",   // 上游 blue
    dark ? "rgba(243,242,238,0.07)" : "rgba(22,21,19,0.055)",   // 中游 ink
    dark ? "rgba(194,245,61,0.14)"  : "rgba(194,245,61,0.30)",  // 下游 lime
  ];
  const RAIL = [COLORS.blue, COLORS.ink, dark ? COLORS.lime : "#9bcc17"];

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.titleNote}</span>
        </div>

        {/* column header */}
        <div className="rd-anim rd-anim-2" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, marginTop: 22, padding: "0 0 11px", borderBottom: `2px solid ${COLORS.ink}` }}>
          <span className="rd-mono" style={{ fontSize: 20, color: COLORS.ink3 }}>{p.header1}</span>
          <span className="rd-mono" style={{ fontSize: 20, color: COLORS.ink3, paddingLeft: 32 }}>{p.header2}</span>
        </div>

        {/* layers */}
        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {LAYERS.map((L, li) => {
            const hot = p.focusEnabled && li === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={li} style={{
                flex: 1, display: "grid", gridTemplateColumns: "320px 1fr", gap: 0,
                borderBottom: li < LAYERS.length - 1 ? `1px solid ${COLORS.line2}` : "none",
                opacity: dim ? 0.5 : 1,
                background: hot ? TINT[li] : "transparent",
              }}>
                {/* layer cell */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "0 28px 0 22px", borderLeft: `5px solid ${RAIL[li]}`, position: "relative" }}>
                  <div>
                    <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 32, color: COLORS.ink, lineHeight: 1.05 }}>{L.cn}</div>
                    <div className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3, marginTop: 3 }}>{L.en}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                    {p.showAmount && (
                      <span style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                        <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 40, color: RAIL[li], fontFeatureSettings: '"tnum" 1' }}>{L.amt}</span>
                        <span className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3 }}>{copy.t001}</span>
                      </span>
                    )}
                    {p.showCertainty && (
                      <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", padding: "5px 11px", color: COLORS.ink, border: `1.5px solid ${RAIL[li]}`, whiteSpace: "nowrap" }}>{L.tag}</span>
                    )}
                  </div>
                </div>

                {/* segment rows */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 32, gap: 4 }}>
                  {L.rows.map((r, ri) => (
                    <div key={ri} style={{ display: "flex", alignItems: "center", gap: 22, padding: "8px 0", borderTop: ri > 0 ? `1px solid ${COLORS.line2}` : "none" }}>
                      <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 24, color: COLORS.ink, width: 240, flex: "none" }}>{r.seg}</span>
                      {p.showCompanies && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                          {r.cos.map((c, ci) => (
                            <span key={ci} style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 20, color: COLORS.ink2, border: `1px solid ${COLORS.line}`, padding: "5px 13px", whiteSpace: "nowrap" }}>{c}</span>
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

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: COLORS.blue, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {(p.calloutSegments || []).map((s, i) => (
                s.b
                  ? <strong key={i} style={{ color: COLORS.ink, fontWeight: 700 }}>{s.t}</strong>
                  : <React.Fragment key={i}>{s.t}</React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={6} pos={{ right: 52, top: 120 }} />
    </div>
  );
}
