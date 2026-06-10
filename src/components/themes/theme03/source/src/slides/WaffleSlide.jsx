import React from "react";
import { COLORS, RAMP, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   WaffleSlide — 图表页 · 97 笔大额融资 · 轮次单位图 (unit / waffle chart).
   每个方格 = 1 笔单笔 ≥1 亿美元事件，按轮次连续铺排着色——直观呈现报告 3.2
   "D 轮及以后 + 未标明轮次" 占比过半、少数后期轮吞下大额资金的结构。
   数据 verbatim 报告 3.2（事件笔数 / 平均单笔）。Pure / portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "columns", label: "每行格数", type: "slider", default: 14, min: 10, max: 16, step: 1,
    help: "单位图每行的方格数量（影响排布密度）" },
  { key: "showLegend", label: "轮次图例", type: "toggle", default: true,
    help: "右侧各轮次明细（笔数 / 平均单笔）显示 / 隐藏" },
  { key: "showAvg", label: "平均单笔", type: "toggle", default: true,
    help: "图例中各轮平均单笔金额显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一轮次（其余格子弱化）" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 4, min: 0, max: 5, step: 1,
    help: "被高亮的轮次序号（0 = 种子轮）" },
  { key: "showCallout", label: "核心发现", type: "toggle", default: true,
    help: "底部结构解读显示 / 隐藏" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  columns: 14,
  showLegend: true,
  showAvg: true,
  focusEnabled: true,
  focusIndex: 4,
  showCallout: true,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "轮次结构 / ROUND MIX",
  kicker: "1 格 = 1 笔 · 97 笔大额融资（≥1 亿美元）",
  title: "97 笔大额融资 · 轮次构成",
  titleNote: "后期轮少笔数、却吞下大额资金",
  footerHint: "▮ 按轮次连续铺排 · 颜色由浅到深 = 轮次由早到晚",
  calloutLabel: "↳ 核心发现",
  calloutSegments: [
    { t: "\"D 轮及以后\" 与 \"未标明轮次\" 合计 " },
    { t: "44 笔", b: true },
    { t: "、占全部 97 笔的近一半，平均单笔却高达 " },
    { t: "15–19 亿美元", b: true },
    { t: "——少数头部独角兽反复获得巨额追加投资，\"赢家通吃\" 在轮次层面同样成立。" },
  ],
  rounds: [
    { cn: "种子轮", en: "SEED", n: 8, avg: 1.2 },
    { cn: "A 轮", en: "SERIES A", n: 12, avg: 1.8 },
    { cn: "B 轮", en: "SERIES B", n: 18, avg: 3.5 },
    { cn: "C 轮", en: "SERIES C", n: 15, avg: 6.8 },
    { cn: "D 轮及以后", en: "SERIES D+", n: 22, avg: 15.2 },
    { cn: "未标明轮次", en: "UNDISCLOSED", n: 22, avg: 18.6 },
  ],
  total: 97,
  copy: {
    t001: "笔",
    t002: "均",
    t003: "亿",
  },
  ...decorDefaults,
};

export default function WaffleSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const ROUNDS = p.rounds || [];
  const TOTAL = p.total;
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const fi = Math.min(Math.max(0, p.focusIndex), ROUNDS.length - 1);

  // 6-step neutral ramp (RAMP is 5) — late rounds read heavier.
  const SHADES = dark
    ? ["#46443f", "#605e59", "#84827c", "#a9a7a1", "#cdcbc5", "#ece9e2"]
    : ["#c4c2bc", "#a9a7a1", "#84827c", "#605e59", "#403f3b", "#1f1e1b"];

  // build 97 cells, contiguous by round
  const cells = [];
  ROUNDS.forEach((r, ri) => { for (let k = 0; k < r.n; k++) cells.push(ri); });

  const cols = p.columns;
  const focusN = p.focusEnabled ? ROUNDS[fi].n : 0;

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

        <div style={{ flex: 1, display: "flex", gap: 64, marginTop: 26, minHeight: 0 }}>
          {/* waffle grid */}
          <div className="rd-anim rd-anim-3" style={{ flex: "1 1 58%", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "clamp(6px, 0.7vw, 10px)",
              width: "100%", maxWidth: 56 * cols,
            }}>
              {cells.map((ri, i) => {
                const hot = p.focusEnabled && ri === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} style={{
                    aspectRatio: "1 / 1",
                    background: hot ? accent : SHADES[ri],
                    opacity: dim ? 0.34 : 1,
                    boxShadow: hot ? `inset 0 0 0 2px ${dark ? "#0d1330" : "#0d1330"}` : "none",
                  }} />
                );
              })}
              {/* trailing empty cells to keep grid rows full visually */}
              {Array.from({ length: (cols - (TOTAL % cols)) % cols }).map((_, i) => (
                <div key={`e${i}`} style={{ aspectRatio: "1 / 1", border: `1px dashed ${COLORS.line2}` }} />
              ))}
            </div>
            <div className="rd-mono" style={{ marginTop: 18, fontSize: 18, color: COLORS.ink3 }}>
              {p.focusEnabled ? `▮ 高亮 ${ROUNDS[fi].cn} · ${focusN} 笔 · 占 ${(focusN / TOTAL * 100).toFixed(0)}%` : p.footerHint}
            </div>
          </div>

          {/* legend */}
          {p.showLegend && (
            <div className="rd-anim rd-anim-3" style={{ flex: "1 1 42%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0, borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 48, minWidth: 0 }}>
              {ROUNDS.map((r, ri) => {
                const hot = p.focusEnabled && ri === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={ri} style={{
                    display: "grid", gridTemplateColumns: "26px 1fr auto", alignItems: "center", gap: 16,
                    padding: "14px 0", borderBottom: ri < ROUNDS.length - 1 ? `1px solid ${COLORS.line2}` : "none",
                    opacity: dim ? 0.5 : 1,
                  }}>
                    <span style={{ width: 26, height: 26, background: hot ? accent : SHADES[ri], flex: "none" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: FONTS.sans, fontWeight: hot ? 800 : 700, fontSize: 26, color: hot ? accent : COLORS.ink, lineHeight: 1.1 }}>{r.cn}</div>
                      <div className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3 }}>{r.en}</div>
                    </div>
                    <div style={{ textAlign: "right", flex: "none" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 5, justifyContent: "flex-end" }}>
                        <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 30, color: hot ? accent : COLORS.ink, fontFeatureSettings: '"tnum" 1' }}>{r.n}</span>
                        <span className="rd-mono" style={{ fontSize: 15, color: COLORS.ink3 }}>{copy.t001}</span>
                      </div>
                      {p.showAvg && (
                        <div className="rd-mono" style={{ fontSize: 16, color: COLORS.ink2 }}>{copy.t002}{r.avg}{copy.t003}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.calloutLabel}</span>
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
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={120} rotate={8} pos={{ right: 48, top: 116 }} />
    </div>
  );
}
