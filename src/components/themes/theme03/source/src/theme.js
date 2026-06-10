// theme.js — JS-side design tokens.
// Used where a value must reach inline styles / SVG attributes (chart fills,
// computed geometry) that CSS custom properties can't easily cover.
// Mirrors the palette in theme.css.
//
// THEME-AWARE: COLORS and RAMP are exported as ESM *live bindings*. Calling
// setRDDark(true/false) swaps the underlying object/array, and every slide
// that reads `COLORS.x` / `RAMP[i]` AT RENDER TIME picks up the new value on
// the next render. (Values captured into module-scope constants at load time
// do NOT update — keep palette lookups inside the render path.)
// This is the JS counterpart to the `.rd-dark` token flip in theme.css.

const LIGHT = {
  bg:      "#d6d6d3",
  ink:     "#161513",
  ink2:    "#5c5b57",
  ink3:    "#908f8a",
  line:    "rgba(22,21,19,0.20)",
  line2:   "rgba(22,21,19,0.10)",
  blue:    "#2742ec",
  blueInk: "#f3f5ff",
  lime:    "#c2f53d",
  panel:   "#1a1916",
  // surface for hand-rolled tints/tracks that were hard-coded as rgba(22,21,19,a)
  fog:     "rgba(22,21,19,0.07)",
};

const DARK = {
  bg:      "#161513",
  ink:     "#f3f2ee",
  ink2:    "#b8b6b0",
  ink3:    "#84827c",
  line:    "rgba(243,242,238,0.22)",
  line2:   "rgba(243,242,238,0.10)",
  blue:    "#6e85ff",   // brightened so blue-as-text reads on the dark field
  blueInk: "#0d1330",   // ink reads on the brighter blue fill
  lime:    "#c2f53d",
  panel:   "#f3f2ee",
  fog:     "rgba(243,242,238,0.10)",
};

// Neutral ramp for data series — keeps charts restrained (grayscale) so the
// single focused datum can pop in blue/lime. Dark variant is the mirror.
const RAMP_LIGHT = ["#2b2a27", "#56544f", "#84827c", "#a9a7a1", "#c4c2bc"];
const RAMP_DARK  = ["#d8d6d0", "#a9a7a1", "#84827c", "#605e59", "#46443f"];

export let COLORS = LIGHT;
export let RAMP = RAMP_LIGHT;

let _dark = false;
export function setRDDark(d) {
  _dark = !!d;
  COLORS = _dark ? DARK : LIGHT;   // reassign live binding
  RAMP = _dark ? RAMP_DARK : RAMP_LIGHT;
}
export function isRDDark() { return _dark; }

export const FONTS = {
  sans: '"Archivo","Noto Sans SC",system-ui,sans-serif',
  mono: '"Space Mono",ui-monospace,monospace',
};

// rich(text, color?) — minimal inline-emphasis renderer so slide copy can live
// in defaultProps as plain strings. `**…**` segments become <strong> spans
// (tinted with `color`, default current ink). Returns an array of React nodes.
import React from "react";
export function rich(text, color) {
  if (text == null) return null;
  const parts = String(text).split(/\*\*([^*]+)\*\*/g);
  return parts.map((seg, i) =>
    i % 2 === 1
      ? React.createElement("strong", { key: i, style: { color: color || COLORS.ink, fontWeight: 700 } }, seg)
      : seg
  );
}
