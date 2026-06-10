// SwSlidePanorama.jsx — image-led "全景宽幅 / Panorama" page.
//
// A single cinematic gate-fold image (or a 2-up split panorama) framed with
// generous editorial margins, a vertical title rail, and a meta strip of facts
// underneath — distinct from the edge-to-edge Hero. Slot count (1–2), fit,
// the meta facts row and the bottom caption are props-controlled and map 1:1 to
// `controls`; all visible copy/data defaults live in `defaultProps`.
// Image data is controlled via `media` / `onMediaChange`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'panorama', index: 20, label: '全景宽幅 / Panorama' };

export const defaultProps = {
  accent: C.cyan,
  mediaCount: 1,           // 1 = single gate-fold, 2 = split panorama
  mediaFit: 'cover',
  showMeta: true,          // facts strip under the image
  metaCount: 3,            // 2–3 facts
  showCaption: true,       // caption line
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '20 — Panorama',
  kicker: '巡演现场 / On Tour',
  title: '一整片\n[[声浪]]，\n铺满全场。',
  caption: '把横跨数城的现场，收进同一条时间线。',
  mediaPlaceholder: '拖入全景照片 / Panorama',
  facts: [
    { v: '32', u: '城市巡演 Cities' },
    { v: '180+', u: '现场场次 Shows' },
    { v: '¥0', u: '场地抽成 Venue cut' },
  ],
  page: '20',
  total: '82',
};

export const controls = [
  { key: 'mediaCount', label: '图片数量', type: 'slider', def: 1, min: 1, max: 2, step: 1,
    desc: '1=单张全景，2=左右拼接全景' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'showMeta', label: '信息条', type: 'toggle', def: true, desc: '显示/隐藏图片下方的事实条' },
  { key: 'metaCount', label: '事实条数', type: 'slider', def: 3, min: 2, max: 3, step: 1,
    dependsOn: 'showMeta', desc: '事实条目数量' },
  { key: 'showCaption', label: '图注', type: 'toggle', def: true, desc: '显示/隐藏图片下方图注' },
  { key: 'accent', label: '强调色', type: 'color', def: C.cyan,
    options: [C.cyan, C.orange, C.purple, C.green], desc: '标题侧栏 / 事实 / 页脚强调色' },
];

export default function SwSlidePanorama(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(1, Math.min(2, p.mediaCount));
  const facts = (p.facts || []).slice(0, Math.max(2, Math.min(3, p.metaCount)));

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '512px 1fr',
        gap: 40, padding: '26px 0 20px' }}>

        {/* vertical title rail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.05, letterSpacing: '-1.4px',
            marginTop: 16, color: C.blush }}>
            {renderSwText(p.title, { hl: { tone: 'c' } })}
          </h2>
          {p.showCaption && (
            <p style={{ fontSize: 22, lineHeight: 1.62, color: '#b7adaa', marginTop: 20 }}>
              {p.caption}
            </p>
          )}
        </div>

        {/* panorama frame + facts */}
        <div style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 10,
            gridTemplateColumns: count === 2 ? '1fr 1fr' : '1fr' }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} style={{ minWidth: 0, minHeight: 0 }}>
                <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                  fit={p.mediaFit} accent={accent} radius={swTheme.radius} tone="dark"
                  label={count === 2 ? i + 1 : null} placeholder={p.mediaPlaceholder} />
              </div>
            ))}
          </div>

          {p.showMeta && (
            <div style={{ flexShrink: 0, marginTop: 16, display: 'grid',
              gridTemplateColumns: 'repeat(' + facts.length + ',1fr)', borderTop: '1px solid ' + C.lineD2 }}>
              {facts.map((f, i) => (
                <div key={f.u} style={{ padding: '16px 24px 2px',
                  borderLeft: i ? '1px solid ' + C.lineD : 'none' }}>
                  <div style={{ fontWeight: 900, fontSize: 46, letterSpacing: '-1px', color: i === 0 ? accent : C.blush }}>{f.v}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: '#9a8f8c', marginTop: 4 }}>{f.u}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
