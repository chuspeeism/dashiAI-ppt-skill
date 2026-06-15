/**
 * AutonomyPage — P40 车载模型升级 (Autonomous AI · Image-led · Segment Card)
 *
 * Image-led slide pairing a scenario-split chart (donut or bars) with a
 * signature vehicle-AI architecture tier strip (感知 → 决策 → 控制 → 座舱), an
 * editorial column and a portrait hero. Chart type, segment count, the
 * architecture strip, the legend, image count / ratio and the focus segment
 * are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-auto`. Shared deps: ./theme.js, ./viz.jsx (Donut, BarRow, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, BarRow, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Autonomous AI',
  segment: '自动驾驶与车载 AI',
  title: '车载模型升级',
  titleTail: '自动驾驶与车载 AI',
  lead: '车载 AI 从感知模块转向端到端模型和座舱智能；资本更关注数据闭环和量产路径。',
  statLine: '融资额 29 亿美元 · 6 笔事件',
  closing: '自动驾驶回暖，但更看重工程兑现。',
  badge: '车载 AI',
  panelTitle: '场景拆分 / 亿美元',
  archTitle: '车载 AI 架构',
  arch: ['环境感知', '决策规划', '执行控制', '座舱交互'],
  // scenario segments (order fixed; count is prop-driven; values are 亿美元)
  segments: [
    { label: '端到端驾驶', value: 13, note: '感知到控制一体化' },
    { label: '仿真平台', value: 9, note: '数据闭环与虚拟测试' },
    { label: '车载助手', value: 7, note: '座舱交互与语音' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// segment fills — leading segments in accent shades, trailing in neutral
const SEG_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 52%, white)',
  'var(--aic-hair-strong)',
];

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  chartType: 'bars',       // 'bars' | 'donut'
  segmentCount: 3,         // scenario segments (2–3)
  focusEnabled: true,      // highlight one segment
  focusIndex: 0,           // which segment is the focus (0-based)
  showArch: true,          // vehicle-AI architecture tier strip
  showLegend: true,        // legend list (donut mode)
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Autonomous AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '自动驾驶与车载 AI' },
  { key: 'title', label: '标题', type: 'text', default: '车载模型升级' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '自动驾驶与车载 AI' },
  { key: 'lead', label: '导言', type: 'text', default: '车载 AI 从感知模块转向端到端模型和座舱智能；资本更关注数据闭环和量产路径。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 29 亿美元 · 6 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '自动驾驶回暖，但更看重工程兑现。' },
  { key: 'badge', label: 'badge', type: 'text', default: '车载 AI' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '场景拆分 / 亿美元' },
  { key: 'archTitle', label: 'archTitle', type: 'text', default: '车载 AI 架构' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 1, min: 0, max: 2, step: 1,
    description: '主视觉区图片槽数量（0–2）；为 0 时以品牌图形填充，构图保持完整。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'portrait',
    options: [
      { value: 'portrait', label: '竖图' },
      { value: 'landscape', label: '横图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽比例；自适应会跟随用户上传图片的原始比例并自动居中排布。' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bars',
    options: [{ value: 'bars', label: '占比条' }, { value: 'donut', label: '环形图' }],
    description: '场景拆分图表样式：占比条 / 环形图。' },
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '场景拆分分段数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个场景作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的场景。', showWhen: (p) => p.focusEnabled },
  { key: 'showArch', label: '装饰图示', type: 'toggle', default: true,
    description: '车载 AI 架构层级条（感知 → 决策 → 控制 → 座舱）的显隐。' },
  { key: 'showLegend', label: '图例', type: 'toggle', default: true,
    description: '环形图右侧图例列表的显隐。', showWhen: (p) => p.chartType === 'donut' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、架构条、图表与高亮场景。' },
];

const CSS = `
.aic-auto { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-auto, .aic-auto * { box-sizing: border-box; }
.aic-auto .au-glow { position: absolute; left: 18%; top: -8%; width: 46%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-auto .au-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-auto .au-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-auto .au-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-auto .au-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: arch strip + scenario chart */
.aic-auto .au-main { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 900px;
  display: flex; flex-direction: column; }
.aic-auto .au-arch-t, .aic-auto .au-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 14px; }
.aic-auto .au-arch { display: flex; align-items: stretch; gap: 0; margin-bottom: 34px; }
.aic-auto .au-arch-node { flex: 1; position: relative; display: flex; align-items: center; justify-content: center;
  height: 64px; background: var(--aic-card); border: 1.5px solid var(--aic-hair); font-family: var(--aic-font-display);
  font-weight: 700; font-size: 22px; color: var(--aic-ink); }
.aic-auto .au-arch-node:first-child { border-radius: 14px 0 0 14px; }
.aic-auto .au-arch-node:last-child { border-radius: 0 14px 14px 0; }
.aic-auto .au-arch-node:not(:last-child) { border-right: none; }
.aic-auto .au-arch-node:first-child { background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent) 22%, var(--aic-card)), var(--aic-card) 80%); }
.aic-auto .au-arch-sep { width: 0; align-self: center; border-top: 10px solid transparent; border-bottom: 10px solid transparent;
  border-left: 12px solid var(--aic-accent); position: relative; z-index: 2; margin: 0 -6px; flex: none; }
