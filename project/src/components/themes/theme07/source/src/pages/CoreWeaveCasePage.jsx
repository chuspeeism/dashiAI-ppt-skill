/**
 * CoreWeaveCasePage — P65 算力基础设施 (CoreWeave Case · Image-led · Case Card)
 *
 * Image-led case card for an infrastructure ("sell the shovels") company. The
 * signature element is a GPU-cluster density grid that visualizes the company's
 * raw compute footprint as a field of lit cells — a bolder, compute-native
 * variant of the OpenAI/Anthropic/xAI case template. A tall hero image carries
 * the company, a slanted brand-style name, positioning tags and a strip of
 * headline metrics (one highlighted).
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode`. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-cwc`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (LensCluster, HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'CoreWeave Case',
  title: '算力基础设施',
  titleTail: 'CoreWeave 案例页',
  logic: '算力基础设施逻辑',
  company: 'CoreWeave',
  enName: 'COREWEAVE',
  badge: '算力基础设施',
  lead: 'CoreWeave 代表算力基础设施的确定性机会；当模型公司都在抢 GPU，算力供应商获得资本溢价。',
  closing: '卖铲子的人也能成为核心资产。',
  // headline metrics (order fixed; count is prop-driven). `num` flags values
  // rendered as upright tabular figures (vs. short qualitative text).
  metrics: [
    { label: '融资额', value: '110', unit: '亿美元', num: true },
    { label: '估值', value: '190', unit: '亿美元', num: true },
    { label: 'GPU 资源', value: '7.8', unit: '万张', num: true },
    { label: '核心客户', value: '模型公司', num: false },
  ],
  // positioning tags (order fixed; count is prop-driven)
  tags: ['算力基础设施', '生成式内容', '企业推理'],
  // GPU cluster signature
  clusterValue: '7.8',
  clusterUnit: '万张',
  clusterLabel: 'GPU 集群规模',
  clusterNote: '高利用率 · 接近刚性预算',
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  metricCount: 4,          // headline metrics shown (2–4)
  focusEnabled: true,      // highlight one metric
  focusIndex: 2,           // which metric is the focus (0-based)
  showCluster: true,       // GPU-cluster density grid (signature)
  clusterDensity: 18,      // cluster grid columns (12–22)
  showTags: true,          // positioning tag cluster
  tagCount: 3,             // tags shown (2–3)
  showDecorations: true,   // glow + heat strip + image badge + name overlay
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'CoreWeave Case' },
  { key: 'title', label: '标题', type: 'text', default: '算力基础设施' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'CoreWeave 案例页' },
  { key: 'logic', label: 'logic', type: 'text', default: '算力基础设施逻辑' },
  { key: 'company', label: 'company', type: 'text', default: 'CoreWeave' },
  { key: 'enName', label: 'enName', type: 'text', default: 'COREWEAVE' },
  { key: 'badge', label: 'badge', type: 'text', default: '算力基础设施' },
  { key: 'lead', label: '导言', type: 'text', default: 'CoreWeave 代表算力基础设施的确定性机会；当模型公司都在抢 GPU，算力供应商获得资本溢价。' },
  { key: 'closing', label: '结语', type: 'text', default: '卖铲子的人也能成为核心资产。' },
  { key: 'clusterValue', label: 'clusterValue', type: 'text', default: '7.8' },
  { key: 'clusterUnit', label: 'clusterUnit', type: 'text', default: '万张' },
  { key: 'clusterLabel', label: 'clusterLabel', type: 'text', default: 'GPU 集群规模' },
  { key: 'clusterNote', label: 'clusterNote', type: 'text', default: '高利用率 · 接近刚性预算' },
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
    description: '展示的指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 2,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showCluster', label: '集群网格', type: 'toggle', default: true,
    description: 'GPU 集群密度网格（算力规模可视化）的显隐。' },
  { key: 'clusterDensity', label: '网格密度', type: 'slider', default: 18, min: 12, max: 22, step: 1,
    description: '集群网格列密度。', showWhen: (p) => p.showCluster },
  { key: 'showTags', label: '标签文案', type: 'toggle', default: true,
    description: '定位标签行的显隐。' },
  { key: 'tagCount', label: '标签数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '定位标签数量（2–3）。', showWhen: (p) => p.showTags },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标、公司名压底与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于强调卡、标签与集群网格。' },
];

const CSS = `
.aic-cwc { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cwc, .aic-cwc * { box-sizing: border-box; }
.aic-cwc .cw-glow { position: absolute; left: 2%; top: -14%; width: 50%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-cwc .cw-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cwc .cw-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cwc .cw-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-cwc .cw-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-cwc .cw-col { position: absolute; left: var(--pad); top: 296px; bottom: 138px; width: 980px;
  display: flex; flex-direction: column; }
.aic-cwc .cw-logic { display: inline-flex; align-self: flex-start; align-items: center; gap: 11px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-cwc .cw-logic i { width: 10px; height: 10px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cwc .cw-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 96px; line-height: .92;
  letter-spacing: -.012em; color: var(--aic-ink); margin: 14px 0 0; transform: skewX(-8deg);
  transform-origin: left bottom; white-space: nowrap; }
.aic-cwc .cw-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink-dim); margin: 28px 0 0; max-width: 900px; text-wrap: pretty; }
.aic-cwc .cw-lead em { font-style: normal; color: var(--aic-accent-deep); font-weight: 700; }
.aic-cwc .cw-tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.aic-cwc .cw-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-cwc .cw-tag.lead { background: var(--aic-accent-soft); color: var(--aic-accent-deep);
  border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }

/* headline metric strip */
.aic-cwc .cw-metrics { margin-top: auto; display: flex; gap: 34px; padding-top: 28px; }
.aic-cwc .cw-mcell { flex: 1 1 0; position: relative; padding-top: 18px;
  border-top: 2.5px solid var(--aic-hair-strong); transition: border-color .3s; }
