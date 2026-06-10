// SwSlideDirectory.jsx — "名录榜 / Directory" artist roster table.
//
// A ranked roster: monogram avatar, name, genre tag, city and a streams metric
// with an inline bar per row. Distinct from Table (generic compare grid) and
// Ranking (pure bars). Row count (4–7), rank numerals, the metric bar, a focused
// row and accent are props-controlled, 1:1 with `controls`; all visible copy/data
// defaults live in `defaultProps`. No deps.

import React from 'react';
import { swTheme, swSeriesColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'directory', index: 30, label: '名录榜 / Directory' };

export const defaultProps = {
  accent: C.cyan,
  rowCount: 6,             // 4–7 rows
  showRank: true,
  showBar: true,
  focus: false,
  focusIndex: 1,           // 1-based
  // —— content ——
  barMeta: '30 — Directory',
  kicker: '名录榜 / Directory',
  title: '本季[[领跑]]的声音。',
  metaLine: 'Q2 2026 · TOP',
  colArtist: '音乐人 ARTIST',
  colGenre: '风格 GENRE',
  colCity: '城市 CITY',
  colStreams: '月播放量 STREAMS',
  artists: [
    { m: '林', n: '林夏', g: '独立流行', city: '上海', v: 1.0, s: '8.4M' },
    { m: 'A', n: '阿特拉斯乐队', g: '后摇', city: '成都', v: 0.82, s: '6.9M' },
    { m: 'M', n: 'Mira K.', g: '电子', city: '柏林', v: 0.74, s: '6.2M' },
    { m: '周', n: '老周厂牌', g: '说唱', city: '北京', v: 0.63, s: '5.3M' },
    { m: '电', n: '午夜电台', g: '合成器流行', city: '广州', v: 0.55, s: '4.6M' },
    { m: '盐', n: '盐与光', g: '民谣', city: '杭州', v: 0.41, s: '3.4M' },
    { m: '潮', n: '潮汐计划', g: '氛围', city: '重庆', v: 0.33, s: '2.8M' },
  ],
  page: '30',
  total: '82',
};

export const controls = [
  { key: 'rowCount', label: '名录行数', type: 'slider', def: 6, min: 4, max: 7, step: 1,
    desc: '名录中展示的音乐人数量' },
  { key: 'showRank', label: '排名序号', type: 'toggle', def: true, desc: '显示/隐藏左侧排名序号' },
  { key: 'showBar', label: '播放量条', type: 'toggle', def: true, desc: '显示/隐藏播放量内联条形' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: false, desc: '突出其中一行，其余常态' },
  { key: 'focusIndex', label: '聚焦第几行', type: 'slider', def: 1, min: 1, max: 7, step: 1,
    dependsOn: 'focus', desc: '高亮的行序号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.cyan,
    options: [C.cyan, C.orange, C.purple, C.green], desc: '聚焦行 / 导语 / 页脚强调色' },
];

export default function SwSlideDirectory(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(4, Math.min(7, p.rowCount));
  const data = (p.artists || []).slice(0, count);
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;

  const grid = (p.showRank ? '56px ' : '') + '1.6fr 1fr 0.8fr 1.5fr';

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flexShrink: 0, marginTop: 20, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 40 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 12 }}>
            {renderSwText(p.title, { hl: { tone: 'c' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'rgba(245,225,227,.6)', textAlign: 'right', paddingBottom: 6 }}>
          {p.metaLine} {String(count).padStart(2, '0')}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 22, alignItems: 'center',
          padding: '0 18px 12px', fontFamily: F.mono, fontSize: 17, letterSpacing: '.14em',
          textTransform: 'uppercase', color: 'rgba(245,225,227,.5)',
          borderBottom: '1px solid ' + C.lineD2 }}>
          {p.showRank && <span>#</span>}
          <span>{p.colArtist}</span>
          <span>{p.colGenre}</span>
          <span>{p.colCity}</span>
          <span style={{ textAlign: 'right' }}>{p.colStreams}</span>
        </div>

        {/* rows */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'repeat(' + count + ', 1fr)' }}>
          {data.map((a, i) => {
            const on = fi === -1 || fi === i;
            const col = swSeriesColors[i % swSeriesColors.length];
            const hot = fi === i;
            return (
              <div key={a.n} style={{ display: 'grid', gridTemplateColumns: grid, gap: 22, alignItems: 'center',
                padding: '0 18px', borderBottom: '1px solid rgba(245,225,227,.1)',
                background: hot ? accent : 'transparent', borderRadius: hot ? 14 : 0,
                color: hot ? '#06222e' : C.blush, opacity: on ? 1 : 0.5 }}>
                {p.showRank && (
                  <span style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-1px',
                    color: hot ? '#06222e' : (i === 0 ? accent : 'rgba(245,225,227,.5)') }}>{String(i + 1).padStart(2, '0')}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: hot ? 'rgba(6,34,46,.18)' : col, color: '#fff', fontWeight: 900, fontSize: 20 }}>{a.m}</span>
                  <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: '-.3px', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.n}</span>
                </div>
                <span>
                  <span style={{ fontFamily: F.mono, fontSize: 19, padding: '4px 12px', borderRadius: 999,
                    border: '1px solid ' + (hot ? 'rgba(6,34,46,.3)' : 'rgba(245,225,227,.3)'),
                    color: hot ? '#06222e' : 'rgba(245,225,227,.85)' }}>{a.g}</span>
                </span>
                <span style={{ fontSize: 23, color: hot ? '#06222e' : 'rgba(245,225,227,.85)' }}>{a.city}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end' }}>
                  {p.showBar && (
                    <div style={{ flex: 1, maxWidth: 180, height: 8, borderRadius: 999,
                      background: hot ? 'rgba(6,34,46,.18)' : 'rgba(245,225,227,.12)' }}>
                      <div style={{ width: (a.v * 100) + '%', height: '100%', borderRadius: 999,
                        background: hot ? '#06222e' : col }} />
                    </div>
                  )}
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, minWidth: 76,
                    textAlign: 'right', color: hot ? '#06222e' : C.blush }}>{a.s}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
