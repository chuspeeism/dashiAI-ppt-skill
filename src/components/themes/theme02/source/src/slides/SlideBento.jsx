/**
 * SlideBento.jsx — 数据看板（看板页 · Bento 网格）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 便当式数据看板：一块主单元（大数字 + 注解 + 可选标签/迷你柱）+ 一组支撑小数字。
 * 主单元辉光强调，支撑数据数量与版式可调。纯 props，含可选 gxnScheme 调色。
 *
 * ── Props (see slideBentoDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   hero         {value,unit,caption,note}   主单元
 *   stats        Array<{value,unit,label}>   支撑小数字
 *   tags         string[]   主单元底部标签
 *   spark        number[]   主单元底部迷你柱数据
 *   statCount    number   支撑小数字数量（2–n）
 *   layout       'hero-left' | 'hero-right'  主单元左 / 右
 *   accentHero   boolean  主单元辉光强调
 *   heroExtra    'tags' | 'spark' | 'none'   主单元底部内容
 *   showCaption  boolean  主单元说明显隐
 *   gxnScheme    object?  { accent, glow, palette } 调色
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideBentoDefaults = {
  kicker: 'DASHBOARD · 数据看板',
  title: '一屏读懂 ',
  titleEm: '2024 资本全景',
  hero: { value: '970', unit: '亿美元', caption: '全年美国 AI 初创吸纳风险投资', note: '创历史新高 · 约占全美 VC 三分之一' },
  stats: [
    { value: '97', unit: '笔', label: '大额融资事件 ≥$100M' },
    { value: '≈10', unit: '亿美元', label: '平均单笔规模' },
    { value: '63.9', unit: '%', label: '集中于旧金山湾区' },
    { value: '5', unit: '家', label: '百亿美元估值俱乐部' },
  ],
  tags: ['通用大模型', '算力云', 'AI 应用', '数据基础设施', '安全对齐'],
  spark: [38, 52, 61, 74, 88, 97],
  statCount: 4,
  layout: 'hero-left',
  accentHero: true,
  heroExtra: 'tags',
  showCaption: true,
};

export const slideBentoControls = [
  { key: 'statCount', type: 'number', label: '支撑数字', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.stats ? p.stats.length : 4), describe: '右侧支撑小数字数量' },
  { key: 'layout', type: 'enum', label: '版式', default: 'hero-left',
    options: [{ value: 'hero-left', label: '主单元在左' }, { value: 'hero-right', label: '主单元在右' }],
    describe: '主单元位于左侧或右侧' },
  { key: 'accentHero', type: 'toggle', label: '主单元强调', default: true,
    describe: '主单元辉光强调显隐' },
  { key: 'heroExtra', type: 'enum', label: '主单元底部', default: 'tags',
    options: [{ value: 'tags', label: '标签' }, { value: 'spark', label: '迷你柱' }, { value: 'none', label: '无' }],
    describe: '主单元底部内容形态' },
  { key: 'showCaption', type: 'toggle', label: '主单元说明', default: true,
    describe: '主单元说明文案显隐' },
];

function Spark({ data, accent, glow }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 96 }}>
      {data.map((v, i) => {
        const last = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, height: `${Math.max(8, (v / max) * 100)}%`, borderRadius: 8,
            background: last ? accent : 'rgba(255,255,255,0.14)',
            boxShadow: last ? `0 0 20px -2px ${accent}` : 'none' }} />
        );
      })}
    </div>
  );
}

export function SlideBento(props) {
  const p = { ...slideBentoDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';

  const sCount = Math.max(2, Math.min(p.stats.length, p.statCount));
  const stats = p.stats.slice(0, sCount);
  const heroRight = p.layout === 'hero-right';
  const statCols = sCount <= 2 ? 1 : 2;

  const hero = (
    <article className={cx('gxn-panel', p.accentHero && 'is-focus')}
             style={{ position: 'relative', overflow: 'hidden', padding: '52px 56px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
      <div>
        <div className={cx('gxn-num', p.accentHero && 'gxn-aurora-num')} style={{ fontSize: 200, fontWeight: 600, lineHeight: 0.86,
          letterSpacing: '-0.04em', color: 'var(--gxn-accent)', textShadow: ' 0 0 60px rgba(var(--gxn-glow),0.5)',
          whiteSpace: 'nowrap' }}>
          {p.hero.value}
          <span style={{ fontSize: '0.24em', marginLeft: 14, color: 'var(--gxn-text)', fontWeight: 500,
            letterSpacing: 0 }}>{p.hero.unit}</span>
        </div>
        {p.showCaption && (
          <p style={{ margin: '22px 0 0', fontSize: 32, fontWeight: 500, color: 'var(--gxn-text)', lineHeight: 1.3 }}>
            {p.hero.caption}
          </p>
        )}
        {p.hero.note && (
          <p className="gxn-mono" style={{ margin: '12px 0 0', fontSize: 24, color: 'var(--gxn-faint)' }}>{p.hero.note}</p>
        )}
      </div>

      {p.heroExtra === 'tags' && p.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
          {p.tags.map((t, i) => (
            <span key={i} className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)',
              padding: '9px 20px', borderRadius: 999, border: '1px solid var(--gxn-line)',
              background: 'rgba(255,255,255,0.03)' }}>{t}</span>
          ))}
        </div>
      )}
      {p.heroExtra === 'spark' && p.spark.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <Spark data={p.spark} accent={accent} glow={glow} />
          <div className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', marginTop: 12 }}>
            季度节奏 · 资本逐季加码
          </div>
        </div>
      )}
    </article>
  );

  const right = (
    <div style={{ display: 'grid', gap: 28, minHeight: 0,
      gridTemplateColumns: `repeat(${statCols}, 1fr)`, gridAutoRows: '1fr' }}>
      {stats.map((s, i) => (
        <article key={i} className="gxn-panel" style={{ padding: '32px 34px', display: 'flex',
          flexDirection: 'column', justifyContent: 'center', gap: 12, minHeight: 0 }}>
          <span className="gxn-num" style={{ fontSize: 78, fontWeight: 600, lineHeight: 0.92,
            letterSpacing: '-0.02em', color: 'var(--gxn-text)', whiteSpace: 'nowrap' }}>
            {s.value}{s.unit && <span style={{ fontSize: '0.34em', marginLeft: 7, color: 'var(--gxn-dim)', fontWeight: 500 }}>{s.unit}</span>}
          </span>
          <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', lineHeight: 1.3 }}>{s.label}</span>
        </article>
      ))}
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "14 / 27"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 34, minHeight: 0, display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr', gap: 30 }}>
          {heroRight ? <>{right}{hero}</> : <>{hero}{right}</>}
        </div>
      </div>
    </div>
  );
}

export default SlideBento;
