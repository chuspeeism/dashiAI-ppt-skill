/*
 * _Highlight.jsx — 共享「标题关键词高亮」基座（独立、不污染 :root，可随页面一起迁移）
 * ────────────────────────────────────────────────────────────────────────
 * 把原本散落在各页（xhsXx-hl / xhsXx-mark）的关键词高亮，统一成一个可切换样式的
 * 胶囊组件。四种样式 + 倾斜角度，全部由 props 驱动；样式只注入一次、作用域收在
 * `.xhsHL` 类名下，绝不触碰 :root。各页只需 import 本文件并用 <HL> 包住关键词。
 *
 * ── 用法 ──────────────────────────────────────────────────────────────
 *   import { HL, hlControls, hlDefaults } from './_Highlight.jsx';
 *   <HL color="#FFC700" variant={hlStyle} tilt={hlTilt}>通用大模型</HL>
 *
 *   // 在该页 META 里并入共享的两个控件 / 默认值：
 *   defaults: { ...hlDefaults, /* 本页其它默认 *\/ }
 *   controls: [ ...hlControls, /* 本页其它控件 *\/ ]
 *
 * ── 参数 ──────────────────────────────────────────────────────────────
 *   variant  'glass' | 'pill' | 'underline' | 'text'   默认 'glass'
 *   tilt     number（度，仅 glass/pill 生效，方向由调用方决定）  默认 0
 *   color    CSS 颜色（驱动 --c）
 *   nowrap   boolean  是否强制不换行（默认整体 nowrap，多用于长短语）
 */
import React from 'react';

export const HL_STYLE_OPTIONS = ['glass', 'pill', 'underline', 'text'];
export const HL_STYLE_LABELS = ['玻璃糖果', '扁平药丸', '下划线', '纯文字'];

const HL_CSS = `
.xhsHL{ display:inline-block; position:relative; font-weight:900; white-space:nowrap;
  margin:0 .08em; letter-spacing:.01em; --hl-tilt:0deg; }
.xhsHL-txt{ position:relative; z-index:2; }

/* ① 玻璃糖果胶囊：实色亮底渐变 + 顶部高光光泽 + 底部收暗（第 4 页同款设计语言） */
.xhsHL--glass{ color:#06140f; padding:.09em .42em .16em; border-radius:.3em; isolation:isolate;
  transform:rotate(var(--hl-tilt));
  background:linear-gradient(168deg, color-mix(in srgb, var(--c) 70%, #fff) 0%, var(--c) 48%,
    color-mix(in srgb, var(--c) 88%, #000) 100%);
  box-shadow:0 .22em .5em color-mix(in srgb, var(--c) 40%, transparent),
    inset 0 3px 0 rgba(255,255,255,.72), inset 0 0 22px rgba(255,255,255,.4),
    inset 0 -14px 24px color-mix(in srgb, var(--c) 55%, #000); }
.xhsHL--glass::before{ content:""; position:absolute; left:9px; right:9px; top:5px; height:42%; z-index:1;
  border-radius:.22em .22em .42em .42em; pointer-events:none;
  background:linear-gradient(180deg, rgba(255,255,255,.6) 0%, rgba(255,255,255,0) 100%); }

/* ② 扁平实色药丸：实色填充 + 内白沿高光（原 -mark / -hl 通行款） */
.xhsHL--pill{ color:#06140f; padding:.04em .38em .07em; border-radius:.24em; background:var(--c);
  transform:rotate(var(--hl-tilt));
  box-shadow:0 .18em .46em color-mix(in srgb, var(--c) 34%, transparent),
    inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }

/* ③ 下划线：彩色文字 + 底部粗下划线 */
.xhsHL--underline{ color:var(--c); padding:0 .04em .1em;
  background:linear-gradient(var(--c), var(--c)) bottom/100% .14em no-repeat; border-radius:2px; }

/* ④ 纯彩色文字：仅着色，带轻微发光 */
.xhsHL--text{ color:var(--c); text-shadow:0 0 .5em color-mix(in srgb, var(--c) 32%, transparent); }
`;

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('style[data-xhs-hl]')) return;
  const el = document.createElement('style');
  el.setAttribute('data-xhs-hl', '');
  el.textContent = HL_CSS;
  document.head.appendChild(el);
}

export function HL(props) {
  const {
    children,
    color = '#FFC700',
    variant = 'glass',
    tilt = 0,
    nowrap = true,
    className = '',
    style,
  } = props;
  ensureStyles();
  const cls = 'xhsHL xhsHL--' + variant + (className ? ' ' + className : '');
  return (
    <span
      className={cls}
      style={{
        '--c': color,
        '--hl-tilt': (tilt || 0) + 'deg',
        whiteSpace: nowrap ? 'nowrap' : 'normal',
        ...style,
      }}
    >
      <span className="xhsHL-txt">{children}</span>
    </span>
  );
}

// 共享的两个 Tweaks 控件 / 默认值：并入各页 META，键名与页面 props 一一对应。
export const hlDefaults = { hlStyle: 'glass', hlTilt: 2 };

export const hlControls = [
  {
    key: 'hlStyle', type: 'radio', label: '高亮样式',
    options: HL_STYLE_OPTIONS, optionLabels: HL_STYLE_LABELS,
    default: 'glass', desc: '关键词高亮：玻璃糖果 / 扁平药丸 / 下划线 / 纯文字',
  },
  {
    key: 'hlTilt', type: 'slider', label: '高亮倾斜', min: 0, max: 4, step: 1,
    default: 2, desc: '关键词胶囊旋转角度（仅糖果/药丸样式生效）',
  },
];

export default HL;
