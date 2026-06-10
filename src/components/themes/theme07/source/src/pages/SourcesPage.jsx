/**
 * SourcesPage — P83 数据来源与口径 (Data & Methodology · Table-led)
 *
 * Table-led appendix slide: a structured methodology table (scope dimension /
 * credibility meter / definition & source) carries the information, anchored by
 * the sample size, and finished with a horizontal pipeline ribbon (collect →
 * de-dupe → unify scope → structure → review). The credibility column is toned
 * in the brand accent to read as a positive confidence meter. Row count, the
 * meter column, the focus row and the pipeline are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-src`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Data & Methodology',
  marker: '研究口径',
  segment: '附录 · 口径与来源',
  title: '数据来源与口径',
  titleTail: '附录 · 口径与来源',
  lead: '本报告以公开披露的 2024 年美国 AI 大额融资事件为样本，统一口径后进行结构化分析；以下为关键口径与数据来源说明。',
  statLine: '样本 97 笔 · 单笔 ≥1 亿美元 · 截至 2024 全年',
  anchorValue: '97',
  anchorLabel: '大额融资事件样本量 / 笔',
  closing: '口径透明，结论才可被检验。',
  colHeads: { dim: '口径维度', level: '可信度', note: '口径定义与来源' },
  // scope rows (order fixed; count is prop-driven; level drives the meter)
  rows: [
    { dim: '融资口径', level: 95, note: '单笔 ≥1 亿美元股权融资，剔除二级交易与并购' },
    { dim: '时间范围', level: 92, note: '2024-01 至 2024-12，按融资公告日归属季度' },
    { dim: '地域范围', level: 90, note: '总部位于美国的 AI 公司，以注册地为准' },
    { dim: '数据来源', level: 85, note: '公开新闻、公司公告与行业数据库多源交叉' },
    { dim: '汇率与单位', level: 88, note: '统一折算为美元，以「亿美元」为展示单位' },
    { dim: '赛道划分', level: 78, note: '模型 / 应用 / 基础设施 / 硬件 / 安全 五类，按主营归类' },
  ],
  flowTitle: '口径处理流程',
  // pipeline nodes (count is prop-driven)
  flow: ['数据采集', '去重核对', '口径统一', '结构化', '交叉复核'],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  rowCount: 6,           // scope rows shown (4–6)
  showLevel: true,       // credibility column (meter + value)
  showFlow: true,        // bottom pipeline ribbon
  flowStepCount: 5,      // pipeline nodes (3–5)
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'rowCount', label: '行数量', type: 'slider', default: 6, min: 4, max: 6, step: 1,
    description: '口径表格展示的行数量（4–6）。' },
  { key: 'showLevel', label: '强度列', type: 'toggle', default: true,
    description: '可信度列（强度条 + 数值）的显隐。' },
  { key: 'showFlow', label: '流程图', type: 'toggle', default: true,
    description: '底部横向口径处理流程条的显隐。' },
  { key: 'flowStepCount', label: '流程数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '流程节点数量（3–5）。', showWhen: (p) => p.showFlow },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一行作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 行' }, { value: 1, label: '第 2 行' },
      { value: 2, label: '第 3 行' }, { value: 3, label: '第 4 行' },
      { value: 4, label: '第 5 行' }, { value: 5, label: '第 6 行' }],
    description: '选择被高亮的行。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于维度标记、高亮行与流程节点。' },
];

const CSS = `
.aic-src { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-src, .aic-src * { box-sizing: border-box; }
.aic-src .src-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 20%, transparent), transparent 70%); }

.aic-src .src-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-src .src-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-src .src-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-src .src-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · anchor figure (right) */
.aic-src .src-meta { position: absolute; left: var(--pad); right: var(--pad); top: 288px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-src .src-meta-l { max-width: 1180px; }
.aic-src .src-marker { display: flex; align-items: baseline; gap: 18px; }
.aic-src .src-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 50px; line-height: .8;
  color: var(--aic-accent-deep); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; white-space: nowrap; }
.aic-src .src-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-src .src-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 12px; text-wrap: pretty; }
.aic-src .src-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-src .src-anchor { flex: none; text-align: right; }
.aic-src .src-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 100px; line-height: .82;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom; display: inline-block; }
.aic-src .src-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 12px; }

/* table */
.aic-src .src-table { position: absolute; left: var(--pad); right: var(--pad); top: 500px; bottom: 320px;
  display: flex; flex-direction: column; }
