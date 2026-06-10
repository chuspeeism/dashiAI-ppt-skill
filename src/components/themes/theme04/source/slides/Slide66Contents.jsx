/*
 * Slide66Contents — 全篇导览·图文目录（图片 · 缩略图索引新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCo- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Agenda（倾斜模块卡·无图）/ Hub（放射枢纽）互补：本页是「带缩略图的目录」——
 * 每个章节一张受控缩略图（cover 填满、永不溢出、天然对齐）+ 编号 + 中英标题 + 一句导读，
 * 整屏读完全篇结构。mediaCount 控制有多少张真正显示图片槽，其余回退「霓虹编号」无图态。
 * focus 高亮当前/重点章节，卡片语言同四象限（accent 渐变底 + 整圈描边 + 前导编号）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number 章节卡数量(4–6)        默认 6
 *  mediaCount      number 显示缩略图的卡数(0–6)   默认 6
 *  focusEnabled    bool   重点章节高亮开关         默认 true
 *  focusIndex      number 重点章节序号(从1起)     默认 1   范围 1–itemCount
 *  showDesc        bool   卡片导读一句话显隐       默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide66Contents, { defaults, controls } from './Slide66Contents.jsx'
 */
import React from 'react';

// 章节（写死）：编号 / 中文 / 英文 / 导读 / 主色
const XHSCO_ITEMS = [
  { no: '01', zh: '市场全景', en: 'MARKET', desc: '970 亿与 97 笔大额融资', color: '#27E021' },
  { no: '02', zh: '资金版图', en: 'LANDSCAPE', desc: '赛道、地区与头部集中', color: '#FFC700' },
  { no: '03', zh: '头部玩家', en: 'PLAYERS', desc: 'OpenAI · Anthropic · xAI 争霸', color: '#15A7F0' },
  { no: '04', zh: '产业链条', en: 'VALUE CHAIN', desc: '上中下游与算力底座', color: '#FF9FE2' },
  { no: '05', zh: '投资策略', en: 'STRATEGY', desc: '看好与谨慎的分野', color: '#27E021' },
  { no: '06', zh: '风险展望', en: 'OUTLOOK', desc: '集中度风险与 2025 路径', color: '#FFC700' },
];

