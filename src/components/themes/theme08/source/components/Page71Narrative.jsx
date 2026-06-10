// Page71Narrative.jsx — "Case Card · Narrative Gauges" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-nv-`.
// A single-subject company case card that visualises a TENSION: a LEFT dominant
// abstract hero collage (1 main + up to 1 nested AdaptiveImageSlot, each
// self-sizing) versus a RIGHT stack of count-driven SEGMENTED GAUGES (battery-
// style filled/empty cells) contrasting what's strong (team, narrative) against
// what's unproven (revenue) — one gauge focusable — plus a metric-tile row. This
// gauge motif is distinct from share bars / meters / funnels used elsewhere.
// Pure ESM — every visible change flows from props; no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, MetaTag, AdaptiveImageSlot } from './AclPrimitives.jsx';

const SEGMENTS = 10;

export default function Page71Narrative(props) {
  const p = { ...Page71Narrative.defaults, ...props };
  const {
    backgroundTheme, mediaCount, gaugeCount, metricCount, showValueLabels,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, tag, caption, gaugesTitle,
    gauges, hero, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'primary'
    ? 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)'
    : 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)';

  const items = gauges.slice(0, Math.max(2, gaugeCount));
  const fIdx = Math.min(focusIndex, items.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const slots = hero[mediaCount] || [];

  return (
    <div className="acl-root acl-nv" style={{ background: bg }}>
      <style>{`
        .acl-nv{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 60px; display:flex; flex-direction:column; }
        .acl-nv__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-nv__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-nv__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-nv__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-nv__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-nv__h{ font-weight:900; font-size:66px; line-height:.94; margin:0; }
        .acl-nv__plate{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:9px 15px; background:var(--acl-pink); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-nv__body{ flex:1; display:flex; gap:52px; margin-top:24px; min-height:0; }

        /* left: abstract hero */
        .acl-nv__stage{ flex:0 0 620px; position:relative; min-width:0; }
        .acl-nv__slot{ position:absolute; }
        .acl-nv__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-3deg); }
        .acl-nv__abstract{ position:absolute; left:40px; top:30px; right:60px; bottom:40px; z-index:0;
          background:
            repeating-linear-gradient(135deg, rgba(22,21,15,.05) 0 14px, transparent 14px 30px),
            radial-gradient(circle at 40% 35%, rgba(255,61,151,.16), transparent 60%),
            var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:6px 8px 0 rgba(22,21,15,.16); }
        .acl-nv__abstxt{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(-4deg);
          font-family:var(--acl-font-hand); font-size:30px; color:rgba(22,21,15,.4); text-align:center; }

        /* right: narrative gauges */
        .acl-nv__right{ flex:1; display:flex; flex-direction:column; min-width:0; }
        .acl-nv__cap{ font-weight:700; font-size:24px; line-height:1.46; }
        .acl-nv__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-nv__gtitle{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:22px 0 14px; display:flex;
          align-items:center; gap:10px; }
        .acl-nv__gauges{ display:flex; flex-direction:column; gap:15px; }
        .acl-nv__g{ position:relative; padding:13px 18px 14px; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:5px 6px 0 rgba(22,21,15,.14);
          transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-nv__grow{ display:flex; align-items:baseline; gap:12px; }
        .acl-nv__gk{ font-weight:900; font-size:25px; line-height:1; }
        .acl-nv__gnote{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-nv__gv{ margin-left:auto; font-family:var(--acl-font-num); font-size:38px; line-height:.8; }
        .acl-nv__gv em{ font-style:normal; font-size:17px; margin-left:2px; color:rgba(22,21,15,.5); }
        .acl-nv__cells{ display:flex; gap:5px; margin-top:11px; height:22px; }
        .acl-nv__cell{ flex:1; border:2px solid var(--acl-ink); background:transparent; }
        .acl-nv__cell--on{ background:var(--acl-ink); }
        .acl-nv__g--low .acl-nv__cell--on{ background:var(--acl-red); border-color:var(--acl-red); }
        .acl-nv__g--low .acl-nv__gv{ color:var(--acl-red); }
        .acl-nv__g--focus{ border-color:var(--acl-pink); transform:rotate(-.6deg) scale(1.015);
          box-shadow:8px 9px 0 rgba(22,21,15,.2); z-index:2; }
        .acl-nv__g--focus .acl-nv__cell--on{ background:var(--acl-pink); border-color:var(--acl-pink); }
        .acl-nv__g--focus .acl-nv__gv{ color:var(--acl-pink); }
        .acl-nv__g--dim{ opacity:.5; }
        .acl-nv__gfx{ position:absolute; right:-14px; top:-20px; z-index:4; }

        .acl-nv__tiles{ display:flex; gap:28px; margin-top:auto; padding-top:22px; }
        .acl-nv__tile .acl-metatag .v{ font-family:var(--acl-font-num); font-size:44px; line-height:.9; }
        .acl-nv__tile .acl-metatag .v em{ font-style:normal; font-size:17px; font-family:var(--acl-font-cn);
          font-weight:700; margin-left:4px; color:rgba(22,21,15,.5); }

        .acl-nv__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-nv__g{ animation:acl-nv-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .25s); }
          [data-deck-active] .acl-nv__slot, [data-deck-active] .acl-nv__abstract{
            animation:acl-nv-pop .55s cubic-bezier(.2,.8,.2,1) .2s both; }
        }
        @keyframes acl-nv-rise{ from{ opacity:0; transform:translateX(16px); } to{ opacity:1; } }
        @keyframes acl-nv-pop{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-nv__top">
        <div className="acl-nv__eyebrow">{eyebrow}</div>
        <div className="acl-nv__rule" />
        <div className="acl-nv__kicker">{kicker}</div>
      </div>

      <div className="acl-nv__head">
        <h1 className="acl-nv__h">{headline}</h1>
        <div className="acl-nv__plate">{company}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-nv__body">
        {/* ── left: abstract hero ── */}
        <div className="acl-nv__stage">
          <div className="acl-nv__abstract"><div className="acl-nv__abstxt">// 抽象技术意象</div></div>
          {slots.length === 0 && <div className="acl-nv__empty" style={{ zIndex: 1 }}>// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-nv__slot" key={i} style={{ left: s.l, top: s.t, zIndex: s.z || (i + 2) }}>
              <AdaptiveImageSlot id={'nv-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={i === 0 ? company : ('FIG.' + (i + 1))}
                sticker={i === 0 ? { label: company, sub: tag, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr } : null} />
            </div>
          ))}
        </div>

        {/* ── right: narrative gauges ── */}
        <div className="acl-nv__right">
          <div className="acl-nv__cap" dangerouslySetInnerHTML={{ __html: caption }} />
          <div className="acl-nv__gtitle">
            {gaugesTitle}
            {showDecor && <Doodle kind="arrowS" size={28} rotate={-12} style={{ position: 'static' }} />}
          </div>
          <div className="acl-nv__gauges">
            {items.map((g, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const on = Math.max(0, Math.min(SEGMENTS, Math.round(g.fill / 100 * SEGMENTS)));
              return (
                <div key={i} style={{ '--i': i }}
                  className={'acl-nv__g' + (g.tone === 'low' ? ' acl-nv__g--low' : '') + (isF ? ' acl-nv__g--focus' : '') + (dim ? ' acl-nv__g--dim' : '')}>
                  {isF && showDecor && <div className="acl-nv__gfx"><Sticker label="待兑现" color="var(--acl-yellow)" rotate={6} size={12} /></div>}
                  <div className="acl-nv__grow">
                    <span className="acl-nv__gk">{g.label}</span>
                    <span className="acl-nv__gnote">{g.note}</span>
                    {showValueLabels && <span className="acl-nv__gv">{g.fill}<em>%</em></span>}
                  </div>
                  <div className="acl-nv__cells">
                    {Array.from({ length: SEGMENTS }).map((_, c) => (
                      <div key={c} className={'acl-nv__cell' + (c < on ? ' acl-nv__cell--on' : '')} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="acl-nv__tiles">
            {tiles.map((m, i) => (
              <div className="acl-nv__tile" key={i}>
                <MetaTag k={m.k} v={<React.Fragment>{m.v}{m.unit && <em>{m.unit}</em>}</React.Fragment>} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-nv__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page71Narrative.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 2,
  gaugeCount: 4,
  metricCount: 3,
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 2,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'SSI Case',
  kicker: '案例卡',
  headline: '强叙事模型实验室',
  company: 'SSI',
  tag: '安全智能',
  caption: 'SSI 代表强团队、强叙事、弱商业化验证的模型实验室——短期难以用收入评价，价值建立在 <b>长期技术想象</b> 上。',
  gaugesTitle: '强在哪里 · 缺在哪里',
  gauges: [
    { label: '团队与人才', note: 'Team & Talent', fill: 92, tone: 'high' },
    { label: '技术叙事', note: 'Narrative', fill: 88, tone: 'high' },
    { label: '商业化兑现', note: 'Revenue Proof', fill: 6, tone: 'low' },
    { label: '产品落地', note: 'Product Shipped', fill: 14, tone: 'low' },
  ],
  // count-driven hero presets — stage ≈ 620×560, each slot resizes to its ratio.
  hero: {
    0: [],
    1: [
      { l: 60, t: 40, box: 480, r: -2, ratio: 1.08, sr: -4, z: 2, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 20, t: 10, box: 420, r: -3, ratio: 1.0, sr: -4, z: 2, color: 'var(--acl-yellow)' },
      { l: 330, t: 300, box: 260, r: 5, ratio: 0.86, sr: 4, z: 3, color: 'var(--acl-pink)' },
    ],
  },
  metrics: [
    { k: '最大单笔融资', v: '10', unit: '亿' },
    { k: '产品收入', v: '0' },
    { k: '团队规模', v: '85', unit: '人' },
    { k: '赛道', v: '安全智能' },
  ],
  closingLine: '强叙事，需要更长时间兑现。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page71Narrative.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 2, step: 1,
    label: '图片数量', desc: '特写图片数量(0–2)：1 主视觉 + 至多 1 张嵌套；为 0 时显示抽象意象占位，每张按上传图片比例自适应' },
  { key: 'gaugeCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '量表数量', desc: '右侧强弱量表数量(2–4)' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–4)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '量表右侧百分比数值 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一条量表' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, maxFrom: 'gaugeCount', step: 1,
    label: '重点对象', desc: '被突出的量表序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page71Narrative.defaults;
export const controls = Page71Narrative.controls;
