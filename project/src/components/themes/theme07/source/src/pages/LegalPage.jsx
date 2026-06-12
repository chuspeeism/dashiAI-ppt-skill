/**
 * LegalPage — P30 专业服务高客单价 (Legal AI · Table-led · Segment Card)
 *
 * Table-led vertical-segment slide: a structured scenario table (direction /
 * scenario share / note) carries the information, anchored by a dominant-share
 * figure, and finished with a horizontal legal-process flow ribbon — the
 * signature device that sets this table page apart from the quarter tables.
 * Row count, the share column, the focus row and the flow are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-legal`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Legal AI',
  marker: '法律 AI',
  segment: '专业服务 · 法律',
  title: '专业服务高客单价',
  titleTail: '法律 AI 赛道',
  lead: '法律 AI 具备高客单价、强专业壁垒和明确效率提升空间；专业服务行业愿意为准确性和审计链路付费。',
  statLine: '融资额 26 亿美元 · 6 笔事件 · 平均单笔 4.3 亿美元',
  anchorValue: '46%',
  anchorLabel: '合同审查占场景比例',
  closing: '法律 AI 是垂直应用商业化样本。',
  colHeads: { dim: '场景方向', share: '场景占比', note: '能力说明' },
  // scenario rows (order fixed; count is prop-driven; share drives mini bar)
  rows: [
    { dim: '合同审查', share: 46, note: '条款抽取、风险标注与版本比对' },
    { dim: '法律检索', share: 22, note: '判例、法规与内部知识检索' },
    { dim: '尽职调查', share: 14, note: '数据室文档批量解析与摘要' },
    { dim: '合规审查', share: 11, note: '政策对照、留痕与审计链路' },
    { dim: '文书起草', share: 7, note: '模板生成与草拟辅助' },
  ],
  flowTitle: '法律工作流',
  // process flow nodes (count is prop-driven)
  flow: ['文档摄入', '条款抽取', '风险标注', '审查输出', '交付归档'],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  rowCount: 5,           // scenario rows shown (3–5)
  showShare: true,       // share column (mini bar + value)
  showFlow: true,        // bottom process-flow ribbon
  flowStepCount: 4,      // flow nodes (3–5)
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Legal AI' },
  { key: 'marker', label: 'marker', type: 'text', default: '法律 AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '专业服务 · 法律' },
  { key: 'title', label: '标题', type: 'text', default: '专业服务高客单价' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '法律 AI 赛道' },
  { key: 'lead', label: '导言', type: 'text', default: '法律 AI 具备高客单价、强专业壁垒和明确效率提升空间；专业服务行业愿意为准确性和审计链路付费。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 26 亿美元 · 6 笔事件 · 平均单笔 4.3 亿美元' },
  { key: 'anchorValue', label: 'anchorValue', type: 'text', default: '46%' },
  { key: 'anchorLabel', label: 'anchorLabel', type: 'text', default: '合同审查占场景比例' },
  { key: 'closing', label: '结语', type: 'text', default: '法律 AI 是垂直应用商业化样本。' },
  { key: 'flowTitle', label: 'flowTitle', type: 'text', default: '法律工作流' },
  { key: 'rowCount', label: '行数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '场景表格展示的行数量（3–5）。' },
  { key: 'showShare', label: '占比列', type: 'toggle', default: true,
    description: '场景占比列（迷你条 + 数值）的显隐。' },
  { key: 'showFlow', label: '流程图', type: 'toggle', default: true,
    description: '底部横向工作流程条的显隐。' },
  { key: 'flowStepCount', label: '流程数量', type: 'slider', default: 4, min: 3, max: 5, step: 1,
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
    description: '品牌强调色，作用于赛道标记、占比条、高亮行与流程节点。' },
];

const CSS = `
.aic-legal { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-legal, .aic-legal * { box-sizing: border-box; }
.aic-legal .lg-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-legal .lg-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-legal .lg-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-legal .lg-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-legal .lg-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · anchor share (right) */
.aic-legal .lg-meta { position: absolute; left: var(--pad); right: var(--pad); top: 288px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-legal .lg-meta-l { max-width: 1180px; }
.aic-legal .lg-marker { display: flex; align-items: baseline; gap: 18px; }
.aic-legal .lg-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 56px; line-height: .8;
  color: var(--aic-accent); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; white-space: nowrap; }
.aic-legal .lg-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-legal .lg-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 12px; }
.aic-legal .lg-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-legal .lg-anchor { flex: none; text-align: right; }
.aic-legal .lg-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 92px; line-height: .82;
  color: var(--aic-accent); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom; display: inline-block; }
.aic-legal .lg-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 12px; }

/* table */
.aic-legal .lg-table { position: absolute; left: var(--pad); right: var(--pad); top: 506px; bottom: 320px;
  display: flex; flex-direction: column; }
