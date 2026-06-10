/*
 * Slide37Bento — Bento 网格速览（图片 · 图片槽 + 数字 + 金句混排）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsBt- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 小红书式 bento 拼贴：7 块瓷砖填满 4×3 受控网格（大图 + 数字 + 金句 + 小图）。
 * 图片槽（image-slot）：cover 填满受控瓷砖、永不溢出；mediaCount 控制有多少
 * 张「图片瓷砖」真正显示图片槽，其余回退为「霓虹首字母」无图态，保证构图不塌。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片瓷砖数量(0–2)     默认 2   可选 0–2
 *  focusEnabled    bool   重点瓷砖高亮开关        默认 false
 *  focusIndex      number 重点瓷砖序号(从1起)    默认 1   范围 1–7
 *  paletteVariant  enum   配色             默认 'multi' 可选 'multi'|'mono'
 *  showCaptions    bool   瓷砖小标签显隐         默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide37Bento, { defaults, controls } from './Slide37Bento.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSBT_MONO = '#15A7F0';

// 7 块瓷砖（写死）：类型 / 网格区域 / 内容 / 主色
const XHSBT_TILES = [
  { type: 'image', area: 'hero', color: '#15A7F0', initial: 'AI', ph: '主视觉 · 机房 / 团队 / 现场', cap: '2024 · 资本现场' },
  { type: 'stat', area: 'big', color: '#27E021', value: '970', unit: '亿', label: '全年 AI 风投总额 / 美元', big: true },
  { type: 'stat', area: 's1', color: '#FFC700', value: '97', unit: '笔', label: '≥1 亿美元事件' },
  { type: 'image', area: 'img', color: '#FF9FE2', initial: 'GPU', ph: '算力 / 卡墙', cap: '算力基建' },
  { type: 'quote', area: 'quote', color: '#FF9FE2', quote: '钱在追少数人', tail: '头部高度集中，通用大模型最拥挤。' },
  { type: 'stat', area: 's2', color: '#15A7F0', value: '≈1/3', unit: '', label: '占全美 VC' },
  { type: 'stat', area: 's3', color: '#FF9FE2', value: '190', unit: '亿', label: '头部单笔估值峰值 / 美元' },
];

function BtSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE37BENTO_COPY = {
  text001: "AT A GLANCE · 一图速览",
  text002: "2024，",
  text003: "一屏看懂资本流向",
  text004: "“",
};
function Slide37Bento(props) {
  const {
      copy = SLIDE37BENTO_COPY,
      tilesData = XHSBT_TILES,
    mediaCount = 2,
    focusEnabled = false,
    focusIndex = 1,
    paletteVariant = 'multi',
    showCaptions = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(2, mediaCount));
  const focus = Math.max(1, Math.min(tilesData.length, focusIndex)) - 1;
  const mono = paletteVariant === 'mono';

  // 图片瓷砖在 tiles 中的次序，用于按 mediaCount 决定哪几张显示图片槽
  let imgSeen = 0;

  return (
    <section className="xhs-base xhsBt-root" data-label="一图速览" data-screen-label="一图速览">
      <style>{XHSBT_CSS}</style>

      <header className="xhsBt-head">
        <div className="xhsBt-kicker">{copy.text001}</div>
        <h2 className="xhsBt-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsBt-grid">
        {tilesData.map((tile, i) => {
          const color = mono ? XHSBT_MONO : tile.color;
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          let asImage = false;
          if (tile.type === 'image') {
            asImage = imgSeen < media;
            imgSeen += 1;
          }
          const cls = 'xhsBt-tile xhsBt-tile--' + tile.area + ' is-' + tile.type
            + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '');

          if (tile.type === 'image') {
            return (
              <figure key={i} className={cls} style={{ '--c': color }}>
                {asImage ? (
                  <image-slot id={`xhsBt-media-${i}`} fit="cover" shape="rect" placeholder={tile.ph}></image-slot>
                ) : (
                  <div className="xhsBt-noimg"><span className="xhsBt-initial">{tile.initial}</span></div>
                )}
                <span className="xhsBt-scrim" aria-hidden="true" />
                {showCaptions && <figcaption className="xhsBt-cap">{tile.cap}</figcaption>}
              </figure>
            );
          }
          if (tile.type === 'quote') {
            return (
              <div key={i} className={cls} style={{ '--c': color }}>
                <span className="xhsBt-quote-mark" aria-hidden="true">{copy.text004}</span>
                <div className="xhsBt-quote">{tile.quote}</div>
                {showCaptions && <div className="xhsBt-quote-tail">{tile.tail}</div>}
              </div>
            );
          }
          // stat
          return (
            <div key={i} className={cls + (tile.big ? ' is-big' : '')} style={{ '--c': color }}>
              <div className="xhsBt-stat-val">
                {tile.value}{tile.unit && <span className="xhsBt-stat-unit">{tile.unit}</span>}
              </div>
              {showCaptions && <div className="xhsBt-stat-label">{tile.label}</div>}
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <BtSpark size={24} color="#27E021" style={{ position: 'absolute', left: 70, top: 130 }} />
          <BtSpark size={16} color="#FFC700" style={{ position: 'absolute', right: 96, top: 120 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSBT_CSS = `
  .xhsBt-root{ padding:74px 110px 64px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsBt-head{ flex:0 0 auto; margin-bottom:24px; }
  .xhsBt-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsBt-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsBt-grid{ flex:1 1 auto; min-height:0; display:grid; gap:22px;
    grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(3,1fr);
    grid-template-areas:
      "hero hero big   big"
      "hero hero s1    img"
      "quote quote s2  s3"; }
  .xhsBt-tile--hero{ grid-area:hero; } .xhsBt-tile--big{ grid-area:big; }
  .xhsBt-tile--s1{ grid-area:s1; } .xhsBt-tile--img{ grid-area:img; }
  .xhsBt-tile--quote{ grid-area:quote; } .xhsBt-tile--s2{ grid-area:s2; } .xhsBt-tile--s3{ grid-area:s3; }

  .xhsBt-tile{ margin:0; position:relative; border-radius:22px; overflow:hidden; box-sizing:border-box; min-width:0; min-height:0;
    background:linear-gradient(160deg,#161616,#0c0c0c); border:1.5px solid rgba(255,255,255,.08);
    box-shadow:0 18px 44px rgba(0,0,0,.46);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsBt-tile.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsBt-tile.is-hot{ border-color:var(--c); transform:translateY(-6px) scale(1.012);
    box-shadow:0 0 64px color-mix(in srgb, var(--c) 32%, transparent); z-index:2; }

  /* 图片瓷砖 */
  .xhsBt-tile.is-image{ background:#0a0a0a; }
  .xhsBt-tile.is-image image-slot{ width:100%; height:100%; display:block; }
  .xhsBt-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(120% 120% at 50% 24%, color-mix(in srgb, var(--c) 34%, #101010) 0%, #0a0a0a 70%); }
  .xhsBt-initial{ font-family:"Space Mono",monospace; font-weight:700; color:var(--c); line-height:1;
    font-size:clamp(60px, 9vw, 140px); text-shadow:0 0 46px color-mix(in srgb, var(--c) 52%, transparent); opacity:.92; }
  .xhsBt-scrim{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, transparent 52%, rgba(0,0,0,.6) 100%); }
  .xhsBt-cap{ position:absolute; left:24px; bottom:22px; font-size:24px; font-weight:800; color:#fff;
    text-shadow:0 2px 14px rgba(0,0,0,.7); }

  /* 数字瓷砖 */
  .xhsBt-tile.is-stat{ display:flex; flex-direction:column; justify-content:center; padding:26px 32px; gap:12px;
    background:linear-gradient(155deg, color-mix(in srgb, var(--c) 16%, #141414), #0b0b0b 72%);
    border-color:color-mix(in srgb, var(--c) 40%, rgba(255,255,255,.08)); }
  .xhsBt-tile.is-stat::after{ content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
    background:linear-gradient(135deg, color-mix(in srgb, var(--c) 14%, transparent), transparent 44%); }
  .xhsBt-stat-val, .xhsBt-stat-label{ position:relative; z-index:1; }
  .xhsBt-stat-val{ font-family:"Space Mono",monospace; font-weight:700; line-height:.9; color:var(--c);
    font-size:72px; display:flex; align-items:baseline; text-shadow:0 0 28px color-mix(in srgb, var(--c) 38%, transparent); }
  .xhsBt-tile.is-big .xhsBt-stat-val{ font-size:118px; }
  .xhsBt-stat-unit{ font-size:34px; font-weight:700; margin-left:6px; }
  .xhsBt-tile.is-big .xhsBt-stat-unit{ font-size:46px; }
  .xhsBt-stat-label{ font-size:22px; font-weight:600; color:#a4a4a4; line-height:1.3; }
  .xhsBt-tile.is-big .xhsBt-stat-label{ font-size:26px; color:#bcbcbc; }

  /* 金句瓷砖 */
  .xhsBt-tile.is-quote{ display:flex; flex-direction:column; justify-content:center; padding:30px 38px;
    background:linear-gradient(150deg, color-mix(in srgb, var(--c) 22%, #131313), #0c0c0c); }
  .xhsBt-quote-mark{ position:absolute; top:6px; left:26px; font-family:"Space Mono",monospace; font-size:120px;
    line-height:1; color:var(--c); opacity:.45; }
  .xhsBt-quote{ position:relative; font-size:50px; font-weight:900; color:#fff; line-height:1.08; }
  .xhsBt-quote-tail{ position:relative; margin-top:14px; font-size:23px; font-weight:500; color:#bdbdbd; }
`;

const META = {
  id: 'bento',
  label: '一图速览',
  Component: Slide37Bento,
  defaults: {
      copy: SLIDE37BENTO_COPY,
      tilesData: XHSBT_TILES,
    ...hlDefaults,
    mediaCount: 2,
    focusEnabled: false,
    focusIndex: 1,
    paletteVariant: 'multi',
    showCaptions: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }], default: SLIDE37BENTO_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'tilesData', type: 'list', label: 'tilesData', itemLabel: '数据', fields: [{ key: "type", label: "type" }, { key: "area", label: "area" }, { key: "color", label: "color" }, { key: "initial", label: "initial" }, { key: "ph", label: "ph" }, { key: "cap", label: "cap" }], default: XHSBT_TILES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片瓷砖', min: 0, max: 2, step: 1, default: 2, desc: '显示图片槽的瓷砖数(其余转无图态)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一块瓷砖' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 7, step: 1, default: 1, showIf: (v) => v.focusEnabled, desc: '被高亮瓷砖的序号' },
    { key: 'paletteVariant', type: 'radio', label: '配色', options: ['multi', 'mono'], optionLabels: ['多彩', '单色'], default: 'multi', desc: '瓷砖多彩 / 统一单色' },
    { key: 'showCaptions', type: 'toggle', label: '瓷砖标签', default: true, desc: '瓷砖小标签 / 说明' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide37Bento.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide37Bento;
