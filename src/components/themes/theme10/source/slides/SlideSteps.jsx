// SlideSteps.jsx — 运作机制 / numbered how-it-works process.
// A row of big-numeral steps explaining how something works, joined by light
// connectors. Distinct from SlideTimeline (dated chronology) and SlideJourney
// (where-you-are progress): this is an explanatory N-step mechanism with large
// ordinal numerals. Standalone & migratable: depends only on React (imported).
// Token-driven. CSS scoped under `.stp-`.
//
// ── Props (canonical list in SlideSteps.META.controls) ────────────────────────
//   stepCount      number 3..5   how many steps                            (4)
//   showConnectors boolean       the connectors between steps              (true)
//   showDesc       boolean       the description under each step           (true)
//   focus          boolean       emphasise one step, dim the rest          (false)
//   focusIndex     number 1..5   which step is emphasised (1-based)        (1)
//
// Content props (authored at call-site):
//   overline, title, steps:[{ title, desc }]

import React from 'react';

function SlideSteps({
  overline = '运作机制 · HOW IT WORKS', title = '引擎是怎么替你工作的',
  steps = [
    { title: '设定目标', desc: '说清你的目标、期限与风险偏好，引擎据此生成你的专属指数。' },
    { title: '持续监测', desc: '7×24 跟踪市场与你的组合，偏离目标即触发信号，无需你盯盘。' },
    { title: '自动再平衡', desc: '到点按规则买卖，低买高卖落到执行，情绪不参与决策。' },
    { title: '复利滚动', desc: '收益自动再投入，成本透明可见，时间替你把雪球越滚越大。' },
    { title: '定期回顾', desc: '每季生成报告，目标进度一目了然，随时可微调方向。' },
  ],
  stepCount = 4, showConnectors = true, showDesc = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { stpInjectStyle(); }, []);
  const n = Math.max(3, Math.min(steps.length, stepCount));
  const used = steps.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="stp-root">
      <div className="stp-head">
        <div className="stp-overline">{overline}</div>
        <h2 className="stp-title">{title}</h2>
      </div>

      <div className="stp-row" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {used.map((st, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          return (
            <div className={`stp-step ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="stp-numwrap">
                <span className="stp-num">{String(i + 1).padStart(2, '0')}</span>
                {showConnectors && i < n - 1 && <span className="stp-conn" aria-hidden="true" />}
              </div>
              <h3 className="stp-step-title">{st.title}</h3>
              {showDesc && <p className="stp-desc">{st.desc}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function stpInjectStyle() {
  if (document.getElementById('stp-style')) return;
  const s = document.createElement('style'); s.id = 'stp-style';
  s.textContent = `
  .stp-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .stp-head{margin-bottom:48px;}
  .stp-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .stp-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .stp-row{flex:1;min-height:0;display:grid;gap:56px;align-content:center;}
  .stp-step{display:flex;flex-direction:column;transition:opacity .25s;}
  .stp-step.is-dim{opacity:.34;}
  .stp-numwrap{position:relative;display:flex;align-items:center;margin-bottom:28px;}
  .stp-num{font-family:var(--font-mono);font-size:96px;font-weight:400;line-height:.9;letter-spacing:-.02em;
    color:var(--ds-accent,#6f9bd8);font-variant-numeric:tabular-nums;}
  .stp-step.is-dim .stp-num{color:var(--ds-faint,rgba(242,243,246,.4));}
  .stp-conn{position:absolute;left:130px;right:-56px;top:50%;height:1.5px;
    background:var(--ds-line,rgba(242,243,246,.2));}
  .stp-conn::after{content:"";position:absolute;right:0;top:50%;width:7px;height:7px;
    border-top:1.5px solid var(--ds-line,rgba(242,243,246,.3));border-right:1.5px solid var(--ds-line,rgba(242,243,246,.3));
    transform:translateY(-50%) rotate(45deg);}
  .stp-step-title{font-size:36px;font-weight:300;margin:0 0 16px;line-height:1.1;}
  .stp-step.is-focus .stp-step-title{color:var(--ds-accent,#6f9bd8);}
  .stp-desc{font-size:26px;font-weight:300;line-height:1.55;margin:0;max-width:22ch;
    color:var(--ds-muted,rgba(242,243,246,.62));text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideSteps.META = {
  id: 'steps', title: '运作机制',
  defaults: { stepCount: 4, showConnectors: true, showDesc: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'stepCount', type: 'slider', label: '步骤数量', default: 4, min: 3, max: 5, step: 1,
      description: '机制的步骤数量。' },
    { key: 'showConnectors', type: 'toggle', label: '连接箭头', default: true,
      description: '相邻步骤之间的连接线与箭头。' },
    { key: 'showDesc', type: 'toggle', label: '步骤说明', default: true,
      description: '每个步骤下方的说明文字。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一步骤，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideSteps };
export const META = SlideSteps.META;
export default SlideSteps;
