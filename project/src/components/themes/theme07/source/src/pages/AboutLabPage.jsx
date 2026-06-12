/**
 * AboutLabPage — P84 关于 AI Capital Lab (About · Image-led)
 *
 * Image-led closing/about slide: an editorial column with a numbered capability
 * list on the left, and an adaptive hero gallery on the right that recomposes
 * cleanly for 0–3 images. A single image can follow its own uploaded ratio
 * (imageRatio = auto); two or three become a balanced gallery wall. Image count,
 * ratio, capability-card count, the focus card and the contact line are all
 * prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–3); at 0 the gallery falls back to the brand lens graphic.
 *
 * Scoped under `.aic-about`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'About the Lab',
  segment: '研究团队与方法',
  title: '关于 AI Capital Lab',
  titleTail: '研究团队与方法',
  lead: 'AI Capital Lab 专注于 AI 产业的资本流向研究，用横纵分析法把融资数据转化为结构化判断，服务投资人、创业者与产业研究者。',
  statLine: '横纵分析法 · 多源交叉 · 持续追踪',
  closing: '从资本流向，看 AI 产业的真实重心。',
  badge: '研究团队',
  listTitle: '我们做什么',
  // capability cards (order fixed; count is prop-driven)
  cards: [
    { label: '资本流向研究', note: '追踪大额融资事件与赛道结构变化' },
    { label: '横纵分析方法', note: '空间对比 × 时间演化 × 产业分层' },
    { label: '多源数据核对', note: '公开披露交叉验证，口径透明可复核' },
    { label: '前瞻信号追踪', note: '收入兑现、IPO 窗口与算力成本观察' },
  ],
  contactTitle: '联系',
  contacts: ['research@aicapitallab.example', 'AI Capital Lab · 行业研究'],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 2,           // hero gallery slots (0–3)
  imageRatio: 'auto',      // 'portrait' | 'landscape' | 'square' | 'auto'
  cardCount: 4,            // capability cards (2–4)
  focusEnabled: true,      // highlight one card
  focusIndex: 0,           // which card is the focus (0-based)
  showContact: true,       // contact line
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'About the Lab' },
  { key: 'segment', label: 'segment', type: 'text', default: '研究团队与方法' },
  { key: 'title', label: '标题', type: 'text', default: '关于 AI Capital Lab' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '研究团队与方法' },
  { key: 'lead', label: '导言', type: 'text', default: 'AI Capital Lab 专注于 AI 产业的资本流向研究，用横纵分析法把融资数据转化为结构化判断，服务投资人、创业者与产业研究者。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '横纵分析法 · 多源交叉 · 持续追踪' },
  { key: 'closing', label: '结语', type: 'text', default: '从资本流向，看 AI 产业的真实重心。' },
  { key: 'badge', label: 'badge', type: 'text', default: '研究团队' },
  { key: 'listTitle', label: 'listTitle', type: 'text', default: '我们做什么' },
  { key: 'contactTitle', label: 'contactTitle', type: 'text', default: '联系' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 2, min: 0, max: 3, step: 1,
    description: '主视觉区图片槽数量（0–3）；为 0 时以品牌图形填充，1 张可跟随原图比例，多张自动排成画廊。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'auto',
    options: [
      { value: 'portrait', label: '竖图' },
      { value: 'landscape', label: '横图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽比例；自适应会跟随用户上传图片的原始比例（单图自然排布，多图统一为画廊墙）。' },
  { key: 'cardCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '左侧能力说明卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张能力卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的能力卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showContact', label: '联系信息', type: 'toggle', default: true,
    description: '底部联系信息行的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于序号、高亮卡与装饰。' },
];

const CSS = `
.aic-about { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-about, .aic-about * { box-sizing: border-box; }
.aic-about .ab-glow { position: absolute; right: 8%; top: -8%; width: 48%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-about .ab-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-about .ab-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-about .ab-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-about .ab-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-about .ab-side { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 880px;
  display: flex; flex-direction: column; }
.aic-about .ab-marker { display: flex; align-items: center; gap: 16px; }
.aic-about .ab-marker b { width: 52px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-about .ab-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-about .ab-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 10px; text-wrap: pretty; }
.aic-about .ab-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-about .ab-list-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 30px 0 8px; }
.aic-about .ab-cards { display: flex; flex-direction: column; }
.aic-about .ab-card { display: grid; grid-template-columns: 78px 1fr; align-items: center; gap: 8px 4px;
  padding: 16px 18px; border-bottom: 1.5px solid var(--aic-hair); border-radius: 14px;
  transition: background .3s, transform .3s; }
.aic-about .ab-card:last-child { border-bottom: none; }
.aic-about .ab-card[data-focus="1"] { background: color-mix(in srgb, var(--aic-accent) 13%, var(--aic-card)); transform: translateX(6px); }
.aic-about .ab-card-n { grid-row: 1 / 3; font-family: var(--aic-font-display); font-weight: 700; font-size: 46px;
  line-height: .8; color: var(--aic-faint); font-variant-numeric: lining-nums; transform: skewX(-9deg);
  transform-origin: left bottom; display: inline-block; }
.aic-about .ab-card[data-focus="1"] .ab-card-n { color: var(--aic-accent-deep); }
.aic-about .ab-card-l { font-family: var(--aic-font-text); font-weight: 700; font-size: 30px; color: var(--aic-ink); align-self: end; }
.aic-about .ab-card-d { font-family: var(--aic-font-text); font-weight: 500; font-size: 21px; color: var(--aic-muted); align-self: start; }

.aic-about .ab-contact { margin-top: auto; padding-top: 22px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.aic-about .ab-contact-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 16px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-about .ab-contact em { font-style: normal; font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  color: var(--aic-ink-dim); padding: 6px 16px; border: 1.5px solid var(--aic-hair-strong); border-radius: 999px; }

/* hero gallery (right) */
.aic-about .ab-gallery { position: absolute; left: 1016px; right: var(--pad); top: 300px; bottom: 150px;
  display: flex; flex-direction: column; gap: 16px; }
