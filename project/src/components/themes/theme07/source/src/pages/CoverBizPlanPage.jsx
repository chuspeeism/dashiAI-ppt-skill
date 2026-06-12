/**
 * CoverBizPlanPage — 封面 11 · 精准布局 与时代红利同行（深色 · 商业计划书）
 *
 * Self-contained, prop-driven centered dark cover slide migrated from the
 * static deck cover "封面 11". Styling scoped under `.cvpack`, injected once.
 *
 * Shared deps: ../theme.js (injectScopedStyle).
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

const COPY = {
  markCn: '恒元资本',
  markEn: 'HENGYUAN CAPITAL',
  pageno: '03 / 04',
  pill: '面向机构投资人 · 专属方案',
  triple: ['新机遇', '新赛道', '新价值'],
  titleL1: '精准布局，',
  title2pre: '与',
  title2hl: '时代红利',
  title2post: '同行',
  footEn: 'XX Capital · Business Plan',
};

export const defaultProps = {
  ...COPY,
  showChartline: true,
  showFrame: true,
  accentColor: '#8FE327',
};

export const controls = [
  { key: 'markCn', label: '机构名', type: 'text', default: COPY.markCn },
  { key: 'markEn', label: '机构英文名', type: 'text', default: COPY.markEn },
  { key: 'pageno', label: '页码', type: 'text', default: COPY.pageno },
  { key: 'pill', label: '标签胶囊', type: 'text', default: COPY.pill },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'title2pre', label: '标题行2前缀', type: 'text', default: COPY.title2pre },
  { key: 'title2hl', label: '标题行2高亮', type: 'text', default: COPY.title2hl },
  { key: 'title2post', label: '标题行2后缀', type: 'text', default: COPY.title2post },
  { key: 'footEn', label: '底部英文', type: 'text', default: COPY.footEn },
  { key: 'showChartline', label: '走势曲线', type: 'toggle', default: true,
    description: '底部贯穿走势曲线装饰的显隐。' },
  { key: 'showFrame', label: '内描边框', type: 'toggle', default: true,
    description: '高级感内描边框的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FE327',
    options: ['#8FE327', '#23C76A', '#2F7BFF', '#F5A623', '#FFFFFF'],
    description: '品牌强调色（作用于分隔点、走势曲线与高亮词）。' },
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
.cvpack .pill.ghost-d{background:transparent;border:1.5px solid rgba(255,255,255,.22);color:rgba(255,255,255,.78)}
.cvpack .chartline{position:absolute;pointer-events:none}
.cvpack .chartline path{fill:none;stroke-linejoin:round;stroke-linecap:round}
.cvpack .pageno{font-family:var(--en);font-weight:600;font-size:16px;letter-spacing:.14em;color:var(--mut)}
.cvpack .hl{position:relative;display:inline-block}
.cvpack .hl::after{content:"";position:absolute;left:-2px;right:-2px;bottom:.12em;height:.20em;background:var(--lime);z-index:-1;border-radius:2px}
`;

export default function CoverBizPlanPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack-cover-bizplan', CSS);
  const vars = { '--lime': p.accentColor };
  const triple = Array.isArray(p.triple) ? p.triple : COPY.triple;

  return (
    <div className="cvpack" style={vars}>
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(58% 52% at 50% 46%, rgba(143,227,39,.16), transparent 64%),' +
        'radial-gradient(70% 60% at 90% 96%, rgba(143,227,39,.16), transparent 60%),' +
        'var(--ink)' }}></div>

      {p.showChartline && (
        <svg className="chartline" style={{ left: 0, bottom: 0, width: '1920px', height: '300px', opacity: .5 }} viewBox="0 0 1920 300" preserveAspectRatio="none">
          <path d="M0,210 L160,170 L320,200 L480,120 L640,160 L800,90 L960,140 L1120,70 L1280,120 L1440,50 L1600,100 L1760,40 L1920,90" stroke="var(--lime)" strokeWidth="3"></path>
        </svg>
      )}

      {p.showFrame && (
        <div style={{ position: 'absolute', inset: '44px', border: '1px solid rgba(255,255,255,.13)', borderRadius: '6px', pointerEvents: 'none' }}></div>
      )}

      <header style={{ position: 'absolute', left: '90px', top: '82px', right: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="mark on-dark">
          <div className="glyph"></div>
          <div><div className="m-cn">{p.markCn}</div><div className="m-en">{p.markEn}</div></div>
        </div>
        <span className="pageno" style={{ color: 'rgba(255,255,255,.45)', paddingTop: '6px' }}>{p.pageno}</span>
      </header>

      <div style={{ position: 'absolute', left: '120px', right: '120px', top: '120px', bottom: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span className="pill ghost-d" style={{ fontFamily: 'var(--cn)', fontWeight: 500, fontSize: '17px', marginBottom: '40px' }}>{p.pill}</span>
        <div style={{ fontFamily: 'var(--cn)', fontWeight: 700, fontSize: '46px', letterSpacing: '.04em', color: 'rgba(255,255,255,.92)', marginBottom: '46px' }}>
          {triple.map((w, i) => (
            <React.Fragment key={i}>
              {w}
              {i < triple.length - 1 && <span style={{ color: 'var(--lime)', margin: '0 .18em' }}>·</span>}
            </React.Fragment>
          ))}
        </div>
        <h1 style={{ fontFamily: 'var(--cn)', fontWeight: 900, fontSize: '124px', lineHeight: 1.02, letterSpacing: '.01em', color: '#fff' }}>
          {p.titleL1}<br />{p.title2pre}<span style={{ color: 'var(--lime)' }}>{p.title2hl}</span>{p.title2post}
        </h1>
        <p style={{ fontFamily: 'var(--en)', fontWeight: 600, fontSize: '21px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginTop: '46px' }}>{p.footEn}</p>
      </div>
    </div>
  );
}
