/**
 * gxnTheme.js — shared "炫光 / Glow" theme base for the deck slides.
 *
 * Migration notes
 * ---------------
 * - Standard ES module. No window globals, no preview-runtime dependency.
 * - All CSS is scoped under `.gxn-theme` (the THEME_CLASS). It NEVER touches
 *   `:root` / `html` / `body`, so dropping a slide into another React app
 *   cannot leak styles into the host page.
 * - <ThemeStyle /> injects the stylesheet exactly once (keyed by element id),
 *   so rendering several slides on one page is safe.
 * - Every slide component wraps its content in
 *       <div className={`${THEME_CLASS} gxn-slide`}>…</div>
 *   and renders <ThemeStyle /> itself, so each slide is self-contained.
 *
 * In a real project you'd `import React from 'react'`; in this preview the
 * loader supplies the global React via the same specifier.
 */
import React from 'react';

export const THEME_CLASS = 'gxn-theme';

/** Categorical chart palette — high-chroma neon hues that share lightness. */
export const GXN_PALETTE = [
  '#2fe07f', // green (primary)
  '#b9f24a', // lime
  '#2fe0c4', // teal
  '#4ea2ff', // blue
  '#9b7dff', // violet
  '#ff6fae', // pink
  '#ffc24a', // amber
];

/** Raw token values, exported so consuming code can read them in JS too. */
export const GXN_TOKENS = {
  accent: '#2fe07f',
  accent2: '#b9f24a',
  accentCool: '#4ea2ff',
  glowRGB: '47, 224, 127',
  bg: '#07090b',
  text: '#eef3f1',
  textDim: 'rgba(238,243,241,0.58)',
  textFaint: 'rgba(238,243,241,0.34)',
  palette: GXN_PALETTE,
};

const STYLE_ID = 'gxn-theme-style';

