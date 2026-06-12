/**
 * StrategyVerticalPage — P78 嵌入工作流 (Vertical Strategy · Strategy Card)
 *
 * Second closing-strategy slide. The signature device is a horizontal workflow
 * chain whose middle node is an embedded-AI step — the highlight reads "value
 * comes from the position in the flow". Below sit concern-dimension cards (the
 * things to screen for) and a row of scene tags. Step count, the embed (focus)
 * node, dimension-card count, the tag row and accent are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-svt`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Vertical Strategy',
  segment: '策略 · 筛选垂直应用',
  title: '嵌入工作流',
  titleTail: '策略 · 筛选垂直应用',
  lead: '垂直应用要看是否嵌入刚性流程，而不是只看生成效果；好的垂直 AI 应用应该成为工作流的一部分。',
  closing: '应用价值来自流程位置。',
  flowTitle: '业务工作流 · AI 嵌入位置',
  // workflow chain (order fixed; count is prop-driven). One node is the embed point.
  steps: [
    { name: '业务触发', en: 'Trigger', note: '真实工作请求进入' },
    { name: '数据准备', en: 'Context', note: '上下文与资料汇集' },
    { name: 'AI 处理', en: 'AI Embed', note: '嵌入式生成与决策', embed: true },
    { name: '人工复核', en: 'Review', note: '专家确认与修订' },
    { name: '结果交付', en: 'Deliver', note: '回写至业务系统' },
  ],
  cardsTitle: '筛选维度 · Retention',
  // concern dimensions to screen vertical apps by (order fixed; count is prop-driven)
  cards: [
    { name: '付费留存', en: 'Retention', note: '续费率能否穿越预算周期' },
    { name: '使用频次', en: 'Frequency', note: '是否进入高频日常动作' },
    { name: '席位扩张', en: 'Seat Growth', note: '团队内部能否自然扩散' },
    { name: '净收入留存', en: 'NRR', note: '老客户是否持续增购' },
  ],
  tagsTitle: '落地场景',
  tags: ['法律', '医疗', '客服', '企业搜索', '开发者工具'],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  stepCount: 5,          // workflow chain nodes (3–5)
  focusEnabled: true,    // highlight the embed node
  focusIndex: 2,         // which node is the embed point (0-based)
  cardCount: 4,          // concern-dimension cards (2–4)
  showTags: true,        // scene-tag row
  tagCount: 5,           // scene tags shown (2–5)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Vertical Strategy' },
  { key: 'segment', label: 'segment', type: 'text', default: '策略 · 筛选垂直应用' },
  { key: 'title', label: '标题', type: 'text', default: '嵌入工作流' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '策略 · 筛选垂直应用' },
  { key: 'lead', label: '导言', type: 'text', default: '垂直应用要看是否嵌入刚性流程，而不是只看生成效果；好的垂直 AI 应用应该成为工作流的一部分。' },
  { key: 'closing', label: '结语', type: 'text', default: '应用价值来自流程位置。' },
  { key: 'flowTitle', label: 'flowTitle', type: 'text', default: '业务工作流 · AI 嵌入位置' },
  { key: 'cardsTitle', label: 'cardsTitle', type: 'text', default: '筛选维度 · Retention' },
  { key: 'tagsTitle', label: 'tagsTitle', type: 'text', default: '落地场景' },
  { key: 'stepCount', label: '流程节点', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '工作流链路的节点数量（3–5）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮工作流中的 AI 嵌入节点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 2,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }, { value: 4, label: '第 5 个' }],
    description: '选择被高亮的嵌入节点。', showWhen: (p) => p.focusEnabled },
  { key: 'cardCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '底部筛选维度卡数量（2–4）。' },
  { key: 'showTags', label: '标签行', type: 'toggle', default: true,
    description: '底部落地场景标签行的显隐。' },
  { key: 'tagCount', label: '标签数量', type: 'slider', default: 5, min: 2, max: 5, step: 1,
    description: '展示的场景标签数量（2–5）。', showWhen: (p) => p.showTags },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于嵌入节点、连接线与标签。' },
];

const CSS = `
.aic-svt { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-svt, .aic-svt * { box-sizing: border-box; }
.aic-svt .sv-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-svt .sv-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-svt .sv-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-svt .sv-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-svt .sv-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* body — flex column: lead / flow / cards+tags */
.aic-svt .sv-body { position: absolute; left: var(--pad); right: var(--pad); top: 300px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-svt .sv-marker { display: flex; align-items: center; gap: 16px; }
.aic-svt .sv-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-svt .sv-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-svt .sv-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 0; max-width: 1480px; text-wrap: pretty; }

