/**
 * CoverSupplyStrategyPage — 封面 07 · 链通全国 高效履约（深色 · 供应链战略）
 *
 * Self-contained, prop-driven dark cover slide migrated from the static deck
 * cover "封面 07". Styling scoped under `.cvpack`, injected once — no global
 * leakage. This cover family uses its own lime/ink token set.
 *
 * Shared deps: ../theme.js (injectScopedStyle).
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

const COPY = {
  markCn: '链通集团',
  markEn: 'LIANTONG GROUP',
  pageno: '03 / 04',
  pill: '集团供应链体系 · 三年发展战略',
  eyebrow: '2026 – 2028 Supply Chain Strategy',
  titleL1: '链通全国',
  titleL2: '高效履约',
  summary: '打通物流脉络，构筑产业护城河',
  footEn: '3-Year Roadmap',
};

export const defaultProps = {
  ...COPY,
  showNetwork: true,
  showFrame: true,
  accentColor: '#8FE327',
};

export const controls = [
  { key: 'markCn', label: '机构名', type: 'text', default: COPY.markCn },
  { key: 'markEn', label: '机构英文名', type: 'text', default: COPY.markEn },
  { key: 'pageno', label: '页码', type: 'text', default: COPY.pageno },
  { key: 'pill', label: '标签胶囊', type: 'text', default: COPY.pill },
  { key: 'eyebrow', label: '眉标', type: 'text', default: COPY.eyebrow },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'titleL2', label: '标题行2', type: 'text', default: COPY.titleL2 },
  { key: 'summary', label: '底部结语', type: 'text', default: COPY.summary },
  { key: 'footEn', label: '底部英文', type: 'text', default: COPY.footEn },
  { key: 'showNetwork', label: '供应链网络图', type: 'toggle', default: true,
    description: '右侧供应链节点网络 SVG 装饰的显隐。' },
  { key: 'showFrame', label: '内描边框', type: 'toggle', default: true,
    description: '高级感内描边框的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FE327',
    options: ['#8FE327', '#23C76A', '#2F7BFF', '#F5A623', '#FFFFFF'],
    description: '品牌强调色（作用于网络节点、高亮词与短条）。' },
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
.cvpack .mark.on-dark .m-cn{color:#fff}
.cvpack .mark.on-dark .m-en{color:rgba(255,255,255,.6)}
.cvpack .pill{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-family:var(--en);font-weight:700;font-size:15px;letter-spacing:.01em}
.cvpack .pill.up{background:var(--lime);color:var(--ink)}
.cvpack .pill.down{background:var(--red);color:#fff}
.cvpack .pill.ghost{background:transparent;border:1.5px solid var(--line);color:var(--mut)}
.cvpack .pill.ghost-d{background:transparent;border:1.5px solid rgba(255,255,255,.22);color:rgba(255,255,255,.78)}
.cvpack .pill .tri{font-size:11px;line-height:1}
.cvpack .cascade{position:absolute;pointer-events:none;transform-style:preserve-3d}
.cvpack .lens{position:absolute;border-radius:50%;transform:rotateX(60deg) rotateZ(-34deg);background:radial-gradient(130% 120% at 32% 22%, rgba(255,255,255,.92), rgba(214,247,140,.6) 34%, rgba(143,227,39,.78) 66%, rgba(95,168,20,.85) 100%);box-shadow:inset 0 0 0 4px rgba(255,255,255,.45),inset 0 14px 40px rgba(255,255,255,.55),inset 0 -18px 38px rgba(70,130,15,.55),0 34px 60px rgba(80,150,20,.30)}
.cvpack .lens::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(60% 50% at 64% 70%, rgba(255,255,255,.7), transparent 60%);mix-blend-mode:screen}
.cvpack .chartline{position:absolute;pointer-events:none}
.cvpack .chartline path{fill:none;stroke-linejoin:round;stroke-linecap:round}
.cvpack .pageno{font-family:var(--en);font-weight:600;font-size:16px;letter-spacing:.14em;color:var(--mut)}
.cvpack .hl{position:relative;display:inline-block}
.cvpack .hl::after{content:"";position:absolute;left:-2px;right:-2px;bottom:.12em;height:.20em;background:var(--lime);z-index:-1;border-radius:2px}
`;

export default function CoverSupplyStrategyPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack-cover-supplystrategy', CSS);
  const vars = { '--lime': p.accentColor };

  return (
    <div className="cvpack" style={vars}>
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(64% 58% at 78% 30%, rgba(143,227,39,.20), transparent 62%),' +
        'radial-gradient(70% 60% at 8% 100%, rgba(143,227,39,.14), transparent 60%),' +
        'var(--ink)' }}></div>

      {p.showFrame && (
        <div style={{ position: 'absolute', inset: '44px', border: '1px solid rgba(255,255,255,.13)', borderRadius: '6px', pointerEvents: 'none' }}></div>
      )}

      {p.showNetwork && (
        <svg style={{ position: 'absolute', right: 0, top: 0, width: '900px', height: '1080px', opacity: .95 }} viewBox="0 0 900 1080" preserveAspectRatio="xMidYMid meet">
          <g stroke="rgba(143,227,39,.42)" strokeWidth="2" fill="none">
            <path d="M250,520 L470,250 M250,520 L520,470 M250,520 L430,720 M470,250 L700,330 M520,470 L760,560 M430,720 L660,820 M520,470 L470,250 M660,820 L760,560 M700,330 L760,560"></path>
          </g>
          <g stroke="rgba(143,227,39,.16)" strokeWidth="1.5" fill="none">
            <path d="M250,520 L150,300 M430,720 L300,920 M700,330 L820,180 M760,560 L860,640"></path>
          </g>
          <g fill="#0B0F08" stroke="var(--lime)">
            <circle cx="470" cy="250" r="9" strokeWidth="3"></circle>
            <circle cx="520" cy="470" r="13" strokeWidth="3.5"></circle>
            <circle cx="430" cy="720" r="9" strokeWidth="3"></circle>
            <circle cx="700" cy="330" r="8" strokeWidth="3"></circle>
            <circle cx="760" cy="560" r="10" strokeWidth="3"></circle>
            <circle cx="660" cy="820" r="8" strokeWidth="3"></circle>
          </g>
          <circle cx="250" cy="520" r="20" fill="var(--lime)"></circle>
          <circle cx="250" cy="520" r="34" fill="none" stroke="rgba(143,227,39,.4)" strokeWidth="2"></circle>
          <circle cx="250" cy="520" r="50" fill="none" stroke="rgba(143,227,39,.18)" strokeWidth="1.5"></circle>
        </svg>
      )}

      <header style={{ position: 'absolute', left: '90px', top: '82px', right: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="mark on-dark">
          <div className="glyph"></div>
          <div><div className="m-cn">{p.markCn}</div><div className="m-en">{p.markEn}</div></div>
        </div>
        <span className="pageno" style={{ color: 'rgba(255,255,255,.45)', paddingTop: '6px' }}>{p.pageno}</span>
      </header>

      <div style={{ position: 'absolute', left: '90px', top: '382px', maxWidth: '1040px' }}>
        <span className="pill ghost-d" style={{ fontFamily: 'var(--cn)', fontWeight: 500, fontSize: '17px', marginBottom: '38px' }}>{p.pill}</span>
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,.55)', marginBottom: '30px' }}>{p.eyebrow}</div>
        <h1 style={{ fontFamily: 'var(--cn)', fontWeight: 900, fontSize: '150px', lineHeight: .96, letterSpacing: '.02em', color: '#fff' }}>
          {p.titleL1}<br /><span style={{ color: 'var(--lime)' }}>{p.titleL2}</span>
        </h1>
      </div>

      <footer style={{ position: 'absolute', left: '90px', right: '90px', bottom: '84px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span style={{ width: '4px', height: '46px', background: 'var(--lime)', borderRadius: '2px', flex: 'none' }}></span>
          <p style={{ fontFamily: 'var(--cn)', fontWeight: 700, fontSize: '28px', color: '#fff', lineHeight: 1.35 }}>{p.summary}</p>
        </div>
        <p style={{ fontFamily: 'var(--en)', fontWeight: 600, fontSize: '19px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>{p.footEn}</p>
      </footer>
    </div>
  );
}
