// SlideSankey.jsx — 资金流向 · 桑基图 / where the money comes from → where it goes.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Left column = capital SOURCES, right column = SECTOR destinations. Curved
// ribbons carry value-proportional width between them; one source can be lit as
// a fluorescent thread while the rest dim back. Source count is tweakable and
// target totals recompute from the surviving flows so the chart stays balanced.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '市场全景',
  title: '资金流向 · 谁出钱，钱去哪',
  en: 'Capital Flow — Sources → Sectors',
  cn: '一张桑基图看清资本的来路与去向',
  unit: '亿',
  sources: [
    { name: '科技巨头', en: 'STRATEGIC', value: 370, color: '#7a5ae0' },
    { name: '风险投资', en: 'VC', value: 330, color: '#5b8def' },
    { name: '主权 / 私募', en: 'SOVEREIGN · PE', value: 175, color: '#46b083' },
    { name: '企业风投', en: 'CVC', value: 95, color: '#e0a23a' },
  ],
  targets: [
    { name: '通用大模型', en: 'FOUNDATION', color: '#5b8def' },
    { name: 'AI 基础设施', en: 'INFRA · COMPUTE', color: '#46b083' },
    { name: '垂直应用', en: 'APPLICATIONS', color: '#e0a23a' },
    { name: 'AI 硬件 · 机器人', en: 'HARDWARE', color: '#e8503a' },
  ],
  // flows: [sourceIndex, targetIndex, value]
  flows: [
    [0, 0, 230], [0, 1, 120], [0, 3, 20],
    [1, 0, 120], [1, 1, 70], [1, 2, 110], [1, 3, 30],
    [2, 0, 80], [2, 1, 70], [2, 3, 25],
    [3, 0, 16], [3, 1, 2], [3, 2, 65], [3, 3, 12],
  ],
  caption: '桑基图 · 战略资本主攻大模型，VC 更广撒于应用',
  // tweakable (universal names)
  sourceCount: 4,
  highlight: true,
  highlightIndex: 0,
  showValues: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'sourceCount', label: '资本来源数量', type: 'number', default: 4, min: 2, max: 4, step: 1, unit: ' 类',
    description: '左侧资本来源节点数量；去向占比按保留的流量自动重算。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把某一类资本来源点亮成荧光主线、其余淡出。' },
  { key: 'highlightIndex', label: '强调第几类', type: 'number', default: 0, min: 0, max: 3, step: 1,
    description: '被点亮的资本来源序号（从 0 开始）。' },
  { key: 'showValues', label: '数值标签', type: 'boolean', default: true,
    description: '节点上的金额标签显示。' },
  { key: 'accentColor', label: '强调色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a', '#c9f24d'],
    description: '荧光主线的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function NodeBar({ x, y, h, w, color, lit, dim }) {
  return (
    <rect x={x} y={y} width={w} height={Math.max(2, h)} rx={6}
      fill={color} opacity={dim ? 0.32 : 1}
      style={{ filter: lit ? `drop-shadow(0 6px 16px ${hexA(color, 0.5)})` : 'none' }} />
  );
}

