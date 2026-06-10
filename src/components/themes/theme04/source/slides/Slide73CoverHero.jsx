/*
 * Slide73CoverHero — 居中主题封面（封面页 · 居中大标题 + 玻璃糖果胶囊 + 底部数据芯片）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时 / window。
 * CSS 前缀 xhsCk- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与杂志封面 Slide57Cover（刊头 + 侧栏导读）/ Hero（整屏图）互补：本页是「居中主题页 / Keynote 开场」
 * ——全居中构图，超大标题里一枚玻璃糖果胶囊关键词，底部并置数据芯片。
 *
 * 契约：所有可见正文 / 数据均由 props 暴露（defaults 给完整默认值，作者文案写在本文件内），
 * controls 与 props 一一对应——结构项（数量 / 焦点 / 配色 / 显隐）+ 文案项（text）+ 数据项（list）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   主色调(通用命名)            默认 'green' green/yellow/blue/pink
 *  statCount       number 底部数据芯片数量(0–3)       默认 3
 *  focusEnabled    bool   是否高亮某一枚芯片          默认 false
 *  focusIndex      number 被高亮芯片序号(1–statCount) 默认 1
 *  showSub         bool   副标题显隐                  默认 true
 *  showBrand       bool   顶部刊名显隐                默认 true
 *  showDecorations bool   星芒等点缀显隐              默认 true
 *  hlStyle/hlTilt  —      关键词高亮样式 / 倾斜（共享基座 _Highlight）
 *  ── 文案 ──  brand / brandZh / eyebrow / titleLead / titleKeyword / sub
 *  ── 数据 ──  stats[]  { n 数字, l 标签, color 颜色 }
 *
 * 迁移：import Slide73CoverHero, { defaults, controls } from './Slide73CoverHero.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSCK_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 底部数据芯片默认值（作者文案写在文件内，可由 stats prop 覆盖）
const XHSCK_STATS = [
  { n: '970', l: '亿美元 · 全年总额', color: '#27E021' },
  { n: '97', l: '笔 · 单笔 ≥1 亿', color: '#15A7F0' },
  { n: '×3', l: '估值 · 一年跃迁', color: '#FF9FE2' },
];

function CkSpark({ size = 22, color = '#fff', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <path fill={color} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

function Slide73CoverHero(props) {
  const {
    accentTone = 'green',
    statCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showSub = true,
    showBrand = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    brand = 'AI CAPITAL',
    brandZh = '资本观察 · 年度特刊',
    eyebrow = '年度封面 · ANNUAL COVER',
    titleLead = '资本，正在',
    titleKeyword = '重新分配',
    sub = '2024 全球 AI 大额融资 · 全景年鉴',
    // 数据
    stats = XHSCK_STATS,
  } = props;

  const accent = XHSCK_TONES[accentTone] || XHSCK_TONES.green;
  const list = Array.isArray(stats) ? stats : XHSCK_STATS;
  const sc = Math.max(0, Math.min(list.length, statCount));
  const shown = list.slice(0, sc);
  const fi = Math.max(1, Math.min(sc, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsCk-root" data-label="居中主题封面" data-screen-label="居中主题封面"
      style={{ '--c': accent }}>
      <style>{XHSCK_CSS}</style>

      {showBrand && (
        <div className="xhsCk-top">
          <span className="xhsCk-brand">{brand}</span>
          <span className="xhsCk-brandZh">{brandZh}</span>
        </div>
      )}

      <div className="xhsCk-col">
        <span className="xhsCk-eyebrow">{eyebrow}</span>
        <h2 className="xhsCk-title">
          {titleLead}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
        {showSub && <p className="xhsCk-sub">{sub}</p>}

        {sc > 0 && (
          <div className={'xhsCk-chips' + (focusEnabled ? ' is-focus' : '')}>
            {shown.map((s, i) => (
              <div key={i}
                className={'xhsCk-chip' + (focusEnabled ? (i === fi ? ' is-hot' : ' is-dim') : '')}
                style={{ '--c': s.color }}>
                <span className="xhsCk-chipN">{s.n}</span>
                <span className="xhsCk-chipL">{s.l}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDecorations && (
        <React.Fragment>
          <CkSpark size={30} color="#FFC700" style={{ position: 'absolute', left: 360, top: 300, zIndex: 5 }} />
          <CkSpark size={17} color="#15A7F0" style={{ position: 'absolute', right: 380, bottom: 280, zIndex: 5 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCK_CSS = `
  .xhsCk-root{ position:relative; box-sizing:border-box; height:100%; overflow:hidden; text-align:center;
    display:grid; place-items:center; color:#fff;
    background:radial-gradient(900px 620px at 50% 42%, color-mix(in srgb, var(--c) 26%, #000) 0%, #000 66%), #000; }
  .xhsCk-root *{ box-sizing:border-box; }

  .xhsCk-top{ position:absolute; top:60px; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:6px; z-index:3; }
  .xhsCk-brand{ font-family:"Space Mono",monospace; font-weight:700; font-size:38px; letter-spacing:.06em; color:#fff; }
  .xhsCk-brandZh{ font-size:24px; font-weight:700; letter-spacing:.14em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent); }

  .xhsCk-col{ display:flex; flex-direction:column; align-items:center; z-index:2; }
  .xhsCk-eyebrow{ font-family:"Space Mono",monospace; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    font-size:26px; color:var(--c); margin-bottom:30px; text-shadow:0 0 22px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCk-title{ margin:0; font-size:150px; font-weight:900; line-height:1.06; letter-spacing:-.02em; }
  .xhsCk-sub{ margin:46px 0 0; font-size:34px; font-weight:600; color:#d8d8d8; letter-spacing:.02em; }

  .xhsCk-chips{ margin-top:60px; display:flex; gap:20px; }
  .xhsCk-chip{ position:relative; display:flex; flex-direction:column; align-items:center; gap:8px; padding:22px 40px; border-radius:20px;
    background:linear-gradient(155deg, color-mix(in srgb, var(--c) 17%, rgba(14,14,14,.92)), rgba(8,8,8,.92) 74%);
    border:1.5px solid color-mix(in srgb, var(--c) 44%, rgba(255,255,255,.08));
    box-shadow:0 16px 44px rgba(0,0,0,.55); transition:transform .2s ease; }
  .xhsCk-chipN{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; line-height:1; color:var(--c);
    text-shadow:0 0 16px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCk-chipL{ font-size:24px; font-weight:600; color:#c4c4c4; letter-spacing:.04em; }
  .xhsCk-chip.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCk-chip.is-hot{ border-color:var(--c); box-shadow:0 0 56px color-mix(in srgb, var(--c) 26%, transparent); transform:translateY(-6px); }
`;

const META = {
  id: 'coverHero',
  label: '居中主题封面',
  Component: Slide73CoverHero,
  defaults: {
    ...hlDefaults,
    accentTone: 'green',
    statCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showSub: true,
    showBrand: true,
    showDecorations: true,
    brand: 'AI CAPITAL',
    brandZh: '资本观察 · 年度特刊',
    eyebrow: '年度封面 · ANNUAL COVER',
    titleLead: '资本，正在',
    titleKeyword: '重新分配',
    sub: '2024 全球 AI 大额融资 · 全景年鉴',
    stats: XHSCK_STATS,
  },
  controls: [
    ...hlControls,
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '页面主色调(通用命名)' },
    { key: 'statCount', type: 'slider', label: '数据芯片数量', min: 0, max: 3, step: 1, default: 3, desc: '底部并置数据芯片数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一枚芯片' },
    { key: 'focusIndex', type: 'slider', label: '高亮第几个', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'statCount', desc: '被高亮芯片序号', showIf: (v) => v.focusEnabled },
    { key: 'showSub', type: 'toggle', label: '副标题', default: true, desc: '副标题显隐' },
    { key: 'showBrand', type: 'toggle', label: '顶部刊名', default: true, desc: '顶部刊名显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '资本，正在', desc: '主标题关键词前的文字' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '重新分配', desc: '玻璃糖果胶囊里的关键词' },
    { key: 'eyebrow', type: 'text', label: '眉标', default: '年度封面 · ANNUAL COVER', desc: '标题上方的小标' },
    { key: 'sub', type: 'text', label: '副标题', default: '2024 全球 AI 大额融资 · 全景年鉴', desc: '标题下方副标题', showIf: (v) => v.showSub },
    { key: 'brand', type: 'text', label: '刊名(英)', default: 'AI CAPITAL', desc: '顶部英文刊名', showIf: (v) => v.showBrand },
    { key: 'brandZh', type: 'text', label: '刊名(中)', default: '资本观察 · 年度特刊', desc: '顶部中文刊名', showIf: (v) => v.showBrand },
    { type: 'section', label: '数据 · 芯片' },
    {
      key: 'stats', type: 'list', label: '数据芯片', itemLabel: '芯片', countFromKey: 'statCount',
      fields: [{ key: 'n', label: '数字' }, { key: 'l', label: '标签' }, { key: 'color', label: '颜色' }],
      default: XHSCK_STATS, desc: '底部数据芯片：数字 / 标签 / 主色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide73CoverHero.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide73CoverHero;
