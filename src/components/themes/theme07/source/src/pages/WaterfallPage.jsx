/**
 * WaterfallPage — P22 赛道贡献拆分 (Funding Waterfall · Chart-led)
 *
 * A waterfall chart: each track stacks onto the running total to build the
 * full-year funding figure. The chart is the hero; a running total and an
 * optional final "total" column close the read.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-wf`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Funding Waterfall',
  title: '赛道贡献拆分',
  sub: '融资额贡献瀑布',
  lead: '全年 970 亿美元由模型、应用、基础设施、芯片和其他方向共同构成。',
  closing: '大模型制造热度，基础设施和应用承接兑现。',
  chartLabel: '各赛道累计贡献 / 亿美元',
  totalLabel: '全年合计',
  totalUnit: '亿美元',
  // steps (order fixed; count is prop-driven). value adds onto the running total.
  steps: [
    { name: '通用大模型', value: 420, note: '模型层' },
    { name: '垂直应用', value: 245, note: '应用层' },
    { name: '基础设施', value: 158, note: '基建层' },
    { name: 'AI 芯片', value: 97, note: '硬件层' },
    { name: '其他', value: 50, note: '其他' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  stepCount: 5,          // contribution steps shown (3–5)
  showTotal: true,       // final cumulative total column
  showConnectors: true,  // dashed step-to-step connector lines
  showValues: true,      // value labels above each step
  focusEnabled: true,    // emphasise one step
  focusIndex: 0,         // which step is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'stepCount', label: '台阶数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '瀑布图的贡献台阶数量（3–5）；合计自动重算。' },
  { key: 'showTotal', label: '合计列', type: 'toggle', default: true,
    description: '末尾全年合计落地柱的显隐。' },
  { key: 'showConnectors', label: '连接线', type: 'toggle', default: true,
    description: '台阶之间的虚线连接线的显隐。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '每个台阶上方增量数值的显隐。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个贡献台阶作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }, { value: 4, label: '第 5 个' }],
    description: '选择被高亮的台阶。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于高亮台阶、合计柱与连接线。' },
];

const CSS = `
.aic-wf { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-wf, .aic-wf * { box-sizing: border-box; }
.aic-wf .wf-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 54%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-wf .wf-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-wf .wf-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-wf .wf-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-wf .wf-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-wf .wf-meta { position: absolute; left: var(--pad); right: var(--pad); top: 300px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-wf .wf-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.45;
  color: var(--aic-ink); max-width: 1180px; margin: 0; }
.aic-wf .wf-lead b { color: var(--aic-accent-deep); font-weight: 700; }
.aic-wf .wf-total { flex: none; text-align: right; }
.aic-wf .wf-total-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 92px; line-height: .82;
  color: var(--aic-accent); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom; display: inline-block; }
.aic-wf .wf-total-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 12px; }

/* chart */
.aic-wf .wf-chart { position: absolute; left: var(--pad); right: var(--pad); top: 486px; bottom: 150px; }
.aic-wf .wf-chart-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 6px; }
.aic-wf .wf-svg { display: block; width: 100%; height: calc(100% - 30px); }

.aic-wf .wf-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-wf .wf-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-wf .wf-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-wf .wf-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','accent','pos','pos','warn','pos','accent','pos','warn','pos','accent','pos',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','pos','warn','accent','pos'].map((tone) => ({ tone }));

// chart geometry (SVG user units)
const VW = 1728, VH = 470;
const M = { l: 8, r: 8, t: 56, b: 64 };

