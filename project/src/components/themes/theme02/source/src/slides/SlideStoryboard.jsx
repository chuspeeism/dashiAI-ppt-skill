/**
 * SlideStoryboard.jsx — 进程图带（图片页 · 编号步骤带）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * A horizontal band of numbered steps, each = an (optional) ratio-tolerant
 * image slot above a caption block (index · tag · title · note). The step
 * count and the number of image slots are independently tunable; slots fill the FIRST `imageCount`
 * steps, the rest render as image-free text cards — so the same component
 * works as a pure-text progression (imageCount = 0) up to a full filmstrip.
 *
 * ── Props (see slideStoryboardDefaults) ─────────────────────────────────────
 *   kicker, title, titleEm, lead       strings
 *   steps        Array<{tag,title,note}>  the step content (text always shown)
 *   stepCount    number   2–4 steps to render (slices `steps`)
 *   imageCount   number   0–stepCount image slots (fill the first N steps)
 *   focusEnabled boolean  emphasise one step (others dim)
 *   focusIndex   number   0-based step to emphasise
 *   showLead     boolean  show/hide the intro lead line
 *   images       array    image sources (preview wiring)
 *   onSlotActivate, onSlotClear  fn?  preview slot wiring
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots } from '../gxnPrimitives.jsx';

export const slideStoryboardDefaults = {
  kicker: 'CASE · 融资进程',
  title: 'Anthropic 一年内 ',
  titleEm: '连续三轮跃迁',
  lead: '2024 年 5 月、8 月、11 月连续完成大额融资，估值由 600 亿一路抬升至 9650 亿美元，并于 2026 年递交 IPO 申请。',
  steps: [
    { tag: '2024 · 05', title: 'Series G', note: '融资 280 亿 · 估值 600 亿美元' },
    { tag: '2024 · 08', title: 'Series H 首轮', note: '融资 180 亿 · 估值 830 亿美元' },
    { tag: '2024 · 11', title: 'Series H 扩轮', note: '融资 190 亿 · 估值 9650 亿美元' },
    { tag: '2026 · 06', title: '递交 IPO', note: '已提交申请 · 预计年内上市' },
  ],
  stepCount: 4,
  imageCount: 4,
  focusEnabled: true,
  focusIndex: 2,
  showLead: true,
  images: [],
};

export const slideStoryboardControls = [
  { key: 'stepCount', type: 'number', label: '步骤数量', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.steps ? p.steps.length : 4), describe: '进程带中的步骤数量' },
  { key: 'imageCount', type: 'number', label: '图片数量', default: 4, min: 0, step: 1,
    maxFrom: (p) => p.stepCount || 4, describe: '配图槽位数量（自前向后填充；0 = 纯文字步骤）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一个步骤' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 2, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.stepCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调步骤的序号' },
  { key: 'showLead', type: 'toggle', label: '引言', default: true,
    describe: '显示/隐藏标题下方的引言' },
];

export function SlideStoryboard(props) {
  const p = { ...slideStoryboardDefaults, ...props };
  const n = Math.max(2, Math.min((p.steps || []).length, p.stepCount));
  const steps = (p.steps || []).slice(0, n);
  const imgN = Math.max(0, Math.min(n, p.imageCount));
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(n - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm}
                     subtitle={p.showLead ? p.lead : null} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, minHeight: 0, position: 'relative' }}>
          <div style={{ position: 'relative', height: '100%', display: 'grid', gap: 30,
                        gridTemplateColumns: `repeat(${n}, 1fr)`, alignItems: 'stretch' }}>
            {steps.map((s, i) => {
              const focus = i === fIdx;
              const dim = fIdx >= 0 && !focus;
              const hasImg = i < imgN;
              return (
                <div key={i} className={cx('gxn-panel', focus && 'is-focus', dim && 'is-dim')}
                     style={{ display: 'flex', flexDirection: 'column', padding: 18, gap: 16, minHeight: 0 }}>
                  {hasImg && (
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <ImageSlots count={1} items={[p.images[i]]} arrange="row" gap={0}
                                  focusIndex={focus ? 0 : -1}
                                  onActivate={p.onSlotActivate ? () => p.onSlotActivate(i) : undefined}
                                  onClear={p.onSlotClear ? () => p.onSlotClear(i) : undefined}
                                  placeholder={`步骤 ${i + 1} 配图`} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: hasImg ? '0 0 auto' : 1, justifyContent: hasImg ? 'flex-start' : 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span className="gxn-num" style={{
                        fontSize: 30, fontWeight: 700, lineHeight: 1,
                        color: focus ? 'var(--gxn-accent)' : 'var(--gxn-faint)',
                        textShadow: focus ? '0 0 22px rgba(var(--gxn-glow),0.6)' : 'none',
                      }}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="gxn-mono" style={{ fontSize: 22, letterSpacing: '.06em', color: 'var(--gxn-accent)' }}>{s.tag}</span>
                    </div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700, fontSize: hasImg ? 30 : 38, lineHeight: 1.15, color: 'var(--gxn-text)' }}>{s.title}</h3>
                    <p style={{ margin: 0, fontSize: hasImg ? 23 : 26, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{s.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideStoryboard;
