/*
 * Slide75CoverGhost — 幽灵数字封面（封面页 · 巨型描边幽灵数字 + 玻璃糖果胶囊标题 + 底部导读条）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时 / window。
 * CSS 前缀 xhsCg- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Slide57Cover / CoverIndex 互补：本页是「数据特辑」式封面——超大描边幽灵数字铺底，标题压在左下
 * （关键词玻璃糖果胶囊），底部一字排开的导读条。文本写死，仅结构/数量/显隐由 props 暴露。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   主色调(通用命名)            默认 'yellow' green/yellow/blue/pink
 *  lineCount       number 底部导读条数量(0–4)         默认 4
 *  focusEnabled    bool   是否高亮某一导读条          默认 false
 *  focusIndex      number 被高亮导读条序号(1–lineCount) 默认 1
 *  showGhost       bool   背景巨型描边数字显隐        默认 true
 *  showIssue       bool   期号徽标显隐                默认 true
 *  showDecorations bool   星芒等点缀显隐              默认 true
 *  hlStyle/hlTilt  —      关键词高亮样式 / 倾斜（共享基座 _Highlight）
 *
 * 迁移：import Slide75CoverGhost, { defaults, controls } from './Slide75CoverGhost.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSCG_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 底部导读条默认值（作者文案写在文件内，可由 lines prop 覆盖）：主句 / 释义 / 主色
const XHSCG_LINES = [
  { head: '970 亿美元', sub: '全年总额创历史新高', color: '#27E021' },
  { head: '97 笔大额轮', sub: '单笔 ≥1 亿 · 头部集中', color: '#15A7F0' },
  { head: '六大赛道', sub: '算力 · 模型 · 应用争霸', color: '#FFC700' },
  { head: '估值翻数倍', sub: '独角兽流水线 · 资本不眠', color: '#FF9FE2' },
];

function CgSpark({ size = 22, color = '#fff', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <path fill={color} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

function Slide75CoverGhost(props) {
  const {
    accentTone = 'yellow',
    lineCount = 4,
    focusEnabled = false,
    focusIndex = 1,
    showGhost = true,
    showIssue = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    brand = 'AI CAPITAL',
    brandZh = '资本观察 · 数据特辑',
    issueNo = 'VOL.',
    issueVol = '04',
    issueYr = '2024 年度',
    ghostText = '04',
    eyebrow = '特别报告 · SPECIAL ISSUE',
    titleLead = '大额时代',
    titleKeyword = '来了',
    sub = '单笔过亿成为新常态 —— 一年里，钱以前所未有的速度涌入',
    // 数据
    lines = XHSCG_LINES,
  } = props;

  const accent = XHSCG_TONES[accentTone] || XHSCG_TONES.yellow;
  const arr = Array.isArray(lines) ? lines : XHSCG_LINES;
  const lc = Math.max(0, Math.min(arr.length, lineCount));
  const shown = arr.slice(0, lc);
  const fi = Math.max(1, Math.min(lc, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsCg-root" data-label="幽灵数字封面" data-screen-label="幽灵数字封面"
      style={{ '--c': accent }}>
      <style>{XHSCG_CSS}</style>

      <header className="xhsCg-mh">
        <span className="xhsCg-brand">{brand}</span>
        <span className="xhsCg-brandZh">{brandZh}</span>
        {showIssue && (
          <span className="xhsCg-issue"><i className="xhsCg-issueNo">{issueNo}</i><b>{issueVol}</b><span className="xhsCg-issueYr">{issueYr}</span></span>
        )}
      </header>

      {showGhost && <div className="xhsCg-ghost" aria-hidden="true">{ghostText}</div>}

      <div className="xhsCg-block">
        <span className="xhsCg-eyebrow">{eyebrow}</span>
        <h2 className="xhsCg-title">{titleLead}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL></h2>
        <p className="xhsCg-sub">{sub}</p>
      </div>

      {lc > 0 && (
        <div className={'xhsCg-strip' + (focusEnabled ? ' is-focus' : '')}>
          {shown.map((l, i) => (
            <div key={i}
              className={'xhsCg-cell' + (focusEnabled ? (i === fi ? ' is-hot' : ' is-dim') : '')}
              style={{ '--c': l.color }}>
              <span className="xhsCg-dot"></span>
              <span className="xhsCg-ct">
                <span className="xhsCg-ch">{l.head}</span>
                <span className="xhsCg-cs">{l.sub}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {showDecorations && (
        <CgSpark size={18} color="#15A7F0" style={{ position: 'absolute', left: 96, top: 280, zIndex: 5 }} />
      )}
    </section>
  );
}

const XHSCG_CSS = `
  .xhsCg-root{ position:relative; box-sizing:border-box; height:100%; overflow:hidden; color:#fff; padding:64px 90px;
    background:radial-gradient(1000px 800px at 78% 30%, color-mix(in srgb, var(--c) 12%, #000), #000 70%); }
  .xhsCg-root *{ box-sizing:border-box; }

  .xhsCg-mh{ display:flex; align-items:baseline; gap:22px; position:relative; z-index:3; }
  .xhsCg-brand{ font-family:"Space Mono",monospace; font-weight:700; font-size:38px; letter-spacing:.06em; color:#fff; }
  .xhsCg-brandZh{ font-size:24px; font-weight:700; letter-spacing:.14em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent); }
  .xhsCg-issue{ margin-left:auto; display:inline-flex; align-items:baseline; gap:8px; padding:8px 20px; border-radius:12px;
    background:rgba(0,0,0,.45); border:1.5px solid rgba(255,255,255,.18); }
  .xhsCg-issueNo{ font-family:"Space Mono",monospace; font-style:normal; font-size:19px; font-weight:700; color:#bdbdbd; }
  .xhsCg-issue b{ font-family:"Space Mono",monospace; font-size:32px; font-weight:700; color:var(--c); line-height:1; }
  .xhsCg-issueYr{ font-size:17px; font-weight:700; color:#cfcfcf; letter-spacing:.06em; white-space:nowrap; }

  .xhsCg-ghost{ position:absolute; right:40px; top:48%; transform:translateY(-50%);
    font-family:"Space Mono",monospace; font-weight:700; font-size:760px; line-height:.8; letter-spacing:-.04em;
    color:transparent; -webkit-text-stroke:2px color-mix(in srgb, var(--c) 40%, #222);
    z-index:1; pointer-events:none; user-select:none; }

  .xhsCg-block{ position:absolute; left:90px; bottom:210px; z-index:3; max-width:1180px; }
  .xhsCg-eyebrow{ font-family:"Space Mono",monospace; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    font-size:26px; color:var(--c); text-shadow:0 0 22px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCg-title{ margin:22px 0 0; font-size:152px; font-weight:900; line-height:1.04; letter-spacing:-.02em; }
  .xhsCg-sub{ margin:30px 0 0; font-size:32px; font-weight:600; color:#d6d6d6; }

  .xhsCg-strip{ position:absolute; left:90px; right:90px; bottom:74px; z-index:3;
    display:grid; grid-template-columns:repeat(4,1fr); border-top:1.5px solid rgba(255,255,255,.16); }
  .xhsCg-cell{ padding:28px 34px 0 0; display:flex; gap:18px; align-items:flex-start; transition:transform .2s ease; }
  .xhsCg-cell + .xhsCg-cell{ padding-left:34px; border-left:1.5px solid rgba(255,255,255,.1); }
  .xhsCg-dot{ width:13px; height:13px; border-radius:50%; margin-top:9px; flex:0 0 auto;
    background:var(--c); box-shadow:0 0 14px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsCg-ct{ display:flex; flex-direction:column; gap:6px; }
  .xhsCg-ch{ font-size:27px; font-weight:800; color:#fff; }
  .xhsCg-cs{ font-size:20px; font-weight:600; color:#aeaeae; }
  .xhsCg-cell.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCg-cell.is-hot .xhsCg-dot{ transform:scale(1.18); box-shadow:0 0 22px color-mix(in srgb, var(--c) 75%, transparent); }
  .xhsCg-cell.is-hot .xhsCg-ch{ color:var(--c); }
`;

const META = {
  id: 'coverGhost',
  label: '幽灵数字封面',
  Component: Slide75CoverGhost,
  defaults: {
    ...hlDefaults,
    accentTone: 'yellow',
    lineCount: 4,
    focusEnabled: false,
    focusIndex: 1,
    showGhost: true,
    showIssue: true,
    showDecorations: true,
    brand: 'AI CAPITAL',
    brandZh: '资本观察 · 数据特辑',
    issueNo: 'VOL.',
    issueVol: '04',
    issueYr: '2024 年度',
    ghostText: '04',
    eyebrow: '特别报告 · SPECIAL ISSUE',
    titleLead: '大额时代',
    titleKeyword: '来了',
    sub: '单笔过亿成为新常态 —— 一年里，钱以前所未有的速度涌入',
    lines: XHSCG_LINES,
  },
  controls: [
    ...hlControls,
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'yellow', desc: '页面主色调(通用命名)' },
    { key: 'lineCount', type: 'slider', label: '导读条数量', min: 0, max: 4, step: 1, default: 4, desc: '底部导读条数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一导读条' },
    { key: 'focusIndex', type: 'slider', label: '高亮第几个', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'lineCount', desc: '被高亮导读条序号', showIf: (v) => v.focusEnabled },
    { key: 'showGhost', type: 'toggle', label: '幽灵数字', default: true, desc: '背景巨型描边数字显隐' },
    { key: 'showIssue', type: 'toggle', label: '期号徽标', default: true, desc: '期号徽标显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '大额时代', desc: '关键词前的文字' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '来了', desc: '玻璃糖果胶囊里的关键词' },
    { key: 'eyebrow', type: 'text', label: '眉标', default: '特别报告 · SPECIAL ISSUE', desc: '标题上方的小标' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 2, default: '单笔过亿成为新常态 —— 一年里，钱以前所未有的速度涌入', desc: '标题下方副标题' },
    { key: 'ghostText', type: 'text', label: '幽灵数字', default: '04', desc: '背景巨型描边数字', showIf: (v) => v.showGhost },
    { key: 'brand', type: 'text', label: '刊名(英)', default: 'AI CAPITAL', desc: '顶部英文刊名' },
    { key: 'brandZh', type: 'text', label: '刊名(中)', default: '资本观察 · 数据特辑', desc: '顶部中文刊名' },
    { key: 'issueNo', type: 'text', label: '期号前缀', default: 'VOL.', desc: '期号徽标前缀', showIf: (v) => v.showIssue },
    { key: 'issueVol', type: 'text', label: '期号', default: '04', desc: '期号数字', showIf: (v) => v.showIssue },
    { key: 'issueYr', type: 'text', label: '期号年份', default: '2024 年度', desc: '期号年份文字', showIf: (v) => v.showIssue },
    { type: 'section', label: '数据 · 导读条' },
    {
      key: 'lines', type: 'list', label: '导读条', itemLabel: '导读', countFromKey: 'lineCount',
      fields: [{ key: 'head', label: '主句' }, { key: 'sub', label: '释义' }, { key: 'color', label: '颜色' }],
      default: XHSCG_LINES, desc: '底部导读条：主句 / 释义 / 主色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide75CoverGhost.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide75CoverGhost;
