/**
 * viz.jsx — shared presentational primitives for the report template.
 * Brand-signature pieces reused across pages: a vertical "barcode" heatmap,
 * a donut, a labelled horizontal bar, a change badge, and the logo mark.
 *
 * All styles are injected once under the `.aic-viz` scope — no global leakage.
 * Every component is pure and prop-driven; nothing here reads external state.
 */
import React from 'react';
import { injectScopedStyle } from './theme.js';

const CSS = `
.aic-viz, .aic-viz * { box-sizing: border-box; }

/* ── Barcode / heatmap: a row of thin vertical bars ── */
.aic-viz-bars { display: flex; align-items: flex-end; gap: var(--bc-gap, 3px);
  width: 100%; height: 100%; }
.aic-viz-bars > i { flex: 1 1 0; border-radius: 2px; display: block;
  transform-origin: bottom; transition: height .4s cubic-bezier(.3,.7,.4,1); }

/* ── Donut ── */
.aic-viz-donut { display: block; }
.aic-viz-donut text { font-family: var(--aic-font-display); }

/* ── Horizontal bar row ── */
.aic-viz-row { display: grid; grid-template-columns: 1fr auto; align-items: baseline;
  gap: 10px 16px; }
.aic-viz-row + .aic-viz-row { margin-top: var(--row-gap, 20px); }
.aic-viz-row-lbl { font-family: var(--aic-font-text); font-weight: 500; }
.aic-viz-row-val { font-family: var(--aic-font-display); font-weight: 600;
  font-variant-numeric: tabular-nums; }
.aic-viz-row-track { grid-column: 1 / -1; height: 10px; border-radius: 999px;
  background: var(--aic-hair); overflow: hidden; }
.aic-viz-row-fill { height: 100%; border-radius: 999px;
  transition: width .5s cubic-bezier(.3,.7,.4,1); }

/* ── Change badge ── */
.aic-viz-badge { display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 999px; font-family: var(--aic-font-display);
  font-weight: 600; font-variant-numeric: tabular-nums; line-height: 1;
  white-space: nowrap; }
.aic-viz-badge[data-dir="up"]   { background: color-mix(in srgb, var(--aic-pos) 16%, transparent); color: var(--aic-pos); }
.aic-viz-badge[data-dir="down"] { background: color-mix(in srgb, var(--aic-neg) 14%, transparent); color: var(--aic-neg); }
.aic-viz-badge svg { width: .7em; height: .7em; }

/* ── Logo mark ── */
.aic-viz-brand { display: inline-flex; align-items: center; gap: 14px; }
.aic-viz-brand-mark { display: grid; place-items: center; background: var(--aic-ink);
  border-radius: 28%; flex: none; }
.aic-viz-brand-name { display: flex; flex-direction: column; line-height: 1.05; }
.aic-viz-brand-name b { font-family: var(--aic-font-display); font-weight: 700;
  letter-spacing: .14em; }
.aic-viz-brand-name span { font-family: var(--aic-font-display); font-weight: 500;
  letter-spacing: .26em; color: var(--aic-muted); }

/* ── Big number: significant ink + trailing gray (signature) ── */
.aic-viz-bignum { font-family: var(--aic-font-display); font-weight: 700; line-height: .82;
  display: inline-flex; align-items: baseline; color: var(--aic-ink);
  font-variant-numeric: lining-nums; white-space: nowrap; }
.aic-viz-bignum .pre { font-weight: 600; margin-right: .04em; }
.aic-viz-bignum .lead { }
.aic-viz-bignum .tail { color: var(--aic-faint); }
.aic-viz-bignum .unit { font-family: var(--aic-font-text); font-weight: 600;
  color: var(--aic-ink-dim); margin-left: .28em; align-self: flex-end; }
.aic-viz-bignum.slant .pre, .aic-viz-bignum.slant .lead, .aic-viz-bignum.slant .tail {
  display: inline-block; transform: skewX(-9deg); transform-origin: bottom; }

/* ── Lens cluster: overlapping translucent green discs (brand motif) ── */
.aic-viz-lens { position: relative; pointer-events: none; }
.aic-viz-lens > i { position: absolute; border-radius: 50%; mix-blend-mode: multiply;
  box-shadow: inset 6% 8% 18% rgba(255,255,255,.55), inset -8% -10% 22% rgba(60,110,10,.45); }
.aic-viz-lens > i::after { content: ''; position: absolute; inset: 14%; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.34); }

/* ── Heat strip: dense market barcode ── */
.aic-viz-heat { display: flex; align-items: stretch; gap: var(--ht-gap, 4px);
  width: 100%; height: 100%; }
.aic-viz-heat > i { flex: 1 1 0; border-radius: 2px; align-self: stretch; }
`;

