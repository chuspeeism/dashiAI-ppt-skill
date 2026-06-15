// Page68Platform.jsx — "Case Card · Platform Layer Bands" template page (content)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pf-`.
// A single-subject company case card framing a data-platform's extension into AI
// as a RIGHT stack of count-driven horizontal LAYER BANDS (each: index, label,
// adoption meter, value; leading bands carry an adaptive image thumbnail), with
// one focusable "extension" layer. LEFT holds a dominant retention figure, a
// caption and a metric-tile row. Pure ESM — no Tweaks / preview-runtime ties.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page68Platform(props) {
  const p = { ...Page68Platform.defaults, ...props };
  const {
    backgroundTheme, layerCount, mediaCount, showMeter, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, tag, caption,
    bigLabel, bigNumber, bigUnit, metrics, layersTitle, layers, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const bands = layers.slice(0, Math.max(2, layerCount));
  const fIdx = Math.min(focusIndex, bands.length - 1);
  const photoBands = Math.min(mediaCount, bands.length);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)', 'var(--acl-yellow)'];

  return (
    <div className="acl-root acl-pf" style={{ background: bg }}>
      <style>{`
        .acl-pf{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 58px; display:flex; flex-direction:column; }
        .acl-pf__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-pf__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-pf__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-pf__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-pf__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-pf__h{ font-weight:900; font-size:70px; line-height:.92; margin:0; }
        .acl-pf__plate{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:9px 15px; background:var(--acl-pink); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-pf__body{ flex:1; display:flex; gap:56px; margin-top:24px; min-height:0; }

        /* left: big retention number + caption + tiles */
        .acl-pf__left{ flex:0 0 600px; display:flex; flex-direction:column; min-width:0; }
        .acl-pf__cap{ font-weight:700; font-size:24px; line-height:1.46; }
        .acl-pf__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-pf__big{ position:relative; margin-top:30px; }
        .acl-pf__biglabel{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-pf__bignum{ font-family:var(--acl-font-num); font-size:230px; line-height:.82; margin-top:20px;
          letter-spacing:-.02em; color:var(--acl-pink); text-shadow:7px 8px 0 var(--acl-ink); }
        .acl-pf__bignum em{ font-style:normal; font-size:88px; color:var(--acl-ink); text-shadow:none; margin-left:4px; }
        .acl-pf__bigpin{ position:absolute; right:8px; top:-2px; z-index:3; }
        .acl-pf__tiles{ display:flex; gap:30px; margin-top:auto; padding-top:22px; }
        .acl-pf__tile{ border-top:5px solid var(--acl-ink); padding-top:11px; }
        .acl-pf__tk{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-pf__tv{ font-family:var(--acl-font-num); font-size:48px; line-height:.92; margin-top:2px; }
        .acl-pf__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:4px; color:rgba(22,21,15,.55); }

        /* right: platform layer bands */
        .acl-pf__layers{ flex:1; display:flex; flex-direction:column; min-width:0; }
        .acl-pf__ltitle{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-bottom:13px; display:flex;
          align-items:center; gap:10px; flex:0 0 auto; }
        .acl-pf__stack{ flex:1; display:flex; flex-direction:column; gap:12px; min-height:0; }
        .acl-pf__band{ flex:1; display:flex; align-items:center; gap:20px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:5px 6px 0 rgba(22,21,15,.13); padding:12px 22px;
          position:relative; min-height:0; transition:opacity .25s, transform .25s, box-shadow .25s, background .25s; }
        .acl-pf__bn{ flex:0 0 auto; width:48px; height:48px; border-radius:50%; display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:25px; background:var(--acl-ink); color:var(--acl-yellow); }
        .acl-pf__bthumb{ flex:0 0 auto; }
        .acl-pf__binfo{ flex:0 0 282px; min-width:0; }
        .acl-pf__bl{ font-weight:900; font-size:29px; line-height:1.04; }
        .acl-pf__bsub{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:3px; }
        .acl-pf__meter{ flex:1; min-width:0; }
        .acl-pf__track{ height:22px; background:rgba(22,21,15,.08); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-pf__fill{ position:absolute; left:0; top:0; bottom:0; transition:width .55s cubic-bezier(.2,.8,.2,1); }
        .acl-pf__bv{ flex:0 0 auto; font-family:var(--acl-font-num); font-size:38px; line-height:.84;
          min-width:118px; text-align:right; white-space:nowrap; }
        .acl-pf__bv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; color:rgba(22,21,15,.5); }
        .acl-pf__band--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:scale(1.015); z-index:2;
          box-shadow:8px 10px 0 rgba(22,21,15,.26); }
        .acl-pf__band--focus .acl-pf__bsub{ color:rgba(251,250,244,.6); }
        .acl-pf__band--focus .acl-pf__track{ background:rgba(255,255,255,.16); border-color:var(--acl-paper); }
        .acl-pf__band--focus .acl-pf__fill{ background:var(--acl-yellow) !important; }
        .acl-pf__band--focus .acl-pf__bv{ color:var(--acl-yellow); }
        .acl-pf__band--focus .acl-pf__bv em{ color:rgba(251,250,244,.55); }
        .acl-pf__band--dim{ opacity:.55; }
        .acl-pf__bfx{ position:absolute; top:-15px; right:-8px; z-index:5; }

        .acl-pf__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pf__band{ animation:acl-pf-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .25s); }
          [data-deck-active] .acl-pf__bignum{ animation:acl-pf-pop .6s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-pf-rise{ from{ opacity:0; transform:translateX(18px); } to{ opacity:1; } }
        @keyframes acl-pf-pop{ from{ opacity:0; transform:translateY(20px) scale(.93); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-pf__top">
        <div className="acl-pf__eyebrow">{eyebrow}</div>
        <div className="acl-pf__rule" />
        <div className="acl-pf__kicker">{kicker}</div>
      </div>

      <div className="acl-pf__head">
        <h1 className="acl-pf__h">{headline}</h1>
        <div className="acl-pf__plate">{company}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-pf__body">
        {/* ── left: retention big number ── */}
        <div className="acl-pf__left">
          <div className="acl-pf__cap" dangerouslySetInnerHTML={{ __html: caption }} />
          <div className="acl-pf__big">
            {showDecor && <div className="acl-pf__bigpin"><Sticker label={company} sub="NRR" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-5} size={14} /></div>}
            <div className="acl-pf__biglabel">{bigLabel}</div>
            <div className="acl-pf__bignum">{bigNumber}<em>{bigUnit}</em></div>
          </div>
          <div className="acl-pf__tiles">
            {tiles.map((m, i) => (
              <div className="acl-pf__tile" key={i}>
                <div className="acl-pf__tk">{m.k}</div>
                <div className="acl-pf__tv">{m.v}{m.unit && <em>{m.unit}</em>}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── right: platform layer bands ── */}
        <div className="acl-pf__layers">
          <div className="acl-pf__ltitle">
            {layersTitle}
            {showDecor && <Doodle kind="arrowS" size={28} rotate={-12} style={{ position: 'static' }} />}
          </div>
          <div className="acl-pf__stack">
            {bands.map((b, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const c = accents[i % accents.length];
              const asPhoto = i < photoBands;
              return (
                <div key={i} className={'acl-pf__band' + (isF ? ' acl-pf__band--focus' : '') + (dim ? ' acl-pf__band--dim' : '')} style={{ '--i': i }}>
                  {isF && showDecor && <div className="acl-pf__bfx"><Sticker label="延展" color="var(--acl-yellow)" rotate={6} size={13} /></div>}
                  {asPhoto
                    ? <div className="acl-pf__bthumb"><AdaptiveImageSlot id={'pf-' + i} box={84} rotate={i % 2 ? 3 : -3} ratio={1}
                        accent={isF ? 'var(--acl-yellow)' : 'var(--acl-paper)'} placeholder={b.label} /></div>
                    : <div className="acl-pf__bn">{String(i + 1).padStart(2, '0')}</div>}
                  <div className="acl-pf__binfo">
                    <div className="acl-pf__bl">{b.label}</div>
                    <div className="acl-pf__bsub">{b.en}</div>
                  </div>
                  {showMeter && (
                    <div className="acl-pf__meter">
                      <div className="acl-pf__track">
                        <div className="acl-pf__fill" style={{ width: b.meter + '%', background: isF ? 'var(--acl-yellow)' : c }} />
                      </div>
                    </div>
                  )}
                  <div className="acl-pf__bv">{b.value}{b.unit && <em>{b.unit}</em>}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="acl-pf__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page68Platform.defaults = {
  backgroundTheme: 'primary',
  layerCount: 4,
  mediaCount: 2,
  showMeter: true,
  metricCount: 3,
  focusEnabled: true,
  focusIndex: 3,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Databricks Case',
  kicker: '案例卡',
  headline: '数据平台延展',
  company: 'Databricks',
  tag: '数据平台',
  caption: 'Databricks 是数据平台向 AI 平台延展的典型——<b>存量客户基础</b>是 AI 商业化的捷径。',
  bigLabel: '净收入留存 NRR',
  bigNumber: '132',
  bigUnit: '%',
  metrics: [
    { k: '最大单笔融资', v: '5.0', unit: '亿' },
    { k: '企业客户', v: '1.1', unit: '万家' },
    { k: '赛道', v: '数据平台' },
  ],
  layersTitle: '从数据平台到 AI 平台',
  layers: [
    { label: '数据湖仓', en: 'Lakehouse', meter: 96, value: '底座', unit: '' },
    { label: '数据治理', en: 'Governance', meter: 82, value: '82', unit: '%' },
    { label: '机器学习平台', en: 'ML Platform', meter: 68, value: '68', unit: '%' },
    { label: '生成式 AI', en: 'Mosaic AI', meter: 54, value: '54', unit: '%' },
    { label: '应用与智能体', en: 'Apps & Agents', meter: 31, value: '31', unit: '%' },
  ],
  closingLine: '存量客户基础，是 AI 商业化的捷径。',
};

Page68Platform.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'layerCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '层级数量', desc: '平台层带数量(2–5)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '前 N 个层带改为承载图片缩略图(0–4，超过层数自动封顶)；每张按上传图片比例自适应' },
  { key: 'showMeter', type: 'boolean', default: true,
    label: '占用计量', desc: '各层带的采用率/占用比例条 显隐' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '左侧大数字下方支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个平台层带' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, maxFrom: 'layerCount', step: 1,
    label: '重点对象', desc: '被突出的层带序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page68Platform.defaults;
export const controls = Page68Platform.controls;
