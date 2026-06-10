/**
 * theme.js — shared design base for the AI-Capital report template.
 *
 * Migration notes
 * ───────────────
 * • This is the ONLY shared module the page components depend on (plus viz.jsx).
 * • It defines design tokens + two tiny runtime helpers. It NEVER writes to
 *   :root or any global selector — every rule a page injects is scoped under
 *   that page's own root class (e.g. `.aic-cover`), so dropping a page into
 *   another React app cannot leak styles onto the host.
 * • In a bundler-based project you can replace `injectScopedStyle` with a CSS
 *   module / styled-components / Tailwind layer; the token object stays useful.
 */

export const THEME = {
  // brand — signature lime/chartreuse
  accent:       '#86D62B',   // vivid lime — primary accent
  accentBright: '#AEEA46',   // highlight lime (gradients / glow)
  accentDeep:   '#5FA01A',   // deep lime (disc cores / shadows)
  accentSoft:   '#E9FBC6',   // pale lime wash
  // neutrals (warm-leaning, low chroma)
  ink:    '#0E110B',         // near-black text / dark panels
  inkDim: '#3D413A',
  paper:  '#FAFAF6',         // off-white page
  card:   '#FFFFFF',
  muted:  '#83877C',         // secondary text
  faint:  '#B7BBB0',         // tertiary text / labels
  hair:   'rgba(14,17,11,0.10)',   // hairline divider
  hairStrong: 'rgba(14,17,11,0.16)',
  // data semantics
  pos:  '#34B24A',
  neg:  '#E8443B',
  warn: '#EFA63A',
  // type
  fontDisplay: "'Space Grotesk','Noto Sans SC',system-ui,sans-serif",
  fontText:    "'Noto Sans SC','Space Grotesk',system-ui,sans-serif",
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700;900&display=swap';

let _fontsDone = false;
export function ensureFonts() {
  if (_fontsDone || typeof document === 'undefined') return;
  _fontsDone = true;
  for (const [rel, href, cross] of [
    ['preconnect', 'https://fonts.googleapis.com'],
    ['preconnect', 'https://fonts.gstatic.com', true],
    ['stylesheet', FONT_HREF],
  ]) {
    const l = document.createElement('link');
    l.rel = rel; l.href = href;
    if (cross) l.crossOrigin = 'anonymous';
    document.head.appendChild(l);
  }
}

const _styleIds = new Set();
/** Inject a <style> exactly once, keyed by id. CSS must be self-scoped. */
export function injectScopedStyle(id, css) {
  if (typeof document === 'undefined' || _styleIds.has(id)) return;
  _styleIds.add(id);
  const el = document.createElement('style');
  el.setAttribute('data-aic-style', id);
  el.textContent = css;
  document.head.appendChild(el);
}

/** Build the CSS-custom-property style object set on a page root element.
 *  Accent is overridable per-page via the `accentColor` prop. */
export function themeVars(accent) {
  const a = accent || THEME.accent;
  return {
    '--aic-accent': a,
    '--aic-accent-bright': THEME.accentBright,
    '--aic-accent-deep': THEME.accentDeep,
    '--aic-accent-soft': THEME.accentSoft,
    '--aic-ink': THEME.ink,
    '--aic-ink-dim': THEME.inkDim,
    '--aic-paper': THEME.paper,
    '--aic-card': THEME.card,
    '--aic-muted': THEME.muted,
    '--aic-faint': THEME.faint,
    '--aic-hair': THEME.hair,
    '--aic-hair-strong': THEME.hairStrong,
    '--aic-pos': THEME.pos,
    '--aic-neg': THEME.neg,
    '--aic-warn': THEME.warn,
    '--aic-font-display': THEME.fontDisplay,
    '--aic-font-text': THEME.fontText,
  };
}
