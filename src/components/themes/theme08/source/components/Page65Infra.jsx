// Page65Infra.jsx — "Case Card · Rack Stack + Resource Ladder" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cr-`.
// A single-subject company case card built around a LEFT vertical stack of
// count-driven AdaptiveImageSlots (0–n equipment "rack" photos, each resizing to
// its uploaded ratio) and a RIGHT data column: a company nameplate, a dominant
// "capacity meter" (unit-block bar + big figure), a count-driven focusable metric
// ladder, and a client tag strip. Pure ESM — no Tweaks / preview-runtime ties.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page65Infra(props) {
  const p = { ...Page65Infra.defaults, ...props };
  const {
    backgroundTheme, mediaCount, metricCount, tagCount, showMeter,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, tag, caption,
    meterLabel, meterValue, meterUnit, meterFill, meterUnits,
    metrics, clientsTitle, clients, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const rows = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, rows.length - 1);
  const chips = clients.slice(0, Math.max(2, tagCount));
  const slots = stack[mediaCount] || [];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)'];
  const litUnits = Math.round(meterUnits * Math.min(1, Math.max(0, meterFill)));

  return (
    <div className="acl-root acl-cr" style={{ background: bg }}>
      <style>{`
        .acl-cr{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 60px; display:flex; flex-direction:column; }
        .acl-cr__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-cr__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-cr__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-cr__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-cr__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-cr__h{ font-weight:900; font-size:74px; line-height:.92; margin:0; }
        .acl-cr__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:9px 15px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);
          white-space:nowrap; }

        .acl-cr__body{ flex:1; display:flex; gap:52px; margin-top:24px; min-height:0; }

        /* left: vertical rack stack of photos */
        .acl-cr__stack{ flex:0 0 620px; position:relative; min-width:0; }
        .acl-cr__slot{ position:absolute; }
        .acl-cr__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }

        /* right: data column */
        .acl-cr__right{ flex:1; display:flex; flex-direction:column; min-width:0; }
        .acl-cr__plate{ display:flex; align-items:baseline; gap:16px; }
        .acl-cr__co{ font-weight:900; font-size:62px; line-height:.9; letter-spacing:-.01em; }
        .acl-cr__cotag{ font-family:var(--acl-font-mono); font-weight:700; font-size:15px;
          letter-spacing:.05em; text-transform:uppercase; padding:6px 12px; background:var(--acl-pink);
          color:var(--acl-paper); transform:rotate(-2deg); box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }
        .acl-cr__cap{ font-weight:700; font-size:24px; line-height:1.46; margin:16px 0 0; }
        .acl-cr__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }

        /* capacity meter */
        .acl-cr__meter{ margin-top:22px; background:var(--acl-ink); color:var(--acl-paper);
          padding:20px 26px 22px; box-shadow:6px 8px 0 rgba(22,21,15,.22); position:relative; }
        .acl-cr__mhead{ display:flex; align-items:flex-end; justify-content:space-between; gap:18px; }
        .acl-cr__mk{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(251,250,244,.65); }
        .acl-cr__mv{ font-family:var(--acl-font-num); font-size:78px; line-height:.78; color:var(--acl-yellow); }
        .acl-cr__mv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:24px;
          margin-left:6px; color:rgba(251,250,244,.7); }
        .acl-cr__units{ display:grid; grid-template-columns:repeat(24, 1fr); gap:5px; margin-top:16px; }
        .acl-cr__units i{ height:18px; background:rgba(251,250,244,.16); }
        .acl-cr__units i.on{ background:var(--acl-yellow); }
        .acl-cr__mtag{ position:absolute; top:-16px; right:-12px; z-index:3; }

        /* metric ladder */
        .acl-cr__rows{ display:flex; flex-direction:column; gap:12px; margin-top:20px; }
        .acl-cr__r{ display:flex; align-items:center; gap:18px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:5px 6px 0 rgba(22,21,15,.13); padding:12px 20px;
          position:relative; transition:opacity .25s, transform .25s, box-shadow .25s, background .25s; }
        .acl-cr__rbar{ width:9px; align-self:stretch; flex:0 0 auto; }
        .acl-cr__rk{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); flex:1; min-width:0; }
        .acl-cr__rv{ font-family:var(--acl-font-num); font-size:42px; line-height:.84; white-space:nowrap; }
        .acl-cr__rv em{ font-style:normal; font-size:19px; font-family:var(--acl-font-cn); font-weight:700;
          margin-left:4px; color:rgba(22,21,15,.5); }
        .acl-cr__r--focus{ background:var(--acl-ink); transform:scale(1.02); z-index:2;
          box-shadow:8px 10px 0 rgba(22,21,15,.26); }
        .acl-cr__r--focus .acl-cr__rk{ color:rgba(255,255,255,.6); }
        .acl-cr__r--focus .acl-cr__rv{ color:var(--acl-yellow); }
        .acl-cr__r--focus .acl-cr__rv em{ color:rgba(255,255,255,.55); }
        .acl-cr__r--dim{ opacity:.5; }
        .acl-cr__rfx{ position:absolute; top:-15px; right:-8px; z-index:4; }

        /* client tag strip */
        .acl-cr__clients{ margin-top:auto; padding-top:22px; }
        .acl-cr__ctitle{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-bottom:11px; display:flex; align-items:center; gap:10px; }
        .acl-cr__chips{ display:flex; flex-wrap:wrap; gap:11px; }
        .acl-cr__chip{ font-family:var(--acl-font-cn); font-weight:900; font-size:22px; line-height:1;
          padding:11px 18px; border:3px solid var(--acl-ink); background:var(--acl-paper);
          box-shadow:4px 5px 0 rgba(22,21,15,.14); display:flex; align-items:center; gap:10px; }
        .acl-cr__chip i{ width:14px; height:14px; border-radius:50%; flex:0 0 auto; }

        .acl-cr__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cr__r{ animation:acl-cr-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); }
          [data-deck-active] .acl-cr__meter{ animation:acl-cr-pop .55s cubic-bezier(.2,.8,.2,1) .2s both; }
          [data-deck-active] .acl-cr__units i.on{ animation:acl-cr-lit .4s ease both;
            animation-delay:calc(var(--u,0) * .012s + .4s); }
        }
        @keyframes acl-cr-rise{ from{ opacity:0; transform:translateX(16px); } to{ opacity:1; } }
        @keyframes acl-cr-pop{ from{ opacity:0; transform:translateY(16px) scale(.97); } to{ opacity:1; transform:none; } }
        @keyframes acl-cr-lit{ from{ opacity:.2; } to{ opacity:1; } }
      `}</style>

      <div className="acl-cr__top">
        <div className="acl-cr__eyebrow">{eyebrow}</div>
        <div className="acl-cr__rule" />
        <div className="acl-cr__kicker">{kicker}</div>
      </div>

      <div className="acl-cr__head">
        <h1 className="acl-cr__h">{headline}</h1>
        <div className="acl-cr__sub">{tag}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-cr__body">
        {/* ── left: vertical rack stack ── */}
        <div className="acl-cr__stack">
          {slots.length === 0 && <div className="acl-cr__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-cr__slot" key={i} style={{ left: s.l, top: s.t, zIndex: i + 1 }}>
              <AdaptiveImageSlot id={'cr-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                placeholder={company}
                sticker={{ label: company, sub: 'RACK ' + String(i + 1).padStart(2, '0'),
                  color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && slots.length > 0 && (
            <Doodle kind="arrow" size={78} rotate={20} color="var(--acl-ink)" style={{ right: -18, top: '42%' }} />
          )}
        </div>

        {/* ── right: data column ── */}
        <div className="acl-cr__right">
          <div className="acl-cr__plate">
            <span className="acl-cr__co">{company}</span>
            <span className="acl-cr__cotag">{tag}</span>
          </div>
          <div className="acl-cr__cap" dangerouslySetInnerHTML={{ __html: caption }} />

          {showMeter && (
            <div className="acl-cr__meter">
              {showDecor && <div className="acl-cr__mtag"><Sticker label="算力" sub="CAPACITY" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={5} size={13} /></div>}
              <div className="acl-cr__mhead">
                <div className="acl-cr__mk">{meterLabel}</div>
                <div className="acl-cr__mv">{meterValue}<em>{meterUnit}</em></div>
              </div>
              <div className="acl-cr__units">
                {Array.from({ length: meterUnits }).map((_, k) => (
                  <i key={k} className={k < litUnits ? 'on' : ''} style={{ '--u': k }} />
                ))}
              </div>
            </div>
          )}

          <div className="acl-cr__rows">
            {rows.map((m, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-cr__r' + (isF ? ' acl-cr__r--focus' : '') + (dim ? ' acl-cr__r--dim' : '')} style={{ '--i': i }}>
                  {isF && showDecor && <div className="acl-cr__rfx"><Sticker label="看点" color="var(--acl-yellow)" rotate={6} size={13} /></div>}
                  <span className="acl-cr__rbar" style={{ background: isF ? 'var(--acl-yellow)' : accents[i % accents.length] }} />
                  <span className="acl-cr__rk">{m.k}</span>
                  <span className="acl-cr__rv">{m.v}{m.unit && <em>{m.unit}</em>}</span>
                </div>
              );
            })}
          </div>

          <div className="acl-cr__clients">
            <div className="acl-cr__ctitle">
              {clientsTitle}
              {showDecor && <Doodle kind="arrowS" size={28} rotate={-12} style={{ position: 'static' }} />}
            </div>
            <div className="acl-cr__chips">
              {chips.map((c, i) => (
                <span className="acl-cr__chip" key={i}><i style={{ background: accents[i % accents.length] }} />{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="acl-cr__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// count-driven vertical stack presets — stage ≈ 620×770, each slot self-sizes.
const stack = {
  0: [],
  1: [
    { l: 70, t: 70, box: 470, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
  ],
  2: [
    { l: 14, t: 20, box: 360, r: -3, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)' },
    { l: 250, t: 380, box: 350, r: 4, ratio: 0.86, sr: 4, color: 'var(--acl-blue)' },
  ],
  3: [
    { l: 8, t: 4, box: 320, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
    { l: 300, t: 220, box: 290, r: 4, ratio: 0.82, sr: 4, color: 'var(--acl-blue)' },
    { l: 56, t: 460, box: 320, r: 3, ratio: 1.12, sr: -3, color: 'var(--acl-pink)' },
  ],
  4: [
    { l: 0, t: 0, box: 290, r: -4, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)' },
    { l: 300, t: 150, box: 270, r: 4, ratio: 0.82, sr: 4, color: 'var(--acl-blue)' },
    { l: 30, t: 380, box: 280, r: 3, ratio: 1.12, sr: -3, color: 'var(--acl-pink)' },
    { l: 318, t: 470, box: 260, r: -3, ratio: 0.86, sr: 5, color: 'var(--acl-red)' },
  ],
};

Page65Infra.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 3,
  metricCount: 2,
  tagCount: 3,
  showMeter: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'CoreWeave Case',
  kicker: '案例卡',
  headline: '算力基础设施',
  company: 'CoreWeave',
  tag: 'GPU 云',
  caption: 'CoreWeave 代表算力基础设施的 <b>确定性机会</b>——当模型公司都在抢 GPU，算力供应商获得资本溢价。',
  meterLabel: 'GPU 资源储备',
  meterValue: '7.8',
  meterUnit: '万张',
  meterFill: 0.78,
  meterUnits: 48,
  metrics: [
    { k: '最大单笔融资', v: '110', unit: '亿' },
    { k: '估值', v: '190', unit: '亿' },
    { k: '在管集群', v: '32', unit: '座' },
  ],
  clientsTitle: '主要客户',
  clients: ['模型公司', '生成式内容', '企业推理', '研究机构'],
  closingLine: '卖铲子的人，也能成为核心资产。',
};

Page65Infra.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '左侧竖向堆叠图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '右侧指标阶梯行数量(2–4)' },
  { key: 'tagCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '标签数量', desc: '底部客户标签数量(2–4)' },
  { key: 'showMeter', type: 'boolean', default: true,
    label: '容量计量', desc: '资源容量计量条(单元格 + 大数字) 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一条指标行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'metricCount', step: 1,
    label: '重点对象', desc: '被突出的指标行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page65Infra.defaults;
export const controls = Page65Infra.controls;
