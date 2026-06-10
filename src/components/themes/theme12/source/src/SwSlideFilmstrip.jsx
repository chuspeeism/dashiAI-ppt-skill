// SwSlideFilmstrip.jsx — "胶片样张 / Contact Sheet" image band page.
//
// A horizontal contact-sheet: equal-width frames mounted in a film strip with
// sprocket-hole rails, a headline above and per-frame mono captions below.
// Distinct from Showcase (text-rail + grid), Mosaic (interlocking collage) and
// Hero (single full-bleed). Frame count (3–5), fit, sprockets, captions and
// accent are props-controlled; all visible copy/data defaults live in
// `defaultProps`. Image data is controlled via `media`/
// `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;
const FRAME_COLORS = ['#3bb6ec', '#baf04f', '#c44ee0', '#f15a29', '#1f6b2a'];

export const meta = { id: 'filmstrip', index: 24, label: '胶片样张 / Contact Sheet' };

export const defaultProps = {
  accent: C.orange,
  mediaCount: 4,           // 3–5 frames
  mediaFit: 'cover',
  showSprockets: true,
  showCaptions: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '24 — Contact Sheet',
  kicker: '胶片样张 / Contact Sheet',
  title: '一卷胶片，[[一段路]]。',
  metaLine: 'ISO 400',
  hint: 'frames',
  mediaPlaceholder: '拖入画格',
  captions: [
    { t: '录音棚', s: 'IN STUDIO' },
    { t: '巡演路上', s: 'ON TOUR' },
    { t: '后台', s: 'BACKSTAGE' },
    { t: '结算面板', s: 'PAYOUT' },
    { t: '粉丝现场', s: 'CROWD' },
  ],
  page: '24',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '画格数量', type: 'slider', def: 4, min: 3, max: 5, step: 1,
    desc: '胶片中的画格数量' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片的填充方式' },
  { key: 'showSprockets', label: '齿孔', type: 'toggle', def: true, desc: '显示/隐藏胶片齿孔轨' },
  { key: 'showCaptions', label: '画格图注', type: 'toggle', def: true, desc: '显示/隐藏每格下方的编号图注' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 高亮 / 页脚强调色' },
];

function Sprockets() {
  return (
    <div style={{ display: 'flex', gap: 26, padding: '11px 22px', justifyContent: 'space-between' }} aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ width: 28, height: 16, borderRadius: 4, background: '#0c0809', flex: '0 0 auto' }} />
      ))}
    </div>
  );
}

export default function SwSlideFilmstrip(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.mediaCount));
  const CAPS = p.captions;

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, marginTop: 22, marginBottom: 20, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, position: 'relative' }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 52, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 14 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: '.12em', textTransform: 'uppercase',
          color: C.inkMut, textAlign: 'right', paddingBottom: 6 }}>
          {p.metaLine} · {String(count).padStart(2, '0')} {p.hint}<br />drag to fill
        </div>
      </div>

      {/* film strip */}
      <div style={{ flex: 1, minHeight: 0, background: '#1c1416', borderRadius: 20, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', borderTop: '5px solid ' + accent }}>
        {p.showSprockets && <Sprockets />}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 14, padding: '0 22px',
          gridTemplateColumns: 'repeat(' + count + ',1fr)' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ minWidth: 0, minHeight: 0 }}>
              <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                fit={p.mediaFit} accent={FRAME_COLORS[i % FRAME_COLORS.length]} radius={6} tone="dark"
                label={p.showCaptions ? i + 1 : null} placeholder={p.mediaPlaceholder} />
            </div>
          ))}
        </div>
        {p.showSprockets && <Sprockets />}
      </div>

      {/* captions row */}
      {p.showCaptions && (
        <div style={{ flexShrink: 0, display: 'grid', gap: 14, marginTop: 16,
          gridTemplateColumns: 'repeat(' + count + ',1fr)' }}>
          {Array.from({ length: count }).map((_, i) => {
            const c = CAPS[i % CAPS.length];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: FRAME_COLORS[i % FRAME_COLORS.length] }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 23, letterSpacing: '-.3px' }}>{c.t}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.12em', color: C.inkMut }}>{c.s}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Footer page={p.page} total={p.total} accent={accent} />
      </div>
    </SlideRoot>
  );
}
