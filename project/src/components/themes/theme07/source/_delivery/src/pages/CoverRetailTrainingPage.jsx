/**
 * CoverRetailTrainingPage — 封面 08 · 把握消费趋势 激活终端潜力（浅色 · 零售培训）
 *
 * Self-contained, prop-driven cover slide migrated from the static deck cover
 * "封面 08". Styling scoped under `.cvpack`, injected once.
 *
 * Shared deps: ../theme.js (injectScopedStyle).
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

const COPY = {
  markCn: '优享零售',
  markEn: 'YOUXIANG RETAIL',
  pageno: '04 / 04',
  eyebrow: '全国零售门店运营管理暨营销实战培训',
  titleL1: '把握消费趋势',
  titleL2pre: '激活',
  titleL2hl: '终端潜力',
  slogan: '用心服务客户，实干创造业绩',
  segments: [
    { label: '门店', value: 58.6, tone: 'lime' },
    { label: '线上', value: 26.6, tone: 'orange' },
    { label: '其他', value: 11.7, tone: 'red' },
  ],
  legend: [
    { label: '增长', tone: 'lime' },
    { label: '持平', tone: 'orange' },
    { label: '承压', tone: 'red' },
  ],
};

export const defaultProps = {
  ...COPY,
  showLensCrown: true,
  showTicker: true,
  accentColor: '#8FE327',
};

export const controls = [
  { key: 'markCn', label: '机构名', type: 'text', default: COPY.markCn },
  { key: 'markEn', label: '机构英文名', type: 'text', default: COPY.markEn },
  { key: 'pageno', label: '页码', type: 'text', default: COPY.pageno },
  { key: 'eyebrow', label: '眉标', type: 'text', default: COPY.eyebrow },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'titleL2pre', label: '标题行2前缀', type: 'text', default: COPY.titleL2pre },
  { key: 'titleL2hl', label: '标题行2高亮', type: 'text', default: COPY.titleL2hl },
  { key: 'slogan', label: '口号', type: 'text', default: COPY.slogan },
  { key: 'showLensCrown', label: '透镜冠饰', type: 'toggle', default: true,
    description: '顶部三枚透镜组成的冠饰装饰显隐。' },
  { key: 'showTicker', label: '渠道占比条', type: 'toggle', default: true,
    description: '底部渠道占比指标与条码条的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FE327',
    options: ['#8FE327', '#23C76A', '#2F7BFF', '#F5A623', '#0B0F08'],
    description: '品牌强调色（作用于透镜、高亮下划线与占比条）。' },
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
.cvpack .cascade{position:absolute;pointer-events:none;transform-style:preserve-3d}
.cvpack .lens{position:absolute;border-radius:50%;transform:rotateX(60deg) rotateZ(-34deg);background:radial-gradient(130% 120% at 32% 22%, rgba(255,255,255,.92), rgba(214,247,140,.6) 34%, rgba(143,227,39,.78) 66%, rgba(95,168,20,.85) 100%);box-shadow:inset 0 0 0 4px rgba(255,255,255,.45),inset 0 14px 40px rgba(255,255,255,.55),inset 0 -18px 38px rgba(70,130,15,.55),0 34px 60px rgba(80,150,20,.30)}
.cvpack .lens::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(60% 50% at 64% 70%, rgba(255,255,255,.7), transparent 60%);mix-blend-mode:screen}
.cvpack .pageno{font-family:var(--en);font-weight:600;font-size:16px;letter-spacing:.14em;color:var(--mut)}
.cvpack .hl{position:relative;display:inline-block}
.cvpack .hl::after{content:"";position:absolute;left:-2px;right:-2px;bottom:.12em;height:.20em;background:var(--lime);z-index:-1;border-radius:2px}
.cvpack .ticks{height:100%;width:100%}
.cvpack .ticks.lime{background:repeating-linear-gradient(90deg, var(--lime) 0 4px, transparent 4px 9px)}
.cvpack .ticks.orange{background:repeating-linear-gradient(90deg, var(--orange) 0 4px, transparent 4px 9px)}
.cvpack .ticks.red{background:repeating-linear-gradient(90deg, var(--red) 0 4px, transparent 4px 9px)}
.cvpack .labelrun{display:flex;align-items:center;gap:24px;font-family:var(--cn);font-weight:500;letter-spacing:.22em}
.cvpack .labelrun .dot{color:var(--lime-deep)}
`;

const TONE = { lime: 'var(--lime)', orange: 'var(--orange)', red: 'var(--red)' };

export default function CoverRetailTrainingPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack-cover-retailtraining', CSS);
  const vars = { '--lime': p.accentColor };
  const segs = Array.isArray(p.segments) ? p.segments : COPY.segments;
  const legend = Array.isArray(p.legend) ? p.legend : COPY.legend;

  return (
    <div className="cvpack" style={vars}>
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(56% 50% at 50% -8%, rgba(214,247,140,.42), transparent 56%),' +
        'radial-gradient(120% 70% at 50% 130%, var(--lime) 0%, rgba(182,242,74,.4) 18%, rgba(214,247,160,.16) 40%, rgba(250,250,247,0) 60%),' +
        'var(--paper)' }}></div>

      {p.showLensCrown && (
        <div className="cascade" style={{ left: '50%', top: '150px', transform: 'translateX(-50%)', perspective: '1300px', width: '540px', height: '280px' }}>
          <div className="lens" style={{ width: '200px', height: '200px', left: 0, top: '64px', opacity: .9 }}></div>
          <div className="lens" style={{ width: '200px', height: '200px', left: '170px', top: 0 }}></div>
          <div className="lens" style={{ width: '200px', height: '200px', left: '340px', top: '64px', opacity: .9 }}></div>
        </div>
      )}

      <header style={{ position: 'absolute', left: '90px', top: '82px', right: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="mark">
          <div className="glyph"></div>
          <div><div className="m-cn">{p.markCn}</div><div className="m-en">{p.markEn}</div></div>
        </div>
        <span className="pageno" style={{ paddingTop: '6px' }}>{p.pageno}</span>
      </header>

      <div style={{ position: 'absolute', left: '120px', right: '120px', top: '452px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: '32px' }}>{p.eyebrow}</div>
        <h1 style={{ fontFamily: 'var(--cn)', fontWeight: 900, fontSize: '118px', lineHeight: 1.0, letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{p.titleL1}</h1>
        <h1 style={{ fontFamily: 'var(--cn)', fontWeight: 900, fontSize: '118px', lineHeight: 1.0, letterSpacing: '.05em', whiteSpace: 'nowrap', marginTop: '6px' }}>{p.titleL2pre}<span className="hl">{p.titleL2hl}</span></h1>
        <p style={{ fontFamily: 'var(--cn)', fontWeight: 700, fontSize: '27px', color: 'var(--ink)', marginTop: '40px' }}>{p.slogan}</p>
      </div>

      {p.showTicker && (
        <div style={{ position: 'absolute', left: '90px', right: '90px', bottom: '104px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '54px' }}>
              {segs.map((s, i) => (
                <div style={{ textAlign: 'left' }} key={i}>
                  <div className="eyebrow" style={{ fontSize: '13px', letterSpacing: '.2em' }}>{s.label}</div>
                  <div className="num" style={{ fontSize: '34px', color: 'var(--ink)', lineHeight: 1, marginTop: '6px' }}>{s.value}<span style={{ fontSize: '20px' }}>%</span></div>
                </div>
              ))}
            </div>
            <div className="labelrun" style={{ fontSize: '18px', color: 'var(--mut)', letterSpacing: '.14em' }}>
              {legend.map((l, i) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }} key={i}>
                  <span style={{ width: '11px', height: '11px', background: TONE[l.tone] || 'var(--lime)', borderRadius: '2px' }}></span>{l.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', height: '46px', gap: '5px', borderRadius: '5px', overflow: 'hidden' }}>
            {segs.map((s, i) => (
              <div style={{ flex: s.value }} key={i}><div className={'ticks ' + (s.tone || 'lime')}></div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
