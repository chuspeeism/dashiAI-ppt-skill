// SwSlideBeforeAfter.jsx — "前后对比 / Before · After" two-image compare page.
//
// Two photos meeting at a seam with a draggable-style handle and BEFORE / AFTER
// chips — framed as a transformation, distinct from Duo (generic two-up).
// Orientation, labels, the seam handle, an optional delta stat and accent are
// props-controlled and map 1:1 to `controls`; all visible copy/data defaults
// live in `defaultProps`. Image data is controlled via
// `media` / `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'beforeafter', index: 27, label: '前后对比 / Before · After' };

export const defaultProps = {
  accent: C.orange,
  orientation: 'horizontal', // 'horizontal' (side by side) | 'vertical' (stacked)
  showLabels: true,          // BEFORE / AFTER chips
  showHandle: true,          // seam handle
  showStat: true,            // delta stat strip
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '27 — Before · After',
  title: '同一个你，[[换一种活法]]。',
  beforeLabel: 'BEFORE',
  afterLabel: 'AFTER',
  beforeSub: '单打独斗',
  afterSub: '声浪之后',
  beforePlaceholder: '拖入「之前」',
  afterPlaceholder: '拖入「之后」',
  stats: [
    { v: '+320%', l: '人均年收入', e: 'Annual income' },
    { v: '72h', l: '版税到账', e: 'Payout time' },
    { v: '0', l: '需要的中间商', e: 'Middlemen' },
  ],
  page: '27',
  total: '82',
};

export const controls = [
  { key: 'orientation', label: '排布方向', type: 'segment', def: 'horizontal',
    options: [{ value: 'horizontal', label: '左右' }, { value: 'vertical', label: '上下' }], desc: '两图的排布方向' },
  { key: 'showLabels', label: '前后标签', type: 'toggle', def: true, desc: '显示/隐藏 BEFORE / AFTER 标签' },
  { key: 'showHandle', label: '中缝手柄', type: 'toggle', def: true, desc: '显示/隐藏接缝处的圆形手柄' },
  { key: 'showStat', label: '变化数据', type: 'toggle', def: true, desc: '显示/隐藏底部变化数据条' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片的填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '标签 / 手柄 / 页脚强调色' },
];

export default function SwSlideBeforeAfter(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const horiz = p.orientation !== 'vertical';

  const Chip = ({ text, sub, tone }) => (
    <div style={{ position: 'absolute', zIndex: 4,
      ...(tone === 'before' ? { top: 22, left: 22 } : (horiz ? { top: 22, right: 22 } : { bottom: 22, left: 22 })),
      display: 'flex', alignItems: 'center', gap: 11, padding: '9px 16px',
      background: tone === 'before' ? 'rgba(27,21,24,.78)' : accent, color: '#fff', borderRadius: 999,
      backdropFilter: 'blur(4px)' }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }} />
      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: '.16em' }}>{text}</span>
      <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.08em', opacity: .8 }}>{sub}</span>
    </div>
  );

  const Panel = ({ i, tone }) => (
    <div style={{ position: 'relative', minWidth: 0, minHeight: 0 }}>
      <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
        fit={p.mediaFit} accent={accent} radius={0} tone="dark"
        placeholder={tone === 'before' ? p.beforePlaceholder : p.afterPlaceholder} />
      {tone === 'before' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(27,21,24,.22)', pointerEvents: 'none' }} />
      )}
      {p.showLabels && <Chip tone={tone} text={tone === 'before' ? p.beforeLabel : p.afterLabel}
        sub={tone === 'before' ? p.beforeSub : p.afterSub} />}
    </div>
  );

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flex: 1, minHeight: 0, margin: '22px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 16, flexShrink: 0 }}>
          <h2 style={{ fontWeight: 900, fontSize: 44, lineHeight: 1.04, letterSpacing: '-1.2px' }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
        </div>

        <div style={{ flex: 1, minHeight: 0, position: 'relative', borderRadius: swTheme.radius,
          overflow: 'hidden', display: 'grid',
          gridTemplateColumns: horiz ? '1fr 1fr' : '1fr', gridTemplateRows: horiz ? '1fr' : '1fr 1fr',
          gap: 4, background: accent }}>
          <Panel i={0} tone="before" />
          <Panel i={1} tone="after" />

          {/* seam handle */}
          {p.showHandle && (
            <div style={{ position: 'absolute', zIndex: 5,
              ...(horiz
                ? { top: 0, bottom: 0, left: '50%', width: 4, transform: 'translateX(-50%)' }
                : { left: 0, right: 0, top: '50%', height: 4, transform: 'translateY(-50%)' }),
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: '50%', background: '#fff', color: accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(0,0,0,.4)',
                transform: horiz ? 'none' : 'rotate(90deg)' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={accent}
                  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}
                  aria-hidden="true">
                  <path d="M4 9 H20 M16 5 L20 9 L16 13" />
                  <path d="M20 15 H4 M8 11 L4 15 L8 19" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* delta stat */}
        {p.showStat && (
          <div style={{ flexShrink: 0, marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 28 }}>
            {p.stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 16,
                borderTop: '2px solid ' + (i === 0 ? accent : C.lineD2), paddingTop: 12 }}>
                <span style={{ fontWeight: 900, fontSize: 46, letterSpacing: '-1.5px',
                  color: i === 0 ? accent : C.blush }}>{s.v}</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 21, fontWeight: 700 }}>{s.l}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'rgba(245,225,227,.6)' }}>{s.e}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
