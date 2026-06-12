/**
 * SafetyPage — P41 评测、红队与合规 (AI Safety · Chart-led · Segment Card)
 *
 * Chart-led single-segment slide. The signature device is a layered "defense
 * stack": a vertical column of guard layers (evaluation → content safety →
 * compliance → red-team), each carrying a module name, a funding figure and a
 * coverage meter, sitting under a threat-intercept strip that filters red→green.
 * An editorial rail (lead + metric cards + closing) anchors the left. Chart
 * type, layer count, metric-card count, the threat strip and the focus card are
 * all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-saf`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BarRow, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BarRow, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'AI Safety',
  segment: 'AI 安全赛道',
  title: '评测、红队与合规',
  titleTail: 'AI 安全赛道',
  lead: 'AI 安全覆盖模型评测、红队测试、内容安全和合规监测；监管收紧会把它从可选预算变成刚性预算。',
  closing: '安全能力会成为企业采购门槛。',
  chartTitle: '安全防线 · 资金 / 亿美元',
  splitTitle: '防线资金占比',
  stripTitle: '风险拦截示意',
  // metric cards (order fixed; count is prop-driven)
  metrics: [
    { lbl: '融资额', val: '16', unit: '亿美元' },
    { lbl: '事件数', val: '8', unit: '笔' },
    { lbl: '模型评测', val: '6', unit: '亿美元' },
    { lbl: '合规监测', val: '5', unit: '亿美元' },
  ],
  // defense layers (order fixed; count is prop-driven). value = 亿美元
  layers: [
    { tier: 'L1', name: '模型评测', value: 6, note: '能力与风险基准测试' },
    { tier: 'L2', name: '内容安全', value: 5, note: '有害内容识别与过滤' },
    { tier: 'L3', name: '合规监测', value: 5, note: '审计链路与监管对齐' },
    { tier: 'L4', name: '红队测试', value: 4, note: '对抗攻击与越狱探测' },
  ],
};

const LAYER_FILL = [
  'linear-gradient(150deg, var(--aic-accent-bright), var(--aic-accent) 74%)',
  'color-mix(in srgb, var(--aic-accent) 56%, white)',
  'color-mix(in srgb, var(--aic-accent) 38%, white)',
  'color-mix(in srgb, var(--aic-accent) 24%, white)',
];

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'layers',   // 'layers' | 'bars'
  layerCount: 3,         // defense layers shown (2–4)
  metricCount: 4,        // metric cards shown (2–4)
  focusEnabled: true,    // highlight one metric card
  focusIndex: 0,         // which card is the focus (0-based)
  showStrip: true,       // threat-intercept strip above the stack
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'AI Safety' },
  { key: 'segment', label: 'segment', type: 'text', default: 'AI 安全赛道' },
  { key: 'title', label: '标题', type: 'text', default: '评测、红队与合规' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'AI 安全赛道' },
  { key: 'lead', label: '导言', type: 'text', default: 'AI 安全覆盖模型评测、红队测试、内容安全和合规监测；监管收紧会把它从可选预算变成刚性预算。' },
  { key: 'closing', label: '结语', type: 'text', default: '安全能力会成为企业采购门槛。' },
  { key: 'chartTitle', label: 'chartTitle', type: 'text', default: '安全防线 · 资金 / 亿美元' },
  { key: 'splitTitle', label: 'splitTitle', type: 'text', default: '防线资金占比' },
  { key: 'stripTitle', label: 'stripTitle', type: 'text', default: '风险拦截示意' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'layers',
    options: [{ value: 'layers', label: '防线分层' }, { value: 'bars', label: '占比条' }],
    description: '主图表样式：分层防线堆叠 / 资金占比条。' },
  { key: 'layerCount', label: '分项数量', type: 'slider', default: 3, min: 2, max: 4, step: 1,
    description: '安全防线分层 / 占比条的数量（2–4）。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '左侧指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showStrip', label: '示意条带', type: 'toggle', default: true,
    description: '防线上方风险拦截示意条带的显隐。', showWhen: (p) => p.chartType === 'layers' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、防线层级与高亮卡。' },
];

const CSS = `
.aic-saf { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-saf, .aic-saf * { box-sizing: border-box; }
.aic-saf .sf-glow { position: absolute; right: -4%; top: -10%; width: 54%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-saf .sf-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-saf .sf-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-saf .sf-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-saf .sf-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left rail */
.aic-saf .sf-rail { position: absolute; left: var(--pad); top: 312px; bottom: 150px; width: 700px;
  display: flex; flex-direction: column; }
