// SlideDiverging.jsx — 年度盈亏 / diverging +/− bars around a zero axis.
// One bar per period growing up (gain) or down (loss) from a central zero line;
// gains take the accent, losses a muted tone, each labelled with its value and
// period. Distinct from SlideWaterfall (cumulative bridge) and SlideStacked
// (composition): independent signed values per period. Standalone & migratable:
// depends only on React (imported). Token-driven. CSS scoped under `.dvg-`.
//
// ── Props (canonical list in SlideDiverging.META.controls) ────────────────────
//   barCount    number 4..10   how many periods                            (8)
//   showValues  boolean        the value label on each bar                 (true)
//   showAvg     boolean        a dashed average line                       (false)
//   showAxis    boolean        the zero baseline                           (true)
//   focus       boolean        emphasise one bar, dim the rest             (false)
//   focusIndex  number 1..10   which bar is emphasised (1-based)           (1)
//
// Content props (authored at call-site):
//   overline, title, unit, bars:[{ label, value(number, +/−) }]

import React from 'react';

function SlideDiverging({
  overline = '年度盈亏 · ANNUAL P&L', title = '有起有落，长期向上',
  unit = '%',
  bars = [
    { label: '17', value: 12.4 }, { label: '18', value: -4.1 }, { label: '19', value: 18.7 },
    { label: '20', value: 9.2 }, { label: '21', value: 14.6 }, { label: '22', value: -8.3 },
    { label: '23', value: 11.1 }, { label: '24', value: 16.9 }, { label: '25', value: 7.5 },
    { label: '26', value: 10.4 },
  ],
  barCount = 8, showValues = true, showAvg = false, showAxis = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { dvgInjectStyle(); }, []);
  const n = Math.max(4, Math.min(bars.length, barCount));
  const used = bars.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const maxAbs = Math.max(...used.map((b) => Math.abs(b.value))) || 1;
  const avg = used.reduce((a, b) => a + b.value, 0) / n;
  const half = (v) => (Math.abs(v) / maxAbs) * 50; // % of plot half-height

  return (
    <div className="dvg-root">
      <div className="dvg-head">
        <div className="dvg-overline">{overline}</div>
        <h2 className="dvg-title">{title}</h2>
      </div>

      <div className="dvg-stage">
        <div className="dvg-plot" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {showAxis && <div className="dvg-zero" />}
          {showAvg && (
            <div className="dvg-avg" style={{ top: `${50 - (avg / maxAbs) * 50}%` }}>
              <span className="dvg-avg-tag">均值 {avg > 0 ? '+' : ''}{avg.toFixed(1)}{unit}</span>
            </div>
          )}
          {used.map((b, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const pos = b.value >= 0;
            const h = half(b.value);
            return (
              <div className={`dvg-col ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <div className={`dvg-bar ${pos ? 'is-pos' : 'is-neg'}`}
                     style={pos ? { bottom: '50%', height: `${h}%` } : { top: '50%', height: `${h}%` }}>
                  {showValues && (
                    <span className={`dvg-val ${pos ? 'above' : 'below'}`}>
                      {pos ? '+' : '−'}{Math.abs(b.value)}{unit}
                    </span>
                  )}
                </div>
                <span className="dvg-xlab">’{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function dvgInjectStyle() {
  if (document.getElementById('dvg-style')) return;
  const s = document.createElement('style'); s.id = 'dvg-style';
  s.textContent = `
  .dvg-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .dvg-head{margin-bottom:30px;}
  .dvg-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .dvg-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .dvg-stage{flex:1;min-height:0;display:flex;align-items:stretch;padding-bottom:44px;}
  .dvg-plot{position:relative;flex:1;display:grid;gap:34px;align-items:stretch;}
  .dvg-zero{position:absolute;left:0;right:0;top:50%;height:1.5px;background:var(--ds-line,rgba(242,243,246,.28));z-index:1;}
  .dvg-avg{position:absolute;left:0;right:0;height:0;border-top:1.5px dashed color-mix(in srgb,var(--ds-accent,#6f9bd8) 70%,transparent);z-index:2;}
  .dvg-avg-tag{position:absolute;right:0;top:-30px;font-family:var(--font-mono);font-size:24px;
    color:var(--ds-accent,#6f9bd8);letter-spacing:.04em;}
  .dvg-col{position:relative;height:100%;}
  .dvg-col.is-dim{opacity:.32;}
  .dvg-bar{position:absolute;left:8%;right:8%;border-radius:6px;transition:opacity .25s;}
  .dvg-bar.is-pos{background:linear-gradient(0deg, color-mix(in srgb,var(--ds-c3) 32%,transparent),
    color-mix(in srgb,var(--ds-c3) 92%,transparent));border-radius:6px 6px 0 0;}
  .dvg-bar.is-neg{background:linear-gradient(180deg, color-mix(in srgb,var(--ds-c5) 88%,transparent),
    color-mix(in srgb,var(--ds-c5) 30%,transparent));border-radius:0 0 6px 6px;}
  .dvg-col.is-focus .dvg-bar.is-pos{background:var(--ds-c3);}
  .dvg-col.is-focus .dvg-bar.is-neg{background:var(--ds-c5);}
  .dvg-val{position:absolute;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:24px;
    font-variant-numeric:tabular-nums;white-space:nowrap;}
  .dvg-val.above{bottom:100%;margin-bottom:12px;color:var(--ds-ink,#f2f3f6);}
  .dvg-val.below{top:100%;margin-top:12px;color:var(--ds-c5);}
  .dvg-xlab{position:absolute;left:50%;transform:translateX(-50%);bottom:-44px;font-family:var(--font-mono);
    font-size:24px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.5));}
  `;
  document.head.appendChild(s);
}

SlideDiverging.META = {
  id: 'diverging', title: '年度盈亏',
  defaults: { barCount: 8, showValues: true, showAvg: false, showAxis: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'barCount', type: 'slider', label: '周期数量', default: 8, min: 4, max: 10, step: 1,
      description: '展示的年份 / 周期数量。' },
    { key: 'showValues', type: 'toggle', label: '数值标签', default: true,
      description: '每根柱体端部的盈亏数值。' },
    { key: 'showAvg', type: 'toggle', label: '均值线', default: false,
      description: '跨周期的平均值虚线。' },
    { key: 'showAxis', type: 'toggle', label: '零轴', default: true,
      description: '中间的零值基准线。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一根柱体，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 10, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideDiverging };
export const META = SlideDiverging.META;
export default SlideDiverging;
