/**
 * CapitalChapterPage — P49 资本与地区结构 (Chapter Divider · Chapter 04)
 *
 * Section-divider slide opening the capital-structure part of the deck. Pairs
 * an oversized chapter index + title + keyword chips with a signature
 * geographic-cluster motif: dots sized by each hub's capital share, visualising
 * the geographic concentration the chapter is about. Background variant,
 * keyword count, the geo cluster, its node count, the index watermark, layout
 * and decorations are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-c4`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Chapter',
  index: '04',
  title: '资本与地区结构',
  sub: '轮次、投资人和地理集群',
  lead: '本章进入资本结构部分，拆解轮次、投资人、云厂商、NVIDIA 生态和地理分布。',
  closing: '下一组页面进入更细的拆解。',
  keywords: ['后期轮', '战略投资', '云资源', '湾区', '纽约', '西雅图'],
  clusterTitle: '地理集群 · 资本份额',
  // geographic hubs — share drives bubble size + grid placement
  hubs: [
    { label: '旧金山湾区', en: 'Bay Area', pct: 63.9, x: 36, y: 46, d: 60 },
    { label: '纽约', en: 'New York', pct: 12.4, x: 74, y: 30, d: 31 },
    { label: '西雅图', en: 'Seattle', pct: 9.8, x: 78, y: 70, d: 27 },
    { label: '波士顿', en: 'Boston', pct: 7.7, x: 24, y: 82, d: 23 },
    { label: '其他地区', en: 'Others', pct: 6.2, x: 56, y: 84, d: 19 },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  backgroundVariant: 'dark', // 'dark' | 'paper'
  layout: 'left',            // 'left' | 'center'
  showIndex: true,           // oversized chapter-index watermark
  showKeywords: true,        // keyword chip row
  keywordCount: 6,           // keyword count (3–6)
  showCluster: true,         // geographic-cluster motif (right side, left layout)
  hubCount: 5,               // geo hubs shown (3–5)
  showDecorations: true,     // glow / heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'backgroundVariant', label: '背景风格', type: 'radio', default: 'dark',
    options: [{ value: 'dark', label: '深色' }, { value: 'paper', label: '浅色' }],
    description: '章节页背景：深色（强换气节奏）/ 浅色（与正文统一）。' },
  { key: 'layout', label: '排版', type: 'radio', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    description: '标题与关键词的整体排布方式；居中时隐藏右侧集群图。' },
  { key: 'showIndex', label: '章节序号', type: 'toggle', default: true,
    description: '超大章节编号水印的显隐。' },
  { key: 'showKeywords', label: '关键词', type: 'toggle', default: true,
    description: '本章关键词标签行的显隐。' },
  { key: 'keywordCount', label: '关键词数量', type: 'slider', default: 6, min: 3, max: 6, step: 1,
    description: '展示的关键词数量（3–6）。', showWhen: (p) => p.showKeywords },
  { key: 'showCluster', label: '地理集群图', type: 'toggle', default: true,
    description: '右侧地理集群气泡图的显隐（仅左对齐排版生效）。', showWhen: (p) => p.layout === 'left' },
  { key: 'hubCount', label: '集群节点数量', type: 'slider', default: 5, min: 3, max: 5, step: 1,
    description: '地理集群展示的城市节点数量（3–5）。', showWhen: (p) => p.layout === 'left' && p.showCluster },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-c4 { position: relative; width: 100%; height: 100%; overflow: hidden;
  font-family: var(--aic-font-text); --pad: 120px; }
.aic-c4, .aic-c4 * { box-sizing: border-box; }
.aic-c4[data-bg="dark"]  { background: var(--aic-ink); color: var(--aic-paper); --c4-dim: rgba(250,250,246,.62); --c4-faint: rgba(250,250,246,.34); --c4-hair: rgba(250,250,246,.16); --c4-card: rgba(250,250,246,.05); }
.aic-c4[data-bg="paper"] { background: var(--aic-paper); color: var(--aic-ink); --c4-dim: var(--aic-ink-dim); --c4-faint: var(--aic-faint); --c4-hair: var(--aic-hair); --c4-card: var(--aic-card); }

.aic-c4 .c4-glow { position: absolute; right: -8%; top: 4%; width: 60%; height: 78%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 32%, transparent), transparent 70%); }

/* giant index watermark */
.aic-c4 .c4-index { position: absolute; left: -30px; bottom: -150px; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 720px; line-height: .7; color: transparent;
  -webkit-text-stroke: 3px var(--c4-hair); letter-spacing: -.04em; pointer-events: none; user-select: none;
  font-variant-numeric: lining-nums; }

.aic-c4 .c4-body { position: absolute; left: var(--pad); top: 50%; transform: translateY(-52%);
  width: 1180px; display: flex; flex-direction: column; }
.aic-c4.is-center .c4-body { left: var(--pad); right: var(--pad); width: auto; align-items: center; text-align: center; }

.aic-c4 .c4-eyebrow { display: flex; align-items: center; gap: 18px; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 24px; letter-spacing: .28em; text-transform: uppercase; color: var(--aic-accent); margin: 0 0 30px; }
.aic-c4 .c4-eyebrow b { font-variant-numeric: tabular-nums; }
.aic-c4 .c4-eyebrow s { display: inline-block; width: 64px; height: 2px; background: var(--aic-accent); text-decoration: none; }
.aic-c4.is-center .c4-eyebrow { justify-content: center; }

.aic-c4 .c4-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 142px; line-height: .94;
  letter-spacing: -.01em; margin: 0; }
