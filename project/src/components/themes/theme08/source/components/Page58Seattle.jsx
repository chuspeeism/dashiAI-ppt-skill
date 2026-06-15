// Page58Seattle.jsx — "Geo Card · Split Stacked Rail" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gs-`.
// A vertical split poster: LEFT is an orderly stacked photo rail (0–n
// AdaptiveImageSlots, each resizing to its uploaded ratio); RIGHT is a data
// panel — oversized share figure, caption, a count-driven focusable ecosystem
// tag list, and a row of metric tiles. Portable — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page58Seattle(props) {
  const p = { ...Page58Seattle.defaults, ...props };
  const {
    backgroundTheme, mediaCount, tagCount, metricCount, showShare,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, place, caption, tagsTitle, tags,
    shareValue, shareUnit, shareLabel, metrics, rail, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(160deg, #EFEFF6 0%, #E7E6EE 56%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const rows = tags.slice(0, Math.max(2, tagCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, rows.length - 1);
  const slots = rail[mediaCount] || [];

  return (
    <div className="acl-root acl-gs" style={{ background: bg }}>
      <style>{`
        .acl-gs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); display:flex; }

        /* ── left: stacked photo rail ── */
        .acl-gs__rail{ flex:0 0 760px; position:relative; background:
          repeating-linear-gradient(135deg, rgba(22,21,15,.04) 0 12px, transparent 12px 24px),
          rgba(22,21,15,.05); border-right:5px solid var(--acl-ink); }
        .acl-gs__slot{ position:absolute; }
        .acl-gs__railempty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:36px; color:rgba(22,21,15,.4); transform:rotate(-5deg); }
        .acl-gs__railtag{ position:absolute; left:40px; top:44px; z-index:6; font-family:var(--acl-font-mono);
          font-weight:700; font-size:18px; letter-spacing:.14em; text-transform:uppercase;
          background:var(--acl-ink); color:var(--acl-yellow); padding:9px 15px; transform:rotate(-2deg); }

        /* ── right: data panel ── */
        .acl-gs__panel{ flex:1; min-width:0; padding:74px 92px 60px; display:flex; flex-direction:column; }
        .acl-gs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gs__h{ font-weight:900; font-size:72px; line-height:.92; margin:8px 0 0; }
        .acl-gs__place{ display:inline-flex; align-self:flex-start; font-family:var(--acl-font-mono);
          font-weight:700; font-size:19px; padding:8px 14px; background:var(--acl-blue); color:var(--acl-ink);
          transform:rotate(-1.5deg); box-shadow:3px 4px 0 rgba(22,21,15,.18); margin-top:14px; }

        .acl-gs__share{ display:flex; align-items:flex-end; gap:22px; margin:42px 0 14px; }
        .acl-gs__sharev{ font-family:var(--acl-font-num); font-size:150px; line-height:.74;
          color:var(--acl-pink); text-shadow:6px 7px 0 var(--acl-ink); }
        .acl-gs__shareu{ font-family:var(--acl-font-num); font-size:74px; line-height:1; }
        .acl-gs__sharek{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(22,21,15,.5); padding-bottom:18px; max-width:160px; }

        .acl-gs__cap{ font-weight:700; font-size:24px; line-height:1.58; max-width:640px; margin-top:14px; }
        .acl-gs__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }

        .acl-gs__tagttl{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:36px 0 12px; }
        .acl-gs__rows{ display:flex; flex-direction:column; gap:9px; }
        .acl-gs__row{ display:flex; align-items:center; gap:14px; padding:11px 16px; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:4px 5px 0 rgba(22,21,15,.12);
          transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-gs__rn{ font-family:var(--acl-font-num); font-size:30px; line-height:.8; width:40px; flex:0 0 auto;
          color:var(--acl-pink); }
        .acl-gs__rt{ font-weight:900; font-size:25px; line-height:1; }
        .acl-gs__rnote{ font-family:var(--acl-font-cn); font-weight:400; font-size:16px;
          color:rgba(22,21,15,.55); margin-left:auto; white-space:nowrap; }
        .acl-gs__row--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:translateX(6px);
          box-shadow:7px 7px 0 rgba(22,21,15,.22); }
        .acl-gs__row--focus .acl-gs__rn{ color:var(--acl-yellow); }
        .acl-gs__row--focus .acl-gs__rnote{ color:rgba(251,250,244,.6); }
        .acl-gs__row--dim{ opacity:.5; }

        .acl-gs__tiles{ display:flex; gap:34px; margin-top:auto; padding-top:24px; }
        .acl-gs__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-gs__tile .v{ font-family:var(--acl-font-num); font-size:50px; line-height:.92; margin-top:3px; }
        .acl-gs__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:4px; color:rgba(22,21,15,.5); }

        .acl-gs__foot{ display:flex; align-items:center; gap:13px; font-family:var(--acl-font-hand);
          font-size:27px; margin-top:18px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gs__row{ animation:acl-gs-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .25s); }
          [data-deck-active] .acl-gs__sharev{ animation:acl-gs-pop .6s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-gs-rise{ from{ opacity:0; transform:translateX(-16px); } to{ opacity:1; } }
        @keyframes acl-gs-pop{ from{ opacity:0; transform:translateY(20px) scale(.92); } to{ opacity:1; transform:none; } }
      `}</style>

      {/* ── left rail ── */}
      <div className="acl-gs__rail">
        <div className="acl-gs__railtag">{place}</div>
        {slots.length === 0 && <div className="acl-gs__railempty">// 图片数量 = 0</div>}
        {slots.map((s, i) => (
          <div className="acl-gs__slot" key={i} style={{ left: s.l, top: s.t, zIndex: i + 1 }}>
            <AdaptiveImageSlot id={'se-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
              accent="var(--acl-paper)" placeholder={(rows[i % rows.length] && rows[i % rows.length].label) || '图片'}
              sticker={{ label: (rows[i % rows.length] && rows[i % rows.length].label) || ('FIG.' + (i + 1)), color: s.color, rotate: s.sr }} />
          </div>
        ))}
        {showDecor && slots.length > 0 && (
          <Doodle kind="arrow" size={76} rotate={20} color="var(--acl-ink)" style={{ right: -28, top: '46%', zIndex: 7 }} />
        )}
      </div>

      {/* ── right panel ── */}
      <div className="acl-gs__panel">
        <div className="acl-gs__eyebrow">{eyebrow}</div>
        <h1 className="acl-gs__h">{headline}</h1>
        <div className="acl-gs__place">{place}</div>

        {showShare && (
          <div className="acl-gs__share">
            <div className="acl-gs__sharev">{shareValue}</div>
            <div className="acl-gs__shareu">{shareUnit}</div>
            <div className="acl-gs__sharek">{shareLabel}</div>
            {showDecor && <Doodle kind="spark" size={40} rotate={12} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginBottom: 28 }} />}
          </div>
        )}

        <div className="acl-gs__cap" dangerouslySetInnerHTML={{ __html: caption }} />

        <div className="acl-gs__tagttl">{tagsTitle}</div>
        <div className="acl-gs__rows">
          {rows.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            return (
              <div key={i} className={'acl-gs__row' + (isF ? ' acl-gs__row--focus' : '') + (dim ? ' acl-gs__row--dim' : '')} style={{ '--i': i }}>
                <span className="acl-gs__rn">{String(i + 1).padStart(2, '0')}</span>
                <span className="acl-gs__rt">{r.label}</span>
                <span className="acl-gs__rnote">{r.note}</span>
              </div>
            );
          })}
        </div>

        <div className="acl-gs__tiles">
          {tiles.map((m, i) => (
            <div className="acl-gs__tile" key={i}>
              <div className="k">{m.k}</div>
              <div className="v">{m.v}{m.unit && <em>{m.unit}</em>}</div>
            </div>
          ))}
        </div>

        <div className="acl-gs__foot">
          {showDecor && <Doodle kind="loop" size={50} style={{ position: 'static' }} />}
          <span>{closingLine}</span>
        </div>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page58Seattle.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 2,
  tagCount: 4,
  metricCount: 4,
  showShare: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content
  eyebrow: 'Seattle Cluster',
  kicker: '城市卡',
  headline: '云计算人才外溢',
  place: '西雅图集群 · SEATTLE',
  caption: '西雅图受益于 <b>云计算生态与大厂工程人才外溢</b>，更适合孕育基础设施、开发者工具与企业 AI。',
  tagsTitle: '主要云生态方向',
  tags: [
    { label: '云基础设施', note: '算力 · 存储 · 网络' },
    { label: '开发者工具', note: '研发效率提升' },
    { label: '企业 AI', note: '内部流程嵌入' },
    { label: '数据平台', note: 'RAG · 知识管理' },
    { label: '推理优化', note: '成本与时延' },
  ],
  shareValue: '9.8',
  shareUnit: '%',
  shareLabel: '全美融资额占比',
  metrics: [
    { k: '融资额', v: '95', unit: '亿' },
    { k: '占比', v: '9.8', unit: '%' },
    { k: '事件数', v: '10', unit: '笔' },
    { k: '平均单笔', v: '9.5', unit: '亿' },
  ],
  // stacked rail presets — rail area ≈ 760×1080, each slot resizes to its ratio.
  rail: {
    0: [],
    1: [
      { l: 150, t: 300, box: 470, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 90, t: 150, box: 400, r: -4, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)' },
      { l: 300, t: 560, box: 360, r: 4, ratio: 0.84, sr: 4, color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 70, t: 110, box: 330, r: -5, ratio: 1.16, sr: -4, color: 'var(--acl-yellow)' },
      { l: 360, t: 400, box: 320, r: 4, ratio: 0.85, sr: 4, color: 'var(--acl-blue)' },
      { l: 120, t: 700, box: 300, r: -3, ratio: 1.3, sr: -3, color: 'var(--acl-pink)' },
    ],
  },
  closingLine: '云计算底座，带来 AI 基础设施机会。',
};

// ── adjustable-parameter manifest ────────────────────────────────────────────
Page58Seattle.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '左侧堆叠图片槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'tagCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '标签数量', desc: '云生态方向行数量(2–5)' },
  { key: 'metricCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–4)' },
  { key: 'showShare', type: 'boolean', default: true,
    label: '占比大数字', desc: '右侧大号占比数字 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个方向行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'tagCount', step: 1,
    label: '重点对象', desc: '被突出的方向行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page58Seattle.defaults;
export const controls = Page58Seattle.controls;
