// Slide10Region.jsx — 地区分布 / Geographic concentration (share bar).
// A 100% stacked horizontal share bar + ranked legend, with a concentration
// callout. Segment count, highlight, the callout, and caption are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, GlassCard, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 横向透视',
  title: '地区分布 · 高度集聚',
  en: 'Funding by Region',
  cn: '融资高度集中在少数科技枢纽',
  regions: [
    { label: '旧金山湾区', en: 'SF Bay Area', value: 620, share: 63.9, color: '#5b8def' },
    { label: '纽约', en: 'New York', value: 120, share: 12.4, color: '#46b083' },
    { label: '西雅图', en: 'Seattle', value: 95, share: 9.8, color: '#e0a23a' },
    { label: '波士顿', en: 'Boston', value: 75, share: 7.7, color: '#e8503a' },
    { label: '其他地区', en: 'Others', value: 60, share: 6.2, color: '#7a5ae0' },
  ],
  callout: { value: '63.9%', label: '旧金山湾区', note: '独占六成以上 · 人才、资本、算力虹吸效应进一步强化' },
  caption: '“地理护城河”短期内难以撼动 · 旧金山湾区独占六成以上份额',
  // tweakable
  segmentCount: 5,
  highlight: true,
  highlightIndex: 0,
  showCallout: true,
  showCaption: true,
};

export const controls = [
  { key: 'segmentCount', label: '地区数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 个',
    description: '展示的地区数量（其余并入末项）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个地区。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的地区序号（从 0 开始）。' },
  { key: 'showCallout', label: '集聚度卡片', type: 'boolean', default: true,
    description: '是否显示左侧集聚度大数字卡片。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
];

export default function Slide10Region(props) {
  const p = { ...defaultProps, ...props };
  let regs = p.regions;
  const n = Math.max(3, Math.min(p.regions.length, p.segmentCount));
  if (n < p.regions.length) {
    const head = p.regions.slice(0, n - 1);
    const rest = p.regions.slice(n - 1);
    regs = [...head, {
      label: '其他地区', en: 'Others', color: '#9aa0ad',
      value: rest.reduce((s, x) => s + x.value, 0),
      share: rest.reduce((s, x) => s + x.share, 0),
    }];
  } else regs = p.regions.slice(0, n);
  const totalShare = regs.reduce((s, x) => s + x.share, 0);

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="amber" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', gap: 56, marginTop: 16, minHeight: 0, alignItems: 'stretch' }}>
        {p.showCallout && (
          <GlassCard style={{ flex: '0 0 460px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 52px' }}>
            <div className="aip-en" style={{ fontSize: 24 }}>CONCENTRATION</div>
            <div style={{ fontSize: 168, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 0.95, letterSpacing: '.01em' }}>{p.callout.value}</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: 'var(--aip-ink)', marginTop: 8 }}>{p.callout.label}</div>
            <div style={{ fontSize: 26, color: 'var(--aip-ink-2)', lineHeight: 1.5, marginTop: 18, textWrap: 'pretty' }}>{p.callout.note}</div>
          </GlassCard>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
          {/* 100% stacked share bar */}
          <div style={{ display: 'flex', width: '100%', height: 120, borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 18px 44px rgba(70,72,100,.14)' }}>
            {regs.map((r, i) => {
              const on = p.highlight && i === p.highlightIndex;
              const dim = p.highlight && !on;
              const wide = (r.share / totalShare) > 0.12;
              return (
                <div key={i} style={{
                  width: `${(r.share / totalShare) * 100}%`, position: 'relative', opacity: dim ? 0.55 : 1,
                  background: `linear-gradient(180deg, ${hexA(r.color, 0.95)}, ${hexA(r.color, 0.62)})`,
                  borderRight: i < regs.length - 1 ? '2px solid rgba(255,255,255,.7)' : 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transform: on ? 'scaleY(1.08)' : 'none', transition: 'all .3s ease',
                }}>
                  {wide && (
                    <>
                      <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.25)' }}>{r.share}%</div>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#fff', opacity: 0.92 }}>{r.label}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {regs.map((r, i) => {
              const on = p.highlight && i === p.highlightIndex;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p.highlight && !on ? 0.55 : 1,
                  padding: '8px 0', borderBottom: i < regs.length - 1 ? '1px solid rgba(0,0,0,.06)' : 'none' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: r.color, flex: '0 0 auto' }} />
                  <span style={{ flex: 1, fontSize: 30, fontWeight: 700, color: 'var(--aip-ink)' }}>{r.label}</span>
                  <span className="aip-en" style={{ fontSize: 24, flex: '0 0 auto', width: 260 }}>{r.en}</span>
                  <span style={{ width: 150, textAlign: 'right', fontSize: 28, fontWeight: 700, color: 'var(--aip-ink-2)' }}>{r.value} 亿</span>
                  <span style={{ width: 130, textAlign: 'right', fontSize: 32, fontWeight: 900, color: on ? r.color : 'var(--aip-ink)' }}>{r.share}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
