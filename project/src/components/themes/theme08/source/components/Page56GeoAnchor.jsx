// Page56GeoAnchor.jsx — "Big Number / Gravity Center" template page (NEW format)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ga-`.
// One dominant figure anchors the page as a geographic "gravity center", balanced
// by a narrative column: a caption plus a count-driven list of advantage factors
// (one focusable) and a row of supporting metric tiles. Three themes + a
// solid/outline numeral style. Fully portable — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page56GeoAnchor(props) {
  const p = { ...Page56GeoAnchor.defaults, ...props };
  const {
    backgroundTheme, factorCount, metricCount, focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, subheadline, bigNumber, bigUnit, caption,
    factorsTitle, factors, metrics, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(120% 120% at 78% 8%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = factors.slice(0, Math.max(2, factorCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, items.length - 1);

  return (
    <div className={'acl-root acl-ga' + (isInk ? ' acl-ga--ink' : '')}
      style={{ background: bg }}>
      <style>{`
        .acl-ga{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 64px; display:flex; flex-direction:column; }
        .acl-ga--ink{ color:var(--acl-paper); }
        .acl-ga__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; z-index:3; }
        .acl-ga__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ga--ink .acl-ga__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-ga__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-ga__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ga--ink .acl-ga__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-ga__body{ flex:1; display:flex; gap:56px; min-height:0; align-items:stretch; margin-top:8px; }

        /* left: narrative column */
        .acl-ga__left{ flex:1 1 0; min-width:0; display:flex; flex-direction:column; justify-content:center; }
        .acl-ga__label{ font-weight:900; font-size:46px; line-height:1.0; display:flex; align-items:center;
          gap:16px; flex-wrap:wrap; }
        .acl-ga__label i{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:16px;
          letter-spacing:.05em; text-transform:uppercase; padding:6px 12px; background:var(--acl-ink);
          color:var(--acl-paper); transform:rotate(-2deg); }
        .acl-ga--ink .acl-ga__label i{ background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-ga__cap{ font-weight:700; font-size:25px; line-height:1.44; max-width:680px; margin:18px 0 4px; }
        .acl-ga__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-ga--ink .acl-ga__cap b{ background:var(--acl-pink); color:var(--acl-paper); }

        .acl-ga__ftitle{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:26px 0 12px; display:flex; align-items:center; gap:10px; }
        .acl-ga--ink .acl-ga__ftitle{ color:rgba(251,250,244,.55); }
        .acl-ga__factors{ display:flex; flex-direction:column; gap:11px; }
        .acl-ga__f{ display:grid; grid-template-columns:44px 1fr; align-items:center; gap:16px;
          padding:10px 16px 10px 10px; border:3px solid var(--acl-ink); background:var(--acl-paper);
          box-shadow:5px 6px 0 rgba(22,21,15,.14); transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-ga--ink .acl-ga__f{ background:#221F18; border-color:rgba(251,250,244,.5); }
        .acl-ga__fn{ width:44px; height:44px; border-radius:50%; display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:24px; background:var(--acl-ink); color:var(--acl-yellow); }
        .acl-ga--ink .acl-ga__fn{ background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-ga__ft{ font-weight:900; font-size:25px; line-height:1.05; }
        .acl-ga__fnote{ font-style:normal; display:block; font-weight:400; font-size:16px;
          color:rgba(22,21,15,.6); margin-top:1px; }
        .acl-ga--ink .acl-ga__fnote{ color:rgba(251,250,244,.6); }
        .acl-ga__f--focus{ border-color:var(--acl-pink); transform:rotate(-.7deg);
          box-shadow:8px 9px 0 rgba(22,21,15,.2); }
        .acl-ga__f--dim{ opacity:.5; }

        /* right: giant number */
        .acl-ga__right{ flex:0 0 820px; position:relative; display:flex; flex-direction:column;
          justify-content:center; }
        .acl-ga__numwrap{ position:relative; display:flex; align-items:flex-start; justify-content:flex-end; gap:6px; }
        .acl-ga__num{ position:relative; z-index:1; font-family:var(--acl-font-num);
          font-size:clamp(230px, 23vw, 332px); line-height:.82; letter-spacing:-.03em;
          color:var(--acl-pink); text-shadow:7px 8px 0 var(--acl-ink); }
        .acl-ga--ink .acl-ga__num{ color:var(--acl-yellow); text-shadow:7px 8px 0 rgba(0,0,0,.5); }
        .acl-ga__unit{ position:relative; z-index:1; font-family:var(--acl-font-num);
          font-size:120px; line-height:1; margin-top:28px; color:var(--acl-ink); }
        .acl-ga--ink .acl-ga__unit{ color:var(--acl-paper); }

        .acl-ga__tiles{ position:relative; z-index:1; display:flex; gap:18px; margin-top:48px;
          justify-content:flex-end; }
        .acl-ga__tile{ flex:0 1 200px; border-top:5px solid var(--acl-ink); padding-top:11px; text-align:right; }
        .acl-ga--ink .acl-ga__tile{ border-color:var(--acl-yellow); }
        .acl-ga__tk{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ga--ink .acl-ga__tk{ color:rgba(251,250,244,.55); }
        .acl-ga__tv{ font-family:var(--acl-font-num); font-size:54px; line-height:.96; margin-top:2px; }
        .acl-ga--ink .acl-ga__tv{ color:var(--acl-yellow); }
        .acl-ga__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:5px; color:rgba(22,21,15,.55); }
        .acl-ga--ink .acl-ga__tv em{ color:rgba(251,250,244,.55); }

        .acl-ga__pin{ position:absolute; right:2px; top:-30px; z-index:2; }

        .acl-ga__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; flex:0 0 auto; z-index:3; margin-top:4px; }
        .acl-ga--ink .acl-ga__foot{ color:var(--acl-paper); }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ga__num{ animation:acl-ga-pop .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-ga__f{ animation:acl-ga-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .25s); }
        }
        @keyframes acl-ga-pop{ from{ opacity:0; transform:translateY(24px) scale(.93); } to{ opacity:1; transform:none; } }
        @keyframes acl-ga-rise{ from{ opacity:0; transform:translateX(-18px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-ga__top">
        <div className="acl-ga__eyebrow">{eyebrow}</div>
        <div className="acl-ga__rule" />
        <div className="acl-ga__kicker">{kicker}</div>
      </div>

      <div className="acl-ga__body">
        {/* ── left: narrative ── */}
        <div className="acl-ga__left">
          <div className="acl-ga__label">{headline}<i>{subheadline}</i></div>
          <div className="acl-ga__cap" dangerouslySetInnerHTML={{ __html: caption }} />

          <div className="acl-ga__ftitle">
            {factorsTitle}
            {showDecor && <Doodle kind="arrowS" size={32} rotate={-14} style={{ position: 'static' }} />}
          </div>
          <div className="acl-ga__factors">
            {items.map((f, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-ga__f' + (isF ? ' acl-ga__f--focus' : '') + (dim ? ' acl-ga__f--dim' : '')}
                  style={{ '--i': i }}>
                  <div className="acl-ga__fn">{String(i + 1).padStart(2, '0')}</div>
                  <div className="acl-ga__ft">{f.label}<em className="acl-ga__fnote">{f.note}</em></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── right: giant number ── */}
        <div className="acl-ga__right">
          <div className="acl-ga__numwrap">
            {showDecor && (
              <div className="acl-ga__pin">
                <Sticker label="湾区" sub="GRAVITY" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-5} size={15} />
              </div>
            )}
            <div className="acl-ga__num">{bigNumber}</div>
            <div className="acl-ga__unit">{bigUnit}</div>
          </div>
          <div className="acl-ga__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-ga__tile">
                <div className="acl-ga__tk">{m.k}</div>
                <div className="acl-ga__tv">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-ga__foot">
        {showDecor && <Doodle kind="loop" size={56} fill={isInk ? 'var(--acl-yellow)' : undefined}
          color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page56GeoAnchor.defaults = {
  // adjustable params
  backgroundTheme: 'primary',   // 'primary' | 'muted' | 'ink'
  factorCount: 4,               // 2–4 advantage factors
  metricCount: 3,               // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,                // spotlight 人才密度
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Bay Area Cluster',
  kicker: '大数字',
  headline: '最大地理中心',
  subheadline: 'SF Bay Area',
  bigNumber: '63.9',
  bigUnit: '%',
  caption: '旧金山湾区吃下全美 <b>63.9% 的 AI 融资额</b>——资本、人才与算力在同一片街区里彼此循环。',
  factorsTitle: '为什么仍是湾区',
  factors: [
    { label: '人才密度', note: '顶尖研究者与工程师高度聚集' },
    { label: '资本网络', note: '头部基金与天使就在隔壁街区' },
    { label: '云厂商邻近', note: '算力与基础设施触手可及' },
    { label: '模型实验室', note: '前沿实验室扎堆，外溢效应强' },
  ],
  metrics: [
    { k: '第二大中心', v: '11.2', unit: '%' },
    { k: '头部实验室', v: '8/10', unit: '在湾区' },
    { k: '平均单笔', v: '14', unit: '亿' },
  ],
  closingLine: '湾区，仍是 AI 资本的重力中心。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page56GeoAnchor.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差大数字)' },
  { key: 'factorCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '要素数量', desc: '左侧优势要素行数量(2–4)' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '大数字下方支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一条优势要素' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'factorCount', step: 1,
    label: '重点对象', desc: '被高亮的优势要素序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与贴纸标签 显隐' },
];

export const defaults = Page56GeoAnchor.defaults;
export const controls = Page56GeoAnchor.controls;
