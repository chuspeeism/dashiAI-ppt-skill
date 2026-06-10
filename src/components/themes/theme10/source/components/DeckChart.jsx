// DeckChart.jsx — minimal monochrome chart (area / bars / line) for the deck.
// Self-contained: only depends on React (imported). No external CSS required —
// it renders an inline SVG. Safe to migrate: copy this file, ensure React is
// in scope, render <DeckChart .../>.
//
// Props:
//   type      'area' | 'bars' | 'line'      default 'area'
//   data      number[]                       default a generated growth curve
//   accent    css color                      default 'var(--ds-accent,#6f9bd8)'
//   ink       css color (axis/labels)        default 'var(--ds-faint,...)'
//   axisLabels string[]                       bottom-axis ticks (mono)
//   showAxis  boolean                         default true
//   height    number (css px, intrinsic box) default 360

import React from 'react';

function DeckChart({
  type = 'area',
  data,
  accent = 'var(--ds-accent, #6f9bd8)',
  axisLabels = ['TODAY', '2035', '2045', '2055'],
  showAxis = true,
  height = 360,
}) {
  React.useEffect(() => { dchartInjectStyle(); }, []);
  // Default dataset: an accelerating growth curve like the reference.
  const series = React.useMemo(() => {
    if (Array.isArray(data) && data.length) return data;
    const n = 56;
    return Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      return Math.pow(t, 2.3) * 100 + 4 + Math.sin(i * 0.7) * 1.4;
    });
  }, [data]);

  const W = 1000, H = 380;
  const max = Math.max(...series, 1);
  const padX = (W / series.length) / 2; // keep first/last bars fully inside the viewBox
  const pts = series.map((v, i) => [
    padX + (i / (series.length - 1)) * (W - padX * 2),
    H - (v / max) * (H - 8) - 4,
  ]);
  const linePath = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${(W - padX).toFixed(1)} ${H} L${padX.toFixed(1)} ${H} Z`;
  // Accent "leading edge" — the last ~14% of the curve, echoing the reference.
  const edgeStart = Math.floor(series.length * 0.86);
  const edgePath = pts.slice(edgeStart).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const gid = 'dchG' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="dchart" style={{ width: '100%' }}>
      <svg className="dchart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
           style={{ width: '100%', height, display: 'block' }}>
        <defs>
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
            <stop offset="0%" stopColor={`color-mix(in srgb, ${accent} 42%, #fff)`} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
          <linearGradient id="dchart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {type === 'bars' && pts.map((p, i) => {
          const accentBar = i >= edgeStart;
          return (
            <line key={i} x1={p[0]} y1={H} x2={p[0]} y2={p[1]}
                  stroke={`url(#${gid})`}
                  strokeOpacity={accentBar ? 0.98 : 0.55}
                  strokeWidth={W / series.length * 0.42} strokeLinecap="butt" />
          );
        })}

        {type === 'area' && (
          <>
            <path d={areaPath} fill="url(#dchart-fill)" />
            <path d={linePath} fill="none" stroke="currentColor" strokeOpacity="0.45"
                  strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path d={edgePath} fill="none" stroke={`url(#${gid})`} strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </>
        )}

        {type === 'line' && (
          <>
            <path d={linePath} fill="none" stroke="currentColor" strokeOpacity="0.5"
                  strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            <path d={edgePath} fill="none" stroke={`url(#${gid})`} strokeWidth="2.6"
                  vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4.5"
                    fill={accent} vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {showAxis && (
        <div className="dchart-axis">
          {axisLabels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

function dchartInjectStyle() {
  if (document.getElementById('dchart-style')) return;
  const s = document.createElement('style');
  s.id = 'dchart-style';
  s.textContent = `
  .dchart-axis{display:flex;justify-content:space-between;
    font-family:var(--font-mono,'IBM Plex Mono',monospace);font-size:24px;letter-spacing:.1em;
    color:var(--ds-faint, rgba(242,243,246,.4));margin-top:18px;padding-top:16px;
    border-top:1px solid var(--ds-line, rgba(242,243,246,.13));}
  `;
  document.head.appendChild(s);
}

export { DeckChart };
export default DeckChart;
