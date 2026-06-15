/**
 * RankingPage — P10 Top 10 融资公司 (Top Funded Companies · Ranking Bars)
 *
 * Table/ranking slide: a horizontal ranking-bar list. Row count, how many top
 * rows are emphasized, and track color-coding are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-rank`.
 * Shared deps: ./theme.js, ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Top Funded Companies',
  title: 'Top 10 融资公司',
  sub: '头部玩家资金排名',
  lead: '头部公司融资额显著领先，通用大模型占据榜单上方位置。',
  note: '口径：以最大单笔融资计 · 单位 亿美元',
  closing: '头部融资规模既反映技术叙事，也反映资源绑定能力。',
  companies: [
    { name: 'OpenAI', amount: 66, track: '通用大模型' },
    { name: 'Anthropic', amount: 65, track: '通用大模型' },
    { name: 'xAI', amount: 50, track: '通用大模型' },
    { name: 'CoreWeave', amount: 11, track: '基础设施' },
    { name: 'SSI', amount: 10, track: '通用大模型' },
    { name: 'Scale AI', amount: 10, track: '基础设施' },
    { name: 'Figure AI', amount: 6.8, track: '具身智能' },
    { name: 'Perplexity', amount: 5.2, track: '垂直应用' },
    { name: 'Databricks', amount: 5.0, track: '基础设施' },
    { name: 'Glean', amount: 2.6, track: '垂直应用' },
  ],
};
const TRACK_COLOR = {
  '通用大模型': 'var(--aic-accent)',
  '基础设施': 'var(--aic-ink)',
  '具身智能': 'var(--aic-warn)',
  '垂直应用': '#9AA08F',
};
const TRACK_ORDER = ['通用大模型', '基础设施', '具身智能', '垂直应用'];

export const defaultProps = {
  ...COPY,
  rowCount: 10,          // companies shown (5–10)
  focusEnabled: true,    // emphasize the top rows
  focusCount: 3,         // how many top rows are emphasized (前 N 名)
  showSecondary: true,   // color-code by track
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Top Funded Companies' },
  { key: 'title', label: '标题', type: 'text', default: 'Top 10 融资公司' },
  { key: 'sub', label: '次标题', type: 'text', default: '头部玩家资金排名' },
  { key: 'lead', label: '导言', type: 'text', default: '头部公司融资额显著领先，通用大模型占据榜单上方位置。' },
  { key: 'note', label: 'note', type: 'text', default: '口径：以最大单笔融资计 · 单位 亿美元' },
  { key: 'closing', label: '结语', type: 'text', default: '头部融资规模既反映技术叙事，也反映资源绑定能力。' },
  { key: 'rowCount', label: '公司数量', type: 'slider', default: 10, min: 5, max: 10, step: 1,
    description: '榜单展示的公司数量（5–10）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮榜单前列作为视觉重点。' },
  { key: 'focusCount', label: '重点数量', type: 'slider', default: 3, min: 1, max: 3, step: 1,
    description: '高亮的前列条目数量（前 N 名）。', showWhen: (p) => p.focusEnabled },
  { key: 'showSecondary', label: '分类配色', type: 'toggle', default: true,
    description: '按赛道为条形与圆点配色；关闭后为单色。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '赛道图例、背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-rank { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-rank, .aic-rank * { box-sizing: border-box; }
.aic-rank .rk-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 54%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-rank .rk-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-rank .rk-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-rank .rk-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-rank .rk-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-rank .rk-meta { position: absolute; left: var(--pad); right: var(--pad); top: 290px;
  display: flex; align-items: baseline; justify-content: space-between; }
.aic-rank .rk-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.45;
  color: var(--aic-ink); margin: 0; max-width: 1000px; }
.aic-rank .rk-note { font-family: var(--aic-font-display); font-weight: 600; font-size: 19px;
  letter-spacing: .04em; color: var(--aic-faint); white-space: nowrap; }

.aic-rank .rk-list { position: absolute; left: var(--pad); right: var(--pad); top: 392px; bottom: 144px;
  display: flex; flex-direction: column; }
.aic-rank .rk-row { flex: 1; display: grid; grid-template-columns: 64px 340px 1fr 140px; align-items: center;
  gap: 0 26px; border-bottom: 1.5px solid var(--aic-hair); transition: opacity .3s; }
.aic-rank .rk-row:last-child { border-bottom: none; }
.aic-rank .rk-no { font-family: var(--aic-font-display); font-weight: 700; font-size: 34px; color: var(--aic-faint);
  font-variant-numeric: lining-nums; transform: skewX(-9deg); transform-origin: left center; }
.aic-rank .rk-row[data-focus="1"] .rk-no { color: var(--aic-accent); }
.aic-rank .rk-name { display: flex; align-items: center; gap: 14px; }
.aic-rank .rk-name .dot { width: 14px; height: 14px; border-radius: 4px; flex: none; }
.aic-rank .rk-name b { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink); }
.aic-rank .rk-name em { font-style: normal; font-family: var(--aic-font-text); font-weight: 600; font-size: 18px; color: var(--aic-muted); white-space: nowrap; }
.aic-rank .rk-track { height: 18px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-rank .rk-fill { height: 100%; border-radius: 999px; transition: width .55s cubic-bezier(.3,.7,.4,1); }
.aic-rank .rk-val { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 38px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-rank .rk-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

.aic-rank .rk-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-rank .rk-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-rank .rk-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-rank .rk-legend { display: flex; gap: 24px; }
.aic-rank .rk-leg { display: flex; align-items: center; gap: 9px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 19px; color: var(--aic-ink-dim); white-space: nowrap; }
.aic-rank .rk-leg i { width: 14px; height: 14px; border-radius: 4px; flex: none; }
`;

export default function RankingPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-rank', CSS);
  const vars = themeVars(p.accentColor);

  const all = copy.companies;
  const n = Math.max(5, Math.min(all.length, p.rowCount));
  const rows = all.slice(0, n);
  const fc = Math.max(1, Math.min(3, p.focusCount));
  const maxAmt = Math.max(...all.map((c) => c.amount));
  const tracksUsed = TRACK_ORDER.filter((t) => rows.some((c) => c.track === t));

  return (
    <div className="aic-rank" style={vars}>
      {p.showDecorations && <div className="rk-glow" />}

      <div className="rk-head">
        <div>
          <p className="rk-eyebrow">{copy.eyebrow}</p>
          <h2 className="rk-title">{copy.title}</h2>
        </div>
        <div className="rk-sub">{copy.sub}</div>
      </div>

      <div className="rk-meta">
        <p className="rk-lead">{copy.lead}</p>
        <div className="rk-note">{copy.note}</div>
      </div>

      <div className="rk-list">
        {rows.map((c, i) => {
          const isFocus = p.focusEnabled && i < fc;
          const color = p.showSecondary ? (TRACK_COLOR[c.track] || 'var(--aic-ink)') : 'var(--aic-ink)';
          const fill = isFocus ? color : (p.showSecondary ? color : 'var(--aic-ink-dim)');
          return (
            <div className="rk-row" key={c.name} data-focus={isFocus ? '1' : '0'}
              style={{ opacity: isFocus || !p.focusEnabled ? 1 : 0.7 }}>
              <div className="rk-no">{String(i + 1).padStart(2, '0')}</div>
              <div className="rk-name">
                {p.showSecondary && <span className="dot" style={{ background: color }} />}
                <b>{c.name}</b><em>{c.track}</em>
              </div>
              <div className="rk-track">
                <div className="rk-fill" style={{ width: (c.amount / maxAmt) * 100 + '%',
                  background: fill, opacity: isFocus ? 1 : 0.55 }} />
              </div>
              <div className="rk-val">{c.amount}<u>亿美元</u></div>
            </div>
          );
        })}
      </div>

      <div className="rk-foot">
        <div className="rk-closing"><b />{copy.closing}</div>
        {p.showDecorations && p.showSecondary && (
          <div className="rk-legend">
            {tracksUsed.map((t) => (
              <div className="rk-leg" key={t}><i style={{ background: TRACK_COLOR[t] }} />{t}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
