/*
 * Slide21Hub — 中心枢纽放射图（六大维度 · 一图读懂）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 类名统一前缀 xhsHub- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number  辐射卡数量          默认 6   可选 2–6
 *  focusEnabled    bool    重点突出开关         默认 false
 *  focusIndex      number  重点项序号(从1起)    默认 1   范围 1–itemCount
 *  showIcons       bool    卡片图标圆显隐        默认 true
 *  showChips       bool    枢纽内两枚标签显隐     默认 true
 *  showRing        bool    虚线圆环显隐          默认 true
 *  showTails       bool    放射连线显隐          默认 true
 *  connectorStyle  enum    连线样式             默认 'dashed' 可选 'tail'|'dashed'
 *  showDecorations bool    星芒 / 圆点等点缀      默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide21Hub, { defaults, controls } from './Slide21Hub.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSHUB_ITEMS = [
  { color: '#15A7F0', title: '资本规模', icon: 'trend',
    l1: '全年约 970 亿美元', l2: '大额轮次密集涌现', l3: '总量创历史新高' },
  { color: '#27E021', title: '赛道分布', icon: 'layers',
    l1: '基础模型 · 应用层', l2: '算力基建三层并进', l3: '资金向底座倾斜' },
  { color: '#FFC700', title: '头部集中', icon: 'podium',
    l1: 'Top10 吸走过半资金', l2: '马太效应持续放大', l3: '腰部融资明显趋紧' },
  { color: '#FF9FE2', title: '地区格局', icon: 'globe',
    l1: '旧金山湾区主导', l2: '人才与资本集聚', l3: '形成超级生态位' },
  { color: '#15A7F0', title: '估值兑现', icon: 'target',
    l1: '从赌叙事到看兑现', l2: '营收成为分水岭', l3: '商业化进度被重估' },
  { color: '#27E021', title: '风险信号', icon: 'alert',
    l1: '高烧钱 + 高估值', l2: '泡沫与回调隐忧', l3: '盈利路径待验证' },
];

/* ── 几何布局（固定 1920×1080 画布内的精确像素坐标）─────────────────── */
const HUB_GEO = {
  H: 680, cx: 864, cy: 340,
  rHub: 150, rRing: 238,
  leftInner: 648, rightInner: 1080,
  cardW: 612, leftX: 36, rightX: 1080,
  cardH: 180, topY: 122, botY: 558,
};

function hubColumnYs(n) {
  const { topY, botY, cy } = HUB_GEO;
  if (n <= 0) return [];
  if (n === 1) return [cy];
  return Array.from({ length: n }, (_, k) => topY + (k / (n - 1)) * (botY - topY));
}

/* —— 四角星（白芯发光）—— */
function HubSpark({ size = 24, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 6px ${color}aa)`, ...style }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="46%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

function HubDot({ size = 10, color = '#fff', style }) {
  return (
    <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}99`, ...style }} />
  );
}

/* —— 卡片图标（线性，黑底白线，置于霓虹圆内）—— */
function HubIcon({ kind }) {
  const p = { fill: 'none', stroke: '#06140f', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'trend':
      return (<svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <path {...p} d="M3 17l5-5 4 3 7-8" /><path {...p} d="M15 7h4v4" /></svg>);
    case 'layers':
      return (<svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <path {...p} d="M12 3l9 5-9 5-9-5 9-5Z" /><path {...p} d="M3 13l9 5 9-5" /></svg>);
    case 'podium':
      return (<svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <path {...p} d="M9 11h6v9H9z" /><path {...p} d="M3 15h6v5H3z" /><path {...p} d="M15 8h6v12h-6z" /></svg>);
    case 'globe':
      return (<svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M3 12h18" /><path {...p} d="M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></svg>);
    case 'target':
      return (<svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <circle {...p} cx="12" cy="12" r="8" /><circle {...p} cx="12" cy="12" r="3.4" /></svg>);
    case 'alert':
      return (<svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <path {...p} d="M12 3l9 16H3l9-16Z" /><path {...p} d="M12 10v4" /><circle cx="12" cy="16.6" r="1.1" fill="#06140f" stroke="none" /></svg>);
    default:
      return null;
  }
}

