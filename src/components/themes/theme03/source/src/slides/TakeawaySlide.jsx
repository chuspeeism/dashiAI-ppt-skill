import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   TakeawaySlide — 三条核心结论 (numbered insight columns).
   Each column = oversized index + axis tag + a single keyword headline + body.
   Count / index / focus / accent / meta are props. Pure presentational; the
   copy is static. Sets up the closing QuoteSlide.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "结论数量", type: "slider", default: 3, min: 1, max: 3, step: 1,
    help: "展示的核心结论数量" },
  { key: "showIndex", label: "巨型序号", type: "toggle", default: true,
    help: "每列的巨型描边序号显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它结论以突出某一条" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被突出的结论序号（自动随结论数量收敛）" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "关键词使用的强调色" },
  { key: "showMeta", label: "底部口径", type: "toggle", default: true,
    help: "底部数据口径 / 出处显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 3,
  showIndex: true,
  focusEnabled: false,
  focusIndex: 0,
  accent: "blue",
  showMeta: true,
  copy: {
    t001: "结论 / TAKEAWAYS",
    t002: "横纵分析 · 三条核心结论",
    t003: "一张图读懂",
    t004: "这一年",
    t005: "《2024 美国大额融资 AI 公司调研报告》· 第七章 结论",
    t006: "从「赌叙事」转向「看兑现」",
  },
  takeaways: [
  { idx: "01", axis: "横向 · 空间", key: "集中", title: "横向看集中",
    desc: "资金高度向头部公司、通用大模型赛道、旧金山湾区集中，「赢家通吃」格局确立。" },
  { idx: "02", axis: "纵向 · 时间", key: "节奏", title: "纵向看节奏",
    desc: "全年融资「前高后稳」，Q2–Q3 达峰后理性回落，市场从狂热转向分化。" },
  { idx: "03", axis: "交叉 · 分层", key: "分层", title: "结构看分层",
    desc: "上游基础设施确定性最强，中游模型层竞争最激烈，下游应用层潜力最大但尚需时间验证。" },
  ],
  ...decorDefaults,
};



export default function TakeawaySlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const count = Math.max(1, Math.min(p.takeaways.length, p.itemCount));
  const items = p.takeaways.slice(0, count);
  const fi = Math.min(p.focusIndex, count - 1);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 28, paddingBottom: 14 }}>
          <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 1200 }}>{copy.t003}<span style={{ color: accentInk }}>{copy.t004}</span>
          </h2>
          <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={186} rotate={8} pos={{ right: 100, top: -30 }} />
        </div>

        <div style={{ flex: 1, display: "flex", gap: 0, minHeight: 0 }}>
          {items.map((t, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={t.idx} className={`rd-anim rd-anim-${Math.min(4, i + 2)}`} style={{
                flex: 1, display: "flex", flexDirection: "column", minWidth: 0,
                padding: "30px 44px 8px",
                borderLeft: i === 0 ? "none" : `1px solid ${COLORS.line2}`,
                opacity: dim ? 0.4 : 1, transition: "opacity .3s",
              }}>
                {p.showIndex && (
                  <span style={{
                    fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 92, lineHeight: 0.9,
                    letterSpacing: "-0.02em",
                    WebkitTextStroke: hot ? `2px ${accentInk}` : `2px ${COLORS.line}`,
                    color: "transparent", fontFeatureSettings: '"tnum" 1',
                  }}>{t.idx}</span>
                )}
                <div className="rd-mono" style={{ fontSize: 22, marginTop: 18, color: hot ? accentInk : COLORS.ink3 }}>{t.axis}</div>
                <div style={{
                  fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 100, lineHeight: 0.96,
                  letterSpacing: "-0.02em", marginTop: 8, color: hot ? accentInk : COLORS.ink,
                }}>{t.key}</div>
                <h3 className="rd-sub" style={{ fontSize: 30, marginTop: 18, color: COLORS.ink }}>{t.title}</h3>
                <p className="rd-cap" style={{ marginTop: 14, maxWidth: 440 }}>{t.desc}</p>
                <span style={{ marginTop: "auto", height: 4, background: hot ? accent : COLORS.ink, width: hot ? 88 : 56 }} />
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <div className="rd-anim rd-anim-4">
            <div className="rd-hairline" style={{ marginBottom: 16 }} />
            <div className="rd-mono" style={{ display: "flex", gap: 48, fontSize: 22 }}>
              <span>{copy.t005}</span>
              <span style={{ marginLeft: "auto", color: accentInk }}>{copy.t006}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
