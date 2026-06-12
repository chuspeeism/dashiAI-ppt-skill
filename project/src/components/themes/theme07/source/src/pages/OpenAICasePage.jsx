/**
 * OpenAICasePage — P62 商业化标杆 (OpenAI Case · Image-led · Case Card)
 *
 * A single-company "case card": one representative company profiled with a
 * tall hero image, a slanted brand-style name, an industry tag cluster and a
 * strip of headline metrics (one highlighted). Part of the case-card series
 * (OpenAI / Anthropic / xAI) — the three share the `.aic-cc` template scope and
 * an identical prop contract; only the authored text differs.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic and
 * the composition stays intact.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-cc`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (LensCluster, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'OpenAI Case',
  title: '商业化标杆',
  titleTail: 'OpenAI 案例页',
  logic: '通用大模型逻辑',
  company: 'OpenAI',
  enName: 'OPENAI',
  badge: '商业化标杆',
  lead: 'OpenAI 仍是通用大模型商业化的标杆样本；看点是模型能力、生态入口与企业商业化能否同时领先。',
  closing: '模型能力必须转成生态和收入。',
  // headline metrics (order fixed; count is prop-driven). `num` flags the
  // values that render as upright tabular figures (vs. short qualitative text).
  metrics: [
    { label: '最大单笔融资', value: '66', unit: '亿美元', num: true },
    { label: '企业客户', value: '9.4', unit: '万家', num: true },
    { label: '年度化收入', value: '38', unit: '亿美元', num: true },
    { label: '核心赛道', value: '通用大模型', num: false },
  ],
  // industry / positioning tags (order fixed; count is prop-driven)
  tags: ['通用大模型', '生态入口', '企业商业化'],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  metricCount: 3,          // headline metrics shown (2–4)
  focusEnabled: true,      // highlight one metric
  focusIndex: 0,           // which metric is the focus (0-based)
  showTags: true,          // positioning tag cluster
  tagCount: 3,             // tags shown (2–3)
  showDecorations: true,   // glow + heat strip + image badge + name overlay
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'OpenAI Case' },
  { key: 'title', label: '标题', type: 'text', default: '商业化标杆' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'OpenAI 案例页' },
  { key: 'logic', label: 'logic', type: 'text', default: '通用大模型逻辑' },
  { key: 'company', label: 'company', type: 'text', default: 'OpenAI' },
  { key: 'enName', label: 'enName', type: 'text', default: 'OPENAI' },
  { key: 'badge', label: 'badge', type: 'text', default: '商业化标杆' },
  { key: 'lead', label: '导言', type: 'text', default: 'OpenAI 仍是通用大模型商业化的标杆样本；看点是模型能力、生态入口与企业商业化能否同时领先。' },
  { key: 'closing', label: '结语', type: 'text', default: '模型能力必须转成生态和收入。' },
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
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 4, step: 1,
    description: '展示的指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showTags', label: '标签文案', type: 'toggle', default: true,
    description: '定位标签行的显隐。' },
  { key: 'tagCount', label: '标签数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '定位标签数量（2–3）。', showWhen: (p) => p.showTags },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标、公司名压底与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于强调卡、标签与图形。' },
];

const CSS = `
.aic-cc { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cc, .aic-cc * { box-sizing: border-box; }
.aic-cc .cc-glow { position: absolute; left: 4%; top: -12%; width: 52%; height: 62%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-cc .cc-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cc .cc-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cc .cc-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-cc .cc-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-cc .cc-col { position: absolute; left: var(--pad); top: 296px; bottom: 138px; width: 980px;
  display: flex; flex-direction: column; }
.aic-cc .cc-logic { display: inline-flex; align-self: flex-start; align-items: center; gap: 11px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-cc .cc-logic i { width: 10px; height: 10px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cc .cc-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 104px; line-height: .92;
  letter-spacing: -.012em; color: var(--aic-ink); margin: 14px 0 0; transform: skewX(-8deg);
  transform-origin: left bottom; white-space: nowrap; }
.aic-cc .cc-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink-dim); margin: 30px 0 0; max-width: 900px; text-wrap: pretty; }
.aic-cc .cc-lead em { font-style: normal; color: var(--aic-accent-deep); font-weight: 700; }
.aic-cc .cc-tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.aic-cc .cc-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-cc .cc-tag.lead { background: var(--aic-accent-soft); color: var(--aic-accent-deep);
  border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }

/* headline metric strip */
.aic-cc .cc-metrics { margin-top: auto; display: flex; gap: 36px; padding-top: 30px; }
.aic-cc .cc-mcell { flex: 1 1 0; position: relative; padding-top: 18px;
  border-top: 2.5px solid var(--aic-hair-strong); transition: border-color .3s; }
