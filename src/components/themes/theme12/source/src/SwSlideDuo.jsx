// SwSlideDuo.jsx — "双联像 / Diptych" twin-portrait page.
//
// Two tall portrait frames flank a centred statement — a diptych. Distinct from
// Split (single cover + editorial column), Showcase (grid) and Mosaic (collage).
// Portrait count (0–2) reshapes the composition (0 = centred statement, 1 =
// single portrait + wider text, 2 = symmetric diptych); theme, captions and
// accent are props-controlled; all visible copy/data defaults live in
// `defaultProps`. Image data is controlled via `media`/
// `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'duo', index: 70, label: '双联像 / Diptych' };

export const defaultProps = {
  accent: C.purple,
  theme: 'dark',           // 'light' | 'dark'
  mediaCount: 2,           // 0–2 portraits
  showCaptions: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  ghost: '声',
  kicker: '创作者群像 / Faces',
  title: '每一张脸，\n都是一条[[声浪]]。',
  body: '从地下室的第一支 demo，到登上更大的舞台——我们把发行、结算与版权交给系统，让更多人能只为创作而活。',
  footLabel: '12,000+ 独立音乐人 · 声浪',
  mediaPlaceholder: '拖入人像',
  page: '70',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'mediaCount', label: '人像数量', type: 'slider', def: 2, min: 0, max: 2, step: 1,
    desc: '两侧人像数量；0=纯文字，1=单侧人像，2=对称双联' },
  { key: 'showCaptions', label: '图块编号', type: 'toggle', def: true, desc: '显示/隐藏人像角标编号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.magenta, C.orange, C.green], desc: '导语 / 高亮 / 页脚强调色' },
];

export default function SwSlideDuo(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(0, Math.min(2, p.mediaCount));

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;

  const Portrait = (idx) => (
    <div style={{ minWidth: 0, minHeight: 0 }}>
      <SwImageSlot value={p.media[idx] || null} onChange={(s) => p.onMediaChange(idx, s)}
        fit="cover" accent={accent} radius={swTheme.radius} tone={dark ? 'dark' : 'light'}
        label={p.showCaptions ? idx + 1 : null} placeholder={p.mediaPlaceholder} />
    </div>
  );

  const Center = (
    <div style={{ position: 'relative', overflow: 'hidden', minWidth: 0, borderRadius: swTheme.radius,
      background: accent, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', textAlign: 'center', padding: count === 0 ? '0 80px' : '48px 40px' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: -70, right: -30, fontFamily: F.mono,
        fontWeight: 700, fontSize: 300, lineHeight: 0.8, color: 'rgba(255,255,255,.13)', pointerEvents: 'none' }}>{p.ghost}</div>
      <Shape kind="ring" size={70} border={14} color="rgba(255,255,255,.28)" style={{ top: 38, left: 40 }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.mono, fontSize: 22,
          fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.9)' }}>
          <span style={{ width: 40, height: 3, background: '#fff', borderRadius: 2 }} />{p.kicker}
        </div>
        <h2 style={{ fontWeight: 900, fontSize: count === 2 ? 56 : 76, lineHeight: 1.1, letterSpacing: '-1.5px',
          marginTop: 22, maxWidth: count === 0 ? 1200 : 640 }}>
          {renderSwText(p.title, { hl: { tone: 'o', style: { background: '#fff', color: accent } } })}
        </h2>
        <p style={{ fontSize: 25, lineHeight: 1.7, color: 'rgba(255,255,255,.92)', marginTop: 22,
          maxWidth: count === 0 ? 860 : 540 }}>
          {p.body}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30 }}>
          <span style={{ width: 48, height: 4, background: '#fff', borderRadius: 2 }} />
          <span style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)' }}>
            {p.footLabel}
          </span>
        </div>
      </div>
    </div>
  );

  // Grid template per portrait count.
  const cols = count === 2 ? '0.78fr 1.1fr 0.78fr'
    : count === 1 ? '0.85fr 1.15fr'
    : '1fr';

  return (
    <SlideRoot bg={bg} color={fg} style={{ padding: 40 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 32, gridTemplateColumns: cols, alignItems: 'stretch' }}>
        {count === 2 && <>{Portrait(0)}{Center}{Portrait(1)}</>}
        {count === 1 && <>{Portrait(0)}{Center}</>}
        {count === 0 && Center}
      </div>

      <div style={{ marginTop: 24 }}>
        <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
      </div>
    </SlideRoot>
  );
}
