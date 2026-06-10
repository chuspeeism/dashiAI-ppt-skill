/**
 * SlideMetrics.jsx — Slide 10 · 年度关键指标（大数字页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideMetricsDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   stats        Array<{value,unit,caption,delta}>  KPI dataset (text+numbers)
 *   statCount    number    how many of `stats` to show (2–4)
 *   layout       'row' | 'feature'   equal row, or 1 hero + stacked
 *   focusEnabled boolean   glow-emphasise one figure
 *   focusIndex   number    0-based figure to emphasise
 *   showDelta    boolean   show the delta / annotation badge
 *   showCaption  boolean   show the caption under each figure
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideMetricsDefaults = {
  kicker: 'KEY FIGURES · 年度关键指标',
  title: '一年资本盛宴 ',
  titleEm: '浓缩为四个数字',
  stats: [
    { value: '970', unit: '亿美元', caption: '全年 AI 风险投资总额', delta: '创历史新高' },
    { value: '97', unit: '笔', caption: '单笔 ≥1 亿美元事件', delta: '占全美 VC 近 1/3' },
    { value: '≈10', unit: '亿/笔', caption: '平均单笔融资规模', delta: '头部高度追捧' },
    { value: '63.9', unit: '%', caption: '旧金山湾区融资占比', delta: '地理护城河' },
  ],
  statCount: 4,
  layout: 'row',
  focusEnabled: false,
  focusIndex: 0,
  showDelta: true,
  showCaption: true,
};

export const slideMetricsControls = [
  { key: 'statCount', type: 'number', label: '数字数量', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.stats ? p.stats.length : 4), describe: '展示的关键数字数量' },
  { key: 'layout', type: 'enum', label: '版式', default: 'row',
    options: [{ value: 'row', label: '等分排列' }, { value: 'feature', label: '主次结构' }],
    describe: '等分一排，或一个主数字 + 其余次级' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一个数字' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.statCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调数字的序号' },
  { key: 'showDelta', type: 'toggle', label: '注解徽章', default: true,
    describe: '显示/隐藏数字旁的注解徽章' },
  { key: 'showCaption', type: 'toggle', label: '说明文案', default: true,
    describe: '显示/隐藏数字下方说明' },
];

export function SlideMetrics(props) {
  const p = { ...slideMetricsDefaults, ...props };
  const count = Math.max(2, Math.min(p.stats.length, p.statCount));
  const stats = p.stats.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const feature = p.layout === 'feature';

  const Panel = ({ s, i, hero }) => {
    const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
    const emph = isF || (i === 0 && fIdx < 0);
    return (
      <div className={cx('gxn-panel', isF && 'is-focus')}
           style={{ padding: hero ? '48px 52px' : feature ? '24px 30px' : '34px 38px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', gap: hero ? 16 : 12, opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease', minHeight: 0 }}>
        {p.showDelta && s.delta && (
          <span className="gxn-mono" style={{ alignSelf: 'flex-start', fontSize: 24, padding: '7px 16px', borderRadius: 999,
            color: 'var(--gxn-accent)', border: '1px solid rgba(var(--gxn-glow),0.4)', background: 'rgba(var(--gxn-glow),0.06)' }}>{s.delta}</span>
        )}
        <div className={cx('gxn-num', emph && 'gxn-aurora-num')} style={{
          fontSize: hero ? 210 : feature ? 88 : 124, fontWeight: 600, lineHeight: 0.9, letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
          color: emph ? 'var(--gxn-accent)' : 'var(--gxn-text)',
          textShadow: emph ? '0 0 44px rgba(var(--gxn-glow),0.5)' : 'none',
        }}>
          {s.value}
          {s.unit && <span style={{ fontSize: '0.3em', marginLeft: 12, color: 'var(--gxn-dim)', fontWeight: 500 }}>{s.unit}</span>}
        </div>
        {p.showCaption && <span style={{ fontSize: hero ? 32 : 25, color: 'var(--gxn-dim)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.caption}</span>}
      </div>
    );
  };

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "12 / 23"} />

        {feature ? (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, display: 'grid', gridTemplateColumns: '1.32fr 1fr', gridTemplateRows: `repeat(${Math.max(1, count - 1)}, 1fr)`, gap: 24, minHeight: 0 }}>
            <div style={{ gridColumn: 1, gridRow: `1 / span ${Math.max(1, count - 1)}` }}><Panel s={stats[0]} i={0} hero /></div>
            {stats.slice(1).map((s, k) => (
              <div key={k + 1} style={{ gridColumn: 2, gridRow: k + 1 }}><Panel s={s} i={k + 1} /></div>
            ))}
          </div>
        ) : (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 24, minHeight: 0 }}>
            {stats.map((s, i) => <Panel key={i} s={s} i={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideMetrics;
