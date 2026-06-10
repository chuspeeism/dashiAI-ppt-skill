import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   TimelineSlide — 时间轴 (phased roadmap / strategy timeline).
   A props-driven timeline: horizontal or vertical, N phases, optional
   connecting rail, a focusable phase and a meta caveat line. Pure & portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "orientation", label: "排布方向", type: "select", default: "horizontal",
    options: [
      { value: "horizontal", label: "横向" },
      { value: "vertical", label: "纵向" },
    ], help: "时间轴的排布方向" },
  { key: "itemCount", label: "阶段数量", type: "slider", default: 3, min: 1, max: 3, step: 1,
    help: "展示的阶段数量" },
  { key: "showConnector", label: "连接轨道", type: "toggle", default: true,
    help: "阶段之间的连接轨道与箭头显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它阶段以突出某一阶段" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 1, min: 0, max: 2, step: 1,
    help: "被突出的阶段序号（自动随阶段数量收敛）" },
  { key: "showMeta", label: "页脚说明", type: "toggle", default: true,
    help: "底部数据口径 / 风险提示显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  orientation: "horizontal",
  itemCount: 3,
  showConnector: true,
  focusEnabled: false,
  focusIndex: 1,
  showMeta: true,
  copy: {
    t001: "投资展望 / 15",
    t002: "阶段性策略 · 2025 → 2027+",
    t003: "阶段性投资策略",
    t004: "路线图",
    t005: "策略为基于公开数据的研究推演 · 不构成投资建议",
  },
  phases: [
  { span: "2025 — 2026", tag: "PHASE 01", head: "观察 · 警惕回调",
    body: "持续观察头部公司 IPO 表现；若 Anthropic、OpenAI 上市后破发，警惕全行业估值回调。",
    cue: "触发：头部 IPO 破发" },
  { span: "2026 — 2027", tag: "PHASE 02", head: "聚焦兑现能力",
    body: "关注垂直应用收入增长曲线，优选 ARR ≥ 1 亿美元、续约率 > 120% 的标的。",
    cue: "信号：ARR 与续约率" },
  { span: "2027 年 后", tag: "PHASE 03", head: "洗牌期 · 逢低布局",
    body: "若 AGI 突破未兑现，预计进入行业洗牌期，可逢低布局被低估的技术资产。",
    cue: "窗口：行业洗牌期" },
  ],
  ...decorDefaults,
};



function Node({ hot }) {
  return (
    <span style={{
      width: hot ? 22 : 15, height: hot ? 22 : 15, flex: "none",
      borderRadius: "50%", background: hot ? COLORS.blue : COLORS.ink,
      boxShadow: `0 0 0 6px ${COLORS.bg}`,
    }} />
  );
}

export default function TimelineSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const count = Math.max(1, Math.min(p.phases.length, p.itemCount));
  const items = p.phases.slice(0, count);
  const fi = Math.min(p.focusIndex, count - 1);
  const accent = COLORS.blue;
  const vertical = p.orientation === "vertical";

  // centers of first & last node (n equal columns) for the horizontal rail
  const c0 = (1 / (2 * count)) * 100;
  const c1 = (1 - 1 / (2 * count)) * 100;

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <h2 className="rd-title rd-anim rd-anim-2" style={{ marginTop: 40 }}>{copy.t003}<span className="rd-blue">{copy.t004}</span>
        </h2>

        {!vertical ? (
          /* ---- HORIZONTAL ---- */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 20 }}>
            {/* rail */}
            <div className="rd-anim rd-anim-2" style={{ position: "relative", height: 26, marginBottom: 30 }}>
              {p.showConnector && (
                <div style={{ position: "absolute", top: "50%", left: `${c0}%`, width: `${c1 - c0}%`, height: 2, background: COLORS.line, transform: "translateY(-50%)" }} />
              )}
              <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                {items.map((_, i) => {
                  const hot = p.focusEnabled && i === fi;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: p.focusEnabled && !hot ? 0.4 : 1 }}>
                      <Node hot={hot} />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* cards */}
            <div style={{ display: "flex" }}>
              {items.map((ph, i) => {
                const hot = p.focusEnabled && i === fi;
                return (
                  <div key={i} className={`rd-anim rd-anim-${Math.min(i + 2, 4)}`} style={{
                    flex: 1, padding: "0 40px",
                    borderLeft: i === 0 ? "none" : `1px solid ${COLORS.line2}`,
                    opacity: p.focusEnabled && !hot ? 0.45 : 1,
                  }}>
                    <div className="rd-mono" style={{ color: hot ? accent : COLORS.ink3, marginBottom: 14 }}>{ph.tag}</div>
                    <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 60, lineHeight: 1, letterSpacing: "-0.02em", color: hot ? accent : COLORS.ink }}>{ph.span}</div>
                    <div className="rd-sub" style={{ marginTop: 22 }}>{ph.head}</div>
                    <p className="rd-body" style={{ marginTop: 14 }}>{ph.body}</p>
                    <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 8, height: 8, background: hot ? accent : COLORS.ink, flex: "none" }} />
                      <span className="rd-mono" style={{ fontSize: 22, color: hot ? accent : COLORS.ink2 }}>{ph.cue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ---- VERTICAL ---- */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 8 }}>
            {items.map((ph, i) => {
              const hot = p.focusEnabled && i === fi;
              return (
                <div key={i} className={`rd-anim rd-anim-${Math.min(i + 2, 4)}`} style={{ display: "flex", gap: 40, opacity: p.focusEnabled && !hot ? 0.45 : 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none", width: 22 }}>
                    <Node hot={hot} />
                    {p.showConnector && i < count - 1 && <span style={{ flex: 1, width: 2, background: COLORS.line, margin: "6px 0" }} />}
                  </div>
                  <div style={{ paddingBottom: i < count - 1 ? 38 : 0, flex: 1, display: "flex", gap: 56, alignItems: "baseline" }}>
                    <div style={{ flex: "none", width: 320 }}>
                      <div className="rd-mono" style={{ color: hot ? accent : COLORS.ink3, marginBottom: 8 }}>{ph.tag}</div>
                      <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em", color: hot ? accent : COLORS.ink }}>{ph.span}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="rd-sub">{ph.head}</div>
                      <p className="rd-body" style={{ marginTop: 10, maxWidth: 820 }}>{ph.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {p.showMeta && (
          <div className="rd-anim rd-anim-4" style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 18, marginTop: 8 }}>
            <span className="rd-mono" style={{ color: COLORS.ink3 }}>{copy.t005}</span>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={170} rotate={-4} pos={{ right: 60, top: 150 }} />
    </div>
  );
}
