/**
 * ScaleCasePage — P66 数据基础设施 (Scale AI Case · Table-led · Case Card)
 *
 * Table-led case card. A structured matrix (维度 / 模拟数据 / 代表对象 / 判断)
 * carries the data-infrastructure breakdown, anchored by a company marker and a
 * total stat, with a horizontal data-pipeline flow strip (采集→标注→反馈→评测→交付)
 * along the bottom. Row count, the optional columns, the flow strip and the
 * focus row are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-scl`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 * No image slot — the table + flow strip are the visual. No Tweaks dependency.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Scale AI Case',
  title: '数据基础设施',
  titleTail: 'Scale AI 案例页',
  marker: '数据',
  company: 'Scale AI',
  lead: 'Scale AI 代表数据标注、RLHF 和评测数据需求；模型越依赖高质量数据，数据基础设施越有价值。',
  statLine: '主营 标注 / 反馈 / 评测 · 政府客户占比 18%',
  anchorValue: '10',
  anchorUnit: '亿美元',
  anchorLabel: '最大单笔融资 · 企业客户 1200 家',
  closing: '数据质量是模型竞争的底层变量。',
  colHeads: { dim: '维度', data: '模拟数据', rep: '代表对象', note: '判断' },
  // table rows (order fixed; count is prop-driven)
  rows: [
    { dim: '数据标注', tier: '核心', data: '标注量级行业领先', rep: '自动驾驶 · 机器人', note: '高质量标注是刚需' },
    { dim: 'RLHF 反馈', tier: '核心', data: '人类反馈管线成熟', rep: '通用大模型实验室', note: '对齐训练的关键供给' },
    { dim: '模型评测', tier: '增长', data: '评测基准与红队', rep: '安全与合规团队', note: '能力验证的第三方标尺' },
    { dim: '政府与国防', tier: '壁垒', data: '政府客户占比 18%', rep: '公共部门', note: '高壁垒、强确定性' },
    { dim: '合成数据', tier: '孵化', data: '合成数据探索', rep: '数据稀缺场景', note: '补足长尾数据缺口' },
  ],
  // pipeline flow steps (order fixed; count is prop-driven)
  flow: [
    { k: '采集', en: 'Collect' },
    { k: '标注', en: 'Label' },
    { k: '反馈', en: 'RLHF' },
    { k: '评测', en: 'Evaluate' },
    { k: '交付', en: 'Deliver' },
  ],
};

const TIER_TONE = {
  核心: 'var(--aic-accent)',
  增长: 'color-mix(in srgb, var(--aic-accent) 52%, white)',
  壁垒: 'color-mix(in srgb, var(--aic-accent) 32%, white)',
  孵化: 'var(--aic-hair-strong)',
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  rowCount: 5,           // table rows shown (3–5)
  showRepresentative: true, // 代表对象 column
  showJudgment: true,    // 判断 column
  showFlow: true,        // bottom data-pipeline flow strip
  flowStepCount: 5,      // flow nodes (3–5)
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Scale AI Case' },
  { key: 'title', label: '标题', type: 'text', default: '数据基础设施' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'Scale AI 案例页' },
  { key: 'marker', label: 'marker', type: 'text', default: '数据' },
  { key: 'company', label: 'company', type: 'text', default: 'Scale AI' },
  { key: 'lead', label: '导言', type: 'text', default: 'Scale AI 代表数据标注、RLHF 和评测数据需求；模型越依赖高质量数据，数据基础设施越有价值。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '主营 标注 / 反馈 / 评测 · 政府客户占比 18%' },
  { key: 'anchorValue', label: 'anchorValue', type: 'text', default: '10' },
  { key: 'anchorUnit', label: '锚点单位', type: 'text', default: '亿美元' },
  { key: 'anchorLabel', label: 'anchorLabel', type: 'text', default: '最大单笔融资 · 企业客户 1200 家' },
  { key: 'closing', label: '结语', type: 'text', default: '数据质量是模型竞争的底层变量。' },
  { key: 'rowCount', label: '行数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '表格展示的行数量（3–5）。' },
  { key: 'showRepresentative', label: '代表对象列', type: 'toggle', default: true,
    description: '代表对象列的显隐。' },
  { key: 'showJudgment', label: '判断列', type: 'toggle', default: true,
    description: '判断列的显隐；关闭后表格更紧凑。' },
  { key: 'showFlow', label: '流程条', type: 'toggle', default: true,
    description: '底部数据处理流程条（采集→交付）的显隐。' },
  { key: 'flowStepCount', label: '流程节点', type: 'slider', default: 5, min: 3, max: 5, step: 1,
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
    description: '品牌强调色，作用于层级标记、高亮行与流程条。' },
];

const CSS = `
.aic-scl { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-scl, .aic-scl * { box-sizing: border-box; }
.aic-scl .sc-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-scl .sc-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-scl .sc-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-scl .sc-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-scl .sc-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + company + lead (left) · total anchor (right) */
.aic-scl .sc-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-scl .sc-meta-l { max-width: 1180px; }
.aic-scl .sc-marker { display: flex; align-items: center; gap: 18px; }
.aic-scl .sc-stack { display: flex; flex-direction: column; gap: 4px; }
.aic-scl .sc-stack i { display: block; height: 9px; border-radius: 2px; }
.aic-scl .sc-stack i:nth-child(1) { width: 56px; background: var(--aic-accent); }
.aic-scl .sc-stack i:nth-child(2) { width: 42px; background: color-mix(in srgb, var(--aic-accent) 52%, white); }
.aic-scl .sc-stack i:nth-child(3) { width: 30px; background: color-mix(in srgb, var(--aic-accent) 30%, white); }
.aic-scl .sc-company { font-family: var(--aic-font-display); font-weight: 700; font-size: 24px; letter-spacing: .04em;
  color: var(--aic-ink); white-space: nowrap; }
