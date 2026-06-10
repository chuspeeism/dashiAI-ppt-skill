/**
 * EarlyStagePage — P50 新主题萌芽 (Early Stage Signal · Table-led)
 *
 * A round-structure table for early-stage rounds: round / events / amount, an
 * average-ticket "bubble" column (the 早期轮气泡图 motif) and emerging-theme
 * tags. A large anchor highlights the early-round share of all events. Row
 * count, the bubble column, the theme-tag column, the signal column and the
 * focus row are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-es`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Early Stage Signal',
  marker: 'Seed → B',
  season: '早期轮 · 主题萌芽',
  title: '新主题萌芽',
  titleTail: '早期轮信号',
  lead: 'Seed 和 A 轮金额较小，但代表新主题正在形成；早期机会集中在 Agent、安全、具身智能和行业专用模型。',
  statLine: '种子轮 8 笔 / 1.2 亿美元 · A 轮 12 笔 / 1.8 亿美元',
  anchorValue: '20.6%',
  anchorLabel: '早期轮占全年事件数',
  closing: '小金额交易往往藏着下一轮主题。',
  colHeads: { dim: '轮次', events: '事件数', amount: '融资额', bubble: '平均单笔', themes: '萌芽主题', note: '信号' },
  // table rows (order fixed; count is prop-driven). avg drives bubble size.
  rows: [
    { dim: '种子轮', en: 'Seed', events: '8', amount: '1.2', avg: 0.15, themes: ['Agent', '安全'], note: '主题验证期' },
    { dim: 'A 轮', en: 'Series A', events: '12', amount: '1.8', avg: 0.15, themes: ['具身智能', '行业模型'], note: '场景打磨期' },
    { dim: 'B 轮', en: 'Series B', events: '6', amount: '3.4', avg: 0.57, themes: ['企业应用', '数据闭环'], note: '规模化前夜' },
    { dim: '早期战略', en: 'Strategic', events: '4', amount: '2.1', avg: 0.53, themes: ['云资源', '平台卡位'], note: '生态绑定' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  rowCount: 4,           // table rows shown (3–4)
  showBubble: true,      // average-ticket bubble column (气泡图)
  showThemes: true,      // emerging-theme tag column
  showSignal: true,      // signal/judgment column
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'rowCount', label: '行数量', type: 'slider', default: 4, min: 3, max: 4, step: 1,
    description: '表格展示的轮次行数量（3–4）。' },
  { key: 'showBubble', label: '气泡列', type: 'toggle', default: true,
    description: '平均单笔气泡列（气泡大小=平均单笔规模）的显隐。' },
  { key: 'showThemes', label: '主题标签列', type: 'toggle', default: true,
    description: '萌芽主题标签列的显隐。' },
  { key: 'showSignal', label: '信号列', type: 'toggle', default: true,
    description: '信号判断列的显隐；关闭后表格更紧凑。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一行作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 行' }, { value: 1, label: '第 2 行' },
      { value: 2, label: '第 3 行' }, { value: 3, label: '第 4 行' }],
    description: '选择被高亮的行。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于轮次标记、气泡、高亮行与锚点数字。' },
];

const CSS = `
.aic-es { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-es, .aic-es * { box-sizing: border-box; }
.aic-es .es-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-es .es-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-es .es-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-es .es-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-es .es-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-es .es-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: marker + lead (left) · anchor share (right) */
.aic-es .es-meta { position: absolute; left: var(--pad); right: var(--pad); top: 296px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 60px; }
.aic-es .es-meta-l { max-width: 1200px; }
.aic-es .es-marker { display: flex; align-items: baseline; gap: 18px; }
.aic-es .es-marker b { font-family: var(--aic-font-display); font-weight: 700; font-size: 60px; line-height: .8;
  color: var(--aic-accent); transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-es .es-season { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-es .es-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 26px 0 14px; width: 1395px; }
.aic-es .es-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-es .es-anchor { flex: none; text-align: right; }
.aic-es .es-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 96px; line-height: .82;
  color: var(--aic-accent); font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: right bottom; display: inline-block; }
.aic-es .es-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-muted); margin-top: 12px; }

