// SlideCoverEditorial.jsx — 封面 · 编辑式非对称双栏（轻拟态加料版）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；aip- 作用域。
//
// 版式（左重右轻，区别于居中/便当/标尺三页）：左栏巨型标题（次行套 荧光高亮）+ kicker
// 贴纸 + EN + 导语 + 一排贴纸化关键词；右栏一块更有体积的磨砂玻璃「刊头」面板，含招牌
// 玻璃光球 + 大序号 + 竖排元信息。背景散布柔光 bokeh 光斑。浅色磨砂玻璃 + 单一 accent，
// 底部 */ … /* mono 脚注。
import React from 'react';
import { SlideFrame, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '年度报告 · VOL.07',
  titleTop: '新消费趋势',
  titleBottom: '年度报告',
  en: 'Annual Consumer Trends Report',
  lead: '横纵双维，解码一年的消费迁徙与品牌机会。',
  chips: ['消费迁徙', '品牌机会', '增长信号'],
  panelIndex: '07',
  panelEn: 'REPORT · 2026',
  meta: [
    { label: 'EDITION', value: 'Vol. 07' },
    { label: 'RELEASE', value: '2026 · 06' },
    { label: 'ISSUED BY', value: '灯塔研究院' },
  ],
  footnote: '灯塔研究院 · 横纵双维洞察 · 2026 编制',
  metaCount: 3,
  chipCount: 3,
  showLead: true,
  showBokeh: true,
  accentColor: '#5b8def',
  showCaption: true,
};

export const controls = [
  { key: 'metaCount', label: '元信息行数', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 行',
    description: '右侧玻璃面板中竖排元信息的行数。' },
  { key: 'chipCount', label: '关键词贴纸', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 枚',
    description: '导语下方贴纸化关键词的数量。' },
  { key: 'showLead', label: '导语', type: 'boolean', default: true,
    description: '标题下方一句话导语的显示。' },
  { key: 'showBokeh', label: '柔光光斑', type: 'boolean', default: true,
    description: '背景柔光 bokeh 光斑的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: 'kicker、荧光高亮、光球与面板序号的主题色。' },
  { key: 'showCaption', label: '脚注说明', type: 'boolean', default: true,
    description: '底部 */ … /* mono 脚注的显示。' },
];

const MONO = "'Space Mono', monospace";

function Orb({ ac, size }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', flex: '0 0 auto',
      background: `radial-gradient(circle at 36% 28%, #ffffff 0%, rgba(255,255,255,.6) 24%, ${hexA(ac, 0.55)} 58%, ${hexA(ac, 0.3)} 100%)`,
      boxShadow: `inset 0 -12px 28px ${hexA(ac, 0.44)}, inset 8px 9px 20px rgba(255,255,255,.92), 0 26px 54px ${hexA(ac, 0.3)}` }}>
      <div style={{ position: 'absolute', top: '16%', left: '22%', width: '28%', height: '18%', borderRadius: '50%',
        background: 'rgba(255,255,255,.92)', filter: 'blur(2px)', transform: 'rotate(-24deg)' }}></div>
    </div>
  );
}

export default function SlideCoverEditorial(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const meta = (p.meta || []).slice(0, Math.max(1, Math.min(3, p.metaCount)));
  const chips = (p.chips || []).slice(0, Math.max(0, Math.min(3, p.chipCount)));

  return (
    <SlideFrame bg="a">
      {/* 柔光 bokeh 光斑 */}
      {p.showBokeh && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '2%', top: '12%', width: 320, height: 320, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${hexA(ac, 0.26)}, transparent 70%)`, filter: 'blur(10px)' }}></div>
          <div style={{ position: 'absolute', left: '30%', bottom: '6%', width: 220, height: 220, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 34%, ${hexA(ac, 0.18)}, transparent 72%)`, filter: 'blur(10px)' }}></div>
          <div style={{ position: 'absolute', left: '20%', top: '20%', width: 60, height: 60, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${hexA(ac, 0.5)}, transparent 72%)`, filter: 'blur(2px)' }}></div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, flex: '1 1 0%', display: 'flex',
        gap: 60, minHeight: 0, alignItems: 'stretch' }}>
        {/* 左栏 · 标题 */}
        <div style={{ flex: '1 1 0%', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 13,
            padding: '12px 26px', borderRadius: 13, background: '#23232a',
            boxShadow: '0 12px 28px rgba(20,20,28,.28)' }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: ac }}></span>
            <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: '.04em', color: '#fff', whiteSpace: 'nowrap' }}>{p.kicker}</span>
          </span>

          <h1 style={{ margin: '32px 0 0', fontSize: 130, fontWeight: 900, lineHeight: 1.04,
            letterSpacing: '.012em', color: 'var(--aip-ink)' }}>
            <span style={{ display: 'block' }}>{p.titleTop}</span>
            <span style={{ display: 'block', marginTop: 10 }}>
              <span style={{ display: 'inline-block', padding: '0 .18em', borderRadius: 16, transform: 'rotate(-1.4deg)',
                background: `linear-gradient(transparent 0 14%, ${hexA(ac, 0.3)} 14% 90%, transparent 90%)`,
                boxShadow: `0 16px 40px -22px ${hexA(ac, 0.7)}` }}>{p.titleBottom}</span>
            </span>
          </h1>

          <div style={{ marginTop: 26, fontFamily: MONO, textTransform: 'uppercase',
            letterSpacing: '.18em', fontSize: 28, fontWeight: 700, color: hexA(ac, 0.95) }}>{p.en}</div>

          {p.showLead && (
            <p style={{ margin: '22px 0 0', maxWidth: 700, fontSize: 30, lineHeight: 1.5,
              color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.lead}</p>
          )}

          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
              {chips.map((t, i) => {
                const rot = [-2.2, 1.6, -1.4][i % 3];
                return (
                  <span key={i} style={{ padding: '11px 24px', borderRadius: 14, fontSize: 26, fontWeight: 800,
                    whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`, color: 'var(--aip-ink)',
                    background: 'rgba(255,255,255,.72)', border: '1px solid rgba(255,255,255,.9)',
                    boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 12px 28px rgba(70,72,100,.14)' }}>{t}</span>
                );
              })}
            </div>
          )}
        </div>

        {/* 右栏 · 刊头玻璃面板 */}
        <div className="aip-glass" style={{ flex: '0 0 444px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '52px 50px', borderRadius: 30, position: 'relative', overflow: 'hidden' }}>
          {/* 顶部柔色光晕 */}
          <div style={{ position: 'absolute', top: -90, right: -70, width: 280, height: 280, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 38%, ${hexA(ac, 0.26)}, transparent 70%)`, pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30 }}>
            <Orb ac={ac} size={72} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '.16em', color: 'var(--aip-ink-3)' }}>{p.panelEn}</span>
              <span style={{ fontFamily: MONO, fontSize: 80, fontWeight: 700, lineHeight: 0.82,
                letterSpacing: '-.03em', color: ac }}>{p.panelIndex}</span>
            </div>
          </div>

          {meta.map((m, i) => (
            <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8,
              padding: '22px 0', borderTop: i ? '1px solid rgba(43,43,48,.1)' : '1px solid rgba(43,43,48,.1)' }}>
              <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '.16em', color: hexA(ac, 0.9) }}>{m.label}</span>
              <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--aip-ink)', lineHeight: 1.1 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {p.showCaption && (
        <div className="aip-mono" style={{ position: 'relative', zIndex: 1, marginTop: 26 }}>{`*/ `}{p.footnote}{` /*`}</div>
      )}
    </SlideFrame>
  );
}
