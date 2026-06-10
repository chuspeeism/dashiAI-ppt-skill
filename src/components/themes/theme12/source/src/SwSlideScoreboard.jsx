// SwSlideScoreboard.jsx — "记分牌 / Scoreboard" multi big-number page.
//
// A board of oversized metrics, each in its own saturated colour block with a
// delta chip and a tiny sparkline. Distinct from BigNumber (a single hero figure)
// and WhyNow (metrics on a dark panel). Stat count (2–4), columns (2|4), delta
// chips, sparklines, theme and accent are props-controlled, 1:1 with controls;
// all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'scoreboard', index: 60, label: '记分牌 / Scoreboard' };

export const defaultProps = {
  accent: C.orange,
  statCount: 4,            // 2–4 metrics
  columns: 2,              // 2 | 4
  showDelta: true,
  showSpark: true,
  showLede: true,
  // —— content ——
  barMeta: '60 — Scoreboard',
  kicker: '记分牌 / By The Numbers',
  title: '数字不会[[说谎]]。',
  lede: '一块只属于创作者的记分牌——发出去多少、回到谁手里，全摆在台面上。',
  stats: [
    { big: '¥2.4亿', unit: '累计版税发放', en: 'Royalties paid', delta: '+182%', up: true, spark: [10, 14, 13, 20, 26, 31, 40] },
    { big: '12,400', unit: '活跃独立音乐人', en: 'Active artists', delta: '+64%', up: true, spark: [8, 11, 15, 17, 22, 28, 33] },
    { big: '72h', unit: '平均结算时长', en: 'Avg payout time', delta: '−58%', up: false, spark: [40, 33, 28, 22, 18, 14, 12] },
    { big: '30+', unit: '一键分发平台', en: 'Distribution targets', delta: '+9', up: true, spark: [12, 14, 16, 19, 22, 26, 30] },
  ],
  page: '60',
  total: '82',
};

export const controls = [
  { key: 'statCount', label: '指标数量', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '记分牌上的大数字指标数量' },
  { key: 'columns', label: '栏数', type: 'segment', def: 2,
    options: [{ value: 2, label: '2 栏' }, { value: 4, label: '4 栏' }], desc: '指标块的排布列数' },
  { key: 'showDelta', label: '同比', type: 'toggle', def: true, desc: '显示/隐藏同比涨跌标记' },
  { key: 'showSpark', label: '迷你走势', type: 'toggle', def: true, desc: '显示/隐藏迷你趋势线' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语高亮 / 页脚强调色' },
];

function Spark({ pts, color }) {
  const max = Math.max(...pts), min = Math.min(...pts);
  const w = 150, h = 44;
  const d = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((pts[pts.length - 1] - min) / (max - min || 1)) * h} r="5" fill={color} />
    </svg>
  );
}

export default function SwSlideScoreboard(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.statCount));
  const cols = p.columns === 4 ? Math.min(4, count) : 2;
  const stats = (p.stats || []).slice(0, count);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>

        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 24px', display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: 40 }}>
            <div>
              <Kicker accent={accent}>{p.kicker}</Kicker>
              <h2 style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.04, letterSpacing: '-1.4px', marginTop: 14 }}>
                {renderSwText(p.title, { hl: { tone: 'o' } })}
              </h2>
            </div>
            <p style={{ fontSize: 24, lineHeight: 1.6, color: C.inkMut, maxWidth: 420, paddingBottom: 6 }}>
              {p.lede}
            </p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 20,
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridAutoRows: '1fr' }}>
          {stats.map((s, i) => {
            const pal = swCardPalette[i % swCardPalette.length];
            const sparkC = pal.deco[0];
            return (
              <div key={s.en} style={{ position: 'relative', overflow: 'hidden', borderRadius: 26,
                background: pal.bg, color: pal.body, padding: cols === 4 ? '30px 30px 28px' : '38px 42px 34px',
                display: 'flex', flexDirection: 'column' }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: -34, right: -8, fontFamily: F.mono,
                  fontWeight: 700, fontSize: 150, lineHeight: 0.8, color: 'transparent',
                  WebkitTextStroke: '2px ' + pal.name, opacity: .4, pointerEvents: 'none', zIndex: 0 }}>{String(i + 1).padStart(2, '0')}</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'relative', zIndex: 1 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.12em',
                    textTransform: 'uppercase', color: pal.sub }}>{s.en}</span>
                  {p.showDelta && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F.mono,
                      fontWeight: 700, fontSize: 21, padding: '5px 13px', borderRadius: 999,
                      background: pal.name, color: pal.bg }}>
                      <span>{s.up ? '▲' : '▼'}</span>{s.delta}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: cols === 4 ? 78 : 104, lineHeight: 0.96,
                    letterSpacing: '-3px', color: pal.title }}>{s.big}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginTop: 14 }}>
                    <div style={{ fontSize: cols === 4 ? 24 : 28, fontWeight: 700, color: pal.title }}>{s.unit}</div>
                    {p.showSpark && <Spark pts={s.spark} color={sparkC} />}
                  </div>
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
