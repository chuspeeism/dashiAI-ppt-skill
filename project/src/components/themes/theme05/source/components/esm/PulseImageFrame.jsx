import React from 'react';
const window = globalThis.__theme05Window || (globalThis.__theme05Window = {});
globalThis.React = React;
/* =========================================================================
   PulseImageFrame — self-contained, prop-driven image slot.
   Migratable: depends only on React + the .pulse-imgframe CSS classes.
   - Controlled by props: { src, onChange, placeholder, label, editable, minAR, maxAR }
   - On drop / click-browse it reads the file as a data URL, measures the
     image's natural aspect ratio, and reports BOTH up via onChange(src, ar).
   - The frame sets its own aspect-ratio from the loaded image (clamped to
     [minAR, maxAR]) so composition stays balanced at any image proportion.
   ========================================================================= */
(function () {
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
    const stopSlotNavigation = useCallback((e) => { e.stopPropagation(); }, []);
    const openPicker = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      inputRef.current && inputRef.current.click();
    }, []);

    const ingest = useCallback((file) => {
      if (!file || !file.type || !/^(image|video)\//.test(file.type)) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        if (file.type.startsWith("video/")) {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            const natural = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : defaultAR;
            onChange && onChange({ src: url, kind: "video", type: file.type }, clamp(natural, minAR, maxAR));
          };
          video.onerror = () => onChange && onChange({ src: url, kind: "video", type: file.type }, defaultAR);
          video.src = url;
          return;
        }
        const img = new Image();
        img.onload = () => {
          const natural = img.naturalWidth / img.naturalHeight;
          onChange && onChange({ src: url, kind: "image", type: file.type }, clamp(natural, minAR, maxAR));
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    }, [onChange, minAR, maxAR, defaultAR]);

    const onDrop = useCallback((e) => {
      e.preventDefault(); e.stopPropagation(); setOver(false);
      if (!editable) return;
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      ingest(file);
    }, [editable, ingest]);

    const media = normalizeMedia(src);
    const aspectRatio = media ? (ar || defaultAR) : defaultAR;
    const empty = !media;

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
        onPointerDown={stopSlotNavigation}
        onMouseDown={stopSlotNavigation}
        onDragOver={editable ? (e) => { e.preventDefault(); e.stopPropagation(); setOver(true); } : undefined}
        onDragLeave={editable ? (e) => { e.stopPropagation(); setOver(false); } : undefined}
        onDrop={editable ? onDrop : undefined}
        onClick={editable ? openPicker : undefined}
      >
        {media ? (
          media.kind === "video"
            ? <video src={media.src} muted playsInline loop autoPlay preload="metadata" aria-label={label || "media"} />
            : <img src={media.src} alt={label || "image"} />
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
            accept="image/*,video/mp4,video/webm,video/quicktime,video/*"
            style={{ display: "none" }}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => { ingest(e.target.files && e.target.files[0]); e.target.value = ""; }}
          />
        ) : null}
      </div>
    );
  }

  function normalizeMedia(value) {
    if (!value) return null;
    if (typeof value === "string") return { src: value, kind: value.startsWith("data:video/") ? "video" : "image" };
    if (typeof value === "object" && value.src) {
      return {
        ...value,
        kind: value.kind || (String(value.type || value.src).startsWith("video/") || String(value.src).startsWith("data:video/") ? "video" : "image"),
      };
    }
    return null;
  }

  window.PulseImageFrame = PulseImageFrame;
})();

const Component = window.PulseImageFrame;
if (!Component) throw new Error('Missing theme05 component PulseImageFrame');
export const controls = Component.controls || [];
export const defaults = Component.defaults || Component.defaultProps || {};
export default Component;