function HubCard({ item, side, x, y, dim, hot, showIcons, focusLabel = '重点' }) {
  const { cardW, cardH } = HUB_GEO;
  return (
    <div
      className={'xhsHub-card xhsHub-card--' + side + (dim ? ' is-dim' : '') + (hot ? ' is-hot' : '')}
      style={{ '--c': item.color, left: x, top: y - cardH / 2, width: cardW, height: cardH }}
    >
      {hot && <span className="xhsHub-flag">{focusLabel}</span>}
      {showIcons && (
        <span className="xhsHub-ic" aria-hidden="true">
          <HubIcon kind={item.icon} />
        </span>
      )}
      <div className="xhsHub-body">
        <div className="xhsHub-name">{item.title}</div>
        <div className="xhsHub-lines">
          {[item.l1, item.l2, item.l3].filter(Boolean).map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

/* —— 放射连线层（一张覆盖 stage 的 SVG，精确从枢纽连到每张卡片）—— */
function HubSpokes({ placed, showRing, showTails, connectorStyle, focusEnabled, focus }) {
  const { cx, cy, rHub, rRing, H } = HUB_GEO;
  return (
    <svg className="xhsHub-svg" viewBox={`0 0 1728 ${H}`} width="1728" height={H} aria-hidden="true">
      {showRing && (
        <circle cx={cx} cy={cy} r={rRing} fill="none"
          stroke="rgba(255,255,255,.22)" strokeWidth="2"
          strokeDasharray="2 13" strokeLinecap="round" />
      )}
      {showTails && placed.map((p, i) => {
        const ax = p.anchor.x, ay = p.anchor.y;
        const dx = ax - cx, dy = ay - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const hubEdge = { x: cx + ux * rHub, y: cy + uy * rHub };
        const node = { x: cx + ux * rRing, y: cy + uy * rRing };
        const dim = focusEnabled && p.idx !== focus;
        const op = dim ? 0.2 : 1;
        const dash = connectorStyle === 'dashed' ? '3 9' : undefined;
        // 箭头（tail 样式，指向卡片）
        const px = -uy, py = ux; // 垂直方向
        const tip = ax, tipY = ay;
        const baseX = ax - ux * 16, baseY = ay - uy * 16;
        const tri = `${tip},${tipY} ${baseX + px * 8},${baseY + py * 8} ${baseX - px * 8},${baseY - py * 8}`;
        return (
          <g key={i} style={{ opacity: op, transition: 'opacity .3s ease' }}>
            <line x1={hubEdge.x} y1={hubEdge.y} x2={ax} y2={ay}
              stroke={p.it.color} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={dash}
              style={{ filter: `drop-shadow(0 0 6px ${p.it.color}88)` }} />
            {/* 圆环节点 */}
            <circle cx={node.x} cy={node.y} r="8" fill="#05080c" stroke={p.it.color} strokeWidth="3.5"
              style={{ filter: `drop-shadow(0 0 8px ${p.it.color}cc)` }} />
            {/* 卡片端：尖角 or 圆点 */}
            {connectorStyle === 'tail'
              ? <polygon points={tri} fill={p.it.color} style={{ filter: `drop-shadow(0 0 5px ${p.it.color}aa)` }} />
              : <circle cx={ax} cy={ay} r="6" fill={p.it.color} style={{ filter: `drop-shadow(0 0 7px ${p.it.color})` }} />}
          </g>
        );
      })}
    </svg>
  );
}

function Slide21Hub(props) {
  const {
    itemCount = 6,
    focusEnabled = false,
    focusIndex = 1,
    showIcons = true,
    showChips = true,
    showRing = true,
    showTails = true,
    connectorStyle = 'dashed',
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = 'SIX\u00a0DIMENSIONS\u00a0\u00a0/\u00a0\u00a0全景速览',
    titleLead = '六大维度 · ',
    titleKeyword = '读懂 2024 AI 融资',
    sub = '从资本规模到风险信号，一张图看清这一年的全景脉络',
    hubLabel = '大维度',
    chip1 = '新格局',
    chip2 = '新拐点',
    footnote = '一张「中心 + 放射」结构图 · 把全年研究浓缩成六个可记忆的关键词',
    focusLabel = '重点',
    // 数据
    items = XHSHUB_ITEMS,
  } = props;

  const src = Array.isArray(items) && items.length ? items : XHSHUB_ITEMS;
  const count = Math.max(2, Math.min(6, Math.min(src.length, itemCount)));
  const shown = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;

  const { leftInner, rightInner, leftX, rightX } = HUB_GEO;
  const leftN = Math.ceil(count / 2);
  const rightN = count - leftN;
  const leftYs = hubColumnYs(leftN);
  const rightYs = hubColumnYs(rightN);

  const placed = shown.map((it, idx) => {
    const side = idx < leftN ? 'left' : 'right';
    const y = side === 'left' ? leftYs[idx] : rightYs[idx - leftN];
    const x = side === 'left' ? leftX : rightX;
    const anchor = side === 'left' ? { x: leftInner, y } : { x: rightInner, y };
    return { it, idx, side, x, y, anchor };
  });

  return (
    <section className="xhs-base xhsHub-root" data-label="六大维度" data-screen-label="六大维度">
      <style>{XHSHUB_CSS}</style>

      <header className="xhsHub-head">
        <div className="xhsHub-kicker">{kicker}</div>
        <h1 className="xhsHub-title">
          {titleLead}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h1>
        <p className="xhsHub-sub">{sub}</p>
      </header>

      <div className="xhsHub-stage">
        <HubSpokes placed={placed} showRing={showRing} showTails={showTails}
          connectorStyle={connectorStyle} focusEnabled={focusEnabled} focus={focus} />

        {placed.map((p) => (
          <HubCard key={p.idx} item={p.it} side={p.side} x={p.x} y={p.y}
            dim={focusEnabled && p.idx !== focus} hot={focusEnabled && p.idx === focus}
            showIcons={showIcons} focusLabel={focusLabel} />
        ))}

        <div className="xhsHub-hub" style={{ left: HUB_GEO.cx - HUB_GEO.rHub, top: HUB_GEO.cy - HUB_GEO.rHub, width: HUB_GEO.rHub * 2, height: HUB_GEO.rHub * 2 }}>
          <span className="xhsHub-bignum">{count}</span>
          <span className="xhsHub-hublabel">{hubLabel}</span>
          {showChips && (
            <div className="xhsHub-chips">
              <span>{chip1}</span>
              <span>{chip2}</span>
            </div>
          )}
        </div>

        {showDecorations && (
          <React.Fragment>
            <HubSpark size={26} color="#27E021" style={{ position: 'absolute', left: 770, top: 38 }} />
            <HubSpark size={20} color="#FF9FE2" style={{ position: 'absolute', right: 760, bottom: 30 }} />
            <HubDot size={11} color="#FFC700" style={{ position: 'absolute', left: 700, bottom: 70 }} />
            <HubDot size={9} color="#15A7F0" style={{ position: 'absolute', right: 706, top: 64 }} />
          </React.Fragment>
        )}
      </div>

      <footer className="xhsHub-foot">
        <span className="xhsHub-fdot" />
        {footnote}
      </footer>
    </section>
  );
}

const XHSHUB_CSS = `
.xhsHub-root{ padding:54px 96px 40px; position:relative; height:100%; box-sizing:border-box;
  display:flex; flex-direction:column; }

.xhsHub-head{ text-align:center; flex:0 0 auto; }
.xhsHub-kicker{ font-family:"Space Mono",monospace; font-size:21px; letter-spacing:.24em;
  color:#7c7c7c; margin-bottom:18px; }
.xhsHub-title{ margin:0; font-weight:900; font-size:52px; color:#fff; line-height:1.12; white-space:nowrap; }
.xhsHub-sub{ margin:22px 0 0; font-size:23px; color:#9a9a9a; font-weight:500; }

/* —— 舞台：固定 680px 高，绝对定位坐标系 —— */
.xhsHub-stage{ position:relative; flex:0 0 auto; height:680px; width:1728px; margin:14px auto 0; }
.xhsHub-svg{ position:absolute; left:0; top:0; overflow:visible; pointer-events:none; }

/* —— 卡片 —— */
.xhsHub-card{ position:absolute; display:flex; align-items:center; gap:24px;
  background:
    radial-gradient(130% 150% at var(--gx,84%) 0%, color-mix(in srgb, var(--c) 24%, transparent) 0%, transparent 56%),
    linear-gradient(162deg, rgba(255,255,255,.13) 0%, rgba(255,255,255,.045) 54%, rgba(255,255,255,.02) 100%);
  border:1.5px solid color-mix(in srgb, var(--c) 40%, rgba(255,255,255,.12));
  border-radius:34px; padding:0 40px; box-sizing:border-box;
  box-shadow:0 24px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.26), inset 0 -16px 30px rgba(0,0,0,.28);
  backdrop-filter:blur(7px); z-index:2;
  transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease; }
.xhsHub-card--right{ flex-direction:row-reverse; text-align:right; --gx:16%; }
.xhsHub-card.is-dim{ opacity:.38; filter:saturate(.65); }
.xhsHub-card.is-hot{ border-color:var(--c); z-index:3;
  box-shadow:0 0 64px color-mix(in srgb, var(--c) 52%, transparent), inset 0 2px 0 rgba(255,255,255,.3), inset 0 -16px 30px rgba(0,0,0,.28);
  transform:scale(1.035); }

.xhsHub-flag{ position:absolute; top:-22px; z-index:4; font-size:23px; font-weight:800; color:#06140f;
  letter-spacing:.06em; background:var(--c); padding:7px 26px; border-radius:999px; white-space:nowrap;
  box-shadow:0 12px 28px color-mix(in srgb, var(--c) 44%, transparent), inset 0 2px 0 rgba(255,255,255,.62), inset 0 0 16px rgba(255,255,255,.46); }
.xhsHub-card--left .xhsHub-flag{ left:46px; transform:rotate(-5deg); }
.xhsHub-card--right .xhsHub-flag{ right:46px; transform:rotate(5deg); }

.xhsHub-ic{ flex:0 0 auto; width:92px; height:92px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--c) 62%, #fff), var(--c) 52%, color-mix(in srgb, var(--c) 72%, #000));
  box-shadow:0 0 34px color-mix(in srgb, var(--c) 56%, transparent), inset 0 3px 0 rgba(255,255,255,.6), inset 0 -7px 16px rgba(0,0,0,.22); }

.xhsHub-body{ display:flex; flex-direction:column; gap:9px; min-width:0; }
.xhsHub-name{ font-size:33px; font-weight:900; color:var(--c); line-height:1.04;
  text-shadow:0 0 22px color-mix(in srgb, var(--c) 42%, transparent); }
.xhsHub-lines{ display:flex; flex-direction:column; gap:3px; }
.xhsHub-lines span{ font-size:22px; color:#cdcdcd; font-weight:500; line-height:1.26; white-space:nowrap; }

/* —— 中心枢纽 —— */
.xhsHub-hub{ position:absolute; z-index:3; border-radius:50%;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:radial-gradient(circle at 38% 30%, #7fd6ff 0%, #18a9f2 44%, #0a5fa6 78%, #073f74 100%);
  box-shadow:0 0 110px rgba(21,167,240,.5), inset 0 5px 0 rgba(255,255,255,.4), inset 0 -12px 36px rgba(0,30,60,.5); }
.xhsHub-bignum{ font-size:128px; font-weight:900; color:#fff; line-height:.9;
  text-shadow:0 6px 22px rgba(0,40,80,.4); }
.xhsHub-hublabel{ font-size:46px; font-weight:900; color:#fff; letter-spacing:.08em; margin-top:2px; }
.xhsHub-chips{ display:flex; gap:12px; margin-top:18px; }
.xhsHub-chips span{ font-size:19px; font-weight:700; color:#fff; padding:7px 18px;
  border-radius:999px; background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.42); }

.xhsHub-foot{ flex:0 0 auto; display:flex; align-items:center; justify-content:center; gap:13px;
  margin-top:auto; padding-top:18px; font-size:22px; color:#7e7e7e; font-weight:500; }
.xhsHub-fdot{ width:12px; height:12px; border-radius:50%; background:#FF2442; }
`;

const META = {
  id: 'hub',
  label: '六大维度',
  Component: Slide21Hub,
  defaults: {
    ...hlDefaults,
    itemCount: 6,
    focusEnabled: false,
    focusIndex: 1,
    showIcons: true,
    showChips: true,
    showRing: true,
    showTails: true,
    connectorStyle: 'dashed',
    showDecorations: true,
    kicker: 'SIX\u00a0DIMENSIONS\u00a0\u00a0/\u00a0\u00a0全景速览',
    titleLead: '六大维度 · ',
    titleKeyword: '读懂 2024 AI 融资',
    sub: '从资本规模到风险信号，一张图看清这一年的全景脉络',
    hubLabel: '大维度',
    chip1: '新格局',
    chip2: '新拐点',
      footnote: '一张「中心 + 放射」结构图 · 把全年研究浓缩成六个可记忆的关键词',
      focusLabel: '重点',
    items: XHSHUB_ITEMS,
  },
  controls: [
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '卡片数量', min: 2, max: 6, step: 1, default: 6, desc: '围绕枢纽的辐射卡数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一张卡片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮卡片的序号' },
    { key: 'showIcons', type: 'toggle', label: '卡片图标', default: true, desc: '霓虹图标圆显隐' },
    { key: 'showChips', type: 'toggle', label: '枢纽标签', default: true, desc: '中心圆内两枚标签' },
    { key: 'showRing', type: 'toggle', label: '虚线圆环', default: true, desc: '环绕枢纽的点线圈' },
    { key: 'showTails', type: 'toggle', label: '放射连线', default: true, desc: '枢纽连到卡片的放射线' },
    { key: 'connectorStyle', type: 'radio', label: '连线样式', options: ['tail', 'dashed'], optionLabels: ['尖角', '虚线圆点'], default: 'dashed', showIf: (v) => v.showTails, desc: '卡片端尖角 / 虚线圆点' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆点等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: 'SIX\u00a0DIMENSIONS\u00a0\u00a0/\u00a0\u00a0全景速览', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '六大维度 · ', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '读懂 2024 AI 融资', desc: '高亮关键词' },
    { key: 'sub', type: 'text', label: '副标题', default: '从资本规模到风险信号，一张图看清这一年的全景脉络', desc: '标题下方说明' },
    { key: 'hubLabel', type: 'text', label: '枢纽标签', default: '大维度', desc: '中心圆内标签' },
    { key: 'chip1', type: 'text', label: '枢纽芯片 1', default: '新格局', desc: '中心圆内芯片', showIf: (v) => v.showChips },
    { key: 'chip2', type: 'text', label: '枢纽芯片 2', default: '新拐点', desc: '中心圆内芯片', showIf: (v) => v.showChips },
    { key: 'footnote', type: 'text', label: '脚注', default: '一张「中心 + 放射」结构图 · 把全年研究浓缩成六个可记忆的关键词', desc: '底部脚注' },
    { key: 'focusLabel', type: 'text', label: '重点标记', default: '重点', desc: '焦点卡片上的标记文案' },
    { type: 'section', label: '数据 · 辐射卡' },
    {
      key: 'items', type: 'list', label: '辐射卡', itemLabel: '卡', countFromKey: 'itemCount',
      fields: [{ key: 'title', label: '标题' }, { key: 'l1', label: '行 1' }, { key: 'l2', label: '行 2' }, { key: 'l3', label: '行 3' }, { key: 'color', label: '颜色' }],
      default: XHSHUB_ITEMS, desc: '辐射卡：标题 / 三行文案 / 主色（icon 保留默认）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide21Hub.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide21Hub;
