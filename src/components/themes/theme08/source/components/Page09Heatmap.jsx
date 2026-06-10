// Page09Heatmap.jsx — "Monthly Heatmap" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-hm-`.
// A calendar-style heatmap: each cell is a period whose colour intensity maps to
// its value on a cool→hot brand ramp. Count-driven peak emphasis, optional value
// labels and a colour scale. No dependency on the Tweaks panel — the preview
// maps Tweak values onto props; the component is fully portable.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

// cool→hot ramp built from brand tokens (low lilac → blue → yellow → pink → red)
const ACL_HM_RAMP = ['#E7E6EE', '#8DBEEC', '#ECEF35', '#FF3D97', '#E83B22'];
const aclHmLerp = (a, b, f) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const aclHmColor = (t) => {
  const x = Math.max(0, Math.min(1, t)) * (ACL_HM_RAMP.length - 1);
  const i = Math.floor(x);
  if (i >= ACL_HM_RAMP.length - 1) return ACL_HM_RAMP[ACL_HM_RAMP.length - 1];
  return aclHmLerp(ACL_HM_RAMP[i], ACL_HM_RAMP[i + 1], x - i);
};

export default function Page09Heatmap(props) {
  const p = { ...Page09Heatmap.defaults, ...props };
  const {
    backgroundTheme, columnCount, showValueLabels, highlightCount, showScale, showDecor,
    eyebrow, headline, subheadline, summary, cells, unit, peakNote, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const vals = cells.map((c) => c.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const norm = (v) => (max === min ? 0.5 : (v - min) / (max - min));
  // indices of the N hottest cells
  const peakSet = new Set(
    cells.map((c, i) => i).sort((a, b) => cells[b].v - cells[a].v).slice(0, Math.max(0, highlightCount))
  );

  return (
    <div className="acl-root acl-hm" style={{ background: bg }}>
      <style>{`
        .acl-hm{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-hm__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-hm__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-hm__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-hm__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-hm__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-hm__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-hm__panel{ position:relative; flex:1; margin-top:34px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:36px 40px 30px; display:flex; flex-direction:column; }
        .acl-hm__grid{ flex:1; display:grid; gap:16px; }
        .acl-hm__cell{ position:relative; border:3px solid var(--acl-ink); padding:18px 20px;
          display:flex; flex-direction:column; justify-content:space-between;
          box-shadow:3px 3px 0 rgba(22,21,15,.12); }
        .acl-hm__cell .m{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; display:flex; justify-content:space-between; align-items:baseline; }
        .acl-hm__cell .m b{ font-family:var(--acl-font-cn); font-weight:900; font-size:24px; letter-spacing:0; }
        .acl-hm__cell .v{ font-family:var(--acl-font-num); font-size:50px; line-height:.82; }
        .acl-hm__cell .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700;
          font-size:15px; margin-left:4px; opacity:.7; }
        .acl-hm__cell--peak{ box-shadow:5px 6px 0 rgba(22,21,15,.26); transform:translateY(-3px) scale(1.012);
          z-index:5; }
        .acl-hm__sticker{ position:absolute; top:-15px; right:10px; z-index:6; }
        .acl-hm__spark{ position:absolute; right:8px; bottom:6px; }
        .acl-hm__footrow{ display:flex; align-items:center; justify-content:space-between;
          margin-top:22px; gap:24px; }
        .acl-hm__scale{ display:flex; align-items:center; gap:12px; font-family:var(--acl-font-mono);
          font-size:14px; letter-spacing:.05em; color:rgba(22,21,15,.6); }
        .acl-hm__scalebar{ width:280px; height:16px; border:2px solid var(--acl-ink);
          background:linear-gradient(90deg, ${ACL_HM_RAMP.join(',')}); }
        .acl-hm__peaknote{ font-family:var(--acl-font-hand); font-size:30px; color:var(--acl-ink);
          display:flex; align-items:center; gap:12px; }
        .acl-hm__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-hm__cell{ animation:acl-hm-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .04s); }
        }
        @keyframes acl-hm-pop{ from{ opacity:0; transform:scale(.86); } to{ opacity:1; } }
      `}</style>

      <div className="acl-hm__head">
        <div>
          <div className="acl-hm__eyebrow">{eyebrow}</div>
          <h1 className="acl-hm__h">{headline}</h1>
        </div>
        <div className="acl-hm__sub">{subheadline}</div>
        <div className="acl-hm__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-hm__panel">
        <div className="acl-hm__grid" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
          {cells.map((c, i) => {
            const t = norm(c.v);
            const isPeak = peakSet.has(i);
            const ink = t > 0.62 ? 'var(--acl-paper)' : 'var(--acl-ink)';
            return (
              <div key={i} className={'acl-hm__cell' + (isPeak ? ' acl-hm__cell--peak' : '')}
                style={{ background: aclHmColor(t), color: ink,
                  borderColor: isPeak ? 'var(--acl-ink)' : 'rgba(22,21,15,.85)',
                  borderWidth: isPeak ? 5 : 3, '--i': i }}>
                {isPeak && showDecor && (
                  <div className="acl-hm__sticker"><Sticker label={peakNote} color="var(--acl-yellow)" rotate={5} /></div>
                )}
                <div className="m" style={{ color: ink, opacity: .85 }}>
                  <b style={{ color: ink }}>{c.m}</b><span>{c.en}</span>
                </div>
                {showValueLabels && (
                  <div className="v">{c.v}<em>{unit}</em></div>
                )}
                {isPeak && showDecor && (
                  <Doodle className="acl-hm__spark" kind="spark" size={30} rotate={8}
                    fill={t > 0.62 ? 'var(--acl-yellow)' : 'var(--acl-paper)'} stroke="var(--acl-ink)"
                    style={{ position: 'absolute' }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="acl-hm__footrow">
          {showScale ? (
            <div className="acl-hm__scale">
              <span>低 {min}</span>
              <div className="acl-hm__scalebar" />
              <span>{max} 高 · {unit}</span>
            </div>
          ) : <span />}
          {showDecor && highlightCount > 0 && (
            <div className="acl-hm__peaknote">
              <Doodle kind="arrow" size={56} rotate={-6} style={{ position: 'static' }} />
              全年热度由少数峰值月份拉高
            </div>
          )}
        </div>
      </div>

      <div className="acl-hm__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page09Heatmap.defaults = {
  backgroundTheme: 'primary',
  columnCount: 6,          // grid columns: 4 (→3 rows) or 6 (→2 rows)
  showValueLabels: true,
  highlightCount: 3,       // number of hottest cells emphasized (0–4)
  showScale: true,
  showDecor: true,
  eyebrow: 'Monthly Heatmap',
  headline: '市场月度热力',
  subheadline: '12 个月融资节奏',
  summary: '全年热度并非均匀释放，而是由 <b>5 月、8 月、9 月</b> 等峰值月份拉高。',
  cells: [
    { m: '1月', en: 'JAN', v: 45 }, { m: '2月', en: 'FEB', v: 58 }, { m: '3月', en: 'MAR', v: 59 },
    { m: '4月', en: 'APR', v: 86 }, { m: '5月', en: 'MAY', v: 105 }, { m: '6月', en: 'JUN', v: 93 },
    { m: '7月', en: 'JUL', v: 92 }, { m: '8月', en: 'AUG', v: 118 }, { m: '9月', en: 'SEP', v: 108 },
    { m: '10月', en: 'OCT', v: 73 }, { m: '11月', en: 'NOV', v: 81 }, { m: '12月', en: 'DEC', v: 52 },
  ],
  unit: '亿美元',
  peakNote: '峰值',
  closingLine: '融资节奏的核心不是平均值，而是峰值背后的超级交易。',
};

Page09Heatmap.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'columnCount', type: 'enum', default: 6, options: [4, 6],
    label: '网格列数', desc: '热力格每行单元数：4 列(3 行) 或 6 列(2 行)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '在每个单元中显示数值' },
  { key: 'highlightCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '峰值强调', desc: '按数值高低强调的峰值单元数量(0–4)' },
  { key: 'showScale', type: 'boolean', default: true,
    label: '色阶图例', desc: '底部冷→热色阶图例的显示/隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page09Heatmap.defaults;
export const controls = Page09Heatmap.controls;
