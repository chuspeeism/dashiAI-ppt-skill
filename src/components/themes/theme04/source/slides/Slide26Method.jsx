/*
 * Slide26Method — 研究方法 · 横纵分析法（图片页 · 自适应配图 + 双维度概念）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsMth- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 图片槽（image-slot）：
 *  - 单张自适应：读取上传图片真实宽高比，反写容器 aspect-ratio（夹 0.62–1.9）；
 *  - mediaCount=0 时转为无图、文案居中铺满的纯概念排版。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片槽数量(0/1)       默认 1   可选 0–1
 *  imageSide       enum   配图位置            默认 'left' 可选 'left'|'right'
 *  dimCount        number 展示的维度卡数量       默认 2   可选 1–2
 *  accentTone      enum   主色调(通用命名)      默认 'blue' 可选 green/yellow/blue/pink
 *  showSynthesis   bool   底部「交叉」结论条显隐  默认 true
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide26Method, { defaults, controls } from './Slide26Method.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSMTH_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
const XHSMTH_DIMS = [
  { tag: '横向 · 空间维度', en: 'HORIZONTAL', color: '#15A7F0', axis: 'h',
    desc: '在同一时间截面，对公司 / 赛道 / 轮次 / 地区横向对比——回答「谁更大、谁更密集、资源集中在哪里」。' },
  { tag: '纵向 · 时间维度', en: 'VERTICAL', color: '#FFC700', axis: 'v',
    desc: '沿时间轴追踪同一指标的演化——回答「趋势向上还是向下、拐点在何处、节奏是否可持续」。' },
];

function MthSpark({ size = 20, color = '#fff', style }) {
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

function MthAxisIcon({ axis, color }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (axis === 'v') {
    return (<svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
      <path {...p} d="M12 21V4" /><path {...p} d="M6 10l6-6 6 6" /></svg>);
  }
  return (<svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
    <path {...p} d="M3 12h17" /><path {...p} d="M14 6l6 6-6 6" /></svg>);
}

// 自适应图片槽：读取已上传图片真实比例，反写容器 aspect-ratio（夹 0.62–1.9）
function MthMediaSlot({ slotId, placeholder }) {
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
    <div className="xhsMth-slot" style={{ aspectRatio: filled ? aspect : '4 / 3' }}>
      <image-slot ref={ref} id={slotId} fit="contain" shape="rounded" radius="20"
        placeholder={placeholder || '拖入图片'}></image-slot>
    </div>
  );
}


const SLIDE26METHOD_COPY = {
  text001: "研究方法 · METHODOLOGY",
  text002: "横纵分析法，",
  text003: "两个正交维度",
  text004: "看清同一组数据",
  text005: "×",
  text006: "两维交叉，进一步识别",
  text007: "产业链的层级结构",
  text008: "与",
  text009: "因果传导关系",
  placeholder001: "研究框架 / 数据墙示意",
};
function Slide26Method(props) {
  const {
      copy = SLIDE26METHOD_COPY,
      dimsData = XHSMTH_DIMS,
    mediaCount = 1,
    imageSide = 'left',
    dimCount = 2,
    accentTone = 'blue',
    showSynthesis = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(1, mediaCount));
  const accent = XHSMTH_TONES[accentTone] || XHSMTH_TONES.blue;
  const dims = dimsData.slice(0, Math.max(1, Math.min(2, dimCount)));
  const hasImg = media > 0;

  const text = (
    <div className="xhsMth-text">
      <div className="xhsMth-kicker">{copy.text001}</div>
      <h2 className="xhsMth-title">{copy.text002}<HL color={accent} variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>{copy.text004}</h2>

      <div className="xhsMth-dims">
        {dims.map((d, i) => (
          <div key={i} className="xhsMth-dim" style={{ '--c': d.color }}>
            <span className="xhsMth-dim-ic"><MthAxisIcon axis={d.axis} color={d.color} /></span>
            <div className="xhsMth-dim-body">
              <div className="xhsMth-dim-tag">{d.tag}<i>{d.en}</i></div>
              <p className="xhsMth-dim-desc">{d.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {showSynthesis && (
        <div className="xhsMth-syn">
          <span className="xhsMth-syn-x">{copy.text005}</span>
          <span className="xhsMth-syn-txt">{copy.text006}<b>{copy.text007}</b>{copy.text008}<b>{copy.text009}</b>。</span>
        </div>
      )}
    </div>
  );

  const figure = hasImg ? (
    <div className="xhsMth-figure">
      <MthMediaSlot slotId="xhsMth-media-0" placeholder={copy.placeholder001} />
    </div>
  ) : null;

  return (
    <section className={'xhs-base xhsMth-root' + (hasImg ? '' : ' is-noimg') + (imageSide === 'right' ? ' is-right' : '')}
      data-label="研究方法" data-screen-label="研究方法" style={{ '--c': accent }}>
      <style>{XHSMTH_CSS}</style>

      <div className="xhsMth-stage">
        {hasImg && imageSide === 'left' && figure}
        {text}
        {hasImg && imageSide === 'right' && figure}
      </div>

      {showDecorations && (
        <React.Fragment>
          <MthSpark size={26} color="#27E021" style={{ position: 'absolute', right: 96, top: 120 }} />
          <MthSpark size={18} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 110 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 150, bottom: 140, width: 42, height: 42, borderRadius: '50%', border: '5px solid rgba(255,255,255,.8)', boxShadow: '0 0 20px rgba(255,255,255,.2)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSMTH_CSS = `
  .xhsMth-root{ padding:84px 110px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsMth-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; gap:84px; }
  .xhsMth-root.is-noimg .xhsMth-stage{ justify-content:center; }

  .xhsMth-text{ width:840px; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsMth-root.is-noimg .xhsMth-text{ width:auto; max-width:1180px; }
  .xhsMth-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:18px; }
  .xhsMth-title{ margin:0 0 34px; font-size:54px; font-weight:900; color:#fff; line-height:1.18; }

  .xhsMth-dims{ display:flex; flex-direction:column; gap:22px; }
  .xhsMth-dim{ display:flex; gap:26px; align-items:flex-start; padding:26px 30px; border-radius:20px;
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 13%, #161616), #0d0d0d 72%);
    border:1.5px solid color-mix(in srgb, var(--c) 38%, rgba(255,255,255,.08)); }
  .xhsMth-dim-ic{ flex:0 0 auto; width:72px; height:72px; border-radius:18px; display:flex; align-items:center; justify-content:center;
    background:color-mix(in srgb, var(--c) 14%, rgba(255,255,255,.03)); border:1.5px solid color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsMth-dim-body{ min-width:0; }
  .xhsMth-dim-tag{ font-size:30px; font-weight:900; color:var(--c); line-height:1; display:flex; align-items:baseline; gap:14px;
    text-shadow:0 0 20px color-mix(in srgb, var(--c) 38%, transparent); }
  .xhsMth-dim-tag i{ font-style:normal; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.12em; color:#6f6f6f; }
  .xhsMth-dim-desc{ margin:12px 0 0; font-size:23px; line-height:1.56; font-weight:500; color:#aeaeae; }

  .xhsMth-syn{ display:flex; align-items:center; gap:18px; margin-top:30px; padding:22px 30px; border-radius:18px;
    background:linear-gradient(100deg, color-mix(in srgb, var(--c) 16%, #121212), #0d0d0d);
    border:1.5px solid color-mix(in srgb, var(--c) 32%, rgba(255,255,255,.08));
    font-size:25px; font-weight:600; color:#dcdcdc; line-height:1.4; }
  .xhsMth-syn b{ color:#fff; font-weight:900; }
  .xhsMth-syn-txt{ flex:1; min-width:0; }
  .xhsMth-syn-x{ flex:0 0 auto; width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-size:34px; font-weight:900; color:#031018; background:var(--c);
    box-shadow:0 0 24px color-mix(in srgb, var(--c) 50%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }

  .xhsMth-figure{ position:relative; flex:1 1 auto; min-width:0; display:flex; align-items:center; justify-content:center; }
  .xhsMth-slot{ width:100%; max-width:680px; max-height:780px; min-width:0; border-radius:20px; overflow:hidden;
    background:#101010; border:1.5px solid rgba(255,255,255,.08); box-shadow:0 24px 60px rgba(0,0,0,.55); margin:0 auto; }
  .xhsMth-slot image-slot{ width:100%; height:100%; display:block; }
`;

const META = {
  id: 'method',
  label: '研究方法',
  Component: Slide26Method,
  defaults: {
      copy: SLIDE26METHOD_COPY,
      dimsData: XHSMTH_DIMS,
    ...hlDefaults,
    mediaCount: 1,
    imageSide: 'left',
    dimCount: 2,
    accentTone: 'blue',
    showSynthesis: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "placeholder001", label: "placeholder001" }], default: SLIDE26METHOD_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'dimsData', type: 'list', label: 'dimsData', itemLabel: '数据', fields: [{ key: "tag", label: "tag" }, { key: "en", label: "en" }, { key: "color", label: "color" }, { key: "axis", label: "axis" }, { key: "desc", label: "desc" }], default: XHSMTH_DIMS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 1, step: 1, default: 1, desc: '自适应配图(0=纯概念居中)' },
    { key: 'imageSide', type: 'radio', label: '配图位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'left', showIf: (v) => v.mediaCount > 0, desc: '配图在左 / 右(有图时生效)' },
    { key: 'dimCount', type: 'slider', label: '维度卡数量', min: 1, max: 2, step: 1, default: 2, desc: '展示的维度卡数量(横向 / 纵向)' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调(通用命名)' },
    { key: 'showSynthesis', type: 'toggle', label: '交叉结论条', default: true, desc: '底部「两维交叉」结论条' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide26Method.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide26Method;
