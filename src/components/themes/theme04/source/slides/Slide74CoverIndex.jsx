/*
 * Slide74CoverIndex — 索引导读封面（封面页 · 左侧大标题 + 玻璃糖果胶囊 + 右侧霓虹索引卡）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时 / window。
 * CSS 前缀 xhsCx- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Slide57Cover（侧栏角标导读）互补：本页是「左标题 + 右索引」非对称双栏封面——左侧超大标题
 * （关键词玻璃糖果胶囊），右侧 2–4 张霓虹玻璃索引卡（编号 + 主句 + 释义）。文本写死，仅结构/数量/显隐由 props 暴露。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   主色调(通用命名)            默认 'blue' green/yellow/blue/pink
 *  itemCount       number 右侧索引卡数量(2–4)         默认 4
 *  focusEnabled    bool   是否高亮某一张索引卡        默认 false
 *  focusIndex      number 被高亮索引卡序号(1–itemCount) 默认 1
 *  showIssue       bool   期号徽标显隐                默认 true
 *  showSub         bool   副标题显隐                  默认 true
 *  showDecorations bool   星芒等点缀显隐              默认 true
 *  hlStyle/hlTilt  —      关键词高亮样式 / 倾斜（共享基座 _Highlight）
 *
 * 迁移：import Slide74CoverIndex, { defaults, controls } from './Slide74CoverIndex.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSCX_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 右侧索引卡默认值（作者文案写在文件内，可由 items prop 覆盖）：编号 / 主句 / 释义 / 主色
const XHSCX_ITEMS = [
  { tag: '01', head: '算力霸权', sub: '芯片 · 数据中心 · 谁卡住咽喉', color: '#27E021' },
  { tag: '02', head: '模型军备', sub: '基础模型三强 · 烧钱与护城河', color: '#15A7F0' },
  { tag: '03', head: '应用突围', sub: '从 Demo 到收入 · 谁先跑通', color: '#FFC700' },
  { tag: '04', head: '资本退潮', sub: '热钱之后 · 谁会被留在沙滩上', color: '#FF9FE2' },
];

function CxSpark({ size = 22, color = '#fff', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <path fill={color} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

function Slide74CoverIndex(props) {
  const {
    accentTone = 'blue',
    itemCount = 4,
    focusEnabled = false,
    focusIndex = 1,
    showIssue = true,
    showSub = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    brand = 'AI CAPITAL',
    brandZh = '资本观察 · 特别报告',
    issueNo = 'NO.',
    issueVol = '04',
    issueYr = '2024 年刊',
    eyebrow = '封面故事 · COVER STORY',
    titleLead = '谁在',
    titleKeyword = '改写',
    titleTail = '估值规则',
    sub = '头部玩家、资本流向与一年翻倍的独角兽流水线',
    // 数据
    items = XHSCX_ITEMS,
  } = props;

  const accent = XHSCX_TONES[accentTone] || XHSCX_TONES.blue;
  const list = Array.isArray(items) ? items : XHSCX_ITEMS;
  const ic = Math.max(2, Math.min(list.length, itemCount));
  const shown = list.slice(0, ic);
  const fi = Math.max(1, Math.min(ic, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsCx-root" data-label="索引导读封面" data-screen-label="索引导读封面"
      style={{ '--c': accent }}>
      <style>{XHSCX_CSS}</style>

      <header className="xhsCx-mh">
        <span className="xhsCx-brand">{brand}</span>
        <span className="xhsCx-brandZh">{brandZh}</span>
        {showIssue && (
          <span className="xhsCx-issue"><i className="xhsCx-issueNo">{issueNo}</i><b>{issueVol}</b><span className="xhsCx-issueYr">{issueYr}</span></span>
        )}
      </header>

      <div className="xhsCx-grid">
        <div className="xhsCx-left">
          <span className="xhsCx-eyebrow">{eyebrow}</span>
          <h2 className="xhsCx-title">{titleLead}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL><br />{titleTail}</h2>
          {showSub && <p className="xhsCx-sub">{sub}</p>}
        </div>

        <ul className={'xhsCx-idx' + (focusEnabled ? ' is-focus' : '')}>
          {shown.map((it, i) => (
            <li key={i}
              className={'xhsCx-row' + (focusEnabled ? (i === fi ? ' is-hot' : ' is-dim') : '')}
              style={{ '--c': it.color }}>
              <span className="xhsCx-tag">{it.tag}</span>
              <span className="xhsCx-bd">
                <span className="xhsCx-hd">{it.head}</span>
                <span className="xhsCx-sb">{it.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showDecorations && (
        <CxSpark size={18} color="#FFC700" style={{ position: 'absolute', left: 760, top: 360, zIndex: 5 }} />
      )}
    </section>
  );
}

const XHSCX_CSS = `
  .xhsCx-root{ position:relative; box-sizing:border-box; height:100%; overflow:hidden; color:#fff; background:#000; padding:64px 90px; }
  .xhsCx-root *{ box-sizing:border-box; }

  .xhsCx-mh{ display:flex; align-items:baseline; gap:22px; }
  .xhsCx-brand{ font-family:"Space Mono",monospace; font-weight:700; font-size:38px; letter-spacing:.06em; color:#fff; }
  .xhsCx-brandZh{ font-size:24px; font-weight:700; letter-spacing:.14em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent); }
  .xhsCx-issue{ margin-left:auto; display:inline-flex; align-items:baseline; gap:8px; padding:8px 20px; border-radius:12px;
    background:rgba(0,0,0,.45); border:1.5px solid rgba(255,255,255,.18); }
  .xhsCx-issueNo{ font-family:"Space Mono",monospace; font-style:normal; font-size:19px; font-weight:700; color:#bdbdbd; }
  .xhsCx-issue b{ font-family:"Space Mono",monospace; font-size:32px; font-weight:700; color:var(--c); line-height:1; }
  .xhsCx-issueYr{ font-size:17px; font-weight:700; color:#cfcfcf; letter-spacing:.06em; white-space:nowrap; }

  .xhsCx-grid{ position:absolute; left:90px; right:90px; top:184px; bottom:84px;
    display:grid; grid-template-columns:1fr 512px; gap:64px; align-items:center; }
  .xhsCx-eyebrow{ font-family:"Space Mono",monospace; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    font-size:25px; color:var(--c); text-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCx-title{ margin:26px 0 0; font-size:128px; font-weight:900; line-height:1.1; letter-spacing:-.02em; }
  .xhsCx-sub{ margin:34px 0 0; font-size:30px; font-weight:600; color:#cfcfcf; }

  .xhsCx-idx{ margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:18px; }
  .xhsCx-row{ display:flex; align-items:center; gap:22px; padding:26px 30px; border-radius:20px;
    background:linear-gradient(155deg, color-mix(in srgb, var(--c) 17%, rgba(14,14,14,.92)), rgba(8,8,8,.92) 74%);
    border:1.5px solid color-mix(in srgb, var(--c) 44%, rgba(255,255,255,.08));
    box-shadow:0 16px 44px rgba(0,0,0,.55); transition:transform .2s ease; }
  .xhsCx-tag{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:var(--c); line-height:1; flex:0 0 auto;
    text-shadow:0 0 16px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCx-bd{ display:flex; flex-direction:column; gap:6px; min-width:0; }
  .xhsCx-hd{ font-size:30px; font-weight:800; color:#fff; }
  .xhsCx-sb{ font-size:20px; font-weight:600; color:#b6b6b6; }
  .xhsCx-row.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCx-row.is-hot{ border-color:var(--c); box-shadow:0 0 56px color-mix(in srgb, var(--c) 26%, transparent); transform:translateX(8px); }
`;

const META = {
  id: 'coverIndex',
  label: '索引导读封面',
  Component: Slide74CoverIndex,
  defaults: {
    ...hlDefaults,
    accentTone: 'blue',
    itemCount: 4,
    focusEnabled: false,
    focusIndex: 1,
    showIssue: true,
    showSub: true,
    showDecorations: true,
    brand: 'AI CAPITAL',
    brandZh: '资本观察 · 特别报告',
    issueNo: 'NO.',
    issueVol: '04',
    issueYr: '2024 年刊',
    eyebrow: '封面故事 · COVER STORY',
    titleLead: '谁在',
    titleKeyword: '改写',
    titleTail: '估值规则',
    sub: '头部玩家、资本流向与一年翻倍的独角兽流水线',
    items: XHSCX_ITEMS,
  },
  controls: [
    ...hlControls,
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调(通用命名)' },
    { key: 'itemCount', type: 'slider', label: '索引卡数量', min: 2, max: 4, step: 1, default: 4, desc: '右侧索引卡数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一张索引卡' },
    { key: 'focusIndex', type: 'slider', label: '高亮第几个', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'itemCount', desc: '被高亮索引卡序号', showIf: (v) => v.focusEnabled },
    { key: 'showIssue', type: 'toggle', label: '期号徽标', default: true, desc: '期号徽标显隐' },
    { key: 'showSub', type: 'toggle', label: '副标题', default: true, desc: '副标题显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '谁在', desc: '关键词前的文字' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '改写', desc: '玻璃糖果胶囊里的关键词' },
    { key: 'titleTail', type: 'text', label: '标题后半', default: '估值规则', desc: '关键词后另起一行的文字' },
    { key: 'eyebrow', type: 'text', label: '眉标', default: '封面故事 · COVER STORY', desc: '标题上方的小标' },
    { key: 'sub', type: 'text', label: '副标题', default: '头部玩家、资本流向与一年翻倍的独角兽流水线', desc: '标题下方副标题', showIf: (v) => v.showSub },
    { key: 'brand', type: 'text', label: '刊名(英)', default: 'AI CAPITAL', desc: '顶部英文刊名' },
    { key: 'brandZh', type: 'text', label: '刊名(中)', default: '资本观察 · 特别报告', desc: '顶部中文刊名' },
    { key: 'issueNo', type: 'text', label: '期号前缀', default: 'NO.', desc: '期号徽标前缀', showIf: (v) => v.showIssue },
    { key: 'issueVol', type: 'text', label: '期号', default: '04', desc: '期号数字', showIf: (v) => v.showIssue },
    { key: 'issueYr', type: 'text', label: '期号年份', default: '2024 年刊', desc: '期号年份文字', showIf: (v) => v.showIssue },
    { type: 'section', label: '数据 · 索引卡' },
    {
      key: 'items', type: 'list', label: '索引卡', itemLabel: '索引', countFromKey: 'itemCount',
      fields: [{ key: 'tag', label: '编号' }, { key: 'head', label: '主句' }, { key: 'sub', label: '释义' }, { key: 'color', label: '颜色' }],
      default: XHSCX_ITEMS, desc: '右侧索引卡：编号 / 主句 / 释义 / 主色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide74CoverIndex.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide74CoverIndex;
