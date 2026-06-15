/**
 * AcceleratePage — P18 加速季度 (Quarter Breakdown · Q2 · Table-led)
 *
 * A table-led single-quarter slide: a structured segment table carries the
 * information (track / quarter amount / QoQ change / signal note), with a
 * large season marker and an anchor QoQ-growth highlight signalling the
 * acceleration. Row count, the QoQ-change column, the judgment column and the
 * focus row are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-acc`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (ChangeBadge, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { ChangeBadge, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Quarter Breakdown',
  marker: 'Q2',
  season: '2024 第二季度 · 加速',
  title: '加速季度',
  titleTail: 'Q2 融资拆解',
  lead: 'Q2 进入明显加速期，模型、应用和基础设施同步升温，资本从模型叙事扩散到应用和基础设施。',
  statLine: 'Q2 融资额 284 亿美元 · 26 笔事件 · 平均单笔 10.9 亿美元',
  anchorValue: '+75.3%',
  anchorLabel: '季度融资额环比增长',
  closing: 'Q2 是融资窗口打开的关键节点。',
  colHeads: { dim: '赛道方向', val: 'Q2 融资额', chg: '环比', note: '加速信号' },
  // table rows (order fixed; count is prop-driven)
  rows: [
    { dim: '通用大模型', val: '120', unit: '亿美元', chg: '+66.0%', note: '头部融资集中释放' },
    { dim: '垂直应用', val: '74', unit: '亿美元', chg: '+88.0%', note: '应用侧需求加速' },
    { dim: '基础设施', val: '54', unit: '亿美元', chg: '+69.0%', note: '算力需求拉动' },
    { dim: 'AI 芯片', val: '22', unit: '亿美元', chg: '+41.0%', note: '硬件稳步跟进' },
    { dim: '安全与数据', val: '14', unit: '亿美元', chg: '+33.0%', note: '配套设施补位' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  rowCount: 4,           // table rows shown (3–5)
  showChange: true,      // QoQ-change column
  showJudgment: true,    // signal/judgment column
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Quarter Breakdown' },
  { key: 'marker', label: 'marker', type: 'text', default: 'Q2' },
  { key: 'season', label: 'season', type: 'text', default: '2024 第二季度 · 加速' },
  { key: 'title', label: '标题', type: 'text', default: '加速季度' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'Q2 融资拆解' },
  { key: 'lead', label: '导言', type: 'text', default: 'Q2 进入明显加速期，模型、应用和基础设施同步升温，资本从模型叙事扩散到应用和基础设施。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: 'Q2 融资额 284 亿美元 · 26 笔事件 · 平均单笔 10.9 亿美元' },
  { key: 'anchorValue', label: 'anchorValue', type: 'text', default: '+75.3%' },
  { key: 'anchorLabel', label: 'anchorLabel', type: 'text', default: '季度融资额环比增长' },
  { key: 'closing', label: '结语', type: 'text', default: 'Q2 是融资窗口打开的关键节点。' },
  { key: 'rowCount', label: '行数量', type: 'slider', default: 4, min: 3, max: 5, step: 1,
    description: '表格展示的行数量（3–5）。' },
  { key: 'showChange', label: '环比列', type: 'toggle', default: true,
    description: '环比变化列（涨跌徽标）的显隐。' },
  { key: 'showJudgment', label: '判断列', type: 'toggle', default: true,
    description: '信号判断列的显隐；关闭后表格更紧凑。' },
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
    description: '品牌强调色，作用于季度标记、高亮行与锚点数字。' },
];

const CSS = `
.aic-acc { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-acc, .aic-acc * { box-sizing: border-box; }
.aic-acc .ac-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-acc .ac-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-acc .ac-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-acc .ac-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-acc .ac-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-acc .ac-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · anchor QoQ (right) */
.aic-acc .ac-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-acc .ac-meta-l { max-width: 1180px; }
.aic-acc .ac-marker { display: flex; align-items: baseline; gap: 18px; }
.aic-acc .ac-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 82px; line-height: .8;
  color: var(--aic-accent); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-acc .ac-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-acc .ac-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 28px 0 14px; }
