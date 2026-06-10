// SlideGrowthBars.jsx — 增速排行 / ranked horizontal bar chart.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A sorted bar race: each row carries a mono rank, a label, a value-proportional
// bar that grows from the left axis, and a value chip riding the bar's end. The
// leader (or any chosen row) is promoted to a fluorescent bar with a tilted
// stamp. Bar count / highlight / value chips / sort / accent are tweakable; text
// lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视 · 增长动能',
  tone: 'green',
  title: '增长最快的赛道',
  en: 'Fastest-Growing Tracks',
  cn: '按年同比融资增速排序（2024 vs 2023）',
  unit: '%',
  prefix: '+',
  items: [
    { label: '具身智能 · 机器人', value: 312, meta: 'Figure / 通用机器人' },
    { label: 'AI 编程 · Agent', value: 245, meta: 'Coding Copilot' },
    { label: 'AI 基础设施 · 算力', value: 180, meta: 'CoreWeave / Scale' },
    { label: '企业 AI 应用', value: 120, meta: 'Enterprise Copilot' },
    { label: 'AI 搜索 · 问答', value: 95, meta: 'Perplexity / Glean' },
    { label: '自动驾驶', value: 60, meta: 'Robotaxi' },
  ],
  caption: '条形图 · 具身智能与 AI 编程，是增速最猛的两条新赛道',
  // tweakable (universal names)
  itemCount: 6,
  highlight: true,
  highlightIndex: 0,
  showValues: true,
  showMeta: true,
  sortDesc: true,
  accentColor: '#46b083',
  evil: false,
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '条目数量', type: 'number', default: 6, min: 4, max: 6, step: 1, unit: ' 条',
    description: '排行榜展示的赛道条数。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一条渲染成荧光强调条。' },
  { key: 'highlightIndex', label: '强调第几条', type: 'number', default: 0, min: 0, max: 5, step: 1,
    description: '被强调的条目序号（按当前排序后从 0 开始）。' },
  { key: 'showValues', label: '数值标签', type: 'boolean', default: true,
    description: '每条末端数值胶囊的显示。' },
  { key: 'showMeta', label: '副标说明', type: 'boolean', default: true,
    description: '每条标签下方代表公司 / 说明的显示。' },
  { key: 'sortDesc', label: '降序排列', type: 'boolean', default: true,
    description: '是否按数值从高到低排序（关闭则保留原始顺序）。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '条形与强调条的主题色（单一色家族，逐条递减透明度）。' },
  { key: 'evil', label: 'evilcharts 模式', type: 'boolean', default: false,
    description: '切换为 evilcharts 风格：点阵底纹绘图区 + 条面 45° 斜纹 + 条形霓虹辉光。' },
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

export default function SlideGrowthBars(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  let items = p.items.slice(0, Math.max(4, Math.min(6, p.itemCount)));
  if (p.sortDesc) items = items.slice().sort((a, b) => b.value - a.value);
  const max = Math.max.apply(null, items.map((i) => i.value)) || 1;
  const evil = p.evil;
  const HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)';

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: evil ? 14 : 18, marginTop: evil ? 18 : 24,
        ...(evil ? {
          padding: '24px 32px', borderRadius: 26, border: '1px solid rgba(255,255,255,.6)',
          backgroundColor: 'rgba(255,255,255,.4)',
          backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)',
          backgroundSize: '26px 26px',
          boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 22px 52px rgba(70,72,100,.1)',
        } : {}) }}>
        {items.map((it, i) => {
          const on = p.highlight && i === p.highlightIndex;
          const w = 8 + 92 * (it.value / max);          // bar width %
          const fg = readableOn(ac);
          const grad = on
            ? `linear-gradient(90deg, ${ac}, ${ac})`
            : `linear-gradient(90deg, ${hexA(ac, 0.5 - i * 0.05)}, ${hexA(ac, 0.85 - i * 0.05)})`;
          const barBg = evil ? `${HATCH}, ${grad}` : grad;
          const barShadow = evil
            ? (on
                ? `0 0 0 1px ${hexA(ac, 0.55)}, 0 0 44px ${hexA(ac, 0.55)}, 0 12px 30px ${hexA(ac, 0.4)}, 0 2px 0 rgba(255,255,255,.45) inset`
                : `0 0 0 1px ${hexA(ac, 0.4)}, 0 0 22px ${hexA(ac, 0.32)}, 0 8px 20px ${hexA(ac, 0.22)}`)
            : (on
                ? `0 16px 38px ${hexA(ac, 0.5)}, 0 2px 0 rgba(255,255,255,.4) inset`
                : `0 8px 20px ${hexA(ac, 0.22)}`);
          return (
            <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 26 }}>
              {/* rank */}
              <div style={{ flex: '0 0 86px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 64 : 56, fontWeight: 700,
                  lineHeight: 1, color: on ? ac : hexA('#5a5a70', 0.5) }}>{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* label + bar column */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{it.label}</span>
                  {p.showMeta && it.meta && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 23, color: 'var(--aip-ink-3)', whiteSpace: 'nowrap' }}>{it.meta}</span>
                  )}
                </div>
                {/* track + bar */}
                <div style={{ position: 'relative', width: '100%', height: on ? 46 : 38, borderRadius: 999,
                  background: evil ? hexA('#5a5a70', 0.10) : hexA('#5a5a70', 0.08) }}>
                  <div style={{
                    position: 'relative', width: `${w}%`, height: '100%', borderRadius: 999,
                    transform: on ? 'rotate(-0.5deg)' : 'none',
                    background: barBg,
                    boxShadow: barShadow,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  }}>
                    {p.showValues && (
                      <span style={{
                        position: 'absolute', right: 18, display: 'inline-flex', alignItems: 'baseline', gap: 2,
                        fontWeight: 900, color: fg, whiteSpace: 'nowrap',
                        textShadow: on ? '0 1px 6px rgba(0,0,0,.18)' : '0 1px 4px rgba(0,0,0,.15)',
                      }}>
                        <span style={{ fontSize: on ? 40 : 34 }}>{p.prefix}{it.value}</span>
                        <span style={{ fontSize: on ? 26 : 22 }}>{p.unit}</span>
                      </span>
                    )}
                  </div>
                  {/* value chip outside the bar when bar is short */}
                  {p.showValues && w < 22 && (
                    <span style={{ position: 'absolute', left: `calc(${w}% + 16px)`, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 32, fontWeight: 900, color: ac, whiteSpace: 'nowrap' }}>{p.prefix}{it.value}{p.unit}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 18 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
