/**
 * ChipPage — P38 训练与推理硬件 (AI Chips · Table-led · Segment Card)
 *
 * Table-led single-segment slide. A structured tier table (direction + tier
 * badge / amount / fund-split mini-bar / judgment) carries the breakdown, with
 * a chip-tier marker and a total anchor. Row count, the split column, the
 * judgment column and the focus row are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-chip`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'AI Chips',
  marker: '硬件',
  segment: 'AI 芯片赛道',
  title: '训练与推理硬件',
  titleTail: 'AI 芯片赛道',
  lead: 'AI 芯片融资集中在训练加速器、推理芯片和边缘 AI；芯片周期长，但一旦形成供应链优势，壁垒极高。',
  statLine: '主力三大方向合计 · 训练 46 · 推理 32 · 边缘 19（亿美元）',
  anchorValue: '97',
  anchorUnit: '亿美元',
  anchorLabel: '全年融资额 · 13 笔事件',
  closing: '硬件方向看长期确定性。',
  colHeads: { dim: '芯片方向', val: '融资额', share: '资金拆分', note: '判断' },
  // table rows (order fixed; count is prop-driven). value = 亿美元.
  rows: [
    { dim: '训练加速器', tier: '训练', val: '46', note: '大模型训练算力，供给紧俏' },
    { dim: '推理芯片',   tier: '推理', val: '32', note: '推理成本与能效优化' },
    { dim: '边缘 AI 芯片', tier: '边缘', val: '19', note: '端侧与设备端智能' },
    { dim: '互联与先进封装', tier: '孵化', val: '8', note: 'Chiplet 与高带宽互联' },
    { dim: '光子 / 前沿架构', tier: '孵化', val: '5', note: '存算一体与光计算探索' },
  ],
};

const TIER_TONE = {
  训练: 'var(--aic-accent)',
  推理: 'color-mix(in srgb, var(--aic-accent) 52%, white)',
  边缘: 'color-mix(in srgb, var(--aic-accent) 30%, white)',
  孵化: 'var(--aic-hair-strong)',
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  rowCount: 4,           // table rows shown (3–5)
  showShare: true,       // fund-split mini-bar column
  showJudgment: true,    // judgment column
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'rowCount', label: '行数量', type: 'slider', default: 4, min: 3, max: 5, step: 1,
    description: '表格展示的行数量（3–5）。' },
  { key: 'showShare', label: '占比列', type: 'toggle', default: true,
    description: '资金拆分列（迷你占比条）的显隐。' },
  { key: 'showJudgment', label: '判断列', type: 'toggle', default: true,
    description: '判断列的显隐；关闭后表格更紧凑。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一行作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 行' }, { value: 1, label: '第 2 行' },
      { value: 2, label: '第 3 行' }, { value: 3, label: '第 4 行' }, { value: 4, label: '第 5 行' }],
    description: '选择被高亮的行。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于层级标记、高亮行与总额数字。' },
];

const CSS = `
.aic-chip { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-chip, .aic-chip * { box-sizing: border-box; }
.aic-chip .cp-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-chip .cp-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-chip .cp-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-chip .cp-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-chip .cp-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · total anchor (right) */
.aic-chip .cp-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-chip .cp-meta-l { max-width: 1140px; }
.aic-chip .cp-marker { display: flex; align-items: center; gap: 18px; }
.aic-chip .cp-stack { display: flex; flex-direction: column; gap: 4px; }
.aic-chip .cp-stack i { display: block; height: 9px; border-radius: 2px; }
.aic-chip .cp-stack i:nth-child(1) { width: 56px; background: var(--aic-accent); }
.aic-chip .cp-stack i:nth-child(2) { width: 42px; background: color-mix(in srgb, var(--aic-accent) 52%, white); }
.aic-chip .cp-stack i:nth-child(3) { width: 30px; background: color-mix(in srgb, var(--aic-accent) 30%, white); }
.aic-chip .cp-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-chip .cp-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 26px 0 14px; text-wrap: pretty; }
.aic-chip .cp-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-chip .cp-anchor { flex: none; text-align: right; }
.aic-chip .cp-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 116px; line-height: .82;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom;
  display: inline-flex; align-items: baseline; }
