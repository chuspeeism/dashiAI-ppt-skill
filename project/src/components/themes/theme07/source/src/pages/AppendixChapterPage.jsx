/**
 * AppendixChapterPage — P81 附录与延展 (Chapter Divider · Appendix)
 *
 * Section-divider slide that opens the report's appendix/extension block:
 * an oversized chapter index, a large title and a row of keyword chips, used to
 * breathe between the main report and its back-matter (sources, forward view,
 * about the lab). Background variant, layout, the giant index watermark, the
 * keyword row and decorations are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-apx`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip, LensCluster).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, LensCluster } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Appendix',
  index: '06',
  title: '附录与延展',
  sub: '数据来源、前瞻指标与研究团队',
  lead: '正文之外，补充本报告的研究口径、数据来源、2025 年前瞻观察指标，以及研究团队信息，便于复核与延展阅读。',
  closing: '数据可复核，判断可延展。',
  keywords: ['研究口径', '数据来源', '前瞻指标', '关于团队'],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  backgroundVariant: 'dark', // 'dark' | 'paper'
  layout: 'left',            // 'left' | 'center'
  showIndex: true,           // oversized chapter-index watermark
  showKeywords: true,        // keyword chip row
  keywordCount: 4,           // keyword count (2–4)
  showDecorations: true,     // lens / glow / heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Appendix' },
  { key: 'index', label: 'index', type: 'text', default: '06' },
  { key: 'title', label: '标题', type: 'text', default: '附录与延展' },
  { key: 'sub', label: '次标题', type: 'text', default: '数据来源、前瞻指标与研究团队' },
  { key: 'lead', label: '导言', type: 'text', default: '正文之外，补充本报告的研究口径、数据来源、2025 年前瞻观察指标，以及研究团队信息，便于复核与延展阅读。' },
  { key: 'closing', label: '结语', type: 'text', default: '数据可复核，判断可延展。' },
  { key: 'backgroundVariant', label: '背景风格', type: 'radio', default: 'dark',
    options: [{ value: 'dark', label: '深色' }, { value: 'paper', label: '浅色' }],
    description: '章节页背景：深色（强换气节奏）/ 浅色（与正文统一）。' },
  { key: 'layout', label: '排版', type: 'radio', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    description: '标题与关键词的整体排布方式。' },
  { key: 'showIndex', label: '章节序号', type: 'toggle', default: true,
    description: '超大章节编号水印的显隐。' },
  { key: 'showKeywords', label: '关键词', type: 'toggle', default: true,
    description: '本章关键词标签行的显隐。' },
  { key: 'keywordCount', label: '关键词数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '展示的关键词数量（2–4）。', showWhen: (p) => p.showKeywords },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '镜头光斑、背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-apx { position: relative; width: 100%; height: 100%; overflow: hidden;
  font-family: var(--aic-font-text); --pad: 120px; }
.aic-apx, .aic-apx * { box-sizing: border-box; }
.aic-apx[data-bg="dark"]  { background: var(--aic-ink); color: var(--aic-paper); --ax-dim: rgba(250,250,246,.62); --ax-faint: rgba(250,250,246,.34); --ax-hair: rgba(250,250,246,.16); }
.aic-apx[data-bg="paper"] { background: var(--aic-paper); color: var(--aic-ink); --ax-dim: var(--aic-ink-dim); --ax-faint: var(--aic-faint); --ax-hair: var(--aic-hair); }

.aic-apx .apx-glow { position: absolute; right: -6%; top: 8%; width: 56%; height: 70%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 30%, transparent), transparent 70%); }
.aic-apx .apx-lens { position: absolute; right: 110px; top: 50%; transform: translateY(-50%); width: 520px; height: 520px; opacity: .92; }

/* giant index watermark */
.aic-apx .apx-index { position: absolute; right: 60px; bottom: -120px; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 760px; line-height: .7; color: transparent;
  -webkit-text-stroke: 3px var(--ax-hair); letter-spacing: -.04em; pointer-events: none; user-select: none;
  font-variant-numeric: lining-nums; }

.aic-apx .apx-body { position: absolute; left: var(--pad); right: var(--pad); top: 50%; transform: translateY(-52%);
  display: flex; flex-direction: column; }
.aic-apx.is-center .apx-body { align-items: center; text-align: center; }

.aic-apx .apx-eyebrow { display: flex; align-items: center; gap: 18px; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 24px; letter-spacing: .28em; text-transform: uppercase; color: var(--aic-accent); margin: 0 0 30px; }
.aic-apx .apx-eyebrow b { font-variant-numeric: tabular-nums; }
.aic-apx .apx-eyebrow s { display: inline-block; width: 64px; height: 2px; background: var(--aic-accent); text-decoration: none; }
.aic-apx.is-center .apx-eyebrow { justify-content: center; }

.aic-apx .apx-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 148px; line-height: .94;
  letter-spacing: -.01em; margin: 0; }
.aic-apx .apx-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 38px; color: var(--ax-dim);
  margin: 28px 0 0; }
.aic-apx .apx-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--ax-dim); margin: 32px 0 0; max-width: 1000px; text-wrap: pretty; }
.aic-apx.is-center .apx-lead { margin-left: auto; margin-right: auto; }

.aic-apx .apx-kw { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 52px; }
.aic-apx.is-center .apx-kw { justify-content: center; }
.aic-apx .apx-kw span { font-family: var(--aic-font-text); font-weight: 600; font-size: 26px;
  padding: 14px 28px; border-radius: 999px; border: 1.5px solid var(--ax-hair); color: var(--ax-dim);
  display: inline-flex; align-items: center; gap: 12px; }
.aic-apx .apx-kw span::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-apx .apx-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 84px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-apx .apx-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 26px; color: var(--ax-dim); }
.aic-apx .apx-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-apx .apx-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['accent','pos','accent','warn','pos','accent','pos','warn','accent','pos','accent','pos',
  'warn','pos','accent','pos','accent','warn','pos','accent','pos','accent','pos','warn','accent','pos',
  'accent','pos','warn','accent','pos','accent','pos','warn','accent','pos'].map((tone) => ({ tone }));

export default function AppendixChapterPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-apx', CSS);
  const vars = themeVars(p.accentColor);

  const bg = p.backgroundVariant === 'paper' ? 'paper' : 'dark';
  const align = p.layout === 'center' ? 'center' : 'left';
  const kwN = Math.max(2, Math.min(copy.keywords.length, p.keywordCount));
  const keywords = copy.keywords.slice(0, kwN);

  return (
    <div className={'aic-apx is-' + align} data-bg={bg} style={vars}>
      {p.showDecorations && <div className="apx-glow" />}
      {p.showDecorations && align === 'left' && <div className="apx-lens"><LensCluster /></div>}
      {p.showIndex && <div className="apx-index">{copy.index}</div>}

      <div className="apx-body">
        <p className="apx-eyebrow"><s />{copy.eyebrow}&nbsp;<b>{copy.index}</b></p>
        <h2 className="apx-title">{copy.title}</h2>
        <div className="apx-sub">{copy.sub}</div>
        <p className="apx-lead">{copy.lead}</p>
        {p.showKeywords && (
          <div className="apx-kw">
            {keywords.map((k) => <span key={k}>{k}</span>)}
          </div>
        )}
      </div>

      <div className="apx-foot">
        <div className="apx-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="apx-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
