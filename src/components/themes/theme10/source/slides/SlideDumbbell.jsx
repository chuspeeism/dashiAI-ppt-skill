// SlideDumbbell.jsx — 哑铃对比 / before→after dumbbell chart.
// Each row plots two dots on a shared scale — a "before" and an "after" value —
// joined by a connecting barbell, so the SHIFT (re-allocation, repricing) is the
// hero, not the absolute level. A legend names the two series; an optional delta
// column tallies the move. Standalone & migratable: React only. Token-driven.
// CSS scoped under `.dmb-`.
//
// ── Props (canonical list in SlideDumbbell.META.controls) ────────────────────
//   rowCount    number 3..6   how many comparison rows                    (5)
//   showLegend  boolean       the two-series legend (top-right)           (true)
//   showDelta   boolean       the delta column on the right              (true)
//   focus       boolean       emphasise one row, dim the rest            (false)
//   focusIndex  number 1..6   which row is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, series:{from,to}, unit, max, rows:[{label,from,to}]

import React from 'react';

function SlideDumbbell({
  overline = '再平衡 · BEFORE / AFTER', title = '一次再平衡，迁移了什么',
  series = { from: '调整前', to: '调整后' }, unit = '%', max = 100,
  rows = [
    { label: '权益核心', from: 41, to: 56 },
    { label: '长久期债', from: 28, to: 17 },
    { label: '另类对冲', from: 12, to: 24 },
    { label: '黄金敞口', from: 6, to: 14 },
    { label: '现金缓冲', from: 13, to: 7 },
    { label: '新兴市场', from: 9, to: 19 },
  ],
  rowCount = 5, showLegend = true, showDelta = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { dmbInjectStyle(); }, []);
  const n = Math.max(3, Math.min(rows.length, rowCount));
  const data = rows.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const pct = (v) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;

  return (
    <div className="dmb-root">
      <div className="dmb-head">
        <div>
          <div className="dmb-overline">{overline}</div>
          <h2 className="dmb-title">{title}</h2>
        </div>
        {showLegend && (
          <div className="dmb-legend">
            <span className="dmb-lg"><i className="dmb-dot dmb-from" />{series.from}</span>
            <span className="dmb-lg"><i className="dmb-dot dmb-to" />{series.to}</span>
          </div>
        )}
      </div>

      <div className="dmb-rows">
        {data.map((r, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const lo = Math.min(r.from, r.to), hi = Math.max(r.from, r.to);
          const delta = r.to - r.from;
          return (
            <div key={i} className={`dmb-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}>
              <span className="dmb-label">{r.label}</span>
              <span className="dmb-track">
                <span className="dmb-grid" />
                <span className="dmb-bar" style={{ left: pct(lo), right: `calc(100% - ${pct(hi)})` }} />
                <span className="dmb-pt dmb-from" style={{ left: pct(r.from) }}>
                  <span className="dmb-val">{r.from}{unit}</span>
                </span>
                <span className="dmb-pt dmb-to" style={{ left: pct(r.to) }}>
                  <span className="dmb-val">{r.to}{unit}</span>
                </span>
              </span>
              {showDelta && (
                <span className={`dmb-delta ${delta >= 0 ? 'is-up' : 'is-down'}`}>
                  {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}{unit}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function dmbInjectStyle() {
  if (document.getElementById('dmb-style')) return;
  const s = document.createElement('style'); s.id = 'dmb-style';
  s.textContent = `
  .dmb-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);font-family:var(--font-sans);display:flex;flex-direction:column;}
  .dmb-head{display:flex;justify-content:space-between;align-items:flex-start;gap:48px;margin-bottom:60px;}
  .dmb-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .dmb-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.1;letter-spacing:.01em;}
  .dmb-legend{display:flex;gap:34px;flex:0 0 auto;padding-top:10px;}
  .dmb-lg{display:flex;align-items:center;gap:14px;font-family:var(--font-mono);font-size:25px;letter-spacing:.04em;color:var(--ds-muted,rgba(242,243,246,.62));}
  .dmb-dot{width:22px;height:22px;border-radius:50%;flex:0 0 auto;}
  .dmb-dot.dmb-from{background:currentColor;opacity:.42;}
  .dmb-dot.dmb-to{background:var(--ds-accent,#5479e8);}
  .dmb-rows{flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,4vh,48px);}
  .dmb-row{display:flex;align-items:center;gap:40px;transition:opacity .25s ease;}
  .dmb-row.is-dim{opacity:.34;}
  .dmb-label{flex:0 0 280px;font-size:30px;font-weight:300;letter-spacing:.01em;}
  .dmb-track{position:relative;flex:1;height:46px;}
  .dmb-grid{position:absolute;inset:0;border-radius:23px;background:var(--ds-card,rgba(255,255,255,.045));
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.1));}
  .dmb-bar{position:absolute;top:50%;height:8px;transform:translateY(-50%);border-radius:4px;
    background:linear-gradient(90deg,currentColor,var(--ds-accent,#5479e8));opacity:.55;}
  .dmb-pt{position:absolute;top:50%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;}
  .dmb-pt.dmb-from{background:color-mix(in srgb,var(--ds-bg-soft,#16181d) 40%,transparent);
    -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
    box-shadow:0 0 0 4px color-mix(in srgb,currentColor 60%,transparent);z-index:2;}
  .dmb-pt.dmb-to{background:var(--ds-accent,#5479e8);box-shadow:0 0 0 6px rgba(84,121,232,.18);z-index:2;}
  .dmb-val{position:absolute;left:50%;bottom:38px;transform:translateX(-50%);font-family:var(--font-mono);
    font-size:24px;font-variant-numeric:tabular-nums;letter-spacing:.02em;white-space:nowrap;color:var(--ds-muted,rgba(242,243,246,.7));}
  .dmb-pt.dmb-to .dmb-val{color:var(--ds-accent,#5479e8);bottom:auto;top:38px;}
  .dmb-row.is-focus .dmb-pt.dmb-to{box-shadow:0 0 0 6px rgba(84,121,232,.2),0 0 0 14px rgba(84,121,232,.08);}
  .dmb-row.is-focus .dmb-label{color:var(--ds-accent,#5479e8);}
  .dmb-delta{flex:0 0 150px;text-align:right;font-family:var(--font-mono);font-size:28px;
    font-variant-numeric:tabular-nums;letter-spacing:.02em;}
  .dmb-delta.is-up{color:var(--ds-accent,#5479e8);}
  .dmb-delta.is-down{color:var(--ds-muted,rgba(242,243,246,.5));}
  `;
  document.head.appendChild(s);
}

SlideDumbbell.META = {
  id: 'dumbbell', title: '哑铃对比',
  defaults: { rowCount: 5, showLegend: true, showDelta: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'rowCount', type: 'slider', label: '对比行数', default: 5, min: 3, max: 6, step: 1,
      description: '绘制的「前→后」对比行数量。' },
    { key: 'showLegend', type: 'toggle', label: '系列图例', default: true,
      description: '右上角的两系列（调整前 / 调整后）图例。' },
    { key: 'showDelta', type: 'toggle', label: '变化列', default: true,
      description: '右侧的增减幅度列。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一行，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几行', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideDumbbell };
export const META = SlideDumbbell.META;
export default SlideDumbbell;