.aic-chip .cp-anchor-v u { text-decoration: none; font-family: var(--aic-font-text); font-size: 30px; font-weight: 600;
  color: var(--aic-ink-dim); margin-left: 12px; transform: skewX(9deg); }
.aic-chip .cp-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 14px; }

/* table */
.aic-chip .cp-table { position: absolute; left: var(--pad); right: var(--pad); top: 524px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-chip .cp-thead { display: grid; align-items: center; gap: 0 32px; padding: 0 28px 16px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-chip .cp-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-chip .cp-th.r { text-align: right; }
.aic-chip .cp-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-chip .cp-row { flex: 1; display: grid; align-items: center; gap: 0 32px; padding: 0 28px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-chip .cp-row:last-child { border-bottom: none; }
.aic-chip .cp-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-chip .cp-dim { display: flex; align-items: center; gap: 16px; min-width: 0; }
.aic-chip .cp-tier { font-family: var(--aic-font-display); font-weight: 700; font-size: 15px; letter-spacing: .08em;
  color: var(--aic-ink); padding: 5px 12px; border-radius: 999px; flex: none; }
.aic-chip .cp-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink); white-space: nowrap; }
.aic-chip .cp-val { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 38px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-chip .cp-row[data-focus="1"] .cp-val { color: var(--aic-accent-deep); }
.aic-chip .cp-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-chip .cp-share { display: flex; align-items: center; }
.aic-chip .cp-share-track { flex: 1; height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-chip .cp-share-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.3,.7,.4,1); }
.aic-chip .cp-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; color: var(--aic-ink-dim); }

.aic-chip .cp-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-chip .cp-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-chip .cp-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-chip .cp-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function ChipPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-chip', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxV = Math.max(...rows.map((r) => Number(r.val)));

  // column template adapts to which optional columns are shown
  const cols = ['minmax(300px, 1.5fr)', '180px'];
  if (p.showShare) cols.push('220px');
  if (p.showJudgment) cols.push('1.3fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-chip" style={vars}>
      {p.showDecorations && <div className="cp-glow" />}

      <div className="cp-head">
        <div>
          <p className="cp-eyebrow">{copy.eyebrow}</p>
          <h2 className="cp-title">{copy.title}</h2>
        </div>
        <div className="cp-sub">{copy.titleTail}</div>
      </div>

      <div className="cp-meta">
        <div className="cp-meta-l">
          <div className="cp-marker">
            <span className="cp-stack"><i /><i /><i /></span>
            <span className="cp-season">{copy.segment}</span>
          </div>
          <p className="cp-lead">{copy.lead}</p>
          <div className="cp-statline">{copy.statLine}</div>
        </div>
        <div className="cp-anchor">
          <div className="cp-anchor-v">{copy.anchorValue}<u>{copy.anchorUnit}</u></div>
          <div className="cp-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="cp-table">
        <div className="cp-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="cp-th">{copy.colHeads.dim}</div>
          <div className="cp-th r">{copy.colHeads.val}</div>
          {p.showShare && <div className="cp-th">{copy.colHeads.share}</div>}
          {p.showJudgment && <div className="cp-th">{copy.colHeads.note}</div>}
        </div>
        <div className="cp-tbody">
          {rows.map((r, i) => (
            <div className="cp-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="cp-dim">
                <span className="cp-tier" style={{ background: TIER_TONE[r.tier] || 'var(--aic-hair-strong)' }}>{r.tier}</span>
                <b>{r.dim}</b>
              </div>
              <div className="cp-val">{r.val}<u>亿</u></div>
              {p.showShare && (
                <div className="cp-share">
                  <div className="cp-share-track">
                    <div className="cp-share-fill" style={{ width: (Number(r.val) / maxV * 100) + '%',
                      background: p.focusEnabled && i === focus ? 'var(--aic-accent)'
                        : (TIER_TONE[r.tier] || 'var(--aic-hair-strong)') }} />
                  </div>
                </div>
              )}
              {p.showJudgment && <div className="cp-note">{r.note}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="cp-foot">
        <div className="cp-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cp-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
