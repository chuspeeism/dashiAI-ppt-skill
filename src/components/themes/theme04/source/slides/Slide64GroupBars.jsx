/*
 * Slide64GroupBars — 半年期赛道对比柱（图表 · 簇状柱新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsGb- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 全 deck 已有单系列柱 / 堆叠柱 / 月度面积，但尚无「同类别两系列簇状对比柱」：
 * 每个赛道并置「上半年 vs 下半年」两根柱，一眼看清各赛道半年内的体量跃升。
 * focus 强化某赛道整组 + 弱化其余。数值为调研整理（报告 3.x，单位亿美元，示意比例）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  columnCount     number 展示的赛道组数(3–5)   默认 5
 *  chartVariant    enum   图表类型               默认 'group' 可选 'group'|'total'
 *  focusEnabled    bool   重点赛道高亮开关        默认 true
 *  focusIndex      number 重点赛道序号(从1起)    默认 1   范围 1–columnCount
 *  showValues      bool   柱顶数值标签显隐        默认 true
 *  showLegend      bool   上 / 下半年图例显隐     默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide64GroupBars, { defaults, controls } from './Slide64GroupBars.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 赛道组（写死，单位亿美元）：名 / 上半年 h1 / 下半年 h2 / 主色
const XHSGB_GROUPS = [
  { name: '算力基础设施', en: 'COMPUTE', h1: 180, h2: 260, color: '#27E021' },
  { name: '通用大模型', en: 'FOUNDATION', h1: 150, h2: 210, color: '#15A7F0' },
  { name: '应用层', en: 'APPLICATION', h1: 70, h2: 110, color: '#FFC700' },
  { name: '行业垂直', en: 'VERTICAL', h1: 45, h2: 80, color: '#FF9FE2' },
  { name: '数据与工具', en: 'DATA & TOOLS', h1: 30, h2: 55, color: '#27E021' },
];

const XHSGB_H1 = '#3B6FE0'; // 上半年系列色（冷）
const XHSGB_H2 = '#27E021'; // 下半年系列色（暖亮，表增长）

function GbSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE64GROUPBARS_COPY = {
  text001: "半年消长 · H1 vs H2",
  text002: "下半年，",
  text003: "每条赛道都在加速",
  text004: "上半年 H1",
  text005: "下半年 H2",
  text006: "半年消长",
  text007: "柱高为示意比例，数值以柱顶标签为准（单位亿美元）· 报告 3.x · 调研整理",
};
function Slide64GroupBars(props) {
  const {
      copy = SLIDE64GROUPBARS_COPY,
      groupsData = XHSGB_GROUPS,
    columnCount = 5,
    chartVariant = 'group',
    focusEnabled = true,
    focusIndex = 1,
    showValues = true,
    showLegend = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(3, Math.min(5, columnCount));
  const groups = groupsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isTotal = chartVariant === 'total';
  const maxV = Math.max(...groups.map((g) => (isTotal ? g.h1 + g.h2 : Math.max(g.h1, g.h2))));
  const h = (v) => `${Math.max(5, (v / maxV) * 100)}%`;

  return (
    <section className="xhs-base xhsGb-root" data-label="半年对比柱" data-screen-label="半年对比柱"
      style={{ '--c': XHSGB_H2 }}>
      <style>{XHSGB_CSS}</style>

      <header className="xhsGb-head">
        <div className="xhsGb-headL">
          <div className="xhsGb-kicker">{copy.text001}</div>
          <h2 className="xhsGb-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
          </h2>
        </div>
        {showLegend && (
          <div className="xhsGb-legend">
            <span className="xhsGb-lg"><i style={{ background: XHSGB_H1 }} />{copy.text004}</span>
            <span className="xhsGb-lg"><i style={{ background: XHSGB_H2 }} />{copy.text005}</span>
          </div>
        )}
      </header>

      <div className="xhsGb-chart">
        <div className="xhsGb-plot">
          {[75, 50, 25].map((g) => (
            <span key={'gl' + g} className="xhsGb-gl" style={{ bottom: `${g}%` }} aria-hidden="true" />
          ))}
          <div className="xhsGb-groups">
            {groups.map((grp, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              const cls = 'xhsGb-group' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '');
              return (
                <div key={i} className={cls}>
                  <div className="xhsGb-cols">
                    {isTotal ? (
                      <div className="xhsGb-bar is-total" style={{ height: h(grp.h1 + grp.h2), '--bc': grp.color }}>
                        {showValues && <span className="xhsGb-val">{grp.h1 + grp.h2}</span>}
                      </div>
                    ) : (
                      <React.Fragment>
                        <div className="xhsGb-bar is-h1" style={{ height: h(grp.h1), '--bc': XHSGB_H1 }}>
                          {showValues && <span className="xhsGb-val">{grp.h1}</span>}
                        </div>
                        <div className="xhsGb-bar is-h2" style={{ height: h(grp.h2), '--bc': XHSGB_H2 }}>
                          {showValues && <span className="xhsGb-val">{grp.h2}</span>}
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="xhsGb-labels">
          {groups.map((grp, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsGb-xlab' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}>
                <span className="xhsGb-xzh">{grp.name}</span>
                <span className="xhsGb-xen">{grp.en}</span>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="xhsGb-foot">
        <span className="xhsGb-foot-tag">{copy.text006}</span>
        <span className="xhsGb-foot-txt">{copy.text007}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <GbSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <GbSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 120 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSGB_CSS = `
  .xhsGb-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsGb-head{ flex:0 0 auto; margin-bottom:24px; display:flex; align-items:flex-end; justify-content:space-between; gap:30px; }
  .xhsGb-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsGb-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsGb-legend{ display:flex; gap:26px; flex:0 0 auto; padding-bottom:6px; }
  .xhsGb-lg{ display:flex; align-items:center; gap:11px; font-size:21px; font-weight:700; color:#c2c2c2; white-space:nowrap; }
  .xhsGb-lg i{ width:20px; height:20px; border-radius:6px; box-shadow:0 0 12px rgba(255,255,255,.18); }

  .xhsGb-chart{ flex:1 1 auto; min-height:0; position:relative; margin:6px 0 26px; }
  .xhsGb-plot{ position:absolute; left:0; right:0; top:0; bottom:84px; border-bottom:2px solid rgba(255,255,255,.18); }
  .xhsGb-gl{ position:absolute; left:0; right:0; height:1.5px; background:rgba(255,255,255,.05); }
  .xhsGb-groups{ position:absolute; inset:0; display:flex; align-items:flex-end; justify-content:space-around; gap:20px; }
  .xhsGb-group{ flex:1 1 0; min-width:0; height:100%; display:flex; flex-direction:column; justify-content:flex-end;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsGb-group.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsGb-group.is-hot{ transform:translateY(-6px); }
  .xhsGb-cols{ flex:1 1 auto; min-height:0; display:flex; align-items:flex-end; justify-content:center; gap:14px; }

  .xhsGb-bar{ position:relative; width:76px; max-width:30%; border-radius:12px 12px 0 0;
    background:linear-gradient(180deg, color-mix(in srgb, var(--bc) 92%, #fff) 0%, var(--bc) 40%, color-mix(in srgb, var(--bc) 72%, #000) 100%);
    box-shadow:0 0 26px color-mix(in srgb, var(--bc) 30%, transparent), inset 0 2px 0 rgba(255,255,255,.45);
    transition:box-shadow .3s ease; }
  .xhsGb-bar.is-total{ width:118px; }
  .xhsGb-group.is-hot .xhsGb-bar{ box-shadow:0 0 46px color-mix(in srgb, var(--bc) 52%, transparent), inset 0 2px 0 rgba(255,255,255,.55); }
  .xhsGb-val{ position:absolute; left:50%; top:-34px; transform:translateX(-50%);
    font-family:"Space Mono",monospace; font-size:24px; font-weight:700; color:#fff; text-shadow:0 0 14px rgba(0,0,0,.6); }
  .xhsGb-group.is-hot .xhsGb-val{ color:var(--bc); }

  .xhsGb-labels{ position:absolute; left:0; right:0; bottom:0; height:84px; display:flex; justify-content:space-around; gap:20px;
    padding-top:18px; box-sizing:border-box; }
  .xhsGb-xlab{ flex:1 1 0; min-width:0; display:flex; flex-direction:column; align-items:center; gap:5px; text-align:center;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsGb-xlab.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsGb-xzh{ font-size:25px; font-weight:800; color:#e8e8e8; line-height:1.05; }
  .xhsGb-xlab.is-hot .xhsGb-xzh{ color:#fff; }
  .xhsGb-xen{ font-family:"Space Mono",monospace; font-size:14px; letter-spacing:.1em; color:#6f6f6f; }

  .xhsGb-foot{ flex:0 0 auto; display:flex; align-items:center; gap:18px; }
  .xhsGb-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#27E021; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(39,224,33,.4); }
  .xhsGb-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'groupbars',
  label: '半年对比柱',
  Component: Slide64GroupBars,
  defaults: {
      copy: SLIDE64GROUPBARS_COPY,
      groupsData: XHSGB_GROUPS,
    ...hlDefaults,
    columnCount: 5,
    chartVariant: 'group',
    focusEnabled: true,
    focusIndex: 1,
    showValues: true,
    showLegend: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE64GROUPBARS_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'groupsData', type: 'list', label: 'groupsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "en", label: "en" }, { key: "h1", label: "h1" }, { key: "h2", label: "h2" }, { key: "color", label: "color" }], default: XHSGB_GROUPS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'columnCount', type: 'slider', label: '赛道组数', min: 3, max: 5, step: 1, default: 5, desc: '展示的赛道组数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['group', 'total'], optionLabels: ['双柱', '合计'], default: 'group', desc: '上下半年双柱 / 合计单柱' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一赛道组' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 1, maxFromKey: 'columnCount', showIf: (v) => v.focusEnabled, desc: '被高亮赛道的序号' },
    { key: 'showValues', type: 'toggle', label: '柱顶数值', default: true, desc: '柱顶数值标签' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true, desc: '上 / 下半年图例', showIf: (v) => v.chartVariant === 'group' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide64GroupBars.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide64GroupBars;
