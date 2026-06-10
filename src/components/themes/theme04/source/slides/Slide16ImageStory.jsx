/*
 * Slide16ImageStory — 图片故事页（杂志式图文混排 + 自适应图片槽 0–3）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsImg- 。
 *
 * 图片槽（image-slot）：
 *  - 数量 0–3（mediaCount），按用户上传图片真实宽高比自适应（夹 0.62–1.9）；
 *  - 由 mediaLayout 在「特写网格 / 等列堆叠」间切换，保证各数量与比例下构图美观；
 *  - mediaCount=0 时画面自动转为无图的大图文排版，仍保持平衡。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片槽数量          默认 3   可选 0–3
 *  mediaLayout     enum   多图构图           默认 'feature' 可选 'feature'|'stack'
 *  statCount       number 数据标签数量         默认 3   可选 0–3
 *  focusEnabled    bool   图片重点高亮开关      默认 false
 *  focusIndex      number 重点图序号(从1起)    默认 1
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 所有可见文案 / 数据 / 图片槽占位均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide16ImageStory, { defaults, controls } from './Slide16ImageStory.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSIMG_ACCENT = '#15A7F0';
const XHSIMG_STATS = [
  { value: '110', unit: '亿', label: '2024 融资额', color: '#15A7F0' },
  { value: '190', unit: '亿', label: '估值 / 美元', color: '#FFC700' },
  { value: '数万', unit: '张', label: 'H100/H200 储备', color: '#27E021' },
];
const XHSIMG_SLOTS = ['公司 / 机房实景', '创始团队 / Logo', 'GPU 算力示意'];

function ImgSpark({ size = 20, color = '#fff', style }) {
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

// 自适应图片槽：读取已上传图片真实比例，反写容器 aspect-ratio（夹在 0.62–1.9）
function ImgMediaSlot({ slotId, placeholder, className, fixedAspect }) {
  const ref = React.useRef(null);
  const [aspect, setAspect] = React.useState(fixedAspect || '4 / 3');
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
  // filled 时跟随图片真实比例；未填充时用稳定占位比例，保证空槽构图不塌
  const style = filled ? { aspectRatio: aspect } : (fixedAspect ? { aspectRatio: fixedAspect } : { aspectRatio: '4 / 3' });
  return (
    <div className={'xhsImg-slot ' + (className || '')} style={style}>
      <image-slot ref={ref} id={slotId} fit="contain" shape="rounded" radius="18"
        placeholder={placeholder || '拖入图片'}></image-slot>
    </div>
  );
}

function Slide16ImageStory(props) {
  const {
    mediaCount = 3,
    mediaLayout = 'feature',
    statCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '典型案例 · 卖铲子的人',
    name = 'CoreWeave',
    taglineLead = '淘金热里',
    taglineKeyword = '卖铲子',
    taglineTail = '，也赚翻了',
    body = '从加密货币挖矿转型 AI 算力云，与 NVIDIA 锁定长期供应，手握数万张 H100/H200，成为 OpenAI、Stability AI 等公司的核心算力供应商——当所有模型公司都在抢 GPU，提前锁定算力的人反而成了稀缺标的。',
    // 数据 / 图片槽
    stats = XHSIMG_STATS,
    slotLabels = XHSIMG_SLOTS,
  } = props;

  const statSrc = Array.isArray(stats) ? stats : XHSIMG_STATS;
  const slotSrc = Array.isArray(slotLabels) ? slotLabels : XHSIMG_SLOTS;
  const media = Math.max(0, Math.min(3, mediaCount));
  const scount = Math.max(0, Math.min(statSrc.length, statCount));
  const shownStats = statSrc.slice(0, scount);
  const focus = Math.max(1, Math.min(Math.max(1, media), focusIndex)) - 1;

  // 构图类：feature=特写网格（首图大），stack=等列堆叠
  const galleryMode = media >= 2 ? mediaLayout : 'single';
  const slotEls = Array.from({ length: media }).map((_, i) => {
    const hot = focusEnabled && i === focus;
    const dim = focusEnabled && i !== focus;
    return (
      <ImgMediaSlot
        key={i}
        slotId={`xhsImg-media-${i}`}
        placeholder={slotSrc[i]}
        className={(i === 0 ? 'is-feature ' : '') + (hot ? 'is-hot ' : '') + (dim ? 'is-dim' : '')}
      />
    );
  });

  return (
    <section className={'xhs-base xhsImg-root' + (media === 0 ? ' is-noimg' : '')} data-label="图片故事"
      style={{ '--c': XHSIMG_ACCENT }}>
      <style>{XHSIMG_CSS}</style>

      <div className="xhsImg-left">
        <div className="xhsImg-kicker">{kicker}</div>
        <h2 className="xhsImg-name">{name}</h2>
        <div className="xhsImg-tagline">
          {taglineLead}<HL color={XHSIMG_ACCENT} variant={hlStyle} tilt={hlTilt}>{taglineKeyword}</HL>{taglineTail}
        </div>
        <p className="xhsImg-body">{body}</p>

        {scount > 0 && (
          <div className="xhsImg-stats">
            {shownStats.map((s, i) => (
              <div key={i} className="xhsImg-stat" style={{ '--sc': s.color }}>
                <span className="xhsImg-stat-val">{s.value}<i>{s.unit}</i></span>
                <span className="xhsImg-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {media > 0 && (
        <div className={'xhsImg-gallery is-' + galleryMode} style={{ '--m': media }}>
          {galleryMode === 'feature' && media === 3 ? (
            <React.Fragment>
              <div className="xhsImg-feature-col">{slotEls[0]}</div>
              <div className="xhsImg-side-col">{slotEls[1]}{slotEls[2]}</div>
            </React.Fragment>
          ) : (
            slotEls
          )}
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <ImgSpark size={26} color="#FFC700" style={{ position: 'absolute', left: 96, top: 116 }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: 150, bottom: 88, width: 44, height: 44, borderRadius: '50%', border: '5px solid rgba(255,255,255,.85)', boxShadow: '0 0 22px rgba(255,255,255,.2)' }} />
          <ImgSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 110, bottom: 96 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSIMG_CSS = `
  .xhsImg-root{ padding:90px 110px; position:relative; display:flex; gap:70px; align-items:center; }
  .xhsImg-root.is-noimg{ justify-content:center; }

  .xhsImg-left{ width:660px; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsImg-root.is-noimg .xhsImg-left{ width:auto; max-width:1100px; align-items:flex-start; }
  .xhsImg-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:16px; }
  .xhsImg-name{ margin:0; font-size:104px; font-weight:900; color:#fff; line-height:.98; letter-spacing:-.01em;
    text-shadow:0 0 50px color-mix(in srgb, var(--c) 26%, transparent); }
  .xhsImg-tagline{ margin-top:20px; font-size:42px; font-weight:900; color:#fff; }
  .xhsImg-body{ margin:30px 0 0; font-size:25px; line-height:1.72; font-weight:500; color:#aeaeae; max-width:640px; }
  .xhsImg-root.is-noimg .xhsImg-body{ max-width:900px; font-size:28px; }

  .xhsImg-stats{ display:flex; gap:18px; margin-top:auto; padding-top:38px; }
  .xhsImg-stat{ flex:1; padding:22px 24px; border-radius:18px; background:linear-gradient(160deg,#161616,#0e0e0e);
    border:1.5px solid rgba(255,255,255,.07); display:flex; flex-direction:column; gap:8px; }
  .xhsImg-stat-val{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; line-height:1; color:var(--sc);
    text-shadow:0 0 24px color-mix(in srgb, var(--sc) 38%, transparent); }
  .xhsImg-stat-val i{ font-style:normal; font-size:24px; font-weight:700; margin-left:3px; }
  .xhsImg-stat-label{ font-size:20px; font-weight:600; color:#9a9a9a; }
  .xhsImg-root.is-noimg .xhsImg-stats{ max-width:760px; }

  /* ── 图片画廊：随数量 / 构图自适应 ───────────────────────────── */
  .xhsImg-gallery{ flex:1; min-width:0; display:flex; gap:20px; align-items:center; justify-content:center; }
  .xhsImg-gallery.is-single{ }
  .xhsImg-gallery.is-stack{ flex-direction:column; }
  .xhsImg-gallery.is-feature{ flex-direction:row; }
  .xhsImg-feature-col{ flex:1.5; min-width:0; display:flex; }
  .xhsImg-side-col{ flex:1; min-width:0; display:flex; flex-direction:column; gap:20px; }

  .xhsImg-slot{ width:100%; min-width:0; border-radius:18px; overflow:hidden;
    background:#101010; border:1.5px solid rgba(255,255,255,.08);
    box-shadow:0 20px 50px rgba(0,0,0,.5);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsImg-slot image-slot{ width:100%; height:100%; display:block; }
  .xhsImg-slot.is-hot{ border-color:var(--c); box-shadow:0 0 60px color-mix(in srgb, var(--c) 34%, transparent); }
  .xhsImg-slot.is-dim{ opacity:.5; filter:saturate(.7); }

  /* 单图：限制最大高度，居中大图 */
  .xhsImg-gallery.is-single .xhsImg-slot{ max-height:760px; max-width:100%; margin:0 auto; }
  /* 等列堆叠：每张限高，纵向排列 */
  .xhsImg-gallery.is-stack .xhsImg-slot{ max-height:calc((100% - 20px * (var(--m) - 1)) / var(--m)); }
  /* 特写网格(=2)：并排两张 */
  .xhsImg-gallery.is-feature .xhsImg-slot{ max-height:720px; }
  .xhsImg-side-col .xhsImg-slot{ flex:1; max-height:none; }
`;

const META = {
  id: 'imagestory',
  label: '图片故事',
  Component: Slide16ImageStory,
  defaults: {
    ...hlDefaults,
    mediaCount: 3,
    mediaLayout: 'feature',
    statCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showDecorations: true,
    kicker: '典型案例 · 卖铲子的人',
    name: 'CoreWeave',
    taglineLead: '淘金热里',
    taglineKeyword: '卖铲子',
    taglineTail: '，也赚翻了',
    body: '从加密货币挖矿转型 AI 算力云，与 NVIDIA 锁定长期供应，手握数万张 H100/H200，成为 OpenAI、Stability AI 等公司的核心算力供应商——当所有模型公司都在抢 GPU，提前锁定算力的人反而成了稀缺标的。',
    stats: XHSIMG_STATS,
    slotLabels: XHSIMG_SLOTS,
  },
  controls: [
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 3, step: 1, default: 3, desc: '自适应图片槽数量(按上传图片比例)' },
    { key: 'mediaLayout', type: 'radio', label: '多图构图', options: ['feature', 'stack'], optionLabels: ['特写网格', '等列堆叠'], default: 'feature', showIf: (v) => v.mediaCount > 1, desc: '多张图片的排布构图' },
    { key: 'statCount', type: 'slider', label: '数据标签', min: 0, max: 3, step: 1, default: 3, desc: '左侧数据标签数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, showIf: (v) => v.mediaCount > 1, desc: '是否高亮某一张图片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'mediaCount', showIf: (v) => v.mediaCount > 1 && v.focusEnabled, desc: '被高亮图片的序号' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '典型案例 · 卖铲子的人', desc: '顶部 kicker' },
    { key: 'name', type: 'text', label: '主标题', default: 'CoreWeave', desc: '巨型公司名 / 主标题' },
    { key: 'taglineLead', type: 'text', label: '口号前半', default: '淘金热里', desc: '口号关键词前文' },
    { key: 'taglineKeyword', type: 'text', label: '口号关键词', default: '卖铲子', desc: '高亮关键词' },
    { key: 'taglineTail', type: 'text', label: '口号后半', default: '，也赚翻了', desc: '关键词后文' },
    { key: 'body', type: 'textarea', label: '正文', rows: 4, default: '从加密货币挖矿转型 AI 算力云，与 NVIDIA 锁定长期供应，手握数万张 H100/H200，成为 OpenAI、Stability AI 等公司的核心算力供应商——当所有模型公司都在抢 GPU，提前锁定算力的人反而成了稀缺标的。', desc: '正文段落' },
    { type: 'section', label: '数据 · 标签与图片槽' },
    {
      key: 'stats', type: 'list', label: '数据标签', itemLabel: '标签', countFromKey: 'statCount',
      fields: [{ key: 'value', label: '数值' }, { key: 'unit', label: '单位' }, { key: 'label', label: '说明' }, { key: 'color', label: '颜色' }],
      default: XHSIMG_STATS, desc: '左侧数据标签：数值 / 单位 / 说明 / 主色',
    },
    {
      key: 'slotLabels', type: 'list', label: '图片槽提示', itemLabel: '槽', countFromKey: 'mediaCount', primitive: true,
      default: XHSIMG_SLOTS, desc: '各图片槽占位提示文案',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide16ImageStory.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide16ImageStory;
