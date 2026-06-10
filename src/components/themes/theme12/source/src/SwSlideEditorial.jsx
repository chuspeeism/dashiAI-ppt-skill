// SwSlideEditorial.jsx — image-led "图文交错 / Editorial" spread.
//
// A magazine feature spread of alternating image/text bands (zig-zag): each
// row flips which side the image sits on, so the page reads like a printed
// editorial rather than a balanced grid. Band count (2–3), the starting side,
// per-band numbering and captions are props-controlled and map 1:1 to
// `controls`; all visible copy/data defaults live in `defaultProps`. Image data
// is controlled via `media` / `onMediaChange`; the
// component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'editorial', index: 14, label: '图文交错 / Editorial' };

export const defaultProps = {
  accent: C.orange,
  rowCount: 3,             // 2–3 alternating bands
  imageSide: 'left',       // which side the FIRST band's image sits on
  showNumbers: true,       // big band index
  showCaption: true,       // per-band body copy
  media: [],               // controlled image array
  onMediaChange: () => {},
  // —— content ——
  barMeta: '14 — Editorial',
  kicker: '创作日常 / A Day in the Work',
  title: '一首歌的[[三个现场]]，同一块屏幕。',
  bands: [
    { k: '录音棚 / Studio', t: '一条 demo 的开始', d: '在房间里按下录音键的那一刻，声浪就已经在记账——拆轨、版本、灵感来源，自动归档。' },
    { k: '舞台 / Stage', t: '让现场被听见', d: '从 Livehouse 到音乐节，一个页面同步票务、点歌与打赏，演出结束即生成结算单。' },
    { k: '结算 / Payout', t: '把收入握在手里', d: '全网版税 72 小时透明到账，每一分钱都能追溯到那一首歌、那一场演出。' },
  ],
  page: '14',
  total: '82',
};

export const controls = [
  { key: 'rowCount', label: '段落数', type: 'slider', def: 3, min: 2, max: 3, step: 1,
    desc: '交错的图文段落数量' },
  { key: 'imageSide', label: '首段图片侧', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }],
    desc: '第一段图片在左还是右（逐段交替）' },
  { key: 'showNumbers', label: '段落编号', type: 'toggle', def: true, desc: '显示/隐藏每段的大编号' },
  { key: 'showCaption', label: '段落正文', type: 'toggle', def: true, desc: '显示/隐藏每段说明文字' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 编号 / 页脚强调色' },
];

export default function SwSlideEditorial(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(3, p.rowCount));
  const bands = (p.bands || []).slice(0, count);
  const startLeft = p.imageSide === 'left';

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, margin: '24px 0 18px' }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 48, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 12 }}>
          {renderSwText(p.title, { hl: { tone: 'o' } })}
        </h2>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 18,
        gridTemplateRows: 'repeat(' + count + ',1fr)' }}>
        {bands.map((b, i) => {
          const imgLeft = startLeft ? i % 2 === 0 : i % 2 === 1;
          const Img = (
            <div style={{ minWidth: 0, minHeight: 0 }}>
              <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                fit="cover" accent={accent} radius={swTheme.radius} label={p.showNumbers ? i + 1 : null}
                placeholder={'拖入图片 · ' + b.k.split(' / ')[1]} />
            </div>
          );
          const Txt = (
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: imgLeft ? '0 18px 0 40px' : '0 40px 0 18px', position: 'relative' }}>
              {p.showNumbers && (
                <div aria-hidden="true" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  [imgLeft ? 'right' : 'left']: 0, fontFamily: F.mono, fontWeight: 700, fontSize: 150,
                  lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '2px ' + accent + '26',
                  pointerEvents: 'none', zIndex: 0 }}>{String(i + 1).padStart(2, '0')}</div>
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '.12em',
                  textTransform: 'uppercase', color: accent }}>{b.k}</div>
                <div style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-.6px', marginTop: 10, lineHeight: 1.12 }}>{b.t}</div>
                {p.showCaption && (
                  <p style={{ fontSize: 23, lineHeight: 1.62, color: '#5a4f54', marginTop: 12, maxWidth: 560 }}>{b.d}</p>
                )}
              </div>
            </div>
          );
          return (
            <div key={b.t} style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 0,
              borderTop: i ? '1px solid ' + C.line : 'none', paddingTop: i ? 16 : 0 }}>
              {imgLeft ? <>{Img}{Txt}</> : <>{Txt}{Img}</>}
            </div>
          );
        })}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} divider={false} />
    </SlideRoot>
  );
}
