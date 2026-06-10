/**
 * SlideShowcase.jsx — Slide 06 · 案例图景（图片页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * Image slots are ratio-adaptive (single slot fits the image's native ratio,
 * multi-slot composes a tidy grid) and the count is tunable 0–4 while keeping
 * the composition balanced. Images arrive via props — no preview-runtime dep.
 *
 * ── Props (see slideShowcaseDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm, lead      strings
 *   imageCount   number   0–4 image slots (0 → text-only composition)
 *   layout       'split' | 'full'   text+gallery, or gallery-dominant
 *   captions     string[] per-slot caption text
 *   focusEnabled boolean  highlight one image (accent ring)
 *   focusIndex   number   0-based slot to highlight
 *   showCaptions boolean  show/hide the caption overlays
 *   showStat     boolean  show/hide the side hero figure
 *   stat         {value,unit,caption}   side hero figure
 *   tags         string[] decorative pills under the lead
 *   images       array    image sources (preview wiring)
 *   onSlotActivate fn?     (i)=>void  — fill a slot
 *   onSlotClear    fn?     (i)=>void  — clear a slot
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots, Stat, TagRow } from '../gxnPrimitives.jsx';

export const slideShowcaseDefaults = {
  kicker: 'CASES · 案例图景',
  title: '典型案例图景 ',
  titleEm: '头部玩家',
  lead: '从模型层到基础设施，头部玩家以不同路径吸纳资本——技术领先、安全对齐、算力卡位，共同构成 2024 的资本图景。',
  imageCount: 3,
  layout: 'split',
  captions: ['OpenAI · 通用大模型', 'Anthropic · 安全对齐', 'xAI · 实时多模态', 'CoreWeave · 算力云'],
  focusEnabled: false,
  focusIndex: 0,
  showCaptions: true,
  showStat: true,
  stat: { value: '650', unit: '亿美元', caption: 'Anthropic 全年累计融资' },
  tags: ['通用大模型', '安全对齐', '算力卡位'],
  images: [],
};

export const slideShowcaseControls = [
  { key: 'imageCount', type: 'number', label: '图片数量', default: 3, min: 0, max: 4, step: 1,
    describe: '配图槽位数量（0 = 纯文字版式）' },
  { key: 'layout', type: 'enum', label: '版式', default: 'split',
    options: [{ value: 'split', label: '图文分栏' }, { value: 'full', label: '满幅图廊' }],
    describe: '图文分栏，或图片占主导的满幅图廊' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一张配图' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.imageCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled && p.imageCount > 0, describe: '被强调配图的序号' },
  { key: 'showCaptions', type: 'toggle', label: '图注', default: true,
    visibleWhen: (p) => p.imageCount > 0, describe: '显示/隐藏图片上的说明文字' },
  { key: 'showStat', type: 'toggle', label: '关键数字', default: true,
    describe: '显示/隐藏侧栏的关键数字' },
];

export function SlideShowcase(props) {
  const p = { ...slideShowcaseDefaults, ...props };
  const hasImages = p.imageCount > 0;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.imageCount - 1, p.focusIndex)) : -1;

  const gallery = hasImages ? (
    <ImageSlots count={p.imageCount} items={p.images}
                captions={p.showCaptions ? p.captions : []}
                focusIndex={fIdx}
                onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                placeholder="拖入配图 · IMAGE" gap={20} />
  ) : null;

  const textCol = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 34, justifyContent: 'center', minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', lineHeight: 1.5, color: 'var(--gxn-dim)', maxWidth: 720 }}>{p.lead}</p>
      {p.showStat && (
        <div className="gxn-panel" style={{ padding: '28px 32px', alignSelf: 'flex-start' }}>
          <Stat value={p.stat.value} unit={p.stat.unit} caption={p.stat.caption} focus size="84px" />
        </div>
      )}
      <TagRow tags={p.tags} />
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "07 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, minHeight: 0 }}>
          {!hasImages ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: 1280 }}>{textCol}</div>
          ) : p.layout === 'full' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ flex: 1, minHeight: 0 }}>{gallery}</div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', gap: 64, alignItems: 'stretch', minHeight: 0 }}>
              {textCol}
              <div style={{ minHeight: 0 }}>{gallery}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideShowcase;
