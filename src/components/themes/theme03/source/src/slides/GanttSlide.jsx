import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   GanttSlide — 分阶段建仓执行甘特（AI 赛道投资版）.
   标准甘特结构：左侧任务列 + 顶部时间轴（季度），每条任务为一项
   投资执行动作（负责 = 赛道 / 职能，进度填充 = 配置完成度，菱形 = 关键
   节点）。把「投资建议」落到可执行的时间表上。纯 props 驱动，可迁移。
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "taskCount", label: "任务数量", type: "slider", default: 7, min: 3, max: 8, step: 1,
    help: "展示的投资执行任务行数" },
  { key: "showGrid", label: "网格线", type: "toggle", default: true,
    help: "时间轴竖向网格线显示 / 隐藏" },
  { key: "showProgress", label: "配置进度", type: "toggle", default: true,
    help: "任务条上的配置完成度填充显示 / 隐藏" },
  { key: "showMilestones", label: "关键节点", type: "toggle", default: true,
    help: "里程碑菱形标记显示 / 隐藏" },
  { key: "showToday", label: "当前基准线", type: "toggle", default: true,
    help: "「当前」竖向基准线显示 / 隐藏" },
  { key: "showAnalysis", label: "节奏解读", type: "toggle", default: true,
    help: "底部关键路径 / 节奏解读条显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一个任务条" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 7, step: 1,
    help: "被高亮的任务序号（自动随任务数量收敛）" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  taskCount: 7,
  showGrid: true,
  showProgress: true,
  showMilestones: true,
  showToday: true,
  showAnalysis: true,
  focusEnabled: false,
  focusIndex: 2,
  theme: "light",
  copy: {
    t001: "执行模型 / GANTT",
    t002: "分阶段建仓 · 投资执行甘特",
    t003: "分阶段建仓路线图",
    t004: "赛道 · 窗口 · 配置进度 · 关键节点 — 把投资建议落到时间表",
    t005: "执行任务 / 负责",
    t006: "当前",
    t007: "研究 / 观察",
    t008: "建仓 / 布局",
    t009: "收获 / 再平衡",
    t010: "里程碑",
    t011: "↳ 解读",
    t012: "建仓节奏、“卖铲赢家”优先——基建 / 算力是当前关键路径，收入确定性高、可先行建仓； 大模型以头部集中、持续跟投，同时全程跳动“估值泡沫监测”；26 年下半年进入组合再平衡与收获窗口。",
  },
  tasks: [
  { name: "卖铲赢家建仓", owner: "基建·算力", start: 0,   end: 2.6, prog: 0.65, phase: 1, ms: 2.6 },
  { name: "头部大模型跟投", owner: "通用模型", start: 0,   end: 5.0, prog: 0.4,  phase: 1 },
  { name: "垂直应用布局", owner: "应用层",   start: 1.6, end: 5.6, prog: 0.3,  phase: 1, ms: 5.6 },
  { name: "芯片·硬件观察", owner: "上游硬件", start: 1.0, end: 4.0, prog: 0.5,  phase: 0 },
  { name: "估值泡沫监测", owner: "风险控制", start: 0,   end: 8.0, prog: 0.45, phase: 0 },
  { name: "长尾标的筛选", owner: "研究池",   start: 2.2, end: 4.6, prog: 0.25, phase: 0 },
  { name: "组合再平衡",   owner: "组合管理", start: 4.8, end: 6.8, prog: 0.0,  phase: 2, ms: 6.8 },
  { name: "收获 / 退出窗口", owner: "组合管理", start: 6.4, end: 8.0, prog: 0.0,  phase: 2 },
  ],
  ...decorDefaults,
};

const MONTHS = ["25Q1", "25Q2", "25Q3", "25Q4", "26Q1", "26Q2", "26Q3", "26Q4"];
const TODAY = 4.4; // 当前执行点（起于 25Q1 的季度数）

// start / end 以季度计 (0..8). phase 决定条颜色。


const PHASE_COLORS = [COLORS.blue, "#161513", "#9a988f"];