const CSS = `
.${THEME_CLASS}{
  /* ── color ── */
  --gxn-bg: #07090b;
  --gxn-accent: #2fe07f;
  --gxn-accent-2: #b9f24a;
  --gxn-accent-cool: #4ea2ff;
  --gxn-glow: 47,224,127;
  --gxn-text: #eef3f1;
  --gxn-dim: rgba(238,243,241,0.58);
  --gxn-faint: rgba(238,243,241,0.34);
  --gxn-line: rgba(255,255,255,0.09);
  --gxn-panel-a: rgba(255,255,255,0.055);
  --gxn-panel-b: rgba(255,255,255,0.012);

  /* ── type ── */
  --gxn-font-display: 'Space Grotesk','Noto Sans SC',-apple-system,sans-serif;
  --gxn-font-sans: 'Noto Sans SC','Space Grotesk',-apple-system,sans-serif;
  --gxn-font-mono: 'Space Mono',ui-monospace,'SFMono-Regular',monospace;
  --gxn-fs-display: 82px;
  --gxn-fs-h1: 58px;
  --gxn-fs-h2: 40px;
  --gxn-fs-h3: 32px;
  --gxn-fs-body: 28px;
  --gxn-fs-label: 24px;
  --gxn-fs-stat: 112px;

  /* ── space ── */
  --gxn-px: 108px;
  --gxn-py: 88px;
  --gxn-gap: 32px;
  --gxn-radius: 24px;

  font-family: var(--gxn-font-sans);
  color: var(--gxn-text);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ── slide frame ── */
.${THEME_CLASS}.gxn-slide{
  position:absolute; inset:0; width:100%; height:100%;
  box-sizing:border-box;
  background:
    radial-gradient(1200px 760px at 84% -14%, rgba(var(--gxn-glow),0.14), transparent 60%),
    radial-gradient(960px 680px at -8% 116%, rgba(78,162,255,0.10), transparent 60%),
    var(--gxn-bg);
  overflow:hidden;
}
.gxn-slide *{ box-sizing:border-box; }
/* faint dot grid texture */
.gxn-slide::before{
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1.4px);
  background-size: 38px 38px;
  mask-image: radial-gradient(120% 120% at 50% 40%, #000 30%, transparent 86%);
  opacity:.7;
}
.gxn-pad{ position:absolute; inset:0; padding: var(--gxn-py) var(--gxn-px); display:flex; flex-direction:column; }

/* ── header lockup (parallel across slides) ── */
.gxn-kicker{
  display:inline-flex; align-items:center; gap:12px;
  font-family:var(--gxn-font-mono); font-size:var(--gxn-fs-label);
  letter-spacing:.18em; text-transform:uppercase; color:var(--gxn-accent);
  text-shadow:0 0 18px rgba(var(--gxn-glow),0.55);
  margin:0;
}
.gxn-kicker::before{
  content:''; width:34px; height:2px; border-radius:2px;
  background:linear-gradient(90deg,var(--gxn-accent),transparent);
  box-shadow:0 0 14px rgba(var(--gxn-glow),0.8);
}
.gxn-title{
  font-family:var(--gxn-font-sans); font-weight:700; font-size:var(--gxn-fs-h1);
  line-height:1.08; letter-spacing:-0.01em; margin:0; color:var(--gxn-text);
}
.gxn-title .gxn-em{ color:var(--gxn-accent); text-shadow:0 0 26px rgba(var(--gxn-glow),0.5); }
.gxn-sub{ font-size:var(--gxn-fs-h3); color:var(--gxn-dim); margin:0; font-weight:400; line-height:1.4; }

/* ── panels / cards ── */
/* Panels adopt the "炫光 / rim-glow" technique (studied from the ticket card):
   a radial wash that darkens the centre and tints the edge, an INSET rim
   bloom that hugs the rounded-rect border like backlit glass, and — on focus —
   a brighter inner rim plus an outer halo. Re-tinted from the source's violet
   to the deck's green accent so it stays on-theme. */
.gxn-panel{
  position:relative; border-radius:var(--gxn-radius);
  background:
    radial-gradient(132% 132% at 50% 50%, rgba(255,255,255,0) 58%, rgba(var(--gxn-glow),0.035) 90%, rgba(var(--gxn-glow),0.085) 100%),
    linear-gradient(165deg,var(--gxn-panel-a),var(--gxn-panel-b));
  border:1px solid var(--gxn-line);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    inset 0 0 42px -16px rgba(var(--gxn-glow),0.20),
    0 26px 60px -40px rgba(0,0,0,0.9);
  transition: border-color .35s ease, box-shadow .35s ease, background .35s ease, transform .35s ease;
}
.gxn-panel.is-focus{
  border-color: transparent;
  background:
    radial-gradient(130% 130% at 50% 44%, rgba(7,9,11,0) 46%, rgba(var(--gxn-glow),0.07) 82%, rgba(var(--gxn-glow),0.16) 100%),
    linear-gradient(165deg,var(--gxn-panel-a),var(--gxn-panel-b));
  box-shadow:
    inset 0 0 0 1.5px rgba(var(--gxn-glow),0.62),     /* crisp rim line   */
    inset 0 0 30px -4px rgba(var(--gxn-glow),0.46),   /* tight inner bloom */
    inset 0 0 96px 8px rgba(var(--gxn-glow),0.14),    /* soft falloff      */
    0 0 84px -8px rgba(var(--gxn-glow),0.60),         /* outer halo        */
    0 26px 70px -42px rgba(0,0,0,0.9);
}
.gxn-panel.is-dim{ opacity:.46; filter:saturate(.7); }

.gxn-mono{ font-family:var(--gxn-font-mono); letter-spacing:.04em; }
.gxn-num{ font-family:var(--gxn-font-display); font-variant-numeric:tabular-nums lining-nums; font-feature-settings:"tnum" 1; }

/* index chip */
.gxn-index{
  font-family:var(--gxn-font-mono); font-size:var(--gxn-fs-label);
  color:var(--gxn-faint); letter-spacing:.1em;
}

/* legend */
.gxn-legend{ display:flex; flex-direction:column; gap:18px; }
.gxn-legend-row{ display:flex; align-items:center; gap:16px; transition:opacity .3s ease; }
.gxn-legend-row.is-dim{ opacity:.4; }
.gxn-dot{ width:16px; height:16px; border-radius:5px; flex:0 0 auto; box-shadow:0 0 16px -2px currentColor; }

/* image slot */
.gxn-slot{
  position:relative; overflow:hidden; border-radius:18px;
  background:
    repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 12px, rgba(255,255,255,0.015) 12px 24px);
  border:1px solid var(--gxn-line);
  display:flex; align-items:center; justify-content:center;
}
.gxn-slot.is-filled{ background:#0b0d10; border-color:rgba(var(--gxn-glow),0.3);
  box-shadow:0 0 56px -22px rgba(var(--gxn-glow),0.6); }
.gxn-slot img{ width:100%; height:100%; object-fit:cover; display:block; }
.gxn-slot-cap{ font-family:var(--gxn-font-mono); font-size:24px; color:var(--gxn-faint);
  letter-spacing:.06em; text-align:center; padding:10px; }
.gxn-slot-btn{
  position:absolute; appearance:none; border:0; cursor:pointer; font-family:var(--gxn-font-mono);
}
.gxn-slot-add{ inset:0; width:100%; height:100%; background:transparent; color:var(--gxn-dim); }
.gxn-slot-add:hover{ background:rgba(var(--gxn-glow),0.05); color:var(--gxn-accent); }
.gxn-slot-clear{
  top:10px; right:10px; width:30px; height:30px; border-radius:50%;
  background:rgba(0,0,0,0.55); color:#fff; font-size:15px; line-height:1;
  backdrop-filter:blur(8px); display:none; align-items:center; justify-content:center;
}
.gxn-slot.is-filled:hover .gxn-slot-clear{ display:flex; }
/* focused image slot — accent ring + halo (used by gallery/showcase) */
.gxn-slot.is-focus{
  border-color: var(--gxn-accent);
  box-shadow:
    inset 0 0 0 2px rgba(var(--gxn-glow),0.55),
    0 0 64px -16px rgba(var(--gxn-glow),0.72);
}
/* caption overlay on a filled slot */
.gxn-slot-overlay{
  position:absolute; left:0; right:0; bottom:0; z-index:2;
  display:flex; align-items:center; gap:12px; padding:18px 20px;
  background:linear-gradient(to top, rgba(4,6,8,0.82), rgba(4,6,8,0.32) 62%, transparent);
  pointer-events:none;
}
.gxn-slot-overlay .gxn-cap-idx{
  font-family:var(--gxn-font-mono); font-size:24px; line-height:1; color:var(--gxn-accent);
  text-shadow:0 0 16px rgba(var(--gxn-glow),0.7);
}
.gxn-slot-overlay .gxn-cap-txt{
  font-family:var(--gxn-font-sans); font-weight:500; font-size:24px; color:#f3f6f4; letter-spacing:.01em;
}

/* entrance — visible end-state is base; animate from hidden only when active */
@media (prefers-reduced-motion: no-preference){
  [data-deck-active] .gxn-rise{ animation: gxn-rise .62s cubic-bezier(.2,.7,.25,1) both; }
  [data-deck-active] .gxn-rise-2{ animation: gxn-rise .62s cubic-bezier(.2,.7,.25,1) .08s both; }
  [data-deck-active] .gxn-rise-3{ animation: gxn-rise .62s cubic-bezier(.2,.7,.25,1) .16s both; }
  [data-deck-active] .gxn-rise-4{ animation: gxn-rise .62s cubic-bezier(.2,.7,.25,1) .24s both; }
}
@keyframes gxn-rise{ from{ opacity:0; transform:translateY(22px); } to{ opacity:1; transform:none; } }

/* ── flowing neon sphere (hub orb, shared by relation slides) ──
   A filled accent gradient over an opaque base; .is-flow drifts the gradient
   so the orb's surface appears to flow. Scheme-aware via the accent vars. */
.gxn-sphere{
  background: linear-gradient(125deg, var(--gxn-accent) 0%, var(--gxn-accent-2) 44%, var(--gxn-accent) 100%);
  background-size: 100% 100%;
}
.gxn-sphere.is-flow{
  background-size: 240% 240%;
  animation: gxn-sphere-flow 7s ease-in-out infinite alternate;
}
@keyframes gxn-sphere-flow{ 0%{ background-position:0% 50%; } 100%{ background-position:100% 50%; } }
@media (prefers-reduced-motion: reduce){ .gxn-sphere.is-flow{ animation:none; } }
`;

