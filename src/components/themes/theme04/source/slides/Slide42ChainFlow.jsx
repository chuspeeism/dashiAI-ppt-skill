/*
 * Slide42ChainFlow — 产业链分层·流向（表格/结构页 · 三层神经霓虹band + 资本占比）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCf- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 是 Slide23ChainTable 的「按全 deck 风格重做版」：每一层是一张暗色霓虹卡片
 * （色调渐变底 + 发光左光条 + 描边辉光，同 Ranking/Region 的卡片语言），
 * 公司用「软霓虹芯片」（带发光圆点），右栏补「资本占比」大数字 + 进度条填满版面。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  groupCount       number 展示的产业层数      默认 3   可选 1–3
 *  focusEnabled     bool   重点层高亮开关        默认 false
 *  focusIndex       number 重点层序号(从1起)    默认 2   范围 1–groupCount
 *  showShareBar     bool   右栏资本占比显隐       默认 true
 *  showCompanyTags  bool   公司芯片显隐(关=纯文本) 默认 true
 *  showLevelBadge   bool   层级大徽章显隐         默认 true
 *  showFlow         bool   层级间传导箭头         默认 true
 *  showDecorations  bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide42ChainFlow, { defaults, controls } from './Slide42ChainFlow.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSCF_LAYERS = [
  {
    tier: '上游', cn: '基础设施', en: 'INFRASTRUCTURE', color: '#FFC700', share: 30,
    cats: [
      { name: 'AI 芯片', firms: ['Cerebras', 'Groq'] },
      { name: '算力云 / 数据', firms: ['CoreWeave', 'Scale AI'] },
    ],
  },
  {
    tier: '中游', cn: '模型层', en: 'MODEL LAYER', color: '#15A7F0', share: 55,
    cats: [
      { name: '通用大模型', firms: ['OpenAI', 'Anthropic', 'xAI'] },
      { name: '开源 / 专用模型', firms: ['Mistral', 'SSI'] },
    ],
  },
  {
    tier: '下游', cn: '应用层', en: 'APPLICATION', color: '#27E021', share: 15,
    cats: [
      { name: '企业生产力', firms: ['Glean', 'Databricks'] },
      { name: '消费 / 搜索', firms: ['Perplexity AI'] },
      { name: '具身智能 / 机器人', firms: ['Figure AI'] },
    ],
  },
];

function CfSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE42CHAINFLOW_COPY = {
  text001: "产业链分层 · VALUE CHAIN",
  text002: "一条产业链，",
  text003: "钱主要压在中游",
  text004: "%",
  text005: "资本占比",
};
function Slide42ChainFlow(props) {
  const {
      copy = SLIDE42CHAINFLOW_COPY,
      layersData = XHSCF_LAYERS,
    groupCount = 3,
    focusEnabled = false,
    focusIndex = 2,
    showShareBar = true,
    showCompanyTags = true,
    showLevelBadge = true,
    showFlow = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const gc = Math.max(1, Math.min(3, groupCount));
  const layers = layersData.slice(0, gc);
  const focus = Math.max(1, Math.min(gc, focusIndex)) - 1;
  const maxShare = Math.max.apply(null, layers.map((l) => l.share));

  return (
    <section className="xhs-base xhsCf-root" data-label="产业链分层·流向" data-screen-label="产业链分层·流向">
      <style>{XHSCF_CSS}</style>

      <header className="xhsCf-head">
        <div className="xhsCf-kicker">{copy.text001}</div>
        <h2 className="xhsCf-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsCf-stack">
        {layers.map((l, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <React.Fragment key={i}>
              <div className={'xhsCf-layer' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': l.color }}>
                {showLevelBadge && (
                  <div className="xhsCf-tier">
                    <span className="xhsCf-tier-name">{l.tier}</span>
                    <span className="xhsCf-tier-cn">{l.cn}</span>
                    <span className="xhsCf-tier-en">{l.en}</span>
                  </div>
                )}

                <div className="xhsCf-cats">
                  {l.cats.map((c, ci) => (
                    <div key={ci} className="xhsCf-cat">
                      <span className="xhsCf-catname">{c.name}</span>
                      <div className="xhsCf-chips">
                        {c.firms.map((f, fi) => (
                          showCompanyTags ? (
                            <span key={fi} className="xhsCf-chip">
                              <span className="xhsCf-chipdot" aria-hidden="true" />{f}
                            </span>
                          ) : (
                            <span key={fi} className="xhsCf-firmtxt">{f}{fi < c.firms.length - 1 ? ' · ' : ''}</span>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {showShareBar && (
                  <div className="xhsCf-share">
                    <div className="xhsCf-share-pct">{l.share}<i>{copy.text004}</i></div>
                    <div className="xhsCf-share-label">{copy.text005}</div>
                    <div className="xhsCf-share-track">
                      <span className="xhsCf-share-fill" style={{ width: (l.share / maxShare * 100) + '%' }} />
                    </div>
                  </div>
                )}
              </div>

              {showFlow && i < layers.length - 1 && (
                <div className="xhsCf-flow" aria-hidden="true">
                  <svg width="34" height="20" viewBox="0 0 34 20"><path d="M2 2 L17 16 L32 2" fill="none" stroke="#5a5a5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <CfSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 100, top: 150 }} />
          <CfSpark size={16} color="#27E021" style={{ position: 'absolute', left: 80, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCF_CSS = `
  .xhsCf-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsCf-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsCf-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsCf-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsCf-stack{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:6px; }

  .xhsCf-layer{ position:relative; flex:1 1 0; min-height:0; display:grid; align-items:center;
    grid-template-columns:300px 1fr 240px; gap:40px; overflow:hidden;
    padding:22px 40px; border-radius:22px;
    background:linear-gradient(120deg, color-mix(in srgb, var(--c) 16%, #131313), #0f0f0f 64%);
    border:1.5px solid color-mix(in srgb, var(--c) 36%, transparent);
    transition:opacity .3s ease, filter .3s ease, border-color .3s, box-shadow .3s; }
  .xhsCf-layer.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCf-layer.is-hot{ border-color:var(--c); box-shadow:0 0 56px color-mix(in srgb, var(--c) 24%, transparent); }

  /* 左：层级大徽章 */
  .xhsCf-tier{ display:flex; flex-direction:column; gap:2px; }
  .xhsCf-tier-name{ font-size:50px; font-weight:900; color:var(--c); line-height:1;
    text-shadow:0 0 30px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsCf-tier-cn{ font-size:26px; font-weight:800; color:#fff; margin-top:8px; }
  .xhsCf-tier-en{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.14em; color:#7c7c7c; }

  /* 中：分类 + 公司芯片 */
  .xhsCf-cats{ display:flex; flex-direction:column; gap:14px; min-width:0; }
  .xhsCf-cat{ display:flex; align-items:center; gap:24px; min-width:0; }
  .xhsCf-catname{ flex:0 0 200px; font-size:24px; font-weight:700; color:#cdcdcd; }
  .xhsCf-chips{ display:flex; flex-wrap:wrap; gap:10px; min-width:0; }
  .xhsCf-chip{ display:inline-flex; align-items:center; gap:9px; padding:7px 18px; border-radius:999px;
    font-size:22px; font-weight:700; color:#fff; white-space:nowrap;
    background:color-mix(in srgb, var(--c) 18%, #0c0c0c);
    border:1.5px solid color-mix(in srgb, var(--c) 46%, transparent); }
  .xhsCf-chipdot{ width:10px; height:10px; border-radius:50%; background:var(--c);
    box-shadow:0 0 12px color-mix(in srgb, var(--c) 75%, transparent); }
  .xhsCf-firmtxt{ font-size:23px; font-weight:700; color:#dcdcdc; }

  /* 右：资本占比 */
  .xhsCf-share{ display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
  .xhsCf-share-pct{ font-family:"Space Mono",monospace; font-size:60px; font-weight:700; line-height:.9; color:var(--c);
    text-shadow:0 0 26px color-mix(in srgb, var(--c) 38%, transparent); }
  .xhsCf-share-pct i{ font-style:normal; font-size:28px; font-weight:700; margin-left:3px; }
  .xhsCf-share-label{ font-size:18px; font-weight:600; color:#8a8a8a; }
  .xhsCf-share-track{ width:100%; height:12px; border-radius:999px; background:#191919; overflow:hidden; border:1px solid rgba(255,255,255,.06); }
  .xhsCf-share-fill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 65%, #000), var(--c));
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 36%, transparent), inset 0 1px 0 rgba(255,255,255,.35); }

  /* 层级间传导箭头 */
  .xhsCf-flow{ flex:0 0 auto; display:flex; align-items:center; justify-content:center; height:14px; }
`;

const META = {
  id: 'chainflow',
  label: '产业链分层·流向',
  Component: Slide42ChainFlow,
  defaults: {
      copy: SLIDE42CHAINFLOW_COPY,
      layersData: XHSCF_LAYERS,
    ...hlDefaults,
    groupCount: 3,
    focusEnabled: false,
    focusIndex: 2,
    showShareBar: true,
    showCompanyTags: true,
    showLevelBadge: true,
    showFlow: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }], default: SLIDE42CHAINFLOW_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'layersData', type: 'list', label: 'layersData', itemLabel: '数据', fields: [{ key: "tier", label: "tier" }, { key: "cn", label: "cn" }, { key: "en", label: "en" }, { key: "color", label: "color" }, { key: "share", label: "share" }], default: XHSCF_LAYERS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'groupCount', type: 'slider', label: '产业层数', min: 1, max: 3, step: 1, default: 3, desc: '展示的产业层级数（上中下游）' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一层级' },
    { key: 'focusIndex', type: 'slider', label: '重点层序号', min: 1, max: 3, step: 1, default: 2, maxFromKey: 'groupCount', showIf: (v) => v.focusEnabled, desc: '被高亮层级的序号' },
    { key: 'showShareBar', type: 'toggle', label: '资本占比', default: true, desc: '右栏资本占比大数字 + 进度条' },
    { key: 'showCompanyTags', type: 'toggle', label: '公司芯片', default: true, desc: '公司用霓虹芯片（关=纯文本）' },
    { key: 'showLevelBadge', type: 'toggle', label: '层级徽章', default: true, desc: '层级大徽章 + 英文' },
    { key: 'showFlow', type: 'toggle', label: '传导箭头', default: true, desc: '层级间向下传导箭头' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide42ChainFlow.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide42ChainFlow;