.aic-cwc .cw-mcell[data-focus="1"] { border-top-color: var(--aic-accent); }
.aic-cwc .cw-mlbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted);
  margin-bottom: 12px; }
.aic-cwc .cw-mval { font-family: var(--aic-font-display); font-weight: 700; line-height: 1; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-cwc .cw-mval.num { font-size: 54px; }
.aic-cwc .cw-mval.txt { font-size: 32px; }
.aic-cwc .cw-mcell[data-focus="1"] .cw-mval { color: var(--aic-accent-deep); }
.aic-cwc .cw-mval u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* right rail: hero image (top) + GPU cluster grid (bottom) */
.aic-cwc .cw-rail { position: absolute; left: 1116px; right: var(--pad); top: 296px; bottom: 138px;
  display: flex; flex-direction: column; gap: 22px; }
.aic-cwc .cw-hero { flex: 1 1 0; display: flex; gap: 16px; min-height: 0; }
.aic-cwc .cw-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-cwc .cw-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-cwc .cw-cell.fixed .cw-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: auto; max-width: 100%; }
.aic-cwc .cw-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-cwc .cw-cell.auto .cw-frame { height: auto; width: 100%; }
.aic-cwc .cw-cell.auto .cw-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-cwc .cw-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 7px 14px; border-radius: 999px; white-space: nowrap; }
.aic-cwc .cw-cname { position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: 60px 26px 24px;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 38px; letter-spacing: .04em; color: #fff;
  background: linear-gradient(to top, rgba(8,10,6,.78), transparent); pointer-events: none; }
.aic-cwc .cw-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-cwc .cw-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-cwc .cw-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

/* GPU cluster density grid (signature) */
.aic-cwc .cw-cluster { flex: none; height: 286px; border-radius: 26px; border: 1.5px solid var(--aic-hair-strong);
  background: var(--aic-ink); color: #fff; padding: 26px 28px; display: flex; flex-direction: column; overflow: hidden; }
.aic-cwc .cw-cluster-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.aic-cwc .cw-cluster-cap { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .16em;
  text-transform: uppercase; color: rgba(255,255,255,.6); }
.aic-cwc .cw-cluster-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 17px; color: rgba(255,255,255,.66);
  text-align: right; max-width: 230px; text-wrap: pretty; }
