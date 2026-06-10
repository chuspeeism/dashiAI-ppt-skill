// Page69Knowledge.jsx — "Case Card · Aggregation Board" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ag-`.
// A single-subject company case card built around an AGGREGATION motif: a LEFT
// count-driven grid of "source" cards (each with index / label / note / share
// bar, one focusable) that visually converge — via optional hand-drawn arrows —
// into a RIGHT dominant hero collage (1 main + up to 2 nested AdaptiveImageSlots,
// each self-sizing to its photo, with an optional highlight badge). A metric-tile
// row anchors the hero. Pure ESM — every visible change flows from props; no
// Tweaks / preview-runtime dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, MetaTag, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page69Knowledge(props) {
  const p = { ...Page69Knowledge.defaults, ...props };
  const {
    backgroundTheme, mediaCount, sourceCount, metricCount, showValueLabels, showBadge,
    showConverge, focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, tag, caption, sourcesTitle,
    badgeValue, badgeUnit, badgeLabel, sources, hero, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = sources.slice(0, Math.max(2, sourceCount));
  const fIdx = Math.min(focusIndex, items.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const slots = hero[mediaCount] || [];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)', 'var(--acl-yellow)'];

  return (
    <div className="acl-root acl-ag" style={{ background: bg }}>
      <style>{`
        .acl-ag{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 60px; display:flex; flex-direction:column; }
        .acl-ag__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-ag__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ag__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-ag__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-ag__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-ag__h{ font-weight:900; font-size:74px; line-height:.92; margin:0; }
        .acl-ag__plate{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:9px 15px; background:var(--acl-pink); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-ag__body{ flex:1; display:flex; gap:46px; margin-top:24px; min-height:0; }

        /* left: caption + converging source grid */
        .acl-ag__left{ flex:1 1 0; min-width:0; display:flex; flex-direction:column; }
        .acl-ag__cap{ font-weight:700; font-size:24px; line-height:1.46; }
        .acl-ag__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-ag__stitle{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:22px 0 14px; display:flex;
          align-items:center; gap:10px; }
        .acl-ag__grid{ display:grid; grid-template-columns:1fr 1fr; gap:13px; align-content:start; }
        .acl-ag__src{ position:relative; display:grid; grid-template-columns:38px 1fr; gap:13px;
          align-items:center; padding:12px 15px 12px 11px; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:4px 5px 0 rgba(22,21,15,.14);
          transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-ag__sn{ width:38px; height:38px; border-radius:50%; display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:21px; background:var(--acl-ink); color:var(--acl-yellow); }
        .acl-ag__st{ min-width:0; }
        .acl-ag__sk{ font-weight:900; font-size:22px; line-height:1.04; }
        .acl-ag__snote{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:2px; }
        .acl-ag__sbarwrap{ display:flex; align-items:center; gap:9px; margin-top:7px; }
        .acl-ag__sbar{ flex:1; height:8px; background:rgba(22,21,15,.12); position:relative; overflow:hidden; }
        .acl-ag__sbar i{ position:absolute; inset:0 auto 0 0; background:var(--acl-ink); }
        .acl-ag__sv{ font-family:var(--acl-font-num); font-size:21px; line-height:1; white-space:nowrap; }
        .acl-ag__src--focus{ border-color:var(--acl-pink); transform:rotate(-1deg) scale(1.02);
          box-shadow:7px 8px 0 rgba(22,21,15,.2); z-index:2; }
        .acl-ag__src--focus .acl-ag__sbar i{ background:var(--acl-pink); }
        .acl-ag__src--dim{ opacity:.5; }
        .acl-ag__sfx{ position:absolute; right:-14px; top:-18px; z-index:4; }

        /* right: dominant hero + badge + tiles */
        .acl-ag__right{ flex:0 0 700px; display:flex; flex-direction:column; min-width:0; }
        .acl-ag__stage{ position:relative; flex:1; min-height:0; }
        .acl-ag__slot{ position:absolute; }
        .acl-ag__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-3deg); }
        .acl-ag__badge{ position:absolute; z-index:6; right:4px; top:14px; background:var(--acl-ink);
          color:var(--acl-paper); padding:15px 22px 13px; transform:rotate(3deg);
          box-shadow:6px 8px 0 rgba(22,21,15,.28); text-align:center;  white-space:nowrap;}
        .acl-ag__badgev{ font-family:var(--acl-font-num); font-size:66px; line-height:.82; color:var(--acl-yellow); }
        .acl-ag__badgev em{ font-style:normal; font-size:26px; margin-left:2px; }
        .acl-ag__badgek{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(251,250,244,.7); margin-top:5px; }
        .acl-ag__conv{ position:absolute; left:-44px; top:46%; z-index:5; }

        .acl-ag__tiles{ display:flex; gap:30px; padding-top:20px; }
        .acl-ag__tile .acl-metatag .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.9; }
        .acl-ag__tile .acl-metatag .v em{ font-style:normal; font-size:18px; font-family:var(--acl-font-cn);
          font-weight:700; margin-left:4px; color:rgba(22,21,15,.5); }

        .acl-ag__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ag__src{ animation:acl-ag-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .2s); }
          [data-deck-active] .acl-ag__slot{ animation:acl-ag-pop .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--j,0) * .1s + .3s); }
          [data-deck-active] .acl-ag__badge{ animation:acl-ag-pop .55s cubic-bezier(.2,.8,.2,1) .42s both; }
        }
        @keyframes acl-ag-rise{ from{ opacity:0; transform:translateX(-16px); } to{ opacity:1; } }
        @keyframes acl-ag-pop{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-ag__top">
        <div className="acl-ag__eyebrow">{eyebrow}</div>
        <div className="acl-ag__rule" />
        <div className="acl-ag__kicker">{kicker}</div>
      </div>

      <div className="acl-ag__head">
        <h1 className="acl-ag__h">{headline}</h1>
        <div className="acl-ag__plate">{company}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-ag__body">
        {/* ── left: caption + converging source grid ── */}
        <div className="acl-ag__left">
          <div className="acl-ag__cap" dangerouslySetInnerHTML={{ __html: caption }} />
          <div className="acl-ag__stitle">
            {sourcesTitle}
            {showDecor && <Doodle kind="arrowS" size={28} rotate={-12} style={{ position: 'static' }} />}
          </div>
          <div className="acl-ag__grid">
            {items.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-ag__src' + (isF ? ' acl-ag__src--focus' : '') + (dim ? ' acl-ag__src--dim' : '')}
                  style={{ '--i': i }}>
                  {isF && showDecor && <div className="acl-ag__sfx"><Sticker label="高频入口" color="var(--acl-yellow)" rotate={6} size={12} /></div>}
                  <div className="acl-ag__sn">{String(i + 1).padStart(2, '0')}</div>
                  <div className="acl-ag__st">
                    <div className="acl-ag__sk">{s.label}</div>
                    <div className="acl-ag__snote">{s.note}</div>
                    <div className="acl-ag__sbarwrap">
                      <div className="acl-ag__sbar"><i style={{ width: s.v + '%' }} /></div>
                      {showValueLabels && <span className="acl-ag__sv">{s.v}<em style={{ fontStyle: 'normal', fontSize: 15 }}>{s.unit}</em></span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── right: dominant hero ── */}
        <div className="acl-ag__right">
          <div className="acl-ag__stage">
            {showConverge && slots.length > 0 && (
              <div className="acl-ag__conv"><Doodle kind="arrow" size={88} rotate={-4} color="var(--acl-ink)" style={{ position: 'static' }} /></div>
            )}
            {slots.length === 0 && <div className="acl-ag__empty">// 图片数量 = 0</div>}
            {slots.map((s, i) => (
              <div className="acl-ag__slot" key={i} style={{ left: s.l, top: s.t, zIndex: s.z || (i + 1), '--j': i }}>
                <AdaptiveImageSlot id={'ag-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                  accent="var(--acl-paper)" placeholder={i === 0 ? company : ('SRC.' + (i + 1))}
                  sticker={i === 0 ? { label: company, sub: tag, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr } : null} />
              </div>
            ))}
            {showBadge && slots.length > 0 && (
              <div className="acl-ag__badge">
                <div className="acl-ag__badgev">{badgeValue}<em>{badgeUnit}</em></div>
                <div className="acl-ag__badgek">{badgeLabel}</div>
              </div>
            )}
          </div>

          <div className="acl-ag__tiles">
            {tiles.map((m, i) => (
              <div className="acl-ag__tile" key={i}>
                <MetaTag k={m.k} v={<React.Fragment>{m.v}{m.unit && <em>{m.unit}</em>}</React.Fragment>} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-ag__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page69Knowledge.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 2,
  sourceCount: 5,
  metricCount: 3,
  showValueLabels: true,
  showBadge: true,
  showConverge: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Glean Case',
  kicker: '案例卡',
  headline: '企业知识入口',
  company: 'Glean',
  tag: '企业搜索',
  caption: 'Glean 把散落在各系统里的知识，<b>汇聚成一个统一入口</b>——接入知识库后，企业搜索会成为高频工作入口。',
  sourcesTitle: '被汇聚的知识来源',
  badgeValue: '780',
  badgeUnit: '家',
  badgeLabel: 'Paying Customers',
  sources: [
    { label: '文档与云盘', note: 'Docs & Drive', v: 34, unit: '%' },
    { label: '邮件与日历', note: 'Mail & Calendar', v: 22, unit: '%' },
    { label: 'IM 与会议', note: 'Chat & Meetings', v: 19, unit: '%' },
    { label: '工单与项目', note: 'Tickets & Tasks', v: 15, unit: '%' },
    { label: '代码与知识库', note: 'Code & Wiki', v: 10, unit: '%' },
  ],
  // count-driven hero presets — stage ≈ 700×560, each slot resizes to its ratio.
  hero: {
    0: [],
    1: [
      { l: 70, t: 30, box: 520, r: -2, ratio: 1.18, sr: -4, z: 1, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 24, t: 0, box: 450, r: -3, ratio: 1.12, sr: -4, z: 1, color: 'var(--acl-yellow)' },
      { l: 360, t: 290, box: 280, r: 5, ratio: 0.85, sr: 4, z: 2, color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 18, t: 0, box: 410, r: -3, ratio: 1.06, sr: -4, z: 1, color: 'var(--acl-yellow)' },
      { l: 388, t: 16, box: 230, r: 5, ratio: 0.8, sr: 4, z: 2, color: 'var(--acl-blue)' },
      { l: 350, t: 300, box: 270, r: 4, ratio: 1.02, sr: -3, z: 3, color: 'var(--acl-pink)' },
    ],
  },
  metrics: [
    { k: '最大单笔融资', v: '2.6', unit: '亿' },
    { k: '续约率', v: '91', unit: '%' },
    { k: '赛道', v: '企业搜索' },
  ],
  closingLine: '窄场景也能产生高价值。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page69Knowledge.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '特写图片数量(0–3)：1 主视觉 + 至多 2 张嵌套；每张按上传图片比例自适应' },
  { key: 'sourceCount', type: 'number', default: 5, min: 2, max: 5, step: 1,
    label: '来源数量', desc: '左侧被汇聚的来源卡数量(2–5)' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–3)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '来源卡占比数值与比例条 显隐' },
  { key: 'showBadge', type: 'boolean', default: true,
    label: '高亮徽标', desc: '主视觉上的大号高亮数字徽标 显隐' },
  { key: 'showConverge', type: 'boolean', default: true,
    label: '汇聚箭头', desc: '由来源指向主视觉的手绘汇聚箭头 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一张来源卡' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'sourceCount', step: 1,
    label: '重点对象', desc: '被突出的来源卡序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page69Knowledge.defaults;
export const controls = Page69Knowledge.controls;
