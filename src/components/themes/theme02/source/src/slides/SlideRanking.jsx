/**
 * SlideRanking.jsx — Slide 04 · 榜单 / 头部公司融资榜单（表格页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideRankingDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   columns      {rank,name,track,value}  table head labels (text)
 *   unit         string    value-column unit suffix
 *   rows         Array<{name,track,value}>  full dataset (text + numbers)
 *   rowCount     number    how many of `rows` to show
 *   focusEnabled boolean   glow-emphasise one row
 *   focusIndex   number    0-based row to emphasise (clamped to rowCount)
 *   showRank     boolean   show the rank badge column
 *   showTrack    boolean   show the sub-track label under each name
 *   showBars     boolean   show the proportional value bars
 *   showValueLabels boolean show the numeric value column
 *   gxnScheme    object    deck color scheme (preview-injected; optional)
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRankingDefaults = {
  kicker: 'LEADERBOARD · 头部玩家',
  title: '头部公司融资榜单 ',
  titleEm: '巨头吸金',
  columns: { rank: '排名', name: '公司', track: '主营赛道', value: '最大单笔（亿美元）' },
  unit: '',
  rows: [
    { name: 'OpenAI', track: '通用大模型', value: 66 },
    { name: 'Anthropic', track: '通用大模型', value: 65 },
    { name: 'xAI', track: '通用大模型', value: 50 },
    { name: 'CoreWeave', track: 'AI 基础设施 · 算力云', value: 11 },
    { name: 'Safe Superintelligence', track: '通用大模型', value: 10 },
    { name: 'Scale AI', track: 'AI 基础设施 · 数据标注', value: 10 },
    { name: 'Figure AI', track: 'AI 硬件 · 人形机器人', value: 6.8 },
    { name: 'Perplexity AI', track: '垂直应用 · AI 搜索', value: 5.2 },
    { name: 'Databricks', track: 'AI 基础设施 · 数据平台', value: 5.0 },
    { name: 'Glean', track: '垂直应用 · 企业搜索', value: 2.6 },
  ],
  rowCount: 6,
  focusEnabled: true,
  focusIndex: 0,
  showRank: true,
  showTrack: true,
  showBars: true,
  showValueLabels: true,
  footnote: '注：部分公司全年有多轮融资，此处仅列其最大单笔。',
};

export const slideRankingControls = [
  { key: 'rowCount', type: 'number', label: '行数', default: 6, min: 3, step: 1,
    maxFrom: (p) => (p.rows ? p.rows.length : 10), describe: '展示的榜单行数' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一行' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.rowCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调行的序号' },
  { key: 'showRank', type: 'toggle', label: '名次徽章', default: true,
    describe: '显示/隐藏左侧名次徽章' },
  { key: 'showTrack', type: 'toggle', label: '赛道列', default: true,
    describe: '显示/隐藏公司下方的赛道说明' },
  { key: 'showBars', type: 'toggle', label: '条形可视化', default: true,
    describe: '显示/隐藏融资额的等比条形' },
  { key: 'showValueLabels', type: 'toggle', label: '数值列', default: true,
    describe: '显示/隐藏右侧数值' },
];

export function SlideRanking(props) {
  const p = { ...slideRankingDefaults, ...props };
  const count = Math.max(1, Math.min(p.rows.length, p.rowCount));
  const rows = p.rows.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const maxV = Math.max(...rows.map((r) => r.value), 1);

  // grid template tracks, built from the active column toggles
  const cols = [];
  if (p.showRank) cols.push('72px');
  cols.push('minmax(0, 1.6fr)');
  if (p.showBars) cols.push('1.35fr');
  if (p.showValueLabels) cols.push('168px');
  const gridTemplateColumns = cols.join(' ');

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "05 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* column head */}
          <div style={{
            display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 28,
            padding: '0 30px 16px', borderBottom: '1px solid var(--gxn-line)',
          }}>
            {p.showRank && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.1em' }}>{p.columns.rank}</span>}
            <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.1em' }}>{p.columns.name}</span>
            {p.showBars && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.1em' }}>占比</span>}
            {p.showValueLabels && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.1em', textAlign: 'right' }}>{p.columns.value}</span>}
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: 'grid', gridTemplateRows: `repeat(${count}, 1fr)`, gap: 10, marginTop: 12, minHeight: 0 }}>
            {rows.map((r, i) => {
              const isF = i === fIdx;
              const isDim = fIdx >= 0 && !isF;
              const top = i === 0;
              const valColor = isF ? 'var(--gxn-accent)' : top ? 'var(--gxn-accent)' : 'var(--gxn-text)';
              return (
                <div key={i}
                     className={cx(isF && 'gxn-panel is-focus')}
                     style={{
                       display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 28,
                       padding: '0 30px', borderRadius: isF ? 'var(--gxn-radius)' : 0,
                       borderBottom: isF ? 'none' : '1px solid var(--gxn-line)',
                       opacity: isDim ? 0.52 : 1, transition: 'opacity .3s ease',
                     }}>
                  {p.showRank && (
                    <span className="gxn-num" style={{
                      width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, fontWeight: 600,
                      color: top || isF ? '#07090b' : 'var(--gxn-dim)',
                      background: top || isF ? 'linear-gradient(150deg, var(--gxn-accent-2), var(--gxn-accent))' : 'rgba(255,255,255,0.05)',
                      boxShadow: top || isF ? '0 0 26px -6px rgba(var(--gxn-glow),0.7)' : 'none',
                    }}>{i + 1}</span>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <span style={{ fontSize: 34, fontWeight: 700, color: 'var(--gxn-text)', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                    {p.showTrack && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.02em' }}>{r.track}</span>}
                  </div>
                  {p.showBars && (
                    <div style={{ height: 14, borderRadius: 8, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${Math.max(6, (r.value / maxV) * 100)}%`, borderRadius: 8,
                        background: 'linear-gradient(90deg, var(--gxn-accent), var(--gxn-accent-2))',
                        boxShadow: isDim ? 'none' : '0 0 22px -4px rgba(var(--gxn-glow),0.8)',
                      }} />
                    </div>
                  )}
                  {p.showValueLabels && (
                    <span className="gxn-num" style={{ textAlign: 'right', fontSize: 44, fontWeight: 600, color: valColor, letterSpacing: '-0.01em', textShadow: isF || top ? '0 0 26px rgba(var(--gxn-glow),0.45)' : 'none' }}>
                      {r.value}{p.unit && <span style={{ fontSize: 24, marginLeft: 6, color: 'var(--gxn-dim)' }}>{p.unit}</span>}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {p.footnote && (
            <p className="gxn-mono gxn-rise-3" style={{ margin: '20px 0 0', fontSize: 24, color: 'var(--gxn-faint)' }}>{p.footnote}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideRanking;
