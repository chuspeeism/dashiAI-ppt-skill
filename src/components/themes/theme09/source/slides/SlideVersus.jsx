import { useDeckStyles, deckTheme, SlideShell } from './DeckKit.jsx';
/* ============================================================================
   SlideVersus — 数字对决（两个巨号数字头对头 · 中枢符 + 对比条 + 结论）
   独立组件：仅靠 props 控制内容与样式；render 时自注入 DeckKit 基座样式。
   与 SlideHero（单一巨号）、SlideStat（六块网格）刻意区分：本页把「两个」关键
   数字对置比较，中间以中枢符连接，下方对比条与一句结论，强调量级对照关系。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop       | 类型                          | 默认值 | 说明                              |
   | left/right | Side                          | 见下   | 左右两侧数据（value/unit/label/desc/bar）|
   | pivot      | 'VS'|'÷'|'→'|'/'              | 'VS'   | 中枢连接符                        |
   | showBar    | boolean                       | true   | 底部对比条                        |
   | showNote   | boolean                       | true   | 底部结论（装饰文案）              |
   | note       | string                        | 见下   | 结论文案                          |
   | focus      | boolean                       | true   | 是否高亮某一侧                    |
   | focusIndex | 0 | 1                         | 0      | 高亮左(0)/右(1)                   |
   | badge/kicker : string  顶部编号 / 小标                                      |
   | theme      | Partial<DeckTheme>            | —      | 设计令牌覆盖                      |
   Side = { value, unit, label, desc, bar:0–100, color? }
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  pivot: 'VS',
  showBar: true,
  showNote: true,
  note: '近三分之一的美国风险投资流向 AI —— 资本天平正以肉眼可见的速度向少数赢家倾斜。',
  focus: true,
  focusIndex: 0,
  badge: '09',
  kicker: 'HEAD TO HEAD',
  left: { value:'970', unit:'亿$', label:'2024 AI 风投', desc:'全年流入 AI 的风险资本', bar:32, color:null },
  right: { value:'1/3', unit:'',   label:'占全美 VC',   desc:'AI 吸纳的美国风投份额', bar:33, color:null },
};

function SlideVersus(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';
  const VIO = T.violet || '#9f7bff';

  const {
    pivot, showBar, showNote, note, focus, focusIndex, badge,
    kicker, left, right,
  } = { ...defaultProps, ...props };

  const fIdx = focusIndex === 1 ? 1 : 0;
  const sides = [ {...left, c: left.color||ACC}, {...right, c: right.color||BLUE} ];

  return (
    <SlideShell orbs={[
      { w:620, h:620, left:'6%', top:'14%', color:`radial-gradient(circle at 50% 50%, ${hexA(ACC,.16)}, ${hexA(ACC,0)} 68%)` },
      { w:620, h:620, right:'6%', top:'14%', color:`radial-gradient(circle at 50% 50%, ${hexA(BLUE,.18)}, ${hexA(BLUE,0)} 68%)` },
    ]}>
      <div className="dk-anim" style={{flexShrink:0, display:'flex', alignItems:'center', gap:18}}>
        <span style={{fontFamily:'var(--font-display)', fontWeight:900, fontSize:'var(--type-sub)', color:ACC}}>{badge}</span>
        <span style={{height:2, width:72, background:ACC}}></span>
        <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--type-tiny)', letterSpacing:'.28em', color:'var(--ink-dim)'}}>{kicker}</span>
      </div>

      <div style={{flex:'1 1 0', minHeight:0, display:'flex', alignItems:'center', justifyContent:'center', gap:0, position:'relative'}}>
        {sides.map((s,i)=>{
          const hot = focus && i===fIdx;
          const align = i===0 ? 'flex-end' : 'flex-start';
          return (
            <React.Fragment key={i}>
              {i===1 && (
                <div className="dk-anim d2" style={{flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'0 36px', zIndex:2}}>
                  <span style={{width:108, height:108, borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'#fff',
                      background:'linear-gradient(150deg, rgba(255,255,255,.16), rgba(255,255,255,.04))',
                      border:'1px solid rgba(255,255,255,.3)', boxShadow:'0 20px 50px rgba(3,8,30,.5)'}}>{pivot}</span>
                  <span style={{width:2, height:120, background:'linear-gradient(180deg, rgba(255,255,255,.3), rgba(255,255,255,0))'}}></span>
                </div>
              )}
              <div className={'dk-anim d'+(i===0?1:3)} style={{flex:'1 1 0', minWidth:0, display:'flex', flexDirection:'column', alignItems:align,
                    textAlign: i===0?'right':'left'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:10, flexDirection: i===0?'row':'row'}}>
                  <span style={{fontFamily:'var(--font-display)', fontWeight:900, fontSize:240, lineHeight:.8, letterSpacing:'-.02em',
                      color: hot?s.c:'#fff', textShadow: hot?`0 0 60px ${hexA(s.c,.5)}`:'none'}}>{s.value}</span>
                  <span style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:56, color:'var(--ink-dim)'}}>{s.unit}</span>
                </div>
                <div style={{fontFamily:'var(--font-cn)', fontWeight:900, fontSize:'var(--type-h2)', color: hot?s.c:'#fff', marginTop:8}}>{s.label}</div>
                <div style={{fontSize:'var(--type-small)', color:'var(--ink-dim)', marginTop:8, maxWidth:520}}>{s.desc}</div>
                {showBar && (
                  <div style={{width:'70%', maxWidth:520, height:14, borderRadius:8, marginTop:22, background:'rgba(255,255,255,.08)', overflow:'hidden',
                        display:'flex', justifyContent: i===0?'flex-end':'flex-start'}}>
                    <div style={{width:Math.max(6,Math.min(s.bar,100))+'%', height:'100%', borderRadius:8,
                        background:`linear-gradient(90deg, ${hexA(s.c,.5)}, ${s.c})`,
                        boxShadow: hot?`0 0 18px ${hexA(s.c,.6)}`:'none'}}></div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {showNote && (
        <div className="dk-glass-dark dk-anim d4" style={{flexShrink:0, borderRadius:18, padding:'16px 30px', display:'flex', alignItems:'center', gap:18}}>
          <span style={{flexShrink:0, fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.14em', color:ACC}}>对照解读</span>
          <p style={{fontSize:'var(--type-small)', lineHeight:1.5, color:'rgba(255,255,255,.88)', textWrap:'pretty', margin:0}}>{note}</p>
        </div>
      )}
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

export default SlideVersus;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'versus', name:'数字对决 · Versus', controls:[
  { prop:'pivot', type:'radio', label:'中枢符', default:'VS', options:['VS','÷','→','/'] },
  { prop:'showBar', type:'toggle', label:'对比条', default:true },
  { prop:'showNote', type:'toggle', label:'装饰文案', default:true, desc:'底部结论' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
  { prop:'focusIndex', type:'slider', label:'焦点序号', default:0, min:0, max:1, step:1, showIf:(p)=>p.focus },
]};
