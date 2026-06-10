/*
 * Slide30Radar — 头部玩家多维能力雷达（图表页 · 雷达 / 分组柱状可切换）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsRd- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number 对比的玩家数量        默认 3   可选 2–3
 *  chartVariant    enum   图表类型            默认 'radar' 可选 'radar'|'bars'
 *  focusEnabled    bool   重点玩家高亮开关       默认 true
 *  focusIndex      number 重点玩家序号(从1起)    默认 2
 *  showGrid        bool   雷达网格 / 刻度环显隐   默认 true（radar 生效）
 *  showLegend      bool   图例 / 维度图例显隐     默认 true
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。数值为调研示意评分（0–100）。
 * 迁移：import Slide30Radar, { defaults, controls } from './Slide30Radar.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 六大能力维度（呼应「六大维度」框架）
const XHSRD_DIMS = ['模型能力', '资本储备', '商业兑现', '算力规模', '人才密度', '安全治理'];
// 头部三强多维能力评分（报告 Top3 · 调研示意 0–100）
const XHSRD_PLAYERS = [
  { name: 'OpenAI', en: 'GPT', color: '#15A7F0', vals: [95, 92, 86, 90, 88, 70] },
  { name: 'Anthropic', en: 'Claude', color: '#27E021', vals: [90, 84, 72, 78, 85, 96] },
  { name: 'xAI', en: 'Grok', color: '#FFC700', vals: [82, 80, 54, 96, 70, 58] },
];

function RdSpark({ size = 20, color = '#fff', style }) {
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

const RD_CX = 300, RD_CY = 305, RD_R = 198;
const rdAngle = (i) => (-90 + i * 60) * Math.PI / 180;
const rdPoint = (i, frac) => [
  RD_CX + Math.cos(rdAngle(i)) * RD_R * frac,
  RD_CY + Math.sin(rdAngle(i)) * RD_R * frac,
];
const rdPolygon = (vals) => vals.map((v, i) => rdPoint(i, v / 100).join(',')).join(' ');

function RadarChart({ players, focus, focusEnabled, showGrid }) {
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <svg className="xhsRd-svg" viewBox="-44 0 688 610" aria-hidden="true">
      {showGrid && (
        <g>
          {rings.map((r, ri) => (
            <polygon key={ri}
              points={XHSRD_DIMS.map((_, i) => rdPoint(i, r).join(',')).join(' ')}
              fill={ri === rings.length - 1 ? 'rgba(255,255,255,.015)' : 'none'}
              stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
          ))}
          {XHSRD_DIMS.map((_, i) => {
            const [x, y] = rdPoint(i, 1);
            return <line key={i} x1={RD_CX} y1={RD_CY} x2={x} y2={y} stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />;
          })}
        </g>
      )}

      {players.map((p, pi) => {
        const dim = focusEnabled && pi !== focus;
        const hot = focusEnabled && pi === focus;
        return (
          <g key={pi} style={{ opacity: dim ? 0.32 : 1, transition: 'opacity .35s ease' }}>
            <polygon points={rdPolygon(p.vals)}
              fill={p.color} fillOpacity={hot ? 0.26 : dim ? 0.05 : 0.16}
              stroke={p.color} strokeWidth={hot ? 4 : 3}
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 ${hot ? 18 : 10}px ${p.color}${hot ? 'cc' : '88'})` }} />
            {p.vals.map((v, i) => {
              const [x, y] = rdPoint(i, v / 100);
              return <circle key={i} cx={x} cy={y} r={hot ? 7 : 5} fill="#000" stroke={p.color} strokeWidth={hot ? 4 : 3} />;
            })}
          </g>
        );
      })}

      {/* 维度标签 */}
      {XHSRD_DIMS.map((d, i) => {
        const [x, y] = rdPoint(i, 1.15);
        const a = ((-90 + i * 60) % 360 + 360) % 360;
        const anchor = (a === 90 || a === 270) ? 'middle' : (a < 90 || a > 270) ? 'start' : 'end';
        return (
          <text key={i} x={x} y={y + 9} textAnchor={anchor}
            fontFamily='"Noto Sans SC",sans-serif' fontSize="25" fontWeight="900" fill="#cfcfcf">{d}</text>
        );
      })}
    </svg>
  );
}

