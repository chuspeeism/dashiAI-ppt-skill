// Page83Playbooks.jsx — "Playbooks · Poster Columns" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pc-`.
// A NEW image layout (distinct from P08 list+scatter, P31 branch cards, P43
// stepped path cards, P57 postcards, P58 vertical track): a row of FULL-HEIGHT
// "poster columns" — each column is one aspect-true AdaptiveImageSlot pinned over
// an ink caption plate (title / tag / big value), count-driven (0–4), focusable.
// Pure ESM — no Tweaks/preview-runtime dependency; every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page83Playbooks(props) {
  const p = { ...Page83Playbooks.defaults, ...props };
  const {
    backgroundTheme, cardCount, focusEnabled, focusIndex, showValue, showTag, showDecor,
    eyebrow, headline, subheadline, summary, cards, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = cards.slice(0, Math.max(0, cardCount));
  const n = items.length;
  const fIdx = Math.min(focusIndex, Math.max(0, n - 1));
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)'];
  // column width + slot bounding box tuned per count for a balanced poster row
  const colW = n <= 1 ? 720 : n === 2 ? 560 : n === 3 ? 472 : 384;
  const box = Math.min(colW, 470);
  const tilt = [-2.5, 1.8, -1.6, 2.2];

  return (
    <div className="acl-root acl-pc" style={{ background: bg }}>
      <style>{`
        .acl-pc{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:66px 100px 54px; display:flex; flex-direction:column; }
        .acl-pc__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-pc__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:8px; }
        .acl-pc__h{ font-weight:900; font-size:76px; line-height:.94; margin:0; }
        .acl-pc__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-pc__summary{ margin-left:auto; max-width:470px; font-weight:700; font-size:23px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-pc__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-pc__row{ flex:1; display:flex; align-items:center; justify-content:center; gap:36px;
          margin-top:18px; min-height:0; }
        .acl-pc__empty{ font-family:var(--acl-font-hand); font-size:38px; color:rgba(22,21,15,.4); }
        .acl-pc__col{ position:relative; display:flex; flex-direction:column; align-items:center;
          transition:transform .28s; }
        .acl-pc__imgwrap{ display:flex; align-items:flex-end; justify-content:center; }
        .acl-pc__idx{ position:absolute; top:-22px; left:-14px; z-index:5; font-family:var(--acl-font-num);
          width:64px; height:64px; border-radius:50%; background:var(--acl-ink); color:var(--acl-paper);
          display:flex; align-items:center; justify-content:center; font-size:34px;
          border:3px solid var(--acl-paper); box-shadow:3px 4px 0 rgba(22,21,15,.25); }
        .acl-pc__plate{ position:relative; margin-top:-2px; background:var(--acl-ink); color:var(--acl-paper);
          padding:16px 22px 18px; box-shadow:5px 7px 0 rgba(22,21,15,.2); z-index:3; }
        .acl-pc__ptop{ display:flex; align-items:baseline; gap:12px; }
        .acl-pc__pname{ font-weight:900; font-size:30px; line-height:1; }
        .acl-pc__ptag{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; padding:3px 8px; background:var(--acl-yellow); color:var(--acl-ink);
          white-space:nowrap; margin-left:auto; }
        .acl-pc__pdesc{ font-weight:500; font-size:18px; line-height:1.4; color:rgba(255,255,255,.78);
          margin-top:8px; }
        .acl-pc__pval{ font-family:var(--acl-font-num); font-size:50px; line-height:.82; margin-top:10px;
          color:var(--acl-yellow); }
        .acl-pc__pval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:5px; color:rgba(255,255,255,.6); }
        .acl-pc__col--focus{ transform:translateY(-14px) scale(1.035); z-index:6; }
        .acl-pc__col--focus .acl-pc__plate{ background:var(--acl-pink); }
        .acl-pc__col--focus .acl-pc__ptag{ background:var(--acl-ink); color:var(--acl-yellow); }
        .acl-pc__col--focus .acl-pc__pval{ color:var(--acl-paper); }
        .acl-pc__cfx{ position:absolute; top:-26px; right:-16px; z-index:7; }

        .acl-pc__foot{ flex:0 0 auto; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-hand); font-size:27px; margin-top:12px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pc__col{ animation:acl-pc-rise .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s); }
        }
        @keyframes acl-pc-rise{ from{ opacity:0; transform:translateY(34px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-pc__head">
        <div>
          <div className="acl-pc__eyebrow">{eyebrow}</div>
          <h1 className="acl-pc__h">{headline}</h1>
        </div>
        <div className="acl-pc__sub">{subheadline}</div>
        <div className="acl-pc__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-pc__row">
        {n === 0 && <div className="acl-pc__empty">// 图片数量 = 0</div>}
        {items.map((c, i) => {
          const isF = focusEnabled && i === fIdx;
          return (
            <div key={i} className={'acl-pc__col' + (isF ? ' acl-pc__col--focus' : '')}
              style={{ width: colW, transform: isF ? undefined : `rotate(${tilt[i % tilt.length]}deg)`, '--i': i }}>
              <div className="acl-pc__idx">{String(i + 1).padStart(2, '0')}</div>
              {isF && showDecor && <div className="acl-pc__cfx"><Sticker label="样板" color="var(--acl-yellow)" rotate={8} /></div>}
              <div className="acl-pc__imgwrap" style={{ width: box, height: box }}>
                <AdaptiveImageSlot id={'pc-' + i} box={box} ratio={0.72}
                  accent={isF ? 'var(--acl-pink)' : 'var(--acl-paper)'} placeholder={c.name}
                  sticker={null} />
              </div>
              <div className="acl-pc__plate" style={{ width: colW }}>
                <div className="acl-pc__ptop">
                  <span className="acl-pc__pname">{c.name}</span>
                  {showTag && <span className="acl-pc__ptag">{c.tag}</span>}
                </div>
                <div className="acl-pc__pdesc">{c.desc}</div>
                {showValue && <div className="acl-pc__pval">{c.value}<em>{c.unit}</em></div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="acl-pc__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && n > 0 && <Doodle kind="spark" size={36} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 8 }} />}
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page83Playbooks.defaults = {
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  cardCount: 3,                // 0–4 poster columns (each holds one image slot)
  focusEnabled: true,
  focusIndex: 1,
  showValue: true,             // big value on each plate
  showTag: true,               // tag chip on each plate
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: '2025 Playbooks · How It Lands',
  headline: '落地样板间',
  subheadline: '三类可复制路径',
  summary: '能被复制的不是叙事，而是 <b>可交付、可计费、可留存</b> 的落地路径。',
  // poster cards — each contains one adaptive image slot (count via cardCount)
  cards: [
    { name: '嵌入工作流', tag: 'Workflow', desc: '接管可计费流程，而不是停在对话框。', value: '118', unit: '% 净留存' },
    { name: '量化降本', tag: 'ROI', desc: '工单时长与人力成本可被直接量化。', value: '41', unit: '% 时长↓' },
    { name: '资源绑定', tag: 'Resource', desc: '云额度、芯片与渠道一并锁定。', value: '118', unit: '亿授信' },
    { name: '存量延展', tag: 'Expansion', desc: '把 AI 能力卖给已有企业客户。', value: '132', unit: '% 净留存' },
  ],
  closingLine: '可复制的路径，才是模板的价值所在。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page83Playbooks.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'cardCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '海报数量', desc: '竖向海报列数量(0–4)；每列含一个图片槽，列宽随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showValue', type: 'boolean', default: true,
    label: '数值标签', desc: '每张海报底牌的大号数值 显隐' },
  { key: 'showTag', type: 'boolean', default: true,
    label: '类型标签', desc: '每张海报的类型标签 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一张海报' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 3, maxFrom: 'cardCount', step: 1,
    label: '重点对象', desc: '被突出的海报序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page83Playbooks.defaults;
export const controls = Page83Playbooks.controls;
