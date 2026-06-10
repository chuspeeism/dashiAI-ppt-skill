/**
 * MethodPage — P04 研究方法 (Methodology · Cross Analysis)
 *
 * Prop-driven slide. Scoped under `.aic-mth`.
 * Shared deps: ./theme.js, ./viz.jsx (Barcode).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Methodology',
  title: '研究方法',
  sub: '横纵分析法',
  lead: '横向看同一时间截面的公司、赛道、轮次和地区；纵向看融资额、事件数和市场节奏的变化。',
  closing: '不是罗列融资新闻，而是把融资数据变成结构化判断。',
  layers: [
    { no: 'H', zh: '横向分析', en: 'Horizontal', desc: '同一时间截面下，对比公司、赛道、轮次与地区的资本分布。', q: '钱流向了哪里？' },
    { no: 'V', zh: '纵向分析', en: 'Vertical', desc: '沿时间轴观察融资额、事件数与市场节奏的演化。', q: '热度如何变化？' },
    { no: 'X', zh: '交叉判断', en: 'Cross', desc: '横纵交叉、产业分层，判断哪些方向真正能够兑现。', q: '哪些方向能兑现？' },
  ],
  steps: [
    ['空间对比', '横向'],
    ['时间演化', '纵向'],
    ['产业分层', '交叉'],
    ['资本流向', '目标'],
  ],
};

export const defaultProps = {
  copy: COPY,
  cardCount: 3,
  focusEnabled: true,
  focusIndex: 2,
  layout: 'stack', // 'stack' | 'row'
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'cardCount', label: '方法卡数量', type: 'slider', default: 3, min: 1, max: 3, step: 1,
    description: '展示的方法层数量（1–3）。' },
  { key: 'layout', label: '排布方式', type: 'radio', default: 'stack',
    options: [{ value: 'stack', label: '堆叠' }, { value: 'row', label: '并排' }],
    description: '方法卡的排布：纵向堆叠或横向并排。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一方法层作为重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 2,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的方法卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '底部方法链与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-mth { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-mth, .aic-mth * { box-sizing: border-box; }
.aic-mth .mth-glow { position: absolute; left: -8%; bottom: -14%; width: 56%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }
.aic-mth .mth-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-mth .mth-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-mth .mth-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-mth .mth-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-mth .mth-lead { position: absolute; left: var(--pad); top: 280px; width: 880px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5; color: var(--aic-ink); margin: 0; }
.aic-mth .mth-steps { position: absolute; left: var(--pad); top: 540px; display: flex; align-items: stretch; gap: 0; }
.aic-mth .mth-step { display: flex; flex-direction: column; gap: 8px; padding: 0 30px; position: relative; }
.aic-mth .mth-step:first-child { padding-left: 0; }
.aic-mth .mth-step + .mth-step::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px;
  width: 1.5px; background: var(--aic-hair-strong); }
.aic-mth .mth-step u { text-decoration: none; font-family: var(--aic-font-display); font-weight: 600; font-size: 17px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--aic-faint); }
.aic-mth .mth-step b { font-family: var(--aic-font-text); font-weight: 700; font-size: 30px; color: var(--aic-ink); }
.aic-mth .mth-closing { position: absolute; left: var(--pad); bottom: 84px; display: flex; align-items: center; gap: 16px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); max-width: 820px; }
.aic-mth .mth-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

.aic-mth .mth-cards { position: absolute; right: var(--pad); top: 282px; bottom: 84px; width: 760px; display: flex; }
.aic-mth .mth-cards[data-layout="stack"] { flex-direction: column; gap: 20px; }
.aic-mth .mth-cards[data-layout="row"] { flex-direction: row; gap: 18px; }
.aic-mth .mth-card { position: relative; overflow: hidden; flex: 1; border-radius: 20px; padding: 30px 34px;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair); display: flex; align-items: center; gap: 26px;
  transition: background .3s, border-color .3s, transform .3s; }
.aic-mth .mth-cards[data-layout="row"] .mth-card { flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 30px 26px; }
.aic-mth .mth-card[data-focus="1"] { background: var(--aic-accent); border-color: var(--aic-accent); transform: translateX(-8px); }
.aic-mth .mth-cards[data-layout="row"] .mth-card[data-focus="1"] { transform: translateY(-8px); }
.aic-mth .mth-badge { flex: none; width: 84px; height: 84px; border-radius: 18px; display: grid; place-items: center;
  background: var(--aic-ink); color: var(--aic-accent); font-family: var(--aic-font-display); font-weight: 700;
  font-size: 40px; transform: skewX(-8deg); }
.aic-mth .mth-card[data-focus="1"] .mth-badge { background: var(--aic-ink); color: var(--aic-accent); }
.aic-mth .mth-badge span { transform: skewX(8deg); }
.aic-mth .mth-card-body { display: flex; flex-direction: column; gap: 7px; }
.aic-mth .mth-card-zh { font-family: var(--aic-font-text); font-weight: 700; font-size: 32px; color: var(--aic-ink); margin: 0;
  display: flex; align-items: baseline; gap: 14px; }
.aic-mth .mth-card-zh em { font-style: normal; font-family: var(--aic-font-display); font-weight: 500; font-size: 18px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--aic-muted); }
.aic-mth .mth-card[data-focus="1"] .mth-card-zh, .aic-mth .mth-card[data-focus="1"] .mth-card-zh em { color: var(--aic-ink); }
.aic-mth .mth-card[data-focus="1"] .mth-card-zh em { color: rgba(14,17,11,.6); }
.aic-mth .mth-card-desc { font-family: var(--aic-font-text); font-weight: 500; font-size: 22px; line-height: 1.45;
  color: var(--aic-ink-dim); margin: 0; }
.aic-mth .mth-card[data-focus="1"] .mth-card-desc { color: rgba(14,17,11,.74); }
.aic-mth .mth-card-q { font-family: var(--aic-font-text); font-weight: 700; font-size: 22px; color: var(--aic-ink);
  margin: 8px 0 0; opacity: .0; height: 0; transition: opacity .3s; }
.aic-mth .mth-card[data-focus="1"] .mth-card-q { opacity: 1; height: auto; }
.aic-mth .mth-deco { position: absolute; right: var(--pad); bottom: 30px; width: 320px; height: 34px; z-index: 2; }
`;

const DECO = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent']
  .map((tone) => ({ tone }));

export default function MethodPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-mth', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(1, Math.min(3, p.cardCount));
  const layers = copy.layers.slice(0, n);
  const layout = p.layout === 'row' ? 'row' : 'stack';
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  return (
    <div className="aic-mth" style={vars}>
      {p.showDecorations && <div className="mth-glow" />}
      <div className="mth-head">
        <div>
          <p className="mth-eyebrow">{copy.eyebrow}</p>
          <h2 className="mth-title">{copy.title}</h2>
        </div>
        <div className="mth-sub">{copy.sub}</div>
      </div>

      <p className="mth-lead">{copy.lead}</p>

      <div className="mth-steps">
        {copy.steps.map(([k, v]) => (
          <div className="mth-step" key={k}><u>{v}</u><b>{k}</b></div>
        ))}
      </div>

      <div className="mth-closing"><b />{copy.closing}</div>

      <div className="mth-cards" data-layout={layout}>
        {layers.map((l, i) => (
          <div className="mth-card" key={l.no} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
            <div className="mth-badge"><span>{l.no}</span></div>
            <div className="mth-card-body">
              <p className="mth-card-zh">{l.zh}<em>{l.en}</em></p>
              <p className="mth-card-desc">{l.desc}</p>
              <p className="mth-card-q">{l.q}</p>
            </div>
          </div>
        ))}
      </div>

      {p.showDecorations && <div className="mth-deco"><HeatStrip data={DECO} gap={4} /></div>}
    </div>
  );
}