.aic-saf .sf-marker { display: flex; align-items: center; gap: 16px; }
.aic-saf .sf-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-saf .sf-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-saf .sf-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; text-wrap: pretty; }
.aic-saf .sf-cards { margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.aic-saf .sf-card { position: relative; border: 1.5px solid var(--aic-hair); border-radius: 20px;
  background: var(--aic-card); padding: 24px 26px 22px; overflow: hidden; transition: border-color .3s, background .3s; }
.aic-saf .sf-card[data-focus="1"] { border-color: transparent;
  background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 18%, var(--aic-card)), var(--aic-card) 78%); }
.aic-saf .sf-card[data-focus="1"]::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
  background: var(--aic-accent); }
.aic-saf .sf-card-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted); }
.aic-saf .sf-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 52px; line-height: 1;
  color: var(--aic-ink); margin-top: 12px; font-variant-numeric: tabular-nums; }
.aic-saf .sf-card[data-focus="1"] .sf-card-val { color: var(--aic-accent-deep); }
.aic-saf .sf-card-val u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-saf .sf-closing { margin-top: auto; display: flex; align-items: center; gap: 16px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-saf .sf-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

/* right chart panel */
.aic-saf .sf-panel { position: absolute; left: 832px; right: var(--pad); top: 312px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-saf .sf-panel-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 20px; white-space: nowrap; }
.aic-saf .sf-panel-t > span { white-space: nowrap; }
.aic-saf .sf-panel-t em { font-style: normal; font-size: 16px; letter-spacing: .08em; color: var(--aic-faint); }

/* threat-intercept strip */
.aic-saf .sf-strip { position: relative; height: 52px; border-radius: 12px; overflow: hidden;
  border: 1.5px solid var(--aic-hair); margin-bottom: 22px; }
.aic-saf .sf-strip .aic-viz-heat { padding: 8px 10px; }
.aic-saf .sf-strip-cap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; font-family: var(--aic-font-display); font-weight: 700; font-size: 14px; letter-spacing: .12em;
  text-transform: uppercase; pointer-events: none; }
.aic-saf .sf-strip-cap u { text-decoration: none; color: var(--aic-neg); }
.aic-saf .sf-strip-cap s { text-decoration: none; color: var(--aic-accent-deep); }

/* defense layer stack */
.aic-saf .sf-stack { flex: 1; display: flex; flex-direction: column; gap: 14px; min-height: 0; }
.aic-saf .sf-layer { flex: 1; position: relative; display: grid; align-items: center;
  grid-template-columns: 70px 1fr auto; gap: 0 22px; padding: 0 26px; border-radius: 18px;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair); overflow: hidden;
  transition: transform .3s, box-shadow .3s; }
.aic-saf .sf-layer::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: var(--cov, 60%);
  background: var(--tone); opacity: .5; transition: width .6s cubic-bezier(.3,.7,.4,1); }
.aic-saf .sf-layer > * { position: relative; }
.aic-saf .sf-layer[data-focus="1"] { transform: translateX(8px); box-shadow: 0 18px 40px -22px color-mix(in srgb, var(--aic-accent) 70%, transparent);
  border-color: transparent; }
.aic-saf .sf-layer[data-focus="1"]::before { opacity: 1; }
.aic-saf .sf-tier { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; letter-spacing: .06em;
  color: var(--aic-ink); opacity: .55; }