/* workflow chain */
.aic-svt .sv-flow { margin-top: 34px; }
.aic-svt .sv-flow-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 18px; }
.aic-svt .sv-chain { display: flex; align-items: stretch; }
.aic-svt .sv-node { flex: 1 1 0; position: relative; border: 1.5px solid var(--aic-hair); border-radius: 18px;
  background: var(--aic-card); padding: 24px 24px 22px; display: flex; flex-direction: column; gap: 6px;
  transition: border-color .3s, background .3s, transform .3s, box-shadow .3s; }
.aic-svt .sv-node[data-embed="1"] { border-color: transparent; transform: translateY(-6px);
  background: linear-gradient(160deg, var(--aic-accent-bright), var(--aic-accent) 88%);
  box-shadow: 0 26px 58px -28px color-mix(in srgb, var(--aic-accent) 70%, transparent); }
.aic-svt .sv-node[data-dim="1"] { opacity: .56; }
.aic-svt .sv-node-tag { position: absolute; top: -14px; left: 24px; display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 999px; background: var(--aic-ink); color: var(--aic-paper);
  font-family: var(--aic-font-display); font-weight: 700; font-size: 14px; letter-spacing: .1em; text-transform: uppercase; }
.aic-svt .sv-node[data-embed="1"] .sv-node-tag { background: var(--aic-ink); }
.aic-svt .sv-node-no { font-family: var(--aic-font-display); font-weight: 700; font-size: 18px; color: var(--aic-faint);
  font-variant-numeric: tabular-nums; }
.aic-svt .sv-node[data-embed="1"] .sv-node-no { color: color-mix(in srgb, var(--aic-ink) 55%, transparent); }
.aic-svt .sv-node-n { font-family: var(--aic-font-text); font-weight: 800; font-size: 30px; line-height: 1.04; color: var(--aic-ink); }
.aic-svt .sv-node-s { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; line-height: 1.32; color: var(--aic-muted); }
.aic-svt .sv-node[data-embed="1"] .sv-node-s { color: var(--aic-accent-deep); }
.aic-svt .sv-arrow { flex: none; width: 56px; align-self: center; display: flex; align-items: center; justify-content: center; color: var(--aic-hair-strong); }
.aic-svt .sv-arrow svg { width: 30px; height: 30px; }

/* bottom band: dimension cards + tags */
.aic-svt .sv-foot-band { flex: 1; min-height: 0; margin-top: 36px; display: flex; flex-direction: column; justify-content: flex-end; gap: 26px; }
.aic-svt .sv-cards { display: grid; gap: 22px; }
.aic-svt .sv-card { border: 1.5px solid var(--aic-hair); border-radius: 18px; background: var(--aic-card);
  padding: 22px 26px 20px; display: flex; flex-direction: column; gap: 6px; }
