/* ============================================================================
   SlidePolaroid — 影像速写（拍立得墙 · 倾斜白框照片 + 手写图注 · 散落版式）
   标准 ES Module。图片用 ImageStrip 的 FillSlot（满版裁切，固定画框内铺满）。
   与既有图片页（Gallery/Mosaic/Cards/Diptych…）刻意区分：散落、轻微旋转、白边
   拍立得 + Caveat 手写图注，随性「速写墙」气质。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop       | 类型                          | 默认值 | 说明                              |
   | shots      | {caption}[]                   | 见下   | 每张照片的图注数据源              |
   | imgCount   | number (0–5)                  | 4      | 图片槽数量（拍立得张数）          |
   | scatter    | boolean                       | true   | 散落（轻微旋转/错位）/ 关则齐列    |
   | showTape   | boolean                       | true   | 顶部胶带装饰                      |
   | focus      | boolean                       | true   | 高亮某张（置前 + 摆正 + 描边）     |
   | focusIndex | number (0-based)              | 0      | 高亮第几张                        |
   | labelType  | 'number'|'symbol'|'keyword'   | number | 角标样式                          |
   | kicker/title/titleEN : string  文案                                        |
   | badge      | string                        | '05'   | 顶部编号徽标                      |
   | theme      | Partial<DeckTheme>            | —      | 设计令牌覆盖                      |
   ========================================================================== */
import { useDeckStyles, deckTheme, deckLabel, SlideShell } from './DeckKit.jsx';
import { FillSlot } from './ImageStrip.jsx';

/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  imgCount: 4,
  scatter: true,
  showTape: true,
  focus: true,
  focusIndex: 0,
  labelType: 'number',
  badge: '05',
  kicker: 'FIELD NOTES · 影像速写',
  title: '一年间的影像速写',
  titleEN: 'Snapshots · 2024',
  shots: [
      { caption: '路演现场 · 资本与团队的初次握手' },
      { caption: '签约时刻 · 大额轮次落定' },
      { caption: '机房一隅 · 算力即护城河' },
      { caption: '白板之上 · 模型路线之争' },
      { caption: '庆功之夜 · 估值再创新高' },
    ],
};

