import { useDeckStyles } from './DeckKit.jsx';
import ImageStrip from './ImageStrip.jsx';
/* ============================================================================
   SlideClosing — 结语 / 封底（总结主张 + 数据来源 + 自适应图片槽）
   独立组件：仅靠 props 控制内容与样式；render 时自注入 DeckKit 基座样式。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop          | 类型                  | 默认值        | 说明                          |
   | brand         | string                | AI CAPITAL... | 左上角品牌                    |
   | headline      | string                | '结语'        | 大号金属标题                  |
   | headlineEN    | string                | 'Closing'     | 标题英文副名                  |
   | statement     | string                | 见下          | 总结主张段落                  |
   | signature     | string                | 'AInsight'    | 手写签名（空字符串则隐藏）    |
   | contact       | {label,value}[]       | 见下          | 底部出处信息                  |
   | showAside     | boolean               | true          | 是否显示「数据来源」面板      |
   | sources       | string[]              | 见下          | 数据来源条目                  |
   | imgCount      | number (0–4)          | 0             | 图片槽数量（按图片比例自适应）|
   | showOrnament  | boolean               | true          | 光晕 / 玻璃芯片装饰           |
   | showWatermark | boolean               | true          | 背景水印                      |
   | focus         | boolean               | true          | 标题额外辉光强调              |
   | theme         | Partial<DeckTheme>    | —             | 设计令牌覆盖                  |
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  brand: 'AI CAPITAL LAB',
  headline: '结语',
  headlineEN: 'Closing · Thank You',
  statement: '资本的下一阶段，将从「赌叙事」转向「看兑现」。能把技术沉淀为可持续收入的公司，才能在退潮后留在牌桌上。',
  signature: 'AInsight',
  contact: [
      { label:'数据口径', value:'≥1亿美元 · 2024 全年' },
      { label:'编制日期', value:'2026 · 06 · 03' },
    ],
  showAside: true,
  sources: [
      '公开披露的一级市场融资事件（≥1 亿美元）',
      '主流创投数据库与公司官方公告整理',
      '部分数值经研究性推演 · 仅供研究参考',
    ],
  imgCount: 0,
  showOrnament: true,
  focus: true,
};

function SlideClosing(props){
  useDeckStyles(props.theme);
  const {
    brand, headline, headlineEN, statement, signature, contact, showAside,
    sources, imgCount, showOrnament, focus,
  } = { ...defaultProps, ...props };

  const hasImg = imgCount > 0;
  const hasAside = showAside || hasImg;

  return (
    <div style={{position:'relative', width:'100%', height:'100%', padding:'var(--pad-y) var(--pad-x)', overflow:'hidden'}}>
      {showOrnament && <>
        <div className="dk-orb" style={{width:540, height:540, left:-140, bottom:-180, background:'radial-gradient(circle at 40% 40%, rgba(90,150,255,.5), rgba(40,90,230,0) 70%)'}}></div>
        <div className="dk-orb" style={{width:340, height:340, right:120, top:40, background:'radial-gradient(circle at 50% 40%, rgba(70,227,198,.28), rgba(70,227,198,0) 70%)'}}></div>
        <div className="dk-glass-chip dk-anim d3" style={{position:'absolute', width:96, height:96, left:130, bottom:150, transform:'rotate(-12deg)'}}></div>
      </>}

      {/* 顶栏 */}
      <div className="dk-anim" style={{position:'relative', zIndex:2, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:30}}>
        <div style={{fontFamily:'var(--font-display)', fontWeight:700, letterSpacing:'.18em', fontSize:'var(--type-small)', whiteSpace:'nowrap'}}>{brand}</div>
        <div style={{fontFamily:'var(--font-mono)', fontSize:'var(--type-tiny)', letterSpacing:'.16em', color:'var(--ink-faint)', textTransform:'uppercase'}}>End of Report</div>
      </div>

      {/* 主体 */}
      <div style={{position:'relative', zIndex:2, flex:1, minHeight:0, display:'grid',
            gridTemplateColumns: hasAside ? '1.25fr .95fr' : '1fr', gap:60, alignItems:'center', marginTop:10}}>
        {/* 左：标题 + 主张 */}
        <div>
          <div className="dk-anim d1" style={{display:'flex', alignItems:'center', gap:18, marginBottom:14}}>
            <span style={{height:2, width:70, background:'var(--dk-accent)'}}></span>
            <span style={{fontFamily:'var(--font-display)', fontWeight:600, fontSize:'var(--type-small)', color:'var(--ink-dim)', letterSpacing:'.08em', whiteSpace:'nowrap'}}>{headlineEN}</span>
          </div>
          <div style={{position:'relative', display:'inline-block'}}>
            <h1 className="dk-chrome dk-anim d1" style={{fontFamily:'var(--font-cn)', fontWeight:900, fontSize:184, lineHeight:1.04,
                letterSpacing:'.06em', textShadow: focus ? '0 0 70px rgba(120,170,255,.4)' : 'none'}}>{headline}</h1>
            {signature && <span className="dk-anim d4" style={{position:'absolute', left:'calc(100% + 28px)', bottom:14, whiteSpace:'nowrap', fontFamily:'var(--font-script)',
                fontSize:88, color:'#dfe9ff', transform:'rotate(-6deg)', filter:'drop-shadow(0 8px 20px rgba(10,30,120,.5))'}}>{signature}</span>}
          </div>
          <p className="dk-anim d2" style={{marginTop:46, maxWidth:760, fontSize:'var(--type-sub)', fontWeight:600,
              lineHeight:1.5, color:'rgba(255,255,255,.9)', textWrap:'pretty'}}>{statement}</p>
        </div>

        {/* 右：数据来源 + 图片槽 */}
        {hasAside && (
          <div className="dk-anim d3" style={{display:'flex', flexDirection:'column', gap:22}}>
            {showAside && (
              <div className="dk-glass-dark" style={{borderRadius:'var(--dk-radius)', padding:'30px 34px'}}>
                <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:18}}>
                  <span style={{fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.14em', color:'var(--dk-accent)', textTransform:'uppercase'}}>Sources</span>
                  <span style={{height:1, flex:1, background:'rgba(255,255,255,.14)'}}></span>
                  <span style={{fontSize:'var(--type-tiny)', color:'var(--ink-faint)'}}>附录 · 数据来源</span>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:14}}>
                  {sources.map((s,i)=>(
                    <div key={i} style={{display:'flex', gap:14, alignItems:'flex-start'}}>
                      <span style={{flexShrink:0, marginTop:7, width:7, height:7, borderRadius:'50%', background:'var(--dk-accent)'}}></span>
                      <span style={{fontSize:'var(--type-tiny)', lineHeight:1.5, color:'var(--ink-dim)', textWrap:'pretty'}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hasImg && ImageStrip && (
              <ImageStrip idPrefix="closing" count={imgCount} width={620} maxH={210}
                placeholders={[
                  { ratio:1.5,  label:'团队 / team' },
                  { ratio:1.0,  label:'品牌 / brand' },
                  { ratio:1.33, label:'场景 / scene' },
                  { ratio:0.78, label:'人物 / portrait' },
                ]} />
            )}
          </div>
        )}
      </div>

      {/* 底部出处 */}
      <div className="dk-anim d4" style={{position:'relative', zIndex:2, display:'flex', justifyContent:'flex-end', gap:48}}>
        {contact.map((c,i)=>(
          <div key={i} style={{textAlign:'right'}}>
            <div style={{fontFamily:'var(--font-mono)', fontSize:18, letterSpacing:'.1em', color:'var(--ink-faint)', textTransform:'uppercase'}}>{c.label}</div>
            <div style={{fontSize:'var(--type-small)', fontWeight:700, marginTop:6}}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlideClosing;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'closing', name:'结语 · Closing', controls:[
  { prop:'imgCount', type:'slider', label:'图片槽数量', default:0, min:0, max:4, step:1 },
  { prop:'showAside', type:'toggle', label:'附属面板', default:true, desc:'数据来源面板' },
  { prop:'showOrnament', type:'toggle', label:'装饰图形', default:true },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
]};
