/**
 * InvestorPage — P25 活跃资本图谱 (Capital Lens · Investor Wall · Image-led)
 *
 * An image-forward "portfolio wall" slide that opens the capital-side section:
 * a full-width row of image cells (each an investor portrait / portfolio shot)
 * with overlaid institution chips, framed by a short lead and an anchor figure.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic: the page does NOT hard-depend on any web component. Fillable
 * slots are supplied by the host via `renderSlot(i, { ratio, ratioAR }) =>
 * ReactNode`. When omitted, a striped placeholder renders, so the page works
 * (and exports) standalone. Cell count is prop-driven (0–4) and the row stays
 * balanced at every count and aspect ratio. At count 0 the wall falls back to
 * the brand lens graphic so the composition never breaks.
 *
 * Self-contained & prop-driven. Scoped under `.aic-inv`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Capital Lens',
  title: '活跃资本图谱',
  titleTail: '头部投资机构',
  lead: '大额融资背后是一批高频出手的头部机构，资本正从广撒网转向对头部资产的集中下注。',
  anchorLead: '48',
  anchorUnit: '家',
  anchorNote: '全年参与大额轮次的活跃机构',
  closing: '钱多不稀缺，稀缺的是愿意下重注的确定性。',
  // per-cell institution chips (order fixed; count is prop-driven)
  slots: [
    { name: 'Aperture Ventures', role: '领投 9 笔 · 偏好通用大模型' },
    { name: 'Northgate Capital', role: '参投 14 笔 · 全赛道布局' },
    { name: 'Vertex Growth', role: '领投 7 笔 · 押注基础设施' },
    { name: 'Lumen Partners', role: '参投 11 笔 · 应用层为主' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 3,          // image cells on the wall (0–4)
  imageRatio: 'portrait', // 'portrait' | 'landscape' | 'square' | 'auto'
  showLabels: true,       // institution chips overlaid on each cell
  focusEnabled: true,     // highlight one cell
  focusIndex: 0,          // which cell is the focus (0-based)
  showAnchor: true,       // anchor figure (active-institution count)
  showDecorations: true,  // glow + heat strip
  accentColor: THEME.accent,
  renderSlot: null,       // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Capital Lens' },
  { key: 'title', label: '标题', type: 'text', default: '活跃资本图谱' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '头部投资机构' },
  { key: 'lead', label: '导言', type: 'text', default: '大额融资背后是一批高频出手的头部机构，资本正从广撒网转向对头部资产的集中下注。' },
  { key: 'anchorLead', label: '锚点数字', type: 'text', default: '48' },
  { key: 'anchorUnit', label: '锚点单位', type: 'text', default: '家' },
  { key: 'anchorNote', label: '锚点注释', type: 'text', default: '全年参与大额轮次的活跃机构' },
  { key: 'closing', label: '结语', type: 'text', default: '钱多不稀缺，稀缺的是愿意下重注的确定性。' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 3, min: 0, max: 4, step: 1,
    description: '图片墙的图片槽数量（0–4）；为 0 时以品牌图形填充，构图保持完整。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'portrait',
    options: [
      { value: 'portrait', label: '竖图' },
      { value: 'landscape', label: '横图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽比例；自适应会跟随用户上传图片的原始比例并自动居中排布。' },
  { key: 'showLabels', label: '说明文案', type: 'toggle', default: true,
    description: '每张图片上叠加的机构名称 / 角色标签的显隐。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张图片作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的图片。', showWhen: (p) => p.focusEnabled && p.imageCount > 0 },
  { key: 'showAnchor', label: '重点数字', type: 'toggle', default: true,
    description: '右上锚点数字（活跃机构数量）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于高亮图片框、机构标签与锚点数字。' },
];

const CSS = `
.aic-inv { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-inv, .aic-inv * { box-sizing: border-box; }
.aic-inv .iv-glow { position: absolute; left: -4%; top: -10%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-inv .iv-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-inv .iv-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-inv .iv-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-inv .iv-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-inv .iv-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* meta band: lead (left) · anchor (right) */
.aic-inv .iv-meta { position: absolute; left: var(--pad); right: var(--pad); top: 268px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 64px; }
.aic-inv .iv-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 0; max-width: 1150px; }
.aic-inv .iv-anchor { flex: none; text-align: right; }
.aic-inv .iv-anchor-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px;
  color: var(--aic-muted); margin: 10px 0 0; max-width: 320px; line-height: 1.4; text-align: right; }

/* image wall */
.aic-inv .iv-wall { position: absolute; left: var(--pad); right: var(--pad); top: 408px; bottom: 156px;
  display: flex; align-items: center; justify-content: center; gap: 24px; }
.aic-inv .iv-cell { position: relative; overflow: hidden; border-radius: 22px;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair);
  transition: transform .35s, border-color .35s, box-shadow .35s; }
