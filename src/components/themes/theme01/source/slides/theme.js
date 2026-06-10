// theme.js — shared design tokens + scoped stylesheet for the AI-funding deck.
// Standard ES module. No globals, no window registration.
//
// All CSS is scoped under `.aip-root` (never :root), and every class carries
// the `aip-` prefix, so dropping these components into another React app can
// not leak styles into the host. Import THEME for token values, THEME_CSS for
// the raw stylesheet string, and FONT_HREF for the optional webfont link.

export const THEME = {
  ink: '#2b2b30',
  ink2: '#56565c',
  ink3: '#9a9ba4',
  red: '#e8503a',
  blue: '#5b8def',
  green: '#46b083',
  amber: '#e0a23a',
  violet: '#7a5ae0',
  // shared accent ordering used by charts / palettes
  series: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
};

export const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Space+Mono:wght@400;700&display=swap';

// hex → rgba() with alpha. Accepts #rgb or #rrggbb.
export function hexA(hex, a) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

export const THEME_CSS = `
.aip-root{
  --aip-type-display:128px; --aip-type-title:78px; --aip-type-subtitle:42px;
  --aip-type-en:28px; --aip-type-body:30px; --aip-type-small:24px; --aip-type-mono:24px;
  --aip-pad-x:108px; --aip-pad-top:92px; --aip-pad-bottom:84px; --aip-gap:40px;
  --aip-ink:#2b2b30; --aip-ink-2:#56565c; --aip-ink-3:#9a9ba4;
  --aip-red:#e8503a; --aip-blue:#5b8def; --aip-green:#46b083; --aip-amber:#e0a23a; --aip-violet:#7a5ae0;
  position:relative; width:100%; height:100%; overflow:hidden;
  font-family:'Noto Sans SC',system-ui,sans-serif; color:var(--aip-ink);
  -webkit-font-smoothing:antialiased;
}
.aip-root *{box-sizing:border-box;}

/* backgrounds */
.aip-bg{position:absolute;inset:0;}
.aip-bg-a{background:
  radial-gradient(40% 52% at 16% 20%, rgba(120,150,255,.22), transparent 70%),
  radial-gradient(34% 44% at 84% 14%, rgba(255,150,195,.18), transparent 72%),
  radial-gradient(42% 52% at 80% 84%, rgba(110,212,172,.20), transparent 72%),
  radial-gradient(36% 46% at 22% 88%, rgba(245,202,128,.16), transparent 72%),
  linear-gradient(135deg, #eef0f5, #e6e7ee);}
.aip-bg-b{background:
  radial-gradient(38% 50% at 82% 18%, rgba(245,196,150,.22), transparent 72%),
  radial-gradient(36% 46% at 14% 26%, rgba(150,170,255,.18), transparent 72%),
  radial-gradient(44% 54% at 24% 86%, rgba(255,160,190,.16), transparent 72%),
  radial-gradient(38% 48% at 84% 82%, rgba(120,210,180,.16), transparent 72%),
  linear-gradient(135deg, #f1efec, #e9e8e6);}
.aip-bg::after{content:"";position:absolute;inset:0;
  background:radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,.55), transparent 55%);}

.aip-content{position:absolute;inset:0;
  padding:var(--aip-pad-top) var(--aip-pad-x) var(--aip-pad-bottom);
  display:flex;flex-direction:column;}

/* tags / pills */
.aip-tag{display:inline-block;white-space:nowrap;padding:5px 15px;border-radius:9px;color:#fff;
  font-weight:700;font-size:var(--aip-type-small);letter-spacing:.04em;line-height:1.3;}
.aip-tag-red{background:var(--aip-red);} .aip-tag-blue{background:var(--aip-blue);}
.aip-tag-green{background:var(--aip-green);} .aip-tag-amber{background:var(--aip-amber);}
.aip-tag-violet{background:var(--aip-violet);}

.aip-mono{font-family:'Space Mono',monospace;color:var(--aip-ink-3);
  font-size:var(--aip-type-mono);letter-spacing:.02em;margin-top:34px;}
.aip-en{font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:.16em;
  color:#aaabb4;font-size:var(--aip-type-en);}

/* slide head block */
.aip-head{display:flex;flex-direction:column;gap:14px;}
.aip-head .aip-kicker{align-self:flex-start;}
.aip-head h2{margin:0;font-size:var(--aip-type-title);font-weight:900;color:var(--aip-ink);
  letter-spacing:.012em;line-height:1.05;}
.aip-head .aip-sub{display:flex;align-items:baseline;gap:20px;flex-wrap:wrap;}
.aip-head .aip-sub .aip-cn{font-size:var(--aip-type-subtitle);font-weight:700;color:#7e7f8a;}

.aip-glass{background:rgba(255,255,255,.5);backdrop-filter:blur(28px) saturate(140%);
  -webkit-backdrop-filter:blur(28px) saturate(140%);
  border:1px solid rgba(255,255,255,.7);border-radius:24px;
  box-shadow:0 1px 0 rgba(255,255,255,.75) inset,0 24px 60px rgba(70,72,100,.13);}

/* entrance — transform-only so a frozen/paused timeline or print/reduced-motion
   can never hide content; the visible end-state is the base style. */
@media (prefers-reduced-motion:no-preference){
  [data-deck-active] .aip-content > *{animation:aip-rise .55s both;}
  [data-deck-active] .aip-content > *:nth-child(2){animation-delay:.05s;}
  [data-deck-active] .aip-content > *:nth-child(3){animation-delay:.1s;}
  [data-deck-active] .aip-content > *:nth-child(4){animation-delay:.15s;}
  @keyframes aip-rise{from{transform:translateY(14px);}to{transform:none;}}
}
`;
