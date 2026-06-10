// SwSlideFunnel.jsx — "转化漏斗 / Funnel" conversion-stage chart.
//
// Stacked trapezoid bands that narrow downward, one per funnel stage, each a
// saturated colour block carrying a value and a stage label, with step-to-step
// conversion rates on a side rail. Distinct from bars / line / pie / matrix /
// gauges. Stage count (3–5), conversion-rate chips, the focus stage, side notes
// and accent are props-controlled, 1:1 with controls; all visible copy/data
// defaults live in `defaultProps`. No global side effects,
// no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'funnel', index: 47, label: '转化漏斗 / Funnel' };

export const defaultProps = {
  accent: C.orange,
  stageCount: 4,           // 3–5 stages
  showRates: true,         // step conversion %
  focus: true,
  focusIndex: 4,           // highlighted stage (1-based)
  showNotes: true,         // right-rail copy
  // —— content ——
  barMeta: '47 — Funnel',
  kicker: '从听见到留下 / Funnel',
  title: '把路人，\n变成[[铁粉]]。',
  notes: '每往下一层，都是一次真实的选择。声浪把每一步的转化都摆给你看——知道粉丝在哪一环流失，才知道下一步该往哪使劲。',
  totalValue: '1.8%',
  totalLabel: '整体付费转化',
  stages: [
    { cn: '听到作品', en: 'Reached', v: '1,200,000', w: 100 },
    { cn: '点进主页', en: 'Visited', v: '384,000', w: 84 },
    { cn: '关注 / 收藏', en: 'Followed', v: '96,000', w: 68 },
    { cn: '付费支持', en: 'Paid', v: '21,500', w: 54 },
    { cn: '复购会员', en: 'Renewed', v: '8,900', w: 42 },
  ],
  rates: ['32%', '25%', '22%', '41%'],
  page: '47',
  total: '82',
};

export const controls = [
  { key: 'stageCount', label: '阶段数量', type: 'slider', def: 4, min: 3, max: 5, step: 1,
    desc: '漏斗的阶段数量' },
  { key: 'showRates', label: '转化率', type: 'toggle', def: true, desc: '显示/隐藏阶段间转化率' },
  { key: 'focus', label: '高亮阶段', type: 'toggle', def: true, desc: '高亮某个阶段、弱化其余' },
  { key: 'focusIndex', label: '高亮第几个', type: 'slider', def: 4, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '被高亮阶段的序号（1 起）' },
  { key: 'showNotes', label: '右侧说明', type: 'toggle', def: true, desc: '显示/隐藏右侧文字说明' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '末段 / 高亮 / 页脚强调色' },
];

export default function SwSlideFunnel(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.stageCount));
  const stages = (p.stages || []).slice(0, count);
  const RATES = p.rates;

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.32fr 0.68fr', gap: 56,
        alignItems: 'stretch', padding: '92px 0 84px', position: 'relative', zIndex: 3 }}>

        {/* funnel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'stretch', minWidth: 0 }}>
          {stages.map((s, i) => {
            const on = !p.focus || (i + 1) === p.focusIndex;
            const last = i === count - 1;
            const pal = swCardPalette[i % swCardPalette.length];
            const cardBg = (last || (p.focus && (i + 1) === p.focusIndex)) ? accent : pal.bg;
            const titleC = cardBg === accent ? '#fff' : pal.title;
            const subC = cardBg === accent ? 'rgba(255,255,255,.85)' : pal.sub;
            const valC = cardBg === accent ? '#fff' : pal.title;
            return (
              <div key={s.en} style={{ position: 'relative', width: s.w + '%', margin: '0 auto', minWidth: 0,
                flex: '1 1 0', minHeight: 0, display: 'flex',
                opacity: on ? 1 : 0.42, transition: 'opacity .2s' }}>
                <div style={{ flex: 1, minHeight: 0, clipPath: count > 1 ? 'polygon(2% 0, 98% 0, 94% 100%, 6% 100%)' : 'none',
                  background: cardBg, color: titleC, borderRadius: 12,
                  padding: '0 54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
                    <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-.4px', color: titleC,
                      whiteSpace: 'nowrap' }}>{s.cn}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.08em',
                      textTransform: 'uppercase', color: subC }}>{s.en}</span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: 29, letterSpacing: '-1px', color: valC,
                    fontVariantNumeric: 'tabular-nums', flexShrink: 0, whiteSpace: 'nowrap' }}>{s.v}</span>
                </div>
                {p.showRates && i < count - 1 && (
                  <div style={{ position: 'absolute', left: '50%', bottom: -9, transform: 'translate(-50%,50%)',
                    zIndex: 3, fontFamily: F.mono, fontWeight: 700, fontSize: 18, color: accent,
                    background: '#fff', border: '1.5px solid ' + accent, borderRadius: 999, padding: '2px 12px' }}>
                    ↓ {RATES[i]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* notes rail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0,
          borderLeft: '1px solid ' + C.line, paddingLeft: 40, position: 'relative' }}>
          <Shape kind="ring" size={64} border={13} color={accent} style={{ top: 18, right: 0, opacity: .9 }} />
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 48, lineHeight: 1.08, letterSpacing: '-1.2px', marginTop: 16 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
          {p.showNotes && (
            <p style={{ fontSize: 24, lineHeight: 1.66, color: '#5a4f54', marginTop: 22 }}>
              {p.notes}
            </p>
          )}
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontWeight: 900, fontSize: 60, letterSpacing: '-2px', color: accent }}>{p.totalValue}</span>
            <span style={{ fontSize: 23, color: '#5a4f54' }}>{p.totalLabel}</span>
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
