// SlideChecklist.jsx — 行动清单 / actionable checklist.
// A two-column (or one) list of action items, each with a checkbox-style mark,
// a task and a short outcome. Some can be pre-checked to show "already handled
// for you". Distinct from SlidePrinciples (statements), SlideSteps (ordered
// process) and SlideFAQ (Q&A): this is a do-list. Standalone & migratable:
// depends only on React (imported). Token-driven. CSS scoped under `.ckl-`.
//
// ── Props (canonical list in SlideChecklist.META.controls) ────────────────────
//   itemCount   number 3..8        how many checklist items                (6)
//   columns     number 1..2        layout columns                          (2)
//   showOutcome boolean            the outcome line under each task        (true)
//   checkedMode 'data'|'all'|'none' which items render as checked          ('data')
//
// Content props (authored at call-site):
//   overline, title, items:[{ task, outcome, done(bool) }]

import React from 'react';

function SlideChecklist({
  overline = '下一步 · YOUR CHECKLIST', title = '开始之前，只要这几步',
  items = [
    { task: '设定目标与期限', outcome: '生成你的专属指数', done: false },
    { task: '完成风险测评', outcome: '匹配核心—卫星比例', done: false },
    { task: '绑定自动定投', outcome: '到点自动买入', done: true },
    { task: '开启自动再平衡', outcome: '偏离即纠偏', done: true },
    { task: '设置季度回顾', outcome: '进度一目了然', done: true },
    { task: '指定受益与传承', outcome: '跨代规划就位', done: false },
    { task: '连接税务优化', outcome: '合法降低税负', done: true },
    { task: '订阅月度报告', outcome: '每月送达邮箱', done: true },
  ],
  itemCount = 6, columns = 2, showOutcome = true, checkedMode = 'data',
}) {
  React.useEffect(() => { cklInjectStyle(); }, []);
  const n = Math.max(3, Math.min(items.length, itemCount));
  const used = items.slice(0, n);
  const cols = Math.max(1, Math.min(2, columns));
  const isDone = (it) => checkedMode === 'all' ? true : checkedMode === 'none' ? false : !!it.done;
  const doneCount = used.filter(isDone).length;

  return (
    <div className="ckl-root">
      <div className="ckl-head">
        <div className="ckl-overline">{overline}</div>
        <div className="ckl-topline">
          <h2 className="ckl-title">{title}</h2>
          <div className="ckl-counter">
            <span className="ckl-counter-num">{doneCount}<span className="ckl-counter-sl">/{n}</span></span>
            <span className="ckl-counter-lab">已为你就绪</span>
          </div>
        </div>
      </div>

      <div className="ckl-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {used.map((it, i) => {
          const done = isDone(it);
          return (
            <div className={`ckl-item ${done ? 'is-done' : ''}`} key={i}>
              <span className="ckl-box" aria-hidden="true">{done ? '✓' : ''}</span>
              <div className="ckl-text">
                <span className="ckl-task">{it.task}</span>
                {showOutcome && <span className="ckl-outcome">{it.outcome}</span>}
              </div>
              <span className="ckl-tag">{done ? '已就绪' : '待你确认'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function cklInjectStyle() {
  if (document.getElementById('ckl-style')) return;
  const s = document.createElement('style'); s.id = 'ckl-style';
  s.textContent = `
  .ckl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .ckl-head{margin-bottom:40px;}
  .ckl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ckl-topline{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-top:14px;}
  .ckl-title{font-size:60px;font-weight:300;margin:0;line-height:1.06;}
  .ckl-counter{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
  .ckl-counter-num{font-size:56px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;color:var(--ds-accent,#6f9bd8);}
  .ckl-counter-sl{font-size:30px;color:var(--ds-faint,rgba(242,243,246,.4));}
  .ckl-counter-lab{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .ckl-grid{flex:1;min-height:0;display:grid;gap:20px 56px;align-content:center;}
  .ckl-item{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:26px;
    padding:22px 4px;border-top:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .ckl-box{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;
    font-size:26px;color:#0c1118;box-shadow:inset 0 0 0 2px var(--ds-line,rgba(242,243,246,.28));}
  .ckl-item.is-done .ckl-box{color:#fff;background:linear-gradient(135deg,var(--ds-accent-2,#8fa8e6),var(--ds-accent,#5479e8));
    }
  .ckl-text{display:flex;flex-direction:column;gap:4px;min-width:0;}
  .ckl-task{font-size:31px;font-weight:300;}
  .ckl-outcome{font-family:var(--font-mono);font-size:24px;letter-spacing:.02em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .ckl-tag{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;white-space:nowrap;padding:5px 14px;border-radius:999px;
    color:var(--ds-faint,rgba(242,243,246,.5));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.18));}
  .ckl-item.is-done .ckl-tag{color:var(--ds-accent,#6f9bd8);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ds-accent,#6f9bd8) 55%,transparent);}
  `;
  document.head.appendChild(s);
}

SlideChecklist.META = {
  id: 'checklist', title: '行动清单',
  defaults: { itemCount: 6, columns: 2, showOutcome: true, checkedMode: 'data' },
  controls: [
    { key: 'itemCount', type: 'slider', label: '条目数量', default: 6, min: 3, max: 8, step: 1,
      description: '清单条目数量。' },
    { key: 'columns', type: 'slider', label: '列数', default: 2, min: 1, max: 2, step: 1,
      description: '单列或双列排布。' },
    { key: 'showOutcome', type: 'toggle', label: '结果说明', default: true,
      description: '每条任务下方的结果小字。' },
    { key: 'checkedMode', type: 'radio', label: '勾选状态', default: 'data',
      options: [{ value: 'data', label: '按数据' }, { value: 'all', label: '全选' }, { value: 'none', label: '全空' }],
      description: '渲染为勾选的条目：按内容、全部勾选或全部留空。' },
  ],
};

export { SlideChecklist };
export const META = SlideChecklist.META;
export default SlideChecklist;
