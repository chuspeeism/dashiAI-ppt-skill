// SwSlideFullBleed.jsx — "满版出血 / Full Bleed" single-image page.
//
// One edge-to-edge image owns the entire canvas; a solid colour-blocked title
// card floats in a corner, with a legibility scrim and floating shapes over the
// image. Distinct from Showcase (image + text columns), Hero and Spotlight
// (annotated single image). Card corner, scrim, caption, mediaFit, accent and
// shapes are props-controlled, 1:1 with controls; all visible copy/data defaults
// live in `defaultProps`. The single image slot is fully
// controlled (media + onMediaChange). No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { Hl, Shape, injectBaseStyles, useSwReveal, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'fullbleed', index: 18, label: '满版出血 / Full Bleed' };

export const defaultProps = {
  accent: C.orange,
  cardCorner: 'bl',        // 'bl' | 'br' | 'tl' | 'tr'
  showScrim: true,         // legibility gradient behind the card
  showCaption: true,
  showShapes: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  brand: '声浪 SOUNDWAVE',
  metaLine: '13 — Full Bleed',
  kicker: '现场 / In The Wild',
  title: '声音发生的\n[[地方]]。',
  caption: '每一张照片背后，是一个正在用声浪经营自己事业的创作者。',
  mediaPlaceholder: '拖入整版大图 / Full-bleed image',
  page: '18',
  total: '82',
};

export const controls = [
  { key: 'cardCorner', label: '文字卡位置', type: 'segment', def: 'bl',
    options: [{ value: 'bl', label: '左下' }, { value: 'br', label: '右下' }, { value: 'tl', label: '左上' }, { value: 'tr', label: '右上' }],
    desc: '实色文字卡所在的画面角落' },
  { key: 'showScrim', label: '压暗渐变', type: 'toggle', def: true, desc: '文字卡后的压暗渐变，提升可读性' },
  { key: 'showCaption', label: '副文案', type: 'toggle', def: true, desc: '显示/隐藏卡片副文案' },
  { key: 'showShapes', label: '几何装饰', type: 'toggle', def: true, desc: '显示/隐藏漂浮的几何装饰' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '文字卡 / 高亮 / 角标强调色' },
];

export default function SwSlideFullBleed(props) {
  const p = { ...defaultProps, ...props };
  React.useEffect(() => { injectBaseStyles(); }, []);
  const rootRef = React.useRef(null);
  useSwReveal(rootRef);
  const accent = p.accent;
  const corner = p.cardCorner;
  const isBottom = corner === 'bl' || corner === 'br';
  const isLeft = corner === 'bl' || corner === 'tl';

  const cardPos = {
    position: 'absolute', zIndex: 4, maxWidth: 720,
    [isBottom ? 'bottom' : 'top']: 0, [isLeft ? 'left' : 'right']: 0,
  };
  const scrimDir = (isBottom ? 'to top' : 'to bottom') + (isLeft ? ' left' : ' right');

  return (
    <div ref={rootRef} className="sw-root" style={{ position: 'absolute', inset: 0, overflow: 'hidden',
      fontFamily: F.sans, background: C.dark, color: '#fff' }}>

      {/* full-bleed image */}
      <div data-sw-no-reveal="" style={{ position: 'absolute', inset: 0 }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit={p.mediaFit} accent={accent} radius={0} tone="dark"
          placeholder={p.mediaPlaceholder} />
      </div>

      {/* legibility scrim */}
      {p.showScrim && p.media[0] && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(' + scrimDir + ', rgba(15,11,12,.74) 0%, rgba(15,11,12,.28) 34%, rgba(15,11,12,0) 60%)' }} />
      )}

      {/* top brand mark */}
      <div style={{ position: 'absolute', top: 40, left: 48, zIndex: 4, display: 'flex',
        alignItems: 'center', gap: 13 }}>
        <span style={{ width: 16, height: 16, background: accent, borderRadius: 4 }} />
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 23, letterSpacing: '.2em',
          color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,.5)' }}>{p.brand}</span>
      </div>
      <div style={{ position: 'absolute', top: 40, right: 48, zIndex: 4, fontFamily: F.mono,
        fontSize: 22, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)',
        textShadow: '0 1px 8px rgba(0,0,0,.5)' }}>{p.metaLine}</div>

      {p.showShapes && (
        <>
          <Shape kind="pentagon" size={66} color={accent} style={{ top: 130, right: 90, zIndex: 3, opacity: .92 }} />
          <Shape kind="ring" size={74} border={14} color="rgba(255,255,255,.5)" style={{ top: 200, right: 180, zIndex: 3 }} />
        </>
      )}

      {/* title card */}
      <div style={cardPos}>
        <div style={{ position: 'relative', overflow: 'hidden', background: accent, color: '#fff',
          padding: '40px 52px 42px',
          borderRadius: corner === 'bl' ? '0 26px 0 0' : corner === 'br' ? '26px 0 0 0'
            : corner === 'tl' ? '0 0 26px 0' : '0 0 0 26px' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -50, right: 24, fontFamily: F.mono,
            fontWeight: 700, fontSize: 200, lineHeight: 0.8, color: 'rgba(255,255,255,.14)', pointerEvents: 'none' }}>{p.page}</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 13, fontFamily: F.mono,
              fontSize: 23, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.9)' }}>
              <span style={{ width: 38, height: 3, background: '#fff', borderRadius: 2 }} />{p.kicker}
            </div>
            <h1 style={{ fontWeight: 900, fontSize: 92, lineHeight: 1.02, letterSpacing: '-2.5px', marginTop: 22 }}>
              {renderSwText(p.title, { hl: { tone: 'o', block: true, style: { background: '#fff', color: accent } } })}
            </h1>
            {p.showCaption && (
              <p style={{ fontSize: 26, lineHeight: 1.6, color: 'rgba(255,255,255,.92)', marginTop: 24, maxWidth: 560 }}>
                {p.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* page number — always on the bottom, diagonally opposite the card */}
      <div style={{ position: 'absolute', zIndex: 4, fontFamily: F.mono, fontSize: 22,
        letterSpacing: '.12em', color: 'rgba(255,255,255,.8)', textShadow: '0 1px 8px rgba(0,0,0,.5)',
        bottom: 44, [isLeft ? 'right' : 'left']: 48 }}>
        <b style={{ color: accent }}>{p.page}</b> / {p.total}
      </div>
    </div>
  );
}
