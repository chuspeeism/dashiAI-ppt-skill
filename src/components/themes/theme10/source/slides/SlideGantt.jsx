// SlideGantt.jsx — 排期甘特 / scheduled bars over a time axis.
// Rows of tasks, each a bar spanning its start→end across a shared period axis,
// with phase tinting, an optional "today" marker and milestone dots. Distinct
// from SlideTimeline (point events), SlideJourney (progress) and SlideSteps
// (process): this places DURATIONS on a calendar. Standalone & migratable:
// depends only on React (imported). Token-driven. CSS scoped under `.gnt-`.
//
// ── Props (canonical list in SlideGantt.META.controls) ────────────────────────
//   taskCount   number 3..7   how many task rows                           (5)
//   colCount    number 4..8   how many period columns on the axis          (6)
//   showToday   boolean       the "now" vertical marker                    (true)
//   showDates   boolean       the start–end label on each bar              (true)
//   showGrid    boolean       vertical period gridlines                    (true)
//   focus       boolean       emphasise one task, dim the rest             (false)
//   focusIndex  number 1..7   which task is emphasised (1-based)           (1)
//
// Content props (authored at call-site):
//   overline, title, periods:[string], todayAt(fractional col index),
//   tasks:[{ label, start(col), end(col), phase(0..2), span }]

import React from 'react';

function SlideGantt({
  overline = '实施排期 · ROLLOUT PLAN', title = '从开户到自动运转',
  periods = ['第1月', '第2月', '第3月', '第4月', '第5月', '第6月', '第7月', '第8月'],
  todayAt = 2.4,
  tasks = [
    { label: '开户与目标设定', start: 0, end: 1, phase: 0, span: '第1月' },
    { label: '风险测评与建仓', start: 0.6, end: 2, phase: 0, span: '1–2 月' },
    { label: '自动定投上线', start: 1.6, end: 3, phase: 1, span: '2–3 月' },
    { label: '再平衡引擎接入', start: 2.4, end: 4.2, phase: 1, span: '3–4 月' },
    { label: '税务优化模块', start: 3.4, end: 5, phase: 2, span: '4–5 月' },
    { label: '季度回顾机制', start: 4.2, end: 6, phase: 2, span: '5–6 月' },
    { label: '传承与受益设置', start: 5, end: 6, phase: 2, span: '第6月' },
  ],
  taskCount = 5, colCount = 6, showToday = true, showDates = true, showGrid = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { gntInjectStyle(); }, []);
  const n = Math.max(3, Math.min(tasks.length, taskCount));
  const cn = Math.max(4, Math.min(periods.length, colCount));
  const used = tasks.slice(0, n);
  const cols = periods.slice(0, cn);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const PHASE = ['var(--ds-c1)', 'var(--ds-c3)', 'var(--ds-c4)'];
  const pct = (c) => (Math.max(0, Math.min(cn, c)) / cn) * 100;

  return (
    <div className="gnt-root">
      <div className="gnt-head">
        <div className="gnt-overline">{overline}</div>
        <h2 className="gnt-title">{title}</h2>
      </div>

      <div className="gnt-stage">
        <div className="gnt-axis" style={{ marginLeft: '340px' }}>
          {cols.map((p, i) => <span className="gnt-axcol" key={i} style={{ width: `${100 / cn}%` }}>{p}</span>)}
        </div>

        <div className="gnt-rows">
          <div className="gnt-overlay">
            {showGrid && Array.from({ length: cn + 1 }).map((_, i) => (
              <span className="gnt-gridline" key={i} style={{ left: `${(i / cn) * 100}%` }} />
            ))}
            {showToday && (
              <div className="gnt-today" style={{ left: `${pct(todayAt)}%` }}>
                <span className="gnt-today-tag">今天</span>
              </div>
            )}
          </div>
          {used.map((t, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            return (
              <div className={`gnt-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <span className="gnt-label">{t.label}</span>
                <div className="gnt-track">
                  <div className="gnt-bar"
                       style={{ left: `${pct(t.start)}%`, width: `${pct(t.end) - pct(t.start)}%`,
                         background: `linear-gradient(180deg, color-mix(in srgb, ${PHASE[t.phase] || PHASE[0]} 80%, #fff), ${PHASE[t.phase] || PHASE[0]})` }}>
                    {showDates && <span className="gnt-span">{t.span}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function gntInjectStyle() {
  if (document.getElementById('gnt-style')) return;
  const s = document.createElement('style'); s.id = 'gnt-style';
  s.textContent = `
  .gnt-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .gnt-head{margin-bottom:30px;}
  .gnt-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .gnt-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .gnt-stage{flex:1;min-height:0;display:flex;flex-direction:column;}
  .gnt-axis{display:flex;padding-bottom:18px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.16));}
  .gnt-axcol{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.5));text-align:left;}
  .gnt-rows{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:20px;padding-top:24px;}
  .gnt-overlay{position:absolute;top:0;bottom:0;left:340px;right:0;pointer-events:none;z-index:2;}
  .gnt-gridline{position:absolute;top:0;bottom:0;width:1px;background:var(--ds-line,rgba(242,243,246,.08));}
  .gnt-today{position:absolute;top:-8px;bottom:0;width:2px;background:var(--ds-ink,#f2f3f6);transform:translateX(-50%);}
  .gnt-today-tag{position:absolute;top:-2px;left:50%;transform:translateX(-50%);font-family:var(--font-mono);
    font-size:24px;color:var(--ds-ink,#f2f3f6);background:var(--ds-bg,#0d0e11);padding:0 8px;white-space:nowrap;}
  .gnt-row{display:grid;grid-template-columns:340px 1fr;align-items:center;gap:0;transition:opacity .25s;}
  .gnt-row.is-dim{opacity:.34;}
  .gnt-label{font-size:30px;font-weight:300;padding-right:36px;}
  .gnt-row.is-focus .gnt-label{color:var(--ds-accent,#6f9bd8);}
  .gnt-track{position:relative;height:50px;}
  .gnt-bar{position:absolute;top:50%;height:42px;transform:translateY(-50%);border-radius:9px;
    display:flex;align-items:center;padding:0 18px;min-width:0;}
  .gnt-row.is-focus .gnt-bar{box-shadow:0 0 0 2px var(--ds-ink,#f2f3f6);}
  .gnt-span{font-family:var(--font-mono);font-size:24px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  `;
  document.head.appendChild(s);
}

SlideGantt.META = {
  id: 'gantt', title: '排期甘特',
  defaults: { taskCount: 5, colCount: 6, showToday: true, showDates: true, showGrid: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'taskCount', type: 'slider', label: '任务行数', default: 5, min: 3, max: 7, step: 1,
      description: '排期中的任务行数。' },
    { key: 'colCount', type: 'slider', label: '周期列数', default: 6, min: 4, max: 8, step: 1,
      description: '时间轴上的周期列数。' },
    { key: 'showToday', type: 'toggle', label: '今天标记', default: true,
      description: '当前时间的竖线标记。' },
    { key: 'showDates', type: 'toggle', label: '区间标签', default: true,
      description: '每条任务条上的起止区间。' },
    { key: 'showGrid', type: 'toggle', label: '网格线', default: true,
      description: '纵向的周期网格线。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一任务，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideGantt };
export const META = SlideGantt.META;
export default SlideGantt;
