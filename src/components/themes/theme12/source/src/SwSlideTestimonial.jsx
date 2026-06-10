// SwSlideTestimonial.jsx — "证言 / Voices" portrait + quote page.
//
// A testimonial pairing a portrait image with a quote, author and an on-brand
// waveform "rating" — distinct from the pure-type pull-quote of Quote. Portrait
// side, portrait shape, the waveform, theme and accent are props-controlled and
// map 1:1 to `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media` / `onMediaChange`;
// the component owns no persistence.

import React from 'react';
import { swTheme, swSeriesColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'voices', index: 80, label: '证言 / Voices' };

export const defaultProps = {
  accent: C.magenta,
  portraitSide: 'left',    // 'left' | 'right'
  portraitShape: 'rounded',// 'rounded' | 'circle'
  theme: 'dark',           // 'light' | 'dark'
  showWave: true,          // waveform accent under the quote
  media: [],
  onMediaChange: () => {},
  // —— content（引文中 **x** = 强调色）——
  barMeta: '80 — Voices',
  portraitTag: 'VOICES / 01',
  kicker: '证言 / In Their Words',
  quote: '“上线半年，我第一次**看清**每一分收入从哪来——也第一次，觉得作品真的**是我的**。”',
  authorName: '陈屿 · 独立音乐人',
  authorEn: 'Chen Yu — Independent Artist',
  portraitPlaceholderCircle: '拖入头像',
  portraitPlaceholderRect: '拖入人像 / Portrait',
  wave: [22, 46, 30, 58, 38, 70, 44, 60, 28, 50, 34, 64, 24, 42],
  page: '80',
  total: '82',
};

export const controls = [
  { key: 'portraitSide', label: '人像位置', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], desc: '人像所在的一侧' },
  { key: 'portraitShape', label: '人像形状', type: 'segment', def: 'rounded',
    options: [{ value: 'rounded', label: '圆角' }, { value: 'circle', label: '圆形' }], desc: '人像裁切形状' },
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showWave', label: '声波装饰', type: 'toggle', def: true, desc: '显示/隐藏引文下方的声波装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.magenta,
    options: [C.magenta, C.orange, C.purple, C.green], desc: '声波 / 高亮 / 页脚强调色' },
];

export default function SwSlideTestimonial(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const portraitLeft = p.portraitSide !== 'right';
  const circle = p.portraitShape === 'circle';
  const WAVE = p.wave;

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;

  // Portrait sits inside a bold accent panel so the column reads as a strong
  // design block even before any image is dropped in.
  const Portrait = (
    <div style={{ position: 'relative', height: '100%', minWidth: 0, overflow: 'hidden',
      borderRadius: swTheme.radius, background: accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: circle ? 56 : 30 }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: -56, left: 18, fontWeight: 900,
        fontSize: 320, lineHeight: 1, color: 'rgba(255,255,255,.18)', fontFamily: 'Georgia, serif',
        pointerEvents: 'none', zIndex: 0 }}>&ldquo;</div>
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 22, left: 30, fontFamily: F.mono,
        fontWeight: 700, fontSize: 22, letterSpacing: '.16em', color: 'rgba(255,255,255,.7)', zIndex: 2 }}>{p.portraitTag}</div>
      <div style={{ position: 'relative', zIndex: 1, width: circle ? '100%' : '100%',
        height: circle ? 'auto' : '100%', aspectRatio: circle ? '1 / 1' : 'auto' }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit="cover" accent={accent} radius={circle ? 999 : 18} tone="dark"
          placeholder={circle ? p.portraitPlaceholderCircle : p.portraitPlaceholderRect} />
      </div>
    </div>
  );

  const Quote = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
      <Kicker accent={accent}>{p.kicker}</Kicker>
      <blockquote style={{ fontWeight: 900, fontSize: 58, lineHeight: 1.24, letterSpacing: '-1px',
        margin: '20px 0 0' }}>
        {renderSwText(p.quote, { strong: { color: accent, fontWeight: 'inherit' } })}
      </blockquote>

      {p.showWave && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72, marginTop: 36 }}>
          {WAVE.map((h, i) => (
            <i key={i} style={{ width: 8, height: h, borderRadius: 4, display: 'block',
              background: swSeriesColors[i % swSeriesColors.length] }} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 36 }}>
        <span style={{ width: 54, height: 4, background: accent, borderRadius: 2 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: '-.3px' }}>{p.authorName}</div>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em',
            textTransform: 'uppercase', color: mut, marginTop: 4 }}>{p.authorEn}</div>
        </div>
      </div>
    </div>
  );

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.82fr 1.18fr',
        gap: 64, alignItems: 'stretch', padding: '24px 0 22px', position: 'relative', zIndex: 3 }}>
        {portraitLeft ? <>{Portrait}{Quote}</> : <>{Quote}{Portrait}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