function useViz() { injectScopedStyle('aic-viz', CSS); }

const TONE = (t) => ({
  pos: 'var(--aic-pos)', neg: 'var(--aic-neg)', warn: 'var(--aic-warn)',
  accent: 'var(--aic-accent)', ink: 'var(--aic-ink)',
  faint: 'var(--aic-hair-strong)',
}[t] || t || 'var(--aic-accent)');

/** Vertical-bar barcode/heatmap.
 *  @param data  Array<{ v:0..1, tone?:string }>  bar heights + color tone.
 *  @param gap   px between bars. */
export function Barcode({ data = [], gap = 3, style }) {
  useViz();
  return (
    <div className="aic-viz aic-viz-bars" style={{ '--bc-gap': gap + 'px', ...style }}>
      {data.map((b, i) => (
        <i key={i} style={{ height: (Math.max(0.04, b.v) * 100) + '%',
          background: TONE(b.tone) }} />
      ))}
    </div>
  );
}

/** Donut chart.
 *  @param segments Array<{ value:number, color:string, label?:string }>
 *  @param size px, @param thickness px, @param focusIndex highlight one wedge. */
export function Donut({ segments = [], size = 320, thickness = 46, focusIndex = -1,
  centerTop, centerBottom, style }) {
  useViz();
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg className="aic-viz aic-viz-donut" width={size} height={size}
      viewBox={`0 0 ${size} ${size}`} style={style}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const dim = focusIndex >= 0 && focusIndex !== i;
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={seg.color} strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-acc * c}
              opacity={dim ? 0.28 : 1}
              style={{ transition: 'opacity .35s, stroke-width .35s' }} />
          );
          acc += frac;
          return el;
        })}
      </g>
      {centerTop != null && (
        <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: size * 0.16, fontWeight: 700, fill: 'var(--aic-ink)' }}>
          {centerTop}
        </text>
      )}
      {centerBottom != null && (
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: size * 0.052, fontWeight: 500, fill: 'var(--aic-muted)',
            letterSpacing: '.04em' }}>
          {centerBottom}
        </text>
      )}
    </svg>
  );
}

/** Labelled horizontal bar.
 *  @param value 0..100 (percent of track), @param display value text. */
export function BarRow({ label, display, value = 0, color, focus = false, dim = false }) {
  useViz();
  return (
    <div className="aic-viz-row" style={{ opacity: dim ? 0.42 : 1, transition: 'opacity .3s' }}>
      <div className="aic-viz-row-lbl" style={{
        fontSize: focus ? 26 : 24, color: focus ? 'var(--aic-ink)' : 'var(--aic-ink-dim)',
        fontWeight: focus ? 700 : 500 }}>{label}</div>
      <div className="aic-viz-row-val" style={{
        fontSize: focus ? 30 : 26, color: 'var(--aic-ink)' }}>{display}</div>
      <div className="aic-viz-row-track">
        <div className="aic-viz-row-fill" style={{ width: value + '%',
          background: color || (focus ? 'var(--aic-accent)' : 'var(--aic-ink)') }} />
      </div>
    </div>
  );
}

