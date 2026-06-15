import React from 'react';
import './PulseImageFrame.jsx';
const window = globalThis.__theme05Window || (globalThis.__theme05Window = {});
globalThis.React = React;
function withTheme05Copy(Component) {
  const defaultCopy = Component.copyDefaults || Component.defaults?.copy || null;
  function Theme05CopyWrapped(props = {}) {
    const copy = mergeTheme05Copy(defaultCopy, props.copy);
    const element = Component({ ...props, copy });
    return replaceTheme05Text(element, theme05ReplacementMap(defaultCopy, copy));
  }
  Theme05CopyWrapped.controls = Component.controls || [];
  Theme05CopyWrapped.defaults = { ...(Component.defaults || {}), ...(defaultCopy ? { copy: defaultCopy } : {}) };
  return Theme05CopyWrapped;
}

function mergeTheme05Copy(base, override) {
  if (!base || typeof base !== 'object') return override || base;
  if (!override || typeof override !== 'object') return base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  const next = { ...base };
  for (const [key, value] of Object.entries(override)) {
    next[key] = base[key] && typeof base[key] === 'object' && value && typeof value === 'object'
      ? mergeTheme05Copy(base[key], value)
      : value;
  }
  return next;
}

function theme05ReplacementMap(base, copy, map = new Map()) {
  if (!base || !copy) return map;
  if (typeof base === 'string' || typeof base === 'number') {
    const from = String(base).replace(/\u00a0/g, ' ');
    const to = typeof copy === 'string' || typeof copy === 'number' ? String(copy) : copy;
    if (from && to !== undefined && to !== null && (!map.has(from) || String(to) !== from)) map.set(from, to);
    return map;
  }
  if (Array.isArray(base) && Array.isArray(copy)) {
    base.forEach((item, index) => theme05ReplacementMap(item, copy[index], map));
    return map;
  }
  if (typeof base === 'object' && typeof copy === 'object') {
    Object.keys(base).forEach(key => theme05ReplacementMap(base[key], copy[key], map));
  }
  return map;
}

function replaceTheme05Text(node, replacements) {
  if (!replacements?.size) return node;
  if (typeof node === 'string' || typeof node === 'number') {
    return replacements.get(String(node).replace(/\u00a0/g, ' ')) ?? node;
  }
  if (Array.isArray(node)) return node.map(child => replaceTheme05Text(child, replacements));
  if (!React.isValidElement(node)) return node;
  const nextProps = {};
  let changed = false;
  for (const key of ['children', 'label', 'placeholder', 'title', 'alt', 'aria-label']) {
    if (!(key in node.props)) continue;
    const next = replaceTheme05Text(node.props[key], replacements);
    if (next !== node.props[key]) {
      nextProps[key] = next;
      changed = true;
    }
  }
  return changed ? React.cloneElement(node, nextProps) : node;
}

/* PulseExCovers.jsx — 4 cover slides (EX-7 series)
   Prop-driven (synced with components/esm/PulseExCover1–4.jsx):
   each cover exposes a typed `controls` schema and reads props via
   Object.assign({}, defaults, props). */
