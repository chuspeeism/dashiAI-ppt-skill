// SwSlideAlbum.jsx — "专辑曲目 / Tracklist" cover + track-list page.
//
// A square album cover paired with a numbered tracklist on a record-sleeve dark
// field — combines one led image with a structured list, distinct from the
// generic Showcase / Specs pages. Track count (5–10), durations, a focus
// (title) track, cover side and accent are props-controlled and map 1:1 to
// `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media` / `onMediaChange`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'album', index: 64, label: '专辑曲目 / Tracklist' };

export const defaultProps = {
  accent: C.orange,
  trackCount: 8,           // 5–10 tracks
  showDuration: true,      // runtime per track
  coverSide: 'left',       // 'left' | 'right'
  focus: true,             // highlight title track
  focusIndex: 3,           // 1-based
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '64 — Tracklist',
  coverTag: 'LP · 2026',
  albumTitle: '《现场》',
  albumSub: '声浪首发 · 全网同步上线',
  listTitle: '曲目[[清单]]',
  tracksLabel: 'TRACKS',
  focusTag: '主打',
  mediaPlaceholder: '拖入专辑封面',
  tracks: [
    { cn: '开场', en: 'Intro', d: '1:12' },
    { cn: '逆光', en: 'Backlight', d: '3:48' },
    { cn: '声浪', en: 'Soundwave', d: '4:05' },
    { cn: '夜班车', en: 'Last Bus', d: '3:21' },
    { cn: '潮汐', en: 'Tides', d: '3:57' },
    { cn: '空房间', en: 'Empty Room', d: '4:32' },
    { cn: '北纬', en: 'Latitude', d: '3:09' },
    { cn: '回声', en: 'Echo', d: '4:18' },
    { cn: '黎明前', en: 'Before Dawn', d: '3:44' },
    { cn: '尾声', en: 'Outro', d: '2:05' },
  ],
  page: '64',
  total: '82',
};

export const controls = [
  { key: 'trackCount', label: '曲目数量', type: 'slider', def: 8, min: 5, max: 10, step: 1,
    desc: '曲目清单的条目数量' },
  { key: 'showDuration', label: '时长', type: 'toggle', def: true, desc: '显示/隐藏每首曲目的时长' },
  { key: 'coverSide', label: '封面位置', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], desc: '专辑封面所在的一侧' },
  { key: 'focus', label: '主打高亮', type: 'toggle', def: true, desc: '高亮主打曲目' },
  { key: 'focusIndex', label: '主打第几首', type: 'slider', def: 3, min: 1, max: 10, step: 1,
    dependsOn: 'focus', desc: '主打曲目的序号（1 起）' },
  { key: 'mediaFit', label: '封面填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '封面的填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '主打 / 序号 / 页脚强调色' },
];

export default function SwSlideAlbum(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const n = Math.max(5, Math.min(10, p.trackCount));
  const tracks = (p.tracks || []).slice(0, n);
  const coverLeft = p.coverSide !== 'right';

  const Cover = (
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 14,
        overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.55)' }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit={p.mediaFit} accent={accent} radius={14} tone="dark" placeholder={p.mediaPlaceholder} />
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.16em', textTransform: 'uppercase',
          color: accent }}>{p.coverTag}</div>
        <div style={{ fontWeight: 900, fontSize: 50, letterSpacing: '-1.4px', lineHeight: 1.02, marginTop: 8 }}>{p.albumTitle}</div>
        <div style={{ fontSize: 23, color: 'rgba(245,225,227,.66)', marginTop: 6 }}>{p.albumSub}</div>
      </div>
    </div>
  );

  const List = (
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: '1px solid ' + C.lineD2, paddingBottom: 14, marginBottom: 6 }}>
        <h2 style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-1px' }}>
          {renderSwText(p.listTitle, { hl: { tone: 'o' } })}
        </h2>
        <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'rgba(245,225,227,.6)' }}>{String(n).padStart(2, '0')} {p.tracksLabel}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {tracks.map((t, i) => {
          const on = p.focus && (i + 1) === p.focusIndex;
          return (
            <div key={t.en} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '11px 14px',
              borderRadius: 12, background: on ? accent : 'transparent' }}>
              <span style={{ flexShrink: 0, width: 40, fontFamily: F.mono, fontWeight: 700, fontSize: 24,
                color: on ? '#fff' : accent, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-.3px',
                  color: on ? '#fff' : C.blush }}>{t.cn}</span>
                <span style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.08em', textTransform: 'uppercase',
                  color: on ? 'rgba(255,255,255,.82)' : 'rgba(245,225,227,.5)' }}>{t.en}</span>
                {on && (
                  <span style={{ fontFamily: F.mono, fontSize: 14, letterSpacing: '.1em', padding: '2px 9px',
                    borderRadius: 999, background: 'rgba(255,255,255,.9)', color: accent, fontWeight: 700 }}>{p.focusTag}</span>
                )}
              </span>
              {p.showDuration && (
                <span style={{ fontFamily: F.mono, fontSize: 21, color: on ? 'rgba(255,255,255,.9)' : 'rgba(245,225,227,.62)',
                  fontVariantNumeric: 'tabular-nums' }}>{t.d}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.82fr 1.18fr',
        gap: 64, alignItems: 'stretch', padding: '26px 0 22px' }}>
        {coverLeft ? <>{Cover}{List}</> : <>{List}{Cover}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
