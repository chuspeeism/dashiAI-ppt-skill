/* PulseExCover3 — 封面：链通全国 高效履约
   Self-contained: React + .exc* CSS only. Visual structure is prop-driven;
   see `controls` below for the full, typed parameter list. */
import React from 'react';

const controls = [
  { key: 'accentColor', type: 'color', label: '强调色', default: '#E8741C',
    options: ['#E8741C', '#E0301E', '#F2C00C', '#2F9450', '#2742C2'],
    description: '中部眉标的强调色。' },
  { key: 'showYear', type: 'toggle', label: '年份水印', default: true,
    description: '左上角的大号年份水印 2026—2028。' },
  { key: 'showSummary', type: 'toggle', label: '右上摘要', default: true,
    description: '右上角的战略摘要文本块。' },
  { key: 'showBotBand', type: 'toggle', label: '底部色谱条', default: true,
    description: '页面底部贯穿的色谱条。' },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseExCover3(props) {
  const p = Object.assign({}, defaults, props);

  return (
    <div className="exc exc3" style={{ '--exc-orange': p.accentColor }}>
      <div className="exc3-topbar">
        <div className="exc3-brand">链网<sup>®</sup>&nbsp;SUPPLY-NET</div>
        <div className="exc3-meta">GROUP&nbsp;SUPPLY&nbsp;CHAIN&nbsp;·&nbsp;STRATEGY&nbsp;03 / 04</div>
      </div>
      {p.showYear && (
        <div className="exc3-yr"><span className="exc3-on">2026</span>—2028</div>
      )}
      {p.showSummary && (
        <div className="exc3-summary">
          <div className="exc3-s">打通物流脉络<br/>构筑产业护城河</div>
          <div className="exc3-sen">Connect The Network · Build The Moat</div>
        </div>
      )}
      <div className="exc3-mid">
        <div className="exc3-kicker">集团供应链体系三年发展战略</div>
        <h1 className="exc3-title">链通全国<span className="exc3-l2">高效履约</span></h1>
        <div className="exc3-sub">Three-Year Supply Chain Development Strategy</div>
      </div>
      {p.showBotBand && (
        <div className="exc3-botbar exc-spectrum"><i/><i/><i/><i/><i/><i/><i/></div>
      )}
    </div>
  );
}

PulseExCover3.controls = controls;
PulseExCover3.defaults = defaults;

export default PulseExCover3;
export { controls, defaults };
