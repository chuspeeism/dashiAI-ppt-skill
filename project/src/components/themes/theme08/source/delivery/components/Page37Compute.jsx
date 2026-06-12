// Page37Compute.jsx — "Compute Occupancy" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gp-`.
// A NEW chart layout: a count-driven OCCUPANCY GRID (server-rack cells that fill
// to encode a utilization %, OR a horizontal capacity-bar variant) paired with a
// count-driven stack of CAPACITY-SPLIT bars (one focusable) and a hero figure
// with metric tiles. No dependency on the Tweaks panel — portable ESM, prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page37Compute(props) {
  const p = { ...Page37Compute.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, hero, metrics,
    utilization, gridCols, gridRows, segments, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = segments.slice(0, Math.max(3, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const maxSeg = Math.max(...segs.map((s) => s.v));

  // occupancy grid geometry
  const total = gridCols * gridRows;
  const filled = Math.round((utilization / 100) * total);

  return (
    <div className="acl-root acl-gp" style={{ background: bg }}>
      <style>{`
        .acl-gp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-gp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-gp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-gp__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-gp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-gp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-gp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-gp__body{ flex:1; display:flex; gap:44px; margin-top:30px; min-height:0; }

        /* ── left: segment stat panel ── */
        .acl-gp__panel{ flex:0 0 700px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:28px 38px 30px; display:flex; flex-direction:column; }
        .acl-gp__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-gp__herolabel{ font-weight:700; font-size:22px; color:rgba(22,21,15,.6); margin-top:18px;
          display:flex; align-items:center; gap:14px; }
        .acl-gp__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-pink); color:var(--acl-paper); }
        .acl-gp__heronum{ font-family:var(--acl-font-num); font-size:150px; line-height:.82; margin-top:2px; }
        .acl-gp__tiles{ display:flex; gap:14px; margin-top:16px; }
        .acl-gp__tile{ flex:1; border:2px solid var(--acl-ink); padding:12px 16px 10px; }
        .acl-gp__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-gp__tile .v{ font-family:var(--acl-font-num); font-size:42px; line-height:.96; margin-top:3px; }
        .acl-gp__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }

        .acl-gp__caphd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin:22px 0 12px; }
        .acl-gp__caps{ display:flex; flex-direction:column; gap:13px; flex:1; justify-content:center; }
        .acl-gp__cap{ display:grid; grid-template-columns:150px 1fr auto; align-items:center; gap:16px;
          transition:.25s; }
        .acl-gp__cap .cn{ font-weight:900; font-size:24px; line-height:1.05; }
        .acl-gp__cap .cn small{ display:block; font-family:var(--acl-font-mono); font-weight:400;
          font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:2px; }
        .acl-gp__track{ height:26px; background:rgba(22,21,15,.1); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-gp__fill{ position:absolute; inset:0 auto 0 0; background:var(--acl-blue);
          border-right:2px solid var(--acl-ink); }
        .acl-gp__cap .cv{ font-family:var(--acl-font-num); font-size:34px; line-height:.8; white-space:nowrap;
          min-width:96px; text-align:right; }
        .acl-gp__cap .cv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; opacity:.6; }
        .acl-gp__cap--focus .cn{ color:var(--acl-ink); }
        .acl-gp__cap--focus .acl-gp__fill{ background:var(--acl-pink); }
        .acl-gp__cap--dim{ opacity:.42; }

        /* ── right: occupancy grid card ── */
        .acl-gp__chart{ flex:1; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 38px 30px; display:flex; flex-direction:column; min-width:0; }
        .acl-gp__charthd{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; }
        .acl-gp__chartt{ font-family:var(--acl-font-mono); font-weight:700; font-size:15px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.55); }
        .acl-gp__util{ font-family:var(--acl-font-num); font-size:78px; line-height:.8; color:var(--acl-yellow); }
        .acl-gp__util em{ font-style:normal; font-size:34px; margin-left:2px; }
        .acl-gp__grid{ flex:1; margin-top:22px; display:grid; gap:9px; min-height:0;
          grid-template-columns:repeat(${gridCols}, 1fr); grid-template-rows:repeat(${gridRows}, 1fr); }
        .acl-gp__cell{ border:2px solid rgba(255,255,255,.22); background:rgba(255,255,255,.06);
          position:relative; }
        .acl-gp__cell--on{ background:var(--acl-yellow); border-color:var(--acl-yellow); }
        .acl-gp__cell--edge{ background:var(--acl-pink); border-color:var(--acl-pink); }
        .acl-gp__barwrap{ flex:1; margin-top:22px; display:flex; flex-direction:column; justify-content:center;
          gap:16px; min-height:0; }
        .acl-gp__brow{ display:flex; align-items:center; gap:16px; }
        .acl-gp__brow .bn{ flex:0 0 150px; font-weight:900; font-size:22px; }
        .acl-gp__btrack{ flex:1; height:32px; background:rgba(255,255,255,.1);
          border:2px solid rgba(255,255,255,.4); position:relative; }
        .acl-gp__bfill{ position:absolute; inset:0 auto 0 0; background:var(--acl-yellow); }
        .acl-gp__legend{ display:flex; gap:24px; margin-top:18px; font-family:var(--acl-font-mono);
          font-size:13px; letter-spacing:.05em; text-transform:uppercase; color:rgba(255,255,255,.6); }
        .acl-gp__lg{ display:flex; align-items:center; gap:8px; }
        .acl-gp__sw{ width:16px; height:16px; border:2px solid rgba(255,255,255,.6); }

        .acl-gp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gp__panel,[data-deck-active] .acl-gp__chart{
            animation:acl-gp-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-gp__chart{ animation-delay:.08s; }
          [data-deck-active] .acl-gp__cell{ animation:acl-gp-pop .4s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .012s + .25s); }
          [data-deck-active] .acl-gp__fill,[data-deck-active] .acl-gp__bfill{
            animation:acl-gp-grow .7s cubic-bezier(.2,.8,.2,1) .35s both; }
        }
        @keyframes acl-gp-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-gp-pop{ from{ opacity:0; transform:scale(.5); } to{ opacity:1; transform:none; } }
        @keyframes acl-gp-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:none; } }
      `}</style>

      <div className="acl-gp__head">
        <div>
          <div className="acl-gp__eyebrow">{eyebrow}</div>
          <h1 className="acl-gp__h">{headline}</h1>
        </div>
        <div className="acl-gp__sub">{subheadline}</div>
        <div className="acl-gp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-gp__body">
        {/* ── left stat panel ── */}
        <div className="acl-gp__panel">
          <div className="acl-gp__badge">▦ {badge}</div>
          {showDecor && (
            <Doodle kind="spark" size={48} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ right: 28, top: 22 }} />
          )}
          <div className="acl-gp__herolabel">{hero.label}<i className="acl-gp__unit">{hero.unit}</i></div>
          <div className="acl-gp__heronum">{hero.value}</div>
          <div className="acl-gp__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-gp__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>

          <div className="acl-gp__caphd">资源占比 · Capacity Split</div>
          <div className="acl-gp__caps">
            {segs.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-gp__cap' + (isF ? ' acl-gp__cap--focus' : '') + (dim ? ' acl-gp__cap--dim' : '')}>
                  <div className="cn">{s.k}<small>{s.en}</small></div>
                  <div className="acl-gp__track">
                    <div className="acl-gp__fill" style={{ right: `${100 - (s.v / maxSeg) * 100}%` }} />
                  </div>
                  {showValueLabels && <div className="cv">{s.v}<em>%</em></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── right occupancy chart ── */}
        <div className="acl-gp__chart">
          <div className="acl-gp__charthd">
            <div className="acl-gp__chartt">集群占用 · Cluster Utilization</div>
            <div className="acl-gp__util">{utilization}<em>%</em></div>
          </div>

          {chartType === 'grid' ? (
            <div className="acl-gp__grid">
              {Array.from({ length: total }).map((_, i) => {
                const on = i < filled;
                const edge = on && i >= filled - gridCols; // last filled row → pink "active edge"
                return <div key={i} style={{ '--i': i }}
                  className={'acl-gp__cell' + (on ? (edge ? ' acl-gp__cell--edge' : ' acl-gp__cell--on') : '')} />;
              })}
            </div>
          ) : (
            <div className="acl-gp__barwrap">
              {segs.map((s, i) => {
                const isF = focusEnabled && i === fIdx;
                return (
                  <div key={i} className="acl-gp__brow" style={{ opacity: focusEnabled && !isF ? 0.5 : 1 }}>
                    <div className="bn">{s.k}</div>
                    <div className="acl-gp__btrack">
                      <div className="acl-gp__bfill" style={{ width: `${(s.v / maxSeg) * 100}%`,
                        background: isF ? 'var(--acl-pink)' : 'var(--acl-yellow)' }} />
                    </div>
                    {showValueLabels && <div style={{ fontFamily: 'var(--acl-font-num)', fontSize: 34, minWidth: 70 }}>{s.v}%</div>}
                  </div>
                );
              })}
            </div>
          )}

          {chartType === 'grid' && (
            <div className="acl-gp__legend">
              <div className="acl-gp__lg"><span className="acl-gp__sw" style={{ background: 'var(--acl-yellow)', borderColor: 'var(--acl-yellow)' }} />已分配算力</div>
              <div className="acl-gp__lg"><span className="acl-gp__sw" style={{ background: 'var(--acl-pink)', borderColor: 'var(--acl-pink)' }} />新增需求</div>
              <div className="acl-gp__lg"><span className="acl-gp__sw" />闲置 / 待扩容</div>
            </div>
          )}
        </div>
      </div>

      <div className="acl-gp__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page37Compute.defaults = {
  backgroundTheme: 'primary',
  chartType: 'grid',       // grid | bars — occupancy grid OR capacity bars
  segmentCount: 4,         // 3–5 capacity-split rows
  showValueLabels: true,
  metricCount: 3,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,           // highlight the H100/H200 split by default
  showDecor: true,
  eyebrow: 'GPU Cloud',
  headline: '算力供给稀缺',
  subheadline: 'GPU 云与算力租赁',
  summary: 'GPU 云公司受益于<b>训练与推理双重需求</b>，供给持续偏紧。',
  badge: 'GPU Cloud · 算力租赁',
  hero: { label: '赛道融资额', value: '64', unit: '亿美元' },
  metrics: [
    { k: '事件数', v: '9', unit: '笔' },
    { k: '平均单笔', v: '7.1', unit: '亿' },
    { k: '资源占比', v: '58', unit: '%' },
  ],
  utilization: 58,         // occupancy % encoded by the grid (not a Tweak — data)
  gridCols: 12,
  gridRows: 7,
  // capacity-split bars — text not parameterized (count via segmentCount)
  segments: [
    { k: 'H100 / H200', en: 'Hopper', v: 58 },
    { k: 'A100 集群', en: 'Ampere', v: 24 },
    { k: '推理加速卡', en: 'Inference', v: 12 },
    { k: '其他 / 自研', en: 'Others', v: 6 },
  ],
  closingLine: '算力是 AI 时代最直接的硬资源。',
};

Page37Compute.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'grid', options: ['grid', 'bars'],
    label: '图表类型', desc: '占用呈现：算力网格 / 资源条形' },
  { key: 'segmentCount', type: 'number', default: 4, min: 3, max: 5, step: 1,
    label: '资源分组', desc: '资源占比分段数量(3–5)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '资源占比百分比标签的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主数字旁的支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个资源分组(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 4, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的资源分组序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page37Compute.defaults;
export const controls = Page37Compute.controls;
