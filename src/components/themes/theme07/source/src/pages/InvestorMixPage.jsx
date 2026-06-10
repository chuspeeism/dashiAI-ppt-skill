/**
 * InvestorMixPage — P52 资本来源结构 (Investor Mix · Donut + Timeline)
 *
 * A capital-source slide pairing an investor-type chart (donut or bars) with a
 * horizontal evolution timeline showing how AI funding shifted from pure-VC
 * deals to mixed industrial capital. Chart type, segment count, the focus
 * segment, the legend, the evolution timeline and its node count are all
 * prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-imx`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (Donut, BarRow, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, BarRow, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Investor Mix',
  title: '资本来源结构',
  titleTail: '投资人类型分布',
  sub: '投资人类型分布',
  marker: '投资人类型',
  lead: '传统 VC、企业战略投资者、成长基金和云厂商共同推动 AI 大额融资；AI 融资已经从纯 VC 交易转向产业资本混合交易。',
  closing: '钱的来源本身也是产业结构信号。',
  panelTitle: '投资人类型占比',
  timelineLabel: '资本来源演进 · 2020 — 2024',
  // investor segments (order fixed; count is prop-driven; value is percent)
  segments: [
    { label: '传统 VC', value: 42, note: '经典风险投资基金' },
    { label: '企业战略', value: 27, note: '产业方战略投资者' },
    { label: '成长基金', value: 18, note: '后期成长与跨界基金' },
    { label: '云厂商相关', value: 13, note: '云厂商及关联资本' },
  ],
  // capital-source evolution nodes
  nodes: [
    { year: '2020 — 22', title: 'VC 主导', note: '经典风险投资定义估值锚' },
    { year: '2023', title: '战略资本进入', note: '大厂与产业方开始战略持股' },
    { year: '2024', title: '产业资本混合', note: 'VC 与产业资本共同主导大额轮' },
  ],
};

// segment fills — leading segments in accent shades, trailing in neutral
const SEG_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 60%, white)',
  'color-mix(in srgb, var(--aic-accent) 38%, white)',
  'var(--aic-hair-strong)',
];

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  chartType: 'donut',     // 'donut' | 'bars'
  segmentCount: 4,        // investor types (2–4)
  focusEnabled: true,     // highlight one segment
  focusIndex: 0,          // which segment is the focus (0-based)
  showLegend: true,       // legend list (donut mode)
  showTimeline: true,     // capital-source evolution timeline
  nodeCount: 3,           // timeline node count (2–3)
  showDecorations: true,  // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'donut',
    options: [{ value: 'donut', label: '环形图' }, { value: 'bars', label: '占比条' }],
    description: '投资人类型占比图表样式：环形图 / 占比条。' },
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '投资人类型分段数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一类投资人作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的投资人类型。', showWhen: (p) => p.focusEnabled },
  { key: 'showLegend', label: '图例', type: 'toggle', default: true,
    description: '环形图右侧图例列表的显隐。', showWhen: (p) => p.chartType === 'donut' },
  { key: 'showTimeline', label: '阶段时间轴', type: 'toggle', default: true,
    description: '底部资本来源演进时间轴的显隐。' },
  { key: 'nodeCount', label: '节点数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '时间轴上的阶段节点数量（2–3）。', showWhen: (p) => p.showTimeline },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于图表、高亮投资人类型与时间轴节点。' },
];

const CSS = `
.aic-imx { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-imx, .aic-imx * { box-sizing: border-box; }
.aic-imx .im-glow { position: absolute; left: 12%; top: -8%; width: 48%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-imx .im-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-imx .im-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-imx .im-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-imx .im-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-imx .im-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-imx .im-main { position: absolute; left: var(--pad); right: var(--pad); top: 304px;
  display: grid; grid-template-columns: 1.16fr 0.84fr; gap: 64px; }

/* chart (left) */
.aic-imx .im-chartwrap { display: flex; flex-direction: column; min-width: 0; }
.aic-imx .im-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }
.aic-imx .im-chart { display: flex; align-items: center; gap: 52px; min-height: 0; }
.aic-imx .im-donut { flex: none; }
.aic-imx .im-legend { flex: 1; display: flex; flex-direction: column; gap: 20px; }
.aic-imx .im-leg { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
  padding-bottom: 16px; border-bottom: 1.5px solid var(--aic-hair); transition: opacity .3s; }
.aic-imx .im-leg:last-child { border-bottom: none; }
.aic-imx .im-leg i { width: 18px; height: 18px; border-radius: 5px; flex: none; }
.aic-imx .im-leg-lbl { display: flex; flex-direction: column; gap: 2px; }
.aic-imx .im-leg-lbl b { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); }
.aic-imx .im-leg-lbl span { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted); }
.aic-imx .im-leg-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 34px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-imx .im-leg[data-focus="1"] .im-leg-v { color: var(--aic-accent-deep); }
.aic-imx .im-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 28px; padding-right: 12px; }

