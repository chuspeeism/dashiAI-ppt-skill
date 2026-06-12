/**
 * StrategyInfraPage — P77 确定性预算 (Infrastructure Strategy · Strategy Card)
 *
 * First of the closing strategy slides. The signature device is a set of
 * "recommended direction" cards, each carrying a certainty strength-bar that
 * reads how close the direction sits to a rigid budget. A left rail pairs an
 * editorial lead with a numbered screening-criteria list. Card count, criteria
 * count, the certainty bar, the focus card and accent are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-sif`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY; only the
 * exported `defaultProps` / `controls` drive structural + style variation.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Infrastructure Strategy',
  segment: '策略 · 优先基础设施',
  title: '确定性预算',
  titleTail: '策略 · 优先基础设施',
  lead: '基础设施公司更接近刚性预算，收入确定性相对更强；模型胜负未定时，卖铲子仍是更稳的资本逻辑。',
  closing: '优先看能支撑全行业增长的基础设施。',
  criteriaTitle: '筛选指标 · Screening',
  // screening criteria (order fixed; count is prop-driven)
  criteria: [
    { name: '收入增速', note: '是否有刚性放量需求' },
    { name: '毛利率', note: '成本结构是否健康' },
    { name: '客户集中度', note: '收入是否过度依赖少数客户' },
    { name: '资源锁定', note: '是否绑定算力 / 数据资源' },
  ],
  cardsTitle: '推荐方向 · Infrastructure',
  // recommended infrastructure directions (order fixed; count is prop-driven)
  cards: [
    { name: 'GPU 云', en: 'Compute Cloud', note: '刚性算力预算，最接近行业级基础需求。', certainty: 92 },
    { name: '数据平台', en: 'Data Platform', note: '训练与评测的数据底座，复用性强。', certainty: 84 },
    { name: '推理优化', en: 'Inference Opt.', note: '直接压低单位推理成本，刚需且可量化。', certainty: 80 },
    { name: '评测工具', en: 'Eval & Bench', note: '模型选型的度量入口，绑定决策链路。', certainty: 74 },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  cardCount: 4,          // recommended-direction cards (2–4)
  columns: 2,            // card grid columns (1–2)
  criteriaCount: 4,      // screening-criteria rows (2–4)
  focusEnabled: true,    // highlight one card
  focusIndex: 0,         // which card is the focus (0-based)
  showMeter: true,       // certainty strength bar on cards
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Infrastructure Strategy' },
  { key: 'segment', label: 'segment', type: 'text', default: '策略 · 优先基础设施' },
  { key: 'title', label: '标题', type: 'text', default: '确定性预算' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '策略 · 优先基础设施' },
  { key: 'lead', label: '导言', type: 'text', default: '基础设施公司更接近刚性预算，收入确定性相对更强；模型胜负未定时，卖铲子仍是更稳的资本逻辑。' },
  { key: 'closing', label: '结语', type: 'text', default: '优先看能支撑全行业增长的基础设施。' },
  { key: 'criteriaTitle', label: 'criteriaTitle', type: 'text', default: '筛选指标 · Screening' },
  { key: 'cardsTitle', label: 'cardsTitle', type: 'text', default: '推荐方向 · Infrastructure' },
  { key: 'cardCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '推荐方向卡数量（2–4）。' },
  { key: 'columns', label: '每行列数', type: 'radio', default: 2,
    options: [{ value: 1, label: '1 列' }, { value: 2, label: '2 列' }],
    description: '卡片网格每行的列数。' },
  { key: 'criteriaCount', label: '清单条目', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '左侧筛选指标清单的条目数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张推荐方向卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的方向卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showMeter', label: '示意图形', type: 'toggle', default: true,
    description: '卡片上的确定性强度条显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于强度条、高亮卡与序号。' },
];

const CSS = `
.aic-sif { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-sif, .aic-sif * { box-sizing: border-box; }
.aic-sif .si-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-sif .si-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-sif .si-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-sif .si-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-sif .si-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* body — two-column editorial split */
.aic-sif .si-body { position: absolute; left: var(--pad); right: var(--pad); top: 300px; bottom: 150px;
  display: grid; grid-template-columns: 580px 1fr; gap: 60px; }

/* left rail */
.aic-sif .si-rail { display: flex; flex-direction: column; min-height: 0; }
.aic-sif .si-marker { display: flex; align-items: center; gap: 16px; }
.aic-sif .si-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-sif .si-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-sif .si-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.48;
  color: var(--aic-ink); margin: 20px 0 0; text-wrap: pretty; }
.aic-sif .si-crit-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 40px 0 8px; }
.aic-sif .si-crit { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; }
.aic-sif .si-crit-row { display: flex; align-items: baseline; gap: 22px; padding: 18px 0;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-sif .si-crit-row:last-child { border-bottom: 0; }
.aic-sif .si-crit-idx { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--aic-accent-deep);
  width: 34px; flex: none; font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; }
.aic-sif .si-crit-main { display: flex; flex-direction: column; gap: 3px; }
.aic-sif .si-crit-n { font-family: var(--aic-font-text); font-weight: 700; font-size: 28px; color: var(--aic-ink); line-height: 1.1; }
.aic-sif .si-crit-s { font-family: var(--aic-font-text); font-weight: 500; font-size: 20px; color: var(--aic-muted); line-height: 1.3; }

