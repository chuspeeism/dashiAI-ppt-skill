// SlideCoverDawn.jsx — 晨光卡封面 / dawn-card cover.
// Built from the product's "bonus" screen: a large rounded gradient hero panel
// (a warm dawn sky, or a user photo) carrying the title, sitting above a dark
// allocation strip of mono label / percent cells divided by hairlines.
// Standalone & migratable: depends on React + DeckImageSlot (both global).
// Themed. CSS scoped under `.cd-`. Image-slot id derives from idPrefix.
//
// ── Props (canonical list in SlideCoverDawn.META.controls) ────────────────────
//   theme      'dawn'|'dusk'|'ember'   gradient mood of the hero panel    ('dawn')
//   showImage  boolean   fill the hero panel with a user photo instead    (false)
//   rowCount   number 0..4   how many allocation cells show               (4)
//   showFooter boolean   the bottom meta row                              (true)
//
// Content props (authored at call-site): idPrefix, kicker, title, sub,
//   rows:[{label,pct,note}], footL, footR

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

const CD_GRADS = {
  dawn:  'linear-gradient(122deg,#172a42 0%,#3b4a5a 28%,#8a7870 58%,#d3a07e 82%,#eecaa6 100%)',
  dusk:  'linear-gradient(122deg,#0e1a2a 0%,#26384a 34%,#4f6276 64%,#8aa0bd 88%,#c7d6e6 100%)',
  ember: 'linear-gradient(122deg,#1d1722 0%,#46303a 30%,#8a4f44 60%,#c87a4e 84%,#eab07a 100%)',
};

function SlideCoverDawn({
  idPrefix = 'coverdawn', theme = 'dawn', showImage = false, rowCount = 4, showFooter = true,
  kicker = '投资你的奖金 · INVESTING YOUR BONUS',
  title = '自主指数', sub = '将大部分资金配置于股票、另类与对冲的分散组合，并保留部分现金以保持灵活。',
  rows = [
    { label: 'CORE GROWTH', pct: '67%', note: '核心成长底仓' },
    { label: 'ALTERNATIVES', pct: '26%', note: '低相关另类' },
    { label: 'CRISIS ALPHA', pct: '4%', note: '尾部风险对冲' },
    { label: 'SMART CASH', pct: '3%', note: '智能现金' },
  ],
  footL = 'AUTONOMOUS INDEX · 2025', footR = '01 / 05',
}) {
  React.useEffect(() => { cdInjectStyle(); }, []);
  const grad = CD_GRADS[theme] || CD_GRADS.dawn;
  const n = Math.max(0, Math.min(4, rowCount | 0));
  const cells = rows.slice(0, n);

  return (
    <div className="cd-root" style={{ ['--cd-grad']: grad }}>
      <div className="cd-card">
        {showImage
          ? <DeckImageSlot id={`${idPrefix}-hero`} fit="cover" radius={28} placeholder="DAWN · 封面影像" />
          : <div className="cd-grad" />}
        <div className="cd-card-grain" />
        <div className="cd-card-body">
          <div className="cd-kicker">{kicker}</div>
          <h1 className="cd-title">{title}</h1>
          <p className="cd-sub">{sub}</p>
        </div>
      </div>

      {n > 0 && (
        <div className="cd-strip">
          {cells.map((c, i) => (
            <div className="cd-cell" key={i}>
              <span className="cd-cell-label">{c.label}</span>
              <span className="cd-cell-pct">{c.pct}</span>
              <span className="cd-cell-note">{c.note}</span>
            </div>
          ))}
        </div>
      )}

      {showFooter && <div className="cd-foot"><span>{footL}</span><span className="cd-foot-r">{footR}</span></div>}
    </div>
  );
}

function cdInjectStyle() {
  if (document.getElementById('cd-style')) return;
  const s = document.createElement('style'); s.id = 'cd-style';
  s.textContent = `
  .cd-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    background:#060708;color:#f3f4f6;
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;gap:48px;}
  .cd-card{position:relative;flex:1;min-height:0;border-radius:32px;overflow:hidden;
    box-shadow:0 30px 80px rgba(0,0,0,.5);}
  .cd-grad{position:absolute;inset:0;background:var(--cd-grad);}
  .cd-card-grain{position:absolute;inset:0;pointer-events:none;opacity:.35;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .cd-card-body{position:absolute;left:64px;right:64px;bottom:60px;z-index:2;color:#f7f4ef;}
  .cd-kicker{font-family:var(--font-mono);font-size:25px;letter-spacing:.18em;color:rgba(247,244,239,.82);margin-bottom:24px;}
  .cd-title{margin:0;font-size:104px;font-weight:300;line-height:1;letter-spacing:-.01em;}
  .cd-sub{margin:28px 0 0;font-size:30px;font-weight:300;line-height:1.5;color:rgba(247,244,239,.86);max-width:1000px;text-wrap:pretty;}
  .cd-strip{display:flex;align-items:stretch;flex:0 0 auto;}
  .cd-cell{flex:1;display:flex;flex-direction:column;gap:14px;padding:6px 40px;
    border-left:1px solid rgba(243,244,246,.14);}
  .cd-cell:first-child{padding-left:0;border-left:0;}
  .cd-cell-label{font-family:var(--font-mono);font-size:24px;letter-spacing:.12em;color:rgba(243,244,246,.55);}
  .cd-cell-pct{font-size:62px;font-weight:300;line-height:1;letter-spacing:-.01em;font-variant-numeric:tabular-nums;}
  .cd-cell-note{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:rgba(243,244,246,.5);}
  .cd-foot{display:flex;justify-content:space-between;flex:0 0 auto;
    font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;color:rgba(243,244,246,.5);}
  .cd-foot-r{color:rgba(243,244,246,.7);}
  .cd-foot span{white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

try { cdInjectStyle(); } catch (e) { /* head not ready — useEffect covers it */ }

SlideCoverDawn.META = {
  id: 'coverdawn', title: '晨光卡封面',
  defaults: { theme: 'dawn', showImage: false, rowCount: 4, showFooter: true },
  controls: [
    { key: 'theme', type: 'select', label: '渐变情绪', default: 'dawn',
      options: [
        { value: 'dawn', label: '晨曦' }, { value: 'dusk', label: '暮蓝' }, { value: 'ember', label: '余烬' },
      ], description: '主卡片渐变的配色（仅在未启用照片时生效）。' },
    { key: 'showImage', type: 'toggle', label: '使用照片', default: false,
      description: '用上传照片替换主卡片的渐变（照片自适应填充）。' },
    { key: 'rowCount', type: 'slider', label: '配置项数量', default: 4, min: 0, max: 4, step: 1,
      description: '底部配置明细的条目数量（0 时隐藏整条）。' },
    { key: 'showFooter', type: 'toggle', label: '页脚信息', default: true,
      description: '底部的页脚信息行。' },
  ],
};

export { SlideCoverDawn };
export const META = SlideCoverDawn.META;
export default SlideCoverDawn;
