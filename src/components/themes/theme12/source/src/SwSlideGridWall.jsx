// SwSlideGridWall.jsx — "图墙 / Grid Wall" image-wall page.
//
// A tight, even grid of image tiles (a wall of frames) interlocked with one
// solid colour-blocked title tile. Distinct from Filmstrip (single horizontal
// strip), Mosaic (asymmetric collage) and Triptych (tall portraits). Image-tile
// count (4–8), columns (3|4), title-tile placement, index badges, captions,
// mediaFit and accent are props-controlled, 1:1 with controls; all visible
// copy defaults live in `defaultProps`. Image slots are
// fully controlled (media + onMediaChange). No global side effects, no host
// dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { Bar, Footer, Hl, Shape, SlideRoot, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'gridwall', index: 66, label: '图墙 / Grid Wall' };

export const defaultProps = {
  accent: C.green,
  theme: 'light',          // 'light' | 'dark'
  mediaCount: 7,           // 4–8 image tiles (+ 1 title tile)
  columns: 4,              // 3 | 4
  showIndex: true,
  showCaptions: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '66 — Grid Wall',
  kicker: '影像墙 / The Wall',
  title: '一面墙，装下[[整个场景]]。',
  hint: 'frames · drag to fill',
  captions: ['现场 Live', '录音棚 Studio', '幕后 Backstage', '巡演 Tour', '排练 Rehearsal',
    '封面 Artwork', '粉丝 Fans', '签售 Signing'],
  mediaPlaceholder: '拖入',
  page: '66',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '图片数量', type: 'slider', def: 7, min: 4, max: 8, step: 1,
    desc: '图墙中的图片格数量（另含一个标题格）' },
  { key: 'columns', label: '栏数', type: 'segment', def: 4,
    options: [{ value: 3, label: '3 栏' }, { value: 4, label: '4 栏' }], desc: '图墙的列数' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showIndex', label: '序号角标', type: 'toggle', def: true, desc: '显示/隐藏图片序号' },
  { key: 'showCaptions', label: '悬浮图注', type: 'toggle', def: true, desc: '显示/隐藏图片底部说明条' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.green,
    options: [C.green, C.orange, C.purple, C.cyan], desc: '标题格 / 高亮 / 页脚强调色' },
];

export default function SwSlideGridWall(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const cols = p.columns === 3 ? 3 : 4;
  const tiles = Math.max(4, Math.min(8, p.mediaCount));
  // title tile spans 2×1; total grid cells = tiles + 2
  const rows = Math.ceil((tiles + 2) / cols);

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 14, padding: '22px 0',
        gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridTemplateRows: 'repeat(' + rows + ',1fr)',
        position: 'relative', zIndex: 3 }}>

        {/* title tile spans two columns */}
        <div style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden', borderRadius: 18,
          background: accent, color: '#fff', padding: '30px 34px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -54, right: -10, fontFamily: F.mono,
            fontWeight: 700, fontSize: 200, lineHeight: 0.8, color: 'rgba(255,255,255,.14)', pointerEvents: 'none' }}>{p.page}</div>
          <Shape kind="pentagon" size={52} color="rgba(255,255,255,.9)" style={{ top: 22, right: 24, zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, letterSpacing: '.16em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,.88)' }}>{p.kicker}</div>
            <h2 style={{ fontWeight: 900, fontSize: cols === 3 ? 46 : 52, lineHeight: 1.06,
              letterSpacing: '-1.4px', marginTop: 12 }}>
              {renderSwText(p.title, { hl: { tone: 'o', style: { background: '#fff', color: accent } } })}
            </h2>
            <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.82)', marginTop: 16 }}>{String(tiles).padStart(2, '0')} {p.hint}</div>
          </div>
        </div>

        {/* image tiles */}
        {Array.from({ length: tiles }).map((_, i) => {
          const pal = swCardPalette[i % swCardPalette.length];
          return (
            <div key={i} style={{ position: 'relative', minWidth: 0, minHeight: 0 }}>
              <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                fit={p.mediaFit} accent={pal.bg} radius={18} tone={dark ? 'dark' : 'light'}
                label={p.showIndex ? i + 1 : null} placeholder={p.mediaPlaceholder} />
              {p.showCaptions && p.media[i] && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 16px 12px',
                  borderRadius: '0 0 18px 18px', pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(12,9,10,.78), transparent)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F.mono,
                    fontSize: 18, fontWeight: 700, letterSpacing: '.06em', color: '#fff' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: pal.bg }} />
                    {p.captions[i % p.captions.length]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
