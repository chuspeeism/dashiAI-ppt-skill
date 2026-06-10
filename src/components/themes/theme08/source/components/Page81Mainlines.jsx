// Page81Mainlines.jsx — "Outlook Mainlines · Banner Collage + Line Cards" (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ho-`.
// A NEW image layout (distinct from P08 list+scatter, P45 radial hub, P57
// postcards, P62 collage poster, P83 vertical poster columns, P88 photo wall):
// a top FULL-WIDTH BANNER collage — a torn paper band carrying a row of
// aspect-true AdaptiveImageSlots (0–4) behind a tilted oversized headline —
// over a bottom row of count-driven (1–4), focusable "mainline" cards
// (index / name / desc / big value). Pure ESM — no Tweaks/preview-runtime
// dependency; every variation is a prop. CSS scoped + prefixed `acl-ho-`.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page81Mainlines(props) {
  const p = { ...Page81Mainlines.defaults, ...props };
  const {
    backgroundTheme, mediaCount, lineCount, showValueLabels, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, tiles, lines, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)'];

  // top banner — photo slots scale down as the band fills up
  const photos = tiles.slice(0, Math.max(0, mediaCount));
  const pn = photos.length;
  const pbox = pn <= 1 ? 560 : pn === 2 ? 470 : pn === 3 ? 400 : 350;
  const ptilt = [-3, 2.4, -1.8, 2.6];
  const pacc = ['var(--acl-paper)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-paper)'];

  // bottom mainline cards
  const cards = lines.slice(0, Math.max(1, lineCount));
  const cn = cards.length;
  const fIdx = Math.min(focusIndex, cn - 1);

  return (
    <div className="acl-root acl-ho" style={{ background: bg }}>
      <style>{`
        .acl-ho{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:56px 92px 50px; display:flex; flex-direction:column; }

        /* ── banner: photos behind a tilted oversized headline ── */
        .acl-ho__banner{ position:relative; flex:0 0 auto; }
        .acl-ho__band{ position:relative; background:var(--acl-ink); transform:rotate(-1deg);
          padding:26px 40px; box-shadow:8px 11px 0 rgba(22,21,15,.18);
          display:flex; align-items:center; justify-content:center; gap:30px; min-height:300px; }
        .acl-ho__band::before, .acl-ho__band::after{ content:''; position:absolute; left:0; right:0; height:11px;
          background:repeating-linear-gradient(90deg, var(--acl-ink) 0 16px, transparent 16px 30px); }
        .acl-ho__band::before{ top:-11px; } .acl-ho__band::after{ bottom:-11px; transform:scaleY(-1); }
        .acl-ho__pempty{ font-family:var(--acl-font-hand); font-size:34px; color:rgba(251,250,244,.55);
          padding:40px 0; }
        .acl-ho__pcell{ position:relative; transition:transform .28s; }
        .acl-ho__pidx{ position:absolute; top:-16px; left:-13px; z-index:5; font-family:var(--acl-font-num);
          width:46px; height:46px; border-radius:50%; background:var(--acl-yellow); color:var(--acl-ink);
          display:flex; align-items:center; justify-content:center; font-size:24px;
          border:3px solid var(--acl-ink); }

        .acl-ho__title{ position:absolute; left:18px; bottom:-30px; z-index:6; pointer-events:none; }
        .acl-ho__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.16em; text-transform:uppercase; color:var(--acl-ink); margin-bottom:8px;
          background:var(--acl-yellow); display:inline-block; padding:4px 12px; transform:rotate(-1.5deg);
          white-space:nowrap; }
        .acl-ho__h{ font-weight:900; font-size:120px; line-height:.84; margin:0; transform:rotate(-2deg);
          color:var(--acl-paper); -webkit-text-stroke:4px var(--acl-ink);
          text-shadow:7px 8px 0 rgba(22,21,15,.85); letter-spacing:-.01em; }
        .acl-ho__sub{ position:absolute; right:0; top:-6px; font-family:var(--acl-font-mono); font-weight:700;
          font-size:21px; padding:8px 14px; background:var(--acl-pink); color:var(--acl-paper);
          transform:rotate(2.5deg); box-shadow:3px 4px 0 rgba(22,21,15,.25); white-space:nowrap; z-index:7; }

        /* ── summary band ── */
        .acl-ho__summary{ flex:0 0 auto; margin:54px 0 6px auto; max-width:760px; font-weight:700;
          font-size:24px; line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-ho__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; white-space:nowrap; }

        /* ── mainline cards ── */
        .acl-ho__cards{ flex:1; display:flex; align-items:stretch; gap:24px; margin-top:14px; min-height:0; }
        .acl-ho__card{ position:relative; flex:1; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.16); padding:26px 26px 22px; display:flex; flex-direction:column;
          transition:transform .26s; overflow:hidden; }
        .acl-ho__cidx{ font-family:var(--acl-font-num); font-size:64px; line-height:.78;
          color:rgba(22,21,15,.16); }
        .acl-ho__cname{ font-weight:900; font-size:34px; line-height:1.02; margin-top:6px; }
        .acl-ho__ctag{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.55); margin-top:8px; }
        .acl-ho__cdesc{ font-weight:500; font-size:19px; line-height:1.42; color:rgba(22,21,15,.78);
          margin-top:12px; }
        .acl-ho__cval{ font-family:var(--acl-font-num); font-size:62px; line-height:.82; margin-top:auto;
          padding-top:16px; }
        .acl-ho__cval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:6px; color:rgba(22,21,15,.55); }
        .acl-ho__cbar{ position:absolute; left:0; top:0; bottom:0; width:10px; }
        .acl-ho__card--focus{ transform:translateY(-12px); background:var(--acl-ink); color:var(--acl-paper);
          z-index:4; }
        .acl-ho__card--focus .acl-ho__cidx{ color:rgba(251,250,244,.22); }
        .acl-ho__card--focus .acl-ho__ctag{ color:var(--acl-yellow); }
        .acl-ho__card--focus .acl-ho__cdesc{ color:rgba(251,250,244,.82); }
        .acl-ho__card--focus .acl-ho__cval{ color:var(--acl-yellow); }
        .acl-ho__card--focus .acl-ho__cval em{ color:rgba(251,250,244,.6); }
        .acl-ho__cfx{ position:absolute; top:-12px; right:-8px; z-index:6; }

        .acl-ho__foot{ flex:0 0 auto; display:flex; align-items:center; gap:14px; margin-top:14px;
          font-family:var(--acl-font-hand); font-size:27px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ho__pcell{ animation:acl-ho-in .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s); }
          [data-deck-active] .acl-ho__h{ animation:acl-ho-pop .6s cubic-bezier(.3,1.2,.5,1) both .25s; }
          [data-deck-active] .acl-ho__card{ animation:acl-ho-rise .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .35s); }
        }
        @keyframes acl-ho-in{ from{ opacity:0; transform:translateY(26px) scale(.95); } to{ opacity:1; } }
        @keyframes acl-ho-pop{ from{ opacity:0; transform:rotate(-2deg) scale(.8); } to{ opacity:1; transform:rotate(-2deg) scale(1); } }
        @keyframes acl-ho-rise{ from{ opacity:0; transform:translateY(30px); } to{ opacity:1; } }
      `}</style>

      {/* ── top banner: photo collage + tilted headline ── */}
      <div className="acl-ho__banner">
        <div className="acl-ho__band">
          {pn === 0 && <div className="acl-ho__pempty">// 图片数量 = 0</div>}
          {photos.map((t, i) => (
            <div key={i} className="acl-ho__pcell" style={{ transform: `rotate(${ptilt[i % ptilt.length]}deg)`, '--i': i }}>
              <div className="acl-ho__pidx">{String(i + 1).padStart(2, '0')}</div>
              <AdaptiveImageSlot id={'ho-' + i} box={pbox} ratio={t.ratio || 1.3}
                accent={pacc[i % pacc.length]} placeholder={t.name}
                sticker={null} />
            </div>
          ))}
          <div className="acl-ho__sub">{subheadline}</div>
        </div>
        <div className="acl-ho__title">
          <div className="acl-ho__eyebrow">{eyebrow}</div>
          <h1 className="acl-ho__h">{headline}</h1>
        </div>
        {showDecor && <Doodle kind="arrowS" size={86} rotate={6}
          style={{ right: 200, bottom: -24, color: 'var(--acl-ink)' }} />}
      </div>

      <div className="acl-ho__summary" dangerouslySetInnerHTML={{ __html: summary }} />

      {/* ── bottom mainline cards ── */}
      <div className="acl-ho__cards">
        {cards.map((c, i) => {
          const isF = focusEnabled && i === fIdx;
          const acc = accents[i % accents.length];
          return (
            <div key={i} className={'acl-ho__card' + (isF ? ' acl-ho__card--focus' : '')} style={{ '--i': i }}>
              <span className="acl-ho__cbar" style={{ background: acc }} />
              {isF && showDecor && <div className="acl-ho__cfx"><Sticker label="主线" color="var(--acl-yellow)" rotate={8} /></div>}
              <div className="acl-ho__cidx">{String(i + 1).padStart(2, '0')}</div>
              <div className="acl-ho__cname">{c.name}</div>
              <div className="acl-ho__ctag">{c.tag}</div>
              <div className="acl-ho__cdesc">{c.desc}</div>
              {showValueLabels && <div className="acl-ho__cval">{c.value}<em>{c.unit}</em></div>}
            </div>
          );
        })}
      </div>

      <div className="acl-ho__foot">
        {showDecor && <Doodle kind="loop" size={50} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && <Doodle kind="spark" size={34} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 6 }} />}
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page81Mainlines.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  mediaCount: 3,               // 0–4 banner collage photo slots (each adaptive ratio)
  lineCount: 3,                // 1–4 mainline cards
  showValueLabels: true,       // big value on each mainline card
  focusEnabled: true,
  focusIndex: 0,               // which mainline card is emphasised
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: '2025 Outlook · Mainlines',
  headline: '明年的三条主线',
  subheadline: '展望主线',
  summary: '明年的资金不会平均下注，而会沿 <b>少数几条主线</b> 集中加注。',
  // banner photo tiles — each holds one adaptive image slot (count via mediaCount)
  tiles: [
    { name: '基础设施现场', ratio: 1.4 },
    { name: '应用落地场景', ratio: 1.2 },
    { name: '团队与发布', ratio: 1.5 },
    { name: '硬件与算力', ratio: 1.3 },
  ],
  // mainline cards — name / tag / desc / big value (count via lineCount)
  lines: [
    { name: '基础设施兑现', tag: 'Infrastructure', desc: '算力、数据与平台从烧钱转向计费交付。', value: '1240', unit: '亿投入' },
    { name: '应用层收敛', tag: 'Applications', desc: '能接管可计费流程的垂直应用胜出。', value: '38', unit: '% 净留存' },
    { name: '具身与物理 AI', tag: 'Embodied', desc: '从软件走向硬件，机器人与车载提速。', value: '3.4', unit: '× 增速' },
    { name: '安全与合规', tag: 'Safety', desc: '评测、对齐与合规成为交付前置条件。', value: '92', unit: '亿新增' },
  ],
  closingLine: '看清主线，比押中单点更重要。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page81Mainlines.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '顶部横幅拼贴图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'lineCount', type: 'number', default: 3, min: 1, max: 4, step: 1,
    label: '主线数量', desc: '底部主线卡数量(1–4)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '主线卡的大号数值 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一条主线' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, maxFrom: 'lineCount', step: 1,
    label: '重点对象', desc: '被突出的主线序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page81Mainlines.defaults;
export const controls = Page81Mainlines.controls;
