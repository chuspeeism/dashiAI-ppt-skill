/**
 * gxnCharts.jsx — glow-styled, prop-driven SVG charts. Pure presentational.
 *   import React from 'react'; in a real project.
 *
 * Exports
 *   TrendChart  — vertical bars / line / area for a time series, with an
 *                 optional secondary overlay series, focus highlight, labels.
 *   ShareChart  — donut / pie / horizontal-bar for categorical share data,
 *                 with focus segment, centre readout, value labels.
 */
import React from 'react';
import { GXN_PALETTE } from './gxnTheme.js';

const ACCENT = '#2fe07f';
const ACCENT2 = '#b9f24a';
const COOL = '#4ea2ff';
const GLOW = '47,224,127';

/* ─────────────────────────── TrendChart ─────────────────────────── */
export function TrendChart({
  data = [], chartType = 'bar', showSecondary = true,
  focusIndex = -1, showValueLabels = true,
  valueSuffix = '', secondaryLabel = '',
  accent, accent2, cool, glow, auroraColors, auroraSpeed,
}) {
  const uid = React.useId().replace(/:/g, '');
  // Mono-accent palette — falls back to the deck's green if no scheme is passed.
  const ACCENT = accent || '#2fe07f';
  const ACCENT2 = accent2 || '#b9f24a';
  const COOL = cool || '#4ea2ff';
  const GLOW = glow || '47,224,127';
  const W = 1060, H = 560;
  const padL = 30, padR = 30, padT = 78, padB = 74;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = data.length || 1;
  const vMax = Math.max(...data.map((d) => d.value), 1) * 1.16;
  const sMax = Math.max(...data.map((d) => d.secondary || 0), 1) * 1.35;
  const band = plotW / n;
  const xMid = (i) => padL + band * (i + 0.5);
  const yVal = (v) => padT + plotH * (1 - v / vMax);
  const ySec = (v) => padT + plotH * (1 - v / sMax);
  const focused = focusIndex >= 0 && focusIndex < n;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => padT + plotH * t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT2} />
          <stop offset="100%" stopColor={ACCENT} />
        </linearGradient>
        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.42" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${uid}-ds`} x="-50%" y="-50%" width="200%" height="220%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.42" />
        </filter>
        {auroraColors && auroraColors.length > 1 && (
          <linearGradient id={`${uid}-aur`} x1="0" y1="0" x2="1" y2="0" spreadMethod="repeat">
            {auroraColors.concat(auroraColors[0]).map((c, i, a) => (
              <stop key={i} offset={`${(i / (a.length - 1) * 100).toFixed(2)}%`} stopColor={c} />
            ))}
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="1 0"
              dur={`${(12 / (Number(auroraSpeed) || 1)).toFixed(2)}s`} repeatCount="indefinite" />
          </linearGradient>
        )}
      </defs>

      {/* baseline grid */}
      {gridLines.map((y, i) => (
        <line key={i} x1={padL} y1={y} x2={W - padR} y2={y}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}

      {/* PRIMARY series */}
      {chartType === 'bar' && data.map((d, i) => {
        const bw = band * 0.42;
        const x = xMid(i) - bw / 2;
        const y = yVal(d.value);
        const h = padT + plotH - y;
        const dim = focused && i !== focusIndex;
        return (
          <g key={i} opacity={dim ? 0.32 : 1}>
            <rect x={x} y={y} width={bw} height={Math.max(h, 2)} rx="9"
                  fill={`url(#${uid}-bar)`}
                  filter={!dim && (i === focusIndex || !focused) ? `url(#${uid}-glow)` : undefined} />
          </g>
        );
      })}

      {(chartType === 'line' || chartType === 'area') && (() => {
        const pts = data.map((d, i) => `${xMid(i)},${yVal(d.value)}`).join(' ');
        const areaD = `M ${padL},${padT + plotH} L ${data.map((d, i) => `${xMid(i)},${yVal(d.value)}`).join(' L ')} L ${W - padR},${padT + plotH} Z`;
        return (
          <g>
            {chartType === 'area' && <path d={areaD} fill={`url(#${uid}-area)`} />}
            <polyline points={pts} fill="none" stroke={`url(#${uid}-bar)`}
                      strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"
                      filter={`url(#${uid}-glow)`} />
            {data.map((d, i) => {
              const isF = i === focusIndex;
              const dim = focused && !isF;
              // hollow ringed dots — dark fill, accent ring (ref-card style)
              return <circle key={i} cx={xMid(i)} cy={yVal(d.value)} r={isF ? 11 : 8}
                             fill="#10141b" stroke={isF ? ACCENT2 : ACCENT} strokeWidth={isF ? 5 : 4}
                             opacity={dim ? 0.4 : 1} filter={!dim ? `url(#${uid}-glow)` : undefined} />;
            })}
          </g>
        );
      })()}

      {/* SECONDARY overlay line */}
      {showSecondary && data.some((d) => d.secondary != null) && (
        <g>
          <polyline points={data.map((d, i) => `${xMid(i)},${ySec(d.secondary)}`).join(' ')}
                    fill="none" stroke={COOL} strokeWidth="2.6" strokeDasharray="2 9"
                    strokeLinecap="round" opacity="0.92" />
          {data.map((d, i) => (
            <circle key={i} cx={xMid(i)} cy={ySec(d.secondary)} r="5.5"
                    fill="#07090b" stroke={COOL} strokeWidth="2.6"
                    opacity={focused && i !== focusIndex ? 0.4 : 1} />
          ))}
        </g>
      )}

      {/* value labels — bar: plain text · line/area: rounded callout box (ref-card tooltip style) */}
      {showValueLabels && chartType === 'bar' && data.map((d, i) => {
        const dim = focused && i !== focusIndex;
        return (
          <text key={i} x={xMid(i)} y={yVal(d.value) - 18} textAnchor="middle"
                fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="27"
                fill={i === focusIndex ? (auroraColors ? `url(#${uid}-aur)` : ACCENT2) : '#eef3f1'} opacity={dim ? 0.4 : 1}
                style={{ fontVariantNumeric: 'tabular-nums' }}>
            {d.value}{valueSuffix}
          </text>
        );
      })}
      {showValueLabels && (chartType === 'line' || chartType === 'area') && data.map((d, i) => {
        const isF = i === focusIndex;
        const dim = focused && !isF;
        const cxp = xMid(i);
        const txt = `${d.value}${valueSuffix}`;
        const bw = txt.length * 17 + 30, bh = 48;
        const by = yVal(d.value) - 20 - bh;
        const bx = cxp - bw / 2;
        // Single unified speech-bubble path: rounded rect + downward pointer,
        // so ONE border wraps the whole callout (no seam line, no borderless arrow).
        const r = 13, pw = 9, pd = 11;
        const right = bx + bw, bottom = by + bh;
        const bubble = [
          `M ${bx + r},${by}`,
          `H ${right - r}`, `A ${r} ${r} 0 0 1 ${right},${by + r}`,
          `V ${bottom - r}`, `A ${r} ${r} 0 0 1 ${right - r},${bottom}`,
          `H ${cxp + pw}`, `L ${cxp},${bottom + pd}`, `L ${cxp - pw},${bottom}`,
          `H ${bx + r}`, `A ${r} ${r} 0 0 1 ${bx},${bottom - r}`,
          `V ${by + r}`, `A ${r} ${r} 0 0 1 ${bx + r},${by}`, 'Z',
        ].join(' ');
        return (
          <g key={i} opacity={dim ? 0.4 : 1} filter={`url(#${uid}-ds)`}>
            <path d={bubble} fill="rgba(16,20,27,0.94)"
                  stroke={isF ? ACCENT2 : 'rgba(255,255,255,0.14)'} strokeWidth={isF ? 2.5 : 1.5}
                  strokeLinejoin="round" />
            <text x={cxp} y={by + bh / 2 + 1} textAnchor="middle" dominantBaseline="central"
                  fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="28"
                  fill={isF ? (auroraColors ? `url(#${uid}-aur)` : ACCENT2) : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {txt}
            </text>
          </g>
        );
      })}

      {/* x labels */}
      {data.map((d, i) => (
        <text key={`x${i}`} x={xMid(i)} y={H - 28} textAnchor="middle"
              fontFamily="'Space Mono',monospace" fontSize="25"
              fill={i === focusIndex ? '#eef3f1' : 'rgba(238,243,241,0.55)'}>
          {d.label}
        </text>
      ))}
    </svg>
  );
}

/* ─────────────────────────── ShareChart ─────────────────────────── */
function arcPath(cx, cy, rO, rI, a0, a1) {
  const p = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = p(rO, a0), [x1, y1] = p(rO, a1);
  if (rI <= 0) return `M ${cx},${cy} L ${x0},${y0} A ${rO},${rO} 0 ${large} 1 ${x1},${y1} Z`;
  const [x2, y2] = p(rI, a1), [x3, y3] = p(rI, a0);
  return `M ${x0},${y0} A ${rO},${rO} 0 ${large} 1 ${x1},${y1} L ${x2},${y2} A ${rI},${rI} 0 ${large} 0 ${x3},${y3} Z`;
}

export function ShareChart({
  data = [], chartType = 'donut', focusIndex = -1,
  showCenter = true, centerValue = '', centerLabel = '',
  showValueLabels = true, palette = GXN_PALETTE, auroraColors, auroraSpeed,
}) {
  const uid = React.useId().replace(/:/g, '');
  const colorOf = (d, i) => d.color || palette[i % palette.length];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const focused = focusIndex >= 0 && focusIndex < data.length;

  if (chartType === 'bar') {
    const W = 1060, H = 560;
    const rowH = H / Math.max(data.length, 1);
    const barH = Math.min(rowH * 0.5, 54);
    const labelW = 360, valW = 96;
    const maxV = Math.max(...data.map((d) => d.value), 1);
    const trackW = W - labelW - valW;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
           style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id={`${uid}-bg`} x="-40%" y="-60%" width="180%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {data.map((d, i) => {
          const cy = rowH * (i + 0.5);
          const w = trackW * (d.value / maxV);
          const c = colorOf(d, i);
          const dim = focused && i !== focusIndex;
          return (
            <g key={i} opacity={dim ? 0.34 : 1}>
              <text x={0} y={cy} dominantBaseline="middle"
                    fontFamily="'Noto Sans SC',sans-serif" fontWeight="500" fontSize="27" fill="#eef3f1">
                {d.label}
              </text>
              <rect x={labelW} y={cy - barH / 2} width={trackW} height={barH} rx={barH / 2}
                    fill="rgba(255,255,255,0.05)" />
              <rect x={labelW} y={cy - barH / 2} width={Math.max(w, 4)} height={barH} rx={barH / 2}
                    fill={c} filter={!dim ? `url(#${uid}-bg)` : undefined} />
              {showValueLabels && (
                <text x={W} y={cy} textAnchor="end" dominantBaseline="middle"
                      fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="27"
                      fill={i === focusIndex ? c : '#eef3f1'}
                      style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {d.pct || `${Math.round((d.value / total) * 100)}%`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // ── shared segment geometry (angles, in radians, clockwise from 12 o'clock) ──
  const S = 560, cx = S / 2, cy = S / 2;
  let acc = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const a0 = acc, a1 = acc + frac * Math.PI * 2;
    acc = a1;
    return { ...d, a0, a1, i, span: a1 - a0, mid: (a0 + a1) / 2 };
  });

  // ── PIE — filled wedges (kept as the alternate form) ──
  if (chartType === 'pie') {
    const rO = S * 0.46;
    return (
      <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
           style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id={`${uid}-sg`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {segs.filter((s) => s.hatch).map((s) => (
            <pattern key={s.i} id={`${uid}-hx-${s.i}`} width="11" height="11"
                     patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="11" height="11" fill={colorOf(s, s.i)} />
              <line x1="0" y1="0" x2="0" y2="11" stroke="rgba(0,0,0,0.42)" strokeWidth="6" />
            </pattern>
          ))}
        </defs>
        {segs.map((s) => {
          const isF = s.i === focusIndex;
          const dim = focused && !isF;
          const pop = isF ? 16 : 0;
          const dx = Math.sin(s.mid) * pop, dy = -Math.cos(s.mid) * pop;
          const c = s.hatch ? `url(#${uid}-hx-${s.i})` : colorOf(s, s.i);
          return (
            <g key={s.i} transform={`translate(${dx},${dy})`} opacity={dim ? 0.34 : 1}>
              <path d={arcPath(cx, cy, rO, 0, s.a0, s.a1)} fill={c}
                    stroke="#07090b" strokeWidth="3"
                    filter={(isF || !focused) && !s.hatch ? `url(#${uid}-sg)` : undefined} />
            </g>
          );
        })}
        {showValueLabels && segs.map((s) => (s.span > 0.34 ? (
          <text key={`l${s.i}`} x={cx + Math.sin(s.mid) * S * 0.30}
                y={cy - Math.cos(s.mid) * S * 0.30}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="27"
                fill="#07090b" opacity={focused && s.i !== focusIndex ? 0.4 : 1}>
            {s.pct || `${Math.round((s.value / total) * 100)}%`}
          </text>
        ) : null))}
      </svg>
    );
  }

  // ── DONUT — thick rounded annular-sector ring + small pill labels (ref design) ──
  // Each slice is a FILLED annular sector (inner→outer radius) with gently
  // rounded corners, so ring thickness, inter-slice gap and corner radius are
  // all tunable independently — a round-capped stroke ties corner radius to
  // thickness and forces wide gaps, which read as too thin/too round/too spaced.
  const ro = 246, ri = 146;          // outer / inner radius → thick ring
  const Rc = (ro + ri) / 2;          // centerline radius (label placement)
  const GAP = 0.05;                  // angular gap per side (tight)
  const CR = 18;                     // corner radius (gently rounded, not a pill)
  const PT = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const f2 = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const sectorPath = (a0, a1) => {
    const g = Math.min(GAP, (a1 - a0) * 0.2);
    const A0 = a0 + g, A1 = a1 - g;
    const spanT = A1 - A0;
    if (spanT <= 0.002) return null;
    const cr = Math.min(CR, spanT * ri * 0.44, (ro - ri) * 0.46); // clamp on thin slices
    const dao = cr / ro, dai = cr / ri;
    const large = spanT > Math.PI ? 1 : 0;
    return [
      `M ${f2(PT(ro, A0 + dao))}`,
      `A ${ro} ${ro} 0 ${large} 1 ${f2(PT(ro, A1 - dao))}`,
      `Q ${f2(PT(ro, A1))} ${f2(PT(ro - cr, A1))}`,
      `L ${f2(PT(ri + cr, A1))}`,
      `Q ${f2(PT(ri, A1))} ${f2(PT(ri, A1 - dai))}`,
      `A ${ri} ${ri} 0 ${large} 0 ${f2(PT(ri, A0 + dai))}`,
      `Q ${f2(PT(ri, A0))} ${f2(PT(ri + cr, A0))}`,
      `L ${f2(PT(ro - cr, A0))}`,
      `Q ${f2(PT(ro, A0))} ${f2(PT(ro, A0 + dao))}`,
      'Z',
    ].join(' ');
  };

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-sg`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {auroraColors && auroraColors.length > 1 && (
          <linearGradient id={`${uid}-aur`} x1="0" y1="0" x2="1" y2="0" spreadMethod="repeat">
            {auroraColors.concat(auroraColors[0]).map((c, i, a) => (
              <stop key={i} offset={`${(i / (a.length - 1) * 100).toFixed(2)}%`} stopColor={c} />
            ))}
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="1 0"
              dur={`${(12 / (Number(auroraSpeed) || 1)).toFixed(2)}s`} repeatCount="indefinite" />
          </linearGradient>
        )}
        {segs.filter((s) => s.hatch).map((s) => (
          <pattern key={s.i} id={`${uid}-hx-${s.i}`} width="10" height="10"
                   patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill={colorOf(s, s.i)} />
            <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(0,0,0,0.42)" strokeWidth="5.5" />
          </pattern>
        ))}
      </defs>

      {/* filled rounded segments */}
      {segs.map((s) => {
        const d = sectorPath(s.a0, s.a1);
        if (!d) return null;
        const isF = s.i === focusIndex;
        const dim = focused && !isF;
        const pop = isF ? 12 : 0;
        const dx = Math.sin(s.mid) * pop, dy = -Math.cos(s.mid) * pop;
        const fill = s.hatch ? `url(#${uid}-hx-${s.i})` : colorOf(s, s.i);
        return (
          <g key={s.i} transform={`translate(${dx},${dy})`} opacity={dim ? 0.4 : 1}>
            <path d={d} fill={fill} filter={isF && !s.hatch ? `url(#${uid}-sg)` : undefined} />
          </g>
        );
      })}

      {/* small frosted pill % labels, centred on each slice */}
      {showValueLabels && segs.map((s) => {
        if (s.span < 0.34) return null;
        const isF = s.i === focusIndex;
        const dim = focused && !isF;
        const pop = isF ? 12 : 0;
        const px = cx + Math.sin(s.mid) * Rc + Math.sin(s.mid) * pop;
        const py = cy - Math.cos(s.mid) * Rc - Math.cos(s.mid) * pop;
        const txt = s.pct || `${Math.round((s.value / total) * 100)}%`;
        const w = txt.length * 12 + 18, h = 30;
        return (
          <g key={`p${s.i}`} opacity={dim ? 0.45 : 1}>
            <rect x={px - w / 2} y={py - h / 2} width={w} height={h} rx={h / 2}
                  fill="rgba(246,248,255,0.84)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <text x={px} y={py} textAnchor="middle" dominantBaseline="central"
                  fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="22"
                  fill="#11141c" style={{ fontVariantNumeric: 'tabular-nums' }}>{txt}</text>
          </g>
        );
      })}

      {showCenter && (
        <g>
          <text x={cx} y={cy - 12} textAnchor="middle"
                fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="62"
                fill={focused ? (auroraColors ? `url(#${uid}-aur)` : colorOf(segs[focusIndex], focusIndex)) : '#eef3f1'}
                style={{ fontVariantNumeric: 'tabular-nums' }}>
            {focused ? (segs[focusIndex].pct || `${Math.round((segs[focusIndex].value / total) * 100)}%`) : centerValue}
          </text>
          <text x={cx} y={cy + 36} textAnchor="middle"
                fontFamily="'Space Mono',monospace" fontSize="25" fill="rgba(238,243,241,0.55)">
            {focused ? segs[focusIndex].label : centerLabel}
          </text>
        </g>
      )}
    </svg>
  );
}
