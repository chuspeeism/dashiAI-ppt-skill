/**
 * SlideGalleryBand.jsx — Slide 12 · 案例图集（图片页 · 横排）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 横排等高图集，图片以 `fit` 控制贴合方式（默认 contain · 不裁切）。槽位数量
 * 可调 0–4，0 时为纯标题版式。图片以 props 传入，不依赖预览运行时。
 *
 * ── Props (see slideGalleryBandDefaults) ────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   imageCount   number   0–4 image cells in the band
 *   captions     string[] per-cell caption text
 *   fit          'contain' | 'cover'   image fit inside each cell
 *   focusEnabled boolean  highlight one cell (accent ring)
 *   focusIndex   number   0-based cell to highlight
 *   showCaptions boolean  show/hide caption overlays
 *   showLead     boolean  show/hide the lead line under the title
 *   images       array    image sources (preview wiring)
 *   onSlotActivate fn?     (i)=>void
 *   onSlotClear    fn?     (i)=>void
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots } from '../gxnPrimitives.jsx';

export const slideGalleryBandDefaults = {
  kicker: 'GALLERY · 案例图集',
  title: '头部玩家图集 ',
  titleEm: '资本的面孔',
  lead: '从模型实验室到算力云，2024 年的大额融资塑造了一组高度集中的“头部面孔”。',
  imageCount: 4,
  captions: ['OpenAI · 通用大模型', 'Anthropic · 安全对齐', 'xAI · 实时多模态', 'CoreWeave · 算力云'],
  fit: 'contain',
  focusEnabled: false,
  focusIndex: 0,
  showCaptions: true,
  showLead: true,
  images: [],
};

export const slideGalleryBandControls = [
  { key: 'imageCount', type: 'number', label: '图片数量', default: 4, min: 0, max: 4, step: 1,
    describe: '横排图集的槽位数量（0 = 纯标题）' },
  { key: 'fit', type: 'enum', label: '贴合方式', default: 'contain',
    options: [{ value: 'contain', label: '完整（不裁切）' }, { value: 'cover', label: '填充（裁切）' }],
    visibleWhen: (p) => p.imageCount > 0, describe: '图片在单元内完整显示或填充裁切' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一张' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.imageCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled && p.imageCount > 0, describe: '被强调图片的序号' },
  { key: 'showCaptions', type: 'toggle', label: '图注', default: true,
    visibleWhen: (p) => p.imageCount > 0, describe: '显示/隐藏图片说明' },
  { key: 'showLead', type: 'toggle', label: '导语', default: true,
    describe: '显示/隐藏标题下的导语' },
];

export function SlideGalleryBand(props) {
  const p = { ...slideGalleryBandDefaults, ...props };
  const hasImages = p.imageCount > 0;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.imageCount - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "16 / 23"} />
        {p.showLead && <p className="gxn-sub gxn-rise" style={{ marginTop: 20, maxWidth: 1200 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 36, minHeight: 0 }}>
          {hasImages ? (
            <ImageSlots count={p.imageCount} items={p.images} arrange="row" fit={p.fit}
                        captions={p.showCaptions ? p.captions : []} focusIndex={fIdx}
                        onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                        gap={22} placeholder="拖入配图 · IMAGE" />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="gxn-mono" style={{ fontSize: 26, color: 'var(--gxn-faint)' }}>纯标题版式 · 图片数量为 0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideGalleryBand;
