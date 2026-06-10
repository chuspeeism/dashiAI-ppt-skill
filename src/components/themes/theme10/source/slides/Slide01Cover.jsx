// Slide01Cover.jsx — deck cover.
// Standalone & migratable: depends only on React (imported). All variation is via
// props; text is authored in the markup. CSS is component-scoped under `.cv-`.
//
// ── Props (see Slide01Cover.META.controls for the canonical list) ──────────────
//   theme           'dusk'|'midnight'|'graphite'|'dawn'  background mood   ('dusk')
//   align           'left'|'center'                       text alignment    ('left')
//   showEyebrow     boolean   show the kicker label above the title         (true)
//   showFooterMeta  boolean   show the bottom meta row                      (true)

import React from 'react';

const CV_THEMES = {
  dusk:     { bg: 'linear-gradient(158deg,#0a0d11 0%,#152230 26%,#3c4a55 48%,#a98a72 66%,#5b4636 86%,#1c1813 100%)', fg: '#f4f4f2', sub: 'rgba(244,244,242,.78)', foot: 'rgba(255,255,255,.62)' },
  midnight: { bg: 'radial-gradient(120% 85% at 72% 8%,#1c2533 0%,#0d1016 52%,#07080b 100%)', fg: '#f2f3f6', sub: 'rgba(242,243,246,.62)', foot: 'rgba(242,243,246,.42)' },
  graphite: { bg: 'linear-gradient(165deg,#191b1f 0%,#3b3f45 48%,#9a9b9a 82%,#cdcecb 100%)', fg: '#f3f4f4', sub: 'rgba(243,244,244,.68)', foot: 'rgba(20,20,22,.52)' },
  dawn:     { bg: 'linear-gradient(160deg,#161320 0%,#473846 38%,#9c6f5e 72%,#dcb595 100%)', fg: '#f7f2ec', sub: 'rgba(247,242,236,.74)', foot: 'rgba(28,18,14,.58)' },
  paper:    { bg: '#f1f0ec', fg: '#15161a', sub: 'rgba(21,22,26,.62)', foot: 'rgba(21,22,26,.5)' },
};

function Slide01Cover({ theme = 'dusk', align = 'left', showEyebrow = true, showFooterMeta = true }) {
  React.useEffect(() => { cvInjectStyle(); }, []);
  const t = CV_THEMES[theme] || CV_THEMES.dusk;
  return (
    <div className="cv-root" style={{ background: t.bg, color: t.fg, ['--cv-foot']: t.foot, ['--cv-sub']: t.sub }}>
      <div className="cv-grain" />

      <div className="cv-top">
        <span className="cv-mark" />
        <span className="cv-word">AUTONOMOUS&nbsp;INDEX</span>
      </div>

      <div className="cv-body" style={{ alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align === 'center' ? 'center' : 'left', alignSelf: align === 'center' ? 'center' : 'stretch' }}>
        {showEyebrow && <div className="cv-eyebrow">自主指数 · 年度财富报告</div>}
        <h1 className="cv-title">财富，<br />自主增长</h1>
        <p className="cv-sub">一套为长期主义者设计的智能资产配置系统，<br />让每一笔结余都在为你工作。</p>
      </div>

      {showFooterMeta && (
        <div className="cv-foot">
          <span>2025 ANNUAL REVIEW</span>
          <span>CONFIDENTIAL · 01</span>
        </div>
      )}
    </div>
  );
}

function cvInjectStyle() {
  if (document.getElementById('cv-style')) return;
  const s = document.createElement('style');
  s.id = 'cv-style';
  s.textContent = `
  .cv-root{position:relative;width:100%;height:100%;overflow:hidden;
    padding:var(--pad-y,96px) var(--pad-x,120px);
    display:flex;flex-direction:column;font-family:var(--font-sans);}
  .cv-grain{position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .cv-top{position:relative;z-index:1;display:flex;align-items:center;gap:16px;}
  .cv-mark{width:18px;height:18px;border:1.5px solid currentColor;transform:rotate(45deg);opacity:.9;}
  .cv-word{font-family:var(--font-mono);font-size:24px;letter-spacing:.26em;opacity:.85;}
  .cv-body{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;
    max-width:1180px;padding-bottom:64px;}
  .cv-eyebrow{font-family:var(--font-mono);font-size:26px;letter-spacing:.18em;
    color:var(--cv-sub);margin-bottom:40px;white-space:nowrap;}
  .cv-title{font-size:148px;line-height:1.22;font-weight:300;letter-spacing:.01em;margin:0;}
  .cv-sub{font-size:36px;line-height:1.5;font-weight:300;color:var(--cv-sub);margin:48px 0 0;}
  .cv-foot{position:relative;z-index:1;display:flex;justify-content:space-between;
    font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;color:var(--cv-foot);white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

Slide01Cover.META = {
  id: 'cover',
  title: '封面',
  defaults: { theme: 'dusk', align: 'left', showEyebrow: true, showFooterMeta: true },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'dusk',
      options: [
        { value: 'dusk', label: '暮光' }, { value: 'midnight', label: '午夜' },
        { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨光' },
        { value: 'paper', label: '纸白' },
      ],
      description: '整页背景渐变与配色基调。' },
    { key: 'align', type: 'radio', label: '文本对齐', default: 'left',
      options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
      description: '标题区块的水平对齐方式。' },
    { key: 'showEyebrow', type: 'toggle', label: '装饰眉标', default: true,
      description: '标题上方的小型说明标签（装饰文案）。' },
    { key: 'showFooterMeta', type: 'toggle', label: '页脚信息', default: true,
      description: '底部左右两侧的辅助信息行。' },
  ],
};

export { Slide01Cover };
export const META = Slide01Cover.META;
export default Slide01Cover;
