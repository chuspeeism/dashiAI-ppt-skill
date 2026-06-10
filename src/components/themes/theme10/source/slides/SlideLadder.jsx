// SlideLadder.jsx — 复利阶梯 / compounding staircase.
// Ascending stepped columns: each year's projected balance rises above the last,
// with a stepped "tread" line tracing the tops so growth reads as a staircase.
// Distinct from SlideWaterfall (signed bridge deltas), DeckBars (flat ranking)
// and any line chart: this is a monotonic compounding climb with per-step CAGR.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.lad-`.
//
// ── Props (canonical list in SlideLadder.META.controls) ───────────────────────
//   stepCount   number 3..7   how many steps (years) to show               (5)
//   showValues  boolean       the balance figure atop each step            (true)
//   showDelta   boolean       the per-step growth chip                     (true)
//   showTread   boolean       the dashed stepped line tracing step tops    (true)
//   focus       boolean       emphasise one step, dim the rest             (false)
//   focusIndex  number 1..7   which step is emphasised (1-based)           (5)
//
// Content props (authored at call-site):
//   overline, title, unit, steps:[{ year, value(number), display, delta }]

import React from 'react';

function SlideLadder({
  overline = '复利轨迹 · COMPOUNDING', title = '让时间替你做最重的活',
  unit = '',
  steps = [
    { year: '第 1 年', value: 132, display: '¥132K', delta: '+5.6%' },
    { year: '第 3 年', value: 205, display: '¥205K', delta: '+15.7% 年化' },
    { year: '第 5 年', value: 318, display: '¥318K', delta: '+18.2% 年化' },
    { year: '第 8 年', value: 512, display: '¥512K', delta: '+19.0% 年化' },
    { year: '第 12 年', value: 760, display: '¥760K', delta: '+18.6% 年化' },
    { year: '第 18 年', value: 1180, display: '¥1.18M', delta: '+18.1% 年化' },
    { year: '第 25 年', value: 1920, display: '¥1.92M', delta: '+17.7% 年化' },
  ],
  stepCount = 5, showValues = true, showDelta = true, showTread = true, focus = false, focusIndex = 5,
}) {
  React.useEffect(() => { ladInjectStyle(); }, []);
  const n = Math.max(3, Math.min(steps.length, stepCount));
  const used = steps.slice(0, n);
  const max = Math.max(...used.map((s) => s.value)) || 1;
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c1)'];
  const heightPct = (v) => 22 + (v / max) * 74; // 22%..96%

  return (
    <div className="lad-root">
      <div className="lad-head">
        <div className="lad-overline">{overline}</div>
        <h2 className="lad-title">{title}</h2>
      </div>

      <div className="lad-stage">
        <div className="lad-plot" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {used.map((s, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const h = heightPct(s.value);
            return (
              <div className={`lad-col ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <div className="lad-bar" style={{ height: `${h}%`,
                  background: `linear-gradient(180deg, color-mix(in srgb, ${HUE[i % HUE.length]} 40%, transparent) 0%, color-mix(in srgb, ${HUE[i % HUE.length]} 9%, transparent) 100%)` }}>
                  <div className="lad-cap" style={{ background: HUE[i % HUE.length], opacity: 1 }} />
                  {showValues && <span className="lad-val" style={hot ? undefined : { color: HUE[i % HUE.length] }}>{s.display}{unit}</span>}
                  {showDelta && s.delta && <span className="lad-delta">{s.delta}</span>}
                </div>
                <span className="lad-year">{s.year}</span>
              </div>
            );
          })}
          {showTread && (
            <svg className="lad-tread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {used.map((s, i) => {
                const colW = 100 / n;
                const x0 = i * colW, x1 = (i + 1) * colW;
                const y = 100 - heightPct(s.value);
                const prevY = i === 0 ? y : 100 - heightPct(used[i - 1].value);
                return (
                  <g key={i}>
                    {i > 0 && <line x1={x0} y1={prevY} x2={x0} y2={y} className="lad-tread-riser" />}
                    <line x1={x0} y1={y} x2={x1} y2={y} className="lad-tread-step" />
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

function ladInjectStyle() {
  if (document.getElementById('lad-style')) return;
  const s = document.createElement('style'); s.id = 'lad-style';
  s.textContent = `
  .lad-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .lad-head{margin-bottom:30px;}
  .lad-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .lad-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .lad-stage{flex:1;min-height:0;display:flex;align-items:stretch;}
  .lad-plot{position:relative;flex:1;display:grid;gap:30px;align-items:end;
    border-bottom:1px solid var(--ds-line,rgba(242,243,246,.16));padding-bottom:0;}
  .lad-col{position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;
    transition:opacity .25s;}
  .lad-col.is-dim{opacity:.32;}
  .lad-bar{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;
    padding:18px 22px;border-radius:10px 10px 0 0;
    background:linear-gradient(180deg, color-mix(in srgb, var(--ds-accent,#6f9bd8) 30%, transparent) 0%,
      color-mix(in srgb, var(--ds-accent,#6f9bd8) 7%, transparent) 100%);}
  .lad-col.is-focus .lad-bar{background:linear-gradient(180deg,
      color-mix(in srgb, var(--ds-accent,#6f9bd8) 62%, transparent) 0%,
      color-mix(in srgb, var(--ds-accent,#6f9bd8) 16%, transparent) 100%);}
  .lad-cap{position:absolute;top:0;left:0;right:0;height:3px;background:var(--ds-accent,#6f9bd8);opacity:.55;}
  .lad-col.is-focus .lad-cap{opacity:1;height:4px;}
  .lad-val{font-size:38px;font-weight:300;font-variant-numeric:tabular-nums;letter-spacing:-.01em;line-height:1;}
  .lad-col.is-focus .lad-val{color:var(--ds-accent,#6f9bd8);}
  .lad-delta{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;margin-top:10px;
    color:var(--ds-muted,rgba(242,243,246,.6));}
  .lad-year{margin-top:20px;font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;text-align:center;
    color:var(--ds-faint,rgba(242,243,246,.5));}
  .lad-col.is-focus .lad-year{color:var(--ds-ink,#f2f3f6);}
  .lad-tread{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
  .lad-tread-step{stroke:var(--ds-accent,#6f9bd8);stroke-width:.5;stroke-dasharray:1.4 1.2;vector-effect:non-scaling-stroke;opacity:.7;}
  .lad-tread-riser{stroke:var(--ds-faint,rgba(242,243,246,.4));stroke-width:.4;stroke-dasharray:1 1;vector-effect:non-scaling-stroke;}
  `;
  document.head.appendChild(s);
}

SlideLadder.META = {
  id: 'ladder', title: '复利阶梯',
  defaults: { stepCount: 5, showValues: true, showDelta: true, showTread: true, focus: false, focusIndex: 5 },
  controls: [
    { key: 'stepCount', type: 'slider', label: '阶梯数量', default: 5, min: 3, max: 7, step: 1,
      description: '展示的年份阶梯数量。' },
    { key: 'showValues', type: 'toggle', label: '阶梯数值', default: true,
      description: '每级阶梯顶部的余额数字。' },
    { key: 'showDelta', type: 'toggle', label: '增长说明', default: true,
      description: '每级下方的年化增长小字。' },
    { key: 'showTread', type: 'toggle', label: '阶梯描线', default: true,
      description: '描出阶梯顶部的虚线踏步轮廓。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一级阶梯，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 5, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideLadder };
export const META = SlideLadder.META;
export default SlideLadder;
