/**
 * RevenuePage — P73 从试点到稳定收入 (Revenue Risk · Funnel · Risk Card)
 *
 * A risk slide whose signature device is a left→right conversion funnel: pilot
 * base → paid conversion → stable retention, each stage a centred bar sized by
 * the surviving share, with a faint "leak" ghost behind it and conversion pills
 * on the connectors. An editorial lead anchors the top and a row of unit-economics
 * metric cards anchors the bottom. Stage count, metric-card count, value labels
 * and the focus card are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-rv`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Revenue Risk',
  marker: '收入验证',
  segment: '风险 · 收入验证',
  title: '从试点到稳定收入',
  titleTail: '风险 · 收入验证',
  lead: '多数 AI 公司需要证明自己能从试点项目转向稳定订阅收入；收入验证要看留存、毛利和客户扩张，而不是只看 Logo。',
  statLine: '试点转付费率 28% · 企业年流失率 17%',
  closing: '客户试点不等于商业化成功。',
  funnelTitle: '试点 → 付费 → 稳定收入 · 转化漏斗',
  // funnel stages, surviving share of the pilot base (count is prop-driven)
  stages: [
    { name: '试点项目', value: 100, note: '免费 / 低价试用', conv: null },
    { name: '付费转化', value: 28, note: '签约进入付费', conv: '28% 转付费' },
    { name: '稳定订阅', value: 23, note: '续约留存收入', conv: '83% 留存' },
  ],
  // unit-economics metric cards (order fixed; count is prop-driven)
  metrics: [
    { lbl: '试点转付费率', val: '28', unit: '%' },
    { lbl: '企业年流失率', val: '17', unit: '%' },
    { lbl: '毛利率中位数', val: '54', unit: '%' },
    { lbl: '推理成本占收入', val: '31', unit: '%' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  stageCount: 3,         // funnel stages (2–3)
  metricCount: 4,        // metric cards (2–4)
  focusEnabled: true,    // highlight one metric card
  focusIndex: 0,         // which card is the focus (0-based)
  showValues: true,      // conversion pills + stage value labels
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Revenue Risk' },
  { key: 'marker', label: 'marker', type: 'text', default: '收入验证' },
  { key: 'segment', label: 'segment', type: 'text', default: '风险 · 收入验证' },
  { key: 'title', label: '标题', type: 'text', default: '从试点到稳定收入' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '风险 · 收入验证' },
  { key: 'lead', label: '导言', type: 'text', default: '多数 AI 公司需要证明自己能从试点项目转向稳定订阅收入；收入验证要看留存、毛利和客户扩张，而不是只看 Logo。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '试点转付费率 28% · 企业年流失率 17%' },
  { key: 'closing', label: '结语', type: 'text', default: '客户试点不等于商业化成功。' },
  { key: 'funnelTitle', label: 'funnelTitle', type: 'text', default: '试点 → 付费 → 稳定收入 · 转化漏斗' },
  { key: 'stageCount', label: '阶段数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '转化漏斗的阶段数量（2–3）。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '底部指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '漏斗阶段数值与转化率标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于漏斗、转化率与高亮卡。' },
];

const CSS = `
.aic-rv { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-rv, .aic-rv * { box-sizing: border-box; }
.aic-rv .rv-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-rv .rv-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-rv .rv-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-rv .rv-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-rv .rv-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* body container — flex column distributes lead / funnel / cards cleanly */
.aic-rv .rv-body { position: absolute; left: var(--pad); right: var(--pad); top: 296px; bottom: 150px;
  display: flex; flex-direction: column; }

/* lead band */
.aic-rv .rv-marker { display: flex; align-items: center; gap: 16px; }
.aic-rv .rv-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-rv .rv-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-rv .rv-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 0; max-width: 1480px; text-wrap: pretty; }

/* funnel */
.aic-rv .rv-funnel { flex: 1; min-height: 0; margin: 34px 0 0; display: flex; flex-direction: column; }
.aic-rv .rv-funnel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 18px; }
.aic-rv .rv-track { flex: 1; min-height: 0; display: flex; align-items: stretch; }
.aic-rv .rv-col { flex: 1 1 0; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; }
.aic-rv .rv-plot { position: relative; width: 100%; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.aic-rv .rv-ghost { position: absolute; left: 50%; transform: translateX(-50%); width: 74%; height: 100%;
  border-radius: 20px; border: 2px dashed var(--aic-hair-strong); background: color-mix(in srgb, var(--aic-ink) 3%, transparent); }
.aic-rv .rv-block { position: relative; width: 74%; border-radius: 20px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px; overflow: hidden; z-index: 1;
  background: linear-gradient(160deg, var(--aic-accent-bright), var(--aic-accent) 84%);
  box-shadow: 0 22px 46px -26px color-mix(in srgb, var(--aic-accent) 72%, transparent);
  transition: height .6s cubic-bezier(.3,.7,.4,1); }
.aic-rv .rv-col[data-tier="1"] .rv-block { background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 64%, white), var(--aic-accent) 92%); }
.aic-rv .rv-col[data-tier="2"] .rv-block { background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 42%, white), color-mix(in srgb, var(--aic-accent) 78%, white) 96%); }
.aic-rv .rv-block-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 64px; line-height: .9;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-rv .rv-block-v u { text-decoration: none; font-size: 26px; font-weight: 600; margin-left: 2px; }
.aic-rv .rv-cap { margin-top: 18px; text-align: center; width: 100%; }
.aic-rv .rv-cap-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); }
.aic-rv .rv-cap-s { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; color: var(--aic-muted); margin-top: 4px; }
/* connector with conversion pill */
.aic-rv .rv-link { flex: none; width: 168px; position: relative; display: flex; align-items: center; justify-content: center; }
.aic-rv .rv-link::before { content: ''; position: absolute; left: 8px; right: 8px; top: 50%; height: 0;
  border-top: 2px dashed var(--aic-hair-strong); }
