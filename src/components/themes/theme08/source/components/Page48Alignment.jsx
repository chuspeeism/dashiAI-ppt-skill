// Page48Alignment.jsx — "Feature Poster + Safety Ledger" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ma-`.
// A NEW image layout: a dark magazine-style FEATURE PANEL holding a dominant
// AdaptiveImage (resizes to its photo's ratio) with bold overlaid type + sticker
// stamps and 0–2 inset photos, faced by a vertical SAFETY LEDGER of tools with
// check-dot strength ratings + a hero figure. One ledger row focusable.
// Portable ESM — no Tweaks dependency; all CSS prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page48Alignment(props) {
  const p = { ...Page48Alignment.defaults, ...props };
  const {
    backgroundTheme, mediaCount, posterStamp, rowCount, showRating, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, posterWord, hero, ledgerTitle,
    rows, valueUnit, metrics, feature, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const count = Math.max(0, Math.min(3, mediaCount));
  const feat = (feature[count] || []);
  const ledger = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, ledger.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const maxV = Math.max(...ledger.map((r) => r.v));

  return (
    <div className="acl-root acl-ma" style={{ background: bg }}>
      <style>{`
        .acl-ma{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 100px 58px; display:flex; flex-direction:column; }
        .acl-ma__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-ma__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ma__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-ma__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ma__summary{ margin-left:auto; max-width:470px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-ma__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-ma__body{ flex:1; display:flex; gap:40px; margin-top:26px; min-height:0; }

        /* feature poster (left) */
        .acl-ma__poster{ flex:1; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:9px 11px 0 rgba(22,21,15,.2); overflow:hidden;
          display:flex; align-items:center; justify-content:center; min-width:0; }
        .acl-ma__word{ position:absolute; left:-2px; bottom:-26px; z-index:1; font-family:var(--acl-font-num);
          font-size:230px; line-height:.7; color:rgba(255,255,255,.07); letter-spacing:-.02em;
          white-space:nowrap; pointer-events:none; }
        .acl-ma__featmain{ position:relative; z-index:3; }
        .acl-ma__inset{ position:absolute; z-index:4; }
        .acl-ma__ptag{ position:absolute; left:24px; top:22px; z-index:5; font-family:var(--acl-font-mono);
          font-size:14px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.6); }
        .acl-ma__stamp{ position:absolute; right:26px; top:26px; z-index:6; }
        .acl-ma__posteremptyt{ position:relative; z-index:3; text-align:center; }
        .acl-ma__posteremptyt .pe1{ font-family:var(--acl-font-hand); font-size:38px; color:rgba(255,255,255,.55); }

        /* safety ledger (right) */
        .acl-ma__ledger{ flex:0 0 600px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 38px 28px; display:flex; flex-direction:column; }
        .acl-ma__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-ma__hero{ display:flex; align-items:flex-end; gap:18px; margin-top:16px; }
        .acl-ma__heronum{ font-family:var(--acl-font-num); font-size:140px; line-height:.74; }
        .acl-ma__heronum em{ font-style:normal; font-size:36px; margin-left:2px; }
        .acl-ma__herolabel{ font-weight:700; font-size:20px; color:rgba(22,21,15,.6); padding-bottom:16px; }
        .acl-ma__ledgerhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin:22px 0 4px;
          border-bottom:3px solid var(--acl-ink); padding-bottom:11px; }
        .acl-ma__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-ma__row{ flex:1; display:grid; grid-template-columns:1fr auto auto; align-items:center; gap:22px;
          border-bottom:1.5px dashed rgba(22,21,15,.22); position:relative; transition:background .25s, opacity .25s; }
        .acl-ma__row:last-child{ border-bottom:none; }
        .acl-ma__rname{ font-weight:900; font-size:30px; line-height:1.02; }
        .acl-ma__rname small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:3px; }
        .acl-ma__rval{ font-family:var(--acl-font-num); font-size:50px; line-height:.78; text-align:right; }
        .acl-ma__rval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }
        .acl-ma__dots{ display:flex; gap:5px; min-width:74px; justify-content:flex-end; }
        .acl-ma__dot{ width:17px; height:17px; border-radius:50%; border:2px solid var(--acl-ink); }
        .acl-ma__row--focus{ background:var(--acl-yellow);
          box-shadow:6px 0 0 var(--acl-yellow), -6px 0 0 var(--acl-yellow); border-bottom-color:transparent; z-index:2; }
        .acl-ma__row--dim{ opacity:.5; }
        .acl-ma__fx{ position:absolute; top:-13px; right:0; z-index:6; }
        .acl-ma__tiles{ display:flex; gap:14px; margin-top:16px; border-top:2px dashed rgba(22,21,15,.2); padding-top:16px; }
        .acl-ma__tile{ flex:1; }
        .acl-ma__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-ma__tile .v{ font-family:var(--acl-font-num); font-size:44px; line-height:.96; margin-top:2px; }
        .acl-ma__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }

        .acl-ma__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:12px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ma__poster{ animation:acl-ma-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-ma__ledger{ animation:acl-ma-rise .55s cubic-bezier(.2,.8,.2,1) .08s both; }
          [data-deck-active] .acl-ma__inset{ animation:acl-ma-pop .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .3s); }
          [data-deck-active] .acl-ma__row{ animation:acl-ma-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); }
        }
        @keyframes acl-ma-rise{ from{ opacity:0; transform:translateY(18px); } }
        @keyframes acl-ma-pop{ from{ opacity:0; transform:scale(.8); } }
        @keyframes acl-ma-in{ from{ opacity:0; transform:translateX(18px); } }
      `}</style>

      <div className="acl-ma__head">
        <div>
          <div className="acl-ma__eyebrow">{eyebrow}</div>
          <h1 className="acl-ma__h">{headline}</h1>
        </div>
        <div className="acl-ma__sub">{subheadline}</div>
        <div className="acl-ma__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ma__body">
        {/* ── feature poster ── */}
        <div className="acl-ma__poster">
          <div className="acl-ma__word">{posterWord}</div>
          <div className="acl-ma__ptag">Feature · 安全评测</div>
          {count === 0 ? (
            <div className="acl-ma__posteremptyt">
              <div className="pe1">// 图片数量 = 0</div>
            </div>
          ) : (
            <div className="acl-ma__featmain">
              <AdaptiveImageSlot id="alignment-0" box={feat[0].box} rotate={feat[0].r} ratio={feat[0].ratio}
                accent="var(--acl-paper)" placeholder="安全评测主图"
                sticker={{ label: '可信 AI', sub: 'TRUST', color: 'var(--acl-yellow)', subColor: 'var(--acl-ink)', rotate: -3 }} />
            </div>
          )}
          {feat.slice(1).map((f, i) => (
            <div key={i} className="acl-ma__inset" style={{ left: f.l, top: f.t, '--i': i + 1 }}>
              <AdaptiveImageSlot id={'alignment-' + (i + 1)} box={f.box} rotate={f.r} ratio={f.ratio}
                accent="var(--acl-paper)" placeholder={f.label}
                sticker={{ label: f.label, color: f.color, subColor: 'var(--acl-ink)', rotate: f.sr }} />
            </div>
          ))}
          {posterStamp && showDecor && count > 0 && (
            <div className="acl-ma__stamp"><Sticker label="长期资本" sub="LONG-TERM" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={6} size={15} /></div>
          )}
          {showDecor && (
            <Doodle kind="spark" size={46} rotate={-10} fill="var(--acl-yellow)" stroke="var(--acl-paper)" style={{ left: 30, bottom: 90, zIndex: 5 }} />
          )}
        </div>

        {/* ── safety ledger ── */}
        <div className="acl-ma__ledger">
          <div className="acl-ma__badge">▣ {badge}</div>
          <div className="acl-ma__hero">
            <div className="acl-ma__heronum">{hero.value}<em>{hero.unit}</em></div>
            <div className="acl-ma__herolabel">{hero.label}</div>
          </div>
          <div className="acl-ma__ledgerhd">{ledgerTitle} · Safety Ledger{showRating ? ' · 能力强度' : ''}</div>
          <div className="acl-ma__rows">
            {ledger.map((r, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-ma__row' + (isF ? ' acl-ma__row--focus' : (dim ? ' acl-ma__row--dim' : ''))} style={{ '--i': i }}>
                  {isF && showDecor && <div className="acl-ma__fx"><Sticker label="信任入口" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={5} size={13} /></div>}
                  <div className="acl-ma__rname">{r.k}<small>{r.en}</small></div>
                  <div className="acl-ma__rval">{r.v}<em>{valueUnit}</em></div>
                  {showRating && (
                    <div className="acl-ma__dots">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="acl-ma__dot" style={{ background: d < r.rate ? (isF ? 'var(--acl-pink)' : 'var(--acl-ink)') : 'transparent' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="acl-ma__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-ma__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-ma__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page48Alignment.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 2,           // 0–3 feature photos (1 main + up to 2 insets)
  posterStamp: true,       // "长期资本" stamp on poster
  rowCount: 3,             // 2–4 safety-tool ledger rows
  showRating: true,        // check-dot strength column
  metricCount: 2,          // 2–3 ledger metric tiles
  focusEnabled: true,
  focusIndex: 0,           // highlight 评测平台 by default
  showDecor: true,
  eyebrow: 'Model Alignment',
  headline: '安全与对齐工具',
  subheadline: '模型安全公司',
  summary: '模型安全与对齐公司吸引<b>长期资本</b>关注。',
  badge: 'Alignment · 安全台账',
  posterWord: 'SAFE',
  hero: { label: '赛道融资额', value: '21', unit: '亿' },
  ledgerTitle: '安全能力',
  valueUnit: '亿',
  // safety tools — text not parameterized (count via rowCount)
  rows: [
    { k: '评测平台', en: 'Evaluation', v: 8, rate: 3 },
    { k: '对齐工具', en: 'Alignment', v: 7, rate: 3 },
    { k: '红队服务', en: 'Red Teaming', v: 6, rate: 2 },
    { k: '审计追溯', en: 'Audit Trail', v: 3, rate: 2 },
  ],
  metrics: [
    { k: '事件数', v: '5', unit: '笔' },
    { k: '平均单笔', v: '4.2', unit: '亿' },
    { k: '评测占比', v: '38', unit: '%' },
  ],
  // count-driven feature presets — poster ≈ 980×740; main resizes to ratio.
  feature: {
    0: [],
    1: [
      { box: 600, r: -2, ratio: 1.1 },
    ],
    2: [
      { box: 560, r: -2, ratio: 1.05 },
      { l: 600, t: 430, box: 240, r: 5, ratio: 0.85, sr: 4, color: 'var(--acl-blue)', label: '对齐' },
    ],
    3: [
      { box: 520, r: -2, ratio: 1.0 },
      { l: 30, t: 30, box: 220, r: -5, ratio: 0.82, sr: -4, color: 'var(--acl-blue)', label: '对齐' },
      { l: 600, t: 450, box: 220, r: 5, ratio: 1.0, sr: 4, color: 'var(--acl-pink)', label: '红队' },
    ],
  },
  closingLine: '可信 AI 会成为企业级 AI 的基础设施。',
};

Page48Alignment.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '特写图片数量(0–3，1 主图 + 至多 2 张嵌套图)；每张按上传图片比例自适应' },
  { key: 'posterStamp', type: 'boolean', default: true,
    label: '海报印章', desc: '海报上「长期资本」印章贴纸 显隐' },
  { key: 'rowCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '行数', desc: '安全能力台账行数(2–4)' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '强度列', desc: '能力强度评级圆点列 显隐' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '台账底部支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page48Alignment.defaults;
export const controls = Page48Alignment.controls;