/* right — direction cards */
.aic-sif .si-cards-wrap { display: flex; flex-direction: column; min-height: 0; }
.aic-sif .si-cards-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 18px; }
.aic-sif .si-cards { flex: 1; min-height: 0; display: grid; gap: 24px; }
.aic-sif .si-card { position: relative; border: 1.5px solid var(--aic-hair); border-radius: 22px;
  background: var(--aic-card); padding: 30px 32px 26px; overflow: hidden; display: flex; flex-direction: column;
  transition: border-color .3s, background .3s, transform .3s, box-shadow .3s; }
.aic-sif .si-card[data-focus="1"] { border-color: transparent; transform: translateY(-4px);
  background: linear-gradient(158deg, color-mix(in srgb, var(--aic-accent) 18%, var(--aic-card)), var(--aic-card) 78%);
  box-shadow: 0 26px 60px -32px color-mix(in srgb, var(--aic-accent) 66%, transparent); }
.aic-sif .si-card[data-dim="1"] { opacity: .5; }
.aic-sif .si-card-hd { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.aic-sif .si-card-no { font-family: var(--aic-font-display); font-weight: 700; font-size: 20px; color: var(--aic-faint);
  font-variant-numeric: tabular-nums; }
.aic-sif .si-card[data-focus="1"] .si-card-no { color: var(--aic-accent-deep); }
.aic-sif .si-card-en { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-sif .si-card-n { font-family: var(--aic-font-text); font-weight: 900; font-size: 38px; line-height: 1; color: var(--aic-ink); margin: 14px 0 0; }
.aic-sif .si-card-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 21px; line-height: 1.42;
  color: var(--aic-ink-dim); margin: 12px 0 0; text-wrap: pretty; }
.aic-sif .si-meter { margin-top: auto; padding-top: 22px; }
.aic-sif .si-meter-t { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 9px; }
.aic-sif .si-meter-l { font-family: var(--aic-font-display); font-weight: 600; font-size: 16px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-sif .si-meter-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-sif .si-card[data-focus="1"] .si-meter-v { color: var(--aic-accent-deep); }
.aic-sif .si-meter-track { height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-sif .si-meter-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.3,.7,.4,1);
  background: linear-gradient(90deg, color-mix(in srgb, var(--aic-accent) 58%, white), var(--aic-accent)); }

.aic-sif .si-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-sif .si-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-sif .si-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-sif .si-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','pos','accent','pos','warn','accent','pos','pos','accent','pos','warn','accent',
  'pos','accent','pos','pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','pos','warn','accent','pos','pos','accent','pos','warn','accent'].map((tone) => ({ tone }));

export default function StrategyInfraPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, criteriaTitle: p.criteriaTitle !== undefined ? p.criteriaTitle : COPY.criteriaTitle, cardsTitle: p.cardsTitle !== undefined ? p.cardsTitle : COPY.cardsTitle, criteria: p.criteria !== undefined ? p.criteria : COPY.criteria, cards: p.cards !== undefined ? p.cards : COPY.cards };
  ensureFonts();
  injectScopedStyle('aic-sif', CSS);
  const vars = themeVars(p.accentColor);

  const cN = Math.max(2, Math.min(copy.cards.length, p.cardCount));
  const cards = copy.cards.slice(0, cN);
  const focus = Math.max(0, Math.min(cN - 1, p.focusIndex));
  const cols = Math.max(1, Math.min(2, p.columns));

  const crN = Math.max(2, Math.min(copy.criteria.length, p.criteriaCount));
  const criteria = copy.criteria.slice(0, crN);

  return (
    <div className="aic-sif" style={vars}>
      {p.showDecorations && <div className="si-glow" />}

      <div className="si-head">
        <div>
          <p className="si-eyebrow">{copy.eyebrow}</p>
          <h2 className="si-title">{copy.title}</h2>
        </div>
        <div className="si-sub">{copy.titleTail}</div>
      </div>

      <div className="si-body">
        <div className="si-rail">
          <div className="si-marker"><b /><span>{copy.segment}</span></div>
          <p className="si-lead">{copy.lead}</p>
          <p className="si-crit-t">{copy.criteriaTitle}</p>
          <div className="si-crit">
            {criteria.map((c, i) => (
              <div className="si-crit-row" key={c.name}>
                <span className="si-crit-idx">{String(i + 1).padStart(2, '0')}</span>
                <div className="si-crit-main">
                  <span className="si-crit-n">{c.name}</span>
                  <span className="si-crit-s">{c.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="si-cards-wrap">
          <p className="si-cards-t">{copy.cardsTitle}</p>
          <div className="si-cards" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {cards.map((c, i) => (
              <div className="si-card" key={c.name}
                data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                data-dim={p.focusEnabled && i !== focus ? '1' : '0'}>
                <div className="si-card-hd">
                  <span className="si-card-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="si-card-en">{c.en}</span>
                </div>
                <h3 className="si-card-n">{c.name}</h3>
                <p className="si-card-note">{c.note}</p>
                {p.showMeter && (
                  <div className="si-meter">
                    <div className="si-meter-t">
                      <span className="si-meter-l">确定性</span>
                      <span className="si-meter-v">{c.certainty}%</span>
                    </div>
                    <div className="si-meter-track">
                      <div className="si-meter-fill" style={{ width: c.certainty + '%' }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="si-foot">
        <div className="si-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="si-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