.aic-src[data-flow="0"] .src-table { bottom: 150px; }
.aic-src .src-thead { display: grid; align-items: center; gap: 0 36px; padding: 0 26px 14px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-src .src-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-src .src-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-src .src-row { flex: 1; display: grid; align-items: center; gap: 0 36px; padding: 0 26px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-src .src-row:last-child { border-bottom: none; }
.aic-src .src-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-src .src-dim { display: flex; align-items: center; gap: 16px; }
.aic-src .src-dim .dot { width: 12px; height: 12px; border-radius: 3px; background: var(--aic-accent); flex: none; opacity: .55; }
.aic-src .src-row[data-focus="1"] .src-dim .dot { opacity: 1; }
.aic-src .src-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); white-space: nowrap; }
.aic-src .src-level { display: flex; align-items: center; gap: 18px; }
.aic-src .src-level-track { flex: 1; height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; min-width: 80px; }
.aic-src .src-level-fill { height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--aic-accent) 55%, white), var(--aic-accent-deep));
  transition: width .55s cubic-bezier(.3,.7,.4,1); }
.aic-src .src-level-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 27px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; min-width: 96px; text-align: right; }
.aic-src .src-level-v u { text-decoration: none; font-size: 17px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-src .src-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; color: var(--aic-ink-dim); }

/* pipeline ribbon */
.aic-src .src-flow { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px; }
.aic-src .src-flow-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 14px; }
.aic-src .src-flow-row { display: flex; align-items: stretch; }
.aic-src .src-node { flex: 1 1 0; display: flex; align-items: center; gap: 14px; }
.aic-src .src-node-box { flex: 1; display: flex; align-items: center; gap: 14px; padding: 18px 22px;
  border-radius: 14px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-src .src-node-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-accent-deep);
  width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; flex: none;
  background: color-mix(in srgb, var(--aic-accent) 18%, transparent); }
.aic-src .src-node-x { font-family: var(--aic-font-text); font-weight: 700; font-size: 23px; color: var(--aic-ink); white-space: nowrap; }
.aic-src .src-arrow { flex: none; width: 32px; display: grid; place-items: center; color: var(--aic-hair-strong); }
.aic-src .src-arrow svg { width: 20px; height: 20px; }

.aic-src .src-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-src .src-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-src .src-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-src .src-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','pos','accent','pos','warn','accent','pos','pos','accent','warn','pos','accent',
  'pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','pos','warn','accent','pos','accent','pos','warn','pos','accent'].map((tone) => ({ tone }));

export default function SourcesPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-src', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(4, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxLevel = Math.max(...rows.map((r) => r.level));

  const flowN = Math.max(3, Math.min(copy.flow.length, p.flowStepCount));
  const flow = copy.flow.slice(0, flowN);

  // column template adapts to whether the credibility column is shown
  const cols = ['minmax(240px, 0.9fr)'];
  if (p.showLevel) cols.push('minmax(300px, 1.1fr)');
  cols.push('1.7fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-src" style={vars} data-flow={p.showFlow ? '1' : '0'}>
      {p.showDecorations && <div className="src-glow" />}

      <div className="src-head">
        <div>
          <p className="src-eyebrow">{copy.eyebrow}</p>
          <h2 className="src-title">{copy.title}</h2>
        </div>
        <div className="src-sub">{copy.titleTail}</div>
      </div>

      <div className="src-meta">
        <div className="src-meta-l">
          <div className="src-marker">
            <b>{copy.marker}</b>
            <span className="src-season">{copy.segment}</span>
          </div>
          <p className="src-lead">{copy.lead}</p>
          <div className="src-statline">{copy.statLine}</div>
        </div>
        <div className="src-anchor">
          <div className="src-anchor-v">{copy.anchorValue}</div>
          <div className="src-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="src-table">
        <div className="src-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="src-th">{copy.colHeads.dim}</div>
          {p.showLevel && <div className="src-th">{copy.colHeads.level}</div>}
          <div className="src-th">{copy.colHeads.note}</div>
        </div>
        <div className="src-tbody">
          {rows.map((r, i) => (
            <div className="src-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="src-dim"><span className="dot" /><b>{r.dim}</b></div>
              {p.showLevel && (
                <div className="src-level">
                  <div className="src-level-track">
                    <div className="src-level-fill" style={{ width: (r.level / maxLevel * 100) + '%' }} />
                  </div>
                  <div className="src-level-v">{r.level}<u>/100</u></div>
                </div>
              )}
              <div className="src-note">{r.note}</div>
            </div>
          ))}
        </div>
      </div>

      {p.showFlow && (
        <div className="src-flow">
          <p className="src-flow-t">{copy.flowTitle}</p>
          <div className="src-flow-row">
            {flow.map((x, i) => (
              <div className="src-node" key={x} style={{ flexGrow: i === flow.length - 1 ? 0 : 1 }}>
                <div className="src-node-box">
                  <span className="src-node-n">{i + 1}</span>
                  <span className="src-node-x">{x}</span>
                </div>
                {i < flow.length - 1 && (
                  <span className="src-arrow">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6"
                      fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="src-foot">
        <div className="src-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="src-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
