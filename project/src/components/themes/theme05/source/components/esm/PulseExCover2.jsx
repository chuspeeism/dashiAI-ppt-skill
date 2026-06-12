/* PulseExCover2 — 封面：创意破圈 流量赋能
   Self-contained: React + .exc* CSS only. Visual structure is prop-driven;
   see `controls` below for the full, typed parameter list. */
import React from 'react';

const CHIPS = [
  'var(--exc-red)', 'var(--exc-orange)', 'var(--exc-green)', 'var(--exc-blue)', 'var(--exc-purple)',
];

const controls = [
  { key: 'showTopRule', type: 'toggle', label: '顶部分隔线', default: true,
    description: '标题上方贯穿的品牌实验室分隔线。' },
  { key: 'showNumber', type: 'toggle', label: '编号徽标', default: true,
    description: '标题上方的 “NO. 02” 编号徽标。' },
  { key: 'chipCount', type: 'slider', label: '色块数量', default: 5, min: 1, max: 5, step: 1,
    description: '标题下方的彩色色块条数量。' },
  { key: 'showBanner', type: 'toggle', label: '底部标语条', default: true,
    description: '页面底部的深色标语横幅。' },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseExCover2(props) {
  const p = Object.assign({}, defaults, props);
  const chips = CHIPS.slice(0, Math.max(1, Math.min(CHIPS.length, p.chipCount)));

  return (
    <div className="exc exc2">
      {p.showTopRule && (
        <div className="exc2-top">
          <span className="exc2-ln" />
          <span className="exc2-bd">PULSE® BRAND LAB · FULL-FUNNEL MARKETING</span>
          <span className="exc2-ln" />
        </div>
      )}
      <div className="exc2-center">
        {p.showNumber && (
          <div className="exc2-num"><span className="exc2-b">NO. 02</span></div>
        )}
        <div className="exc2-cap">2026 年度全平台品牌整合营销方案</div>
        <h1 className="exc2-title">创意破圈<span className="exc2-l2">流量赋能</span></h1>
        <div className="exc2-chips">
          {chips.map((c, i) => <i key={i} style={{ background: c }} />)}
        </div>
      </div>
      {p.showBanner && (
        <div className="exc2-banner">
          <div className="exc2-big">内容驱动传播&nbsp;·&nbsp;创意引爆市场</div>
          <div className="exc2-en">Content Drives Reach · Idea Ignites Market</div>
        </div>
      )}
    </div>
  );
}

PulseExCover2.controls = controls;
PulseExCover2.defaults = defaults;

export default PulseExCover2;
export { controls, defaults };
