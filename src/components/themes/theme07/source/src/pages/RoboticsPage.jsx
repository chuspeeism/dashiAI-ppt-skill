/**
 * RoboticsPage — P39 从软件走向物理世界 (Embodied AI · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the right and, on the left, an
 * application-distribution column chart whose bars stand on a visible ground
 * baseline — a "stepping into the physical world" metaphor for embodied AI.
 * Image count / ratio, segment count, value labels and the focus segment are
 * all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-rob`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Embodied AI',
  segment: '机器人与具身智能',
  title: '从软件走向物理世界',
  titleTail: '机器人与具身智能',
  lead: '具身智能成为 AI 从软件能力延伸到物理场景的重要方向；它更像硬科技投资，验证周期更长。',
  statLine: '融资额 41 亿美元 · 7 笔事件',
  closing: '长周期赛道需要看供应链和量产能力。',
  badge: '具身智能',
  panelTitle: '应用分布 · 融资 / 亿美元',
  // application breakdown (order fixed; count is prop-driven)
  segments: [
    { name: '人形机器人', value: 21, note: '通用操作与服务场景' },
    { name: '工业自动化', value: 11, note: '柔性产线与质检' },
    { name: '仓储机器人', value: 9, note: '拣选与物流搬运' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'landscape', // 'portrait' | 'landscape' | 'square' | 'auto'
  segmentCount: 3,         // application segments (2–3)
  focusEnabled: true,      // highlight one segment
  focusIndex: 0,           // which segment is the focus (0-based)
  showValues: true,        // value labels on the columns
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 1, min: 0, max: 2, step: 1,
    description: '主视觉区图片槽数量（0–2）；为 0 时以品牌图形填充，构图保持完整。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'landscape',
    options: [
      { value: 'landscape', label: '横图' },
      { value: 'portrait', label: '竖图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽比例；自适应会跟随用户上传图片的原始比例并自动居中排布。' },
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '应用方向分布数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个应用方向作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的应用方向。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '应用柱顶部融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮应用与柱形。' },
];

const CSS = `
.aic-rob { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-rob, .aic-rob * { box-sizing: border-box; }
.aic-rob .rb-glow { position: absolute; left: 26%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-rob .rb-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-rob .rb-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-rob .rb-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-rob .rb-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: editorial (top) + grounded distribution (bottom) */
.aic-rob .rb-left { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-rob .rb-marker { display: flex; align-items: center; gap: 16px; }
.aic-rob .rb-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-rob .rb-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-rob .rb-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 12px; text-wrap: pretty; max-width: 880px; }
.aic-rob .rb-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-rob .rb-dist { margin-top: auto; }
.aic-rob .rb-dist-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 20px; }
.aic-rob .rb-cols { display: grid; gap: 30px; align-items: end; height: 300px; }
.aic-rob .rb-col { display: flex; flex-direction: column; height: 100%; justify-content: flex-end; }
.aic-rob .rb-col-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; margin-bottom: 12px; transition: color .3s; }
.aic-rob .rb-col[data-focus="1"] .rb-col-val { color: var(--aic-accent-deep); }
.aic-rob .rb-col-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-rob .rb-col-fill { border-radius: 16px 16px 0 0;
  background: color-mix(in srgb, var(--aic-accent) 40%, white);
  transition: height .6s cubic-bezier(.3,.7,.4,1), background .3s; min-height: 14px; }
.aic-rob .rb-col[data-focus="1"] .rb-col-fill {
  background: linear-gradient(180deg, var(--aic-accent-bright), var(--aic-accent) 72%); }
.aic-rob .rb-ground { height: 4px; border-radius: 3px; background: var(--aic-ink); margin-top: 0; }
.aic-rob .rb-names { display: grid; gap: 30px; margin-top: 16px; }
.aic-rob .rb-name b { font-family: var(--aic-font-display); font-weight: 700; font-size: 25px; color: var(--aic-ink);
  display: block; }
.aic-rob .rb-name span { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted);
  display: block; margin-top: 4px; line-height: 1.3; }

/* right: dominant hero */
.aic-rob .rb-hero { position: absolute; left: 1080px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-rob .rb-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-rob .rb-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-rob .rb-cell.fixed .rb-frame { height: 100%; }
.aic-rob .rb-cell.fixed .rb-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-rob .rb-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-rob .rb-cell.auto .rb-frame { height: auto; }
.aic-rob .rb-cell.auto .rb-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-rob .rb-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-rob .rb-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-rob .rb-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-rob .rb-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-rob .rb-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-rob .rb-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-rob .rb-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-rob .rb-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'rbph-' + i;
  return (
    <div className="rb-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="rb-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function RoboticsPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-rob', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(3, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'landscape';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (4 / 3) : ratioAR;
  const gridCols = `repeat(${segN}, 1fr)`;

  return (
    <div className="aic-rob" style={vars}>
      {p.showDecorations && <div className="rb-glow" />}

      <div className="rb-head">
        <div>
          <p className="rb-eyebrow">{copy.eyebrow}</p>
          <h2 className="rb-title">{copy.title}</h2>
        </div>
        <div className="rb-sub">{copy.titleTail}</div>
      </div>

      <div className="rb-left">
        <div className="rb-marker"><b /><span>{copy.segment}</span></div>
        <p className="rb-lead">{copy.lead}</p>
        <div className="rb-statline">{copy.statLine}</div>

        <div className="rb-dist">
          <p className="rb-dist-t">{copy.panelTitle}</p>
          <div className="rb-cols" style={{ gridTemplateColumns: gridCols }}>
            {segs.map((s, i) => (
              <div className="rb-col" key={s.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                {p.showValues && <div className="rb-col-val">{s.value}<u>亿</u></div>}
                <div className="rb-col-fill" style={{ height: (s.value / maxV * 78) + '%' }} />
              </div>
            ))}
          </div>
          <div className="rb-ground" />
          <div className="rb-names" style={{ gridTemplateColumns: gridCols }}>
            {segs.map((s) => (
              <div className="rb-name" key={s.name}><b>{s.name}</b><span>{s.note}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="rb-hero">
        {imgN === 0 ? (
          <div className="rb-cell fixed">
            <div className="rb-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="rb-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'rb-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="rb-badge">{copy.badge}</span>}
              <div className={'rb-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rb-foot">
        <div className="rb-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="rb-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
