/**
 * ChapterPage — P15 市场数据深拆 (Chapter Divider)
 *
 * Section-divider slide: an oversized chapter index, a large title and a row
 * of keyword chips, used to break a long deck into stages. Background variant,
 * keyword count, the giant index watermark, layout and decorations are all
 * prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-ch`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip, LensCluster).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, LensCluster } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Chapter',
  index: '02',
  title: '市场数据深拆',
  sub: '融资节奏、集中度与交易规模',
  lead: '从本章开始进入市场数据扩展部分，围绕融资集中度、季度节奏和金额区间展开。',
  closing: '下一组页面进入更细的拆解。',
  keywords: ['集中度', '季度节奏', '峰谷对比', '资金贡献'],
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
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Chapter' },
  { key: 'index', label: 'index', type: 'text', default: '02' },
  { key: 'title', label: '标题', type: 'text', default: '市场数据深拆' },
  { key: 'sub', label: '次标题', type: 'text', default: '融资节奏、集中度与交易规模' },
  { key: 'lead', label: '导言', type: 'text', default: '从本章开始进入市场数据扩展部分，围绕融资集中度、季度节奏和金额区间展开。' },
  { key: 'closing', label: '结语', type: 'text', default: '下一组页面进入更细的拆解。' },
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
.aic-ch { position: relative; width: 100%; height: 100%; overflow: hidden;
  font-family: var(--aic-font-text); --pad: 120px; }
.aic-ch, .aic-ch * { box-sizing: border-box; }
.aic-ch[data-bg="dark"]  { background: var(--aic-ink); color: var(--aic-paper); --ch-dim: rgba(250,250,246,.62); --ch-faint: rgba(250,250,246,.34); --ch-hair: rgba(250,250,246,.16); }
.aic-ch[data-bg="paper"] { background: var(--aic-paper); color: var(--aic-ink); --ch-dim: var(--aic-ink-dim); --ch-faint: var(--aic-faint); --ch-hair: var(--aic-hair); }

.aic-ch .ch-glow { position: absolute; right: -6%; top: 8%; width: 56%; height: 70%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 30%, transparent), transparent 70%); }
.aic-ch .ch-lens { position: absolute; right: 110px; top: 50%; transform: translateY(-50%); width: 520px; height: 520px; opacity: .92; }

/* giant index watermark */
.aic-ch .ch-index { position: absolute; right: 60px; bottom: -120px; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 760px; line-height: .7; color: transparent;
  -webkit-text-stroke: 3px var(--ch-hair); letter-spacing: -.04em; pointer-events: none; user-select: none;
  font-variant-numeric: lining-nums; }

.aic-ch .ch-body { position: absolute; left: var(--pad); right: var(--pad); top: 50%; transform: translateY(-52%);
  display: flex; flex-direction: column; }
.aic-ch.is-center .ch-body { align-items: center; text-align: center; }

.aic-ch .ch-eyebrow { display: flex; align-items: center; gap: 18px; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 24px; letter-spacing: .28em; text-transform: uppercase; color: var(--aic-accent); margin: 0 0 30px; }
.aic-ch .ch-eyebrow b { font-variant-numeric: tabular-nums; }
.aic-ch .ch-eyebrow s { display: inline-block; width: 64px; height: 2px; background: var(--aic-accent); text-decoration: none; }
.aic-ch.is-center .ch-eyebrow { justify-content: center; }

.aic-ch .ch-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 148px; line-height: .94;
  letter-spacing: -.01em; margin: 0; }
.aic-ch .ch-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 38px; color: var(--ch-dim);
  margin: 28px 0 0; }
.aic-ch .ch-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--ch-dim); margin: 32px 0 0; max-width: 1000px; }
.aic-ch.is-center .ch-lead { margin-left: auto; margin-right: auto; }

.aic-ch .ch-kw { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 52px; }
.aic-ch.is-center .ch-kw { justify-content: center; }
.aic-ch .ch-kw span { font-family: var(--aic-font-text); font-weight: 600; font-size: 26px;
  padding: 14px 28px; border-radius: 999px; border: 1.5px solid var(--ch-hair); color: var(--ch-dim);
  display: inline-flex; align-items: center; gap: 12px; }
.aic-ch .ch-kw span::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-ch .ch-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 84px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-ch .ch-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 26px; color: var(--ch-dim); }
.aic-ch .ch-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-ch .ch-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['accent','pos','accent','warn','pos','accent','pos','warn','accent','pos','accent','pos',
  'warn','pos','accent','pos','accent','warn','pos','accent','pos','accent','pos','warn','accent','pos',
  'accent','pos','warn','accent','pos','accent','pos','warn','accent','pos'].map((tone) => ({ tone }));

export default function ChapterPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, index: p.index !== undefined ? p.index : COPY.index, title: p.title !== undefined ? p.title : COPY.title, sub: p.sub !== undefined ? p.sub : COPY.sub, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, keywords: p.keywords !== undefined ? p.keywords : COPY.keywords };
  ensureFonts();
  injectScopedStyle('aic-ch', CSS);
  const vars = themeVars(p.accentColor);

  const bg = p.backgroundVariant === 'paper' ? 'paper' : 'dark';
  const align = p.layout === 'center' ? 'center' : 'left';
  const kwN = Math.max(2, Math.min(copy.keywords.length, p.keywordCount));
  const keywords = copy.keywords.slice(0, kwN);

  return (
    <div className={'aic-ch is-' + align} data-bg={bg} style={vars}>
      {p.showDecorations && <div className="ch-glow" />}
      {p.showDecorations && align === 'left' && <div className="ch-lens"><LensCluster /></div>}
      {p.showIndex && <div className="ch-index">{copy.index}</div>}

      <div className="ch-body">
        <p className="ch-eyebrow"><s />{copy.eyebrow}&nbsp;<b>{copy.index}</b></p>
        <h2 className="ch-title">{copy.title}</h2>
        <div className="ch-sub">{copy.sub}</div>
        <p className="ch-lead">{copy.lead}</p>
        {p.showKeywords && (
          <div className="ch-kw">
            {keywords.map((k) => <span key={k}>{k}</span>)}
          </div>
        )}
      </div>

      <div className="ch-foot">
        <div className="ch-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ch-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
