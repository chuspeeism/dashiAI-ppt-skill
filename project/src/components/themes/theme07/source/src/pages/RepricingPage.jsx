/**
 * RepricingPage — P79 估值锚重定价 (IPO Watch · Timeline · Strategy Card)
 *
 * Timeline-led strategy slide. The signature device is a horizontal IPO-watch
 * axis carrying the companies whose public-market debut would reset the AI
 * private-market valuation anchor; each node is a company card on the axis with
 * a sector chip and a watch note. Below sits a row of observation indicators.
 * Node count, the focus company, indicator count and accent are prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-rp`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'IPO Watch',
  segment: '策略 · 观察 IPO 窗口',
  title: '估值锚重定价',
  titleTail: '策略 · 观察 IPO 窗口',
  lead: '头部公司 IPO 表现会影响整个 AI 一级市场估值锚；如果头部上市后估值承压，一级市场会同步下修预期。',
  closing: '公开市场会重新定价 AI 叙事。',
  axisLabel: 'IPO 观察序列 · 估值锚定者',
  // companies to watch (order fixed; count is prop-driven)
  nodes: [
    { name: 'OpenAI', sector: '通用大模型', note: '体量决定市场情绪基准' },
    { name: 'Anthropic', sector: '安全模型', note: '增速验证叙事可持续性' },
    { name: 'Databricks', sector: '数据平台', note: '老牌营收验证 AI 溢价' },
    { name: 'CoreWeave', sector: '算力基础设施', note: '云成本与毛利率受考验' },
  ],
  metricsTitle: '观察指标 · Signals',
  // observation indicators (order fixed; count is prop-driven)
  metrics: [
    { name: '上市表现', note: '首日与解禁后定价' },
    { name: '收入增速', note: '能否支撑高估值' },
    { name: '毛利率', note: '盈利模型是否成立' },
    { name: '云成本占比', note: '算力侵蚀利润程度' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  nodeCount: 4,          // timeline company nodes (2–4)
  focusEnabled: true,    // highlight one watched company
  focusIndex: 0,         // which company is the focus (0-based)
  showMetrics: true,     // observation-indicator row
  metricCount: 4,        // indicators shown (2–4)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'IPO Watch' },
  { key: 'segment', label: 'segment', type: 'text', default: '策略 · 观察 IPO 窗口' },
  { key: 'title', label: '标题', type: 'text', default: '估值锚重定价' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '策略 · 观察 IPO 窗口' },
  { key: 'lead', label: '导言', type: 'text', default: '头部公司 IPO 表现会影响整个 AI 一级市场估值锚；如果头部上市后估值承压，一级市场会同步下修预期。' },
  { key: 'closing', label: '结语', type: 'text', default: '公开市场会重新定价 AI 叙事。' },
  { key: 'axisLabel', label: '坐标标签', type: 'text', default: 'IPO 观察序列 · 估值锚定者' },
  { key: 'metricsTitle', label: 'metricsTitle', type: 'text', default: '观察指标 · Signals' },
  { key: 'nodeCount', label: '节点数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '时间轴上的观察公司节点数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一家观察公司作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的观察公司。', showWhen: (p) => p.focusEnabled },
  { key: 'showMetrics', label: '指标行', type: 'toggle', default: true,
    description: '底部观察指标行的显隐。' },
  { key: 'metricCount', label: '指标数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '展示的观察指标数量（2–4）。', showWhen: (p) => p.showMetrics },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于时间轴节点与高亮公司。' },
];

const CSS = `
.aic-rp { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-rp, .aic-rp * { box-sizing: border-box; }
.aic-rp .rp-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-rp .rp-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-rp .rp-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-rp .rp-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-rp .rp-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* body — flex column: lead / timeline / metrics */
.aic-rp .rp-body { position: absolute; left: var(--pad); right: var(--pad); top: 300px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-rp .rp-marker { display: flex; align-items: center; gap: 16px; }
.aic-rp .rp-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-rp .rp-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-rp .rp-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 0; max-width: 1480px; text-wrap: pretty; }

/* timeline */
.aic-rp .rp-tl { flex: 1; min-height: 0; margin-top: 34px; display: flex; flex-direction: column; }
.aic-rp .rp-tl-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 18px; }
.aic-rp .rp-tl-inner { flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column; justify-content: center; }
/* cards above the axis */
.aic-rp .rp-nodes { display: grid; gap: 28px; align-items: stretch; }
.aic-rp .rp-card { position: relative; border: 1.5px solid var(--aic-hair); border-radius: 20px;
  background: var(--aic-card); padding: 26px 30px 26px; display: flex; flex-direction: column; gap: 8px;
  transition: border-color .3s, background .3s, transform .3s, box-shadow .3s; }
.aic-rp .rp-card[data-focus="1"] { border-color: transparent; transform: translateY(-6px);
  background: linear-gradient(158deg, color-mix(in srgb, var(--aic-accent) 18%, var(--aic-card)), var(--aic-card) 78%);
  box-shadow: 0 26px 58px -30px color-mix(in srgb, var(--aic-accent) 64%, transparent); }
.aic-rp .rp-card[data-dim="1"] { opacity: .56; }
.aic-rp .rp-card-no { font-family: var(--aic-font-display); font-weight: 700; font-size: 20px; color: var(--aic-faint);
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-rp .rp-card[data-focus="1"] .rp-card-no { color: var(--aic-accent-deep); }
.aic-rp .rp-card-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 42px; line-height: 1; color: var(--aic-ink); }
.aic-rp .rp-card-sec { display: inline-flex; align-self: flex-start; align-items: center; gap: 8px; padding: 7px 16px;
  border-radius: 999px; background: color-mix(in srgb, var(--aic-ink) 6%, transparent); font-family: var(--aic-font-text);
  font-weight: 600; font-size: 19px; color: var(--aic-ink-dim); }
