/* PulseExCover4 — 封面：把握消费趋势 激活终端潜力
   Self-contained: React + .exc* CSS only. Visual structure is prop-driven;
   see `controls` below for the full, typed parameter list. */
import React from 'react';

const MENU = [
  { sel: true,  label: '消费趋势 TREND\u00A0SENSING', tag: 'ON' },
  { sel: false, label: '终端潜力 STORE\u00A0POTENTIAL', tag: 'ON' },
  { sel: false, label: '运营管理 OPS\u00A0MANAGEMENT', tag: '16TH' },
  { sel: false, label: '营销实战 FIELD\u00A0MARKETING', tag: '+6 DB' },
];

const controls = [
  { key: 'accentColor', type: 'color', label: '高亮色', default: '#E0301E',
    options: ['#E0301E', '#E8741C', '#F2C00C', '#2F9450', '#7A3C9A'],
    description: '菜单当前选中行的高亮底色。' },
  { key: 'showFrame', type: 'toggle', label: '内边框', default: true,
    description: '页面四周的双线内边框装饰。' },
  { key: 'menuCount', type: 'slider', label: '菜单行数', default: 4, min: 1, max: 4, step: 1,
    description: '底部模拟菜单的条目数量。' },
  { key: 'showFoot', type: 'toggle', label: '底部标语', default: true,
    description: '页脚的口号与操作提示两行文本。' },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseExCover4(props) {
  const p = Object.assign({}, defaults, props);
  const menu = MENU.slice(0, Math.max(1, Math.min(MENU.length, p.menuCount)));

  return (
    <div className="exc exc4" style={{ '--exc-red': p.accentColor }}>
      {p.showFrame && <div className="exc4-frame" />}
      <div className="exc4-menubar"><div className="exc4-t">SETUP&nbsp;·&nbsp;RETAIL&nbsp;OPS</div></div>
      <div className="exc4-corner exc4-tl">门店运营培训</div>
      <div className="exc4-corner exc4-tr">SHEET 04 / 04</div>
      <div className="exc4-stack">
        <h1 className="exc4-title">把握消费趋势<span className="exc4-l2">激活终端潜力</span></h1>
        <div className="exc4-sub">全国零售门店运营管理暨营销实战培训</div>
      </div>
      <div className="exc4-menu">
        {menu.map((m, i) => (
          <div className={'exc4-mrow' + (m.sel ? ' exc4-sel' : '')} key={i}>
            <span className="exc4-ar">{m.sel ? '▶' : '\u00A0'}</span>{m.label}<span className="exc4-on">{m.tag}</span>
          </div>
        ))}
      </div>
      {p.showFoot && (
        <div className="exc4-foot">
          <span className="exc4-ln">SLOGAN — <b>用心服务客户，实干创造业绩</b></span>
          <span className="exc4-ln">PRESS (MENU) TO BEGIN&nbsp;&nbsp;·&nbsp;&nbsp;SERVE WITH HEART, ACHIEVE BY ACTION</span>
        </div>
      )}
    </div>
  );
}

PulseExCover4.controls = controls;
PulseExCover4.defaults = defaults;

export default PulseExCover4;
export { controls, defaults };
