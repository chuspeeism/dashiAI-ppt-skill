/**
 * ActiveCapitalPage — P26 最活跃投资机构 (Active Capital · Ranking Leaderboard · Chart-led)
 *
 * A chart-led leaderboard slide: investment firms ranked by deal count, drawn
 * as horizontal ranking bars (or a lollipop variant). A short lead + anchor
 * figure sit on a left rail; the ranked rows are the hero. Row count, the bar
 * style, the value labels and the focus row are all prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-act`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Active Capital',
  title: '最活跃投资机构',
  titleTail: '出手次数 Top',
  lead: '头部机构的出手频次远高于市场平均，少数几家几乎参与了全年所有标志性轮次。',
  anchorLead: '38%',
  anchorNote: '前 6 家机构覆盖的大额轮次占比',
  closing: '出手越密集，越能定义下一轮叙事。',
  axisLabel: '参与大额轮次 / 笔',
  // ranked firms (order = rank; count is prop-driven). val = 参与笔数
  rows: [
    { name: 'Northgate Capital', tag: '全赛道布局', val: 14 },
    { name: 'Lumen Partners', tag: '应用层为主', val: 11 },
    { name: 'Aperture Ventures', tag: '通用大模型', val: 9 },
    { name: 'Vertex Growth', tag: '基础设施', val: 7 },
    { name: 'Meridian Fund', tag: '安全与数据', val: 6 },
    { name: 'Cobalt Equity', tag: 'AI 芯片', val: 5 },
    { name: 'Harbor Lane', tag: '早期种子', val: 4 },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  rowCount: 6,           // ranked rows shown (4–7)
  chartType: 'bars',     // 'bars' | 'lollipop'
  showValues: true,      // numeric value at the end of each bar
  showTags: true,        // per-firm preference tag
  focusEnabled: true,    // highlight one row
  focusIndex: 0,         // which row is the focus (0-based)
  showAnchor: true,      // left-rail anchor figure
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Active Capital' },
  { key: 'title', label: '标题', type: 'text', default: '最活跃投资机构' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '出手次数 Top' },
  { key: 'lead', label: '导言', type: 'text', default: '头部机构的出手频次远高于市场平均，少数几家几乎参与了全年所有标志性轮次。' },
  { key: 'anchorLead', label: '锚点数字', type: 'text', default: '38%' },
  { key: 'anchorNote', label: '锚点注释', type: 'text', default: '前 6 家机构覆盖的大额轮次占比' },
  { key: 'closing', label: '结语', type: 'text', default: '出手越密集，越能定义下一轮叙事。' },
  { key: 'axisLabel', label: '坐标标签', type: 'text', default: '参与大额轮次 / 笔' },
  { key: 'rowCount', label: '卡片数量', type: 'slider', default: 6, min: 4, max: 7, step: 1,
    description: '排行榜展示的机构行数量（4–7）。' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bars',
    options: [
      { value: 'bars', label: '条形' },
      { value: 'lollipop', label: '棒点' },
    ],
    description: '排名条的呈现方式：实心条形 / 棒点（lollipop）。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '每条排名条末端的数值标签显隐。' },
  { key: 'showTags', label: '说明文案', type: 'toggle', default: true,
    description: '每家机构的偏好赛道标签显隐。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一行作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 名' }, { value: 1, label: '第 2 名' },
      { value: 2, label: '第 3 名' }, { value: 3, label: '第 4 名' },
      { value: 4, label: '第 5 名' }, { value: 5, label: '第 6 名' }, { value: 6, label: '第 7 名' }],
    description: '选择被高亮的机构行。', showWhen: (p) => p.focusEnabled },
  { key: 'showAnchor', label: '重点数字', type: 'toggle', default: true,
    description: '左侧锚点数字（头部机构覆盖占比）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于高亮行、排名条与锚点数字。' },
];

const CSS = `
.aic-act { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-act, .aic-act * { box-sizing: border-box; }
.aic-act .at-glow { position: absolute; right: -4%; top: -8%; width: 54%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-act .at-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-act .at-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-act .at-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-act .at-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left rail */
.aic-act .at-rail { position: absolute; left: var(--pad); top: 304px; width: 470px;
  display: flex; flex-direction: column; }
.aic-act .at-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 31px; line-height: 1.5;
  color: var(--aic-ink); margin: 0; }
.aic-act .at-anchor { margin-top: 52px; }
.aic-act .at-anchor-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 21px;
  color: var(--aic-muted); margin: 14px 0 0; max-width: 420px; line-height: 1.45; }
