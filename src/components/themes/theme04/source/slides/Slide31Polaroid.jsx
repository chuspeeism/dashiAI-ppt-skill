/*
 * Slide31Polaroid — 资本现场拍立得拼贴（图片页 · 倾斜照片卡 + 胶带 + 手记标签）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsPo- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 图片槽（image-slot）：
 *  - 每张拍立得内照片用 cover 填满受控竖版画框（aspect 4/5），多张天然对齐、永不溢出；
 *  - mediaCount 控制照片数量（0–4），mediaLayout 在「散落倾斜 / 整齐排列」间切换保证构图。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 拍立得照片数量        默认 4   可选 0–4
 *  mediaLayout     enum   排布方式            默认 'scatter' 可选 'scatter'|'row'
 *  focusEnabled    bool   重点照片高亮开关       默认 false
 *  focusIndex      number 重点照片序号(从1起)    默认 2
 *  showCaptions    bool   照片底部手写标签显隐    默认 true
 *  showTape        bool   顶部彩色胶带显隐       默认 true
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide31Polaroid, { defaults, controls } from './Slide31Polaroid.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 资本现场速写（图说，可换内容复用）
const XHSPO_SHOTS = [
  { cap: '旧金山 · 总部', note: 'SF / HQ', tone: '#15A7F0', ph: '公司总部 / 团队合影' },
  { cap: 'GPU 算力集群', note: 'COMPUTE', tone: '#27E021', ph: '数据中心 / GPU 集群实拍' },
  { cap: '融资签约现场', note: 'THE DEAL', tone: '#FFC700', ph: '路演 / 签约 / 发布会现场' },
  { cap: '创始人特写', note: 'FOUNDER', tone: '#FF9FE2', ph: '创始人 / 人物特写' },
];
const XHSPO_TILT = [-5, 4, -3.5, 5.5];

function PoSpark({ size = 20, color = '#fff', style }) {
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


const SLIDE31POLAROID_COPY = {
  text001: "资本现场 · ON THE GROUND",
  text002: "钱潮之下，是一张张",
  text003: "真实的脸",
  text004: "从旧金山的总部到田纳西的超算集群——把这一年的 AI 资本现场，钉在一面拍立得墙上。",
  text005: "把「资本现场」的实拍照片拖进来 · 0–4 张",
};
function Slide31Polaroid(props) {
  const {
      copy = SLIDE31POLAROID_COPY,
      shotsData = XHSPO_SHOTS,
    mediaCount = 4,
    mediaLayout = 'scatter',
    focusEnabled = false,
    focusIndex = 2,
    showCaptions = true,
    showTape = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(0, Math.min(4, mediaCount));
  const shots = shotsData.slice(0, count);
  const focus = Math.max(1, Math.min(Math.max(count, 1), focusIndex)) - 1;
  const scatter = mediaLayout === 'scatter';

  return (
    <section className="xhs-base xhsPo-root" data-label="拍立得拼贴" data-screen-label="拍立得拼贴">
      <style>{XHSPO_CSS}</style>

      <header className="xhsPo-head">
        <div className="xhsPo-kicker">{copy.text001}</div>
        <h2 className="xhsPo-title">{copy.text002}<HL color="#FF9FE2" variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>
        </h2>
        <p className="xhsPo-sub">{copy.text004}</p>
      </header>

      <div className={'xhsPo-wall' + (scatter ? ' is-scatter' : ' is-row')}>
        {count === 0 ? (
          <div className="xhsPo-empty">{copy.text005}</div>
        ) : shots.map((s, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          const tilt = scatter ? XHSPO_TILT[i % XHSPO_TILT.length] : 0;
          return (
            <figure key={i}
              className={'xhsPo-card' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': s.tone, '--tilt': (hot ? 0 : tilt) + 'deg' }}>
              {showTape && <span className="xhsPo-tape" aria-hidden="true" />}
              <div className="xhsPo-photo">
                <image-slot id={`xhsPo-media-${i}`} fit="cover" shape="rect" placeholder={s.ph}></image-slot>
              </div>
              {showCaptions && (
                <figcaption className="xhsPo-cap">
                  <span className="xhsPo-capMain">{s.cap}</span>
                  <span className="xhsPo-capNote">{s.note}</span>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <PoSpark size={26} color="#27E021" style={{ position: 'absolute', left: 84, top: 196 }} />
          <PoSpark size={18} color="#FFC700" style={{ position: 'absolute', right: 110, bottom: 120 }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: 140, bottom: 130, width: 40, height: 40, borderRadius: '50%', border: '5px solid rgba(255,255,255,.8)', boxShadow: '0 0 20px rgba(255,255,255,.2)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSPO_CSS = `
  .xhsPo-root{ padding:74px 110px 60px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsPo-head{ flex:0 0 auto; margin-bottom:20px; }
  .xhsPo-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsPo-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsPo-sub{ margin:18px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1360px; }

  .xhsPo-wall{ flex:1 1 auto; min-height:0; display:flex; align-items:center; justify-content:center; gap:30px; }
  .xhsPo-wall.is-scatter{ gap:14px; }

  .xhsPo-card{ position:relative; margin:0; flex:0 1 auto; width:340px; max-width:24%;
    background:linear-gradient(170deg,#f6f3ec,#e9e4d8); padding:16px 16px 18px; border-radius:8px;
    box-shadow:0 26px 54px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.7);
    transform:rotate(var(--tilt)); transform-origin:center 60%;
    transition:transform .35s cubic-bezier(.2,.8,.2,1), opacity .3s ease, filter .3s ease, box-shadow .35s ease; }
  .xhsPo-card.is-dim{ opacity:.5; filter:saturate(.78) brightness(.9); }
  .xhsPo-card.is-hot{ transform:rotate(0deg) scale(1.06) translateY(-8px); z-index:3;
    box-shadow:0 36px 72px rgba(0,0,0,.7), 0 0 60px color-mix(in srgb, var(--c) 38%, transparent), inset 0 1px 0 rgba(255,255,255,.7); }

  .xhsPo-photo{ position:relative; width:100%; aspect-ratio:4/5; border-radius:3px; overflow:hidden;
    background:#0a0a0a; box-shadow:inset 0 0 0 1px rgba(0,0,0,.25), inset 0 2px 10px rgba(0,0,0,.5); }
  .xhsPo-photo image-slot{ width:100%; height:100%; display:block; }

  .xhsPo-tape{ position:absolute; top:-16px; left:50%; transform:translateX(-50%) rotate(-3deg); z-index:4;
    width:128px; height:40px; background:color-mix(in srgb, var(--c) 50%, rgba(255,255,255,.55));
    box-shadow:0 4px 12px rgba(0,0,0,.35);
    -webkit-mask:linear-gradient(#000,#000); mask:linear-gradient(#000,#000);
    border-left:2px dashed rgba(0,0,0,.12); border-right:2px dashed rgba(0,0,0,.12);
    opacity:.92; mix-blend-mode:screen; }

  .xhsPo-cap{ display:flex; align-items:baseline; justify-content:space-between; gap:8px; padding:16px 6px 4px; }
  .xhsPo-capMain{ font-size:25px; font-weight:900; color:#1c1a16; letter-spacing:-.01em; white-space:nowrap; }
  .xhsPo-capNote{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.08em; font-weight:700;
    color:#1c1a16; padding:3px 10px; border-radius:6px; background:color-mix(in srgb, var(--c) 70%, #fff); }

  .xhsPo-empty{ width:760px; padding:64px; border-radius:20px; text-align:center; font-size:26px; font-weight:600; color:#7a7a7a;
    background:repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0 14px, transparent 14px 28px);
    border:2px dashed rgba(255,255,255,.18); }

  /* 整齐排列时略微收窄间距、统一抬升 */
  .xhsPo-wall.is-row .xhsPo-card{ box-shadow:0 22px 46px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.7); }
