/**
 * LowCodePage — P46 企业流程嵌入 (Low-Code AI · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the RIGHT and, on the left, a
 * low-code orchestration pipeline (connected process nodes) plus a retention
 * panel of dial gauges. Image count / ratio, pipeline step count, retention
 * metric count, value labels and the focus node are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-lc`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Low-Code AI',
  segment: '低代码 AI 平台',
  title: '企业流程嵌入',
  titleTail: '低代码 AI 平台',
  lead: '低代码 AI 平台帮助企业把模型能力嵌入内部流程；关键不是模型能力，而是交付速度和治理能力。',
  statLine: '融资额 19 亿美元 · 6 笔事件',
  closing: '能被业务团队使用的平台更容易扩散。',
  badge: '低代码',
  flowTitle: '流程编排 · Orchestration',
  metricTitle: '客户与留存 · Retention',
  // pipeline nodes (count is prop-driven 3–5)
  steps: [
    { name: '连接数据', note: '系统与知识源' },
    { name: '编排流程', note: '可视化拖拽' },
    { name: '嵌入业务', note: '触点与审批' },
    { name: '治理监控', note: '权限与审计' },
    { name: '复用沉淀', note: '模板与资产' },
  ],
  // retention metrics (count is prop-driven 1–2)
  metrics: [
    { label: '净收入留存', value: '118', unit: '%', pct: 0.88, note: '席位扩张驱动' },
    { label: '企业客户中位数', value: '430', unit: '家', pct: 0.62, note: '部门级渗透' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  stepCount: 4,            // pipeline nodes (3–5)
  metricCount: 2,          // retention dials (1–2)
  focusEnabled: true,      // highlight one pipeline node
  focusIndex: 2,           // which node is the focus (0-based)
  showMetrics: true,       // retention dial panel
  showValues: true,        // value labels on dials
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Low-Code AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '低代码 AI 平台' },
  { key: 'title', label: '标题', type: 'text', default: '企业流程嵌入' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '低代码 AI 平台' },
  { key: 'lead', label: '导言', type: 'text', default: '低代码 AI 平台帮助企业把模型能力嵌入内部流程；关键不是模型能力，而是交付速度和治理能力。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 19 亿美元 · 6 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '能被业务团队使用的平台更容易扩散。' },
  { key: 'badge', label: 'badge', type: 'text', default: '低代码' },
  { key: 'flowTitle', label: 'flowTitle', type: 'text', default: '流程编排 · Orchestration' },
  { key: 'metricTitle', label: 'metricTitle', type: 'text', default: '客户与留存 · Retention' },
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
  { key: 'stepCount', label: '卡片数量', type: 'slider', default: 4, min: 3, max: 5, step: 1,
    description: '流程编排节点数量（3–5）。' },
  { key: 'metricCount', label: '指标数量', type: 'slider', default: 2, min: 1, max: 2, step: 1,
    description: '客户与留存指标盘数量（1–2）。', showWhen: (p) => p.showMetrics },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个流程节点作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 2,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' },
      { value: 3, label: '第 4 个' }, { value: 4, label: '第 5 个' }],
    description: '选择被高亮的流程节点。', showWhen: (p) => p.focusEnabled },
  { key: 'showMetrics', label: '留存面板', type: 'toggle', default: true,
    description: '底部客户与留存指标盘的显隐。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '指标盘内数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮节点与指标盘。' },
];

const CSS = `
.aic-lc { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-lc, .aic-lc * { box-sizing: border-box; }
.aic-lc .lc-glow { position: absolute; left: 26%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-lc .lc-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-lc .lc-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-lc .lc-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 76px; line-height: .96; margin: 0; }
.aic-lc .lc-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: editorial + pipeline + retention dials */
.aic-lc .lc-left { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 1100px;
  display: flex; flex-direction: column; }
.aic-lc .lc-marker { display: flex; align-items: center; gap: 16px; }
.aic-lc .lc-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-lc .lc-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-lc .lc-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 10px; text-wrap: pretty; max-width: 1040px; }
.aic-lc .lc-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-lc .lc-flow { margin-top: 44px; }
.aic-lc .lc-block-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }
.aic-lc .lc-pipe { display: flex; align-items: stretch; }
.aic-lc .lc-node { position: relative; flex: 1 1 0; background: var(--aic-card); border: 1.5px solid var(--aic-hair-strong);
  border-radius: 20px; padding: 22px 20px 24px; transition: background .35s, border-color .35s, box-shadow .35s, transform .35s; }
.aic-lc .lc-node[data-focus="1"] { background: linear-gradient(160deg, var(--aic-accent-bright), var(--aic-accent) 78%);
  border-color: transparent; box-shadow: 0 22px 46px -22px color-mix(in srgb, var(--aic-accent) 75%, transparent); transform: translateY(-4px); }
.aic-lc .lc-node-no { font-family: var(--aic-font-display); font-weight: 700; font-size: 18px; color: var(--aic-faint);
  font-variant-numeric: tabular-nums; }
