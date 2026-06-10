/**
 * CooldownPage — P20 理性回落季度 (Quarter Breakdown · Q4 · Timeline-led)
 *
 * Timeline-led single-quarter slide: the four quarters read as a horizontal
 * phase timeline, with a year-arc curve that rises then declines into Q4 and a
 * dashed baseline showing the quarter still sits above the year-start level.
 * Node count, the decline curve, the baseline, the metric callouts and the
 * focus node are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-cool`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (ChangeBadge, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { ChangeBadge, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Quarter Breakdown',
  marker: 'Q4',
  season: '2024 第四季度 · 回落',
  title: '理性回落季度',
  titleTail: 'Q4 融资拆解',
  lead: 'Q4 较 Q3 回落，但仍高于年初水平，说明资金并未完全撤离，资本开始挑选确定性更高的标的。',
  closing: '回落不是终点，而是分化的开始。',
  baselineLabel: '年初水平 · 162',
  chartLabel: '全年季度融资额 / 亿美元',
  declineLabel: '较 Q3',
  declineValue: '-35.2%',
  // quarter timeline nodes (amount drives the curve; phase = short label)
  nodes: [
    { q: 'Q1', amount: 162, phase: '起步', note: '保守启动' },
    { q: 'Q2', amount: 284, phase: '加速', note: '窗口打开' },
    { q: 'Q3', amount: 318, phase: '峰值', note: '情绪高点' },
    { q: 'Q4', amount: 206, phase: '回落', note: '理性筛选' },
  ],
  activeIndex: 3,
  // metric callouts (order fixed; count is prop-driven)
  metrics: [
    { label: '融资额', value: '206', unit: '亿美元' },
    { label: '事件数', value: '22', unit: '笔' },
    { label: '平均单笔', value: '9.4', unit: '亿美元' },
    { label: '较 Q3', value: '-35.2%', unit: '', badge: true },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  nodeCount: 4,          // timeline / curve nodes shown (2–4)
  metricCount: 4,        // metric callouts (2–4)
  focusEnabled: true,    // highlight one timeline node
  focusIndex: 3,         // which node is the focus (0-based)
  showCurve: true,       // the year-arc decline curve
  showBaseline: true,    // dashed year-start reference line
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'nodeCount', label: '节点数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '时间轴 / 曲线上的阶段节点数量（2–4）。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个时间轴节点作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 3,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的节点。', showWhen: (p) => p.focusEnabled },
  { key: 'showCurve', label: '趋势曲线', type: 'toggle', default: true,
    description: '年度回落曲线（面积 + 折线）的显隐。' },
  { key: 'showBaseline', label: '基准参考线', type: 'toggle', default: true,
    description: '年初水平虚线参考线的显隐，用于交代“仍处高位”。', showWhen: (p) => p.showCurve },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于曲线、高亮节点与指标卡。' },
];

const CSS = `
.aic-cool { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cool, .aic-cool * { box-sizing: border-box; }
.aic-cool .cl-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 54%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-cool .cl-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cool .cl-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cool .cl-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-cool .cl-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-cool .cl-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-cool .cl-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-cool .cl-marker { display: flex; align-items: baseline; gap: 16px; flex: none; }
.aic-cool .cl-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 74px; line-height: .8;
  color: var(--aic-accent); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-cool .cl-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); max-width: 150px; line-height: 1.4; }
.aic-cool .cl-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 0; max-width: 1160px; }

/* chart + timeline */
.aic-cool .cl-chart { position: absolute; left: var(--pad); right: var(--pad); top: 452px; }
.aic-cool .cl-chart-t { display: flex; align-items: center; justify-content: space-between; margin: 0 0 8px; }
.aic-cool .cl-chart-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-cool .cl-chart-t .chg { display: flex; align-items: center; gap: 12px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 21px; color: var(--aic-ink-dim); }
.aic-cool .cl-svg { display: block; width: 100%; height: auto; }
.aic-cool .cl-nodes { display: grid; margin-top: 18px; }
.aic-cool .cl-node { position: relative; padding: 18px 0 0; text-align: center; }
.aic-cool .cl-node-q { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-muted);
  transform: skewX(-9deg); display: inline-block; }
.aic-cool .cl-node[data-focus="1"] .cl-node-q { color: var(--aic-ink); }
.aic-cool .cl-node-phase { font-family: var(--aic-font-text); font-weight: 700; font-size: 24px; color: var(--aic-ink-dim); margin-top: 6px; }
.aic-cool .cl-node[data-focus="1"] .cl-node-phase { color: var(--aic-ink); }
.aic-cool .cl-node-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; color: var(--aic-faint); margin-top: 2px; }
.aic-cool .cl-node[data-focus="1"] .cl-node-note { color: var(--aic-muted); }

/* metric callouts */
.aic-cool .cl-cards { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px;
  display: grid; gap: 18px; }
.aic-cool .cl-card { border-radius: 18px; padding: 22px 28px; background: var(--aic-card); border: 1.5px solid var(--aic-hair);
  display: flex; flex-direction: column; gap: 8px; }
.aic-cool .cl-card-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 20px; color: var(--aic-muted); }
.aic-cool .cl-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 46px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-cool .cl-card-val u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }
.aic-cool .cl-card .aic-viz-badge { font-size: 34px; padding: 8px 16px; align-self: flex-start; }

