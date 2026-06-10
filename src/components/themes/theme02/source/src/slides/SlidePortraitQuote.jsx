/**
 * SlidePortraitQuote.jsx — Slide 16 · 人物金句（图片页 + 引言）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 头像图片槽（自适应原始比例，不裁切）+ 大字引言 + 署名。图片 0–1，0 时纯引言。
 *
 * ── Props (see slidePortraitQuoteDefaults) ──────────────────────────────────
 *   kicker        string
 *   quote         string   引言主体
 *   quoteEm       string   发光强调短语（追加在 quote 之后）
 *   quoteTail     string   强调短语之后的收尾（可选）
 *   name, role    strings  署名与头衔
 *   caption       string   头像图注
 *   imageCount    number   0 或 1
 *   imageSide     'left' | 'right'
 *   showMark      boolean  装饰引号
 *   showEmphasis  boolean  发光强调短语
 *   showRole      boolean  头衔显隐
 *   showCaption   boolean  头像图注显隐
 *   images        array    图片源（预览注入）
 *   onSlotActivate fn?     (i)=>void
 *   onSlotClear    fn?     (i)=>void
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots } from '../gxnPrimitives.jsx';

export const slidePortraitQuoteDefaults = {
  kicker: 'VOICE · 创始人之声',
  quote: '比起单纯追求规模，我们更相信构建',
  quoteEm: '可解释、可控',
  quoteTail: '的系统，更符合长远利益。',
  name: 'Dario Amodei',
  role: 'Anthropic 联合创始人 & CEO',
  caption: 'Dario Amodei · Anthropic',
  imageCount: 1,
  imageSide: 'left',
  showMark: true,
  showEmphasis: true,
  showRole: true,
  showCaption: true,
  images: [],
};

export const slidePortraitQuoteControls = [
  { key: 'imageCount', type: 'number', label: '头像数量', default: 1, min: 0, max: 1, step: 1,
    describe: '人物头像槽（0 = 纯引言）' },
  { key: 'imageSide', type: 'enum', label: '头像位置', default: 'left',
    options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
    visibleWhen: (p) => p.imageCount > 0, describe: '头像位于左 / 右' },
  { key: 'showMark', type: 'toggle', label: '装饰引号', default: true,
    describe: '显示/隐藏大号装饰引号' },
  { key: 'showEmphasis', type: 'toggle', label: '短语强调', default: true,
    describe: '将关键短语处理为发光强调' },
  { key: 'showRole', type: 'toggle', label: '头衔', default: true,
    describe: '显示/隐藏署名头衔' },
  { key: 'showCaption', type: 'toggle', label: '头像图注', default: true,
    visibleWhen: (p) => p.imageCount > 0, describe: '显示/隐藏头像说明' },
];

export function SlidePortraitQuote(props) {
  const p = { ...slidePortraitQuoteDefaults, ...props };
  const hasImage = p.imageCount > 0;

  const quoteCol = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, justifyContent: 'center', minWidth: 0 }}>
      <div style={{ position: 'relative' }}>
        {p.showMark && (
          <span aria-hidden="true" style={{ position: 'absolute', top: -40, left: -12, fontFamily: 'Georgia, serif',
            fontSize: 170, lineHeight: 1, color: 'var(--gxn-accent)', opacity: 0.16, textShadow: '0 0 50px rgba(var(--gxn-glow),0.5)', pointerEvents: 'none', zIndex: 0 }}>“</span>
        )}
        <blockquote style={{ margin: 0, position: 'relative', zIndex: 1, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700,
          fontSize: 62, lineHeight: 1.32, letterSpacing: '-0.01em', color: 'var(--gxn-text)', textWrap: 'balance' }}>
          {p.quote}
          {p.quoteEm && (p.showEmphasis ? <span className="gxn-em">{p.quoteEm}</span> : <span>{p.quoteEm}</span>)}
          {p.quoteTail}
        </blockquote>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ width: 56, height: 3, borderRadius: 3, background: 'linear-gradient(90deg, var(--gxn-accent), transparent)', boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gxn-text)' }}>{p.name}</span>
          {p.showRole && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{p.role}</span>}
        </div>
      </div>
    </div>
  );

  const imgCol = (
    <ImageSlots count={1} items={p.images}
                captions={p.showCaption ? [p.caption] : []}
                onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                placeholder="拖入人物头像 · PORTRAIT" />
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} index={p.index || "20 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 36, minHeight: 0 }}>
          {!hasImage ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: 1400 }}>{quoteCol}</div>
          ) : (
            <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '0.74fr 1.26fr', gap: 72, alignItems: 'center', minHeight: 0 }}>
              {p.imageSide === 'left'
                ? <><div style={{ height: '100%', minHeight: 0 }}>{imgCol}</div>{quoteCol}</>
                : <>{quoteCol}<div style={{ height: '100%', minHeight: 0 }}>{imgCol}</div></>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlidePortraitQuote;