.aic-scl .sc-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 24px 0 12px; text-wrap: pretty; }
.aic-scl .sc-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-scl .sc-anchor { flex: none; text-align: right; }
.aic-scl .sc-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 116px; line-height: .82;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom;
  display: inline-flex; align-items: baseline; }
.aic-scl .sc-anchor-v u { text-decoration: none; font-family: var(--aic-font-text); font-size: 30px; font-weight: 600;
  color: var(--aic-ink-dim); margin-left: 12px; transform: skewX(9deg); }
.aic-scl .sc-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 14px; max-width: 360px; margin-left: auto; text-wrap: pretty; }

/* table */
.aic-scl .sc-table { position: absolute; left: var(--pad); right: var(--pad); top: 520px;
  bottom: var(--table-bottom, 270px); display: flex; flex-direction: column; }
.aic-scl .sc-thead { display: grid; align-items: center; gap: 0 32px; padding: 0 28px 16px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-scl .sc-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-scl .sc-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-scl .sc-row { flex: 1; display: grid; align-items: center; gap: 0 32px; padding: 0 28px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-scl .sc-row:last-child { border-bottom: none; }
.aic-scl .sc-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-scl .sc-dim { display: flex; align-items: center; gap: 16px; min-width: 0; }
.aic-scl .sc-tier { font-family: var(--aic-font-display); font-weight: 700; font-size: 15px; letter-spacing: .08em;
  color: var(--aic-ink); padding: 5px 12px; border-radius: 999px; flex: none; }
.aic-scl .sc-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink); white-space: nowrap; }
.aic-scl .sc-data { font-family: var(--aic-font-text); font-weight: 600; font-size: 25px; color: var(--aic-ink); }
.aic-scl .sc-row[data-focus="1"] .sc-data { color: var(--aic-accent-deep); }
.aic-scl .sc-rep { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; color: var(--aic-ink-dim); }
.aic-scl .sc-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; color: var(--aic-ink-dim); }

/* data-pipeline flow strip */
.aic-scl .sc-flow { position: absolute; left: var(--pad); right: var(--pad); bottom: 140px;
  display: flex; align-items: stretch; gap: 0; }
