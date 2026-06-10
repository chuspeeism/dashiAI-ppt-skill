import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   AarrrSlide — AARRR「海盗指标」增长漏斗模型.
   Left-right split: a narrowing pirate-funnel (Acquisition → Activation →
   Retention → Revenue → Referral) on the left, per-stage strategy read-out on
   the right, with conversion rates and an analysis line. Pure & portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "stageCount", label: "阶段数量", type: "slider", default: 5, min: 3, max: 5, step: 1,
    help: "展示的漏斗阶段数量（A→A→R→R→R）" },
  { key: "showMetric", label: "指标数值", type: "toggle", default: true,
    help: "各阶段样例指标数值显示 / 隐藏" },
  { key: "showRate", label: "转化率", type: "toggle", default: true,
    help: "阶段之间的转化率显示 / 隐藏" },
  { key: "showStrategy", label: "策略解读", type: "toggle", default: true,
    help: "右侧各环节优化策略文字显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个阶段" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 4, step: 1,
    help: "被高亮的阶段序号（从 0 起，自动随阶段数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  stageCount: 5,
  showMetric: true,
  showRate: true,
  showStrategy: true,
  focusEnabled: false,
  focusIndex: 2,
  theme: "light",
  // —— visible content (override per deck) ——
  eyebrow: "增长模型 / AARRR",
  kicker: "海盗指标 · 用户增长漏斗",
  title: "AARRR 增长漏斗",
  subtitle: "Acquisition · Activation · Retention · Revenue · Referral",
  panelTitle: "各环节策略解读 / PLAYBOOK",
  ratePrefix: "↘ 转化",
  annotationLabel: "↳ 解读",
  annotationBody: "漏斗最大流失常出现在「激活 → 留存」环节，应作为优化第一优先级；获客成本高企时优先提升激活率，而非盲目扩大触达。Referral 自传播是摊薄 CAC 的关键杠杆。",
  stages: [
    { L: "A", cn: "获取用户", en: "ACQUISITION", value: "120,000", kpi: "渠道触达", rate: null,
      note: "按渠道 ROI 分配预算，关注获客成本 CAC 而非曝光量。" },
    { L: "A", cn: "激活用户", en: "ACTIVATION", value: "38,400", kpi: "完成关键行为", rate: "32%",
      note: "缩短首次价值时间（TTV），优化新手引导转化。" },
    { L: "R", cn: "提高留存", en: "RETENTION", value: "16,100", kpi: "次周回访", rate: "42%",
      note: "建立使用习惯与回访触点——留存是增长的地基。" },
    { L: "R", cn: "获取收入", en: "REVENUE", value: "5,280", kpi: "付费转化", rate: "33%",
      note: "设计清晰付费动机与定价阶梯，提升付费率。" },
    { L: "R", cn: "用户推荐", en: "REFERRAL", value: "1,460", kpi: "推荐带新", rate: "28%",
      note: "产品内置分享激励，用口碑摊薄获客成本。" },
  ],
  ...decorDefaults,
};

export default function AarrrSlide(props) {
  const p = { ...defaultProps, ...props };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const count = Math.max(3, Math.min(p.stages.length, p.stageCount));
  const stages = p.stages.slice(0, count);
  const fi = Math.min(p.focusIndex, count - 1);

  const W_TOP = 760, W_BOT = 430;
  const widthAt = (i) => W_TOP - ((W_TOP - W_BOT) * i) / count;

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{p.eyebrow}</span> : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 30 }}>
          <h2 className="rd-title">{p.title}</h2>
          <span className="rd-cap">{p.subtitle}</span>
        </div>

        {/* left funnel + right strategy — capped height, vertically centered for air */}
        <div style={{ flex: 1, display: "flex", gap: 56, minHeight: 0, alignItems: "center" }}>
          {/* funnel */}
          <div style={{ flex: "none", width: 800, height: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {stages.map((s, i) => {
              const topW = widthAt(i), botW = widthAt(i + 1);
              const insetPct = ((topW - botW) / 2 / topW) * 100;
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const bandBg = hot ? accent : (dark ? "#23221e" : COLORS.panel);
              return (
                <div key={i} className={`rd-anim rd-anim-${Math.min(i + 2, 4)}`} style={{
                  width: topW, flex: 1, minHeight: 0, position: "relative",
                  clipPath: `polygon(0 0, 100% 0, ${100 - insetPct}% 100%, ${insetPct}% 100%)`,
                  background: bandBg, opacity: dim ? 0.42 : 1, transition: "opacity .3s, background .3s",
                  display: "flex", alignItems: "center", padding: `0 ${48 + insetPct * 1.5}px`,
                }}>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 52, lineHeight: 1,
                    color: hot ? "#fff" : COLORS.lime, width: 52, flex: "none", letterSpacing: "-0.02em" }}>{s.L}</span>
                  <div style={{ marginLeft: 14, flex: 1 }}>
                    <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 30, color: "#f7f6f2", lineHeight: 1 }}>{s.cn}</div>
                    <div className="rd-mono" style={{ fontSize: 16, marginTop: 4, color: "rgba(243,242,238,0.6)" }}>{s.en}</div>
                  </div>
                  {p.showMetric && (
                    <div style={{ textAlign: "right", flex: "none" }}>
                      <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 32, color: "#fff", lineHeight: 1, fontFeatureSettings: '"tnum" 1' }}>{s.value}</div>
                      <div className="rd-mono" style={{ fontSize: 15, marginTop: 4, color: "rgba(243,242,238,0.55)" }}>{s.kpi}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* strategy read-out */}
          <div style={{ flex: 1, height: 520, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div className="rd-mono" style={{ fontSize: 19, color: COLORS.ink3, marginBottom: 4 }}>{p.panelTitle}</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {stages.map((s, i) => {
                const hot = p.focusEnabled && i === fi;
                const dim = p.focusEnabled && !hot;
                return (
                  <div key={i} className={`rd-anim rd-anim-${Math.min(i + 2, 4)}`} style={{
                    flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                    padding: "10px 0", borderBottom: i < count - 1 ? `1px solid ${COLORS.line2}` : "none",
                    opacity: dim ? 0.45 : 1, transition: "opacity .3s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 9, height: 9, flex: "none", background: hot ? accent : COLORS.ink }} />
                      <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 26, color: hot ? accent : COLORS.ink }}>{s.cn}</span>
                      {p.showRate && s.rate && (
                        <span style={{ fontFamily: "var(--rd-mono)", fontSize: 16, fontWeight: 700, color: hot ? "#fff" : COLORS.ink2,
                          background: hot ? accent : "rgba(22,21,19,0.07)", padding: "3px 9px" }}>{p.ratePrefix} {s.rate}</span>
                      )}
                    </div>
                    {p.showStrategy && <p className="rd-cap" style={{ margin: "6px 0 0 21px", fontSize: 20 }}>{s.note}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, paddingTop: 22, marginTop: 4, borderTop: `1px solid ${COLORS.line}` }}>
          <span className="rd-mono" style={{ color: accent, flex: "none" }}>{p.annotationLabel}</span>
          <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>
            {p.annotationBody}
          </p>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={130} rotate={6} pos={{ right: 54, top: 120 }} />
    </div>
  );
}
