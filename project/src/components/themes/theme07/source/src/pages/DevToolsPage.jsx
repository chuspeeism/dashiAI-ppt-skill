/**
 * DevToolsPage — P33 研发效率提升 (Developer Tools · Quote / Insight)
 *
 * A low-density "insight" slide built around one editorial statement. Distinct
 * from P14 QuotePage: this one is left-anchored, pairs the statement with a
 * supporting-reason row, and carries a developer-throughput "rhythm" rail as a
 * brand-flavoured motif on the right. Alignment, the reason count, the motif,
 * its density, the quote mark, the source line and decorations are prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-dev`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip, LensCluster).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, LensCluster } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Developer Tools',
  kicker: '研发效率提升',
  tag: 'Insight · 金句',
  // the hero statement — split so two clauses can carry the accent
  quoteLead: '研发效率，是企业最直接的',
  quoteEm1: 'AI 预算入口',
  quoteMid: '之一；能嵌入',
  quoteEm2: '日常开发循环',
  quoteTail: '的工具，留存最强。',
  reasons: [
    { idx: '01', title: '即时 ROI', note: '代码补全与评审可直接换算为工时与交付速度' },
    { idx: '02', title: '自然渗透', note: '从个人插件渗透到团队工作流，扩张阻力低' },
    { idx: '03', title: '高频刚需', note: '嵌入提交—评审—发布循环，使用频次极高' },
  ],
  source: '数据来源 · AI Capital Lab 自建数据库 / 公开融资披露 · 2024 全年口径 ≥1 亿美元',
};

// developer "throughput rhythm" rail — authored bar pattern (width fractions + tone)
const RAIL = [
  { w: 0.92, t: 'accent' }, { w: 0.64, t: 'soft' }, { w: 0.78, t: 'accent' },
  { w: 0.46, t: 'soft' }, { w: 1.0, t: 'accent' }, { w: 0.7, t: 'ink' },
  { w: 0.58, t: 'soft' }, { w: 0.86, t: 'accent' }, { w: 0.5, t: 'soft' },
  { w: 0.74, t: 'ink' }, { w: 0.9, t: 'accent' }, { w: 0.6, t: 'soft' },
  { w: 0.82, t: 'accent' }, { w: 0.42, t: 'soft' },
];

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  align: 'left',            // 'left' | 'center'
  showReasons: true,        // supporting-reason row
  reasonCount: 3,           // how many reasons (0–3)
  showMotif: true,          // right-side throughput rhythm rail
  motifDensity: 14,         // rail bar count (8–14)
  showQuoteMark: true,      // oversized quotation mark
  showSource: true,         // data-source line
  showDecorations: true,    // glow / lens / heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Developer Tools' },
  { key: 'kicker', label: 'kicker', type: 'text', default: '研发效率提升' },
  { key: 'tag', label: 'tag', type: 'text', default: 'Insight · 金句' },
  { key: 'quoteLead', label: 'quoteLead', type: 'text', default: '研发效率，是企业最直接的' },
  { key: 'quoteEm1', label: 'quoteEm1', type: 'text', default: 'AI 预算入口' },
  { key: 'quoteMid', label: 'quoteMid', type: 'text', default: '之一；能嵌入' },
  { key: 'quoteEm2', label: 'quoteEm2', type: 'text', default: '日常开发循环' },
  { key: 'quoteTail', label: 'quoteTail', type: 'text', default: '的工具，留存最强。' },
  { key: 'source', label: '来源', type: 'text', default: '数据来源 · AI Capital Lab 自建数据库 / 公开融资披露 · 2024 全年口径 ≥1 亿美元' },
  { key: 'align', label: '对齐方式', type: 'radio', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    description: '金句与辅助信息的整体对齐方式。' },
  { key: 'showReasons', label: '辅助信息', type: 'toggle', default: true,
    description: '底部支撑理由行的显隐。' },
  { key: 'reasonCount', label: '卡片数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '展示的支撑理由条目数量（0–3）。', showWhen: (p) => p.showReasons },
  { key: 'showMotif', label: '装饰图形', type: 'toggle', default: true,
    description: '右侧研发节奏律动条装饰的显隐。' },
  { key: 'motifDensity', label: '装饰密度', type: 'slider', default: 14, min: 8, max: 14, step: 1,
    description: '律动条数量，控制装饰密度。', showWhen: (p) => p.showMotif },
  { key: 'showQuoteMark', label: '引号装饰', type: 'toggle', default: true,
    description: '超大引号装饰符号的显隐。' },
  { key: 'showSource', label: '数据来源', type: 'toggle', default: true,
    description: '底部数据来源说明行的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、镜头光斑与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于金句重点词与装饰图形。' },
];

const CSS = `
.aic-dev { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 120px; }
.aic-dev, .aic-dev * { box-sizing: border-box; }
.aic-dev .dv-glow { position: absolute; left: 8%; top: 32%; width: 60%; height: 78%; transform: translateY(-40%);
  pointer-events: none; background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 17%, transparent), transparent 70%); }
.aic-dev .dv-lens { position: absolute; right: 132px; top: 122px; width: 188px; height: 188px; opacity: .85; }

.aic-dev .dv-eyebrow { position: absolute; top: 96px; left: var(--pad); right: var(--pad);
  display: flex; align-items: center; gap: 22px; font-family: var(--aic-font-display); font-weight: 600;
  font-size: 22px; letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); }
.aic-dev .dv-eyebrow i { flex: none; width: 11px; height: 11px; border-radius: 50%; background: var(--aic-accent); }
.aic-dev .dv-eyebrow s { flex: 1; height: 1.5px; background: var(--aic-hair); text-decoration: none; }
.aic-dev .dv-eyebrow b { font-family: var(--aic-font-text); font-weight: 700; letter-spacing: .04em;
  text-transform: none; font-size: 22px; color: var(--aic-ink-dim); }

.aic-dev .dv-body { position: absolute; left: var(--pad); top: 50%; transform: translateY(-56%);
  display: flex; flex-direction: column; max-width: 1320px; }
.aic-dev.is-center .dv-body { left: 50%; transform: translate(-50%,-56%); align-items: center; text-align: center; max-width: 1480px; }

.aic-dev .dv-tag { display: inline-flex; align-items: center; gap: 12px; align-self: flex-start;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--aic-accent-deep); background: color-mix(in srgb, var(--aic-accent) 16%, transparent);
  padding: 9px 18px; border-radius: 999px; margin-bottom: 30px; }
.aic-dev.is-center .dv-tag { align-self: center; }

.aic-dev .dv-mark { font-family: var(--aic-font-display); font-weight: 700; font-size: 168px; line-height: .5;
  color: var(--aic-accent); height: 78px; }
.aic-dev .dv-text { font-family: var(--aic-font-text); font-weight: 900; font-size: 96px; line-height: 1.14;
  letter-spacing: -.01em; margin: 0; text-wrap: balance; }
.aic-dev .dv-text em { font-style: normal; color: var(--aic-accent);
  background: linear-gradient(180deg, transparent 64%, color-mix(in srgb, var(--aic-accent) 30%, transparent) 64%); }
.aic-dev .dv-rule { width: 124px; height: 5px; border-radius: 999px; background: var(--aic-ink); margin: 48px 0 0; }
.aic-dev.is-center .dv-rule { align-self: center; }

/* throughput rhythm rail (right) */
.aic-dev .dv-rail { position: absolute; right: var(--pad); top: 252px; bottom: 320px; width: 360px;
  display: flex; flex-direction: column; justify-content: center; gap: 14px; }
