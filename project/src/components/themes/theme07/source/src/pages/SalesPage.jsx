/**
 * SalesPage — P45 增长效率工具 (Sales & Marketing AI · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the LEFT and, on the right, a growth
 * funnel: stages render as centred, tapering bars that read top→bottom as an
 * acquisition→conversion funnel, each sized by funding. Image count / ratio,
 * stage count, value labels and the focus stage are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-sl`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Sales & Marketing AI',
  segment: '销售与营销 AI',
  title: '增长效率工具',
  titleTail: '销售与营销 AI',
  lead: '销售与营销 AI 集中在线索评分、自动外呼、邮件和广告创意；短期转化快，但同质化竞争也更明显。',
  statLine: '融资额 24 亿美元 · 10 笔事件',
  closing: '营销 AI 要用转化率证明自己。',
  badge: '销售营销',
  panelTitle: '增长漏斗 · 融资 / 亿美元',
  // funnel stages, ordered acquisition → conversion (count is prop-driven)
  segments: [
    { name: '广告创意', value: 8, note: '获客 · 营销素材批量生成' },
    { name: '线索评分', value: 7, note: '筛选 · 意向预测与排序' },
    { name: '自动外呼', value: 6, note: '转化 · 邮件与语音触达' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'landscape', // 'portrait' | 'landscape' | 'square' | 'auto'
  segmentCount: 3,         // funnel stages (2–3)
  focusEnabled: true,      // highlight one stage
  focusIndex: 0,           // which stage is the focus (0-based)
  showValues: true,        // value labels in the funnel
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Sales & Marketing AI' },
  { key: 'segment', label: 'segment', type: 'text', default: '销售与营销 AI' },
  { key: 'title', label: '标题', type: 'text', default: '增长效率工具' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '销售与营销 AI' },
  { key: 'lead', label: '导言', type: 'text', default: '销售与营销 AI 集中在线索评分、自动外呼、邮件和广告创意；短期转化快，但同质化竞争也更明显。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 24 亿美元 · 10 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '营销 AI 要用转化率证明自己。' },
  { key: 'badge', label: 'badge', type: 'text', default: '销售营销' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '增长漏斗 · 融资 / 亿美元' },
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
    description: '漏斗阶段数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个漏斗阶段作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的漏斗阶段。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '漏斗阶段内融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮阶段与漏斗。' },
];

const CSS = `
.aic-sl { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-sl, .aic-sl * { box-sizing: border-box; }
.aic-sl .sl-glow { position: absolute; left: -6%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-sl .sl-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-sl .sl-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-sl .sl-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-sl .sl-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: dominant hero */
.aic-sl .sl-hero { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 744px;
  display: flex; gap: 16px; }
.aic-sl .sl-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-sl .sl-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-sl .sl-cell.fixed .sl-frame { height: 100%; }
.aic-sl .sl-cell.fixed .sl-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-sl .sl-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-sl .sl-cell.auto .sl-frame { height: auto; }
.aic-sl .sl-cell.auto .sl-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-sl .sl-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-sl .sl-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-sl .sl-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-sl .sl-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

/* right: editorial + growth funnel */
.aic-sl .sl-right { position: absolute; left: 888px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-sl .sl-marker { display: flex; align-items: center; gap: 16px; }
.aic-sl .sl-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-sl .sl-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-sl .sl-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 10px; text-wrap: pretty; }
.aic-sl .sl-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-sl .sl-funnel { margin-top: auto; }
.aic-sl .sl-funnel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }
.aic-sl .sl-stages { display: flex; flex-direction: column; gap: 16px; }
.aic-sl .sl-stage { display: grid; grid-template-columns: 1fr var(--barcol, 360px); align-items: center; gap: 28px;
  transition: opacity .3s; }
.aic-sl .sl-info { text-align: right; }
.aic-sl .sl-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); line-height: 1.1; }
.aic-sl .sl-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 17px; color: var(--aic-muted); margin-top: 4px; }
.aic-sl .sl-barwrap { display: flex; justify-content: center; }
.aic-sl .sl-bar { height: 84px; border-radius: 18px; width: var(--w); min-width: 120px;
  background: color-mix(in srgb, var(--aic-accent) 30%, white); border: 1.5px solid color-mix(in srgb, var(--aic-accent) 45%, white);
  display: flex; align-items: center; justify-content: center; gap: 4px;
  transition: width .6s cubic-bezier(.3,.7,.4,1), background .35s, box-shadow .35s, transform .35s; }
.aic-sl .sl-stage[data-focus="1"] .sl-bar { background: linear-gradient(135deg, var(--aic-accent-bright), var(--aic-accent) 82%);
  border-color: transparent; box-shadow: 0 22px 46px -22px color-mix(in srgb, var(--aic-accent) 75%, transparent); transform: scale(1.03); }
.aic-sl .sl-stage[data-focus="1"] .sl-info .sl-name { color: var(--aic-accent-deep); }
.aic-sl .sl-bar-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 38px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-sl .sl-bar-v u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-ink-dim); margin-left: 3px; }

.aic-sl .sl-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-sl .sl-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); white-space: nowrap; }
.aic-sl .sl-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-sl .sl-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'slph-' + i;
  return (
    <div className="sl-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="sl-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function SalesPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-sl', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(3, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));
  // funnel bar width: scale 100%→58% with value, so it tapers as funding falls
  const barW = (v) => (58 + (v / maxV) * 42) + '%';

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'landscape';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (4 / 3) : ratioAR;

  return (
    <div className="aic-sl" style={vars}>
      {p.showDecorations && <div className="sl-glow" />}

      <div className="sl-head">
        <div>
          <p className="sl-eyebrow">{copy.eyebrow}</p>
          <h2 className="sl-title">{copy.title}</h2>
        </div>
        <div className="sl-sub">{copy.titleTail}</div>
      </div>

      <div className="sl-hero">
        {imgN === 0 ? (
          <div className="sl-cell fixed">
            <div className="sl-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="sl-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'sl-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="sl-badge">{copy.badge}</span>}
              <div className={'sl-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sl-right">
        <div className="sl-marker"><b /><span>{copy.segment}</span></div>
        <p className="sl-lead">{copy.lead}</p>
        <div className="sl-statline">{copy.statLine}</div>

        <div className="sl-funnel">
          <p className="sl-funnel-t">{copy.panelTitle}</p>
          <div className="sl-stages">
            {segs.map((s, i) => (
              <div className="sl-stage" key={s.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                <div className="sl-info">
                  <div className="sl-name">{s.name}</div>
                  <div className="sl-note">{s.note}</div>
                </div>
                <div className="sl-barwrap">
                  <div className="sl-bar" style={{ '--w': barW(s.value) }}>
                    {p.showValues && <span className="sl-bar-v">{s.value}<u>亿</u></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sl-foot">
        <div className="sl-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="sl-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
