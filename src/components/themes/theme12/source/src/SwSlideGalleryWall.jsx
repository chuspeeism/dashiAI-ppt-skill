// SwSlideGalleryWall.jsx — "画框墙 / Gallery Wall" framed-print hang page.
//
// Artworks hung salon-style: each image sits in a wide mat inside a dark frame
// with an engraved plaque caption below. Distinct from GridWall (edge-to-edge
// tiles) and Mosaic (interlocking collage). Frame count (3–6), the mat, the
// plaques and accent are props-controlled, 1:1 with `controls`; all visible
// copy/data defaults live in `defaultProps`. Image data is
// controlled via `media`/`onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'gallerywall', index: 67, label: '画框墙 / Gallery Wall' };

export const defaultProps = {
  accent: C.rust,
  mediaCount: 4,           // 3–6 framed works
  mediaFit: 'cover',
  showMat: true,
  showPlaque: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '67 — Gallery Wall',
  kicker: '画框墙 / Gallery Wall',
  title: '把每张作品，[[挂上墙]]。',
  metaPrefix: '声浪典藏 ·',
  mediaPlaceholder: '拖入画作',
  plaques: [
    { t: '《潮汐》', s: '林夏 · 数字版税', y: '2026' },
    { t: '《霓虹废墟》', s: '阿特拉斯 · 现场', y: '2026' },
    { t: '《回声花园》', s: 'Mira K. · 海外发行', y: '2025' },
    { t: '《盐与光》', s: '老周厂牌 · 黑胶', y: '2026' },
    { t: '《夜行列车》', s: '午夜电台 · 巡演', y: '2025' },
    { t: '《低气压》', s: '声浪现场 · 众筹', y: '2026' },
  ],
  page: '67',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '画框数量', type: 'slider', def: 4, min: 3, max: 6, step: 1,
    desc: '墙上悬挂的画框数量' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '画作填充方式' },
  { key: 'showMat', label: '卡纸边', type: 'toggle', def: true, desc: '显示/隐藏画框内的白色卡纸边' },
  { key: 'showPlaque', label: '铭牌', type: 'toggle', def: true, desc: '显示/隐藏画框下方的作品铭牌' },
  { key: 'accent', label: '强调色', type: 'color', def: C.rust,
    options: [C.rust, C.orange, C.purple, C.green], desc: '导语 / 高亮 / 页脚强调色' },
];

// rows per count keep frames a pleasing portrait-ish ratio
const COLS = { 3: 3, 4: 4, 5: 5, 6: 3 };

export default function SwSlideGalleryWall(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(6, p.mediaCount));
  const cols = COLS[count] || count;
  const rows = Math.ceil(count / cols);
  const matPad = p.showMat ? 14 : 0;
  const PLAQUES = p.plaques;

  return (
    <SlideRoot bg="#efe6df" color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, marginTop: 20, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 40 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 12 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
          color: C.inkMut, textAlign: 'right', paddingBottom: 6 }}>
          {p.metaPrefix} {String(count).padStart(2, '0')} works<br />drag to fill
        </div>
      </div>

      {/* picture rail */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 20, paddingTop: 18,
        borderTop: '3px solid rgba(27,21,24,.22)', display: 'grid', gap: 30,
        gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gridTemplateRows: 'repeat(' + rows + ', 1fr)' }}>
        {Array.from({ length: count }).map((_, i) => {
          const pl = PLAQUES[i % PLAQUES.length];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0 }}>
              {/* frame */}
              <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column',
                background: 'linear-gradient(145deg, #2a2023, #160f11)',
                padding: 12, borderRadius: 4, boxShadow: '0 22px 40px rgba(27,21,24,.32)',
                border: '1px solid rgba(0,0,0,.5)' }}>
                <div style={{ flex: 1, minHeight: 0, background: '#faf6f1', padding: matPad, borderRadius: 1,
                  display: 'flex' }}>
                  <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                    <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                      fit={p.mediaFit} accent={accent} radius={0} tone="light" placeholder={p.mediaPlaceholder} />
                  </div>
                </div>
              </div>
              {/* plaque */}
              {p.showPlaque && (
                <div style={{ flexShrink: 0, marginTop: 14, background: 'linear-gradient(180deg,#caa46a,#a9823f)',
                  borderRadius: 3, padding: '7px 14px', textAlign: 'center', minWidth: '70%',
                  boxShadow: '0 3px 8px rgba(27,21,24,.25)' }}>
                  <div style={{ fontWeight: 700, fontSize: 19, color: '#2a1c08', letterSpacing: '-.2px' }}>{pl.t}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 14, letterSpacing: '.06em', color: '#4a3410',
                    marginTop: 1 }}>{pl.s} · {pl.y}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <Footer page={p.page} total={p.total} accent={accent} />
      </div>
    </SlideRoot>
  );
}
