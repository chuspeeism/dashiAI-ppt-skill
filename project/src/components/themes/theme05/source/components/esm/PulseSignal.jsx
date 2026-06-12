/* =========================================================================
   PulseSignal — P50 table page ("早期信号表 / Early-Signal Table" archetype).
   A generic Swiss data table whose DISTINGUISHING element is a signal-strength
   dot meter column (●●●○○) — complementary to PulseMatrix (chip verdicts),
   PulseLedger (inline data bars) and PulseMeter (0–100 gauges). Rows can sort
   by signal; an intro carries the lead + a headline metric pair. The reusable
   `table_page` template for any "emerging themes / watchlist / signal strength"
   table. Text/data live in COPY (not prop-driven); everything else by props.

   Self-contained & migratable: depends only on React + the shared .pulse-sig /
   .pulse-* CSS. See PulseSignal.controls for the typed parameter list.
   `export default PulseSignal; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
// Each row: theme (k + en), data (count + amount), direction (dir), signal level.
const COPY = {
  eyebrow: "EARLY STAGE SIGNAL",
  title: "新主题萌芽",
  sheet: "SIGNAL · 50 / 80",
  lead: "Seed 和 A 轮金额较小，但代表新主题正在形成。",
  headlines: [
    ["早期轮占事件数", "20.6", "%"],
    ["Seed + A 轮事件", "20", "笔"],
  ],
  headers: ["早期主题", "早期轮数据", "代表方向", "信号强度"],
  signalHead: "SIGNAL",
  rows: [
    { k: "智能体", en: "Agents",   count: "12", unit: "笔", amt: "1.8 亿美元", dir: "任务编排 · 工具调用", sig: 4 },
    { k: "安全对齐", en: "Safety",  count: "8",  unit: "笔", amt: "1.2 亿美元", dir: "评测 · 对齐 · 红队",   sig: 3 },
    { k: "具身智能", en: "Embodied", count: "6", unit: "笔", amt: "0.9 亿美元", dir: "操作策略 · 机器人",     sig: 3 },
    { k: "行业模型", en: "Vertical", count: "5", unit: "笔", amt: "0.7 亿美元", dir: "法律 · 医疗 · 金融",   sig: 2 },
  ],
  conclusion: "小金额交易往往藏着下一轮主题。",
};

const controls = [
  { key: "rowCount", type: "slider", label: "数据行数", default: 4, min: 2, max: 4, step: 1,
    description: "表格的数据行数量。" },
  { key: "showSignal", type: "toggle", label: "信号强度列", default: true,
    description: "末尾的信号强度点阵列（关闭则收起该列）。" },
  { key: "scaleMax", type: "slider", label: "信号刻度上限", default: 5, min: 3, max: 5, step: 1,
    description: "信号点阵的总刻度数（点的总个数）。" },
  { key: "sortDescending", type: "toggle", label: "按信号降序", default: true,
    description: "是否按信号强度由高到低排序行。" },
  { key: "zebra", type: "toggle", label: "斑马纹", default: false,
    description: "隔行底色，便于横向读取。" },
  { key: "focusEnabled", type: "toggle", label: "重点行", default: true,
    description: "是否突出某一行。" },
  { key: "focusIndex", type: "slider", label: "重点行序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的行序号（按当前排序后顺序，从 1 起）。" },
  { key: "showIntro", type: "toggle", label: "引导栏", default: true,
    description: "表格上方的引导文案与一对头部指标。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[2], options: SPECTRUM,
    description: "眉标 / 头部指标 / 重点行 / 信号点的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "表格下方的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseSignal(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.rows.length, p.rowCount));
  let rows = COPY.rows.slice(0, n);
  if (p.sortDescending) rows = rows.slice().sort((a, b) => b.sig - a.sig);

  const scaleMax = Math.max(3, Math.min(5, p.scaleMax));
  const showSignal = p.showSignal;
  const template = showSignal ? "1.5fr 1.3fr 1.7fr 1.2fr" : "1.6fr 1.4fr 2fr";
  const headers = showSignal ? COPY.headers : COPY.headers.slice(0, 3);

  return (
    <div className="pulse-slide pulse-sig" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-sig__body">
        {p.showIntro && (
          <div className="pulse-sig__intro">
            <div className="pulse-sig__lead">{COPY.lead}</div>
            <div className="pulse-sig__hm">
              {COPY.headlines.map((h, i) => (
                <div className="pulse-sig__hm-item" key={i}>
                  <span className="pulse-sig__hm-v">{h[1]}<small>{h[2]}</small></span>
                  <span className="pulse-sig__hm-k">{h[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pulse-sig__table">
          <div className="pulse-sig__row pulse-sig__row--head" style={{ gridTemplateColumns: template }}>
            {headers.map((h, i) => (
              <div className="pulse-sig__cell" key={i}>
                <span className="pulse-sig__h">{i === 3 ? COPY.signalHead : h}</span>
              </div>
            ))}
          </div>

          {rows.map((r, i) => {
            const focus = p.focusEnabled && i + 1 === p.focusIndex;
            const zebra = p.zebra && !focus && i % 2 === 1;
            const cls = "pulse-sig__row pulse-sig__row--body"
              + (focus ? " pulse-sig__row--focus" : "")
              + (zebra ? " pulse-sig__row--zebra" : "");
            return (
              <div key={i} className={cls} style={{ gridTemplateColumns: template }}>
                <div className="pulse-sig__cell">
                  <span className="pulse-sig__k">{r.k}</span>
                  <span className="pulse-sig__sub">{r.en}</span>
                </div>
                <div className="pulse-sig__cell">
                  <span className="pulse-sig__num">{r.count}<small>{r.unit}</small></span>
                  <span className="pulse-sig__amt">{r.amt}</span>
                </div>
                <div className="pulse-sig__cell">
                  <span className="pulse-sig__dir">{r.dir}</span>
                </div>
                {showSignal && (
                  <div className="pulse-sig__cell">
                    <div className="pulse-sig__meter">
                      <div className="pulse-sig__dots">
                        {Array.from({ length: scaleMax }).map((_, d) => {
                          const on = d < r.sig;
                          const fillColor = focus ? "#fff" : accent;
                          return (
                            <span key={d} className="pulse-sig__dot"
                              style={on
                                ? { background: fillColor, border: "2px solid " + fillColor }
                                : { background: "transparent", border: "2px solid " + (focus ? "rgba(255,255,255,0.5)" : "var(--pulse-hair)") }} />
                          );
                        })}
                      </div>
                      <span className="pulse-sig__lvl">{r.sig}/{scaleMax}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-sig__foot">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseSignal.controls = controls;
PulseSignal.defaults = defaults;
export default PulseSignal;
export { controls };
export { defaults };
