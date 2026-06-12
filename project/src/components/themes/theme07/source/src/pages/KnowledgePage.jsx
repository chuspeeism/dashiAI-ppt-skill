/**
 * KnowledgePage — P29 知识入口机会 (Enterprise Search · Image-led · Segment Card)
 *
 * Image-led vertical-segment slide: an editorial content column (segment
 * marker, lead, a vertical metric rail and an authored penetration bar) sits
 * beside a dominant hero image area. Distinct from the quarter image pages:
 * here the image is a tall hero on the RIGHT and the metrics read as a rail.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. The hero
 * area count is prop-driven (0–2) and the composition re-flows to stay balanced
 * at every count / aspect ratio; at 0 it falls back to the brand lens graphic.
 *
 * Scoped under `.aic-know`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Enterprise Search',
  segment: '企业搜索赛道',
  title: '知识入口机会',
  titleTail: '企业搜索赛道',
  lead: '企业搜索是较早形成明确付费场景的应用方向；接入内部知识后，企业搜索具备高频使用场景，成为 AI 应用的重要落地点。',
  closing: '企业知识入口是 AI 应用的重要落地点。',
  badge: '企业搜索',
  // metric rail (order fixed; count is prop-driven)
  metrics: [
    { label: '融资额', value: '38', unit: '亿美元' },
    { label: '事件数', value: '9', unit: '笔' },
    { label: '平均单笔', value: '4.2', unit: '亿美元' },
    { label: '付费客户中位数', value: '620', unit: '家' },
  ],
  // authored penetration bar
  progress: { label: '接入内部知识库后的高频检索渗透', value: 58, display: '58%' },
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  metricCount: 4,          // metric rail items (2–4)
  focusEnabled: true,      // highlight one metric
  focusIndex: 0,           // which metric is the focus (0-based)
  showProgress: true,      // authored penetration bar
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Enterprise Search' },
  { key: 'segment', label: 'segment', type: 'text', default: '企业搜索赛道' },
  { key: 'title', label: '标题', type: 'text', default: '知识入口机会' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '企业搜索赛道' },
  { key: 'lead', label: '导言', type: 'text', default: '企业搜索是较早形成明确付费场景的应用方向；接入内部知识后，企业搜索具备高频使用场景，成为 AI 应用的重要落地点。' },
  { key: 'closing', label: '结语', type: 'text', default: '企业知识入口是 AI 应用的重要落地点。' },
  { key: 'badge', label: 'badge', type: 'text', default: '企业搜索' },
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
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '指标栏条目数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一条指标作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的指标。', showWhen: (p) => p.focusEnabled },
  { key: 'showProgress', label: '进度指标', type: 'toggle', default: true,
    description: '底部渗透 / 采用率进度条的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮指标与进度条。' },
];

const CSS = `
.aic-know { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-know, .aic-know * { box-sizing: border-box; }
.aic-know .kw-glow { position: absolute; right: 24%; top: -10%; width: 46%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-know .kw-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-know .kw-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-know .kw-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-know .kw-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* content column (left) */
.aic-know .kw-side { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-know .kw-marker { display: flex; align-items: center; gap: 16px; }
.aic-know .kw-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-know .kw-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-know .kw-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 31px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; max-width: 900px; text-wrap: pretty; }

.aic-know .kw-rail { margin-top: 38px; display: flex; flex-direction: column; }
.aic-know .kw-item { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 20px;
  padding: 22px 6px 22px 24px; border-top: 1.5px solid var(--aic-hair); border-left: 4px solid transparent;
  transition: border-color .3s, background .3s, padding-left .3s; }
.aic-know .kw-item:last-child { border-bottom: 1.5px solid var(--aic-hair); }
.aic-know .kw-item[data-focus="1"] { border-left-color: var(--aic-accent);
  background: color-mix(in srgb, var(--aic-accent) 9%, transparent); padding-left: 30px; }
.aic-know .kw-item-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 24px; color: var(--aic-ink-dim); }
.aic-know .kw-item[data-focus="1"] .kw-item-lbl { color: var(--aic-ink); }
.aic-know .kw-item-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 50px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: .9; white-space: nowrap; }
.aic-know .kw-item[data-focus="1"] .kw-item-val { color: var(--aic-accent-deep); }
.aic-know .kw-item-val u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

.aic-know .kw-prog { margin-top: auto; padding-top: 26px; }
.aic-know .kw-prog-t { display: flex; align-items: baseline; justify-content: space-between; gap: 18px; margin-bottom: 12px; }
.aic-know .kw-prog-t span { font-family: var(--aic-font-text); font-weight: 600; font-size: 22px; color: var(--aic-muted); }
.aic-know .kw-prog-t b { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-know .kw-prog-track { height: 14px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-know .kw-prog-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.3,.7,.4,1);
  background: linear-gradient(90deg, var(--aic-accent-deep), var(--aic-accent)); }

/* hero image area (right) */
.aic-know .kw-hero { position: absolute; left: 1116px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; align-items: stretch; gap: 20px; }
.aic-know .kw-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid; }
.aic-know .kw-cell.fixed { align-items: center; justify-items: center; }
.aic-know .kw-cell.fixed .kw-frame { position: relative; width: 100%; max-height: 100%; aspect-ratio: var(--ar); overflow: hidden; }
.aic-know .kw-cell.fixed .kw-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-know .kw-cell.auto .kw-frame { width: 100%; }
.aic-know .kw-cell.auto .kw-frame > * { width: 100%; display: block; }
.aic-know .kw-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-know .kw-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-know .kw-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-know .kw-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-know .kw-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-know .kw-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-know .kw-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-know .kw-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'kwph-' + i;
  return (
    <div className="kw-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="kw-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function KnowledgePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-know', CSS);
  const vars = themeVars(p.accentColor);

  const metricN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, metricN);
  const focus = Math.max(0, Math.min(metricN - 1, p.focusIndex));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-know" style={vars}>
      {p.showDecorations && <div className="kw-glow" />}

      <div className="kw-head">
        <div>
          <p className="kw-eyebrow">{copy.eyebrow}</p>
          <h2 className="kw-title">{copy.title}</h2>
        </div>
        <div className="kw-sub">{copy.titleTail}</div>
      </div>

      <div className="kw-side">
        <div className="kw-marker"><b /><span>{copy.segment}</span></div>
        <p className="kw-lead">{copy.lead}</p>
        <div className="kw-rail">
          {metrics.map((mt, i) => (
            <div className="kw-item" key={mt.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="kw-item-lbl">{mt.label}</div>
              <div className="kw-item-val">{mt.value}<u>{mt.unit}</u></div>
            </div>
          ))}
        </div>
        {p.showProgress && (
          <div className="kw-prog">
            <div className="kw-prog-t">
              <span>{copy.progress.label}</span>
              <b>{copy.progress.display}</b>
            </div>
            <div className="kw-prog-track">
              <div className="kw-prog-fill" style={{ width: copy.progress.value + '%' }} />
            </div>
          </div>
        )}
      </div>

      <div className="kw-hero">
        {imgN === 0 ? (
          <div className="kw-cell fixed">
            <div className="kw-frame" style={{ '--ar': String(heroAR) }}>
              <div className="kw-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'kw-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="kw-badge">{copy.badge}</span>}
              <div className="kw-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="kw-foot">
        <div className="kw-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="kw-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
