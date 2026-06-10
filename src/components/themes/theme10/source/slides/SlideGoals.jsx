// SlideGoals.jsx — 目标进度 / linear goal-funding progress bars.
// A stacked list of life goals, each a row with a label, a long progress track
// filled to its funded share, the funded/target figures and an ETA note.
// Distinct from SlideSpark (sparklines), SlideStacked (composition) and any
// table: this reads as "how close is each goal". Standalone & migratable:
// depends only on React (imported). Token-driven. CSS scoped under `.goal-`.
//
// ── Props (canonical list in SlideGoals.META.controls) ────────────────────────
//   goalCount    number 2..5   how many goal rows                          (4)
//   showFigures  boolean       the funded / target figures                 (true)
//   showPercent  boolean       the big % on the right                      (true)
//   showNote     boolean       the ETA / remaining note                    (true)
//   focus        boolean       emphasise one goal, dim the rest            (false)
//   focusIndex   number 1..5   which goal is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, goals:[{ label, current, target, pct(0..100), note }]

import React from 'react';

function SlideGoals({
  overline = '目标进度 · ON TRACK', title = '每个目标，离达成还有多远',
  goals = [
    { label: '退休自由', current: '¥1.25M', target: '¥3.0M', pct: 42, note: '预计 11 年达成' },
    { label: '子女教育', current: '¥480K', target: '¥600K', pct: 80, note: '预计 3 年达成' },
    { label: '换房首付', current: '¥620K', target: '¥800K', pct: 78, note: '预计 2 年达成' },
    { label: '应急储备', current: '¥180K', target: '¥180K', pct: 100, note: '已覆盖 6 个月开支' },
    { label: '环球旅居', current: '¥90K', target: '¥300K', pct: 30, note: '预计 6 年达成' },
  ],
  goalCount = 4, showFigures = true, showPercent = true, showNote = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { goalInjectStyle(); }, []);
  const n = Math.max(2, Math.min(goals.length, goalCount));
  const used = goals.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="goal-root">
      <div className="goal-head">
        <div className="goal-overline">{overline}</div>
        <h2 className="goal-title">{title}</h2>
      </div>

      <div className="goal-list">
        {used.map((g, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const pct = Math.max(0, Math.min(100, g.pct));
          const done = pct >= 100;
          return (
            <div className={`goal-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''} ${done ? 'is-done' : ''}`} key={i}>
              <div className="goal-meta">
                <span className="goal-label">{g.label}</span>
                {showNote && <span className="goal-note">{done ? '已达成 · ' : ''}{g.note}</span>}
              </div>
              <div className="goal-bar">
                <div className="goal-track">
                  <div className="goal-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, color-mix(in srgb, ${['var(--ds-c1)','var(--ds-c4)','var(--ds-c3)','var(--ds-c6)','var(--ds-c2)'][i % 5]} 55%,#fff), ${['var(--ds-c1)','var(--ds-c4)','var(--ds-c3)','var(--ds-c6)','var(--ds-c2)'][i % 5]})` }} />
                </div>
                {showFigures && (
                  <div className="goal-fig">
                    <span className="goal-cur">{g.current}</span>
                    <span className="goal-tgt">/ {g.target}</span>
                  </div>
                )}
              </div>
              {showPercent && <div className="goal-pct">{pct}<span className="goal-pct-u">%</span></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function goalInjectStyle() {
  if (document.getElementById('goal-style')) return;
  const s = document.createElement('style'); s.id = 'goal-style';
  s.textContent = `
  .goal-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .goal-head{margin-bottom:30px;}
  .goal-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .goal-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .goal-list{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:18px;}
  .goal-row{display:grid;grid-template-columns:300px 1fr 168px;align-items:center;gap:48px;
    padding:22px 0;border-top:1px solid var(--ds-line,rgba(242,243,246,.13));transition:opacity .25s;}
  .goal-row:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .goal-row.is-dim{opacity:.34;}
  .goal-meta{display:flex;flex-direction:column;gap:8px;}
  .goal-label{font-size:34px;font-weight:300;}
  .goal-row.is-focus .goal-label{color:var(--ds-accent,#6f9bd8);}
  .goal-note{font-family:var(--font-mono);font-size:24px;letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .goal-bar{display:flex;flex-direction:column;gap:14px;}
  .goal-track{position:relative;height:14px;border-radius:8px;overflow:hidden;
    background:color-mix(in srgb, var(--ds-ink,#f2f3f6) 8%, transparent);}
  .goal-fill{position:absolute;left:0;top:0;bottom:0;border-radius:8px;
    background:linear-gradient(90deg, color-mix(in srgb,var(--ds-accent,#6f9bd8) 70%,transparent), var(--ds-accent,#6f9bd8));}
  .goal-row.is-done .goal-fill{background:var(--ds-accent,#6f9bd8);
    box-shadow:0 0 18px color-mix(in srgb,var(--ds-accent,#6f9bd8) 55%,transparent);}
  .goal-fig{display:flex;align-items:baseline;gap:10px;}
  .goal-cur{font-family:var(--font-mono);font-size:26px;font-variant-numeric:tabular-nums;color:var(--ds-ink,#f2f3f6);}
  .goal-tgt{font-family:var(--font-mono);font-size:24px;font-variant-numeric:tabular-nums;color:var(--ds-faint,rgba(242,243,246,.5));}
  .goal-pct{justify-self:end;font-size:62px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;letter-spacing:-.02em;}
  .goal-row.is-done .goal-pct,.goal-row.is-focus .goal-pct{color:var(--ds-accent,#6f9bd8);}
  .goal-pct-u{font-size:30px;margin-left:3px;color:var(--ds-faint,rgba(242,243,246,.5));}
  `;
  document.head.appendChild(s);
}

SlideGoals.META = {
  id: 'goals', title: '目标进度',
  defaults: { goalCount: 4, showFigures: true, showPercent: true, showNote: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'goalCount', type: 'slider', label: '目标数量', default: 4, min: 2, max: 5, step: 1,
      description: '展示的目标行数。' },
    { key: 'showFigures', type: 'toggle', label: '金额数字', default: true,
      description: '进度条下方的已投 / 目标金额。' },
    { key: 'showPercent', type: 'toggle', label: '百分比', default: true,
      description: '右侧的大号完成百分比。' },
    { key: 'showNote', type: 'toggle', label: '预计说明', default: true,
      description: '目标名称下方的达成预计 / 备注。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一目标，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideGoals };
export const META = SlideGoals.META;
export default SlideGoals;
