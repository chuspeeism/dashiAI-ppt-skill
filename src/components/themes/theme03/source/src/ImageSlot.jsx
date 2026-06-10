import React from "react";
import { COLORS, FONTS } from "./theme.js";

/* ============================================================================
   ImageSlot / ImageGallery — portable, props-driven image placeholders.

   • No globals, no runtime bridge — a user drops/picks a file, it's read to a
     data URL in local state and (optionally) bubbled up via onChange.
   • Aspect-adaptive: each slot reports the natural aspect ratio of its image;
     ImageGallery re-flows as a *justified row* so any mix of portrait /
     landscape uploads stays edge-aligned and well-composed.
   • Count-adaptive: ImageGallery renders `count` slots (0…n) and the justified
     math keeps the composition tidy at every count.

   These are demo-friendly (manage their own state) but fully controllable:
   pass `images` + `onChange` to ImageGallery to lift state into a parent/store.
   ========================================================================== */

const EMPTY_RATIO = 3 / 2;

export function ImageSlot({
  src = null,
  ratio = EMPTY_RATIO,
  width,
  height,
  fit = "cover",
  radius = 0,
  caption = "图片 / IMAGE",
  index,
  editable = true,
  onUpload,          // (dataUrl, naturalRatio) => void
}) {
  const [hover, setHover] = React.useState(false);
  const inputRef = React.useRef(null);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const img = new Image();
      img.onload = () => onUpload && onUpload(url, img.naturalWidth / img.naturalHeight);
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setHover(false);
    if (!editable) return;
    readFile(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  const box = {
    position: "relative",
    width: width != null ? width : "100%",
    height: height != null ? height : "100%",
    borderRadius: radius,
    overflow: "hidden",
    flex: "none",
    background: src ? COLORS.panel : "transparent",
    cursor: editable ? "pointer" : "default",
    outline: hover ? `2px solid ${COLORS.blue}` : "none",
    outlineOffset: -2,
  };

  return (
    <div
      style={box}
      onClick={() => editable && inputRef.current && inputRef.current.click()}
      onDragOver={(e) => { if (editable) { e.preventDefault(); setHover(true); } }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
    >
      {src ? (
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: COLORS.ink3,
            backgroundColor: "rgba(22,21,19,0.04)",
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(22,21,19,0.07) 0 2px, transparent 2px 11px)",
            border: `1px solid ${COLORS.line2}`,
          }}
        >
          {index != null && (
            <span style={{ fontFamily: FONTS.mono, fontSize: 24, letterSpacing: "0.08em", color: COLORS.ink2 }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 24,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: hover ? COLORS.blue : COLORS.ink3,
            }}
          >
            {hover ? "松开以放置" : caption}
          </span>
        </div>
      )}
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => readFile(e.target.files && e.target.files[0])}
        />
      )}
    </div>
  );
}

/* Adaptive gallery of `count` slots.
   - layout="row" (default): justified row — a common computed height keeps
     every image at its true aspect ratio while the row fills `width`.
   - layout="column": uniform-width vertical stack — each slot keeps its image's
     true aspect ratio (height = width / ratio), scaled to fit `height`. */
export function ImageGallery({
  count = 1,
  width = 1000,
  height,
  maxHeight = 360,
  minHeight = 150,
  gap = 16,
  radius = 0,
  caption = "拖入图片 / DROP IMAGE",
  align = "flex-start",
  layout = "row",
  editable = true,
  images,            // optional controlled array of {src, ratio}
  onChange,          // (nextImages) => void
}) {
  const [local, setLocal] = React.useState([]);
  const controlled = Array.isArray(images);
  const data = controlled ? images : local;

  const setAt = (i, patch) => {
    const next = [];
    for (let k = 0; k < count; k++) next[k] = { ...(data[k] || {}), ...(k === i ? patch : {}) };
    if (controlled) onChange && onChange(next);
    else setLocal(next);
  };

  if (count <= 0) return null;

  const ratios = [];
  for (let i = 0; i < count; i++) ratios[i] = (data[i] && data[i].ratio) || EMPTY_RATIO;

  if (layout === "column") {
    // uniform width, heights from true ratios, scaled down to fit `height`
    let w = width;
    let heights = ratios.map((r) => w / r);
    const totalH = heights.reduce((a, b) => a + b, 0) + gap * (count - 1);
    const avail = height || Infinity;
    if (totalH > avail) {
      const s = (avail - gap * (count - 1)) / heights.reduce((a, b) => a + b, 0);
      w = w * s;
      heights = heights.map((hh) => hh * s);
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap, width: Math.round(w) }}>
        {ratios.map((r, i) => (
          <ImageSlot key={i} index={i} src={(data[i] && data[i].src) || null} ratio={r}
            width={Math.round(w)} height={Math.round(heights[i])} radius={radius}
            caption={caption} editable={editable}
            onUpload={(src, ratio) => setAt(i, { src, ratio })} />
        ))}
      </div>
    );
  }

  const sum = ratios.reduce((a, b) => a + b, 0);
  let h = (width - gap * (count - 1)) / sum;
  h = Math.max(minHeight, Math.min(maxHeight, h));

  return (
    <div style={{ display: "flex", gap, width, justifyContent: align, alignItems: "flex-start" }}>
      {ratios.map((r, i) => (
        <ImageSlot
          key={i}
          index={i}
          src={(data[i] && data[i].src) || null}
          ratio={r}
          width={Math.round(h * r)}
          height={Math.round(h)}
          radius={radius}
          caption={caption}
          editable={editable}
          onUpload={(src, ratio) => setAt(i, { src, ratio })}
        />
      ))}
    </div>
  );
}

export default ImageSlot;
