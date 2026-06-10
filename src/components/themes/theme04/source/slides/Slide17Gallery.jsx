/*
 * Slide17Gallery — 画廊网格图片页（自适应图片槽 masonry / 网格 + 浮层标注）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsGl- 。
 *
 * 图片槽（image-slot）：
 *  - 数量 1–4（mediaCount），按上传图片真实宽高比自适应（夹 0.66–1.6）；
 *  - mediaLayout：'mosaic' 瀑布流（高度随比例自然错落）/ 'grid' 等比网格（16:10 cover）；
 *  - 空槽用稳定占位比例，保证未上传时构图依然整齐美观。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 图片槽数量          默认 4   可选 1–4
 *  mediaLayout     enum   排布构图           默认 'mosaic' 可选 'mosaic'|'grid'
 *  showCaptions    bool   浮层标注显隐         默认 true
 *  focusEnabled    bool   重点图高亮开关        默认 true
 *  focusIndex      number 重点图序号(从1起)    默认 1
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide17Gallery, { defaults, controls } from './Slide17Gallery.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSGL_PALETTE = ['#15A7F0', '#FFC700', '#27E021', '#FF9FE2'];
const XHSGL_ITEMS = [
  { city: '旧金山湾区', en: 'SF BAY AREA', pct: '63.9%', amt: '620 亿', rank: '01' },
  { city: '纽约', en: 'NEW YORK', pct: '12.4%', amt: '120 亿', rank: '02' },
  { city: '西雅图', en: 'SEATTLE', pct: '9.8%', amt: '95 亿', rank: '03' },
  { city: '波士顿', en: 'BOSTON', pct: '7.7%', amt: '75 亿', rank: '04' },
];

// 按数量 + 构图生成 grid 模板（高度受控，总是充满不溢出）
function xhsGlLayout(count, mosaic) {
  if (mosaic) {
    if (count <= 1) return { cols: '1fr', rows: '1fr', areas: ['a'] };
    if (count === 2) return { cols: '1.4fr 1fr', rows: '1fr', areas: ['a b'] };
    if (count === 3) return { cols: '1.45fr 1fr', rows: '1fr 1fr', areas: ['a b', 'a c'] };
    return { cols: '1fr 1fr', rows: '1fr 1fr', areas: ['a b', 'c d'] };
  }
  if (count <= 1) return { cols: '1fr', rows: '1fr', areas: ['a'] };
  if (count === 2) return { cols: '1fr 1fr', rows: '1fr', areas: ['a b'] };
  if (count === 3) return { cols: '1fr 1fr 1fr', rows: '1fr', areas: ['a b c'] };
  return { cols: '1fr 1fr', rows: '1fr 1fr', areas: ['a b', 'c d'] };
}
const XHSGL_AREA = ['a', 'b', 'c', 'd'];

function GlSpark({ size = 20, color = '#fff', style }) {
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

// 画廊图片槽：cover 填满单元格（高度由 grid 决定，保证不溢出）。
// 未上传时显示占位；上传后按真实图片 cover 填满，构图稳定美观。
function GlMediaSlot({ slotId, placeholder }) {
  return (
    <div className="xhsGl-frame">
      <image-slot id={slotId} fit="cover" shape="rect" placeholder={placeholder || '拖入图片'}></image-slot>
    </div>
  );
}

function Slide17Gallery(props) {
  const {
      areaData = XHSGL_AREA,
    mediaCount = 4,
    mediaLayout = 'mosaic',
    showCaptions = true,
    focusEnabled = true,
    focusIndex = 1,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '地区分布 · GEO HUBS',
    titleLead = '资本与算力，',
    titleKeyword = '高度集聚',
    sub = '旧金山湾区独占六成以上，人才、资本、算力的虹吸效应进一步强化「地理护城河」。',
    mediaPlaceholder = '拖入图片',
    // 数据
    items = XHSGL_ITEMS,
  } = props;

  const src = Array.isArray(items) && items.length ? items : XHSGL_ITEMS;
  const count = Math.max(1, Math.min(src.length, mediaCount));
  const shown = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const mosaic = mediaLayout === 'mosaic';
  const lay = xhsGlLayout(count, mosaic);

  return (
    <section className="xhs-base xhsGl-root" data-label="地区画廊">
      <style>{XHSGL_CSS}</style>

      <header className="xhsGl-head">
        <div className="xhsGl-kicker">{kicker}</div>
        <h2 className="xhsGl-title">{titleLead}<HL color="#15A7F0" variant={hlStyle} tilt={hlTilt}>{titleKeyword}</HL></h2>
        <p className="xhsGl-sub">{sub}</p>
      </header>

      <div className="xhsGl-grid"
        style={{ gridTemplateColumns: lay.cols, gridTemplateRows: lay.rows, gridTemplateAreas: lay.areas.map((r) => `"${r}"`).join(' ') }}>
        {shown.map((it, i) => {
          const color = XHSGL_PALETTE[i % XHSGL_PALETTE.length];
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <figure key={i} className={'xhsGl-card' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': color, gridArea: areaData[i] }}>
              <GlMediaSlot slotId={`xhsGl-media-${i}`} placeholder={mediaPlaceholder} />
              {showCaptions && (
                <figcaption className="xhsGl-cap">
                  <span className="xhsGl-rank">{it.rank}</span>
                  <span className="xhsGl-cap-main">
                    <span className="xhsGl-city">{it.city}</span>
                    <span className="xhsGl-en">{it.en} · {it.amt}</span>
                  </span>
                  <span className="xhsGl-pct">{it.pct}</span>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <GlSpark size={22} color="#FFC700" style={{ position: 'absolute', left: 88, bottom: 70 }} />
          <GlSpark size={16} color="#FF9FE2" style={{ position: 'absolute', right: 96, top: 132 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSGL_CSS = `
  .xhsGl-root{ padding:80px 110px 70px; position:relative; display:flex; gap:66px; align-items:stretch; }

  .xhsGl-head{ width:500px; flex-shrink:0; padding-top:30px; align-self:center; }
  .xhsGl-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:26px; }
  .xhsGl-title{ margin:0; font-size:62px; font-weight:900; color:#fff; line-height:1.12; }
  .xhsGl-sub{ margin:34px 0 0; font-size:25px; line-height:1.66; color:#9a9a9a; font-weight:500; }

  .xhsGl-grid{ flex:1; min-width:0; display:grid; gap:24px; }

  .xhsGl-card{ position:relative; border-radius:20px; overflow:hidden; min-width:0; min-height:0;
    border:1.5px solid rgba(255,255,255,.08); background:#101010;
    box-shadow:0 20px 50px rgba(0,0,0,.5);
    transition:opacity .3s ease, filter .3s ease; }
  .xhsGl-card.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsGl-card.is-hot{ border-color:var(--c); box-shadow:0 0 60px color-mix(in srgb, var(--c) 34%, transparent); }
  .xhsGl-frame{ width:100%; height:100%; overflow:hidden; }
  .xhsGl-frame image-slot{ width:100%; height:100%; display:block; }

  .xhsGl-cap{ position:absolute; left:0; right:0; bottom:0; display:flex; align-items:center; gap:16px;
    padding:54px 24px 20px; color:#fff;
    background:linear-gradient(180deg, transparent, rgba(0,0,0,.86) 72%); }
  .xhsGl-rank{ font-family:"Space Mono",monospace; font-size:30px; font-weight:700; color:var(--c);
    text-shadow:0 0 16px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsGl-cap-main{ display:flex; flex-direction:column; gap:2px; margin-right:auto; min-width:0; }
  .xhsGl-city{ font-size:30px; font-weight:900; }
  .xhsGl-en{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.08em; color:#b8b8b8; }
  .xhsGl-pct{ font-size:34px; font-weight:900; color:var(--c); white-space:nowrap;
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 45%, transparent); }
`;

const META = {
  id: 'gallery',
  label: '地区画廊',
  Component: Slide17Gallery,
  defaults: {
      areaData: XHSGL_AREA,
    ...hlDefaults,
    mediaCount: 4,
    mediaLayout: 'mosaic',
    showCaptions: true,
    focusEnabled: true,
    focusIndex: 1,
    showDecorations: true,
    kicker: '地区分布 · GEO HUBS',
    titleLead: '资本与算力，',
    titleKeyword: '高度集聚',
    sub: '旧金山湾区独占六成以上，人才、资本、算力的虹吸效应进一步强化「地理护城河」。',
    mediaPlaceholder: '拖入图片',
    items: XHSGL_ITEMS,
  },
  controls: [
    { key: 'areaData', type: 'list', label: 'areaData', itemLabel: '数据', primitive: true, default: XHSGL_AREA, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 1, max: 4, step: 1, default: 4, desc: '自适应图片槽数量(按上传图片比例)' },
    { key: 'mediaLayout', type: 'radio', label: '排布构图', options: ['mosaic', 'grid'], optionLabels: ['特写网格', '等比网格'], default: 'mosaic', desc: '特写网格(首图大) / 等比网格' },
    { key: 'showCaptions', type: 'toggle', label: '浮层标注', default: true, desc: '图片底部城市/占比标注' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一张图片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'mediaCount', showIf: (v) => v.focusEnabled, desc: '被高亮图片的序号' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '地区分布 · GEO HUBS', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '资本与算力，', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '高度集聚', desc: '高亮关键词' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 3, default: '旧金山湾区独占六成以上，人才、资本、算力的虹吸效应进一步强化「地理护城河」。', desc: '标题下方说明' },
    { key: 'mediaPlaceholder', type: 'text', label: '图片槽提示', default: '拖入图片', desc: '图片槽占位文案' },
    { type: 'section', label: '数据 · 地区' },
    {
      key: 'items', type: 'list', label: '地区', itemLabel: '地区', countFromKey: 'mediaCount',
      fields: [{ key: 'rank', label: '名次' }, { key: 'city', label: '城市' }, { key: 'en', label: '英文' }, { key: 'amt', label: '金额' }, { key: 'pct', label: '占比' }],
      default: XHSGL_ITEMS, desc: '每张图的浮层标注：名次 / 城市 / 英文 / 金额 / 占比',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide17Gallery.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide17Gallery;
