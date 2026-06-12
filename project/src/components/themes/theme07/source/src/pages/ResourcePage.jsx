/**
 * ResourcePage — P53 钱以外的资源 (Strategic Investors · Image-led · Resource Map)
 *
 * Image-led slide: a "resource map" of strategic-investor contributions
 * (cloud credit, co-selling, chip supply, data partnerships) anchors the left
 * as a card grid; an editorial column and a hero image sit on the right.
 * Card count, the focus card, the resource-strength meter, the image
 * count / ratio are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-res`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Strategic Investors',
  segment: '战略投资者角色',
  title: '钱以外的资源',
  titleTail: '战略投资者角色',
  lead: '战略投资者提供渠道、云资源、芯片供应和客户入口；交易真正价值经常不只在现金，而在关键资源绑定。',
  statLine: '资源绑定是大额融资的隐性条款',
  closing: 'AI 公司融资是在锁定未来资源。',
  badge: '战略资源',
  panelTitle: '战略资源构成',
  // resource cards (order fixed; count is prop-driven). `w` = relative strength 0..1.
  cards: [
    { glyph: '云', label: '云资源授信', value: '118', unit: '亿美元', note: '云算力额度与折扣承诺', w: 1.0 },
    { glyph: '销', label: '联合销售', value: '36', unit: '起', note: '战略客户渠道与转介', w: 0.62 },
    { glyph: '芯', label: '芯片供应承诺', value: '22', unit: '起', note: 'GPU / 加速卡优先供给', w: 0.46 },
    { glyph: '数', label: '数据合作', value: '17', unit: '起', note: '训练与评测数据互通', w: 0.38 },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'landscape', // 'portrait' | 'landscape' | 'square' | 'auto'
  cardCount: 4,            // resource cards (2–4)
  focusEnabled: true,      // highlight one card
  focusIndex: 0,           // which card is the focus (0-based)
  showMeter: true,         // resource-strength meter under each card
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Strategic Investors' },
  { key: 'segment', label: 'segment', type: 'text', default: '战略投资者角色' },
  { key: 'title', label: '标题', type: 'text', default: '钱以外的资源' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '战略投资者角色' },
  { key: 'lead', label: '导言', type: 'text', default: '战略投资者提供渠道、云资源、芯片供应和客户入口；交易真正价值经常不只在现金，而在关键资源绑定。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '资源绑定是大额融资的隐性条款' },
  { key: 'closing', label: '结语', type: 'text', default: 'AI 公司融资是在锁定未来资源。' },
  { key: 'badge', label: 'badge', type: 'text', default: '战略资源' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '战略资源构成' },
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
  { key: 'cardCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '资源类型卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张资源卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的资源卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showMeter', label: '强度条', type: 'toggle', default: true,
    description: '资源卡底部资源强度示意条的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于资源标记、强度条与高亮卡。' },
];

const CSS = `
.aic-res { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-res, .aic-res * { box-sizing: border-box; }
.aic-res .rs-glow { position: absolute; left: 18%; top: -8%; width: 46%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-res .rs-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-res .rs-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-res .rs-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-res .rs-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* resource card grid (left) */
.aic-res .rs-panel { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 880px;
  display: flex; flex-direction: column; }
.aic-res .rs-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 20px; }
.aic-res .rs-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 22px; min-height: 0; }
.aic-res .rs-grid[data-single="1"] { grid-template-columns: 1fr; }
.aic-res .rs-card { position: relative; border: 1.5px solid var(--aic-hair); border-radius: 22px;
  background: var(--aic-card); padding: 28px 30px; overflow: hidden; display: flex; flex-direction: column;
  transition: border-color .3s, background .3s, box-shadow .3s; }
.aic-res .rs-card[data-focus="1"] { border-color: transparent;
  background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 16%, var(--aic-card)), var(--aic-card) 76%);
  box-shadow: 0 24px 50px -30px color-mix(in srgb, var(--aic-accent) 70%, transparent); }
.aic-res .rs-card[data-focus="1"]::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
  background: var(--aic-accent); }
.aic-res .rs-card-top { display: flex; align-items: center; gap: 14px; }
.aic-res .rs-glyph { width: 46px; height: 46px; border-radius: 13px; flex: none; display: grid; place-items: center;
  background: var(--aic-accent-soft); color: var(--aic-accent-deep); font-family: var(--aic-font-text);
  font-weight: 900; font-size: 22px; }
