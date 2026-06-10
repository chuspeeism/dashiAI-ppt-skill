/*
 * Slide19MonthChart — 月度趋势图表页（逐月融资额 · 面积 / 折线 / 柱状）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsMc- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  chartVariant     enum   图表类型        默认 'area'  可选 'area'|'line'|'bar'
 *  focusEnabled     bool   重点月份高亮      默认 true
 *  focusIndex       number 重点月份(从1起)   默认 8
 *  showPeakMarkers  bool   峰值标记显隐      默认 true
 *  showAvgLine      bool   月均线显隐        默认 true
 *  showDecorations  bool   装饰元素显隐      默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide19MonthChart, { defaults, controls } from './Slide19MonthChart.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSMC_ACCENT = '#27E021';
const XHSMC_DATA = [
  { label: '1月', value: 45 }, { label: '2月', value: 58 }, { label: '3月', value: 59 },
  { label: '4月', value: 86 }, { label: '5月', value: 105 }, { label: '6月', value: 93 },
  { label: '7月', value: 92 }, { label: '8月', value: 118 }, { label: '9月', value: 108 },
  { label: '10月', value: 73 }, { label: '11月', value: 81 }, { label: '12月', value: 52 },
];
const XHSMC_PEAKS = [4, 7]; // 0基：5月、8月
const XHSMC_AVG = 81;       // 月均 ≈ 970/12

function McSpark({ size = 20, color = '#fff', style }) {
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

function McPlot({ variant, focusEnabled, focusIndex, showPeaks, showAvg, data = XHSMC_DATA, avg = XHSMC_AVG, avgLabel = '月均 ≈' }) {
  const n = data.length;
  const ref = React.useRef(null);
  const [pw, setPw] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setPw(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 430;
  const PAD_T = 56, PAD_B = 8;
  const max = Math.max(130, ...data.map((d) => Number(d.value) || 0));
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  // 峰值标记：取数据中最大的两个点（随 data 自动更新）
  const peaks = data
    .map((d, i) => [Number(d.value) || 0, i])
    .sort((a, b) => b[0] - a[0])
    .slice(0, 2)
    .map((p) => p[1]);
  const cx = (i) => (i + 0.5) * (pw / n);
  const y = (v) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B);
  const gid = React.useId().replace(/:/g, '');

  const linePts = data.map((d, i) => `${cx(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const areaPath = pw > 0
    ? `M ${cx(0).toFixed(1)} ${(H - PAD_B).toFixed(1)} L ` +
      data.map((d, i) => `${cx(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(' L ') +
      ` L ${cx(n - 1).toFixed(1)} ${(H - PAD_B).toFixed(1)} Z`
    : '';

  return (
    <div className="xhsMc-plot" ref={ref} style={{ height: H + 'px' }}>
      {pw > 0 && (
        <svg className="xhsMc-svg" width={pw} height={H} viewBox={`0 0 ${pw} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id={'g' + gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={XHSMC_ACCENT} stopOpacity="0.55" />
              <stop offset="100%" stopColor={XHSMC_ACCENT} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* 月均虚线 */}
          {showAvg && (
            <g>
              <line x1="0" y1={y(avg)} x2={pw} y2={y(avg)}
                stroke="rgba(255,255,255,.32)" strokeWidth="2" strokeDasharray="8 8" />
              <text x={pw - 6} y={y(avg) - 12} textAnchor="end"
                fill="rgba(255,255,255,.6)" fontSize="20" fontFamily="'Space Mono', monospace">{avgLabel} {avg}</text>
            </g>
          )}

          {/* 柱状 */}
          {variant === 'bar' && data.map((d, i) => {
            const hot = focusEnabled && i === focus;
            const bw = Math.min(48, (pw / n) * 0.5);
            return (
              <rect key={i} x={cx(i) - bw / 2} y={y(d.value)} width={bw} height={(H - PAD_B) - y(d.value)}
                rx="10" fill={XHSMC_ACCENT}
                opacity={focusEnabled && !hot ? 0.45 : 1} />
            );
          })}

          {/* 面积填充 */}
          {variant === 'area' && <path d={areaPath} fill={`url(#g${gid})`} />}

          {/* 折线（area/line 都画线） */}
          {variant !== 'bar' && (
            <polyline points={linePts} fill="none" stroke={XHSMC_ACCENT} strokeWidth="4"
              strokeLinejoin="round" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${XHSMC_ACCENT}88)` }} />
          )}

          {/* 数据点（折线/面积） */}
          {variant !== 'bar' && data.map((d, i) => {
            const hot = focusEnabled && i === focus;
            return (
              <circle key={i} cx={cx(i)} cy={y(d.value)} r={hot ? 11 : 6}
                fill={hot ? '#fff' : XHSMC_ACCENT} stroke={hot ? XHSMC_ACCENT : '#0a0a0a'} strokeWidth={hot ? 5 : 3}
                style={hot ? { filter: `drop-shadow(0 0 14px ${XHSMC_ACCENT})` } : undefined} />
            );
          })}

          {/* 峰值标记 */}
          {showPeaks && peaks.map((pi) => (
            <g key={pi}>
              <line x1={cx(pi)} y1={y(data[pi].value) - 16} x2={cx(pi)} y2={y(data[pi].value) - 40}
                stroke="#FFC700" strokeWidth="2.5" />
              <rect x={cx(pi) - 40} y={y(data[pi].value) - 78} width="80" height="38" rx="10"
                fill="#FFC700" />
              <text x={cx(pi)} y={y(data[pi].value) - 52} textAnchor="middle"
                fill="#000" fontSize="24" fontWeight="900" fontFamily="'Space Mono', monospace">{data[pi].value}</text>
            </g>
          ))}

          {/* 焦点数值标签 */}
          {focusEnabled && variant !== 'bar' && !peaks.includes(focus) && (
            <text x={cx(focus)} y={y(data[focus].value) - 22} textAnchor="middle"
              fill="#fff" fontSize="26" fontWeight="900" fontFamily="'Space Mono', monospace">{data[focus].value}</text>
          )}
        </svg>
      )}

      <div className="xhsMc-axis">
        {data.map((d, i) => (
          <span key={i} className={'xhsMc-tick' + (focusEnabled && i === focus ? ' is-hot' : '')}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function Slide19MonthChart(props) {
  const {
    chartVariant = 'area',
    focusEnabled = true,
    focusIndex = 8,
    showPeakMarkers = true,
    showAvgLine = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '逐月节奏 · MONTHLY TREND',
    titleLead = '全年',
    titleKeyword = '双峰',
    titleTail = '：5 月、8 月集中关账',
    sub = '细化到月度，多家头部公司集中关账推高 5 月（105）与 8 月（118）两次峰值，单位：亿美元。',
    avgLabel = '月均 ≈',
    // 数据
    data = XHSMC_DATA,
    avgValue = XHSMC_AVG,
  } = props;

  const plotData = Array.isArray(data) && data.length ? data : XHSMC_DATA;

  return (
    <section className="xhs-base xhsMc-root" data-label="月度趋势" style={{ '--c': XHSMC_ACCENT }}>
      <style>{XHSMC_CSS}</style>

      <header className="xhsMc-head">
        <div className="xhsMc-kicker">{kicker}</div>
        <h2 className="xhsMc-title">
          {titleLead}<HL color={XHSMC_ACCENT} variant={hlStyle} tilt={hlTilt}>{titleKeyword}</HL>{titleTail}
        </h2>
        <p className="xhsMc-sub">{sub}</p>
      </header>

      <McPlot
        variant={chartVariant}
        focusEnabled={focusEnabled}
        focusIndex={focusIndex}
        showPeaks={showPeakMarkers}
        showAvg={showAvgLine}
        data={plotData}
        avg={Number(avgValue) || XHSMC_AVG}
        avgLabel={avgLabel}
      />

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 116, top: 220, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <McSpark size={22} color="#15A7F0" style={{ position: 'absolute', right: 116, top: 138 }} />
          <McSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 72 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSMC_CSS = `
  .xhsMc-root{ padding:84px 110px 70px; position:relative; display:flex; flex-direction:column; }
  .xhsMc-head{ margin-bottom:30px; }
  .xhsMc-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:18px; }
  .xhsMc-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsMc-sub{ margin:20px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1180px; }

  .xhsMc-plot{ position:relative; flex:1; display:flex; flex-direction:column; justify-content:flex-end;
    margin-top:10px; background:linear-gradient(180deg,#141414,#0c0c0c); border:1px solid rgba(255,255,255,.07);
    border-radius:24px; padding:18px 40px 0; box-shadow:0 24px 60px rgba(0,0,0,.5); }
  .xhsMc-svg{ position:absolute; left:40px; right:40px; top:18px; width:calc(100% - 80px); overflow:visible; }
  .xhsMc-axis{ display:flex; justify-content:space-around; padding:14px 0 18px; margin-top:auto; }
  .xhsMc-tick{ flex:1; text-align:center; font-size:22px; font-weight:700; color:#9a9a9a;
    font-family:"Space Mono",monospace; }
  .xhsMc-tick.is-hot{ color:#fff; }
`;

const META = {
  id: 'monthchart',
  label: '月度趋势',
  Component: Slide19MonthChart,
  defaults: {
    ...hlDefaults,
    chartVariant: 'area',
    focusEnabled: true,
    focusIndex: 8,
    showPeakMarkers: true,
    showAvgLine: true,
    showDecorations: true,
    kicker: '逐月节奏 · MONTHLY TREND',
    titleLead: '全年',
    titleKeyword: '双峰',
    titleTail: '：5 月、8 月集中关账',
    sub: '细化到月度，多家头部公司集中关账推高 5 月（105）与 8 月（118）两次峰值，单位：亿美元。',
    avgLabel: '月均 ≈',
    data: XHSMC_DATA,
    avgValue: XHSMC_AVG,
  },
  controls: [
    ...hlControls,
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['area', 'line', 'bar'], optionLabels: ['面积', '折线', '柱状'], default: 'area', desc: '面积 / 折线 / 柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点月份', default: true, desc: '是否高亮某个月份' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 12, step: 1, default: 8, showIf: (v) => v.focusEnabled, desc: '被高亮月份(1=1月)' },
    { key: 'showPeakMarkers', type: 'toggle', label: '峰值标记', default: true, desc: '5月/8月峰值标注' },
    { key: 'showAvgLine', type: 'toggle', label: '月均线', default: true, desc: '月均参考虚线' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '逐月节奏 · MONTHLY TREND', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '全年', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '双峰', desc: '高亮关键词' },
    { key: 'titleTail', type: 'text', label: '标题后半', default: '：5 月、8 月集中关账', desc: '关键词后文' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 2, default: '细化到月度，多家头部公司集中关账推高 5 月（105）与 8 月（118）两次峰值，单位：亿美元。', desc: '标题下方说明' },
    { key: 'avgLabel', type: 'text', label: '均线标签', default: '月均 ≈', desc: '月均线文字前缀', showIf: (v) => v.showAvgLine },
    { type: 'section', label: '数据 · 逐月' },
    { key: 'avgValue', type: 'text', label: '月均值', default: String(XHSMC_AVG), desc: '月均参考线数值', showIf: (v) => v.showAvgLine },
    {
      key: 'data', type: 'list', label: '月度数据', itemLabel: '月',
      fields: [{ key: 'label', label: '月份' }, { key: 'value', label: '数值' }],
      default: XHSMC_DATA, desc: '12 个月的数值（峰值标记自动取最大两点）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide19MonthChart.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide19MonthChart;
