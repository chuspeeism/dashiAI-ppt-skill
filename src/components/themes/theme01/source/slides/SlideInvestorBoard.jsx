// SlideInvestorBoard.jsx — 活跃投资机构榜 / active-investor leaderboard grid.
// A card per investor: rank medallion, name + tier, primary metric (出手次数)
// with a proportional micro-bar, and representative-deal sticker chips. Fills
// the deck's "who is writing the checks" gap. Migration-safe: default export +
// defaultProps + controls; props-only; `aip-` scope only, never host :root.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视 · 资金来源',
  tone: 'violet',
  title: '谁在写下支票',
  en: 'Who Writes the Checks',
  cn: '最活跃的一线机构与主权资本',
  metricLabel: '年内出手',
  metricUnit: '笔',
  investors: [
    { name: 'a16z', en: 'Andreessen Horowitz', tier: '风投', metric: 28, deals: ['OpenAI', 'Mistral', 'xAI'], tone: 'violet' },
    { name: 'Sequoia', en: 'Sequoia Capital', tier: '风投', metric: 24, deals: ['OpenAI', 'Glean'], tone: 'blue' },
    { name: 'Thrive', en: 'Thrive Capital', tier: '成长基金', metric: 17, deals: ['OpenAI', 'Anthropic'], tone: 'green' },
    { name: 'Microsoft', en: 'Strategic / CVC', tier: '战略投资', metric: 14, deals: ['OpenAI', 'CoreWeave'], tone: 'amber' },
    { name: 'MGX', en: 'Abu Dhabi Fund', tier: '主权基金', metric: 11, deals: ['xAI', 'Anthropic'], tone: 'red' },
    { name: 'Nvidia', en: 'Strategic / CVC', tier: '战略投资', metric: 10, deals: ['CoreWeave', 'Figure'], tone: 'green' },
  ],
  caption: '投资机构榜 · 一线风投、战略 CVC 与主权资本三股力量主导大额融资',
  // tweakable (universal names)
  itemCount: 6,
  highlight: true,
  highlightIndex: 0,
  showBars: true,
  showDeals: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '机构数量', type: 'number', default: 6, min: 2, max: 6, step: 1, unit: ' 家',
    description: '榜单中展示的机构卡片数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调榜首/某家机构（描边 + 实色徽章）。' },
  { key: 'highlightIndex', label: '强调第几家', type: 'number', default: 0, min: 0, max: 5, step: 1,
    description: '被强调的机构序号（从 0 开始）。' },
  { key: 'showBars', label: '活跃度条', type: 'boolean', default: true,
    description: '出手次数比例微条的显示。' },
  { key: 'showDeals', label: '代表项目', type: 'boolean', default: true,
    description: '代表投资项目贴纸标签的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '标题荧光与强调机构卡片的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const SOLID = { blue: '#5b8def', green: '#46b083', red: '#e8503a', amber: '#e0a23a', violet: '#7a5ae0' };
const TIER_TONE = { '风投': 'blue', '成长基金': 'green', '战略投资': 'amber', '主权基金': 'red' };

export default function SlideInvestorBoard(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const n = Math.max(2, Math.min(6, p.itemCount));
  const list = p.investors.slice(0, n);
  const max = Math.max(...list.map((d) => d.metric)) || 1;
  // tidy grid: ≤4 → 2 cols, else 3 cols
  const cols = n <= 4 ? 2 : 3;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: '1fr', gap: 22, marginTop: 28 }}>
        {list.map((d, i) => {
          const on = p.highlight && i === p.highlightIndex;
          const c = SOLID[d.tone] || ac;
          const tierC = SOLID[TIER_TONE[d.tier]] || ac;
          return (
            <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14,
              padding: '26px 30px', borderRadius: 22, overflow: 'hidden',
              background: on ? hexA(c, 0.12) : 'rgba(255,255,255,.52)',
              backdropFilter: 'blur(22px) saturate(140%)', WebkitBackdropFilter: 'blur(22px) saturate(140%)',
              border: on ? `2px solid ${hexA(c, 0.55)}` : '1px solid rgba(255,255,255,.7)',
              boxShadow: on ? `0 22px 52px ${hexA(c, 0.26)}` : '0 1px 0 rgba(255,255,255,.7) inset, 0 16px 40px rgba(70,72,100,.12)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
                <span style={{ flex: '0 0 auto', width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? c : hexA(c, 0.16), color: on ? '#fff' : c, fontWeight: 900, fontSize: 30,
                  border: on ? 'none' : `1px solid ${hexA(c, 0.4)}` }}>{i + 1}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 38, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, letterSpacing: '.06em', color: 'var(--aip-ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.en}</div>
                </div>
                <span style={{ marginLeft: 'auto', flex: '0 0 auto', padding: '7px 16px', borderRadius: 999, fontSize: 22, fontWeight: 700,
                  color: tierC, background: 'rgba(255,255,255,.94)', border: `1px solid ${hexA(tierC, 0.42)}`, whiteSpace: 'nowrap',
                  boxShadow: '0 6px 16px rgba(70,72,100,.1)' }}>{d.tier}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: c, lineHeight: 1 }}>{d.metric}</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--aip-ink-2)' }}>{p.metricUnit} · {p.metricLabel}</span>
              </div>

              {p.showBars && (
                <div style={{ position: 'relative', zIndex: 1, height: 12, borderRadius: 6, background: hexA(c, 0.14), overflow: 'hidden' }}>
                  <div style={{ width: `${d.metric / max * 100}%`, height: '100%', borderRadius: 6,
                    background: `linear-gradient(90deg, ${hexA(c, 0.95)}, ${hexA(c, 0.6)})` }} />
                </div>
              )}

              {p.showDeals && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                  {d.deals.map((dl, k) => (
                    <span key={k} style={{ padding: '6px 15px', borderRadius: 10, fontSize: 22, fontWeight: 700, color: 'var(--aip-ink)',
                      background: 'rgba(255,255,255,.92)', border: `1px solid ${hexA(c, 0.3)}`, whiteSpace: 'nowrap' }}>{dl}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
