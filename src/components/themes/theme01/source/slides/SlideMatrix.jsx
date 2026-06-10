// SlideMatrix.jsx — 表格页 · 能力对比矩阵（公司 × 维度，评分点阵）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；aip- 作用域。
//
// 不同于数值表：每个单元格是一枚 0–3 级的「实心点」评分（●●●○），用填充程度直观
// 表达强弱；行可强调（整行抬升 + 描边发光），列头为维度。底部图例解释点级含义。
// 行数 / 列数 / 评分点显隐 / 高亮行 / 主题色均可调；文本内容在 defaultProps。
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视 · 能力对比',
  tone: 'blue',
  title: '头部玩家 · 能力对比矩阵',
  en: 'Capability Matrix',
  cn: '五个维度，谁是六边形战士',
  // 维度列
  dims: ['模型能力', '算力储备', '商业化', '资本厚度', '生态绑定'],
  // 每行：name 公司、tag 标签、scores 各维度 0–3 分
  rows: [
    { name: 'OpenAI', tag: '通用大模型', scores: [3, 3, 2, 3, 3] },
    { name: 'Anthropic', tag: '通用大模型', scores: [3, 2, 2, 3, 2] },
    { name: 'xAI', tag: '通用大模型', scores: [2, 3, 1, 3, 2] },
    { name: 'CoreWeave', tag: 'AI 基础设施', scores: [1, 3, 3, 2, 3] },
    { name: 'Scale AI', tag: 'AI 基础设施', scores: [1, 1, 3, 2, 3] },
  ],
  legend: ['○ 起步', '◔ 一般', '◑ 较强', '● 领先'],
  // tweakable（通用命名）
  rowCount: 5,
  dimCount: 5,
  highlight: true,
  highlightIndex: 0,
  showScoreNum: false,
  showLegend: true,
  accentColor: '#5b8def',
  showCaption: true,
  caption: '能力矩阵 · OpenAI 维度最均衡，基础设施厂在「算力 + 商业化」单点突出',
};

export const controls = [
  { key: 'rowCount', label: '公司数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 家',
    description: '参与对比的公司（行）数量。' },
  { key: 'dimCount', label: '维度数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 项',
    description: '对比维度（列）数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮某一行（抬升 + 描边发光）。' },
  { key: 'highlightIndex', label: '强调第几行', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的公司序号（0 基）。' },
  { key: 'showScoreNum', label: '数字评分', type: 'boolean', default: false,
    description: '在评分点下方叠加 0–3 数字（关闭则纯点阵）。' },
  { key: 'showLegend', label: '点级图例', type: 'boolean', default: true,
    description: '底部点级含义图例的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '表头、评分点与高亮行的主题色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

// 一枚 0–3 级评分点：用 4 段环形进度（conic）表达填充程度
function Dot({ score, color, big }) {
  const sz = big ? 46 : 40;
  const frac = Math.max(0, Math.min(3, score)) / 3;
  const ring = `conic-gradient(${color} ${frac * 360}deg, ${hexA(color, 0.14)} 0)`;
  const innerSz = sz - (big ? 14 : 12);
  return (
    <div style={{ width: sz, height: sz, borderRadius: '50%', background: ring, display: 'flex',
      alignItems: 'center', justifyContent: 'center', boxShadow: score >= 3 ? `0 6px 16px -4px ${hexA(color, 0.7)}` : 'none' }}>
      <div style={{ width: innerSz, height: innerSz, borderRadius: '50%', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: innerSz - 12, height: innerSz - 12, borderRadius: '50%',
          background: score >= 3 ? color : score === 0 ? 'transparent' : hexA(color, 0.28),
          border: score === 0 ? `2px solid ${hexA(color, 0.3)}` : 'none' }} />
      </div>
    </div>
  );
}

export default function SlideMatrix(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const dc = Math.max(3, Math.min(5, p.dimCount));
  const rc = Math.max(3, Math.min(5, p.rowCount));
  const dims = (p.dims || []).slice(0, dc);
  const rows = (p.rows || []).slice(0, rc);
  const focus = p.highlight ? Math.max(0, Math.min(rows.length - 1, p.highlightIndex)) : -1;

  // 列模板：公司名列宽固定，其余维度均分
  const gridCols = `minmax(320px, 1.4fr) repeat(${dc}, minmax(0, 1fr))`;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.5)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 28, padding: 18, overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* 表头 */}
        <div style={{ flex: '0 0 auto', display: 'grid', gridTemplateColumns: gridCols, height: 76, borderRadius: 16,
          background: `linear-gradient(120deg, ${ac}, ${hexA(ac, 0.82)})`, boxShadow: `0 12px 28px -10px ${hexA(ac, 0.5)}`, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px', fontSize: 24, fontWeight: 800, color: '#fff' }}>公司 · 赛道</div>
          {dims.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              padding: '0 10px', fontSize: 23, fontWeight: 700, color: '#fff', borderLeft: '1px solid rgba(255,255,255,.25)' }}>{d}</div>
          ))}
        </div>

        {/* 行 */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((r, ri) => {
            const isF = ri === focus;
            return (
              <div key={ri} style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center',
                borderRadius: 16, background: isF ? 'rgba(255,255,255,.78)' : 'rgba(255,255,255,.34)',
                border: `1px solid ${isF ? hexA(ac, 0.5) : 'rgba(255,255,255,.5)'}`,
                boxShadow: isF ? `0 18px 40px -22px ${hexA(ac, 0.7)}` : 'none',
                transform: isF ? 'scale(1.012)' : 'none', transition: 'all .3s', position: 'relative', zIndex: isF ? 2 : 1 }}>
                {/* 公司名 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 30px', minWidth: 0 }}>
                  <span style={{ flex: '0 0 auto', width: 42, height: 42, borderRadius: 11, background: isF ? ac : hexA(ac, 0.16),
                    color: isF ? '#fff' : ac, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700 }}>{ri + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.05, whiteSpace: 'nowrap' }}>{r.name}</div>
                    <div style={{ fontSize: 20, color: 'var(--aip-ink-3)', fontWeight: 600, marginTop: 2 }}>{r.tag}</div>
                  </div>
                </div>
                {/* 评分点 */}
                {dims.map((_, di) => {
                  const sc = (r.scores || [])[di] || 0;
                  return (
                    <div key={di} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      borderLeft: '1px solid rgba(43,43,48,.06)' }}>
                      <Dot score={sc} color={ac} big={isF} />
                      {p.showScoreNum && (
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--aip-ink-3)' }}>{sc}/3</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, gap: 24 }}>
        {p.showLegend ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {(p.legend || []).map((l, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 21, color: 'var(--aip-ink-2)', fontWeight: 600 }}>
                <Dot score={i} color={ac} />{l.replace(/^[○◔◑●]\s?/, '')}
              </span>
            ))}
          </div>
        ) : <span />}
        <MonoCaption show={p.showCaption} style={{ marginTop: 0, textAlign: 'right' }}>{p.caption}</MonoCaption>
      </div>
    </SlideFrame>
  );
}
