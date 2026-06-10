/**
 * SupportPage — P44 可量化降本场景 (Customer Support AI · Table-led · Segment Card)
 *
 * Table-led single-segment slide. A structured scenario table (scenario + role
 * badge / automation rate / cost-saving mini-bar / judgment) carries the ROI
 * breakdown, with a role marker and a total anchor. Row count, the share
 * column, the judgment column and the focus row are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-sup`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Customer Support AI',
  segment: '客服 AI 赛道',
  title: '可量化降本场景',
  titleTail: '客服 AI 赛道',
  lead: '客服 AI 是最容易量化 ROI 的垂直应用之一；商业化看降本效果、接入成本和复杂问题升级率。',
  statLine: '平均替代率 32% · 工单时长下降 41% · 9 笔事件',
  anchorValue: '27',
  anchorUnit: '亿美元',
  anchorLabel: '全年融资额 · 9 笔事件',
  closing: '能量化 ROI 的场景更容易获得预算。',
  colHeads: { dim: '降本场景', val: '自动化率', share: '降本贡献', note: '判断' },
  // table rows (order fixed; count is prop-driven). val = 自动化率 %
  rows: [
    { dim: '工单自动应答', tier: '替代', val: '48', note: '高频简单问题直接闭环' },
    { dim: '知识库检索',   tier: '辅助', val: '31', note: '坐席实时调取标准答案' },
    { dim: '情绪与升级',   tier: '辅助', val: '22', note: '识别复杂问题转人工' },
    { dim: '多语言支持',   tier: '扩展', val: '18', note: '跨区域统一服务覆盖' },
    { dim: '质检与培训',   tier: '扩展', val: '15', note: '全量对话质检与复盘' },
  ],
};

const TIER_TONE = {
  替代: 'var(--aic-accent)',
  辅助: 'color-mix(in srgb, var(--aic-accent) 50%, white)',
  扩展: 'color-mix(in srgb, var(--aic-accent) 30%, white)',
  孵化: 'var(--aic-hair-strong)',
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  rowCount: 4,           // table rows shown (3–5)
  showShare: true,       // cost-saving mini-bar column
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
    description: '降本贡献列（迷你占比条）的显隐。' },
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
    description: '品牌强调色，作用于角色标记、高亮行与总额数字。' },
];

const CSS = `
.aic-sup { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-sup, .aic-sup * { box-sizing: border-box; }
.aic-sup .sp-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-sup .sp-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-sup .sp-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-sup .sp-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-sup .sp-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · total anchor (right) */
.aic-sup .sp-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-sup .sp-meta-l { max-width: 1140px; }
.aic-sup .sp-marker { display: flex; align-items: center; gap: 18px; }
.aic-sup .sp-stack { display: flex; flex-direction: column; gap: 4px; }
.aic-sup .sp-stack i { display: block; height: 9px; border-radius: 2px; }
.aic-sup .sp-stack i:nth-child(1) { width: 56px; background: var(--aic-accent); }
.aic-sup .sp-stack i:nth-child(2) { width: 42px; background: color-mix(in srgb, var(--aic-accent) 50%, white); }
.aic-sup .sp-stack i:nth-child(3) { width: 30px; background: color-mix(in srgb, var(--aic-accent) 30%, white); }
.aic-sup .sp-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-sup .sp-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 26px 0 14px; text-wrap: pretty; }
.aic-sup .sp-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-sup .sp-anchor { flex: none; text-align: right; }
.aic-sup .sp-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 116px; line-height: .82;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom;
  display: inline-flex; align-items: baseline; }
.aic-sup .sp-anchor-v u { text-decoration: none; font-family: var(--aic-font-text); font-size: 30px; font-weight: 600;
  color: var(--aic-ink-dim); margin-left: 12px; transform: skewX(9deg); }
.aic-sup .sp-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 14px; }

/* table */
.aic-sup .sp-table { position: absolute; left: var(--pad); right: var(--pad); top: 524px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-sup .sp-thead { display: grid; align-items: center; gap: 0 32px; padding: 0 28px 16px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-sup .sp-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-sup .sp-th.r { text-align: right; }
.aic-sup .sp-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-sup .sp-row { flex: 1; display: grid; align-items: center; gap: 0 32px; padding: 0 28px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-sup .sp-row:last-child { border-bottom: none; }
.aic-sup .sp-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-sup .sp-dim { display: flex; align-items: center; gap: 16px; min-width: 0; }
.aic-sup .sp-tier { font-family: var(--aic-font-display); font-weight: 700; font-size: 15px; letter-spacing: .08em;
  color: var(--aic-ink); padding: 5px 12px; border-radius: 999px; flex: none; }
.aic-sup .sp-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink); white-space: nowrap; }
.aic-sup .sp-val { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 38px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-sup .sp-row[data-focus="1"] .sp-val { color: var(--aic-accent-deep); }
.aic-sup .sp-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-sup .sp-share { display: flex; align-items: center; }
.aic-sup .sp-share-track { flex: 1; height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-sup .sp-share-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.3,.7,.4,1); }
.aic-sup .sp-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; color: var(--aic-ink-dim); }

.aic-sup .sp-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-sup .sp-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-sup .sp-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-sup .sp-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function SupportPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-sup', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxV = Math.max(...rows.map((r) => Number(r.val)));

  // column template adapts to which optional columns are shown
  const cols = ['minmax(300px, 1.5fr)', '200px'];
  if (p.showShare) cols.push('220px');
  if (p.showJudgment) cols.push('1.3fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-sup" style={vars}>
      {p.showDecorations && <div className="sp-glow" />}

      <div className="sp-head">
        <div>
          <p className="sp-eyebrow">{copy.eyebrow}</p>
          <h2 className="sp-title">{copy.title}</h2>
        </div>
        <div className="sp-sub">{copy.titleTail}</div>
      </div>

      <div className="sp-meta">
        <div className="sp-meta-l">
          <div className="sp-marker">
            <span className="sp-stack"><i /><i /><i /></span>
            <span className="sp-season">{copy.segment}</span>
          </div>
          <p className="sp-lead">{copy.lead}</p>
          <div className="sp-statline">{copy.statLine}</div>
        </div>
        <div className="sp-anchor">
          <div className="sp-anchor-v">{copy.anchorValue}<u>{copy.anchorUnit}</u></div>
          <div className="sp-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="sp-table">
        <div className="sp-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="sp-th">{copy.colHeads.dim}</div>
          <div className="sp-th r">{copy.colHeads.val}</div>
          {p.showShare && <div className="sp-th">{copy.colHeads.share}</div>}
          {p.showJudgment && <div className="sp-th">{copy.colHeads.note}</div>}
        </div>
        <div className="sp-tbody">
          {rows.map((r, i) => (
            <div className="sp-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="sp-dim">
                <span className="sp-tier" style={{ background: TIER_TONE[r.tier] || 'var(--aic-hair-strong)' }}>{r.tier}</span>
                <b>{r.dim}</b>
              </div>
              <div className="sp-val">{r.val}<u>%</u></div>
              {p.showShare && (
                <div className="sp-share">
                  <div className="sp-share-track">
                    <div className="sp-share-fill" style={{ width: (Number(r.val) / maxV * 100) + '%',
                      background: p.focusEnabled && i === focus ? 'var(--aic-accent)'
                        : (TIER_TONE[r.tier] || 'var(--aic-hair-strong)') }} />
                  </div>
                </div>
              )}
              {p.showJudgment && <div className="sp-note">{r.note}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="sp-foot">
        <div className="sp-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="sp-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
