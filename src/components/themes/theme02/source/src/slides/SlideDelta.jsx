/**
 * SlideDelta.jsx — 今昔对照（大数字页 · 变化）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 两个巨型数字「从 → 到」并置，中央一枚发光变化徽标（箭头 + 增减幅），把一年里
 * 最有冲击力的一组变化讲清楚。与「巨型数字」单点铺满互补：此页讲的是“变了多少”。
 * 可强调任一侧、可附支撑小数据。仅依赖 props。
 *
 * ── Props (see slideDeltaDefaults) ──────────────────────────────────────────
 *   kicker                           string
 *   from / to    {value, unit, label}   起点 / 终点（label 为时点或口径）
 *   delta        {value, dir, label}    dir: 'up' | 'down'；value 如 '+218%'
 *   caption                          string  底部一句话说明
 *   support      Array<{value,unit,label}>  支撑小数据
 *   supportCount number   展示的支撑数据数量（0–n）
 *   emphasize    'to' | 'from' | 'both'  辉光强调哪一侧
 *   showBadge    boolean  中央变化徽标显隐
 *   showLabels   boolean  起点 / 终点时点标签显隐
 *   showCaption  boolean  底部说明显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideDeltaDefaults = {
  kicker: 'SHIFT · 一年之变',
  from: { value: '305', unit: '亿', label: '2023 全年' },
  to: { value: '970', unit: '亿', label: '2024 全年' },
  delta: { value: '+218', dir: 'up', label: '同比增幅' },
  caption: '一年时间，美国 AI 初创吸纳的风险投资翻了三倍有余——资本以前所未有的密度押注同一条主线。',
  support: [
    { value: '97', unit: '笔', label: '大额融资事件' },
    { value: '≈1/3', unit: '', label: '占全美 VC 比重' },
    { value: '10', unit: '亿/笔', label: '平均单笔规模' },
  ],
  supportCount: 3,
  emphasize: 'to',
  showBadge: true,
  showLabels: true,
  showCaption: true,
};

export const slideDeltaControls = [
  { key: 'emphasize', type: 'enum', label: '强调侧', default: 'to',
    options: [{ value: 'to', label: '强调终点' }, { value: 'from', label: '强调起点' }, { value: 'both', label: '两侧都亮' }],
    describe: '辉光强调哪一侧数字' },
  { key: 'showBadge', type: 'toggle', label: '变化徽标', default: true,
    describe: '中央箭头 + 增减幅徽标显隐' },
  { key: 'showLabels', type: 'toggle', label: '时点标签', default: true,
    describe: '起点 / 终点的时点标签显隐' },
  { key: 'supportCount', type: 'number', label: '支撑数据', default: 3, min: 0, step: 1,
    maxFrom: (p) => (p.support ? p.support.length : 3), describe: '底部支撑小数据数量（0 = 不显示）' },
  { key: 'showCaption', type: 'toggle', label: '底部说明', default: true,
    describe: '底部一句话说明显隐' },
];

function BigFigure({ data, showLabel, glow, align }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0,
      alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      textAlign: align === 'right' ? 'right' : 'left' }}>
      {showLabel && data.label && (
        <span className="gxn-mono" style={{ fontSize: 26, letterSpacing: '.08em',
          color: glow ? 'var(--gxn-accent)' : 'var(--gxn-faint)' }}>{data.label}</span>
      )}
      <div className={cx('gxn-num', glow && 'gxn-aurora-num')} style={{
        fontSize: 230, fontWeight: 600, lineHeight: 0.82, letterSpacing: '-0.04em',
        whiteSpace: 'nowrap',
        color: glow ? 'var(--gxn-accent)' : 'var(--gxn-dim)',
        textShadow: glow ? '0 0 64px rgba(var(--gxn-glow),0.5)' : 'none' }}>
        {data.value}
        {data.unit && <span style={{ fontSize: '0.24em', marginLeft: 12, fontWeight: 500,
          letterSpacing: 0, color: glow ? 'var(--gxn-text)' : 'var(--gxn-faint)' }}>{data.unit}</span>}
      </div>
    </div>
  );
}

export function SlideDelta(props) {
  const p = { ...slideDeltaDefaults, ...props };
  const emFrom = p.emphasize === 'from' || p.emphasize === 'both';
  const emTo = p.emphasize === 'to' || p.emphasize === 'both';
  const up = !p.delta || p.delta.dir !== 'down';
  const sCount = Math.max(0, Math.min(p.support.length, p.supportCount));
  const support = p.support.slice(0, sCount);

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} index={p.index || '16 / 43'} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, minHeight: 0, display: 'flex',
          flexDirection: 'column', justifyContent: 'center', gap: 56 }}>

          {/* from → badge → to */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
            gap: 48 }}>
            <BigFigure data={p.from} showLabel={p.showLabels} glow={emFrom} align="left" />

            {p.showBadge && p.delta && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                <div aria-hidden="true" style={{ width: 92, height: 92, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'radial-gradient(circle at 50% 38%, #11151b, #06080a)',
                  border: '1px solid rgba(var(--gxn-glow),0.45)',
                  boxShadow: '0 0 0 8px rgba(7,9,11,0.9), 0 0 60px -10px rgba(var(--gxn-glow),0.7), inset 0 0 24px -6px rgba(var(--gxn-glow),0.5)' }}>
                  <span style={{ fontSize: 50, lineHeight: 1, color: 'var(--gxn-accent)',
                    transform: up ? 'none' : 'scaleY(-1)',
                    textShadow: '0 0 22px rgba(var(--gxn-glow),0.8)' }}>↗</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="gxn-num gxn-aurora-num" style={{ fontSize: 64, fontWeight: 700,
                    lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--gxn-accent)' }}>
                    {p.delta.value}<span style={{ fontSize: '0.5em' }}>%</span>
                  </span>
                  {p.delta.label && (
                    <span className="gxn-mono" style={{ fontSize: 23, color: 'var(--gxn-faint)' }}>{p.delta.label}</span>
                  )}
                </div>
              </div>
            )}

            <BigFigure data={p.to} showLabel={p.showLabels} glow={emTo} align="right" />
          </div>

          {/* caption */}
          {p.showCaption && p.caption && (
            <p className="gxn-rise-3" style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)',
              lineHeight: 1.5, color: 'var(--gxn-dim)', maxWidth: 1400, textWrap: 'pretty' }}>{p.caption}</p>
          )}

          {/* support stats */}
          {support.length > 0 && (
            <div className="gxn-rise-4" style={{ display: 'grid',
              gridTemplateColumns: `repeat(${support.length}, 1fr)`, gap: 24 }}>
              {support.map((s, i) => (
                <div key={i} className="gxn-panel" style={{ padding: '26px 32px', display: 'flex',
                  flexDirection: 'column', gap: 8 }}>
                  <span className="gxn-num" style={{ fontSize: 64, fontWeight: 600, lineHeight: 0.95,
                    letterSpacing: '-0.02em', color: 'var(--gxn-text)', whiteSpace: 'nowrap' }}>
                    {s.value}{s.unit && <span style={{ fontSize: '0.4em', marginLeft: 6,
                      color: 'var(--gxn-dim)', fontWeight: 500 }}>{s.unit}</span>}
                  </span>
                  <span className="gxn-mono" style={{ fontSize: 23, color: 'var(--gxn-faint)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideDelta;
