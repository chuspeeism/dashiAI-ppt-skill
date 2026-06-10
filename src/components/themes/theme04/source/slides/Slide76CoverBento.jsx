/*
 * Slide76CoverBento — 糖果速览封面（封面页 · 暗色玻璃标题板 + 玻璃糖果数据瓷砖速览）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时 / window。
 * CSS 前缀 xhsCb- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与其它封面互补：本页是「一图速览 / Bento」式封面——左上暗色玻璃标题板 + 一组玻璃糖果数据瓷砖
 * （绿 / 黄 / 蓝 / 粉），数量可调、自动 flex 重排。文本写死，仅结构/数量/显隐/配色由 props 暴露。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   标题板主色调(通用命名)      默认 'green' green/yellow/blue/pink
 *  tileCount       number 玻璃糖果瓷砖数量(2–4)       默认 4
 *  paletteVariant  enum   瓷砖配色: 多彩 / 单色        默认 'multi' multi/mono
 *  focusEnabled    bool   是否高亮某一块瓷砖          默认 false
 *  focusIndex      number 被高亮瓷砖序号(1–tileCount) 默认 1
 *  showIssue       bool   期号徽标显隐                默认 true
 *  showKicker      bool   瓷砖角标(英文小标)显隐      默认 true
 *  showDecorations bool   星芒等点缀显隐              默认 true
 *
 * 迁移：import Slide76CoverBento, { defaults, controls } from './Slide76CoverBento.jsx'
 */
import React from 'react';

const XHSCB_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 数据瓷砖默认值（作者文案写在文件内，可由 tiles prop 覆盖）：角标 / 大数 / 单位 / 标签 / 主色
const XHSCB_TILES = [
  { kick: 'TOTAL', big: '970', unit: '亿', lab: '全年融资总额', color: '#27E021' },
  { kick: 'SECTORS', big: '6', unit: '', lab: '赛道争霸', color: '#FFC700' },
  { kick: 'MEGA', big: '97', unit: '', lab: '笔大额轮', color: '#15A7F0' },
  { kick: 'VALUATION', big: '×3', unit: '', lab: '独角兽一年估值跃迁', color: '#FF9FE2' },
];

