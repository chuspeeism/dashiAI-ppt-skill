/*
 * Slide50Roadmap — 资本三段式（时间轴页 · 升阶路线 Ascending Roadmap）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsRm- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与横向交替轴 Slide12Timeline / 纵向脊柱 Chronicle 互补：阶梯式「升阶路线」——
 * 各阶段坐在逐级抬高的发光基座上（节节攀升），背后巨型描边幽灵编号，读作资本周期的
 * 三段演进。layoutVariant 可切到等高平台（flat）。数据为调研整理（报告 4 结论 · 示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  stepCount       number 展示的阶段数(2–4)     默认 3
 *  layoutVariant   enum   基座形态             默认 'ascend' 可选 'ascend'|'flat'
 *  focusEnabled    bool   重点阶段高亮开关       默认 false
 *  focusIndex      number 重点阶段序号(从1起)   默认 3   范围 1–stepCount
 *  showGhost       bool   背景幽灵编号显隐       默认 true
 *  showBaseline    bool   底部基线显隐          默认 true
 *  showPhrase      bool   阶段金句短语显隐       默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide50Roadmap, { defaults, controls } from './Slide50Roadmap.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 4 个阶段（写死）：时期 / 主题 / 短语 / 描述 / 主色
const XHSRM_STEPS = [
  { tag: '2024 H1', theme: '叙事驱动', phrase: '为愿景下注', desc: '估值跑在收入前面，资本愿意为故事埋单。', color: '#27E021' },
  { tag: '2024 H2', theme: '算力卡位', phrase: '卖铲子的赢', desc: '资金大举涌入算力与云，谁锁住 GPU 谁掌握主动。', color: '#15A7F0' },
  { tag: '2025 起', theme: '兑现为王', phrase: '看 ARR 说话', desc: '能把模型变成真实收入的公司，才留在牌桌上。', color: '#FFC700' },
  { tag: '前瞻', theme: '集中加剧', phrase: '强者通吃', desc: '资金继续向头部、单一赛道与少数枢纽收拢。', color: '#FF9FE2' },
];

function RmSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE50ROADMAP_COPY = {
  text001: "资本节奏 · ROADMAP",
  text002: "一年三步：从赌叙事，到",
  text003: "看兑现",
  text004: "「",
  text005: "」",
  text006: "STEP",
  text007: "节节收窄",
  text008: "资本叙事的重心逐级上移：愿景 → 算力 → 兑现 · 阶段为调研整理（报告 4 结论 / 示意）",
};
function Slide50Roadmap(props) {
  const {
      copy = SLIDE50ROADMAP_COPY,
      stepsData = XHSRM_STEPS,
    stepCount = 3,
    layoutVariant = 'ascend',
    focusEnabled = false,
    focusIndex = 3,
    showGhost = true,
    showBaseline = true,
    showPhrase = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(4, stepCount));
  const steps = stepsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const ped = (i) => (layoutVariant === 'flat' ? 110 : 70 + i * 74); // 基座高度(px)

  return (
    <section className={'xhs-base xhsRm-root' + (showBaseline ? ' has-base' : '')} data-label="资本三段式" data-screen-label="资本三段式">
      <style>{XHSRM_CSS}</style>

      <header className="xhsRm-head">
        <div className="xhsRm-kicker">{copy.text001}</div>
        <h2 className="xhsRm-title">{copy.text002}<HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsRm-stage" style={{ '--n': n }}>
        {steps.map((s, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsRm-col' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')} style={{ '--c': s.color }}>
              <div className="xhsRm-card">
                {showGhost && <span className="xhsRm-ghost">{i + 1}</span>}
                <div className="xhsRm-tag">{s.tag}</div>
                <div className="xhsRm-theme">{s.theme}</div>
                {showPhrase && <div className="xhsRm-phrase">{copy.text004}{s.phrase}{copy.text005}</div>}
                <p className="xhsRm-desc">{s.desc}</p>
              </div>
              <div className="xhsRm-pedestal" style={{ height: ped(i) + 'px' }}>
                <span className="xhsRm-pednum">{copy.text006}{i + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="xhsRm-foot">
        <span className="xhsRm-foot-tag">{copy.text007}</span>
        <span className="xhsRm-foot-txt">{copy.text008}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <RmSpark size={24} color="#27E021" style={{ position: 'absolute', left: 84, top: 152 }} />
          <RmSpark size={15} color="#FF9FE2" style={{ position: 'absolute', right: 96, top: 196 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSRM_CSS = `
  .xhsRm-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsRm-head{ flex:0 0 auto; margin-bottom:18px; }
  .xhsRm-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsRm-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsRm-stage{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--n),1fr); gap:30px; align-items:end; position:relative; }
  .xhsRm-root.has-base .xhsRm-stage::after{ content:''; position:absolute; left:-6px; right:-6px; bottom:0; height:2px;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,.22) 12%, rgba(255,255,255,.22) 88%, transparent); }

  .xhsRm-col{ display:flex; flex-direction:column; justify-content:flex-end; height:100%; min-height:0;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsRm-col.is-dim{ opacity:.42; filter:saturate(.7); }
  .xhsRm-col.is-hot{ transform:translateY(-6px); }

  .xhsRm-card{ position:relative; box-sizing:border-box; border-radius:22px; padding:30px 32px 30px; overflow:hidden;
    border:1.5px solid color-mix(in srgb, var(--c) 38%, rgba(255,255,255,.07));
    background:
      radial-gradient(130% 100% at 12% 0%, color-mix(in srgb, var(--c) 18%, transparent) 0%, transparent 54%),
      linear-gradient(158deg,#161616,#0b0b0b);
    box-shadow:0 20px 48px rgba(0,0,0,.5);
    transition:border-color .3s, box-shadow .3s; }
  .xhsRm-col.is-hot .xhsRm-card{ border-color:var(--c); box-shadow:0 0 56px color-mix(in srgb, var(--c) 26%, transparent); }

  .xhsRm-ghost{ position:absolute; right:14px; top:-18px; font-family:"Space Mono",monospace; font-weight:700; font-size:150px;
    line-height:1; color:transparent; -webkit-text-stroke:2px color-mix(in srgb, var(--c) 30%, transparent);
    pointer-events:none; z-index:0; }
  .xhsRm-tag{ position:relative; z-index:1; font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.06em;
    color:#06140f; background:var(--c); padding:4px 13px; border-radius:8px; align-self:flex-start; display:inline-block;
    box-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsRm-theme{ position:relative; z-index:1; margin-top:16px; font-size:34px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsRm-phrase{ position:relative; z-index:1; margin-top:8px; font-size:24px; font-weight:800; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent); }
  .xhsRm-desc{ position:relative; z-index:1; margin:14px 0 0; font-size:20px; font-weight:500; line-height:1.45; color:#b6b6b6; text-wrap:pretty; }

  .xhsRm-pedestal{ position:relative; margin-top:18px; border-radius:14px 14px 3px 3px; flex-shrink:0;
    background:linear-gradient(180deg, color-mix(in srgb, var(--c) 40%, #0c0c0c) 0%, color-mix(in srgb, var(--c) 16%, #0a0a0a) 100%);
    border:1.5px solid color-mix(in srgb, var(--c) 34%, transparent); border-bottom:none;
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 22%, transparent), inset 0 2px 0 color-mix(in srgb, var(--c) 50%, transparent);
    display:flex; align-items:flex-start; justify-content:center; padding-top:14px; }
  .xhsRm-col.is-hot .xhsRm-pedestal{ box-shadow:0 0 48px color-mix(in srgb, var(--c) 38%, transparent), inset 0 2px 0 color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsRm-pednum{ font-family:"Space Mono",monospace; font-weight:700; font-size:14px; letter-spacing:.12em; color:color-mix(in srgb, var(--c) 70%, #fff); }

  /* ── 页脚 ── */
  .xhsRm-foot{ flex:0 0 auto; margin-top:24px; display:flex; align-items:center; gap:18px; }
  .xhsRm-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#FFC700; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(255,199,0,.4); }
  .xhsRm-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'roadmap',
  label: '资本三段式',
  Component: Slide50Roadmap,
  defaults: {
      copy: SLIDE50ROADMAP_COPY,
      stepsData: XHSRM_STEPS,
    ...hlDefaults,
    stepCount: 3,
    layoutVariant: 'ascend',
    focusEnabled: false,
    focusIndex: 3,
    showGhost: true,
    showBaseline: true,
    showPhrase: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }], default: SLIDE50ROADMAP_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'stepsData', type: 'list', label: 'stepsData', itemLabel: '数据', fields: [{ key: "tag", label: "tag" }, { key: "theme", label: "theme" }, { key: "phrase", label: "phrase" }, { key: "desc", label: "desc" }, { key: "color", label: "color" }], default: XHSRM_STEPS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'stepCount', type: 'slider', label: '阶段数', min: 2, max: 4, step: 1, default: 3, desc: '展示的阶段数量' },
    { key: 'layoutVariant', type: 'radio', label: '基座形态', options: ['ascend', 'flat'], optionLabels: ['升阶', '等高'], default: 'ascend', desc: '逐级抬高 / 等高平台' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一阶段' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 3, maxFromKey: 'stepCount', showIf: (v) => v.focusEnabled, desc: '被高亮阶段的序号' },
    { key: 'showGhost', type: 'toggle', label: '幽灵编号', default: true, desc: '背景巨型描边编号显隐' },
    { key: 'showBaseline', type: 'toggle', label: '底部基线', default: true, desc: '阶梯底部基线显隐' },
    { key: 'showPhrase', type: 'toggle', label: '阶段金句', default: true, desc: '阶段金句短语显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide50Roadmap.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide50Roadmap;
