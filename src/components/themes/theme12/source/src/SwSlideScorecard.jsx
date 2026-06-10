// SwSlideScorecard.jsx — "评分表 / Scorecard" decision rubric matrix.
//
// Criteria as rows, options as columns, each cell a 0–5 dot rating; the winning
// column (声浪) is highlighted and totals tallied. Distinct from Table (text
// grid), Matrix (2×2 map) and Pricing (plan tiers). Column count (2–4), row
// count (4–6), totals, the highlighted column and accent are props-controlled,
// 1:1 with `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'scorecard', index: 57, label: '评分表 / Scorecard' };

export const defaultProps = {
  accent: C.purple,
  columnCount: 3,          // 2–4 options
  rowCount: 5,             // 4–6 criteria
  focusIndex: 1,           // 1-based highlighted column
  showTotals: true,
  // —— content ——
  barMeta: '57 — Scorecard',
  kicker: '评分表 / Scorecard',
  title: '同台评分，[[高下立见]]。',
  dimensionLabel: '评估维度',
  totalLabel: '合计',
  cols: [
    { t: '声浪 OS', s: '一体化' },
    { t: '传统厂牌', s: '代理制' },
    { t: '自助平台', s: 'DIY' },
    { t: '经纪公司', s: '托管' },
  ],
  rows: [
    { t: '版税透明', s: 'Transparency', v: [5, 2, 3, 2] },
    { t: '到账速度', s: 'Payout speed', v: [5, 2, 4, 3] },
    { t: '全球分发', s: 'Distribution', v: [4, 3, 5, 3] },
    { t: '版权掌控', s: 'Ownership', v: [5, 1, 4, 2] },
    { t: '运营支持', s: 'Support', v: [4, 5, 2, 5] },
    { t: '综合费率', s: 'Fees', v: [5, 2, 4, 2] },
  ],
  page: '57',
  total: '82',
};

export const controls = [
  { key: 'columnCount', label: '方案数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '参与对比的方案（列）数量' },
  { key: 'rowCount', label: '评估维度', type: 'slider', def: 5, min: 4, max: 6, step: 1,
    desc: '评估维度（行）数量' },
  { key: 'focusIndex', label: '高亮方案', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    desc: '高亮强调的方案列' },
  { key: 'showTotals', label: '合计得分', type: 'toggle', def: true, desc: '显示/隐藏底部合计得分' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '高亮列 / 导语 / 页脚强调色' },
];

function Dots({ n, on, accent }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: 18, height: 18, borderRadius: '50%',
          background: i < n ? (on ? '#fff' : accent) : (on ? 'rgba(255,255,255,.28)' : 'rgba(27,21,24,.13)') }} />
      ))}
    </div>
  );
}

export default function SwSlideScorecard(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const cc = Math.max(2, Math.min(4, p.columnCount));
  const rc = Math.max(4, Math.min(6, p.rowCount));
  const cols = (p.cols || []).slice(0, cc);
  const rows = (p.rows || []).slice(0, rc);
  const hi = Math.max(1, Math.min(cc, p.focusIndex)) - 1;
  const totals = cols.map((_, c) => rows.reduce((s, r) => s + r.v[c], 0));
  const maxTotal = rc * 5;

  const grid = '1.5fr ' + cols.map(() => '1fr').join(' ');

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, marginTop: 18 }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 10 }}>
          {renderSwText(p.title, { hl: { tone: 'p' } })}
        </h2>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 20, background: C.paper, borderRadius: 28,
        padding: '12px 26px 18px', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 16, alignItems: 'end',
          padding: '14px 8px 14px', borderBottom: '2px solid rgba(27,21,24,.12)' }}>
          <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.14em', textTransform: 'uppercase',
            color: C.inkMut }}>{p.dimensionLabel}</div>
          {cols.map((c, i) => (
            <div key={c.t} style={{ textAlign: 'center', borderRadius: '12px 12px 0 0', padding: '8px 4px',
              background: i === hi ? accent : 'transparent', color: i === hi ? '#fff' : C.ink }}>
              <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-.4px' }}>{c.t}</div>
              <div style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '.1em',
                color: i === hi ? 'rgba(255,255,255,.8)' : C.inkMut }}>{c.s}</div>
            </div>
          ))}
        </div>

        {/* rows */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'repeat(' + rc + ', 1fr)' }}>
          {rows.map((r, ri) => (
            <div key={r.t} style={{ display: 'grid', gridTemplateColumns: grid, gap: 16, alignItems: 'center',
              padding: '0 8px', borderBottom: '1px solid rgba(27,21,24,.08)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: '-.3px' }}>{r.t}</div>
                <div style={{ fontFamily: F.mono, fontSize: 14, letterSpacing: '.1em', color: C.inkMut }}>{r.s}</div>
              </div>
              {cols.map((_, ci) => (
                <div key={ci} style={{ height: '78%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10, background: ci === hi ? accent : 'transparent' }}>
                  <Dots n={r.v[ci]} on={ci === hi} accent={accent} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* totals */}
        {p.showTotals && (
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 16, alignItems: 'center',
            padding: '14px 8px 6px', borderTop: '2px solid rgba(27,21,24,.12)' }}>
            <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.14em', textTransform: 'uppercase',
              color: C.inkMut }}>{p.totalLabel} / {maxTotal}</div>
            {cols.map((_, ci) => (
              <div key={ci} style={{ textAlign: 'center', borderRadius: '0 0 12px 12px', padding: '6px 4px',
                background: ci === hi ? accent : 'transparent', color: ci === hi ? '#fff' : C.ink }}>
                <span style={{ fontWeight: 900, fontSize: 38, letterSpacing: '-1px' }}>{totals[ci]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
