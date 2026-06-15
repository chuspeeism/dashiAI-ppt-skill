/**
 * CoverPage — P01 报告封面 (Hero Cover)
 *
 * Self-contained, prop-driven slide. Renders at the deck design size
 * (fills its parent). All styling is scoped under `.aic-cover`.
 *
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip, BrandMark, LensCluster, BigNumber).
 * No Tweaks / preview-runtime dependency — content is fixed COPY, only the
 * exported `defaultProps` / `controls` drive structural + style variation.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, BrandMark, LensCluster, BigNumber } from '../viz.jsx';

// ── fixed editorial content (not a prop — text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'AI CAPITAL LAB · 2024',
  reportTag: '2024 · 调研报告',
  titleL1: '美国大额融资',
  titleL2: 'AI 公司调研报告',
  sub: '数据口径：2024 全年 · 单笔 ≥ 1 亿美元',
  thesis: '在资本与算力的浪潮里，每一笔融资都是一次方向的押注。',
  closing: '从资本流向，看 AI 产业下一阶段的真实重心。',
  featureNumber: '2024',
  featureLabel: 'DATA YEAR',
  specs: [
    ['年份', '2024'],
    ['口径', '≥ 1 亿美元'],
    ['日期', '2026.06'],
    ['主题', '美国 AI 大额融资'],
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  backgroundVariant: 'gradient', // 'gradient' | 'solid' | 'dark'
  heroMotif: 'both',             // 'lens' | 'number' | 'both'
  numberSlant: true,
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'AI CAPITAL LAB · 2024' },
  { key: 'reportTag', label: '标签', type: 'text', default: '2024 · 调研报告' },
  { key: 'titleL1', label: '标题行1', type: 'text', default: '美国大额融资' },
  { key: 'titleL2', label: '标题行2', type: 'text', default: 'AI 公司调研报告' },
  { key: 'sub', label: '次标题', type: 'text', default: '数据口径：2024 全年 · 单笔 ≥ 1 亿美元' },
  { key: 'thesis', label: '论点', type: 'text', default: '在资本与算力的浪潮里，每一笔融资都是一次方向的押注。' },
  { key: 'closing', label: '结语', type: 'text', default: '从资本流向，看 AI 产业下一阶段的真实重心。' },
  { key: 'featureNumber', label: '特征数字', type: 'text', default: '2024' },
  { key: 'featureLabel', label: '特征标签', type: 'text', default: 'DATA YEAR' },
  { key: 'backgroundVariant', label: '背景风格', type: 'radio', default: 'gradient',
    options: [
      { value: 'gradient', label: '光晕' },
      { value: 'solid', label: '纯色' },
      { value: 'dark', label: '深色' },
    ],
    description: '封面底色与氛围：浅色 + 渐变光晕 / 纯净浅色 / 深色反白。' },
  { key: 'heroMotif', label: '主视觉', type: 'radio', default: 'both',
    options: [
      { value: 'lens', label: '透镜' },
      { value: 'number', label: '数字' },
      { value: 'both', label: '组合' },
    ],
    description: '右侧主视觉：品牌透镜光斑 / 大号焦点数字 / 两者组合。' },
  { key: 'numberSlant', label: '数字倾斜', type: 'toggle', default: true,
    description: '大号数字采用品牌标志性的倾斜处理。' },
  { key: 'showDecorations', label: '装饰元素', type: 'toggle', default: true,
    description: '顶部标签、底部热力条与角落光晕等装饰细节的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于渐变、透镜、数字与高亮。' },
];

const CSS = `
.aic-cover { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink);
  font-family: var(--aic-font-text); --pad: 104px; }
.aic-cover, .aic-cover * { box-sizing: border-box; }
.aic-cover .cvr-glow { position: absolute; inset: 0; pointer-events: none; }

.aic-cover .cvr-header { position: absolute; top: 78px; left: var(--pad);
  right: var(--pad); display: flex; align-items: center; justify-content: space-between; z-index: 3; }
.aic-cover .cvr-tag { font-family: var(--aic-font-display); font-weight: 600;
  font-size: 22px; letter-spacing: .04em; color: var(--aic-ink);
  padding: 11px 22px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong);
  display: inline-flex; align-items: center; gap: 10px; background: color-mix(in srgb, var(--aic-paper) 70%, transparent); }
.aic-cover .cvr-tag b { width: 9px; height: 9px; border-radius: 50%;
  background: var(--aic-accent); display: inline-block; }

/* right hero motif zone */
.aic-cover .cvr-motif { position: absolute; right: -10px; top: 286px;
  width: 560px; height: 560px; z-index: 1; }
.aic-cover .cvr-num { position: absolute; right: 150px; top: 318px; z-index: 2;
  line-height: .8; user-select: none; }
.aic-cover .cvr-num-lbl { position: absolute; right: 156px; top: 280px; z-index: 2;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .34em; color: var(--aic-muted); text-transform: uppercase; }

.aic-cover .cvr-hero { position: absolute; left: var(--pad); top: 286px;
  width: 1080px; z-index: 2; }
.aic-cover .cvr-eyebrow { font-family: var(--aic-font-display); font-weight: 600;
  font-size: 26px; letter-spacing: .22em; color: var(--aic-muted);
  text-transform: uppercase; margin: 0 0 36px; }
.aic-cover .cvr-title { margin: 0; font-family: var(--aic-font-text); font-weight: 900;
  font-size: 130px; line-height: 1.0; letter-spacing: -0.015em; color: var(--aic-ink); }
.aic-cover .cvr-title span { display: block; }
.aic-cover .cvr-title .l2 em { font-style: normal; color: var(--aic-accent-deep); }
.aic-cover .cvr-sub { margin: 38px 0 0; font-size: 30px; color: var(--aic-ink-dim);
  font-weight: 500; letter-spacing: .01em; }

