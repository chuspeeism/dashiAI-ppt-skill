// SwSlideDivider.jsx — "大间章 / Divider" bold numbered section break.
//
// A full-bleed chapter break dominated by a giant section number with a short
// title and a thin rule. Distinct from Section (kicker + decorations layout) and
// Interlude (quiet centred line). theme, the number, the rule, alignment and
// accent are props-controlled, 1:1 with `controls`; all visible copy/data
// defaults live in `defaultProps`. No global side effects.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'divider', index: 76, label: '大间章 / Divider' };

export const defaultProps = {
  accent: C.orange,
  theme: 'accent',         // 'dark' | 'accent'
  sectionNo: 3,            // chapter number
  align: 'left',           // 'left' | 'center'
  showRule: true,
  showGhost: true,         // oversized ghost numeral behind
  // —— content ——
  barMeta: '76 — Section',
  chapterLabel: 'CHAPTER',
  title: '分发与结算，\n一块工作台搞定。',
  intro: '从上传母带到版税到账——这一章，拆解声浪如何把一整条链路收进同一块屏幕。',
  page: '76',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'accent',
    options: [{ value: 'dark', label: '深色' }, { value: 'accent', label: '强调色' }], desc: '间章整体配色' },
  { key: 'sectionNo', label: '章节序号', type: 'slider', def: 3, min: 1, max: 9, step: 1,
    desc: '本章的序号' },
  { key: 'align', label: '对齐', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '居左' }, { value: 'center', label: '居中' }], desc: '标题对齐方式' },
  { key: 'showRule', label: '分隔线', type: 'toggle', def: true, desc: '显示/隐藏标题下方分隔线' },
  { key: 'showGhost', label: '背景大字', type: 'toggle', def: true, desc: '显示/隐藏背景超大序号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '强调色 / 序号 / 页脚强调色' },
];

export default function SwSlideDivider(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const onAccent = p.theme === 'accent';
  const center = p.align === 'center';

  const bg = onAccent ? accent : C.dark;
  const fg = '#fff';
  const sub = onAccent ? 'rgba(255,255,255,.82)' : 'rgba(245,225,227,.7)';
  const numColor = onAccent ? '#fff' : accent;
  const no = String(p.sectionNo).padStart(2, '0');

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showGhost && (
        <div aria-hidden="true" style={{ position: 'absolute', right: center ? 'auto' : -40,
          left: center ? '50%' : 'auto', top: '50%',
          transform: center ? 'translate(-50%,-50%)' : 'translateY(-50%)',
          fontFamily: F.mono, fontWeight: 700, fontSize: 720, lineHeight: 0.7,
          color: onAccent ? 'rgba(255,255,255,.12)' : 'rgba(245,225,227,.06)', pointerEvents: 'none',
          whiteSpace: 'nowrap' }}>{no}</div>
      )}

      <Bar meta={p.barMeta} accent={onAccent ? '#fff' : accent} dark />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap',
          justifyContent: center ? 'center' : 'flex-start' }}>
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: '.3em',
            color: sub }}>{p.chapterLabel}</span>
          <span style={{ fontWeight: 900, fontSize: 220, lineHeight: 0.82, letterSpacing: '-6px',
            color: numColor }}>{no}</span>
        </div>

        {p.showRule && (
          <div style={{ width: center ? 220 : 320, height: 5, borderRadius: 3,
            background: onAccent ? '#fff' : accent, margin: center ? '30px auto' : '30px 0' }} />
        )}

        <h2 style={{ fontWeight: 900, fontSize: 72, lineHeight: 1.04, letterSpacing: '-1.6px',
          maxWidth: 1100 }}>{renderSwText(p.title)}</h2>
        <p style={{ fontSize: 27, lineHeight: 1.5, color: sub, marginTop: 22, maxWidth: 760 }}>
          {p.intro}
        </p>
      </div>

      <Footer page={p.page} total={p.total} accent={onAccent ? '#fff' : accent} dark />
    </SlideRoot>
  );
}
