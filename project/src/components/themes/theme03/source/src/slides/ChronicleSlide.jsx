import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   ChronicleSlide — 时间轴 · 2024 大额融资事件编年 (data: 报告 2.1/2.2 月度走势 +
   5.1 Anthropic 三轮 + 5.2 xAI). A horizontal milestone rail: marquee moments of
   the capital year, cards alternating above / below the spine, each anchored to
   a verbatim monthly / round metric. Pure / portable — node count, connectors,
   metric and focus are props; static copy lives in the component.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "节点数量", type: "slider", default: 6, min: 3, max: 6, step: 1,
    help: "展示的编年节点数量" },
  { key: "showConnector", label: "连接轨道", type: "toggle", default: true,
    help: "时间轴主轨与节点引线显示 / 隐藏" },
  { key: "showMetric", label: "关键数字", type: "toggle", default: true,
    help: "各节点的关键数字显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "弱化其它节点以突出某一个" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 3, min: 0, max: 5, step: 1,
    help: "被突出的节点序号（自动随节点数量收敛）" },
  { key: "showMeta", label: "底部口径", type: "toggle", default: true,
    help: "底部数据口径 / 提示显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 6,
  showConnector: true,
  showMetric: true,
  focusEnabled: true,
  focusIndex: 3,
  showMeta: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "市场全景 / CHRONICLE",
  kicker: "2024 · 资本年度编年",
  title: "大额融资 · 年度编年",
  titleNote: "前高后稳 · 双峰节奏 · 头部反超",
  metaLabel: "↳ 节奏",
  metaPre: "Q2–Q3 达峰后理性回落，",
  metaStrong: "5 月、8 月两度冲高",
  metaPost: "，11 月 Anthropic 估值反超、xAI 入局——全年呈“前高后稳”，市场从狂热走向分化。",
  events: [
    { time: "01–03 月", title: "资本大年开局", tag: "市场起步", val: "162", unit: "亿 · 18 笔" },
    { time: "5 月", title: "Anthropic Series G", tag: "估值 600 亿", val: "105", unit: "亿 · 单月" },
    { time: "8 月", title: "头部集中关账", tag: "全年最高月", val: "118", unit: "亿 · 单月" },
    { time: "11 月", title: "Anthropic 反超 · xAI 入局", tag: "估值 9650 / 500 亿", val: "50", unit: "亿 · xAI" },
    { time: "12 月", title: "狂热转向分化", tag: "理性回落", val: "52", unit: "亿 · 单月" },
    { time: "全年", title: "创历史新高", tag: "占全美风投近 1/3", val: "970", unit: "亿 · 97 笔" },
  ],
  ...decorDefaults,
};

export default function ChronicleSlide(props) {
  const p = { ...defaultProps, ...props };
  const EVENTS = p.events || [];
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const n = Math.max(3, Math.min(EVENTS.length, p.itemCount));
  const events = EVENTS.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  const Card = ({ e, hot, dim }) => (
    <div style={{
      width: "100%", maxWidth: 240,
      borderLeft: `3px solid ${hot ? accent : COLORS.line}`,
      paddingLeft: 16, opacity: dim ? 0.5 : 1,
    }}>
      <div className="rd-mono" style={{ fontSize: 17, color: hot ? accent : axisCol, marginBottom: 8 }}>{e.time}</div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 23, lineHeight: 1.18, color: COLORS.ink, letterSpacing: "-0.01em" }}>{e.title}</div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 17, color: COLORS.ink2, marginTop: 6 }}>{e.tag}</div>
      {p.showMetric && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 12 }}>
          <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 46, lineHeight: 0.9, letterSpacing: "-0.02em", color: hot ? accent : COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{e.val}</span>
          <span className="rd-mono" style={{ fontSize: 15, color: axisCol, textTransform: "none", letterSpacing: 0 }}>{e.unit}</span>
        </div>
      )}
    </div>
  );

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

        {/* rail */}
        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 18, position: "relative", display: "flex" }}>
          {events.map((e, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            const above = i % 2 === 0;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {/* top zone */}
                <div style={{ height: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", paddingBottom: 26, width: "100%" }}>
                  {above && <Card e={e} hot={hot} dim={dim} />}
                </div>
                {/* spine + marker */}
                <div style={{ height: 0, position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2 }}>
                  {/* marker — opaque fills + solid ring + zIndex above both lines,
                      so the spine / connector never show through the diamond */}
                  <span style={{
                    width: hot ? 22 : 16, height: hot ? 22 : 16, transform: "rotate(45deg)",
                    position: "relative", zIndex: 3,
                    background: hot ? accent
                      : dim ? `color-mix(in srgb, ${dark ? "#cfcdc7" : COLORS.ink} 55%, var(--rd-bg))`
                      : (dark ? "#cfcdc7" : COLORS.ink),
                    boxShadow: hot ? `0 0 0 6px color-mix(in srgb, ${accent} ${dark ? "18%" : "12%"}, var(--rd-bg))` : "none",
                  }} />
                  {p.showConnector && (
                    <span style={{
                      position: "absolute", left: "50%", width: 1.5,
                      [above ? "bottom" : "top"]: "50%", height: 26,
                      background: hot ? accent : COLORS.line, opacity: dim ? 0.5 : 1,
                    }} />
                  )}
                </div>
                {/* bottom zone */}
                <div style={{ height: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: 26, width: "100%" }}>
                  {!above && <Card e={e} hot={hot} dim={dim} />}
                </div>
              </div>
            );
          })}
          {/* horizontal spine */}
          {p.showConnector && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: COLORS.line, zIndex: 1 }} />
          )}
        </div>

        {p.showMeta && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.metaLabel}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
              {p.metaPre}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{p.metaStrong}</strong>{p.metaPost}
            </p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={116} rotate={-7} pos={{ right: 44, top: 100 }} />
    </div>
  );
}
