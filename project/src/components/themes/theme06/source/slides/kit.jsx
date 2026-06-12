// ============================================================================
// kit.jsx — Shared design kit for the report deck template.
// The ONE shared dependency of every Slide* component.
//
// Migration notes:
//   • Standard ES module: `import React from 'react'` + named `export`s.
//     No window registration — import what you need:
//       import { KxEyebrow, KxImageSlot } from './kit.jsx';
//   • All CSS class names use the `kx-` prefix → won't collide after migration.
//   • Design tokens are scoped to the `.kx-slide` theme container (NOT :root),
//     so importing the kit never pollutes the global stylesheet of a host app.
//   • Requires fonts: Archivo (800/900), Noto Sans SC (700/900), Space Mono (400/700).
//   • Nothing here depends on the deck host or the Tweaks panel — pure React.
// ============================================================================
import React from 'react';

const CSS = `
  /* design tokens — scoped to the slide/theme container, never :root */
  .kx-slide{
    --kx-ink:#0c0c0c; --kx-ink-2:#141414; --kx-ink-3:#1c1c1c;
    --kx-cream:#f0efe6; --kx-cream-2:#e6e4d8;
    --kx-accent:#c8f135; --kx-mute:#c8c8c0; --kx-mute-2:#9a9a92;
    --kx-line:rgba(255,255,255,.10); --kx-line-d:rgba(0,0,0,.14);
    --kx-disp:'Archivo','Noto Sans SC',system-ui,sans-serif;
    --kx-mono:'Space Mono','Noto Sans SC',monospace;
    --kx-pad-x:96px; --kx-pad-y:72px;
  }
  .kx-slide{position:absolute;inset:0;font-family:var(--kx-disp);
    -webkit-font-smoothing:antialiased;overflow:hidden;}
  .kx-slide *{box-sizing:border-box;}
  .kx-dark{background:var(--kx-ink);color:var(--kx-cream);}
  .kx-light{background:var(--kx-cream);color:var(--kx-ink);}
  .kx-pad{position:absolute;inset:0;padding:var(--kx-pad-y) var(--kx-pad-x);}

  /* vertical column grid lines */
  .kx-grid{position:absolute;inset:0;pointer-events:none;display:grid;}
  .kx-grid>span{border-left:1px solid var(--kx-line);}
  .kx-light .kx-grid>span{border-left:1px solid var(--kx-line-d);}

  /* mono eyebrow  [NN] LABEL_ */
  .kx-eyebrow{font-family:var(--kx-mono);font-size:24px;letter-spacing:.04em;
    display:inline-flex;align-items:baseline;gap:.5ch;font-weight:700;white-space:nowrap;}
  .kx-eyebrow .kx-eb-id{color:inherit;opacity:.55;}
  .kx-eyebrow .kx-eb-label{color:var(--kx-accent);}
  .kx-eyebrow .kx-eb-caret{color:var(--kx-accent);
    animation:kx-blink 1.1s steps(1) infinite;}
  @keyframes kx-blink{50%{opacity:0}}

  /* display headline */
  .kx-h1{font-weight:900;text-transform:uppercase;line-height:.92;
    letter-spacing:-.01em;margin:0;}
  .kx-h2{font-weight:800;text-transform:uppercase;line-height:.96;
    letter-spacing:-.01em;margin:0;}
  .kx-cjk{font-family:var(--kx-disp);font-weight:900;letter-spacing:.01em;
    text-transform:none;line-height:1.04;}
  .kx-hl{color:var(--kx-accent);}            /* bracket highlight */
  .kx-hl::before{content:'[';}.kx-hl::after{content:']';}

  /* mono caption / meta */
  .kx-mono{font-family:var(--kx-mono);font-size:24px;letter-spacing:.02em;}
  .kx-cap{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);
    letter-spacing:.03em;text-transform:uppercase;}

  /* mono chip */
  .kx-chips{display:flex;flex-wrap:wrap;gap:14px;}
  .kx-chip{font-family:var(--kx-mono);font-size:24px;font-weight:700;
    padding:9px 16px;letter-spacing:.02em;text-transform:uppercase;
    background:var(--kx-ink-3);color:var(--kx-cream);
    border:1px solid var(--kx-line);white-space:nowrap;}
  .kx-light .kx-chip{background:rgba(0,0,0,.06);color:var(--kx-ink);
    border-color:var(--kx-line-d);}
  .kx-chip.kx-on{background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}

  /* diagonal hatch strip */
  .kx-hatch{height:18px;width:100%;
    background-image:repeating-linear-gradient(45deg,
      var(--kx-mute-2) 0 2px,transparent 2px 9px);opacity:.5;}

  /* outlined lime button */
  .kx-btn{display:inline-flex;align-items:center;justify-content:space-between;
    gap:24px;min-width:300px;padding:20px 22px;
    border:1px solid var(--kx-line);background:transparent;color:inherit;
    font-family:var(--kx-mono);font-weight:700;font-size:24px;letter-spacing:.03em;
    text-transform:uppercase;border-bottom:3px solid var(--kx-accent);}
  .kx-light .kx-btn{border-color:var(--kx-line-d);border-bottom-color:var(--kx-accent);}
  .kx-arrow{display:grid;grid-template-columns:repeat(3,7px);gap:3px;}
  .kx-arrow i{width:7px;height:7px;background:var(--kx-accent);display:block;}
  .kx-arrow i:nth-child(1){grid-column:1;}
  .kx-arrow i:nth-child(2){grid-column:2;}
  .kx-arrow i:nth-child(3){grid-column:3;}

  /* big stat number */
  .kx-stat-n{font-family:var(--kx-disp);font-weight:800;line-height:.9;
    letter-spacing:-.02em;font-size:92px;}
  .kx-stat-c{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.03em;margin-top:14px;}

  /* stacked-bar data placeholder */
  .kx-bars{display:flex;flex-direction:column;gap:9px;width:100%;}
  .kx-bars i{height:11px;display:block;background:var(--kx-mute);}
  .kx-bars i.kx-bd{background:var(--kx-ink);}
  .kx-light .kx-bars i.kx-bd{background:var(--kx-ink);}
  .kx-dark .kx-bars i{background:#3a3a36;} .kx-dark .kx-bars i.kx-bd{background:var(--kx-cream);}
  .kx-bars.kx-dots{flex-direction:row;flex-wrap:wrap;gap:10px;align-content:flex-start;}
  .kx-bars.kx-dots i{width:11px;height:11px;border-radius:50%;}
  .kx-bars.kx-stack{flex-direction:row;gap:0;height:18px;}
  .kx-bars.kx-stack i{height:18px;flex:1;}

  /* watermark wordmark */
  .kx-wm{position:absolute;font-family:var(--kx-disp);font-weight:900;
    text-transform:uppercase;letter-spacing:-.02em;line-height:.8;
    color:currentColor;opacity:.05;pointer-events:none;user-select:none;white-space:nowrap;}

  /* status bar */
  .kx-statusbar{display:flex;align-items:center;justify-content:space-between;
    font-family:var(--kx-mono);font-size:24px;letter-spacing:.03em;
    text-transform:uppercase;}
  .kx-statusbar .kx-wordmark{font-family:var(--kx-disp);font-weight:900;
    font-size:30px;letter-spacing:-.01em;}
  .kx-statusbar .kx-reg{font-size:.5em;vertical-align:super;opacity:.6;}

  /* adaptive image slot */
  .kx-imgslot{position:relative;width:100%;overflow:hidden;cursor:pointer;
    background:
      repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0 10px,rgba(255,255,255,.02) 10px 20px);
    border:1px solid var(--kx-line);display:flex;align-items:center;justify-content:center;}
  .kx-light .kx-imgslot{background:
      repeating-linear-gradient(45deg,rgba(0,0,0,.05) 0 10px,rgba(0,0,0,.02) 10px 20px);
    border-color:var(--kx-line-d);}
  .kx-imgslot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
  .kx-imgslot .kx-slot-ph{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.05em;text-align:center;padding:0 18px;z-index:1;}
  .kx-imgslot.kx-drag{outline:2px solid var(--kx-accent);outline-offset:-2px;}
  .kx-imgslot .kx-slot-badge{position:absolute;left:0;bottom:0;z-index:2;
    font-family:var(--kx-mono);font-size:24px;padding:6px 12px;letter-spacing:.04em;
    background:rgba(0,0,0,.6);color:var(--kx-cream);text-transform:uppercase;
    display:flex;align-items:center;gap:8px;}
  .kx-imgslot .kx-slot-badge::before{content:'';width:8px;height:8px;border-radius:50%;
    background:var(--kx-accent);}
`;

