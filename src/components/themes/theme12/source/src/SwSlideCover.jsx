// SwSlideCover.jsx — "杂志封面 / Cover" full-bleed magazine cover page.
//
// A single full-bleed image carries a masthead at the top and cover lines down
// the sides, like an issue cover. Distinct from Magazine (interior spread) and
// FullBleed (caption-only photo). theme, mediaFit, the cover lines, the issue
// barcode and accent are props-controlled, 1:1 with `controls`; all visible
// copy/data defaults live in `defaultProps`. The single
// image is fully controlled. No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { injectBaseStyles, useSwReveal } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'cover', index: 17, label: '杂志封面 / Cover' };

export const defaultProps = {
  accent: C.orange,
  mediaFit: 'cover',
  showCoverLines: true,
  showBarcode: true,
  mastheadFill: true,      // solid accent behind masthead vs outline
  media: [],
  onMediaChange: () => {},
  // —— content ——
  titleCn: '声浪',
  titleEn: 'SOUNDWAVE',
  issueLine: 'ISSUE 04 · 夏 / 2026 · ¥0 永远免费',
  barcodeLabel: 'SW 04 2026',
  mediaPlaceholder: '拖入封面人物大图 / Cover portrait',
  linesL: [
    { big: '独立厂牌', small: '一个人撑起一座厂牌的 12 种方式' },
    { big: '版税透明', small: '每一分钱，看得见来处' },
  ],
  linesR: [
    { big: '现场复兴', small: '小场地里，正在发生的大事' },
  ],
  page: '17',
  total: '82',
};

export const controls = [
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '封面大图填充方式' },
  { key: 'showCoverLines', label: '封面导语', type: 'toggle', def: true, desc: '显示/隐藏两侧封面文案' },
  { key: 'showBarcode', label: '刊号条码', type: 'toggle', def: true, desc: '显示/隐藏角落刊号条码' },
  { key: 'mastheadFill', label: '刊头实底', type: 'toggle', def: true, desc: '刊头使用实色块或描边样式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.magenta, C.cyan, C.lime], desc: '刊头 / 导语高亮 / 条码强调色' },
];

export default function SwSlideCover(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const LINES_L = p.linesL;
  const LINES_R = p.linesR;
  const rootRef = React.useRef(null);
  React.useEffect(() => { injectBaseStyles(); }, []);
  useSwReveal(rootRef);

  return (
    <div ref={rootRef} className="sw-root" style={{ position: 'absolute', inset: 0, overflow: 'hidden',
      fontFamily: F.sans, background: '#0c0809' }}>
      {/* full-bleed image */}
      <div data-sw-no-reveal="" style={{ position: 'absolute', inset: 0 }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit={p.mediaFit} accent={accent} radius={0} tone="dark"
          placeholder={p.mediaPlaceholder} />
      </div>
      {/* legibility gradients */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(12,8,9,.66) 0%, rgba(12,8,9,0) 26%, rgba(12,8,9,0) 64%, rgba(12,8,9,.6) 100%)' }} />

      {/* masthead */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex',
        justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          padding: p.mastheadFill ? '12px 34px 16px' : '10px 32px 14px',
          background: p.mastheadFill ? accent : 'transparent',
          border: p.mastheadFill ? 'none' : '4px solid #fff', borderRadius: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 92, letterSpacing: '8px', lineHeight: 1,
            color: '#fff' }}>{p.titleCn}</span>
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: '.42em',
            color: '#fff', paddingLeft: '.42em' }}>{p.titleEn}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 216, left: 0, right: 0, textAlign: 'center',
        fontFamily: F.mono, fontSize: 22, letterSpacing: '.34em', color: 'rgba(255,255,255,.92)',
        textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>{p.issueLine}</div>

      {/* cover lines */}
      {p.showCoverLines && (
        <>
          <div style={{ position: 'absolute', left: 56, bottom: 64, maxWidth: 560 }}>
            {LINES_L.map((l, i) => (
              <div key={i} style={{ marginTop: i ? 26 : 0 }}>
                <div style={{ display: 'inline-block', fontWeight: 900, fontSize: 46, letterSpacing: '-1px',
                  color: '#fff', background: 'rgba(12,8,9,.5)', padding: '2px 10px',
                  borderLeft: '6px solid ' + accent, textShadow: '0 2px 10px rgba(0,0,0,.5)' }}>{l.big}</div>
                <div style={{ fontSize: 23, color: 'rgba(255,255,255,.92)', marginTop: 8, lineHeight: 1.4,
                  textShadow: '0 2px 10px rgba(0,0,0,.7)' }}>{l.small}</div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', right: 56, top: 240, maxWidth: 440, textAlign: 'right' }}>
            {LINES_R.map((l, i) => (
              <div key={i}>
                <div style={{ display: 'inline-block', fontWeight: 900, fontSize: 44, letterSpacing: '-1px',
                  color: accent, textShadow: '0 2px 12px rgba(0,0,0,.7)' }}>{l.big}</div>
                <div style={{ fontSize: 22, color: 'rgba(255,255,255,.92)', marginTop: 6, lineHeight: 1.4,
                  textShadow: '0 2px 10px rgba(0,0,0,.7)' }}>{l.small}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* barcode */}
      {p.showBarcode && (
        <div style={{ position: 'absolute', right: 56, bottom: 56, background: '#fff', padding: '10px 12px 6px',
          borderRadius: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 42 }} aria-hidden="true">
            {[3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2].map((w, i) => (
              <span key={i} style={{ width: w, height: '100%', background: '#0c0809' }} />
            ))}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: '.18em', color: '#0c0809',
            marginTop: 4, textAlign: 'center' }}>{p.barcodeLabel}</div>
        </div>
      )}
    </div>
  );
}
