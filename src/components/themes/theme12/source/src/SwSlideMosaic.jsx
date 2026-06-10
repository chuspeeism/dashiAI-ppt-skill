// SwSlideMosaic.jsx — "影像拼贴 / Gallery" collage page.
//
// A magazine-style mosaic where a TEXT tile interlocks with image tiles of
// varied proportions (not the balanced text-rail + grid of Showcase). Tiles
// bleed to the slide edges. Image count (2–5), gap, captions and accent are
// props-controlled and map 1:1 to `controls`; all visible copy defaults live in
// `defaultProps`. Image data is controlled via
// `media` / `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'mosaic', index: 61, label: '影像拼贴 / Gallery' };

export const defaultProps = {
  accent: C.green,
  mediaCount: 4,           // 2–5 image tiles
  mediaFit: 'cover',
  gap: 14,
  showCaptions: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  brand: '声浪 SOUNDWAVE',
  title: '一帧一帧，\n都是[[现场]]。',
  hint: 'Gallery — drag to fill',
  mediaPlaceholder: '拖入图片',
  page: '61',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '图片数量', type: 'slider', def: 4, min: 2, max: 5, step: 1,
    desc: '拼贴中的图片块数量' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片的填充方式' },
  { key: 'gap', label: '间距', type: 'slider', def: 14, min: 4, max: 28, step: 2, unit: 'px',
    desc: '拼贴块之间的间距' },
  { key: 'showCaptions', label: '图块编号', type: 'toggle', def: true, desc: '显示/隐藏图块上的编号角标' },
  { key: 'accent', label: '强调色', type: 'color', def: C.green,
    options: [C.green, C.purple, C.orange, C.cyan], desc: '文字块 / 角标强调色' },
];

// Each layout places one text tile ('t') among image tiles a..e.
const LAYOUTS = {
  2: { cols: '1.15fr 1fr', rows: '1fr 1fr', areas: '"t a" "b a"' },
  3: { cols: '1fr 1.2fr 1fr', rows: '1fr 1fr', areas: '"t a b" "t a c"' },
  4: { cols: '1fr 1.25fr 1fr', rows: '1fr 1fr', areas: '"t a b" "d a c"' },
  5: { cols: '1fr 1.2fr 1fr', rows: '1.1fr 1fr 1fr', areas: '"t a b" "t a c" "d e c"' },
};
const IMG_AREAS = ['a', 'b', 'c', 'd', 'e'];

export default function SwSlideMosaic(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(5, p.mediaCount));
  const L = LAYOUTS[count] || LAYOUTS[4];

  return (
    <SlideRoot bg={C.dark} color={C.blush} style={{ padding: 36 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gap: p.gap, padding: 36,
        gridTemplateColumns: L.cols, gridTemplateRows: L.rows, gridTemplateAreas: L.areas }}>

        {/* text tile */}
        <div style={{ gridArea: 't', background: accent, color: '#fff', borderRadius: swTheme.radius,
          padding: '40px 38px', display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -20, fontFamily: F.mono, fontWeight: 700,
            fontSize: 200, lineHeight: 0.8, color: 'rgba(255,255,255,.14)' }}>{p.page}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, position: 'relative', zIndex: 1 }}>
            <span style={{ width: 16, height: 16, background: '#fff', borderRadius: 4 }} />
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '.2em' }}>{p.brand}</span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.08, letterSpacing: '-1.5px',
            marginTop: 'auto', position: 'relative', zIndex: 1 }}>
            {renderSwText(p.title, { hl: { tone: 'o', style: { background: '#fff', color: accent } } })}
          </h2>
          <p style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,.78)', marginTop: 18, position: 'relative', zIndex: 1 }}>
            {p.hint} {String(count).padStart(2, '0')} frames
          </p>
        </div>

        {/* image tiles */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ gridArea: IMG_AREAS[i], minWidth: 0, minHeight: 0 }}>
            <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
              fit={p.mediaFit} accent={accent} radius={swTheme.radius} tone="dark"
              label={p.showCaptions ? i + 1 : null} placeholder={p.mediaPlaceholder} />
          </div>
        ))}
      </div>
    </SlideRoot>
  );
}
