// SlideGallery.jsx — 图集 / adaptive image montage with sticker captions.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// The composition rebalances for 1–5 slots so it stays handsome at any count,
// and every slot adapts to the uploaded image's ratio (cover crop / contain fit)
// without distortion. Each slot carries an optional sticker caption (label +
// amount) echoing the tag/label reference.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, ImageSlot, CollageImageArea, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 横向透视',
  title: '头部玩家掠影',
  en: 'Top Players at a Glance',
  cn: '2024 年单笔融资最大的几家公司',
  items: [
    { label: 'OpenAI', sub: '通用大模型', amount: '66 亿', tone: 'blue' },
    { label: 'Anthropic', sub: '通用大模型', amount: '65 亿', tone: 'violet' },
    { label: 'xAI', sub: '通用大模型', amount: '50 亿', tone: 'green' },
    { label: 'CoreWeave', sub: 'AI 基础设施', amount: '11 亿', tone: 'amber' },
    { label: 'Figure AI', sub: 'AI 硬件 · 人形机器人', amount: '6.8 亿', tone: 'red' },
  ],
  images: ['', '', '', '', ''],
  caption: '图集 · 一屏看清头部阵容',
  // tweakable (universal names)
  imageSlotCount: 3,
  imageFit: 'cover',
  imageLayout: 'normal',
  showCaptions: true,
  highlight: true,
  highlightIndex: 0,
  accentColor: '#c9f24d',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 3, min: 1, max: 5, step: 1, unit: ' 张',
    description: '图片槽数量；构图会按数量自动重排，1–5 张都保持美观。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满构图统一，完整自适应按原始比例显示不裁切。' },
  { key: 'imageLayout', label: '图片版式', type: 'select', default: 'normal',
    options: [{ value: 'normal', label: '整齐拼图' }, { value: 'collage', label: '叠放拼贴' }],
    description: '整齐：网格拼图；叠放拼贴：图片倾斜叠压、白边浮起的拼贴效果。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传图片（数量由「图片数量」控制），槽位自适应图片比例。' },
  { key: 'showCaptions', label: '贴纸标签', type: 'boolean', default: true,
    description: '是否在每张图片上叠加「名称 + 金额」贴纸标签。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否给其中一个槽位加荧光描边强调。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的槽位序号（从 0 开始）。' },
  { key: 'accentColor', label: '荧光色', type: 'color', default: '#c9f24d',
    options: ['#c9f24d', '#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '强调描边与金额贴纸的荧光色。' },
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

function Slot({ i, src, fit, item, showCaptions, on, accent }) {
  const tilt = (i % 2 === 0 ? -1 : 1) * 1.2;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden',
      outline: on ? `4px solid ${accent}` : 'none', outlineOffset: on ? -4 : 0,
      boxShadow: on ? `0 22px 52px ${hexA(accent, 0.5)}` : '0 18px 44px rgba(70,72,100,.16)' }}>
      <ImageSlot src={src || ''} placeholder={item ? item.label : `图片 ${i + 1}`} fit={fit}
        ratioMode="fill" accent="#5b8def" radius={22} style={{ height: '100%' }} />
      {showCaptions && item && (
        <>
          {/* bottom scrim for legibility over photos */}
          {src && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(20,20,28,.55), transparent 42%)', pointerEvents: 'none' }} />}
          <div style={{ position: 'absolute', left: 18, bottom: 18, display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', padding: '9px 18px', borderRadius: 12, background: '#23232a',
              color: '#fff', fontWeight: 900, fontSize: 30, transform: `rotate(${tilt}deg)`,
              boxShadow: '0 12px 28px rgba(20,20,28,.4)', whiteSpace: 'nowrap' }}>{item.label}</span>
            {item.amount && (
              <span style={{ display: 'inline-block', padding: '7px 15px', borderRadius: 11, background: accent,
                color: readableOn(accent), fontWeight: 900, fontSize: 25, transform: `rotate(${-tilt}deg)`,
                boxShadow: `0 12px 26px ${hexA(accent, 0.5)}`, whiteSpace: 'nowrap' }}>{item.amount}</span>
            )}
          </div>
          {item.sub && (
            <span style={{ position: 'absolute', left: 20, top: 18, padding: '6px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,.86)', color: '#23232a', fontWeight: 700, fontSize: 23,
              boxShadow: '0 8px 20px rgba(70,72,100,.18)', whiteSpace: 'nowrap' }}>{item.sub}</span>
          )}
        </>
      )}
    </div>
  );
}

export default function SlideGallery(props) {
  const p = { ...defaultProps, ...props };
  const n = Math.max(1, Math.min(5, p.imageSlotCount));
  const cell = (i) => (
    <Slot key={i} i={i} src={p.images[i]} fit={p.imageFit} item={p.items[i]}
      showCaptions={p.showCaptions} on={p.highlight && i === p.highlightIndex} accent={p.accentColor} />
  );

  const renderBadge = (i) => {
    const item = p.items[i];
    if (!p.showCaptions || !item) return null;
    return (
      <>
        {p.images[i] && <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(20,20,28,.55), transparent 46%)', pointerEvents: 'none' }} />}
        <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-block', padding: '7px 14px', borderRadius: 11, background: '#23232a',
            color: '#fff', fontWeight: 900, fontSize: 25, boxShadow: '0 12px 28px rgba(20,20,28,.4)', whiteSpace: 'nowrap' }}>{item.label}</span>
          {item.amount && (
            <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 10, background: p.accentColor,
              color: readableOn(p.accentColor), fontWeight: 900, fontSize: 22,
              boxShadow: `0 12px 26px ${hexA(p.accentColor, 0.5)}`, whiteSpace: 'nowrap' }}>{item.amount}</span>
          )}
        </div>
      </>
    );
  };

  let grid = null;
  if (p.imageLayout === 'collage') {
    grid = <CollageImageArea count={n} images={p.images} fit={p.imageFit} accent={p.accentColor}
      accentFront={p.highlight} renderBadge={renderBadge} />;
  } else if (n === 1) {
    grid = <div style={{ height: '100%' }}>{cell(0)}</div>;
  } else if (n === 2) {
    grid = <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      <div style={{ flex: 1 }}>{cell(0)}</div><div style={{ flex: 1 }}>{cell(1)}</div></div>;
  } else if (n === 3) {
    grid = <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      <div style={{ flex: 1.4 }}>{cell(0)}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ flex: 1 }}>{cell(1)}</div><div style={{ flex: 1 }}>{cell(2)}</div></div></div>;
  } else if (n === 4) {
    grid = <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 24, height: '100%' }}>
      {[0, 1, 2, 3].map(cell)}</div>;
  } else {
    grid = <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      <div style={{ flex: 1.5 }}>{cell(0)}</div>
      <div style={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 24 }}>
        {[1, 2, 3, 4].map(cell)}</div></div>;
  }

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="green" title={p.title} en={p.en} cn={p.cn} />
      <div style={{ flex: 1, minHeight: 0, marginTop: 12, marginBottom: 26 }}>{grid}</div>
      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
