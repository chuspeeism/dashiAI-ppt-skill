import { useDeckStyles } from './DeckKit.jsx';
/* SlideCover — 封面
   Props:
     year        : string  大号年份 (dk-chrome)
     titleLines  : string[] 主标题（逐行，dk-chrome）
     brand       : string  左上角品牌
     quote       : string[] 右上角理念（逐行，右对齐）
     signature   : string  手写签名
     contact     : {label,value}[] 右下角联系/出处信息
     showWatermark : bool
     showOrnament  : bool  玻璃光球/芯片装饰
     focus       : bool   选中外框 + 年份额外辉光（重点强调）
*/
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  year: '2024',
  titleLines: ['美国大额融资', 'AI 公司调研报告'],
  brand: 'AI CAPITAL LAB',
  quote: ['在资本与算力的浪潮里，', '每一笔融资都是一次方向的押注。'],
  signature: 'AInsight',
  contact: [
      { label: '数据口径', value: '≥1亿美元 · 2024 全年' },
      { label: '编制日期', value: '2026 · 06 · 03' },
    ],
  showOrnament: true,
  focus: true,
  focusIndex: 0,
};

function SlideCover(props){
  useDeckStyles(props.theme);
  const {
    year, titleLines, brand, quote, signature, contact, showOrnament,
    focus, focusIndex,
  } = { ...defaultProps, ...props };

  return (
    <div style={{position:'relative', width:'100%', height:'100%', padding:'var(--pad-y) var(--pad-x)'}}>
      {showOrnament && <>
        <div className="dk-orb" style={{width:520, height:520, left:-120, bottom:-160, background:'radial-gradient(circle at 40% 40%, rgba(90,150,255,.55), rgba(40,90,230,0) 70%)'}}></div>
        <div className="dk-orb" style={{width:360, height:360, right:120, top:60, background:'radial-gradient(circle at 50% 40%, rgba(70,227,198,.30), rgba(70,227,198,0) 70%)'}}></div>
        <div className="dk-glass-chip dk-anim d3" style={{position:'absolute', width:118, height:118, right:430, top:430, transform:'rotate(14deg)'}}></div>
      </>}

      {/* top bar */}
      <div style={{position:'absolute', top:'var(--pad-y)', left:'var(--pad-x)', right:'var(--pad-x)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex:2}}>
        <div className="dk-anim" style={{fontFamily:'var(--font-display)', fontWeight:700, letterSpacing:'.18em', fontSize:'var(--type-small)'}}>{brand}</div>
        <div className="dk-anim d1" style={{textAlign:'right', color:'var(--ink-dim)', fontSize:'var(--type-tiny)', lineHeight:1.7, fontWeight:500}}>
          {quote.map((q,i)=><div key={i}>{q}</div>)}
        </div>
      </div>

      {/* big year + title */}
      <div style={{position:'absolute', left:'var(--pad-x)', top:218, zIndex:2}}>
        <div style={{position:'relative', display:'inline-block'}}>
          <div className="dk-chrome dk-anim d1" style={{fontFamily:'var(--font-display)', fontWeight:900, fontSize:'var(--type-mega)', lineHeight:.82, letterSpacing:'-.02em', textShadow: focus ? '0 0 70px rgba(120,170,255,.45)' : 'none'}}>{year}</div>
          {focus && <SelectionBox />}
        </div>
        <div className="dk-chrome dk-anim d2" style={{fontFamily:'var(--font-cn)', fontWeight:900, fontSize:'var(--type-title)', lineHeight:1.04, letterSpacing:'.02em', marginTop:18}}>
          {titleLines.map((t,i)=><div key={i}>{t}</div>)}
        </div>
      </div>

      {/* signature */}
      <div className="dk-anim d4" style={{position:'absolute', right:300, top:470, fontFamily:'var(--font-script)', fontSize:118, color:'#dfe9ff', transform:'rotate(-6deg)', filter:'drop-shadow(0 8px 20px rgba(10,30,120,.5))', zIndex:2}}>{signature}</div>

      {/* bottom info */}
      <div style={{position:'absolute', left:'var(--pad-x)', bottom:'var(--pad-y)', maxWidth:560, zIndex:2}}>
        <div className="dk-anim d3" style={{color:'var(--ink-faint)', fontSize:'var(--type-tiny)', lineHeight:1.8, fontWeight:400}}>
          聚焦 2024 年美国 AI 产业单笔亿元以上的大额融资事件，以「横纵分析法」梳理市场全景、行业分布与产业链分层，为投资判断提供结构化参考。
        </div>
      </div>
      <div style={{position:'absolute', right:'var(--pad-x)', bottom:'var(--pad-y)', display:'flex', gap:48, zIndex:2}}>
        {contact.map((c,i)=>{
          const hot = focus && i===focusIndex;
          return (
          <div key={i} className="dk-anim d4" style={{textAlign:'right'}}>
            <div style={{fontFamily:'var(--font-mono)', fontSize:20, letterSpacing:'.1em', color: hot?'var(--mint)':'var(--ink-faint)', textTransform:'uppercase'}}>{c.label}</div>
            <div style={{fontSize:'var(--type-small)', fontWeight:700, marginTop:6, color: hot?'var(--mint)':'#fff'}}>{c.value}</div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectionBox(){
  const c = 'var(--mint)';
  const tick = (s)=> <div style={{position:'absolute', width:18, height:18, border:`3px solid ${c}`, ...s}}></div>;
  return (
    <div style={{position:'absolute', inset:'-22px -16px', border:`2px solid ${c}`, pointerEvents:'none'}}>
      {tick({top:-10, left:-10, borderRight:'none', borderBottom:'none'})}
      {tick({top:-10, right:-10, borderLeft:'none', borderBottom:'none'})}
      {tick({bottom:-10, left:-10, borderRight:'none', borderTop:'none'})}
      {tick({bottom:-10, right:-10, borderLeft:'none', borderTop:'none'})}
    </div>
  );
}

function Watermark({text}){
  const rows = [];
  for(let r=0;r<4;r++){
    rows.push(<span key={r} style={{top: r*300 - 40, left: -120 + (r%2)*160}}>{(text+' · ').repeat(3)}</span>);
  }
  return <div className="dk-watermark">{rows}</div>;
}

export default SlideCover;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'cover', name:'封面 · Cover', controls:[
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true, desc:'年号选择框高亮开关' },
  { prop:'focusIndex', type:'slider', label:'焦点序号', default:0, min:0, max:1, step:1, showIf:(p)=>p.focus, desc:'高亮第几条出处信息' },
]};
