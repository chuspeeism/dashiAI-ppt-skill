/**
 * CoverSupplyChainPage — 封面 03 · 链通全国（高效履约）
 *
 * Self-contained, prop-driven cover slide (split layout) migrated from the
 * static deck cover "封面 03". Styling scoped under `.cvpack2`, injected once.
 *
 * Shared deps: ../theme.js (injectScopedStyle).
 * Optional host image: pass `renderSlot()=>ReactNode` to fill the right photo
 * area; defaults to the built-in striped placeholder so the page runs alone.
 */
import React from 'react';
import { injectScopedStyle } from '../theme.js';

const COPY = {
  phaseLeft: 'Supply Chain Strategy',
  phaseRight: '2026—2028',
  kicker: 'THREE-YEAR · STRATEGY',
  titleL1: '链通全国',
  titleL2: '高效履约',
  subPre: '集团供应链体系三年（',
  years: '2026-2028',
  subPost: '）发展战略',
  summary: '打通物流脉络，构筑产业护城河',
  logo: '集 团 供 应 链',
  photoLabel: '[ 物流网络 / 配送图景 ]',
  timeline: ['2026', '2027', '2028'],
};

export const defaultProps = {
  ...COPY,
  showTimeline: true,
  showLenses: true,
  accentColor: '#8FD400',
  renderSlot: null,
};

