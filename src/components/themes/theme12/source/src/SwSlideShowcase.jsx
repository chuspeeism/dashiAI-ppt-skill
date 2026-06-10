// SwSlideShowcase.jsx — image-led "图片页" / showcase page.
//
// Image-dominant layout (the gallery owns ~65% of the canvas). Slot count is
// fully props-driven (0–5); each count maps to a composition that stays
// balanced. With 0 images the page gracefully becomes a full-width editorial
// statement, so it never looks broken. Image data is passed in via `media`
// and lifted out via `onMediaChange` — the component never owns persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'showcase', index: 15, label: '图片页 / In Context' };

export const defaultProps = {
  accent: C.orange,
  mediaCount: 3,             // 0–5 image slots
  mediaFit: 'cover',         // multi-image fill mode
  showCaption: true,
  showDecorations: true,
  media: [],                 // array<string|null> (controlled)
  onMediaChange: () => {},   // (index, src) => void
  // —— content ——
  barMeta: '15 — In Context',
  kicker: '现场 / In Context',
  title: '声浪，长在\n创作者的[[日常]]里。',
  caption: '从录音棚到结算页，从一条 demo 到一笔到账——把创作的每一个现场，收进同一块屏幕。',
  hint: '/ Frames · drag to fill',
  mediaPlaceholderHero: '拖入主图 / Hero image',
  mediaPlaceholder: '拖入图片',
  page: '15',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '图片数量', type: 'slider', def: 3, min: 0, max: 5, step: 1,
    desc: '图片槽数量；0=纯文字版式，1=按原图比例自适应主图，2–5=自动排布的画廊' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }],
    dependsOn: 'mediaCount', desc: '多图时图片的填充方式' },
  { key: 'showCaption', label: '显示图注', type: 'toggle', def: true, desc: '显示/隐藏左栏图注说明' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏编号角标装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 角标 / 页脚强调色' },
];

// Composition per image count — kept balanced at every value.
const LAYOUTS = {
  2: { cols: '1fr 1fr', rows: '1fr', areas: '"a b"' },
  3: { cols: '1.5fr 1fr', rows: '1fr 1fr', areas: '"a b" "a c"' },
  4: { cols: '1fr 1fr', rows: '1fr 1fr', areas: '"a b" "c d"' },
  5: { cols: '1.5fr 1fr 1fr', rows: '1fr 1fr', areas: '"a b c" "a d e"' },
};
const AREAS = ['a', 'b', 'c', 'd', 'e'];

function Gallery({ count, media, onMediaChange, fit, accent, placeholderHero, placeholder }) {
  if (count === 1) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <SwImageSlot value={media[0] || null} onChange={(s) => onMediaChange(0, s)}
          adaptive fit="contain" accent={accent} radius={swTheme.radius}
          maxRatio={2.1} minRatio={0.7} placeholder={placeholderHero} />
      </div>
    );
  }
  const L = LAYOUTS[count] || LAYOUTS[2];
  return (
    <div style={{ display: 'grid', height: '100%', gap: 16,
      gridTemplateColumns: L.cols, gridTemplateRows: L.rows, gridTemplateAreas: L.areas }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ gridArea: AREAS[i], minHeight: 0, minWidth: 0 }}>
          <SwImageSlot value={media[i] || null} onChange={(s) => onMediaChange(i, s)}
            fit={fit} accent={accent} radius={swTheme.radius} label={i + 1} placeholder={placeholder} />
        </div>
      ))}
    </div>
  );
}

export default function SwSlideShowcase(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(0, Math.min(5, p.mediaCount));
  const hasImages = count > 0;

  const TextRail = hasImages ? (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: swTheme.radius, background: C.dark,
      color: C.blush, padding: '44px 40px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: -50, right: -8, fontFamily: F.mono, fontWeight: 700,
        fontSize: 200, lineHeight: 0.8, color: 'rgba(245,225,227,.06)', pointerEvents: 'none' }}>14</div>
      <Shape kind="ring" size={62} border={13} color={accent} style={{ top: 40, left: 40, opacity: .9 }} />
      <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.12, letterSpacing: '-1.2px', marginTop: 18, color: C.blush }}>
          {renderSwText(p.title, { hl: { tone: 'o' } })}
        </h2>
        {p.showCaption && (
          <p style={{ fontSize: T.body, lineHeight: 1.7, color: '#c8c0bd', marginTop: 22, maxWidth: 360 }}>
            {p.caption}
          </p>
        )}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: '.12em', textTransform: 'uppercase',
        color: '#9a8f8c', marginTop: 24, position: 'relative', zIndex: 1 }}>
        {String(count).padStart(2, '0')} {p.hint}
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 1380 }}>
      <Kicker accent={accent}>{p.kicker}</Kicker>
      <h2 style={{ fontWeight: 900, fontSize: T.h1, lineHeight: 1.12, letterSpacing: '-1.2px', marginTop: 20 }}>
        {renderSwText((p.title || '').replace('\n', ''), { hl: { tone: 'o' } })}
      </h2>
      {p.showCaption && (
        <p style={{ fontSize: T.body, lineHeight: 1.7, color: '#4f444a', marginTop: 22, maxWidth: 980 }}>
          {p.caption}
        </p>
      )}
    </div>
  );

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, position: 'relative', zIndex: 3, padding: '26px 0 22px',
        display: 'grid', gap: hasImages ? 56 : 0,
        gridTemplateColumns: hasImages ? '360px 1fr' : '1fr', alignItems: 'stretch' }}>
        {TextRail}
        {hasImages && (
          <div style={{ minWidth: 0, minHeight: 0 }}>
            <Gallery count={count} media={p.media} onMediaChange={p.onMediaChange}
              fit={p.mediaFit} accent={accent} placeholderHero={p.mediaPlaceholderHero} placeholder={p.mediaPlaceholder} />
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
