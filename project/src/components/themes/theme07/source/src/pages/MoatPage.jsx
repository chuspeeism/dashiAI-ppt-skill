/**
 * MoatPage — P76 壁垒被压缩 (Open Source Risk · Chart-led · Risk Card)
 *
 * Chart-led risk slide. The signature device is a "moat compression" band: the
 * startup's defensible space is squeezed from the left by open-source capability
 * and from the right by big-tech coverage, leaving a narrow highlighted moat in
 * the middle. Below sit pressure meters reading each competitive force against a
 * "moat line" threshold (a force past the line turns to a danger tone). Chart
 * type, indicator count, the squeeze band, value labels and the focus indicator
 * are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-mt`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BarRow, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BarRow, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Open Source Risk',
  marker: '开源与大厂竞争',
  segment: '风险 · 开源与大厂竞争',
  title: '壁垒被压缩',
  titleTail: '风险 · 开源与大厂竞争',
  lead: '开源模型降低能力门槛，大厂生态压缩初创公司的独立空间；初创公司必须找到数据、工作流或行业入口壁垒。',
  closing: '没有壁垒的模型能力会迅速商品化。',
  bandTitle: '初创公司独立空间 · 被两侧压缩',
  bandLeft: '开源可替代',
  bandRight: '大厂生态覆盖',
  bandCore: '剩余壁垒',
  bandCoreSub: '数据 · 工作流 · 行业入口',
  metersTitle: '竞争压力 · 逼近壁垒线',
  threshold: 60, // “壁垒线” — past this a force reads as danger
  // competitive-pressure indicators (order fixed; count is prop-driven)
  indicators: [
    { name: '开源模型性能逼近', value: 86, note: '能力差距快速收窄' },
    { name: '大厂产品覆盖', value: 72, note: '原生集成挤压入口' },
    { name: '企业自建意愿', value: 34, note: '内部团队替代采购' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'pressure', // 'pressure' | 'bars'
  segmentCount: 3,       // pressure indicators shown (2–3)
  focusEnabled: true,    // highlight one indicator
  focusIndex: 0,         // which indicator is the focus (0-based)
  showBand: true,        // squeeze band (signature device)
  showValues: true,      // value labels
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Open Source Risk' },
  { key: 'marker', label: 'marker', type: 'text', default: '开源与大厂竞争' },
  { key: 'segment', label: 'segment', type: 'text', default: '风险 · 开源与大厂竞争' },
  { key: 'title', label: '标题', type: 'text', default: '壁垒被压缩' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '风险 · 开源与大厂竞争' },
  { key: 'lead', label: '导言', type: 'text', default: '开源模型降低能力门槛，大厂生态压缩初创公司的独立空间；初创公司必须找到数据、工作流或行业入口壁垒。' },
  { key: 'closing', label: '结语', type: 'text', default: '没有壁垒的模型能力会迅速商品化。' },
  { key: 'bandTitle', label: 'bandTitle', type: 'text', default: '初创公司独立空间 · 被两侧压缩' },
  { key: 'bandLeft', label: 'bandLeft', type: 'text', default: '开源可替代' },
  { key: 'bandRight', label: 'bandRight', type: 'text', default: '大厂生态覆盖' },
  { key: 'bandCore', label: 'bandCore', type: 'text', default: '剩余壁垒' },
  { key: 'bandCoreSub', label: 'bandCoreSub', type: 'text', default: '数据 · 工作流 · 行业入口' },
  { key: 'metersTitle', label: 'metersTitle', type: 'text', default: '竞争压力 · 逼近壁垒线' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'pressure',
    options: [{ value: 'pressure', label: '压力计' }, { value: 'bars', label: '占比条' }],
    description: '主图表样式：逼近壁垒线的压力计 / 资金占比条。' },
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '竞争压力指标数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个压力指标作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的压力指标。', showWhen: (p) => p.focusEnabled },
  { key: 'showBand', label: '示意图形', type: 'toggle', default: true,
    description: '上方“独立空间被压缩”示意带的显隐。', showWhen: (p) => p.chartType === 'pressure' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '压力指标数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、剩余壁垒与高亮指标。' },
];

const CSS = `
.aic-mt { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-mt, .aic-mt * { box-sizing: border-box; }
.aic-mt .mt-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-warn) 18%, transparent), transparent 70%); }

.aic-mt .mt-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-mt .mt-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-mt .mt-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-mt .mt-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* body — flex column: lead / band / meters */
.aic-mt .mt-body { position: absolute; left: var(--pad); right: var(--pad); top: 300px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-mt .mt-marker { display: flex; align-items: center; gap: 16px; }
.aic-mt .mt-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-mt .mt-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-mt .mt-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 0; max-width: 1480px; text-wrap: pretty; }

