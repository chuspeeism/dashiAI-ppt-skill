/**
 * CoverTechLaunchPage — 封面 09 · 智联万物 重构体验（科技发布会）
 *
 * Self-contained, prop-driven cover slide migrated from the static deck cover
 * "封面 09". Styling scoped under `.cvpack`, injected once.
 *
 * Shared deps: ../theme.js (injectScopedStyle).
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

const COPY = {
  markCn: '智联',
  markEn: 'INTELLI-NEXUS',
  tagTop: 'Product Launch · 2026',
  eyebrow: '2026 全新产品体系发布暨技术路演',
  titleL1: '智联万物',
  titleL2: '重构体验',
  tagline: 'Intelligence × Everything — Reinvent the Experience.',
  summary: '以技术突破，定义下一代数字生活。',
  pill: 'Keynote 2026',
};

export const defaultProps = {
  ...COPY,
  showChartline: true,
  showLenses: true,
  accentColor: '#8FE327',
};

export const controls = [
  { key: 'markCn', label: '机构名', type: 'text', default: COPY.markCn },
  { key: 'markEn', label: '机构英文名', type: 'text', default: COPY.markEn },
  { key: 'tagTop', label: '右上标签', type: 'text', default: COPY.tagTop },
  { key: 'eyebrow', label: '眉标', type: 'text', default: COPY.eyebrow },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'titleL2', label: '标题行2', type: 'text', default: COPY.titleL2 },
  { key: 'tagline', label: '英文标语', type: 'text', default: COPY.tagline },
  { key: 'summary', label: '底部结语', type: 'text', default: COPY.summary },
  { key: 'pill', label: '右下徽标', type: 'text', default: COPY.pill },
  { key: 'showChartline', label: '走势曲线', type: 'toggle', default: true,
    description: '底部白色走势曲线装饰的显隐。' },
  { key: 'showLenses', label: '透镜瀑布', type: 'toggle', default: true,
    description: '右上角三枚透镜瀑布装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FE327',
    options: ['#8FE327', '#23C76A', '#2F7BFF', '#F5A623', '#0B0F08'],
    description: '品牌强调色（作用于背景光晕、透镜与徽标）。' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,700;1,900&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
.cvpack{
  --lime:#8FE327;--lime-bright:#B6F24A;--lime-deep:#5FA814;--ink:#0B0F08;--ink-2:#11150D;
  --paper:#FAFAF7;--paper-2:#F1F2EC;--red:#E5484D;--orange:#F5A623;--mut:#6E746A;--line:#E3E4DD;
  --en:'Archivo',sans-serif;--cn:'Noto Sans SC','Archivo',sans-serif;
  position:absolute;inset:0;overflow:hidden;background:var(--paper);color:var(--ink);
  font-family:var(--cn);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
}
.cvpack *{box-sizing:border-box;margin:0;padding:0}
.cvpack .num{font-family:var(--en);font-style:italic;font-weight:800;letter-spacing:-.02em;font-feature-settings:"tnum" 1}
.cvpack .en{font-family:var(--en)}
.cvpack .eyebrow{font-family:var(--en);font-weight:600;font-size:17px;letter-spacing:.32em;text-transform:uppercase;color:var(--mut);white-space:nowrap}
.cvpack .glyph{width:42px;height:42px;border-radius:11px;background:var(--lime);position:relative;flex:none;box-shadow:0 2px 10px rgba(95,168,20,.35)}
.cvpack .glyph::before{content:"";position:absolute;inset:9px;border-radius:50%;border:3.5px solid var(--ink);box-sizing:border-box}
.cvpack .glyph::after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;border-radius:50%;background:var(--ink);transform:translate(-50%,-50%)}
.cvpack .mark{display:flex;align-items:center;gap:14px}
.cvpack .mark .m-cn{font-family:var(--cn);font-weight:900;font-size:23px;letter-spacing:.04em;line-height:1}
.cvpack .mark .m-en{font-family:var(--en);font-weight:700;font-size:12px;letter-spacing:.22em;color:var(--mut);margin-top:5px;text-transform:uppercase}
.cvpack .pill{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-family:var(--en);font-weight:700;font-size:15px;letter-spacing:.01em}
.cvpack .pill.up{background:var(--lime);color:var(--ink)}
.cvpack .pill.down{background:var(--red);color:#fff}
.cvpack .pill .tri{font-size:11px;line-height:1}
.cvpack .cascade{position:absolute;pointer-events:none;transform-style:preserve-3d}
.cvpack .lens{position:absolute;border-radius:50%;transform:rotateX(60deg) rotateZ(-34deg);background:radial-gradient(130% 120% at 32% 22%, rgba(255,255,255,.92), rgba(214,247,140,.6) 34%, rgba(143,227,39,.78) 66%, rgba(95,168,20,.85) 100%);box-shadow:inset 0 0 0 4px rgba(255,255,255,.45),inset 0 14px 40px rgba(255,255,255,.55),inset 0 -18px 38px rgba(70,130,15,.55),0 34px 60px rgba(80,150,20,.30)}
.cvpack .lens::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(60% 50% at 64% 70%, rgba(255,255,255,.7), transparent 60%);mix-blend-mode:screen}
.cvpack .chartline{position:absolute;pointer-events:none}
.cvpack .chartline path{fill:none;stroke-linejoin:round;stroke-linecap:round}
.cvpack .pageno{font-family:var(--en);font-weight:600;font-size:16px;letter-spacing:.14em;color:var(--mut)}
`;

export default function CoverTechLaunchPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack-cover-techlaunch', CSS);
  const vars = { '--lime': p.accentColor };

  return (
    <div className="cvpack" style={vars}>
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(115% 92% at 6% 110%, var(--lime) 0%, var(--lime-bright) 16%, rgba(182,242,74,.55) 34%, rgba(214,247,160,.24) 52%, rgba(250,250,247,0) 70%),' +
        'radial-gradient(60% 55% at 82% 4%, rgba(214,247,140,.32), transparent 60%),' +
        'var(--paper)' }}></div>

      {p.showChartline && (
        <svg className="chartline" style={{ left: '-40px', bottom: 0, width: '1150px', height: '600px', opacity: .55 }} viewBox="0 0 1150 600" preserveAspectRatio="none">
          <path d="M0,320 L80,270 L160,350 L240,210 L320,280 L400,170 L480,300 L560,250 L640,400 L720,330 L800,470 L880,410 L960,520 L1040,470 L1150,560" stroke="rgba(255,255,255,.85)" strokeWidth="3"></path>
        </svg>
      )}

      {p.showLenses && (
        <div className="cascade" style={{ right: '150px', top: '140px', perspective: '1300px' }}>
          <div className="lens" style={{ width: '300px', height: '300px', right: 0, top: 0 }}></div>
          <div className="lens" style={{ width: '300px', height: '300px', right: '120px', top: '150px', opacity: .96 }}></div>
          <div className="lens" style={{ width: '300px', height: '300px', right: '240px', top: '300px', opacity: .9 }}></div>
        </div>
      )}

      <header style={{ position: 'absolute', left: '90px', top: '80px', right: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="mark">
          <div className="glyph"></div>
          <div><div className="m-cn">{p.markCn}</div><div className="m-en">{p.markEn}</div></div>
        </div>
        <div className="eyebrow" style={{ paddingTop: '10px' }}>{p.tagTop}</div>
      </header>

      <div style={{ position: 'absolute', left: '90px', bottom: '248px' }}>
        <div className="eyebrow" style={{ marginBottom: '30px' }}>{p.eyebrow}</div>
        <h1 style={{ fontFamily: 'var(--cn)', fontWeight: 900, fontSize: '138px', lineHeight: 1.0, letterSpacing: '.01em' }}>{p.titleL1}<br />{p.titleL2}</h1>
        <p style={{ fontFamily: 'var(--en)', fontWeight: 500, fontSize: '25px', color: 'var(--ink)', marginTop: '30px', opacity: .8, letterSpacing: '.02em' }}>{p.tagline}</p>
      </div>

      <footer style={{ position: 'absolute', left: '90px', right: '90px', bottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span style={{ width: '4px', height: '46px', background: 'var(--ink)', borderRadius: '2px', flex: 'none' }}></span>
          <p style={{ fontFamily: 'var(--cn)', fontWeight: 700, fontSize: '26px', color: 'var(--ink)', lineHeight: 1.35 }}>{p.summary}</p>
        </div>
        <div className="pill up" style={{ fontSize: '18px', padding: '9px 18px' }}><span className="tri">▲</span> {p.pill}</div>
      </footer>
    </div>
  );
}
