/*
 * Slide40Editorial — 杂志式图文跨页（图片页 · 自适应大图 + 杂志排版 + 抽言 + 数据栏）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsEd- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与已有图片页（焦点特写 / 图片故事 / 画廊）互补：杂志跨页排版语言——刊头条、
 * 首字下沉、栏间分隔线、抽言（pull quote）、底部数据栏；单张自适应大图占半幅。
 *
 * 图片槽（image-slot）：
 *  - 单张自适应：读取上传图片真实宽高比并反写容器 aspect-ratio（夹 0.62–1.9）；
 *  - mediaCount=0 时转为「无图·满栏文字跨页」，正文双栏排布，仍保持平衡美观。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片槽数量(0/1)       默认 1   可选 0–1
 *  imageSide       enum   配图位置            默认 'right' 可选 'left'|'right'
 *  accentTone      enum   主色调(通用命名)      默认 'blue' 可选 green/yellow/blue/pink
 *  statCount       number 底部数据栏条目数       默认 3   可选 0–3
 *  showPullQuote   bool   抽言显隐             默认 true
 *  showLede        bool   首段导语强调显隐        默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide40Editorial, { defaults, controls } from './Slide40Editorial.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSED_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
const XHSED_STATS = [
  { value: '190', unit: '亿', label: '最新估值 / 美元' },
  { value: '11', unit: '亿', label: '2024 单笔融资 / 美元' },
  { value: '2017', unit: '', label: '公司成立年份' },
];

function EdSpark({ size = 20, color = '#fff', style }) {
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
function EdMediaSlot({ slotId, placeholder }) {
  const ref = React.useRef(null);
  const [aspect, setAspect] = React.useState('3 / 4');
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
    <div className="xhsEd-slot" style={{ aspectRatio: filled ? aspect : '3 / 4' }}>
      <image-slot ref={ref} id={slotId} fit="cover" shape="rect"
        placeholder={placeholder || '拖入图片'}></image-slot>
    </div>
  );
}


const SLIDE40EDITORIAL_COPY = {
  text001: "案例 · CASE FILE 03",
  text002: "AI 基础设施",
  text003: "CoreWeave",
  text004: "踩中算力风口的基建黑马",
  text005: "所有人都在抢 GPU，把卡变成「云」的人先吃到红利。CoreWeave 从加密矿场转型为 AI 算力云，靠规模化 GPU 集群与长约绑定，成为大模型公司绕不开的算力供应商。",
  text006: "它的估值半年内翻数倍——不是因为模型多强，而是因为站在了所有模型的「下游」。 基础设施的确定性，让资本愿意为它的现金流与扩张速度付高溢价。",
  text007: "“",
  text008: "卖铲子的人，往往比挖金子的人更早赚到钱。",
  placeholder001: "算力机房 / GPU 卡墙 / 团队实拍",
  text009: "P. 03",
};
function Slide40Editorial(props) {
  const {
      copy = SLIDE40EDITORIAL_COPY,
      statsData = XHSED_STATS,
    mediaCount = 1,
    imageSide = 'right',
    accentTone = 'blue',
    statCount = 3,
    showPullQuote = true,
    showLede = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(1, mediaCount));
  const accent = XHSED_TONES[accentTone] || XHSED_TONES.blue;
  const scount = Math.max(0, Math.min(3, statCount));
  const stats = statsData.slice(0, scount);
  const hasImg = media > 0;

  const text = (
    <div className="xhsEd-text">
      <div className="xhsEd-masthead">
        <span className="xhsEd-mast-dot" />
        <span>{copy.text001}</span>
        <span className="xhsEd-mast-rule" />
        <span>{copy.text002}</span>
      </div>
      <h2 className="xhsEd-headline">{copy.text003}<br /><HL color={accent} variant={hlStyle} tilt={hlTilt} style={{ marginTop: 12 }}>{copy.text004}</HL>
      </h2>
      <div className="xhsEd-body">
        <p className={showLede ? 'is-lede' : ''}>{copy.text005}</p>
        <p>{copy.text006}</p>
      </div>

      {showPullQuote && (
        <blockquote className="xhsEd-pull">
          <span className="xhsEd-pull-mark" aria-hidden="true">{copy.text007}</span>{copy.text008}</blockquote>
      )}

      {scount > 0 && (
        <div className="xhsEd-stats">
          {stats.map((s, i) => (
            <div key={i} className="xhsEd-stat">
              <span className="xhsEd-stat-val">{s.value}<i>{s.unit}</i></span>
              <span className="xhsEd-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const figure = hasImg ? (
    <div className="xhsEd-figure">
      <EdMediaSlot slotId="xhsEd-media-0" placeholder={copy.placeholder001} />
      {showDecorations && <span className="xhsEd-foliotag" aria-hidden="true">{copy.text009}</span>}
    </div>
  ) : null;

  return (
    <section className={'xhs-base xhsEd-root' + (hasImg ? '' : ' is-noimg') + (imageSide === 'left' ? ' is-left' : '')}
      data-label="杂志式跨页" data-screen-label="杂志式跨页" style={{ '--c': accent }}>
      <style>{XHSED_CSS}</style>

      <div className="xhsEd-stage">
        {hasImg && imageSide === 'left' && figure}
        {text}
        {hasImg && imageSide === 'right' && figure}
      </div>

      {showDecorations && (
        <React.Fragment>
          <EdSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 90 }} />
          <EdSpark size={16} color="#27E021" style={{ position: 'absolute', left: 88, bottom: 84 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSED_CSS = `
  .xhsEd-root{ padding:84px 110px 72px; position:relative; box-sizing:border-box; height:100%; display:flex; }
  .xhsEd-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; gap:84px; }
  .xhsEd-root.is-noimg .xhsEd-stage{ justify-content:center; }

  .xhsEd-text{ width:760px; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsEd-root.is-noimg .xhsEd-text{ width:auto; max-width:1300px; }

  .xhsEd-masthead{ display:flex; align-items:center; gap:14px; font-family:"Space Mono",monospace; font-size:20px;
    letter-spacing:.1em; color:#8a8a8a; padding-bottom:20px; margin-bottom:30px; border-bottom:2px solid rgba(255,255,255,.14); }
  .xhsEd-mast-dot{ width:13px; height:13px; border-radius:50%; background:var(--c); box-shadow:0 0 14px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsEd-mast-rule{ flex:1; height:2px; background:repeating-linear-gradient(90deg, rgba(255,255,255,.2) 0 8px, transparent 8px 16px); }

  .xhsEd-headline{ margin:0; font-size:66px; font-weight:900; color:#fff; line-height:1.04; letter-spacing:-.01em; }

  .xhsEd-body{ margin-top:32px; column-gap:46px; }
  .xhsEd-root.is-noimg .xhsEd-body{ columns:2; column-gap:60px; }
  .xhsEd-body p{ margin:0 0 16px; font-size:24px; line-height:1.7; font-weight:500; color:#b0b0b0; text-wrap:pretty; }
  .xhsEd-body p.is-lede{ font-size:27px; line-height:1.6; font-weight:600; color:#e6e6e6; }
  .xhsEd-body p.is-lede::before{ content:''; display:block; width:46px; height:4px; border-radius:2px; margin-bottom:14px;
    background:var(--c); box-shadow:0 0 16px color-mix(in srgb, var(--c) 60%, transparent); }

  .xhsEd-pull{ margin:30px 0 0; padding:18px 0;
    font-size:33px; font-weight:800; color:#fff; line-height:1.3; position:relative; }
  .xhsEd-pull-mark{ font-family:"Space Mono",monospace; font-size:48px; color:var(--c); margin-right:6px; line-height:0; vertical-align:-6px; }

  .xhsEd-stats{ display:flex; gap:16px; margin-top:36px; }
  .xhsEd-stat{ flex:1; padding:20px 24px; border-radius:18px; background:linear-gradient(160deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.07); display:flex; flex-direction:column; gap:7px; }
  .xhsEd-stat-val{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; line-height:1; color:var(--c);
    text-shadow:0 0 24px color-mix(in srgb, var(--c) 38%, transparent); }
  .xhsEd-stat-val i{ font-style:normal; font-size:23px; font-weight:700; margin-left:3px; }
  .xhsEd-stat-label{ font-size:19px; font-weight:600; color:#9a9a9a; }

  .xhsEd-figure{ position:relative; flex:1 1 auto; min-width:0; display:flex; align-items:center; justify-content:center; }
  .xhsEd-slot{ width:100%; max-width:680px; max-height:840px; min-width:0; border-radius:18px; overflow:hidden;
    background:#101010; border:1.5px solid rgba(255,255,255,.08); box-shadow:0 26px 64px rgba(0,0,0,.55); margin:0 auto; }
  .xhsEd-slot image-slot{ width:100%; height:100%; display:block; }
  .xhsEd-foliotag{ position:absolute; bottom:18px; right:18px; z-index:2; font-family:"Space Mono",monospace;
    font-size:18px; font-weight:700; letter-spacing:.12em; color:#031018; padding:5px 14px; border-radius:9px; background:var(--c);
    box-shadow:0 8px 22px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
`;

const META = {
  id: 'editorial',
  label: '杂志式跨页',
  Component: Slide40Editorial,
  defaults: {
      copy: SLIDE40EDITORIAL_COPY,
      statsData: XHSED_STATS,
    ...hlDefaults,
    mediaCount: 1,
    imageSide: 'right',
    accentTone: 'blue',
    statCount: 3,
    showPullQuote: true,
    showLede: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "placeholder001", label: "placeholder001" }, { key: "text009", label: "text009" }], default: SLIDE40EDITORIAL_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'statsData', type: 'list', label: 'statsData', itemLabel: '数据', fields: [{ key: "value", label: "value" }, { key: "unit", label: "unit" }, { key: "label", label: "label" }], default: XHSED_STATS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 1, step: 1, default: 1, desc: '自适应单张大图(0=满栏文字跨页)' },
    { key: 'imageSide', type: 'radio', label: '配图位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'right', showIf: (v) => v.mediaCount > 0, desc: '配图在左 / 右(有图时生效)' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调(通用命名)' },
    { key: 'statCount', type: 'slider', label: '数据栏条目', min: 0, max: 3, step: 1, default: 3, desc: '底部数据栏条目数' },
    { key: 'showPullQuote', type: 'toggle', label: '抽言', default: true, desc: '抽言(pull quote)显隐' },
    { key: 'showLede', type: 'toggle', label: '首段导语', default: true, desc: '首段导语强调(加粗 + 色条)' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide40Editorial.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide40Editorial;
