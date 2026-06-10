// SlideBubbleScatter.jsx — 市销率天梯 / valuation-to-revenue multiple ranking.
// (Re-planned from a valuation-vs-revenue bubble scatter, whose low-revenue
// companies crushed into one corner with colliding labels.) Each company is one
// horizontal bar whose length encodes its 估值/收入 倍数 (P/S multiple), sorted
// high→low. A dashed "20× 合理参考线" splits a red 泡沫区 (right) from a green
// 合理区 (left); bars running deep into the red literally show valuation running
// ahead of revenue, while CoreWeave's short bar stays grounded. Zero overlap by
// construction: one row per company, name/figures in a fixed left column, the
// multiple labelled at the bar's end. Migration-safe: default export +
// defaultProps + controls; props-only; `aip-` scope only.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '风险研判 · 估值 vs 收入',
  tone: 'red',
  title: '估值跑在收入前面',
  en: 'Valuation Outruns Revenue',
  cn: '市销率天梯 · 倍数越高，估值越悬空',
  refMultiple: 20,
  refLabel: '20× 合理参考',
  unit: '亿',
  items: [
    { name: 'OpenAI', sector: 'GEN-AI', val: 1570, rev: 37, tone: 'blue' },
    { name: 'Anthropic', sector: 'GEN-AI', val: 615, rev: 8, tone: 'violet' },
    { name: 'xAI', sector: 'GEN-AI', val: 500, rev: 2, tone: 'red' },
    { name: 'CoreWeave', sector: 'INFRA', val: 190, rev: 19, tone: 'green' },
    { name: 'Scale AI', sector: 'INFRA', val: 138, rev: 7, tone: 'amber' },
    { name: 'Perplexity', sector: 'APP', val: 90, rev: 1, tone: 'blue' },
  ],
  insightTitle: '泡沫信号',
  insight: '通用大模型集体悬于参考线之上，估值建立在「未来市值」；唯算力基础设施 CoreWeave 贴近合理区间。',
  caption: '市销率天梯 · 多数公司估值远超 20× 收入，唯算力「卖铲」贴近合理区间',
  // tweakable (universal names) ----------------------------------------------
  itemCount: 6,
  highlight: true,
  highlightIndex: 0,
  showRefLine: true,
  showZones: true,
  showFigures: true,
  accentColor: '#e8503a',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '公司数量', type: 'number', default: 6, min: 3, max: 6, step: 1, unit: ' 家',
    description: '天梯中展示的公司数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一行（描边 + 发光）。' },
  { key: 'highlightIndex', label: '强调第几行', type: 'number', default: 0, min: 0, max: 5, step: 1,
    description: '被强调的行序号（按倍数从高到低排序，从 0 开始）。' },
  { key: 'refMultiple', label: '参考倍数', type: 'number', default: 20, min: 5, max: 60, step: 5, unit: '×',
    description: '合理估值的市销率参考倍数。' },
  { key: 'showRefLine', label: '参考线', type: 'boolean', default: true,
    description: '市销率参考竖线的显示。' },
  { key: 'showZones', label: '区间底色', type: 'boolean', default: true,
    description: '合理区 / 泡沫区 背景色带的显示。' },
  { key: 'showFigures', label: '估值收入数', type: 'boolean', default: true,
    description: '左侧「估值 / 收入」数字的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0'],
    description: '标题荧光、参考线与泡沫区的主题色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const GRAD = {
  blue: ['#7ba6ff', '#4f7fe0'], green: ['#5fc592', '#37996b'], red: ['#ff9479', '#ee5a4f'],
  amber: ['#f2c46e', '#dd9a32'], violet: ['#9d83ec', '#7150d8'],
};
const SOLID = { blue: '#5b8def', green: '#46b083', red: '#e8503a', amber: '#e0a23a', violet: '#7a5ae0' };

const NAME_W = 318;        // fixed left column width (px)
const BAR_MAX = 0.70;      // longest bar fills 70% of the track (leaves room for the number)

