/**
 * DealStructurePage — P51 复杂交易结构 (Undisclosed Mega Rounds · Deal Structure)
 *
 * A deal-structure decomposition slide: a left anchor rail (event count +
 * average ticket) beside a right decomposition of what a typical undisclosed
 * mega-round is made of — shown as a stacked composition bar or a donut, with
 * component cards underneath. Component count, chart type, the anchor stats,
 * the focus component and decorations are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-ds`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (Donut, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Undisclosed Mega Rounds',
  title: '复杂交易结构',
  titleTail: '未披露巨额轮次',
  sub: '未披露巨额轮次',
  lead: '未披露轮次常对应战略投资、债务组合或云资源置换；不披露不代表信息不足，而是交易结构更复杂。',
  closing: 'AI 融资越来越像资源组合交易。',
  panelTitle: '单笔交易结构拆解 · 构成占比',
  stats: [
    { value: '22', unit: '笔', label: '未披露巨额轮次' },
    { value: '18.6', unit: '亿美元', label: '平均单笔规模' },
  ],
  // structure components (order fixed; count is prop-driven; pct sums to 100)
  components: [
    { name: '云资源置换', en: 'Cloud Credits', pct: 39, note: '以算力额度换取股权或优先供给' },
    { name: '战略投资', en: 'Strategic', pct: 31, note: '产业方与大厂的战略持股' },
    { name: '债务组合', en: 'Debt / Convertible', pct: 18, note: '债务与可转债等结构化融资' },
    { name: '纯股权', en: 'Pure Equity', pct: 12, note: '传统现金对价的股权部分' },
  ],
};

// component fills — leading parts in accent shades, trailing in neutral
const SEG_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 60%, white)',
  'color-mix(in srgb, var(--aic-accent) 38%, white)',
  'var(--aic-hair-strong)',
];

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  componentCount: 4,      // structure components (2–4)
  chartType: 'stack',     // 'stack' | 'donut'
  showStats: true,        // left anchor stat rail
  focusEnabled: true,     // highlight one component
  focusIndex: 0,          // which component is the focus (0-based)
  showDecorations: true,  // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'componentCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '交易结构构成项数量（2–4）。' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'stack',
    options: [{ value: 'stack', label: '堆叠条' }, { value: 'donut', label: '环形图' }],
    description: '构成占比图表样式：堆叠条 / 环形图。' },
  { key: 'showStats', label: '锚点指标', type: 'toggle', default: true,
    description: '左侧事件数与平均单笔锚点指标的显隐。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个构成项作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的构成项。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于图表、锚点数字与高亮构成项。' },
];

const CSS = `
.aic-ds { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-ds, .aic-ds * { box-sizing: border-box; }
.aic-ds .ds-glow { position: absolute; right: -6%; top: -8%; width: 52%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-ds .ds-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-ds .ds-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-ds .ds-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-ds .ds-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-ds .ds-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-ds .ds-lead { position: absolute; left: var(--pad); top: 290px; width: 1500px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.5; color: var(--aic-ink); margin: 0; }

.aic-ds .ds-body { position: absolute; left: var(--pad); right: var(--pad); top: 432px; bottom: 150px;
  display: grid; gap: 72px; align-items: stretch; }

/* left anchor rail */
.aic-ds .ds-rail { display: flex; flex-direction: column; justify-content: center; gap: 36px; }
.aic-ds .ds-stat { display: flex; flex-direction: column; gap: 8px; }
.aic-ds .ds-stat-v { font-family: var(--aic-font-display); font-weight: 700; line-height: .82; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; display: inline-flex; align-items: baseline; }
.aic-ds .ds-stat-v b { font-size: 120px; }
.aic-ds .ds-stat-v u { text-decoration: none; font-family: var(--aic-font-text); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); margin-left: 12px; transform: skewX(9deg); }
.aic-ds .ds-stat-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 23px; color: var(--aic-muted); }
.aic-ds .ds-stat + .ds-stat { padding-top: 34px; border-top: 1.5px solid var(--aic-hair); }

/* right decomposition */
.aic-ds .ds-decomp { display: flex; flex-direction: column; min-width: 0; }
.aic-ds .ds-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }

/* stacked composition bar */
.aic-ds .ds-stack { display: flex; width: 100%; height: 116px; border-radius: 18px; overflow: hidden; gap: 4px; }
.aic-ds .ds-seg { position: relative; display: flex; flex-direction: column; justify-content: center; padding: 0 24px;
  min-width: 0; transition: opacity .3s, flex-basis .4s cubic-bezier(.3,.7,.4,1); }
.aic-ds .ds-seg:first-child { border-radius: 18px 6px 6px 18px; }
.aic-ds .ds-seg:last-child { border-radius: 6px 18px 18px 6px; }
.aic-ds .ds-seg-pct { font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; line-height: 1;
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; }
.aic-ds .ds-seg-nm { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; margin-top: 6px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; }

