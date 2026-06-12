// Page06Cross.jsx — "Cross-Section" template page (chart-led: share + rounds)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cs-`.
// Left: a share chart (donut OR horizontal bars) with a focus segment.
// Right: an optional secondary panel (round/stage structure).
// No dependency on the Tweaks panel — preview maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const SEG_COLORS = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)', 'var(--acl-red)', 'rgba(22,21,15,.32)'];

export default function Page06Cross(props) {
  const p = { ...Page06Cross.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, focusEnabled, focusIndex, showRounds, showDecor,
    eyebrow, headline, subheadline, summary, segments, shareTitle, rounds, roundsTitle, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = segments.slice(0, segmentCount);
  const total = segs.reduce((s, d) => s + d.pct, 0);
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const focus = segs[fIdx] || segs[0];

  // conic-gradient stops for the donut
  let acc = 0;
  const stops = segs.map((d, i) => {
    const start = (acc / total) * 100; acc += d.pct;
    return `${SEG_COLORS[i % SEG_COLORS.length]} ${start}% ${(acc / total) * 100}%`;
  }).join(',');

  return (
    <div className="acl-root acl-cs" style={{ background: bg }}>
      <style>{`
        .acl-cs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-cs__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-cs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-cs__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-cs__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-cs__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-cs__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-cs__body{ flex:1; display:flex; gap:46px; margin-top:34px; align-items:stretch; }
        .acl-cs__panel{ background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:8px 10px 0 rgba(22,21,15,.16); padding:30px 36px; display:flex; flex-direction:column;
          position:relative; }
        .acl-cs__panel.left{ flex:0 0 ${showRounds ? 720 : 1280}px; }
        .acl-cs__panel.right{ flex:1; }
        .acl-cs__ptitle{ font-weight:900; font-size:28px; margin:0 0 6px; display:flex;
          align-items:center; gap:12px; }
        .acl-cs__ptag{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:18px; }
        /* donut */
        .acl-cs__donutwrap{ flex:1; display:flex; align-items:center; gap:38px; }
        .acl-cs__donut{ position:relative; width:300px; height:300px; border-radius:50%; flex:0 0 auto;
          box-shadow:5px 7px 0 rgba(22,21,15,.16); }
        .acl-cs__donut::after{ content:""; position:absolute; inset:74px; border-radius:50%;
          background:var(--acl-paper); display:grid; }
        .acl-cs__dcenter{ position:absolute; inset:74px; border-radius:50%; z-index:2; display:flex;
          flex-direction:column; align-items:center; justify-content:center; text-align:center; }
        .acl-cs__dcenter b{ font-family:var(--acl-font-num); font-size:44px; line-height:.84;
          letter-spacing:-.01em; color:var(--acl-pink); }
        .acl-cs__dcenter span{ font-weight:700; font-size:17px; max-width:130px; line-height:1.2; margin-top:6px; }
        .acl-cs__legend{ flex:1; display:flex; flex-direction:column; gap:13px; }
        .acl-cs__lrow{ display:grid; grid-template-columns:20px 1fr auto; align-items:center; gap:12px;
          font-weight:700; font-size:21px; padding:6px 10px; }
        .acl-cs__lrow i{ width:20px; height:20px; }
        .acl-cs__lrow .pc{ font-family:var(--acl-font-num); font-size:28px; }
        .acl-cs__lrow--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:rotate(-1deg);
          box-shadow:4px 5px 0 rgba(22,21,15,.2); }
        /* bars (share) */
        .acl-cs__bars{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:20px; }
        .acl-cs__bar{ display:grid; grid-template-columns:210px 1fr 86px; align-items:center; gap:16px; }
        .acl-cs__bar .bl{ font-weight:700; font-size:23px; }
        .acl-cs__bar .track{ height:34px; background:rgba(22,21,15,.08); }
        .acl-cs__bar .fill{ height:100%; transition:width .5s; }
        .acl-cs__bar .pc{ font-family:var(--acl-font-num); font-size:32px; text-align:right; }
        .acl-cs__bar--focus .bl{ color:var(--acl-pink); }
        /* rounds */
        .acl-cs__rounds{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:22px; }
        .acl-cs__round{ position:relative; }
        .acl-cs__rtop{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:7px; }
        .acl-cs__rtop b{ font-weight:900; font-size:23px; }
        .acl-cs__rtop em{ font-style:normal; font-family:var(--acl-font-mono); font-size:15px;
          color:rgba(22,21,15,.5); }
        .acl-cs__rtrack{ height:26px; background:rgba(22,21,15,.08); position:relative; }
        .acl-cs__rfill{ height:100%; display:flex; align-items:center; justify-content:flex-end;
          padding-right:10px; font-family:var(--acl-font-num); font-size:20px; color:var(--acl-paper);
          transition:width .5s; }
        .acl-cs__round--focus .acl-cs__rfill{ background:var(--acl-ink) !important; }
        .acl-cs__rfx{ position:absolute; top:34px; right:20px; z-index:3; }
        .acl-cs__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; }
      `}</style>

      <div className="acl-cs__head">
        <div>
          <div className="acl-cs__eyebrow">{eyebrow}</div>
          <h1 className="acl-cs__h">{headline}</h1>
        </div>
        <div className="acl-cs__sub">{subheadline}</div>
        <div className="acl-cs__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-cs__body">
        {/* ── left: share chart ── */}
        <div className="acl-cs__panel left">
          <h3 className="acl-cs__ptitle">{shareTitle}
            {showDecor && <Doodle kind="arrowS" size={40} rotate={-18} style={{ position: 'static' }} />}</h3>
          <div className="acl-cs__ptag">Share of Funding · %</div>

          {chartType === 'donut' && (
            <div className="acl-cs__donutwrap">
              <div className="acl-cs__donut" style={{ background: `conic-gradient(${stops})` }}>
                <div className="acl-cs__dcenter">
                  <b>{focus.pct}%</b>
                  <span>{focusEnabled ? focus.label : shareTitle}</span>
                </div>
              </div>
              <div className="acl-cs__legend">
                {segs.map((d, i) => {
                  const isF = focusEnabled && i === fIdx;
                  return (
                    <div key={i} className={'acl-cs__lrow' + (isF ? ' acl-cs__lrow--focus' : '')}>
                      <i style={{ background: SEG_COLORS[i % SEG_COLORS.length] }} />
                      <span>{d.label}</span>
                      <span className="pc">{d.pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {chartType === 'bars' && (
            <div className="acl-cs__bars">
              {segs.map((d, i) => {
                const isF = focusEnabled && i === fIdx;
                const w = (d.pct / Math.max(...segs.map((s) => s.pct))) * 100;
                return (
                  <div key={i} className={'acl-cs__bar' + (isF ? ' acl-cs__bar--focus' : '')}>
                    <div className="bl">{d.label}</div>
                    <div className="track"><div className="fill" style={{ width: w + '%', background: SEG_COLORS[i % SEG_COLORS.length] }} /></div>
                    <div className="pc">{d.pct}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── right: rounds panel ── */}
        {showRounds && (
          <div className="acl-cs__panel right">
            <h3 className="acl-cs__ptitle">{roundsTitle}
              {showDecor && <Doodle kind="spark" size={36} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}</h3>
            <div className="acl-cs__ptag">Stage Structure · share of amount</div>
            <div className="acl-cs__rounds">
              {rounds.map((r, i) => (
                <div key={i} className={'acl-cs__round' + (r.focus ? ' acl-cs__round--focus' : '')}>
                  {r.focus && showDecor && <div className="acl-cs__rfx"><Sticker label="赢家通吃" color="var(--acl-yellow)" rotate={5} /></div>}
                  <div className="acl-cs__rtop"><b>{r.label}</b><em>{r.note}</em></div>
                  <div className="acl-cs__rtrack">
                    <div className="acl-cs__rfill" style={{ width: r.pct + '%', background: SEG_COLORS[i % SEG_COLORS.length] }}>{r.pct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="acl-cs__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page06Cross.defaults = {
  backgroundTheme: 'muted',
  chartType: 'donut',     // 'donut' | 'bars'
  segmentCount: 5,
  focusEnabled: true,
  focusIndex: 0,
  showRounds: true,
  showDecor: true,
  eyebrow: 'Cross-Section',
  headline: '横向透视 · 赛道与轮次',
  subheadline: '钱流向哪些赛道和阶段',
  summary: '通用大模型仍是<b>最大吸金赛道</b>，后期轮与未披露轮体现头部赢家通吃。',
  shareTitle: '赛道融资占比',
  segments: [
    { label: '通用大模型', pct: 43.3 },
    { label: '垂直应用', pct: 25.3 },
    { label: '基础设施', pct: 16.3 },
    { label: 'AI 芯片', pct: 10.0 },
    { label: '其他', pct: 5.1 },
  ],
  roundsTitle: '轮次结构',
  rounds: [
    { label: '后期轮 D+', pct: 38, note: 'avg 18.6 亿美元', focus: true },
    { label: '未披露轮', pct: 26, note: '战略 / 资源置换' },
    { label: 'B / C 轮', pct: 24, note: '加速扩张' },
    { label: '早期 Seed / A', pct: 12, note: '新主题萌芽' },
  ],
  closingLine: '融资额排名背后，是资本对叙事与兑现的双重押注。',
};

Page06Cross.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'donut', options: ['donut', 'bars'],
    label: '图表类型', desc: '占比模块的呈现：环形 / 条形' },
  { key: 'segmentCount', type: 'number', default: 5, min: 3, max: 5, step: 1,
    label: '分段数量', desc: '占比分段(赛道)的数量' },
  { key: 'showRounds', type: 'boolean', default: true,
    label: '副面板(轮次)', desc: '右侧轮次结构面板的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个分段' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'segmentCount', step: 1,
    label: '重点对象', desc: '被高亮的分段序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page06Cross.defaults;
export const controls = Page06Cross.controls;
