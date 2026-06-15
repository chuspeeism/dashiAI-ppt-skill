/**
 * HealthcarePage — P31 慢变量高壁垒 (Healthcare AI · Image-led · Segment Card)
 *
 * Image-led vertical-segment slide: an editorial column + hero image on the
 * left, and a three-branch funding breakdown (影像 / 药物 / 临床) rendered as a
 * baseline-aligned column chart on the right — the signature device for this
 * segment. Image count, branch count, value labels and the focus branch are
 * all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-health`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Healthcare AI',
  segment: '医疗 AI 赛道',
  title: '慢变量高壁垒',
  titleTail: '医疗 AI 赛道',
  lead: '医疗 AI 集中在影像、药物发现和临床文书自动化；验证周期长，但进入流程后的壁垒更强。',
  statLine: '融资额 34 亿美元 · 8 笔事件',
  closing: '慢场景不代表低价值。',
  badge: '医疗 AI',
  panelTitle: '三大方向 · 融资分布 / 亿美元',
  // branch breakdown (order fixed; count is prop-driven)
  branches: [
    { name: '影像诊断', value: 11, note: '放射影像识别与分诊' },
    { name: '药物发现', value: 14, note: '靶点发现与分子生成' },
    { name: '临床文书', value: 9, note: '病历与文书自动化' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'landscape', // 'portrait' | 'landscape' | 'square' | 'auto'
  branchCount: 3,          // funding-breakdown branches (2–3)
  focusEnabled: true,      // highlight one branch
  focusIndex: 1,           // which branch is the focus (0-based)
  showValues: true,        // value labels on the branch columns
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Healthcare AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '医疗 AI 赛道' },
  { key: 'title', label: '标题', type: 'text', default: '慢变量高壁垒' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '医疗 AI 赛道' },
  { key: 'lead', label: '导言', type: 'text', default: '医疗 AI 集中在影像、药物发现和临床文书自动化；验证周期长，但进入流程后的壁垒更强。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 34 亿美元 · 8 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '慢场景不代表低价值。' },
  { key: 'badge', label: 'badge', type: 'text', default: '医疗 AI' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '三大方向 · 融资分布 / 亿美元' },
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
  { key: 'branchCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '融资分布分支数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个分支作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 1,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的分支。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '分支柱顶部融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮分支与柱形。' },
];

const CSS = `
.aic-health { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-health, .aic-health * { box-sizing: border-box; }
.aic-health .hl-glow { position: absolute; right: -4%; top: -8%; width: 48%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-health .hl-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-health .hl-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-health .hl-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-health .hl-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* content + hero column (left) */
.aic-health .hl-side { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 720px;
  display: flex; flex-direction: column; }
.aic-health .hl-marker { display: flex; align-items: center; gap: 16px; }
.aic-health .hl-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-health .hl-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-health .hl-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 14px; text-wrap: pretty; }
.aic-health .hl-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-health .hl-hero { margin-top: 26px; flex: 1; display: flex; gap: 18px; min-height: 0; }
.aic-health .hl-cell { position: relative; overflow: hidden; border-radius: 24px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-health .hl-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-health .hl-cell.fixed .hl-frame { height: 100%; }
.aic-health .hl-cell.fixed .hl-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-health .hl-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-health .hl-cell.auto .hl-frame { height: auto; }
.aic-health .hl-cell.auto .hl-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-health .hl-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-health .hl-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-health .hl-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-health .hl-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

/* branch breakdown column chart (right) */
.aic-health .hl-panel { position: absolute; left: 876px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-health .hl-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }
.aic-health .hl-bars { flex: 1; display: grid; gap: 26px; align-items: stretch; }
.aic-health .hl-col { display: flex; flex-direction: column; min-height: 0; }
.aic-health .hl-col-zone { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; min-height: 0; }
.aic-health .hl-col-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 38px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; margin-bottom: 12px; transition: color .3s; }
.aic-health .hl-col-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-health .hl-col[data-focus="1"] .hl-col-val { color: var(--aic-accent-deep); }
.aic-health .hl-col-fill { border-radius: 16px 16px 6px 6px;
  background: color-mix(in srgb, var(--aic-accent) 44%, white);
  transition: height .6s cubic-bezier(.3,.7,.4,1), background .3s; min-height: 16px; }
.aic-health .hl-col[data-focus="1"] .hl-col-fill {
  background: linear-gradient(180deg, var(--aic-accent-bright), var(--aic-accent) 70%); }
.aic-health .hl-col-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 27px; color: var(--aic-ink);
  margin-top: 18px; }
.aic-health .hl-col-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; color: var(--aic-muted);
  margin-top: 6px; line-height: 1.35; }

.aic-health .hl-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-health .hl-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-health .hl-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-health .hl-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'hlph-' + i;
  return (
    <div className="hl-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="hl-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function HealthcarePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-health', CSS);
  const vars = themeVars(p.accentColor);

  const branchN = Math.max(2, Math.min(3, p.branchCount));
  const branches = copy.branches.slice(0, branchN);
  const focus = Math.max(0, Math.min(branchN - 1, p.focusIndex));
  const maxV = Math.max(...branches.map((b) => b.value));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'landscape';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (4 / 3) : ratioAR;

  return (
    <div className="aic-health" style={vars}>
      {p.showDecorations && <div className="hl-glow" />}

      <div className="hl-head">
        <div>
          <p className="hl-eyebrow">{copy.eyebrow}</p>
          <h2 className="hl-title">{copy.title}</h2>
        </div>
        <div className="hl-sub">{copy.titleTail}</div>
      </div>

      <div className="hl-side">
        <div className="hl-marker"><b /><span>{copy.segment}</span></div>
        <p className="hl-lead">{copy.lead}</p>
        <div className="hl-statline">{copy.statLine}</div>
        <div className="hl-hero">
          {imgN === 0 ? (
            <div className="hl-cell fixed">
              <div className="hl-frame cap" style={{ '--ar': String(heroAR) }}>
                <div className="hl-deco-fill"><LensCluster /></div>
              </div>
            </div>
          ) : (
            Array.from({ length: imgN }).map((_, i) => (
              <div className={'hl-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
                {p.showDecorations && i === 0 && <span className="hl-badge">{copy.badge}</span>}
                <div className={'hl-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hl-panel">
        <p className="hl-panel-t">{copy.panelTitle}</p>
        <div className="hl-bars" style={{ gridTemplateColumns: `repeat(${branchN}, 1fr)` }}>
          {branches.map((b, i) => (
            <div className="hl-col" key={b.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="hl-col-zone">
                {p.showValues && <div className="hl-col-val">{b.value}<u>亿</u></div>}
                <div className="hl-col-fill" style={{ height: (b.value / maxV * 72) + '%' }} />
              </div>
              <div className="hl-col-name">{b.name}</div>
              <div className="hl-col-note">{b.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hl-foot">
        <div className="hl-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="hl-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
