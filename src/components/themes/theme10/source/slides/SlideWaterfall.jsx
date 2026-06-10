// SlideWaterfall.jsx — 收益归因瀑布图 / attribution waterfall chart.
// A start bar, a sequence of +/- contribution bars that "float" at the running
// total, connected by step lines, ending in a total bar. Distinct from DeckBars
// (flat horizontal) and SlideStacked (composition): this shows how a base value
// is bridged to a result. Standalone & migratable: depends only on React.
// CSS scoped under `.wf-`.
//
// ── Props (canonical list in SlideWaterfall.META.controls) ────────────────────
//   barCount      number 3..6   how many contribution steps between start/end (4)
//   focus         boolean       emphasise one step, dim the rest             (false)
//   focusIndex    number 1..6   which step is emphasised (1-based)           (1)
//   showConnectors boolean      the dotted step-connector lines              (true)
//   showValues    boolean       the +/- delta labels on each bar             (true)
//
// Content props (authored at call-site):
//   overline, title, unit, start {label,value}, steps:[{label,delta}], total{label}

import React from 'react';

function SlideWaterfall({
  overline = '收益归因 · ATTRIBUTION', title = '净收益是怎样累积的',
  unit = '%',
  start = { label: '基准回报', value: 4.0 },
  steps = [
    { label: '资产配置', delta: 2.6 },
    { label: '再平衡', delta: 1.8 },
    { label: '税务优化', delta: 0.9 },
    { label: '成本拖累', delta: -0.7 },
    { label: '择时偏差', delta: -0.4 },
    { label: '对冲收益', delta: 1.1 },
  ],
  total = { label: '净收益' },
  barCount = 4, focus = false, focusIndex = 1, showConnectors = true, showValues = true,
}) {
  React.useEffect(() => { wfInjectStyle(); }, []);
  const n = Math.max(3, Math.min(steps.length, barCount));
  const used = steps.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  // Build running totals → bar geometry.
  let run = start.value;
  const bars = [{ kind: 'start', label: start.label, base: 0, top: start.value, value: start.value }];
  used.forEach((st) => {
    const base = st.delta >= 0 ? run : run + st.delta;
    const top = st.delta >= 0 ? run + st.delta : run;
    bars.push({ kind: st.delta >= 0 ? 'up' : 'down', label: st.label, base, top, value: st.delta });
    run += st.delta;
  });
  const endVal = run;
  bars.push({ kind: 'total', label: total.label, base: 0, top: endVal, value: endVal });

  const maxTop = Math.max(...bars.map((b) => b.top), 1);
  const colN = bars.length;

  return (
    <div className="wf-root">
      <div className="wf-head">
        <div className="wf-overline">{overline}</div>
        <h2 className="wf-title">{title}</h2>
      </div>

      <div className="wf-plot" style={{ gridTemplateColumns: `repeat(${colN}, 1fr)` }}>
        {bars.map((b, i) => {
          const stepIdx = i - 1; // -1 for start, n for total
          const isStep = b.kind === 'up' || b.kind === 'down';
          const hot = isStep && stepIdx === fIdx;
          const dim = fIdx >= 0 && isStep && !hot;
          const hPct = ((b.top - b.base) / maxTop) * 100;
          const bottomPct = (b.base / maxTop) * 100;
          const sign = b.value >= 0 ? '+' : '−';
          const disp = b.kind === 'start' || b.kind === 'total'
            ? `${b.value.toFixed(1)}${unit}` : `${sign}${Math.abs(b.value).toFixed(1)}${unit}`;
          return (
            <div className={`wf-col ${b.kind} ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="wf-bararea">
                {showValues && <span className="wf-delta" style={{ bottom: `calc(${bottomPct + hPct}% + 14px)` }}>{disp}</span>}
                <span className="wf-bar" style={{ height: `${hPct}%`, bottom: `${bottomPct}%` }} />
                {showConnectors && i < bars.length - 1 && (
                  <span className="wf-conn" style={{ bottom: `${(b.kind === 'down' ? b.base : b.top) / maxTop * 100}%` }} />
                )}
              </div>
              <span className="wf-label">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function wfInjectStyle() {
  if (document.getElementById('wf-style')) return;
  const s = document.createElement('style'); s.id = 'wf-style';
  s.textContent = `
  .wf-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .wf-head{margin-bottom:28px;}
  .wf-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .wf-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .wf-plot{flex:1;display:grid;align-items:end;gap:40px;min-height:0;padding-top:60px;
    border-bottom:1px solid var(--ds-line,rgba(242,243,246,.16));}
  .wf-col{position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;transition:opacity .25s ease;}
  .wf-bararea{position:relative;flex:1;min-height:0;}
  .wf-bar{position:absolute;left:14%;right:14%;border-radius:4px;background-color:var(--ds-ink,#f2f3f6);opacity:.26;transition:opacity .25s;}
  .wf-col.start .wf-bar{background-color:var(--ds-ink,#f2f3f6);opacity:.82;}
  .wf-col.up .wf-bar{background:linear-gradient(180deg,color-mix(in srgb,var(--ds-c3) 78%,#fff),var(--ds-c3));opacity:.95;}
  .wf-col.total .wf-bar{background:linear-gradient(180deg,color-mix(in srgb,var(--ds-c1) 78%,#fff),var(--ds-c1));opacity:1;}
  .wf-col.down .wf-bar{background:linear-gradient(180deg,color-mix(in srgb,var(--ds-c5) 78%,#fff),var(--ds-c5));opacity:.66;}
  .wf-col.is-focus .wf-bar{opacity:1;background:linear-gradient(180deg,color-mix(in srgb,var(--ds-c1) 78%,#fff),var(--ds-c1));}
  .wf-col.is-dim{opacity:.4;}
  .wf-conn{position:absolute;right:-26px;width:52px;height:0;border-top:1.5px dotted var(--ds-faint,rgba(242,243,246,.4));}
  .wf-delta{position:absolute;left:0;right:0;text-align:center;font-family:var(--font-mono);font-size:25px;
    font-variant-numeric:tabular-nums;color:var(--ds-muted,rgba(242,243,246,.62));}
  .wf-col.up .wf-delta{color:var(--ds-c3);}
  .wf-col.down .wf-delta{color:var(--ds-c5);}
  .wf-col.is-focus .wf-delta{color:var(--ds-c1);font-weight:500;}
  .wf-col.start .wf-delta,.wf-col.total .wf-delta{color:var(--ds-ink,#f2f3f6);}
  .wf-label{margin-top:22px;text-align:center;font-size:25px;font-weight:300;line-height:1.3;
    color:var(--ds-muted,rgba(242,243,246,.7));}
  .wf-col.start .wf-label,.wf-col.total .wf-label{color:var(--ds-ink,#f2f3f6);font-weight:400;}
  `;
  document.head.appendChild(s);
}

SlideWaterfall.META = {
  id: 'waterfall', title: '收益归因瀑布',
  defaults: { barCount: 4, focus: false, focusIndex: 1, showConnectors: true, showValues: true },
  controls: [
    { key: 'barCount', type: 'slider', label: '归因步骤数', default: 4, min: 3, max: 6, step: 1,
      description: '起点与终点之间的归因步骤数量。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一归因步骤。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效（仅作用于中间步骤）。' },
    { key: 'showConnectors', type: 'toggle', label: '台阶连线', default: true,
      description: '相邻柱体之间的虚线台阶连接。' },
    { key: 'showValues', type: 'toggle', label: '增减数值', default: true,
      description: '每根柱体上方的 +/− 数值标签。' },
  ],
};

export { SlideWaterfall };
export const META = SlideWaterfall.META;
export default SlideWaterfall;
