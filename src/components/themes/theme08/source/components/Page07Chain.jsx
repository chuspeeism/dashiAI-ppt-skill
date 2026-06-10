// Page07Chain.jsx — "Value Chain" template page (layered stack + region panel)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-vc-`.
// Left: vertical chain of layer bands (up→mid→down) with a focus layer.
// Right: an optional distribution panel (region share).
// No dependency on the Tweaks panel — preview maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const ACCENTS = ['var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-red)'];

export default function Page07Chain(props) {
  const p = { ...Page07Chain.defaults, ...props };
  const {
    backgroundTheme, layerCount, focusEnabled, focusIndex, showRegion, regionCount, showDecor,
    eyebrow, headline, subheadline, summary, layers, regionTitle, regions, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const bands = layers.slice(0, layerCount);
  const fIdx = Math.min(focusIndex, bands.length - 1);
  const regs = regions.slice(0, regionCount);
  const regMax = Math.max(...regs.map((r) => r.pct));

  return (
    <div className="acl-root acl-vc" style={{ background: bg }}>
      <style>{`
        .acl-vc{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-vc__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-vc__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-vc__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-vc__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-vc__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-vc__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-vc__body{ flex:1; display:flex; gap:46px; margin-top:32px; align-items:stretch; }
        .acl-vc__chain{ flex:1; display:flex; flex-direction:column; gap:18px; min-width:0; }
        .acl-vc__band{ flex:1; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.15); padding:22px 30px; display:flex; align-items:center;
          gap:28px; position:relative; transition:transform .25s; }
        .acl-vc__axis{ font-family:var(--acl-font-num); font-size:72px; line-height:.8; flex:0 0 auto;
          width:96px; text-align:center; }
        .acl-vc__mid{ flex:1; min-width:0; }
        .acl-vc__name{ font-weight:900; font-size:34px; line-height:1; }
        .acl-vc__en{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:4px 0 12px; }
        .acl-vc__chips{ display:flex; flex-wrap:wrap; gap:9px; }
        .acl-vc__chip{ font-weight:700; font-size:19px; padding:6px 14px; border:2px solid var(--acl-ink);
          background:var(--acl-yellow); }
        .acl-vc__note{ flex:0 0 200px; text-align:right; font-weight:700; font-size:21px;
          line-height:1.3; color:rgba(22,21,15,.7); }
        .acl-vc__band--focus{ background:var(--acl-ink); color:var(--acl-paper);
          transform:scale(1.025); z-index:3; box-shadow:9px 11px 0 rgba(22,21,15,.28); }
        .acl-vc__band--focus .acl-vc__axis{ color:var(--acl-yellow); }
        .acl-vc__band--focus .acl-vc__en{ color:rgba(255,255,255,.55); }
        .acl-vc__band--focus .acl-vc__chip{ background:transparent; border-color:var(--acl-yellow);
          color:var(--acl-yellow); }
        .acl-vc__band--focus .acl-vc__note{ color:rgba(255,255,255,.8); }
        .acl-vc__fx{ position:absolute; top:-16px; right:-12px; z-index:5; }
        .acl-vc__flow{ position:absolute; left:54px; bottom:-22px; z-index:4; }
        /* region panel */
        .acl-vc__region{ flex:0 0 540px; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:8px 10px 0 rgba(22,21,15,.16); padding:30px 36px; display:flex; flex-direction:column;
          position:relative; }
        .acl-vc__rtitle{ font-weight:900; font-size:28px; margin:0 0 4px; display:flex; align-items:center; gap:12px; }
        .acl-vc__rtag{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:22px; }
        .acl-vc__rlist{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:20px; }
        .acl-vc__rrow{ position:relative; }
        .acl-vc__rtop{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:7px; }
        .acl-vc__rtop b{ font-weight:900; font-size:22px; }
        .acl-vc__rtop .pc{ font-family:var(--acl-font-num); font-size:30px; }
        .acl-vc__rtrack{ height:22px; background:rgba(22,21,15,.08); }
        .acl-vc__rfill{ height:100%; transition:width .5s; }
        .acl-vc__rfx{ position:absolute; right:-8px; top:-22px; z-index:3; }
        .acl-vc__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; }
      `}</style>

      <div className="acl-vc__head">
        <div>
          <div className="acl-vc__eyebrow">{eyebrow}</div>
          <h1 className="acl-vc__h">{headline}</h1>
        </div>
        <div className="acl-vc__sub">{subheadline}</div>
        <div className="acl-vc__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-vc__body">
        {/* ── chain ── */}
        <div className="acl-vc__chain">
          {bands.map((b, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-vc__band' + (isF ? ' acl-vc__band--focus' : '')}>
                {isF && showDecor && <div className="acl-vc__fx"><Sticker label="资本焦点" color="var(--acl-yellow)" rotate={6} /></div>}
                <div className="acl-vc__axis" style={!isF ? { color: ACCENTS[i % ACCENTS.length] } : null}>{b.axis}</div>
                <div className="acl-vc__mid">
                  <div className="acl-vc__name">{b.name}</div>
                  <div className="acl-vc__en">{b.en}</div>
                  <div className="acl-vc__chips">
                    {b.items.map((it, j) => <span key={j} className="acl-vc__chip">{it}</span>)}
                  </div>
                </div>
                <div className="acl-vc__note">{b.note}</div>
                {showDecor && i < bands.length - 1 && (
                  <div className="acl-vc__flow"><Doodle kind="arrow" size={54} rotate={92} color="var(--acl-pink)" style={{ position: 'static' }} /></div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── region distribution ── */}
        {showRegion && (
          <div className="acl-vc__region">
            <h3 className="acl-vc__rtitle">{regionTitle}
              {showDecor && <Doodle kind="spark" size={36} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}</h3>
            <div className="acl-vc__rtag">Geographic Share · %</div>
            <div className="acl-vc__rlist">
              {regs.map((r, i) => (
                <div key={i} className="acl-vc__rrow">
                  {r.focus && showDecor && <div className="acl-vc__rfx"><Sticker label="地理护城河" color="var(--acl-pink)" rotate={4} /></div>}
                  <div className="acl-vc__rtop"><b>{r.label}</b><span className="pc">{r.pct}%</span></div>
                  <div className="acl-vc__rtrack">
                    <div className="acl-vc__rfill" style={{ width: (r.pct / regMax) * 100 + '%', background: r.focus ? 'var(--acl-ink)' : ACCENTS[i % ACCENTS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="acl-vc__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page07Chain.defaults = {
  backgroundTheme: 'primary',
  layerCount: 3,
  focusEnabled: true,
  focusIndex: 1,
  showRegion: true,
  regionCount: 5,
  showDecor: true,
  eyebrow: 'Value Chain',
  headline: '产业链分层透视',
  subheadline: '上游、中游、下游的资本位置',
  summary: 'AI 融资沿基础设施、模型与应用<b>三层展开</b>，地区上高度集中于湾区。',
  layers: [
    { axis: '上', name: '上游 · 基础设施', en: 'Infrastructure', items: ['算力', 'AI 芯片', '数据'], note: '资本确定性最高' },
    { axis: '中', name: '中游 · 模型层', en: 'Model Layer', items: ['通用模型', '专用模型'], note: '叙事与估值集中' },
    { axis: '下', name: '下游 · 应用层', en: 'Application', items: ['企业应用', 'AI 搜索', '机器人'], note: '商业兑现待验证' },
  ],
  regionTitle: '地区分布',
  regions: [
    { label: '旧金山湾区', pct: 63.9, focus: true },
    { label: '纽约', pct: 12.4 },
    { label: '西雅图', pct: 9.8 },
    { label: '波士顿', pct: 7.7 },
    { label: '其他地区', pct: 6.2 },
  ],
  closingLine: '产业链分层，决定了资本确定性与商业风险的不同位置。',
};

Page07Chain.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'layerCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '分层数量', desc: '产业链层数(上/中/下游)' },
  { key: 'showRegion', type: 'boolean', default: true,
    label: '副面板(地区)', desc: '右侧地区分布面板的显示/隐藏' },
  { key: 'regionCount', type: 'number', default: 5, min: 3, max: 5, step: 1,
    label: '地区数量', desc: '地区分布条的数量' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一层' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, maxFrom: 'layerCount', step: 1,
    label: '重点对象', desc: '被突出的分层序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page07Chain.defaults;
export const controls = Page07Chain.controls;
