// SlideFilmstrip.jsx — 影像长卷 / equal-width image row.
// A headline band over a single horizontal row of image slots. Slots divide the
// available row width evenly, and each image crops inside its own slot.
// Distinct from Slide04Gallery (uniform grid) and SlideMosaic (collage): this is
// one horizontal filmstrip with per-frame captions.
// Standalone & migratable: depends only on React + DeckImageSlot (both global).
// Token-driven. CSS scoped under `.fs-`.
//
// ── Props (canonical list in SlideFilmstrip.META.controls) ────────────────────
//   imageCount   number 0..5    how many frames in the strip               (3)
//   showCaptions boolean        the caption under each frame               (true)
//   showIndex    boolean        the 01/02… frame index                     (true)
//   radius       number 0..28   frame corner radius (px)                   (14)
//
// Content props (authored at call-site):
//   idPrefix (persistence namespace), overline, title, captions:[string]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideFilmstrip({
  idPrefix = 'filmstrip',
  overline = '影像 · IN FRAMES', title = '把抽象的数字，放回真实的生活',
  captions = ['清晨的第一杯', '说走就走的远途', '不被打扰的工作', '陪家人的整段时间', '从容的退休'],
  imageCount = 3, showCaptions = true, showIndex = true, radius = 14,
}) {
  React.useEffect(() => { fsInjectStyle(); }, []);
  const n = Math.max(0, Math.min(5, imageCount));

  return (
    <div className="fs-root">
      <div className="fs-head">
        <div className="fs-overline">{overline}</div>
        <h2 className="fs-title">{title}</h2>
      </div>

      {n === 0 ? (
        <div className="fs-empty">
          <span className="fs-empty-mark">＋</span>
          <span className="fs-empty-txt">在右侧 Tweaks 调高「影像数量」以加入图片</span>
        </div>
      ) : (
        <div className="fs-strip">
          {Array.from({ length: n }).map((_, i) => (
            <figure className="fs-frame" key={i}>
              <div className="fs-slot" style={{ borderRadius: radius }}>
                <DeckImageSlot id={`${idPrefix}-${i}`} fit="cover" radius={radius}
                               placeholder={`IMAGE ${String(i + 1).padStart(2, '0')}`} />
              </div>
              {(showCaptions || showIndex) && (
                <figcaption className="fs-cap">
                  {showIndex && <span className="fs-cap-idx">{String(i + 1).padStart(2, '0')}</span>}
                  {showCaptions && <span className="fs-cap-txt">{captions[i] || ''}</span>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

function fsInjectStyle() {
  if (document.getElementById('fs-style')) return;
  const s = document.createElement('style'); s.id = 'fs-style';
  s.textContent = `
  .fs-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .fs-head{margin-bottom:38px;}
  .fs-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .fs-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;max-width:24ch;text-wrap:pretty;}
  .fs-strip{flex:1;min-height:0;display:flex;align-items:stretch;gap:24px;}
  .fs-frame{margin:0;min-width:0;flex:1 1 0;display:flex;flex-direction:column;}
  .fs-slot{position:relative;flex:1;min-height:0;overflow:hidden;}
  .fs-cap{margin-top:18px;display:flex;align-items:baseline;gap:14px;}
  .fs-cap-idx{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-accent,#6f9bd8);}
  .fs-cap-txt{font-size:24px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.66));}
  .fs-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;
    border-radius:18px;box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));}
  .fs-empty-mark{font-size:64px;font-weight:200;color:var(--ds-faint,rgba(242,243,246,.4));line-height:1;}
  .fs-empty-txt{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.4));}
  `;
  document.head.appendChild(s);
}

SlideFilmstrip.META = {
  id: 'filmstrip', title: '影像长卷',
  defaults: { imageCount: 3, showCaptions: true, showIndex: true, radius: 14 },
  controls: [
    { key: 'imageCount', type: 'slider', label: '影像数量', default: 3, min: 0, max: 5, step: 1,
      description: '横排影像框数量（0 为留空提示态）。各框按数量均分宽度，图片在槽内裁切填满。' },
    { key: 'showCaptions', type: 'toggle', label: '图注', default: true,
      description: '每帧下方的说明文字。' },
    { key: 'showIndex', type: 'toggle', label: '编号', default: true,
      description: '每帧下方的 01/02… 序号。' },
    { key: 'radius', type: 'slider', label: '圆角', default: 14, min: 0, max: 28, step: 2, unit: 'px',
      description: '影像框的圆角半径。' },
  ],
};

export { SlideFilmstrip };
export const META = SlideFilmstrip.META;
export default SlideFilmstrip;
