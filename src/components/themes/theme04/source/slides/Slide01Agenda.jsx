/*
 * Slide01Agenda — 研究框架 / 目录页（倾斜霓虹模块卡）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks。
 * CSS 类名统一前缀 xhsAg- ，迁移到其它 React 项目不会污染全局。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number  模块数量          默认 4   可选 2–4
 *  focusEnabled    bool    重点突出开关       默认 false
 *  focusIndex      number  重点项序号(从1起)  默认 1   范围 1–itemCount
 *  showDecorations bool    装饰元素显隐       默认 true
 *  showTag         bool    序号标签显隐       默认 true
 *  tilt            bool    卡片倾斜           默认 true
 *
 * 内容（标题/文案）写死在组件内，不做参数调节。
 *
 * 迁移：import Slide01Agenda, { defaults, controls } from './Slide01Agenda.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

  // —— 设计令牌（自带，保证组件可独立迁移）——
  const XHSAG_PALETTE = ['#27E021', '#FFC700', '#15A7F0', '#FF9FE2'];
  const XHSAG_ITEMS = [
    { tag: '<Part01>', title: '市场全景', caption: '全年 970 亿美元 · 融资全景' },
    { tag: '<Part02>', title: '行业透视', caption: '赛道 / 轮次 / 头部玩家' },
    { tag: '<Part03>', title: '产业链分层', caption: '上 · 中 · 下游结构透视' },
    { tag: '<Part04>', title: '品质涌现', caption: '从「赌叙事」到「看兑现」' },
  ];
  const XHSAG_TILTS = [-4, 3, -3, 4];

  // 四角星（白芯发光）—— 还原 Figma 星形
  function AgSpark({ size = 26, color = '#fff', style }) {
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

  // 粗描边圆环
  function AgRing({ size = 22, color = '#fff', style }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="3.6" />
      </svg>
    );
  }

  function AgArc({ size = 26, color = '#fff', style }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
        <path d="M3 17 A 11 11 0 0 1 21 7" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 光标指针
  function AgCursor({ size = 30, color = '#FFC700', style }) {
    return (
      <svg width={size * 0.83} height={size} viewBox="0 0 70 84" aria-hidden="true"
        style={{ filter: `drop-shadow(0 0 6px ${color}88)`, ...style }}>
        <path fill={color} d="M10.26 1.342C6.086 -1.881 0 1.065 0 6.303L0 77.692C0 83.661 7.607 86.28 11.345 81.596L29.102 59.351C29.758 58.531 30.592 57.869 31.542 57.414C32.493 56.959 33.535 56.723 34.591 56.724L63.629 56.724C69.681 56.724 72.313 49.135 67.533 45.458L10.26 1.342Z" />
      </svg>
    );
  }

  function AgDot({ size = 10, color = '#fff', style }) {
    return (
      <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}66`, ...style }} />
    );
  }

  function Slide01Agenda(props) {
    const {
      itemCount = 4,
      focusEnabled = false,
      focusIndex = 1,
      showDecorations = true,
      showTag = true,
      tilt = true,
      hlStyle = 'glass',
      hlTilt = 2,
      // 文案
      kicker = 'RESEARCH FRAMEWORK / 调研框架',
      titleLine1 = '2024 美国大额融资 AI 公司',
      titleKeyword = '调研报告',
      footnote = '横纵分析法 · 在空间维度与时间维度交叉透视同一组数据',
      // 数据
      items = XHSAG_ITEMS,
    } = props;

    const count = Math.max(2, Math.min((Array.isArray(items) ? items.length : 4), itemCount));
    const list = (Array.isArray(items) ? items : XHSAG_ITEMS).slice(0, count);
    const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

    return (
      <section className="xhs-base xhsAg-root" data-label="研究框架">
        <style>{XHSAG_CSS}</style>

        {/* 标题区 */}
        <header className="xhsAg-head">
          <div className="xhsAg-kicker">{kicker}</div>
          <h1 className="xhsAg-title">
            <span className="xhsAg-t1">{titleLine1}</span>
            <span className="xhsAg-t2">
              <HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
            </span>
          </h1>
        </header>

        {/* 模块卡片行 */}
        <div className="xhsAg-row">
          {list.map((it, i) => {
            const color = XHSAG_PALETTE[i % XHSAG_PALETTE.length];
            const dim = focusEnabled && i !== focus;
            const hot = focusEnabled && i === focus;
            const rot = tilt ? XHSAG_TILTS[i % XHSAG_TILTS.length] : 0;
            return (
              <div
                key={i}
                className={
                  'xhsAg-item' + (dim ? ' is-dim' : '') + (hot ? ' is-hot' : '')
                }
              >
                <div
                  className="xhsAg-card"
                  style={{
                    '--c': color,
                    transform: `rotate(${rot}deg)` + (hot ? ' scale(1.06)' : ''),
                  }}
                >
                  {showTag && <span className="xhsAg-tag">{it.tag}</span>}
                  <div className="xhsAg-cardfoot">
                    <span className="xhsAg-name">{it.title}</span>
                    <span className="xhsAg-cap">{it.caption}</span>
                  </div>
                  {showDecorations && i === 0 && (
                    <React.Fragment>
                      <AgSpark size={34} color="#27E021" style={{ position: 'absolute', top: -20, right: -8 }} />
                      <AgArc size={28} color="#ffffff" style={{ position: 'absolute', top: -34, right: 30 }} />
                    </React.Fragment>
                  )}
                  {showDecorations && i === 1 && (
                    <AgCursor size={34} color="#FFC700" style={{ position: 'absolute', top: -34, left: 24 }} />
                  )}
                  {showDecorations && i === count - 1 && (
                    <React.Fragment>
                      <AgRing size={26} color="#ffffff" style={{ position: 'absolute', top: -18, right: 18 }} />
                      <AgSpark size={22} color="#FF9FE2" style={{ position: 'absolute', bottom: 6, left: -22 }} />
                    </React.Fragment>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 装饰 */}
        {showDecorations && (
          <React.Fragment>
            <AgArc size={36} color="#27E021" style={{ position: 'absolute', left: 548, top: 360 }} />
          <AgSpark size={26} color="#FFC700" style={{ position: 'absolute', left: 356, top: 462 }} />
            <AgDot size={13} color="#FFC700" style={{ position: 'absolute', left: 700, top: 452 }} />
            <AgRing size={28} color="#15A7F0" style={{ position: 'absolute', right: 300, bottom: 150 }} />
            <AgSpark size={22} color="#FF9FE2" style={{ position: 'absolute', left: 200, bottom: 214 }} />
            <AgDot size={9} color="#15A7F0" style={{ position: 'absolute', right: 240, bottom: 240 }} />
          </React.Fragment>
        )}

        <footer className="xhsAg-foot">
          <span className="xhsAg-dot" />
          {footnote}
        </footer>
      </section>
    );
  }

  const XHSAG_CSS = `
  .xhsAg-root{ padding:110px 120px 90px; position:relative; }
  .xhsAg-head{ margin-top:24px; }
  .xhsAg-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.18em;
    color:#7c7c7c; margin-bottom:26px; }
  .xhsAg-title{ margin:0; font-weight:900; line-height:1.18; }
  .xhsAg-t1{ display:block; font-size:84px; color:#fff; }
  .xhsAg-t2{ display:flex; gap:24px; align-items:center; font-size:84px; margin-top:30px; }

  .xhsAg-row{ display:flex; gap:60px; justify-content:center; margin-top:90px; }
  .xhsAg-item{ display:flex; flex-direction:column; align-items:center; gap:26px;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsAg-item.is-dim{ opacity:.42; filter:saturate(.7); }
  .xhsAg-card{ position:relative; width:300px; height:300px; border-radius:40px;
    background:linear-gradient(158deg, color-mix(in srgb, var(--c) 90%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 74%, #000) 100%);
    display:flex; flex-direction:column; justify-content:flex-end;
    padding:34px; box-sizing:border-box;
    box-shadow:17px 19px 0 0 rgba(7,7,7,.92), 0 26px 44px rgba(0,0,0,.4), inset 0 3px 0 rgba(255,255,255,.5);
    transition:transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease; }
  .xhsAg-item.is-hot .xhsAg-card{
    box-shadow:17px 19px 0 0 rgba(7,7,7,.92), 0 0 100px color-mix(in srgb, var(--c) 55%, transparent),
      inset 0 3px 0 rgba(255,255,255,.55); }
  .xhsAg-tag{ font-family:"Space Mono",monospace; font-size:26px; font-weight:700; color:#0a0a0a;
    opacity:.82; margin-bottom:auto; }
  .xhsAg-cardfoot{ display:flex; flex-direction:column; gap:12px; }
  .xhsAg-name{ font-size:52px; font-weight:900; color:#000; letter-spacing:.02em; line-height:1.05; }
  .xhsAg-cap{ font-size:21px; color:rgba(0,0,0,.62); font-weight:700; line-height:1.32; }

  .xhsAg-foot{ position:absolute; left:120px; bottom:64px; display:flex; align-items:center; gap:16px;
    font-size:27px; color:#8a8a8a; font-weight:500; }
  .xhsAg-dot{ width:14px; height:14px; border-radius:50%; background:#FF2442; }
  `;

  // —— 默认 props + 参数说明（供预览控制器与迁移文档使用）——
  const META = {
    id: 'agenda',
    label: '研究框架',
    Component: Slide01Agenda,
    defaults: {
      ...hlDefaults,
      itemCount: 4,
      focusEnabled: false,
      focusIndex: 1,
      showDecorations: true,
      showTag: true,
      tilt: true,
      kicker: 'RESEARCH FRAMEWORK / 调研框架',
      titleLine1: '2024 美国大额融资 AI 公司',
      titleKeyword: '调研报告',
      footnote: '横纵分析法 · 在空间维度与时间维度交叉透视同一组数据',
      items: XHSAG_ITEMS,
    },
    controls: [
      ...hlControls,
      { key: 'itemCount', type: 'slider', label: '模块数量', min: 2, max: 4, step: 1, default: 4, desc: '展示的章节模块卡数量' },
      { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一个模块' },
      { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮模块的序号' },
      { key: 'tilt', type: 'toggle', label: '卡片倾斜', default: true, desc: '卡片是否带随机倾斜角' },
      { key: 'showTag', type: 'toggle', label: '序号标签', default: true, desc: '显示 <Part0X> 标签' },
      { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
      { type: 'section', label: '文案' },
      { key: 'kicker', type: 'text', label: '眉标', default: 'RESEARCH FRAMEWORK / 调研框架', desc: '顶部 kicker' },
      { key: 'titleLine1', type: 'text', label: '标题首行', default: '2024 美国大额融资 AI 公司', desc: '主标题第一行' },
      { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '调研报告', desc: '高亮关键词' },
      { key: 'footnote', type: 'text', label: '脚注', default: '横纵分析法 · 在空间维度与时间维度交叉透视同一组数据', desc: '底部脚注' },
      { type: 'section', label: '数据 · 模块卡' },
      {
        key: 'items', type: 'list', label: '模块卡', itemLabel: '模块', countFromKey: 'itemCount',
        fields: [{ key: 'tag', label: '标签' }, { key: 'title', label: '标题' }, { key: 'caption', label: '说明' }],
        default: XHSAG_ITEMS, desc: '章节模块卡：标签 / 标题 / 说明',
      },
    ],
  };

// —— 标准导出（迁移友好；预览控制器也读取它们）——
META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide01Agenda.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide01Agenda;
