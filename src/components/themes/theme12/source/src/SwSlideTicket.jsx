// SwSlideTicket.jsx — "票根 / Ticket Stub" live-show admission page.
//
// The slide is shaped like a concert ticket: a large artist photo fills the
// main body while a perforated stub on the right carries the event details in
// monospace (date / venue / seat / barcode). Distinct from Postcard (mailer),
// Hero (full-bleed) and Spotlight (annotated image). theme, mediaFit, the
// perforation, the barcode and accent are all props-controlled, 1:1 with
// `controls`; all visible copy/data defaults live in `defaultProps`.
// The single image is fully controlled (media + onMediaChange).
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'ticket', index: 23, label: '票根 / Ticket Stub' };

export const defaultProps = {
  accent: C.orange,
  theme: 'dark',           // 'light' | 'dark'
  mediaFit: 'cover',
  showPerforation: true,
  showBarcode: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '23 — Ticket Stub',
  admitLabel: 'ADMIT ONE · 声浪现场',
  title: '声浪巡演\n2026 夏',
  stubLabel: 'STUB · 存根',
  stubNo: 'NO. 0426',
  barcodeLabel: 'SW · 0620 · 2026',
  mediaPlaceholder: '拖入演出主视觉 / Live artwork',
  stub: [
    { k: 'DATE', v: '2026.06.20' },
    { k: 'DOORS', v: '19:30' },
    { k: 'VENUE', v: '声浪现场 LIVEHOUSE' },
    { k: 'CITY', v: '上海 · SHANGHAI' },
    { k: 'SEAT', v: 'GA — STANDING' },
  ],
  page: '23',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '票面整体明暗配色' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '主图的填充方式' },
  { key: 'showPerforation', label: '撕裂齿孔', type: 'toggle', def: true, desc: '显示/隐藏票根之间的撕裂虚线' },
  { key: 'showBarcode', label: '条形码', type: 'toggle', def: true, desc: '显示/隐藏存根下方的条形码' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '票面边条 / 存根 / 页脚强调色' },
];

function Barcode({ color }) {
  const bars = [3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 2];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }} aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w * 2.4, height: '100%', background: color, flex: '0 0 auto', borderRadius: 1 }} />
      ))}
    </div>
  );
}

export default function SwSlideTicket(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const stubBg = accent;
  const ticketBg = dark ? '#241a1d' : C.paper;
  const punch = bg; // notch colour = slide background

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, margin: '24px 0 22px', display: 'flex',
        position: 'relative', zIndex: 3, borderRadius: 26, background: ticketBg,
        boxShadow: dark ? '0 30px 80px rgba(0,0,0,.45)' : '0 30px 70px rgba(27,21,24,.16)',
        overflow: 'hidden' }}>

        {/* main body — artwork + overlaid headline */}
        <div style={{ position: 'relative', flex: '1 1 auto', minWidth: 0, padding: 18 }}>
          <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
            fit={p.mediaFit} accent={accent} radius={16} tone="dark"
            placeholder={p.mediaPlaceholder} />
          <div style={{ position: 'absolute', left: 40, bottom: 40, right: 40, zIndex: 2,
            pointerEvents: 'none', textShadow: '0 2px 24px rgba(0,0,0,.6)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: accent,
              color: '#fff', fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '.18em',
              padding: '8px 16px', borderRadius: 8, textShadow: 'none' }}>{p.admitLabel}</div>
            <h2 style={{ fontWeight: 900, fontSize: 76, lineHeight: 1.0, letterSpacing: '-2px',
              color: '#fff', marginTop: 18 }}>{renderSwText(p.title)}</h2>
          </div>
        </div>

        {/* perforation */}
        {p.showPerforation && (
          <div style={{ position: 'relative', width: 0, flex: '0 0 auto', alignSelf: 'stretch' }}>
            <div style={{ position: 'absolute', top: 14, bottom: 14, left: -1, width: 2,
              borderLeft: '3px dashed ' + (dark ? 'rgba(245,225,227,.34)' : 'rgba(27,21,24,.26)') }} />
            <span style={{ position: 'absolute', top: -19, left: -19, width: 38, height: 38,
              borderRadius: '50%', background: punch }} />
            <span style={{ position: 'absolute', bottom: -19, left: -19, width: 38, height: 38,
              borderRadius: '50%', background: punch }} />
          </div>
        )}

        {/* stub */}
        <div style={{ position: 'relative', flex: '0 0 28%', minWidth: 0, background: stubBg, color: '#fff',
          padding: '40px 38px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Shape kind="ring" size={150} border={20} color="rgba(255,255,255,.16)" style={{ top: -50, right: -50 }} />
          <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.22em', opacity: 0.85,
            position: 'relative', zIndex: 1 }}>{p.stubLabel}</div>
          <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-1px', marginTop: 6,
            position: 'relative', zIndex: 1 }}>{p.stubNo}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 17, marginTop: 30,
            position: 'relative', zIndex: 1 }}>
            {p.stub.map((s) => (
              <div key={s.k}>
                <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.2em', opacity: 0.75 }}>{s.k}</div>
                <div style={{ fontWeight: 700, fontSize: 25, letterSpacing: '-.2px', marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {p.showBarcode && (
            <div style={{ marginTop: 'auto', paddingTop: 24, position: 'relative', zIndex: 1 }}>
              <Barcode color="#fff" />
              <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.32em', marginTop: 10,
                opacity: 0.85 }}>{p.barcodeLabel}</div>
            </div>
          )}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
