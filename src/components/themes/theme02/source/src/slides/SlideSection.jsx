/**
 * SlideSection.jsx — Slide 07 · 章节分隔页 / Section divider.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideSectionDefaults) ────────────────────────────────────────
 *   kicker, chapterNo, title, titleEm, lead    strings
 *   agenda       string[]   optional small chapter index list (text)
 *   align        'left' | 'center'   composition
 *   showNumber   boolean    show the oversized chapter numeral
 *   showAgenda   boolean    show the small chapter index list
 *   showLead     boolean    show the descriptor line
 *   showRule     boolean    show the accent rule
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';

export const slideSectionDefaults = {
  kicker: 'PART 02 · 深度透视',
  chapterNo: '02',
  title: '结构与机会 ',
  titleEm: '在分化中定位',
  lead: '当资本从“赌叙事”转向“看兑现”，真正的问题不再是谁融得最多，而是热度与兑现如何分布、产业链各层级的确定性几何。',
  agenda: ['四象限 · 资本热度 × 商业兑现', '产业链分层 · 上游 / 中游 / 下游', '年度关键指标复盘'],
  align: 'left',
  showNumber: true,
  showAgenda: true,
  showLead: true,
  showRule: true,
};

export const slideSectionControls = [
  { key: 'align', type: 'enum', label: '对齐', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    describe: '章节页整体对齐方式' },
  { key: 'showNumber', type: 'toggle', label: '章节大序号', default: true,
    describe: '显示/隐藏超大章节编号' },
  { key: 'showAgenda', type: 'toggle', label: '章节目录', default: true,
    describe: '显示/隐藏小节索引列表' },
  { key: 'showLead', type: 'toggle', label: '导语', default: true,
    describe: '显示/隐藏章节导语' },
  { key: 'showRule', type: 'toggle', label: '强调分隔线', default: true,
    describe: '显示/隐藏标题旁的强调短线' },
];

export function SlideSection(props) {
  const p = { ...slideSectionDefaults, ...props };
  const centered = p.align === 'center';

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad" style={{ justifyContent: 'center' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: !p.showNumber || centered ? '1fr' : 'auto 1fr',
          gap: centered ? 36 : 80, alignItems: 'center',
          textAlign: centered ? 'center' : 'left', justifyItems: centered ? 'center' : 'start',
        }}>
          {p.showNumber && (
            <div className="gxn-num gxn-rise" style={{
              fontSize: 460, fontWeight: 700, lineHeight: 0.8, letterSpacing: '-0.04em',
              color: 'transparent', WebkitTextStroke: '2px rgba(var(--gxn-glow),0.55)',
              textShadow: '0 0 80px rgba(var(--gxn-glow),0.35)',
              gridRow: centered ? 'auto' : '1 / span 1',
            }}>{p.chapterNo}</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: centered ? 'center' : 'flex-start', maxWidth: 1180 }}>
            <p className="gxn-kicker gxn-rise">{p.kicker}</p>
            <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.12 }}>
              {p.title}
              <span className="gxn-em" style={{ display: 'block' }}>{p.titleEm}</span>
            </h1>
            {p.showRule && <span className="gxn-rise-2" style={{ width: 120, height: 4, borderRadius: 4, background: 'linear-gradient(90deg, var(--gxn-accent), transparent)', boxShadow: '0 0 16px rgba(var(--gxn-glow),0.8)' }} />}
            {p.showLead && <p className="gxn-sub gxn-rise-3" style={{ maxWidth: 900 }}>{p.lead}</p>}

            {p.showAgenda && (
              <ul className="gxn-rise-3" style={{
                listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 14,
                alignItems: centered ? 'center' : 'flex-start',
              }}>
                {p.agenda.map((a, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: 'var(--gxn-fs-h3)', color: 'var(--gxn-dim)', fontWeight: 500, whiteSpace: 'nowrap' }}>{a}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideSection;
