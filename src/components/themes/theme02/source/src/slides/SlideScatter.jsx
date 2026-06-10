/**
 * SlideScatter.jsx — 估值气泡散点（图表页 · 气泡散点）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 二维散点 + 气泡：X = 年化营收 ARR，Y = 估值，气泡大小 = 最近一轮融资额。直观呈现
 * “估值与营收脱钩”的结构。图表内联 SVG，仅依赖 props（含可选 gxnScheme 调色）。
 *
 * ── Props (see slideScatterDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   points       Array<{label,x,y,r,note}>   x=ARR, y=估值, r=融资额（同一单位）
 *   xLabel, yLabel, sizeLabel        坐标轴/气泡说明文字
 *   xMax, yMax   number   坐标轴上限
 *   pointCount   number   展示的公司数量（3–n）
 *   focusEnabled boolean  辉光强调某一气泡（其余淡出）
 *   focusIndex   number   0-based 被强调气泡
 *   showGrid     boolean  网格 + 刻度显隐
 *   showLabels   boolean  气泡公司名显隐
 *   showAxisTitles boolean  坐标轴标题显隐
 *   gxnScheme    object?  { palette } 调色
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideScatterDefaults = {
  kicker: 'VALUATION · 估值地形',
  title: '估值与营收 ',
  titleEm: '正在脱钩',
  lead: '横轴为年化营收，纵轴为资本估值，气泡越大代表最近一轮融资额越高。',
  points: [
    { label: 'OpenAI', x: 3.7, y: 157, r: 6.6, note: '产品化领跑' },
    { label: 'Databricks', x: 2.4, y: 62, r: 10, note: '数据平台' },
    { label: 'xAI', x: 0.1, y: 50, r: 6, note: '算力豪赌' },
    { label: 'Anthropic', x: 0.9, y: 40, r: 4, note: '安全叙事' },
    { label: 'CoreWeave', x: 2.0, y: 23, r: 1.1, note: '算力云' },
    { label: 'Scale AI', x: 0.7, y: 14, r: 1.0, note: '数据标注' },
    { label: 'Perplexity', x: 0.05, y: 9, r: 0.5, note: 'AI 搜索' },
    { label: 'Mistral', x: 0.03, y: 6, r: 0.6, note: '开源模型' },
  ],
  xLabel: '年化营收 ARR（十亿美元）',
  yLabel: '估值（十亿美元）',
  sizeLabel: '气泡大小 = 最近一轮融资额',
  xMax: 4,
  yMax: 170,
  pointCount: 6,
  focusEnabled: true,
  focusIndex: 0,
  showGrid: true,
  showLabels: true,
  showAxisTitles: true,
};

export const slideScatterControls = [
  { key: 'pointCount', type: 'number', label: '公司数量', default: 6, min: 3, step: 1,
    maxFrom: (p) => (p.points ? p.points.length : 8), describe: '散点上展示的公司数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一气泡（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.pointCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调气泡的序号' },
  { key: 'showGrid', type: 'toggle', label: '网格刻度', default: true,
    describe: '坐标网格与刻度显隐' },
  { key: 'showLabels', type: 'toggle', label: '气泡名称', default: true,
    describe: '气泡上的公司名显隐' },
  { key: 'showAxisTitles', type: 'toggle', label: '坐标轴标题', default: true,
    describe: 'X/Y 轴标题显隐' },
];

function Scatter({ points, xMax, yMax, fIdx, showGrid, showLabels, showAxisTitles, xLabel, yLabel, palette }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1280, H = 600;
  const padL = 96, padR = 48, padT = 40, padB = 92;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xs = (v) => padL + (v / xMax) * plotW;
  const ys = (v) => padT + plotH * (1 - v / yMax);
  const maxR = Math.max(...points.map((p) => p.r), 1);
  const rs = (v) => 22 + Math.sqrt(v / maxR) * 54;
  const focused = fIdx >= 0;
  const xticks = 4, yticks = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showGrid && (
        <g>
          {Array.from({ length: yticks + 1 }).map((_, i) => {
            const v = (yMax / yticks) * i; const y = ys(v);
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                <text x={padL - 16} y={y} textAnchor="end" dominantBaseline="middle"
                      fontFamily="'Space Mono',monospace" fontSize="24" fill="rgba(238,243,241,0.5)">{Math.round(v)}</text>
              </g>
            );
          })}
          {Array.from({ length: xticks + 1 }).map((_, i) => {
            const v = (xMax / xticks) * i; const x = xs(v);
            return (
              <text key={i} x={x} y={H - padB + 36} textAnchor="middle"
                    fontFamily="'Space Mono',monospace" fontSize="24" fill="rgba(238,243,241,0.5)">{v}</text>
            );
          })}
        </g>
      )}
      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

      {points.map((p, i) => {
        const c = palette[i % palette.length];
        const isF = i === fIdx; const dim = focused && !isF;
        const cxp = xs(Math.min(p.x, xMax)), cyp = ys(Math.min(p.y, yMax)), r = rs(p.r);
        return (
          <g key={i} opacity={dim ? 0.3 : 1}>
            <circle cx={cxp} cy={cyp} r={r} fill={c} fillOpacity={isF ? 0.28 : 0.16}
                    stroke={c} strokeWidth={isF ? 3.5 : 2.5}
                    filter={isF ? `url(#${uid}-g)` : undefined} />
            <circle cx={cxp} cy={cyp} r="5" fill={c} />
            {showLabels && (
              <text x={cxp} y={cyp - r - 14} textAnchor="middle"
                    fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 600}
                    fontSize="26" fill={isF ? c : '#eef3f1'}>{p.label}</text>
            )}
          </g>
        );
      })}

      {showAxisTitles && (
        <g>
          <text x={padL + plotW / 2} y={H - 12} textAnchor="middle"
                fontFamily="'Noto Sans SC',sans-serif" fontSize="25" fill="rgba(238,243,241,0.62)">{xLabel}</text>
          <text x={26} y={padT + plotH / 2} textAnchor="middle"
                fontFamily="'Noto Sans SC',sans-serif" fontSize="25" fill="rgba(238,243,241,0.62)"
                transform={`rotate(-90 26 ${padT + plotH / 2})`}>{yLabel}</text>
        </g>
      )}
    </svg>
  );
}

export function SlideScatter(props) {
  const p = { ...slideScatterDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#4ea2ff', '#9b7dff', '#ff6fae', '#b9f24a', '#2fe0c4', '#ffc24a'];

  const count = Math.max(3, Math.min(p.points.length, p.pointCount));
  const points = p.points.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const fp = fIdx >= 0 ? points[fIdx] : null;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "25 / 31"} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 14, whiteSpace: 'nowrap' }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 30, minHeight: 0, position: 'relative' }}>
          <Scatter points={points} xMax={p.xMax} yMax={p.yMax} fIdx={fIdx}
                   showGrid={p.showGrid} showLabels={p.showLabels} showAxisTitles={p.showAxisTitles}
                   xLabel={p.xLabel} yLabel={p.yLabel} palette={palette} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, marginTop: 6 }}>
          <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>{p.sizeLabel}</span>
          {fp && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fp.label}</strong>
              {' '}· 估值 {fp.y} / ARR {fp.x} 十亿美元 · 约 <strong style={{ color: 'var(--gxn-text)' }}>{Math.round(fp.y / fp.x)}×</strong> 营收倍数
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideScatter;