.aic-legal[data-flow="0"] .lg-table { bottom: 150px; }
.aic-legal .lg-thead { display: grid; align-items: center; gap: 0 36px; padding: 0 26px 14px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-legal .lg-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-legal .lg-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-legal .lg-row { flex: 1; display: grid; align-items: center; gap: 0 36px; padding: 0 26px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-legal .lg-row:last-child { border-bottom: none; }
.aic-legal .lg-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-legal .lg-dim { display: flex; align-items: center; gap: 16px; }
.aic-legal .lg-dim .dot { width: 12px; height: 12px; border-radius: 3px; background: var(--aic-hair-strong); flex: none; }
.aic-legal .lg-row[data-focus="1"] .lg-dim .dot { background: var(--aic-accent); }
.aic-legal .lg-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink); white-space: nowrap; }
.aic-legal .lg-share { display: flex; align-items: center; gap: 18px; }
.aic-legal .lg-share-track { flex: 1; height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; min-width: 80px; }
.aic-legal .lg-share-fill { height: 100%; border-radius: 999px;
  background: color-mix(in srgb, var(--aic-accent) 46%, white);
  transition: width .55s cubic-bezier(.3,.7,.4,1), background .3s; }
.aic-legal .lg-row[data-focus="1"] .lg-share-fill { background: var(--aic-accent); }
.aic-legal .lg-share-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; min-width: 78px; text-align: right; }
.aic-legal .lg-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 24px; color: var(--aic-ink-dim); }

/* process-flow ribbon */
.aic-legal .lg-flow { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px; }
.aic-legal .lg-flow-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 14px; }
.aic-legal .lg-flow-row { display: flex; align-items: stretch; }
.aic-legal .lg-node { flex: 1 1 0; display: flex; align-items: center; gap: 16px; }
.aic-legal .lg-node-box { flex: 1; display: flex; align-items: center; gap: 14px; padding: 18px 22px;
  border-radius: 14px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-legal .lg-node-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-accent-deep);
  width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; flex: none;
  background: color-mix(in srgb, var(--aic-accent) 18%, transparent); }
.aic-legal .lg-node-x { font-family: var(--aic-font-text); font-weight: 700; font-size: 24px; color: var(--aic-ink); white-space: nowrap; }
.aic-legal .lg-arrow { flex: none; width: 36px; display: grid; place-items: center; color: var(--aic-hair-strong); }
.aic-legal .lg-arrow svg { width: 22px; height: 22px; }

.aic-legal .lg-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-legal .lg-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-legal .lg-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-legal .lg-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

export default function LegalPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, marker: p.marker !== undefined ? p.marker : COPY.marker, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, anchorValue: p.anchorValue !== undefined ? p.anchorValue : COPY.anchorValue, anchorLabel: p.anchorLabel !== undefined ? p.anchorLabel : COPY.anchorLabel, closing: p.closing !== undefined ? p.closing : COPY.closing, flowTitle: p.flowTitle !== undefined ? p.flowTitle : COPY.flowTitle, rows: p.rows !== undefined ? p.rows : COPY.rows, flow: p.flow !== undefined ? p.flow : COPY.flow };
  ensureFonts();
  injectScopedStyle('aic-legal', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxShare = Math.max(...rows.map((r) => r.share));

  const flowN = Math.max(3, Math.min(copy.flow.length, p.flowStepCount));
  const flow = copy.flow.slice(0, flowN);

  // column template adapts to whether the share column is shown
  const cols = ['minmax(280px, 1.1fr)'];
  if (p.showShare) cols.push('minmax(300px, 1.2fr)');
  cols.push('1.5fr');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-legal" style={vars} data-flow={p.showFlow ? '1' : '0'}>
      {p.showDecorations && <div className="lg-glow" />}

      <div className="lg-head">
        <div>
          <p className="lg-eyebrow">{copy.eyebrow}</p>
          <h2 className="lg-title">{copy.title}</h2>
        </div>
        <div className="lg-sub">{copy.titleTail}</div>
      </div>

      <div className="lg-meta">
        <div className="lg-meta-l">
          <div className="lg-marker">
            <b>{copy.marker}</b>
            <span className="lg-season">{copy.segment}</span>
          </div>
          <p className="lg-lead">{copy.lead}</p>
          <div className="lg-statline">{copy.statLine}</div>
        </div>
        <div className="lg-anchor">
          <div className="lg-anchor-v">{copy.anchorValue}</div>
          <div className="lg-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="lg-table">
        <div className="lg-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="lg-th">{copy.colHeads.dim}</div>
          {p.showShare && <div className="lg-th">{copy.colHeads.share}</div>}
          <div className="lg-th">{copy.colHeads.note}</div>
        </div>
        <div className="lg-tbody">
          {rows.map((r, i) => (
            <div className="lg-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
              style={{ gridTemplateColumns: gridCols }}>
              <div className="lg-dim"><span className="dot" /><b>{r.dim}</b></div>
              {p.showShare && (
                <div className="lg-share">
                  <div className="lg-share-track">
                    <div className="lg-share-fill" style={{ width: (r.share / maxShare * 100) + '%' }} />
                  </div>
                  <div className="lg-share-v">{r.share}%</div>
                </div>
              )}
              <div className="lg-note">{r.note}</div>
            </div>
          ))}
        </div>
      </div>

      {p.showFlow && (
        <div className="lg-flow">
          <p className="lg-flow-t">{copy.flowTitle}</p>
          <div className="lg-flow-row">
            {flow.map((x, i) => (
              <div className="lg-node" key={x} style={{ flexGrow: i === flow.length - 1 ? 0 : 1 }}>
                <div className="lg-node-box">
                  <span className="lg-node-n">{i + 1}</span>
                  <span className="lg-node-x">{x}</span>
                </div>
                {i < flow.length - 1 && (
                  <span className="lg-arrow">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6"
                      fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lg-foot">
        <div className="lg-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="lg-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
