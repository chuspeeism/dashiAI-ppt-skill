/*
 * Slide29Diptych — 双联对比（图片页 · 左右双图片槽 + VS 中缝 + 对位要点）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsDp- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 图片槽（image-slot）：
 *  - 两个并排 cover 画框（受控等高），各自填满、永不溢出，构图天然对齐；
 *  - mediaCount 控制带图片槽的面板数（0/1/2），无图面板转纯色霓虹标题态。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 带图片槽的面板数(0–2)  默认 2
 *  pointCount      number 每侧对位要点数         默认 3   可选 0–3
 *  focusSide       enum   重点侧                默认 'none' 可选 'none'|'left'|'right'
 *  showVsBadge     bool   中缝 VS 徽章显隐        默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide29Diptych, { defaults, controls } from './Slide29Diptych.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSDP_SIDES = [
  {
    key: 'left', era: '2023', color: '#15A7F0', title: '赌「叙事」', en: 'BET ON STORY',
    desc: '愿景与团队即可撬动巨额融资，市场为想象空间买单。',
    points: ['宏大愿景驱动估值', 'PPT 与 Demo 即可融资', '增长速度优先于利润'],
  },
  {
    key: 'right', era: '2024', color: '#27E021', title: '看「兑现」', en: 'SHOW THE PROOF',
    desc: '资本回归理性，营收与留存成为穿越周期的硬通货。',
    points: ['营收能力成为分水岭', '单位经济模型被审视', '商业化进度决定下一轮'],
  },
];

function DpSpark({ size = 20, color = '#fff', style }) {
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

function DpPanel({ side, hasImg, points, dim, hot, slotId }) {
  return (
    <figure className={'xhsDp-panel' + (dim ? ' is-dim' : '') + (hot ? ' is-hot' : '')} style={{ '--c': side.color }}>
      <div className="xhsDp-media">
        {hasImg ? (
          <image-slot id={slotId} fit="cover" shape="rect" placeholder={`${side.era} · ${side.title}　配图`}></image-slot>
        ) : (
          <div className="xhsDp-noimg"><span className="xhsDp-noimg-en">{side.en}</span></div>
        )}
        <span className="xhsDp-scrim" aria-hidden="true" />
        <div className="xhsDp-cap">
          <span className="xhsDp-era">{side.era}</span>
          <span className="xhsDp-ptitle">{side.title}</span>
        </div>
      </div>

      <figcaption className="xhsDp-info">
        <p className="xhsDp-desc">{side.desc}</p>
        {points.length > 0 && (
          <ul className="xhsDp-points">
            {points.map((p, i) => (
              <li key={i}><span className="xhsDp-pdot" />{p}</li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}


const SLIDE29DIPTYCH_COPY = {
  text001: "范式转折 · NARRATIVE → PROOF",
  text002: "从赌",
  text003: "叙事",
  text004: "，到看",
  text005: "兑现",
  text006: "VS",
};
function Slide29Diptych(props) {
  const {
      copy = SLIDE29DIPTYCH_COPY,
      sidesData = XHSDP_SIDES,
    mediaCount = 2,
    pointCount = 3,
    focusSide = 'none',
    showVsBadge = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const media = Math.max(0, Math.min(2, mediaCount));
  const pc = Math.max(0, Math.min(3, pointCount));

  return (
    <section className="xhs-base xhsDp-root" data-label="叙事对兑现" data-screen-label="叙事对兑现">
      <style>{XHSDP_CSS}</style>

      <header className="xhsDp-head">
        <div className="xhsDp-kicker">{copy.text001}</div>
        <h2 className="xhsDp-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>{copy.text004}<HL color="#27E021" variant={hlStyle} tilt={hlTilt}>{copy.text005}</HL>
        </h2>
      </header>

      <div className="xhsDp-stage">
        <DpPanel side={sidesData[0]} hasImg={media >= 1} slotId="xhsDp-media-0"
          points={sidesData[0].points.slice(0, pc)}
          dim={focusSide === 'right'} hot={focusSide === 'left'} />

        {showVsBadge && (
          <div className="xhsDp-vs" aria-hidden="true">
            <span className="xhsDp-vsline" />
            <span className="xhsDp-vsbadge">{copy.text006}</span>
            <span className="xhsDp-vsline" />
          </div>
        )}

        <DpPanel side={sidesData[1]} hasImg={media >= 2} slotId="xhsDp-media-1"
          points={sidesData[1].points.slice(0, pc)}
          dim={focusSide === 'left'} hot={focusSide === 'right'} />
      </div>

      {showDecorations && (
        <React.Fragment>
          <DpSpark size={24} color="#FFC700" style={{ position: 'absolute', left: 84, bottom: 70 }} />
          <DpSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 96, top: 150 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSDP_CSS = `
  .xhsDp-root{ padding:70px 96px 60px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsDp-head{ flex:0 0 auto; margin-bottom:30px; text-align:center; }
  .xhsDp-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.16em; color:#7c7c7c; margin-bottom:14px; }
  .xhsDp-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsDp-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:stretch; gap:0; }
  .xhsDp-panel{ flex:1 1 0; margin:0; display:flex; flex-direction:column; min-width:0; min-height:0; border-radius:24px; overflow:hidden;
    background:linear-gradient(160deg,#161616,#0c0c0c); border:1.5px solid rgba(255,255,255,.08);
    box-shadow:0 24px 56px rgba(0,0,0,.55);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsDp-panel.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsDp-panel.is-hot{ border-color:var(--c); transform:translateY(-6px) scale(1.01);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 32%, transparent); }

  .xhsDp-media{ position:relative; width:100%; flex:1 1 auto; min-height:0; overflow:hidden; background:#0a0a0a; }
  .xhsDp-media image-slot{ width:100%; height:100%; display:block; }
  .xhsDp-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(120% 120% at 50% 26%, color-mix(in srgb, var(--c) 30%, #101010) 0%, #0a0a0a 72%); }
  .xhsDp-noimg-en{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; letter-spacing:.08em; color:var(--c); opacity:.7;
    text-shadow:0 0 36px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsDp-scrim{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 32%, transparent 58%, rgba(0,0,0,.6) 100%); }
  .xhsDp-cap{ position:absolute; left:30px; bottom:24px; z-index:2; display:flex; flex-direction:column; gap:6px; }
  .xhsDp-era{ font-family:"Space Mono",monospace; font-size:24px; font-weight:700; letter-spacing:.08em; color:var(--c);
    text-shadow:0 0 16px color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsDp-ptitle{ font-size:50px; font-weight:900; color:#fff; line-height:1; text-shadow:0 2px 18px rgba(0,0,0,.6); }

  .xhsDp-info{ flex:0 0 auto; padding:26px 32px 30px; display:flex; flex-direction:column; gap:18px; }
  .xhsDp-desc{ margin:0; font-size:24px; line-height:1.5; font-weight:500; color:#b6b6b6; }
  .xhsDp-points{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:12px; }
  .xhsDp-points li{ display:flex; align-items:center; gap:14px; font-size:23px; font-weight:600; color:#dcdcdc; }
  .xhsDp-pdot{ flex:0 0 auto; width:12px; height:12px; border-radius:4px; background:var(--c);
    box-shadow:0 0 12px color-mix(in srgb, var(--c) 65%, transparent); }

  .xhsDp-vs{ flex:0 0 auto; width:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; }
  .xhsDp-vsline{ width:3px; flex:1; background:linear-gradient(180deg, transparent, rgba(255,255,255,.22), transparent); }
  .xhsDp-vsbadge{ flex:0 0 auto; width:84px; height:84px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:#fff;
    background:linear-gradient(150deg,#1c1c1c,#0c0c0c); border:2px solid rgba(255,255,255,.22);
    box-shadow:0 12px 30px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.18); }
`;

const META = {
  id: 'diptych',
  label: '叙事对兑现',
  Component: Slide29Diptych,
  defaults: {
      copy: SLIDE29DIPTYCH_COPY,
      sidesData: XHSDP_SIDES,
    ...hlDefaults,
    mediaCount: 2,
    pointCount: 3,
    focusSide: 'none',
    showVsBadge: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }], default: SLIDE29DIPTYCH_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'sidesData', type: 'list', label: 'sidesData', itemLabel: '数据', fields: [{ key: "key", label: "key" }, { key: "era", label: "era" }, { key: "color", label: "color" }, { key: "title", label: "title" }, { key: "en", label: "en" }, { key: "desc", label: "desc" }], default: XHSDP_SIDES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 2, step: 1, default: 2, desc: '带图片槽的面板数(其余转霓虹标题态)' },
    { key: 'pointCount', type: 'slider', label: '要点数量', min: 0, max: 3, step: 1, default: 3, desc: '每侧对位要点数量' },
    { key: 'focusSide', type: 'radio', label: '重点侧', options: ['none', 'left', 'right'], optionLabels: ['不强调', '左侧', '右侧'], default: 'none', desc: '高亮左 / 右面板' },
    { key: 'showVsBadge', type: 'toggle', label: 'VS 徽章', default: true, desc: '中缝 VS 徽章显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide29Diptych.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide29Diptych;
