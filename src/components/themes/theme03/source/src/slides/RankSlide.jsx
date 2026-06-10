import React from "react";
import { COLORS, RAMP } from "../theme.js";
import { Hero3D, decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RankSlide — top players by largest single round (横向透视 · 头部集中).
   Horizontal ranking with an interleaved 3D hero in the headline.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "条目数量", type: "slider", default: 8, min: 5, max: 10, step: 1,
    help: "排名展示的公司数量（Top N）" },
  { key: "chartType", label: "图表类型", type: "select", default: "bar",
    options: [{ value: "bar", label: "条形" }, { value: "lollipop", label: "棒棒糖" }],
    help: "排名条的呈现方式" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一名公司" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 9, step: 1,
    help: "被高亮的名次（从 0 起）" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部集中度解读文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 8,
  chartType: "bar",
  focusEnabled: true,
  focusIndex: 0,
  showCallout: true,
  // —— visible content (override per deck) ——
  eyebrow: "横向透视 / 04",
  kicker: "单笔最大融资 · 单位：亿美元",
  title: "头部玩家融资排名",
  subtitle: "2024 年单笔融资额最大的头部公司 · 赢家通吃格局",
  calloutLabel: "↳ 集中度",
  calloutBody: "「D 轮及以后」与「未标明轮次」融资占比过半，平均单笔超 15 亿美元——少数独角兽反复获得巨额追加投资，市场集中度极高。",
  data: [
    { name: "OpenAI", amt: 66, sector: "通用大模型" },
    { name: "Anthropic", amt: 65, sector: "通用大模型" },
    { name: "xAI", amt: 50, sector: "通用大模型" },
    { name: "CoreWeave", amt: 11, sector: "AI 基础设施" },
    { name: "Safe Superintelligence", amt: 10, sector: "通用大模型" },
    { name: "Scale AI", amt: 10, sector: "AI 基础设施" },
    { name: "Figure AI", amt: 6.8, sector: "AI 硬件" },
    { name: "Perplexity AI", amt: 5.2, sector: "垂直应用" },
    { name: "Databricks", amt: 5.0, sector: "AI 基础设施" },
    { name: "Glean", amt: 2.6, sector: "垂直应用" },
  ],
  ...decorDefaults,
};

export default function RankSlide(props) {
  const p = { ...defaultProps, ...props };
  const DATA = p.data || [];
  const accent = COLORS.blue;
  const n = Math.max(5, Math.min(10, p.itemCount));
  const rows = DATA.slice(0, n);
  const focusIndex = Math.min(p.focusIndex, n - 1);
  const max = DATA.length ? Math.max(...DATA.map((d) => d.amt)) : 1;

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 30 }}>
          <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 1080 }}>{p.title}</h2>
          <p className="rd-cap rd-anim rd-anim-2" style={{ marginTop: 12 }}>{p.subtitle}</p>
          <Hero3D show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={300} rotate={6}
            pos={{ right: 150, top: 4 }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0, marginTop: 8 }}>
          {rows.map((d, i) => {
            const hot = p.focusEnabled && i === focusIndex;
            const w = (d.amt / max) * 100;
            return (
              <div key={d.name} className="rd-anim rd-anim-3" style={{
                display: "flex", alignItems: "center", gap: 24,
                padding: "13px 0", borderBottom: `1px solid ${COLORS.line2}`,
                opacity: p.focusEnabled && !hot ? 0.55 : 1,
              }}>
                <span style={{ width: 56, fontFamily: '"Space Mono",monospace', fontSize: 28, color: hot ? accent : COLORS.ink3 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ width: 300, fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 28, color: hot ? accent : COLORS.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {d.name}
                </span>
                <span className="rd-mono" style={{ width: 180, fontSize: 22, color: COLORS.ink3 }}>{d.sector}</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", height: 26 }}>
                  {p.chartType === "bar" ? (
                    <div style={{ width: `${w}%`, height: 22, background: hot ? accent : RAMP[Math.min(i, RAMP.length - 1)] }} />
                  ) : (
                    <div style={{ width: `${w}%`, height: 22, position: "relative", display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1, height: 3, background: hot ? accent : "rgba(22,21,19,0.18)" }} />
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: hot ? accent : COLORS.ink, flex: "none" }} />
                    </div>
                  )}
                </div>
                <span style={{ width: 92, textAlign: "right", fontFamily: '"Archivo",sans-serif', fontWeight: 800, fontSize: 30, color: hot ? accent : COLORS.ink }}>{d.amt}</span>
              </div>
            );
          })}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ marginTop: 18, paddingTop: 18, borderTop: `2px solid ${COLORS.blue}`, display: "flex", gap: 18, alignItems: "baseline" }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
            <p className="rd-cap" style={{ maxWidth: 1500 }}>
              {p.calloutBody}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
