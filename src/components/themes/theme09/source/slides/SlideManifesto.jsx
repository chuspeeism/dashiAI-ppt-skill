import { useDeckStyles, deckTheme, SlideShell } from './DeckKit.jsx';
/* ============================================================================
   SlideManifesto — 金句主张（全幅单引 · 大字主张 + 强调词 + 署名）
   独立组件：仅靠 props 控制内容与样式；render 时自注入 DeckKit 基座样式。
   与 SlideQuote（多引述墙 + 焦点大引 + 立场分布）刻意区分：本页只承载「一句」
   主张，居中铺满，配开合引号、贯通细线与署名，作整段叙事的「停顿」页。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop          | 类型                          | 默认值 | 说明                              |
   | segments      | {text,em?}[]                  | 见下   | 主张分段（em=true 的段用强调色）  |
   | name          | string                        | 见下   | 署名                              |
   | role          | string                        | 见下   | 署名角色                          |
   | tag           | string                        | 见下   | 顶部主题标                        |
   | align         | '居中' | '居左'                | '居中' | 文字对齐                          |
   | showMark      | boolean                       | true   | 开合大引号装饰                    |
   | showRule      | boolean                       | true   | 上下贯通细线（装饰文案）          |
   | focus         | boolean                       | true   | 是否启用强调词上色（关则纯白）    |
   | scale         | number (40–80)                | 64     | 主张字号（px）                    |
   | badge         | string                        | '—'    | 顶部编号徽标                      |
   | theme         | Partial<DeckTheme>            | —      | 设计令牌覆盖                      |
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  name: '本报告 · 编委观点',
  role: 'AI CAPITAL LAB · 研究组',
  tag: 'STATEMENT',
  align: '居中',
  showMark: true,
  showRule: true,
  focus: true,
  scale: 64,
  badge: '—',
  segments: [
      { text:'2024 不是泡沫，而是一次' },
      { text:'方向的押注', em:true },
      { text:'—— 资本以前所未有的密度涌向少数团队，' },
      { text:'赢家通吃', em:true },
      { text:'正在成为这个时代的资本常态。' },
    ],
};

function SlideManifesto(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';

  const {
    name, role, tag, align, showMark, showRule, focus,
    scale, badge, segments,
  } = { ...defaultProps, ...props };

  const centered = align === '居中';

  return (
    <SlideShell orbs={[
      { w:820, h:820, left:'50%', top:'50%', color:`radial-gradient(circle at 50% 50%, ${hexA(BLUE,.22)}, ${hexA(BLUE,0)} 66%)` },
      { w:360, h:360, right:-100, top:-120, color:`radial-gradient(circle at 50% 50%, ${hexA(ACC,.14)}, ${hexA(ACC,0)} 70%)` },
    ]}>
      {/* 顶部主题标 */}
      <div className="dk-anim" style={{flexShrink:0, display:'flex', alignItems:'center', gap:16,
            justifyContent: centered?'center':'flex-start'}}>
        <span style={{fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.34em', color:ACC}}>{tag}</span>
        <span style={{fontFamily:'var(--font-mono)', fontSize:14, color:'var(--ink-faint)'}}>{badge}</span>
      </div>

      {/* 主体：大字主张 */}
      <div style={{flex:'1 1 0', minHeight:0, display:'flex', flexDirection:'column', justifyContent:'center',
            alignItems: centered?'center':'flex-start', position:'relative'}}>
        {showMark && (
          <div className="dk-anim" aria-hidden="true" style={{fontFamily:'Archivo, serif', fontWeight:900, fontSize:240,
              lineHeight:.7, color:hexA(ACC,.18), marginBottom: -40, alignSelf: centered?'center':'flex-start'}}>“</div>
        )}

        {showRule && (
          <div className="dk-anim d1" style={{width: centered?260:160, height:2, marginBottom:42,
              background:`linear-gradient(90deg, ${centered?hexA(ACC,0):ACC}, ${ACC}, ${hexA(ACC,0)})`,
              alignSelf: centered?'center':'flex-start'}}></div>
        )}

        <p className="dk-anim d2" style={{maxWidth:1500, fontFamily:'var(--font-cn)', fontWeight:800,
            fontSize: Math.max(40, Math.min(scale, 80)), lineHeight:1.4, letterSpacing:'.01em',
            textAlign: centered?'center':'left', textWrap:'balance', margin:0}}>
          {segments.map((s,i)=>(
            <span key={i} style={{color: (focus && s.em) ? ACC : '#fff',
                textShadow: (focus && s.em) ? `0 0 34px ${hexA(ACC,.45)}` : 'none'}}>{s.text}{' '}</span>
          ))}
        </p>

        {showRule && (
          <div className="dk-anim d3" style={{width: centered?260:160, height:2, marginTop:42,
              background:`linear-gradient(90deg, ${centered?hexA(ACC,0):ACC}, ${ACC}, ${hexA(ACC,0)})`,
              alignSelf: centered?'center':'flex-start'}}></div>
        )}
      </div>

      {/* 署名 */}
      <div className="dk-anim d4" style={{flexShrink:0, display:'flex', alignItems:'center', gap:16,
            justifyContent: centered?'center':'flex-start'}}>
        <span style={{width:44, height:44, borderRadius:13, flexShrink:0, display:'inline-flex', alignItems:'center',
            justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:900, fontSize:20,
            background:hexA(ACC,.16), border:`1.5px solid ${ACC}`, color:ACC}}>◆</span>
        <div style={{textAlign:'left'}}>
          <div style={{fontFamily:'var(--font-cn)', fontWeight:800, fontSize:'var(--type-sub)', color:'#fff'}}>{name}</div>
          <div style={{fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.06em', color:'var(--ink-faint)', marginTop:3}}>{role}</div>
        </div>
      </div>
    </SlideShell>
  );

  function hexA(hex, a){
    if(!hex || hex[0] !== '#') return hex;
    const n = hex.slice(1);
    const f = n.length===3 ? n.split('').map(c=>c+c).join('') : n;
    const r = parseInt(f.slice(0,2),16), g = parseInt(f.slice(2,4),16), b = parseInt(f.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }
}

export default SlideManifesto;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'manifesto', name:'金句主张 · Statement', controls:[
  { prop:'align', type:'radio', label:'对齐', default:'居中', options:['居中','居左'] },
  { prop:'scale', type:'slider', label:'字号', default:64, min:40, max:80, step:2 },
  { prop:'showMark', type:'toggle', label:'引号装饰', default:true },
  { prop:'showRule', type:'toggle', label:'装饰文案', default:true, desc:'上下贯通细线' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
]};
