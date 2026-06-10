import { useDeckStyles, deckTheme } from './DeckKit.jsx';
/* ============================================================================
   SlideCoverAperture — 封面 F · 同心光圈（Concentric Aperture）
   独立组件：仅靠 props 控制内容与样式；render 时自注入 DeckKit 基座样式。
   以「同心环光圈」为构图主装置：右侧一组同心圆环（实/虚/mint 相间）+ 四枚光圈刀叶
   构成镜头式портал，圆心嵌金属巨号年份(角标选择框)；左侧排 kicker + 金属主标题 + 副题。

   ── 区别于既有封面 ──────────────────────────────────────────────────────
   既有封面无圆形装置 → 本页以「光圈/镜头」圆形构图聚焦年份，左文右环，平衡而有焦点。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop        | 类型           | 默认 | 说明                              |
   | ringCount   | number (2–5)   | 4    | 同心环数量（截取 rings）          |
   | showBlades  | boolean        | true | 四枚光圈刀叶（装饰）              |
   | showGlow    | boolean        | true | 圆心径向辉光（装饰）              |
   | showChip    | boolean        | true | 质感玻璃方块（装饰）              |
   | focus       | boolean        | true | 年份辉光 + 角标选择框              |
   | kicker/year/titleLines/sub | … | — | 文案（默认=报告封面）            |
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  kicker: 'ANNUAL RESEARCH REPORT',
  year: '2024',
  titleLines: ['美国大额融资', 'AI 公司', '调研报告'],
  sub: '以横纵分析法聚焦单笔 ≥ 1 亿美元的大额融资事件',
  ringCount: 4,
  showBlades: true,
  showGlow: true,
  showChip: true,
  focus: true,
};

function SlideCoverAperture(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';

  const {
    kicker, year, titleLines, sub, ringCount, showBlades, showGlow,
    showChip, focus,
  } = { ...defaultProps, ...props };

  const CX = 1410, CY = 540;
  const ringDefs = [
    { d:790, w:1, c:hexA('#fff',.12), dash:false },
    { d:626, w:2, c:hexA(ACC,.42), dash:true },
    { d:478, w:1, c:hexA('#fff',.18), dash:false },
    { d:346, w:2, c:hexA(BLUE,.55), dash:false },
    { d:236, w:1, c:hexA(ACC,.3), dash:true },
  ];
  const rings = ringDefs.slice(0, Math.max(2, Math.min(ringCount, ringDefs.length)));
  const innerR = (rings[rings.length-1].d) / 2;

  return (
    <div style={{position:'relative', width:'100%', height:'100%', overflow:'hidden'}}>
      {showGlow && <div className="dk-orb" style={{width:760, height:760, left:CX, top:CY, transform:'translate(-50%,-50%)', background:`radial-gradient(circle at 50% 50%, ${hexA(BLUE,.42)}, ${hexA(BLUE,0)} 64%)`}}></div>}

      {/* 同心环 */}
      {rings.map((r,i)=>(
        <div key={i} style={{position:'absolute', left:CX, top:CY, width:r.d, height:r.d,
            transform:'translate(-50%,-50%)', borderRadius:'50%',
            border:`${r.w}px ${r.dash?'dashed':'solid'} ${r.c}`}}></div>
      ))}
      {/* 光圈刀叶 */}
      {showBlades && [0,90,180,270].map((a,i)=>(
        <div key={i} style={{position:'absolute', left:CX, top:CY, width:2, height:30,
            background:ACC, transformOrigin:'center', transform:`rotate(${a}deg) translateY(-${innerR-6}px)`,
            boxShadow:`0 0 10px ${hexA(ACC,.7)}`}}></div>
      ))}

      {showChip && <>
        <div className="dk-anim d3" style={{position:'absolute', width:84, height:84, left:CX-340, top:CY-326, zIndex:3}}>
          <div className="dk-glass-chip" style={{width:'100%', height:'100%', transform:'rotate(16deg)'}}></div>
        </div>
        <div className="dk-anim d4" style={{position:'absolute', width:54, height:54, left:CX+296, top:CY+268, zIndex:3}}>
          <div className="dk-glass-chip" style={{width:'100%', height:'100%', transform:'rotate(-10deg)'}}></div>
        </div>
      </>}

      {/* 圆心年份 */}
      <div style={{position:'absolute', left:CX, top:CY, transform:'translate(-50%,-50%)', textAlign:'center', zIndex:2}}>
        <div style={{position:'relative', display:'inline-block'}}>
          <div className="dk-chrome dk-anim d2" style={{fontFamily:'var(--font-display)', fontWeight:900,
              fontSize:158, lineHeight:.86, letterSpacing:'-.02em',
              filter: focus ? `drop-shadow(0 0 60px ${hexA(BLUE,.55)})` : 'drop-shadow(0 8px 20px rgba(4,14,60,.45))'}}>{year}</div>
          {focus && <SelBox color={ACC} inset="-16px -16px" size={20} />}
        </div>
        <div className="dk-anim d3" style={{fontFamily:'var(--font-mono)', fontSize:18, letterSpacing:'.34em', color:ACC, textTransform:'uppercase', marginTop:14}}>ANNUAL&nbsp;·&nbsp;FY2024</div>
      </div>

      {/* 左侧标题 */}
      <div style={{position:'absolute', left:'var(--pad-x)', top:'50%', transform:'translateY(-50%)', width:820, zIndex:2}}>
        <div className="dk-anim" style={{display:'flex', alignItems:'center', gap:16, marginBottom:30}}>
          <span style={{width:46, height:1, background:hexA(ACC,.7)}}></span>
          <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--type-tiny)', letterSpacing:'.28em', color:'var(--ink-dim)', textTransform:'uppercase'}}>{kicker}</span>
        </div>
        <h1 className="dk-chrome dk-anim d2" style={{fontFamily:'var(--font-cn)', fontWeight:900, fontSize:118, lineHeight:1.0, letterSpacing:'.01em', margin:0}}>
          {titleLines.map((t,i)=><div key={i}>{t}</div>)}
        </h1>
        <p className="dk-anim d3" style={{fontFamily:'var(--font-cn)', fontWeight:500, fontSize:'var(--type-body)', color:'var(--ink-dim)', margin:'30px 0 0', maxWidth:680, lineHeight:1.7}}>{sub}</p>
      </div>
    </div>
  );

  function hexA(hex, a){
    if(!hex || hex[0] !== '#') return hex;
    const x = hex.slice(1); const f = x.length===3 ? x.split('').map(c=>c+c).join('') : x;
    return `rgba(${parseInt(f.slice(0,2),16)},${parseInt(f.slice(2,4),16)},${parseInt(f.slice(4,6),16)},${a})`;
  }
}

