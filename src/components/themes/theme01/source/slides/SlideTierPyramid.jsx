// SlideTierPyramid.jsx — 估值梯队 · 金字塔 / valuation-tier hierarchy.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A left-side stacked-trapezoid pyramid (narrow apex = the few super-unicorns,
// wide base = the long tail) sits beside aligned detail rows. Each tier carries
// a giant company count and a valuation band; one tier can be promoted to a
// fluorescent "stamp". Tier count, highlight, examples and accent are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视',
  title: '估值梯队 · 金字塔',
  en: 'Valuation Tiers',
  cn: '极少数公司吃掉绝大多数估值',
  // top (apex) → bottom (base)
  tiers: [
    { band: '≥ 1000 亿美元', en: 'DECACORN+', count: '3', unit: '家', desc: '通用大模型三巨头，估值断层领先', examples: ['OpenAI', 'Anthropic', 'xAI'], color: '#7a5ae0' },
    { band: '100 – 1000 亿', en: 'GIANT', count: '9', unit: '家', desc: '基建与应用龙头，紧追第一梯队', examples: ['Databricks', 'CoreWeave', 'SSI', 'Perplexity'], color: '#5b8def' },
    { band: '10 – 100 亿', en: 'UNICORN', count: '34', unit: '家', desc: '细分赛道独角兽，估值快速爬升', examples: ['Figure AI', 'Scale AI', 'Glean'], color: '#46b083' },
    { band: '< 10 亿', en: 'EMERGING', count: '200+', unit: '家', desc: '早期种子 / A 轮新锐，长尾基本盘', examples: ['种子轮', 'A 轮', '早期'], color: '#e0a23a' },
  ],
  caption: '金字塔 · 顶端三家公司的估值合计超过其后数十家之和',
  // tweakable (universal names)
  tierCount: 4,
  highlight: true,
  highlightIndex: 0,
  showExamples: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'tierCount', label: '梯队层数', type: 'number', default: 4, min: 2, max: 4, step: 1, unit: ' 层',
    description: '展示的估值梯队层数（从顶端起）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把某一层渲染成荧光「印章」。' },
  { key: 'highlightIndex', label: '强调第几层', type: 'number', default: 0, min: 0, max: 3, step: 1,
    description: '被强调的梯队序号（0 = 顶端）。' },
  { key: 'showExamples', label: '代表公司', type: 'boolean', default: true,
    description: '右侧每层的代表公司贴纸显示。' },
  { key: 'accentColor', label: '强调色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a', '#c9f24d'],
    description: '被强调层的荧光颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function readableOn(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? '#23232a' : '#ffffff';
}

export default function SlideTierPyramid(props) {
  const p = { ...defaultProps, ...props };
  const tiers = p.tiers.slice(0, Math.max(2, Math.min(4, p.tierCount)));
  const n = tiers.length;

  // pyramid widths (% of pyramid box) per tier, narrow apex → wide base
  const wMin = 30, wMax = 100;
  const widthAt = (i) => wMin + (wMax - wMin) * (i / Math.max(1, n - 1));

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={`# ${p.kicker}`} tone="violet" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 14, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 48 }}>
        {/* ── left: trapezoid pyramid ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
          {tiers.map((t, i) => {
            const on = p.highlight && i === p.highlightIndex;
            const wTop = widthAt(i), wBot = widthAt(i + 1 <= n - 1 ? i + 1 : i) + (i === n - 1 ? 0 : 0);
            // clip a centered trapezoid: top edge = wTop, bottom edge = next tier's top width
            const wBottom = i === n - 1 ? wMax : widthAt(i + 1);
            const tHalf = wTop / 2, bHalf = wBottom / 2;
            const fg = on ? readableOn(p.accentColor) : '#fff';
            return (
              <div key={i} style={{ position: 'relative', height: `${100 / n}%`, minHeight: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  clipPath: `polygon(${50 - tHalf}% 0, ${50 + tHalf}% 0, ${50 + bHalf}% 100%, ${50 - bHalf}% 100%)`,
                  background: on ? p.accentColor
                    : `linear-gradient(160deg, ${hexA(t.color, 0.92)}, ${hexA(t.color, 0.66)})`,
                  boxShadow: on ? `0 18px 40px ${hexA(p.accentColor, 0.5)}` : `0 14px 30px ${hexA(t.color, 0.28)}`,
                  border: `1px solid ${hexA('#ffffff', 0.5)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                  transform: on ? 'scale(1.015)' : 'none',
                }}>
                  <span style={{ fontSize: n >= 4 ? 58 : 70, fontWeight: 900, color: fg, lineHeight: 0.9, letterSpacing: '-.02em' }}>{t.count}</span>
                  <span style={{ fontSize: 26, fontWeight: 800, color: hexA(fg, 0.92) }}>{t.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── right: aligned tier detail rows ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tiers.map((t, i) => {
            const on = p.highlight && i === p.highlightIndex;
            return (
              <div key={i} style={{
                flex: '1 1 0', minHeight: 0, display: 'flex', alignItems: 'center', gap: 26,
                padding: '0 30px', borderRadius: 22, position: 'relative', overflow: 'hidden',
                background: on ? hexA(p.accentColor, 0.14) : 'rgba(255,255,255,.52)',
                backdropFilter: 'blur(22px) saturate(140%)', WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                border: `1px solid ${on ? hexA(p.accentColor, 0.5) : 'rgba(255,255,255,.72)'}`,
                boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 16px 38px rgba(70,72,100,.1)',
              }}>
                <span style={{ flex: '0 0 auto', width: 9, alignSelf: 'stretch', margin: '20px 0', borderRadius: 5, background: on ? p.accentColor : t.color }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-block', padding: '4px 13px', borderRadius: 9, background: on ? p.accentColor : t.color, color: '#fff', fontSize: 24, fontWeight: 800, whiteSpace: 'nowrap', transform: on ? 'rotate(-1.4deg)' : 'none' }}>{t.band}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, letterSpacing: '.12em', color: hexA(on ? p.accentColor : t.color, 0.9) }}>{t.en}</span>
                  </div>
                  <div style={{ marginTop: 5, fontSize: 25, fontWeight: 600, color: 'var(--aip-ink-2)', lineHeight: 1.25, textWrap: 'pretty' }}>{t.desc}</div>
                  {p.showExamples && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                      {t.examples.map((ex, k) => (
                        <span key={k} style={{ padding: '3px 11px', borderRadius: 8, background: 'rgba(255,255,255,.72)', border: `1px solid ${hexA(t.color, 0.4)}`, fontSize: 19, fontWeight: 700, color: 'var(--aip-ink)' }}>{ex}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
