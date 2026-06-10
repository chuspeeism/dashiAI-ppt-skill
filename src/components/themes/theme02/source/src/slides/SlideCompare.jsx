/**
 * SlideCompare.jsx — Slide 13 · 双图对比（图片页 · A / B）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 两栏并置对比，每栏含一个自适应图片槽（不裁切）+ 标签/标签/属性。图片数量
 * 0–2（控制几栏带图），0 时为纯文字对比。图片以 props 传入。
 *
 * ── Props (see slideCompareDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   sides        Array<{label,tag,caption,attrs[]}>  exactly 2 panes (text)
 *   verdict      string   bottom conclusion line
 *   imageCount   number   0–2 (how many panes show an image)
 *   focusEnabled boolean  glow-emphasise one pane
 *   focusIndex   number   0 or 1
 *   showVs       boolean  show the centre VS badge
 *   showAttrs    boolean  show per-pane attribute chips
 *   showVerdict  boolean  show the bottom conclusion
 *   showCaptions boolean  show image captions
 *   images       array    image sources (preview wiring)
 *   onSlotActivate fn?     (i)=>void
 *   onSlotClear    fn?     (i)=>void
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots } from '../gxnPrimitives.jsx';

export const slideCompareDefaults = {
  kicker: 'CONTRAST · 两种路径',
  title: '叙事驱动 vs ',
  titleEm: '兑现驱动',
  sides: [
    { label: '叙事驱动', tag: '模型层 · OpenAI / Anthropic', caption: '通用大模型',
      attrs: ['巨额融资', '估值领先', '兑现待验证'] },
    { label: '兑现驱动', tag: '基础设施 · CoreWeave / Scale', caption: '算力与数据',
      attrs: ['收入确定', '客户集中', '卖铲子逻辑'] },
  ],
  verdict: '两条路径并非对立，而是节奏先后——资本正从“赌叙事”转向“看兑现”。',
  imageCount: 2,
  focusEnabled: false,
  focusIndex: 1,
  showVs: true,
  showAttrs: true,
  showVerdict: true,
  showCaptions: true,
  images: [],
};

export const slideCompareControls = [
  { key: 'imageCount', type: 'number', label: '配图栏数', default: 2, min: 0, max: 2, step: 1,
    describe: '带配图的对比栏数（0 = 纯文字对比）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一栏' },
  { key: 'focusIndex', type: 'number', label: '强调栏', default: 1, min: 0, max: 1, step: 1,
    oneBased: true, visibleWhen: (p) => p.focusEnabled, describe: '被强调栏（A / B）' },
  { key: 'showVs', type: 'toggle', label: '中央 VS', default: true,
    describe: '显示/隐藏中央 VS 徽章' },
  { key: 'showAttrs', type: 'toggle', label: '属性标签', default: true,
    describe: '显示/隐藏每栏的属性标签' },
  { key: 'showCaptions', type: 'toggle', label: '图注', default: true,
    visibleWhen: (p) => p.imageCount > 0, describe: '显示/隐藏图片说明' },
  { key: 'showVerdict', type: 'toggle', label: '结论', default: true,
    describe: '显示/隐藏底部结论' },
];

export function SlideCompare(props) {
  const p = { ...slideCompareDefaults, ...props };
  const sides = p.sides.slice(0, 2);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(1, p.focusIndex)) : -1;

  const Pane = ({ s, i }) => {
    const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
    const hasImg = i < p.imageCount;
    return (
      <section className={cx('gxn-panel', isF && 'is-focus')}
               style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 18,
                        opacity: isDim ? 0.55 : 1, transition: 'opacity .3s ease', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="gxn-mono" style={{ fontSize: 26, color: 'var(--gxn-accent)' }}>{String.fromCharCode(65 + i)}</span>
          <h3 style={{ margin: 0, fontSize: 38, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', textShadow: isF ? '0 0 24px rgba(var(--gxn-glow),0.45)' : 'none' }}>{s.label}</h3>
        </div>
        <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{s.tag}</span>
        {hasImg && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <ImageSlots count={1} items={[p.images[i]]}
                        captions={p.showCaptions ? [s.caption] : []}
                        onActivate={p.onSlotActivate ? () => p.onSlotActivate(i) : undefined}
                        onClear={p.onSlotClear ? () => p.onSlotClear(i) : undefined}
                        placeholder="拖入配图 · IMAGE" />
          </div>
        )}
        {p.showAttrs && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: hasImg ? 0 : 'auto' }}>
            {s.attrs.map((a, j) => (
              <span key={j} className="gxn-mono" style={{ fontSize: 24, padding: '7px 16px', borderRadius: 999,
                color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)',
                border: `1px solid ${isF ? 'rgba(var(--gxn-glow),0.45)' : 'var(--gxn-line)'}`, background: 'rgba(255,255,255,0.03)' }}>{a}</span>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "17 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 36, display: 'flex', flexDirection: 'column', gap: 24, minHeight: 0 }}>
          <div style={{ flex: 1, position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, minHeight: 0 }}>
            {sides.map((s, i) => <Pane key={i} s={s} i={i} />)}
            {p.showVs && (
              <span className="gxn-num" style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 2,
                width: 84, height: 84, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 700, color: '#07090b',
                background: 'linear-gradient(150deg, var(--gxn-accent-2), var(--gxn-accent))',
                boxShadow: '0 0 44px -6px rgba(var(--gxn-glow),0.85)',
              }}>VS</span>
            )}
          </div>
          {p.showVerdict && (
            <div className="gxn-panel" style={{ padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 18 }}>
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>结论</span>
              <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.4, color: 'var(--gxn-dim)' }}>{p.verdict}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideCompare;
