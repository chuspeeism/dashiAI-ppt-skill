/**
 * SlidePictogram.jsx — 点阵单位图（图表页 · Isotype / Unit chart）.
 * Independent, prop-driven. Renders its own theme styles (pure CSS dots).
 *
 * 「一个点 = 一笔融资」。把全年笔数铺成发光点阵，按分组依次着色，直观看清各类别在
 * 总量中的份额与「头部集中」的分布。组数可调；可辉光强调某一组（其余淡出）。每个
 * 点用 div + box-shadow 渲染，自适应列宽，纯 props 驱动、无运行时依赖。
 *
 * ── Props (see slidePictogramDefaults) ──────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   groups       Array<{label,value,color?}>  各分组（value = 单位数）
 *   unit         string   单位名（如 “笔”）
 *   perRow       number   每行点数（决定点阵列数与点大小）
 *   groupCount   number   展示的分组数量（2–n）
 *   focusEnabled boolean  辉光强调某一组（其余淡出）
 *   focusIndex   number   0-based 被强调组
 *   showLegend   boolean  右侧图例显隐
 *   showValueLabels boolean  图例中数量 + 占比显隐
 *   gxnScheme    object?  { palette } 调色（缺省走主题调色板）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slidePictogramDefaults = {
  kicker: 'UNIT · 笔数分布',
  title: '97 笔大额融资 ',
  titleEm: '都在哪些轮次',
  lead: '每一个点代表一笔 ≥1 亿美元的融资事件，按融资轮次着色——「D 轮及以后」与「未标明轮次」合计占去半数。',
  // 源：报告 3.2 融资轮次结构（事件笔数）
  groups: [
    { label: '种子轮 / Seed', value: 8 },
    { label: 'A 轮 / Series A', value: 12 },
    { label: 'B 轮 / Series B', value: 18 },
    { label: 'C 轮 / Series C', value: 15 },
    { label: 'D 轮及以后', value: 22 },
    { label: '未标明轮次', value: 22 },
  ],
  unit: '笔',
  perRow: 16,
  groupCount: 6,
  focusEnabled: true,
  focusIndex: 4,
  showLegend: true,
  showValueLabels: true,
};

export const slidePictogramControls = [
  { key: 'groupCount', type: 'number', label: '分组数量', default: 6, min: 2, step: 1,
    maxFrom: (p) => (p.groups ? p.groups.length : 6), describe: '点阵着色的分组数量' },
  { key: 'perRow', type: 'number', label: '每行点数', default: 16, min: 8, max: 24, step: 1,
    describe: '每行的点数（越大点越小、阵列越宽）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一组（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 4, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.groupCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调组的序号' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '右侧分组图例显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '数量占比', default: true,
    describe: '图例中数量 + 占比显隐' },
];

export function SlidePictogram(props) {
  const p = { ...slidePictogramDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];

  const count = Math.max(2, Math.min(p.groups.length, p.groupCount));
  const groups = p.groups.slice(0, count).map((g, i) => ({ ...g, i, color: g.color || palette[i % palette.length] }));
  const total = groups.reduce((a, g) => a + g.value, 0) || 1;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const focused = fIdx >= 0;

  // flatten groups → one entry per unit, preserving group order
  const dots = [];
  groups.forEach((g) => { for (let k = 0; k < g.value; k++) dots.push(g); });
  const fg = focused ? groups[fIdx] : null;

  const cols = Math.max(8, Math.min(24, p.perRow));
  // dot size derived from available width (≈ 1040px plot column when legend on)

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 14, maxWidth: 1320 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 30, minHeight: 0, display: 'grid',
             gridTemplateColumns: p.showLegend ? '1.32fr 0.68fr' : '1fr', gap: 64, alignItems: 'center' }}>

          {/* dot matrix */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 'clamp(8px, 0.9vw, 16px)', width: '100%' }}>
              {dots.map((g, k) => {
                const isF = g.i === fIdx; const dim = focused && !isF;
                return (
                  <div key={k} style={{
                    width: '100%', aspectRatio: '1 / 1', borderRadius: '32%',
                    background: g.color,
                    opacity: dim ? 0.22 : 1,
                    boxShadow: dim ? 'none'
                      : `0 0 ${isF ? 16 : 9}px ${isF ? -1 : -2}px ${g.color}, inset 0 0 0 1px rgba(255,255,255,0.16)`,
                    transition: 'opacity .3s ease',
                  }} />
                );
              })}
            </div>
          </div>

          {/* legend */}
          {p.showLegend && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', minHeight: 0 }}>
              {groups.map((g) => {
                const isF = g.i === fIdx; const dim = focused && !isF;
                return (
                  <div key={g.i} className={cx('gxn-panel', isF && 'is-focus', dim && 'is-dim')}
                       style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 6, flex: '0 0 auto', background: g.color,
                      boxShadow: `0 0 16px -2px ${g.color}` }} />
                    <span style={{ flex: 1, minWidth: 0, fontSize: 25, fontWeight: 500, color: 'var(--gxn-text)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.label}</span>
                    {p.showValueLabels && (
                      <span className="gxn-num" style={{ display: 'flex', alignItems: 'baseline', gap: 8, flex: '0 0 auto' }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: isF ? g.color : 'var(--gxn-text)', letterSpacing: '-0.01em' }}>{g.value}</span>
                        <span className="gxn-mono" style={{ fontSize: 20, color: 'var(--gxn-faint)' }}>{Math.round((g.value / total) * 100)}%</span>
                      </span>
                    )}
                  </div>
                );
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, paddingLeft: 4 }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--gxn-faint)' }} />
                <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)' }}>1 点 = 1 {p.unit} · 共 {total} {p.unit}</span>
              </div>
            </div>
          )}
        </div>

        {fg && (
          <div className="gxn-rise-3" style={{ marginTop: 10, fontSize: 26, color: 'var(--gxn-dim)' }}>
            <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fg.label}</strong>
            {' '}{fg.value} {p.unit} · 占全部 {Math.round((fg.value / total) * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}

export default SlidePictogram;
