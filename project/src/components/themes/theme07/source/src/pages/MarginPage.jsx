/**
 * MarginPage — P75 毛利天花板 (Compute Cost Risk · Big Number)
 *
 * A big-number anchor slide for the risk chapter: one oversized figure ("61%")
 * — the simulated growth in training budget — dominates the canvas, paired with
 * a signature "margin-ceiling" gauge that shows compute cost pressing margin up
 * against a hard ceiling. Supporting metrics, an explanatory note and the brand
 * lens motif complete the composition.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-mg`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Compute Cost Risk',
  title: '毛利天花板',
  sub: '风险 · 算力成本',
  kicker: '训练预算压力',
  // hero number — 61% (lead in ink, unit trailing)
  numLead: '61',
  numTail: '',
  numUnit: '%',
  numCaption: '训练预算模拟增长幅度',
  // margin-ceiling gauge — revenue split (sums to 100)
  ceilingLabel: '毛利天花板',
  gaugeCap: '每 1 元收入的成本构成',
  gauge: [
    { label: '算力成本', value: 31, tone: 'neg' },
    { label: '其他成本', value: 15, tone: 'faint' },
    { label: '可分配毛利', value: 54, tone: 'accent' },
  ],
  note: '如果推理成本降不下来，收入增长会被毛利吞掉。',
  closing: '算力成本是模型商业化的硬约束。',
  // supporting metrics (order fixed; count is prop-driven)
  aux: [
    { label: '推理成本占收入', value: '31', unit: '%' },
    { label: '毛利率中位数', value: '54', unit: '%' },
    { label: '单位推理成本', value: '-19', unit: '%' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  numberSlant: true,     // brand italic-slant on the hero digits
  auxCount: 3,           // supporting metric chips (0–3)
  showCaption: true,     // explanatory caption under the number
  showGauge: true,       // margin-ceiling gauge (signature device)
  showNote: true,        // supporting note line
  showLens: true,        // brand lens-cluster motif
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Compute Cost Risk' },
  { key: 'title', label: '标题', type: 'text', default: '毛利天花板' },
  { key: 'sub', label: '次标题', type: 'text', default: '风险 · 算力成本' },
  { key: 'kicker', label: 'kicker', type: 'text', default: '训练预算压力' },
  { key: 'numLead', label: 'numLead', type: 'text', default: '61' },
  { key: 'numUnit', label: 'numUnit', type: 'text', default: '%' },
  { key: 'numCaption', label: 'numCaption', type: 'text', default: '训练预算模拟增长幅度' },
  { key: 'ceilingLabel', label: 'ceilingLabel', type: 'text', default: '毛利天花板' },
  { key: 'gaugeCap', label: 'gaugeCap', type: 'text', default: '每 1 元收入的成本构成' },
  { key: 'note', label: 'note', type: 'text', default: '如果推理成本降不下来，收入增长会被毛利吞掉。' },
  { key: 'closing', label: '结语', type: 'text', default: '算力成本是模型商业化的硬约束。' },
  { key: 'numberSlant', label: '数字倾斜', type: 'toggle', default: true,
    description: '主数字是否应用品牌斜切（italic-slant）效果。' },
  { key: 'auxCount', label: '卡片数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '辅助指标数量（0–3）；为 0 时只保留主数字。' },
  { key: 'showCaption', label: '说明文案', type: 'toggle', default: true,
    description: '主数字下方解释性说明的显隐。' },
  { key: 'showGauge', label: '示意图形', type: 'toggle', default: true,
    description: '成本 / 毛利构成的天花板示意条的显隐。' },
  { key: 'showNote', label: '辅助注释', type: 'toggle', default: true,
    description: '底部补充注释的显隐。' },
  { key: 'showLens', label: '品牌图形', type: 'toggle', default: true,
    description: '品牌透镜图形（焦点圆盘）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于主数字点缀、毛利段与品牌图形。' },
];

const TONE = { neg: 'var(--aic-neg)', warn: 'var(--aic-warn)', accent: 'var(--aic-accent)',
  faint: 'var(--aic-hair-strong)' };

const CSS = `
.aic-mg { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-mg, .aic-mg * { box-sizing: border-box; }
.aic-mg .mg-glow { position: absolute; left: 34%; top: 22%; width: 60%; height: 66%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 72%); }
.aic-mg .mg-lens { position: absolute; right: -150px; bottom: -170px; width: 600px; height: 600px; opacity: .5; pointer-events: none; }

.aic-mg .mg-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-mg .mg-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-mg .mg-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 60px; line-height: .96; margin: 0; }
.aic-mg .mg-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left zone: number + gauge + note (flex column) */
.aic-mg .mg-left { position: absolute; left: var(--pad); top: 300px; width: 1060px; bottom: 138px;
  display: flex; flex-direction: column; }

/* hero number */
.aic-mg .mg-kicker { display: flex; align-items: center; gap: 16px; margin: 0 0 6px; }
.aic-mg .mg-kicker b { width: 64px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-mg .mg-kicker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-mg .mg-bignum { line-height: .8; }
.aic-mg .mg-caption { font-family: var(--aic-font-text); font-weight: 600; font-size: 34px; color: var(--aic-ink-dim);
  margin: 16px 0 0; max-width: 980px; }

/* margin-ceiling gauge */
.aic-mg .mg-gauge { margin-top: 34px; }
.aic-mg .mg-gauge-cap { display: flex; align-items: center; justify-content: space-between;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 12px; }
.aic-mg .mg-gauge-cap > span { white-space: nowrap; }
.aic-mg .mg-gauge-cap s { text-decoration: none; display: inline-flex; align-items: center; gap: 8px; color: var(--aic-neg); white-space: nowrap; }
.aic-mg .mg-gauge-cap s::before { content: ''; width: 26px; height: 0; border-top: 2px dashed var(--aic-neg); }
.aic-mg .mg-bar { display: flex; height: 88px; border-radius: 16px; overflow: hidden; border: 1.5px solid var(--aic-hair);
  background: var(--aic-card); }
.aic-mg .mg-seg { display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 22px;
  position: relative; min-width: 0; transition: flex-basis .6s cubic-bezier(.3,.7,.4,1); }
.aic-mg .mg-seg + .mg-seg { border-left: 2px solid var(--aic-paper); }
.aic-mg .mg-seg-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 18px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; }
.aic-mg .mg-seg-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; line-height: 1;
  font-variant-numeric: tabular-nums; }
