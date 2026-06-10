import { useDeckStyles, deckTheme, SlideShell } from './DeckKit.jsx';
/* ============================================================================
   SlideEpigraph — 卷首题词（书籍扉页式题词 · 花线 + 大字引语 + 出处著录块）
   独立组件（纯文本，无图片 / 图表）：仅靠 props 控制内容与样式；自注入基座样式。
   与 Manifesto（全幅单句大字主张）、Quote（多引述墙 + 焦点大引）、Testimonial
   （肖像 + 证言）、Annotated（中心大字 + 锚点批注）刻意区分：本页是「书籍卷首题词」
   ——上下花线居中、巨号幽灵引号、典雅大字引语、其下著录式出处块（作者 /《篇目》· 年）；
   可承载 1–2 则题词，留白充裕，作为章节 / 附录的开卷气口。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop       | 类型                          | 默认值 | 说明                            |
   | epigraphs  | {text,by,work,year}[]         | 见下   | 题词数据源                      |
   | itemCount  | number (1–2)                  | 1      | 展示题词数（截取）              |
   | align      | '居中'|'居左'                 | '居中' | 版式对齐                        |
   | scale      | number (44–72)                | 58     | 主题词字号（px）                |
   | showMark   | boolean                       | true   | 幽灵引号（装饰）                |
   | showRule   | boolean                       | true   | 上下花线（装饰）                |
   | focus      | boolean                       | true   | 强调主题词（出处主色）          |
   | kicker     | string                        | 见下   | 顶部小标                        |
   | theme      | Partial<DeckTheme>            | —      | 设计令牌覆盖                    |
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  itemCount: 1,
  align: '居中',
  scale: 58,
  showMark: true,
  showRule: true,
  focus: true,
  kicker: 'EPIGRAPH · 卷首题词',
  epigraphs: [
      { text:'资本从不预测未来，它只是把赌注，押在它愿意相信的未来之上。', by:'本报告', work:'代序', year:'2024' },
      { text:'潮水退去时，沙滩上留下的名字，才是这一年真正写下的答案。', by:'研究室', work:'后记', year:'2024' },
    ],
};

function SlideEpigraph(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';

  const {
    itemCount, align, scale, showMark, showRule, focus, kicker,
    epigraphs,
  } = { ...defaultProps, ...props };

  const n = Math.max(1, Math.min(itemCount, 2));
  const data = epigraphs.slice(0, n);
  const center = align === '居中';

  const Rule = ({ wide })=> (
    <div style={{display:'flex', alignItems:'center', gap:14, justifyContent: center?'center':'flex-start', width: wide?'auto':'100%'}}>
      <span style={{height:1, width: center?120:90, background:`linear-gradient(90deg, ${center?'transparent':ACC}, ${hexA(ACC,.7)}, transparent)`}}></span>
      <span style={{width:9, height:9, transform:'rotate(45deg)', background:ACC, boxShadow:`0 0 12px ${hexA(ACC,.7)}`}}></span>
      <span style={{height:1, width: center?120:0, background:`linear-gradient(90deg, transparent, ${hexA(ACC,.7)}, transparent)`}}></span>
    </div>
  );

  return (
    <SlideShell orbs={[
      { w:620, h:620, left:'50%', top:'42%', color:`radial-gradient(circle at 50% 50%, ${hexA(BLUE,.16)}, ${hexA(BLUE,0)} 70%)` },
    ]}>
      <div style={{flex:'1 1 0', minHeight:0, display:'flex', flexDirection:'column',
            alignItems: center?'center':'flex-start', justifyContent:'center', textAlign: center?'center':'left',
            padding: center?'0 8%':'0 4%', position:'relative'}}>
        {/* kicker */}
        <div className="dk-anim" style={{fontFamily:'var(--font-mono)', fontSize:'var(--type-tiny)', letterSpacing:'.36em', color:ACC, marginBottom:30}}>{kicker}</div>

        {showRule && <div className="dk-anim d1" style={{marginBottom: n>1?36:42}}><Rule/></div>}

        {/* 幽灵引号 */}
        {showMark && (
          <div className="dk-anim d1" style={{position:'absolute', left: center?'50%':'2%', top: center?'12%':'14%',
                transform: center?'translateX(-50%)':'none', fontFamily:'var(--font-display)', fontWeight:900,
                fontSize:260, lineHeight:1, color:hexA(ACC,.08), pointerEvents:'none', zIndex:0}}>“</div>
        )}

        {/* 题词组 */}
        <div style={{display:'flex', flexDirection:'column', gap: n>1?46:0, width:'100%', maxWidth: center?1380:1240, zIndex:1,
              alignItems: center?'center':'flex-start'}}>
          {data.map((e,i)=>{
            const primary = i===0;
            const fz = primary ? scale : Math.round(scale*0.62);
            const hot = focus && primary;
            return (
              <div key={i} className={'dk-anim d'+(i+2)} style={{width:'100%'}}>
                <p style={{fontFamily:'var(--font-cn)', fontWeight: primary?800:500, fontSize:fz, lineHeight:1.45,
                      letterSpacing:'.01em', color: primary?'#fff':'rgba(255,255,255,.78)', textWrap:'balance',
                      textShadow: primary?'0 6px 30px rgba(2,6,24,.5)':'none'}}>{e.text}</p>
                {/* 著录块 */}
                <div style={{marginTop: primary?26:16, display:'flex', alignItems:'center', gap:14, justifyContent: center?'center':'flex-start'}}>
                  <span style={{height:1, width:38, background:hexA(ACC,.6)}}></span>
                  <span style={{fontFamily:'var(--font-cn)', fontWeight:700, fontSize: primary?'var(--type-small)':'var(--type-tiny)', color: hot?ACC:'rgba(255,255,255,.86)'}}>
                    {e.by}
                  </span>
                  <span style={{fontFamily:'var(--font-cn)', fontSize: primary?'var(--type-small)':'var(--type-tiny)', color:'var(--ink-dim)'}}>《{e.work}》</span>
                  <span style={{fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.1em', color:'var(--ink-faint)'}}>{e.year}</span>
                </div>
              </div>
            );
          })}
        </div>

        {showRule && <div className="dk-anim d5" style={{marginTop: n>1?40:46}}><Rule/></div>}
      </div>
    </SlideShell>
  );

  function hexA(hex, a){
    if(!hex || hex[0] !== '#') return hex;
    const x = hex.slice(1); const f = x.length===3 ? x.split('').map(c=>c+c).join('') : x;
    return `rgba(${parseInt(f.slice(0,2),16)},${parseInt(f.slice(2,4),16)},${parseInt(f.slice(4,6),16)},${a})`;
  }
}

export default SlideEpigraph;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'epigraph', name:'卷首题词 · Epigraph', controls:[
  { prop:'itemCount', type:'slider', label:'数量', default:1, min:1, max:2, step:1 },
  { prop:'align', type:'radio', label:'对齐', default:'居中', options:['居中','居左'] },
  { prop:'scale', type:'slider', label:'主题词字号', default:58, min:44, max:72, step:2 },
  { prop:'showMark', type:'toggle', label:'幽灵引号', default:true },
  { prop:'showRule', type:'toggle', label:'装饰文案', default:true, desc:'上下花线' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
]};