.aic-rv .rv-pill { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: 999px; background: var(--aic-ink); color: var(--aic-paper);
  font-family: var(--aic-font-display); font-weight: 700; font-size: 21px; white-space: nowrap;
  font-variant-numeric: tabular-nums; }
.aic-rv .rv-pill svg { width: 16px; height: 16px; }

/* metric cards */
.aic-rv .rv-cards { flex: none; margin-top: 30px; display: grid; gap: 22px; }
.aic-rv .rv-card { position: relative; border: 1.5px solid var(--aic-hair); border-radius: 20px;
  background: var(--aic-card); padding: 26px 28px 24px; overflow: hidden; transition: border-color .3s, background .3s; }
.aic-rv .rv-card[data-focus="1"] { border-color: transparent;
  background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 18%, var(--aic-card)), var(--aic-card) 80%); }
.aic-rv .rv-card[data-focus="1"]::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--aic-accent); }
.aic-rv .rv-card-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 20px; color: var(--aic-muted); }
.aic-rv .rv-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 54px; line-height: 1;
  color: var(--aic-ink); margin-top: 12px; font-variant-numeric: tabular-nums; }
.aic-rv .rv-card[data-focus="1"] .rv-card-val { color: var(--aic-accent-deep); }
.aic-rv .rv-card-val u { text-decoration: none; font-size: 22px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

.aic-rv .rv-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-rv .rv-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-rv .rv-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-rv .rv-deco { width: 300px; height: 30px; }
`;

const HEAT = ['neg','warn','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

export default function RevenuePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, marker: p.marker !== undefined ? p.marker : COPY.marker, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, funnelTitle: p.funnelTitle !== undefined ? p.funnelTitle : COPY.funnelTitle, stages: p.stages !== undefined ? p.stages : COPY.stages, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-rv', CSS);
  const vars = themeVars(p.accentColor);

  const sN = Math.max(2, Math.min(copy.stages.length, p.stageCount));
  const stages = copy.stages.slice(0, sN);
  const maxV = Math.max(...stages.map((s) => s.value));

  const mN = Math.max(2, Math.min(copy.metrics.length, p.metricCount));
  const metrics = copy.metrics.slice(0, mN);
  const focus = Math.max(0, Math.min(mN - 1, p.focusIndex));

  // bar height as share of the plot; floor so small survivors stay legible
  const barH = (v) => Math.max(20, v / maxV * 100) + '%';

  return (
    <div className="aic-rv" style={vars}>
      {p.showDecorations && <div className="rv-glow" />}

      <div className="rv-head">
        <div>
          <p className="rv-eyebrow">{copy.eyebrow}</p>
          <h2 className="rv-title">{copy.title}</h2>
        </div>
        <div className="rv-sub">{copy.titleTail}</div>
      </div>

      <div className="rv-body">
        <div className="rv-marker"><b /><span>{copy.segment}</span></div>
        <p className="rv-lead">{copy.lead}</p>

        <div className="rv-funnel">
          <p className="rv-funnel-t">{copy.funnelTitle}</p>
          <div className="rv-track">
            {stages.map((s, i) => (
              <React.Fragment key={s.name}>
                {i > 0 && (
                  <div className="rv-link">
                    {p.showValues && s.conv && (
                      <span className="rv-pill">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6"
                          fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {s.conv}
                      </span>
                    )}
                  </div>
                )}
                <div className="rv-col" data-tier={i}>
                  <div className="rv-plot">
                    <div className="rv-ghost" />
                    <div className="rv-block" style={{ height: barH(s.value) }}>
                      {p.showValues && (
                        <div className="rv-block-v">{s.value}<u>%</u></div>
                      )}
                    </div>
                  </div>
                  <div className="rv-cap">
                    <div className="rv-cap-n">{s.name}</div>
                    <div className="rv-cap-s">{s.note}</div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="rv-cards" style={{ gridTemplateColumns: `repeat(${mN}, 1fr)` }}>
          {metrics.map((m, i) => (
            <div className="rv-card" key={m.lbl} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="rv-card-lbl">{m.lbl}</div>
              <div className="rv-card-val">{m.val}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>
      </div>

      <div className="rv-foot">
        <div className="rv-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="rv-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