.aic-rp .rp-card[data-focus="1"] .rp-card-sec { background: color-mix(in srgb, var(--aic-accent) 24%, transparent); color: var(--aic-accent-deep); }
.aic-rp .rp-card-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 21px; line-height: 1.36; color: var(--aic-muted); text-wrap: pretty; }
/* the axis + node dots */
.aic-rp .rp-axis { position: relative; height: 2.5px; background: var(--aic-hair-strong); margin-top: 28px; }
.aic-rp .rp-axis::after { content: ''; position: absolute; right: -2px; top: -6px; border: 7px solid transparent; border-left-color: var(--aic-ink); }
.aic-rp .rp-dots { position: absolute; left: 0; right: 0; top: 0; display: grid; }
.aic-rp .rp-dot { position: relative; height: 0; display: flex; justify-content: center; }
.aic-rp .rp-dot i { position: absolute; top: -11px; width: 22px; height: 22px; border-radius: 50%;
  background: var(--aic-paper); border: 5px solid var(--aic-hair-strong); box-sizing: border-box; transition: border-color .3s, transform .3s; }
.aic-rp .rp-dot[data-focus="1"] i { border-color: var(--aic-accent); transform: scale(1.18); box-shadow: 0 0 0 6px color-mix(in srgb, var(--aic-accent) 18%, transparent); }
.aic-rp .rp-axislab { display: grid; margin-top: 18px; }
.aic-rp .rp-axislab span { text-align: center; font-family: var(--aic-font-display); font-weight: 600; font-size: 17px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--aic-faint); }

/* observation metrics row */
.aic-rp .rp-metrics { flex: none; margin-top: 30px; }
.aic-rp .rp-metrics-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 16px; }
.aic-rp .rp-metrics-grid { display: grid; gap: 22px; }
.aic-rp .rp-metric { border: 1.5px solid var(--aic-hair); border-radius: 16px; background: var(--aic-card);
  padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; }
.aic-rp .rp-metric-n { font-family: var(--aic-font-text); font-weight: 800; font-size: 27px; color: var(--aic-ink); line-height: 1; }
.aic-rp .rp-metric-s { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; color: var(--aic-muted); line-height: 1.3; }

.aic-rp .rp-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-rp .rp-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-rp .rp-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-rp .rp-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','accent','pos','pos','warn','accent','pos','pos','accent','pos','warn','accent','pos','pos',
  'accent','pos','warn','accent','pos','pos','accent','pos','warn','accent'].map((tone) => ({ tone }));

export default function RepricingPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, axisLabel: p.axisLabel !== undefined ? p.axisLabel : COPY.axisLabel, metricsTitle: p.metricsTitle !== undefined ? p.metricsTitle : COPY.metricsTitle, nodes: p.nodes !== undefined ? p.nodes : COPY.nodes, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-rp', CSS);
  const vars = themeVars(p.accentColor);

  const nN = Math.max(2, Math.min(copy.nodes.length, p.nodeCount));
  const nodes = copy.nodes.slice(0, nN);
  const focus = Math.max(0, Math.min(nN - 1, p.focusIndex));

  const mN = Math.max(2, Math.min(copy.metrics.length, p.metricCount));
  const metrics = copy.metrics.slice(0, mN);

  const colTpl = `repeat(${nN}, 1fr)`;

  return (
    <div className="aic-rp" style={vars}>
      {p.showDecorations && <div className="rp-glow" />}

      <div className="rp-head">
        <div>
          <p className="rp-eyebrow">{copy.eyebrow}</p>
          <h2 className="rp-title">{copy.title}</h2>
        </div>
        <div className="rp-sub">{copy.titleTail}</div>
      </div>

      <div className="rp-body">
        <div className="rp-marker"><b /><span>{copy.segment}</span></div>
        <p className="rp-lead">{copy.lead}</p>

        <div className="rp-tl">
          <p className="rp-tl-t">{copy.axisLabel}</p>
          <div className="rp-tl-inner">
            <div className="rp-nodes" style={{ gridTemplateColumns: colTpl }}>
              {nodes.map((nd, i) => (
                <div className="rp-card" key={nd.name}
                  data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                  data-dim={p.focusEnabled && i !== focus ? '1' : '0'}>
                  <span className="rp-card-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="rp-card-n">{nd.name}</span>
                  <span className="rp-card-sec">{nd.sector}</span>
                  <span className="rp-card-note">{nd.note}</span>
                </div>
              ))}
            </div>
            <div className="rp-axis">
              <div className="rp-dots" style={{ gridTemplateColumns: colTpl }}>
                {nodes.map((nd, i) => (
                  <div className="rp-dot" key={nd.name}
                    data-focus={p.focusEnabled && i === focus ? '1' : '0'}><i /></div>
                ))}
              </div>
            </div>
            <div className="rp-axislab" style={{ gridTemplateColumns: colTpl }}>
              {nodes.map((nd) => <span key={nd.name}>{nd.name}</span>)}
            </div>
          </div>
        </div>

        {p.showMetrics && (
          <div className="rp-metrics">
            <p className="rp-metrics-t">{copy.metricsTitle}</p>
            <div className="rp-metrics-grid" style={{ gridTemplateColumns: `repeat(${mN}, 1fr)` }}>
              {metrics.map((m) => (
                <div className="rp-metric" key={m.name}>
                  <span className="rp-metric-n">{m.name}</span>
                  <span className="rp-metric-s">{m.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rp-foot">
        <div className="rp-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="rp-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
