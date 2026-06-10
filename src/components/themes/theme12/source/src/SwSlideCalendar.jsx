// SwSlideCalendar.jsx — "发布排期 / Schedule" month-grid table page.
//
// A single-month calendar where a handful of release dates carry labelled
// events, with a matching legend — a scheduling table distinct from the
// comparison Table and the linear Timeline. Event count, weekday header,
// legend, today marker and accent are props-controlled and map 1:1 to
// `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no runtime host dependency.

import React from 'react';
import { swTheme, swStatColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'calendar', index: 31, label: '发布排期 / Schedule' };

export const defaultProps = {
  accent: C.orange,
  eventCount: 4,           // 1–5 highlighted release dates
  showWeekdays: true,      // weekday header row
  showLegend: true,        // legend of event types
  markToday: true,         // ring on "today"
  // —— content / 结构 ——
  barMeta: '31 — Schedule',
  kicker: '发布排期 / Schedule',
  title: '一张图，看清[[整月节奏]]。',
  monthTitle: '2026 · 三月',
  monthSub: 'March · Release Plan',
  weekdays: ['一', '二', '三', '四', '五', '六', '日'],
  monthOffset: 2,          // first day weekday offset (0=Mon)
  monthDays: 31,
  today: 9,
  events: [
    { day: 5, cn: '预热单曲', en: 'Single', ci: 0 },
    { day: 12, cn: '专辑上线', en: 'Album drop', ci: 1 },
    { day: 18, cn: 'MV 首发', en: 'Music video', ci: 2 },
    { day: 23, cn: '巡演开票', en: 'Tour on-sale', ci: 3 },
    { day: 28, cn: '直播专场', en: 'Livestream', ci: 0 },
  ],
  page: '31',
  total: '82',
};

export const controls = [
  { key: 'eventCount', label: '排期数量', type: 'slider', def: 4, min: 1, max: 5, step: 1,
    desc: '日历上高亮的发布节点数量' },
  { key: 'showWeekdays', label: '星期表头', type: 'toggle', def: true, desc: '显示/隐藏星期表头行' },
  { key: 'showLegend', label: '图例', type: 'toggle', def: true, desc: '显示/隐藏右上角事件图例' },
  { key: 'markToday', label: '今日标记', type: 'toggle', def: true, desc: '在“今日”加圆环标记' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '主事件 / 今日 / 页脚强调色' },
];

export default function SwSlideCalendar(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const WEEK = p.weekdays;
  const OFFSET = p.monthOffset, DAYS = p.monthDays, TODAY = p.today;
  const ec = Math.max(1, Math.min(5, p.eventCount));
  const events = (p.events || []).slice(0, ec);
  const evMap = {};
  events.forEach((e, i) => { evMap[e.day] = { ...e, color: i === 0 ? accent : swStatColors[e.ci % swStatColors.length] }; });

  const cells = [];
  for (let i = 0; i < OFFSET; i++) cells.push(null);
  for (let d = 1; d <= DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = cells.length / 7;

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '36px 44px 34px', display: 'flex', flexDirection: 'column' }}>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30,
          marginBottom: 22 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 44, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 12 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-1px', lineHeight: 1 }}>{p.monthTitle}</div>
            <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.12em', textTransform: 'uppercase',
              color: C.inkMut, marginTop: 4 }}>{p.monthSub}</div>
          </div>
        </div>

        {/* legend */}
        {p.showLegend && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 26px', marginBottom: 16 }}>
            {events.map((e, i) => {
              const col = i === 0 ? accent : swStatColors[e.ci % swStatColors.length];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: col }} />
                  <span style={{ fontWeight: 700, fontSize: 21 }}>{e.cn}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '.06em', textTransform: 'uppercase',
                    color: C.inkMut }}>{String(e.day).padStart(2, '0')}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* weekday header */}
        {p.showWeekdays && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginBottom: 8 }}>
            {WEEK.map((w, i) => (
              <div key={w} style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.08em',
                color: i >= 5 ? accent : C.inkMut, fontWeight: 700, paddingLeft: 4 }}>{w}</div>
            ))}
          </div>
        )}

        {/* grid */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
          gridTemplateRows: 'repeat(' + rows + ',1fr)', gap: 8 }}>
          {cells.map((d, i) => {
            const ev = d ? evMap[d] : null;
            const today = p.markToday && d === TODAY;
            return (
              <div key={i} style={{ position: 'relative', minWidth: 0, borderRadius: 14, padding: '8px 10px',
                background: ev ? (ev.color === accent ? 'rgba(241,90,41,.10)' : 'rgba(27,21,24,.035)') : (d ? 'rgba(27,21,24,.022)' : 'transparent'),
                border: ev ? '2px solid ' + ev.color : '1px solid ' + (d ? C.line : 'transparent'),
                display: 'flex', flexDirection: 'column' }}>
                {d && (
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 21,
                    color: ev ? ev.color : C.ink, display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', width: 34, height: 34, marginLeft: -2,
                    borderRadius: '50%', border: today ? '2px solid ' + accent : 'none',
                    background: today ? accent : 'transparent', color: today ? '#fff' : (ev ? ev.color : C.ink) }}>
                    {String(d).padStart(2, '0')}
                  </span>
                )}
                {ev && (
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontWeight: 900, fontSize: 19, letterSpacing: '-.2px', lineHeight: 1.1,
                      color: C.ink }}>{ev.cn}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
                      color: C.inkMut, marginTop: 2 }}>{ev.en}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