(function () {

  const defaultsOf = (controls) =>
    controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

  /* ---- Cover 1: 精益智造 提质增效 ---- */
  const EXC1_SPECS = [
    { k: '指标 01', v: '降本', vn: 'Cost Down' },
    { k: '指标 02', v: '提效', vn: 'Efficiency' },
    { k: '指标 03', v: '革新', vn: 'Innovation' },
    { k: '指标 04', v: '突围', vn: 'Breakthrough' },
  ];
  const EXC1_SWATCH = ['var(--exc-red)', 'var(--exc-yellow)', 'var(--exc-green)', 'var(--exc-blue)'];
  const EXC1_CONTROLS = [
    { key: 'accentColor', type: 'color', label: '强调色', default: '#E0301E',
      options: ['#E0301E', '#E8741C', '#F2C00C', '#2F9450', '#2742C2'] },
    { key: 'showRail', type: 'toggle', label: '右侧指标栏', default: true },
    { key: 'specCount', type: 'slider', label: '指标行数', default: 4, min: 1, max: 4, step: 1 },
    { key: 'showSwatch', type: 'toggle', label: '色卡', default: true },
    { key: 'showFooter', type: 'toggle', label: '底部色谱条', default: true },
  ];
  const EXC1_DEFAULTS = defaultsOf(EXC1_CONTROLS);

  function PulseExCover1(props) {
    const p = Object.assign({}, EXC1_DEFAULTS, props);
    const specs = EXC1_SPECS.slice(0, Math.max(1, Math.min(EXC1_SPECS.length, p.specCount)));
    return (
      <div className="exc exc1" style={{ '--exc-red': p.accentColor }}>
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
                {EXC1_SWATCH.map((c, i) => <i key={i} style={{ background: c }} />)}
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
  PulseExCover1.controls = EXC1_CONTROLS;
  PulseExCover1.defaults = EXC1_DEFAULTS;
  window.PulseExCover1 = PulseExCover1;

  /* ---- Cover 2: 创意破圈 流量赋能 ---- */
  const EXC2_CHIPS = ['var(--exc-red)', 'var(--exc-orange)', 'var(--exc-green)', 'var(--exc-blue)', 'var(--exc-purple)'];
  const EXC2_CONTROLS = [
    { key: 'showTopRule', type: 'toggle', label: '顶部分隔线', default: true },
    { key: 'showNumber', type: 'toggle', label: '编号徽标', default: true },
    { key: 'chipCount', type: 'slider', label: '色块数量', default: 5, min: 1, max: 5, step: 1 },
    { key: 'showBanner', type: 'toggle', label: '底部标语条', default: true },
  ];
  const EXC2_DEFAULTS = defaultsOf(EXC2_CONTROLS);

  function PulseExCover2(props) {
    const p = Object.assign({}, EXC2_DEFAULTS, props);
    const chips = EXC2_CHIPS.slice(0, Math.max(1, Math.min(EXC2_CHIPS.length, p.chipCount)));
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
  PulseExCover2.controls = EXC2_CONTROLS;
  PulseExCover2.defaults = EXC2_DEFAULTS;
  window.PulseExCover2 = PulseExCover2;

  /* ---- Cover 3: 链通全国 高效履约 ---- */
  const EXC3_CONTROLS = [
    { key: 'accentColor', type: 'color', label: '强调色', default: '#E8741C',
      options: ['#E8741C', '#E0301E', '#F2C00C', '#2F9450', '#2742C2'] },
    { key: 'showYear', type: 'toggle', label: '年份水印', default: true },
    { key: 'showSummary', type: 'toggle', label: '右上摘要', default: true },
    { key: 'showBotBand', type: 'toggle', label: '底部色谱条', default: true },
  ];
  const EXC3_DEFAULTS = defaultsOf(EXC3_CONTROLS);

  function PulseExCover3(props) {
    const p = Object.assign({}, EXC3_DEFAULTS, props);
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
  PulseExCover3.controls = EXC3_CONTROLS;
  PulseExCover3.defaults = EXC3_DEFAULTS;
  PulseExCover3.copyDefaults = {
  "brand": "链网",
  "brandEn": "SUPPLY-NET",
  "meta": "GROUP SUPPLY CHAIN · STRATEGY 03 / 04",
  "year": "2026—2028",
  "summary": "打通物流脉络 构筑产业护城河",
  "summaryEn": "Connect The Network · Build The Moat",
  "kicker": "集团供应链体系三年发展战略",
  "titleTop": "链通全国",
  "titleBottom": "高效履约",
  "subtitle": "Three-Year Supply Chain Development Strategy"
};
  PulseExCover3.defaults = { ...(PulseExCover3.defaults || {}), copy: {
  "brand": "链网",
  "brandEn": "SUPPLY-NET",
  "meta": "GROUP SUPPLY CHAIN · STRATEGY 03 / 04",
  "year": "2026—2028",
  "summary": "打通物流脉络 构筑产业护城河",
  "summaryEn": "Connect The Network · Build The Moat",
  "kicker": "集团供应链体系三年发展战略",
  "titleTop": "链通全国",
  "titleBottom": "高效履约",
  "subtitle": "Three-Year Supply Chain Development Strategy"
} };
  window.PulseExCover3 = PulseExCover3;

  /* ---- Cover 4: 把握消费趋势 激活终端潜力 ---- */
  const EXC4_MENU = [
    { sel: true,  label: '消费趋势 TREND\u00A0SENSING', tag: 'ON' },
    { sel: false, label: '终端潜力 STORE\u00A0POTENTIAL', tag: 'ON' },
    { sel: false, label: '运营管理 OPS\u00A0MANAGEMENT', tag: '16TH' },
    { sel: false, label: '营销实战 FIELD\u00A0MARKETING', tag: '+6 DB' },
  ];
  const EXC4_CONTROLS = [
    { key: 'accentColor', type: 'color', label: '高亮色', default: '#E0301E',
      options: ['#E0301E', '#E8741C', '#F2C00C', '#2F9450', '#7A3C9A'] },
    { key: 'showFrame', type: 'toggle', label: '内边框', default: true },
    { key: 'menuCount', type: 'slider', label: '菜单行数', default: 4, min: 1, max: 4, step: 1 },
    { key: 'showFoot', type: 'toggle', label: '底部标语', default: true },
  ];
  const EXC4_DEFAULTS = defaultsOf(EXC4_CONTROLS);

  function PulseExCover4(props) {
    const p = Object.assign({}, EXC4_DEFAULTS, props);
    const menu = EXC4_MENU.slice(0, Math.max(1, Math.min(EXC4_MENU.length, p.menuCount)));
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
  PulseExCover4.controls = EXC4_CONTROLS;
  PulseExCover4.defaults = EXC4_DEFAULTS;
  window.PulseExCover4 = PulseExCover4;

})();

const Component = window.PulseExCover3;
if (!Component) throw new Error('Missing theme05 component PulseExCover3');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;