/**
 * Injects the theme stylesheet once per document (idempotent across slides).
 * Render it inside every slide so a standalone slide still carries its styles.
 */
export function ThemeStyle() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
  return null;
}

/** Small className joiner. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/* ─────────────────────────────────────────────────────────────────────────
 * Deck-level color schemes (global tweak).
 *
 * `vars`    — CSS custom-property overrides applied to every slide root so the
 *             ambient glow, kickers, titles, stats, panels and tags all retint.
 * `chart`   — accent trio fed to the mono-accent TrendChart (props, not CSS).
 * `palette` — categorical hue ring for the ShareChart / legends.
 *
 * The "violet" scheme approximates the right-hand (PLATINUM) ticket in
 * 炫光票卡.html — a backlit violet/indigo world over deep navy.
 * ──────────────────────────────────────────────────────────────────────── */
export const GXN_SCHEMES = {
  green: {
    label: '霓虹绿',
    vars: {}, // base theme is already green — no overrides needed
    chart: { accent: '#2fe07f', accent2: '#b9f24a', cool: '#4ea2ff', glow: '47,224,127' },
    palette: GXN_PALETTE,
    // aurora-text gradient ramp — neon hues that share lightness, on-scheme
    aurora: ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff'],
    // ticket-card emphasis palette — kept in lock-step with the scheme accent
    ticket: {
      glow: '47,224,127', accent: '#a8f6cd', text: '#eafff4',
      dim: 'rgba(234,255,244,0.82)', faint: 'rgba(234,255,244,0.56)',
      fillA: '#0a1d13', fillB: '#06110b', edge: '#9bf3c4',
    },
  },
  violet: {
    label: '炫光紫',
    vars: {
      '--gxn-bg': '#08081c',
      '--gxn-accent': '#9b82ff',
      '--gxn-accent-2': '#c4b3ff',
      '--gxn-accent-cool': '#5aa0ff',
      '--gxn-glow': '150,120,255',
    },
    chart: { accent: '#9b82ff', accent2: '#c4b3ff', cool: '#5aa0ff', glow: '150,120,255' },
    palette: ['#9b82ff', '#5ad1ff', '#6f8bff', '#ff8fce', '#c4b3ff', '#7b67ff', '#ffc24a'],
    aurora: ['#9b82ff', '#5ad1ff', '#c4b3ff', '#ff8fce', '#6f8bff'],
    ticket: {
      glow: '150,120,255', accent: '#cfc4ff', text: '#f3f1ff',
      dim: 'rgba(239,234,255,0.82)', faint: 'rgba(239,234,255,0.58)',
      fillA: '#17123c', fillB: '#0c0822', edge: '#c9bcff',
    },
  },
};

