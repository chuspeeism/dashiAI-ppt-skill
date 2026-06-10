// Slide15Conclusion.jsx — 结论 / Closing takeaways.
// Three numbered takeaway cards (横向看集中 / 纵向看节奏 / 结构看分层) plus an
// emphasized one-line summary band. Card count, highlight, the summary band and
// the caption are tweakable. Fully controlled by props; `aip-` scoped.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 结论',
  title: '结论 · 三条核心判断',
  en: 'Conclusions',
  cn: '透过横纵分析得到的三条主线',
  takeaways: [
    { tag: '横向看集中', en: 'CONCENTRATION', color: '#5b8def',
      text: '资金高度向头部公司、通用大模型赛道、旧金山湾区集中，「赢家通吃」格局确立。' },
    { tag: '纵向看节奏', en: 'CADENCE', color: '#e0a23a',
      text: '全年融资「前高后稳」，Q2–Q3 达峰后理性回落，市场从狂热转向分化。' },
    { tag: '结构看分层', en: 'STRUCTURE', color: '#46b083',
      text: '上游基础设施确定性最强，中游模型层竞争最激烈，下游应用层潜力最大但需时间验证。' },
    { tag: '策略看兑现', en: 'DELIVERY', color: '#7a5ae0',
      text: '资本下一阶段从「赌叙事」转向「看兑现」，能把技术变成可持续收入者，方能留在牌桌。' },
  ],
  summary: '盛宴仍在继续，但音乐的节奏正在变化——资本下一阶段将从「赌叙事」转向「看兑现」，能把技术转化为可持续收入的公司，才能在退潮后留在牌桌上。',
  bandLabel: 'TL;DR',
  caption: '从赌叙事到看兑现 · 退潮之后见真章',
  // ── tweakable ──
  takeawayCount: 3,
  colorMode: 'series',
  accentColor: '#5b8def',
  showEn: true,
  highlight: false,
  highlightIndex: 0,
  showSummary: true,
  showCaption: true,
};

export const controls = [
  { key: 'takeawayCount', label: '结论卡数量', type: 'number', default: 3, min: 1, max: 4, step: 1, unit: ' 条',
    description: '展示的核心结论卡数量（最多 4 条）。' },
  { key: 'colorMode', label: '配色模式', type: 'select', default: 'series',
    options: [{ value: 'series', label: '多彩品牌色' }, { value: 'mono', label: '单一主题色' }],
    description: '每卡使用品牌色序列，或统一使用单一主题色。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '「单一主题色」模式下，所有卡片与高亮的统一颜色。' },
  { key: 'showEn', label: '英文标签', type: 'boolean', default: true,
    description: '是否显示每卡的英文 mono 标签。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: false,
    description: '是否高亮强调其中一条结论。' },
  { key: 'highlightIndex', label: '强调第几条', type: 'number', default: 0, min: 0, max: 3, step: 1,
    description: '被强调的结论序号（从 0 开始）。' },
  { key: 'showSummary', label: '一句话总结', type: 'boolean', default: true,
    description: '是否显示底部强调的一句话总结。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
];

export default function Slide15Conclusion(props) {
  const p = { ...defaultProps, ...props };
  const items = p.takeaways.slice(0, Math.max(1, Math.min(4, p.takeawayCount)));
  const mono = p.colorMode === 'mono';

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="green" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, marginTop: 14, marginBottom: 24, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', gap: 24, minHeight: 0 }}>
          {items.map((it, i) => {
            const on = p.highlight && i === p.highlightIndex;
            const dim = p.highlight && !on;
            const c = mono ? p.accentColor : it.color;
            return (
              <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: 20,
                padding: '38px 36px', borderRadius: 24, opacity: dim ? 0.5 : 1,
                background: on
                  ? `linear-gradient(165deg, ${hexA(c, 0.2)}, ${hexA(c, 0.06)})`
                  : 'rgba(255,255,255,.52)',
                border: `1px solid ${on ? hexA(c, 0.5) : 'rgba(255,255,255,.7)'}`,
                boxShadow: on ? `0 1px 0 rgba(255,255,255,.75) inset, 0 26px 60px ${hexA(c, 0.24)}`
                  : '0 1px 0 rgba(255,255,255,.7) inset, 0 20px 48px rgba(70,72,100,.12)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', transition: 'all .3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span style={{ flex: '0 0 auto', width: 72, height: 72, borderRadius: 18, background: c, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900,
                    boxShadow: `0 12px 28px ${hexA(c, 0.4)}` }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 38, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.1 }}>{it.tag}</div>
                    {p.showEn && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 22, letterSpacing: '.12em',
                      color: hexA(c, 0.85), marginTop: 6 }}>{it.en}</div>}
                  </div>
                </div>
                <div style={{ width: 56, height: 4, borderRadius: 3, background: hexA(c, 0.5) }} />
                <p style={{ margin: 0, fontSize: 28, lineHeight: 1.6, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{it.text}</p>
              </div>
            );
          })}
        </div>

        {p.showSummary && (
          <div style={{ flex: '0 0 auto', position: 'relative', padding: '30px 44px', borderRadius: 22,
            background: 'linear-gradient(120deg, rgba(43,43,48,.94), rgba(60,60,70,.9))',
            boxShadow: '0 24px 60px rgba(40,42,60,.32)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <span style={{ flex: '0 0 auto', fontFamily: 'Space Mono, monospace', fontSize: 24, fontWeight: 700,
                letterSpacing: '.14em', color: 'rgba(255,255,255,.55)', writingMode: 'vertical-rl' }}>{p.bandLabel}</span>
              <p style={{ margin: 0, fontSize: 30, lineHeight: 1.55, color: '#fff', fontWeight: 500, textWrap: 'pretty' }}>{p.summary}</p>
            </div>
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
