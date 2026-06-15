// Page60OtherRegions.jsx — "Geo Card · Dispersed Dot Map" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gd-`.
// A scattered region map: a central "share hub" radiates dashed connectors to a
// count-driven field of region nodes (circles sized by value, one focusable).
// The first `mediaCount` nodes become AdaptiveImageSlots (each resizing to its
// uploaded ratio) so the map mixes photos + data points. Industry tags + metric
// tiles sit on a bottom bar. Portable — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page60OtherRegions(props) {
  const p = { ...Page60OtherRegions.defaults, ...props };
  const {
    backgroundTheme, nodeCount, mediaCount, tagCount, metricCount, showValueLabels,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, place, caption, hubValue, hubLabel,
    tagsTitle, tags, metrics, nodes, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(160deg, #EFEFF6 0%, #E7E6EE 56%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const pts = nodes.slice(0, Math.max(3, nodeCount));
  const chips = tags.slice(0, Math.max(2, tagCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, pts.length - 1);
  const nMedia = Math.min(mediaCount, pts.length);
  const HUB = { l: 50, t: 46 };
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)'];

  return (
    <div className="acl-root acl-gd" style={{ background: bg }}>
      <style>{`
        .acl-gd{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:66px 92px 56px; display:flex; flex-direction:column; }
        .acl-gd__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-gd__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gd__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-gd__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-gd__head{ display:flex; align-items:flex-end; gap:22px; margin-top:10px; flex:0 0 auto; }
        .acl-gd__h{ font-weight:900; font-size:72px; line-height:.92; margin:0; }
        .acl-gd__place{ display:inline-flex; align-self:flex-start; font-family:var(--acl-font-mono); font-weight:700; font-size:19px;
          padding:8px 14px; background:var(--acl-blue); color:var(--acl-ink); transform:rotate(-1.5deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.18); white-space:nowrap; margin-top:14px; }
        .acl-gd__cap{ font-weight:700; font-size:24px; line-height:1.58; max-width:760px; margin:14px 0 0; }
        .acl-gd__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }

        /* scatter map stage */
        .acl-gd__stage{ flex:1; position:relative; margin:10px 0 6px; min-height:0; }
        .acl-gd__links{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
        .acl-gd__node{ position:absolute; transform:translate(-50%,-50%); z-index:2;
          display:flex; flex-direction:column; align-items:center; gap:7px;
          transition:opacity .25s, transform .25s; }
        .acl-gd__dot{ border-radius:50%; border:4px solid var(--acl-ink); background:var(--acl-paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          box-shadow:4px 5px 0 rgba(22,21,15,.16); }
        .acl-gd__dotv{ font-family:var(--acl-font-num); line-height:.82; }
        .acl-gd__dotu{ font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.04em;
          color:rgba(22,21,15,.5); margin-top:1px; }
        .acl-gd__nlabel{ font-family:var(--acl-font-cn); font-weight:900; font-size:21px; line-height:1;
          background:var(--acl-ink); color:var(--acl-paper); padding:5px 11px; white-space:nowrap; }
        .acl-gd__node--focus{ z-index:5; transform:translate(-50%,-50%) scale(1.12); }
        .acl-gd__node--focus .acl-gd__dot{ background:var(--acl-pink); color:var(--acl-paper);
          box-shadow:6px 8px 0 rgba(22,21,15,.26); }
        .acl-gd__node--focus .acl-gd__dotu{ color:rgba(251,250,244,.7); }
        .acl-gd__node--focus .acl-gd__nlabel{ background:var(--acl-pink); }
        .acl-gd__node--dim{ opacity:.5; }
        .acl-gd__nfx{ position:absolute; top:-26px; right:-28px; z-index:6; }

        .acl-gd__pnode{ position:absolute; transform:translate(-50%,-50%); z-index:3; }

        .acl-gd__hub{ position:absolute; left:50%; top:46%; transform:translate(-50%,-50%); z-index:4;
          width:230px; height:230px; border-radius:50%; background:var(--acl-ink); color:var(--acl-paper);
          border:6px solid var(--acl-yellow); display:flex; flex-direction:column; align-items:center;
          justify-content:center; box-shadow:7px 9px 0 rgba(22,21,15,.3); }
        .acl-gd__hubv{ font-family:var(--acl-font-num); font-size:88px; line-height:.78; color:var(--acl-yellow); }
        .acl-gd__hubk{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(251,250,244,.72); margin-top:6px; }

        /* bottom bar */
        .acl-gd__bar{ display:flex; align-items:flex-end; gap:40px; flex:0 0 auto; padding-top:12px;
          border-top:4px solid var(--acl-ink); }
        .acl-gd__tags{ flex:1; min-width:0; }
        .acl-gd__tagttl{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-bottom:9px; }
        .acl-gd__chips{ display:flex; flex-wrap:wrap; gap:10px; }
        .acl-gd__chip{ display:flex; align-items:center; gap:9px; padding:8px 15px; border:3px solid var(--acl-ink);
          background:var(--acl-paper); font-weight:900; font-size:20px; line-height:1;
          box-shadow:3px 4px 0 rgba(22,21,15,.12); }
        .acl-gd__cdot{ width:13px; height:13px; border-radius:50%; flex:0 0 auto; }
        .acl-gd__tiles{ display:flex; gap:28px; flex:0 0 auto; }
        .acl-gd__tile{ text-align:right; }
        .acl-gd__tile .k{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-gd__tile .v{ font-family:var(--acl-font-num); font-size:44px; line-height:.92; margin-top:2px; }
        .acl-gd__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; color:rgba(22,21,15,.5); }

        .acl-gd__foot{ display:flex; align-items:center; gap:13px; font-family:var(--acl-font-hand);
          font-size:26px; margin-top:12px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gd__node, [data-deck-active] .acl-gd__pnode{
            animation:acl-gd-pop .5s cubic-bezier(.2,.8,.2,1) both; animation-delay:calc(var(--i,0) * .06s + .2s); }
          [data-deck-active] .acl-gd__hub{ animation:acl-gd-hub .6s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-gd-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.5); } to{ opacity:1; } }
        @keyframes acl-gd-hub{ from{ opacity:0; transform:translate(-50%,-50%) scale(.7); } to{ opacity:1; } }
      `}</style>

      <div className="acl-gd__top">
        <div className="acl-gd__eyebrow">{eyebrow}</div>
        <div className="acl-gd__rule" />
        <div className="acl-gd__kicker">{kicker}</div>
      </div>

      <div className="acl-gd__head">
        <h1 className="acl-gd__h">{headline}</h1>
        {showDecor && <Doodle kind="spark" size={40} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>
      <div className="acl-gd__place">{place}</div>
      <div className="acl-gd__cap" dangerouslySetInnerHTML={{ __html: caption }} />

      {/* ── scatter map ── */}
      <div className="acl-gd__stage">
        <svg className="acl-gd__links" preserveAspectRatio="none">
          {pts.map((n, i) => {
            const dim = focusEnabled && i !== fIdx;
            return (
              <line key={i} x1={HUB.l + '%'} y1={HUB.t + '%'} x2={n.l} y2={n.t}
                stroke="var(--acl-ink)" strokeWidth="2.5" strokeDasharray="3 7"
                strokeLinecap="round" opacity={dim ? 0.2 : 0.55} />
            );
          })}
        </svg>

        {pts.map((n, i) => {
          if (i < nMedia) {
            const box = 130 + (n.size - 64) * 0.7;
            return (
              <div className="acl-gd__pnode" key={i} style={{ left: n.l, top: n.t, '--i': i }}>
                <AdaptiveImageSlot id={'ot-' + i} box={box} ratio={1} rotate={i % 2 ? 4 : -4}
                  accent="var(--acl-paper)" placeholder={n.region}
                  sticker={{ label: n.region, sub: showValueLabels ? (n.value + '亿') : null,
                    color: accents[i % accents.length] === 'var(--acl-ink)' ? 'var(--acl-yellow)' : accents[i % accents.length],
                    subColor: 'var(--acl-ink)', rotate: i % 2 ? 4 : -5 }} />
              </div>
            );
          }
          const isF = focusEnabled && i === fIdx;
          const dim = focusEnabled && !isF;
          const sz = n.size;
          return (
            <div className={'acl-gd__node' + (isF ? ' acl-gd__node--focus' : '') + (dim ? ' acl-gd__node--dim' : '')}
              key={i} style={{ left: n.l, top: n.t, '--i': i }}>
              {isF && showDecor && <div className="acl-gd__nfx"><Sticker label="重点" color="var(--acl-yellow)" rotate={8} size={12} /></div>}
              <div className="acl-gd__dot" style={{ width: sz, height: sz }}>
                {showValueLabels && (
                  <React.Fragment>
                    <span className="acl-gd__dotv" style={{ fontSize: Math.round(sz * 0.34) }}>{n.value}</span>
                    <span className="acl-gd__dotu">亿</span>
                  </React.Fragment>
                )}
              </div>
              <span className="acl-gd__nlabel">{n.region}</span>
            </div>
          );
        })}

        <div className="acl-gd__hub">
          <div className="acl-gd__hubv">{hubValue}</div>
          <div className="acl-gd__hubk">{hubLabel}</div>
        </div>
      </div>

      {/* ── bottom bar ── */}
      <div className="acl-gd__bar">
        <div className="acl-gd__tags">
          <div className="acl-gd__tagttl">{tagsTitle}</div>
          <div className="acl-gd__chips">
            {chips.map((tg, i) => (
              <div className="acl-gd__chip" key={i}>
                <span className="acl-gd__cdot" style={{ background: accents[i % accents.length] }} />
                {tg}
              </div>
            ))}
          </div>
        </div>
        <div className="acl-gd__tiles">
          {tiles.map((m, i) => (
            <div className="acl-gd__tile" key={i}>
              <div className="k">{m.k}</div>
              <div className="v">{m.v}{m.unit && <em>{m.unit}</em>}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="acl-gd__foot">
        {showDecor && <Doodle kind="loop" size={48} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page60OtherRegions.defaults = {
  backgroundTheme: 'primary',
  nodeCount: 6,
  mediaCount: 2,
  tagCount: 4,
  metricCount: 4,
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content
  eyebrow: 'Other Regions',
  kicker: '区域点阵',
  headline: '分散型应用落地',
  place: '其他地区 · DISPERSED',
  caption: '其他地区融资规模较小，但出现 <b>行业专用模型与本地化应用</b> 机会——非核心区域更适合做行业落地，而非争夺通用模型。',
  hubValue: '6.2%',
  hubLabel: '其他地区合计',
  tagsTitle: '主要落地方向',
  tags: ['行业专用模型', '本地化应用', '制造 AI', '政企服务', '农业科技'],
  metrics: [
    { k: '融资额', v: '60', unit: '亿' },
    { k: '占比', v: '6.2', unit: '%' },
    { k: '事件数', v: '11', unit: '笔' },
    { k: '平均单笔', v: '5.5', unit: '亿' },
  ],
  // region nodes (l/t are % of the scatter stage; size in px). sliced by nodeCount.
  nodes: [
    { region: '奥斯汀', value: 14, l: '17%', t: '24%', size: 128 },
    { region: '丹佛', value: 11, l: '79%', t: '22%', size: 116 },
    { region: '亚特兰大', value: 9, l: '30%', t: '74%', size: 106 },
    { region: '芝加哥', value: 8, l: '70%', t: '76%', size: 100 },
    { region: '圣地亚哥', value: 7, l: '9%', t: '58%', size: 92 },
    { region: '迈阿密', value: 5, l: '90%', t: '56%', size: 82 },
    { region: '匹兹堡', value: 4, l: '46%', t: '11%', size: 74 },
    { region: '纳什维尔', value: 2, l: '55%', t: '90%', size: 64 },
  ],
  closingLine: '本地行业资源，也能形成应用机会。',
};

// ── adjustable-parameter manifest ────────────────────────────────────────────
Page60OtherRegions.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'nodeCount', type: 'number', default: 6, min: 3, max: 8, step: 1,
    label: '节点数量', desc: '散点地图上的区域节点数量(3–8)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '前 N 个节点改为承载图片(0–4，超过节点数自动封顶)；每张按上传图片比例自适应' },
  { key: 'tagCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '标签数量', desc: '落地方向标签数量(2–5)' },
  { key: 'metricCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–4)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各节点的融资额数值 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个区域节点' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'nodeCount', step: 1,
    label: '重点对象', desc: '被突出的节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page60OtherRegions.defaults;
export const controls = Page60OtherRegions.controls;
