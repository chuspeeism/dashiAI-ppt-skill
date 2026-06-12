// ============================================================================
// SlideMeter.jsx — P73 从试点到稳定收入 · 指标计量板 / Metric Meter Board
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "N percentage readings + a thesis" page, built around the dashboard
// reference's bold progress-meter language (lime fill + hatched remainder track
// + end knob). Each meter encodes one rate; one meter can be pulled out as a
// lime focus card. chartType switches the SAME data between horizontal meters,
// vertical columns, and a dot scale. In the demo deck it renders P73 收入验证风险.
// Reusable for any "几条比率/评分 + 一句判断" page.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   tagLabel                         left badge chip (decorative)
//   kicker                           the thesis / framing sentence (display type)
//   verdict ({label,note})           verdict block (decorative)
//   meters ({name,en,value,unit,note}[])  each reading; value is a 0..max number
//   maxValue                         denominator for the fill (default 100)
//   footRight                        mono caption at the foot-right (decorative)
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)   'meters' | 'columns' | 'dots'  same data, different form
//   meterCount (int 2..4)      readings shown
//   showTrack (bool)           hatched remainder track (decorative)
//   showValueLabels (bool)     big value numbers (decorative data)
//   showNote (bool)            per-meter qualifier line (decorative)
//   showThesis (bool)          left thesis + verdict column (decorative framing)
//   focusEnabled (bool)        emphasise one meter
//   focusIndex (int)           which meter
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-mtr-css')) {
  const css = `
  .kx-mtr-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-mtr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:22px;border-bottom:1px solid var(--kx-line);}
  .kx-mtr-title{font-size:64px;}
  .kx-mtr-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-mtr-tag{font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    color:var(--kx-mute-2);text-align:right;white-space:nowrap;}
  .kx-mtr-tag b{color:var(--kx-accent);}

  .kx-mtr-main{flex:1;min-height:0;display:grid;column-gap:56px;padding:30px 0 6px;}
  /* left thesis column */
  .kx-mtr-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:52px;}
  .kx-mtr-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;border-radius:999px;}
  .kx-mtr-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-mtr-kicker{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:1.12;letter-spacing:-.01em;
    margin-top:22px;text-wrap:pretty;}
  .kx-mtr-kicker b{color:var(--kx-accent);}
  .kx-mtr-verdict{margin-top:auto;border-radius:22px;border:1px solid var(--kx-line);background:rgba(255,255,255,.04);
    padding:24px 26px;display:flex;flex-direction:column;gap:10px;}
  .kx-mtr-vk{font-family:var(--kx-mono);font-size:21px;letter-spacing:.05em;text-transform:uppercase;color:var(--kx-mute-2);
    display:flex;align-items:center;gap:10px;}
  .kx-mtr-vk::before{content:'';width:10px;height:10px;border-radius:50%;background:var(--kx-accent);}
  .kx-mtr-vn{font-family:var(--kx-disp);font-weight:800;font-size:30px;line-height:1.22;text-wrap:pretty;}

  /* right meter column */
  .kx-mtr-right{display:flex;flex-direction:column;min-height:0;justify-content:center;gap:18px;}
  /* horizontal meters */
  .kx-mtr-row{border-radius:22px;border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:22px 28px 24px;display:flex;flex-direction:column;gap:14px;}
  .kx-mtr-row.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 16%,transparent),
    rgba(255,255,255,.02));border-color:color-mix(in srgb,var(--kx-accent) 55%,transparent);}
  .kx-mtr-rowtop{display:flex;justify-content:space-between;align-items:baseline;gap:24px;}
  .kx-mtr-name{display:flex;align-items:baseline;gap:14px;min-width:0;}
  .kx-mtr-name .kx-nn{font-family:var(--kx-disp);font-weight:800;font-size:33px;letter-spacing:-.01em;}
  .kx-mtr-name .kx-ne{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-mtr-val{font-family:var(--kx-disp);font-weight:900;font-size:62px;line-height:.8;letter-spacing:-.03em;white-space:nowrap;}
  .kx-mtr-val .kx-u{font-size:30px;font-weight:800;color:var(--kx-mute-2);margin-left:4px;}
  .kx-mtr-row.kx-on .kx-mtr-val{color:var(--kx-accent);}
  .kx-mtr-track{position:relative;height:22px;border-radius:999px;overflow:hidden;
    background:repeating-linear-gradient(45deg,rgba(255,255,255,.13) 0 2px,transparent 2px 9px),
      rgba(255,255,255,.06);}
  .kx-mtr-track.kx-notrack{background:rgba(255,255,255,.07);}
  .kx-mtr-fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--kx-accent);
    box-shadow:0 0 0 1px color-mix(in srgb,var(--kx-accent) 60%,transparent);}
  .kx-mtr-knob{position:absolute;top:50%;width:30px;height:30px;border-radius:50%;background:var(--kx-cream);
    transform:translate(-60%,-50%);border:5px solid var(--kx-accent);}
  .kx-mtr-note{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.02em;}

  /* vertical columns variant */
  .kx-mtr-cols{flex:1;display:grid;align-items:end;gap:28px;padding-top:8px;}
  .kx-mtr-col{display:flex;flex-direction:column;align-items:center;gap:14px;min-width:0;height:100%;justify-content:flex-end;}
  .kx-mtr-colbar{position:relative;width:88px;flex:1;border-radius:14px;align-self:center;
    background:repeating-linear-gradient(45deg,rgba(255,255,255,.12) 0 2px,transparent 2px 9px),rgba(255,255,255,.05);
    display:flex;align-items:flex-end;overflow:hidden;}
  .kx-mtr-colfill{width:100%;background:var(--kx-accent);border-radius:12px 12px 0 0;}
  .kx-mtr-col.kx-on .kx-mtr-colbar{outline:2px solid var(--kx-accent);outline-offset:3px;}
  .kx-mtr-colval{font-family:var(--kx-disp);font-weight:900;font-size:46px;line-height:.8;letter-spacing:-.02em;}
  .kx-mtr-col.kx-on .kx-mtr-colval{color:var(--kx-accent);}
  .kx-mtr-collbl{font-family:var(--kx-disp);font-weight:800;font-size:26px;text-align:center;line-height:1.05;}
  .kx-mtr-colen{font-family:var(--kx-mono);font-size:17px;color:var(--kx-mute-2);text-transform:uppercase;text-align:center;}

  /* dot scale variant */
  .kx-mtr-dotrow{border-radius:22px;border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:22px 28px;display:flex;align-items:center;gap:28px;}
  .kx-mtr-dotrow.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 16%,transparent),
    rgba(255,255,255,.02));border-color:color-mix(in srgb,var(--kx-accent) 55%,transparent);}
  .kx-mtr-dotlbl{min-width:300px;display:flex;flex-direction:column;gap:5px;}
  .kx-mtr-dotlbl .kx-nn{font-family:var(--kx-disp);font-weight:800;font-size:31px;letter-spacing:-.01em;}
  .kx-mtr-dotlbl .kx-ne{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);text-transform:uppercase;}
  .kx-mtr-dots{flex:1;display:flex;flex-wrap:wrap;gap:9px;}
  .kx-mtr-dots i{width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.12);}
  .kx-mtr-dots i.kx-fd{background:var(--kx-accent);}
  .kx-mtr-dotval{font-family:var(--kx-disp);font-weight:900;font-size:54px;line-height:.8;letter-spacing:-.03em;white-space:nowrap;}
  .kx-mtr-dotrow.kx-on .kx-mtr-dotval{color:var(--kx-accent);}

  /* foot */
  .kx-mtr-foot{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--kx-line);}
  .kx-mtr-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-mtr-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-mtr-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideMeter(props) {
  const p = { ...SlideMeter.defaults, ...props };
  const meters = p.meters.slice(0, clamp(p.meterCount, 2, p.meters.length));
  const fi = clamp(p.focusIndex, 0, meters.length - 1);
  const max = p.maxValue || 100;
  const pct = (v) => clamp((parseFloat(v) / max) * 100, 0, 100);
  const showThesis = p.showThesis;

  // ---- left thesis column ----------------------------------------------
  const left = h('div', { className: 'kx-mtr-left' },
    p.tagLabel ? h('div', { className: 'kx-mtr-badge' }, p.tagLabel) : null,
    h('div', { className: 'kx-mtr-kicker', dangerouslySetInnerHTML: { __html: p.kicker } }),
    p.verdict ? h('div', { className: 'kx-mtr-verdict' },
      h('div', { className: 'kx-mtr-vk' }, p.verdict.label),
      h('div', { className: 'kx-mtr-vn' }, p.verdict.note)) : null);

  // ---- right: horizontal meters ----------------------------------------
  const metersView = h('div', { className: 'kx-mtr-right' },
    meters.map((m, i) => { const on = p.focusEnabled && i === fi; const w = pct(m.value);
      return h('div', { key: i, className: 'kx-mtr-row' + (on ? ' kx-on' : '') },
        h('div', { className: 'kx-mtr-rowtop' },
          h('div', { className: 'kx-mtr-name' },
            h('span', { className: 'kx-nn' }, m.name),
            m.en ? h('span', { className: 'kx-ne' }, m.en) : null),
          p.showValueLabels ? h('div', { className: 'kx-mtr-val' }, m.value,
            m.unit ? h('span', { className: 'kx-u' }, m.unit) : null) : null),
        h('div', { className: 'kx-mtr-track' + (p.showTrack ? '' : ' kx-notrack') },
          h('div', { className: 'kx-mtr-fill', style: { width: w + '%' } }),
          h('div', { className: 'kx-mtr-knob', style: { left: w + '%' } })),
        p.showNote && m.note ? h('div', { className: 'kx-mtr-note' }, m.note) : null); }));

  // ---- right: vertical columns -----------------------------------------
  const columnsView = h('div', { className: 'kx-mtr-cols', style: { gridTemplateColumns: `repeat(${meters.length},1fr)` } },
    meters.map((m, i) => { const on = p.focusEnabled && i === fi; const ht = pct(m.value);
      return h('div', { key: i, className: 'kx-mtr-col' + (on ? ' kx-on' : '') },
        p.showValueLabels ? h('div', { className: 'kx-mtr-colval' }, m.value, m.unit ? h('span', { className: 'kx-u', style: { fontSize: '24px' } }, m.unit) : null) : null,
        h('div', { className: 'kx-mtr-colbar' }, h('div', { className: 'kx-mtr-colfill', style: { height: ht + '%' } })),
        h('div', null,
          h('div', { className: 'kx-mtr-collbl' }, m.name),
          m.en ? h('div', { className: 'kx-mtr-colen' }, m.en) : null)); }));

  // ---- right: dot scale -------------------------------------------------
  const DOTS = 20;
  const dotsView = h('div', { className: 'kx-mtr-right' },
    meters.map((m, i) => { const on = p.focusEnabled && i === fi; const filled = Math.round(pct(m.value) / 100 * DOTS);
      return h('div', { key: i, className: 'kx-mtr-dotrow' + (on ? ' kx-on' : '') },
        h('div', { className: 'kx-mtr-dotlbl' },
          h('span', { className: 'kx-nn' }, m.name),
          m.en ? h('span', { className: 'kx-ne' }, m.en) : null),
        h('div', { className: 'kx-mtr-dots' },
          Array.from({ length: DOTS }, (_, d) => h('i', { key: d, className: d < filled ? 'kx-fd' : '' }))),
        p.showValueLabels ? h('div', { className: 'kx-mtr-dotval' }, m.value, m.unit ? h('span', { className: 'kx-u', style: { fontSize: '24px', color: 'var(--kx-mute-2)' } }, m.unit) : null) : null); }));

  const right = p.chartType === 'columns' ? columnsView : p.chartType === 'dots' ? dotsView : metersView;
  const mainCols = showThesis ? '0.82fr 1.18fr' : '0fr 1fr';

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-mtr-pad' },
      h('div', { className: 'kx-mtr-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-mtr-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-mtr-sub' }, p.subhead)),
        h('div', { className: 'kx-mtr-tag' }, p.tagLabel ? h('b', null, p.tagLabel) : p.eyebrowLabel)),
      showThesis
        ? h('div', { className: 'kx-mtr-main', style: { gridTemplateColumns: mainCols } }, left, right)
        : h('div', { className: 'kx-mtr-main', style: { gridTemplateColumns: '1fr' } }, right),
      h('div', { className: 'kx-mtr-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight || (meters.length + ' READINGS / ' + String(p.chartType).toUpperCase())))));
}

SlideMeter.defaults = {
  eyebrowId: '73', eyebrowLabel: 'REVENUE RISK',
  title: '从试点到稳定收入', subhead: '风险 · 收入验证 / REVENUE VALIDATION',
  closing: '客户试点不等于商业化成功。',
  tagLabel: 'RISK · 收入验证',
  kicker: '多数 AI 公司需要证明自己能从 <b>试点项目</b> 转向 <b>稳定订阅收入</b>。',
  verdict: { label: '判断 / VERDICT', note: '收入验证要看留存、毛利和客户扩张，而不是只看 Logo。' },
  meters: [
    { name: '试点转付费率', en: 'PILOT → PAID', value: '28', unit: '%', note: '多数试点止步于概念验证，未进入预算' },
    { name: '企业年流失率', en: 'ANNUAL CHURN', value: '17', unit: '%', note: '流失高于健康 SaaS，留存仍待夯实' },
    { name: '毛利率中位数', en: 'GROSS MARGIN', value: '54', unit: '%', note: '被推理成本压制，低于传统软件' },
    { name: '推理成本占收入', en: 'INFERENCE COST', value: '31', unit: '%', note: '成本曲线决定毛利天花板' },
  ],
  maxValue: 100,
  footRight: '4 READINGS / METERS',
  chartType: 'meters', meterCount: 4,
  showTrack: true, showValueLabels: true, showNote: true, showThesis: true,
  focusEnabled: true, focusIndex: 0, accent: '#c8f135',
};

SlideMeter.controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'meters',
    options: [['meters', '进度条'], ['columns', '纵向柱'], ['dots', '点阵刻度']], desc: '同一组比率的可视化形式' },
  { key: 'meterCount', label: '指标数量', type: 'number', default: 4, min: 2, max: 4, desc: '展示的比率读数数量' },
  { key: 'showThesis', label: '左侧论点栏', type: 'toggle', default: true, desc: '显示/隐藏左侧论点 + 判断栏（装饰框架）' },
  { key: 'showTrack', label: '剩余轨道', type: 'toggle', default: true, desc: '进度条剩余部分的斜纹轨道（装饰，仅进度条）', showIf: (p) => p.chartType === 'meters' },
  { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '各读数的大号数字（装饰数据）' },
  { key: 'showNote', label: '读数注解', type: 'toggle', default: true, desc: '每条读数的限定语（装饰文案，仅进度条/点阵）', showIf: (p) => p.chartType !== 'columns' },
  { key: 'focusEnabled', label: '重点读数高亮', type: 'toggle', default: true, desc: '是否突出某一读数' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的读数序号', showIf: (p) => p.focusEnabled },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

// P76 壁垒被压缩 / 开源与大厂竞争 — reuse this meter board via a preset passed as props.
// Three competitive-pressure ratios + a verdict. Migration:
//   <SlideMeter {...SlideMeter.presetOpenRisk} />.
SlideMeter.presetOpenRisk = {
  eyebrowId: '76', eyebrowLabel: 'OPEN SOURCE RISK',
  title: '壁垒被压缩', subhead: '风险 · 开源与大厂竞争 / COMMODITIZATION',
  closing: '没有壁垒的模型能力会迅速商品化。',
  tagLabel: 'RISK · 竞争压力',
  kicker: '开源模型降低能力门槛，<b>大厂生态</b> 压缩初创公司的独立空间。',
  verdict: { label: '判断 / VERDICT', note: '初创公司必须找到数据、工作流或行业入口壁垒。' },
  meters: [
    { name: '开源模型性能逼近', en: 'OSS PARITY', value: '86', unit: '%', note: '开源与闭源能力差距快速收敛' },
    { name: '大厂产品覆盖', en: 'INCUMBENT COVERAGE', value: '72', unit: '%', note: '云与办公巨头已自带同类能力' },
    { name: '企业自建意愿', en: 'BUILD-IN-HOUSE', value: '34', unit: '%', note: '部分大客户转向自建替代采购' },
  ],
  maxValue: 100,
  footRight: '3 READINGS / METERS',
  chartType: 'meters', meterCount: 3,
  showTrack: true, showValueLabels: true, showNote: true, showThesis: true,
  focusEnabled: true, focusIndex: 0, accent: '#c8f135',
};

export default SlideMeter;