/* squeeze band */
.aic-mt .mt-band { margin-top: 32px; }
.aic-mt .mt-band-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 16px; }
.aic-mt .mt-lane { display: flex; align-items: stretch; height: 150px; border-radius: 18px; overflow: hidden;
  border: 1.5px solid var(--aic-hair); background: var(--aic-card); }
.aic-mt .mt-side { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 6px;
  padding: 0 30px; color: var(--aic-paper); transition: flex-basis .6s cubic-bezier(.3,.7,.4,1); }
.aic-mt .mt-side.l { background: linear-gradient(90deg, color-mix(in srgb, var(--aic-neg) 90%, black) 0%, var(--aic-neg) 100%); align-items: flex-start; }
.aic-mt .mt-side.r { background: linear-gradient(90deg, var(--aic-ink) 0%, color-mix(in srgb, var(--aic-ink) 78%, black) 100%); align-items: flex-end; text-align: right; }
.aic-mt .mt-side-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; opacity: .92; white-space: nowrap; }
.aic-mt .mt-side-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; line-height: 1; font-variant-numeric: tabular-nums; }
.aic-mt .mt-side.l::after, .aic-mt .mt-side.r::before { content: ''; position: absolute; top: 50%; transform: translateY(-50%);
  width: 0; height: 0; border-top: 16px solid transparent; border-bottom: 16px solid transparent; }
.aic-mt .mt-side.l::after { right: -1px; border-left: 18px solid var(--aic-neg); }
.aic-mt .mt-side.r::before { left: -1px; border-right: 18px solid var(--aic-ink); }
.aic-mt .mt-core { flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  padding: 0 14px; text-align: center; z-index: 2;
  background: linear-gradient(160deg, var(--aic-accent-bright), var(--aic-accent) 86%);
  box-shadow: 0 0 0 4px var(--aic-card), 0 18px 40px -20px color-mix(in srgb, var(--aic-accent) 80%, transparent);
  transition: flex-basis .6s cubic-bezier(.3,.7,.4,1); }
.aic-mt .mt-core-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); white-space: nowrap; }
.aic-mt .mt-core-s { font-family: var(--aic-font-text); font-weight: 600; font-size: 15px; color: var(--aic-accent-deep); white-space: nowrap; }

/* pressure meters */
.aic-mt .mt-meters { flex: 1; min-height: 0; margin-top: 30px; display: flex; flex-direction: column; }
.aic-mt .mt-meters-t { display: flex; align-items: center; justify-content: space-between;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 6px; }
.aic-mt .mt-meters-t > span { white-space: nowrap; }
.aic-mt .mt-meters-t s { text-decoration: none; display: inline-flex; align-items: center; gap: 8px; color: var(--aic-ink); white-space: nowrap; }
.aic-mt .mt-meters-t s::before { content: ''; width: 22px; height: 0; border-top: 2px dashed var(--aic-ink); }
.aic-mt .mt-list { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
.aic-mt .mt-meter { display: grid; grid-template-columns: 360px 1fr 96px; align-items: center; gap: 0 28px; transition: opacity .3s; }
.aic-mt .mt-meter[data-dim="1"] { opacity: .42; }
.aic-mt .mt-meter-h { }
.aic-mt .mt-meter-n { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); line-height: 1.1; }
.aic-mt .mt-meter[data-focus="1"] .mt-meter-n { color: var(--aic-accent-deep); }
.aic-mt .mt-meter-s { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted); margin-top: 3px; }
.aic-mt .mt-gauge { position: relative; }
.aic-mt .mt-gauge-track { height: 30px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-mt .mt-gauge-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.3,.7,.4,1);
  background: linear-gradient(90deg, color-mix(in srgb, var(--aic-accent) 60%, white), var(--aic-accent)); }
.aic-mt .mt-meter[data-breach="1"] .mt-gauge-fill { background: linear-gradient(90deg, var(--aic-warn), var(--aic-neg)); }
.aic-mt .mt-line { position: absolute; top: -8px; bottom: -8px; width: 0; border-left: 2.5px dashed var(--aic-ink); }
.aic-mt .mt-line span { position: absolute; top: -26px; left: 50%; transform: translateX(-50%); white-space: nowrap;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--aic-ink); }
.aic-mt .mt-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 32px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; text-align: right; }
.aic-mt .mt-meter[data-breach="1"] .mt-val { color: var(--aic-neg); }