.aic-cool .cl-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-cool .cl-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cool .cl-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cool .cl-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','accent','pos','accent','pos','warn','neg','pos','accent',
  'pos','warn','accent','pos','neg','pos','accent','warn','pos','accent','pos','pos','warn','neg',
  'accent','pos','warn','pos','accent','pos','neg','warn','pos','accent'].map((tone) => ({ tone }));

// chart geometry (SVG user units) — width is illustrative; svg scales to box
const VW = 1728, VH = 300;
const M = { l: 40, r: 40, t: 40, b: 18 };

export default function CooldownPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-cool', CSS);
  const vars = themeVars(p.accentColor);

  const nNodes = Math.max(2, Math.min(copy.nodes.length, p.nodeCount));
  const nodes = copy.nodes.slice(0, nNodes);
  const focus = Math.max(0, Math.min(nNodes - 1, p.focusIndex));
  const active = Math.min(nNodes - 1, copy.activeIndex);

  const metricN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, metricN);

  const amax = Math.max(...nodes.map((d) => d.amount)) * 1.16;
  const plotW = VW - M.l - M.r;
  const plotH = VH - M.t - M.b;
  // points sit at column centers so they align with the HTML node grid below
  const x = (i) => M.l + (plotW * (i + 0.5)) / nNodes;
  const y = (v) => M.t + plotH * (1 - v / amax);
  const pts = nodes.map((d, i) => [x(i), y(d.amount)]);
  const linePath = pts.map(([px, py], i) => (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)).join(' ');
  const areaPath = `M ${x(0).toFixed(1)} ${(VH - M.b).toFixed(1)} `
    + pts.map(([px, py]) => `L ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
    + ` L ${x(nNodes - 1).toFixed(1)} ${(VH - M.b).toFixed(1)} Z`;
  const baseY = y(nodes[0].amount);

  return (
    <div className="aic-cool" style={vars}>
      {p.showDecorations && <div className="cl-glow" />}

      <div className="cl-head">
        <div>
          <p className="cl-eyebrow">{copy.eyebrow}</p>
          <h2 className="cl-title">{copy.title}</h2>
        </div>
        <div className="cl-sub">{copy.titleTail}</div>
      </div>

      <div className="cl-meta">
        <div className="cl-marker">
          <b>{copy.marker}</b>
          <span className="cl-season">{copy.season}</span>
        </div>
        <p className="cl-lead">{copy.lead}</p>
      </div>

      <div className="cl-chart">
        <div className="cl-chart-t">
          <span>{copy.chartLabel}</span>
          <div className="chg">{copy.declineLabel}<ChangeBadge value={copy.declineValue} /></div>
        </div>
        <svg className="cl-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none"
          style={{ height: 300 }}>
          {/* year-start baseline */}
          {p.showCurve && p.showBaseline && (
            <g>
              <line x1={M.l} y1={baseY} x2={VW - M.r} y2={baseY} stroke="var(--aic-ink)"
                strokeWidth="1.6" strokeDasharray="4 8" opacity="0.5" />
              <text x={VW - M.r} y={baseY - 12} textAnchor="end"
                style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 600, fontSize: 18, fill: 'var(--aic-muted)' }}>{copy.baselineLabel}</text>
            </g>
          )}
          {/* baseline axis */}
          <line x1={M.l} y1={VH - M.b} x2={VW - M.r} y2={VH - M.b} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />

          {p.showCurve && (
            <>
              <path d={areaPath} fill="var(--aic-accent)" opacity="0.16" />
              <path d={linePath} fill="none" stroke="var(--aic-accent)" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {/* focus vertical guide */}
          {p.focusEnabled && (
            <line x1={x(focus)} y1={M.t - 8} x2={x(focus)} y2={VH - M.b} stroke="var(--aic-accent)"
              strokeWidth="2" strokeDasharray="3 7" opacity="0.55" />
          )}

          {/* nodes + value labels */}
          {nodes.map((d, i) => {
            const isF = p.focusEnabled && i === focus;
            return (
              <g key={d.q}>
                <circle cx={x(i)} cy={y(d.amount)} r={isF ? 11 : 7} fill="var(--aic-paper)"
                  stroke="var(--aic-accent)" strokeWidth={isF ? 5 : 4} />
                <text x={x(i)} y={y(d.amount) - (isF ? 24 : 18)} textAnchor="middle"
                  style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700,
                    fontSize: isF ? 30 : 24, fill: 'var(--aic-ink)' }}>{d.amount}</text>
              </g>
            );
          })}
        </svg>

        <div className="cl-nodes" style={{ gridTemplateColumns: `repeat(${nNodes}, 1fr)` }}>
          {nodes.map((d, i) => (
            <div className="cl-node" key={d.q} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <span className="cl-node-q">{d.q}</span>
              <div className="cl-node-phase">{d.phase}</div>
              <div className="cl-node-note">{d.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cl-cards" style={{ gridTemplateColumns: `repeat(${metricN}, 1fr)` }}>
        {metrics.map((mt) => (
          <div className="cl-card" key={mt.label}>
            <div className="cl-card-lbl">{mt.label}</div>
            {mt.badge
              ? <ChangeBadge value={mt.value} />
              : <div className="cl-card-val">{mt.value}{mt.unit ? <u>{mt.unit}</u> : null}</div>}
          </div>
        ))}
      </div>

      <div className="cl-foot">
        <div className="cl-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cl-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
