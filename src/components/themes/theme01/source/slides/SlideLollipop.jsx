// SlideLollipop.jsx — 棒棒糖图 / ranked lollipop chart.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A sorted lollipop race: each row carries a mono rank, a label + meta, a thin
// stem growing from the left axis, and a value-bearing disc riding its end. It
// reads like a bar chart stripped to its essential signal — the dot's position
// IS the value — so a long ranking stays airy instead of heavy. One row can be
// promoted to a fluorescent, enlarged disc with a glow. Row count / highlight /
// value labels / sort / accent are tweakable; text lives in defaultProps. Pure
// CSS flex — exports cleanly to PDF / PPTX.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视 · 吸金力',
  tone: 'blue',
  title: '哪条赛道最吸金',
  en: 'Capital Magnetism by Track',
  cn: '按赛道平均单笔融资额排序（亿美元）',
  unit: '亿',
  items: [
    { label: '通用大模型', value: 18.4, meta: 'OpenAI / Anthropic / xAI' },
    { label: 'AI 基础设施 · 算力', value: 11.2, meta: 'CoreWeave / Scale' },
    { label: '具身智能 · 机器人', value: 6.8, meta: 'Figure / 通用机器人' },
    { label: 'AI 芯片', value: 5.6, meta: '推理 / 训练芯片' },
    { label: '企业 AI 应用', value: 3.4, meta: 'Enterprise Copilot' },
    { label: 'AI 搜索 · 问答', value: 2.6, meta: 'Perplexity / Glean' },
  ],
  note: '平均单笔 = 该赛道大额融资总额 / 笔数',
  caption: '棒棒糖图 · 通用大模型单笔吸金力断层领先',
  // tweakable (universal names)
  itemCount: 6,
  highlight: true,
  highlightIndex: 0,
  showValues: true,
  showMeta: true,
  showStem: true,
  sortDesc: true,
  accentColor: '#5b8def',
  showNote: true,
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '条目数量', type: 'number', default: 6, min: 4, max: 7, step: 1, unit: ' 条',
    description: '棒棒糖排行展示的赛道条数。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一条渲染成荧光放大的强调棒。' },
  { key: 'highlightIndex', label: '强调第几条', type: 'number', default: 0, min: 0, max: 6, step: 1,
    description: '被强调的条目序号（按当前排序后从 0 开始）。' },
  { key: 'showValues', label: '数值标签', type: 'boolean', default: true,
    description: '圆盘上数值的显示。' },
  { key: 'showMeta', label: '副标说明', type: 'boolean', default: true,
    description: '每条标签下方代表公司 / 说明的显示。' },
  { key: 'showStem', label: '连接棒', type: 'boolean', default: true,
    description: '从左轴到圆盘的连接细棒的显示（关闭则只剩圆盘）。' },
  { key: 'sortDesc', label: '降序排列', type: 'boolean', default: true,
    description: '是否按数值从高到低排序（关闭则保留原始顺序）。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '棒与圆盘的主题色（单一色家族，逐条递减透明度）。' },
  { key: 'showNote', label: '口径说明', type: 'boolean', default: true,
    description: '底部口径小字说明的显示。' },
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

export default function SlideLollipop(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  let items = p.items.slice(0, Math.max(4, Math.min(7, p.itemCount)));
  if (p.sortDesc) items = items.slice().sort((a, b) => b.value - a.value);
  const max = Math.max.apply(null, items.map((i) => i.value)) || 1;
  const fg = readableOn(ac);

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '28px 48px 22px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {items.map((it, i) => {
            const on = p.highlight && i === p.highlightIndex;
            const pos = 4 + 86 * (it.value / max);     // disc-center %
            const discBase = on ? 78 : 60;             // disc diameter px
            const stemGrad = on
              ? `linear-gradient(90deg, ${hexA(ac, 0.65)}, ${ac})`
              : `linear-gradient(90deg, ${hexA(ac, 0.28)}, ${hexA(ac, 0.7 - i * 0.04)})`;
            return (
              <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 22,
                borderTop: i ? '1px solid rgba(43,43,48,.08)' : 'none' }}>
                {/* rank */}
                <div style={{ flex: '0 0 72px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 58 : 50, fontWeight: 700,
                    lineHeight: 1, color: on ? ac : hexA('#5a5a70', 0.42) }}>{String(i + 1).padStart(2, '0')}</span>
                </div>

                {/* label block — fixed width, centered on the SAME line as rank + disc */}
                <div style={{ flex: '0 0 350px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                  <span style={{ fontSize: on ? 36 : 31, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                  {p.showMeta && it.meta && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 21, color: 'var(--aip-ink-3)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.meta}</span>
                  )}
                </div>

                {/* lollipop track */}
                <div style={{ flex: 1, minWidth: 0, position: 'relative', height: discBase }}>
                    {/* baseline tick */}
                    <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: '64%', borderRadius: 2, background: hexA('#5a5a70', 0.18) }} />
                    {/* stem */}
                    {p.showStem && (
                      <span style={{ position: 'absolute', left: 3, top: '50%', transform: 'translateY(-50%)',
                        width: `calc(${pos}% - ${discBase / 2}px)`, height: on ? 12 : 9, borderRadius: 999,
                        background: stemGrad, boxShadow: on ? `0 6px 18px ${hexA(ac, 0.42)}` : 'none' }} />
                    )}
                    {/* disc */}
                    <div style={{ position: 'absolute', left: `${pos}%`, top: '50%',
                      transform: `translate(-50%,-50%) rotate(${on ? -2 : 0}deg)`,
                      width: discBase, height: discBase, borderRadius: '50%',
                      background: on ? ac : `linear-gradient(150deg, ${hexA(ac, 0.92 - i * 0.05)}, ${hexA(ac, 0.66 - i * 0.05)})`,
                      border: on ? `3px solid ${hexA(ac, 0.55)}` : '2px solid rgba(255,255,255,.7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: on
                        ? `0 0 0 6px ${hexA(ac, 0.16)}, 0 16px 36px ${hexA(ac, 0.5)}, 0 2px 0 rgba(255,255,255,.4) inset`
                        : `0 10px 24px ${hexA(ac, 0.3)}, 0 1px 0 rgba(255,255,255,.5) inset` }}>
                      {p.showValues && (
                        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1, color: fg,
                          textShadow: '0 1px 4px rgba(0,0,0,.18)' }}>
                          <span style={{ fontSize: on ? 34 : 27, fontWeight: 900, lineHeight: 1 }}>{it.value}</span>
                        </span>
                      )}
                    </div>
                    {p.showValues && (
                      <span style={{ position: 'absolute', left: `calc(${pos}% + ${discBase / 2 + 14}px)`, top: '50%',
                        transform: 'translateY(-50%)', fontSize: on ? 26 : 22, fontWeight: 800,
                        color: on ? ac : 'var(--aip-ink-3)', whiteSpace: 'nowrap' }}>{p.unit}</span>
                    )}
                  </div>
                </div>
            );
          })}
        </div>

        {p.showNote && (
          <div style={{ flex: '0 0 auto', marginTop: 12, fontFamily: "'Space Mono', monospace",
            fontSize: 19, color: 'var(--aip-ink-3)' }}>{`* `}{p.note}</div>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
