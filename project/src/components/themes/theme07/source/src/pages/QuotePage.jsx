/**
 * QuotePage — P14 结论与数据来源 (Conclusion · Quote)
 *
 * Quote-led slide: one large statement at the optical center, with a small
 * row of supporting conclusions and a source line beneath it. Alignment,
 * supporting-conclusion count, the quote mark and decorations are prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-quote`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip, LensCluster).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, LensCluster } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Conclusion',
  kicker: '结论与数据来源',
  // the hero statement — split so one clause can carry the accent
  quoteLead: '资本下一阶段，将从',
  quoteEm1: '赌叙事',
  quoteMid: '转向',
  quoteEm2: '看兑现',
  quoteTail: '。',
  conclusions: [
    { idx: '01', title: '头部集中', note: '少数超级交易决定年度曲线与市场情绪' },
    { idx: '02', title: '地理护城河', note: '湾区集聚人才、资本与算力，短期难以撼动' },
    { idx: '03', title: '兑现为王', note: '能形成商业闭环的方向才会穿越退潮' },
  ],
  source: '数据来源 · AI Capital Lab 自建数据库 / 公开融资披露 · 2024 全年口径 ≥1 亿美元',
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  align: 'center',          // 'center' | 'left'
  showConclusions: true,    // supporting conclusion row
  conclusionCount: 3,       // how many conclusions (0–3)
  showQuoteMark: true,      // oversized quotation mark
  showSource: true,         // data-source line
  showDecorations: true,    // glow / lens / heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Conclusion' },
  { key: 'kicker', label: 'kicker', type: 'text', default: '结论与数据来源' },
  { key: 'quoteLead', label: 'quoteLead', type: 'text', default: '资本下一阶段，将从' },
  { key: 'quoteEm1', label: 'quoteEm1', type: 'text', default: '赌叙事' },
  { key: 'quoteMid', label: 'quoteMid', type: 'text', default: '转向' },
  { key: 'quoteEm2', label: 'quoteEm2', type: 'text', default: '看兑现' },
  { key: 'quoteTail', label: 'quoteTail', type: 'text', default: '。' },
  { key: 'source', label: '来源', type: 'text', default: '数据来源 · AI Capital Lab 自建数据库 / 公开融资披露 · 2024 全年口径 ≥1 亿美元' },
  { key: 'align', label: '对齐方式', type: 'radio', default: 'center',
    options: [{ value: 'center', label: '居中' }, { value: 'left', label: '左对齐' }],
    description: '金句与辅助信息的整体对齐方式。' },
  { key: 'showConclusions', label: '辅助信息', type: 'toggle', default: true,
    description: '底部核心结论行的显隐。' },
  { key: 'conclusionCount', label: '结论数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '展示的核心结论条目数量（0–3）。', showWhen: (p) => p.showConclusions },
  { key: 'showQuoteMark', label: '引号装饰', type: 'toggle', default: true,
    description: '超大引号装饰符号的显隐。' },
  { key: 'showSource', label: '数据来源', type: 'toggle', default: true,
    description: '底部数据来源说明行的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、镜头光斑与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于金句重点词与装饰。' },
];

const CSS = `
.aic-quote { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 120px; }
.aic-quote, .aic-quote * { box-sizing: border-box; }
.aic-quote .qt-glow { position: absolute; left: 50%; top: 40%; width: 70%; height: 80%; transform: translate(-50%,-50%);
  pointer-events: none; background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 18%, transparent), transparent 70%); }
.aic-quote .qt-lens { position: absolute; right: 96px; bottom: 150px; width: 260px; height: 260px; opacity: .9; }

.aic-quote .qt-eyebrow { position: absolute; top: 96px; left: var(--pad); right: var(--pad);
  display: flex; align-items: center; gap: 22px; font-family: var(--aic-font-display); font-weight: 600;
  font-size: 22px; letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); }
.aic-quote .qt-eyebrow i { flex: none; width: 11px; height: 11px; border-radius: 50%; background: var(--aic-accent); }
.aic-quote .qt-eyebrow s { flex: 1; height: 1.5px; background: var(--aic-hair); text-decoration: none; }
.aic-quote .qt-eyebrow b { font-family: var(--aic-font-text); font-weight: 700; letter-spacing: .04em;
  text-transform: none; font-size: 22px; color: var(--aic-ink-dim); }

.aic-quote .qt-body { position: absolute; left: var(--pad); right: var(--pad); top: 50%; transform: translateY(-54%);
  display: flex; flex-direction: column; }
.aic-quote.is-center .qt-body { align-items: center; text-align: center; }
.aic-quote.is-left .qt-body { align-items: flex-start; text-align: left; }

.aic-quote .qt-mark { font-family: var(--aic-font-display); font-weight: 700; font-size: 200px; line-height: .6;
  color: var(--aic-accent); height: 110px; }
.aic-quote .qt-text { font-family: var(--aic-font-text); font-weight: 900; font-size: 104px; line-height: 1.12;
  letter-spacing: -.01em; margin: 0; max-width: 1500px; text-wrap: balance; }
.aic-quote .qt-text em { font-style: normal; color: var(--aic-accent);
  background: linear-gradient(180deg, transparent 64%, color-mix(in srgb, var(--aic-accent) 30%, transparent) 64%); }

.aic-quote .qt-rule { width: 120px; height: 5px; border-radius: 999px; background: var(--aic-ink); margin: 52px 0 0; }
.aic-quote.is-center .qt-rule { align-self: center; }

.aic-quote .qt-concl { position: absolute; left: var(--pad); right: var(--pad); bottom: 188px;
  display: grid; gap: 40px; }
.aic-quote .qt-c { display: flex; flex-direction: column; gap: 8px; padding-top: 22px;
  border-top: 2px solid var(--aic-ink); }
.aic-quote .qt-c-idx { font-family: var(--aic-font-display); font-weight: 700; font-size: 20px;
  letter-spacing: .12em; color: var(--aic-accent-deep); }
.aic-quote .qt-c-ttl { font-family: var(--aic-font-text); font-weight: 800; font-size: 30px; color: var(--aic-ink); line-height: 1; }
.aic-quote .qt-c-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 20px; color: var(--aic-muted); line-height: 1.4; }

.aic-quote .qt-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 90px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-quote .qt-src { font-family: var(--aic-font-display); font-weight: 500; font-size: 20px;
  letter-spacing: .04em; color: var(--aic-faint); }
.aic-quote .qt-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

export default function QuotePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, kicker: p.kicker !== undefined ? p.kicker : COPY.kicker, quoteLead: p.quoteLead !== undefined ? p.quoteLead : COPY.quoteLead, quoteEm1: p.quoteEm1 !== undefined ? p.quoteEm1 : COPY.quoteEm1, quoteMid: p.quoteMid !== undefined ? p.quoteMid : COPY.quoteMid, quoteEm2: p.quoteEm2 !== undefined ? p.quoteEm2 : COPY.quoteEm2, quoteTail: p.quoteTail !== undefined ? p.quoteTail : COPY.quoteTail, source: p.source !== undefined ? p.source : COPY.source, conclusions: p.conclusions !== undefined ? p.conclusions : COPY.conclusions };
  ensureFonts();
  injectScopedStyle('aic-quote', CSS);
  const vars = themeVars(p.accentColor);

  const align = p.align === 'left' ? 'left' : 'center';
  const conclN = Math.max(0, Math.min(3, p.conclusionCount));
  const conclusions = copy.conclusions.slice(0, conclN);
  const showConcl = p.showConclusions && conclN > 0;

  return (
    <div className={'aic-quote is-' + align} style={vars}>
      {p.showDecorations && <div className="qt-glow" />}
      {p.showDecorations && <div className="qt-lens"><LensCluster /></div>}

      <div className="qt-eyebrow">
        <i />{copy.eyebrow}<s />
        <b>{copy.kicker}</b>
      </div>

      <div className="qt-body" style={{ top: showConcl ? '44%' : '50%' }}>
        {p.showQuoteMark && <div className="qt-mark">“</div>}
        <h2 className="qt-text">
          {copy.quoteLead}<em>{copy.quoteEm1}</em>{copy.quoteMid}<em>{copy.quoteEm2}</em>{copy.quoteTail}
        </h2>
        <div className="qt-rule" />
      </div>

      {showConcl && (
        <div className="qt-concl" style={{ gridTemplateColumns: `repeat(${conclN}, 1fr)` }}>
          {conclusions.map((c) => (
            <div className="qt-c" key={c.idx}>
              <span className="qt-c-idx">{c.idx}</span>
              <span className="qt-c-ttl">{c.title}</span>
              <span className="qt-c-note">{c.note}</span>
            </div>
          ))}
        </div>
      )}

      <div className="qt-foot">
        {p.showSource ? <div className="qt-src">{copy.source}</div> : <span />}
        {p.showDecorations && <div className="qt-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
