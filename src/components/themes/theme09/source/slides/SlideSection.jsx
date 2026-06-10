import { useDeckStyles } from './DeckKit.jsx';
/* SlideSection — 章节扉页 (堆叠玻璃卡 风格)
   Props:
     sectionNo : string  章节编号
     titleCN   : string  中文章节名
     titleEN   : string  英文章节名
     bubbleText: string  前置气泡卡文字
     bubbleColor: string 气泡卡背景
     stackLabels: string[] 堆叠卡英文标签（自后向前）
     stackCount: number  堆叠卡数量
     items     : {label,sub}[]  右侧要点列表
     labelType : 'number'|'symbol'|'keyword'  气泡角标类型
     focus     : bool    高亮前置气泡卡
*/
/* ── 页面属性契约 · defaultProps ──────────────────────────────────────────
   本页全部可见文案 / 数据 / 图片槽默认值集中于此，直接编辑即可换内容；
   组件内部以 { ...defaultProps, ...props } 合并，外部传同名 props 逐项覆盖。 */
export const defaultProps = {
  sectionNo: '01',
  titleCN: '研究方法',
  titleEN: 'Methodology',
  bubbleText: '横纵分析法',
  bubbleColor: 'linear-gradient(180deg, #165FE7 0%, #0E58DE 100%)',
  bubbleTail: ['#0E58DE', '#0C51D2'],
  stackLabels: ['Causal Mapping', 'Value Chain', 'Market Panorama', 'Cross-Section', 'Time Axis'],
  stackCount: 5,
  items: [
    { label: '横向 · 空间维度', sub: '同一截面对比公司 / 赛道' },
    { label: '纵向 · 时间维度', sub: '沿时间轴追踪指标演化与拐点' },
    { label: '交叉 · 层级结构', sub: '识别产业链分层与因果传导关系' }],
  labelType: 'number',
  focus: true,
  focusIndex: 0,
};

