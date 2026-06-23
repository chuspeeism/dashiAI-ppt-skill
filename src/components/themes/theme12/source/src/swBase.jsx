// swBase.jsx — shared, dependency-light building blocks for the slide system.
// No global :root writes; the only global side effect is one <style> tag that
// registers webfonts + the marquee keyframe (idempotent, namespaced "sw-").
// Every visual token comes from swTheme and is applied as an inline style, so
// dropping a slide component into another React app needs nothing but this file
// + swTheme.js (+ SwImageSlot.jsx where used).

import React from 'react';
import { swTheme } from './swTheme.js';
import { DeckPageNumber, DeckPageCurrent } from '../../../runtime-helpers.jsx';

export { DeckPageNumber, DeckPageCurrent };

let _injected = false;
export function injectBaseStyles() {
  if (_injected || typeof document === 'undefined') return;
  if (document.getElementById('sw-base-style')) { _injected = true; return; }
  const s = document.createElement('style');
  s.id = 'sw-base-style';
  s.textContent =
    "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap');" +
    '@keyframes sw-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
    // Uses the independent `translate` property (not `transform`) so a slide's
    // own inline transforms (centering translateX(-50%), tilts, rotations) are
    // never clobbered by the reveal's end-state.
    '@keyframes sw-rise{from{opacity:0;translate:0 16px}to{opacity:1;translate:0 0}}' +
    '.sw-root *{box-sizing:border-box;margin:0;padding:0;}' +
    '.sw-root .sw-link{color:inherit;text-decoration:none;}';
  document.head.appendChild(s);
  _injected = true;
}

const C = swTheme.color, F = swTheme.font;

// Brush-highlight pill. tone: 'o' | 'p' | 'c' | 'g'.
// `block`: render as an inline-block with a constrained line-box so the painted
// background never grows past the text — use it inside big, tight-leading
// multi-line display headings where an inline pill would bleed into the line
// above. Baseline alignment is preserved so it still sits in the text flow.
const HL = { o: [C.hlO, '#3a2607'], p: [C.hlP, '#fff'], c: [C.hlC, '#0d2c44'], g: [C.hlG, '#234d12'] };
export function Hl({ children, tone = 'o', block = false, style }) {
  const [bg, fg] = HL[tone] || HL.o;
  const base = block
    ? { display: 'inline-block', lineHeight: 0.96, verticalAlign: 'baseline',
        background: bg, color: fg, borderRadius: '0.16em', padding: '0.07em 0.14em', whiteSpace: 'nowrap' }
    : { background: bg, color: fg, borderRadius: 9, padding: '1px 12px',
        WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', whiteSpace: 'nowrap' };
  return <span style={{ ...base, ...style }}>{children}</span>;
}

// ── Serializable rich-text renderer ─────────────────────────────────────
// Slide copy lives in each page's `defaultProps` as plain strings so the whole
// content contract is serializable. This helper renders those strings with a
// tiny marker syntax (no HTML, no functions in props):
//   "\n"      → line break
//   "[[x]]"   → brush highlight (<Hl>), props via opts.hl ({tone, block, style})
//   "**x**"   → strong emphasis, style via opts.strong
// Usage: {renderSwText(p.title, { hl: { tone: 'o' } })}
export function renderSwText(text, opts = {}) {
  if (text == null || text === '') return null;
  const hl = opts.hl || {};
  const strong = opts.strong || {};
  const parts = String(text).split(/(\[\[.*?\]\]|\*\*.*?\*\*|\n)/g).filter((s) => s !== '');
  return parts.map((s, i) => {
    if (s === '\n') return <br key={i} />;
    if (s.startsWith('[[') && s.endsWith(']]')) return <Hl key={i} {...hl}>{s.slice(2, -2)}</Hl>;
    if (s.startsWith('**') && s.endsWith('**')) return <b key={i} style={{ fontWeight: 700, ...strong }}>{s.slice(2, -2)}</b>;
    return <React.Fragment key={i}>{s}</React.Fragment>;
  });
}

// Simple geometric decoration. kind: 'circle'|'ring'|'teardrop'|'pentagon'.
export function Shape({ kind = 'circle', size = 80, color = '#000', border = 16, style }) {
  const base = { position: 'absolute', width: size, height: size, zIndex: 1, ...style };
  if (kind === 'ring') return <div style={{ ...base, border: border + 'px solid ' + color, borderRadius: '50%' }} />;
  if (kind === 'teardrop') return <div style={{ ...base, background: color, borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)' }} />;
  if (kind === 'pentagon') return <div style={{ ...base, background: color, clipPath: 'polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)' }} />;
  return <div style={{ ...base, background: color, borderRadius: '50%' }} />;
}

export function Kicker({ children, accent = C.orange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.mono,
      fontSize: 24, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: accent }}>
      <span style={{ width: 40, height: 3, background: accent, borderRadius: 2 }} />
      <span>{children}</span>
    </div>
  );
}

