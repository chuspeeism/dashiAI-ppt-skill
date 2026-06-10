// SwSlideTable.jsx — comparison "表格" page.
//
// A props-driven comparison matrix: feature rows × plan columns. Counts,
// highlighted column, zebra striping and accent are all controlled and map
// 1:1 to `controls`; all visible copy/data defaults live in `defaultProps`.
// Cell values are fixed text (true → check, false → dash,
// string → literal). No global side effects, no runtime host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'table', index: 28, label: '表格 / Compare' };

export const defaultProps = {
  accent: C.orange,
  columnCount: 3,          // number of plan columns (2–4)
  rowCount: 6,             // number of feature rows (3–6)
  highlight: true,         // emphasise one column
  highlightIndex: 1,       // which plan column (1-based)
  zebra: true,             // striped rows
  showLede: true,
  // —— content ——
  barMeta: '28 — Compare',
  lede: '同样一首歌，[[在声浪]]能多拿回多少？',
  featureLabel: '对比维度 / Feature',
  plans: [
    { name: '声浪', en: 'SoundWave' },
    { name: '传统发行', en: 'Label / Distro' },
    { name: '独立 DIY', en: 'Self-managed' },
    { name: '平台直营', en: 'Platform' },
  ],
  // Each row: label + values aligned to plans order.
  rows: [
    { cn: '平台分成', en: 'Commission', vals: ['0–15%', '15–30%', '0%', '30–45%'] },
    { cn: '版税到账', en: 'Payout', vals: ['72 小时', '按季度', '不定', '按月'] },
    { cn: '版权登记', en: 'Rights', vals: [true, false, false, true] },
    { cn: '粉丝数据', en: 'Audience', vals: [true, '部分', false, '部分'] },
    { cn: '盗用监测', en: 'Monitoring', vals: [true, false, false, true] },
    { cn: '一键多平台', en: 'Distribution', vals: [true, true, false, true] },
  ],
  page: '28',
  total: '82',
};

export const controls = [
  { key: 'columnCount', label: '对比列数', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '参与对比的方案列数' },
  { key: 'rowCount', label: '对比项数', type: 'slider', def: 6, min: 3, max: 6, step: 1,
    desc: '展示的对比维度行数' },
  { key: 'highlight', label: '高亮某列', type: 'toggle', def: true, desc: '突出显示某一方案列' },
  { key: 'highlightIndex', label: '高亮第几列', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'highlight', desc: '被突出列的序号（1 起）' },
  { key: 'zebra', label: '斑马纹', type: 'toggle', def: true, desc: '行间隔底色，便于横向阅读' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏表格上方说明句' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '高亮列 / 对勾 / 页脚强调色' },
];

function Cell({ v, on, accent }) {
  const mark = (ok) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 30, height: 30, borderRadius: '50%',
      background: ok ? (on ? accent : 'rgba(31,107,42,.12)') : 'transparent',
      color: ok ? (on ? '#fff' : C.green) : 'rgba(27,21,24,.32)',
      fontFamily: F.mono, fontWeight: 700, fontSize: 19 }}>{ok ? '✓' : '—'}</span>
  );
  if (v === true) return mark(true);
  if (v === false) return mark(false);
  return (
    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 25,
      color: on ? accent : '#2c2528' }}>{v}</span>
  );
}

export default function SwSlideTable(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const cols = Math.max(2, Math.min(4, p.columnCount));
  const rows = Math.max(3, Math.min(6, p.rowCount));
  const hi = p.highlight ? Math.max(1, Math.min(cols, p.highlightIndex)) : 0;

  const plans = (p.plans || []).slice(0, cols);
  const data = (p.rows || []).slice(0, rows);
  const grid = '1.3fr ' + 'repeat(' + cols + ',1fr)';

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '40px 48px 44px', display: 'flex', flexDirection: 'column' }}>

        {p.showLede && (
          <p style={{ fontWeight: 900, fontSize: 38, lineHeight: 1.3, letterSpacing: '-.5px',
            marginBottom: 26, maxWidth: 1320 }}>
            {renderSwText(p.lede, { hl: { tone: 'o' } })}
          </p>
        )}

        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: grid, alignItems: 'end',
          borderBottom: '2px solid ' + C.line2, paddingBottom: 16 }}>
          <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.12em',
            textTransform: 'uppercase', color: C.inkMut }}>{p.featureLabel}</div>
          {plans.map((pl, c) => {
            const on = (c + 1) === hi;
            return (
              <div key={pl.en} style={{ textAlign: 'center', padding: '0 6px' }}>
                <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-.5px',
                  color: on ? accent : C.ink }}>{pl.name}</div>
                <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.08em',
                  textTransform: 'uppercase', color: C.inkMut, marginTop: 5 }}>{pl.en}</div>
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {data.map((r, ri) => (
            <div key={r.en} style={{ flex: 1, display: 'grid', gridTemplateColumns: grid,
              alignItems: 'center', borderBottom: ri < data.length - 1 ? '1px solid ' + C.line : 'none',
              background: p.zebra && ri % 2 ? 'rgba(27,21,24,.028)' : 'transparent' }}>
              <div style={{ paddingLeft: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 27, letterSpacing: '-.3px' }}>{r.cn}</span>
                <span style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.08em',
                  textTransform: 'uppercase', color: C.inkMut, marginLeft: 12 }}>{r.en}</span>
              </div>
              {plans.map((pl, c) => {
                const on = (c + 1) === hi;
                return (
                  <div key={pl.en} style={{ height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    background: on ? (accent === C.orange ? 'rgba(241,90,41,.07)' : 'rgba(27,21,24,.04)') : 'transparent',
                    borderLeft: on ? '2px solid ' + accent : '1px solid transparent',
                    borderRight: on ? '2px solid ' + accent : '1px solid transparent' }}>
                    <Cell v={r.vals[c]} on={on} accent={accent} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
