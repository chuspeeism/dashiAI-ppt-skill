// SwSlideSpotlight.jsx — "功能聚焦 / Feature" annotated image page.
//
// A single large product/feature image on one side, overlaid with numbered
// annotation pins, paired with a matching numbered caption list on the other.
// Image side, callout count (2–4), pins toggle and accent are props-controlled
// and map 1:1 to `controls`; all visible copy/data defaults live in
// `defaultProps`. Image data is controlled via `media` /
// `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'spotlight', index: 71, label: '功能聚焦 / Feature' };

export const defaultProps = {
  accent: C.orange,
  imageSide: 'right',      // 'left' | 'right'
  calloutCount: 4,         // 2–4
  showPins: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '71 — Feature',
  ghost: '50',
  kicker: '功能聚焦 / Feature',
  title: '一块屏幕，\n管完整条[[链路]]。',
  mediaPlaceholder: '拖入产品 / 功能截图',
  callouts: [
    { cn: '实时结算', en: 'Live Ledger', d: '每一笔版税按平台、地区即时拆解。', pin: { top: '18%', left: '22%' } },
    { cn: '一键分发', en: 'Distribute', d: '同步上架全球 30+ 流媒体平台。', pin: { top: '40%', left: '70%' } },
    { cn: '粉丝直连', en: 'Direct', d: '专属页面把听众沉淀为资产。', pin: { top: '66%', left: '34%' } },
    { cn: '版权护盾', en: 'Shield', d: '全网监测盗用，一键发起维权。', pin: { top: '80%', left: '78%' } },
  ],
  page: '71',
  total: '82',
};

export const controls = [
  { key: 'imageSide', label: '图片位置', type: 'segment', def: 'right',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }], desc: '大图所在的一侧' },
  { key: 'calloutCount', label: '标注数量', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '标注点与说明条目的数量' },
  { key: 'showPins', label: '图上标注点', type: 'toggle', def: true, desc: '显示/隐藏图片上的编号标注点' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片的填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '标注点 / 编号 / 页脚强调色' },
];

export default function SwSlideSpotlight(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.calloutCount));
  const items = (p.callouts || []).slice(0, count);
  const imgRight = p.imageSide !== 'left';

  const Pin = ({ n, pos }) => (
    <div style={{ position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%,-50%)',
      width: 52, height: 52, borderRadius: '50%', background: accent, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono,
      fontWeight: 700, fontSize: 26, boxShadow: '0 0 0 8px ' + accent + '33, 0 6px 18px rgba(0,0,0,.35)',
      zIndex: 2 }}>{n}</div>
  );

  const ImageCol = (
    <div style={{ position: 'relative', minWidth: 0, minHeight: 0, height: '100%',
      borderRadius: swTheme.radius, background: accent, padding: 16, overflow: 'hidden' }}>
      <Shape kind="pentagon" size={58} color="rgba(255,255,255,.9)" style={{ top: 22, right: 22, zIndex: 3 }} />
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
          fit={p.mediaFit} accent={accent} radius={18} tone="dark"
          placeholder={p.mediaPlaceholder} />
        {p.showPins && items.map((it, i) => <Pin key={i} n={i + 1} pos={it.pin} />)}
      </div>
    </div>
  );

  const TextCol = (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: -30, left: -6, fontFamily: F.mono, fontWeight: 700,
        fontSize: 200, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '2px rgba(27,21,24,.06)', pointerEvents: 'none', zIndex: 0 }}>{p.ghost}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.1, letterSpacing: '-1.2px', marginTop: 18 }}>
          {renderSwText(p.title, { hl: { tone: 'o' } })}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 32, position: 'relative', zIndex: 1 }}>
        {items.map((it, i) => {
          const pal = swCardPalette[i % swCardPalette.length];
          return (
            <div key={it.en} style={{ display: 'flex', alignItems: 'flex-start', gap: 20,
              padding: '17px 0', borderTop: '1px solid ' + C.line }}>
              <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 13, marginTop: 2,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: pal.bg, color: pal.title, fontFamily: F.mono, fontWeight: 700, fontSize: 24 }}>{i + 1}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-.3px' }}>{it.cn}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.1em',
                    textTransform: 'uppercase', color: C.inkMut }}>{it.en}</span>
                </div>
                <p style={{ fontSize: 24, lineHeight: 1.5, color: '#5a4f54', marginTop: 5 }}>{it.d}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 64, alignItems: 'stretch', padding: '26px 0 22px', position: 'relative', zIndex: 3 }}>
        {imgRight ? <>{TextCol}{ImageCol}</> : <>{ImageCol}{TextCol}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