/* bars mode */
.aic-mt .mt-bars { flex: 1; min-height: 0; margin-top: 30px; display: flex; flex-direction: column; justify-content: center; gap: 40px; }

.aic-mt .mt-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-mt .mt-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-mt .mt-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-mt .mt-deco { width: 300px; height: 30px; }
`;

const HEAT = ['neg','warn','neg','warn','accent','warn','pos','accent','warn','accent','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

const BAR_FILL = [
  'linear-gradient(90deg, var(--aic-warn), var(--aic-neg))',
  'color-mix(in srgb, var(--aic-ink) 80%, white)',
  'color-mix(in srgb, var(--aic-accent) 52%, white)',
];

export default function MoatPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, marker: p.marker !== undefined ? p.marker : COPY.marker, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, bandTitle: p.bandTitle !== undefined ? p.bandTitle : COPY.bandTitle, bandLeft: p.bandLeft !== undefined ? p.bandLeft : COPY.bandLeft, bandRight: p.bandRight !== undefined ? p.bandRight : COPY.bandRight, bandCore: p.bandCore !== undefined ? p.bandCore : COPY.bandCore, bandCoreSub: p.bandCoreSub !== undefined ? p.bandCoreSub : COPY.bandCoreSub, metersTitle: p.metersTitle !== undefined ? p.metersTitle : COPY.metersTitle, indicators: p.indicators !== undefined ? p.indicators : COPY.indicators };
  ensureFonts();
  injectScopedStyle('aic-mt', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(copy.indicators.length, p.segmentCount));
  const inds = copy.indicators.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const th = copy.threshold;

  // squeeze band geometry: narrow fixed core, sides split the rest by pressure
  const open = copy.indicators[0].value;
  const big = copy.indicators[1].value;
  const coreW = 16;
  const sideTotal = 100 - coreW;
  const leftW = sideTotal * open / (open + big);
  const rightW = sideTotal - leftW;

  return (
    <div className="aic-mt" style={vars}>
      {p.showDecorations && <div className="mt-glow" />}

      <div className="mt-head">
        <div>
          <p className="mt-eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-title">{copy.title}</h2>
        </div>
        <div className="mt-sub">{copy.titleTail}</div>
      </div>

      <div className="mt-body">
        <div className="mt-marker"><b /><span>{copy.segment}</span></div>
        <p className="mt-lead">{copy.lead}</p>

        {p.chartType === 'pressure' && p.showBand && (
          <div className="mt-band">
            <p className="mt-band-t">{copy.bandTitle}</p>
            <div className="mt-lane">
              <div className="mt-side l" style={{ flex: `${leftW} 0 0%` }}>
                <span className="mt-side-l">{copy.bandLeft}</span>
                {p.showValues && <span className="mt-side-v">{open}%</span>}
              </div>
              <div className="mt-core" style={{ flex: `${coreW} 0 0%` }}>
                <span className="mt-core-n">{copy.bandCore}</span>
                <span className="mt-core-s">{copy.bandCoreSub}</span>
              </div>
              <div className="mt-side r" style={{ flex: `${rightW} 0 0%` }}>
                <span className="mt-side-l">{copy.bandRight}</span>
                {p.showValues && <span className="mt-side-v">{big}%</span>}
              </div>
            </div>
          </div>
        )}

        {p.chartType === 'pressure' ? (
          <div className="mt-meters">
            <div className="mt-meters-t">
              <span>{copy.metersTitle}</span>
              <s>壁垒线 {th}%</s>
            </div>
            <div className="mt-list">
              {inds.map((d, i) => (
                <div className="mt-meter" key={d.name}
                  data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                  data-dim={p.focusEnabled && i !== focus ? '1' : '0'}
                  data-breach={d.value >= th ? '1' : '0'}>
                  <div className="mt-meter-h">
                    <div className="mt-meter-n">{d.name}</div>
                    <div className="mt-meter-s">{d.note}</div>
                  </div>
                  <div className="mt-gauge">
                    <div className="mt-gauge-track">
                      <div className="mt-gauge-fill" style={{ width: d.value + '%' }} />
                    </div>
                    <div className="mt-line" style={{ left: th + '%' }} />
                  </div>
                  <div className="mt-val">{p.showValues ? d.value + '%' : ''}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-bars">
            {inds.map((d, i) => (
              <BarRow key={d.name} label={d.name} display={d.value + '%'}
                value={d.value}
                color={BAR_FILL[i % BAR_FILL.length]}
                focus={p.focusEnabled && i === focus}
                dim={p.focusEnabled && i !== focus} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-foot">
        <div className="mt-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="mt-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
