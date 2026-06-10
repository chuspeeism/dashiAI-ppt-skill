import { useDeckStyles, deckTheme, SlideShell, SlideHead } from './DeckKit.jsx';
/* ============================================================================
   SlideCalendar — 投资日历（calendar heatmap · 全年逐日热力）
   独立组件：仅靠 props 控制内容与样式；render 时自注入 DeckKit 基座样式。
   与 Heatmap（行=赛道 × 列=月份 的类别热力网格）、Honeycomb（六边形镶嵌）刻意区分：
   本页是「日历热力图」—— 7 行(周一→周日) × 约 53 列(周)铺满全年，每格一天、色深 ∝ 当日
   大额融资事件数，月名标在列顶；可一眼读全年节奏：哪几周资金扎堆、周末显著回落。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop        | 类型             | 默认值 | 说明                              |
   | monthWeight | number[12]       | 见下   | 各月活跃度基线（驱动逐日强度）    |
   | seed        | number           | 7      | 逐日伪随机种子（确定性、刷新不变）|
   | year        | string           | '2024' | 年份标题（文本，非参数调节）      |
   | showMonths  | boolean          | true   | 月名标注显隐                      |
   | showLegend  | boolean          | true   | 色阶图例显隐                      |
   | focus       | boolean          | true   | 高亮某一个月                      |
   | focusIndex  | number (0–11)    | 2      | 高亮第几个月（0=1月）             |
   | showAside   | boolean          | true   | 右侧读数面板（装饰）              |
   | head        | …                | 见下   | 页眉文案                          |
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  monthWeight: [0.45,0.5,0.78,0.6,0.55,0.7,0.5,0.62,0.85,0.72,0.6,0.92],
  seed: 7,
  year: '2024',
  showMonths: true,
  showLegend: true,
  focus: true,
  focusIndex: 2,
  showAside: true,
  head: { no:'02', en:'Calendar · Deal Heatmap', cn:'投资日历 · 全年逐日热力' },
};

function SlideCalendar(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';

  const {
    monthWeight, seed, year, showMonths, showLegend, focus, focusIndex,
    showAside, head,
  } = { ...defaultProps, ...props };

  const fMonth = Math.max(0, Math.min(focusIndex, 11));
  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const monthEN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const monthLen = [31,29,31,30,31,30,31,31,30,31,30,31]; // 2024 闰年
  const cumStart = monthLen.reduce((a,l,i)=>{ a.push(i===0?0:a[i-1]+monthLen[i-1]); return a; },[]);
  const totalDays = monthLen.reduce((a,b)=>a+b,0);

  // 确定性 RNG（mulberry32）
  const rng = (()=>{ let s = seed>>>0; return ()=>{ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; })();
  const monthOf = (d)=>{ let m=0; while(m<11 && d>=cumStart[m+1]) m++; return m; };
  const days = [];
  for(let d=0; d<totalDays; d++){
    const m = monthOf(d); const dow = d%7; const weekend = dow>=5;
    let v = monthWeight[m]*4 * (weekend?0.35:1) + (rng()-0.45)*1.6;
    const lvl = Math.max(0, Math.min(4, Math.round(v)));
    days.push({ d, m, dow, col:Math.floor(d/7), lvl });
  }
  const cols = Math.floor((totalDays-1)/7)+1;
  const totalDeals = days.reduce((a,x)=>a+x.lvl,0);
  const focusDeals = days.filter(x=>x.m===fMonth).reduce((a,x)=>a+x.lvl,0);
  const peakMonth = monthWeight.indexOf(Math.max(...monthWeight));

  const LV = [ 'rgba(255,255,255,.06)', hexA(BLUE,.32), hexA(BLUE,.6), hexA(ACC,.7), ACC ];
  const CELL = 24, GAP = 5, STEP = CELL+GAP;
  const gridW = cols*STEP, gridH = 7*STEP;
  const dowLabel = ['一','','三','','五','','日'];

  // 焦点月列范围
  const fStartCol = Math.floor(cumStart[fMonth]/7);
  const fEndCol = Math.floor((cumStart[fMonth]+monthLen[fMonth]-1)/7);

  return (
    <SlideShell orbs={[{ w:520, h:520, right:-150, top:-150,
        color:`radial-gradient(circle at 50% 50%, ${hexA(ACC,.14)}, ${hexA(ACC,0)} 70%)` }]}>
      <SlideHead no={head.no} en={head.en} cn={head.cn} badge={head.no} />

      <div style={{flex:'1 1 0', minHeight:0, display:'grid', gridTemplateColumns: showAside?'1fr 360px':'1fr', gap:30, marginTop:26, alignItems:'stretch'}}>
        <div className="dk-glass dk-anim d1" style={{minWidth:0, borderRadius:'var(--dk-radius)', padding:'26px 34px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{display:'flex', alignItems:'baseline', gap:18, marginBottom:18}}>
            <span style={{fontFamily:'var(--font-display)', fontWeight:900, fontSize:54, lineHeight:1}} className="dk-ink-grad">{year}</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--type-tiny)', color:'var(--ink-faint)', letterSpacing:'.1em'}}>≥ $1亿 事件 · 逐日分布</span>
          </div>
          <svg viewBox={`0 0 ${gridW+44} ${gridH+44}`} style={{width:'100%', display:'block'}}>
            {/* 月名 */}
            {showMonths && monthNames.map((mn,m)=>{
              const c = Math.floor(cumStart[m]/7);
              return <text key={m} x={44+c*STEP} y={20} fontFamily="var(--font-cn)" fontWeight="700" fontSize="17"
                fill={focus&&m===fMonth?ACC:'var(--ink-dim)'}>{mn}</text>;
            })}
            {/* 周几标 */}
            {dowLabel.map((l,r)=> l? <text key={r} x={20} y={44+r*STEP+CELL*0.7} textAnchor="middle" fontFamily="var(--font-cn)" fontSize="14" fill="var(--ink-faint)">{l}</text>:null)}
            {/* 焦点月高亮框 */}
            {focus && (<rect x={44+fStartCol*STEP-3} y={44-3} width={(fEndCol-fStartCol+1)*STEP+1} height={gridH+1} rx={8} fill="none" stroke={ACC} strokeWidth="2.5" strokeDasharray="6 5" opacity=".85" />)}
            {/* 日格 */}
            {days.map((x)=>{
              const dim = focus && x.m!==fMonth;
              return <rect key={x.d} x={44+x.col*STEP} y={44+x.dow*STEP} width={CELL} height={CELL} rx={5}
                fill={LV[x.lvl]} opacity={dim?0.5:1} stroke={x.lvl>=4?hexA('#ffffff',.3):'none'} strokeWidth="1" />;
            })}
          </svg>
          {showLegend && (
            <div style={{display:'flex', alignItems:'center', gap:12, marginTop:18, fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink-faint)'}}>
              <span>少</span>
              {LV.map((c,i)=>(<span key={i} style={{width:18, height:18, borderRadius:4, background:c, border:'1px solid rgba(255,255,255,.08)'}}></span>))}
              <span>多</span>
              <span style={{marginLeft:'auto'}}>每格 = 一天 · 色深 ∝ 当日大额事件数</span>
            </div>
          )}
        </div>

        {showAside && (
          <div className="dk-anim d2" style={{display:'flex', flexDirection:'column', gap:18, minWidth:0}}>
            {[
              { v:String(totalDeals), u:'格·年', l:'全年累计强度', c:ACC },
              { v:monthNames[fMonth], u:'', l:'焦点月份 · '+monthEN[fMonth], c:'#fff', big:false },
              { v:String(focusDeals), u:'格', l:monthNames[fMonth]+' 当月强度', c:BLUE },
              { v:monthNames[peakMonth], u:'', l:'全年最热月份', c:ACC, big:false },
            ].map((s,i)=>(
              <div key={i} className="dk-glass" style={{flex:'1 1 0', borderRadius:20, padding:'20px 26px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontFamily: s.big===false?'var(--font-cn)':'var(--font-display)', fontWeight:900, fontSize: s.big===false?'var(--type-h2)':56, lineHeight:.95, color:s.c}}>{s.v}</span>
                  {s.u && <span style={{fontSize:'var(--type-tiny)', color:'var(--ink-dim)', fontWeight:600}}>{s.u}</span>}
                </div>
                <span style={{fontSize:'var(--type-tiny)', color:'var(--ink-faint)', marginTop:6}}>{s.l}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideShell>
  );

  function hexA(hex, a){
    if(!hex || hex[0] !== '#') return hex;
    const x = hex.slice(1); const f = x.length===3 ? x.split('').map(c=>c+c).join('') : x;
    return `rgba(${parseInt(f.slice(0,2),16)},${parseInt(f.slice(2,4),16)},${parseInt(f.slice(4,6),16)},${a})`;
  }
}

export default SlideCalendar;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'calendar', name:'投资日历 · Calendar', controls:[
  { prop:'seed', type:'slider', label:'分布种子', default:7, min:1, max:40, step:1, desc:'确定性逐日强度' },
  { prop:'showMonths', type:'toggle', label:'月名标注', default:true },
  { prop:'showLegend', type:'toggle', label:'色阶图例', default:true },
  { prop:'showAside', type:'toggle', label:'装饰文案', default:true, desc:'读数面板' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
  { prop:'focusIndex', type:'slider', label:'焦点序号', default:2, min:0, max:11, step:1, showIf:(p)=>p.focus, desc:'高亮月份' },
]};
