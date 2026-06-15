/**
 * EducationPage — P43 个性化学习与教师工具 (Education AI · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the right and, on the left, a
 * "learning path" node journey: stage discs sized by funding sit on a dashed
 * track, reading left→right as a personalization path. Image count / ratio,
 * stage count, value labels and the focus stage are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-edu`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Education AI',
  segment: '教育 AI 赛道',
  title: '个性化学习与教师工具',
  titleTail: '教育 AI 赛道',
  lead: '教育 AI 从通用答疑转向个性化辅导和教师工作台；难点不是生成答案，而是证明学习效果和付费意愿。',
  statLine: '融资额 14 亿美元 · 5 笔事件',
  closing: '教育 AI 需要用结果证明价值。',
  badge: '教育 AI',
  panelTitle: '学习路径 · 融资 / 亿美元',
  // learning-path stages (order fixed; count is prop-driven)
  segments: [
    { name: 'K12 辅导', value: 6, note: '个性化习题与答疑' },
    { name: '企业培训', value: 5, note: '岗位技能与上岗考核' },
    { name: '教师工具', value: 3, note: '备课、批改与学情分析' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  segmentCount: 3,         // path stages (2–3)
  focusEnabled: true,      // highlight one stage
  focusIndex: 0,           // which stage is the focus (0-based)
  showValues: true,        // value labels on the discs
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Education AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '教育 AI 赛道' },
  { key: 'title', label: '标题', type: 'text', default: '个性化学习与教师工具' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '教育 AI 赛道' },
  { key: 'lead', label: '导言', type: 'text', default: '教育 AI 从通用答疑转向个性化辅导和教师工作台；难点不是生成答案，而是证明学习效果和付费意愿。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 14 亿美元 · 5 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '教育 AI 需要用结果证明价值。' },
  { key: 'badge', label: 'badge', type: 'text', default: '教育 AI' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '学习路径 · 融资 / 亿美元' },
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
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '学习路径阶段数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个学习阶段作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的学习阶段。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '阶段节点内融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮阶段与路径节点。' },
];

const CSS = `
.aic-edu { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-edu, .aic-edu * { box-sizing: border-box; }
.aic-edu .ed-glow { position: absolute; left: 26%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-edu .ed-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-edu .ed-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-edu .ed-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 76px; line-height: .96; margin: 0; }
.aic-edu .ed-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: editorial (top) + learning path (bottom) */
.aic-edu .ed-left { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-edu .ed-marker { display: flex; align-items: center; gap: 16px; }
.aic-edu .ed-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-edu .ed-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-edu .ed-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 12px; text-wrap: pretty; max-width: 880px; }
.aic-edu .ed-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-edu .ed-path { margin-top: auto; }
.aic-edu .ed-path-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-edu .ed-track { position: relative; display: flex; align-items: flex-start; justify-content: space-between; }
.aic-edu .ed-track::before { content: ''; position: absolute; left: 6%; right: 6%; top: 80px; height: 0;
  border-top: 3px dashed var(--aic-hair-strong); z-index: 0; }
.aic-edu .ed-node { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;
  width: 0; flex: 1 1 0; text-align: center; }
.aic-edu .ed-disc { width: var(--d, 130px); height: var(--d, 130px); border-radius: 50%; display: grid;
  place-items: center; background: var(--aic-card); border: 2px solid var(--aic-hair-strong);
  transition: transform .35s, box-shadow .35s, background .35s; }
.aic-edu .ed-node[data-focus="1"] .ed-disc { background: linear-gradient(160deg, var(--aic-accent-bright), var(--aic-accent) 74%);
  border-color: transparent; box-shadow: 0 22px 46px -22px color-mix(in srgb, var(--aic-accent) 75%, transparent);
  transform: scale(1.06); }
.aic-edu .ed-disc-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 44px; line-height: 1;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-edu .ed-disc-v u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 3px; }
.aic-edu .ed-node[data-focus="1"] .ed-disc-v { color: var(--aic-ink); }
.aic-edu .ed-node[data-focus="1"] .ed-disc-v u { color: color-mix(in srgb, var(--aic-ink) 60%, white); }
.aic-edu .ed-step { font-family: var(--aic-font-display); font-weight: 600; font-size: 15px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-faint); margin-top: 20px; }
.aic-edu .ed-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 27px; color: var(--aic-ink); margin-top: 6px; }
.aic-edu .ed-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted);
  margin-top: 6px; line-height: 1.35; max-width: 240px; }

/* right: dominant hero */
.aic-edu .ed-hero { position: absolute; left: 1080px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-edu .ed-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-edu .ed-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-edu .ed-cell.fixed .ed-frame { height: 100%; }
.aic-edu .ed-cell.fixed .ed-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-edu .ed-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-edu .ed-cell.auto .ed-frame { height: auto; }
.aic-edu .ed-cell.auto .ed-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-edu .ed-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-edu .ed-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-edu .ed-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-edu .ed-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-edu .ed-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-edu .ed-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-edu .ed-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-edu .ed-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'edph-' + i;
  return (
    <div className="ed-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="ed-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function EducationPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-edu', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(3, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));
  // disc diameter scales with funding (110–160px)
  const disc = (v) => 110 + (v / maxV) * 50;

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-edu" style={vars}>
      {p.showDecorations && <div className="ed-glow" />}

      <div className="ed-head">
        <div>
          <p className="ed-eyebrow">{copy.eyebrow}</p>
          <h2 className="ed-title">{copy.title}</h2>
        </div>
        <div className="ed-sub">{copy.titleTail}</div>
      </div>

      <div className="ed-left">
        <div className="ed-marker"><b /><span>{copy.segment}</span></div>
        <p className="ed-lead">{copy.lead}</p>
        <div className="ed-statline">{copy.statLine}</div>

        <div className="ed-path">
          <p className="ed-path-t">{copy.panelTitle}</p>
          <div className="ed-track">
            {segs.map((s, i) => (
              <div className="ed-node" key={s.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                <div className="ed-disc" style={{ '--d': disc(s.value) + 'px' }}>
                  {p.showValues && <span className="ed-disc-v">{s.value}<u>亿</u></span>}
                </div>
                <div className="ed-step">{`Stage ${i + 1}`}</div>
                <div className="ed-name">{s.name}</div>
                <div className="ed-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ed-hero">
        {imgN === 0 ? (
          <div className="ed-cell fixed">
            <div className="ed-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="ed-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'ed-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="ed-badge">{copy.badge}</span>}
              <div className={'ed-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="ed-foot">
        <div className="ed-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ed-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
