/**
 * FinancePage — P32 投研、风控与合规 (Finance AI · Image-led · Segment Card)
 *
 * Image-led vertical-segment slide: a scenario-share chart (donut or bars) +
 * legend anchors the left, with an editorial column and a hero image on the
 * right. Chart type, segment count, the focus segment, the legend, the image
 * count / ratio are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-fin`. Shared deps: ./theme.js, ./viz.jsx (Donut, BarRow, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, BarRow, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Finance AI',
  segment: '金融 AI 赛道',
  title: '投研、风控与合规',
  titleTail: '金融 AI 赛道',
  lead: '金融 AI 聚焦投研、风控、合规和客户服务；金融行业付费能力强，但监管和准确率门槛更高。',
  statLine: '融资额 22 亿美元 · 7 笔事件',
  closing: '高价值行业需要更强可信度。',
  badge: '金融 AI',
  panelTitle: '场景占比',
  // scenario segments (order fixed; count is prop-driven; values are percent)
  segments: [
    { label: '投研', value: 31, note: '研报与因子挖掘' },
    { label: '合规', value: 28, note: '政策对照与留痕' },
    { label: '风控', value: 24, note: '反欺诈与信用评估' },
    { label: '客户服务', value: 17, note: '智能投顾与问答' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// segment fills — leading segments in accent shades, trailing in neutral
const SEG_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 62%, white)',
  'color-mix(in srgb, var(--aic-accent) 40%, white)',
  'var(--aic-hair-strong)',
];

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  chartType: 'donut',      // 'donut' | 'bars'
  segmentCount: 4,         // scenario segments (2–4)
  focusEnabled: true,      // highlight one segment
  focusIndex: 0,           // which segment is the focus (0-based)
  showLegend: true,        // legend list (donut mode)
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Finance AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '金融 AI 赛道' },
  { key: 'title', label: '标题', type: 'text', default: '投研、风控与合规' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '金融 AI 赛道' },
  { key: 'lead', label: '导言', type: 'text', default: '金融 AI 聚焦投研、风控、合规和客户服务；金融行业付费能力强，但监管和准确率门槛更高。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 22 亿美元 · 7 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '高价值行业需要更强可信度。' },
  { key: 'badge', label: 'badge', type: 'text', default: '金融 AI' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '场景占比' },
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
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'donut',
    options: [{ value: 'donut', label: '环形图' }, { value: 'bars', label: '占比条' }],
    description: '场景占比图表样式：环形图 / 占比条。' },
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '场景占比分段数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个场景作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的场景。', showWhen: (p) => p.focusEnabled },
  { key: 'showLegend', label: '图例', type: 'toggle', default: true,
    description: '环形图右侧图例列表的显隐。', showWhen: (p) => p.chartType === 'donut' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、图表与高亮场景。' },
];

const CSS = `
.aic-fin { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-fin, .aic-fin * { box-sizing: border-box; }
.aic-fin .fn-glow { position: absolute; left: 20%; top: -8%; width: 46%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-fin .fn-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-fin .fn-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-fin .fn-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-fin .fn-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* scenario chart (left) */
.aic-fin .fn-chartwrap { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 880px;
  display: flex; flex-direction: column; }
.aic-fin .fn-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 8px; }
.aic-fin .fn-chart { flex: 1; display: flex; align-items: center; gap: 56px; min-height: 0; }
.aic-fin .fn-donut { flex: none; position: relative; }
.aic-fin .fn-legend { flex: 1; display: flex; flex-direction: column; gap: 22px; }
.aic-fin .fn-leg { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
  padding-bottom: 18px; border-bottom: 1.5px solid var(--aic-hair); transition: opacity .3s; }
.aic-fin .fn-leg:last-child { border-bottom: none; }
.aic-fin .fn-leg i { width: 18px; height: 18px; border-radius: 5px; flex: none; }
.aic-fin .fn-leg-lbl { display: flex; flex-direction: column; gap: 2px; }
.aic-fin .fn-leg-lbl b { font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); }
.aic-fin .fn-leg-lbl span { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted); }
.aic-fin .fn-leg-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 34px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-fin .fn-leg[data-focus="1"] .fn-leg-v { color: var(--aic-accent-deep); }

