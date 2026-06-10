// SlideMeter.jsx — 半环量规 / a row of semicircle KPI gauges.
// Each gauge is a 180° arc with a value sweep, a big number in the well and a
// label beneath; an optional delta chip shows movement. Distinct from
// SlideDonut (full rings) and SlideGoals (linear bars): these are dashboard-
// style dials read at a glance. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.mtr-`.
//
// ── Props (canonical list in SlideMeter.META.controls) ────────────────────────
//   gaugeCount  number 2..5   how many dials                              (4)
//   showTrack   boolean       the faint full-arc track behind the value   (true)
//   showDelta   boolean       the change chip under each value            (true)
//   showScale   boolean       the 0 / max end ticks                       (true)
//   focus       boolean       emphasise one dial, dim the rest            (false)
//   focusIndex  number 1..5   which dial is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, gauges:[{ label, value, max, unit, delta }]

import React from 'react';

function SlideMeter({
  overline = '关键指标 · DIALS', title = '一眼看清健康度',
  gauges = [
    { label: '年化回报', value: 12.4, max: 20, unit: '%', delta: '+1.8' },
    { label: '夏普比率', value: 1.7, max: 3, unit: '', delta: '+0.3' },
    { label: '最大回撤', value: 8.2, max: 30, unit: '%', delta: '-2.1' },
    { label: '胜率', value: 64, max: 100, unit: '%', delta: '+5' },
    { label: '波动率', value: 9.6, max: 25, unit: '%', delta: '-0.7' },
  ],
  gaugeCount = 4, showTrack = true, showDelta = true, showScale = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { mtrInjectStyle(); }, []);
  const n = Math.max(2, Math.min(gauges.length, gaugeCount));
  const used = gauges.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c6)', 'var(--ds-c2)'];

  // semicircle arc geometry
  const R = 130, cx = 160, cy = 160;
  const arc = (frac) => {
    // semicircle: 0 frac = left end (180°), 1 = right end (0°), sweeping over the top
    const sx = cx + R * Math.cos(Math.PI);
    const sy = cy - R * Math.sin(Math.PI);
    const ex = cx + R * Math.cos(Math.PI - frac * Math.PI);
    const ey = cy - R * Math.sin(Math.PI - frac * Math.PI);
    const large = 0; // value sweep is always ≤180° → minor arc
    return `M${sx.toFixed(1)} ${sy.toFixed(1)} A${R} ${R} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };
  const fullTrack = `M${cx - R} ${cy} A${R} ${R} 0 1 1 ${cx + R} ${cy}`;

  return (
    <div className="mtr-root">
      <div className="mtr-head">
        <div className="mtr-overline">{overline}</div>
        <h2 className="mtr-title">{title}</h2>
      </div>

      <div className="mtr-row" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {used.map((g, i) => {
          const frac = Math.max(0, Math.min(1, g.value / (g.max || 1)));
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const up = String(g.delta || '').trim().startsWith('+');
          return (
            <div className={`mtr-cell ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="mtr-gauge">
                <svg viewBox="0 0 320 200" width="100%">
                  {showTrack && <path d={fullTrack} className="mtr-track" fill="none" />}
                  <path d={arc(frac)} className="mtr-fill" fill="none" style={{ stroke: HUE[i % HUE.length] }} />
                  <circle cx={cx + R * Math.cos(Math.PI - frac * Math.PI)}
                          cy={cy - R * Math.sin(Math.PI - frac * Math.PI)} r="9" className="mtr-knob" style={{ stroke: HUE[i % HUE.length] }} />
                  <text x="160" y="128" className="mtr-val" textAnchor="middle">{g.value}<tspan className="mtr-unit" dy="-14">{g.unit}</tspan></text>
                  {showDelta && g.delta != null && (
                    <text x="160" y="156" className={`mtr-delta ${up ? 'up' : 'down'}`} textAnchor="middle">{up ? '▲' : '▼'} {String(g.delta).replace(/^[+\-]/, '')}</text>
                  )}
                  {showScale && (
                    <>
                      <text x="30" y="196" className="mtr-scale-t" textAnchor="middle">0</text>
                      <text x="290" y="196" className="mtr-scale-t" textAnchor="middle">{g.max}{g.unit}</text>
                    </>
                  )}
                </svg>
              </div>
              <div className="mtr-label">{g.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function mtrInjectStyle() {
  if (document.getElementById('mtr-style')) return;
  const s = document.createElement('style'); s.id = 'mtr-style';
  s.textContent = `
  .mtr-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .mtr-head{margin-bottom:20px;}
  .mtr-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .mtr-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .mtr-row{flex:1;min-height:0;display:grid;gap:40px;align-items:center;}
  .mtr-cell{display:flex;flex-direction:column;align-items:center;gap:20px;transition:opacity .25s ease;}
  .mtr-cell.is-dim{opacity:.34;}
  .mtr-gauge{position:relative;width:100%;max-width:330px;}
  .mtr-track{stroke:currentColor;stroke-opacity:.13;stroke-width:22;stroke-linecap:round;}
  .mtr-fill{stroke:var(--ds-accent-2,#8fa8e6);stroke-width:22;stroke-linecap:round;
    transition:stroke .25s ease;}
  .mtr-cell.is-focus .mtr-fill{stroke:var(--ds-accent,#5479e8);}
  .mtr-knob{fill:var(--ds-bg-soft,#16181d);stroke:var(--ds-accent-2,#8fa8e6);stroke-width:5;}
  .mtr-cell.is-focus .mtr-knob{stroke:var(--ds-accent,#5479e8);}
  .mtr-val{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);font-size:54px;font-weight:300;font-variant-numeric:tabular-nums;}
  .mtr-cell.is-focus .mtr-val{fill:var(--ds-accent,#5479e8);}
  .mtr-unit{fill:var(--ds-muted,rgba(242,243,246,.6));font-size:24px;}
  .mtr-delta{font-family:var(--font-mono);font-size:18px;}
  .mtr-delta.up{fill:var(--ds-c3);}
  .mtr-delta.down{fill:var(--ds-c5);}
  .mtr-scale-t{font-family:var(--font-mono);font-size:16px;fill:var(--ds-faint,rgba(242,243,246,.4));}
  .mtr-label{font-family:var(--font-mono);font-size:26px;letter-spacing:.06em;color:var(--ds-muted,rgba(242,243,246,.66));}
  `;
  document.head.appendChild(s);
}

SlideMeter.META = {
  id: 'meter', title: '半环量规',
  defaults: { gaugeCount: 4, showTrack: true, showDelta: true, showScale: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'gaugeCount', type: 'slider', label: '量规数量', default: 4, min: 2, max: 5, step: 1,
      description: '一排半环仪表的数量。' },
    { key: 'showTrack', type: 'toggle', label: '底环轨道', default: true,
      description: '数值弧背后的淡色满弧轨道。' },
    { key: 'showDelta', type: 'toggle', label: '变化量', default: true,
      description: '数值下方的升降变化标签。' },
    { key: 'showScale', type: 'toggle', label: '量程刻度', default: true,
      description: '弧两端的 0 / 上限刻度。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一仪表，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideMeter };
export const META = SlideMeter.META;
export default SlideMeter;
