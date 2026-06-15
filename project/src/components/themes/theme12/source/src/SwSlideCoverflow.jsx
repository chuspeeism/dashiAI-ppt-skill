// SwSlideCoverflow.jsx — "封面流 / Coverflow" perspective cover carousel.
//
// A row of album covers laid out in 3-D perspective: the focused cover stands
// upright and enlarged at centre while the flanking covers rotate away into
// depth. Distinct from Filmstrip (flat contact strip) and Album (tracklist).
// Cover count (3–7), the focused index, reflection, captions and accent are all
// props-controlled, 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. Image data is controlled via
// `media`/`onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot, { normalizeMedia } from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;
const COVER_TINT = ['#3bb6ec', '#baf04f', '#c44ee0', '#f15a29', '#1f6b2a', '#fbb24d', '#74d2f0'];

export const meta = { id: 'coverflow', index: 26, label: '封面流 / Coverflow' };

export const defaultProps = {
  accent: C.cyan,
  mediaCount: 5,           // 3–7 covers
  focusIndex: 3,           // 1-based, which cover stands upright
  mediaFit: 'cover',
  showReflection: true,
  showCaption: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '26 — Coverflow',
  kicker: '封面流 / Coverflow',
  title: '每张封面，[[一个世界]]。',
  hint: 'releases',
  mediaPlaceholder: '拖入封面',
  titles: [
    { t: '午夜电台', s: 'MIDNIGHT RADIO' },
    { t: '潮汐', s: 'TIDES' },
    { t: '霓虹废墟', s: 'NEON RUINS' },
    { t: '回声花园', s: 'ECHO GARDEN' },
    { t: '低气压', s: 'LOW PRESSURE' },
    { t: '盐与光', s: 'SALT & LIGHT' },
    { t: '夜行列车', s: 'NIGHT TRAIN' },
  ],
  page: '26',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '封面数量', type: 'slider', def: 5, min: 3, max: 7, step: 1,
    desc: '封面流中的封面数量' },
  { key: 'focusIndex', label: '聚焦封面', type: 'slider', def: 3, min: 1, max: 7, step: 1,
    desc: '居中竖立放大的封面（第几张）' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '封面图填充方式' },
  { key: 'showReflection', label: '倒影', type: 'toggle', def: true, desc: '显示/隐藏封面下方倒影' },
  { key: 'showCaption', label: '焦点图注', type: 'toggle', def: true, desc: '显示/隐藏焦点封面的曲目标签' },
  { key: 'accent', label: '强调色', type: 'color', def: C.cyan,
    options: [C.cyan, C.orange, C.purple, C.green], desc: '导语 / 高亮 / 页脚强调色' },
];

export default function SwSlideCoverflow(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const TITLES = p.titles;
  const count = Math.max(3, Math.min(7, p.mediaCount));
  const focus = Math.max(1, Math.min(count, p.focusIndex)) - 1;
  // Size + spacing adapt to the busier side so the whole fan always fits the
  // stage and every cover shows enough of its face (never thin slivers), no
  // matter where the focus sits — even at the very first / last index.
  const maxSide = Math.max(focus, count - 1 - focus);
  const sizeCap = count >= 6 ? 340 : count >= 5 ? 380 : 420;
  const stepFactor = 0.62;                 // step / size
  const size = Math.max(180, Math.min(sizeCap, Math.floor(880 / (stepFactor * maxSide + 0.55))));
  const step = size * stepFactor;          // horizontal spacing between covers

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flexShrink: 0, marginTop: 18, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 40 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 12 }}>
            {renderSwText(p.title, { hl: { tone: 'c' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'rgba(245,225,227,.6)', textAlign: 'right', paddingBottom: 6 }}>
          {String(count).padStart(2, '0')} {p.hint}<br />drag to fill
        </div>
      </div>

      {/* perspective stage */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', perspective: 2600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative', transformStyle: 'preserve-3d', width: size, height: size }}>
          {Array.from({ length: count }).map((_, i) => {
            const reflectionMedia = normalizeMedia(p.media[i]);
            const d = i - focus;
            const isFocus = d === 0;
            const rot = isFocus ? 0 : (d < 0 ? 24 : -24);
            const scale = isFocus ? 1.16 : 1 - Math.min(Math.abs(d), 3) * 0.05;
            const z = isFocus ? 90 : -Math.abs(d) * 64;
            const x = d * step;               // focus (d=0) sits dead-centre
            return (
              <div key={i} style={{
                position: 'absolute', left: 0, top: 0, width: size, height: size,
                transform: 'translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + rot + 'deg) scale(' + scale + ')',
                transformStyle: 'preserve-3d', zIndex: isFocus ? 50 : 20 - Math.abs(d),
                transition: 'transform .25s ease',
                filter: isFocus ? 'none' : 'brightness(0.62) saturate(0.85)' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%',
                  boxShadow: isFocus ? '0 40px 90px rgba(0,0,0,.6)' : '0 18px 40px rgba(0,0,0,.5)',
                  borderRadius: 8, outline: isFocus ? '4px solid ' + accent : 'none', outlineOffset: 0 }}>
                  <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                    fit={p.mediaFit} accent={COVER_TINT[i % COVER_TINT.length]} radius={8} tone="dark"
                    placeholder={isFocus ? p.mediaPlaceholder : ''} />
                </div>
                {/* reflection */}
                {p.showReflection && (
                  <div aria-hidden="true" style={{ position: 'absolute', top: '100%', left: 0, width: '100%',
                    height: '46%', transform: 'scaleY(-1)', transformOrigin: 'top',
                    opacity: 0.3, borderRadius: 8, overflow: 'hidden',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.7), transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,.7), transparent)',
                    background: reflectionMedia?.src ? '#000' : 'transparent' }}>
                    {reflectionMedia?.src && (
                      reflectionMedia.kind === 'video'
                        ? <video src={reflectionMedia.src} muted playsInline loop autoPlay preload="metadata" style={{ width: '100%', height: '100%', objectFit: p.mediaFit }} />
                        : <img src={reflectionMedia.src} alt="" style={{ width: '100%', height: '100%', objectFit: p.mediaFit }} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* focus caption */}
        {p.showCaption && (
          <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', zIndex: 60 }}>
            <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: '-.6px' }}>{TITLES[focus % TITLES.length].t}</div>
            <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.2em',
              color: accent, marginTop: 4 }}>{TITLES[focus % TITLES.length].s} · {String(focus + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}</div>
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
