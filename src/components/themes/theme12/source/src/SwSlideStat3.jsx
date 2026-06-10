// SwSlideStat3.jsx — "三连大数 / Headline Stats" big-number triptych page.
//
// Two or three oversized figures sit side by side, each with a label and a short
// note, divided by hairlines. Distinct from BigNumber (one hero figure),
// Scoreboard (dense tile grid) and WhyNow (stat cards with argument). theme,
// stat count (2–3), the dividers, decorations and accent are props-controlled,
// 1:1 with `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme, swStatColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Shape } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'stat3', index: 59, label: '三连大数 / Headline Stats' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  statCount: 3,            // 2–3 figures
  showDividers: true,
  showDecorations: true,
  // —— content ——
  barMeta: '59 — Headline Stats',
  kicker: '截至 2026 / By the Numbers',
  title: '三个数字，说清声浪的一年。',
  stats: [
    { v: '12万+', lb: '入驻音乐人', s: 'Independent artists onboard' },
    { v: '¥2.4亿', lb: '已发版税', s: 'Royalties paid to date' },
    { v: '72h', lb: '平均到账', s: 'Average payout time' },
  ],
  page: '59',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'statCount', label: '数字数量', type: 'slider', def: 3, min: 2, max: 3, step: 1,
    desc: '并置的大数字数量' },
  { key: 'showDividers', label: '分隔线', type: 'toggle', def: true, desc: '显示/隐藏数字之间的竖向分隔线' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '首个数字 / 导语 / 页脚强调色' },
];

export default function SwSlideStat3(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const k = Math.max(2, Math.min(3, p.statCount));
  const stats = (p.stats || []).slice(0, k);

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#c8c0bd' : '#5a4f54';
  const line = dark ? C.lineD2 : C.line2;

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showDecorations && (
        <>
          <Shape kind="ring" size={96} border={15} color={accent} style={{ top: 120, right: 150, opacity: 0.6 }} />
          <Shape kind="circle" size={54} color={dark ? C.cyan : C.magenta} style={{ bottom: 180, left: 130, opacity: 0.7 }} />
        </>
      )}

      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flexShrink: 0, marginTop: 26, position: 'relative', zIndex: 3 }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 12 }}>
          {p.title}
        </h2>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(' + k + ', 1fr)',
        alignItems: 'center', position: 'relative', zIndex: 3 }}>
        {stats.map((st, i) => (
          <div key={st.lb} style={{ padding: '0 44px', borderLeft: (p.showDividers && i > 0) ? '1px solid ' + line : 'none' }}>
            <div style={{ fontWeight: 900, fontSize: 132, lineHeight: 0.92, letterSpacing: '-4px',
              color: swStatColors[i % swStatColors.length] }}>{st.v}</div>
            <div style={{ fontWeight: 700, fontSize: 32, letterSpacing: '-.4px', marginTop: 16 }}>{st.lb}</div>
            <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.08em', textTransform: 'uppercase',
              color: mut, marginTop: 8 }}>{st.s}</div>
          </div>
        ))}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
