// Page57NewYork.jsx — "Geo Card · Postcard Collage" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gh-`.
// A geographic-cluster card built as an editorial postcard: left narrative
// column (caption + count-driven focusable industry chips + metric tiles) and a
// right scrapbook collage of AdaptiveImageSlots (0–n, each resizing to its own
// uploaded photo ratio) with a tilted "share" badge pinned among the photos.
// Fully portable — no Tweaks / preview-runtime dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, MetaTag, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page57NewYork(props) {
  const p = { ...Page57NewYork.defaults, ...props };
  const {
    backgroundTheme, mediaCount, tagCount, metricCount, showShare,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, place, caption, tagsTitle, tags,
    shareValue, shareLabel, metrics, collage, sharePos, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const chips = tags.slice(0, Math.max(2, tagCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, chips.length - 1);
  const slots = collage[mediaCount] || [];
  const sPos = sharePos[mediaCount] || { l: '50%', t: '6%' };
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-yellow)', 'var(--acl-red)'];

  return (
    <div className="acl-root acl-gh" style={{ background: bg }}>
      <style>{`
        .acl-gh{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 60px; display:flex; flex-direction:column; }
        .acl-gh__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-gh__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gh__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-gh__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-gh__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-gh__h{ font-weight:900; font-size:78px; line-height:.92; margin:0; }
        .acl-gh__place{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:9px 15px; background:var(--acl-pink); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-gh__body{ flex:1; display:flex; gap:46px; margin-top:26px; min-height:0; }
        .acl-gh__left{ flex:0 0 700px; display:flex; flex-direction:column; min-width:0; }
        .acl-gh__cap{ font-weight:700; font-size:26px; line-height:1.46; }
        .acl-gh__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-gh__tagttl{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:30px 0 14px; display:flex;
          align-items:center; gap:10px; }
        .acl-gh__chips{ display:flex; flex-wrap:wrap; gap:13px; }
        .acl-gh__chip{ display:flex; align-items:center; gap:11px; padding:12px 20px 12px 13px;
          border:3px solid var(--acl-ink); background:var(--acl-paper); box-shadow:4px 5px 0 rgba(22,21,15,.14);
          font-weight:900; font-size:25px; line-height:1; transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-gh__dot{ width:18px; height:18px; border-radius:50%; flex:0 0 auto; }
        .acl-gh__chip--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:rotate(-1.5deg) scale(1.04);
          box-shadow:6px 8px 0 rgba(22,21,15,.24); }
        .acl-gh__chip--dim{ opacity:.46; }
        .acl-gh__chipwrap{ position:relative; }
        .acl-gh__chipfx{ position:absolute; top:-18px; right:-10px; z-index:4; }

        .acl-gh__tiles{ display:flex; gap:30px; margin-top:auto; padding-top:26px; }
        .acl-gh__tile{ position:relative; }
        .acl-gh__tile .acl-metatag .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.9; }
        .acl-gh__tile .acl-metatag .v em{ font-style:normal; font-size:18px; font-family:var(--acl-font-cn);
          font-weight:700; margin-left:4px; color:rgba(22,21,15,.5); }

        /* right: collage stage */
        .acl-gh__stage{ flex:1; position:relative; min-width:0; }
        .acl-gh__slot{ position:absolute; }
        .acl-gh__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }
        .acl-gh__share{ position:absolute; z-index:5; background:var(--acl-ink); color:var(--acl-paper);
          padding:18px 26px 16px; transform:rotate(3deg); box-shadow:6px 8px 0 rgba(22,21,15,.28);
          text-align:center; }
        .acl-gh__sharev{ font-family:var(--acl-font-num); font-size:96px; line-height:.82; color:var(--acl-yellow); }
        .acl-gh__sharek{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(251,250,244,.7); margin-top:6px; }

        .acl-gh__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gh__chip{ animation:acl-gh-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .2s); }
          [data-deck-active] .acl-gh__share{ animation:acl-gh-pop .55s cubic-bezier(.2,.8,.2,1) .3s both; }
        }
        @keyframes acl-gh-rise{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; } }
        @keyframes acl-gh-pop{ from{ opacity:0; transform:rotate(3deg) scale(.8); } to{ opacity:1; transform:rotate(3deg) scale(1); } }
      `}</style>

      <div className="acl-gh__top">
        <div className="acl-gh__eyebrow">{eyebrow}</div>
        <div className="acl-gh__rule" />
        <div className="acl-gh__kicker">{kicker}</div>
      </div>

      <div className="acl-gh__head">
        <h1 className="acl-gh__h">{headline}</h1>
        <div className="acl-gh__place">{place}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-gh__body">
        {/* ── left: narrative + chips + tiles ── */}
        <div className="acl-gh__left">
          <div className="acl-gh__cap" dangerouslySetInnerHTML={{ __html: caption }} />

          <div className="acl-gh__tagttl">
            {tagsTitle}
            {showDecor && <Doodle kind="arrowS" size={30} rotate={-12} style={{ position: 'static' }} />}
          </div>
          <div className="acl-gh__chips">
            {chips.map((tg, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div className="acl-gh__chipwrap" key={i}>
                  {isF && showDecor && <div className="acl-gh__chipfx"><Sticker label="重点" color="var(--acl-yellow)" rotate={7} size={13} /></div>}
                  <div className={'acl-gh__chip' + (isF ? ' acl-gh__chip--focus' : '') + (dim ? ' acl-gh__chip--dim' : '')} style={{ '--i': i }}>
                    <span className="acl-gh__dot" style={{ background: accents[i % accents.length] }} />
                    {tg}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="acl-gh__tiles">
            {tiles.map((m, i) => (
              <div className="acl-gh__tile" key={i}>
                <MetaTag k={m.k} v={<React.Fragment>{m.v}{m.unit && <em>{m.unit}</em>}</React.Fragment>} />
              </div>
            ))}
          </div>
        </div>

        {/* ── right: postcard collage ── */}
        <div className="acl-gh__stage">
          {slots.length === 0 && <div className="acl-gh__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-gh__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'ny-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={chips[i % chips.length] || '图片'}
                sticker={{ label: chips[i % chips.length] || ('FIG.' + (i + 1)), color: s.color, rotate: s.sr }} />
            </div>
          ))}
          {showShare && (
            <div className="acl-gh__share" style={{ left: sPos.l, top: sPos.t }}>
              <div className="acl-gh__sharev">{shareValue}</div>
              <div className="acl-gh__sharek">{shareLabel}</div>
            </div>
          )}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <Doodle kind="arrow" size={78} rotate={158} color="var(--acl-ink)" style={{ left: -6, bottom: 30 }} />
              <Doodle kind="heart" size={36} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 12, bottom: 70 }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-gh__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page57NewYork.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 3,
  tagCount: 4,
  metricCount: 4,
  showShare: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'New York Cluster',
  kicker: '城市卡',
  headline: '行业客户优势',
  place: '纽约集群 · NEW YORK',
  caption: '纽约的 AI 融资以 <b>金融、媒体、企业服务与法律 AI</b> 为主——它的护城河不在基础模型，而在高价值行业客户的密度。',
  tagsTitle: '主要行业方向',
  tags: ['金融科技', '媒体内容', '企业服务', '法律 AI', '广告营销'],
  shareValue: '12.4%',
  shareLabel: 'Share of US',
  metrics: [
    { k: '融资额', v: '120', unit: '亿' },
    { k: '占比', v: '12.4', unit: '%' },
    { k: '事件数', v: '14', unit: '笔' },
    { k: '平均单笔', v: '8.6', unit: '亿' },
  ],
  // count-driven collage presets — stage ≈ 880×680, each slot resizes to its ratio.
  collage: {
    0: [],
    1: [
      { l: 150, t: 150, box: 470, r: -3, ratio: 1.25, sr: -4, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 40, t: 70, box: 400, r: -4, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
      { l: 420, t: 360, box: 380, r: 4, ratio: 0.82, sr: 4, color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 20, t: 30, box: 360, r: -4, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
      { l: 470, t: 230, box: 320, r: 4, ratio: 0.84, sr: 4, color: 'var(--acl-blue)' },
      { l: 120, t: 470, box: 300, r: 3, ratio: 1.1, sr: -3, color: 'var(--acl-pink)' },
    ],
    4: [
      { l: 20, t: 30, box: 320, r: -4, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)' },
      { l: 410, t: 220, box: 290, r: 4, ratio: 0.84, sr: 4, color: 'var(--acl-blue)' },
      { l: 150, t: 420, box: 280, r: 3, ratio: 1.12, sr: -3, color: 'var(--acl-pink)' },
      { l: 540, t: 480, box: 240, r: -3, ratio: 0.86, sr: 5, color: 'var(--acl-red)' },
    ],
  },
  // share-badge position, keyed by mediaCount (placed into the collage gap).
  sharePos: {
    0: { l: '32%', t: '34%' },
    1: { l: '50%', t: '2%' },
    2: { l: '4%', t: '60%' },
    3: { l: '62%', t: '2%' },
    4: { l: '60%', t: '4%' },
  },
  closingLine: '行业客户密度，决定垂直应用的落地机会。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page57NewYork.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'tagCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '标签数量', desc: '行业方向标签数量(2–5)' },
  { key: 'metricCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–4)' },
  { key: 'showShare', type: 'boolean', default: true,
    label: '占比徽标', desc: '拼贴中的大号占比徽标 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个行业标签' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'tagCount', step: 1,
    label: '重点对象', desc: '被突出的标签序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page57NewYork.defaults;
export const controls = Page57NewYork.controls;
