/*
 * Slide67Showcase — 焦点机位·特写 + 缩略图鸟（图片 · hero + 缩略图鸟新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSw- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Spotlight（单图 + 浮层数据）/ Gallery（马赛克网格）/ Filmstrip（等幅胶片）互补：
 * 本页是「主图 + 缩略图鸟」的媒体陈列——左侧一张大主图（cover 填满受控画框、永不溢出），
 * 右侧标题导语 + 一列缩略图鸟（机位切面），focus 给某一缩略图加 accent 选中环。
 * mediaCount 控制有多少画框真正显示图片槽（主图优先），其余回退「霓虹机位」占位。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  thumbCount      number 右侧缩略图鸟数量(0–3)   默认 3
 *  mediaCount      number 显示图片槽的画框数(0–4) 默认 4（主图+缩略图共 1+thumbCount）
 *  imageSide       enum   主图位置               默认 'left' 可选 'left'|'right'
 *  focusEnabled    bool   缩略图选中环开关         默认 true
 *  focusIndex      number 选中缩略图序号(从1起)   默认 1   范围 1–thumbCount
 *  showHeroCaption bool   主图底部浮层注解显隐     默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide67Showcase, { defaults, controls } from './Slide67Showcase.jsx'
 */
import React from 'react';

const XHSSW_ACCENT = '#FF9FE2';
// 主图（写死）
const XHSSW_HERO = { no: '机位 01', tag: '主场 · MAIN', note: '签约现场：97 笔大额融资的缩影', glyph: '01' };
// 缩略图鸟（写死）：编号 / 标签 / 注解 / 主色 / 占位
const XHSSW_THUMBS = [
  { no: '02', tag: '算力', note: '资金的去向', color: '#27E021' },
  { no: '03', tag: '团队', note: '稀缺的人才', color: '#15A7F0' },
  { no: '04', tag: '路演', note: '争夺入场券', color: '#FFC700' },
];

function SwSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE67SHOWCASE_COPY = {
  placeholder001: "主图 · 资本现场主场",
  text001: "焦点机位 · SHOWCASE",
  text002: "同一笔大钱，",
  text003: "不同的现场切面",
  text004: "主图之外，再切三个机位——看资金、看团队、看入场券的争夺。",
};
function Slide67Showcase(props) {
  const {
      copy = SLIDE67SHOWCASE_COPY,
      thumbsData = XHSSW_THUMBS,
      heroData = XHSSW_HERO,
    thumbCount = 3,
    mediaCount = 4,
    imageSide = 'left',
    focusEnabled = true,
    focusIndex = 1,
    showHeroCaption = true,
    showDecorations = true,
  } = props;

  const tc = Math.max(0, Math.min(3, thumbCount));
  const thumbs = thumbsData.slice(0, tc);
  const mc = Math.max(0, Math.min(1 + tc, mediaCount));
  const heroImg = mc >= 1;
  const focus = Math.max(1, Math.min(Math.max(1, tc), focusIndex)) - 1;

  const hero = (
    <div className="xhsSw-hero">
      <div className="xhsSw-heroFrame">
        {heroImg ? (
          <image-slot id="xhsSw-media-0" fit="cover" shape="rect" placeholder={copy.placeholder001}></image-slot>
        ) : (
          <div className="xhsSw-noimg is-hero"><span className="xhsSw-glyph">{heroData.glyph}</span></div>
        )}
        <span className="xhsSw-heroScrim" aria-hidden="true" />
        <span className="xhsSw-heroNo">{heroData.no}</span>
        {showHeroCaption && (
          <div className="xhsSw-heroCap">
            <span className="xhsSw-heroTag">{heroData.tag}</span>
            <span className="xhsSw-heroNote">{heroData.note}</span>
          </div>
        )}
      </div>
    </div>
  );

  const rail = (
    <div className="xhsSw-rail">
      <header className="xhsSw-head">
        <div className="xhsSw-kicker">{copy.text001}</div>
        <h2 className="xhsSw-title">{copy.text002}<br />{copy.text003}</h2>
        <p className="xhsSw-lede">{copy.text004}</p>
      </header>
      {tc > 0 && (
        <div className="xhsSw-thumbs">
          {thumbs.map((t, i) => {
            const hasImg = i + 1 < mc;
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsSw-thumb' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': t.color }}>
                <div className="xhsSw-thumbFrame">
                  {hasImg ? (
                    <image-slot id={`xhsSw-media-${i + 1}`} fit="cover" shape="rect"
                      placeholder={`机位 ${t.no}`}></image-slot>
                  ) : (
                    <div className="xhsSw-noimg"><span className="xhsSw-tglyph">{t.no}</span></div>
                  )}
                  <span className="xhsSw-thumbScrim" aria-hidden="true" />
                </div>
                <div className="xhsSw-thumbMeta">
                  <span className="xhsSw-tno">{t.no}</span>
                  <span className="xhsSw-ttag">{t.tag}</span>
                  <span className="xhsSw-tnote">{t.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section className={'xhs-base xhsSw-root' + (imageSide === 'right' ? ' is-right' : '')}
      data-label="焦点机位" data-screen-label="焦点机位" style={{ '--ac': XHSSW_ACCENT }}>
      <style>{XHSSW_CSS}</style>
      {imageSide === 'right' ? <React.Fragment>{rail}{hero}</React.Fragment>
        : <React.Fragment>{hero}{rail}</React.Fragment>}

      {showDecorations && (
        <React.Fragment>
          <SwSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 64, top: 60, zIndex: 6 }} />
          <SwSpark size={15} color="#27E021" style={{ position: 'absolute', left: 64, bottom: 64, zIndex: 6 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSW_CSS = `
  .xhsSw-root{ padding:60px 70px; position:relative; display:flex; gap:46px; box-sizing:border-box; height:100%; }

  /* 主图 */
  .xhsSw-hero{ flex:1 1 0; min-width:0; display:flex; }
  .xhsSw-heroFrame{ position:relative; flex:1 1 auto; border-radius:24px; overflow:hidden; background:#0a0a0a;
    border:2px solid color-mix(in srgb, var(--ac) 34%, rgba(255,255,255,.08));
    box-shadow:0 30px 80px rgba(0,0,0,.55), 0 0 50px color-mix(in srgb, var(--ac) 14%, transparent); }
  .xhsSw-heroFrame image-slot{ width:100%; height:100%; display:block; }
  .xhsSw-heroScrim{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(0,0,0,.34) 0%, transparent 30%, transparent 52%, rgba(0,0,0,.82) 100%); }
  .xhsSw-heroNo{ position:absolute; top:26px; left:30px; font-family:"Space Mono",monospace; font-size:24px; font-weight:700;
    color:#fff; padding:5px 16px; border-radius:10px; background:rgba(0,0,0,.42); backdrop-filter:blur(4px);
    border:1.5px solid rgba(255,255,255,.2); }
  .xhsSw-heroCap{ position:absolute; left:40px; right:40px; bottom:42px; display:flex; flex-direction:column; gap:10px; }
  .xhsSw-heroTag{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; letter-spacing:.14em; color:var(--ac);
    text-shadow:0 2px 10px rgba(0,0,0,.8); }
  .xhsSw-heroNote{ font-size:40px; font-weight:900; color:#fff; line-height:1.12; text-shadow:0 4px 18px rgba(0,0,0,.75); text-wrap:pretty; }

  /* 右栏 */
  .xhsSw-rail{ flex:0 0 600px; display:flex; flex-direction:column; min-width:0; }
  .xhsSw-root.is-right .xhsSw-rail{ order:-1; }
  .xhsSw-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsSw-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsSw-title{ margin:0; font-size:50px; font-weight:900; color:#fff; line-height:1.08; }
  .xhsSw-lede{ margin:18px 0 0; font-size:23px; font-weight:600; color:#a6a6a6; line-height:1.45; text-wrap:pretty; }

  .xhsSw-thumbs{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; gap:16px; }
  .xhsSw-thumb{ flex:1 1 0; min-height:0; display:flex; align-items:stretch; gap:20px; padding:12px; border-radius:18px;
    background:linear-gradient(150deg, color-mix(in srgb, var(--c) 12%, #141414), #0b0b0b 74%);
    border:1.5px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,.06));
    transition:opacity .3s ease, filter .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsSw-thumb.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSw-thumb.is-hot{ border-color:var(--c); box-shadow:0 0 46px color-mix(in srgb, var(--c) 24%, transparent); transform:translateX(8px); }
  .xhsSw-thumbFrame{ position:relative; flex:0 0 220px; border-radius:12px; overflow:hidden; background:#0a0a0a;
    border:1.5px solid rgba(255,255,255,.08); }
  .xhsSw-thumb.is-hot .xhsSw-thumbFrame{ border-color:color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsSw-thumbFrame image-slot{ width:100%; height:100%; display:block; }
  .xhsSw-thumbScrim{ position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, transparent 55%, rgba(0,0,0,.5) 100%); }
  .xhsSw-thumbMeta{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:6px; padding-right:10px; }
  .xhsSw-tno{ font-family:"Space Mono",monospace; font-size:18px; font-weight:700; letter-spacing:.08em; color:var(--c); }
  .xhsSw-ttag{ font-size:30px; font-weight:900; color:#fff; line-height:1; }
  .xhsSw-tnote{ font-size:20px; font-weight:600; color:#9c9c9c; }

  /* 无图占位 */
  .xhsSw-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(120% 110% at 50% 28%, color-mix(in srgb, var(--c, var(--ac)) 28%, #101010) 0%, #080808 72%); }
  .xhsSw-glyph{ font-family:"Space Mono",monospace; font-size:230px; font-weight:700; color:var(--ac); line-height:1; opacity:.9;
    text-shadow:0 0 50px color-mix(in srgb, var(--ac) 55%, transparent); }
  .xhsSw-tglyph{ font-family:"Space Mono",monospace; font-size:74px; font-weight:700; color:transparent;
    -webkit-text-stroke:2px color-mix(in srgb, var(--c) 60%, #444); line-height:1; }
`;

const META = {
  id: 'showcase',
  label: '焦点机位',
  Component: Slide67Showcase,
  defaults: {
      copy: SLIDE67SHOWCASE_COPY,
      thumbsData: XHSSW_THUMBS,
      heroData: XHSSW_HERO,
    thumbCount: 3,
    mediaCount: 4,
    imageSide: 'left',
    focusEnabled: true,
    focusIndex: 1,
    showHeroCaption: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "placeholder001", label: "placeholder001" }, { key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }], default: SLIDE67SHOWCASE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'thumbsData', type: 'list', label: 'thumbsData', itemLabel: '数据', fields: [{ key: "no", label: "no" }, { key: "tag", label: "tag" }, { key: "note", label: "note" }, { key: "color", label: "color" }], default: XHSSW_THUMBS, desc: '默认数据内容' },
    { key: 'heroData', type: 'list', label: 'heroData', itemLabel: '数据', single: true, fields: [{ key: "no", label: "no" }, { key: "tag", label: "tag" }, { key: "note", label: "note" }, { key: "glyph", label: "glyph" }], default: XHSSW_HERO, desc: '默认数据内容' },
    { key: 'thumbCount', type: 'slider', label: '缩略图数量', min: 0, max: 3, step: 1, default: 3, desc: '右侧缩略图机位数量' },
    { key: 'mediaCount', type: 'slider', label: '图片槽画框数', min: 0, max: 4, step: 1, default: 4, desc: '显示图片槽的画框数(主图优先)' },
    { key: 'imageSide', type: 'radio', label: '主图位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'left', desc: '主图在左 / 右' },
    { key: 'focusEnabled', type: 'toggle', label: '选中环', default: true, showIf: (v) => v.thumbCount > 0, desc: '缩略图选中环' },
    { key: 'focusIndex', type: 'slider', label: '选中序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'thumbCount', showIf: (v) => v.thumbCount > 0 && v.focusEnabled, desc: '被选中缩略图序号' },
    { key: 'showHeroCaption', type: 'toggle', label: '主图注解', default: true, desc: '主图底部浮层注解' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide67Showcase.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide67Showcase;
