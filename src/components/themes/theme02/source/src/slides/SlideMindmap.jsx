/**
 * SlideMindmap.jsx — 机会图谱（关系图 · 中心核 + 分支 + 叶子卡）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 参考「中心核心 + N 个分支节点，每个分支再发散出若干叶子卡」逻辑板式，
 * 用连接线表达 1→N→M 的层级关系。坐标基于固定画布尺寸计算，纯关系图。
 *
 * ── Props (see slideMindmapDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm, index   strings
 *   core         {label}            中心核文案
 *   branches     Array<{label,sub,leaves:Array<{title,desc}>}>
 *   branchCount  number   分支数量（2–3）
 *   leafCount    number   每个分支的叶子卡数量（1–3）
 *   focusEnabled boolean  高亮某一分支（含其叶子）
 *   focusIndex   number   0-based 被强调分支
 *   showLeaves   boolean  显示叶子卡
 *   showSub      boolean  分支副标题
 *   showConnectors boolean 连接线
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideMindmapDefaults = {
  kicker: 'OPPORTUNITY · 机会图谱',
  title: '看好方向 ',
  titleEm: '三维机会',
  index: '25 / 27',
  core: { label: '核心机会' },
  branches: [
    { label: '垂直应用', sub: 'Vertical AI', leaves: [
      { title: '企业搜索', desc: 'Glean · 嵌入刚性工作流' },
      { title: '法律 AI', desc: 'Harvey · 已验证 PMF' },
      { title: '场景闭环', desc: '付费留存与续约清晰' },
    ] },
    { label: '基础设施中游', sub: 'Infrastructure', leaves: [
      { title: '数据标注', desc: 'Scale AI · 训练刚需' },
      { title: '向量数据库', desc: 'Pinecone · 检索底座' },
      { title: '卖铲子逻辑', desc: '需求来自模型训练推理' },
    ] },
    { label: '具身智能', sub: 'Embodied AI', leaves: [
      { title: '人形机器人', desc: 'Figure AI · 长周期硬科技' },
      { title: '自动驾驶', desc: '多模态感知积累深厚' },
      { title: '技术壁垒', desc: '资本与时间双重护城河' },
    ] },
  ],
  branchCount: 3,
  leafCount: 3,
  focusEnabled: false,
  focusIndex: 1,
  showLeaves: true,
  showSub: true,
  showConnectors: true,
  coreFlow: true,
};

export const slideMindmapControls = [
  { key: 'branchCount', type: 'number', label: '分支数量', default: 3, min: 2, max: 3, step: 1,
    maxFrom: (p) => (p.branches ? p.branches.length : 3), describe: '分支节点数量' },
  { key: 'leafCount', type: 'number', label: '叶子数量', default: 3, min: 1, max: 3, step: 1,
    describe: '每个分支发散的叶子卡数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮某一分支及其叶子' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 1, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.branchCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调分支的序号' },
  { key: 'showLeaves', type: 'toggle', label: '叶子卡', default: true,
    describe: '显示/隐藏叶子卡' },
  { key: 'showSub', type: 'toggle', label: '分支副标题', default: true,
    describe: '分支副标题显隐' },
  { key: 'showConnectors', type: 'toggle', label: '连接线', default: true,
    describe: '层级连接线显隐' },
  { key: 'coreFlow', type: 'toggle', label: '中心流光', default: true,
    describe: '中心球体的荧光流动动效' },
];

const W = 1704, H = 748, BR = 96, CORE = 212;   // canvas + branch radius + core sphere (px, design space)

function layout(count) {
  if (count <= 2) {
    return [
      { x: 470, y: H / 2, side: 'left' },
      { x: 1234, y: H / 2, side: 'right' },
    ];
  }
  return [
    { x: 452, y: H / 2, side: 'left' },
    { x: 1060, y: 190, side: 'right' },
    { x: 1060, y: 558, side: 'right' },
  ];
}

export function SlideMindmap(props) {
  const p = { ...slideMindmapDefaults, ...props };
  const bCount = Math.max(2, Math.min(p.branches.length, p.branchCount));
  const lCount = Math.max(1, Math.min(3, p.leafCount));
  const branches = p.branches.slice(0, bCount);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(bCount - 1, p.focusIndex)) : -1;
  const pos = layout(bCount);
  const core = { x: W / 2, y: H / 2 };
  const LCW = 300, LCH = 116, leafGap = 150;
  const leafCx = (side) => (side === 'left' ? 178 : W - 178);

  // Leaf positions. Branches that SHARE a leaf column (e.g. the two right-side
  // branches in the 3-branch layout) would otherwise stack into the same x and
  // overlap — so we pool every leaf in a column and distribute them evenly down
  // the canvas, then hand each branch back its own leaves (lines stay correct).
  const columns = {};
  branches.forEach((b, bi) => {
    const x = leafCx(pos[bi].side);
    const leaves = (b.leaves || []).slice(0, lCount).map((lf) => ({ ...lf, x, bi }));
    (columns[x] = columns[x] || []).push(...leaves);
  });
  const topM = LCH / 2 + 10, botM = H - LCH / 2 - 10, midY = (topM + botM) / 2;
  Object.values(columns).forEach((arr) => {
    const n = arr.length;
    const step = n > 1 ? Math.min(leafGap, (botM - topM) / (n - 1)) : 0;
    const startY = midY - (step * (n - 1)) / 2;
    arr.forEach((it, k) => { it.y = startY + k * step; });
  });
  const branchLeaves = branches.map((b, bi) => {
    const x = leafCx(pos[bi].side);
    return columns[x].filter((it) => it.bi === bi);
  });

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />

        <div className="gxn-rise-2" style={{ position: 'relative', flex: 1, marginTop: 14, minHeight: 0 }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
                 style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
              {p.showConnectors && pos.map((b, bi) => {
                const isDim = fIdx >= 0 && bi !== fIdx;
                return (
                  <g key={bi} opacity={isDim ? 0.3 : 1}>
                    {/* core → branch */}
                    <line x1={core.x} y1={core.y} x2={b.x} y2={b.y}
                          stroke="rgba(var(--gxn-glow),0.45)" strokeWidth="2" />
                    {/* branch → leaves */}
                    {p.showLeaves && branchLeaves[bi].map((lf, li) => {
                      const ex = lf.x + (b.side === 'left' ? LCW / 2 : -LCW / 2);
                      return <line key={li} x1={b.x} y1={b.y} x2={ex} y2={lf.y}
                                   stroke="rgba(var(--gxn-glow),0.3)" strokeWidth="2" />;
                    })}
                  </g>
                );
              })}
            </svg>

            {/* core sphere — large filled neon orb; optional flowing gradient */}
            <div style={{ position: 'absolute', left: `${(core.x / W) * 100}%`, top: `${(core.y / H) * 100}%`,
                          transform: 'translate(-50%,-50%)', zIndex: 3 }}>
              <div className={cx('gxn-sphere', p.coreFlow && 'is-flow')} style={{
                width: CORE, height: CORE, borderRadius: '50%', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                border: '1px solid rgba(var(--gxn-glow),0.7)',
                boxShadow: '0 0 120px -10px rgba(var(--gxn-glow),0.85), 0 20px 60px -22px rgba(0,0,0,0.85), inset 0 -26px 56px -22px rgba(0,0,0,0.45)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
                  background: 'radial-gradient(circle at 36% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 46%)' }} />
                <span style={{ position: 'relative', fontSize: 40, fontWeight: 800, lineHeight: 1.08,
                  color: '#08130c', letterSpacing: '-0.01em', textShadow: '0 1px 0 rgba(255,255,255,0.32)', padding: '0 20px' }}>{p.core.label}</span>
              </div>
            </div>

            {/* branches */}
            {pos.map((b, bi) => {
              const isF = bi === fIdx; const isDim = fIdx >= 0 && !isF;
              const br = branches[bi];
              return (
                <div key={bi} className={cx('gxn-panel', isF && 'is-focus')} style={{
                  position: 'absolute', left: `${(b.x / W) * 100}%`, top: `${(b.y / H) * 100}%`,
                  transform: 'translate(-50%,-50%)', width: BR * 2, height: BR * 2, borderRadius: '50%', zIndex: 2,
                  backgroundColor: 'var(--gxn-bg)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  textAlign: 'center', padding: 10, opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease',
                }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', lineHeight: 1.12, whiteSpace: 'nowrap' }}>{br.label}</span>
                  {p.showSub && br.sub && <span className="gxn-mono" style={{ fontSize: 18, color: 'var(--gxn-faint)', letterSpacing: '.04em' }}>{br.sub}</span>}
                </div>
              );
            })}

            {/* leaves */}
            {p.showLeaves && pos.map((b, bi) => {
              const isDim = fIdx >= 0 && bi !== fIdx;
              return branchLeaves[bi].map((lf, li) => (
                <div key={`${bi}-${li}`} className="gxn-panel" style={{
                  position: 'absolute', left: `${(lf.x / W) * 100}%`, top: `${(lf.y / H) * 100}%`,
                  transform: 'translate(-50%,-50%)', width: LCW, padding: '16px 22px', zIndex: 2,
                  backgroundColor: 'var(--gxn-bg)',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  textAlign: b.side === 'left' ? 'right' : 'left', alignItems: b.side === 'left' ? 'flex-end' : 'flex-start',
                  opacity: isDim ? 0.42 : 1, transition: 'opacity .3s ease',
                }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--gxn-accent)' }}>{lf.title}</span>
                  <span style={{ fontSize: 21, lineHeight: 1.4, color: 'var(--gxn-dim)' }}>{lf.desc}</span>
                </div>
              ));
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideMindmap;
