// Slide03Allocation.jsx — 配置明细 / horizontal weight-bar infographic.
// A monumental horizontal stacked bar visualises the allocation weights; a clean
// swatch ledger below carries the names, sub-labels and percentages, and an
// optional media rail can sit on the left. Replaces the old gradient-header +
// chevron list. Standalone & migratable: depends on React + DeckImageSlot.
// Token-driven. CSS scoped under `.al-`.
//
// ── Props (canonical list in Slide03Allocation.META.controls) ──────────────────
//   rowCount     number 1..6              how many allocation rows             (4)
//   focus        boolean                  emphasise one row + segment          (false)
//   focusIndex   number 1..6              which row is emphasised (1-based)    (1)
//   showScale    boolean                  0 / 50 / 100% scale ticks under bar  (true)
//   mediaMode    'none'|'gradient'|'image'  left rail: hidden / tint / upload  ('gradient')
//
// Content props (authored at call-site):
//   overline, title, desc, transfer{label,acct,amt}, rows:[{ name, pct, sub }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

const AL_ROWS = [
  { name: '核心增长底仓', pct: 67, sub: 'L/S EQUITIES · COVERED CALL' },
  { name: '低相关另类', pct: 26, sub: 'CLO · CRYPTO SLEEVE · COMMODITIES' },
  { name: '危机阿尔法', pct: 4, sub: 'TAIL RISK HEDGE' },
  { name: '灵活现金', pct: 3, sub: 'TREASURY BOX SPREAD' },
  { name: '通胀挂钩', pct: 5, sub: 'TIPS · REAL ASSETS' },
  { name: '私募信贷', pct: 8, sub: 'DIRECT LENDING' },
];

