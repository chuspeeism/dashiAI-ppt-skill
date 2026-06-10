/*
 * Slide43Treemap — 资金版图（图表页 · 矩形树图 Treemap / 横向柱状双模）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsTm- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 新图表类型：按赛道资金额绘制矩形树图（面积 ∝ 融资额），用嵌套 flex 的 flex-grow
 * 让各瓷砖面积按数值自动分配（grow = value）；chartVariant 可切到横向柱状对照。
 * 报告 3.1「行业赛道融资额占比」原文即建议「树状图 / 矩形树图（Treemap）」。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  segmentCount    number 展示的赛道瓷砖数(2–5)  默认 5
 *  chartVariant    enum   编码方式            默认 'treemap' 可选 'treemap'|'bar'
 *  focusEnabled    bool   重点赛道高亮开关      默认 true
 *  focusIndex      number 重点赛道序号(从1起)  默认 1   范围 1–segmentCount
 *  showShare       bool   瓷砖内占比百分比显隐   默认 true
 *  showTotal       bool   角落总额徽标显隐      默认 true
 *  showDecorations bool   星芒等点缀显隐        默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide43Treemap, { defaults, controls } from './Slide43Treemap.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 5 个赛道（写死，报告 3.1）：名称 / 英文 / 融资额(亿) / 占比 / 主色 / 注脚
const XHSTM_SEG = [
  { zh: '通用大模型', en: 'FOUNDATION MODEL', val: 420, pct: '43.3%', color: '#27E021', note: '押注 AGI 叙事' },
  { zh: '垂直应用', en: 'VERTICAL AI', val: 245, pct: '25.3%', color: '#FF9FE2', note: '寻找商业化路径' },
  { zh: 'AI 基础设施', en: 'INFRASTRUCTURE', val: 158, pct: '16.3%', color: '#15A7F0', note: '“卖铲子”逻辑' },
  { zh: 'AI 芯片', en: 'HARDWARE', val: 97, pct: '10.0%', color: '#FFC700', note: '算力上游' },
  { zh: '其他', en: 'TOOLING · SAFETY', val: 50, pct: '5.1%', color: '#9aa0a6', note: '工具链 / 安全' },
];

function TmSpark({ size = 22, color = '#fff', style }) {
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

// 单块瓷砖
function TmTile({ seg, idx, focusEnabled, focus, showShare, sizeClass, unitLabel = '亿' }) {
  const hot = focusEnabled && idx === focus;
  const dim = focusEnabled && idx !== focus;
  return (
    <div
      className={'xhsTm-tile ' + sizeClass + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
      style={{ '--c': seg.color, flexGrow: seg.val }}>
      <div className="xhsTm-tile-top">
        <span className="xhsTm-dot" aria-hidden="true" />
        <span className="xhsTm-en">{seg.en}</span>
      </div>
      <div className="xhsTm-tile-body">
        <div className="xhsTm-zh">{seg.zh}</div>
        <div className="xhsTm-val">{seg.val}<span className="xhsTm-unit">{unitLabel}</span></div>
      </div>
      <div className="xhsTm-tile-foot">
        {showShare && <span className="xhsTm-pct">{seg.pct}</span>}
        <span className="xhsTm-note">{seg.note}</span>
      </div>
    </div>
  );
}


const SLIDE43TREEMAP_COPY = {
  text001: "资金版图 · FUNDING MAP",
  text002: "赛道版图：通用大模型",
  text003: "独占四成",
  text004: "亿",
  text005: "全年合计",
  text006: "亿美元",
  text007: "面积 / 长度 ∝ 赛道融资额 · 数据为调研整理（报告 3.1）",
};
function Slide43Treemap(props) {
  const {
      copy = SLIDE43TREEMAP_COPY,
      segData = XHSTM_SEG,
    segmentCount = 5,
    chartVariant = 'treemap',
    focusEnabled = true,
    focusIndex = 1,
    showShare = true,
    showTotal = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(5, segmentCount));
  const segs = segData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isBar = chartVariant === 'bar';
  const total = segs.reduce((s, x) => s + x.val, 0);
  const maxVal = Math.max.apply(null, segs.map((s) => s.val));

  // treemap：A = 第1块独占左列；右列 B 纵向叠：B1=第2块；B2 横向：第3块 | 右子列(第4块/第5块叠)
  const tileProps = { focusEnabled, focus, showShare, unitLabel: copy.text004 };

  return (
    <section className="xhs-base xhsTm-root" data-label="资金版图" data-screen-label="资金版图">
      <style>{XHSTM_CSS}</style>

      <header className="xhsTm-head">
        <div className="xhsTm-kicker">{copy.text001}</div>
        <h2 className="xhsTm-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      {!isBar ? (
        <div className="xhsTm-map">
          {segs[0] && <TmTile seg={segs[0]} idx={0} sizeClass="is-xl" {...tileProps} />}
          <div className="xhsTm-col xhsTm-colB">
            {segs[1] && <TmTile seg={segs[1]} idx={1} sizeClass="is-lg" {...tileProps} />}
            <div className="xhsTm-row xhsTm-rowB2">
              {segs[2] && <TmTile seg={segs[2]} idx={2} sizeClass="is-md" {...tileProps} />}
              <div className="xhsTm-col xhsTm-colC">
                {segs[3] && <TmTile seg={segs[3]} idx={3} sizeClass="is-sm" {...tileProps} />}
                {segs[4] && <TmTile seg={segs[4]} idx={4} sizeClass="is-sm" {...tileProps} />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="xhsTm-bars">
          {segs.map((seg, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsTm-barrow' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')} style={{ '--c': seg.color }}>
                <div className="xhsTm-barhead">
                  <span className="xhsTm-zh">{seg.zh}</span>
                  <span className="xhsTm-en">{seg.en}</span>
                </div>
                <div className="xhsTm-bartrack">
                  <div className="xhsTm-barfill" style={{ width: (seg.val / maxVal) * 100 + '%' }}>
                    <span className="xhsTm-barval">{seg.val}<span className="xhsTm-unit">{copy.text004}</span></span>
                  </div>
                </div>
                {showShare && <span className="xhsTm-barpct">{seg.pct}</span>}
              </div>
            );
          })}
        </div>
      )}

      <footer className="xhsTm-foot">
        {showTotal && (
          <div className="xhsTm-total">
            <span className="xhsTm-total-k">{copy.text005}</span>
            <span className="xhsTm-total-v">{total}<i>{copy.text006}</i></span>
          </div>
        )}
        <div className="xhsTm-caption">{copy.text007}</div>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <TmSpark size={24} color="#FF9FE2" style={{ position: 'absolute', right: 92, top: 150 }} />
          <TmSpark size={15} color="#15A7F0" style={{ position: 'absolute', left: 78, bottom: 96 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSTM_CSS = `
  .xhsTm-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsTm-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsTm-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsTm-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  /* ── 矩形树图 ── */
  .xhsTm-map{ flex:1 1 auto; min-height:0; display:flex; gap:16px; }
  .xhsTm-col{ display:flex; flex-direction:column; gap:16px; min-width:0; min-height:0; }
  .xhsTm-row{ display:flex; gap:16px; min-width:0; min-height:0; }
  .xhsTm-colB{ flex-grow:567; flex-basis:0; }
  .xhsTm-rowB2{ flex-grow:314; flex-basis:0; }
  .xhsTm-colC{ flex-grow:151; flex-basis:0; }
  .xhsTm-col:empty, .xhsTm-row:empty{ display:none; }

  .xhsTm-tile{ position:relative; flex-basis:0; min-width:0; min-height:0; box-sizing:border-box;
    container-type:size;
    display:flex; flex-direction:column; justify-content:space-between; overflow:hidden;
    border-radius:22px; padding:24px 26px; border:1.5px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,.08));
    background:
      radial-gradient(130% 120% at 16% 8%, color-mix(in srgb, var(--c) 30%, transparent) 0%, transparent 56%),
      linear-gradient(158deg,#161616,#0b0b0b);
    box-shadow:0 18px 44px rgba(0,0,0,.46), inset 0 0 0 1px rgba(255,255,255,.02);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsTm-tile.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsTm-tile.is-hot{ border-color:var(--c); transform:scale(1.014);
    box-shadow:0 0 56px color-mix(in srgb, var(--c) 28%, transparent); z-index:2; }

  .xhsTm-tile-top{ display:flex; align-items:center; gap:10px; min-width:0; }
  .xhsTm-dot{ width:11px; height:11px; border-radius:50%; background:var(--c); flex-shrink:0;
    box-shadow:0 0 14px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsTm-en{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.1em; color:#9a9a9a; white-space:nowrap;
    overflow:hidden; text-overflow:ellipsis; }

  .xhsTm-tile-body{ display:flex; flex-direction:column; gap:4px; }
  .xhsTm-zh{ font-size:36px; font-weight:900; color:#fff; line-height:1.05; }
  .xhsTm-val{ font-family:"Space Mono",monospace; font-weight:700; font-size:48px; line-height:.95; color:var(--c);
    display:flex; align-items:baseline; text-shadow:0 0 26px color-mix(in srgb, var(--c) 34%, transparent); }
  .xhsTm-unit{ font-size:.46em; font-weight:700; margin-left:4px; color:#cfcfcf; }

  .xhsTm-tile-foot{ display:flex; align-items:baseline; gap:14px; min-width:0; }
  .xhsTm-pct{ font-family:"Space Mono",monospace; font-weight:700; font-size:22px; color:#fff; }
  .xhsTm-note{ font-size:17px; font-weight:500; color:#9a9a9a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  /* 大瓷砖加大字号；小瓷砖收紧 */
  .xhsTm-tile.is-xl{ flex-grow:433; padding:34px 36px; }
  .xhsTm-tile.is-xl .xhsTm-zh{ font-size:60px; }
  .xhsTm-tile.is-xl .xhsTm-val{ font-size:96px; }
  .xhsTm-tile.is-xl .xhsTm-en{ font-size:18px; }
  .xhsTm-tile.is-xl .xhsTm-pct{ font-size:30px; }
  .xhsTm-tile.is-xl .xhsTm-note{ font-size:20px; }
  .xhsTm-tile.is-lg .xhsTm-zh{ font-size:42px; }
  .xhsTm-tile.is-lg .xhsTm-val{ font-size:58px; }
  .xhsTm-tile.is-sm{ padding:18px 20px; border-radius:18px; }
  .xhsTm-tile.is-sm .xhsTm-zh{ font-size:27px; }
  .xhsTm-tile.is-sm .xhsTm-val{ font-size:34px; }
  .xhsTm-tile.is-sm .xhsTm-en{ font-size:13px; }
  .xhsTm-tile.is-sm .xhsTm-pct{ font-size:18px; }
  .xhsTm-tile.is-sm .xhsTm-note{ font-size:14px; }

  /* 矮瓷砖自适应：高度不足时改为横向排版，避免堆叠拥挤（容器查询钉在每块瓷砖） */
  @container (max-height: 168px){
    .xhsTm-tile{ flex-direction:row; align-items:center; gap:20px; padding:18px 24px; }
    .xhsTm-tile-top{ flex-direction:column; align-items:flex-start; gap:5px; flex-shrink:0; max-width:42%; }
    .xhsTm-tile-body{ flex-direction:row; align-items:baseline; gap:14px; flex:1 1 auto; min-width:0; }
    .xhsTm-tile-body .xhsTm-zh{ font-size:30px; white-space:nowrap; }
    .xhsTm-tile-body .xhsTm-val{ font-size:34px; }
    .xhsTm-tile-foot{ flex-direction:column; align-items:flex-end; gap:3px; text-align:right; flex-shrink:0; }
  }

  /* ── 横向柱状对照 ── */
  .xhsTm-bars{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:22px; }
  .xhsTm-barrow{ display:grid; grid-template-columns:300px 1fr 92px; align-items:center; gap:26px;
    transition:opacity .3s, filter .3s; }
  .xhsTm-barrow.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsTm-barhead{ display:flex; flex-direction:column; gap:3px; min-width:0; }
  .xhsTm-barhead .xhsTm-zh{ font-size:32px; }
  .xhsTm-barhead .xhsTm-en{ font-size:14px; }
  .xhsTm-bartrack{ height:54px; border-radius:14px; background:linear-gradient(180deg,#141414,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.06); overflow:hidden; }
  .xhsTm-barfill{ height:100%; border-radius:12px; display:flex; align-items:center; justify-content:flex-end; padding-right:18px; min-width:140px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 36%, #0c0c0c), var(--c));
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 36%, transparent), inset 0 2px 0 rgba(255,255,255,.3); }
  .xhsTm-barval{ font-family:"Space Mono",monospace; font-weight:700; font-size:28px; color:#06140f; }
  .xhsTm-barrow.is-hot .xhsTm-bartrack{ border-color:var(--c); box-shadow:0 0 40px color-mix(in srgb, var(--c) 26%, transparent); }
  .xhsTm-barpct{ font-family:"Space Mono",monospace; font-weight:700; font-size:26px; color:var(--c); text-align:right; }

  /* ── 页脚 ── */
  .xhsTm-foot{ flex:0 0 auto; margin-top:22px; display:flex; align-items:center; justify-content:space-between; gap:30px; }
  .xhsTm-total{ display:flex; align-items:baseline; gap:14px; }
  .xhsTm-total-k{ font-family:"Space Mono",monospace; font-size:18px; letter-spacing:.06em; color:#8a8a8a; }
  .xhsTm-total-v{ font-family:"Space Mono",monospace; font-weight:700; font-size:38px; color:#fff; display:flex; align-items:baseline; }
  .xhsTm-total-v i{ font-style:normal; font-size:18px; color:#9a9a9a; margin-left:6px; }
  .xhsTm-caption{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; text-align:right; }
`;

const META = {
  id: 'treemap',
  label: '资金版图',
  Component: Slide43Treemap,
  defaults: {
      copy: SLIDE43TREEMAP_COPY,
      segData: XHSTM_SEG,
    ...hlDefaults,
    segmentCount: 5,
    chartVariant: 'treemap',
    focusEnabled: true,
    focusIndex: 1,
    showShare: true,
    showTotal: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE43TREEMAP_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'segData', type: 'list', label: 'segData', itemLabel: '数据', fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "val", label: "val" }, { key: "pct", label: "pct" }, { key: "color", label: "color" }, { key: "note", label: "note" }], default: XHSTM_SEG, desc: '默认数据内容' },
    ...hlControls,
    { key: 'segmentCount', type: 'slider', label: '赛道瓷砖', min: 2, max: 5, step: 1, default: 5, desc: '展示的赛道瓷砖数' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['treemap', 'bar'], optionLabels: ['矩形树图', '横向柱'], default: 'treemap', desc: '矩形树图 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一赛道' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 1, maxFromKey: 'segmentCount', showIf: (v) => v.focusEnabled, desc: '被高亮赛道的序号' },
    { key: 'showShare', type: 'toggle', label: '占比百分比', default: true, desc: '瓷砖 / 柱尾占比显隐' },
    { key: 'showTotal', type: 'toggle', label: '合计徽标', default: true, desc: '页脚总额显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide43Treemap.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide43Treemap;
