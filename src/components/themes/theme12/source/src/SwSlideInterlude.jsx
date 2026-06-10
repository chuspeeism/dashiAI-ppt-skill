// SwSlideInterlude.jsx — "间章 / Interlude" act-break page.
//
// A minimal divider that opens an act with a single punchy line and a giant
// act numeral — distinct from Section (which carries an agenda list) and from
// the attributed Quote. Theme (dark / colour), the big numeral, an optional
// "what's ahead" tag and decorations are props-controlled and map 1:1 to
// `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'interlude', index: 38, label: '间章 / Interlude' };

export const defaultProps = {
  accent: C.orange,
  theme: 'dark',           // 'dark' | 'color'
  numeral: 'arabic',       // 'roman' | 'arabic'
  showIndex: true,         // giant act numeral
  showTag: true,           // "next up" tag
  showDecorations: true,
  // —— content ——
  barMeta: '38 — Interlude',
  act: 2,
  kicker: '第二幕 / Act',
  title: '光有热爱不够，\n还得[[算得清]]。',
  tag: '接下来 · 用数据说话 / By the numbers',
  page: '38',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'dark', label: '深色' }, { value: 'color', label: '彩色' }],
    desc: '间章底色：深色 / 强调色铺底' },
  { key: 'numeral', label: '编号样式', type: 'segment', def: 'arabic',
    options: [{ value: 'arabic', label: '02' }, { value: 'roman', label: 'Ⅱ' }],
    desc: '大编号的呈现方式' },
  { key: 'showIndex', label: '巨大编号', type: 'toggle', def: true, desc: '显示/隐藏背景巨大编号' },
  { key: 'showTag', label: '下一幕标签', type: 'toggle', def: true, desc: '显示/隐藏“接下来”标签' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '高亮 / 编号 / 铺底强调色' },
];

const ROMAN = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ' };

export default function SwSlideInterlude(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const ACT = p.act;
  const onColor = p.theme === 'color';
  const bg = onColor ? accent : C.dark;
  const fg = onColor ? '#fff' : C.blush;
  const mut = onColor ? 'rgba(255,255,255,.78)' : '#9a8f8c';
  const big = onColor ? 'rgba(255,255,255,.14)' : 'transparent';
  const bigStroke = onColor ? 'none' : '3px rgba(245,225,227,.12)';
  const kick = onColor ? '#fff' : accent;
  const num = p.numeral === 'roman' ? (ROMAN[ACT] || ACT) : String(ACT).padStart(2, '0');

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showIndex && (
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', right: -40, transform: 'translateY(-50%)',
          fontFamily: F.sans, fontWeight: 900, fontSize: 640, lineHeight: 0.7, letterSpacing: '-20px',
          color: big, WebkitTextStroke: bigStroke, pointerEvents: 'none', zIndex: 0 }}>{num}</div>
      )}
      {p.showDecorations && (
        <>
          <Shape kind="ring" size={92} border={15} color={onColor ? 'rgba(255,255,255,.35)' : accent}
            style={{ top: 150, right: 240, zIndex: 1 }} />
          <Shape kind="pentagon" size={56} color={onColor ? '#fff' : C.magenta}
            style={{ bottom: 170, right: 360, zIndex: 1, opacity: .9 }} />
        </>
      )}

      <Bar meta={p.barMeta} accent={onColor ? '#fff' : accent} dark />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 3, maxWidth: 1280 }}>
        <Kicker accent={kick}>{p.kicker} {String(ACT).padStart(2, '0')}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: '-2.6px', marginTop: 22 }}>
          {renderSwText(p.title, { hl: { tone: onColor ? 'c' : 'o' } })}
        </h2>
        {p.showTag && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 38,
            fontFamily: F.mono, fontSize: 23, letterSpacing: '.14em', textTransform: 'uppercase', color: mut }}>
            <span style={{ width: 46, height: 3, background: onColor ? '#fff' : accent, borderRadius: 2 }} />
            {p.tag}
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={onColor ? '#fff' : accent} dark />
    </SlideRoot>
  );
}
