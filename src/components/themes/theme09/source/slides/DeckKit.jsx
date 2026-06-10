/* ============================================================================
   DeckKit.jsx — 迁移友好的共享基座（设计令牌 + 作用域样式 + 复用结构件）

   标准 ES Module：所有导出走 `export`，不写 window 全局。迁入任意 React 工程：
     import { useDeckStyles, deckTheme, SlideShell, SlideHead, deckLabel } from './DeckKit.jsx';

   样式作用域：所有令牌与工具类都收在 `.dk-scope` 容器内（不污染全局 :root）。
   使用方只需把幻灯片包进一个带 class="dk-scope" 的容器（本工程加在 <deck-stage> 上）。
   迁移到其它工程时，给你的演示根节点加 className="dk-scope" 即可，令牌不会外泄。

   关于 React：组件直接使用全局 UMD 的 React（库本身，非本项目的注册）。迁入标准
   工程时在每个文件顶部加 `import React from 'react'` 即可，组件逻辑无需改动。
   ========================================================================== */

/* ---- 默认设计令牌（可被各页 props.theme 覆盖） ------------------------------ */
export const DECK_THEME = {
  fontDisplay: "'Archivo','Noto Sans SC',sans-serif",
  fontCN:      "'Noto Sans SC','Archivo',sans-serif",
  fontMono:    "'Space Mono',monospace",
  fontScript:  "'Caveat',cursive",
  ink:'#ffffff', inkDim:'rgba(255,255,255,.66)', inkFaint:'rgba(255,255,255,.40)',
  accent:'#46e3c6',
  blue:'#4a86ff', blueDeep:'#1d49d6', blueElectric:'#2f6bff',
  violet:'#9f7bff',
  warn:'#ffb27a',
  navyCard:'#0a1230', navy900:'#050b22', glassLine:'rgba(255,255,255,.22)', radius:26,
  type:{ mega:300, title:88, h2:64, sub:40, body:30, small:26, tiny:24 },
  pad:{ x:110, y:90 },
};

/* 合并主题：浅合并 + type/pad 二级合并 */
export function deckTheme(override){
  const o = override || {};
  return {
    ...DECK_THEME, ...o,
    type: { ...DECK_THEME.type, ...(o.type||{}) },
    pad:  { ...DECK_THEME.pad,  ...(o.pad||{}) },
  };
}

/* ---- 作用域样式（全部收在 .dk-scope 容器内，不写 :root） -------------------- */
function buildDeckCSS(t){
  return `
  .dk-scope{
    --type-mega:${t.type.mega}px; --type-title:${t.type.title}px; --type-h2:${t.type.h2}px;
    --type-sub:${t.type.sub}px; --type-body:${t.type.body}px; --type-small:${t.type.small}px; --type-tiny:${t.type.tiny}px;
    --pad-x:${t.pad.x}px; --pad-y:${t.pad.y}px;
    --dk-accent:${t.accent}; --mint:${t.accent};
    --dk-blue:${t.blue}; --blue-bright:${t.blue}; --blue-deep:${t.blueDeep}; --blue-electric:${t.blueElectric}; --dk-violet:${t.violet}; --dk-warn:${t.warn};
    --ink:${t.ink}; --ink-dim:${t.inkDim}; --ink-faint:${t.inkFaint};
    --navy-card:${t.navyCard}; --navy-900:${t.navy900}; --glass-line:${t.glassLine}; --dk-radius:${t.radius}px;
    --font-display:${t.fontDisplay}; --font-cn:${t.fontCN}; --font-mono:${t.fontMono}; --font-script:${t.fontScript};
    font-family:var(--font-cn); color:var(--ink);
  }
  .dk-scope section{ font-family:var(--font-cn); color:var(--ink); overflow:hidden; -webkit-font-smoothing:antialiased; }
  .dk-scope .dk-glass{
    background:linear-gradient(150deg,rgba(255,255,255,.14),rgba(255,255,255,.05));
    border:1px solid var(--glass-line);
    backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
    box-shadow:0 24px 60px rgba(3,8,30,.4), inset 0 1px 0 rgba(255,255,255,.25);
  }
  .dk-scope .dk-glass-dark{
    background:linear-gradient(150deg,rgba(10,18,48,.72),rgba(6,12,34,.5));
    border:1px solid rgba(255,255,255,.12);
    backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
  }
  .dk-scope .dk-chrome{
    background:linear-gradient(176deg,#ffffff 0%,#f0f5ff 30%,#c2d2ff 52%,#8ea7f4 64%,#e9f0ff 80%,#ffffff 100%);
    -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 8px 20px rgba(4,14,60,.45));
  }
  .dk-scope .dk-ink-grad{
    background:linear-gradient(180deg,#ffffff 0%,#dfe8ff 60%,#b7c8ff 100%);
    -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
  }
  .dk-scope .dk-orb{ position:absolute; border-radius:50%; filter:blur(2px); pointer-events:none; }
  .dk-scope .dk-glass-chip{
    border-radius:30%;
    background:radial-gradient(120% 120% at 30% 22%, rgba(255,255,255,.85), rgba(140,180,255,.5) 40%, rgba(40,90,230,.55) 70%, rgba(12,40,150,.7) 100%);
    box-shadow:0 20px 50px rgba(20,60,200,.55), inset 0 2px 6px rgba(255,255,255,.7), inset 0 -10px 24px rgba(10,30,120,.6);
    border:1px solid rgba(255,255,255,.4);
  }
  .dk-scope .dk-watermark{ position:absolute; inset:0; pointer-events:none; overflow:hidden; opacity:.05; z-index:0; }
  .dk-scope .dk-watermark span{ position:absolute; white-space:nowrap; font-family:var(--font-mono); font-size:34px; letter-spacing:.3em; color:#fff; transform:rotate(-30deg); }
  @media (prefers-reduced-motion: no-preference){
    .dk-scope [data-deck-active] .dk-anim{ animation:dkRise .7s cubic-bezier(.2,.7,.2,1) both; }
    .dk-scope [data-deck-active] .dk-anim.d1{ animation-delay:.06s; }
    .dk-scope [data-deck-active] .dk-anim.d2{ animation-delay:.14s; }
    .dk-scope [data-deck-active] .dk-anim.d3{ animation-delay:.22s; }
    .dk-scope [data-deck-active] .dk-anim.d4{ animation-delay:.30s; }
    .dk-scope [data-deck-active] .dk-anim.d5{ animation-delay:.38s; }
    .dk-scope [data-deck-active] .dk-anim.d6{ animation-delay:.46s; }
    @keyframes dkRise{ from{opacity:0; transform:translateY(26px);} to{opacity:1; transform:none;} }
  }`;
}