function SlidePolaroid(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';

  const {
    imgCount, scatter, showTape, focus, focusIndex, labelType, badge,
    kicker, title, titleEN, shots,
  } = { ...defaultProps, ...props };

  const n = Math.max(0, Math.min(imgCount, 5));
  const data = shots.slice(0, n);
  const fIdx = Math.max(0, Math.min(focusIndex, Math.max(0, n - 1)));
  const lbl = (i)=> deckLabel(labelType, i, { keyword:'PIC' });
  const ROT = [-5, 4, -3, 6, -2];   // 预设旋转角（确定性，避免随机抖动）
  const DY  = [16, -10, 22, -4, 12];

  return (
    <SlideShell orbs={[{ w:560, h:560, right:-180, top:-160,
        color:`radial-gradient(circle at 50% 50%, ${hexA(BLUE,.2)}, ${hexA(BLUE,0)} 70%)` }]}>
      {/* 顶部小标 */}
      <div className="dk-anim" style={{flexShrink:0, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8}}>
            <span style={{fontFamily:'var(--font-display)', fontWeight:900, fontSize:'var(--type-sub)', color:ACC}}>{badge}</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.2em', color:'var(--ink-dim)'}}>{kicker}</span>
          </div>
          <h2 className="dk-chrome" style={{fontFamily:'var(--font-cn)', fontWeight:900, fontSize:80, lineHeight:1, letterSpacing:'.02em'}}>{title}</h2>
        </div>
        <span style={{fontFamily:'var(--font-script)', fontSize:64, color:'#dfe9ff', transform:'rotate(-5deg)', flexShrink:0,
            filter:'drop-shadow(0 6px 16px rgba(10,30,120,.5))'}}>{titleEN}</span>
      </div>

      {/* 拍立得墙 */}
      <div style={{flex:'1 1 0', minHeight:0, display:'flex', alignItems:'center', justifyContent:'center', gap: n>=5?-10:28, marginTop:10}}>
        {n === 0 ? (
          <div style={{fontFamily:'var(--font-mono)', fontSize:'var(--type-small)', color:'var(--ink-faint)'}}>图片槽数量 0 · 调大以铺照片</div>
        ) : data.map((s,i)=>{
          const hot = focus && i===fIdx;
          const rot = scatter ? (hot?0:ROT[i % ROT.length]) : 0;
          const dy = scatter ? (hot?-8:DY[i % DY.length]) : 0;
          return (
            <div key={i} className={'dk-anim d'+Math.min(i+1,6)} style={{flex:'1 1 0', maxWidth: 360, minWidth:0,
                  zIndex: hot?5:1}}>
              <div style={{transform:`rotate(${rot}deg) translateY(${dy}px) scale(${hot?1.06:1})`, transformOrigin:'center',
                  transition:'transform .2s'}}>
              {/* 白框 */}
              <div style={{background:'#fbfaf6', padding:'14px 14px 0', borderRadius:6,
                    boxShadow: hot?`0 30px 64px rgba(3,8,30,.6), 0 0 0 3px ${ACC}`:'0 22px 50px rgba(3,8,30,.5)'}}>
                {showTape && (
                  <span style={{position:'absolute', top:-12, left:'50%', transform:'translateX(-50%) rotate(-4deg)', width:90, height:26,
                      background:'rgba(120,170,255,.32)', border:'1px solid rgba(255,255,255,.4)'}}></span>
                )}
                {/* 照片（满版裁切） */}
                <div style={{position:'relative', width:'100%', paddingBottom:'100%', background:'#0a1230', overflow:'hidden'}}>
                  <FillSlot idPrefix="polaroid" idx={i} placeholder={'速写 / shot '+(i+1)} accent={ACC} theme={props.theme} />
                  <span style={{position:'absolute', top:10, left:10, zIndex:4, width:30, height:30, borderRadius:8, display:'inline-flex',
                      alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:900, fontSize:13,
                      color: hot?(T.navy900||'#050b22'):'#fff', background: hot?ACC:'rgba(5,11,34,.55)',
                      border:`1px solid ${hot?ACC:'rgba(255,255,255,.3)'}`, backdropFilter:'blur(4px)'}}>{lbl(i)}</span>
                </div>
                {/* 手写图注 */}
                <div style={{padding:'12px 6px 16px', textAlign:'center'}}>
                  <span style={{fontFamily:'var(--font-script)', fontSize:26, lineHeight:1.15, color:'#1a2336'}}>{s.caption}</span>
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </SlideShell>
  );

  function hexA(hex, a){
    if(!hex || hex[0] !== '#') return hex;
    const x = hex.slice(1); const f = x.length===3 ? x.split('').map(c=>c+c).join('') : x;
    return `rgba(${parseInt(f.slice(0,2),16)},${parseInt(f.slice(2,4),16)},${parseInt(f.slice(4,6),16)},${a})`;
  }
}

export default SlidePolaroid;

export const slideSpec = { defaults: defaultProps, slot:'polaroid', name:'影像速写 · Polaroid', controls:[
  { prop:'imgCount', type:'slider', label:'图片槽数量', default:4, min:0, max:5, step:1 },
  { prop:'scatter', type:'toggle', label:'散落排布', default:true },
  { prop:'showTape', type:'toggle', label:'装饰文案', default:true, desc:'胶带装饰' },
  { prop:'labelType', type:'labelType', label:'标签类型', default:'数字' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
  { prop:'focusIndex', type:'slider', label:'焦点序号', default:0, min:0, max:(p)=>Math.max(0,p.imgCount-1), step:1, showIf:(p)=>p.focus && p.imgCount>0 },
]};
