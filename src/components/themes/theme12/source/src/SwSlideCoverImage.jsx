// SwSlideCoverImage.jsx — "封面 · 大图 / Cover Story" — full-bleed image cover.
//
// Front-matter cover #3, image-DOMINANT: one edge-to-edge photo dressed as an
// issue front — a top brand strip, a rotated spine label down the left edge,
// cover-line teasers, a bottom-left 声浪 masthead, a cover credit and an issue
// barcode, over a layered scrim + vignette. Independent + props-only: mediaFit,
// scrim, spine, cover lines, barcode and accent map 1:1 with `controls`; all
// visible copy/data defaults live in `defaultProps`. The
// single image is controlled via `media`/`onMediaChange`; no persistence, no
// global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { injectBaseStyles, useSwReveal } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'coverImage', index: 3, label: '封面 · 大图 / Cover Story' };

export const defaultProps = {
  accent: C.orange,
  mediaFit: 'cover',
  scrim: 'dark',          // 'dark' | 'light'
  showSpine: true,
  showCoverLines: true,
  lineCount: 2,           // 1–3 cover-line teasers
  showBarcode: true,
  showCredit: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  brand: '声浪 SOUNDWAVE',
  issueLabel: 'Issue 01 · Summer 2026',
  spineText: 'Independent Music OS · Vol. 01',
  kicker: 'The Cover Story',
  title: '声浪',
  titleEn: 'SOUNDWAVE',
  lines: [
    { big: '声音的主权', sub: '归于做音乐的人' },
    { big: '版税透明', sub: '每一分钱看得见来处' },
    { big: '现场复兴', sub: '小场地里的大事' },
  ],
  creditLabel: '封面人物 / Cover:',
  creditName: '＿＿＿＿',
  barcodeLabel: 'SW 01 · 2026',
  mediaPlaceholder: '拖入封面大图 / Cover image',
  page: '03',
  total: '86',
};

export const controls = [
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '封面大图的填充方式' },
  { key: 'scrim', label: '蒙版', type: 'segment', def: 'dark',
    options: [{ value: 'dark', label: '暗' }, { value: 'light', label: '亮' }], desc: '叠加渐变蒙版的明暗' },
  { key: 'showSpine', label: '书脊标', type: 'toggle', def: true, desc: '显示/隐藏左缘竖排书脊文字' },
  { key: 'showCoverLines', label: '封面导语', type: 'toggle', def: true, desc: '显示/隐藏右侧封面导语' },
  { key: 'lineCount', label: '导语条数', type: 'slider', def: 2, min: 1, max: 3, step: 1,
    dependsOn: 'showCoverLines', desc: '封面导语条目数量' },
  { key: 'showBarcode', label: '刊号条码', type: 'toggle', def: true, desc: '显示/隐藏右下角刊号条码' },
  { key: 'showCredit', label: '封面署名', type: 'toggle', def: true, desc: '显示/隐藏封面人物署名' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.magenta, C.cyan, C.lime], desc: '规线 / 导语高亮 / 条码强调色' },
];

export default function SwSlideCoverImage(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.scrim !== 'light';
  const fg = dark ? '#fff' : C.ink;
  const mut = dark ? 'rgba(255,255,255,.84)' : 'rgba(27,21,24,.7)';
  const sh = dark ? '0 2px 12px rgba(0,0,0,.55)' : 'none';
  const lines = (p.lines || []).slice(0, Math.max(1, Math.min(p.lines.length, p.lineCount)));
  const rootRef = React.useRef(null);
  React.useEffect(() => { injectBaseStyles(); }, []);
  useSwReveal(rootRef);

  const scrim = dark
    ? 'linear-gradient(180deg, rgba(12,8,9,.7) 0%, rgba(12,8,9,.1) 22%, rgba(12,8,9,0) 44%, rgba(12,8,9,.55) 74%, rgba(12,8,9,.92) 100%)'
    : 'linear-gradient(180deg, rgba(245,225,227,.8) 0%, rgba(245,225,227,.1) 22%, rgba(245,225,227,0) 46%, rgba(245,225,227,.66) 76%, rgba(245,225,227,.95) 100%)';

  return (
    <div ref={rootRef} className="sw-root" style={{ position: 'absolute', inset: 0, overflow: 'hidden',
      fontFamily: F.sans, background: C.dark }}>
      {/* full-bleed image */}
      <div data-sw-no-reveal="" style={{ position: 'absolute', inset: 0 }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit={p.mediaFit} accent={accent} radius={0} tone="dark"
          placeholder={p.mediaPlaceholder} />
      </div>
      {/* scrim + vignette */}
      <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: scrim }} />
      <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: dark ? 'inset 0 0 280px rgba(12,8,9,.6)' : 'inset 0 0 240px rgba(245,225,227,.5)' }} />

      {/* top brand strip */}
      <div style={{ position: 'absolute', top: 54, left: 96, right: 96, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <span style={{ width: 16, height: 16, background: accent, borderRadius: 4 }} />
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.2em', color: fg, textShadow: sh }}>{p.brand}</span>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.16em', textTransform: 'uppercase', color: mut, textShadow: sh }}>{p.issueLabel}</div>
      </div>

      {/* left spine */}
      {p.showSpine && (
        <div data-sw-no-reveal="" style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl', fontFamily: F.mono, fontSize: 20, letterSpacing: '.34em', textTransform: 'uppercase',
          color: mut, textShadow: sh, pointerEvents: 'none' }}>{p.spineText}</div>
      )}

      {/* cover lines */}
      {p.showCoverLines && (
        <div style={{ position: 'absolute', right: 96, top: 220, maxWidth: 460, textAlign: 'right' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ marginTop: i ? 28 : 0 }}>
              <div style={{ display: 'inline-block', fontWeight: 900, fontSize: 44, letterSpacing: '-1px',
                color: i === 0 ? accent : fg, textShadow: sh }}>{l.big}</div>
              <div style={{ fontSize: 23, color: mut, marginTop: 6, lineHeight: 1.4, textShadow: sh }}>{l.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* masthead */}
      <div style={{ position: 'absolute', left: 96, bottom: 104, pointerEvents: 'none' }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, fontWeight: 700, letterSpacing: '.26em',
          textTransform: 'uppercase', color: accent, marginBottom: 10, textShadow: sh }}>{p.kicker}</div>
        <div style={{ fontWeight: 900, fontSize: 184, lineHeight: 0.84, letterSpacing: '-3px', color: fg,
          textShadow: dark ? '0 8px 44px rgba(0,0,0,.55)' : 'none' }}>{p.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
          <span style={{ width: 84, height: 5, background: accent, borderRadius: 3 }} />
          <span style={{ fontFamily: F.mono, fontSize: 30, letterSpacing: '.2em', color: fg, textShadow: sh }}>{p.titleEn}</span>
        </div>
        {p.showCredit && (
          <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.12em', color: mut, marginTop: 18, textShadow: sh }}>
            {p.creditLabel} <span style={{ color: fg }}>{p.creditName}</span>
          </div>
        )}
      </div>

      {/* barcode */}
      {p.showBarcode && (
        <div style={{ position: 'absolute', right: 96, bottom: 56, background: '#fff', padding: '9px 11px 5px', borderRadius: 4,
          boxShadow: '0 6px 22px rgba(0,0,0,.4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 38 }} aria-hidden="true">
            {[3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2].map((w, i) => (
              <span key={i} style={{ width: w, height: '100%', background: '#0c0809' }} />
            ))}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: '.16em', color: '#0c0809', marginTop: 4, textAlign: 'center' }}>{p.barcodeLabel}</div>
        </div>
      )}
    </div>
  );
}
