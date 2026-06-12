// Page88PhotoWall.jsx — "Coverage · Photo Wall" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pw-`.
// A NEW image layout (distinct from P08 list+scatter, P31 branch cards, P43
// stepped path cards, P57 postcards, P58 vertical track, P83 poster columns,
// P85 hero split): a tilted scrapbook PHOTO WALL — a count-driven flex-wrap
// collage of aspect-true AdaptiveImageSlots with sticker captions, one slot
// optionally enlarged (focus). Bottom-right stat badge. Pure ESM.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page88PhotoWall(props) {
  const p = { ...Page88PhotoWall.defaults, ...props };
  const {
    backgroundTheme, mediaCount, showCaptions, showStat, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, tiles, stat, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = tiles.slice(0, Math.max(0, mediaCount));
  const n = items.length;
  const fIdx = Math.min(focusIndex, Math.max(0, n - 1));
  // base slot box scales down as the wall fills up so the collage stays balanced
  const baseBox = n <= 2 ? 430 : n <= 3 ? 376 : n <= 4 ? 330 : n <= 5 ? 300 : 272;
  const tilt = [-3, 2.2, -1.6, 3, -2.4, 1.6];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-paper)', 'var(--acl-red)', 'var(--acl-yellow)', 'var(--acl-blue)'];

  return (
    <div className="acl-root acl-pw" style={{ background: bg }}>
      <style>{`
        .acl-pw{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:62px 92px 54px; display:flex; flex-direction:column; }
        .acl-pw__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; z-index:3; }
        .acl-pw__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:8px; }
        .acl-pw__h{ font-weight:900; font-size:74px; line-height:.94; margin:0; }
        .acl-pw__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg); white-space:nowrap; }
        .acl-pw__summary{ margin-left:auto; max-width:440px; font-weight:700; font-size:22px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-pw__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; white-space:nowrap; }

        .acl-pw__wall{ flex:1; position:relative; display:flex; flex-wrap:wrap; align-items:center;
          justify-content:center; gap:30px 34px; padding:14px 8px; min-height:0; }
        .acl-pw__empty{ font-family:var(--acl-font-hand); font-size:38px; color:rgba(22,21,15,.4); }
        .acl-pw__cell{ position:relative; transition:transform .28s; }
        .acl-pw__idx{ position:absolute; top:-20px; left:-16px; z-index:6; font-family:var(--acl-font-num);
          width:54px; height:54px; border-radius:50%; background:var(--acl-ink); color:var(--acl-paper);
          display:flex; align-items:center; justify-content:center; font-size:28px;
          border:3px solid var(--acl-paper); box-shadow:3px 4px 0 rgba(22,21,15,.25); }
        .acl-pw__cap{ position:absolute; left:50%; bottom:-16px; transform:translateX(-50%); z-index:6; }
        .acl-pw__cell--focus{ z-index:7; }
        .acl-pw__cfx{ position:absolute; top:-26px; right:-18px; z-index:8; }

        .acl-pw__stat{ position:absolute; right:14px; bottom:6px; z-index:7; display:flex; align-items:center;
          gap:14px; background:var(--acl-ink); color:var(--acl-paper); padding:14px 22px;
          transform:rotate(-2deg); box-shadow:5px 7px 0 rgba(22,21,15,.22); }
        .acl-pw__statn{ font-family:var(--acl-font-num); font-size:64px; line-height:.8; color:var(--acl-yellow); }
        .acl-pw__statt{ display:flex; flex-direction:column; }
        .acl-pw__statt b{ font-weight:900; font-size:22px; line-height:1.1; }
        .acl-pw__statt span{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(255,255,255,.6); }

        .acl-pw__foot{ flex:0 0 auto; display:flex; align-items:center; gap:14px; margin-top:8px; z-index:3;
          font-family:var(--acl-font-hand); font-size:27px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pw__cell{ animation:acl-pw-in .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s); }
          [data-deck-active] .acl-pw__stat{ animation:acl-pw-pop .5s cubic-bezier(.3,1.3,.5,1) both .5s; }
        }
        @keyframes acl-pw-in{ from{ opacity:0; transform:translateY(30px) scale(.94); } to{ opacity:1; } }
        @keyframes acl-pw-pop{ from{ opacity:0; transform:rotate(-2deg) scale(.6); } to{ opacity:1; transform:rotate(-2deg) scale(1); } }
      `}</style>

      <div className="acl-pw__head">
        <div>
          <div className="acl-pw__eyebrow">{eyebrow}</div>
          <h1 className="acl-pw__h">{headline}</h1>
        </div>
        <div className="acl-pw__sub">{subheadline}</div>
        <div className="acl-pw__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-pw__wall">
        {n === 0 && <div className="acl-pw__empty">// 图片数量 = 0</div>}
        {items.map((t, i) => {
          const isF = focusEnabled && i === fIdx;
          const box = Math.round(baseBox * (isF ? 1.34 : 1));
          return (
            <div key={i} className={'acl-pw__cell' + (isF ? ' acl-pw__cell--focus' : '')}
              style={{ transform: `rotate(${isF ? 0 : tilt[i % tilt.length]}deg)`, '--i': i }}>
              <div className="acl-pw__idx">{String(i + 1).padStart(2, '0')}</div>
              {isF && showDecor && <div className="acl-pw__cfx"><Sticker label="焦点" color="var(--acl-yellow)" subColor="var(--acl-pink)" sub="FOCUS" rotate={8} /></div>}
              <AdaptiveImageSlot id={'pw-' + i} box={box} ratio={t.ratio || 0.82}
                accent={isF ? 'var(--acl-pink)' : accents[i % accents.length]} placeholder={t.name}
                sticker={showCaptions ? { label: t.name, sub: t.tag, color: accents[i % accents.length], subColor: 'var(--acl-ink)', rotate: i % 2 ? 3 : -3 } : null} />
            </div>
          );
        })}

        {showStat && n > 0 && (
          <div className="acl-pw__stat">
            <span className="acl-pw__statn">{stat.value}</span>
            <span className="acl-pw__statt"><b>{stat.label}</b><span>{stat.en}</span></span>
          </div>
        )}
      </div>

      <div className="acl-pw__foot">
        {showDecor && <Doodle kind="loop" size={50} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && n > 0 && <Doodle kind="spark" size={34} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 6 }} />}
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page88PhotoWall.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  mediaCount: 5,               // 0–6 photo slots (each adaptive ratio)
  showCaptions: true,          // sticker caption under each photo
  showStat: true,              // bottom-right stat badge
  focusEnabled: true,
  focusIndex: 0,               // which photo is enlarged
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Coverage · 覆盖群像',
  headline: '一年内的高光现场',
  subheadline: '照片墙',
  summary: '把分散的现场拼成一面墙，<b>密度本身</b>就是叙事。',
  // photo tiles — each holds one adaptive image slot (count via mediaCount)
  tiles: [
    { name: '发布现场', tag: 'Launch', ratio: 0.82 },
    { name: '团队群像', tag: 'Team', ratio: 1.2 },
    { name: '数据中心', tag: 'Infra', ratio: 1.34 },
    { name: '路演瞬间', tag: 'Pitch', ratio: 0.78 },
    { name: '签约时刻', tag: 'Deal', ratio: 1.1 },
    { name: '产品特写', tag: 'Product', ratio: 0.9 },
  ],
  stat: { value: '97', label: '高光事件', en: 'Highlight Events' },
  closingLine: '把一年的现场，钉成一面可记忆的墙。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page88PhotoWall.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 5, min: 0, max: 6, step: 1,
    label: '图片数量', desc: '照片墙图片槽数量(0–6)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showCaptions', type: 'boolean', default: true,
    label: '照片标签', desc: '每张照片的贴纸标签 显隐' },
  { key: 'showStat', type: 'boolean', default: true,
    label: '统计徽标', desc: '右下角统计数字徽标 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否放大突出某一张照片' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 5, step: 1, maxFrom: 'mediaCount',
    label: '重点对象', desc: '被放大突出的照片序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page88PhotoWall.defaults;
export const controls = Page88PhotoWall.controls;