.aic-saf .sf-layer[data-focus="1"] .sf-tier { opacity: .85; }
.aic-saf .sf-lname { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); }
.aic-saf .sf-lnote { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-ink-dim); margin-top: 4px; }
.aic-saf .sf-lval { text-align: right; font-family: var(--aic-font-display); font-weight: 700; font-size: 40px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; line-height: 1; }
.aic-saf .sf-lval u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* bars mode */
.aic-saf .sf-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 38px; }

.aic-saf .sf-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: flex-end; }
.aic-saf .sf-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// red→green threat-intercept gradient strip (left = threats, right = filtered safe)
const THREAT = ['neg','neg','warn','neg','warn','neg','warn','warn','neg','warn','warn','accent',
  'warn','accent','warn','accent','accent','warn','accent','accent','pos','accent','accent','pos',
  'accent','pos','accent','pos','pos','accent','pos','pos'].map((tone) => ({ tone }));

const SPLIT_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 52%, white)',
  'color-mix(in srgb, var(--aic-accent) 34%, white)',
  'var(--aic-hair-strong)',
];

export default function SafetyPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, chartTitle: p.chartTitle !== undefined ? p.chartTitle : COPY.chartTitle, splitTitle: p.splitTitle !== undefined ? p.splitTitle : COPY.splitTitle, stripTitle: p.stripTitle !== undefined ? p.stripTitle : COPY.stripTitle, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics, layers: p.layers !== undefined ? p.layers : COPY.layers };
  ensureFonts();
  injectScopedStyle('aic-saf', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  const lN = Math.max(2, Math.min(4, p.layerCount));
  const layers = copy.layers.slice(0, lN);
  const maxV = Math.max(...layers.map((l) => l.value));

  return (
    <div className="aic-saf" style={vars}>
      {p.showDecorations && <div className="sf-glow" />}

      <div className="sf-head">
        <div>
          <p className="sf-eyebrow">{copy.eyebrow}</p>
          <h2 className="sf-title">{copy.title}</h2>
        </div>
        <div className="sf-sub">{copy.titleTail}</div>
      </div>

      <div className="sf-rail">
        <div className="sf-marker"><b /><span>{copy.segment}</span></div>
        <p className="sf-lead">{copy.lead}</p>
        <div className="sf-cards">
          {metrics.map((m, i) => (
            <div className="sf-card" key={m.lbl} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="sf-card-lbl">{m.lbl}</div>
              <div className="sf-card-val">{m.val}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>
        <div className="sf-closing"><b />{copy.closing}</div>
      </div>

      <div className="sf-panel">
        {p.chartType === 'layers' ? (
          <React.Fragment>
            <p className="sf-panel-t"><span>{copy.chartTitle}</span><em>{lN} LAYERS</em></p>
            {p.showStrip && (
              <div className="sf-strip">
                <HeatStrip data={THREAT} gap={4} />
                <div className="sf-strip-cap"><u>风险输入</u><s>已拦截 / 合规</s></div>
              </div>
            )}
            <div className="sf-stack">
              {layers.map((l, i) => (
                <div className="sf-layer" key={l.name}
                  data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                  style={{ '--tone': LAYER_FILL[i % LAYER_FILL.length],
                    '--cov': (l.value / maxV * 100) + '%' }}>
                  <span className="sf-tier">{l.tier}</span>
                  <div>
                    <div className="sf-lname">{l.name}</div>
                    <div className="sf-lnote">{l.note}</div>
                  </div>
                  <div className="sf-lval">{l.value}<u>亿</u></div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="sf-panel-t"><span>{copy.splitTitle}</span><em>SHARE</em></p>
            <div className="sf-bars">
              {layers.map((l, i) => (
                <BarRow key={l.name} label={l.name} display={l.value + ' 亿'}
                  value={l.value / maxV * 100}
                  color={SPLIT_FILL[i % SPLIT_FILL.length]}
                  focus={p.focusEnabled && i === focus} />
              ))}
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="sf-foot">
        {p.showDecorations && <div className="sf-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
