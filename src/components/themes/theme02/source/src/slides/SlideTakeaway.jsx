/**
 * SlideTakeaway.jsx — 核心结论（结论页 · 特写 + 光轨清单）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 版式：左侧「特写」结论（巨号编号 + 大字主张 + 说明，置于辉光面板内），右侧其余结论
 * 排成一列「光轨清单」（细号编号 + 主张 + 说明，竖向光轨串联、发光节点、细线分隔）。
 * 与「步骤流 / 等分卡片」截然不同——主次分明的编辑式排布。纯 props，无运行时依赖。
 *
 * ── Props (see slideTakeawayDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   items        Array<{lead, body}>   每条结论的主张 + 说明
 *   itemCount    number   结论条数（2–n）
 *   featureIndex number   作为左侧「特写」的结论序号（0-based）
 *   focusEnabled boolean  是否给特写面板辉光强调
 *   showIndex    boolean  大号 / 细号编号显隐
 *   showBody     boolean  支撑说明显隐
 *   showRail     boolean  右侧清单竖向光轨 + 节点显隐
 *   showDivider  boolean  右侧清单分隔细线显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideTakeawayDefaults = {
  kicker: 'TAKEAWAYS · 核心结论',
  title: '四句话 ',
  titleEm: '读懂这一年',
  items: [
    { lead: '资本高度集中', body: '近三分之一的美国风险投资涌入 AI，并进一步向旧金山湾区与少数头部聚拢。' },
    { lead: '估值跑在营收前面', body: '大额融资由叙事与算力预期驱动，商业化兑现是下一阶段真正的考题。' },
    { lead: '基础设施最确定', body: '算力、数据与平台层吃下最确定的红利，应用层的分化将更加剧烈。' },
    { lead: '窗口正在收窄', body: '门槛逐级抬高，能把技术转化为可持续收入的公司，才会穿越周期。' },
  ],
  itemCount: 4,
  featureIndex: 0,
  focusEnabled: true,
  showIndex: true,
  showBody: true,
  showRail: true,
  showDivider: true,
};

export const slideTakeawayControls = [
  { key: 'itemCount', type: 'number', label: '结论条数', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 4), describe: '核心结论的条数' },
  { key: 'featureIndex', type: 'number', label: '特写项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.itemCount || 1) - 1),
    describe: '作为左侧特写大图的结论序号' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否辉光强调左侧特写面板' },
  { key: 'showIndex', type: 'toggle', label: '编号', default: true,
    describe: '大号 / 细号编号显隐' },
  { key: 'showBody', type: 'toggle', label: '支撑说明', default: true,
    describe: '支撑说明文案显隐' },
  { key: 'showRail', type: 'toggle', label: '清单光轨', default: true,
    describe: '右侧清单竖向光轨与发光节点显隐' },
  { key: 'showDivider', type: 'toggle', label: '清单分隔线', default: true,
    describe: '右侧清单条目之间分隔细线显隐' },
];

export function SlideTakeaway(props) {
  const p = { ...slideTakeawayDefaults, ...props };
  const count = Math.max(2, Math.min(p.items.length, p.itemCount));
  const all = p.items.slice(0, count).map((it, i) => ({ ...it, n: i }));
  const fIdx = Math.max(0, Math.min(count - 1, p.featureIndex));
  const hero = all[fIdx];
  const rest = all.filter((_, i) => i !== fIdx);
  const num = (i) => String(i + 1).padStart(2, '0');

  /* ── Left · 特写面板 ─────────────────────────────────────────────── */
  const Hero = () => (
    <article className={cx('gxn-panel', p.focusEnabled && 'is-focus')}
             style={{ flex: '0 0 41%', minWidth: 0, position: 'relative', overflow: 'hidden',
                      padding: '54px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 30, height: 2, borderRadius: 2, flex: '0 0 auto',
          background: 'linear-gradient(90deg,var(--gxn-accent),transparent)',
          boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />
        <span className="gxn-mono" style={{ fontSize: 22, letterSpacing: '.16em',
          textTransform: 'uppercase', color: 'var(--gxn-accent)' }}>头条结论 · LEAD</span>
      </div>

      {p.showIndex && (
        <span className="gxn-num" aria-hidden="true" style={{
          position: 'absolute', top: -26, right: 18, fontSize: 300, fontWeight: 600, lineHeight: 0.8,
          letterSpacing: '-0.04em', color: 'transparent',
          WebkitTextStroke: '1.5px rgba(var(--gxn-glow),0.30)', pointerEvents: 'none' }}>{num(fIdx)}</span>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
        {p.showIndex && (
          <span className="gxn-num" style={{ fontSize: 84, fontWeight: 600, lineHeight: 0.78,
            letterSpacing: '-0.03em', color: 'var(--gxn-accent)',
            textShadow: '0 0 38px rgba(var(--gxn-glow),0.5)' }}>{num(fIdx)}</span>
        )}
        <h3 style={{ margin: 0, fontSize: 60, fontWeight: 700, lineHeight: 1.08,
          letterSpacing: '-0.01em', color: 'var(--gxn-text)', textWrap: 'balance' }}>{hero.lead}</h3>
        {p.showBody && hero.body && (
          <p style={{ margin: 0, fontSize: 29, lineHeight: 1.6, color: 'var(--gxn-dim)',
            textWrap: 'pretty', maxWidth: 620 }}>{hero.body}</p>
        )}
      </div>
    </article>
  );

  /* ── Right · 光轨清单 ────────────────────────────────────────────── */
  const Row = ({ it, last }) => (
    <li style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center',
                 gap: 30, padding: p.showRail ? '0 4px 0 50px' : '0 4px',
                 borderBottom: p.showDivider && !last ? '1px solid var(--gxn-line)' : '1px solid transparent' }}>
      {p.showRail && (
        <span aria-hidden="true" style={{ position: 'absolute', left: 13, top: '50%', width: 14, height: 14,
          marginTop: -7, borderRadius: '50%', background: 'var(--gxn-accent)',
          boxShadow: '0 0 0 5px rgba(var(--gxn-glow),0.12), 0 0 22px 1px rgba(var(--gxn-glow),0.85)' }} />
      )}
      {p.showIndex && (
        <span className="gxn-num" style={{ flex: '0 0 auto', fontSize: 52, fontWeight: 600, lineHeight: 0.9,
          letterSpacing: '-0.02em', color: 'transparent',
          WebkitTextStroke: '1.4px rgba(var(--gxn-glow),0.62)' }}>{num(it.n)}</span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: 33, fontWeight: 700, lineHeight: 1.18,
          color: 'var(--gxn-text)' }}>{it.lead}</h4>
        {p.showBody && it.body && (
          <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5, color: 'var(--gxn-dim)',
            textWrap: 'pretty' }}>{it.body}</p>
        )}
      </div>
    </li>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '27 / 31'} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 44, minHeight: 0,
          display: 'flex', alignItems: 'stretch', gap: 52 }}>
          <Hero />

          <ol style={{ flex: 1, minWidth: 0, margin: 0, padding: 0, listStyle: 'none', position: 'relative',
            display: 'flex', flexDirection: 'column' }}>
            {p.showRail && rest.length > 1 && (
              <span aria-hidden="true" style={{ position: 'absolute', left: 19, top: '7%', bottom: '7%', width: 2,
                borderRadius: 2, background: 'linear-gradient(180deg, transparent, rgba(var(--gxn-glow),0.5) 12%, rgba(var(--gxn-glow),0.5) 88%, transparent)',
                boxShadow: '0 0 16px rgba(var(--gxn-glow),0.4)' }} />
            )}
            {rest.map((it, i) => (
              <Row key={it.n} it={it} last={i === rest.length - 1} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default SlideTakeaway;
