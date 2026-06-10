import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   OutlookSlide — 投资建议 (opportunities vs cautions, dual column).
   Two contrasting lists; either side can be emphasised. Item count adjustable.
   Pure presentational, props-driven; text is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "条目数量", type: "slider", default: 3, min: 1, max: 3, step: 1,
    help: "每栏展示的条目数量" },
  { key: "focusSide", label: "突出栏目", type: "select", default: "none",
    options: [
      { value: "none", label: "并重" },
      { value: "left", label: "看好" },
      { value: "right", label: "谨慎" },
    ], help: "弱化另一栏以突出某一栏" },
  { key: "showTag", label: "栏目标记", type: "toggle", default: true,
    help: "每栏顶部的方向标记（✓ / !）显示 / 隐藏" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部策略小结文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 3,
  focusSide: "none",
  showTag: true,
  showCallout: true,
  copy: {
    t001: "投资展望 / 10",
    t002: "从「赌叙事」转向「看兑现」",
    t003: "投资建议与策略",
    t004: "看好方向",
    t005: "谨慎对待",
    t006: "↳ 阶段策略",
    t007: "25–26 年观察头部 IPO 表现，警惕破发引发的估值回调；26–27 年优选 ARR 超 1 亿、续约率 >120% 的垂直标的；27 年后若 AGI 未兑现，进入洗牌期可抄底被低估的技术资产。",
  },
  favorItems: [
  { name: "垂直应用", desc: "有清晰商业模式、已验证 PMF 的细分赛道（企业搜索 Glean、法律 AI Harvey）。" },
  { name: "基础设施中游", desc: "数据标注（Scale AI）、向量数据库（Pinecone）等「卖铲子」环节。" },
  { name: "具身智能", desc: "人形机器人（Figure AI）、自动驾驶等长周期技术积累的硬科技。" },
],
  cautionItems: [
  { name: "高估值无收入纯模型", desc: "烧钱速度快、竞争壁垒低、估值泡沫大。" },
  { name: "跟风「AI 包装」项目", desc: "仅在传统业务上加一层 LLM 调用，无核心技术壁垒。" },
  { name: "缺乏数据护城河应用", desc: "用户迁移成本低，易被大厂复制。" },
  ],
  ...decorDefaults,
};




function Column({ side, title, en, mark, color, items, dim, showTag }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", opacity: dim ? 0.4 : 1, transition: "opacity .3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18, borderBottom: `3px solid ${color}` }}>
        {showTag && (
          <span style={{ width: 44, height: 44, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
            background: color, color: side === "left" ? "#161513" : "#fff", fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
            {mark}
          </span>
        )}
        <div>
          <h3 className="rd-headline" style={{ fontSize: 40 }}>{title}</h3>
          <div className="rd-mono" style={{ fontSize: 21, marginTop: 4, color: COLORS.ink3 }}>{en}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 20, padding: "22px 0", borderBottom: `1px solid ${COLORS.line2}` }}>
            <span className="rd-mono" style={{ fontSize: 24, color, flex: "none", width: 40 }}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div style={{ fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 28, color: COLORS.ink }}>{it.name}</div>
              <p className="rd-cap" style={{ marginTop: 6, maxWidth: 600 }}>{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OutlookSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const n = Math.max(1, Math.min(3, p.itemCount));

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 28, paddingBottom: 22 }}>
          <h2 className="rd-title rd-anim rd-anim-2">{copy.t003}</h2>
          <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={186} rotate={6} pos={{ right: 110, top: -28 }} />
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", gap: 80, minHeight: 0 }}>
          <Column side="left" title={copy.t004} en="OPPORTUNITIES" mark="✓" color={COLORS.lime}
            items={p.favorItems.slice(0, n)} dim={p.focusSide === "right"} showTag={p.showTag} />
          <div style={{ width: 1, background: COLORS.line }} />
          <Column side="right" title={copy.t005} en="CAUTIONS" mark="!" color={COLORS.blue}
            items={p.cautionItems.slice(0, n)} dim={p.focusSide === "left"} showTag={p.showTag} />
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ marginTop: 14, paddingTop: 18, borderTop: `2px solid ${COLORS.blue}`, display: "flex", gap: 18, alignItems: "baseline" }}>
            <span className="rd-mono" style={{ color: "var(--rd-blue)", flex: "none" }}>{copy.t006}</span>
            <p className="rd-cap" style={{ maxWidth: 1500 }}>{copy.t007}</p>
          </div>
        )}
      </div>
    </div>
  );
}
