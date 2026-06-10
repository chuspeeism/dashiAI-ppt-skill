/*
 * Slide04Statement — 核心结论页（居中金句 + 强调块 + 圆形图标）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks。
 * CSS 前缀 xhsSt- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  lineCount       number 文案行数      默认 2   可选 1–2
 *  highlightStyle  enum   强调样式      默认 'box'  可选 'box' | 'underline'
 *  showIcons       bool   图标显隐      默认 true
 *  showDecorations bool   装饰元素显隐   默认 true
 *
 * 迁移：import Slide04Statement, { defaults, controls } from './Slide04Statement.jsx'
 */
import React from 'react';

  const XHSST_LINES = [
    {
      color: '#15A7F0',
      before: '资本下一阶段，从 赌叙事 转向',
      mark: '看兑现',
      after: '',
      icon: 'trend',
    },
    {
      color: '#FFC700',
      before: '能把技术变成',
      mark: '可持续收入',
      after: '的公司，才留在牌桌',
      icon: 'check',
    },
  ];

  function StSpark({ size = 22, color = '#fff', style }) {
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

  function StArc({ size = 28, color = '#fff', style }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
        <path d="M3 17 A 11 11 0 0 1 21 7" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  function StDot({ size = 10, color = '#fff', style }) {
    return (
      <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, position: 'absolute', ...style }} />
    );
  }

  function StIcon({ kind, color }) {
    return (
      <span className="xhsSt-icon" style={{ background: color }}>
        {kind === 'trend' ? (
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 17l6-6 4 4 7-7" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8h5v5" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13l4 4L19 7" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    );
  }

  function Slide04Statement(props) {
    const {
      lineCount = 2,
      highlightStyle = 'box',
      showIcons = true,
      showDecorations = true,
      // 文案
      kicker = 'CONCLUSION · 核心结论',
      footnote = '音乐节奏正在变化 · 资本从「赌叙事」走向「看兑现」',
      // 数据
      lines = XHSST_LINES,
    } = props;

    const count = Math.max(1, Math.min((Array.isArray(lines) ? lines.length : 2), lineCount));
    const shown = (Array.isArray(lines) ? lines : XHSST_LINES).slice(0, count);

    return (
      <section className="xhs-base xhsSt-root" data-label="核心结论">
        <style>{XHSST_CSS}</style>

        <div className="xhsSt-kicker">{kicker}</div>

        <div className="xhsSt-stack">
          {shown.map((ln, i) => (
            <div className="xhsSt-line" key={i}>
              {ln.before && <span className="xhsSt-text">{ln.before}</span>}
              <span
                className={'xhsSt-mark xhsSt-mark--' + highlightStyle}
                style={{ '--c': ln.color }}
              >
                {ln.mark}
              </span>
              {ln.after && <span className="xhsSt-text">{ln.after}</span>}
              {showIcons && <StIcon kind={ln.icon} color={ln.color} />}
            </div>
          ))}
        </div>

        {showDecorations && (
          <React.Fragment>
            <span aria-hidden="true" style={{ position: 'absolute', left: 210, top: 378, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <StSpark size={28} color="#27E021" style={{ position: 'absolute', left: 210, top: 296 }} />
            <StArc size={30} color="#27E021" style={{ position: 'absolute', left: 262, top: 336 }} />
            <StDot size={12} color="#15A7F0" style={{ left: 150, top: 360 }} />
            <StSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 250, top: 352 }} />
            <StDot size={9} color="#FFC700" style={{ right: 320, top: 300 }} />
            <StSpark size={20} color="#FFC700" style={{ position: 'absolute', left: 360, bottom: 280 }} />
            <StArc size={24} color="#FF9FE2" style={{ position: 'absolute', right: 300, bottom: 300 }} />
            <StDot size={11} color="#27E021" style={{ right: 240, bottom: 280 }} />
          </React.Fragment>
        )}

        <div className="xhsSt-foot">{footnote}</div>
      </section>
    );
  }

  const XHSST_CSS = `
  .xhsSt-root{ padding:110px 96px; position:relative; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; }
  .xhsSt-kicker{ position:absolute; top:120px; left:0; right:0; text-align:center;
    font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.2em; color:#7c7c7c; }

  .xhsSt-stack{ display:flex; flex-direction:column; gap:46px; align-items:center; }
  .xhsSt-line{ display:flex; align-items:center; justify-content:center; gap:22px; flex-wrap:nowrap;
    font-size:62px; font-weight:900; color:#fff; line-height:1.2; white-space:nowrap; }
  .xhsSt-text{ color:#fff; white-space:nowrap; }

  .xhsSt-mark{ display:inline-block; font-weight:900; }
  .xhsSt-mark--box{ position:relative; color:var(--c); padding:6px 24px;
    background:color-mix(in srgb, var(--c) 16%, transparent); border-radius:14px;
    border:1.5px solid color-mix(in srgb, var(--c) 42%, transparent); }
  .xhsSt-mark--underline{ color:var(--c); padding-bottom:6px;
    background:linear-gradient(var(--c),var(--c)) bottom/100% 10px no-repeat; border-radius:2px; }

  .xhsSt-icon{ display:inline-flex; align-items:center; justify-content:center; width:74px; height:74px;
    border-radius:50%; box-shadow:0 0 42px color-mix(in srgb, var(--c,#fff) 45%, transparent),
      inset 0 3px 0 rgba(255,255,255,.4); flex-shrink:0; }

  .xhsSt-foot{ position:absolute; left:0; right:0; bottom:80px; text-align:center;
    font-size:26px; color:#7e7e7e; font-weight:500; }
  `;

  const META = {
    id: 'statement',
    label: '核心结论',
    Component: Slide04Statement,
    defaults: {
      lineCount: 2,
      highlightStyle: 'box',
      showIcons: true,
      showDecorations: true,
      kicker: 'CONCLUSION · 核心结论',
      footnote: '音乐节奏正在变化 · 资本从「赌叙事」走向「看兑现」',
      lines: XHSST_LINES,
    },
    controls: [
      { key: 'lineCount', type: 'slider', label: '文案行数', min: 1, max: 2, step: 1, default: 2, desc: '展示的金句行数' },
      { key: 'highlightStyle', type: 'radio', label: '强调样式', options: ['box', 'underline'], optionLabels: ['色块', '下划线'], default: 'box', desc: '关键词强调方式' },
      { key: 'showIcons', type: 'toggle', label: '图标显示', default: true, desc: '行尾圆形图标' },
      { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
      { type: 'section', label: '文案' },
      { key: 'kicker', type: 'text', label: '眉标', default: 'CONCLUSION · 核心结论', desc: '顶部 kicker' },
      { key: 'footnote', type: 'text', label: '脚注', default: '音乐节奏正在变化 · 资本从「赌叙事」走向「看兑现」', desc: '底部脚注' },
      { type: 'section', label: '数据 · 金句' },
      {
        key: 'lines', type: 'list', label: '金句行', itemLabel: '行', countFromKey: 'lineCount',
        fields: [{ key: 'before', label: '前文' }, { key: 'mark', label: '关键词' }, { key: 'after', label: '后文' }, { key: 'color', label: '颜色' }, { key: 'icon', label: '图标(trend/check)' }],
        default: XHSST_LINES, desc: '金句：前文 / 关键词 / 后文 / 颜色 / 图标',
      },
    ],
  };

  META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide04Statement.defaultProps = defaultProps;
export const defaults = META.defaults;
  export const controls = META.controls;
  export const meta = META;
  export default Slide04Statement;
