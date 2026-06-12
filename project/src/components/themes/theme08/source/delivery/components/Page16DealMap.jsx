// Page16DealMap.jsx — "Bubble / Deal Map" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-bm-`.
// A swarm/bubble field: every deal is one bubble, sized by its amount band and
// coloured by category, stacked into per-band columns. Count-driven bands,
// optional category colouring + value labels + legend, and a focusable band.
// Bubble positions are deterministic (seeded), so renders are stable. No Tweaks
// dependency — portable ESM, all CSS class-prefixed and scoped to `.acl-root`.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const ACL_BM_TRACKS = [
  { name: '模型', color: 'var(--acl-yellow)' },
  { name: '应用', color: 'var(--acl-pink)' },
  { name: '基础设施', color: 'var(--acl-blue)' },
  { name: '芯片', color: 'var(--acl-red)' },
  { name: '其他', color: '#BCB9C9' },
];
// seeded LCG → stable pseudo-random in [0,1)
function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export default function Page16DealMap(props) {
  const p = { ...Page16DealMap.defaults, ...props };
  const {
    backgroundTheme, bandCount, colorByCategory, showValueLabels, showLegend,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, bands, weights, countUnit, amountUnit, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = bands.slice(0, Math.max(2, bandCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);

  // ── chart geometry (fixed px; whole slide is uniformly scaled by deck-stage) ─
  const CW = 1620, CH = 600;
  const colW = CW / shown.length;
  const radii = [11, 16, 22, 30];                 // bubble radius per band (by original index)
  const wsum = weights.reduce((a, b) => a + b, 0);

  const bubbles = [];
  shown.forEach((b, bi) => {
    const r = radii[Math.min(bi, radii.length - 1)];
    const gap = Math.max(5, r * 0.42);
    const cellW = r * 2 + gap;
    const usable = colW - 46;
    const perRow = Math.max(1, Math.floor(usable / cellW));
    const cx0 = colW * bi + colW / 2;
    const rng = makeRng((bi + 1) * 9173 + 41);
    for (let k = 0; k < b.count; k++) {
      const row = Math.floor(k / perRow);
      const inRow = k % perRow;
      const rowCount = Math.min(perRow, b.count - row * perRow);
      const x = cx0 + (inRow - (rowCount - 1) / 2) * cellW + (rng() - 0.5) * gap * 0.7;
      const y = CH - 14 - r - row * (cellW) - (rng() - 0.5) * gap * 0.5;
      // weighted-deterministic category pick
      let t = rng() * wsum, ti = 0;
      while (ti < weights.length - 1 && t > weights[ti]) { t -= weights[ti]; ti++; }
      bubbles.push({ x, y, r, bi, ti });
    }
  });

  return (
    <div className="acl-root acl-bm" style={{ background: bg }}>
      <style>{`
        .acl-bm{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 64px; display:flex; flex-direction:column; }
        .acl-bm__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-bm__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-bm__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-bm__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-bm__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-bm__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-bm__panel{ position:relative; flex:1; margin-top:28px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:22px 36px 18px; display:flex; flex-direction:column; }
        .acl-bm__legend{ display:flex; gap:20px; align-items:center; font-family:var(--acl-font-mono);
          font-size:16px; font-weight:700; flex-wrap:wrap; position:relative; z-index:3; }
        .acl-bm__legend span{ display:flex; align-items:center; gap:8px; white-space:nowrap; }
        .acl-bm__legend i{ width:18px; height:18px; border-radius:50%; border:2px solid var(--acl-ink); }
        .acl-bm__sizehint{ margin-left:auto; display:flex; align-items:flex-end; gap:10px; color:rgba(22,21,15,.55); }
        .acl-bm__sizehint b{ display:inline-block; border-radius:50%; border:2px solid var(--acl-ink);
          background:rgba(22,21,15,.12); }
        .acl-bm__plot{ position:relative; flex:1; margin-top:8px; }
        .acl-bm__svg{ position:absolute; inset:0; width:100%; height:100%; }
        .acl-bm__b{ stroke:var(--acl-ink); stroke-width:1.6; transition:opacity .3s; }
        .acl-bm__b--dim{ opacity:.26; }
        .acl-bm__b--focus{ stroke-width:2.6; }
        .acl-bm__bands{ display:flex; flex:0 0 auto; margin-top:6px; }
        .acl-bm__band{ flex:1 1 0; min-width:0; text-align:center; padding:0 10px; position:relative; }
        .acl-bm__bsep{ position:absolute; left:0; top:-340px; height:340px; width:0;
          border-left:1.5px dashed rgba(22,21,15,.18); }
        .acl-bm__brange{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.04em;
          color:rgba(22,21,15,.5); }
        .acl-bm__blabel{ font-weight:900; font-size:30px; line-height:1.05; margin-top:2px; }
        .acl-bm__bstats{ display:flex; justify-content:center; gap:8px; align-items:baseline; margin-top:6px; }
        .acl-bm__bcount{ font-family:var(--acl-font-num); font-size:40px; line-height:1; }
        .acl-bm__bunit{ font-family:var(--acl-font-cn); font-weight:700; font-size:15px; opacity:.6; }
        .acl-bm__bamt{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          color:rgba(22,21,15,.62); margin-left:8px; }
        .acl-bm__band--focus .acl-bm__blabel{ color:var(--acl-pink); }
        .acl-bm__band--focus .acl-bm__bcount{ color:var(--acl-pink); }
        .acl-bm__bfx{ position:absolute; top:-372px; left:50%; transform:translateX(-50%); z-index:5; }
        .acl-bm__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-bm__b{ animation:acl-bm-pop .5s cubic-bezier(.2,.9,.3,1.2) both;
            animation-delay:calc(var(--d,0) * 1ms); transform-box:fill-box; transform-origin:center; }
        }
        @keyframes acl-bm-pop{ from{ opacity:0; transform:scale(0); } to{ opacity:1; transform:scale(1); } }
      `}</style>

      <div className="acl-bm__head">
        <div>
          <div className="acl-bm__eyebrow">{eyebrow}</div>
          <h1 className="acl-bm__h">{headline}</h1>
        </div>
        <div className="acl-bm__sub">{subheadline}</div>
        <div className="acl-bm__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-bm__panel">
        {showLegend && (
          <div className="acl-bm__legend">
            {colorByCategory
              ? ACL_BM_TRACKS.map((tk, i) => (
                  <span key={i}><i style={{ background: tk.color }} />{tk.name}</span>
                ))
              : <span><i style={{ background: 'var(--acl-ink)' }} />单笔大额融资事件</span>}
            <span className="acl-bm__sizehint">
              <b style={{ width: 12, height: 12 }} /><b style={{ width: 22, height: 22 }} />
              <b style={{ width: 34, height: 34 }} />气泡大小 = 单笔金额
            </span>
          </div>
        )}

        <div className="acl-bm__plot">
          <svg className="acl-bm__svg" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="xMidYMax meet">
            {bubbles.map((b, i) => {
              const dim = focusEnabled && b.bi !== fIdx;
              const isF = focusEnabled && b.bi === fIdx;
              const fill = colorByCategory ? ACL_BM_TRACKS[b.ti].color : 'var(--acl-ink)';
              return (
                <circle key={i} className={'acl-bm__b' + (dim ? ' acl-bm__b--dim' : '') + (isF ? ' acl-bm__b--focus' : '')}
                  cx={b.x.toFixed(1)} cy={b.y.toFixed(1)} r={b.r}
                  fill={fill} style={{ '--d': (b.bi * 90 + (i % 30) * 12) }} />
              );
            })}
          </svg>
        </div>

        <div className="acl-bm__bands">
          {shown.map((b, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-bm__band' + (isF ? ' acl-bm__band--focus' : '')}>
                {i > 0 && <div className="acl-bm__bsep" />}
                {isF && showDecor && <div className="acl-bm__bfx"><Sticker label="超级交易" color="var(--acl-yellow)" rotate={-5} /></div>}
                <div className="acl-bm__brange">{b.range}</div>
                <div className="acl-bm__blabel">{b.label}</div>
                {showValueLabels && (
                  <div className="acl-bm__bstats">
                    <span className="acl-bm__bcount">{b.count}</span>
                    <span className="acl-bm__bunit">{countUnit}</span>
                    <span className="acl-bm__bamt">{b.amount} {amountUnit}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-bm__foot">
        {showDecor && <Doodle kind="loop" size={54} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page16DealMap.defaults = {
  backgroundTheme: 'primary',
  bandCount: 4,            // 2–4 size bands shown
  colorByCategory: true,
  showValueLabels: true,
  showLegend: true,
  focusEnabled: true,
  focusIndex: 3,
  showDecor: true,
  eyebrow: 'Deal Map',
  headline: '融资事件规模分层',
  subheadline: '大额融资事件地图',
  summary: '97 笔大额融资按金额分四组，<b>少数超级交易</b> 贡献主要融资额。',
  bands: [
    { label: '1–2 亿', range: '$100–200M', count: 41, amount: 58 },
    { label: '2–5 亿', range: '$200–500M', count: 29, amount: 91 },
    { label: '5–10 亿', range: '$500M–1B', count: 15, amount: 103 },
    { label: '10 亿+', range: '$1B 以上', count: 12, amount: 718 },
  ],
  weights: [34, 25, 16, 10, 15],   // category mix (模型/应用/基础设施/芯片/其他)
  countUnit: '笔',
  amountUnit: '亿美元',
  closingLine: '数量最多的不一定最重要，影响最大的往往是巨额交易。',
};

Page16DealMap.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'bandCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '规模分组数', desc: '金额区间分组的数量(2–4)' },
  { key: 'colorByCategory', type: 'boolean', default: true,
    label: '按类别配色', desc: '气泡是否按赛道着色(关闭则统一墨色)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '每组下方的笔数与金额标签' },
  { key: 'showLegend', type: 'boolean', default: true,
    label: '图例', desc: '顶部赛道色标与气泡大小说明' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个金额分组(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, max: 3, step: 1, maxFrom: 'bandCount',
    label: '重点对象', desc: '被高亮的金额分组序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page16DealMap.defaults;
export const controls = Page16DealMap.controls;
