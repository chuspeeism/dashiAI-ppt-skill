// SlideJourney.jsx — 旅程进度 / horizontal milestone progress track.
// A left-to-right rail of milestones with a coloured progress fill up to the
// "current" stage; past nodes are solid, the current node is ringed, future
// nodes are hollow. Stage cards alternate above / below the rail. Distinct from
// SlideTimeline (vertical chronology): this is horizontal and encodes WHERE YOU
// ARE NOW on the path. Standalone & migratable: depends only on React (imported).
// Token-driven. CSS scoped under `.jr-`.
//
// ── Props (canonical list in SlideJourney.META.controls) ──────────────────────
//   stageCount   number 3..6         milestones on the rail                (5)
//   currentIndex number 1..6         which milestone is "you are here"     (3)
//   layout       'alternate'|'below' card placement                       ('alternate')
//   showTargets  boolean             the figure/target per stage          (true)
//   showProgress boolean             the coloured progress fill           (true)
//
// Content props (authored at call-site):
//   overline, title, stages:[{ label, target, note }]

import React from 'react';

function SlideJourney({
  overline = '你的旅程 · THE PATH', title = '你正走到这一步',
  stages = [
    { label: '起步建仓', target: '¥0', note: '开户 · 设定目标' },
    { label: '稳定积累', target: '¥250K', note: '定投 · 自动再平衡' },
    { label: '复利加速', target: '¥600K', note: '雪球开始滚动' },
    { label: '资产多元', target: '¥1.2M', note: '加入卫星策略' },
    { label: '从容自由', target: '¥3M+', note: '被动收入覆盖开支' },
    { label: '财富传承', target: '¥5M+', note: '信托 · 跨代规划' },
  ],
  stageCount = 5, currentIndex = 3, layout = 'alternate', showTargets = true, showProgress = true,
}) {
  React.useEffect(() => { jrInjectStyle(); }, []);
  const n = Math.max(3, Math.min(stages.length, stageCount));
  const used = stages.slice(0, n);
  const cur = Math.max(0, Math.min(n - 1, currentIndex - 1));
  const startPct = 50 / n;
  const curPct = ((cur + 0.5) / n) * 100;
  const HUE = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];

  return (
    <div className="jr-root">
      <div className="jr-head">
        <div className="jr-overline">{overline}</div>
        <h2 className="jr-title">{title}</h2>
      </div>

      <div className={`jr-rail jr-${layout}`}>
        <div className="jr-line" style={{ left: `${startPct}%`, right: `${startPct}%` }} />
        {showProgress && <div className="jr-fill" style={{ left: `${startPct}%`, width: `${Math.max(curPct - startPct, 3)}%` }} />}
        <div className="jr-cols" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {used.map((st, i) => {
            const state = i < cur ? 'past' : i === cur ? 'now' : 'future';
            const top = layout === 'alternate' ? i % 2 === 0 : false;
            const hue = HUE[i % HUE.length];
            const card = (
              <div className={`jr-card jr-${state}`}>
                {state === 'now' && <span className="jr-here" style={{ color: hue }}>你在这里</span>}
                <span className="jr-label" style={state === 'now' ? { color: hue } : undefined}>{st.label}</span>
                {showTargets && <span className="jr-target" style={state === 'now' ? { color: hue } : undefined}>{st.target}</span>}
                <span className="jr-note">{st.note}</span>
              </div>
            );
            return (
              <div className="jr-col" key={i}>
                <div className="jr-zone jr-zone-top">{top ? card : null}</div>
                <div className={`jr-node jr-${state}`}
                     style={state !== 'future'
                       ? { background: hue, boxShadow: state === 'now' ? `0 0 0 8px color-mix(in srgb, ${hue} 22%, transparent)` : `inset 0 0 0 2px ${hue}` }
                       : undefined}>
                  <span className="jr-node-idx">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="jr-zone jr-zone-bot">{!top ? card : null}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function jrInjectStyle() {
  if (document.getElementById('jr-style')) return;
  const s = document.createElement('style'); s.id = 'jr-style';
  s.textContent = `
  .jr-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .jr-head{margin-bottom:20px;}
  .jr-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .jr-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .jr-rail{position:relative;flex:1;min-height:0;display:flex;align-items:center;}
  .jr-line{position:absolute;top:50%;height:2px;transform:translateY(-50%);
    background:var(--ds-line,rgba(242,243,246,.18));}
  .jr-fill{position:absolute;top:50%;height:3px;transform:translateY(-50%);border-radius:2px;
    background:linear-gradient(90deg,var(--ds-c1),var(--ds-c2) 40%,var(--ds-c3) 72%,var(--ds-c4));
    }
  .jr-cols{position:relative;width:100%;display:grid;align-items:stretch;height:100%;}
  .jr-col{display:grid;grid-template-rows:1fr auto 1fr;justify-items:center;align-items:center;min-width:0;}
  .jr-zone{width:100%;display:flex;justify-content:center;}
  .jr-zone-top{align-items:flex-end;padding-bottom:14px;}
  .jr-zone-bot{align-items:flex-start;padding-top:14px;}
  .jr-node{position:relative;z-index:1;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:var(--ds-bg-soft,#16181d);box-shadow:inset 0 0 0 2px var(--ds-line,rgba(242,243,246,.3));}
  .jr-node-idx{position:absolute;font-family:var(--font-mono);font-size:0;}
  .jr-node.jr-past{background:var(--ds-accent,#6f9bd8);box-shadow:inset 0 0 0 2px var(--ds-accent,#6f9bd8);}
  .jr-node.jr-now{width:46px;height:46px;background:var(--ds-accent,#6f9bd8);
    box-shadow:0 0 0 8px color-mix(in srgb,var(--ds-accent,#6f9bd8) 22%, transparent);}
  .jr-node.jr-future{background:var(--ds-bg,#0d0e11);box-shadow:inset 0 0 0 2px var(--ds-line,rgba(242,243,246,.28));}
  .jr-card{display:flex;flex-direction:column;gap:8px;text-align:center;max-width:280px;padding:0 10px;transition:opacity .25s;}
  .jr-here{font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;color:var(--ds-accent,#6f9bd8);
    text-transform:uppercase;margin-bottom:2px;}
  .jr-label{font-size:31px;font-weight:300;}
  .jr-target{font-family:var(--font-mono);font-size:34px;font-variant-numeric:tabular-nums;line-height:1;}
  .jr-note{font-size:24px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.58));line-height:1.4;text-wrap:pretty;}
  .jr-card.jr-past{opacity:.6;}
  .jr-card.jr-past .jr-target{color:var(--ds-muted,rgba(242,243,246,.6));}
  .jr-card.jr-now .jr-label,.jr-card.jr-now .jr-target{color:var(--ds-accent,#6f9bd8);}
  .jr-card.jr-future .jr-target{color:var(--ds-ink,#f2f3f6);}
  `;
  document.head.appendChild(s);
}

SlideJourney.META = {
  id: 'journey', title: '旅程进度',
  defaults: { stageCount: 5, currentIndex: 3, layout: 'alternate', showTargets: true, showProgress: true },
  controls: [
    { key: 'stageCount', type: 'slider', label: '里程碑数', default: 5, min: 3, max: 6, step: 1,
      description: '旅程上的里程碑节点数量。' },
    { key: 'currentIndex', type: 'slider', label: '当前进度', default: 3, min: 1, max: 6, step: 1,
      description: '「你在这里」所处的里程碑（1 为起点）。' },
    { key: 'layout', type: 'radio', label: '卡片排布', default: 'alternate',
      options: [{ value: 'alternate', label: '上下交错' }, { value: 'below', label: '统一在下' }],
      description: '阶段卡片是上下交错还是统一排在轨道下方。' },
    { key: 'showTargets', type: 'toggle', label: '目标数字', default: true,
      description: '每个里程碑的资产目标数字。' },
    { key: 'showProgress', type: 'toggle', label: '进度填充', default: true,
      description: '轨道上已完成部分的高亮填充。' },
  ],
};

export { SlideJourney };
export const META = SlideJourney.META;
export default SlideJourney;
