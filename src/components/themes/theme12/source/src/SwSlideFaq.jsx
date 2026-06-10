// SwSlideFaq.jsx — "问答 / FAQ" question-and-answer page.
//
// Numbered Q&A pairs laid out in one or two columns, each question carrying a
// coloured index chip; one item can be promoted to an accent block (focus).
// Distinct from Principles (tenets) and Contrast (two-column prose). Item count
// (3–6), columns (1|2), focus + focusIndex, lede, theme and accent are
// props-controlled, 1:1 with controls; all visible copy/data defaults live in
// `defaultProps`. No global side effects, no host
// dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'faq', index: 36, label: '问答 / FAQ' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  itemCount: 4,            // 3–6
  columns: 2,              // 1 | 2
  focus: false,
  focusIndex: 1,
  showLede: true,
  // —— content ——
  barMeta: '36 — FAQ',
  kicker: '常见问题 / FAQ',
  title: '你大概想问的[[几件事]]。',
  lede: '把签约前最常被追问的问题，提前摊开讲清楚。',
  items: [
    { q: '我的版权会被声浪拿走吗？', a: '永远不会。作品、母带与收益 100% 归你，声浪只是工具。' },
    { q: '结算到底有多快？', a: '版税按平台拆解，最快 72 小时到账，路径全程可追溯。' },
    { q: '能分发到哪些平台？', a: '一次上传，自动推送到全球 30+ 主流流媒体与商店。' },
    { q: '可以随时离开吗？', a: '可以。数据与听众随时导出，绝不把你锁进围墙。' },
    { q: '协作如何分账？', a: '词曲编混按比例自动拆账，每个人实时看到自己那份。' },
    { q: '需要技术团队吗？', a: '不需要。复杂留给系统，你只管做音乐。' },
  ],
  page: '36',
  total: '82',
};

export const controls = [
  { key: 'itemCount', label: '问题数量', type: 'slider', def: 4, min: 3, max: 6, step: 1,
    desc: '问答条目的数量' },
  { key: 'columns', label: '栏数', type: 'segment', def: 2,
    options: [{ value: 1, label: '1 栏' }, { value: 2, label: '2 栏' }], desc: '问答条目的列数' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: false, desc: '把某一条提升为强调色卡片' },
  { key: 'focusIndex', label: '强调第几条', type: 'slider', def: 1, min: 1, max: 6, step: 1,
    dependsOn: 'focus', desc: '被强调条目的序号（1 起）' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '焦点 / 高亮 / 页脚强调色' },
];

export default function SwSlideFaq(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(3, Math.min(6, p.itemCount));
  const cols = p.columns === 1 ? 1 : 2;
  const items = (p.items || []).slice(0, count);

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const cardBg = dark ? '#262022' : '#ffffff';
  const ansC = dark ? '#c8c0bd' : '#5a4f54';

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 24px', display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: 40 }}>
            <div>
              <Kicker accent={accent}>{p.kicker}</Kicker>
              <h2 style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.04, letterSpacing: '-1.5px', marginTop: 14 }}>
                {renderSwText(p.title, { hl: { tone: 'o' } })}
              </h2>
            </div>
            <p style={{ fontSize: 24, lineHeight: 1.6, color: ansC, maxWidth: 400, paddingBottom: 6 }}>
              {p.lede}
            </p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: cols === 1 ? 11 : 18,
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridAutoRows: '1fr' }}>
          {items.map((it, i) => {
            const on = p.focus && (i + 1) === p.focusIndex;
            const pal = swCardPalette[i % swCardPalette.length];
            const ghostC = on ? 'rgba(255,255,255,.16)' : (dark ? 'rgba(245,225,227,.05)' : pal.bg + '12');
            const ruleC = on ? 'rgba(255,255,255,.5)' : pal.bg;
            // 1-column packs more rows into the same height → compact the card.
            const compact = cols === 1;
            return (
              <div key={it.q} style={{ position: 'relative', overflow: 'hidden', borderRadius: 22,
                background: on ? accent : cardBg, color: on ? '#fff' : fg,
                border: on ? 'none' : '1px solid ' + (dark ? C.lineD : C.line),
                padding: compact ? '14px 32px' : '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {!compact && (
                  <div aria-hidden="true" style={{ position: 'absolute', right: 20, bottom: -34, fontFamily: F.mono,
                    fontWeight: 700, fontSize: 168, lineHeight: 0.8, color: ghostC, pointerEvents: 'none', zIndex: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                )}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: compact ? 'center' : 'flex-start', gap: compact ? 20 : 22 }}>
                  <span style={{ flexShrink: 0, width: compact ? 48 : 56, height: compact ? 48 : 56, borderRadius: 15,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: on ? '#fff' : pal.bg, color: on ? accent : pal.title,
                    fontFamily: F.mono, fontWeight: 700, fontSize: compact ? 24 : 27 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontWeight: 900, fontSize: compact ? 27 : 30, letterSpacing: '-.4px', lineHeight: 1.25,
                      color: on ? '#fff' : fg }}>{it.q}</h3>
                    <div style={{ width: 46, height: 3, borderRadius: 2, background: ruleC, margin: compact ? '8px 0' : '16px 0' }} />
                    <p style={{ fontSize: compact ? 23 : 25, lineHeight: compact ? 1.4 : 1.62,
                      color: on ? 'rgba(255,255,255,.92)' : ansC }}>{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
