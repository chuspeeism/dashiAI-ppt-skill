// Slide06Ranking.jsx — 头部玩家 / Top funding rounds ranking.
// Horizontal ranked bars. itemCount controls how many rows show; any rank can
// be emphasized; value labels and caption are toggleable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

const EVIL_HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)';
const EVIL_DOTS = { backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)', backgroundSize: '24px 24px' };

const SECTOR_COLORS = {
  '通用大模型': '#5b8def',
  'AI 基础设施': '#46b083',
  'AI 硬件': '#e0a23a',
  '垂直应用': '#7a5ae0',
};

export const defaultProps = {
  kicker: '# 横向透视',
  title: '头部玩家 · 单笔融资 Top 10',
  en: 'Top 10 Single Rounds',
  cn: '2024 年单笔融资额最大的公司',
  companies: [
    { name: 'OpenAI', value: 66, sector: '通用大模型' },
    { name: 'Anthropic', value: 65, sector: '通用大模型' },
    { name: 'xAI', value: 50, sector: '通用大模型' },
    { name: 'CoreWeave', value: 11, sector: 'AI 基础设施' },
    { name: 'Safe Superintelligence', value: 10, sector: '通用大模型' },
    { name: 'Scale AI', value: 10, sector: 'AI 基础设施' },
    { name: 'Figure AI', value: 6.8, sector: 'AI 硬件' },
    { name: 'Perplexity AI', value: 5.2, sector: '垂直应用' },
    { name: 'Databricks', value: 5.0, sector: 'AI 基础设施' },
    { name: 'Glean', value: 2.6, sector: '垂直应用' },
  ],
  unit: '亿美元',
  caption: '部分公司当年有多轮融资，此处仅列其最大单笔 · 头部三家通用大模型公司断层领先',
  // tweakable
  itemCount: 10,
  highlight: true,
  highlightIndex: 0,
  showValues: true,
  showCaption: true,
  evil: false,
};

export const controls = [
  { key: 'itemCount', label: '展示数量', type: 'number', default: 10, min: 3, max: 10, step: 1, unit: ' 名',
    description: '榜单展示的公司数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一名（如榜首）。' },
  { key: 'highlightIndex', label: '强调第几名', type: 'number', default: 0, min: 0, max: 9, step: 1,
    description: '被强调的公司排名序号（从 0 开始）。' },
  { key: 'showValues', label: '数值标签', type: 'boolean', default: true,
    description: '是否在条形末端显示融资金额。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
  { key: 'evil', label: 'evilcharts 模式', type: 'boolean', default: false,
    description: '切换为 evilcharts 风格：点阵底纹绘图区 + 条面 45° 斜纹 + 条形霓虹辉光。' },
];

export default function Slide06Ranking(props) {
  const p = { ...defaultProps, ...props };
  const list = p.companies.slice(0, Math.max(3, Math.min(p.companies.length, p.itemCount)));
  const max = Math.max(...list.map((c) => c.value));
  const sectors = [];
  list.forEach((c) => { if (!sectors.includes(c.sector)) sectors.push(c.sector); });

  // Each row takes an equal flex share of the band, and the bar is a capped
  // percentage of its row. This fills the band at any count and can never
  // overflow it (rows flex-shrink to fit), so thin bars at high counts and
  // thick bars at low counts both stay inside the plot — in either mode.
  const n = list.length;
  const barPct = 64;                                  // bar height as % of its row slot
  const barCap = 92;                                  // px cap so few-row bars don't balloon
  const valSize = n <= 5 ? 30 : 26;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="green" title={p.title} en={p.en} cn={p.cn} />

      {/* sector legend — colour encodes sector across the bars */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
        {sectors.map((sec) => (
          <span key={sec} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, background: SECTOR_COLORS[sec] || '#5b8def' }} />
            <span style={{ fontSize: 24, color: 'var(--aip-ink-2)', fontWeight: 500 }}>{sec}</span>
          </span>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
        marginTop: 28, marginBottom: 6, overflow: p.evil ? 'visible' : 'hidden',
        ...(p.evil ? { padding: '14px 24px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,.32)', border: '1px solid rgba(255,255,255,.55)', ...EVIL_DOTS } : {}) }}>
        {list.map((c, i) => {
          const color = SECTOR_COLORS[c.sector] || '#5b8def';
          const on = p.highlight && i === p.highlightIndex;
          const dim = p.highlight && !on;
          const w = Math.max(8, (c.value / max) * 100);
          return (
            <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 22,
              opacity: dim ? 0.55 : 1, transition: 'opacity .3s ease' }}>
              <div style={{ width: 56, textAlign: 'right', fontSize: 32, fontWeight: 900,
                color: on ? color : 'var(--aip-ink-3)', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</div>
              <div style={{ width: 420, fontSize: 30, fontWeight: 700, color: 'var(--aip-ink)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
              <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: `${w}%`, height: `${barPct}%`, maxHeight: barCap, minHeight: 24, borderRadius: 11,
                  background: p.evil ? `${EVIL_HATCH}, linear-gradient(90deg, ${hexA(color, 0.95)}, ${hexA(color, 0.55)})` : `linear-gradient(90deg, ${hexA(color, 0.95)}, ${hexA(color, 0.55)})`,
                  border: on ? `2px solid ${color}` : `1px solid ${hexA(color, 0.4)}`,
                  boxShadow: p.evil
                    ? (on ? `0 0 0 1px ${hexA(color, .5)}, 0 0 34px ${hexA(color, .5)}, 0 12px 28px ${hexA(color, .4)}`
                          : `0 0 0 1px ${hexA(color, .4)}, 0 0 18px ${hexA(color, .28)}, 0 6px 16px ${hexA(color, .18)}`)
                    : (on ? `0 12px 28px ${hexA(color, 0.4)}` : '0 6px 16px rgba(70,90,180,.12)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 18,
                  transition: 'all .3s ease',
                }}>
                  {p.showValues && (
                    <span style={{ fontSize: on ? valSize + 2 : valSize, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap',
                      textShadow: '0 1px 2px rgba(0,0,0,.25)' }}>{c.value}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 24 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
