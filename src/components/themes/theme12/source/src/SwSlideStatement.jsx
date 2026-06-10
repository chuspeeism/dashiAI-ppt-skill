// SwSlideStatement.jsx — "满版标语 / Statement" type-poster page.
//
// A full-bleed typographic poster: one huge multi-line statement set on a solid
// brand-colour (or dark) field, with an oversized ghost mono numeral bleeding
// off-frame and floating geometric shapes. Distinct from Quote (attributed) and
// Section (numbered divider) — this is a pure manifesto beat with no source.
// theme / accent / emphasis word / shapes are props-controlled, 1:1 with controls;
// all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'statement', index: 4, label: '满版标语 / Statement' };

export const defaultProps = {
  theme: 'accent',          // 'accent' | 'dark' | 'light'
  accent: C.orange,
  align: 'left',            // 'left' | 'center'
  showGhost: true,          // giant ghost numeral
  showShapes: true,
  showKicker: true,
  // —— content（[[x]] = 高亮块，\n = 换行）——
  barMeta: '04 — Statement',
  kicker: '我们的主张 / What We Stand For',
  title: '创作者，\n理应[[掌握]]自己的\n声浪。',
  lede: '发行、结算、版权与听众——本该握在做音乐的人手里，而不是散落在十几个看不懂的后台。',
  page: '04',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'accent',
    options: [{ value: 'accent', label: '强调' }, { value: 'dark', label: '深色' }, { value: 'light', label: '浅色' }],
    desc: '整版底色：强调色 / 深色 / 浅色' },
  { key: 'align', label: '对齐', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '居左' }, { value: 'center', label: '居中' }], desc: '标语排版对齐方式' },
  { key: 'showKicker', label: '显示眉标', type: 'toggle', def: true, desc: '显示/隐藏顶部小标题' },
  { key: 'showGhost', label: '巨型数字', type: 'toggle', def: true, desc: '显示/隐藏出血的巨型页码' },
  { key: 'showShapes', label: '几何装饰', type: 'toggle', def: true, desc: '显示/隐藏漂浮的几何装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '底色 / 高亮 / 页脚强调色' },
];

export default function SwSlideStatement(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const center = p.align === 'center';

  // Resolve the field + ink per theme.
  let bg = accent, fg = '#fff', mut = 'rgba(255,255,255,.82)', ghost = 'rgba(255,255,255,.14)';
  let hlBg = '#fff', hlFg = accent, kickerC = '#fff', dark = false;
  if (p.theme === 'dark') {
    bg = C.dark; fg = C.blush; mut = '#c8c0bd'; ghost = 'rgba(245,225,227,.06)';
    hlBg = accent; hlFg = '#fff'; kickerC = accent; dark = true;
  } else if (p.theme === 'light') {
    bg = C.blush; fg = C.ink; mut = '#5a4f54'; ghost = 'transparent';
    hlBg = accent; hlFg = '#fff'; kickerC = accent;
  }

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={p.theme === 'light' ? accent : '#fff'} dark={!dark && p.theme !== 'light'} />

      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left', padding: center ? '0 40px' : '0 8px' }}>

        {p.showGhost && (
          <div aria-hidden="true" style={{ position: 'absolute', bottom: -120, right: -40,
            fontFamily: F.mono, fontWeight: 700, fontSize: 560, lineHeight: 0.8,
            color: p.theme === 'light' ? 'transparent' : ghost,
            WebkitTextStroke: p.theme === 'light' ? '2px ' + accent + '22' : 'none',
            pointerEvents: 'none', zIndex: 0 }}>{p.page}</div>
        )}

        {p.showShapes && (
          <>
            <Shape kind="ring" size={96} border={20}
              color={p.theme === 'light' ? accent : 'rgba(255,255,255,.5)'}
              style={{ top: 30, right: center ? 120 : 60, zIndex: 1 }} />
            <Shape kind="pentagon" size={70}
              color={p.theme === 'dark' ? accent : (p.theme === 'light' ? C.purple : 'rgba(255,255,255,.35)')}
              style={{ bottom: 60, left: center ? 140 : 0, zIndex: 1 }} />
          </>
        )}

        <div style={{ position: 'relative', zIndex: 2, maxWidth: center ? 1500 : 1560 }}>
          {p.showKicker && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.mono,
              fontSize: 25, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase',
              color: kickerC, marginBottom: 30, justifyContent: center ? 'center' : 'flex-start' }}>
              <span style={{ width: 46, height: 3, background: kickerC, borderRadius: 2 }} />
              {p.kicker}
            </div>
          )}

          <h1 style={{ fontWeight: 900, fontSize: 134, lineHeight: 1.02, letterSpacing: '-3px',
            margin: 0, textWrap: 'balance' }}>
            {renderSwText(p.title, { hl: { tone: 'o', block: true, style: { background: hlBg, color: hlFg } } })}
          </h1>

          <p style={{ fontSize: 30, lineHeight: 1.6, color: mut, marginTop: 38,
            maxWidth: 940, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }}>
            {p.lede}
          </p>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={p.theme === 'light' ? accent : '#fff'} dark={!dark && p.theme !== 'light'} />
    </SlideRoot>
  );
}
