// SwSlideLyric.jsx — "歌词金句 / Lyric" verse-set quotation page.
//
// A lyric set as a centred verse — stacked short lines with one highlighted
// phrase — over a quiet stage with an optional equalizer-bar motif. Distinct
// from Quote (single statement band), QuoteImage (over a photo) and QuoteWall
// (many cards). theme, the equalizer, alignment and accent are props-controlled,
// 1:1 with `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, Shape } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'lyric', index: 74, label: '歌词金句 / Lyric' };

export const defaultProps = {
  accent: C.hlP,
  theme: 'light',          // 'light' | 'dark'
  align: 'center',         // 'left' | 'center'
  showEqualizer: true,
  showDecorations: true,
  // —— content（`hl` 标记渲染为高亮胶囊的诗句）——
  barMeta: '74 — Lyric',
  eyebrow: '♪ 午夜电台 ·《潮汐》',
  lines: [
    { t: '我把整座城市的夜', hl: false },
    { t: '调成你的频率', hl: true },
    { t: '在没人听见的地方', hl: false },
    { t: '我们也曾大声', hl: true },
  ],
  credit: '— 词 / 曲 林夏 · 声浪原创',
  bars: [0.4, 0.7, 0.5, 0.95, 0.6, 0.85, 0.45, 0.72, 0.55, 0.9, 0.5, 0.78, 0.42, 0.66, 0.58, 0.88, 0.46, 0.7, 0.52, 0.8],
  page: '74',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'align', label: '对齐', type: 'segment', def: 'center',
    options: [{ value: 'left', label: '居左' }, { value: 'center', label: '居中' }], desc: '诗句的对齐方式' },
  { key: 'showEqualizer', label: '声波条', type: 'toggle', def: true, desc: '显示/隐藏底部声波条装饰' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
  { key: 'accent', label: '强调色', type: 'color', def: C.hlP,
    options: [C.hlP, C.hlO, C.hlC, C.hlG], desc: '高亮句 / 页脚强调色' },
];

export default function SwSlideLyric(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const center = p.align === 'center';
  const LINES = p.lines;
  const BARS = p.bars;

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? 'rgba(245,225,227,.62)' : C.inkMut;
  const hlTone = accent === C.hlO ? 'o' : accent === C.hlC ? 'c' : accent === C.hlG ? 'g' : 'p';

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showDecorations && (
        <>
          <Shape kind="ring" size={120} border={18} color={accent} style={{ top: 120, left: 110, opacity: 0.5 }} />
          <Shape kind="circle" size={54} color={accent} style={{ bottom: 200, right: 150, opacity: 0.6 }} />
        </>
      )}

      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left', position: 'relative', zIndex: 3,
        paddingLeft: center ? 0 : 40 }}>
        <div aria-hidden="true" style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700,
          letterSpacing: '.24em', textTransform: 'uppercase', color: accent, marginBottom: 26 }}>
          {p.eyebrow}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {LINES.map((l, i) => (
            <div key={i} style={{ fontWeight: 900, fontSize: 72, lineHeight: 1.22, letterSpacing: '-1.5px' }}>
              {l.hl ? <Hl tone={hlTone} block>{l.t}</Hl> : <span>{l.t}</span>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 25, color: mut, marginTop: 34, fontFamily: F.mono, letterSpacing: '.06em' }}>
          {p.credit}
        </div>
      </div>

      {p.showEqualizer && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: center ? 'center' : 'flex-start',
          gap: 7, height: 60, marginBottom: 14, paddingLeft: center ? 0 : 40, position: 'relative', zIndex: 3 }}
          aria-hidden="true">
          {BARS.map((h, i) => (
            <span key={i} style={{ width: 8, height: Math.max(8, h * 60), borderRadius: 4,
              background: accent, opacity: 0.35 + h * 0.5 }} />
          ))}
        </div>
      )}

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
