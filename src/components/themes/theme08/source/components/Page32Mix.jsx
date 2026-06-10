// Page32Mix.jsx — "Scene Split + Photo" template page (chart + image combo)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-mxs-`.
// LEFT a share chart (donut or bars) of scene segments with a hero figure and a
// count-driven legend; one segment can be focused. RIGHT a count-driven collage
// of AdaptiveImageSlots (0–3) that resize to their uploaded photo's ratio.
// Fully portable — no dependency on the Tweaks panel; all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page32Mix(props) {
  const p = { ...Page32Mix.defaults, ...props };
  const {
    backgroundTheme, mediaCount, chartType, segmentCount, showValueLabels, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, hero, segments, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = segments.slice(0, Math.max(3, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const slots = collage[mediaCount] || [];
  const palette = ['var(--acl-ink)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-yellow)'];

  // ── donut geometry ──
  const R = 38, C = 2 * Math.PI * R;
  let acc = 0;
  const arcs = segs.map((s, i) => {
    const frac = s.v / 100;
    const seg = { dash: frac * C, gap: C - frac * C, offset: -acc * C, color: palette[i % palette.length] };
    acc += frac;
    return seg;
  });
  const maxBar = Math.max(...segs.map((s) => s.v));

  return (
    <div className="acl-root acl-mxs" style={{ background: bg }}>
      <style>{`
        .acl-mxs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-mxs__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-mxs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-mxs__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-mxs__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-mxs__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-mxs__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-mxs__body{ flex:1; display:flex; gap:40px; margin-top:28px; min-height:0; }
        .acl-mxs__panel{ flex:0 0 760px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:28px 38px 26px; display:flex; flex-direction:column; }
        .acl-mxs__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-mxs__chartrow{ flex:1; display:flex; align-items:center; gap:34px; margin-top:18px; min-height:0; }

        /* donut */
        .acl-mxs__donut{ flex:0 0 320px; position:relative; }
        .acl-mxs__donutsvg{ width:320px; height:320px; display:block; }
        .acl-mxs__center{ position:absolute; inset:0; display:flex; flex-direction:column;
          align-items:center; justify-content:center; text-align:center; }
        .acl-mxs__center .cl{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-mxs__center .cv{ font-family:var(--acl-font-num); font-size:88px; line-height:.82; }
        .acl-mxs__center .cu{ font-family:var(--acl-font-cn); font-weight:700; font-size:18px; opacity:.62; }

        /* legend / bars */
        .acl-mxs__legend{ flex:1; display:flex; flex-direction:column; gap:0; min-width:0; }
        .acl-mxs__leg{ display:flex; align-items:center; gap:14px; padding:14px 4px;
          border-bottom:1.5px dashed rgba(22,21,15,.22); transition:.25s; }
        .acl-mxs__leg:last-child{ border-bottom:none; }
        .acl-mxs__swatch{ width:22px; height:22px; border:2.5px solid var(--acl-ink); flex:0 0 auto; }
        .acl-mxs__legname{ flex:1; font-weight:700; font-size:25px; }
        .acl-mxs__legname small{ display:block; font-family:var(--acl-font-mono); font-weight:400;
          font-size:12px; letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.46); margin-top:1px; }
        .acl-mxs__legval{ font-family:var(--acl-font-num); font-size:46px; line-height:.85; }
        .acl-mxs__legval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px; opacity:.55; }
        .acl-mxs__leg--focus{ background:var(--acl-ink); color:var(--acl-paper); margin:0 -12px; padding:14px 12px; border-bottom-color:transparent; }
        .acl-mxs__leg--focus .acl-mxs__legname small{ color:rgba(255,255,255,.5); }
        .acl-mxs__leg--dim{ opacity:.42; }

        /* horizontal bars variant */
        .acl-mxs__bars{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:20px; min-width:0; }
        .acl-mxs__brow{ display:flex; align-items:center; gap:16px; transition:.25s; }
        .acl-mxs__brow .bn{ flex:0 0 132px; font-weight:700; font-size:24px; }
        .acl-mxs__btrack{ flex:1; height:36px; background:rgba(22,21,15,.1); border:2.5px solid var(--acl-ink); position:relative; }
        .acl-mxs__bfill{ position:absolute; inset:0 auto 0 0; border-right:2.5px solid var(--acl-ink); }
        .acl-mxs__bval{ flex:0 0 auto; font-family:var(--acl-font-num); font-size:40px; line-height:.85; }
        .acl-mxs__bval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px; opacity:.55; }
        .acl-mxs__brow--dim{ opacity:.42; }

        /* collage stage */
        .acl-mxs__stage{ flex:1; position:relative; min-width:0; }
        .acl-mxs__slot{ position:absolute; }
        .acl-mxs__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }
        .acl-mxs__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-mxs__panel{ animation:acl-mxs-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-mxs__arc{ animation:acl-mxs-draw 1s ease both; }
          [data-deck-active] .acl-mxs__bfill{ animation:acl-mxs-grow .7s cubic-bezier(.2,.8,.2,1) .3s both; }
        }
        @keyframes acl-mxs-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-mxs-draw{ from{ stroke-dashoffset:var(--c); } }
        @keyframes acl-mxs-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:scaleX(1); } }
      `}</style>

      <div className="acl-mxs__head">
        <div>
          <div className="acl-mxs__eyebrow">{eyebrow}</div>
          <h1 className="acl-mxs__h">{headline}</h1>
        </div>
        <div className="acl-mxs__sub">{subheadline}</div>
        <div className="acl-mxs__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-mxs__body">
        {/* ── share chart panel ── */}
        <div className="acl-mxs__panel">
          <div className="acl-mxs__badge">◷ {hero.badge}</div>
          {showDecor && (
            <Doodle kind="spark" size={48} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ right: 26, top: 24 }} />
          )}
          <div className="acl-mxs__chartrow">
            {chartType === 'donut' ? (
              <React.Fragment>
                <div className="acl-mxs__donut">
                  <svg className="acl-mxs__donutsvg" viewBox="0 0 100 100">
                    <g transform="rotate(-90 50 50)">
                      {arcs.map((a, i) => {
                        const isF = focusEnabled && i === fIdx;
                        const dim = focusEnabled && !isF;
                        return (
                          <circle key={i} className="acl-mxs__arc" cx="50" cy="50" r={R} fill="none"
                            stroke={a.color} strokeWidth={isF ? 20 : 15}
                            strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={a.offset}
                            opacity={dim ? 0.4 : 1} style={{ '--c': a.dash }} />
                        );
                      })}
                      <circle cx="50" cy="50" r={R} fill="none" stroke="var(--acl-ink)" strokeWidth="0.8" opacity="0.25" />
                    </g>
                  </svg>
                  <div className="acl-mxs__center">
                    <div className="cl">{hero.label}</div>
                    <div className="cv">{hero.value}</div>
                    <div className="cu">{hero.unit}</div>
                  </div>
                </div>
                <div className="acl-mxs__legend">
                  {segs.map((s, i) => {
                    const isF = focusEnabled && i === fIdx;
                    const dim = focusEnabled && !isF;
                    return (
                      <div key={i} className={'acl-mxs__leg' + (isF ? ' acl-mxs__leg--focus' : '') + (dim ? ' acl-mxs__leg--dim' : '')}>
                        <span className="acl-mxs__swatch" style={{ background: palette[i % palette.length] }} />
                        <div className="acl-mxs__legname">{s.k}<small>{s.en}</small></div>
                        {showValueLabels && <div className="acl-mxs__legval">{s.v}<em>%</em></div>}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ) : (
              <div className="acl-mxs__bars">
                {segs.map((s, i) => {
                  const isF = focusEnabled && i === fIdx;
                  const dim = focusEnabled && !isF;
                  return (
                    <div key={i} className={'acl-mxs__brow' + (dim ? ' acl-mxs__brow--dim' : '')}>
                      <div className="bn">{s.k}</div>
                      <div className="acl-mxs__btrack">
                        <div className="acl-mxs__bfill" style={{ right: `${100 - (s.v / maxBar) * 100}%`,
                          background: isF ? 'var(--acl-pink)' : palette[i % palette.length] }} />
                      </div>
                      {showValueLabels && <div className="acl-mxs__bval">{s.v}<em>%</em></div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── adaptive image collage ── */}
        <div className="acl-mxs__stage">
          {slots.length === 0 && <div className="acl-mxs__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-mxs__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'finance-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'金融场景 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <div style={{ position: 'absolute', right: 4, top: 8, zIndex: 4, transform: 'rotate(-6deg)' }}>
                <Sticker label="强监管" sub="REGULATED" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={20} />
              </div>
              <Doodle kind="arrow" size={88} rotate={118} color="var(--acl-ink)" style={{ left: -6, top: '44%' }} />
              <Doodle kind="spark" size={42} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 36, bottom: 130 }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-mxs__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page32Mix.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 2,           // 0–3 adaptive image slots
  chartType: 'donut',      // donut | bars
  segmentCount: 4,         // 3–4 scene segments
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 0,           // 投研
  showDecor: true,
  eyebrow: 'Finance AI',
  headline: '投研、风控与合规',
  subheadline: '金融 AI 赛道',
  summary: '金融 AI 聚焦<b>投研、风控、合规</b>和客户服务。',
  hero: { badge: '场景占比 · Scene Split', label: '赛道融资额', value: '22', unit: '亿美元' },
  segments: [
    { k: '投研', en: 'Research', v: 31 },
    { k: '合规', en: 'Compliance', v: 28 },
    { k: '风控', en: 'Risk Control', v: 24 },
    { k: '客户服务', en: 'Service', v: 17 },
  ],
  // count-driven collage presets — stage ≈ 900×720; slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 200, t: 70, box: 540, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)', label: '金融场景', sub: 'DESK' },
    ],
    2: [
      { l: 16, t: 6, box: 470, r: -4, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)', label: '投研场景', sub: 'DESK' },
      { l: 440, t: 288, box: 452, r: 4, ratio: 0.84, sr: 3, color: 'var(--acl-blue)', label: '风控看板', sub: 'RISK' },
    ],
    3: [
      { l: 250, t: 0, box: 400, r: 3, ratio: 0.92, sr: -4, color: 'var(--acl-yellow)', label: '投研场景', sub: 'DESK' },
      { l: 0, t: 244, box: 366, r: -5, ratio: 1.2, sr: 4, color: 'var(--acl-blue)', label: '风控看板', sub: 'RISK' },
      { l: 470, t: 400, box: 348, r: 5, ratio: 0.82, sr: -3, color: 'var(--acl-pink)', label: '合规流程', sub: 'COMPLY' },
    ],
  },
  closingLine: '高价值行业需要更强可信度。',
};

Page32Mix.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'chartType', type: 'enum', default: 'donut', options: ['donut', 'bars'],
    label: '图表类型', desc: '占比图：环形 / 条形' },
  { key: 'segmentCount', type: 'number', default: 4, min: 3, max: 4, step: 1,
    label: '分段数量', desc: '场景占比分段数量(3–4)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各分段百分比标签的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个分段(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的分段序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page32Mix.defaults;
export const controls = Page32Mix.controls;
