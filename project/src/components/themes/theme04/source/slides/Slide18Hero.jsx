/*
 * Slide18Hero — 全屏大图封面页（整屏自适应 cover 图 + 暗角浮层文案）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsHr- 。
 *
 * 图片槽（image-slot）：
 *  - 数量 0–1（mediaCount）：1 张整屏 cover 背景图；0 张时转为霓虹渐变底，仍保持构图美观；
 *  - cover 模式自适应填满画面（不留黑边），无需手动比例；scrim 暗角保证文字可读。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 背景图数量          默认 1   可选 0–1
 *  textAlign       enum   文案对齐           默认 'left' 可选 'left'|'center'
 *  accentTone      enum   主色调(通用命名)     默认 'blue' 可选 'green'|'yellow'|'blue'|'pink'
 *  statCount       number 数据卡数量          默认 3   可选 0–3
 *  showScrim       bool   暗角遮罩显隐         默认 true
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide18Hero, { defaults, controls } from './Slide18Hero.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

const XHSHR_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
const XHSHR_STATS = [
  { value: '50', unit: '亿', label: '2024 融资额' },
  { value: '500', unit: '亿', label: '估值 / 美元' },
  { value: '18', unit: '个月', label: '跻身头部梯队' },
];

function HrSpark({ size = 22, color = '#fff', style }) {
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

function Slide18Hero(props) {
  const {
    mediaCount = 1,
    backgroundMode = 'unicorn',
    unicornScene = 'moving',
    textAlign = 'left',
    accentTone = 'blue',
    statCount = 3,
    showScrim = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '典型案例 · 第三次创业',
    name = 'xAI',
    taglineLead = '马斯克的',
    taglineKeyword = '第三次创业',
    taglineTail = '',
    body = '背靠 X 平台海量实时社交数据，协同特斯拉自动驾驶团队——Grok 主打「幽默、实时、无审查」，从成立到跻身头部梯队仅用 18 个月。',
    mediaPlaceholder = '拖入整屏背景图',
    // 数据
    stats = XHSHR_STATS,
  } = props;

  const accent = XHSHR_TONES[accentTone] || XHSHR_TONES.blue;
  const useUnicorn = backgroundMode === 'unicorn';
  const hasImg = !useUnicorn && mediaCount >= 1;
  const statSrc = Array.isArray(stats) ? stats : XHSHR_STATS;
  const scount = Math.max(0, Math.min(statSrc.length, statCount));
  const shownStats = statSrc.slice(0, scount);

  return (
    <section className={'xhs-base xhsHr-root is-' + textAlign} data-label="大图封面" style={{ '--c': accent }}>
      <style>{XHSHR_CSS}</style>

      {useUnicorn ? (
        <div className="xhsHr-bg">
          <UnicornBackground scene={unicornScene} accent={accent} />
        </div>
      ) : hasImg ? (
        <div className="xhsHr-bg">
          <image-slot id="xhsHr-media" fit="cover" shape="rect" placeholder={mediaPlaceholder}></image-slot>
        </div>
      ) : (
        <div className="xhsHr-bg xhsHr-bg--gradient" aria-hidden="true" />
      )}

      {showScrim && <div className={'xhsHr-scrim is-' + textAlign} aria-hidden="true" />}

      <div className="xhsHr-content">
        <div className="xhsHr-kicker">{kicker}</div>
        <h2 className="xhsHr-name">{name}</h2>
        <div className="xhsHr-tagline">{taglineLead}<HL color={accent} variant={hlStyle} tilt={hlTilt}>{taglineKeyword}</HL>{taglineTail}</div>
        <p className="xhsHr-body">{body}</p>

        {scount > 0 && (
          <div className="xhsHr-stats">
            {shownStats.map((s, i) => (
              <div key={i} className="xhsHr-stat">
                <span className="xhsHr-stat-val">{s.value}<i>{s.unit}</i></span>
                <span className="xhsHr-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDecorations && (
        <React.Fragment>
          <HrSpark size={26} color={accent} style={{ position: 'absolute', right: 110, top: 120 }} />
          <HrSpark size={16} color="#FF9FE2" style={{ position: 'absolute', right: 180, top: 200 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSHR_CSS = `
  .xhsHr-root{ position:relative; overflow:hidden; display:flex; align-items:flex-end;
    padding:96px 110px 90px; }
  .xhsHr-root.is-center{ align-items:center; justify-content:center; text-align:center; padding-bottom:96px; }

  .xhsHr-bg{ position:absolute; inset:0; z-index:0; background:#0a0a0a; }
  .xhsHr-bg image-slot{ width:100%; height:100%; display:block; }
  .xhsHr-bg--gradient{
    background:
      radial-gradient(1200px 760px at 22% 84%, color-mix(in srgb, var(--c) 30%, transparent), transparent 60%),
      radial-gradient(900px 620px at 88% 14%, rgba(255,159,226,.16), transparent 60%),
      linear-gradient(160deg, #141414, #050505 70%); }

  .xhsHr-scrim{ position:absolute; inset:0; z-index:1; pointer-events:none; }
  .xhsHr-scrim.is-left{ background:linear-gradient(75deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.62) 36%, rgba(0,0,0,.12) 66%, transparent 100%),
    linear-gradient(0deg, rgba(0,0,0,.7), transparent 46%); }
  .xhsHr-scrim.is-center{ background:radial-gradient(120% 120% at 50% 60%, transparent 30%, rgba(0,0,0,.78) 100%),
    linear-gradient(0deg, rgba(0,0,0,.55), transparent 50%); }

  .xhsHr-content{ position:relative; z-index:2; max-width:1000px; }
  .xhsHr-root.is-center .xhsHr-content{ max-width:1180px; }
  .xhsHr-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.16em; color:var(--c);
    margin-bottom:14px; text-shadow:0 0 14px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsHr-name{ margin:0; font-size:168px; font-weight:900; line-height:.92; color:#fff; letter-spacing:-.02em;
    text-shadow:0 8px 50px rgba(0,0,0,.6); }
  .xhsHr-tagline{ margin-top:20px; font-size:52px; font-weight:900; color:#fff; }
  .xhsHr-body{ margin:30px 0 0; font-size:27px; line-height:1.66; font-weight:500; color:#dcdcdc; max-width:880px; }
  .xhsHr-root.is-center .xhsHr-body{ margin-left:auto; margin-right:auto; }

  .xhsHr-stats{ display:flex; gap:48px; margin-top:46px; }
  .xhsHr-root.is-center .xhsHr-stats{ justify-content:center; }
  .xhsHr-stat{ display:flex; flex-direction:column; gap:8px; position:relative; padding-left:22px; }
  .xhsHr-stat::before{ content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:13px; height:13px; border-radius:50%;
    background:var(--c); box-shadow:0 0 16px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsHr-stat-val{ font-family:"Space Mono",monospace; font-size:60px; font-weight:700; line-height:1; color:#fff; }
  .xhsHr-stat-val i{ font-style:normal; font-size:26px; font-weight:700; margin-left:4px; color:var(--c); }
  .xhsHr-stat-label{ font-size:22px; font-weight:600; color:#c4c4c4; white-space:nowrap; }
`;

const META = {
  id: 'hero',
  label: '大图封面',
  Component: Slide18Hero,
  defaults: {
    ...hlDefaults,
    mediaCount: 1,
    backgroundMode: 'unicorn',
    unicornScene: 'moving',
    textAlign: 'left',
    accentTone: 'blue',
    statCount: 3,
    showScrim: true,
    showDecorations: true,
    kicker: '典型案例 · 第三次创业',
    name: 'xAI',
    taglineLead: '马斯克的',
    taglineKeyword: '第三次创业',
    taglineTail: '',
    body: '背靠 X 平台海量实时社交数据，协同特斯拉自动驾驶团队——Grok 主打「幽默、实时、无审查」，从成立到跻身头部梯队仅用 18 个月。',
    mediaPlaceholder: '拖入整屏背景图',
    stats: XHSHR_STATS,
  },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('moving'),
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '背景图数量', min: 0, max: 1, step: 1, default: 1, dependsOn: 'backgroundMode', dependsOnValue: 'media', desc: '整屏 cover 背景图(0=渐变底)' },
    { key: 'textAlign', type: 'radio', label: '文案对齐', options: ['left', 'center'], optionLabels: ['左下', '居中'], default: 'left', desc: '浮层文案对齐方式' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调' },
    { key: 'statCount', type: 'slider', label: '数据卡数量', min: 0, max: 3, step: 1, default: 3, desc: '底部数据卡数量' },
    { key: 'showScrim', type: 'toggle', label: '暗角遮罩', default: true, desc: '保证文字可读的暗角' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '典型案例 · 第三次创业', desc: '顶部 kicker' },
    { key: 'name', type: 'text', label: '主标题', default: 'xAI', desc: '巨型主标题' },
    { key: 'taglineLead', type: 'text', label: '口号前半', default: '马斯克的', desc: '口号关键词前文' },
    { key: 'taglineKeyword', type: 'text', label: '口号关键词', default: '第三次创业', desc: '高亮关键词' },
    { key: 'taglineTail', type: 'text', label: '口号后半', default: '', desc: '关键词后文' },
    { key: 'body', type: 'textarea', label: '正文', rows: 3, default: '背靠 X 平台海量实时社交数据，协同特斯拉自动驾驶团队——Grok 主打「幽默、实时、无审查」，从成立到跻身头部梯队仅用 18 个月。', desc: '正文段落' },
    { key: 'mediaPlaceholder', type: 'text', label: '图片槽提示', default: '拖入整屏背景图', desc: '背景图槽占位文案', showIf: (v) => v.mediaCount > 0 },
    { type: 'section', label: '数据 · 数据卡' },
    {
      key: 'stats', type: 'list', label: '数据卡', itemLabel: '卡', countFromKey: 'statCount',
      fields: [{ key: 'value', label: '数值' }, { key: 'unit', label: '单位' }, { key: 'label', label: '标签' }],
      default: XHSHR_STATS, desc: '底部数据卡：数值 / 单位 / 标签',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide18Hero.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide18Hero;
