/**
 * AlignmentPage — P48 安全与对齐工具 (Model Alignment · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the RIGHT and, on the left, a set of
 * "defense pillar" gauges (eval / alignment / red-team) sized by funding and
 * sitting under a protective shield arc. Image count / ratio, pillar count,
 * the shield motif, value labels and the focus pillar are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-al`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Model Alignment',
  segment: '模型安全公司',
  title: '安全与对齐工具',
  titleTail: '模型安全公司',
  lead: '模型安全和对齐公司吸引长期资本关注；安全对齐既是技术壁垒，也是大客户信任入口。',
  statLine: '融资额 21 亿美元 · 5 笔事件',
  closing: '可信 AI 会成为企业级 AI 的基础设施。',
  badge: '安全对齐',
  panelTitle: '安全防线 · 融资 / 亿美元',
  shieldLabel: '可信 AI 防线',
  // defense pillars (count is prop-driven 2–3)
  segments: [
    { name: '评测平台', value: 8, note: '能力与风险基准' },
    { name: '对齐工具', value: 7, note: '价值对齐与约束' },
    { name: '红队服务', value: 6, note: '攻击与漏洞挖掘' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  segmentCount: 3,         // defense pillars (2–3)
  focusEnabled: true,      // highlight one pillar
  focusIndex: 0,           // which pillar is the focus (0-based)
  showShield: true,        // protective shield arc motif
  showValues: true,        // value labels on the pillars
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Model Alignment' },
  { key: 'segment', label: 'segment', type: 'text', default: '模型安全公司' },
  { key: 'title', label: '标题', type: 'text', default: '安全与对齐工具' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '模型安全公司' },
  { key: 'lead', label: '导言', type: 'text', default: '模型安全和对齐公司吸引长期资本关注；安全对齐既是技术壁垒，也是大客户信任入口。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 21 亿美元 · 5 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '可信 AI 会成为企业级 AI 的基础设施。' },
  { key: 'badge', label: 'badge', type: 'text', default: '安全对齐' },
  { key: 'panelTitle', label: 'panelTitle', type: 'text', default: '安全防线 · 融资 / 亿美元' },
  { key: 'shieldLabel', label: 'shieldLabel', type: 'text', default: '可信 AI 防线' },
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
    description: '安全防线分项数量（2–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个防线分项作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的防线分项。', showWhen: (p) => p.focusEnabled },
  { key: 'showShield', label: '防线装饰', type: 'toggle', default: true,
    description: '防线上方的防护弧线装饰的显隐。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '防线柱内融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮防线与防护弧线。' },
];

const CSS = `
.aic-al { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-al, .aic-al * { box-sizing: border-box; }
.aic-al .al-glow { position: absolute; left: 26%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-al .al-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-al .al-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-al .al-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 76px; line-height: .96; margin: 0; }
.aic-al .al-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: editorial + defense pillars */
.aic-al .al-left { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 920px;
  display: flex; flex-direction: column; }
.aic-al .al-marker { display: flex; align-items: center; gap: 16px; }
.aic-al .al-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-al .al-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-al .al-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 10px; text-wrap: pretty; max-width: 880px; }
.aic-al .al-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-al .al-panel { margin-top: auto; }
.aic-al .al-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 18px; }
.aic-al .al-shield { position: relative; height: 56px; margin-bottom: 6px; }
.aic-al .al-shield svg { width: 100%; height: 100%; display: block; overflow: visible; }
.aic-al .al-shield-lbl { position: absolute; top: 2px; left: 50%; transform: translateX(-50%);
  font-family: var(--aic-font-display); font-weight: 600; font-size: 16px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--aic-accent-deep); background: var(--aic-paper); padding: 0 14px; white-space: nowrap; }
.aic-al .al-pillars { display: flex; align-items: flex-end; gap: 30px; }
.aic-al .al-col { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; }
.aic-al .al-track { position: relative; width: 100%; height: 280px; border-radius: 22px;
  background: color-mix(in srgb, var(--aic-ink) 4%, var(--aic-card)); border: 1.5px solid var(--aic-hair);
  display: flex; align-items: flex-end; overflow: hidden; }