function CbSpark({ size = 22, color = '#fff', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <path fill={color} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

function Slide76CoverBento(props) {
  const {
    accentTone = 'green',
    tileCount = 4,
    paletteVariant = 'multi',
    focusEnabled = false,
    focusIndex = 1,
    showIssue = true,
    showKicker = true,
    showDecorations = true,
    // 文案
    brand = 'AI CAPITAL',
    brandZh = '资本观察',
    issueNo = 'NO.',
    issueVol = '04',
    issueYr = '2024 年刊',
    eyebrow = '一图速览 · AT A GLANCE',
    titleLead = 'AI 资本',
    titleTail = '全景图鉴',
    // 数据
    tiles = XHSCB_TILES,
  } = props;

  const accent = XHSCB_TONES[accentTone] || XHSCB_TONES.green;
  const src = Array.isArray(tiles) ? tiles : XHSCB_TILES;
  const tc = Math.max(2, Math.min(src.length, tileCount));
  const shown = src.slice(0, tc).map((t) => ({
    ...t,
    color: paletteVariant === 'mono' ? accent : t.color,
  }));
  const fi = Math.max(1, Math.min(tc, focusIndex)) - 1;

  // 首块进上排（紧贴标题板），其余进下排，flex 自动均分
  const topTile = shown[0];
  const bottomTiles = shown.slice(1);

  const tileCls = (i) => 'xhsCb-tile' + (focusEnabled ? (i === fi ? ' is-hot' : ' is-dim') : '');

  const renderTile = (t, i) => (
    <div key={i} className={tileCls(i)} style={{ '--c': t.color }}>
      {showKicker && <span className="xhsCb-kick">{t.kick}</span>}
      <span className="xhsCb-big">{t.big}{t.unit && <span className="xhsCb-unit">{t.unit}</span>}</span>
      <span className="xhsCb-lab">{t.lab}</span>
    </div>
  );

  return (
    <section className="xhs-base xhsCb-root" data-label="糖果速览封面" data-screen-label="糖果速览封面"
      style={{ '--c': accent }}>
      <style>{XHSCB_CSS}</style>

      <div className="xhsCb-row xhsCb-row1">
        <div className="xhsCb-plate">
          <div className="xhsCb-mh">
            <span className="xhsCb-brand">{brand}</span>
            <span className="xhsCb-brandZh">{brandZh}</span>
            {showIssue && (
              <span className="xhsCb-issue"><i className="xhsCb-issueNo">{issueNo}</i><b>{issueVol}</b><span className="xhsCb-issueYr">{issueYr}</span></span>
            )}
          </div>
          <div className="xhsCb-titleWrap">
            <span className="xhsCb-eyebrow">{eyebrow}</span>
            <h2 className="xhsCb-title">{titleLead}<br />{titleTail}</h2>
          </div>
        </div>
        {topTile && renderTile(topTile, 0)}
      </div>

      {bottomTiles.length > 0 && (
        <div className="xhsCb-row xhsCb-row2">
          {bottomTiles.map((t, i) => renderTile(t, i + 1))}
        </div>
      )}

      {showDecorations && (
        <CbSpark size={16} color="#fff" style={{ position: 'absolute', right: 70, top: 40, zIndex: 6 }} />
      )}
    </section>
  );
}

const XHSCB_CSS = `
  .xhsCb-root{ position:relative; box-sizing:border-box; height:100%; overflow:hidden; color:#fff; background:#000; padding:62px;
    display:flex; flex-direction:column; gap:26px; }
  .xhsCb-root *{ box-sizing:border-box; }

  .xhsCb-row{ display:flex; gap:26px; min-height:0; }
  .xhsCb-row1{ flex:1.05; }
  .xhsCb-row2{ flex:1; }

  .xhsCb-plate{ flex:3; position:relative; border-radius:34px; overflow:hidden; padding:56px 60px;
    display:flex; flex-direction:column; justify-content:space-between;
    background:linear-gradient(150deg, #141414, #060606 78%);
    border:1.5px solid rgba(255,255,255,.12); box-shadow:0 26px 70px rgba(0,0,0,.6); }
  .xhsCb-mh{ display:flex; align-items:baseline; gap:20px; }
  .xhsCb-brand{ font-family:"Space Mono",monospace; font-weight:700; font-size:38px; letter-spacing:.06em; color:#fff; }
  .xhsCb-brandZh{ font-size:24px; font-weight:700; letter-spacing:.14em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent); }
  .xhsCb-issue{ margin-left:auto; display:inline-flex; align-items:baseline; gap:8px; padding:8px 20px; border-radius:12px;
    background:rgba(0,0,0,.45); border:1.5px solid rgba(255,255,255,.18); }
  .xhsCb-issueNo{ font-family:"Space Mono",monospace; font-style:normal; font-size:19px; font-weight:700; color:#bdbdbd; }
  .xhsCb-issue b{ font-family:"Space Mono",monospace; font-size:32px; font-weight:700; color:var(--c); line-height:1; }
  .xhsCb-issueYr{ font-size:17px; font-weight:700; color:#cfcfcf; letter-spacing:.06em; white-space:nowrap; }
  .xhsCb-eyebrow{ font-family:"Space Mono",monospace; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    font-size:24px; color:var(--c); text-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCb-title{ margin:18px 0 0; font-size:108px; font-weight:900; line-height:1.04; letter-spacing:-.02em; color:#fff; }

  .xhsCb-tile{ flex:1; position:relative; isolation:isolate; border-radius:34px; overflow:hidden;
    display:flex; flex-direction:column; justify-content:flex-end; padding:48px; color:#06140f;
    background:linear-gradient(165deg, color-mix(in srgb, var(--c) 72%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 86%, #000) 100%);
    box-shadow:0 26px 70px color-mix(in srgb, var(--c) 34%, transparent),
      inset 0 5px 0 rgba(255,255,255,.7), inset 0 0 40px rgba(255,255,255,.34),
      inset 0 -36px 60px color-mix(in srgb, var(--c) 52%, #000);
    transition:transform .2s ease; }
  .xhsCb-tile::before{ content:""; position:absolute; left:22px; right:22px; top:14px; height:40%; z-index:-1;
    border-radius:24px 24px 60px 60px; pointer-events:none;
    background:linear-gradient(180deg, rgba(255,255,255,.62) 0%, rgba(255,255,255,0) 100%); }
  .xhsCb-kick{ position:absolute; top:36px; left:48px; font-family:"Space Mono",monospace; font-size:20px; font-weight:700; letter-spacing:.1em; opacity:.62; }
  .xhsCb-big{ font-family:"Space Mono",monospace; font-size:88px; font-weight:700; line-height:.92; letter-spacing:-.02em; }
  .xhsCb-unit{ font-size:.42em; }
  .xhsCb-lab{ margin-top:14px; font-size:26px; font-weight:800; }
  .xhsCb-tile.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCb-tile.is-hot{ transform:translateY(-8px); box-shadow:0 0 70px color-mix(in srgb, var(--c) 50%, transparent),
      inset 0 5px 0 rgba(255,255,255,.7), inset 0 0 40px rgba(255,255,255,.34), inset 0 -36px 60px color-mix(in srgb, var(--c) 52%, #000); }
`;

const META = {
  id: 'coverBento',
  label: '糖果速览封面',
  Component: Slide76CoverBento,
  defaults: {
    accentTone: 'green',
    tileCount: 4,
    paletteVariant: 'multi',
    focusEnabled: false,
    focusIndex: 1,
    showIssue: true,
    showKicker: true,
    showDecorations: true,
    brand: 'AI CAPITAL',
    brandZh: '资本观察',
    issueNo: 'NO.',
    issueVol: '04',
    issueYr: '2024 年刊',
    eyebrow: '一图速览 · AT A GLANCE',
    titleLead: 'AI 资本',
    titleTail: '全景图鉴',
    tiles: XHSCB_TILES,
  },
  controls: [
    { key: 'accentTone', type: 'radio', label: '标题板主色', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '标题板主色调(通用命名)' },
    { key: 'tileCount', type: 'slider', label: '瓷砖数量', min: 2, max: 4, step: 1, default: 4, desc: '玻璃糖果数据瓷砖数量(自动重排)' },
    { key: 'paletteVariant', type: 'radio', label: '瓷砖配色', options: ['multi', 'mono'], optionLabels: ['多彩', '单色'], default: 'multi', desc: '瓷砖多彩 / 统一主色' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一块瓷砖' },
    { key: 'focusIndex', type: 'slider', label: '高亮第几个', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'tileCount', desc: '被高亮瓷砖序号', showIf: (v) => v.focusEnabled },
    { key: 'showIssue', type: 'toggle', label: '期号徽标', default: true, desc: '期号徽标显隐' },
    { key: 'showKicker', type: 'toggle', label: '瓷砖角标', default: true, desc: '瓷砖英文小标显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: 'AI 资本', desc: '标题第一行' },
    { key: 'titleTail', type: 'text', label: '标题后半', default: '全景图鉴', desc: '标题第二行' },
    { key: 'eyebrow', type: 'text', label: '眉标', default: '一图速览 · AT A GLANCE', desc: '标题上方的小标' },
    { key: 'brand', type: 'text', label: '刊名(英)', default: 'AI CAPITAL', desc: '标题板英文刊名' },
    { key: 'brandZh', type: 'text', label: '刊名(中)', default: '资本观察', desc: '标题板中文刊名' },
    { key: 'issueNo', type: 'text', label: '期号前缀', default: 'NO.', desc: '期号徽标前缀', showIf: (v) => v.showIssue },
    { key: 'issueVol', type: 'text', label: '期号', default: '04', desc: '期号数字', showIf: (v) => v.showIssue },
    { key: 'issueYr', type: 'text', label: '期号年份', default: '2024 年刊', desc: '期号年份文字', showIf: (v) => v.showIssue },
    { type: 'section', label: '数据 · 瓷砖' },
    {
      key: 'tiles', type: 'list', label: '数据瓷砖', itemLabel: '瓷砖', countFromKey: 'tileCount',
      fields: [{ key: 'kick', label: '角标' }, { key: 'big', label: '大数' }, { key: 'unit', label: '单位' }, { key: 'lab', label: '标签' }, { key: 'color', label: '颜色' }],
      default: XHSCB_TILES, desc: '数据瓷砖：角标 / 大数 / 单位 / 标签 / 主色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide76CoverBento.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide76CoverBento;