.aic-inv .iv-cell.fixed { height: 100%; aspect-ratio: var(--ar); max-width: 100%; }
.aic-inv .iv-cell.auto { flex: 1 1 0; height: auto; max-height: 100%; }
.aic-inv .iv-cell.brand { height: 100%; aspect-ratio: var(--ar); max-width: 100%; }
.aic-inv .iv-cell[data-focus="1"] { border-color: var(--aic-accent); transform: translateY(-8px);
  box-shadow: 0 22px 48px -22px color-mix(in srgb, var(--aic-accent) 70%, transparent); }
.aic-inv .iv-slot { position: absolute; inset: 0; }
.aic-inv .iv-slot > * { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.aic-inv .iv-cell.auto .iv-slot { position: relative; inset: auto; }
.aic-inv .iv-cell.auto .iv-slot > * { position: relative; inset: auto; width: 100%; height: auto; }
.aic-inv .iv-deco-fill { width: 100%; height: 100%; position: relative; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

/* striped placeholder */
.aic-inv .iv-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-inv .iv-cell.auto .iv-ph { position: relative; min-height: 380px; }
.aic-inv .iv-ph-cap { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 16px; letter-spacing: .06em; color: var(--aic-ink-dim); }

/* institution chip */
.aic-inv .iv-chip { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; padding: 26px 22px 18px;
  background: linear-gradient(to top, rgba(14,17,11,.86), rgba(14,17,11,.32) 64%, transparent);
  display: flex; flex-direction: column; gap: 4px; }
.aic-inv .iv-chip b { font-family: var(--aic-font-display); font-weight: 700; font-size: 24px; color: #fff;
  line-height: 1.1; }
.aic-inv .iv-chip span { font-family: var(--aic-font-text); font-weight: 500; font-size: 16px;
  color: rgba(255,255,255,.78); line-height: 1.35; }
.aic-inv .iv-cell[data-focus="1"] .iv-chip { background: linear-gradient(to top,
  color-mix(in srgb, var(--aic-accent) 90%, #0a0d06), color-mix(in srgb, var(--aic-accent) 30%, transparent) 64%, transparent); }
.aic-inv .iv-cell[data-focus="1"] .iv-chip b { color: var(--aic-ink); }
.aic-inv .iv-cell[data-focus="1"] .iv-chip span { color: rgba(14,17,11,.7); }
.aic-inv .iv-rank { position: absolute; top: 16px; left: 16px; z-index: 3; width: 40px; height: 40px;
  border-radius: 50%; background: rgba(255,255,255,.9); display: grid; place-items: center;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 20px; color: var(--aic-ink);
  transform: skewX(-9deg); }
.aic-inv .iv-cell[data-focus="1"] .iv-rank { background: var(--aic-ink); color: var(--aic-accent); }

.aic-inv .iv-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-inv .iv-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-inv .iv-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-inv .iv-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','neg','accent','pos','warn','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i, auto }) {
  const pid = 'ivph-' + i;
  return (
    <div className={'iv-ph' + (auto ? ' auto' : '')}>
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="iv-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function InvestorPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, anchorLead: p.anchorLead !== undefined ? p.anchorLead : COPY.anchorLead, anchorUnit: p.anchorUnit !== undefined ? p.anchorUnit : COPY.anchorUnit, anchorNote: p.anchorNote !== undefined ? p.anchorNote : COPY.anchorNote, closing: p.closing !== undefined ? p.closing : COPY.closing, slots: p.slots !== undefined ? p.slots : COPY.slots };
  ensureFonts();
  injectScopedStyle('aic-inv', CSS);
  const vars = themeVars(p.accentColor);

  const imgN = Math.max(0, Math.min(4, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const brandAR = isAuto ? (3 / 4) : ratioAR;
  const focus = Math.max(0, Math.min(Math.max(0, imgN - 1), p.focusIndex));

  return (
    <div className="aic-inv" style={vars}>
      {p.showDecorations && <div className="iv-glow" />}

      <div className="iv-head">
        <div>
          <p className="iv-eyebrow">{copy.eyebrow}</p>
          <h2 className="iv-title">{copy.title}</h2>
        </div>
        <div className="iv-sub">{copy.titleTail}</div>
      </div>

      <div className="iv-meta">
        <p className="iv-lead">{copy.lead}</p>
        {p.showAnchor && (
          <div className="iv-anchor">
            <BigNumber lead={copy.anchorLead} unit={copy.anchorUnit} size={108} />
            <p className="iv-anchor-note">{copy.anchorNote}</p>
          </div>
        )}
      </div>

      <div className="iv-wall">
        {imgN === 0 ? (
          <div className="iv-cell brand" style={{ '--ar': String(brandAR) }}>
            <div className="iv-deco-fill"><LensCluster /></div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => {
            const info = copy.slots[i % copy.slots.length];
            const isF = p.focusEnabled && i === focus;
            return (
              <div className={'iv-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}
                data-focus={isF ? '1' : '0'}
                style={isAuto ? null : { '--ar': String(ratioAR) }}>
                <div className="iv-slot">
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} auto={isAuto} />}
                </div>
                <span className="iv-rank">{i + 1}</span>
                {p.showLabels && (
                  <div className="iv-chip">
                    <b>{info.name}</b>
                    <span>{info.role}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="iv-foot">
        <div className="iv-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="iv-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
