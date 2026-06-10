import { useDeckStyles, deckTheme, SlideShell, SlideHead } from './DeckKit.jsx';
/* ============================================================================
   SlideFan — 预测扇形（不确定性锥 · 实测线 + 预测中值 + 渐宽置信带）
   独立组件：仅靠 props 控制内容与样式；render 时自注入 DeckKit 基座样式。
   与 Trend（多条并列实线走势）、Ribbon（单根比例带）、Stacked（堆叠）刻意区分：
   本页是「预测扇形/不确定性锥」—— 左侧实测实线在「当下」之后分叉为预测中值虚线，
   外裹一道随时间渐宽的乐观/悲观置信带，读「确定的过去 + 张开的未来」。

   ── 可调参数（Props） ──────────────────────────────────────────────────────
   | prop        | 类型                          | 默认值 | 说明                          |
   | hist        | {x,v}[]                       | 见下   | 历史实测点                    |
   | forecast    | {x,mid,lo,hi}[]               | 见下   | 预测点（中值 + 上下界）       |
   | showBand    | boolean                       | true   | 置信带（不确定性锥）          |
   | showMedian  | boolean                       | true   | 预测中值虚线                  |
   | showGrid    | boolean                       | true   | 网格刻度                      |
   | focus       | boolean                       | true   | 高亮终点目标读数              |
   | focusIndex  | number                        | 2      | 高亮第几个预测年（标注）      |
   | showAside   | boolean                       | true   | 读图（装饰）                  |
   | unit/head : 见下                                                            |
   ========================================================================== */
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  showBand: true,
  showMedian: true,
  showGrid: true,
  focus: true,
  focusIndex: 2,
  showAside: true,
  unit: '亿$',
  head: { no:'07', en:'Fan · Forecast', cn:'资本展望 · 不确定性锥' },
  hist: [
      { x:'2019', v:120 }, { x:'2020', v:180 }, { x:'2021', v:340 },
      { x:'2022', v:300 }, { x:'2023', v:560 }, { x:'2024', v:970 },
    ],
  forecast: [
      { x:'2025', mid:1180, lo:1040, hi:1340 },
      { x:'2026', mid:1380, lo:1080, hi:1720 },
      { x:'2027', mid:1560, lo:1100, hi:2080 },
    ],
};

