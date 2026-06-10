// SlideDiverging.jsx — 多空信号 / diverging (tornado) bar chart around a center axis.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A frosted card with a single center axis; each factor grows a bar to the RIGHT
// (tailwind / 推力, accent-cool) or LEFT (headwind / 阻力, warm-red) by magnitude,
// with the factor name on the outer end and a strength chip on the bar. Rows sort
// strongest-tailwind to strongest-headwind so the balance reads top-to-bottom.
// One factor can be spotlighted (glow). Factor count, sort, strength chips,
// highlight and accent are tweakable; text + side labels live in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '风险与展望 · 多空信号',
  tone: 'red',
  title: '推力与阻力，谁占上风',
  en: 'Tailwinds vs Headwinds',
  cn: '把驱动与风险放在同一根轴上，看资本天平的倾斜',
  leftLabel: '阻力 · 利空',
  rightLabel: '推力 · 利好',
  posColor: '#46b083',
  negColor: '#e8503a',
  // value > 0 = tailwind (right), value < 0 = headwind (left); |value| = strength 0–100
  factors: [
    { label: '算力需求爆发', value: 88, note: '基建与芯片确定性强' },
    { label: '企业 AI 预算上行', value: 72, note: 'Copilot / Agent 渗透' },
    { label: 'IPO 退出窗口临近', value: 55, note: '一级估值待二级检验' },
    { label: '巨头资源挤压', value: -46, note: '通用大模型马太效应' },
    { label: '监管不确定性', value: -58, note: '安全 / 出口管制' },
    { label: '估值泡沫高企', value: -80, note: '市销率超千倍' },
  ],
  axisMax: 100,
  caption: '双向条形 · 短期推力更强，但泡沫与监管是最大变量',
  // tweakable (universal names)
  itemCount: 6,
  sortDesc: true,
  showValues: true,
  showNote: true,
  highlight: true,
  highlightIndex: 5,
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '因子数量', type: 'number', default: 6, min: 4, max: 6, step: 1, unit: ' 项',
    description: '参与多空对比的因子数量。' },
  { key: 'sortDesc', label: '按强度排序', type: 'boolean', default: true,
    description: '是否从最强推力到最强阻力排序（关闭则保留原始顺序）。' },
  { key: 'showValues', label: '强度数值', type: 'boolean', default: true,
    description: '每根条上强度数值胶囊的显示。' },
  { key: 'showNote', label: '副标说明', type: 'boolean', default: true,
    description: '每项因子名称下方说明小字的显示。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一项渲染成发光强调条。' },
  { key: 'highlightIndex', label: '强调第几项', type: 'number', default: 5, min: 0, max: 5, step: 1,
    description: '被强调的因子序号（按当前排序后从 0 开始）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideDiverging(props) {
  const p = { ...defaultProps, ...props };
  let factors = p.factors.slice(0, Math.max(4, Math.min(6, p.itemCount)));
  if (p.sortDesc) factors = factors.slice().sort((a, b) => b.value - a.value);
  const max = p.axisMax || Math.max.apply(null, factors.map((f) => Math.abs(f.value)));

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '24px 48px 22px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* side legend headers */}
        <div style={{ flex: '0 0 auto', display: 'flex', marginBottom: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: p.negColor }} />
            <span style={{ fontSize: 27, fontWeight: 800, color: p.negColor }}>{p.leftLabel}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <span style={{ fontSize: 27, fontWeight: 800, color: p.posColor }}>{p.rightLabel}</span>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: p.posColor }} />
          </div>
        </div>

        {/* rows */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* center axis */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
            background: 'rgba(43,43,48,.22)', transform: 'translateX(-50%)' }} />
          {factors.map((f, i) => {
            const pos = f.value >= 0;
            const col = pos ? p.posColor : p.negColor;
            const w = (Math.abs(f.value) / max) * 34;          // % of full row per side; the 34 (not 50) reserves an outer-label gutter so the longest bar's name never runs past the slide edge
            const on = p.highlight && i === p.highlightIndex;
            return (
              <div key={i} style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* bar */}
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  [pos ? 'left' : 'right']: '50%', width: `${w}%`, height: on ? '76%' : '64%',
                  [pos ? 'borderRadius' : 'borderRadius']: pos ? '0 13px 13px 0' : '13px 0 0 13px',
                  background: on ? col : `linear-gradient(${pos ? 90 : 270}deg, ${hexA(col, 0.7)}, ${col})`,
                  boxShadow: on ? `0 0 0 2px ${hexA(col, 0.5)}, 0 14px 32px ${hexA(col, 0.42)}` : `0 10px 24px ${hexA(col, 0.26)}`,
                  display: 'flex', alignItems: 'center', justifyContent: pos ? 'flex-start' : 'flex-end' }}>
                  {p.showValues && (
                    <span style={{ padding: '0 14px', fontFamily: "'Space Mono', monospace", fontSize: on ? 30 : 26,
                      fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }}>
                      {Math.abs(f.value)}
                    </span>
                  )}
                </div>
                {/* factor label on the outer end */}
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  [pos ? 'left' : 'right']: `calc(50% + ${w}% + 18px)`,
                  textAlign: pos ? 'left' : 'right', maxWidth: `${50 - w}%` }}>
                  <div style={{ fontSize: on ? 31 : 28, fontWeight: 900, color: on ? col : 'var(--aip-ink)',
                    whiteSpace: 'nowrap' }}>{f.label}</div>
                  {p.showNote && f.note && (
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 19, color: 'var(--aip-ink-3)',
                      whiteSpace: 'nowrap' }}>{f.note}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
