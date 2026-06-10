// SwSlideMoodboard.jsx — "灵感板 / Moodboard" pinned curation board page.
//
// A curation board: pinned photo cards at slight tilts on the left, a colour
// swatch palette and a sticky note on the right. Distinct from Zine (punk poster
// collage), Mosaic (interlocking grid) and GridWall (edge tiles). Photo count
// (3–6), the swatches, the note and accent are props-controlled, 1:1 with
// `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media`/`onMediaChange`; no deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'moodboard', index: 63, label: '灵感板 / Moodboard' };

export const defaultProps = {
  accent: C.orange,
  mediaCount: 4,           // 3–6 pinned photos
  mediaFit: 'cover',
  showSwatches: true,
  showNote: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '63 — Moodboard',
  kicker: '灵感板 / Moodboard',
  title: '把氛围，[[先钉下来]]。',
  metaPrefix: '视觉方向 ·',
  paletteLabel: 'Palette · 配色',
  noteText: '暖橙 + 深墨\n留白要够\n质感 > 装饰',
  noteSign: '— 视觉备忘',
  mediaPlaceholder: '拖入灵感',
  pin: ['#f15a29', '#3bb6ec', '#c44ee0', '#1f6b2a', '#fbb24d', '#d61fb5'],
  tilt: [-2.2, 1.6, -1.4, 2.0, -1.8, 1.2],
  swatches: ['#f15a29', '#1c1416', '#3bb6ec', '#baf04f', '#f5e1e3', '#c44ee0'],
  page: '63',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '照片数量', type: 'slider', def: 4, min: 3, max: 6, step: 1,
    desc: '灵感板上钉住的照片数量' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '照片填充方式' },
  { key: 'showSwatches', label: '色卡', type: 'toggle', def: true, desc: '显示/隐藏右侧配色色卡' },
  { key: 'showNote', label: '便签', type: 'toggle', def: true, desc: '显示/隐藏右侧手写便签' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 高亮 / 页脚强调色' },
];

export default function SwSlideMoodboard(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(6, p.mediaCount));
  const cols = count === 3 ? 3 : count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const PIN = p.pin;
  const TILT = p.tilt;
  const SWATCHES = p.swatches;

  const Pinned = ({ i }) => (
    <div style={{ position: 'relative', height: '100%', minHeight: 0,
      transform: 'rotate(' + TILT[i % TILT.length] + 'deg)' }}>
      <div style={{ height: '100%', background: '#fff', padding: 10, paddingBottom: 24,
        display: 'flex', flexDirection: 'column', boxShadow: '0 14px 30px rgba(27,21,24,.22)' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
            fit={p.mediaFit} accent={PIN[i % PIN.length]} radius={0} tone="light" placeholder={p.mediaPlaceholder} />
        </div>
      </div>
      <span style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
        width: 20, height: 20, borderRadius: '50%', background: PIN[i % PIN.length],
        boxShadow: '0 3px 6px rgba(0,0,0,.35), inset 0 2px 3px rgba(255,255,255,.5)' }} />
    </div>
  );

  return (
    <SlideRoot bg="#e7ded3" color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, marginTop: 18, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 40 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 48, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 10 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase',
          color: C.inkMut, textAlign: 'right', paddingBottom: 6 }}>
          {p.metaPrefix} {String(count).padStart(2, '0')} pins<br />drag to fill
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'grid',
        gridTemplateColumns: (p.showSwatches || p.showNote) ? '1fr 300px' : '1fr', gap: 34 }}>

        {/* photo grid */}
        <div style={{ minWidth: 0, minHeight: 0, display: 'grid', gap: 24,
          gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gridTemplateRows: 'repeat(' + rows + ', 1fr)' }}>
          {Array.from({ length: count }).map((_, i) => <Pinned key={i} i={i} />)}
        </div>

        {/* side: swatches + sticky note */}
        {(p.showSwatches || p.showNote) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
            {p.showSwatches && (
              <div style={{ background: '#fff', borderRadius: 14, padding: 18,
                boxShadow: '0 12px 26px rgba(27,21,24,.16)', transform: 'rotate(1.2deg)' }}>
                <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.16em', textTransform: 'uppercase',
                  color: C.inkMut, marginBottom: 12 }}>{p.paletteLabel}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {SWATCHES.map((s) => (
                    <div key={s} style={{ aspectRatio: '1 / 1', borderRadius: 8, background: s,
                      border: '1px solid rgba(27,21,24,.1)' }} />
                  ))}
                </div>
              </div>
            )}
            {p.showNote && (
              <div style={{ position: 'relative', background: '#fdf6a8', borderRadius: 4, padding: '22px 22px 26px',
                boxShadow: '0 12px 26px rgba(27,21,24,.2)', transform: 'rotate(-1.6deg)' }}>
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(3deg)',
                  width: 96, height: 26, background: 'rgba(245,90,41,.32)' }} aria-hidden="true" />
                <div style={{ fontFamily: F.mono, fontSize: 23, lineHeight: 1.5, color: '#3a2607' }}>
                  {renderSwText(p.noteText)}
                </div>
                <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '.1em', color: '#9a7b32',
                  marginTop: 14 }}>{p.noteSign}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