export default function SlideBubbleScatter(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const n = Math.max(3, Math.min(6, p.itemCount));
  const rows = p.items.slice(0, n)
    .map((d) => ({ ...d, mult: d.val / d.rev }))
    .sort((a, b) => b.mult - a.mult);
  const maxMult = Math.max.apply(null, rows.map((r) => r.mult)) || 1;
  // sqrt scale keeps short bars legible while preserving rank + the "absurdity".
  const sq = Math.sqrt;
  const frac = (m) => sq(m) / sq(maxMult) * BAR_MAX;
  const refFrac = Math.min(BAR_MAX, frac(p.refMultiple));

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div className="aip-glass" style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex', flexDirection: 'column',
        padding: '30px 56px 28px', borderRadius: 28, position: 'relative' }}>

        {/* legend (inline, top-right) */}
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, letterSpacing: '.1em', color: 'var(--aip-ink-3)' }}>
            P/S MULTIPLE · 估值 ÷ 年化收入
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: ac, whiteSpace: 'nowrap' }}>
              <span style={{ width: 0, height: 22, borderLeft: `3px dashed ${ac}` }} />{p.refLabel}
            </span>
          </div>
        </div>

        {/* plot */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', marginTop: 18 }}>
          {/* zone bands + ref line (overlay the track region only) */}
          <div style={{ position: 'absolute', left: NAME_W, right: 0, top: 0, bottom: 34, pointerEvents: 'none' }}>
            {p.showZones && (
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${refFrac * 100}%`,
                background: hexA('#46b083', 0.09), borderRadius: '12px 0 0 12px',
                borderRight: `1px solid ${hexA('#46b083', 0.28)}` }} />
            )}
            {p.showRefLine && (
              <div style={{ position: 'absolute', left: `${refFrac * 100}%`, top: -6, bottom: -6, width: 0,
                borderLeft: `3px dashed ${hexA(ac, 0.85)}`, transform: 'translateX(-50%)' }} />
            )}
          </div>

          {/* rows */}
          <div style={{ position: 'absolute', inset: '0 0 34px 0', display: 'flex', flexDirection: 'column' }}>
            {rows.map((d, i) => {
              const on = p.highlight && i === p.highlightIndex;
              const g = GRAD[d.tone] || GRAD.blue;
              const tint = SOLID[d.tone] || ac;
              const w = frac(d.mult) * 100;
              const mult = Math.round(d.mult);
              return (
                <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
                  {/* name column */}
                  <div style={{ flex: `0 0 ${NAME_W}px`, paddingRight: 26, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 27, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.15 }}>{d.name}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, letterSpacing: '.08em', color: tint }}>{d.sector}</span>
                    </div>
                    {p.showFigures && (
                      <div style={{ marginTop: 3, fontSize: 18, color: 'var(--aip-ink-3)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        估值 {d.val}{p.unit} · 收入 {d.rev}{p.unit}
                      </div>
                    )}
                  </div>
                  {/* track */}
                  <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: `${w}%`, height: on ? 46 : 38, borderRadius: 999,
                      background: `linear-gradient(90deg, ${g[0]}, ${g[1]})`,
                      boxShadow: on
                        ? `0 -1px 0 ${hexA('#fff', 0.5)} inset, 0 0 0 4px ${hexA(tint, 0.16)}, 0 16px 34px ${hexA(tint, 0.5)}`
                        : `0 -1px 0 ${hexA('#fff', 0.4)} inset, 0 10px 22px ${hexA(tint, 0.32)}`,
                      transition: '.3s' }} />
                    {/* big multiple just past the bar end */}
                    <div style={{ marginLeft: 18, display: 'flex', alignItems: 'baseline', gap: 3, whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 42 : 36, fontWeight: 700, lineHeight: 1,
                        letterSpacing: '-.02em', color: on ? tint : 'var(--aip-ink)' }}>{mult}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 24 : 20, fontWeight: 700, color: on ? tint : 'var(--aip-ink-2)' }}>×</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* x scale ticks (multiples) */}
          <div style={{ position: 'absolute', left: NAME_W, right: 0, bottom: 0, height: 26 }}>
            {[0, p.refMultiple, Math.round(maxMult)].map((t, i) => (
              <span key={i} style={{ position: 'absolute', left: `${frac(t) * 100}%`, transform: 'translateX(-50%)',
                fontFamily: "'Space Mono', monospace", fontSize: 19, color: 'var(--aip-ink-3)' }}>{t}×</span>
            ))}
          </div>
        </div>

        {/* insight strip */}
        <div style={{ flex: '0 0 auto', marginTop: 16, display: 'flex', alignItems: 'center', gap: 20,
          padding: '16px 26px', borderRadius: 18, background: hexA(ac, 0.10), border: `1px solid ${hexA(ac, 0.32)}` }}>
          <span style={{ flex: '0 0 auto', padding: '7px 18px', borderRadius: 10, background: ac, color: '#fff',
            fontSize: 22, fontWeight: 800, letterSpacing: '.04em' }}>{p.insightTitle}</span>
          <p style={{ margin: 0, fontSize: 23, lineHeight: 1.4, color: 'var(--aip-ink)', fontWeight: 500, textWrap: 'pretty' }}>{p.insight}</p>
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
