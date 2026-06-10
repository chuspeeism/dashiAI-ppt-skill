// SlideMegaFigure.jsx — 巨幅数字 / one number, near-bleed.
// A single hero figure scaled until it nearly bleeds off the frame, with a
// hanging prefix/suffix, a vertical accent rule, a kicker + descriptor, and an
// optional row of supporting figures along the foot. Themed: paints its own
// background from DECK_THEMES (so it sits in the THEMED set — no light/dark tone
// control). Standalone & migratable: depends on React + DECK_THEMES (global,
// with a hard-coded fallback). CSS scoped under `.mf-`.
//
// ── Props (canonical list in SlideMegaFigure.META.controls) ──────────────────
//   theme        select   background mood (DECK_THEMES key)              ('dusk')
//   align        radio    'left' | 'center'                              ('left')
//   showRule     boolean  the vertical accent rule beside the figure     (true)
//   showStats    boolean  the supporting figure row along the foot       (true)
//   statCount    number 0..3   how many supporting figures               (3)
//
// Content props (authored at call-site):
//   overline, prefix, figure, suffix, descriptor, stats:[{value,label}]

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

function SlideMegaFigure({
  overline = '十年实证 · SINCE 2015',
  prefix = '+', figure = '218', suffix = '%',
  descriptor = '自主指数组合自成立以来的累计净回报，跨越两轮完整市场周期、零人工择时干预。',
  stats = [
    { value: '12.4%', label: '年化复合回报' },
    { value: '0.71', label: '夏普比率' },
    { value: '−14%', label: '最大回撤' },
  ],
  theme = 'dusk', align = 'left', showRule = true, showStats = true, statCount = 3,
}) {
  React.useEffect(() => { mfInjectStyle(); }, []);
  const THEMES = DECK_THEMES || {
    dusk: { bg: 'linear-gradient(158deg,#0a0d11 0%,#141f2a 26%,#33434e 52%,#857f76 78%,#cdb6a0 100%)', fg: '#f4f4f2', sub: 'rgba(244,244,242,.72)', foot: 'rgba(22,18,14,.6)' },
  };
  const th = THEMES[theme] || THEMES.dusk;
  const sc = Math.max(0, Math.min(stats.length, statCount));
  const st = stats.slice(0, sc);

  return (
    <div className={`mf-root mf-${align}`} style={{ background: th.bg, color: th.fg }}>
      <div className="mf-overline" style={{ color: th.sub }}>{overline}</div>

      <div className="mf-figwrap">
        {showRule && <span className="mf-rule" />}
        <div className="mf-fig">
          <span className="mf-prefix">{prefix}</span>
          <span className="mf-num">{figure}</span>
          <span className="mf-suffix">{suffix}</span>
        </div>
      </div>

      <p className="mf-desc" style={{ color: th.sub }}>{descriptor}</p>

      {showStats && sc > 0 && (
        <div className="mf-stats">
          {st.map((s, i) => (
            <div key={i} className="mf-stat">
              <span className="mf-sv">{s.value}</span>
              <span className="mf-sl" style={{ color: th.sub }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function mfInjectStyle() {
  if (document.getElementById('mf-style')) return;
  const s = document.createElement('style'); s.id = 'mf-style';
  s.textContent = `
  .mf-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;}
  .mf-center{align-items:center;text-align:center;}
  .mf-overline{font-family:var(--font-mono);font-size:28px;letter-spacing:.18em;}
  .mf-figwrap{flex:1;display:flex;align-items:center;gap:48px;min-height:0;}
  .mf-center .mf-figwrap{justify-content:center;}
  .mf-rule{width:6px;align-self:stretch;margin:6% 0;border-radius:3px;
    background:linear-gradient(180deg,var(--ds-accent,#5479e8),transparent);flex:0 0 auto;}
  .mf-fig{display:flex;align-items:baseline;line-height:.82;letter-spacing:-.02em;}
  .mf-num{font-size:clamp(280px,38vh,440px);font-weight:300;font-variant-numeric:tabular-nums;}
  .mf-prefix{font-size:clamp(120px,18vh,200px);font-weight:300;color:var(--ds-accent,#5479e8);margin-right:6px;}
  .mf-suffix{font-size:clamp(120px,18vh,200px);font-weight:300;color:var(--ds-accent,#5479e8);margin-left:4px;}
  .mf-desc{max-width:1000px;font-size:34px;font-weight:300;line-height:1.5;margin:8px 0 0;text-wrap:pretty;}
  .mf-center .mf-desc{margin-left:auto;margin-right:auto;}
  .mf-stats{display:flex;gap:80px;margin-top:54px;}
  .mf-center .mf-stats{justify-content:center;}
  .mf-stat{display:flex;flex-direction:column;gap:10px;}
  .mf-sv{font-family:var(--font-mono);font-size:54px;font-weight:300;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
  .mf-sl{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;}
  `;
  document.head.appendChild(s);
}

SlideMegaFigure.META = {
  id: 'megafigure', title: '巨幅数字',
  defaults: { theme: 'dusk', align: 'left', showRule: true, showStats: true, statCount: 3 },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'dusk',
      options: [
        { value: 'dusk', label: '暮蓝' }, { value: 'midnight', label: '午夜' },
        { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨曦' },
        { value: 'vapor', label: '雾岚' }, { value: 'paper', label: '纸白' },
      ], description: '整页背景渐变情绪（来自 DECK_THEMES）。' },
    { key: 'align', type: 'radio', label: '对齐', default: 'left',
      options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
      description: '整体内容的水平对齐。' },
    { key: 'showRule', type: 'toggle', label: '竖向标尺', default: true,
      description: '巨幅数字旁的竖向强调标尺。' },
    { key: 'showStats', type: 'toggle', label: '支撑数据', default: true,
      description: '底部一排支撑性指标。' },
    { key: 'statCount', type: 'slider', label: '支撑数据数量', default: 3, min: 0, max: 3, step: 1,
      description: '底部支撑指标的数量（需开启「支撑数据」）。' },
  ],
};

export { SlideMegaFigure };
export const META = SlideMegaFigure.META;
export default SlideMegaFigure;
