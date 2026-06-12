// Page79Repricing.jsx — "IPO Watch · Anchor Repricing" template page (timeline-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-iw-`.
// A NEW timeline form (distinct from P13 compare-phase / P20 pullback / P52
// evolution axis): a left→right IPO-window axis acting as a dashed "valuation
// anchor baseline", with count-driven watch-company nodes zig-zagging above/below
// the line, each carrying a re-pricing badge (↑ uplift / ↓ pressure). One node is
// focusable; a bottom row holds observation-metric chips.
// Pure ESM — no Tweaks/preview-runtime dependency; every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page79Repricing(props) {
  const p = { ...Page79Repricing.defaults, ...props };
  const {
    backgroundTheme, nodeCount, showBaseline, showValueLabels, showMetrics, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, axisStart, axisEnd, baseLabel, watchlist, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const nodes = watchlist.slice(0, Math.max(2, nodeCount));
  const fIdx = Math.min(focusIndex, nodes.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));

  return (
    <div className="acl-root acl-iw" style={{ background: bg }}>
      <style>{`
        .acl-iw{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 60px; display:flex; flex-direction:column; }
        .acl-iw__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-iw__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-iw__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-iw__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2);  white-space:nowrap;}
        .acl-iw__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-iw__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        /* ── plot: anchor baseline + zig-zag watch nodes ── */
        .acl-iw__plot{ flex:1; position:relative; margin-top:18px; min-height:0; }
        .acl-iw__base{ position:absolute; left:0; right:54px; top:50%; height:0;
          border-top:4px dashed var(--acl-ink); z-index:1; }
        .acl-iw__arrow{ position:absolute; right:-6px; top:50%; transform:translateY(-50%); z-index:2; }
        .acl-iw__baselab{ position:absolute; left:2px; top:calc(50% + 12px); font-family:var(--acl-font-mono);
          font-weight:700; font-size:14px; letter-spacing:.08em; text-transform:uppercase;
          color:rgba(22,21,15,.5); z-index:2; }
        .acl-iw__edge{ position:absolute; top:calc(50% - 44px); font-family:var(--acl-font-num);
          font-size:30px; line-height:1; color:rgba(22,21,15,.4); z-index:2; }
        .acl-iw__edge--s{ left:0; }
        .acl-iw__edge--e{ right:54px; }

        .acl-iw__col{ position:absolute; top:0; bottom:0; transform:translateX(-50%); width:262px; z-index:3; }
        .acl-iw__dot{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          width:26px; height:26px; border-radius:50%; background:var(--acl-paper);
          border:4px solid var(--acl-ink); z-index:4; transition:background .25s, transform .25s; }
        .acl-iw__stem{ position:absolute; left:50%; width:0; border-left:3px dashed var(--acl-ink);
          transform:translateX(-50%); z-index:2; }
        .acl-iw__stem--up{ bottom:50%; height:66px; }
        .acl-iw__stem--dn{ top:50%; height:66px; }
        .acl-iw__card{ position:absolute; left:50%; transform:translateX(-50%); width:248px;
          background:var(--acl-paper); border:3px solid var(--acl-ink); box-shadow:6px 8px 0 rgba(22,21,15,.16);
          padding:18px 20px 16px; display:flex; flex-direction:column; gap:7px;
          transition:opacity .25s, transform .25s, box-shadow .25s, background .25s; }
        .acl-iw__card--up{ bottom:calc(50% + 66px); }
        .acl-iw__card--dn{ top:calc(50% + 66px); }
        .acl-iw__cname{ font-weight:900; font-size:32px; line-height:1; }
        .acl-iw__crole{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-iw__cnote{ font-weight:700; font-size:18px; line-height:1.32; color:rgba(22,21,15,.66); }
        .acl-iw__badge{ display:inline-flex; align-items:center; gap:8px; align-self:flex-start;
          font-family:var(--acl-font-mono); font-weight:700; font-size:14px; letter-spacing:.04em;
          padding:5px 11px; margin-top:2px; }
        .acl-iw__badge--up{ background:var(--acl-blue); color:var(--acl-ink); }
        .acl-iw__badge--dn{ background:var(--acl-red); color:var(--acl-paper); }
        .acl-iw__badge i{ font-style:normal; font-family:var(--acl-font-num); font-size:20px; line-height:1; }

        .acl-iw__col--focus .acl-iw__dot{ background:var(--acl-pink); transform:translate(-50%,-50%) scale(1.25); }
        .acl-iw__col--focus .acl-iw__card{ background:var(--acl-ink); color:var(--acl-paper);
          box-shadow:9px 12px 0 rgba(22,21,15,.3); }
        .acl-iw__col--focus .acl-iw__crole{ color:rgba(255,255,255,.55); }
        .acl-iw__col--focus .acl-iw__cnote{ color:rgba(255,255,255,.78); }
        .acl-iw__col--dim{ opacity:.5; }
        .acl-iw__cfx{ position:absolute; left:50%; transform:translateX(-50%); z-index:6; }
        .acl-iw__cfx--up{ top:-30px; }
        .acl-iw__cfx--dn{ bottom:-30px; }

        .acl-iw__metrics{ flex:0 0 auto; display:flex; gap:14px; border-top:2px dashed rgba(22,21,15,.25);
          padding-top:16px; margin-top:8px; }
        .acl-iw__tile{ flex:1; display:flex; align-items:center; gap:12px; min-width:0; }
        .acl-iw__tnum{ font-family:var(--acl-font-num); font-size:34px; line-height:.8; color:rgba(22,21,15,.4); flex:0 0 auto; }
        .acl-iw__ttxt{ display:flex; flex-direction:column; }
        .acl-iw__ttxt b{ font-weight:900; font-size:23px; line-height:1.04; }
        .acl-iw__ttxt span{ font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }

        .acl-iw__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:12px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-iw__col{ animation:acl-iw-in .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .15s); }
          [data-deck-active] .acl-iw__tile{ animation:acl-iw-pop .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .45s); }
        }
        @keyframes acl-iw-in{ from{ opacity:0; transform:translateX(-50%) translateY(16px); }
          to{ opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes acl-iw-pop{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-iw__head">
        <div>
          <div className="acl-iw__eyebrow">{eyebrow}</div>
          <h1 className="acl-iw__h">{headline}</h1>
        </div>
        <div className="acl-iw__sub">{subheadline}</div>
        <div className="acl-iw__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-iw__plot">
        {showBaseline && (
          <React.Fragment>
            <div className="acl-iw__base" />
            <div className="acl-iw__baselab">{baseLabel}</div>
            <div className="acl-iw__edge acl-iw__edge--s">{axisStart}</div>
            <div className="acl-iw__edge acl-iw__edge--e">{axisEnd}</div>
            {showDecor && <div className="acl-iw__arrow"><Doodle kind="arrow" size={58} style={{ position: 'static' }} /></div>}
          </React.Fragment>
        )}
        {nodes.map((w, i) => {
          const up = i % 2 === 0;                 // zig-zag layout by position
          const isF = focusEnabled && i === fIdx;
          const dim = focusEnabled && !isF;
          const dn = w.dir === 'down';
          const left = `${((i + 0.5) / nodes.length) * 100}%`;
          return (
            <div key={i} className={'acl-iw__col' + (isF ? ' acl-iw__col--focus' : '') + (dim ? ' acl-iw__col--dim' : '')}
                 style={{ left, '--i': i }}>
              <div className={'acl-iw__stem ' + (up ? 'acl-iw__stem--up' : 'acl-iw__stem--dn')} />
              <div className="acl-iw__dot" />
              {isF && showDecor && (
                <div className={'acl-iw__cfx ' + (up ? 'acl-iw__cfx--up' : 'acl-iw__cfx--dn')}>
                  <Sticker label="重定价锚" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-5} size={12} />
                </div>
              )}
              <div className={'acl-iw__card ' + (up ? 'acl-iw__card--up' : 'acl-iw__card--dn')}>
                <div className="acl-iw__cname">{w.name}</div>
                <div className="acl-iw__crole">{w.role}</div>
                <div className="acl-iw__cnote">{w.note}</div>
                {showValueLabels && (
                  <span className={'acl-iw__badge ' + (dn ? 'acl-iw__badge--dn' : 'acl-iw__badge--up')}>
                    <i>{dn ? '↓' : '↑'}</i>{w.tag}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showMetrics && (
        <div className="acl-iw__metrics">
          {tiles.map((m, i) => (
            <div key={i} className="acl-iw__tile" style={{ '--i': i }}>
              <span className="acl-iw__tnum">{String(i + 1).padStart(2, '0')}</span>
              <div className="acl-iw__ttxt"><b>{m.name}</b><span>{m.en}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="acl-iw__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page79Repricing.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  nodeCount: 4,                // 2–4 watch companies
  showBaseline: true,          // valuation anchor baseline + axis ends
  showValueLabels: true,       // re-pricing badges (↑ / ↓)
  showMetrics: true,           // bottom observation-metric chips
  metricCount: 4,              // 2–4 metric chips
  focusEnabled: true,
  focusIndex: 0,               // spotlight one watch node
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'IPO Watch',
  headline: '估值锚重定价',
  subheadline: '策略 · 观察 IPO 窗口',
  summary: '头部 IPO 表现会重定价整个 <b>一级市场估值锚</b>。',
  axisStart: '窗口开启',
  axisEnd: '重定价',
  baseLabel: '估值锚基线 · Valuation Anchor',
  watchlist: [
    { name: 'OpenAI', role: '通用大模型', note: '估值锚顶端，收入增速定全行业基调。', dir: 'up', tag: '收入定基调' },
    { name: 'Anthropic', role: '安全可靠模型', note: '企业采用兑现，估值待公开市场验证。', dir: 'up', tag: '采用兑现' },
    { name: 'Databricks', role: '数据平台', note: '存量客户复用，毛利结构相对更稳。', dir: 'up', tag: '毛利更稳' },
    { name: 'CoreWeave', role: '算力基础设施', note: '云成本占比高，毛利弹性持续承压。', dir: 'down', tag: '弹性承压' },
  ],
  metrics: [
    { name: '上市表现', en: 'IPO Print' },
    { name: '收入增速', en: 'Rev. Growth' },
    { name: '毛利率', en: 'Gross Margin' },
    { name: '云成本占比', en: 'Cloud Cost' },
  ],
  closingLine: '公开市场会重新定价 AI 叙事。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page79Repricing.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'nodeCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '观察对象数', desc: '时间轴上的观察对象节点数量(2–4)，沿轴上下交错排布' },
  { key: 'showBaseline', type: 'boolean', default: true,
    label: '估值锚基线', desc: '中央虚线基线 + 两端窗口标注 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '重定价徽标', desc: '各节点上的 ↑/↓ 重定价方向徽标 显隐' },
  { key: 'showMetrics', type: 'boolean', default: true,
    label: '观察指标', desc: '底部观察指标行 显隐' },
  { key: 'metricCount', type: 'number', default: 4, min: 2, max: 4, step: 1, showIf: 'showMetrics',
    label: '指标数量', desc: '底部观察指标数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个观察对象(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'nodeCount',
    label: '重点对象', desc: '被高亮的观察对象序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page79Repricing.defaults;
export const controls = Page79Repricing.controls;
