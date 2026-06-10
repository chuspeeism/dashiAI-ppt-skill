// SwSlidePyramid.jsx — "受众分层 / Pyramid" mirrored-bar chart page.
//
// Tiers stacked around a central axis with bars mirrored left/right to compare
// two audience segments per tier (a population-pyramid form) — distinct from
// the tapering Funnel and the horizontal Ranking. Tier count (4–6), value
// labels, a focus tier and accent are props-controlled and map 1:1 to
// `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no runtime host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'pyramid', index: 54, label: '受众分层 / Pyramid' };

export const defaultProps = {
  accent: C.orange,
  tierCount: 5,            // 4–6 tiers
  showValues: true,        // % label on each bar
  showAxis: false,         // center axis line
  focus: true,             // highlight one tier
  focusIndex: 2,           // 1-based, from top
  // —— content ——
  barMeta: '54 — Pyramid',
  kicker: '受众分层 / Audience',
  title: '线上线下，[[同一批人]]。',
  legendLeft: { t: '线上听众', e: 'Online' },
  legendRight: { t: '现场观众', e: 'Live' },
  ageUnit: '岁',
  tiers: [
    { age: '18–24', l: 32, r: 24 },
    { age: '25–30', l: 28, r: 30 },
    { age: '31–36', l: 19, r: 22 },
    { age: '37–42', l: 12, r: 15 },
    { age: '43–50', l: 6, r: 7 },
    { age: '50+', l: 3, r: 2 },
  ],
  page: '54',
  total: '82',
};

export const controls = [
  { key: 'tierCount', label: '分层数量', type: 'slider', def: 5, min: 4, max: 6, step: 1,
    desc: '受众年龄分层的数量' },
  { key: 'showValues', label: '数值标签', type: 'toggle', def: true, desc: '显示/隐藏每条占比数值' },
  { key: 'showAxis', label: '中轴线', type: 'toggle', def: false, desc: '显示/隐藏中央分隔轴' },
  { key: 'focus', label: '高亮某层', type: 'toggle', def: true, desc: '高亮某一分层、弱化其余' },
  { key: 'focusIndex', label: '高亮第几层', type: 'slider', def: 2, min: 1, max: 6, step: 1,
    dependsOn: 'focus', desc: '被高亮分层的序号（自上而下，1 起）' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '左列 / 高亮 / 页脚强调色' },
];

export default function SwSlidePyramid(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const n = Math.max(4, Math.min(6, p.tierCount));
  const tiers = (p.tiers || []).slice(0, n);
  const max = Math.max(...tiers.flatMap((t) => [t.l, t.r]));
  const rightColor = accent === C.cyan ? C.purple : C.cyan;

  const HalfBar = ({ v, color, side, on }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: side === 'l' ? 'flex-end' : 'flex-start',
      minWidth: 0, gap: 14 }}>
      {side === 'l' && p.showValues && (
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: on ? color : C.inkMut,
          fontVariantNumeric: 'tabular-nums' }}>{v}%</span>
      )}
      <div style={{ width: (v / max * 100) + '%', height: 38, background: color,
        borderRadius: side === 'l' ? '10px 0 0 10px' : '0 10px 10px 0',
        boxShadow: on ? '0 4px 12px ' + color + '44' : 'none' }} />
      {side === 'r' && p.showValues && (
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: on ? color : C.inkMut,
          fontVariantNumeric: 'tabular-nums' }}>{v}%</span>
      )}
    </div>
  );

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '40px 54px 36px', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40,
          marginBottom: 24 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 14 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 28, paddingBottom: 4 }}>
            {[{ c: accent, t: p.legendLeft.t, e: p.legendLeft.e }, { c: rightColor, t: p.legendRight.t, e: p.legendRight.e }].map((s) => (
              <div key={s.e} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 14, borderRadius: 4, background: s.c }} />
                <span style={{ fontSize: 22, fontWeight: 700 }}>{s.t}</span>
                <span style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '.08em', textTransform: 'uppercase',
                  color: C.inkMut }}>{s.e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* pyramid */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-around' }}>
          {p.showAxis && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2,
              background: C.line2, transform: 'translateX(-50%)' }} />
          )}
          {tiers.map((t, i) => {
            const on = !p.focus || (i + 1) === p.focusIndex;
            const lc = (p.focus && (i + 1) === p.focusIndex) ? accent : (accent + 'cc');
            const rc = (p.focus && (i + 1) === p.focusIndex) ? rightColor : (rightColor + 'cc');
            return (
              <div key={t.age} style={{ display: 'grid', gridTemplateColumns: '1fr 116px 1fr', alignItems: 'center',
                opacity: on ? 1 : 0.4, transition: 'opacity .2s', position: 'relative', zIndex: 1 }}>
                <HalfBar v={t.l} color={lc} side="l" on={on} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26,
                    color: on && p.focus ? accent : C.ink }}>{t.age}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: C.inkMut, marginTop: 2 }}>{p.ageUnit}</div>
                </div>
                <HalfBar v={t.r} color={rc} side="r" on={on} />
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
