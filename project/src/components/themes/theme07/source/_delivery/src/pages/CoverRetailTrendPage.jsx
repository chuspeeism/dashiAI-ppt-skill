/**
 * CoverRetailTrendPage — 封面 04 · 把握消费趋势（激活终端潜力）
 *
 * Self-contained, prop-driven centered cover slide migrated from the static
 * deck cover "封面 04". Styling scoped under `.cvpack2`, injected once.
 *
 * Shared deps: ../theme.js (injectScopedStyle).
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

const COPY = {
  logo: '零 售 运 营 学 院',
  phase: '实战培训 · TRAINING',
  crumbs: ['RETAIL', 'OPERATION', 'GROWTH'],
  titleL1: '把握消费趋势',
  titleL2: '激活终端潜力',
  sub: '全国零售门店运营管理暨营销实战培训',
  slogan: '用心服务客户，实干创造业绩',
};

export const defaultProps = {
  ...COPY,
  showCrumbs: true,
  showSlogan: true,
  showBase: true,
  accentColor: '#8FD400',
};

export const controls = [
  { key: 'logo', label: '机构名', type: 'text', default: COPY.logo },
  { key: 'phase', label: '右上标签', type: 'text', default: COPY.phase },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'titleL2', label: '标题行2', type: 'text', default: COPY.titleL2 },
  { key: 'sub', label: '副标题', type: 'text', default: COPY.sub },
  { key: 'slogan', label: '口号', type: 'text', default: COPY.slogan },
  { key: 'showCrumbs', label: '面包屑标签', type: 'toggle', default: true,
    description: '标题上方 RETAIL · OPERATION · GROWTH 面包屑显隐。' },
  { key: 'showSlogan', label: '口号胶囊', type: 'toggle', default: true,
    description: '深色口号胶囊条的显隐。' },
  { key: 'showBase', label: '底部弧形', type: 'toggle', default: true,
    description: '底部绿色弧形台座（含透镜与条码）的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FD400',
    options: ['#8FD400', '#23C76A', '#2F7BFF', '#F2A93B', '#0D100A'],
    description: '品牌强调色（作用于分隔点与底部台座）。' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,700;1,900&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
.cvpack2{position:absolute;inset:0;overflow:hidden}
.cvpack2{--lime-1:#C2EE3A;--lime-2:#8FD400;--lime-3:#5BB000;--lime-deep:#3C8A00;--paper:#F4F5F0;--paper-2:#ECEEE6;--ink:#0D100A;--ink-2:#5A5F52;--red:#E2362A;--amber:#F2A413;--grad-green:linear-gradient(135deg,#CDF24E 0%,#8FD400 46%,#54AA00 100%);--grad-green-soft:radial-gradient(120% 120% at 12% 88%, #B6E62E 0%, #8FD400 34%, #E9F2D6 78%, var(--paper) 100%);--type-hero:158px;--type-title:132px;--type-sub:40px;--type-kicker:25px;--type-small:23px;--type-bignum:300px;--font-cjk:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;--font-lat:"Archivo","Noto Sans SC",sans-serif;}
.cvpack2 *{box-sizing:border-box; margin:0; padding:0;}
.cvpack2 .slide{width:100%; height:100%; position:relative; overflow:hidden; background:var(--paper); color:var(--ink); font-family:var(--font-cjk); -webkit-font-smoothing:antialiased;}
.cvpack2 .num{font-family:var(--font-lat); font-weight:800; display:inline-block; transform:skewX(-9deg); letter-spacing:-0.01em;}
.cvpack2 .lat{font-family:var(--font-lat);}
.cvpack2 .lens{position:absolute; border-radius:50%; background:radial-gradient(130% 130% at 30% 25%, rgba(255,255,255,.55) 0%, rgba(180,230,40,.18) 26%, rgba(120,200,0,.42) 60%, rgba(70,150,0,.55) 100%); box-shadow: inset 0 0 60px rgba(255,255,255,.35), inset 0 -18px 50px rgba(40,90,0,.35), 0 30px 70px rgba(60,120,0,.25); border:1px solid rgba(255,255,255,.35); mix-blend-mode:multiply;}
.cvpack2 .lens.flat{mix-blend-mode:normal;}
.cvpack2 .bars{display:flex; align-items:flex-end; gap:0; height:160px;}
.cvpack2 .bars .band{flex:1;}
.cvpack2 .band.g{background:repeating-linear-gradient(90deg,var(--lime-2) 0 5px, transparent 5px 11px);}
.cvpack2 .band.a{background:repeating-linear-gradient(90deg,var(--amber) 0 5px, transparent 5px 11px);}
.cvpack2 .band.r{background:repeating-linear-gradient(90deg,var(--red) 0 5px, transparent 5px 11px);}
.cvpack2 .logo{display:flex; align-items:center; gap:13px; font-family:var(--font-lat); font-weight:700; font-size:23px; letter-spacing:.02em;}
.cvpack2 .logo .mk{width:34px; height:34px; border-radius:9px; background:var(--grad-green); position:relative;}
.cvpack2 .logo .mk::after{content:""; position:absolute; inset:8px 9px; border:3px solid var(--ink); border-radius:50%; border-right-color:transparent; transform:rotate(-30deg);}
.cvpack2 .s4{display:flex; flex-direction:column; align-items:center; text-align:center; padding:74px 110px 0;}
.cvpack2 .s4 .top{width:100%; display:flex; justify-content:space-between; align-items:center;}
.cvpack2 .s4 .top .ph{font-family:var(--font-lat); font-size:var(--type-small); font-weight:600; letter-spacing:.2em; color:var(--ink-2); text-transform:uppercase;}
.cvpack2 .s4 .body{flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; z-index:3;}
.cvpack2 .s4 .kick{color:var(--lime-3); margin-bottom:30px;}
.cvpack2 .s4 .crumb{display:inline-flex; align-items:center; gap:14px; margin-bottom:38px;}
.cvpack2 .s4 .crumb .c{font-family:var(--font-lat); font-weight:600; font-size:var(--type-small); letter-spacing:.18em; text-transform:uppercase; color:var(--ink-2);}
.cvpack2 .s4 .crumb .sep{width:5px; height:5px; border-radius:50%; background:var(--lime-2);}
.cvpack2 .s4 h1{font-weight:900; font-size:128px; line-height:1.0; letter-spacing:.02em;}
.cvpack2 .s4 h1 .l2{display:block;}
.cvpack2 .s4 .sub{font-size:var(--type-sub); font-weight:500; margin-top:40px;}
.cvpack2 .s4 .sub .num{font-weight:800;}
.cvpack2 .s4 .slogan{display:inline-flex; align-items:center; gap:16px; margin-top:54px; background:var(--ink); color:var(--paper); border-radius:100px; padding:20px 40px; font-size:30px; font-weight:700; letter-spacing:.05em;}
.cvpack2 .s4 .slogan .dotmk{width:11px; height:11px; border-radius:50%; background:var(--lime-1);}
.cvpack2 .s4 .base{width:100%; height:200px; flex:none; background:var(--grad-green); border-radius:340px 340px 0 0; position:relative; margin-top:30px;}
.cvpack2 .s4 .base .lens{mix-blend-mode:normal;}
.cvpack2 .s4 .b-a{width:150px; height:150px; left:13%; top:54px;}
.cvpack2 .s4 .b-b{width:104px; height:104px; right:17%; top:84px;}
.cvpack2 .s4 .base .barfield{position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:520px; height:78px; opacity:.85;}
.cvpack2 .s4 .base .barfield .band.g{background:repeating-linear-gradient(90deg,rgba(13,16,10,.55) 0 5px, transparent 5px 12px);}
.cvpack2 .s4 .base .barfield .band.a{background:repeating-linear-gradient(90deg,rgba(13,16,10,.4) 0 5px, transparent 5px 12px);}
.cvpack2 .s4 .base .barfield .band.r{background:repeating-linear-gradient(90deg,rgba(13,16,10,.28) 0 5px, transparent 5px 12px);}
`;

export default function CoverRetailTrendPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack2-cover-retailtrend', CSS);
  const vars = { '--lime-2': p.accentColor };
  const crumbs = Array.isArray(p.crumbs) ? p.crumbs : COPY.crumbs;

  return (
    <div className="cvpack2" style={vars}>
      <div className="slide s4">
        <div className="top">
          <div className="logo"><span className="mk"></span><span>{p.logo}</span></div>
          <div className="ph">{p.phase}</div>
        </div>
        <div className="body">
          {p.showCrumbs && (
            <div className="crumb cvanim">
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <span className="c">{c}</span>
                  {i < crumbs.length - 1 && <span className="sep"></span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 className="cvanim d1"><span className="l1">{p.titleL1}</span><span className="l2">{p.titleL2}</span></h1>
          <div className="sub cvanim d2">{p.sub}</div>
          {p.showSlogan && (
            <div className="slogan cvanim d3"><span className="dotmk"></span>{p.slogan}</div>
          )}
        </div>
        {p.showBase && (
          <div className="base">
            <div className="lens b-a"></div>
            <div className="lens b-b"></div>
            <div className="bars barfield">
              <div className="band g" style={{ height: '100%' }}></div>
              <div className="band a" style={{ height: '66%' }}></div>
              <div className="band r" style={{ height: '44%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
