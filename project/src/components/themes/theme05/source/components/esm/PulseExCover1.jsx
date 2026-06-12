/* PulseExCover1 — 封面：精益智造 提质增效
   Self-contained: React + .exc* CSS only. Visual structure is prop-driven;
   see `controls` below for the full, typed parameter list. */
import React from 'react';

const SWATCH = [
  'var(--exc-red)', 'var(--exc-yellow)', 'var(--exc-green)', 'var(--exc-blue)',
];

// Static copy (text is intentionally NOT prop-driven, per spec).
const SPECS = [
  { k: '指标 01', v: '降本', vn: 'Cost Down' },
  { k: '指标 02', v: '提效', vn: 'Efficiency' },
  { k: '指标 03', v: '革新', vn: 'Innovation' },
  { k: '指标 04', v: '突围', vn: 'Breakthrough' },
];

const controls = [
  { key: 'accentColor', type: 'color', label: '强调色', default: '#E0301E',
    options: ['#E0301E', '#E8741C', '#F2C00C', '#2F9450', '#2742C2'],
    description: '眉标、指标英文与装饰元素的强调色。' },
  { key: 'showRail', type: 'toggle', label: '右侧指标栏', default: true,
    description: '显示右侧深色四项指标参数栏；关闭后标题区铺满整页。' },
  { key: 'specCount', type: 'slider', label: '指标行数', default: 4, min: 1, max: 4, step: 1,
    description: '右侧指标栏展示的指标行数量。' },
  { key: 'showSwatch', type: 'toggle', label: '色卡', default: true,
    description: '右侧指标栏底部的四色色卡。' },
  { key: 'showFooter', type: 'toggle', label: '底部色谱条', default: true,
    description: '页面底部贯穿的文件信息与色谱条。' },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseExCover1(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const specs = SPECS.slice(0, Math.max(1, Math.min(SPECS.length, p.specCount)));

  return (
    <div className="exc exc1" style={{ '--exc-red': accent }}>
      <div className="exc1-topbar">
        <div className="exc1-brand">智造<sup>®</sup>&nbsp;SMARTWORKS</div>
        <div className="exc1-meta">
          <span className="exc1-dim">INDUSTRY 4.0</span>
          <i className="exc1-sep" />
          <span className="exc1-dim">2026 — 2027</span>
          <i className="exc1-sep" />
          <b>COMPUTER&nbsp;INTEGRATED</b>
        </div>
      </div>

      <div className="exc1-body" style={p.showRail ? null : { right: 0 }}>
        <div className="exc1-kicker">智能化改造实施方案 · Implementation Plan</div>
        <h1 className="exc1-title">精益智造<span className="exc1-l2">提质增效</span></h1>
        <div className="exc1-rule" />
        <div className="exc1-sub">2026 生产基地智能化改造实施方案<span className="exc1-en">Lean Manufacturing · Quality &amp; Efficiency Upgrade</span></div>
      </div>

      {p.showRail && (
        <div className="exc1-rail">
          <div className="exc1-rlhead">PROGRAM&nbsp;·&nbsp;{specs.length} 项指标</div>
          {specs.map((s, i) => (
            <div className={'exc1-specrow' + (i === specs.length - 1 ? ' exc1-specrow--last' : '')} key={i}>
              <div className="exc1-k">{s.k}</div>
              <div className="exc1-v">{s.v}</div>
              <div className="exc1-vn">{s.vn}</div>
            </div>
          ))}
          {p.showSwatch && (
            <div className="exc1-swatch">
              {SWATCH.map((c, i) => <i key={i} style={{ background: c }} />)}
            </div>
          )}
        </div>
      )}

      {p.showFooter && (
        <div className="exc1-footer">
          <div className="exc1-fl" style={p.showRail ? null : { width: 360 }}>FILE · LEAN-2026 / REV.A</div>
          <div className="exc1-fr exc-spectrum"><i/><i/><i/><i/><i/><i/><i/></div>
        </div>
      )}
    </div>
  );
}

PulseExCover1.controls = controls;
PulseExCover1.defaults = defaults;

export default PulseExCover1;
export { controls, defaults };