.aic-c4 .c4-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 38px; color: var(--c4-dim); margin: 28px 0 0; }
.aic-c4 .c4-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--c4-dim); margin: 32px 0 0; width: 665px; }
.aic-c4.is-center .c4-lead { margin-left: auto; margin-right: auto; }

.aic-c4 .c4-kw { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 52px; max-width: 1040px; }
.aic-c4.is-center .c4-kw { justify-content: center; }
.aic-c4 .c4-kw span { font-family: var(--aic-font-text); font-weight: 600; font-size: 25px;
  padding: 13px 26px; border-radius: 999px; border: 1.5px solid var(--c4-hair); color: var(--c4-dim);
  display: inline-flex; align-items: center; gap: 12px; }
.aic-c4 .c4-kw span::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--aic-accent); flex: none; }

/* geographic cluster (right) */
.aic-c4 .c4-cluster { position: absolute; right: 96px; top: 50%; transform: translateY(-50%);
  width: 600px; height: 600px; }
.aic-c4 .c4-cluster-t { position: absolute; top: -18px; left: 0; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 19px; letter-spacing: .16em; text-transform: uppercase; color: var(--c4-faint); }
.aic-c4 .c4-ring { position: absolute; inset: 8% 8% 8% 8%; border-radius: 50%; border: 1.5px dashed var(--c4-hair); }
.aic-c4 .c4-ring.r2 { inset: 24% 24% 24% 24%; }
.aic-c4 .c4-hub { position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center;
  border-radius: 50%; text-align: center; }
.aic-c4 .c4-hub-disc { position: relative; width: 100%; height: 100%; border-radius: 50%;
  background: radial-gradient(circle at 36% 30%, var(--aic-accent-bright), var(--aic-accent) 56%, var(--aic-accent-deep) 98%);
  box-shadow: inset 6% 8% 18% rgba(255,255,255,.5), inset -8% -10% 22% rgba(60,110,10,.45);
  display: grid; place-items: center; }
.aic-c4 .c4-hub.lead .c4-hub-disc { box-shadow: inset 6% 8% 18% rgba(255,255,255,.5), inset -8% -10% 22% rgba(60,110,10,.45),
  0 0 0 8px color-mix(in srgb, var(--aic-accent) 22%, transparent); }
.aic-c4 .c4-hub-pct { font-family: var(--aic-font-display); font-weight: 700; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); line-height: 1; }
.aic-c4 .c4-hub-lbl { position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); white-space: nowrap;
  font-family: var(--aic-font-text); font-weight: 700; font-size: 19px; color: var(--c4-dim); }
.aic-c4 .c4-hub-lbl em { font-style: normal; font-family: var(--aic-font-display); font-weight: 500; font-size: 13px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--c4-faint); margin-left: 8px; }

.aic-c4 .c4-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 84px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-c4 .c4-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 26px; color: var(--c4-dim); }
.aic-c4 .c4-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-c4 .c4-deco { width: 300px; height: 28px; flex: none; }
`;

const HEAT = ['accent','pos','accent','warn','pos','accent','pos','warn','accent','pos','accent','pos',
  'warn','pos','accent','pos','accent','warn','pos','accent','pos','accent','pos','warn','accent','pos',
  'accent','pos','warn','accent','pos','accent','pos','warn','accent','pos'].map((tone) => ({ tone }));

export default function CapitalChapterPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-c4', CSS);
  const vars = themeVars(p.accentColor);

  const bg = p.backgroundVariant === 'paper' ? 'paper' : 'dark';
  const align = p.layout === 'center' ? 'center' : 'left';
  const kwN = Math.max(3, Math.min(copy.keywords.length, p.keywordCount));
  const keywords = copy.keywords.slice(0, kwN);
  const showCluster = align === 'left' && p.showCluster;
  const hubN = Math.max(3, Math.min(copy.hubs.length, p.hubCount));
  const hubs = copy.hubs.slice(0, hubN);

  return (
    <div className={'aic-c4 is-' + align} data-bg={bg} style={vars}>
      {p.showDecorations && <div className="c4-glow" />}
      {p.showIndex && <div className="c4-index">{copy.index}</div>}

      <div className="c4-body">
        <p className="c4-eyebrow"><s />{copy.eyebrow}&nbsp;<b>{copy.index}</b></p>
        <h2 className="c4-title">{copy.title}</h2>
        <div className="c4-sub">{copy.sub}</div>
        <p className="c4-lead">{copy.lead}</p>
        {p.showKeywords && (
          <div className="c4-kw">
            {keywords.map((k) => <span key={k}>{k}</span>)}
          </div>
        )}
      </div>

      {showCluster && (
        <div className="c4-cluster">
          <div className="c4-cluster-t">{copy.clusterTitle}</div>
          <div className="c4-ring" />
          <div className="c4-ring r2" />
          {hubs.map((h, i) => {
            const px = 80 + (h.d / 100) * 320; // diameter in px
            return (
              <div key={h.label} className={'c4-hub' + (i === 0 ? ' lead' : '')}
                style={{ left: h.x + '%', top: h.y + '%', width: px, height: px }}>
                <div className="c4-hub-disc">
                  <span className="c4-hub-pct" style={{ fontSize: Math.max(16, px * 0.26) }}>{h.pct}%</span>
                </div>
                <span className="c4-hub-lbl">{h.label}<em>{h.en}</em></span>
              </div>
            );
          })}
        </div>
      )}

      <div className="c4-foot">
        <div className="c4-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="c4-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