function Slide03Allocation({
  idPrefix = 'allocation',
  overline = '投资你的奖金 · ALLOCATION', title = '自主指数 · 配置',
  desc = '奖金的大部分配置于股票、另类资产与对冲工具的多元组合，并保留部分现金以维持灵活度。',
  transfer = { label: '转入账户', acct: '招商银行 ···2248', amt: '¥75,000' },
  rowCount = 4, focus = false, focusIndex = 1, showScale = true, mediaMode = 'gradient',
}) {
  React.useEffect(() => { alInjectStyle(); }, []);
  const n = Math.max(1, Math.min(AL_ROWS.length, rowCount));
  const rows = AL_ROWS.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const total = rows.reduce((a, r) => a + r.pct, 0) || 1;
  const op = (i) => (fIdx >= 0 ? (i === fIdx ? 1 : 0.26) : 1);
  // Each allocation class carries its own brand hue (was a single-accent opacity ramp).
  const SEG = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c2)', 'var(--ds-c6)'];
  const segColor = (i) => SEG[i % SEG.length];
  const rowPad = n >= 6 ? 13 : n === 5 ? 18 : 24;
  const barH = n >= 6 ? 92 : n === 5 ? 106 : 118;
  const ledgerMt = n >= 5 ? 30 : 48;

  return (
    <div className={`al-root ${mediaMode !== 'none' ? 'has-media' : ''}`}>
      {mediaMode !== 'none' && (
        <div className={`al-media ${mediaMode === 'image' ? 'is-image' : 'is-gradient'}`}>
          {mediaMode === 'image' && <DeckImageSlot id={`${idPrefix}-media`} fit="cover" radius={0} placeholder="侧栏图" />}
        </div>
      )}

      <div className="al-info">
        <div className="al-head">
          <div className="al-head-id">
            <div className="al-overline">{overline}</div>
            <h2 className="al-title">{title}</h2>
          </div>
          <p className="al-desc">{desc}</p>
        </div>

        <div className="al-barwrap">
          <div className="al-bar" style={{ height: `${barH}px` }}>
            {rows.map((r, i) => (
              <span key={i} className={`al-seg ${i === fIdx ? 'is-focus' : ''}`}
                    style={{ flex: r.pct, opacity: op(i), background: `linear-gradient(180deg, color-mix(in srgb, ${segColor(i)} 78%, #fff) 0%, ${segColor(i)} 100%)` }}>
                <span className="al-seg-pct">{r.pct}%</span>
              </span>
            ))}
          </div>
          {showScale && (
            <div className="al-scale"><span>0</span><span>50</span><span>100%</span></div>
          )}
        </div>

        <div className="al-ledger" style={{ marginTop: `${ledgerMt}px`, ['--row-pad']: `${rowPad}px` }}>
          {rows.map((r, i) => {
            const hot = focus && i === fIdx, dim = focus && i !== fIdx;
            return (
              <div className={`al-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <span className="al-swatch" style={{ opacity: op(i), background: segColor(i) }} />
                <span className="al-name">{r.name}</span>
                <span className="al-sub">{r.sub}</span>
                <span className="al-pct">{r.pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="al-transfer">
          <span className="al-transfer-label">{transfer.label}</span>
          <span className="al-transfer-acct">{transfer.acct}</span>
          <span className="al-transfer-amt">{transfer.amt}</span>
        </div>
      </div>
    </div>
  );
}

function alInjectStyle() {
  if (document.getElementById('al-style')) return;
  const s = document.createElement('style'); s.id = 'al-style';
  s.textContent = `
  .al-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    display:flex;font-family:var(--font-sans);}
  .al-media{flex:0 0 24%;position:relative;align-self:stretch;overflow:hidden;}
  .al-media.is-gradient{background:linear-gradient(168deg,#16243c 0%,#2c3a52 32%,#6f6675 64%,#d49a6e 100%);}
  .al-media .dslot{border-radius:0;}
  .al-info{flex:1;display:flex;flex-direction:column;min-width:0;
    padding:var(--pad-y,96px) var(--pad-x,120px);}
  .al-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;}
  .al-head-id{flex:1 1 auto;min-width:0;}
  .al-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));white-space:nowrap;}
  .al-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .al-desc{flex:0 1 400px;font-size:24px;line-height:1.55;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));
    margin:0 0 8px;text-wrap:pretty;}
  .al-barwrap{margin-top:auto;}
  .al-bar{display:flex;gap:5px;height:118px;}
  .al-seg{position:relative;background:var(--ds-accent,#6f9bd8);border-radius:6px;min-width:6px;
    display:flex;align-items:flex-end;padding:18px;transition:opacity .25s ease,flex .35s ease;overflow:hidden;}
  .al-seg-pct{font-family:var(--font-mono);font-size:30px;font-weight:400;color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap;}
  .al-seg.is-focus{box-shadow:0 0 0 2px var(--ds-bg-soft,#16181d),0 0 0 4px var(--ds-accent,#6f9bd8);}
  .al-scale{display:flex;justify-content:space-between;margin-top:14px;
    font-family:var(--font-mono);font-size:24px;letter-spacing:.08em;color:var(--ds-faint,rgba(242,243,246,.38));}
  .al-ledger{margin-top:48px;display:flex;flex-direction:column;}
  .al-row{display:grid;grid-template-columns:24px 1fr auto auto;align-items:baseline;gap:28px;
    padding:var(--row-pad,24px) 0;border-top:1px solid var(--ds-line,rgba(242,243,246,.13));transition:opacity .25s;}
  .al-ledger > .al-row:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .al-swatch{width:16px;height:16px;border-radius:4px;background:var(--ds-accent,#6f9bd8);align-self:center;}
  .al-name{font-size:34px;font-weight:300;}
  .al-sub{font-family:var(--font-mono);font-size:24px;letter-spacing:.07em;color:var(--ds-faint,rgba(242,243,246,.42));text-align:right;}
  .al-pct{font-family:var(--font-mono);font-size:30px;font-variant-numeric:tabular-nums;
    color:var(--ds-muted,rgba(242,243,246,.7));min-width:96px;text-align:right;}
  .al-row.is-dim{opacity:.34;}
  .al-row.is-focus .al-name{color:var(--ds-ink,#f2f3f6);}
  .al-row.is-focus .al-pct{color:var(--ds-accent,#6f9bd8);}
  .al-transfer{display:flex;align-items:baseline;gap:24px;margin-top:40px;
    font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-muted,rgba(242,243,246,.6));}
  .al-transfer-label{color:var(--ds-faint,rgba(242,243,246,.4));letter-spacing:.12em;}
  .al-transfer-amt{margin-left:auto;color:var(--ds-ink,#f2f3f6);font-size:28px;}
  `;
  document.head.appendChild(s);
}

Slide03Allocation.META = {
  id: 'allocation', title: '配置明细',
  defaults: { rowCount: 4, focus: false, focusIndex: 1, showScale: true, mediaMode: 'gradient' },
  controls: [
    { key: 'rowCount', type: 'slider', label: '配置条目', default: 4, min: 1, max: 6, step: 1,
      description: '权重条与明细清单的行数。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一类配置（条段 + 明细行）。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
    { key: 'showScale', type: 'toggle', label: '比例刻度', default: true,
      description: '权重条下方的 0 / 50 / 100% 刻度。' },
    { key: 'mediaMode', type: 'radio', label: '侧栏模式', default: 'gradient',
      options: [{ value: 'gradient', label: '渐变' }, { value: 'image', label: '图片' }, { value: 'none', label: '无' }],
      description: '左侧竖栏：品牌渐变、可上传图片槽，或隐藏让信息满幅。' },
  ],
};

export { Slide03Allocation };
export const META = Slide03Allocation.META;
export default Slide03Allocation;