// Inject scoped CSS once (idempotent — safe under module caching or re-import).
if (typeof document !== 'undefined' && !document.getElementById('kx-kit-css')) {
  const s = document.createElement('style');
  s.id = 'kx-kit-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}

const h = React.createElement;

// -- Column grid lines overlay -------------------------------------------
export function KxGrid({ cols = 6 }) {
  return h('div', { className: 'kx-grid', style: { gridTemplateColumns: `repeat(${cols},1fr)` } },
    Array.from({ length: cols }, (_, i) => h('span', { key: i })));
}

// -- Eyebrow  [NN] LABEL_ -------------------------------------------------
export function KxEyebrow({ id, label }) {
  return h('span', { className: 'kx-eyebrow' },
    h('span', { className: 'kx-eb-id' }, `[${id}]`),
    h('span', { className: 'kx-eb-label' }, label),
    h('span', { className: 'kx-eb-caret' }, '_'));
}

// -- Mono chip ------------------------------------------------------------
export function KxChip({ children, on }) {
  return h('span', { className: 'kx-chip' + (on ? ' kx-on' : '') }, children);
}

// -- Hatch strip ----------------------------------------------------------
export function KxHatch(props) { return h('div', { className: 'kx-hatch', ...props }); }

// -- Stacked bar placeholder (chart stand-in) -----------------------------
export function KxBars({ rows = 8, dark = 0, variant = 'bars', style }) {
  // 'dark' = how many trailing rows are the strong colour
  const cls = 'kx-bars' + (variant === 'dots' ? ' kx-dots' : variant === 'stack' ? ' kx-stack' : '');
  return h('div', { className: cls, style },
    Array.from({ length: rows }, (_, i) =>
      h('i', { key: i, className: i >= rows - dark ? 'kx-bd' : '' })));
}

// -- Outlined lime button -------------------------------------------------
export function KxButton({ children }) {
  return h('div', { className: 'kx-btn' },
    h('span', null, children),
    h('span', { className: 'kx-arrow' }, h('i'), h('i'), h('i')));
}

// -- Big stat -------------------------------------------------------------
export function KxStat({ n, caption, on }) {
  return h('div', { className: 'kx-stat' },
    h('div', { className: 'kx-stat-n', style: on ? { color: 'var(--kx-accent)' } : null }, n),
    h('div', { className: 'kx-stat-c' }, caption));
}

// -- Status bar -----------------------------------------------------------
export function KxStatusBar({ wordmark = 'AI CAPITAL LAB', center, right, menu }) {
  return h('div', { className: 'kx-statusbar' },
    h('div', { className: 'kx-wordmark' }, wordmark, h('span', { className: 'kx-reg' }, '®')),
    center ? h('div', { className: 'kx-sb-center' }, center) : h('div'),
    h('div', { style: { display: 'flex', gap: '28px', alignItems: 'center' } },
      right ? h('div', null, right) : null,
      menu ? h('div', { style: { border: '1px solid var(--kx-line)', padding: '8px 16px' } }, '☰ ' + menu) : null));
}

// -- Adaptive image slot (self-contained, localStorage, ratio-aware) ------
export function KxImageSlot({ id, placeholder = 'DROP IMAGE', badge, minRatio = 0.6, maxRatio = 2.4, style }) {
  const key = 'kx-img-' + id;
  const [data, setData] = React.useState(null);
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setData(JSON.parse(raw)); } catch (e) {}
  }, [key]);

  const accept = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxRatio, Math.max(minRatio, img.naturalWidth / img.naturalHeight));
        const next = { src, ratio };
        setData(next);
        try { localStorage.setItem(key, JSON.stringify(next)); } catch (er) {}
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // adaptive aspect-ratio: container follows the image's natural ratio (clamped)
  const ar = data ? data.ratio : 1.6;
  return h('div', {
    className: 'kx-imgslot' + (drag ? ' kx-drag' : ''),
    style: { aspectRatio: String(ar), ...style },
    onClick: () => inputRef.current && inputRef.current.click(),
    onDragOver: (e) => { e.preventDefault(); setDrag(true); },
    onDragLeave: () => setDrag(false),
    onDrop: (e) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files[0]); },
  },
    data ? h('img', { src: data.src, alt: '' })
         : h('div', { className: 'kx-slot-ph' }, placeholder),
    badge ? h('div', { className: 'kx-slot-badge' }, badge) : null,
    h('input', {
      ref: inputRef, type: 'file', accept: 'image/*', style: { display: 'none' },
      onChange: (e) => accept(e.target.files[0]),
    }));
}