.aic-auto .au-panel { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.aic-auto .au-chart { flex: 1; display: flex; align-items: center; gap: 52px; min-height: 0; }
.aic-auto .au-donut { flex: none; position: relative; }
.aic-auto .au-legend { flex: 1; display: flex; flex-direction: column; gap: 20px; }
.aic-auto .au-leg { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
  padding-bottom: 16px; border-bottom: 1.5px solid var(--aic-hair); transition: opacity .3s; }
.aic-auto .au-leg:last-child { border-bottom: none; }
.aic-auto .au-leg i { width: 18px; height: 18px; border-radius: 5px; flex: none; }
.aic-auto .au-leg-lbl { display: flex; flex-direction: column; gap: 2px; }
.aic-auto .au-leg-lbl b { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); }
.aic-auto .au-leg-lbl span { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted); }
.aic-auto .au-leg-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 34px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-auto .au-leg-v u { text-decoration: none; font-size: 17px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-auto .au-leg[data-focus="1"] .au-leg-v { color: var(--aic-accent-deep); }
.aic-auto .au-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 30px; padding-right: 16px; }

/* right: editorial + portrait hero */
.aic-auto .au-side { position: absolute; left: 1052px; right: var(--pad); top: 300px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-auto .au-marker { display: flex; align-items: center; gap: 16px; }
.aic-auto .au-marker b { width: 52px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-auto .au-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-auto .au-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 12px; text-wrap: pretty; }
.aic-auto .au-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-auto .au-hero { margin-top: 24px; flex: 1; display: flex; gap: 16px; min-height: 0; }
.aic-auto .au-cell { position: relative; overflow: hidden; border-radius: 24px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-auto .au-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-auto .au-cell.fixed .au-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-auto .au-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-auto .au-cell.auto .au-frame { height: auto; }
.aic-auto .au-cell.auto .au-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-auto .au-badge { position: absolute; top: 16px; left: 16px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-auto .au-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-auto .au-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-auto .au-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-auto .au-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-auto .au-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-auto .au-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-auto .au-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'auph-' + i;
  return (
    <div className="au-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="au-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function AutonomyPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-auto', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(3, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));
  const total = segs.reduce((s, x) => s + x.value, 0);

  const donutSegs = segs.map((s, i) => ({ value: s.value, color: SEG_FILL[i % SEG_FILL.length], label: s.label }));
  const focusSeg = segs[focus];

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-auto" style={vars}>
      {p.showDecorations && <div className="au-glow" />}

      <div className="au-head">
        <div>
          <p className="au-eyebrow">{copy.eyebrow}</p>
          <h2 className="au-title">{copy.title}</h2>
        </div>
        <div className="au-sub">{copy.titleTail}</div>
      </div>

      <div className="au-main">
        {p.showArch && (
          <div>
            <p className="au-arch-t">{copy.archTitle}</p>
            <div className="au-arch">
              {copy.arch.map((a, i) => (
                <React.Fragment key={a}>
                  <div className="au-arch-node">{a}</div>
                  {i < copy.arch.length - 1 && <span className="au-arch-sep" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        <div className="au-panel">
          <p className="au-panel-t">{copy.panelTitle}</p>
          {p.chartType === 'donut' ? (
            <div className="au-chart">
              <div className="au-donut">
                <Donut segments={donutSegs} size={356} thickness={58}
                  focusIndex={p.focusEnabled ? focus : -1}
                  centerTop={p.focusEnabled ? focusSeg.value : total}
                  centerBottom={p.focusEnabled ? focusSeg.label : '亿美元'} />
              </div>
              {p.showLegend && (
                <div className="au-legend">
                  {segs.map((s, i) => (
                    <div className="au-leg" key={s.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                      style={{ opacity: p.focusEnabled && i !== focus ? 0.55 : 1 }}>
                      <i style={{ background: SEG_FILL[i % SEG_FILL.length] }} />
                      <div className="au-leg-lbl"><b>{s.label}</b><span>{s.note}</span></div>
                      <div className="au-leg-v">{s.value}<u>亿</u></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="au-bars">
              {segs.map((s, i) => (
                <BarRow key={s.label} label={s.label} display={s.value + ' 亿'}
                  value={s.value / maxV * 100}
                  color={SEG_FILL[i % SEG_FILL.length]}
                  focus={p.focusEnabled && i === focus}
                  dim={p.focusEnabled && i !== focus} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="au-side">
        <div className="au-marker"><b /><span>{copy.segment}</span></div>
        <p className="au-lead">{copy.lead}</p>
        <div className="au-statline">{copy.statLine}</div>
        <div className="au-hero">
          {imgN === 0 ? (
            <div className="au-cell fixed">
              <div className="au-frame" style={{ '--ar': String(heroAR) }}>
                <div className="au-deco-fill"><LensCluster /></div>
              </div>
            </div>
          ) : (
            Array.from({ length: imgN }).map((_, i) => (
              <div className={'au-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
                {p.showDecorations && i === 0 && <span className="au-badge">{copy.badge}</span>}
                <div className="au-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="au-foot">
        <div className="au-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="au-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