.aic-mg .mg-seg[data-tone="neg"]   { background: color-mix(in srgb, var(--aic-neg) 13%, var(--aic-card)); }
.aic-mg .mg-seg[data-tone="neg"] .mg-seg-l,
.aic-mg .mg-seg[data-tone="neg"] .mg-seg-v { color: var(--aic-neg); }
.aic-mg .mg-seg[data-tone="faint"] { background: color-mix(in srgb, var(--aic-ink) 5%, var(--aic-card)); }
.aic-mg .mg-seg[data-tone="faint"] .mg-seg-l,
.aic-mg .mg-seg[data-tone="faint"] .mg-seg-v { color: var(--aic-muted); }
.aic-mg .mg-seg[data-tone="accent"] { background: linear-gradient(150deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 96%); }
.aic-mg .mg-seg[data-tone="accent"] .mg-seg-l { color: var(--aic-accent-deep); }
.aic-mg .mg-seg[data-tone="accent"] .mg-seg-v { color: var(--aic-ink); }
/* ceiling line on top of the gauge */
.aic-mg .mg-ceiling { display: flex; align-items: center; gap: 14px; margin: 0 0 10px; }
.aic-mg .mg-ceiling i { flex: 1; height: 0; border-top: 3px solid var(--aic-ink); }
.aic-mg .mg-ceiling span { font-family: var(--aic-font-display); font-weight: 700; font-size: 18px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--aic-ink); white-space: nowrap; }

/* supporting metrics — right column, vertical cards (fills right zone) */
.aic-mg .mg-aux { position: absolute; right: var(--pad); top: 352px; width: 560px;
  display: flex; flex-direction: column; gap: 24px; }
.aic-mg .mg-aux-item { display: flex; flex-direction: column; gap: 8px; padding: 24px 30px;
  border-radius: 20px; background: var(--aic-card); border: 1.5px solid var(--aic-hair); border-left: 6px solid var(--aic-accent); }
.aic-mg .mg-aux-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 22px; color: var(--aic-muted); }
.aic-mg .mg-aux-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 56px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-mg .mg-aux-val u { text-decoration: none; font-size: 22px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

.aic-mg .mg-note { margin-top: auto; padding-top: 24px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 24px; color: var(--aic-muted);
  display: flex; align-items: center; gap: 14px; max-width: 1000px; }
.aic-mg .mg-note::before { content: ''; width: 26px; height: 2px; background: var(--aic-hair-strong); flex: none; }

.aic-mg .mg-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-mg .mg-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-mg .mg-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-mg .mg-deco { width: 300px; height: 30px; }
`;

const HEAT = ['neg','warn','neg','warn','accent','warn','pos','accent','warn','accent','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

const LENS_DISCS = [
  { x: 40, y: 36, d: 54 },
  { x: 66, y: 30, d: 38 },
  { x: 56, y: 64, d: 48 },
  { x: 80, y: 58, d: 28 },
];

export default function MarginPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-mg', CSS);
  const vars = themeVars(p.accentColor);

  const auxN = Math.max(0, Math.min(copy.aux.length, p.auxCount));
  const aux = copy.aux.slice(0, auxN);

  return (
    <div className="aic-mg" style={vars}>
      {p.showDecorations && <div className="mg-glow" />}
      {p.showLens && <div className="mg-lens"><LensCluster discs={LENS_DISCS} /></div>}

      <div className="mg-head">
        <div>
          <p className="mg-eyebrow">{copy.eyebrow}</p>
          <h2 className="mg-title">{copy.title}</h2>
        </div>
        <div className="mg-sub">{copy.sub}</div>
      </div>

      <div className="mg-left">
        <div className="mg-kicker"><b /><span>{copy.kicker}</span></div>
        <div className="mg-bignum">
          <BigNumber lead={copy.numLead} tail={copy.numTail} unit={copy.numUnit}
            slant={p.numberSlant} size={230} />
        </div>
        {p.showCaption && <p className="mg-caption">{copy.numCaption}</p>}

        {p.showGauge && (
          <div className="mg-gauge">
            <div className="mg-ceiling"><span>{copy.ceilingLabel}</span><i /></div>
            <div className="mg-gauge-cap">
              <span>{copy.gaugeCap}</span>
              <s>成本侵蚀</s>
            </div>
            <div className="mg-bar">
              {copy.gauge.map((g) => (
                <div className="mg-seg" key={g.label} data-tone={g.tone}
                  style={{ flex: `${g.value} 0 0%` }}>
                  <span className="mg-seg-l">{g.label}</span>
                  <span className="mg-seg-v">{g.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {p.showNote && <div className="mg-note">{copy.note}</div>}
      </div>

      {auxN > 0 && (
        <div className="mg-aux">
          {aux.map((a) => (
            <div className="mg-aux-item" key={a.label}>
              <div className="mg-aux-lbl">{a.label}</div>
              <div className="mg-aux-val">{a.value}<u>{a.unit}</u></div>
            </div>
          ))}
        </div>
      )}

      <div className="mg-foot">
        <div className="mg-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="mg-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
