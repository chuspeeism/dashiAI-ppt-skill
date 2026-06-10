/*
 * Slide10Region — 地区分布（环形图 / 柱状图可切换）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsRg- 。设计与排行榜 / 产业链分层页保持一致：暗色霓虹卡片 +
 * 彩色左侧光条 + 数值徽章；环形图收纳进玻璃质感面板，避免裸露的浮动图例。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount        number 展示条目数量       默认 5   可选 3–5
 *  chartVariant     enum   图表类型          默认 'donut'  可选 'donut' | 'bar'
 *  focusEnabled     bool   重点突出开关        默认 true
 *  focusIndex       number 重点项序号(从1起)   默认 1   范围 1–itemCount
 *  showPercent      bool   百分比显示         默认 true
 *  showDecorations  bool   装饰元素显隐        默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide10Region, { defaults, controls } from './Slide10Region.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSRG_ITEMS = [
  { name: '旧金山湾区', value: 620, pct: 63.9, color: '#27E021' },
  { name: '纽约', value: 120, pct: 12.4, color: '#FFC700' },
  { name: '西雅图', value: 95, pct: 9.8, color: '#15A7F0' },
  { name: '波士顿', value: 75, pct: 7.7, color: '#FF9FE2' },
  { name: '其他地区', value: 60, pct: 6.2, color: '#9aa0a6' },
];

function RgSpark({ size = 20, color = '#fff', style }) {
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

// 把颜色向白色混合，得到较亮的端头色（用于环的渐变高光）
function rgLighten(hex, amt) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * amt);
  const to2 = (c) => c.toString(16).padStart(2, '0');
  return `#${to2(mix(r))}${to2(mix(g))}${to2(mix(b))}`;
}

// Apple Watch 活动圆环风格：多层同心、圆头端点、按占比填充、端头标注百分比
function RgRings({ items, focusEnabled, focus, percentSuffix = '%' }) {
  const uid = React.useId().replace(/:/g, '');
  const SZ = 480, cx = SZ / 2, cy = SZ / 2;
  const R0 = 192, T = 28, G = 10;         // 最外半径 / 环厚 / 环间距
  const maxPct = Math.max.apply(null, items.map((d) => d.pct));

  const rings = items.map((d, i) => {
    const r = R0 - i * (T + G);
    const frac = Math.max(0.05, Math.min(0.97, (d.pct / maxPct) * 0.94)); // 最大占比≈满环
    const C = 2 * Math.PI * r;
    const dash = frac * C;
    const endA = frac * 2 * Math.PI;       // 自顶端顺时针扫过的弧度
    const ex = cx + r * Math.sin(endA);
    const ey = cy - r * Math.cos(endA);
    return { ...d, i, r, C, dash, ex, ey, light: rgLighten(d.color, 0.6),
      hot: focusEnabled && i === focus };
  });

  return (
    <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`} className="xhsRg-svg">
      <defs>
        {rings.map((s) => (
          <linearGradient key={s.i} id={`rg${uid}-${s.i}`} x1="0" y1="0" x2="0" y2={SZ} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={s.light} />
            <stop offset="100%" stopColor={s.color} />
          </linearGradient>
        ))}
      </defs>

      {/* 各环底槽（同色低透明，营造活动环的“跑道”） */}
      {rings.map((s) => (
        <circle key={'t' + s.i} cx={cx} cy={cy} r={s.r} fill="none" stroke={s.color} strokeWidth={T} opacity="0.15" />
      ))}

      {/* 进度弧 */}
      {rings.map((s) => (
        <g key={'a' + s.i} opacity={focusEnabled && !s.hot ? 0.7 : 1}>
          <circle cx={cx} cy={cy} r={s.r} fill="none"
            stroke={`url(#rg${uid}-${s.i})`} strokeWidth={s.hot ? T + 5 : T}
            strokeDasharray={`${s.dash} ${s.C - s.dash}`} strokeDashoffset="0" strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ filter: s.hot ? `drop-shadow(0 0 16px ${s.color})` : `drop-shadow(0 0 7px ${s.color}77)` }} />
        </g>
      ))}

      {/* 端头百分比标注：仅重点环落在弧前端（其余占比见右侧列表，避免小环端头挤在一起） */}
      {rings.map((s) => {
        if (!s.hot) return null;
        const ox = cx + (s.r + 2) * Math.sin(s.dash / s.C * 2 * Math.PI);
        const oy = cy - (s.r + 2) * Math.cos(s.dash / s.C * 2 * Math.PI);
        return (
          <text key={'l' + s.i} x={ox} y={oy} textAnchor="middle" dominantBaseline="central"
            fontFamily="'Space Mono', monospace" fontSize="22" fontWeight="700"
            fill="#fff" stroke="#000" strokeWidth="3.4" paintOrder="stroke"
            style={{ filter: `drop-shadow(0 0 7px ${s.color})` }}>{s.pct}{percentSuffix}</text>
        );
      })}
    </svg>
  );
}


