// Page50EarlyStage.jsx — "Round Structure Table" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-es-`.
// A fresh table variant distinct from the other table pages: each row is a stage
// with an event-count DOT ARRAY (count-encoded pips), an amount data-bar, theme
// tags, and a 3-step signal-strength rating. Count-driven rows, focusable row,
// and an optional bottom stat strip. Fully portable — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page50EarlyStage(props) {
  const p = { ...Page50EarlyStage.defaults, ...props };
  const {
    backgroundTheme, rowCount, showCountDots, showBars, showRating, focusEnabled, focusIndex,
    showStat, showDecor,
    eyebrow, headline, subheadline, summary, columnLabels, rows, amountUnit, stat, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const maxAmt = Math.max(...shown.map((r) => r.amount));

  return (
    <div className="acl-root acl-es" style={{ background: bg }}>
      <style>{`
        .acl-es{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 70px; display:flex; flex-direction:column; }
        .acl-es__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-es__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:26px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:12px; }
        .acl-es__h{ font-weight:900; font-size:92px; line-height:.95; margin:0; }
        .acl-es__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:25px;
          padding:10px 17px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-es__summary{ margin-left:auto; max-width:560px; font-weight:700; font-size:27px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-es__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-es__panel{ position:relative; flex:1; margin-top:30px; background:var(--acl-paper);
          border:4px solid var(--acl-ink); box-shadow:10px 12px 0 rgba(22,21,15,.16);
          padding:16px 48px 22px; display:flex; flex-direction:column; }
        .acl-es__colhead{ display:grid; grid-template-columns:340px 340px 380px 1fr 250px; align-items:center;
          gap:30px; padding:16px 6px 14px; border-bottom:4px solid var(--acl-ink);
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.07em; text-transform:uppercase;
          color:rgba(22,21,15,.55); }
        .acl-es__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-es__row{ flex:1; display:grid; grid-template-columns:340px 340px 380px 1fr 250px; align-items:center;
          gap:30px; padding:0 6px; border-bottom:2px dashed rgba(22,21,15,.2); position:relative;
          transition:background .25s, color .25s; }
        .acl-es__row:last-child{ border-bottom:none; }

        .acl-es__stage{ display:flex; flex-direction:column; gap:6px; }
        .acl-es__stage b{ font-weight:900; font-size:44px; line-height:1; }
        .acl-es__stage span{ font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em;
          color:rgba(22,21,15,.5); }

        /* count dot array */
        .acl-es__count{ display:flex; align-items:center; gap:18px; }
        .acl-es__dots{ display:grid; grid-template-columns:repeat(6, 22px); gap:9px; }
        .acl-es__dots i{ width:22px; height:22px; border-radius:50%; background:var(--acl-pink);
          border:2.5px solid var(--acl-ink); }
        .acl-es__cval{ font-family:var(--acl-font-num); font-size:50px; line-height:.9; }
        .acl-es__cval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:4px; opacity:.6; }

        /* amount bar */
        .acl-es__amt{ display:flex; align-items:center; gap:18px; }
        .acl-es__track{ flex:1; height:32px; background:rgba(22,21,15,.08); border:2.5px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-es__fill{ position:absolute; left:0; top:0; bottom:0; background:var(--acl-ink);
          transition:width .5s cubic-bezier(.2,.8,.2,1); }
        .acl-es__aval{ font-family:var(--acl-font-num); font-size:46px; line-height:.9; min-width:150px;
          text-align:right; white-space:nowrap; }
        .acl-es__aval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:4px; opacity:.6; }

        /* theme tags */
        .acl-es__tags{ display:flex; flex-wrap:wrap; gap:10px; }
        .acl-es__tag{ font-family:var(--acl-font-mono); font-size:19px; font-weight:700; letter-spacing:.02em;
          padding:8px 16px; border:2.5px solid var(--acl-ink); background:var(--acl-yellow); white-space:nowrap; }

        /* signal rating */
        .acl-es__sig{ display:flex; flex-direction:column; gap:10px; }
        .acl-es__pips{ display:flex; gap:10px; }
        .acl-es__pips i{ width:26px; height:26px; border:3px solid var(--acl-ink); transform:rotate(45deg); }
        .acl-es__pips i.on{ background:var(--acl-pink); }
        .acl-es__sig span{ font-weight:700; font-size:22px; }

        .acl-es__row--focus{ background:var(--acl-ink); color:var(--acl-paper);
          box-shadow:8px 0 0 var(--acl-ink), -8px 0 0 var(--acl-ink); border-bottom-color:transparent; z-index:2; }
        .acl-es__row--focus .acl-es__stage span{ color:rgba(251,250,244,.6); }
        .acl-es__row--focus .acl-es__dots i{ border-color:var(--acl-paper); }
        .acl-es__row--focus .acl-es__track{ background:rgba(255,255,255,.16); border-color:var(--acl-paper); }
        .acl-es__row--focus .acl-es__fill{ background:var(--acl-yellow); }
        .acl-es__row--focus .acl-es__tag{ border-color:var(--acl-paper); background:transparent; color:var(--acl-paper); }
        .acl-es__row--focus .acl-es__pips i{ border-color:var(--acl-paper); }
        .acl-es__fx{ position:absolute; top:-16px; left:140px; z-index:5; }

        .acl-es__foot{ display:flex; align-items:center; gap:22px; margin-top:20px; }
        .acl-es__note{ display:flex; align-items:center; gap:16px; font-family:var(--acl-font-hand);
          font-size:32px; }
        .acl-es__stat{ margin-left:auto; display:flex; align-items:center; gap:18px;
          background:var(--acl-ink); color:var(--acl-paper); padding:14px 28px; transform:rotate(-1deg);
          box-shadow:5px 6px 0 rgba(22,21,15,.2); }
        .acl-es__stat b{ font-family:var(--acl-font-num); font-size:60px; line-height:.8; color:var(--acl-yellow); }
        .acl-es__stat span{ font-weight:700; font-size:22px; line-height:1.2; max-width:230px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-es__row{ animation:acl-es-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .06s); }
        }
        @keyframes acl-es-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-es__head">
        <div>
          <div className="acl-es__eyebrow">{eyebrow}</div>
          <h1 className="acl-es__h">{headline}</h1>
        </div>
        <div className="acl-es__sub">{subheadline}</div>
        <div className="acl-es__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-es__panel">
        <div className="acl-es__colhead">
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]}</span>
          <span>{columnLabels[2]} · {amountUnit}</span>
          <span>{columnLabels[3]}</span>
          <span>{columnLabels[4]}</span>
        </div>
        <div className="acl-es__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            const dots = Math.min(r.count, 12);
            return (
              <div key={i} className={'acl-es__row' + (isF ? ' acl-es__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-es__fx"><Sticker label="新主题" color="var(--acl-yellow)" rotate={6} /></div>}
                <div className="acl-es__stage"><b>{r.round}</b><span>{r.tag}</span></div>

                <div className="acl-es__count">
                  {showCountDots && (
                    <div className="acl-es__dots">
                      {Array.from({ length: dots }).map((_, k) => <i key={k} />)}
                    </div>
                  )}
                  <div className="acl-es__cval">{r.count}<em>笔</em></div>
                </div>

                <div className="acl-es__amt">
                  {showBars && (
                    <div className="acl-es__track">
                      <div className="acl-es__fill" style={{ width: `${(r.amount / maxAmt) * 100}%` }} />
                    </div>
                  )}
                  <div className="acl-es__aval">{r.amount}<em>{amountUnit}</em></div>
                </div>

                <div className="acl-es__tags">
                  {r.themes.map((t, k) => <span key={k} className="acl-es__tag">{t}</span>)}
                </div>

                <div className="acl-es__sig">
                  {showRating && (
                    <div className="acl-es__pips">
                      {[0, 1, 2].map((k) => <i key={k} className={k < r.signal ? 'on' : ''} />)}
                    </div>
                  )}
                  <span>{r.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-es__foot">
        <div className="acl-es__note">
          {showDecor && <Doodle kind="loop" size={54} style={{ position: 'static' }} />}
          <span>{closingLine}</span>
        </div>
        {showStat && (
          <div className="acl-es__stat">
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page50EarlyStage.defaults = {
  // adjustable params
  backgroundTheme: 'muted',   // 'primary' | 'muted'
  rowCount: 3,                // 2–4 stage rows
  showCountDots: true,        // event-count dot array
  showBars: true,             // amount data-bar
  showRating: true,           // signal-strength pips
  focusEnabled: true,
  focusIndex: 1,              // spotlight A 轮 by default
  showStat: true,             // bottom stat strip
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Early Stage Signal',
  headline: '新主题萌芽',
  subheadline: '早期轮信号',
  summary: 'Seed 与 A 轮金额虽小，却<b>藏着下一轮主题</b>的方向。',
  columnLabels: ['轮次', '事件数', '平均金额', '代表主题', '信号强度'],
  amountUnit: '亿美元',
  rows: [
    { round: '种子轮 Seed', tag: 'Seed', count: 8, amount: 1.2, themes: ['Agent', '安全'], signal: 1, note: '主题萌芽' },
    { round: 'A 轮', tag: 'Series A', count: 12, amount: 1.8, themes: ['具身智能', '行业模型'], signal: 2, note: '快速形成' },
    { round: 'A+ / 扩展', tag: 'Series A+', count: 6, amount: 1.4, themes: ['企业搜索'], signal: 2, note: '初步验证' },
    { round: '天使 / Pre-Seed', tag: 'Pre-Seed', count: 5, amount: 0.6, themes: ['工具链'], signal: 1, note: '极早期' },
  ],
  stat: { value: '20.6%', label: '早期轮占全年事件数' },
  closingLine: '小金额交易往往藏着下一轮主题。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page50EarlyStage.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'rowCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '行数', desc: '展示的轮次行数(2–4)' },
  { key: 'showCountDots', type: 'boolean', default: true,
    label: '数量点阵', desc: '事件数的气泡点阵显示/隐藏' },
  { key: 'showBars', type: 'boolean', default: true,
    label: '数据条', desc: '金额列的横向比例条显示/隐藏' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '信号评级', desc: '信号强度的菱形评级显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, maxFrom: 'rowCount', step: 1,
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showStat', type: 'boolean', default: true,
    label: '底部统计', desc: '右下角统计徽标的显示/隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page50EarlyStage.defaults;
export const controls = Page50EarlyStage.controls;
