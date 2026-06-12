/**
 * EcosystemPage — P55 GPU 资源链条 (NVIDIA Ecosystem · Image-led · Ecosystem Map)
 *
 * Image-led slide whose signature device is a GPU-centered ecosystem ring: a
 * dark central "GPU" hub with orbiting funding nodes (GPU cloud, cluster ops,
 * inference optimization, interconnect) sized by amount and joined by spokes.
 * An editorial column and a hero image sit on the right. Node count, the focus
 * node, spokes / value labels, the image count / ratio are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-eco`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'NVIDIA Ecosystem',
  segment: 'NVIDIA 生态',
  title: 'GPU 资源链条',
  titleTail: 'NVIDIA 生态',
  lead: 'NVIDIA 生态内融资围绕 GPU、网络、集群运维和推理优化展开；谁能稳定拿到算力，谁就更容易获得下一轮资本。',
  statLine: '以 GPU 为中心的资源链条',
  closing: '算力供给能力正在变成融资能力。',
  badge: 'GPU 生态',
  panelTitle: '生态融资分布',
  hub: { lead: 'GPU', sub: 'NVIDIA 生态' },
  legend: '节点大小 · 数值 = 融资额（亿美元）',
  // ecosystem nodes (order fixed; count is prop-driven). value in 亿美元.
  nodes: [
    { label: 'GPU 云', value: 64 },
    { label: '集群管理', value: 12 },
    { label: '推理优化', value: 9 },
    { label: '芯片互联', value: 7 },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  segmentCount: 4,         // ecosystem nodes (2–4)
  focusEnabled: true,      // highlight one node
  focusIndex: 0,           // which node is the focus (0-based)
  showSpokes: true,        // hub→node connecting spokes
  showValues: true,        // value labels inside nodes
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'NVIDIA Ecosystem' },
  { key: 'segment', label: 'segment', type: 'text', default: 'NVIDIA 生态' },
  { key: 'title', label: '标题', type: 'text', default: 'GPU 资源链条' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'NVIDIA 生态' },
  { key: 'lead', label: '导言', type: 'text', default: 'NVIDIA 生态内融资围绕 GPU、网络、集群运维和推理优化展开；谁能稳定拿到算力，谁就更容易获得下一轮资本。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '以 GPU 为中心的资源链条' },
  { key: 'closing', label: '结语', type: 'text', default: '算力供给能力正在变成融资能力。' },
  { key: 'badge', label: 'badge', type: 'text', default: 'GPU 生态' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '生态融资分布' },
  { key: 'legend', label: 'legend', type: 'text', default: '节点大小 · 数值 = 融资额（亿美元）' },
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
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '生态环上的节点数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个生态节点作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的生态节点。', showWhen: (p) => p.focusEnabled },
  { key: 'showSpokes', label: '连接线', type: 'toggle', default: true,
    description: '中心 GPU 节点到各生态节点的连接线显隐。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '节点内融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于生态节点、连接线与高亮节点。' },
];

const CSS = `
.aic-eco { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-eco, .aic-eco * { box-sizing: border-box; }
.aic-eco .ec-glow { position: absolute; left: 16%; top: -8%; width: 48%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-eco .ec-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-eco .ec-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-eco .ec-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-eco .ec-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* ecosystem ring (left) */
.aic-eco .ec-panel { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 880px;
  display: flex; flex-direction: column; }
.aic-eco .ec-panel-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 8px; }
.aic-eco .ec-panel-t em { font-style: normal; font-size: 15px; letter-spacing: .06em; color: var(--aic-faint);
  text-transform: none; }
