// SlideRange.jsx — 区间对比 / dumbbell range bars.
// One row per category showing a span between a low and a high marker (e.g.
// worst-year vs best-year, or downside vs upside), with a dot for the expected/
// typical value on the connecting track. Distinct from diverging bars, bullet
// and box-less charts: this encodes a RANGE per item. Standalone & migratable:
// depends only on React (imported). Token-driven. CSS scoped under `.rng-`.
//
// ── Props (canonical list in SlideRange.META.controls) ────────────────────────
//   rowCount    number 3..7   how many category rows                       (5)
//   showExpect  boolean       the expected/typical dot on the track        (true)
//   showEnds    boolean       the low / high value labels                  (true)
//   showScale   boolean       the axis scale ticks                         (true)
//   focus       boolean       emphasise one row, dim the rest              (false)
//   focusIndex  number 1..7   which row is emphasised (1-based)            (1)
//
// Content props (authored at call-site):
//   overline, title, unit, axisMin, axisMax, scaleTicks:[number],
//   rows:[{ label, low(number), high(number), expect(number) }]

import React from 'react';

function SlideRange({
  overline = '波动区间 · RANGE OF OUTCOMES', title = '每类资产，最坏到最好',
  unit = '%', axisMin = -25, axisMax = 40, scaleTicks = [-25, 0, 15, 40],
  rows = [
    { label: '全球股票', low: -18, high: 34, expect: 9 },
    { label: '另类对冲', low: -7, high: 19, expect: 7 },
    { label: '实物资产', low: -10, high: 22, expect: 5 },
    { label: '固定收益', low: -4, high: 11, expect: 4 },
    { label: '现金等价', low: 0, high: 3, expect: 1 },
    { label: '海外成长', low: -22, high: 38, expect: 11 },
    { label: '私募股权', low: -15, high: 30, expect: 13 },
  ],
  rowCount = 5, showExpect = true, showEnds = true, showScale = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { rngInjectStyle(); }, []);
  const n = Math.max(3, Math.min(rows.length, rowCount));
  const used = rows.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const span = (axisMax - axisMin) || 1;
  const pos = (v) => ((v - axisMin) / span) * 100;
  const zero = pos(0);

  return (
    <div className="rng-root">
      <div className="rng-head">
        <div className="rng-overline">{overline}</div>
        <h2 className="rng-title">{title}</h2>
      </div>

      <div className="rng-stage">
        <div className="rng-list">
          {used.map((r, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const lo = pos(r.low), hi = pos(r.high);
            const hue = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c6)', 'var(--ds-c2)', 'var(--ds-c5)', 'var(--ds-c1)'][i % 7];
            return (
              <div className={`rng-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <span className="rng-label">{r.label}</span>
                <div className="rng-track">
                  <div className="rng-baseline" />
                  {axisMin < 0 && axisMax > 0 && <div className="rng-zero" style={{ left: `${zero}%` }} />}
                  <div className="rng-span" style={{ left: `${lo}%`, width: `${hi - lo}%`, background: `linear-gradient(90deg, color-mix(in srgb, ${hue} 30%, transparent), ${hue})` }} />
                  <div className="rng-end rng-lo" style={{ left: `${lo}%`, boxShadow: `inset 0 0 0 2.5px ${hue}` }}>
                    {showEnds && <span className="rng-endlab below">{r.low > 0 ? '+' : ''}{r.low}{unit}</span>}
                  </div>
                  <div className="rng-end rng-hi" style={{ left: `${hi}%`, background: hue }}>
                    {showEnds && <span className="rng-endlab below">{r.high > 0 ? '+' : ''}{r.high}{unit}</span>}
                  </div>
                  {showExpect && (
                    <div className="rng-expect" style={{ left: `${pos(r.expect)}%` }}>
                      <span className="rng-expectlab">{r.expect > 0 ? '+' : ''}{r.expect}{unit}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {showScale && (
          <div className="rng-scale">
            {scaleTicks.map((t, i) => (
              <span key={i} className="rng-tick" style={{ left: `${pos(t)}%` }}>{t > 0 ? '+' : ''}{t}{unit}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function rngInjectStyle() {
  if (document.getElementById('rng-style')) return;
  const s = document.createElement('style'); s.id = 'rng-style';
  s.textContent = `
  .rng-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .rng-head{margin-bottom:30px;}
  .rng-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .rng-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .rng-stage{flex:1;min-height:0;display:flex;flex-direction:column;}
  .rng-list{flex:1;display:flex;flex-direction:column;justify-content:center;gap:30px;}
  .rng-row{display:grid;grid-template-columns:280px 1fr;align-items:center;gap:48px;transition:opacity .25s;}
  .rng-row.is-dim{opacity:.34;}
  .rng-label{font-size:32px;font-weight:300;}
  .rng-row.is-focus .rng-label{color:var(--ds-accent,#6f9bd8);}
  .rng-track{position:relative;height:50px;}
  .rng-baseline{position:absolute;left:0;right:0;top:50%;height:2px;transform:translateY(-50%);
    background:var(--ds-line,rgba(242,243,246,.14));}
  .rng-zero{position:absolute;top:6px;bottom:6px;width:1.5px;background:var(--ds-line,rgba(242,243,246,.3));}
  .rng-span{position:absolute;top:50%;height:8px;transform:translateY(-50%);border-radius:6px;
    background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 42%,transparent);}
  .rng-row.is-focus .rng-span{background:var(--ds-accent,#6f9bd8);}
  .rng-end{position:absolute;top:50%;width:15px;height:15px;border-radius:50%;transform:translate(-50%,-50%);
    background:var(--ds-bg,#0d0e11);box-shadow:inset 0 0 0 2.5px var(--ds-accent,#6f9bd8);}
  .rng-hi{background:var(--ds-accent,#6f9bd8);box-shadow:none;}
  .rng-endlab{position:absolute;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:24px;
    font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ds-muted,rgba(242,243,246,.62));}
  .rng-endlab.below{top:22px;}
  .rng-expect{position:absolute;top:50%;width:3px;height:26px;transform:translate(-50%,-50%);
    background:var(--ds-ink,#f2f3f6);border-radius:2px;}
  .rng-expectlab{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);font-family:var(--font-mono);
    font-size:24px;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ds-ink,#f2f3f6);}
  .rng-scale{position:relative;height:40px;margin-top:14px;margin-left:328px;}
  .rng-tick{position:absolute;top:0;transform:translateX(-50%);font-family:var(--font-mono);font-size:24px;
    letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.46));white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

SlideRange.META = {
  id: 'range', title: '区间对比',
  defaults: { rowCount: 5, showExpect: true, showEnds: true, showScale: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'rowCount', type: 'slider', label: '类别行数', default: 5, min: 3, max: 7, step: 1,
      description: '展示的资产类别行数。' },
    { key: 'showExpect', type: 'toggle', label: '预期值', default: true,
      description: '区间轨道上的预期 / 典型值标记。' },
    { key: 'showEnds', type: 'toggle', label: '端点数值', default: true,
      description: '区间两端的最低 / 最高数值。' },
    { key: 'showScale', type: 'toggle', label: '刻度轴', default: true,
      description: '底部的刻度参考。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一行，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideRange };
export const META = SlideRange.META;
export default SlideRange;