function CoSpark({ size = 22, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}


const SLIDE66CONTENTS_COPY = {
  text001: "全篇导览 · CONTENTS",
  text002: "六章，看懂这一年的 AI 资本",
};
function Slide66Contents(props) {
  const {
      copy = SLIDE66CONTENTS_COPY,
      itemsData = XHSCO_ITEMS,
    itemCount = 6,
    mediaCount = 6,
    focusEnabled = true,
    focusIndex = 1,
    showDesc = true,
    showDecorations = true,
  } = props;

  const n = Math.max(4, Math.min(6, itemCount));
  const items = itemsData.slice(0, n);
  const mc = Math.max(0, Math.min(n, mediaCount));
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const cols = n <= 4 ? 2 : 3;

  return (
    <section className="xhs-base xhsCo-root" data-label="图文目录" data-screen-label="图文目录">
      <style>{XHSCO_CSS}</style>

      <header className="xhsCo-head">
        <div className="xhsCo-kicker">{copy.text001}</div>
        <h2 className="xhsCo-title">{copy.text002}</h2>
      </header>

      <div className="xhsCo-grid" style={{ '--cols': cols }}>
        {items.map((it, i) => {
          const hasImg = i < mc;
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsCo-card' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': it.color }}>
              <div className="xhsCo-thumb">
                {hasImg ? (
                  <image-slot id={`xhsCo-media-${i}`} fit="cover" shape="rect"
                    placeholder={`${it.zh} 配图`}></image-slot>
                ) : (
                  <div className="xhsCo-noimg"><span className="xhsCo-bigno">{it.no}</span></div>
                )}
                <span className="xhsCo-thumbScrim" aria-hidden="true" />
                <span className="xhsCo-badge">{it.no}</span>
              </div>
              <div className="xhsCo-meta">
                <div className="xhsCo-titleRow">
                  <span className="xhsCo-zh">{it.zh}</span>
                  <span className="xhsCo-en">{it.en}</span>
                </div>
                {showDesc && <span className="xhsCo-desc">{it.desc}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <CoSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <CoSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCO_CSS = `
  .xhsCo-root{ padding:70px 110px 60px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsCo-head{ flex:0 0 auto; margin-bottom:30px; }
  .xhsCo-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsCo-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsCo-grid{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--cols),1fr); gap:30px; }
  .xhsCo-card{ position:relative; min-height:0; display:flex; flex-direction:column; border-radius:22px; overflow:hidden;
    background:linear-gradient(155deg, color-mix(in srgb, var(--c) 15%, #141414), #0b0b0b 72%);
    border:1.5px solid color-mix(in srgb, var(--c) 36%, rgba(255,255,255,.06));
    transition:opacity .3s ease, filter .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsCo-card::after{ content:""; position:absolute; inset:0; pointer-events:none; z-index:3;
    background:linear-gradient(135deg, color-mix(in srgb, var(--c) 14%, transparent), transparent 40%); }
  .xhsCo-card.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCo-card.is-hot{ border-color:var(--c); box-shadow:0 0 56px color-mix(in srgb, var(--c) 26%, transparent); transform:translateY(-6px); }

  .xhsCo-thumb{ position:relative; flex:1 1 auto; min-height:0; overflow:hidden; background:#0a0a0a; }
  .xhsCo-thumb image-slot{ width:100%; height:100%; display:block; }
  .xhsCo-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(120% 110% at 50% 26%, color-mix(in srgb, var(--c) 28%, #101010) 0%, #090909 72%); }
  .xhsCo-bigno{ font-family:"Space Mono",monospace; font-size:150px; font-weight:700; color:transparent;
    -webkit-text-stroke:2.5px color-mix(in srgb, var(--c) 62%, #444); line-height:1; }
  .xhsCo-thumbScrim{ position:absolute; inset:0; pointer-events:none; z-index:1;
    background:linear-gradient(180deg, rgba(0,0,0,.32) 0%, transparent 38%, transparent 60%, rgba(0,0,0,.6) 100%); }
  .xhsCo-badge{ position:absolute; top:18px; left:20px; z-index:2; font-family:"Space Mono",monospace; font-size:24px; font-weight:700;
    color:#06140f; background:var(--c); padding:4px 14px; border-radius:10px; letter-spacing:.04em;
    box-shadow:0 6px 18px color-mix(in srgb, var(--c) 40%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }

  .xhsCo-meta{ position:relative; z-index:4; flex:0 0 auto; padding:20px 26px 22px; display:flex; flex-direction:column; gap:8px; }
  .xhsCo-titleRow{ display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; }
  .xhsCo-zh{ font-size:33px; font-weight:900; color:#fff; line-height:1; }
  .xhsCo-en{ font-family:"Space Mono",monospace; font-size:16px; font-weight:700; letter-spacing:.12em; color:var(--c); }
  .xhsCo-desc{ font-size:20px; font-weight:600; color:#a6a6a6; line-height:1.35; text-wrap:pretty; }
`;

const META = {
  id: 'contents',
  label: '图文目录',
  Component: Slide66Contents,
  defaults: {
      copy: SLIDE66CONTENTS_COPY,
      itemsData: XHSCO_ITEMS,
    itemCount: 6,
    mediaCount: 6,
    focusEnabled: true,
    focusIndex: 1,
    showDesc: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }], default: SLIDE66CONTENTS_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'itemsData', type: 'list', label: 'itemsData', itemLabel: '数据', fields: [{ key: "no", label: "no" }, { key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "desc", label: "desc" }, { key: "color", label: "color" }], default: XHSCO_ITEMS, desc: '默认数据内容' },
    { key: 'itemCount', type: 'slider', label: '章节卡数量', min: 4, max: 6, step: 1, default: 6, desc: '展示的章节卡数量' },
    { key: 'mediaCount', type: 'slider', label: '缩略图卡数', min: 0, max: 6, step: 1, default: 6, maxFromKey: 'itemCount', desc: '显示缩略图的卡数(其余转霓虹编号)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一章节' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮章节的序号' },
    { key: 'showDesc', type: 'toggle', label: '导读', default: true, desc: '卡片导读一句话' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide66Contents.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide66Contents;
