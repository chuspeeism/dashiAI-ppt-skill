// SwSlideZine.jsx — "拼贴海报 / Zine" cut-and-paste collage poster page.
//
// A punk fanzine layout: rotated photo scraps with white print borders and
// "tape" strips overlap a ransom-note headline built from highlight pills.
// Distinct from Mosaic (clean interlocking grid) and Magazine (tidy spread).
// Scrap count (2–4), tape, tilt and accent are props-controlled, 1:1 with
// `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media`/`onMediaChange`; no deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'zine', index: 62, label: '拼贴海报 / Zine' };

export const defaultProps = {
  accent: C.lime,
  scrapCount: 3,           // 2–4 photo scraps
  mediaFit: 'cover',
  showTape: true,
  tilt: 5,                 // base tilt degrees
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '62 — Zine',
  eyebrow: 'ISSUE 04 · 自己印',
  line1: '剪下来，',
  line2: '贴上去，',
  line3: '就是态度',
  intro: '独立不是风格，是方法。把现场、样带、手写歌词一把抓起，钉成一张属于自己的海报。',
  mediaPlaceholder: '拖入碎片',
  scrapTint: ['#3bb6ec', '#f15a29', '#baf04f', '#c44ee0'],
  page: '62',
  total: '82',
};

export const controls = [
  { key: 'scrapCount', label: '拼贴张数', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '拼贴中的照片碎片数量' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '碎片图填充方式' },
  { key: 'showTape', label: '胶带', type: 'toggle', def: true, desc: '显示/隐藏贴在碎片上的胶带' },
  { key: 'tilt', label: '倾斜角度', type: 'slider', def: 5, min: 0, max: 10, step: 1, unit: '°',
    desc: '碎片随机倾斜的基准角度' },
  { key: 'accent', label: '强调色', type: 'color', def: C.lime,
    options: [C.lime, C.orange, C.cyan, C.magenta], desc: '标语高亮 / 页脚强调色' },
];

// scrap placements: pos (% of stage) + size (% width) + tilt multiplier
const SCRAPS = [
  { left: '4%', top: '8%', w: '44%', h: '52%', k: 1.0, tint: 0 },
  { left: '50%', top: '30%', w: '42%', h: '58%', k: -1.2, tint: 1 },
  { left: '20%', top: '50%', w: '34%', h: '42%', k: 0.7, tint: 2 },
  { left: '58%', top: '4%', w: '32%', h: '34%', k: -0.6, tint: 3 },
];

export default function SwSlideZine(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.scrapCount));
  const SCRAP_TINT = p.scrapTint;

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flex: 1, minHeight: 0, margin: '22px 0 20px', display: 'grid',
        gridTemplateColumns: '1.25fr 1fr', gap: 36, position: 'relative', zIndex: 3 }}>

        {/* collage stage */}
        <div style={{ position: 'relative', minWidth: 0 }}>
          {/* clipped textured backdrop */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#120d0f',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 2px, transparent 2px 26px)',
            borderRadius: 18, overflow: 'hidden' }} />
          {Array.from({ length: count }).map((_, i) => {
            const s = SCRAPS[i];
            const rot = (p.tilt * s.k).toFixed(1);
            return (
              <div key={i} style={{ position: 'absolute', left: s.left, top: s.top, width: s.w, height: s.h,
                transform: 'rotate(' + rot + 'deg)', background: '#fff', padding: 12, paddingBottom: 34,
                boxShadow: '0 18px 40px rgba(0,0,0,.5)', zIndex: 10 + i }}>
                <div style={{ width: '100%', height: '100%' }}>
                  <SwImageSlot value={p.media[i] || null} onChange={(src) => p.onMediaChange(i, src)}
                    fit={p.mediaFit} accent={SCRAP_TINT[i % SCRAP_TINT.length]} radius={0} tone="light"
                    label={i + 1} placeholder={p.mediaPlaceholder} />
                </div>
                {p.showTape && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', width: 86, height: 26,
                    transform: 'translateX(-50%) rotate(' + (-rot * 1.4) + 'deg)',
                    background: 'rgba(245,225,227,.55)', mixBlendMode: 'screen',
                    boxShadow: '0 1px 4px rgba(0,0,0,.25)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ransom headline */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase', color: accent }}>{p.eyebrow}</div>
          <h2 style={{ fontWeight: 900, fontSize: 78, lineHeight: 1.16, letterSpacing: '-1px', marginTop: 22 }}>
            <span>{p.line1}</span><br />
            <Hl tone="g" block style={{ transform: 'rotate(-2deg)', display: 'inline-block' }}>{p.line2}</Hl><br />
            <Hl tone="o" block style={{ transform: 'rotate(1.5deg)', display: 'inline-block', marginTop: 8 }}>{p.line3}</Hl><span>。</span>
          </h2>
          <p style={{ fontSize: 24, lineHeight: 1.62, color: '#c8c0bd', marginTop: 26 }}>
            {p.intro}
          </p>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
