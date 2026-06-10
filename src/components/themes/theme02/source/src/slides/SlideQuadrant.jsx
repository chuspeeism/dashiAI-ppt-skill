/**
 * SlideQuadrant.jsx — Slide 08 · 四象限矩阵 / 资本热度 × 商业兑现（图表页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideQuadrantDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   axes         {x,y,xLow,xHigh,yLow,yHigh}   axis labels (text)
 *   quadrants    Array<{label,desc,items[]}>   4 cells, reading order:
 *                [上左, 上右, 下左, 下右]
 *   focusEnabled boolean   glow-emphasise one quadrant
 *   focusIndex   number    0-based quadrant (0..3)
 *   showItems    boolean   show the company chips inside each quadrant
 *   showDesc     boolean   show the quadrant description line
 *   showAxisLabels boolean show the axis labels & end markers
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideQuadrantDefaults = {
  kicker: 'MATRIX · 选题四象限',
  title: '资本热度 × 商业兑现 ',
  titleEm: '四类机会',
  axes: { x: '商业兑现度', y: '资本热度', xLow: '待验证', xHigh: '高', yLow: '低 / 中', yHigh: '高' },
  quadrants: [
    { label: '叙事泡沫区', desc: '巨额融资，兑现受算力成本与付费转化约束。', items: ['OpenAI', 'Anthropic', 'xAI', 'SSI'] },
    { label: '明星兑现区', desc: '热度与收入确定性兼具，“卖铲子”逻辑。', items: ['CoreWeave', 'Databricks', 'Scale AI'] },
    { label: '等待验证区', desc: '概念成立但规模未证，作为边缘变量观察。', items: ['工具链', '安全', '早期硬件'] },
    { label: '隐形价值区', desc: '单笔不大但落地清晰，看留存与续约。', items: ['Glean', 'Perplexity'] },
  ],
  focusEnabled: true,
  focusIndex: 1,
  showItems: true,
  showDesc: true,
  showAxisLabels: true,
};

export const slideQuadrantControls = [
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一象限' },
  { key: 'focusIndex', type: 'number', label: '强调象限', default: 1, min: 0, max: 3, step: 1,
    oneBased: true, visibleWhen: (p) => p.focusEnabled, describe: '被强调象限的序号（按阅读顺序）' },
  { key: 'showItems', type: 'toggle', label: '代表公司', default: true,
    describe: '显示/隐藏象限内的公司标签' },
  { key: 'showDesc', type: 'toggle', label: '象限说明', default: true,
    describe: '显示/隐藏象限描述文案' },
  { key: 'showAxisLabels', type: 'toggle', label: '坐标轴', default: true,
    describe: '显示/隐藏坐标轴标签与端点' },
];

export function SlideQuadrant(props) {
  const p = { ...slideQuadrantDefaults, ...props };
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(3, p.focusIndex)) : -1;
  const qs = p.quadrants.slice(0, 4);

  const Cell = ({ q, i }) => {
    const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
    return (
      <div className={cx('gxn-panel', isF && 'is-focus')}
           style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column', gap: 14,
                    opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 34, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', textShadow: isF ? '0 0 24px rgba(var(--gxn-glow),0.45)' : 'none' }}>{q.label}</h3>
          <span className="gxn-index">{String(i + 1).padStart(2, '0')}</span>
        </div>
        {p.showDesc && <p style={{ margin: 0, fontSize: 24, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{q.desc}</p>}
        {p.showItems && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' }}>
            {q.items.map((it, j) => (
              <span key={j} className="gxn-mono" style={{
                fontSize: 24, padding: '7px 16px', borderRadius: 999,
                color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)',
                border: `1px solid ${isF ? 'rgba(var(--gxn-glow),0.45)' : 'var(--gxn-line)'}`,
                background: 'rgba(255,255,255,0.03)',
              }}>{it}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "09 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 36, display: 'grid', gridTemplateColumns: p.showAxisLabels ? '40px 1fr' : '1fr', gridTemplateRows: p.showAxisLabels ? '1fr 40px' : '1fr', columnGap: 22, rowGap: 16, minHeight: 0 }}>
          {/* Y axis */}
          {p.showAxisLabels && (
            <div style={{ gridColumn: 1, gridRow: 1, position: 'relative' }}>
              <span className="gxn-mono" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.14em' }}>{p.axes.y} ↑</span>
            </div>
          )}

          {/* quadrant grid */}
          <div style={{ gridColumn: p.showAxisLabels ? 2 : 1, gridRow: 1, position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 22, minHeight: 0 }}>
            {/* glowing center cross */}
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, transform: 'translateY(-50%)', background: 'rgba(var(--gxn-glow),0.4)', boxShadow: '0 0 14px rgba(var(--gxn-glow),0.5)', zIndex: 1, pointerEvents: 'none' }} />
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: 'rgba(var(--gxn-glow),0.4)', boxShadow: '0 0 14px rgba(var(--gxn-glow),0.5)', zIndex: 1, pointerEvents: 'none' }} />
            {qs.map((q, i) => <Cell key={i} q={q} i={i} />)}
          </div>

          {/* X axis */}
          {p.showAxisLabels && (
            <div style={{ gridColumn: p.showAxisLabels ? 2 : 1, gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>{p.axes.xLow}</span>
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.14em' }}>{p.axes.x} →</span>
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>{p.axes.xHigh}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideQuadrant;
