// SwSlideTreemap.jsx — "占比方块 / Treemap" share-of-whole chart.
//
// Nested rectangles sized by each segment's share of total revenue, packed by a
// deterministic slice-and-dice split (largest block leads). Distinct from Donut
// (radial share) and StackBars (stacked columns). Block count (4–6), a focused
// block, the share labels and accent are props-controlled, 1:1 with `controls`;
// all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'treemap', index: 41, label: '占比方块 / Treemap' };

export const defaultProps = {
  accent: C.green,
  blockCount: 6,           // 4–6 segments
  focus: false,
  focusIndex: 1,           // 1-based (largest = 1)
  showShare: true,
  // —— content ——
  barMeta: '41 — Treemap',
  kicker: '占比方块 / Treemap',
  title: '收入从\n哪里[[长出来]]。',
  intro: '每个方块的面积，就是它在创作者总收入中的占比。流媒体仍是底盘，而现场与周边正快速变厚。',
  totalValue: '¥2.4亿',
  totalLabel: '年度总收入\nTOTAL · 2026',
  sources: [
    { t: '流媒体版税', s: 'Streaming', v: 42, c: '#5a138e', fg: '#fff', sub: '#f3b8ec' },
    { t: '现场演出', s: 'Live Shows', v: 23, c: '#3bb6ec', fg: '#143049', sub: '#1c5b82' },
    { t: '周边电商', s: 'Merch', v: 16, c: '#1f6b2a', fg: '#fff', sub: '#baf04f' },
    { t: '粉丝订阅', s: 'Memberships', v: 12, c: '#f15a29', fg: '#fff', sub: '#fdddc6' },
    { t: '版权授权', s: 'Sync / License', v: 7, c: '#fbb24d', fg: '#3a2607', sub: '#7a3a18' },
    { t: '众筹预售', s: 'Crowdfund', v: 5, c: '#c44ee0', fg: '#fff', sub: '#f3b8ec' },
  ],
  page: '41',
  total: '82',
};

export const controls = [
  { key: 'blockCount', label: '方块数量', type: 'slider', def: 6, min: 4, max: 6, step: 1,
    desc: '占比方块（收入来源）的数量' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: false, desc: '突出其中一个方块，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几块', type: 'slider', def: 1, min: 1, max: 6, step: 1,
    dependsOn: 'focus', desc: '高亮的方块（按占比从大到小）' },
  { key: 'showShare', label: '占比数字', type: 'toggle', def: true, desc: '显示/隐藏每块的占比百分比' },
  { key: 'accent', label: '强调色', type: 'color', def: C.green,
    options: [C.green, C.orange, C.purple, C.cyan], desc: '聚焦方块 / 导语 / 页脚强调色' },
];

// Deterministic slice-and-dice treemap: recursively split the rect among items,
// cutting along the longer side so blocks stay reasonably square.
function layout(items, x, y, w, h, out) {
  if (items.length === 1) { out.push({ ...items[0], x, y, w, h }); return; }
  const total = items.reduce((s, it) => s + it.v, 0);
  // take the largest as the first split partner vs the rest
  const head = items[0];
  const rest = items.slice(1);
  const frac = head.v / total;
  if (w >= h) {
    const hw = w * frac;
    out.push({ ...head, x, y, w: hw, h });
    layout(rest, x + hw, y, w - hw, h, out);
  } else {
    const hh = h * frac;
    out.push({ ...head, x, y, w, h: hh });
    layout(rest, x, y + hh, w, h - hh, out);
  }
}

export default function SwSlideTreemap(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(4, Math.min(6, p.blockCount));
  const data = (p.sources || []).slice(0, count);
  const sum = data.reduce((s, d) => s + d.v, 0);
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;

  const W = 1000, H = 560, gap = 8;
  const rects = [];
  layout(data.map((d, i) => ({ ...d, i })), 0, 0, W, H, rects);

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flex: 1, minHeight: 0, margin: '24px 0 22px', display: 'grid',
        gridTemplateColumns: '320px 1fr', gap: 44, position: 'relative', zIndex: 3 }}>

        {/* intro rail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.04, letterSpacing: '-1.4px', marginTop: 14 }}>
            {renderSwText(p.title, { hl: { tone: 'g' } })}
          </h2>
          <p style={{ fontSize: 24, lineHeight: 1.62, color: '#c8c0bd', marginTop: 22 }}>
            {p.intro}
          </p>
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid ' + C.lineD2,
            display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: '-1.5px', color: accent }}>{p.totalValue}</div>
            <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase',
              color: '#9a8f8c' }}>{renderSwText(p.totalLabel)}</div>
          </div>
        </div>

        {/* treemap */}
        <div style={{ position: 'relative', minWidth: 0 }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {rects.map((r) => {
              const on = fi === -1 || fi === r.i;
              const big = (r.w / W) * (r.h / H) > 0.06;
              const pct = Math.round((r.v / sum) * 100);
              const isFocus = fi === r.i;
              return (
                <div key={r.s} style={{ position: 'absolute',
                  left: (r.x / W) * 100 + '%', top: (r.y / H) * 100 + '%',
                  width: 'calc(' + (r.w / W) * 100 + '% - ' + gap + 'px)',
                  height: 'calc(' + (r.h / H) * 100 + '% - ' + gap + 'px)',
                  background: r.c, color: r.fg, borderRadius: 14, padding: '18px 20px',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  opacity: on ? 1 : 0.32,
                  outline: isFocus ? '4px solid ' + accent : 'none', outlineOffset: -4,
                  transition: 'opacity .2s' }}>
                  <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.14em',
                    textTransform: 'uppercase', color: r.sub }}>{r.s}</div>
                  <div style={{ fontWeight: 900, fontSize: big ? 30 : 23, letterSpacing: '-.5px',
                    marginTop: 3, lineHeight: 1.08 }}>{r.t}</div>
                  {p.showShare && (
                    <div style={{ marginTop: 'auto', fontWeight: 900, letterSpacing: '-1px',
                      fontSize: big ? 56 : 30, lineHeight: 1 }}>{pct}<span style={{ fontSize: '.5em' }}>%</span></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