/* The PLATINUM-ticket emphasis treatment, ADAPTED to a rounded rectangle and
   wired to the active color scheme. Three deliberate properties:

   1. Scheme-locked — every glow/edge color comes from `scheme.ticket`, so the
      emphasis color always tracks the chosen palette (green → green, etc.).
   2. INNER glow only — the source ellipse brightens its rim via a radial
      gradient, which blows out a rounded rect's corners. Here the rim is built
      from INSET box-shadows (which respect `border-radius`), and there is NO
      outer halo — the card glows inward only. A `breath` value (0–100) animates
      that inner bloom in and out for an adjustable breathing pulse.
   3. Sliding stroke — a masked conic-gradient on ::after paints a 1.5px border
      ring with a bright arc that travels continuously around the rounded edge.

   `@property --gxn-ba` makes the conic angle animatable (smooth interpolation).
   Inner CSS vars are retinted so accent text, axis marks and index chips read
   as backlit, on-scheme highlights. */
function ticketFocusCSS(t, breath) {
  const a = Math.max(0, Math.min(100, Number(breath) || 0)) / 100;
  const g = t.glow;
  // Inner-glow box-shadow at a given intensity k (0 = calm, 1 = full bloom).
  const innerGlow = (k) => `
    inset 0 0 0 1.5px rgba(${g},${(0.5 + 0.18 * k).toFixed(3)}),
    inset 0 0 ${Math.round(34 + 30 * k)}px -2px rgba(${g},${(0.42 + 0.34 * k).toFixed(3)}),
    inset 0 0 ${Math.round(110 + 40 * k)}px ${Math.round(8 + 8 * k)}px rgba(${g},${(0.26 + 0.18 * k).toFixed(3)}),
    0 24px 60px -28px rgba(0,0,0,0.65)`;
  // breath > 0 → pulse between a calm low and an a-scaled high; else hold steady.
  const lo = innerGlow(0.18);
  const hi = innerGlow(0.18 + 0.82 * a);
  const animate = a > 0;

  return `
@property --gxn-ba { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.${THEME_CLASS} .gxn-panel.is-focus{
  --gxn-accent:${t.accent};
  --gxn-glow:${g};
  --gxn-text:${t.text};
  --gxn-dim:${t.dim};
  --gxn-faint:${t.faint};
  position:relative;
  border-color:transparent;
  /* even dark fill — depth only; the rim is entirely inset box-shadow */
  background:
    radial-gradient(135% 135% at 50% 42%, ${t.fillA} 0%, ${t.fillB} 64%, ${t.fillB} 100%),
    ${t.fillB};
  box-shadow:${animate ? hi : innerGlow(0.5)};
  ${animate ? `animation: gxn-ticket-breath 3.4s ease-in-out infinite alternate;` : ''}
}
${animate ? `
@keyframes gxn-ticket-breath{
  from{ box-shadow:${lo}; }
  to{ box-shadow:${hi}; }
}` : ''}
/* sliding light around the stroke — masked conic ring, animated angle */
.${THEME_CLASS} .gxn-panel.is-focus::after{
  content:''; position:absolute; inset:0; border-radius:inherit;
  padding:1.5px; pointer-events:none;
  background: conic-gradient(from var(--gxn-ba),
    rgba(${g},0) 0deg, rgba(${g},0) 64deg,
    rgba(${g},0.85) 86deg, ${t.edge} 92deg, rgba(${g},0.85) 98deg,
    rgba(${g},0) 120deg, rgba(${g},0) 360deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: gxn-ticket-slide 3.6s linear infinite;
}
@keyframes gxn-ticket-slide{ to{ --gxn-ba: 360deg; } }
@media (prefers-reduced-motion: reduce){
  .${THEME_CLASS} .gxn-panel.is-focus{ animation:none; }
  .${THEME_CLASS} .gxn-panel.is-focus::after{ animation:none; }
}
`;
}

