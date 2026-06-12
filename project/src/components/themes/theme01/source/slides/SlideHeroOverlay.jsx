// SlideHeroOverlay.jsx — 全幅图 + 磨砂玻璃浮层 / full-bleed hero with glass plate.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A single edge-to-edge image carries the page; a frosted-glass plate floats at
// the bottom-left with the kicker, an oversized headline (one word can wear a
// fluorescent highlighter) and a row of stat chips — one of which can be
// promoted to a solid fluorescent stamp. The image slot adapts to the uploaded
// picture's own ratio (cover crop / contain fit — never warps); with
// imageSlotCount 0 the dreamy bokeh background shows through instead.
import React from 'react';
import { SlideFrame, ImageSlot, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '前沿 · 新基建',
  title: '算力，就是新的资本',
  highlightWord: '新的资本',
  en: 'Compute Is The New Capital',
  lead: 'GPU 集群与数据中心成为这轮 AI 竞赛的硬通货——谁锁定算力，谁就握住了估值的底层叙事。',
  stats: [
    { value: '158', unit: '亿', label: '算力 / 基础设施融资' },
    { value: '190', unit: '亿', label: 'CoreWeave 估值' },
    { value: '63', unit: '%', label: '资金集中于湾区' },
  ],
  images: [''],
  caption: '满版图片 · 数据中心，资本的新战场',
  // tweakable (universal names)
  imageSlotCount: 1,
  imageFit: 'cover',
  statCount: 3,
  highlight: true,
  highlightIndex: 1,
  showHighlighter: true,
  accentColor: '#e0a23a',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 1, min: 0, max: 1, step: 1, unit: ' 张', countKey: 'imageSlotCount',
    description: '满版背景图数量（0 时显示柔光 bokeh 背景）。' },
  { key: 'images', label: '上传图片', type: 'images', countKey: 'imageSlotCount',
    description: '满版背景图，按图片比例自适应填满（cover / contain）。' },
  { key: 'imageFit', label: '图片适配', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整显示' }],
    description: 'cover 裁剪铺满、contain 完整不裁切。' },
  { key: 'statCount', label: '数据芯片数', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 个',
    description: '玻璃浮层底部数据芯片的数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一个数据芯片渲染成荧光强调款。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 1, min: 0, max: 2, step: 1,
    description: '被强调的数据芯片序号（从 0 开始）。' },
  { key: 'showHighlighter', label: '荧光高亮', type: 'boolean', default: true,
    description: '是否给标题关键词加荧光底纹。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#e0a23a',
    options: ['#e0a23a', '#5b8def', '#46b083', '#e8503a', '#7a5ae0'],
    description: '荧光高亮与强调芯片的颜色。' },
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

function Marked({ text, word, color, on }) {
  if (!word || !on || !text.includes(word)) return <span>{text}</span>;
  const i = text.indexOf(word);
  return (
    <span>{text.slice(0, i)}<span style={{
      background: `linear-gradient(180deg, transparent 0 42%, ${hexA(color, 0.42)} 42% 94%, transparent 94%)`,
      padding: '0 .06em', borderRadius: 4,
    }}>{word}</span>{text.slice(i + word.length)}</span>
  );
}

