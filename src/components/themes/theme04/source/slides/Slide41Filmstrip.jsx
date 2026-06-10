/*
 * Slide41Filmstrip — 资本现场胶片印样（图片页 · 横向胶片条 · 0–4 图片槽 + 齿孔）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsFs- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与拍立得拼贴 / 画廊互补：一整条胶片横贯版面，上下齿孔、逐格编号；图片槽 cover
 * 填满受控等幅画框（永不溢出、天然对齐），未填的格回退「未曝光」霓虹占位帧。
 * mediaCount 控制有多少格真正显示图片槽（0–4），frameRatio 切换横 / 竖构图。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 显示图片槽的格数(0–4)  默认 3
 *  frameRatio      enum   画框构图             默认 'landscape' 可选 'landscape'|'portrait'
 *  focusEnabled    bool   重点格高亮开关         默认 false
 *  focusIndex      number 重点格序号(从1起)     默认 1   范围 1–4
 *  showCaptions    bool   逐格说明显隐          默认 true
 *  showSprockets   bool   胶片齿孔显隐          默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide41Filmstrip, { defaults, controls } from './Slide41Filmstrip.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSFS_FRAMES = [
  { color: '#27E021', initial: 'A', code: 'ROLL-01 / 12A', cap: '签约现场 · 头部轮次' },
  { color: '#15A7F0', initial: 'B', code: 'ROLL-01 / 18B', cap: '算力机房 · GPU 卡墙' },
  { color: '#FFC700', initial: 'C', code: 'ROLL-01 / 23C', cap: '发布日 · 产品 demo' },
  { color: '#FF9FE2', initial: 'D', code: 'ROLL-01 / 31D', cap: '团队合影 · 创始团队' },
];

function FsSpark({ size = 22, color = '#fff', style }) {
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

function FsSprocketRow() {
  return (
    <div className="xhsFs-sprockets" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => <span key={i} className="xhsFs-hole" />)}
    </div>
  );
}


const SLIDE41FILMSTRIP_COPY = {
  text001: "资本现场 · CONTACT SHEET",
  text002: "一卷胶片，",
  text003: "记录 2024 的资本现场",
  text004: "把镜头对准签约桌、机房与发布日 —— 拖入你的现场照片，自动排进受控画框",
};
function Slide41Filmstrip(props) {
  const {
      copy = SLIDE41FILMSTRIP_COPY,
      framesData = XHSFS_FRAMES,
    mediaCount = 3,
    frameRatio = 'landscape',
    focusEnabled = false,
    focusIndex = 1,
    showCaptions = true,
    showSprockets = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(4, mediaCount));
  const total = 4; // 始终铺满 4 格，保证胶片构图稳定；未填格 = 未曝光占位帧
  const focus = Math.max(1, Math.min(total, focusIndex)) - 1;
  const ratio = frameRatio === 'portrait' ? '4 / 5' : '3 / 2';

  return (
    <section className="xhs-base xhsFs-root" data-label="胶片印样" data-screen-label="胶片印样">
      <style>{XHSFS_CSS}</style>

      <header className="xhsFs-head">
        <div className="xhsFs-kicker">{copy.text001}</div>
        <h2 className="xhsFs-title">{copy.text002}<HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsFs-stage">
        <div className="xhsFs-film">
          {showSprockets && <FsSprocketRow />}
          <div className="xhsFs-frames">
            {framesData.slice(0, total).map((f, i) => {
              const asImage = i < media;
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              return (
                <figure key={i}
                  className={'xhsFs-frame' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '') + (asImage ? '' : ' is-empty')}
                  style={{ '--c': f.color }}>
                  <div className="xhsFs-window" style={{ aspectRatio: ratio }}>
                    {asImage ? (
                      <image-slot id={`xhsFs-media-${i}`} fit="cover" shape="rect"
                        placeholder={f.cap}></image-slot>
                    ) : (
                      <div className="xhsFs-noimg"><span className="xhsFs-initial">{f.initial}</span></div>
                    )}
                    <span className="xhsFs-frameno" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {showCaptions && (
                    <figcaption className="xhsFs-cap">
                      <span className="xhsFs-code">{f.code}</span>
                      <span className="xhsFs-captxt">{f.cap}</span>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
          {showSprockets && <FsSprocketRow />}
        </div>
      </div>

      <div className="xhsFs-caption">{copy.text004}</div>

      {showDecorations && (
        <React.Fragment>
          <FsSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 100, top: 120 }} />
          <FsSpark size={16} color="#27E021" style={{ position: 'absolute', left: 84, bottom: 84 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSFS_CSS = `
  .xhsFs-root{ padding:74px 110px 60px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsFs-head{ flex:0 0 auto; margin-bottom:34px; }
  .xhsFs-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsFs-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsFs-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }

  .xhsFs-film{ width:100%; background:linear-gradient(180deg,#141414,#0b0b0b); border-radius:14px;
    border:1.5px solid rgba(255,255,255,.08); box-shadow:0 26px 64px rgba(0,0,0,.5);
    padding:18px 30px; display:flex; flex-direction:column; gap:16px; }

  .xhsFs-sprockets{ display:flex; justify-content:space-between; padding:0 6px; }
  .xhsFs-hole{ width:34px; height:24px; border-radius:5px; background:#000;
    box-shadow:inset 0 2px 4px rgba(0,0,0,.8), inset 0 0 0 1px rgba(255,255,255,.05); }

  .xhsFs-frames{ display:flex; gap:18px; align-items:stretch; }
  .xhsFs-frame{ flex:1 1 0; min-width:0; margin:0; display:flex; flex-direction:column; gap:12px;
    transition:opacity .3s, filter .3s, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsFs-frame.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsFs-frame.is-hot{ transform:scale(1.035); z-index:2; }

  .xhsFs-window{ position:relative; width:100%; border-radius:8px; overflow:hidden; background:#050505;
    border:2px solid #000; box-shadow:inset 0 0 0 1px rgba(255,255,255,.08); }
  .xhsFs-frame.is-hot .xhsFs-window{ box-shadow:0 0 0 3px var(--c), 0 0 36px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsFs-window image-slot{ width:100%; height:100%; display:block; }
  .xhsFs-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:repeating-linear-gradient(135deg, #121212 0 12px, #0c0c0c 12px 24px); }
  .xhsFs-initial{ font-family:"Space Mono",monospace; font-weight:700; font-size:88px; line-height:1; color:var(--c); opacity:.5;
    text-shadow:0 0 34px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsFs-frameno{ position:absolute; top:8px; left:10px; font-family:"Space Mono",monospace; font-size:16px; font-weight:700;
    color:#fff; padding:2px 8px; border-radius:6px; background:rgba(0,0,0,.55); letter-spacing:.06em; }

  .xhsFs-cap{ display:flex; flex-direction:column; gap:3px; padding-left:2px; }
  .xhsFs-code{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.08em; color:var(--c); opacity:.9; }
  .xhsFs-captxt{ font-size:21px; font-weight:700; color:#e2e2e2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  .xhsFs-caption{ flex:0 0 auto; margin-top:24px; font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'filmstrip',
  label: '胶片印样',
  Component: Slide41Filmstrip,
  defaults: {
      copy: SLIDE41FILMSTRIP_COPY,
      framesData: XHSFS_FRAMES,
    ...hlDefaults,
    mediaCount: 3,
    frameRatio: 'landscape',
    focusEnabled: false,
    focusIndex: 1,
    showCaptions: true,
    showSprockets: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }], default: SLIDE41FILMSTRIP_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'framesData', type: 'list', label: 'framesData', itemLabel: '数据', fields: [{ key: "color", label: "color" }, { key: "initial", label: "initial" }, { key: "code", label: "code" }, { key: "cap", label: "cap" }], default: XHSFS_FRAMES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片格数', min: 0, max: 4, step: 1, default: 3, desc: '显示图片槽的格数(其余转未曝光占位)' },
    { key: 'frameRatio', type: 'radio', label: '画框构图', options: ['landscape', 'portrait'], optionLabels: ['横构图', '竖构图'], default: 'landscape', desc: '画框横 / 竖比例' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一格' },
    { key: 'focusIndex', type: 'slider', label: '重点格序号', min: 1, max: 4, step: 1, default: 1, showIf: (v) => v.focusEnabled, desc: '被高亮格的序号' },
    { key: 'showCaptions', type: 'toggle', label: '逐格说明', default: true, desc: '每格编号 / 说明' },
    { key: 'showSprockets', type: 'toggle', label: '胶片齿孔', default: true, desc: '上下齿孔显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide41Filmstrip.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide41Filmstrip;