.aic-dev .dv-rail-cap { position: absolute; top: -42px; right: 0; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .16em; text-transform: uppercase; color: var(--aic-faint); }
.aic-dev .dv-rail-bar { height: 14px; border-radius: 999px; transition: width .5s cubic-bezier(.3,.7,.4,1); }

.aic-dev .dv-reasons { position: absolute; left: var(--pad); right: var(--pad); bottom: 184px;
  display: grid; gap: 44px; }
.aic-dev.is-center .dv-reasons { text-align: left; }
.aic-dev .dv-r { display: flex; flex-direction: column; gap: 9px; padding-top: 22px; border-top: 2px solid var(--aic-ink); }
.aic-dev .dv-r-idx { font-family: var(--aic-font-display); font-weight: 700; font-size: 20px; letter-spacing: .12em; color: var(--aic-accent-deep); }
.aic-dev .dv-r-ttl { font-family: var(--aic-font-text); font-weight: 800; font-size: 30px; color: var(--aic-ink); line-height: 1; }
.aic-dev .dv-r-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 20px; color: var(--aic-muted); line-height: 1.4; }

.aic-dev .dv-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 90px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-dev .dv-src { font-family: var(--aic-font-display); font-weight: 500; font-size: 20px; letter-spacing: .04em; color: var(--aic-faint); }
.aic-dev .dv-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['accent','pos','accent','soft','pos','accent','pos','accent','soft','accent','pos','accent',
  'pos','soft','accent','pos','accent','soft','accent','pos','pos','accent','accent','pos','soft','accent',
  'accent','pos','pos','accent','soft','accent','pos','pos','accent','accent']
  .map((t) => ({ tone: t === 'soft' ? 'faint' : t }));

