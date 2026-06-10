// Page13Strategy.jsx — "Compare + Timeline" template page (timeline-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-tl-`.
// Two stance columns (favoured vs cautious) over a horizontal phase timeline.
// Count-driven items per column + count-driven milestones with a focusable node.
// No dependency on the Tweaks panel — the preview maps Tweak values onto props;
// the component is fully portable (standard ESM, no window globals).
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page13Strategy(props) {
  const p = { ...Page13Strategy.defaults, ...props };
  const {
    backgroundTheme, showCompare, groupItemCount, milestoneCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary,
    positive, negative, milestones, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const pos = positive.items.slice(0, Math.max(1, groupItemCount));
  const neg = negative.items.slice(0, Math.max(1, groupItemCount));
  const nodes = milestones.slice(0, Math.max(2, milestoneCount));
  const fIdx = Math.min(focusIndex, nodes.length - 1);

  const Column = ({ data, items, tone }) => (
    <div className={'acl-tl__col acl-tl__col--' + tone}>
      <div className="acl-tl__colhead">
        <span className="acl-tl__mark">{tone === 'up' ? '↑' : '↓'}</span>
        <div>
          <div className="acl-tl__coltitle">{data.title}</div>
          <div className="acl-tl__colen">{data.en}</div>
        </div>
      </div>
      <div className="acl-tl__items">
        {items.map((it, i) => (
          <div key={i} className="acl-tl__item">
            <span className="acl-tl__inum">{String(i + 1).padStart(2, '0')}</span>
            <div className="acl-tl__itxt">
              <b>{it.name}</b>
              <span>{it.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="acl-root acl-tl" style={{ background: bg }}>
      <style>{`
        .acl-tl{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:76px 100px 64px; display:flex; flex-direction:column; }
        .acl-tl__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-tl__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-tl__h{ font-weight:900; font-size:76px; line-height:.95; margin:0; }
        .acl-tl__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-tl__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-tl__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        /* ── compare columns ─────────────────────── */
        .acl-tl__compare{ display:flex; gap:26px; align-items:stretch; margin-top:30px; position:relative; }
        .acl-tl__col{ flex:1 1 0; min-width:0; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.16); padding:22px 26px 20px; display:flex; flex-direction:column; gap:14px; }
        .acl-tl__col--up{ transform:rotate(-.6deg); }
        .acl-tl__col--down{ transform:rotate(.6deg); }
        .acl-tl__colhead{ display:flex; align-items:center; gap:14px; padding-bottom:13px;
          border-bottom:3px solid var(--acl-ink); }
        .acl-tl__mark{ width:50px; height:50px; flex:0 0 auto; display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:34px; line-height:1; color:var(--acl-ink); }
        .acl-tl__col--up .acl-tl__mark{ background:var(--acl-yellow); }
        .acl-tl__col--down .acl-tl__mark{ background:var(--acl-red); color:var(--acl-paper); }
        .acl-tl__coltitle{ font-weight:900; font-size:32px; line-height:1; }
        .acl-tl__colen{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:4px; }
        .acl-tl__items{ display:flex; flex-direction:column; gap:11px; }
        .acl-tl__item{ display:flex; align-items:baseline; gap:14px; }
        .acl-tl__inum{ font-family:var(--acl-font-num); font-size:24px; line-height:1; flex:0 0 auto;
          color:rgba(22,21,15,.4); width:34px; }
        .acl-tl__col--up .acl-tl__inum{ color:var(--acl-ink); }
        .acl-tl__col--down .acl-tl__inum{ color:var(--acl-red); }
        .acl-tl__itxt{ display:flex; flex-direction:column; gap:1px; }
        .acl-tl__itxt b{ font-weight:900; font-size:25px; line-height:1.12; }
        .acl-tl__itxt span{ font-size:17px; line-height:1.25; color:rgba(22,21,15,.6); }
        .acl-tl__vs{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(-7deg);
          z-index:4; width:74px; height:74px; border-radius:50%; background:var(--acl-ink);
          color:var(--acl-yellow); display:grid; place-items:center; font-family:var(--acl-font-num);
          font-size:30px; box-shadow:3px 4px 0 rgba(22,21,15,.25); }

        /* ── phase timeline ──────────────────────── */
        .acl-tl__time{ flex:1; margin-top:30px; position:relative; display:flex; align-items:stretch; padding-top:30px; }
        .acl-tl__axis{ position:absolute; left:0; right:46px; top:48px; height:0;
          border-top:4px dashed var(--acl-ink); }
        .acl-tl__arrow{ position:absolute; right:-2px; top:48px; transform:translateY(-50%); }
        .acl-tl__node{ flex:1 1 0; min-width:0; display:flex; flex-direction:column; align-items:center;
          text-align:center; position:relative; padding:0 12px; }
        .acl-tl__dot{ width:30px; height:30px; border-radius:50%; background:var(--acl-paper);
          border:4px solid var(--acl-ink); margin-top:4px; position:relative; z-index:2; transition:.25s; }
        .acl-tl__year{ font-family:var(--acl-font-num); font-size:64px; line-height:.9; margin-top:18px; }
        .acl-tl__ntitle{ font-weight:900; font-size:26px; line-height:1.1; margin-top:8px; }
        .acl-tl__nnote{ font-size:18px; line-height:1.3; color:rgba(22,21,15,.62); margin-top:6px; max-width:280px; }
        .acl-tl__node--focus .acl-tl__dot{ width:38px; height:38px; background:var(--acl-pink); }
        .acl-tl__node--focus .acl-tl__year{ color:var(--acl-pink); }
        .acl-tl__nfx{ position:absolute; top:-30px; z-index:5; }
        .acl-tl__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:8px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-tl__node{ animation:acl-tl-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .1s); }
          [data-deck-active] .acl-tl__col{ animation:acl-tl-rise .5s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-tl-in{ from{ opacity:0; transform:translateY(20px); } to{ opacity:1; transform:none; } }
        @keyframes acl-tl-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-tl__head">
        <div>
          <div className="acl-tl__eyebrow">{eyebrow}</div>
          <h1 className="acl-tl__h">{headline}</h1>
        </div>
        <div className="acl-tl__sub">{subheadline}</div>
        <div className="acl-tl__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      {showCompare && (
        <div className="acl-tl__compare">
          <Column data={positive} items={pos} tone="up" />
          {showDecor && <div className="acl-tl__vs">VS</div>}
          <Column data={negative} items={neg} tone="down" />
        </div>
      )}

      <div className="acl-tl__time">
        <div className="acl-tl__axis" />
        {showDecor && <div className="acl-tl__arrow"><Doodle kind="arrow" size={56} style={{ position: 'static' }} /></div>}
        {nodes.map((m, i) => {
          const isF = focusEnabled && i === fIdx;
          return (
            <div key={i} className={'acl-tl__node' + (isF ? ' acl-tl__node--focus' : '')} style={{ '--i': i }}>
              {isF && showDecor && <div className="acl-tl__nfx"><Sticker label="观察重点" color="var(--acl-yellow)" rotate={-5} /></div>}
              <div className="acl-tl__dot" />
              <div className="acl-tl__year">{m.year}</div>
              <div className="acl-tl__ntitle">{m.title}</div>
              <div className="acl-tl__nnote">{m.note}</div>
            </div>
          );
        })}
      </div>

      <div className="acl-tl__foot">
        {showDecor && <Doodle kind="loop" size={54} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page13Strategy.defaults = {
  backgroundTheme: 'primary',
  showCompare: true,
  groupItemCount: 3,       // 1–3 items per stance column
  milestoneCount: 3,       // 2–4 timeline nodes
  focusEnabled: true,
  focusIndex: 1,
  showDecor: true,
  eyebrow: 'Investment Outlook',
  headline: '投资建议与阶段性策略',
  subheadline: '看好方向与谨慎方向',
  summary: '观察应围绕 <b>收入兑现</b>、基础设施确定性与垂直应用 PMF 展开。',
  positive: {
    title: '看好方向', en: 'Conviction',
    items: [
      { name: '垂直应用', note: '嵌入刚性流程、可量化 ROI' },
      { name: '基础设施', note: '算力、数据平台、推理优化' },
      { name: '具身智能', note: '长周期硬科技、量产兑现' },
    ],
  },
  negative: {
    title: '谨慎方向', en: 'Caution',
    items: [
      { name: '高估值纯模型', note: '叙事强、兑现弱、估值承压' },
      { name: 'AI 包装项目', note: '缺壁垒、易被大厂挤压' },
      { name: '低壁垒消费应用', note: '留存差、同质化竞争' },
    ],
  },
  milestones: [
    { year: '2025', title: 'IPO 窗口开启', note: '头部公司启动上市，估值锚开始重定价' },
    { year: '2026', title: '收入曲线验证', note: '试点转付费率成为分水岭' },
    { year: '2027', title: '兑现分化定型', note: '能形成商业闭环者跑出' },
    { year: '持续', title: '资源绑定深化', note: '云资源与算力锁定成融资能力' },
  ],
  closingLine: '看融资只是起点，看兑现才是判断。',
};

Page13Strategy.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'showCompare', type: 'boolean', default: true,
    label: '对比双栏', desc: '顶部"看好 / 谨慎"对比栏的显示/隐藏' },
  { key: 'groupItemCount', type: 'number', default: 3, min: 1, max: 3, step: 1,
    label: '每栏条目数', desc: '每个对比栏展示的方向条目数(1–3)' },
  { key: 'milestoneCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '时间轴节点数', desc: '底部阶段时间轴的节点数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个时间轴节点' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 3, step: 1, maxFrom: 'milestoneCount',
    label: '重点对象', desc: '被高亮的时间轴节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰、VS 徽标与标签的显示/隐藏' },
];

export const defaults = Page13Strategy.defaults;
export const controls = Page13Strategy.controls;
