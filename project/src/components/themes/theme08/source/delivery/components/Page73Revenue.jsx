// Page73Revenue.jsx — "Conversion Ladder + Margin Check" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-rv-`.
// A NEW content/image layout (distinct from the ticket funnel P44, the radial
// growth funnel P45 and the monetization chain P47): a LEFT-anchored DESCENDING
// CONVERSION LADDER — count-driven horizontal stages that narrow stage-to-stage
// with drop-off annotations between them — paired with a RIGHT "margin check"
// panel (a hero rate + a stacked cost/headroom bar + metric tiles). An optional
// media rail (0–2 AdaptiveImageSlots, each self-sizing) collapses away when empty.
// Pure ESM — no Tweaks dependency; all CSS scoped + prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page73Revenue(props) {
  const p = { ...Page73Revenue.defaults, ...props };
  const {
    backgroundTheme, chartType, stageCount, mediaCount, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, ladderTitle, stages,
    marginTitle, marginHero, costBar, metrics, mediaRail, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = stages.slice(0, Math.max(3, stageCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const slots = mediaRail[mediaCount] || [];
  const hasMedia = slots.length > 0;
  const palette = ['var(--acl-ink)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-yellow)', 'var(--acl-paper)'];
  const isBars = chartType === 'bars';

  return (
    <div className="acl-root acl-rv" style={{ background: bg }}>
      <style>{`
        .acl-rv{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 60px; display:flex; flex-direction:column; }
        .acl-rv__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-rv__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-rv__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-rv__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-red); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2);  white-space:nowrap;}
        .acl-rv__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-rv__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-rv__body{ flex:1; display:flex; gap:40px; margin-top:28px; min-height:0; }

        /* ── media rail (collapses when empty) ── */
        .acl-rv__rail{ flex:0 0 auto; display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:26px; }
        .acl-rv__slot{ position:relative; }

        /* ── conversion ladder card ── */
        .acl-rv__ladder{ flex:1 1 0; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:24px 38px 26px; display:flex; flex-direction:column; min-width:0; }
        .acl-rv__cardt{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); flex:0 0 auto; }
        .acl-rv__stages{ flex:1; display:flex; flex-direction:column; justify-content:center;
          gap:6px; margin-top:14px; }
        .acl-rv__stage{ position:relative; }
        .acl-rv__bar{ height:58px; border:3px solid var(--acl-ink); display:flex; align-items:center;
          justify-content:space-between; padding:0 22px; transition:opacity .25s, background .25s, width .3s;
          box-shadow:4px 5px 0 rgba(22,21,15,.16); }
        .acl-rv__bname{ font-weight:900; font-size:27px; line-height:1; white-space:nowrap; }
        .acl-rv__bname small{ font-family:var(--acl-font-mono); font-weight:400; font-size:11px;
          letter-spacing:.04em; text-transform:uppercase; opacity:.6; margin-left:9px; }
        .acl-rv__bval{ font-family:var(--acl-font-num); font-size:42px; line-height:.8; white-space:nowrap; }
        .acl-rv__bar--dim{ opacity:.4; }
        .acl-rv__drop{ display:flex; align-items:center; gap:8px; padding:1px 0 1px 30px; height:20px; }
        .acl-rv__droptag{ font-family:var(--acl-font-hand); font-size:21px; line-height:1;
          color:var(--acl-red); white-space:nowrap; }
        .acl-rv__fx{ position:absolute; top:-15px; right:-10px; z-index:5; }

        /* ── margin check panel ── */
        .acl-rv__margin{ flex:0 0 440px; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 34px 28px; display:flex; flex-direction:column; min-width:0; }
        .acl-rv__margint{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.5); }
        .acl-rv__herolab{ font-weight:700; font-size:22px; margin-top:16px; color:rgba(255,255,255,.85); }
        .acl-rv__heronum{ font-family:var(--acl-font-num); font-size:160px; line-height:.78;
          color:var(--acl-yellow); }
        .acl-rv__heronum em{ font-style:normal; font-size:54px; margin-left:4px; color:var(--acl-paper); }
        .acl-rv__costwrap{ margin-top:14px; }
        .acl-rv__costhd{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(255,255,255,.5); margin-bottom:8px; }
        .acl-rv__cost{ display:flex; height:40px; border:3px solid var(--acl-paper); overflow:hidden; }
        .acl-rv__seg{ display:flex; align-items:center; justify-content:center; font-family:var(--acl-font-num);
          font-size:22px; color:var(--acl-ink); border-right:2px solid var(--acl-ink); }
        .acl-rv__seg:last-child{ border-right:none; }
        .acl-rv__legend{ display:flex; gap:18px; margin-top:9px; flex-wrap:wrap; }
        .acl-rv__leg{ display:flex; align-items:center; gap:6px; font-family:var(--acl-font-mono);
          font-size:12px; letter-spacing:.03em; text-transform:uppercase; color:rgba(255,255,255,.72); }
        .acl-rv__legdot{ width:13px; height:13px; border:2px solid var(--acl-paper); }
        .acl-rv__tiles{ display:flex; gap:0; margin-top:auto; border-top:2px dashed rgba(255,255,255,.25);
          padding-top:16px; }
        .acl-rv__tile{ flex:1; padding:0 14px; border-right:2px solid rgba(255,255,255,.2); }
        .acl-rv__tile:first-child{ padding-left:0; }
        .acl-rv__tile:last-child{ border-right:none; }
        .acl-rv__tk{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(255,255,255,.55); }
        .acl-rv__tv{ font-family:var(--acl-font-num); font-size:40px; line-height:.95; margin-top:3px;
          color:var(--acl-yellow); }
        .acl-rv__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; color:rgba(255,255,255,.6); }

        .acl-rv__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-rv__ladder,[data-deck-active] .acl-rv__margin{
            animation:acl-rv-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-rv__margin{ animation-delay:.08s; }
          [data-deck-active] .acl-rv__bar{ animation:acl-rv-wipe .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .2s); transform-origin:left; }
          [data-deck-active] .acl-rv__slot{ animation:acl-rv-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--j,0) * .12s + .25s); }
          [data-deck-active] .acl-rv__heronum{ animation:acl-rv-pop .6s cubic-bezier(.2,.8,.2,1) .3s both; }
        }
        @keyframes acl-rv-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-rv-wipe{ from{ opacity:0; transform:scaleX(.5); } to{ opacity:1; transform:none; } }
        @keyframes acl-rv-in{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:none; } }
        @keyframes acl-rv-pop{ from{ opacity:0; transform:translateY(20px) scale(.92); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-rv__head">
        <div>
          <div className="acl-rv__eyebrow">{eyebrow}</div>
          <h1 className="acl-rv__h">{headline}</h1>
        </div>
        <div className="acl-rv__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
          style={{ position: 'static', alignSelf: 'center', marginBottom: 8 }} />}
        <div className="acl-rv__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-rv__body">
        {/* ── media rail ── */}
        {hasMedia && (
          <div className="acl-rv__rail">
            {slots.map((s, i) => (
              <div className="acl-rv__slot" key={i} style={{ '--j': i }}>
                <AdaptiveImageSlot id={'rv-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                  accent="var(--acl-paper)"
                  placeholder={i === 0 ? '客户现场' : ('FIG.' + (i + 1))}
                  sticker={i === 0 ? { label: '试点现场', sub: 'PILOT', color: 'var(--acl-yellow)', subColor: 'var(--acl-ink)', rotate: s.sr } : null} />
              </div>
            ))}
          </div>
        )}

        {/* ── conversion ladder ── */}
        <div className="acl-rv__ladder">
          <div className="acl-rv__cardt">{ladderTitle} · Conversion Ladder</div>
          {showDecor && <Doodle kind="arrowS" size={46} rotate={92} color="var(--acl-ink)" style={{ right: 28, top: 18 }} />}
          <div className="acl-rv__stages">
            {shown.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const c = isF ? 'var(--acl-pink)' : palette[i % palette.length];
              const onDark = c === 'var(--acl-ink)' || c === 'var(--acl-pink)' || c === 'var(--acl-red)';
              const w = isBars ? `${Math.max(28, Math.min(100, s.pct))}%`
                : `${100 - i * (52 / Math.max(1, shown.length))}%`;
              const last = i === shown.length - 1;
              return (
                <React.Fragment key={i}>
                  <div className="acl-rv__stage">
                    {isF && showDecor && <div className="acl-rv__fx"><Sticker label="关键转化" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={6} size={14} /></div>}
                    <div className={'acl-rv__bar' + (dim ? ' acl-rv__bar--dim' : '')}
                      style={{ width: w, background: c, color: onDark ? 'var(--acl-paper)' : 'var(--acl-ink)', '--i': i }}>
                      <span className="acl-rv__bname">{s.k}<small>{s.en}</small></span>
                      {showValueLabels && <span className="acl-rv__bval">{s.pct}%</span>}
                    </div>
                  </div>
                  {!last && s.drop && (
                    <div className="acl-rv__drop">
                      {showDecor && <Doodle kind="arrow" size={30} rotate={64} color="var(--acl-red)" style={{ position: 'static' }} />}
                      <span className="acl-rv__droptag">{s.drop}</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── margin check ── */}
        <div className="acl-rv__margin">
          <div className="acl-rv__margint">{marginTitle} · Margin Check</div>
          {showDecor && <Doodle kind="spark" size={40} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-paper)" style={{ right: 26, top: 20 }} />}
          <div className="acl-rv__herolab">{marginHero.label}</div>
          <div className="acl-rv__heronum">{marginHero.value}<em>{marginHero.unit}</em></div>
          <div className="acl-rv__costwrap">
            <div className="acl-rv__costhd">{costBar.title}</div>
            <div className="acl-rv__cost">
              {costBar.segments.map((seg, i) => (
                <div key={i} className="acl-rv__seg" style={{ width: `${seg.v}%`, background: seg.color }}>
                  {showValueLabels && seg.v >= 14 ? `${seg.v}%` : ''}
                </div>
              ))}
            </div>
            <div className="acl-rv__legend">
              {costBar.segments.map((seg, i) => (
                <span key={i} className="acl-rv__leg">
                  <span className="acl-rv__legdot" style={{ background: seg.color }} />{seg.k}
                </span>
              ))}
            </div>
          </div>
          <div className="acl-rv__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-rv__tile">
                <div className="acl-rv__tk">{m.k}</div>
                <div className="acl-rv__tv">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-rv__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page73Revenue.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  chartType: 'funnel',         // 'funnel' (geometric narrowing) | 'bars' (value-scaled)
  stageCount: 4,               // 3–5 conversion stages
  mediaCount: 1,               // 0–2 media rail slots
  showValueLabels: true,       // stage rates + cost-bar labels
  metricCount: 3,              // 2–4 supporting metric tiles
  focusEnabled: true,
  focusIndex: 2,               // highlight 付费转化 by default
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Revenue Risk',
  headline: '从试点到稳定收入',
  subheadline: '风险：收入验证',
  summary: '多数 AI 公司需要证明能从试点项目<b>转向稳定订阅收入</b>。',
  ladderTitle: '收入兑现路径',
  // conversion stages — text not parameterized (count via stageCount)
  stages: [
    { k: '试点接入', en: 'Pilot', pct: 100, drop: 'POC 启动' },
    { k: '完成验证', en: 'Validated', pct: 62, drop: '验证流失 38%' },
    { k: '付费转化', en: 'Paid', pct: 28, drop: '仅 28% 转付费' },
    { k: '年度留存', en: 'Retention', pct: 83, drop: '年流失 17%' },
    { k: '席位扩张', en: 'Expansion', pct: 112, drop: '' },
  ],
  marginTitle: '毛利体检',
  marginHero: { label: '毛利率中位数', value: '54', unit: '%' },
  costBar: {
    title: '收入结构拆解 · 推理成本侵蚀',
    segments: [
      { k: '毛利', v: 54, color: 'var(--acl-yellow)' },
      { k: '推理成本', v: 31, color: 'var(--acl-pink)' },
      { k: '其他成本', v: 15, color: 'var(--acl-blue)' },
    ],
  },
  metrics: [
    { k: '试点转付费率', v: '28', unit: '%' },
    { k: '企业年流失率', v: '17', unit: '%' },
    { k: '推理成本占收入', v: '31', unit: '%' },
    { k: '毛利率中位数', v: '54', unit: '%' },
  ],
  // count-driven media rail presets — each slot resizes to its uploaded ratio.
  mediaRail: {
    0: [],
    1: [
      { box: 320, r: -3, ratio: 0.82, sr: -4 },
    ],
    2: [
      { box: 250, r: -3, ratio: 0.82, sr: -4 },
      { box: 220, r: 4, ratio: 1.18, sr: 4 },
    ],
  },
  closingLine: '客户试点不等于商业化成功。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page73Revenue.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'funnel', options: ['funnel', 'bars'],
    label: '图表类型', desc: '阶梯呈现：几何收窄漏斗(funnel) / 按数值缩放条(bars)' },
  { key: 'stageCount', type: 'number', default: 4, min: 3, max: 5, step: 1,
    label: '阶段数量', desc: '收入兑现路径的阶段数量(3–5)' },
  { key: 'mediaCount', type: 'number', default: 1, min: 0, max: 2, step: 1,
    label: '图片数量', desc: '左侧配图槽数量(0–2)；为 0 时自动收起，每张按上传图片比例自适应' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '阶段转化率与成本结构百分比的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '面板底部支撑指标格数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个转化阶段(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 4, step: 1, maxFrom: 'stageCount',
    label: '重点对象', desc: '被高亮的阶段序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与贴纸标签 显隐' },
];

export const defaults = Page73Revenue.defaults;
export const controls = Page73Revenue.controls;
