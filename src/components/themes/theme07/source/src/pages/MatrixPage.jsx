/**
 * MatrixPage — P11 资本热度 × 商业兑现 (Heat vs. Monetization · Quadrant)
 *
 * Chart-led slide: a 2×2 opportunity matrix. The focus quadrant and the
 * representative-direction chips are prop-driven.
 *
 * Self-contained & prop-driven. Scoped under `.aic-matrix`.
 * Shared deps: ./theme.js, ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Heat vs. Monetization',
  title: '资本热度 × 商业兑现',
  sub: '四象限机会判断',
  lead: '把资本热度和商业兑现度交叉，可以区分明星兑现、叙事泡沫、隐形价值和等待验证四类机会。',
  closing: '资本正在从叙事驱动转向兑现驱动。',
  axisX: '商业兑现度',
  axisY: '资本热度',
  // grid position: col 1=左, 2=右; row 1=上, 2=下
  quadrants: [
    { name: '明星兑现', pos: '高热度 · 高兑现', dirs: ['基础设施', '数据平台'], tone: 'accent', col: 2, row: 1 },
    { name: '叙事泡沫', pos: '高热度 · 低兑现', dirs: ['通用模型', 'AGI 实验室'], tone: 'warn', col: 1, row: 1 },
    { name: '隐形价值', pos: '低热度 · 高兑现', dirs: ['垂直应用', '企业搜索'], tone: 'ink', col: 2, row: 2 },
    { name: '等待验证', pos: '低热度 · 低兑现', dirs: ['长尾工具', '安全', '早期硬件'], tone: 'faint', col: 1, row: 2 },
  ],
};
const TONE = { accent: 'var(--aic-accent)', warn: 'var(--aic-warn)', ink: 'var(--aic-ink)', faint: 'var(--aic-faint)' };

export const defaultProps = {
  copy: COPY,
  focusEnabled: true,
  focusIndex: 0,         // 明星兑现
  showSecondary: true,   // representative-direction chips
  showDecorations: true, // axis labels + arrows + glow
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一象限作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: COPY.quadrants.map((q, i) => ({ value: i, label: q.name })),
    description: '选择被高亮的象限。', showWhen: (p) => p.focusEnabled },
  { key: 'showSecondary', label: '辅助信息', type: 'toggle', default: true,
    description: '各象限代表方向标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '坐标轴标签、箭头与背景光晕等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-matrix { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-matrix, .aic-matrix * { box-sizing: border-box; }
.aic-matrix .mx-glow { position: absolute; right: 4%; top: 24%; width: 46%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-matrix .mx-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-matrix .mx-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-matrix .mx-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 74px; line-height: .96; margin: 0; white-space: nowrap; }
.aic-matrix .mx-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-matrix .mx-rail { position: absolute; left: var(--pad); top: 320px; width: 560px; display: flex; flex-direction: column; }
.aic-matrix .mx-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5; color: var(--aic-ink); margin: 0; }
.aic-matrix .mx-axis-key { margin-top: 52px; display: flex; flex-direction: column; gap: 18px; }
.aic-matrix .mx-axis-key .row { display: flex; align-items: center; gap: 14px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 23px; color: var(--aic-ink-dim); }
.aic-matrix .mx-axis-key .row u { text-decoration: none; font-family: var(--aic-font-display); font-weight: 700; font-size: 20px;
  color: var(--aic-ink); width: 26px; text-align: center; }
.aic-matrix .mx-closing { display: flex; align-items: center; gap: 16px; margin-top: 56px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-matrix .mx-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-matrix .mx-plot { position: absolute; right: var(--pad); top: 300px; width: 980px; height: 690px;
  padding-left: 56px; padding-bottom: 52px; }
.aic-matrix .mx-grid { position: relative; width: 100%; height: 100%; display: grid;
  grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px; }
.aic-matrix .mx-cell { position: relative; border-radius: 22px; padding: 30px 32px; overflow: hidden;
  border: 1.5px solid var(--aic-hair); display: flex; flex-direction: column; gap: 12px;
  transition: transform .3s, box-shadow .3s, border-color .3s; }
.aic-matrix .mx-cell[data-focus="1"] { transform: scale(1.03); border-color: transparent;
  box-shadow: 0 24px 60px -28px rgba(14,17,11,.4); }
.aic-matrix .mx-pos { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px;
  letter-spacing: .08em; text-transform: uppercase; }
.aic-matrix .mx-name { font-family: var(--aic-font-text); font-weight: 900; font-size: 44px; line-height: 1; margin: 0; }
.aic-matrix .mx-dirs { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; }
.aic-matrix .mx-dir { font-family: var(--aic-font-text); font-weight: 600; font-size: 20px;
  padding: 8px 16px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); color: var(--aic-ink-dim); }

.aic-matrix .mx-ylab { position: absolute; left: 0; top: 0; bottom: 52px; width: 56px; display: flex;
  align-items: center; justify-content: center; }
.aic-matrix .mx-ylab span { transform: rotate(-90deg); white-space: nowrap; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 20px; letter-spacing: .2em; text-transform: uppercase; color: var(--aic-muted); }
.aic-matrix .mx-xlab { position: absolute; left: 56px; right: 0; bottom: 0; height: 52px; display: flex;
  align-items: center; justify-content: center; font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .2em; text-transform: uppercase; color: var(--aic-muted); }
.aic-matrix .mx-arrow { position: absolute; background: var(--aic-hair-strong); }
.aic-matrix .mx-arrow.y { left: 27px; top: 0; bottom: 52px; width: 2px; }
.aic-matrix .mx-arrow.x { left: 56px; right: 0; bottom: 50px; height: 2px; }

.aic-matrix .mx-deco { position: absolute; left: var(--pad); bottom: 70px; width: 360px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

export default function MatrixPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-matrix', CSS);
  const vars = themeVars(p.accentColor);

  const qs = copy.quadrants;
  const focus = Math.max(0, Math.min(qs.length - 1, p.focusIndex));

  return (
    <div className="aic-matrix" style={vars}>
      {p.showDecorations && <div className="mx-glow" />}

      <div className="mx-head">
        <div>
          <p className="mx-eyebrow">{copy.eyebrow}</p>
          <h2 className="mx-title">{copy.title}</h2>
        </div>
        <div className="mx-sub">{copy.sub}</div>
      </div>

      <div className="mx-rail">
        <p className="mx-lead">{copy.lead}</p>
        <div className="mx-axis-key">
          <div className="row"><u>↕</u>纵轴 · {copy.axisY}（融资额与轮次）</div>
          <div className="row"><u>↔</u>横轴 · {copy.axisX}（收入确定性）</div>
        </div>
        <div className="mx-closing"><b />{copy.closing}</div>
      </div>

      <div className="mx-plot">
        {p.showDecorations && (
          <>
            <div className="mx-arrow y" /><div className="mx-arrow x" />
            <div className="mx-ylab"><span>{copy.axisY} 低 → 高</span></div>
            <div className="mx-xlab">{copy.axisX} 低 → 高</div>
          </>
        )}
        <div className="mx-grid">
          {qs.map((q, i) => {
            const isF = p.focusEnabled && i === focus;
            const tone = TONE[q.tone];
            const tint = `color-mix(in srgb, ${tone} 9%, var(--aic-card))`;
            const onDark = q.tone === 'ink';
            const fg = isF ? (onDark ? '#fff' : 'var(--aic-ink)') : 'var(--aic-ink)';
            return (
              <div className="mx-cell" key={q.name}
                style={{ gridColumn: q.col, gridRow: q.row, background: isF ? tone : tint,
                  color: fg }}>
                <span className="mx-pos" style={{ color: isF ? (onDark ? 'rgba(255,255,255,.6)' : 'rgba(14,17,11,.55)') : tone }}>{q.pos}</span>
                <h3 className="mx-name" style={{ color: fg }}>{q.name}</h3>
                {p.showSecondary && (
                  <div className="mx-dirs">
                    {q.dirs.map((d) => (
                      <span className="mx-dir" key={d}
                        style={isF
                          ? { color: onDark ? '#fff' : 'var(--aic-ink)', borderColor: onDark ? 'rgba(255,255,255,.35)' : 'rgba(14,17,11,.3)' }
                          : undefined}>{d}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {p.showDecorations && <div className="mx-deco"><HeatStrip data={HEAT} gap={4} /></div>}
    </div>
  );
}