export default function WaterfallPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-wf', CSS);
  const vars = themeVars(p.accentColor);

  const sc = Math.max(3, Math.min(copy.steps.length, p.stepCount));
  const steps = copy.steps.slice(0, sc);
  const focus = Math.max(0, Math.min(sc - 1, p.focusIndex));
  const total = steps.reduce((s, d) => s + d.value, 0);

  // running cumulative bounds
  let run = 0;
  const segs = steps.map((d) => {
    const from = run; run += d.value; return { ...d, from, to: run };
  });
  const ymax = total * 1.12;

  // columns: N steps (+ optional total)
  const cols = sc + (p.showTotal ? 1 : 0);
  const plotW = VW - M.l - M.r;
  const plotH = VH - M.t - M.b;
  const slot = plotW / cols;
  const bw = Math.min(slot * 0.6, 170);
  const cx = (i) => M.l + slot * (i + 0.5);
  const y = (v) => M.t + plotH * (1 - v / ymax);
  const baseY = VH - M.b;

  return (
    <div className="aic-wf" style={vars}>
      {p.showDecorations && <div className="wf-glow" />}

      <div className="wf-head">
        <div>
          <p className="wf-eyebrow">{copy.eyebrow}</p>
          <h2 className="wf-title">{copy.title}</h2>
        </div>
        <div className="wf-sub">{copy.sub}</div>
      </div>

      <div className="wf-meta">
        <p className="wf-lead">{copy.lead}</p>
        {p.showTotal && (
          <div className="wf-total">
            <div className="wf-total-v">{total}</div>
            <div className="wf-total-l">{copy.totalLabel} · {copy.totalUnit}</div>
          </div>
        )}
      </div>

      <div className="wf-chart">
        <p className="wf-chart-t">{copy.chartLabel}</p>
        <svg className="wf-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
          <line x1={M.l} y1={baseY} x2={VW - M.r} y2={baseY} stroke="var(--aic-hair-strong)" strokeWidth="1.5" />

          {/* connectors */}
          {p.showConnectors && segs.map((s, i) => {
            if (i === segs.length - 1 && !p.showTotal) return null;
            const x1 = cx(i) + bw / 2;
            const x2 = (i === segs.length - 1) ? cx(i + 1) - bw / 2 : cx(i + 1) - bw / 2;
            return (
              <line key={'c' + i} x1={x1} y1={y(s.to)} x2={x2} y2={y(s.to)}
                stroke="var(--aic-ink)" strokeWidth="1.6" strokeDasharray="3 6" opacity="0.4" />
            );
          })}

          {/* step bars */}
          {segs.map((s, i) => {
            const isF = p.focusEnabled && i === focus;
            const fill = isF ? 'var(--aic-accent)' : 'color-mix(in srgb, var(--aic-accent) 38%, var(--aic-card))';
            return (
              <g key={i}>
                <rect x={cx(i) - bw / 2} y={y(s.to)} width={bw} height={y(s.from) - y(s.to)}
                  rx="8" fill={fill} stroke={isF ? 'var(--aic-accent-deep)' : 'var(--aic-hair-strong)'} strokeWidth="1.5" />
                {p.showValues && (
                  <text x={cx(i)} y={y(s.to) - 16} textAnchor="middle"
                    style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 30, fill: 'var(--aic-ink)' }}>+{s.value}</text>
                )}
                <text x={cx(i)} y={baseY + 30} textAnchor="middle"
                  style={{ fontFamily: 'var(--aic-font-text)', fontWeight: isF ? 700 : 600, fontSize: 24,
                    fill: isF ? 'var(--aic-ink)' : 'var(--aic-ink-dim)' }}>{s.name}</text>
                <text x={cx(i)} y={baseY + 56} textAnchor="middle"
                  style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 500, fontSize: 17, fill: 'var(--aic-faint)' }}>{s.note}</text>
              </g>
            );
          })}

          {/* total column */}
          {p.showTotal && (
            <g>
              <rect x={cx(sc) - bw / 2} y={y(total)} width={bw} height={baseY - y(total)}
                rx="8" fill="var(--aic-accent)" />
              <text x={cx(sc)} y={y(total) - 16} textAnchor="middle"
                style={{ fontFamily: 'var(--aic-font-display)', fontWeight: 700, fontSize: 34, fill: 'var(--aic-ink)' }}>{total}</text>
              <text x={cx(sc)} y={baseY + 30} textAnchor="middle"
                style={{ fontFamily: 'var(--aic-font-text)', fontWeight: 700, fontSize: 24, fill: 'var(--aic-ink)' }}>{copy.totalLabel}</text>
            </g>
          )}
        </svg>
      </div>

      <div className="wf-foot">
        <div className="wf-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="wf-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
