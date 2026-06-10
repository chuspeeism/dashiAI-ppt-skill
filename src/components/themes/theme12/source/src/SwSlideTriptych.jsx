// SwSlideTriptych.jsx — "三联像 / Triptych" editorial portrait page.
//
// A row of tall portrait frames (a triptych) with a thin caption rail beneath
// each, plus one solid colour-blocked "title" panel that interlocks with the
// frames. Distinct from Duo (2 frames + centred text), Filmstrip (horizontal
// contact strip) and Mosaic (asymmetric collage). Frame count (2–4), title-panel
// side, captions, mediaFit, accent and theme are props-controlled, 1:1 with
// controls; all visible copy/data defaults live in `defaultProps`. Image slots
// are fully controlled (media + onMediaChange). No global
// side effects, no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'triptych', index: 11, label: '三联像 / Triptych' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  frameCount: 3,           // 2–4 portrait frames
  panelSide: 'left',       // 'left' | 'right' — solid title panel position
  showCaptions: true,
  showIndex: true,
  mediaFit: 'cover',       // 'cover' | 'contain'
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '11 — Triptych',
  panelKicker: '影像 / Faces',
  panelTitle: '每一帧，\n都是一条[[声浪]]。',
  panelText: '从录音棚的深夜，到结算页的那笔到账——创作的每个瞬间，都被同一块工作台接住。',
  panelHint: '/ Frames · drag to fill',
  mediaPlaceholder: '拖入人像',
  captions: [
    { cn: '录音棚', en: 'Studio · 02:14 AM' },
    { cn: '巡演路上', en: 'On Tour · Berlin' },
    { cn: '结算页', en: 'Payout · +¥8,420' },
    { cn: '后台', en: 'Backstage · Live' },
  ],
  page: '11',
  total: '82',
};

export const controls = [
  { key: 'frameCount', label: '画框数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '竖向人像画框的数量' },
  { key: 'panelSide', label: '标题面板', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '居左' }, { value: 'right', label: '居右' }], desc: '实色标题面板的位置' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showCaptions', label: '图注', type: 'toggle', def: true, desc: '显示/隐藏每框下方图注' },
  { key: 'showIndex', label: '序号角标', type: 'toggle', def: true, desc: '显示/隐藏画框序号' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '标题面板 / 高亮 / 页脚强调色' },
];

export default function SwSlideTriptych(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(2, Math.min(4, p.frameCount));
  const left = p.panelSide === 'left';
  const CAPS = p.captions;

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#c8c0bd' : '#5a4f54';

  const Panel = (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: swTheme.radius, background: accent,
      color: '#fff', padding: '40px 36px 34px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: -70, right: -16, fontFamily: F.mono,
        fontWeight: 700, fontSize: 240, lineHeight: 0.8, color: 'rgba(255,255,255,.14)', pointerEvents: 'none' }}>{p.page}</div>
      <Shape kind="ring" size={64} border={13} color="rgba(255,255,255,.4)" style={{ top: 34, right: 30, zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
        <div style={{ fontFamily: F.mono, fontSize: 23, fontWeight: 700, letterSpacing: '.16em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,.86)' }}>{p.panelKicker}</div>
        <h2 style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.08, letterSpacing: '-1.5px', marginTop: 18 }}>
          {renderSwText(p.panelTitle, { hl: { tone: 'o', block: true, style: { background: '#fff', color: accent } } })}
        </h2>
        <p style={{ fontSize: 24, lineHeight: 1.6, color: 'rgba(255,255,255,.9)', marginTop: 22 }}>
          {p.panelText}
        </p>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,.78)', marginTop: 26, position: 'relative', zIndex: 2 }}>
        {String(count).padStart(2, '0')} {p.panelHint}
      </div>
    </div>
  );

  const Frames = (
    <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 18,
      gridTemplateColumns: 'repeat(' + count + ',1fr)' }}>
      {Array.from({ length: count }).map((_, i) => {
        const pal = swCardPalette[i % swCardPalette.length];
        const cap = CAPS[i % CAPS.length];
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                fit={p.mediaFit} accent={pal.bg} radius={20} tone={dark ? 'dark' : 'light'}
                label={p.showIndex ? i + 1 : null} placeholder={p.mediaPlaceholder} />
            </div>
            {p.showCaptions && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: pal.bg, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: 25, letterSpacing: '-.3px', color: fg }}>{cap.cn}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.08em', color: mut,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cap.en}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 24, padding: '24px 0 22px',
        gridTemplateColumns: left ? '0.62fr 1.38fr' : '1.38fr 0.62fr', position: 'relative', zIndex: 3 }}>
        {left ? <>{Panel}{Frames}</> : <>{Frames}{Panel}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