.aic-acc .ac-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-acc .ac-anchor { flex: none; text-align: right; }
.aic-acc .ac-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 96px; line-height: .82;
  color: var(--aic-accent); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom; display: inline-block; }
.aic-acc .ac-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 12px; }

/* table */
.aic-acc .ac-table { position: absolute; left: var(--pad); right: var(--pad); top: 520px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-acc .ac-thead { display: grid; align-items: center; gap: 0 32px; padding: 0 28px 16px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-acc .ac-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-acc .ac-th.r { text-align: right; }
.aic-acc .ac-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-acc .ac-row { flex: 1; display: grid; align-items: center; gap: 0 32px; padding: 0 28px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-acc .ac-row:last-child { border-bottom: none; }
.aic-acc .ac-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-acc .ac-dim { display: flex; align-items: center; gap: 16px; }
.aic-acc .ac-dim .dot { width: 12px; height: 12px; border-radius: 3px; background: var(--aic-hair-strong); flex: none; }
.aic-acc .ac-row[data-focus="1"] .ac-dim .dot { background: var(--aic-accent); }
.aic-acc .ac-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 33px; color: var(--aic-ink); white-space: nowrap; }
.aic-acc .ac-val { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 38px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-acc .ac-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-acc .ac-chg { display: flex; justify-content: flex-start; }
.aic-acc .ac-chg .aic-viz-badge { font-size: 26px; padding: 7px 15px; }
.aic-acc .ac-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 24px; color: var(--aic-ink-dim); }

.aic-acc .ac-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-acc .ac-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-acc .ac-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-acc .ac-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','neg','accent','pos','warn','pos',
  'accent','pos','pos','warn','accent','pos','neg','pos','accent','warn','pos','accent','pos','pos',
  'warn','accent','pos','pos','neg','accent','pos','warn','pos','accent'].map((tone) => ({ tone }));

export default function AcceleratePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-acc', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  // column template adapts to which optional columns are shown
  const cols = ['minmax(280px, 1.4fr)', '200px'];
  if (p.showChange) cols.push('150px');
  if (p.showJudgment) cols.push('1.2fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-acc" style={vars}>
      {p.showDecorations && <div className="ac-glow" />}

      <div className="ac-head">
        <div>
          <p className="ac-eyebrow">{copy.eyebrow}</p>
          <h2 className="ac-title">{copy.title}</h2>
        </div>
        <div className="ac-sub">{copy.titleTail}</div>
      </div>

      <div className="ac-meta">
        <div className="ac-meta-l">
          <div className="ac-marker">
            <b>{copy.marker}</b>
            <span className="ac-season">{copy.season}</span>
          </div>
          <p className="ac-lead">{copy.lead}</p>
          <div className="ac-statline">{copy.statLine}</div>
        </div>
        <div className="ac-anchor">
          <div className="ac-anchor-v">{copy.anchorValue}</div>
          <div className="ac-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="ac-table">
        <div className="ac-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="ac-th">{copy.colHeads.dim}</div>
          <div className="ac-th r">{copy.colHeads.val}</div>
          {p.showChange && <div className="ac-th">{copy.colHeads.chg}</div>}
          {p.showJudgment && <div className="ac-th">{copy.colHeads.note}</div>}
        </div>
        <div className="ac-tbody">
          {rows.map((r, i) => (
            <div className="ac-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="ac-dim"><span className="dot" /><b>{r.dim}</b></div>
              <div className="ac-val">{r.val}<u>{r.unit}</u></div>
              {p.showChange && <div className="ac-chg"><ChangeBadge value={r.chg} /></div>}
              {p.showJudgment && <div className="ac-note">{r.note}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="ac-foot">
        <div className="ac-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ac-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