/* table */
.aic-es .es-table { position: absolute; left: var(--pad); right: var(--pad); top: 532px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-es .es-thead { display: grid; align-items: center; gap: 0 28px; padding: 0 28px 16px;
  border-bottom: 2px solid var(--aic-ink); }
.aic-es .es-th { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-es .es-th.r { text-align: right; }
.aic-es .es-th.c { text-align: center; }
.aic-es .es-tbody { flex: 1; display: flex; flex-direction: column; }
.aic-es .es-row { flex: 1; display: grid; align-items: center; gap: 0 28px; padding: 0 28px;
  border-bottom: 1.5px solid var(--aic-hair); border-radius: 16px; transition: background .3s, transform .3s; }
.aic-es .es-row:last-child { border-bottom: none; }
.aic-es .es-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-es .es-dim { display: flex; align-items: baseline; gap: 16px; }
.aic-es .es-dim .dot { width: 12px; height: 12px; border-radius: 3px; background: var(--aic-hair-strong); flex: none; align-self: center; }
.aic-es .es-row[data-focus="1"] .es-dim .dot { background: var(--aic-accent); }
.aic-es .es-dim b { font-family: var(--aic-font-display); font-weight: 700; font-size: 33px; color: var(--aic-ink); white-space: nowrap; }
.aic-es .es-dim em { font-style: normal; font-family: var(--aic-font-display); font-weight: 500; font-size: 16px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--aic-faint); }
.aic-es .es-val { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 36px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-es .es-val u { text-decoration: none; font-size: 17px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-es .es-bubble { display: flex; align-items: center; justify-content: center; }
.aic-es .es-disc { border-radius: 50%; background: color-mix(in srgb, var(--aic-accent) 30%, var(--aic-card));
  border: 2px solid color-mix(in srgb, var(--aic-accent) 55%, var(--aic-card)); display: grid; place-items: center; }
.aic-es .es-row[data-focus="1"] .es-disc { background: var(--aic-accent); border-color: var(--aic-accent-deep); }
.aic-es .es-disc span { font-family: var(--aic-font-display); font-weight: 700; font-size: 18px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-es .es-themes { display: flex; flex-wrap: wrap; gap: 10px; }
.aic-es .es-chip { font-family: var(--aic-font-text); font-weight: 600; font-size: 20px; color: var(--aic-ink-dim);
  padding: 7px 17px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); white-space: nowrap; }
.aic-es .es-row[data-focus="1"] .es-chip { border-color: var(--aic-accent-deep); color: var(--aic-ink); }
.aic-es .es-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 23px; color: var(--aic-ink-dim); }

.aic-es .es-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-es .es-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-es .es-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-es .es-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','pos','warn','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function EarlyStagePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-es', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxAvg = Math.max(...rows.map((r) => r.avg));

  // column template adapts to which optional columns are shown
  const cols = ['minmax(280px, 1.1fr)', '150px', '180px'];
  if (p.showBubble) cols.push('150px');
  if (p.showThemes) cols.push('1.5fr');
  if (p.showSignal) cols.push('minmax(220px, 1fr)');
  const gridCols = cols.join(' ');

  return (
    <div className="aic-es" style={vars}>
      {p.showDecorations && <div className="es-glow" />}

      <div className="es-head">
        <div>
          <p className="es-eyebrow">{copy.eyebrow}</p>
          <h2 className="es-title">{copy.title}<em>{copy.titleTail}</em></h2>
        </div>
        <div className="es-sub">{copy.season}</div>
      </div>

      <div className="es-meta">
        <div className="es-meta-l">
          <div className="es-marker">
            <b>{copy.marker}</b>
            <span className="es-season">{copy.season}</span>
          </div>
          <p className="es-lead">{copy.lead}</p>
          <div className="es-statline">{copy.statLine}</div>
        </div>
        <div className="es-anchor">
          <div className="es-anchor-v">{copy.anchorValue}</div>
          <div className="es-anchor-l">{copy.anchorLabel}</div>
        </div>
      </div>

      <div className="es-table">
        <div className="es-thead" style={{ gridTemplateColumns: gridCols }}>
          <div className="es-th">{copy.colHeads.dim}</div>
          <div className="es-th r">{copy.colHeads.events}</div>
          <div className="es-th r">{copy.colHeads.amount}</div>
          {p.showBubble && <div className="es-th c">{copy.colHeads.bubble}</div>}
          {p.showThemes && <div className="es-th">{copy.colHeads.themes}</div>}
          {p.showSignal && <div className="es-th">{copy.colHeads.note}</div>}
        </div>
        <div className="es-tbody">
          {rows.map((r, i) => {
            const disc = 36 + (r.avg / maxAvg) * 38; // 36–74px by avg ticket
            return (
              <div className="es-row" key={r.dim} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                style={{ gridTemplateColumns: gridCols }}>
                <div className="es-dim"><span className="dot" /><b>{r.dim}</b><em>{r.en}</em></div>
                <div className="es-val">{r.events}<u>笔</u></div>
                <div className="es-val">{r.amount}<u>亿</u></div>
                {p.showBubble && (
                  <div className="es-bubble">
                    <div className="es-disc" style={{ width: disc, height: disc }}><span>{r.avg}</span></div>
                  </div>
                )}
                {p.showThemes && (
                  <div className="es-themes">
                    {r.themes.map((t) => <span className="es-chip" key={t}>{t}</span>)}
                  </div>
                )}
                {p.showSignal && <div className="es-note">{r.note}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="es-foot">
        <div className="es-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="es-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
