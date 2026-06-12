// AclPrimitives.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared, portable primitives for the "AI Capital Lab" deck template.
// Aesthetic: bold editorial scrapbook — electric yellow, heavy display type,
// hand-drawn doodles, sticker labels, cut-out photo collage.
//
// Everything here is plain React (no preview-runtime dependency) so it migrates
// cleanly into any React project. All CSS class names are prefixed `acl-`.
//
// Exports to window: AclThemeStyle, Doodle, Sticker, MetaTag, AdaptiveImageSlot,
//                    ACL_TOKENS (token CSS string you can paste onto any root).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

// Brand tokens — paste onto any page root so a page works standalone.
const ACL_TOKENS = `
  --acl-yellow:#ECEF35;
  --acl-lilac:#E7E6EE;
  --acl-ink:#16150F;
  --acl-pink:#FF3D97;
  --acl-red:#E83B22;
  --acl-blue:#8DBEEC;
  --acl-paper:#FBFAF4;
  --acl-font-cn:"Noto Sans SC",-apple-system,sans-serif;
  --acl-font-num:"Anton","Noto Sans SC",sans-serif;
  --acl-font-mono:"Noto Sans SC",-apple-system,sans-serif;
  --acl-font-hand:"Noto Sans SC",-apple-system,sans-serif;
`;

// Theme container styles (fonts assumed loaded in host <head>). Class-scoped to
// `.acl-root` — mount this ONCE near the root of wherever the pages render.
export function AclTheme() {
  return (
    <style>{`
      .acl-root{ ${ACL_TOKENS} }
      .acl-root *{ box-sizing:border-box; }

      /* ── doodles ─────────────────────────────── */
      .acl-doodle{ position:absolute; pointer-events:none; color:var(--acl-ink);
        animation:acl-wiggle 6s ease-in-out infinite; transform-origin:center; }
      .acl-doodle--spark{ color:var(--acl-ink); }
      @keyframes acl-wiggle{ 0%,100%{ transform:rotate(var(--r,0deg)); }
        50%{ transform:rotate(calc(var(--r,0deg) + 2deg)); } }
      @media (prefers-reduced-motion:reduce){ .acl-doodle{ animation:none; } }

      /* ── inline marker highlight ─────────────── */
      .acl-hl{ background:var(--acl-blue); padding:0 .14em; white-space:nowrap;
        box-decoration-break:clone; -webkit-box-decoration-break:clone; }

      /* ── sticker label (one- or two-tone) ────── */
      .acl-sticker{ display:inline-flex; align-items:stretch; line-height:1;
        font-family:var(--acl-font-mono); font-weight:700; white-space:nowrap;
        box-shadow:2px 3px 0 rgba(22,21,15,.18); }
      .acl-sticker b, .acl-sticker span{ padding:7px 11px 6px; display:flex;
        align-items:center; font-weight:700; }
      .acl-sticker b{ color:var(--acl-ink); }
      .acl-sticker span{ font-weight:400; }

      /* ── meta tag (data chip) ────────────────── */
      .acl-metatag{ display:flex; flex-direction:column; gap:3px; }
      .acl-metatag .k{ font-family:var(--acl-font-mono); font-size:15px;
        letter-spacing:.08em; text-transform:uppercase; color:rgba(22,21,15,.5); }
      .acl-metatag .v{ font-family:var(--acl-font-cn); font-weight:700;
        font-size:26px; color:var(--acl-ink); }

      /* ── adaptive image slot ─────────────────── */
      .acl-slot{ position:relative; display:inline-block; transition:width .3s,height .3s; }
      .acl-slot__frame{ position:relative; width:100%; height:100%; overflow:hidden;
        background:var(--acl-paper); border:8px solid var(--acl-paper);
        box-shadow:4px 6px 0 rgba(22,21,15,.2), 0 10px 26px rgba(22,21,15,.14); }
      .acl-slot__img{ width:100%; height:100%; object-fit:cover; display:block; }
      .acl-slot__empty{ position:absolute; inset:0; display:flex; flex-direction:column;
        align-items:center; justify-content:center; gap:9px; cursor:pointer;
        background:
          repeating-linear-gradient(135deg, rgba(22,21,15,.045) 0 9px, transparent 9px 18px),
          var(--acl-lilac);
        border:2px dashed rgba(22,21,15,.3); }
      .acl-slot__plus{ width:34px; height:34px; border-radius:50%; display:grid;
        place-items:center; background:var(--acl-ink); color:var(--acl-paper);
        font-size:22px; line-height:1; font-family:var(--acl-font-cn); }
      .acl-slot__cap{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
        text-transform:uppercase; color:rgba(22,21,15,.62); text-align:center; padding:0 8px; }
      .acl-slot--drag .acl-slot__empty{ background:var(--acl-yellow);
        border-color:var(--acl-ink); }
      .acl-slot__sticker{ position:absolute; left:50%; bottom:-14px; transform:translateX(-50%);
        z-index:3; }
      .acl-slot__hint{ position:absolute; top:7px; right:7px; z-index:3; opacity:0;
        font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.04em;
        background:var(--acl-ink); color:var(--acl-paper); padding:3px 6px;
        transition:opacity .15s; }
      .acl-slot:hover .acl-slot__hint{ opacity:.9; }
    `}</style>
  );
}