.aic-svt .sv-card-en { font-family: var(--aic-font-display); font-weight: 600; font-size: 15px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-svt .sv-card-n { font-family: var(--aic-font-text); font-weight: 800; font-size: 30px; line-height: 1; color: var(--aic-ink); }
.aic-svt .sv-card-s { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; line-height: 1.32; color: var(--aic-muted); }
.aic-svt .sv-tags { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.aic-svt .sv-tags-l { font-family: var(--aic-font-display); font-weight: 600; font-size: 16px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin-right: 6px; }
.aic-svt .sv-tag { display: inline-flex; align-items: center; gap: 9px; padding: 11px 22px; border-radius: 999px;
  border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); font-family: var(--aic-font-text);
  font-weight: 600; font-size: 23px; color: var(--aic-ink); }
.aic-svt .sv-tag i { width: 9px; height: 9px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-svt .sv-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-svt .sv-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-svt .sv-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-svt .sv-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos',
  'accent','pos','pos','accent','warn','pos','accent','pos','pos','accent','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','pos','accent','warn','pos'].map((tone) => ({ tone }));

function Arrow() {
  return (
    <div className="sv-arrow">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M12 5l7 7-7 7"
        fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

export default function StrategyVerticalPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, flowTitle: p.flowTitle !== undefined ? p.flowTitle : COPY.flowTitle, cardsTitle: p.cardsTitle !== undefined ? p.cardsTitle : COPY.cardsTitle, tagsTitle: p.tagsTitle !== undefined ? p.tagsTitle : COPY.tagsTitle, steps: p.steps !== undefined ? p.steps : COPY.steps, cards: p.cards !== undefined ? p.cards : COPY.cards, tags: p.tags !== undefined ? p.tags : COPY.tags };
  ensureFonts();
  injectScopedStyle('aic-svt', CSS);
  const vars = themeVars(p.accentColor);

  const sN = Math.max(3, Math.min(copy.steps.length, p.stepCount));
  const steps = copy.steps.slice(0, sN);
  const embed = Math.max(0, Math.min(sN - 1, p.focusIndex));

  const cN = Math.max(2, Math.min(copy.cards.length, p.cardCount));
  const cards = copy.cards.slice(0, cN);

  const tN = Math.max(2, Math.min(copy.tags.length, p.tagCount));
  const tags = copy.tags.slice(0, tN);

  return (
    <div className="aic-svt" style={vars}>
      {p.showDecorations && <div className="sv-glow" />}

      <div className="sv-head">
        <div>
          <p className="sv-eyebrow">{copy.eyebrow}</p>
          <h2 className="sv-title">{copy.title}</h2>
        </div>
        <div className="sv-sub">{copy.titleTail}</div>
      </div>

      <div className="sv-body">
        <div className="sv-marker"><b /><span>{copy.segment}</span></div>
        <p className="sv-lead">{copy.lead}</p>

        <div className="sv-flow">
          <p className="sv-flow-t">{copy.flowTitle}</p>
          <div className="sv-chain">
            {steps.map((s, i) => {
              const isEmbed = p.focusEnabled && i === embed;
              return (
                <React.Fragment key={s.name}>
                  {i > 0 && <Arrow />}
                  <div className="sv-node" data-embed={isEmbed ? '1' : '0'}
                    data-dim={p.focusEnabled && i !== embed ? '1' : '0'}>
                    {isEmbed && <span className="sv-node-tag">嵌入点</span>}
                    <span className="sv-node-no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="sv-node-n">{s.name}</span>
                    <span className="sv-node-s">{s.note}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="sv-foot-band">
          <div className="sv-cards" style={{ gridTemplateColumns: `repeat(${cN}, 1fr)` }}>
            {cards.map((c) => (
              <div className="sv-card" key={c.name}>
                <span className="sv-card-en">{c.en}</span>
                <span className="sv-card-n">{c.name}</span>
                <span className="sv-card-s">{c.note}</span>
              </div>
            ))}
          </div>
          {p.showTags && (
            <div className="sv-tags">
              <span className="sv-tags-l">{copy.tagsTitle}</span>
              {tags.map((t) => (
                <span className="sv-tag" key={t}><i />{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sv-foot">
        <div className="sv-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="sv-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
