// SlideRadialStack.jsx — 同心环 / concentric "race-track" progress rings.
// Nested rings sharing one centre, each a single metric's percent drawn as an
// arc over a faint full-circle track. Reads several rates at a glance against a
// common 0–100 scale. Distinct from SlideDonut (one whole split into segments),
// SlideMeter (a single half-gauge) and SlideRadar (a spoked polygon). Standalone
// & migratable: depends only on React (imported). Token-driven, light/dark tone
// applies. All variation via props; copy authored in markup. CSS scoped `.rds-`.
//
// ── Props (canonical list in SlideRadialStack.META.controls) ──────────────────
//   ringCount    number 3..5   how many concentric rings                  (4)
//   showTrack    boolean       the faint 100% background track            (true)
//   showCenter   boolean       the headline figure at the centre          (true)
//   showLegend   boolean       the side legend with name + value          (true)
//   focus        boolean       emphasise one ring, dim the rest           (false)
//   focusIndex   number 1..5   which ring is emphasised (1-based, outer→in)(1)
//
// Content props (authored at call-site):
//   overline, title, center:{value,label}, rings:[{ name, value, note }] (value 0..100)

import React from 'react';

function SlideRadialStack({
  overline = '运作健康度 · ON A 0–100 SCALE',
  title = '一眼看清四项核心比率',
  center = { value: '92', label: '综合评分' },
  rings = [
    { name: '目标达成率', value: 92, note: '年度净值 vs 计划' },
    { name: '风险预算占用', value: 64, note: '已用 / 上限' },
    { name: '再平衡纪律', value: 88, note: '按时执行比例' },
    { name: '现金覆盖月数', value: 76, note: '24 个月为满分' },
  ],
  ringCount = 4, showTrack = true, showCenter = true, showLegend = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { rdsInjectStyle(); }, []);
  const n = Math.max(3, Math.min(rings.length, ringCount));
  const used = rings.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  const SZ = 520, CX = SZ / 2, CY = SZ / 2;
  const SW = n >= 5 ? 22 : n === 4 ? 28 : 30;
  const GAP = n >= 5 ? 14 : n === 4 ? 16 : 18;
  const rOuter = CX - 28;
  const COL = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c6)'];
  const OPA = [1, 1, 1, 1, 1];

  return (
    <div className="rds-root">
      <div className="rds-head">
        <div className="rds-overline">{overline}</div>
        <h2 className="rds-title">{title}</h2>
      </div>

      <div className="rds-body">
        <div className="rds-chart" style={{ width: SZ, height: SZ }}>
          <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
            <g transform={`rotate(-90 ${CX} ${CY})`}>
              {used.map((r, i) => {
                const radius = rOuter - i * (SW + GAP);
                const C = 2 * Math.PI * radius;
                const hot = fIdx < 0 || fIdx === i;
                const col = fIdx < 0 ? COL[i] : (hot ? COL[i] : 'currentColor');
                const len = (Math.max(0, Math.min(100, r.value)) / 100) * C;
                return (
                  <g key={i} style={{ opacity: fIdx < 0 ? 1 : (hot ? 1 : 0.18) }}>
                    {showTrack && (
                      <circle cx={CX} cy={CY} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={SW} />
                    )}
                    <circle cx={CX} cy={CY} r={radius} fill="none" stroke={col} strokeOpacity={fIdx < 0 ? OPA[i] : 1}
                            strokeWidth={SW} strokeLinecap="round" strokeDasharray={`${len} ${C - len}`} />
                  </g>
                );
              })}
            </g>
            {showCenter && (
              <>
                <text x={CX} y={CY - 6} className="rds-cval" textAnchor="middle" dominantBaseline="central">{center.value}</text>
                <text x={CX} y={CY + 44} className="rds-clabel" textAnchor="middle" dominantBaseline="central">{center.label}</text>
              </>
            )}
          </svg>
        </div>

        {showLegend && (
          <div className="rds-legend">
            {used.map((r, i) => {
              const hot = fIdx < 0 || fIdx === i;
              return (
                <div className={`rds-row ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={i}>
                  <span className="rds-dot" style={{ background: COL[i], opacity: OPA[i] }} />
                  <div className="rds-meta">
                    <span className="rds-name">{r.name}</span>
                    <span className="rds-note">{r.note}</span>
                  </div>
                  <span className="rds-val" style={{ color: COL[i] }}>
                    {r.value}<span className="rds-unit">%</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function rdsInjectStyle() {
  if (document.getElementById('rds-style')) return;
  const s = document.createElement('style'); s.id = 'rds-style';
  s.textContent = `
  .rds-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .rds-head{margin-bottom:40px;}
  .rds-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .rds-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.08;}
  .rds-body{flex:1;min-height:0;display:grid;grid-template-columns:auto 1fr;gap:110px;align-items:center;}
  .rds-chart{flex:0 0 auto;}
  .rds-cval{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-mono);font-size:96px;font-weight:300;font-variant-numeric:tabular-nums;}
  .rds-clabel{fill:var(--ds-faint,rgba(242,243,246,.5));font-family:var(--font-mono);font-size:26px;letter-spacing:.12em;}
  .rds-legend{display:flex;flex-direction:column;gap:30px;min-width:0;}
  .rds-row{display:grid;grid-template-columns:24px 1fr auto;align-items:center;gap:26px;
    padding-bottom:30px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.12));transition:opacity .25s ease;}
  .rds-row:last-child{border-bottom:0;}
  .rds-row.is-dim{opacity:.4;}
  .rds-dot{width:24px;height:24px;border-radius:50%;}
  .rds-meta{display:flex;flex-direction:column;gap:5px;min-width:0;}
  .rds-name{font-size:34px;font-weight:300;}
  .rds-note{font-family:var(--font-mono);font-size:22px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .rds-val{font-family:var(--font-mono);font-size:54px;font-weight:300;font-variant-numeric:tabular-nums;text-align:right;}
  .rds-unit{font-size:28px;margin-left:2px;color:var(--ds-muted,rgba(242,243,246,.6));}
  `;
  document.head.appendChild(s);
}

SlideRadialStack.META = {
  id: 'radialstack', title: '同心环',
  defaults: { ringCount: 4, showTrack: true, showCenter: true, showLegend: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'ringCount', type: 'slider', label: '圆环数量', default: 4, min: 3, max: 5, step: 1,
      description: '同心圆环条数，每环为一项 0–100 的比率。' },
    { key: 'showTrack', type: 'toggle', label: '底环轨道', default: true,
      description: '每环背后的 100% 浅色轨道。' },
    { key: 'showCenter', type: 'toggle', label: '中心数值', default: true,
      description: '圆心的综合评分大数字。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '右侧名称 + 数值图例。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一环，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效，1 = 最外环。' },
  ],
};

export { SlideRadialStack };
export const META = SlideRadialStack.META;
export default SlideRadialStack;