.aic-lc .lc-node[data-focus="1"] .lc-node-no { color: color-mix(in srgb, var(--aic-ink) 55%, white); }
.aic-lc .lc-node-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 27px; color: var(--aic-ink); margin-top: 8px; }
.aic-lc .lc-node-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 17px; color: var(--aic-muted); margin-top: 6px; }
.aic-lc .lc-node[data-focus="1"] .lc-node-note { color: color-mix(in srgb, var(--aic-ink) 62%, white); }
.aic-lc .lc-arrow { flex: 0 0 36px; display: grid; place-items: center; color: var(--aic-hair-strong); }
.aic-lc .lc-arrow svg { width: 22px; height: 22px; }

.aic-lc .lc-dials { margin-top: auto; }
.aic-lc .lc-dial-row { display: flex; gap: 26px; }
.aic-lc .lc-dial { display: flex; align-items: center; gap: 22px; flex: 1 1 0; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair); border-radius: 22px; padding: 22px 28px; }
.aic-lc .lc-ring { position: relative; width: 116px; height: 116px; flex: none; }
.aic-lc .lc-ring svg { transform: rotate(-90deg); }
.aic-lc .lc-ring-v { position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 30px; color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-lc .lc-ring-v u { text-decoration: none; font-size: 15px; font-weight: 600; color: var(--aic-muted); margin-left: 1px; }
.aic-lc .lc-dial-meta { display: flex; flex-direction: column; gap: 6px; }
.aic-lc .lc-dial-lbl { font-family: var(--aic-font-display); font-weight: 700; font-size: 23px; color: var(--aic-ink); }
.aic-lc .lc-dial-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 17px; color: var(--aic-muted); }

.aic-lc .lc-hero { position: absolute; left: 1244px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-lc .lc-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-lc .lc-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-lc .lc-cell.fixed .lc-frame { height: 100%; }
.aic-lc .lc-cell.fixed .lc-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-lc .lc-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-lc .lc-cell.auto .lc-frame { height: auto; }
.aic-lc .lc-cell.auto .lc-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-lc .lc-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-lc .lc-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-lc .lc-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-lc .lc-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-lc .lc-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-lc .lc-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); white-space: nowrap; }
.aic-lc .lc-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-lc .lc-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

function Ring({ pct, focus }) {
  const r = 50, c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, pct)) * c;
  return (
    <svg width="116" height="116" viewBox="0 0 116 116" aria-hidden="true">
      <circle cx="58" cy="58" r={r} fill="none" stroke="var(--aic-hair)" strokeWidth="11" />
      <circle cx="58" cy="58" r={r} fill="none" strokeWidth="11" strokeLinecap="round"
        stroke={focus ? 'var(--aic-accent)' : 'var(--aic-ink)'}
        strokeDasharray={`${dash} ${c - dash}`} style={{ transition: 'stroke-dasharray .6s cubic-bezier(.3,.7,.4,1)' }} />
    </svg>
  );
}

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'lcph-' + i;
  return (
    <div className="lc-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="lc-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function LowCodePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, flowTitle: p.flowTitle !== undefined ? p.flowTitle : COPY.flowTitle, metricTitle: p.metricTitle !== undefined ? p.metricTitle : COPY.metricTitle, steps: p.steps !== undefined ? p.steps : COPY.steps, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-lc', CSS);
  const vars = themeVars(p.accentColor);

  const stepN = Math.max(3, Math.min(5, p.stepCount));
  const steps = copy.steps.slice(0, stepN);
  const focus = Math.max(0, Math.min(stepN - 1, p.focusIndex));
  const metN = Math.max(1, Math.min(2, p.metricCount));
  const metrics = copy.metrics.slice(0, metN);

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-lc" style={vars}>
      {p.showDecorations && <div className="lc-glow" />}

      <div className="lc-head">
        <div>
          <p className="lc-eyebrow">{copy.eyebrow}</p>
          <h2 className="lc-title">{copy.title}</h2>
        </div>
        <div className="lc-sub">{copy.titleTail}</div>
      </div>

      <div className="lc-left">
        <div className="lc-marker"><b /><span>{copy.segment}</span></div>
        <p className="lc-lead">{copy.lead}</p>
        <div className="lc-statline">{copy.statLine}</div>

        <div className="lc-flow">
          <p className="lc-block-t">{copy.flowTitle}</p>
          <div className="lc-pipe">
            {steps.map((s, i) => (
              <React.Fragment key={s.name}>
                <div className="lc-node" data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                  <div className="lc-node-no">{String(i + 1).padStart(2, '0')}</div>
                  <div className="lc-node-name">{s.name}</div>
                  <div className="lc-node-note">{s.note}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="lc-arrow">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {p.showMetrics && (
          <div className="lc-dials">
            <p className="lc-block-t">{copy.metricTitle}</p>
            <div className="lc-dial-row">
              {metrics.map((m, i) => (
                <div className="lc-dial" key={m.label}>
                  <div className="lc-ring">
                    <Ring pct={m.pct} focus={i === 0} />
                    {p.showValues && <div className="lc-ring-v">{m.value}<u>{m.unit}</u></div>}
                  </div>
                  <div className="lc-dial-meta">
                    <div className="lc-dial-lbl">{m.label}</div>
                    <div className="lc-dial-note">{m.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lc-hero">
        {imgN === 0 ? (
          <div className="lc-cell fixed">
            <div className="lc-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="lc-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'lc-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="lc-badge">{copy.badge}</span>}
              <div className={'lc-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="lc-foot">
        <div className="lc-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="lc-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
