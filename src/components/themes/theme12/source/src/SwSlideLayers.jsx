// SwSlideLayers.jsx — "叠影 / Layered" overlapping photo-stack page.
//
// A loose stack of 2–4 photos, each tilted and offset so they overlap like
// prints tossed on a desk — distinct from Polaroid (one tilted print) and
// Mosaic (interlocking grid). Image count, spread (overlap distance), tilt
// strength, frame border, captions and accent are props-controlled and map 1:1
// to `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media` / `onMediaChange`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'layers', index: 12, label: '叠影 / Layered' };

export const defaultProps = {
  accent: C.orange,
  mediaCount: 3,           // 2–4 photos
  spread: 64,              // overlap offset (px)
  tilt: 5,                 // base tilt (deg)
  showFrame: true,         // white print border
  showCaptions: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  brand: '声浪 SOUNDWAVE',
  kicker: '叠影 / Layered',
  title: '一沓[[现场]]，\n摞成一年。',
  intro: '把巡演、排练、后台的瞬间一张张叠起来——这就是声浪记录的、属于你的现场档案。',
  hint: 'Drag to fill',
  frameBrand: 'SOUNDWAVE',
  mediaPlaceholder: '拖入图片',
  page: '12',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '图片数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '叠放的照片数量' },
  { key: 'spread', label: '错位间距', type: 'slider', def: 64, min: 24, max: 110, step: 2, unit: 'px',
    desc: '相邻照片之间的错位距离' },
  { key: 'tilt', label: '倾斜角度', type: 'slider', def: 5, min: 0, max: 12, step: 1, unit: '°',
    desc: '照片的倾斜强度' },
  { key: 'showFrame', label: '白边相纸', type: 'toggle', def: true, desc: '为照片添加白色相纸边框' },
  { key: 'showCaptions', label: '编号角标', type: 'toggle', def: true, desc: '显示/隐藏照片编号角标' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片的填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '标题 / 角标强调色' },
];

export default function SwSlideLayers(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.mediaCount));
  const mid = (count - 1) / 2;

  return (
    <SlideRoot bg={C.dark} color={C.blush} style={{ padding: '64px 80px' }}>
      <Shape kind="ring" size={110} border={16} color={accent} style={{ top: 70, left: 40, opacity: .85, zIndex: 0 }} />
      <Shape kind="pentagon" size={56} color={C.magenta} style={{ bottom: 80, left: 150, zIndex: 0, opacity: .9 }} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr',
        gap: 40, alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* copy */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 26 }}>
            <span style={{ width: 16, height: 16, background: accent, borderRadius: 4 }} />
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 23, letterSpacing: '.2em' }}>{p.brand}</span>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.16em', textTransform: 'uppercase',
            color: accent, marginBottom: 16 }}>{p.kicker}</div>
          <h2 style={{ fontWeight: 900, fontSize: 78, lineHeight: 1.04, letterSpacing: '-2px' }}>
            {renderSwText(p.title, { hl: { tone: 'o', block: true } })}
          </h2>
          <p style={{ fontSize: 25, lineHeight: 1.6, color: 'rgba(245,225,227,.74)', marginTop: 26, maxWidth: 420 }}>
            {p.intro}
          </p>
          <p style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase',
            color: 'rgba(245,225,227,.5)', marginTop: 28 }}>
            {p.hint} {String(count).padStart(2, '0')} prints
          </p>
        </div>

        {/* photo stack */}
        <div style={{ position: 'relative', height: '78%', minWidth: 0 }}>
          {Array.from({ length: count }).map((_, i) => {
            const off = (i - mid) * p.spread;
            const rot = (i - mid) * p.tilt;
            const fr = p.showFrame ? 14 : 0;
            return (
              <div key={i} style={{ position: 'absolute', top: '50%', left: '50%',
                width: '62%', aspectRatio: '4 / 5',
                transform: 'translate(-50%,-50%) translateX(' + off + 'px) rotate(' + rot + 'deg)',
                background: p.showFrame ? '#fbf7f3' : 'transparent', padding: fr, paddingBottom: p.showFrame ? 46 : fr,
                borderRadius: 8, boxShadow: '0 24px 60px rgba(0,0,0,.5)', zIndex: 3 + i }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                    fit={p.mediaFit} accent={accent} radius={p.showFrame ? 3 : 8} tone="dark"
                    label={p.showCaptions ? i + 1 : null} placeholder={p.mediaPlaceholder} />
                </div>
                {p.showFrame && (
                  <div style={{ position: 'absolute', left: 16, right: 16, bottom: 12,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    fontFamily: F.mono, color: '#1b1518' }}>
                    <span style={{ fontSize: 17, letterSpacing: '.08em', fontWeight: 700 }}>{p.frameBrand}</span>
                    <span style={{ fontSize: 16, color: '#9a8f8c' }}>NO.{String(i + 1).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SlideRoot>
  );
}
