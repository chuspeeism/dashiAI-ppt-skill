// Page08Cases.jsx — "Case Studies" template page (image-led collage)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ca-`.
// Left: readable case list (text, not parameterized). Right: a count-driven
// collage of AdaptiveImageSlots (0–n) — each slot resizes to its uploaded
// photo's aspect ratio, and the layout preset rebalances per count so the
// composition stays balanced. No dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page08Cases(props) {
  const p = { ...Page08Cases.defaults, ...props };
  const {
    backgroundTheme, mediaCount, focusEnabled, focusIndex, showStats, showDecor,
    eyebrow, headline, subheadline, summary, cases, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const fIdx = Math.min(focusIndex, cases.length - 1);
  const slots = collage[mediaCount] || [];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)'];

  return (
    <div className="acl-root acl-ca" style={{ background: bg }}>
      <style>{`
        .acl-ca{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-ca__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-ca__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ca__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-ca__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ca__body{ flex:1; display:flex; gap:40px; margin-top:30px; min-height:0; }
        .acl-ca__left{ flex:0 0 640px; display:flex; flex-direction:column; }
        .acl-ca__summary{ font-weight:700; font-size:25px; line-height:1.46; margin-bottom:26px; }
        .acl-ca__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-ca__list{ flex:1; display:flex; flex-direction:column; gap:16px; }
        .acl-ca__case{ flex:1; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:5px 7px 0 rgba(22,21,15,.14); padding:18px 24px; display:flex; align-items:center;
          gap:22px; position:relative; transition:transform .25s; }
        .acl-ca__idx{ font-family:var(--acl-font-num); font-size:50px; line-height:.8; flex:0 0 auto;
          width:60px; }
        .acl-ca__cmid{ flex:1; min-width:0; }
        .acl-ca__crow{ display:flex; align-items:baseline; gap:12px; min-width:0; }
        .acl-ca__cname{ font-weight:900; font-size:30px; line-height:1; white-space:nowrap; }
        .acl-ca__ctag{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; padding:3px 9px; background:var(--acl-ink); color:var(--acl-paper);
          white-space:nowrap; flex:0 0 auto; }
        .acl-ca__clogic{ font-weight:700; font-size:19px; color:rgba(22,21,15,.66); margin-top:6px; }
        .acl-ca__cstats{ display:flex; gap:16px; flex:0 0 auto; }
        .acl-ca__stat{ text-align:right; white-space:nowrap; }
        .acl-ca__stat .k{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.45); white-space:nowrap; }
        .acl-ca__stat .v{ font-family:var(--acl-font-num); font-size:25px; line-height:1; white-space:nowrap; }
        .acl-ca__case--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:scale(1.02);
          z-index:2; box-shadow:8px 10px 0 rgba(22,21,15,.26); }
        .acl-ca__case--focus .acl-ca__ctag{ background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-ca__case--focus .acl-ca__clogic{ color:rgba(255,255,255,.78); }
        .acl-ca__case--focus .acl-ca__stat .k{ color:rgba(255,255,255,.5); }
        .acl-ca__case--focus .acl-ca__idx{ color:var(--acl-yellow); }
        .acl-ca__cfx{ position:absolute; top:-15px; right:-12px; z-index:4; }
        /* collage stage */
        .acl-ca__stage{ flex:1; position:relative; min-width:0; }
        .acl-ca__slot{ position:absolute; }
        .acl-ca__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }
        .acl-ca__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; }
      `}</style>

      <div className="acl-ca__head">
        <div>
          <div className="acl-ca__eyebrow">{eyebrow}</div>
          <h1 className="acl-ca__h">{headline}</h1>
        </div>
        <div className="acl-ca__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={46} rotate={8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-ca__body">
        {/* ── left: readable case list ── */}
        <div className="acl-ca__left">
          <div className="acl-ca__summary" dangerouslySetInnerHTML={{ __html: summary }} />
          <div className="acl-ca__list">
            {cases.map((c, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-ca__case' + (isF ? ' acl-ca__case--focus' : '')}>
                  {isF && showDecor && <div className="acl-ca__cfx"><Sticker label="焦点案例" color="var(--acl-yellow)" rotate={6} /></div>}
                  <div className="acl-ca__idx" style={!isF ? { color: accents[i % accents.length] } : null}>{String(i + 1).padStart(2, '0')}</div>
                  <div className="acl-ca__cmid">
                    <div className="acl-ca__crow">
                      <span className="acl-ca__cname">{c.company}</span>
                      <span className="acl-ca__ctag">{c.tag}</span>
                    </div>
                    <div className="acl-ca__clogic">{c.logic}</div>
                  </div>
                  {showStats && (
                    <div className="acl-ca__cstats">
                      {c.metrics.map((m, j) => (
                        <div key={j} className="acl-ca__stat"><div className="k">{m.k}</div><div className="v">{m.v}</div></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── right: adaptive image collage (count-driven) ── */}
        <div className="acl-ca__stage">
          {slots.length === 0 && (
            <div className="acl-ca__empty">// 图片数量 = 0</div>
          )}
          {slots.map((s, i) => {
            const c = cases[i % cases.length];
            return (
              <div className="acl-ca__slot" key={i} style={{ left: s.l, top: s.t }}>
                <AdaptiveImageSlot id={'case-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                  accent="var(--acl-paper)" placeholder={c ? c.company : '图片'}
                  sticker={{ label: c ? c.company : 'FIG.' + (i + 1), sub: c ? c.tag : null,
                    color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
              </div>
            );
          })}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <Doodle kind="arrow" size={84} rotate={150} color="var(--acl-ink)" style={{ left: -10, top: -20 }} />
              <Doodle kind="heart" size={40} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 10, bottom: 40 }} />
              <Doodle kind="spark" size={32} rotate={6} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ right: 120, top: 8 }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-ca__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page08Cases.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 3,
  focusEnabled: true,
  focusIndex: 0,
  showStats: true,
  showDecor: true,
  eyebrow: 'Case Studies',
  headline: '典型案例深度剖析',
  subheadline: '三类资本逻辑的代表公司',
  summary: 'Anthropic、xAI 与 CoreWeave 分别代表<b>安全模型、实时数据生态与算力基础设施</b>三类资本逻辑。',
  cases: [
    { company: 'Anthropic', tag: '模型公司', logic: '安全对齐 · 可信企业级模型', metrics: [{ k: '累计融资', v: '650亿' }, { k: '方向', v: 'Claude' }] },
    { company: 'xAI', tag: '生态公司', logic: '实时数据 · 多模态生态', metrics: [{ k: '单笔融资', v: '50亿' }, { k: '入口', v: 'X' }] },
    { company: 'CoreWeave', tag: '基础设施', logic: 'GPU 云 · 算力资源稀缺', metrics: [{ k: '融资额', v: '110亿' }, { k: 'GPU', v: '7.8万' }] },
  ],
  // count-driven collage presets — slot box/rotation tuned per count for balance.
  // stage area is the right body column (~960×720). slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 220, t: 120, box: 460, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 70, t: 60, box: 380, r: -4, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)' },
      { l: 430, t: 350, box: 360, r: 4, ratio: 0.82, sr: 3, color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 320, t: 20, box: 360, r: 3, ratio: 0.84, sr: -4, color: 'var(--acl-yellow)' },
      { l: 30, t: 250, box: 320, r: -5, ratio: 1.22, sr: 4, color: 'var(--acl-blue)' },
      { l: 470, t: 400, box: 280, r: 5, ratio: 0.8, sr: -3, color: 'var(--acl-pink)' },
    ],
    4: [
      { l: 360, t: 0, box: 300, r: 3, ratio: 0.84, sr: -4, color: 'var(--acl-yellow)' },
      { l: 40, t: 110, box: 270, r: -5, ratio: 0.9, sr: 4, color: 'var(--acl-blue)' },
      { l: 160, t: 420, box: 290, r: 4, ratio: 1.2, sr: -3, color: 'var(--acl-pink)' },
      { l: 540, t: 360, box: 260, r: -4, ratio: 0.82, sr: 5, color: 'var(--acl-red)' },
    ],
  },
  closingLine: '不同案例指向同一个问题：技术优势能否转成可持续收入。',
};

Page08Cases.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showStats', type: 'boolean', default: true,
    label: '案例指标', desc: '案例行右侧的关键指标显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个案例' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 2, step: 1,
    label: '重点对象', desc: '被突出的案例序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page08Cases.defaults;
export const controls = Page08Cases.controls;
