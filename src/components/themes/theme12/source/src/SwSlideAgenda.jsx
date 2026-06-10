// SwSlideAgenda.jsx — "目录 / Agenda" contents page.
//
// A chaptered table of contents: numbered chapter rows in one or two columns,
// with one chapter optionally promoted to an accent colour block (focus).
// Distinct from Section (a single numbered divider) and Manifesto (the cover).
// Chapter count (3–6), columns (1|2), focus + focusIndex, lede, theme and accent
// are props-controlled, 1:1 with controls; all visible copy/data defaults live
// in `defaultProps`. No global side effects, no host
// dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'agenda', index: 3, label: '目录 / Agenda' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  chapterCount: 6,         // 3–6
  columns: 2,              // 1 | 2
  focus: true,
  focusIndex: 1,
  showLede: true,
  // —— content ——
  barMeta: '03 — Agenda',
  kicker: '本场内容 / Agenda',
  title: '接下来，[[六个章节]]。',
  chapters: [
    { cn: '主张与信条', en: 'The Manifesto', s: '为什么主权比流量更重要。' },
    { cn: '产品与能力', en: 'The Product', s: '一个工作台，全链路覆盖。' },
    { cn: '影像与现场', en: 'In The Wild', s: '声音真正发生的地方。' },
    { cn: '数据与增长', en: 'The Numbers', s: '透明的收益，可见的曲线。' },
    { cn: '定价与对照', en: 'Plans', s: '谁真的站在创作者这边。' },
    { cn: '路线与加入', en: 'What\u2019s Next', s: '轮到你，发出声浪。' },
  ],
  page: '03',
  total: '82',
};

export const controls = [
  { key: 'chapterCount', label: '章节数量', type: 'slider', def: 6, min: 3, max: 6, step: 1,
    desc: '目录中的章节条目数量' },
  { key: 'columns', label: '栏数', type: 'segment', def: 2,
    options: [{ value: 1, label: '1 栏' }, { value: 2, label: '2 栏' }], desc: '目录条目的列数' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: true, desc: '把某一章提升为强调色块' },
  { key: 'focusIndex', label: '强调第几章', type: 'slider', def: 1, min: 1, max: 6, step: 1,
    dependsOn: 'focus', desc: '被强调章节的序号（1 起）' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '焦点 / 高亮 / 页脚强调色' },
];

// chapter index colours that stay vivid on both blush and dark fields
const VIVID = ['#5a138e', '#1c7ed6', '#1f6b2a', '#f15a29', '#c41d7f', '#0b7285'];

export default function SwSlideAgenda(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(3, Math.min(6, p.chapterCount));
  const cols = p.columns === 1 ? 1 : 2;
  const items = (p.chapters || []).slice(0, count);

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#c8c0bd' : '#5a4f54';
  const line = dark ? C.lineD2 : C.line2;

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
        <Shape kind="ring" size={88} border={18} color={dark ? 'rgba(255,255,255,.18)' : accent}
          style={{ top: 8, right: 30, zIndex: 1, opacity: dark ? 1 : .9 }} />

        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 26px' }}>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.04, letterSpacing: '-1.6px', marginTop: 14 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: cols === 1 ? 0 : '0 64px',
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridAutoRows: '1fr', alignContent: 'stretch' }}>
          {items.map((it, i) => {
            const on = p.focus && (i + 1) === p.focusIndex;
            const pal = swCardPalette[i % swCardPalette.length];
            return (
              <div key={it.en} style={{ display: 'flex', alignItems: 'center', gap: 26,
                padding: cols === 1 ? '0 14px' : '0 6px', borderTop: '1px solid ' + line,
                position: 'relative' }}>
                <span style={{ flexShrink: 0, fontFamily: F.mono, fontWeight: 700,
                  fontSize: on ? 40 : 34, color: on ? accent : VIVID[i % VIVID.length],
                  width: 78 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: on ? 38 : 33, letterSpacing: '-.5px',
                      color: on ? accent : fg }}>{it.cn}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.12em',
                      textTransform: 'uppercase', color: mut }}>{it.en}</span>
                  </div>
                  <p style={{ fontSize: 22, lineHeight: 1.45, color: mut, marginTop: 4 }}>{it.s}</p>
                </div>
                {on && <span style={{ flexShrink: 0, fontSize: 30, color: accent }}>→</span>}
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