function SlideSection(props) {
  useDeckStyles(props.theme);
  const {
    sectionNo, titleCN, titleEN, bubbleText, bubbleColor, bubbleTail, stackLabels,
    stackCount, items, labelType, focus, focusIndex,
  } = { ...defaultProps, ...props };

  const n = Math.max(1, Math.min(stackCount, 6));
  const labels = stackLabels.slice(0, n);

  const badge = () => {
    if (labelType === 'symbol') return '◆';
    if (labelType === 'keyword') return 'METHOD';
    return sectionNo;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 'var(--pad-y) var(--pad-x)' }}>
      <div className="dk-orb" style={{ width: 540, height: 540, left: 60, bottom: -180, background: 'radial-gradient(circle at 50% 50%, rgba(60,120,255,.4), rgba(40,90,230,0) 70%)' }}></div>

      {/* huge ghost number */}
      <div className="dk-anim" aria-hidden="true" style={{ position: 'absolute', right: 80, top: 30, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 420, lineHeight: .8, color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,.06)' }}>{sectionNo}</div>

      {/* stacked frosted cards (left) */}
      <div style={{ position: 'absolute', left: 120, top: 170, width: 760, height: 740 }}>
        {labels.map((lb, k) => {
          const i = labels.length - 1 - k; // back to front
          const cardW = 560 + i * 28;
          return (
            <div key={k} className={'dk-anim d' + Math.min(k + 1, 5)} style={{
              position: 'absolute',
              left: i * 46,
              top: i * 92,
              width: cardW,
              height: 150,
              borderRadius: 26,
              background: 'linear-gradient(150deg, rgba(255,255,255,' + (0.04 + i * 0.018) + '), rgba(255,255,255,' + (0.015 + i * 0.012) + '))',
              border: '1px solid rgba(255,255,255,' + (0.08 + i * 0.03) + ')',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 20px 50px rgba(3,8,30,.3)',
              display: 'flex', alignItems: 'center', padding: '0 34px',
              opacity: 0.45 + i * 0.13
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--type-sub)', whiteSpace: 'nowrap', color: 'rgba(255,255,255,' + (0.4 + i * 0.12) + ')' }}>{lb}</span>
            </div>);

        })}

        {/* front speech-bubble card */}
        <div className="dk-anim d5" style={{ position: 'absolute', left: labels.length * 46 + 14, top: labels.length * 92 + 8, zIndex: 5 }}>
          <div style={{
            position: 'relative', padding: '26px 46px 30px', borderRadius: 26, background: bubbleColor,
            boxShadow: focus ? '0 32px 72px rgba(40,90,230,.55), 0 0 0 2px rgba(255,255,255,.42)' : '0 24px 50px rgba(3,8,30,.45)',
            border: '1px solid rgba(255,255,255,.32)', minWidth: 300
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '.12em', color: '#fff', padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.34)' }}>{badge()}</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.7)' }}></span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.4)' }}></span>
            </div>
            <div style={{ fontFamily: 'var(--font-cn)', fontWeight: 900, fontSize: 'var(--type-sub)', color: '#fff', letterSpacing: '.04em', lineHeight: 1.12 }}>{bubbleText}</div>
            {/* pointer · 三角形尾：SVG 等腰下三角。气泡为 180°竖向渐变，底边水平匀色 #0E58DE；故尾填充用竖向渐变
                承接气泡：顶(接缝)=#0E58DE 与气泡底边同色零色差，尖端 #0C51D2 微暗作自然进深；仅描两斜边白边，顶边留空融入气泡 */}
            <svg width="46" height="24" viewBox="0 0 46 24" style={{ position: 'absolute', left: 50, top: '100%', marginTop: -3, overflow: 'visible' }}>
              <defs>
                <linearGradient id="dkBubbleTail" x1="0" y1="2" x2="0" y2="21" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={bubbleTail[0]}></stop>
                  <stop offset="1" stopColor={bubbleTail[1]}></stop>
                </linearGradient>
              </defs>
              <path d="M2 2 L23 21 L44 2 Z" fill="url(#dkBubbleTail)" style={{ filter: 'drop-shadow(0 3px 5px rgba(3,8,30,.18))' }}></path>
              <path d="M2 2 L23 21 L44 2" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* right title + items */}
      <div style={{ position: 'absolute', right: 'var(--pad-x)', top: 300, width: 720, zIndex: 6 }}>
        <div className="dk-anim d1" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--type-sub)', color: 'var(--mint)' }}>{sectionNo}</span>
          <span style={{ height: 2, width: 90, background: 'var(--mint)' }}></span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--type-small)', color: 'var(--ink-dim)', letterSpacing: '.06em' }}>{titleEN}</span>
        </div>
        <h2 className="dk-chrome dk-anim d2" style={{ fontFamily: 'var(--font-cn)', fontWeight: 900, fontSize: 120, lineHeight: 1, letterSpacing: '.04em' }}>{titleCN}</h2>

        <div style={{ marginTop: 54, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) => {
            const hot = focus && i === focusIndex;
            return (
              <div key={i} className={'dk-anim d' + Math.min(i + 3, 5)} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,.14)' }}>
              <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, background: hot ? 'rgba(70,227,198,.16)' : 'rgba(255,255,255,.1)', border: `1px solid ${hot ? 'var(--mint)' : 'rgba(255,255,255,.2)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--mint)' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={{ fontSize: 'var(--type-body)', fontWeight: 700, color: hot ? 'var(--mint)' : '#fff' }}>{it.label}</div>
                <div style={{ fontSize: 'var(--type-tiny)', color: 'var(--ink-dim)', marginTop: 3 }}>{it.sub}</div>
              </div>
            </div>);

          })}
        </div>
      </div>
    </div>);

}

export default SlideSection;

/* ── 模板参数 schema（自描述 · 迁移即带控件；Tweaks 由此自动生成） ── */
export const slideSpec = { defaults: defaultProps, slot:'section', name:'章节扉页 · Section', controls:[
  { prop:'stackCount', type:'slider', label:'堆叠数量', default:5, min:2, max:6, step:1, desc:'背后叠层玻璃卡数量' },
  { prop:'labelType', type:'labelType', label:'标签类型', default:'数字' },
  { prop:'focus', type:'focus', label:'重点信息 Focus', default:true },
  { prop:'focusIndex', type:'slider', label:'焦点序号', default:0, min:0, max:2, step:1, showIf:(p)=>p.focus },
]};
