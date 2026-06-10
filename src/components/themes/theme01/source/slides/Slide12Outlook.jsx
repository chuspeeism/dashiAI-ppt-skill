// Slide12Outlook.jsx — 投资展望 / Investment outlook.
// Two stances (看好 / 谨慎) plus a phased strategy timeline. Column emphasis,
// item count, the timeline, and caption are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 投资展望',
  title: '投资展望 · 从赌叙事到看兑现',
  en: 'Outlook — Narrative to Delivery',
  cn: '资本下一阶段的方向与节奏',
  bullish: {
    label: '看好方向', en: 'BULLISH', color: '#46b083',
    items: [
      { h: '垂直应用', d: '有清晰商业模式、已验证 PMF（Glean、Harvey）' },
      { h: '基础设施中游', d: '数据标注（Scale AI）、向量数据库（Pinecone）等“卖铲子”环节' },
      { h: '具身智能', d: '人形机器人（Figure AI）、自动驾驶等长周期硬科技' },
    ],
  },
  cautious: {
    label: '谨慎对待', en: 'CAUTIOUS', color: '#e8503a',
    items: [
      { h: '高估值无收入纯模型公司', d: '烧钱快、竞争壁垒低、估值泡沫大' },
      { h: '跟风“AI 包装”项目', d: '仅在传统业务上加一层 LLM 调用，无核心技术壁垒' },
      { h: '缺乏数据护城河的消费应用', d: '用户迁移成本低，易被大厂复制' },
    ],
  },
  timeline: [
    { period: '2025 – 2026', text: '观察头部公司 IPO，若 Anthropic / OpenAI 破发，警惕全行业估值回调' },
    { period: '2026 – 2027', text: '优选已达 ARR 1 亿美元以上、续约率 > 120% 的垂直应用标的' },
    { period: '2027 后', text: '若 AGI 突破未兑现进入洗牌期，可抄底被低估的技术资产' },
  ],
  caption: '能把技术转化为可持续收入的公司，才能在退潮后留在牌桌上',
  // tweakable
  itemCount: 3,
  highlightColumn: 'none',
  showTimeline: true,
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '每栏条目数', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 条',
    description: '“看好”与“谨慎”每栏展示的条目数量。' },
  { key: 'highlightColumn', label: '重点强调', type: 'select', default: 'none',
    options: [{ value: 'none', label: '均衡' }, { value: 'bullish', label: '看好' }, { value: 'cautious', label: '谨慎' }],
    description: '强调“看好”或“谨慎”某一栏（另一栏淡化）。' },
  { key: 'showTimeline', label: '阶段时间轴', type: 'boolean', default: true,
    description: '是否显示底部的阶段性策略时间轴。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部一句话总结。' },
];

function Stance({ col, sign, items, dim }) {
  const c = col.color;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, opacity: dim ? 0.5 : 1,
      padding: '24px 28px', borderRadius: 20,
      background: `linear-gradient(160deg, ${hexA(c, 0.14)}, ${hexA(c, 0.04)})`,
      border: `1px solid ${hexA(c, 0.3)}`, transition: 'opacity .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: c, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, flex: '0 0 auto' }}>{sign}</span>
        <span style={{ fontSize: 38, fontWeight: 900, color: 'var(--aip-ink)' }}>{col.label}</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: '.1em', color: hexA(c, 0.85) }}>{col.en}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,.55)', borderLeft: `4px solid ${c}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--aip-ink)' }}>{it.h}</div>
            <div style={{ fontSize: 24, color: 'var(--aip-ink-2)', lineHeight: 1.45, marginTop: 3, textWrap: 'pretty' }}>{it.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Slide12Outlook(props) {
  const p = { ...defaultProps, ...props };
  const nb = p.bullish.items.slice(0, Math.max(1, Math.min(3, p.itemCount)));
  const nc = p.cautious.items.slice(0, Math.max(1, Math.min(3, p.itemCount)));

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="green" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22, marginTop: 12, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', gap: 28, minHeight: 0 }}>
          <Stance col={p.bullish} sign="✓" items={nb} dim={p.highlightColumn === 'cautious'} />
          <Stance col={p.cautious} sign="!" items={nc} dim={p.highlightColumn === 'bullish'} />
        </div>

        {p.showTimeline && (
          <div style={{ display: 'flex', gap: 18, flex: '0 0 auto' }}>
            {p.timeline.map((t, i) => (
              <div key={i} style={{ flex: 1, position: 'relative', padding: '18px 24px', borderRadius: 16,
                background: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.65)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--aip-ink)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, flex: '0 0 auto' }}>{i + 1}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, fontWeight: 700, color: 'var(--aip-ink)', letterSpacing: '.02em' }}>{t.period}</span>
                </div>
                <div style={{ fontSize: 23, color: 'var(--aip-ink-2)', lineHeight: 1.45, marginTop: 10, textWrap: 'pretty' }}>{t.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
