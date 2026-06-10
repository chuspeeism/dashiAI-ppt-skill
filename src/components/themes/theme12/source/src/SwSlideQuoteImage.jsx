// SwSlideQuoteImage.jsx — "图上金句 / Quote over Image" cinematic page.
//
// A full-bleed image with a tinted scrim and a large pull-quote laid over it —
// distinct from Quote (typographic, no image) and Testimonial (portrait + card).
// Tint style (dark / accent), quote position, quote-mark glyph and accent are
// props-controlled; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media`/`onMediaChange`; the
// component owns no persistence and degrades to a coloured panel when empty.

import React from 'react';
import { swTheme } from './swTheme.js';
import { Kicker, useSwReveal, injectBaseStyles, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'quoteimage', index: 73, label: '图上金句 / Quote over Image' };

export const defaultProps = {
  accent: C.orange,
  tint: 'dark',            // 'dark' | 'accent'
  quotePos: 'bottom',      // 'bottom' | 'center'
  showMark: true,
  showAttribution: true,
  media: [],
  onMediaChange: () => {},
  // —— content（引文中 **x** = 下划线强调）——
  kicker: '金句 / In Their Words',
  quote: '我第一次清楚地看见，\n我的歌，**到底值多少钱**。',
  authorName: '陈屿 · 独立音乐人',
  authorEn: 'Chen Yu — Indie Artist, 4 yrs on SoundWave',
  footLabel: '声浪 SOUNDWAVE — Independent Music OS',
  mediaPlaceholder: '拖入整幅现场 / 人物大图',
  page: '73',
  total: '82',
};

export const controls = [
  { key: 'tint', label: '蒙版色调', type: 'segment', def: 'dark',
    options: [{ value: 'dark', label: '深色' }, { value: 'accent', label: '强调色' }], desc: '图片上的蒙版色调' },
  { key: 'quotePos', label: '金句位置', type: 'segment', def: 'bottom',
    options: [{ value: 'bottom', label: '底部' }, { value: 'center', label: '居中' }], desc: '金句在画面中的位置' },
  { key: 'showMark', label: '引号装饰', type: 'toggle', def: true, desc: '显示/隐藏大引号符号' },
  { key: 'showAttribution', label: '署名', type: 'toggle', def: true, desc: '显示/隐藏引文署名' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '蒙版 / 引号 / 页脚强调色' },
];

export default function SwSlideQuoteImage(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const center = p.quotePos === 'center';
  const rootRef = React.useRef(null);
  React.useEffect(() => { injectBaseStyles(); }, []);
  useSwReveal(rootRef);

  const scrim = p.tint === 'accent'
    ? `linear-gradient(${center ? '180deg' : '15deg'}, ${accent}f0 0%, ${accent}b0 38%, ${accent}40 100%)`
    : `linear-gradient(${center ? '180deg' : '15deg'}, rgba(12,8,9,.92) 0%, rgba(12,8,9,.62) 42%, rgba(12,8,9,.15) 100%)`;

  return (
    <div ref={rootRef} className="sw-root" style={{ position: 'absolute', inset: 0, overflow: 'hidden',
      fontFamily: F.sans, color: '#fff', background: C.dark }}>
      {/* full-bleed image — excluded from the staggered reveal so the backdrop
         doesn't slide; the quote block and footer animate in instead. */}
      <div data-sw-no-reveal="" style={{ position: 'absolute', inset: 0 }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit="cover" accent={accent} radius={0} tone="dark" placeholder={p.mediaPlaceholder} />
      </div>

      {/* tint scrim (only when an image is present, so the empty slot stays usable) */}
      {p.media[0] && <div data-sw-no-reveal="" style={{ position: 'absolute', inset: 0, background: scrim, pointerEvents: 'none' }} />}

      {/* content */}
      <div style={{ position: 'absolute', inset: 0, padding: '64px 96px 124px', display: 'flex', flexDirection: 'column',
        justifyContent: center ? 'center' : 'flex-end', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left', pointerEvents: 'none', zIndex: 2 }}>

        <div style={{ pointerEvents: 'auto', maxWidth: center ? 1280 : 1180 }}>
          <Kicker accent={p.tint === 'accent' ? '#fff' : accent}>{p.kicker}</Kicker>

          {p.showMark && (
            <div aria-hidden="true" style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 150,
              lineHeight: 0.6, color: p.tint === 'accent' ? '#fff' : accent, height: 70, overflow: 'hidden',
              marginTop: 18 }}>“</div>
          )}

          <blockquote style={{ fontWeight: 900, fontSize: 78, lineHeight: 1.18, letterSpacing: '-1.5px',
            margin: '18px 0 0', textShadow: '0 2px 24px rgba(0,0,0,.4)' }}>
            {renderSwText(p.quote, { strong: { color: p.tint === 'accent' ? '#fff' : accent, fontWeight: 'inherit',
              textDecoration: 'underline', textDecorationThickness: 6, textUnderlineOffset: 8 } })}
          </blockquote>

          {p.showAttribution && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 42,
              justifyContent: center ? 'center' : 'flex-start' }}>
              <span style={{ width: 54, height: 4, background: p.tint === 'accent' ? '#fff' : accent, borderRadius: 2 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: '-.3px' }}>{p.authorName}</div>
                <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.78)', marginTop: 4 }}>{p.authorEn}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div style={{ position: 'absolute', left: 96, right: 96, bottom: 36, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,.7)', pointerEvents: 'none' }}>
        <div>{p.footLabel}</div>
        <div><b style={{ color: p.tint === 'accent' ? '#fff' : accent }}>{p.page}</b> / {p.total}</div>
      </div>
    </div>
  );
}
