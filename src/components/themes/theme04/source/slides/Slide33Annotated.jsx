/*
 * Slide33Annotated — 标注特写（图片页 · 自适应单张大图 + 浮层标注 pin）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsAn- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 图片槽（image-slot）：
 *  - 单张自适应：读取用户上传图片真实宽高比，反写容器 aspect-ratio（夹 0.62–1.9）；
 *  - 标注 pin 以百分比锚点浮在图片上，随图片区域定位；
 *  - mediaCount=0 时转为无图态，标注改为图片下方数据卡，仍保持平衡美观。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片槽数量(0/1)       默认 1   可选 0–1
 *  imageSide       enum   配图位置            默认 'right' 可选 'left'|'right'
 *  accentTone      enum   主色调(通用命名)      默认 'blue' 可选 green/yellow/blue/pink
 *  pinCount        number 浮层标注数量          默认 3   可选 0–3
 *  focusEnabled    bool   重点标注放大开关       默认 true
 *  focusIndex      number 重点标注序号(从1起)    默认 1
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide33Annotated, { defaults, controls } from './Slide33Annotated.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSAN_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
// 标注锚点（x/y 为图片区域百分比，可换内容复用）
const XHSAN_PINS = [
  { x: 31, y: 26, val: '10万', unit: '卡', label: 'H100 GPU · 同一集群', color: '#27E021' },
  { x: 69, y: 50, val: '122', unit: '天', label: '从破土到点亮上线', color: '#FFC700' },
  { x: 44, y: 77, val: '孟菲斯', unit: '', label: '田纳西 · 电网就近供电', color: '#15A7F0' },
];

function AnSpark({ size = 20, color = '#fff', style }) {
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

// 自适应图片槽：读取已上传图片真实比例，反写容器 aspect-ratio（夹 0.62–1.9）
function AnMediaSlot({ slotId, placeholder, children }) {
  const ref = React.useRef(null);
  const [aspect, setAspect] = React.useState('4 / 3');
  const [filled, setFilled] = React.useState(false);
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let stop = false;
    const read = () => {
      try {
        const img = host.shadowRoot && host.shadowRoot.querySelector('.frame img');
        const f = host.hasAttribute('data-filled');
        setFilled(f);
        if (f && img && img.naturalWidth && img.naturalHeight) {
          let r = img.naturalWidth / img.naturalHeight;
          r = Math.max(0.62, Math.min(1.9, r));
          setAspect(String(r.toFixed(4)));
          return true;
        }
      } catch (e) {}
      return false;
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(host, { attributes: true, attributeFilter: ['data-filled'] });
    const iv = setInterval(() => { if (read() || stop) clearInterval(iv); }, 500);
    return () => { stop = true; mo.disconnect(); clearInterval(iv); };
  }, []);
  return (
    <div className="xhsAn-slot" style={{ aspectRatio: filled ? aspect : '4 / 3' }}>
      <image-slot ref={ref} id={slotId} fit="cover" shape="rounded" radius="22"
        placeholder={placeholder || '拖入图片'}></image-slot>
      {children}
    </div>
  );
}


const SLIDE33ANNOTATED_COPY = {
  text001: "算力军备 · CASE / COLOSSUS",
  text002: "把超算，",
  text003: "122 天",
  text004: "盖出来",
  text005: "大额融资的尽头是算力。xAI 在孟菲斯把十万张 H100 塞进同一个集群，用四个月完成传统需要数年的工程—— 资本、电力与工程速度，正在成为大模型竞赛真正的护城河。",
  placeholder001: "超算中心 / GPU 集群 / 数据中心实拍",
};
function Slide33Annotated(props) {
  const {
      copy = SLIDE33ANNOTATED_COPY,
      pinsData = XHSAN_PINS,
    mediaCount = 1,
    imageSide = 'right',
    accentTone = 'blue',
    pinCount = 3,
    focusEnabled = true,
    focusIndex = 1,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(1, mediaCount));
  const accent = XHSAN_TONES[accentTone] || XHSAN_TONES.blue;
  const pc = Math.max(0, Math.min(3, pinCount));
  const pins = pinsData.slice(0, pc);
  const focus = Math.max(1, Math.min(Math.max(pc, 1), focusIndex)) - 1;
  const hasImg = media > 0;

  const text = (
    <div className="xhsAn-text">
      <div className="xhsAn-kicker">{copy.text001}</div>
      <h2 className="xhsAn-name">{copy.text002}<HL color={accent} variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>{copy.text004}</h2>
      <p className="xhsAn-body">{copy.text005}</p>
      {!hasImg && pc > 0 && (
        <div className="xhsAn-cards">
          {pins.map((p, i) => (
            <div key={i} className={'xhsAn-card' + (focusEnabled && i === focus ? ' is-hot' : '')} style={{ '--c': p.color }}>
              <span className="xhsAn-card-val">{p.val}<i>{p.unit}</i></span>
              <span className="xhsAn-card-label">{p.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const figure = hasImg ? (
    <div className="xhsAn-figure">
      <AnMediaSlot slotId="xhsAn-media-0" placeholder={copy.placeholder001}>
        <span className="xhsAn-scrim" aria-hidden="true" />
        {pins.map((p, i) => {
          const hot = focusEnabled && i === focus;
          return (
            <div key={i} className={'xhsAn-pin' + (hot ? ' is-hot' : '')}
              style={{ left: p.x + '%', top: p.y + '%', '--c': p.color }}>
              <span className="xhsAn-pinDot" aria-hidden="true" />
              <span className="xhsAn-pinCard">
                <span className="xhsAn-pinVal">{p.val}<i>{p.unit}</i></span>
                <span className="xhsAn-pinLabel">{p.label}</span>
              </span>
            </div>
          );
        })}
      </AnMediaSlot>
    </div>
  ) : null;

  return (
    <section className={'xhs-base xhsAn-root' + (hasImg ? '' : ' is-noimg') + (imageSide === 'left' ? ' is-left' : '')}
      data-label="标注特写" data-screen-label="标注特写" style={{ '--c': accent }}>
      <style>{XHSAN_CSS}</style>

      <div className="xhsAn-stage">
        {hasImg && imageSide === 'left' && figure}
        {text}
        {hasImg && imageSide === 'right' && figure}
      </div>

      {showDecorations && (
        <React.Fragment>
          <AnSpark size={26} color="#27E021" style={{ position: 'absolute', left: 90, bottom: 120 }} />
          <AnSpark size={18} color="#FF9FE2" style={{ position: 'absolute', left: 80, top: 130 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSAN_CSS = `
  .xhsAn-root{ padding:84px 110px 70px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsAn-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; gap:78px; }
  .xhsAn-root.is-noimg .xhsAn-stage{ justify-content:center; }

  .xhsAn-text{ width:680px; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsAn-root.is-noimg .xhsAn-text{ width:auto; max-width:1120px; }
  .xhsAn-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:16px; }
  .xhsAn-name{ margin:0; font-size:88px; font-weight:900; color:#fff; line-height:1.02; letter-spacing:-.01em;
    text-shadow:0 0 50px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsAn-body{ margin:30px 0 0; font-size:26px; line-height:1.72; font-weight:500; color:#aeaeae; max-width:660px; }
  .xhsAn-root.is-noimg .xhsAn-body{ max-width:980px; font-size:28px; }

  .xhsAn-cards{ display:flex; gap:18px; margin-top:40px; flex-wrap:wrap; }
  .xhsAn-card{ flex:1; min-width:230px; padding:24px 28px; border-radius:18px; background:linear-gradient(160deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.08); display:flex; flex-direction:column; gap:9px; transition:border-color .3s, box-shadow .3s; }
  .xhsAn-card.is-hot{ border-color:var(--c); box-shadow:0 0 44px color-mix(in srgb, var(--c) 26%, transparent); }
  .xhsAn-card-val{ font-family:"Space Mono",monospace; font-size:50px; font-weight:700; line-height:1; color:var(--c);
    text-shadow:0 0 24px color-mix(in srgb, var(--c) 38%, transparent); }
  .xhsAn-card-val i{ font-style:normal; font-size:24px; font-weight:700; margin-left:3px; }
  .xhsAn-card-label{ font-size:20px; font-weight:600; color:#9a9a9a; }

  .xhsAn-figure{ position:relative; flex:1 1 auto; min-width:0; height:100%; display:flex; align-items:center; justify-content:center; }
  .xhsAn-slot{ position:relative; width:100%; max-width:880px; max-height:830px; min-width:0; border-radius:22px; overflow:hidden;
    background:#101010; border:1.5px solid rgba(255,255,255,.08); box-shadow:0 24px 64px rgba(0,0,0,.6); margin:0 auto; }
  .xhsAn-slot image-slot{ width:100%; height:100%; display:block; }
  .xhsAn-scrim{ position:absolute; inset:0; pointer-events:none; z-index:1;
    background:radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,.36) 100%); }

  .xhsAn-pin{ position:absolute; z-index:3; transform:translate(-50%,-50%); display:flex; align-items:center; gap:14px;
    transition:transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsAn-pinDot{ flex:0 0 auto; width:20px; height:20px; border-radius:50%; background:var(--c); position:relative;
    box-shadow:0 0 0 6px color-mix(in srgb, var(--c) 26%, transparent), 0 0 22px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsAn-pinCard{ display:flex; flex-direction:column; gap:2px; padding:12px 20px; border-radius:16px;
    background:rgba(10,10,12,.72); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
    border:1.5px solid color-mix(in srgb, var(--c) 50%, rgba(255,255,255,.12));
    box-shadow:0 14px 34px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.12); white-space:nowrap; }
  .xhsAn-pinVal{ font-family:"Space Mono",monospace; font-size:38px; font-weight:700; line-height:1; color:#fff; }
  .xhsAn-pinVal i{ font-style:normal; font-size:21px; font-weight:700; margin-left:3px; color:var(--c); }
  .xhsAn-pinLabel{ font-size:19px; font-weight:600; color:#c3c3c3; }
  .xhsAn-pin.is-hot{ transform:translate(-50%,-50%) scale(1.12); z-index:4; }
  .xhsAn-pin.is-hot .xhsAn-pinDot{ box-shadow:0 0 0 8px color-mix(in srgb, var(--c) 30%, transparent), 0 0 30px color-mix(in srgb, var(--c) 85%, transparent); }
  .xhsAn-pin.is-hot .xhsAn-pinCard{ border-color:var(--c); box-shadow:0 16px 40px rgba(0,0,0,.6), 0 0 40px color-mix(in srgb, var(--c) 32%, transparent), inset 0 1px 0 rgba(255,255,255,.14); }
`;

const META = {
  id: 'annotated',
  label: '标注特写',
  Component: Slide33Annotated,
  defaults: {
      copy: SLIDE33ANNOTATED_COPY,
      pinsData: XHSAN_PINS,
    ...hlDefaults,
    mediaCount: 1,
    imageSide: 'right',
    accentTone: 'blue',
    pinCount: 3,
    focusEnabled: true,
    focusIndex: 1,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "placeholder001", label: "placeholder001" }], default: SLIDE33ANNOTATED_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'pinsData', type: 'list', label: 'pinsData', itemLabel: '数据', fields: [{ key: "x", label: "x" }, { key: "y", label: "y" }, { key: "val", label: "val" }, { key: "unit", label: "unit" }, { key: "label", label: "label" }, { key: "color", label: "color" }], default: XHSAN_PINS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 1, step: 1, default: 1, desc: '自适应单张大图(0=纯文案+数据卡)' },
    { key: 'imageSide', type: 'radio', label: '配图位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'right', showIf: (v) => v.mediaCount > 0, desc: '配图在左 / 右(有图时生效)' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调(通用命名)' },
    { key: 'pinCount', type: 'slider', label: '标注数量', min: 0, max: 3, step: 1, default: 3, desc: '浮层标注 pin 数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点放大', default: true, desc: '是否放大某一标注' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'pinCount', showIf: (v) => v.focusEnabled, desc: '被放大标注的序号' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide33Annotated.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide33Annotated;