export function Bar({ meta, accent = C.orange, dark = false }) {
  const fg = dark ? '#fff' : C.ink;
  const metaC = dark ? 'rgba(255,255,255,.82)' : C.inkMut;
  const line = dark ? C.lineD : C.line;
  return (
    <div data-sw-unit="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingBottom: 20, borderBottom: '1px solid ' + line, flexShrink: 0, position: 'relative', zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <span style={{ width: 16, height: 16, background: accent, borderRadius: 4 }} />
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.2em', color: fg }}>CREATIVE SYSTEM</span>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase', color: metaC }}>{meta}</div>
    </div>
  );
}

export function Footer({ page = '01', total = '04', accent = C.orange, dark = false, divider = true }) {
  const line = dark ? C.lineD : C.line;
  const fg = dark ? 'rgba(255,255,255,.82)' : C.inkMut;
  return (
    <div data-sw-unit="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      paddingTop: divider ? 18 : 0, borderTop: divider ? '1px solid ' + line : 'none', fontFamily: F.mono, fontSize: 24,
      letterSpacing: '.12em', textTransform: 'uppercase', color: fg, position: 'relative', zIndex: 5 }}>
      <div>CREATIVE SYSTEM — Independent Media Kit</div>
      <div><DeckPageNumber page={page} total={total} accentStyle={{ color: accent }} /></div>
    </div>
  );
}

// ── Staggered entrance reveal ──────────────────────────────────────────────
// Universal "elements appear one by one" effect for every slide, driven from
// the shared shell so no per-slide wiring is needed. It animates the slide's
// top-level layout blocks (descending one level into multi-child containers so
// e.g. each card / column / stat reveals on its own beat). Bar & Footer are
// tagged data-sw-unit and animate as single units. Self-contained: gated on the
// deck's [data-deck-active] when present, falls back to a one-shot reveal on
// mount elsewhere, and is a no-op under prefers-reduced-motion (content stays
// visible) so print / PDF / reduced-motion never freeze on a hidden frame.
export function swDeckSection(root) {
  return root?.closest?.('[data-deck-slide], .slide');
}

function swRevealTargets(root) {
  const out = [];
  for (const k of Array.from(root.children)) {
    if (!(k instanceof Element) || k.hasAttribute('data-sw-no-reveal')) continue;
    const kids = Array.from(k.children).filter((c) => c instanceof Element);
    if (!k.hasAttribute('data-sw-unit') && kids.length >= 2) out.push(...kids);
    else out.push(k);
  }
  return out;
}
function swPlayReveal(root) {
  swRevealTargets(root).forEach((el, i) => {
    el.style.animation = 'none';
    void el.offsetWidth; // restart if replaying
    const delay = (Math.min(i, 18) * 0.06).toFixed(2);
    el.style.animation = 'sw-rise .62s cubic-bezier(.22,.61,.36,1) ' + delay + 's both';
  });
}
function swClearReveal(root) {
  swRevealTargets(root).forEach((el) => { el.style.animation = ''; });
}

// Hook: drives the staggered entrance reveal for a slide root element. Pass a
// ref to the outermost slide <div>. Used by SlideRoot and by slides that build
// their own root (Cover, FullBleed). Self-contained — see notes above.
export function useSwReveal(ref) {
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const section = swDeckSection(root);
    if (!section) {
      swPlayReveal(root); // not inside a deck — reveal once on mount
      return;
    }
    const sync = () => { section.hasAttribute('data-deck-active') ? swPlayReveal(root) : swClearReveal(root); };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(section, { attributes: true, attributeFilter: ['data-deck-active'] });
    return () => mo.disconnect();
  }, [ref]);
}

// Outer slide shell: fills the deck-stage section, applies font/background,
// injects base styles once. Children compose the layout.
export function SlideRoot({ bg = C.blush, color = C.ink, className = '', style, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => { injectBaseStyles(); }, []);
  useSwReveal(ref);
  return (
    <div ref={ref} className={'sw-root ' + className} style={{ position: 'absolute', inset: 0, boxSizing: 'border-box',
      background: bg, color, fontFamily: F.sans, WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: swTheme.pad.t + 'px ' + swTheme.pad.x + 'px ' + swTheme.pad.b + 'px', ...style }}>
      {children}
    </div>
  );
}
