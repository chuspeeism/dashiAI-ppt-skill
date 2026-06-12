/**
 * CompliancePage — P74 隐私、版权与安全 (Regulation Risk · Table-led · Risk Card)
 *
 * Table-led risk slide: a structured risk table (risk dimension / intensity /
 * note) carries the information, anchored by a dominant figure, and finished
 * with a horizontal compliance-flow ribbon (intake → de-identify → review →
 * audit trail → safe delivery). The intensity column is toned warning→danger to
 * read as a risk meter rather than a positive share. Row count, the intensity
 * column, the focus row and the flow are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-cmpl`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Regulation Risk',
  marker: '监管合规',
  segment: '风险 · 监管合规',
  title: '隐私、版权与安全',
  titleTail: '风险 · 监管合规',
  lead: '隐私、版权、安全和行业监管会增加交付成本；监管会挤出缺乏治理能力的公司。',
  statLine: '合规团队增长 +42% · 采购审查周期 +36% · 版权风险事件 19 起',
  anchorValue: '58%',
  anchorLabel: '客户要求数据隔离占比',
  closing: '合规能力会成为企业采购门槛。',
  colHeads: { dim: '风险维度', level: '风险强度', note: '成本与影响' },
  // risk rows (order fixed; count is prop-driven; level drives the meter)
  rows: [
    { dim: '隐私合规', level: 88, note: 'GDPR / CCPA、数据最小化与脱敏要求' },
    { dim: '版权风险', level: 76, note: '训练语料与生成内容的版权追溯' },
    { dim: '数据安全', level: 70, note: '数据隔离、加密与访问权限控制' },
    { dim: '行业监管', level: 58, note: '金融、医疗等行业的准入与审计' },
    { dim: '内容安全', level: 44, note: '有害内容过滤与生成留痕' },
  ],
  flowTitle: '合规交付流程',
  // process flow nodes (count is prop-driven)
  flow: ['数据接入', '隐私脱敏', '合规审查', '审计留痕', '安全交付'],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  rowCount: 5,           // risk rows shown (3–5)
  showLevel: true,       // intensity column (meter + value)
  showFlow: true,        // bottom process-flow ribbon
  flowStepCount: 5,      // flow nodes (3–5)
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Regulation Risk' },
  { key: 'marker', label: 'marker', type: 'text', default: '监管合规' },
  { key: 'segment', label: 'segment', type: 'text', default: '风险 · 监管合规' },
  { key: 'title', label: '标题', type: 'text', default: '隐私、版权与安全' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '风险 · 监管合规' },
  { key: 'lead', label: '导言', type: 'text', default: '隐私、版权、安全和行业监管会增加交付成本；监管会挤出缺乏治理能力的公司。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '合规团队增长 +42% · 采购审查周期 +36% · 版权风险事件 19 起' },
  { key: 'anchorValue', label: 'anchorValue', type: 'text', default: '58%' },
  { key: 'anchorLabel', label: 'anchorLabel', type: 'text', default: '客户要求数据隔离占比' },
  { key: 'closing', label: '结语', type: 'text', default: '合规能力会成为企业采购门槛。' },
  { key: 'flowTitle', label: 'flowTitle', type: 'text', default: '合规交付流程' },
  { key: 'rowCount', label: '行数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '风险表格展示的行数量（3–5）。' },
  { key: 'showLevel', label: '强度列', type: 'toggle', default: true,
    description: '风险强度列（强度条 + 数值）的显隐。' },
  { key: 'showFlow', label: '流程图', type: 'toggle', default: true,
    description: '底部横向合规流程条的显隐。' },
  { key: 'flowStepCount', label: '流程数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '流程节点数量（3–5）。', showWhen: (p) => p.showFlow },
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
    description: '品牌强调色，作用于赛道标记、高亮行与流程节点。' },
];

const CSS = `
.aic-cmpl { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cmpl, .aic-cmpl * { box-sizing: border-box; }
.aic-cmpl .cpl-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-warn) 20%, transparent), transparent 70%); }

.aic-cmpl .cpl-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cmpl .cpl-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cmpl .cpl-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-cmpl .cpl-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · anchor figure (right) */
.aic-cmpl .cpl-meta { position: absolute; left: var(--pad); right: var(--pad); top: 288px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-cmpl .cpl-meta-l { max-width: 1180px; }
.aic-cmpl .cpl-marker { display: flex; align-items: baseline; gap: 18px; }
.aic-cmpl .cpl-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 56px; line-height: .8;
  color: var(--aic-warn); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; white-space: nowrap; }
.aic-cmpl .cpl-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-cmpl .cpl-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 12px; }
.aic-cmpl .cpl-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-cmpl .cpl-anchor { flex: none; text-align: right; }
.aic-cmpl .cpl-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 92px; line-height: .82;
  color: var(--aic-warn); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom; display: inline-block; }
.aic-cmpl .cpl-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 12px; }

/* table */
.aic-cmpl .cpl-table { position: absolute; left: var(--pad); right: var(--pad); top: 506px; bottom: 320px;
  display: flex; flex-direction: column; }
