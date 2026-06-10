// SwSlideRoadmap.jsx — "路线图 / Roadmap" swimlane planning page.
//
// Parallel horizontal lanes (workstreams) crossing a quarter grid, each lane
// carrying pill bars that span the quarters a piece of work occupies, plus
// diamond milestone markers. Distinct from Timeline (single dated line) and
// Calendar (month grid). Lane count (2–4), quarter count (4–6), milestones, a
// focused lane and accent are props-controlled, 1:1 with `controls`; all visible
// copy/data defaults live in `defaultProps`. No deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'roadmap', index: 32, label: '路线图 / Roadmap' };

export const defaultProps = {
  accent: C.cyan,
  laneCount: 3,            // 2–4 lanes
  quarterCount: 4,         // 4–6 columns
  focus: false,
  focusIndex: 1,           // 1-based lane to emphasise
  showMilestones: true,
  // —— content ——
  barMeta: '32 — Roadmap',
  kicker: '路线图 / Roadmap',
  title: '未来四季，[[齐头并进]]。',
  nowLabel: '当前 NOW',
  nowCol: 1,
  quarters: ['26·Q1', '26·Q2', '26·Q3', '26·Q4', '27·Q1', '27·Q2'],
  // each lane: colour + bars {s,e} (0-based quarter) + milestone quarter `ms`
  lanes: [
    { t: '平台 Platform', s: 'CORE', c: '#3bb6ec',
      bars: [{ s: 0, e: 1, t: '结算引擎 2.0' }, { s: 2, e: 3, t: '开放 API' }], ms: 1 },
    { t: '创作者 Creators', s: 'GROWTH', c: '#f15a29',
      bars: [{ s: 0, e: 0, t: '入驻自助化' }, { s: 1, e: 3, t: '万人扶持计划' }], ms: 3 },
    { t: '版权 Rights', s: 'TRUST', c: '#1f6b2a',
      bars: [{ s: 1, e: 2, t: '链上存证' }, { s: 3, e: 4, t: '全球清算' }], ms: 4 },
    { t: '生态 Ecosystem', s: 'REACH', c: '#c44ee0',
      bars: [{ s: 0, e: 2, t: '30+ 平台同步' }, { s: 3, e: 5, t: '海外发行' }], ms: 5 },
  ],
  page: '32',
  total: '82',
};

export const controls = [
  { key: 'laneCount', label: '泳道数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '并行工作线（泳道）的数量' },
  { key: 'quarterCount', label: '季度列数', type: 'slider', def: 4, min: 4, max: 6, step: 1,
    desc: '时间轴上的季度列数' },
  { key: 'focus', label: '聚焦泳道', type: 'toggle', def: false, desc: '突出其中一条泳道，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几条', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'focus', desc: '高亮的泳道序号' },
  { key: 'showMilestones', label: '里程碑', type: 'toggle', def: true, desc: '显示/隐藏菱形里程碑标记' },
  { key: 'accent', label: '强调色', type: 'color', def: C.cyan,
    options: [C.cyan, C.orange, C.purple, C.green], desc: '当前季度 / 导语 / 页脚强调色' },
];

export default function SwSlideRoadmap(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const lanes = Math.max(2, Math.min(4, p.laneCount));
  const qn = Math.max(4, Math.min(6, p.quarterCount));
  const data = (p.lanes || []).slice(0, lanes);
  const qs = (p.quarters || []).slice(0, qn);
  const fi = p.focus ? Math.max(1, Math.min(lanes, p.focusIndex)) - 1 : -1;
  const nowCol = p.nowCol; // current quarter index, highlighted

  const labelW = 230;
  const cell = 'minmax(0, 1fr)';

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, marginTop: 22, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 30 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 12 }}>
            {renderSwText(p.title, { hl: { tone: 'c' } })}
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase',
          color: C.inkMut, textAlign: 'right', paddingBottom: 6 }}>
          {lanes} lanes · {qn} quarters
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: 'flex', flexDirection: 'column' }}>
        {/* quarter header */}
        <div style={{ display: 'grid', gridTemplateColumns: labelW + 'px repeat(' + qn + ',' + cell + ')',
          gap: 12, marginBottom: 12 }}>
          <div />
          {qs.map((q, i) => (
            <div key={q} style={{ textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22,
              letterSpacing: '.08em', color: i === nowCol ? accent : C.inkMut,
              padding: '8px 0', borderRadius: 8,
              background: i === nowCol ? 'rgba(0,0,0,0)' : 'transparent' }}>
              {q}{i === nowCol && <div style={{ fontSize: 15, letterSpacing: '.16em', marginTop: 2 }}>{p.nowLabel}</div>}
            </div>
          ))}
        </div>

        {/* lanes */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'repeat(' + lanes + ', 1fr)', gap: 16 }}>
          {data.map((lane, li) => {
            const on = fi === -1 || fi === li;
            return (
              <div key={lane.t} style={{ display: 'grid',
                gridTemplateColumns: labelW + 'px repeat(' + qn + ',' + cell + ')', gap: 12,
                alignItems: 'stretch', opacity: on ? 1 : 0.34, transition: 'opacity .2s' }}>
                {/* lane label */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  paddingRight: 10, borderRight: '3px solid ' + lane.c }}>
                  <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-.4px' }}>{lane.t}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.16em', color: lane.c,
                    marginTop: 2 }}>{lane.s}</div>
                </div>

                {/* track grid cell wrapper holding bars across columns */}
                <div style={{ gridColumn: '2 / span ' + qn, position: 'relative' }}>
                  {/* column guides + now highlight */}
                  <div style={{ position: 'absolute', inset: 0, display: 'grid',
                    gridTemplateColumns: 'repeat(' + qn + ',' + cell + ')', gap: 12 }}>
                    {qs.map((q, ci) => (
                      <div key={q} style={{ borderRadius: 10,
                        background: ci === nowCol ? 'rgba(59,182,236,.08)' : 'rgba(27,21,24,.035)' }} />
                    ))}
                  </div>
                  {/* bars */}
                  <div style={{ position: 'absolute', inset: 0, display: 'grid',
                    gridTemplateColumns: 'repeat(' + qn + ',' + cell + ')', gap: 12,
                    alignContent: 'center', rowGap: 8 }}>
                    {lane.bars.filter((b) => b.s < qn).map((b, bi) => {
                      const end = Math.min(b.e, qn - 1);
                      return (
                        <div key={bi} style={{ gridColumn: (b.s + 1) + ' / ' + (end + 2),
                          gridRow: bi + 1, background: lane.c, color: '#fff', borderRadius: 999,
                          padding: '12px 22px', fontWeight: 700, fontSize: 22, letterSpacing: '-.2px',
                          display: 'flex', alignItems: 'center', minWidth: 0,
                          boxShadow: '0 8px 20px ' + lane.c + '44' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.t}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* milestone diamond */}
                  {p.showMilestones && lane.ms < qn && (
                    <div style={{ position: 'absolute', top: -2, bottom: -2,
                      left: 'calc(' + ((lane.ms + 1) / qn) * 100 + '% - 11px)',
                      display: 'flex', alignItems: 'center', zIndex: 3 }}>
                      <span style={{ width: 22, height: 22, background: C.ink, transform: 'rotate(45deg)',
                        border: '3px solid ' + C.blush, boxShadow: '0 2px 8px rgba(0,0,0,.3)' }} />
                    </div>
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
