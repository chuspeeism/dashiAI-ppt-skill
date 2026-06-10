/*
 * Slide25Spotlight — 焦点特写（图片页 · 自适应单张大图 + 浮层数据 + 金句）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSp- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 图片槽（image-slot）：
 *  - 单张自适应：读取用户上传图片真实宽高比，反写容器 aspect-ratio（夹 0.62–1.9）；
 *  - mediaCount=0 时转为无图、文案居中铺满的纯特写排版，仍保持平衡美观。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片槽数量(0/1)       默认 1   可选 0–1
 *  imageSide       enum   配图位置            默认 'left' 可选 'left'|'right'
 *  accentTone      enum   主色调(通用命名)      默认 'green' 可选 green/yellow/blue/pink
 *  statCount       number 浮层数据卡数量        默认 3   可选 0–3
 *  showQuote       bool   底部金句显隐          默认 true
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide25Spotlight, { defaults, controls } from './Slide25Spotlight.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSSP_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
const XHSSP_STATS = [
  { value: '6.8', unit: '亿', label: '2024 融资额 / 美元' },
  { value: '2022', unit: '', label: '公司成立年份' },
  { value: '人形', unit: '机器人', label: '具身智能赛道' },
];

function SpSpark({ size = 20, color = '#fff', style }) {
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
function SpMediaSlot({ slotId, placeholder }) {
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
    <div className="xhsSp-slot" style={{ aspectRatio: filled ? aspect : '4 / 3' }}>
      <image-slot ref={ref} id={slotId} fit="contain" shape="rounded" radius="20"
        placeholder={placeholder || '拖入图片'}></image-slot>
    </div>
  );
}


const SLIDE25SPOTLIGHT_COPY = {
  text001: "具身智能 · EMBODIED AI",
  text002: "Figure AI",
  text003: "人形机器人，硬科技的",
  text004: "长周期下注",
  text005: "资本愿意为「具身智能」的星辰大海买单，但兑现周期远长于软件——它需要长周期的技术积累， 是一场关于耐心的赌注。一旦机器人真正理解物理世界，想象空间将远超任何一个软件应用。",
  placeholder001: "具身智能 / 人形机器人实拍",
  text006: "FOCUS",
  text007: "“",
  text008: "真正的通用智能，需要一具身体来理解物理世界——这正是具身智能值得长期押注的理由。",
};
function Slide25Spotlight(props) {
  const {
      copy = SLIDE25SPOTLIGHT_COPY,
      statsData = XHSSP_STATS,
    mediaCount = 1,
    imageSide = 'left',
    accentTone = 'green',
    statCount = 3,
    showQuote = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(1, mediaCount));
  const accent = XHSSP_TONES[accentTone] || XHSSP_TONES.green;
  const scount = Math.max(0, Math.min(3, statCount));
  const stats = statsData.slice(0, scount);
  const hasImg = media > 0;

  const text = (
    <div className="xhsSp-text">
      <div className="xhsSp-kicker">{copy.text001}</div>
      <h2 className="xhsSp-name">{copy.text002}</h2>
      <div className="xhsSp-tagline">{copy.text003}<HL color={accent} variant={hlStyle} tilt={hlTilt}>{copy.text004}</HL>
      </div>
      <p className="xhsSp-body">{copy.text005}</p>

      {scount > 0 && (
        <div className="xhsSp-stats">
          {stats.map((s, i) => (
            <div key={i} className="xhsSp-stat">
              <span className="xhsSp-stat-val">{s.value}<i>{s.unit}</i></span>
              <span className="xhsSp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const figure = hasImg ? (
    <div className="xhsSp-figure">
      <SpMediaSlot slotId="xhsSp-media-0" placeholder={copy.placeholder001} />
      {showDecorations && <span className="xhsSp-tag" aria-hidden="true">{copy.text006}</span>}
    </div>
  ) : null;

  return (
    <section className={'xhs-base xhsSp-root' + (hasImg ? '' : ' is-noimg') + (imageSide === 'right' ? ' is-right' : '')}
      data-label="焦点特写" data-screen-label="焦点特写" style={{ '--c': accent }}>
      <style>{XHSSP_CSS}</style>

      <div className="xhsSp-stage">
        {hasImg && imageSide === 'left' && figure}
        {text}
        {hasImg && imageSide === 'right' && figure}
      </div>

      {showQuote && (
        <footer className="xhsSp-quote">
          <span className="xhsSp-qmark">{copy.text007}</span>{copy.text008}</footer>
      )}

      {showDecorations && (
        <React.Fragment>
          <SpSpark size={28} color="#FFC700" style={{ position: 'absolute', right: 96, top: 120 }} />
          <SpSpark size={18} color="#15A7F0" style={{ position: 'absolute', left: 84, top: 130 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 150, bottom: 150, width: 44, height: 44, borderRadius: '50%', border: '5px solid rgba(255,255,255,.8)', boxShadow: '0 0 20px rgba(255,255,255,.2)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSP_CSS = `
  .xhsSp-root{ padding:84px 110px 64px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsSp-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; gap:80px; }
  .xhsSp-root.is-noimg .xhsSp-stage{ justify-content:center; }

  .xhsSp-text{ width:720px; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsSp-root.is-noimg .xhsSp-text{ width:auto; max-width:1100px; align-items:flex-start; }
  .xhsSp-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:16px; }
  .xhsSp-name{ margin:0; font-size:108px; font-weight:900; color:#fff; line-height:.96; letter-spacing:-.01em;
    text-shadow:0 0 50px color-mix(in srgb, var(--c) 26%, transparent); }
  .xhsSp-tagline{ margin-top:20px; font-size:44px; font-weight:900; color:#fff; line-height:1.2; }
  .xhsSp-body{ margin:28px 0 0; font-size:25px; line-height:1.72; font-weight:500; color:#aeaeae; max-width:680px; }
  .xhsSp-root.is-noimg .xhsSp-body{ max-width:920px; font-size:28px; }

  .xhsSp-stats{ display:flex; gap:18px; margin-top:40px; }
  .xhsSp-root.is-noimg .xhsSp-stats{ max-width:820px; }
  .xhsSp-stat{ flex:1; padding:22px 26px; border-radius:18px; background:linear-gradient(160deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.07); display:flex; flex-direction:column; gap:8px; }
  .xhsSp-stat-val{ font-family:"Space Mono",monospace; font-size:48px; font-weight:700; line-height:1; color:var(--c);
    text-shadow:0 0 24px color-mix(in srgb, var(--c) 38%, transparent); }
  .xhsSp-stat-val i{ font-style:normal; font-size:24px; font-weight:700; margin-left:3px; }
  .xhsSp-stat-label{ font-size:20px; font-weight:600; color:#9a9a9a; }

  .xhsSp-figure{ position:relative; flex:1 1 auto; min-width:0; display:flex; align-items:center; justify-content:center; }
  .xhsSp-slot{ width:100%; max-width:780px; max-height:760px; min-width:0; border-radius:20px; overflow:hidden;
    background:#101010; border:1.5px solid rgba(255,255,255,.08); box-shadow:0 24px 60px rgba(0,0,0,.55); margin:0 auto; }
  .xhsSp-slot image-slot{ width:100%; height:100%; display:block; }
  .xhsSp-tag{ position:absolute; top:18px; left:18px; z-index:2; font-family:"Space Mono",monospace;
    font-size:20px; font-weight:700; letter-spacing:.12em; color:#031018; padding:6px 18px; border-radius:10px; background:var(--c);
    box-shadow:0 8px 22px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }

  .xhsSp-quote{ flex:0 0 auto; margin-top:36px; padding-top:30px; border-top:1.5px solid rgba(255,255,255,.1);
    display:flex; align-items:baseline; gap:16px; font-size:30px; font-weight:700; color:#dcdcdc; line-height:1.45; }
  .xhsSp-qmark{ font-family:"Space Mono",monospace; font-size:72px; font-weight:700; color:var(--c); line-height:.6;
    text-shadow:0 0 22px color-mix(in srgb, var(--c) 40%, transparent); }
`;

const META = {
  id: 'spotlight',
  label: '焦点特写',
  Component: Slide25Spotlight,
  defaults: {
      copy: SLIDE25SPOTLIGHT_COPY,
      statsData: XHSSP_STATS,
    ...hlDefaults,
    mediaCount: 1,
    imageSide: 'left',
    accentTone: 'green',
    statCount: 3,
    showQuote: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "placeholder001", label: "placeholder001" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }], default: SLIDE25SPOTLIGHT_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'statsData', type: 'list', label: 'statsData', itemLabel: '数据', fields: [{ key: "value", label: "value" }, { key: "unit", label: "unit" }, { key: "label", label: "label" }], default: XHSSP_STATS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 1, step: 1, default: 1, desc: '自适应单张大图(0=纯文案居中)' },
    { key: 'imageSide', type: 'radio', label: '配图位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'left', showIf: (v) => v.mediaCount > 0, desc: '配图在左 / 右(有图时生效)' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '页面主色调(通用命名)' },
    { key: 'statCount', type: 'slider', label: '数据卡数量', min: 0, max: 3, step: 1, default: 3, desc: '浮层数据卡数量' },
    { key: 'showQuote', type: 'toggle', label: '底部金句', default: true, desc: '底部金句显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide25Spotlight.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide25Spotlight;
