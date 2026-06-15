/**
 * SlidePoster.jsx — 全幅主题海报（图片页 · Cover Poster）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 杂志封面式的整幅版式：一张主图铺满版面，辉光蒙层压住巨型标题、一句金句与底部的
 * 内联数据带（2–3 个关键数字）。图片槽按上传图比例自适应——`fit=contain` 完整不裁切
 * （留出黑边），`fit=cover` 满幅裁切；`imageCount=0` 时退化为纯文字主视觉海报。
 * 图片以 props 传入，不依赖预览运行时。
 *
 * ── Props (see slidePosterDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, quote    strings
 *   metas        Array<{value,unit,label}>  底部内联数据
 *   caption      string   图注（左下角小字）
 *   imageCount   number   0–1 主图槽位
 *   fit          'cover' | 'contain'   主图填充方式
 *   titlePos     'bottom' | 'center'   标题排布位置
 *   metaCount    number   底部数据数量（0–metas 长度）
 *   showQuote    boolean  金句显隐
 *   showFrame    boolean  内嵌描边框显隐
 *   showCaption  boolean  图注显隐
 *   images       array    image sources (preview wiring)
 *   onSlotActivate fn?    (i)=>void
 *   onSlotClear    fn?    (i)=>void
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { ImageSlots } from '../gxnPrimitives.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../../unicorn-background.jsx';

export const slidePosterDefaults = {
  kicker: 'CASE · 估值反超',
  title: 'Anthropic',
  titleEm: '从追赶到领跑',
  quote: '“比起单纯追求规模，构建可解释、可控的系统，更符合长远利益。”',
  // 源：报告 5.1 Anthropic 案例
  metas: [
    { value: '9650', unit: '亿美元', label: '最新估值 · 全球最高' },
    { value: '650+', unit: '亿美元', label: '2024 累计融资' },
    { value: '3', unit: '轮', label: '年内连续大额融资' },
  ],
  caption: 'Anthropic · Claude 系列',
  imageCount: 1,
  fit: 'cover',
  backgroundMode: 'unicorn',
  unicornScene: 'tech',
  titlePos: 'bottom',
  metaCount: 3,
  showQuote: true,
  showFrame: true,
  showCaption: true,
  images: [],
};

export const slidePosterControls = [
  UNICORN_BACKGROUND_CONTROL,
  createUnicornSceneControl(slidePosterDefaults.unicornScene),
  { key: 'imageCount', type: 'number', label: '主图数量', default: 1, min: 0, max: 1, step: 1,
    describe: '主图槽位（0 = 纯文字主视觉海报）' },
  { key: 'fit', type: 'enum', label: '图片填充', default: 'cover',
    options: [{ value: 'cover', label: '满幅裁切' }, { value: 'contain', label: '完整不裁切' }],
    visibleWhen: (p) => p.imageCount > 0, describe: '主图填充方式（完整 = 按原始比例不裁切）' },
  { key: 'titlePos', type: 'enum', label: '标题位置', default: 'bottom',
    options: [{ value: 'bottom', label: '左下压字' }, { value: 'center', label: '居中' }],
    describe: '标题在海报上的位置' },
  { key: 'metaCount', type: 'number', label: '数据数量', default: 3, min: 0, step: 1,
    maxFrom: (p) => (p.metas ? p.metas.length : 3), describe: '底部内联数据数量' },
  { key: 'showQuote', type: 'toggle', label: '金句', default: true, describe: '标题下金句显隐' },
  { key: 'showFrame', type: 'toggle', label: '描边框', default: true, describe: '海报内嵌描边框显隐' },
  { key: 'showCaption', type: 'toggle', label: '图注', default: true, describe: '左下角图注显隐' },
];

export function SlidePoster(props) {
  const p = { ...slidePosterDefaults, ...props };
  const useUnicorn = p.backgroundMode === 'unicorn';
  const hasImage = !useUnicorn && p.imageCount > 0;
  const hasBackdrop = useUnicorn || hasImage;
  const centered = p.titlePos === 'center';
  const metas = (p.metas || []).slice(0, Math.max(0, Math.min((p.metas || []).length, p.metaCount)));

  const Title = (
    <h1 className="gxn-title" style={{ margin: 0, fontSize: 'var(--gxn-fs-display)', lineHeight: 1.0,
      letterSpacing: '-0.02em', textShadow: '0 6px 40px rgba(0,0,0,0.6)' }}>
      {p.title}
      {p.titleEm ? <span className="gxn-em" style={{ display: 'block', fontWeight: 700 }}>{p.titleEm}</span> : null}
    </h1>
  );

  const quote = p.showQuote && p.quote && (
    <p style={{ margin: 0, fontSize: 32, lineHeight: 1.45, fontWeight: 400, maxWidth: 1040,
      color: 'rgba(238,243,241,0.9)', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>{p.quote}</p>
  );

  const metaBar = metas.length > 0 && (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flexWrap: 'wrap',
      justifyContent: centered ? 'center' : 'flex-start' }}>
      {metas.map((m, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4,
          padding: '0 36px', borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.2)',
          paddingLeft: i === 0 ? 0 : 36 }}>
          <span className="gxn-num" style={{ fontSize: 56, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em',
            color: 'var(--gxn-accent)', textShadow: '0 0 28px rgba(var(--gxn-glow),0.5)', whiteSpace: 'nowrap' }}>
            {m.value}{m.unit && <span style={{ fontSize: '0.34em', marginLeft: 7, color: 'rgba(238,243,241,0.78)', fontWeight: 500 }}>{m.unit}</span>}
          </span>
          <span className="gxn-mono" style={{ fontSize: 21, color: 'rgba(238,243,241,0.6)', whiteSpace: 'nowrap' }}>{m.label}</span>
        </div>
      ))}
    </div>
  );

  const lockup = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30,
      alignItems: centered ? 'center' : 'flex-start', textAlign: centered ? 'center' : 'left',
      maxWidth: centered ? 1400 : 1180, pointerEvents: 'none' }}>
      {Title}
      {quote}
      {metaBar}
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* image / texture fill */}
        {useUnicorn ? (
          <UnicornBackground scene={p.unicornScene} accent="var(--gxn-accent)" />
        ) : hasImage ? (
          <ImageSlots count={1} items={p.images} arrange="row" fit={p.fit}
                      onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                      placeholder="拖入主图 · POSTER" />
        ) : (
          <div className="gxn-slot" style={{ position: 'absolute', inset: 0, borderRadius: 0, border: 'none' }}>
            <span className="gxn-slot-cap">纯文字主视觉海报</span>
          </div>
        )}

        {/* scrim for legibility */}
        {hasBackdrop && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: centered
            ? 'radial-gradient(120% 100% at 50% 50%, rgba(4,6,8,0.34), rgba(4,6,8,0.82))'
            : 'linear-gradient(to top, rgba(4,6,8,0.92) 6%, rgba(4,6,8,0.5) 46%, rgba(4,6,8,0.15) 78%)' }} />
        )}

        {/* inset frame */}
        {p.showFrame && (
          <div style={{ position: 'absolute', inset: 40, pointerEvents: 'none', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: 'inset 0 0 0 1px rgba(var(--gxn-glow),0.08)' }} />
        )}

        {/* top masthead row */}
        <div style={{ position: 'absolute', top: 64, left: 76, right: 76, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <p className="gxn-kicker gxn-rise" style={{ margin: 0 }}>{p.kicker}</p>
          {p.index != null && <span className="gxn-index">{p.index}</span>}
        </div>

        {/* caption */}
        {hasBackdrop && p.showCaption && p.caption && (
          <span className="gxn-mono gxn-rise" style={{ position: 'absolute', left: 76, bottom: 60, zIndex: 3,
            fontSize: 21, color: 'rgba(238,243,241,0.6)' }}>{p.caption}</span>
        )}

        {/* title lockup */}
        <div className="gxn-rise-2" style={{ position: 'absolute', inset: 0, padding: centered ? '0 96px' : '0 96px 110px 76px',
          display: 'flex', flexDirection: 'column',
          justifyContent: centered ? 'center' : 'flex-end',
          alignItems: centered ? 'center' : 'flex-start', pointerEvents: 'none' }}>
          {lockup}
        </div>
      </div>
    </div>
  );
}

export default SlidePoster;
