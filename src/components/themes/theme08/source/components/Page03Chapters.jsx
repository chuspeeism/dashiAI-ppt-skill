// Page03Chapters.jsx — "Chapter Cards / Contents" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ch-`.
// Showcases: card count, focus on/off, focus index, decor toggle.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page03Chapters(props) {
  const p = { ...Page03Chapters.defaults, ...props };
  const {
    backgroundTheme, cardCount, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, chapters, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';
  const cards = chapters.slice(0, cardCount);
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)'];

  return (
    <div className="acl-root acl-ch" style={{ background: bg }}>
      <style>{`
        .acl-ch{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:84px 100px 80px; display:flex; flex-direction:column; }
        .acl-ch__head{ display:flex; align-items:flex-end; gap:30px; }
        .acl-ch__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ch__h{ font-weight:900; font-size:88px; line-height:.95; margin:0; }
        .acl-ch__sub{ font-family:var(--acl-font-hand); font-size:34px; margin-bottom:8px; }
        .acl-ch__row{ flex:1; display:flex; gap:20px; align-items:stretch; margin-top:56px;
          padding-bottom:20px; }
        .acl-ch__card{ flex:1 1 0; min-width:0; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:5px 7px 0 rgba(22,21,15,.15); padding:26px 22px; display:flex;
          flex-direction:column; gap:16px; position:relative; transition:transform .25s;
          align-self:center; height:84%; }
        .acl-ch__card:nth-child(even){ transform:rotate(-1.4deg); }
        .acl-ch__card:nth-child(odd){ transform:rotate(1.1deg); }
        .acl-ch__num{ font-family:var(--acl-font-num); font-size:62px; line-height:.82; }
        .acl-ch__bar{ width:46px; height:7px; background:var(--acl-ink); }
        .acl-ch__name{ font-weight:900; font-size:33px; line-height:1.12; margin-top:auto; }
        .acl-ch__en{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ch__card--focus{ background:var(--acl-ink); color:var(--acl-paper);
          transform:scale(1.06) rotate(-1.5deg) !important; height:96%;
          box-shadow:8px 11px 0 rgba(22,21,15,.3); z-index:3; }
        .acl-ch__card--focus .acl-ch__bar{ background:var(--acl-yellow); }
        .acl-ch__card--focus .acl-ch__num{ color:var(--acl-yellow); }
        .acl-ch__card--focus .acl-ch__en{ color:rgba(255,255,255,.6); }
        .acl-ch__fx{ position:absolute; top:-16px; right:-12px; z-index:4; }
        .acl-ch__foot{ display:flex; align-items:center; gap:16px; font-family:var(--acl-font-hand);
          font-size:30px; margin-top:8px; }
      `}</style>

      <div className="acl-ch__head">
        <div>
          <div className="acl-ch__eyebrow">{eyebrow}</div>
          <h1 className="acl-ch__h">{headline}</h1>
        </div>
        <div className="acl-ch__sub">{subheadline}</div>
        {showDecor && <Doodle kind="arrow" size={84} rotate={6} style={{ position: 'static' }} />}
      </div>

      <div className="acl-ch__row">
        {cards.map((c, i) => {
          const isF = focusEnabled && i === focusIndex;
          return (
            <div key={i} className={'acl-ch__card' + (isF ? ' acl-ch__card--focus' : '')}>
              {isF && showDecor && <div className="acl-ch__fx"><Sticker label="重点" color="var(--acl-yellow)" rotate={8} /></div>}
              <div className="acl-ch__num" style={!isF ? { color: accents[i % accents.length] } : null}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="acl-ch__bar" />
              <div className="acl-ch__name">{c.name}</div>
              <div className="acl-ch__en">{c.en}</div>
            </div>
          );
        })}
      </div>

      <div className="acl-ch__foot">
        {showDecor && <Doodle kind="spark" size={48} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page03Chapters.defaults = {
  backgroundTheme: 'primary',
  cardCount: 7,
  focusEnabled: true,
  focusIndex: 1,
  showDecor: true,
  eyebrow: 'Structure',
  headline: '报告结构',
  subheadline: '从方法到结论的阅读路径',
  chapters: [
    { name: '研究方法', en: 'Methodology' },
    { name: '市场全景', en: 'Market Panorama' },
    { name: '横向透视', en: 'Cross-Section' },
    { name: '产业链', en: 'Value Chain' },
    { name: '典型案例', en: 'Case Studies' },
    { name: '风险展望', en: 'Risk & Outlook' },
    { name: '结论判断', en: 'Conclusion' },
  ],
  closingLine: '先建立框架，再进入数据和判断。',
};

Page03Chapters.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'cardCount', type: 'number', default: 7, min: 3, max: 7, step: 1,
    label: '章节卡数量', desc: '横向章节卡的数量' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一张章节卡' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 6, maxFrom: 'cardCount', step: 1,
    label: '重点对象', desc: '被突出的章节序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page03Chapters.defaults;
export const controls = Page03Chapters.controls;
