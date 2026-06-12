// Page87Roadmap.jsx — "Vertical Zigzag Roadmap" template page (timeline-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-rm-`.
// A NEW timeline layout (distinct from the horizontal axes of P13 milestones,
// P20 pullback, P52 evolution, P79 repricing): a VERTICAL SPINE roadmap whose
// milestone cards ALTERNATE left / right of the centre line (zigzag), each
// pinned to a numbered node by a hand-drawn elbow arm. Count-driven (2–5),
// focusable node, phase pills + big values. Pure ESM — no Tweaks/preview
// dependency; CSS scoped + prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page87Roadmap(props) {
  const p = { ...Page87Roadmap.defaults, ...props };
  const {
    backgroundTheme, nodeCount, showConnector, showValueLabels, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, nodes, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)', 'var(--acl-pink)'];
  const data = nodes.slice(0, Math.max(2, nodeCount)).map((d, i) => ({ ...d, color: accents[i % accents.length] }));
  const n = data.length;
  const fIdx = Math.min(focusIndex, n - 1);
  const yPct = (i) => ((i + 0.5) / n) * 100;

  return (
    <div className="acl-root acl-rm" style={{ background: bg }}>
      <style>{`
        .acl-rm{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:66px 110px 52px; display:flex; flex-direction:column; }
        .acl-rm__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-rm__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:9px; }
        .acl-rm__h{ font-weight:900; font-size:74px; line-height:.95; margin:0; }
        .acl-rm__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-rm__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:22px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-rm__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-rm__stage{ flex:1; position:relative; margin-top:20px; min-height:0; }
        .acl-rm__spine{ position:absolute; left:50%; top:0; bottom:0; width:5px; transform:translateX(-50%);
          background:repeating-linear-gradient(var(--acl-ink) 0 16px, transparent 16px 28px); }
        .acl-rm__spinecap{ position:absolute; left:50%; transform:translate(-50%,-50%); width:22px; height:22px;
          border-radius:50%; background:var(--acl-ink); }

        .acl-rm__node{ position:absolute; left:50%; transform:translate(-50%,-50%); z-index:4;
          width:84px; height:84px; border-radius:50%; background:var(--acl-paper); border:5px solid var(--acl-ink);
          display:flex; align-items:center; justify-content:center; font-family:var(--acl-font-num);
          font-size:42px; box-shadow:4px 5px 0 rgba(22,21,15,.2); transition:transform .25s; }
        .acl-rm__node--focus{ background:var(--acl-pink); color:var(--acl-paper); transform:translate(-50%,-50%) scale(1.14); z-index:6; }

        .acl-rm__arm{ position:absolute; top:50%; height:4px; background:var(--acl-ink); z-index:2; }
        .acl-rm__card{ position:absolute; top:50%; transform:translateY(-50%); width:44%;
          background:var(--acl-paper); border:3px solid var(--acl-ink); box-shadow:6px 8px 0 rgba(22,21,15,.16);
          padding:20px 30px; z-index:3; transition:transform .25s, background .25s; }
        .acl-rm__card--l{ right:calc(50% + 86px); text-align:right; }
        .acl-rm__card--r{ left:calc(50% + 86px); }
        .acl-rm__ghost{ position:absolute; top:50%; transform:translateY(-50%); z-index:1; pointer-events:none;
          font-family:var(--acl-font-num); font-size:230px; line-height:.7; letter-spacing:-.03em;
          color:rgba(22,21,15,.07); }
        .acl-rm--ink .acl-rm__ghost{ color:rgba(251,250,244,.07); }
        .acl-rm__phase{ display:inline-block; font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.06em; text-transform:uppercase; padding:5px 11px; background:var(--acl-ink);
          color:var(--acl-yellow); margin-bottom:8px; }
        .acl-rm__row{ display:flex; align-items:baseline; gap:14px; }
        .acl-rm__title{ font-weight:900; font-size:31px; line-height:1.05; }
        .acl-rm__val{ font-family:var(--acl-font-num); font-size:42px; line-height:.8; margin-left:auto;
          color:var(--acl-pink); white-space:nowrap; }
        .acl-rm__val em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; color:rgba(22,21,15,.5); }
        .acl-rm__desc{ font-weight:600; font-size:18px; line-height:1.4; color:rgba(22,21,15,.7); margin-top:7px; }
        .acl-rm__card--l .acl-rm__phase, .acl-rm__card--l .acl-rm__row, .acl-rm__card--l .acl-rm__desc{ text-align:right; }
        .acl-rm__card--l .acl-rm__row{ flex-direction:row-reverse; }
        .acl-rm__card--l .acl-rm__val{ margin-left:0; margin-right:auto; }
        .acl-rm__card--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:translateY(-50%) scale(1.025); }
        .acl-rm__card--focus .acl-rm__phase{ background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-rm__card--focus .acl-rm__val{ color:var(--acl-yellow); }
        .acl-rm__card--focus .acl-rm__desc{ color:rgba(255,255,255,.78); }
        .acl-rm__cfx{ position:absolute; top:-22px; z-index:7; }
        .acl-rm__card--l .acl-rm__cfx{ left:-18px; }
        .acl-rm__card--r .acl-rm__cfx{ right:-18px; }

        .acl-rm__foot{ flex:0 0 auto; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-hand); font-size:27px; margin-top:12px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-rm__node{ animation:acl-rm-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .12s + .15s); }
          [data-deck-active] .acl-rm__card{ animation:acl-rm-in .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .12s + .25s); }
        }
        @keyframes acl-rm-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.4); } to{ opacity:1; } }
        @keyframes acl-rm-in{ from{ opacity:0; transform:translateY(-50%) translateX(var(--dx,0)); } to{ opacity:1; } }
      `}</style>

      <div className="acl-rm__head">
        <div>
          <div className="acl-rm__eyebrow">{eyebrow}</div>
          <h1 className="acl-rm__h">{headline}</h1>
        </div>
        <div className="acl-rm__sub">{subheadline}</div>
        <div className="acl-rm__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-rm__stage">
        {showConnector && <div className="acl-rm__spine" />}
        {showConnector && <div className="acl-rm__spinecap" style={{ top: 0 }} />}
        {showConnector && <div className="acl-rm__spinecap" style={{ bottom: 0, top: 'auto' }} />}

        {data.map((d, i) => {
          const left = i % 2 === 0;
          const isF = focusEnabled && i === fIdx;
          return (
            <React.Fragment key={i}>
              {showConnector && (
                <div className="acl-rm__arm"
                  style={{ top: yPct(i) + '%', width: 86, [left ? 'right' : 'left']: '50%', background: isF ? d.color : 'var(--acl-ink)' }} />
              )}
              <div className="acl-rm__ghost" aria-hidden="true"
                style={{ top: yPct(i) + '%', [left ? 'left' : 'right']: 'calc(50% + 130px)' }}>{String(i + 1).padStart(2, '0')}</div>
              <div className={'acl-rm__node' + (isF ? ' acl-rm__node--focus' : '')}
                style={{ top: yPct(i) + '%', '--i': i }}>{String(i + 1).padStart(2, '0')}</div>
              <div className={'acl-rm__card acl-rm__card--' + (left ? 'l' : 'r') + (isF ? ' acl-rm__card--focus' : '')}
                style={{ top: yPct(i) + '%', '--i': i, '--dx': left ? '20px' : '-20px' }}>
                {isF && showDecor && <div className="acl-rm__cfx"><Sticker label="关键节点" color="var(--acl-yellow)" rotate={left ? -8 : 8} /></div>}
                <span className="acl-rm__phase">{d.phase}</span>
                <div className="acl-rm__row">
                  <span className="acl-rm__title">{d.title}</span>
                  {showValueLabels && <span className="acl-rm__val">{d.value}<em>{d.unit}</em></span>}
                </div>
                <div className="acl-rm__desc">{d.desc}</div>
              </div>
            </React.Fragment>
          );
        })}

        {showDecor && (
          <Doodle kind="arrowS" size={70} rotate={92} color="var(--acl-ink)"
            style={{ left: 'calc(50% + 30px)', bottom: -6 }} />
        )}
      </div>

      <div className="acl-rm__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page87Roadmap.defaults = {
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  nodeCount: 4,                // 2–5 milestones (cards alternate left/right)
  showConnector: true,         // central spine + elbow arms
  showValueLabels: true,       // big value on each card
  focusEnabled: true,
  focusIndex: 1,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Roadmap · Next 18 Months',
  headline: '未来 18 个月路线图',
  subheadline: '资本节奏 4 个关键节点',
  summary: '从「拼算力」到「拼兑现」，每个节点都是一次<b>资金重新定价</b>的机会。',
  // milestones — phase + title + desc + value (text not parameterized)
  nodes: [
    { phase: 'Q1–Q2 2025', title: '收入验证窗口', desc: '头部公司披露首批可计费收入，叙事估值开始分层。', value: '40', unit: '% 兑现' },
    { phase: 'Q3 2025', title: '算力成本拐点', desc: '推理成本下行，毛利结构首次成为定价主线。', value: '−18', unit: 'pt 成本' },
    { phase: 'Q4 2025', title: '并购与整合', desc: '长尾项目被基础设施方与大厂吸收整合。', value: '2.3', unit: 'x 集中' },
    { phase: '2026E', title: '退出通道重开', desc: '少数已兑现公司率先打开 IPO 与二级流动性。', value: '6', unit: '家候选' },
    { phase: '2026H2', title: '新主题萌芽', desc: '具身与科学计算接棒成为下一轮叙事入口。', value: '+12', unit: '类' },
  ],
  closingLine: '路线图不是预测，而是提前站位的坐标。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page87Roadmap.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'nodeCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '节点数量', desc: '路线图里程碑数量(2–5)；卡片左右交替排布' },
  { key: 'showConnector', type: 'boolean', default: true,
    label: '连接轴线', desc: '中央时间轴脊线与连接臂 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '每张卡片的大号数值 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个节点' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 4, maxFrom: 'nodeCount', step: 1,
    label: '重点对象', desc: '被高亮的节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page87Roadmap.defaults;
export const controls = Page87Roadmap.controls;
