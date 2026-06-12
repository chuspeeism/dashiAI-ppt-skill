/**
 * CoverLeanPage — 封面 01 · 精益智造（提质增效）
 *
 * Self-contained, prop-driven cover slide migrated from the static deck cover
 * "封面 01". Renders at the deck design size (fills its parent). All styling is
 * scoped under `.cvpack2` and injected once — no `:root` / global leakage.
 *
 * Shared deps: ../theme.js (injectScopedStyle only — this cover family uses its
 * own lime/ink token set, not the AI-Capital aic-* tokens).
 * No Tweaks / preview-runtime dependency — authored text lives in COPY and is
 * also exposed (with structure/style) through `defaultProps` / `controls`.
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

// ── authored editorial content (also surfaced as editable props) ──
const COPY = {
  logo: '智 造 集 团',
  phase: '实施方案 · IMPLEMENTATION',
  kicker: 'SMART · MANUFACTURING',
  titleL1: '精益智造',
  titleL2: '提质增效',
  year: '2026',
  sub: '生产基地智能化改造实施方案',
  tags: ['降本', '提效', '革新', '突围'],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  showSweep: true,
  showBars: true,
  showTags: true,
  accentColor: '#8FD400',
};

export const controls = [
  { key: 'logo', label: '机构名', type: 'text', default: COPY.logo },
  { key: 'phase', label: '右上标签', type: 'text', default: COPY.phase },
  { key: 'kicker', label: '眉标', type: 'text', default: COPY.kicker },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'titleL2', label: '标题行2', type: 'text', default: COPY.titleL2 },
  { key: 'year', label: '年份', type: 'text', default: COPY.year },
  { key: 'sub', label: '副标题', type: 'text', default: COPY.sub },
  { key: 'showSweep', label: '光晕扫光', type: 'toggle', default: true,
    description: '右上角放射光晕与透镜光斑装饰的显隐。' },
  { key: 'showTags', label: '关键词标签', type: 'toggle', default: true,
    description: '底部关键词标签行（降本 / 提效 …）的显隐。' },
  { key: 'showBars', label: '条码图形', type: 'toggle', default: true,
    description: '底部绿 / 琥珀 / 红条码图形的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FD400',
    options: ['#8FD400', '#23C76A', '#2F7BFF', '#F2A93B', '#0D100A'],
    description: '品牌强调色（作用于 Logo、条码与高亮）。' },
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
.cvpack2 .kicker{font-family:var(--font-lat); font-weight:600; font-size:var(--type-kicker); letter-spacing:.42em; text-transform:uppercase;}
.cvpack2 .tag{font-size:var(--type-small); font-weight:500; letter-spacing:.14em;}
.cvpack2 .logo{display:flex; align-items:center; gap:13px; font-family:var(--font-lat); font-weight:700; font-size:23px; letter-spacing:.02em;}
.cvpack2 .logo .mk{width:34px; height:34px; border-radius:9px; background:var(--grad-green); position:relative;}
.cvpack2 .logo .mk::after{content:""; position:absolute; inset:8px 9px; border:3px solid var(--ink); border-radius:50%; border-right-color:transparent; transform:rotate(-30deg);}
.cvpack2 .s1{padding:88px 110px; display:flex; flex-direction:column;}
.cvpack2 .s1 .top{display:flex; justify-content:space-between; align-items:center;}
.cvpack2 .s1 .top .ph{font-family:var(--font-lat); font-size:var(--type-small); font-weight:600; letter-spacing:.2em; color:var(--ink-2); text-transform:uppercase;}
.cvpack2 .s1 .sweep{position:absolute; right:-220px; top:-360px; width:1040px; height:1040px; background:radial-gradient(circle at 50% 50%, #8FD400 0%, rgba(143,212,0,.78) 34%, rgba(170,222,60,.22) 58%, rgba(143,212,0,0) 72%); opacity:.95;}
.cvpack2 .s1 .sweep-lens{right:150px; top:118px; width:248px; height:248px; mix-blend-mode:normal;}
.cvpack2 .s1 .body{flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:2;}
.cvpack2 .s1 .kick{color:var(--ink-2); margin-bottom:30px;}
.cvpack2 .s1 h1{font-weight:900; font-size:var(--type-hero); line-height:.96; letter-spacing:.01em;}
.cvpack2 .s1 h1 .l2{display:block;}
.cvpack2 .s1 .rule{width:96px; height:7px; background:var(--ink); margin:48px 0 34px;}
.cvpack2 .s1 .sub{font-size:var(--type-sub); font-weight:500; color:var(--ink); letter-spacing:.02em;}
.cvpack2 .s1 .sub .num{font-weight:800;}
.cvpack2 .s1 .foot{display:flex; justify-content:space-between; align-items:flex-end;}
.cvpack2 .s1 .foot .tags{display:flex; gap:0;}
.cvpack2 .s1 .foot .tags .tag{padding:0 28px; border-left:1.5px solid rgba(13,16,10,.22);}
.cvpack2 .s1 .foot .tags .tag:first-child{padding-left:0; border-left:none;}
.cvpack2 .s1 .barfield{width:340px; height:96px;}
`;

export default function CoverLeanPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack2-cover-lean', CSS);
  const vars = { '--lime-2': p.accentColor };
  const tags = Array.isArray(p.tags) ? p.tags : COPY.tags;

  return (
    <div className="cvpack2" style={vars}>
      <div className="slide s1">
        {p.showSweep && <div className="sweep"></div>}
        {p.showSweep && <div className="lens sweep-lens"></div>}
        <div className="top">
          <div className="logo"><span className="mk"></span><span>{p.logo}</span></div>
          <div className="ph">{p.phase}</div>
        </div>
        <div className="body">
          <div className="kicker kick cvanim">{p.kicker}</div>
          <h1 className="cvanim d1"><span className="l1">{p.titleL1}</span><span className="l2">{p.titleL2}</span></h1>
          <div className="rule cvanim d2"></div>
          <div className="sub cvanim d2"><span className="num">{p.year}</span> {p.sub}</div>
        </div>
        <div className="foot">
          {p.showTags ? (
            <div className="tags cvanim d3">
              {tags.map((t, i) => <span className="tag" key={i}>{t}</span>)}
            </div>
          ) : <span></span>}
          {p.showBars && (
            <div className="bars barfield cvanim d3">
              <div className="band g" style={{ height: '100%' }}></div>
              <div className="band a" style={{ height: '62%' }}></div>
              <div className="band r" style={{ height: '38%' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
