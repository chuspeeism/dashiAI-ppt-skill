// SwSlideChecklist.jsx — "特性矩阵 / Feature Matrix" comparison table.
//
// Rows are capabilities; columns are providers (声浪 highlighted as the owned
// column); each cell is a ✓ / partial / ✗ token rather than data. Distinct from
// Table (numeric data grid) and Contrast (two-column prose). Row count (4–7),
// competitor columns (2–3), the highlighted "own" column, the legend and accent
// are props-controlled, 1:1 with controls; all visible copy/data defaults live
// in `defaultProps`. No global side effects, no host
// dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'checklist', index: 34, label: '特性矩阵 / Feature Matrix' };

export const defaultProps = {
  accent: C.orange,
  rowCount: 6,             // 4–7 feature rows
  columnCount: 3,          // 2–3 competitor columns (besides 声浪)
  ownIndex: 1,             // which column is "声浪" (1-based, always first here)
  showLegend: true,
  showLede: true,
  // —— content ——
  barMeta: '34 — Feature Matrix',
  kicker: '横向对照 / Why SoundWave',
  title: '同一张清单，[[差距]]一目了然。',
  lede: '把分散在不同方案里的能力，摆进同一张表里——谁真的站在创作者这边。',
  capabilityLabel: '能力 / Capability',
  legendYes: '支持',
  legendPartial: '部分',
  legendNo: '不支持',
  cols: ['声浪 SoundWave', '传统厂牌', '聚合分发', '自建独立'],
  // rows[i].v = [own, rivalA, rivalB, rivalC]; 2=yes, 1=partial, 0=no
  rows: [
    { cn: '版税实时透明', en: 'Realtime royalties', v: [2, 0, 1, 0] },
    { cn: '听众数据归属创作者', en: 'Own your audience', v: [2, 0, 0, 1] },
    { cn: '一键全球分发', en: 'One-click distribution', v: [2, 1, 2, 0] },
    { cn: '版权监测与维权', en: 'Rights protection', v: [2, 2, 0, 0] },
    { cn: '0 抽成 · 0 中间商', en: 'No middlemen', v: [2, 0, 1, 2] },
    { cn: '协作自动分账', en: 'Automatic splits', v: [2, 1, 0, 0] },
    { cn: '可随时迁出', en: 'Export anytime', v: [2, 0, 1, 2] },
  ],
  page: '34',
  total: '82',
};

export const controls = [
  { key: 'rowCount', label: '特性行数', type: 'slider', def: 6, min: 4, max: 7, step: 1,
    desc: '对照的能力条目数量' },
  { key: 'columnCount', label: '对手列数', type: 'slider', def: 3, min: 2, max: 3, step: 1,
    desc: '除声浪外的对照列数量' },
  { key: 'showLegend', label: '显示图例', type: 'toggle', def: true, desc: '显示/隐藏底部符号图例' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '声浪列 / 高亮 / 页脚强调色' },
];

function Token({ kind, accent, own }) {
  if (kind === 2) {
    return (
      <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', background: own ? '#fff' : accent,
        color: own ? accent : '#fff', fontFamily: F.mono, fontWeight: 700, fontSize: 24 }}>✓</span>
    );
  }
  if (kind === 1) {
    return (
      <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        border: '2.5px solid ' + (own ? 'rgba(255,255,255,.6)' : C.line2),
        color: own ? 'rgba(255,255,255,.8)' : C.inkMut, fontFamily: F.mono, fontWeight: 700, fontSize: 22 }}>~</span>
    );
  }
  return (
    <span style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', color: own ? 'rgba(255,255,255,.5)' : 'rgba(27,21,24,.3)',
      fontFamily: F.mono, fontWeight: 700, fontSize: 24 }}>✕</span>
  );
}

export default function SwSlideChecklist(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const rivals = Math.max(2, Math.min(3, p.columnCount));
  const rows = (p.rows || []).slice(0, Math.max(4, Math.min(7, p.rowCount)));
  const cols = [p.cols[0], ...p.cols.slice(1, 1 + rivals)];
  const gridCols = '1.6fr repeat(' + (rivals + 1) + ', 1fr)';

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>

        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 22px', display: 'flex', alignItems: 'flex-end',
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

        {/* table */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          position: 'relative', borderRadius: 26, overflow: 'hidden', background: C.paper,
          border: '1px solid ' + C.line }}>

          {/* highlighted own-column backdrop */}
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, zIndex: 0,
            left: 'calc(1.6fr)', width: 0 }} />

          {/* header */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'stretch', flexShrink: 0 }}>
            <div style={{ padding: '24px 30px', display: 'flex', alignItems: 'flex-end',
              fontFamily: F.mono, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase', color: C.inkMut }}>{p.capabilityLabel}</div>
            {cols.map((c, ci) => {
              const own = ci === 0;
              return (
                <div key={c} style={{ padding: own ? '24px 18px 26px' : '24px 18px',
                  background: own ? accent : 'transparent', color: own ? '#fff' : C.ink,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  textAlign: 'center', gap: 4, borderTopLeftRadius: own ? 0 : 0 }}>
                  <span style={{ fontWeight: 900, fontSize: own ? 27 : 24, letterSpacing: '-.3px',
                    lineHeight: 1.1 }}>{c.split(' ')[0]}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.08em',
                    color: own ? 'rgba(255,255,255,.82)' : C.inkMut, textTransform: 'uppercase' }}>{c.split(' ').slice(1).join(' ') || '·'}</span>
                </div>
              );
            })}
          </div>

          {/* rows */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {rows.map((r, ri) => (
              <div key={r.en} style={{ flex: 1, display: 'grid', gridTemplateColumns: gridCols,
                alignItems: 'center', borderTop: '1px solid ' + C.line }}>
                <div style={{ padding: '0 30px', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 27, letterSpacing: '-.3px' }}>{r.cn}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.06em', color: C.inkMut,
                    textTransform: 'uppercase', marginTop: 2 }}>{r.en}</div>
                </div>
                {cols.map((_, ci) => {
                  const own = ci === 0;
                  return (
                    <div key={ci} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                      alignSelf: 'stretch', background: own ? accent : 'transparent' }}>
                      <Token kind={r.v[ci]} accent={accent} own={own} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {p.showLegend && (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 34, marginTop: 18,
            fontFamily: F.mono, fontSize: 20, letterSpacing: '.04em', color: C.inkMut }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <b style={{ width: 26, height: 26, borderRadius: '50%', background: accent, color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>✓</b> {p.legendYes}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <b style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid ' + C.line2, color: C.inkMut,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>~</b> {p.legendPartial}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <b style={{ width: 26, height: 26, display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 15, color: 'rgba(27,21,24,.3)' }}>✕</b> {p.legendNo}</span>
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