export default function SlideSankey(props) {
  const p = { ...defaultProps, ...props };
  const W = 1704, H = 612;                 // svg viewport (content area)
  const nodeW = 20, gap = 30, pad = 4;
  const srcX = 250, tgtX = W - 250;

  const geo = React.useMemo(() => {
    const sCount = Math.max(2, Math.min(p.sources.length, p.sourceCount));
    const sources = p.sources.slice(0, sCount);
    const flows = p.flows.filter((f) => f[0] < sCount);
    // recompute target totals from surviving flows
    const tVals = p.targets.map((_, ti) => flows.filter((f) => f[1] === ti).reduce((a, f) => a + f[2], 0));
    const targets = p.targets.map((t, ti) => ({ ...t, value: tVals[ti] })).filter((t) => t.value > 0);
    const tIndex = {};                      // old target idx -> new compact idx
    let k = 0; p.targets.forEach((_, ti) => { if (tVals[ti] > 0) tIndex[ti] = k++; });

    const sTotal = sources.reduce((a, s) => a + s.value, 0);
    const tTotal = targets.reduce((a, t) => a + t.value, 0);
    const sScale = (H - gap * (sources.length - 1)) / sTotal;
    const tScale = (H - gap * (targets.length - 1)) / tTotal;

    // node rects
    let sy = 0; const sNodes = sources.map((s) => { const h = s.value * sScale; const r = { ...s, y: sy, h }; sy += h + gap; return r; });
    let ty = 0; const tNodes = targets.map((t) => { const h = t.value * tScale; const r = { ...t, y: ty, h }; ty += h + gap; return r; });

    // ribbons: stack within each source (by target order) and each target (by source order)
    const sOff = sNodes.map((n) => n.y);
    const tOff = tNodes.map((n) => n.y);
    const ribbons = [];
    flows.slice().sort((a, b) => (a[0] - b[0]) || (a[1] - b[1])).forEach((f) => {
      const si = f[0], tiNew = tIndex[f[1]], val = f[2];
      const sh = val * sScale, th = val * tScale;
      const y0 = sOff[si]; sOff[si] += sh;
      const y1 = tOff[tiNew]; tOff[tiNew] += th;
      ribbons.push({ si, val,
        y0t: y0, y0b: y0 + sh,
        y1t: y1, y1b: y1 + th,
        color: sNodes[si].color });
    });
    return { sNodes, tNodes, ribbons, sTotal };
  }, [p.sources, p.targets, p.flows, p.sourceCount]);

  const hi = p.highlight ? p.highlightIndex : -1;
  const litAny = hi >= 0 && hi < geo.sNodes.length;
  const accent = p.accentColor;

  const ribbonPath = (r) => {
    const x0 = srcX + nodeW, x1 = tgtX, xc = (x0 + x1) / 2;
    return `M ${x0} ${r.y0t} C ${xc} ${r.y0t} ${xc} ${r.y1t} ${x1} ${r.y1t}`
      + ` L ${x1} ${r.y1b} C ${xc} ${r.y1b} ${xc} ${r.y0b} ${x0} ${r.y0b} Z`;
  };

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={`# ${p.kicker}`} tone="violet" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, position: 'relative' }}>
        {/* column captions */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Space Mono', monospace", fontSize: 23, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--aip-ink-3)' }}>
          <span>资本来源 · SOURCES</span>
          <span>赛道流向 · DESTINATIONS</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
          style={{ position: 'absolute', inset: '44px 0 0', width: '100%', height: 'calc(100% - 44px)', overflow: 'visible' }}>
          {/* ribbons under nodes */}
          {geo.ribbons.map((r, i) => {
            const lit = litAny && r.si === hi;
            const dim = litAny && !lit;
            const col = lit ? accent : r.color;
            return (
              <path key={i} d={ribbonPath(r)} fill={col}
                opacity={dim ? 0.12 : (lit ? 0.62 : 0.40)}
                style={{ filter: lit ? `drop-shadow(0 8px 22px ${hexA(accent, 0.45)})` : 'none' }} />
            );
          })}
          {/* source nodes */}
          {geo.sNodes.map((n, i) => {
            const lit = litAny && i === hi; const dim = litAny && !lit;
            return <NodeBar key={'s' + i} x={srcX} y={n.y} h={n.h} w={nodeW} color={lit ? accent : n.color} lit={lit} dim={dim} />;
          })}
          {/* target nodes */}
          {geo.tNodes.map((n, i) => (
            <NodeBar key={'t' + i} x={tgtX - nodeW} y={n.y} h={n.h} w={nodeW} color={n.color} lit={false} dim={litAny} />
          ))}
        </svg>

        {/* HTML labels overlaid (crisp text, no SVG scaling blur) */}
        <Labels geo={geo} srcX={srcX} tgtX={tgtX} nodeW={nodeW} W={W} H={H} unit={p.unit}
          showValues={p.showValues} hi={hi} litAny={litAny} accent={accent} />
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}

// Absolutely-positioned text labels mapped from svg coords to the box's % space.
function Labels({ geo, srcX, tgtX, nodeW, W, H, unit, showValues, hi, litAny, accent }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 44, bottom: 0 }}>
      {geo.sNodes.map((n, i) => {
        const lit = litAny && i === hi; const dim = litAny && !lit;
        const cy = (n.y + n.h / 2) / H * 100;
        return (
          <div key={'sl' + i} style={{ position: 'absolute', right: `${(1 - srcX / W) * 100}%`, top: `${cy}%`,
            transform: 'translateY(-50%)', paddingRight: 18, textAlign: 'right', maxWidth: 240, opacity: dim ? 0.4 : 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: lit ? accent : 'var(--aip-ink)', lineHeight: 1.05, whiteSpace: 'nowrap' }}>{n.name}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 17, letterSpacing: '.1em', color: hexA(lit ? accent : n.color, lit ? 0.9 : 0.85), marginTop: 3 }}>{n.en}</div>
            {showValues && <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--aip-ink-2)', marginTop: 2 }}>{n.value}<small style={{ fontSize: 15, fontWeight: 700, color: 'var(--aip-ink-3)' }}> {unit}</small></div>}
          </div>
        );
      })}
      {geo.tNodes.map((n, i) => {
        const cy = (n.y + n.h / 2) / H * 100;
        return (
          <div key={'tl' + i} style={{ position: 'absolute', left: `${(tgtX / W) * 100}%`, top: `${cy}%`,
            transform: 'translateY(-50%)', paddingLeft: 18, maxWidth: 280, opacity: litAny ? 0.92 : 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.05, whiteSpace: 'nowrap' }}>{n.name}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 17, letterSpacing: '.1em', color: hexA(n.color, 0.9), marginTop: 3 }}>{n.en}</div>
            {showValues && <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--aip-ink-2)', marginTop: 2 }}>{n.value}<small style={{ fontSize: 15, fontWeight: 700, color: 'var(--aip-ink-3)' }}> {unit}</small></div>}
          </div>
        );
      })}
    </div>
  );
}
