/*
 * Slide20QuoteImage — 图文金句页（大号引言 + 自适应配图）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsQi- 。
 *
 * 图片槽（image-slot）：
 *  - 数量 0–1（mediaCount），按上传图片真实宽高比自适应（夹 0.62–1.7）；
 *  - imageSide 决定配图在左 / 右；mediaCount=0 时引言居中铺满，降级为纯金句页仍美观。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 配图数量            默认 1   可选 0–1
 *  imageSide       enum   配图位置           默认 'right' 可选 'left'|'right'
 *  highlightStyle  enum   关键词强调          默认 'box'   可选 'box'|'underline'
 *  showAttribution bool   署名显隐            默认 true
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 所有可见文案均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide20QuoteImage, { defaults, controls } from './Slide20QuoteImage.jsx'
 */
import React from 'react';

const XHSQI_ACCENT = '#15A7F0';

function QiSpark({ size = 22, color = '#fff', style }) {
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

// 自适应图片槽：读取真实比例反写容器 aspect-ratio（夹 0.62–1.7）
function QiMediaSlot({ placeholder }) {
  const ref = React.useRef(null);
  const [aspect, setAspect] = React.useState('4 / 5');
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let stop = false;
    const read = () => {
      try {
        const img = host.shadowRoot && host.shadowRoot.querySelector('.frame img');
        if (host.hasAttribute('data-filled') && img && img.naturalWidth && img.naturalHeight) {
          let r = img.naturalWidth / img.naturalHeight;
          r = Math.max(0.62, Math.min(1.7, r));
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
    <div className="xhsQi-frame" style={{ aspectRatio: aspect }}>
      <image-slot ref={ref} id="xhsQi-media" fit="cover" shape="rounded" radius="22" placeholder={placeholder || '拖入配图'}></image-slot>
    </div>
  );
}


const SLIDE20QUOTEIMAGE_COPY = {
  text001: "“",
};
function Slide20QuoteImage(props) {
  const {
      copy = SLIDE20QUOTEIMAGE_COPY,
    mediaCount = 1,
    imageSide = 'right',
    highlightStyle = 'box',
    showAttribution = true,
    showDecorations = true,
    // 文案
    quoteLead = 'AI 融资盛宴仍在继续，但',
    quoteKeyword = '音乐节奏正在变化',
    quoteTail = '。',
    sub = '资本的下一阶段，将从「赌叙事」转向「看兑现」——能把技术变成可持续收入的公司，才能在退潮后留在牌桌上。',
    attribution = '—— 2024 美国大额融资 AI 调研 · 结论',
    mediaPlaceholder = '拖入配图',
  } = props;

  const hasImg = mediaCount >= 1;

  return (
    <section className={'xhs-base xhsQi-root' + (hasImg ? ' has-img is-' + imageSide : ' no-img')}
      data-label="图文金句" style={{ '--c': XHSQI_ACCENT }}>
      <style>{XHSQI_CSS}</style>

      {hasImg && (
        <div className="xhsQi-media">
          <QiMediaSlot placeholder={mediaPlaceholder} />
        </div>
      )}

      <div className="xhsQi-quote">
        <span className="xhsQi-mark" aria-hidden="true">{copy.text001}</span>
        <blockquote className="xhsQi-text">
          {quoteLead}
          <span className={'xhsQi-hl xhsQi-hl--' + highlightStyle}>{quoteKeyword}</span>{quoteTail}
        </blockquote>
        <p className="xhsQi-sub">{sub}</p>
        {showAttribution && <cite className="xhsQi-cite">{attribution}</cite>}
      </div>

      {showDecorations && (
        <React.Fragment>
          <QiSpark size={24} color="#FFC700" style={{ position: 'absolute', left: 96, bottom: 84 }} />
          <QiSpark size={16} color="#FF9FE2" style={{ position: 'absolute', right: 110, top: 120 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSQI_CSS = `
  .xhsQi-root{ padding:96px 110px; position:relative; display:flex; gap:84px; align-items:center; }
  .xhsQi-root.is-left{ flex-direction:row; }
  .xhsQi-root.is-right{ flex-direction:row-reverse; }
  .xhsQi-root.no-img{ justify-content:center; text-align:center; }

  .xhsQi-media{ width:620px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .xhsQi-frame{ width:100%; max-height:880px; border-radius:22px; overflow:hidden;
    border:1.5px solid rgba(255,255,255,.08); background:#101010; box-shadow:0 24px 60px rgba(0,0,0,.55); }
  .xhsQi-frame image-slot{ width:100%; height:100%; display:block; }

  .xhsQi-quote{ flex:1; min-width:0; position:relative; }
  .xhsQi-root.no-img .xhsQi-quote{ max-width:1320px; }
  .xhsQi-mark{ position:absolute; left:-10px; top:-86px; font-family:"Space Mono",monospace; font-size:200px;
    font-weight:700; line-height:1; color:var(--c); opacity:.9;
    text-shadow:0 0 40px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsQi-root.no-img .xhsQi-mark{ left:50%; transform:translateX(-50%); }
  .xhsQi-text{ margin:0; font-size:76px; font-weight:900; line-height:1.22; color:#fff; letter-spacing:.005em; }
  .xhsQi-root.no-img .xhsQi-text{ font-size:96px; }
  .xhsQi-hl{ display:inline-block; }
  .xhsQi-hl--box{ background:var(--c); color:#000; padding:0 18px; border-radius:14px;
    box-shadow:0 10px 26px color-mix(in srgb, var(--c) 34%, transparent), inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }
  .xhsQi-hl--underline{ color:var(--c); padding-bottom:6px;
    background:linear-gradient(var(--c),var(--c)) bottom/100% 12px no-repeat; border-radius:2px; }
  .xhsQi-sub{ margin:40px 0 0; font-size:28px; line-height:1.66; font-weight:500; color:#a8a8a8; max-width:880px; }
  .xhsQi-root.no-img .xhsQi-sub{ margin-left:auto; margin-right:auto; }
  .xhsQi-cite{ display:block; margin-top:32px; font-size:24px; font-style:normal; font-weight:700; color:#7e7e7e;
    font-family:"Space Mono",monospace; }
`;

const META = {
  id: 'quoteimage',
  label: '图文金句',
  Component: Slide20QuoteImage,
  defaults: {
      copy: SLIDE20QUOTEIMAGE_COPY,
    mediaCount: 1,
    imageSide: 'right',
    highlightStyle: 'box',
    showAttribution: true,
    showDecorations: true,
    quoteLead: 'AI 融资盛宴仍在继续，但',
    quoteKeyword: '音乐节奏正在变化',
    quoteTail: '。',
    sub: '资本的下一阶段，将从「赌叙事」转向「看兑现」——能把技术变成可持续收入的公司，才能在退潮后留在牌桌上。',
    attribution: '—— 2024 美国大额融资 AI 调研 · 结论',
    mediaPlaceholder: '拖入配图',
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }], default: SLIDE20QUOTEIMAGE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'mediaCount', type: 'slider', label: '配图数量', min: 0, max: 1, step: 1, default: 1, desc: '自适应配图(0=纯金句)' },
    { key: 'imageSide', type: 'radio', label: '配图位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'right', showIf: (v) => v.mediaCount > 0, desc: '配图在左 / 右' },
    { key: 'highlightStyle', type: 'radio', label: '强调样式', options: ['box', 'underline'], optionLabels: ['色块', '下划线'], default: 'box', desc: '关键词强调方式' },
    { key: 'showAttribution', type: 'toggle', label: '署名显示', default: true, desc: '底部署名' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'quoteLead', type: 'text', label: '引言前半', default: 'AI 融资盛宴仍在继续，但', desc: '关键词前文' },
    { key: 'quoteKeyword', type: 'text', label: '引言关键词', default: '音乐节奏正在变化', desc: '强调关键词' },
    { key: 'quoteTail', type: 'text', label: '引言后半', default: '。', desc: '关键词后文' },
    { key: 'sub', type: 'textarea', label: '支撑副句', rows: 3, default: '资本的下一阶段，将从「赌叙事」转向「看兑现」——能把技术变成可持续收入的公司，才能在退潮后留在牌桌上。', desc: '引言下方说明' },
    { key: 'attribution', type: 'text', label: '署名', default: '—— 2024 美国大额融资 AI 调研 · 结论', desc: '底部署名', showIf: (v) => v.showAttribution },
    { key: 'mediaPlaceholder', type: 'text', label: '图片槽提示', default: '拖入配图', desc: '配图槽占位文案', showIf: (v) => v.mediaCount > 0 },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide20QuoteImage.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide20QuoteImage;
