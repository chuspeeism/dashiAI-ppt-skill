// SwSlideBullet.jsx — "子弹图 / Bullet" target-vs-actual KPI chart.
//
// A column of bullet charts: each KPI has a qualitative band track, a measure
// bar (accent) and a target tick. Distinct from Gauges (radial dials), Ranking
// (sorted bars) and Scoreboard (number tiles). Row count (3–5), the bands, the
// target marker, a focused row and accent are props-controlled, 1:1 with
// `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'bullet', index: 53, label: '子弹图 / Bullet' };

export const defaultProps = {
  accent: C.green,
  rowCount: 4,             // 3–5 KPIs
  showBands: true,
  showTarget: true,
  focus: false,
  focusIndex: 1,           // 1-based
  // —— content ——
  barMeta: '53 — Bullet',
  kicker: '子弹图 / Bullet',
  title: '目标对账，[[一条看清]]。',
  legendDone: '达成',
  legendTarget: '目标',
  hitLabel: '达标',
  missLabel: '追赶中',
  // value & target on a 0–100 scale; disp is display only
  kpis: [
    { t: '版税到账速度', s: 'Payout speed', v: 88, target: 75, disp: '72h', good: true },
    { t: '创作者留存率', s: 'Retention', v: 81, target: 80, disp: '81%', good: true },
    { t: '全球分发覆盖', s: 'Distribution', v: 72, target: 85, disp: '30+', good: false },
    { t: '版税透明度', s: 'Transparency', v: 95, target: 70, disp: '100%', good: true },
    { t: '客服响应', s: 'Support SLA', v: 64, target: 75, disp: '4.2h', good: false },
  ],
  page: '53',
  total: '82',
};

export const controls = [
  { key: 'rowCount', label: '指标数量', type: 'slider', def: 4, min: 3, max: 5, step: 1,
    desc: '子弹图的指标行数' },
  { key: 'showBands', label: '区间底色', type: 'toggle', def: true, desc: '显示/隐藏差/中/好的区间底色' },
  { key: 'showTarget', label: '目标刻度', type: 'toggle', def: true, desc: '显示/隐藏目标值竖线' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: false, desc: '突出其中一行，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几行', type: 'slider', def: 1, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '高亮的指标行序号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.green,
    options: [C.green, C.orange, C.cyan, C.purple], desc: '达成条 / 导语 / 页脚强调色' },
];

export default function SwSlideBullet(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.rowCount));
  const data = (p.kpis || []).slice(0, count);
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;

  return (
    <SlideRoot bg={C.dark} color={C.blush}>
      <Bar meta={p.barMeta} accent={accent} dark />

      <div style={{ flexShrink: 0, marginTop: 20, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 40 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 12 }}>
            {renderSwText(p.title, { hl: { tone: 'g' } })}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center', fontFamily: F.mono, fontSize: 19,
          letterSpacing: '.08em', color: 'rgba(245,225,227,.7)', paddingBottom: 6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 10, borderRadius: 3, background: accent }} />{p.legendDone}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 3, height: 18, background: '#fff' }} />{p.legendTarget}</span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: 'grid',
        gridTemplateRows: 'repeat(' + count + ', 1fr)', gap: 14 }}>
        {data.map((kpi, i) => {
          const on = fi === -1 || fi === i;
          const hit = kpi.v >= kpi.target;
          return (
            <div key={kpi.t} style={{ display: 'grid', gridTemplateColumns: '320px 1fr 120px', gap: 24,
              alignItems: 'center', opacity: on ? 1 : 0.4, transition: 'opacity .2s' }}>
              {/* label */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: '-.3px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kpi.t}</div>
                <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '.12em', textTransform: 'uppercase',
                  color: 'rgba(245,225,227,.5)' }}>{kpi.s}</div>
              </div>
              {/* bullet track */}
              <div style={{ position: 'relative', height: 34, borderRadius: 8, overflow: 'hidden',
                background: p.showBands ? 'transparent' : 'rgba(245,225,227,.1)' }}>
                {p.showBands && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                    <div style={{ width: '50%', background: 'rgba(245,225,227,.07)' }} />
                    <div style={{ width: '30%', background: 'rgba(245,225,227,.13)' }} />
                    <div style={{ width: '20%', background: 'rgba(245,225,227,.2)' }} />
                  </div>
                )}
                {/* measure bar */}
                <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)',
                  height: 16, width: kpi.v + '%', borderRadius: 6,
                  background: fi === i ? accent : (hit ? accent : C.orange) }} />
                {/* target tick */}
                {p.showTarget && (
                  <div style={{ position: 'absolute', top: 4, bottom: 4, left: kpi.target + '%', width: 3,
                    background: '#fff', borderRadius: 2 }} />
                )}
              </div>
              {/* value */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-.5px',
                  color: hit ? accent : C.orange }}>{kpi.disp}</div>
                <div style={{ fontFamily: F.mono, fontSize: 15, color: 'rgba(245,225,227,.5)' }}>{hit ? p.hitLabel : p.missLabel}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark />
    </SlideRoot>
  );
}
