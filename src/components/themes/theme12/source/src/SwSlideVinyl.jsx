// SwSlideVinyl.jsx — "黑胶 / Now Playing" record-player feature page.
//
// The album artwork sits on a vinyl record (circular image slot with concentric
// grooves and a centre label) on one side; the other side is a "now playing"
// panel — track title, artist, a scrubber timecode and a short tracklist.
// Distinct from Album (flat tracklist grid) and Magazine (rectangular feature).
// theme, record side, grooves, the tracklist and accent are props-controlled,
// 1:1 with `controls`; all visible copy/data defaults live in `defaultProps`.
// The single image is fully controlled. No host deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'vinyl', index: 65, label: '黑胶 / Now Playing' };

export const defaultProps = {
  accent: C.magenta,
  theme: 'dark',           // 'light' | 'dark'
  recordSide: 'left',      // 'left' | 'right'
  mediaFit: 'cover',
  showGrooves: true,
  showTracklist: true,
  trackCount: 4,           // 3–6 tracklist rows
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '65 — Now Playing',
  kicker: '正在播放 / Now Playing',
  trackTitle: '潮汐',
  trackMeta: '午夜电台 Midnight Radio · 2026',
  elapsed: '1:24',
  duration: '3:42',
  progress: 38,
  nowLabel: 'NOW',
  mediaPlaceholder: '拖入封面',
  tracks: [
    { n: '01', t: '潮汐 Tides', d: '3:42' },
    { n: '02', t: '霓虹废墟 Neon Ruins', d: '4:11' },
    { n: '03', t: '回声花园 Echo Garden', d: '3:05' },
    { n: '04', t: '盐与光 Salt & Light', d: '5:20' },
    { n: '05', t: '夜行列车 Night Train', d: '4:48' },
    { n: '06', t: '低气压 Low Pressure', d: '3:29' },
  ],
  page: '65',
  total: '82',
};

export const controls = [
  { key: 'recordSide', label: '唱片位置', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '居左' }, { value: 'right', label: '居右' }], desc: '黑胶唱片所在的一侧' },
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showGrooves', label: '唱纹', type: 'toggle', def: true, desc: '显示/隐藏唱片同心纹路' },
  { key: 'showTracklist', label: '曲目表', type: 'toggle', def: true, desc: '显示/隐藏右侧曲目列表' },
  { key: 'trackCount', label: '曲目数量', type: 'slider', def: 4, min: 3, max: 6, step: 1,
    dependsOn: 'showTracklist', desc: '曲目列表的行数' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '封面图填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.magenta,
    options: [C.magenta, C.orange, C.cyan, C.green], desc: '播放进度 / 高亮 / 页脚强调色' },
];

export default function SwSlideVinyl(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const left = p.recordSide === 'left';
  const tc = Math.max(3, Math.min(6, p.trackCount));

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;
  const rowLine = dark ? C.lineD : C.line;

  const grooves = p.showGrooves
    ? 'repeating-radial-gradient(circle, rgba(0,0,0,0) 0 2px, rgba(0,0,0,.34) 2px 3px)'
    : 'none';

  const Record = (
    <div style={{ position: 'relative', minWidth: 0, height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 'min(560px, 100%)', aspectRatio: '1 / 1' }}>
        {/* the black disc */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#0b0809',
          boxShadow: dark ? '0 40px 90px rgba(0,0,0,.6)' : '0 30px 70px rgba(27,21,24,.28)' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: grooves, opacity: 0.6 }} />
        </div>
        {/* artwork label in the middle */}
        <div style={{ position: 'absolute', inset: '24%', borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 8px #0b0809, 0 10px 30px rgba(0,0,0,.5)' }}>
          <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
            fit={p.mediaFit} accent={accent} radius={400} tone="dark" placeholder={p.mediaPlaceholder} />
          {/* centre spindle hole */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 26, height: 26,
            transform: 'translate(-50%,-50%)', borderRadius: '50%', background: bg,
            boxShadow: '0 0 0 4px rgba(0,0,0,.4) inset', zIndex: 3 }} />
        </div>
        {/* glossy sheen */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'linear-gradient(125deg, rgba(255,255,255,.14), rgba(255,255,255,0) 38%)',
          pointerEvents: 'none' }} />
      </div>
    </div>
  );

  const Panel = (
    <div style={{ position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column',
      justifyContent: 'center' }}>
      <Kicker accent={accent}>{p.kicker}</Kicker>
      <h2 style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.02, letterSpacing: '-1.8px', marginTop: 16 }}>
        {p.trackTitle}
      </h2>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.12em', textTransform: 'uppercase',
        color: mut, marginTop: 8 }}>{p.trackMeta}</div>

      {/* scrubber */}
      <div style={{ marginTop: 30 }}>
        <div style={{ position: 'relative', height: 6, borderRadius: 999,
          background: dark ? 'rgba(245,225,227,.16)' : 'rgba(27,21,24,.12)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: p.progress + '%', borderRadius: 999, background: accent }} />
          <div style={{ position: 'absolute', left: p.progress + '%', top: '50%', width: 18, height: 18,
            transform: 'translate(-50%,-50%)', borderRadius: '50%', background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,.4)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 21,
          color: mut, marginTop: 10 }}><span>{p.elapsed}</span><span>{p.duration}</span></div>
      </div>

      {p.showTracklist && (
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column' }}>
          {p.tracks.slice(0, tc).map((t, i) => (
            <div key={t.n} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '13px 0',
              borderTop: '1px solid ' + rowLine }}>
              <span style={{ fontFamily: F.mono, fontSize: 21, color: i === 0 ? accent : mut, width: 28 }}>{t.n}</span>
              <span style={{ flex: 1, fontWeight: i === 0 ? 700 : 500, fontSize: 25, letterSpacing: '-.2px',
                color: i === 0 ? fg : (dark ? '#c8c0bd' : '#5a4f54') }}>{t.t}</span>
              {i === 0 && <Hl tone={accent === C.cyan ? 'c' : 'p'} style={{ fontFamily: F.mono, fontSize: 16,
                letterSpacing: '.14em', padding: '2px 9px' }}>{p.nowLabel}</Hl>}
              <span style={{ fontFamily: F.mono, fontSize: 21, color: mut }}>{t.d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 64, padding: '24px 0 22px',
        gridTemplateColumns: '1fr 1fr', alignItems: 'stretch', position: 'relative', zIndex: 3 }}>
        {left ? <>{Record}{Panel}</> : <>{Panel}{Record}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
