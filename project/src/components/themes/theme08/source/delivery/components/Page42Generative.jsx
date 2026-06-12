// Page42Generative.jsx — "Filmstrip + Content Split" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gc-`.
// A NEW image layout: a horizontal FILMSTRIP of AdaptiveImageSlots (0–4) framed
// by sprocket holes — each slot resizes to its uploaded photo's ratio. Below, a
// hero figure block sits beside a count-driven CONTENT-SPLIT distribution that
// toggles between grouped bars and a donut (one segment focusable). No dependency
// on the Tweaks panel — portable ESM, prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page42Generative(props) {
  const p = { ...Page42Generative.defaults, ...props };
  const {
    backgroundTheme, mediaCount, chartType, segmentCount, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, hero, metrics,
    splitTitle, segments, valueUnit, frames, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const segs = segments.slice(0, Math.max(2, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const totalV = segs.reduce((a, s) => a + s.v, 0);
  const maxV = Math.max(...segs.map((s) => s.v));
  const palette = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)', 'var(--acl-yellow)'];
  const segColor = (i, isF) => (isF ? 'var(--acl-pink)' : palette[(i + 1) % palette.length]);

  const count = Math.max(0, Math.min(4, mediaCount));
  const fr = frames.slice(0, count);
  const box = count <= 2 ? 380 : count === 3 ? 312 : 256;
  const SPROCKETS = 16;

  // donut conic-gradient stops
  let acc = 0;
  const stops = segs.map((s, i) => {
    const isF = focusEnabled && i === fIdx;
    const start = (acc / totalV) * 360; acc += s.v;
    const end = (acc / totalV) * 360;
    return `${segColor(i, isF)} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="acl-root acl-gc" style={{ background: bg }}>
      <style>{`
        .acl-gc{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 100px 60px; display:flex; flex-direction:column; }
        .acl-gc__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-gc__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-gc__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-gc__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-gc__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-gc__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        /* ── filmstrip ── */
        .acl-gc__film{ flex:1; margin-top:26px; min-height:0; position:relative; background:var(--acl-ink);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 26px; display:flex; align-items:center; }
        .acl-gc__perf{ position:absolute; left:14px; right:14px; height:14px; display:flex; gap:14px;
          justify-content:space-between; }
        .acl-gc__perf--t{ top:8px; }
        .acl-gc__perf--b{ bottom:8px; }
        .acl-gc__hole{ flex:1; max-width:30px; background:var(--acl-paper); border-radius:3px; }
        .acl-gc__reel{ flex:1; display:flex; align-items:center; justify-content:center; gap:24px; min-height:0; }
        .acl-gc__frame{ flex:0 0 auto; }
        .acl-gc__tag{ position:absolute; left:24px; top:50%; transform:translateY(-50%) rotate(-90deg);
          transform-origin:left center; font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.18em;
          text-transform:uppercase; color:rgba(255,255,255,.4); }
        .acl-gc__empty{ flex:1; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(255,255,255,.4); transform:rotate(-3deg); }

        /* ── bottom row ── */
        .acl-gc__row{ flex:0 0 auto; margin-top:22px; display:flex; gap:24px; align-items:stretch; }
        .acl-gc__hero{ flex:0 0 430px; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.14); padding:18px 30px 20px; display:flex; align-items:center; gap:28px; }
        .acl-gc__herobox{ flex:0 0 auto; }
        .acl-gc__herolabel{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gc__heronum{ font-family:var(--acl-font-num); font-size:118px; line-height:.78; }
        .acl-gc__heronum em{ font-style:normal; font-size:34px; margin-left:3px; }
        .acl-gc__tiles{ flex:1; display:flex; flex-direction:column; gap:12px; }
        .acl-gc__tile{ border-left:5px solid var(--acl-ink); padding-left:13px; }
        .acl-gc__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-gc__tile .v{ font-family:var(--acl-font-num); font-size:40px; line-height:.9; }
        .acl-gc__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; opacity:.6; }

        .acl-gc__split{ flex:1; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.14); padding:16px 30px 16px; display:flex; flex-direction:column; min-width:0; }
        .acl-gc__splithd{ display:flex; align-items:baseline; justify-content:space-between; gap:14px; }
        .acl-gc__splitt{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); }
        .acl-gc__splittot{ font-family:var(--acl-font-num); font-size:28px; }
        .acl-gc__splittot em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; opacity:.6; }
        /* bars */
        .acl-gc__bars{ flex:1; display:flex; gap:24px; align-items:flex-end; margin-top:8px; }
        .acl-gc__bcol{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end;
          height:100%; gap:6px; }
        .acl-gc__bval{ font-family:var(--acl-font-num); font-size:26px; line-height:.8; }
        .acl-gc__bbar{ width:100%; border:2px solid var(--acl-ink); }
        .acl-gc__bname{ font-weight:900; font-size:18px; text-align:center; }
        .acl-gc__bname small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:10px;
          letter-spacing:.03em; text-transform:uppercase; color:rgba(22,21,15,.5); }
        /* donut */
        .acl-gc__donutwrap{ flex:1; display:flex; align-items:center; gap:26px; margin-top:6px; }
        .acl-gc__donut{ flex:0 0 auto; width:150px; height:150px; border-radius:50%; position:relative;
          border:3px solid var(--acl-ink); }
        .acl-gc__donut::after{ content:''; position:absolute; inset:31%; background:var(--acl-paper);
          border:3px solid var(--acl-ink); border-radius:50%; }
        .acl-gc__dcenter{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center;
          justify-content:center; z-index:2; }
        .acl-gc__dcenter .dn{ font-family:var(--acl-font-num); font-size:34px; line-height:.8; }
        .acl-gc__dcenter .dl{ font-family:var(--acl-font-mono); font-size:10px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-gc__keys{ flex:1; display:flex; flex-direction:column; gap:9px; }
        .acl-gc__key{ display:flex; align-items:center; gap:10px; transition:.25s; }
        .acl-gc__sw{ width:18px; height:18px; border:2px solid var(--acl-ink); flex:0 0 auto; }
        .acl-gc__key .kn{ font-weight:900; font-size:20px; }
        .acl-gc__key .kv{ font-family:var(--acl-font-num); font-size:23px; margin-left:auto; }
        .acl-gc__key .kv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:12px;
          margin-left:2px; opacity:.6; }
        .acl-gc__key--dim{ opacity:.42; }

        .acl-gc__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:12px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gc__film,[data-deck-active] .acl-gc__hero,[data-deck-active] .acl-gc__split{
            animation:acl-gc-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-gc__hero{ animation-delay:.1s; }
          [data-deck-active] .acl-gc__split{ animation-delay:.18s; }
          [data-deck-active] .acl-gc__bbar{ animation:acl-gc-grow .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); transform-origin:bottom; }
        }
        @keyframes acl-gc-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-gc-grow{ from{ transform:scaleY(0); } to{ transform:none; } }
      `}</style>

      <div className="acl-gc__head">
        <div>
          <div className="acl-gc__eyebrow">{eyebrow}</div>
          <h1 className="acl-gc__h">{headline}</h1>
        </div>
        <div className="acl-gc__sub">{subheadline}</div>
        <div className="acl-gc__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      {/* ── filmstrip ── */}
      <div className="acl-gc__film">
        <div className="acl-gc__perf acl-gc__perf--t">
          {Array.from({ length: SPROCKETS }).map((_, i) => <div key={i} className="acl-gc__hole" />)}
        </div>
        <div className="acl-gc__perf acl-gc__perf--b">
          {Array.from({ length: SPROCKETS }).map((_, i) => <div key={i} className="acl-gc__hole" />)}
        </div>
        <div className="acl-gc__tag">REEL · 内容生成</div>
        <div className="acl-gc__reel">
          {count === 0 && <div className="acl-gc__empty">// 图片数量 = 0</div>}
          {fr.map((f, i) => (
            <div className="acl-gc__frame" key={i}>
              <AdaptiveImageSlot id={'generative-' + i} box={box} rotate={f.r} ratio={f.ratio}
                accent="var(--acl-paper)" placeholder={f.name}
                sticker={{ label: f.tag, sub: f.sub, color: f.color, subColor: 'var(--acl-ink)', rotate: f.sr }} />
            </div>
          ))}
        </div>
        {showDecor && count > 0 && (
          <Doodle kind="arrowS" size={70} rotate={6} color="var(--acl-yellow)" style={{ right: 30, top: 14, zIndex: 4 }} />
        )}
      </div>

      {/* ── hero + content-split ── */}
      <div className="acl-gc__row">
        <div className="acl-gc__hero">
          <div className="acl-gc__herobox">
            <div className="acl-gc__herolabel">{hero.label}</div>
            <div className="acl-gc__heronum">{hero.value}<em>{hero.unit}</em></div>
          </div>
          <div className="acl-gc__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-gc__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>

        <div className="acl-gc__split">
          <div className="acl-gc__splithd">
            <div className="acl-gc__splitt">{splitTitle} · Content Split</div>
            <div className="acl-gc__splittot">{totalV}<em>{valueUnit}</em></div>
          </div>

          {chartType === 'bars' ? (
            <div className="acl-gc__bars">
              {segs.map((s, i) => {
                const isF = focusEnabled && i === fIdx;
                return (
                  <div key={i} className="acl-gc__bcol" style={{ opacity: focusEnabled && !isF ? 0.5 : 1 }}>
                    {showValueLabels && <div className="acl-gc__bval">{s.v}<span style={{ fontSize: 13 }}>{valueUnit}</span></div>}
                    <div className="acl-gc__bbar" style={{ '--i': i, height: `${(s.v / maxV) * 100}%`, background: segColor(i, isF) }} />
                    <div className="acl-gc__bname">{s.k}<small>{s.en}</small></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="acl-gc__donutwrap">
              <div className="acl-gc__donut" style={{ background: `conic-gradient(${stops})` }}>
                <div className="acl-gc__dcenter">
                  <div className="dn">{totalV}</div>
                  <div className="dl">{valueUnit}</div>
                </div>
              </div>
              <div className="acl-gc__keys">
                {segs.map((s, i) => {
                  const isF = focusEnabled && i === fIdx;
                  return (
                    <div key={i} className={'acl-gc__key' + (focusEnabled && !isF ? ' acl-gc__key--dim' : '')}>
                      <span className="acl-gc__sw" style={{ background: segColor(i, isF) }} />
                      <span className="kn">{s.k}</span>
                      {showValueLabels && <span className="kv">{s.v}<em>{valueUnit}</em></span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="acl-gc__foot">
        {showDecor && <Doodle kind="loop" size={54} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page42Generative.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 3,           // 0–4 filmstrip image slots
  chartType: 'bars',       // bars | donut — content-type funding split
  segmentCount: 3,         // 2–4 content types
  showValueLabels: true,
  metricCount: 2,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,           // highlight 视频生成 by default
  showDecor: true,
  eyebrow: 'Generative Content',
  headline: '图像、视频与创意',
  subheadline: '内容生成赛道',
  summary: '内容生成继续保持融资热度，但也面临<b>版权与留存</b>问题。',
  hero: { label: '赛道融资额', value: '31', unit: '亿' },
  metrics: [
    { k: '事件数', v: '11', unit: '笔' },
    { k: '平均单笔', v: '2.8', unit: '亿' },
    { k: '视频占比', v: '45', unit: '%' },
  ],
  splitTitle: '资金分布',
  valueUnit: '亿',
  // content-type funding — text not parameterized (count via segmentCount)
  segments: [
    { k: '视频生成', en: 'Video', v: 14 },
    { k: '广告创意', en: 'Ad Creative', v: 8 },
    { k: '音乐音频', en: 'Audio', v: 4 },
    { k: '图像生成', en: 'Image', v: 5 },
  ],
  // filmstrip frames — text not parameterized (count via mediaCount)
  frames: [
    { name: '视频片段', tag: '视频', sub: 'VIDEO', color: 'var(--acl-pink)', r: -2, sr: -3, ratio: 1.4 },
    { name: '广告创意', tag: '创意', sub: 'AD', color: 'var(--acl-blue)', r: 2, sr: 3, ratio: 0.9 },
    { name: '音乐音频', tag: '音频', sub: 'AUDIO', color: 'var(--acl-yellow)', r: -2, sr: -3, ratio: 1.0 },
    { name: '图像生成', tag: '图像', sub: 'IMAGE', color: 'var(--acl-paper)', r: 2, sr: 3, ratio: 1.2 },
  ],
  closingLine: '流量热度不等于商业壁垒。',
};

Page42Generative.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '胶片图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'chartType', type: 'enum', default: 'bars', options: ['bars', 'donut'],
    label: '图表类型', desc: '资金分布呈现：条形 / 环形' },
  { key: 'segmentCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '类型数量', desc: '内容类型分段数量(2–4)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '资金分布数值标签的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主数字旁支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个内容类型(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的内容类型序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page42Generative.defaults;
export const controls = Page42Generative.controls;
