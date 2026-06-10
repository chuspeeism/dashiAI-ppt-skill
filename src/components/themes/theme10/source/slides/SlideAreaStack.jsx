// SlideAreaStack.jsx — 堆叠面积 / portfolio composition over time.
// Several series stacked into bands that grow over the x-axis, showing how the
// MIX shifts as the total grows. Distinct from SlideCurve (single line),
// SlideStacked (discrete bars) and SlideTreemap (one snapshot): this is
// composition-through-time. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.ast-`.
//
// ── Props (canonical list in SlideAreaStack.META.controls) ────────────────────
//   seriesCount  number 2..5   how many stacked bands                      (4)
//   showLegend   boolean       the legend row                             (true)
//   showGrid     boolean       horizontal grid lines                      (true)
//   showAxis     boolean       x-axis period labels                       (true)
//   normalized   boolean       100%-stacked (share) vs absolute           (false)
//
// Content props (authored at call-site):
//   overline, title, xLabels:[string],
//   series:[{ name, data:[number] }]  (outer→inner = bottom→top of stack)

import React from 'react';

function SlideAreaStack({
  overline = '配置演变 · MIX OVER TIME', title = '组合是怎样随时间长成的',
  xLabels = ['第1年', '第3年', '第6年', '第9年', '第12年', '第15年', '今天'],
  series = [
    { name: '全球股票', data: [60, 100, 150, 210, 280, 350, 430] },
    { name: '固定收益', data: [30, 48, 70, 95, 120, 150, 180] },
    { name: '另类对冲', data: [6, 14, 26, 44, 66, 92, 120] },
    { name: '实物资产', data: [4, 10, 18, 30, 46, 64, 84] },
    { name: '现金等价', data: [2, 5, 9, 14, 20, 28, 36] },
  ],
  seriesCount = 4, showLegend = true, showGrid = true, showAxis = true, normalized = false,
}) {
  React.useEffect(() => { astInjectStyle(); }, []);
  const sc = Math.max(2, Math.min(series.length, seriesCount));
  const used = series.slice(0, sc);
  const m = used[0].data.length;
  const W = 1000, H = 520, padB = 4, padT = 8;

  // cumulative stacks
  const totals = Array.from({ length: m }, (_, i) => used.reduce((a, s) => a + s.data[i], 0));
  const maxTotal = Math.max(...totals) || 1;
  const X = (i) => (i / (m - 1)) * W;
  const yOf = (v, i) => {
    const denom = normalized ? totals[i] : maxTotal;
    return padT + (1 - v / denom) * (H - padT - padB);
  };

  // build cumulative upper edges
  let cum = Array(m).fill(0);
  const bands = used.map((s) => {
    const lower = cum.slice();
    cum = cum.map((c, i) => c + s.data[i]);
    const upper = cum.slice();
    const top = upper.map((v, i) => `${X(i).toFixed(1)},${yOf(v, i).toFixed(1)}`);
    const bot = lower.map((v, i) => `${X(i).toFixed(1)},${yOf(v, i).toFixed(1)}`).reverse();
    return { name: s.name, path: `M${top.join(' L')} L${bot.join(' L')} Z` };
  });

  const RAMP = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c6)'];
  const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => padT + t * (H - padT - padB));

  return (
    <div className="ast-root">
      <div className="ast-head">
        <div className="ast-topline">
          <div>
            <div className="ast-overline">{overline}</div>
            <h2 className="ast-title">{title}</h2>
          </div>
          {showLegend && (
            <ul className="ast-legend">
              {used.map((s, i) => (
                <li key={i}><span className="ast-key" style={{ background: RAMP[i] }} />{s.name}</li>
              )).reverse()}
            </ul>
          )}
        </div>
      </div>

      <div className="ast-stage">
        <svg className="ast-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            {used.map((s, i) => (
              <linearGradient key={i} id={`astGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" style={{ stopColor: RAMP[i] }} />
                <stop offset="100%" style={{ stopColor: `color-mix(in srgb, ${RAMP[i]} 55%, #000)` }} />
              </linearGradient>
            ))}
          </defs>
          {showGrid && gridY.map((gy, i) => <line key={i} x1={0} y1={gy} x2={W} y2={gy} className="ast-grid" />)}
          {bands.map((b, i) => <path key={i} d={b.path} style={{ fill: `url(#astGrad${i})` }} className="ast-band" />)}
        </svg>
        {showAxis && (
          <div className="ast-axis">
            {xLabels.slice(0, m).map((l, i) => (
              <span key={i} className="ast-axis-x" style={{ left: `${(X(i) / W) * 100}%` }}>{l}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function astInjectStyle() {
  if (document.getElementById('ast-style')) return;
  const s = document.createElement('style'); s.id = 'ast-style';
  s.textContent = `
  .ast-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .ast-head{margin-bottom:26px;}
  .ast-topline{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;}
  .ast-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ast-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .ast-legend{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:14px 28px;justify-content:flex-end;max-width:640px;}
  .ast-legend li{display:flex;align-items:center;gap:11px;font-size:25px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.7));}
  .ast-key{width:18px;height:18px;border-radius:4px;display:inline-block;}
  .ast-stage{position:relative;flex:1;min-height:0;padding-bottom:44px;}
  .ast-svg{position:absolute;inset:0;width:100%;height:calc(100% - 44px);overflow:visible;}
  .ast-grid{stroke:var(--ds-line,rgba(242,243,246,.1));stroke-width:1;vector-effect:non-scaling-stroke;}
  .ast-band{stroke:var(--ds-bg,#0d0e11);stroke-width:1.5;vector-effect:non-scaling-stroke;}
  .ast-axis{position:absolute;left:0;right:0;bottom:0;height:40px;}
  .ast-axis-x{position:absolute;bottom:0;transform:translateX(-50%);font-family:var(--font-mono);font-size:24px;
    letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.46));white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

SlideAreaStack.META = {
  id: 'areastack', title: '堆叠面积',
  defaults: { seriesCount: 4, showLegend: true, showGrid: true, showAxis: true, normalized: false },
  controls: [
    { key: 'seriesCount', type: 'slider', label: '系列数量', default: 4, min: 2, max: 5, step: 1,
      description: '堆叠的资产类别条带数量。' },
    { key: 'normalized', type: 'toggle', label: '百分比堆叠', default: false,
      description: '开启则铺满为 100% 占比视图，关闭为绝对金额。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '右上角的系列图例。' },
    { key: 'showGrid', type: 'toggle', label: '网格线', default: true,
      description: '横向参考网格。' },
    { key: 'showAxis', type: 'toggle', label: '时间轴', default: true,
      description: '底部的周期标签。' },
  ],
};

export { SlideAreaStack };
export const META = SlideAreaStack.META;
export default SlideAreaStack;
