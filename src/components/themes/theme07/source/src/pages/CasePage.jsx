/**
 * CasePage — P08 典型案例深度剖析 (Case Studies · Image-led)
 *
 * Image-led slide: a row of case cards, each with an image slot on top and
 * a metric block below. The number of image slots (0–n), their aspect ratio,
 * the card count and the focus card are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * This component is pure and host-agnostic: it does NOT hard-depend on any
 * web component. The actual fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When `renderSlot`
 * is omitted, a static striped placeholder is rendered instead, so the page
 * is fully functional (and exportable) on its own. The preview runtime wires
 * `renderSlot` to a drop-capable, ratio-adaptive slot — see the demo loader.
 *
 * Scoped under `.aic-case`. Shared deps: ./theme.js, ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Case Studies',
  title: '典型案例',
  titleTail: '深度剖析',
  sub: '三类资本逻辑的代表公司',
  lead: 'Anthropic、xAI 和 CoreWeave 分别代表安全模型、实时数据生态和算力基础设施三类资本逻辑。',
  closing: '不同案例共同指向同一个问题：技术优势能否转成可持续收入。',
  cases: [
    { logic: '安全模型逻辑', en: 'Anthropic', zh: '安全可靠模型', chips: ['安全对齐', 'Claude'],
      lead: '650', plus: true, unit: '亿美元', metricLabel: '累计融资' },
    { logic: '实时数据逻辑', en: 'xAI', zh: '实时数据生态', chips: ['实时数据', '多模态'],
      lead: '50', unit: '亿美元', metricLabel: '单笔融资' },
    { logic: '算力设施逻辑', en: 'CoreWeave', zh: '算力基础设施', chips: ['GPU 云', '算力资源'],
      lead: '110', unit: '亿美元', metricLabel: '融资额' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' returns null so the host
// slot can size itself to the uploaded image.
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

export const defaultProps = {
  copy: COPY,
  cardCount: 3,            // number of case cards (1–3)
  imageCount: 3,           // how many cards carry an image slot (0–n)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  focusEnabled: true,
  focusIndex: 0,
  showDecorations: true,
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'cardCount', label: '卡片数量', type: 'slider', default: 3, min: 1, max: 3, step: 1,
    description: '展示的案例卡数量（1–3）。' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '带图片槽的卡片数量（0–n）；其余卡片以品牌图形填充，保持构图完整。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'portrait',
    options: [
      { value: 'portrait', label: '竖图' },
      { value: 'landscape', label: '横图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽的比例；自适应会跟随用户上传图片的原始比例。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张案例卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的案例卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '重点标签、背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-case { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-case, .aic-case * { box-sizing: border-box; }
.aic-case .cs-glow { position: absolute; right: -6%; top: -10%; width: 54%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-case .cs-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-case .cs-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-case .cs-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-case .cs-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-case .cs-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-case .cs-lead { position: absolute; left: var(--pad); top: 286px; width: 1320px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.5; color: var(--aic-ink-dim); margin: 0; }

.aic-case .cs-grid { position: absolute; left: var(--pad); right: var(--pad); top: 420px; bottom: 150px;
  display: grid; gap: 28px; align-items: start; }
.aic-case .cs-card { position: relative; display: flex; flex-direction: column; height: 100%;
  border-radius: 24px; overflow: hidden; background: var(--aic-card); border: 1.5px solid var(--aic-hair);
  transition: border-color .3s, transform .3s, box-shadow .3s; }
.aic-case .cs-card[data-focus="1"] { border-color: var(--aic-accent); transform: translateY(-8px);
  box-shadow: 0 24px 60px -28px color-mix(in srgb, var(--aic-accent) 60%, transparent); }
.aic-case .cs-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; }

.aic-case .cs-imgbox { position: relative; width: 100%; overflow: hidden; background: var(--aic-accent-soft); }
.aic-case .cs-imgbox.fixed > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-case .cs-imgbox.auto { min-height: 200px; }
.aic-case .cs-imgbox.auto > * { width: 100%; display: block; }
.aic-case .cs-ph { width: 100%; height: 100%; display: grid; place-items: center; }
.aic-case .cs-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em;
  color: var(--aic-ink-dim); }
.aic-case .cs-deco-fill { width: 100%; height: 100%; position: relative; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-case .cs-meta { flex: 1; display: flex; flex-direction: column; gap: 14px; padding: 26px 28px 28px; }
.aic-case .cs-logic { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px;
  letter-spacing: .1em; text-transform: uppercase; color: var(--aic-muted); }
.aic-case .cs-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 42px; line-height: 1;
  color: var(--aic-ink); margin: 0; transform: skewX(-7deg); transform-origin: left bottom; }
.aic-case .cs-zh { font-family: var(--aic-font-text); font-weight: 700; font-size: 25px; color: var(--aic-ink-dim); margin: -4px 0 0; }
.aic-case .cs-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 2px; }
.aic-case .cs-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-ink-dim);
  padding: 7px 15px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); }
.aic-case .cs-metric { margin-top: auto; padding-top: 16px; border-top: 1.5px solid var(--aic-hair);
  display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.aic-case .cs-metric .lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted); }

.aic-case .cs-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-case .cs-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-case .cs-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-case .cs-deco { width: 300px; height: 32px; }
`;

const DECO = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i, ratioAR }) {
  const pid = 'csph-' + i;
  return (
    <div className="cs-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="cs-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function CasePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-case', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(1, Math.min(3, p.cardCount));
  const cases = copy.cases.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const imgN = Math.max(0, Math.min(n, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;

  return (
    <div className="aic-case" style={vars}>
      {p.showDecorations && <div className="cs-glow" />}

      <div className="cs-head">
        <div>
          <p className="cs-eyebrow">{copy.eyebrow}</p>
          <h2 className="cs-title">{copy.title}<em>· {copy.titleTail}</em></h2>
        </div>
        <div className="cs-sub">{copy.sub}</div>
      </div>

      <p className="cs-lead">{copy.lead}</p>

      <div className="cs-grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {cases.map((c, i) => {
          const hasImage = i < imgN;
          const boxStyle = isAuto ? {} : { aspectRatio: String(ratioAR) };
          return (
            <div className="cs-card" key={c.en} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              {p.showDecorations && p.focusEnabled && i === focus && <span className="cs-badge">重点</span>}
              <div className={'cs-imgbox ' + (isAuto && hasImage ? 'auto' : 'fixed')} style={boxStyle}>
                {hasImage
                  ? (p.renderSlot ? p.renderSlot(i, { ratio, ratioAR })
                                  : <Placeholder i={i} ratioAR={ratioAR} />)
                  : <div className="cs-deco-fill"><LensCluster /></div>}
              </div>
              <div className="cs-meta">
                <div className="cs-logic">{c.logic}</div>
                <p className="cs-name">{c.en}</p>
                <p className="cs-zh">{c.zh}</p>
                <div className="cs-tags">
                  {c.chips.map((t) => <span className="cs-tag" key={t}>{t}</span>)}
                </div>
                <div className="cs-metric">
                  <BigNumber lead={c.lead + (c.plus ? '+' : '')} unit={c.unit} size={48} slant={false} />
                  <span className="lbl">{c.metricLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cs-foot">
        <div className="cs-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cs-deco"><HeatStrip data={DECO} gap={4} /></div>}
      </div>
    </div>
  );
}
