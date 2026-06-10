// Slide02Method.jsx — 横纵分析法 / Horizontal & Vertical Analysis.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 研究方法',
  title: '横纵分析法',
  en: 'Horizontal & Vertical Analysis',
  cn: '从两个正交维度切入同一组数据',
  axisA: { tag: '横向', title: '空间维度', en: 'HORIZONTAL',
    desc: '同一时间截面上，对公司、赛道、轮次、地区横向对比——谁更大、谁更密集、资源集中在哪里。' },
  axisB: { tag: '纵向', title: '时间维度', en: 'VERTICAL',
    desc: '沿时间轴追踪同一指标的演化——趋势向上还是向下、拐点在何处、节奏是否可持续。' },
  result: '产业链层级结构 · 因果传导关系',
  caption: '两个维度交叉后，可进一步识别产业链的层级结构与因果传导关系',
  // tweakable
  colorA: '#5b8def',
  colorB: '#46b083',
  accentColor: '#e8503a',
  operator: '×',
  tiltAngle: 10,
  showCaption: true,
};

export const controls = [
  { key: 'colorA', label: '横向 颜色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#7a5ae0', '#46b083', '#e8503a'], description: '横向（空间维度）卡片配色。' },
  { key: 'colorB', label: '纵向 颜色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#e8503a'], description: '纵向（时间维度）卡片配色。' },
  { key: 'accentColor', label: '交叉 强调色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#e0a23a', '#7a5ae0', '#5b8def'], description: '交叉节点与结果条的强调色。' },
  { key: 'operator', label: '交叉符号', type: 'select', default: '×',
    options: [{ value: '×', label: '×' }, { value: '+', label: '+' }, { value: '⊗', label: '⊗' }],
    description: '两个维度之间的运算符号。' },
  { key: 'tiltAngle', label: '倾斜角度', type: 'number', default: 10, min: 0, max: 24, step: 1, unit: '°',
    description: '两张卡片向中心汇聚的 3D 倾斜角度（左卡向右、右卡向左）；0° 为平面。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
];

function AxisCard({ color, tag, title, en, desc, tilt = 0 }) {
  return (
    <div style={{
      flex: 1, position: 'relative', padding: '36px 38px 38px', borderRadius: 24,
      transform: tilt ? `perspective(1900px) rotateY(${tilt}deg)` : 'none', transformOrigin: 'center',
      background: `linear-gradient(160deg, ${hexA(color, 0.16)}, ${hexA(color, 0.05)})`,
      border: `1px solid ${hexA(color, 0.32)}`,
      boxShadow: `0 1px 0 rgba(255,255,255,.7) inset, 0 22px 50px ${hexA(color, 0.14)}`,
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 8, background: color,
        color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: '.04em' }}>{tag}</div>
      <div style={{ marginTop: 22, fontSize: 52, fontWeight: 900, color: '#2b2b30', letterSpacing: '.01em' }}>{title}</div>
      <div style={{ marginTop: 6, fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: '.12em',
        color: hexA(color, 0.85), textTransform: 'uppercase' }}>{en}</div>
      <div style={{ marginTop: 20, fontSize: 27, lineHeight: 1.55, color: '#56565c', textWrap: 'pretty' }}>{desc}</div>
    </div>
  );
}

export default function Slide02Method(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accentColor;
  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="red" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 34 }}>
            <AxisCard color={p.colorA} {...p.axisA} tilt={p.tiltAngle} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <div style={{
                width: 92, height: 92, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 50, fontWeight: 700, color: '#fff', lineHeight: 1,
                background: accent, border: '4px solid rgba(255,255,255,.92)',
                boxShadow: `0 10px 26px ${hexA(accent, 0.42)}`,
              }}>{p.operator}</div>
            </div>
            <AxisCard color={p.colorB} {...p.axisB} tilt={p.tiltAngle ? -p.tiltAngle : 0} />
          </div>

          <div style={{ height: 30 }} />

          <div style={{
            display: 'flex', alignItems: 'center', gap: 24, padding: '30px 40px', borderRadius: 22,
            background: 'rgba(255,255,255,.55)', border: '1px solid rgba(255,255,255,.75)',
            boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 22px 50px rgba(80,80,110,.14)',
            backdropFilter: 'blur(22px)',
          }}>
            <div style={{ flex: '0 0 auto', padding: '8px 16px', borderRadius: 9, background: accent,
              color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: '.04em' }}>交叉</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#2b2b30' }}>{p.result}</div>
          </div>
        </div>
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
