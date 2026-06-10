/**
 * SlideEditorial.jsx — 杂志大图（图片页 · 杂志式版式）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * A magazine-feature layout: an oversized typographic rail (vertical eyebrow,
 * giant headline, lead, hero figure, tags) paired with a dominant,
 * ratio-adaptive image plate (no crop). A large faint backdrop numeral adds
 * editorial flair. Image count is tunable 0–2 and the plate can sit on either
 * side; one image can be emphasised.
 *
 * ── Props (see slideEditorialDefaults) ──────────────────────────────────────
 *   kicker, vertical, title, titleEm, lead   strings
 *   stat         {value,unit,caption}   hero figure
 *   showStat     boolean  show/hide the hero figure
 *   tags         string[] decorative pills
 *   imageCount   number   0–2 image plates (0 → text-only, full width)
 *   imageSide    'left' | 'right'
 *   captions     string[] per-slot caption text
 *   focusEnabled boolean / focusIndex number   emphasise one plate
 *   backdropText string   the big faint backdrop numeral / word
 *   showBackdrop boolean  show/hide the backdrop numeral
 *   images, onSlotActivate, onSlotClear   preview wiring
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots, Stat, TagRow } from '../gxnPrimitives.jsx';

export const slideEditorialDefaults = {
  kicker: 'DEEP DIVE · 卖铲子的人',
  vertical: 'CASE STUDY',
  title: 'CoreWeave ',
  titleEm: '淘金热里卖铲子',
  lead: '从加密矿场转型 AI 算力云：当所有模型公司都在抢 GPU，提前锁定算力的基础设施商反而成为最稀缺的标的。',
  stat: { value: '110', unit: '亿美元', caption: '2024 年融资 · 估值超 190 亿' },
  showStat: true,
  tags: ['算力云', 'NVIDIA 长约', 'H100 / H200'],
  imageCount: 1,
  imageSide: 'right',
  captions: ['CoreWeave · 算力机房', 'GPU 集群'],
  focusEnabled: false,
  focusIndex: 0,
  backdropText: '05',
  showBackdrop: true,
  images: [],
};

export const slideEditorialControls = [
  { key: 'imageCount', type: 'number', label: '图片数量', default: 1, min: 0, max: 2, step: 1,
    describe: '配图槽位数量（0 = 纯文字版式）' },
  { key: 'imageSide', type: 'enum', label: '图片位置', default: 'right',
    options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
    visibleWhen: (p) => p.imageCount > 0, describe: '配图位于左侧或右侧' },
  { key: 'showStat', type: 'toggle', label: '关键数字', default: true,
    describe: '显示/隐藏标题区的关键数字' },
  { key: 'showBackdrop', type: 'toggle', label: '背景大字', default: true,
    describe: '显示/隐藏背景的大号装饰字' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    visibleWhen: (p) => p.imageCount > 0, describe: '是否高亮其中一张配图' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.imageCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled && p.imageCount > 0, describe: '被强调配图的序号' },
];

export function SlideEditorial(props) {
  const p = { ...slideEditorialDefaults, ...props };
  const hasImages = p.imageCount > 0;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.imageCount - 1, p.focusIndex)) : -1;

  const imageCol = hasImages ? (
    <div style={{ minHeight: 0, minWidth: 0 }}>
      <ImageSlots count={p.imageCount} items={p.images} captions={p.captions} focusIndex={fIdx}
                  arrange={p.imageCount >= 2 ? 'row' : 'grid'} gap={18}
                  onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                  placeholder="拖入特写大图 · IMAGE" />
    </div>
  ) : null;

  const textCol = (
    <div style={{ display: 'flex', minWidth: 0, gap: 26 }}>
      {/* vertical eyebrow */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, flex: '0 0 auto' }}>
        <span style={{ width: 3, flex: 1, borderRadius: 3, background: 'linear-gradient(var(--gxn-accent), transparent)', boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />
        <span className="gxn-mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 22, letterSpacing: '.32em', color: 'var(--gxn-faint)', textTransform: 'uppercase' }}>{p.vertical}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center', minWidth: 0 }}>
        <p className="gxn-kicker" style={{ margin: 0 }}>{p.kicker}</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700, fontSize: 76, lineHeight: 1.03, letterSpacing: '-0.015em', color: 'var(--gxn-text)', textWrap: 'balance' }}>
          {p.title}{p.titleEm && <span className="gxn-em">{p.titleEm}</span>}
        </h2>
        <p style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', lineHeight: 1.5, color: 'var(--gxn-dim)', maxWidth: 640 }}>{p.lead}</p>
        {p.showStat && (
          <div className="gxn-panel" style={{ padding: '24px 32px', alignSelf: 'flex-start' }}>
            <Stat value={p.stat.value} unit={p.stat.unit} caption={p.stat.caption} focus size="80px" />
          </div>
        )}
        <TagRow tags={p.tags} />
      </div>
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      {p.showBackdrop && p.backdropText && (
        <span aria-hidden="true" className="gxn-num" style={{
          position: 'absolute', right: -20, bottom: -120, fontSize: 560, fontWeight: 700, lineHeight: 1,
          color: 'rgba(var(--gxn-glow),0.05)', pointerEvents: 'none', userSelect: 'none', zIndex: 0,
        }}>{p.backdropText}</span>
      )}
      <div className="gxn-pad" style={{ position: 'relative', zIndex: 1, justifyContent: 'center' }}>
        {p.index != null && (
          <span className="gxn-index gxn-rise" style={{ position: 'absolute', top: 'var(--gxn-py)', right: 'var(--gxn-px)' }}>{p.index}</span>
        )}
        <div className="gxn-rise-2" style={{ flex: '0 1 auto', minHeight: 0, height: '76%' }}>
          {!hasImages ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: 1320 }}>{textCol}</div>
          ) : (
            <div style={{
              height: '100%', display: 'grid', gap: 64, alignItems: 'stretch', minHeight: 0,
              gridTemplateColumns: p.imageSide === 'left' ? '1.12fr 1fr' : '1fr 1.12fr',
            }}>
              {p.imageSide === 'left' ? <>{imageCol}{textCol}</> : <>{textCol}{imageCol}</>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideEditorial;
