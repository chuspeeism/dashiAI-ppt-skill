/**
 * SlideCoverPoster.jsx — 封面变体 C · 满幅图海报 / Full-bleed Poster Cover.
 *
 * Independent, prop-driven. Renders its own theme styles via <ThemeStyle/>.
 * 图片槽通过 props 传入（images / onSlotActivate / onSlotClear），不依赖预览运行时。
 *
 * 版式特征：主图满幅铺底（fit=cover 满幅裁切 / contain 完整不裁切），辉光保护蒙层压住
 * 左下角的巨型标题锁定；可选内嵌描边框 + 顶部眉题 + 底部内联数据带。imageCount=0 时
 * 退化为纯文字深色海报（仍保留辉光氛围）。
 *
 * ── Props（完整默认见 slideCoverPosterDefaults）────────────────────────────
 *   kicker / title / titleEm / quote   文本
 *   metas       {value,label}[]        底部内联数据（按 metaCount 截取）
 *   caption     string                 左下角图注
 *   imageCount  number   0–1  主图槽（0 = 纯文字海报）
 *   fit         'cover' | 'contain'    满幅裁切 / 完整不裁切
 *   titlePos    'bottom' | 'center'    标题左下压字 / 居中
 *   showQuote   boolean  标题下金句显隐
 *   showFrame   boolean  内嵌描边框显隐
 *   metaCount   number   底部数据数量（0 = 隐藏）
 *   images / onSlotActivate / onSlotClear   图片槽接线
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { ImageSlots } from '../gxnPrimitives.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../../unicorn-background.jsx';

export const slideCoverPosterDefaults = {
  kicker: 'GENERATIVE AI · 2026',
  title: '智能的形状',
  titleEm: '正在被重写',
  quote: '当模型成为基础设施，每一个行业都将重新计算自己的边界。',
  metas: [
    { value: '1,240', label: '亿美元投入' },
    { value: '58%', label: '企业渗透率' },
    { value: '7', label: '核心赛道' },
  ],
  caption: '主视觉 · 替换为产业大图',
  imageCount: 1,
  fit: 'cover',
  backgroundMode: 'unicorn',
  unicornScene: 'goey',
  titlePos: 'bottom',
  showQuote: true,
  showFrame: true,
  metaCount: 3,
  images: [],
};

export const slideCoverPosterControls = [
  UNICORN_BACKGROUND_CONTROL,
  createUnicornSceneControl(slideCoverPosterDefaults.unicornScene),
  { key: 'imageCount', type: 'number', label: '主图', default: 1, min: 0, max: 1, step: 1,
    describe: '满幅主图槽（0 = 纯文字海报）' },
  { key: 'fit', type: 'enum', label: '图片填充', default: 'cover',
    options: [{ value: 'cover', label: '满幅裁切' }, { value: 'contain', label: '完整不裁切' }],
    describe: '主图满幅裁切，或按原始比例完整显示' },
  { key: 'titlePos', type: 'enum', label: '标题位置', default: 'bottom',
    options: [{ value: 'bottom', label: '左下' }, { value: 'center', label: '居中' }],
    describe: '标题锁定在左下压字，或整体居中' },
  { key: 'showQuote', type: 'toggle', label: '金句', default: true,
    describe: '显示/隐藏标题下方金句' },
  { key: 'showFrame', type: 'toggle', label: '内嵌描边框', default: true,
    describe: '显示/隐藏海报内嵌的发光描边框' },
  { key: 'metaCount', type: 'number', label: '底部数据', default: 3, min: 0, max: 3, step: 1,
    describe: '底部内联数据数量（0 = 隐藏）' },
];

export function SlideCoverPoster(props) {
  const p = { ...slideCoverPosterDefaults, ...props };
  const metas = (p.metas || []).slice(0, Math.max(0, p.metaCount));
  const useUnicorn = p.backgroundMode === 'unicorn';
  const hasImage = !useUnicorn && p.imageCount > 0;
  const hasBackdrop = useUnicorn || hasImage;
  const center = p.titlePos === 'center';

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />

      {/* 满幅主图 */}
      {hasBackdrop && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {useUnicorn ? (
            <UnicornBackground scene={p.unicornScene} accent="var(--gxn-accent)" />
          ) : (
            <ImageSlots count={1} arrange="row" fit={p.fit} items={p.images}
                        onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                        placeholder="拖入主视觉 · POSTER IMAGE"
                        style={{ height: '100%' }} />
          )}
        </div>
      )}

      {/* 辉光保护蒙层 — 压暗图面、托起文字 */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: center
          ? 'radial-gradient(120% 120% at 50% 50%, rgba(4,6,8,0.30), rgba(4,6,8,0.74) 78%), radial-gradient(90% 90% at 50% 40%, rgba(var(--gxn-glow),0.12), transparent 60%)'
          : 'linear-gradient(180deg, rgba(4,6,8,0.46) 0%, rgba(4,6,8,0.12) 30%, rgba(4,6,8,0.66) 76%, rgba(4,6,8,0.92) 100%), radial-gradient(80% 70% at 18% 92%, rgba(var(--gxn-glow),0.18), transparent 60%)' }} />

      {/* 内嵌描边框 */}
      {p.showFrame && (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 44, borderRadius: 18,
          border: '1px solid rgba(var(--gxn-glow),0.34)',
          boxShadow: 'inset 0 0 60px -24px rgba(var(--gxn-glow),0.5)', pointerEvents: 'none' }} />
      )}

      {/* 文字层为纯展示内容 — pointerEvents:none 让点击穿透到底层满幅图片槽 */}
      <div className="gxn-pad" style={{ zIndex: 1, pointerEvents: 'none',
        justifyContent: center ? 'center' : 'flex-end',
        alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left' }}>

        {/* 顶部眉题 */}
        <p className="gxn-kicker gxn-rise" style={{ position: 'absolute', top: 'var(--gxn-py)', left: 'var(--gxn-px)' }}>{p.kicker}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26,
          alignItems: center ? 'center' : 'flex-start', maxWidth: center ? 1400 : 1300 }}>
          <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.06 }}>
            <span style={{ display: 'block' }}>{p.title}</span>
            <span className="gxn-em" style={{ display: 'block' }}>{p.titleEm}</span>
          </h1>
          {p.showQuote && (
            <p className="gxn-rise-3" style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', lineHeight: 1.45,
              color: 'var(--gxn-text)', opacity: 0.92, maxWidth: 900, textWrap: 'pretty' }}>{p.quote}</p>
          )}

          {metas.length > 0 && (
            <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginTop: 12,
              justifyContent: center ? 'center' : 'flex-start' }}>
              {metas.map((m, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', margin: '4px 0',
                    background: 'linear-gradient(180deg, transparent, var(--gxn-line), transparent)' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4,
                    alignItems: center ? 'center' : 'flex-start', padding: i === 0 ? '0 40px 0 0' : '0 40px' }}>
                    <span className="gxn-num" style={{ fontSize: 50, fontWeight: 600, lineHeight: 1,
                      color: 'var(--gxn-accent)', textShadow: '0 0 26px rgba(var(--gxn-glow),0.5)' }}>{m.value}</span>
                    <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)' }}>{m.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* 左下角图注 */}
        {hasBackdrop && !center && (
          <span className="gxn-mono gxn-rise-4" style={{ position: 'absolute', bottom: 'var(--gxn-py)', right: 'var(--gxn-px)',
            fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)' }}>{p.caption}</span>
        )}
      </div>
    </div>
  );
}

export default SlideCoverPoster;