const RAIL_TONE = {
  accent: 'var(--aic-accent)',
  soft: 'color-mix(in srgb, var(--aic-accent) 34%, white)',
  ink: 'var(--aic-hair-strong)',
};

export default function DevToolsPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-dev', CSS);
  const vars = themeVars(p.accentColor);

  const align = p.align === 'center' ? 'center' : 'left';
  const reasonN = Math.max(0, Math.min(3, p.reasonCount));
  const reasons = copy.reasons.slice(0, reasonN);
  const showReasons = p.showReasons && reasonN > 0;

  const railN = Math.max(8, Math.min(RAIL.length, p.motifDensity));
  const rail = RAIL.slice(0, railN);
  const showMotif = p.showMotif && align === 'left';

  return (
    <div className={'aic-dev is-' + align} style={vars}>
      {p.showDecorations && <div className="dv-glow" />}
      {p.showDecorations && <div className="dv-lens"><LensCluster /></div>}

      <div className="dv-eyebrow">
        <i />{copy.eyebrow}<s />
        <b>{copy.kicker}</b>
      </div>

      <div className="dv-body" style={{ top: showReasons ? '43%' : '50%' }}>
        <span className="dv-tag">{copy.tag}</span>
        {p.showQuoteMark && <div className="dv-mark">“</div>}
        <h2 className="dv-text">
          {copy.quoteLead}<em>{copy.quoteEm1}</em>{copy.quoteMid}<em>{copy.quoteEm2}</em>{copy.quoteTail}
        </h2>
        <div className="dv-rule" />
      </div>

      {showMotif && (
        <div className="dv-rail">
          <span className="dv-rail-cap">research throughput</span>
          {rail.map((b, i) => (
            <div className="dv-rail-bar" key={i}
              style={{ width: (b.w * 100) + '%', background: RAIL_TONE[b.t] }} />
          ))}
        </div>
      )}

      {showReasons && (
        <div className="dv-reasons" style={{ gridTemplateColumns: `repeat(${reasonN}, 1fr)` }}>
          {reasons.map((r) => (
            <div className="dv-r" key={r.idx}>
              <span className="dv-r-idx">{r.idx}</span>
              <span className="dv-r-ttl">{r.title}</span>
              <span className="dv-r-note">{r.note}</span>
            </div>
          ))}
        </div>
      )}

      <div className="dv-foot">
        {p.showSource ? <div className="dv-src">{copy.source}</div> : <span />}
        {p.showDecorations && <div className="dv-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
