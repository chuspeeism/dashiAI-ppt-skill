/**
 * DealSizePage — P23 金额区间结构 (Deal Size Split · Chart-led)
 *
 * A dual-metric chart: each deal-size band is read on two axes — deal count
 * (left, neutral) and funding amount (right, accent) — so the divergence
 * between "where the deals are" and "where the money is" becomes the story.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-dz`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Deal Size Split',
  title: '金额区间结构',
  sub: '交易规模分布',
  lead: '大额融资内部仍有层级，低金额段贡献数量，高金额段贡献市场记忆。',
  closing: '市场被少数超级交易重新定价。',
  countLabel: '交易数量 / 笔',
  amountLabel: '融资金额 / 亿美元',
  // bands (order fixed; count is prop-driven)
  rows: [
    { band: '1 — 2 亿美元', count: 41, amount: 58 },
    { band: '2 — 5 亿美元', count: 29, amount: 91 },
    { band: '5 — 10 亿美元', count: 15, amount: 103 },
    { band: '10 亿美元以上', count: 12, amount: 718 },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  rowCount: 4,           // size bands shown (3–4)
  metricMode: 'both',    // 'both' | 'count' | 'amount' — which axes to show
  showValues: true,      // numeric value labels on bars
  focusEnabled: true,    // emphasise one band
  focusIndex: 3,         // which band is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'rowCount', label: '行数量', type: 'slider', default: 4, min: 3, max: 4, step: 1,
    description: '金额区间分组数量（3–4）。' },
  { key: 'metricMode', label: '图表类型', type: 'radio', default: 'both',
    options: [{ value: 'both', label: '双维' }, { value: 'count', label: '仅数量' }, { value: 'amount', label: '仅金额' }],
    description: '展示维度：数量 + 金额对照 / 仅数量 / 仅金额。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '条形末端数值标签的显隐。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个金额区间作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 3,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的区间。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于金额条与高亮区间。' },
];

const CSS = `
.aic-dz { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-dz, .aic-dz * { box-sizing: border-box; }
.aic-dz .dz-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 54%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-dz .dz-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-dz .dz-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-dz .dz-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-dz .dz-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

.aic-dz .dz-lead { position: absolute; left: var(--pad); right: var(--pad); top: 300px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.45; color: var(--aic-ink);
  max-width: 1300px; margin: 0; }
.aic-dz .dz-lead b { color: var(--aic-accent-deep); font-weight: 700; }

/* dual-axis legend */
.aic-dz .dz-legend { position: absolute; left: var(--pad); right: var(--pad); top: 412px;
  display: flex; align-items: center; gap: 38px; }
.aic-dz .dz-leg { display: flex; align-items: center; gap: 11px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 20px; color: var(--aic-muted); }
.aic-dz .dz-leg i { width: 18px; height: 18px; border-radius: 5px; }

/* rows */
.aic-dz .dz-rows { position: absolute; left: var(--pad); right: var(--pad); top: 470px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-dz .dz-row { flex: 1; display: grid; grid-template-columns: 320px 1fr; align-items: center; gap: 40px;
  border-top: 1.5px solid var(--aic-hair); }
.aic-dz .dz-row:last-child { border-bottom: 1.5px solid var(--aic-hair); }
.aic-dz .dz-band { display: flex; align-items: center; gap: 16px; }
.aic-dz .dz-band .dot { width: 13px; height: 13px; border-radius: 4px; background: var(--aic-hair-strong); flex: none; }
.aic-dz .dz-row[data-focus="1"] .dz-band .dot { background: var(--aic-accent); }
.aic-dz .dz-band b { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); white-space: nowrap; }
.aic-dz .dz-bars { display: flex; flex-direction: column; gap: 14px; }
.aic-dz .dz-bar { display: grid; grid-template-columns: 86px 1fr auto; align-items: center; gap: 18px; }
.aic-dz .dz-bar-cap { font-family: var(--aic-font-text); font-weight: 600; font-size: 17px; color: var(--aic-faint);
  text-align: right; letter-spacing: .04em; }
.aic-dz .dz-bar-track { height: 26px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-dz .dz-bar-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.3,.7,.4,1); }
.aic-dz .dz-bar-fill.count { background: var(--aic-ink); }
.aic-dz .dz-bar-fill.amount { background: color-mix(in srgb, var(--aic-accent) 55%, var(--aic-card)); }
.aic-dz .dz-row[data-focus="1"] .dz-bar-fill.amount { background: var(--aic-accent); }
.aic-dz .dz-bar-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; min-width: 76px; }
.aic-dz .dz-bar-val u { text-decoration: none; font-size: 16px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }

.aic-dz .dz-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-dz .dz-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-dz .dz-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-dz .dz-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','pos','accent','warn','pos','accent','pos','pos',
  'warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function DealSizePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-dz', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  const maxCount = Math.max(...rows.map((r) => r.count));
  const maxAmount = Math.max(...rows.map((r) => r.amount));
  const showCount = p.metricMode === 'both' || p.metricMode === 'count';
  const showAmount = p.metricMode === 'both' || p.metricMode === 'amount';

  return (
    <div className="aic-dz" style={vars}>
      {p.showDecorations && <div className="dz-glow" />}

      <div className="dz-head">
        <div>
          <p className="dz-eyebrow">{copy.eyebrow}</p>
          <h2 className="dz-title">{copy.title}</h2>
        </div>
        <div className="dz-sub">{copy.sub}</div>
      </div>

      <p className="dz-lead">{copy.lead}</p>

      <div className="dz-legend">
        {showCount && <span className="dz-leg"><i style={{ background: 'var(--aic-ink)' }} />{copy.countLabel}</span>}
        {showAmount && <span className="dz-leg"><i style={{ background: 'var(--aic-accent)' }} />{copy.amountLabel}</span>}
      </div>

      <div className="dz-rows">
        {rows.map((r, i) => (
          <div className="dz-row" key={r.band} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
            <div className="dz-band"><span className="dot" /><b>{r.band}</b></div>
            <div className="dz-bars">
              {showCount && (
                <div className="dz-bar">
                  <div className="dz-bar-cap">数量</div>
                  <div className="dz-bar-track">
                    <div className="dz-bar-fill count" style={{ width: (r.count / maxCount) * 100 + '%' }} />
                  </div>
                  {p.showValues && <div className="dz-bar-val">{r.count}<u>笔</u></div>}
                </div>
              )}
              {showAmount && (
                <div className="dz-bar">
                  <div className="dz-bar-cap">金额</div>
                  <div className="dz-bar-track">
                    <div className="dz-bar-fill amount" style={{ width: (r.amount / maxAmount) * 100 + '%' }} />
                  </div>
                  {p.showValues && <div className="dz-bar-val">{r.amount}<u>亿</u></div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="dz-foot">
        <div className="dz-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="dz-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
