// SlideDisclosure.jsx — 风险揭示 / a regulatory disclosure & fine-print page.
// A framed risk callout sits above numbered clauses laid out in dense, sober
// multi-column small print, closed by a mono document reference. The sort of
// page every real investment report carries — deliberately quiet, legal in tone.
// Distinct from SlidePrinciples (large editorial statements) and SlideGlossary
// (term/definition). Standalone & migratable: depends only on React (imported).
// Token-driven, light/dark tone applies. CSS scoped `.dsc-`.
//
// ── Props (canonical list in SlideDisclosure.META.controls) ───────────────────
//   clauseCount number 4..9   how many numbered clauses                    (6)
//   columns     number 2..3   small-print column count                     (2)
//   showCallout boolean       the framed risk-warning box up top           (true)
//   showFooter  boolean       the mono document reference line             (true)
//
// Content props (authored at call-site):
//   overline, title, callout, clauses:[{ head, body }], docref
//   (this page defaults to a light surface via TONE_DEFAULTS in app.jsx)

import React from 'react';

function SlideDisclosure({
  overline = '重要声明 · PLEASE READ CAREFULLY',
  title = '风险揭示与重要声明',
  callout = '投资有风险。过往业绩不代表未来表现，本报告所载任何数据、回测与情景分析均不构成收益承诺或投资建议。',
  clauses = [
    { head: '一般性风险', body: '基金及各类资产价格受宏观经济、利率、汇率、政策与市场情绪影响而波动，投资者可能损失部分或全部本金。' },
    { head: '回测与模拟', body: '文中历史回测基于既定规则在历史数据上的假设性结果，未计入全部交易成本与流动性约束，不应被视为实盘业绩。' },
    { head: '前瞻性陈述', body: '凡涉及「预期」「目标」「或将」等表述均为前瞻性陈述，受诸多不确定因素影响，实际结果可能存在重大差异。' },
    { head: '费用与税负', body: '净回报已尽量反映管理与交易费用，但个人税负、申赎费率因人而异，请以正式合同与产品说明书为准。' },
    { head: '适当性', body: '本报告未考虑任何特定投资者的财务状况与目标，做出决策前请评估自身风险承受能力或咨询专业顾问。' },
    { head: '信息来源', body: '数据来源于公开市场与第三方机构，本机构力求准确但不对其完整性与时效性作出保证。' },
    { head: '保密与转载', body: '本报告仅供特定接收人参考，未经书面许可不得复制、转发或公开披露其全部或部分内容。' },
    { head: '利益冲突', body: '本机构及其关联方可能持有文中所述资产或提供相关服务，已建立相应的隔离与披露机制。' },
    { head: '法律适用', body: '本报告之解释、效力及争议解决均适用中华人民共和国法律，并以正式法律文件约定为最终依据。' },
  ],
  docref = 'DOC · ZZ-2025-AR-014  ·  生效日 2025.12.31  ·  第 1 页 / 共 1 页',
  clauseCount = 6, columns = 2, showCallout = true, showFooter = true,
}) {
  React.useEffect(() => { dscInjectStyle(); }, []);
  const n = Math.max(4, Math.min(clauses.length, clauseCount));
  const used = clauses.slice(0, n);
  const cols = Math.max(2, Math.min(3, columns));
  const HUE = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c2)'];

  return (
    <div className="dsc-root">
      <div className="dsc-head">
        <div className="dsc-overline">{overline}</div>
        <h2 className="dsc-title">{title}</h2>
      </div>

      {showCallout && (
        <div className="dsc-callout">
          <span className="dsc-mark">!</span>
          <p className="dsc-ctext">{callout}</p>
        </div>
      )}

      <ol className="dsc-clauses" style={{ columnCount: cols }}>
        {used.map((c, i) => (
          <li className="dsc-clause" key={i}>
            <span className="dsc-num" style={{ color: HUE[i % HUE.length] }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="dsc-chead">{c.head}　</span>
            <span className="dsc-cbody">{c.body}</span>
          </li>
        ))}
      </ol>

      {showFooter && <div className="dsc-foot">{docref}</div>}
    </div>
  );
}

function dscInjectStyle() {
  if (document.getElementById('dsc-style')) return;
  const s = document.createElement('style'); s.id = 'dsc-style';
  s.textContent = `
  .dsc-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .dsc-head{margin-bottom:34px;}
  .dsc-overline{font-family:var(--font-mono);font-size:25px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .dsc-title{font-size:56px;font-weight:300;margin:14px 0 0;line-height:1.1;}
  .dsc-callout{display:flex;align-items:flex-start;gap:26px;padding:30px 36px;border-radius:16px;margin-bottom:40px;
    background:var(--ds-grad-soft,linear-gradient(110deg,rgba(35,67,96,.3),rgba(84,121,232,.3)));
    box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ds-accent,#6f9bd8) 32%,transparent);}
  .dsc-mark{flex:0 0 auto;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-family:var(--font-mono);font-size:30px;font-weight:500;color:#0c0e12;background:var(--ds-c4);}
  .dsc-ctext{margin:6px 0 0;font-size:30px;font-weight:400;line-height:1.4;text-wrap:pretty;}
  .dsc-clauses{flex:1;min-height:0;margin:0;padding:0;list-style:none;column-gap:80px;
    align-content:start;}
  .dsc-clause{break-inside:avoid;margin:0 0 28px;padding-left:0;text-indent:0;font-size:23px;font-weight:300;
    line-height:1.5;color:var(--ds-muted,rgba(242,243,246,.66));text-wrap:pretty;}
  .dsc-num{font-family:var(--font-mono);font-size:21px;color:var(--ds-accent,#6f9bd8);margin-right:14px;
    font-variant-numeric:tabular-nums;}
  .dsc-chead{font-weight:500;color:var(--ds-ink,#f2f3f6);}
  .dsc-foot{margin-top:30px;padding-top:22px;border-top:1px solid var(--ds-line,rgba(242,243,246,.13));
    font-family:var(--font-mono);font-size:22px;letter-spacing:.07em;color:var(--ds-faint,rgba(242,243,246,.46));}
  `;
  document.head.appendChild(s);
}

SlideDisclosure.META = {
  id: 'disclosure', title: '风险揭示',
  defaults: { clauseCount: 6, columns: 2, showCallout: true, showFooter: true },
  controls: [
    { key: 'clauseCount', type: 'slider', label: '条款数量', default: 6, min: 4, max: 9, step: 1,
      description: '编号声明条款的数量。' },
    { key: 'columns', type: 'slider', label: '分栏', default: 2, min: 2, max: 3, step: 1,
      description: '小字条款的分栏数。' },
    { key: 'showCallout', type: 'toggle', label: '风险提示框', default: true,
      description: '顶部加框的核心风险警示。' },
    { key: 'showFooter', type: 'toggle', label: '文档编号', default: true,
      description: '底部等宽字体的文档编号 / 生效信息。' },
  ],
};

export { SlideDisclosure };
export const META = SlideDisclosure.META;
export default SlideDisclosure;
