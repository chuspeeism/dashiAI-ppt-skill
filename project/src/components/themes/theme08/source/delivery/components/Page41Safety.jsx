// Page41Safety.jsx — "Defense Perimeter" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-sf-`.
// A NEW chart layout: a count-driven DEFENSE-PERIMETER diagram that toggles
// between concentric rings (nested layers of defense) and a narrowing GATE
// funnel (stacked checkpoint bands). Paired with a count-driven module panel of
// focusable safety-module rows + supporting metric tiles. The hero figure sits
// at the perimeter core. No dependency on the Tweaks panel — portable ESM, prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page41Safety(props) {
  const p = { ...Page41Safety.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, hero, metrics,
    segments, valueUnit, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = segments.slice(0, Math.max(3, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const maxSeg = Math.max(...segs.map((s) => s.v));
  const palette = ['var(--acl-yellow)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-paper)', 'var(--acl-red)'];
  const ringColor = (i, isF) => (isF ? 'var(--acl-pink)' : palette[i % palette.length]);

  const STAGE = 470;          // perimeter stage size (px)
  const n = segs.length;
  const pieTotal = segs.reduce((sum, s) => sum + s.v, 0) || 1;
  let pieAcc = 0;
  const pieStops = segs.map((s, i) => {
    const a = (pieAcc / pieTotal) * 100; pieAcc += s.v; const b = (pieAcc / pieTotal) * 100;
    return `${ringColor(i, focusEnabled && i === fIdx)} ${a}% ${b}%`;
  }).join(',');

  return (
    <div className="acl-root acl-sf" style={{ background: bg }}>
      <style>{`
        .acl-sf{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 68px; display:flex; flex-direction:column; }
        .acl-sf__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-sf__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-sf__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-sf__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-sf__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-sf__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-sf__body{ flex:1; display:flex; gap:44px; margin-top:30px; min-height:0; }

        /* ── left: perimeter chart card (dark) ── */
        .acl-sf__chart{ flex:0 0 730px; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 34px 28px; display:flex; flex-direction:column; min-width:0; }
        .acl-sf__chartt{ font-family:var(--acl-font-mono); font-weight:700; font-size:15px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.55); }
        .acl-sf__stage{ flex:1; display:flex; align-items:center; justify-content:center; min-height:0;
          position:relative; }

        /* rings variant */
        .acl-sf__rings{ position:relative; width:${STAGE}px; height:${STAGE}px; }
        .acl-sf__ring{ position:absolute; left:50%; top:50%; border-radius:50%;
          transform:translate(-50%,-50%); display:flex; align-items:flex-start; justify-content:center; }
        .acl-sf__rlabel{ transform:translateY(-52%); font-family:var(--acl-font-mono); font-weight:700;
          font-size:14px; letter-spacing:.04em; text-transform:uppercase; color:var(--acl-ink);
          padding:4px 10px; white-space:nowrap; line-height:1; box-shadow:2px 2px 0 rgba(0,0,0,.3); }
        .acl-sf__rval{ font-family:var(--acl-font-cn); font-weight:400; margin-left:7px; opacity:.7; }
        .acl-sf__core{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          text-align:center; }
        .acl-sf__corelabel{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(255,255,255,.55); }
        .acl-sf__corenum{ font-family:var(--acl-font-num); font-size:104px; line-height:.82; color:var(--acl-yellow); }
        .acl-sf__corenum em{ font-style:normal; font-size:30px; margin-left:3px; color:var(--acl-paper); }

        /* gate (funnel) variant */
        .acl-sf__gate{ width:100%; display:flex; flex-direction:column; align-items:center; gap:12px;
          padding:6px 0; }
        .acl-sf__band{ height:62px; display:flex; align-items:center; justify-content:space-between;
          padding:0 26px; border:3px solid var(--acl-ink); color:var(--acl-ink); visibility:visible;
          transition:opacity .25s, background .25s; }
        .acl-sf__band .bn{ font-weight:900; font-size:26px; }
        .acl-sf__band .bn small{ font-family:var(--acl-font-mono); font-weight:400; font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; opacity:.6; margin-left:9px; }
        .acl-sf__band .bv{ font-family:var(--acl-font-num); font-size:38px; line-height:.8; }
        .acl-sf__band .bv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }
        .acl-sf__gatecore{ margin-top:6px; font-family:var(--acl-font-num); font-size:30px;
          color:var(--acl-yellow); letter-spacing:.02em; }
        .acl-sf__pie{ width:360px; height:360px; border-radius:50%; position:relative;
          box-shadow:6px 8px 0 rgba(0,0,0,.32); }
        .acl-sf__piehole{ position:absolute; inset:104px; border-radius:50%; background:var(--acl-ink);
          display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
          box-shadow:0 0 0 5px rgba(251,250,244,.14); }
        .acl-sf__pie .acl-sf__corenum{ font-size:74px; }
        .acl-sf__rlegend{ display:grid; grid-template-columns:1fr 1fr; gap:10px 24px; margin-top:16px;
          border-top:2px dashed rgba(255,255,255,.18); padding-top:16px; flex:0 0 auto; }
        .acl-sf__rlrow{ display:flex; align-items:center; gap:11px; font-weight:900; font-size:21px; }
        .acl-sf__rlrow i{ width:18px; height:18px; border-radius:50%; flex:0 0 auto;
          box-shadow:0 0 0 2px rgba(255,255,255,.25); }
        .acl-sf__rlrow em{ font-style:normal; font-family:var(--acl-font-num); font-size:26px;
          color:var(--acl-yellow); margin-left:auto; }
        .acl-sf__rlrow--dim{ opacity:.5; }

        /* ── right: module panel ── */
        .acl-sf__panel{ flex:1; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 38px 28px; display:flex; flex-direction:column; min-width:0; }
        .acl-sf__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-sf__modhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin:22px 0 12px; }
        .acl-sf__mods{ display:flex; flex-direction:column; flex:1; }
        .acl-sf__mod{ flex:1; display:grid; grid-template-columns:30px 1fr auto; align-items:center; gap:15px;
          padding:6px 0; border-bottom:1.5px dashed rgba(22,21,15,.2); visibility:visible;
          transition:opacity .25s, background .25s; }
        .acl-sf__mod:last-child{ border-bottom:none; }
        .acl-sf__mdot{ width:22px; height:22px; border:3px solid var(--acl-ink); border-radius:50%; }
        .acl-sf__mbody{ min-width:0; }
        .acl-sf__mname{ font-weight:900; font-size:25px; line-height:1.05; }
        .acl-sf__mname small{ font-family:var(--acl-font-mono); font-weight:400; font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-left:9px; }
        .acl-sf__mtrack{ height:14px; margin-top:7px; background:rgba(22,21,15,.1);
          border:2px solid var(--acl-ink); position:relative; overflow:hidden; }
        .acl-sf__mfill{ position:absolute; inset:0 auto 0 0; }
        .acl-sf__mval{ font-family:var(--acl-font-num); font-size:42px; line-height:.8; white-space:nowrap;
          min-width:96px; text-align:right; }
        .acl-sf__mval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; opacity:.6; }
        .acl-sf__mod--dim{ opacity:.42; }
        .acl-sf__mod--focus .acl-sf__mname{ color:var(--acl-ink); }

        .acl-sf__tiles{ display:flex; gap:14px; margin-top:18px; border-top:2px dashed rgba(22,21,15,.2);
          padding-top:18px; }
        .acl-sf__tile{ flex:1; }
        .acl-sf__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-sf__tile .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.96; margin-top:2px; }
        .acl-sf__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }

        .acl-sf__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-sf__chart,[data-deck-active] .acl-sf__panel{
            animation:acl-sf-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-sf__panel{ animation-delay:.08s; }
          [data-deck-active] .acl-sf__ring{ animation:acl-sf-pop .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .2s); }
          [data-deck-active] .acl-sf__band{ animation:acl-sf-wipe .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .2s); transform-origin:center; }
          [data-deck-active] .acl-sf__mfill{ animation:acl-sf-grow .7s cubic-bezier(.2,.8,.2,1) .35s both; }
        }
        @keyframes acl-sf-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-sf-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.6); }
          to{ opacity:1; transform:translate(-50%,-50%) scale(1); } }
        @keyframes acl-sf-wipe{ from{ opacity:0; transform:scaleX(.4); } to{ opacity:1; transform:none; } }
        @keyframes acl-sf-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:none; } }
      `}</style>

      <div className="acl-sf__head">
        <div>
          <div className="acl-sf__eyebrow">{eyebrow}</div>
          <h1 className="acl-sf__h">{headline}</h1>
        </div>
        <div className="acl-sf__sub">{subheadline}</div>
        <div className="acl-sf__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-sf__body">
        {/* ── perimeter chart ── */}
        <div className="acl-sf__chart">
          <div className="acl-sf__chartt">安全防线 · Defense Perimeter</div>
          {showDecor && (
            <Doodle kind="spark" size={44} rotate={-10} fill="var(--acl-yellow)" stroke="var(--acl-paper)"
              style={{ right: 26, top: 20 }} />
          )}
          <div className="acl-sf__stage">
            {chartType === 'pie' ? (
              <div className="acl-sf__pie" style={{ background: `conic-gradient(${pieStops})` }}>
                <div className="acl-sf__piehole">
                  <div className="acl-sf__corelabel">{hero.label}</div>
                  <div className="acl-sf__corenum">{hero.value}<em>{hero.unit}</em></div>
                </div>
              </div>
            ) : (
              <div className="acl-sf__gate">
                {segs.map((s, i) => {
                  const isF = focusEnabled && i === fIdx;
                  const c = ringColor(i, isF);
                  const wpct = 96 - i * (54 / Math.max(1, n)); // funnel narrowing
                  return (
                    <div key={i} className="acl-sf__band" style={{ '--i': i, width: `${wpct}%`,
                      background: c, color: c === 'var(--acl-ink)' ? 'var(--acl-paper)' : 'var(--acl-ink)',
                      opacity: focusEnabled && !isF ? 0.5 : 1 }}>
                      <span className="bn">{s.k}<small>{s.en}</small></span>
                      {showValueLabels && <span className="bv">{s.v}<em>{valueUnit}</em></span>}
                    </div>
                  );
                })}
                <div className="acl-sf__gatecore">→ {hero.label} {hero.value}{hero.unit}</div>
              </div>
            )}
          </div>
          {chartType === 'pie' && (
            <div className="acl-sf__rlegend">
              {segs.map((s, i) => {
                const isF = focusEnabled && i === fIdx;
                const c = ringColor(i, isF);
                return (
                  <div key={i} className={'acl-sf__rlrow' + (focusEnabled && !isF ? ' acl-sf__rlrow--dim' : '')}>
                    <i style={{ background: c }} />
                    <b>{s.k}</b>
                    {showValueLabels && <em>{s.v}{valueUnit}</em>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── module panel ── */}
        <div className="acl-sf__panel">
          <div className="acl-sf__badge">⛨ {badge}</div>
          {showDecor && (
            <div style={{ position: 'absolute', right: 26, top: 22 }}>
              <Sticker label="刚性预算" sub="MUST-HAVE" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={5} size={15} />
            </div>
          )}
          <div className="acl-sf__modhd">安全模块 · Safety Modules</div>
          <div className="acl-sf__mods">
            {segs.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const c = ringColor(i, isF);
              return (
                <div key={i} className={'acl-sf__mod' + (isF ? ' acl-sf__mod--focus' : '') + (dim ? ' acl-sf__mod--dim' : '')}>
                  <div className="acl-sf__mdot" style={{ background: c }} />
                  <div className="acl-sf__mbody">
                    <div className="acl-sf__mname">{s.k}<small>{s.en}</small></div>
                    <div className="acl-sf__mtrack">
                      <div className="acl-sf__mfill" style={{ right: `${100 - (s.v / maxSeg) * 100}%`, background: c }} />
                    </div>
                  </div>
                  {showValueLabels && <div className="acl-sf__mval">{s.v}<em>{valueUnit}</em></div>}
                </div>
              );
            })}
          </div>
          <div className="acl-sf__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-sf__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-sf__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page41Safety.defaults = {
  backgroundTheme: 'primary',
  chartType: 'pie',        // pie | gate — share pie OR narrowing gate funnel
  segmentCount: 4,         // 3–5 safety modules / defense layers
  showValueLabels: true,
  metricCount: 3,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,           // highlight 模型评测 by default
  showDecor: true,
  eyebrow: 'AI Safety',
  headline: '评测、红队与合规',
  subheadline: 'AI 安全赛道',
  summary: 'AI 安全覆盖<b>模型评测、红队测试、内容安全与合规监测</b>。',
  badge: 'AI Safety · 安全防线',
  hero: { label: '赛道融资额', value: '16', unit: '亿' },
  metrics: [
    { k: '事件数', v: '8', unit: '笔' },
    { k: '平均单笔', v: '2.0', unit: '亿' },
    { k: '评测占比', v: '38', unit: '%' },
  ],
  // safety modules — text not parameterized (count via segmentCount)
  segments: [
    { k: '模型评测', en: 'Evaluation', v: 6 },
    { k: '内容安全', en: 'Content Safety', v: 5 },
    { k: '合规监测', en: 'Compliance', v: 5 },
    { k: '红队测试', en: 'Red Teaming', v: 4 },
    { k: '审计追溯', en: 'Audit Trail', v: 3 },
  ],
  valueUnit: '亿',
  closingLine: '安全能力会成为企业采购门槛。',
};

Page41Safety.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'pie', options: ['pie', 'gate'],
    label: '图表类型', desc: '安全模块占比：饱图(pie) / 关卡漏斗(gate)' },
  { key: 'segmentCount', type: 'number', default: 4, min: 3, max: 5, step: 1,
    label: '模块数量', desc: '安全模块 / 防线层数(3–5)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各模块融资额数值的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '面板内支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个安全模块(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 4, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的安全模块序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page41Safety.defaults;
export const controls = Page41Safety.controls;