function BarsChart({ players, focus, focusEnabled }) {
  return (
    <div className="xhsRd-bars">
      {XHSRD_DIMS.map((d, di) => {
        const top = Math.max.apply(null, players.map((p) => p.vals[di]));
        return (
          <div key={di} className="xhsRd-barRow">
            <span className="xhsRd-barDim">{d}</span>
            <div className="xhsRd-barGroup">
              {players.map((p, pi) => {
                const dim = focusEnabled && pi !== focus;
                const lead = p.vals[di] === top;
                return (
                  <div key={pi} className={'xhsRd-barLine' + (dim ? ' is-dim' : '')} style={{ '--c': p.color }}>
                    <span className="xhsRd-barTrack">
                      <span className="xhsRd-barFill" style={{ width: p.vals[di] + '%' }} />
                    </span>
                    <span className={'xhsRd-barNum' + (lead ? ' is-lead' : '')}>{p.vals[di]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}


const SLIDE30RADAR_COPY = {
  text001: "头部玩家 · CAPABILITY RADAR",
  text002: "三强各有所长，没有",
  text003: "全能选手",
  text004: "同样是通用大模型，OpenAI 全面、Anthropic 押注安全治理、xAI 死磕算力——六大维度看清差异。",
  text005: "综合分",
  text006: "评分为调研示意（0–100）· 维度权重等权 · 数据为调研整理推演",
};
function Slide30Radar(props) {
  const {
      copy = SLIDE30RADAR_COPY,
      playersData = XHSRD_PLAYERS,
    itemCount = 3,
    chartVariant = 'radar',
    focusEnabled = true,
    focusIndex = 2,
    showGrid = true,
    showLegend = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(2, Math.min(3, itemCount));
  const players = playersData.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const isBars = chartVariant === 'bars';
  const hotColor = (players[focus] && players[focus].color) || '#27E021';

  return (
    <section className="xhs-base xhsRd-root" data-label="多维雷达" data-screen-label="多维雷达"
      style={{ '--c': hotColor }}>
      <style>{XHSRD_CSS}</style>

      <header className="xhsRd-head">
        <div className="xhsRd-kicker">{copy.text001}</div>
        <h2 className="xhsRd-title">{copy.text002}<HL color={hotColor} variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>
        </h2>
        <p className="xhsRd-sub">{copy.text004}</p>
      </header>

      <div className={'xhsRd-stage' + (isBars ? ' is-bars' : ' is-radar')}>
        <div className="xhsRd-chart">
          {isBars
            ? <BarsChart players={players} focus={focus} focusEnabled={focusEnabled} />
            : <RadarChart players={players} focus={focus} focusEnabled={focusEnabled} showGrid={showGrid} />}
        </div>

        {showLegend && (
          <ul className="xhsRd-legend">
            {players.map((p, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              const avg = Math.round(p.vals.reduce((a, b) => a + b, 0) / p.vals.length);
              return (
                <li key={i} className={'xhsRd-leg' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                  style={{ '--c': p.color }}>
                  <span className="xhsRd-legTop">
                    <span className="xhsRd-legDot" />
                    <span className="xhsRd-legName">{p.name}</span>
                    <span className="xhsRd-legEn">{p.en}</span>
                  </span>
                  <span className="xhsRd-legScore">
                    <span className="xhsRd-legNum">{avg}</span>
                    <span className="xhsRd-legUnit">{copy.text005}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="xhsRd-caption">{copy.text006}</div>

      {showDecorations && (
        <React.Fragment>
          <RdSpark size={26} color="#FF9FE2" style={{ position: 'absolute', right: 110, top: 180 }} />
          <RdSpark size={18} color="#27E021" style={{ position: 'absolute', left: 92, bottom: 130 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 150, bottom: 150, width: 40, height: 40, borderRadius: '50%', border: '5px solid rgba(255,255,255,.8)', boxShadow: '0 0 20px rgba(255,255,255,.2)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSRD_CSS = `
  .xhsRd-root{ padding:78px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsRd-head{ flex:0 0 auto; margin-bottom:18px; }
  .xhsRd-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsRd-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsRd-sub{ margin:18px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1360px; }

  .xhsRd-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; gap:70px; }
  .xhsRd-stage.is-radar{ justify-content:center; }
  .xhsRd-chart{ flex:1 1 auto; min-width:0; height:100%; display:flex; align-items:center; justify-content:center; }

  /* ── 雷达 ── */
  .xhsRd-stage.is-radar .xhsRd-chart{ flex:0 0 auto; }
  .xhsRd-svg{ height:100%; max-height:600px; width:auto; aspect-ratio:688/610; overflow:visible; }

  /* ── 图例 ── */
  .xhsRd-legend{ list-style:none; margin:0; padding:0; width:430px; flex:0 0 auto; display:flex; flex-direction:column; gap:18px; }
  .xhsRd-stage.is-bars .xhsRd-legend{ width:360px; }
  .xhsRd-leg{ display:flex; align-items:center; justify-content:space-between; gap:18px;
    padding:24px 28px; border-radius:20px; background:linear-gradient(160deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.08);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsRd-leg.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsRd-leg.is-hot{ transform:translateX(8px); border-color:var(--c);
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 16%, #151515), #0d0d0d);
    box-shadow:0 0 50px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsRd-legTop{ display:flex; align-items:baseline; gap:12px; min-width:0; }
  .xhsRd-legDot{ width:20px; height:20px; border-radius:7px; background:var(--c); flex:0 0 auto; align-self:center;
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsRd-legName{ font-size:34px; font-weight:900; color:#fff; }
  .xhsRd-legEn{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.06em; color:#6f6f6f; }
  .xhsRd-legScore{ display:flex; flex-direction:column; align-items:flex-end; flex:0 0 auto; }
  .xhsRd-legNum{ font-family:"Space Mono",monospace; font-size:50px; font-weight:700; color:var(--c); line-height:.9;
    text-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsRd-legUnit{ font-size:17px; font-weight:600; color:#8a8a8a; margin-top:5px; }

  /* ── 分组柱状 ── */
  .xhsRd-bars{ width:100%; display:flex; flex-direction:column; gap:20px; }
  .xhsRd-barRow{ display:grid; grid-template-columns:170px 1fr; align-items:center; column-gap:28px; }
  .xhsRd-barDim{ font-size:28px; font-weight:900; color:#fff; text-align:right; }
  .xhsRd-barGroup{ display:flex; flex-direction:column; gap:7px; }
  .xhsRd-barLine{ display:flex; align-items:center; gap:16px; transition:opacity .3s ease, filter .3s ease; }
  .xhsRd-barLine.is-dim{ opacity:.4; filter:saturate(.7); }
  .xhsRd-barTrack{ flex:1; height:20px; border-radius:7px; background:rgba(255,255,255,.05); overflow:hidden; }
  .xhsRd-barFill{ display:block; height:100%; border-radius:7px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 60%, #000), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.4); }
  .xhsRd-barNum{ font-family:"Space Mono",monospace; font-size:24px; font-weight:700; color:#9a9a9a; width:48px; text-align:right; }
  .xhsRd-barNum.is-lead{ color:var(--c); text-shadow:0 0 14px color-mix(in srgb, var(--c) 45%, transparent); }

  .xhsRd-caption{ flex:0 0 auto; margin-top:14px; font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'radar',
  label: '多维雷达',
  Component: Slide30Radar,
  defaults: {
      copy: SLIDE30RADAR_COPY,
      playersData: XHSRD_PLAYERS,
    ...hlDefaults,
    itemCount: 3,
    chartVariant: 'radar',
    focusEnabled: true,
    focusIndex: 2,
    showGrid: true,
    showLegend: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }], default: SLIDE30RADAR_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'playersData', type: 'list', label: 'playersData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "en", label: "en" }, { key: "color", label: "color" }], default: XHSRD_PLAYERS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '玩家数量', min: 2, max: 3, step: 1, default: 3, desc: '对比的玩家数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['radar', 'bars'], optionLabels: ['雷达', '分组柱'], default: 'radar', desc: '雷达图 / 分组柱状图' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一玩家' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 2, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮玩家的序号' },
    { key: 'showGrid', type: 'toggle', label: '雷达网格', default: true, showIf: (v) => v.chartVariant === 'radar', desc: '雷达网格 / 刻度环(雷达生效)' },
    { key: 'showLegend', type: 'toggle', label: '图例列表', default: true, desc: '右侧玩家图例 + 综合分' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide30Radar.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide30Radar;
