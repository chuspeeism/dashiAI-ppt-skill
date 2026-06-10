// Page47OpenSource.jsx — "Big-Stat Member Cluster" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-os-`.
// A NEW image layout: a GIANT free-floating community figure (no card chrome) with
// a community→enterprise CONVERSION CHAIN on the left, faced by a loose scatter of
// 0–4 tilted member AdaptiveImage cards on the right (each resizes to its photo's
// ratio + carries a member sticker). One conversion stage focusable. Portable ESM —
// no Tweaks dependency; all CSS prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page47OpenSource(props) {
  const p = { ...Page47OpenSource.defaults, ...props };
  const {
    backgroundTheme, mediaCount, showChain, segmentCount, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, bigStat, chainTitle, stages,
    metrics, cluster, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = stages.slice(0, Math.max(2, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const count = Math.max(0, Math.min(4, mediaCount));
  const cards = (cluster[count] || []);
  const palette = ['var(--acl-yellow)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-paper)'];
  const stageColor = (i, isF) => (isF ? 'var(--acl-pink)' : palette[i % palette.length]);

  return (
    <div className="acl-root acl-os" style={{ background: bg }}>
      <style>{`
        .acl-os{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 100px 58px; display:flex; flex-direction:column; }
        .acl-os__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-os__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-os__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-os__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-os__summary{ margin-left:auto; max-width:470px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-os__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-os__body{ flex:1; display:flex; gap:30px; margin-top:18px; min-height:0; }

        /* big stat + conversion (left) */
        .acl-os__left{ flex:0 0 760px; display:flex; flex-direction:column; min-width:0; }
        .acl-os__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;
          white-space:nowrap; }
        .acl-os__biglabel{ font-weight:700; font-size:24px; color:rgba(22,21,15,.6); margin-top:22px; }
        .acl-os__big{ font-family:var(--acl-font-num); font-size:228px; line-height:.86; letter-spacing:-.01em; }
        .acl-os__big em{ font-style:normal; font-size:64px; margin-left:4px; }
        .acl-os__bigsub{ font-weight:700; font-size:21px; color:rgba(22,21,15,.62); max-width:600px;
          line-height:1.35; margin-top:6px; }

        .acl-os__chainhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin:auto 0 12px; }
        .acl-os__chain{ display:flex; align-items:stretch; gap:0; }
        .acl-os__node{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:4px;
          border:3px solid var(--acl-ink); padding:14px 16px; transition:.25s; }
        .acl-os__node .nn{ font-weight:900; font-size:23px; line-height:1.05; }
        .acl-os__node .nn small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:11px;
          letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-top:3px; }
        .acl-os__node .nv{ font-family:var(--acl-font-num); font-size:42px; line-height:.8; margin-top:7px; }
        .acl-os__node .nv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:2px; opacity:.6; }
        .acl-os__node--dim{ opacity:.45; }
        .acl-os__conn{ flex:0 0 40px; display:grid; place-items:center; }
        .acl-os__tiles{ display:flex; gap:14px; margin-top:16px; }
        .acl-os__tile{ flex:1; border-left:5px solid var(--acl-ink); padding-left:13px; }
        .acl-os__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-os__tile .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.92; }
        .acl-os__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }

        /* member cluster (right) */
        .acl-os__cluster{ flex:1; position:relative; min-width:0; }
        .acl-os__card{ position:absolute; z-index:2; }
        .acl-os__empty{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(-4deg);
          font-family:var(--acl-font-hand); font-size:32px; color:rgba(22,21,15,.4); text-align:center; }

        .acl-os__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:10px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-os__big{ animation:acl-os-rise .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-os__card{ animation:acl-os-pop .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .11s + .2s); }
          [data-deck-active] .acl-os__node{ animation:acl-os-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .3s); }
        }
        @keyframes acl-os-rise{ from{ opacity:0; transform:translateY(20px); } }
        @keyframes acl-os-pop{ from{ opacity:0; transform:scale(.8); } }
        @keyframes acl-os-in{ from{ opacity:0; transform:translateY(14px); } }
      `}</style>

      <div className="acl-os__head">
        <div>
          <div className="acl-os__eyebrow">{eyebrow}</div>
          <h1 className="acl-os__h">{headline}</h1>
        </div>
        <div className="acl-os__sub">{subheadline}</div>
        <div className="acl-os__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-os__body">
        {/* ── big stat + conversion chain ── */}
        <div className="acl-os__left">
          <div className="acl-os__badge">◎ {badge}</div>
          <div className="acl-os__biglabel">{bigStat.label}</div>
          <div className="acl-os__big">{bigStat.value}<em>{bigStat.unit}</em></div>
          <div className="acl-os__bigsub">{bigStat.note}</div>

          <div className="acl-os__chainhd">{chainTitle} · Community → Enterprise</div>
          <div className="acl-os__chain">
            {segs.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const last = i === segs.length - 1;
              return (
                <React.Fragment key={i}>
                  <div className={'acl-os__node' + (focusEnabled && !isF ? ' acl-os__node--dim' : '')}
                       style={{ '--i': i, background: stageColor(i, isF),
                         color: stageColor(i, isF) === 'var(--acl-ink)' ? 'var(--acl-paper)' : 'var(--acl-ink)' }}>
                    <div className="nn">{s.k}<small>{s.en}</small></div>
                    {showValueLabels && <div className="nv">{s.v}<em>{s.unit}</em></div>}
                  </div>
                  {!last && <div className="acl-os__conn"><Doodle kind="arrow" size={40} rotate={0} color="var(--acl-ink)" style={{ position: 'static' }} /></div>}
                </React.Fragment>
              );
            })}
          </div>
          <div className="acl-os__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-os__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── member card cluster ── */}
        <div className="acl-os__cluster">
          {count === 0 && <div className="acl-os__empty">// 图片数量 = 0<br />仅展示社区数据</div>}
          {cards.map((c, i) => (
            <div key={i} className="acl-os__card" style={{ left: c.l, top: c.t, '--i': i }}>
              <AdaptiveImageSlot id={'opensource-' + i} box={c.box} rotate={c.r} ratio={c.ratio}
                accent="var(--acl-paper)" placeholder={c.label}
                sticker={{ label: c.label, sub: c.sub, color: palette[i % palette.length], subColor: 'var(--acl-ink)', rotate: c.sr }} />
            </div>
          ))}
          {showChain && showDecor && count > 0 && (
            <Doodle kind="arrowS" size={84} rotate={-150} color="var(--acl-ink)" style={{ left: -34, top: '46%' }} />
          )}
          {showDecor && count > 1 && (
            <Doodle kind="spark" size={40} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 30, top: 18 }} />
          )}
        </div>
      </div>

      <div className="acl-os__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page47OpenSource.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 3,           // 0–4 scattered member image cards
  showChain: true,         // hand-drawn arrow from cluster toward stat
  segmentCount: 3,         // 2–3 conversion stages
  showValueLabels: true,
  metricCount: 2,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 2,           // highlight 企业支持 by default
  showDecor: true,
  eyebrow: 'Open Source Models',
  headline: '社区影响力变现',
  subheadline: '开源模型公司',
  summary: '开源公司靠<b>社区影响力、托管服务与企业支持</b>变现。',
  badge: 'Open Source · 变现路径',
  bigStat: { label: '社区下载量', value: '2.8', unit: '亿次', note: '通过社区影响力沉淀开发者，再向托管服务与企业支持转化。' },
  chainTitle: '变现路径',
  // conversion stages — text not parameterized (count via segmentCount)
  stages: [
    { k: '社区影响力', en: 'Community', v: '2.8', unit: '亿' },
    { k: '托管服务', en: 'Hosting', v: '40', unit: '%' },
    { k: '企业支持', en: 'Enterprise', v: '37', unit: '%' },
  ],
  metrics: [
    { k: '赛道融资额', v: '28', unit: '亿' },
    { k: '事件数', v: '7', unit: '笔' },
    { k: '企业服务占比', v: '37', unit: '%' },
  ],
  // count-driven scatter presets — cluster area ≈ 880×740; each card resizes to ratio.
  cluster: {
    0: [],
    1: [
      { l: 240, t: 120, box: 440, r: -3, ratio: 1.2, sr: 4, label: '社区成员', sub: 'DEV' },
    ],
    2: [
      { l: 60, t: 40, box: 360, r: -4, ratio: 1.0, sr: -4, label: '开发者', sub: 'DEV' },
      { l: 430, t: 320, box: 360, r: 4, ratio: 1.1, sr: 4, label: '企业用户', sub: 'ENT' },
    ],
    3: [
      { l: 40, t: 16, box: 320, r: -5, ratio: 0.95, sr: -4, label: '开发者', sub: 'DEV' },
      { l: 470, t: 60, box: 300, r: 5, ratio: 1.05, sr: 4, label: '贡献者', sub: 'OSS' },
      { l: 220, t: 400, box: 320, r: -3, ratio: 1.25, sr: 3, label: '企业用户', sub: 'ENT' },
    ],
    4: [
      { l: 30, t: 6, box: 280, r: -5, ratio: 0.92, sr: -4, label: '开发者', sub: 'DEV' },
      { l: 510, t: 24, box: 270, r: 5, ratio: 1.0, sr: 4, label: '贡献者', sub: 'OSS' },
      { l: 70, t: 380, box: 280, r: 4, ratio: 1.15, sr: 3, label: '企业用户', sub: 'ENT' },
      { l: 530, t: 410, box: 270, r: -4, ratio: 0.95, sr: -3, label: '合作伙伴', sub: 'PARTNER' },
    ],
  },
  closingLine: '开源是入口，不是完整商业模式。',
};

Page47OpenSource.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '散落的社区成员图片卡数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showChain', type: 'boolean', default: true,
    label: '指向连线', desc: '由图片群指向数据的手绘箭头 显隐' },
  { key: 'segmentCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '环节数量', desc: '变现路径的环节数量(2–3)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '变现路径环节上的数值 显隐' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '左侧支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个变现环节(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 2, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的变现环节序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page47OpenSource.defaults;
export const controls = Page47OpenSource.controls;
