// SwSlideBillboard.jsx — "灯箱海报 / Lightbox" out-of-home poster panel page.
//
// A single hero image mounted as an illuminated poster panel on a dark wall,
// lit by two top spotlights, with a brand header strip and a placement caption.
// Distinct from Cover (magazine masthead), FullBleed (edge-to-edge photo) and
// Hero (split). theme, mediaFit, the spotlights, the brand strip and accent are
// props-controlled, 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. The single image is fully controlled.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'billboard', index: 19, label: '灯箱海报 / Lightbox' };

export const defaultProps = {
  accent: C.orange,
  mediaFit: 'cover',
  showSpotlights: true,
  showBrandStrip: true,
  showCaption: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '19 — Lightbox',
  brand: '声浪 SOUNDWAVE',
  brandTag: 'NOW PLAYING · 2026',
  caption: '城市中心 · 户外灯箱 6m × 3m · OUT-OF-HOME',
  mediaPlaceholder: '拖入投放主视觉 / Campaign key visual',
  page: '19',
  total: '82',
};

export const controls = [
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '海报图填充方式' },
  { key: 'showSpotlights', label: '射灯', type: 'toggle', def: true, desc: '显示/隐藏顶部射灯与光晕' },
  { key: 'showBrandStrip', label: '品牌条', type: 'toggle', def: true, desc: '显示/隐藏灯箱顶部品牌条' },
  { key: 'showCaption', label: '位置说明', type: 'toggle', def: true, desc: '显示/隐藏底部投放位置说明' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '灯箱边框 / 品牌条 / 页脚强调色' },
];

export default function SwSlideBillboard(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;

  return (
    <SlideRoot bg="#161013" color={C.blush} style={{ padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, padding: '54px 96px 48px', display: 'flex',
        flexDirection: 'column' }}>
        <Bar meta={p.barMeta} accent={accent} dark />

        {/* spotlights — mounted above the panel (zIndex 3) so the beams and
            pooled glow actually fall on the poster; toggling is clearly visible. */}
        {p.showSpotlights && (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
            {['32%', '68%'].map((l) => (
              <React.Fragment key={l}>
                {/* light beam cone, widening downward onto the poster */}
                <div style={{ position: 'absolute', top: 150, left: l, transform: 'translateX(-50%)',
                  width: 560, height: 640, clipPath: 'polygon(46% 0,54% 0,100% 100%,0 100%)',
                  background: 'linear-gradient(180deg, rgba(255,240,210,.34), rgba(255,240,210,0) 76%)',
                  mixBlendMode: 'screen' }} />
                {/* pooled glow where the beam lands */}
                <div style={{ position: 'absolute', top: 150, left: l, transform: 'translateX(-50%)',
                  width: 520, height: 520, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,240,210,.30), rgba(255,240,210,0) 60%)',
                  mixBlendMode: 'screen' }} />
                {/* lamp fixture */}
                <div style={{ position: 'absolute', top: 140, left: l, transform: 'translateX(-50%)',
                  width: 54, height: 20, borderRadius: 6, background: '#2a2023',
                  boxShadow: '0 3px 0 ' + accent + ', 0 10px 26px rgba(255,240,210,.45)' }} />
              </React.Fragment>
            ))}
          </div>
        )}

        {/* poster panel */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '22px 0', position: 'relative', zIndex: 2 }}>
          <div style={{ width: 'min(100%, 1180px)', height: '100%', maxHeight: '100%',
            background: '#0c0809', borderRadius: 12, padding: 14, border: '3px solid #2a2023',
            boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 60px rgba(255,240,210,.06)',
            display: 'flex', flexDirection: 'column' }}>
            {p.showBrandStrip && (
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: accent, color: '#fff', borderRadius: 6, padding: '10px 20px', marginBottom: 12 }}>
                <span style={{ fontWeight: 900, fontSize: 26, letterSpacing: '4px' }}>{p.brand}</span>
                <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.18em' }}>{p.brandTag}</span>
              </div>
            )}
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
                fit={p.mediaFit} accent={accent} radius={6} tone="dark"
                placeholder={p.mediaPlaceholder} />
            </div>
          </div>
        </div>

        {p.showCaption && (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            fontFamily: F.mono, fontSize: 21, letterSpacing: '.14em', textTransform: 'uppercase',
            color: 'rgba(245,225,227,.66)', marginBottom: 10, position: 'relative', zIndex: 2 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: accent }} />
            {p.caption}
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Footer page={p.page} total={p.total} accent={accent} dark />
        </div>
      </div>
    </SlideRoot>
  );
}
