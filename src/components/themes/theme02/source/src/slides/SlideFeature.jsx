/**
 * SlideFeature.jsx — 全幅沉浸大图（图片页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 以图片为主体的沉浸版式：大图占满版面，标题/导语以辉光蒙层压在图上，
 * 角落可放一个关键数字。图片槽自适应原始比例（不裁切），数量 0–3：
 *   0 → 纯文字主视觉；1 → 单张大图；2–3 → 构图网格。
 * 图片以 props 传入，不依赖预览运行时。
 *
 * ── Props (see slideFeatureDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   captions     string[]  每张图的说明（填充时浮于图上）
 *   imageCount   number    0–3 图片槽位
 *   overlay      'corner' | 'bar' | 'none'  标题蒙层位置
 *   stat         {value,unit,caption}        角标关键数字
 *   showStat     boolean   显示/隐藏角标数字
 *   showLead     boolean   显示/隐藏蒙层内导语
 *   focusEnabled boolean   高亮某一张图
 *   focusIndex   number    0-based 被强调图序号
 *   images       array     image sources (preview wiring)
 *   onSlotActivate fn?      (i)=>void
 *   onSlotClear    fn?      (i)=>void
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots } from '../gxnPrimitives.jsx';

export const slideFeatureDefaults = {
  kicker: 'CASE · 卖铲子的人',
  title: 'CoreWeave ',
  titleEm: '算力即稀缺',
  lead: '从加密挖矿转型 AI 算力云，2024 年融资 110 亿美元、估值破 190 亿——当所有模型公司都在抢 GPU，提前锁定算力的人成了最稀缺标的。',
  captions: ['CoreWeave · AI 算力云', '数据中心 · GPU 集群', 'NVIDIA · 长期供应'],
  imageCount: 1,
  overlay: 'corner',
  stat: { value: '110', unit: '亿美元', caption: '2024 融资额 · 估值破 190 亿' },
  showStat: true,
  showLead: true,
  focusEnabled: false,
  focusIndex: 0,
  images: [],
};

export const slideFeatureControls = [
  { key: 'imageCount', type: 'number', label: '图片数量', default: 1, min: 0, max: 3, step: 1,
    describe: '图片槽位数量（0 = 纯文字主视觉）' },
  { key: 'overlay', type: 'enum', label: '标题蒙层', default: 'corner',
    options: [{ value: 'corner', label: '左下角标' }, { value: 'bar', label: '底部通栏' }, { value: 'none', label: '不压字' }],
    describe: '标题蒙层位置（不压字时标题回到顶部）' },
  { key: 'showStat', type: 'toggle', label: '角标数字', default: true,
    describe: '显示/隐藏角落关键数字' },
  { key: 'showLead', type: 'toggle', label: '蒙层导语', default: true,
    describe: '蒙层内导语显隐' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    visibleWhen: (p) => p.imageCount > 1, describe: '是否高亮其中一张图' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.imageCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled && p.imageCount > 1, describe: '被强调图的序号' },
];

export function SlideFeature(props) {
  const p = { ...slideFeatureDefaults, ...props };
  const hasImage = p.imageCount > 0;
  const onImg = p.overlay !== 'none' && hasImage;     // title floats on the image
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.imageCount - 1, p.focusIndex)) : -1;

  const Title = ({ big }) => (
    <h1 className="gxn-title" style={{ margin: 0, fontSize: big ? 'var(--gxn-fs-display)' : 'var(--gxn-fs-h1)', lineHeight: 1.04 }}>
      {p.title}{p.titleEm ? <span className="gxn-em">{p.titleEm}</span> : null}
    </h1>
  );

  const statChip = p.showStat && (
    <div className="gxn-panel" style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 6, backdropFilter: 'blur(10px)', background: 'rgba(7,9,11,0.55)' }}>
      <span className="gxn-num" style={{ fontSize: 60, fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.02em', color: 'var(--gxn-accent)', textShadow: '0 0 30px rgba(var(--gxn-glow),0.5)', whiteSpace: 'nowrap' }}>
        {p.stat.value}{p.stat.unit && <span style={{ fontSize: '0.38em', marginLeft: 6, color: 'var(--gxn-dim)', fontWeight: 500 }}>{p.stat.unit}</span>}
      </span>
      <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)' }}>{p.stat.caption}</span>
    </div>
  );

  const lockup = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1080 }}>
      <Title big />
      {p.showLead && <p style={{ margin: 0, fontSize: 28, lineHeight: 1.5, color: 'rgba(238,243,241,0.82)', maxWidth: 920 }}>{p.lead}</p>}
    </div>
  );

  const imageArea = hasImage ? (
    <ImageSlots count={p.imageCount} items={p.images}
                captions={onImg ? [] : p.captions}
                focusIndex={fIdx}
                arrange={p.imageCount === 1 ? 'single' : 'row'}
                onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                placeholder="拖入大图 · IMAGE" gap={18} />
  ) : (
    <div className="gxn-slot" style={{ width: '100%', height: '100%' }}>
      <span className="gxn-slot-cap">主视觉 · 纯文字版式</span>
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={onImg ? undefined : p.title} titleEm={onImg ? undefined : p.titleEm}
                     index={p.index || "15 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: onImg ? 34 : 28, minHeight: 0 }}>
          {!onImg ? (
            // text-forward (no overlay, or no image): lockup + image side by side / stacked
            hasImage ? (
              <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 56, alignItems: 'stretch', minHeight: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, minWidth: 0 }}>
                  {p.showLead && <p style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', lineHeight: 1.5, color: 'var(--gxn-dim)' }}>{p.lead}</p>}
                  {statChip}
                </div>
                <div style={{ minHeight: 0 }}>{imageArea}</div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30, maxWidth: 1280 }}>
                {lockup}
                <div style={{ alignSelf: 'flex-start' }}>{statChip}</div>
              </div>
            )
          ) : (
            // immersive: image fills the region; title overlaid via scrim
            <div style={{ position: 'relative', height: '100%', borderRadius: 'var(--gxn-radius)', overflow: 'hidden', border: '1px solid var(--gxn-line)', boxShadow: '0 30px 80px -50px rgba(0,0,0,0.9)' }}>
              <div style={{ position: 'absolute', inset: 0, padding: p.imageCount > 1 ? 18 : 0 }}>{imageArea}</div>

              {/* stat chip — top-right */}
              {p.showStat && <div style={{ position: 'absolute', top: 26, right: 26, zIndex: 3 }}>{statChip}</div>}

              {/* title scrim + lockup */}
              {p.overlay === 'bar' ? (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2, padding: '120px 56px 44px',
                              background: 'linear-gradient(to top, rgba(4,6,8,0.92), rgba(4,6,8,0.55) 55%, transparent)' }}>
                  {lockup}
                </div>
              ) : (
                <div style={{ position: 'absolute', left: 0, bottom: 0, top: 0, right: '24%', zIndex: 2,
                              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 0 48px 48px',
                              background: 'linear-gradient(105deg, rgba(4,6,8,0.92) 8%, rgba(4,6,8,0.55) 46%, transparent 78%)',
                              pointerEvents: 'none' }}>
                  <div style={{ pointerEvents: 'auto' }}>{lockup}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideFeature;
