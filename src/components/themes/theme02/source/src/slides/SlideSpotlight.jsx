/**
 * SlideSpotlight.jsx — Slide 11 · 案例聚焦（图片页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 单张大图 + 要点列表 + 关键数字。图片槽自适应原始比例（不裁切），数量 0–1，
 * 0 时为纯文字版式。图片以 props 传入，不依赖预览运行时。
 *
 * ── Props (see slideSpotlightDefaults) ──────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   points       Array<{title,desc}> key-point list (text)
 *   pointCount   number   how many points to show (1–4)
 *   stat         {value,unit,caption}   hero figure
 *   caption      string   image caption text
 *   imageCount   number   0 or 1 (hero image present)
 *   imageSide    'left' | 'right'   which side the image sits on
 *   showStat     boolean  show/hide the hero figure
 *   showPoints   boolean  show/hide the key-point list
 *   showCaption  boolean  show/hide the image caption
 *   images       array    image sources (preview wiring)
 *   onSlotActivate fn?     (i)=>void
 *   onSlotClear    fn?     (i)=>void
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots, Stat } from '../gxnPrimitives.jsx';

export const slideSpotlightDefaults = {
  kicker: 'CASE · 案例聚焦',
  title: 'Anthropic ',
  titleEm: '从追赶到反超',
  lead: '2021 年由 OpenAI 前研究副总裁创立，2024 年连续三轮大额融资，一举登顶全球估值最高的 AI 初创企业。',
  points: [
    { title: '一年三轮', desc: '5/8/11 月三轮关账，累计超 650 亿美元。' },
    { title: '安全对齐', desc: 'Constitutional AI，赢得企业客户信任。' },
    { title: '云巨头加持', desc: '联手 Amazon、Google，渠道覆盖迅速。' },
    { title: 'IPO 在即', desc: '2026 年 6 月递交上市申请，预计年内挂牌。' },
  ],
  pointCount: 3,
  stat: { value: '9650', unit: '亿美元', caption: '最新估值 · 全球最高 AI 初创' },
  caption: 'Anthropic · 安全对齐',
  imageCount: 1,
  imageSide: 'right',
  showStat: true,
  showPoints: true,
  showCaption: true,
  images: [],
};

export const slideSpotlightControls = [
  { key: 'imageCount', type: 'number', label: '图片数量', default: 1, min: 0, max: 1, step: 1,
    describe: '主图槽位（0 = 纯文字版式）' },
  { key: 'imageSide', type: 'enum', label: '图片位置', default: 'right',
    options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
    visibleWhen: (p) => p.imageCount > 0, describe: '主图位于左侧或右侧' },
  { key: 'pointCount', type: 'number', label: '要点数量', default: 3, min: 1, max: 4, step: 1,
    describe: '展示的要点条数' },
  { key: 'showPoints', type: 'toggle', label: '要点列表', default: true,
    describe: '显示/隐藏要点列表' },
  { key: 'showStat', type: 'toggle', label: '关键数字', default: true,
    describe: '显示/隐藏关键数字' },
  { key: 'showCaption', type: 'toggle', label: '图注', default: true,
    visibleWhen: (p) => p.imageCount > 0, describe: '显示/隐藏图片说明' },
];

export function SlideSpotlight(props) {
  const p = { ...slideSpotlightDefaults, ...props };
  const hasImage = p.imageCount > 0;
  const pts = p.points.slice(0, Math.max(1, Math.min(p.points.length, p.pointCount)));

  const textCol = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center', minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', lineHeight: 1.5, color: 'var(--gxn-dim)', maxWidth: 880 }}>{p.lead}</p>
      {p.showStat && (
        <div className="gxn-panel" style={{ padding: '24px 30px', alignSelf: 'flex-start' }}>
          <Stat value={p.stat.value} unit={p.stat.unit} caption={p.stat.caption} focus size="76px" />
        </div>
      )}
      {p.showPoints && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {pts.map((pt, i) => (
            <li key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <span className="gxn-num" style={{ fontSize: 26, fontWeight: 600, color: 'var(--gxn-accent)', lineHeight: 1.3, flex: '0 0 auto', width: 44 }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--gxn-text)' }}>{pt.title}</span>
                <span style={{ fontSize: 24, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{pt.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const imgCol = (
    <ImageSlots count={1} items={p.images}
                captions={p.showCaption ? [p.caption] : []}
                onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                placeholder="拖入案例配图 · IMAGE" />
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "14 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, minHeight: 0 }}>
          {!hasImage ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: 1280 }}>{textCol}</div>
          ) : (
            <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.26fr 0.74fr', gap: 60, alignItems: 'stretch', minHeight: 0 }}>
              {p.imageSide === 'left'
                ? <><div style={{ minHeight: 0 }}>{imgCol}</div>{textCol}</>
                : <>{textCol}<div style={{ minHeight: 0 }}>{imgCol}</div></>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideSpotlight;
