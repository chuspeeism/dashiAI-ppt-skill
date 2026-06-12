// ============================================================================
// covertheme.jsx — Shared base theme for the four standalone COVER pages
// (SlideCoverA / B / C / D). Mirrors kit.jsx's philosophy:
//
//   • Standard ES module. Importing it injects the shared `.cv` base CSS ONCE
//     (idempotent) and exposes `cvInject(id, css)` so each cover page can add
//     its own variant CSS guarded by a unique id.
//   • Design tokens live on the `.cv` container (NOT :root) so importing a
//     cover page never pollutes a host app's global stylesheet after migration.
//   • Requires fonts: Noto Sans SC (400/500/700/900), Space Grotesk, Space Mono.
//   • Entrance animation keys off deck-stage's `[data-deck-active]` attribute,
//     exactly like the original static markup did — no host dependency in JS.
// ============================================================================
import React from 'react';

// Idempotent style injector — safe under module caching / re-import.
export function cvInject(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

const BASE = `
  .cv{
    --cv-bg:#0a0a0a; --cv-bg-soft:#141414; --cv-line:rgba(255,255,255,.10);
    --cv-lime:#d2fb30; --cv-ink:#f6f6f3; --cv-muted:#8d8d86; --cv-muted-2:#5e5e58;
    --cv-sans:'Noto Sans SC',sans-serif;
    --cv-en:'Space Grotesk','Noto Sans SC',sans-serif;
    --cv-mono:'Space Mono',monospace;
    box-sizing:border-box;
    position:absolute;inset:0;width:100%;height:100%;
    background:var(--cv-bg);color:var(--cv-ink);font-family:var(--cv-sans);overflow:hidden;
  }
  .cv *{box-sizing:border-box;}
  .cv .mono{font-family:var(--cv-mono);text-transform:uppercase;letter-spacing:.18em;font-size:16px;color:var(--cv-muted);}
  .cv .lime{color:var(--cv-lime);}
  .cv .kicker{display:inline-flex;align-items:center;gap:14px;font-family:var(--cv-mono);text-transform:uppercase;letter-spacing:.2em;font-size:16px;color:var(--cv-muted);white-space:nowrap;}
  .cv .kicker .dot{width:9px;height:9px;border-radius:50%;background:var(--cv-lime);box-shadow:0 0 16px var(--cv-lime);flex:none;}
  .cv .tag{display:inline-flex;align-items:center;gap:10px;white-space:nowrap;border:1px solid var(--cv-line);border-radius:999px;padding:14px 26px;font-size:22px;color:var(--cv-ink);background:rgba(255,255,255,.02);}
  .cv .tag.solid{background:var(--cv-lime);color:#0a0a0a;border-color:var(--cv-lime);font-weight:700;}
  .cv .brand-foot{font-family:var(--cv-mono);text-transform:uppercase;letter-spacing:.22em;font-size:14px;color:var(--cv-muted-2);display:flex;gap:28px;align-items:center;}
  .cv .brand-foot .v{color:var(--cv-ink);font-weight:700;letter-spacing:.28em;}
  .cv h1{font-family:var(--cv-sans);font-weight:900;letter-spacing:-.01em;margin:0;line-height:1.04;}

  @media(prefers-reduced-motion:no-preference){
    [data-deck-active] .cv .anim{animation:cv-rise .7s cubic-bezier(.2,.7,.2,1) both;}
    [data-deck-active] .cv .anim.d1{animation-delay:.06s;}
    [data-deck-active] .cv .anim.d2{animation-delay:.14s;}
    [data-deck-active] .cv .anim.d3{animation-delay:.22s;}
    [data-deck-active] .cv .anim.d4{animation-delay:.30s;}
    @keyframes cv-rise{from{transform:translateY(26px);}to{transform:none;}}
  }
`;

cvInject('cv-base-css', BASE);

export default cvInject;
