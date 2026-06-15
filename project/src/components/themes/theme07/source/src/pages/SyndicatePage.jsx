/**
 * SyndicatePage — P27 代表性交易与领投阵容 (Notable Deals · Syndicate · Table-led)
 *
 * A table-led slide: the year's landmark rounds laid out as a structured
 * table — company / track / amount / round — with an investor-syndicate column
 * rendered as stacked initials chips. Row count, the round column, the
 * syndicate column and the focus row are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-syn`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Notable Deals',
  title: '代表性交易',
  titleTail: '领投阵容',
  lead: '少数几笔超大额轮次几乎定义了全年节奏，背后是稳定复现的领投与跟投组合。',
  statLine: 'Top 6 交易合计 412 亿美元 · 占全年大额融资的 42%',
  colHeads: { co: '公司', dim: '赛道', val: '融资额', round: '轮次', syn: '领投 / 跟投阵容' },
  // landmark rounds (order fixed; count is prop-driven). syn = investor initials
  rows: [
    { co: 'Helix AI', dim: '通用大模型', val: '64', unit: '亿美元', round: 'F 轮', syn: ['NG', 'AP', 'VG'] },
    { co: 'Cortex Labs', dim: '基础设施', val: '58', unit: '亿美元', round: 'E 轮', syn: ['VG', 'NG', 'CO'] },
    { co: 'Lumina', dim: '垂直应用', val: '47', unit: '亿美元', round: 'D 轮', syn: ['LP', 'NG', 'ME'] },
    { co: 'Synapse', dim: 'AI 芯片', val: '36', unit: '亿美元', round: 'D 轮', syn: ['CO', 'VG', 'AP'] },
    { co: 'Verda', dim: '安全与数据', val: '24', unit: '亿美元', round: 'C 轮', syn: ['ME', 'LP', 'HL'] },
    { co: 'Atlas Mind', dim: '通用大模型', val: '18', unit: '亿美元', round: 'C 轮', syn: ['AP', 'NG', 'HL'] },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  rowCount: 5,           // table rows shown (3–6)
  showRound: true,       // round column
  showSyndicate: true,   // investor-syndicate column
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showStatLine: true,    // summary stat line under the lead
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Notable Deals' },
  { key: 'title', label: '标题', type: 'text', default: '代表性交易' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '领投阵容' },
  { key: 'lead', label: '导言', type: 'text', default: '少数几笔超大额轮次几乎定义了全年节奏，背后是稳定复现的领投与跟投组合。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: 'Top 6 交易合计 412 亿美元 · 占全年大额融资的 42%' },
  { key: 'rowCount', label: '行数量', type: 'slider', default: 5, min: 3, max: 6, step: 1,
    description: '表格展示的行数量（3–6）。' },
  { key: 'showRound', label: '轮次列', type: 'toggle', default: true,
    description: '融资轮次列的显隐。' },
  { key: 'showSyndicate', label: '阵容列', type: 'toggle', default: true,
    description: '领投 / 跟投阵容列（机构缩写徽标）的显隐；关闭后表格更紧凑。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一行作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 行' }, { value: 1, label: '第 2 行' },
      { value: 2, label: '第 3 行' }, { value: 3, label: '第 4 行' },
      { value: 4, label: '第 5 行' }, { value: 5, label: '第 6 行' }],
    description: '选择被高亮的行。', showWhen: (p) => p.focusEnabled },
  { key: 'showStatLine', label: '说明文案', type: 'toggle', default: true,
    description: '标题下方汇总统计行的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于高亮行、阵容徽标与点缀。' },
];

const CSS = `
.aic-syn { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-syn, .aic-syn * { box-sizing: border-box; }
.aic-syn .sy-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-syn .sy-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-syn .sy-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-syn .sy-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-syn .sy-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-syn .sy-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px; }
.aic-syn .sy-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 31px; line-height: 1.5;
  color: var(--aic-ink); margin: 0; max-width: 1320px; }
.aic-syn .sy-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); margin-top: 16px; display: flex; align-items: center; gap: 14px; }
.aic-syn .sy-statline::before { content: ''; width: 26px; height: 2px; background: var(--aic-accent); flex: none; }

/* table */
.aic-syn .sy-table { position: absolute; left: var(--pad); right: var(--pad); top: 470px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-syn .sy-thead { display: grid; align-items: center; gap: 0 30px; padding: 0 26px 16px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-syn .sy-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-syn .sy-th.r { text-align: right; }
.aic-syn .sy-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-syn .sy-row { flex: 1; display: grid; align-items: center; gap: 0 30px; padding: 0 26px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-syn .sy-row:last-child { border-bottom: none; }
.aic-syn .sy-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-syn .sy-co { display: flex; align-items: center; gap: 16px; }
.aic-syn .sy-co .dot { width: 12px; height: 12px; border-radius: 3px; background: var(--aic-hair-strong); flex: none; }
.aic-syn .sy-row[data-focus="1"] .sy-co .dot { background: var(--aic-accent); }
.aic-syn .sy-co b { font-family: var(--aic-font-display); font-weight: 700; font-size: 34px; color: var(--aic-ink); white-space: nowrap; }
.aic-syn .sy-dim { font-family: var(--aic-font-text); font-weight: 500; font-size: 24px; color: var(--aic-ink-dim); }
.aic-syn .sy-val { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 38px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-syn .sy-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-syn .sy-round { display: flex; }
.aic-syn .sy-round span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; color: var(--aic-ink-dim);
  border: 1.5px solid var(--aic-hair-strong); border-radius: 999px; padding: 5px 16px; white-space: nowrap; }
.aic-syn .sy-row[data-focus="1"] .sy-round span { border-color: var(--aic-accent); color: var(--aic-ink); }
.aic-syn .sy-syn { display: flex; align-items: center; }
.aic-syn .sy-chips { display: flex; }
.aic-syn .sy-chips i { width: 48px; height: 48px; border-radius: 50%; margin-left: -12px;
  display: grid; place-items: center; font-family: var(--aic-font-display); font-weight: 700; font-size: 17px;
  font-style: normal; color: var(--aic-ink); background: var(--aic-accent-soft);
  border: 2.5px solid var(--aic-paper); box-shadow: 0 0 0 1px var(--aic-hair-strong); }
.aic-syn .sy-chips i:first-child { margin-left: 0; }
.aic-syn .sy-chips i:nth-child(1) { background: var(--aic-accent); }
.aic-syn .sy-row[data-focus="1"] .sy-chips i:first-child { box-shadow: 0 0 0 1px var(--aic-accent); }

.aic-syn .sy-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: flex-end; }
.aic-syn .sy-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','neg','accent','pos','warn','pos',
  'accent','pos','pos','warn','accent','pos','neg','pos','accent','warn','pos','accent','pos','pos',
  'warn','accent','pos','pos','neg','accent','pos','warn','pos','accent'].map((tone) => ({ tone }));

export default function SyndicatePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-syn', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  // column template adapts to which optional columns are shown
  const cols = ['minmax(260px, 1.2fr)', 'minmax(160px, 1fr)', '210px'];
  if (p.showRound) cols.push('140px');
  if (p.showSyndicate) cols.push('minmax(200px, 1fr)');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-syn" style={vars}>
      {p.showDecorations && <div className="sy-glow" />}

      <div className="sy-head">
        <div>
          <p className="sy-eyebrow">{copy.eyebrow}</p>
          <h2 className="sy-title">{copy.title}</h2>
        </div>
        <div className="sy-sub">{copy.titleTail}</div>
      </div>

      <div className="sy-meta">
        <p className="sy-lead">{copy.lead}</p>
        {p.showStatLine && <div className="sy-statline">{copy.statLine}</div>}
      </div>

      <div className="sy-table">
        <div className="sy-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="sy-th">{copy.colHeads.co}</div>
          <div className="sy-th">{copy.colHeads.dim}</div>
          <div className="sy-th r">{copy.colHeads.val}</div>
          {p.showRound && <div className="sy-th">{copy.colHeads.round}</div>}
          {p.showSyndicate && <div className="sy-th">{copy.colHeads.syn}</div>}
        </div>
        <div className="sy-tbody">
          {rows.map((r, i) => (
            <div className="sy-row" key={r.co} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="sy-co"><span className="dot" /><b>{r.co}</b></div>
              <div className="sy-dim">{r.dim}</div>
              <div className="sy-val">{r.val}<u>{r.unit}</u></div>
              {p.showRound && <div className="sy-round"><span>{r.round}</span></div>}
              {p.showSyndicate && (
                <div className="sy-syn">
                  <div className="sy-chips">
                    {r.syn.map((s, k) => <i key={k}>{s}</i>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {p.showDecorations && (
        <div className="sy-foot"><div className="sy-deco"><HeatStrip data={HEAT} gap={4} /></div></div>
      )}
    </div>
  );
}
