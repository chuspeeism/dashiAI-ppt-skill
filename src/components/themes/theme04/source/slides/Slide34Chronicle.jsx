/*
 * Slide34Chronicle — 垂直里程碑时间轴（时间轴 · 2024 资本大事记）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCr- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与横向时间轴 Slide12Timeline 互补：本页为「纵向脊柱」时间轴，节点沿
 * 中轴自上而下排列，卡片左右交替（spine 模式）或统一靠右（rail 模式），
 * 每张卡片用一条发光连臂与中轴节点相连，构图饱满、彼此呼应。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  nodeCount       number 时间节点数量         默认 4   可选 2–5
 *  layoutVariant   enum   轴线布局            默认 'spine' 可选 'spine'|'rail'
 *  focusEnabled    bool   重点突出开关         默认 true
 *  focusIndex      number 重点节点序号(从1起)   默认 4
 *  showSpine       bool   中轴脊线显隐         默认 true
 *  showTag         bool   节点季度徽章显隐      默认 true
 *  showDecorations bool   星芒等点缀显隐        默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide34Chronicle, { defaults, controls } from './Slide34Chronicle.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSCR_ACCENT = '#FFC700';

// 2024 资本大事记（写死）：季度、标签、标题、说明、主色、单行重点
const XHSCR_NODES = [
  { tag: '24Q1', date: '一季度', color: '#15A7F0', head: '巨头加注，序幕拉开', stat: '军备竞赛', statSub: '白热化',
    desc: 'Anthropic 再融资，亚马逊、谷歌持续加码，模型军备竞赛白热化。' },
  { tag: '24Q2', date: '二季度', color: '#27E021', head: 'xAI 拿下 60 亿 B 轮', stat: '$60', statSub: '亿美元',
    desc: 'xAI 单笔募资 60 亿、估值冲上 240 亿，资本为「第三极」投票。' },
  { tag: '24Q3', date: '三季度', color: '#FF9FE2', head: 'OpenAI 刷新纪录', stat: '$1570', statSub: '亿估值',
    desc: 'OpenAI 拿下 66 亿融资、估值飙至 1570 亿，全年最受追捧。' },
  { tag: '24Q4', date: '四季度', color: '#FFC700', head: '全年冲破 970 亿', stat: '$970', statSub: '亿美元',
    desc: '巨额事件接力刷新，全年风投定格 970 亿，约占美国 VC 三分之一。' },
  { tag: '25', date: '展望', color: '#15A7F0', head: '从估值到兑现', stat: '下一程', statSub: '看收入',
    desc: '资本叙事由「估值想象」转向「收入兑现」，市场为 IPO 表现定价。' },
];

function CrSpark({ size = 20, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}


const SLIDE34CHRONICLE_COPY = {
  text001: "CAPITAL CHRONICLE · 2024 资本大事记",
  text002: "一年时间，",
  text003: "资本写满纪录",
};
function Slide34Chronicle(props) {
  const {
      copy = SLIDE34CHRONICLE_COPY,
      nodesData = XHSCR_NODES,
    nodeCount = 4,
    layoutVariant = 'spine',
    focusEnabled = true,
    focusIndex = 4,
    showSpine = true,
    showTag = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(2, Math.min(5, nodeCount));
  const nodes = nodesData.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const spine = layoutVariant === 'spine';

  return (
    <section className="xhs-base xhsCr-root" data-label="资本大事记" data-screen-label="资本大事记"
      style={{ '--c': XHSCR_ACCENT }}>
      <style>{XHSCR_CSS}</style>

      <header className="xhsCr-head">
        <div className="xhsCr-kicker">{copy.text001}</div>
        <h2 className="xhsCr-title">{copy.text002}<HL color={XHSCR_ACCENT} variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className={'xhsCr-track is-' + (spine ? 'spine' : 'rail') + (showSpine ? '' : ' no-spine')}
        style={{ '--n': count }}>
        {showSpine && (
          <span className="xhsCr-spine" aria-hidden="true">
            <span className="xhsCr-spine-glow" />
          </span>
        )}
        {nodes.map((n, i) => {
          const left = spine && i % 2 === 1;
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i}
              className={'xhsCr-row' + (left ? ' is-left' : ' is-right') + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--cc': n.color, '--i': i }}>
              <div className="xhsCr-cell xhsCr-cell--card">
                <div className="xhsCr-card">
                  <div className="xhsCr-card-main">
                    <div className="xhsCr-card-top">
                      {showTag && <span className="xhsCr-tag">{n.tag}</span>}
                      <span className="xhsCr-date">{n.date}</span>
                    </div>
                    <div className="xhsCr-card-head">{n.head}</div>
                    <p className="xhsCr-card-desc">{n.desc}</p>
                  </div>
                  <div className="xhsCr-card-stat" aria-hidden="true">
                    <span className="xhsCr-stat-num">{n.stat}</span>
                    <span className="xhsCr-stat-sub">{n.statSub}</span>
                  </div>
                </div>
              </div>
              <div className="xhsCr-node" aria-hidden="true">
                <span className="xhsCr-arm" />
                <span className="xhsCr-dot"><span className="xhsCr-dotnum">{i + 1}</span></span>
              </div>
              <div className="xhsCr-cell xhsCr-cell--spacer" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <CrSpark size={26} color="#27E021" style={{ position: 'absolute', left: 78, bottom: 92 }} />
          <CrSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 150, bottom: 78 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 96, top: 138, width: 44, height: 44, borderRadius: '50%', border: '5px solid rgba(255,255,255,.8)', boxShadow: '0 0 22px rgba(255,255,255,.18)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCR_CSS = `
  .xhsCr-root{ padding:56px 132px 48px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; overflow:hidden; }
  .xhsCr-root::before{ content:''; position:absolute; inset:0;
    background:radial-gradient(1100px 760px at 50% 4%, color-mix(in srgb, var(--c) 13%, transparent), transparent 64%);
    pointer-events:none; }
  .xhsCr-head{ flex:0 0 auto; margin-bottom:6px; }
  .xhsCr-kicker{ font-family:"Space Mono",monospace; font-size:22px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:12px; }
  .xhsCr-title{ margin:0; font-size:50px; font-weight:900; color:#fff; line-height:1.06; }

  /* 纵向脊柱：三列网格(卡片 | 节点 | 占位)，节点列固定居中 */
  .xhsCr-track{ flex:1 1 auto; min-height:0; position:relative; display:flex; flex-direction:column;
    justify-content:center; gap:18px; padding:8px 0 4px; }

  /* —— 中轴脊线（双层：实线 + 流光）—— */
  .xhsCr-spine{ position:absolute; left:50%; top:14px; bottom:14px; width:6px; transform:translateX(-50%);
    background:linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.26) 12%, rgba(255,255,255,.26) 88%, rgba(255,255,255,0));
    border-radius:3px; overflow:visible; }
  .xhsCr-spine-glow{ position:absolute; inset:0; border-radius:3px;
    background:linear-gradient(180deg, transparent, color-mix(in srgb, var(--c) 60%, transparent) 50%, transparent);
    filter:blur(2px); opacity:.5; }
  .xhsCr-track.is-rail .xhsCr-spine{ left:74px; }

  .xhsCr-row{ position:relative; display:grid; grid-template-columns:1fr 130px 1fr; align-items:center; }
  /* 重点突出：非重点行降低对比（作用在卡片/连臂上，节点圆点保持不透明，避免脊线从圆里透出）*/
  .xhsCr-row.is-dim .xhsCr-card,
  .xhsCr-row.is-dim .xhsCr-arm{ opacity:.6; filter:saturate(.82); transition:opacity .3s ease, filter .3s ease; }
  .xhsCr-row.is-dim .xhsCr-dot{ filter:saturate(.82); transition:filter .3s ease; }

  .xhsCr-cell--card{ display:flex; min-width:0; }
  /* spine：左/右交替；左卡靠右贴轴、右卡靠左贴轴 */
  .xhsCr-row.is-left .xhsCr-cell--card{ grid-column:1; justify-content:flex-end; }
  .xhsCr-row.is-left .xhsCr-cell--spacer{ grid-column:3; }
  .xhsCr-row.is-right .xhsCr-cell--card{ grid-column:3; justify-content:flex-start; }
  .xhsCr-row.is-right .xhsCr-cell--spacer{ grid-column:1; }

  /* rail：所有卡片统一靠右单列 */
  .xhsCr-track.is-rail .xhsCr-row{ grid-template-columns:148px 1fr; }
  .xhsCr-track.is-rail .xhsCr-node{ grid-column:1; }
  .xhsCr-track.is-rail .xhsCr-cell--card{ grid-column:2; justify-content:flex-start; }
  .xhsCr-track.is-rail .xhsCr-cell--spacer{ display:none; }

  /* —— 节点 + 连臂 —— */
  .xhsCr-node{ grid-column:2; position:relative; display:flex; align-items:center; justify-content:center; z-index:3; }
  .xhsCr-dot{ position:relative; z-index:2; width:62px; height:62px; border-radius:50%; box-sizing:border-box;
    background:radial-gradient(circle at 36% 28%, #1d1d1d, #0b0b0b); border:4px solid var(--cc);
    display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 9px #000, 0 0 26px color-mix(in srgb, var(--cc) 45%, transparent);
    transition:transform .3s ease, box-shadow .3s ease, background .3s; }
  .xhsCr-dotnum{ font-family:"Space Mono",monospace; font-size:27px; font-weight:700; color:var(--cc); transition:color .3s; }
  .xhsCr-row.is-hot .xhsCr-dot{ background:radial-gradient(circle at 36% 28%, color-mix(in srgb, var(--cc) 70%, #fff), var(--cc)); transform:scale(1.16);
    box-shadow:0 0 0 9px #000, 0 0 52px color-mix(in srgb, var(--cc) 75%, transparent); }
  .xhsCr-row.is-hot .xhsCr-dotnum{ color:#06140f; }

  /* 连臂：从节点中心伸向卡片，末端有圆点呼应 */
  .xhsCr-arm{ position:absolute; top:50%; height:5px; width:72px; transform:translateY(-50%); z-index:1; border-radius:3px;
    background:linear-gradient(90deg, var(--cc), color-mix(in srgb, var(--cc) 30%, transparent));
    box-shadow:0 0 14px color-mix(in srgb, var(--cc) 55%, transparent); }
  .xhsCr-arm::after{ content:''; position:absolute; top:50%; width:13px; height:13px; border-radius:50%; transform:translateY(-50%);
    background:var(--cc); box-shadow:0 0 14px color-mix(in srgb, var(--cc) 80%, transparent); }
  .xhsCr-row.is-left .xhsCr-arm{ right:50%; background:linear-gradient(270deg, var(--cc), color-mix(in srgb, var(--cc) 30%, transparent)); }
  .xhsCr-row.is-left .xhsCr-arm::after{ left:-4px; }
  .xhsCr-row.is-right .xhsCr-arm{ left:50%; }
  .xhsCr-row.is-right .xhsCr-arm::after{ right:-4px; }
  .xhsCr-track.is-rail .xhsCr-arm{ left:50%; width:60px; background:linear-gradient(90deg, var(--cc), color-mix(in srgb, var(--cc) 30%, transparent)); }
  .xhsCr-track.is-rail .xhsCr-arm::after{ right:-4px; }

  /* —— 卡片（玻璃 + 主色辉光，与全 deck 视觉统一）—— */
  .xhsCr-card{ position:relative; width:100%; max-width:632px; box-sizing:border-box;
    display:flex; align-items:stretch; gap:24px;
    background:
      radial-gradient(150% 150% at var(--gx,86%) 0%, color-mix(in srgb, var(--cc) 22%, transparent) 0%, transparent 58%),
      linear-gradient(158deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.045) 56%, rgba(255,255,255,.02) 100%);
    border:1.5px solid color-mix(in srgb, var(--cc) 38%, rgba(255,255,255,.1));
    border-radius:24px; padding:15px 26px;
    box-shadow:0 22px 48px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.22), inset 0 -14px 28px rgba(0,0,0,.26);
    backdrop-filter:blur(7px);
    transition:border-color .3s, box-shadow .3s, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsCr-row.is-left .xhsCr-card{ --gx:14%; flex-direction:row-reverse; }
  .xhsCr-row.is-hot .xhsCr-card{ border-color:var(--cc);
    box-shadow:0 0 60px color-mix(in srgb, var(--cc) 30%, transparent), inset 0 2px 0 rgba(255,255,255,.26), inset 0 -14px 28px rgba(0,0,0,.26);
    transform:scale(1.02); }

  .xhsCr-card-main{ display:flex; flex-direction:column; gap:7px; min-width:0; flex:1 1 auto; }
  .xhsCr-row.is-left .xhsCr-card-main{ align-items:flex-end; text-align:right; }

  .xhsCr-card-top{ display:flex; align-items:center; gap:12px; }
  .xhsCr-row.is-left .xhsCr-card-top{ flex-direction:row-reverse; }
  .xhsCr-tag{ font-family:"Space Mono",monospace; font-size:21px; font-weight:700; color:#06140f; background:var(--cc);
    padding:3px 14px; border-radius:999px; box-shadow:inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsCr-date{ font-size:22px; font-weight:700; color:#b6b6b6; }
  .xhsCr-card-head{ font-size:30px; font-weight:900; color:#fff; line-height:1.08;
    text-shadow:0 0 20px color-mix(in srgb, var(--cc) 28%, transparent); }
  .xhsCr-card-desc{ margin:0; font-size:22px; line-height:1.34; font-weight:500; color:#c2c2c2; text-wrap:pretty; }

  /* 卡片侧的大数字模块 */
  .xhsCr-card-stat{ flex:0 0 auto; align-self:center; min-width:150px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:2px; padding:0 6px;
    border-left:1.5px solid color-mix(in srgb, var(--cc) 30%, rgba(255,255,255,.1)); }
  .xhsCr-row.is-left .xhsCr-card-stat{ border-left:none; border-right:1.5px solid color-mix(in srgb, var(--cc) 30%, rgba(255,255,255,.1)); }
  .xhsCr-stat-num{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:var(--cc); line-height:1;
    text-shadow:0 0 22px color-mix(in srgb, var(--cc) 45%, transparent); white-space:nowrap; }
  .xhsCr-stat-sub{ font-size:20px; font-weight:600; color:#9a9a9a; white-space:nowrap; }
`;

const META = {
  id: 'chronicle',
  label: '资本大事记',
  Component: Slide34Chronicle,
  defaults: {
      copy: SLIDE34CHRONICLE_COPY,
      nodesData: XHSCR_NODES,
    ...hlDefaults,
    nodeCount: 4,
    layoutVariant: 'spine',
    focusEnabled: true,
    focusIndex: 4,
    showSpine: true,
    showTag: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }], default: SLIDE34CHRONICLE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'nodesData', type: 'list', label: 'nodesData', itemLabel: '数据', fields: [{ key: "tag", label: "tag" }, { key: "date", label: "date" }, { key: "color", label: "color" }, { key: "head", label: "head" }, { key: "stat", label: "stat" }, { key: "statSub", label: "statSub" }, { key: "desc", label: "desc" }], default: XHSCR_NODES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'nodeCount', type: 'slider', label: '节点数量', min: 2, max: 5, step: 1, default: 4, desc: '时间轴节点数量' },
    { key: 'layoutVariant', type: 'radio', label: '轴线布局', options: ['spine', 'rail'], optionLabels: ['脊柱交替', '靠右单列'], default: 'spine', desc: '节点沿中轴交替 / 统一靠右单列' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一节点' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 4, maxFromKey: 'nodeCount', showIf: (v) => v.focusEnabled, desc: '被高亮节点的序号' },
    { key: 'showSpine', type: 'toggle', label: '中轴脊线', default: true, desc: '纵向中轴线' },
    { key: 'showTag', type: 'toggle', label: '季度徽章', default: true, desc: '节点季度标签徽章' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide34Chronicle.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide34Chronicle;