export default SlideCoverAperture;

/* 角标选择框（取自原封面 SelectionBox：mint 四角刻线 + 细边框） */
function SelBox({ color = '#46e3c6', inset = '-14px -12px', size = 18 }){
  const tick = (s) => <span style={{position:'absolute', width:size, height:size, border:`3px solid ${color}`, ...s}}></span>;
  return (
    <span style={{position:'absolute', inset, border:`2px solid ${color}`, pointerEvents:'none'}}>
      {tick({top:-9, left:-9, borderRight:'none', borderBottom:'none'})}
      {tick({top:-9, right:-9, borderLeft:'none', borderBottom:'none'})}
      {tick({bottom:-9, left:-9, borderRight:'none', borderTop:'none'})}
      {tick({bottom:-9, right:-9, borderLeft:'none', borderTop:'none'})}
    </span>
  );
}

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'coveraperture', name:'封面F · 同心光圈', controls:[
  { prop:'ringCount', type:'slider', label:'同心环数量', default:4, min:2, max:5, step:1 },
  { prop:'showBlades', type:'toggle', label:'光圈刀叶', default:true, desc:'装饰' },
  { prop:'showGlow', type:'toggle', label:'圆心辉光', default:true, desc:'装饰' },
  { prop:'showChip', type:'toggle', label:'质感方块', default:true, desc:'玻璃芯片装饰' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
]};
