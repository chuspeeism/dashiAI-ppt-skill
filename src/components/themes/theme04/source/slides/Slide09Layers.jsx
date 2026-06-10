/*
 * Slide09Layers — 产业链分层透视（上游 / 中游 / 下游）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsLy- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  layerCount       number 展示层数            默认 3   可选 1–3
 *  focusEnabled     bool   重点突出开关         默认 false
 *  focusIndex       number 重点层序号(从1起)    默认 1   范围 1–layerCount
 *  showSegments     bool   细分环节显隐         默认 true
 *  showTags         bool   代表公司标签显隐      默认 true
 *  showDecorations  bool   装饰元素显隐         默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide09Layers, { defaults, controls } from './Slide09Layers.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSLY_LAYERS = [
  {
    tier: '上游 · 基础设施', en: 'UPSTREAM', color: '#15A7F0', note: '确定性最强 ·「卖铲子」',
    segments: [
      { name: 'AI 芯片', comps: ['Cerebras', 'Groq'] },
      { name: '算力云 / 数据', comps: ['CoreWeave', 'Scale AI'] },
    ],
  },
  {
    tier: '中游 · 模型层', en: 'MIDSTREAM', color: '#27E021', note: '竞争最激烈 · 兵家必争',
    segments: [
      { name: '通用大模型', comps: ['OpenAI', 'Anthropic', 'xAI'] },
      { name: '开源 / 专用', comps: ['Mistral', 'SSI'] },
    ],
  },
  {
    tier: '下游 · 应用层', en: 'DOWNSTREAM', color: '#FFC700', note: '潜力最大 · 待验证',
    segments: [
      { name: '企业生产力', comps: ['Glean', 'Databricks'] },
      { name: '消费搜索 · 具身', comps: ['Perplexity', 'Figure AI'] },
    ],
  },
];

function LySpark({ size = 20, color = '#fff', style }) {
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

function Slide09Layers(props) {
  const {
    layerCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showSegments = true,
    showTags = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '产业链分层 · 上 → 中 → 下游',
    titleLead = '越往',
    titleKeyword = '上游',
    titleTail = '越确定，越往下游越有想象',
    // 数据
    layers = XHSLY_LAYERS,
  } = props;

  const src = Array.isArray(layers) ? layers : XHSLY_LAYERS;
  const count = Math.max(1, Math.min(src.length, layerCount));
  const shown = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsLy-root" data-label="产业链分层">
      <style>{XHSLY_CSS}</style>

      <header className="xhsLy-head">
        <div className="xhsLy-kicker">{kicker}</div>
        <h2 className="xhsLy-title">
          <span>{titleLead}</span>
          <HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
          <span>{titleTail}</span>
        </h2>
      </header>

      <div className="xhsLy-stack">
        {shown.map((ly, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div
              key={i}
              className={'xhsLy-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': ly.color }}
            >
              <div className="xhsLy-label">
                <span className="xhsLy-en">{ly.en}</span>
                <span className="xhsLy-tier">{ly.tier}</span>
                <span className="xhsLy-note">{ly.note}</span>
              </div>
              {showSegments && (
                <div className="xhsLy-segs">
                  {ly.segments.map((sg, k) => (
                    <div className="xhsLy-seg" key={k}>
                      <span className="xhsLy-segname">{sg.name}</span>
                      {showTags && (
                        <div className="xhsLy-tags">
                          {sg.comps.map((c, j) => (
                            <span key={j} className="xhsLy-tag">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 120, top: 210, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <LySpark size={24} color="#27E021" style={{ position: 'absolute', right: 120, top: 128 }} />
          <LySpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 76, bottom: 64 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSLY_CSS = `
  .xhsLy-root{ padding:80px 110px 64px; position:relative; display:flex; flex-direction:column; }
  .xhsLy-head{ margin-bottom:34px; }
  .xhsLy-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:18px; }
  .xhsLy-title{ margin:0; display:flex; align-items:center; gap:18px; flex-wrap:wrap; font-size:52px; font-weight:900; color:#fff; }

  .xhsLy-stack{ flex:1; display:flex; flex-direction:column; gap:24px; justify-content:center; }
  .xhsLy-row{ display:flex; align-items:stretch; gap:34px; border-radius:22px; padding:30px 38px;
    background:linear-gradient(120deg, color-mix(in srgb, var(--c) 16%, #121212) 0%, #0f0f0f 60%);
    border:1.5px solid color-mix(in srgb, var(--c) 36%, transparent); position:relative; overflow:hidden;
    transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease, box-shadow .3s ease; }
  .xhsLy-row.is-dim{ opacity:.44; filter:saturate(.7); }
  .xhsLy-row.is-hot{ transform:scale(1.02); border-color:var(--c);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 30%, transparent); }

  .xhsLy-label{ width:300px; flex-shrink:0; display:flex; flex-direction:column; gap:7px; justify-content:center; }
  .xhsLy-en{ font-family:"Space Mono",monospace; font-size:20px; font-weight:700; letter-spacing:.18em; color:var(--c); }
  .xhsLy-tier{ font-size:36px; font-weight:900; color:#fff; line-height:1.05; }
  .xhsLy-note{ font-size:20px; font-weight:600; color:#9a9a9a; }

  .xhsLy-segs{ flex:1; display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:stretch; }
  .xhsLy-seg{ background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:16px;
    padding:20px 24px; display:flex; flex-direction:column; gap:14px; }
  .xhsLy-segname{ font-size:25px; font-weight:800; color:#eaeaea; }
  .xhsLy-tags{ display:flex; flex-wrap:wrap; gap:10px; }
  .xhsLy-tag{ font-size:19px; font-weight:700; color:#000; background:var(--c); padding:6px 16px;
    border-radius:999px; white-space:nowrap; box-shadow:inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }
`;

const META = {
  id: 'layers',
  label: '产业链分层',
  Component: Slide09Layers,
  defaults: {
    ...hlDefaults,
    layerCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showSegments: true,
    showTags: true,
    showDecorations: true,
    kicker: '产业链分层 · 上 → 中 → 下游',
    titleLead: '越往',
    titleKeyword: '上游',
    titleTail: '越确定，越往下游越有想象',
    layers: XHSLY_LAYERS,
  },
  controls: [
    ...hlControls,
    { key: 'layerCount', type: 'slider', label: '展示层数', min: 1, max: 3, step: 1, default: 3, desc: '展示的产业链层数(上→中→下游)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一层' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'layerCount', showIf: (v) => v.focusEnabled, desc: '被高亮层的序号' },
    { key: 'showSegments', type: 'toggle', label: '细分环节', default: true, desc: '每层的细分环节卡' },
    { key: 'showTags', type: 'toggle', label: '公司标签', default: true, desc: '代表公司标签' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '产业链分层 · 上 → 中 → 下游', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '越往', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '上游', desc: '高亮关键词' },
    { key: 'titleTail', type: 'text', label: '标题后半', default: '越确定，越往下游越有想象', desc: '关键词后文' },
    { type: 'section', label: '数据 · 分层' },
    {
      key: 'layers', type: 'list', label: '产业层', itemLabel: '层', countFromKey: 'layerCount',
      fields: [{ key: 'tier', label: '层名' }, { key: 'en', label: '英文' }, { key: 'note', label: '注释' }, { key: 'color', label: '颜色' }],
      default: XHSLY_LAYERS, desc: '产业层：层名 / 英文 / 注释 / 颜色（细分 segments 在 defaults 中）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide09Layers.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide09Layers;
