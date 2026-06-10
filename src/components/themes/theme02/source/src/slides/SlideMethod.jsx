/**
 * SlideMethod.jsx — Slide 02 · 研究方法 / 横纵分析法.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideMethodDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, intro   strings (heading + lead-in)
 *   cards        Array<{tag,title,desc,axis}>  full card dataset (text)
 *   cardCount    number   how many of `cards` to show (1–4)
 *   focusEnabled boolean  glow-emphasise one card
 *   focusIndex   number   0-based card to emphasise (clamped to cardCount)
 *   showIndex    boolean  show/hide the 01·02 ordinal numbers
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideMethodDefaults = {
  kicker: 'METHOD · 研究方法',
  title: '横纵分析法 ',
  titleEm: '双维透视',
  intro: '从两个正交维度切入同一组数据，互为补充，避免单一视角的盲区，并在交叉处识别产业链结构。',
  cards: [
    { tag: '横向 · 空间维度', title: '谁更大 · 谁更密集', axis: 'h',
      desc: '在同一时间截面上，对不同公司、赛道、轮次、地区做横向对比，回答资源集中在哪里。' },
    { tag: '纵向 · 时间维度', title: '趋势向上还是向下', axis: 'v',
      desc: '沿时间轴追踪同一指标的演化，回答拐点在何处、节奏是否可持续。' },
    { tag: '交叉 · 结构维度', title: '层级与因果传导', axis: 'x',
      desc: '两个维度交叉后，进一步识别产业链的上中下游层级结构与因果传导关系。' },
    { tag: '应用 · 决策维度', title: '结构化的投资参考', axis: 'd',
      desc: '将横纵结论转化为可执行的判断框架，为后续投资与产品决策提供结构化依据。' },
  ],
  cardCount: 3,
  focusEnabled: false,
  focusIndex: 0,
  showIndex: true,
};

export const slideMethodControls = [
  { key: 'cardCount', type: 'number', label: '卡片数量', default: 3, min: 1, max: 4, step: 1,
    describe: '展示的维度卡片数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一张卡片' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.cardCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调卡片的序号' },
  { key: 'showIndex', type: 'toggle', label: '序号显示', default: true,
    describe: '显示/隐藏卡片左上角的 01 · 02 序号' },
];

function AxisMark({ kind, color }) {
  const c = color || 'var(--gxn-accent)';
  const common = { stroke: c, strokeWidth: 3, strokeLinecap: 'round', fill: 'none' };
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true"
         style={{ filter: 'drop-shadow(0 0 10px rgba(47,224,127,0.55))' }}>
      {kind === 'h' && <><line x1="6" y1="40" x2="50" y2="40" {...common} /><path d="M42 32 50 40 42 48" {...common} /></>}
      {kind === 'v' && <><line x1="16" y1="50" x2="16" y2="6" {...common} /><path d="M8 14 16 6 24 14" {...common} /></>}
      {kind === 'x' && <><line x1="6" y1="50" x2="50" y2="6" {...common} /><line x1="6" y1="6" x2="50" y2="50" {...common} opacity="0.45" /></>}
      {kind === 'd' && <><circle cx="28" cy="28" r="9" {...common} /><line x1="28" y1="6" x2="28" y2="14" {...common} /><line x1="28" y1="42" x2="28" y2="50" {...common} /><line x1="6" y1="28" x2="14" y2="28" {...common} /><line x1="42" y1="28" x2="50" y2="28" {...common} /></>}
    </svg>
  );
}

export function SlideMethod(props) {
  const p = { ...slideMethodDefaults, ...props };
  const count = Math.max(1, Math.min(p.cards.length, p.cardCount));
  const cards = p.cards.slice(0, count);
  const fIdx = Math.max(0, Math.min(count - 1, p.focusIndex));

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm}
                     subtitle={p.intro} index={p.index || "01 / 23"} />
        <div className="gxn-rise-2" style={{
          flex: 1, marginTop: 56, display: 'grid',
          gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 'var(--gxn-gap)', minHeight: 0,
        }}>
          {cards.map((c, i) => {
            const isF = p.focusEnabled && i === fIdx;
            const isDim = p.focusEnabled && i !== fIdx;
            return (
              <article key={i} className={cx('gxn-panel', isF && 'is-focus', isDim && 'is-dim')}
                       style={{ padding: '40px 38px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <AxisMark kind={c.axis} />
                  {p.showIndex && <span className="gxn-index">{String(i + 1).padStart(2, '0')}</span>}
                </div>
                <div className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-accent)', letterSpacing: '.06em' }}>
                  {c.tag}
                </div>
                <h2 style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', fontWeight: 700, lineHeight: 1.2, color: 'var(--gxn-text)' }}>
                  {c.title}
                </h2>
                <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.5, color: 'var(--gxn-dim)' }}>
                  {c.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlideMethod;
