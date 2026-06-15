/**
 * RiskPage — P12 风险研判 (Risk Assessment · Image-led)
 *
 * Image-led slide: an image slot beside a risk-transmission chain and a list
 * of risk cards. Image count (0–1), aspect ratio, risk-card count, the chain
 * band and the focus card are all prop-driven.
 *
 * ── Image slot (migration note) ────────────────────────────────────────────
 * Like CasePage, this is host-agnostic: it takes a `renderSlot(i, {ratio,
 * ratioAR}) => ReactNode` prop and falls back to a striped placeholder when
 * none is supplied. The preview runtime wires a drop-capable, ratio-adaptive
 * slot.
 *
 * Scoped under `.aic-risk`. Shared deps: ./theme.js, ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Risk Assessment',
  title: '风险研判',
  sub: '资本大年背后的下行因素',
  lead: '高估值、盈利验证、监管压力、大厂竞争和算力成本共同构成风险链条。',
  chainTitle: '风险传导链',
  closing: '下一阶段会淘汰只会讲故事的公司。',
  risks: [
    { node: '高估值', title: '估值泡沫', desc: '一级估值透支远期增长预期' },
    { node: '盈利验证', title: '盈利模式未验证', desc: '试点难以转化为稳定订阅收入' },
    { node: '监管压力', title: '监管成本上升', desc: '隐私、版权与合规推高交付成本' },
    { node: '大厂竞争', title: '开源与大厂挤压', desc: '开源逼近能力，大厂压缩独立空间' },
    { node: '算力成本', title: '算力供应链卡脖子', desc: '推理成本居高不下，吞噬毛利' },
  ],
};

const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

export const defaultProps = {
  ...COPY,
  cardCount: 5,            // risk cards shown (2–5)
  imageCount: 1,           // image slots (0–1)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  focusEnabled: true,
  focusIndex: 0,
  showSecondary: true,     // risk-transmission chain band
  showDecorations: true,
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Risk Assessment' },
  { key: 'title', label: '标题', type: 'text', default: '风险研判' },
  { key: 'sub', label: '次标题', type: 'text', default: '资本大年背后的下行因素' },
  { key: 'lead', label: '导言', type: 'text', default: '高估值、盈利验证、监管压力、大厂竞争和算力成本共同构成风险链条。' },
  { key: 'chainTitle', label: 'chainTitle', type: 'text', default: '风险传导链' },
  { key: 'closing', label: '结语', type: 'text', default: '下一阶段会淘汰只会讲故事的公司。' },
  { key: 'cardCount', label: '卡片数量', type: 'slider', default: 5, min: 2, max: 5, step: 1,
    description: '展示的风险卡数量（2–5）。' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 1, min: 0, max: 1, step: 1,
    description: '主视觉图片槽数量（0–1）；为 0 时风险卡占据整页宽度。图片以裁切填充侧栏，可双击重新取景。' },
  { key: 'showSecondary', label: '辅助信息', type: 'toggle', default: true,
    description: '顶部风险传导链的显隐。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一项风险作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [0, 1, 2, 3, 4].map((i) => ({ value: i, label: '第 ' + (i + 1) + ' 个' })),
    description: '选择被高亮的风险卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '警示标记、背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-risk { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-risk, .aic-risk * { box-sizing: border-box; }
.aic-risk .rs-glow { position: absolute; right: -4%; top: -8%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-neg) 14%, transparent), transparent 70%); }

.aic-risk .rs-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-risk .rs-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-risk .rs-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-risk .rs-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-risk .rs-lead { position: absolute; left: var(--pad); top: 286px; width: 1320px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.5; color: var(--aic-ink-dim); margin: 0; }

.aic-risk .rs-body { position: absolute; left: var(--pad); right: var(--pad); top: 392px; bottom: 130px;
  display: grid; gap: 48px; align-items: stretch; }
.aic-risk .rs-imgbox { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 24px;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); }
.aic-risk .rs-imgbox > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-risk .rs-ph { width: 100%; height: 100%; display: grid; place-items: center; }
.aic-risk .rs-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 18px; letter-spacing: .06em; color: var(--aic-ink-dim); }

.aic-risk .rs-right { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.aic-risk .rs-chain { flex: none; display: flex; align-items: stretch; gap: 0; margin-bottom: 22px; }
.aic-risk .rs-chain-node { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 7px;
  padding: 8px 6px; }
.aic-risk .rs-chain-node .dot { width: 14px; height: 14px; border-radius: 50%; background: var(--aic-neg); }
.aic-risk .rs-chain-node .lbl { font-family: var(--aic-font-text); font-weight: 700; font-size: 20px; color: var(--aic-ink); white-space: nowrap; }
.aic-risk .rs-chain-node + .rs-chain-node::before { content: '→'; position: absolute; left: -8px; top: 14px;
  font-size: 22px; color: var(--aic-faint); }

.aic-risk .rs-cards { flex: 1 1 0%; min-height: 0; display: grid; gap: 13px; grid-auto-rows: 1fr; align-content: stretch; }
.aic-risk .rs-card { position: relative; overflow: hidden; border-radius: 18px; padding: 14px 26px; min-height: 0;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair); display: flex; align-items: center; gap: 22px;
  transition: background .3s, border-color .3s, transform .3s; }
.aic-risk .rs-card[data-focus="1"] { background: var(--aic-ink); border-color: var(--aic-ink); transform: translateX(8px); }
.aic-risk .rs-warn { flex: none; width: 46px; height: 46px; display: grid; place-items: center; }
.aic-risk .rs-warn svg { width: 46px; height: 46px; }
.aic-risk .rs-card-body { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.aic-risk .rs-card-t { font-family: var(--aic-font-text); font-weight: 700; font-size: 26px; color: var(--aic-ink); margin: 0; }
.aic-risk .rs-card[data-focus="1"] .rs-card-t { color: #fff; }
.aic-risk .rs-card-d { font-family: var(--aic-font-text); font-weight: 500; font-size: 20px; color: var(--aic-muted); margin: 0; }
.aic-risk .rs-card[data-focus="1"] .rs-card-d { color: rgba(255,255,255,.7); }
.aic-risk .rs-card-no { flex: none; font-family: var(--aic-font-display); font-weight: 700; font-size: 24px;
  color: var(--aic-faint); transform: skewX(-9deg); font-variant-numeric: lining-nums; }
.aic-risk .rs-card[data-focus="1"] .rs-card-no { color: var(--aic-neg); }

.aic-risk .rs-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.aic-risk .rs-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-risk .rs-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-risk .rs-deco { width: 300px; height: 30px; }
`;

// red-leaning market heat strip (problem/risk texture)
const HEAT = ['neg','warn','neg','neg','warn','neg','warn','neg','neg','warn','neg','neg',
  'warn','neg','neg','warn','neg','neg','warn','neg','neg','warn','neg','warn','neg','neg',
  'warn','neg','neg','warn','neg','neg','warn','neg','neg','warn'].map((tone) => ({ tone }));

function WarnIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L22 20 H2 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <line x1="12" y1="9.5" x2="12" y2="14.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="17.4" r="1.25" fill={color} />
    </svg>
  );
}

function Placeholder() {
  return (
    <div className="rs-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="rsph" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rsph)" />
      </svg>
      <span className="rs-ph-cap">image_slot_1</span>
    </div>
  );
}

export default function RiskPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-risk', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(5, p.cardCount));
  const risks = copy.risks.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const hasImage = Math.max(0, Math.min(1, p.imageCount)) > 0;
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];

  return (
    <div className="aic-risk" style={vars}>
      {p.showDecorations && <div className="rs-glow" />}

      <div className="rs-head">
        <div>
          <p className="rs-eyebrow">{copy.eyebrow}</p>
          <h2 className="rs-title">{copy.title}</h2>
        </div>
        <div className="rs-sub">{copy.sub}</div>
      </div>

      <p className="rs-lead">{copy.lead}</p>

      <div className="rs-body" style={{ gridTemplateColumns: hasImage ? '640px 1fr' : '1fr' }}>
        {hasImage && (
          <div className="rs-imgbox">
            {p.renderSlot ? p.renderSlot(0, { ratio, ratioAR }) : <Placeholder />}
          </div>
        )}

        <div className="rs-right">
          {p.showSecondary && (
            <div className="rs-chain">
              {risks.map((r) => (
                <div className="rs-chain-node" key={r.node}>
                  <span className="dot" /><span className="lbl">{r.node}</span>
                </div>
              ))}
            </div>
          )}
          <div className="rs-cards" style={{ gridTemplateColumns: hasImage ? '1fr' : 'repeat(2, 1fr)' }}>
            {risks.map((r, i) => {
              const isF = p.focusEnabled && i === focus;
              return (
                <div className="rs-card" key={r.title} data-focus={isF ? '1' : '0'}>
                  <span className="rs-card-no">{String(i + 1).padStart(2, '0')}</span>
                  {p.showDecorations && <span className="rs-warn"><WarnIcon color={isF ? 'var(--aic-warn)' : 'var(--aic-neg)'} /></span>}
                  <div className="rs-card-body">
                    <p className="rs-card-t">{r.title}</p>
                    <p className="rs-card-d">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rs-foot">
        <div className="rs-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="rs-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
