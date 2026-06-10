/*
 * Slide48Dumbbell — 估值跃迁（图表页 · 哑铃/区间图 Dumbbell / 横向柱状双模）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsDb- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 新图表类型：哑铃图——每家公司一条「起投估值 ●——● 当前估值」哑铃，连接条长度即一年
 * 内估值跃迁的幅度，右端标 ×倍数。chartVariant 可切到横向柱状（仅当前估值）。
 * 横轴为 sqrt 示意比例（小值仍可辨识、保留陡升），数值以标签为准（报告 3.2，亿美元）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number 展示的公司数量(2–5)   默认 5
 *  chartVariant    enum   编码方式             默认 'dumbbell' 可选 'dumbbell'|'bar'
 *  focusEnabled    bool   重点行高亮开关         默认 true
 *  focusIndex      number 重点行序号(从1起)     默认 1   范围 1–itemCount
 *  showStartDot    bool   起点估值端点显隐       默认 true
 *  showMultiplier  bool   ×倍数徽标显隐         默认 true
 *  showScale       bool   底部刻度参考线显隐     默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide48Dumbbell, { defaults, controls } from './Slide48Dumbbell.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 5 家公司（写死）：名称 / 赛道 / 起投估值 / 当前估值(亿美元) / 主色
const XHSDB_ROWS = [
  { name: 'OpenAI', cat: '通用大模型', start: 290, now: 1570, color: '#27E021' },
  { name: 'Anthropic', cat: '通用大模型', start: 184, now: 615, color: '#15A7F0' },
  { name: 'xAI', cat: '通用大模型', start: 240, now: 500, color: '#FF9FE2' },
  { name: 'Safe Superintelligence', cat: '安全对齐', start: 50, now: 320, color: '#FFC700' },
  { name: 'CoreWeave', cat: '算力 / 云', start: 190, now: 235, color: '#9aa0ff' },
];

function DbSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE48DUMBBELL_COPY = {
  text001: "估值跃迁 · ONE-YEAR LEAP",
  text002: "一年之内，头部把估值",
  text003: "整段拉远",
  text004: "×",
  text005: "亿",
  text006: "强者愈强",
  text007: "起投估值 ●——● 当前估值 · 横轴 sqrt 示意比例，数值以标签为准（报告 3.2，亿美元）",
};
function Slide48Dumbbell(props) {
  const {
      copy = SLIDE48DUMBBELL_COPY,
      rowsData = XHSDB_ROWS,
    itemCount = 5,
    chartVariant = 'dumbbell',
    focusEnabled = true,
    focusIndex = 1,
    showStartDot = true,
    showMultiplier = true,
    showScale = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(5, itemCount));
  const rows = rowsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isBar = chartVariant === 'bar';

  const maxNow = Math.max(...rows.map((d) => d.now));
  const scale = (v) => (Math.sqrt(v) / Math.sqrt(maxNow)) * 100; // sqrt 示意比例
  const ticks = [0, 400, 800, 1200, 1600].filter((tk) => tk <= maxNow * 1.02);

  return (
    <section className="xhs-base xhsDb-root" data-label="估值跃迁" data-screen-label="估值跃迁">
      <style>{XHSDB_CSS}</style>

      <header className="xhsDb-head">
        <div className="xhsDb-kicker">{copy.text001}</div>
        <h2 className="xhsDb-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsDb-stage">
        {rows.map((d, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          const sp = scale(d.start);
          const np = scale(d.now);
          const mult = (d.now / d.start);
          return (
            <div key={i} className={'xhsDb-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')} style={{ '--c': d.color }}>
              <div className="xhsDb-rhead">
                <span className="xhsDb-rname">{d.name}</span>
                <span className="xhsDb-rcat">{d.cat}</span>
              </div>

              {!isBar ? (
                <div className="xhsDb-track">
                  {showScale && ticks.map((tk, ti) => (
                    <span key={ti} className="xhsDb-grid" style={{ left: scale(tk) + '%' }}></span>
                  ))}
                  <span className="xhsDb-bar" style={{ left: sp + '%', width: (np - sp) + '%' }}></span>
                  {showStartDot && (
                    <span className="xhsDb-dot xhsDb-dot--start" style={{ left: sp + '%' }}>
                      <span className="xhsDb-dotlab xhsDb-dotlab--start">{d.start}</span>
                    </span>
                  )}
                  <span className="xhsDb-dot xhsDb-dot--now" style={{ left: np + '%' }}>
                    <span className="xhsDb-dotlab xhsDb-dotlab--now">{d.now}</span>
                  </span>
                  {showMultiplier && (
                    <span className="xhsDb-mult" style={{ left: np + '%' }}>{copy.text004}{mult.toFixed(1)}</span>
                  )}
                </div>
              ) : (
                <div className="xhsDb-track">
                  {showScale && ticks.map((tk, ti) => (
                    <span key={ti} className="xhsDb-grid" style={{ left: scale(tk) + '%' }}></span>
                  ))}
                  <span className="xhsDb-barfill" style={{ width: np + '%' }}>
                    <span className="xhsDb-barval">{d.now}<i>{copy.text005}</i></span>
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {showScale && (
          <div className="xhsDb-axis">
            <span className="xhsDb-axhead"></span>
            <div className="xhsDb-axline">
              {ticks.map((tk, ti) => (
                <span key={ti} className="xhsDb-axtick" style={{ left: scale(tk) + '%' }}>{tk}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="xhsDb-foot">
        <span className="xhsDb-foot-tag">{copy.text006}</span>
        <span className="xhsDb-foot-txt">{copy.text007}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <DbSpark size={24} color="#15A7F0" style={{ position: 'absolute', right: 92, top: 150 }} />
          <DbSpark size={15} color="#FFC700" style={{ position: 'absolute', left: 84, bottom: 112 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSDB_CSS = `
  .xhsDb-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsDb-head{ flex:0 0 auto; margin-bottom:20px; }
  .xhsDb-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsDb-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsDb-stage{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:18px; }
  .xhsDb-row{ display:grid; grid-template-columns:330px 1fr; align-items:center; gap:34px;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsDb-row.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsDb-rhead{ display:flex; flex-direction:column; gap:4px; }
  .xhsDb-rname{ font-size:29px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsDb-row.is-hot .xhsDb-rname{ color:var(--c); text-shadow:0 0 22px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsDb-rcat{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.06em; color:#7c7c7c; }

  .xhsDb-track{ position:relative; height:58px; }
  .xhsDb-grid{ position:absolute; top:6px; bottom:6px; width:1px; background:rgba(255,255,255,.07); }

  .xhsDb-bar{ position:absolute; top:50%; transform:translateY(-50%); height:12px; border-radius:7px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 55%, #1a1a1a), var(--c));
    box-shadow:0 0 22px color-mix(in srgb, var(--c) 34%, transparent); }
  .xhsDb-row.is-hot .xhsDb-bar{ box-shadow:0 0 40px color-mix(in srgb, var(--c) 50%, transparent); }

  .xhsDb-dot{ position:absolute; top:50%; width:26px; height:26px; border-radius:50%; transform:translate(-50%,-50%); }
  .xhsDb-dot--start{ background:radial-gradient(circle at 38% 32%, #5a5a5a, #2a2a2a 70%); border:2px solid #6a6a6a;
    box-shadow:inset 0 0 6px rgba(0,0,0,.6); }
  .xhsDb-dot--now{ background:radial-gradient(circle at 38% 30%, color-mix(in srgb, var(--c) 70%, #fff), var(--c) 72%);
    border:3px solid #050505; box-shadow:0 0 24px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsDb-row.is-hot .xhsDb-dot--now{ transform:translate(-50%,-50%) scale(1.16); }
  .xhsDb-dotlab{ position:absolute; left:50%; transform:translateX(-50%); top:-30px; font-family:"Space Mono",monospace;
    font-weight:700; font-size:19px; white-space:nowrap; }
  .xhsDb-dotlab--start{ color:#8a8a8a; }
  .xhsDb-dotlab--now{ color:var(--c); text-shadow:0 0 16px color-mix(in srgb, var(--c) 45%, transparent); font-size:22px; }
  .xhsDb-mult{ position:absolute; top:50%; transform:translateY(-50%); margin-left:24px; font-family:"Space Mono",monospace;
    font-weight:700; font-size:18px; color:#06140f; background:var(--c); padding:3px 11px; border-radius:8px; white-space:nowrap;
    box-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }

  /* bar 模式 */
  .xhsDb-barfill{ position:absolute; top:50%; transform:translateY(-50%); left:0; height:30px; border-radius:8px;
    display:flex; align-items:center; justify-content:flex-end; padding-right:16px; min-width:90px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 30%, #0c0c0c), var(--c));
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 34%, transparent), inset 0 2px 0 rgba(255,255,255,.3); }
  .xhsDb-barval{ font-family:"Space Mono",monospace; font-weight:700; font-size:22px; color:#06140f; display:flex; align-items:baseline; }
  .xhsDb-barval i{ font-style:normal; font-size:.6em; margin-left:2px; }

  .xhsDb-axis{ display:grid; grid-template-columns:330px 1fr; gap:34px; margin-top:6px; }
  .xhsDb-axline{ position:relative; height:22px; border-top:1.5px solid rgba(255,255,255,.12); }
  .xhsDb-axtick{ position:absolute; top:5px; transform:translateX(-50%); font-family:"Space Mono",monospace; font-size:14px; color:#6a6a6a; }

  /* ── 页脚 ── */
  .xhsDb-foot{ flex:0 0 auto; margin-top:18px; display:flex; align-items:center; gap:18px; }
  .xhsDb-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#15A7F0; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(21,167,240,.4); }
  .xhsDb-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'dumbbell',
  label: '估值跃迁',
  Component: Slide48Dumbbell,
  defaults: {
      copy: SLIDE48DUMBBELL_COPY,
      rowsData: XHSDB_ROWS,
    ...hlDefaults,
    itemCount: 5,
    chartVariant: 'dumbbell',
    focusEnabled: true,
    focusIndex: 1,
    showStartDot: true,
    showMultiplier: true,
    showScale: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE48DUMBBELL_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "cat", label: "cat" }, { key: "start", label: "start" }, { key: "now", label: "now" }, { key: "color", label: "color" }], default: XHSDB_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '公司数', min: 2, max: 5, step: 1, default: 5, desc: '展示的公司哑铃条数' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['dumbbell', 'bar'], optionLabels: ['哑铃图', '横向柱'], default: 'dumbbell', desc: '哑铃区间 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一行' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮行的序号' },
    { key: 'showStartDot', type: 'toggle', label: '起点端点', default: true, desc: '起投估值端点显隐（哑铃生效）' },
    { key: 'showMultiplier', type: 'toggle', label: '倍数徽标', default: true, desc: '×倍数徽标显隐（哑铃生效）' },
    { key: 'showScale', type: 'toggle', label: '刻度参考', default: true, desc: '底部刻度参考线显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide48Dumbbell.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide48Dumbbell;
