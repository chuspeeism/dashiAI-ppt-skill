/**
 * SummaryPage — P02 报告摘要 (Summary Dashboard)
 *
 * Prop-driven slide. Scoped under `.aic-sum`.
 * Shared deps: ./theme.js, ./viz.jsx (BarRow, Donut, ChangeBadge).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BarRow, Donut, BigNumber, HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Report Overview',
  title: '报告摘要',
  sub: '2024 全年 · 资本大年',
  lead: ['2024 年美国 AI 初创公司吸纳约 ', '970 亿美元', ' 风险投资，单笔 ≥ 1 亿美元的大额融资事件达 ', '97 笔', '。'],
  keywords: ['赢家通吃', 'AGI 叙事', '地理护城河', '估值泡沫', '退潮看兑现'],
  closing: '资本仍在涌入 AI，但下一阶段会从赌叙事转向看兑现。',
  chartTitle: '赛道融资占比',
  tracks: [
    { label: '通用大模型', pct: 43.3 },
    { label: '垂直应用', pct: 25.3 },
    { label: '基础设施', pct: 16.3 },
    { label: 'AI 芯片', pct: 10.0 },
    { label: '其他', pct: 5.1 },
  ],
  metrics: [
    { label: '全年融资', lead: '970', tail: '', unit: '亿美元' },
    { label: '大额事件', lead: '97', tail: '', unit: '笔' },
    { label: '平均单笔', lead: '10', tail: '', unit: '亿美元' },
    { label: '湾区占比', lead: '63', tail: '.9', unit: '%' },
  ],
};
const TRACK_COLORS = ['var(--aic-accent)', 'var(--aic-ink)', '#9AA08F', 'var(--aic-warn)', 'var(--aic-faint)'];

// per-card mini heat strips — decorative market texture (brand barcode motif)
const CARD_HEAT = [
  ['pos','pos','accent','pos','warn','pos','accent','pos','pos','warn','accent','pos','pos','neg','pos','accent'],
  ['pos','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos','accent','pos','pos'],
  ['warn','pos','accent','pos','neg','pos','warn','accent','pos','pos','accent','pos','warn','pos','accent','neg'],
  ['accent','pos','pos','accent','pos','warn','pos','accent','pos','neg','pos','accent','pos','pos','warn','accent'],
].map((row) => row.map((tone) => ({ tone })));

export const defaultProps = {
  ...COPY,
  cardCount: 4,
  focusEnabled: true,
  focusIndex: 0,
  chartType: 'bars', // 'bars' | 'donut'
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Report Overview' },
  { key: 'title', label: '标题', type: 'text', default: '报告摘要' },
  { key: 'sub', label: '次标题', type: 'text', default: '2024 全年 · 资本大年' },
  { key: 'closing', label: '结语', type: 'text', default: '资本仍在涌入 AI，但下一阶段会从赌叙事转向看兑现。' },
  { key: 'chartTitle', label: 'chartTitle', type: 'text', default: '赛道融资占比' },
  { key: 'cardCount', label: '指标卡数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '底部核心指标卡的数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮其中一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bars',
    options: [{ value: 'bars', label: '占比条' }, { value: 'donut', label: '环形图' }],
    description: '右侧赛道占比的呈现方式。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '关键词标签与背景光晕等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-sum { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink);
  font-family: var(--aic-font-text); --pad: 96px; }
.aic-sum, .aic-sum * { box-sizing: border-box; }
.aic-sum .sum-glow { position: absolute; right: -6%; top: -10%; width: 60%; height: 60%;
  pointer-events: none; background:
    radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 26%, transparent), transparent 70%); }

.aic-sum .sum-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 30px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-sum .sum-head-l { display: flex; align-items: flex-end; gap: 28px; }
.aic-sum .sum-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 26px; }
.aic-sum .sum-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px;
  line-height: .96; margin: 0; }
.aic-sum .sum-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); letter-spacing: .02em; padding-bottom: 10px; }

.aic-sum .sum-left { position: absolute; left: var(--pad); top: 300px; width: 940px; }
.aic-sum .sum-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 44px;
  line-height: 1.46; margin: 0; letter-spacing: .005em; }
.aic-sum .sum-lead em { font-style: normal; font-weight: 900; color: var(--aic-ink);
  background: linear-gradient(transparent 62%, color-mix(in srgb, var(--aic-accent) 55%, transparent) 0); }
.aic-sum .sum-chips { display: flex; flex-wrap: wrap; gap: 14px; margin: 46px 0 0; }
.aic-sum .sum-chip { font-family: var(--aic-font-text); font-weight: 600; font-size: 23px;
  color: var(--aic-ink-dim); padding: 10px 20px; border-radius: 999px;
  border: 1.5px solid var(--aic-hair-strong); }
.aic-sum .sum-closing { display: flex; align-items: center; gap: 16px; margin: 52px 0 0;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-sum .sum-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-sum .sum-right { position: absolute; right: var(--pad); top: 296px; width: 720px; }
.aic-sum .sum-chart-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 36px;
  display: flex; align-items: center; justify-content: space-between; }
.aic-sum .sum-chart-t span:last-child { color: var(--aic-faint); letter-spacing: .04em; }
.aic-sum .sum-donut-wrap { display: flex; align-items: center; gap: 48px; }
.aic-sum .sum-legend { display: flex; flex-direction: column; gap: 18px; }
.aic-sum .sum-leg { display: flex; align-items: center; gap: 14px; font-family: var(--aic-font-text);
  font-size: 24px; color: var(--aic-ink-dim); }
.aic-sum .sum-leg i { width: 16px; height: 16px; border-radius: 4px; flex: none; }
.aic-sum .sum-leg b { font-family: var(--aic-font-display); font-weight: 600; margin-left: auto;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }

.aic-sum .sum-metrics { position: absolute; left: var(--pad); right: var(--pad); bottom: 80px;
  display: grid; gap: 22px; }
.aic-sum .sum-card { position: relative; border-radius: 20px; padding: 28px 32px 26px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); min-height: 210px; display: flex; flex-direction: column;
  justify-content: space-between; gap: 14px; transition: background .3s, border-color .3s, transform .3s; }
.aic-sum .sum-card[data-focus="1"] { background: var(--aic-accent); border-color: var(--aic-accent);
  transform: translateY(-6px); }
.aic-sum .sum-card-lbl { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .1em; text-transform: uppercase; color: var(--aic-muted); }
.aic-sum .sum-card[data-focus="1"] .sum-card-lbl { color: rgba(14,17,11,.62); }
.aic-sum .sum-card-num { display: flex; align-items: baseline; }
.aic-sum .sum-card[data-focus="1"] .aic-viz-bignum { color: var(--aic-ink) !important; }
.aic-sum .sum-card[data-focus="1"] .aic-viz-bignum .tail { color: rgba(14,17,11,.45); }
.aic-sum .sum-card[data-focus="1"] .aic-viz-bignum .unit { color: rgba(14,17,11,.66); }
.aic-sum .sum-card-heat { height: 14px; }
`;

export default function SummaryPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, sub: p.sub !== undefined ? p.sub : COPY.sub, closing: p.closing !== undefined ? p.closing : COPY.closing, chartTitle: p.chartTitle !== undefined ? p.chartTitle : COPY.chartTitle, lead: p.lead !== undefined ? p.lead : COPY.lead, keywords: p.keywords !== undefined ? p.keywords : COPY.keywords, tracks: p.tracks !== undefined ? p.tracks : COPY.tracks, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-sum', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(4, p.cardCount));
  const metrics = copy.metrics.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxPct = Math.max(...copy.tracks.map((t) => t.pct));

  return (
    <div className="aic-sum" style={vars}>
      {p.showDecorations && <div className="sum-glow" />}

      <div className="sum-head">
        <div className="sum-head-l">
          <div>
            <p className="sum-eyebrow">{copy.eyebrow}</p>
            <h2 className="sum-title">{copy.title}</h2>
          </div>
        </div>
        <div className="sum-sub">{copy.sub}</div>
      </div>

      <div className="sum-left">
        <p className="sum-lead">
          {copy.lead[0]}<em>{copy.lead[1]}</em>{copy.lead[2]}<em>{copy.lead[3]}</em>{copy.lead[4]}
        </p>
        {p.showDecorations && (
          <div className="sum-chips">
            {copy.keywords.map((k) => <span className="sum-chip" key={k}>{k}</span>)}
          </div>
        )}
        <div className="sum-closing"><b />{copy.closing}</div>
      </div>

      <div className="sum-right">
        <p className="sum-chart-t"><span>{copy.chartTitle}</span><span>SHARE</span></p>
        {p.chartType === 'donut' ? (
          <div className="sum-donut-wrap">
            <Donut size={300} thickness={44}
              segments={copy.tracks.map((t, i) => ({ value: t.pct, color: TRACK_COLORS[i] }))}
              centerTop="970" centerBottom="亿美元 · 全年" />
            <div className="sum-legend">
              {copy.tracks.map((t, i) => (
                <div className="sum-leg" key={t.label}>
                  <i style={{ background: TRACK_COLORS[i] }} />{t.label}<b>{t.pct}%</b>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {copy.tracks.map((t, i) => (
              <BarRow key={t.label} label={t.label} display={t.pct + '%'}
                value={(t.pct / maxPct) * 100} color={TRACK_COLORS[i]}
                focus={i === 0} dim={i !== 0 && t.pct < 8} />
            ))}
          </div>
        )}
      </div>

      <div className="sum-metrics" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {metrics.map((m, i) => {
          const isFocus = p.focusEnabled && i === focus;
          return (
            <div className="sum-card" key={m.label} data-focus={isFocus ? '1' : '0'}>
              <div className="sum-card-lbl">{m.label}</div>
              <div className="sum-card-num">
                <BigNumber lead={m.lead} tail={m.tail} unit={m.unit} size={84} />
              </div>
              {p.showDecorations && (
                <div className="sum-card-heat">
                  <HeatStrip gap={3} data={CARD_HEAT[i % CARD_HEAT.length]} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
