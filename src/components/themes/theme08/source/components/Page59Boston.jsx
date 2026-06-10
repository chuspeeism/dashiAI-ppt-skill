// Page59Boston.jsx — "Geo Card · Featured Stamp Hero" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gf-`.
// A magazine-cover geo card: LEFT narrative column (caption + count-driven
// focusable research tags as ticket stubs + metric tiles); RIGHT a featured
// photo hero (1 main + up to 2 nested AdaptiveImageSlots, each resizing to its
// uploaded ratio) overprinted with a rotating circular "share stamp". Three
// themes incl. ink dark-poster. Portable — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page59Boston(props) {
  const p = { ...Page59Boston.defaults, ...props };
  const {
    backgroundTheme, mediaCount, tagCount, metricCount, showStamp,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, place, caption, tagsTitle, tags,
    shareValue, shareLabel, metrics, hero, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(120% 120% at 80% 6%, #2A2820 0%, #16150F 62%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(162deg, #EFEFF6 0%, #E7E6EE 56%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const stubs = tags.slice(0, Math.max(2, tagCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, stubs.length - 1);
  const slots = hero[mediaCount] || [];

  return (
    <div className={'acl-root acl-gf' + (isInk ? ' acl-gf--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-gf{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:70px 92px 58px; display:flex; flex-direction:column; }
        .acl-gf--ink{ color:var(--acl-paper); }
        .acl-gf__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-gf__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gf--ink .acl-gf__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-gf__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.4; }
        .acl-gf__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-gf--ink .acl-gf__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-gf__head{ display:flex; align-items:flex-end; gap:22px; margin-top:12px; flex:0 0 auto; }
        .acl-gf__h{ font-weight:900; font-size:74px; line-height:.92; margin:0; }
        .acl-gf__place{ font-family:var(--acl-font-mono); font-weight:700; font-size:20px;
          padding:8px 14px; background:var(--acl-red); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-gf__body{ flex:1; display:flex; gap:50px; margin-top:24px; min-height:0; }
        .acl-gf__left{ flex:0 0 600px; display:flex; flex-direction:column; min-width:0; }
        .acl-gf__cap{ font-weight:700; font-size:25px; line-height:1.46; }
        .acl-gf__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-gf--ink .acl-gf__cap b{ background:var(--acl-pink); color:var(--acl-paper); }

        .acl-gf__tagttl{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:26px 0 12px; }
        .acl-gf--ink .acl-gf__tagttl{ color:rgba(251,250,244,.55); }
        .acl-gf__stubs{ display:flex; flex-direction:column; gap:10px; }
        .acl-gf__stub{ display:flex; align-items:center; gap:0; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:4px 5px 0 rgba(22,21,15,.13);
          transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-gf--ink .acl-gf__stub{ background:#221F18; border-color:rgba(251,250,244,.5); color:var(--acl-paper); }
        .acl-gf__sn{ font-family:var(--acl-font-num); font-size:30px; line-height:1; padding:12px 16px;
          background:var(--acl-ink); color:var(--acl-yellow); align-self:stretch; display:flex; align-items:center;
          border-right:3px dashed rgba(236,239,53,.5); }
        .acl-gf--ink .acl-gf__sn{ background:var(--acl-yellow); color:var(--acl-ink); border-right-color:rgba(22,21,15,.4); }
        .acl-gf__st{ font-weight:900; font-size:25px; line-height:1; padding:0 16px; white-space:nowrap; }
        .acl-gf__snote{ font-weight:400; font-size:15px; color:rgba(22,21,15,.55); margin-left:auto;
          padding:0 16px; white-space:nowrap; }
        .acl-gf--ink .acl-gf__snote{ color:rgba(251,250,244,.55); }
        .acl-gf__stub--focus{ transform:rotate(-1deg) scale(1.03); box-shadow:7px 8px 0 rgba(22,21,15,.22);
          border-color:var(--acl-pink); }
        .acl-gf__stub--dim{ opacity:.48; }

        .acl-gf__tiles{ display:flex; gap:30px; margin-top:auto; padding-top:24px; }
        .acl-gf__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-gf--ink .acl-gf__tile .k{ color:rgba(251,250,244,.5); }
        .acl-gf__tile .v{ font-family:var(--acl-font-num); font-size:48px; line-height:.92; margin-top:3px; }
        .acl-gf--ink .acl-gf__tile .v{ color:var(--acl-yellow); }
        .acl-gf__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:4px; color:rgba(22,21,15,.5); }
        .acl-gf--ink .acl-gf__tile .v em{ color:rgba(251,250,244,.5); }

        /* right: featured hero + stamp */
        .acl-gf__stage{ flex:1; position:relative; min-width:0; }
        .acl-gf__slot{ position:absolute; }
        .acl-gf__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }
        .acl-gf--ink .acl-gf__empty{ color:rgba(251,250,244,.4); }
        .acl-gf__stamp{ position:absolute; right:6px; top:8px; z-index:8; width:188px; height:188px; border-radius:50%;
          background:var(--acl-pink); color:var(--acl-paper); border:6px double var(--acl-paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center; transform:rotate(-13deg);
          box-shadow:5px 7px 0 rgba(22,21,15,.3); }
        .acl-gf__stampv{ font-family:var(--acl-font-num); font-size:74px; line-height:.8; }
        .acl-gf__stampk{ font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.14em;
          text-transform:uppercase; margin-top:4px; }

        .acl-gf__foot{ display:flex; align-items:center; gap:13px; font-family:var(--acl-font-hand);
          font-size:27px; margin-top:16px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gf__stub{ animation:acl-gf-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .25s); }
          [data-deck-active] .acl-gf__stamp{ animation:acl-gf-stamp .5s cubic-bezier(.3,1.4,.4,1) .35s both; }
        }
        @keyframes acl-gf-rise{ from{ opacity:0; transform:translateX(-16px); } to{ opacity:1; } }
        @keyframes acl-gf-stamp{ from{ opacity:0; transform:rotate(-13deg) scale(1.6); } to{ opacity:1; transform:rotate(-13deg) scale(1); } }
      `}</style>

      <div className="acl-gf__top">
        <div className="acl-gf__eyebrow">{eyebrow}</div>
        <div className="acl-gf__rule" />
        <div className="acl-gf__kicker">{kicker}</div>
      </div>

      <div className="acl-gf__head">
        <h1 className="acl-gf__h">{headline}</h1>
        <div className="acl-gf__place">{place}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-gf__body">
        {/* ── left narrative ── */}
        <div className="acl-gf__left">
          <div className="acl-gf__cap" dangerouslySetInnerHTML={{ __html: caption }} />

          <div className="acl-gf__tagttl">{tagsTitle}</div>
          <div className="acl-gf__stubs">
            {stubs.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-gf__stub' + (isF ? ' acl-gf__stub--focus' : '') + (dim ? ' acl-gf__stub--dim' : '')} style={{ '--i': i }}>
                  <span className="acl-gf__sn">{String(i + 1).padStart(2, '0')}</span>
                  <span className="acl-gf__st">{s.label}</span>
                  <span className="acl-gf__snote">{s.note}</span>
                </div>
              );
            })}
          </div>

          <div className="acl-gf__tiles">
            {tiles.map((m, i) => (
              <div className="acl-gf__tile" key={i}>
                <div className="k">{m.k}</div>
                <div className="v">{m.v}{m.unit && <em>{m.unit}</em>}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── right featured hero ── */}
        <div className="acl-gf__stage">
          {slots.length === 0 && <div className="acl-gf__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-gf__slot" key={i} style={{ left: s.l, top: s.t, zIndex: i + 1 }}>
              <AdaptiveImageSlot id={'bo-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={i === 0 ? '主视觉' : (stubs[i % stubs.length] ? stubs[i % stubs.length].label : '图片')}
                sticker={i === 0 ? { label: place.split(' ')[0], color: 'var(--acl-yellow)', rotate: s.sr } : null} />
            </div>
          ))}
          {showStamp && (
            <div className="acl-gf__stamp">
              <div className="acl-gf__stampv">{shareValue}</div>
              <div className="acl-gf__stampk">{shareLabel}</div>
            </div>
          )}
          {showDecor && slots.length > 0 && (
            <Doodle kind="arrow" size={74} rotate={150} color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ left: -8, bottom: 24 }} />
          )}
        </div>
      </div>

      <div className="acl-gf__foot">
        {showDecor && <Doodle kind="loop" size={50} color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page59Boston.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 2,
  tagCount: 4,
  metricCount: 4,
  showStamp: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content
  eyebrow: 'Boston Cluster',
  kicker: '城市卡',
  headline: '科研与硬科技',
  place: '波士顿集群 · BOSTON',
  caption: '波士顿集中在 <b>医疗 AI、机器人与硬科技</b> 方向——高校科研与硬科技转化，构成它独特的长周期资产优势。',
  tagsTitle: '主要科研方向',
  tags: [
    { label: '医疗 AI', note: '影像 · 诊断' },
    { label: '机器人', note: '具身 · 工业' },
    { label: '药物发现', note: '生物计算' },
    { label: '硬科技', note: '材料 · 量子' },
  ],
  shareValue: '7.7%',
  shareLabel: 'Share of US',
  metrics: [
    { k: '融资额', v: '75', unit: '亿' },
    { k: '占比', v: '7.7', unit: '%' },
    { k: '事件数', v: '8', unit: '笔' },
    { k: '平均单笔', v: '9.4', unit: '亿' },
  ],
  // featured-hero presets — stage ≈ 780×680. slot 0 = main, others nested insets.
  hero: {
    0: [],
    1: [
      { l: 100, t: 90, box: 540, r: -2, ratio: 1.18, sr: -3, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 70, t: 70, box: 520, r: -2, ratio: 1.2, sr: -3, color: 'var(--acl-yellow)' },
      { l: 470, t: 420, box: 250, r: 5, ratio: 0.82, sr: 5, color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 50, t: 50, box: 480, r: -2, ratio: 1.2, sr: -3, color: 'var(--acl-yellow)' },
      { l: 440, t: 400, box: 240, r: 5, ratio: 0.82, sr: 5, color: 'var(--acl-blue)' },
      { l: 100, t: 470, box: 210, r: -5, ratio: 1.05, sr: -4, color: 'var(--acl-pink)' },
    ],
  },
  closingLine: '科研城市，更适合长周期技术资产。',
};

// ── adjustable-parameter manifest ────────────────────────────────────────────
Page59Boston.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(杂志海报)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '特写图片数量(0–3：1 主视觉 + 至多 2 张嵌套)；每张按上传图片比例自适应' },
  { key: 'tagCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '标签数量', desc: '科研方向票根数量(2–4)' },
  { key: 'metricCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–4)' },
  { key: 'showStamp', type: 'boolean', default: true,
    label: '占比印章', desc: '特写上的圆形占比印章 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个方向票根' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'tagCount', step: 1,
    label: '重点对象', desc: '被突出的票根序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page59Boston.defaults;
export const controls = Page59Boston.controls;