/* bars mode */
.aic-fin .fn-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 30px; padding-right: 20px; }

/* content + hero column (right) */
.aic-fin .fn-side { position: absolute; left: 1052px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-fin .fn-marker { display: flex; align-items: center; gap: 16px; }
.aic-fin .fn-marker b { width: 52px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-fin .fn-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-fin .fn-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 12px; text-wrap: pretty; }
.aic-fin .fn-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-fin .fn-hero { margin-top: 24px; flex: 1; display: flex; gap: 16px; min-height: 0; }
.aic-fin .fn-cell { position: relative; overflow: hidden; border-radius: 24px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-fin .fn-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-fin .fn-cell.fixed .fn-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-fin .fn-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-fin .fn-cell.auto .fn-frame { height: auto; }
.aic-fin .fn-cell.auto .fn-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-fin .fn-badge { position: absolute; top: 16px; left: 16px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-fin .fn-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-fin .fn-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-fin .fn-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-fin .fn-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-fin .fn-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-fin .fn-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-fin .fn-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'fnph-' + i;
  return (
    <div className="fn-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="fn-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function FinancePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-fin', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(4, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));

  const donutSegs = segs.map((s, i) => ({ value: s.value, color: SEG_FILL[i % SEG_FILL.length], label: s.label }));
  const focusSeg = segs[focus];

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-fin" style={vars}>
      {p.showDecorations && <div className="fn-glow" />}

      <div className="fn-head">
        <div>
          <p className="fn-eyebrow">{copy.eyebrow}</p>
          <h2 className="fn-title">{copy.title}</h2>
        </div>
        <div className="fn-sub">{copy.titleTail}</div>
      </div>

      <div className="fn-chartwrap">
        <p className="fn-panel-t">{copy.panelTitle}</p>
        {p.chartType === 'donut' ? (
          <div className="fn-chart">
            <div className="fn-donut">
              <Donut segments={donutSegs} size={392} thickness={62}
                focusIndex={p.focusEnabled ? focus : -1}
                centerTop={p.focusEnabled ? focusSeg.value + '%' : segN}
                centerBottom={p.focusEnabled ? focusSeg.label : '核心场景'} />
            </div>
            {p.showLegend && (
              <div className="fn-legend">
                {segs.map((s, i) => (
                  <div className="fn-leg" key={s.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}
                    style={{ opacity: p.focusEnabled && i !== focus ? 0.55 : 1 }}>
                    <i style={{ background: SEG_FILL[i % SEG_FILL.length] }} />
                    <div className="fn-leg-lbl"><b>{s.label}</b><span>{s.note}</span></div>
                    <div className="fn-leg-v">{s.value}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="fn-bars">
            {segs.map((s, i) => (
              <BarRow key={s.label} label={s.label} display={s.value + '%'}
                value={s.value / maxV * 100}
                color={SEG_FILL[i % SEG_FILL.length]}
                focus={p.focusEnabled && i === focus}
                dim={p.focusEnabled && i !== focus} />
            ))}
          </div>
        )}
      </div>

      <div className="fn-side">
        <div className="fn-marker"><b /><span>{copy.segment}</span></div>
        <p className="fn-lead">{copy.lead}</p>
        <div className="fn-statline">{copy.statLine}</div>
        <div className="fn-hero">
          {imgN === 0 ? (
            <div className="fn-cell fixed">
              <div className="fn-frame" style={{ '--ar': String(heroAR) }}>
                <div className="fn-deco-fill"><LensCluster /></div>
              </div>
            </div>
          ) : (
            Array.from({ length: imgN }).map((_, i) => (
              <div className={'fn-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
                {p.showDecorations && i === 0 && <span className="fn-badge">{copy.badge}</span>}
                <div className="fn-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="fn-foot">
        <div className="fn-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="fn-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