export default function SlideHeroOverlay(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const hasImage = p.imageSlotCount > 0;
  const stats = p.stats.slice(0, Math.max(0, Math.min(3, p.statCount)));

  return (
    <SlideFrame bg="a">
      {/* full-bleed image layer — cancels .aip-content padding to reach every edge */}
      {hasImage && (
        <div style={{
          position: 'absolute', zIndex: 0,
          top: 'calc(var(--aip-pad-top) * -1)', left: 'calc(var(--aip-pad-x) * -1)',
          width: 'calc(100% + var(--aip-pad-x) * 2)',
          height: 'calc(100% + var(--aip-pad-top) + var(--aip-pad-bottom))',
        }}>
          <ImageSlot slot={0} src={p.images[0] || ''} placeholder="满版背景图 · 数据中心 / 机房"
            fit={p.imageFit} ratioMode="fill" accent={ac} radius={0}
            style={{ height: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }} />
          {/* legibility scrim — darker toward the lower-left where the plate sits */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background:
            'linear-gradient(75deg, rgba(14,16,24,.72) 0%, rgba(14,16,24,.30) 42%, rgba(14,16,24,0) 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background:
            'linear-gradient(0deg, rgba(14,16,24,.55) 0%, rgba(14,16,24,0) 40%)' }} />
        </div>
      )}

      {/* content column — pushes the plate to the bottom-left */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: 52 }}>
        <div style={{ maxWidth: 1180,
          background: hasImage ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.5)',
          backdropFilter: 'blur(30px) saturate(150%)', WebkitBackdropFilter: 'blur(30px) saturate(150%)',
          border: `1px solid ${hasImage ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.7)'}`,
          borderRadius: 30, padding: '52px 60px',
          boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 32px 80px rgba(10,12,22,.4)' }}>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '9px 22px', borderRadius: 999,
            background: ac, transform: 'rotate(-1.4deg)', boxShadow: `0 12px 28px ${hexA(ac, 0.5)}` }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: hexA(readableOn(ac), 0.85) }} />
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '.04em', color: readableOn(ac), whiteSpace: 'nowrap' }}>{p.kicker}</span>
          </span>

          <h2 style={{ margin: '20px 0 0', fontSize: 94, fontWeight: 900, lineHeight: 1.0, letterSpacing: '.01em',
            color: hasImage ? '#fff' : 'var(--aip-ink)', textShadow: hasImage ? '0 4px 30px rgba(0,0,0,.4)' : 'none' }}>
            <Marked text={p.title} word={p.highlightWord} color={ac} on={p.showHighlighter} />
          </h2>

          <div style={{ marginTop: 16, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase',
            letterSpacing: '.16em', fontSize: 26, color: hasImage ? 'rgba(255,255,255,.75)' : 'var(--aip-ink-3)' }}>{p.en}</div>

          <p style={{ margin: '20px 0 0', maxWidth: 980, fontSize: 32, lineHeight: 1.5, fontWeight: 500, textWrap: 'pretty',
            color: hasImage ? 'rgba(255,255,255,.92)' : 'var(--aip-ink-2)' }}>{p.lead}</p>

          {stats.length > 0 && (
            <div style={{ marginTop: 34, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {stats.map((s, i) => {
                const on = p.highlight && i === p.highlightIndex;
                const fg = on ? readableOn(ac) : (hasImage ? '#fff' : 'var(--aip-ink)');
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '16px 26px', borderRadius: 18,
                    transform: on ? 'rotate(-1.2deg)' : 'none',
                    background: on ? ac : (hasImage ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.6)'),
                    border: `1px solid ${on ? hexA(ac, 0.5) : (hasImage ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.8)')}`,
                    boxShadow: on ? `0 18px 40px ${hexA(ac, 0.45)}` : '0 12px 30px rgba(10,12,22,.25)' }}>
                    <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-.02em', color: fg }}>{s.value}</span>
                    <span style={{ fontSize: 28, fontWeight: 900, color: on ? fg : (hasImage ? 'rgba(255,255,255,.85)' : 'var(--aip-ink-2)') }}>{s.unit}</span>
                    <span style={{ marginLeft: 8, fontSize: 25, fontWeight: 700, color: on ? hexA(readableOn(ac), 0.82) : (hasImage ? 'rgba(255,255,255,.8)' : 'var(--aip-ink-2)'), whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {p.showCaption && (
          <MonoCaption style={{ position: 'absolute', left: 0, bottom: 0, color: hasImage ? 'rgba(255,255,255,.7)' : 'var(--aip-ink-3)' }}>{p.caption}</MonoCaption>
        )}
      </div>
    </SlideFrame>
  );
}
