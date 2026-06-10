// SwSlideSection.jsx — chapter-divider "章节页" page.
//
// A full-bleed act break. Theme (dark / colour / light), numeral style, the big
// chapter index, and an optional agenda list (with the current act highlighted)
// are all props-controlled; all visible copy/data defaults live in
// `defaultProps`. No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'section', index: 75, label: '章节页 / Section' };

export const defaultProps = {
  accent: C.purple,
  theme: 'color',          // 'dark' | 'color' | 'light'
  numeral: 'roman',        // 'roman' | 'arabic'
  showIndex: true,         // giant chapter number
  showAgenda: true,        // act list with current highlighted
  showDecorations: true,
  // —— content ——
  barMeta: '75 — Chapter',
  kicker: '路线图 / The Road Ahead',
  title: '接下来，\n我们去[[哪里]]。',
  intro: '已经跑通的，与正在路上的——一张写给创作者的时间表。',
  current: 4,
  acts: ['宣言 Manifesto', '产品矩阵 The Stack', '为什么是现在 Why Now', '路线图 Roadmap', '加入声浪 Join Us'],
  page: '75',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'color',
    options: [{ value: 'dark', label: '深色' }, { value: 'color', label: '彩色' }, { value: 'light', label: '浅色' }],
    desc: '章节页底色：深色 / 强调色铺底 / 浅色' },
  { key: 'numeral', label: '编号样式', type: 'segment', def: 'roman',
    options: [{ value: 'roman', label: 'Ⅳ' }, { value: 'arabic', label: '04' }],
    desc: '大编号的呈现方式' },
  { key: 'showIndex', label: '章节编号', type: 'toggle', def: true, desc: '显示/隐藏巨大的章节编号' },
  { key: 'showAgenda', label: '章节目录', type: 'toggle', def: true, desc: '显示/隐藏右侧章节进度列表' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '编号 / 高亮 / 铺底强调色' },
];

const ROMAN = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ', 5: 'Ⅴ' };

export default function SwSlideSection(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const onColor = p.theme === 'color';
  const dark = p.theme === 'dark';
  const ACTS = p.acts;
  const CURRENT = p.current;

  const bg = onColor ? accent : (dark ? C.dark : C.blush);
  const fg = onColor ? '#fff' : (dark ? C.blush : C.ink);
  const mut = onColor ? 'rgba(255,255,255,.7)' : (dark ? '#9a8f8c' : C.inkMut);
  const big = onColor ? 'rgba(255,255,255,.16)' : accent;
  const kick = onColor ? '#fff' : accent;
  const num = p.numeral === 'roman' ? (ROMAN[CURRENT] || CURRENT) : String(CURRENT).padStart(2, '0');

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showDecorations && !onColor && (
        <>
          <Shape kind="pentagon" size={104} color={accent} style={{ bottom: 120, left: 96, opacity: dark ? 1 : 1 }} />
          <Shape kind="circle" size={62} color={dark ? C.lime : C.magenta} style={{ bottom: 230, left: 250 }} />
        </>
      )}
      {p.showDecorations && onColor && (
        <Shape kind="ring" size={120} border={18} color="rgba(255,255,255,.35)" style={{ bottom: 110, left: 110 }} />
      )}

      <Bar meta={p.barMeta} accent={onColor ? '#fff' : accent} dark={dark || onColor} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid',
        gridTemplateColumns: p.showAgenda ? '1.6fr 1fr' : '1fr', gap: 72,
        alignItems: 'center', position: 'relative', zIndex: 3 }}>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 48 }}>
          {p.showIndex && (
            <div style={{ fontWeight: 900, fontSize: 360, lineHeight: 0.74, letterSpacing: '-10px',
              color: big, flexShrink: 0 }}>{num}</div>
          )}
          <div>
            <Kicker accent={kick}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 92, lineHeight: 1.06, letterSpacing: '-2px', marginTop: 18 }}>
              {renderSwText(p.title, { hl: { tone: onColor ? 'c' : 'o' } })}
            </h2>
            <p style={{ fontSize: swTheme.type.body, lineHeight: 1.6, color: mut, marginTop: 22, maxWidth: 520 }}>
              {p.intro}
            </p>
          </div>
        </div>

        {p.showAgenda && (
          <div style={{ borderLeft: '1px solid ' + (onColor ? 'rgba(255,255,255,.3)' : (dark ? C.lineD : C.line2)),
            paddingLeft: 40 }}>
            {ACTS.map((a, i) => {
              const on = (i + 1) === CURRENT;
              const sp = a.indexOf(' ');
              const cn = a.slice(0, sp);
              const en = a.slice(sp + 1);
              return (
                <div key={a} style={{ display: 'flex', alignItems: 'baseline', gap: 16,
                  padding: '14px 0', opacity: on ? 1 : 0.42 }}>
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22,
                    color: on ? kick : mut, width: 30 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <span style={{ fontWeight: on ? 900 : 700, fontSize: 28, letterSpacing: '-.3px' }}>{cn}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.08em',
                      textTransform: 'uppercase', color: mut, marginLeft: 12 }}>{en}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={onColor ? '#fff' : accent} dark={dark || onColor} />
    </SlideRoot>
  );
}
