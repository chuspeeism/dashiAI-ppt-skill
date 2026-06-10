// Slide01Cover.jsx — 封面 / Cover.
// Independent, prop-driven. Exports: default component, defaultProps, controls.
//
// controls[] is the template's tweak schema — one entry per adjustable prop,
// field names map 1:1 to props. Types: number | boolean | select | color.

import React from 'react';
import { SlideFrame, GlassCard, hexA } from './SlideKit.jsx';

export const defaultProps = {
  // text content (not exposed as tweaks — copy is edited in code)
  eyebrow: '2024 · United States · Venture Capital',
  titleTop: '美国大额融资 AI 公司',
  titleBottom: '调研报告',
  enSubtitle: 'US AI Mega-Funding Research Report',
  stats: [
    { value: '970', unit: '亿美元', caption: '全年 AI 风投吸纳 · 创历史新高' },
    { value: '97', unit: '笔', caption: '单笔 ≥ 1 亿美元的融资事件' },
    { value: '≈1/3', unit: '', caption: '占全美全部风险投资的份额' },
  ],
  footnote: '数据口径：2024 全年公开披露的 ≥1 亿美元融资事件 · 编制 2026-06-03',
  // tweakable
  statCount: 3,
  highlight: false,
  highlightIndex: 0,
  accentColor: '#5b8def',
  showCaption: true,
};

export const controls = [
  { key: 'statCount', label: '指标卡数量', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 张',
    description: '封面展示的关键指标卡片数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: false,
    description: '是否高亮强调其中某一张指标卡。' },
  { key: 'highlightIndex', label: '强调第几张', type: 'number', default: 0, min: 0, max: 2, step: 1,
    description: '被强调的指标卡序号（从 0 开始），仅在「重点强调」开启时生效。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '光球与强调卡片的主题色。' },
  { key: 'showCaption', label: '脚注说明', type: 'boolean', default: true,
    description: '是否显示底部数据口径脚注。' },
];

export default function Slide01Cover(props) {
  const p = { ...defaultProps, ...props };
  const stats = p.stats.slice(0, Math.max(1, Math.min(p.stats.length, p.statCount)));
  const accent = p.accentColor;

  return (
    <SlideFrame bg="a" style={{ }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '0 var(--aip-pad-x)' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', letterSpacing: '.32em',
          textTransform: 'uppercase', color: '#9092a0', fontSize: 26 }}>{p.eyebrow}</div>

        {/* glass orb, tinted by accent */}
        <div style={{
          width: 150, height: 150, borderRadius: '50%', margin: '30px 0 26px', position: 'relative',
          background: `radial-gradient(circle at 36% 28%, #ffffff 0%, rgba(255,255,255,.55) 26%, ${hexA(accent, 0.55)} 58%, ${hexA(accent, 0.30)} 100%)`,
          boxShadow: `inset 0 -14px 34px ${hexA(accent, 0.42)}, inset 10px 12px 26px rgba(255,255,255,.92), 0 36px 70px ${hexA(accent, 0.30)}`,
        }}>
          <div style={{ content: '""', position: 'absolute', top: 20, left: 32, width: 40, height: 26,
            borderRadius: '50%', background: 'rgba(255,255,255,.92)', filter: 'blur(3px)', transform: 'rotate(-24deg)' }} />
        </div>

        <h1 style={{ margin: 0, fontSize: 'var(--aip-type-title)', fontWeight: 900,
          color: 'var(--aip-ink)', letterSpacing: '.02em', lineHeight: 1.12 }}>{p.titleTop}</h1>
        <h1 style={{ margin: '4px 0 0', fontSize: 'var(--aip-type-display)', fontWeight: 900,
          color: 'var(--aip-ink)', letterSpacing: '.04em', lineHeight: 1.12 }}>{p.titleBottom}</h1>

        <div className="aip-en" style={{ marginTop: 24 }}>{p.enSubtitle}</div>

        <div style={{ display: 'flex', gap: 26, marginTop: 54 }}>
          {stats.map((s, i) => {
            const on = p.highlight && i === p.highlightIndex;
            return (
              <GlassCard key={i} style={{
                width: 336, padding: '26px 38px', borderRadius: 20, textAlign: 'left',
                background: on ? `linear-gradient(160deg, ${hexA(accent, 0.9)}, ${hexA(accent, 0.72)})` : undefined,
                border: on ? `1px solid ${hexA(accent, 0.6)}` : undefined,
                boxShadow: on ? `0 1px 0 rgba(255,255,255,.5) inset, 0 28px 60px ${hexA(accent, 0.4)}` : undefined,
                transform: on ? 'translateY(-10px)' : undefined,
                transition: 'transform .3s ease',
              }}>
                <div style={{ fontSize: 62, fontWeight: 900, color: on ? '#fff' : 'var(--aip-ink)', lineHeight: 1, letterSpacing: '.01em' }}>
                  {s.value}{s.unit && <small style={{ fontSize: 30, fontWeight: 700, marginLeft: 4 }}>{s.unit}</small>}
                </div>
                <div style={{ marginTop: 14, fontSize: 'var(--aip-type-small)', color: on ? 'rgba(255,255,255,.92)' : 'var(--aip-ink-2)', fontWeight: 500, lineHeight: 1.45, textWrap: 'balance' }}>{s.caption}</div>
              </GlassCard>
            );
          })}
        </div>

        {p.showCaption && (
          <div className="aip-mono" style={{ marginTop: 50 }}>{`*/ `}{p.footnote}{` /*`}</div>
        )}
      </div>
    </SlideFrame>
  );
}
