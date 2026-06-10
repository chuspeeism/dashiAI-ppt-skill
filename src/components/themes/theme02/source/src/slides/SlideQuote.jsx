/**
 * SlideQuote.jsx — Slide 07 · 结语金句（大字金句页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideQuoteDefaults) ──────────────────────────────────────────
 *   kicker        string   mono eyebrow line
 *   quote         string   the quote body (leading text before the emphasis)
 *   quoteEm       string   emphasised (glowing) fragment, appended after `quote`
 *   quoteTail     string   trailing text after the emphasis (optional)
 *   attribution   string   source / speaker line
 *   align         'left' | 'center'   composition
 *   showMark      boolean  show the decorative quotation glyph
 *   showEmphasis  boolean  render quoteEm as a glowing accent fragment
 *   showAttribution boolean show/hide the attribution line
 *   showRule      boolean  show the accent rule above the attribution
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';

export const slideQuoteDefaults = {
  kicker: 'INSIGHT · 结语',
  quote: 'AI 融资盛宴仍在继续，但音乐节奏正在变化。资本的下一阶段，将从',
  quoteEm: '赌叙事转向看兑现',
  quoteTail: '——能把技术转化为可持续收入的公司，才能在退潮后留在牌桌上。',
  attribution: '2024 美国大额融资 AI 公司调研报告 · 结语',
  align: 'left',
  showMark: true,
  showEmphasis: true,
  showAttribution: true,
  showRule: true,
};

export const slideQuoteControls = [
  { key: 'align', type: 'enum', label: '对齐', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    describe: '金句整体的对齐方式' },
  { key: 'showMark', type: 'toggle', label: '引号装饰', default: true,
    describe: '显示/隐藏大号装饰引号' },
  { key: 'showEmphasis', type: 'toggle', label: '短语强调', default: true,
    describe: '将关键短语处理为发光强调' },
  { key: 'showRule', type: 'toggle', label: '强调分隔线', default: true,
    describe: '显示/隐藏落款上方的强调短线' },
  { key: 'showAttribution', type: 'toggle', label: '落款', default: true,
    describe: '显示/隐藏底部署名' },
];

export function SlideQuote(props) {
  const p = { ...slideQuoteDefaults, ...props };
  const centered = p.align === 'center';

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad" style={{ justifyContent: 'center' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 44,
          alignItems: centered ? 'center' : 'flex-start',
          textAlign: centered ? 'center' : 'left',
          maxWidth: 1480, margin: centered ? '0 auto' : 0,
        }}>
          <p className="gxn-kicker gxn-rise">{p.kicker}</p>

          <div style={{ position: 'relative' }}>
            {p.showMark && (
              <span aria-hidden="true" style={{
                position: 'absolute', top: -34, left: centered ? '50%' : -14,
                transform: centered ? 'translateX(-50%)' : 'none',
                fontFamily: 'Georgia, serif', fontSize: 200, lineHeight: 1, color: 'var(--gxn-accent)',
                opacity: 0.16, textShadow: '0 0 60px rgba(var(--gxn-glow),0.5)', pointerEvents: 'none', zIndex: 0,
              }}>“</span>
            )}
            <blockquote className="gxn-rise-2" style={{
              margin: 0, position: 'relative', zIndex: 1, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700,
              fontSize: 'var(--gxn-fs-display)', lineHeight: 1.26, letterSpacing: '-0.01em',
              color: 'var(--gxn-text)', textWrap: 'balance',
            }}>
              {p.quote}
              {p.quoteEm && (
                p.showEmphasis
                  ? <span className="gxn-em">{p.quoteEm}</span>
                  : <span>{p.quoteEm}</span>
              )}
              {p.quoteTail}
            </blockquote>
          </div>

          {p.showAttribution && (
            <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {p.showRule && <span style={{ width: 64, height: 3, borderRadius: 3, background: 'linear-gradient(90deg, var(--gxn-accent), transparent)', boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />}
              <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-dim)', letterSpacing: '.06em' }}>{p.attribution}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideQuote;
