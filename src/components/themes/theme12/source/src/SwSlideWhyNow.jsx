// SwSlideWhyNow.jsx — Slide 03 (metrics / why now). Dark panel.
// All visible copy/data defaults live in `defaultProps`; layout/visibility
// props map 1:1 with `controls`.

import React from 'react';
import { swTheme, swStatColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'whynow', index: 39, label: '为什么是现在 / Why Now' };

export const defaultProps = {
  accent: C.orange,
  statCount: 4,
  chartType: 'number',
  focus: false,
  focusIndex: 1,
  showIntro: true,
  showArgument: true,
  // —— content（引文/论述中 **x** = 强调）——
  barMeta: '39 — Why Now',
  kicker: '为什么是现在',
  title: '独立发行的拐点，\n已经到来。',
  intro: '流媒体把听众带到每个人面前，却把分成层层稀释。当工具足够成熟、成本足够低，[[音乐人不必再让渡主动权]]——声浪要做的，是把这件事彻底变简单。',
  problemLabel: '现状 / The Problem',
  problemText: '作品散落在数个后台，版税要等一个季度，盗用难以追踪，听众数据握在平台手里。**你创造了价值，却看不清、也拿不全。**',
  fixLabel: '我们的解法 / The Fix',
  fixText: '一个入口管完发行、结算与版权，数据回到你手中，分账全程透明。**把复杂留给系统，把主动权留给你。**',
  stats: [
    { v: '30', u: '+', lb: 'Platforms', ds: '一次上传，同步触达全球平台。', pct: 0.86 },
    { v: '0', u: '%', lb: 'Commission', ds: '发行首季 90 天，0 分成。', pct: 0.04 },
    { v: '72', u: 'h', lb: 'Payout', ds: '版税最快三天到账。', pct: 0.6 },
    { v: '12', u: 'k+', lb: 'Artists', ds: '已入驻的音乐人与厂牌。', pct: 0.92 },
  ],
  page: '39',
  total: '82',
};

export const controls = [
  { key: 'statCount', label: '指标数量', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '展示的数据指标数量' },
  { key: 'chartType', label: '图表类型', type: 'segment', def: 'number',
    options: [{ value: 'number', label: '数字' }, { value: 'bar', label: '条形' }, { value: 'donut', label: '环形' }],
    desc: '每个指标的可视化形式' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: false, desc: '高亮某一指标，弱化其余' },
  { key: 'focusIndex', label: '强调第几个', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'focus', desc: '被强调指标的序号（1 起）' },
  { key: 'showIntro', label: '显示引言', type: 'toggle', def: true, desc: '显示/隐藏右上引言段落' },
  { key: 'showArgument', label: '显示论述', type: 'toggle', def: true, desc: '显示/隐藏底部现状/解法两栏' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语/页脚等强调色' },
];

function StatViz({ type, s, color }) {
  if (type === 'bar') {
    return (
      <div>
        <div style={{ fontWeight: 900, fontSize: 46, letterSpacing: '-1px', color }}>
          {s.v}<span style={{ fontSize: 26 }}>{s.u}</span>
        </div>
        <div style={{ marginTop: 14, height: 16, borderRadius: 999, background: 'rgba(245,225,227,.12)', overflow: 'hidden' }}>
          <div style={{ width: Math.max(6, s.pct * 100) + '%', height: '100%', background: color, borderRadius: 999 }} />
        </div>
      </div>
    );
  }
  if (type === 'donut') {
    return (
      <div style={{ width: 132, height: 132, borderRadius: '50%',
        background: 'conic-gradient(' + color + ' ' + (s.pct * 360) + 'deg, rgba(245,225,227,.12) 0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: C.dark, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 34, letterSpacing: '-1px', color }}>
          {s.v}<span style={{ fontSize: 20 }}>{s.u}</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ fontWeight: 900, fontSize: 74, lineHeight: 1, letterSpacing: '-2px', color }}>
      {s.v}<span style={{ fontSize: 36 }}>{s.u}</span>
    </div>
  );
}

export default function SwSlideWhyNow(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.statCount));
  const stats = (p.stats || []).slice(0, count);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.dark, color: C.blush, borderRadius: 38, margin: '24px 0 22px',
        padding: '46px 54px 44px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        <Shape kind="circle" size={140} color="rgba(196,78,224,.28)" style={{ top: -40, right: -40, zIndex: 0 }} />
        <Shape kind="ring" size={70} border={14} color="rgba(116,210,240,.4)" style={{ top: 64, right: 96, zIndex: 0 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'end', position: 'relative', zIndex: 1 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: T.h2, lineHeight: 1.08, letterSpacing: '-1.5px', marginTop: 18 }}>
              {renderSwText(p.title)}
            </h2>
          </div>
          {p.showIntro && (
            <p style={{ fontSize: T.body, lineHeight: 1.74, color: '#ddd5d2' }}>
              {renderSwText(p.intro, { hl: { tone: 'o' } })}
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + count + ',1fr)',
          borderTop: '1px solid ' + C.lineD2, marginTop: 34, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          {stats.map((s, i) => {
            const color = swStatColors[i % swStatColors.length];
            const dim = p.focus && (i + 1) !== p.focusIndex;
            return (
              <div key={s.lb} style={{ padding: i === 0 ? '30px 24px 24px 0' : '30px 24px 24px 32px',
                borderLeft: i === 0 ? 'none' : '1px solid ' + C.lineD, opacity: dim ? 0.32 : 1,
                minHeight: 196, transition: 'opacity .2s' }}>
                <StatViz type={p.chartType} s={s} color={color} />
                <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase',
                  color: '#9a8f8c', marginTop: 16 }}>{s.lb}</div>
                <div style={{ fontSize: 24, lineHeight: 1.5, color: '#c8c0bd', marginTop: 9 }}>{s.ds}</div>
              </div>
            );
          })}
        </div>

        {p.showArgument && (
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
            alignContent: 'center', marginTop: 22, position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase',
                color: accent, marginBottom: 14 }}>{p.problemLabel}</div>
              <p style={{ fontSize: T.body, lineHeight: 1.7, color: '#ddd5d2' }}>
                {renderSwText(p.problemText, { strong: { color: '#fff' } })}
              </p>
            </div>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase',
                color: accent, marginBottom: 14 }}>{p.fixLabel}</div>
              <p style={{ fontSize: T.body, lineHeight: 1.7, color: '#ddd5d2' }}>
                {renderSwText(p.fixText, { strong: { color: '#fff' } })}
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={false} />
    </SlideRoot>
  );
}
