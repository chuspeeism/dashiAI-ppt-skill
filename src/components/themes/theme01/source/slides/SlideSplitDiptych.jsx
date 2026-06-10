// SlideSplitDiptych.jsx — 满版对比 · 双联画面 / full-bleed two-up image page.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Two edge-to-edge image halves carry corner sticker tags; a rotated glass
// "verdict" plate bridges the seam with the thesis + a left-vs-right contrast
// stat. Image slots adapt to any uploaded ratio (cover/contain, never warped);
// slot count, the lit side, tags and plate are all tweakable. Text in props.
import React from 'react';
import { SlideFrame, ImageSlot, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '风险与展望',
  title: '一半繁荣，一半审视',
  en: 'Boom on One Side, Scrutiny on the Other',
  left: { tag: '叙事估值', en: 'THE NARRATIVE', stat: '1000', unit: '×', statLabel: '头部估值 / 收入倍数', placeholder: '繁荣现场 · 发布会 / 融资', color: '#e0a23a' },
  right: { tag: '真实兑现', en: 'THE DELIVERY', stat: '< 5', unit: '%', statLabel: '实现收入的公司占比', placeholder: '审视时刻 · 财报 / 算力账单', color: '#5b8def' },
  verdict: '资本的下一阶段，从「赌叙事」转向「看兑现」。',
  caption: '满版双联 · 估值的天平，正在向真金白银倾斜',
  images: ['', ''],
  // tweakable (universal names)
  imageSlotCount: 2,
  imageFit: 'cover',
  showTags: true,
  showPlate: true,
  showStats: true,
  highlightSide: 'right',
  accentColor: '#e8503a',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片槽数量', type: 'number', default: 2, min: 0, max: 2, step: 1, unit: ' 张',
    description: '0 = 双占位 · 1 = 左图 + 右占位 · 2 = 双图。两侧均按上传图比例自适应。' },
  { key: 'imageFit', label: '图片裁切', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '上传图按裁剪填满或保留完整画面。' },
  { key: 'images', label: '上传图片', type: 'images', countKey: 'imageSlotCount',
    description: '左 / 右两侧的画面。' },
  { key: 'showTags', label: '角标贴纸', type: 'boolean', default: true,
    description: '两侧角标贴纸的显示。' },
  { key: 'showPlate', label: '中央断言卡', type: 'boolean', default: true,
    description: '横跨接缝的中央玻璃断言卡显示。' },
  { key: 'showStats', label: '对比数字', type: 'boolean', default: true,
    description: '断言卡上的左右对比数字显示。' },
  { key: 'highlightSide', label: '点亮一侧', type: 'select', default: 'right',
    options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }, { value: 'none', label: '不强调' }],
    description: '哪一侧的对比数字渲染成荧光强调。' },
  { key: 'accentColor', label: '强调色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0', '#c9f24d'],
    description: '中央卡 kicker 与荧光数字的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function Half({ side, data, hasImage, src, fit, showTag, dim }) {
  const isLeft = side === 'left';
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ImageSlot src={hasImage ? src : ''} placeholder={data.placeholder} fit={fit}
        accent={data.color} radius={0} style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }} />
      {/* readability scrim toward the seam */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(${isLeft ? '90deg' : '270deg'}, transparent 55%, rgba(20,20,28,.28))`,
        opacity: dim ? 1 : 0.7 }} />
      {showTag && (
        <span style={{ position: 'absolute', top: 30, [isLeft ? 'left' : 'right']: 30,
          display: 'inline-flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderRadius: 13,
          background: data.color, color: '#fff', transform: `rotate(${isLeft ? -1.6 : 1.6}deg)`,
          boxShadow: `0 14px 30px ${hexA(data.color, 0.42)}` }}>
          <span style={{ fontSize: 27, fontWeight: 900, whiteSpace: 'nowrap' }}>{data.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, letterSpacing: '.14em', opacity: 0.92 }}>{data.en}</span>
        </span>
      )}
    </div>
  );
}

function MiniStat({ data, lit, accent, align }) {
  const col = lit ? accent : 'var(--aip-ink)';
  return (
    <div style={{ flex: 1, textAlign: align }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: align === 'right' ? 'flex-end' : 'flex-start', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.85, letterSpacing: '-.03em', color: col,
          textShadow: lit ? `0 2px 0 ${hexA(accent, 0.18)}` : 'none' }}>{data.stat}</span>
        <span style={{ fontSize: 30, fontWeight: 900, color: lit ? accent : 'var(--aip-ink-2)' }}>{data.unit}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 600, color: 'var(--aip-ink-2)', lineHeight: 1.3, textWrap: 'pretty' }}>{data.statLabel}</div>
    </div>
  );
}

export default function SlideSplitDiptych(props) {
  const p = { ...defaultProps, ...props };
  const fit = p.imageFit;
  const leftHas = p.imageSlotCount >= 1 && p.images[0];
  const rightHas = p.imageSlotCount >= 2 && p.images[1];
  const litL = p.highlightSide === 'left';
  const litR = p.highlightSide === 'right';

  return (
    <SlideFrame bg="a">
      {/* full-bleed: escape the padded .aip-content */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <Half side="left" data={p.left} hasImage={leftHas} src={p.images[0]} fit={fit} showTag={p.showTags} dim={litR} />
          <Half side="right" data={p.right} hasImage={rightHas} src={p.images[1]} fit={fit} showTag={p.showTags} dim={litL} />
        </div>

        {/* center verdict plate bridging the seam */}
        {p.showPlate && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-1deg)',
            width: 760, maxWidth: '64%', padding: '40px 48px', borderRadius: 28,
            background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(30px) saturate(150%)', WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            border: '1px solid rgba(255,255,255,.85)', boxShadow: '0 1px 0 rgba(255,255,255,.85) inset, 0 40px 90px rgba(40,42,70,.32)' }}>
            <span style={{ display: 'inline-block', padding: '7px 18px', borderRadius: 11, background: p.accentColor, color: '#fff',
              fontSize: 24, fontWeight: 800, letterSpacing: '.04em', whiteSpace: 'nowrap', transform: 'rotate(-1.4deg)', boxShadow: `0 10px 24px ${hexA(p.accentColor, 0.4)}` }}># {p.kicker}</span>
            <h2 style={{ margin: '20px 0 6px', fontSize: 60, fontWeight: 900, lineHeight: 1.08, letterSpacing: '.012em', color: 'var(--aip-ink)', textWrap: 'balance' }}>{p.title}</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.13em', fontSize: 21, color: 'var(--aip-ink-3)' }}>{p.en}</div>

            {p.showStats && (
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 30, marginTop: 26 }}>
                <MiniStat data={p.left} lit={litL} accent={p.accentColor} align="left" />
                <span style={{ width: 1, background: 'rgba(43,43,48,.14)' }} />
                <MiniStat data={p.right} lit={litR} accent={p.accentColor} align="right" />
              </div>
            )}

            <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1px solid rgba(43,43,48,.1)', fontSize: 28, fontWeight: 700, color: 'var(--aip-ink)', lineHeight: 1.4, textWrap: 'pretty' }}>{p.verdict}</div>
          </div>
        )}

        {/* mono caption pinned bottom-left over imagery */}
        {p.showCaption && (
          <div className="aip-mono" style={{ position: 'absolute', left: 'var(--aip-pad-x)', bottom: 40, color: 'rgba(255,255,255,.92)', textShadow: '0 1px 6px rgba(0,0,0,.4)' }}>{`*/ `}{p.caption}{` /*`}</div>
        )}
      </div>
    </SlideFrame>
  );
}