export const controls = [
  { key: 'phaseLeft', label: '左上标签', type: 'text', default: COPY.phaseLeft },
  { key: 'phaseRight', label: '右上标签', type: 'text', default: COPY.phaseRight },
  { key: 'kicker', label: '眉标', type: 'text', default: COPY.kicker },
  { key: 'titleL1', label: '标题行1', type: 'text', default: COPY.titleL1 },
  { key: 'titleL2', label: '标题行2', type: 'text', default: COPY.titleL2 },
  { key: 'summary', label: '底部结语', type: 'text', default: COPY.summary },
  { key: 'logo', label: '机构名', type: 'text', default: COPY.logo },
  { key: 'photoLabel', label: '图片占位文案', type: 'text', default: COPY.photoLabel },
  { key: 'showTimeline', label: '年份时间轴', type: 'toggle', default: true,
    description: '正文下方 2026—2028 三年时间轴的显隐。' },
  { key: 'showLenses', label: '透镜光斑', type: 'toggle', default: true,
    description: '右侧绿色面板上的透镜光斑装饰显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#8FD400',
    options: ['#8FD400', '#23C76A', '#2F7BFF', '#F2A93B', '#0D100A'],
    description: '品牌强调色（作用于结语短条与高亮）。' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,700;1,900&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
.cvpack2{position:absolute;inset:0;overflow:hidden}
.cvpack2{--lime-1:#C2EE3A;--lime-2:#8FD400;--lime-3:#5BB000;--lime-deep:#3C8A00;--paper:#F4F5F0;--paper-2:#ECEEE6;--ink:#0D100A;--ink-2:#5A5F52;--red:#E2362A;--amber:#F2A413;--grad-green:linear-gradient(135deg,#CDF24E 0%,#8FD400 46%,#54AA00 100%);--grad-green-soft:radial-gradient(120% 120% at 12% 88%, #B6E62E 0%, #8FD400 34%, #E9F2D6 78%, var(--paper) 100%);--type-hero:158px;--type-title:132px;--type-sub:40px;--type-kicker:25px;--type-small:23px;--type-bignum:300px;--font-cjk:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;--font-lat:"Archivo","Noto Sans SC",sans-serif;}
.cvpack2 *{box-sizing:border-box; margin:0; padding:0;}
.cvpack2 .slide{width:100%; height:100%; position:relative; overflow:hidden; background:var(--paper); color:var(--ink); font-family:var(--font-cjk); -webkit-font-smoothing:antialiased; pointer-events:auto;}
.cvpack2 .num{font-family:var(--font-lat); font-weight:800; display:inline-block; transform:skewX(-9deg); letter-spacing:-0.01em;}
.cvpack2 .lat{font-family:var(--font-lat);}
.cvpack2 .lens{position:absolute; border-radius:50%; background:radial-gradient(130% 130% at 30% 25%, rgba(255,255,255,.55) 0%, rgba(180,230,40,.18) 26%, rgba(120,200,0,.42) 60%, rgba(70,150,0,.55) 100%); box-shadow: inset 0 0 60px rgba(255,255,255,.35), inset 0 -18px 50px rgba(40,90,0,.35), 0 30px 70px rgba(60,120,0,.25); border:1px solid rgba(255,255,255,.35); mix-blend-mode:multiply;}
.cvpack2 .lens.flat{mix-blend-mode:normal;}
.cvpack2 .logo{display:flex; align-items:center; gap:13px; font-family:var(--font-lat); font-weight:700; font-size:23px; letter-spacing:.02em;}
.cvpack2 .logo .mk{width:34px; height:34px; border-radius:9px; background:var(--grad-green); position:relative;}
.cvpack2 .logo .mk::after{content:""; position:absolute; inset:8px 9px; border:3px solid var(--ink); border-radius:50%; border-right-color:transparent; transform:rotate(-30deg);}
.cvpack2 .kicker{font-family:var(--font-lat); font-weight:600; font-size:var(--type-kicker); letter-spacing:.42em; text-transform:uppercase;}
.cvpack2 .s3{display:flex;}
.cvpack2 .s3 .left{width:60%; padding:90px 90px 80px; display:flex; flex-direction:column;}
.cvpack2 .s3 .right{width:40%; position:relative; overflow:hidden; background:var(--grad-green); color:var(--ink);}
.cvpack2 .s3 .left .top{display:flex; align-items:center; gap:22px;}
.cvpack2 .s3 .left .top .span{flex:1; height:1.5px; background:rgba(13,16,10,.18);}
.cvpack2 .s3 .left .top .ph{font-family:var(--font-lat); font-size:var(--type-small); font-weight:600; letter-spacing:.2em; color:var(--ink-2); text-transform:uppercase;}
.cvpack2 .s3 .left .body{flex:1; display:flex; flex-direction:column; justify-content:center;}
.cvpack2 .s3 .kick{color:var(--ink-2); margin-bottom:28px;}
.cvpack2 .s3 h1{font-weight:900; font-size:138px; line-height:.98; letter-spacing:.01em;}
.cvpack2 .s3 h1 .l2{display:block;}
.cvpack2 .s3 .sub{font-size:36px; font-weight:500; margin-top:40px; max-width:760px; line-height:1.4;}
.cvpack2 .s3 .sub .num{font-weight:800;}
.cvpack2 .s3 .timeline{display:flex; align-items:center; gap:0; margin-top:64px;}
.cvpack2 .s3 .timeline .yr{font-family:var(--font-lat); font-weight:800; font-size:30px; transform:skewX(-9deg);}
.cvpack2 .s3 .timeline .seg{flex:1; height:2px; background:var(--ink); margin:0 18px; position:relative;}
.cvpack2 .s3 .timeline .seg::before,.cvpack2 .s3 .timeline .seg::after{content:""; position:absolute; width:11px; height:11px; border-radius:50%; background:var(--ink); top:-4.5px;}
.cvpack2 .s3 .timeline .seg::before{left:-5px;}
.cvpack2 .s3 .timeline .seg::after{right:-5px;}
.cvpack2 .s3 .foot{display:flex; align-items:center; gap:18px;}
.cvpack2 .s3 .foot .summary{font-size:27px; font-weight:700; letter-spacing:.04em;}
.cvpack2 .s3 .foot .bar{width:54px; height:7px; background:var(--lime-2);}
.cvpack2 .s3 .right .photo{position:absolute; inset:0; background:repeating-linear-gradient(45deg, rgba(13,16,10,.05) 0 2px, transparent 2px 16px);}
.cvpack2 .s3 .right .ph-label{position:absolute; left:46px; bottom:44px; z-index:4; font-family:var(--font-lat); font-weight:600; font-size:18px; letter-spacing:.16em; text-transform:uppercase; color:rgba(13,16,10,.5);}
.cvpack2 .s3 .right .lens{mix-blend-mode:normal;}
.cvpack2 .s3 .right .logo,.cvpack2 .s3 .right .ph-label,.cvpack2 .s3 .right .lens{pointer-events:none;}
.cvpack2 .s3 .r-a{width:330px; height:330px; right:-70px; top:120px;}
.cvpack2 .s3 .r-b{width:210px; height:210px; left:60px; top:380px;}
.cvpack2 .s3 .r-c{width:150px; height:150px; right:120px; top:470px;}
.cvpack2 .s3 .right .logo{position:absolute; top:60px; left:46px; z-index:4;}
.cvpack2 .s3 .right .hostslot{position:absolute; inset:0; z-index:2;}
`;

export default function CoverSupplyChainPage(props) {
  const p = { ...defaultProps, ...props };
  injectScopedStyle('cvpack2-cover-supplychain', CSS);
  const vars = { '--lime-2': p.accentColor };
  const years = Array.isArray(p.timeline) ? p.timeline : COPY.timeline;

  return (
    <div className="cvpack2" style={vars}>
      <div className="slide s3">
        <div className="left">
          <div className="top">
            <span className="ph">{p.phaseLeft}</span>
            <span className="span"></span>
            <span className="ph num">{p.phaseRight}</span>
          </div>
          <div className="body">
            <div className="kicker kick">{p.kicker}</div>
            <h1 className="cvanim"><span className="l1">{p.titleL1}</span><span className="l2">{p.titleL2}</span></h1>
            <div className="sub cvanim d1">{p.subPre}<span className="num">{p.years}</span>{p.subPost}</div>
            {p.showTimeline && (
              <div className="timeline cvanim d2">
                {years.map((y, i) => (
                  <React.Fragment key={i}>
                    <span className="yr">{y}</span>
                    {i < years.length - 1 && <span className="seg"></span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <div className="foot cvanim d3">
            <span className="bar"></span>
            <span className="summary">{p.summary}</span>
          </div>
        </div>
        <div className="right">
          {p.renderSlot
            ? <div className="hostslot">{p.renderSlot(0, { ratio: 'auto' })}</div>
            : <div className="photo"></div>}
          <div className="logo"><span className="mk"></span><span>{p.logo}</span></div>
          {p.showLenses && <div className="lens r-a"></div>}
          {p.showLenses && <div className="lens r-b"></div>}
          {p.showLenses && <div className="lens r-c"></div>}
          <div className="ph-label">{p.photoLabel}</div>
        </div>
      </div>
    </div>
  );
}
