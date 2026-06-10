// SwSlideRanking.jsx — "平台排行 / Ranking" horizontal-bar page.
//
// A ranked list of horizontal bars (royalties by platform), each bar a distinct
// series colour with a rank index and value label. Distinct from Growth (time-
// series) and Donut (composition). Bar count (4–7), value labels, gridline, a
// focusable leader and accent are props-controlled and map 1:1 to `controls`;
// all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme, swSeriesColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'ranking', index: 51, label: '平台排行 / Ranking' };

export const defaultProps = {
  accent: C.orange,
  barCount: 6,             // 4–7 bars
  showValue: true,
  showAxis: true,
  focus: true,
  focusIndex: 1,
  // —— content ——
  barMeta: '51 — Ranking',
  kicker: '平台排行 / By Platform',
  title: '收入来自[[哪里]]，一目了然。',
  caption: '近 12 个月\n版税占比',
  ghost: '37',
  rows: [
    { cn: '声浪 直连', en: 'SoundWave Direct', v: 100, share: '38%' },
    { cn: 'Spotify', en: 'Streaming', v: 74, share: '22%' },
    { cn: 'Apple Music', en: 'Streaming', v: 58, share: '15%' },
    { cn: '网易云 / QQ', en: 'Streaming', v: 46, share: '12%' },
    { cn: '现场 & 周边', en: 'Live & Merch', v: 33, share: '8%' },
    { cn: 'YouTube', en: 'Video', v: 22, share: '4%' },
    { cn: '授权 / 同步', en: 'Sync', v: 13, share: '1%' },
  ],
  page: '51',
  total: '82',
};

export const controls = [
  { key: 'barCount', label: '条目数量', type: 'slider', def: 6, min: 4, max: 7, step: 1,
    desc: '排行展示的平台条目数量' },
  { key: 'showValue', label: '数值标签', type: 'toggle', def: true, desc: '显示/隐藏每条末端的数值' },
  { key: 'showAxis', label: '刻度网格', type: 'toggle', def: true, desc: '显示/隐藏背景刻度网格' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: true, desc: '高亮某一条，弱化其余' },
  { key: 'focusIndex', label: '强调第几条', type: 'slider', def: 1, min: 1, max: 7, step: 1,
    dependsOn: 'focus', desc: '被强调条目的序号（1 起）' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '榜首 / 导语 / 页脚强调色' },
];

export default function SwSlideRanking(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(4, Math.min(7, p.barCount));
  const rows = (p.rows || []).slice(0, count);
  const max = Math.max(...rows.map((r) => r.v));
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '42px 56px 38px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        <div aria-hidden="true" style={{ position: 'absolute', top: -40, right: 38, fontFamily: F.mono, fontWeight: 700,
          fontSize: 220, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '2px rgba(27,21,24,.05)', pointerEvents: 'none' }}>{p.ghost}</div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: 26, position: 'relative', zIndex: 2 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 42, letterSpacing: '-1px', marginTop: 12 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.1em', textTransform: 'uppercase',
            color: C.inkMut, textAlign: 'right', paddingBottom: 4 }}>{renderSwText(p.caption)}</div>
        </div>

        {/* bars */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', zIndex: 2 }}>
          {/* axis gridlines */}
          {p.showAxis && (
            <div style={{ position: 'absolute', inset: '0 0 26px 286px', pointerEvents: 'none' }}>
              {ticks.map((t) => (
                <div key={t} style={{ position: 'absolute', top: 0, bottom: 0, left: (t * 100) + '%',
                  borderLeft: '1px dashed ' + (t === 0 ? C.line2 : C.line) }} />
              ))}
            </div>
          )}

          {rows.map((r, i) => {
            const on = p.focus && (i + 1) === p.focusIndex;
            const dim = p.focus && !on;
            const color = on ? accent : (i === 0 && !p.focus ? accent : swSeriesColors[(i + 1) % swSeriesColors.length]);
            return (
              <div key={r.cn} style={{ flex: 1, display: 'grid', gridTemplateColumns: '286px 1fr', alignItems: 'center',
                gap: 0, opacity: dim ? 0.4 : 1, transition: 'opacity .2s' }}>
                {/* label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingRight: 24 }}>
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.inkMut,
                    width: 34, flex: '0 0 auto' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: '-.3px', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.cn}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.1em', textTransform: 'uppercase',
                      color: C.inkMut }}>{r.en}</div>
                  </div>
                </div>
                {/* bar */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: ((r.v / max) * 100) + '%', height: 34, borderRadius: 8,
                    background: color, minWidth: 8, transition: 'width .3s' }} />
                  {p.showValue && (
                    <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-.5px',
                      color: on ? accent : C.ink, fontVariantNumeric: 'tabular-nums' }}>{r.share}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
