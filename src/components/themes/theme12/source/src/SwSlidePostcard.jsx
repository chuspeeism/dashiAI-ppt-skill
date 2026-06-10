// SwSlidePostcard.jsx — "明信片 / Postcard" single-photo keepsake page.
//
// One landscape photo mounted as the front of a postcard, paired with a
// reverse-side message panel: a stamp slot, postmark, divider rule and address
// lines. Distinct from Polaroid (tilted print) and Magazine (editorial spread).
// Photo side, stamp, postmark, divider and accent are props-controlled and map
// 1:1 to `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media` / `onMediaChange`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'postcard', index: 22, label: '明信片 / Postcard' };

export const defaultProps = {
  accent: C.orange,
  imageSide: 'left',       // photo on 'left' | 'right'
  showStamp: true,         // stamp slot + postmark
  showPostmark: true,
  showDivider: true,       // vertical rule splitting message / address
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '22 — Postcard',
  photoTag: 'Greetings from 现场',
  eyebrow: 'Post Card',
  title: '每一站都想\n写信告诉你。',
  message: '台上三分钟，台下一整年。把这张寄给那个最初按下录音键的自己——你做到了，而且才刚开始。',
  postmark: { name: '声浪邮政', year: '2026', foot: 'LIVE · 现场' },
  mediaPlaceholder: '拖入风景 / 现场照片',
  stampPlaceholder: '邮票',
  addr: ['致 — 所有还在等被听见的人', '声浪邮局 · 独立音乐 OS', '中国 · 任何有现场的地方'],
  page: '22',
  total: '82',
};

export const controls = [
  { key: 'imageSide', label: '照片位置', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], desc: '照片所在的一侧' },
  { key: 'showStamp', label: '邮票槽', type: 'toggle', def: true, desc: '显示/隐藏邮票占位（可拖入图片）' },
  { key: 'showPostmark', label: '邮戳', type: 'toggle', def: true, dependsOn: 'showStamp', desc: '邮票上的圆形邮戳' },
  { key: 'showDivider', label: '分隔竖线', type: 'toggle', def: true, desc: '信息区与地址区之间的竖线' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '照片的填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '邮戳 / 标记 / 页脚强调色' },
];

export default function SwSlidePostcard(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const imgLeft = p.imageSide !== 'right';
  const ADDR = p.addr;

  const PhotoSide = (
    <div style={{ position: 'relative', minWidth: 0, height: '100%', padding: 18,
      background: '#fbf7f3', borderRight: imgLeft ? '2px dashed ' + C.line2 : 'none',
      borderLeft: imgLeft ? 'none' : '2px dashed ' + C.line2 }}>
      <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
        fit={p.mediaFit} accent={accent} radius={6} tone="light" placeholder={p.mediaPlaceholder} />
      <div style={{ position: 'absolute', left: 30, bottom: 30, padding: '7px 15px', background: '#fbf7f3',
        fontFamily: F.mono, fontSize: 19, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1b1518',
        boxShadow: '0 4px 14px rgba(0,0,0,.16)' }}>{p.photoTag}</div>
    </div>
  );

  const MessageSide = (
    <div style={{ position: 'relative', minWidth: 0, height: '100%', padding: '38px 44px',
      display: 'grid', gridTemplateColumns: p.showDivider ? '1fr 1fr' : '1fr', gap: 36 }}>
      {/* postmark + stamp, anchored top-right */}
      {p.showStamp && (
        <div style={{ position: 'absolute', top: 34, right: 40, width: 120, zIndex: 3 }}>
          <div style={{ width: 120, height: 144, padding: 6, background: '#fff',
            boxShadow: '0 2px 10px rgba(0,0,0,.12)',
            clipPath: 'polygon(0% 4%,4% 0,8% 4%,12% 0,16% 4%,20% 0,24% 4%,28% 0,32% 4%,36% 0,40% 4%,44% 0,48% 4%,52% 0,56% 4%,60% 0,64% 4%,68% 0,72% 4%,76% 0,80% 4%,84% 0,88% 4%,92% 0,96% 4%,100% 0,100% 96%,96% 100%,92% 96%,88% 100%,84% 96%,80% 100%,76% 96%,72% 100%,68% 96%,64% 100%,60% 96%,56% 100%,52% 96%,48% 100%,44% 96%,40% 100%,36% 96%,32% 100%,28% 96%,24% 100%,20% 96%,16% 100%,12% 96%,8% 100%,4% 96%,0 100%)' }}>
            <SwImageSlot value={p.media[1] || null} onChange={(s) => p.onMediaChange(1, s)}
              fit="cover" accent={accent} radius={2} tone="light" placeholder={p.stampPlaceholder} />
          </div>
          {p.showPostmark && (
            <div aria-hidden="true" style={{ position: 'absolute', top: -20, left: -28, opacity: .76,
              transform: 'rotate(-12deg)', pointerEvents: 'none' }}>
              <div style={{ width: 106, height: 106, borderRadius: '50%', border: '2.5px solid ' + accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', border: '1px solid ' + accent,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 11, letterSpacing: '.12em', color: accent }}>{p.postmark.name}</span>
                  <span style={{ width: 52, borderTop: '1px solid ' + accent, opacity: .7 }} />
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '.02em', lineHeight: 1, color: accent }}>{p.postmark.year}</span>
                  <span style={{ width: 52, borderTop: '1px solid ' + accent, opacity: .7 }} />
                  <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '.14em', color: accent }}>{p.postmark.foot}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* message column */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.24em', textTransform: 'uppercase',
          color: accent, marginBottom: 22 }}>{p.eyebrow}</div>
        <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.16, letterSpacing: '-1px', color: C.ink }}>
          {renderSwText(p.title)}
        </h2>
        <p style={{ fontSize: 23, lineHeight: 1.7, color: '#5a4f54', marginTop: 22, maxWidth: 460 }}>
          {p.message}
        </p>
      </div>

      {/* address column */}
      {p.showDivider && (
        <div style={{ minWidth: 0, borderLeft: '2px solid ' + C.line, paddingLeft: 36,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {ADDR.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                <span style={{ flexShrink: 0, width: 26, fontFamily: F.mono, fontSize: 18, color: accent, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1, borderBottom: '1.5px solid ' + C.line2, paddingBottom: 4,
                  fontSize: 18, color: C.ink, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis' }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, margin: '24px 0 22px', background: C.paper, borderRadius: 20,
        overflow: 'hidden', boxShadow: '0 26px 60px rgba(27,21,24,.16)', display: 'grid',
        gridTemplateColumns: '1.05fr 1fr', position: 'relative' }}>
        {imgLeft ? <>{PhotoSide}{MessageSide}</> : <>{MessageSide}{PhotoSide}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
