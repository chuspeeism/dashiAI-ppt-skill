/* =========================================================================
   PulseImageFrame — self-contained, prop-driven image slot.
   Migratable: depends only on React + the .pulse-imgframe CSS classes.
   - Controlled by props: { src, onChange, placeholder, label, editable, minAR, maxAR }
   - On drop / click-browse it reads the file as a data URL, measures the
     image's natural aspect ratio, and reports BOTH up via onChange(src, ar).
   - The frame sets its own aspect-ratio from the loaded image (clamped to
     [minAR, maxAR]) so composition stays balanced at any image proportion.
   ========================================================================= */
import React from 'react';

const { useState, useRef, useCallback } = React;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function PulseImageFrame(props) {
  const {
    src = null,
    ar = null,                 // stored aspect ratio (w/h) for src
    onChange,                  // (dataUrl|null, aspectRatio|null) => void
    placeholder = "拖入或点击上传图片",
    label = "",
    editable = true,
    minAR = 0.62,
    maxAR = 1.78,
    defaultAR = 1.5,
    fill = false,              // gallery mode: fill parent box, parent owns sizing
  } = props;

  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  const ingest = useCallback((file) => {
    if (!file || !file.type || file.type.indexOf("image") !== 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      const img = new Image();
      img.onload = () => {
        const natural = img.naturalWidth / img.naturalHeight;
        onChange && onChange(url, clamp(natural, minAR, maxAR));
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [onChange, minAR, maxAR]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setOver(false);
    if (!editable) return;
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    ingest(file);
  }, [editable, ingest]);

  const aspectRatio = src ? (ar || defaultAR) : defaultAR;
  const empty = !src;

  return (
    <div
      className={
        "pulse-imgframe" +
        (empty ? " pulse-imgframe--empty" : "") +
        (over ? " pulse-imgframe--over" : "")
      }
      style={fill
        ? { width: "100%", height: "100%" }
        : { aspectRatio: String(aspectRatio) }}
      onDragOver={editable ? (e) => { e.preventDefault(); setOver(true); } : undefined}
      onDragLeave={editable ? () => setOver(false) : undefined}
      onDrop={editable ? onDrop : undefined}
      onClick={editable && empty ? () => inputRef.current && inputRef.current.click() : undefined}
    >
      {src ? (
        <img src={src} alt={label || "image"} />
      ) : (
        <div className="pulse-imgframe__hint">{placeholder}</div>
      )}
      {label ? <div className="pulse-imgframe__corner">{label}</div> : null}
      {src && editable ? (
        <button
          className="pulse-imgframe__clear"
          title="清除"
          onClick={(e) => { e.stopPropagation(); onChange && onChange(null, null); }}
        >×</button>
      ) : null}
      {editable ? (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => ingest(e.target.files && e.target.files[0])}
        />
      ) : null}
    </div>
  );
}

export default PulseImageFrame;
export const controls = PulseImageFrame.controls || [];
export const defaults = PulseImageFrame.defaults || {};
