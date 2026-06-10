/*
 * Slide11RiskChain — 风险传导链条（多链路 + 箭头流向）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsRc- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  chainCount       number 传导链数量         默认 3   可选 1–3
 *  focusEnabled     bool   重点突出开关         默认 false
 *  focusIndex       number 重点链序号(从1起)    默认 1   范围 1–chainCount
 *  showArrows       bool   箭头连接显隐         默认 true
 *  showOutcome      bool   末端结果强调显隐      默认 true
 *  showDecorations  bool   装饰元素显隐         默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide11RiskChain, { defaults, controls } from './Slide11RiskChain.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSRC_CHAINS = [
  {
    label: '估值泡沫', color: '#FF2442',
    nodes: ['高估值泡沫', '盈利模式未验证', '烧钱速度过快', '资本耐心耗尽'],
    outcome: '估值回调 · 倒闭潮',
  },
  {
    label: '监管压力', color: '#FFC700',
    nodes: ['监管收紧', 'AI 安全法案', '合规成本激增'],
    outcome: '不确定性升高',
  },
  {
    label: '竞争挤压', color: '#15A7F0',
    nodes: ['大厂自研', '开源模型普及', '商业化壁垒降低'],
    outcome: 'API 收费承压',
  },
];

function RcSpark({ size = 20, color = '#fff', style }) {
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

function RcArrow({ color }) {
  return (
    <span className="xhsRc-arrow" aria-hidden="true">
      <svg width="34" height="20" viewBox="0 0 34 20">
        <path d="M2 10h26M22 3l8 7-8 7" fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Slide11RiskChain(props) {
  const {
    chainCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showArrows = true,
    showOutcome = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '风险研判 · 传导链条',
    titleLead = '盛宴仍在，但',
    titleKeyword = '风险在累积',
    // 数据
    chains = XHSRC_CHAINS,
  } = props;

  const src = Array.isArray(chains) ? chains : XHSRC_CHAINS;
  const count = Math.max(1, Math.min(src.length, chainCount));
  const shown = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsRc-root" data-label="风险传导">
      <style>{XHSRC_CSS}</style>

      <header className="xhsRc-head">
        <div className="xhsRc-kicker">{kicker}</div>
        <h2 className="xhsRc-title">
          <span>{titleLead}</span>
          <HL color="#FF2442" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
      </header>

      <div className="xhsRc-chains">
        {shown.map((ch, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          const nodes = Array.isArray(ch.nodes) ? ch.nodes : String(ch.nodes || '').split(/[，,、]+/).filter(Boolean);
          return (
            <div key={i} className={'xhsRc-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': ch.color }}>
              <span className="xhsRc-tag">{ch.label}</span>
              <div className="xhsRc-flow">
                {nodes.map((n, k) => (
                  <React.Fragment key={k}>
                    <span className="xhsRc-node">{n}</span>
                    {showArrows && <RcArrow color={ch.color} />}
                  </React.Fragment>
                ))}
                {showOutcome ? (
                  <span className="xhsRc-node is-outcome">{ch.outcome}</span>
                ) : (
                  <span className="xhsRc-node">{ch.outcome}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 120, top: 210, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <RcSpark size={24} color="#FF2442" style={{ position: 'absolute', right: 120, top: 128 }} />
          <RcSpark size={16} color="#FFC700" style={{ position: 'absolute', left: 76, bottom: 64 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSRC_CSS = `
  .xhsRc-root{ padding:84px 110px 70px; position:relative; display:flex; flex-direction:column; }
  .xhsRc-head{ margin-bottom:34px; }
  .xhsRc-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:18px; }
  .xhsRc-title{ margin:0; display:flex; align-items:center; gap:22px; font-size:56px; font-weight:900; color:#fff; }

  .xhsRc-chains{ flex:1; display:flex; flex-direction:column; gap:24px; justify-content:center; }
  .xhsRc-row{ display:flex; align-items:center; gap:28px; border-radius:20px; padding:26px 32px;
    background:linear-gradient(120deg, color-mix(in srgb, var(--c) 13%, #131313), #0f0f0f 64%);
    border:1.5px solid color-mix(in srgb, var(--c) 32%, transparent);
    transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease, box-shadow .3s ease; }
  .xhsRc-row.is-dim{ opacity:.44; filter:saturate(.7); }
  .xhsRc-row.is-hot{ transform:scale(1.02); border-color:var(--c);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 28%, transparent); }

  .xhsRc-tag{ flex-shrink:0; width:150px; font-size:28px; font-weight:900; color:var(--c);
    display:flex; align-items:center; gap:12px; }
  .xhsRc-tag::before{ content:""; width:14px; height:14px; border-radius:50%; background:var(--c);
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 65%, transparent); flex-shrink:0; }

  .xhsRc-flow{ flex:1; display:flex; align-items:center; gap:6px; flex-wrap:nowrap; min-width:0; }
  .xhsRc-node{ font-size:23px; font-weight:800; color:#e8e8e8; white-space:nowrap;
    background:rgba(255,255,255,.05); border:1.5px solid color-mix(in srgb, var(--c) 45%, transparent);
    padding:14px 22px; border-radius:14px; }
  .xhsRc-node.is-outcome{ color:#000; background:var(--c); border-color:var(--c);
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.55), inset 0 0 18px rgba(255,255,255,.4); }
  .xhsRc-arrow{ flex-shrink:0; display:flex; align-items:center; }
`;

const META = {
  id: 'riskchain',
  label: '风险传导',
  Component: Slide11RiskChain,
  defaults: {
    ...hlDefaults,
    chainCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showArrows: true,
    showOutcome: true,
    showDecorations: true,
    kicker: '风险研判 · 传导链条',
    titleLead: '盛宴仍在，但',
    titleKeyword: '风险在累积',
    chains: XHSRC_CHAINS,
  },
  controls: [
    ...hlControls,
    { key: 'chainCount', type: 'slider', label: '链路数量', min: 1, max: 3, step: 1, default: 3, desc: '展示的风险传导链数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一条链路' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'chainCount', showIf: (v) => v.focusEnabled, desc: '被高亮链路的序号' },
    { key: 'showArrows', type: 'toggle', label: '箭头连接', default: true, desc: '节点间的箭头流向' },
    { key: 'showOutcome', type: 'toggle', label: '结果强调', default: true, desc: '末端结果节点高亮' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '风险研判 · 传导链条', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '盛宴仍在，但', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '风险在累积', desc: '高亮关键词' },
    { type: 'section', label: '数据 · 传导链' },
    {
      key: 'chains', type: 'list', label: '传导链', itemLabel: '链路', countFromKey: 'chainCount',
      fields: [{ key: 'label', label: '标签' }, { key: 'nodes', label: '节点(逗号分隔)' }, { key: 'outcome', label: '结果' }, { key: 'color', label: '颜色' }],
      default: XHSRC_CHAINS, desc: '传导链：标签 / 节点 / 结果 / 颜色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide11RiskChain.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide11RiskChain;