.aic-al .al-fill { width: 100%; border-radius: 18px; background: color-mix(in srgb, var(--aic-accent) 30%, white);
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 22px;
  transition: height .6s cubic-bezier(.3,.7,.4,1), background .35s; }
.aic-al .al-col[data-focus="1"] .al-fill { background: linear-gradient(180deg, var(--aic-accent-bright), var(--aic-accent) 88%); }
.aic-al .al-col[data-focus="1"] .al-track { border-color: transparent;
  box-shadow: 0 24px 50px -26px color-mix(in srgb, var(--aic-accent) 75%, transparent); }
.aic-al .al-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 42px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-al .al-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-ink-dim); margin-left: 3px; }
.aic-al .al-name { font-family: var(--aic-font-display); font-weight: 700; font-size: 27px; color: var(--aic-ink); margin-top: 18px; }
.aic-al .al-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 17px; color: var(--aic-muted); margin-top: 5px;
  text-align: center; line-height: 1.35; }

/* right: dominant hero */
.aic-al .al-hero { position: absolute; left: 1080px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-al .al-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-al .al-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-al .al-cell.fixed .al-frame { height: 100%; }
.aic-al .al-cell.fixed .al-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-al .al-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-al .al-cell.auto .al-frame { height: auto; }
.aic-al .al-cell.auto .al-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-al .al-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-al .al-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-al .al-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-al .al-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-al .al-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-al .al-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); white-space: nowrap; }
.aic-al .al-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-al .al-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'alph-' + i;
  return (
    <div className="al-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="al-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function AlignmentPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, panelTitle: p.panelTitle !== undefined ? p.panelTitle : COPY.panelTitle, shieldLabel: p.shieldLabel !== undefined ? p.shieldLabel : COPY.shieldLabel, segments: p.segments !== undefined ? p.segments : COPY.segments };
  ensureFonts();
  injectScopedStyle('aic-al', CSS);
  const vars = themeVars(p.accentColor);

  const segN = Math.max(2, Math.min(3, p.segmentCount));
  const segs = copy.segments.slice(0, segN);
  const focus = Math.max(0, Math.min(segN - 1, p.focusIndex));
  const maxV = Math.max(...segs.map((s) => s.value));
  // gauge fill height: 56%→100% of track by value
  const fillH = (v) => (56 + (v / maxV) * 44) + '%';

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-al" style={vars}>
      {p.showDecorations && <div className="al-glow" />}

      <div className="al-head">
        <div>
          <p className="al-eyebrow">{copy.eyebrow}</p>
          <h2 className="al-title">{copy.title}</h2>
        </div>
        <div className="al-sub">{copy.titleTail}</div>
      </div>

      <div className="al-left">
        <div className="al-marker"><b /><span>{copy.segment}</span></div>
        <p className="al-lead">{copy.lead}</p>
        <div className="al-statline">{copy.statLine}</div>

        <div className="al-panel">
          <p className="al-panel-t">{copy.panelTitle}</p>
          {p.showShield && (
            <div className="al-shield">
              <svg viewBox="0 0 920 56" preserveAspectRatio="none" aria-hidden="true">
                <path d="M8 50 Q460 -18 912 50" fill="none" stroke="var(--aic-accent)" strokeWidth="2.5" strokeDasharray="2 10" strokeLinecap="round" />
              </svg>
              <span className="al-shield-lbl">{copy.shieldLabel}</span>
            </div>
          )}
          <div className="al-pillars">
            {segs.map((s, i) => (
              <div className="al-col" key={s.name} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                <div className="al-track">
                  <div className="al-fill" style={{ height: fillH(s.value) }}>
                    {p.showValues && <span className="al-val">{s.value}<u>亿</u></span>}
                  </div>
                </div>
                <div className="al-name">{s.name}</div>
                <div className="al-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="al-hero">
        {imgN === 0 ? (
          <div className="al-cell fixed">
            <div className="al-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="al-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'al-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="al-badge">{copy.badge}</span>}
              <div className={'al-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="al-foot">
        <div className="al-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="al-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