export default function GanttSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = COLORS.blue;
  const n = Math.max(3, Math.min(p.tasks.length, p.taskCount));
  const tasks = p.tasks.slice(0, n);
  const fi = Math.min(p.focusIndex, n - 1);
  const span = MONTHS.length; // 8
  const pct = (v) => (v / span) * 100;
  const LABEL_W = 280;

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 24, paddingBottom: 14 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        {/* chart */}
        <div className="rd-anim rd-anim-3" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* time axis header */}
          <div style={{ display: "flex", borderBottom: `2px solid ${COLORS.ink}`, paddingBottom: 8 }}>
            <div style={{ width: LABEL_W, flex: "none" }}>
              <span className="rd-mono" style={{ fontSize: 18, color: COLORS.ink3 }}>{copy.t005}</span>
            </div>
            <div style={{ flex: 1, display: "flex" }}>
              {MONTHS.map((m) => (
                <div key={m} className="rd-mono" style={{ flex: 1, fontSize: 19, color: COLORS.ink2, textAlign: "left", paddingLeft: 6 }}>{m}</div>
              ))}
            </div>
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
            {/* grid + today overlay, spanning the bar area only */}
            <div style={{ position: "absolute", left: LABEL_W, right: 0, top: 0, bottom: 0, pointerEvents: "none" }}>
              {p.showGrid && MONTHS.map((_, i) => i > 0 && (
                <div key={i} style={{ position: "absolute", left: `${pct(i)}%`, top: 0, bottom: 0, width: 1, background: COLORS.line2 }} />
              ))}
              {p.showToday && (
                <div style={{ position: "absolute", left: `${pct(TODAY)}%`, top: -6, bottom: 0, width: 2, background: accent }}>
                  <span className="rd-mono" style={{ position: "absolute", top: -2, left: 6, fontSize: 15, color: accent, whiteSpace: "nowrap" }}>{copy.t006}</span>
                </div>
              )}
            </div>

            {tasks.map((t, i) => {
              const hot = p.focusEnabled && i === fi;
              const dim = p.focusEnabled && !hot;
              const barColor = hot ? accent : PHASE_COLORS[t.phase];
              const left = pct(t.start), width = pct(t.end - t.start);
              return (
                <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", borderBottom: i < n - 1 ? `1px solid ${COLORS.line2}` : "none", opacity: dim ? 0.45 : 1, transition: "opacity .3s" }}>
                  {/* label */}
                  <div style={{ width: LABEL_W, flex: "none", display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 700, fontSize: 24, color: hot ? accent : COLORS.ink }}>{t.name}</span>
                    <span className="rd-mono" style={{ fontSize: 16, color: COLORS.ink3 }}>{t.owner}</span>
                  </div>
                  {/* bar track */}
                  <div style={{ flex: 1, position: "relative", height: "100%" }}>
                    <div style={{
                      position: "absolute", left: `${left}%`, width: `${width}%`, top: "50%", transform: "translateY(-50%)",
                      height: 26, background: dark ? "rgba(243,242,238,0.14)" : `${barColor}33`,
                      border: `1.5px solid ${barColor}`, display: "flex", alignItems: "center",
                    }}>
                      {p.showProgress && t.prog > 0 && (
                        <div style={{ width: `${t.prog * 100}%`, height: "100%", background: barColor }} />
                      )}
                    </div>
                    {/* milestone diamond */}
                    {p.showMilestones && t.ms != null && (
                      <div style={{
                        position: "absolute", left: `${pct(t.ms)}%`, top: "50%",
                        transform: "translate(-50%,-50%) rotate(45deg)", width: 17, height: 17,
                        background: COLORS.lime, border: `2px solid ${COLORS.ink}`, zIndex: 4,
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* legend */}
          <div className="rd-anim rd-anim-4" style={{ display: "flex", gap: 28, alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.line}` }}>
            {[[copy.t007, PHASE_COLORS[0]], [copy.t008, PHASE_COLORS[1]], [copy.t009, PHASE_COLORS[2]]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 22, height: 13, background: c, flex: "none" }} />
                <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 600, fontSize: 21, color: COLORS.ink2 }}>{l}</span>
              </div>
            ))}
            {p.showMilestones && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 14, height: 14, background: COLORS.lime, border: `2px solid ${COLORS.ink}`, transform: "rotate(45deg)", flex: "none", marginLeft: 3 }} />
                <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 600, fontSize: 21, color: COLORS.ink2, marginLeft: 6 }}>{copy.t010}</span>
              </div>
            )}
          </div>
        </div>

        {p.showAnalysis && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
            <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t011}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t012}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={140} rotate={-5} pos={{ right: 58, top: 126 }} />
    </div>
  );
}
