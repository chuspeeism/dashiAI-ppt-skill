// SlideCoverMasthead.jsx — 封面 · 磨砂玻璃 hero 刊头牌。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；aip- 作用域。
//
// 版式（区别于双栏/居中/便当三页）：一块占据画面主体的大型「磨砂玻璃刊头牌」微旋
// 漂浮——内含 EN 眉题 + 超大标题（次行套荧光高亮）+ 副标 + 内嵌规格指标条；右上角钉
// 一枚贴纸化标签，牌体浮于满版柔光 bokeh 之上。顶部一行 masthead（kicker 贴纸 + 玻璃
// 期号牌）。浅色磨砂玻璃 + 单一 accent，底部 */ … /* mono 脚注。
import React from 'react';
import { SlideFrame, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '年度旗舰 · 2026',
  issue: 'VOL.07 · 2026.06',
  overline: 'ANNUAL MARKET INSIGHT',
  titleTop: '年度市场',
  titleBottom: '洞察报告',
  subtitle: '横纵双维，十二大主题深度透视。',
  sticker: '年度旗舰',
  stats: [
    { value: '12 大', label: '研究主题' },
    { value: '240+', label: '关键数据点' },
    { value: '18 个', label: '覆盖行业' },
  ],
  footnote: '灯塔研究院 · 年度市场洞察 · 2026',
  statCount: 3,
  showSticker: true,
  showBokeh: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'statCount', label: '规格指标', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 项',
    description: '刊头牌底部内嵌规格指标条的项数（自动均分）。' },
  { key: 'showSticker', label: '贴纸标签', type: 'boolean', default: true,
    description: '刊头牌右上角贴纸化标签的显示。' },
  { key: 'showBokeh', label: '柔光光斑', type: 'boolean', default: true,
    description: '牌体背后满版柔光 bokeh 光斑的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: 'kicker、荧光高亮、贴纸与首项指标的主题色。' },
  { key: 'showCaption', label: '脚注说明', type: 'boolean', default: true,
    description: '底部 */ … /* mono 脚注的显示。' },
];

const MONO = "'Space Mono', monospace";

export default function SlideCoverMasthead(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const stats = (p.stats || []).slice(0, Math.max(1, Math.min(3, p.statCount)));

  return (
    <SlideFrame bg="b">
      {/* 满版柔光 bokeh */}
      {p.showBokeh && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '4%', top: '10%', width: 300, height: 300, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${hexA(ac, 0.3)}, transparent 70%)`, filter: 'blur(10px)' }}></div>
          <div style={{ position: 'absolute', right: '5%', top: '14%', width: 150, height: 150, borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 34%, rgba(255,255,255,.85), transparent 72%)', filter: 'blur(4px)' }}></div>
          <div style={{ position: 'absolute', right: '8%', bottom: '8%', width: 320, height: 320, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 36%, ${hexA(ac, 0.22)}, transparent 70%)`, filter: 'blur(12px)' }}></div>
          <div style={{ position: 'absolute', left: '12%', bottom: '12%', width: 64, height: 64, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${hexA(ac, 0.5)}, transparent 72%)`, filter: 'blur(2px)' }}></div>
        </div>
      )}

      {/* 顶部 masthead 行 */}
      <div style={{ position: 'relative', zIndex: 2, flex: '0 0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 13, padding: '12px 26px',
          borderRadius: 13, background: '#23232a', boxShadow: '0 12px 28px rgba(20,20,28,.28)' }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: ac }}></span>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '.04em', color: '#fff', whiteSpace: 'nowrap' }}>{p.kicker}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 13,
          background: 'rgba(255,255,255,.62)', border: '1px solid rgba(255,255,255,.85)',
          boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 12px 28px rgba(70,72,100,.12)' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: ac }}></span>
          <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '.12em', color: 'var(--aip-ink-2)', whiteSpace: 'nowrap' }}>{p.issue}</span>
        </span>
      </div>

      {/* 中部 · 磨砂玻璃 hero 刊头牌 */}
      <div style={{ position: 'relative', zIndex: 1, flex: '1 1 0%', minHeight: 0,
        display: 'flex', alignItems: 'center' }}>
        <div className="aip-glass" style={{ position: 'relative', width: '100%', padding: '58px 70px 52px',
          borderRadius: 36, transform: 'rotate(-0.6deg)', overflow: 'hidden' }}>
          {/* 角落柔色光晕 + 顶部 accent 细线 */}
          <div style={{ position: 'absolute', top: -110, right: -80, width: 360, height: 360, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 40%, ${hexA(ac, 0.24)}, transparent 70%)`, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', left: 70, top: 0, width: 132, height: 7, borderRadius: '0 0 5px 5px',
            background: ac, boxShadow: `0 8px 22px ${hexA(ac, 0.5)}` }}></div>

          {/* 右上贴纸 */}
          {p.showSticker && (
            <span style={{ position: 'absolute', top: 30, right: 44, transform: 'rotate(3deg)',
              display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 14,
              background: ac, color: '#fff', boxShadow: `0 16px 36px ${hexA(ac, 0.42)}` }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'rgba(255,255,255,.9)' }}></span>
              <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{p.sticker}</span>
            </span>
          )}

          <div style={{ position: 'relative', fontFamily: MONO, textTransform: 'uppercase',
            letterSpacing: '.22em', fontSize: 26, fontWeight: 700, color: hexA(ac, 0.95) }}>{p.overline}</div>

          <h1 style={{ position: 'relative', margin: '22px 0 0', fontSize: 124, fontWeight: 900,
            lineHeight: 1.02, letterSpacing: '.014em', color: 'var(--aip-ink)' }}>
            <span style={{ display: 'block' }}>{p.titleTop}</span>
            <span style={{ display: 'block', marginTop: 8 }}>
              <span style={{ display: 'inline-block', padding: '0 .18em', borderRadius: 16, transform: 'rotate(-1.2deg)',
                background: `linear-gradient(transparent 0 14%, ${hexA(ac, 0.3)} 14% 90%, transparent 90%)`,
                boxShadow: `0 16px 40px -22px ${hexA(ac, 0.7)}` }}>{p.titleBottom}</span>
            </span>
          </h1>

          <div style={{ position: 'relative', marginTop: 24, fontSize: 38, fontWeight: 600,
            color: '#7e7f8a', letterSpacing: '.01em' }}>{p.subtitle}</div>

          {/* 内嵌规格指标条 */}
          <div style={{ position: 'relative', marginTop: 40, paddingTop: 32, display: 'flex',
            borderTop: '1px solid rgba(43,43,48,.12)' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: 8,
                paddingLeft: i ? 44 : 0, paddingRight: 24,
                borderLeft: i ? '1px solid rgba(43,43,48,.12)' : 'none' }}>
                <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: i === 0 ? ac : 'var(--aip-ink)' }}>{s.value}</span>
                <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '.08em', color: 'var(--aip-ink-3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {p.showCaption && (
        <div className="aip-mono" style={{ position: 'relative', zIndex: 2, marginTop: 24 }}>{`*/ `}{p.footnote}{` /*`}</div>
      )}
    </SlideFrame>
  );
}
