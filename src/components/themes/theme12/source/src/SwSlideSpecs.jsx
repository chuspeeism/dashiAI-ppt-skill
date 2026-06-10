// SwSlideSpecs.jsx — "规格清单 / Spec Sheet" page.
//
// A technical datasheet: titled groups, each holding label→value rows with
// dotted leaders and monospace values — distinct from the comparison matrix
// (Table) and the before/after Contrast. Group count (2–4), columns (1–2),
// the leader dots and a highlighted "headline" value are props-controlled and
// map 1:1 to `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'specs', index: 29, label: '规格清单 / Spec Sheet' };

export const defaultProps = {
  accent: C.purple,
  groupCount: 4,           // 2–4 spec groups
  columns: 2,              // 1–2 columns
  showLeaders: true,       // dotted leader lines
  showLede: true,
  // —— content ——
  barMeta: '29 — Spec Sheet',
  kicker: '规格清单 / The Fine Print',
  title: '把[[每一条]]都写明白。',
  metaLine: 'SoundWave OS\nSpec · v2.6',
  groups: [
    { g: '结算 / Payout', rows: [
      { k: '到账周期', v: '72 小时' }, { k: '最低提现', v: '¥1' },
      { k: '分账方式', v: '实时多方' }, { k: '币种', v: '12 种' } ] },
    { g: '版权 / Rights', rows: [
      { k: '登记时长', v: '< 5 分钟' }, { k: '全网监测', v: '7×24' },
      { k: '维权响应', v: '一键发起' }, { k: '存证', v: '区块链' } ] },
    { g: '发行 / Distribution', rows: [
      { k: '上线平台', v: '50+' }, { k: '审核时长', v: '当日' },
      { k: '预约发行', v: '支持' }, { k: '下架', v: '即时' } ] },
    { g: '数据 / Insights', rows: [
      { k: '听众画像', v: '实时' }, { k: '数据导出', v: 'CSV / API' },
      { k: '更新频率', v: '每小时' }, { k: '历史留存', v: '永久' } ] },
  ],
  page: '29',
  total: '82',
};

export const controls = [
  { key: 'groupCount', label: '分组数', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '规格分组的数量' },
  { key: 'columns', label: '栏数', type: 'slider', def: 2, min: 1, max: 2, step: 1,
    desc: '分组排布的列数' },
  { key: 'showLeaders', label: '引导点', type: 'toggle', def: true, desc: '显示/隐藏项与值之间的虚线引导' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区说明' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '分组标号 / 重点值 / 页脚强调色' },
];

function Group({ g, accent, idx, leaders, rowCols, dense }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 20, color: '#fff',
          background: accent, borderRadius: 7, padding: '2px 9px' }}>{String(idx + 1).padStart(2, '0')}</span>
        <span style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-.4px' }}>{g.g}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + rowCols + ', 1fr)', columnGap: 40 }}>
        {g.rows.map((r, i) => {
          const lastInCol = i >= g.rows.length - rowCols; // bottom row of each sub-column
          return (
            <div key={r.k} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: (dense ? 5 : 9) + 'px 0',
              borderBottom: lastInCol ? 'none' : '1px solid ' + C.line }}>
              <span style={{ fontSize: 22, color: '#5a4f54', whiteSpace: 'nowrap' }}>{r.k}</span>
              <span style={{ flex: 1, borderBottom: leaders ? '2px dotted ' + C.line2 : 'none',
                transform: 'translateY(-5px)', minWidth: 14 }} />
              <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 23, letterSpacing: '-.5px',
                color: C.ink, whiteSpace: 'nowrap' }}>{r.v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SwSlideSpecs(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.groupCount));
  const cols = Math.max(1, Math.min(2, p.columns));
  const groups = (p.groups || []).slice(0, count);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '38px 48px 40px', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          borderBottom: '2px solid ' + C.line2, paddingBottom: 18, marginBottom: 26 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            {p.showLede && (
              <h2 style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-.8px', marginTop: 12, lineHeight: 1.1 }}>
                {renderSwText(p.title, { hl: { tone: 'p' } })}
              </h2>
            )}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.12em', textTransform: 'uppercase',
            color: C.inkMut, textAlign: 'right' }}>{renderSwText(p.metaLine)}</div>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'grid', columnGap: 64, rowGap: cols === 1 ? 16 : 30,
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', alignContent: 'start' }}>
          {groups.map((g, i) => (
            <Group key={g.g} g={g} accent={accent} idx={i} leaders={p.showLeaders}
              rowCols={cols === 1 ? 2 : 1} dense={cols === 1} />
          ))}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