.aic-eco .ec-ring { flex: 1; min-height: 0; display: grid; place-items: center; }
.aic-eco .ec-ring svg { width: auto; height: 100%; max-width: 100%; display: block; }
.aic-eco .ec-nlabel { font-family: var(--aic-font-text); font-weight: 700; font-size: 22px; fill: var(--aic-ink); }
.aic-eco .ec-nlabel.dim { fill: var(--aic-muted); }
.aic-eco .ec-nval { font-family: var(--aic-font-display); font-weight: 700; fill: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-eco .ec-nval.on { fill: var(--aic-ink); }
.aic-eco .ec-hubt { font-family: var(--aic-font-display); font-weight: 700; fill: #fff; }
.aic-eco .ec-hubs { font-family: var(--aic-font-display); font-weight: 600; fill: rgba(255,255,255,.72);
  letter-spacing: .12em; }

/* content + hero column (right) */
.aic-eco .ec-side { position: absolute; left: 1052px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-eco .ec-marker { display: flex; align-items: center; gap: 16px; }
.aic-eco .ec-marker b { width: 52px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-eco .ec-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-eco .ec-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 12px; text-wrap: pretty; }
.aic-eco .ec-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-eco .ec-hero { margin-top: 24px; flex: 1; display: flex; gap: 16px; min-height: 0; }
.aic-eco .ec-cell { position: relative; overflow: hidden; border-radius: 24px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-eco .ec-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-eco .ec-cell.fixed .ec-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-eco .ec-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-eco .ec-cell.auto .ec-frame { height: auto; }
.aic-eco .ec-cell.auto .ec-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-eco .ec-badge { position: absolute; top: 16px; left: 16px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-eco .ec-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-eco .ec-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-eco .ec-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-eco .ec-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-eco .ec-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-eco .ec-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-eco .ec-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'ecph-' + i;
  return (
    <div className="ec-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="ec-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

// Build the GPU-centered ecosystem ring as an SVG.
function EcosystemRing({ nodes, focus, focusEnabled, showSpokes, showValues, hub }) {
  const C = 300, HUB_R = 80, ORBIT = 184;
  const maxV = Math.max(...nodes.map((n) => n.value));
  const items = nodes.map((s, i) => {
    const ang = (90 + i * (360 / nodes.length)) * Math.PI / 180; // start at bottom, clockwise
    const cos = Math.cos(ang), sin = Math.sin(ang);
    const x = C + ORBIT * cos, y = C + ORBIT * sin;
    const nr = 34 + Math.sqrt(s.value / maxV) * 34;
    const on = focusEnabled && i === focus;
    return { ...s, x, y, nr, on, cos, sin };
  });
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true">
      {/* faint orbit guide */}
      <circle cx={C} cy={C} r={ORBIT} fill="none" stroke="var(--aic-hair)" strokeWidth="1.5" strokeDasharray="2 9" />
      {/* spokes */}
      {showSpokes && items.map((it, i) => (
        <line key={'s' + i} x1={C + HUB_R * it.cos} y1={C + HUB_R * it.sin}
          x2={it.x - it.nr * it.cos} y2={it.y - it.nr * it.sin}
          stroke={it.on ? 'var(--aic-accent)' : 'var(--aic-hair-strong)'} strokeWidth={it.on ? 3 : 2} />
      ))}
      {/* nodes */}
      {items.map((it, i) => (
        <g key={'n' + i}>
          <circle cx={it.x} cy={it.y} r={it.nr}
            fill={it.on ? 'var(--aic-accent)' : 'var(--aic-accent-soft)'}
            stroke={it.on ? 'var(--aic-accent-deep)' : 'color-mix(in srgb, var(--aic-accent) 30%, white)'}
            strokeWidth={it.on ? 3 : 1.5}
            opacity={focusEnabled && !it.on ? 0.92 : 1} />
          {showValues && (
            <text className="ec-nval" x={it.x} y={it.y} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: Math.max(22, it.nr * 0.62) }}>{it.value}</text>
          )}
          <text className={'ec-nlabel' + (focusEnabled && !it.on ? ' dim' : '')}
            x={it.x} y={it.y + it.nr + 26} textAnchor="middle">{it.label}</text>
        </g>
      ))}
      {/* central hub */}
      <circle cx={C} cy={C} r={HUB_R} fill="var(--aic-ink)" />
      <circle cx={C} cy={C} r={HUB_R - 8} fill="none" stroke="var(--aic-accent)" strokeWidth="2.5" opacity="0.9" />
      <text className="ec-hubt" x={C} y={C - 6} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 46 }}>{hub.lead}</text>
      <text className="ec-hubs" x={C} y={C + 30} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 16 }}>{hub.sub}</text>
    </svg>
  );
}

export default function EcosystemPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, panelTitle: p.panelTitle !== undefined ? p.panelTitle : COPY.panelTitle, legend: p.legend !== undefined ? p.legend : COPY.legend, nodes: p.nodes !== undefined ? p.nodes : COPY.nodes };
  ensureFonts();
  injectScopedStyle('aic-eco', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(4, p.segmentCount));
  const nodes = copy.nodes.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-eco" style={vars}>
      {p.showDecorations && <div className="ec-glow" />}

      <div className="ec-head">
        <div>
          <p className="ec-eyebrow">{copy.eyebrow}</p>
          <h2 className="ec-title">{copy.title}</h2>
        </div>
        <div className="ec-sub">{copy.titleTail}</div>
      </div>

      <div className="ec-panel">
        <p className="ec-panel-t"><span>{copy.panelTitle}</span><em>{copy.legend}</em></p>
        <div className="ec-ring">
          <EcosystemRing nodes={nodes} focus={focus} focusEnabled={p.focusEnabled}
            showSpokes={p.showSpokes} showValues={p.showValues} hub={copy.hub} />
        </div>
      </div>

      <div className="ec-side">
        <div className="ec-marker"><b /><span>{copy.segment}</span></div>
        <p className="ec-lead">{copy.lead}</p>
        <div className="ec-statline">{copy.statLine}</div>
        <div className="ec-hero">
          {imgN === 0 ? (
            <div className="ec-cell fixed">
              <div className="ec-frame" style={{ '--ar': String(heroAR) }}>
                <div className="ec-deco-fill"><LensCluster /></div>
              </div>
            </div>
          ) : (
            Array.from({ length: imgN }).map((_, i) => (
              <div className={'ec-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
                {p.showDecorations && i === 0 && <span className="ec-badge">{copy.badge}</span>}
                <div className="ec-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="ec-foot">
        <div className="ec-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ec-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
