/**
 * SlideMatrixTable.jsx — 评级矩阵（表格页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 一张「行 × 维度」的评级矩阵：每个维度用点阵评分（●/○）表达强弱，
 * 末列给出综合判断标签。适合赛道 / 竞品 / 机会的多维横向对比。
 *
 * ── Props (see slideMatrixTableDefaults) ────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   dims         Array<{label}>      维度列表头 (text)
 *   rows         Array<{label,sub,scores:number[],verdict,tone}>  数据行
 *   rowCount     number   展示的行数
 *   scaleMax     number   点阵满分（3–5）
 *   focusEnabled boolean  高亮某一行
 *   focusIndex   number   0-based 被强调行
 *   showSub      boolean  行名下方显示英文/副标
 *   showVerdict  boolean  显示末列「综合判断」
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideMatrixTableDefaults = {
  kicker: 'MATRIX · 赛道评级',
  title: '五大赛道 ',
  titleEm: '热度·兑现·风险',
  dims: [{ label: '资本热度' }, { label: '商业兑现' }, { label: '风险水位' }],
  rows: [
    { label: '通用大模型', sub: 'Foundation Model', scores: [5, 2, 4], verdict: '叙事泡沫区 · 观察', tone: 'warn' },
    { label: '垂直应用', sub: 'Vertical AI', scores: [3, 4, 2], verdict: '隐形价值区 · 看好', tone: 'good' },
    { label: 'AI 基础设施', sub: 'Infrastructure', scores: [4, 5, 2], verdict: '明星兑现区 · 重点', tone: 'good' },
    { label: 'AI 芯片', sub: 'Hardware', scores: [3, 4, 3], verdict: '卖铲长线 · 中性', tone: 'mid' },
    { label: '其他工具链', sub: 'Tools / Safety', scores: [2, 2, 3], verdict: '等待验证区 · 谨慎', tone: 'warn' },
  ],
  rowCount: 5,
  scaleMax: 5,
  focusEnabled: true,
  focusIndex: 2,
  showSub: true,
  showVerdict: true,
};

export const slideMatrixTableControls = [
  { key: 'rowCount', type: 'number', label: '行数', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.rows ? p.rows.length : 5), describe: '展示的数据行数' },
  { key: 'scaleMax', type: 'number', label: '评分满分', default: 5, min: 3, max: 5, step: 1,
    describe: '点阵评分的满分点数' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一行' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 2, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.rowCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调行的序号' },
  { key: 'showSub', type: 'toggle', label: '副标题', default: true,
    describe: '行名下方英文/副标显隐' },
  { key: 'showVerdict', type: 'toggle', label: '综合判断列', default: true,
    describe: '末列综合判断标签显隐' },
];

const TONE = {
  good: { color: 'var(--gxn-accent)', bd: 'rgba(var(--gxn-glow),0.45)', bg: 'rgba(var(--gxn-glow),0.08)' },
  mid: { color: 'var(--gxn-text)', bd: 'var(--gxn-line)', bg: 'rgba(255,255,255,0.04)' },
  warn: { color: 'var(--gxn-dim)', bd: 'rgba(255,255,255,0.16)', bg: 'rgba(255,255,255,0.03)' },
};

function Dots({ score, max, accent, dim }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => {
        const on = i < score;
        return (
          <span key={i} style={{
            width: 18, height: 18, borderRadius: '50%', flex: '0 0 auto',
            background: on ? 'radial-gradient(circle at 35% 30%, var(--gxn-accent-2), var(--gxn-accent))' : 'transparent',
            border: on ? 'none' : '1.5px solid rgba(255,255,255,0.22)',
            boxShadow: on && !dim ? '0 0 14px -2px rgba(var(--gxn-glow),0.85)' : 'none',
            opacity: on ? 1 : 0.6,
          }} />
        );
      })}
    </div>
  );
}

export function SlideMatrixTable(props) {
  const p = { ...slideMatrixTableDefaults, ...props };
  const count = Math.max(1, Math.min(p.rows.length, p.rowCount));
  const rows = p.rows.slice(0, count);
  const max = Math.max(3, Math.min(5, p.scaleMax));
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const dims = p.dims;

  const cols = [`minmax(0, 1.4fr)`, ...dims.map(() => '1fr')];
  if (p.showVerdict) cols.push('1.5fr');
  const gridTemplateColumns = cols.join(' ');

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "10 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* head */}
          <div style={{ display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 36, padding: '0 28px 16px', borderBottom: '1px solid var(--gxn-line)' }}>
            <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.08em' }}>赛道 · TRACK</span>
            {dims.map((d, i) => (
              <span key={i} className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.06em' }}>{d.label}</span>
            ))}
            {p.showVerdict && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.06em' }}>综合判断</span>}
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: 'grid', gridTemplateRows: `repeat(${count}, 1fr)`, gap: 8, marginTop: 12, minHeight: 0 }}>
            {rows.map((r, i) => {
              const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
              const tone = TONE[r.tone] || TONE.mid;
              return (
                <div key={i} className={cx(isF && 'gxn-panel is-focus')}
                     style={{ display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 36, padding: '0 28px',
                              borderRadius: isF ? 'var(--gxn-radius)' : 0, borderBottom: isF ? 'none' : '1px solid var(--gxn-line)',
                              opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={{ fontSize: 31, fontWeight: 700, color: 'var(--gxn-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
                    {p.showSub && r.sub && <span className="gxn-mono" style={{ fontSize: 21, color: 'var(--gxn-faint)', letterSpacing: '.04em' }}>{r.sub}</span>}
                  </div>
                  {r.scores.slice(0, dims.length).map((s, k) => (
                    <Dots key={k} score={Math.min(s, max)} max={max} dim={isDim} />
                  ))}
                  {p.showVerdict && (
                    <span className="gxn-mono" style={{
                      justifySelf: 'start', fontSize: 23, padding: '8px 18px', borderRadius: 999, whiteSpace: 'nowrap',
                      color: tone.color, border: `1px solid ${tone.bd}`, background: tone.bg,
                    }}>{r.verdict}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideMatrixTable;
