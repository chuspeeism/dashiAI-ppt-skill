// Slide08Quadrant.jsx — 资本四象限 / Capital-heat × commercial-delivery matrix.
// 2×2 matrix. Any quadrant can be emphasized; axis labels, company chips per
// quadrant, and caption are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

const TONE = { red: '#e8503a', green: '#46b083', amber: '#e0a23a', blue: '#5b8def' };

export const defaultProps = {
  kicker: '# 选题主线',
  title: '资本四象限 · 热度 × 兑现',
  en: 'Capital Heat × Commercial Delivery',
  cn: '资本正从叙事驱动转向兑现驱动',
  // reading order: TL, TR, BL, BR
  quadrants: [
    { title: '叙事泡沫区', en: 'NARRATIVE BUBBLE', tone: 'red',
      desc: '通用大模型 / AGI 实验室获巨额融资，但兑现受算力成本、差异化与付费转化约束。',
      chips: ['OpenAI', 'Anthropic', 'xAI', 'SSI'] },
    { title: '明星兑现区', en: 'PROVEN STARS', tone: 'green',
      desc: '算力云、数据平台兼具融资热度与收入确定性，“卖铲子”逻辑，需求来自训练与企业 AI 化。',
      chips: ['CoreWeave', 'Databricks', 'Scale AI'] },
    { title: '等待验证区', en: 'TO BE PROVEN', tone: 'amber',
      desc: '长尾工具链、安全、早期硬件与应用，概念成立但规模未证，作为风险与边缘变量观察。',
      chips: ['工具链', '安全', '早期应用'] },
    { title: '隐形价值区', en: 'HIDDEN VALUE', tone: 'blue',
      desc: '垂直应用、企业搜索、工作流自动化单笔不一定最大，但落地路径清晰，看付费留存与续约。',
      chips: ['Glean', 'Perplexity'] },
  ],
  axisY: { high: '资本热度 高', low: '资本热度 低' },
  axisX: { low: '商业兑现度 低', high: '商业兑现度 高' },
  caption: '热度看融资额、轮次与头部集中度；兑现看收入确定性、客户留存、成本结构与商业闭环',
  // tweakable
  highlight: true,
  highlightIndex: 1,
  showAxisLabels: true,
  chipCount: 4,
  showCaption: true,
};

export const controls = [
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个象限。' },
  { key: 'highlightIndex', label: '强调第几象限', type: 'number', default: 1, min: 0, max: 3, step: 1,
    description: '被强调的象限序号（阅读顺序：左上 0 / 右上 1 / 左下 2 / 右下 3）。' },
  { key: 'showAxisLabels', label: '坐标轴标签', type: 'boolean', default: true,
    description: '是否显示横纵坐标轴的高低标签。' },
  { key: 'chipCount', label: '每象限公司数', type: 'number', default: 4, min: 0, max: 4, step: 1, unit: ' 个',
    description: '每个象限展示的公司标签数量（0 时仅显示文字描述）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
];

function Cell({ q, on, dim, chipCount }) {
  const c = TONE[q.tone] || '#5b8def';
  return (
    <div style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: '26px 30px',
      borderRadius: 20, opacity: dim ? 0.55 : 1,
      background: on ? `linear-gradient(150deg, ${hexA(c, 0.2)}, ${hexA(c, 0.06)})` : 'rgba(255,255,255,.46)',
      border: on ? `2px solid ${c}` : `1px solid ${hexA(c, 0.28)}`,
      boxShadow: on ? `0 1px 0 rgba(255,255,255,.7) inset, 0 22px 50px ${hexA(c, 0.26)}` : '0 1px 0 rgba(255,255,255,.6) inset, 0 14px 34px rgba(70,72,100,.1)',
      backdropFilter: 'blur(16px)', transition: 'all .3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: c }}>{q.title}</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: '.06em', color: hexA(c, 0.8) }}>{q.en}</span>
      </div>
      <div style={{ fontSize: 24, lineHeight: 1.5, color: 'var(--aip-ink-2)', textWrap: 'pretty' }}>{q.desc}</div>
      {chipCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' }}>
          {q.chips.slice(0, chipCount).map((ch, k) => (
            <span key={k} style={{ padding: '6px 16px', borderRadius: 999, background: hexA(c, 0.14),
              border: `1px solid ${hexA(c, 0.4)}`, color: '#3a3a42', fontSize: 24, fontWeight: 600, whiteSpace: 'nowrap' }}>{ch}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Slide08Quadrant(props) {
  const p = { ...defaultProps, ...props };
  const ax = p.showAxisLabels;
  const axisChip = (txt) => (
    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: '.04em',
      color: 'var(--aip-ink-3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{txt}</span>
  );

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="red" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', gap: 18, marginTop: 8, minHeight: 0 }}>
        {/* Y axis */}
        {ax && (
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            alignItems: 'center', padding: '6px 0 44px' }}>
            <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{axisChip('▲ ' + p.axisY.high)}</div>
            <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{axisChip(p.axisY.low + ' ▼')}</div>
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 22 }}>
            {p.quadrants.map((q, i) => (
              <Cell key={i} q={q} on={p.highlight && i === p.highlightIndex}
                dim={p.highlight && i !== p.highlightIndex} chipCount={p.chipCount} />
            ))}
          </div>
          {/* X axis */}
          {ax && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 8px 0' }}>
              {axisChip('◀ ' + p.axisX.low)}
              {axisChip(p.axisX.high + ' ▶')}
            </div>
          )}
        </div>
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
