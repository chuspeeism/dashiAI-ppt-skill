// SlideStream.jsx — 主题河流图 / a centred streamgraph of an evolving mix.
// Several series stack symmetrically around a wandering centre baseline and flow
// left→right, so the changing *shape* tells how the allocation mix shifted over
// time. Distinct from SlideAreaStack (areas stacked from a flat zero baseline)
// and SlideCurve (a single net-value line). One ribbon can be focused. Standalone
// & migratable: depends only on React (imported), renders inline SVG. Token-driven,
// light/dark tone applies. CSS scoped `.stm-`.
//
// ── Props (canonical list in SlideStream.META.controls) ───────────────────────
//   seriesCount number 3..6   how many ribbons / series                    (5)
//   showLegend  boolean       the color→series legend                      (true)
//   showAxis    boolean       the period ticks under the river             (true)
//   focus       boolean       emphasise one ribbon, recede the rest        (false)
//   focusIndex  number 1..6   which ribbon is emphasised (1-based)         (1)
//
// Content props (authored at call-site):
//   overline, title, periods:[string], series:[{ name, color }]

import React from 'react';

function SlideStream({
  overline = '配置演变 · HOW THE MIX MOVED',
  title = '十年间，组合的重心如何漂移',
  periods = ['2016', '2018', '2020', '2022', '2024', 'NOW'],
  series = [
    { name: '全球股票', color: '#4f7ff0' },
    { name: 'A 股核心', color: '#16b88c' },
    { name: '利率债', color: '#f0a62b' },
    { name: '另类与黄金', color: '#8a5cf0' },
    { name: '现金', color: '#7e8694' },
    { name: '不动产', color: '#1fb6d8' },
  ],
  seriesCount = 5, showLegend = true, showAxis = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { stmInjectStyle(); }, []);
  const n = Math.max(3, Math.min(series.length, seriesCount));
  const used = series.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const lighten = (hex, p) => {
    const m = hex.replace('#', '');
    const r = parseInt(m.slice(0, 2), 16), g = parseInt(m.slice(2, 4), 16), b = parseInt(m.slice(4, 6), 16);
    const mix = (c) => Math.round(c + (255 - c) * p);
    return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
  };

  const geo = React.useMemo(() => {
    const T = 48, W = 1180, H = 430;
    const amp = [1.0, 0.84, 0.68, 0.56, 0.46, 0.4];
    const phase = [0.2, 1.25, 2.2, 3.1, 4.2, 5.1];
    const vals = used.map((_, i) => Array.from({ length: T }, (_, j) => {
      const t = j / (T - 1);
      return (amp[i] || 0.5) * (0.45 + 0.55 * Math.sin(t * Math.PI * 1.15 + (phase[i] || i))) + 0.12;
    }));
    const totals = Array.from({ length: T }, (_, j) => vals.reduce((a, v) => a + v[j], 0));
    const maxTotal = Math.max(...totals, 1);
    const scale = (H * 0.82) / maxTotal, cy = H / 2;
    const tops = used.map(() => []), bots = used.map(() => []);
    for (let j = 0; j < T; j++) {
      let run = -totals[j] / 2;
      for (let i = 0; i < n; i++) {
        const b = run; run += vals[i][j];
        bots[i][j] = cy + b * scale; tops[i][j] = cy + run * scale;
      }
    }
    const X = (j) => (j / (T - 1)) * W;
    const path = (i) => {
      let d = `M${X(0).toFixed(1)} ${tops[i][0].toFixed(1)}`;
      for (let j = 1; j < T; j++) d += ` L${X(j).toFixed(1)} ${tops[i][j].toFixed(1)}`;
      for (let j = T - 1; j >= 0; j--) d += ` L${X(j).toFixed(1)} ${bots[i][j].toFixed(1)}`;
      return d + ' Z';
    };
    return { W, H, paths: used.map((_, i) => path(i)) };
  }, [n]);

  return (
    <div className="stm-root">
      <div className="stm-head">
        <div className="stm-overline">{overline}</div>
        <h2 className="stm-title">{title}</h2>
      </div>

      <div className="stm-chartwrap">
        <svg className="stm-svg" viewBox={`0 0 ${geo.W} ${geo.H}`} preserveAspectRatio="none">
          <defs>
            {used.map((s, i) => (
              <linearGradient key={i} id={`stmGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={lighten(s.color, 0.58)} />
                <stop offset="100%" stopColor={`color-mix(in srgb, ${s.color} 62%, #000)`} />
              </linearGradient>
            ))}
          </defs>
          {geo.paths.map((d, i) => {
            const hot = fIdx < 0 || fIdx === i;
            return (
              <path key={i} d={d} fill={`url(#stmGrad${i})`}
                    fillOpacity={fIdx < 0 ? 0.92 : (hot ? 1 : 0.16)}
                    stroke="var(--ds-bg-soft,#16181d)" strokeOpacity="0.5" strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke" />
            );
          })}
        </svg>
        {showAxis && (
          <div className="stm-axis">{periods.map((p, i) => <span key={i}>{p}</span>)}</div>
        )}
      </div>

      {showLegend && (
        <div className="stm-legend">
          {used.map((s, i) => (
            <span className={`stm-lg ${fIdx >= 0 && fIdx !== i ? 'is-dim' : ''}`} key={i}>
              <span className="stm-sw" style={{ background: s.color }} />{s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function stmInjectStyle() {
  if (document.getElementById('stm-style')) return;
  const s = document.createElement('style'); s.id = 'stm-style';
  s.textContent = `
  .stm-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .stm-head{margin-bottom:30px;}
  .stm-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .stm-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.1;}
  .stm-chartwrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;}
  .stm-svg{width:100%;height:460px;display:block;}
  .stm-axis{display:flex;justify-content:space-between;margin-top:18px;padding-top:16px;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.13));
    font-family:var(--font-mono);font-size:23px;letter-spacing:.1em;color:var(--ds-faint,rgba(242,243,246,.4));}
  .stm-legend{display:flex;flex-wrap:wrap;gap:18px 34px;margin-top:30px;}
  .stm-lg{display:flex;align-items:center;gap:12px;font-size:25px;font-weight:300;
    color:var(--ds-muted,rgba(242,243,246,.7));transition:opacity .25s ease;}
  .stm-lg.is-dim{opacity:.4;}
  .stm-sw{width:22px;height:14px;border-radius:4px;}
  `;
  document.head.appendChild(s);
}

SlideStream.META = {
  id: 'stream', title: '主题河流图',
  defaults: { seriesCount: 5, showLegend: true, showAxis: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'seriesCount', type: 'slider', label: '系列数量', default: 5, min: 3, max: 6, step: 1,
      description: '河流中堆叠的系列（资产类别）数量。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '底部颜色 → 系列对照。' },
    { key: 'showAxis', type: 'toggle', label: '时间刻度', default: true,
      description: '河流下方的周期刻度。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一条河带，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的系列。' },
  ],
};

export { SlideStream };
export const META = SlideStream.META;
export default SlideStream;
