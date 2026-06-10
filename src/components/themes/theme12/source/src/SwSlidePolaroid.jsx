// SwSlidePolaroid.jsx — "拍立得 / Polaroid" scrapbook collage page.
//
// Scattered, tilted instant-photo frames (white border + caption lip) pinned
// across the canvas like a scrapbook, anchored by a solid colour title block.
// Distinct from GridWall (even grid), Filmstrip (aligned strip), Mosaic
// (interlocking collage) and Triptych (upright portraits). Photo count (3–5),
// scatter vs tidy, captions, mediaFit, accent and theme are props-controlled;
// all visible copy (kicker/title/intro/captions) defaults live in defaultProps.
// Image slots are fully controlled (media + onMediaChange).
// No global side effects, no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'polaroid', index: 21, label: '拍立得 / Polaroid' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  photoCount: 4,           // 3–5 photos
  scatter: true,           // tilt + offset vs tidy row
  showCaptions: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '21 — Polaroid',
  kicker: '影像手账 / Snapshots',
  title: '把高光\n一张张[[钉]]下来。',
  intro: '不是冷冰冰的数据，而是一个个真实的瞬间——这才是创作者经营事业的样子。',
  hint: 'shots · drag to fill',
  captions: ['首演之夜', '深夜母带', '签售现场', '巡演后台', '排练室'],
  mediaPlaceholder: '拖入',
  page: '21',
  total: '82',
};

export const controls = [
  { key: 'photoCount', label: '照片数量', type: 'slider', def: 4, min: 3, max: 5, step: 1,
    desc: '拍立得照片的数量' },
  { key: 'scatter', label: '随意散落', type: 'toggle', def: true, desc: '开启倾斜散落 / 关闭则整齐排布' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showCaptions', label: '手写图注', type: 'toggle', def: true, desc: '显示/隐藏照片下方说明' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '标题块 / 高亮 / 页脚强调色' },
];

// scatter transforms per photo index (rotation deg + vertical nudge %)
const TILT = [-5, 4, -3, 6, -4];
const NUDGE = [4, -3, 6, 0, 3];

export default function SwSlidePolaroid(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(3, Math.min(5, p.photoCount));

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const photoBg = dark ? '#262022' : '#ffffff';
  const capColor = dark ? '#d8cfd2' : '#3a3034';

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'grid',
        gridTemplateColumns: '0.82fr 1.18fr', gap: 36, alignItems: 'center', padding: '20px 0', zIndex: 3 }}>

        {/* title block */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Shape kind="pentagon" size={58} color={accent} style={{ top: -10, left: 0, zIndex: 1, position: 'static', display: 'none' }} />
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 62, lineHeight: 1.05, letterSpacing: '-1.6px', marginTop: 16 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
          <p style={{ fontSize: 24, lineHeight: 1.66, color: dark ? '#c8c0bd' : '#5a4f54', marginTop: 22, maxWidth: 420 }}>
            {p.intro}
          </p>
          <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase',
            color: accent, marginTop: 26 }}>{String(count).padStart(2, '0')} {p.hint}</div>
        </div>

        {/* photo cluster */}
        <div style={{ position: 'relative', height: '100%', minWidth: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: p.scatter ? 0 : 22 }}>
          {Array.from({ length: count }).map((_, i) => {
            const pal = swCardPalette[i % swCardPalette.length];
            const tilt = p.scatter ? TILT[i % TILT.length] : 0;
            const nudge = p.scatter ? NUDGE[i % NUDGE.length] : 0;
            const w = p.scatter ? 'min(27vw, 340px)' : '100%';
            return (
              <div key={i} style={{
                position: p.scatter ? 'relative' : 'static', flex: p.scatter ? 'none' : 1, minWidth: 0,
                width: p.scatter ? w : 'auto', marginLeft: p.scatter && i > 0 ? '-7%' : 0,
                transform: 'rotate(' + tilt + 'deg) translateY(' + nudge + '%)',
                background: photoBg, padding: '14px 14px 0', borderRadius: 6,
                boxShadow: '0 16px 34px rgba(20,15,16,.26)', zIndex: 10 + i }}>
                <div style={{ aspectRatio: '1 / 1', width: '100%' }}>
                  <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                    fit={p.mediaFit} accent={pal.bg} radius={3} tone={dark ? 'dark' : 'light'}
                    label={i + 1} placeholder={p.mediaPlaceholder} />
                </div>
                <div style={{ height: p.showCaptions ? 'auto' : 18, padding: p.showCaptions ? '14px 4px 16px' : 0,
                  textAlign: 'center' }}>
                  {p.showCaptions && (
                    <span style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 700, letterSpacing: '.02em',
                      color: capColor }}>{p.captions[i % p.captions.length]}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