/** Up/down change pill, e.g. +75.3% / −35.2%. */
export function ChangeBadge({ value, dir, style }) {
  useViz();
  const d = dir || (String(value).trim().startsWith('-') ? 'down' : 'up');
  return (
    <span className="aic-viz-badge" data-dir={d} style={style}>
      <svg viewBox="0 0 10 10" aria-hidden="true">
        <path d={d === 'up' ? 'M5 1 9 8H1z' : 'M5 9 1 2h8z'} fill="currentColor" />
      </svg>
      {value}
    </span>
  );
}

/** Original geometric logo mark + optional wordmark. */
export function BrandMark({ size = 44, label = 'AI CAPITAL LAB', sub = 'FUNDING INTELLIGENCE',
  showWord = true, style }) {
  useViz();
  const g = size * 0.27;
  return (
    <div className="aic-viz aic-viz-brand" style={style}>
      <div className="aic-viz-brand-mark" style={{ width: size, height: size }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="12" r="6.4" fill="none" stroke="var(--aic-accent)" strokeWidth="2.4" />
          <circle cx="15" cy="12" r="6.4" fill="none" stroke="#fff" strokeWidth="2.4" opacity="0.92" />
        </svg>
      </div>
      {showWord && (
        <div className="aic-viz-brand-name">
          <b style={{ fontSize: size * 0.34, color: 'var(--aic-ink)' }}>{label}</b>
          {sub ? <span style={{ fontSize: size * 0.2 }}>{sub}</span> : null}
        </div>
      )}
    </div>
  );
}

/** Signature big number — significant digits in ink, trailing digits in gray.
 *  @param prefix   e.g. "$"  (rendered ink, slightly lighter weight)
 *  @param lead     significant part, e.g. "3,947"  (ink)
 *  @param tail     de-emphasized trailing part, e.g. ".18"  (gray)
 *  @param unit     trailing unit label, e.g. "亿美元"
 *  @param slant    apply the brand's italic-slant on digits
 *  @param size     px font-size of the lead digits */
export function BigNumber({ prefix, lead, tail, unit, slant = true, size = 88, color, style }) {
  useViz();
  return (
    <span className={'aic-viz aic-viz-bignum' + (slant ? ' slant' : '')}
      style={{ fontSize: size, color: color || 'var(--aic-ink)', ...style }}>
      {prefix != null && <span className="pre">{prefix}</span>}
      <span className="lead">{lead}</span>
      {tail != null && tail !== '' && <span className="tail">{tail}</span>}
      {unit != null && unit !== '' && <span className="unit" style={{ fontSize: size * 0.3 }}>{unit}</span>}
    </span>
  );
}

/** Overlapping translucent green "lens" discs — the brand's focal-point motif.
 *  @param discs  Array<{ x,y,d, hue? }> in % of the box (x,y center; d diameter).
 *  @param size   px box size (square). Defaults to filling the parent if omitted. */
const LENS_DEFAULT = [
  { x: 30, y: 38, d: 52 },
  { x: 58, y: 30, d: 40 },
  { x: 52, y: 64, d: 46 },
  { x: 76, y: 58, d: 30 },
];
export function LensCluster({ discs = LENS_DEFAULT, style }) {
  useViz();
  return (
    <div className="aic-viz aic-viz-lens" style={{ width: '100%', height: '100%', ...style }}>
      {discs.map((c, i) => (
        <i key={i} style={{
          left: (c.x - c.d / 2) + '%', top: (c.y - c.d / 2) + '%',
          width: c.d + '%', height: c.d + '%',
          background: `radial-gradient(circle at 36% 30%, var(--aic-accent-bright), var(--aic-accent) 52%, var(--aic-accent-deep) 96%)`,
          opacity: 0.86,
        }} />
      ))}
    </div>
  );
}

/** Dense market heat strip — vertical bars colored by tone (green/orange/red). */
export function HeatStrip({ data = [], gap = 4, style }) {
  useViz();
  return (
    <div className="aic-viz aic-viz-heat" style={{ '--ht-gap': gap + 'px', ...style }}>
      {data.map((b, i) => (
        <i key={i} style={{ background: TONE(b.tone || b) }} />
      ))}
    </div>
  );
}
