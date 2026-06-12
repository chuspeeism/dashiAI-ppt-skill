/**
 * ContentGenPage — P42 图像、视频与创意 (Generative Content · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the LEFT and, on the right, a
 * media-type funding distribution rendered as ranked horizontal share rows.
 * Image count / ratio, segment count, value labels and the focus segment are
 * all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-cgn`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Generative Content',
  segment: '内容生成赛道',
  title: '图像、视频与创意',
  titleTail: '内容生成赛道',
  lead: '内容生成继续保持融资热度，但也面临版权和留存问题；长期价值取决于付费意愿与版权处理。',
  statLine: '融资额 31 亿美元 · 11 笔事件',
  closing: '流量热度不等于商业壁垒。',
  badge: '内容生成',
  panelTitle: '媒介分布 · 融资 / 亿美元',
  // media-type breakdown (order fixed; count is prop-driven)
  segments: [
    { name: '视频生成', value: 14, note: '文生视频与镜头控制' },
    { name: '广告创意', value: 8, note: '营销素材批量生成' },
    { name: '图像生成', value: 5, note: '品牌视觉与设计辅助' },
    { name: '音乐音频', value: 4, note: '配乐与语音合成' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'landscape', // 'portrait' | 'landscape' | 'square' | 'auto'
  segmentCount: 3,         // media segments (2–4)
  focusEnabled: true,      // highlight one segment
  focusIndex: 0,           // which segment is the focus (0-based)
  showValues: true,        // value labels on the rows
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Generative Content' },
  { key: 'segment', label: 'segment', type: 'text', default: '内容生成赛道' },
  { key: 'title', label: '标题', type: 'text', default: '图像、视频与创意' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '内容生成赛道' },
  { key: 'lead', label: '导言', type: 'text', default: '内容生成继续保持融资热度，但也面临版权和留存问题；长期价值取决于付费意愿与版权处理。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 31 亿美元 · 11 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '流量热度不等于商业壁垒。' },
  { key: 'badge', label: 'badge', type: 'text', default: '内容生成' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '媒介分布 · 融资 / 亿美元' },
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
  { key: 'segmentCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 4, step: 1,
    description: '媒介方向分布数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个媒介方向作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的媒介方向。', showWhen: (p) => p.focusEnabled },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '分布行末端融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮媒介与分布条。' },
];

const CSS = `
.aic-cgn { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cgn, .aic-cgn * { box-sizing: border-box; }
.aic-cgn .cg-glow { position: absolute; right: -6%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-cgn .cg-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cgn .cg-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cgn .cg-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-cgn .cg-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: dominant hero */
.aic-cgn .cg-hero { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 744px;
  display: flex; gap: 16px; }
.aic-cgn .cg-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-cgn .cg-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-cgn .cg-cell.fixed .cg-frame { height: 100%; }
.aic-cgn .cg-cell.fixed .cg-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-cgn .cg-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-cgn .cg-cell.auto .cg-frame { height: auto; }
.aic-cgn .cg-cell.auto .cg-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-cgn .cg-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-cgn .cg-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-cgn .cg-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-cgn .cg-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

/* right: editorial + media-share rows */
.aic-cgn .cg-right { position: absolute; left: 888px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-cgn .cg-marker { display: flex; align-items: center; gap: 16px; }
.aic-cgn .cg-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-cgn .cg-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-cgn .cg-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 10px; text-wrap: pretty; }
.aic-cgn .cg-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-cgn .cg-dist { margin-top: auto; }
.aic-cgn .cg-dist-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }
.aic-cgn .cg-rows { display: flex; flex-direction: column; gap: 22px; }
.aic-cgn .cg-row { display: grid; grid-template-columns: 52px 1fr; align-items: baseline; gap: 6px 18px;
  transition: opacity .3s; }
.aic-cgn .cg-rank { grid-row: span 2; align-self: center; font-family: var(--aic-font-display); font-weight: 700;
  font-size: 28px; color: var(--aic-faint); font-variant-numeric: tabular-nums; }
.aic-cgn .cg-row[data-focus="1"] .cg-rank { color: var(--aic-accent-deep); }
.aic-cgn .cg-row-top { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.aic-cgn .cg-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink); }
.aic-cgn .cg-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 17px; color: var(--aic-muted); margin-left: 14px; }
.aic-cgn .cg-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 34px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; white-space: nowrap; }
.aic-cgn .cg-row[data-focus="1"] .cg-val { color: var(--aic-accent-deep); }
.aic-cgn .cg-val u { text-decoration: none; font-size: 17px; font-weight: 600; color: var(--aic-muted); margin-left: 4px; }
.aic-cgn .cg-track { grid-column: 2; height: 12px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; margin-top: 10px; }
.aic-cgn .cg-fill { height: 100%; border-radius: 999px; background: color-mix(in srgb, var(--aic-accent) 42%, white);
  transition: width .6s cubic-bezier(.3,.7,.4,1); }
.aic-cgn .cg-row[data-focus="1"] .cg-fill { background: linear-gradient(90deg, var(--aic-accent-bright), var(--aic-accent) 80%); }

.aic-cgn .cg-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-cgn .cg-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cgn .cg-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cgn .cg-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'cgph-' + i;
  return (
    <div className="cg-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="cg-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function ContentGenPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, panelTitle: p.panelTitle !== undefined ? p.panelTitle : COPY.panelTitle, segments: p.segments !== undefined ? p.segments : COPY.segments };
  ensureFonts();
  injectScopedStyle('aic-cgn', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(4, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'landscape';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (4 / 3) : ratioAR;

  return (
    <div className="aic-cgn" style={vars}>
      {p.showDecorations && <div className="cg-glow" />}

      <div className="cg-head">
        <div>
          <p className="cg-eyebrow">{copy.eyebrow}</p>
          <h2 className="cg-title">{copy.title}</h2>
        </div>
        <div className="cg-sub">{copy.titleTail}</div>
      </div>

      <div className="cg-hero">
        {imgN === 0 ? (
          <div className="cg-cell fixed">
            <div className="cg-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="cg-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'cg-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="cg-badge">{copy.badge}</span>}
              <div className={'cg-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cg-right">
        <div className="cg-marker"><b /><span>{copy.segment}</span></div>
        <p className="cg-lead">{copy.lead}</p>
        <div className="cg-statline">{copy.statLine}</div>

        <div className="cg-dist">
          <p className="cg-dist-t">{copy.panelTitle}</p>
          <div className="cg-rows">
            {segs.map((s, i) => (
              <div className="cg-row" key={s.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                <span className="cg-rank">{String(i + 1).padStart(2, '0')}</span>
                <div className="cg-row-top">
                  <span><span className="cg-name">{s.name}</span><span className="cg-note">{s.note}</span></span>
                  {p.showValues && <span className="cg-val">{s.value}<u>亿</u></span>}
                </div>
                <div className="cg-track"><div className="cg-fill" style={{ width: (s.value / maxV * 100) + '%' }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cg-foot">
        <div className="cg-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cg-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
