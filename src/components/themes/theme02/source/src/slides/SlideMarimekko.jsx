/**
 * SlideMarimekko.jsx — 市场结构（图表页 · 可变宽堆叠 / Marimekko）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 马赛克（Marimekko）图：横向每一列的「宽度」= 该赛道融资额占比，纵向每列内部
 * 再按阶段（segments）做 100% 堆叠。一张图同时读出「赛道有多大 × 各赛道里钱去了
 * 哪个阶段」。可强调某一列（其余淡出），列宽标签 / 段内占比 / 图例均可调。
 * 纯 div 布局（与堆叠条同构），仅依赖 props（含可选 gxnScheme 调色）。
 *
 * ── Props (see slideMarimekkoDefaults) ──────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   segLabels    string[]   纵向堆叠的分段类目（颜色一致，跨列对应）
 *   columns      Array<{label, weight, parts:number[]}>   每列：名称 / 宽度权重 / 各分段值
 *   colCount     number   展示的列数（2–n）
 *   focusEnabled boolean  辉光强调某一列
 *   focusIndex   number   0-based 被强调列
 *   showLegend   boolean  底部分段图例显隐
 *   showWidthLabels boolean 列顶名称 + 宽度占比显隐
 *   showValueLabels boolean 段内占比标签显隐
 *   gxnScheme    object?  { palette } 调色
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx, GXN_PALETTE } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideMarimekkoDefaults = {
  kicker: 'STRUCTURE · 市场结构',
  title: '宽度看赛道，高度看阶段 ',
  titleEm: '资本的双重集中',
  lead: '列越宽，说明这条赛道吸金越多；列内色块越高，说明钱越集中在那个阶段——基础设施又大又靠后期。',
  segLabels: ['种子 / A 轮', '成长期', '后期 / Pre-IPO'],
  columns: [
    { label: '基础设施', weight: 38, parts: [12, 30, 58] },
    { label: '通用大模型', weight: 27, parts: [18, 34, 48] },
    { label: '应用层', weight: 20, parts: [40, 38, 22] },
    { label: '行业垂直', weight: 9, parts: [52, 33, 15] },
    { label: '工具 / 中间件', weight: 6, parts: [60, 28, 12] },
  ],
  colCount: 5,
  focusEnabled: true,
  focusIndex: 0,
  showLegend: true,
  showWidthLabels: true,
  showValueLabels: true,
};

export const slideMarimekkoControls = [
  { key: 'colCount', type: 'number', label: '列数（赛道）', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.columns ? p.columns.length : 5), describe: '展示的赛道列数' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否辉光强调某一列' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.colCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调赛道列的序号' },
  { key: 'showWidthLabels', type: 'toggle', label: '列名 / 宽度', default: true,
    describe: '列顶名称 + 宽度占比显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '段内占比', default: true,
    describe: '每个色块内的阶段占比显隐' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '底部分段图例显隐' },
];

export function SlideMarimekko(props) {
  const p = { ...slideMarimekkoDefaults, ...props };
  const count = Math.max(2, Math.min(p.columns.length, p.colCount));
  const columns = p.columns.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const palette = (p.gxnScheme && p.gxnScheme.palette) || GXN_PALETTE;
  const segColor = (i) => palette[i % palette.length];
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0) || 1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '27 / 43'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1300 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 34, minHeight: 0, display: 'flex',
          flexDirection: 'column', gap: 30 }}>

          {/* mekko plot — variable-width columns, each a vertical 100% stack */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 10, alignItems: 'stretch' }}>
            {columns.map((col, ci) => {
              const wPct = (col.weight / totalWeight) * 100;
              const isF = ci === fIdx; const isDim = fIdx >= 0 && !isF;
              const partTotal = col.parts.reduce((s, v) => s + v, 0) || 1;
              return (
                <div key={ci} style={{ flexGrow: col.weight, flexBasis: 0, minWidth: 0,
                  display: 'flex', flexDirection: 'column', gap: 12,
                  opacity: isDim ? 0.4 : 1, transition: 'opacity .3s ease' }}>

                  {/* column header — name + width share */}
                  {p.showWidthLabels && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                      <span style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.15,
                        color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.label}</span>
                      <span className="gxn-num" style={{ fontSize: 22, fontWeight: 600,
                        color: isF ? 'var(--gxn-accent)' : 'var(--gxn-faint)' }}>
                        {Math.round(wPct)}<span style={{ fontSize: '0.7em' }}>%</span>
                      </span>
                    </div>
                  )}

                  {/* vertical 100% stack */}
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
                    borderRadius: 12, overflow: 'hidden',
                    boxShadow: isF ? '0 0 56px -12px rgba(var(--gxn-glow),0.5), inset 0 0 0 2px rgba(var(--gxn-glow),0.5)' : 'none' }}>
                    {col.parts.map((v, si) => {
                      const hPct = (v / partTotal) * 100;
                      const c = segColor(si);
                      const showLbl = p.showValueLabels && hPct >= 12 && wPct >= 9;
                      return (
                        <div key={si} style={{ flexGrow: v, flexBasis: 0, background: c,
                          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderBottom: si < col.parts.length - 1 ? '2px solid rgba(7,9,11,0.85)' : 'none',
                          boxShadow: isF && !isDim ? `inset 0 0 40px -6px ${c}` : 'none' }}>
                          {showLbl && (
                            <span className="gxn-num" style={{ fontSize: 26, fontWeight: 700,
                              color: '#07090b' }}>{Math.round(hPct)}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* legend — stacked segment categories (consistent colours) */}
          {p.showLegend && (
            <ul className="gxn-legend" style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '14px 44px' }}>
              {p.segLabels.map((lbl, si) => (
                <li key={si} className="gxn-legend-row">
                  <span className="gxn-dot" style={{ background: segColor(si), color: segColor(si) }} />
                  <span style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-dim)' }}>{lbl}</span>
                </li>
              ))}
              <li className="gxn-legend-row" style={{ marginLeft: 'auto' }}>
                <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)' }}>
                  列宽 = 赛道融资额占比 · 列高 = 阶段 100% 堆叠
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideMarimekko;
