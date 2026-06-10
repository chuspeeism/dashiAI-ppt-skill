// SwSlideMagazine.jsx — "杂志特写 / Magazine" editorial feature page.
//
// A magazine spread: one large feature image on one side, a body column on the
// other set with a drop-cap opening and a coloured pull-quote band. Distinct from
// Spotlight (annotated image), Split (balanced image/text) and Showcase (image
// grid). Image side, drop-cap, pull-quote, mediaFit, accent and theme are
// props-controlled, 1:1 with controls; all visible copy/data defaults live in
// `defaultProps`. The single image slot is fully controlled
// (media + onMediaChange). No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'magazine', index: 13, label: '杂志特写 / Magazine' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  imageSide: 'left',       // 'left' | 'right'
  showDropCap: true,
  showPullQuote: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '13 — Magazine',
  imageTag: 'FEATURE · 2026',
  kicker: '封面故事 / Cover Story',
  title: '一个人，\n也能撑起\n一座厂牌。',
  dropCap: '声',
  body: '浪把发行、结算、版权与粉丝运营收拢进同一块工作台。曾经需要一整个团队、十几个后台才能跑通的事，如今一个人、一块屏幕就能完成——而且每一分收益的来处，都看得见。',
  pullQuote: '“工具退场，创作者才是主角。”',
  mediaPlaceholder: '拖入特写大图 / Feature image',
  page: '13',
  total: '82',
};

export const controls = [
  { key: 'imageSide', label: '图片位置', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '居左' }, { value: 'right', label: '居右' }], desc: '特写大图所在的一侧' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showDropCap', label: '首字下沉', type: 'toggle', def: true, desc: '正文首字母放大下沉' },
  { key: 'showPullQuote', label: '引文条', type: 'toggle', def: true, desc: '显示/隐藏彩色引文条' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '图片填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '首字 / 引文 / 页脚强调色' },
];

export default function SwSlideMagazine(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const left = p.imageSide === 'left';

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#c8c0bd' : '#4f444a';

  const Image = (
    <div style={{ position: 'relative', minWidth: 0, height: '100%' }}>
      <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
        fit={p.mediaFit} accent={accent} radius={swTheme.radius} tone={dark ? 'dark' : 'light'}
        placeholder={p.mediaPlaceholder} />
      <div style={{ position: 'absolute', bottom: 18, left: 18, fontFamily: F.mono, fontSize: 19,
        fontWeight: 700, letterSpacing: '.1em', color: '#fff', background: 'rgba(12,9,10,.62)',
        padding: '7px 15px', borderRadius: 8 }}>{p.imageTag}</div>
    </div>
  );

  const Body = (
    <div style={{ position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker accent={accent}>{p.kicker}</Kicker>
      <h2 style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.06, letterSpacing: '-1.6px', marginTop: 16 }}>
        {renderSwText(p.title)}
      </h2>

      <p style={{ fontSize: 25, lineHeight: 1.66, color: mut, marginTop: 26 }}>
        {p.showDropCap && (
          <span style={{ float: 'left', fontWeight: 900, fontSize: 96, lineHeight: 0.82, color: accent,
            margin: '6px 16px 0 0', fontFamily: F.sans }}>{p.dropCap}</span>
        )}
        {p.body}
      </p>

      {p.showPullQuote && (
        <div style={{ position: 'relative', overflow: 'hidden', marginTop: 28, background: accent, color: '#fff',
          borderRadius: 18, padding: '24px 30px' }}>
          <Shape kind="circle" size={64} color="rgba(255,255,255,.16)" style={{ top: -14, right: -10, zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, fontWeight: 900, fontSize: 30, lineHeight: 1.32, letterSpacing: '-.4px' }}>
            {p.pullQuote}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 64, padding: '24px 0 22px',
        gridTemplateColumns: left ? '1.04fr 0.96fr' : '0.96fr 1.04fr', alignItems: 'stretch',
        position: 'relative', zIndex: 3 }}>
        {left ? <>{Image}{Body}</> : <>{Body}{Image}</>}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
