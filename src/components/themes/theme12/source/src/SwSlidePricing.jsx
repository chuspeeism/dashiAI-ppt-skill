// SwSlidePricing.jsx — "价格 / Plans" page.
//
// Pricing tiers as side-by-side cards (NOT the feature matrix of Compare).
// Plan count (2–4), the promoted "popular" plan, billing period (monthly /
// yearly, which swaps the displayed price), and the feature list are all
// props-controlled and map 1:1 to `controls`. Per the template's no-web-control
// rule there are no real buttons — the plan action reads as a flat label.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'pricing', index: 37, label: '价格 / Plans' };

export const defaultProps = {
  accent: C.orange,
  planCount: 3,            // 2–4
  highlightIndex: 2,       // promoted plan (1-based)
  billing: 'monthly',      // 'monthly' | 'yearly'
  showFeatures: true,
  // —— content ——
  barMeta: '37 — Plans',
  title: '选一个[[起点]]，随成长升级。',
  billMonthly: '按月',
  billYearly: '按年省 25%',
  popularLabel: '推荐 Popular',
  ctaDefault: '免费开始',
  ctaContact: '联系销售',
  customLabel: '定制',
  plans: [
    { cn: '入门', en: 'Starter', m: 0, y: 0, note: '永久免费',
      desc: '适合刚起步的创作者', feats: ['全球 30+ 平台分发', '基础结算面板', '社区支持'] },
    { cn: '专业', en: 'Pro', m: 39, y: 29, note: '按月计费',
      desc: '为认真经营的音乐人', feats: ['一切「入门」功能', '72h 极速到账', '粉丝直连与会员', '版权登记存证'] },
    { cn: '厂牌', en: 'Label', m: 99, y: 79, note: '按月计费',
      desc: '多艺人 · 团队协作', feats: ['一切「专业」功能', '盗用全网监测', '多账号与分润', '专属客户经理'] },
    { cn: '企业', en: 'Enterprise', m: null, y: null, note: '定制报价',
      desc: '平台级集成需求', feats: ['一切「厂牌」功能', '开放 API 接入', 'SLA 与私有部署', '定制结算规则'] },
  ],
  page: '37',
  total: '82',
};

export const controls = [
  { key: 'planCount', label: '方案数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '展示的价格方案数量' },
  { key: 'highlightIndex', label: '推荐方案', type: 'slider', def: 2, min: 1, max: 4, step: 1,
    desc: '被突出为推荐的方案序号（1 起）' },
  { key: 'billing', label: '计费周期', type: 'segment', def: 'monthly',
    options: [{ value: 'monthly', label: '按月' }, { value: 'yearly', label: '按年' }],
    desc: '切换月付 / 年付价格' },
  { key: 'showFeatures', label: '功能清单', type: 'toggle', def: true, desc: '显示/隐藏每个方案的功能清单' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '推荐卡 / 对勾 / 页脚强调色' },
];

export default function SwSlidePricing(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.planCount));
  const hi = Math.max(1, Math.min(count, p.highlightIndex));
  const yearly = p.billing === 'yearly';
  const plans = (p.plans || []).slice(0, count);

  const priceOf = (pl) => {
    const v = yearly ? pl.y : pl.m;
    if (v === null) return { big: p.customLabel, unit: '' };
    if (v === 0) return { big: '¥0', unit: '' };
    return { big: '¥' + v, unit: yearly ? '/月 · 年付' : '/月' };
  };

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        margin: '24px 0 22px', flexShrink: 0 }}>
        <h2 style={{ fontWeight: 900, fontSize: 48, lineHeight: 1.18, letterSpacing: '-1px', maxWidth: 1100 }}>
          {renderSwText(p.title, { hl: { tone: 'o' } })}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.mono,
          fontSize: 22, letterSpacing: '.08em', textTransform: 'uppercase', color: C.inkMut, flexShrink: 0 }}>
          <span style={{ fontWeight: yearly ? 400 : 700, color: yearly ? C.inkMut : C.ink }}>{p.billMonthly}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
          <span style={{ fontWeight: yearly ? 700 : 400, color: yearly ? C.ink : C.inkMut }}>{p.billYearly}</span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid',
        gridTemplateColumns: 'repeat(' + count + ',1fr)', gap: 20, alignItems: 'stretch' }}>
        {plans.map((pl, i) => {
          const on = (i + 1) === hi;
          const pr = priceOf(pl);
          const pal = swCardPalette[i % swCardPalette.length];
          const priceC = on ? accent : pal.bg;
          return (
            <div key={pl.en} style={{ position: 'relative', display: 'flex', flexDirection: 'column',
              borderRadius: 28, padding: on ? '40px 36px 36px' : '36px 34px', overflow: 'hidden',
              background: on ? C.dark : C.paper, color: on ? C.blush : C.ink,
              border: on ? 'none' : '1px solid ' + C.line2,
              transform: on ? 'translateY(-10px)' : 'none', boxShadow: on ? '0 24px 60px rgba(20,15,16,.22)' : 'none' }}>

              <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7,
                background: on ? accent : pal.bg }} />

              {on && (
                <span style={{ position: 'absolute', top: 16, left: 36, fontFamily: F.mono, fontWeight: 700,
                  fontSize: 20, letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff',
                  background: accent, borderRadius: 999, padding: '6px 18px' }}>{p.popularLabel}</span>
              )}

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: on ? 30 : 6 }}>
                <span style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-.5px' }}>{pl.cn}</span>
                <span style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em',
                  textTransform: 'uppercase', color: on ? '#9a8f8c' : C.inkMut }}>{pl.en}</span>
              </div>
              <p style={{ fontSize: 23, color: on ? '#c8c0bd' : '#6a5f64', marginTop: 8 }}>{pl.desc}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 22,
                paddingBottom: 22, borderBottom: '1px solid ' + (on ? C.lineD : C.line) }}>
                <span style={{ fontWeight: 900, fontSize: 62, letterSpacing: '-2px', color: priceC }}>{pr.big}</span>
                <span style={{ fontFamily: F.mono, fontSize: 22, color: on ? '#9a8f8c' : C.inkMut }}>{pr.unit || pl.note}</span>
              </div>

              {p.showFeatures && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
                  {pl.feats.map((f) => (
                    <div key={f} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', alignItems: 'start', gap: 14 }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', marginTop: 2,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: on ? accent : pal.bg, color: on ? '#fff' : pal.title,
                        fontFamily: F.mono, fontWeight: 700, fontSize: 16 }}>✓</span>
                      <span style={{ fontSize: 24, lineHeight: 1.45, color: on ? '#e7ddda' : '#3a3034' }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: 26, display: 'flex', alignItems: 'center', gap: 12,
                fontFamily: F.mono, fontWeight: 700, fontSize: 23, letterSpacing: '.04em',
                color: on ? accent : priceC }}>
                {pl.m === null ? p.ctaContact : p.ctaDefault} <span style={{ fontWeight: 400 }}>↗</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 22 }}>
        <Footer page={p.page} total={p.total} accent={accent} />
      </div>
    </SlideRoot>
  );
}