function injectDeckStyles(theme){
  if(typeof document === 'undefined') return;
  const css = buildDeckCSS(theme || DECK_THEME);
  let el = document.getElementById('deckkit-base');
  if(!el){
    el = document.createElement('style');
    el.id = 'deckkit-base';
    document.head.appendChild(el);
  }
  if(el.textContent !== css) el.textContent = css;
}

/* React hook：组件 render 时确保基座样式存在（幂等，可被多页重复调用） */
export function useDeckStyles(theme){
  const css = React.useMemo(()=> theme ? deckTheme(theme) : DECK_THEME, [theme]);
  React.useLayoutEffect(()=>{ injectDeckStyles(css); }, [css]);
  if(typeof document !== 'undefined' && !document.getElementById('deckkit-base')) injectDeckStyles(css);
  return css;
}

/* ---- 标签徽标工具：数字 / 符号 / 关键词 ----------------------------------- */
export const DECK_SYMBOLS = ['◆','▲','●','■','★','✦'];
export function deckLabel(type, i, opts){
  const o = opts || {};
  if(type === 'symbol')  return (o.symbols || DECK_SYMBOLS)[i % (o.symbols ? o.symbols.length : DECK_SYMBOLS.length)];
  if(type === 'keyword') return o.keyword || 'ITEM';
  return o.number != null ? o.number : String(i + 1).padStart(2, '0');
}

/* ---- 复用结构件：内容页页眉（编号 + 英文 + 中文金属标题） ------------------ */
export function SlideHead({ no, en, cn, badge }){
  return (
    <div>
      <div className="dk-anim" style={{display:'flex', alignItems:'center', gap:18}}>
        <span style={{fontFamily:'var(--font-display)', fontWeight:900, fontSize:'var(--type-sub)', color:'var(--dk-accent)'}}>{badge || no}</span>
        <span style={{height:2, width:80, background:'var(--dk-accent)', flexShrink:0}}></span>
        <span style={{fontFamily:'var(--font-display)', fontWeight:600, fontSize:'var(--type-small)', color:'var(--ink-dim)', letterSpacing:'.06em', whiteSpace:'nowrap'}}>{en}</span>
      </div>
      <h2 className="dk-chrome dk-anim d1" style={{fontFamily:'var(--font-cn)', fontWeight:900, fontSize:'var(--type-h2)', lineHeight:1.05, letterSpacing:'.02em', marginTop:20, whiteSpace:'nowrap'}}>{cn}</h2>
    </div>
  );
}

/* ---- 复用结构件：页面外壳（100%×100% 填充 + 安全边距 + 可选光晕/装饰） ------ */
export function SlideShell({ children, pad = true, orbs = [], style }){
  const px = pad === false ? 0 : (pad && pad.x != null ? pad.x : 'var(--pad-x)');
  const py = pad === false ? 0 : (pad && pad.y != null ? pad.y : 'var(--pad-y)');
  return (
    <div style={{position:'relative', width:'100%', height:'100%', overflow:'hidden',
                 padding: pad===false ? 0 : `${typeof py==='number'?py+'px':py} ${typeof px==='number'?px+'px':px}`,
                 display:'flex', flexDirection:'column', ...(style||{})}}>
      {orbs.map((o,i)=>(
        <div key={i} className="dk-orb" style={{
          width:o.w, height:o.h, left:o.left, right:o.right, top:o.top, bottom:o.bottom,
          background:o.color || 'radial-gradient(circle at 50% 50%, rgba(90,150,255,.3), rgba(40,90,230,0) 70%)'
        }}></div>
      ))}
      {children}
    </div>
  );
}

/* ---- 跨页共享常量（Tweaks 预览用；页面组件本身只读 props，不依赖这些） ------ */
export const LABEL_TYPE_OPTIONS = ['数字','符号','关键词'];
export const LABEL_TYPE_MAP = { '数字':'number', '符号':'symbol', '关键词':'keyword' };

/* ============================================================================
   说明：本文件不再维护任何全局注册表（旧版的 window.DECK_SLIDES / registerSlide
   已移除）。每页组件改为标准 `export default Component` + `export const slideSpec`，
   由预览脚手架（app.jsx）显式 import 后自行编排。slideSpec 即该页「可调参数 schema」
   的单一数据源，字段与组件 props 一一对应；迁移时随组件一起带走。
   ========================================================================== */
