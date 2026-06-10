/*
 * Slide65Triptych — 资本现场·全幅三联（图片 · 全屏三联全景新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsTp- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Trio（竖版卡片+数据）/ Gallery（马赛克网格）/ Filmstrip（胶片条）互补：
 * 本页是「全幅三联全景」——三条等宽全高图片槽并排铺满整屏（cover 填满、永不溢出、天然对齐），
 * 每条底部浮层一句现场注解，顶部浮层一行总标题。mediaCount 控制有多少条真正显示图片槽，
 * 其余回退「未上传」霓虹占位条。focus 强化某一条 + 弱化其余。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 显示图片槽的条数(0–3)  默认 3
 *  focusEnabled    bool   重点条高亮开关          默认 false
 *  focusIndex      number 重点条序号(从1起)      默认 2   范围 1–3
 *  showCaptions    bool   每条底部现场注解显隐     默认 true
 *  showHeader      bool   顶部总标题浮层显隐       默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide65Triptych, { defaults, controls } from './Slide65Triptych.jsx'
 */
import React from 'react';

// 三联现场（写死）：编号 / 中文场景 / 英文 / 注解 / 主色 / 占位首字
const XHSTP_PANELS = [
  { no: '01', zh: '算力机房', en: 'COMPUTE', note: '260 亿美元流向基础设施', color: '#27E021', glyph: 'C' },
  { no: '02', zh: '路演签约', en: 'DEALS', note: '97 笔单笔过亿的大额融资', color: '#FFC700', glyph: 'D' },
  { no: '03', zh: '人才争夺', en: 'TALENT', note: '顶尖团队成为最稀缺资产', color: '#15A7F0', glyph: 'T' },
];

function TpSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE65TRIPTYCH_COPY = {
  text001: "资本现场 · ON THE GROUND",
  text002: "钱涌向哪里，",
  text003: "故事就发生在哪里",
};
function Slide65Triptych(props) {
  const {
      copy = SLIDE65TRIPTYCH_COPY,
      panelsData = XHSTP_PANELS,
    mediaCount = 3,
    focusEnabled = false,
    focusIndex = 2,
    showCaptions = true,
    showHeader = true,
    showDecorations = true,
  } = props;

  const mc = Math.max(0, Math.min(3, mediaCount));
  const focus = Math.max(1, Math.min(3, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsTp-root" data-label="全幅三联" data-screen-label="全幅三联">
      <style>{XHSTP_CSS}</style>

      <div className="xhsTp-strips">
        {panelsData.map((p, i) => {
          const hasImg = i < mc;
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsTp-strip' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': p.color }}>
              {hasImg ? (
                <image-slot id={`xhsTp-media-${i}`} fit="cover" shape="rect"
                  placeholder={`资本现场 · ${p.zh}`}></image-slot>
              ) : (
                <div className="xhsTp-noimg"><span className="xhsTp-glyph">{p.glyph}</span></div>
              )}
              <span className="xhsTp-scrim" aria-hidden="true" />
              <span className="xhsTp-no" aria-hidden="true">{p.no}</span>
              {showCaptions && (
                <div className="xhsTp-cap">
                  <span className="xhsTp-capEn">{p.en}</span>
                  <span className="xhsTp-capZh">{p.zh}</span>
                  <span className="xhsTp-capNote">{p.note}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showHeader && (
        <header className="xhsTp-head">
          <div className="xhsTp-kicker">{copy.text001}</div>
          <h2 className="xhsTp-title">{copy.text002}<br />{copy.text003}</h2>
        </header>
      )}

      {showDecorations && (
        <React.Fragment>
          <TpSpark size={22} color="#FF9FE2" style={{ position: 'absolute', right: 56, top: 110, zIndex: 5 }} />
          <TpSpark size={14} color="#FFC700" style={{ position: 'absolute', left: '50%', top: 70, zIndex: 5 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSTP_CSS = `
  .xhsTp-root{ padding:0; position:relative; box-sizing:border-box; height:100%; overflow:hidden; background:#000; }
  .xhsTp-strips{ display:flex; height:100%; gap:5px; }
  .xhsTp-strip{ position:relative; flex:1 1 0; min-width:0; height:100%; overflow:hidden; background:#0a0a0a;
    transition:opacity .35s ease, filter .35s ease; }
  .xhsTp-strip.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsTp-strip.is-hot{ box-shadow:inset 0 0 0 4px var(--c), inset 0 0 90px color-mix(in srgb, var(--c) 28%, transparent); z-index:2; }
  .xhsTp-strip image-slot{ width:100%; height:100%; display:block; }
  .xhsTp-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(130% 90% at 50% 30%, color-mix(in srgb, var(--c) 30%, #0e0e0e) 0%, #070707 72%); }
  .xhsTp-glyph{ font-family:"Space Mono",monospace; font-size:300px; font-weight:700; color:var(--c); line-height:1; opacity:.9;
    text-shadow:0 0 60px color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsTp-scrim{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 50%, rgba(0,0,0,.86) 100%); }

  .xhsTp-no{ position:absolute; top:32px; right:34px; font-family:"Space Mono",monospace; font-size:34px; font-weight:700;
    color:#fff; letter-spacing:.04em; text-shadow:0 2px 12px rgba(0,0,0,.7); }
  .xhsTp-strip.is-hot .xhsTp-no{ color:var(--c); }

  .xhsTp-cap{ position:absolute; left:46px; right:46px; bottom:56px; display:flex; flex-direction:column; gap:6px; }
  .xhsTp-capEn{ font-family:"Space Mono",monospace; font-size:20px; font-weight:700; letter-spacing:.16em; color:var(--c);
    text-shadow:0 2px 10px rgba(0,0,0,.8); }
  .xhsTp-capZh{ font-size:54px; font-weight:900; color:#fff; line-height:1.02; text-shadow:0 4px 18px rgba(0,0,0,.7); }
  .xhsTp-capNote{ font-size:24px; font-weight:600; color:#dcdcdc; line-height:1.35; text-shadow:0 2px 10px rgba(0,0,0,.85); max-width:96%; text-wrap:pretty; }

  .xhsTp-head{ position:absolute; top:64px; left:70px; z-index:4; max-width:760px; pointer-events:none; }
  .xhsTp-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#cfcfcf; margin-bottom:16px;
    text-shadow:0 2px 12px rgba(0,0,0,.8); }
  .xhsTp-title{ margin:0; font-size:66px; font-weight:900; color:#fff; line-height:1.08; letter-spacing:.01em;
    text-shadow:0 4px 22px rgba(0,0,0,.8); }
`;

const META = {
  id: 'triptych',
  label: '全幅三联',
  Component: Slide65Triptych,
  defaults: {
      copy: SLIDE65TRIPTYCH_COPY,
      panelsData: XHSTP_PANELS,
    mediaCount: 3,
    focusEnabled: false,
    focusIndex: 2,
    showCaptions: true,
    showHeader: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }], default: SLIDE65TRIPTYCH_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'panelsData', type: 'list', label: 'panelsData', itemLabel: '数据', fields: [{ key: "no", label: "no" }, { key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "note", label: "note" }, { key: "color", label: "color" }, { key: "glyph", label: "glyph" }], default: XHSTP_PANELS, desc: '默认数据内容' },
    { key: 'mediaCount', type: 'slider', label: '图片槽条数', min: 0, max: 3, step: 1, default: 3, desc: '显示图片槽的条数(其余转霓虹占位)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一条' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 2, showIf: (v) => v.focusEnabled, desc: '被高亮条的序号' },
    { key: 'showCaptions', type: 'toggle', label: '现场注解', default: true, desc: '每条底部现场注解' },
    { key: 'showHeader', type: 'toggle', label: '顶部标题', default: true, desc: '顶部总标题浮层' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide65Triptych.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide65Triptych;
