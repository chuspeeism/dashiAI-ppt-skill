/*
 * Slide24Trio — 基础模型「三强」对比（图片页 · 三栏肖像图片槽 + 数据）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsTr- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 图片槽（image-slot）：
 *  - 肖像 cover 填满受控竖版画框（aspect 3/4），多卡天然对齐、永不溢出；
 *  - mediaCount 控制从左起多少张卡片带图片槽，其余卡片转为「首字母霓虹版」无图态。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number 公司卡数量          默认 3   可选 2–3
 *  mediaCount      number 带图片槽的卡片数      默认 3   可选 0–itemCount
 *  focusEnabled    bool   重点卡高亮开关         默认 true
 *  focusIndex      number 重点卡序号(从1起)     默认 1
 *  showMeta        bool   创始人 / 赛道行显隐     默认 true
 *  showRank        bool   左上角名次徽章显隐      默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide24Trio, { defaults, controls } from './Slide24Trio.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 基础模型三强（报告 Top10 + 案例）
const XHSTR_ITEMS = [
  { rank: '01', name: 'OpenAI', initial: 'O', founder: 'Sam Altman', sector: '通用大模型', amt: '66', color: '#15A7F0', ph: 'OpenAI · 团队 / Logo' },
  { rank: '02', name: 'Anthropic', initial: 'A', founder: 'Dario Amodei', sector: '通用大模型', amt: '65', color: '#27E021', ph: 'Anthropic · 团队 / Logo' },
  { rank: '03', name: 'xAI', initial: 'x', founder: 'Elon Musk', sector: '通用大模型', amt: '50', color: '#FFC700', ph: 'xAI · 团队 / Logo' },
];

function TrSpark({ size = 20, color = '#fff', style }) {
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


const SLIDE24TRIO_COPY = {
  text001: "头部玩家 · FOUNDATION MODEL",
  text002: "三强争霸，",
  text003: "瓜分半数资金",
  text004: "OpenAI、Anthropic、xAI 包揽 Top3 单笔融资，通用大模型成为资本最拥挤的赛道。",
  text005: "亿",
  text006: "2024 单笔最大融资 / 美元",
};
function Slide24Trio(props) {
  const {
      copy = SLIDE24TRIO_COPY,
      itemsData = XHSTR_ITEMS,
    itemCount = 3,
    mediaCount = 3,
    focusEnabled = true,
    focusIndex = 1,
    showMeta = true,
    showRank = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(2, Math.min(3, itemCount));
  const media = Math.max(0, Math.min(count, mediaCount));
  const items = itemsData.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsTr-root" data-label="三强争霸" data-screen-label="三强争霸">
      <style>{XHSTR_CSS}</style>

      <header className="xhsTr-head">
        <div className="xhsTr-kicker">{copy.text001}</div>
        <h2 className="xhsTr-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>
        </h2>
        <p className="xhsTr-sub">{copy.text004}</p>
      </header>

      <div className={'xhsTr-grid xhsTr-grid--' + count}>
        {items.map((it, i) => {
          const hasImg = i < media;
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <figure key={i} className={'xhsTr-card' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': it.color }}>
              <div className="xhsTr-media">
                {hasImg ? (
                  <image-slot id={`xhsTr-media-${i}`} fit="cover" shape="rect" placeholder={it.ph}></image-slot>
                ) : (
                  <div className="xhsTr-noimg"><span className="xhsTr-initial">{it.initial}</span></div>
                )}
                {showRank && <span className="xhsTr-rank">{it.rank}</span>}
                <span className="xhsTr-scrim" aria-hidden="true" />
              </div>

              <figcaption className="xhsTr-info">
                <div className="xhsTr-name">{it.name}</div>
                {showMeta && (
                  <div className="xhsTr-meta">
                    <span className="xhsTr-founder">{it.founder}</span>
                    <span className="xhsTr-sector">{it.sector}</span>
                  </div>
                )}
                <div className="xhsTr-stat">
                  <span className="xhsTr-amt">{it.amt}<i>{copy.text005}</i></span>
                  <span className="xhsTr-statlab">{copy.text006}</span>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <TrSpark size={26} color="#27E021" style={{ position: 'absolute', left: 84, top: 150 }} />
          <TrSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 96, bottom: 88 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSTR_CSS = `
  .xhsTr-root{ padding:70px 110px 64px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsTr-head{ flex:0 0 auto; margin-bottom:34px; }
  .xhsTr-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsTr-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsTr-sub{ margin:18px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1300px; }

  .xhsTr-grid{ flex:1 1 auto; min-height:0; display:grid; gap:36px; }
  .xhsTr-grid--3{ grid-template-columns:repeat(3,1fr); }
  .xhsTr-grid--2{ grid-template-columns:repeat(2,1fr); max-width:1100px; margin:0 auto; width:100%; }

  .xhsTr-card{ margin:0; display:flex; flex-direction:column; min-height:0; border-radius:24px; overflow:hidden;
    background:linear-gradient(160deg,#161616,#0c0c0c); border:1.5px solid rgba(255,255,255,.08);
    box-shadow:0 24px 56px rgba(0,0,0,.55);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsTr-card.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsTr-card.is-hot{ border-color:var(--c); transform:translateY(-8px);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 34%, transparent); }

  .xhsTr-media{ position:relative; width:100%; flex:1 1 auto; min-height:0; overflow:hidden; background:#0a0a0a; }
  .xhsTr-media image-slot{ width:100%; height:100%; display:block; }
  .xhsTr-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(120% 120% at 50% 22%, color-mix(in srgb, var(--c) 34%, #101010) 0%, #0a0a0a 70%); }
  .xhsTr-initial{ font-family:"Space Mono",monospace; font-size:200px; font-weight:700; color:var(--c); line-height:1;
    text-shadow:0 0 50px color-mix(in srgb, var(--c) 55%, transparent); opacity:.92; }
  .xhsTr-rank{ position:absolute; top:20px; left:20px; z-index:2; font-family:"Space Mono",monospace;
    font-size:30px; font-weight:700; color:#06140f; padding:6px 18px; border-radius:12px; background:var(--c);
    box-shadow:0 8px 22px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsTr-scrim{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, transparent 60%, rgba(0,0,0,.42) 100%); }

  .xhsTr-info{ flex:0 0 auto; padding:26px 30px 30px; display:flex; flex-direction:column; gap:10px; }
  .xhsTr-name{ font-size:46px; font-weight:900; color:#fff; line-height:1; letter-spacing:-.01em; }
  .xhsTr-meta{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .xhsTr-founder{ font-size:23px; font-weight:600; color:#b6b6b6; }
  .xhsTr-sector{ font-size:19px; font-weight:700; color:var(--c); padding:4px 14px; border-radius:999px;
    background:color-mix(in srgb, var(--c) 14%, rgba(255,255,255,.04)); border:1.5px solid color-mix(in srgb, var(--c) 42%, transparent); }
  .xhsTr-stat{ display:flex; align-items:baseline; gap:14px; margin-top:8px; padding-top:18px;
    border-top:1.5px solid rgba(255,255,255,.08); }
  .xhsTr-amt{ font-family:"Space Mono",monospace; font-size:60px; font-weight:700; color:var(--c); line-height:.9;
    text-shadow:0 0 24px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsTr-amt i{ font-style:normal; font-size:28px; font-weight:700; margin-left:3px; }
  .xhsTr-statlab{ font-size:20px; font-weight:600; color:#8a8a8a; line-height:1.3; }
`;

const META = {
  id: 'trio',
  label: '三强争霸',
  Component: Slide24Trio,
  defaults: {
      copy: SLIDE24TRIO_COPY,
      itemsData: XHSTR_ITEMS,
    ...hlDefaults,
    itemCount: 3,
    mediaCount: 3,
    focusEnabled: true,
    focusIndex: 1,
    showMeta: true,
    showRank: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }], default: SLIDE24TRIO_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'itemsData', type: 'list', label: 'itemsData', itemLabel: '数据', fields: [{ key: "rank", label: "rank" }, { key: "name", label: "name" }, { key: "initial", label: "initial" }, { key: "founder", label: "founder" }, { key: "sector", label: "sector" }, { key: "amt", label: "amt" }, { key: "color", label: "color" }, { key: "ph", label: "ph" }], default: XHSTR_ITEMS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '公司卡数量', min: 2, max: 3, step: 1, default: 3, desc: '展示的公司卡片数量' },
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 3, step: 1, default: 3, maxFromKey: 'itemCount', desc: '从左起带图片槽的卡片数(其余转无图态)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一张卡片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮卡片的序号' },
    { key: 'showMeta', type: 'toggle', label: '创始人 / 赛道', default: true, desc: '创始人 + 赛道标签行' },
    { key: 'showRank', type: 'toggle', label: '名次徽章', default: true, desc: '左上角名次徽章' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide24Trio.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide24Trio;
