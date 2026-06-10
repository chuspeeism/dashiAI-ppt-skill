// SwSlideQuoteWall.jsx — "群言 / Quote Wall" multi-voice testimonial page.
//
// A staggered wall of short quotes from different voices, each on its own tinted
// card with a monogram badge and attribution. Distinct from Quote (one big
// statement) and Testimonial (one person with a photo). Quote count (2–4),
// column layout, the monogram badge, a focused card and accent are all
// props-controlled, 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. No global side effects, no host deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'quotewall', index: 81, label: '群言 / Quote Wall' };

export const defaultProps = {
  accent: C.purple,
  quoteCount: 4,           // 2–4 quotes
  showBadge: true,
  focus: false,
  focusIndex: 1,           // 1-based
  // —— content ——
  barMeta: '81 — Quote Wall',
  kicker: '群言 / In Their Words',
  title: '十二万音乐人，[[同一句话]]。',
  quotes: [
    { q: '过去对账要等三个月，现在打开声浪就能看到每一笔版税的来处。', n: '林夏', r: '独立唱作人 / 上海', m: '林', c: '#5a138e', fg: '#fff', sub: '#f3b8ec', big: true },
    { q: '一个人就是一支队伍——发行、结算、粉丝运营都在一块屏幕上。', n: '阿特拉斯乐队', r: '后摇乐队 / 成都', m: 'A', c: '#3bb6ec', fg: '#143049', sub: '#1c5b82' },
    { q: '海外平台同步分发，让我们第一次拿到了真正的全球收入。', n: 'Mira K.', r: '电子制作人 / 柏林', m: 'M', c: '#1f6b2a', fg: '#fff', sub: '#baf04f' },
    { q: '版权上链之后，合作再也不用靠口头承诺。', n: '老周', r: '厂牌主理人 / 北京', m: '周', c: '#f15a29', fg: '#fff', sub: '#fdddc6' },
  ],
  page: '81',
  total: '82',
};

export const controls = [
  { key: 'quoteCount', label: '引言数量', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '墙上展示的引言数量' },
  { key: 'showBadge', label: '姓名徽标', type: 'toggle', def: true, desc: '显示/隐藏发言人首字徽标' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: false, desc: '突出其中一条引言，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几条', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'focus', desc: '高亮的引言序号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '主引言 / 导语 / 页脚强调色' },
];

// span layouts so the wall stays balanced at each count (12-col grid)
const SPANS = {
  2: ['1 / span 7', '8 / span 5'],
  3: ['1 / span 7', '8 / span 5', '1 / span 12'],
  4: ['1 / span 7', '8 / span 5', '1 / span 5', '6 / span 7'],
};

export default function SwSlideQuoteWall(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.quoteCount));
  const data = (p.quotes || []).slice(0, count).map((d, i) => (i === 0 ? { ...d, c: accent } : d));
  const spans = SPANS[count];
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;
  const rows = count <= 2 ? '1fr' : '1fr 1fr';

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flexShrink: 0, marginTop: 20 }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.04, letterSpacing: '-1.1px', marginTop: 12 }}>
          {renderSwText(p.title, { hl: { tone: 'p' } })}
        </h2>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: rows, gap: 18 }}>
        {data.map((d, i) => {
          const on = fi === -1 || fi === i;
          const big = !!d.big;
          return (
            <div key={i} style={{ gridColumn: spans[i], position: 'relative', overflow: 'hidden',
              background: d.c, color: d.fg, borderRadius: 24, padding: big ? '40px 44px' : '32px 34px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0,
              opacity: on ? 1 : 0.34, outline: fi === i ? '4px solid #fff' : 'none', outlineOffset: -4,
              transition: 'opacity .2s' }}>
              <div aria-hidden="true" style={{ position: 'absolute', top: -28, left: 28, fontFamily: F.mono,
                fontWeight: 700, fontSize: big ? 180 : 130, lineHeight: 1, color: 'rgba(255,255,255,.14)' }}>“</div>
              <p style={{ position: 'relative', zIndex: 1, fontWeight: 900,
                fontSize: big ? 38 : 26, lineHeight: 1.34, letterSpacing: '-.4px',
                textWrap: 'pretty' }}>{d.q}</p>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 14,
                marginTop: 24 }}>
                {p.showBadge && (
                  <span style={{ width: big ? 56 : 46, height: big ? 56 : 46, flexShrink: 0, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.18)',
                    color: d.fg, fontWeight: 900, fontSize: big ? 26 : 21 }}>{d.m}</span>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: big ? 25 : 22, letterSpacing: '-.2px' }}>{d.n}</div>
                  <div style={{ fontFamily: F.mono, fontSize: big ? 19 : 17, letterSpacing: '.08em',
                    color: d.sub }}>{d.r}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 22 }}>
        <Footer page={p.page} total={p.total} accent={accent} dark />
      </div>
    </SlideRoot>
  );
}