.aic-res .rs-card[data-focus="1"] .rs-glyph { background: var(--aic-accent); color: var(--aic-ink); }
.aic-res .rs-card-lbl { font-family: var(--aic-font-text); font-weight: 700; font-size: 25px; color: var(--aic-ink); }
.aic-res .rs-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 56px; line-height: 1;
  color: var(--aic-ink); margin-top: 16px; font-variant-numeric: tabular-nums; }
.aic-res .rs-card[data-focus="1"] .rs-card-val { color: var(--aic-accent-deep); }
.aic-res .rs-card-val u { text-decoration: none; font-size: 21px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }
.aic-res .rs-card-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 18px; color: var(--aic-muted);
  margin-top: 8px; }
.aic-res .rs-meter { margin-top: auto; padding-top: 18px; }
.aic-res .rs-meter-track { height: 8px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-res .rs-meter-fill { height: 100%; border-radius: 999px; background: var(--aic-accent);
  transition: width .5s cubic-bezier(.3,.7,.4,1); }
.aic-res .rs-card[data-focus="0"] .rs-meter-fill { background: var(--aic-hair-strong); }

/* content + hero column (right) */
.aic-res .rs-side { position: absolute; left: 1052px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-res .rs-marker { display: flex; align-items: center; gap: 16px; }
.aic-res .rs-marker b { width: 52px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-res .rs-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-res .rs-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 27px; line-height: 1.5;
  color: var(--aic-ink); margin: 18px 0 12px; text-wrap: pretty; }
.aic-res .rs-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .03em;
  color: var(--aic-muted); }
.aic-res .rs-hero { margin-top: 24px; flex: 1; display: flex; gap: 16px; min-height: 0; }
.aic-res .rs-cell { position: relative; overflow: hidden; border-radius: 24px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-res .rs-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-res .rs-cell.fixed .rs-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-res .rs-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-res .rs-cell.auto .rs-frame { height: auto; }
.aic-res .rs-cell.auto .rs-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-res .rs-badge { position: absolute; top: 16px; left: 16px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-res .rs-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-res .rs-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-res .rs-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-res .rs-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-res .rs-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-res .rs-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-res .rs-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'rsph-' + i;
  return (
    <div className="rs-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="rs-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function ResourcePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, panelTitle: p.panelTitle !== undefined ? p.panelTitle : COPY.panelTitle, cards: p.cards !== undefined ? p.cards : COPY.cards };
  ensureFonts();
  injectScopedStyle('aic-res', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(4, p.cardCount));
  const cards = copy.cards.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'landscape';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (4 / 3) : ratioAR;

  return (
    <div className="aic-res" style={vars}>
      {p.showDecorations && <div className="rs-glow" />}

      <div className="rs-head">
        <div>
          <p className="rs-eyebrow">{copy.eyebrow}</p>
          <h2 className="rs-title">{copy.title}</h2>
        </div>
        <div className="rs-sub">{copy.titleTail}</div>
      </div>

      <div className="rs-panel">
        <p className="rs-panel-t">{copy.panelTitle}</p>
        <div className="rs-grid" data-single={n <= 2 ? '1' : '0'}>
          {cards.map((c, i) => (
            <div className="rs-card" key={c.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="rs-card-top">
                <span className="rs-glyph">{c.glyph}</span>
                <span className="rs-card-lbl">{c.label}</span>
              </div>
              <div className="rs-card-val">{c.value}<u>{c.unit}</u></div>
              <div className="rs-card-note">{c.note}</div>
              {p.showMeter && (
                <div className="rs-meter">
                  <div className="rs-meter-track">
                    <div className="rs-meter-fill" style={{ width: Math.round(c.w * 100) + '%' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rs-side">
        <div className="rs-marker"><b /><span>{copy.segment}</span></div>
        <p className="rs-lead">{copy.lead}</p>
        <div className="rs-statline">{copy.statLine}</div>
        <div className="rs-hero">
          {imgN === 0 ? (
            <div className="rs-cell fixed">
              <div className="rs-frame" style={{ '--ar': String(heroAR) }}>
                <div className="rs-deco-fill"><LensCluster /></div>
              </div>
            </div>
          ) : (
            Array.from({ length: imgN }).map((_, i) => (
              <div className={'rs-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
                {p.showDecorations && i === 0 && <span className="rs-badge">{copy.badge}</span>}
                <div className="rs-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                  {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rs-foot">
        <div className="rs-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="rs-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
