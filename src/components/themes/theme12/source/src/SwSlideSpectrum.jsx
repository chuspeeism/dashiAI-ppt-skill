// SwSlideSpectrum.jsx — image-led "声波画廊 / Spectrum" page.
//
// A brand-tied gallery: image slots become the bars of an audio spectrum, each
// column sized by a fixed waveform envelope and centred on a mid-line, so the
// photos literally spell out a sound wave (声浪). Distinct from the balanced
// Showcase grid and the interlocking Mosaic. Column count (5–9), fit, the
// centre axis and frame numbers are props-controlled and map 1:1 to `controls`;
// all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media` / `onMediaChange`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'spectrum', index: 68, label: '声波画廊 / Spectrum' };

export const defaultProps = {
  accent: C.lime,
  mediaCount: 7,           // 5–9 image columns
  mediaFit: 'cover',
  showAxis: true,          // centre baseline
  showNumbers: true,       // frame numbers
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '68 — Spectrum',
  kicker: '声波画廊 / Waveform',
  title: '每一张图，都是一段[[声浪]]。',
  hint: 'Frames',
  page: '68',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '图片列数', type: 'slider', def: 7, min: 5, max: 9, step: 1,
    desc: '组成声波的图片列数' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'showAxis', label: '中线', type: 'toggle', def: true, desc: '显示/隐藏声波中线' },
  { key: 'showNumbers', label: '帧编号', type: 'toggle', def: true, desc: '显示/隐藏每列帧编号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.lime,
    options: [C.lime, C.cyan, C.orange, C.plum], desc: '中线 / 导语 / 页脚强调色' },
];

// Symmetric-ish waveform envelope (0–1) for up to 9 columns.
const ENV = [0.42, 0.7, 0.96, 0.6, 1.0, 0.55, 0.88, 0.5, 0.66];

export default function SwSlideSpectrum(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(5, Math.min(9, p.mediaCount));
  // re-centre the envelope window so the tallest column stays near the middle
  const start = Math.floor((ENV.length - count) / 2);
  const amps = Array.from({ length: count }, (_, i) => ENV[start + i] ?? ENV[i % ENV.length]);

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flexShrink: 0, marginTop: 22, marginBottom: 6, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between' }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.06, letterSpacing: '-1.2px', marginTop: 12, color: C.blush }}>
            {renderSwText(p.title, { hl: { tone: 'g' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase',
          color: '#9a8f8c', textAlign: 'right' }}>{String(count).padStart(2, '0')} {p.hint}<br />drag to fill</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', alignItems: 'center',
        gap: 14, padding: '10px 0 6px' }}>
        {p.showAxis && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2,
            background: accent, opacity: 0.5, zIndex: 0 }} />
        )}
        {amps.map((a, i) => (
          <div key={i} style={{ flex: 1, minWidth: 0, height: (52 + a * 48) + '%', position: 'relative', zIndex: 1 }}>
            <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
              fit={p.mediaFit} accent={accent} radius={18} tone="dark"
              label={p.showNumbers ? i + 1 : null} placeholder="" />
          </div>
        ))}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