.aic-cwc .cw-cluster-num { font-family: var(--aic-font-display); font-weight: 700; font-size: 64px; line-height: .82;
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom;
  display: inline-flex; align-items: baseline; color: #fff; }
.aic-cwc .cw-cluster-num u { text-decoration: none; font-family: var(--aic-font-text); font-size: 22px; font-weight: 600;
  color: rgba(255,255,255,.7); margin-left: 12px; transform: skewX(9deg); }
.aic-cwc .cw-grid { flex: 1; display: grid; gap: 6px; align-content: stretch; min-height: 0; margin-top: 18px; }
.aic-cwc .cw-grid i { border-radius: 3px; background: rgba(255,255,255,.12); }
.aic-cwc .cw-grid i.on { background: var(--aic-accent); }
.aic-cwc .cw-grid i.hot { background: var(--aic-accent-bright); box-shadow: 0 0 10px color-mix(in srgb, var(--aic-accent-bright) 70%, transparent); }

.aic-cwc .cw-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 60px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-cwc .cw-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cwc .cw-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cwc .cw-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'cwph-' + i;
  return (
    <div className="cw-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="cw-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

// deterministic GPU-cluster fill pattern: ~82% lit, a few "hot" cells
function ClusterGrid({ cols }) {
  const rows = 4;
  const n = cols * rows;
  const cells = [];
  for (let i = 0; i < n; i++) {
    const r = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const v = r < 0 ? r + 1 : r;
    let cls = 'on';
    if (v > 0.82) cls = '';          // idle cell
    else if (v < 0.12) cls = 'on hot';
    cells.push(<i key={i} className={cls} />);
  }
  return (
    <div className="cw-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {cells}
    </div>
  );
}

export default function CoreWeaveCasePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, logic: p.logic !== undefined ? p.logic : COPY.logic, company: p.company !== undefined ? p.company : COPY.company, enName: p.enName !== undefined ? p.enName : COPY.enName, badge: p.badge !== undefined ? p.badge : COPY.badge, lead: p.lead !== undefined ? p.lead : COPY.lead, closing: p.closing !== undefined ? p.closing : COPY.closing, clusterValue: p.clusterValue !== undefined ? p.clusterValue : COPY.clusterValue, clusterUnit: p.clusterUnit !== undefined ? p.clusterUnit : COPY.clusterUnit, clusterLabel: p.clusterLabel !== undefined ? p.clusterLabel : COPY.clusterLabel, clusterNote: p.clusterNote !== undefined ? p.clusterNote : COPY.clusterNote, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics, tags: p.tags !== undefined ? p.tags : COPY.tags };
  ensureFonts();
  injectScopedStyle('aic-cwc', CSS);
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
  const cols = Math.max(12, Math.min(22, p.clusterDensity));

  return (
    <div className="aic-cwc" style={vars}>
      {p.showDecorations && <div className="cw-glow" />}

      <div className="cw-head">
        <div>
          <p className="cw-eyebrow">{copy.eyebrow}</p>
          <h2 className="cw-title">{copy.title}</h2>
        </div>
        <div className="cw-sub">{copy.titleTail}</div>
      </div>

      <div className="cw-col">
        <span className="cw-logic"><i />{copy.logic}</span>
        <p className="cw-name">{copy.company}</p>
        <p className="cw-lead">{copy.lead}</p>

        {p.showTags && (
          <div className="cw-tags">
            {tags.map((t, i) => <span className={'cw-tag' + (i === 0 ? ' lead' : '')} key={t}>{t}</span>)}
          </div>
        )}

        <div className="cw-metrics">
          {metrics.map((m, i) => (
            <div className="cw-mcell" key={m.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="cw-mlbl">{m.label}</div>
              <div className={'cw-mval ' + (m.num ? 'num' : 'txt')}>
                {m.value}{m.num && m.unit ? <u>{m.unit}</u> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cw-rail">
        <div className="cw-hero">
          {imgN === 0 ? (
            <div className="cw-cell fixed">
              <div className="cw-frame" style={{ '--ar': String(heroAR) }}>
                <div className="cw-deco-fill"><LensCluster /></div>
              </div>
            </div>
          ) : (
            Array.from({ length: imgN }).map((_, i) => (
              <div className={'cw-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
                {p.showDecorations && i === 0 && <span className="cw-badge">{copy.badge}</span>}
                {p.showDecorations && i === 0 && <span className="cw-cname">{copy.enName}</span>}
                <div className="cw-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
                </div>
              </div>
            ))
          )}
        </div>

        {p.showCluster && (
          <div className="cw-cluster">
            <div className="cw-cluster-top">
              <div>
                <div className="cw-cluster-cap">{copy.clusterLabel}</div>
                <div className="cw-cluster-num">{copy.clusterValue}<u>{copy.clusterUnit}</u></div>
              </div>
              <div className="cw-cluster-note">{copy.clusterNote}</div>
            </div>
            <ClusterGrid cols={cols} />
          </div>
        )}
      </div>

      <div className="cw-foot">
        <div className="cw-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cw-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
