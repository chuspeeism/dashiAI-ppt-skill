// SlideSwimlane.jsx — 职责泳道 / who-does-what across phases.
// A matrix where rows are actors (lanes) and columns are phases; cells that hold
// a responsibility show a chip, and a connecting thread traces the active hand-off
// path across phases. Distinct from SlideSteps/Gantt (single track) and
// SlideCompareMatrix (✓/✗ scoring): this maps OWNERSHIP across a timeline.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.swl-`.
//
// ── Props (canonical list in SlideSwimlane.META.controls) ─────────────────────
//   laneCount   number 2..4   how many actor lanes                         (3)
//   phaseCount  number 3..5   how many phase columns                       (4)
//   showInactive boolean      faint dots in empty cells                    (true)
//   accentLane  number 0..4   highlight one lane (0 = none)                (0)
//
// Content props (authored at call-site):
//   overline, title, phases:[string], lanes:[{ name }],
//   cells:[{ lane(idx), phase(idx), task }]  (sparse: only filled cells)

import React from 'react';

function SlideSwimlane({
  overline = '职责分工 · WHO DOES WHAT', title = '哪些交给引擎，哪些留给你',
  phases = ['设定', '执行', '监测', '回顾', '优化'],
  lanes = [{ name: '你' }, { name: '引擎' }, { name: '顾问' }, { name: '托管行' }],
  cells = [
    { lane: 0, phase: 0, task: '说清目标' },
    { lane: 1, phase: 0, task: '生成专属指数' },
    { lane: 1, phase: 1, task: '自动买卖再平衡' },
    { lane: 3, phase: 1, task: '资金结算交收' },
    { lane: 1, phase: 2, task: '7×24 偏离监测' },
    { lane: 2, phase: 2, task: '异常复核' },
    { lane: 0, phase: 3, task: '确认调整' },
    { lane: 2, phase: 3, task: '出具季度报告' },
    { lane: 1, phase: 4, task: '参数迭代微调' },
    { lane: 0, phase: 4, task: '确认续作' },
  ],
  laneCount = 4, phaseCount = 5, showInactive = true, accentLane = 0,
}) {
  React.useEffect(() => { swlInjectStyle(); }, []);
  const ln = Math.max(2, Math.min(lanes.length, laneCount));
  const pn = Math.max(3, Math.min(phases.length, phaseCount));
  const usedLanes = lanes.slice(0, ln);
  const usedPhases = phases.slice(0, pn);
  const filled = cells.filter((c) => c.lane < ln && c.phase < pn);
  const acc = Math.max(0, Math.min(ln, accentLane)) - 1;
  // Per-lane hue identity (cool hues only, so white chip text stays legible).
  const LANE = ['var(--ds-c1)', 'var(--ds-c3)', 'var(--ds-c6)', 'var(--ds-c2)'];
  const laneColor = (i) => LANE[i % LANE.length];

  // Thread: for each phase, the lane that owns the (first) chip; connect across phases.
  const ownerByPhase = usedPhases.map((_, p) => {
    const c = filled.find((x) => x.phase === p);
    return c ? c.lane : null;
  });

  return (
    <div className="swl-root">
      <div className="swl-head">
        <div className="swl-overline">{overline}</div>
        <h2 className="swl-title">{title}</h2>
      </div>

      <div className="swl-grid"
           style={{ gridTemplateColumns: `200px repeat(${pn}, 1fr)`, gridTemplateRows: `120px repeat(${ln}, 1fr)` }}>
        {/* corner */}
        <div className="swl-corner" />
        {/* phase headers */}
        {usedPhases.map((p, j) => (
          <div className="swl-phase" key={'p' + j}>
            <span className="swl-phase-idx">{String(j + 1).padStart(2, '0')}</span>
            <span className="swl-phase-name">{p}</span>
          </div>
        ))}
        {/* lanes */}
        {usedLanes.map((lane, i) => (
          <React.Fragment key={'l' + i}>
            <div className={`swl-lanehead ${i === acc ? 'is-acc' : ''}`} style={{ color: laneColor(i) }}>{lane.name}</div>
            {usedPhases.map((_, j) => {
              const c = filled.find((x) => x.lane === i && x.phase === j);
              const owner = ownerByPhase[j] === i;
              return (
                <div className={`swl-cell ${i === acc ? 'lane-acc' : ''}`} key={`c${i}-${j}`}>
                  {c ? (
                    <div className={`swl-chip ${owner ? 'is-owner' : ''}`}
                         style={owner ? { background: `linear-gradient(135deg, ${laneColor(i)}, color-mix(in srgb, ${laneColor(i)} 62%, #0b0c0f))`, color: '#fff', boxShadow: 'none' } : undefined}>{c.task}</div>
                  ) : (showInactive ? <span className="swl-empty" /> : null)}
                </div>
              );
            })}
          </React.Fragment>
        ))}

      </div>
    </div>
  );
}

function swlInjectStyle() {
  if (document.getElementById('swl-style')) return;
  const s = document.createElement('style'); s.id = 'swl-style';
  s.textContent = `
  .swl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .swl-head{margin-bottom:30px;}
  .swl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .swl-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .swl-grid{position:relative;flex:1;min-height:0;display:grid;gap:0;}
  .swl-corner{}
  .swl-phase{display:flex;flex-direction:column;gap:4px;padding:0 20px 22px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.18));}
  .swl-phase-idx{font-family:var(--font-mono);font-size:24px;color:var(--ds-accent,#6f9bd8);}
  .swl-phase-name{font-size:30px;font-weight:300;}
  .swl-lanehead{display:flex;align-items:center;font-size:30px;font-weight:300;padding-right:24px;
    border-right:1px solid var(--ds-line,rgba(242,243,246,.18));color:var(--ds-muted,rgba(242,243,246,.8));}
  .swl-lanehead.is-acc{color:var(--ds-accent,#6f9bd8);}
  .swl-cell{position:relative;display:flex;align-items:center;padding:14px 20px;
    border-bottom:1px solid var(--ds-line,rgba(242,243,246,.07));}
  .swl-cell.lane-acc{background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 5%,transparent);}
  .swl-chip{font-size:26px;font-weight:300;padding:14px 22px;border-radius:12px;line-height:1.2;
    background:var(--ds-card,rgba(255,255,255,.05));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.16));z-index:2;}
  .swl-chip.is-owner{background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 88%,#0b0c0f);color:#0c1118;box-shadow:none;}
  .swl-empty{width:10px;height:10px;border-radius:50%;background:var(--ds-line,rgba(242,243,246,.18));}
  `;
  document.head.appendChild(s);
}

SlideSwimlane.META = {
  id: 'swimlane', title: '职责泳道',
  defaults: { laneCount: 4, phaseCount: 5, showInactive: true, accentLane: 0 },
  controls: [
    { key: 'laneCount', type: 'slider', label: '泳道数量', default: 3, min: 2, max: 4, step: 1,
      description: '参与方（泳道）数量。' },
    { key: 'phaseCount', type: 'slider', label: '阶段列数', default: 4, min: 3, max: 5, step: 1,
      description: '阶段（列）数量。' },
    { key: 'showInactive', type: 'toggle', label: '空格点', default: true,
      description: '无责任格里的浅色占位点。' },
    { key: 'accentLane', type: 'slider', label: '强调泳道', default: 0, min: 0, max: 4, step: 1,
      description: '高亮某一条泳道（0 为不强调）。' },
  ],
};

export { SlideSwimlane };
export const META = SlideSwimlane.META;
export default SlideSwimlane;