/* Aurora-text treatment for the glowing title/quote fragments (.gxn-em).
   Studied from the Magic UI "Aurora Text" effect and retinted to the active
   scheme: a multi-stop linear gradient is clipped to the glyphs and its
   background-position drifts back and forth, so the neon ramp flows through
   the emphasised words. The existing rim-glow is preserved via text-shadow
   (drawn from glyph alpha even with a transparent fill). No transform is used,
   so it never shifts surrounding layout; reduced-motion holds it static. */
function auroraTextCSS(colors, speed) {
  const ramp = (colors && colors.length ? colors : ['#2fe07f', '#4ea2ff']).slice();
  const dur = (12 / (Number(speed) || 1)).toFixed(2);
  const stops = ramp.concat(ramp[0]).join(', ');
  return `
.${THEME_CLASS} .gxn-em,
.${THEME_CLASS} .gxn-aurora-num{
  background-image: linear-gradient(110deg, ${stops});
  background-size: 240% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent !important; color: transparent !important;
  animation: gxn-aurora-text ${dur}s ease-in-out infinite alternate;
}
.${THEME_CLASS} .gxn-em{ text-shadow: 0 0 32px rgba(var(--gxn-glow), 0.32); }
/* a focal number's trailing unit / suffix span keeps its own muted color —
   only the figure itself flows. (child opts out of the gradient clip) */
.${THEME_CLASS} .gxn-aurora-num > span{
  -webkit-text-fill-color: currentColor !important;
  background: none;
}
@keyframes gxn-aurora-text{
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce){
  .${THEME_CLASS} .gxn-em,
  .${THEME_CLASS} .gxn-aurora-num{ animation: none; }
}
`;
}

/**
 * Build the global override stylesheet for the current deck-level tweaks.
 *   deck = { scheme:'green'|'violet', emphasis:'default'|'ticket', breath:0-100 }
 * Scheme vars are scoped to `.gxn-theme.gxn-slide` (2 classes) so they always
 * win over the base `.gxn-theme` declarations regardless of injection order.
 */
export function deckOverrideCSS(deck = {}) {
  const sc = GXN_SCHEMES[deck.scheme] || GXN_SCHEMES.green;
  let css = '';
  const entries = Object.entries(sc.vars || {});
  if (entries.length) {
    const decl = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n');
    css += `.${THEME_CLASS}.gxn-slide{\n${decl}\n}\n`;
  }
  if (deck.emphasis === 'ticket') {
    css += ticketFocusCSS(sc.ticket, deck.breath != null ? deck.breath : 55);
  }
  if (deck.aurora) {
    css += auroraTextCSS(sc.aurora, deck.auroraSpeed != null ? deck.auroraSpeed : 1);
  }
  // Magnetic-hover transform for the emphasis card. The formula lives in CSS
  // and is fed four custom properties by the pointer handler in app.jsx; the
  // short transition does the "attraction" smoothing. transform-origin centre.
  if (deck.magnet !== false) {
    css += `
.${THEME_CLASS} .gxn-panel.is-focus{
  transform:
    perspective(1100px)
    translate3d(var(--gxn-mx,0px), var(--gxn-my,0px), 0)
    rotateX(var(--gxn-rx,0deg)) rotateY(var(--gxn-ry,0deg));
  transition: transform .16s cubic-bezier(.22,.61,.36,1);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce){
  .${THEME_CLASS} .gxn-panel.is-focus{ transform:none; }
}
`;
  }
  return css;
}
