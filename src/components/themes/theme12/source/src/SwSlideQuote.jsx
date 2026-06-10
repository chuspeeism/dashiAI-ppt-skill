// SwSlideQuote.jsx — Pull-quote / "金句" page.
//
// Independent, props-only. All visible copy/data defaults live in `defaultProps`;
// everything that changes layout/skin is a prop that maps 1:1 to the exported `controls`.
// No global :root writes, no window registration, no runtime dependency on the
// preview host. Drop it in any 16:9 container.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'quote', index: 2, label: '金句 / Quote' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  align: 'left',           // 'left' | 'center'
  showMark: true,          // big quotation-mark glyph
  showAttribution: true,   // attribution line
  showDecorations: true,
  // —— content（[[x]] = 高亮，\n = 换行）——
  barMeta: '02 — In Their Words',
  kicker: '金句 / In Their Words',
  quote: '把发行权[[还给创作者]]，不是行业的让步——\n而是它[[本该有]]的默认。',
  authorName: '李声 · 声浪创始人',
  authorEn: 'Li Sheng — Founder, SoundWave',
  page: '02',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }],
    desc: '页面整体明暗配色' },
  { key: 'align', label: '对齐', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    desc: '引文与署名的排版对齐' },
  { key: 'showMark', label: '引号装饰', type: 'toggle', def: true, desc: '显示/隐藏大引号符号' },
  { key: 'showAttribution', label: '署名', type: 'toggle', def: true, desc: '显示/隐藏引文署名' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '引号 / 高亮 / 页脚强调色' },
];

export default function SwSlideQuote(props) {
  const p = { ...defaultProps, ...props };
  const dark = p.theme === 'dark';
  const accent = p.accent;
  const center = p.align === 'center';

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showDecorations && (
        <>
          <Shape kind="ring" size={104} border={17} color={accent}
            style={{ bottom: 132, right: 150, opacity: dark ? 0.85 : 1 }} />
          <Shape kind="pentagon" size={86} color={dark ? C.lime : C.magenta}
            style={{ bottom: 96, right: 296 }} />
        </>
      )}

      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left', position: 'relative', zIndex: 3,
        maxWidth: center ? 1480 : 1500, marginInline: center ? 'auto' : 0 }}>

        {p.showMark && (
          <div aria-hidden="true" style={{ fontFamily: 'Georgia, serif', fontWeight: 700,
            fontSize: 200, lineHeight: 0.7, color: accent, marginBottom: 8,
            height: 96, overflow: 'hidden' }}>“</div>
        )}

        <Kicker accent={accent}>{p.kicker}</Kicker>

        <blockquote style={{ fontWeight: 900, fontSize: 86, lineHeight: 1.22, letterSpacing: '-1.5px',
          margin: '26px 0 0', maxWidth: 1480 }}>
          {renderSwText(p.quote, { hl: { tone: dark ? 'g' : 'o' } })}
        </blockquote>

        {p.showAttribution && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 48,
            justifyContent: center ? 'center' : 'flex-start' }}>
            <span style={{ width: 54, height: 4, background: accent, borderRadius: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: '-.3px' }}>{p.authorName}</div>
              <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.12em',
                textTransform: 'uppercase', color: mut, marginTop: 4 }}>{p.authorEn}</div>
            </div>
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