/* content (right) */
.aic-imx .im-side { display: flex; flex-direction: column; padding-top: 6px; }
.aic-imx .im-marker { display: flex; align-items: center; gap: 16px; }
.aic-imx .im-marker b { width: 52px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-imx .im-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-imx .im-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 0; text-wrap: pretty; }

/* evolution timeline (bottom, full width) */
.aic-imx .im-tl { position: absolute; left: var(--pad); right: var(--pad); bottom: 124px; }
.aic-imx .im-tl-cap { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 26px; }
.aic-imx .im-tl-track { position: relative; height: 2px; background: var(--aic-hair-strong); }
.aic-imx .im-tl-track::after { content: ''; position: absolute; right: -2px; top: -5px; border: 6px solid transparent;
  border-left-color: var(--aic-ink); }
.aic-imx .im-tl-nodes { display: grid; }
.aic-imx .im-tl-node { position: relative; padding-top: 30px; }
.aic-imx .im-tl-node::before { content: ''; position: absolute; top: -7px; left: 0; width: 16px; height: 16px;
  border-radius: 50%; background: var(--aic-paper); border: 4px solid var(--aic-accent); }
.aic-imx .im-tl-year { font-family: var(--aic-font-display); font-weight: 700; font-size: 28px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-imx .im-tl-ttl { font-family: var(--aic-font-text); font-weight: 700; font-size: 25px; color: var(--aic-ink); margin: 8px 0 4px; }
.aic-imx .im-tl-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 20px; color: var(--aic-muted); line-height: 1.35; max-width: 400px; }

.aic-imx .im-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-imx .im-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-imx .im-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-imx .im-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','pos','warn','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function InvestorMixPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-imx', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(copy.segments.length, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));
  const donutSegs = segs.map((s, i) => ({ value: s.value, color: SEG_FILL[i % SEG_FILL.length], label: s.label }));
  const focusSeg = segs[focus];

  const nNodes = Math.max(2, Math.min(copy.nodes.length, p.nodeCount));
  const nodes = copy.nodes.slice(0, nNodes);

  return (
    <div className="aic-imx" style={vars}>
      {p.showDecorations && <div className="im-glow" />}

      <div className="im-head">
        <div>
          <p className="im-eyebrow">{copy.eyebrow}</p>
          <h2 className="im-title">{copy.title}<em>· {copy.titleTail}</em></h2>
        </div>
        <div className="im-sub">{copy.sub}</div>
      </div>

      <div className="im-main" style={{ bottom: p.showTimeline ? 326 : 150 }}>
        <div className="im-chartwrap">
          <p className="im-panel-t">{copy.panelTitle}</p>
          {p.chartType === 'donut' ? (
            <div className="im-chart">
              <div className="im-donut">
                <Donut segments={donutSegs} size={300} thickness={50}
                  focusIndex={p.focusEnabled ? focus : -1}
                  centerTop={p.focusEnabled ? focusSeg.value + '%' : segN}
                  centerBottom={p.focusEnabled ? focusSeg.label : '投资人类型'} />
              </div>
              {p.showLegend && (
                <div className="im-legend">
                  {segs.map((s, i) => (
                    <div className="im-leg" key={s.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                      style={{ opacity: p.focusEnabled && i !== focus ? 0.55 : 1 }}>
                      <i style={{ background: SEG_FILL[i % SEG_FILL.length] }} />
                      <div className="im-leg-lbl"><b>{s.label}</b><span>{s.note}</span></div>
                      <div className="im-leg-v">{s.value}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="im-bars">
              {segs.map((s, i) => (
                <BarRow key={s.label} label={s.label} display={s.value + '%'}
                  value={s.value / maxV * 100}
                  color={SEG_FILL[i % SEG_FILL.length]}
                  focus={p.focusEnabled && i === focus}
                  dim={p.focusEnabled && i !== focus} />
              ))}
            </div>
          )}
        </div>

        <div className="im-side">
          <div className="im-marker"><b /><span>{copy.marker}</span></div>
          <p className="im-lead">{copy.lead}</p>
        </div>
      </div>

      {p.showTimeline && (
        <div className="im-tl">
          <p className="im-tl-cap">{copy.timelineLabel}</p>
          <div className="im-tl-track" />
          <div className="im-tl-nodes" style={{ gridTemplateColumns: `repeat(${nNodes}, 1fr)` }}>
            {nodes.map((nd) => (
              <div className="im-tl-node" key={nd.year}>
                <span className="im-tl-year">{nd.year}</span>
                <div className="im-tl-ttl">{nd.title}</div>
                <div className="im-tl-note">{nd.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="im-foot">
        <div className="im-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="im-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
