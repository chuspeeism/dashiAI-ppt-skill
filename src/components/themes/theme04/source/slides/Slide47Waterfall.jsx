/*
 * Slide47Waterfall — 资金瀑布（图表页 · 瀑布/桥接图 Waterfall / 横向柱状双模）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsWf- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 新图表类型：瀑布（桥接）图——各赛道资金「悬浮柱」逐级累加，最后合并成总额柱，
 * 直观表达「总盘子由哪些赛道堆出来」。chartVariant 可切到横向柱状对照。
 * 数据为调研整理（报告 3.1 赛道占比，单位亿美元，示意比例）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  segmentCount    number 参与累加的赛道段数(2–5) 默认 5
 *  chartVariant    enum   编码方式             默认 'waterfall' 可选 'waterfall'|'bar'
 *  focusEnabled    bool   重点段高亮开关         默认 true
 *  focusIndex      number 重点段序号(从1起)     默认 1   范围 1–segmentCount
 *  showConnectors  bool   段间虚线连接显隐       默认 true
 *  showTotal       bool   末端合计柱显隐         默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide47Waterfall, { defaults, controls } from './Slide47Waterfall.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 5 个赛道段（写死）：名称 / 英文 / 数值(亿美元) / 主色
const XHSWF_SEGS = [
  { zh: '通用大模型', en: 'FOUNDATION', value: 480, color: '#27E021' },
  { zh: '算力 / 云', en: 'COMPUTE', value: 360, color: '#15A7F0' },
  { zh: '应用层', en: 'APPLICATION', value: 150, color: '#FFC700' },
  { zh: '具身智能', en: 'ROBOTICS', value: 120, color: '#FF9FE2' },
  { zh: '其他赛道', en: 'OTHERS', value: 90, color: '#9aa0ff' },
];

function WfSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE47WATERFALL_COPY = {
  text001: "资金构成 · WATERFALL",
  text002: "总盘子，是被",
  text003: "逐层堆出来",
  text004: "的",
  text005: "合计盘子",
  text006: "TOTAL · 亿美元",
  text007: "亿",
  text008: "头部赛道领跑",
  text009: "通用大模型 + 算力两条赛道吃掉七成盘子 · 数据为调研整理（报告 3.1，单位亿美元 / 示意比例）",
};
function Slide47Waterfall(props) {
  const {
      copy = SLIDE47WATERFALL_COPY,
      segsData = XHSWF_SEGS,
    segmentCount = 5,
    chartVariant = 'waterfall',
    focusEnabled = true,
    focusIndex = 1,
    showConnectors = true,
    showTotal = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(5, segmentCount));
  const segs = segsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isBar = chartVariant === 'bar';

  const total = segs.reduce((s, d) => s + d.value, 0);
  // 计算每段累加前的基线（cumBefore）
  let acc = 0;
  const built = segs.map((d) => {
    const cumBefore = acc;
    acc += d.value;
    return { ...d, cumBefore, cumAfter: acc, pct: (d.value / total) * 100, bottom: (cumBefore / total) * 100 };
  });

  return (
    <section className="xhs-base xhsWf-root" data-label="资金瀑布" data-screen-label="资金瀑布">
      <style>{XHSWF_CSS}</style>

      <header className="xhsWf-head">
        <div className="xhsWf-kicker">{copy.text001}</div>
        <h2 className="xhsWf-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>{copy.text004}</h2>
      </header>

      {!isBar ? (
        <div className="xhsWf-stage" style={{ '--cols': n + (showTotal ? 1 : 0) }}>
          {built.map((d, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsWf-col' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')} style={{ '--c': d.color }}>
                <div className="xhsWf-plot">
                  <div className="xhsWf-bar" style={{ height: d.pct + '%', bottom: d.bottom + '%' }}>
                    <span className="xhsWf-val">+{d.value}</span>
                  </div>
                  {showConnectors && i < built.length - 1 && (
                    <div className="xhsWf-conn" style={{ bottom: d.cumAfter / total * 100 + '%' }}></div>
                  )}
                </div>
                <div className="xhsWf-xlab">
                  <span className="xhsWf-xzh">{d.zh}</span>
                  <span className="xhsWf-xen">{d.en}</span>
                </div>
              </div>
            );
          })}
          {showTotal && (
            <div className="xhsWf-col xhsWf-col--total">
              <div className="xhsWf-plot">
                <div className="xhsWf-bar xhsWf-bar--total" style={{ height: '100%', bottom: '0%' }}>
                  <span className="xhsWf-val xhsWf-val--total">{total}</span>
                </div>
              </div>
              <div className="xhsWf-xlab">
                <span className="xhsWf-xzh">{copy.text005}</span>
                <span className="xhsWf-xen">{copy.text006}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="xhsWf-bars">
          {[...built].sort((a, b) => b.value - a.value).map((d, i) => {
            const max = built[0] ? Math.max(...built.map((x) => x.value)) : 1;
            const oi = segs.findIndex((s) => s.zh === d.zh);
            const hot = focusEnabled && oi === focus;
            const dimc = focusEnabled && oi !== focus;
            return (
              <div key={i} className={'xhsWf-barrow' + (hot ? ' is-hot' : '') + (dimc ? ' is-dim' : '')} style={{ '--c': d.color }}>
                <div className="xhsWf-barhead">
                  <span className="xhsWf-barzh">{d.zh}</span>
                  <span className="xhsWf-baren">{d.en}</span>
                </div>
                <div className="xhsWf-bartrack">
                  <div className="xhsWf-barfill" style={{ width: (d.value / max) * 100 + '%' }}>
                    <span className="xhsWf-barval">{d.value}<i>{copy.text007}</i></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <footer className="xhsWf-foot">
        <span className="xhsWf-foot-tag">{copy.text008}</span>
        <span className="xhsWf-foot-txt">{copy.text009}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <WfSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <WfSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 116 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSWF_CSS = `
  .xhsWf-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsWf-head{ flex:0 0 auto; margin-bottom:18px; }
  .xhsWf-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsWf-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  /* ── 瀑布 ── */
  .xhsWf-stage{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--cols),1fr); gap:26px; align-items:end; padding-bottom:4px; }
  .xhsWf-col{ display:flex; flex-direction:column; height:100%; min-height:0;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsWf-col.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsWf-plot{ position:relative; flex:1 1 auto; min-height:0; border-bottom:2px solid rgba(255,255,255,.14); }
  .xhsWf-bar{ position:absolute; left:8%; right:8%; border-radius:12px 12px 4px 4px;
    background:linear-gradient(180deg, color-mix(in srgb, var(--c) 92%, #fff) 0%, var(--c) 40%, color-mix(in srgb, var(--c) 72%, #000) 100%);
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 34%, transparent), inset 0 2px 0 rgba(255,255,255,.4);
    display:flex; align-items:flex-start; justify-content:center; padding-top:8px;
    transition:filter .3s, box-shadow .3s; }
  .xhsWf-col.is-hot .xhsWf-bar{ box-shadow:0 0 48px color-mix(in srgb, var(--c) 50%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsWf-val{ position:absolute; top:-34px; font-family:"Space Mono",monospace; font-weight:700; font-size:25px; color:var(--c);
    text-shadow:0 0 16px color-mix(in srgb, var(--c) 45%, transparent); white-space:nowrap; }
  .xhsWf-bar--total{ left:6%; right:6%; border-radius:12px 12px 4px 4px;
    background:linear-gradient(180deg,#f2f2f2 0%,#cfcfcf 42%,#8f8f8f 100%);
    box-shadow:0 0 40px rgba(255,255,255,.22), inset 0 2px 0 rgba(255,255,255,.7); }
  .xhsWf-val--total{ color:#fff; font-size:30px; text-shadow:0 0 22px rgba(255,255,255,.5); top:-40px; }
  .xhsWf-conn{ position:absolute; left:92%; width:30%; height:0; border-top:2px dashed rgba(255,255,255,.26); }

  .xhsWf-xlab{ flex:0 0 auto; margin-top:16px; display:flex; flex-direction:column; align-items:center; gap:3px; text-align:center; }
  .xhsWf-xzh{ font-size:21px; font-weight:800; color:#eaeaea; line-height:1.15; }
  .xhsWf-xen{ font-family:"Space Mono",monospace; font-size:12px; letter-spacing:.12em; color:#6f6f6f; }
  .xhsWf-col--total .xhsWf-xzh{ color:#fff; }

  /* ── 横向柱状对照 ── */
  .xhsWf-bars{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:26px; }
  .xhsWf-barrow{ display:grid; grid-template-columns:300px 1fr; align-items:center; gap:30px; transition:opacity .3s, filter .3s; }
  .xhsWf-barrow.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsWf-barhead{ display:flex; flex-direction:column; gap:3px; }
  .xhsWf-barzh{ font-size:30px; font-weight:900; color:#fff; }
  .xhsWf-baren{ font-family:"Space Mono",monospace; font-size:13px; letter-spacing:.12em; color:#6f6f6f; }
  .xhsWf-bartrack{ height:58px; border-radius:16px; background:linear-gradient(180deg,#141414,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.06); overflow:hidden; }
  .xhsWf-barfill{ height:100%; border-radius:14px; display:flex; align-items:center; justify-content:flex-end; padding-right:20px; min-width:108px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 34%, #0c0c0c), var(--c));
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 36%, transparent), inset 0 2px 0 rgba(255,255,255,.3); }
  .xhsWf-barval{ font-family:"Space Mono",monospace; font-weight:700; font-size:28px; color:#06140f; display:flex; align-items:baseline; }
  .xhsWf-barval i{ font-style:normal; font-size:.55em; margin-left:3px; }
  .xhsWf-barrow.is-hot .xhsWf-bartrack{ border-color:var(--c); box-shadow:0 0 40px color-mix(in srgb, var(--c) 26%, transparent); }

  /* ── 页脚 ── */
  .xhsWf-foot{ flex:0 0 auto; margin-top:22px; display:flex; align-items:center; gap:18px; }
  .xhsWf-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#27E021; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(39,224,33,.4); }
  .xhsWf-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'waterfall',
  label: '资金瀑布',
  Component: Slide47Waterfall,
  defaults: {
      copy: SLIDE47WATERFALL_COPY,
      segsData: XHSWF_SEGS,
    ...hlDefaults,
    segmentCount: 5,
    chartVariant: 'waterfall',
    focusEnabled: true,
    focusIndex: 1,
    showConnectors: true,
    showTotal: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }], default: SLIDE47WATERFALL_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'segsData', type: 'list', label: 'segsData', itemLabel: '数据', fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "value", label: "value" }, { key: "color", label: "color" }], default: XHSWF_SEGS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'segmentCount', type: 'slider', label: '赛道段数', min: 2, max: 5, step: 1, default: 5, desc: '参与累加的赛道段数' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['waterfall', 'bar'], optionLabels: ['瀑布图', '横向柱'], default: 'waterfall', desc: '瀑布累加 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一赛道段' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 1, maxFromKey: 'segmentCount', showIf: (v) => v.focusEnabled, desc: '被高亮赛道段的序号' },
    { key: 'showConnectors', type: 'toggle', label: '段间连接', default: true, desc: '瀑布段间虚线连接（瀑布生效）' },
    { key: 'showTotal', type: 'toggle', label: '合计柱', default: true, desc: '末端总额柱显隐（瀑布生效）' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide47Waterfall.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide47Waterfall;