.aic-cover .cvr-thesis { position: absolute; left: var(--pad); bottom: 232px; z-index: 2;
  max-width: 1040px; font-family: var(--aic-font-text); font-weight: 500;
  font-size: 34px; line-height: 1.5; color: var(--aic-ink);
  padding-left: 26px; border-left: 4px solid var(--aic-accent); }

.aic-cover .cvr-deco { position: absolute; left: var(--pad); right: var(--pad);
  bottom: 168px; height: 60px; z-index: 2; }

.aic-cover .cvr-footer { position: absolute; left: var(--pad); right: var(--pad);
  bottom: 74px; display: flex; align-items: flex-end; justify-content: space-between;
  gap: 60px; z-index: 2; }
.aic-cover .cvr-closing { font-family: var(--aic-font-text); font-weight: 500;
  font-size: 27px; color: var(--aic-ink-dim); max-width: 720px; }
.aic-cover .cvr-specs { display: flex; gap: 56px; }
.aic-cover .cvr-spec { display: flex; flex-direction: column; gap: 8px; text-align: right; }
.aic-cover .cvr-spec u { text-decoration: none; font-family: var(--aic-font-display);
  font-weight: 500; font-size: 20px; letter-spacing: .14em; color: var(--aic-faint);
  text-transform: uppercase; }
.aic-cover .cvr-spec b { font-family: var(--aic-font-text); font-weight: 700;
  font-size: 27px; color: var(--aic-ink); white-space: nowrap; }
`;

function glowFor(variant) {
  if (variant === 'solid') return { background: 'none' };
  if (variant === 'dark') {
    return { background:
      'radial-gradient(900px 760px at 88% 64%, color-mix(in srgb, var(--aic-accent) 42%, transparent), transparent 64%),' +
      'radial-gradient(1100px 820px at -10% 6%, color-mix(in srgb, var(--aic-accent) 16%, transparent), transparent 70%)' };
  }
  // bolder, more saturated lime sweep — the signature gradient mesh,
  // kept lighter in the upper-right so the lens + number stay legible
  return { background:
    'radial-gradient(1180px 940px at 122% 4%, color-mix(in srgb, var(--aic-accent-bright) 46%, transparent), transparent 56%),' +
    'radial-gradient(1080px 940px at -10% 116%, color-mix(in srgb, var(--aic-accent) 62%, transparent), transparent 60%),' +
    'radial-gradient(720px 600px at 102% 104%, color-mix(in srgb, var(--aic-accent-bright) 54%, transparent), transparent 64%)' };
}

// dense green→orange→red market heat strip (brand barcode signature)
const HEAT = [
  'pos','pos','accent','pos','warn','pos','accent','neg','pos','warn','accent','pos','neg','pos',
  'warn','accent','pos','pos','neg','warn','accent','pos','warn','pos','accent','neg','pos','warn',
  'pos','accent','pos','neg','warn','pos','accent','pos','warn','neg','pos','accent','pos','pos',
  'warn','accent','neg','pos','warn','pos','accent','pos','pos','neg','warn','accent','pos','warn',
].map((tone) => ({ tone }));

// overlapping lens discs (the brand's focal-point / lens metaphor)
const DISCS = [
  { x: 40, y: 34, d: 50 },
  { x: 64, y: 26, d: 36 },
  { x: 56, y: 60, d: 46 },
  { x: 80, y: 54, d: 28 },
  { x: 34, y: 64, d: 26 },
];

export default function CoverPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-cover', CSS);

  const vars = themeVars(p.accentColor);
  if (p.backgroundVariant === 'dark') Object.assign(vars, {
    '--aic-paper': '#0C0E09', '--aic-ink': '#F5F7F0', '--aic-ink-dim': '#C8CBC0',
    '--aic-card': '#15180F', '--aic-muted': '#8E9286', '--aic-faint': '#5E6258',
    '--aic-hair': 'rgba(255,255,255,0.12)', '--aic-hair-strong': 'rgba(255,255,255,0.22)',
  });

  const showLens = p.heroMotif === 'lens' || p.heroMotif === 'both';
  const showNum = p.heroMotif === 'number' || p.heroMotif === 'both';

  return (
    <div className="aic-cover" style={vars}>
      <div className="cvr-glow" style={glowFor(p.backgroundVariant)} />

      <div className="cvr-header">
        <BrandMark size={62} />
        {p.showDecorations && <div className="cvr-tag"><b />{copy.reportTag}</div>}
      </div>

      {showLens && (
        <div className="cvr-motif"><LensCluster discs={DISCS} /></div>
      )}
      {showNum && (
        <>
          {p.showDecorations && <div className="cvr-num-lbl">{copy.featureLabel}</div>}
          <div className="cvr-num">
            <BigNumber lead={copy.featureNumber} slant={p.numberSlant} size={158}
              color="var(--aic-ink)" />
          </div>
        </>
      )}

      <div className="cvr-hero">
        <p className="cvr-eyebrow">{copy.eyebrow}</p>
        <h1 className="cvr-title">
          <span className="l1">{copy.titleL1}</span>
          <span className="l2"><em>AI</em> 公司调研报告</span>
        </h1>
        <p className="cvr-sub">{copy.sub}</p>
      </div>

      <p className="cvr-thesis">{copy.thesis}</p>

      {p.showDecorations && (
        <div className="cvr-deco"><HeatStrip data={HEAT} gap={5} /></div>
      )}

      <div className="cvr-footer">
        <div className="cvr-closing">{copy.closing}</div>
        <div className="cvr-specs">
          {copy.specs.map(([k, v]) => (
            <div className="cvr-spec" key={k}><u>{k}</u><b>{v}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}