/* donut mode */
.aic-ds .ds-donutwrap { display: flex; align-items: center; gap: 48px; }
.aic-ds .ds-donut { flex: none; }

/* component cards */
.aic-ds .ds-cards { margin-top: 40px; display: grid; gap: 20px; flex: 1; min-height: 0; }
.aic-ds .ds-card { position: relative; border-radius: 20px; padding: 26px 28px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); display: flex; flex-direction: column; justify-content: space-between; gap: 14px;
  transition: border-color .3s, box-shadow .3s, transform .3s; overflow: hidden; }
.aic-ds .ds-card[data-focus="1"] { transform: translateY(-6px); border-color: var(--aic-accent);
  box-shadow: 0 24px 56px -30px color-mix(in srgb, var(--aic-accent) 60%, transparent); }
.aic-ds .ds-card-top { display: flex; align-items: center; gap: 14px; }
.aic-ds .ds-card-swatch { width: 18px; height: 18px; border-radius: 6px; flex: none; }
.aic-ds .ds-card-nm { font-family: var(--aic-font-text); font-weight: 700; font-size: 27px; color: var(--aic-ink); }
.aic-ds .ds-card-en { font-family: var(--aic-font-display); font-weight: 500; font-size: 15px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-faint); margin-left: auto; white-space: nowrap; }
.aic-ds .ds-card-pct { font-family: var(--aic-font-display); font-weight: 700; font-size: 58px; line-height: .85; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-ds .ds-card[data-focus="1"] .ds-card-pct { color: var(--aic-accent-deep); }
.aic-ds .ds-card-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 20px; line-height: 1.4; color: var(--aic-muted); }

.aic-ds .ds-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-ds .ds-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-ds .ds-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-ds .ds-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','pos','warn','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function DealStructurePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-ds', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(copy.components.length, p.componentCount));
  const comps = copy.components.slice(0, n);
  const total = comps.reduce((s, c) => s + c.pct, 0) || 1;
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const isDonut = p.chartType === 'donut';

  const bodyCols = p.showStats ? '0.74fr 1.26fr' : '1fr';
  const cardCols = `repeat(${Math.min(n, 4)}, 1fr)`;
  const donutSegs = comps.map((c, i) => ({ value: c.pct, color: SEG_FILL[i % SEG_FILL.length], label: c.name }));
  const focusComp = comps[focus];

  return (
    <div className="aic-ds" style={vars}>
      {p.showDecorations && <div className="ds-glow" />}

      <div className="ds-head">
        <div>
          <p className="ds-eyebrow">{copy.eyebrow}</p>
          <h2 className="ds-title">{copy.title}<em>· {copy.titleTail}</em></h2>
        </div>
        <div className="ds-sub">{copy.sub}</div>
      </div>

      <p className="ds-lead">{copy.lead}</p>

      <div className="ds-body" style={{ gridTemplateColumns: bodyCols }}>
        {p.showStats && (
          <div className="ds-rail">
            {copy.stats.map((s) => (
              <div className="ds-stat" key={s.label}>
                <span className="ds-stat-v"><b>{s.value}</b><u>{s.unit}</u></span>
                <span className="ds-stat-l">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="ds-decomp">
          <p className="ds-panel-t">{copy.panelTitle}</p>

          {isDonut ? (
            <div className="ds-donutwrap">
              <div className="ds-donut">
                <Donut segments={donutSegs} size={300} thickness={52}
                  focusIndex={p.focusEnabled ? focus : -1}
                  centerTop={p.focusEnabled ? focusComp.pct + '%' : n}
                  centerBottom={p.focusEnabled ? focusComp.name : '构成项'} />
              </div>
              <div style={{ flex: 1 }} />
            </div>
          ) : (
            <div className="ds-stack">
              {comps.map((c, i) => {
                const dim = p.focusEnabled && i !== focus;
                const dark = i === 0; // accent segment → ink text
                return (
                  <div className="ds-seg" key={c.name}
                    style={{ flex: `${(c.pct / total) * 100} 1 0`,
                      background: SEG_FILL[i % SEG_FILL.length],
                      opacity: dim ? 0.5 : 1,
                      color: i < 2 ? 'var(--aic-ink)' : 'var(--aic-ink-dim)' }}>
                    <span className="ds-seg-pct">{c.pct}%</span>
                    <span className="ds-seg-nm">{c.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="ds-cards" style={{ gridTemplateColumns: cardCols }}>
            {comps.map((c, i) => (
              <div className="ds-card" key={c.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                <div className="ds-card-top">
                  <span className="ds-card-swatch" style={{ background: SEG_FILL[i % SEG_FILL.length] }} />
                  <span className="ds-card-nm">{c.name}</span>
                  <span className="ds-card-en">{c.en}</span>
                </div>
                <span className="ds-card-pct">{c.pct}%</span>
                <p className="ds-card-note">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-foot">
        <div className="ds-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ds-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