function SlideFan(props){
  useDeckStyles(props.theme);
  const T = (deckTheme ? deckTheme(props.theme) : {});
  const ACC = T.accent || '#46e3c6';
  const BLUE = T.blue || '#4a86ff';
  const WARN = T.warn || '#ffb27a';
  const navy = T.navy900 || '#050b22';

  const {
    showBand, showMedian, showGrid, focus, focusIndex, showAside, unit,
    head, hist, forecast,
  } = { ...defaultProps, ...props };

  const fIdx = Math.max(0, Math.min(focusIndex, forecast.length - 1));
  const last = hist[hist.length-1];
  // 全序列 x 标签
  const xs = [...hist.map(h=>h.x), ...forecast.map(f=>f.x)];
  const N = xs.length;
  const allV = [...hist.map(h=>h.v), ...forecast.flatMap(f=>[f.lo,f.hi,f.mid])];
  const maxV = Math.max(...allV)*1.06, minV = 0;

  const W = 1620, H = 600, padL = 70, padR = 40, padT = 24, padB = 44;
  const iw = W-padL-padR, ih = H-padT-padB;
  const xAt = (i)=> padL + iw*(i/(N-1));
  const yAt = (v)=> padT + ih*(1 - (v-minV)/(maxV-minV));
  const histPts = hist.map((h,i)=> [xAt(i), yAt(h.v)]);
  const fcStartI = hist.length-1; // 锥起自最后历史点
  // 中值线（自最后历史点延伸）
  const midPts = [[xAt(fcStartI), yAt(last.v)], ...forecast.map((f,i)=> [xAt(hist.length+i), yAt(f.mid)])];
  const hiPts = [[xAt(fcStartI), yAt(last.v)], ...forecast.map((f,i)=> [xAt(hist.length+i), yAt(f.hi)])];
  const loPts = [[xAt(fcStartI), yAt(last.v)], ...forecast.map((f,i)=> [xAt(hist.length+i), yAt(f.lo)])];
  const poly = (a)=> a.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const line = (a)=> 'M'+a.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
  const bandPath = 'M' + hiPts.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')
                 + ' L ' + [...loPts].reverse().map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') + ' Z';
  const nowX = xAt(fcStartI);
  const ticks = 4;
  const tickVals = Array.from({length:ticks+1}, (_,i)=> Math.round(maxV*i/ticks));
  const fy = forecast[fIdx];

  return (
    <SlideShell orbs={[{ w:560, h:560, right:-150, top:-150,
        color:`radial-gradient(circle at 50% 50%, ${hexA(ACC,.14)}, ${hexA(ACC,0)} 70%)` }]}>
      <SlideHead no={head.no} en={head.en} cn={head.cn} badge={head.no} />

      {/* 图例 */}
      <div className="dk-anim d1" style={{display:'flex', gap:36, marginTop:14, flexWrap:'wrap'}}>
        <Leg c={ACC} t="历史实测" solid />
        {showMedian && <Leg c={BLUE} t="预测中值" dash />}
        {showBand && <Leg c={hexA(BLUE,.4)} t="置信区间（乐观—悲观）" block />}
      </div>

      <div className="dk-anim d2" style={{flex:'1 1 0', minHeight:0, position:'relative', marginTop:10}}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{display:'block'}}>
          <defs>
            <linearGradient id="fanBand" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={hexA(BLUE,.28)} /><stop offset="1" stopColor={hexA(WARN,.26)} />
            </linearGradient>
            <linearGradient id="fanHist" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={hexA(ACC,0)} /><stop offset="1" stopColor={hexA(ACC,.22)} />
            </linearGradient>
          </defs>

          {/* 网格 */}
          {showGrid && tickVals.map((v,i)=>(
            <g key={i}>
              <line x1={padL} y1={yAt(v)} x2={W-padR} y2={yAt(v)} stroke="rgba(255,255,255,.07)" strokeWidth="1" />
              <text x={padL-12} y={yAt(v)+5} textAnchor="end" fontFamily="var(--font-mono)" fontSize="13" fill="var(--ink-faint)">{v}</text>
            </g>
          ))}

          {/* 历史面积 */}
          <path d={`${line(histPts)} L${nowX.toFixed(1)},${(H-padB).toFixed(1)} L${padL.toFixed(1)},${(H-padB).toFixed(1)} Z`} fill="url(#fanHist)" />

          {/* '当下'分界 */}
          <line x1={nowX} y1={padT} x2={nowX} y2={H-padB} stroke={hexA('#fff',.3)} strokeWidth="1.5" strokeDasharray="4 6" />
          <text x={nowX} y={padT-6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill="#fff">当下</text>

          {/* 置信带（锥） */}
          {showBand && <path d={bandPath} fill="url(#fanBand)" stroke="none" />}
          {showBand && <polyline points={poly(hiPts)} fill="none" stroke={hexA(BLUE,.5)} strokeWidth="1.5" strokeDasharray="3 5" />}
          {showBand && <polyline points={poly(loPts)} fill="none" stroke={hexA(WARN,.5)} strokeWidth="1.5" strokeDasharray="3 5" />}

          {/* 历史实线 */}
          <path d={line(histPts)} fill="none" stroke={ACC} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"
            style={{filter:`drop-shadow(0 0 10px ${hexA(ACC,.5)})`}} />
          {histPts.map((p,i)=>(<circle key={i} cx={p[0]} cy={p[1]} r={i===histPts.length-1?8:5} fill={i===histPts.length-1?'#fff':ACC} stroke={ACC} strokeWidth="2" />))}

          {/* 预测中值虚线 */}
          {showMedian && <path d={line(midPts)} fill="none" stroke={BLUE} strokeWidth="3.5" strokeDasharray="9 7" strokeLinecap="round" />}
          {showMedian && forecast.map((f,i)=>(<circle key={i} cx={xAt(hist.length+i)} cy={yAt(f.mid)} r={focus&&i===fIdx?9:6} fill={focus&&i===fIdx?BLUE:navy} stroke={BLUE} strokeWidth="2.5"
            style={{filter: focus&&i===fIdx?`drop-shadow(0 0 14px ${hexA(BLUE,.8)})`:'none'}} />))}

          {/* 焦点年标注 */}
          {focus && fy && (
            <g>
              <line x1={xAt(hist.length+fIdx)} y1={yAt(fy.hi)} x2={xAt(hist.length+fIdx)} y2={yAt(fy.lo)} stroke={hexA('#fff',.35)} strokeWidth="1.5" />
              <text x={xAt(hist.length+fIdx)} y={yAt(fy.mid)-20} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="30" fill="#fff">{fy.mid}</text>
            </g>
          )}

          {/* x 轴标签 */}
          {xs.map((x,i)=>(
            <text key={i} x={xAt(i)} y={H-padB+26} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14"
              fontWeight={i===fcStartI?700:400} fill={i>=hist.length?hexA(BLUE,.9):i===fcStartI?'#fff':'var(--ink-faint)'}>{x}</text>
          ))}
        </svg>
      </div>

      {showAside && (
        <div className="dk-glass-dark dk-anim d3" style={{flexShrink:0, marginTop:8, borderRadius:18, padding:'14px 30px', display:'flex', alignItems:'center', gap:22}}>
          <span style={{flexShrink:0, fontFamily:'var(--font-mono)', fontSize:14, letterSpacing:'.12em', color:ACC}}>读图</span>
          <p style={{fontSize:'var(--type-small)', lineHeight:1.5, color:'rgba(255,255,255,.86)', textWrap:'pretty', margin:0}}>
            实线为 {hist[0].x}–{last.x} 实测（{last.v} {unit}）。{fy.x} 中值预测 <b style={{color:BLUE}}>{fy.mid}</b> {unit}，
            区间 {fy.lo}–<b style={{color:'#fff'}}>{fy.hi}</b>；置信带越往后越张开，刻画远期不确定性的累积。
          </p>
        </div>
      )}
    </SlideShell>
  );

  function Leg({ c, t, solid, dash, block }){
    return (
      <span style={{display:'inline-flex', alignItems:'center', gap:10, fontSize:'var(--type-small)', color:'var(--ink-dim)'}}>
        {block
          ? <i style={{width:30, height:14, borderRadius:3, background:c}}></i>
          : <i style={{width:30, height:0, borderTop:`3px ${dash?'dashed':'solid'} ${c}`}}></i>}
        {t}
      </span>
    );
  }
  function hexA(hex, a){
    if(!hex || hex[0] !== '#') return hex;
    const x = hex.slice(1); const f = x.length===3 ? x.split('').map(c=>c+c).join('') : x;
    return `rgba(${parseInt(f.slice(0,2),16)},${parseInt(f.slice(2,4),16)},${parseInt(f.slice(4,6),16)},${a})`;
  }
}

export default SlideFan;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'fan', name:'预测扇形 · Fan', controls:[
  { prop:'showBand', type:'toggle', label:'置信带', default:true },
  { prop:'showMedian', type:'toggle', label:'预测中值', default:true },
  { prop:'showGrid', type:'toggle', label:'网格刻度', default:true },
  { prop:'showAside', type:'toggle', label:'装饰文案', default:true, desc:'读图条' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
  { prop:'focusIndex', type:'slider', label:'焦点序号', default:2, min:0, max:2, step:1, showIf:(p)=>p.focus, desc:'标注第几个预测年' },
]};
