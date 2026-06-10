// SwSlidePrinciples.jsx — "信条 / Principles" page.
//
// Type-forward tenets rendered as bold COLOUR-BLOCKED cards (one saturated
// brand colour per tenet) with a giant ghost mono numeral bleeding off each
// card — distinct from the directory of Manifesto and the product cards of
// Stack. Count (3–6), columns (1/2), theme, lede and accent are props-
// controlled and map 1:1 to `controls`; all visible copy/data defaults live in
// `defaultProps`. No global side effects.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'principles', index: 78, label: '信条 / Principles' };

export const defaultProps = {
  accent: C.orange,
  principleCount: 4,       // 3–6
  columns: 2,              // 1 | 2
  theme: 'light',          // 'light' | 'dark'
  showLede: true,
  showDeco: true,
  // —— content ——
  barMeta: '78 — Principles',
  kicker: '信条 / What We Believe',
  title: '我们[[相信]]的事。',
  lede: '这些不是功能列表，而是声浪做每一个决定时，反复回到的几条底线。',
  tenets: [
    { t: '主权优先', en: 'Ownership', s: '作品、收入与听众，永远属于创作者本人。' },
    { t: '路径透明', en: 'Transparency', s: '每一分收益的来处与去向，都可被追溯。' },
    { t: '工具退场', en: 'Invisible', s: '复杂留给系统，让你只需专注创作本身。' },
    { t: '直连听众', en: 'Direct', s: '不被算法隔开，把关系握在自己手里。' },
    { t: '即时回报', en: 'Instant', s: '价值产生即可见，版税最快三天到账。' },
    { t: '生而开放', en: 'Open', s: '可迁出、可接入，绝不把你锁进围墙。' },
  ],
  page: '78',
  total: '82',
};

export const controls = [
  { key: 'principleCount', label: '信条数量', type: 'slider', def: 4, min: 3, max: 6, step: 1,
    desc: '展示的信条条目数量' },
  { key: 'columns', label: '栏数', type: 'segment', def: 2,
    options: [{ value: 1, label: '1 栏' }, { value: 2, label: '2 栏' }], desc: '信条卡片的列数' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'showDeco', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏卡片内几何装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语高亮 / 页脚强调色' },
];

function CardDeco({ i, pal }) {
  const col = pal.deco[0];
  const wrap = { position: 'absolute', right: 26, bottom: 24, opacity: .92, zIndex: 1 };
  if (i % 3 === 0) return <Shape kind="circle" size={40} color={col} style={wrap} />;
  if (i % 3 === 1) return <Shape kind="ring" size={42} border={9} color={col} style={wrap} />;
  return <Shape kind="pentagon" size={40} color={col} style={wrap} />;
}

export default function SwSlidePrinciples(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(3, Math.min(6, p.principleCount));
  const cols = p.columns === 1 ? 1 : 2;
  const items = (p.tenets || []).slice(0, count);
  // 1-column cards get short rows when there are many tenets — scale type,
  // padding and the side numeral down so content breathes instead of packing
  // edge-to-edge.
  const dense = cols === 1 && count >= 5;
  const oneNum = dense ? 48 : 76;
  const oneTitle = dense ? 30 : 38;
  const onePara = dense ? 19 : 24;
  const onePad = dense ? '14px 36px' : '26px 36px';
  const oneGap = dense ? 28 : 36;
  const oneNumMin = dense ? 92 : 116;
  const oneNumPad = dense ? 24 : 28;

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const sub = dark ? '#c8c0bd' : '#5a4f54';

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        position: 'relative', zIndex: 3, padding: '8px 0' }}>

        {p.showLede && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: 48, margin: '20px 0 26px', flexShrink: 0 }}>
            <div>
              <Kicker accent={accent}>{p.kicker}</Kicker>
              <h2 style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.04, letterSpacing: '-1.5px', marginTop: 16 }}>
                {renderSwText(p.title, { hl: { tone: 'o' } })}
              </h2>
            </div>
            <p style={{ fontSize: T.body, lineHeight: 1.66, color: sub, maxWidth: 440, paddingBottom: 6 }}>
              {p.lede}
            </p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 20,
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridAutoRows: '1fr' }}>
          {items.map((it, i) => {
            const pal = swCardPalette[i % swCardPalette.length];
            return (
              <div key={it.t} style={{ position: 'relative', overflow: 'hidden', borderRadius: 26,
                background: pal.bg, color: pal.body, padding: cols === 1 ? onePad : '32px 36px 30px',
                display: 'flex', flexDirection: cols === 1 ? 'row' : 'column',
                alignItems: cols === 1 ? 'center' : 'stretch', gap: cols === 1 ? oneGap : 0 }}>

                {/* ghost numeral (2-col only) */}
                {cols !== 1 && (
                  <div aria-hidden="true" style={{ position: 'absolute', top: -34, right: -6,
                    fontFamily: F.mono, fontWeight: 700, fontSize: 168,
                    lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '2px ' + pal.name,
                    opacity: .5, pointerEvents: 'none', zIndex: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                )}

                <div style={{ position: 'relative', zIndex: 2, flex: cols === 1 ? '0 0 auto' : 'none',
                  minWidth: cols === 1 ? oneNumMin : 0,
                  borderRight: cols === 1 ? '2px solid ' + pal.name + '66' : 'none',
                  paddingRight: cols === 1 ? oneNumPad : 0, alignSelf: cols === 1 ? 'stretch' : 'auto',
                  display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: cols === 1 ? oneNum : 26,
                    lineHeight: 1, letterSpacing: cols === 1 ? '-2px' : 0, color: pal.name }}>{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div style={{ position: 'relative', zIndex: 2, marginTop: cols === 1 ? 0 : 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                    <h3 style={{ fontWeight: 900, fontSize: cols === 1 ? oneTitle : 40, letterSpacing: '-.5px', color: pal.title }}>{it.t}</h3>
                    <span style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.14em', textTransform: 'uppercase', color: pal.sub }}>{it.en}</span>
                  </div>
                  <p style={{ fontSize: cols === 1 ? onePara : 24, lineHeight: dense ? 1.4 : 1.5, marginTop: dense ? 6 : 10, maxWidth: 560, color: pal.body }}>{it.s}</p>
                </div>

                {p.showDeco && cols !== 1 && <CardDeco i={i} pal={pal} />}
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
