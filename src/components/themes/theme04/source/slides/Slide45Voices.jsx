/*
 * Slide45Voices — 投资人说（金句页 · 多人观点墙 + 头像图片槽）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsVo- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与单句金句页（Statement / QuoteImage）互补：把多条「观点」并列成卡片墙，每张卡
 * 顶部一枚圆形头像图片槽（cover 填满受控圆框、永不溢出），mediaCount 控制有多少张
 * 真正显示头像槽，其余回退「霓虹首字母」无图态，保证构图不塌。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  cardCount       number 观点卡数量(2–3)       默认 3
 *  mediaCount      number 显示头像槽的卡片数(0–3) 默认 0   (其余转首字母无图态)
 *  focusEnabled    bool   重点卡高亮开关          默认 false
 *  focusIndex      number 重点卡序号(从1起)      默认 1   范围 1–cardCount
 *  showRole        bool   署名下职务行显隐        默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide45Voices, { defaults, controls } from './Slide45Voices.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 3 条观点（写死）：金句 / 署名 / 职务 / 主色 / 首字母 / 头像占位说明
const XHSVO_CARDS = [
  {
    quote: '构建可解释、可控的系统，比单纯追求规模更符合长远利益。',
    name: 'Dario Amodei', role: 'Anthropic 联合创始人 / CEO',
    color: '#27E021', initial: 'DA', ph: '人物头像',
  },
  {
    quote: '资本正在从「赌叙事」转向「看兑现」——能把技术变成收入的公司才留在牌桌上。',
    name: '本报告 · 核心判断', role: '横纵分析法 · 结论篇',
    color: '#FFC700', initial: '判', ph: '观点配图',
  },
  {
    quote: '淘金热里，提前锁定算力的「卖铲子」的人，反而成了最稀缺的标的。',
    name: '基础设施视角', role: '案例 · CoreWeave 算力云',
    color: '#15A7F0', initial: 'IN', ph: '人物头像',
  },
];

function VoSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE45VOICES_COPY = {
  text001: "观点墙 · WHAT THEY SAY",
  text002: "三种声音，一个共识：",
  text003: "从叙事到兑现",
  text004: "“",
};
function Slide45Voices(props) {
  const {
      copy = SLIDE45VOICES_COPY,
      cardsData = XHSVO_CARDS,
    cardCount = 3,
    mediaCount = 0,
    focusEnabled = false,
    focusIndex = 1,
    showRole = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(3, cardCount));
  const media = Math.max(0, Math.min(n, mediaCount));
  const cards = cardsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;

  return (
    <section className="xhs-base xhsVo-root" data-label="投资人说" data-screen-label="投资人说">
      <style>{XHSVO_CSS}</style>

      <header className="xhsVo-head">
        <div className="xhsVo-kicker">{copy.text001}</div>
        <h2 className="xhsVo-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsVo-wall" style={{ '--n': n }}>
        {cards.map((c, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          const asImage = i < media;
          return (
            <figure key={i} className={'xhsVo-card' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')} style={{ '--c': c.color }}>
              <span className="xhsVo-mark" aria-hidden="true">{copy.text004}</span>
              <blockquote className="xhsVo-quote">{c.quote}</blockquote>
              <figcaption className="xhsVo-by">
                <span className="xhsVo-avatar">
                  {asImage ? (
                    <image-slot id={`xhsVo-media-${i}`} fit="cover" shape="circle" placeholder={c.ph}></image-slot>
                  ) : (
                    <span className="xhsVo-initial">{c.initial}</span>
                  )}
                </span>
                <span className="xhsVo-by-txt">
                  <span className="xhsVo-name">{c.name}</span>
                  {showRole && <span className="xhsVo-role">{c.role}</span>}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <VoSpark size={24} color="#27E021" style={{ position: 'absolute', right: 92, top: 148 }} />
          <VoSpark size={15} color="#FFC700" style={{ position: 'absolute', left: 82, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSVO_CSS = `
  .xhsVo-root{ padding:74px 110px 60px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsVo-head{ flex:0 0 auto; margin-bottom:30px; }
  .xhsVo-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsVo-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsVo-wall{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--n),1fr); gap:30px; align-items:stretch; }

  .xhsVo-card{ margin:0; position:relative; box-sizing:border-box; display:flex; flex-direction:column;
    border-radius:24px; padding:38px 40px 34px; overflow:hidden;
    border:1.5px solid color-mix(in srgb, var(--c) 40%, rgba(255,255,255,.08));
    background:
      radial-gradient(120% 90% at 14% 0%, color-mix(in srgb, var(--c) 18%, transparent) 0%, transparent 54%),
      linear-gradient(158deg, color-mix(in srgb, var(--c) 12%, #151515), #0b0b0b 72%);
    box-shadow:0 20px 50px rgba(0,0,0,.5);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsVo-card::after{ content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
    background:linear-gradient(135deg, color-mix(in srgb, var(--c) 14%, transparent), transparent 44%); }
  .xhsVo-card.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsVo-card.is-hot{ border-color:var(--c); transform:translateY(-6px);
    box-shadow:0 0 56px color-mix(in srgb, var(--c) 26%, transparent); z-index:2; }

  .xhsVo-mark, .xhsVo-quote, .xhsVo-by{ position:relative; z-index:1; }

  .xhsVo-mark{ font-family:"Space Mono",monospace; font-size:120px; line-height:.7; color:var(--c); opacity:.5;
    text-shadow:0 0 30px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsVo-quote{ margin:14px 0 0; flex:1 1 auto; display:flex; flex-direction:column; justify-content:center;
    font-size:33px; font-weight:800; line-height:1.32; color:#f4f4f4; text-wrap:pretty; }

  .xhsVo-by{ display:flex; align-items:center; gap:18px; margin-top:30px; padding-top:26px;
    border-top:1.5px solid rgba(255,255,255,.08); }
  .xhsVo-avatar{ flex-shrink:0; width:74px; height:74px; border-radius:50%; overflow:hidden; position:relative;
    border:2px solid color-mix(in srgb, var(--c) 60%, transparent);
    box-shadow:0 0 24px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsVo-avatar image-slot{ width:100%; height:100%; display:block; }
  .xhsVo-initial{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    font-family:"Space Mono",monospace; font-weight:700; font-size:28px; color:var(--c);
    background:radial-gradient(120% 120% at 50% 24%, color-mix(in srgb, var(--c) 32%, #101010) 0%, #0a0a0a 72%);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsVo-by-txt{ display:flex; flex-direction:column; gap:4px; min-width:0; }
  .xhsVo-name{ font-size:24px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsVo-role{ font-size:17px; font-weight:500; color:#9a9a9a; line-height:1.2; }
`;

const META = {
  id: 'voices',
  label: '投资人说',
  Component: Slide45Voices,
  defaults: {
      copy: SLIDE45VOICES_COPY,
      cardsData: XHSVO_CARDS,
    ...hlDefaults,
    cardCount: 3,
    mediaCount: 0,
    focusEnabled: false,
    focusIndex: 1,
    showRole: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }], default: SLIDE45VOICES_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'cardsData', type: 'list', label: 'cardsData', itemLabel: '数据', fields: [{ key: "quote", label: "quote" }, { key: "name", label: "name" }, { key: "role", label: "role" }, { key: "color", label: "color" }, { key: "initial", label: "initial" }, { key: "ph", label: "ph" }], default: XHSVO_CARDS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'cardCount', type: 'slider', label: '观点卡数', min: 2, max: 3, step: 1, default: 3, desc: '展示的观点卡数量' },
    { key: 'mediaCount', type: 'slider', label: '头像图片槽', min: 0, max: 3, step: 1, default: 0, maxFromKey: 'cardCount', desc: '显示头像槽的卡片数(其余转首字母)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一张卡片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'cardCount', showIf: (v) => v.focusEnabled, desc: '被高亮卡片的序号' },
    { key: 'showRole', type: 'toggle', label: '职务行', default: true, desc: '署名下职务行显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide45Voices.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide45Voices;
