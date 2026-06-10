/**
 * SlideCover.jsx — Slide 01 · 封面 / Cover.
 *
 * Independent, prop-driven. Renders its own theme styles via <ThemeStyle/>.
 * Migration: `import React from 'react'`, drop this file + gxnTheme/gxnPrimitives in.
 *
 * ── Props (see slideCoverDefaults for full default values) ──────────────────
 *   kicker      string   mono eyebrow line
 *   title       string   main heading (first line)
 *   titleEm     string   emphasised (glowing) heading fragment (second line)
 *   subtitle    string   supporting sentence
 *   stat        {value, unit, caption}   the hero figure
 *   footnote    string[] meta lines (date / scope / disclaimer)
 *   tags        string[] decorative pills
 *   layout      'split' | 'centered'     composition variant
 *   focusEnabled boolean glow-emphasise the hero figure
 *   imageCount  number   0–3 image slots in the side panel
 *   showFootnote boolean show/hide the meta footnote row
 *   showTags    boolean  show/hide decorative pills
 *   images      array    image sources for the slots (preview wiring)
 *   onSlotActivate fn?    (i)=>void  — fill a slot (omit for static render)
 *   onSlotClear    fn?    (i)=>void  — clear a slot
 *
 * slideCoverControls lists ONLY the structural/visual props (keys === prop
 * names) for a host's control panel — text props are intentionally excluded.
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { ImageSlots, Stat, TagRow } from '../gxnPrimitives.jsx';

export const slideCoverDefaults = {
  kicker: 'AI · VENTURE FINANCING · 2024',
  title: '2024 美国大额融资',
  titleEm: 'AI 公司调研报告',
  subtitle: '聚焦全年单笔 ≥1 亿美元的大额融资事件，以横纵分析法梳理市场全景、行业分布与产业链分层。',
  stat: { value: '970', unit: '亿美元', caption: '全年 AI 风险投资总额 · 创历史新高' },
  footnote: [
    '编制日期 2026-06-03',
    '数据口径 2024 全年公开披露 ≥1 亿美元事件',
    '仅供研究参考',
  ],
  tags: ['横纵分析法', '97 笔事件', '资本大年'],
  layout: 'split',
  focusEnabled: true,
  imageCount: 1,
  showFootnote: true,
  showTags: true,
  images: [],
};

export const slideCoverControls = [
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否对核心数据做高亮发光强调' },
  { key: 'imageCount', type: 'number', label: '图片数量', default: 1, min: 0, max: 3, step: 1,
    describe: '右侧配图槽位数量（0 = 纯文字封面）' },
  { key: 'layout', type: 'enum', label: '版式', default: 'split',
    options: [{ value: 'split', label: '左右分栏' }, { value: 'centered', label: '居中' }],
    describe: '整体构图：左右分栏带配图，或纯居中标题' },
  { key: 'showTags', type: 'toggle', label: '装饰标签', default: true,
    describe: '显示/隐藏标题下方的装饰标签' },
  { key: 'showFootnote', type: 'toggle', label: '附注信息', default: true,
    describe: '显示/隐藏底部的编制日期与口径附注' },
];

export function SlideCover(props) {
  const p = { ...slideCoverDefaults, ...props };
  const centered = p.layout === 'centered' || !p.imageCount;

  const textBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40,
                  maxWidth: centered ? 1320 : 1120, alignItems: centered ? 'center' : 'flex-start',
                  textAlign: centered ? 'center' : 'left' }}>
      <p className="gxn-kicker gxn-rise">{p.kicker}</p>
      <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.14 }}>
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{p.title}</span>
        <span className="gxn-em" style={{ display: 'block', whiteSpace: 'nowrap' }}>{p.titleEm}</span>
      </h1>
      <p className="gxn-sub gxn-rise-2" style={{ maxWidth: 880 }}>{p.subtitle}</p>
      <div className="gxn-rise-3" style={{ marginTop: 6 }}>
        <Stat value={p.stat.value} unit={p.stat.unit} caption={p.stat.caption} focus={p.focusEnabled} />
      </div>
      {p.showTags && <div className="gxn-rise-3"><TagRow tags={p.tags} style={{ justifyContent: centered ? 'center' : 'flex-start' }} /></div>}
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad" style={{ justifyContent: 'center' }}>
        {centered ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {textBlock}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.28fr 0.72fr', gap: 60, alignItems: 'center' }}>
            {textBlock}
            <div className="gxn-rise-3" style={{ height: '76%', alignSelf: 'center' }}>
              <ImageSlots count={p.imageCount} items={p.images}
                          onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                          placeholder="拖入配图 · IMAGE" />
            </div>
          </div>
        )}

        {p.showFootnote && (
          <footer className="gxn-rise-4 gxn-mono"
                  style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center',
                           fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)',
                           justifyContent: centered ? 'center' : 'flex-start' }}>
            {p.footnote.map((f, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
                <span>{f}</span>
              </React.Fragment>
            ))}
          </footer>
        )}
      </div>
    </div>
  );
}

export default SlideCover;