// ── Doodle: simple hand-drawn strokes (arrows / sparkles / heart) ─────────────
// kind: 'arrow' | 'arrowS' | 'spark' | 'loop' | 'star' | 'heart'
// For filled marks (spark/star/heart) pass fill + stroke to get the brand
// "yellow-fill, ink-outline" look: <Doodle kind="spark" fill="var(--acl-yellow)" stroke="var(--acl-ink)" />
function Doodle({ kind = 'spark', size = 54, color, fill = 'currentColor', stroke,
  strokeWidth = 4, rotate = 0, style = {}, className = '' }) {
  const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 3,
    strokeLinecap: 'round', strokeLinejoin: 'round' };
  const solid = { fill, stroke: stroke || 'none', strokeWidth: stroke ? strokeWidth : 0,
    strokeLinejoin: 'round' };
  const paths = {
    arrow: (
      <g {...line}>
        <path d="M6 18 Q40 6 73 37" />
        <path d="M57 32 L73 37 L67 21" />
      </g>
    ),
    arrowS: (
      <g {...line}>
        <path d="M7 15 Q37 17 72 41" />
        <path d="M56 37 L72 41 L66 24" />
      </g>
    ),
    loop: (
      <g {...line}>
        <path d="M58 18 C48 8, 24 10, 20 28 C17 44, 40 52, 56 42" />
        <path d="M49 53 L56 42 L43 43" />
      </g>
    ),
    spark: (
      <g {...solid}>
        <path d="M27 2 C29 18, 32 21, 52 27 C32 33, 29 36, 27 52 C25 36, 22 33, 2 27 C22 21, 25 18, 27 2 Z" />
      </g>
    ),
    star: (
      <g {...solid}>
        <path d="M27 3 L34 20 L52 21 L38 33 L43 51 L27 40 L11 51 L16 33 L2 21 L20 20 Z" />
      </g>
    ),
    heart: (
      <g {...solid}>
        <path d="M27 49 C7 35, 7 15, 21 15 C26 15, 27 21, 27 24 C27 21, 28 15, 33 15 C47 15, 47 35, 27 49 Z" />
      </g>
    ),
  };
  const filled = kind === 'spark' || kind === 'star' || kind === 'heart';
  return (
    <svg className={`acl-doodle ${filled ? 'acl-doodle--spark' : ''} ${className}`}
         viewBox="0 0 84 60" width={size} height={size * 60 / 84} aria-hidden="true"
         style={{ '--r': `${rotate}deg`, color, ...style }}>
      {paths[kind]}
    </svg>
  );
}

// ── Sticker: rotated highlighter name-tag (one- or two-tone) ────────────────
function Sticker({ label, sub, color = 'var(--acl-yellow)', subColor, rotate = -3,
  size = 16, style = {} }) {
  return (
    <span className="acl-sticker" style={{ transform: `rotate(${rotate}deg)`, fontSize: size, ...style }}>
      <b style={{ background: color }}>{label}</b>
      {sub && <span style={{ background: subColor || color,
        color: subColor ? 'var(--acl-paper)' : 'var(--acl-ink)' }}>{sub}</span>}
    </span>
  );
}

// ── MetaTag: key/value data chip ────────────────────────────────────────────
function MetaTag({ k, v }) {
  return (
    <div className="acl-metatag">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}

// ── AdaptiveImageSlot ───────────────────────────────────────────────────────
// Portable, pure-React drag/drop image placeholder that RESIZES ITSELF to the
// dropped image's aspect ratio (fits inside a `box`×`box` bounding square), so
// the collage stays balanced for any photo. Persists to localStorage by `id`.
//
// props:
//   id*        string  persistence key (required for reload survival)
//   box        number  bounding-square size in px (default 300)
//   ratio      number  empty-state aspect (w/h) before a photo is dropped (0.8)
//   placeholder string mono caption shown when empty
//   sticker    {label,sub,color,rotate}  optional sticker pinned to the slot
//   rotate     number  slot rotation in deg
//   accent     string  border color of the photo frame
function AdaptiveImageSlot({ id, box = 300, ratio = 0.8, placeholder = '拖入图片',
  sticker, rotate = 0, accent = 'var(--acl-paper)' }) {
  const key = 'acl-slot-' + id;
  const [data, setData] = React.useState(null);
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setData(JSON.parse(s)); } catch (e) {}
  }, [key]);

  const save = (d) => {
    setData(d);
    try { d ? localStorage.setItem(key, JSON.stringify(d)) : localStorage.removeItem(key); } catch (e) {}
  };
  const readFile = (file) => {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => save({ src: r.result, w: img.naturalWidth, h: img.naturalHeight });
      img.src = r.result;
    };
    r.readAsDataURL(file);
  };

  const aspect = data ? data.w / data.h : ratio;
  let w, h;
  if (aspect >= 1) { w = box; h = Math.round(box / aspect); }
  else { h = box; w = Math.round(box * aspect); }

  return (
    <div className={'acl-slot' + (drag ? ' acl-slot--drag' : '')}
         style={{ width: w, height: h, transform: `rotate(${rotate}deg)` }}
         onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
         onDragLeave={() => setDrag(false)}
         onDrop={(e) => { e.preventDefault(); setDrag(false);
           readFile(e.dataTransfer.files && e.dataTransfer.files[0]); }}>
      <div className="acl-slot__frame" style={{ borderColor: accent }}>
        {data
          ? <img className="acl-slot__img" src={data.src} alt="" />
          : (
            <div className="acl-slot__empty" onClick={() => inputRef.current && inputRef.current.click()}>
              <div className="acl-slot__plus">+</div>
              <div className="acl-slot__cap">{placeholder}</div>
            </div>
          )}
        {data && <div className="acl-slot__hint" onClick={() => save(null)}>清除 ✕</div>}
      </div>
      {sticker && (
        <div className="acl-slot__sticker">
          <Sticker {...sticker} />
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
             onChange={(e) => readFile(e.target.files && e.target.files[0])} />
    </div>
  );
}

export { ACL_TOKENS, Doodle, Sticker, MetaTag, AdaptiveImageSlot };
