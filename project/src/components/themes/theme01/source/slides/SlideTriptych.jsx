// SlideTriptych.jsx — 三联满版影像 / full-bleed editorial triptych.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Three (1–3) edge-to-edge image panels under a floating glass head plate; each
// panel carries a giant mono index, a sticker tag and a bottom caption over a
// dark gradient. A distinct image archetype vs the deck's grid/strip/collage:
// big, magazine-spread imagery. Slots self-fit any aspect ratio (cover/contain,
// no distortion); panel count, fit, highlight, accent tweakable. Self-contained.
import React from 'react';
import { SlideFrame, Tag, ImageSlot, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '前沿现场 · 资本投向何处',
  tone: 'violet',
  title: '钱，最终砸向了这三件事',
  en: 'Where The Capital Lands',
  panels: [
    { tag: '训练集群', tagTone: 'blue', heading: '超大规模训练', sub: '十万卡级集群，是大模型的入场券' },
    { tag: '具身智能', tagTone: 'violet', heading: '走进物理世界', sub: '人形机器人从演示走向量产' },
    { tag: '算力基建', tagTone: 'amber', heading: '卖铲子的人', sub: '数据中心与电力成为新的稀缺' },
  ],
  images: ['', '', ''],
  caption: '满版影像 · 训练、具身、基建——资本叙事的三个落点',
  // tweakable (universal names)
  imageSlotCount: 3,
  imageFit: 'cover',
  highlight: true,
  highlightIndex: 1,
  accentColor: '#7a5ae0',
  showIndex: true,
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '画面数量', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 联',
    description: '满版画面联数（1 单幅 / 2 双联 / 3 三联），每幅自适应所配图片比例。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满铺满画面，完整自适应按原始比例显示。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传满版画面，槽位自适应图片比例不变形。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮其中一联（主题色描边 + 强调标签）。' },
  { key: 'highlightIndex', label: '强调第几联', type: 'number', default: 1, min: 0, max: 2, step: 1,
    description: '被强调的画面序号（从 0 开始）。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '头牌、强调描边与高亮标签的颜色。' },
  { key: 'showIndex', label: '巨型序号', type: 'boolean', default: true,
    description: '每联左上角超大 01 / 02 / 03 序号的显示。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const TONE = { red: '#e8503a', blue: '#5b8def', green: '#46b083', amber: '#e0a23a', violet: '#7a5ae0' };

export default function SlideTriptych(props) {
  const p = { ...defaultProps, ...props };
  const n = Math.max(1, Math.min(3, p.imageSlotCount));
  const panels = p.panels.slice(0, n);
  const ac = p.accentColor;

  return (
    <SlideFrame bg="b">
      <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 8, background: '#0c0c10' }}>
        {panels.map((pn, i) => {
          const on = p.highlight && i === p.highlightIndex;
          const tagCol = on ? ac : (TONE[pn.tagTone] || ac);
          return (
            <div key={i} style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}>
              <ImageSlot slot={i} src={p.images[i] || ''} placeholder={`满版影像 ${i + 1}`} fit={p.imageFit}
                ratioMode="fill" accent={tagCol} radius={0}
                style={{ height: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }} />

              {/* darkening gradient for legible overlay text */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(180deg, rgba(10,10,16,.5) 0%, rgba(10,10,16,0) 26%, rgba(10,10,16,0) 48%, rgba(10,10,16,.82) 100%)' }} />

              {/* accent ring for the highlighted panel */}
              {on && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                boxShadow: `inset 0 0 0 5px ${ac}`, zIndex: 4 }} />}

              {/* giant index */}
              {p.showIndex && (
                <div style={{ position: 'absolute', top: 30, left: 36, zIndex: 3,
                  fontFamily: "'Space Mono', monospace", fontSize: 116, fontWeight: 700, lineHeight: 0.9,
                  color: 'rgba(255,255,255,.9)', textShadow: '0 6px 24px rgba(0,0,0,.4)',
                  letterSpacing: '-.02em' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              )}

              {/* sticker tag */}
              <div style={{ position: 'absolute', top: 44, right: 32, zIndex: 3, transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
                <Tag tone={on ? undefined : pn.tagTone} style={on ? {
                  background: ac, color: '#fff', fontSize: 28, padding: '8px 20px',
                  boxShadow: `0 14px 32px ${hexA(ac, 0.5)}`,
                } : { fontSize: 28, padding: '8px 20px', boxShadow: '0 10px 24px rgba(0,0,0,.28)' }}>{pn.tag}</Tag>
              </div>

              {/* bottom caption */}
              <div style={{ position: 'absolute', left: 36, right: 32, bottom: 40, zIndex: 3 }}>
                <div style={{ width: 56, height: 5, borderRadius: 3, background: tagCol, marginBottom: 16,
                  boxShadow: `0 0 16px ${hexA(tagCol, 0.7)}` }} />
                <div style={{ fontSize: n === 1 ? 72 : 44, fontWeight: 900, color: '#fff', lineHeight: 1.05,
                  letterSpacing: '.01em', textShadow: '0 4px 18px rgba(0,0,0,.5)', textWrap: 'balance' }}>
                  {pn.heading}
                </div>
                <div style={{ marginTop: 12, fontSize: n === 1 ? 32 : 26, fontWeight: 500, lineHeight: 1.35,
                  color: 'rgba(255,255,255,.84)', textShadow: '0 2px 10px rgba(0,0,0,.5)', textWrap: 'pretty',
                  maxWidth: n === 1 ? 900 : '100%' }}>
                  {pn.sub}
                </div>
              </div>
            </div>
          );
        })}

        {/* floating glass head plate */}
        <div style={{ position: 'absolute', top: 40, left: 48, zIndex: 6, maxWidth: 760,
          background: 'rgba(255,255,255,.62)', backdropFilter: 'blur(26px) saturate(150%)',
          WebkitBackdropFilter: 'blur(26px) saturate(150%)', border: '1px solid rgba(255,255,255,.8)',
          borderRadius: 24, padding: '22px 30px 24px',
          boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 26px 60px rgba(20,20,40,.32)' }}>
          <Tag tone={p.tone}>{p.kicker}</Tag>
          <div style={{ marginTop: 16, fontSize: 60, fontWeight: 900, color: 'var(--aip-ink)',
            lineHeight: 1.04, letterSpacing: '.01em', textWrap: 'balance' }}>{p.title}</div>
          <div className="aip-en" style={{ marginTop: 12, fontSize: 24 }}>{p.en}</div>
        </div>

        {/* mono caption pinned bottom-right over the gradient */}
        {p.showCaption && (
          <div style={{ position: 'absolute', right: 36, bottom: 18, zIndex: 6,
            fontFamily: "'Space Mono', monospace", fontSize: 20, letterSpacing: '.02em',
            color: 'rgba(255,255,255,.66)', textShadow: '0 2px 8px rgba(0,0,0,.5)' }}>
            {`*/ `}{p.caption}{` /*`}
          </div>
        )}
      </div>
    </SlideFrame>
  );
}
