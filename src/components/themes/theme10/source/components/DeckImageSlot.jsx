// DeckImageSlot.jsx — a user-fillable image placeholder.
// Self-contained & migratable: depends only on React (imported). Click or drag an
// image onto it; the file is stored as a data URL in localStorage under `id`, so
// it survives reloads. Reports the image's natural aspect ratio via onAspect(r)
// so a parent layout can size the slot faithfully (no cropping when fit="cover"
// and the box already matches the ratio).
//
// Props:
//   id          string   persistence key (REQUIRED for persistence)
//   placeholder string   label shown in the empty state            default 'IMAGE'
//   fit         'cover' | 'contain'                                  default 'cover'
//   radius      number   corner radius in px                        default 18
//   onAspect    (ratio:number) => void   fires with naturalW/naturalH
//   className   string   extra class on the root

import React from 'react';

function DeckImageSlot({ id, placeholder = 'IMAGE', fit = 'cover', radius = 18, onAspect, className = '' }) {
  const storeKey = id ? `dslot:${id}` : null;
  const [src, setSrc] = React.useState(() => {
    try { return storeKey ? (localStorage.getItem(storeKey) || '') : ''; } catch (e) { return ''; }
  });
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => { dslotInjectStyle(); }, []);

  // Re-read when id changes (slots reused across counts keep their own image).
  React.useEffect(() => {
    try { setSrc(storeKey ? (localStorage.getItem(storeKey) || '') : ''); } catch (e) { /* noop */ }
  }, [storeKey]);

  const report = React.useCallback((dataUrl) => {
    if (!onAspect || !dataUrl) return;
    const im = new Image();
    im.onload = () => onAspect(im.naturalWidth / im.naturalHeight);
    im.src = dataUrl;
  }, [onAspect]);

  React.useEffect(() => { if (src) report(src); }, [src, report]);

  const ingest = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setSrc(url);
      try { if (storeKey) localStorage.setItem(storeKey, url); } catch (e) { /* quota */ }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => { e.preventDefault(); setOver(false); ingest(e.dataTransfer.files && e.dataTransfer.files[0]); };
  const clear = (e) => {
    e.stopPropagation();
    setSrc('');
    try { if (storeKey) localStorage.removeItem(storeKey); } catch (err) { /* noop */ }
  };

  return (
    <div className={`dslot ${over ? 'is-over' : ''} ${src ? 'is-filled' : ''} ${className}`}
         style={{ borderRadius: radius }}
         onClick={() => inputRef.current && inputRef.current.click()}
         onDragOver={(e) => { e.preventDefault(); setOver(true); }}
         onDragLeave={() => setOver(false)}
         onDrop={onDrop}>
      {src ? (
        <>
          <img className="dslot-img" src={src} alt="" style={{ objectFit: fit }} />
          <button className="dslot-clear" onClick={clear} aria-label="清除图片">✕</button>
        </>
      ) : (
        <div className="dslot-empty">
          <span className="dslot-label">{placeholder}</span>
          <span className="dslot-hint">点击或拖入图片</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden
             onChange={(e) => ingest(e.target.files && e.target.files[0])} />
    </div>
  );
}

function dslotInjectStyle() {
  if (document.getElementById('dslot-style')) return;
  const s = document.createElement('style');
  s.id = 'dslot-style';
  s.textContent = `
  .dslot{position:relative;width:100%;height:100%;overflow:hidden;cursor:pointer;
    background:
      repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 2px, transparent 2px 11px),
      var(--ds-bg-soft, #16181d);
    box-shadow: inset 0 0 0 1px var(--ds-line, rgba(243,244,246,.14));
    transition:box-shadow .18s ease, background .18s ease;}
  .dslot.is-over{box-shadow: inset 0 0 0 1.5px var(--ds-accent, #6f9bd8);}
  .dslot.is-filled{background:var(--ds-bg-soft,#16181d);box-shadow:none;}
  .dslot-img{position:absolute;inset:0;width:100%;height:100%;display:block;}
  .dslot-empty{position:absolute;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:12px;text-align:center;padding:18px;}
  .dslot-label{font-family:var(--font-mono,'IBM Plex Mono',monospace);
    font-size:24px;letter-spacing:.16em;text-transform:uppercase;
    color:var(--ds-faint, rgba(243,244,246,.42));}
  .dslot-hint{font-family:var(--font-mono,'IBM Plex Mono',monospace);
    font-size:24px;letter-spacing:.04em;color:var(--ds-faint, rgba(243,244,246,.28));}
  .dslot-clear{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;
    border-radius:50%;background:rgba(8,9,11,.55);color:#fff;font-size:24px;line-height:1;
    cursor:pointer;opacity:0;transition:opacity .15s ease;backdrop-filter:blur(6px);}
  .dslot:hover .dslot-clear{opacity:1;}
  `;
  document.head.appendChild(s);
}

export { DeckImageSlot };
export default DeckImageSlot;
