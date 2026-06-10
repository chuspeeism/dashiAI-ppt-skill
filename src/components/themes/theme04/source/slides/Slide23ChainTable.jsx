/*
 * Slide23ChainTable — 产业链分层表（表格页 · 上/中/下游 树状层级表）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCt- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  groupCount      number 展示的层级数(上中下游) 默认 3   可选 1–3
 *  focusEnabled    bool   重点层高亮开关         默认 false
 *  focusIndex      number 重点层序号(从1起)      默认 1
 *  showCompanyTags bool   代表公司用标签 / 纯文本 默认 true
 *  showLevelBadge  bool   层级大徽章 + 英文显隐   默认 true
 *  showFlow        bool   层级间向下传导箭头显隐  默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide23ChainTable, { defaults, controls } from './Slide23ChainTable.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 产业链分层（报告第四章树状数据）
const XHSCT_GROUPS = [
  {
    level: '上游', theme: '基础设施', en: 'INFRASTRUCTURE', color: '#FFC700',
    segs: [
      { env: 'AI 芯片', cos: ['Cerebras', 'Groq'] },
      { env: '算力云 / 数据', cos: ['CoreWeave', 'Scale AI'] },
    ],
  },
  {
    level: '中游', theme: '模型层', en: 'MODEL LAYER', color: '#15A7F0',
    segs: [
      { env: '通用大模型', cos: ['OpenAI', 'Anthropic', 'xAI'] },
      { env: '开源 / 专用模型', cos: ['Mistral', 'SSI'] },
    ],
  },
  {
    level: '下游', theme: '应用层', en: 'APPLICATION', color: '#27E021',
    segs: [
      { env: '企业生产力', cos: ['Glean', 'Databricks'] },
      { env: '消费 / 搜索', cos: ['Perplexity AI'] },
      { env: '具身智能 / 机器人', cos: ['Figure AI'] },
    ],
  },
];

function CtSpark({ size = 20, color = '#fff', style }) {
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


const SLIDE23CHAINTABLE_COPY = {
  text001: "产业链分层 · VALUE CHAIN",
  text002: "从",
  text003: "芯片算力",
  text004: "到",
  text005: "终端应用",
  text006: "，三层结构一表读懂",
  text007: "产业层级",
  text008: "细分环节",
  text009: "代表公司",
};
function Slide23ChainTable(props) {
  const {
      copy = SLIDE23CHAINTABLE_COPY,
      groupsData = XHSCT_GROUPS,
    groupCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showCompanyTags = true,
    showLevelBadge = true,
    showFlow = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(1, Math.min(3, groupCount));
  const groups = groupsData.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsCt-root" data-label="产业链分层表" data-screen-label="产业链分层表">
      <style>{XHSCT_CSS}</style>

      <header className="xhsCt-head">
        <div className="xhsCt-kicker">{copy.text001}</div>
        <h2 className="xhsCt-title">{copy.text002}<HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>{copy.text004}<HL color="#27E021" variant={hlStyle} tilt={hlTilt}>{copy.text005}</HL>{copy.text006}</h2>
      </header>

      <div className="xhsCt-table">
        {/* 表头 */}
        <div className="xhsCt-colhead">
          <span className="xhsCt-ch-level">{copy.text007}</span>
          <span className="xhsCt-ch-env">{copy.text008}</span>
          <span className="xhsCt-ch-co">{copy.text009}</span>
        </div>

        {groups.map((g, gi) => {
          const hot = focusEnabled && gi === focus;
          const dim = focusEnabled && gi !== focus;
          return (
            <React.Fragment key={gi}>
              <div className={'xhsCt-band' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': g.color }}>
                <div className="xhsCt-levelCell">
                  <span className="xhsCt-levelBar" />
                  {showLevelBadge ? (
                    <span className="xhsCt-levelTxt">
                      <span className="xhsCt-level">{g.level}</span>
                      <span className="xhsCt-theme">{g.theme}</span>
                      <span className="xhsCt-en">{g.en}</span>
                    </span>
                  ) : (
                    <span className="xhsCt-levelTxt">
                      <span className="xhsCt-level">{g.level} · {g.theme}</span>
                    </span>
                  )}
                </div>

                <div className="xhsCt-segs">
                  {g.segs.map((s, si) => (
                    <div key={si} className="xhsCt-seg">
                      <span className="xhsCt-env">{s.env}</span>
                      <span className="xhsCt-cos">
                        {showCompanyTags
                          ? s.cos.map((c, ci) => <span key={ci} className="xhsCt-tag">{c}</span>)
                          : <span className="xhsCt-cotext">{s.cos.join('、')}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {showFlow && gi < groups.length - 1 && (
                <div className="xhsCt-flow" aria-hidden="true">
                  <span className="xhsCt-arrow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <CtSpark size={24} color="#FF9FE2" style={{ position: 'absolute', right: 96, top: 150 }} />
          <CtSpark size={16} color="#15A7F0" style={{ position: 'absolute', left: 84, bottom: 78 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCT_CSS = `
  .xhsCt-root{ padding:72px 100px 64px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsCt-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsCt-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsCt-title{ margin:0; font-size:52px; font-weight:900; color:#fff; line-height:1.14; }

  .xhsCt-table{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:4px; }

  .xhsCt-colhead{ display:grid; grid-template-columns:360px 1fr; column-gap:30px; padding:0 30px 14px;
    border-bottom:2px solid rgba(255,255,255,.12);
    font-family:"Space Mono",monospace; font-size:20px; letter-spacing:.08em; color:#8a8a8a; font-weight:700; }
  .xhsCt-colhead .xhsCt-ch-env{ display:none; }
  .xhsCt-colhead .xhsCt-ch-co{ display:none; }
  .xhsCt-ch-level{ grid-column:1; }

  .xhsCt-band{ display:grid; grid-template-columns:360px 1fr; column-gap:30px; align-items:stretch;
    padding:22px 30px; border-radius:20px; background:linear-gradient(150deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s; }
  .xhsCt-band.is-dim{ opacity:.42; filter:saturate(.65); }
  .xhsCt-band.is-hot{ border-color:var(--c); transform:scale(1.012);
    background:linear-gradient(150deg, color-mix(in srgb, var(--c) 16%, #151515), #0d0d0d);
    box-shadow:0 0 56px color-mix(in srgb, var(--c) 26%, transparent); }

  .xhsCt-levelCell{ display:flex; align-items:center; gap:22px; }
  .xhsCt-levelBar{ width:16px; height:16px; align-self:center; flex-shrink:0; border-radius:50%; background:var(--c);
    box-shadow:0 0 20px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsCt-levelTxt{ display:flex; flex-direction:column; gap:3px; }
  .xhsCt-level{ font-size:42px; font-weight:900; color:var(--c); line-height:1;
    text-shadow:0 0 22px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCt-theme{ font-size:26px; font-weight:700; color:#e6e6e6; }
  .xhsCt-en{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.1em; color:#6f6f6f; }

  .xhsCt-segs{ display:flex; flex-direction:column; gap:12px; justify-content:center; }
  .xhsCt-seg{ display:grid; grid-template-columns:280px 1fr; align-items:center; column-gap:26px; }
  .xhsCt-env{ font-size:27px; font-weight:700; color:#cfcfcf; }
  .xhsCt-cos{ display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
  .xhsCt-tag{ font-size:23px; font-weight:700; color:#eaeaea; padding:7px 20px; border-radius:999px; white-space:nowrap;
    background:rgba(255,255,255,.06); border:1.5px solid color-mix(in srgb, var(--c) 42%, rgba(255,255,255,.12)); }
  .xhsCt-band.is-hot .xhsCt-tag{ border-color:color-mix(in srgb, var(--c) 70%, transparent);
    background:color-mix(in srgb, var(--c) 14%, rgba(255,255,255,.04)); }
  .xhsCt-cotext{ font-size:24px; font-weight:600; color:#b8b8b8; }

  .xhsCt-flow{ display:flex; justify-content:center; height:4px; position:relative; }
  .xhsCt-arrow{ position:absolute; top:-12px; width:0; height:0;
    border-left:16px solid transparent; border-right:16px solid transparent;
    border-top:18px solid rgba(255,255,255,.32);
    filter:drop-shadow(0 3px 5px rgba(0,0,0,.5)); }
`;

const META = {
  id: 'chaintable',
  label: '产业链分层表',
  Component: Slide23ChainTable,
  defaults: {
      copy: SLIDE23CHAINTABLE_COPY,
      groupsData: XHSCT_GROUPS,
    ...hlDefaults,
    groupCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showCompanyTags: true,
    showLevelBadge: true,
    showFlow: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }], default: SLIDE23CHAINTABLE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'groupsData', type: 'list', label: 'groupsData', itemLabel: '数据', fields: [{ key: "level", label: "level" }, { key: "theme", label: "theme" }, { key: "en", label: "en" }, { key: "color", label: "color" }], default: XHSCT_GROUPS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'groupCount', type: 'slider', label: '层级数量', min: 1, max: 3, step: 1, default: 3, desc: '展示的产业层级数(上中下游)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一层级' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'groupCount', showIf: (v) => v.focusEnabled, desc: '被高亮层级的序号' },
    { key: 'showCompanyTags', type: 'toggle', label: '公司标签', default: true, desc: '代表公司用标签(关) / 纯文本' },
    { key: 'showLevelBadge', type: 'toggle', label: '层级徽章', default: true, desc: '层级大徽章 + 英文' },
    { key: 'showFlow', type: 'toggle', label: '传导箭头', default: true, desc: '层级间向下传导箭头' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide23ChainTable.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide23ChainTable;