.aic-cc .cc-mcell[data-focus="1"] { border-top-color: var(--aic-accent); }
.aic-cc .cc-mlbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted);
  margin-bottom: 12px; }
.aic-cc .cc-mval { font-family: var(--aic-font-display); font-weight: 700; line-height: 1; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-cc .cc-mval.num { font-size: 56px; }
.aic-cc .cc-mval.txt { font-size: 34px; }
.aic-cc .cc-mcell[data-focus="1"] .cc-mval { color: var(--aic-accent-deep); }
.aic-cc .cc-mval u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* hero image (right) */
.aic-cc .cc-hero { position: absolute; left: 1116px; right: var(--pad); top: 296px; bottom: 138px;
  display: flex; gap: 16px; }
.aic-cc .cc-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-cc .cc-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-cc .cc-cell.fixed .cc-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: auto; max-width: 100%; }
.aic-cc .cc-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-cc .cc-cell.auto .cc-frame { height: auto; width: 100%; }
.aic-cc .cc-cell.auto .cc-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-cc .cc-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 7px 14px; border-radius: 999px; white-space: nowrap; }
.aic-cc .cc-cname { position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: 60px 26px 24px;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 38px; letter-spacing: .04em; color: #fff;
  background: linear-gradient(to top, rgba(8,10,6,.78), transparent); pointer-events: none; }
.aic-cc .cc-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-cc .cc-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-cc .cc-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-cc .cc-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 60px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-cc .cc-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cc .cc-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cc .cc-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'ccph-' + i;
  return (
    <div className="cc-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="cc-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function OpenAICasePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, logic: p.logic !== undefined ? p.logic : COPY.logic, company: p.company !== undefined ? p.company : COPY.company, enName: p.enName !== undefined ? p.enName : COPY.enName, badge: p.badge !== undefined ? p.badge : COPY.badge, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics, tags: p.tags !== undefined ? p.tags : COPY.tags };
  ensureFonts();
  injectScopedStyle('aic-cc', CSS);
  const vars = themeVars(p.accentColor);

  const mN = Math.max(2, Math.min(copy.metrics.length, p.metricCount));
  const metrics = copy.metrics.slice(0, mN);
  const focus = Math.max(0, Math.min(mN - 1, p.focusIndex));

  const tagN = Math.max(2, Math.min(copy.tags.length, p.tagCount));
  const tags = copy.tags.slice(0, tagN);

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-cc" style={vars}>
      {p.showDecorations && <div className="cc-glow" />}

      <div className="cc-head">
        <div>
          <p className="cc-eyebrow">{copy.eyebrow}</p>
          <h2 className="cc-title">{copy.title}</h2>
        </div>
        <div className="cc-sub">{copy.titleTail}</div>
      </div>

      <div className="cc-col">
        <span className="cc-logic"><i />{copy.logic}</span>
        <p className="cc-name">{copy.company}</p>
        <p className="cc-lead">{copy.lead}</p>

        {p.showTags && (
          <div className="cc-tags">
            {tags.map((t, i) => <span className={'cc-tag' + (i === 0 ? ' lead' : '')} key={t}>{t}</span>)}
          </div>
        )}

        <div className="cc-metrics">
          {metrics.map((m, i) => (
            <div className="cc-mcell" key={m.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="cc-mlbl">{m.label}</div>
              <div className={'cc-mval ' + (m.num ? 'num' : 'txt')}>
                {m.value}{m.num && m.unit ? <u>{m.unit}</u> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cc-hero">
        {imgN === 0 ? (
          <div className="cc-cell fixed">
            <div className="cc-frame" style={{ '--ar': String(heroAR) }}>
              <div className="cc-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'cc-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="cc-badge">{copy.badge}</span>}
              {p.showDecorations && i === 0 && <span className="cc-cname">{copy.enName}</span>}
              <div className="cc-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cc-foot">
        <div className="cc-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cc-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
