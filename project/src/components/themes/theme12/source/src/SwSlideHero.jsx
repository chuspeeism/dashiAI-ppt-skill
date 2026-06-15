// SwSlideHero.jsx — "整版大图 / On Stage" full-bleed image page.
//
// Image-DOMINANT and edge-to-edge: a single image fills the entire 16:9 frame
// (no padded gallery grid like Showcase). A gradient scrim carries an overlay
// panel — kicker, headline, lede and an optional row of stat chips. Chrome
// (brand + page number) floats over the image. All visible copy/data defaults
// live in `defaultProps`. Image data is controlled via
// `media` / `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Hl, renderSwText } from './swBase.jsx';
import { SwBackgroundLayer, SW_UNICORN_BACKGROUND_CONTROL, createSwUnicornSceneControl } from './SwUnicornBackground.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'hero', index: 16, label: '整版大图 / On Stage' };

export const defaultProps = {
  accent: C.orange,
  backgroundMode: 'unicorn',
  unicornScene: 'automations',
  mediaFit: 'cover',
  overlayPosition: 'bottom-left', // 'bottom-left' | 'bottom-right' | 'left'
  scrim: 'dark',                  // 'dark' | 'light'
  showStats: true,
  statCount: 3,                   // 0–3 chips
  media: [],
  onMediaChange: () => {},
  // —— content ——
  brand: '声浪 SOUNDWAVE',
  metaLine: '06 — On Stage',
  kicker: '现场 / On Stage',
  title: '声音从这里，\n传向[[世界]]。',
  lede: '把舞台、录音棚与结算页连成一条线——你只负责创作，剩下的交给声浪。',
  mediaPlaceholder: '拖入整版大图 / Drop a full-bleed image',
  chips: [
    { v: '30+', lb: '分发平台' },
    { v: '72h', lb: '版税到账' },
    { v: '0%', lb: '首季分成' },
  ],
  page: '16',
  total: '82',
};

export const controls = [
  SW_UNICORN_BACKGROUND_CONTROL,
  createSwUnicornSceneControl(defaultProps.unicornScene),
  { key: 'overlayPosition', label: '文案位置', type: 'segment', def: 'bottom-left',
    options: [{ value: 'bottom-left', label: '左下' }, { value: 'bottom-right', label: '右下' }, { value: 'left', label: '左侧' }],
    desc: '叠加文案面板的位置' },
  { key: 'scrim', label: '蒙版', type: 'segment', def: 'dark',
    options: [{ value: 'dark', label: '暗' }, { value: 'light', label: '亮' }], desc: '叠加渐变蒙版的明暗' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '整版大图的填充方式' },
  { key: 'showStats', label: '数据标签', type: 'toggle', def: true, desc: '显示/隐藏底部数据标签' },
  { key: 'statCount', label: '标签数量', type: 'slider', def: 3, min: 0, max: 3, step: 1,
    dependsOn: 'showStats', desc: '数据标签的数量' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '高亮 / 标签 / 页码强调色' },
];

export default function SwSlideHero(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.scrim !== 'light';
  const fg = dark ? '#fff' : C.ink;
  const mut = dark ? 'rgba(255,255,255,.7)' : C.inkMut;
  const sc = Math.max(0, Math.min(3, p.statCount));
  const chips = (p.chips || []).slice(0, sc);

  const pos = p.overlayPosition;
  const wrapAlign = pos === 'bottom-right' ? 'flex-end' : 'flex-start';
  const wrapJustify = pos === 'left' ? 'center' : 'flex-end';

  const scrimGrad = dark
    ? (pos === 'bottom-right'
        ? 'linear-gradient(290deg, rgba(20,15,16,.86) 0%, rgba(20,15,16,.35) 42%, rgba(20,15,16,0) 70%)'
        : 'linear-gradient(70deg, rgba(20,15,16,.86) 0%, rgba(20,15,16,.35) 42%, rgba(20,15,16,0) 70%)')
    : (pos === 'bottom-right'
        ? 'linear-gradient(290deg, rgba(245,225,227,.92) 0%, rgba(245,225,227,.4) 42%, rgba(245,225,227,0) 70%)'
        : 'linear-gradient(70deg, rgba(245,225,227,.92) 0%, rgba(245,225,227,.4) 42%, rgba(245,225,227,0) 70%)');

  return (
    <SlideRoot bg={C.dark} color={fg} style={{ padding: 0 }}>
      {/* full-bleed image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <SwBackgroundLayer mode={p.backgroundMode} media={p.media} onMediaChange={p.onMediaChange}
          scene={p.unicornScene} fit={p.mediaFit} accent={accent} placeholder={p.mediaPlaceholder} />
      </div>
      {/* scrim */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: scrimGrad, pointerEvents: 'none' }} />

      {/* floating chrome */}
      <div style={{ position: 'absolute', top: 54, left: 96, right: 96, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <span style={{ width: 16, height: 16, background: accent, borderRadius: 4 }} />
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.2em', color: fg }}>{p.brand}</span>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase', color: mut }}>{p.metaLine}</div>
      </div>

      {/* overlay panel */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex',
        flexDirection: 'column', justifyContent: wrapJustify, alignItems: wrapAlign,
        padding: '96px 96px 84px', pointerEvents: 'none' }}>
        <div style={{ maxWidth: 1180, textAlign: pos === 'bottom-right' ? 'right' : 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.mono,
            fontSize: 24, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: accent }}>
            <span style={{ width: 40, height: 3, background: accent, borderRadius: 2 }} />
            <span>{p.kicker}</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 108, lineHeight: 1.06, letterSpacing: '-2px', marginTop: 22, color: fg }}>
            {renderSwText(p.title, { hl: { tone: 'o', style: { background: accent, color: '#fff' } } })}
          </h1>
          <p style={{ fontSize: 28, lineHeight: 1.6, color: mut, marginTop: 24, maxWidth: 720,
            marginLeft: pos === 'bottom-right' ? 'auto' : 0 }}>
            {p.lede}
          </p>

          {p.showStats && sc > 0 && (
            <div style={{ display: 'flex', gap: 18, marginTop: 38,
              justifyContent: pos === 'bottom-right' ? 'flex-end' : 'flex-start' }}>
              {chips.map((c) => (
                <div key={c.lb} style={{ display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '16px 26px', borderRadius: 16,
                  background: dark ? 'rgba(255,255,255,.1)' : 'rgba(27,21,24,.06)',
                  border: '1px solid ' + (dark ? 'rgba(255,255,255,.18)' : 'rgba(27,21,24,.12)'),
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                  <span style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-1px', color: fg }}>{c.v}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em',
                    textTransform: 'uppercase', color: mut }}>{c.lb}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* page number */}
      <div style={{ position: 'absolute', bottom: 48, right: 96, zIndex: 3, fontFamily: F.mono,
        fontSize: 24, letterSpacing: '.12em', color: mut, pointerEvents: 'none' }}>
        <b style={{ color: accent }}>{p.page}</b> / {p.total}
      </div>
    </SlideRoot>
  );
}
