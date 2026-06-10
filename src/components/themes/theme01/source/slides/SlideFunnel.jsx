// SlideFunnel.jsx — 资金集中度漏斗 / concentration funnel chart.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A vertical converging funnel: each stage is a centred trapezoid whose bottom
// edge meets the next stage's top, so the silhouette reads as a continuous
// narrowing cone. Single-accent discipline (opacity steps down the cone); one
// stage can be promoted to a solid fluorescent "stamp". A glass insight panel on
// the right carries the one-line takeaway. Stage count / highlight / values /
// accent are tweakable; text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, GlassCard, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视 · 市场集中度',
  tone: 'blue',
  title: '资金集中度 · 赢家通吃',
  en: 'Winner Takes All',
  cn: '资金如何向头部集中',
  stages: [
    { label: '全年单笔大额融资', value: '970', unit: '亿', meta: '97 笔 · 单笔超 1 亿美元', pct: '100%' },
    { label: 'Top 10 公司单笔', value: '232', unit: '亿', meta: '前十大单笔合计', pct: '24%' },
    { label: 'Top 3 公司单笔', value: '181', unit: '亿', meta: 'OpenAI · Anthropic · xAI', pct: '19%' },
    { label: '榜首 · OpenAI', value: '66', unit: '亿', meta: '单笔规模最大', pct: '7%' },
  ],
  insight: {
    stat: '24%',
    head: '头部 10 家 = 全市场近 1/4',
    body: '少数独角兽反复获得巨额追加投资，单笔大额融资额高度向金字塔尖收口——“赢家通吃”格局已然确立。',
  },
  caption: '漏斗图 · 资金逐层向头部集中',
  // tweakable (universal names)
  itemCount: 4,
  highlight: true,
  highlightIndex: 1,
  showValues: true,
  showInsight: true,
  accentColor: '#5b8def',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '漏斗层数', type: 'number', default: 4, min: 3, max: 4, step: 1, unit: ' 层',
    description: '漏斗自上而下展示的收口层数。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一层渲染成实色荧光「印章」。' },
  { key: 'highlightIndex', label: '强调第几层', type: 'number', default: 1, min: 0, max: 3, step: 1,
    description: '被强调的漏斗层序号（从 0 开始）。' },
  { key: 'showValues', label: '占比标签', type: 'boolean', default: true,
    description: '每层右侧的占比胶囊标签的显示。' },
  { key: 'showInsight', label: '解读面板', type: 'boolean', default: true,
    description: '右侧磨砂玻璃「集中度」解读面板的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0', '#c9f24d'],
    description: '漏斗与强调印章的主题色（单一色家族，逐层递减透明度）。' },
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

function FunnelStage({ s, idx, topW, botW, on, accent, tone }) {
  // bottom inset on each side, as % of THIS stage's own width
  const inset = topW > 0 ? Math.max(0, ((topW - botW) / 2 / topW) * 100) : 0;
  const clip = `polygon(0 0, 100% 0, ${(100 - inset).toFixed(2)}% 100%, ${inset.toFixed(2)}% 100%)`;
  const fg = on ? readableOn(accent) : 'var(--aip-ink)';
  const unitC = on ? hexA(readableOn(accent) === '#ffffff' ? '#fff' : '#23232a', 0.8) : 'var(--aip-ink-2)';
  const metaC = on ? hexA(readableOn(accent) === '#ffffff' ? '#fff' : '#23232a', 0.72) : 'var(--aip-ink-3)';
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        position: 'relative', width: `${topW}%`, height: '100%', clipPath: clip,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: on
          ? accent
          : `linear-gradient(180deg, ${hexA(accent, 0.30 - idx * 0.045)}, ${hexA(accent, 0.16 - idx * 0.03)})`,
        boxShadow: on
          ? `0 24px 56px ${hexA(accent, 0.42)}`
          : `0 1px 0 rgba(255,255,255,.6) inset, 0 16px 38px rgba(70,72,100,.12)`,
        borderTop: on ? 'none' : `1px solid ${hexA(accent, 0.45)}`,
        transition: '.3s',
      }}>
        {/* mono index, sits on the left shoulder */}
        <span style={{ position: 'absolute', top: 12, left: '6%',
          fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, letterSpacing: '.08em',
          color: on ? hexA(readableOn(accent) === '#ffffff' ? '#fff' : '#23232a', 0.6) : hexA(accent, 0.85) }}>
          {String(idx + 1).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 54, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-.02em', color: fg }}>{s.value}</span>
          <span style={{ fontSize: 25, fontWeight: 900, color: unitC }}>{s.unit}</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 25, fontWeight: 800, color: fg, whiteSpace: 'nowrap' }}>{s.label}</div>
        <div style={{ marginTop: 2, fontSize: 21, fontWeight: 600, color: metaC, whiteSpace: 'nowrap' }}>{s.meta}</div>
      </div>
    </div>
  );
}

export default function SlideFunnel(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const n = Math.max(3, Math.min(4, p.itemCount));
  const stages = p.stages.slice(0, n);
  const nums = stages.map((s) => parseFloat(String(s.value).replace(/[^0-9.]/g, '')) || 0);
  const max = Math.max.apply(null, nums) || 1;
  const topW = (v) => 30 + 66 * (v / max);                 // top edge width %
  const edges = stages.map((_, i) => topW(nums[i]));
  const botOf = (i) => (i < n - 1 ? edges[i + 1] : Math.max(24, edges[n - 1] - 8));

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 56, marginTop: 18, alignItems: 'stretch' }}>
        {/* funnel column */}
        <div style={{ flex: p.showInsight ? '1 1 0' : '1 1 100%', minWidth: 0, display: 'flex' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stages.map((s, i) => (
              <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch', gap: 18 }}>
                <FunnelStage s={s} idx={i} topW={edges[i]} botW={botOf(i)}
                  on={p.highlight && i === p.highlightIndex} accent={ac} tone={p.tone} />
                {p.showValues && (
                  <div style={{ flex: '0 0 132px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'baseline', gap: 4, padding: '8px 20px', borderRadius: 999,
                      background: 'rgba(255,255,255,.66)', border: `1px solid ${hexA(ac, 0.4)}`,
                      boxShadow: '0 10px 24px rgba(70,72,100,.12)',
                    }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1 }}>{s.pct}</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* insight panel */}
        {p.showInsight && (
          <GlassCard style={{ flex: '0 0 470px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '52px 50px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.16em', fontSize: 24, color: 'var(--aip-ink-3)' }}>CONCENTRATION</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <span style={{ fontSize: 188, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-.02em', color: ac }}>{p.insight.stat}</span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--aip-ink)', marginTop: 14, lineHeight: 1.18, textWrap: 'pretty' }}>{p.insight.head}</div>
            <div style={{ width: 64, height: 5, borderRadius: 3, background: ac, margin: '22px 0' }} />
            <p style={{ margin: 0, fontSize: 27, lineHeight: 1.55, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.insight.body}</p>
          </GlassCard>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 20 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