const SLIDE10REGION_COPY = {
  text001: "亿",
  text002: "%",
  text003: "· 融资额领先",
  text004: "亿",
  text005: "%",
};
function Slide10Region(props) {
  const {
      copy = SLIDE10REGION_COPY,
    itemCount = 5,
    chartVariant = 'donut',
    focusEnabled = true,
    focusIndex = 1,
    showPercent = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '地理护城河 · 融资地区分布',
    titleLead = '旧金山湾区',
    titleKeyword = '独占六成',
    captionTotal = '全年 970 亿美元',
    captionSub = '按公司总部所在地统计',
    // 数据
    regions = XHSRG_ITEMS,
  } = props;

  const src = Array.isArray(regions) ? regions : XHSRG_ITEMS;
  const count = Math.max(3, Math.min(src.length, itemCount));
  const items = src.slice(0, count).map((d) => ({ ...d, value: Number(d.value) || 0, pct: Number(d.pct) || 0 }));
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const maxPct = Math.max.apply(null, items.map((d) => d.pct));
  const isBar = chartVariant === 'bar';

  return (
    <section className="xhs-base xhsRg-root" data-label="地区分布">
      <style>{XHSRG_CSS}</style>

      <header className="xhsRg-head">
        <div className="xhsRg-kicker">{kicker}</div>
        <h2 className="xhsRg-title">
          <span>{titleLead}</span>
          <HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
      </header>

      <div className={'xhsRg-body' + (isBar ? ' is-bar' : ' is-donut')}>
        {!isBar && (
          <div className="xhsRg-panel">
            <RgRings items={items} focusEnabled={focusEnabled} focus={focus} percentSuffix={copy.text002} />
            <div className="xhsRg-cap">
              {focusEnabled ? (
                <React.Fragment>
                  <span className="xhsRg-captotal" style={{ color: items[focus].color }}>
                    {items[focus].value}<i className="xhsRg-capunit">{copy.text001}</i>
                    <span className="xhsRg-cappct">{items[focus].pct}{copy.text002}</span>
                  </span>
                  <span className="xhsRg-capsub">{items[focus].name}{copy.text003}</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="xhsRg-captotal">{captionTotal}</span>
                  <span className="xhsRg-capsub">{captionSub}</span>
                </React.Fragment>
              )}
            </div>
          </div>
        )}

        <div className="xhsRg-list">
          {items.map((d, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsRg-item' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': d.color }}>
                <span className="xhsRg-iname">{d.name}</span>
                {isBar && (
                  <span className="xhsRg-bar">
                    <span className="xhsRg-barfill" style={{ width: (d.pct / maxPct * 100) + '%' }} />
                  </span>
                )}
                <span className="xhsRg-ival">{d.value}<i className="xhsRg-iunit">{copy.text004}</i></span>
                {showPercent && <span className="xhsRg-ipct">{d.pct}{copy.text005}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 120, top: 210, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <RgSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 120, top: 128 }} />
          <RgSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 76, bottom: 64 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSRG_CSS = `
  .xhsRg-root{ padding:84px 110px 70px; position:relative; display:flex; flex-direction:column; }
  .xhsRg-head{ margin-bottom:34px; }
  .xhsRg-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:18px; }
  .xhsRg-title{ margin:0; display:flex; align-items:center; gap:22px; font-size:56px; font-weight:900; color:#fff; }

  .xhsRg-body{ flex:1; display:flex; gap:64px; align-items:stretch; }

  /* 环形图区（无框，直接落在黑底上，保留外圈炫光） */
  .xhsRg-panel{ flex:0 0 600px; display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:18px; padding:0; box-sizing:border-box; }
  .xhsRg-svg{ overflow:visible; }
  .xhsRg-cap{ display:flex; flex-direction:column; align-items:center; gap:8px; margin-top:8px; }
  .xhsRg-captotal{ display:flex; align-items:baseline; gap:14px; font-size:46px; font-weight:900; color:#fff;
    white-space:nowrap; font-family:"Space Mono",monospace; }
  .xhsRg-capunit{ font-size:22px; font-weight:700; font-style:normal; color:inherit; margin-left:2px; opacity:.7; }
  .xhsRg-cappct{ font-size:30px; font-weight:700; color:#fff; opacity:.55; }
  .xhsRg-capsub{ font-size:21px; font-weight:600; color:#8a8a8a; white-space:nowrap; }

  /* 地区卡片列 */
  .xhsRg-list{ flex:1; display:flex; flex-direction:column; gap:16px; justify-content:center; min-width:0; }
  .xhsRg-item{ position:relative; display:flex; align-items:center; gap:24px; overflow:hidden;
    padding:24px 32px; border-radius:18px;
    background:linear-gradient(120deg, color-mix(in srgb, var(--c) 16%, #131313), #0f0f0f 64%);
    border:1.5px solid color-mix(in srgb, var(--c) 36%, transparent);
    transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease, box-shadow .3s ease; }
  .xhsRg-item.is-dim{ opacity:.44; filter:saturate(.7); }
  .xhsRg-item.is-hot{ transform:translateX(6px); border-color:var(--c);
    box-shadow:0 0 64px color-mix(in srgb, var(--c) 28%, transparent); }

  .xhsRg-iname{ flex:1; font-size:31px; font-weight:800; color:#fff; white-space:nowrap; }
  .xhsRg-body.is-bar .xhsRg-iname{ flex:0 0 240px; }
  .xhsRg-bar{ flex:1; height:24px; border-radius:999px; background:#191919; overflow:hidden; min-width:0; }
  .xhsRg-barfill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 70%, #000), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsRg-ival{ font-size:36px; font-weight:900; color:#fff; font-variant-numeric:tabular-nums;
    white-space:nowrap; }
  .xhsRg-iunit{ font-size:19px; font-weight:700; font-style:normal; color:#8f8f8f; margin-left:5px; }
  .xhsRg-ipct{ flex-shrink:0; min-width:104px; text-align:center; font-size:24px; font-weight:900; color:#000;
    background:var(--c); padding:7px 16px; border-radius:999px; font-variant-numeric:tabular-nums;
    box-shadow:inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }
`;

const META = {
  id: 'region',
  label: '地区分布',
  Component: Slide10Region,
  defaults: {
      copy: SLIDE10REGION_COPY,
    ...hlDefaults,
    itemCount: 5,
    chartVariant: 'donut',
    focusEnabled: true,
    focusIndex: 1,
    showPercent: true,
    showDecorations: true,
    kicker: '地理护城河 · 融资地区分布',
    titleLead: '旧金山湾区',
    titleKeyword: '独占六成',
    captionTotal: '全年 970 亿美元',
    captionSub: '按公司总部所在地统计',
    regions: XHSRG_ITEMS,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }], default: SLIDE10REGION_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '条目数量', min: 3, max: 5, step: 1, default: 5, desc: '展示的地区条目数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['donut', 'bar'], optionLabels: ['环形', '柱状'], default: 'donut', desc: '环形图或柱状图' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一地区' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮地区的序号' },
    { key: 'showPercent', type: 'toggle', label: '百分比', default: true, desc: '右侧百分比徽章' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '地理护城河 · 融资地区分布', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '旧金山湾区', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '独占六成', desc: '高亮关键词' },
    { key: 'captionTotal', type: 'text', label: '中心总计', default: '全年 970 亿美元', desc: '环形中心总计(非焦点态)' },
    { key: 'captionSub', type: 'text', label: '中心注释', default: '按公司总部所在地统计', desc: '环形中心注释(非焦点态)' },
    { type: 'section', label: '数据 · 地区' },
    {
      key: 'regions', type: 'list', label: '地区', itemLabel: '地区', countFromKey: 'itemCount',
      fields: [{ key: 'name', label: '名称' }, { key: 'value', label: '金额' }, { key: 'pct', label: '占比' }, { key: 'color', label: '颜色' }],
      default: XHSRG_ITEMS, desc: '地区：名称 / 金额 / 占比 / 颜色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide10Region.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide10Region;