.aic-scl .sc-fnode { flex: 1 1 0; position: relative; display: flex; flex-direction: column; justify-content: center;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair-strong); border-radius: 16px; padding: 16px 22px; }
.aic-scl .sc-fnode + .sc-fnode { margin-left: 38px; }
.aic-scl .sc-fnode::after { content: ''; position: absolute; right: -30px; top: 50%; width: 22px; height: 2px;
  background: var(--aic-hair-strong); transform: translateY(-50%); }
.aic-scl .sc-fnode:last-child::after { display: none; }
.aic-scl .sc-fnode::before { content: ''; position: absolute; right: -30px; top: 50%; width: 0; height: 0;
  border: 5px solid transparent; border-left-color: var(--aic-accent); transform: translate(2px,-50%); }
.aic-scl .sc-fnode:last-child::before { display: none; }
.aic-scl .sc-fk { font-family: var(--aic-font-display); font-weight: 700; font-size: 27px; color: var(--aic-ink); }
.aic-scl .sc-fen { font-family: var(--aic-font-display); font-weight: 500; font-size: 16px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin-top: 4px; }
.aic-scl .sc-fnode:nth-child(-n+2) { background: var(--aic-accent-soft); border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }
.aic-scl .sc-fnode:nth-child(-n+2) .sc-fk { color: var(--aic-accent-deep); }

.aic-scl .sc-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-scl .sc-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-scl .sc-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-scl .sc-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function ScaleCasePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-scl', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  const fN = Math.max(3, Math.min(copy.flow.length, p.flowStepCount));
  const flow = copy.flow.slice(0, fN);

  // column template adapts to which optional columns are shown
  const cols = ['minmax(300px, 1.2fr)', '1.3fr'];
  if (p.showRepresentative) cols.push('1.1fr');
  if (p.showJudgment) cols.push('1.2fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-scl" style={{ ...vars, '--table-bottom': p.showFlow ? '270px' : '150px' }}>
      {p.showDecorations && <div className="sc-glow" />}

      <div className="sc-head">
        <div>
          <p className="sc-eyebrow">{copy.eyebrow}</p>
          <h2 className="sc-title">{copy.title}</h2>
        </div>
        <div className="sc-sub">{copy.titleTail}</div>
      </div>

      <div className="sc-meta">
        <div className="sc-meta-l">
          <div className="sc-marker">
            <span className="sc-stack"><i /><i /><i /></span>
            <span className="sc-company">{copy.company}</span>
          </div>
          <p className="sc-lead">{copy.lead}</p>
          <div className="sc-statline">{copy.statLine}</div>
        </div>
        <div className="sc-anchor">
          <div className="sc-anchor-v">{copy.anchorValue}<u>{copy.anchorUnit}</u></div>
          <div className="sc-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="sc-table">
        <div className="sc-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="sc-th">{copy.colHeads.dim}</div>
          <div className="sc-th">{copy.colHeads.data}</div>
          {p.showRepresentative && <div className="sc-th">{copy.colHeads.rep}</div>}
          {p.showJudgment && <div className="sc-th">{copy.colHeads.note}</div>}
        </div>
        <div className="sc-tbody">
          {rows.map((r, i) => (
            <div className="sc-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="sc-dim">
                <span className="sc-tier" style={{ background: TIER_TONE[r.tier] || 'var(--aic-hair-strong)' }}>{r.tier}</span>
                <b>{r.dim}</b>
              </div>
              <div className="sc-data">{r.data}</div>
              {p.showRepresentative && <div className="sc-rep">{r.rep}</div>}
              {p.showJudgment && <div className="sc-note">{r.note}</div>}
            </div>
          ))}
        </div>
      </div>

      {p.showFlow && (
        <div className="sc-flow">
          {flow.map((f) => (
            <div className="sc-fnode" key={f.k}>
              <div className="sc-fk">{f.k}</div>
              <div className="sc-fen">{f.en}</div>
            </div>
          ))}
        </div>
      )}

      <div className="sc-foot">
        <div className="sc-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="sc-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