.aic-act .at-closing { display: flex; align-items: center; gap: 16px; margin-top: 56px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-act .at-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

/* leaderboard */
.aic-act .at-board { position: absolute; right: var(--pad); top: 300px; bottom: 150px; width: 1150px;
  display: flex; flex-direction: column; }
.aic-act .at-axis { display: flex; align-items: center; justify-content: flex-end; margin-bottom: 14px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-act .at-rows { flex: 1; display: flex; flex-direction: column; }
.aic-act .at-row { flex: 1; display: grid; grid-template-columns: 60px minmax(280px, 360px) 1fr;
  align-items: center; gap: 0 26px; padding: 0 18px; border-radius: 16px;
  border-bottom: 1.5px solid var(--aic-hair); transition: background .3s, transform .3s; }
.aic-act .at-row:last-child { border-bottom: none; }
.aic-act .at-row[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 12%, var(--aic-card)); transform: translateX(6px); }
.aic-act .at-rk { font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; line-height: 1;
  color: var(--aic-faint); transform: skewX(-9deg); transform-origin: left bottom; font-variant-numeric: tabular-nums; }
.aic-act .at-row[data-focus="1"] .at-rk { color: var(--aic-accent); }
.aic-act .at-name { display: flex; flex-direction: column; gap: 4px; }
.aic-act .at-name b { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink);
  line-height: 1.1; white-space: nowrap; }
.aic-act .at-name span { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted); }
.aic-act .at-bar { display: flex; align-items: center; gap: 16px; }
.aic-act .at-track { flex: 1; height: 22px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-act .at-fill { height: 100%; border-radius: 999px; background: var(--aic-ink);
  transition: width .55s cubic-bezier(.3,.7,.4,1); }
.aic-act .at-row[data-focus="1"] .at-fill { background: var(--aic-accent); }
/* lollipop variant */
.aic-act .at-lolli { flex: 1; position: relative; height: 22px; }
.aic-act .at-lolli-line { position: absolute; left: 0; top: 50%; height: 4px; border-radius: 999px;
  background: var(--aic-hair-strong); transform: translateY(-50%); transition: width .55s cubic-bezier(.3,.7,.4,1); }
.aic-act .at-lolli-dot { position: absolute; top: 50%; width: 26px; height: 26px; border-radius: 50%;
  background: var(--aic-ink); transform: translate(-50%, -50%); transition: left .55s cubic-bezier(.3,.7,.4,1);
  border: 4px solid var(--aic-paper); box-shadow: 0 0 0 1.5px var(--aic-hair-strong); }
.aic-act .at-row[data-focus="1"] .at-lolli-dot { background: var(--aic-accent); box-shadow: 0 0 0 1.5px var(--aic-accent); }
.aic-act .at-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 96px; text-align: right; }
.aic-act .at-val u { text-decoration: none; font-size: 16px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

.aic-act .at-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: flex-end; }
.aic-act .at-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','neg','accent','pos','warn','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

export default function ActiveCapitalPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, anchorLead: p.anchorLead !== undefined ? p.anchorLead : COPY.anchorLead, anchorNote: p.anchorNote !== undefined ? p.anchorNote : COPY.anchorNote, closing: p.closing !== undefined ? p.closing : COPY.closing, axisLabel: p.axisLabel !== undefined ? p.axisLabel : COPY.axisLabel, rows: p.rows !== undefined ? p.rows : COPY.rows };
  ensureFonts();
  injectScopedStyle('aic-act', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(4, Math.min(copy.rows.length, p.rowCount));
  const rows = copy.rows.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const max = Math.max(...rows.map((r) => r.val)) * 1.04;

  return (
    <div className="aic-act" style={vars}>
      {p.showDecorations && <div className="at-glow" />}

      <div className="at-head">
        <div>
          <p className="at-eyebrow">{copy.eyebrow}</p>
          <h2 className="at-title">{copy.title}</h2>
        </div>
        <div className="at-sub">{copy.titleTail} {n}</div>
      </div>

      <div className="at-rail">
        <p className="at-lead">{copy.lead}</p>
        {p.showAnchor && (
          <div className="at-anchor">
            <BigNumber lead={copy.anchorLead} size={120} />
            <p className="at-anchor-note">{copy.anchorNote}</p>
          </div>
        )}
        <div className="at-closing"><b />{copy.closing}</div>
      </div>

      <div className="at-board">
        <div className="at-axis">{copy.axisLabel}</div>
        <div className="at-rows">
          {rows.map((r, i) => {
            const isF = p.focusEnabled && i === focus;
            const pct = (r.val / max) * 100;
            return (
              <div className="at-row" key={r.name} data-focus={isF ? '1' : '0'}>
                <div className="at-rk">{i + 1}</div>
                <div className="at-name">
                  <b>{r.name}</b>
                  {p.showTags && <span>{r.tag}</span>}
                </div>
                <div className="at-bar">
                  {p.chartType === 'lollipop' ? (
                    <div className="at-lolli">
                      <div className="at-lolli-line" style={{ width: pct + '%' }} />
                      <div className="at-lolli-dot" style={{ left: pct + '%' }} />
                    </div>
                  ) : (
                    <div className="at-track">
                      <div className="at-fill" style={{ width: pct + '%' }} />
                    </div>
                  )}
                  {p.showValues && <div className="at-val">{r.val}<u>笔</u></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {p.showDecorations && (
        <div className="at-foot"><div className="at-deco"><HeatStrip data={HEAT} gap={4} /></div></div>
      )}
    </div>
  );
}
