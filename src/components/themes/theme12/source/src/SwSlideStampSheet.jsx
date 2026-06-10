// SwSlideStampSheet.jsx — "邮票张 / Stamps" perforated stamp-sheet page.
//
// A sheet of postage stamps: white perforated tiles (dotted-border trick) each
// holding an image, a denomination and a "声浪邮政" line. Distinct from Filmstrip
// (film + sprockets), GridWall (flush tiles) and Album (tracklist). Stamp count
// (4–8), the denomination, the selvage header and accent are props-controlled,
// 1:1 with `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media`/`onMediaChange`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'stampsheet', index: 25, label: '邮票张 / Stamps' };

export const defaultProps = {
  accent: C.orange,
  mediaCount: 6,           // 4–8 stamps
  mediaFit: 'cover',
  showDenom: true,
  cols: 4,                 // 3–4 columns
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '25 — Stamps',
  kicker: '邮票张 / Stamps',
  title: '每张作品，[[值得收藏]]。',
  intro: '把现场、封面与样带，做成一枚枚可寄出的邮票——独立音乐，也能盖上自己的邮戳。',
  postLabel: '声浪邮政',
  metaPrefix: '声浪邮政 ·',
  mediaPlaceholder: '拖入',
  stampTint: ['#f15a29', '#3bb6ec', '#c44ee0', '#1f6b2a', '#fbb24d', '#d61fb5', '#74d2f0', '#baf04f'],
  denom: ['¥1.2', '¥2.0', '¥0.8', '¥3.0', '¥1.5', '¥0.5', '¥2.4', '¥1.0'],
  page: '25',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '邮票数量', type: 'slider', def: 6, min: 4, max: 8, step: 1,
    desc: '邮票张上的邮票数量' },
  { key: 'cols', label: '每行列数', type: 'slider', def: 4, min: 3, max: 4, step: 1,
    desc: '每行排布的邮票数' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '邮票图填充方式' },
  { key: 'showDenom', label: '面值', type: 'toggle', def: true, desc: '显示/隐藏每枚邮票的面值' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 高亮 / 页脚强调色' },
];

const SHEET_BG = '#eee3d2';

export default function SwSlideStampSheet(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(4, Math.min(8, p.mediaCount));
  const cols = Math.max(3, Math.min(4, p.cols));
  const rows = Math.ceil(count / cols);
  const STAMP_TINT = p.stampTint;
  const DENOM = p.denom;

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flex: 1, minHeight: 0, margin: '22px 0 20px', display: 'grid',
        gridTemplateColumns: '300px 1fr', gap: 36, position: 'relative', zIndex: 3 }}>

        {/* intro rail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 12 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
          <p style={{ fontSize: 23, lineHeight: 1.6, color: '#c8c0bd', marginTop: 20 }}>
            {p.intro}
          </p>
          <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'rgba(245,225,227,.55)', marginTop: 22 }}>{p.metaPrefix} {String(count).padStart(2, '0')} stamps · drag to fill</div>
        </div>

        {/* stamp sheet */}
        <div style={{ background: SHEET_BG, borderRadius: 12, padding: 22,
          boxShadow: '0 24px 50px rgba(0,0,0,.4)', display: 'flex', minHeight: 0 }}>
          <div style={{ width: '100%', height: '100%', display: 'grid', gap: 14,
            gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gridTemplateRows: 'repeat(' + rows + ', 1fr)' }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} style={{ background: '#fff', border: '7px dotted ' + SHEET_BG,
                padding: 8, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  marginBottom: 6 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 700, letterSpacing: '.08em',
                    color: C.ink }}>{p.postLabel}</span>
                  {p.showDenom && (
                    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 16,
                      color: STAMP_TINT[i % STAMP_TINT.length] }}>{DENOM[i % DENOM.length]}</span>
                  )}
                </div>
                <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                  <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                    fit={p.mediaFit} accent={STAMP_TINT[i % STAMP_TINT.length]} radius={0} tone="light"
                    label={i + 1} placeholder={p.mediaPlaceholder} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