.aic-about .ab-cell { position: relative; overflow: hidden; border-radius: 24px;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); }
.aic-about .ab-cell.tile { flex: 1 1 0; min-height: 0; }
.aic-about .ab-cell.fill { flex: 1 1 0; }
.aic-about .ab-cell.single-fixed { margin: auto 0; width: 100%; }
.aic-about .ab-cell.single-auto { margin: auto 0; width: 100%; }
.aic-about .ab-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-about .ab-cell.tile .ab-frame, .aic-about .ab-cell.fill .ab-frame { height: 100%; }
.aic-about .ab-cell.single-fixed .ab-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-about .ab-cell.single-auto .ab-frame { height: auto; }
.aic-about .ab-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-about .ab-cell.single-auto .ab-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-about .ab-badge { position: absolute; top: 16px; left: 16px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-about .ab-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }
.aic-about .ab-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-about .ab-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }

.aic-about .ab-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-about .ab-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-about .ab-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-about .ab-deco { width: 300px; height: 30px; }
`;

const HEAT = ['accent','pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos',
  'accent','pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos',
  'pos','accent','warn','pos','accent','pos','pos','warn','accent','pos'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'abph-' + i;
  return (
    <div className="ab-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="ab-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function AboutLabPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, listTitle: p.listTitle !== undefined ? p.listTitle : COPY.listTitle, contactTitle: p.contactTitle !== undefined ? p.contactTitle : COPY.contactTitle, cards: p.cards !== undefined ? p.cards : COPY.cards, contacts: p.contacts !== undefined ? p.contacts : COPY.contacts };
  ensureFonts();
  injectScopedStyle('aic-about', CSS);
  const vars = themeVars(p.accentColor);

  const cardN = Math.max(2, Math.min(copy.cards.length, p.cardCount));
  const cards = copy.cards.slice(0, cardN);
  const focus = Math.max(0, Math.min(cardN - 1, p.focusIndex));

  const imgN = Math.max(0, Math.min(3, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'auto';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const single = imgN === 1;
  // single image: honor its ratio (auto = natural). multiple: uniform gallery tiles.
  const cellClass = single ? (isAuto ? 'single-auto' : 'single-fixed') : 'tile';

  return (
    <div className="aic-about" style={vars}>
      {p.showDecorations && <div className="ab-glow" />}

      <div className="ab-head">
        <div>
          <p className="ab-eyebrow">{copy.eyebrow}</p>
          <h2 className="ab-title">{copy.title}</h2>
        </div>
        <div className="ab-sub">{copy.titleTail}</div>
      </div>

      <div className="ab-side">
        <div className="ab-marker"><b /><span>{copy.segment}</span></div>
        <p className="ab-lead">{copy.lead}</p>
        <div className="ab-statline">{copy.statLine}</div>

        <p className="ab-list-t">{copy.listTitle}</p>
        <div className="ab-cards">
          {cards.map((c, i) => (
            <div className="ab-card" key={c.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <span className="ab-card-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="ab-card-l">{c.label}</span>
              <span className="ab-card-d">{c.note}</span>
            </div>
          ))}
        </div>

        {p.showContact && (
          <div className="ab-contact">
            <span className="ab-contact-t">{copy.contactTitle}</span>
            {copy.contacts.map((c) => <em key={c}>{c}</em>)}
          </div>
        )}
      </div>

      <div className="ab-gallery">
        {imgN === 0 ? (
          <div className="ab-cell fill">
            <div className="ab-frame"><div className="ab-deco-fill"><LensCluster /></div></div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'ab-cell ' + cellClass} key={i}
              style={single && !isAuto ? { '--ar': String(ratioAR) } : null}>
              {p.showDecorations && i === 0 && <span className="ab-badge">{copy.badge}</span>}
              <div className="ab-frame">
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="ab-foot">
        <div className="ab-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ab-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
