/*
 * Slide03Charts — 融资趋势图表页（暗色面板 + 柱状/折线图）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks。
 * CSS 前缀 xhsCh- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  panelCount        number 面板数量        默认 2   可选 1–2
 *  chartVariant      enum   图表类型        默认 'bar'  可选 'bar' | 'line'
 *  focusEnabled      bool   高亮重点数据点   默认 true
 *  focusIndex        number 重点序号(从1起)  默认 3
 *  showGrowthMarkers bool   增长标注(+x%)    默认 true
 *  showDecorations   bool   装饰元素显隐     默认 true
 *
 * 迁移：import Slide03Charts, { defaults, controls } from './Slide03Charts.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

  const XHSCH_PANELS = [
    {
      color: '#27E021',
      title: '融资节奏',
      hl: '前高后稳',
      desc: '全年单笔 ≥1 亿美元融资呈「前高后稳」：Q2–Q3 连续达峰后理性回落，平均单笔约 10 亿美元，市场对头部标的高度追捧。',
      unit: '亿美元',
      data: [
        { label: 'Q1', value: 162 },
        { label: 'Q2', value: 284 },
        { label: 'Q3', value: 318 },
        { label: 'Q4', value: 206 },
      ],
    },
    {
      color: '#FFC700',
      title: '头部集中',
      hl: '赢家通吃',
      desc: '随着轮次后移，平均单笔融资额持续放大——「D 轮及以后」超 15 亿美元，少数独角兽反复获得巨额追加，市场集中度极高。',
      unit: '亿美元',
      data: [
        { label: 'B 轮', value: 3.5 },
        { label: 'C 轮', value: 6.8 },
        { label: 'D+ 轮', value: 15.2 },
      ],
    },
  ];

  function ChSpark({ size = 20, color = '#fff', style }) {
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

  function ChBolt({ color }) {
    return (
      <span className="xhsCh-bolt" style={{ background: color }}>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="#000" />
        </svg>
      </span>
    );
  }

  function ChChart({ panel, variant, focusEnabled, focusIndex, showGrowth, growthSuffix = '%' }) {
    const H = 300;          // 绘图区高度
    const BARMAX = 200;     // 柱子最高像素（留出顶部空间给连线/标注）
    const data = panel.data;
    const n = data.length;
    const max = Math.max.apply(null, data.map((d) => d.value));
    const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
    const heights = data.map((d) => Math.max(16, (d.value / max) * BARMAX));

    const plotRef = React.useRef(null);
    const [pw, setPw] = React.useState(0);
    React.useEffect(() => {
      const el = plotRef.current;
      if (!el) return;
      const measure = () => setPw(el.clientWidth);
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const cx = (i) => (i + 0.5) * (pw / n);   // 柱心 x（像素）
    const topY = (i) => H - heights[i];        // 柱顶 y（距绘图区顶部）

    const conns = [];
    if (showGrowth) {
      for (let i = 0; i < n - 1; i++) {
        const a = data[i].value, b = data[i + 1].value;
        const pct = Math.round(((b - a) / a) * 100);
        if (pct > 0) conns.push({ i, pct });
      }
    }

    // 连接相邻两柱顶的拱形增长曲线 + 末端箭头
    const arc = (i) => {
      const x1 = cx(i), x2 = cx(i + 1);
      const y1 = topY(i) - 46, y2 = topY(i + 1) - 46;
      const apex = Math.min(y1, y2) - 40;
      const c1x = x1 + (x2 - x1) * 0.3, c2x = x2 - (x2 - x1) * 0.3;
      const d = `M ${x1} ${y1} C ${c1x} ${apex}, ${c2x} ${apex}, ${x2} ${y2}`;
      let dx = x2 - c2x, dy = y2 - apex;
      const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
      const barb = (deg) => {
        const a = (deg * Math.PI) / 180;
        const rx = dx * Math.cos(a) - dy * Math.sin(a);
        const ry = dx * Math.sin(a) + dy * Math.cos(a);
        return `${(x2 + rx * 14).toFixed(1)} ${(y2 + ry * 14).toFixed(1)}`;
      };
      const head = `M ${x2} ${y2} L ${barb(148)} M ${x2} ${y2} L ${barb(-148)}`;
      return { d, head, mx: (x1 + x2) / 2, apex };
    };

    return (
      <div className="xhsCh-chart">
        <div className="xhsCh-plot" style={{ height: H + 'px' }} ref={plotRef}>
          {pw > 0 && (
            <svg className="xhsCh-overlay" width={pw} height={H} viewBox={`0 0 ${pw} ${H}`} aria-hidden="true">
              {variant === 'line' && (
                <polyline points={data.map((d, i) => `${cx(i)},${topY(i)}`).join(' ')}
                  fill="none" stroke={panel.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
              )}
              {showGrowth && conns.map(({ i }) => {
                const a = arc(i);
                return (
                  <g key={i}>
                    <path d={a.d} fill="none" stroke={panel.color} strokeWidth="3.5" strokeLinecap="round" />
                    <path d={a.head} fill="none" stroke={panel.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}
            </svg>
          )}

          <div className="xhsCh-bars">
            {data.map((d, i) => {
              const hot = focusEnabled && i === focus;
              return (
                <div className="xhsCh-col" key={i}>
                  <div className="xhsCh-val-top">{d.value}</div>
                  {variant === 'bar' ? (
                    <div
                      className={'xhsCh-bar' + (hot ? ' is-hot' : '')}
                      style={{ height: heights[i] + 'px', '--c': panel.color }}
                    >
                    </div>
                  ) : (
                    <div className="xhsCh-dotwrap" style={{ height: heights[i] + 'px' }}>
                      <span className={'xhsCh-dot' + (hot ? ' is-hot' : '')} style={{ '--c': panel.color }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showGrowth && pw > 0 && conns.map(({ i, pct }) => {
            const a = arc(i);
            return (
              <span className="xhsCh-glabel" key={i}
                style={{ left: a.mx + 'px', top: a.apex + 'px', color: panel.color }}>+{pct}{growthSuffix}</span>
            );
          })}
        </div>
        <div className="xhsCh-axis">
          {data.map((d, i) => <span key={i} className="xhsCh-axislabel">{d.label}</span>)}
        </div>
      </div>
    );
  }

  
const SLIDE03CHARTS_COPY = {
  text001: "单位：",
  text002: "%",
};
function Slide03Charts(props) {
    const {
      copy = SLIDE03CHARTS_COPY,
      panelCount = 2,
      chartVariant = 'bar',
      focusEnabled = true,
      focusIndex = 3,
      showGrowthMarkers = true,
      showDecorations = true,
      hlStyle = 'glass',
      hlTilt = 2,
      // 文案
      kicker = '市场节奏 · 融资趋势透视',
      title = '全年「前高后稳」，资金向头部加速集中',
      // 数据
      panels = XHSCH_PANELS,
    } = props;

    const pcount = Math.max(1, Math.min((Array.isArray(panels) ? panels.length : 2), panelCount));
    const shownPanels = (Array.isArray(panels) ? panels : XHSCH_PANELS).slice(0, pcount);

    return (
      <section className="xhs-base xhsCh-root" data-label="融资趋势">
        <style>{XHSCH_CSS}</style>

        <header className="xhsCh-head">
          <div className="xhsCh-kicker">{kicker}</div>
          <h2 className="xhsCh-title">{title}</h2>
        </header>

        <div className={'xhsCh-grid' + (pcount === 1 ? ' is-single' : '')}>
          {shownPanels.map((p, idx) => (
            <div className="xhsCh-panel" key={idx}>
              <div className="xhsCh-info">
                <h3 className="xhsCh-ptitle">
                  <span>{p.title}</span>
                  <HL color={p.color} variant={hlStyle} tilt={hlTilt}>{p.hl}</HL>
                  <ChBolt color={p.color} />
                </h3>
                <p className="xhsCh-desc">{p.desc}</p>
                <div className="xhsCh-unit">{copy.text001}{p.unit}</div>
              </div>
              <ChChart
                panel={p}
                variant={chartVariant}
                focusEnabled={focusEnabled}
                focusIndex={focusIndex}
                showGrowth={showGrowthMarkers}
                growthSuffix={copy.text002}
              />
            </div>
          ))}
        </div>

        {showDecorations && (
          <React.Fragment>
            <span aria-hidden="true" style={{ position: 'absolute', right: 120, top: 232, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <ChSpark size={20} color="#15A7F0" style={{ position: 'absolute', right: 120, top: 150 }} />
            <ChSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 90 }} />
          </React.Fragment>
        )}
      </section>
    );
  }

  const XHSCH_CSS = `
  .xhsCh-root{ padding:90px 110px 70px; position:relative; display:flex; flex-direction:column; }
  .xhsCh-head{ margin-bottom:46px; }
  .xhsCh-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:20px; }
  .xhsCh-title{ margin:0; font-size:54px; font-weight:900; color:#fff; }

  .xhsCh-grid{ display:grid; grid-template-columns:1fr 1fr; gap:40px; flex:1; }
  .xhsCh-grid.is-single{ grid-template-columns:1fr; }
  .xhsCh-panel{ background:linear-gradient(180deg,#1c1c1c,#111); border:1px solid rgba(255,255,255,.07);
    border-radius:22px; padding:44px 46px; display:flex; gap:26px; align-items:stretch;
    box-shadow:0 24px 60px rgba(0,0,0,.5); }
  .xhsCh-grid.is-single .xhsCh-panel{ padding:50px 64px; }
  .xhsCh-info{ width:42%; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsCh-ptitle{ margin:0; display:flex; align-items:center; gap:14px; flex-wrap:wrap;
    font-size:34px; font-weight:900; color:#fff; }
  .xhsCh-bolt{ display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px;
    border-radius:50%; box-shadow:0 0 22px color-mix(in srgb, var(--c,#fff) 50%, transparent); }
  .xhsCh-desc{ margin:24px 0 0; font-size:22px; line-height:1.66; color:#a6a6a6; font-weight:500; }
  .xhsCh-unit{ margin-top:auto; padding-top:20px; font-size:20px; color:#6f6f6f; font-weight:600; }

  .xhsCh-chart{ flex:1; display:flex; flex-direction:column; justify-content:flex-end; min-width:0; }
  .xhsCh-plot{ position:relative; display:flex; align-items:flex-end; overflow:visible; }
  .xhsCh-overlay{ position:absolute; left:0; top:0; overflow:visible; pointer-events:none; z-index:3; }
  .xhsCh-bars{ display:flex; align-items:flex-end; justify-content:space-around; width:100%; height:100%; }
  .xhsCh-col{ position:relative; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; flex:1; }
  .xhsCh-val-top{ font-size:24px; font-weight:900; color:#e8e8e8; margin-bottom:12px; }
  .xhsCh-bar{ position:relative; width:62px; border-radius:999px;
    background:linear-gradient(180deg, color-mix(in srgb, var(--c) 80%, #fff), var(--c));
    box-shadow:0 0 36px color-mix(in srgb, var(--c) 30%, transparent), inset 0 3px 0 rgba(255,255,255,.4);
    transition:height .5s cubic-bezier(.2,.8,.2,1); }
  .xhsCh-bar.is-hot{ box-shadow:0 0 70px color-mix(in srgb, var(--c) 70%, transparent), inset 0 3px 0 rgba(255,255,255,.5); }
  .xhsCh-dotwrap{ position:relative; width:62px; display:flex; align-items:flex-start; justify-content:center; }
  .xhsCh-dot{ width:22px; height:22px; border-radius:50%; background:var(--c); margin-top:-11px;
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 55%, transparent), 0 0 0 5px rgba(0,0,0,.5); }
  .xhsCh-dot.is-hot{ width:30px; height:30px; margin-top:-15px; }
  .xhsCh-glabel{ position:absolute; transform:translate(-50%,-100%); font-size:24px; font-weight:900;
    white-space:nowrap; pointer-events:none; z-index:4; padding-bottom:4px; }
  .xhsCh-axis{ display:flex; justify-content:space-around; margin-top:18px; }
  .xhsCh-axislabel{ flex:1; text-align:center; font-size:24px; font-weight:700; color:#bdbdbd; }
  `;

  const META = {
    id: 'charts',
    label: '融资趋势',
    Component: Slide03Charts,
    defaults: {
      copy: SLIDE03CHARTS_COPY,
      panelCount: 2,
      chartVariant: 'bar',
      focusEnabled: true,
      focusIndex: 3,
      showGrowthMarkers: true,
      showDecorations: true,
      ...hlDefaults,
      kicker: '市场节奏 · 融资趋势透视',
      title: '全年「前高后稳」，资金向头部加速集中',
      panels: XHSCH_PANELS,
    },
    controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }], default: SLIDE03CHARTS_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
      ...hlControls,
      { key: 'panelCount', type: 'slider', label: '面板数量', min: 1, max: 2, step: 1, default: 2, desc: '并排展示的图表面板数' },
      { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['bar', 'line'], optionLabels: ['柱状', '折线'], default: 'bar', desc: '柱状图或折线图' },
      { key: 'focusEnabled', type: 'toggle', label: '高亮重点', default: true, desc: '是否高亮某个数据点' },
      { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 3, showIf: (v) => v.focusEnabled, desc: '被高亮数据点的序号' },
      { key: 'showGrowthMarkers', type: 'toggle', label: '增长标注', default: true, desc: '柱间 +x% 增幅标注' },
      { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
      { type: 'section', label: '文案' },
      { key: 'kicker', type: 'text', label: '眉标', default: '市场节奏 · 融资趋势透视', desc: '顶部 kicker' },
      { key: 'title', type: 'text', label: '标题', default: '全年「前高后稳」，资金向头部加速集中', desc: '页面主标题' },
      { type: 'section', label: '数据 · 面板文案' },
      {
        key: 'panels', type: 'list', label: '图表面板', itemLabel: '面板', countFromKey: 'panelCount',
        fields: [{ key: 'title', label: '标题' }, { key: 'hl', label: '关键词' }, { key: 'desc', label: '描述' }, { key: 'unit', label: '单位' }],
        default: XHSCH_PANELS, desc: '面板文案：标题 / 关键词 / 描述 / 单位（柱点数值 data 在 defaults 中）',
      },
    ],
  };

  META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide03Charts.defaultProps = defaultProps;
export const defaults = META.defaults;
  export const controls = META.controls;
  export const meta = META;
  export default Slide03Charts;
