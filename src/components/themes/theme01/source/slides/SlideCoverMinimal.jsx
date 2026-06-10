// SlideCoverMinimal.jsx — 封面 · 居中 · 玻璃光球大字。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；aip- 作用域。
//
// 版式（居中，区别于双栏/便当/标尺三页）：通栏居中。顶部一枚招牌「玻璃光球」（轻拟态
// 高光球体），其下 mono EN kicker，中央超大标题（次行套 荧光高亮 + 微旋贴纸），副标、
// 一排贴纸化药丸、mono 元信息。四角散落柔光 bokeh 光斑。全程浅色磨砂玻璃 + 单一
// accent，底部 */ … /* mono 脚注。
import React from 'react';
import { SlideFrame, hexA } from './SlideKit.jsx';

export const defaultProps = {
  enKicker: 'GLOBAL BRAND GROWTH',
  titleTop: '全球品牌',
  titleBottom: '增长白皮书',
  subtitle: '从规模扩张到价值深耕',
  pills: ['增长飞轮', '价值复利', '长期主义'],
  meta: '2026 年度版 · 灯塔研究院',
  footnote: '灯塔研究院 · 全球品牌增长研究 · 2026',
  pillCount: 3,
  showOrb: true,
  showSubtitle: true,
  showBokeh: true,
  accentColor: '#46b083',
  showCaption: true,
};

export const controls = [
  { key: 'pillCount', label: '关键词药丸', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 枚',
    description: '副标下方贴纸化关键词药丸的数量。' },
  { key: 'showOrb', label: '玻璃光球', type: 'boolean', default: true,
    description: '标题上方招牌玻璃高光球体的显示。' },
  { key: 'showSubtitle', label: '副标题', type: 'boolean', default: true,
    description: '主标题下方副标题的显示。' },
  { key: 'showBokeh', label: '柔光光斑', type: 'boolean', default: true,
    description: '四角散落柔光 bokeh 光斑的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '光球、荧光高亮、光斑与首枚药丸的主题色。' },
  { key: 'showCaption', label: '脚注说明', type: 'boolean', default: true,
    description: '底部 */ … /* mono 脚注的显示。' },
];

const MONO = "'Space Mono', monospace";

function Orb({ ac, size }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative',
      background: `radial-gradient(circle at 36% 28%, #ffffff 0%, rgba(255,255,255,.6) 24%, ${hexA(ac, 0.55)} 58%, ${hexA(ac, 0.3)} 100%)`,
      boxShadow: `inset 0 -16px 38px ${hexA(ac, 0.44)}, inset 10px 12px 26px rgba(255,255,255,.92), 0 40px 78px ${hexA(ac, 0.32)}` }}>
      <div style={{ position: 'absolute', top: '15%', left: '22%', width: '28%', height: '18%', borderRadius: '50%',
        background: 'rgba(255,255,255,.92)', filter: 'blur(3px)', transform: 'rotate(-24deg)' }}></div>
    </div>
  );
}

export default function SlideCoverMinimal(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const pills = (p.pills || []).slice(0, Math.max(0, Math.min(3, p.pillCount)));

  return (
    <SlideFrame bg="b">
      {/* 柔光 bokeh 光斑 */}
      {p.showBokeh && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '8%', top: '16%', width: 240, height: 240, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${hexA(ac, 0.34)}, transparent 70%)`, filter: 'blur(8px)' }}></div>
          <div style={{ position: 'absolute', right: '7%', top: '22%', width: 150, height: 150, borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 34%, rgba(255,255,255,.85), transparent 72%)', filter: 'blur(4px)' }}></div>
          <div style={{ position: 'absolute', right: '13%', bottom: '14%', width: 300, height: 300, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 36%, ${hexA(ac, 0.2)}, transparent 70%)`, filter: 'blur(10px)' }}></div>
          <div style={{ position: 'absolute', left: '15%', bottom: '20%', width: 64, height: 64, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${hexA(ac, 0.5)}, transparent 72%)`, filter: 'blur(2px)' }}></div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, flex: '1 1 0%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 0 }}>
        {p.showOrb && (
          <div style={{ marginBottom: 26 }}><Orb ac={ac} size={150} /></div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: ac }}></span>
          <span style={{ fontFamily: MONO, textTransform: 'uppercase', letterSpacing: '.34em',
            fontSize: 27, fontWeight: 700, color: 'var(--aip-ink-2)' }}>{p.enKicker}</span>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: ac }}></span>
        </div>

        <h1 style={{ margin: '26px 0 0', fontSize: 142, fontWeight: 900, lineHeight: 1.04,
          letterSpacing: '.02em', color: 'var(--aip-ink)' }}>
          <span style={{ display: 'block' }}>{p.titleTop}</span>
          <span style={{ display: 'block', marginTop: 10 }}>
            <span style={{ display: 'inline-block', padding: '0 .2em', borderRadius: 18, transform: 'rotate(-1.6deg)',
              background: `linear-gradient(transparent 0 14%, ${hexA(ac, 0.32)} 14% 90%, transparent 90%)`,
              boxShadow: `0 18px 44px -22px ${hexA(ac, 0.7)}` }}>{p.titleBottom}</span>
          </span>
        </h1>

        {p.showSubtitle && (
          <div style={{ marginTop: 32, fontSize: 44, fontWeight: 700, color: '#7e7f8a', letterSpacing: '.02em' }}>{p.subtitle}</div>
        )}

        {pills.length > 0 && (
          <div style={{ display: 'flex', gap: 18, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {pills.map((t, i) => {
              const rot = [-2.6, 1.6, -1.4][i % 3];
              const solid = i === 0;
              return (
                <span key={i} style={{
                  padding: '14px 32px', borderRadius: 16, fontSize: 28, fontWeight: 800, whiteSpace: 'nowrap',
                  transform: `rotate(${rot}deg)`,
                  background: solid ? ac : 'rgba(255,255,255,.72)',
                  color: solid ? '#fff' : 'var(--aip-ink)',
                  border: solid ? `1px solid ${hexA(ac, 0.6)}` : '1px solid rgba(255,255,255,.9)',
                  boxShadow: solid
                    ? `0 18px 40px ${hexA(ac, 0.36)}`
                    : '0 1px 0 rgba(255,255,255,.8) inset, 0 14px 32px rgba(70,72,100,.14)',
                }}>{t}</span>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 26, letterSpacing: '.1em', color: 'var(--aip-ink-3)' }}>{p.meta}</div>
      </div>

      {p.showCaption && (
        <div className="aip-mono" style={{ position: 'relative', zIndex: 1, marginTop: 0 }}>{`*/ `}{p.footnote}{` /*`}</div>
      )}
    </SlideFrame>
  );
}