.aic-cmpl[data-flow="0"] .cpl-table { bottom: 150px; }
.aic-cmpl .cpl-thead { display: grid; align-items: center; gap: 0 36px; padding: 0 26px 14px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-cmpl .cpl-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-cmpl .cpl-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-cmpl .cpl-row { flex: 1; display: grid; align-items: center; gap: 0 36px; padding: 0 26px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-cmpl .cpl-row:last-child { border-bottom: none; }
.aic-cmpl .cpl-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-cmpl .cpl-dim { display: flex; align-items: center; gap: 16px; }
.aic-cmpl .cpl-dim .dot { width: 12px; height: 12px; border-radius: 3px; background: var(--aic-warn); flex: none; opacity: .55; }
.aic-cmpl .cpl-row[data-focus="1"] .cpl-dim .dot { background: var(--aic-accent); opacity: 1; }
.aic-cmpl .cpl-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink); white-space: nowrap; }
.aic-cmpl .cpl-level { display: flex; align-items: center; gap: 18px; }
.aic-cmpl .cpl-level-track { flex: 1; height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; min-width: 80px; }
.aic-cmpl .cpl-level-fill { height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--aic-warn) 70%, white), var(--aic-neg));
  transition: width .55s cubic-bezier(.3,.7,.4,1); }
.aic-cmpl .cpl-level-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 28px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; min-width: 96px; text-align: right; }
.aic-cmpl .cpl-level-v u { text-decoration: none; font-size: 17px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-cmpl .cpl-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 24px; color: var(--aic-ink-dim); }

/* compliance-flow ribbon */
.aic-cmpl .cpl-flow { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px; }
.aic-cmpl .cpl-flow-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 14px; }
.aic-cmpl .cpl-flow-row { display: flex; align-items: stretch; }
.aic-cmpl .cpl-node { flex: 1 1 0; display: flex; align-items: center; gap: 14px; }
.aic-cmpl .cpl-node-box { flex: 1; display: flex; align-items: center; gap: 14px; padding: 18px 22px;
  border-radius: 14px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-cmpl .cpl-node-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-accent-deep);
  width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; flex: none;
  background: color-mix(in srgb, var(--aic-accent) 18%, transparent); }
.aic-cmpl .cpl-node-x { font-family: var(--aic-font-text); font-weight: 700; font-size: 23px; color: var(--aic-ink); white-space: nowrap; }
.aic-cmpl .cpl-arrow { flex: none; width: 32px; display: grid; place-items: center; color: var(--aic-hair-strong); }
.aic-cmpl .cpl-arrow svg { width: 20px; height: 20px; }

.aic-cmpl .cpl-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-cmpl .cpl-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cmpl .cpl-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cmpl .cpl-deco { width: 300px; height: 30px; }
`;

const HEAT = ['neg','warn','neg','warn','accent','warn','pos','accent','warn','accent','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

export default function CompliancePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, marker: p.marker !== undefined ? p.marker : COPY.marker, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, anchorValue: p.anchorValue !== undefined ? p.anchorValue : COPY.anchorValue, anchorLabel: p.anchorLabel !== undefined ? p.anchorLabel : COPY.anchorLabel, closing: p.closing !== undefined ? p.closing : COPY.closing, flowTitle: p.flowTitle !== undefined ? p.flowTitle : COPY.flowTitle, rows: p.rows !== undefined ? p.rows : COPY.rows, flow: p.flow !== undefined ? p.flow : COPY.flow };
  ensureFonts();
  injectScopedStyle('aic-cmpl', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxLevel = Math.max(...rows.map((r) => r.level));

  const flowN = Math.max(3, Math.min(copy.flow.length, p.flowStepCount));
  const flow = copy.flow.slice(0, flowN);

  // column template adapts to whether the intensity column is shown
  const cols = ['minmax(260px, 1fr)'];
  if (p.showLevel) cols.push('minmax(320px, 1.2fr)');
  cols.push('1.6fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-cmpl" style={vars} data-flow={p.showFlow ? '1' : '0'}>
      {p.showDecorations && <div className="cpl-glow" />}

      <div className="cpl-head">
        <div>
          <p className="cpl-eyebrow">{copy.eyebrow}</p>
          <h2 className="cpl-title">{copy.title}</h2>
        </div>
        <div className="cpl-sub">{copy.titleTail}</div>
      </div>

      <div className="cpl-meta">
        <div className="cpl-meta-l">
          <div className="cpl-marker">
            <b>{copy.marker}</b>
            <span className="cpl-season">{copy.segment}</span>
          </div>
          <p className="cpl-lead">{copy.lead}</p>
          <div className="cpl-statline">{copy.statLine}</div>
        </div>
        <div className="cpl-anchor">
          <div className="cpl-anchor-v">{copy.anchorValue}</div>
          <div className="cpl-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="cpl-table">
        <div className="cpl-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="cpl-th">{copy.colHeads.dim}</div>
          {p.showLevel && <div className="cpl-th">{copy.colHeads.level}</div>}
          <div className="cpl-th">{copy.colHeads.note}</div>
        </div>
        <div className="cpl-tbody">
          {rows.map((r, i) => (
            <div className="cpl-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="cpl-dim"><span className="dot" /><b>{r.dim}</b></div>
              {p.showLevel && (
                <div className="cpl-level">
                  <div className="cpl-level-track">
                    <div className="cpl-level-fill" style={{ width: (r.level / maxLevel * 100) + '%' }} />
                  </div>
                  <div className="cpl-level-v">{r.level}<u>/100</u></div>
                </div>
              )}
              <div className="cpl-note">{r.note}</div>
            </div>
          ))}
        </div>
      </div>

      {p.showFlow && (
        <div className="cpl-flow">
          <p className="cpl-flow-t">{copy.flowTitle}</p>
          <div className="cpl-flow-row">
            {flow.map((x, i) => (
              <div className="cpl-node" key={x} style={{ flexGrow: i === flow.length - 1 ? 0 : 1 }}>
                <div className="cpl-node-box">
                  <span className="cpl-node-n">{i + 1}</span>
                  <span className="cpl-node-x">{x}</span>
                </div>
                {i < flow.length - 1 && (
                  <span className="cpl-arrow">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6"
                      fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cpl-foot">
        <div className="cpl-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cpl-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
