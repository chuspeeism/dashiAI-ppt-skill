// Page11Quadrant.jsx — "Quadrant Matrix" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-qd-`.
// A 2×2 opportunity matrix: two axes, four labelled quadrants each holding a
// short name and representative items. One quadrant can be focused (emphasized),
// axis labels and item chips toggle independently. No dependency on the Tweaks
// panel — the preview maps Tweak values onto props; the component is portable.
//
// Quadrant order is reading order in a 2-col grid:
//   0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page11Quadrant(props) {
  const p = { ...Page11Quadrant.defaults, ...props };
  const {
    backgroundTheme, focusEnabled, focusIndex, showItems, showAxisLabels, showDecor,
    eyebrow, headline, subheadline, summary, axisX, axisY, quadrants, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const fIdx = Math.min(focusIndex, quadrants.length - 1);

  return (
    <div className="acl-root acl-qd" style={{ background: bg }}>
      <style>{`
        .acl-qd{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-qd__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-qd__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-qd__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-qd__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-qd__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-qd__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-qd__body{ flex:1; margin-top:30px; display:grid;
          grid-template-columns:60px 1fr; grid-template-rows:1fr 52px; gap:14px; min-height:0; }
        .acl-qd__yaxis{ grid-column:1; grid-row:1; display:flex; align-items:center; justify-content:center; }
        .acl-qd__yaxis span{ writing-mode:vertical-rl; font-family:var(--acl-font-mono);
          font-weight:700; font-size:18px; letter-spacing:.14em; text-transform:uppercase; color:rgba(22,21,15,.6);
          display:flex; align-items:center; gap:14px; }
        .acl-qd__xaxis{ grid-column:2; grid-row:2; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.14em;
          text-transform:uppercase; color:rgba(22,21,15,.6); gap:14px; }
        .acl-qd__axend{ font-family:var(--acl-font-cn); font-weight:900; font-size:15px; opacity:.7; }
        .acl-qd__matrix{ grid-column:2; grid-row:1; position:relative; display:grid;
          grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:18px; }
        .acl-qd__cross{ position:absolute; inset:0; pointer-events:none; z-index:3; }
        .acl-qd__cross::before, .acl-qd__cross::after{ content:''; position:absolute; background:none; }
        .acl-qd__cross .vx{ position:absolute; left:50%; top:-4px; bottom:-4px; width:0;
          border-left:3px dashed rgba(22,21,15,.4); transform:translateX(-50%); }
        .acl-qd__cross .hz{ position:absolute; top:50%; left:-4px; right:-4px; height:0;
          border-top:3px dashed rgba(22,21,15,.4); transform:translateY(-50%); }
        .acl-qd__cell{ position:relative; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:5px 6px 0 rgba(22,21,15,.14); padding:30px 32px; display:flex; flex-direction:column;
          overflow:visible; border-top-width:9px; transition:transform .25s; }
        .acl-qd__cell .en{ font-family:var(--acl-font-mono); font-size:15px; font-weight:700; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-qd__cell .nm{ font-weight:900; font-size:46px; line-height:1.02; margin:6px 0 16px; }
        .acl-qd__chips{ display:flex; flex-wrap:wrap; gap:10px; margin-top:auto; }
        .acl-qd__chip{ font-family:var(--acl-font-mono); font-size:16px; font-weight:700; padding:6px 13px;
          border:2px solid var(--acl-ink); background:rgba(22,21,15,.05); white-space:nowrap; }
        .acl-qd__cell--focus{ background:var(--acl-ink); transform:scale(1.015); z-index:4;
          box-shadow:9px 11px 0 rgba(22,21,15,.28); }
        .acl-qd__cell--focus .nm{ color:var(--acl-paper); }
        .acl-qd__cell--focus .en{ color:rgba(255,255,255,.55); }
        .acl-qd__cell--focus .acl-qd__chip{ background:transparent; }
        .acl-qd__fx{ position:absolute; top:-14px; right:-10px; z-index:6; }
        .acl-qd__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-qd__cell{ animation:acl-qd-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s); }
        }
        @keyframes acl-qd-in{ from{ opacity:0; transform:scale(.9); } to{ opacity:1; } }
      `}</style>

      <div className="acl-qd__head">
        <div>
          <div className="acl-qd__eyebrow">{eyebrow}</div>
          <h1 className="acl-qd__h">{headline}</h1>
        </div>
        <div className="acl-qd__sub">{subheadline}</div>
        <div className="acl-qd__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-qd__body">
        {showAxisLabels && (
          <div className="acl-qd__yaxis">
            <span><span className="acl-qd__axend">高</span>{axisY}<span className="acl-qd__axend">低</span></span>
          </div>
        )}
        <div className="acl-qd__matrix">
          <div className="acl-qd__cross"><div className="vx" /><div className="hz" /></div>
          {quadrants.map((q, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-qd__cell' + (isF ? ' acl-qd__cell--focus' : '')}
                style={{ borderTopColor: q.accent, '--i': i }}>
                {isF && showDecor && <div className="acl-qd__fx"><Sticker label={q.badge || '重点象限'} color="var(--acl-yellow)" rotate={6} /></div>}
                <div className="en">{q.en}</div>
                <div className="nm" style={isF ? { color: q.accent } : null}>{q.name}</div>
                {showItems && (
                  <div className="acl-qd__chips">
                    {q.items.map((it, j) => (
                      <span key={j} className="acl-qd__chip"
                        style={{ borderColor: isF ? q.accent : 'var(--acl-ink)', color: isF ? 'var(--acl-paper)' : 'var(--acl-ink)' }}>{it}</span>
                    ))}
                  </div>
                )}
                {showDecor && isF && (
                  <Doodle kind="spark" size={30} rotate={10} fill={q.accent} stroke="var(--acl-paper)"
                    style={{ position: 'absolute', right: 18, bottom: 14 }} />
                )}
              </div>
            );
          })}
        </div>
        {showAxisLabels && (
          <div className="acl-qd__xaxis">
            <span className="acl-qd__axend">低</span>{axisX}<span className="acl-qd__axend">高 →</span>
          </div>
        )}
      </div>

      <div className="acl-qd__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page11Quadrant.defaults = {
  backgroundTheme: 'primary',
  focusEnabled: true,
  focusIndex: 1,
  showItems: true,
  showAxisLabels: true,
  showDecor: true,
  eyebrow: 'Heat vs. Monetization',
  headline: '资本热度 × 商业兑现',
  subheadline: '四象限机会判断',
  summary: '把资本热度与商业兑现交叉，可区分 <b>明星兑现、叙事泡沫、隐形价值与等待验证</b> 四类机会。',
  axisX: '商业兑现度',
  axisY: '资本热度',
  quadrants: [
    { en: 'Hype Bubble', name: '叙事泡沫', accent: 'var(--acl-red)', items: ['通用大模型', 'AGI 实验室'] },
    { en: 'Proven Stars', name: '明星兑现', accent: 'var(--acl-yellow)', badge: '看好象限', items: ['基础设施', '数据平台'] },
    { en: 'Wait & Verify', name: '等待验证', accent: 'var(--acl-blue)', items: ['长尾工具', 'AI 安全', '早期硬件'] },
    { en: 'Hidden Value', name: '隐形价值', accent: 'var(--acl-pink)', items: ['垂直应用', '企业搜索'] },
  ],
  closingLine: '资本正在从叙事驱动转向兑现驱动。',
};

Page11Quadrant.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个象限' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 3, step: 1,
    label: '重点对象', desc: '被突出的象限序号(0=左上 1=右上 2=左下 3=右下)' },
  { key: 'showItems', type: 'boolean', default: true,
    label: '代表项', desc: '象限内代表方向/公司标签的显示/隐藏' },
  { key: 'showAxisLabels', type: 'boolean', default: true,
    label: '坐标轴标签', desc: '两条坐标轴说明文字的显示/隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page11Quadrant.defaults;
export const controls = Page11Quadrant.controls;