`;

const META = {
  id: 'polaroid',
  label: '拍立得拼贴',
  Component: Slide31Polaroid,
  defaults: {
      copy: SLIDE31POLAROID_COPY,
      shotsData: XHSPO_SHOTS,
    ...hlDefaults,
    mediaCount: 4,
    mediaLayout: 'scatter',
    focusEnabled: false,
    focusIndex: 2,
    showCaptions: true,
    showTape: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }], default: SLIDE31POLAROID_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'shotsData', type: 'list', label: 'shotsData', itemLabel: '数据', fields: [{ key: "cap", label: "cap" }, { key: "note", label: "note" }, { key: "tone", label: "tone" }, { key: "ph", label: "ph" }], default: XHSPO_SHOTS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '照片数量', min: 0, max: 4, step: 1, default: 4, desc: '拍立得照片数量(图片槽)' },
    { key: 'mediaLayout', type: 'radio', label: '排布方式', options: ['scatter', 'row'], optionLabels: ['散落', '整齐'], default: 'scatter', desc: '散落倾斜 / 整齐排列' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一张照片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 2, maxFromKey: 'mediaCount', showIf: (v) => v.focusEnabled, desc: '被高亮照片的序号' },
    { key: 'showCaptions', type: 'toggle', label: '手写标签', default: true, desc: '照片底部标签显隐' },
    { key: 'showTape', type: 'toggle', label: '彩色胶带', default: true, desc: '顶部彩色胶带显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide31Polaroid.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide31Polaroid;
